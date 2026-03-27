import { useState } from "react";

// ============================================================
// FCM REPORT SHOWCASE — Reports Page (/reports)
// Separated tiers with real report sections + buyer quotes
// Mini 3D collectible cards as CTAs
// Dark theme matching site aesthetic
// ============================================================

const T = {
  navy: "#0B1D3A",
  gold: "#c9a227",
  goldLight: "#d4b84a",
  white: "#FFFFFF",
  bg: "#000000",
  cardBg: "rgba(255,255,255,0.05)",
  darkText: "#FFFFFF",
  mutedText: "#888888",
  lightText: "#666666",
  greenText: "#2D8A56",
  redText: "#C0392B",
  amberText: "#D47735",
  heading: "'Inter', -apple-system, sans-serif",
  body: "'Inter', -apple-system, sans-serif",
};

const AUDIENCES = [
  {
    id: "buying", tab: "I'm buying",
    cards: [
      { q: "What the listing didn't say", a: <><strong style={{ color: T.gold }}>3,087 crime incidents</strong> in 12 months. We found it. You budget accordingly.</> },
      { q: "The opportunity nobody spotted", a: <>Halifax closes June 2025. <strong style={{ color: T.gold }}>Banking customers</strong> incoming.</> },
      { q: "What should you offer?", a: <><strong style={{ color: T.gold }}>Offer range</strong> + every question to ask.</> },
    ],
  },
  {
    id: "selling", tab: "I'm selling",
    cards: [
      { q: "See through a buyer's eyes", a: <>Scored across <strong style={{ color: T.gold }}>15 categories</strong>.</> },
      { q: "Fix weaknesses first", a: <><strong style={{ color: T.gold }}>0% response rate?</strong> Fix it before listing.</> },
      { q: "Justify your price", a: <><strong style={{ color: T.gold }}>Evidence-backed</strong> is harder to argue with.</> },
    ],
  },
  {
    id: "broker", tab: "I'm a broker",
    cards: [
      { q: "Know it before they ask", a: <><strong style={{ color: T.gold }}>15 verified sections</strong>. Confidence.</> },
      { q: "Accelerate decisions", a: <><strong style={{ color: T.gold }}>Hand them the report</strong>. Weeks to days.</> },
      { q: "Win the instruction", a: <><strong style={{ color: T.gold }}>Show them their business scored</strong>.</> },
    ],
  },
];

// ---- Report Section Card (dark navy) ----
function ReportSection({ label, score, grade, color, headline, detail, children }) {
  return (
    <div style={{ background: T.navy, borderRadius: 12, padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: 1.5 }}>{label}</span>
        {score != null && (
          <span>
            <span style={{ fontFamily: T.heading, fontSize: 20, fontWeight: 700, color }}>{score}</span>
            <span style={{ fontFamily: T.body, fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>{grade}</span>
          </span>
        )}
      </div>
      <div style={{ fontFamily: T.heading, fontSize: 15, fontWeight: 600, color: T.white, marginBottom: 6, lineHeight: 1.3 }}>{headline}</div>
      {detail && <div style={{ fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{detail}</div>}
      {children}
      {score != null && (
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
          <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 2 }} />
        </div>
      )}
    </div>
  );
}

// ---- Buyer Quote ----
function BuyerQuote({ color, text, attribution, outcome }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ borderLeft: `3px solid ${color}`, padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ fontFamily: T.heading, fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: 8 }}>"{text}"</div>
        <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.gold }}>{attribution}</div>
        {outcome && <div style={{ fontFamily: T.body, fontSize: 11, color: T.lightText }}>{outcome}</div>}
      </div>
    </div>
  );
}

// ---- Section + Quote Row ----
function SectionRow({ sectionFirst, sectionProps, quoteProps }) {
  const section = <ReportSection {...sectionProps} />;
  const quote = <BuyerQuote {...quoteProps} />;
  return (
    <div className="fcm-section-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
      {sectionFirst ? <>{section}{quote}</> : <>{quote}{section}</>}
    </div>
  );
}

// ---- Mini Collectible Card CTA ----
function MiniCard({ variant, href }) {
  const isGold = variant === "intelligence";

  return (
    <div style={{ maxWidth: 220, margin: "0 auto", perspective: 600 }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`fcm-mini-card ${isGold ? "fcm-mini-gold" : "fcm-mini-silver"}`}
        style={{
          display: "block", textDecoration: "none", position: "relative", borderRadius: 16, overflow: "hidden",
          background: isGold ? `linear-gradient(170deg, #0e2340, ${T.navy} 50%, #0d1f38)` : T.navy,
          border: isGold ? "1.5px solid rgba(201,162,39,0.2)" : "none",
          transform: isGold ? "rotateY(-3deg) rotateX(1deg)" : "rotateY(3deg) rotateX(1deg)",
          transition: "transform 0.5s cubic-bezier(0.2,0,0,1), box-shadow 0.5s",
          transformStyle: "preserve-3d", cursor: "pointer",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = isGold
            ? "rotateY(2deg) rotateX(-3deg) translateY(-8px) scale(1.03)"
            : "rotateY(-2deg) rotateX(-3deg) translateY(-8px) scale(1.03)";
          e.currentTarget.style.boxShadow = isGold
            ? "8px 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(201,162,39,0.06)"
            : "8px 20px 40px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = isGold ? "rotateY(-3deg) rotateX(1deg)" : "rotateY(3deg) rotateX(1deg)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* 3D depth layers */}
        <div style={{ position: "absolute", inset: 4, borderRadius: 16, background: "#060e1c", transform: "translateZ(-10px)", zIndex: -1 }} />
        <div style={{ position: "absolute", inset: 2, borderRadius: 16, background: "#081626", transform: "translateZ(-5px)", zIndex: -1 }} />
        {/* Holographic foil */}
        <div style={{
          position: "absolute", top: "-80%", left: "-80%", width: "260%", height: "260%",
          background: isGold
            ? "conic-gradient(from 90deg, transparent 0%, rgba(201,162,39,0.06) 6%, transparent 12%, rgba(201,162,39,0.04) 18%, transparent 24%, rgba(201,162,39,0.06) 30%, transparent 36%)"
            : "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.04) 8%, transparent 16%, rgba(255,255,255,0.02) 24%, transparent 32%, rgba(255,255,255,0.04) 40%, transparent 48%)",
          animation: `fcmHoloSpin ${isGold ? 6 : 10}s linear infinite`,
          pointerEvents: "none", zIndex: 1, opacity: isGold ? 0.6 : 0.5,
        }} />
        {/* Glass gloss */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none", zIndex: 10,
          background: isGold
            ? "linear-gradient(135deg, rgba(201,162,39,0.12) 0%, transparent 35%, transparent 60%, rgba(201,162,39,0.06) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.04) 100%)",
        }} />
        {/* Edge light */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none", zIndex: 11,
          border: isGold ? "1px solid rgba(201,162,39,0.15)" : "1.5px solid rgba(255,255,255,0.08)",
        }} />
        {/* Most popular badge */}
        {isGold && (
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 12,
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy,
            fontFamily: T.body, fontSize: 9, fontWeight: 600, padding: "3px 12px",
            borderRadius: "0 0 8px 8px", textTransform: "uppercase", letterSpacing: 1,
          }}>Most popular</div>
        )}
        {/* Card content */}
        <div style={{ position: "relative", zIndex: 8 }}>
          <div style={{ height: 2, background: isGold ? `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)` : "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
          <div style={{ padding: "16px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, color: isGold ? T.gold : "rgba(201,162,39,0.5)", textTransform: "uppercase", letterSpacing: 1.5 }}>FCM Intelligence</div>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              border: isGold ? "1px solid rgba(201,162,39,0.2)" : "1px solid rgba(255,255,255,0.08)",
              background: isGold ? "rgba(201,162,39,0.04)" : "rgba(255,255,255,0.02)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {isGold
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(201,162,39,0.6)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              }
            </div>
          </div>
          <div style={{ padding: "0 16px" }}>
            <div style={{ fontFamily: T.body, fontSize: 9, color: isGold ? "rgba(201,162,39,0.3)" : "rgba(255,255,255,0.15)", letterSpacing: 1, marginBottom: 6 }}>{isGold ? "PREMIUM SERIES" : "REPORT SERIES"}</div>
            <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{isGold ? "For negotiating" : "For deciding"}</div>
            <div style={{ fontFamily: T.heading, fontSize: 22, fontWeight: 700, color: T.white, marginBottom: 4 }}>{isGold ? "Intelligence" : "Insight"}</div>
            <div style={{ fontFamily: T.heading, fontSize: 32, fontWeight: 700, color: isGold ? T.gold : T.white, lineHeight: 1, marginBottom: 6 }}>{isGold ? "£499" : "£199"}</div>
            <div style={{ fontFamily: T.heading, fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.35)", lineHeight: 1.4, marginBottom: 10 }}>{isGold ? '"Power to control this deal."' : '"Should I risk my savings?"'}</div>
            <div style={{ display: "flex", gap: 3, marginBottom: 10, flexWrap: "wrap" }}>
              {(isGold ? ["Serious buyers", "Operators", "Brokers"] : ["Buyers", "Sellers", "Brokers"]).map((p, i) => (
                <span key={p} style={{
                  fontFamily: T.body, fontSize: 10, padding: "2px 7px", borderRadius: 12,
                  background: (isGold || i === 0) ? "rgba(201,162,39,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${(isGold || i === 0) ? "rgba(201,162,39,0.12)" : "rgba(255,255,255,0.05)"}`,
                  color: (isGold || i === 0) ? T.gold : "rgba(255,255,255,0.25)",
                }}>{p}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: "0 16px 14px" }}>
            <div style={{
              background: isGold ? "rgba(201,162,39,0.06)" : "rgba(255,255,255,0.03)",
              borderRadius: 8, padding: "10px 12px", textAlign: "center",
              border: `1px solid ${isGold ? "rgba(201,162,39,0.12)" : "rgba(255,255,255,0.06)"}`,
            }}>
              <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 600, color: isGold ? T.gold : "rgba(255,255,255,0.6)" }}>{isGold ? "15 sections + call · 48hrs" : "10 sections · 48hrs"}</div>
              <div style={{ fontFamily: T.body, fontSize: 11, color: isGold ? "rgba(201,162,39,0.4)" : "rgba(255,255,255,0.3)", marginTop: 2 }}>Get report →</div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ReportShowcase() {
  const [audience, setAudience] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const a = AUDIENCES[audience];

  return (
    <section style={{ maxWidth: 900, margin: "0 auto" }}>

      {/* HERO SECTION — Full viewport impact */}
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "80px 20px", textAlign: "center",
      }}>
        <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 4, marginBottom: 24 }}>Intelligence reports</div>
        <h1 className="fcm-hero-heading" style={{ fontFamily: T.heading, fontSize: 44, fontWeight: 700, color: T.white, lineHeight: 1.2, marginBottom: 20, maxWidth: 780 }}>
          The listing tells you what the seller <em style={{ color: T.gold, fontStyle: "italic" }}>wants</em> you to hear.<br />
          We tell you what you <em style={{ color: T.gold, fontStyle: "italic" }}>need</em> to know.
        </h1>
        <p style={{ fontFamily: T.body, fontSize: 18, color: T.mutedText, lineHeight: 1.7, marginBottom: 0, maxWidth: 560 }}>
          Whether you're buying, selling, or brokering — our reports change the conversation.
        </p>
      </div>

      {/* AUDIENCE TABS — Centered with own visual section */}
      <div style={{
        background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 20px", marginBottom: 44, display: "flex", justifyContent: "center",
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {AUDIENCES.map((au, i) => (
            <button key={au.id} onClick={() => { setAudience(i); setFadeKey(k => k + 1); }} style={{
              fontFamily: T.body, fontSize: 15, fontWeight: 600, padding: "12px 28px", borderRadius: 10,
              cursor: "pointer", transition: "all 0.3s",
              background: audience === i ? T.gold : "rgba(255,255,255,0.05)", color: audience === i ? "#000" : T.mutedText,
              border: `1px solid ${audience === i ? T.gold : "rgba(255,255,255,0.1)"}`,
              boxShadow: audience === i ? `0 4px 16px rgba(201,162,39,0.25)` : "none",
            }}>{au.tab}</button>
          ))}
        </div>
      </div>

      {/* AUDIENCE CARDS */}
      <div key={fadeKey} className="fcm-audience-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 44, padding: "0 20px", animation: "fcmFadeIn 0.4s ease" }}>
        {a.cards.map((c, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: T.heading, fontSize: 15, fontWeight: 600, color: T.white, marginBottom: 6 }}>{c.q}</div>
            <div style={{ fontFamily: T.body, fontSize: 13, color: T.mutedText, lineHeight: 1.5 }}>{c.a}</div>
          </div>
        ))}
      </div>

      {/* ===================== INSIGHT TIER ===================== */}
      <div style={{ border: `1px solid rgba(201,162,39,0.18)`, borderRadius: 20, padding: 24, margin: "0 20px 52px" }}>
      <div style={{ background: T.navy, borderRadius: 16, padding: "28px 32px", marginBottom: 18, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
        <div className="fcm-tier-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: "rgba(201,162,39,0.5)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>FCM Intelligence / Report series</div>
            <div style={{ fontFamily: T.heading, fontSize: 26, fontWeight: 700, color: T.white }}>Insight Report</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: T.heading, fontSize: 32, fontWeight: 700, color: T.white, lineHeight: 1 }}>£199</div>
            <div style={{ fontFamily: T.body, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>one-time</div>
          </div>
        </div>
        <div style={{ fontFamily: T.heading, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginTop: 10 }}>"Should I risk my savings on this?" — get the answer before you visit.</div>
      </div>

      <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.mutedText, textTransform: "uppercase", letterSpacing: 1.5, margin: "18px 0 16px" }}>10 sections — here's what they reveal</div>

      <SectionRow sectionFirst={true}
        sectionProps={{ label: "Crime & safety", score: 38, grade: "D", color: T.redText, headline: "3,087 incidents. 62% violent crime + ASB.", detail: "Budget £3,500-£5,000 for security on day one." }}
        quoteProps={{ color: T.redText, text: "The crime search helped me understand the risks with cash in transits. No parking means we were a sitting target. The owner had been robbed — that's why he was selling. Not for me.", attribution: "— FCM buyer, walked away", outcome: "Saved from a costly mistake" }}
      />
      <SectionRow sectionFirst={false}
        sectionProps={{ label: "Competition mapping", score: 82, grade: "A-", color: T.greenText, headline: "No competition within 1.5km. Crown branch, 21 services.", detail: "Halifax closure = confirmed banking pipeline." }}
        quoteProps={{ color: T.greenText, text: "Competition mapping showed the nearest PO was 1.5km with restricted hours. When Halifax closing was flagged, we knew banking footfall was ours. Offered 10% below asking and got it.", attribution: "— FCM buyer, purchased", outcome: "Saved £12,000" }}
      />
      <SectionRow sectionFirst={true}
        sectionProps={{ label: "Demographics", score: 72, grade: "B", color: T.gold, headline: "50% aged 50+. 70% deprived households.", detail: "Footfall is structural — pensions, bills, banking." }}
        quoteProps={{ color: T.gold, text: "The demographics showed pension-age residents who physically needed the Post Office. This wasn't a business — it was essential infrastructure. The footfall was guaranteed.", attribution: "— FCM buyer, purchased", outcome: "Now operates 3 branches" }}
      />
      <SectionRow sectionFirst={false}
        sectionProps={{ label: "Online presence", score: 35, grade: "D", color: T.amberText, headline: "3.1 stars, 73 reviews. 0% response rate.", detail: "Solvable with management focus from day one." }}
        quoteProps={{ color: T.amberText, text: "3.1 stars and zero response from the seller? That told me everything. If they don't care about reputation, what else are they ignoring? Gave me the ammunition to negotiate hard.", attribution: "— FCM buyer, negotiated 15% off" }}
      />

      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "16px 20px", marginBottom: 28, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color: T.mutedText, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Also included in every Insight report</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["Executive verdict", "PO remuneration", "Footfall analysis", "Location intelligence", "Infrastructure", "Risk assessment"].map(s => (
            <span key={s} style={{ fontFamily: T.body, fontSize: 13, color: T.mutedText, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: 3, background: T.greenText }} /> {s}
            </span>
          ))}
        </div>
      </div>

      <MiniCard variant="insight" href="https://buy.stripe.com/4gMcN4gMgez2bNHawL0Ba00" />
      <div style={{ fontFamily: T.body, fontSize: 12, color: T.lightText, textAlign: "center", marginTop: 10, marginBottom: 20 }}>Upgrade to Intelligence anytime for £300</div>
      </div>{/* Close Insight border wrapper */}

      {/* ===================== INTELLIGENCE TIER ===================== */}
      <div style={{ border: `2px solid rgba(201,162,39,0.35)`, borderRadius: 20, padding: 24, margin: "44px 20px 52px", boxShadow: "0 0 40px rgba(201,162,39,0.06)" }}>
      <div style={{ background: T.navy, borderRadius: 16, padding: "28px 32px", marginBottom: 18, position: "relative", overflow: "hidden", border: "1.5px solid rgba(201,162,39,0.2)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)` }} />
        <div style={{ position: "absolute", top: 3, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy, fontFamily: T.body, fontSize: 10, fontWeight: 600, padding: "3px 14px", borderRadius: "0 0 8px 8px", textTransform: "uppercase", letterSpacing: 1.5 }}>Most popular</div>
        <div className="fcm-tier-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
          <div>
            <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>FCM Intelligence / Premium series</div>
            <div style={{ fontFamily: T.heading, fontSize: 26, fontWeight: 700, color: T.white }}>Intelligence Report</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: T.heading, fontSize: 32, fontWeight: 700, color: T.gold, lineHeight: 1 }}>£499</div>
            <div style={{ fontFamily: T.body, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>one-time</div>
          </div>
        </div>
        <div style={{ fontFamily: T.heading, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginTop: 10 }}>"Give me the power to control this deal." — everything in Insight, plus the negotiation weapons.</div>
      </div>

      <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.mutedText, textTransform: "uppercase", letterSpacing: 1.5, margin: "18px 0 16px" }}>Intelligence-exclusive sections</div>

      <SectionRow sectionFirst={true}
        sectionProps={{
          label: "Due diligence pack", score: null, grade: null, color: T.gold, headline: "Every question. Every document.",
          children: (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontFamily: T.body, fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 5 }}>Seller questions include:</div>
              <div style={{ fontFamily: T.body, fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                "Full repairing lease or internal only?"<br/>"Last 24 months of income statements"<br/>"Total annual wage bill?"<br/>"Any compliance visits in 2 years?"
              </div>
            </div>
          ),
        }}
        quoteProps={{ color: T.gold, text: "I walked in holding 23 documents to request and 15 questions he wasn't expecting. His face said it all. We agreed £18,000 below asking that afternoon.", attribution: "— FCM Intelligence buyer", outcome: "Saved £18,000" }}
      />
      <SectionRow sectionFirst={false}
        sectionProps={{ label: "Future outlook", score: 76, grade: "B+", color: T.greenText, headline: "5-year outlook: planning, developments, trajectory.", detail: "Housing, population, PO network — everything affecting value." }}
        quoteProps={{ color: T.greenText, text: "The future outlook flagged 250 new homes 800m away. That wasn't in any listing. Combined with bank closure data, we projected 3 years of growth. That's what got the bank to approve our loan.", attribution: "— FCM Intelligence buyer", outcome: "Secured business loan first application" }}
      />
      <SectionRow sectionFirst={true}
        sectionProps={{
          label: "Profit improvement", score: null, grade: null, color: T.gold, headline: "Evidence-based actions with projected ROI.",
          children: (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
              {["Banking expansion: £8k-£12k/yr", "Parcel optimisation: £3k-£5k/yr", "Extended hours: £4k-£8k/yr"].map(r => (
                <div key={r} style={{ fontFamily: T.body, fontSize: 11, color: T.gold, background: "rgba(201,162,39,0.06)", borderRadius: 4, padding: "5px 8px" }}>{r}</div>
              ))}
            </div>
          ),
        }}
        quoteProps={{ color: T.gold, text: "6 actions worth £18,000 to £30,000 a year. We implemented 3 in the first month. Within 90 days revenue was up 22%. The report paid for itself ten times over.", attribution: "— FCM Intelligence buyer", outcome: "22% revenue increase in 90 days" }}
      />

      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "16px 20px", marginBottom: 28, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color: T.mutedText, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Also included in Intelligence</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["All 10 Insight sections", "Financial analysis", "Staffing costs", "Negotiation strategy", "60-min consultation"].map(s => (
            <span key={s} style={{ fontFamily: T.body, fontSize: 13, color: T.mutedText, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: 3, background: T.gold }} /> {s}
            </span>
          ))}
        </div>
      </div>

      <MiniCard variant="intelligence" href="https://buy.stripe.com/4gM00i8fK62wbNH48n0Ba01" />
      <div style={{ fontFamily: T.body, fontSize: 12, color: T.lightText, textAlign: "center", marginTop: 10 }}>The complete acquisition weapon</div>
      <div style={{ fontFamily: T.body, fontSize: 14, color: T.mutedText, textAlign: "center", marginTop: 18, marginBottom: 20 }}>
        Already bought Insight? Upgrade for <strong style={{ color: T.gold, fontWeight: 600 }}>£300</strong> — no new research needed.
      </div>
      </div>{/* Close Intelligence border wrapper */}

      {/* ---- BROKER ---- */}
      <div className="fcm-broker" style={{ background: T.navy, borderRadius: 14, padding: "28px 32px", display: "flex", alignItems: "center", gap: 24, margin: "0 20px 24px", border: "1px solid rgba(201,162,39,0.1)" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>For brokers & agents</div>
          <div style={{ fontFamily: T.heading, fontSize: 20, fontWeight: 700, color: T.white, marginBottom: 6 }}>Work with us</div>
          <div style={{ fontFamily: T.body, fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>More reports. More knowledge. Volume pricing, priority turnaround, white-label ready.</div>
        </div>
        <a href="mailto:brokers@fcmreport.com?subject=Broker%20Account%20Enquiry" style={{
          fontFamily: T.body, fontSize: 14, fontWeight: 600, color: T.gold, textDecoration: "none",
          border: "1px solid rgba(201,162,39,0.25)", padding: "14px 22px", borderRadius: 8, whiteSpace: "nowrap",
        }}>Broker account →</a>
      </div>

      {/* ---- TRUST ---- */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", paddingBottom: 70 }}>
        {[{ icon: "🏆", text: "15 years PO ops" }, { icon: "🏢", text: "40 branches" }, { icon: "📊", text: "200+ reports" }, { icon: "🇬🇧", text: "UK based" }].map((t, i) => (
          <span key={i} style={{ fontFamily: T.body, fontSize: 13, color: T.lightText, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15 }}>{t.icon}</span> {t.text}
          </span>
        ))}
      </div>

      {/* ---- ANIMATIONS + RESPONSIVE ---- */}
      <style>{`
        @keyframes fcmFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fcmHoloSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .fcm-audience-grid { grid-template-columns: 1fr !important; }
          .fcm-section-row { grid-template-columns: 1fr !important; }
          .fcm-tier-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .fcm-broker { flex-direction: column !important; text-align: center !important; }
          .fcm-hero-heading { font-size: 30px !important; }
        }
      `}</style>
    </section>
  );
}
