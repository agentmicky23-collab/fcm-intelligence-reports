"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { BuyButton } from "@/components/buy-button";

export default function ReportsPage() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="pt-32 pb-12" style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">
            Intelligence <span style={{ color: '#c9a227' }}>Reports</span>
          </h1>
          <p className="text-xl" style={{ color: '#8b949e' }}>Data-driven insight for every stage of your acquisition journey.</p>
        </div>
      </section>

      {/* Pricing Strip */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="font-bold" style={{ color: '#8b949e' }}>Scout</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£99</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Should I look?</div>
            </div>
            <div style={{ color: '#30363d' }}>→</div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="font-bold" style={{ color: '#8b949e' }}>Insight</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£149</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Is the area good?</div>
            </div>
            <div style={{ color: '#30363d' }}>→</div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="font-bold" style={{ color: '#8b949e' }}>Analysis</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£249</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Make an offer?</div>
            </div>
            <div style={{ color: '#30363d' }}>→</div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '2px solid #c9a227' }}>
              <div className="font-bold" style={{ color: '#c9a227' }}>Intelligence</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£449</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Help me buy it</div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Pricing Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Insight Report */}
            <div className="pricing-card-old" style={{ textAlign: 'left' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#8b949e' }}>Popular</div>
              <h3 className="text-2xl font-bold mb-2">Insight Report</h3>
              <div className="price-display" style={{ textAlign: 'left' }}>£149 <span className="text-base font-normal" style={{ color: '#8b949e' }}>one-time</span></div>
              <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>Is this area any good? Full location intelligence with demographics, crime, footfall, and competition.</p>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#c9a227' }}>What&apos;s Included:</h4>
              <ul>
                <li>Executive Summary &amp; Verdict</li>
                <li>Location Intelligence (Street View, maps, photos)</li>
                <li>Demographics &amp; Community Profile</li>
                <li>Crime &amp; Safety Analysis</li>
                <li>Competition Mapping</li>
                <li>Footfall Analysis</li>
                <li>Infrastructure &amp; Connectivity</li>
                <li>Online Presence &amp; Reviews</li>
                <li>Risk Assessment (full)</li>
                <li>15-22 page PDF report</li>
              </ul>
              <p className="text-sm mt-4" style={{ color: '#57606a' }}>Best for: Evaluating location quality, area viability, early due diligence</p>
              <BuyButton tier="basic" label="Buy Insight Report — £149" />
              <p className="text-xs mt-2 text-center" style={{ color: '#c9a227' }}>💡 Want financials? Upgrade to Analysis (+£100)</p>
            </div>

            {/* Analysis Report */}
            <div className="pricing-card-old" style={{ textAlign: 'left' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#8b949e' }}>Recommended</div>
              <h3 className="text-2xl font-bold mb-2">Analysis Report</h3>
              <div className="price-display" style={{ textAlign: 'left' }}>£249 <span className="text-base font-normal" style={{ color: '#8b949e' }}>one-time</span></div>
              <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>Should you make an offer? Everything in Insight plus full financial analysis, PO remuneration, staffing costs, and future outlook.</p>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#c9a227' }}>What&apos;s Included:</h4>
              <ul>
                <li>Everything in Insight</li>
                <li>Financial Analysis (P&amp;L, benchmarks, valuation)</li>
                <li>PO Remuneration Analysis (income breakdown)</li>
                <li>Staffing &amp; Hidden Costs (true employment cost)</li>
                <li>Future Outlook (5-year timeline, planning, developments)</li>
                <li>30-40 page PDF report</li>
              </ul>
              <p className="text-sm mt-4" style={{ color: '#57606a' }}>Best for: Serious buyers ready to evaluate financials and make an informed offer</p>
              <BuyButton tier="professional" label="Buy Analysis Report — £249" />
              <p className="text-xs mt-2 text-center" style={{ color: '#c9a227' }}>💡 Want the full package? Upgrade to Intelligence (+£200)</p>
            </div>

            {/* Intelligence Report ⭐ */}
            <div className="pricing-card-old popular" style={{ textAlign: 'left' }}>
              <div className="popular-badge">Most Popular</div>
              <div className="text-xs font-bold mb-2" style={{ color: '#c9a227' }}>⭐ Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Intelligence Report</h3>
              <div className="price-display" style={{ textAlign: 'left' }}>£449 <span className="text-base font-normal" style={{ color: '#8b949e' }}>one-time</span></div>
              <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>Help me buy it. The complete intelligence package. Everything in Analysis plus profit improvement plan, due diligence &amp; negotiation pack, and a 60-minute consultation call.</p>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#c9a227' }}>What&apos;s Included:</h4>
              <ul>
                <li>Everything in Analysis</li>
                <li>Profit Improvement Plan (evidence-based)</li>
                <li>Due Diligence Pack (documents, seller &amp; landlord questions)</li>
                <li>Negotiation Strategy (leverage analysis, offer range)</li>
                <li>60-minute consultation call</li>
                <li>40-55 page PDF report</li>
              </ul>
              <p className="text-sm mt-4 p-3 rounded-lg" style={{ background: 'rgba(201,162,39,0.1)', color: '#c9a227' }}>Intelligence tier includes a 60-minute consultation call — not available separately or with other tiers.</p>
              <p className="text-sm mt-2" style={{ color: '#57606a' }}>Best for: Serious buyers who want the complete picture before committing</p>
              <BuyButton tier="premium" label="Buy Intelligence Report — £449" />
            </div>

            {/* Scout Report */}
            <div className="pricing-card-old" style={{ textAlign: 'left' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#8b949e' }}>Entry Level</div>
              <h3 className="text-2xl font-bold mb-2">Scout Report</h3>
              <div className="price-display" style={{ textAlign: 'left' }}>£99 <span className="text-base font-normal" style={{ color: '#8b949e' }}>one-time</span></div>
              <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>Quick viability check. Should you even look at this business? Get the key location data and competition picture.</p>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#c9a227' }}>What&apos;s Included:</h4>
              <ul>
                <li>Executive Summary &amp; Verdict</li>
                <li>Location Intelligence (maps, Street View)</li>
                <li>Competition Mapping</li>
                <li>Risk Assessment (checklist)</li>
                <li>8-12 page PDF report</li>
              </ul>
              <p className="text-sm mt-4" style={{ color: '#57606a' }}>Best for: Quick viability checks, early-stage interest, screening multiple opportunities</p>
              <BuyButton tier="location" label="Buy Scout Report — £99" />
              <p className="text-xs mt-2 text-center" style={{ color: '#c9a227' }}>💡 Want more detail? Upgrade to Insight (+£50) — pay the difference anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center" style={{ background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(30, 58, 95, 0.2) 100%)', borderTop: '1px solid rgba(201,162,39,0.3)' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p style={{ color: '#8b949e' }} className="mb-8 max-w-xl mx-auto">Click any Buy button above and tell us which business you need a report for. We&apos;ll deliver actionable intelligence within 48 hours.</p>
          <Link href="/#contact" className="btn-primary text-lg px-10 py-4">Have Questions? Contact Us</Link>
        </div>
      </section>
    </AppLayout>
  );
}
