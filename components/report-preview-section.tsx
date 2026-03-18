"use client";

import { useState } from "react";
import { BuyButton } from "./buy-button";

type ReportTier = "location" | "basic" | "professional" | "premium";

interface ReportInfo {
  tier: ReportTier;
  name: string;
  price: string;
  tagline: string;
  description: string;
  features: string[];
  notIncluded: string[];
  upgradeTip?: string;
  sampleContent: {
    title: string;
    location: string;
    score: string;
    scoreLabel: string;
    sections: { title: string; content: string }[];
  };
}

const reportData: ReportInfo[] = [
  {
    tier: "location",
    name: "Scout Report",
    price: "£99",
    tagline: "Should I even look at this?",
    description: "Quick viability check. Get the key location data and competition picture before investing any more time.",
    features: [
      "Executive Summary & Verdict",
      "Location Intelligence (maps, Street View, photos)",
      "Competition Mapping",
      "Risk Assessment (checklist)",
      "8-12 page PDF report",
    ],
    notIncluded: [
      "Demographics & crime analysis",
      "Financial analysis",
      "Consultation call",
    ],
    upgradeTip: "Want more detail? Upgrade to Insight (+£50)",
    sampleContent: {
      title: "Scout Report",
      location: "CW11 1HN • Sandbach, Cheshire East",
      score: "B+",
      scoreLabel: "Viability: Worth investigating",
      sections: [
        { title: "📋 Executive Summary", content: "Main Post Office with retail counter on a busy high street. Good visibility and footfall. Initial indicators positive — recommend further analysis." },
        { title: "📍 Location Intelligence", content: "High street location with daily footfall of 3,200+. Anchor stores: Tesco Express, Boots, Costa. Good visibility from main road." },
        { title: "🏢 Competition Map", content: "Nearest Post Office: 2.8km (Sandbach Heath). Competing retailers: 12 within 500m. Market saturation: Low." },
        { title: "⚠️ Risk Checklist", content: "✅ Active PO branch on branch finder\n✅ No major redevelopment planned\n⚠️ Parking limited to 4 spaces\n✅ Lease details appear standard" },
      ],
    },
  },
  {
    tier: "basic",
    name: "Insight Report",
    price: "£149",
    tagline: "Is this area any good?",
    description: "Full location intelligence with demographics, crime data, footfall analysis, and comprehensive competition mapping.",
    features: [
      "Executive Summary & Verdict",
      "Location Intelligence (Street View, maps, photos)",
      "Demographics & Community Profile",
      "Crime & Safety Analysis",
      "Competition Mapping",
      "Footfall Analysis",
      "Infrastructure & Connectivity",
      "Online Presence & Reviews",
      "Risk Assessment (full)",
      "15-22 page PDF report",
    ],
    notIncluded: [
      "Financial analysis",
      "PO remuneration breakdown",
      "Consultation call",
    ],
    upgradeTip: "Want financials? Upgrade to Analysis (+£100)",
    sampleContent: {
      title: "Insight Report",
      location: "CW11 1HN • Sandbach, Cheshire East",
      score: "A",
      scoreLabel: "Location Score: 85/100",
      sections: [
        { title: "📍 Location Intelligence", content: "Primary catchment: 8,450 residents within 1km. High street location with daily footfall of 3,200+. Anchor stores: Tesco Express, Boots, Costa." },
        { title: "👥 Demographics", content: "Median age: 42. Household income: £38,400 (12% above regional avg). Home ownership: 68%. Retired population: 22%." },
        { title: "🛡️ Crime & Safety", content: "Crime rate: 42 per 1,000 (Low). Anti-social behaviour: Below average. Shoplifting incidents: 8/year (Low risk)." },
        { title: "🏢 Competition Map", content: "Nearest Post Office: 2.8km (Sandbach Heath). Competing retailers: 12 within 500m. Market saturation: Low." },
        { title: "📡 Infrastructure", content: "Mobile: EE 4G excellent, 5G available. Broadband: FTTP available (500Mbps). Power: Stable grid." },
      ],
    },
  },
  {
    tier: "professional",
    name: "Analysis Report",
    price: "£249",
    tagline: "Should I make an offer?",
    description: "Everything in Insight plus full financial analysis, PO remuneration breakdown, staffing costs, and future outlook.",
    features: [
      "Everything in Insight",
      "Financial Analysis (P&L, benchmarks, valuation)",
      "PO Remuneration Analysis (income breakdown, donut chart)",
      "Staffing & Hidden Costs (true employment cost calculator)",
      "Future Outlook (5-year timeline, planning, developments)",
      "30-40 page PDF report",
    ],
    notIncluded: [
      "Profit improvement plan",
      "Due diligence pack",
      "Consultation call",
    ],
    upgradeTip: "Want the full package? Upgrade to Intelligence (+£200)",
    sampleContent: {
      title: "Analysis Report",
      location: "Sandbach Post Office • CW11 1HN",
      score: "B+",
      scoreLabel: "Business Score: 72/100",
      sections: [
        { title: "💰 Financial Summary", content: "Est. Annual Revenue: £185,000\nPO Remuneration: £67,400 (36%)\nRetail Gross Profit: £48,000\nEst. Net Profit: £42,000\nROI at asking price: 33.6%" },
        { title: "📈 P&L Breakdown", content: "Wages: £28,400 (15%)\nRent: £18,000 (10%)\nUtilities: £4,800 (3%)\nStock: £62,000 (34%)\nOther: £8,000 (4%)" },
        { title: "👥 Staffing & Hidden Costs", content: "Staff: 2 PT employees\nTrue employment cost: £32,800 (inc. NI, pension, holiday cover)\nOwner hours: 50/week estimated" },
        { title: "📡 Future Outlook", content: "Bank branch closing Q3 2026 — OPPORTUNITY for banking services.\nNew housing development (200 units) 0.8km away — increased catchment by ~15%.\nFTTP rollout complete — supports modern PO services." },
      ],
    },
  },
  {
    tier: "premium",
    name: "Intelligence Report",
    price: "£449",
    tagline: "Help me buy it.",
    description: "The complete intelligence package. Everything in Analysis plus profit improvement plan, due diligence & negotiation pack, and a 60-minute consultation call.",
    features: [
      "Everything in Analysis",
      "Profit Improvement Plan (evidence-based, tied to findings)",
      "Due Diligence Pack (documents checklist, seller questions, landlord questions)",
      "Negotiation Strategy (buyer/seller leverage, suggested offer range)",
      "60-minute consultation call",
      "40-55 page PDF report",
    ],
    notIncluded: [],
    sampleContent: {
      title: "Intelligence Report",
      location: "Sandbach Post Office • CW11 1HN",
      score: "B+",
      scoreLabel: "Overall: 72/100 | Location: A (85/100)",
      sections: [
        { title: "🎯 Executive Summary", content: "Strong acquisition opportunity. Business score B+ with excellent A-rated location. Projected 3-year ROI: 98%. Key risk: Limited parking. Key opportunity: Banking services expansion." },
        { title: "💰 Financial Analysis", content: "Est. Annual Revenue: £185,000\nPO Remuneration: £67,400\nNet Profit: £42,000\nValuation: Fair at asking price\nRecommended offer: £115,000-£120,000" },
        { title: "🚀 Profit Improvement Plan", content: "1. Add parcel locker (£3-5k revenue)\n2. Extend banking hours (£2-4k revenue)\n3. Lottery terminal upgrade (£1-2k revenue)\nTotal potential uplift: £6-11k/year" },
        { title: "📋 Due Diligence Pack", content: "✅ 23 documents to request from seller\n✅ 12 questions for the landlord\n✅ PO contract verification checklist\n✅ Lease review framework" },
        { title: "🤝 Negotiation Strategy", content: "Seller leverage: Medium (retirement sale, motivated)\nBuyer leverage: Strong (parking issue, retail margin below average)\nSuggested opening offer: £95,000\nWalk-away price: £120,000" },
      ],
    },
  },
];

export function ReportPreviewSection() {
  const [activeTier, setActiveTier] = useState<ReportTier>("premium");
  const activeReport = reportData.find((r) => r.tier === activeTier)!;

  return (
    <section className="py-20 container mx-auto px-4" id="report-preview">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">See What You Get</h2>
        <p style={{ color: "#8b949e" }} className="max-w-2xl mx-auto">
          One report, four tiers. Pay more = see more. Choose a tier to preview.
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {reportData.map((report) => (
          <button
            key={report.tier}
            onClick={() => setActiveTier(report.tier)}
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            style={{
              background: activeTier === report.tier ? "#FFD700" : "#161b22",
              color: activeTier === report.tier ? "#000" : "#fff",
              border: activeTier === report.tier ? "2px solid #FFD700" : "1px solid #30363d",
              transform: activeTier === report.tier ? "scale(1.05)" : "scale(1)",
            }}
          >
            {report.name}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
        {/* Left Side - Price & Description (40%) */}
        <div className="lg:col-span-2">
          <div
            style={{
              background: "#161b22",
              border: activeTier === "premium" ? "2px solid #FFD700" : "1px solid #30363d",
              borderRadius: "16px",
              padding: "32px",
              height: "100%",
            }}
          >
            {activeTier === "premium" && (
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: "rgba(255, 215, 0, 0.2)", color: "#FFD700" }}
              >
                ⭐ MOST POPULAR
              </div>
            )}

            <h3 className="text-2xl font-bold mb-1">{activeReport.name}</h3>
            <p className="text-sm mb-4 italic" style={{ color: "#c9a227" }}>
              &ldquo;{activeReport.tagline}&rdquo;
            </p>
            
            <div className="mb-6">
              <span
                className="font-mono text-5xl font-bold"
                style={{ color: "#FFD700" }}
              >
                {activeReport.price}
              </span>
              <span className="text-sm ml-2" style={{ color: "#8b949e" }}>
                one-time
              </span>
            </div>

            <p className="mb-6" style={{ color: "#8b949e", lineHeight: 1.7 }}>
              {activeReport.description}
            </p>

            {/* Features List */}
            <div className="mb-6">
              <h4 className="font-bold text-sm mb-3 uppercase tracking-wider" style={{ color: "#c9a227" }}>
                What&apos;s Included
              </h4>
              <ul className="space-y-2">
                {activeReport.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "#fff" }}
                  >
                    <span style={{ color: "#22c55e" }}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Included */}
            {activeReport.notIncluded.length > 0 && (
              <div className="mb-6 pt-4" style={{ borderTop: "1px solid #30363d" }}>
                <h4 className="font-bold text-sm mb-3 uppercase tracking-wider" style={{ color: "#8b949e" }}>
                  Not Included
                </h4>
                <ul className="space-y-1">
                  {activeReport.notIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: "#ef4444" }}>
                      <span>✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Upgrade tip */}
            {activeReport.upgradeTip && (
              <p className="text-xs mb-4" style={{ color: "#c9a227" }}>
                💡 {activeReport.upgradeTip}
              </p>
            )}

            {/* Buy Button */}
            <BuyButton
              tier={activeReport.tier}
              label={`Buy ${activeReport.name} — ${activeReport.price}`}
              className="btn-primary w-full text-lg py-4 mt-4"
            />
          </div>
        </div>

        {/* Right Side - Sample Preview (60%) */}
        <div className="lg:col-span-3">
          <div
            style={{
              background: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* Email Header Mockup */}
            <div
              style={{
                background: "#161b22",
                borderBottom: "1px solid #30363d",
                padding: "16px 24px",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }}></div>
                </div>
                <span className="text-xs" style={{ color: "#8b949e" }}>
                  Sample Report Preview
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: "#8b949e" }}>From:</span>
                <span className="font-semibold">FCM Intelligence &lt;reports@fcmreport.com&gt;</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: "#8b949e" }}>Subject:</span>
                <span className="font-semibold" style={{ color: "#FFD700" }}>
                  Your {activeReport.name}: {activeReport.sampleContent.location.split("•")[0].trim()}
                </span>
              </div>
            </div>

            {/* Report Content */}
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* Report Header */}
              <div className="text-center mb-6 pb-6" style={{ borderBottom: "1px solid #30363d" }}>
                <div className="text-xs uppercase tracking-widest mb-2" style={{ color: "#c9a227" }}>
                  FCM INTELLIGENCE
                </div>
                <h4 className="text-xl font-bold mb-2">{activeReport.sampleContent.title}</h4>
                <p className="text-sm" style={{ color: "#8b949e" }}>
                  {activeReport.sampleContent.location}
                </p>
                <div className="mt-4 inline-flex items-center gap-3">
                  <span
                    className="inline-block px-4 py-2 rounded-lg text-2xl font-bold"
                    style={{
                      background: "rgba(201, 162, 39, 0.15)",
                      color: "#c9a227",
                      border: "1px solid rgba(201, 162, 39, 0.3)",
                    }}
                  >
                    {activeReport.sampleContent.score}
                  </span>
                  <span className="text-sm" style={{ color: "#8b949e" }}>
                    {activeReport.sampleContent.scoreLabel}
                  </span>
                </div>
              </div>

              {/* Report Sections */}
              <div className="space-y-4">
                {activeReport.sampleContent.sections.map((section, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#161b22",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #30363d",
                    }}
                  >
                    <h5 className="font-bold mb-2" style={{ color: "#fff" }}>
                      {section.title}
                    </h5>
                    <p
                      className="text-sm whitespace-pre-line"
                      style={{ color: "#8b949e", lineHeight: 1.6 }}
                    >
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sample Footer */}
              <div
                className="mt-6 pt-6 text-center"
                style={{ borderTop: "1px solid #30363d" }}
              >
                <p className="text-xs" style={{ color: "#57606a" }}>
                  This is a sample preview. Your actual report will contain detailed analysis specific to your chosen listing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade messaging */}
      <div className="text-center mt-8">
        <p className="text-sm" style={{ color: "#8b949e" }}>
          Pay the difference to upgrade anytime — no new research needed.
        </p>
        <p className="text-xs mt-1" style={{ color: "#57606a" }}>
          Scout → Insight (+£50) | Insight → Analysis (+£100) | Analysis → Intelligence (+£200)
        </p>
      </div>
    </section>
  );
}
