import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.FCM_PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if a scraper is already running
    const { data: running } = await supabase
      .from('agent_runs')
      .select('id')
      .eq('status', 'running')
      .in('agent_id', ['scout', 'scraper'])
      .limit(1);

    if (running && running.length > 0) {
      return NextResponse.json({ error: 'Scraper is already running', runId: running[0].id }, { status: 409 });
    }

    // Create a new agent_run entry to signal scraper trigger
    const { data: newRun, error } = await supabase
      .from('agent_runs')
      .insert({
        agent_id: 'scout',
        status: 'running',
        started_at: new Date().toISOString(),
        output_summary: { scraped: 0, filtered: 0, enriched: 0, triggered_by: 'mission_control' },
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Scraper triggered successfully',
      runId: newRun?.id,
      status: 'running',
    });
  } catch (err: any) {
    console.error('Trigger scraper error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
