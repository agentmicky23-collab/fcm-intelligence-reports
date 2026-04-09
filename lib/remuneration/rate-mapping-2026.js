// FCM Remuneration Rate Mapping 2026/27
// Source: Post Office Ltd rate schedule effective 30 March 2026

export const RATE_MAPPING = {
  431: {
    name: "Airmail Sale & Accept",
    category: "Mail — Ordinary overseas",
    old_display: "10%",
    new_display: "11.5%",
    calc_type: "pct_of_sales",
    new_value: 0.115,
    basis: "£ sales value",
    notes: "Caught up to 50% income-share floor"
  },
  432: {
    name: "Surface Mail Sale & Accept",
    category: "Mail — Ordinary overseas",
    old_display: "8%",
    new_display: "11.5%",
    calc_type: "pct_of_sales",
    new_value: 0.115,
    basis: "£ sales value",
    notes: "Caught up to 50% floor (+44%)"
  },
  412: {
    name: "Redirection Social",
    category: "Mail — Other RM",
    old_display: "8%",
    new_display: "11.5%",
    calc_type: "pct_of_sales",
    new_value: 0.115,
    basis: "£ sales value",
    notes: "Caught up to 50% floor (+44%)"
  },
  413: {
    name: "Redirection Business",
    category: "Mail — Other RM",
    old_display: "8%",
    new_display: "11.5%",
    calc_type: "pct_of_sales",
    new_value: 0.115,
    basis: "£ sales value",
    notes: "Caught up to 50% floor (+44%)"
  },
  1150: {
    name: "Evri Domestic Next Day",
    category: "Mail — Non-RM",
    old_display: "15%",
    new_display: "20%",
    calc_type: "pct_of_sales",
    new_value: 0.2,
    basis: "£ sales value",
    notes: "+33%"
  },
  1151: {
    name: "Evri Domestic Standard",
    category: "Mail — Non-RM",
    old_display: "12.5%",
    new_display: "18%",
    calc_type: "pct_of_sales",
    new_value: 0.18,
    basis: "£ sales value",
    notes: "+44%"
  },
  1152: {
    name: "Evri International Standard",
    category: "Mail — Non-RM",
    old_display: "12%",
    new_display: "15%",
    calc_type: "pct_of_sales",
    new_value: 0.15,
    basis: "£ sales value",
    notes: "+25%"
  },
  1153: {
    name: "Evri International Priority",
    category: "Mail — Non-RM",
    old_display: "13%",
    new_display: "16%",
    calc_type: "pct_of_sales",
    new_value: 0.16,
    basis: "£ sales value",
    notes: "+23%"
  },
  1613: {
    name: "Evri Buy-In-Branch Domestic",
    category: "Mail — Non-RM",
    old_display: "—",
    new_display: "20p/parcel",
    calc_type: "flat_per_txn",
    new_value: 0.2,
    basis: "count",
    notes: "NEW — buy-in-branch product"
  },
  1612: {
    name: "Evri Buy-In-Branch International",
    category: "Mail — Non-RM",
    old_display: "—",
    new_display: "£1.00/parcel",
    calc_type: "flat_per_txn",
    new_value: 1.0,
    basis: "count",
    notes: "NEW — buy-in-branch product"
  },
  310: {
    name: "Auto Cash Withdrawals (Personal)",
    category: "Banking — withdrawals",
    old_display: "25.5p",
    new_display: "26.5p",
    calc_type: "flat_per_txn",
    new_value: 0.265,
    basis: "count",
    notes: "+4%"
  },
  911: {
    name: "Cash Withdrawals over £500",
    category: "Banking — withdrawals",
    old_display: "0.065%",
    new_display: "0.08%",
    calc_type: "pct_of_sales",
    new_value: 0.0008,
    basis: "£ sales value",
    notes: "+23%. Statement shows as per-£100 but decimal works direct on value"
  },
  294: {
    name: "Business Change Giving (Value)",
    category: "Banking — withdrawals",
    old_display: "0.7% (£0.70/£100)",
    new_display: "1.1% (£1.10/£100)",
    calc_type: "pct_of_sales",
    new_value: 0.011,
    basis: "£ sales value",
    notes: "+57%"
  },
  910: {
    name: "Counter Balance Enquiry",
    category: "Banking — withdrawals",
    old_display: "5p",
    new_display: "7p",
    calc_type: "flat_per_txn",
    new_value: 0.07,
    basis: "count",
    notes: "+40%"
  },
  912: {
    name: "Failed Counter Balance Enquiry",
    category: "Banking — withdrawals",
    old_display: "3p",
    new_display: "7p",
    calc_type: "flat_per_txn",
    new_value: 0.07,
    basis: "count",
    notes: "+133%"
  },
  913: {
    name: "Failed Cash Withdrawals",
    category: "Banking — withdrawals",
    old_display: "5p",
    new_display: "12p",
    calc_type: "flat_per_txn",
    new_value: 0.12,
    basis: "count",
    notes: "+140%"
  },
  890: {
    name: "Bank of England Note Exchange",
    category: "Banking — withdrawals",
    old_display: "£2.25",
    new_display: "£3.60",
    calc_type: "flat_per_txn",
    new_value: 3.6,
    basis: "count",
    notes: "+60%"
  },
  320: {
    name: "Auto Cash Deposits (BB&PB)",
    category: "Banking — deposits",
    old_display: "38p",
    new_display: "52p",
    calc_type: "flat_per_txn",
    new_value: 0.52,
    basis: "count",
    notes: "+37%. Biggest single mover on most statements"
  },
  870: {
    name: "Prepaid Debitcard Deposit",
    category: "Banking — deposits",
    old_display: "38p",
    new_display: "52p",
    calc_type: "flat_per_txn",
    new_value: 0.52,
    basis: "count",
    notes: "+37%"
  },
  340: {
    name: "Manual Cash Deposits",
    category: "Banking — deposits",
    old_display: "53p",
    new_display: "£1.31",
    calc_type: "flat_per_txn",
    new_value: 1.31,
    basis: "count",
    notes: "+147%. Massive uplift for branches with SME customers"
  },
  1630: {
    name: "Failed Cash Deposits (Bank Decision)",
    category: "Banking — deposits",
    old_display: "13p",
    new_display: "52p",
    calc_type: "flat_per_txn",
    new_value: 0.52,
    basis: "count",
    notes: "+300%. Only when bank declines. Max 2/day per customer card. Customer-aborted still 13p."
  },
  571: {
    name: "Bill Paym't 1-Post Pay (Util)",
    category: "Bill Payments",
    old_display: "8.25p",
    new_display: "9p (util) / 20p (reseller)",
    calc_type: "flat_per_txn",
    new_value: 0.09,
    basis: "count",
    notes: "SPLIT: new scheme separates util (9p) from reseller (20p). Default to util. Real split requires per-client data."
  },
  572: {
    name: "Bill Paym't 2 Pre-Pay (Util)",
    category: "Bill Payments",
    old_display: "7p",
    new_display: "9p (util) / 20p (reseller)",
    calc_type: "flat_per_txn",
    new_value: 0.09,
    basis: "count",
    notes: "SPLIT — see 571"
  },
  573: {
    name: "Bill Paym't 3-Post Pay (Util)",
    category: "Bill Payments",
    old_display: "8.25p",
    new_display: "9p (util) / 20p (reseller)",
    calc_type: "flat_per_txn",
    new_value: 0.09,
    basis: "count",
    notes: "SPLIT — see 571"
  },
  574: {
    name: "PS BillPaym't 1 Post-Pay (Util)",
    category: "Bill Payments",
    old_display: "8.25p",
    new_display: "9p (util) / 20p (reseller)",
    calc_type: "flat_per_txn",
    new_value: 0.09,
    basis: "count",
    notes: "SPLIT — see 571"
  },
  575: {
    name: "PS Bill Paym't 2 Pre-Pay (Util)",
    category: "Bill Payments",
    old_display: "7p",
    new_display: "9p (util) / 20p (reseller)",
    calc_type: "flat_per_txn",
    new_value: 0.09,
    basis: "count",
    notes: "SPLIT — see 571"
  },
  1897: {
    name: "Santander AP Fee",
    category: "Bill Payments",
    old_display: "4p",
    new_display: "20p",
    calc_type: "flat_per_txn",
    new_value: 0.2,
    basis: "count",
    notes: "+400%. This is a reseller under new scheme"
  },
  1536: {
    name: "Travel Money — On Demand",
    category: "Travel",
    old_display: "1.25% (£1.25/£100)",
    new_display: "1.5% (£1.50/£100)",
    calc_type: "pct_of_sales",
    new_value: 0.015,
    basis: "£ sales value",
    notes: "+20%. 60% of travel money remuneration."
  },
  1896: {
    name: "Travel Money — Discounted",
    category: "Travel",
    old_display: "0.9% (£0.90/£100)",
    new_display: "1.1% (£1.10/£100)",
    calc_type: "pct_of_sales",
    new_value: 0.011,
    basis: "£ sales value",
    notes: "+22%"
  },
  1595: {
    name: "Travel MoneyCard — Branch TopUp",
    category: "Travel",
    old_display: "1.25%",
    new_display: "1.5%",
    calc_type: "pct_of_sales",
    new_value: 0.015,
    basis: "£ sales value",
    notes: "+20%"
  },
  1759: {
    name: "Travel MoneyCard — Direct TopUp",
    category: "Travel",
    old_display: "1.25%",
    new_display: "1.0%",
    calc_type: "pct_of_sales",
    new_value: 0.01,
    basis: "£ sales value",
    notes: "−20%. DECREASE. Online top-ups of in-branch-opened cards."
  },
  1594: {
    name: "Travel Money Card — Sign-Up",
    category: "Travel",
    old_display: "40p",
    new_display: "£5.00",
    calc_type: "flat_per_txn",
    new_value: 5.0,
    basis: "count",
    notes: "+1,150%. TRIAL RATE — POL will review after 12 months. Flag this."
  },
  221: {
    name: "Travel Money — C&C to Pre-Order",
    category: "Travel",
    old_display: "£2.50",
    new_display: "£3.25",
    calc_type: "flat_per_txn",
    new_value: 3.25,
    basis: "count",
    notes: "+30%"
  },
  291: {
    name: "Travel Money — C&C (value-based)",
    category: "Travel",
    old_display: "1.25%",
    new_display: "£3.75/txn (now volume-based)",
    calc_type: "uncertain",
    new_value: null,
    basis: "mixed",
    notes: "DISCONTINUED as value-based. Branches able to fulfil now get £3.75/txn (ref 1634). Likely DECREASE for most. Requires re-mapping 291→1634."
  },
  220: {
    name: "Travel Money — Branch Pre-Order (volume)",
    category: "Travel",
    old_display: "£2.50/txn",
    new_display: "(discontinued — now 1.5% value on ref 1631)",
    calc_type: "uncertain",
    new_value: null,
    basis: "mixed",
    notes: "DISCONTINUED as volume. New line is 1631 at 1.5% of value. Statement will need re-mapping."
  },
  1575: {
    name: "Postal Order Sales",
    category: "Money Transfer",
    old_display: "£1.15/txn",
    new_display: "50% of customer fee value",
    calc_type: "uncertain",
    new_value: 0.5,
    basis: "£ of customer fee",
    notes: "CANNOT COMPUTE from transaction count alone. Statement 'Sales' column shows txn count not fee value. Needs user input or POL avg fee assumption (avg ~96% uplift per POL commentary)."
  },
  1576: {
    name: "Postal Order Encashment",
    category: "Money Transfer",
    old_display: "12p",
    new_display: "23p",
    calc_type: "flat_per_txn",
    new_value: 0.23,
    basis: "count",
    notes: "+92%"
  },
  1577: {
    name: "Postal Order Refund",
    category: "Money Transfer",
    old_display: "6p",
    new_display: "12p",
    calc_type: "flat_per_txn",
    new_value: 0.12,
    basis: "count",
    notes: "+100%"
  },
  810: {
    name: "Passport Tablet Type 1",
    category: "Government & Identity",
    old_display: "£5.00",
    new_display: "£6.00",
    calc_type: "flat_per_txn",
    new_value: 6.0,
    basis: "count",
    notes: "+20%"
  },
  811: {
    name: "Passport Tablet Type 2",
    category: "Government & Identity",
    old_display: "£7.00",
    new_display: "£7.50",
    calc_type: "flat_per_txn",
    new_value: 7.5,
    basis: "count",
    notes: "+7%"
  },
  528: {
    name: "UK Passport Check & Send",
    category: "Government & Identity",
    old_display: "£3.85",
    new_display: "£4.60",
    calc_type: "flat_per_txn",
    new_value: 4.6,
    basis: "count",
    notes: "+19%"
  },
  948: {
    name: "Irish Passport Acceptance",
    category: "Government & Identity",
    old_display: "£3.85",
    new_display: "£4.60",
    calc_type: "flat_per_txn",
    new_value: 4.6,
    basis: "count",
    notes: "+19%"
  },
  621: {
    name: "DVLA 10-Year Renewal (Tablet)",
    category: "Government & Identity",
    old_display: "£4.96",
    new_display: "£5.37",
    calc_type: "flat_per_txn",
    new_value: 5.37,
    basis: "count",
    notes: "+8%"
  },
  865: {
    name: "DVLA Barcode",
    category: "Government & Identity",
    old_display: "86p",
    new_display: "93p",
    calc_type: "flat_per_txn",
    new_value: 0.93,
    basis: "count",
    notes: "+8%. MERGED: 0865 and 0119 now combined under 0119 'DVLA Barcode & Non-Barcode'"
  },
  119: {
    name: "DVLA Non-Barcode",
    category: "Government & Identity",
    old_display: "86p",
    new_display: "93p",
    calc_type: "flat_per_txn",
    new_value: 0.93,
    basis: "count",
    notes: "+8%. Now combined with 0865 under 0119"
  },
  1819: {
    name: "DVLA Extended Services",
    category: "Government & Identity",
    old_display: "88p",
    new_display: "95p",
    calc_type: "flat_per_txn",
    new_value: 0.95,
    basis: "count",
    notes: "+8%. MERGED: 1819 and 1876 now combined under 1819 'DVLA Extended Services & Direct Debit'"
  },
  1876: {
    name: "DVLA Direct Debit",
    category: "Government & Identity",
    old_display: "88p",
    new_display: "95p",
    calc_type: "flat_per_txn",
    new_value: 0.95,
    basis: "count",
    notes: "+8%. Now combined with 1819"
  },
  473: {
    name: "Statutory Off-Road Notification (SORN)",
    category: "Government & Identity",
    old_display: "30p",
    new_display: "33p",
    calc_type: "flat_per_txn",
    new_value: 0.33,
    basis: "count",
    notes: "+10%"
  },
  950: {
    name: "Manual ID Verify (Document Certification)",
    category: "Government & Identity",
    old_display: "24%",
    new_display: "50%",
    calc_type: "pct_of_sales",
    new_value: 0.5,
    basis: "£ sales value",
    notes: "+108%"
  },
  1400: {
    name: "Savings Online ID Verify",
    category: "Government & Identity",
    old_display: "£3.06",
    new_display: "£6.38",
    calc_type: "flat_per_txn",
    new_value: 6.38,
    basis: "count",
    notes: "+108%"
  },
  1426: {
    name: "Savings Branch ID Verify",
    category: "Government & Identity",
    old_display: "£3.06",
    new_display: "£6.38",
    calc_type: "flat_per_txn",
    new_value: 6.38,
    basis: "count",
    notes: "+108%"
  },
  1692: {
    name: "Other Gift Cards",
    category: "Payment services",
    old_display: "3.5%",
    new_display: "4.0%",
    calc_type: "pct_of_sales",
    new_value: 0.04,
    basis: "£ sales value",
    notes: "+14%. Apple moves FROM other INTO Amazon category (both now 2.5%)"
  },
  601: {
    name: "LA — Council Tax Bills",
    category: "Bill Payments",
    old_display: "10p",
    new_display: "27p",
    calc_type: "flat_per_txn",
    new_value: 0.27,
    basis: "count",
    notes: "+170%. Now combined under ref 1621 'Local Government Payment'"
  },
  602: {
    name: "LA — Sundry Debt Payments",
    category: "Bill Payments",
    old_display: "8.5p",
    new_display: "27p",
    calc_type: "flat_per_txn",
    new_value: 0.27,
    basis: "count",
    notes: "+218%. Now combined under ref 1621"
  },
  1777: {
    name: "LA — Parking Fines",
    category: "Bill Payments",
    old_display: "25p",
    new_display: "27p",
    calc_type: "flat_per_txn",
    new_value: 0.27,
    basis: "count",
    notes: "+8%. Now combined under ref 1621"
  },
  1793: {
    name: "TFL ID Verification",
    category: "Bill Payments",
    old_display: "50p",
    new_display: "£1.30",
    calc_type: "flat_per_txn",
    new_value: 1.3,
    basis: "count",
    notes: "+160%. Now combined under ref 1622 'Transport & Ticketing'"
  },
  1534: {
    name: "TFL Oystercards",
    category: "Bill Payments",
    old_display: "50p",
    new_display: "£1.30",
    calc_type: "flat_per_txn",
    new_value: 1.3,
    basis: "count",
    notes: "+160%. Now under 1622"
  },
  110: {
    name: "TFL Public Carriage Application",
    category: "Bill Payments",
    old_display: "£1.20",
    new_display: "£1.30",
    calc_type: "flat_per_txn",
    new_value: 1.3,
    basis: "count",
    notes: "+8%. Now under 1622"
  },
  1555: {
    name: "Scottish National Travel",
    category: "Bill Payments",
    old_display: "50p",
    new_display: "£1.30",
    calc_type: "flat_per_txn",
    new_value: 1.3,
    basis: "count",
    notes: "+160%. Now under 1622"
  },
  8405: {
    name: "Strathclyde PT Travel",
    category: "Bill Payments",
    old_display: "50p",
    new_display: "£1.30",
    calc_type: "flat_per_txn",
    new_value: 1.3,
    basis: "count",
    notes: "+160%. Now under 1622"
  },
  1848: {
    name: "Instant Saver — Balance (No Cap)",
    category: "Back Book Payments",
    old_display: "0.0084%/mo (10p/£100/yr)",
    new_display: "0.0126%/mo (15p/£100/yr)",
    calc_type: "pct_of_sales",
    new_value: 0.000126,
    basis: "£ balance",
    notes: "+50%. Recurring monthly on customer balance. Negative rows = customer withdrawals, scale proportionally."
  },
  1850: {
    name: "Reward Saver — Balance (No Cap)",
    category: "Back Book Payments",
    old_display: "0.0084%/mo",
    new_display: "0.0126%/mo",
    calc_type: "pct_of_sales",
    new_value: 0.000126,
    basis: "£ balance",
    notes: "+50%"
  },
  1857: {
    name: "PO Cash ISA Back Book",
    category: "Back Book Payments",
    old_display: "0.0084%/mo",
    new_display: "0.0126%/mo",
    calc_type: "pct_of_sales",
    new_value: 0.000126,
    basis: "£ balance",
    notes: "+50%. Only from 2nd year onwards."
  },
  1856: {
    name: "PO Growth Bond Back Book",
    category: "Back Book Payments",
    old_display: "0.0084%/mo",
    new_display: "0.0126%/mo",
    calc_type: "pct_of_sales",
    new_value: 0.000126,
    basis: "£ balance",
    notes: "+50%"
  },
  1860: {
    name: "PO Fixed ISA Back Book",
    category: "Back Book Payments",
    old_display: "0.0084%/mo",
    new_display: "0.0126%/mo",
    calc_type: "pct_of_sales",
    new_value: 0.000126,
    basis: "£ balance",
    notes: "+50%"
  },
  1645: {
    name: "Savings New Account Opened",
    category: "Financial Products",
    old_display: "—",
    new_display: "£8/account",
    calc_type: "flat_per_txn",
    new_value: 8.0,
    basis: "count",
    notes: "NEW. £8 per opened & funded account. Not in pre-April statements."
  },
  // MI-only rows that should be ignored (zero amount)
  772: {
    name: "MI Only - Banking Data",
    category: "MI Only",
    old_display: "—",
    new_display: "—",
    calc_type: "flat_per_txn",
    new_value: 0,
    basis: "count",
    notes: "Management information only. No remuneration."
  },
  773: {
    name: "MI Only - Transaction Data",
    category: "MI Only",
    old_display: "—",
    new_display: "—",
    calc_type: "flat_per_txn",
    new_value: 0,
    basis: "count",
    notes: "Management information only. No remuneration."
  },
  790: {
    name: "MI Only - Service Data",
    category: "MI Only",
    old_display: "—",
    new_display: "—",
    calc_type: "flat_per_txn",
    new_value: 0,
    basis: "count",
    notes: "Management information only. No remuneration."
  },
  // Discontinued products
  1440: {
    name: "Monthly Top Up",
    category: "Discontinued",
    old_display: "£X/mo",
    new_display: "£0 (discontinued)",
    calc_type: "flat_per_txn",
    new_value: 0,
    basis: "count",
    notes: "Discontinued from 30 March 2026. Zero out."
  },
  1441: {
    name: "Monthly Top Up (Alternative)",
    category: "Discontinued",
    old_display: "£X/mo",
    new_display: "£0 (discontinued)",
    calc_type: "flat_per_txn",
    new_value: 0,
    basis: "count",
    notes: "Discontinued from 30 March 2026. Zero out."
  }
};

/**
 * Apply new rate to a transaction
 * @param {number} ref - Sales reference number
 * @param {number} salesValue - Transaction count or £ value from statement
 * @returns {number|null} New remuneration amount, or null if uncertain
 */
export function applyNewRate(ref, salesValue) {
  const mapping = RATE_MAPPING[ref];
  
  if (!mapping) {
    // No mapping found - return null to indicate uncertainty
    return null;
  }

  const { calc_type, new_value } = mapping;

  switch (calc_type) {
    case 'flat_per_txn':
      return salesValue * new_value;
    
    case 'pct_of_sales':
      return salesValue * new_value;
    
    case 'uncertain':
      // Cannot calculate - needs manual intervention
      return null;
    
    default:
      return null;
  }
}
