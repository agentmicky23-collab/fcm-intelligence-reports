// components/LockedSectionTeaser.jsx
// Locked section teaser for Insight tier users
// Props: sectionId, sectionTitle, sectionScore, sectionGrade
// Uses inline styles matching FCM report design system

import { useState } from 'react';
import { T, SectionHeader, ScoreRing } from './fcm-report-components-v2';

// Teaser descriptions for locked sections
const SECTION_TEASERS = {
  s2_financial_analysis: "Detailed financial breakdown including asking price analysis, revenue estimates, P&L projections, and FCM benchmark comparisons.",
  s4_staffing: "True cost of employment calculations, hidden staffing costs, TUPE obligations, and recommended staffing models.",
  s12_future_outlook: "Local development pipeline, planning applications, PO network assessment, and 5-year growth trajectory.",
  s14_profit_improvement: "Actionable profit improvement opportunities with costs, expected returns, and evidence from this report. Includes quick wins for the first 90 days.",
  s15_due_diligence: "Complete due diligence checklist, questions to ask the seller and landlord, suggested offer range, and negotiation strategy with leverage analysis.",
};

export default function LockedSectionTeaser({ sectionId, sectionTitle, sectionScore, sectionGrade, orderId }) {
  const [upgrading, setUpgrading] = useState(false);
  const sectionNumber = parseInt((sectionId || '').replace(/\D/g, '')) || 0;
  const teaser = SECTION_TEASERS[sectionId] || `Unlock the full ${sectionTitle} with Intelligence tier.`;

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/upgrade/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        setUpgrading(false);
        alert("Unable to start upgrade. Please contact reports@fcmreport.com");
      }
    } catch (err) {
      setUpgrading(false);
      alert("Unable to start upgrade. Please contact reports@fcmreport.com");
    }
  };

  return (
    <div style={{
      position: "relative", borderRadius: 12, overflow: "hidden",
      marginBottom: 40, border: `1px solid ${T.offWhite}`,
    }}>
      {/* Faded preview header */}
      <div style={{ padding: "28px 32px 0", opacity: 0.4, filter: "blur(0.5px)" }}>
        <SectionHeader number={sectionNumber} title={sectionTitle} />
      </div>

      {/* Score preview (visible to tease value) */}
      {sectionScore != null && (
        <div style={{ padding: "0 32px", opacity: 0.35, filter: "blur(0.5px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
            <span style={{ fontFamily: T.body, fontSize: 12, color: T.mutedText }}>
              Score: {sectionScore}/100 ({sectionGrade})
            </span>
          </div>
        </div>
      )}

      {/* Blurred teaser content */}
      <div style={{
        padding: "0 32px 20px", opacity: 0.15, filter: "blur(3px)",
        userSelect: "none", pointerEvents: "none",
      }}>
        <div style={{ background: T.offWhite, borderRadius: 8, padding: "16px 20px", marginBottom: 16, height: 60 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: T.offWhite, borderRadius: 8, height: 70 }} />
          ))}
        </div>
        <div style={{ background: T.offWhite, borderRadius: 8, height: 120, marginTop: 16 }} />
      </div>

      {/* Upgrade overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.98) 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 32px",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 24, background: T.navy,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
        }}>
          <span style={{ fontSize: 20 }}>🔒</span>
        </div>

        <div style={{ fontFamily: T.display, fontSize: 18, fontWeight: 600, color: T.navy, marginBottom: 8, textAlign: "center" }}>
          Section {sectionNumber}: {sectionTitle}
        </div>

        <div style={{ fontFamily: T.body, fontSize: 12, color: T.mutedText, lineHeight: 1.7, textAlign: "center", maxWidth: 480, marginBottom: 20 }}>
          {teaser}
        </div>

        <button
          onClick={handleUpgrade}
          disabled={upgrading}
          style={{
            padding: "12px 32px", borderRadius: 8, border: "none",
            background: T.gold, color: T.navy, fontFamily: T.body, fontSize: 13, fontWeight: 700,
            cursor: upgrading ? "not-allowed" : "pointer",
            transition: "transform 0.15s, box-shadow 0.15s",
            boxShadow: "0 4px 12px rgba(191,155,81,0.3)",
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px rgba(191,155,81,0.4)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 12px rgba(191,155,81,0.3)"; }}
        >
          {upgrading ? "Redirecting to payment..." : "Upgrade to Intelligence — £300"}
        </button>

        <div style={{ fontFamily: T.body, fontSize: 10, color: T.lightText, marginTop: 10 }}>
          Instant unlock — no new research needed
        </div>
      </div>
    </div>
  );
}
