import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyClarificationToken } from '@/lib/clarification-jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, token, answers } = body;

    if (!orderId || !token || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, token, answers' },
        { status: 400 }
      );
    }

    // Verify JWT
    let payload;
    try {
      payload = verifyClarificationToken(token);
    } catch (err: any) {
      const message = err.name === 'TokenExpiredError'
        ? 'This link has expired. Please contact us at reports@fcmreport.com for assistance.'
        : 'Invalid token';
      return NextResponse.json({ error: message }, { status: 401 });
    }

    // Ensure token orderId matches request orderId
    if (payload.orderId !== orderId) {
      return NextResponse.json({ error: 'Token mismatch' }, { status: 403 });
    }

    // Validate answers array
    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: 'answers must be an array' }, { status: 400 });
    }

    // Save to Supabase
    const { error } = await supabase
      .from('orders')
      .update({
        clarification_responses: answers,
        clarification_responded_at: new Date().toISOString(),
      })
      .eq('order_id', orderId);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to save responses' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Clarification POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
