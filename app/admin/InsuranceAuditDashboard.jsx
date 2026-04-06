"use client";
import { useState } from "react";
import { getQuestionLabel, getValueLabel } from "@/lib/audit-constants";

const GOLD = "#D4AF37";
const BG = "#010409";
const CARD = "#0d1117";
const BORDER = "#1e2733";
const TEXT = "#e6edf3";
const MUTED = "#8b949e";
const GREEN = "#22c55e";
const RED = "#ef4444";
const AMBER = "#f59e0b";
const YELLOW = "#eab308";
const BLUE = "#378ADD";

const COVER_TYPE_LABELS = {
  specialist: "Specialist PO Insurer",
  generic_direct: "Generic Direct",
  broker: "Via Broker",
  unsure: "Unsure",
  unknown: "Unknown",
};

const RENEWAL_BUCKET_LABELS = {
  "0_3m": "0-3 months",
  "3_6m": "3-6 months",
  "6_12m": "6-12 months",
  "12m_plus": "12+ months",
  unsure: "Unsure",
};

const COVER_TYPE_COLORS = {
  specialist: GREEN,
  generic_direct: AMBER,
  broker: BLUE,
  unsure: MUTED,
  unknown: MUTED,
};

const RENEWAL_COLORS = {
  "0_3m": RED,
  "3_6m": AMBER,
  "6_12m": YELLOW,
  "12m_plus": GREEN,
  unsure: MUTED,
};

export default function InsuranceAuditDashboard({ data, onRefresh }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  if (!data) return <div style={{ color: MUTED }}>Loading audit data...</div>;

  const {
    headlineStats,
    coverTypeDistribution,
    gapSeverityOverTime,
    renewalUrgency,
    topGapPatterns,
    recentSubmissions,
  } = data;

  // ═══════════════════════════════════════════════════════════════════════════
  // CSV EXPORT
  // ═══════════════════════════════════════════════════════════════════════════
  const handleExportCSV = () => {
    if (!recentSubmissions || recentSubmissions.length === 0) {
      alert("No submissions to export");
      return;
    }

    // Build CSV with unpacked answers
    const headers = [
      "Date",
      "Email",
      "Branch Name",
      "FAD Code",
      "Cover Type",
      "Renewal Bucket",
      "Critical Gaps",
      "Important Gaps",
      "Worth Reviewing",
    ];

    // Get all answer keys from the first submission to build full column list
    const firstAnswers = recentSubmissions[0]?.answers || {};
    const answerKeys = Object.keys(firstAnswers).sort();
    answerKeys.forEach((key) => {
      headers.push(getQuestionLabel(key));
    });

    const rows = recentSubmissions.map((sub) => {
      const row = [
        new Date(sub.created_at).toISOString().split("T")[0],
        sub.email,
        sub.branch_name || "",
        sub.fad_code || "",
        sub.cover_type || "",
        sub.renewal_bucket || "",
        sub.critical_count || 0,
        sub.important_count || 0,
        sub.worth_reviewing_count || 0,
      ];

      answerKeys.forEach((key) => {
        const value = sub.answers?.[key];
        row.push(getValueLabel(key, value));
      });

      return row;
    });

    const csvContent =
      [headers.join(",")]
        .concat(rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `fcm-insurance-audit-export-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ animation: "slideUp 0.3s ease" }}>
      {/* Dashboard Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Insurance Audit Dashboard</h2>
          <p style={{ fontSize: 13, color: MUTED }}>Commercial underwriter intelligence — policy gap analysis</p>
        </div>
        <button
          onClick={onRefresh}
          style={{
            padding: "8px 16px",
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            color: TEXT,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 1 — HEADLINE STATS
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Audits", value: headlineStats.totalAudits, color: BLUE },
          { label: "Distinct Branches", value: headlineStats.distinctBranches, color: GOLD, sub: "by FAD code" },
          { label: "Avg Critical Gaps", value: headlineStats.avgCritical.toFixed(1), color: RED },
          { label: "Last 7 Days", value: headlineStats.last7Days, color: GREEN },
          { label: "PDF Requests", value: headlineStats.pdfRequests, color: AMBER, sub: "bounce captures" },
        ].map((stat, i) => (
          <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            {stat.sub && <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>{stat.sub}</div>}
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 2 — COVER TYPE DISTRIBUTION (THE HEADLINE CHART)
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Cover Type Distribution</h3>
        <p style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>
          The headline chart for underwriter pitch — shows specialist vs generic vs broker breakdown
        </p>
        {coverTypeDistribution && coverTypeDistribution.length > 0 ? (
          <div style={{ padding: "20px 0" }}>
            {coverTypeDistribution.map((entry) => (
              <div key={entry.type} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '160px', fontSize: '13px', color: TEXT, fontWeight: 500 }}>
                  {COVER_TYPE_LABELS[entry.type] || entry.type}
                </div>
                <div style={{ flex: 1, background: '#161b22', borderRadius: '6px', height: '32px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${entry.percentage}%`, 
                      background: COVER_TYPE_COLORS[entry.type] || MUTED, 
                      height: '100%', 
                      borderRadius: '6px',
                      minWidth: entry.count > 0 ? '2px' : '0',
                      transition: 'width 0.3s ease'
                    }} 
                  />
                </div>
                <div style={{ width: '100px', textAlign: 'right', fontSize: '14px', color: TEXT, fontWeight: 600 }}>
                  {entry.count} <span style={{ color: MUTED, fontSize: '12px', fontWeight: 400 }}>({entry.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: MUTED, padding: '40px 0', textAlign: 'center' }}>No data yet</div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 3 — GAP SEVERITY BREAKDOWN OVER TIME
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Gap Severity Over Time</h3>
        <p style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>Stacked daily breakdown: critical, important, worth reviewing</p>
        {gapSeverityOverTime && gapSeverityOverTime.length > 0 ? (
          <div style={{ padding: "20px 0" }}>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: RED }} />
                <span style={{ fontSize: '12px', color: TEXT }}>Critical</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: AMBER }} />
                <span style={{ fontSize: '12px', color: TEXT }}>Important</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: YELLOW }} />
                <span style={{ fontSize: '12px', color: TEXT }}>Worth Reviewing</span>
              </div>
            </div>
            {gapSeverityOverTime.map((day) => {
              const total = (day.critical || 0) + (day.important || 0) + (day.worth_reviewing || 0);
              const criticalPct = total > 0 ? (day.critical / total * 100) : 0;
              const importantPct = total > 0 ? (day.important / total * 100) : 0;
              const worthReviewingPct = total > 0 ? (day.worth_reviewing / total * 100) : 0;
              
              return (
                <div key={day.date} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: MUTED, marginBottom: '4px' }}>{day.date}</div>
                  <div style={{ display: 'flex', height: '28px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                    {criticalPct > 0 && (
                      <div 
                        style={{ 
                          width: `${criticalPct}%`, 
                          background: RED,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#fff'
                        }}
                      >
                        {day.critical > 0 && day.critical}
                      </div>
                    )}
                    {importantPct > 0 && (
                      <div 
                        style={{ 
                          width: `${importantPct}%`, 
                          background: AMBER,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#fff'
                        }}
                      >
                        {day.important > 0 && day.important}
                      </div>
                    )}
                    {worthReviewingPct > 0 && (
                      <div 
                        style={{ 
                          width: `${worthReviewingPct}%`, 
                          background: YELLOW,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#000'
                        }}
                      >
                        {day.worth_reviewing > 0 && day.worth_reviewing}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ color: MUTED, padding: '40px 0', textAlign: 'center' }}>No data yet</div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 4 — RENEWAL URGENCY DISTRIBUTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Renewal Urgency Distribution</h3>
        <p style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>Lead quality indicator — when policies are due for renewal</p>
        {renewalUrgency && renewalUrgency.length > 0 ? (
          <div>
            {/* Horizontal segmented bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', height: '40px', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                {renewalUrgency.map((entry) => (
                  entry.percentage > 0 && (
                    <div
                      key={entry.bucket}
                      style={{
                        width: `${entry.percentage}%`,
                        background: RENEWAL_COLORS[entry.bucket] || MUTED,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#fff',
                        minWidth: '2px'
                      }}
                      title={`${RENEWAL_BUCKET_LABELS[entry.bucket]}: ${entry.count} (${entry.percentage}%)`}
                    >
                      {entry.percentage > 10 && `${entry.percentage}%`}
                    </div>
                  )
                ))}
              </div>
            </div>
            
            {/* Legend list */}
            <div>
              {renewalUrgency.map((r) => (
                <div
                  key={r.bucket}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    marginBottom: 8,
                    background: `${RENEWAL_COLORS[r.bucket]}10`,
                    border: `1px solid ${RENEWAL_COLORS[r.bucket]}30`,
                    borderRadius: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: RENEWAL_COLORS[r.bucket] }} />
                    <span style={{ fontSize: 13, color: TEXT }}>{RENEWAL_BUCKET_LABELS[r.bucket]}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: RENEWAL_COLORS[r.bucket] }}>
                    {r.count} ({r.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: MUTED, padding: '40px 0', textAlign: 'center' }}>No data yet</div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 5 — TOP GAP PATTERNS (UNDERWRITER PRODUCT ROADMAP)
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Top Gap Patterns</h3>
        <p style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>
          Underwriter product roadmap — most common policy gaps detected
        </p>
        {topGapPatterns && topGapPatterns.length > 0 ? (
          <div style={{ padding: "20px 0" }}>
            {topGapPatterns.map((entry) => {
              // Find max count for scaling
              const maxCount = Math.max(...topGapPatterns.map(p => p.count));
              const percentage = (entry.count / maxCount * 100);
              
              return (
                <div key={entry.pattern} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '280px', fontSize: '12px', color: TEXT, lineHeight: '1.3' }}>
                    {entry.pattern.length > 60 ? entry.pattern.substring(0, 60) + "..." : entry.pattern}
                  </div>
                  <div style={{ flex: 1, background: '#161b22', borderRadius: '6px', height: '28px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${percentage}%`, 
                        background: AMBER, 
                        height: '100%', 
                        borderRadius: '6px',
                        minWidth: entry.count > 0 ? '2px' : '0',
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </div>
                  <div style={{ width: '60px', textAlign: 'right', fontSize: '14px', color: TEXT, fontWeight: 600 }}>
                    {entry.count}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ color: MUTED, padding: '40px 0', textAlign: 'center' }}>No data yet</div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 6 — RECENT SUBMISSIONS TABLE
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Recent Submissions</h3>
            <p style={{ fontSize: 12, color: MUTED }}>Last 20 audits — click row to view full details</p>
          </div>
          {/* SECTION 7 — EXPORT TO CSV BUTTON */}
          <button
            onClick={handleExportCSV}
            style={{
              padding: "8px 16px",
              background: GREEN,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ↓ Export to CSV
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                <th style={{ padding: "10px 8px", textAlign: "left", color: MUTED, fontWeight: 600 }}>Date</th>
                <th style={{ padding: "10px 8px", textAlign: "left", color: MUTED, fontWeight: 600 }}>Branch</th>
                <th style={{ padding: "10px 8px", textAlign: "left", color: MUTED, fontWeight: 600 }}>FAD</th>
                <th style={{ padding: "10px 8px", textAlign: "left", color: MUTED, fontWeight: 600 }}>Cover Type</th>
                <th style={{ padding: "10px 8px", textAlign: "center", color: MUTED, fontWeight: 600 }}>Critical</th>
                <th style={{ padding: "10px 8px", textAlign: "center", color: MUTED, fontWeight: 600 }}>Important</th>
                <th style={{ padding: "10px 8px", textAlign: "left", color: MUTED, fontWeight: 600 }}>Renewal</th>
                <th style={{ padding: "10px 8px", textAlign: "left", color: MUTED, fontWeight: 600 }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  style={{
                    borderBottom: `1px solid ${BORDER}30`,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${BORDER}30`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "10px 8px", color: TEXT }}>
                    {new Date(sub.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td style={{ padding: "10px 8px", color: TEXT }}>{sub.branch_name}</td>
                  <td style={{ padding: "10px 8px", color: TEXT, fontFamily: "monospace" }}>{sub.fad_code}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: `${COVER_TYPE_COLORS[sub.cover_type] || MUTED}20`,
                        color: COVER_TYPE_COLORS[sub.cover_type] || MUTED,
                      }}
                    >
                      {COVER_TYPE_LABELS[sub.cover_type] || sub.cover_type}
                    </span>
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "center", color: sub.critical_count > 0 ? RED : MUTED, fontWeight: 600 }}>
                    {sub.critical_count}
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "center", color: sub.important_count > 0 ? AMBER : MUTED, fontWeight: 600 }}>
                    {sub.important_count}
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: `${RENEWAL_COLORS[sub.renewal_bucket] || MUTED}20`,
                        color: RENEWAL_COLORS[sub.renewal_bucket] || MUTED,
                      }}
                    >
                      {RENEWAL_BUCKET_LABELS[sub.renewal_bucket] || sub.renewal_bucket}
                    </span>
                  </td>
                  <td style={{ padding: "10px 8px", color: MUTED, fontSize: 11 }}>{sub.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL — EXPANDED SUBMISSION DETAILS
          ═══════════════════════════════════════════════════════════════════════════ */}
      {selectedSubmission && (
        <div
          onClick={() => setSelectedSubmission(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: 24,
              maxWidth: 700,
              maxHeight: "80vh",
              overflowY: "auto",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Full Submission Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: MUTED,
                  fontSize: 24,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Submitted</div>
              <div style={{ fontSize: 14, color: TEXT }}>
                {new Date(selectedSubmission.created_at).toLocaleString("en-GB")}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Email</div>
              <div style={{ fontSize: 14, color: TEXT }}>{selectedSubmission.email}</div>
            </div>

            {selectedSubmission.branch_name && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Branch Name</div>
                <div style={{ fontSize: 14, color: TEXT }}>{selectedSubmission.branch_name}</div>
              </div>
            )}

            {selectedSubmission.fad_code && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>FAD Code</div>
                <div style={{ fontSize: 14, color: TEXT, fontFamily: "monospace" }}>{selectedSubmission.fad_code}</div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Gap Summary</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span style={{ padding: "6px 12px", borderRadius: 8, background: `${RED}20`, color: RED, fontSize: 13, fontWeight: 600 }}>
                  {selectedSubmission.critical_count} Critical
                </span>
                <span style={{ padding: "6px 12px", borderRadius: 8, background: `${AMBER}20`, color: AMBER, fontSize: 13, fontWeight: 600 }}>
                  {selectedSubmission.important_count} Important
                </span>
                <span style={{ padding: "6px 12px", borderRadius: 8, background: `${YELLOW}20`, color: YELLOW, fontSize: 13, fontWeight: 600 }}>
                  {selectedSubmission.worth_reviewing_count || 0} Worth Reviewing
                </span>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Full Audit Answers</h4>
              {selectedSubmission.answers && Object.entries(selectedSubmission.answers).map(([key, value]) => (
                <div key={key} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${BORDER}30` }}>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{getQuestionLabel(key)}</div>
                  <div style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{getValueLabel(key, value)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
