/**
 * Homepage — Live Opportunities Listing
 * This is the main landing page for the Reports & Listings site
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { ListingCard } from '@/components/listing-card';
import { listings, getUniqueRegions } from '@/lib/listings-data';

type CategoryFilter = 'all' | 'post-office' | 'forecourt' | 'convenience' | 'newsagent';

export default function HomePage() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [region, setRegion] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [insiderOnly, setInsiderOnly] = useState(false);

  const regions = useMemo(() => getUniqueRegions(), []);

  const filteredListings = useMemo(() => {
    let filtered = [...listings];

    if (category !== 'all') {
      const typeMap: Record<string, string> = {
        'post-office': 'post_office',
        'forecourt': 'forecourt',
        'convenience': 'convenience_store',
        'newsagent': 'newsagent',
      };
      filtered = filtered.filter(l => l.businessType === typeMap[category]);
    }

    if (region) {
      filtered = filtered.filter(l => l.region === region);
    }

    if (insiderOnly) {
      filtered = filtered.filter(l => l.insiderVisible);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.businessName.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.notes.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [category, region, insiderOnly, searchQuery]);

  const allCategories: { value: CategoryFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: listings.length },
    { value: 'post-office', label: 'Post Office', count: listings.filter(l => l.businessType === 'post_office').length },
    { value: 'forecourt', label: 'Forecourt', count: listings.filter(l => l.businessType === 'forecourt').length },
    { value: 'convenience', label: 'Convenience Store', count: listings.filter(l => l.businessType === 'convenience_store').length },
    { value: 'newsagent', label: 'Newsagent', count: listings.filter(l => l.businessType === 'newsagent').length },
  ];
  const categories = allCategories.filter(c => c.count > 0);

  return (
    <AppLayout>
      {/* Hero */}
      <section className="pt-32 pb-12" style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">🔥 Live Opportunities</h1>
          <p className="text-xl mb-2" style={{ color: '#8b949e' }}>Businesses For Sale Now</p>
          <p className="text-sm" style={{ color: '#57606a' }}>
            Curated by <a href="https://fcm-intelligence-nextjs.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FCM Intelligence</a> — 15+ years of Post Office expertise
          </p>
        </div>
      </section>

      {/* Curation Explainer */}
      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="feature-card-old" style={{ padding: '20px' }}>
            <div className="icon" style={{ fontSize: '1.5rem' }}>🔍</div>
            <h3 style={{ fontSize: '0.95rem' }}>Daily Scanning</h3>
            <p style={{ fontSize: '0.8rem' }}>Daltons, RightBiz, BusinessesForSale, private sellers — monitored daily.</p>
          </div>
          <div className="feature-card-old" style={{ padding: '20px' }}>
            <div className="icon" style={{ fontSize: '1.5rem' }}>✅</div>
            <h3 style={{ fontSize: '0.95rem' }}>Verified Active</h3>
            <p style={{ fontSize: '0.8rem' }}>Every listing checked to confirm availability. No dead links.</p>
          </div>
          <div className="feature-card-old" style={{ padding: '20px' }}>
            <div className="icon" style={{ fontSize: '1.5rem' }}>🎯</div>
            <h3 style={{ fontSize: '0.95rem' }}>Quality Filtered</h3>
            <p style={{ fontSize: '0.8rem' }}>Only viable listings. No overpriced duds or money pits.</p>
          </div>
          <div className="feature-card-old" style={{ padding: '20px' }}>
            <div className="icon" style={{ fontSize: '1.5rem' }}>📊</div>
            <h3 style={{ fontSize: '0.95rem' }}>Expert Context</h3>
            <p style={{ fontSize: '0.8rem' }}>Each listing gets our quick assessment and FCM Score.</p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-4" style={{ background: 'rgba(22,27,34,0.5)', borderTop: '1px solid #30363d', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm" style={{ color: '#8b949e' }}>
            <strong className="text-white">Important:</strong> Listings sourced from third-party sites. Verify availability before proceeding. SOLD listings are removed.
          </p>
        </div>
      </section>

      {/* Filters + Listings */}
      <section className="py-12 container mx-auto px-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`filter-btn-old ${category === cat.value ? 'active' : ''}`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center items-center">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: '#161b22', border: '1px solid #30363d', color: '#e6edf3' }}
          >
            <option value="">All Regions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: '#161b22', border: '1px solid #30363d', color: '#e6edf3', minWidth: '200px' }}
          />

          <button
            onClick={() => setInsiderOnly(!insiderOnly)}
            className={`filter-btn-old ${insiderOnly ? 'active' : ''}`}
          >
            ⭐ FCM Insider Picks
          </button>

          <button
            onClick={() => { setCategory('all'); setRegion(''); setSearchQuery(''); setInsiderOnly(false); }}
            className="text-sm font-medium px-3 py-2"
            style={{ color: '#8b949e' }}
          >
            Reset Filters
          </button>
        </div>

        {/* Count */}
        <div className="text-center mb-8" style={{ color: '#57606a' }}>
          Showing {filteredListings.length} of {listings.length} opportunities
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No listings found</h3>
            <p style={{ color: '#8b949e' }}>Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Reports CTA */}
        <div className="mt-12 text-center" style={{ background: '#161b22', borderRadius: '16px', border: '1px solid #30363d', padding: '40px' }}>
          <h3 className="text-xl font-bold mb-3">Need a Due Diligence Report?</h3>
          <p style={{ color: '#8b949e', maxWidth: '500px', margin: '0 auto 24px' }}>
            Get comprehensive intelligence on any listing — financials, location analysis, competition mapping, and expert recommendations.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/reports" className="btn-primary">📊 View Report Pricing</Link>
            <a href="https://fcm-intelligence-nextjs.vercel.app/contact" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Contact Us ↗
            </a>
          </div>
          <p style={{ color: '#57606a', fontSize: '0.8rem', marginTop: '16px' }}>
            Last updated: 6 March 2026 • {listings.length} verified listings
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
