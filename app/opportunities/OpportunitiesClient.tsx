"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ListingCard } from "@/components/listing-card";
import { listings } from "@/lib/listings-data";
import type { BusinessType } from "@/types/listing";

// ─── Login Modal ────────────────────────────────────────
function LoginModal() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(8px)" }}>
      <div
        className="w-full max-w-md rounded-xl p-8 relative"
        style={{ background: "#161b22", border: "1px solid #30363d", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)" }}
      >
        {!sent ? (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔒</div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>
                Sign in to unlock opportunities
              </h2>
              <p className="text-sm" style={{ color: "#8b949e" }}>
                Access {listings.length}+ curated Post Office listings with expert analysis
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium mb-2" style={{ color: "#c9d1d9" }}>
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                  style={{ background: "#0d1117", border: "1px solid #30363d" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 rounded-lg text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ background: "#FFD700", color: "#000000" }}
              >
                {loading ? "Sending..." : "Send Magic Link →"}
              </button>
            </form>

            <div className="mt-6 pt-4" style={{ borderTop: "1px solid #30363d" }}>
              <p className="text-sm text-center" style={{ color: "#8b949e" }}>
                Don&apos;t have an account?{" "}
                <Link href="/insider" className="font-medium hover:underline" style={{ color: "#FFD700" }}>
                  Join FCM Insider →
                </Link>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">✉️</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
              Check your email
            </h2>
            <p className="mb-4" style={{ color: "#8b949e" }}>
              We sent a magic link to <strong style={{ color: "#FFD700" }}>{email}</strong>
            </p>
            <p className="text-sm" style={{ color: "#8b949e" }}>
              Click the link to sign in. Check spam if you don&apos;t see it.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 text-sm font-medium hover:underline"
              style={{ color: "#FFD700" }}
            >
              Try a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Upgrade Modal ──────────────────────────────────────
function UpgradeModal() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-insider-checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Access to all curated Post Office listings",
    "Weekly personalized opportunity alerts",
    "Early access to new listings before public",
    "FCM Fit Score on every opportunity",
    "Location intelligence & revenue estimates",
    "Priority support from our analysts",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(8px)" }}>
      <div
        className="w-full max-w-lg rounded-xl p-8 relative"
        style={{ background: "#161b22", border: "1px solid #30363d", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)" }}
      >
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-4"
            style={{ background: "rgba(255, 215, 0, 0.15)", border: "1px solid #FFD700", color: "#FFD700" }}
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FFD700] animate-pulse" />
            FCM Insider
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>
            Subscribe to unlock opportunities
          </h2>
          <p className="text-sm" style={{ color: "#8b949e" }}>
            Get full access to all listings and expert analysis
          </p>
        </div>

        {/* Price */}
        <div
          className="text-center py-4 mb-6 rounded-lg"
          style={{ background: "rgba(255, 215, 0, 0.05)", border: "1px solid rgba(255, 215, 0, 0.2)" }}
        >
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold" style={{ color: "#FFD700" }}>£15</span>
            <span className="text-lg" style={{ color: "#8b949e" }}>/month</span>
          </div>
          <p className="text-sm mt-1" style={{ color: "#8b949e" }}>Cancel anytime. No lock-in.</p>
        </div>

        {/* Benefits */}
        <ul className="space-y-3 mb-8">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-0.5" style={{ color: "#22c55e" }}>✓</span>
              <span className="text-sm" style={{ color: "#c9d1d9" }}>{benefit}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-3 rounded-lg text-base font-semibold transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: "#FFD700", color: "#000000" }}
        >
          {loading ? "Redirecting to checkout..." : "Subscribe Now — £15/month"}
        </button>

        <p className="text-center mt-4 text-sm" style={{ color: "#8b949e" }}>
          Already subscribed?{" "}
          <a href="mailto:support@fcmgt.co.uk" className="hover:underline" style={{ color: "#FFD700" }}>
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────
export default function OpportunitiesClient() {
  const { data: session, status } = useSession();
  const [subscriptionStatus, setSubscriptionStatus] = useState<"loading" | "subscribed" | "not_subscribed">("loading");

  // Filter states
  const [category, setCategory] = useState<'all' | BusinessType>('all');
  const [region, setRegion] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [budget, setBudget] = useState<string>('all');
  const [insiderOnly, setInsiderOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Check subscription when authenticated
  const checkSubscription = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch("/api/check-subscription");
      const data = await res.json();
      setSubscriptionStatus(data.subscribed ? "subscribed" : "not_subscribed");
    } catch {
      setSubscriptionStatus("not_subscribed");
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === "authenticated") {
      checkSubscription();
    } else if (status === "unauthenticated") {
      setSubscriptionStatus("not_subscribed");
    }
  }, [status, checkSubscription]);

  // Determine what to show
  const isLoading = status === "loading" || (status === "authenticated" && subscriptionStatus === "loading");
  const showLoginModal = status === "unauthenticated";
  const showUpgradeModal = status === "authenticated" && subscriptionStatus === "not_subscribed";
  const hasAccess = status === "authenticated" && subscriptionStatus === "subscribed";

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
      {/* Auth Modals */}
      {showLoginModal && <LoginModal />}
      {showUpgradeModal && <UpgradeModal />}

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

      {/* Loading state */}
      {isLoading && (
        <section className="py-20 text-center">
          <div className="text-lg" style={{ color: "#8b949e" }}>
            <div className="animate-pulse">Checking access...</div>
          </div>
        </section>
      )}

      {/* Content — show blurred preview behind modals for non-subscribers, full content for subscribers */}
      <div className={!hasAccess && !isLoading ? "pointer-events-none select-none" : ""} style={!hasAccess && !isLoading ? { filter: "blur(6px)", opacity: 0.4 } : {}}>
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
      </div>

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
