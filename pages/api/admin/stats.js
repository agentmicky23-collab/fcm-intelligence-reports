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

    // Revenue MTD
    const { data: monthOrders } = await supabase
      .from("orders")
      .select("report_price, created_at")
      .gte("created_at", startOfMonth);

    const mtd = (monthOrders || []).reduce((sum, o) => sum + (o.report_price || 0), 0);
    const weekChange = (monthOrders || [])
      .filter(o => new Date(o.created_at) >= new Date(startOfWeek))
      .reduce((sum, o) => sum + (o.report_price || 0), 0);

    // Pipeline
    const { data: allOrders } = await supabase.from("orders").select("status");
    const activeStatuses = ["researching", "research", "writing", "validating", "qa"];
    const awaitingStatuses = ["awaiting_approval", "awaiting"];
    const active = (allOrders || []).filter(o => activeStatuses.includes(o.status)).length;
    const awaiting = (allOrders || []).filter(o => awaitingStatuses.includes(o.status)).length;
    const total = (allOrders || []).length;

    // Notifications count for ops today
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const { count: opsToday } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayStart);

    const errors = (allOrders || []).filter(o => o.status === "error").length;

    return res.status(200).json({
      revenue: { mtd, weekChange, target: 5000 },
      pipeline: { active, awaiting, total },
      agents: {
        opsToday: opsToday || 0,
        errors,
        uptime: errors === 0 ? 99.9 : 95.0,
      },
      apiSpend: {
        today: total * 29,
        perReport: 29,
        budget: 300,
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
