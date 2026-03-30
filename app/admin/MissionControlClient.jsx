"use client";
import { useState, useEffect, useRef } from "react";

const GOLD = "#D4AF37";
const BG = "#010409";
const CARD = "#0d1117";
const BORDER = "#1e2733";
const TEXT = "#e6edf3";
const MUTED = "#8b949e";
const GREEN = "#22c55e";
const RED = "#ef4444";
const BLUE = "#378ADD";
const PURPLE = "#7F77DD";
const CORAL = "#D85A30";
const TEAL = "#1D9E75";

const AGENTS_META = [
  { id: "scout", name: "Scout", role: "Research", color: TEAL, icon: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z", caps: ["Web scraping", "Google Places", "Crime data", "ONS demographics", "Map generation", "Image upload"] },
  { id: "sage", name: "Sage", role: "Writer", color: PURPLE, icon: "M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z", caps: ["Report generation", "Score calculation", "Image embedding", "Tier handling", "Revision loops"] },
  { id: "sentinel", name: "Sentinel", role: "Validator", color: CORAL, icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", caps: ["34-point checklist", "Score verification", "Source cross-ref", "Section completeness", "Claim validation"] },
  { id: "oracle", name: "Oracle", role: "QA", color: BLUE, icon: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 16v-4M12 8h.01", caps: ["Live viewer check", "Customer perspective", "Visual QA", "Clarity scoring", "Final approval"] },
];

function formatDuration(seconds) {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function deriveLevel(successCount) {
  if (successCount >= 50) return { level: 5, title: "Master" };
  if (successCount >= 25) return { level: 4, title: "Expert" };
  if (successCount >= 10) return { level: 3, title: "Skilled" };
  if (successCount >= 3) return { level: 2, title: "Learning" };
  return { level: 1, title: "Rookie" };
}

function deriveXp(successCount) {
  const thresholds = [0, 3, 10, 25, 50];
  const level = deriveLevel(successCount).level;
  if (level >= 5) return 100;
  const low = thresholds[level - 1];
  const high = thresholds[level];
  return Math.round(((successCount - low) / (high - low)) * 100);
}

function getApiKey() {
  if (typeof window !== "undefined") return sessionStorage.getItem("fcm_admin_key") || "";
  return "";
}

async function apiFetch(path, opts = {}) {
  const key = getApiKey();
  const res = await fetch(path, {
    ...opts,
    headers: { "x-api-key": key, "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

/* ── Agent XP Ring ── */
function AgentRing({ agent, size = 80, active = false }) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const xp = agent.stats?.xp || 0;
  const offset = circ * (1 - xp / 100);
  return (
    <div style={{ width: size, height: size, position: "relative", margin: "0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={BORDER} strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={agent.color} strokeWidth="3" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset 1.5s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={size * 0.35} height={size * 0.35} viewBox="0 0 24 24" fill="none" stroke={agent.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={agent.icon} />
        </svg>
      </div>
      {active && <div style={{ position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: GREEN, border: `2px solid ${BG}`, animation: "pulse 1.5s infinite" }} />}
    </div>
  );
}

/* ── Pipeline Steps ── */
function PipelineTracker({ steps, labels = ["Scout", "Sage", "Sentinel", "Write", "Oracle", "You"] }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "8px 0" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "contents" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 500, flexShrink: 0,
              background: s === 1 ? `${GREEN}20` : s === 0.5 ? (i === 5 ? `${GOLD}20` : `${BLUE}20`) : `${BORDER}60`,
              color: s === 1 ? GREEN : s === 0.5 ? (i === 5 ? GOLD : BLUE) : MUTED,
              border: s === 0.5 ? `2px solid ${i === 5 ? GOLD : BLUE}` : "none",
            }}>
              {s === 1 ? "✓" : s === 0.5 ? (i === 5 ? "?" : <span style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, display: "block", animation: "pulse 1.5s infinite" }} />) : labels[i][0]}
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: s === 1 ? `${GREEN}40` : s === 0.5 && steps[i + 1] !== 1 ? `${GOLD}30` : `${BORDER}60`, minWidth: 8, borderRadius: 1 }} />}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: MUTED, padding: "0 2px" }}>
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </div>
  );
}

/* ── Live Feed ── */
function LiveFeed({ items }) {
  const getColor = (type) => {
    switch (type) {
      case "success": return GREEN;
      case "error": return RED;
      case "approval": return GOLD;
      case "order": return GOLD;
      case "delivered": return GREEN;
      default: return BLUE;
    }
  };
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 16px", maxHeight: 260, overflowY: "auto", fontFamily: "'JetBrains Mono', monospace" }}>
      {items.length === 0 && <div style={{ color: MUTED, fontSize: 12, padding: 8 }}>No activity yet</div>}
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: i < items.length - 1 ? `1px solid ${BORDER}40` : "none", alignItems: "flex-start", animation: i === 0 ? "slideUp 0.3s ease" : "none" }}>
          <span style={{ color: MUTED, minWidth: 40, fontSize: 11 }}>{item.t || new Date(item.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: getColor(item.type), marginTop: 5, flexShrink: 0 }} />
          <span style={{ fontSize: 12, lineHeight: 1.4, color: TEXT }}>{item.msg || item.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Agent Card ── */
function AgentCard({ agent, expanded, onToggle }) {
  const isActive = agent.activeOrder;
  return (
    <div onClick={onToggle} style={{ background: CARD, border: `1px solid ${expanded ? agent.color + "40" : BORDER}`, borderRadius: 16, padding: 20, cursor: "pointer", transition: "all 0.3s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: expanded ? 16 : 0 }}>
        <AgentRing agent={agent} size={expanded ? 72 : 56} active={!!isActive} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: TEXT }}>{agent.name}</div>
          <div style={{ fontSize: 12, color: agent.color }}>{agent.role} | Opus 4.6</div>
          {!expanded && (
            <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 11, color: MUTED }}>
              <span>{agent.stats?.missions || 0} runs</span>
              <span style={{ color: agent.color }}>{agent.stats?.rate || "—"}</span>
              <span>{agent.stats?.avg || "—"}</span>
            </div>
          )}
        </div>
        {isActive ? (
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: `${agent.color}15`, color: agent.color }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: agent.color, display: "inline-block", animation: "pulse 1.5s infinite", marginRight: 4 }} />
            {isActive}
          </span>
        ) : (
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: `${GREEN}15`, color: GREEN }}>Online</span>
        )}
      </div>
      {expanded && (
        <div style={{ animation: "slideUp 0.3s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[
              { val: agent.stats?.missions || 0, label: "Missions", color: TEXT },
              { val: agent.stats?.rate || "—", label: "Success", color: agent.color },
              { val: agent.stats?.avg || "—", label: "Avg time", color: TEXT },
            ].map((s, i) => (
              <div key={i} style={{ background: BG, borderRadius: 8, padding: 10, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
            {agent.caps.map((c, i) => (
              <span key={i} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: `${agent.color}10`, color: agent.color }}>{c}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: `${BORDER}60`, overflow: "hidden" }}>
              <div style={{ width: `${agent.stats?.xp || 0}%`, height: "100%", borderRadius: 3, background: agent.color, transition: "width 1s" }} />
            </div>
            <span style={{ fontSize: 11, color: agent.color, whiteSpace: "nowrap" }}>Lv.{agent.stats?.level || 1}</span>
          </div>
          <div style={{ fontSize: 11, color: MUTED }}>{agent.stats?.title || ""}</div>
        </div>
      )}
    </div>
  );
}

/* ── Order Card ── */
function OrderCard({ order, onApprove, onAgentAction }) {
  const statusColors = { awaiting_approval: GOLD, awaiting: GOLD, writing: BLUE, research: TEAL, researching: TEAL, validating: CORAL, qa: BLUE, delivered: GREEN, completed: GREEN, error: RED, pending: MUTED };
  const statusLabels = { awaiting_approval: "Awaiting you", awaiting: "Awaiting you", writing: "Writing", research: "Research", researching: "Research", validating: "Validating", qa: "QA Review", delivered: "Delivered", completed: "Completed", error: "Error", pending: "Pending" };
  const st = order.status || "pending";
  const c = statusColors[st] || MUTED;
  const steps = order.steps || deriveSteps(st);
  const isDone = st === "delivered" || st === "completed";

  return (
    <div style={{ background: CARD, border: st === "awaiting_approval" || st === "awaiting" ? `2px solid ${GOLD}40` : `1px solid ${BORDER}`, borderRadius: 16, padding: 16, marginBottom: 10, opacity: isDone ? 0.5 : 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${c}15`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: c, fontWeight: 600 }}>
          {String(order.id).slice(0, 3)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{order.business_name || order.name}</div>
          <div style={{ fontSize: 11, color: MUTED }}>{order.report_tier || order.tier} | £{order.report_price || order.price || 0} | {order.overall_score || "—"}</div>
        </div>
        <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: `${c}15`, color: c, fontWeight: 500 }}>
          {(st === "writing" || st === "research" || st === "researching") ? (
            <><span style={{ width: 6, height: 6, borderRadius: "50%", background: c, display: "inline-block", animation: "pulse 1.5s infinite", marginRight: 4 }} />{statusLabels[st]}</>
          ) : statusLabels[st] || st}
        </span>
      </div>
      <PipelineTracker steps={steps} />
      {(st === "awaiting_approval" || st === "awaiting") && (
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {order.viewer_url && <a href={order.viewer_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: "6px 16px", borderRadius: 8, border: `1px solid ${BLUE}40`, background: "transparent", color: BLUE, cursor: "pointer", textDecoration: "none" }}>Review report</a>}
          <button onClick={(e) => { e.stopPropagation(); onApprove(order.id); }} style={{ fontSize: 12, padding: "6px 16px", borderRadius: 8, border: "none", background: GREEN, color: "#fff", cursor: "pointer", fontWeight: 600 }}>Approve + ship</button>
          <button onClick={(e) => { e.stopPropagation(); onAgentAction("re-run-sage", order.id); }} style={{ fontSize: 12, padding: "6px 16px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, cursor: "pointer" }}>Re-run Sage</button>
        </div>
      )}
      {!isDone && st !== "awaiting_approval" && st !== "awaiting" && (
        <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 11, color: MUTED }}>
          <span>{order.section_count || "—"} sections</span>
          <span>{order.image_count || "—"} images</span>
        </div>
      )}
    </div>
  );
}

function deriveSteps(status) {
  switch (status) {
    case "researching": case "research": return [0.5, 0, 0, 0, 0, 0];
    case "writing": return [1, 0.5, 0, 0, 0, 0];
    case "validating": return [1, 1, 0.5, 0, 0, 0];
    case "qa": return [1, 1, 1, 1, 0.5, 0];
    case "awaiting_approval": case "awaiting": return [1, 1, 1, 1, 1, 0.5];
    case "delivered": case "completed": return [1, 1, 1, 1, 1, 1];
    default: return [0, 0, 0, 0, 0, 0];
  }
}

/* ── LOGIN SCREEN ── */
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/stats", { headers: { "x-api-key": pw } });
      if (res.ok) {
        sessionStorage.setItem("fcm_admin", "true");
        sessionStorage.setItem("fcm_admin_key", pw);
        onLogin();
      } else {
        setErr("Access denied");
      }
    } catch {
      setErr("Connection failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: BG }}>
      <div style={{ textAlign: "center", maxWidth: 360, width: "100%", padding: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#000", margin: "0 auto 24px" }}>F</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Mission Control</h1>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 32 }}>FCM Intelligence command centre</p>
        <input
          type="password"
          placeholder="Enter access key"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${BORDER}`, background: CARD, color: TEXT, fontSize: 14, outline: "none", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}
        />
        {err && <div style={{ color: RED, fontSize: 12, marginBottom: 8 }}>{err}</div>}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "none", background: GOLD, color: "#000", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Connecting..." : "Enter Mission Control"}
        </button>
      </div>
    </div>
  );
}

/* ── MAIN DASHBOARD ── */
export default function MissionControlClient() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("hq");
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [time, setTime] = useState("");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activity, setActivity] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [agentStats, setAgentStats] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("fcm_admin") === "true") setAuthed(true);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date().toLocaleTimeString("en-GB")), 1000);
    setTime(new Date().toLocaleTimeString("en-GB"));
    return () => clearInterval(iv);
  }, []);

  const fetchAll = async () => {
    try {
      const [s, o, a, ag] = await Promise.all([
        apiFetch("/api/admin/stats"),
        apiFetch("/api/admin/orders"),
        apiFetch("/api/admin/activity"),
        apiFetch("/api/admin/agent-stats"),
      ]);
      setStats(s);
      setOrders(o);
      setActivity(a);
      setAgentStats(ag);
    } catch (e) {
      console.error("Poll failed:", e);
    }
  };

  const fetchSubscribers = async () => {
    try { setSubscribers(await apiFetch("/api/admin/subscribers")); } catch {}
  };

  useEffect(() => {
    if (!authed) return;
    fetchAll();
    fetchSubscribers();
    const iv = setInterval(fetchAll, 30000);
    return () => clearInterval(iv);
  }, [authed]);

  const handleApprove = async (orderId) => {
    try {
      setActionMsg("Approving...");
      await apiFetch("/api/admin/approve", { method: "POST", body: JSON.stringify({ orderId }) });
      setActionMsg("Report approved & delivered!");
      fetchAll();
      setTimeout(() => setActionMsg(""), 3000);
    } catch (e) { setActionMsg("Approve failed: " + e.message); }
  };

  const handleAgentAction = async (action, orderId) => {
    try {
      setActionMsg(`Running ${action}...`);
      await apiFetch("/api/admin/agent-action", { method: "POST", body: JSON.stringify({ action, orderId }) });
      setActionMsg(`${action} triggered`);
      fetchAll();
      setTimeout(() => setActionMsg(""), 3000);
    } catch (e) { setActionMsg("Action failed: " + e.message); }
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const awaitingOrders = orders.filter(o => o.status === "awaiting_approval" || o.status === "awaiting");
  const activeOrders = orders.filter(o => !["delivered", "completed", "awaiting_approval", "awaiting"].includes(o.status));

  // Build agent objects with REAL data from agent_runs table
  const agents = AGENTS_META.map(a => {
    const as = agentStats?.[a.id];
    const isRunning = as?.running > 0;
    const activeOrderId = as?.activeOrderId;

    // Derive active status from real agent_runs data
    const activeLabel = isRunning && activeOrderId
      ? `${a.role === "Writer" ? "Writing" : a.role === "Research" ? "Researching" : a.role === "Validator" ? "Validating" : "Reviewing"} #${activeOrderId}`
      : null;

    // Fallback: also check order statuses for backward compat
    const activeOrder = !activeLabel ? orders.find(o => {
      if (a.id === "scout" && (o.status === "research" || o.status === "researching")) return true;
      if (a.id === "sage" && o.status === "writing") return true;
      if (a.id === "sentinel" && o.status === "validating") return true;
      if (a.id === "oracle" && o.status === "qa") return true;
      return false;
    }) : null;

    const finalActiveLabel = activeLabel || (activeOrder
      ? `${a.role === "Writer" ? "Writing" : a.role === "Research" ? "Researching" : a.role === "Validator" ? "Validating" : "Reviewing"} #${activeOrder.id}`
      : null);

    const successCount = as?.successRuns || 0;
    const { level, title } = deriveLevel(successCount);
    const xp = deriveXp(successCount);

    return {
      ...a,
      activeOrder: finalActiveLabel,
      stats: {
        missions: as?.totalRuns || 0,
        rate: as?.successRate != null ? `${as.successRate}%` : "—",
        avg: formatDuration(as?.avgDurationSeconds),
        level,
        xp,
        title: as ? `${title} — $${as.totalCostUsd} spent` : "No data",
      },
    };
  });

  // Online agents = agents with at least 1 run OR currently running
  const onlineAgents = agents.filter(a => a.stats.missions > 0 || a.activeOrder).length;

  const tabs = [
    { id: "hq", label: "HQ" },
    { id: "squad", label: "Agent squad" },
    { id: "pipeline", label: "Pipeline" },
    { id: "biz", label: "Business" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", color: TEXT, minHeight: "100vh", padding: "0 16px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 8px ${GOLD}20} 50%{box-shadow:0 0 20px ${GOLD}40} }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 0 16px", borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#000" }}>F</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Mission Control</div>
          <div style={{ fontSize: 12, color: MUTED }}>FCM Intelligence command centre</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {actionMsg && <span style={{ fontSize: 12, color: GOLD, animation: "slideUp 0.3s ease" }}>{actionMsg}</span>}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 12, color: MUTED }}>{onlineAgents} agents online</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: MUTED }}>{time}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); if (t.id === "biz") fetchSubscribers(); }} style={{
            fontSize: 13, padding: "8px 18px", borderRadius: 8, border: tab === t.id ? "none" : `1px solid ${BORDER}`,
            background: tab === t.id ? `${GOLD}15` : "transparent",
            color: tab === t.id ? GOLD : MUTED, cursor: "pointer", fontWeight: tab === t.id ? 600 : 400,
            transition: "all 0.2s", fontFamily: "inherit",
          }}>
            {t.label}
            {t.id === "pipeline" && awaitingOrders.length > 0 && <span style={{ marginLeft: 6, fontSize: 10, padding: "1px 6px", borderRadius: 99, background: `${GOLD}20`, color: GOLD }}>{awaitingOrders.length}</span>}
          </button>
        ))}
      </div>

      {/* HQ TAB */}
      {tab === "hq" && (
        <div style={{ animation: "slideUp 0.3s ease" }}>
          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Revenue MTD", val: stats ? `£${(stats.revenue?.mtd || 0).toLocaleString()}` : "—", sub: stats ? `+£${stats.revenue?.weekChange || 0} this week` : "—", subColor: GREEN, pct: stats ? Math.min(100, Math.round(((stats.revenue?.mtd || 0) / (stats.revenue?.target || 5000)) * 100)) : 0, pctColor: GREEN, target: stats ? `${Math.round(((stats.revenue?.mtd || 0) / (stats.revenue?.target || 5000)) * 100)}% to £${((stats.revenue?.target || 5000) / 1000).toFixed(0)}k` : "—" },
              { label: "Pipeline", val: stats ? `${stats.pipeline?.active || 0} active` : "—", sub: stats ? `${stats.pipeline?.awaiting || 0} awaiting you` : "—", subColor: GOLD, pct: stats ? Math.min(100, Math.round(((stats.pipeline?.total || 0) / 10) * 100)) : 0, pctColor: BLUE, target: stats ? `${stats.pipeline?.total || 0} total` : "—" },
              { label: "Agent ops today", val: stats ? `${stats.agents?.opsToday || 0}` : "—", sub: stats ? `${stats.agents?.errorsToday || 0} errors today` : "—", subColor: stats?.agents?.errorsToday > 0 ? RED : GREEN, pct: stats?.agents?.uptime != null ? Math.round(stats.agents.uptime) : 0, pctColor: GREEN, target: stats?.agents?.uptime != null ? `${stats.agents.uptime}% success rate` : "No data" },
              { label: "API spend", val: stats?.apiSpend?.today != null ? `$${stats.apiSpend.today}` : "—", sub: stats?.apiSpend?.perReport != null ? `$${stats.apiSpend.perReport}/report avg` : "No runs yet", subColor: MUTED, pct: stats?.apiSpend?.month != null ? Math.min(100, Math.round((stats.apiSpend.month / (stats.apiSpend.budget || 300)) * 100)) : 0, pctColor: CORAL, target: stats?.apiSpend?.month != null ? `$${stats.apiSpend.month} / $${stats.apiSpend.budget} budget` : "No data" },
            ].map((m, i) => (
              <div key={i} style={{ background: CARD, borderRadius: 12, padding: 16, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: i === 0 ? GREEN : TEXT, marginBottom: 2 }}>{m.val}</div>
                <div style={{ fontSize: 11, color: m.subColor, marginBottom: 8 }}>{m.sub}</div>
                <div style={{ height: 4, borderRadius: 2, background: `${BORDER}60`, overflow: "hidden" }}>
                  <div style={{ width: `${m.pct}%`, height: "100%", borderRadius: 2, background: m.pctColor, transition: "width 1s" }} />
                </div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 3 }}>{m.target}</div>
              </div>
            ))}
          </div>

          {/* Agent Floor */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Agent floor</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 11, color: MUTED }}>Live</span>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: "center" }}>
              {agents.map(a => (
                <div key={a.id} style={{ cursor: "pointer" }} onClick={() => setTab("squad")}>
                  <AgentRing agent={a} size={68} active={!!a.activeOrder} />
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{a.role}</div>
                  {a.activeOrder ? (
                    <div>
                      <span style={{ fontSize: 11, color: a.color }}>{a.activeOrder}</span>
                      <div style={{ height: 3, borderRadius: 2, background: `${BORDER}60`, overflow: "hidden", marginTop: 4 }}>
                        <div style={{ width: "60%", height: "100%", borderRadius: 2, background: a.color, transition: "width 2s" }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: a.color }}>{a.stats?.rate || "—"} success</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Feed */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Live feed</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, animation: "pulse 1.5s infinite" }} />
          </div>
          <LiveFeed items={activity} />

          {/* Approval Card */}
          {awaitingOrders.length > 0 && (
            <div style={{ marginTop: 20, background: CARD, border: `2px solid ${GOLD}30`, borderRadius: 16, padding: 20, animation: "glow 3s infinite" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Needs your attention</span>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: `${GOLD}15`, color: GOLD }}>{awaitingOrders.length} report{awaitingOrders.length > 1 ? "s" : ""}</span>
              </div>
              {awaitingOrders.map(o => (
                <div key={o.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, padding: "8px 0", borderBottom: `1px solid ${BORDER}30` }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>#{o.id} — {o.business_name}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{o.report_tier} | {o.overall_score || "—"} | {o.section_count || "—"} sections | {o.image_count || "—"} images</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {o.viewer_url && <a href={o.viewer_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, padding: "8px 20px", borderRadius: 8, border: `1px solid ${BLUE}40`, background: "transparent", color: BLUE, cursor: "pointer", textDecoration: "none" }}>Review</a>}
                    <button onClick={() => handleApprove(o.id)} style={{ fontSize: 13, padding: "8px 20px", borderRadius: 8, border: "none", background: GREEN, color: "#fff", cursor: "pointer", fontWeight: 600 }}>Approve + ship</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AGENT SQUAD TAB */}
      {tab === "squad" && (
        <div style={{ animation: "slideUp 0.3s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {agents.map(a => (
              <AgentCard key={a.id} agent={a} expanded={expandedAgent === a.id} onToggle={() => setExpandedAgent(expandedAgent === a.id ? null : a.id)} />
            ))}
          </div>
        </div>
      )}

      {/* PIPELINE TAB */}
      {tab === "pipeline" && (
        <div style={{ animation: "slideUp 0.3s ease" }}>
          {orders.length === 0 && <div style={{ color: MUTED, fontSize: 14, padding: 20, textAlign: "center" }}>No orders yet</div>}
          {orders.map(o => <OrderCard key={o.id} order={o} onApprove={handleApprove} onAgentAction={handleAgentAction} />)}
        </div>
      )}

      {/* BUSINESS TAB */}
      {tab === "biz" && (
        <div style={{ animation: "slideUp 0.3s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Subscribers", val: `${subscribers.length} total`, sub: `${subscribers.filter(s => s.tier === "pro").length} Pro`, pct: Math.min(100, subscribers.length * 10), color: GOLD, target: "Growing" },
              { label: "Reports sold", val: stats ? `${stats.pipeline?.total || 0}` : "—", sub: stats ? `£${(stats.revenue?.mtd || 0).toLocaleString()} revenue` : "—", pct: 40, color: GREEN, target: "This month" },
              { label: "Active pipeline", val: stats ? `${stats.pipeline?.active || 0}` : "—", sub: stats ? `${stats.pipeline?.awaiting || 0} need approval` : "—", pct: 60, color: BLUE, target: "In progress" },
            ].map((m, i) => (
              <div key={i} style={{ background: CARD, borderRadius: 12, padding: 16, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>{m.val}</div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{m.sub}</div>
                <div style={{ height: 4, borderRadius: 2, background: `${BORDER}60`, overflow: "hidden" }}>
                  <div style={{ width: `${m.pct}%`, height: "100%", borderRadius: 2, background: m.color }} />
                </div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 3 }}>{m.target}</div>
              </div>
            ))}
          </div>

          {/* Subscribers */}
          {subscribers.map(sub => (
            <div key={sub.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, color: GOLD }}>
                  {(sub.name || sub.email || "?").slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{sub.name || "Subscriber"}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{sub.email}</div>
                </div>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: `${GOLD}15`, color: GOLD }}>{sub.tier || "Free"}</span>
              </div>
              {sub.preferences && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13, marginBottom: 14 }}>
                  {sub.preferences.regions && <div><span style={{ color: MUTED }}>Regions: </span>{sub.preferences.regions.join(", ")}</div>}
                  {sub.preferences.budget && <div><span style={{ color: MUTED }}>Budget: </span>{sub.preferences.budget}</div>}
                  {sub.preferences.types && <div><span style={{ color: MUTED }}>Types: </span>{sub.preferences.types.join(", ")}</div>}
                  {sub.match_count != null && <div><span style={{ color: MUTED }}>Matches: </span>{sub.match_count} listings</div>}
                </div>
              )}
            </div>
          ))}

          {subscribers.length === 0 && <div style={{ color: MUTED, fontSize: 14, padding: 20, textAlign: "center" }}>No subscribers found</div>}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            {["Add listing", "Check all URLs", "Re-run matching", "Broadcast email"].map((a, i) => (
              <button key={i} style={{ fontSize: 12, padding: "6px 16px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, cursor: "pointer", fontFamily: "inherit" }}>{a}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
