"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import ListingCard from "@/components/ListingCard";

export default function OpportunitiesClient() {
  const [listings, setListings] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [brokerCount, setBrokerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [freeholdOnly, setFreeholdOnly] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [page, setPage] = useState(1);
  const CARDS_PER_PAGE = 24;

  // Fetch data
  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/opportunities");
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data.listings || []);
        setAllRegions(data.regions || []);
        setBrokerCount(data.brokers || 0);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: listings.length, post_office: 0, convenience: 0, forecourt: 0 };
    listings.forEach((l) => {
      if (l.category && counts[l.category] !== undefined) counts[l.category]++;
    });
    return counts;
  }, [listings]);

  // Filter logic
  const filtered = useMemo(() => {
    let result = [...listings];

    if (category !== "all") {
      result = result.filter((l) => l.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          (l.business_name || "").toLowerCase().includes(q) ||
          (l.location || "").toLowerCase().includes(q) ||
          (l.postcode || "").toLowerCase().includes(q) ||
          (l.pick_reason || "").toLowerCase().includes(q)
      );
    }

    if (priceRange !== "all") {
      result = result.filter((l) => {
        if (!l.price) return false;
        if (priceRange === "under-100k") return l.price < 100000;
        if (priceRange === "100k-250k") return l.price >= 100000 && l.price <= 250000;
        if (priceRange === "250k-plus") return l.price > 250000;
        return true;
      });
    }

    if (freeholdOnly) {
      result = result.filter((l) => l.tenure === "freehold");
    }

    if (selectedRegion) {
      result = result.filter((l) => l.region === selectedRegion);
    }

    return result;
  }, [listings, category, search, priceRange, freeholdOnly, selectedRegion]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
  const paginatedCards = filtered.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, search, priceRange, freeholdOnly, selectedRegion]);

  const hasActiveFilters = category !== "all" || search || priceRange !== "all" || freeholdOnly || selectedRegion;

  // Pill button style helper
  const pill = (active) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid",
    borderColor: active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
    background: active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
    color: active ? "#fff" : "rgba(255,255,255,0.5)",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  });

  // Insert upsell banners
  function renderCardsWithUpsells() {
    const elements = [];
    paginatedCards.forEach((listing, i) => {
      const globalIndex = (page - 1) * CARDS_PER_PAGE + i;
      elements.push(
        <ListingCard key={listing.id} listing={listing} tier="standard" index={i} />
      );
      // Insert upsell banner after every 7th card
      if ((i + 1) % 7 === 0 && i < paginatedCards.length - 1) {
        elements.push(
          <div
            key={`upsell-${i}`}
            style={{
              gridColumn: "1 / -1",
              background: "linear-gradient(135deg, rgba(239,159,39,0.08), rgba(239,159,39,0.03))",
              border: "1px solid rgba(239,159,39,0.15)",
              borderRadius: 12,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#EF9F27", marginBottom: 4 }}>
                Want personalised matches?
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                Tell us what you&apos;re looking for and we&apos;ll find it for you.
              </div>
            </div>
            <Link
              href="/insider"
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                background: "#EF9F27",
                color: "#000",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Join Insider · £15/mo
            </Link>
          </div>
        );
      }
    });
    return elements;
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 16px 64px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 8,
              lineHeight: 1.1,
            }}
          >
            Opportunities
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 600, lineHeight: 1.5 }}>
            Every post office, convenience store, and forecourt for sale in the UK.
            Multiple brokers. One deck. Updated daily.
          </p>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 12, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {/* Category pills */}
          <button onClick={() => setCategory("all")} style={pill(category === "all")}>
            All ({categoryCounts.all})
          </button>
          <button onClick={() => setCategory("post_office")} style={pill(category === "post_office")}>
            🏤 Post Office ({categoryCounts.post_office})
          </button>
          <button onClick={() => setCategory("convenience")} style={pill(category === "convenience")}>
            🏪 Convenience ({categoryCounts.convenience})
          </button>
          <button onClick={() => setCategory("forecourt")} style={pill(category === "forecourt")}>
            ⛽ Forecourt ({categoryCounts.forecourt})
          </button>

          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
            <input
              type="text"
              placeholder="Search location, name, postcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 14px 7px 34px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#fff",
                fontSize: 13,
                outline: "none",
              }}
            />
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.4 }}>
              🔍
            </span>
          </div>
        </div>

        {/* Price + tenure + region filters */}
        <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <button onClick={() => setPriceRange(priceRange === "under-100k" ? "all" : "under-100k")} style={pill(priceRange === "under-100k")}>
            Under £100k
          </button>
          <button onClick={() => setPriceRange(priceRange === "100k-250k" ? "all" : "100k-250k")} style={pill(priceRange === "100k-250k")}>
            £100k–£250k
          </button>
          <button onClick={() => setPriceRange(priceRange === "250k-plus" ? "all" : "250k-plus")} style={pill(priceRange === "250k-plus")}>
            £250k+
          </button>
          <button onClick={() => setFreeholdOnly(!freeholdOnly)} style={pill(freeholdOnly)}>
            Freehold
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

          {/* Region pills */}
          {allRegions.slice(0, 8).map((r) => (
            <button key={r} onClick={() => setSelectedRegion(selectedRegion === r ? "" : r)} style={pill(selectedRegion === r)}>
              {r}
            </button>
          ))}
          {allRegions.length > 8 && (
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>+{allRegions.length - 8} more</span>
          )}
        </div>

        {/* Counter + clear */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
            <span style={{ color: "#fff", fontWeight: 700 }}>{filtered.length}</span> listing{filtered.length !== 1 ? "s" : ""}
            {brokerCount > 0 && <> · {brokerCount} broker{brokerCount !== 1 ? "s" : ""}</>}
            {" · "}
            <span style={{ color: colours_accent }}>click to flip</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setCategory("all");
                setSearch("");
                setPriceRange("all");
                setFreeholdOnly(false);
                setSelectedRegion("");
              }}
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Loading / Error states */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🃏</div>
            <div>Shuffling the deck...</div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#ef4444" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div>Failed to load listings. Please try again.</div>
          </div>
        )}

        {/* Card grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                <div>No listings match your filters. Try adjusting your search.</div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 18,
                }}
              >
                {renderCardsWithUpsells()}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 32 }}>
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.05)",
                    color: page === 1 ? "rgba(255,255,255,0.2)" : "#fff",
                    border: "1px solid rgba(255,255,255,0.08)",
                    cursor: page === 1 ? "default" : "pointer",
                  }}
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      background: p === page ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
                      color: p === page ? "#fff" : "rgba(255,255,255,0.4)",
                      border: `1px solid ${p === page ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.05)",
                    color: page === totalPages ? "rgba(255,255,255,0.2)" : "#fff",
                    border: "1px solid rgba(255,255,255,0.08)",
                    cursor: page === totalPages ? "default" : "pointer",
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
      `}</style>
    </AppLayout>
  );
}

const colours_accent = "rgba(239,159,39,0.7)";