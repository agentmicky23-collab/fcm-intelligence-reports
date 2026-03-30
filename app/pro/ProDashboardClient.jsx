'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

/* ───────────────────────────────────────────
   HELPER FUNCTIONS
   ─────────────────────────────────────────── */
function formatCurrency(amount) {
  if (!amount && amount !== 0) return '—';
  if (amount >= 1000000) return '£' + (amount / 1000000).toFixed(1) + 'm';
  if (amount >= 1000) return '£' + Math.round(amount).toLocaleString('en-GB');
  return '£' + amount;
}

function getScoreColor(score) {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#f59e0b';
  if (score >= 50) return '#ef4444';
  return '#6b7280';
}

/* ───────────────────────────────────────────
   TAB ICONS (inline SVG)
   ─────────────────────────────────────────── */
const Icons = {
  command: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  compare: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  calculator: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="12" y2="18.01"/>
    </svg>
  ),
  services: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  account: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  signout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  collapse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  chevronDown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  chevronUp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  external: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

/* ───────────────────────────────────────────
   TAB DEFINITIONS (5 tabs)
   ─────────────────────────────────────────── */
const TABS = [
  { id: 'command', label: 'Command Centre', icon: Icons.command },
  { id: 'compare', label: 'Compare', icon: Icons.compare },
  { id: 'calculator', label: 'Calculator', icon: Icons.calculator },
  { id: 'services', label: 'Services', icon: Icons.services },
  { id: 'account', label: 'My Account', icon: Icons.account },
];

/* ───────────────────────────────────────────
   REGION OPTIONS
   ─────────────────────────────────────────── */
const ALL_REGIONS = [
  'East Anglia', 'East Midlands', 'London', 'Midlands', 'North East',
  'North West', 'Scotland', 'Shropshire', 'South East', 'South West',
  'Wales', 'West Midlands', 'Yorkshire',
];

const ALL_BUSINESS_TYPES = [
  'Post Office', 'Convenience Store', 'Newsagent', 'Off-Licence', 'Retail',
];

/* ═══════════════════════════════════════════
   COMMAND CENTRE TAB
   ═══════════════════════════════════════════ */
function CommandCentreTab({ listings, marketData, subscriberPrefs, onCompareAdd, compareList }) {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [sortBy, setSortBy] = useState('match');
  const [showMarketIntel, setShowMarketIntel] = useState(false);

  const regions = useMemo(() => {
    const r = [...new Set(listings.map(l => l.region).filter(Boolean))].sort();
    return r;
  }, [listings]);

  const filtered = useMemo(() => {
    let results = listings.filter(l => {
      if (search) {
        const q = search.toLowerCase();
        if (!l.name?.toLowerCase().includes(q) && !l.location?.toLowerCase().includes(q) && !l.region?.toLowerCase().includes(q)) return false;
      }
      if (regionFilter && l.region !== regionFilter) return false;
      if (typeFilter) {
        const name = (l.name || '').toLowerCase();
        if (typeFilter === 'post_office' && !name.includes('post office') && !name.includes('po')) return false;
        if (typeFilter === 'convenience' && !name.includes('convenience') && !name.includes('store') && !name.includes('shop')) return false;
      }
      if (budgetMax && l.price > parseInt(budgetMax)) return false;
      return true;
    });
    results.sort((a, b) => {
      if (sortBy === 'match') {
        if (a.matchScore && !b.matchScore) return -1;
        if (!a.matchScore && b.matchScore) return 1;
        if (a.matchScore && b.matchScore) return b.matchScore - a.matchScore;
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === 'price_low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });
    return results;
  }, [listings, search, regionFilter, typeFilter, budgetMax, sortBy]);

  const matchedCount = listings.filter(l => l.matchScore).length;

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Listings', value: listings.length, color: '#D4AF37' },
          { label: 'Matched to You', value: matchedCount, color: '#22c55e' },
          { label: 'Regions Active', value: marketData.length, color: '#3b82f6' },
          { label: 'Showing', value: filtered.length, color: '#8b949e' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#0d1117', border: '1px solid #1e2733', borderRadius: '12px', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8b949e', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Regional Overview (collapsible) */}
      {marketData.length > 0 && (
        <div style={{ marginBottom: '24px', background: '#0d1117', border: '1px solid #1e2733', borderRadius: '12px', overflow: 'hidden' }}>
          <button
            onClick={() => setShowMarketIntel(!showMarketIntel)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#e6edf3',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: '600' }}>📊 Regional Overview</span>
              <span style={{ fontSize: '12px', color: '#8b949e' }}>({marketData.length} regions)</span>
            </div>
            {showMarketIntel ? Icons.chevronUp : Icons.chevronDown}
          </button>
          {showMarketIntel && (
            <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {marketData.map(r => (
                <div key={r.region} style={{ background: '#161b22', borderRadius: '8px', padding: '14px', border: '1px solid #1e2733' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#e6edf3', marginBottom: '8px' }}>{r.region}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>
                    <span>Listings</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#D4AF37', fontWeight: '600' }}>{r.listings}</span>
                  </div>
                  {r.avgPrice > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8b949e' }}>
                      <span>Avg Price</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{formatCurrency(r.avgPrice)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 160px 160px', gap: '12px', marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>{Icons.search}</span>
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 36px', background: '#0d1117', border: '1px solid #1e2733', borderRadius: '8px', color: '#e6edf3', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} style={{ padding: '10px 12px', background: '#0d1117', border: '1px solid #1e2733', borderRadius: '8px', color: '#e6edf3', fontSize: '13px' }}>
          <option value="">All Regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: '10px 12px', background: '#0d1117', border: '1px solid #1e2733', borderRadius: '8px', color: '#e6edf3', fontSize: '13px' }}>
          <option value="">All Types</option>
          <option value="post_office">Post Office</option>
          <option value="convenience">Convenience Store</option>
        </select>
        <select value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} style={{ padding: '10px 12px', background: '#0d1117', border: '1px solid #1e2733', borderRadius: '8px', color: '#e6edf3', fontSize: '13px' }}>
          <option value="">Any Budget</option>
          <option value="100000">Up to £100k</option>
          <option value="200000">Up to £200k</option>
          <option value="300000">Up to £300k</option>
          <option value="500000">Up to £500k</option>
          <option value="750000">Up to £750k</option>
          <option value="1000000">Up to £1m</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '10px 12px', background: '#0d1117', border: '1px solid #1e2733', borderRadius: '8px', color: '#e6edf3', fontSize: '13px' }}>
          <option value="match">Sort: Match Score</option>
          <option value="price_low">Sort: Price (Low)</option>
          <option value="price_high">Sort: Price (High)</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>

      <div style={{ fontSize: '13px', color: '#8b949e', marginBottom: '16px' }}>
        Showing {filtered.length} of {listings.length} listings
        {matchedCount > 0 && <span> · <span style={{ color: '#22c55e' }}>{matchedCount} matched to your preferences</span></span>}
      </div>

      {/* Listing cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {filtered.map(listing => (
          <div
            key={listing.id}
            style={{
              background: '#0d1117',
              border: listing.matchScore ? '1px solid #D4AF3740' : '1px solid #1e2733',
              borderRadius: '12px',
              padding: '20px',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#30363d'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = listing.matchScore ? '#D4AF3740' : '#1e2733'}
          >
            {/* Badges row */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {listing.matchScore && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                  background: 'linear-gradient(135deg, #D4AF3720, #D4AF3710)',
                  color: '#D4AF37', border: '1px solid #D4AF3740',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  Match: {listing.matchScore}%
                </span>
              )}
              {listing.pickBadge && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                  background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e30',
                }}>
                  {listing.pickBadge}
                </span>
              )}
            </div>

            {/* Business name & location */}
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#e6edf3', marginBottom: '4px', lineHeight: '1.3', margin: '0 0 4px 0' }}>
              {listing.name}
            </h3>
            <p style={{ fontSize: '13px', color: '#8b949e', margin: '0 0 4px 0' }}>
              {listing.location}
            </p>
            <span style={{ display: 'inline-block', fontSize: '11px', color: '#6b7280', background: '#161b22', padding: '2px 8px', borderRadius: '4px', marginBottom: '12px' }}>
              {listing.region}
            </span>

            {/* Key metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #1e2733' }}>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '2px' }}>Asking Price</div>
                <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>
                  {listing.priceLabel || formatCurrency(listing.price)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '2px' }}>Tenure</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#e6edf3', textTransform: 'capitalize' }}>
                  {listing.tenure || '—'}
                </div>
              </div>
              {listing.poSalary > 0 && (
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '2px' }}>PO Salary</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'JetBrains Mono, monospace', color: '#22c55e' }}>
                    {formatCurrency(listing.poSalary)}/yr
                  </div>
                </div>
              )}
              {listing.annualTurnover > 0 && (
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '2px' }}>Turnover</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>
                    {formatCurrency(listing.annualTurnover)}/yr
                  </div>
                </div>
              )}
            </div>

            {/* Pick reason */}
            {listing.pickReason && (
              <div style={{ marginBottom: '12px', padding: '10px 12px', background: '#161b22', borderRadius: '8px', borderLeft: '3px solid #D4AF37' }}>
                <p style={{ fontSize: '13px', color: '#8b949e', lineHeight: '1.5', margin: 0 }}>"{listing.pickReason}"</p>
              </div>
            )}

            {/* Match note */}
            {listing.matchNote && (
              <div style={{ marginBottom: '12px', padding: '8px 12px', background: '#22c55e08', borderRadius: '8px', border: '1px solid #22c55e20' }}>
                <p style={{ fontSize: '12px', color: '#22c55e', margin: 0 }}>💡 {listing.matchNote}</p>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* VIEW LISTING — #1 PRIORITY */}
              {listing.sourceUrl ? (
                <a
                  href={listing.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                    background: '#D4AF37', color: '#000', border: 'none', textDecoration: 'none',
                    cursor: 'pointer', transition: 'opacity 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                  View Listing → {Icons.external}
                </a>
              ) : (
                <span style={{
                  flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                  background: '#161b22', color: '#6b7280', border: '1px solid #1e2733',
                  opacity: 0.5, cursor: 'not-allowed',
                }}>
                  Contact FCM
                </span>
              )}
              {/* Compare button */}
              <button
                onClick={() => onCompareAdd && onCompareAdd(listing.id)}
                title={compareList?.includes(listing.id) ? 'Remove from compare' : 'Add to compare'}
                disabled={!compareList?.includes(listing.id) && compareList?.length >= 5}
                style={{
                  padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  background: compareList?.includes(listing.id) ? '#D4AF37' : 'transparent',
                  color: compareList?.includes(listing.id) ? '#000' : '#D4AF37',
                  border: '1px solid #D4AF37',
                  opacity: (!compareList?.includes(listing.id) && compareList?.length >= 5) ? 0.4 : 1,
                  transition: 'all 0.15s',
                }}
              >
                {compareList?.includes(listing.id) ? '✓ In Compare' : '+ Compare'}
              </button>
            </div>

            {/* Source & date */}
            {listing.sourcePlatform && (
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#6b7280' }}>
                Source: {listing.sourcePlatform}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#0d1117', borderRadius: '12px', border: '1px solid #1e2733' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p style={{ fontSize: '16px', color: '#8b949e', margin: 0 }}>No listings match your current filters. Try broadening your search.</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPARE TAB
   ═══════════════════════════════════════════ */
function CompareTab({ compareList, listings, setActiveTab, removeFromCompare, clearCompare }) {
  const selectedListings = listings.filter(l => compareList.includes(l.id));

  // Empty state — no listings selected
  if (selectedListings.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 40px', background: '#0d1117', borderRadius: '16px', border: '1px solid #1e2733' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚖️</div>
        <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#e6edf3', marginBottom: '12px' }}>No listings selected</h2>
        <p style={{ fontSize: '15px', color: '#8b949e', maxWidth: '400px', margin: '0 auto 24px', lineHeight: '1.6' }}>
          Head to the Command Centre and click &quot;Compare&quot; on up to 5 listings to compare them side by side.
        </p>
        <button
          onClick={() => setActiveTab('command')}
          style={{
            padding: '12px 24px', borderRadius: '8px', border: 'none',
            background: '#D4AF37', color: '#000', fontSize: '15px', fontWeight: '700',
            cursor: 'pointer', transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Go to Command Centre
        </button>
      </div>
    );
  }

  // One listing — prompt to add more
  if (selectedListings.length === 1) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 40px', background: '#0d1117', borderRadius: '16px', border: '1px solid #1e2733' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚖️</div>
        <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#e6edf3', marginBottom: '12px' }}>Add one more listing</h2>
        <p style={{ fontSize: '15px', color: '#8b949e', maxWidth: '440px', margin: '0 auto 24px', lineHeight: '1.6' }}>
          You&apos;ve selected <strong style={{ color: '#D4AF37' }}>{selectedListings[0].name}</strong>. Add at least one more from the Command Centre to start comparing.
        </p>
        <button
          onClick={() => setActiveTab('command')}
          style={{
            padding: '12px 24px', borderRadius: '8px', border: 'none',
            background: '#D4AF37', color: '#000', fontSize: '15px', fontWeight: '700',
            cursor: 'pointer', transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Back to Command Centre
        </button>
      </div>
    );
  }

  // 2+ listings — render editable comparison table
  return (
    <EditableComparisonTable
      listings={selectedListings}
      removeFromCompare={removeFromCompare}
      clearCompare={clearCompare}
    />
  );
}

/* ═══════════════════════════════════════════
   EDITABLE COMPARISON TABLE
   ═══════════════════════════════════════════ */
function EditableComparisonTable({ listings, removeFromCompare, clearCompare }) {
  const [overrides, setOverrides] = useState({});
  const [editingCells, setEditingCells] = useState({});
  const [editingCell, setEditingCell] = useState(null);

  const getFieldValue = (listing, key) => {
    const overrideKey = `${listing.id}-${key}`;
    if (overrides[overrideKey] !== undefined && overrides[overrideKey] !== '') return overrides[overrideKey];
    return listing[key];
  };

  const setFieldValue = (listingId, key, value) => {
    console.log('[Compare] Setting override:', { listingId, key, value });
    setOverrides(prev => {
      const newOverrides = { ...prev, [`${listingId}-${key}`]: value };
      console.log('[Compare] New overrides state:', newOverrides);
      return newOverrides;
    });
  };

  const parseCurrency = (val) => {
    if (!val) return null;
    if (typeof val === 'number') return val;
    const str = String(val).replace(/[£,\s]/g, '').replace(/\/yr/gi, '').replace(/\/week/gi, '');
    if (str.toLowerCase().endsWith('k')) return parseFloat(str) * 1000;
    if (str.toLowerCase().endsWith('m')) return parseFloat(str) * 1000000;
    const num = parseFloat(str);
    return isNaN(num) ? null : num;
  };

  const getValuationMultiple = (listing) => {
    const rawPrice = getFieldValue(listing, 'price');
    const price = parseCurrency(rawPrice);
    
    // Try both field names (API uses poSalary, but fallback to fees if needed)
    const rawFees = getFieldValue(listing, 'poSalary') || getFieldValue(listing, 'fees');
    const fees = parseCurrency(rawFees);
    
    console.log('[Compare] Valuation calc for listing', listing.id, ':', { rawPrice, price, rawFees, fees, result: price && fees ? (price/fees).toFixed(1) : '—' });
    
    if (!price || !fees || fees === 0) return '—';
    return (price / fees).toFixed(1) + 'x';
  };

  const rows = [
    { label: 'Asking Price', key: 'price', editable: true, format: (v) => typeof v === 'number' ? formatCurrency(v) : v },
    { label: 'PO Fees / Salary', key: 'poSalary', editable: true, format: (v) => typeof v === 'number' && v > 0 ? formatCurrency(v) + '/yr' : v },
    { label: 'Annual Turnover', key: 'annualTurnover', editable: true, format: (v) => typeof v === 'number' && v > 0 ? formatCurrency(v) + '/yr' : v },
    { label: 'Net Profit', key: 'netProfit', editable: true, format: (v) => typeof v === 'number' && v > 0 ? formatCurrency(v) + '/yr' : v },
    { label: 'Valuation Multiple', key: null, computed: true, getValue: (listing) => getValuationMultiple(listing), editable: false },
    { label: 'Region', key: 'region', editable: false },
    { label: 'Tenure', key: 'tenure', editable: false, format: (v) => v ? v.charAt(0).toUpperCase() + v.slice(1) : null },
    { label: 'Source', key: 'sourcePlatform', editable: false },
    { label: 'Match Score', key: 'matchScore', editable: false, format: (v) => v ? `${v}/100` : null, highlight: true },
    { label: 'FCM Insight', key: 'pickReason', editable: false },
  ];

  const isEmpty = (val) => !val || val === '—' || val === '' || val === 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#e6edf3', margin: '0 0 4px 0' }}>Comparing {listings.length} listings</h3>
          <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>Click any empty cell to fill in missing data. Valuation multiple auto-recalculates.</p>
        </div>
        <button
          onClick={clearCompare}
          style={{
            padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600',
            background: 'transparent', color: '#ef4444', border: '1px solid #ef444440',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#ef444415'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          Clear all
        </button>
      </div>

      {/* Comparison table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #1e2733' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#0d1117' }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left', padding: '14px 16px', borderBottom: '2px solid #D4AF37',
                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#D4AF37', minWidth: '150px', background: '#0a0e14',
              }}>Metric</th>
              {listings.map(l => (
                <th key={l.id} style={{
                  textAlign: 'center', padding: '14px 16px', borderBottom: '2px solid #D4AF37',
                  fontSize: '13px', color: '#e6edf3', fontWeight: '600', minWidth: '170px',
                  background: '#0a0e14',
                }}>
                  <div style={{ marginBottom: '4px' }}>{(l.name || '').length > 28 ? (l.name || '').substring(0, 28) + '…' : l.name}</div>
                  <button
                    onClick={() => removeFromCompare(l.id)}
                    style={{
                      background: 'none', border: 'none', color: '#6b7280',
                      cursor: 'pointer', fontSize: '11px', padding: '2px 6px',
                      borderRadius: '4px', transition: 'color 0.15s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
                  >
                    ✕ remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label} style={{ background: ri % 2 === 0 ? '#0d1117' : '#0a0e14' }}>
                <td style={{
                  padding: '12px 16px', borderBottom: '1px solid #1e2733',
                  fontSize: '13px', color: '#8b949e', fontWeight: '500',
                }}>
                  {row.label}
                  {row.computed && (
                    <span style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>auto-calculated</span>
                  )}
                </td>
                {listings.map(l => {
                  // Computed rows
                  if (row.computed) {
                    const computedVal = row.getValue(l);
                    return (
                      <td key={l.id} style={{
                        padding: '12px 16px', borderBottom: '1px solid #1e2733', textAlign: 'center',
                        fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700',
                        color: computedVal !== '—' ? '#D4AF37' : '#6b7280',
                      }}>
                        {computedVal}
                      </td>
                    );
                  }

                  const rawValue = getFieldValue(l, row.key);
                  const hasOverride = overrides[`${l.id}-${row.key}`] !== undefined;
                  const displayValue = row.format ? row.format(rawValue) : rawValue;
                  const cellEmpty = isEmpty(rawValue) && !hasOverride;
                  const cellKey = `${l.id}-${row.key}`;
                  const isEditing = editingCell === cellKey;

                  // Editable field that's empty or being edited
                  if (row.editable && (cellEmpty || isEditing)) {
                    return (
                      <td key={l.id} style={{ padding: '8px 12px', borderBottom: '1px solid #1e2733', textAlign: 'center' }}>
                        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%', maxWidth: '160px' }}>
                          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#D4AF3750', pointerEvents: 'none' }}>✏️</span>
                          <input
                            type="text"
                            value={hasOverride ? overrides[cellKey] : ''}
                            placeholder="Enter value"
                            autoFocus={isEditing}
                            onChange={(e) => setFieldValue(l.id, row.key, e.target.value)}
                            onFocus={() => setEditingCell(cellKey)}
                            onBlur={() => setEditingCell(null)}
                            style={{
                              width: '100%', padding: '8px 10px 8px 30px',
                              background: '#161b22',
                              border: '1px dashed #D4AF3760',
                              borderRadius: '6px', color: '#D4AF37',
                              fontSize: '13px', fontFamily: 'JetBrains Mono, monospace',
                              outline: 'none', textAlign: 'center',
                              transition: 'border-color 0.15s',
                            }}
                          />
                        </div>
                      </td>
                    );
                  }

                  // Editable field with value (clickable to edit)
                  if (row.editable && !cellEmpty) {
                    return (
                      <td
                        key={l.id}
                        onClick={() => {
                          setFieldValue(l.id, row.key, String(hasOverride ? overrides[cellKey] : (rawValue || '')));
                          setEditingCell(cellKey);
                        }}
                        style={{
                          padding: '12px 16px', borderBottom: '1px solid #1e2733', textAlign: 'center',
                          fontSize: '14px', fontFamily: 'JetBrains Mono, monospace',
                          color: hasOverride ? '#D4AF37' : '#e6edf3',
                          cursor: 'text', transition: 'background 0.15s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#161b22'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        title="Click to edit"
                      >
                        {hasOverride ? overrides[cellKey] : (displayValue || '—')}
                      </td>
                    );
                  }

                  // Read-only field
                  return (
                    <td key={l.id} style={{
                      padding: '12px 16px', borderBottom: '1px solid #1e2733', textAlign: 'center',
                      fontSize: row.key === 'pickReason' ? '12px' : '14px',
                      fontFamily: row.highlight ? 'JetBrains Mono, monospace' : 'inherit',
                      color: row.highlight && rawValue ? getScoreColor(rawValue) : '#e6edf3',
                      lineHeight: row.key === 'pickReason' ? '1.5' : 'inherit',
                    }}>
                      {displayValue || '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Listing Link row */}
            <tr style={{ background: rows.length % 2 === 0 ? '#0d1117' : '#0a0e14' }}>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #1e2733', fontSize: '13px', color: '#8b949e', fontWeight: '500' }}>Listing Link</td>
              {listings.map(l => (
                <td key={l.id} style={{ padding: '12px 16px', borderBottom: '1px solid #1e2733', textAlign: 'center' }}>
                  {l.sourceUrl ? (
                    <a href={l.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                      View Listing →
                    </a>
                  ) : (
                    <span style={{ color: '#6b7280', opacity: 0.5, fontSize: '13px' }}>Contact FCM</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Report CTA */}
      <div style={{
        marginTop: '24px', padding: '28px',
        background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
        border: '1px solid #D4AF3730', borderRadius: '12px', textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#e6edf3', marginBottom: '8px', margin: '0 0 8px 0' }}>Missing information?</h3>
        <p style={{ fontSize: '14px', color: '#8b949e', marginBottom: '20px', maxWidth: '520px', margin: '0 auto 20px', lineHeight: '1.6' }}>
          Fill in the gaps yourself by asking the vendor, or let us do the heavy lifting with a verified Intelligence Report covering all the due diligence data you need.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
          <a
            href="/reports"
            style={{
              padding: '12px 24px', borderRadius: '8px', textDecoration: 'none',
              background: '#D4AF37', color: '#000', fontSize: '14px', fontWeight: '700',
              transition: 'opacity 0.2s', display: 'inline-block',
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            Intelligence Report — £499
          </a>
          <a
            href="/reports"
            style={{
              padding: '12px 24px', borderRadius: '8px', textDecoration: 'none',
              background: 'transparent', color: '#D4AF37', fontSize: '14px', fontWeight: '600',
              border: '1px solid #D4AF37', transition: 'all 0.2s', display: 'inline-block',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#D4AF3715'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            Insight Report — £199
          </a>
        </div>
        <p style={{ fontSize: '11px', color: '#6b7280', margin: 0, lineHeight: '1.5', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
          This is guidance based on our experience of 17+ years operating retail businesses. It is not legal, financial, or professional advice. Always consult a qualified professional before making decisions.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MY ACCOUNT TAB
   ═══════════════════════════════════════════ */
function MyAccountTab({ subscriber, subscriberPrefs, onPrefsSaved }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [regions, setRegions] = useState(subscriberPrefs?.preferredRegions || []);
  const [maxBudget, setMaxBudget] = useState(subscriberPrefs?.maxBudget || '');
  const [minBudget, setMinBudget] = useState(subscriberPrefs?.minBudget || '');
  const [businessTypes, setBusinessTypes] = useState(subscriberPrefs?.businessTypes || []);
  const [tenurePref, setTenurePref] = useState(subscriberPrefs?.tenurePreference || 'any');
  const [experience, setExperience] = useState(subscriberPrefs?.experienceLevel || '');
  const [timeline, setTimeline] = useState(subscriberPrefs?.timeline || '');

  const toggleRegion = (r) => setRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  const toggleBizType = (t) => setBusinessTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const res = await fetch('/api/pro-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          preferred_regions: regions,
          max_budget: maxBudget ? parseInt(maxBudget) : null,
          min_budget: minBudget ? parseInt(minBudget) : null,
          business_types: businessTypes,
          tenure_preference: tenurePref,
          experience_level: experience,
          timeline: timeline,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        if (onPrefsSaved) onPrefsSaved();
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || 'Failed to save preferences');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    }
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#161b22', border: '1px solid #30363d',
    borderRadius: '8px', color: '#e6edf3', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#8b949e', marginBottom: '8px' };
  const sectionStyle = { marginBottom: '24px' };

  return (
    <div style={{ maxWidth: '700px' }}>
      {/* Profile info */}
      <div style={{ background: '#0d1117', border: '1px solid #1e2733', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#e6edf3', margin: '0 0 16px 0' }}>Profile</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '4px' }}>Name</div>
            <div style={{ fontSize: '15px', color: '#e6edf3' }}>{subscriber?.name || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '4px' }}>Email</div>
            <div style={{ fontSize: '15px', color: '#e6edf3' }}>{subscriber?.email || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '4px' }}>Tier</div>
            <div style={{ fontSize: '15px', color: '#D4AF37', fontWeight: '600', textTransform: 'uppercase' }}>{subscriber?.tier || 'Pro'}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '4px' }}>Status</div>
            <div style={{ fontSize: '15px', color: '#22c55e', fontWeight: '600', textTransform: 'capitalize' }}>{subscriber?.status || 'Active'}</div>
          </div>
        </div>
      </div>

      {/* Preferences form */}
      <div style={{ background: '#0d1117', border: '1px solid #1e2733', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#e6edf3', margin: '0 0 20px 0' }}>Search Preferences</h3>
        <p style={{ fontSize: '13px', color: '#8b949e', margin: '0 0 24px 0' }}>
          Update your preferences to improve listing matches. Changes take effect on your next digest.
        </p>

        {/* Preferred Regions */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Preferred Regions</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ALL_REGIONS.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => toggleRegion(r)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                  background: regions.includes(r) ? '#D4AF3720' : 'transparent',
                  border: regions.includes(r) ? '1px solid #D4AF37' : '1px solid #30363d',
                  color: regions.includes(r) ? '#D4AF37' : '#8b949e',
                  transition: 'all 0.15s',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div style={{ ...sectionStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Min Budget (£)</label>
            <input type="number" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} placeholder="e.g. 50000" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Max Budget (£)</label>
            <input type="number" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} placeholder="e.g. 500000" style={inputStyle} />
          </div>
        </div>

        {/* Business Types */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Business Types</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ALL_BUSINESS_TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => toggleBizType(t)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                  background: businessTypes.includes(t) ? '#3b82f620' : 'transparent',
                  border: businessTypes.includes(t) ? '1px solid #3b82f6' : '1px solid #30363d',
                  color: businessTypes.includes(t) ? '#3b82f6' : '#8b949e',
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tenure, Experience, Timeline */}
        <div style={{ ...sectionStyle, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Tenure Preference</label>
            <select value={tenurePref} onChange={(e) => setTenurePref(e.target.value)} style={inputStyle}>
              <option value="any">Any</option>
              <option value="freehold">Freehold</option>
              <option value="leasehold">Leasehold</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Experience Level</label>
            <select value={experience} onChange={(e) => setExperience(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              <option value="first_time">First-time buyer</option>
              <option value="experienced">Experienced operator</option>
              <option value="multi_site">Multi-site operator</option>
              <option value="investor">Investor</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Timeline</label>
            <select value={timeline} onChange={(e) => setTimeline(e.target.value)} style={inputStyle}>
              <option value="">Select...</option>
              <option value="immediate">Immediate (0-3 months)</option>
              <option value="short">Short (3-6 months)</option>
              <option value="medium">Medium (6-12 months)</option>
              <option value="exploring">Just exploring</option>
            </select>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '12px 32px', borderRadius: '8px', border: 'none',
              background: saving ? '#D4AF3780' : '#D4AF37', color: '#000',
              fontSize: '14px', fontWeight: '700', cursor: saving ? 'wait' : 'pointer',
            }}
          >
            {saving ? 'Saving…' : 'Save Preferences'}
          </button>
          {saved && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#22c55e' }}>
              {Icons.check} Preferences saved
            </span>
          )}
          {error && (
            <span style={{ fontSize: '13px', color: '#ef4444' }}>{error}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PLACEHOLDER TAB (Calculator / Services)
   ═══════════════════════════════════════════ */
function PlaceholderTab({ tabId }) {
  const placeholders = {
    calculator: {
      emoji: '🧮',
      title: 'Offer Calculator',
      desc: 'AI-powered offer guidance to help you determine the right price. Analyses comparable sales, valuation multiples, and market conditions to generate a recommended offer range.',
      cta: 'Coming Soon',
    },
    services: {
      emoji: '📋',
      title: 'Services Hub',
      desc: 'Email templates for broker outreach, document analysis for leases and accounts, and professional support tools — all in one place.',
      cta: 'Coming Soon',
    },
  };

  const ph = placeholders[tabId] || { emoji: '🔧', title: 'Coming Soon', desc: 'This feature is being built.', cta: 'Coming Soon' };

  return (
    <div style={{ textAlign: 'center', padding: '80px 40px', background: '#0d1117', borderRadius: '16px', border: '1px solid #1e2733' }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>{ph.emoji}</div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#e6edf3', marginBottom: '12px' }}>{ph.title}</h2>
      <p style={{ fontSize: '15px', color: '#8b949e', maxWidth: '500px', margin: '0 auto 24px', lineHeight: '1.6' }}>{ph.desc}</p>
      <div style={{
        display: 'inline-block', padding: '10px 24px', borderRadius: '8px',
        background: '#D4AF3715', border: '1px solid #D4AF3730', color: '#D4AF37',
        fontSize: '14px', fontWeight: '600',
      }}>
        {ph.cta}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════ */
export default function ProDashboardClient() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscriber, setSubscriber] = useState(null);
  const [activeTab, setActiveTab] = useState('command');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Listing data from API
  const [listings, setListings] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [subscriberPrefs, setSubscriberPrefs] = useState(null);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState('');

  // Compare state (shared between tabs)
  const [compareList, setCompareList] = useState([]);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/pro-auth', { credentials: 'include' });
        const data = await res.json();
        if (data.authenticated && data.subscriber) {
          setSubscriber(data.subscriber);
          setAuthed(true);
        }
      } catch (e) {
        // No session — show login
      }
    };
    checkSession();
  }, []);

  // Fetch listings once authenticated
  const fetchListings = useCallback(async () => {
    setListingsLoading(true);
    setListingsError('');
    try {
      const res = await fetch('/api/pro-listings', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setListings(data.listings || []);
      setMarketData(data.marketData || []);
      setSubscriberPrefs(data.subscriber || null);
    } catch (e) {
      setListingsError('Failed to load listings. Please refresh.');
    }
    setListingsLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchListings();
  }, [authed, fetchListings]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pro-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      const data = await res.json();

      if (data.authenticated) {
        setSubscriber(data.subscriber);
        setAuthed(true);
      } else if (data.isInsider) {
        setError('UPGRADE');
      } else {
        setError(data.message || 'No active Pro subscription found for this email.');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/pro-upgrade-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      setError('Could not start checkout. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/pro-auth', { method: 'DELETE', credentials: 'include' });
    } catch (e) {
      // Continue anyway
    }
    setAuthed(false);
    setSubscriber(null);
    setListings([]);
    setMarketData([]);
    setSubscriberPrefs(null);
    setEmail('');
    setError('');
  };

  const handleCompareAdd = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  /* ─── CAROUSEL STATE ─── */
  const [currentSlide, setCurrentSlide] = useState(0);
  const SLIDE_COUNT = 4;
  const SLIDE_INTERVAL = 5000;

  useEffect(() => {
    if (authed) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDE_COUNT);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [authed]);

  /* ─── LOGIN SCREEN ─── */
  if (!authed) {
    const slideCaptions = [
      '35 live listings with personalised match scores. Filter by region, budget, and type.',
      'Compare up to 5 listings side by side. Fill in missing data — valuations recalculate live.',
      'Market intelligence across 12 UK regions. Average prices, listing counts, and trends.',
      'Set your criteria once. We match every new listing automatically and alert you to the best opportunities.',
    ];

    return (
      <div style={{ minHeight: '100vh', background: '#010409', padding: '20px 20px 60px' }}>
        {/* Login section */}
        <div style={{ maxWidth: '440px', margin: '0 auto', paddingTop: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '8px' }}>FCM Intelligence</div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#e6edf3', marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>Insider Pro</h1>
            <p style={{ fontSize: '15px', color: '#8b949e' }}>Your acquisition command centre</p>
          </div>

          <div style={{ background: '#0d1117', border: '1px solid #1e2733', borderRadius: '16px', padding: '32px' }}>
            <form onSubmit={handleLogin}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#8b949e', marginBottom: '8px' }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: '100%', padding: '12px 16px', background: '#161b22', border: '1px solid #30363d',
                  borderRadius: '8px', color: '#e6edf3', fontSize: '15px', marginBottom: '16px', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              {error && error !== 'UPGRADE' && (
                <div style={{ padding: '12px', background: '#ef444415', border: '1px solid #ef444430', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#ef4444' }}>{error}</div>
              )}

              {error === 'UPGRADE' ? (
                <div>
                  <div style={{ padding: '16px', background: '#D4AF3710', border: '1px solid #D4AF3730', borderRadius: '8px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '14px', color: '#D4AF37', margin: '0 0 8px 0', fontWeight: '600' }}>You&apos;re an Insider — upgrade to Pro!</p>
                    <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>Get the full dashboard, live listings, compare tool, market intel, and more for £50/month.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                      background: '#D4AF37', color: '#000', fontSize: '15px', fontWeight: '700',
                      cursor: 'pointer', marginBottom: '8px',
                    }}
                  >
                    Upgrade to Pro — £50/month
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                    background: loading ? '#D4AF3780' : '#D4AF37', color: '#000', fontSize: '15px', fontWeight: '700',
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                >
                  {loading ? 'Checking…' : 'Access Dashboard'}
                </button>
              )}
            </form>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #1e2733', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                Not a Pro subscriber? <a href="/insider" style={{ color: '#D4AF37', textDecoration: 'none' }}>Learn more about Insider Pro →</a>
              </p>
            </div>
          </div>
        </div>

        {/* Feature Carousel */}
        <div style={{ maxWidth: '900px', margin: '48px auto 0', position: 'relative' }}>
          <div style={{ background: '#0d1117', border: '1px solid #1e2733', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
            {/* Slide container */}
            <div style={{ position: 'relative', minHeight: '340px' }}>
              {/* Slide 0: Command Centre */}
              <div style={{
                position: 'absolute', inset: 0, padding: '24px',
                opacity: currentSlide === 0 ? 1 : 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: currentSlide === 0 ? 'auto' : 'none',
              }}>
                {/* Fake filter bar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', opacity: 0.5 }}>
                  <div style={{ flex: 1, padding: '8px 12px', background: '#161b22', border: '1px solid #1e2733', borderRadius: '6px', fontSize: '12px', color: '#6b7280' }}>Search listings...</div>
                  <div style={{ padding: '8px 12px', background: '#161b22', border: '1px solid #1e2733', borderRadius: '6px', fontSize: '12px', color: '#6b7280', minWidth: '100px' }}>All Regions</div>
                  <div style={{ padding: '8px 12px', background: '#161b22', border: '1px solid #1e2733', borderRadius: '6px', fontSize: '12px', color: '#6b7280', minWidth: '100px' }}>Sort: Match</div>
                </div>
                {/* Listing cards grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {[
                    { name: 'Bilsborrow PO & Store', region: 'North West', price: '£240,000', score: 97, fees: '£80,000/yr' },
                    { name: 'Barnsley Licensed Conv.', region: 'Yorkshire', price: '£99,950', score: 95, fees: '£62,000/yr' },
                    { name: 'Fleetwood PO & Newsagent', region: 'North West', price: '£75,000', score: 93, fees: '£46,000/yr' },
                    { name: 'Kendal Village Store', region: 'North West', price: '£180,000', score: 92, fees: '£55,000/yr' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: '#161b22', border: '1px solid #D4AF3720', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '700', background: '#D4AF3715', color: '#D4AF37', border: '1px solid #D4AF3730', fontFamily: 'JetBrains Mono, monospace' }}>
                          Match: {item.score}%
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#e6edf3', marginBottom: '4px' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>{item.region}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <div>
                          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#6b7280', marginBottom: '2px' }}>Price</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3', fontWeight: '600' }}>{item.price}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#6b7280', marginBottom: '2px' }}>PO Fees</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#22c55e', fontWeight: '600' }}>{item.fees}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide 1: Compare Tool */}
              <div style={{
                position: 'absolute', inset: 0, padding: '24px',
                opacity: currentSlide === 1 ? 1 : 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: currentSlide === 1 ? 'auto' : 'none',
              }}>
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #1e2733' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#161b22', fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #D4AF37', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D4AF37', background: '#0d1117' }}>Metric</th>
                        <th style={{ textAlign: 'center', padding: '12px', borderBottom: '2px solid #D4AF37', color: '#e6edf3', fontWeight: '600', background: '#0d1117' }}>Bilsborrow PO</th>
                        <th style={{ textAlign: 'center', padding: '12px', borderBottom: '2px solid #D4AF37', color: '#e6edf3', fontWeight: '600', background: '#0d1117' }}>Barnsley Conv.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Asking Price', v1: '£240,000', v2: '£99,950' },
                        { label: 'PO Fees', v1: '£80,000/yr', v2: '£62,000/yr' },
                        { label: 'Turnover', v1: '£520,000/yr', v2: null },
                        { label: 'Valuation Multiple', v1: '3.0x', v2: '1.6x' },
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#161b22' : '#0d1117' }}>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #1e2733', color: '#8b949e', fontWeight: '500' }}>{row.label}</td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #1e2733', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{row.v1}</td>
                          <td style={{ padding: '10px 12px', borderBottom: '1px solid #1e2733', textAlign: 'center' }}>
                            {row.v2 ? (
                              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{row.v2}</span>
                            ) : (
                              <span style={{
                                display: 'inline-block', padding: '6px 12px', border: '1px dashed #D4AF3760',
                                borderRadius: '6px', background: '#161b22', color: '#D4AF3780',
                                fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
                              }}>
                                Enter value
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Slide 2: Regional Market Intel */}
              <div style={{
                position: 'absolute', inset: 0, padding: '24px',
                opacity: currentSlide === 2 ? 1 : 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: currentSlide === 2 ? 'auto' : 'none',
              }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#e6edf3', marginBottom: '16px' }}>📊 Regional Market Overview</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {[
                    { region: 'North West', listings: 6, avg: '£172k', trend: '↑', trendColor: '#22c55e' },
                    { region: 'Yorkshire', listings: 4, avg: '£170k', trend: '→', trendColor: '#f59e0b' },
                    { region: 'East Anglia', listings: 3, avg: '£130k', trend: '→', trendColor: '#f59e0b' },
                    { region: 'Scotland', listings: 2, avg: '£185k', trend: '↑', trendColor: '#22c55e' },
                    { region: 'South East', listings: 5, avg: '£210k', trend: '↑', trendColor: '#22c55e' },
                    { region: 'East Midlands', listings: 3, avg: '£145k', trend: '→', trendColor: '#f59e0b' },
                  ].map((r, i) => (
                    <div key={i} style={{ background: '#161b22', borderRadius: '10px', padding: '16px', border: '1px solid #1e2733' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#e6edf3' }}>{r.region}</span>
                        <span style={{ fontSize: '18px', color: r.trendColor }}>{r.trend}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <div>
                          <div style={{ color: '#6b7280', marginBottom: '2px' }}>Listings</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#D4AF37', fontWeight: '600' }}>{r.listings}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#6b7280', marginBottom: '2px' }}>Avg Price</div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3', fontWeight: '600' }}>{r.avg}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide 3: Personalised Preferences */}
              <div style={{
                position: 'absolute', inset: 0, padding: '24px',
                opacity: currentSlide === 3 ? 1 : 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: currentSlide === 3 ? 'auto' : 'none',
              }}>
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#e6edf3', marginBottom: '16px' }}>⚙️ Your Acquisition Preferences</div>
                  {/* Budget slider preview */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '6px' }}>Budget Range</div>
                    <div style={{ height: '6px', background: '#1e2733', borderRadius: '3px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '10%', right: '40%', height: '100%', background: 'linear-gradient(90deg, #D4AF37, #D4AF3780)', borderRadius: '3px' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                      <span>£50k</span><span>£300k</span><span>£500k</span>
                    </div>
                  </div>
                  {/* Region checkboxes */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '8px' }}>Preferred Regions</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {[
                        { name: 'North West', checked: true },
                        { name: 'Yorkshire', checked: true },
                        { name: 'East Midlands', checked: true },
                        { name: 'Scotland', checked: false },
                        { name: 'South East', checked: false },
                        { name: 'Wales', checked: false },
                      ].map((r, i) => (
                        <span key={i} style={{
                          padding: '5px 12px', borderRadius: '16px', fontSize: '11px',
                          background: r.checked ? '#D4AF3720' : 'transparent',
                          border: r.checked ? '1px solid #D4AF37' : '1px solid #30363d',
                          color: r.checked ? '#D4AF37' : '#6b7280',
                        }}>
                          {r.checked ? '✓ ' : ''}{r.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Business type toggles */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '8px' }}>Business Types</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        { name: 'Post Office', on: true },
                        { name: 'Convenience', on: true },
                        { name: 'Newsagent', on: false },
                      ].map((t, i) => (
                        <span key={i} style={{
                          padding: '5px 12px', borderRadius: '16px', fontSize: '11px',
                          background: t.on ? '#3b82f620' : 'transparent',
                          border: t.on ? '1px solid #3b82f6' : '1px solid #30363d',
                          color: t.on ? '#3b82f6' : '#6b7280',
                        }}>
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Match score preview */}
                  <div style={{
                    background: '#161b22', border: '1px solid #D4AF3730', borderRadius: '12px',
                    padding: '20px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8b949e', marginBottom: '6px' }}>Your Match Score</div>
                    <div style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: '#22c55e' }}>97<span style={{ fontSize: '18px', color: '#6b7280' }}>/100</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(180deg, transparent 70%, #0d1117 100%)',
              borderRadius: '16px',
            }}></div>
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            {[0, 1, 2, 3].map(i => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: currentSlide === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: currentSlide === i ? '#D4AF37' : '#30363d',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Caption */}
          <div style={{ textAlign: 'center', marginTop: '12px', minHeight: '40px' }}>
            <p style={{ fontSize: '14px', color: '#8b949e', margin: 0, lineHeight: '1.5', transition: 'opacity 0.3s' }}>
              {slideCaptions[currentSlide]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── DASHBOARD ─── */
  const firstName = subscriber?.name?.split(' ')[0] || subscriber?.email?.split('@')[0] || 'there';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#010409', color: '#e6edf3' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '64px' : '240px',
        background: '#0d1117',
        borderRight: '1px solid #1e2733',
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
        <div style={{ padding: sidebarCollapsed ? '16px 8px' : '20px 16px', borderBottom: '1px solid #1e2733', textAlign: 'center' }}>
          {sidebarCollapsed ? (
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#D4AF37' }}>F</div>
          ) : (
            <>
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37' }}>FCM Intelligence</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Insider Pro</div>
            </>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: sidebarCollapsed ? '10px' : '10px 12px',
                marginBottom: '2px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: activeTab === tab.id ? '#D4AF3715' : 'transparent',
                color: activeTab === tab.id ? '#D4AF37' : '#8b949e',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? '600' : '400',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              }}
              title={tab.label}
            >
              {tab.icon}
              {!sidebarCollapsed && <span>{tab.label}</span>}
              {/* Compare badge */}
              {tab.id === 'compare' && compareList.length > 0 && !sidebarCollapsed && (
                <span style={{
                  marginLeft: 'auto', background: '#D4AF37', color: '#000', fontSize: '10px',
                  fontWeight: '700', padding: '2px 6px', borderRadius: '10px', minWidth: '18px', textAlign: 'center',
                }}>
                  {compareList.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '8px', borderTop: '1px solid #1e2733' }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: sidebarCollapsed ? '10px' : '10px 12px',
              borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: 'transparent', color: '#6b7280', fontSize: '13px',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            }}
          >
            {Icons.collapse}
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: sidebarCollapsed ? '10px' : '10px 12px',
              borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: 'transparent', color: '#6b7280', fontSize: '13px',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            }}
          >
            {Icons.signout}
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '32px', maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#e6edf3', margin: '0 0 4px 0' }}>
            {getGreeting()}, <span style={{ color: '#D4AF37' }}>{firstName}</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            {TABS.find(t => t.id === activeTab)?.label} · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Loading state */}
        {listingsLoading && activeTab === 'command' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '16px', color: '#8b949e' }}>Loading listings...</div>
          </div>
        )}

        {/* Error state */}
        {listingsError && activeTab === 'command' && (
          <div style={{ padding: '16px', background: '#ef444415', border: '1px solid #ef444430', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', color: '#ef4444' }}>
            {listingsError}
            <button onClick={fetchListings} style={{ marginLeft: '12px', color: '#D4AF37', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Retry</button>
          </div>
        )}

        {/* Tab content */}
        {activeTab === 'command' && !listingsLoading && (
          <CommandCentreTab
            listings={listings}
            marketData={marketData}
            subscriberPrefs={subscriberPrefs}
            onCompareAdd={handleCompareAdd}
            compareList={compareList}
          />
        )}
        {activeTab === 'compare' && (
          <CompareTab
            compareList={compareList}
            listings={listings}
            setActiveTab={setActiveTab}
            removeFromCompare={(id) => setCompareList(prev => prev.filter(x => x !== id))}
            clearCompare={() => setCompareList([])}
          />
        )}
        {activeTab === 'account' && (
          <MyAccountTab
            subscriber={subscriber}
            subscriberPrefs={subscriberPrefs}
            onPrefsSaved={fetchListings}
          />
        )}
        {(activeTab === 'calculator' || activeTab === 'services') && (
          <PlaceholderTab tabId={activeTab} />
        )}
      </div>
    </div>
  );
}
