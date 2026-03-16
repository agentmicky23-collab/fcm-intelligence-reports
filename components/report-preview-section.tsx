"use client";

import { useState } from "react";
import { BuyButton } from "./buy-button";

type ReportTier = "location" | "basic" | "professional" | "premium";

interface ReportInfo {
  tier: ReportTier;
  name: string;
  price: string;
  description: string;
  features: string[];
  notIncluded: string[];
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
    name: "Location Report",
    price: "£99",
    description: "Comprehensive location analysis. Perfect for investors evaluating catchment potential or as an add-on to any business report.",
    features: [
      "Location Score (A-F rating)",
      "Street View & Maps integration",
      "Demographics profile (age, income, employment)",
      "House prices & affluence indicators",
      "Crime & safety data analysis",
      "Competition mapping (500m-2km radius)",
      "Footfall analysis & drivers",
      "15-20 page PDF report",
    ],
    notIncluded: [
      "Business financials",
      "Revenue analysis",
      "Consultation call",
    ],
    sampleContent: {
      title: "Location Intelligence Report",
      location: "CW11 1HN • Sandbach, Cheshire East",
      score: "A",
      scoreLabel: "Location Score: 85/100",
      sections: [
        { title: "📍 Catchment Analysis", content: "Primary catchment: 8,450 residents within 1km. High street location with daily footfall of 3,200+. Anchor stores: Tesco Express, Boots, Costa." },
        { title: "👥 Demographics", content: "Median age: 42. Household income: £38,400 (12% above regional avg). Home ownership: 68%. Retired population: 22%." },
        { title: "🏠 Property & Affluence", content: "Average house price: £253,000. Property transactions: 124/year. ACORN classification: Comfortable Communities." },
        { title: "🛡️ Crime & Safety", content: "Crime rate: 42 per 1,000 (Low). Anti-social behaviour: Below average. Shoplifting incidents: 8/year (Low risk)." },
        { title: "🏢 Competition Map", content: "Nearest Post Office: 2.8km (Sandbach Heath). Competing retailers: 12 within 500m. Market saturation: Low." },
      ],
    },
  },
  {
    tier: "basic",
    name: "Basic Report",
    price: "£149",
    description: "Quick sanity check before investing serious time. Get the fundamentals and our Go/No-Go recommendation in 24-48 hours.",
    features: [
      "Business overview & summary",
      "Key metrics at a glance",
      "Red flags identification",
      "Go/No-Go recommendation",
      "6-10 page PDF report",
      "24-48 hour turnaround",
    ],
    notIncluded: [
      "Financial deep dive",
      "Location Intelligence",
      "P&L breakdown",
      "Consultation call",
    ],
    sampleContent: {
      title: "Basic Due Diligence Report",
      location: "Sandbach Post Office • CW11 1HN",
      score: "B",
      scoreLabel: "Quick Assessment",
      sections: [
        { title: "📋 Business Overview", content: "Main Post Office with retail counter. Trading 6 days/week. Current owner: 8 years. Reason for sale: Retirement." },
        { title: "📊 Key Metrics", content: "Asking Price: £125,000. PO Remuneration: £67,400/yr. Estimated sessions: 40,000/yr. Staff: 2 PT employees." },
        { title: "⚠️ Red Flags Check", content: "✅ No pending Post Office contract issues\n✅ Lease has 12+ years remaining\n✅ No major competition changes planned\n⚠️ Parking limited to 4 spaces" },
        { title: "✅ Recommendation", content: "GO — Solid fundamentals. Recommend Professional Report for full financial analysis before making an offer." },
      ],
    },
  },
  {
    tier: "professional",
    name: "Professional Report",
    price: "£249",
    description: "Comprehensive financial analysis for serious buyers. Includes everything in Basic plus deep-dive financials and a 30-minute consultation call.",
    features: [
      "Everything in Basic Report",
      "Financial deep dive",
      "P&L breakdown analysis",
      "PO Remuneration analysis",
      "Competition overview",
      "Revenue stream breakdown",
      "20-25 page PDF report",
      "30-minute consultation call",
      "Infrastructure Analysis (NEW)",
      "— Mobile network performance",
      "— Fixed broadband (FTTP status)",
      "— Connectivity reliability scores",
      "— Power infrastructure assessment",
      "— Transport & EV charging access",
    ],
    notIncluded: [
      "Full Location Intelligence",
      "Demographics deep-dive",
      "Crime & safety analysis",
    ],
    sampleContent: {
      title: "Professional Intelligence Report",
      location: "Sandbach Post Office • CW11 1HN",
      score: "B+",
      scoreLabel: "Business Score: 72/100",
      sections: [
        { title: "💰 Financial Summary", content: "Est. Annual Revenue: £185,000\nPO Remuneration: £67,400 (36%)\nRetail Gross Profit: £48,000\nEst. Net Profit: £42,000\nROI at asking price: 33.6%" },
        { title: "📈 P&L Breakdown", content: "Wages: £28,400 (15%)\nRent: £18,000 (10%)\nUtilities: £4,800 (3%)\nStock: £62,000 (34%)\nOther: £8,000 (4%)" },
        { title: "🏢 Competition Analysis", content: "Primary competitor: WHSmith (1.2km). Parcel shop competition: Low. Banking services: Nearest bank branch closing Q3 2026 — OPPORTUNITY." },
        { title: "📡 Infrastructure", content: "Mobile: EE 4G excellent, 5G available. Broadband: FTTP available (500Mbps). Power: Stable grid, UPS recommended. EV charging: 2 points within 200m." },
        { title: "💡 Profit Improvement", content: "1. Add parcel locker (£3-5k revenue)\n2. Extend banking hours (£2-4k revenue)\n3. Lottery terminal upgrade (£1-2k revenue)\nTotal potential uplift: £6-11k/year" },
      ],
    },
  },
  {
    tier: "premium",
    name: "Premium Report",
    price: "£449",
    description: "The complete picture. Full business analysis PLUS comprehensive location intelligence. Everything you need to make a confident acquisition decision.",
    features: [
      "Everything in Professional Report",
      "📍 Full Location Intelligence",
      "🏠 Demographics & Affluence analysis",
      "🛡️ Crime & Safety deep-dive",
      "🏢 Competition Mapping (2km radius)",
      "👣 Footfall Analysis & drivers",
      "30-40 page PDF report",
      "60-minute consultation call",
      "Action roadmap & recommendations",
      "Full Infrastructure Analysis:",
      "— Mobile network performance",
      "— Fixed broadband (FTTP status)",
      "— Connectivity reliability",
      "— Power infrastructure (UPS/generator recs)",
      "— Transport & accessibility (EV charging)",
      "— Utilities resilience assessment",
      "— Emergency services response times",
      "— Digital roadmap (FTTP rollout, 5G)",
      "— Cost-benefit analysis",
      "— Infrastructure risk matrix",
    ],
    notIncluded: [],
    sampleContent: {
      title: "Premium Intelligence Report",
      location: "Sandbach Post Office • CW11 1HN",
      score: "B+",
      scoreLabel: "Overall: 72/100 | Location: A (85/100)",
      sections: [
        { title: "🎯 Executive Summary", content: "Strong acquisition opportunity. Business score B+ with excellent A-rated location. Projected 3-year ROI: 98%. Key risk: Limited parking. Key opportunity: Banking services expansion." },
        { title: "💰 Financial Analysis", content: "Est. Annual Revenue: £185,000\nPO Remuneration: £67,400\nNet Profit: £42,000\nValuation: Fair at asking price\nRecommended offer: £115,000-£120,000" },
        { title: "📍 Location Score: A", content: "Catchment: 8,450 residents (1km)\nFootfall: 3,200+ daily\nCompetition: Low\nCrime: Low (42/1,000)\nAffluence: Above average" },
        { title: "📡 Infrastructure Analysis", content: "Mobile: EE/Vodafone 4G excellent, 5G planned Q4 2026\nBroadband: FTTP available, 500Mbps\nPower: Stable, UPS recommended for PO equipment\nEV: 2 charging points within 200m\nEmergency response: 8min average" },
        { title: "🚀 Action Roadmap", content: "Month 1-3: Complete acquisition, maintain operations\nMonth 4-6: Add parcel locker, extend banking hours\nMonth 7-12: Marketing push, loyalty programme\nYear 2: Consider retail expansion into adjacent unit" },
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
          Choose a report tier to see exactly what&apos;s included
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

            <h3 className="text-2xl font-bold mb-2">{activeReport.name}</h3>
            
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
                    style={{ color: feature.startsWith("—") ? "#8b949e" : "#fff" }}
                  >
                    {!feature.startsWith("—") && (
                      <span style={{ color: "#22c55e" }}>✓</span>
                    )}
                    <span style={{ marginLeft: feature.startsWith("—") ? "16px" : 0 }}>
                      {feature}
                    </span>
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
    </section>
  );
}
