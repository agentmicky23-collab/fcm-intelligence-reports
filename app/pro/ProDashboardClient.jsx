'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// ─── Brand ───
const B = {
  dark: '#0d1117',
  darker: '#010409',
  card: '#161b22',
  border: '#30363d',
  gold: '#c9a227',
  navy: '#0B1D3A',
  white: '#ffffff',
  text: '#e6edf3',
  muted: '#8b949e',
  green: '#22c55e',
  red: '#f87171',
  blue: '#60a5fa',
};

// ─── Tab definitions ───
const TABS = [
  { id: 'feed', label: 'Live Feed', icon: '⚡', desc: 'Real-time personalised matches' },
  { id: 'opportunities', label: 'Opportunities', icon: '🏪', desc: 'All listings with FCM Scores' },
  { id: 'compare', label: 'Compare', icon: '⚖️', desc: 'Side-by-side analysis' },
  { id: 'calculator', label: 'Calculator', icon: '🧮', desc: 'Offer guidance tool' },
  { id: 'market', label: 'Market Intel', icon: '📊', desc: 'Regional trends & data' },
  { id: 'templates', label: 'Templates', icon: '✉️', desc: 'Broker & seller emails' },
  { id: 'documents', label: 'Documents', icon: '📄', desc: 'Upload & AI insight' },
  { id: 'journey', label: 'Journey', icon: '🗺️', desc: 'Acquisition guide' },
  { id: 'profile', label: 'Profile', icon: '👤', desc: 'Preferences & account' },
];

export default function ProDashboardClient() {
  const searchParams = useSearchParams();
  const [state, setState] = useState('loading'); // 'loading' | 'gate' | 'dashboard' | 'upgrade'
  const [subscriber, setSubscriber] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [gateEmail, setGateEmail] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await fetch('/api/pro-auth');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setSubscriber(data.subscriber);
          setState('dashboard');
          return;
        }
      }
    } catch {}
    setState('gate');
  }

  async function handleGateSubmit(e) {
    e.preventDefault();
    setGateError('');
    setGateLoading(true);

    try {
      const res = await fetch('/api/pro-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gateEmail }),
      });

      const data = await res.json();

      if (res.ok && data.authenticated) {
        setSubscriber(data.subscriber);
        setState('dashboard');
      } else if (data.error === 'insider_not_pro') {
        setGateError('upgrade');
      } else {
        setGateError(data.message || 'No active Insider Pro subscription found.');
      }
    } catch {
      setGateError('Something went wrong. Please try again.');
    }
    setGateLoading(false);
  }

  async function handleUpgrade() {
    try {
      const res = await fetch('/api/pro-upgrade-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gateEmail }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setGateError('Failed to start upgrade. Please try again.');
    }
  }

  async function handleLogout() {
    await fetch('/api/pro-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setSubscriber(null);
    setState('gate');
  }

  // ─── Loading ───
  if (state === 'loading') {
    return (
      <div style={{ background: B.dark, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: B.gold, fontSize: 24, fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>FCM</div>
          <div style={{ color: B.muted, fontSize: 14 }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // ─── Gate ───
  if (state === 'gate') {
    return (
      <div style={{ background: B.dark, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 440, width: '100%' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ color: B.gold, fontSize: 28, fontWeight: 800, letterSpacing: 3 }}>FCM</span>
            <span style={{ color: B.white, fontSize: 28, fontWeight: 300, letterSpacing: 1 }}> INTELLIGENCE</span>
            <p style={{ color: B.muted, fontSize: 13, marginTop: 8, letterSpacing: 0.5 }}>INSIDER PRO</p>
          </div>

          {/* Gate card */}
          <div style={{
            background: B.card, border: `1px solid ${B.border}`, borderRadius: 12,
            padding: 'clamp(28px, 5vw, 40px)',
          }}>
            <h1 style={{ color: B.white, fontSize: 20, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
              Welcome to your command centre
            </h1>
            <p style={{ color: B.muted, fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 1.5 }}>
              Enter the email address linked to your Insider Pro subscription.
            </p>

            <form onSubmit={handleGateSubmit}>
              <input
                type="email"
                value={gateEmail}
                onChange={e => { setGateEmail(e.target.value); setGateError(''); }}
                placeholder="your@email.com"
                required
                style={{
                  width: '100%', padding: '12px 16px', background: B.dark,
                  border: `1px solid ${gateError && gateError !== 'upgrade' ? B.red : B.border}`,
                  borderRadius: 8, color: B.white, fontSize: 15, outline: 'none',
                  marginBottom: 16, boxSizing: 'border-box',
                }}
              />

              {/* Error states */}
              {gateError && gateError !== 'upgrade' && (
                <p style={{ color: B.red, fontSize: 13, marginBottom: 16, lineHeight: 1.4 }}>
                  {gateError}
                </p>
              )}

              {/* Upgrade offer for Insider subscribers */}
              {gateError === 'upgrade' && (
                <div style={{
                  background: `${B.gold}10`, border: `1px solid ${B.gold}30`,
                  borderRadius: 8, padding: 16, marginBottom: 16,
                }}>
                  <p style={{ color: B.gold, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    You're an Insider — upgrade to Pro?
                  </p>
                  <p style={{ color: B.text, fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
                    Your Insider subscription gives you our email concierge. Pro unlocks the full dashboard
                    with live matches, comparison tools, market intel, and more.
                  </p>
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    style={{
                      width: '100%', padding: '10px 20px', background: B.gold, color: B.dark,
                      border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Upgrade to Pro — £50/mo →
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={gateLoading}
                style={{
                  width: '100%', padding: '12px 20px',
                  background: gateError === 'upgrade' ? 'transparent' : B.gold,
                  color: gateError === 'upgrade' ? B.muted : B.dark,
                  border: gateError === 'upgrade' ? `1px solid ${B.border}` : 'none',
                  borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  opacity: gateLoading ? 0.5 : 1,
                }}
              >
                {gateLoading ? 'Checking...' : 'Access Dashboard'}
              </button>
            </form>

            <p style={{ color: B.muted, fontSize: 12, textAlign: 'center', marginTop: 20, lineHeight: 1.5 }}>
              Not a Pro subscriber yet?{' '}
              <a href="/insider" style={{ color: B.gold, textDecoration: 'underline' }}>Learn about Insider Pro</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Dashboard ───
  const firstName = (subscriber?.name || '').split(' ')[0] || 'Partner';

  return (
    <div style={{ background: B.darker, minHeight: '100vh', display: 'flex' }}>

      {/* ─── Sidebar ─── */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        background: B.dark,
        borderRight: `1px solid ${B.border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? '20px 20px 16px' : '20px 12px 16px',
          borderBottom: `1px solid ${B.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {sidebarOpen ? (
            <div>
              <span style={{ color: B.gold, fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>FCM</span>
              <span style={{ color: B.white, fontSize: 16, fontWeight: 300 }}> PRO</span>
            </div>
          ) : (
            <span style={{ color: B.gold, fontSize: 16, fontWeight: 800 }}>F</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: B.muted, cursor: 'pointer', fontSize: 16, padding: 4 }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav tabs */}
        <nav style={{ padding: '12px 8px', flex: 1 }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: sidebarOpen ? '10px 12px' : '10px 0',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  background: isActive ? `${B.gold}15` : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  color: isActive ? B.gold : B.muted,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  marginBottom: 2,
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                title={tab.label}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{tab.icon}</span>
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User info */}
        <div style={{
          padding: sidebarOpen ? '16px 20px' : '16px 8px',
          borderTop: `1px solid ${B.border}`,
        }}>
          {sidebarOpen ? (
            <>
              <p style={{ color: B.text, fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{subscriber?.name || 'Pro Subscriber'}</p>
              <p style={{ color: B.muted, fontSize: 11, marginBottom: 10 }}>{subscriber?.email}</p>
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', color: B.muted, fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: B.muted, fontSize: 14, cursor: 'pointer', padding: 0 }}
              title="Sign out"
            >
              ↩
            </button>
          )}
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <main style={{ flex: 1, padding: 'clamp(20px, 3vw, 32px)', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ color: B.white, fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, marginBottom: 4 }}>
            {getGreeting()}, {firstName}
          </h1>
          <p style={{ color: B.muted, fontSize: 14 }}>
            {TABS.find(t => t.id === activeTab)?.desc}
          </p>
        </div>

        {/* Tab content */}
        <div style={{
          background: B.dark,
          border: `1px solid ${B.border}`,
          borderRadius: 12,
          minHeight: 400,
        }}>
          {activeTab === 'feed' && <TabPlaceholder tab="Live Feed" icon="⚡" description="Your personalised matches will appear here in real-time as new listings are added. No more waiting until Monday." features={['Real-time match cards with FCM Scores', 'Personalised notes on each listing', 'Shortlist with one click', 'Thumbs up/down to sharpen future matches']} />}
          {activeTab === 'opportunities' && <TabPlaceholder tab="Opportunities" icon="🏪" description="The full listing database with FCM Scores, valuation traffic lights, and broker insights. Filter by region, type, budget, and valuation." features={['42+ active listings', 'FCM Score (0-100) with valuation assessment', 'Broker insights per listing', 'Filter and sort by any criteria', 'One-click shortlist and report order']} />}
          {activeTab === 'compare' && <TabPlaceholder tab="Compare" icon="⚖️" description="Select up to 5 shortlisted listings and compare them side-by-side. Automated best-value highlighting shows you where the numbers point." features={['Side-by-side on price, fees, profit, score', 'Automated best-value highlighting', 'Export comparison as PDF', 'Direct links to order reports']} />}
          {activeTab === 'calculator' && <TabPlaceholder tab="Offer Calculator" icon="🧮" description="Select a listing and receive a data-backed offer range with detailed reasoning. Powered by market data and 17+ years of operational experience." features={['Recommended offer: low / mid / high', 'Reasoning for each price point', 'Risk factors and value factors', 'Suggested opening position', '£100 per use']} isPaid="£100" />}
          {activeTab === 'market' && <TabPlaceholder tab="Market Intelligence" icon="📊" description="Regional market dashboard showing trends, pricing, and activity. Know what's happening in your target areas before the brokers tell you." features={['Average PO fees by region', 'Active listing counts and trends', 'Price movement indicators', 'New listing volume over time', 'Regional heatmaps']} />}
          {activeTab === 'templates' && <TabPlaceholder tab="Email Templates" icon="✉️" description="Ready-made emails for every stage of the process. Each template auto-populates with listing-specific details so you sound prepared, not generic." features={['Initial broker enquiry', 'Seller introduction', 'Information request', 'Viewing request', 'Offer letter']} />}
          {activeTab === 'documents' && <TabPlaceholder tab="Documents" icon="📄" description="Upload accounts, leases, valuations, or any business document. Our AI reads it and gives you a plain-English summary of what matters." features={['Upload any business document', 'AI-generated key figures and terms', 'Flags and concerns highlighted', 'Questions to ask the seller/solicitor', 'Lease Breakdown (detailed) — £150']} />}
          {activeTab === 'journey' && <TabPlaceholder tab="Acquisition Journey" icon="🗺️" description="Step-by-step guidance from first search to trading day. Each stage has the tools, templates, and services you need to move forward with confidence." features={['Research → Shortlist → Enquire → View', 'Due Diligence → Offer → Legal → Complete', 'Relevant tools at each step', 'Service CTAs (reports, calls, referrals)', 'Progress tracking']} />}
          {activeTab === 'profile' && <TabPlaceholder tab="Profile" icon="👤" description="Manage your preferences, view your match history, and control your subscription." features={['Update search preferences anytime', 'Match history with feedback log', 'Shortlisted listings', 'Notification settings', 'Subscription management']} />}
        </div>
      </main>
    </div>
  );
}

// ─── Placeholder component for unbuilt tabs ───
function TabPlaceholder({ tab, icon, description, features, isPaid }) {
  return (
    <div style={{ padding: 'clamp(28px, 4vw, 48px)' }}>
      <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
        <h2 style={{ color: B.white, fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{tab}</h2>
        <p style={{ color: B.text, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{description}</p>

        {isPaid && (
          <div style={{
            display: 'inline-block', background: `${B.gold}15`, border: `1px solid ${B.gold}30`,
            borderRadius: 8, padding: '6px 14px', marginBottom: 20,
          }}>
            <span style={{ color: B.gold, fontSize: 13, fontWeight: 600 }}>{isPaid} per use</span>
          </div>
        )}

        <div style={{ textAlign: 'left', maxWidth: 360, margin: '0 auto' }}>
          {features?.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '8px 0', borderBottom: i < features.length - 1 ? `1px solid ${B.border}` : 'none',
            }}>
              <span style={{ color: B.green, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ color: B.muted, fontSize: 13, lineHeight: 1.4 }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 32, padding: '16px 20px', background: B.card,
          border: `1px solid ${B.border}`, borderRadius: 8,
        }}>
          <p style={{ color: B.muted, fontSize: 13, lineHeight: 1.5 }}>
            <span style={{ color: B.gold, fontWeight: 600 }}>Coming soon.</span>{' '}
            This feature is being built. You'll be notified when it's live.
          </p>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
