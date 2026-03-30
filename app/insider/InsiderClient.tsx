'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';

const BRAND = {
  dark: '#0d1117',
  darkDeep: '#010409',
  gold: '#c9a227',
  goldPro: '#D4AF37',
  navy: '#0B1D3A',
  white: '#ffffff',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  cardBg: '#161b22',
  border: '#30363d',
  proBorder: '#1e2733',
  green: '#22c55e',
  muted: '#57606a',
};

const REGIONS = [
  'North West', 'North East', 'Yorkshire', 'East Midlands', 'West Midlands',
  'South East', 'South West', 'East Anglia', 'London', 'Scotland', 'Wales',
];

const BUSINESS_TYPES = [
  'Post Office', 'Convenience Store', 'Off-Licence', 'Newsagent', 'General Store',
];

const BUDGET_OPTIONS = [
  { label: 'Under £50k', min: 0, max: 50000 },
  { label: '£50k — £100k', min: 50000, max: 100000 },
  { label: '£100k — £200k', min: 100000, max: 200000 },
  { label: '£200k — £500k', min: 200000, max: 500000 },
  { label: '£500k+', min: 500000, max: 1000000 },
];

const EXPERIENCE_OPTIONS = [
  { value: 'first_time', label: 'First-time buyer', desc: 'Never owned a retail business before' },
  { value: 'existing_operator', label: 'Existing operator', desc: 'Already run a retail business' },
  { value: 'portfolio', label: 'Portfolio builder', desc: 'Looking to add to existing portfolio' },
];

const TIMELINE_OPTIONS = [
  { value: 'ready_now', label: 'Ready now' },
  { value: '3_months', label: 'Within 3 months' },
  { value: '6_months', label: 'Within 6 months' },
  { value: 'browsing', label: 'Just browsing' },
];

/* ─── Standard tier features ─── */
const STANDARD_FEATURES = [
  'Weekly personalised listing alerts',
  'FCM Insider Picks — hand-selected opportunities',
  'Match scoring based on your criteria',
  '15% off all consultation services',
  'Priority support — 24hr response',
];

/* ─── Pro tier features ─── */
const PRO_FEATURES = [
  'Everything in Standard',
  'Pro Dashboard — live command centre',
  'Side-by-side comparison tool',
  '6 professional email templates',
  'Add-on services (Strategy calls, Offer guidance, Lease breakdown)',
  'Priority matching — first to see new listings',
];

/* ═══════════════════════════════════════════
   PREFERENCES MODAL (4-step)
   ═══════════════════════════════════════════ */
function PreferencesModal({ isOpen, onClose, tier }: {
  isOpen: boolean;
  onClose: () => void;
  tier: 'standard' | 'pro';
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_regions: [] as string[],
    min_budget: 100000,
    max_budget: 200000,
    business_types: [] as string[],
    experience_level: '',
    timeline: '',
  });

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(false);
      setError('');
    }
  }, [isOpen]);

  const toggleRegion = (r: string) => {
    setForm(prev => ({
      ...prev,
      preferred_regions: prev.preferred_regions.includes(r)
        ? prev.preferred_regions.filter(x => x !== r)
        : [...prev.preferred_regions, r],
    }));
  };

  const toggleType = (t: string) => {
    setForm(prev => ({
      ...prev,
      business_types: prev.business_types.includes(t)
        ? prev.business_types.filter(x => x !== t)
        : [...prev.business_types, t],
    }));
  };

  const setBudget = (min: number, max: number) => {
    setForm(prev => ({ ...prev, min_budget: min, max_budget: max }));
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/insider-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, ...form }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tierLabel = tier === 'pro' ? 'Insider Pro — £50/mo' : 'Insider Standard — £15/mo';
  const priceLabel = tier === 'pro' ? '£50' : '£15';

  const chipBase: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    background: 'transparent',
  };

  const chipActive: React.CSSProperties = {
    ...chipBase,
    border: `1px solid ${BRAND.goldPro}`,
    background: `${BRAND.goldPro}15`,
    color: BRAND.goldPro,
  };

  const chipInactive: React.CSSProperties = {
    ...chipBase,
    border: `1px solid ${BRAND.proBorder}`,
    color: BRAND.textSecondary,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: 8,
    border: `1px solid ${BRAND.proBorder}`,
    background: BRAND.darkDeep,
    color: BRAND.white,
    fontSize: 14,
    boxSizing: 'border-box',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    color: BRAND.textSecondary,
    display: 'block',
    marginBottom: 6,
  };

  const btnPrimary = (enabled: boolean): React.CSSProperties => ({
    flex: 2,
    padding: '14px',
    borderRadius: 10,
    border: 'none',
    background: enabled ? BRAND.goldPro : BRAND.proBorder,
    color: enabled ? '#000' : BRAND.muted,
    fontSize: 15,
    fontWeight: 600,
    cursor: enabled ? 'pointer' : 'not-allowed',
    transition: 'all 0.15s ease',
  });

  const btnBack: React.CSSProperties = {
    flex: 1,
    padding: '14px',
    borderRadius: 10,
    border: `1px solid ${BRAND.proBorder}`,
    background: 'transparent',
    color: BRAND.textSecondary,
    fontSize: 14,
    cursor: 'pointer',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          background: BRAND.dark,
          border: `1px solid ${BRAND.proBorder}`,
          borderRadius: 20,
          padding: 32,
          maxWidth: 500,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, background: 'none', border: 'none',
            color: BRAND.textSecondary, fontSize: 20, cursor: 'pointer', lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              style={{
                flex: 1, height: 3, borderRadius: 2,
                background: s <= step ? BRAND.goldPro : BRAND.proBorder,
                transition: 'background 0.2s ease',
              }}
            />
          ))}
        </div>

        {/* Tier label */}
        <div style={{
          fontSize: 10, fontWeight: 600, color: BRAND.goldPro, textTransform: 'uppercase',
          letterSpacing: 2, marginBottom: 8,
        }}>
          {tierLabel}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#ef444420', border: '1px solid #ef444440', borderRadius: 8,
            padding: '10px 14px', marginBottom: 16, color: '#ef4444', fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* ── Step 1: Name & Email ── */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: BRAND.white, marginBottom: 4 }}>
              Let&apos;s get started
            </h3>
            <p style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 20 }}>
              Tell us about yourself so we can personalise your experience.
            </p>

            <label style={labelStyle}>Full name *</label>
            <input
              type="text" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Your name" style={{ ...inputStyle, marginBottom: 16 }}
            />

            <label style={labelStyle}>Email address *</label>
            <input
              type="email" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com" style={{ ...inputStyle, marginBottom: 16 }}
            />

            <label style={labelStyle}>Phone (optional)</label>
            <input
              type="tel" value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="07..." style={{ ...inputStyle, marginBottom: 24 }}
            />

            <button
              onClick={() => { if (form.name && form.email) setStep(2); }}
              disabled={!form.name || !form.email}
              style={{ ...btnPrimary(!!form.name && !!form.email), width: '100%', flex: 'unset' }}
            >
              Next — Choose your regions
            </button>
          </div>
        )}

        {/* ── Step 2: Regions ── */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: BRAND.white, marginBottom: 4 }}>
              Where are you looking?
            </h3>
            <p style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 20 }}>
              Select all regions you&apos;d consider. We&apos;ll match listings in these areas.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {REGIONS.map(r => (
                <button
                  key={r} onClick={() => toggleRegion(r)}
                  style={form.preferred_regions.includes(r) ? chipActive : chipInactive}
                >
                  {r}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep(1)} style={btnBack}>Back</button>
              <button
                onClick={() => { if (form.preferred_regions.length > 0) setStep(3); }}
                disabled={form.preferred_regions.length === 0}
                style={btnPrimary(form.preferred_regions.length > 0)}
              >
                Next — Budget &amp; types
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Budget & Business Types ── */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: BRAND.white, marginBottom: 4 }}>
              What&apos;s your budget?
            </h3>
            <p style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 20 }}>
              We&apos;ll only show listings within your price range.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {BUDGET_OPTIONS.map(b => (
                <button
                  key={b.label}
                  onClick={() => setBudget(b.min, b.max)}
                  style={form.min_budget === b.min && form.max_budget === b.max ? chipActive : chipInactive}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <h4 style={{ fontSize: 16, fontWeight: 600, color: BRAND.white, marginBottom: 12 }}>
              What types of business?
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {BUSINESS_TYPES.map(t => (
                <button
                  key={t} onClick={() => toggleType(t)}
                  style={form.business_types.includes(t) ? chipActive : chipInactive}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep(2)} style={btnBack}>Back</button>
              <button
                onClick={() => { if (form.business_types.length > 0) setStep(4); }}
                disabled={form.business_types.length === 0}
                style={btnPrimary(form.business_types.length > 0)}
              >
                Next — Almost done
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Experience, Timeline & Summary ── */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: BRAND.white, marginBottom: 4 }}>
              About your search
            </h3>
            <p style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 20 }}>
              This helps us prioritise the right listings for you.
            </p>

            <label style={labelStyle}>Your experience level</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {EXPERIENCE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setForm(p => ({ ...p, experience_level: opt.value }))}
                  style={{
                    padding: '12px 16px', borderRadius: 8, textAlign: 'left' as const, cursor: 'pointer',
                    border: form.experience_level === opt.value ? `1px solid ${BRAND.goldPro}` : `1px solid ${BRAND.proBorder}`,
                    background: form.experience_level === opt.value ? `${BRAND.goldPro}15` : 'transparent',
                  }}
                >
                  <div style={{
                    fontSize: 14, fontWeight: 500,
                    color: form.experience_level === opt.value ? BRAND.goldPro : BRAND.textPrimary,
                  }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 12, color: BRAND.textSecondary }}>{opt.desc}</div>
                </button>
              ))}
            </div>

            <label style={labelStyle}>Timeline</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {TIMELINE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setForm(p => ({ ...p, timeline: opt.value }))}
                  style={form.timeline === opt.value ? chipActive : chipInactive}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div style={{
              background: BRAND.darkDeep, border: `1px solid ${BRAND.proBorder}`, borderRadius: 12,
              padding: 16, marginBottom: 20, fontSize: 13,
            }}>
              <div style={{ fontWeight: 600, color: BRAND.goldPro, marginBottom: 8 }}>Your preferences</div>
              <div style={{ color: BRAND.textSecondary, lineHeight: 1.8 }}>
                <div><span style={{ color: BRAND.textPrimary }}>Regions:</span> {form.preferred_regions.join(', ')}</div>
                <div><span style={{ color: BRAND.textPrimary }}>Budget:</span> £{(form.min_budget / 1000).toFixed(0)}k — £{(form.max_budget / 1000).toFixed(0)}k</div>
                <div><span style={{ color: BRAND.textPrimary }}>Types:</span> {form.business_types.join(', ')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep(3)} style={btnBack}>Back</button>
              <button
                onClick={handleCheckout}
                disabled={loading || !form.experience_level || !form.timeline}
                style={btnPrimary(!loading && !!form.experience_level && !!form.timeline)}
              >
                {loading ? 'Redirecting to checkout...' : `Continue to payment — ${priceLabel}/mo`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRICING CARDS — Standard + Pro side by side
   ═══════════════════════════════════════════ */
function PricingCards({ onSelectTier }: { onSelectTier: (tier: 'standard' | 'pro') => void }) {
  return (
    <section style={{ padding: '0 24px 60px', maxWidth: 900, margin: '0 auto' }}>
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
        {/* ── Standard Tier ── */}
        <div style={{
          background: BRAND.dark,
          border: `1px solid ${BRAND.proBorder}`,
          borderRadius: 20,
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 600, color: BRAND.textSecondary,
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8,
          }}>
            FCM Insider
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: BRAND.white, marginBottom: 4 }}>
            Standard
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: BRAND.white }}>£15</span>
            <span style={{ fontSize: 14, color: BRAND.textSecondary }}>/month</span>
          </div>
          <p style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 24 }}>
            Weekly alerts matched to your preferences. Never miss the right opportunity.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
            {STANDARD_FEATURES.map((f, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, fontSize: 14, color: BRAND.textPrimary, marginBottom: 12 }}>
                <span style={{ color: BRAND.green, flexShrink: 0 }}>✓</span> {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelectTier('standard')}
            style={{
              width: '100%', padding: 14, borderRadius: 10,
              border: `1px solid ${BRAND.goldPro}`, background: 'transparent',
              color: BRAND.goldPro, fontSize: 15, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Join Standard — £15/mo
          </button>
          <p style={{ fontSize: 12, color: BRAND.muted, textAlign: 'center', marginTop: 8, marginBottom: 0 }}>
            Cancel anytime. No commitment.
          </p>
        </div>

        {/* ── Pro Tier ── */}
        <div style={{
          position: 'relative',
          background: BRAND.dark,
          border: `2px solid ${BRAND.goldPro}40`,
          borderRadius: 20,
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Badge */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            background: `linear-gradient(135deg, ${BRAND.goldPro}, #d4b84a)`,
            color: '#000', fontSize: 10, fontWeight: 700, padding: '4px 16px',
            borderRadius: '0 0 8px 8px', textTransform: 'uppercase', letterSpacing: 1,
          }}>
            Most popular
          </div>

          <div style={{
            fontSize: 10, fontWeight: 600, color: BRAND.goldPro,
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, marginTop: 8,
          }}>
            FCM Insider
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: BRAND.white, marginBottom: 4 }}>
            Pro
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: BRAND.goldPro }}>£50</span>
            <span style={{ fontSize: 14, color: BRAND.textSecondary }}>/month</span>
          </div>
          <p style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 24 }}>
            Full dashboard access with comparison tools, templates, and AI-powered services.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
            {PRO_FEATURES.map((f, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, fontSize: 14, color: BRAND.textPrimary, marginBottom: 12 }}>
                <span style={{ color: BRAND.goldPro, flexShrink: 0 }}>✓</span> {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelectTier('pro')}
            style={{
              width: '100%', padding: 14, borderRadius: 10, border: 'none',
              background: BRAND.goldPro, color: '#000',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Go Pro — £50/mo
          </button>
          <p style={{ fontSize: 12, color: BRAND.muted, textAlign: 'center', marginTop: 8, marginBottom: 0 }}>
            Cancel anytime. No commitment.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE CONTENT
   ═══════════════════════════════════════════ */
function InsiderContent() {
  const searchParams = useSearchParams();
  const [feedbackBanner, setFeedbackBanner] = useState<{ type: string; message: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'standard' | 'pro'>('standard');

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

  const openPreferencesModal = (tier: 'standard' | 'pro') => {
    setSelectedTier(tier);
    setModalOpen(true);
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
          fontSize: 14, fontWeight: 600,
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
      <PricingCards onSelectTier={openPreferencesModal} />

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

      {/* Already a Pro member? */}
      <section style={{ padding: '0 24px 80px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 8 }}>
          Already a Pro member?
        </p>
        <a href="/pro" style={{
          color: BRAND.goldPro, fontWeight: 600, fontSize: 14, textDecoration: 'none',
        }}>
          Sign in to your Pro Dashboard →
        </a>
      </section>

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tier={selectedTier}
      />
    </div>
  );
}

export default function InsiderClient() {
  return (
    <AppLayout>
      <Suspense fallback={<div style={{ background: '#0d1117', minHeight: '100vh' }} />}>
        <InsiderContent />
      </Suspense>
    </AppLayout>
  );
}
