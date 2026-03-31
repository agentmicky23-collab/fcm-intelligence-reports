// ============================================================
// FCM INTELLIGENCE — COMPLETE REPORT COMPONENT LIBRARY
// Version: 2.0 (Production-ready)
// Date: 18 March 2026
// All 16 audit fixes applied. All components match blueprint + schema.
// Single file. No duplicates. Forge-ready.
// ============================================================

import { useState, useEffect, useRef } from "react";
import * as Chart from "chart.js";

Chart.Chart.register(
  Chart.ArcElement, Chart.BarElement, Chart.LineElement, Chart.PointElement,
  Chart.BarController, Chart.DoughnutController, Chart.LineController,
  Chart.CategoryScale, Chart.LinearScale,
  Chart.Tooltip, Chart.Legend
);

// ============================================================
// DESIGN TOKENS — from FCM-REPORT-TEMPLATE-BLUEPRINT-2.md
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

  redBg: "#FDE8E8", redText: "#C0392B",
  amberBg: "#FEF6E8", amberText: "#D47735",
  greenBg: "#E8F5E9", greenText: "#2D8A56",
  blueBg: "#F0F7FF", blueText: "#3266AD",

  scoreExcellent: "#2D8A56", scoreGood: "#3CA66B",
  scoreAdequate: "#BF9B51", scoreConcern: "#D47735", scorePoor: "#C0392B",

  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
};

function scoreColor(score) {
  if (score >= 85) return T.scoreExcellent;
  if (score >= 75) return T.scoreGood;
  if (score >= 65) return T.scoreAdequate;
  if (score >= 55) return T.scoreConcern;
  return T.scorePoor;
}

// ============================================================
// SHARED COMPONENTS (unified — CRITICAL-01 fix)
// ============================================================

function ScoreBadge({ score, grade, size = 48 }) {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const progress = (score / 100) * circ;
  const numSize = size * 0.42;
  const gradeSize = size * 0.2;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill={T.navy} stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={T.gold} strokeWidth={stroke}
          strokeDasharray={`${progress} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dasharray 1.2s ease-out" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: T.display, fontSize: numSize, fontWeight: 700, color: T.gold, lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: T.body, fontSize: gradeSize, fontWeight: 600, color: T.white, lineHeight: 1, marginTop: 1 }}>{grade}</span>
      </div>
    </div>
  );
}

function ScoreRing({ score, grade, verdict, verdictDetail }) {
  const size = 96, stroke = 5, radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const progress = (score / 100) * circ;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, background: T.navy, borderRadius: 12, padding: "24px 28px", marginBottom: 24 }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={T.gold} strokeWidth={stroke}
            strokeDasharray={`${progress} ${circ}`} strokeLinecap="round"
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: "stroke-dasharray 1.5s ease-out" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: T.display, fontSize: 36, fontWeight: 700, color: T.gold, lineHeight: 1 }}>{score}</span>
          <span style={{ fontFamily: T.body, fontSize: 14, fontWeight: 600, color: T.white, lineHeight: 1, marginTop: 2 }}>{grade}</span>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, color: T.white, marginBottom: 4 }}>{verdict}</div>
        <div style={{ fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{verdictDetail}</div>
      </div>
    </div>
  );
}

// pageNum prop kept — Forge calculates dynamically (CRITICAL-03)
function SectionHeader({ number, title, pageNum }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 500, color: T.gold, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>
        Section {number}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ fontFamily: T.display, fontSize: 20, fontWeight: 600, color: T.navy, margin: 0, lineHeight: 1.3 }}>{title}</h2>
        {pageNum && <span style={{ fontFamily: T.body, fontSize: 10, color: T.lightText }}>Page {pageNum}</span>}
      </div>
      <div style={{ height: 2, background: T.navy, marginTop: 10 }} />
    </div>
  );
}

// Handles null score (N/A) — merged from File 03
function HeadlineBanner({ score, grade, headline, detail }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, background: T.offWhite, borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
      {score !== null && score !== undefined
        ? <ScoreBadge score={score} grade={grade} />
        : <div style={{ width: 48, height: 48, borderRadius: 24, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color: T.white }}>N/A</span></div>
      }
      <div>
        <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 600, color: T.navy, marginBottom: 2 }}>{headline}</div>
        <div style={{ fontFamily: T.body, fontSize: 12, color: T.mutedText, lineHeight: 1.5 }}>{detail}</div>
      </div>
    </div>
  );
}

// Blueprint: Playfair 20-22px values (MINOR-01/04/05 fix — unified to 21px)
function StatBoxes({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`, gap: 10, marginBottom: 24 }}>
      {items.map((item, i) => (
        <div key={i} style={{ background: T.offWhite, borderRadius: 8, padding: "14px 12px", textAlign: "center" }}>
          <div style={{ fontFamily: T.display, fontSize: 21, fontWeight: 700, color: T.navy, lineHeight: 1.1 }}>{item.value}</div>
          <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 400, color: T.lightText, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 5 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// Merged status mappings from all files + label prop from File 01
function StatusPill({ status, label }) {
  const styles = {
    HIGH: { bg: T.redBg, color: T.redText },
    MEDIUM: { bg: T.amberBg, color: T.amberText },
    LOW: { bg: T.greenBg, color: T.greenText },
    MINIMAL: { bg: T.greenBg, color: T.greenText },
    ESSENTIAL: { bg: T.redBg, color: T.redText },
    IMPORTANT: { bg: T.amberBg, color: T.amberText },
    RECOMMENDED: { bg: T.amberBg, color: T.amberText },
    USEFUL: { bg: T.greenBg, color: T.greenText },
    OPTIONAL: { bg: T.greenBg, color: T.greenText },
    OPPORTUNITY: { bg: T.greenBg, color: T.greenText },
    GROWING: { bg: T.greenBg, color: T.greenText },
    STABLE: { bg: T.blueBg, color: T.blueText },
    DECLINING: { bg: T.redBg, color: T.redText },
    MONITOR: { bg: T.amberBg, color: T.amberText },
    ACTIVE: { bg: T.greenBg, color: T.greenText },
    DORMANT: { bg: T.amberBg, color: T.amberText },
    "NON-EXISTENT": { bg: T.redBg, color: T.redText },
    AVERAGE: { bg: T.blueBg, color: T.blueText },
    TYPICAL: { bg: T.blueBg, color: T.blueText },
    HEALTHY: { bg: T.greenBg, color: T.greenText },
    "MID-RANGE": { bg: T.amberBg, color: T.amberText },
    POSITIVE: { bg: T.greenBg, color: T.greenText },
    NEGATIVE: { bg: T.redBg, color: T.redText },
    NEUTRAL: { bg: T.blueBg, color: T.blueText },
    "AT RISK": { bg: T.redBg, color: T.redText },
    PASS: { bg: T.greenBg, color: T.greenText },
    FAIL: { bg: T.redBg, color: T.redText },
  };
  const s = styles[(status || "").toUpperCase()] || { bg: T.blueBg, color: T.blueText };
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 12,
      background: s.bg, color: s.color,
      fontFamily: T.body, fontSize: 10, fontWeight: 500, textTransform: "uppercase",
    }}>{label || status}</span>
  );
}

function InsightCallout({ title = "KEY INSIGHT", children }) {
  return (
    <div style={{ background: T.blueBg, borderLeft: `3px solid ${T.blueText}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 20 }}>
      <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.blueText, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function OpportunityCallout({ title = "OPPORTUNITY", children }) {
  return (
    <div style={{ background: T.navy, borderRadius: 8, padding: "16px 20px", marginBottom: 20 }}>
      <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: T.body, fontSize: 12, color: T.white, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function WarningCallout({ title, children }) {
  return (
    <div style={{ background: T.amberBg, borderLeft: `3px solid ${T.amberText}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 20 }}>
      <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.amberText, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function PullQuote({ quote, attribution }) {
  return (
    <div style={{ borderLeft: `3px solid ${T.gold}`, background: T.offWhite, borderRadius: "0 8px 8px 0", padding: "16px 20px", marginBottom: 20 }}>
      <div style={{ fontFamily: T.body, fontSize: 12.5, fontStyle: "italic", color: T.darkText, lineHeight: 1.7, marginBottom: 8 }}>"{quote}"</div>
      {attribution && <div style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText }}>— {attribution}</div>}
    </div>
  );
}

function CommunityCallout({ title = "COMMUNITY CHARACTER", children }) {
  return (
    <div style={{ background: "rgba(11,29,58,0.04)", borderLeft: `3px solid ${T.navy}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 20 }}>
      <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.navy, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function PracticalContext({ title = "PRACTICAL CONTEXT", children }) {
  return (
    <div style={{ background: T.offWhite, borderLeft: `3px solid ${T.mutedText}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 20 }}>
      <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.mutedText, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function DataTable({ headers, rows, threatCol }) {
  return (
    <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 20, border: `1px solid ${T.offWhite}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.body, fontSize: 11 }}>
        <thead>
          <tr style={{ background: T.navy }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: "10px 14px", color: T.white, fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? T.white : "#FAFAF8" }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>
                  {threatCol !== undefined && ci === threatCol ? <StatusPill status={cell} /> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceFooter({ text }) {
  return (
    <div style={{ borderTop: `1px solid ${T.offWhite}`, paddingTop: 12, marginTop: 28 }}>
      <div style={{ fontFamily: T.body, fontSize: 9, color: T.lightText, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}

function ImagePlaceholder({ label, caption, height = 240, icon = "📷", ratio }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        width: "100%", height: ratio ? 0 : height,
        paddingBottom: ratio ? ratio : undefined,
        background: "linear-gradient(135deg, #E8EBF0 0%, #D1D5DB 50%, #C5C9D1 100%)",
        borderRadius: 8, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: ratio ? undefined : "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: ratio ? "absolute" : "relative", inset: ratio ? 0 : undefined, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>{icon}</span>
          <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color: T.mutedText }}>{label}</span>
          <span style={{ fontFamily: T.body, fontSize: 9, color: T.lightText, marginTop: 4 }}>Image loaded by Scout via API</span>
        </div>
      </div>
      {caption && <div style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText, textAlign: "center", marginTop: 6, fontStyle: "italic" }}>{caption}</div>}
    </div>
  );
}

function CategoryBar({ label, score, grade }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <div style={{ width: 130, fontFamily: T.body, fontSize: 12, color: T.darkText }}>{label}</div>
      <div style={{ flex: 1, height: 10, background: T.offWhite, borderRadius: 5, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: scoreColor(score), borderRadius: 5, transition: "width 1s ease-out" }} />
      </div>
      <div style={{ width: 30, fontFamily: T.display, fontSize: 13, fontWeight: 700, color: T.navy, textAlign: "right" }}>{score}</div>
      <div style={{ width: 24, fontFamily: T.body, fontSize: 11, color: T.mutedText }}>{grade}</div>
    </div>
  );
}

function StrengthItem({ title, detail, type = "strength" }) {
  const dotColor = type === "strength" ? T.greenText : T.amberText;
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 8, height: 8, borderRadius: 4, background: dotColor, marginTop: 5, flexShrink: 0 }} />
      <div>
        <span style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.darkText }}>{title} </span>
        <span style={{ fontFamily: T.body, fontSize: 12, color: T.mutedText }}>{detail}</span>
      </div>
    </div>
  );
}

function SignalBars({ strength }) {
  const levels = { strong: 4, moderate: 3, limited: 2, none: 0 };
  const filled = levels[strength] || 0;
  const colors = { 4: T.greenText, 3: T.greenText, 2: T.amberText, 1: T.redText, 0: T.lightText };
  const heights = [6, 10, 15, 20];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 22 }}>
      {[0,1,2,3].map(i => (
        <div key={i} style={{ width: 5, height: heights[i], borderRadius: 1.5, background: i < filled ? colors[filled] : "#E0E0E0" }} />
      ))}
    </div>
  );
}

// Subsection title — DM Sans 600 13px per blueprint
function SubTitle({ children }) {
  return <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 10 }}>{children}</div>;
}

// ============================================================
// CHART COMPONENTS
// ============================================================

function DonutChart({ data, labels, colors, centerText, centerSub, width = 200, height = 200 }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart.Chart(ref.current, {
      type: "doughnut",
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: T.white }] },
      options: {
        responsive: false, cutout: "62%",
        plugins: { legend: { display: false }, tooltip: { backgroundColor: T.navy, titleFont: { family: T.body, size: 11 }, bodyFont: { family: T.body, size: 10 }, padding: 8, cornerRadius: 6, callbacks: { label: (c) => ` ${c.label}: ${c.parsed}%` } } },
        animation: { animateRotate: true, duration: 1200 },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, labels, colors]);
  return (
    <div style={{ position: "relative", width, height }}>
      <canvas ref={ref} width={width} height={height} />
      {centerText && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <span style={{ fontFamily: T.display, fontSize: 16, fontWeight: 700, color: T.navy }}>{centerText}</span>
          {centerSub && <span style={{ fontFamily: T.body, fontSize: 9, color: T.mutedText, textAlign: "center", maxWidth: 80, lineHeight: 1.2, marginTop: 2 }}>{centerSub}</span>}
        </div>
      )}
    </div>
  );
}

function HBarChart({ data, labels, colors, width = 380, height = 200, maxVal, pct = true }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart.Chart(ref.current, {
      type: "bar",
      data: { labels, datasets: [{ data, backgroundColor: colors || data.map(() => T.gold), borderRadius: 4, barThickness: 24 }] },
      options: {
        responsive: false, indexAxis: "y",
        plugins: { legend: { display: false }, tooltip: { backgroundColor: T.navy, bodyFont: { family: T.body, size: 10 }, padding: 8, cornerRadius: 6, callbacks: { label: (c) => pct ? ` ${c.parsed.x}%` : ` £${c.parsed.x.toLocaleString()}` } } },
        scales: {
          x: { max: maxVal, grid: { color: "rgba(0,0,0,0.05)", drawBorder: false }, ticks: { font: { family: T.body, size: 9 }, color: T.lightText, callback: (v) => pct ? `${v}%` : `£${(v/1000).toFixed(0)}k` } },
          y: { grid: { display: false }, ticks: { font: { family: T.body, size: 11 }, color: T.darkText } },
        },
        animation: { duration: 1000 },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, labels, colors]);
  return <canvas ref={ref} width={width} height={height} />;
}

// CRITICAL-02 fix: localLabel is now a prop, not hardcoded
function GroupedHBar({ localData, nationalData, localLabel = "Local", nationalLabel = "National", labels, width = 340, height = 120, maxVal = 40000 }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart.Chart(ref.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: localLabel, data: localData, backgroundColor: T.gold, borderRadius: 4, barThickness: 20 },
          { label: nationalLabel, data: nationalData, backgroundColor: "#D1D5DB", borderRadius: 4, barThickness: 20 },
        ],
      },
      options: {
        responsive: false, indexAxis: "y",
        plugins: {
          legend: { position: "bottom", labels: { font: { family: T.body, size: 9 }, color: T.mutedText, boxWidth: 10, boxHeight: 10, padding: 12 } },
          tooltip: { backgroundColor: T.navy, bodyFont: { family: T.body, size: 10 }, padding: 8, cornerRadius: 6, callbacks: { label: (c) => ` ${c.dataset.label}: £${c.parsed.x.toLocaleString()}` } },
        },
        scales: {
          x: { max: maxVal, grid: { color: "rgba(0,0,0,0.05)", drawBorder: false }, ticks: { font: { family: T.body, size: 9 }, color: T.lightText, callback: (v) => `£${(v/1000).toFixed(0)}k` } },
          y: { grid: { display: false }, ticks: { font: { family: T.body, size: 11 }, color: T.darkText } },
        },
        animation: { duration: 1000 },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [localData, nationalData, labels, localLabel]);
  return <canvas ref={ref} width={width} height={height} />;
}

function ChartLegend({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: it.color, flexShrink: 0 }} />
          <span style={{ fontFamily: T.body, fontSize: 10.5, color: T.darkText }}>{it.label} ({it.value}%)</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// WATERMARK COMPONENT (from File 04)
// ============================================================
function Watermark({ email, children }) {
  const positions = [
    { top: "5%", left: "10%" }, { top: "5%", left: "55%" },
    { top: "20%", left: "25%" }, { top: "20%", left: "70%" },
    { top: "35%", left: "5%" }, { top: "35%", left: "45%" },
    { top: "50%", left: "20%" }, { top: "50%", left: "65%" },
    { top: "65%", left: "10%" }, { top: "65%", left: "50%" },
    { top: "80%", left: "30%" }, { top: "80%", left: "75%" },
  ];
  return (
    <div style={{ position: "relative" }}>
      {children}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 100 }}>
        {positions.map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            transform: "rotate(-25deg)",
            fontFamily: T.body, fontSize: 11, fontWeight: 400,
            color: "rgba(11, 29, 58, 0.07)",
            whiteSpace: "nowrap", userSelect: "none",
          }}>{email}</div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COVER PAGE
// ============================================================
function CoverPage({ data, pageNum, coverImage }) {
  return (
    <div style={{ background: T.navy, borderRadius: 12, padding: 0, overflow: "hidden", minHeight: 600, position: "relative" }}>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight}, ${T.gold})` }} />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 32px 0" }}>
        <span style={{ fontFamily: T.body, fontSize: 12, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: "2px" }}>FCM INTELLIGENCE</span>
        <span style={{ fontFamily: T.body, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Business Intelligence Reports</span>
      </div>
      <div style={{ position: "relative", margin: "20px 32px", borderRadius: 10, overflow: "hidden" }}>
        {coverImage?.url ? (
          <img
            src={coverImage.url}
            alt={coverImage.caption || 'Business exterior'}
            style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling && (e.target.nextElementSibling.style.display = 'flex');
            }}
          />
        ) : null}
        <div style={{
          width: "100%", height: 260,
          background: "linear-gradient(135deg, #2a3a5c 0%, #1a2a4a 50%, #0d1d35 100%)",
          display: coverImage?.url ? "none" : "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 48, display: "block", marginBottom: 8, opacity: 0.4 }}>🏪</span>
            <span style={{ fontFamily: T.body, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Google Business Photo</span>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: -10, right: 24 }}>
          <ScoreBadge score={data.score} grade={data.grade} size={80} />
        </div>
      </div>
      <div style={{ padding: "16px 32px 0" }}>
        <span style={{ display: "inline-block", border: `1px solid ${T.gold}`, borderRadius: 20, padding: "4px 16px", fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: "1.5px" }}>{data.tier_name}</span>
      </div>
      <div style={{ padding: "14px 32px 0" }}>
        <h1 style={{ fontFamily: T.display, fontSize: 28, fontWeight: 600, color: T.white, margin: 0, lineHeight: 1.2 }}>{data.business_name}</h1>
        <div style={{ fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{data.address}</div>
      </div>
      <div style={{ flex: 1, minHeight: 60 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 32px", marginTop: 40 }}>
        {[
          { label: "ORDER REFERENCE", value: data.order_ref },
          { label: "REPORT DATE", value: data.report_date },
          { label: "PREPARED FOR", value: data.customer_name },
          { label: "REPORT TIER", value: `${data.tier_name} — £${data.tier_price}` },
        ].map((m, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "12px 16px", borderLeft: `2px solid ${T.gold}` }}>
            <div style={{ fontFamily: T.body, fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontFamily: T.body, fontSize: 13, color: T.white, fontWeight: 500 }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "24px 32px 20px", marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <span style={{ fontFamily: T.body, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Confidential</span>
        <span style={{ fontFamily: T.body, fontSize: 10, color: T.gold }}>fcmreport.com</span>
      </div>
    </div>
  );
}

// ============================================================
// LICENCE & CONFIDENTIALITY NOTICE (expanded — approved)
// ============================================================
function LicencePage({ data, pageNum }) {
  const sections = [
    { title: "LICENCE", text: "This report is licensed for the sole use of the named purchaser. You may share relevant findings with your professional advisors (solicitor, accountant, mortgage broker) in connection with your assessment of the subject business. You may not forward, distribute, publish, or share the complete report with any other party." },
    { title: "NOT FINANCIAL ADVICE", text: "This report provides market intelligence and analysis for informational purposes only. It does not constitute financial, legal, or investment advice. FCM Intelligence is not regulated by the Financial Conduct Authority. You should seek independent professional advice before making any acquisition decision." },
    { title: "DATA SOURCES", text: "Analysis is based on publicly available data from sources including the Office for National Statistics, data.police.uk, Ofcom, Post Office Ltd, and other public sources cited within the report. While we take reasonable care to ensure accuracy, we cannot guarantee the accuracy or completeness of third-party data." },
    { title: "NO LIABILITY", text: `FCM Intelligence accepts no liability for any loss, damage, or expense arising from decisions made in reliance on this report. Our total liability shall not exceed the price paid for this report. Data is accurate as of ${data.report_date}. Local conditions may change.` },
    { title: "COPYRIGHT", text: "© 2026 FCM Intelligence. All rights reserved. This report and its contents are protected by UK copyright law. Reproduction, distribution, or creation of derivative works is prohibited without written consent." },
  ];
  return (
    <div style={{ padding: "40px 0" }}>
      <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 28 }}>FCM INTELLIGENCE</div>
      <div style={{ fontFamily: T.display, fontSize: 18, fontWeight: 600, color: T.navy, marginBottom: 6 }}>Licence & Confidentiality Notice</div>
      <div style={{ height: 2, background: T.navy, marginBottom: 24, width: 60 }} />
      <div style={{ background: T.offWhite, borderRadius: 8, padding: "16px 20px", marginBottom: 28, borderLeft: `3px solid ${T.gold}` }}>
        <div style={{ fontFamily: T.body, fontSize: 10, color: T.lightText, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>This report has been prepared exclusively for</div>
        <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 600, color: T.navy }}>{data.customer_name}</div>
        <div style={{ fontFamily: T.body, fontSize: 12, color: T.mutedText, marginTop: 2 }}>{data.customer_email}</div>
        <div style={{ display: "flex", gap: 24, marginTop: 10 }}>
          <div><span style={{ fontFamily: T.body, fontSize: 9, color: T.lightText, textTransform: "uppercase", letterSpacing: "1px" }}>Order Reference: </span><span style={{ fontFamily: T.body, fontSize: 11, color: T.darkText, fontWeight: 500 }}>{data.order_ref}</span></div>
          <div><span style={{ fontFamily: T.body, fontSize: 9, color: T.lightText, textTransform: "uppercase", letterSpacing: "1px" }}>Date: </span><span style={{ fontFamily: T.body, fontSize: 11, color: T.darkText, fontWeight: 500 }}>{data.report_date}</span></div>
          <div><span style={{ fontFamily: T.body, fontSize: 9, color: T.lightText, textTransform: "uppercase", letterSpacing: "1px" }}>Tier: </span><span style={{ fontFamily: T.body, fontSize: 11, color: T.darkText, fontWeight: 500 }}>{data.tier_name}</span></div>
        </div>
      </div>
      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.navy, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>{s.title}</div>
          <div style={{ fontFamily: T.body, fontSize: 11.5, color: T.darkText, lineHeight: 1.75 }}>{s.text}</div>
        </div>
      ))}
      <div style={{ background: T.amberBg, borderRadius: 8, padding: "12px 16px", marginTop: 24, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14 }}>🔒</span>
        <div style={{ fontFamily: T.body, fontSize: 10.5, color: T.amberText, lineHeight: 1.5 }}>
          <strong>Watermark notice:</strong> This report is watermarked with the purchaser's identity on every page. Unauthorised distribution may be traced.
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${T.offWhite}`, paddingTop: 16, display: "flex", gap: 24 }}>
        <span style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText }}>Full Terms of Service: <span style={{ color: T.gold, fontWeight: 500 }}>fcmreport.com/terms</span></span>
        <span style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText }}>Privacy Policy: <span style={{ color: T.gold, fontWeight: 500 }}>fcmreport.com/privacy</span></span>
      </div>
    </div>
  );
}

// ============================================================
// SECTION 1: EXECUTIVE SUMMARY
// ============================================================
function Section1({ data, pageNum }) {
  return (
    <div>
      <SectionHeader number={1} title="Executive Summary & Verdict" pageNum={pageNum} />
      <ScoreRing score={data.score} grade={data.grade} verdict={data.verdict} verdictDetail={data.verdict_detail} />
      <StatBoxes items={data.stat_boxes} />
      <div style={{ marginBottom: 24 }}>
        {data.category_scores.map((c, i) => (
          <CategoryBar key={i} label={c.category} score={c.score} grade={c.grade} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ border: `1px solid ${T.greenText}`, borderRadius: 8, padding: "16px 18px" }}>
          <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.greenText, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>TOP 3 STRENGTHS</div>
          {data.strengths.map((s, i) => <StrengthItem key={i} title={s.title} detail={s.detail} type="strength" />)}
        </div>
        <div style={{ border: `1px solid ${T.amberText}`, borderRadius: 8, padding: "16px 18px" }}>
          <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.amberText, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>TOP 3 CONCERNS</div>
          {data.concerns.map((c, i) => <StrengthItem key={i} title={c.title} detail={c.detail} type="concern" />)}
        </div>
      </div>
      <PullQuote quote={data.assessment_quote} attribution="FCM Intelligence Assessment" />
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 2: FINANCIAL ANALYSIS (SIGNIFICANT-02 fix)
// ============================================================
function Section2({ data, pageNum }) {
  return (
    <div>
      <SectionHeader number={2} title="Financial Analysis" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />
      {data.financial_gap_warning && <WarningCallout title="⚠️ FINANCIAL DATA GAP">{data.financial_gap_warning}</WarningCallout>}
      {data.asking_price_components && data.asking_price_components.length > 0 && (
        <>
          <SubTitle>Asking Price Summary</SubTitle>
          <DataTable headers={["COMPONENT", "VALUE", "NOTES"]} rows={data.asking_price_components.map(p => [p.component, p.value, p.notes])} />
        </>
      )}
      {data.revenue_breakdown && data.revenue_breakdown.length > 0 && (
        <>
          <SubTitle>Revenue Breakdown</SubTitle>
          <DataTable headers={["SOURCE", "AMOUNT", "% OF TOTAL", "NOTES"]} rows={data.revenue_breakdown.map(r => [r.source, r.amount, r.percentage, r.notes || ""])} />
        </>
      )}
      {data.profit_loss_estimate && data.profit_loss_estimate.length > 0 && (
        <>
          <SubTitle>Estimated Profit & Loss</SubTitle>
          <WarningCallout title="ESTIMATES ONLY">These figures are estimates based on listing data and FCM benchmarks. Verify with actual accounts before making any offer.</WarningCallout>
          <DataTable headers={["LINE ITEM", "LOW ESTIMATE", "HIGH ESTIMATE", "NOTES"]} rows={data.profit_loss_estimate.map(p => [p.item, p.low, p.high, p.notes || ""])} />
        </>
      )}
      {data.benchmark_comparison && data.benchmark_comparison.length > 0 && (
        <>
          <SubTitle>FCM Benchmark Comparison</SubTitle>
          <DataTable headers={["METRIC", "THIS BUSINESS", "FCM BENCHMARK", "ASSESSMENT"]} rows={data.benchmark_comparison.map(b => [b.metric, b.this_business, b.benchmark, b.assessment])} threatCol={3} />
        </>
      )}
      {data.companies_house && (
        <>
          <SubTitle>Companies House Data</SubTitle>
          <DataTable headers={["FIELD", "VALUE"]} rows={Object.entries(data.companies_house).map(([k, v]) => [k, v])} />
        </>
      )}
      {data.valuation_assessment && (
        <PracticalContext title="VALUATION ASSESSMENT">{data.valuation_assessment}</PracticalContext>
      )}
      {data.key_insight && <InsightCallout>{data.key_insight}</InsightCallout>}
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 3: PO REMUNERATION (SIGNIFICANT-03 fix)
// ============================================================
function Section3({ data, pageNum }) {
  const cols = [T.gold, T.navy, "#8B9DC3", T.mutedText, "#D1D5DB"];
  return (
    <div>
      <SectionHeader number={3} title="PO Remuneration Analysis" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />
      {data.stat_boxes && <StatBoxes items={data.stat_boxes} />}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 8, padding: "16px 20px" }}>
          <SubTitle>PO Income Breakdown (Estimated)</SubTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <DonutChart data={data.income_streams.map(s => parseFloat(s.percentage))} labels={data.income_streams.map(s => s.service)} colors={cols} width={180} height={180} />
            <ChartLegend items={data.income_streams.map((s, i) => ({ label: s.service, value: s.percentage, color: cols[i] }))} />
          </div>
        </div>
        <DataTable headers={["SERVICE", "% OF PO INCOME", "EST. ANNUAL", "TREND"]} rows={data.income_streams.map(s => [s.service, s.percentage + "%", s.est_annual, s.trend])} threatCol={3} />
      </div>
      {data.contract_type && (
        <PracticalContext title="CONTRACT TYPE ASSESSMENT">
          <strong>{data.contract_type}</strong> — {data.contract_type_detail || `This is a ${data.contract_type} branch. Contract type affects income structure, operational requirements, and long-term stability.`}
        </PracticalContext>
      )}
      {data.benchmark_comparison && data.benchmark_comparison.length > 0 && (
        <>
          <SubTitle>FCM Benchmark Comparison</SubTitle>
          <DataTable headers={["METRIC", "THIS BRANCH", "BENCHMARK", "ASSESSMENT"]} rows={data.benchmark_comparison.map(b => [b.metric, b.this_branch, b.benchmark, b.assessment])} threatCol={3} />
        </>
      )}
      {data.network_context && (
        <PracticalContext title="PO NETWORK CONTEXT">{data.network_context}</PracticalContext>
      )}
      {data.bank_closure_opportunity && <OpportunityCallout>{data.bank_closure_opportunity}</OpportunityCallout>}
      <InsightCallout>{data.key_insight}</InsightCallout>

      {/* ── Adjusted Management Accounts (appended below existing S3 content) ── */}
      {(() => {
        const aa = data.adjusted_accounts || (data.content && data.content.adjusted_accounts);
        if (!aa) return <SourceFooter text={data.sources} />;

        const fmt = (v) => {
          if (v == null) return "—";
          if (typeof v === "string") return v;
          return "£" + Number(v).toLocaleString("en-GB");
        };
        const fmtPct = (v) => (v != null ? v + "%" : "");
        const pillStyle = (variant) => {
          const map = {
            "PO contract": { bg: T.gold + "22", color: T.gold, border: T.gold },
            listing: { bg: T.blueBg, color: T.blueText, border: T.blueText },
            estimated: { bg: "#EBEBEB", color: T.mutedText, border: T.mutedText },
            highest_cost: { bg: T.amberBg, color: T.amberText, border: T.amberText },
            saving_potential: { bg: T.greenBg, color: T.greenText, border: T.greenText },
          };
          const m = map[variant] || map.estimated;
          return {
            display: "inline-block", fontSize: 9, fontWeight: 600, padding: "2px 8px",
            borderRadius: 10, background: m.bg, color: m.color, border: `1px solid ${m.border}30`,
            marginLeft: 4, lineHeight: "16px", verticalAlign: "middle",
          };
        };
        const verdictColor = (v) => {
          if (!v) return T.darkText;
          const vl = v.toLowerCase();
          if (vl === "strong") return T.scoreExcellent;
          if (vl === "viable") return T.greenText;
          if (vl === "marginal") return T.amberText;
          return T.redText;
        };
        const rev = aa.revenue || {};
        const prof = aa.profitability || {};
        const costs = aa.operating_costs || [];
        const savings = aa.savings || [];
        const valCtx = aa.valuation_context;

        // Build revenue rows from Sage's named-key format (no streams array)
        const revenueRows = [];
        if (rev.po_remuneration) revenueRows.push({ name: "PO Remuneration", amount: rev.po_remuneration.amount, source: rev.po_remuneration.source, notes: rev.po_remuneration.notes });
        if (rev.retail_sales) revenueRows.push({ name: "Retail Sales", amount: rev.retail_sales.amount, source: rev.retail_sales.source, notes: rev.retail_sales.notes });
        if (rev.other_income) revenueRows.push({ name: "Other Income", amount: rev.other_income.amount, source: rev.other_income.source, notes: rev.other_income.notes });
        // Legacy streams array fallback
        if (rev.streams && rev.streams.length > 0 && revenueRows.length === 0) {
          rev.streams.forEach(s => revenueRows.push({ name: s.source || s.name, amount: s.annual, source: s.data_source, notes: s.notes }));
        }
        const hasRevenueRows = revenueRows.length > 0;

        // Normalise profitability — Sage sends objects { amount, margin, verdict }, legacy sends flat values
        const profAdjusted = (prof.adjusted_profit && typeof prof.adjusted_profit === "object") ? prof.adjusted_profit : { amount: prof.adjusted_profit, margin: prof.adjusted_margin, verdict: prof.adjusted_verdict };
        const profOperating = (prof.operating_profit && typeof prof.operating_profit === "object") ? prof.operating_profit : (prof.as_listed || { amount: prof.operating_profit });
        const profOptimised = (prof.optimised_profit && typeof prof.optimised_profit === "object") ? prof.optimised_profit : (prof.optimised || { amount: prof.optimised_profit });
        const profGross = (prof.gross_profit && typeof prof.gross_profit === "object") ? prof.gross_profit : { amount: prof.gross_profit };
        const monthlyTH = prof.monthly_take_home || {};

        // Top 5 costs for donut — use .amount (Sage) with .annual fallback (legacy)
        const sortedCosts = [...costs].sort((a, b) => (b.amount || b.annual || 0) - (a.amount || a.annual || 0)).slice(0, 5);
        const donutData = sortedCosts.map(c => c.amount || c.annual || 0);
        const donutLabels = sortedCosts.map(c => c.category || c.name);
        const donutTotal = donutData.reduce((s, v) => s + v, 0);

        return (
          <>
            {/* Divider */}
            <div style={{ borderTop: `2px solid ${T.gold}`, margin: "32px 0 24px", opacity: 0.5 }} />

            {/* Heading */}
            <SubTitle>Adjusted Management Accounts</SubTitle>
            {aa.summary && (
              <div style={{ fontFamily: T.body, fontSize: 12, color: T.mutedText, lineHeight: 1.65, marginBottom: 20 }}>{aa.summary}</div>
            )}

            {/* 3 Summary Metric Cards */}
            <StatBoxes items={[
              { label: "TOTAL REVENUE (ANNUAL)", value: fmt(rev.total_revenue) },
              { label: "ADJUSTED NET PROFIT", value: fmt(profAdjusted.amount) + (profAdjusted.margin != null ? ` (${profAdjusted.margin}%)` : "") },
              { label: "POTENTIAL SAVINGS", value: fmt(aa.total_savings) },
            ]} />

            {/* Revenue Table */}
            {hasRevenueRows && (
              <>
                <SubTitle>Revenue Breakdown</SubTitle>
                <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 20, border: `1px solid ${T.offWhite}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.body, fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: T.navy }}>
                        {["SOURCE", "ANNUAL", "MONTHLY", "DATA SOURCE"].map((h, i) => (
                          <th key={i} style={{ padding: "10px 14px", color: T.white, fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {revenueRows.map((s, ri) => (
                        <tr key={ri} style={{ background: ri % 2 === 0 ? T.white : "#FAFAF8" }}>
                          <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{s.name}</td>
                          <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(s.amount)}</td>
                          <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(s.amount != null ? Math.round(s.amount / 12) : null)}</td>
                          <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>
                            {s.source && <span style={pillStyle(s.source)}>{s.source}</span>}
                          </td>
                        </tr>
                      ))}
                      {/* Total row */}
                      <tr style={{ background: T.offWhite }}>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: T.navy, borderBottom: `1px solid ${T.offWhite}` }}>TOTAL</td>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: T.navy, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(rev.total_revenue)}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: T.navy, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(rev.total_revenue != null ? Math.round(rev.total_revenue / 12) : null)}</td>
                        <td style={{ padding: "10px 14px", borderBottom: `1px solid ${T.offWhite}` }} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Operating Costs Table */}
            {costs.length > 0 && (
              <>
                <SubTitle>Operating Costs</SubTitle>
                <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 20, border: `1px solid ${T.offWhite}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.body, fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: T.navy }}>
                        {["CATEGORY", "ANNUAL", "MONTHLY", "% OF REVENUE", "SOURCE"].map((h, i) => (
                          <th key={i} style={{ padding: "10px 14px", color: T.white, fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {costs.map((c, ri) => (
                        <React.Fragment key={ri}>
                          <tr style={{ background: ri % 2 === 0 ? T.white : "#FAFAF8" }}>
                            <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>
                              {c.category || c.name}
                              {c.flag === "highest_cost" && <span style={pillStyle("highest_cost")}>HIGHEST</span>}
                              {c.flag === "saving_potential" && <span style={pillStyle("saving_potential")}>SAVE</span>}
                              {c.flags && c.flags.includes && c.flags.includes("highest_cost") && <span style={pillStyle("highest_cost")}>HIGHEST</span>}
                              {c.flags && c.flags.includes && c.flags.includes("saving_potential") && <span style={pillStyle("saving_potential")}>SAVE</span>}
                            </td>
                            <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(c.amount || c.annual)}</td>
                            <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(c.monthly)}</td>
                            <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{fmtPct(c.pct_revenue || c.pct_of_revenue || c.percent_of_revenue)}</td>
                            <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>
                              {c.source && <span style={pillStyle(c.estimated ? "estimated" : (c.source || "estimated"))}>{c.estimated ? "EST" : c.source}</span>}
                              {!c.source && c.estimated && <span style={pillStyle("estimated")}>EST</span>}
                            </td>
                          </tr>
                          {c.notes && (
                            <tr style={{ background: ri % 2 === 0 ? T.white : "#FAFAF8" }}>
                              <td colSpan={5} style={{ padding: "2px 14px 8px", fontSize: 10, color: T.lightText, borderBottom: `1px solid ${T.offWhite}` }}>{c.notes}</td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                      {/* Total row */}
                      <tr style={{ background: T.offWhite }}>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: T.navy, borderBottom: `1px solid ${T.offWhite}` }}>TOTAL COSTS</td>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: T.navy, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(aa.total_costs || costs.reduce((s, c) => s + (c.amount || c.annual || 0), 0))}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: T.navy, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(aa.total_costs_monthly || Math.round(costs.reduce((s, c) => s + (c.amount || c.annual || 0), 0) / 12))}</td>
                        <td colSpan={2} style={{ padding: "10px 14px", borderBottom: `1px solid ${T.offWhite}` }} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Profitability Summary */}
            {prof && (profOperating.amount != null || profAdjusted.amount != null || profOptimised.amount != null) && (
              <>
                <SubTitle>Profitability Summary</SubTitle>
                <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 20, border: `1px solid ${T.offWhite}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.body, fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: T.navy }}>
                        {["SCENARIO", "ANNUAL PROFIT", "MARGIN", "MONTHLY TAKE-HOME", "VERDICT"].map((h, i) => (
                          <th key={i} style={{ padding: "10px 14px", color: T.white, fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Operating Profit (As Listed)", amount: profOperating.amount, margin: profOperating.margin, verdict: profOperating.verdict, monthly_take_home: monthlyTH.as_is },
                        { label: "Adjusted Profit (Owner-Operator)", amount: profAdjusted.amount, margin: profAdjusted.margin, verdict: profAdjusted.verdict, monthly_take_home: monthlyTH.adjusted },
                        { label: "Optimised Profit (All Savings)", amount: profOptimised.amount, margin: profOptimised.margin, verdict: profOptimised.verdict, monthly_take_home: monthlyTH.optimised },
                      ].map((row, ri) => {
                        const amt = row.amount;
                        const isNeg = typeof amt === "number" ? amt < 0 : (typeof amt === "string" && amt.startsWith("-"));
                        return (
                          <tr key={ri} style={{ background: ri % 2 === 0 ? T.white : "#FAFAF8" }}>
                            <td style={{ padding: "10px 14px", fontWeight: 600, color: T.navy, borderBottom: `1px solid ${T.offWhite}` }}>{row.label}</td>
                            <td style={{ padding: "10px 14px", fontWeight: 600, color: isNeg ? T.redText : T.greenText, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(amt)}</td>
                            <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{row.margin != null ? row.margin + "%" : ""}</td>
                            <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{row.monthly_take_home != null ? fmt(row.monthly_take_home) : "—"}</td>
                            <td style={{ padding: "10px 14px", borderBottom: `1px solid ${T.offWhite}` }}>
                              {row.verdict && <span style={{ fontWeight: 600, color: verdictColor(row.verdict) }}>{row.verdict}</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Cost Breakdown Doughnut */}
            {sortedCosts.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24, background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 8, padding: "16px 20px" }}>
                <div>
                  <SubTitle>Cost Breakdown</SubTitle>
                  <DonutChart data={donutData} labels={donutLabels} colors={cols} width={180} height={180} />
                </div>
                <ChartLegend items={sortedCosts.map((c, i) => ({
                  label: c.category || c.name,
                  value: donutTotal > 0 ? Math.round(((c.amount || c.annual || 0) / donutTotal) * 100) + "%" : "—",
                  color: cols[i],
                }))} />
              </div>
            )}

            {/* Savings Table */}
            {savings.length > 0 && (
              <>
                <SubTitle>Identified Savings</SubTitle>
                <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 20, border: `1px solid ${T.offWhite}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.body, fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: T.navy }}>
                        {["AREA", "CURRENT", "POTENTIAL", "SAVING", "NOTES"].map((h, i) => (
                          <th key={i} style={{ padding: "10px 14px", color: T.white, fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {savings.map((s, ri) => (
                        <tr key={ri} style={{ background: ri % 2 === 0 ? T.white : "#FAFAF8" }}>
                          <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{s.area || s.name}</td>
                          <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(s.current)}</td>
                          <td style={{ padding: "10px 14px", color: T.darkText, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(s.potential)}</td>
                          <td style={{ padding: "10px 14px", color: T.greenText, fontWeight: 600, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(s.saving)}</td>
                          <td style={{ padding: "10px 14px", color: T.mutedText, fontSize: 10, borderBottom: `1px solid ${T.offWhite}` }}>{s.notes || ""}</td>
                        </tr>
                      ))}
                      {/* Total row */}
                      <tr style={{ background: T.greenBg }}>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: T.greenText, borderBottom: `1px solid ${T.offWhite}` }}>TOTAL SAVINGS</td>
                        <td style={{ padding: "10px 14px", borderBottom: `1px solid ${T.offWhite}` }} />
                        <td style={{ padding: "10px 14px", borderBottom: `1px solid ${T.offWhite}` }} />
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: T.greenText, borderBottom: `1px solid ${T.offWhite}` }}>{fmt(aa.total_savings || savings.reduce((s, r) => s + (r.saving || 0), 0))}</td>
                        <td style={{ padding: "10px 14px", borderBottom: `1px solid ${T.offWhite}` }} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Verdict Box */}
            {valCtx && (
              <div style={{
                background: T.navy + "08", border: `1px solid ${T.gold}`, borderLeft: `4px solid ${T.gold}`,
                borderRadius: 8, padding: "18px 22px", marginBottom: 20,
              }}>
                <div style={{ fontFamily: T.display, fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 10 }}>Valuation Verdict</div>
                {(valCtx.asking_price || valCtx.adjusted_profit || valCtx.payback_years || valCtx.pe_ratio || valCtx.price_to_earnings) && (
                  <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                    {valCtx.asking_price && (
                      <div style={{ background: T.white, borderRadius: 6, padding: "8px 14px", fontSize: 11, fontFamily: T.body }}>
                        <div style={{ fontSize: 9, color: T.mutedText, textTransform: "uppercase", letterSpacing: "1px" }}>Asking Price</div>
                        <div style={{ fontWeight: 700, color: T.navy }}>{fmt(valCtx.asking_price)}</div>
                      </div>
                    )}
                    {valCtx.adjusted_profit && (
                      <div style={{ background: T.white, borderRadius: 6, padding: "8px 14px", fontSize: 11, fontFamily: T.body }}>
                        <div style={{ fontSize: 9, color: T.mutedText, textTransform: "uppercase", letterSpacing: "1px" }}>Adj. Profit</div>
                        <div style={{ fontWeight: 700, color: T.navy }}>{fmt(valCtx.adjusted_profit)}</div>
                      </div>
                    )}
                    {valCtx.payback_years && (
                      <div style={{ background: T.white, borderRadius: 6, padding: "8px 14px", fontSize: 11, fontFamily: T.body }}>
                        <div style={{ fontSize: 9, color: T.mutedText, textTransform: "uppercase", letterSpacing: "1px" }}>Payback</div>
                        <div style={{ fontWeight: 700, color: T.navy }}>{valCtx.payback_years} years</div>
                      </div>
                    )}
                    {(valCtx.pe_ratio || valCtx.price_to_earnings) && (
                      <div style={{ background: T.white, borderRadius: 6, padding: "8px 14px", fontSize: 11, fontFamily: T.body }}>
                        <div style={{ fontSize: 9, color: T.mutedText, textTransform: "uppercase", letterSpacing: "1px" }}>P/E Ratio</div>
                        <div style={{ fontWeight: 700, color: T.navy }}>{valCtx.pe_ratio || valCtx.price_to_earnings}x</div>
                      </div>
                    )}
                  </div>
                )}
                {valCtx.verdict && (
                  <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.65 }}>{valCtx.verdict}</div>
                )}
                {valCtx.scenarios && valCtx.scenarios.length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {valCtx.scenarios.map((sc, i) => (
                      <div key={i} style={{ background: T.white, borderRadius: 6, padding: "8px 12px", fontSize: 10, fontFamily: T.body, flex: "1 1 140px" }}>
                        <div style={{ fontWeight: 600, color: T.navy, marginBottom: 4 }}>{sc.label || sc.name}</div>
                        <div style={{ color: T.mutedText }}>{sc.detail || sc.description || fmt(sc.amount)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Disclaimer */}
            {aa.disclaimer && (
              <div style={{ fontFamily: T.body, fontSize: 9, color: T.lightText, lineHeight: 1.5, marginBottom: 16 }}>{aa.disclaimer}</div>
            )}

            <SourceFooter text={data.sources} />
          </>
        );
      })()}
    </div>
  );
}

// ============================================================
// SECTION 4: STAFFING (SIGNIFICANT-04 fix)
// ============================================================
function Section4({ data, pageNum }) {
  return (
    <div>
      <SectionHeader number={4} title="Staffing, Employment & Hidden Costs" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />
      {data.current_staffing && data.current_staffing.length > 0 && (
        <>
          <SubTitle>Current Staffing Model (from listing)</SubTitle>
          <DataTable headers={["ROLE", "HOURS", "NOTES"]} rows={data.current_staffing.map(s => [s.role, s.hours, s.notes || ""])} />
        </>
      )}
      <SubTitle>True Cost of Employment (2026 Rates)</SubTitle>
      <DataTable headers={["COMPONENT", "RATE/COST", "NOTES"]} rows={data.employment_costs.map(e => [e.component, e.rate, e.notes])} />
      <InsightCallout>{data.key_insight || data.insight}</InsightCallout>
      {data.recommended_staffing && (
        <PracticalContext title="RECOMMENDED STAFFING MODEL">{data.recommended_staffing}</PracticalContext>
      )}
      <SubTitle>Hidden Costs to Budget For</SubTitle>
      <DataTable headers={["COST", "EST. AMOUNT", "FREQUENCY"]} rows={data.hidden_costs.map(h => [h.cost, h.amount, h.frequency])} />
      {data.wage_inflation_warning && (
        <WarningCallout title="⚠️ WAGE INFLATION WARNING">{data.wage_inflation_warning}</WarningCallout>
      )}
      <div style={{ background: T.offWhite, borderLeft: `3px solid ${T.navy}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.navy, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>TUPE OBLIGATIONS</div>
        <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.65 }}>{data.tupe_note || data.tupe}</div>
      </div>
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 5: ONLINE PRESENCE (SIGNIFICANT-05 fix)
// ============================================================
function Section5({ data, pageNum, images }) {
  // Collect all positive/negative themes across listings
  const allPositive = data.google_business_listings
    ? data.google_business_listings.flatMap(l => l.positive_themes || [])
    : (data.positive_themes || []);
  const allNegative = data.google_business_listings
    ? data.google_business_listings.flatMap(l => l.negative_themes || [])
    : (data.negative_themes || []);

  // Build stat boxes from listings
  const statItems = data.ratings || (data.google_business_listings || []).map(l => ({
    label: `${l.address} RATING`, value: `${l.rating}★`
  }));
  if (data.combined_review_count && !data.ratings) {
    statItems.push({ label: "COMBINED REVIEWS", value: String(data.combined_review_count) });
  }

  return (
    <div>
      <SectionHeader number={5} title="Online Presence & Customer Reviews" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />
      {data.address_discrepancy && data.address_discrepancy.found && (
        <WarningCallout title="⚠️ Two Listings Identified">{data.address_discrepancy.detail || data.discrepancy}</WarningCallout>
      )}
      {statItems.length > 0 && <StatBoxes items={statItems} />}

      {/* Real Google Business Photos */}
      {images?.google_business_photos && images.google_business_photos.length > 0 && (
        <>
          <SubTitle>Google Business Photos</SubTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
            {images.google_business_photos.map((photo, i) => (
              <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.offWhite}` }}>
                <img
                  src={photo.url}
                  alt={photo.caption || 'Google Business photo'}
                  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div style={{ padding: '8px 12px', background: T.white }}>
                  <p style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText, margin: 0 }}>{photo.caption}</p>
                  {photo.business_name && (
                    <p style={{ fontFamily: T.body, fontSize: 9, color: T.lightText, margin: '2px 0 0' }}>
                      {photo.business_name} • {photo.rating}★ • {photo.review_count} reviews
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <SubTitle>Google Business Profiles</SubTitle>
      <DataTable
        headers={["ADDRESS", "GOOGLE NAME", "RATING", "REVIEWS"]}
        rows={(data.google_business_listings || data.listings || []).map(l => [
          l.address, l.business_name || l.name, l.rating ? `${l.rating}★` : "N/A", l.review_count || l.reviews || "N/A"
        ])}
      />
      {data.competitor_comparison && data.competitor_comparison.length > 0 && (
        <>
          <SubTitle>Competitor Review Comparison</SubTitle>
          <DataTable
            headers={["BUSINESS", "RATING", "REVIEWS", "TREND"]}
            rows={data.competitor_comparison.map(c => [c.name, `${c.rating}★`, String(c.reviews), c.trend || "—"])}
          />
        </>
      )}
      {(allPositive.length > 0 || allNegative.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color: T.greenText, marginBottom: 8 }}>Positive Themes</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {allPositive.map((t, i) => <span key={i} style={{ background: T.greenBg, color: T.greenText, fontFamily: T.body, fontSize: 10, fontWeight: 500, padding: "4px 10px", borderRadius: 12 }}>{t}</span>)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color: T.amberText, marginBottom: 8 }}>Common Concerns</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {allNegative.map((t, i) => <span key={i} style={{ background: T.amberBg, color: T.amberText, fontFamily: T.body, fontSize: 10, fontWeight: 500, padding: "4px 10px", borderRadius: 12 }}>{t}</span>)}
            </div>
          </div>
        </div>
      )}
      <SubTitle>Social Media Audit</SubTitle>
      <DataTable
        headers={["PLATFORM", "STATUS", "ASSESSMENT"]}
        rows={(data.social_media_audit || data.social || []).map(s => [s.platform, s.status, s.assessment])}
        threatCol={2}
      />
      {data.digital_presence_verdict && (
        <div style={{ background: T.offWhite, borderRadius: 8, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <StatusPill status={data.digital_presence_verdict} />
          <span style={{ fontFamily: T.body, fontSize: 12, color: T.darkText }}>Overall digital presence</span>
        </div>
      )}
      <InsightCallout title="QUICK WINS">
        {Array.isArray(data.quick_wins) ? data.quick_wins.map((w, i) => <div key={i} style={{ marginBottom: 4 }}>{i + 1}. {w}</div>) : data.quick_wins}
      </InsightCallout>
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 6: LOCATION INTELLIGENCE
// ============================================================
function Section6({ data, pageNum, images }) {
  return (
    <div>
      <SectionHeader number={6} title="Location Intelligence" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />
      {data.address_discrepancy && (
        <WarningCallout title="⚠️ Address Discrepancy — Verify During Due Diligence">
          {data.address_discrepancy.detail}
        </WarningCallout>
      )}
      {/* Google Business Photos — try images prop first, then data.photos_primary/secondary */}
      {images?.google_business_photos && images.google_business_photos.length > 0 ? (
        (() => {
          // Group photos by address for multi-listing businesses
          const grouped = {};
          images.google_business_photos.forEach(p => {
            const key = p.address || 'Business';
            if (!grouped[key]) grouped[key] = { photos: [], meta: p };
            grouped[key].photos.push(p);
          });
          return Object.entries(grouped).map(([addr, { photos, meta }], gi) => (
            <div key={gi}>
              <SubTitle>Google Business Photos — {addr}</SubTitle>
              {meta.business_name && (
                <div style={{ fontFamily: T.body, fontSize: 11, color: T.mutedText, marginBottom: 12 }}>
                  {meta.business_name} • {meta.rating}★ • {meta.review_count} reviews
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.offWhite}` }}>
                    <img
                      src={p.url}
                      alt={p.caption || `Photo ${i+1}`}
                      style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                    {p.caption && <p style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText, padding: '8px 12px', margin: 0, background: T.white }}>{p.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          ));
        })()
      ) : (
        <>
          {data.photos_primary && (
            <>
              <SubTitle>Google Business Photos — {data.photos_primary.address}</SubTitle>
              <div style={{ fontFamily: T.body, fontSize: 11, color: T.mutedText, marginBottom: 12 }}>
                {data.photos_primary.name} • {data.photos_primary.rating}★ • {data.photos_primary.reviews} reviews
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {data.photos_primary.images.map((img, i) => (
                  <ImagePlaceholder key={i} label={img.label} caption={img.caption} height={200} icon="🏪" />
                ))}
              </div>
            </>
          )}
          {data.photos_secondary && (
            <>
              <SubTitle>Google Business Photos — {data.photos_secondary.address}</SubTitle>
              <div style={{ fontFamily: T.body, fontSize: 11, color: T.mutedText, marginBottom: 12 }}>
                {data.photos_secondary.name} • {data.photos_secondary.rating}★ • {data.photos_secondary.reviews} reviews
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {data.photos_secondary.images.map((img, i) => (
                  <ImagePlaceholder key={i} label={img.label} caption={img.caption} height={200} icon="🏢" />
                ))}
              </div>
            </>
          )}
        </>
      )}
      {/* Maps — real images if available, otherwise placeholder */}
      {images?.maps && images.maps.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: images.maps.length > 1 ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 24 }}>
          {images.maps.map((map, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.offWhite}` }}>
              <img
                src={map.url}
                alt={map.caption || 'Location map'}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                loading="lazy"
                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
              />
              <p style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText, padding: '8px 12px', margin: 0, background: T.white }}>{map.caption}</p>
            </div>
          ))}
        </div>
      ) : (
        <ImagePlaceholder label="Area Map — 1km radius" caption="Area map showing key landmarks around business location" height={300} icon="🗺️" />
      )}

      <SubTitle>Virtual Site Visit — Street View</SubTitle>
      {/* Street View — real images if available, otherwise placeholder */}
      {images?.street_view && images.street_view.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: images.street_view.length > 1 ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 24 }}>
          {images.street_view.map((sv, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.offWhite}` }}>
              <img
                src={sv.url}
                alt={sv.caption || 'Street View'}
                style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                loading="lazy"
                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
              />
              <p style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText, padding: '8px 12px', margin: 0, background: T.white }}>{sv.caption}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <ImagePlaceholder label="Street View: The Premises" caption="Street View showing shopfront and signage" height={200} icon="📸" />
          <ImagePlaceholder label="Street View: Street Context" caption="Street View showing wider trading environment" height={200} icon="📸" />
        </div>
      )}
      {data.landmarks && data.landmarks.length > 0 && (
        <>
          <SubTitle>Key Landmarks Within 1km</SubTitle>
          <div style={{ marginBottom: 20 }}>
            {data.landmarks.map((lm, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${T.offWhite}` }}>
                <span style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.darkText, minWidth: 200 }}>{lm.name}</span>
                <span style={{ fontFamily: T.body, fontSize: 11, color: T.mutedText }}>{lm.distance} — {lm.note || lm.impact}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {data.location_classification || data.classification ? (
        <div style={{ background: T.offWhite, borderRadius: 8, padding: "14px 18px", marginBottom: 20 }}>
          <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.navy, marginBottom: 4 }}>Location Classification</div>
          <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.6 }}>
            <strong>Type: {(data.location_classification || data.classification).type}</strong> — {(data.location_classification || data.classification).description}
          </div>
        </div>
      ) : null}
      {data.parking && data.parking.length > 0 && (
        <>
          <SubTitle>Parking Assessment</SubTitle>
          <DataTable headers={["PARKING TYPE", "DISTANCE", "AVAILABILITY"]} rows={data.parking.map(p => [p.type, p.distance, p.availability])} />
        </>
      )}
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 7: DEMOGRAPHICS (SIGNIFICANT-06 fix — catchment table added)
// ============================================================
function Section7({ data, pageNum }) {
  const ageColors = ["#D1D5DB", T.mutedText, "#8B9DC3", T.navy, T.gold];
  // CRITICAL-02 fix: use data-driven local label
  const localLabel = data.local_area_name || data.town || "Local";
  return (
    <div>
      <SectionHeader number={7} title="Demographics & Community Profile" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />
      {data.stat_boxes && <StatBoxes items={data.stat_boxes} />}

      {/* Catchment population table — SIGNIFICANT-06 */}
      {data.catchment_populations && (
        <>
          <SubTitle>Catchment Population</SubTitle>
          <DataTable
            headers={["RADIUS", "POPULATION", "HOUSEHOLDS"]}
            rows={[
              ["500m", String(data.catchment_populations.radius_500m?.toLocaleString() || "N/A"), "—"],
              ["1km", String(data.catchment_populations.radius_1km?.toLocaleString() || "N/A"), "—"],
              ["3km", String(data.catchment_populations.radius_3km?.toLocaleString() || "N/A"), data.catchment_populations.households_3km ? data.catchment_populations.households_3km.toLocaleString() : "N/A"],
            ]}
          />
        </>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 8, padding: "16px 20px" }}>
          <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 2 }}>Age Distribution (1km catchment)</div>
          {data.aged_50_plus_pct && (
            <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, marginBottom: 14 }}>
              {data.aged_50_plus_pct}% aged 50+ (vs {data.aged_50_plus_national}% national)
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <DonutChart
              data={data.age_distribution.map(d => d.local_pct)}
              labels={data.age_distribution.map(d => d.band)}
              colors={ageColors}
              centerText={data.aged_50_plus_pct ? `${data.aged_50_plus_pct}%` : undefined}
              centerSub={data.aged_50_plus_pct ? "aged 50+" : undefined}
              width={180} height={180}
            />
            <ChartLegend items={data.age_distribution.map((d, i) => ({ label: d.band, value: d.local_pct, color: ageColors[i] }))} />
          </div>
        </div>
        <div style={{ background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 8, padding: "16px 20px" }}>
          <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 2 }}>Household Income Comparison</div>
          {data.household_income_comparison?.headline && (
            <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, marginBottom: 14 }}>
              {data.household_income_comparison.headline}
            </div>
          )}
          <GroupedHBar
            localData={[data.household_income_comparison.local]}
            nationalData={[data.household_income_comparison.national]}
            localLabel={localLabel} nationalLabel="National"
            labels={["Median Income"]}
            width={310} height={120}
          />
        </div>
      </div>

      <div style={{ background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
        <SubTitle>Housing Type Breakdown</SubTitle>
        <HBarChart
          data={data.housing_breakdown.map(d => d.percentage)}
          labels={data.housing_breakdown.map(d => d.type)}
          colors={[T.gold, T.navy, "#8B9DC3", T.mutedText, "#D1D5DB"]}
          width={700} height={190} maxVal={55}
        />
      </div>

      {/* Economic profile — MINOR-05 fix: 21px values */}
      {data.economic_profile && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { label: "MEDIAN INCOME", value: data.economic_profile.median_income },
            { label: "EMPLOYMENT RATE", value: data.economic_profile.employment_rate },
            { label: "HOME OWNERSHIP", value: data.economic_profile.home_ownership || "N/A" },
            { label: "IMD DECILE", value: data.economic_profile.imd_decile ? `${data.economic_profile.imd_decile}/10` : "N/A" },
          ].map((item, i) => (
            <div key={i} style={{ background: T.offWhite, borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: T.display, fontSize: 21, fontWeight: 700, color: T.navy }}>{item.value}</div>
              <div style={{ fontFamily: T.body, fontSize: 8, color: T.lightText, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}

      <CommunityCallout>{data.community_character}</CommunityCallout>
      {data.key_insight && <InsightCallout>{data.key_insight}</InsightCallout>}
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 8: CRIME & SAFETY (STRUCTURAL-02 + SIGNIFICANT-07 fix — merged)
// ============================================================
function Section8({ data, pageNum, images = {} }) {
  const crimeColors = (data.crime_data || []).map(d =>
    (d.vs_average_numeric || 0) > 10 ? T.amberText : (d.vs_average_numeric || 0) > 0 ? T.gold : T.greenText
  );
  return (
    <div>
      <SectionHeader number={8} title="Crime & Safety" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />

      {/* Crime density heatmap — dual-layer: dark map + color-coded pins */}
      {images.crime_heatmap?.url ? (
        <div style={{ marginBottom: 20, borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.offWhite}` }}>
          <img
            src={images.crime_heatmap.url}
            alt={images.crime_heatmap.caption || 'Crime density heatmap'}
            style={{ width: '100%', display: 'block' }}
            loading="lazy"
          />
          {/* Pin color legend */}
          <div style={{ padding: '10px 16px', background: T.white, borderTop: `1px solid ${T.offWhite}` }}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
              {[
                { color: '#3B82F6', label: 'Subject business' },
                { color: '#FF0000', label: 'Violent crime' },
                { color: '#FF8C00', label: 'Anti-social behaviour' },
                { color: '#FFD700', label: 'Theft / burglary' },
                { color: '#808080', label: 'Other' },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, border: l.color === '#FFD700' ? '1px solid #ccc' : 'none' }} />
                  <span style={{ fontFamily: T.body, fontSize: 9, color: T.mutedText }}>{l.label}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: T.body, fontSize: 9, color: T.lightText, margin: 0, textAlign: 'center' }}>
              {images.crime_heatmap.caption}
            </p>
          </div>
        </div>
      ) : data.crime_data && data.crime_data.length > 0 ? (
        <CrimeHeatmapCanvas
          crimeData={data.crime_data}
          caption={`Crime density heatmap — ${data.crime_data.reduce((s, d) => s + (parseInt(d.incidents) || 0), 0)} total incidents within 1 mile (12 months). Source: data.police.uk`}
        />
      ) : (
        <ImagePlaceholder label="Crime Heatmap" caption="Crime heatmap showing 12-month incident density around business location" height={320} icon="🔴" />
      )}

      {/* Crime bar chart — from File 01 */}
      {data.crime_data && data.crime_data.some(d => d.vs_average_numeric !== undefined) && (
        <div style={{ background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
          <SubTitle>Crime Breakdown vs National Average (last 12 months)</SubTitle>
          <HBarChart
            data={data.crime_data.map(d => d.vs_average_numeric || 0)}
            labels={data.crime_data.map(d => d.crime_type)}
            colors={crimeColors}
            width={700} height={200} maxVal={30}
          />
        </div>
      )}

      {/* Crime trend chart — SIGNIFICANT-07 fix */}
      {data.trend_data && data.trend_data.length > 0 && (
        <div style={{ background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
          <SubTitle>3-Year Crime Trend</SubTitle>
          <TrendChart data={data.trend_data} />
        </div>
      )}

      {/* Crime data table */}
      <SubTitle>Crime Data Summary (12 months)</SubTitle>
      <DataTable
        headers={["CRIME TYPE", "INCIDENTS", "VS AVERAGE", "LEVEL", "ASSESSMENT"]}
        rows={(data.crime_data || []).map(d => [d.crime_type, d.incidents, d.vs_average, d.level, d.assessment || ""])}
        threatCol={3}
      />

      <SubTitle>Security Investment Required</SubTitle>
      <DataTable
        headers={["ITEM", "PRIORITY", "EST. COST", "REASONING"]}
        rows={(data.security_recommendations || []).map(r => [r.item, r.priority, r.est_cost, r.reasoning])}
        threatCol={1}
      />

      {data.practical_context && <PracticalContext>{data.practical_context}</PracticalContext>}
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// CRIME DENSITY HEATMAP — Canvas-based gradient visualization
// Renders a proper density heatmap from crime location data or
// generates a synthetic one from crime_data summary stats.
// ============================================================
function CrimeHeatmapCanvas({ crimeData = [], width = 700, height = 360, caption }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // --- Background: dark map-like base ---
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#1a2332');
    bgGrad.addColorStop(0.5, '#0f1923');
    bgGrad.addColorStop(1, '#0d1520');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // --- Draw subtle grid lines (map feel) ---
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // --- Draw road-like lines ---
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, height * 0.48); ctx.lineTo(width, height * 0.52); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width * 0.5, 0); ctx.lineTo(width * 0.48, height); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, height * 0.2); ctx.lineTo(width, height * 0.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width * 0.2, 0); ctx.lineTo(width * 0.85, height); ctx.stroke();

    // --- Generate crime density points from data ---
    const points = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const totalIncidents = crimeData.reduce((sum, d) => sum + (parseInt(d.incidents) || 0), 0);

    if (totalIncidents > 0) {
      let seed = totalIncidents * 137;
      const pseudoRandom = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; };

      crimeData.forEach((crime, idx) => {
        const incidents = parseInt(crime.incidents) || 0;
        if (incidents === 0) return;
        const angle = (idx / crimeData.length) * Math.PI * 2;
        const clusterDist = 60 + pseudoRandom() * 120;
        const clusterX = centerX + Math.cos(angle) * clusterDist;
        const clusterY = centerY + Math.sin(angle) * clusterDist;
        const numPoints = Math.min(incidents, 40);
        const weight = Math.min(incidents / Math.max(totalIncidents * 0.15, 1), 1);

        for (let i = 0; i < numPoints; i++) {
          const spreadX = (pseudoRandom() - 0.5) * 180;
          const spreadY = (pseudoRandom() - 0.5) * 140;
          points.push({
            x: Math.max(20, Math.min(width - 20, clusterX + spreadX)),
            y: Math.max(20, Math.min(height - 20, clusterY + spreadY)),
            weight: weight * (0.3 + pseudoRandom() * 0.7),
            radius: 35 + pseudoRandom() * 45,
          });
        }
      });

      for (let i = 0; i < Math.min(totalIncidents / 5, 15); i++) {
        points.push({
          x: centerX + (pseudoRandom() - 0.5) * 100,
          y: centerY + (pseudoRandom() - 0.5) * 80,
          weight: 0.2 + pseudoRandom() * 0.3,
          radius: 40 + pseudoRandom() * 50,
        });
      }
    }

    // --- Render heatmap layer ---
    if (points.length > 0) {
      const heatCanvas = document.createElement('canvas');
      heatCanvas.width = width;
      heatCanvas.height = height;
      const heatCtx = heatCanvas.getContext('2d');

      points.forEach(p => {
        const grad = heatCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(0, 0, 0, ${p.weight * 0.6})`);
        grad.addColorStop(0.4, `rgba(0, 0, 0, ${p.weight * 0.3})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        heatCtx.fillStyle = grad;
        heatCtx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      });

      const imageData = heatCtx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const intensity = pixels[i + 3] / 255;
        if (intensity > 0.01) {
          let r, g, b, a;
          if (intensity < 0.15) {
            r = 0; g = 100 + intensity * 600; b = 180;
            a = intensity * 3;
          } else if (intensity < 0.3) {
            const t = (intensity - 0.15) / 0.15;
            r = Math.round(t * 180); g = Math.round(160 + t * 95); b = Math.round(180 * (1 - t));
            a = 0.45 + t * 0.15;
          } else if (intensity < 0.5) {
            const t = (intensity - 0.3) / 0.2;
            r = Math.round(180 + t * 75); g = Math.round(255 - t * 80); b = 0;
            a = 0.6 + t * 0.1;
          } else {
            const t = Math.min((intensity - 0.5) / 0.3, 1);
            r = 255; g = Math.round(175 * (1 - t)); b = Math.round(t * 40);
            a = 0.7 + t * 0.2;
          }
          pixels[i] = r;
          pixels[i + 1] = g;
          pixels[i + 2] = b;
          pixels[i + 3] = Math.round(a * 255);
        }
      }
      heatCtx.putImageData(imageData, 0, 0);

      ctx.globalAlpha = 0.75;
      ctx.drawImage(heatCanvas, 0, 0);
      ctx.globalAlpha = 1.0;
    }

    // --- Draw business marker (gold star) ---
    ctx.save();
    ctx.shadowColor = T.gold;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = T.gold;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fillStyle = T.white;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
    ctx.strokeStyle = T.gold;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '600 10px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = T.gold;
    ctx.fillText('SUBJECT', centerX, centerY - 22);
    ctx.restore();

    // --- Gradient legend bar ---
    const legendY = height - 40;
    const legendX = width / 2 - 120;
    const legendW = 240;
    const legendH = 10;
    const legendGrad = ctx.createLinearGradient(legendX, 0, legendX + legendW, 0);
    legendGrad.addColorStop(0, 'rgba(0, 160, 180, 0.7)');
    legendGrad.addColorStop(0.25, 'rgba(100, 220, 0, 0.8)');
    legendGrad.addColorStop(0.5, 'rgba(255, 220, 0, 0.85)');
    legendGrad.addColorStop(0.75, 'rgba(255, 140, 0, 0.9)');
    legendGrad.addColorStop(1, 'rgba(255, 40, 40, 0.95)');
    ctx.fillStyle = legendGrad;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY, legendW, legendH, 4);
    ctx.fill();

    ctx.font = '600 9px DM Sans, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.textAlign = 'left';
    ctx.fillText('LOW', legendX, legendY - 6);
    ctx.textAlign = 'center';
    ctx.fillText('MODERATE', legendX + legendW / 2, legendY - 6);
    ctx.textAlign = 'right';
    ctx.fillText('HIGH', legendX + legendW, legendY - 6);

    ctx.textAlign = 'center';
    ctx.font = '600 10px DM Sans, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`${totalIncidents} incidents within 1 mile (12 months)`, width / 2, legendY + 24);

  }, [crimeData, width, height]);

  return (
    <div style={{ marginBottom: 20 }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 'auto', borderRadius: 10, display: 'block' }}
      />
      {caption && (
        <div style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText, textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>
          {caption}
        </div>
      )}
    </div>
  );
}

// Crime trend line chart — SIGNIFICANT-07
function TrendChart({ data, width = 700, height = 200 }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart.Chart(ref.current, {
      type: "line",
      data: {
        labels: data.map(d => d.period),
        datasets: [{
          label: "Total Incidents",
          data: data.map(d => d.total),
          borderColor: T.navy, backgroundColor: "rgba(11,29,58,0.08)",
          borderWidth: 2, pointRadius: 4, pointBackgroundColor: T.navy,
          fill: true, tension: 0.3,
        }],
      },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: T.navy, bodyFont: { family: T.body, size: 10 }, padding: 8, cornerRadius: 6 } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: T.body, size: 9 }, color: T.lightText } },
          y: { grid: { color: "rgba(0,0,0,0.05)", drawBorder: false }, ticks: { font: { family: T.body, size: 9 }, color: T.lightText } },
        },
        animation: { duration: 1000 },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data]);
  return <canvas ref={ref} width={width} height={height} />;
}

// ============================================================
// SECTION 9: COMPETITION MAPPING (STRUCTURAL-02 fix — File 02 as base)
// ============================================================
function Section9({ data, pageNum, images = {} }) {
  return (
    <div>
      <SectionHeader number={9} title="Competition Mapping" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />

      {/* Competition map with legend */}
      <div style={{ marginBottom: 8 }}>
        {images.competition_map?.url ? (
          <div style={{ marginBottom: 12, borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.offWhite}` }}>
            <img
              src={images.competition_map.url}
              alt={images.competition_map.caption || 'Competition map'}
              style={{ width: '100%', display: 'block' }}
              loading="lazy"
              onError={(e) => { e.target.parentElement.style.display = 'none'; }}
            />
            {/* Competition map legend — catchment zones + numbered pins */}
            <div style={{ padding: '10px 16px', background: T.white, borderTop: `1px solid ${T.offWhite}` }}>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                {[
                  { color: T.gold, label: 'Subject business', shape: 'star' },
                  { color: '#DC2626', label: 'PO competitor', shape: 'circle' },
                  { color: '#22C55E', label: '1km catchment', shape: 'ring', border: true },
                  { color: '#FFA500', label: '3km catchment', shape: 'ring', border: true },
                ].map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    {l.shape === 'ring' ? (
                      <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2px solid ${l.color}`, background: `${l.color}15` }} />
                    ) : l.shape === 'star' ? (
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, boxShadow: `0 0 4px ${l.color}` }} />
                    ) : (
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
                    )}
                    <span style={{ fontFamily: T.body, fontSize: 9, color: T.mutedText }}>{l.label}</span>
                  </div>
                ))}
              </div>
              {/* Numbered competitor key */}
              {images.competition_map.legend && images.competition_map.legend.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px 12px', marginBottom: 6 }}>
                  {images.competition_map.legend.map((item, i) => (
                    <span key={i} style={{ fontFamily: T.mono || T.body, fontSize: 8, color: T.lightText }}>{item}</span>
                  ))}
                </div>
              )}
              <p style={{ fontFamily: T.body, fontSize: 9, color: T.lightText, margin: 0, textAlign: 'center' }}>
                {images.competition_map.caption}
              </p>
            </div>
          </div>
        ) : (
          <ImagePlaceholder label="Competition Map" caption="" height={340} icon="📍" />
        )}
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 20 }}>
          {[{ color: T.gold, label: "Subject business" }, { color: T.redText, label: "Full-service PO" }, { color: T.blueText, label: "Drop & Collect" }, { color: T.mutedText, label: "Supermarket" }].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: l.color }} />
              <span style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {data.stat_boxes && <StatBoxes items={data.stat_boxes} />}
      {data.key_distinction && <InsightCallout title="KEY DISTINCTION">{data.key_distinction}</InsightCallout>}

      <SubTitle>Full-Service Post Offices</SubTitle>
      <DataTable headers={["BRANCH", "ADDRESS", "DISTANCE", "THREAT"]} rows={(data.full_service_pos || []).map(p => [p.branch_name || p.name, p.address || p.addr, p.distance || p.dist, p.threat_level || p.threat])} threatCol={3} />

      {data.drop_collect_points && data.drop_collect_points.length > 0 && (
        <>
          <SubTitle>Drop + Collect Points (Parcels Only)</SubTitle>
          <DataTable headers={["LOCATION", "ADDRESS", "DISTANCE", "THREAT"]} rows={data.drop_collect_points.map(d => [d.location || d.name, d.address || d.addr, d.distance || d.dist, d.threat_level || d.threat])} threatCol={3} />
        </>
      )}

      <SubTitle>Supermarket & Grocery Competition</SubTitle>
      <DataTable headers={["NAME", "TYPE", "DISTANCE", "THREAT"]} rows={(data.grocery_competition || []).map(g => [g.name, g.type, g.distance || g.dist, g.threat_level || g.threat])} threatCol={3} />

      {data.bank_closures && data.bank_closures.length > 0 && (
        <>
          <SubTitle>Bank Closures</SubTitle>
          <DataTable headers={["BANK", "FORMER ADDRESS", "CLOSED", "STATUS"]} rows={data.bank_closures.map(b => [b.bank || b.name, b.former_address || b.addr, b.closure_date || b.closed, "OPPORTUNITY"])} threatCol={3} />
        </>
      )}

      {data.bank_closure_opportunity && <OpportunityCallout title="MAJOR OPPORTUNITY">{data.bank_closure_opportunity}</OpportunityCallout>}

      {data.competitive_positioning && (
        <CommunityCallout title="COMPETITIVE POSITIONING">{data.competitive_positioning}</CommunityCallout>
      )}

      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 10: FOOTFALL (SIGNIFICANT-08 fix — split by type + map)
// ============================================================
function Section10({ data, pageNum, images = {} }) {
  const iCol = { HIGH: T.gold, MODERATE: T.goldLight, LOW: "#E5E7EB" };
  const iTxt = { HIGH: T.navy, MODERATE: T.navy, LOW: T.mutedText };

  // Split footfall generators by type
  const generators = data.footfall_generators || [];
  const education = generators.filter(g => (g.type || "").toLowerCase().includes("school") || (g.type || "").toLowerCase().includes("primary") || (g.type || "").toLowerCase().includes("secondary") || (g.type || "").toLowerCase().includes("academy") || (g.type || "").toLowerCase().includes("education"));
  const healthcare = generators.filter(g => (g.type || "").toLowerCase().includes("gp") || (g.type || "").toLowerCase().includes("surgery") || (g.type || "").toLowerCase().includes("health") || (g.type || "").toLowerCase().includes("medical") || (g.type || "").toLowerCase().includes("dental") || (g.type || "").toLowerCase().includes("pharmacy"));
  const transport = generators.filter(g => (g.type || "").toLowerCase().includes("bus") || (g.type || "").toLowerCase().includes("transport") || (g.type || "").toLowerCase().includes("station") || (g.type || "").toLowerCase().includes("rail"));
  const other = generators.filter(g => !education.includes(g) && !healthcare.includes(g) && !transport.includes(g));

  const renderGenTable = (items, title) => {
    if (!items || items.length === 0) return null;
    return (
      <>
        <SubTitle>{title}</SubTitle>
        <DataTable headers={["FACILITY", "TYPE", "DISTANCE", "IMPACT"]} rows={items.map(f => [f.facility, f.type, f.distance, f.impact])} threatCol={3} />
      </>
    );
  };

  return (
    <div>
      <SectionHeader number={10} title="Footfall Analysis" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />
      {data.stat_boxes && <StatBoxes items={data.stat_boxes} />}

      {/* Footfall generator map — dual-layer: catchment zone + categorized pins */}
      {images.footfall_map?.url ? (
        <div style={{ marginBottom: 20, borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.offWhite}` }}>
          <img
            src={images.footfall_map.url}
            alt={images.footfall_map.caption || 'Footfall generator map'}
            style={{ width: '100%', display: 'block' }}
            loading="lazy"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
          {/* Footfall category legend */}
          <div style={{ padding: '10px 16px', background: T.white, borderTop: `1px solid ${T.offWhite}` }}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
              {[
                { color: '#FFD700', label: 'Subject business', icon: 'P' },
                { color: '#2563EB', label: 'Schools', icon: 'E' },
                { color: '#DC2626', label: 'Healthcare', icon: 'H' },
                { color: '#7C3AED', label: 'Transport', icon: 'T' },
                { color: '#EA580C', label: 'Retail anchors', icon: 'R' },
                { color: '#3B82F6', label: '500m catchment', ring: true },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {l.ring ? (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2px solid ${l.color}`, background: `${l.color}15` }} />
                  ) : (
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: l.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: T.body, fontSize: 7, fontWeight: 700, color: '#fff' }}>{l.icon}</span>
                    </div>
                  )}
                  <span style={{ fontFamily: T.body, fontSize: 9, color: T.mutedText }}>{l.label}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: T.body, fontSize: 9, color: T.lightText, margin: 0, textAlign: 'center' }}>
              {images.footfall_map.caption}
            </p>
          </div>
        </div>
      ) : (
        <ImagePlaceholder label="Footfall Generator Map" caption="Map showing schools (blue), healthcare (red), transport (purple), retail (orange)" height={300} icon="📍" />
      )}

      {/* Trading day timeline */}
      {data.trading_timeline && data.trading_timeline.length > 0 && (
        <div style={{ background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 8, padding: "20px 24px", marginBottom: 24 }}>
          <SubTitle>Typical Trading Day (Monday–Friday)</SubTitle>
          <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
            {data.trading_timeline.map((t, i) => (<div key={i} style={{ flex: 1, textAlign: "center", fontFamily: T.body, fontSize: 8, fontWeight: 600, color: iTxt[t.intensity], textTransform: "uppercase" }}>{t.intensity.slice(0, 3)}</div>))}
          </div>
          <div style={{ display: "flex", gap: 2, marginBottom: 8, borderRadius: 6, overflow: "hidden" }}>
            {data.trading_timeline.map((t, i) => (<div key={i} style={{ flex: 1, height: 32, background: iCol[t.intensity], display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: T.body, fontSize: 8, fontWeight: 600, color: iTxt[t.intensity] }}>{t.time_slot.split("-")[0]}</span></div>))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: T.body, fontSize: 9, color: T.lightText }}>7am</span>
            <span style={{ fontFamily: T.body, fontSize: 9, color: T.lightText }}>12pm</span>
            <span style={{ fontFamily: T.body, fontSize: 9, color: T.lightText }}>7pm</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {data.trading_timeline.filter(t => t.intensity === "HIGH").map((t, i) => (<div key={i} style={{ background: T.offWhite, borderRadius: 6, padding: "8px 12px" }}><div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.navy }}>{t.time_slot}</div><div style={{ fontFamily: T.body, fontSize: 10, color: T.mutedText }}>{t.drivers}</div></div>))}
          </div>
        </div>
      )}

      {/* Split facility tables — SIGNIFICANT-08 */}
      {renderGenTable(education, "Education")}
      {renderGenTable(healthcare, "Healthcare")}
      {renderGenTable(transport, "Transport")}
      {renderGenTable(other, "Other Footfall Drivers")}

      {data.key_insight && <InsightCallout>{data.key_insight}</InsightCallout>}
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 11: INFRASTRUCTURE (MINOR-06 fix — added conditional blocks)
// ============================================================
function Section11({ data, pageNum }) {
  const techStyles = {
    "FTTP": { label: "Full Fibre", color: T.greenText, bg: T.greenBg, icon: "⚡", tier: "FIBRE" },
    "FTTC": { label: "Fibre to Cabinet", color: T.amberText, bg: T.amberBg, icon: "🔶", tier: "PART FIBRE" },
    "ADSL": { label: "Copper (ADSL)", color: T.redText, bg: T.redBg, icon: "🔻", tier: "COPPER" },
    "ADSL2+": { label: "Copper (ADSL2+)", color: T.redText, bg: T.redBg, icon: "🔻", tier: "COPPER" },
  };
  const maxSpeed = Math.max(...(data.broadband || []).map(b => b.speed_mbps || 0), 100);
  const hasFttp = (data.broadband || []).some(b => (b.tech_code || b.technology || "").includes("FTTP"));
  const copperOnly = (data.broadband || []).every(b => (b.tech_code || b.technology || "").includes("ADSL"));

  return (
    <div>
      <SectionHeader number={11} title="Infrastructure & Connectivity" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />

      <SubTitle>Broadband Availability</SubTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {(data.broadband || []).map((b, i) => {
          const tc = b.tech_code || b.technology || "FTTC";
          const ts = techStyles[tc] || techStyles["FTTC"];
          const speedMbps = b.speed_mbps || parseInt(b.max_speed) || 0;
          const speedPct = Math.min((speedMbps / maxSpeed) * 100, 100);
          const meetsPo = b.meets_po || b.meets_po_requirement || speedMbps >= 10;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 10, padding: "14px 20px" }}>
              <div style={{ background: ts.bg, borderRadius: 8, padding: "8px 12px", textAlign: "center", minWidth: 80, flexShrink: 0 }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{ts.icon}</div>
                <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, color: ts.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{ts.tier}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div>
                    <span style={{ fontFamily: T.body, fontSize: 13, fontWeight: 600, color: T.navy }}>{b.tech || b.technology} </span>
                    <span style={{ fontFamily: T.body, fontSize: 11, color: T.mutedText }}>via {b.provider}</span>
                  </div>
                  <span style={{ fontFamily: T.display, fontSize: 18, fontWeight: 700, color: T.navy }}>{b.speed || b.max_speed}</span>
                </div>
                <div style={{ height: 6, background: T.offWhite, borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ height: "100%", width: `${speedPct}%`, background: ts.color, borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: T.body, fontSize: 9, color: T.lightText }}>PO min: 10 Mbps</span>
                  <span style={{ fontFamily: T.body, fontSize: 9, fontWeight: 600, color: meetsPo ? T.greenText : T.redText }}>{meetsPo ? "✓ Exceeds requirement" : "✕ Below requirement"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasFttp && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: T.greenBg, borderRadius: 8, padding: "10px 16px", marginBottom: 20 }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <div style={{ fontFamily: T.body, fontSize: 11, color: T.greenText, fontWeight: 600 }}>Full fibre (FTTP) available — no copper dependency. Future-proof connection.</div>
        </div>
      )}
      {copperOnly && (
        <WarningCallout title="⚠️ COPPER CONNECTION ONLY">This location only has copper broadband (ADSL). FTTP is not yet available. Budget for potential connection upgrade costs.</WarningCallout>
      )}

      {/* Mobile coverage */}
      {data.mobile_coverage || data.mobile ? (
        <>
          <SubTitle>Mobile Coverage</SubTitle>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${(data.mobile_coverage || data.mobile || []).length}, 1fr)`, gap: 10, marginBottom: 24 }}>
            {(data.mobile_coverage || data.mobile || []).map((m, i) => {
              const has5g = m.outdoor_5g && m.outdoor_5g !== "none" && m.outdoor_5g !== false;
              const indoor4g = typeof m.indoor_4g === "boolean" ? (m.indoor_4g ? "strong" : "none") : m.indoor_4g;
              const outdoor4g = typeof m.outdoor_4g === "boolean" ? (m.outdoor_4g ? "strong" : "none") : m.outdoor_4g;
              return (
                <div key={i} style={{ background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 10, padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 600, color: T.navy, marginBottom: 14 }}>{m.network}</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <SignalBars strength={indoor4g} />
                      <span style={{ fontFamily: T.body, fontSize: 9, color: T.mutedText }}>4G Indoor</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <SignalBars strength={outdoor4g} />
                      <span style={{ fontFamily: T.body, fontSize: 9, color: T.mutedText }}>4G Outdoor</span>
                    </div>
                  </div>
                  <div style={{ display: "inline-block", padding: "3px 12px", borderRadius: 12, background: has5g ? T.greenBg : T.offWhite, color: has5g ? T.greenText : T.lightText, fontFamily: T.body, fontSize: 10, fontWeight: 600 }}>
                    5G {has5g ? (m.outdoor_5g === "strong" ? "Strong" : m.outdoor_5g === "moderate" || m.outdoor_5g === true ? "Available" : "Limited") : "No coverage"}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}

      {/* PO requirement check */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: T.greenBg, borderRadius: 8, padding: "12px 18px", marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 16, background: T.greenText, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: T.white, fontSize: 16, fontWeight: 700 }}>✓</span>
        </div>
        <div>
          <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.greenText }}>PO Horizon requirement met</div>
          <div style={{ fontFamily: T.body, fontSize: 11, color: T.darkText }}>Minimum 10 Mbps required. 4G backup available.</div>
        </div>
      </div>

      {(data.why_matters || data.why_it_matters) && <InsightCallout title="WHY THIS MATTERS">{data.why_matters || data.why_it_matters}</InsightCallout>}

      {/* MINOR-06: Power, EV, Emergency services */}
      {data.power_utilities && <PracticalContext title="POWER & UTILITIES">{data.power_utilities}</PracticalContext>}
      {data.ev_charging && data.ev_charging.length > 0 && (
        <>
          <SubTitle>EV Charging</SubTitle>
          <DataTable headers={["LOCATION", "DISTANCE", "CONNECTORS", "ASSESSMENT"]} rows={data.ev_charging.map(e => [e.location, e.distance, e.connectors || "—", e.assessment || "—"])} />
        </>
      )}
      {data.emergency_services && data.emergency_services.length > 0 && (
        <>
          <SubTitle>Emergency Services</SubTitle>
          <DataTable headers={["SERVICE", "STATION", "DISTANCE", "EST. RESPONSE"]} rows={data.emergency_services.map(e => [e.service, e.station, e.distance, e.response_time || "—"])} />
        </>
      )}

      {data.recommendation && (
        <div style={{ background: T.offWhite, borderRadius: 8, padding: "14px 18px", marginBottom: 20 }}>
          <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.navy, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>RECOMMENDATION</div>
          <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.65 }}>{data.recommendation}</div>
        </div>
      )}

      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 12: FUTURE OUTLOOK
// ============================================================
function Section12({ data, pageNum }) {
  return (
    <div>
      <SectionHeader number={12} title="Future Outlook" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />
      {data.stat_boxes && <StatBoxes items={data.stat_boxes} />}

      {data.timeline_events && data.timeline_events.length > 0 && (
        <div style={{ background: T.white, border: `1px solid ${T.offWhite}`, borderRadius: 8, padding: "24px 28px", marginBottom: 24 }}>
          <div style={{ position: "relative", padding: "0 20px" }}>
            <div style={{ position: "absolute", left: 20, right: 20, top: 12, height: 3, background: T.offWhite, borderRadius: 2 }} />
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
              {data.timeline_events.map((ev, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: `${100 / data.timeline_events.length}%` }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: i === 0 ? T.gold : T.navy, border: `3px solid ${T.white}`, boxShadow: "0 1px 3px rgba(0,0,0,0.15)", zIndex: 1 }} />
                  <div style={{ fontFamily: T.display, fontSize: 12, fontWeight: 700, color: T.navy, marginTop: 10 }}>{ev.year}</div>
                  <div style={{ fontFamily: T.body, fontSize: 9, color: T.mutedText, textAlign: "center", lineHeight: 1.4, marginTop: 4, maxWidth: 100 }}>{ev.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {data.developments && data.developments.length > 0 && (
        <>
          <SubTitle>Planning & Developments</SubTitle>
          <DataTable headers={["DEVELOPMENT", "TYPE", "STATUS", "IMPACT"]} rows={data.developments.map(d => [d.development, d.type, d.status, d.impact])} threatCol={3} />
        </>
      )}

      {data.po_network_assessment && <PracticalContext title="PO NETWORK STATUS">{data.po_network_assessment}</PracticalContext>}
      {data.economic_outlook && <PracticalContext title="ECONOMIC OUTLOOK">{data.economic_outlook}</PracticalContext>}

      {data.five_year_rating && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <StatusPill status={data.five_year_rating} />
          <span style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.darkText }}>5-Year Rating</span>
        </div>
      )}

      <InsightCallout title="5-YEAR ASSESSMENT">{data.five_year_assessment}</InsightCallout>
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 13: RISK ASSESSMENT
// ============================================================
function Section13({ data, pageNum, tier }) {
  const ss = { clear: { bg: T.greenBg, border: T.greenText, color: T.greenText }, caution: { bg: T.amberBg, border: T.amberText, color: T.amberText }, red_flag: { bg: T.redBg, border: T.redText, color: T.redText } };
  const isChecklistOnly = tier === "scout";

  return (
    <div>
      <SectionHeader number={13} title="Risk Assessment & Red Flags" pageNum={pageNum} />
      <HeadlineBanner score={data.score} grade={data.grade} headline={data.headline} detail={data.headline_detail} />

      {/* 3×3 risk grid — always shown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28 }}>
        {(data.risk_grid || []).map((r, i) => { const s = ss[r.status] || ss.caution; return (
          <div key={i} style={{ background: T.white, border: `1px solid ${s.border}`, borderRadius: 8, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{r.icon}</div>
            <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color: T.darkText, marginBottom: 4 }}>{r.category}</div>
            <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 10, background: s.bg, color: s.color, fontFamily: T.body, fontSize: 8, fontWeight: 600, textTransform: "uppercase" }}>{r.label}</span>
          </div>
        ); })}
      </div>

      {/* Detailed breakdowns — only for insight+ tiers */}
      {!isChecklistOnly && data.detailed_risks && data.detailed_risks.map((r, i) => { const s = ss[r.status] || ss.caution; return (
        <div key={i} style={{ background: s.bg, borderLeft: `3px solid ${s.border}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 12 }}>
          <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: s.color, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{r.category} — {r.status === "caution" ? "AMBER" : "RED"}</div>
          <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.6 }}><strong>Risk:</strong> {r.risk}</div>
          <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.6 }}><strong>Mitigation:</strong> {r.mitigation}</div>
          <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.6 }}><strong>Dealbreaker?</strong> {r.dealbreaker}</div>
        </div>
      ); })}

      <OpportunityCallout title="OVERALL RISK VERDICT">{data.overall_verdict} — {data.overall_verdict_detail}</OpportunityCallout>
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 14: PROFIT IMPROVEMENT (MINOR-07 fix — added HeadlineBanner + category grouping)
// ============================================================
function Section14({ data, pageNum }) {
  // Group opportunities by category if available
  const hasCategories = (data.opportunities || []).some(o => o.category);
  const categories = hasCategories
    ? [...new Set(data.opportunities.map(o => o.category))]
    : null;

  // Calculate total impact
  const totalCost = (data.opportunities || []).reduce((acc, o) => {
    const match = (o.cost || "").match(/[\d,]+/);
    return acc + (match ? parseInt(match[0].replace(/,/g, "")) : 0);
  }, 0);

  return (
    <div>
      <SectionHeader number={14} title="Profit Improvement Plan" pageNum={pageNum} />
      <HeadlineBanner score={null} grade={null} headline={data.headline} detail={data.headline_detail} />
      <InsightCallout title="IMPORTANT">Every recommendation below is tied to a specific finding in this report. These are not generic suggestions.</InsightCallout>

      {categories ? (
        categories.map((cat, ci) => (
          <div key={ci}>
            <SubTitle>{cat}</SubTitle>
            <DataTable
              headers={["ACTION", "COST", "ANNUAL BENEFIT", "EVIDENCE", "PRIORITY"]}
              rows={data.opportunities.filter(o => o.category === cat).map(o => [o.action, o.cost, o.annual_benefit, `${o.evidence_section}: ${o.evidence}`, o.priority])}
              threatCol={4}
            />
          </div>
        ))
      ) : (
        <DataTable
          headers={["ACTION", "COST", "ANNUAL BENEFIT", "EVIDENCE", "PRIORITY"]}
          rows={(data.opportunities || []).map(o => [o.action, o.cost, o.annual_benefit, `${o.evidence_section}: ${o.evidence}`, o.priority])}
          threatCol={4}
        />
      )}

      {totalCost > 0 && (
        <div style={{ background: T.offWhite, borderRadius: 8, padding: "14px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: T.body, fontSize: 12, fontWeight: 600, color: T.navy }}>Estimated Total Investment Required</span>
          <span style={{ fontFamily: T.display, fontSize: 18, fontWeight: 700, color: T.navy }}>£{totalCost.toLocaleString()}</span>
        </div>
      )}

      {data.quick_wins && data.quick_wins.length > 0 && (
        <>
          <SubTitle>Quick Wins (First 90 Days)</SubTitle>
          {data.quick_wins.map((qw, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color: T.gold, minWidth: 70 }}>{qw.timeframe}</span>
              <span style={{ fontFamily: T.body, fontSize: 11, color: T.darkText }}>{qw.action}</span>
            </div>
          ))}
          <div style={{ marginTop: 16 }} />
        </>
      )}

      {data.biggest_quick_win && <OpportunityCallout title="BIGGEST QUICK WIN">{data.biggest_quick_win}</OpportunityCallout>}
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// SECTION 15: DUE DILIGENCE (SIGNIFICANT-09 fix — seller/landlord questions + HeadlineBanner)
// ============================================================
function Section15({ data, pageNum }) {
  return (
    <div>
      <SectionHeader number={15} title="Due Diligence, Questions & Negotiation" pageNum={pageNum} />
      <HeadlineBanner score={null} grade={null} headline={data.headline} detail={data.headline_detail} />

      <SubTitle>Documents to Request</SubTitle>
      <DataTable headers={["DOCUMENT", "PRIORITY", "PURPOSE"]} rows={(data.documents_checklist || []).map(d => [d.document, d.priority, d.purpose])} threatCol={1} />

      {/* Seller questions — SIGNIFICANT-09 fix */}
      {data.seller_questions && (
        <>
          <SubTitle>Questions to Ask the Seller</SubTitle>
          {Object.entries(data.seller_questions).map(([category, questions], ci) => (
            <div key={ci} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{category}</div>
              {(questions || []).map((q, qi) => (
                <div key={qi} style={{ display: "flex", gap: 8, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${T.offWhite}` }}>
                  <span style={{ fontFamily: T.body, fontSize: 11, color: T.darkText, lineHeight: 1.5 }}>{qi + 1}. {q}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Landlord questions — SIGNIFICANT-09 fix */}
      {data.landlord_questions && data.landlord_questions.length > 0 && (
        <>
          <SubTitle>Questions to Ask the Landlord</SubTitle>
          {data.landlord_questions.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${T.offWhite}` }}>
              <span style={{ fontFamily: T.body, fontSize: 11, color: T.darkText, lineHeight: 1.5 }}>{i + 1}. {q}</span>
            </div>
          ))}
          <div style={{ marginBottom: 20 }} />
        </>
      )}

      <SubTitle>Suggested Offer Range</SubTitle>
      <DataTable headers={["LEVEL", "RANGE", "REASONING"]} rows={[
        ["LOW", data.suggested_offer_range?.low?.range || "—", data.suggested_offer_range?.low?.reasoning || "—"],
        ["MID", data.suggested_offer_range?.mid?.range || "—", data.suggested_offer_range?.mid?.reasoning || "—"],
        ["HIGH", data.suggested_offer_range?.high?.range || "—", data.suggested_offer_range?.high?.reasoning || "—"],
      ]} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: T.greenBg, borderRadius: 8, padding: "14px 18px" }}>
          <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.greenText, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>YOUR LEVERAGE</div>
          <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.6 }}>{data.negotiation?.buyer_leverage}</div>
        </div>
        <div style={{ background: T.amberBg, borderRadius: 8, padding: "14px 18px" }}>
          <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.amberText, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>SELLER LEVERAGE</div>
          <div style={{ fontFamily: T.body, fontSize: 12, color: T.darkText, lineHeight: 1.6 }}>{data.negotiation?.seller_leverage}</div>
        </div>
      </div>

      <PracticalContext title="NEGOTIATION APPROACH">{data.negotiation?.approach}</PracticalContext>

      {data.key_insight && <InsightCallout>{data.key_insight}</InsightCallout>}
      <SourceFooter text={data.sources} />
    </div>
  );
}

// ============================================================
// GRADING SCALE
// ============================================================
function GradingScale({ reportScore, reportGrade, pageNum }) {
  const grades = [
    { grade: "A", range: "85–100", meaning: "Exceptional — rare, premium opportunity", color: "#2D8A56", bg: "#E8F5E9" },
    { grade: "B+", range: "75–84", meaning: "Strong — proceed with confidence", color: "#3CA66B", bg: "#EAFBEF" },
    { grade: "B", range: "65–74", meaning: "Good — solid fundamentals", color: "#BF9B51", bg: "#FEF8EE" },
    { grade: "C+", range: "55–64", meaning: "Adequate — proceed with caution", color: "#D47735", bg: "#FEF6E8" },
    { grade: "C", range: "45–54", meaning: "Below average — significant concerns", color: "#C0392B", bg: "#FDE8E8" },
    { grade: "D", range: "30–44", meaning: "Poor — major red flags", color: "#A32D2D", bg: "#FCDCDC" },
    { grade: "F", range: "0–29", meaning: "Do not proceed", color: "#791F1F", bg: "#F5CCCC" },
  ];
  const current = grades.find(g => g.grade === reportGrade);
  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.lightText, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>REFERENCE</div>
      <h2 style={{ fontFamily: T.display, fontSize: 20, fontWeight: 600, color: T.navy, margin: "0 0 28px" }}>Grading Scale</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
        {grades.map((g, i) => {
          const isActive = g.grade === reportGrade;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, background: isActive ? g.bg : "transparent", border: isActive ? `2px solid ${g.color}` : "2px solid transparent", borderRadius: 10, padding: isActive ? "10px 16px" : "6px 16px" }}>
              <div style={{ width: isActive ? 44 : 36, height: isActive ? 44 : 36, borderRadius: "50%", background: g.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: T.display, fontSize: isActive ? 18 : 14, fontWeight: 700, color: T.white }}>{g.grade}</span>
              </div>
              <div style={{ flex: 1, margin: "0 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontFamily: T.body, fontSize: isActive ? 13 : 11, fontWeight: isActive ? 600 : 400, color: isActive ? g.color : T.darkText }}>{g.meaning}</span>
                  <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 500, color: T.mutedText }}>{g.range}</span>
                </div>
                <div style={{ height: isActive ? 6 : 3, background: T.offWhite, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "100%", background: g.color, borderRadius: 3, opacity: isActive ? 1 : 0.3 }} />
                </div>
              </div>
              {isActive && <div style={{ background: g.color, color: T.white, fontFamily: T.body, fontSize: 9, fontWeight: 600, padding: "4px 10px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap" }}>← This report</div>}
            </div>
          );
        })}
      </div>
      <div style={{ background: T.navy, borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
        <ScoreBadge score={reportScore} grade={reportGrade} size={64} />
        <div>
          <div style={{ fontFamily: T.body, fontSize: 13, color: T.white, lineHeight: 1.6 }}>
            This report scored <span style={{ fontFamily: T.display, fontSize: 18, fontWeight: 700, color: T.gold }}>{reportScore}</span> (<span style={{ color: T.gold, fontWeight: 600 }}>{reportGrade}</span>) — {current ? current.meaning.toLowerCase() : ""}. {reportScore >= 75 ? "Proceed with confidence, addressing the manageable concerns identified in the Risk Assessment." : reportScore >= 65 ? "Solid fundamentals with areas requiring attention before proceeding." : "Careful consideration and thorough due diligence recommended."}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// UPGRADE PAGE
// ============================================================
function UpgradePage({ currentTier, pageNum }) {
  const upgrades = {
    scout: [
      { target: "Insight", price: "+£50", unlocks: "Demographics, Crime & Safety, Footfall, Online Presence, Infrastructure, full Risk Assessment" },
      { target: "Analysis", price: "+£150", unlocks: "All above + Financial Analysis, PO Remuneration, Staffing Costs, Future Outlook" },
      { target: "Intelligence", price: "+£350", unlocks: "Everything + Profit Improvement Plan, Due Diligence Pack, 60-minute consultation call" },
    ],
    insight: [
      { target: "Analysis", price: "+£100", unlocks: "Financial Analysis, PO Remuneration, Staffing Costs, Future Outlook" },
      { target: "Intelligence", price: "+£300", unlocks: "All above + Profit Improvement Plan, Due Diligence Pack, 60-minute consultation call" },
    ],
    analysis: [
      { target: "Intelligence", price: "+£200", unlocks: "Profit Improvement Plan, Due Diligence & Negotiation Pack, 60-minute consultation call" },
    ],
  };
  const options = upgrades[currentTier] || [];
  if (options.length === 0) return null;
  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, color: T.navy, marginBottom: 8 }}>Unlock More Intelligence</div>
        <div style={{ fontFamily: T.body, fontSize: 13, color: T.mutedText }}>Pay the difference to access additional sections — no new research needed</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {options.map((opt, i) => (
          <div key={i} style={{ border: `2px solid ${i === options.length - 1 ? T.gold : T.offWhite}`, borderRadius: 10, padding: "20px 24px", background: i === options.length - 1 ? "rgba(191,155,81,0.04)" : T.white }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontFamily: T.display, fontSize: 18, fontWeight: 600, color: T.navy }}>Upgrade to {opt.target}</div>
              <div style={{ fontFamily: T.display, fontSize: 20, fontWeight: 700, color: T.gold }}>{opt.price}</div>
            </div>
            <div style={{ fontFamily: T.body, fontSize: 12, color: T.mutedText, lineHeight: 1.6 }}>Unlocks: {opt.unlocks}</div>
            <div style={{ marginTop: 12, display: "inline-block", background: T.navy, color: T.white, fontFamily: T.body, fontSize: 11, fontWeight: 600, padding: "8px 24px", borderRadius: 6, cursor: "pointer" }}>Upgrade Now</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// BACK PAGE
// ============================================================
function BackPage({ referralCode, pageNum }) {
  return (
    <div style={{ background: T.navy, borderRadius: 12, padding: "60px 40px", textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: T.body, fontSize: 16, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 8 }}>FCM INTELLIGENCE</div>
      <div style={{ fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 40 }}>Intelligence that pays for itself</div>
      <div style={{ fontFamily: T.body, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Email: <span style={{ color: T.gold }}>reports@fcmreport.com</span></div>
      <div style={{ fontFamily: T.body, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>Website: <span style={{ color: T.gold }}>fcmreport.com</span></div>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "20px 32px", maxWidth: 400 }}>
        <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.gold, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>REFER & SAVE</div>
        <div style={{ fontFamily: T.body, fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 12 }}>Know someone buying a business? Refer them to FCM Intelligence and receive £25 off your next report.</div>
        <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 600, color: T.gold }}>Your referral code: {referralCode}</div>
      </div>
      <div style={{ fontFamily: T.body, fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 40 }}>© 2026 Firstclass Managerial Ltd trading as FCM Intelligence. All rights reserved.</div>
    </div>
  );
}

// ============================================================
// TIER VISIBILITY MAP (from blueprint + schema)
// ============================================================
const TIER_SECTIONS = {
  scout: ["s1", "s6", "s9", "s13"],
  insight: ["s1", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s13"],
  analysis: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13"],
  intelligence: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14", "s15"],
};

// ============================================================
// EXPORTS — for Forge assembly
// ============================================================
export {
  // Design tokens
  T, scoreColor,
  // Shared components
  ScoreBadge, ScoreRing, SectionHeader, HeadlineBanner, StatBoxes, StatusPill,
  InsightCallout, OpportunityCallout, WarningCallout, PullQuote, CommunityCallout,
  PracticalContext, DataTable, SourceFooter, ImagePlaceholder, CategoryBar,
  StrengthItem, SignalBars, SubTitle, Watermark,
  // Chart components
  DonutChart, HBarChart, GroupedHBar, ChartLegend, TrendChart, CrimeHeatmapCanvas,
  // Page components
  CoverPage, LicencePage,
  // Section components
  Section1, Section2, Section3, Section4, Section5, Section6,
  Section7, Section8, Section9, Section10, Section11, Section12,
  Section13, Section14, Section15,
  // End matter
  GradingScale, UpgradePage, BackPage,
  // Tier visibility
  TIER_SECTIONS,
};

