"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { BuyButton } from "@/components/buy-button";

export default function ProfessionalReportPage() {
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
            Analysis Report
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.2 }}
          >
            Analysis Report
          </h1>

          <p className="text-xl mb-8 max-w-3xl" style={{ color: "#8b949e" }}>
            Should you make an offer? Everything in Insight plus full financial analysis, PO remuneration, staffing costs, and future outlook.
          </p>

          <div className="flex items-baseline gap-3 mb-8">
            <span
              className="text-5xl font-bold"
              style={{ fontFamily: "JetBrains Mono", color: "#FFD700" }}
            >
              £249
            </span>
            <span style={{ color: "#8b949e" }}>inc. VAT | One-time payment</span>
          </div>

          <BuyButton tier="professional" label="Buy Analysis Report — £249" className="btn-primary text-lg px-8 py-4" />
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
                icon: "✅",
                title: "Everything in Insight Report",
                desc: "Full location intelligence, demographics, crime, competition",
              },
              {
                icon: "💰",
                title: "Full Financial Deep Dive",
                desc: "Line-by-line analysis of revenue and costs",
              },
              {
                icon: "📊",
                title: "P&L Analysis & Breakdown",
                desc: "Where the money comes from and where it goes",
              },
              {
                icon: "📮",
                title: "Post Office Remuneration Analysis",
                desc: "Verify PO income claims against industry benchmarks",
              },
              {
                icon: "💸",
                title: "Revenue Stream Breakdown",
                desc: "PO, retail, lottery, services — what's driving income?",
              },
              {
                icon: "🏢",
                title: "Competition Overview",
                desc: "Who else is operating nearby and how they impact you",
              },
              {
                icon: "📈",
                title: "Staffing & Hidden Costs",
                desc: "True employment cost calculator — NI, pension, holiday cover",
              },
              {
                icon: "🔮",
                title: "Future Outlook",
                desc: "5-year timeline, local planning, infrastructure developments",
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

          {/* Not Included */}
          <div className="mt-12 p-6 rounded-lg" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            <h3 className="font-bold text-lg mb-4" style={{ color: "#ef4444" }}>
              Not Included in Analysis:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p style={{ color: "#ef4444" }}>❌ Profit improvement plan</p>
              <p style={{ color: "#ef4444" }}>❌ Due diligence pack</p>
              <p style={{ color: "#ef4444" }}>❌ Negotiation strategy</p>
              <p style={{ color: "#ef4444" }}>❌ Consultation call</p>
            </div>
            <p className="mt-4 text-sm" style={{ color: "#8b949e" }}>
              💡 Want the full package? Upgrade to <Link href="/reports/premium-report" className="underline" style={{ color: "#FFD700" }}>Intelligence (+£200)</Link> — pay the difference anytime.
            </p>
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
              Example: Financial Breakdown — Altrincham Branch
            </h3>
            <p className="text-sm mb-6" style={{ color: "#8b949e" }}>
              From a real Analysis Report (simplified)
            </p>

            <div className="space-y-6 mb-6" style={{ fontFamily: "JetBrains Mono", fontSize: "0.9rem" }}>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: "#FFFFFF" }}>
                  Revenue Breakdown:
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span style={{ color: "#8b949e" }}>Post Office remuneration:</span>
                    <span style={{ color: "#FFFFFF", fontWeight: "600" }}>£72,000 (51%)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span style={{ color: "#8b949e" }}>Retail sales:</span>
                    <span style={{ color: "#FFFFFF", fontWeight: "600" }}>£48,000 (34%)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span style={{ color: "#8b949e" }}>Lottery commission:</span>
                    <span style={{ color: "#FFFFFF", fontWeight: "600" }}>£12,000 (9%)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span style={{ color: "#8b949e" }}>Other services:</span>
                    <span style={{ color: "#FFFFFF", fontWeight: "600" }}>£8,000 (6%)</span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 border-gray-600">
                    <span style={{ color: "#FFD700", fontWeight: "600" }}>Total Revenue:</span>
                    <span style={{ color: "#FFD700", fontWeight: "700" }}>£140,000</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3" style={{ color: "#FFFFFF" }}>
                  Our Analysis:
                </h4>
                <p style={{ color: "#8b949e" }}>
                  ✅ PO remuneration verified against NFSP benchmarks — accurate<br/>
                  ⚠️ Retail margin lower than expected (investigate stock management)<br/>
                  ✅ Lottery performance strong for area demographic<br/>
                  💡 <strong style={{ color: "#FFD700" }}>Recommendation:</strong> Offer £95k (0.68x revenue) — accounts solid
                </p>
              </div>
            </div>

            <p className="text-sm" style={{ color: "#8b949e" }}>
              This is what you get — deep financial intelligence that helps you negotiate with confidence.
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
                We've run 40+ Post Office branches. We know what the numbers should look like.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFD700" }}>
                Data-Driven Analysis
              </h3>
              <p style={{ color: "#8b949e" }}>
                No guesswork. Every report is built on real benchmarks and operational experience.
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
                3-5 business days from order confirmation. Rush delivery available for +£75.
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
                Professional PDF, mobile-friendly, 20-25 pages with financial tables, charts, and benchmarks.
              </p>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{ background: "#1A1A1A", border: "1px solid #333333" }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFD700" }}>
                Can I upgrade later?
              </h3>
              <p style={{ color: "#8b949e" }}>
                Yes — upgrade to Intelligence (+£200) anytime to get the profit improvement plan, due diligence pack, negotiation strategy, and a 60-minute consultation call. Just pay the difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Best For */}
      <section className="py-12" style={{ background: "rgba(255, 215, 0, 0.05)" }}>
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: "#FFD700" }}>
            Best For:
          </h3>
          <p className="text-lg" style={{ color: "#8b949e" }}>
            Serious buyers ready to evaluate financials and make an informed offer
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Know the Numbers Before You Negotiate
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#8b949e" }}>
            Comprehensive financial analysis + expert consultation to help you make the right offer.
          </p>
          <BuyButton tier="professional" label="Get Analysis Report — £249" className="btn-primary text-lg px-10 py-4" />
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
