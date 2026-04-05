/**
 * Test cases for Insurance Audit gap analysis logic
 * 
 * These test the three scenarios from Section 15 of the spec.
 * Run with: node tests/insurance-audit-gap-logic-tests.js
 * 
 * Copy the calculateGaps function from InsuranceAuditModal.jsx to test it standalone.
 */

// Gap calculation logic (copied from component)
function calculateGaps(answers) {
  const critical = [];
  const important = [];
  const worthReviewing = [];
  const ok = [];

  // CRITICAL gaps
  
  // 1. Fidelity missing
  if (['excluded', 'not_present', 'cant_tell'].includes(answers.fidelity)) {
    critical.push({
      title: "Employee theft cover likely missing",
      body: "Generic shops policies exclude fidelity cover by default. Even some specialist products treat it as optional. In a Post Office where staff handle £20k+ daily, that exposure is significant. Industry benchmark is £25,000 to £50,000 of fidelity cover as standard.",
    });
  }

  // 2. PO income not in BI
  if (['retail_only', 'cant_tell'].includes(answers.bi_po)) {
    critical.push({
      title: "Post Office income stream likely uninsured",
      body: "This is the most common PO-specific gap — and it exists in many specialist products too, not just generic cover. Standard BI covers retail gross profit loss. It does NOT automatically cover Post Office remuneration — the salary Post Office Ltd pays you. If your branch closes after an incident, your PO income may stop with no insurance replacing it. True PO-first cover names this stream explicitly.",
    });
  }

  // 3. Counter cash critically low
  if (['under_2500', '2500_5000', 'cant_find'].includes(answers.cash_counter)) {
    let body = "Working Post Offices routinely hold £10,000+ on the counter during business hours — rising to £20-30k on benefits payment days. Industry benchmark for PO-specialist cover is £10,000 to £20,000 minimum on counter. Your answer suggests you may be uninsured on cash every single trading day.";
    
    // Escalate if open-plan
    if (answers.counter_config === 'open_plan') {
      body += " You also operate an open-plan counter with no security screen. Insurers consider this higher-risk than screened positions, and your counter cash exposure is magnified accordingly.";
    }
    
    critical.push({
      title: "Counter cash limit likely insufficient",
      body,
    });
  } else if (answers.counter_config === 'open_plan' && ['5000_10000', 'cant_find'].includes(answers.cash_counter)) {
    // Escalate to critical if open-plan even with mid-range counter limit
    critical.push({
      title: "Counter cash limit at risk with open-plan layout",
      body: "You operate an open-plan counter with no security screen. Insurers consider this higher-risk than screened positions. Your counter cash limit may be adequate for a screened counter, but with open-plan exposure, you're carrying more risk than the policy was priced for.",
    });
  }

  // 4. Safe cash critically low
  if (['under_10000', 'cant_find'].includes(answers.cash_safe)) {
    critical.push({
      title: "Safe cash limit may be too low",
      body: "After Post Office Ltd cash deliveries, safe holdings commonly reach £30-50k. Generic shops policies cap at £5-10k. Industry benchmark for PO-specialist cover is £25,000 to £50,000 during business hours.",
    });
  }

  // 5. Lone working + inadequate PA
  if (['solo', 'mixed'].includes(answers.lone_working) && ['no_pa', 'cant_tell', 'pa_generic'].includes(answers.pa_lone)) {
    critical.push({
      title: "Lone worker with no specific personal accident cover",
      body: "You've told us staff sometimes or always work alone, and your policy doesn't specifically name lone worker PA cover. Assault risk in Post Offices is statistically higher than generic retail, and lone workers carry higher risk still. This combination is a significant exposure.",
    });
  }

  // Severity escalation — ATM + safe cash combination
  if (['internal', 'external'].includes(answers.atm) && ['under_10000', '10000_25000', 'cant_find'].includes(answers.cash_safe)) {
    let body = "You have an ATM on the premises, which sits on top of your PO cash float. With a safe limit at your current level, safe cash is likely uninsured at peak times — particularly after REM deliveries.";
    
    if (['twice', 'three_plus'].includes(answers.rem_frequency)) {
      body += " Twice-weekly (or more) REM deliveries plus ATM cash mean your safe sees peak cash levels multiple times a week.";
    }
    
    critical.push({
      title: "ATM on premises with low safe limit",
      body,
    });
  }

  // IMPORTANT gaps

  // 6. Cash in transit low
  if (['under_5000', 'not_listed'].includes(answers.cash_transit)) {
    important.push({
      title: "Cash in transit limit at risk",
      body: "Postmasters carrying cash to the bank commonly move £15-30k. If your transit limit is under £5,000 — or not listed at all — any bank run above that figure is uninsured. Industry benchmark is £15,000 to £30,000.",
    });
  }

  // 7. BI period too short
  if (['12', 'cant_find'].includes(answers.bi_period)) {
    important.push({
      title: "Business Interruption period may be too short",
      body: "Standard 12-month indemnity periods often prove inadequate for PO operators. Post Office Ltd contract reallocation timelines, rebuild delays, and supplier issues can extend recovery beyond 12 months. Industry benchmark for specialist PO cover is 18-24 months.",
    });
  }

  // 8. No BI at all
  if (answers.bi_period === 'no_bi') {
    important.push({
      title: "No Business Interruption cover at all",
      body: "Without BI cover, any incident closing your branch leaves you with no income protection. This is a substantial exposure — property damage without BI is usually cover that's been stripped out to save premium.",
    });
  }

  // 9. Contents under-sized
  if (['under_50k', 'cant_find'].includes(answers.contents)) {
    important.push({
      title: "Contents and stock cover may be under-sized",
      body: "Post Office operations typically require £75k-£150k of contents cover when fixtures, EPOS systems, stock, and PO counter equipment are properly valued. Under-insurance can result in proportional claim reductions.",
    });
  }

  // WORTH REVIEWING gaps

  // 10. Accidental damage missing
  if (['no', 'cant_find'].includes(answers.accidental)) {
    worthReviewing.push({
      title: "Accidental damage may not be covered",
      body: "Many generic shops policies cover theft and fire but exclude accidental damage unless specifically added. For retail environments with stock, fixtures, and customer footfall, this is a meaningful exposure to leave uncovered.",
    });
  }

  // 11. Premium vs gaps sanity check
  const totalGapCount = critical.length + important.length + worthReviewing.length;
  if (answers.premium === 'under_1000' && totalGapCount >= 3) {
    worthReviewing.push({
      title: "Premium suggests cover was priced for retail, not PO",
      body: "At under £1,000/year with multiple gaps identified, you're likely on cover priced as a shop with PO bolted on, rather than priced as a Post Office with retail extensions. True PO-first cover typically costs £1,500-£2,500 but closes the gaps above.",
    });
  }

  // OK cards

  if (answers.fidelity === 'yes_limit') {
    ok.push({
      title: "Fidelity cover in place",
      body: "You have employee theft cover, essential for cash-handling businesses. Check the limit is adequate for your daily cash movement.",
    });
  }

  if (answers.bi_po === 'yes') {
    ok.push({
      title: "PO income stream protected",
      body: "Your BI explicitly covers both retail and PO revenue — this is the gold standard and rare even in specialist cover.",
    });
  }

  if (['18', '24', 'longer'].includes(answers.bi_period)) {
    ok.push({
      title: "BI period well-sized",
      body: "Your indemnity period reflects realistic PO recovery timelines.",
    });
  }

  if (['10000_20000', 'over_20000'].includes(answers.cash_counter)) {
    ok.push({
      title: "Counter cash limit looks PO-appropriate",
      body: "Your counter limit reflects real PO cash movement. Confirm your safe and in-transit limits match.",
    });
  }

  if (['25000_50000', 'over_50000'].includes(answers.cash_safe)) {
    ok.push({
      title: "Safe cash limit adequate",
      body: "Your safe limit looks sized for PO cash holdings.",
    });
  }

  return { critical, important, worthReviewing, ok };
}

// TEST CASES from spec Section 15

console.log("═══════════════════════════════════════════════════════");
console.log("TEST A: Clean specialist cover");
console.log("═══════════════════════════════════════════════════════");

const testA = {
  cover_type: 'specialist',
  atm: 'none',
  counter_config: 'fortress',
  lone_working: 'multi',
  fidelity: 'yes_limit',
  bi_po: 'yes',
  bi_period: '24',
  cash_counter: '10000_20000',
  cash_safe: '25000_50000',
  cash_transit: '15000_30000',
  contents: '100k_200k',
  accidental: 'yes',
  pa_lone: 'yes_named',
  rem_frequency: 'once',
  premium: '1500_2200',
};

const resultA = calculateGaps(testA);
console.log("Expected: 0 critical, 0 important, 0 worth reviewing, multiple OK cards");
console.log(`Actual: ${resultA.critical.length} critical, ${resultA.important.length} important, ${resultA.worthReviewing.length} worth reviewing, ${resultA.ok.length} OK`);
console.log("PASS:", resultA.critical.length === 0 && resultA.important.length === 0 && resultA.worthReviewing.length === 0 && resultA.ok.length > 0 ? "✅" : "❌");
console.log("");

console.log("═══════════════════════════════════════════════════════");
console.log("TEST B: Generic shops cover with multiple gaps");
console.log("═══════════════════════════════════════════════════════");

const testB = {
  cover_type: 'generic_direct',
  atm: 'internal',
  counter_config: 'open_plan',
  lone_working: 'solo',
  fidelity: 'not_present',
  bi_po: 'retail_only',
  bi_period: '12',
  cash_counter: '2500_5000',
  cash_safe: 'under_10000',
  cash_transit: 'under_5000',
  contents: 'under_50k',
  accidental: 'no',
  pa_lone: 'no_pa',
  rem_frequency: 'twice',
  premium: 'under_1000',
};

const resultB = calculateGaps(testB);
console.log("Expected: 6+ critical, multiple important, multiple worth reviewing");
console.log(`Actual: ${resultB.critical.length} critical, ${resultB.important.length} important, ${resultB.worthReviewing.length} worth reviewing`);
console.log("Critical gaps found:");
resultB.critical.forEach((gap, i) => console.log(`  ${i+1}. ${gap.title}`));
console.log("PASS:", resultB.critical.length >= 6 ? "✅" : "❌");
console.log("");

console.log("═══════════════════════════════════════════════════════");
console.log("TEST C: Broker cover with partial gaps");
console.log("═══════════════════════════════════════════════════════");

const testC = {
  cover_type: 'broker',
  atm: 'external',
  counter_config: 'mixed',
  lone_working: 'mixed',
  fidelity: 'yes_limit',
  bi_po: 'cant_tell',
  bi_period: '18',
  cash_counter: '10000_20000',
  cash_safe: '10000_25000',
  cash_transit: '15000_30000',
  contents: '50k_100k',
  accidental: 'yes',
  pa_lone: 'pa_generic',
  rem_frequency: 'twice',
  premium: '1500_2200',
};

const resultC = calculateGaps(testC);
console.log("Expected: 2-3 critical (PO income cant_tell, ATM+safe combo, lone worker+PA), 0 important, 0 worth reviewing, plus OK cards");
console.log(`Actual: ${resultC.critical.length} critical, ${resultC.important.length} important, ${resultC.worthReviewing.length} worth reviewing, ${resultC.ok.length} OK`);
console.log("Critical gaps found:");
resultC.critical.forEach((gap, i) => console.log(`  ${i+1}. ${gap.title}`));
console.log("OK cards found:");
resultC.ok.forEach((gap, i) => console.log(`  ${i+1}. ${gap.title}`));
console.log("PASS:", resultC.critical.length >= 2 && resultC.critical.length <= 3 && resultC.important.length === 0 && resultC.worthReviewing.length === 0 ? "✅" : "❌");
console.log("");

console.log("═══════════════════════════════════════════════════════");
console.log("ALL TESTS COMPLETE");
console.log("═══════════════════════════════════════════════════════");
