/**
 * FCM Intelligence — Insider Page (Concierge Reframe)
 *
 * Drop-in replacement for app/insider/InsiderClient.tsx
 * Key changes:
 * - Hero sells "someone in your corner," not "automated matching"
 * - Features framed as things "we do for you," not system capabilities
 * - Social proof section (when available)
 * - Preferences form kept functional, wrapped in warmer language
 * - Feedback confirmation banner (reads ?feedback= query param)
 *
 * Uses existing FCM brand: dark #0d1117, gold #c9a227, navy #0B1D3A
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const BRAND = {
  dark: '#0d1117',
  gold: '#c9a227',
  navy: '#0B1D3A',
  white: '#ffffff',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  cardBg: '#161b22',
  border: '#30363d',
};

// Region options (matching existing preferences form)
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

export default function InsiderClient() {
  const searchParams = useSearchParams();
  const [feedbackBanner, setFeedbackBanner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferred_regions: [],
    business_types: [],
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

  // Handle feedback redirect from email
  useEffect(() => {
    const feedback = searchParams.get('feedback');
    const msg = searchParams.get('msg');
    if (feedback === 'up' || feedback === 'down') {
      setFeedbackBanner({
        type: feedback,
        message: msg || (feedback === 'up' ? 'Thanks! We\'ll find more like this.' : 'Got it — we\'ll adjust your matches.'),
      });
      // Auto-dismiss after 5 seconds
      setTimeout(() => setFeedbackBanner(null), 5000);
    }
  }, [searchParams]);

  const handleRegionToggle = (region) => {
    setFormData(prev => ({
      ...prev,
      preferred_regions: prev.preferred_regions.includes(region)
        ? prev.preferred_regions.filter(r => r !== region)
        : [...prev.preferred_regions, region],
    }));
  };

  const handleTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      business_types: prev.business_types.includes(type)
        ? prev.business_types.filter(t => t !== type)
        : [...prev.business_types, type],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/insider-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error('Preferences save failed:', err);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ background: BRAND.dark, minHeight: '100vh', color: BRAND.textPrimary }}>

      {/* Feedback banner */}
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

      {/* Hero — Concierge positioning */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <p style={{ color: BRAND.gold, fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 20 }}>
          FCM INSIDER
        </p>
        <h1 style={{
          color: BRAND.white, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800,
          lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.02em',
        }}>
          Someone watching the market,<br />so you don't have to
        </h1>
        <p style={{ color: BRAND.textPrimary, fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 32px' }}>
          Tell us what you're looking for. Every week, we'll send you a shortlist of opportunities
          that match — hand-picked, personally noted, ready for you to act on.
        </p>
        <p style={{
          display: 'inline-block', background: `${BRAND.gold}15`, border: `1px solid ${BRAND.gold}40`,
          borderRadius: 8, padding: '10px 20px', color: BRAND.gold, fontSize: 14, fontWeight: 600,
        }}>
          £15/month · Cancel anytime · 15% off consultations
        </p>
      </section>

      {/* How it works — concierge framing */}
      <section style={{ padding: '0 24px 60px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { icon: '🎯', title: 'You tell us what you want', desc: 'Budget, region, business type, experience level — the more you share, the better we get.' },
            { icon: '👁️', title: 'We watch the market daily', desc: 'New listings from Daltons, RightBiz, and BusinessesForSale, checked every day against your criteria.' },
            { icon: '📬', title: 'Your weekly shortlist arrives', desc: 'Monday mornings, your top matches land in your inbox — scored, noted, and ready for you to review.' },
            { icon: '⚡', title: "Can't-miss alerts", desc: "When something especially strong comes in mid-week, we won't make you wait — you'll hear from us right away." },
          ].map((step, i) => (
            <div key={i} style={{
              background: BRAND.cardBg, border: `1px solid ${BRAND.border}`, borderRadius: 10,
              padding: 24,
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{step.icon}</div>
              <h3 style={{ color: BRAND.white, fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
                {step.title}
              </h3>
              <p style={{ color: BRAND.textSecondary, fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The feedback learning pitch */}
      <section style={{
        padding: '40px 24px', maxWidth: 680, margin: '0 auto 40px',
        background: BRAND.navy, borderRadius: 12, textAlign: 'center',
      }}>
        <h2 style={{ color: BRAND.white, fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          Your matches get smarter every week
        </h2>
        <p style={{ color: BRAND.textPrimary, fontSize: 15, lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
          Every thumbs up or thumbs down you give us in your digest teaches us more about what you're really after.
          Over time, your matches sharpen — so the longer you're an Insider, the better it gets.
        </p>
      </section>

      {/* Preferences form */}
      <section id="preferences" style={{ padding: '0 24px 80px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{
          background: BRAND.cardBg, border: `1px solid ${BRAND.border}`, borderRadius: 12,
          padding: 'clamp(24px, 4vw, 40px)',
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <h2 style={{ color: BRAND.white, fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                We're on it
              </h2>
              <p style={{ color: BRAND.textPrimary, fontSize: 15, lineHeight: 1.6 }}>
                Your preferences are saved and we're already matching you against current listings.
                Your first personalised digest will arrive on Monday.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ color: BRAND.white, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                Tell us what you're looking for
              </h2>
              <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.5, marginBottom: 28 }}>
                Takes about 60 seconds. You can update these anytime.
              </p>

              {/* Name + Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input
                    type="text" value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="First name"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email" value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@email.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Regions */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Which regions interest you?</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {REGIONS.map(r => (
                    <button
                      key={r} onClick={() => handleRegionToggle(r)}
                      style={{
                        ...chipStyle,
                        background: formData.preferred_regions.includes(r) ? `${BRAND.gold}20` : 'transparent',
                        borderColor: formData.preferred_regions.includes(r) ? BRAND.gold : BRAND.border,
                        color: formData.preferred_regions.includes(r) ? BRAND.gold : BRAND.textSecondary,
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business types */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Business types</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {BUSINESS_TYPES.map(t => (
                    <button
                      key={t} onClick={() => handleTypeToggle(t)}
                      style={{
                        ...chipStyle,
                        background: formData.business_types.includes(t) ? `${BRAND.gold}20` : 'transparent',
                        borderColor: formData.business_types.includes(t) ? BRAND.gold : BRAND.border,
                        color: formData.business_types.includes(t) ? BRAND.gold : BRAND.textSecondary,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Min budget (£)</label>
                  <input
                    type="number" value={formData.min_budget}
                    onChange={e => setFormData(p => ({ ...p, min_budget: e.target.value }))}
                    placeholder="e.g. 50000" style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Max budget (£)</label>
                  <input
                    type="number" value={formData.max_budget}
                    onChange={e => setFormData(p => ({ ...p, max_budget: e.target.value }))}
                    placeholder="e.g. 250000" style={inputStyle}
                  />
                </div>
              </div>

              {/* Tenure */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Tenure preference</label>
                <select
                  value={formData.tenure_preference}
                  onChange={e => setFormData(p => ({ ...p, tenure_preference: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="any">No preference</option>
                  <option value="freehold">Freehold</option>
                  <option value="leasehold">Leasehold</option>
                  <option value="either">Either</option>
                </select>
              </div>

              {/* Min profit */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Minimum net profit (£/year)</label>
                <input
                  type="number" value={formData.min_profit}
                  onChange={e => setFormData(p => ({ ...p, min_profit: e.target.value }))}
                  placeholder="e.g. 30000" style={inputStyle}
                />
              </div>

              {/* Experience */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Your experience level</label>
                <select
                  value={formData.experience_level}
                  onChange={e => setFormData(p => ({ ...p, experience_level: e.target.value }))}
                  style={inputStyle}
                >
                  {EXPERIENCE_LEVELS.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              {/* Timeline */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>How soon are you looking to buy?</label>
                <select
                  value={formData.timeline}
                  onChange={e => setFormData(p => ({ ...p, timeline: e.target.value }))}
                  style={inputStyle}
                >
                  {TIMELINES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Consultation */}
              <div id="consultation" style={{ marginBottom: 24 }}>
                <label style={{ ...chipStyle, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, borderColor: formData.wants_consultation ? BRAND.gold : BRAND.border, color: formData.wants_consultation ? BRAND.gold : BRAND.textSecondary, background: formData.wants_consultation ? `${BRAND.gold}15` : 'transparent' }}
                  onClick={() => setFormData(p => ({ ...p, wants_consultation: !p.wants_consultation }))}
                >
                  <span>{formData.wants_consultation ? '☑' : '☐'}</span>
                  I'd like to hear about consultation services (15% Insider discount)
                </label>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Anything else we should know?</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Specific towns, must-haves, deal-breakers..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.email}
                style={{
                  width: '100%', padding: '14px 24px', background: BRAND.gold, color: BRAND.dark,
                  border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  opacity: submitting || !formData.email ? 0.5 : 1,
                }}
              >
                {submitting ? 'Saving...' : 'Save my preferences & start matching'}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// Shared styles
const labelStyle = {
  display: 'block',
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
  boxSizing: 'border-box',
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
