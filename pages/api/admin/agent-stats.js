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
    const agents = ["scout", "sage", "sentinel", "oracle"];
    const result = {};

    for (const agentId of agents) {
      // Total completed runs
      const { count: totalRuns } = await supabase
        .from("agent_runs")
        .select("id", { count: "exact", head: true })
        .eq("agent_id", agentId)
        .in("status", ["success", "failed"]);

      // Successful runs
      const { count: successRuns } = await supabase
        .from("agent_runs")
        .select("id", { count: "exact", head: true })
        .eq("agent_id", agentId)
        .eq("status", "success");

      // Currently running
      const { count: running } = await supabase
        .from("agent_runs")
        .select("id", { count: "exact", head: true })
        .eq("agent_id", agentId)
        .eq("status", "running");

      // Average duration (successful runs only)
      const { data: durations } = await supabase
        .from("agent_runs")
        .select("duration_seconds")
        .eq("agent_id", agentId)
        .eq("status", "success")
        .not("duration_seconds", "is", null);

      const avgDuration = durations && durations.length > 0
        ? Math.round(durations.reduce((sum, r) => sum + r.duration_seconds, 0) / durations.length)
        : null;

      // Total cost
      const { data: costs } = await supabase
        .from("agent_runs")
        .select("cost_usd")
        .eq("agent_id", agentId)
        .not("cost_usd", "is", null);

      const totalCost = (costs || []).reduce((sum, r) => sum + (parseFloat(r.cost_usd) || 0), 0);

      // Last run
      const { data: lastRun } = await supabase
        .from("agent_runs")
        .select("started_at, status, duration_seconds")
        .eq("agent_id", agentId)
        .order("started_at", { ascending: false })
        .limit(1);

      // Currently active order (if running)
      const { data: activeRun } = await supabase
        .from("agent_runs")
        .select("order_id")
        .eq("agent_id", agentId)
        .eq("status", "running")
        .order("started_at", { ascending: false })
        .limit(1);

      const successRate = totalRuns > 0
        ? Math.round((successRuns / totalRuns) * 100)
        : null;

      result[agentId] = {
        totalRuns: totalRuns || 0,
        successRuns: successRuns || 0,
        successRate,
        running: running || 0,
        avgDurationSeconds: avgDuration,
        totalCostUsd: Math.round(totalCost * 100) / 100,
        lastRun: lastRun?.[0] || null,
        activeOrderId: activeRun?.[0]?.order_id || null,
      };
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Agent stats error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
