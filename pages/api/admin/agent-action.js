import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const VALID_ACTIONS = ["re-run-scout", "re-run-sage", "skip-oracle", "restart-pipeline", "pause-orchestrator"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.FCM_PIPELINE_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { action, orderId } = req.body;

    if (!action || !VALID_ACTIONS.includes(action)) {
      return res.status(400).json({ error: `Invalid action. Valid: ${VALID_ACTIONS.join(", ")}` });
    }

    let newStatus;
    let message;

    switch (action) {
      case "re-run-scout":
        newStatus = "researching";
        message = `Scout re-run triggered for #${orderId}`;
        break;
      case "re-run-sage":
        newStatus = "writing";
        message = `Sage re-run triggered for #${orderId}`;
        break;
      case "skip-oracle":
        newStatus = "awaiting_approval";
        message = `Oracle skipped for #${orderId} — moved to approval`;
        break;
      case "restart-pipeline":
        newStatus = "pending";
        message = `Pipeline restarted for #${orderId}`;
        break;
      case "pause-orchestrator":
        message = "Orchestrator paused";
        break;
    }

    if (orderId && newStatus) {
      const { error: updateErr } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (updateErr) throw updateErr;
    }

    // Log action
    await supabase.from("notifications").insert({
      type: "info",
      agent: "admin",
      message,
      created_at: new Date().toISOString(),
    });

    // Trigger the report pipeline if re-running
    if (action === "re-run-scout" || action === "re-run-sage" || action === "restart-pipeline") {
      const protocol = req.headers["x-forwarded-proto"] || "https";
      const host = req.headers.host;
      try {
        await fetch(`${protocol}://${host}/api/trigger-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": process.env.FCM_PIPELINE_SECRET },
          body: JSON.stringify({ orderId, action }),
        });
      } catch (triggerErr) {
        console.error("Trigger failed:", triggerErr);
      }
    }

    return res.status(200).json({ success: true, message });
  } catch (err) {
    console.error("Admin agent-action error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
