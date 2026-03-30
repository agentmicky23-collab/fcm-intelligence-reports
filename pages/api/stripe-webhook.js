// pages/api/stripe-webhook.js
// UPDATED: Added insider_pro subscription handling
// This file REPLACES the existing stripe-webhook.js

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Price IDs
const INSIDER_PRICE_ID = process.env.NEXT_PUBLIC_INSIDER_PRICE_ID;
const INSIDER_PRO_PRICE_ID = process.env.NEXT_PUBLIC_INSIDER_PRO_PRICE_ID || 'price_1TGQWlBMIWL7f1H3z3Ofyoxb';
const INSIGHT_PRICE_ID = process.env.NEXT_PUBLIC_INSIGHT_PRICE_ID || 'price_1TCoi3BMIWL7f1H3byX2RVBB';
const INTELLIGENCE_PRICE_ID = process.env.NEXT_PUBLIC_INTELLIGENCE_PRICE_ID || 'price_1TCoirBMIWL7f1H3GkpEJ2mb';
const UPGRADE_PRICE_ID = process.env.NEXT_PUBLIC_UPGRADE_PRICE_ID || 'price_1TCqGgBMIWL7f1H3JAsoxYTt';
const STRATEGY_CALL_PRICE_ID = process.env.NEXT_PUBLIC_STRATEGY_CALL_PRICE_ID || 'price_1TGQWtBMIWL7f1H3EVzbcC1j';
const OFFER_GUIDANCE_PRICE_ID = process.env.NEXT_PUBLIC_OFFER_GUIDANCE_PRICE_ID || 'price_1TGQX2BMIWL7f1H3MtA0YbLC';
const LEASE_BREAKDOWN_PRICE_ID = process.env.NEXT_PUBLIC_LEASE_BREAKDOWN_PRICE_ID || 'price_1TGQXABMIWL7f1H35Ai4Xni2';

export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Determine product type from price ID
function getProductType(priceId) {
  switch (priceId) {
    case INSIDER_PRICE_ID:
      return 'insider';
    case INSIDER_PRO_PRICE_ID:
      return 'insider_pro';
    case INSIGHT_PRICE_ID:
      return 'insight_report';
    case INTELLIGENCE_PRICE_ID:
      return 'intelligence_report';
    case UPGRADE_PRICE_ID:
      return 'upgrade';
    case STRATEGY_CALL_PRICE_ID:
      return 'strategy_call';
    case OFFER_GUIDANCE_PRICE_ID:
      return 'offer_guidance';
    case LEASE_BREAKDOWN_PRICE_ID:
      return 'lease_breakdown';
    default:
      return 'unknown';
  }
}

// ──── HANDLER: checkout.session.completed ────
async function handleCheckoutCompleted(session) {
  const email = session.customer_email || session.customer_details?.email;
  if (!email) {
    console.error('No email found in checkout session');
    return;
  }

  // Get line items to determine what was purchased
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const priceId = lineItems.data[0]?.price?.id;
  const productType = getProductType(priceId);

  console.log(`Checkout completed: ${productType} for ${email}`);

  switch (productType) {
    case 'insider':
      // Handled by customer.subscription.created
      break;

    case 'insider_pro':
      // Could be new Pro signup or upgrade from Insider
      // Check if they have an existing Insider record
      const { data: existingSub } = await supabase
        .from('insider_subscribers')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (existingSub) {
        // Upgrade existing Insider to Pro
        await supabase
          .from('insider_subscribers')
          .update({
            tier: 'pro',
            pro_upgraded_at: new Date().toISOString(),
            pro_stripe_price_id: priceId,
            stripe_subscription_id: session.subscription,
            status: 'active',
          })
          .eq('email', email.toLowerCase());

        console.log(`Upgraded ${email} from Insider to Pro`);
      } else {
        // New Pro subscriber (direct signup)
        await supabase
          .from('insider_subscribers')
          .insert({
            email: email.toLowerCase(),
            name: session.customer_details?.name || '',
            status: 'active',
            tier: 'pro',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            pro_upgraded_at: new Date().toISOString(),
            pro_stripe_price_id: priceId,
          });

        console.log(`New Pro subscriber: ${email}`);
      }

      // Send Pro welcome email
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email-insider-welcome`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: session.customer_details?.name || '',
            tier: 'pro',
          }),
        });
      } catch (emailErr) {
        console.error('Failed to send Pro welcome email:', emailErr);
        // Don't throw — failed email must not break webhook (Rule #7)
      }
      break;

    case 'insight_report':
    case 'intelligence_report': {
      const name = session.customer_details?.name || '';
      const metadata = session.metadata || {};

      await supabase.from('orders').insert({
        order_id: metadata.order_id || `${new Date().toISOString().split('T')[0]}-ORDER`,
        email: email.toLowerCase(),
        name,
        tier: productType === 'insight_report' ? 'insight' : 'intelligence',
        status: 'paid',
        stripe_session_id: session.id,
        stripe_customer_id: session.customer,
        amount_paid: session.amount_total,
        business_name: metadata.business_name || '',
        location: metadata.location || '',
      });

      // Send order confirmed email
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email-order-confirmed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name,
            tier: productType === 'insight_report' ? 'insight' : 'intelligence',
            orderId: metadata.order_id,
          }),
        });
      } catch (emailErr) {
        console.error('Failed to send order email:', emailErr);
      }
      break;
    }

    case 'upgrade': {
      const metadata = session.metadata || {};
      // Update existing order tier
      if (metadata.order_id) {
        await supabase
          .from('orders')
          .update({ tier: 'intelligence', status: 'paid' })
          .eq('order_id', metadata.order_id);
      }

      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email-upgrade-confirmed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: session.customer_details?.name || '',
            orderId: metadata.order_id,
          }),
        });
      } catch (emailErr) {
        console.error('Failed to send upgrade email:', emailErr);
      }
      break;
    }

    case 'strategy_call':
    case 'offer_guidance':
    case 'lease_breakdown': {
      // Record add-on service purchase
      await supabase.from('insider_service_purchases').insert({
        email: email.toLowerCase(),
        service_type: productType,
        stripe_session_id: session.id,
        stripe_customer_id: session.customer,
        amount_paid: session.amount_total,
        status: productType === 'strategy_call' ? 'pending_booking' : 'processing',
        metadata: session.metadata || {},
      });

      console.log(`Service purchase recorded: ${productType} for ${email}`);
      // TODO: Send service-specific confirmation email
      break;
    }

    default:
      console.log(`Unknown product type for price ${priceId}`);
  }
}

// ──── HANDLER: customer.subscription.created ────
async function handleSubscriptionCreated(subscription) {
  const priceId = subscription.items?.data[0]?.price?.id;
  const productType = getProductType(priceId);
  const customerId = subscription.customer;

  // Get customer email from Stripe
  const customer = await stripe.customers.retrieve(customerId);
  const email = customer.email;
  if (!email) return;

  console.log(`Subscription created: ${productType} for ${email}`);

  if (productType === 'insider') {
    // Check if subscriber already exists (might have been created by checkout handler)
    const { data: existing } = await supabase
      .from('insider_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (!existing) {
      await supabase.from('insider_subscribers').insert({
        email: email.toLowerCase(),
        name: customer.name || '',
        status: 'active',
        tier: 'insider',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
      });
    } else {
      await supabase
        .from('insider_subscribers')
        .update({
          status: 'active',
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customerId,
        })
        .eq('email', email.toLowerCase());
    }

    // Send Insider welcome email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email-insider-welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: customer.name || '', tier: 'insider' }),
      });
    } catch (emailErr) {
      console.error('Failed to send Insider welcome email:', emailErr);
    }
  } else if (productType === 'insider_pro') {
    // Pro subscription — handled in checkout.session.completed
    // But update subscription ID if not set
    await supabase
      .from('insider_subscribers')
      .update({
        status: 'active',
        tier: 'pro',
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
      })
      .eq('email', email.toLowerCase());
  }
}

// ──── HANDLER: invoice.payment_succeeded ────
async function handlePaymentSucceeded(invoice) {
  // Skip first invoice (handled by subscription.created)
  if (invoice.billing_reason === 'subscription_create') return;

  const email = invoice.customer_email;
  if (!email) return;

  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  // Get subscription to check type
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items?.data[0]?.price?.id;
  const productType = getProductType(priceId);

  console.log(`Renewal payment: ${productType} for ${email}`);

  // Update status to active (in case it was past_due)
  await supabase
    .from('insider_subscribers')
    .update({ status: 'active' })
    .eq('email', email.toLowerCase());

  // Send renewal email
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email-insider-renewal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        tier: productType === 'insider_pro' ? 'pro' : 'insider',
      }),
    });
  } catch (emailErr) {
    console.error('Failed to send renewal email:', emailErr);
  }
}

// ──── HANDLER: customer.subscription.deleted ────
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  const customer = await stripe.customers.retrieve(customerId);
  const email = customer.email;
  if (!email) return;

  const priceId = subscription.items?.data[0]?.price?.id;
  const productType = getProductType(priceId);

  console.log(`Subscription cancelled: ${productType} for ${email}`);

  if (productType === 'insider_pro') {
    // Downgrade from Pro to Insider (keep their account, remove Pro access)
    await supabase
      .from('insider_subscribers')
      .update({
        tier: 'insider',
        status: 'cancelled',
        pro_stripe_price_id: null,
      })
      .eq('email', email.toLowerCase());
  } else {
    // Full cancellation
    await supabase
      .from('insider_subscribers')
      .update({ status: 'cancelled' })
      .eq('email', email.toLowerCase());
  }

  // Send cancellation email
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email-insider-cancelled`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        tier: productType === 'insider_pro' ? 'pro' : 'insider',
      }),
    });
  } catch (emailErr) {
    console.error('Failed to send cancellation email:', emailErr);
  }
}

// ──── MAIN WEBHOOK HANDLER ────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log(`Webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    // Return 200 to prevent Stripe from retrying
    return res.status(200).json({ received: true, error: err.message });
  }

  return res.status(200).json({ received: true });
}
