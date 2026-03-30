'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ============================================================
// STYLES — dark theme matching site palette
// ============================================================
const S = {
  page: {
    minHeight: '100vh',
    background: '#0d1117',
    color: '#e6edf3',
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '120px 24px 80px',
  },
  heading: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 15,
    color: '#8b949e',
    textAlign: 'center',
    marginBottom: 40,
  },
  card: {
    background: '#161b22',
    border: '1px solid #1e2733',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: 15,
    background: '#161b22',
    border: '1px solid #1e2733',
    borderRadius: 8,
    color: '#e6edf3',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px 24px',
    fontSize: 15,
    fontWeight: 700,
    background: '#D4AF37',
    color: '#000',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  gold: '#D4AF37',
  muted: '#8b949e',
  dimmed: '#57606a',
  border: '#1e2733',
  surface: '#161b22',
  bg: '#0d1117',
};

// ============================================================
// TIER CONFIG
// ============================================================
const TIER_LABELS = {
  insight: { name: 'Insight', color: '#D4AF37' },
  intelligence: { name: 'Intelligence', color: '#a78bfa' },
};

const STATUS_BADGES = {
  delivered: { label: 'Delivered', bg: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '#22c55e30' },
  approved: { label: 'Delivered', bg: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '#22c55e30' },
  in_progress: { label: 'In Progress', bg: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '#D4AF3730' },
  generating: { label: 'In Progress', bg: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '#D4AF3730' },
  pending: { label: 'Preparing', bg: 'rgba(139,148,158,0.12)', color: '#8b949e', border: '#8b949e30' },
  awaiting_review: { label: 'Awaiting Review', bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '#3b82f630' },
};

// ============================================================
// GRADE COLORS
// ============================================================
function gradeColor(grade) {
  if (!grade) return S.muted;
  const g = grade.toUpperCase();
  if (g.startsWith('A')) return '#22c55e';
  if (g.startsWith('B')) return '#D4AF37';
  if (g.startsWith('C')) return '#f59e0b';
  if (g.startsWith('D')) return '#ef4444';
  return S.muted;
}

// ============================================================
// ADMIN FOOTER — discrete Mission Control link
// ============================================================
function AdminFooter() {
  return (
    <div style={{ marginTop: 80, paddingTop: 24, borderTop: `1px solid ${S.border}`, textAlign: 'center' }}>
      <a
        href="/admin"
        style={{
          fontSize: 11,
          color: S.dimmed,
          textDecoration: 'none',
          opacity: 0.5,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.target.style.opacity = '1')}
        onMouseLeave={(e) => (e.target.style.opacity = '0.5')}
      >
        Mission Control
      </a>
    </div>
  );
}

// ============================================================
// SCORE RING — compact circular score display
// ============================================================
function ScoreRing({ score, grade, size = 56 }) {
  if (!score && !grade) return null;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = score ? score / 100 : 0;
  const offset = circumference * (1 - pct);
  const color = gradeColor(grade);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e2733" strokeWidth={4} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {grade && <span style={{ fontSize: 16, fontWeight: 700, color, lineHeight: 1 }}>{grade}</span>}
        {score && <span style={{ fontSize: 10, color: S.muted, lineHeight: 1.2 }}>{score}</span>}
      </div>
    </div>
  );
}

// ============================================================
// REPORT CARD
// ============================================================
function ReportCard({ report }) {
  const tierInfo = TIER_LABELS[report.report_tier] || TIER_LABELS.insight;
  const statusKey = (report.report_status || report.status || 'pending').toLowerCase().replace(/\s+/g, '_');
  const badge = STATUS_BADGES[statusKey] || STATUS_BADGES.pending;
  const isDelivered = ['delivered', 'approved'].includes(statusKey);
  const isInsight = report.report_tier === 'insight';
  const orderDate = report.created_at
    ? new Date(report.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div style={S.card}>
      {/* Top row: business name + status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', lineHeight: 1.3 }}>
            {report.business_name || 'Untitled Report'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
              color: tierInfo.color,
            }}>
              {tierInfo.name}
            </span>
            {orderDate && (
              <>
                <span style={{ color: S.dimmed, fontSize: 11 }}>·</span>
                <span style={{ fontSize: 12, color: S.dimmed }}>{orderDate}</span>
              </>
            )}
          </div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
          background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
          whiteSpace: 'nowrap', lineHeight: '18px',
        }}>
          {badge.label}
        </span>
      </div>

      {/* Score + actions row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isDelivered && (report.overall_score || report.overall_grade) && (
          <ScoreRing score={report.overall_score} grade={report.overall_grade} />
        )}

        <div style={{ flex: 1, display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {isDelivered ? (
            <a
              href={`/report/${report.id}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', fontSize: 14, fontWeight: 700,
                background: S.gold, color: '#000', borderRadius: 8,
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              View Report →
            </a>
          ) : (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', fontSize: 13, fontWeight: 500,
              background: '#1e2733', color: S.muted, borderRadius: 8,
            }}>
              ⏳ Your report is being prepared
            </span>
          )}

          {isInsight && isDelivered && (
            <a
              href={`/report/${report.id}?upgrade=true`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', fontSize: 13, fontWeight: 600,
                background: 'transparent', color: S.gold, borderRadius: 8,
                border: `1px solid ${S.gold}40`, textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              Upgrade to Intelligence
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN CLIENT — inner component with useSearchParams
// ============================================================
function MyReportsInner() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState('');

  // On mount: check token in URL or sessionStorage
  useEffect(() => {
    const token = searchParams?.get('token');
    if (token) {
      verifyToken(token);
    } else {
      try {
        const stored = sessionStorage.getItem('fcm_reports_email');
        if (stored) {
          setVerifiedEmail(stored);
          loadReports(stored);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    }
  }, [searchParams]);

  // Verify magic link JWT
  const verifyToken = async (token) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/my-reports/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok && data.email) {
        sessionStorage.setItem('fcm_reports_email', data.email);
        setVerifiedEmail(data.email);
        await loadReports(data.email);
        // Clean token from URL
        window.history.replaceState({}, '', '/my-reports');
      } else {
        setError(data.error || 'Invalid or expired link. Please request a new one.');
        setLoading(false);
      }
    } catch {
      setError('Verification failed. Please try again.');
      setLoading(false);
    }
  };

  // Load reports for verified email
  const loadReports = async (emailAddr) => {
    try {
      const res = await fetch(`/api/my-reports?email=${encodeURIComponent(emailAddr)}`);
      const data = await res.json();
      if (res.ok) {
        setReports(data.reports || []);
      } else {
        setError('Failed to load reports.');
      }
    } catch {
      setError('Failed to load reports.');
    }
    setLoading(false);
  };

  // Send magic link
  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await fetch('/api/my-reports/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      // Always show success — prevents email enumeration
      setLinkSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  // Sign out
  const handleSignOut = () => {
    sessionStorage.removeItem('fcm_reports_email');
    setVerifiedEmail(null);
    setReports(null);
    setLinkSent(false);
    setEmail('');
    setError('');
    window.history.replaceState({}, '', '/my-reports');
  };

  // ── LOADING STATE ──
  if (loading) {
    return (
      <div style={S.page}>
        <div style={{ ...S.container, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: S.muted, marginTop: 80 }}>Loading...</div>
          <AdminFooter />
        </div>
      </div>
    );
  }

  // ── ERROR STATE (from token verification) ──
  if (error && !verifiedEmail && !linkSent) {
    return (
      <div style={S.page}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: S.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
              FCM INTELLIGENCE
            </div>
            <h1 style={S.heading}>My Reports</h1>
          </div>
          <div style={{ ...S.card, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <p style={{ fontSize: 15, color: '#ef4444', marginBottom: 16 }}>{error}</p>
            <button
              onClick={() => { setError(''); setLinkSent(false); }}
              style={{ ...S.button, maxWidth: 280, margin: '0 auto' }}
            >
              Try again
            </button>
          </div>
          <AdminFooter />
        </div>
      </div>
    );
  }

  // ── LINK SENT STATE ──
  if (linkSent) {
    return (
      <div style={S.page}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: S.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
              FCM INTELLIGENCE
            </div>
            <h1 style={S.heading}>Check your email</h1>
          </div>
          <div style={{ ...S.card, textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Magic link sent</p>
            <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, lineHeight: 1.6 }}>
              If you have reports associated with <strong style={{ color: '#e6edf3' }}>{email}</strong>,
              you'll receive an email with a secure link to access them.<br />
              The link expires in 30 minutes.
            </p>
            <p style={{ fontSize: 13, color: S.dimmed }}>
              Didn't receive it?{' '}
              <button
                onClick={() => { setLinkSent(false); setEmail(''); }}
                style={{ background: 'none', border: 'none', color: S.gold, cursor: 'pointer', fontSize: 13, fontWeight: 600, textDecoration: 'underline' }}
              >
                Try again
              </button>
            </p>
          </div>
          <AdminFooter />
        </div>
      </div>
    );
  }

  // ── EMAIL ENTRY STATE ──
  if (!verifiedEmail) {
    return (
      <div style={S.page}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: S.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
              FCM INTELLIGENCE
            </div>
            <h1 style={S.heading}>My Reports</h1>
            <p style={S.subheading}>Access all your FCM Intelligence reports in one place.</p>
          </div>
          <div style={S.card}>
            <form onSubmit={handleSendLink}>
              <label style={{ fontSize: 13, fontWeight: 600, color: S.muted, display: 'block', marginBottom: 8 }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter the email you ordered with"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={S.input}
              />
              <button
                type="submit"
                disabled={submitting || !email.trim()}
                style={{
                  ...S.button,
                  ...(submitting || !email.trim() ? S.buttonDisabled : {}),
                }}
              >
                {submitting ? 'Sending...' : 'Send magic link'}
              </button>
            </form>
            <p style={{ fontSize: 12, color: S.dimmed, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
              We'll send a secure login link to your email. No password needed.
            </p>
          </div>
          <AdminFooter />
        </div>
      </div>
    );
  }

  // ── REPORTS LIST STATE ──
  const hasReports = reports && reports.length > 0;

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: S.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
              FCM INTELLIGENCE
            </div>
            <h1 style={{ ...S.heading, textAlign: 'left', fontSize: 28, marginBottom: 4 }}>My Reports</h1>
            <p style={{ fontSize: 13, color: S.dimmed, margin: 0 }}>{verifiedEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              background: 'none', border: `1px solid ${S.border}`, borderRadius: 6,
              color: S.muted, fontSize: 12, fontWeight: 500, padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>

        {/* Empty state */}
        {!hasReports && (
          <div style={{ ...S.card, textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No reports found</h2>
            <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, lineHeight: 1.6 }}>
              We couldn't find any reports for this email address.<br />
              Reports are linked to the email you used when ordering.
            </p>
            <Link
              href="/reports"
              style={{
                display: 'inline-block', padding: '12px 28px', fontSize: 14, fontWeight: 700,
                background: S.gold, color: '#000', borderRadius: 8, textDecoration: 'none',
              }}
            >
              Order your first report →
            </Link>
          </div>
        )}

        {/* Report cards */}
        {hasReports && (
          <div>
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        )}

        {/* Footer info */}
        {hasReports && (
          <p style={{ fontSize: 12, color: S.dimmed, textAlign: 'center', marginTop: 24 }}>
            {reports.length} report{reports.length !== 1 ? 's' : ''} · Need help?{' '}
            <a href="mailto:support@fcmreport.com" style={{ color: S.gold, textDecoration: 'none' }}>
              support@fcmreport.com
            </a>
          </p>
        )}

        <AdminFooter />
      </div>
    </div>
  );
}

// ============================================================
// EXPORT — wrapped in Suspense for useSearchParams
// ============================================================
export default function MyReportsClient() {
  return (
    <Suspense fallback={
      <div style={S.page}>
        <div style={{ ...S.container, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: S.muted, marginTop: 80 }}>Loading...</div>
        </div>
      </div>
    }>
      <MyReportsInner />
    </Suspense>
  );
}
