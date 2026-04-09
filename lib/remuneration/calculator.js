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

  // Extract branch info from first data row (row 1)
  let branchName = 'Your Branch';
  let contractType = 'unknown';
  let period = 'Unknown Period';
  let fadCode = '';

  if (data.length > 1) {
    const firstRow = data[1];
    // Column A (0) = Period e.g. "202512"
    // Column C (2) = FAD code
    // Column D (3) = Branch name
    // Column F (5) = Contract type
    if (firstRow[0]) {
      const p = String(firstRow[0]);
      if (p.length === 6) {
        const yr = p.substring(0, 4);
        const mo = p.substring(4, 6);
        const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        period = months[parseInt(mo)] + ' ' + yr + ' accounting period';
      } else {
        period = p;
      }
    }
    if (firstRow[3]) branchName = String(firstRow[3]);
    if (firstRow[2]) fadCode = String(firstRow[2]);
    const ct = String(firstRow[5] || '').trim().toUpperCase();
    if (ct === 'AR') contractType = 'mains';
    else if (ct === 'LC' || ct === 'LL') contractType = 'local';
    else if (ct === 'SP') contractType = 'spso';
  }

  const transactionRows = [];
  const otherPayments = [];
  const deductions = [];

  // Parse data rows — Row 0 is headers, data starts at row 1
  // The ServiceNow format has: Period, Agent number, FAD, Branch name, Name, Contract type...
  let dataStartRow = 1; // Default: headers at row 0, data at row 1
  
  // Verify by checking if row 0 looks like a header
  if (data[0] && typeof data[0][0] === 'string' && data[0][0].toLowerCase().includes('period')) {
    dataStartRow = 1;
  } else {
    // Search for header row
    for (let i = 0; i < Math.min(10, data.length); i++) {
      const row = data[i];
      if (row && row.some(cell => typeof cell === 'string' && 
          (cell.toLowerCase().includes('sales ref') || cell.toLowerCase() === 'period'))) {
        dataStartRow = i + 1;
        break;
      }
    }
  }

  for (let i = dataStartRow; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows
    if (!row || row.length < 22) continue;
    
    const contractTypeRaw = row[5]; // Column F (index 5)
    const remunerationType = row[11]; // Column L (index 11)
    const categoryRaw = row[12]; // Column M (index 12) - Category
    const salesRefName = row[14]; // Column O (index 14) - Sales reference name
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
      name: salesRefName || RATE_MAPPING[salesRef]?.name || `Ref ${salesRef}`,
      category: categoryRaw || RATE_MAPPING[salesRef]?.category || 'Unknown',
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
    // Edge case: Monthly Top Up (refs 1440/1441) - discontinued (usually in Other payments, but handle here too)
    else if ([1440, 1441].includes(salesRef)) {
      newAmount = 0;
    }
    // Edge case: MI-only rows (refs 772/773/790) - zero amount
    else if ([772, 773, 790].includes(salesRef)) {
      newAmount = 0;
    }
    // Normal calculation
    else {
      const entry = RATE_MAPPING[salesRef];
      if (!entry) {
        // Rate not in mapping — unchanged, keep old amount
        newAmount = oldAmount;
      } else if (entry.calc_type === 'uncertain') {
        // Rate exists but can't be computed
        isUncertain = true;
        uncertainNote = entry.notes || 'Cannot calculate — rate mapping uncertain';
        newAmount = oldAmount;
      } else {
        // Rate changed — apply new rate
        newAmount = applyNewRate(salesRef, salesValue) ?? oldAmount;
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

  // Process other payments (OEI, Monthly Top Up, DMB, etc.)
  let otherOldTotal = 0;
  let otherNewTotal = 0;
  const processedOtherPayments = otherPayments.map(op => {
    let newAmount = op.oldAmount;
    let note = 'Unchanged';
    const nameLC = (op.name || '').toLowerCase();
    
    if (op.salesRef === 1440 || op.salesRef === 1441 || nameLC.includes('monthly top up')) {
      newAmount = 0;
      note = 'Discontinued — replaced by 4% Mains top-up';
    } else if (nameLC.includes('excellence')) {
      newAmount = op.oldAmount * 1.20;
      note = 'OEI scaled 5%→6% ceiling (assuming same performance)';
    }
    
    otherOldTotal += op.oldAmount;
    otherNewTotal += newAmount;
    return { ...op, newAmount, delta: newAmount - op.oldAmount, note };
  });

  // Process deductions (pass through unchanged)
  const deductionsTotal = deductions.reduce((sum, d) => sum + d.oldAmount, 0);

  // Calculate totals
  const oldSubtotal = variableOldTotal + fixedOldTotal + otherOldTotal + deductionsTotal;
  const newSubtotal = variableNewTotal + fixedNewTotal + otherNewTotal + deductionsTotal;
  const netDelta = newSubtotal - oldSubtotal;
  const netDeltaPercent = oldSubtotal !== 0 ? (netDelta / Math.abs(oldSubtotal)) * 100 : 0;

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
      otherOld: otherOldTotal,
      otherNew: otherNewTotal,
      deductionsTotal,
      mainsTopup: adjustments.find(a => a.name.includes('Mains'))?.amount || 0,
      mbspAmount: adjustments.find(a => a.name.includes('MBSP'))?.amount || 0,
      rspAmount: adjustments.find(a => a.name.includes('RSP'))?.amount || 0,
      oldSubtotal,
      newSubtotal,
      netDelta,
      netDeltaPercent
    },
    topMovers,
    otherPayments: processedOtherPayments,
    deductions,
    deductionsTotal
  };
}
