"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { ListingCard, isSoldListingVisible } from "@/components/listing-card";
import { BuyButton } from "@/components/buy-button";

import { listings } from "@/lib/listings-data";

// Get 3 featured listings with daily rotation
function getFeaturedListings() {
  const availableListings = listings.filter(listing => isSoldListingVisible(listing));
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const startIndex = dayOfYear % Math.max(1, availableListings.length - 2);
  const featured = [];
  for (let i = 0; i < 3 && i < availableListings.length; i++) {
    const idx = (startIndex + i) % availableListings.length;
    featured.push(availableListings[idx]);
  }
  return featured;
}

// Score Ring SVG component
function ScoreRing({ score, label, grade, color }: { score: number; label: string; grade: string; color: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 76, height: 76 }}>
        <svg width="76" height="76" viewBox="0 0 76 76">
          <circle cx="38" cy="38" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle
            cx="38" cy="38" r={radius} fill="none"
            stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            transform="rotate(-90 38 38)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-lg font-bold" style={{ color }}>{score}</span>
          <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>{grade}</span>
        </div>
      </div>
      <span className="text-xs text-center font-medium" style={{ color: '#8b949e', maxWidth: 80 }}>{label}</span>
    </div>
  );
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
            <Link href="/reports" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto">View Reports</Link>
            <Link href="#sample-preview" className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto">See a Sample Report</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ STATS ROW ═══════════════════════════ */}
      <section style={{ borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d', background: '#0d1117' }}>
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
      <section className="py-6" style={{ background: '#0d1117', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm" style={{ color: '#8b949e' }}>
            <div className="flex items-center gap-2"><span style={{ color: '#c9a227' }}>🔒</span><span>SSL Secured</span></div>
            <div className="flex items-center gap-2"><span style={{ color: '#c9a227' }}>⭐</span><span>4.9/5 Average Rating</span></div>
            <div className="flex items-center gap-2"><span style={{ color: '#c9a227' }}>🏆</span><span>15 Years Industry Experience</span></div>
            <div className="flex items-center gap-2"><span style={{ color: '#c9a227' }}>🇬🇧</span><span>UK Based Team</span></div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ SECTION 3: TWO-PATH DISCOVERY ═══════════════════════════ */}
      <section className="py-20" style={{ background: '#0d1117' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Two Ways to Win</h2>
            <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto text-lg">
              Find the right opportunity. Then know exactly what you&apos;re buying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left: Listings Card — /reports bordered tier aesthetic */}
            <div style={{
              border: '1px solid rgba(201,162,39,0.18)',
              borderRadius: 20,
              padding: 0,
              overflow: 'hidden',
              background: '#0d1117',
            }}>
              {/* Header bar */}
              <div style={{
                background: '#0B1D3A',
                padding: '28px 32px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
                <div className="flex items-center justify-between">
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(201,162,39,0.5)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>FCM Intelligence</div>
                    <div className="text-2xl font-bold text-white">Find Opportunities</div>
                  </div>
                  <div className="text-4xl">🔍</div>
                </div>
                <div style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                  Daily scanning so you never miss a deal
                </div>
              </div>
              {/* Body */}
              <div style={{ padding: '24px 32px 32px' }}>
                <ul className="space-y-3 mb-6">
                  {[
                    'Daltons, RightBiz, BusinessesForSale — monitored daily',
                    'Every listing verified as still active',
                    'Quality filtered — no overpriced duds',
                    'Expert context on every opportunity',
                    'Updated daily with new finds',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <span style={{ color: '#22c55e', marginTop: 1 }}>✓</span>
                      <span style={{ color: '#e6edf3' }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/opportunities" className="btn-secondary w-full text-base py-3">Browse Listings →</Link>
              </div>
            </div>

            {/* Right: Reports Card — /reports bordered tier aesthetic */}
            <div style={{
              border: '1px solid rgba(201,162,39,0.18)',
              borderRadius: 20,
              padding: 0,
              overflow: 'hidden',
              background: '#0d1117',
            }}>
              {/* Header bar */}
              <div style={{
                background: '#0B1D3A',
                padding: '28px 32px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.4), transparent)' }} />
                <div className="flex items-center justify-between">
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#c9a227', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>FCM Intelligence</div>
                    <div className="text-2xl font-bold text-white">Know What You&apos;re Buying</div>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
                <div style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                  Intelligence reports that reveal the full picture
                </div>
              </div>
              {/* Body */}
              <div style={{ padding: '24px 32px 32px' }}>
                <ul className="space-y-3 mb-6">
                  {[
                    'Insight Report — £199 (10 verified sections)',
                    'Intelligence Report — £499 (all 15 sections + call)',
                    'Delivered within 48 hours',
                    'Location, financial, competition — all covered',
                    'Upgrade anytime — pay the difference',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <span style={{ color: '#c9a227', marginTop: 1 }}>✓</span>
                      <span style={{ color: '#e6edf3' }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="#report-tiers" className="btn-primary w-full text-base py-3">See What&apos;s Inside →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ DISCLAIMER ═══════════════════════════ */}
      <section className="py-6" style={{ background: '#0d1117', borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm max-w-4xl mx-auto" style={{ color: '#8b949e', lineHeight: 1.7 }}>
            <strong className="text-white">Disclaimer:</strong> Listings are sourced from third-party sites. We do not control original listings and cannot guarantee availability. Links direct to the original source — verify status before proceeding. Listings marked SOLD are removed from this page.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURED LISTINGS ═══════════════════════════ */}
      <section className="py-20" id="opportunities" style={{ background: 'linear-gradient(180deg, #0d1117 0%, #111820 100%)' }}>
        <div className="container mx-auto px-4">
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
        </div>
      </section>

      {/* ═══════════════════════════ ALERTS CTA BANNER ═══════════════════════════ */}
      <section className="py-8" style={{ background: '#111820', borderTop: '1px solid rgba(201,162,39,0.15)', borderBottom: '1px solid rgba(201,162,39,0.15)' }}>
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

      {/* ═══════════════════════════ TESTIMONIAL (moved BEFORE services for conversion) ═══════════════════════════ */}
      <section 
        className="py-20" 
        style={{ 
          background: 'linear-gradient(180deg, #0a0e14 0%, #111820 50%, #0a0e14 100%)',
          borderTop: '2px solid rgba(255, 215, 0, 0.2)',
          borderBottom: '2px solid rgba(255, 215, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div 
              className="mb-6"
              style={{ 
                fontSize: '6rem', 
                lineHeight: 1, 
                color: 'rgba(255, 215, 0, 0.25)',
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

      {/* ═══════════════════════════ MINI "HOW IT WORKS" BRIDGE ═══════════════════════════ */}
      <section className="py-16" style={{ background: '#0d1117' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">How It Works</h2>
            <p style={{ color: '#8b949e' }}>From listing to intelligence in 3 steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: '01', icon: '🎯', title: 'Pick a Listing', desc: 'Browse our curated opportunities or bring your own.' },
              { step: '02', icon: '📊', title: 'Order a Report', desc: 'Choose Insight (£199) or Intelligence (£499). We do the rest.' },
              { step: '03', icon: '✅', title: 'Decide With Confidence', desc: '48 hours later — every risk, every opportunity, verified.' },
            ].map((s) => (
              <div key={s.step} className="text-center" style={{ position: 'relative' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)',
                  fontSize: '1.5rem', marginBottom: 16,
                }}>{s.icon}</div>
                <div className="font-mono text-xs font-bold mb-2" style={{ color: '#c9a227', letterSpacing: 2 }}>STEP {s.step}</div>
                <h3 className="text-lg font-bold mb-2 text-white">{s.title}</h3>
                <p className="text-sm" style={{ color: '#8b949e', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ REPORT PREVIEW WITH SCORE RINGS ═══════════════════════════ */}
      <section className="py-20" id="sample-preview" style={{ background: 'linear-gradient(180deg, #0d1117 0%, #0a0e14 100%)', borderTop: '1px solid #30363d' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What&apos;s Inside Every Report</h2>
            <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto text-lg">
              Real scores from a real report. Every section verified, every risk quantified.
            </p>
          </div>

          {/* Score Ring Previews */}
          <div className="flex flex-wrap items-start justify-center gap-6 md:gap-10 mb-16 max-w-3xl mx-auto">
            <ScoreRing score={38} label="Crime & Safety" grade="D" color="#C0392B" />
            <ScoreRing score={82} label="Competition" grade="A-" color="#2D8A56" />
            <ScoreRing score={72} label="Demographics" grade="B" color="#c9a227" />
            <ScoreRing score={76} label="Future Outlook" grade="B+" color="#2D8A56" />
            <ScoreRing score={35} label="Online Presence" grade="D" color="#D47735" />
          </div>

          <p className="text-center text-sm mb-16" style={{ color: '#8b949e' }}>
            Scored across up to 15 categories — see how every aspect of the business stacks up.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ TWO-TIER PRICING — /reports tier card design ═══════════════════════════ */}
      <section className="py-20" id="report-tiers" style={{ background: '#0a0e14' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Report</h2>
            <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto text-lg">
              Two tiers. One report. All the intelligence you need.
            </p>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col gap-10">

            {/* ── INSIGHT REPORT — /reports tier card aesthetic (1px gold border) ── */}
            <div style={{
              border: '1px solid rgba(201,162,39,0.18)',
              borderRadius: 20,
              padding: 24,
              background: '#0d1117',
            }}>
              {/* Header block — navy */}
              <div style={{
                background: '#0B1D3A',
                borderRadius: 16,
                padding: '28px 32px',
                marginBottom: 18,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'rgba(201,162,39,0.5)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>FCM Intelligence / Report series</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 26, fontWeight: 700, color: '#FFFFFF' }}>Insight Report</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>£199</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>one-time</div>
                  </div>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>
                  &ldquo;Is this the right business?&rdquo;
                </div>
              </div>

              {/* Key sections */}
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: 1.5, margin: '18px 0 16px' }}>Key sections</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Crime & Safety', score: 38, grade: 'D', color: '#C0392B', headline: '3,087 incidents. 62% violent crime + ASB.' },
                  { label: 'Competition Mapping', score: 82, grade: 'A-', color: '#2D8A56', headline: 'No competition within 1.5km. Crown branch.' },
                  { label: 'Demographics', score: 72, grade: 'B', color: '#c9a227', headline: '50% aged 50+. 70% deprived households.' },
                  { label: 'Online Presence', score: 35, grade: 'D', color: '#D47735', headline: '3.1 stars, 73 reviews. 0% response rate.' },
                ].map((s) => (
                  <div key={s.label} style={{ background: '#0B1D3A', borderRadius: 12, padding: 16, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: 1.5 }}>{s.label}</span>
                      <span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: s.color }}>{s.score}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>{s.grade}</span>
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.3 }}>{s.headline}</div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
                      <div style={{ width: `${s.score}%`, height: '100%', background: s.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Also included */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px 18px', marginBottom: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Also included — 10 sections total</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {['Executive Verdict', 'PO Remuneration', 'Footfall Analysis', 'Location Intelligence', 'Infrastructure', 'Risk Assessment'].map((s) => (
                    <span key={s} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#888888', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 5, height: 5, borderRadius: 3, background: '#2D8A56' }} /> {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Client quote */}
              <div style={{ borderLeft: '3px solid #2D8A56', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '0 10px 10px 0', marginBottom: 24 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 8 }}>
                  &ldquo;Competition mapping showed the nearest PO was 1.5km with restricted hours. When Halifax closing was flagged, we knew banking footfall was ours. Offered 10% below asking and got it.&rdquo;
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: '#c9a227' }}>— FCM buyer, purchased</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#666666' }}>Saved £12,000</div>
              </div>

              {/* CTA */}
              <BuyButton tier="insight" label="Buy Insight Report — £199" className="btn-primary w-full text-lg py-3" />
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#c9a227', textAlign: 'center', marginTop: 12 }}>
                💡 Upgrade to Intelligence anytime for £300
              </p>
            </div>

            {/* ──────────── Divider ──────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px' }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.2), transparent)' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: 'rgba(201,162,39,0.35)', textTransform: 'uppercase', letterSpacing: 2 }}>or go deeper</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.2), transparent)' }} />
            </div>

            {/* ── INTELLIGENCE REPORT — /reports tier card aesthetic (2px gold border + glow) ── */}
            <div style={{
              border: '2px solid rgba(201,162,39,0.35)',
              borderRadius: 20,
              padding: 24,
              background: '#0d1117',
              boxShadow: '0 0 40px rgba(201,162,39,0.06)',
            }}>
              {/* Header block — navy with gold accents */}
              <div style={{
                background: '#0B1D3A',
                borderRadius: 16,
                padding: '28px 32px',
                marginBottom: 18,
                position: 'relative',
                overflow: 'hidden',
                border: '1.5px solid rgba(201,162,39,0.2)',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #c9a227, #d4b84a, #c9a227, transparent)' }} />
                <div style={{ position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #c9a227, #d4b84a)', color: '#0B1D3A', fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, padding: '3px 14px', borderRadius: '0 0 8px 8px', textTransform: 'uppercase', letterSpacing: 1.5 }}>Most popular</div>
                <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginTop: 10 }}>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: '#c9a227', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>FCM Intelligence / Premium series</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 26, fontWeight: 700, color: '#FFFFFF' }}>Intelligence Report</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 700, color: '#c9a227', lineHeight: 1 }}>£499</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>one-time</div>
                  </div>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>
                  &ldquo;Help me buy it.&rdquo;
                </div>
              </div>

              {/* Intelligence-exclusive sections */}
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: 1.5, margin: '18px 0 16px' }}>Intelligence-exclusive sections</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Due Diligence Pack', color: '#c9a227', headline: 'Every question. Every document. Walk in prepared.' },
                  { label: 'Profit Improvement', color: '#c9a227', headline: 'Evidence-based actions with projected ROI.' },
                  { label: 'Future Outlook', color: '#2D8A56', headline: '5-year outlook: planning, developments, trajectory.' },
                  { label: 'Negotiation Strategy', color: '#c9a227', headline: 'Offer range + every question to ask the seller.' },
                ].map((s) => (
                  <div key={s.label} style={{ background: '#0B1D3A', borderRadius: 12, padding: 16, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.3 }}>{s.headline}</div>
                  </div>
                ))}
              </div>

              {/* Also included */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Also included in Intelligence</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {['All 10 Insight sections', 'Financial Analysis', 'Staffing Costs', '60-min Consultation'].map((s) => (
                    <span key={s} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#888888', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 5, height: 5, borderRadius: 3, background: '#c9a227' }} /> {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Consultation call highlight */}
              <div className="flex items-center gap-2 mb-5 p-3 rounded-lg" style={{ background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.12)' }}>
                <span>📞</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#c9a227' }}>Includes 60-minute consultation call</span>
              </div>

              {/* Client quote */}
              <div style={{ borderLeft: '3px solid #c9a227', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '0 10px 10px 0', marginBottom: 24 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 8 }}>
                  &ldquo;I walked in holding 23 documents to request and 15 questions he wasn&apos;t expecting. His face said it all. We agreed £18,000 below asking that afternoon.&rdquo;
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: '#c9a227' }}>— FCM Intelligence buyer</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#666666' }}>Saved £18,000</div>
              </div>

              {/* CTA */}
              <BuyButton tier="intelligence" label="Buy Intelligence Report — £499" className="btn-primary w-full text-lg py-3" />
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#888888', textAlign: 'center', marginTop: 14 }}>
                Already bought Insight? Upgrade for <strong style={{ color: '#c9a227', fontWeight: 600 }}>£300</strong> — no new research needed.
              </p>
            </div>

          </div>

          <div className="text-center mt-10">
            <Link href="/reports" className="text-sm font-semibold underline" style={{ color: '#c9a227' }}>
              See full report details →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CONSULTATION SERVICES ═══════════════════════════ */}
      <section className="py-16" style={{ background: '#0d1117', borderTop: '1px solid rgba(201,162,39,0.15)' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1 rounded-full mb-6" style={{ background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227', fontSize: '0.85rem', fontWeight: 600 }}>
            🎓 CONSULTATION SERVICES
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need More Than Intelligence?</h2>
          <p style={{ color: '#8b949e' }} className="max-w-2xl mx-auto mb-6 text-lg">
            Business plans, interview prep, operator training, and ongoing advisory support — everything you need to succeed as a Post Office operator.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {[
              { icon: '📋', label: 'Business Plans' },
              { icon: '🎤', label: 'Interview Prep' },
              { icon: '🎓', label: 'Training' },
              { icon: '💬', label: 'Advisory' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid #30363d' }}>
                <span>{s.icon}</span><span style={{ color: '#8b949e' }}>{s.label}</span>
              </div>
            ))}
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
      <section className="py-20 container mx-auto px-4" id="contact" style={{ background: 'transparent' }}>
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

      {/* ═══════════════════════════ FCM INSIDER ═══════════════════════════ */}
      <section className="py-20" id="insider" style={{ background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(30, 58, 95, 0.12) 100%)', borderTop: '1px solid rgba(201,162,39,0.2)', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
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
