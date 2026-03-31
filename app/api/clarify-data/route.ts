import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyClarificationToken } from '@/lib/clarification-jwt';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');
    const token = url.searchParams.get('token');

    if (!orderId || !token) {
      return NextResponse.json({ error: 'Missing orderId or token' }, { status: 400 });
    }

    // Verify JWT
    let payload;
    try {
      payload = verifyClarificationToken(token);
    } catch (err: any) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'This link has expired. Please contact us at reports@fcmreport.com for assistance.'
          : 'Invalid or expired link';
      return NextResponse.json({ error: message }, { status: 401 });
    }

    if (payload.orderId !== orderId) {
      return NextResponse.json({ error: 'Token mismatch' }, { status: 403 });
    }

    // Fetch order
    const { data: order, error } = await supabase
      .from('orders')
      .select(
        'business_name, clarification_questions, clarification_responses, clarification_responded_at'
      )
      .eq('order_id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Clarify-data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
