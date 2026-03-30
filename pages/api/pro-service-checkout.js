import Stripe from 'stripe';
import { verifyProSession } from '../../lib/pro-session';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = verifyProSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { priceId } = req.body;

  const allowedPrices = [
    'price_1TGQWtBMIWL7f1H3EVzbcC1j', // Strategy Call £100
    'price_1TGQX2BMIWL7f1H3MtA0YbLC', // Offer Guidance £100
    'price_1TGQXABMIWL7f1H35Ai4Xni2', // Lease Breakdown £150
  ];

  if (!allowedPrices.includes(priceId)) {
    return res.status(400).json({ error: 'Invalid price' });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: session.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com'}/pro?service=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com'}/pro?service=cancelled`,
      metadata: {
        subscriber_email: session.email,
        service_type: 'pro_addon',
      },
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
