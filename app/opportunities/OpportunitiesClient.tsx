"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { ListingCard } from "@/components/listing-card";
import { listings } from "@/lib/listings-data";
import type { BusinessType } from "@/types/listing";

// ─── Main Page ──────────────────────────────────────────
export default function OpportunitiesClient() {
  // Filter states
  const [category, setCategory] = useState<'all' | BusinessType>('all');
  const [region, setRegion] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [budget, setBudget] = useState<string>('all');
  const [insiderOnly, setInsiderOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Get unique regions from listings
  const regions = useMemo(() => {
    const uniqueRegions = new Set<string>();
    listings.forEach(listing => {
      if (listing.region) uniqueRegions.add(listing.region);
    });
    return Array.from(uniqueRegions).sort();
  }, []);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: listings.length,
      post_office: 0,
      convenience_store: 0,
      forecourt: 0,
      newsagent: 0,
    };
    
    listings.forEach(listing => {
      counts[listing.businessType] = (counts[listing.businessType] || 0) + 1;
    });
    
    return counts;
  }, []);

  // Filter listings
  const filteredListings = useMemo(() => {
    let filtered = [...listings];

    if (category !== 'all') {
      filtered = filtered.filter(l => l.businessType === category);
    }

    if (region) {
      filtered = filtered.filter(l => l.region === region);
    }

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(l => 
        l.businessName.toLowerCase().includes(query) ||
        l.location.toLowerCase().includes(query) ||
        l.notes.toLowerCase().includes(query)
      );
    }

    if (budget !== 'all') {
      filtered = filtered.filter(l => {
        if (!l.askingPrice) return false;
        const price = parseInt(l.askingPrice);
        
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
      filtered = filtered.filter(l => l.insiderVisible === true);
    }

    filtered.sort((a, b) => {
      if (a.insiderVisible && !b.insiderVisible) return -1;
      if (!a.insiderVisible && b.insiderVisible) return 1;
      return b.id.localeCompare(a.id);
    });

    return filtered;
  }, [category, region, search, budget, insiderOnly]);

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
          className="relative w-full py-3 px-4 text-center"
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
        className="relative pt-24 pb-12 md:pt-32 md:pb-16" 
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

      {/* ═══════════════════════════ FILTERS BAR (STICKY) ═══════════════════════════ */}
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
                onClick={() => setCategory('convenience_store')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  category === 'convenience_store' 
                    ? 'bg-[#c9a227] text-black' 
                    : 'bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                }`}
              >
                Convenience ({categoryCounts.convenience_store})
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
              {categoryCounts.newsagent > 0 && (
                <button
                  onClick={() => setCategory('newsagent')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    category === 'newsagent' 
                      ? 'bg-[#c9a227] text-black' 
                      : 'bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-white'
                  }`}
                >
                  Newsagent ({categoryCounts.newsagent})
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#8b949e' }}>Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: '#161b22', color: '#fff', border: '1px solid #30363d' }}
                >
                  <option value="">All Regions</option>
                  {regions.map(r => (<option key={r} value={r}>{r}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#8b949e' }}>Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search listings..."
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: '#161b22', color: '#fff', border: '1px solid #30363d' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#8b949e' }}>Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
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
                <label className="block text-xs font-semibold mb-2" style={{ color: '#8b949e' }}>Insider Picks</label>
                <button
                  onClick={() => setInsiderOnly(!insiderOnly)}
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
          <p className="text-sm" style={{ color: '#8b949e' }}>
            Showing <strong className="text-white">{filteredListings.length}</strong> of <strong className="text-white">{listings.length}</strong> opportunities
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ LISTINGS GRID ═══════════════════════════ */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
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
