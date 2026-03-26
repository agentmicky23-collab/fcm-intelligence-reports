"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { ListingCard, isSoldListingVisible } from "@/components/listing-card";
import { BuyButton } from "@/components/buy-button";

import { listings } from "@/lib/listings-data";

// Get 3 featured listings with daily rotation
function getFeaturedListings() {
  // Filter to only active listings (or sold within 3 days)
  const availableListings = listings.filter(listing => isSoldListingVisible(listing));
  
  // Daily rotation based on date
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Rotate starting index based on day
  const startIndex = dayOfYear % Math.max(1, availableListings.length - 2);
  
  // Get 3 listings starting from rotated index
  const featured = [];
  for (let i = 0; i < 3 && i < availableListings.length; i++) {
    const idx = (startIndex + i) % availableListings.length;
    featured.push(availableListings[idx]);
  }
  
  return featured;
}

export default function Home() {
  const featuredListings = getFeaturedListings();

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
            <Link href="/reports" className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto">See Sample Report</Link>
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

      {/* ═══════════════════════════ FEATURED LISTINGS (3 with daily rotation) ═══════════════════════════ */}
      <section className="py-20 container mx-auto px-4" id="opportunities">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">🔥 Live Opportunities</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto mb-2">Businesses For Sale Now</p>
          <p style={{ color: '#57606a', fontSize: '0.9rem' }}>
            Showing {featuredListings.length} of {listings.length} opportunities • <Link href="/opportunities" className="underline" style={{ color: '#c9a227' }}>View All</Link>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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

      {/* ═══════════════════════════ SEE WHAT YOU GET — TWO-TIER PRICING ═══════════════════════════ */}
      <section className="py-20" id="pricing" style={{ background: '#0d1117' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">See What You Get</h2>
            <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto text-lg">
              Two tiers. One report. All the intelligence you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
            {/* ── Insight Report ── */}
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '16px', padding: '36px', position: 'relative' }}>
              <h3 className="text-2xl font-bold mb-1">Insight Report — <span style={{ color: '#FFD700' }}>£199</span></h3>
              <p className="text-sm italic mb-5" style={{ color: '#c9a227' }}>&ldquo;Is this the right business?&rdquo;</p>

              <p className="font-semibold text-sm mb-3 uppercase tracking-wider" style={{ color: '#c9a227' }}>10 sections included:</p>
              <ul className="space-y-2 mb-6">
                {[
                  'Executive Summary & Verdict',
                  'PO Remuneration Analysis',
                  'Online Presence & Reviews',
                  'Location Intelligence',
                  'Demographics & Community Profile',
                  'Crime & Safety Analysis',
                  'Competition Mapping',
                  'Footfall Analysis',
                  'Infrastructure & Connectivity',
                  'Risk Assessment',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span style={{ color: '#22c55e' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm mb-6" style={{ color: '#8b949e', lineHeight: 1.7 }}>
                Delivered as an interactive online report within 48 hours.
              </p>

              <p className="text-xs mb-5" style={{ color: '#c9a227' }}>
                💡 Want the full picture? Upgrade to Intelligence for £300.
              </p>

              <BuyButton tier="insight" label="Buy Insight Report — £199" className="btn-primary w-full text-lg py-3" />
            </div>

            {/* ── Intelligence Report ⭐ ── */}
            <div style={{ background: '#161b22', border: '2px solid #FFD700', borderRadius: '16px', padding: '36px', position: 'relative' }}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: 'rgba(255,215,0,0.2)', color: '#FFD700' }}>
                ⭐ MOST POPULAR
              </div>

              <h3 className="text-2xl font-bold mb-1">Intelligence Report — <span style={{ color: '#FFD700' }}>£499</span></h3>
              <p className="text-sm italic mb-5" style={{ color: '#c9a227' }}>&ldquo;Help me buy it.&rdquo;</p>

              <p className="font-semibold text-sm mb-3 uppercase tracking-wider" style={{ color: '#c9a227' }}>All 15 sections:</p>
              <p className="text-sm mb-3" style={{ color: '#8b949e' }}>Everything in Insight, plus:</p>
              <ul className="space-y-2 mb-6">
                {[
                  'Financial Analysis',
                  'Staffing & Hidden Costs',
                  'Future Outlook',
                  'Profit Improvement Plan',
                  'Due Diligence & Negotiation',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span style={{ color: '#22c55e' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm mb-6" style={{ color: '#8b949e', lineHeight: 1.7 }}>
                Delivered as an interactive online report within 48 hours.
              </p>

              <BuyButton tier="intelligence" label="Buy Intelligence Report — £499" className="btn-primary w-full text-lg py-3" />
            </div>
          </div>

          <p className="text-center mt-10 text-sm" style={{ color: '#8b949e' }}>
            💡 Already bought Insight? Upgrade to Intelligence for £300 — no new research needed.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ TESTIMONIAL QUOTE (PROMINENT) ═══════════════════════════ */}
      <section 
        className="py-20 my-0" 
        style={{ 
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
          borderTop: '2px solid rgba(255, 215, 0, 0.3)',
          borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Large decorative quote mark */}
            <div 
              className="mb-6"
              style={{ 
                fontSize: '6rem', 
                lineHeight: 1, 
                color: 'rgba(255, 215, 0, 0.3)',
                fontFamily: 'Georgia, serif',
              }}
            >
              &ldquo;
            </div>
            
            <blockquote 
              className="text-xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-8"
              style={{ 
                color: '#fff',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              }}
            >
              We&apos;ve operated <span style={{ color: '#FFD700', fontWeight: 600 }}>40 Post Office branches</span>. We&apos;ve seen what makes them succeed and what makes them fail. Now we&apos;re sharing that insight with buyers who want to make <span style={{ color: '#FFD700', fontWeight: 600 }}>smarter decisions</span>.
            </blockquote>
            
            <div 
              style={{ 
                width: '100px', 
                height: '3px', 
                background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
                margin: '0 auto 24px',
              }}
            />
            
            <cite 
              className="text-lg md:text-xl font-semibold not-italic block"
              style={{ color: '#FFD700' }}
            >
              — 15 Years in Post Office Operations
            </cite>
            
            <p className="mt-4 text-sm" style={{ color: '#8b949e' }}>
              The team behind FCM Intelligence
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CONSULTATION SERVICES TEASER ═══════════════════════════ */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(30, 58, 95, 0.15) 100%)', borderTop: '1px solid rgba(201,162,39,0.2)', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1 rounded-full mb-6" style={{ background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227', fontSize: '0.85rem', fontWeight: 600 }}>
            🎓 CONSULTATION SERVICES
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need More Than Intelligence?</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto mb-6 text-lg">
            Business plans, interview prep, operator training, and ongoing advisory support — everything you need to succeed as a Post Office operator.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d' }}>
              <span>📋</span><span style={{ color: '#8b949e' }}>Business Plans</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d' }}>
              <span>🎤</span><span style={{ color: '#8b949e' }}>Interview Prep</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d' }}>
              <span>🎓</span><span style={{ color: '#8b949e' }}>Training</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d' }}>
              <span>💬</span><span style={{ color: '#8b949e' }}>Advisory</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6" style={{ background: 'rgba(201,162,39,0.15)', border: '1px solid #c9a227' }}>
            <span style={{ color: '#c9a227', fontWeight: 700 }}>⭐ FCM Insiders save 15% on all services</span>
          </div>
          <div>
            <Link href="/insider#services" className="btn-primary text-lg px-8 py-3">View Services &amp; Pricing</Link>
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
                <option value="intelligence">Intelligence Report — £499</option>
                <option value="insight">Insight Report — £199</option>
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
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.4)' }}>
              <span>🎓</span>
              <div>
                <h4 className="font-bold text-sm" style={{ color: '#c9a227' }}>15% Off All Services</h4>
                <p className="text-sm" style={{ color: '#8b949e' }}>Business plans, training, advisory — save on every consultation service</p>
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
