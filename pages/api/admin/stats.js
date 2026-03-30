import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.FCM_PIPELINE_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfWeek = new Date(now.getTime() - 7 * 86400000).toISOString();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // ── Revenue MTD (real from orders) ──
    const { data: monthOrders } = await supabase
      .from("orders")
      .select("report_price, created_at")
      .gte("created_at", startOfMonth);

    const mtd = (monthOrders || []).reduce((sum, o) => sum + (o.report_price || 0), 0);
    const weekChange = (monthOrders || [])
      .filter(o => new Date(o.created_at) >= new Date(startOfWeek))
      .reduce((sum, o) => sum + (o.report_price || 0), 0);

    // ── Pipeline (real from orders) ──
    const { data: allOrders } = await supabase.from("orders").select("status");
    const activeStatuses = ["researching", "research", "writing", "validating", "qa"];
    const awaitingStatuses = ["awaiting_approval", "awaiting"];
    const active = (allOrders || []).filter(o => activeStatuses.includes(o.status)).length;
    const awaiting = (allOrders || []).filter(o => awaitingStatuses.includes(o.status)).length;
    const total = (allOrders || []).length;

    // ── Agent Ops Today (real from agent_runs) ──
    const { count: opsToday } = await supabase
      .from("agent_runs")
      .select("id", { count: "exact", head: true })
      .gte("started_at", todayStart);

    const { count: errorsToday } = await supabase
      .from("agent_runs")
      .select("id", { count: "exact", head: true })
      .gte("started_at", todayStart)
      .eq("status", "failed");

    // Total runs ever for uptime calc
    const { count: totalRuns } = await supabase
      .from("agent_runs")
      .select("id", { count: "exact", head: true });

    const { count: totalFailed } = await supabase
      .from("agent_runs")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed");

    const uptime = totalRuns > 0
      ? Math.round(((totalRuns - totalFailed) / totalRuns) * 1000) / 10
      : null;

    // ── API Spend (real from agent_runs.cost_usd) ──
    const { data: todayCosts } = await supabase
      .from("agent_runs")
      .select("cost_usd")
      .gte("started_at", todayStart);

    const spendToday = (todayCosts || []).reduce((sum, r) => sum + (parseFloat(r.cost_usd) || 0), 0);

    const { data: monthCosts } = await supabase
      .from("agent_runs")
      .select("cost_usd")
      .gte("started_at", startOfMonth);

    const spendMonth = (monthCosts || []).reduce((sum, r) => sum + (parseFloat(r.cost_usd) || 0), 0);

    // Per-report cost: total spend / total completed orders
    const completedOrders = (allOrders || []).filter(o => ["delivered", "completed", "awaiting_approval", "awaiting"].includes(o.status)).length;
    const perReport = completedOrders > 0 ? Math.round((spendMonth / completedOrders) * 100) / 100 : null;

    return res.status(200).json({
      revenue: { mtd, weekChange, target: 5000 },
      pipeline: { active, awaiting, total },
      agents: {
        opsToday: opsToday || 0,
        errorsToday: errorsToday || 0,
        errors: (allOrders || []).filter(o => o.status === "error").length,
        uptime,
      },
      apiSpend: {
        today: Math.round(spendToday * 100) / 100,
        month: Math.round(spendMonth * 100) / 100,
        perReport,
        budget: 300,
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
