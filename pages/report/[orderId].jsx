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

import LockedSectionTeaser from "../../components/LockedSectionTeaser";
import UpgradeBannerComponent from "../../components/UpgradeBanner";

// ============================================================
// SUPABASE CLIENT
// ============================================================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SECTION ORDER — canonical display order for all 15 sections
// ============================================================
const SAMPLE_ORDER_ID = '2026-03-31-001';

const SECTION_ORDER = [
  's1_executive_summary',
  's2_financial_analysis',
  's3_po_remuneration',
  's4_staffing_and_operations',
  's5_online_presence',
  's6_location_intelligence',
  's7_demographics',
  's8_crime_safety',
  's9_competition_mapping',
  's10_footfall_analysis',
  's11_infrastructure',
  's12_future_outlook',
  's13_risk_assessment',
  's14_profit_improvement',
  's15_due_diligence',
];

// ============================================================
// 2-TIER STRUCTURE (March 19 update — scout & analysis removed)
// Fallback visibility if tier_visibility not in JSON
// ============================================================
const TIER_SECTIONS_FALLBACK = {
  insight: [
    "s1_executive_summary", "s3_po_remuneration", "s5_online_presence",
    "s6_location_intelligence", "s7_demographics", "s8_crime_safety",
    "s9_competition_mapping", "s10_footfall_analysis", "s11_infrastructure",
    "s13_risk_assessment",
  ],
  intelligence: SECTION_ORDER,
};

// Section key → Component mapping
const SECTION_COMPONENTS = {
  s1_executive_summary: { title: "Executive Summary & Verdict", Component: Section1 },
  s2_financial_analysis: { title: "Financial Analysis", Component: Section2 },
  s3_po_remuneration: { title: "PO Remuneration Analysis", Component: Section3 },
  s4_staffing_and_operations: { title: "Staffing, Employment & Hidden Costs", Component: Section4 },
  s4_staffing: { title: "Staffing, Employment & Hidden Costs", Component: Section4 },
  s5_online_presence: { title: "Online Presence & Customer Reviews", Component: Section5 },
  s6_location_intelligence: { title: "Location Intelligence", Component: Section6 },
  s7_demographics: { title: "Demographics & Community Profile", Component: Section7 },
  s8_crime_safety: { title: "Crime & Safety Analysis", Component: Section8 },
  s9_competition_mapping: { title: "Competition Mapping", Component: Section9 },
  s10_footfall_analysis: { title: "Footfall Analysis", Component: Section10 },
  s11_infrastructure: { title: "Infrastructure & Connectivity", Component: Section11 },
  s12_future_outlook: { title: "Future Outlook", Component: Section12 },
  s13_risk_assessment: { title: "Risk Assessment", Component: Section13 },
  s14_profit_improvement: { title: "Profit Improvement Plan", Component: Section14 },
  s15_due_diligence: { title: "Due Diligence, Questions & Negotiation", Component: Section15 },
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

// Inline LockedSection and UpgradeBanner removed — now imported from components/

// ============================================================
// REPORT VIEWER (main renderer)
// ============================================================
// ============================================================
// REPORT IMAGE GALLERY — renders Google Business + Street View photos
// ============================================================
function ReportImageGallery({ images }) {
  const allPhotos = [
    ...(images.google_business_photos || []),
    ...(images.street_view || []),
  ];

  if (allPhotos.length === 0) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{
        fontFamily: T.display, fontSize: 16, fontWeight: 600,
        color: T.navy, marginBottom: 16,
      }}>
        📸 Property & Location Images
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
      }}>
        {allPhotos.map((photo, i) => (
          <div key={i} style={{
            borderRadius: 12, overflow: 'hidden',
            border: `1px solid ${T.offWhite}`,
            background: T.white,
          }}>
            <img
              src={photo.url}
              alt={photo.caption || 'Property image'}
              style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div style={{ padding: '8px 12px' }}>
              <p style={{
                fontFamily: T.body, fontSize: 11, color: T.mutedText,
                margin: 0, lineHeight: 1.4,
              }}>{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// REPORT VIEWER (main renderer)
// ============================================================
// ============================================================
// SAMPLE REPORT BANNER — shown when viewing the public sample
// ============================================================
function SampleReportBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #c9a227, #d4b84a)',
      borderRadius: 12,
      padding: '20px 28px',
      marginBottom: 24,
      textAlign: 'center',
      boxShadow: '0 4px 16px rgba(201,162,39,0.3)',
    }}>
      <div style={{
        display: 'inline-block',
        background: 'rgba(11,29,58,0.15)',
        borderRadius: 6,
        padding: '4px 14px',
        marginBottom: 10,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        fontWeight: 700,
        color: '#0B1D3A',
        textTransform: 'uppercase',
        letterSpacing: 2,
      }}>
        Sample Report
      </div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        color: '#0B1D3A',
        margin: 0,
        lineHeight: 1.5,
        fontWeight: 500,
      }}>
        This is a sample Intelligence report. Your report will be personalised for your chosen listing.
      </p>
      <a
        href="/reports"
        style={{
          display: 'inline-block',
          marginTop: 12,
          padding: '10px 24px',
          background: '#0B1D3A',
          color: '#c9a227',
          borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
      >
        Order Your Report →
      </a>
    </div>
  );
}

// ============================================================
// BLUR HELPER — redact business name/address for sample report
// ============================================================
function blurSampleReportData(report) {
  const blurred = JSON.parse(JSON.stringify(report));

  // Blur business name
  if (blurred.metadata?.business_name) {
    blurred.metadata.business_name = blurred.metadata.business_name
      .replace(/Sale\s*Moor/gi, '████████');
  }

  // Blur specific address but keep region
  if (blurred.metadata?.full_address) {
    blurred.metadata.full_address = blurred.metadata.full_address
      .replace(/\d+\s+[^,]+,\s*/i, '██ ████████ ████, ')
      .replace(/Sale\s*Moor/gi, '████████');
  }

  // Blur in order data too
  if (blurred.order?.business_name) {
    blurred.order.business_name = blurred.order.business_name
      .replace(/Sale\s*Moor/gi, '████████');
  }
  if (blurred.order?.business_address) {
    blurred.order.business_address = blurred.order.business_address
      .replace(/\d+\s+[^,]+,\s*/i, '██ ████████ ████, ')
      .replace(/Sale\s*Moor/gi, '████████');
  }

  // Blur customer details for sample
  if (blurred.order?.customer_name) {
    blurred.order.customer_name = 'Sample Customer';
  }
  if (blurred.order?.customer_email) {
    blurred.order.customer_email = 'sample@fcmreport.com';
  }

  return blurred;
}

function ReportViewer({ reportData, tier, orderId }) {
  const isSample = orderId === SAMPLE_ORDER_ID;
  const report = isSample ? blurSampleReportData(reportData) : reportData;
  const images = { ...(report?.images || {}) };

  // ── Promote maps[] entries into top-level image keys ──
  // The data pipeline stores generated map URLs in images.maps[] with map_type
  // (e.g. "crime_heatmap", "competition", "footfall"). The section components
  // expect images.crime_heatmap.url, images.competition_map.url, etc.
  // Bridge the gap by promoting maps[] entries into the expected keys.
  const mapTypeToKey = {
    crime_heatmap: 'crime_heatmap',
    competition:   'competition_map',
    footfall:      'footfall_map',
  };
  if (Array.isArray(images.maps)) {
    for (const map of images.maps) {
      const targetKey = mapTypeToKey[map.map_type];
      if (targetKey && !images[targetKey]?.url) {
        images[targetKey] = { url: map.url, caption: map.caption, legend: map.legend };
      }
    }
  }

  // Also check research-pack-style keys (public_url instead of url)
  for (const key of ['crime_heatmap', 'competition_map', 'footfall_map']) {
    if (images[key] && !images[key].url && images[key].public_url) {
      images[key].url = images[key].public_url;
    }
  }

  // Fallback: check section-level refs (only if they look like actual URLs)
  const sectionImageRefs = [
    { section: 's8_crime_safety',        refKey: 'crime_heatmap_ref',   imageKey: 'crime_heatmap',   caption: 'Crime density heatmap' },
    { section: 's9_competition_mapping',  refKey: 'competition_map_ref', imageKey: 'competition_map', caption: 'Competition map' },
    { section: 's10_footfall_analysis',   refKey: 'footfall_map_ref',    imageKey: 'footfall_map',    caption: 'Footfall generator map' },
  ];
  for (const { section, refKey, imageKey, caption } of sectionImageRefs) {
    if (!images[imageKey]?.url) {
      const refUrl = report?.sections?.[section]?.[refKey];
      // Only use if it looks like an actual URL (not a slug like "crime-heatmap")
      if (refUrl && (refUrl.startsWith('http://') || refUrl.startsWith('https://'))) {
        images[imageKey] = { url: refUrl, caption };
      }
    }
  }

  // Source of truth for tier: DB column (passed as prop), NOT JSON
  const customerTier = tier || 'intelligence';

  // Get visibility from JSON tier_visibility map, fallback to hardcoded
  const visibleSections = report.tier_visibility?.[customerTier]
    || TIER_SECTIONS_FALLBACK[customerTier]
    || SECTION_ORDER;

  const lockedSections = SECTION_ORDER.filter(id => !visibleSections.includes(id));
  const isInsight = customerTier === "insight";

  // Build cover page data
  const coverData = {
    score: report.metadata?.overall_score,
    grade: report.metadata?.overall_grade,
    tier_name: customerTier === "intelligence" ? "Intelligence Report" : "Insight Report",
    tier_price: customerTier === "intelligence" ? "499" : "199",
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
    tier_name: customerTier === "intelligence" ? "Intelligence Report" : "Insight Report",
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
        {isSample && <SampleReportBanner />}
        <Watermark email={report.order?.customer_email}>

          {/* Cover Page */}
          <div style={{ marginBottom: 32 }}>
            <CoverPage data={coverData} coverImage={images.cover_image} />
          </div>

          {/* Cover Image Hero */}
          {images.cover_image?.url && (
            <div style={{
              position: 'relative', width: '100%', height: 300,
              borderRadius: 12, overflow: 'hidden', marginBottom: 32,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <img
                src={images.cover_image.url}
                alt={images.cover_image.caption || 'Business exterior'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
                padding: '24px 20px 16px',
              }}>
                <p style={{
                  fontFamily: T.body, color: '#fff', fontSize: 13,
                  margin: 0, fontWeight: 500,
                }}>{images.cover_image.caption}</p>
                {images.cover_image.source && (
                  <p style={{
                    fontFamily: T.body, color: 'rgba(255,255,255,0.5)',
                    fontSize: 11, margin: '4px 0 0',
                  }}>Source: {images.cover_image.source}</p>
                )}
              </div>
            </div>
          )}

          {/* Photo gallery removed — images render inside their respective sections:
             Section 5 (Google Business photos), Section 6 (maps + street view) */}

          {/* Licence Page */}
          <div style={{
            background: T.white, borderRadius: 12, padding: "20px 32px",
            marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <LicencePage data={licenceData} />
          </div>

          {/* Sections — rendered in SECTION_ORDER, not Object.keys */}
          {SECTION_ORDER.map((sectionId) => {
            const sectionMeta = SECTION_COMPONENTS[sectionId];
            if (!sectionMeta) return null;

            const sectionData = report.sections?.[sectionId];
            const isVisible = visibleSections.includes(sectionId);

            if (!isVisible) {
              // Render locked teaser with score/grade from JSON (display-only gating)
              return (
                <LockedSectionTeaser
                  key={sectionId}
                  sectionId={sectionId}
                  sectionTitle={sectionData?.title || sectionMeta.title}
                  sectionScore={sectionData?.score}
                  sectionGrade={sectionData?.grade}
                  orderId={orderId}
                />
              );
            }

            if (!sectionData) return null;

            const { Component } = sectionMeta;
            // Pass images to sections that need them
            const extraProps = {};
            if (sectionId === 's5_online_presence' || sectionId === 's6_location_intelligence' || sectionId === 's8_crime_safety' || sectionId === 's9_competition_mapping' || sectionId === 's10_footfall_analysis') {
              extraProps.images = images;
            }
            return (
              <div key={sectionId} style={{
                background: T.white, borderRadius: 12, padding: "28px 32px",
                marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}>
                <Component data={sectionData} {...extraProps} />
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

      {/* Sticky upgrade banner for Insight tier only */}
      {isInsight && (
        <div className="no-print">
          <UpgradeBannerComponent orderId={orderId} lockedCount={lockedSections.length} />
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
export default function ReportPage({ orderId }) {
  const router = useRouter();
  const { upgraded } = router.query;

  const [verified, setVerified] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [tier, setTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── Admin bypass: ?admin=fcm-pipeline-2026-secure-key ──
  const adminKey = router.query.admin;
  const isAdmin = adminKey === 'fcm-pipeline-2026-secure-key';

  // ── Sample report bypass: order 2026-03-31-001 is publicly viewable ──
  const isSampleReport = orderId === SAMPLE_ORDER_ID;

  // ── DEBUG: Log every render cycle ──
  console.log('[DEBUG] ReportPage render', {
    orderId,  // from getServerSideProps — always available
    verified,
    isAdmin,
    tier,
    loading,
    hasReportData: !!reportData,
    fetchError,
  });

  // Check if already verified (sessionStorage for this tab only)
  // orderId now comes from getServerSideProps — always available on first render
  // Admin bypass skips email gate entirely
  useEffect(() => {
    if (!orderId) {
      console.log('[DEBUG] useEffect skipped — no orderId');
      setLoading(false);
      return;
    }
    console.log('[DEBUG] useEffect running for orderId:', orderId, 'isAdmin:', isAdmin);

    // Admin bypass — skip email gate, fetch report directly
    if (isAdmin) {
      console.log('[DEBUG] Admin bypass active — fetching report directly');
      fetchReport(orderId);
      return;
    }

    // Sample report bypass — publicly viewable, no auth needed
    if (isSampleReport) {
      console.log('[DEBUG] Sample report bypass — fetching public sample');
      fetchReport(orderId);
      return;
    }

    try {
      const cached = sessionStorage.getItem(`fcm-verified-${orderId}`);
      console.log('[DEBUG] sessionStorage cached:', cached);
      if (cached) {
        fetchReport(orderId);
      } else {
        // Check if user authenticated via My Reports magic link
        const myReportsEmail = sessionStorage.getItem('fcm_reports_email');
        if (myReportsEmail) {
          console.log('[DEBUG] My Reports session found, auto-verifying');
          sessionStorage.setItem(`fcm-verified-${orderId}`, 'true');
          fetchReport(orderId);
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('[DEBUG] sessionStorage access error:', err);
      setLoading(false);
    }
  }, [orderId, isAdmin, isSampleReport]);

  const fetchReport = async (id) => {
    console.log('[DEBUG] fetchReport called for id:', id);
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("report_json, tier")
        .eq("order_id", id)
        .single();

      console.log('[DEBUG] Supabase response:', {
        hasData: !!data,
        error: error || null,
        tier: data?.tier,
        hasReportJson: !!data?.report_json,
        reportJsonType: typeof data?.report_json,
        reportJsonKeys: data?.report_json ? Object.keys(data.report_json) : [],
      });

      if (error) {
        console.error('[DEBUG] Supabase query error:', error);
        setFetchError(`Database error: ${error.message}`);
        setLoading(false);
        return;
      }

      if (!data) {
        console.error('[DEBUG] No data returned from Supabase');
        setFetchError('Report not found in database.');
        setLoading(false);
        return;
      }

      if (!data.report_json) {
        console.error('[DEBUG] report_json is null/undefined for order:', id);
        setFetchError('Report data is empty — report may still be generating.');
        setLoading(false);
        return;
      }

      if (typeof data.report_json === 'string') {
        console.warn('[DEBUG] report_json is a string, attempting JSON.parse...');
        try {
          data.report_json = JSON.parse(data.report_json);
          console.log('[DEBUG] Successfully parsed report_json string');
        } catch (parseErr) {
          console.error('[DEBUG] Failed to parse report_json string:', parseErr);
          setFetchError('Report data is malformed (invalid JSON string).');
          setLoading(false);
          return;
        }
      }

      // Validate expected structure
      console.log('[DEBUG] report_json structure:', {
        hasMetadata: !!data.report_json?.metadata,
        hasOrder: !!data.report_json?.order,
        hasSections: !!data.report_json?.sections,
        metadataKeys: data.report_json?.metadata ? Object.keys(data.report_json.metadata) : [],
        sectionKeys: data.report_json?.sections ? Object.keys(data.report_json.sections) : [],
        businessName: data.report_json?.metadata?.business_name,
        overallScore: data.report_json?.metadata?.overall_score,
      });

      setReportData(data.report_json);
      setTier(data.tier);
      setVerified(true);
      sessionStorage.setItem(`fcm-verified-${id}`, "true");
    } catch (err) {
      console.error('[DEBUG] fetchReport exception:', err);
      setFetchError(`Unexpected error: ${err.message}`);
    }
    setLoading(false);
  };

  const handleVerified = (data) => {
    console.log('[DEBUG] handleVerified called', {
      tier: data.tier,
      hasReportJson: !!data.report_json,
      reportJsonType: typeof data.report_json,
    });

    try {
      let reportJson = data.report_json;

      // Handle string report_json from email gate too
      if (typeof reportJson === 'string') {
        console.warn('[DEBUG] handleVerified: report_json is string, parsing...');
        reportJson = JSON.parse(reportJson);
      }

      if (!reportJson) {
        console.error('[DEBUG] handleVerified: report_json is null after processing');
        setFetchError('Report data is empty.');
        return;
      }

      console.log('[DEBUG] handleVerified report structure:', {
        hasMetadata: !!reportJson?.metadata,
        hasSections: !!reportJson?.sections,
        sectionKeys: reportJson?.sections ? Object.keys(reportJson.sections) : [],
      });

      setReportData(reportJson);
      setTier(data.tier);
      setVerified(true);
      sessionStorage.setItem(`fcm-verified-${orderId}`, "true");
    } catch (err) {
      console.error('[DEBUG] handleVerified error:', err);
      setFetchError(`Failed to process report data: ${err.message}`);
    }
  };

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

  // ── DEBUG: Show fetch errors instead of crashing ──
  if (fetchError) {
    return (
      <div style={{
        minHeight: "100vh", background: T.navy,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}>
        <div style={{ textAlign: "center", maxWidth: 500 }}>
          <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 16 }}>
            FCM INTELLIGENCE
          </div>
          <div style={{ fontFamily: T.body, fontSize: 15, color: "#ff6b6b", marginBottom: 12 }}>
            ⚠️ Report Error
          </div>
          <div style={{ fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 24 }}>
            {fetchError}
          </div>
          <div style={{ fontFamily: T.body, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            Order ID: {orderId} | Check browser console for debug details
          </div>
          <button
            onClick={() => { setFetchError(null); setLoading(false); setVerified(false); sessionStorage.removeItem(`fcm-verified-${orderId}`); }}
            style={{
              marginTop: 20, padding: "10px 24px", borderRadius: 6, border: "none",
              background: T.gold, color: T.navy, fontFamily: T.body, fontSize: 12, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!verified && !isAdmin && !isSampleReport) {
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

  // ── DEBUG: Final safety check before rendering ──
  if (!reportData || !reportData.metadata || !reportData.sections) {
    console.error('[DEBUG] reportData missing expected structure at render time:', {
      hasReportData: !!reportData,
      hasMetadata: !!reportData?.metadata,
      hasSections: !!reportData?.sections,
      reportDataKeys: reportData ? Object.keys(reportData) : [],
    });
    return (
      <div style={{
        minHeight: "100vh", background: T.navy,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}>
        <div style={{ textAlign: "center", maxWidth: 500 }}>
          <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 16 }}>
            FCM INTELLIGENCE
          </div>
          <div style={{ fontFamily: T.body, fontSize: 15, color: "#ff6b6b", marginBottom: 12 }}>
            ⚠️ Report Data Incomplete
          </div>
          <div style={{ fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 12 }}>
            The report data is missing required fields (metadata or sections).
          </div>
          <div style={{ fontFamily: T.body, fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 24 }}>
            Order ID: {orderId} | Tier: {tier || 'unknown'} | Keys: {reportData ? Object.keys(reportData).join(', ') : 'null'}
          </div>
          <button
            onClick={() => { setFetchError(null); setVerified(false); setReportData(null); setLoading(false); sessionStorage.removeItem(`fcm-verified-${orderId}`); }}
            style={{
              padding: "10px 24px", borderRadius: 6, border: "none",
              background: T.gold, color: T.navy, fontFamily: T.body, fontSize: 12, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
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

// ============================================================
// SERVER-SIDE PROPS — orderId available immediately, no hydration delay
// ============================================================
export async function getServerSideProps({ params }) {
  return {
    props: { orderId: params.orderId },
  };
}

