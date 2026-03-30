import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  // 1. Verify the webhook signature
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // 2. Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    // ============================================================
    // UPGRADE PAYMENT (Insight → Intelligence)
    // ============================================================
    if (metadata.upgrade_from && metadata.upgrade_to && metadata.order_id) {
      console.log(`Processing upgrade for order_id ${metadata.order_id}: ${metadata.upgrade_from} → ${metadata.upgrade_to}`);

      try {
        const { data, error } = await supabase
          .from('reports')
          .update({ tier: metadata.upgrade_to })
          .eq('order_id', metadata.order_id)
          .eq('tier', metadata.upgrade_from)
          .select();

        if (error) {
          console.error('Supabase upgrade error:', error);
        } else if (data && data.length > 0) {
          console.log(`✅ Order ${metadata.order_id} upgraded to ${metadata.upgrade_to}`);

          // Log notification for Discord
          await supabase.from('notifications').insert({
            order_id: metadata.order_id,
            event: 'report_upgraded',
            message: `⬆️ **Report Upgraded**\n📋 Order ${metadata.order_id}: ${metadata.upgrade_from} → ${metadata.upgrade_to}\n💰 £300 upgrade payment received`,
          });
        } else {
          console.warn(`Order ${metadata.order_id} not found or already upgraded`);
        }
      } catch (err) {
        console.error('Failed to process upgrade:', err);
      }

      return NextResponse.json({ received: true });
    }

    // ============================================================
    // INSIDER SUBSCRIPTION
    // ============================================================
    if (metadata.tier === 'insider') {
      console.log('Insider subscription completed - handled separately');
      return NextResponse.json({ received: true });
    }

    // ============================================================
    // NEW REPORT ORDER
    // ============================================================
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    // Count today's orders for sequential numbering
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${dateStr}T00:00:00Z`);

    const orderNum = String((count || 0) + 1).padStart(3, '0');
    const orderId = `${dateStr}-${orderNum}`;

    // Get price from session
    const price = session.amount_total ? session.amount_total / 100 : 0;

    // Insert order into Supabase
    const { error: insertError } = await supabase.from('orders').insert({
      id: orderId,
      status: 'received',
      customer_email: session.customer_details?.email || metadata.customer_email || '',
      customer_name: session.customer_details?.name || '',
      customer_phone: metadata.customer_phone || '',
      business_name: metadata.business_name || 'Unknown Business',
      business_postcode: metadata.postcode || '',
      business_town: metadata.town_city || '',
      business_source: metadata.listing_source || '',
      business_url: metadata.listing_url || '',
      company_name: metadata.company_name || '',
      report_tier: metadata.tier || 'unknown',
      report_price: price,
      uploaded_files: metadata.uploaded_file_names ? metadata.uploaded_file_names.split(',') : [],
      checkboxes: {
        has_financials: metadata.has_financials === 'true',
        has_asking_price: metadata.has_asking_price === 'true',
        has_lease_terms: metadata.has_lease_terms === 'true',
        has_staff_info: metadata.has_staff_info === 'true',
        has_turnover: metadata.has_turnover === 'true',
        has_po_remuneration: metadata.has_po_remuneration === 'true',
      },
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id || '',
      timeline: {
        received: now.toISOString(),
        henry_started: null,
        henry_completed: null,
        rex_reviewed: null,
        approved: null,
        delivered: null,
      },
    });

    if (insertError) {
      console.error('Failed to insert order:', insertError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Log notification for Discord
    await supabase.from('notifications').insert({
      order_id: orderId,
      event: 'order_received',
      message: `🆕 **New Order #${orderId}**\n📋 ${metadata.tier?.charAt(0).toUpperCase()}${metadata.tier?.slice(1)} Report (£${price})\n🏢 ${metadata.business_name || 'Unknown'}\n📍 ${metadata.postcode || 'No postcode'}, ${metadata.town_city || ''}\n📧 ${session.customer_details?.email || metadata.customer_email || 'unknown'}`,
    });

    console.log(`✅ Order ${orderId} created in Supabase`);

    // Trigger pipeline
    try {
      const triggerUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://fcmreport.com'}/api/trigger-report`;
      await fetch(triggerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      console.log(`Pipeline triggered for ${orderId}`);
    } catch (triggerErr) {
      console.error('Failed to trigger pipeline:', triggerErr);
    }
  }

  // 5. Handle subscription events
  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object as Stripe.Subscription;
    console.log('New Insider subscription:', subscription.id);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    console.log('Insider subscription cancelled:', subscription.id);
  }

  return NextResponse.json({ received: true });
}
