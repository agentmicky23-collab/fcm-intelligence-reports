// ============================================================
// FCM INTELLIGENCE — REPORT VIEW API
// File: pages/api/report/view.js
//
// POST /api/report/view
// Body: { orderId, email }      → customer access (email must match purchase)
//       { orderId, adminKey }   → pipeline review access (FCM_PIPELINE_SECRET)
//
// Server-side replacement for the old browser-side Supabase query on
// /report/[orderId]. The `reports` table is only readable with the
// service role key, which never leaves the server.
// ============================================================

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// This value was previously shipped in the public JS bundle, so it can
// never be accepted as an admin key even if it is still configured.
const LEAKED_DEFAULT_SECRET = "fcm-pipeline-2026-secure-key";

let supabase = null;
function getSupabase() {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabase;
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function isValidAdminKey(adminKey) {
  const secret = process.env.FCM_PIPELINE_SECRET;
  if (!adminKey || !secret || secret === LEAKED_DEFAULT_SECRET) return false;
  return safeEqual(adminKey, secret);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, email, adminKey } = req.body || {};

  if (typeof orderId !== "string" || !orderId || orderId.length > 64) {
    return res.status(400).json({ error: "Invalid order reference." });
  }

  const isAdmin = adminKey ? isValidAdminKey(adminKey) : false;
  if (adminKey && !isAdmin) {
    return res.status(401).json({ error: "Invalid admin key." });
  }
  if (!isAdmin && (typeof email !== "string" || !email.trim() || email.length > 320)) {
    return res.status(400).json({ error: "Please enter the email address you purchased with." });
  }

  try {
    const { data, error } = await getSupabase()
      .from("reports")
      .select("report_json, customer_email, tier, status")
      .eq("order_id", orderId)
      .maybeSingle();

    if (error) {
      console.error("[report/view] Supabase error:", error.message);
      return res.status(500).json({ error: "Something went wrong. Please try again." });
    }

    // Same response for "no such report" and "wrong email" so the endpoint
    // can't be used to discover which order IDs exist.
    const notFound = { error: "We couldn't find a report for that order and email. Please check your link and the email you purchased with." };

    if (!data) {
      return res.status(isAdmin ? 404 : 403).json(notFound);
    }

    if (!isAdmin) {
      const expected = (data.customer_email || "").toLowerCase().trim();
      const given = email.toLowerCase().trim();
      if (!expected || !safeEqual(expected, given)) {
        return res.status(403).json(notFound);
      }
    }

    if (data.status === "generating" || data.status === "validating") {
      return res.status(202).json({
        status: data.status,
        error: "Your report is still being prepared. We'll email you when it's ready.",
      });
    }

    let reportJson = data.report_json;
    if (typeof reportJson === "string") {
      try {
        reportJson = JSON.parse(reportJson);
      } catch {
        return res.status(500).json({ error: "Report data is malformed." });
      }
    }

    if (!reportJson) {
      return res.status(202).json({ error: "Report data is empty — report may still be generating." });
    }

    return res.status(200).json({ report_json: reportJson, tier: data.tier, status: data.status });
  } catch (err) {
    console.error("[report/view] Unexpected error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
