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
    name: "Location Report",
    amount: 9900,
  },
  basic: {
    priceId: process.env.STRIPE_PRICE_BASIC || "",
    name: "Basic Report",
    amount: 14900,
  },
  professional: {
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL || "",
    name: "Professional Report",
    amount: 24900,
  },
  premium: {
    priceId: process.env.STRIPE_PRICE_PREMIUM || "",
    name: "Premium Report",
    amount: 44900,
  },
  insider: {
    priceId: process.env.STRIPE_PRICE_INSIDER || "",
    name: "FCM Insider Subscription",
    amount: 1500, // £15/month
    isSubscription: true,
  },
};

interface CheckoutRequest {
  tier: string;
  // Step 1: Business details
  listing_url?: string;
  business_name?: string;
  postcode?: string;
  town_city?: string;
  company_name?: string;
  listing_source?: string;
  listing_id?: string;
  // Step 3: Customer details
  customer_email?: string;
  customer_phone?: string;
  // Step 4: Information checkboxes (Pro & Premium only)
  has_financials?: boolean;
  has_asking_price?: boolean;
  has_lease_terms?: boolean;
  has_staff_info?: boolean;
  has_turnover?: boolean;
  has_po_remuneration?: boolean;
  // File upload tracking
  has_uploaded_files?: boolean;
  uploaded_file_names?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const {
      tier,
      listing_url,
      business_name,
      postcode,
      town_city,
      company_name,
      listing_source,
      listing_id,
      customer_email,
      customer_phone,
      has_financials,
      has_asking_price,
      has_lease_terms,
      has_staff_info,
      has_turnover,
      has_po_remuneration,
      has_uploaded_files,
      uploaded_file_names,
    } = body;

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
              description: business_name
                ? `Report for: ${business_name}`
                : "FCM Intelligence Report",
            },
            unit_amount: product.amount,
          },
          quantity: 1,
        };

    // Determine if this is a subscription or one-time payment
    const mode = product.isSubscription ? "subscription" : "payment";

    // Build metadata - Stripe limits values to 500 chars each
    // Pass ALL collected data to Stripe for the fulfillment team
    const metadata: Record<string, string> = {
      tier,
      listing_url: (listing_url || "").slice(0, 500),
      business_name: (business_name || "").slice(0, 500),
      postcode: (postcode || "").slice(0, 500),
      town_city: (town_city || "").slice(0, 500),
      company_name: (company_name || "").slice(0, 500),
      listing_source: (listing_source || "").slice(0, 500),
      listing_id: (listing_id || "").slice(0, 500),
      customer_email: (customer_email || "").slice(0, 500),
      customer_phone: (customer_phone || "").slice(0, 500),
      // Checkbox values as strings
      has_financials: String(has_financials || false),
      has_asking_price: String(has_asking_price || false),
      has_lease_terms: String(has_lease_terms || false),
      has_staff_info: String(has_staff_info || false),
      has_turnover: String(has_turnover || false),
      has_po_remuneration: String(has_po_remuneration || false),
      // File upload tracking
      has_uploaded_files: String(has_uploaded_files || false),
      uploaded_file_names: (uploaded_file_names || "").slice(0, 500),
    };

    // Build success URL with metadata for personalized confirmation
    const successParams = new URLSearchParams({
      session_id: "{CHECKOUT_SESSION_ID}",
      tier,
      listing: business_name || "",
      email: customer_email || "",
      phone: customer_phone || "",
    });

    // Build session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [lineItem],
      mode,
      success_url: `${origin}/reports/success?${successParams.toString()}`,
      cancel_url: product.isSubscription ? `${origin}/#insider` : `${origin}/reports`,
      metadata,
      // Pre-fill customer email if provided
      ...(customer_email && { customer_email: customer_email }),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
