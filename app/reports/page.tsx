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
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm">
            <div className="text-center px-6 py-3 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="font-bold" style={{ color: '#8b949e' }}>Insight</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£199</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Is this the right business?</div>
            </div>
            <div style={{ color: '#30363d' }}>→</div>
            <div className="text-center px-6 py-3 rounded-lg" style={{ background: '#161b22', border: '2px solid #c9a227' }}>
              <div className="font-bold" style={{ color: '#c9a227' }}>Intelligence</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£499</div>
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
              <div className="text-xs font-bold mb-2" style={{ color: '#8b949e' }}>Essential</div>
              <h3 className="text-2xl font-bold mb-2">Insight Report</h3>
              <div className="price-display" style={{ textAlign: 'left' }}>£199 <span className="text-base font-normal" style={{ color: '#8b949e' }}>one-time</span></div>
              <p className="text-sm italic mb-4" style={{ color: '#c9a227' }}>&ldquo;Is this the right business?&rdquo;</p>
              <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>Full location intelligence with demographics, crime data, footfall analysis, competition mapping, and comprehensive risk assessment.</p>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#c9a227' }}>10 Sections Included:</h4>
              <ul>
                <li>Executive Summary &amp; Verdict</li>
                <li>PO Remuneration Analysis</li>
                <li>Online Presence &amp; Reviews</li>
                <li>Location Intelligence (Street View, maps, photos)</li>
                <li>Demographics &amp; Community Profile</li>
                <li>Crime &amp; Safety Analysis</li>
                <li>Competition Mapping</li>
                <li>Footfall Analysis</li>
                <li>Infrastructure &amp; Connectivity</li>
                <li>Risk Assessment</li>
              </ul>
              <p className="text-sm mt-4" style={{ color: '#57606a' }}>Best for: Evaluating location quality, area viability, early due diligence</p>
              <BuyButton tier="insight" label="Buy Insight Report — £199" />
              <p className="text-xs mt-2 text-center" style={{ color: '#c9a227' }}>💡 Want the full picture? Upgrade to Intelligence (+£300)</p>
            </div>

            {/* Intelligence Report ⭐ */}
            <div className="pricing-card-old popular" style={{ textAlign: 'left' }}>
              <div className="popular-badge">MOST POPULAR</div>
              <div className="text-xs font-bold mb-2" style={{ color: '#c9a227' }}>⭐ Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Intelligence Report</h3>
              <div className="price-display" style={{ textAlign: 'left' }}>£499 <span className="text-base font-normal" style={{ color: '#8b949e' }}>one-time</span></div>
              <p className="text-sm italic mb-4" style={{ color: '#c9a227' }}>&ldquo;Help me buy it.&rdquo;</p>
              <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>The complete intelligence package. Everything in Insight plus financial analysis, staffing, future outlook, profit improvement plan, and due diligence pack.</p>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#c9a227' }}>All 15 Sections:</h4>
              <ul>
                <li>Everything in Insight (10 sections)</li>
                <li>Financial Analysis (P&amp;L, benchmarks, valuation)</li>
                <li>Staffing &amp; Hidden Costs (true employment cost)</li>
                <li>Future Outlook (5-year timeline, planning, developments)</li>
                <li>Profit Improvement Plan (evidence-based)</li>
                <li>Due Diligence Pack (documents, seller &amp; landlord questions)</li>
              </ul>
              <p className="text-sm mt-4" style={{ color: '#57606a' }}>Best for: Serious buyers who want the complete picture before committing</p>
              <BuyButton tier="intelligence" label="Buy Intelligence Report — £499" />
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
