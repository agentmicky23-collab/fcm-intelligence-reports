import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be signed in to subscribe" },
        { status: 401 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const priceId = process.env.STRIPE_PRICE_INSIDER;
    if (!priceId) {
      return NextResponse.json(
        { error: "Subscription price not configured" },
        { status: 503 }
      );
    }

    const origin = request.headers.get("origin") || "https://fcmreport.com";

    // Find or reference customer by email
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    const customerParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/opportunities?subscribed=true`,
      cancel_url: `${origin}/opportunities`,
      customer_email: customers.data.length === 0 ? session.user.email : undefined,
      customer: customers.data.length > 0 ? customers.data[0].id : undefined,
      metadata: {
        source: "opportunities_paywall",
        user_email: session.user.email,
      },
    };

    const checkoutSession = await stripe.checkout.sessions.create(customerParams);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Insider checkout error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
