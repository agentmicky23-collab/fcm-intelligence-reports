'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const BRAND = {
  dark: '#0d1117',
  gold: '#c9a227',
  goldPro: '#D4AF37',
  navy: '#0B1D3A',
  white: '#ffffff',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  cardBg: '#161b22',
  border: '#30363d',
  proBorder: '#1e2733',
};

const REGIONS = [
  'North West', 'North East', 'Yorkshire', 'East Midlands', 'West Midlands',
  'East of England', 'South East', 'South West', 'London', 'Wales', 'Scotland',
];

const BUSINESS_TYPES = [
  'Post Office', 'Convenience Store', 'Newsagent', 'Off Licence',
  'General Store', 'Village Shop',
];

const EXPERIENCE_LEVELS = [
  { value: 'first_time', label: "First-time buyer — I'm new to this" },
  { value: 'existing_operator', label: "Existing operator — I run a similar business" },
  { value: 'multi_branch', label: "Multi-branch — expanding my portfolio" },
  { value: 'investor', label: "Investor — looking at this as an investment" },
];

const TIMELINES = [
  { value: 'browsing', label: 'Just exploring for now' },
  { value: '3_months', label: 'Looking to move in 3 months' },
  { value: '6_months', label: 'Within 6 months' },
  { value: 'ready_now', label: "Ready now — I'm actively looking" },
];

const labelStyle = {
  display: 'block' as const,
  color: BRAND.textSecondary,
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  letterSpacing: '0.3px',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: BRAND.dark,
  border: `1px solid ${BRAND.border}`,
  borderRadius: 6,
  color: BRAND.white,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const chipStyle = {
  padding: '6px 14px',
  border: '1px solid',
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  background: 'transparent',
  transition: 'all 0.15s ease',
};

/* ─── Pricing tiers ─── */
const TIERS = [
  {
    id: 'standard',
    name: 'Standard',
    price: '£15',
    period: '/month',
    priceId: 'price_1TAfx4BMIWL7f1H3i5j1Sj7Z',
    description: 'Weekly listing alerts matched to your criteria',
    cta: 'Start Standard',
    highlighted: false,
    features: [
      { text: 'Weekly email digest', included: true },
      { text: 'Listings matched to your criteria', included: true },
      { text: 'Thumbs up/down feedback loop', included: true },
      { text: 'Mid-week hot alerts', included: true },
      { text: '15% off consultation services', included: true },
      { text: 'Insider Dashboard', included: false },
      { text: 'Compare tool', included: false },
      { text: 'Saved search templates', included: false },
      { text: 'Add-on services & priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '£50',
    period: '/month',
    priceId: 'price_1TGQWlBMIWL7f1H3z3Ofyoxb',
    description: 'Full toolkit for serious buyers',
    cta: 'Upgrade to Pro',
    highlighted: true,
    badge: 'RECOMMENDED',
    features: [
      { text: 'Everything in Standard', included: true },
      { text: 'Insider Dashboard — live market view', included: true },
      { text: 'Compare tool — side-by-side listings', included: true },
      { text: 'Saved search templates', included: true },
      { text: 'Add-on services (mini-reports, area checks)', included: true },
      { text: 'Priority support & direct line', included: true },
      { text: '20% off full Intelligence reports', included: true },
      { text: 'Early access to new features', included: true },
    ],
  },
];

function PricingCards({ onSelectTier }: { onSelectTier: (priceId: string) => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);
    try {
      const res = await fetch('/api/create-insider-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // If not signed in, scroll to preferences form
        onSelectTier(priceId);
        setLoading(null);
      }
    } catch {
      onSelectTier(priceId);
      setLoading(null);
    }
  };

  return (
    <section style={{ padding: '0 24px 60px', maxWidth: 880, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ color: BRAND.white, fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          Choose your plan
        </h2>
        <p style={{ color: BRAND.textSecondary, fontSize: 15 }}>
          Cancel anytime · Promotion codes accepted at checkout
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
        alignItems: 'stretch',
      }}>
        {TIERS.map((tier) => {
          const isPro = tier.highlighted;
          const borderColor = isPro ? BRAND.goldPro : BRAND.proBorder;
          return (
            <div key={tier.id} style={{
              position: 'relative',
              background: BRAND.cardBg,
              border: `${isPro ? '2px' : '1px'} solid ${borderColor}`,
              borderRadius: 14,
              padding: '32px 28px 28px',
              display: 'flex',
              flexDirection: 'column',
              ...(isPro ? { boxShadow: `0 0 30px ${BRAND.goldPro}15` } : {}),
            }}>
              {tier.badge && (
                <div style={{
                  position: 'absolute',
                  top: -13,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: BRAND.goldPro,
                  color: BRAND.dark,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  padding: '5px 16px',
                  borderRadius: 20,
                }}>
                  {tier.badge}
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h3 style={{
                  color: isPro ? BRAND.goldPro : BRAND.white,
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 4,
                }}>
                  {tier.name}
                </h3>
                <p style={{ color: BRAND.textSecondary, fontSize: 13, marginBottom: 16 }}>
                  {tier.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
                  <span style={{
                    color: isPro ? BRAND.goldPro : BRAND.white,
                    fontSize: 40,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}>
                    {tier.price}
                  </span>
                  <span style={{ color: BRAND.textSecondary, fontSize: 15 }}>{tier.period}</span>
                </div>
              </div>

              <div style={{ flex: 1, marginBottom: 24 }}>
                {tier.features.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '7px 0',
                    borderBottom: i < tier.features.length - 1 ? `1px solid ${BRAND.dark}` : 'none',
                  }}>
                    <span style={{
                      color: f.included ? '#22c55e' : BRAND.border,
                      fontSize: 14,
                      lineHeight: '20px',
                      flexShrink: 0,
                    }}>
                      {f.included ? '✓' : '—'}
                    </span>
                    <span style={{
                      color: f.included ? BRAND.textPrimary : BRAND.textSecondary,
                      fontSize: 13.5,
                      lineHeight: '20px',
                      opacity: f.included ? 1 : 0.5,
                    }}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCheckout(tier.priceId)}
                disabled={loading === tier.priceId}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: isPro ? BRAND.goldPro : 'transparent',
                  color: isPro ? BRAND.dark : BRAND.white,
                  border: isPro ? 'none' : `1px solid ${BRAND.border}`,
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: loading === tier.priceId ? 0.6 : 1,
                  transition: 'all 0.15s ease',
                }}
              >
                {loading === tier.priceId ? 'Loading...' : tier.cta}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InsiderContent() {
  const searchParams = useSearchParams();
  const [feedbackBanner, setFeedbackBanner] = useState<{ type: string; message: string } | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferred_regions: [] as string[],
    business_types: [] as string[],
    min_budget: '',
    max_budget: '',
    tenure_preference: 'any',
    min_profit: '',
    experience_level: 'first_time',
    timeline: 'browsing',
    wants_consultation: false,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!searchParams) return;
    const feedback = searchParams.get('feedback');
    const msg = searchParams.get('msg');
    if (feedback === 'up' || feedback === 'down') {
      setFeedbackBanner({
        type: feedback,
        message: msg || (feedback === 'up' ? "Thanks! We'll find more like this." : "Got it — we'll adjust your matches."),
      });
      setTimeout(() => setFeedbackBanner(null), 5000);
    }
  }, [searchParams]);

  const handleRegionToggle = (region: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_regions: prev.preferred_regions.includes(region)
        ? prev.preferred_regions.filter(r => r !== region)
        : [...prev.preferred_regions, region],
    }));
  };

  const handleTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      business_types: prev.business_types.includes(type)
        ? prev.business_types.filter(t => t !== type)
        : [...prev.business_types, type],
    }));
  };

  const handleSelectTier = (priceId: string) => {
    setSelectedTier(priceId);
    // Scroll to preferences form
    setTimeout(() => {
      document.getElementById('preferences')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/insider-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, selectedTier }),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error('Preferences save failed:', err);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ background: BRAND.dark, minHeight: '100vh', color: BRAND.textPrimary }}>

      {feedbackBanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: feedbackBanner.type === 'up' ? '#22c55e20' : '#f59e0b20',
          borderBottom: `1px solid ${feedbackBanner.type === 'up' ? '#22c55e40' : '#f59e0b40'}`,
          padding: '12px 24px', textAlign: 'center',
          color: feedbackBanner.type === 'up' ? '#22c55e' : '#f59e0b',
          fontSize: '14px', fontWeight: 600,
        }}>
          {feedbackBanner.type === 'up' ? '👍' : '👎'} {feedbackBanner.message}
        </div>
      )}

      {/* Hero */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <p style={{ color: BRAND.gold, fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 20 }}>
          FCM INSIDER
        </p>
        <h1 style={{
          color: BRAND.white, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800,
          lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.02em',
        }}>
          Someone watching the market,<br />so you don&apos;t have to
        </h1>
        <p style={{ color: BRAND.textPrimary, fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 32px' }}>
          Tell us what you&apos;re looking for. Every week, we&apos;ll send you a shortlist of opportunities
          that match — hand-picked, personally noted, ready for you to act on.
        </p>
      </section>

      {/* How it works */}
      <section style={{ padding: '0 24px 60px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { icon: '🎯', title: 'You tell us what you want', desc: 'Budget, region, business type, experience level — the more you share, the better we get.' },
            { icon: '👁️', title: 'We watch the market daily', desc: 'New listings from Daltons, RightBiz, and BusinessesForSale, checked every day against your criteria.' },
            { icon: '📬', title: 'Your weekly shortlist arrives', desc: 'Monday mornings, your top matches land in your inbox — scored, noted, and ready for you to review.' },
            { icon: '⚡', title: "Can't-miss alerts", desc: "When something especially strong comes in mid-week, we won't make you wait — you'll hear from us right away." },
          ].map((step, i) => (
            <div key={i} style={{
              background: BRAND.cardBg, border: `1px solid ${BRAND.border}`, borderRadius: 10, padding: 24,
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{step.icon}</div>
              <h3 style={{ color: BRAND.white, fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{step.title}</h3>
              <p style={{ color: BRAND.textSecondary, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <PricingCards onSelectTier={handleSelectTier} />

      {/* Smarter matches callout */}
      <section style={{
        padding: '40px 24px', maxWidth: 680, margin: '0 auto 40px',
        background: BRAND.navy, borderRadius: 12, textAlign: 'center',
      }}>
        <h2 style={{ color: BRAND.white, fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          Your matches get smarter every week
        </h2>
        <p style={{ color: BRAND.textPrimary, fontSize: 15, lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
          Every thumbs up or thumbs down you give us in your digest teaches us more about what you&apos;re really after.
          Over time, your matches sharpen — so the longer you&apos;re an Insider, the better it gets.
        </p>
      </section>

      {/* Preferences Form */}
      <section id="preferences" style={{ padding: '0 24px 80px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{
          background: BRAND.cardBg, border: `1px solid ${BRAND.border}`, borderRadius: 12,
          padding: 'clamp(24px, 4vw, 40px)',
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <h2 style={{ color: BRAND.white, fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                We&apos;re on it
              </h2>
              <p style={{ color: BRAND.textPrimary, fontSize: 15, lineHeight: 1.6 }}>
                Your preferences are saved and we&apos;re already matching you against current listings.
                Your first personalised digest will arrive on Monday.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ color: BRAND.white, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                Tell us what you&apos;re looking for
              </h2>
              <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.5, marginBottom: 28 }}>
                Takes about 60 seconds. You can update these anytime.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="First name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Which regions interest you?</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {REGIONS.map(r => (
                    <button key={r} onClick={() => handleRegionToggle(r)} style={{
                      ...chipStyle,
                      background: formData.preferred_regions.includes(r) ? `${BRAND.gold}20` : 'transparent',
                      borderColor: formData.preferred_regions.includes(r) ? BRAND.gold : BRAND.border,
                      color: formData.preferred_regions.includes(r) ? BRAND.gold : BRAND.textSecondary,
                    }}>{r}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Business types</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {BUSINESS_TYPES.map(t => (
                    <button key={t} onClick={() => handleTypeToggle(t)} style={{
                      ...chipStyle,
                      background: formData.business_types.includes(t) ? `${BRAND.gold}20` : 'transparent',
                      borderColor: formData.business_types.includes(t) ? BRAND.gold : BRAND.border,
                      color: formData.business_types.includes(t) ? BRAND.gold : BRAND.textSecondary,
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Min budget (£)</label>
                  <input type="number" value={formData.min_budget} onChange={e => setFormData(p => ({ ...p, min_budget: e.target.value }))} placeholder="e.g. 50000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Max budget (£)</label>
                  <input type="number" value={formData.max_budget} onChange={e => setFormData(p => ({ ...p, max_budget: e.target.value }))} placeholder="e.g. 250000" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Tenure preference</label>
                <select value={formData.tenure_preference} onChange={e => setFormData(p => ({ ...p, tenure_preference: e.target.value }))} style={inputStyle}>
                  <option value="any">No preference</option>
                  <option value="freehold">Freehold</option>
                  <option value="leasehold">Leasehold</option>
                  <option value="either">Either</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Minimum net profit (£/year)</label>
                <input type="number" value={formData.min_profit} onChange={e => setFormData(p => ({ ...p, min_profit: e.target.value }))} placeholder="e.g. 30000" style={inputStyle} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Your experience level</label>
                <select value={formData.experience_level} onChange={e => setFormData(p => ({ ...p, experience_level: e.target.value }))} style={inputStyle}>
                  {EXPERIENCE_LEVELS.map(l => (<option key={l.value} value={l.value}>{l.label}</option>))}
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>How soon are you looking to buy?</label>
                <select value={formData.timeline} onChange={e => setFormData(p => ({ ...p, timeline: e.target.value }))} style={inputStyle}>
                  {TIMELINES.map(t => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </select>
              </div>

              <div id="consultation" style={{ marginBottom: 24 }}>
                <button
                  type="button"
                  style={{ ...chipStyle, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, borderColor: formData.wants_consultation ? BRAND.gold : BRAND.border, color: formData.wants_consultation ? BRAND.gold : BRAND.textSecondary, background: formData.wants_consultation ? `${BRAND.gold}15` : 'transparent' }}
                  onClick={() => setFormData(p => ({ ...p, wants_consultation: !p.wants_consultation }))}
                >
                  <span>{formData.wants_consultation ? '☑' : '☐'}</span>
                  I&apos;d like to hear about consultation services (15% Insider discount)
                </button>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Anything else we should know?</label>
                <textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} placeholder="Specific towns, must-haves, deal-breakers..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <button onClick={handleSubmit} disabled={submitting || !formData.email} style={{
                width: '100%', padding: '14px 24px', background: BRAND.gold, color: BRAND.dark,
                border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                opacity: submitting || !formData.email ? 0.5 : 1,
              }}>
                {submitting ? 'Saving...' : 'Save my preferences & start matching'}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function InsiderClient() {
  return (
    <Suspense fallback={<div style={{ background: '#0d1117', minHeight: '100vh' }} />}>
      <InsiderContent />
    </Suspense>
  );
}
