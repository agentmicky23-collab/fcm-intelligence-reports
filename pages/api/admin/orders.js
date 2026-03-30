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
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Try to join with reports table
    const enriched = await Promise.all(
      (orders || []).map(async (order) => {
        try {
          const { data: report } = await supabase
            .from("reports")
            .select("status, section_count, overall_score, image_count, viewer_url")
            .eq("order_id", order.id)
            .single();

          return {
            ...order,
            report_status: report?.status || null,
            section_count: report?.section_count || null,
            overall_score: report?.overall_score || null,
            image_count: report?.image_count || null,
            viewer_url: report?.viewer_url || null,
          };
        } catch {
          return { ...order, report_status: null, section_count: null, overall_score: null, image_count: null, viewer_url: null };
        }
      })
    );

    return res.status(200).json(enriched);
  } catch (err) {
    console.error("Admin orders error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
