"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import ListingCard from "@/components/ListingCard";

// ─── Main Page ──────────────────────────────────────────
export default function OpportunitiesClient() {
  // Data from Supabase
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [category, setCategory] = useState('all');
  const [region, setRegion] = useState('');
  const [search, setSearch] = useState('');
  const [budget, setBudget] = useState('all');
  const [insiderOnly, setInsiderOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Fetch listings from Supabase API on mount
  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/opportunities");
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data.listings || []);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  // Get unique regions from listings
  const regions = useMemo(() => {
    const uniqueRegions = new Set();
    listings.forEach(listing => {
      if (listing.region) uniqueRegions.add(listing.region);
    });
    return Array.from(uniqueRegions).sort();
  }, [listings]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts = {
      all: listings.length,
      post_office: 0,
      convenience: 0,
      forecourt: 0,
    };
    
    listings.forEach(listing => {
      if (listing.category && counts[listing.category] !== undefined) {
        counts[listing.category] = (counts[listing.category] || 0) + 1;
      }
    });
    
    return counts;
  }, [listings]);

  // Filter listings
  const filteredListings = useMemo(() => {
    let filtered = [...listings];

    if (category !== 'all') {
      filtered = filtered.filter(l => l.category === category);
    }

    if (region) {
      filtered = filtered.filter(l => l.region === region);
    }

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(l => 
        (l.business_name || '').toLowerCase().includes(query) ||
        (l.location || '').toLowerCase().includes(query) ||
        (l.pick_reason || '').toLowerCase().includes(query)
      );
    }

    if (budget !== 'all') {
      filtered = filtered.filter(l => {
        if (!l.price) return false;
        const price = parseInt(l.price);
        
        switch(budget) {
          case 'under-50k': return price < 50000;
          case '50k-100k': return price >= 50000 && price < 100000;
          case '100k-200k': return price >= 100000 && price < 200000;
          case '200k-plus': return price >= 200000;
          default: return true;
        }
      });
    }

    if (insiderOnly) {
      filtered = filtered.filter(l => l.is_curated === true);
    }

    filtered.sort((a, b) => {
      if (a.is_curated && !b.is_curated) return -1;
      if (!a.is_curated && b.is_curated) return 1;
      return 0;
    });

    return filtered;
  }, [listings, category, region, search, budget, insiderOnly]);

  const hasActiveFilters = category !== 'all' || region !== '' || search !== '' || budget !== 'all' || insiderOnly;

  const resetFilters = () => {
    setCategory('all');
    setRegion('');
    setSearch('');
    setBudget('all');
    setInsiderOnly(false);
  };

  return (
    <AppLayout>
      {/* ═══════════════════════════ FREE ACCESS BANNER ═══════════════════════════ */}
      {!bannerDismissed && (
        <div
          className="relative w-full mt-16 py-3 px-4 text-center z-40"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #c9a227 50%, #b8960f 100%)',
            color: '#0d1117',
          }}
        >
          <div className="container mx-auto px-4 flex items-center justify-center gap-4 flex-wrap">
            <p className="text-sm md:text-base font-semibold" style={{ color: '#0d1117' }}>
              Free access for now — Soon you&apos;ll need an Insider subscription to view these opportunities. Subscribe today to lock in early access.
            </p>
            <Link
              href="/insider"
              className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90"
              style={{
                background: '#0d1117',
                color: '#D4AF37',
                border: '1px solid #0d1117',
              }}
            >
              Subscribe →
            </Link>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="absolute top-1/2 right-3 -translate-y-1/2 p-1 rounded-full transition-all hover:bg-black/10"
            style={{ color: '#0d1117', lineHeight: 1 }}
            aria-label="Dismiss banner"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* ═══════════════════════════ HERO (COMPACT) ═══════════════════════════ */}
      <section 
        className={`relative pb-12 md:pb-16 ${bannerDismissed ? 'pt-24 md:pt-32 mt-16' : 'pt-12 md:pt-16'}`}
        style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #0d1117 100%)' }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201, 162, 39, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ lineHeight: 1.2 }}>
            Opportunities
          </h1>
          <p className="text-xl mb-4 max-w-2xl mx-auto" style={{ color: '#8b949e' }}>
            Only the deals worth your time — curated daily by experts
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e' }}>
            <span className="flex h-2 w-2 rounded-full bg-[#22c55e] animate-pulse"></span>
            Every listing verified active within 48 hours
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FILTERS BAR (STICKY on desktop, compact on mobile) ═══════════════════════════ */}
      <section 
        className="sticky top-0 z-40 border-b" 
        style={{ background: '#0d1117', borderColor: '#30363d' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-2 py-4 overflow-x-auto">
            <div className="flex gap-2 flex-nowrap">
              <button
                onClick={() => setCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  category === 'all' 
                    ? 'bg-[#c9a227] text-black' 
                    : 'bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                }`}
              >
                All ({categoryCounts.all})
              </button>
              <button
                onClick={() => setCategory('post_office')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  category === 'post_office' 
                    ? 'bg-[#c9a227] text-black' 
                    : 'bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                }`}
              >
                Post Office ({categoryCounts.post_office})
              </button>
              <button
                onClick={() => setCategory('convenience')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  category === 'convenience' 
                    ? 'bg-[#c9a227] text-black' 
                    : 'bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                }`}
              >
                Convenience ({categoryCounts.convenience})
              </button>
              {categoryCounts.forecourt > 0 && (
                <button
                  onClick={() => setCategory('forecourt')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    category === 'forecourt' 
                      ? 'bg-[#c9a227] text-black' 
                      : 'bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                  }`}
                >
                  Forecourt ({categoryCounts.forecourt})
                </button>
              )}
            </div>
            
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
              style={{ background: '#161b22', color: '#8b949e', border: '1px solid #30363d' }}
            >
              Filters {hasActiveFilters && '✓'}
            </button>
          </div>

          <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block pb-4`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#8b949e' }}>Region</label>
                <select
                  value={region}
                  onChange={(e) => { setRegion(e.target.value); setMobileFiltersOpen(false); }}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: '#161b22', color: '#fff', border: '1px solid #30363d' }}
                >
                  <option value="">All Regions</option>
                  {regions.map(r => (<option key={r} value={r}>{r}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#8b949e' }}>Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: '#161b22', color: '#fff', border: '1px solid #30363d' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#8b949e' }}>Budget</label>
                <select
                  value={budget}
                  onChange={(e) => { setBudget(e.target.value); setMobileFiltersOpen(false); }}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: '#161b22', color: '#fff', border: '1px solid #30363d' }}
                >
                  <option value="all">All Budgets</option>
                  <option value="under-50k">Under £50k</option>
                  <option value="50k-100k">£50k - £100k</option>
                  <option value="100k-200k">£100k - £200k</option>
                  <option value="200k-plus">£200k+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#8b949e' }}>Insider Picks</label>
                <button
                  onClick={() => { setInsiderOnly(!insiderOnly); setMobileFiltersOpen(false); }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    insiderOnly 
                      ? 'bg-[#c9a227] text-black' 
                      : 'bg-[#161b22] text-[#8b949e] border border-[#30363d] hover:bg-[#21262d] hover:text-white'
                  }`}
                >
                  {insiderOnly ? '⭐ Insider Only' : 'Show All'}
                </button>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: '#161b22', color: '#c9a227', border: '1px solid #c9a227' }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ RESULTS COUNT ═══════════════════════════ */}
      <section className="py-6" style={{ background: '#0d1117', borderBottom: '1px solid #30363d' }}>
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-sm" style={{ color: '#8b949e' }}>Loading opportunities...</p>
          ) : error ? (
            <p className="text-sm" style={{ color: '#f85149' }}>Error loading listings. Please refresh the page.</p>
          ) : (
            <p className="text-sm" style={{ color: '#8b949e' }}>
              Showing <strong className="text-white">{filteredListings.length}</strong> of <strong className="text-white">{listings.length}</strong> opportunities
            </p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════ LISTINGS GRID ═══════════════════════════ */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 animate-pulse">📡</div>
            <h3 className="text-2xl font-bold mb-4">Loading opportunities...</h3>
            <p className="text-lg" style={{ color: '#8b949e' }}>
              Fetching the latest listings from our database
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-2xl font-bold mb-4">Something went wrong</h3>
            <p className="text-lg mb-8" style={{ color: '#8b949e' }}>
              Could not load listings. Please try refreshing the page.
            </p>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} tier="standard" index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold mb-4">No listings match your filters</h3>
            <p className="text-lg mb-8" style={{ color: '#8b949e' }}>
              Try adjusting your search criteria or reset all filters
            </p>
            <button onClick={resetFilters} className="btn-primary px-8 py-3">
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ═══════════════════════════ BOTTOM CTA ═══════════════════════════ */}
      <section 
        className="py-16" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(30, 58, 95, 0.15) 100%)', 
          borderTop: '1px solid rgba(201,162,39,0.2)', 
          borderBottom: '1px solid rgba(201,162,39,0.2)' 
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-lg mb-6" style={{ color: '#8b949e' }}>
            Sign up for weekly alerts and we&apos;ll email you when new opportunities match your criteria
          </p>
          <Link href="/insider" className="btn-primary text-lg px-8 py-3 inline-block">
            Sign Up for Insider Alerts
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
