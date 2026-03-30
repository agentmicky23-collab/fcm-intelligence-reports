'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

/* ───────────────────────────────────────────
   LISTINGS DATA (ported from Business Republic)
   ─────────────────────────────────────────── */
const LISTINGS = [
  { id: 'OPP-2026-0306-001', name: 'Keith Convenience + PO + Freehold', location: 'Keith, Moray, Scotland', region: 'Scotland', price: 195000, fees: 90000, score: 92, type: 'post_office', valuation: 'fair_price', health: 'green', locationStrength: 'green', risk: 'green', insight: 'Scotland historically shows stronger Post Office retention and higher remuneration levels. Competition for quality branches is intense.', sessions: 0, tenure: 'freehold' },
  { id: 'OPP-2026-0306-002', name: 'Barnsley Mains Post Office + Retail', location: 'Barnsley, South Yorkshire', region: 'Yorkshire', price: 99900, fees: 61000, score: 88, type: 'post_office', valuation: 'fair_price', health: 'green', locationStrength: 'amber', risk: 'green', insight: '1,200 sessions per month indicates strong customer flow. Verify staffing requirements.', sessions: 1200, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-003', name: 'Fleetwood Main PO + Retail + Accommodation', location: 'Fleetwood, Lancashire', region: 'North West', price: 75000, fees: 70000, score: 85, type: 'post_office', valuation: 'fair_price', health: 'green', locationStrength: 'amber', risk: 'green', insight: 'Priced at just 1.1x annual fees — significantly below the typical 2-3x range. Motivated seller or hidden issues.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-004', name: 'Mains Post Office Wells-next-the-Sea', location: 'Wells-next-the-Sea, Norfolk', region: 'East Anglia', price: 95000, fees: 93600, score: 86, type: 'post_office', valuation: 'fair_price', health: 'green', locationStrength: 'amber', risk: 'green', insight: 'Priced at just 1.0x annual fees — significantly below the typical 2-3x range.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-005', name: 'Bilsborrow Village Store & PO', location: 'Bilsborrow, Preston, Lancashire', region: 'North West', price: 240000, fees: 80000, score: 94, type: 'convenience_store', valuation: 'fair_price', health: 'green', locationStrength: 'amber', risk: 'green', insight: 'Village setting with strong community ties. Verify lease terms and PO contract duration.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-006', name: 'Lanark Mains PO + Development Site', location: 'Lanark, South Lanarkshire', region: 'Scotland', price: 175000, fees: 64300, score: 87, type: 'post_office', valuation: 'fair_price', health: 'green', locationStrength: 'green', risk: 'green', insight: 'Scotland shows stronger PO retention. Factor in Scottish business rates relief.', sessions: 0, tenure: 'freehold' },
  { id: 'OPP-2026-0306-007', name: 'Sale General Store & Post Office', location: 'Sale M33, Greater Manchester', region: 'North West', price: 164950, fees: 44000, score: 83, type: 'convenience_store', valuation: 'fair_price', health: 'amber', locationStrength: 'amber', risk: 'amber', insight: 'Asking price is 3.7x annual fees — above the typical 2-3x range. Verify justification.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-008', name: 'North Warwickshire PO + Convenience + Off-Licence', location: 'North Warwickshire, Midlands', region: 'Midlands', price: 400000, fees: 0, score: 85, type: 'convenience_store', valuation: 'fair_price', health: 'red', locationStrength: 'amber', risk: 'amber', insight: 'No PO fees disclosed — verify revenue breakdown before proceeding.', sessions: 0, tenure: 'freehold' },
  { id: 'OPP-2026-0306-009', name: 'Leicester Convenience + PO + Freehold', location: 'Leicester, East Midlands', region: 'East Midlands', price: 399500, fees: 0, score: 87, type: 'convenience_store', valuation: 'fair_price', health: 'red', locationStrength: 'amber', risk: 'green', insight: '1,400 sessions per month indicates strong customer flow.', sessions: 1400, tenure: 'freehold' },
  { id: 'OPP-2026-0306-010', name: 'Barnsley Licensed Convenience + PO', location: 'Barnsley, South Yorkshire', region: 'Yorkshire', price: 370000, fees: 0, score: 79, type: 'convenience_store', valuation: 'fair_price', health: 'red', locationStrength: 'amber', risk: 'red', insight: 'No PO fees disclosed. Higher risk profile — investigate fully.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-011', name: 'Plymouth Post Office + Convenience', location: 'Plymouth, Devon', region: 'South West', price: 290000, fees: 0, score: 84, type: 'post_office', valuation: 'fair_price', health: 'red', locationStrength: 'amber', risk: 'amber', insight: 'Major city location with no fees disclosed. Verify PO contract terms.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-012', name: 'Prees Mains Post Office + Retail', location: 'Prees, Shropshire', region: 'Shropshire', price: 150000, fees: 55000, score: 72, type: 'post_office', valuation: 'fair_price', health: 'green', locationStrength: 'amber', risk: 'amber', insight: 'Rural location. Verify footfall and local competition.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-013', name: 'Shiregreen Subway + Convenience + PO', location: 'Shiregreen, Sheffield', region: 'Yorkshire', price: 140000, fees: 0, score: 65, type: 'convenience_store', valuation: 'fair_price', health: 'red', locationStrength: 'amber', risk: 'red', insight: 'Multi-franchise model. Verify franchise obligations and costs.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-014', name: 'Kendal Mains Post Office + Licensed Store', location: 'Kendal, Lake District, Cumbria', region: 'North West', price: 180000, fees: 120000, score: 81, type: 'post_office', valuation: 'fair_price', health: 'green', locationStrength: 'amber', risk: 'green', insight: 'Lake District location — tourist traffic potential. Strong fee base.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-015', name: 'Felling Local Plus + Convenience + 4-bed', location: 'Felling, Tyne & Wear', region: 'North East', price: 165000, fees: 0, score: 78, type: 'convenience_store', valuation: 'fair_price', health: 'red', locationStrength: 'amber', risk: 'red', insight: 'Includes 4-bed accommodation — factor into valuation separately.', sessions: 0, tenure: 'freehold' },
  { id: 'OPP-2026-0306-016', name: 'Wolverhampton Convenience + Post Office', location: 'Wolverhampton, West Midlands', region: 'West Midlands', price: 85000, fees: 0, score: 82, type: 'convenience_store', valuation: 'fair_price', health: 'red', locationStrength: 'amber', risk: 'amber', insight: 'Low asking price. Verify lease terms and any transfer restrictions.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0326-005', name: 'Chelmsford Grade II Listed Post Office + 3-Bed Freehold', location: 'Chelmsford CM1, Essex', region: 'South East', price: 720000, fees: 0, score: 95, type: 'post_office', valuation: 'fair_price', health: 'red', locationStrength: 'green', risk: 'amber', insight: 'Grade II listed freehold with 3-bed accommodation. Premium asset.', sessions: 0, tenure: 'freehold' },
  { id: 'OPP-2026-0306-024', name: 'Peterborough Mains Post Office', location: 'Central Avenue, Peterborough', region: 'East Anglia', price: 175000, fees: 53500, score: 88, type: 'post_office', valuation: 'fair_price', health: 'green', locationStrength: 'amber', risk: 'green', insight: 'Asking price is 3.3x annual fees — above the typical 2-3x range.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-025', name: 'Wivenhoe Town Store & Post Office', location: 'Wivenhoe, Colchester, Essex', region: 'East Anglia', price: 120000, fees: 45000, score: 80, type: 'convenience_store', valuation: 'fair_price', health: 'green', locationStrength: 'amber', risk: 'green', insight: 'University town location. Strong community footfall.', sessions: 0, tenure: 'leasehold' },
  { id: 'OPP-2026-0306-028', name: 'Greenford Post Office + Off-Licence', location: 'Greenford UB6, London', region: 'London', price: 180000, fees: 0, score: 82, type: 'post_office', valuation: 'fair_price', health: 'red', locationStrength: 'green', risk: 'amber', insight: 'London branches face higher operating costs. Verify footfall justifies premium.', sessions: 0, tenure: 'leasehold' },
];

/* ───────────────────────────────────────────
   MARKET DATA (ported from Business Republic)
   ─────────────────────────────────────────── */
const MARKET_DATA = [
  { region: 'Scotland', avgPrice: 185000, avgFees: 77150, listings: 2, trend: 'up', avgScore: 89.5 },
  { region: 'Yorkshire', avgPrice: 169975, avgFees: 20333, listings: 4, trend: 'stable', avgScore: 77.8 },
  { region: 'North West', avgPrice: 171990, avgFees: 62800, listings: 6, trend: 'up', avgScore: 85.2 },
  { region: 'East Anglia', avgPrice: 130000, avgFees: 64033, listings: 3, trend: 'stable', avgScore: 84.7 },
  { region: 'Midlands', avgPrice: 400000, avgFees: 0, listings: 1, trend: 'stable', avgScore: 85.0 },
  { region: 'East Midlands', avgPrice: 399500, avgFees: 0, listings: 1, trend: 'up', avgScore: 87.0 },
  { region: 'South West', avgPrice: 290000, avgFees: 0, listings: 1, trend: 'down', avgScore: 84.0 },
  { region: 'South East', avgPrice: 720000, avgFees: 0, listings: 1, trend: 'up', avgScore: 95.0 },
  { region: 'London', avgPrice: 180000, avgFees: 0, listings: 1, trend: 'stable', avgScore: 82.0 },
  { region: 'North East', avgPrice: 165000, avgFees: 0, listings: 1, trend: 'down', avgScore: 78.0 },
  { region: 'West Midlands', avgPrice: 85000, avgFees: 0, listings: 1, trend: 'stable', avgScore: 82.0 },
  { region: 'Shropshire', avgPrice: 150000, avgFees: 55000, listings: 1, trend: 'stable', avgScore: 72.0 },
];

/* ───────────────────────────────────────────
   HELPER FUNCTIONS
   ─────────────────────────────────────────── */
function formatCurrency(amount) {
  if (!amount) return '—';
  return '£' + amount.toLocaleString('en-GB');
}

function getScoreColor(score) {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#f59e0b';
  if (score >= 50) return '#ef4444';
  return '#6b7280';
}

function getHealthDot(level) {
  const colors = { green: '#22c55e', amber: '#f59e0b', red: '#ef4444' };
  return colors[level] || '#6b7280';
}

function getValuationMultiple(price, fees) {
  if (!fees || !price) return null;
  return (price / fees).toFixed(1);
}

function getTrendIcon(trend) {
  if (trend === 'up') return '↑';
  if (trend === 'down') return '↓';
  return '→';
}

function getTrendColor(trend) {
  if (trend === 'up') return '#22c55e';
  if (trend === 'down') return '#ef4444';
  return '#f59e0b';
}

/* ───────────────────────────────────────────
   TAB ICONS (inline SVG components)
   ─────────────────────────────────────────── */
const Icons = {
  feed: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="20" r="1"/>
    </svg>
  ),
  opportunities: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
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
  market: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  templates: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  documents: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  journey: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  profile: (
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
  star: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

/* ───────────────────────────────────────────
   TAB DEFINITIONS
   ─────────────────────────────────────────── */
const TABS = [
  { id: 'feed', label: 'Live Feed', icon: Icons.feed },
  { id: 'opportunities', label: 'Opportunities', icon: Icons.opportunities },
  { id: 'compare', label: 'Compare', icon: Icons.compare },
  { id: 'calculator', label: 'Calculator', icon: Icons.calculator },
  { id: 'market', label: 'Market Intel', icon: Icons.market },
  { id: 'templates', label: 'Templates', icon: Icons.templates },
  { id: 'documents', label: 'Documents', icon: Icons.documents },
  { id: 'journey', label: 'Journey', icon: Icons.journey },
  { id: 'profile', label: 'Profile', icon: Icons.profile },
];

/* ═══════════════════════════════════════════
   OPPORTUNITIES TAB
   ═══════════════════════════════════════════ */
function OpportunitiesTab() {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [shortlist, setShortlist] = useState([]);

  const regions = useMemo(() => [...new Set(LISTINGS.map(l => l.region))].sort(), []);

  const filtered = useMemo(() => {
    let results = LISTINGS.filter(l => {
      if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.location.toLowerCase().includes(search.toLowerCase())) return false;
      if (regionFilter && l.region !== regionFilter) return false;
      if (typeFilter && l.type !== typeFilter) return false;
      return true;
    });
    results.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'fees') return b.fees - a.fees;
      return 0;
    });
    return results;
  }, [search, regionFilter, typeFilter, sortBy]);

  const toggleShortlist = (id) => {
    setShortlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Listings', value: LISTINGS.length, color: '#D4AF37' },
          { label: 'Avg FCM Score', value: Math.round(LISTINGS.reduce((s, l) => s + l.score, 0) / LISTINGS.length), color: '#22c55e' },
          { label: 'Score 85+', value: LISTINGS.filter(l => l.score >= 85).length, color: '#22c55e' },
          { label: 'Shortlisted', value: shortlist.length, color: '#3b82f6' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#0d1117', border: '1px solid #1e2733', borderRadius: '12px', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8b949e', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 180px 180px', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>{Icons.search}</span>
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 36px', background: '#0d1117', border: '1px solid #1e2733', borderRadius: '8px', color: '#e6edf3', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} style={{ padding: '10px 12px', background: '#0d1117', border: '1px solid #1e2733', borderRadius: '8px', color: '#e6edf3', fontSize: '14px' }}>
          <option value="">All Regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: '10px 12px', background: '#0d1117', border: '1px solid #1e2733', borderRadius: '8px', color: '#e6edf3', fontSize: '14px' }}>
          <option value="">All Types</option>
          <option value="post_office">Post Office</option>
          <option value="convenience_store">Convenience Store</option>
          <option value="retail">Retail</option>
          <option value="investment">Investment</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '10px 12px', background: '#0d1117', border: '1px solid #1e2733', borderRadius: '8px', color: '#e6edf3', fontSize: '14px' }}>
          <option value="score">Sort: FCM Score</option>
          <option value="price_low">Sort: Price (Low)</option>
          <option value="price_high">Sort: Price (High)</option>
          <option value="fees">Sort: Highest Fees</option>
        </select>
      </div>

      <div style={{ fontSize: '13px', color: '#8b949e', marginBottom: '16px' }}>
        Showing {filtered.length} of {LISTINGS.length} opportunities
      </div>

      {/* Listing cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {filtered.map(listing => (
          <div
            key={listing.id}
            style={{
              background: '#0d1117',
              border: shortlist.includes(listing.id) ? '1px solid #D4AF37' : '1px solid #1e2733',
              borderRadius: '12px',
              padding: '20px',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => { if (!shortlist.includes(listing.id)) e.currentTarget.style.borderColor = '#30363d'; }}
            onMouseOut={(e) => { if (!shortlist.includes(listing.id)) e.currentTarget.style.borderColor = '#1e2733'; }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ flex: 1, paddingRight: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#e6edf3', marginBottom: '4px', lineHeight: '1.3' }}>{listing.name}</h3>
                <p style={{ fontSize: '13px', color: '#8b949e' }}>{listing.location}</p>
                <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '11px', color: '#6b7280', background: '#161b22', padding: '2px 8px', borderRadius: '4px' }}>{listing.region}</span>
              </div>
              <div style={{ textAlign: 'center', minWidth: '60px' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: getScoreColor(listing.score) }}>{listing.score}</div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280' }}>FCM Score</div>
              </div>
            </div>

            {/* Valuation badge */}
            {listing.fees > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                  background: getValuationMultiple(listing.price, listing.fees) <= 2 ? 'rgba(34,197,94,0.15)' : getValuationMultiple(listing.price, listing.fees) <= 3 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                  color: getValuationMultiple(listing.price, listing.fees) <= 2 ? '#22c55e' : getValuationMultiple(listing.price, listing.fees) <= 3 ? '#f59e0b' : '#ef4444',
                  border: `1px solid ${getValuationMultiple(listing.price, listing.fees) <= 2 ? '#22c55e40' : getValuationMultiple(listing.price, listing.fees) <= 3 ? '#f59e0b40' : '#ef444440'}`,
                }}>
                  {getValuationMultiple(listing.price, listing.fees)}x fees
                  {getValuationMultiple(listing.price, listing.fees) <= 2 ? ' — GOOD VALUE' : getValuationMultiple(listing.price, listing.fees) <= 3 ? ' — FAIR PRICE' : ' — PREMIUM'}
                </span>
              </div>
            )}

            {/* Price & Fees */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #1e2733' }}>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '2px' }}>Asking Price</div>
                <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{formatCurrency(listing.price)}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '2px' }}>Annual Fees</div>
                <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{formatCurrency(listing.fees)}</div>
              </div>
            </div>

            {/* Health dots */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              {[
                { label: 'Revenue', value: listing.health },
                { label: 'Location', value: listing.locationStrength },
                { label: 'Risk', value: listing.risk },
              ].map((dot, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getHealthDot(dot.value), boxShadow: `0 0 6px ${getHealthDot(dot.value)}40` }} />
                  <span style={{ fontSize: '11px', color: '#8b949e' }}>{dot.label}</span>
                </div>
              ))}
            </div>

            {/* Insight */}
            {listing.insight && (
              <div style={{ marginBottom: '12px', padding: '10px 12px', background: '#161b22', borderRadius: '8px', borderLeft: '3px solid #D4AF37' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D4AF37', marginBottom: '4px' }}>Broker Insight</div>
                <p style={{ fontSize: '13px', color: '#8b949e', lineHeight: '1.5', margin: 0 }}>{listing.insight}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => toggleShortlist(listing.id)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                  background: shortlist.includes(listing.id) ? '#D4AF37' : 'transparent',
                  color: shortlist.includes(listing.id) ? '#000' : '#D4AF37',
                  border: '1px solid #D4AF37',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                {shortlist.includes(listing.id) ? Icons.check : Icons.star}
                {shortlist.includes(listing.id) ? 'Shortlisted' : 'Shortlist'}
              </button>
              <button
                style={{
                  flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                  background: '#161b22', color: '#e6edf3', border: '1px solid #30363d',
                }}
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIVE FEED TAB
   ═══════════════════════════════════════════ */
function LiveFeedTab({ subscriberName }) {
  // Simulated match data from matching engine
  const matches = useMemo(() => {
    return LISTINGS
      .filter(l => l.score >= 75)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((l, i) => ({
        ...l,
        matchScore: Math.min(100, l.score + Math.floor(Math.random() * 10) - 3),
        matchDate: new Date(Date.now() - i * 86400000 * Math.random() * 5).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        matchNote: l.score >= 90 ? 'Strong match — aligns with your budget and region preferences' : l.score >= 80 ? 'Good match — worth investigating further' : 'Moderate match — some criteria met',
        isNew: i < 3,
      }));
  }, []);

  const stats = {
    totalMatches: matches.length,
    highMatches: matches.filter(m => m.matchScore >= 85).length,
    newThisWeek: matches.filter(m => m.isNew).length,
    avgScore: Math.round(matches.reduce((s, m) => s + m.matchScore, 0) / matches.length),
  };

  return (
    <div>
      {/* Welcome card */}
      <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)', border: '1px solid #D4AF3730', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#e6edf3', marginBottom: '8px' }}>
          Your Personalised Matches
        </h2>
        <p style={{ fontSize: '14px', color: '#8b949e', lineHeight: '1.6', margin: 0 }}>
          We've analysed {LISTINGS.length} opportunities against your preferences and found <strong style={{ color: '#D4AF37' }}>{stats.highMatches} high-scoring matches</strong> this week. 
          {stats.newThisWeek > 0 && <> There are <strong style={{ color: '#22c55e' }}>{stats.newThisWeek} new picks</strong> since your last visit.</>}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Matches', value: stats.totalMatches, color: '#D4AF37' },
          { label: 'Score 85+', value: stats.highMatches, color: '#22c55e' },
          { label: 'New This Week', value: stats.newThisWeek, color: '#3b82f6' },
          { label: 'Avg Match Score', value: stats.avgScore, color: '#f59e0b' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#0d1117', border: '1px solid #1e2733', borderRadius: '12px', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8b949e', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Match cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {matches.map((match, i) => (
          <div
            key={match.id}
            style={{
              background: '#0d1117',
              border: match.isNew ? '1px solid #D4AF3740' : '1px solid #1e2733',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#30363d'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = match.isNew ? '#D4AF3740' : '#1e2733'}
          >
            {/* Score circle */}
            <div style={{ position: 'relative', minWidth: '64px', height: '64px' }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#1e2733" strokeWidth="4" />
                <circle
                  cx="32" cy="32" r="28" fill="none"
                  stroke={getScoreColor(match.matchScore)}
                  strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${(match.matchScore / 100) * 175.9} 175.9`}
                  transform="rotate(-90 32 32)"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: getScoreColor(match.matchScore) }}>{match.matchScore}</span>
              </div>
            </div>

            {/* Details */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#e6edf3', margin: 0 }}>{match.name}</h3>
                {match.isNew && (
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', background: '#22c55e20', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New</span>
                )}
              </div>
              <p style={{ fontSize: '13px', color: '#8b949e', margin: '0 0 6px 0' }}>{match.location} · {match.region}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, fontStyle: 'italic' }}>{match.matchNote}</p>
            </div>

            {/* Price & date */}
            <div style={{ textAlign: 'right', minWidth: '120px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3', marginBottom: '4px' }}>{formatCurrency(match.price)}</div>
              {match.fees > 0 && <div style={{ fontSize: '12px', color: '#8b949e' }}>Fees: {formatCurrency(match.fees)}/yr</div>}
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px' }}>Matched {match.matchDate}</div>
            </div>

            {/* Feedback buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '36px' }}>
              <button style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#161b22', border: '1px solid #1e2733', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }} title="Interested">👍</button>
              <button style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#161b22', border: '1px solid #1e2733', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }} title="Not for me">👎</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPARE TAB
   ═══════════════════════════════════════════ */
function CompareTab() {
  const [selected, setSelected] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [editingCells, setEditingCells] = useState({});
  const maxCompare = 5;

  const toggle = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= maxCompare) return prev;
      return [...prev, id];
    });
  };

  // --- Currency parser: handles "£80k/yr", "80000", "80k", "£80,000", "80" ---
  const parseCurrency = (val) => {
    if (!val) return null;
    if (typeof val === 'number') return val;
    const str = String(val).replace(/[£,\s]/g, '').replace(/\/yr/gi, '').replace(/\/week/gi, '');
    if (str.toLowerCase().endsWith('k')) return parseFloat(str) * 1000;
    if (str.toLowerCase().endsWith('m')) return parseFloat(str) * 1000000;
    const num = parseFloat(str);
    return isNaN(num) ? null : num;
  };

  // --- Override-aware field getter: checks overrides first, then listing data ---
  const getFieldValue = (listing, key) => {
    const overrideKey = `${listing.id}-${key}`;
    if (overrides[overrideKey] !== undefined && overrides[overrideKey] !== '') {
      return overrides[overrideKey];
    }
    return listing[key];
  };

  const setFieldValue = (listingId, key, value) => {
    setOverrides(prev => ({ ...prev, [`${listingId}-${key}`]: value }));
  };

  // --- Click-to-edit support ---
  const isEditing = (listingId, key) => {
    return editingCells[`${listingId}-${key}`] || false;
  };

  const startEditing = (listingId, key, currentValue) => {
    setEditingCells(prev => ({ ...prev, [`${listingId}-${key}`]: true }));
    if (overrides[`${listingId}-${key}`] === undefined) {
      setOverrides(prev => ({ ...prev, [`${listingId}-${key}`]: String(currentValue || '') }));
    }
  };

  // --- Valuation Multiple: reads from overrides via getFieldValue ---
  const getValuationMultipleComputed = (listing) => {
    const rawPrice = getFieldValue(listing, 'price');
    const price = parseCurrency(rawPrice);
    const rawFees = getFieldValue(listing, 'fees') || getFieldValue(listing, 'poSalary');
    const fees = parseCurrency(rawFees);
    if (!price || !fees || fees === 0) return '—';
    return (price / fees).toFixed(1) + 'x';
  };

  const selectedListings = LISTINGS.filter(l => selected.includes(l.id));

  const metrics = [
    { label: 'Asking Price', key: 'price', format: formatCurrency, editable: true },
    { label: 'PO Fees', key: 'fees', format: formatCurrency, editable: true },
    { label: 'FCM Score', key: 'score', format: (v) => String(v), editable: false },
    { label: 'Valuation Multiple', key: null, computed: true, getValue: (listing) => getValuationMultipleComputed(listing), editable: false },
    { label: 'Region', key: 'region', format: (v) => v, editable: false },
    { label: 'Tenure', key: 'tenure', format: (v) => v ? v.charAt(0).toUpperCase() + v.slice(1) : '—', editable: false },
    { label: 'Revenue Health', key: 'health', format: null, isDot: true, editable: false },
    { label: 'Location Strength', key: 'locationStrength', format: null, isDot: true, editable: false },
    { label: 'Risk Level', key: 'risk', format: null, isDot: true, editable: false },
  ];

  // Find best values for highlighting (override-aware)
  const bestValues = {};
  if (selectedListings.length > 1) {
    bestValues.score = Math.max(...selectedListings.map(l => parseCurrency(getFieldValue(l, 'score')) || 0));
    bestValues.fees = Math.max(...selectedListings.map(l => parseCurrency(getFieldValue(l, 'fees')) || 0));
    const withFees = selectedListings.filter(l => {
      const f = parseCurrency(getFieldValue(l, 'fees'));
      return f && f > 0;
    });
    if (withFees.length) {
      bestValues.valuationId = withFees.reduce((best, curr) => {
        const bestPrice = parseCurrency(getFieldValue(best, 'price')) || Infinity;
        const bestFees = parseCurrency(getFieldValue(best, 'fees')) || 1;
        const currPrice = parseCurrency(getFieldValue(curr, 'price')) || Infinity;
        const currFees = parseCurrency(getFieldValue(curr, 'fees')) || 1;
        return (currPrice / currFees) < (bestPrice / bestFees) ? curr : best;
      }, withFees[0]).id;
    }
  }

  return (
    <div>
      {/* Selector */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#e6edf3', margin: 0 }}>Select up to {maxCompare} listings to compare</h3>
          {selected.length > 0 && (
            <button onClick={() => { setSelected([]); setOverrides({}); setEditingCells({}); }} style={{ fontSize: '13px', color: '#D4AF37', background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {LISTINGS.filter(l => l.score > 0).sort((a, b) => b.score - a.score).map(l => (
            <button
              key={l.id}
              onClick={() => toggle(l.id)}
              disabled={!selected.includes(l.id) && selected.length >= maxCompare}
              style={{
                padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                background: selected.includes(l.id) ? '#D4AF3720' : '#0d1117',
                border: selected.includes(l.id) ? '1px solid #D4AF37' : '1px solid #1e2733',
                color: selected.includes(l.id) ? '#D4AF37' : '#8b949e',
                opacity: !selected.includes(l.id) && selected.length >= maxCompare ? 0.4 : 1,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: '600', marginRight: '6px' }}>{l.score}</span>
              {l.name.length > 30 ? l.name.substring(0, 30) + '…' : l.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      {selectedListings.length >= 2 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #D4AF37', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D4AF37', minWidth: '160px' }}>Metric</th>
                {selectedListings.map(l => (
                  <th key={l.id} style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '2px solid #D4AF37', fontSize: '13px', color: '#e6edf3', fontWeight: '600', minWidth: '160px' }}>
                    <div>{l.name.length > 25 ? l.name.substring(0, 25) + '…' : l.name}</div>
                    <button onClick={() => toggle(l.id)} style={{ marginTop: '4px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '11px' }}>remove</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, mi) => (
                <tr key={mi}>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #1e2733', fontSize: '13px', color: '#8b949e', fontWeight: '500' }}>
                    {metric.label}
                    {metric.editable && <span style={{ fontSize: '10px', color: '#D4AF3780', marginLeft: '4px' }}>✎</span>}
                  </td>
                  {selectedListings.map(l => {
                    // --- Computed rows (Valuation Multiple) ---
                    if (metric.computed) {
                      const computedValue = metric.getValue(l);
                      const isBest = metric.label === 'Valuation Multiple' && bestValues.valuationId === l.id;
                      return (
                        <td key={l.id} style={{
                          padding: '12px 16px', textAlign: 'center', fontSize: '14px',
                          fontFamily: 'JetBrains Mono, monospace', fontWeight: '600',
                          color: computedValue !== '—' ? (isBest ? '#22c55e' : '#D4AF37') : '#6b7280',
                          background: isBest ? '#22c55e08' : 'transparent',
                          borderBottom: '1px solid #1e2733',
                        }}>
                          {computedValue}
                        </td>
                      );
                    }

                    // --- Editable rows (Asking Price, PO Fees) ---
                    if (metric.editable) {
                      const rawValue = getFieldValue(l, metric.key);
                      const isEmpty = !rawValue || rawValue === '—' || rawValue === '' || rawValue === 0;
                      const editing = isEditing(l.id, metric.key) || isEmpty;

                      if (editing) {
                        return (
                          <td key={l.id} style={{ padding: '4px 8px', borderBottom: '1px solid #1e2733' }}>
                            <input
                              type="text"
                              value={overrides[`${l.id}-${metric.key}`] ?? (isEmpty ? '' : String(rawValue))}
                              placeholder="Enter value"
                              onChange={(e) => setFieldValue(l.id, metric.key, e.target.value)}
                              style={{
                                width: '100%', padding: '6px 8px', background: '#161b22',
                                border: '1px dashed #D4AF3760', borderRadius: '4px',
                                color: '#D4AF37', fontSize: '13px',
                                fontFamily: 'JetBrains Mono, monospace', textAlign: 'center', outline: 'none',
                              }}
                              autoFocus={!isEmpty}
                            />
                          </td>
                        );
                      }

                      // Show formatted value, clickable to edit
                      const numericValue = parseCurrency(rawValue);
                      const displayValue = metric.format && numericValue != null ? metric.format(numericValue) : rawValue;
                      const isBest = (metric.key === 'score' && (parseCurrency(rawValue) || 0) === bestValues.score) ||
                                     (metric.key === 'fees' && (parseCurrency(rawValue) || 0) === bestValues.fees && (parseCurrency(rawValue) || 0) > 0);
                      return (
                        <td key={l.id}
                          onClick={() => startEditing(l.id, metric.key, rawValue)}
                          style={{
                            cursor: 'pointer', padding: '12px 16px', textAlign: 'center',
                            borderBottom: '1px solid #1e2733', fontSize: '14px',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: isBest ? '700' : '400',
                            color: isBest ? '#22c55e' : '#e6edf3',
                            background: isBest ? '#22c55e08' : 'transparent',
                          }}
                          title="Click to edit"
                        >
                          {displayValue || '—'}
                        </td>
                      );
                    }

                    // --- Dot rows (health indicators) ---
                    if (metric.isDot) {
                      const dotVal = l[metric.key];
                      return (
                        <td key={l.id} style={{ padding: '12px 16px', borderBottom: '1px solid #1e2733', textAlign: 'center', fontSize: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getHealthDot(dotVal) }} />
                            <span style={{ textTransform: 'capitalize', color: '#e6edf3' }}>{dotVal}</span>
                          </div>
                        </td>
                      );
                    }

                    // --- Standard read-only rows ---
                    let value = metric.format ? metric.format(l[metric.key]) : l[metric.key];
                    let isBest = false;
                    if (metric.key === 'score' && l.score === bestValues.score) isBest = true;
                    return (
                      <td key={l.id} style={{
                        padding: '12px 16px', borderBottom: '1px solid #1e2733', textAlign: 'center',
                        fontSize: '14px', fontFamily: metric.key === 'score' ? 'JetBrains Mono, monospace' : 'inherit',
                        fontWeight: isBest ? '700' : '400',
                        color: isBest ? '#22c55e' : '#e6edf3',
                        background: isBest ? '#22c55e08' : 'transparent',
                      }}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Insights row */}
              <tr>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #1e2733', fontSize: '13px', color: '#8b949e', fontWeight: '500', verticalAlign: 'top' }}>Broker Insight</td>
                {selectedListings.map(l => (
                  <td key={l.id} style={{ padding: '12px 16px', borderBottom: '1px solid #1e2733', fontSize: '12px', color: '#8b949e', lineHeight: '1.5' }}>
                    {l.insight || '—'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#0d1117', borderRadius: '12px', border: '1px solid #1e2733' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚖️</div>
          <p style={{ fontSize: '16px', color: '#8b949e', margin: 0 }}>Select at least 2 listings above to compare them side by side</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MARKET INTEL TAB
   ═══════════════════════════════════════════ */
function MarketIntelTab() {
  const totalListings = MARKET_DATA.reduce((s, r) => s + r.listings, 0);
  const avgPrice = Math.round(MARKET_DATA.reduce((s, r) => s + r.avgPrice * r.listings, 0) / totalListings);
  const regionsUp = MARKET_DATA.filter(r => r.trend === 'up').length;

  return (
    <div>
      {/* National overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Opportunities', value: totalListings, color: '#D4AF37' },
          { label: 'Avg Asking Price', value: formatCurrency(avgPrice), color: '#e6edf3' },
          { label: 'Regions Tracked', value: MARKET_DATA.length, color: '#3b82f6' },
          { label: 'Regions Trending Up', value: regionsUp, color: '#22c55e' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#0d1117', border: '1px solid #1e2733', borderRadius: '12px', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8b949e', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: typeof stat.value === 'number' ? '28px' : '22px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Regional breakdown */}
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#e6edf3', marginBottom: '16px' }}>Regional Breakdown</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {MARKET_DATA.sort((a, b) => b.listings - a.listings).map(region => (
          <div key={region.region} style={{ background: '#0d1117', border: '1px solid #1e2733', borderRadius: '12px', padding: '20px', transition: 'border-color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#30363d'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#1e2733'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#e6edf3', margin: 0 }}>{region.region}</h4>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: getTrendColor(region.trend) }}>
                {getTrendIcon(region.trend)} {region.trend.charAt(0).toUpperCase() + region.trend.slice(1)}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '2px' }}>Avg Price</div>
                <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{formatCurrency(region.avgPrice)}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '2px' }}>Avg Fees</div>
                <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{region.avgFees ? formatCurrency(region.avgFees) : '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '2px' }}>Listings</div>
                <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: '#D4AF37' }}>{region.listings}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '2px' }}>Avg Score</div>
                <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: getScoreColor(region.avgScore) }}>{region.avgScore}</div>
              </div>
            </div>
            {/* Score bar */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ height: '4px', background: '#1e2733', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${region.avgScore}%`, background: getScoreColor(region.avgScore), borderRadius: '2px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: '24px', padding: '16px', background: '#161b22', borderRadius: '8px', borderLeft: '3px solid #6b7280' }}>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
          Market data is based on current FCM Intelligence listings and updated weekly. This is guidance based on our experience of 17+ years operating retail businesses. It is not legal, financial, or professional advice. Always consult a qualified professional before making decisions.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PLACEHOLDER TAB (for tabs not yet built)
   ═══════════════════════════════════════════ */
function PlaceholderTab({ tabId, tabLabel }) {
  const placeholders = {
    calculator: { emoji: '🧮', title: 'Offer Calculator', desc: 'AI-powered offer guidance to help you determine the right price. Analyses comparable sales, valuation multiples, and market conditions.', cta: 'Coming Soon — £100 per analysis' },
    templates: { emoji: '📝', title: 'Email Templates', desc: 'Ready-to-send email templates for broker outreach, seller contact, professional introductions, and negotiation communications.', cta: 'Coming Soon' },
    documents: { emoji: '📄', title: 'Document Analysis', desc: 'Upload leases, accounts, or contracts. Our AI analyses key terms, identifies risks, and highlights what to ask your solicitor.', cta: 'Coming Soon — Included with Pro' },
    journey: { emoji: '🗺️', title: 'Acquisition Journey', desc: 'Your step-by-step guide from finding a business to completing the purchase. Track your progress and access the right services at each stage.', cta: 'Coming Soon' },
    profile: { emoji: '👤', title: 'Your Profile', desc: 'Manage your preferences, notification settings, match history, and saved listings. Update your search criteria to improve match accuracy.', cta: 'Coming Soon' },
  };

  const ph = placeholders[tabId] || { emoji: '🔧', title: tabLabel, desc: 'This feature is being built.', cta: 'Coming Soon' };

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
  const [activeTab, setActiveTab] = useState('feed');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        // Insider but not Pro — offer upgrade
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
    setEmail('');
    setError('');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  /* ─── LOGIN SCREEN ─── */
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#010409', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
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
                    <p style={{ fontSize: '14px', color: '#D4AF37', margin: '0 0 8px 0', fontWeight: '600' }}>You're an Insider — upgrade to Pro!</p>
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

        {/* Tab content */}
        {activeTab === 'feed' && <LiveFeedTab subscriberName={firstName} />}
        {activeTab === 'opportunities' && <OpportunitiesTab />}
        {activeTab === 'compare' && <CompareTab />}
        {activeTab === 'market' && <MarketIntelTab />}
        {['calculator', 'templates', 'documents', 'journey', 'profile'].includes(activeTab) && (
          <PlaceholderTab tabId={activeTab} tabLabel={TABS.find(t => t.id === activeTab)?.label || ''} />
        )}
      </div>
    </div>
  );
}
