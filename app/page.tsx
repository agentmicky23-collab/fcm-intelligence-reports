"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { ListingCard } from "@/components/listing-card";
import { BuyButton } from "@/components/buy-button";
import { listings } from "@/lib/listings-data";

export default function Home() {
  const featuredListings = listings.slice(0, 4);

  return (
    <AppLayout>
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201, 162, 39, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm mb-8" style={{ background: 'rgba(201, 162, 39, 0.15)', border: '1px solid #c9a227', color: '#c9a227' }}>
            <span className="flex h-2 w-2 rounded-full bg-[#c9a227] animate-pulse"></span>
            Trusted by 200+ Buyers Since 2009
          </div>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ lineHeight: 1.2 }}>
            Buy Post Offices<br />
            <span style={{ color: '#c9a227' }}>Smarter, Not Harder</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#8b949e' }}>
            Data-driven intelligence reports that reveal the true potential of any Post Office acquisition. <strong className="text-white">Stop guessing. Start knowing.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/reports" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto">View Pricing</Link>
            <Link href="#report-preview" className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto">See Sample Report</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ STATS ROW ═══════════════════════════ */}
      <section style={{ borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d', background: 'rgba(22, 27, 34, 0.5)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-mono text-4xl mb-2" style={{ color: '#c9a227', fontWeight: 700 }}>15+</div>
              <div className="text-sm font-medium uppercase tracking-wider" style={{ color: '#8b949e' }}>Years Industry Experience</div>
            </div>
            <div>
              <div className="font-mono text-4xl mb-2" style={{ color: '#c9a227', fontWeight: 700 }}>40</div>
              <div className="text-sm font-medium uppercase tracking-wider" style={{ color: '#8b949e' }}>Branches Operated</div>
            </div>
            <div>
              <div className="font-mono text-4xl mb-2" style={{ color: '#c9a227', fontWeight: 700 }}>200+</div>
              <div className="text-sm font-medium uppercase tracking-wider" style={{ color: '#8b949e' }}>Reports Delivered</div>
            </div>
            <div>
              <div className="font-mono text-4xl mb-2" style={{ color: '#c9a227', fontWeight: 700 }}>98%</div>
              <div className="text-sm font-medium uppercase tracking-wider" style={{ color: '#8b949e' }}>Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TRUST BADGES ═══════════════════════════ */}
      <section className="py-6" style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm" style={{ color: '#8b949e' }}>
            <div className="flex items-center gap-2"><span style={{ color: '#c9a227' }}>🔒</span><span>SSL Secured</span></div>
            <div className="flex items-center gap-2"><span style={{ color: '#c9a227' }}>⭐</span><span>4.9/5 Average Rating</span></div>
            <div className="flex items-center gap-2"><span style={{ color: '#c9a227' }}>🏆</span><span>15 Years Industry Experience</span></div>
            <div className="flex items-center gap-2"><span style={{ color: '#c9a227' }}>🇬🇧</span><span>UK Based Team</span></div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CURATION EXPLAINER ═══════════════════════════ */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="feature-card-old">
            <div className="icon">🔍</div>
            <h3>Daily Scanning</h3>
            <p>We monitor Daltons, RightBiz, BusinessesForSale, and private sellers across the UK every day.</p>
          </div>
          <div className="feature-card-old">
            <div className="icon">✅</div>
            <h3>Verified Active</h3>
            <p>Every listing is checked to confirm it&apos;s still available before we share. No dead links or sold businesses.</p>
          </div>
          <div className="feature-card-old">
            <div className="icon">🎯</div>
            <h3>Quality Filtered</h3>
            <p>Only listings that pass our initial viability check make it here. No overpriced duds or obvious money pits.</p>
          </div>
          <div className="feature-card-old">
            <div className="icon">📊</div>
            <h3>Expert Context</h3>
            <p>Each listing gets our quick assessment. Want the full picture? That&apos;s what our reports are for.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ WHY INTELLIGENCE MATTERS ═══════════════════════════ */}
      <section className="pb-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div style={{ background: '#161b22', border: '2px solid rgba(201,162,39,0.3)', borderRadius: '16px', padding: '32px' }}>
            <div className="text-3xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold mb-3">Time Is Money</h3>
            <p style={{ color: '#8b949e', lineHeight: 1.7 }}>Quality businesses attract multiple buyers. Get the intelligence you need to make decisive offers before your competition.</p>
          </div>
          <div style={{ background: '#161b22', border: '2px solid rgba(201,162,39,0.3)', borderRadius: '16px', padding: '32px' }}>
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">Know Before You Go</h3>
            <p style={{ color: '#8b949e', lineHeight: 1.7 }}>Listings only tell half the story. Our reports reveal the full picture — location risks, hidden costs, and real potential.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ DISCLAIMER ═══════════════════════════ */}
      <section className="py-6" style={{ background: 'rgba(22,27,34,0.5)', borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm max-w-4xl mx-auto" style={{ color: '#8b949e', lineHeight: 1.7 }}>
            <strong className="text-white">Disclaimer:</strong> Listings are sourced from third-party sites. We do not control original listings and cannot guarantee availability. Links direct to the original source — verify status before proceeding. Listings marked SOLD are removed from this page.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURED LISTINGS ═══════════════════════════ */}
      <section className="py-20 container mx-auto px-4" id="opportunities">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">🔥 Live Opportunities</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto mb-2">Businesses For Sale Now</p>
          <p style={{ color: '#57606a', fontSize: '0.9rem' }}>
            Showing {featuredListings.length} of {listings.length} opportunities • <Link href="/opportunities" className="underline" style={{ color: '#c9a227' }}>View All</Link>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/opportunities" className="btn-primary text-lg px-10 py-4">View All {listings.length} Listings</Link>
        </div>
      </section>

      {/* ═══════════════════════════ ALERTS CTA BANNER ═══════════════════════════ */}
      <section className="py-8" style={{ background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(30, 58, 95, 0.15) 100%)', borderTop: '1px solid rgba(201,162,39,0.2)', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📧</span>
              <div>
                <h3 className="font-bold text-lg">Never Miss a New Listing</h3>
                <p className="text-sm" style={{ color: '#8b949e' }}>Get personalised weekly alerts — matched to your budget, region &amp; business type. Free.</p>
              </div>
            </div>
            <Link href="/insider" className="btn-primary px-6 py-2.5 whitespace-nowrap">Sign Up for Insider</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ WHAT'S INCLUDED (3 cards like old site) ═══════════════════════════ */}
      <section className="py-20" style={{ background: '#161b22', borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location Intelligence */}
            <div className="feature-card-old" style={{ textAlign: 'left', padding: '32px' }}>
              <div className="icon" style={{ textAlign: 'center' }}>📍</div>
              <h3 style={{ textAlign: 'center' }}>Location Intelligence</h3>
              <p style={{ textAlign: 'center', marginBottom: '16px' }}>Comprehensive analysis of the branch&apos;s catchment area, foot traffic patterns, and local competition.</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• Demographic breakdown</li>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• Competitor mapping</li>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• Footfall analysis</li>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• Accessibility assessment</li>
              </ul>
            </div>
            {/* Financial Deep Dive */}
            <div className="feature-card-old" style={{ textAlign: 'left', padding: '32px' }}>
              <div className="icon" style={{ textAlign: 'center' }}>📊</div>
              <h3 style={{ textAlign: 'center' }}>Financial Deep Dive</h3>
              <p style={{ textAlign: 'center', marginBottom: '16px' }}>Detailed examination of revenue streams, profit margins, and hidden costs most buyers miss.</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• Revenue breakdown by service</li>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• True cost analysis</li>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• Margin comparison benchmarks</li>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• Cash flow projections</li>
              </ul>
            </div>
            {/* Profit Improvement Plan */}
            <div className="feature-card-old" style={{ textAlign: 'left', padding: '32px' }}>
              <div className="icon" style={{ textAlign: 'center' }}>🚀</div>
              <h3 style={{ textAlign: 'center' }}>Profit Improvement Plan</h3>
              <p style={{ textAlign: 'center', marginBottom: '16px' }}>Actionable recommendations to increase profitability based on our 40-branch operational experience.</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• Quick win opportunities</li>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• Service expansion potential</li>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• Operational efficiencies</li>
                <li style={{ padding: '6px 0', color: '#8b949e', fontSize: '0.9rem' }}>• 12-month growth roadmap</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ SAMPLE REPORT PREVIEW (old site exact) ═══════════════════════════ */}
      <section className="py-20 container mx-auto px-4" id="report-preview">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">See What You Get</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Basic Sample */}
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '16px', padding: '24px', position: 'relative' }}>
            <div className="text-xs font-bold mb-4" style={{ color: '#8b949e' }}>Basic</div>
            <h4 className="font-bold mb-1">Sandbach Post Office</h4>
            <p className="text-xs mb-4" style={{ color: '#57606a' }}>CW11 1HN • Generated Feb 2026</p>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 rounded-lg text-2xl font-bold" style={{ background: 'rgba(201,162,39,0.1)', color: '#c9a227' }}>B</span>
              <p className="text-xs mt-2" style={{ color: '#8b949e' }}>Quick Assessment</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem' }}>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Business Overview</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Key Metrics Summary</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Red Flags Check</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Basic Recommendation</li>
              <li style={{ padding: '4px 0', color: '#ef4444' }}>❌ Financial Deep Dive</li>
              <li style={{ padding: '4px 0', color: '#ef4444' }}>❌ Location Intelligence</li>
              <li style={{ padding: '4px 0', color: '#ef4444' }}>❌ Crime &amp; Safety Analysis</li>
              <li style={{ padding: '4px 0', color: '#ef4444' }}>❌ Demographics</li>
            </ul>
          </div>
          {/* Professional Sample */}
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '16px', padding: '24px' }}>
            <div className="text-xs font-bold mb-4" style={{ color: '#8b949e' }}>Professional</div>
            <h4 className="font-bold mb-1">Sandbach Post Office</h4>
            <p className="text-xs mb-4" style={{ color: '#57606a' }}>CW11 1HN • Generated Feb 2026</p>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 rounded-lg text-2xl font-bold" style={{ background: 'rgba(201,162,39,0.1)', color: '#c9a227' }}>B+</span>
              <span className="text-sm font-mono ml-2" style={{ color: '#8b949e' }}>72/100</span>
              <p className="text-xs mt-1" style={{ color: '#8b949e' }}>Business Score</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '12px', fontSize: '0.8rem' }}>
              <div className="flex justify-between mb-1"><span style={{ color: '#8b949e' }}>Est. Annual Revenue</span><span className="font-mono font-bold text-white">£185,000</span></div>
              <div className="flex justify-between mb-1"><span style={{ color: '#8b949e' }}>PO Remuneration</span><span className="font-mono font-bold text-white">£67,400</span></div>
              <div className="flex justify-between"><span style={{ color: '#8b949e' }}>Est. Net Profit</span><span className="font-mono font-bold text-white">£42,000</span></div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem' }}>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Full Business Analysis</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Financial Deep Dive</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ P&amp;L Breakdown</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Remuneration Analysis</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Competition Overview</li>
              <li style={{ padding: '4px 0', color: '#ef4444' }}>❌ Location Intelligence</li>
              <li style={{ padding: '4px 0', color: '#ef4444' }}>❌ Demographics</li>
              <li style={{ padding: '4px 0', color: '#ef4444' }}>❌ Crime Analysis</li>
            </ul>
          </div>
          {/* Premium Sample */}
          <div style={{ background: '#161b22', border: '2px solid #c9a227', borderRadius: '16px', padding: '24px', position: 'relative' }}>
            <div className="text-xs font-bold mb-4" style={{ color: '#c9a227' }}>Premium ⭐</div>
            <h4 className="font-bold mb-1">Sandbach Post Office</h4>
            <p className="text-xs mb-4" style={{ color: '#57606a' }}>CW11 1HN • Generated Feb 2026</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-lg text-lg font-bold" style={{ background: 'rgba(201,162,39,0.1)', color: '#c9a227' }}>B+</span>
                <span className="text-xs font-mono ml-1" style={{ color: '#8b949e' }}>68/100</span>
                <p className="text-xs" style={{ color: '#8b949e' }}>Overall Score</p>
              </div>
              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-lg text-lg font-bold" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>A</span>
                <span className="text-xs font-mono ml-1" style={{ color: '#8b949e' }}>85/100</span>
                <p className="text-xs" style={{ color: '#8b949e' }}>Location Score</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3" style={{ fontSize: '0.75rem' }}>
              <div className="text-center p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="font-mono font-bold text-white">£253K</div>
                <div style={{ color: '#8b949e' }}>House Price</div>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="font-mono font-bold text-white">73%</div>
                <div style={{ color: '#8b949e' }}>Employment</div>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="font-mono font-bold text-white">93</div>
                <div style={{ color: '#8b949e' }}>Crime Incidents</div>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="font-mono font-bold text-white">20</div>
                <div style={{ color: '#8b949e' }}>Competitors</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem' }}>
              <li style={{ padding: '3px 0', color: '#22c55e' }}>✅ Full Business + Financials</li>
              <li style={{ padding: '3px 0', color: '#c9a227' }}>⭐ Location Intelligence</li>
              <li style={{ padding: '3px 0', color: '#c9a227' }}>⭐ Demographics Analysis</li>
              <li style={{ padding: '3px 0', color: '#c9a227' }}>⭐ Crime &amp; Safety</li>
              <li style={{ padding: '3px 0', color: '#c9a227' }}>⭐ Competition Mapping</li>
              <li style={{ padding: '3px 0', color: '#c9a227' }}>⭐ Footfall Analysis</li>
            </ul>
          </div>
          {/* Location Intel Sample */}
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '16px', padding: '24px' }}>
            <div className="text-xs font-bold mb-4" style={{ color: '#8b949e' }}>Location Intel</div>
            <h4 className="font-bold mb-1">CW11 1HN</h4>
            <p className="text-xs mb-4" style={{ color: '#57606a' }}>Sandbach, Cheshire East</p>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 rounded-lg text-2xl font-bold" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>A</span>
              <span className="text-sm font-mono ml-2" style={{ color: '#8b949e' }}>85/100</span>
              <p className="text-xs mt-1" style={{ color: '#8b949e' }}>Location Score</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem' }}>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Catchment Analysis</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Demographics Profile</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ House Prices &amp; Affluence</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Employment Data</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Consumer Segments</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Crime &amp; Safety</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Competition Map</li>
              <li style={{ padding: '4px 0', color: '#22c55e' }}>✅ Footfall Drivers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ PRICING (old site exact: Location £99, Basic £149, Professional £249, Premium £449) ═══════════════════════════ */}
      <section className="py-20" id="pricing" style={{ background: '#0d1117' }}>
        <div className="container mx-auto px-4">
          {/* Pricing comparison strip */}
          <div className="flex items-center justify-center gap-4 mb-12 flex-wrap text-sm">
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="font-bold" style={{ color: '#8b949e' }}>Location Intel</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£99</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Location only</div>
            </div>
            <div style={{ color: '#30363d' }}>→</div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="font-bold" style={{ color: '#8b949e' }}>Basic</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£149</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Quick check</div>
            </div>
            <div style={{ color: '#30363d' }}>→</div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="font-bold" style={{ color: '#8b949e' }}>Professional</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£249</div>
              <div className="text-xs" style={{ color: '#57606a' }}>+ Financials</div>
            </div>
            <div style={{ color: '#30363d' }}>→</div>
            <div className="text-center px-4 py-2 rounded-lg" style={{ background: '#161b22', border: '2px solid #c9a227' }}>
              <div className="font-bold" style={{ color: '#c9a227' }}>Premium</div>
              <div className="font-mono font-bold" style={{ color: '#c9a227' }}>£449</div>
              <div className="text-xs" style={{ color: '#57606a' }}>Complete</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Location Intel */}
            <div className="pricing-card-old">
              <div className="text-xs font-bold mb-2" style={{ color: '#8b949e' }}>Add-On</div>
              <h3 className="text-lg font-bold mb-2">Location Report</h3>
              <div className="price-display">£99</div>
              <div className="price-subtitle">one-time</div>
              <p style={{ color: '#8b949e', fontSize: '0.85rem', marginBottom: '16px' }}>Standalone location analysis. Perfect add-on or for investors.</p>
              <ul>
                <li>Location Score (A-F)</li>
                <li>Street View &amp; Maps</li>
                <li>Demographics profile</li>
                <li>House prices &amp; affluence</li>
                <li>Crime &amp; safety data</li>
                <li>Competition mapping</li>
                <li>Footfall analysis</li>
                <li>15-20 page PDF report</li>
              </ul>
              <BuyButton tier="location" label="Buy Location Report — £99" />
            </div>
            {/* Basic */}
            <div className="pricing-card-old">
              <div className="text-xs font-bold mb-2" style={{ color: '#8b949e' }}>Essential</div>
              <h3 className="text-lg font-bold mb-2">Basic Report</h3>
              <div className="price-display">£149</div>
              <div className="price-subtitle">one-time</div>
              <p style={{ color: '#8b949e', fontSize: '0.85rem', marginBottom: '16px' }}>Initial sanity check before investing more time.</p>
              <ul>
                <li>Business overview</li>
                <li>Key metrics summary</li>
                <li>Red flags check</li>
                <li>Go/No-Go recommendation</li>
                <li>6-10 page PDF report</li>
              </ul>
              <div style={{ padding: '8px 0', borderTop: '1px solid #30363d', marginTop: '12px' }}>
                <p className="text-xs" style={{ color: '#ef4444' }}>❌ Financial deep dive</p>
                <p className="text-xs" style={{ color: '#ef4444' }}>❌ Location Intelligence</p>
                <p className="text-xs" style={{ color: '#ef4444' }}>❌ Consultation call</p>
              </div>
              <BuyButton tier="basic" label="Buy Basic Report — £149" />
            </div>
            {/* Professional */}
            <div className="pricing-card-old">
              <div className="text-xs font-bold mb-2" style={{ color: '#8b949e' }}>Professional</div>
              <h3 className="text-lg font-bold mb-2">Professional Report</h3>
              <div className="price-display">£249</div>
              <div className="price-subtitle">one-time</div>
              <p style={{ color: '#8b949e', fontSize: '0.85rem', marginBottom: '16px' }}>Comprehensive financial analysis for serious buyers.</p>
              <ul>
                <li>Everything in Basic</li>
                <li>Financial deep dive</li>
                <li>P&amp;L breakdown</li>
                <li>Remuneration analysis</li>
                <li>Competition overview</li>
                <li>20-25 page PDF report</li>
                <li>30-min consultation call</li>
              </ul>
              <div style={{ padding: '8px 0', borderTop: '1px solid #30363d', marginTop: '12px' }}>
                <p className="text-xs" style={{ color: '#ef4444' }}>❌ Location Intelligence</p>
              </div>
              <BuyButton tier="professional" label="Buy Professional Report — £249" />
            </div>
            {/* Premium ⭐ */}
            <div className="pricing-card-old popular">
              <div className="popular-badge">Recommended</div>
              <div className="text-xs font-bold mb-2" style={{ color: '#c9a227' }}>Premium ⭐ Most Popular</div>
              <h3 className="text-lg font-bold mb-2">Premium Report</h3>
              <div className="price-display">£449</div>
              <div className="price-subtitle">one-time</div>
              <p style={{ color: '#8b949e', fontSize: '0.85rem', marginBottom: '16px' }}>Full business + location intelligence. Complete picture.</p>
              <ul>
                <li>Everything in Professional</li>
                <li>📍 Full Location Intelligence</li>
                <li>🏠 Demographics &amp; Affluence</li>
                <li>🛡️ Crime &amp; Safety Analysis</li>
                <li>🏢 Competition Mapping</li>
                <li>30-40 page PDF report</li>
                <li>60-min consultation call</li>
                <li>Action roadmap</li>
              </ul>
              <BuyButton tier="premium" label="Buy Premium Report — £449" />
            </div>
          </div>

          <p className="text-center mt-8 text-sm" style={{ color: '#8b949e' }}>
            💡 Already bought Basic or Professional? Add Location Report for £99 to complete your due diligence.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ QUOTE ═══════════════════════════ */}
      <section className="py-20 container mx-auto px-4">
        <div className="old-quote">
          <blockquote>
            We&apos;ve operated 40 Post Office branches. We&apos;ve seen what makes them succeed and what makes them fail. Now we&apos;re sharing that insight with buyers who want to make smarter decisions.
          </blockquote>
          <cite>— 15 Years in Post Office Operations</cite>
        </div>
      </section>

      {/* ═══════════════════════════ SERVICES (old site exact 6 cards) ═══════════════════════════ */}
      <section className="py-20" style={{ background: '#161b22', borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="feature-card-old" style={{ textAlign: 'left' }}>
              <div className="icon" style={{ textAlign: 'center' }}>📋</div>
              <h3 style={{ textAlign: 'center' }}>Business Plan &amp; Forecasts</h3>
              <p style={{ textAlign: 'center' }}>Professional 3-year business plan with forecasted management accounts. Required for Post Office Ltd vetting and approval.</p>
              <div className="text-center mt-4"><span className="font-mono font-bold text-xl" style={{ color: '#c9a227' }}>£850</span><span className="text-sm ml-2" style={{ color: '#8b949e' }}>One-time</span></div>
            </div>
            <div className="feature-card-old" style={{ textAlign: 'left' }}>
              <div className="icon" style={{ textAlign: 'center' }}>🎤</div>
              <h3 style={{ textAlign: 'center' }}>Interview Preparation</h3>
              <p style={{ textAlign: 'center' }}>Post Office Ltd vets all new operators. Get mock interviews, coaching, and preparation to ace your approval interview.</p>
              <div className="text-center mt-4"><span className="font-mono font-bold text-xl" style={{ color: '#c9a227' }}>£450</span><span className="text-sm ml-2" style={{ color: '#8b949e' }}>One-time</span></div>
            </div>
            <div className="feature-card-old" style={{ textAlign: 'left' }}>
              <div className="icon" style={{ textAlign: 'center' }}>🎓</div>
              <h3 style={{ textAlign: 'center' }}>Operator Training</h3>
              <p style={{ textAlign: 'center' }}>Learn to run a Post Office from operators with 40+ branches. Online, at our location, or on-site at your branch.</p>
              <div className="text-center mt-4"><span className="font-mono font-bold text-xl" style={{ color: '#c9a227' }}>£500 - £1,500</span><span className="text-sm ml-2" style={{ color: '#8b949e' }}>Online / Offsite / Onsite</span></div>
            </div>
            <div className="feature-card-old" style={{ textAlign: 'left' }}>
              <div className="icon" style={{ textAlign: 'center' }}>🔧</div>
              <h3 style={{ textAlign: 'center' }}>Business Setup Bundle</h3>
              <p style={{ textAlign: 'center' }}>Company formation, bank account, insurance, utilities, EPOS setup - everything you need to open the doors.</p>
              <div className="text-center mt-4"><span className="font-mono font-bold text-xl" style={{ color: '#c9a227' }}>£750</span><span className="text-sm ml-2" style={{ color: '#8b949e' }}>Complete package</span></div>
            </div>
            <div className="feature-card-old" style={{ textAlign: 'left' }}>
              <div className="icon" style={{ textAlign: 'center' }}>💬</div>
              <h3 style={{ textAlign: 'center' }}>Advisory Support</h3>
              <p style={{ textAlign: 'center' }}>Ongoing email support and monthly calls. Get expert guidance as you navigate your first months of operation.</p>
              <div className="text-center mt-4"><span className="font-mono font-bold text-xl" style={{ color: '#c9a227' }}>£200/mo</span><span className="text-sm ml-2" style={{ color: '#8b949e' }}>Cancel anytime</span></div>
            </div>
            <div className="feature-card-old" style={{ textAlign: 'left' }}>
              <div className="icon" style={{ textAlign: 'center' }}>⭐</div>
              <h3 style={{ textAlign: 'center' }}>Advisory Pro</h3>
              <p style={{ textAlign: 'center' }}>Everything in Basic plus compliance checks, management reporting, and priority response times.</p>
              <div className="text-center mt-4"><span className="font-mono font-bold text-xl" style={{ color: '#c9a227' }}>£400/mo</span><span className="text-sm ml-2" style={{ color: '#8b949e' }}>Cancel anytime</span></div>
            </div>
          </div>
          <div className="text-center mt-8">
            <h3 className="text-xl font-bold mb-2">💰 Bundle &amp; Save</h3>
            <p style={{ color: '#8b949e' }}>Professional report buyers get <strong className="text-white">10% off</strong> all services. Premium report buyers get <strong className="text-white">20% off</strong> all services.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CONTACT FORM ═══════════════════════════ */}
      <section className="py-20 container mx-auto px-4" id="contact">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Buy Smarter?</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto">Tell us which listing interests you, and we&apos;ll deliver actionable intelligence within 48 hours.</p>
        </div>
        <div className="old-contact-form">
          <form action="https://formspree.io/f/xblgnqzj" method="POST">
            <div className="form-group">
              <label htmlFor="listing">Branch / Listing of Interest</label>
              <input type="text" id="listing" name="listing" placeholder="e.g., Keith Post Office, Barnsley Mains..." required />
            </div>
            <div className="form-group">
              <label htmlFor="report-type">Report Type</label>
              <select id="report-type" name="report-type">
                <option value="premium">Premium Report — £449</option>
                <option value="professional">Professional Report — £249</option>
                <option value="basic">Basic Report — £149</option>
                <option value="location">Location Intelligence — £99</option>
                <option value="consultation">Consultation Call</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" placeholder="Full name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone (optional)</label>
              <input type="tel" id="phone" name="phone" placeholder="07xxx xxxxxx" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={4} placeholder="Tell us about your requirements, timeline, and any specific questions..."></textarea>
            </div>
            <button type="submit" className="submit-btn">Get Your Report</button>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════ FCM INSIDER (old site exact) ═══════════════════════════ */}
      <section className="py-20" id="insider" style={{ background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(30, 58, 95, 0.2) 100%)', borderTop: '1px solid rgba(201,162,39,0.3)', borderBottom: '1px solid rgba(201,162,39,0.3)' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1 rounded-full mb-6" style={{ background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227', fontSize: '0.85rem', fontWeight: 600 }}>
            ⭐ MEMBERSHIP
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">FCM Insider</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto mb-4 text-lg">Get the edge over other buyers with exclusive access to our hand-picked recommendations.</p>
          <div className="mb-8">
            <div className="inline-block px-4 py-1 rounded-full mb-2" style={{ background: 'rgba(201,162,39,0.15)', fontSize: '0.8rem', color: '#c9a227', fontWeight: 600 }}>BEST VALUE</div>
            <div className="font-mono text-5xl font-bold mb-2" style={{ color: '#c9a227' }}>£15</div>
            <p style={{ color: '#8b949e' }}>/month</p>
            <p className="text-sm" style={{ color: '#57606a' }}>Cancel anytime. No long-term commitment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d' }}>
              <span>⭐</span>
              <div>
                <h4 className="font-bold text-sm">FCM Insider Picks</h4>
                <p className="text-sm" style={{ color: '#8b949e' }}>Access our hand-selected recommended listings before anyone else</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d' }}>
              <span>💰</span>
              <div>
                <h4 className="font-bold text-sm">5% Off All Reports</h4>
                <p className="text-sm" style={{ color: '#8b949e' }}>Save on every intelligence report — pays for itself after 2 reports</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d' }}>
              <span>📧</span>
              <div>
                <h4 className="font-bold text-sm">Weekly Alerts</h4>
                <p className="text-sm" style={{ color: '#8b949e' }}>New listings matching your criteria delivered to your inbox</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d' }}>
              <span>🎯</span>
              <div>
                <h4 className="font-bold text-sm">Priority Support</h4>
                <p className="text-sm" style={{ color: '#8b949e' }}>Jump the queue — your questions answered within 24 hours</p>
              </div>
            </div>
          </div>
          <BuyButton tier="insider" label="Become an Insider" className="btn-primary text-lg px-10 py-4" />
          <p className="mt-4 text-sm" style={{ color: '#57606a' }}>Join 50+ serious buyers already using FCM Insider</p>
        </div>
      </section>

      {/* ═══════════════════════════ FINAL DISCLAIMER ═══════════════════════════ */}
      <section className="py-8" style={{ background: 'rgba(22,27,34,0.3)' }}>
        <div className="container mx-auto px-4 text-center">
          <p style={{ color: '#57606a', fontSize: '0.8rem', lineHeight: 1.7 }}>
            FCM Intelligence provides market intelligence and analysis for informational purposes. This is not financial advice. Always conduct your own due diligence and seek professional advice before making any business acquisition decisions. © 2026 FCM Intelligence. All rights reserved.
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
