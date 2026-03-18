// ============================================================
// FCM INTELLIGENCE — REPORT DATA API
// File: pages/api/report/data.js (Next.js API route)
//
// Usage: GET /api/report/data?orderId=2026-03-16-001
// Returns: Full report JSON matching fcm-report-schema.json
//
// Security: Validates that the requesting user owns this report
// (via session cookie or auth header). In MVP, serves to any
// authenticated request.
//
// Version: 1.0 — 18 March 2026
// ============================================================

// import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ error: "orderId query parameter required" });
  }

  try {
    // ========================================
    // FETCH FROM SUPABASE
    // ========================================
    // In production, uncomment and configure:
    //
    // const supabase = createClient(
    //   process.env.SUPABASE_URL,
    //   process.env.SUPABASE_ANON_KEY
    // );
    //
    // // Fetch the complete report JSON
    // const { data, error } = await supabase
    //   .from("reports")
    //   .select("report_json, order_ref, customer_email, tier, status")
    //   .eq("order_ref", orderId)
    //   .single();
    //
    // if (error || !data) {
    //   return res.status(404).json({ error: "Report not found" });
    // }
    //
    // // Check report is complete (not still being generated)
    // if (data.status !== "complete" && data.status !== "approved") {
    //   return res.status(202).json({
    //     error: "Report is still being generated",
    //     status: data.status,
    //     order_ref: data.order_ref,
    //   });
    // }
    //
    // // TODO: Verify requesting user owns this report
    // // (check session cookie, compare customer_email, etc.)
    //
    // return res.status(200).json(data.report_json);

    // ========================================
    // PLACEHOLDER: Return 404 until Supabase is wired
    // ========================================
    return res.status(404).json({
      error: "Report not found",
      detail: "Supabase integration not yet configured. Wire up the query above.",
      orderId,
    });

  } catch (error) {
    console.error("Report data fetch error:", error);
    return res.status(500).json({
      error: "Failed to fetch report data",
      detail: error.message,
    });
  }
}
