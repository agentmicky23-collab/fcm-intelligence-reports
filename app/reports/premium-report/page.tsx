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
            Help me buy it. The complete intelligence package. Everything in Analysis plus profit improvement plan, due diligence &amp; negotiation pack, and a 60-minute consultation call.
          </p>

          <div className="flex items-baseline gap-3 mb-8">
            <span
              className="text-5xl font-bold"
              style={{ fontFamily: "JetBrains Mono", color: "#FFD700" }}
            >
              £449
            </span>
            <span style={{ color: "#8b949e" }}>inc. VAT | One-time payment</span>
          </div>

          <div className="mb-8 p-4 rounded-lg inline-block" style={{ background: "rgba(255, 215, 0, 0.1)", border: "1px solid #FFD700" }}>
            <p className="text-sm" style={{ color: "#FFD700" }}>
              📞 <strong>Includes 60-minute consultation call</strong> — not available separately or with other tiers.
            </p>
          </div>

          <div>
            <BuyButton tier="premium" label="Buy Intelligence Report — £449" className="btn-primary text-lg px-8 py-4" />
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Everything Included
          </h2>

          {/* Business Analysis */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6" style={{ color: "#FFD700" }}>
              📊 Intelligence-Exclusive Sections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: "✅",
                  title: "Everything in Analysis Report",
                  desc: "Full financial deep dive + location intelligence",
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
                {
                  icon: "🤝",
                  title: "Negotiation Strategy + 60-min Consultation",
                  desc: "Leverage analysis, suggested offer range, expert call",
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

          {/* Location Intelligence */}
          <div>
            <h3 className="text-2xl font-bold mb-6" style={{ color: "#FFD700" }}>
              📍 Full Location Intelligence (included from Insight tier)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: "🏠",
                  title: "Property & Affluence Analysis",
                  desc: "House prices, area wealth indicators",
                },
                {
                  icon: "👥",
                  title: "Demographics & Consumer Profile",
                  desc: "Who lives here, what they buy",
                },
                {
                  icon: "🛡️",
                  title: "Crime & Safety Analysis",
                  desc: "Crime rates and safety scores",
                },
                {
                  icon: "🏢",
                  title: "Competition Mapping",
                  desc: "Every nearby competitor mapped",
                },
                {
                  icon: "🚶",
                  title: "Footfall Analysis",
                  desc: "Estimated pedestrian traffic",
                },
                {
                  icon: "📷",
                  title: "Street View & Maps",
                  desc: "Visual context and area mapping",
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

          {/* Action Roadmap */}
          <div className="mt-12 p-8 rounded-lg text-center" style={{ background: "rgba(255, 215, 0, 0.1)", border: "1px solid #FFD700" }}>
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#FFD700" }}>
              Detailed Action Roadmap
            </h3>
            <p style={{ color: "#8b949e" }}>
              Step-by-step plan: what to offer, what to negotiate, what to watch out for, and how to structure the deal.
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
                  📍 Location Analysis:
                </h4>
                <ul className="list-disc list-inside space-y-2" style={{ color: "#8b949e", fontSize: "0.9rem" }}>
                  <li>Location Grade: B+ (good, not great)</li>
                  <li>Footfall: Medium (village location, steady traffic)</li>
                  <li>Demographics: 60% age 50+ (ideal for PO services)</li>
                  <li>Crime: Below national average (safe area)</li>
                  <li>Competitors: 1 convenience store (0.3 miles away)</li>
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

            <p className="text-sm" style={{ color: "#8b949e" }}>
              This is what you get — the complete picture that gives you confidence to move forward (or walk away).
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
                We've run 40+ Post Office branches. We know exactly what to look for.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFD700" }}>
                Data-Driven Analysis
              </h3>
              <p style={{ color: "#8b949e" }}>
                No guesswork. Every report is built on real data, benchmarks, and operational experience.
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
                3-5 business days from order confirmation. This is comprehensive work — we do it right.
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
                Professional PDF, mobile-friendly, 30-40 pages with financial analysis, location maps, demographic data, and actionable recommendations.
              </p>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{ background: "#1A1A1A", border: "1px solid #333333" }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFD700" }}>
                When is the consultation call?
              </h3>
              <p style={{ color: "#8b949e" }}>
                Scheduled after you've reviewed the report. 60 minutes to discuss findings, answer questions, and plan your next steps.
              </p>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{ background: "#1A1A1A", border: "1px solid #333333" }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFD700" }}>
                Why Intelligence over Analysis?
              </h3>
              <p style={{ color: "#8b949e" }}>
                Intelligence adds the profit improvement plan, full due diligence pack, negotiation strategy, and a 60-minute consultation call. It&apos;s the difference between knowing the numbers and knowing how to act on them.
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
            Serious buyers who want the complete picture before committing • First-time buyers who want confidence • Operators expanding their portfolio
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get the Complete Picture
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#8b949e" }}>
            Business financials + location intelligence + expert consultation = confidence to move forward.
          </p>
          <BuyButton tier="premium" label="Get Intelligence Report — £449" className="btn-primary text-lg px-10 py-4" />
          <div className="mt-6 flex items-center justify-center gap-4 text-sm" style={{ color: "#8b949e" }}>
            <span className="flex items-center gap-2">
              <span style={{ color: "#FFD700" }}>🔒</span> Secure payment via Stripe
            </span>
            <span>|</span>
            <span>14-day money-back guarantee</span>
          </div>

          <div className="mt-8 p-6 rounded-lg inline-block" style={{ background: "#1A1A1A", border: "1px solid #333333" }}>
            <p className="text-sm" style={{ color: "#8b949e" }}>
              💡 <strong style={{ color: "#FFD700" }}>Not sure which report?</strong> <Link href="/reports" className="underline" style={{ color: "#FFD700" }}>Compare all reports</Link> or <Link href="/#contact" className="underline" style={{ color: "#FFD700" }}>contact us</Link> for guidance.
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
