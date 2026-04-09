// FCM Remuneration Calculator Engine
import { RATE_MAPPING, applyNewRate } from './rate-mapping-2026.js';

/**
 * Parse a ServiceNow monthly statement workbook
 * @param {Object} workbook - SheetJS workbook object
 * @returns {Object} Parsed statement data
 */
export function parseStatement(workbook) {
  const sheetName = 'Page 1';
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in workbook`);
  }

  // Convert sheet to array of arrays
  const XLSX = typeof window !== 'undefined' ? window.XLSX : require('xlsx');
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // Extract branch info from header rows (typically rows 1-5)
  let branchName = 'Unknown Branch';
  let contractType = 'unknown';
  let period = 'Unknown Period';

  // Look for branch name and period in first few rows
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i];
    const rowText = row.join(' ').toLowerCase();
    
    // Extract branch name (usually in format "Branch: NAME" or "FAD: CODE")
    if (rowText.includes('branch') || rowText.includes('fad')) {
      branchName = row.find(cell => cell && typeof cell === 'string' && cell.length > 3) || branchName;
    }
    
    // Extract period (usually "Period: Mar 2026" or similar)
    if (rowText.includes('period') || rowText.includes('month')) {
      period = row.find(cell => cell && typeof cell === 'string' && /\d{4}/.test(cell)) || period;
    }
  }

  const transactionRows = [];
  const otherPayments = [];
  const deductions = [];

  // Parse data rows (skip headers, usually start around row 10)
  let dataStartRow = -1;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    // Look for header row with "Sales Ref" or "Contract Type"
    if (row.some(cell => typeof cell === 'string' && 
        (cell.toLowerCase().includes('sales ref') || cell.toLowerCase().includes('contract')))) {
      dataStartRow = i + 1;
      break;
    }
  }

  if (dataStartRow === -1) {
    // Fallback: assume data starts at row 10
    dataStartRow = 10;
  }

  for (let i = dataStartRow; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows
    if (!row || row.length < 22) continue;
    
    const contractTypeRaw = row[5]; // Column F (index 5)
    const remunerationType = row[11]; // Column L (index 11)
    const salesRefRaw = row[15]; // Column P (index 15)
    const amountExcVAT = row[19]; // Column T (index 19)
    const salesValue = row[21]; // Column V (index 21)

    // Skip if no sales ref
    if (!salesRefRaw) continue;

    // Parse values
    const salesRef = parseInt(salesRefRaw);
    if (isNaN(salesRef)) continue;

    // Parse contract type
    if (contractTypeRaw === 'AR') contractType = 'mains';
    else if (contractTypeRaw === 'LC' || contractTypeRaw === 'LL') contractType = 'local';
    else if (contractTypeRaw === 'SP') contractType = 'spso';

    // Handle empty strings and "None" as zero
    const parseValue = (val) => {
      if (val === '' || val === 'None' || val === null || val === undefined) return 0;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const amount = parseValue(amountExcVAT);
    const sales = parseValue(salesValue);

    const rowData = {
      salesRef,
      name: RATE_MAPPING[salesRef]?.name || `Ref ${salesRef}`,
      category: RATE_MAPPING[salesRef]?.category || 'Unknown',
      oldAmount: amount,
      salesValue: sales,
      remunerationType: remunerationType || 'Transactions'
    };

    // Categorize by remuneration type
    if (remunerationType === 'Deductions') {
      deductions.push(rowData);
    } else if (remunerationType === 'Other payments') {
      otherPayments.push(rowData);
    } else {
      transactionRows.push(rowData);
    }
  }

  return {
    branch: {
      name: branchName,
      contractType,
      period
    },
    transactionRows,
    otherPayments,
    deductions
  };
}

/**
 * Calculate new rates for all transaction rows
 * @param {Object} parsed - Output from parseStatement
 * @param {Object} options - Calculation options
 * @returns {Object} Full calculation results
 */
export function calculateNewRates(parsed, options = {}) {
  const {
    applyMBSP = false,
    applyRSP = false,
    resellerPct = 0.33 // Default 33% reseller mix for bill payments
  } = options;

  const { branch, transactionRows, otherPayments, deductions } = parsed;
  const { contractType } = branch;

  let variableOldTotal = 0;
  let variableNewTotal = 0;
  let fixedOldTotal = 0;
  let fixedNewTotal = 0;

  const categoryTotals = {};
  const processedRows = [];
  const uncertainRows = [];

  // Process each transaction row
  for (const row of transactionRows) {
    const { salesRef, name, category, oldAmount, salesValue } = row;
    
    let newAmount = 0;
    let isUncertain = false;
    let uncertainNote = null;

    // Edge case: Postal Orders (ref 1575)
    if (salesRef === 1575) {
      newAmount = oldAmount; // Hold at old value
      isUncertain = true;
      uncertainNote = 'Postal Order rates changed to 50% of customer fee. Average uplift ~96% but cannot calculate from txn count alone. Held at old value.';
    }
    // Edge case: Bill payments (refs 571-575) - blended rate
    else if ([571, 572, 573, 574, 575].includes(salesRef)) {
      const blendedRate = resellerPct * 0.20 + (1 - resellerPct) * 0.09;
      newAmount = salesValue * blendedRate;
    }
    // Edge case: OEI (names containing 'excellence')
    else if (name.toLowerCase().includes('excellence')) {
      const baseNew = applyNewRate(salesRef, salesValue);
      newAmount = baseNew ? baseNew * 1.20 : oldAmount * 1.20;
    }
    // Edge case: Monthly Top Up (refs 1440/1441) - discontinued
    else if ([1440, 1441].includes(salesRef)) {
      newAmount = 0;
    }
    // Edge case: MI-only rows (refs 772/773/790) - zero amount
    else if ([772, 773, 790].includes(salesRef)) {
      newAmount = 0;
    }
    // Normal calculation
    else {
      const calculated = applyNewRate(salesRef, salesValue);
      if (calculated === null) {
        isUncertain = true;
        uncertainNote = RATE_MAPPING[salesRef]?.notes || 'Cannot calculate - rate mapping uncertain';
        newAmount = oldAmount; // Hold at old value
      } else {
        newAmount = calculated;
      }
    }

    const delta = newAmount - oldAmount;
    const deltaPercent = oldAmount !== 0 ? (delta / Math.abs(oldAmount)) * 100 : 0;

    const processedRow = {
      ...row,
      newAmount,
      delta,
      deltaPercent,
      isUncertain,
      uncertainNote
    };

    processedRows.push(processedRow);

    if (isUncertain) {
      uncertainRows.push(processedRow);
    }

    // Accumulate totals
    // Determine if variable or fixed (OEI, back book payments, and structural adjustments are variable)
    const isVariable = !['Back Book Payments', 'Discontinued', 'MI Only'].includes(category);
    
    if (isVariable) {
      variableOldTotal += oldAmount;
      variableNewTotal += newAmount;
    } else {
      fixedOldTotal += oldAmount;
      fixedNewTotal += newAmount;
    }

    // Category rollup
    if (!categoryTotals[category]) {
      categoryTotals[category] = { oldTotal: 0, newTotal: 0, delta: 0 };
    }
    categoryTotals[category].oldTotal += oldAmount;
    categoryTotals[category].newTotal += newAmount;
    categoryTotals[category].delta += delta;
  }

  // Apply structural adjustments
  const adjustments = [];

  // 4% Mains top-up (temporary until Apr 2027)
  if (contractType === 'mains') {
    const mainsTopUp = variableNewTotal * 0.04;
    adjustments.push({
      name: '4% Mains Variable Top-Up (temporary)',
      amount: mainsTopUp,
      note: 'Applies until April 2027'
    });
    variableNewTotal += mainsTopUp;
  }

  // MBSP: 4% of variable (mains/local only)
  if (applyMBSP && (contractType === 'mains' || contractType === 'local')) {
    const mbspAmount = variableNewTotal * 0.04;
    adjustments.push({
      name: 'MBSP (4% of variable)',
      amount: mbspAmount,
      note: 'Optional Member Branch Support Payment'
    });
    variableNewTotal += mbspAmount;
  }

  // RSP: £416.67/month (mains/local only)
  if (applyRSP && (contractType === 'mains' || contractType === 'local')) {
    const rspAmount = 416.67;
    adjustments.push({
      name: 'RSP (Rural Support Payment)',
      amount: rspAmount,
      note: 'Optional £416.67/month'
    });
    fixedNewTotal += rspAmount; // RSP is fixed
  }

  // Calculate totals
  const oldSubtotal = variableOldTotal + fixedOldTotal + otherPayments.reduce((sum, r) => sum + r.oldAmount, 0);
  const newSubtotal = variableNewTotal + fixedNewTotal + otherPayments.reduce((sum, r) => sum + r.oldAmount, 0); // Other payments unchanged
  const netDelta = newSubtotal - oldSubtotal;
  const netDeltaPercent = oldSubtotal !== 0 ? (netDelta / oldSubtotal) * 100 : 0;

  // Top movers (sorted by absolute delta)
  const topMovers = [...processedRows]
    .filter(r => Math.abs(r.delta) > 0.01) // Filter out negligible changes
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 10);

  return {
    branch,
    processedRows,
    uncertainRows,
    categoryTotals,
    adjustments,
    summary: {
      variableOld: variableOldTotal,
      variableNew: variableNewTotal,
      fixedOld: fixedOldTotal,
      fixedNew: fixedNewTotal,
      oldSubtotal,
      newSubtotal,
      netDelta,
      netDeltaPercent
    },
    topMovers,
    otherPayments,
    deductions
  };
}
