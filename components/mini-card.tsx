"use client";

const gold = "#c9a227";
const goldLight = "#d4b84a";
const navy = "#0B1D3A";
const font = "'Inter', -apple-system, sans-serif";

interface MiniCardProps {
  variant: "insight" | "intelligence";
  href: string;
}

export function MiniCard({ variant, href }: MiniCardProps) {
  const isGold = variant === "intelligence";
  const tiltStart = isGold ? "rotateY(-3deg) rotateX(1deg)" : "rotateY(3deg) rotateX(1deg)";
  const tiltHover = isGold
    ? "rotateY(2deg) rotateX(-3deg) translateY(-8px) scale(1.03)"
    : "rotateY(-2deg) rotateX(-3deg) translateY(-8px) scale(1.03)";
  const shadowHover = isGold
    ? "8px 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(201,162,39,0.06)"
    : "8px 20px 40px rgba(0,0,0,0.4)";

  return (
    <div style={{ perspective: 600 }}>
      <style>{`
        @keyframes fcmHoloSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textDecoration: "none",
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          background: isGold
            ? `linear-gradient(170deg, #0e2340, ${navy} 50%, #0d1f38)`
            : navy,
          border: isGold ? `1.5px solid rgba(201,162,39,0.2)` : "none",
          transform: tiltStart,
          transition: "transform 0.5s cubic-bezier(0.2,0,0,1), box-shadow 0.5s",
          transformStyle: "preserve-3d",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = tiltHover;
          e.currentTarget.style.boxShadow = shadowHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = tiltStart;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* 3D depth layers */}
        <div
          style={{
            position: "absolute",
            inset: 4,
            borderRadius: 16,
            background: "#060e1c",
            transform: "translateZ(-10px)",
            zIndex: -1,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 2,
            borderRadius: 16,
            background: "#081626",
            transform: "translateZ(-5px)",
            zIndex: -1,
          }}
        />

        {/* Holographic foil */}
        <div
          style={{
            position: "absolute",
            top: "-80%",
            left: "-80%",
            width: "260%",
            height: "260%",
            background: isGold
              ? "conic-gradient(from 90deg, transparent 0%, rgba(201,162,39,0.06) 6%, transparent 12%, rgba(201,162,39,0.04) 18%, transparent 24%, rgba(201,162,39,0.06) 30%, transparent 36%)"
              : "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.04) 8%, transparent 16%, rgba(255,255,255,0.02) 24%, transparent 32%, rgba(255,255,255,0.04) 40%, transparent 48%)",
            animation: `fcmHoloSpin ${isGold ? 6 : 10}s linear infinite`,
            pointerEvents: "none",
            zIndex: 1,
            opacity: isGold ? 0.6 : 0.5,
          }}
        />

        {/* Glass gloss */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            pointerEvents: "none",
            zIndex: 10,
            background: isGold
              ? "linear-gradient(135deg, rgba(201,162,39,0.12) 0%, transparent 35%, transparent 60%, rgba(201,162,39,0.06) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.04) 100%)",
          }}
        />

        {/* Edge light */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            pointerEvents: "none",
            zIndex: 11,
            border: isGold
              ? "1px solid rgba(201,162,39,0.15)"
              : "1.5px solid rgba(255,255,255,0.08)",
          }}
        />

        {/* Most popular badge */}
        {isGold && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 12,
              background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
              color: navy,
              fontFamily: font,
              fontSize: 7,
              fontWeight: 600,
              padding: "3px 12px",
              borderRadius: "0 0 8px 8px",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Most popular
          </div>
        )}

        {/* Content */}
        <div style={{ position: "relative", zIndex: 8 }}>
          <div
            style={{
              height: 2,
              background: isGold
                ? `linear-gradient(90deg, transparent, ${gold}, ${goldLight}, ${gold}, transparent)`
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
            }}
          />
          <div
            style={{
              padding: "16px 16px 6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                fontFamily: font,
                fontSize: 9,
                fontWeight: 600,
                color: isGold ? gold : "rgba(201,162,39,0.5)",
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              FCM Intelligence
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: isGold
                  ? "1px solid rgba(201,162,39,0.2)"
                  : "1px solid rgba(255,255,255,0.08)",
                background: isGold
                  ? "rgba(201,162,39,0.04)"
                  : "rgba(255,255,255,0.02)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isGold ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={gold}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(201,162,39,0.6)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              )}
            </div>
          </div>
          <div style={{ padding: "0 16px" }}>
            <div
              style={{
                fontFamily: font,
                fontSize: 9,
                color: isGold
                  ? "rgba(201,162,39,0.3)"
                  : "rgba(255,255,255,0.15)",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              {isGold ? "PREMIUM SERIES" : "REPORT SERIES"}
            </div>
            <div
              style={{
                fontFamily: font,
                fontSize: 10,
                fontWeight: 600,
                color: gold,
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 4,
              }}
            >
              {isGold ? "For negotiating" : "For deciding"}
            </div>
            <div
              style={{
                fontFamily: font,
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 4,
              }}
            >
              {isGold ? "Intelligence" : "Insight"}
            </div>
            <div
              style={{
                fontFamily: font,
                fontSize: 32,
                fontWeight: 700,
                color: isGold ? gold : "#fff",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {isGold ? "£499" : "£199"}
            </div>
            <div
              style={{
                fontFamily: font,
                fontSize: 13,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.4,
                marginBottom: 10,
              }}
            >
              {isGold
                ? '"Power to control this deal."'
                : '"Should I risk my savings?"'}
            </div>
            <div
              style={{
                display: "flex",
                gap: 3,
                marginBottom: 10,
                flexWrap: "wrap",
              }}
            >
              {(isGold
                ? ["Serious buyers", "Operators", "Brokers"]
                : ["Buyers", "Sellers", "Brokers"]
              ).map((p, i) => (
                <span
                  key={p}
                  style={{
                    fontFamily: font,
                    fontSize: 10,
                    padding: "2px 7px",
                    borderRadius: 12,
                    background:
                      isGold || i === 0
                        ? "rgba(201,162,39,0.08)"
                        : "rgba(255,255,255,0.02)",
                    border: `1px solid ${
                      isGold || i === 0
                        ? "rgba(201,162,39,0.12)"
                        : "rgba(255,255,255,0.05)"
                    }`,
                    color:
                      isGold || i === 0 ? gold : "rgba(255,255,255,0.25)",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div style={{ padding: "0 16px 14px" }}>
            <div
              style={{
                background: isGold
                  ? "rgba(201,162,39,0.06)"
                  : "rgba(255,255,255,0.03)",
                borderRadius: 8,
                padding: "10px 12px",
                textAlign: "center",
                border: `1px solid ${
                  isGold
                    ? "rgba(201,162,39,0.12)"
                    : "rgba(255,255,255,0.06)"
                }`,
              }}
            >
              <div
                style={{
                  fontFamily: font,
                  fontSize: 13,
                  fontWeight: 600,
                  color: isGold ? gold : "rgba(255,255,255,0.6)",
                }}
              >
                {isGold
                  ? "15 sections + call · 48hrs"
                  : "10 sections · 48hrs"}
              </div>
              <div
                style={{
                  fontFamily: font,
                  fontSize: 11,
                  color: isGold
                    ? "rgba(201,162,39,0.4)"
                    : "rgba(255,255,255,0.3)",
                  marginTop: 2,
                }}
              >
                Get report →
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
