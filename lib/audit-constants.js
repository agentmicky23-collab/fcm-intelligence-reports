// FCM Insurance Audit — Question Labels and Gap Patterns
// This file defines the human-readable labels and gap detection logic

// ═══════════════════════════════════════════════════════════════════════════════
// APPENDIX A — QUESTION_LABELS and VALUE_LABELS
// ═══════════════════════════════════════════════════════════════════════════════

export const QUESTION_LABELS = {
  branch_type: "Branch Type",
  branch_count: "Number of Branches",
  cover_type: "Current Insurance Provider Type",
  premium: "Annual Premium Range",
  atm: "ATM Location",
  rem_frequency: "Cash Collection Frequency",
  counter_config: "Counter Security Configuration",
  lone_working: "Lone Working Arrangement",
  contents: "Contents Cover Limit",
  accidental: "Accidental Damage Cover",
  cash_counter: "Counter Cash Limit",
  cash_safe: "Safe Cash Limit",
  cash_transit: "Cash in Transit Limit",
  fidelity: "Fidelity Guarantee Cover",
  bi_period: "Business Interruption Indemnity Period (months)",
  bi_po: "Business Interruption — Post Office Income",
  pa_lone: "Personal Accident / Lone Worker Cover",
};

export const VALUE_LABELS = {
  // branch_type
  mains: "Mains (urban)",
  local: "Local",
  community: "Community",
  
  // branch_count
  "1": "Single branch",
  "2-3": "2-3 branches",
  "4-10": "4-10 branches",
  "10+": "10+ branches",
  
  // cover_type
  specialist: "Specialist Post Office insurer",
  generic_direct: "Generic direct insurer (e.g. Direct Line, Aviva)",
  broker: "Through a broker",
  unsure: "Unsure / can't verify",
  
  // premium
  under_1000: "Under £1,000",
  "1000_1500": "£1,000 - £1,500",
  "1500_2200": "£1,500 - £2,200",
  "2200_3500": "£2,200 - £3,500",
  "3500_plus": "£3,500+",
  
  // atm
  none: "No ATM",
  internal: "Internal ATM",
  external: "External ATM (wall-mounted)",
  
  // rem_frequency
  once: "Once per week or less",
  twice: "Twice per week",
  three_plus: "Three+ times per week",
  
  // counter_config
  fortress: "Fortress (fully screened)",
  hybrid: "Hybrid (partial screening)",
  open_plan: "Open-plan",
  mixed: "Mixed (multiple counter types)",
  
  // lone_working
  solo: "Frequently work alone",
  multi: "Always multiple staff",
  mixed: "Mixed / varies by shift",
  
  // contents
  under_50k: "Under £50k",
  "50k_100k": "£50k - £100k",
  "100k_200k": "£100k - £200k",
  "200k_plus": "£200k+",
  
  // accidental
  yes: "Yes",
  no: "No",
  cant_tell: "Can't tell from policy wording",
  
  // cash_counter
  "2500_5000": "£2,500 - £5,000",
  "5000_10000": "£5,000 - £10,000",
  "10000_20000": "£10,000 - £20,000",
  "20000_plus": "£20,000+",
  
  // cash_safe
  under_10000: "Under £10,000",
  "10000_25000": "£10,000 - £25,000",
  "25000_50000": "£25,000 - £50,000",
  "50000_plus": "£50,000+",
  
  // cash_transit
  under_5000: "Under £5,000",
  "5000_15000": "£5,000 - £15,000",
  "15000_30000": "£15,000 - £30,000",
  "30000_plus": "£30,000+",
  
  // fidelity
  yes_limit: "Yes (with stated limit)",
  yes_no_limit: "Yes (but no clear limit shown)",
  not_present: "Not present / can't find it",
  
  // bi_period
  "12": "12 months",
  "18": "18 months",
  "24": "24 months",
  "36": "36 months",
  
  // bi_po
  yes: "Yes, Post Office income is covered",
  retail_only: "Retail only (PO income excluded)",
  cant_tell: "Can't tell from policy wording",
  
  // pa_lone
  yes_named: "Yes, named individuals covered",
  pa_generic: "Generic PA cover (not specific to lone working)",
  no_pa: "No PA cover at all",
  
  // renewal_bucket
  "0_3m": "0-3 months",
  "3_6m": "3-6 months",
  "6_12m": "6-12 months",
  "12m_plus": "12+ months",
  unsure: "Unsure",
};

// ═══════════════════════════════════════════════════════════════════════════════
// APPENDIX B — GAP_PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Each pattern defines:
 * - name: Human-readable gap pattern name
 * - severity: critical | important | worth_reviewing
 * - condition: Function that receives answers object and returns boolean
 * - description: What this gap means for the underwriter
 */
export const GAP_PATTERNS = [
  {
    name: "No fidelity guarantee",
    severity: "critical",
    condition: (a) => a.fidelity === "not_present",
    description: "No employee theft protection — essential for Post Office operations",
  },
  {
    name: "Post Office income excluded from BI",
    severity: "critical",
    condition: (a) => a.bi_po === "retail_only",
    description: "Business interruption only covers retail — PO income loss not protected",
  },
  {
    name: "BI cover excludes PO (can't verify)",
    severity: "critical",
    condition: (a) => a.bi_po === "cant_tell",
    description: "Policy wording unclear whether Post Office income is covered",
  },
  {
    name: "Insufficient counter cash limit",
    severity: "critical",
    condition: (a) => a.cash_counter === "2500_5000" && a.branch_type === "mains",
    description: "Counter cash limit too low for mains branch (typical holding £15k-£40k)",
  },
  {
    name: "Insufficient safe cash limit",
    severity: "critical",
    condition: (a) => a.cash_safe === "under_10000" && a.branch_type === "mains",
    description: "Safe cash limit too low for mains branch operations",
  },
  {
    name: "ATM + low safe limit",
    severity: "critical",
    condition: (a) => 
      (a.atm === "internal" || a.atm === "external") && 
      (a.cash_safe === "under_10000" || a.cash_safe === "10000_25000"),
    description: "ATM cash float requires higher safe limits than policy provides",
  },
  {
    name: "ATM + twice-weekly REM + low safe",
    severity: "critical",
    condition: (a) => 
      a.atm !== "none" && 
      a.rem_frequency === "twice" && 
      a.cash_safe === "under_10000",
    description: "Low collection frequency + ATM needs higher overnight safe limit",
  },
  {
    name: "Open-plan counter + low counter cash limit",
    severity: "critical",
    condition: (a) => 
      a.counter_config === "open_plan" && 
      (a.cash_counter === "2500_5000" || a.cash_counter === "5000_10000"),
    description: "Open-plan counters carry higher theft risk — needs higher limit",
  },
  {
    name: "Lone working + no PA cover",
    severity: "critical",
    condition: (a) => 
      a.lone_working === "solo" && 
      a.pa_lone === "no_pa",
    description: "Lone workers exposed with no personal accident cover",
  },
  {
    name: "Lone working + generic PA (not specific)",
    severity: "critical",
    condition: (a) => 
      (a.lone_working === "solo" || a.lone_working === "mixed") && 
      a.pa_lone === "pa_generic",
    description: "Generic PA cover may not extend to lone working scenarios",
  },
  {
    name: "Low transit cash limit",
    severity: "important",
    condition: (a) => 
      a.cash_transit === "under_5000" && 
      a.branch_type === "mains",
    description: "Cash in transit limit may be insufficient for banking trips",
  },
  {
    name: "Short BI period (12 months)",
    severity: "important",
    condition: (a) => a.bi_period === "12",
    description: "12-month BI period may be insufficient for Post Office reinstatement",
  },
  {
    name: "Low contents cover",
    severity: "important",
    condition: (a) => 
      a.contents === "under_50k" && 
      (a.branch_type === "mains" || a.branch_type === "local"),
    description: "Contents limit may not cover fixtures, fittings, and stock adequately",
  },
  {
    name: "No accidental damage",
    severity: "worth_reviewing",
    condition: (a) => a.accidental === "no",
    description: "No cover for accidental damage to premises or contents",
  },
  {
    name: "Premium sanity check (very low)",
    severity: "worth_reviewing",
    condition: (a) => 
      a.premium === "under_1000" && 
      (a.branch_type === "mains" || a.branch_count === "2-3" || a.branch_count === "4-10"),
    description: "Premium seems low for risk profile — may indicate coverage gaps",
  },
  {
    name: "Premium sanity check (very high)",
    severity: "worth_reviewing",
    condition: (a) => 
      a.premium === "3500_plus" && 
      a.branch_type === "community" && 
      a.branch_count === "1",
    description: "Premium seems high for risk profile — may be overpaying",
  },
  {
    name: "Fidelity limit unclear",
    severity: "worth_reviewing",
    condition: (a) => a.fidelity === "yes_no_limit",
    description: "Fidelity cover present but limit not clearly stated in policy",
  },
  {
    name: "Generic insurer + multiple branches",
    severity: "worth_reviewing",
    condition: (a) => 
      a.cover_type === "generic_direct" && 
      (a.branch_count === "2-3" || a.branch_count === "4-10" || a.branch_count === "10+"),
    description: "Generic insurers may not understand multi-branch Post Office risks",
  },
  {
    name: "Multiple branches + single BI period",
    severity: "worth_reviewing",
    condition: (a) => 
      (a.branch_count === "2-3" || a.branch_count === "4-10" || a.branch_count === "10+") && 
      a.bi_period === "12",
    description: "Multi-branch operations may need longer BI periods",
  },
];

/**
 * Evaluate all gap patterns against a submission's answers
 * @param {Object} answers - The JSONB answers object from the database
 * @returns {Array} Array of detected gaps with {name, severity, description}
 */
export function detectGaps(answers) {
  return GAP_PATTERNS
    .filter(pattern => pattern.condition(answers))
    .map(({ name, severity, description }) => ({ name, severity, description }));
}

/**
 * Get human-readable label for a question key
 */
export function getQuestionLabel(key) {
  return QUESTION_LABELS[key] || key;
}

/**
 * Get human-readable label for an answer value
 */
export function getValueLabel(key, value) {
  if (value === null || value === undefined) return "—";
  return VALUE_LABELS[value] || value;
}
