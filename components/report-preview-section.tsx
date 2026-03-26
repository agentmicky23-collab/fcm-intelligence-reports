"use client";

import { useState } from "react";
import { BuyButton } from "./buy-button";

type ReportTier = "insight" | "intelligence";

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
    tier: "insight",
    name: "Insight Report",
    price: "£199",
    tagline: "Is this the right business?",
    description: "Full location intelligence with demographics, crime data, footfall analysis, competition mapping, and comprehensive risk assessment. 10 sections covering everything you need to decide if a business is worth pursuing.",
    features: [
      "Executive Summary & Verdict",
      "PO Remuneration Analysis",
      "Online Presence & Reviews",
      "Location Intelligence (Street View, maps, photos)",
      "Demographics & Community Profile",
      "Crime & Safety Analysis",
      "Competition Mapping",
      "Footfall Analysis",
      "Infrastructure & Connectivity",
      "Risk Assessment",
    ],
    notIncluded: [
      "Financial analysis",
      "Staffing & hidden costs",
      "Profit improvement plan",
      "Due diligence pack",
    ],
    upgradeTip: "Want the full picture? Upgrade to Intelligence (+£300)",
    sampleContent: {
      title: "Insight Report",
      location: "CW11 1HN • Sandbach, Cheshire East",
      score: "A",
      scoreLabel: "Location Score: 85/100",
      sections: [
        { title: "📋 Executive Summary", content: "Main Post Office with retail counter on a busy high street. Good visibility and footfall. Initial indicators positive — strong location fundamentals with manageable competition." },
        { title: "📍 Location Intelligence", content: "High street location with daily footfall of 3,200+. Anchor stores: Tesco Express, Boots, Costa. Good visibility from main road." },
        { title: "👥 Demographics", content: "Median age: 42. Household income: £38,400 (12% above regional avg). Home ownership: 68%. Retired population: 22%." },
        { title: "🛡️ Crime & Safety", content: "Crime rate: 42 per 1,000 (Low). Anti-social behaviour: Below average. Shoplifting incidents: 8/year (Low risk)." },
        { title: "🏢 Competition Map", content: "Nearest Post Office: 2.8km (Sandbach Heath). Competing retailers: 12 within 500m. Market saturation: Low." },
      ],
    },
  },
  {
    tier: "intelligence",
    name: "Intelligence Report",
    price: "£499",
    tagline: "Help me buy it.",
    description: "The complete intelligence package. Everything in Insight plus financial analysis, staffing costs, future outlook, profit improvement plan, and due diligence pack. All 15 sections.",
    features: [
      "Everything in Insight (10 sections)",
      "Financial Analysis (P&L, benchmarks, valuation)",
      "Staffing & Hidden Costs (true employment cost calculator)",
      "Future Outlook (5-year timeline, planning, developments)",
      "Profit Improvement Plan (evidence-based, tied to findings)",
      "Due Diligence Pack (documents checklist, seller & landlord questions)",
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
  const [activeTier, setActiveTier] = useState<ReportTier>("intelligence");
  const activeReport = reportData.find((r) => r.tier === activeTier)!;

  return (
    <section className="py-20 container mx-auto px-4" id="report-preview">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">See What You Get</h2>
        <p style={{ color: "#8b949e" }} className="max-w-2xl mx-auto">
          Two tiers. Choose the depth that fits your stage.
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {reportData.map((report) => (
          <button
            key={report.tier}
            onClick={() => setActiveTier(report.tier)}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            style={{
              background: activeTier === report.tier ? "#FFD700" : "#161b22",
              color: activeTier === report.tier ? "#000" : "#fff",
              border: activeTier === report.tier ? "2px solid #FFD700" : "1px solid #30363d",
              transform: activeTier === report.tier ? "scale(1.05)" : "scale(1)",
            }}
          >
            {report.name} — {report.price}
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
              border: activeTier === "intelligence" ? "2px solid #FFD700" : "1px solid #30363d",
              borderRadius: "16px",
              padding: "32px",
              height: "100%",
            }}
          >
            {activeTier === "intelligence" && (
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
          Start with Insight. Upgrade to Intelligence anytime — pay the difference (£300), no new research needed.
        </p>
      </div>
    </section>
  );
}
