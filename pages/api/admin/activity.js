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
    // Get notifications
    const { data: notifications } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    const items = (notifications || []).map(n => ({
      timestamp: n.created_at,
      t: new Date(n.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      agent: n.agent || "system",
      message: n.message || n.title || "Activity",
      msg: n.message || n.title || "Activity",
      type: n.type || "info",
    }));

    // Also synthesize events from recent order status changes
    const { data: recentOrders } = await supabase
      .from("orders")
      .select("id, business_name, status, updated_at, report_tier")
      .order("updated_at", { ascending: false })
      .limit(20);

    const orderEvents = (recentOrders || []).map(o => {
      let type = "info";
      let agent = "system";
      let msg = `Order #${o.id} — ${o.business_name} — ${o.status}`;

      if (o.status === "delivered") { type = "delivered"; msg = `Report DELIVERED — #${o.id} ${o.business_name}`; }
      else if (o.status === "awaiting_approval") { type = "approval"; msg = `Order #${o.id} awaiting YOUR approval`; }
      else if (o.status === "error") { type = "error"; msg = `ERROR on #${o.id} — ${o.business_name}`; }
      else if (o.status === "writing") { agent = "sage"; msg = `Sage working on #${o.id} — ${o.report_tier} report`; }
      else if (o.status === "researching") { agent = "scout"; msg = `Scout researching #${o.id} — ${o.business_name}`; }

      return {
        timestamp: o.updated_at,
        t: new Date(o.updated_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        agent, message: msg, msg, type,
      };
    });

    // Merge and sort by timestamp
    const all = [...items, ...orderEvents]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 30);

    return res.status(200).json(all);
  } catch (err) {
    console.error("Admin activity error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
