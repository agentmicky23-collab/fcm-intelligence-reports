"use client";

import { useState, useRef, useEffect } from "react";

// ─── Flip CSS (injected once) ───────────────────────────────────
const FLIP_STYLES = `
.lc-wrapper { perspective: 1000px; height: 580px; cursor: pointer; }
.lc-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.65s cubic-bezier(.4,0,.2,1); }
.lc-inner.flipped { transform: rotateY(180deg); }
.lc-face { position: absolute; inset: 0; -webkit-backface-visibility: hidden !important; backface-visibility: hidden !important; transform-style: flat !important; }
.lc-front { transform: rotateY(0deg); z-index: 2; }
.lc-back { transform: rotateY(180deg); z-index: 1; }
@keyframes cardEntrance { from { opacity:0; transform: translateY(30px) scale(0.95); } to { opacity:1; transform: translateY(0) scale(1); } }
`;
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = FLIP_STYLES;
  document.head.appendChild(s);
  stylesInjected = true;
}

// ─── Category colour maps ─────────────────────────────────────────
const CATEGORY_COLOURS = {
  post_office: {
    frameFrom: "#0D5E3F",
    frameTo: "#15B07D",
    headerFrom: "#064A32",
    headerTo: "#15A870",
    badgeBg: "rgba(93,202,165,0.15)",
    badgeText: "#5DCAA5",
    taglineBorder: "rgba(93,202,165,0.3)",
    pip: "#5DCAA5",
    btnPrimary: "#15B07D",
    btnSecondary: "#0D5E3F",
  },
  convenience: {
    frameFrom: "#0C3D7A",
    frameTo: "#1E88E5",
    headerFrom: "#042C53",
    headerTo: "#1565C0",
    badgeBg: "rgba(55,138,221,0.15)",
    badgeText: "#85B7EB",
    taglineBorder: "rgba(55,138,221,0.3)",
    pip: "#378ADD",
    btnPrimary: "#1E88E5",
    btnSecondary: "#0C3D7A",
  },
  forecourt: {
    frameFrom: "#7A4F0C",
    frameTo: "#E8A817",
    headerFrom: "#412402",
    headerTo: "#BA7517",
    badgeBg: "rgba(250,199,117,0.15)",
    badgeText: "#FAC775",
    taglineBorder: "rgba(250,199,117,0.3)",
    pip: "#EF9F27",
    btnPrimary: "#E8A817",
    btnSecondary: "#7A4F0C",
  },
};

const CATEGORY_LABELS = {
  post_office: "POST OFFICE",
  convenience: "CONVENIENCE STORE",
  forecourt: "FORECOURT",
};

const CATEGORY_EMOJIS = {
  post_office: "🏤",
  convenience: "🏪",
  forecourt: "⛽",
};

// ─── Helpers ─────────────────────────────────────────────
function formatPrice(price, priceLabel) {
  // 1. Prefer numeric price
  if (price && price > 0) return "£" + price.toLocaleString("en-GB");
  // 2. If price_label looks like an actual price (starts with £ + digits)
  if (priceLabel && priceLabel.match(/^£[\d,]+/)) return priceLabel;
  // 3. POA variants
  if (priceLabel && priceLabel.toLowerCase().includes('poa')) return 'POA';
  // 4. Everything else (Leasehold, Freehold, Ultra-Low Entry, etc.) — NOT a price
  if (!price || price === 0) return 'Price TBC';
  return "£" + price.toLocaleString("en-GB");
}

function getDisplayTenure(listing) {
  if (listing.tenure === 'freehold') return 'Freehold';
  if (listing.tenure === 'leasehold') return 'Leasehold';
  if (listing.price_label) {
    const pl = listing.price_label.toLowerCase();
    if (pl.includes('freehold')) return 'Freehold';
    if (pl.includes('leasehold')) return 'Leasehold';
  }
  return null;
}

function parseCurrency(str) {
  if (!str) return null;
  const match = str.replace(/[£,]/g, "").match(/([\d.]+)/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (str.toLowerCase().includes("k")) return num * 1000;
  return num;
}

function calcPriceRatio(price, poSalary) {
  if (!price || !poSalary) return null;
  const sal = parseCurrency(poSalary);
  if (!sal || sal === 0) return null;
  return (price / sal).toFixed(1);
}

function calcScore(listing) {
  let score = 1;
  if (listing.is_curated) score += 2;
  if (listing.price) score += 0.5;
  if (listing.po_salary) score += 0.5;
  if (listing.annual_turnover) score += 0.5;
  if (listing.net_profit) score += 0.5;
  if (listing.accommodation) score += 0.25;
  if (listing.premises_size) score += 0.25;
  if (listing.postcode) score += 0.25;
  if (listing.source_url) score += 0.25;
  return Math.min(5, Math.round(score));
}

function truncate(str, len) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len).trimEnd() + "…" : str;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

function isNewListing(addedAt) {
  if (!addedAt) return false;
  const added = new Date(addedAt);
  const now = new Date();
  return (now - added) / (1000 * 60 * 60 * 24) <= 7;
}

// ─── ListingCard Component ─────────────────────────────────────────
export default function ListingCard({ listing, tier = "standard", index = 0 }) {
  const [flipped, setFlipped] = useState(false);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const innerRef = useRef(null);

  // Apply backface-visibility programmatically after mount
  useEffect(() => {
    if (frontRef.current) {
      frontRef.current.style.webkitBackfaceVisibility = 'hidden';
      frontRef.current.style.backfaceVisibility = 'hidden';
      frontRef.current.style.transformStyle = 'flat';
      frontRef.current.style.transform = 'rotateY(0deg)';
    }
    if (backRef.current) {
      backRef.current.style.webkitBackfaceVisibility = 'hidden';
      backRef.current.style.backfaceVisibility = 'hidden';
      backRef.current.style.transformStyle = 'flat';
      backRef.current.style.transform = 'rotateY(180deg)';
    }
    if (innerRef.current) {
      innerRef.current.style.transformStyle = 'preserve-3d';
    }
  }, []);

  const cat = listing.category || "post_office";
  const colours = CATEGORY_COLOURS[cat] || CATEGORY_COLOURS.post_office;
  const catLabel = CATEGORY_LABELS[cat] || "BUSINESS";
  const catEmoji = CATEGORY_EMOJIS[cat] || "🏢";

  const priceDisplay = formatPrice(listing.price, listing.price_label);
  const priceRatio = calcPriceRatio(listing.price, listing.po_salary);
  const score = calcScore(listing);
  const verifiedDate = formatDate(listing.verified_at);
  const isNew = isNewListing(listing.added_at);

  // Rarity badge
  let rarityBadge = { label: "Standard", bg: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.08)" };
  if (listing.is_curated) {
    rarityBadge = { label: "★ FCM Pick", bg: "rgba(239,159,39,0.3)", text: "#FAC775", border: "rgba(239,159,39,0.3)" };
  } else if (isNew) {
    rarityBadge = { label: "● New", bg: "rgba(93,202,165,0.25)", text: "#9FE1CB", border: "rgba(93,202,165,0.25)" };
  }

  // Build stats grid — only show cells with data
  const statsItems = [];
  if (listing.po_salary) statsItems.push({ label: "PO Salary", value: listing.po_salary, highlight: "green" });
  if (listing.annual_turnover) statsItems.push({ label: "Turnover", value: listing.annual_turnover });
  if (listing.net_profit) statsItems.push({ label: "Net Profit", value: listing.net_profit, highlight: "green" });
  if (listing.accommodation) statsItems.push({ label: "Accommodation", value: listing.accommodation });
  if (listing.premises_size) statsItems.push({ label: "Premises", value: listing.premises_size });
  if (listing.tenure) statsItems.push({ label: "Tenure", value: listing.tenure.charAt(0).toUpperCase() + listing.tenure.slice(1) });
  if (priceRatio) statsItems.push({ label: "Price Ratio", value: priceRatio + "x salary", highlight: parseFloat(priceRatio) <= 3 ? "gold" : null });
  if (listing.postcode) statsItems.push({ label: "Postcode", value: listing.postcode });

  // Pad to even number for 2-col grid
  if (statsItems.length % 2 !== 0) statsItems.push({ label: '', value: '', highlight: null });

  // Back stats highlight — pick top 6
  const backStatsRaw = statsItems.filter(s => s.value);
  if (backStatsRaw.length % 2 !== 0) backStatsRaw.push({ label: '', value: '', highlight: null });
  const backStats = backStatsRaw.slice(0, 6);

  const locationLine = [listing.location, listing.postcode].filter(Boolean).join(" · ");

  // Entrance animation delay
  const animDelay = Math.min(index * 80, 960);

  injectStyles();

  return (
    <div
      className="lc-wrapper"
      style={{
        animation: `cardEntrance 0.5s cubic-bezier(.4,0,.2,1) ${animDelay}ms both`,
      }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div ref={innerRef} className={`lc-inner${flipped ? ' flipped' : ''}`}>
        {/* ═══════ FRONT ═══════ */}
        <div
          ref={frontRef}
          className="lc-face lc-front"
          style={{
            borderRadius: 14,
            background: `linear-gradient(135deg, ${colours.frameFrom}, ${colours.frameTo})`,
            padding: 6,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              borderRadius: 10,
              background: "#0a0f1a",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            {/* Header zone */}
            <div
              style={{
                height: 100,
                background: `linear-gradient(135deg, ${colours.headerFrom}, ${colours.headerTo})`,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Sparkle dots */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.5 }}>
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: 2 + (i % 3),
                      height: 2 + (i % 3),
                      borderRadius: "50%",
                      background: "white",
                      top: `${10 + ((i * 17) % 80)}%`,
                      left: `${5 + ((i * 23) % 90)}%`,
                      opacity: 0.3 + (i % 4) * 0.15,
                      animation: `sparkle ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
              {/* Radial glow */}
              <div
                style={{
                  position: "absolute",
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)`,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              {/* Rarity badge (top-left) */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  padding: "3px 8px",
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  background: rarityBadge.bg,
                  color: rarityBadge.text,
                  border: `1px solid ${rarityBadge.border}`,
                }}
              >
                {rarityBadge.label}
              </div>
              {/* Emoji icon */}
              <span style={{ fontSize: 42, position: "relative", zIndex: 1 }}>{catEmoji}</span>
              {/* Region badge (bottom-centre) */}
              {listing.region && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "2px 10px",
                    borderRadius: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    background: "rgba(0,0,0,0.35)",
                    color: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {listing.region}
                </div>
              )}
            </div>

            {/* Content area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "10px 12px 8px", minHeight: 0 }}>
              {/* Category badge */}
              <div style={{ marginBottom: 6 }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 1,
                    background: colours.badgeBg,
                    color: colours.badgeText,
                    textTransform: "uppercase",
                  }}
                >
                  {catLabel}
                </span>
              </div>

              {/* PRICE */}
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: (listing.price && listing.price < 100000) || listing.is_curated ? "#EF9F27" : "#fff",
                  lineHeight: 1,
                  marginBottom: 4,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {priceDisplay}
              </div>

              {/* Tenure + ratio pills */}
              <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                {getDisplayTenure(listing) && (
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      background: "rgba(255,255,255,0.08)",
                      color: getDisplayTenure(listing) === 'Freehold' ? '#EF9F27' : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {getDisplayTenure(listing)}
                  </span>
                )}
                {priceRatio && (
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 600,
                      background: "rgba(239,159,39,0.2)",
                      color: "#EF9F27",
                    }}
                  >
                    {priceRatio}x salary
                  </span>
                )}
              </div>

              {/* Business name */}
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 2 }}>
                {listing.business_name}
              </div>

              {/* Location */}
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
                {locationLine}
              </div>

              {/* Tagline */}
              {listing.pick_reason && (
                <div
                  style={{
                    flex: 1,
                    fontSize: 11,
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.4,
                    padding: "6px 8px",
                    borderLeft: `3px solid ${colours.taglineBorder}`,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "0 4px 4px 0",
                    marginBottom: 8,
                    overflow: "hidden",
                  }}
                >
                  {truncate(listing.pick_reason, 120)}
                </div>
              )}
              {!listing.pick_reason && <div style={{ flex: 1 }} />}

              {/* Stats grid — only cells with data */}
              {statsItems.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  {statsItems.slice(0, 8).map((stat, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#0a0f1a",
                        padding: "6px 8px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 8,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          color: "rgba(255,255,255,0.35)",
                          marginBottom: 2,
                        }}
                      >
                        {stat.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color:
                            stat.highlight === "green"
                              ? "#5DCAA5"
                              : stat.highlight === "gold"
                              ? "#EF9F27"
                              : "rgba(255,255,255,0.85)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 6,
                  marginTop: "auto",
                }}
              >
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>
                  {listing.source_platform && <span>{listing.source_platform}</span>}
                  {verifiedDate && <span> · {verifiedDate}</span>}
                </div>
                {/* Score pips */}
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((pip) => (
                    <div
                      key={pip}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: pip <= score ? colours.pip : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Flip hint */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.25)",
                  marginTop: 4,
                }}
              >
                tap to flip →
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ BACK ═══════ */}
        <div
          ref={backRef}
          className="lc-face lc-back"
          style={{
            borderRadius: 14,
            background: `linear-gradient(135deg, ${colours.frameFrom}, ${colours.frameTo})`,
            padding: 6,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              borderRadius: 10,
              background: "#0a0f1a",
              display: "flex",
              flexDirection: "column",
              padding: "16px 14px 12px",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            {/* Business name */}
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
              {listing.business_name}
            </div>
            {/* Full location */}
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
              {locationLine}
            </div>

            {/* FCM Analysis */}
            {listing.pick_reason && (
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: colours.badgeText,
                    marginBottom: 6,
                  }}
                >
                  FCM Analysis
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {listing.pick_reason}
                </div>
              </div>
            )}

            {/* Stats highlight grid */}
            {backStats.length > 0 && (
              <div
                style={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: backStats.length > 4 ? "1fr 1fr 1fr" : backStats.length > 2 ? "1fr 1fr" : "1fr",
                  gap: 1,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 6,
                  overflow: "hidden",
                  marginBottom: 12,
                  minHeight: 0,
                }}
              >
                {backStats.map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#0a0f1a",
                      padding: "8px 10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        color: "rgba(255,255,255,0.35)",
                        marginBottom: 2,
                      }}
                    >
                      {stat.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color:
                          stat.highlight === "green"
                            ? "#5DCAA5"
                            : stat.highlight === "gold"
                            ? "#EF9F27"
                            : "rgba(255,255,255,0.85)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              <a
                href="/reports"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  background: colours.btnPrimary,
                  color: "#fff",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                Insight Report · £199
              </a>
              <a
                href="/reports"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  background: colours.btnSecondary,
                  color: "#fff",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                Intelligence Report · £499
              </a>
              {listing.source_url ? (
                <a
                  href={listing.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "9px 16px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: "transparent",
                    color: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    textDecoration: "none",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                >
                  View on {listing.source_platform || "Broker"} ↗
                </a>
              ) : (
                <a
                  href="mailto:info@fcmreport.com"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "9px 16px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: "transparent",
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    textDecoration: "none",
                  }}
                >
                  Contact FCM for details →
                </a>
              )}
            </div>

            {/* Flip back hint */}
            <div
              style={{
                textAlign: "center",
                fontSize: 9,
                color: "rgba(255,255,255,0.25)",
                marginTop: 8,
              }}
            >
              ← tap to flip back
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes sparkle {
          0% { opacity: 0.2; transform: scale(1); }
          100% { opacity: 0.6; transform: scale(1.4); }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .listing-card-wrapper:hover .listing-card-inner {
          filter: brightness(1.05);
        }
      `}</style>
    </div>
  );
}