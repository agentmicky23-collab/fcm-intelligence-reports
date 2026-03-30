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
    const { data: subscribers, error } = await supabase
      .from("insider_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const enriched = (subscribers || []).map(sub => ({
      id: sub.id,
      name: sub.name || sub.full_name || null,
      email: sub.email,
      tier: sub.tier || sub.plan || "free",
      preferences: sub.preferences || null,
      match_count: sub.match_count || 0,
      created_at: sub.created_at,
      last_activity: sub.last_login || sub.updated_at || sub.created_at,
    }));

    return res.status(200).json(enriched);
  } catch (err) {
    console.error("Admin subscribers error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
