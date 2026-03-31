'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

interface ClarificationAnswer {
  question: string;
  answer: string;
  skipped: boolean;
}

interface OrderData {
  business_name: string;
  clarification_questions: string[] | null;
  clarification_responses: ClarificationAnswer[] | null;
  clarification_responded_at: string | null;
}

function ClarifyForm() {
  const params = useParams() || {};
  const searchParams = useSearchParams();
  const orderId = (params.orderId as string) || '';
  const token = searchParams?.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [answers, setAnswers] = useState<ClarificationAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Missing authentication token. Please use the link from your email.');
      setLoading(false);
      return;
    }
    fetchOrder();
  }, []);

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/clarify-data?orderId=${orderId}&token=${token}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to load questions');
        setLoading(false);
        return;
      }
      const data: OrderData = await res.json();
      setOrder(data);

      const questions = data.clarification_questions || [];
      if (data.clarification_responses && data.clarification_responded_at) {
        setAlreadySubmitted(true);
        setAnswers(data.clarification_responses);
      } else {
        setAnswers(
          questions.map((q) => ({ question: q, answer: '', skipped: false }))
        );
      }
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  function updateAnswer(index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], answer: value, skipped: false };
      return next;
    });
  }

  function toggleSkip(index: number) {
    setAnswers((prev) => {
      const next = [...prev];
      const wasSkipped = next[index].skipped;
      next[index] = {
        ...next[index],
        skipped: !wasSkipped,
        answer: !wasSkipped ? '' : next[index].answer,
      };
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/clarification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, token, answers }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to submit answers');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // --- Render states ---

  if (loading) {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={styles.spinner} />
          <p style={{ color: '#8b949e', marginTop: 16 }}>Loading your questions…</p>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: '#e6edf3', marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: '#8b949e', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
            {error}
          </p>
          <p style={{ color: '#484f58', fontSize: 13, marginTop: 24 }}>
            Need help? Email us at{' '}
            <a href="mailto:reports@fcmreport.com" style={{ color: '#C9A227' }}>
              reports@fcmreport.com
            </a>
          </p>
        </div>
      </PageShell>
    );
  }

  if (submitted) {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: '#e6edf3', marginBottom: 8 }}>Thanks!</h2>
          <p style={{ color: '#8b949e', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
            Your answers have been received. Your report will be delivered within 48 hours.
          </p>
        </div>
      </PageShell>
    );
  }

  const questions = order?.clarification_questions || [];

  if (questions.length === 0) {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ color: '#e6edf3', marginBottom: 8 }}>No questions needed</h2>
          <p style={{ color: '#8b949e', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
            Your report is being prepared — no additional information needed from you. You&apos;ll receive it within 48 hours.
          </p>
        </div>
      </PageShell>
    );
  }

  if (alreadySubmitted && !editing) {
    return (
      <PageShell>
        <div style={{ padding: '32px 24px' }}>
          <h2 style={styles.heading}>You&apos;ve already submitted your answers</h2>
          <p style={styles.subtext}>
            Here&apos;s what you told us. You can update your answers if needed.
          </p>
          <div style={styles.card}>
            {answers.map((a, i) => (
              <div key={i} style={styles.reviewItem}>
                <p style={styles.questionLabel}>{a.question}</p>
                <p style={styles.answerText}>
                  {a.skipped ? (
                    <span style={{ color: '#484f58', fontStyle: 'italic' }}>Skipped</span>
                  ) : (
                    a.answer
                  )}
                </p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button onClick={() => setEditing(true)} style={styles.secondaryBtn}>
              Update My Answers
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div style={{ padding: '32px 24px' }}>
        <h2 style={styles.heading}>Help us complete your report</h2>
        {order?.business_name && (
          <p style={styles.subtext}>
            Your report for{' '}
            <strong style={{ color: '#C9A227' }}>{order.business_name}</strong> is being
            prepared. To ensure maximum accuracy, please confirm any of the following. No worries
            if you can&apos;t — we&apos;ll work with verified public data.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {answers.map((a, i) => (
            <div key={i} style={styles.questionBlock}>
              <label style={styles.questionLabel}>{a.question}</label>
              <textarea
                value={a.answer}
                onChange={(e) => updateAnswer(i, e.target.value)}
                disabled={a.skipped}
                placeholder={a.skipped ? 'Skipped' : 'Type your answer…'}
                rows={2}
                style={{
                  ...styles.input,
                  opacity: a.skipped ? 0.4 : 1,
                  resize: 'vertical' as const,
                }}
              />
              <label style={styles.skipLabel}>
                <input
                  type="checkbox"
                  checked={a.skipped}
                  onChange={() => toggleSkip(i)}
                  style={styles.checkbox}
                />
                <span style={{ color: '#484f58', fontSize: 13 }}>Skip / I don&apos;t know</span>
              </label>
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.submitBtn,
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Answers'}
          </button>
        </form>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Gold top line */}
        <div style={styles.goldLine} />

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerText}>FCM Intelligence</span>
        </div>

        {/* Content */}
        <div style={styles.content}>{children}</div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Firstclass Managerial Ltd trading as FCM Intelligence
          </p>
          <p style={styles.footerLinks}>
            <a href="https://fcmreport.com" style={styles.footerLink}>
              fcmreport.com
            </a>
            {' · '}
            <a href="https://fcmreport.com/privacy" style={styles.footerLinkMuted}>
              Privacy
            </a>
            {' · '}
            <a href="https://fcmreport.com/terms" style={styles.footerLinkMuted}>
              Terms
            </a>
          </p>
        </div>

        {/* Gold bottom line */}
        <div style={styles.goldLine} />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0A1628',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '32px 16px',
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  goldLine: {
    height: 3,
    background: 'linear-gradient(90deg, #0A1628, #C9A227, #d4b84a, #C9A227, #0A1628)',
  },
  header: {
    backgroundColor: '#0B1D3A',
    padding: '24px 32px',
    textAlign: 'center' as const,
  },
  headerText: {
    fontSize: 11,
    fontWeight: 700,
    color: '#C9A227',
    textTransform: 'uppercase' as const,
    letterSpacing: 3,
  },
  content: {
    backgroundColor: '#161b22',
    minHeight: 200,
  },
  footer: {
    backgroundColor: '#0B1D3A',
    padding: '20px 32px',
    textAlign: 'center' as const,
    borderTop: '1px solid rgba(201,162,39,0.15)',
  },
  footerText: {
    fontSize: 11,
    color: '#484f58',
    margin: '0 0 4px',
  },
  footerLinks: {
    fontSize: 11,
    color: '#484f58',
    margin: 0,
  },
  footerLink: {
    color: '#C9A227',
    textDecoration: 'none',
  },
  footerLinkMuted: {
    color: '#484f58',
    textDecoration: 'none',
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: '#e6edf3',
    margin: '0 0 8px',
  },
  subtext: {
    fontSize: 14,
    color: '#8b949e',
    lineHeight: 1.6,
    margin: '0 0 28px',
  },
  questionBlock: {
    marginBottom: 24,
  },
  questionLabel: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#e6edf3',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    color: '#e6edf3',
    backgroundColor: 'rgba(11,29,58,0.5)',
    border: '1px solid rgba(201,162,39,0.2)',
    borderRadius: 8,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box' as const,
  },
  skipLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#C9A227',
  },
  submitBtn: {
    display: 'block',
    width: '100%',
    padding: '14px 24px',
    fontSize: 15,
    fontWeight: 700,
    color: '#0B1D3A',
    background: 'linear-gradient(135deg, #C9A227, #d4b84a)',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    marginTop: 8,
    fontFamily: "'Inter', sans-serif",
  },
  secondaryBtn: {
    padding: '12px 28px',
    fontSize: 14,
    fontWeight: 600,
    color: '#C9A227',
    background: 'transparent',
    border: '1px solid rgba(201,162,39,0.3)',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: 'rgba(11,29,58,0.4)',
    border: '1px solid rgba(201,162,39,0.15)',
    borderRadius: 8,
    padding: '16px 20px',
  },
  reviewItem: {
    paddingBottom: 12,
    marginBottom: 12,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  answerText: {
    fontSize: 14,
    color: '#e6edf3',
    margin: '4px 0 0',
    lineHeight: 1.5,
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid rgba(201,162,39,0.2)',
    borderTopColor: '#C9A227',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto',
  },
};

// Wrap in Suspense for useSearchParams
export default function ClarifyClient() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#8b949e' }}>Loading…</p>
          </div>
        </PageShell>
      }
    >
      <ClarifyForm />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Suspense>
  );
}
