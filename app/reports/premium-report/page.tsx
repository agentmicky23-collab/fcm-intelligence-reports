"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { BuyButton } from "@/components/buy-button";

export default function PremiumReportPage() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)",
        }}
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <Link
            href="/reports"
            className="text-sm mb-6 inline-block hover:opacity-80"
            style={{ color: "#FFD700" }}
          >
            ← All Reports
          </Link>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase mb-6"
            style={{
              background: "#FFD700",
              color: "#000000",
            }}
          >
            ⭐ MOST POPULAR
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.2 }}
          >
            Intelligence Report
          </h1>

          <p className="text-xl mb-8 max-w-3xl" style={{ color: "#8b949e" }}>
            Help me buy it. The complete intelligence package — all 15 sections including financial analysis, profit improvement plan, and due diligence pack.
          </p>

          <div className="flex items-baseline gap-3 mb-8">
            <span
              className="text-5xl font-bold"
              style={{ fontFamily: "JetBrains Mono", color: "#FFD700" }}
            >
              £499
            </span>
            <span style={{ color: "#8b949e" }}>inc. VAT | One-time payment</span>
          </div>

          <div>
            <BuyButton tier="intelligence" label="Buy Intelligence Report — £499" className="btn-primary text-lg px-8 py-4" />
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            All 15 Sections Included
          </h2>

          {/* Intelligence-Exclusive Sections */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6" style={{ color: "#FFD700" }}>
              📊 Intelligence-Only Sections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: "💰",
                  title: "Financial Analysis",
                  desc: "P&L breakdown, benchmarks, valuation assessment",
                },
                {
                  icon: "👥",
                  title: "Staffing & Hidden Costs",
                  desc: "True employment cost calculator including NI, pension, holiday cover",
                },
                {
                  icon: "📈",
                  title: "Future Outlook",
                  desc: "5-year timeline, local planning, developments",
                },
                {
                  icon: "🚀",
                  title: "Profit Improvement Plan",
                  desc: "Evidence-based recommendations tied to report findings",
                },
                {
                  icon: "📋",
                  title: "Due Diligence Pack",
                  desc: "Documents checklist, seller & landlord questions",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-6 rounded-lg"
                  style={{ background: "#1A1A1A", border: "1px solid #333333" }}
                >
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2" style={{ color: "#FFFFFF" }}>
                      {item.title}
                    </h4>
                    <p className="text-sm" style={{ color: "#8b949e" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight Sections (included) */}
          <div>
            <h3 className="text-2xl font-bold mb-6" style={{ color: "#FFD700" }}>
              📍 Plus All 10 Insight Sections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: "📋", title: "Executive Summary & Verdict", desc: "High-level snapshot and recommendation" },
                { icon: "💷", title: "PO Remuneration Analysis", desc: "Income breakdown and verification" },
                { icon: "🌐", title: "Online Presence & Reviews", desc: "Digital footprint assessment" },
                { icon: "📍", title: "Location Intelligence", desc: "Street View, maps, area context" },
                { icon: "👥", title: "Demographics & Community", desc: "Who lives here, spending patterns" },
                { icon: "🛡️", title: "Crime & Safety", desc: "Crime rates and safety analysis" },
                { icon: "🏢", title: "Competition Mapping", desc: "Every nearby competitor mapped" },
                { icon: "🚶", title: "Footfall Analysis", desc: "Pedestrian traffic estimates" },
                { icon: "📡", title: "Infrastructure & Connectivity", desc: "Transport, broadband, amenities" },
                { icon: "⚠️", title: "Risk Assessment", desc: "Comprehensive risk evaluation" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-lg"
                  style={{ background: "rgba(22,27,34,0.8)", border: "1px solid #30363d" }}
                >
                  <div className="text-2xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: "#FFFFFF" }}>
                      {item.title}
                    </h4>
                    <p className="text-sm" style={{ color: "#8b949e" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sample Extract */}
      <section className="py-16" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Sample Extract
          </h2>

          <div
            className="p-8 rounded-lg"
            style={{ background: "#1A1A1A", border: "1px solid #333333" }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FFD700" }}>
              Example: Executive Summary — Bilsborrow Branch
            </h3>
            <p className="text-sm mb-6" style={{ color: "#8b949e" }}>
              From a real Intelligence Report (simplified)
            </p>

            <div className="space-y-6 mb-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: "#FFFFFF" }}>
                  📊 Financial Overview:
                </h4>
                <ul className="list-disc list-inside space-y-2" style={{ color: "#8b949e", fontSize: "0.9rem" }}>
                  <li>Revenue: £152,000 | Asking: £110,000 (0.72x multiple)</li>
                  <li>PO remuneration: £88k (58%) — verified ✅</li>
                  <li>Retail margin: 22% (below average — investigate)</li>
                  <li>Operating profit: £45k (strong for area)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3" style={{ color: "#FFFFFF" }}>
                  🎯 Our Recommendation:
                </h4>
                <div className="p-4 rounded" style={{ background: "rgba(255, 215, 0, 0.1)" }}>
                  <p style={{ color: "#FFD700", fontSize: "0.9rem", fontWeight: "600" }}>
                    ✅ STRONG BUY — Offer £95k (0.62x), negotiate up to £105k max
                  </p>
                  <p style={{ color: "#8b949e", fontSize: "0.85rem", marginTop: "8px" }}>
                    Solid financials, good location, low competition. Retail margin issue is fixable with better stock management. ROI estimate: 3.5 years.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get the Complete Picture
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#8b949e" }}>
            All 15 sections of intelligence. Everything you need to make a confident acquisition decision.
          </p>
          <BuyButton tier="intelligence" label="Get Intelligence Report — £499" className="btn-primary text-lg px-10 py-4" />
          <div className="mt-6 flex items-center justify-center gap-4 text-sm" style={{ color: "#8b949e" }}>
            <span className="flex items-center gap-2">
              <span style={{ color: "#FFD700" }}>🔒</span> Secure payment via Stripe
            </span>
            <span>|</span>
            <span>14-day money-back guarantee</span>
          </div>

          <div className="mt-8 p-6 rounded-lg inline-block" style={{ background: "#1A1A1A", border: "1px solid #333333" }}>
            <p className="text-sm" style={{ color: "#8b949e" }}>
              💡 <strong style={{ color: "#FFD700" }}>Not ready for Intelligence?</strong> Start with <Link href="/reports" className="underline" style={{ color: "#FFD700" }}>Insight (£199)</Link> and upgrade later — pay the difference.
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
