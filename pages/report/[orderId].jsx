// ============================================================
// FCM INTELLIGENCE — REPORT VIEWER PAGE
// File: pages/report/[orderId].jsx
// Purpose: Web viewer for FCM reports with email gate + tier-based rendering
// URL: fcmreport.com/report/123 (where 123 = orders.id)
// Data: reads from 'reports' table (joined to 'orders' by order_id)
// ============================================================

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

// Import ALL components from the v2 library
import {
  T, scoreColor,
  ScoreBadge, ScoreRing, SectionHeader, HeadlineBanner, StatBoxes, StatusPill,
  InsightCallout, OpportunityCallout, WarningCallout, PullQuote, CommunityCallout,
  PracticalContext, DataTable, SourceFooter, ImagePlaceholder, CategoryBar,
  StrengthItem, SignalBars, SubTitle, Watermark,
  DonutChart, HBarChart, GroupedHBar, ChartLegend, TrendChart,
  CoverPage, LicencePage,
  Section1, Section2, Section3, Section4, Section5, Section6,
  Section7, Section8, Section9, Section10, Section11, Section12,
  Section13, Section14, Section15,
  GradingScale, BackPage,
} from "../../components/fcm-report-components-v2";

// ============================================================
// SUPABASE CLIENT
// ============================================================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// 2-TIER STRUCTURE (March 19 update — scout & analysis removed)
// ============================================================
const TIER_SECTIONS = {
  insight: ["s1", "s3", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s13"],
  intelligence: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14", "s15"],
};

// All 15 sections in display order with metadata
const ALL_SECTIONS = [
  { id: "s1", key: "s1_executive_summary", title: "Executive Summary & Verdict", Component: Section1 },
  { id: "s2", key: "s2_financial_analysis", title: "Financial Analysis", Component: Section2 },
  { id: "s3", key: "s3_po_remuneration", title: "PO Remuneration Analysis", Component: Section3 },
  { id: "s4", key: "s4_staffing", title: "Staffing, Employment & Hidden Costs", Component: Section4 },
  { id: "s5", key: "s5_online_presence", title: "Online Presence & Customer Reviews", Component: Section5 },
  { id: "s6", key: "s6_location_intelligence", title: "Location Intelligence", Component: Section6 },
  { id: "s7", key: "s7_demographics", title: "Demographics & Community Profile", Component: Section7 },
  { id: "s8", key: "s8_crime_safety", title: "Crime & Safety Analysis", Component: Section8 },
  { id: "s9", key: "s9_competition_mapping", title: "Competition Mapping", Component: Section9 },
  { id: "s10", key: "s10_footfall_analysis", title: "Footfall Analysis", Component: Section10 },
  { id: "s11", key: "s11_infrastructure", title: "Infrastructure & Connectivity", Component: Section11 },
  { id: "s12", key: "s12_future_outlook", title: "Future Outlook", Component: Section12 },
  { id: "s13", key: "s13_risk_assessment", title: "Risk Assessment", Component: Section13 },
  { id: "s14", key: "s14_profit_improvement", title: "Profit Improvement Plan", Component: Section14 },
  { id: "s15", key: "s15_due_diligence", title: "Due Diligence, Questions & Negotiation", Component: Section15 },
];

// Teaser descriptions for locked sections (used in upgrade overlay)
const SECTION_TEASERS = {
  s2: "Detailed financial breakdown including asking price analysis, revenue estimates, P&L projections, and FCM benchmark comparisons.",
  s4: "True cost of employment calculations, hidden staffing costs, TUPE obligations, and recommended staffing models.",
  s12: "Local development pipeline, planning applications, PO network assessment, and 5-year growth trajectory.",
  s14: "Actionable profit improvement opportunities with costs, expected returns, and evidence from this report. Includes quick wins for the first 90 days.",
  s15: "Complete due diligence checklist, questions to ask the seller and landlord, suggested offer range, and negotiation strategy with leverage analysis.",
};

// ============================================================
// EMAIL VERIFICATION GATE
// ============================================================
function EmailGate({ orderId, onVerified }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Query reports table by order_id (which matches orders.id)
      const { data, error: dbError } = await supabase
        .from("reports")
        .select("report_json, customer_email, tier, status")
        .eq("order_id", orderId)
        .single();

      if (dbError || !data) {
        setError("Report not found. Please check your link and try again.");
        setLoading(false);
        return;
      }

      if (data.status === "generating" || data.status === "validating") {
        setError("Your report is still being prepared. We'll email you when it's ready.");
        setLoading(false);
        return;
      }

      if (data.customer_email.toLowerCase().trim() !== email.toLowerCase().trim()) {
        setError("Email doesn't match our records. Please use the email you purchased with.");
        setLoading(false);
        return;
      }

      onVerified(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: T.navy,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      fontFamily: T.body,
    }}>
      <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
        {/* Logo */}
        <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 8 }}>
          FCM INTELLIGENCE
        </div>
        <div style={{ fontFamily: T.body, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 48 }}>
          Business Intelligence Reports
        </div>

        {/* Card */}
        <div style={{ background: T.white, borderRadius: 12, padding: "40px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: T.offWhite, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <span style={{ fontSize: 24 }}>🔒</span>
          </div>

          <h1 style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, color: T.navy, margin: "0 0 8px" }}>
            Access Your Report
          </h1>

          <p style={{ fontFamily: T.body, fontSize: 13, color: T.mutedText, lineHeight: 1.6, margin: "0 0 28px" }}>
            Enter the email address you used to purchase this report.
          </p>

          <div style={{ textAlign: "left" }}>
            <label style={{ fontFamily: T.body, fontSize: 10, fontWeight: 600, color: T.navy, textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: 8 }}>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 8,
                border: `2px solid ${error ? T.redText : T.offWhite}`,
                fontFamily: T.body, fontSize: 14, color: T.darkText,
                outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={(e) => { if (!error) e.target.style.borderColor = T.gold; }}
              onBlur={(e) => { if (!error) e.target.style.borderColor = T.offWhite; }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            />

            {error && (
              <div style={{ fontFamily: T.body, fontSize: 12, color: T.redText, marginTop: 8, lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              style={{
                width: "100%", padding: "14px", borderRadius: 8, border: "none",
                background: (!email || loading) ? T.mutedText : T.navy,
                color: T.white, fontFamily: T.body, fontSize: 14, fontWeight: 600,
                cursor: (!email || loading) ? "not-allowed" : "pointer",
                marginTop: 16, transition: "background 0.2s",
              }}
            >
              {loading ? "Verifying..." : "View Report"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontFamily: T.body, fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 32 }}>
          © 2026 Firstclass Managerial Ltd trading as FCM Intelligence
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LOCKED SECTION PREVIEW (for upsell)
// ============================================================
function LockedSection({ section, orderId }) {
  const [upgrading, setUpgrading] = useState(false);
  const sectionNumber = parseInt(section.id.replace("s", ""));
  const teaser = SECTION_TEASERS[section.id] || `Unlock the full ${section.title} with Intelligence tier.`;

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
        <SectionHeader number={sectionNumber} title={section.title} />
      </div>

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
          Section {sectionNumber}: {section.title}
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

// ============================================================
// STICKY UPGRADE BANNER (for Insight tier — shows at bottom)
// ============================================================
function UpgradeBanner({ orderId, lockedCount }) {
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/upgrade/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      setUpgrading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: T.navy, borderTop: `2px solid ${T.gold}`,
      padding: "14px 24px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
      zIndex: 1000, boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
    }}>
      <div style={{ fontFamily: T.body, fontSize: 13, color: T.white }}>
        <span style={{ fontWeight: 600 }}>{lockedCount} sections</span>
        <span style={{ color: "rgba(255,255,255,0.7)" }}> locked — unlock Financial Analysis, Profit Plan & more</span>
      </div>
      <button
        onClick={handleUpgrade}
        disabled={upgrading}
        style={{
          padding: "10px 24px", borderRadius: 6, border: "none",
          background: T.gold, color: T.navy, fontFamily: T.body, fontSize: 12, fontWeight: 700,
          cursor: upgrading ? "not-allowed" : "pointer", whiteSpace: "nowrap",
        }}
      >
        {upgrading ? "Redirecting..." : "Upgrade to Intelligence — £300"}
      </button>
    </div>
  );
}

// ============================================================
// REPORT VIEWER (main renderer)
// ============================================================
function ReportViewer({ reportData, tier, orderId }) {
  const report = reportData;
  const visibleSections = TIER_SECTIONS[tier] || TIER_SECTIONS.intelligence;
  const allSectionIds = TIER_SECTIONS.intelligence;
  const lockedSections = allSectionIds.filter(id => !visibleSections.includes(id));
  const isInsight = tier === "insight";

  // Build cover page data
  const coverData = {
    score: report.metadata?.overall_score,
    grade: report.metadata?.overall_grade,
    tier_name: tier === "intelligence" ? "Intelligence Report" : "Insight Report",
    tier_price: tier === "intelligence" ? "499" : "199",
    business_name: report.metadata?.business_name,
    address: report.metadata?.full_address,
    order_ref: report.order?.order_ref,
    report_date: report.metadata?.report_date,
    customer_name: report.order?.customer_name,
  };

  // Build licence page data
  const licenceData = {
    customer_name: report.order?.customer_name,
    customer_email: report.order?.customer_email,
    order_ref: report.order?.order_ref,
    report_date: report.metadata?.report_date,
    tier_name: tier === "intelligence" ? "Intelligence Report" : "Insight Report",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F4F1",
      paddingBottom: isInsight ? 80 : 40,
    }}>
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        @media print { .no-print { display: none !important; } }
      `}</style>

      {/* Report container */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
        <Watermark email={report.order?.customer_email}>

          {/* Cover Page */}
          <div style={{ marginBottom: 32 }}>
            <CoverPage data={coverData} />
          </div>

          {/* Licence Page */}
          <div style={{
            background: T.white, borderRadius: 12, padding: "20px 32px",
            marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <LicencePage data={licenceData} />
          </div>

          {/* Sections */}
          {ALL_SECTIONS.map((section) => {
            const isVisible = visibleSections.includes(section.id);
            const isLocked = lockedSections.includes(section.id);
            const sectionData = report.sections?.[section.key];

            if (!sectionData && !isLocked) return null;

            if (isLocked) {
              return (
                <LockedSection
                  key={section.id}
                  section={section}
                  orderId={orderId}
                />
              );
            }

            const { Component } = section;
            return (
              <div key={section.id} style={{
                background: T.white, borderRadius: 12, padding: "28px 32px",
                marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}>
                <Component data={sectionData} />
              </div>
            );
          })}

          {/* Grading Scale */}
          <div style={{
            background: T.white, borderRadius: 12, padding: "28px 32px",
            marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <GradingScale
              reportScore={report.metadata?.overall_score}
              reportGrade={report.metadata?.overall_grade}
            />
          </div>

          {/* Back Page */}
          <div style={{ marginBottom: 32 }}>
            <BackPage referralCode={report.order?.order_ref || "FCM2026"} />
          </div>

        </Watermark>
      </div>

      {/* Sticky upgrade banner for Insight tier */}
      {isInsight && (
        <div className="no-print">
          <UpgradeBanner orderId={orderId} lockedCount={lockedSections.length} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// UPGRADE SUCCESS NOTICE
// ============================================================
function UpgradeSuccess() {
  return (
    <div style={{
      background: T.greenBg, borderRadius: 10, padding: "16px 24px",
      display: "flex", alignItems: "center", gap: 12,
      maxWidth: 800, margin: "24px auto",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 16, background: T.greenText,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ color: T.white, fontSize: 16, fontWeight: 700 }}>✓</span>
      </div>
      <div>
        <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 600, color: T.greenText }}>
          Upgrade complete — all sections unlocked
        </div>
        <div style={{ fontFamily: T.body, fontSize: 11, color: T.darkText }}>
          Your report has been upgraded to Intelligence tier. All 15 sections are now available.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE COMPONENT (Next.js)
// ============================================================
export default function ReportPage() {
  const router = useRouter();
  const { orderId, upgraded } = router.query;

  const [verified, setVerified] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [tier, setTier] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if already verified (sessionStorage for this tab only)
  useEffect(() => {
    if (!orderId) return;
    const cached = sessionStorage.getItem(`fcm-verified-${orderId}`);
    if (cached) {
      fetchReport(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchReport = async (id) => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("report_json, tier")
        .eq("order_id", id)
        .single();

      if (data && !error) {
        setReportData(data.report_json);
        setTier(data.tier);
        setVerified(true);
        sessionStorage.setItem(`fcm-verified-${id}`, "true");
      }
    } catch (err) {
      console.error("Failed to fetch report:", err);
    }
    setLoading(false);
  };

  const handleVerified = (data) => {
    setReportData(data.report_json);
    setTier(data.tier);
    setVerified(true);
    sessionStorage.setItem(`fcm-verified-${orderId}`, "true");
  };

  if (!orderId) return null;

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: T.navy,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 16 }}>
            FCM INTELLIGENCE
          </div>
          <div style={{ fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Loading report...
          </div>
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <>
        <Head>
          <title>Access Your Report — FCM Intelligence</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <EmailGate orderId={orderId} onVerified={handleVerified} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{reportData?.metadata?.business_name || "Report"} — FCM Intelligence</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {upgraded === "true" && <UpgradeSuccess />}
      <ReportViewer reportData={reportData} tier={tier} orderId={orderId} />
    </>
  );
}
