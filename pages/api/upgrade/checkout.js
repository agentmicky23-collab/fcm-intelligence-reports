// ============================================================
// FCM INTELLIGENCE — UPGRADE CHECKOUT API
// File: pages/api/upgrade/checkout.js
// Purpose: Creates Stripe Checkout session for Insight → Intelligence upgrade
// Reads from 'reports' table by order_id
// ============================================================

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Missing orderId" });
  }

  try {
    // 1. Verify the report exists and is currently Insight tier
    const { data: report, error: dbError } = await supabase
      .from("reports")
      .select("order_id, customer_email, tier, status")
      .eq("order_id", orderId)
      .single();

    if (dbError || !report) {
      return res.status(404).json({ error: "Report not found" });
    }

    if (report.tier === "intelligence") {
      return res.status(400).json({ error: "Report is already Intelligence tier" });
    }

    if (report.status !== "approved" && report.status !== "delivered") {
      return res.status(400).json({ error: "Report is not ready for upgrade" });
    }

    // 2. Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: report.customer_email,
      line_items: [
        {
          price: process.env.STRIPE_UPGRADE_PRICE_ID, // £300 upgrade price
          quantity: 1,
        },
      ],
      metadata: {
        order_id: String(orderId),
        upgrade_from: "insight",
        upgrade_to: "intelligence",
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/report/${orderId}?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/report/${orderId}`,
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("Upgrade checkout error:", err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
