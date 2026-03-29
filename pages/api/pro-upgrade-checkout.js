/**
 * POST /api/pro-upgrade-checkout
 * 
 * Body: { email: string }
 * Creates a Stripe checkout session to upgrade from Insider to Pro.
 * 
 * Deploy to: pages/api/pro-upgrade-checkout.js
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com';
const PRO_PRICE_ID = process.env.NEXT_PUBLIC_INSIDER_PRO_PRICE_ID || 'price_1TGQWlBMIWL7f1H3z3Ofyoxb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
      success_url: `${SITE_URL}/pro?upgraded=true`,
      cancel_url: `${SITE_URL}/pro?upgraded=false`,
      metadata: {
        type: 'insider_pro',
        upgrade_from: 'insider',
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Pro upgrade checkout failed:', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
