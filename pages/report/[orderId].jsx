// ============================================================
// FCM INTELLIGENCE — FORGE REPORT RENDERER
// File: pages/report/[orderId].jsx (Next.js dynamic route)
// 
// Purpose: Takes validated report JSON and renders the complete
// report as a browser-viewable page. Same page is used by
// Puppeteer API route to generate PDF.
//
// Usage:
//   Browser: /report/2026-03-16-001
//   PDF:     /api/report/pdf?orderId=2026-03-16-001
//
// Version: 1.0 — 18 March 2026
// ============================================================

import { useEffect, useState } from "react";
import {
  T, Watermark,
  CoverPage, LicencePage,
  Section1, Section2, Section3, Section4, Section5, Section6,
  Section7, Section8, Section9, Section10, Section11, Section12,
  Section13, Section14, Section15,
  GradingScale, UpgradePage, BackPage,
  TIER_SECTIONS,
} from "../../components/fcm-report-components-v2";

// ============================================================
// TIER CONFIGURATION
// ============================================================
const TIER_CONFIG = {
  scout:        { name: "Scout",        price: "99" },
  insight:      { name: "Insight",      price: "149" },
  analysis:     { name: "Analysis",     price: "249" },
  intelligence: { name: "Intelligence", price: "449" },
};

// Section rendering map — maps section IDs to components
// Each entry: { id, component, dataKey (in sections object), title }
const SECTION_MAP = [
  { id: "s1",  component: Section1,  dataKey: "s1_executive_summary" },
  { id: "s2",  component: Section2,  dataKey: "s2_financial_analysis" },
  { id: "s3",  component: Section3,  dataKey: "s3_po_remuneration" },
  { id: "s4",  component: Section4,  dataKey: "s4_staffing" },
  { id: "s5",  component: Section5,  dataKey: "s5_online_presence" },
  { id: "s6",  component: Section6,  dataKey: "s6_location_intelligence" },
  { id: "s7",  component: Section7,  dataKey: "s7_demographics" },
  { id: "s8",  component: Section8,  dataKey: "s8_crime_safety" },
  { id: "s9",  component: Section9,  dataKey: "s9_competition_mapping" },
  { id: "s10", component: Section10, dataKey: "s10_footfall_analysis" },
  { id: "s11", component: Section11, dataKey: "s11_infrastructure" },
  { id: "s12", component: Section12, dataKey: "s12_future_outlook" },
  { id: "s13", component: Section13, dataKey: "s13_risk_assessment" },
  { id: "s14", component: Section14, dataKey: "s14_profit_improvement" },
  { id: "s15", component: Section15, dataKey: "s15_due_diligence" },
];

// ============================================================
// PAGE NUMBER CALCULATOR
// Estimates page numbers based on section order and tier.
// Cover = page 1, Licence = page 2, sections start at 3.
// Multi-page sections get extra pages based on content density.
// ============================================================
function calculatePageNumbers(visibleSections, reportData) {
  let currentPage = 3; // Cover = 1, Licence = 2, first section starts at 3
  const pageMap = {};

  for (const sectionId of visibleSections) {
    pageMap[sectionId] = currentPage;

    // Estimate pages per section based on content density
    const sectionDef = SECTION_MAP.find(s => s.id === sectionId);
    if (!sectionDef) { currentPage += 1; continue; }

    const data = reportData.sections?.[sectionDef.dataKey];
    if (!data) { currentPage += 1; continue; }

    // Heuristic page count based on section type and data volume
    switch (sectionId) {
      case "s1":  currentPage += 2; break; // Executive summary — always 2 pages
      case "s2":  currentPage += (data.profit_loss_estimate ? 2 : 1); break;
      case "s3":  currentPage += 1; break;
      case "s4":  currentPage += 1; break;
      case "s5":  currentPage += 1; break;
      case "s6":  currentPage += 2; break; // Image-heavy — 2 pages
      case "s7":  currentPage += 2; break; // Charts — 2 pages
      case "s8":  currentPage += 2; break; // Heatmap + charts — 2 pages
      case "s9":  currentPage += 2; break; // Map + multiple tables — 2 pages
      case "s10": currentPage += 2; break; // Map + timeline + tables
      case "s11": currentPage += 1; break;
      case "s12": currentPage += 1; break;
      case "s13": currentPage += (data.detailed_risks?.length > 2 ? 2 : 1); break;
      case "s14": currentPage += 1; break;
      case "s15": currentPage += 2; break; // Questions + negotiation — 2 pages
      default:    currentPage += 1;
    }
  }

  return pageMap;
}

// ============================================================
// PAGE WRAPPER — adds page-break CSS for Puppeteer
// ============================================================
function ReportPage({ children, isFirst = false, className = "" }) {
  return (
    <div
      className={`report-page ${className}`}
      style={{
        pageBreakBefore: isFirst ? "auto" : "always",
        pageBreakAfter: "auto",
        pageBreakInside: "avoid",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// SECTION PAGE WRAPPER — white background, padding, consistent sizing
// ============================================================
function SectionPage({ children }) {
  return (
    <div style={{
      background: T.white,
      padding: "40px 48px",
      minHeight: "calc(297mm - 80px)", // A4 height minus padding
      position: "relative",
      boxSizing: "border-box",
    }}>
      {children}
    </div>
  );
}

// ============================================================
// PAGE HEADER — appears at top of every content page
// (Section number in gold, section title, page number right-aligned)
// Blueprint: 2px navy bottom border
// ============================================================
function PageHeader({ sectionNumber, sectionTitle, pageNum }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      borderBottom: `2px solid ${T.navy}`, paddingBottom: 8, marginBottom: 24,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        {sectionNumber && (
          <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 500, color: T.gold, textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Section {sectionNumber}
          </span>
        )}
        <span style={{ fontFamily: T.display, fontSize: 16, fontWeight: 600, color: T.navy }}>
          {sectionTitle}
        </span>
      </div>
      {pageNum && (
        <span style={{ fontFamily: T.body, fontSize: 10, color: T.lightText }}>
          Page {pageNum}
        </span>
      )}
    </div>
  );
}

// ============================================================
// MAIN REPORT RENDERER
// ============================================================
export default function ForgeReport({ reportData: propData }) {
  const [reportData, setReportData] = useState(propData || null);
  const [loading, setLoading] = useState(!propData);
  const [error, setError] = useState(null);

  // If no prop data, we're in browser mode — fetch from API
  // In production, this would be getServerSideProps or API fetch
  useEffect(() => {
    if (propData) return;

    // Extract orderId from URL path
    const pathParts = window.location.pathname.split("/");
    const orderId = pathParts[pathParts.length - 1];

    if (!orderId || orderId === "[orderId]") {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    fetch(`/api/report/data?orderId=${orderId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Report not found (${res.status})`);
        return res.json();
      })
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [propData]);

  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.offWhite }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 16 }}>FCM INTELLIGENCE</div>
          <div style={{ fontFamily: T.body, fontSize: 14, color: T.mutedText }}>Loading report...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !reportData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.offWhite }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 16 }}>FCM INTELLIGENCE</div>
          <div style={{ fontFamily: T.body, fontSize: 14, color: T.redText, marginBottom: 8 }}>Report not found</div>
          <div style={{ fontFamily: T.body, fontSize: 12, color: T.mutedText }}>{error || "No report data available"}</div>
        </div>
      </div>
    );
  }

  // ========================================
  // EXTRACT DATA
  // ========================================
  const { order, metadata, sections, images } = reportData;
  const tier = order.tier; // "scout" | "insight" | "analysis" | "intelligence"
  const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.intelligence;
  const customerEmail = order.customer_email;

  // Determine which sections are visible for this tier
  const visibleSectionIds = TIER_SECTIONS[tier] || TIER_SECTIONS.intelligence;

  // Calculate page numbers
  const pageNumbers = calculatePageNumbers(visibleSectionIds, reportData);

  // Build cover data from order + metadata
  const coverData = {
    score: metadata.overall_score,
    grade: metadata.overall_grade,
    business_name: metadata.business_name,
    address: metadata.full_address,
    tier_name: tierConfig.name,
    tier_price: tierConfig.price,
    order_ref: order.order_ref,
    report_date: metadata.report_date,
    customer_name: order.customer_name,
  };

  // Build licence data
  const licenceData = {
    report_date: metadata.report_date,
    order_ref: order.order_ref,
    tier_name: tierConfig.name,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <>
      {/* Global styles for PDF rendering */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        html, body {
          margin: 0;
          padding: 0;
          background: ${T.white};
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        /* A4 page sizing for Puppeteer */
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          .report-page {
            page-break-before: always;
            page-break-inside: avoid;
          }
          .report-page:first-child {
            page-break-before: auto;
          }
          /* Hide browser-only elements in PDF */
          .browser-only {
            display: none !important;
          }
        }

        /* Browser view — centred with shadow */
        @media screen {
          .report-container {
            max-width: 210mm;
            margin: 0 auto;
            background: #F3F4F6;
            min-height: 100vh;
          }
          .report-page {
            background: ${T.white};
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            margin-bottom: 16px;
          }
          /* Nav bar for browser view */
          .browser-nav {
            position: sticky;
            top: 0;
            z-index: 100;
            background: ${T.navy};
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }

        /* Print view — no shadows, no gaps */
        @media print {
          .report-container {
            max-width: none;
            margin: 0;
            background: ${T.white};
          }
          .report-page {
            box-shadow: none;
            margin-bottom: 0;
          }
        }

        /* Chart canvas sizing */
        canvas { max-width: 100%; }

        /* Table responsiveness */
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; }
      `}</style>

      <div className="report-container">

        {/* ========================================
            BROWSER NAVIGATION (hidden in PDF)
            ======================================== */}
        <div className="browser-only browser-nav">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 700, color: T.gold, textTransform: "uppercase", letterSpacing: "2px" }}>FCM INTELLIGENCE</span>
            <span style={{ fontFamily: T.body, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Report Viewer</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: T.body, fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
              {metadata.business_name} • {tierConfig.name} Tier
            </span>
            <a
              href={`/api/report/pdf?orderId=${order.order_ref}`}
              style={{
                fontFamily: T.body, fontSize: 10, fontWeight: 600,
                color: T.navy, background: T.gold,
                padding: "6px 16px", borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Download PDF
            </a>
          </div>
        </div>

        {/* ========================================
            PAGE 1: COVER
            ======================================== */}
        <Watermark email={customerEmail}>
          <ReportPage isFirst>
            <CoverPage data={coverData} />
          </ReportPage>
        </Watermark>

        {/* ========================================
            PAGE 2: LICENCE & CONFIDENTIALITY
            ======================================== */}
        <Watermark email={customerEmail}>
          <ReportPage>
            <SectionPage>
              <LicencePage data={licenceData} />
            </SectionPage>
          </ReportPage>
        </Watermark>

        {/* ========================================
            CONTENT SECTIONS — tier-gated
            ======================================== */}
        {SECTION_MAP.map(({ id, component: Component, dataKey }) => {
          // Skip sections not visible for this tier
          if (!visibleSectionIds.includes(id)) return null;

          // Get section data
          const sectionData = sections?.[dataKey];
          if (!sectionData) return null;

          // Build props
          const props = {
            data: sectionData,
            pageNum: pageNumbers[id],
          };

          // S13 needs tier prop for checklist-only mode
          if (id === "s13") {
            props.tier = tier;
          }

          return (
            <Watermark key={id} email={customerEmail}>
              <ReportPage>
                <SectionPage>
                  <Component {...props} />
                </SectionPage>
              </ReportPage>
            </Watermark>
          );
        })}

        {/* ========================================
            GRADING SCALE — always shown
            ======================================== */}
        <Watermark email={customerEmail}>
          <ReportPage>
            <SectionPage>
              <GradingScale
                reportScore={metadata.overall_score}
                reportGrade={metadata.overall_grade}
              />
            </SectionPage>
          </ReportPage>
        </Watermark>

        {/* ========================================
            UPGRADE PAGE — shown for scout, insight, analysis only
            ======================================== */}
        {tier !== "intelligence" && (
          <Watermark email={customerEmail}>
            <ReportPage>
              <SectionPage>
                <UpgradePage currentTier={tier} />
              </SectionPage>
            </ReportPage>
          </Watermark>
        )}

        {/* ========================================
            BACK PAGE — always shown
            ======================================== */}
        <Watermark email={customerEmail}>
          <ReportPage>
            <BackPage referralCode={`FCM-${order.customer_name?.split(" ")[0]?.toUpperCase() || "REF"}-${new Date().getFullYear()}`} />
          </ReportPage>
        </Watermark>

      </div>
    </>
  );
}

// ============================================================
// getServerSideProps — fetches report data from Supabase
// ============================================================
export async function getServerSideProps(context) {
  const { orderId } = context.params;

  // In production, this fetches from Supabase
  // For now, return null to trigger client-side fetch
  // Replace with actual Supabase query:
  //
  // import { createClient } from "@supabase/supabase-js";
  // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  // const { data, error } = await supabase
  //   .from("reports")
  //   .select("report_json")
  //   .eq("order_ref", orderId)
  //   .single();
  //
  // if (error || !data) {
  //   return { notFound: true };
  // }
  //
  // return { props: { reportData: data.report_json } };

  return { props: { reportData: null } };
}
