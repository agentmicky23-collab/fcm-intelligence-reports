import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/orders/pending — returns orders with status "received"
// Your local agent polls this endpoint
export async function GET(req: NextRequest) {
  // Simple auth check — use a shared secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.AGENT_API_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'received')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: orders || [] });
}
