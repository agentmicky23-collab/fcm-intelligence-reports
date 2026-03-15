"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { BuyButton } from "@/components/buy-button";

export default function LocationAnalysisPage() {
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
            className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase mb-6"
            style={{
              background: "rgba(255, 215, 0, 0.15)",
              border: "1px solid #FFD700",
              color: "#FFD700",
            }}
          >
            Location Intelligence
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.2 }}
          >
            Location Analysis Report
          </h1>

          <p className="text-xl mb-8 max-w-3xl" style={{ color: "#8b949e" }}>
            Standalone location intelligence for any Post Office or retail property. Know the area before you buy.
          </p>

          <div className="flex items-baseline gap-3 mb-8">
            <span
              className="text-5xl font-bold"
              style={{ fontFamily: "JetBrains Mono", color: "#FFD700" }}
            >
              £99
            </span>
            <span style={{ color: "#8b949e" }}>inc. VAT | One-time payment</span>
          </div>

          <BuyButton tier="location" label="Buy Location Report — £99" className="btn-primary text-lg px-8 py-4" />
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            What's Included
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: "📍",
                title: "Location Score (A-F grade)",
                desc: "Data-driven assessment of the area's commercial viability",
              },
              {
                icon: "📷",
                title: "Street View Imagery",
                desc: "Visual context of the property and surrounding area",
              },
              {
                icon: "🗺️",
                title: "Area Mapping",
                desc: "Catchment analysis and geographic context",
              },
              {
                icon: "👥",
                title: "Demographics Breakdown",
                desc: "Population age, income, household composition",
              },
              {
                icon: "🏠",
                title: "House Prices & Affluence",
                desc: "Property values and area wealth indicators",
              },
              {
                icon: "🛒",
                title: "Consumer Profile",
                desc: "Spending habits and shopping behaviors",
              },
              {
                icon: "🛡️",
                title: "Crime & Safety Analysis",
                desc: "Crime rates and safety scores for the area",
              },
              {
                icon: "🏢",
                title: "Competition Mapping",
                desc: "Nearby Post Offices, convenience stores, competitors",
              },
              {
                icon: "🚶",
                title: "Footfall Analysis",
                desc: "Estimated pedestrian traffic and peak times",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 rounded-lg"
                style={{ background: "#1A1A1A", border: "1px solid #333333" }}
              >
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: "#FFFFFF" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#8b949e" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
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
            <h3 className="text-xl font-bold mb-4" style={{ color: "#FFD700" }}>
              Example: Stockport Town Centre PO
            </h3>

            <div className="space-y-4 mb-6" style={{ fontFamily: "JetBrains Mono", fontSize: "0.9rem" }}>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span style={{ color: "#8b949e" }}>Location Grade:</span>
                <span style={{ color: "#FFD700", fontWeight: "600" }}>A-</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span style={{ color: "#8b949e" }}>Footfall Score:</span>
                <span style={{ color: "#FFFFFF", fontWeight: "600" }}>82/100 (High)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span style={{ color: "#8b949e" }}>Median House Price:</span>
                <span style={{ color: "#FFFFFF", fontWeight: "600" }}>£285,000</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span style={{ color: "#8b949e" }}>Crime Rate:</span>
                <span style={{ color: "#FFFFFF", fontWeight: "600" }}>Below average</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span style={{ color: "#8b949e" }}>Nearby Competitors:</span>
                <span style={{ color: "#FFFFFF", fontWeight: "600" }}>2 within 0.5 miles</span>
              </div>
            </div>

            <p className="text-sm" style={{ color: "#8b949e" }}>
              This is what you get — data-driven intelligence that tells you if the location is worth pursuing, before you spend hours on financials.
            </p>
          </div>
        </div>
      </section>

      {/* Why FCM Intelligence */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Why FCM Intelligence?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFD700" }}>
                15+ Years Operating
              </h3>
              <p style={{ color: "#8b949e" }}>
                We've run 40+ Post Office branches. We know what works and what doesn't.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFD700" }}>
                Data-Driven Analysis
              </h3>
              <p style={{ color: "#8b949e" }}>
                No guesswork. Every report is built on real demographic, crime, and footfall data.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFD700" }}>
                Operator-to-Operator
              </h3>
              <p style={{ color: "#8b949e" }}>
                No broker fluff. Just the numbers and insights that matter for your decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div
              className="p-6 rounded-lg"
              style={{ background: "#1A1A1A", border: "1px solid #333333" }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFD700" }}>
                How long does delivery take?
              </h3>
              <p style={{ color: "#8b949e" }}>
                Instant download — PDF delivered within 3-5 business days (or 48 hours for rush orders).
              </p>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{ background: "#1A1A1A", border: "1px solid #333333" }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFD700" }}>
                Can I get a refund?
              </h3>
              <p style={{ color: "#8b949e" }}>
                Yes — 14-day money-back guarantee if you're not satisfied with the quality of the intelligence.
              </p>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{ background: "#1A1A1A", border: "1px solid #333333" }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFD700" }}>
                What format is the report?
              </h3>
              <p style={{ color: "#8b949e" }}>
                Professional PDF, mobile-friendly, 15-20 pages with maps, charts, and data tables.
              </p>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{ background: "#1A1A1A", border: "1px solid #333333" }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFD700" }}>
                Can I combine this with other reports?
              </h3>
              <p style={{ color: "#8b949e" }}>
                Absolutely! Add Location Analysis to any Basic or Professional report. Or upgrade to Premium to get everything in one package.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Know the Area Before You Buy
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#8b949e" }}>
            Get the location intelligence you need to make a smart decision.
          </p>
          <BuyButton tier="location" label="Get Location Report — £99" className="btn-primary text-lg px-10 py-4" />
          <div className="mt-6 flex items-center justify-center gap-4 text-sm" style={{ color: "#8b949e" }}>
            <span className="flex items-center gap-2">
              <span style={{ color: "#FFD700" }}>🔒</span> Secure payment via Stripe
            </span>
            <span>|</span>
            <span>14-day money-back guarantee</span>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
