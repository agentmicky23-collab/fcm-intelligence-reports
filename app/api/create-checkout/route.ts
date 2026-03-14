import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

const PRICE_MAP: Record<string, { priceId: string; name: string; amount: number; isSubscription?: boolean }> = {
  location: {
    priceId: process.env.STRIPE_PRICE_LOCATION || "",
    name: "Location Intelligence Report",
    amount: 9900,
  },
  basic: {
    priceId: process.env.STRIPE_PRICE_BASIC || "",
    name: "Basic Due Diligence Report",
    amount: 14900,
  },
  professional: {
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL || "",
    name: "Professional Report",
    amount: 24900,
  },
  premium: {
    priceId: process.env.STRIPE_PRICE_PREMIUM || "",
    name: "Premium Intelligence Report",
    amount: 44900,
  },
  insider: {
    priceId: process.env.STRIPE_PRICE_INSIDER || "",
    name: "FCM Insider Subscription",
    amount: 9700, // £97/month
    isSubscription: true,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, listingName } = body;

    const product = PRICE_MAP[tier];
    if (!product) {
      return NextResponse.json({ error: "Invalid report tier" }, { status: 400 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please contact us directly." },
        { status: 503 }
      );
    }

    // Determine base URL for redirects
    const origin = request.headers.get("origin") || "https://fcmreport.com";

    // Build line item — use price ID if available, otherwise create ad-hoc
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = product.priceId
      ? { price: product.priceId, quantity: 1 }
      : {
          price_data: {
            currency: "gbp",
            product_data: {
              name: product.name,
              description: listingName
                ? `Report for: ${listingName}`
                : "FCM Intelligence Report",
            },
            unit_amount: product.amount,
          },
          quantity: 1,
        };

    // Determine if this is a subscription or one-time payment
    const mode = product.isSubscription ? "subscription" : "payment";
    
    // Build session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [lineItem],
      mode,
      success_url: `${origin}/reports/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: product.isSubscription ? `${origin}/#insider` : `${origin}/reports`,
      metadata: {
        tier,
        listing_name: listingName || "",
      },
    };

    // Add custom fields only for one-time reports (not subscriptions)
    if (!product.isSubscription) {
      sessionParams.custom_fields = [
        {
          key: "listing_name",
          label: { type: "custom", custom: "Branch / Listing Name" },
          type: "text",
          optional: false,
        },
        {
          key: "phone",
          label: { type: "custom", custom: "Phone Number (optional)" },
          type: "text",
          optional: true,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
