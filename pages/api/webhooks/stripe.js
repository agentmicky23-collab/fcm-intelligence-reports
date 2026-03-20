// ============================================================
// FCM INTELLIGENCE — STRIPE WEBHOOK HANDLER
// File: pages/api/webhooks/stripe.js
// Purpose: Processes Stripe webhooks for upgrade payments
// Updates tier in 'reports' table by order_id
// ============================================================

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Disable Next.js body parsing — Stripe needs raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"];
  const rawBody = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const metadata = session.metadata || {};

      // Check if this is an upgrade payment
      if (metadata.upgrade_from && metadata.upgrade_to && metadata.order_id) {
        console.log(`Processing upgrade for order_id ${metadata.order_id}: ${metadata.upgrade_from} → ${metadata.upgrade_to}`);

        try {
          const { data, error } = await supabase
            .from("reports")
            .update({
              tier: metadata.upgrade_to,
              // updated_at is handled by the database trigger
            })
            .eq("order_id", parseInt(metadata.order_id))
            .eq("tier", metadata.upgrade_from) // safety: only upgrade if still on old tier
            .select();

          if (error) {
            console.error("Supabase update error:", error);
          } else if (data && data.length > 0) {
            console.log(`Order ${metadata.order_id} upgraded to ${metadata.upgrade_to}`);
          } else {
            console.warn(`Order ${metadata.order_id} not found or already upgraded`);
          }
        } catch (err) {
          console.error("Failed to process upgrade:", err);
        }
      }

      break;
    }

    case "checkout.session.expired": {
      console.log(`Checkout session expired: ${event.data.object.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
