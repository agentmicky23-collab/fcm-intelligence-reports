"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={coverTypeDistribution} layout="vertical" margin={{ left: 20, right: 60, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis type="number" stroke={MUTED} style={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="type"
              stroke={MUTED}
              style={{ fontSize: 12 }}
              tickFormatter={(value) => COVER_TYPE_LABELS[value] || value}
            />
            <Tooltip
              contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: TEXT }}
              itemStyle={{ color: TEXT }}
              formatter={(value, name, props) => [
                `${value} (${props.payload.percentage}%)`,
                COVER_TYPE_LABELS[props.payload.type] || props.payload.type,
              ]}
            />
            <Bar dataKey="count" label={{ position: "right", fill: TEXT, fontSize: 12, formatter: (val, entry) => `${val} (${entry.percentage}%)` }}>
              {coverTypeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COVER_TYPE_COLORS[entry.type] || MUTED} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 3 — GAP SEVERITY BREAKDOWN OVER TIME
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Gap Severity Over Time</h3>
        <p style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>Stacked daily breakdown: critical, important, worth reviewing</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={gapSeverityOverTime} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="date" stroke={MUTED} style={{ fontSize: 11 }} />
            <YAxis stroke={MUTED} style={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: TEXT }}
              itemStyle={{ color: TEXT }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: TEXT }} />
            <Bar dataKey="critical" stackId="a" fill={RED} name="Critical" />
            <Bar dataKey="important" stackId="a" fill={AMBER} name="Important" />
            <Bar dataKey="worth_reviewing" stackId="a" fill={YELLOW} name="Worth Reviewing" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 4 — RENEWAL URGENCY DISTRIBUTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Renewal Urgency Distribution</h3>
        <p style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>Lead quality indicator — when policies are due for renewal</p>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <ResponsiveContainer width="50%" height={260}>
            <PieChart>
              <Pie
                data={renewalUrgency}
                dataKey="count"
                nameKey="bucket"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${RENEWAL_BUCKET_LABELS[entry.bucket]}: ${entry.percentage}%`}
                labelLine={false}
                style={{ fontSize: 11 }}
              >
                {renewalUrgency.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={RENEWAL_COLORS[entry.bucket] || MUTED} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
                formatter={(value, name) => [value, RENEWAL_BUCKET_LABELS[name] || name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1 }}>
            {renewalUrgency.map((r) => (
              <div
                key={r.bucket}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  marginBottom: 8,
                  background: `${RENEWAL_COLORS[r.bucket]}10`,
                  border: `1px solid ${RENEWAL_COLORS[r.bucket]}30`,
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 13, color: TEXT }}>{RENEWAL_BUCKET_LABELS[r.bucket]}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: RENEWAL_COLORS[r.bucket] }}>
                  {r.count} ({r.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 5 — TOP GAP PATTERNS (UNDERWRITER PRODUCT ROADMAP)
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Top Gap Patterns</h3>
        <p style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>
          Underwriter product roadmap — most common policy gaps detected
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topGapPatterns} layout="vertical" margin={{ left: 20, right: 60, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis type="number" stroke={MUTED} style={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="pattern"
              stroke={MUTED}
              style={{ fontSize: 11 }}
              width={280}
              tickFormatter={(value) => (value.length > 40 ? value.substring(0, 40) + "..." : value)}
            />
            <Tooltip
              contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: TEXT }}
              itemStyle={{ color: TEXT }}
            />
            <Bar dataKey="count" fill={AMBER} label={{ position: "right", fill: TEXT, fontSize: 12 }} />
          </BarChart>
        </ResponsiveContainer>
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
