import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.FCM_PIPELINE_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: "orderId required" });

    // Update order status
    const { error: updateErr } = await supabase
      .from("orders")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", orderId);

    if (updateErr) throw updateErr;

    // Trigger delivery via existing deliver-report endpoint
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    try {
      const deliverRes = await fetch(`${baseUrl}/api/deliver-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.FCM_PIPELINE_SECRET },
        body: JSON.stringify({ orderId }),
      });

      if (deliverRes.ok) {
        // Update to delivered
        await supabase
          .from("orders")
          .update({ status: "delivered", delivered_at: new Date().toISOString() })
          .eq("id", orderId);

        // Log notification
        await supabase.from("notifications").insert({
          type: "delivered",
          agent: "system",
          message: `Report #${orderId} approved and delivered`,
          created_at: new Date().toISOString(),
        });

        return res.status(200).json({ success: true, message: "Report approved and delivered" });
      }
    } catch (deliverErr) {
      console.error("Delivery failed, but approval saved:", deliverErr);
    }

    // If delivery failed, still return success for the approval
    return res.status(200).json({ success: true, message: "Report approved (delivery pending)" });
  } catch (err) {
    console.error("Admin approve error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
