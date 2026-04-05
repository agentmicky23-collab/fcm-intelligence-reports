"use client";

import { useState, useEffect } from "react";

const QUESTIONS = [
  // Section 1: About your branch (Q1-Q8)
  {
    id: 1,
    section: 1,
    sectionLabel: "About your branch",
    question: "What type of Post Office do you operate?",
    storageKey: "branch_type",
    options: [
      { label: "Mains Post Office", value: "mains" },
      { label: "Local", value: "local" },
      { label: "Local Plus", value: "local_plus" },
      { label: "Other / former Crown / not sure", value: "other" },
    ],
  },
  {
    id: 2,
    section: 1,
    sectionLabel: "About your branch",
    question: "How many Post Office branches do you own or operate?",
    storageKey: "branch_count",
    options: [
      { label: "Just one", value: "1" },
      { label: "2 to 3", value: "2-3" },
      { label: "4 or more", value: "4+" },
    ],
  },
  {
    id: 3,
    section: 1,
    sectionLabel: "About your branch",
    question: "Which best describes your current insurance cover?",
    subtext: "We're not asking for the insurer's name — we want to understand what type of product you're on.",
    storageKey: "cover_type",
    options: [
      { label: "A specialist Post Office insurance product", value: "specialist" },
      { label: "Shops & Salons cover from a major insurer (direct)", value: "generic_direct" },
      { label: "Cover arranged by a local insurance broker", value: "broker" },
      { label: "Not sure what type of cover I have", value: "unsure" },
    ],
  },
  {
    id: 4,
    section: 1,
    sectionLabel: "About your branch",
    question: "How much do you pay annually for your PO / shop insurance?",
    subtext: "Your total annual premium, per branch if you have multiple.",
    storageKey: "premium",
    options: [
      { label: "Under £1,000", value: "under_1000" },
      { label: "£1,000 to £1,500", value: "1000_1500" },
      { label: "£1,500 to £2,200", value: "1500_2200" },
      { label: "£2,200 to £3,000", value: "2200_3000" },
      { label: "Over £3,000", value: "over_3000" },
      { label: "Not sure", value: "unsure" },
    ],
  },
  {
    id: 5,
    section: 1,
    sectionLabel: "About your branch",
    question: "Does your branch have an ATM on the premises?",
    storageKey: "atm",
    options: [
      { label: "Yes — internal (in the shop/branch)", value: "internal" },
      { label: "Yes — external (through-the-wall)", value: "external" },
      { label: "No ATM", value: "none" },
      { label: "Not sure", value: "unsure" },
    ],
  },
  {
    id: 6,
    section: 1,
    sectionLabel: "About your branch",
    question: "How often does Post Office Ltd deliver cash to your branch?",
    subtext: "REM (Remittance) delivery frequency affects how much cash sits in the safe at peak times.",
    storageKey: "rem_frequency",
    options: [
      { label: "Once a week", value: "once" },
      { label: "Twice a week", value: "twice" },
      { label: "Three or more times a week", value: "three_plus" },
      { label: "Not sure", value: "unsure" },
    ],
  },
  {
    id: 7,
    section: 1,
    sectionLabel: "About your branch",
    question: "How is your Post Office counter configured?",
    storageKey: "counter_config",
    options: [
      { label: "Fortress / screened — staff work behind a security screen", value: "fortress" },
      { label: "Open-plan — no screen between staff and customers", value: "open_plan" },
      { label: "Mixed — some positions screened, some open", value: "mixed" },
    ],
  },
  {
    id: 8,
    section: 1,
    sectionLabel: "About your branch",
    question: "How many staff are typically on site during trading hours?",
    storageKey: "lone_working",
    options: [
      { label: "Usually just one person", value: "solo" },
      { label: "Two or more people always", value: "multi" },
      { label: "Varies — sometimes alone, sometimes with others", value: "mixed" },
    ],
  },
  // Section 2: Property & Contents (Q9-Q10)
  {
    id: 9,
    section: 2,
    sectionLabel: "Property & Contents",
    question: "Under \"Contents and Stock\" — what's your total sum insured?",
    storageKey: "contents",
    options: [
      { label: "Under £50,000", value: "under_50k" },
      { label: "£50,000 to £100,000", value: "50k_100k" },
      { label: "£100,000 to £200,000", value: "100k_200k" },
      { label: "Over £200,000", value: "over_200k" },
      { label: "I can't find this figure", value: "cant_find" },
    ],
  },
  {
    id: 10,
    section: 2,
    sectionLabel: "Property & Contents",
    question: "Is \"accidental damage\" explicitly included in your property cover?",
    subtext: "Search your policy wording for the phrase. Not just theft and fire — accidental damage specifically.",
    storageKey: "accidental",
    options: [
      { label: "Yes — included", value: "yes" },
      { label: "No — excluded or optional", value: "no" },
      { label: "Can't find any reference to it", value: "cant_find" },
    ],
  },
  // Section 3: Money (Q11-Q13)
  {
    id: 11,
    section: 3,
    sectionLabel: "Money (the critical section)",
    question: "Under \"Money\" — what's your cash on counter limit during business hours?",
    subtext: "This is usually the lowest money limit in the policy. Check carefully.",
    storageKey: "cash_counter",
    options: [
      { label: "Under £2,500", value: "under_2500" },
      { label: "£2,500 to £5,000", value: "2500_5000" },
      { label: "£5,000 to £10,000", value: "5000_10000" },
      { label: "£10,000 to £20,000", value: "10000_20000" },
      { label: "Over £20,000", value: "over_20000" },
      { label: "Can't find a figure", value: "cant_find" },
    ],
  },
  {
    id: 12,
    section: 3,
    sectionLabel: "Money",
    question: "What's your cash in safe limit during business hours?",
    storageKey: "cash_safe",
    options: [
      { label: "Under £10,000", value: "under_10000" },
      { label: "£10,000 to £25,000", value: "10000_25000" },
      { label: "£25,000 to £50,000", value: "25000_50000" },
      { label: "Over £50,000", value: "over_50000" },
      { label: "Can't find it", value: "cant_find" },
    ],
  },
  {
    id: 13,
    section: 3,
    sectionLabel: "Money",
    question: "What's your cash in transit limit?",
    subtext: "Cover for cash being carried by you or staff — typically to the bank.",
    storageKey: "cash_transit",
    options: [
      { label: "Under £5,000", value: "under_5000" },
      { label: "£5,000 to £15,000", value: "5000_15000" },
      { label: "£15,000 to £30,000", value: "15000_30000" },
      { label: "Over £30,000", value: "over_30000" },
      { label: "Not listed in my policy", value: "not_listed" },
    ],
  },
  // Section 4: Specific covers (Q14-Q17)
  {
    id: 14,
    section: 4,
    sectionLabel: "Specific covers",
    question: "Search your policy for the word \"fidelity\"",
    subtext: "This is cover for theft by your own employees. In a cash-heavy business, it's essential.",
    storageKey: "fidelity",
    options: [
      { label: "Yes — with a stated limit", value: "yes_limit" },
      { label: "Listed as excluded", value: "excluded" },
      { label: "The word doesn't appear at all", value: "not_present" },
      { label: "Can't tell from the policy", value: "cant_tell" },
    ],
  },
  {
    id: 15,
    section: 4,
    sectionLabel: "Specific covers",
    question: "What's your Business Interruption indemnity period?",
    subtext: "How long after an incident the policy will pay for lost income.",
    storageKey: "bi_period",
    options: [
      { label: "12 months", value: "12" },
      { label: "18 months", value: "18" },
      { label: "24 months", value: "24" },
      { label: "Longer than 24 months", value: "longer" },
      { label: "I don't have BI cover", value: "no_bi" },
      { label: "Can't find it", value: "cant_find" },
    ],
  },
  {
    id: 16,
    section: 4,
    sectionLabel: "Specific covers",
    question: "Does your BI specifically mention Post Office remuneration?",
    subtext: "Search for \"Post Office\", \"PO remuneration\" or \"PO contract\" in your BI section. Standard retail BI covers shop gross profit only — not your PO salary.",
    storageKey: "bi_po",
    options: [
      { label: "Yes — explicitly mentioned", value: "yes" },
      { label: "Only retail profit is mentioned", value: "retail_only" },
      { label: "Can't tell from the policy", value: "cant_tell" },
      { label: "I don't have BI at all", value: "no_bi" },
    ],
  },
  {
    id: 17,
    section: 4,
    sectionLabel: "Specific covers",
    question: "Does your policy include personal accident cover specifically for staff working alone?",
    subtext: "Lone working is common in Post Offices. Standard policies often treat PA as a low-limit add-on rather than a core feature.",
    storageKey: "pa_lone",
    options: [
      { label: "Yes — lone worker PA is named in the policy", value: "yes_named" },
      { label: "PA cover exists but lone working isn't specifically mentioned", value: "pa_generic" },
      { label: "No PA cover at all", value: "no_pa" },
      { label: "Can't tell from the policy", value: "cant_tell" },
    ],
  },
];

export default function InsuranceAuditModal({ isOpen, onClose }) {
  const [state, setState] = useState("intro"); // intro | survey | policy-check | pdf-capture | results | email-capture
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [branchName, setBranchName] = useState("");
  const [fadCode, setFadCode] = useState("");
  const [renewalBucket, setRenewalBucket] = useState("");
  const [pdfEmail, setPdfEmail] = useState("");
  const [pdfBranchName, setPdfBranchName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pdfSubmitted, setPdfSubmitted] = useState(false);

  // Analytics tracking
  useEffect(() => {
    if (isOpen) {
      console.log("[Analytics] audit_modal_open");
    }
  }, [isOpen]);

  const handleClose = () => {
    if (state === "survey" && currentQuestion > 0) {
      if (confirm("You'll lose your progress if you close now. Are you sure?")) {
        resetModal();
        onClose();
      }
    } else {
      resetModal();
      onClose();
    }
  };

  const resetModal = () => {
    setState("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setEmail("");
    setBranchName("");
    setFadCode("");
    setRenewalBucket("");
    setPdfEmail("");
    setPdfBranchName("");
    setSubmitted(false);
    setPdfSubmitted(false);
  };

  const startAudit = () => {
    console.log("[Analytics] audit_card_click");
    setState("survey");
  };

  const answerQuestion = (value) => {
    const question = QUESTIONS[currentQuestion];
    const newAnswers = { ...answers, [question.storageKey]: value };
    setAnswers(newAnswers);
    
    console.log(`[Analytics] audit_question_answered`, {
      questionNumber: currentQuestion + 1,
      storageKey: question.storageKey,
      value,
    });

    // After Q8, show policy-check interstitial
    if (currentQuestion === 7) {
      setState("policy-check");
    } else if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Finished all questions
      console.log("[Analytics] audit_results_shown");
      setState("results");
    }
  };

  const continueToPolicyQuestions = () => {
    console.log("[Analytics] audit_policy_check_continue");
    setState("survey");
    setCurrentQuestion(8); // Q9
  };

  const requestPDF = () => {
    console.log("[Analytics] audit_policy_check_pdf_bounce");
    setState("pdf-capture");
  };

  const submitPDFRequest = async () => {
    if (!pdfEmail) return;

    try {
      const response = await fetch("/api/support-audit-pdf-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pdfEmail,
          branch_name: pdfBranchName,
        }),
      });

      if (response.ok) {
        setPdfSubmitted(true);
      }
    } catch (error) {
      console.error("PDF request failed:", error);
    }
  };

  const submitAudit = async () => {
    if (!email || !renewalBucket) return;

    const gaps = calculateGaps(answers);

    try {
      const response = await fetch("/api/support-audit-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          branch_name: branchName,
          fad_code: fadCode,
          renewal_bucket: renewalBucket,
          answers,
          cover_type: answers.cover_type,
          critical_count: gaps.critical.length,
          important_count: gaps.important.length,
          worth_reviewing_count: gaps.worthReviewing.length,
          warning_count: gaps.critical.length + gaps.important.length + gaps.worthReviewing.length,
        }),
      });

      if (response.ok) {
        console.log("[Analytics] audit_email_submitted");
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Audit submission failed:", error);
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const currentQ = QUESTIONS[currentQuestion];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg"
        style={{ background: '#0d1117', border: '1px solid #30363d' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:bg-[#21262d] z-10"
          style={{ color: '#8b949e' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-8">
          {/* STATE: INTRO */}
          {state === "intro" && (
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: '#8b949e' }}>
                Policy audit — 7 minutes
              </div>
              <div className="text-sm mb-4" style={{ color: '#c9a227' }}>
                FCM Intelligence
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Is your Post Office insurance fit for purpose?
              </h2>
              <div className="space-y-4 mb-6 text-base leading-relaxed" style={{ color: '#c9d1d9' }}>
                <p>
                  11,500 Post Offices in the UK. Two specialist insurers. Everyone else is on retail shops cover with Post Office bits added — and the two "specialist" products are shops policies at their core too.
                </p>
                <p>
                  This market has failed Postmasters for years. Post Offices don't need retail cover with extensions. We need cover built around the risk we actually carry — the cash, the contract income, the counter exposure.
                </p>
                <p>
                  I'm auditing my own policy. I'm asking every Postmaster who'll listen to audit theirs. Once we've got the evidence, we act on it.
                </p>
                <p>
                  The 17 questions below are the ones I put to my own policy. You'll need your schedule in front of you. At the end you'll see where your cover holds up and where it doesn't.
                </p>
              </div>
              <div className="pt-6 border-t mb-6" style={{ borderColor: '#30363d' }}>
                <p className="text-sm" style={{ color: '#8b949e' }}>
                  No product is being sold from this page. This is market research by FCM Intelligence, operator of the UK's largest live Post Office listings database at fcmreport.com.
                </p>
              </div>
              <button
                onClick={startAudit}
                className="w-full px-6 py-3 rounded-lg font-semibold text-lg transition-all hover:bg-[#d4af37]"
                style={{ background: '#c9a227', color: '#0d1117' }}
              >
                Start the audit →
              </button>
            </div>
          )}

          {/* STATE: SURVEY */}
          {state === "survey" && currentQ && (
            <div>
              <div className="mb-6">
                <div className="text-xs font-semibold mb-2" style={{ color: '#8b949e' }}>
                  Section {currentQ.section} of 4 · Question {currentQuestion + 1} of {QUESTIONS.length}
                </div>
                <div className="w-full h-2 rounded-full mb-4" style={{ background: '#21262d' }}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ background: '#c9a227', width: `${progress}%` }}
                  />
                </div>
                <div className="text-sm font-semibold mb-2" style={{ color: '#c9a227' }}>
                  {currentQ.sectionLabel}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {currentQ.question}
              </h3>
              {currentQ.subtext && (
                <p className="text-sm mb-6" style={{ color: '#8b949e' }}>
                  {currentQ.subtext}
                </p>
              )}
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => answerQuestion(option.value)}
                    className="w-full px-4 py-3 rounded-lg text-left transition-all border"
                    style={{ 
                      background: '#161b22', 
                      borderColor: '#30363d',
                      color: '#c9d1d9'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#c9a227';
                      e.currentTarget.style.background = '#21262d';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#30363d';
                      e.currentTarget.style.background = '#161b22';
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STATE: POLICY-CHECK INTERSTITIAL */}
          {state === "policy-check" && (
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Before we continue
              </h3>
              <p className="text-xl font-semibold mb-6">
                Do you have your policy schedule to hand?
              </p>
              <p className="text-base mb-8" style={{ color: '#c9d1d9' }}>
                The next 9 questions ask about specific figures from your actual policy. Answers based on guesses won't give you a useful audit.
              </p>
              <div className="space-y-3">
                <button
                  onClick={continueToPolicyQuestions}
                  className="w-full px-6 py-3 rounded-lg font-semibold transition-all hover:bg-[#d4af37]"
                  style={{ background: '#c9a227', color: '#0d1117' }}
                >
                  Yes — let's continue
                </button>
                <button
                  onClick={requestPDF}
                  className="w-full px-6 py-3 rounded-lg font-semibold transition-all border hover:bg-[#21262d]"
                  style={{ background: '#161b22', borderColor: '#30363d', color: '#c9d1d9' }}
                >
                  No — send me the questions as a PDF
                </button>
              </div>
            </div>
          )}

          {/* STATE: PDF CAPTURE */}
          {state === "pdf-capture" && !pdfSubmitted && (
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: '#8b949e' }}>
                Audit questions by email
              </div>
              <h3 className="text-2xl font-bold mb-6">
                No problem.
              </h3>
              <p className="text-base mb-6" style={{ color: '#c9d1d9' }}>
                Leave your email and we'll send you the 17 audit questions as a PDF. Complete it with your policy in front of you, and we'll follow up with the gap analysis and research findings.
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email <span style={{ color: '#f85149' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={pdfEmail}
                    onChange={(e) => setPdfEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ background: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#8b949e' }}>
                    Post Office name (optional)
                  </label>
                  <input
                    type="text"
                    value={pdfBranchName}
                    onChange={(e) => setPdfBranchName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ background: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }}
                    placeholder="e.g. Barnsley Post Office"
                  />
                </div>
              </div>
              <button
                onClick={submitPDFRequest}
                disabled={!pdfEmail}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                style={{ background: '#c9a227', color: '#0d1117' }}
              >
                Send me the PDF →
              </button>
            </div>
          )}

          {state === "pdf-capture" && pdfSubmitted && (
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Sent.
              </h3>
              <p className="text-base mb-8" style={{ color: '#c9d1d9' }}>
                Check your inbox for the audit PDF. Complete it with your policy in front of you and we'll follow up.
              </p>
              <button
                onClick={handleClose}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all"
                style={{ background: '#c9a227', color: '#0d1117' }}
              >
                Close
              </button>
            </div>
          )}

          {/* STATE: RESULTS */}
          {state === "results" && !submitted && (
            <div>
              <GapAnalysis answers={answers} />
              
              {/* Email capture below results */}
              <div className="mt-8 pt-8 border-t" style={{ borderColor: '#30363d' }}>
                <h3 className="text-xl font-bold mb-4">
                  Get your findings by email
                </h3>
                <p className="text-sm mb-6" style={{ color: '#8b949e' }}>
                  Leave your email below and we'll follow up with a written copy of your findings, plus our market research summary when it's published.
                </p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email <span style={{ color: '#f85149' }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ background: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#8b949e' }}>
                      Branch name (optional)
                    </label>
                    <input
                      type="text"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ background: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }}
                      placeholder="e.g. Barnsley Post Office"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#8b949e' }}>
                      Branch FAD code (optional)
                    </label>
                    <input
                      type="text"
                      value={fadCode}
                      onChange={(e) => setFadCode(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ background: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }}
                      placeholder="e.g. 123456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Policy renewal date <span style={{ color: '#f85149' }}>*</span>
                    </label>
                    <select
                      value={renewalBucket}
                      onChange={(e) => setRenewalBucket(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ background: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }}
                    >
                      <option value="">Select...</option>
                      <option value="0_3m">In the next 3 months</option>
                      <option value="3_6m">3 to 6 months away</option>
                      <option value="6_12m">6 to 12 months away</option>
                      <option value="12m_plus">More than 12 months away</option>
                      <option value="unsure">Not sure</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={submitAudit}
                  disabled={!email || !renewalBucket}
                  className="w-full px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 mb-4"
                  style={{ background: '#c9a227', color: '#0d1117' }}
                >
                  Send me the findings →
                </button>
                <p className="text-xs text-center" style={{ color: '#8b949e' }}>
                  We'll only email you about this research and FCM updates. No spam.
                </p>
              </div>
            </div>
          )}

          {state === "results" && submitted && (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                Thank you.
              </h2>
              <p className="text-lg mb-6" style={{ color: '#c9d1d9' }}>
                Your answers are saved. We'll email you a written copy of your findings within the next 7 days, and notify you when the FCM market research is published.
              </p>
              <p className="text-base mb-8" style={{ color: '#8b949e' }}>
                In the meantime, browse Post Office listings at fcmreport.com/opportunities.
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 rounded-lg font-semibold transition-all"
                style={{ background: '#c9a227', color: '#0d1117' }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Gap analysis component
function GapAnalysis({ answers }) {
  const gaps = calculateGaps(answers);
  const totalWarnings = gaps.critical.length + gaps.important.length + gaps.worthReviewing.length;

  let headline = "Your cover looks well-matched";
  if (totalWarnings === 1 || totalWarnings === 2) {
    headline = `Your policy has ${totalWarnings} potential gap${totalWarnings === 1 ? '' : 's'}`;
  } else if (totalWarnings === 3 || totalWarnings === 4) {
    headline = `Your policy has ${totalWarnings} gaps worth reviewing`;
  } else if (totalWarnings >= 5) {
    headline = `Your policy has ${totalWarnings} significant gaps`;
  }

  return (
    <div>
      <div className="text-xs font-semibold mb-2" style={{ color: '#8b949e' }}>
        Your policy audit results
      </div>
      <div className="text-sm mb-4" style={{ color: '#c9a227' }}>
        Based on 17 policy-specific questions
      </div>
      <h2 className="text-3xl font-bold mb-6">
        {headline}
      </h2>
      
      {totalWarnings > 0 && (
        <div className="p-4 rounded-lg mb-6" style={{ background: '#161b22', border: '1px solid #30363d' }}>
          <div className="text-sm font-semibold" style={{ color: '#8b949e' }}>
            Severity summary:
          </div>
          <div className="text-lg font-bold">
            {gaps.critical.length > 0 && <span style={{ color: '#f85149' }}>{gaps.critical.length} critical</span>}
            {gaps.critical.length > 0 && gaps.important.length > 0 && <span style={{ color: '#8b949e' }}> · </span>}
            {gaps.important.length > 0 && <span style={{ color: '#fb8500' }}>{gaps.important.length} important</span>}
            {(gaps.critical.length > 0 || gaps.important.length > 0) && gaps.worthReviewing.length > 0 && <span style={{ color: '#8b949e' }}> · </span>}
            {gaps.worthReviewing.length > 0 && <span style={{ color: '#fbbf24' }}>{gaps.worthReviewing.length} worth reviewing</span>}
          </div>
        </div>
      )}

      {/* Cover-type framing card */}
      <CoverTypeFraming coverType={answers.cover_type} />

      {/* Gap cards in severity order */}
      <div className="space-y-4 mt-6">
        {gaps.critical.map((gap, i) => (
          <GapCard key={`critical-${i}`} gap={gap} severity="critical" />
        ))}
        {gaps.important.map((gap, i) => (
          <GapCard key={`important-${i}`} gap={gap} severity="important" />
        ))}
        {gaps.worthReviewing.map((gap, i) => (
          <GapCard key={`worth-${i}`} gap={gap} severity="worth-reviewing" />
        ))}
        {gaps.ok.map((gap, i) => (
          <GapCard key={`ok-${i}`} gap={gap} severity="ok" />
        ))}
      </div>
    </div>
  );
}

function CoverTypeFraming({ coverType }) {
  const frames = {
    specialist: {
      type: "info",
      title: "You're on a specialist PO product",
      body: "Specialist products exist and they handle PO risk better than generic shops cover. But most are still fundamentally shops policies with PO extensions — designed for retail first, Post Office second. The questions below test whether yours covers the specifics that matter.",
    },
    generic_direct: {
      type: "warning",
      title: "You're on generic Shops & Salons cover",
      body: "Major insurers offer good retail cover — but these products are designed for the average high-street shop, not for businesses with £20k+ daily cash movement. You may be under-insured on multiple PO-specific risks. The gaps below will show where.",
    },
    broker: {
      type: "info",
      title: "Broker-arranged cover",
      body: "Broker-arranged cover is only as good as the broker's Post Office expertise. Your policy may be well-matched or may have gaps — the audit below will tell you which.",
    },
    unsure: {
      type: "info",
      title: "Cover type uncertain",
      body: "If you're not sure what type of cover you have, that's the first thing to establish. Ask your broker or insurer directly whether your policy was designed for Post Office operations specifically.",
    },
  };

  const frame = frames[coverType] || frames.unsure;
  const bgColor = frame.type === "warning" ? "rgba(251, 133, 0, 0.1)" : "rgba(59, 130, 246, 0.1)";
  const borderColor = frame.type === "warning" ? "#fb8500" : "#3b82f6";

  return (
    <div 
      className="p-4 rounded-lg mb-6"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}
    >
      <h4 className="font-bold mb-2" style={{ color: borderColor }}>
        {frame.title}
      </h4>
      <p className="text-sm" style={{ color: '#c9d1d9' }}>
        {frame.body}
      </p>
    </div>
  );
}

function GapCard({ gap, severity }) {
  const styles = {
    critical: { bg: 'rgba(248, 81, 73, 0.1)', border: '#f85149' },
    important: { bg: 'rgba(251, 133, 0, 0.1)', border: '#fb8500' },
    "worth-reviewing": { bg: 'rgba(251, 191, 36, 0.1)', border: '#fbbf24' },
    ok: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22c55e' },
  };

  const style = styles[severity];

  return (
    <div 
      className="p-4 rounded-lg"
      style={{ background: style.bg, border: `2px solid ${style.border}` }}
    >
      <h4 className="font-bold mb-2" style={{ color: style.border }}>
        {gap.title}
      </h4>
      <p className="text-sm" style={{ color: '#c9d1d9' }}>
        {gap.body}
      </p>
    </div>
  );
}

// Gap calculation logic
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
