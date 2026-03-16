import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

const ORDERS_PATH = '/Users/mickagent/.openclaw/reports/orders';

// Generate order ID: YYYY-MM-DD-XXX
function generateOrderId(): string {
  const date = new Date().toISOString().split('T')[0];
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${date}-${random}`;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extract metadata from Stripe session
    const metadata = session.metadata || {};
    
    const orderId = generateOrderId();
    const orderPath = join(ORDERS_PATH, orderId);
    
    // Create order directory
    await mkdir(orderPath, { recursive: true });
    await mkdir(join(orderPath, 'files'), { recursive: true });
    await mkdir(join(orderPath, 'research'), { recursive: true });
    
    // Build order object
    const order = {
      id: orderId,
      stripeSessionId: session.id,
      stripePaymentIntent: session.payment_intent,
      status: 'received',
      created: new Date().toISOString(),
      customer: {
        email: session.customer_email || metadata.customer_email || '',
        phone: metadata.customer_phone || '',
        stripeCustomerId: session.customer,
      },
      business: {
        name: metadata.business_name || metadata.listing_name || '',
        postcode: metadata.postcode || '',
        town: metadata.town_city || '',
        company: metadata.company_name || '',
        source: metadata.listing_source || '',
        url: metadata.listing_url || '',
      },
      report: {
        tier: metadata.tier || 'professional',
        price: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency || 'gbp',
      },
      checkboxes: {
        has_financials: metadata.has_financials === 'true',
        has_asking_price: metadata.has_asking_price === 'true',
        has_lease_terms: metadata.has_lease_terms === 'true',
        has_staff_info: metadata.has_staff_info === 'true',
        has_turnover: metadata.has_turnover === 'true',
        has_po_remuneration: metadata.has_po_remuneration === 'true',
      },
      files: [], // Will be populated when files are uploaded
      timeline: {
        received: new Date().toISOString(),
        henry_started: null,
        henry_completed: null,
        rex_reviewed: null,
        approved: null,
        delivered: null,
      },
      notes: [],
    };
    
    // Save order.json
    await writeFile(
      join(orderPath, 'order.json'),
      JSON.stringify(order, null, 2)
    );
    
    console.log(`Order created: ${orderId}`);
    
    // Send to notification endpoint
    try {
      await fetch(`${process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/notify-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, order }),
      });
    } catch (e) {
      console.error('Failed to send notification:', e);
    }
  }

  return NextResponse.json({ received: true });
}
