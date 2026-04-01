import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.FCM_PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error, count } = await supabase
      .from('insider_picks')
      .delete()
      .eq('status', 'stale')
      .select('id', { count: 'exact' });

    if (error) throw error;

    return NextResponse.json({
      message: 'Stale listings cleared',
      deleted: data?.length || 0,
    });
  } catch (err: any) {
    console.error('Clear stale error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
