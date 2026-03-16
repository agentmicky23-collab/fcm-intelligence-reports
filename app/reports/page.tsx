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
              <div className="font-bold" style={{ color: '#8b949e' }}>Location Report</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£99</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Location only</div>
            </div>
            <div style={{ color: '#30363d' }}>→</div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="font-bold" style={{ color: '#8b949e' }}>Basic Report</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£149</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Quick check</div>
            </div>
            <div style={{ color: '#30363d' }}>→</div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="font-bold" style={{ color: '#8b949e' }}>Professional Report</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£249</div>
              <div className="text-xs" style={{ color: '#57606a' }}>+ Financials</div>
            </div>
            <div style={{ color: '#30363d' }}>→</div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '2px solid #c9a227' }}>
              <div className="font-bold" style={{ color: '#c9a227' }}>Premium Report</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£449</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Complete</div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Pricing Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Report */}
            <div className="pricing-card-old" style={{ textAlign: 'left' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#8b949e' }}>Essential</div>
              <h3 className="text-2xl font-bold mb-2">Basic Report</h3>
              <div className="price-display" style={{ textAlign: 'left' }}>£149 <span className="text-base font-normal" style={{ color: '#8b949e' }}>one-time</span></div>
              <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>Perfect for an initial sanity check before investing more time. Get the key facts fast.</p>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#c9a227' }}>What&apos;s Included:</h4>
              <ul>
                <li>Business overview &amp; summary</li>
                <li>Key metrics at a glance</li>
                <li>Red flags identification</li>
                <li>Basic viability assessment</li>
                <li>Go/No-Go recommendation</li>
              </ul>
              <h4 className="font-bold text-sm mt-4 mb-3" style={{ color: '#ef4444' }}>Not Included:</h4>
              <div style={{ fontSize: '0.85rem' }}>
                <p style={{ color: '#ef4444', padding: '4px 0' }}>❌ Detailed financial analysis</p>
                <p style={{ color: '#ef4444', padding: '4px 0' }}>❌ Location intelligence</p>
                <p style={{ color: '#ef4444', padding: '4px 0' }}>❌ Competition mapping</p>
                <p style={{ color: '#ef4444', padding: '4px 0' }}>❌ Consultation call</p>
              </div>
              <p className="text-sm mt-4" style={{ color: '#57606a' }}>Best for: Quick checks, early-stage interest, budget-conscious buyers</p>
              <BuyButton tier="basic" label="Buy Basic Report — £149" />
              <p className="text-xs mt-2 text-center" style={{ color: '#c9a227' }}>💡 Need financials? Upgrade to Professional</p>
            </div>

            {/* Professional Report */}
            <div className="pricing-card-old" style={{ textAlign: 'left' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#8b949e' }}>Professional</div>
              <h3 className="text-2xl font-bold mb-2">Professional Report</h3>
              <div className="price-display" style={{ textAlign: 'left' }}>£249 <span className="text-base font-normal" style={{ color: '#8b949e' }}>one-time</span></div>
              <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>Comprehensive financial analysis for serious buyers. Know the numbers before you negotiate.</p>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#c9a227' }}>What&apos;s Included:</h4>
              <ul>
                <li>Everything in Basic</li>
                <li>Full financial deep dive</li>
                <li>P&amp;L analysis &amp; breakdown</li>
                <li>Post Office remuneration analysis</li>
                <li>Revenue stream breakdown</li>
                <li>Competition overview</li>
                <li>30-minute consultation call</li>
                <li>Negotiation guidance</li>
              </ul>
              <h4 className="font-bold text-sm mt-4 mb-3" style={{ color: '#ef4444' }}>Not Included:</h4>
              <div style={{ fontSize: '0.85rem' }}>
                <p style={{ color: '#ef4444', padding: '4px 0' }}>❌ Location Intelligence (demographics, crime)</p>
                <p style={{ color: '#ef4444', padding: '4px 0' }}>❌ Street View &amp; mapping</p>
                <p style={{ color: '#ef4444', padding: '4px 0' }}>❌ Catchment analysis</p>
              </div>
              <p className="text-sm mt-4" style={{ color: '#57606a' }}>Best for: Buyers who have the location sorted but need to verify the financials</p>
              <BuyButton tier="professional" label="Buy Professional Report — £249" />
              <p className="text-xs mt-2 text-center" style={{ color: '#c9a227' }}>💡 Want complete picture? Upgrade to Premium (+£200)</p>
            </div>

            {/* Premium Report ⭐ */}
            <div className="pricing-card-old popular" style={{ textAlign: 'left' }}>
              <div className="popular-badge">Most Popular</div>
              <div className="text-xs font-bold mb-2" style={{ color: '#c9a227' }}>Premium ⭐ Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Premium Report</h3>
              <div className="price-display" style={{ textAlign: 'left' }}>£449 <span className="text-base font-normal" style={{ color: '#8b949e' }}>one-time</span></div>
              <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>Everything you need in one comprehensive report. Business financials + full location intelligence.</p>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#c9a227' }}>What&apos;s Included:</h4>
              <ul>
                <li>Everything in Professional</li>
                <li>📍 Full Location Intelligence</li>
                <li>🏠 Property &amp; Affluence Analysis</li>
                <li>👥 Demographics &amp; Consumer Profile</li>
                <li>🛡️ Crime &amp; Safety Analysis</li>
                <li>🏢 Competition Mapping</li>
                <li>🚶 Footfall Analysis</li>
                <li>📷 Street View &amp; Maps</li>
                <li>60-minute consultation call</li>
                <li>Detailed action roadmap</li>
              </ul>
              <p className="text-sm mt-4 p-3 rounded-lg" style={{ background: 'rgba(201,162,39,0.1)', color: '#c9a227' }}>💰 Value: Location Intelligence alone is worth £99. You&apos;re getting it FREE with Premium!</p>
              <p className="text-sm mt-2" style={{ color: '#57606a' }}>Best for: Serious buyers who want the complete picture before committing</p>
              <BuyButton tier="premium" label="Buy Premium Report — £449" />
            </div>

            {/* Location Report */}
            <div className="pricing-card-old" style={{ textAlign: 'left' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#8b949e' }}>Add-On</div>
              <h3 className="text-2xl font-bold mb-2">Location Report</h3>
              <div className="price-display" style={{ textAlign: 'left' }}>£99 <span className="text-base font-normal" style={{ color: '#8b949e' }}>one-time</span></div>
              <p style={{ color: '#8b949e', fontSize: '0.9rem', marginBottom: '20px' }}>Just need location data? Already have the financials? This is for you.</p>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#c9a227' }}>What&apos;s Included:</h4>
              <ul>
                <li>Location Score (A-F grade)</li>
                <li>Street View imagery</li>
                <li>Area mapping</li>
                <li>Demographics breakdown</li>
                <li>House prices &amp; affluence</li>
                <li>Consumer profile</li>
                <li>Crime &amp; safety analysis</li>
                <li>Competition mapping</li>
                <li>Footfall analysis</li>
              </ul>
              <h4 className="font-bold text-sm mt-4 mb-3" style={{ color: '#ef4444' }}>Not Included:</h4>
              <div style={{ fontSize: '0.85rem' }}>
                <p style={{ color: '#ef4444', padding: '4px 0' }}>❌ Business/financial analysis</p>
                <p style={{ color: '#ef4444', padding: '4px 0' }}>❌ P&amp;L breakdown</p>
                <p style={{ color: '#ef4444', padding: '4px 0' }}>❌ Consultation call</p>
              </div>
              <p className="text-sm mt-4" style={{ color: '#57606a' }}>Best for: Buyers who already have accounts, investors comparing locations, add-on to Basic</p>
              <BuyButton tier="location" label="Buy Location Report — £99" />
              <p className="text-xs mt-2 text-center" style={{ color: '#c9a227' }}>💡 Already bought Basic? Add this for complete coverage!</p>
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
