export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { subscribed: false, reason: "not_authenticated" },
        { status: 401 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { subscribed: false, reason: "stripe_not_configured" },
        { status: 503 }
      );
    }

    // Find Stripe customers by email
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ subscribed: false, reason: "no_customer" });
    }

    const customer = customers.data[0];

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 10,
    });

    // Also check trialing subscriptions
    const trialingSubscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "trialing",
      limit: 10,
    });

    const allActive = [
      ...subscriptions.data,
      ...trialingSubscriptions.data,
    ];

    if (allActive.length > 0) {
      const sub = allActive[0];
      return NextResponse.json({
        subscribed: true,
        subscription: {
          id: sub.id,
          status: sub.status,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      });
    }

    return NextResponse.json({ subscribed: false, reason: "no_active_subscription" });
  } catch (err) {
    console.error("Subscription check error:", err);
    return NextResponse.json(
      { subscribed: false, reason: "error" },
      { status: 500 }
    );
  }
}
