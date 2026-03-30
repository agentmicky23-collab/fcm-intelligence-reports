// pages/api/insider-checkout.js
// Creates a Stripe Checkout Session for Insider subscriptions
// Passes ALL subscriber preferences as metadata so the webhook can populate them

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe price IDs
const PRICE_IDS = {
  standard: 'price_1TAfx4BMIWL7f1H3i5j1Sj7Z', // £15/mo
  pro: 'price_1TGQWlBMIWL7f1H3z3Ofyoxb',       // £50/mo
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    tier,
    name,
    email,
    phone,
    preferred_regions,
    min_budget,
    max_budget,
    business_types,
    experience_level,
    timeline,
  } = req.body;

  if (!tier || !name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const priceId = PRICE_IDS[tier];
  if (!priceId) {
    return res.status(400).json({ error: 'Invalid tier selected' });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com';

  try {
    // Check if customer already exists in Stripe
    const customers = await stripe.customers.list({ email, limit: 1 });
    const existingCustomer = customers.data[0];

    const sessionParams = {
      mode: 'subscription',
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/insider/welcome?tier=${tier}`,
      cancel_url: `${origin}/insider`,
      metadata: {
        source: 'insider_page',
        tier,
        subscriber_name: name,
        subscriber_email: email,
        subscriber_phone: phone || '',
        preferred_regions: JSON.stringify(preferred_regions || []),
        min_budget: String(min_budget || 0),
        max_budget: String(max_budget || 0),
        business_types: JSON.stringify(business_types || []),
        experience_level: experience_level || '',
        timeline: timeline || '',
      },
      subscription_data: {
        metadata: {
          tier,
          subscriber_email: email,
        },
      },
    };

    // Attach to existing customer or set customer_email for new
    if (existingCustomer) {
      sessionParams.customer = existingCustomer.id;
    } else {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Insider checkout error:', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
