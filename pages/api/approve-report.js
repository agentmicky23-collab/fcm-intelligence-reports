// ============================================================
// FCM INTELLIGENCE — REPORT APPROVAL API ROUTE
// File: pages/api/approve-report.js
// Purpose: Human approval gate for report delivery pipeline
// URL: /api/approve-report?key=SECRET&orderId=ORDER_ID&action=approve|reject
// ============================================================

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const APPROVAL_SECRET = process.env.REPORT_APPROVAL_SECRET || "fcm-pipeline-2026-secure-key";

export default async function handler(req, res) {
  const { key, orderId, action } = req.query;

  // ── Validate secret key ──
  if (key !== APPROVAL_SECRET) {
    return res.status(403).send(htmlPage("❌ Access Denied", "Invalid approval key.", "red"));
  }

  // ── Validate parameters ──
  if (!orderId) {
    return res.status(400).send(htmlPage("❌ Missing Order ID", "No orderId provided in the URL.", "red"));
  }

  if (!action || !["approve", "reject"].includes(action)) {
    return res.status(400).send(htmlPage("❌ Invalid Action", "Action must be 'approve' or 'reject'.", "red"));
  }

  try {
    // ── Look up the order ──
    const { data: report, error: fetchError } = await supabase
      .from("reports")
      .select("id, order_id, status, tier, customer_email")
      .eq("order_id", orderId)
      .single();

    if (fetchError || !report) {
      return res.status(404).send(htmlPage("❌ Report Not Found", `No report found for order ${orderId}.`, "red"));
    }

    // ── Check status ──
    if (report.status === "delivered") {
      return res.status(200).send(htmlPage("ℹ️ Already Delivered", `Report for order ${orderId} has already been delivered to ${report.customer_email}.`, "blue"));
    }

    // ── Handle rejection ──
    if (action === "reject") {
      await supabase
        .from("reports")
        .update({ status: "rejected" })
        .eq("order_id", orderId);

      return res.status(200).send(htmlPage(
        "🛑 Report Rejected",
        `Report for order ${orderId} has been rejected. It will NOT be delivered to the customer. You can re-review and approve later.`,
        "orange"
      ));
    }

    // ── Handle approval — trigger delivery ──
    // Update status to approved first
    await supabase
      .from("reports")
      .update({ status: "approved" })
      .eq("order_id", orderId);

    // Call the deliver-report API to send the email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.host}`;
    const deliverRes = await fetch(`${baseUrl}/api/deliver-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.FCM_PIPELINE_SECRET || "",
      },
      body: JSON.stringify({ orderId }),
    });

    if (!deliverRes.ok) {
      const errText = await deliverRes.text();
      console.error(`[approve-report] deliver-report failed for ${orderId}:`, errText);
      return res.status(500).send(htmlPage(
        "⚠️ Approved but Delivery Failed",
        `Report was approved but delivery failed. Error: ${errText}. Status has been set to 'approved' — you can retry delivery manually.`,
        "orange"
      ));
    }

    return res.status(200).send(htmlPage(
      "✅ Report Approved & Delivered",
      `Report for order ${orderId} has been approved and delivered to ${report.customer_email} (${report.tier} tier).`,
      "green"
    ));

  } catch (err) {
    console.error(`[approve-report] Unexpected error for ${orderId}:`, err);
    return res.status(500).send(htmlPage("❌ Server Error", `Something went wrong: ${err.message}`, "red"));
  }
}

// ── HTML response page ──
function htmlPage(title, message, color) {
  const colors = {
    green: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
    red: { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
    orange: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
    blue: { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
  };
  const c = colors[color] || colors.blue;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — FCM Intelligence</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0B1D3A; margin: 0; padding: 40px 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .card { background: #fff; border-radius: 12px; padding: 40px; max-width: 520px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .badge { display: inline-block; background: ${c.bg}; border: 1px solid ${c.border}; border-radius: 8px; padding: 12px 20px; margin-bottom: 20px; }
  .badge h1 { margin: 0; font-size: 20px; color: ${c.text}; }
  .msg { font-size: 14px; color: #475569; line-height: 1.7; }
  .footer { margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center; }
</style></head><body>
<div class="card">
  <div style="font-size:12px;font-weight:700;color:#BF9B51;text-transform:uppercase;letter-spacing:3px;margin-bottom:24px;">FCM Intelligence</div>
  <div class="badge"><h1>${title}</h1></div>
  <p class="msg">${message}</p>
  <div class="footer">© 2026 Firstclass Managerial Ltd trading as FCM Intelligence</div>
</div>
</body></html>`;
}
