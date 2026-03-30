import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

/* Allowed Insider price IDs — Standard and Pro tiers */
const ALLOWED_PRICES = new Set([
  process.env.STRIPE_PRICE_INSIDER,           // Standard (env default)
  "price_1TAfx4BMIWL7f1H3i5j1Sj7Z",          // Standard £15/mo
  "price_1TGQWlBMIWL7f1H3z3Ofyoxb",          // Pro £50/mo
]);

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

    /* Accept priceId from request body, fallback to env default */
    const body = await request.json().catch(() => ({}));
    const priceId = body.priceId || process.env.STRIPE_PRICE_INSIDER;

    if (!priceId) {
      return NextResponse.json(
        { error: "Subscription price not configured" },
        { status: 503 }
      );
    }

    /* Only allow known Insider price IDs */
    if (!ALLOWED_PRICES.has(priceId)) {
      return NextResponse.json(
        { error: "Invalid price selected" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "https://fcmreport.com";

    // Find or reference customer by email
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    const isPro = priceId === "price_1TGQWlBMIWL7f1H3z3Ofyoxb";

    const customerParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${origin}/insider/welcome?tier=${isPro ? "pro" : "standard"}`,
      cancel_url: `${origin}/insider`,
      customer_email: customers.data.length === 0 ? session.user.email : undefined,
      customer: customers.data.length > 0 ? customers.data[0].id : undefined,
      metadata: {
        source: "insider_signup",
        tier: isPro ? "pro" : "standard",
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
