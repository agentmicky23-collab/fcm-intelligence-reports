import { useState, useEffect, useRef } from "react";

// ============================================================
// FCM REPORT SHOWCASE — Homepage Product Section
// Drop-in replacement for the old pricing/preview section
// Uses FCM design tokens. Real Fleetwood data. Three audiences.
// ============================================================

const T = {
  navy: "#0B1D3A",
  gold: "#BF9B51",
  goldLight: "#D4AF6A",
  white: "#FFFFFF",
  offWhite: "#F7F6F3",
  darkText: "#1A1A1A",
  mutedText: "#666666",
  lightText: "#999999",
  greenText: "#2D8A56",
  greenBg: "#E8F5E9",
  redText: "#C0392B",
  amberText: "#D47735",
  amberBg: "#FEF6E8",
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
};

function scoreColor(s) {
  if (s >= 85) return "#2D8A56";
  if (s >= 75) return "#3CA66B";
  if (s >= 65) return T.gold;
  if (s >= 55) return T.amberText;
  return T.redText;
}

// ============================================================
// ANIMATED SCORE RING
// ============================================================
function ScoreRingAnim({ score, grade, size = 72 }) {
  const [animScore, setAnimScore] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimScore(score); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [score]);

  const stroke = 3;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (animScore / 100) * circ;

  return (
    <div ref={ref} style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.gold} strokeWidth={stroke}
          strokeDasharray={`${progress} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dasharray 1.8s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: T.display, fontSize: size * 0.34, fontWeight: 700, color: T.gold, lineHeight: 1 }}>{animScore}</span>
        <span style={{ fontFamily: T.body, fontSize: size * 0.16, fontWeight: 600, color: T.white, lineHeight: 1, marginTop: 2 }}>{grade}</span>
      </div>
    </div>
  );
}

// ============================================================
// ANIMATED SCORE BAR
// ============================================================
function AnimBar({ label, score, grade }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setW(score); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [score]);

  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ fontFamily: T.body, fontSize: 10, color: "rgba(255,255,255,0.5)", width: 80, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3, background: scoreColor(score),
          width: `${w}%`, transition: "width 1.8s cubic-bezier(0.4,0,0.2,1)"
        }} />
      </div>
      <span style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, width: 18, textAlign: "right" }}>{score}</span>
      <span style={{ fontFamily: T.body, fontSize: 9, color: "rgba(255,255,255,0.4)", width: 20 }}>{grade}</span>
    </div>
  );
}

// ============================================================
// AUDIENCE TAB CONTENT
// ============================================================
const AUDIENCES = [
  {
    id: "buying",
    tab: "I'm buying",
    hook: <>You're about to invest <em style={{ color: T.gold, fontStyle: "italic" }}>your life savings</em>.<br/>Don't you want to know what you're buying?</>,
    sub: "Listings show turnover and asking price. We show you the 47 things they didn't mention.",
    cards: [
      { icon: "🚨", q: "What the listing didn't say", a: <><strong style={{color:T.gold}}>3,087 crime incidents</strong> in 12 months. We found it. We quantified the security cost. You budget £5k on day one — not discover it month three.</> },
      { icon: "🏦", q: "The opportunity nobody spotted", a: <>Halifax closes June 2025. <strong style={{color:T.gold}}>Displaced banking customers</strong> in a town with 70% deprived households. That's your confirmed footfall pipeline.</> },
      { icon: "💰", q: "What should you actually offer?", a: <>Our Intelligence report gives you a <strong style={{color:T.gold}}>suggested offer range</strong>, seller leverage analysis, and the exact questions to ask before you sign anything.</> },
    ],
  },
  {
    id: "selling",
    tab: "I'm selling",
    hook: <>Know what your business is <em style={{ color: T.gold, fontStyle: "italic" }}>really worth</em><br/>before a buyer tells you.</>,
    sub: "See your business through a buyer's eyes. Fix weaknesses before listing. Justify your price with data.",
    cards: [
      { icon: "🔍", q: "See through a buyer's eyes", a: <>Our report scores your business across <strong style={{color:T.gold}}>15 categories</strong>. Demographics, competition, crime, infrastructure — every factor a buyer will scrutinise.</> },
      { icon: "📈", q: "Fix weaknesses before you list", a: <><strong style={{color:T.gold}}>0% Google review response rate?</strong> That's dragging your valuation down. Our report tells you exactly what to fix and how much it'll add.</> },
      { icon: "🎯", q: "Justify your asking price", a: <>When a buyer challenges your price, hand them the report. <strong style={{color:T.gold}}>Evidence-backed analysis</strong> is harder to argue with than "I think it's worth that."</> },
    ],
  },
  {
    id: "broker",
    tab: "I'm a broker",
    hook: <>Close deals faster with intelligence<br/><em style={{ color: T.gold, fontStyle: "italic" }}>your competitors don't have.</em></>,
    sub: "Arm yourself with the same depth of analysis a serious buyer would commission. Know the property inside out.",
    cards: [
      { icon: "💼", q: "Know it before they ask", a: <>Demographics, competition, footfall, crime — <strong style={{color:T.gold}}>15 sections of verified data</strong>. Answer any buyer question with confidence, not guesswork.</> },
      { icon: "⚡", q: "Accelerate the decision", a: <>Buyers hesitate when uncertain. <strong style={{color:T.gold}}>Hand them an FCM report</strong> and compress their due diligence from weeks to days.</> },
      { icon: "🤝", q: "Win the instruction", a: <>Pitch the seller with intelligence they haven't seen. <strong style={{color:T.gold}}>Show them their own business scored</strong> against verified data. That's how you win over other brokers.</> },
    ],
  },
];

const CATEGORIES = [
  { label: "Competition", score: 82, grade: "A-" },
  { label: "Footfall", score: 78, grade: "B+" },
  { label: "Infrastructure", score: 76, grade: "B+" },
  { label: "Demographics", score: 72, grade: "B" },
  { label: "Future outlook", score: 76, grade: "B+" },
  { label: "Crime & safety", score: 38, grade: "D" },
];

const INSIGHT_SECTIONS = [
  "Executive summary & verdict",
  "PO remuneration analysis",
  "Online presence & reviews",
  "Location intelligence",
  "Demographics & community",
  "Crime & safety analysis",
  "Competition mapping",
  "Footfall analysis",
  "Infrastructure & connectivity",
  "Risk assessment",
];

const INTELLIGENCE_EXTRA = [
  "Financial analysis — what it's actually worth",
  "True staffing cost — the real number, not headline wage",
  "5-year future outlook — developments, trajectory",
  "Profit improvement plan — evidence-based with ROI",
  "Due diligence — every document, every question to ask",
  "Negotiation strategy — leverage + suggested offer range",
  "60-minute call — with an operator who's run 40+ branches",
];

// ============================================================
// MAIN EXPORT
// ============================================================
export default function ReportShowcase() {
  const [audience, setAudience] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  function switchAudience(i) {
    setAudience(i);
    setFadeKey(k => k + 1);
  }

  const a = AUDIENCES[audience];

  return (
    <section style={{ padding: "0 0 60px" }}>
      {/* ---- DARK STAGE ---- */}
      <div style={{ background: T.navy, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)` }} />

        {/* OPENER */}
        <div style={{ padding: "52px 40px 0", textAlign: "center" }}>
          <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 4, marginBottom: 16 }}>
            FCM Intelligence Reports
          </div>
          <h2 style={{ fontFamily: T.display, fontSize: 30, fontWeight: 600, color: T.white, lineHeight: 1.2, marginBottom: 12 }}>
            The listing tells you what the seller <em style={{ color: T.gold, fontStyle: "italic" }}>wants</em> you to hear.<br />
            We tell you what you <em style={{ color: T.gold, fontStyle: "italic" }}>need</em> to know.
          </h2>
          <p style={{ fontFamily: T.body, fontSize: 14, color: "rgba(255,255,255,0.45)", maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.7 }}>
            15 sections of verified intelligence. Every claim sourced. Every risk quantified.
            Every opportunity evidenced. Whether you're buying, selling, or brokering — this changes the conversation.
          </p>
        </div>

        {/* AUDIENCE TABS */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "0 40px 32px" }}>
          {AUDIENCES.map((au, i) => (
            <button key={au.id} onClick={() => switchAudience(i)} style={{
              fontFamily: T.body, fontSize: 13, fontWeight: 500, padding: "10px 28px",
              background: audience === i ? "rgba(191,155,81,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${audience === i ? "rgba(191,155,81,0.3)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 8, color: audience === i ? T.gold : "rgba(255,255,255,0.45)",
              cursor: "pointer", transition: "all 0.3s",
            }}>{au.tab}</button>
          ))}
        </div>

        {/* AUDIENCE CONTENT */}
        <div key={fadeKey} style={{ padding: "0 40px", animation: "fcmFadeIn 0.5s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 500, color: T.white, lineHeight: 1.35 }}>{a.hook}</div>
          </div>
          <p style={{ fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 28, lineHeight: 1.6 }}>{a.sub}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
            {a.cards.map((c, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: 20, transition: "all 0.3s", cursor: "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(191,155,81,0.2)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: 22, display: "block", marginBottom: 10 }}>{c.icon}</span>
                <div style={{ fontFamily: T.display, fontSize: 14, fontWeight: 500, color: T.white, marginBottom: 8, lineHeight: 1.35 }}>{c.q}</div>
                <div style={{ fontFamily: T.body, fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{c.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BROWSER WINDOW — REAL REPORT */}
        <div style={{ margin: "0 40px 28px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
          {/* Browser chrome */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: "#ff5f57" }} />
            <div style={{ width: 8, height: 8, borderRadius: 4, background: "#ffbd2e" }} />
            <div style={{ width: 8, height: 8, borderRadius: 4, background: "#28c840" }} />
            <span style={{ fontFamily: T.body, fontSize: 10, color: "rgba(255,255,255,0.25)", marginLeft: 10 }}>fcmreport.com/report/2026-03-26-FLEETWOOD</span>
          </div>

          {/* Report content */}
          <div style={{ padding: 24, display: "flex", gap: 24 }}>
            {/* Left column */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>FCM Intelligence</div>
              <div style={{ fontFamily: T.display, fontSize: 17, fontWeight: 600, color: T.white, marginBottom: 3 }}>Fleetwood Post Office</div>
              <div style={{ fontFamily: T.body, fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>204-206 Lord Street, Fleetwood, Lancashire FY7 6SW</div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <ScoreRingAnim score={75} grade="B+" size={52} />
                <div>
                  <div style={{ fontFamily: T.display, fontSize: 13, color: T.gold }}>Proceed with confidence</div>
                  <div style={{ fontFamily: T.body, fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Captive market with structural demand</div>
                </div>
              </div>

              {CATEGORIES.map((c, i) => <AnimBar key={i} label={c.label} score={c.score} grade={c.grade} />)}

              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 9, padding: "8px 10px", borderRadius: 6, background: "rgba(45,138,86,0.08)", borderLeft: `2px solid ${T.greenText}`, color: "rgba(255,255,255,0.6)", marginBottom: 5, lineHeight: 1.4 }}>
                  <strong style={{ color: T.white, fontWeight: 500 }}>Halifax closes Jun 2025</strong> — displaced banking customers have nowhere else to go
                </div>
                <div style={{ fontSize: 9, padding: "8px 10px", borderRadius: 6, background: "rgba(212,119,53,0.08)", borderLeft: `2px solid ${T.amberText}`, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
                  <strong style={{ color: T.white, fontWeight: 500 }}>3,087 crime incidents</strong> — budget £5k security. Known cost, not unknown risk.
                </div>
              </div>

              <div style={{ borderLeft: `2px solid ${T.gold}`, padding: "8px 12px", marginTop: 14 }}>
                <p style={{ fontFamily: T.display, fontSize: 9, fontStyle: "italic", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
                  "Fleetwood doesn't need convincing to use its Post Office — it depends on it."
                </p>
              </div>
            </div>

            {/* Right column — stat cards + locked tease */}
            <div style={{ width: 190, flexShrink: 0 }}>
              {[
                { label: "Catchment (3km)", val: "~26,000", sub: "50% aged 50+, 12pts above avg" },
                { label: "Competition moat", val: "1.5km", sub: "Nearest PO has restricted hours" },
                { label: "PO remuneration", val: "A-", sub: "Crown branch premium profile" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 14, marginBottom: 8 }}>
                  <div style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, color: T.white, marginBottom: 2 }}>{s.val}</div>
                  <div style={{ fontFamily: T.body, fontSize: 9, color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{s.sub}</div>
                </div>
              ))}

              {/* Locked intelligence tease */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 8, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 18, opacity: 0.5, marginBottom: 6 }}>🔒</div>
                <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.35)", marginBottom: 8, lineHeight: 1.4 }}>Intelligence tier unlocks</div>
                <div style={{ fontFamily: T.body, fontSize: 8, color: "rgba(255,255,255,0.25)", lineHeight: 1.7 }}>
                  <strong style={{ color: T.gold, fontWeight: 600 }}>£18k–£30k</strong> profit uplift<br/>
                  <strong style={{ color: T.gold, fontWeight: 600 }}>Offer range</strong> calculated<br/>
                  <strong style={{ color: T.gold, fontWeight: 600 }}>23</strong> due diligence docs<br/>
                  <strong style={{ color: T.gold, fontWeight: 600 }}>Negotiation</strong> strategy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAMPLE REPORT LINK */}
        <div style={{ textAlign: "center", padding: "0 0 8px" }}>
          <a href="/report/2026-03-26-FLEETWOOD" style={{
            fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.gold,
            textDecoration: "none", border: `1px solid rgba(191,155,81,0.25)`,
            padding: "10px 28px", borderRadius: 8, display: "inline-block",
            transition: "all 0.2s",
          }}>
            Explore the full Fleetwood report →
          </a>
        </div>

        {/* DIVIDER */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "28px 40px 0" }} />

        {/* ---- 3D COLLECTIBLE PRODUCT CARDS ---- */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, padding: "36px 40px 0", perspective: 800 }}>

          {/* INSIGHT CARD */}
          <div style={{ perspective: 800 }}>
            <div
              className="fcm-card-insight"
              style={{
                position: "relative", borderRadius: 20, overflow: "visible",
                transformStyle: "preserve-3d", transition: "transform 0.6s cubic-bezier(0.2,0,0,1), box-shadow 0.6s ease",
                transform: "rotateY(3deg) rotateX(1deg)", cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "rotateY(-2deg) rotateX(-3deg) translateY(-12px) scale(1.02)"; e.currentTarget.style.boxShadow = "12px 24px 48px rgba(0,0,0,0.5), -4px -4px 20px rgba(255,255,255,0.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "rotateY(3deg) rotateX(1deg)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* 3D depth layers */}
              <div style={{ position: "absolute", inset: 4, borderRadius: 20, background: "#060e1c", transform: "translateZ(-12px)", zIndex: -1 }} />
              <div style={{ position: "absolute", inset: 2, borderRadius: 20, background: "#081626", transform: "translateZ(-6px)", zIndex: -1 }} />

              <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: T.navy }}>
                {/* Holographic rotating foil */}
                <div style={{
                  position: "absolute", top: "-80%", left: "-80%", width: "260%", height: "260%",
                  background: "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.04) 8%, transparent 16%, rgba(255,255,255,0.02) 24%, transparent 32%, rgba(255,255,255,0.04) 40%, transparent 48%, rgba(255,255,255,0.02) 56%, transparent 64%, rgba(255,255,255,0.03) 72%, transparent 80%, rgba(255,255,255,0.04) 88%, transparent 100%)",
                  animation: "fcmHoloSpin 10s linear infinite", pointerEvents: "none", zIndex: 1, opacity: 0.6,
                }} />
                {/* Glass gloss */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none", zIndex: 10,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 25%, transparent 50%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.06) 100%)",
                }} />
                {/* Edge light */}
                <div style={{ position: "absolute", inset: 0, borderRadius: 20, border: "1.5px solid rgba(255,255,255,0.08)", pointerEvents: "none", zIndex: 11 }} />

                {/* Card content */}
                <div style={{ position: "relative", zIndex: 8 }}>
                  <div style={{ height: 3, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />

                  <div style={{ padding: "28px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, color: "rgba(191,155,81,0.5)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 3 }}>FCM Intelligence</div>
                      <div style={{ fontFamily: T.body, fontSize: 8, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>REPORT SERIES</div>
                    </div>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(191,155,81,0.6)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                  </div>

                  <div style={{ padding: "16px 24px 0" }}>
                    <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 3, marginBottom: 6 }}>For deciding</div>
                    <div style={{ fontFamily: T.display, fontSize: 30, fontWeight: 700, color: T.white, letterSpacing: -0.5, marginBottom: 6 }}>Insight</div>
                    <div style={{ fontFamily: T.display, fontSize: 46, fontWeight: 700, color: T.white, lineHeight: 1, marginBottom: 12 }}>£199</div>
                    <div style={{ fontFamily: T.display, fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.4)", lineHeight: 1.55, marginBottom: 18 }}>
                      "Should I risk my savings on this?"<br/>Get the answer before you visit.
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
                      {[{ t: "Buyers", gold: true }, { t: "Sellers", gold: false }, { t: "Brokers", gold: false }].map(p => (
                        <span key={p.t} style={{
                          fontFamily: T.body, fontSize: 10, padding: "4px 11px", borderRadius: 20,
                          background: p.gold ? "rgba(191,155,81,0.08)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${p.gold ? "rgba(191,155,81,0.15)" : "rgba(255,255,255,0.06)"}`,
                          color: p.gold ? T.gold : "rgba(255,255,255,0.3)",
                        }}>{p.t}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: "0 24px" }}>
                    <div style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>10 sections of verified intelligence</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                      {[
                        { t: "Verdict & score", s: "Graded A to F" },
                        { t: "PO remuneration", s: "Income breakdown" },
                        { t: "Competition map", s: "Every PO & threat" },
                        { t: "Crime & security", s: "12-month + budget" },
                        { t: "Demographics", s: "Catchment profiled" },
                        { t: "+ 4 more sections", s: "Location, reviews, infra, risk" },
                      ].map((item, i) => (
                        <div key={i} style={{ background: "rgba(45,138,86,0.06)", borderRadius: 7, padding: "8px 10px", borderLeft: "2px solid rgba(45,138,86,0.45)" }}>
                          <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.8)", lineHeight: 1.3 }}>{item.t}</div>
                          <div style={{ fontFamily: T.body, fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{item.s}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 4, opacity: 0.3 }}>
                      {[{ t: "Financials" }, { t: "Negotiation" }].map((item, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.01)", borderRadius: 7, padding: "8px 10px", borderLeft: "2px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{item.t}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: "16px 24px 22px" }}>
                    <a href="https://buy.stripe.com/4gMcN4gMgez2bNHawL0Ba00" target="_blank" rel="noopener noreferrer" style={{
                      display: "block", width: "100%", padding: 15, fontFamily: T.body, fontSize: 14, fontWeight: 600,
                      borderRadius: 12, textAlign: "center", textDecoration: "none", transition: "all 0.3s",
                      color: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)",
                    }}>Get Insight — £199</a>
                    <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 8 }}>Upgrade to Intelligence anytime +£300</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INTELLIGENCE CARD */}
          <div style={{ perspective: 800 }}>
            <div
              className="fcm-card-intelligence"
              style={{
                position: "relative", borderRadius: 20, overflow: "visible",
                transformStyle: "preserve-3d", transition: "transform 0.6s cubic-bezier(0.2,0,0,1), box-shadow 0.6s ease",
                transform: "rotateY(-3deg) rotateX(1deg)", cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "rotateY(2deg) rotateX(-3deg) translateY(-12px) scale(1.02)"; e.currentTarget.style.boxShadow = "12px 24px 48px rgba(0,0,0,0.5), -4px -4px 20px rgba(191,155,81,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "rotateY(-3deg) rotateX(1deg)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* 3D depth layers */}
              <div style={{ position: "absolute", inset: 4, borderRadius: 20, background: "#060e1c", transform: "translateZ(-12px)", zIndex: -1 }} />
              <div style={{ position: "absolute", inset: 2, borderRadius: 20, background: "#081626", transform: "translateZ(-6px)", zIndex: -1 }} />

              <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: `linear-gradient(170deg, #0e2340 0%, ${T.navy} 50%, #0d1f38 100%)` }}>
                {/* Gold holographic foil */}
                <div style={{
                  position: "absolute", top: "-80%", left: "-80%", width: "260%", height: "260%",
                  background: "conic-gradient(from 90deg, transparent 0%, rgba(191,155,81,0.06) 6%, transparent 12%, rgba(191,155,81,0.04) 18%, transparent 24%, rgba(191,155,81,0.06) 30%, transparent 36%, rgba(191,155,81,0.04) 42%, transparent 48%, rgba(191,155,81,0.06) 54%, transparent 60%, rgba(191,155,81,0.04) 66%, transparent 72%, rgba(191,155,81,0.06) 78%, transparent 84%, rgba(191,155,81,0.04) 90%, transparent 100%)",
                  animation: "fcmHoloSpin 6s linear infinite", pointerEvents: "none", zIndex: 1, opacity: 0.6,
                }} />
                {/* Gold glass gloss */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none", zIndex: 10,
                  background: "linear-gradient(135deg, rgba(191,155,81,0.15) 0%, rgba(191,155,81,0.04) 25%, transparent 50%, rgba(191,155,81,0.03) 75%, rgba(191,155,81,0.08) 100%)",
                }} />
                {/* Gold edge light */}
                <div style={{ position: "absolute", inset: 0, borderRadius: 20, border: "1.5px solid rgba(191,155,81,0.2)", pointerEvents: "none", zIndex: 11 }} />

                {/* Most popular badge */}
                <div style={{
                  position: "absolute", top: 3, left: "50%", transform: "translateX(-50%)", zIndex: 12,
                  background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.navy,
                  fontFamily: T.body, fontSize: 9, fontWeight: 600, padding: "5px 20px",
                  borderRadius: "0 0 12px 12px", textTransform: "uppercase", letterSpacing: 1.5, whiteSpace: "nowrap",
                }}>Most popular</div>

                {/* Card content */}
                <div style={{ position: "relative", zIndex: 8 }}>
                  <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)` }} />

                  <div style={{ padding: "28px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 3 }}>FCM Intelligence</div>
                      <div style={{ fontFamily: T.body, fontSize: 8, color: "rgba(191,155,81,0.3)", letterSpacing: 1 }}>PREMIUM SERIES</div>
                    </div>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid rgba(191,155,81,0.25)", background: "rgba(191,155,81,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                  </div>

                  <div style={{ padding: "16px 24px 0" }}>
                    <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 3, marginBottom: 6 }}>For negotiating</div>
                    <div style={{ fontFamily: T.display, fontSize: 30, fontWeight: 700, color: T.white, letterSpacing: -0.5, marginBottom: 6 }}>Intelligence</div>
                    <div style={{ fontFamily: T.display, fontSize: 46, fontWeight: 700, color: T.gold, lineHeight: 1, marginBottom: 12 }}>£499</div>
                    <div style={{ fontFamily: T.display, fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.4)", lineHeight: 1.55, marginBottom: 18 }}>
                      "Give me the power to control this deal."<br/>Walk in knowing more than the seller.
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
                      {["Serious buyers", "Portfolio operators", "Brokers"].map(t => (
                        <span key={t} style={{
                          fontFamily: T.body, fontSize: 10, padding: "4px 11px", borderRadius: 20,
                          background: "rgba(191,155,81,0.08)", border: "1px solid rgba(191,155,81,0.18)", color: T.gold,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: "0 24px" }}>
                    <div style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, color: "rgba(191,155,81,0.3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>All 15 sections — the complete weapon</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                      {[
                        { t: "All Insight sections", s: "10 sections included", gold: false },
                        { t: "Financial analysis", s: "What it's actually worth", gold: true },
                        { t: "Negotiation strategy", s: "Leverage + offer range", gold: true },
                        { t: "Profit improvement", s: "Actions with £ ROI", gold: true },
                        { t: "Due diligence pack", s: "23 docs + every question", gold: true },
                        { t: "60-min consultation", s: "40+ branch operator", gold: true },
                      ].map((item, i) => (
                        <div key={i} style={{
                          background: item.gold ? "rgba(191,155,81,0.06)" : "rgba(45,138,86,0.06)",
                          borderRadius: 7, padding: "8px 10px",
                          borderLeft: `2px solid ${item.gold ? "rgba(191,155,81,0.45)" : "rgba(45,138,86,0.45)"}`,
                        }}>
                          <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 500, color: item.gold ? T.gold : "rgba(255,255,255,0.8)", lineHeight: 1.3 }}>{item.t}</div>
                          <div style={{ fontFamily: T.body, fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{item.s}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: "16px 24px 22px" }}>
                    <a href="https://buy.stripe.com/4gM00i8fK62wbNH48n0Ba01" target="_blank" rel="noopener noreferrer" style={{
                      display: "block", width: "100%", padding: 15, fontFamily: T.body, fontSize: 14, fontWeight: 600,
                      borderRadius: 12, textAlign: "center", textDecoration: "none", transition: "all 0.3s",
                      color: T.navy, background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight}, ${T.gold})`,
                      backgroundSize: "200% 200%", animation: "fcmGoldShimmer 3s ease infinite",
                    }}>Get Intelligence — £499</a>
                    <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(191,155,81,0.35)", textAlign: "center", marginTop: 8 }}>The complete acquisition weapon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UPGRADE NOTE */}
        <div style={{ textAlign: "center", padding: "24px 40px 32px" }}>
          <p style={{ fontFamily: T.body, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            Already bought Insight? Upgrade to Intelligence for <strong style={{ color: T.gold, fontWeight: 600 }}>£300</strong> — no new research needed. All 15 sections already generated.
          </p>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 24 }}>
        {[
          { icon: "🏆", text: "15 years PO operations" },
          { icon: "🏢", text: "40 branches operated" },
          { icon: "📊", text: "200+ reports delivered" },
          { icon: "🇬🇧", text: "UK based team" },
        ].map((t, i) => (
          <div key={i} style={{ fontFamily: T.body, fontSize: 12, color: T.mutedText, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>{t.icon}</span> {t.text}
          </div>
        ))}
      </div>

      {/* BROKER — WORK WITH US */}
      <div style={{
        marginTop: 40, background: T.navy, borderRadius: 16, overflow: "hidden",
        border: `1px solid rgba(191,155,81,0.15)`, position: "relative",
      }}>
        <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)` }} />
        <div style={{ padding: "40px 48px", display: "flex", alignItems: "center", gap: 40 }}>
          {/* Left side — icon + text */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                border: `1.5px solid rgba(191,155,81,0.25)`, background: "rgba(191,155,81,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: 2.5 }}>For brokers & agents</div>
                <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, color: T.white, marginTop: 2 }}>Work with us</div>
              </div>
            </div>
            <div style={{ fontFamily: T.display, fontSize: 16, fontStyle: "italic", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 16 }}>
              More reports. More knowledge. Close deals faster.
            </div>
            <div style={{ fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 480 }}>
              Open a broker account and get volume pricing on FCM Intelligence reports. 
              Arm yourself with the same depth of analysis your buyers will commission — 
              know every property inside out before the first viewing. Win more instructions. 
              Close more deals.
            </div>
          </div>

          {/* Right side — benefits + CTA */}
          <div style={{ width: 280, flexShrink: 0 }}>
            <div style={{ marginBottom: 20 }}>
              {[
                { label: "Volume pricing", detail: "Discounted rates on multiple reports" },
                { label: "Priority turnaround", detail: "Reports delivered within 24 hours" },
                { label: "White-label ready", detail: "Present intelligence under your brand" },
              ].map((b, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: 3, background: T.gold,
                    marginTop: 6, flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.white }}>{b.label}</div>
                    <div style={{ fontFamily: T.body, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{b.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="mailto:brokers@fcmreport.com?subject=Broker%20Account%20Enquiry" style={{
              display: "block", width: "100%", padding: 14, fontFamily: T.body, fontSize: 13, fontWeight: 600,
              borderRadius: 10, textAlign: "center", textDecoration: "none", transition: "all 0.3s",
              color: T.gold, border: `1.5px solid rgba(191,155,81,0.3)`, background: "rgba(191,155,81,0.04)",
            }}>
              Open a broker account — email for details
            </a>
            <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 8 }}>
              brokers@fcmreport.com
            </div>
          </div>
        </div>
      </div>

      {/* KEYFRAME ANIMATIONS */}
      <style>{`
        @keyframes fcmFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fcmHoloSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fcmGoldShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </section>
  );
}
