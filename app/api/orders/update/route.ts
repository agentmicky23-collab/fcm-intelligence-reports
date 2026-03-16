import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/orders/update — local agent updates order status
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.AGENT_API_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, status, timeline_field, qa_result, qa_notes, qa_issues } = body;

  if (!id || !status) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 });
  }

  // Build update object
  const update: Record<string, any> = { status };

  // Update timeline field if provided
  if (timeline_field) {
    // First get current timeline
    const { data: current } = await supabase
      .from('orders')
      .select('timeline')
      .eq('id', id)
      .single();

    if (current) {
      const timeline = current.timeline || {};
      timeline[timeline_field] = new Date().toISOString();
      update.timeline = timeline;
    }
  }

  // QA fields
  if (qa_result) update.qa_result = qa_result;
  if (qa_notes) update.qa_notes = qa_notes;
  if (qa_issues) update.qa_issues = qa_issues;

  const { error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
