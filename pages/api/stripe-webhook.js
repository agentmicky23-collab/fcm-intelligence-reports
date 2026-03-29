// pages/api/stripe-webhook.js
// Handles Stripe checkout.session.completed events
// Creates orders in Supabase and triggers report pipeline

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Webhook signing secret from Stripe dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    case 'payment_intent.succeeded':
      // Handle upgrade payments (Insight → Intelligence)
      await handleUpgrade(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}

async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);

  // Extract metadata from checkout session
  const {
    customer_email,
    metadata: {
      tier, // 'insight' or 'intelligence'
      business_name,
      business_address,
      listing_url,
      listing_source,
    },
  } = session;

  // Generate order ID (format: 2026-03-29-001)
  const today = new Date().toISOString().split('T')[0];
  const { data: existingOrders } = await supabase
    .from('orders')
    .select('id')
    .like('id', `${today}-%`)
    .order('id', { ascending: false })
    .limit(1);

  let orderNumber = 1;
  if (existingOrders && existingOrders.length > 0) {
    const lastOrder = existingOrders[0].id;
    const lastNumber = parseInt(lastOrder.split('-')[3]);
    orderNumber = lastNumber + 1;
  }

  const orderId = `${today}-${String(orderNumber).padStart(3, '0')}`;

  // Insert order into Supabase
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      customer_email,
      customer_name: session.customer_details?.name || 'Unknown',
      tier,
      business_name,
      business_address,
      listing_url,
      listing_source,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent,
      amount_paid: session.amount_total / 100, // Convert from cents to pounds
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (orderError) {
    console.error('Failed to create order:', orderError);
    // Send Discord alert to Mik
    await sendDiscordAlert(
      `❌ Order creation failed for ${customer_email}\nStripe session: ${session.id}\nError: ${orderError.message}`
    );
    return;
  }

  console.log('Order created:', orderId);

  // Create order.json file for pipeline
  const orderJson = {
    order_ref: orderId,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    tier: order.tier,
    order_date: today,
    listing_url: order.listing_url,
    business_name: order.business_name,
    business_address: order.business_address,
    listing_source: order.listing_source,
  };

  // TODO: Write order.json to ~/.openclaw/reports/orders/{orderId}/order.json
  // This requires calling the OpenClaw orchestrator API or triggering via webhook
  // For now, log to console and send Discord alert

  await sendDiscordAlert(
    `🎯 NEW ORDER: ${orderId}\n` +
      `Customer: ${customer_email}\n` +
      `Tier: ${tier.toUpperCase()}\n` +
      `Business: ${business_name}\n` +
      `Ready for pipeline trigger.`
  );

  // TODO: Trigger FCM pipeline (Scout → Sage → Sentinel → Supabase → Oracle → Deliver)
  // Options:
  // 1. Call OpenClaw Gateway API (if exposed)
  // 2. Write to a queue that the main agent polls
  // 3. Send webhook to a separate pipeline trigger endpoint
}

async function handleUpgrade(paymentIntent) {
  // Handle Insight → Intelligence upgrade (£300 payment)
  const { metadata } = paymentIntent;

  if (!metadata.order_id || metadata.type !== 'upgrade') {
    return; // Not an upgrade payment
  }

  const orderId = metadata.order_id;

  console.log(`Upgrade payment received for order: ${orderId}`);

  // Update order tier
  const { error: orderError } = await supabase
    .from('orders')
    .update({
      tier: 'intelligence',
      upgraded_at: new Date().toISOString(),
      upgrade_payment_intent: paymentIntent.id,
    })
    .eq('id', orderId);

  if (orderError) {
    console.error('Failed to upgrade order:', orderError);
    await sendDiscordAlert(
      `❌ Upgrade failed for order ${orderId}\nPayment Intent: ${paymentIntent.id}\nError: ${orderError.message}`
    );
    return;
  }

  // Update report tier
  const { error: reportError } = await supabase
    .from('reports')
    .update({ tier: 'intelligence' })
    .eq('order_id', orderId);

  if (reportError) {
    console.error('Failed to upgrade report:', reportError);
    await sendDiscordAlert(
      `❌ Report upgrade failed for order ${orderId}\nError: ${reportError.message}`
    );
    return;
  }

  // Send upgrade confirmation email
  await sendUpgradeEmail(orderId);

  // Discord notification
  await sendDiscordAlert(
    `⬆️ UPGRADE: ${orderId} → Intelligence\n` +
      `Payment: ${paymentIntent.id}\n` +
      `All 15 sections now unlocked.`
  );
}

async function sendDiscordAlert(message) {
  // TODO: Implement Discord webhook or use OpenClaw message tool
  // For now, just log
  console.log('Discord alert:', message);
}

async function sendUpgradeEmail(orderId) {
  // TODO: Implement via pages/api/send-report.js (Resend API)
  console.log('Upgrade email triggered for:', orderId);
}
