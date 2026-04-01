import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.FCM_PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check agent_runs for scraper runs (scout agent handles scraping)
    // Also check for a dedicated 'scraper' agent_id if it exists
    const { data: runningRuns } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('status', 'running')
      .in('agent_id', ['scout', 'scraper'])
      .order('started_at', { ascending: false })
      .limit(1);

    const { data: lastCompleted } = await supabase
      .from('agent_runs')
      .select('*')
      .in('status', ['success', 'failed'])
      .in('agent_id', ['scout', 'scraper'])
      .order('completed_at', { ascending: false })
      .limit(1);

    const isRunning = runningRuns && runningRuns.length > 0;
    const currentRun = isRunning ? runningRuns[0] : null;
    const lastRun = lastCompleted?.[0] || null;

    // Get scraper progress from output_summary if running
    const progress = currentRun?.output_summary || lastRun?.output_summary || {
      scraped: 0,
      filtered: 0,
      enriched: 0,
    };

    // Calculate duration
    let duration = '—';
    if (currentRun) {
      const started = new Date(currentRun.started_at);
      const now = new Date();
      const diffMs = now.getTime() - started.getTime();
      const mins = Math.floor(diffMs / 60000);
      const hrs = Math.floor(mins / 60);
      duration = hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
    } else if (lastRun?.duration_seconds) {
      const mins = Math.floor(lastRun.duration_seconds / 60);
      const hrs = Math.floor(mins / 60);
      duration = hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
    }

    return NextResponse.json({
      status: isRunning ? 'running' : (lastRun?.status === 'failed' ? 'error' : 'idle'),
      lastRun: lastRun?.completed_at || lastRun?.started_at || null,
      duration,
      progress: {
        scraped: progress.scraped || progress.items_scraped || 0,
        filtered: progress.filtered || progress.items_filtered || 0,
        enriched: progress.enriched || progress.items_enriched || 0,
      },
      nextRun: null, // Manual only for now
      errorMessage: lastRun?.status === 'failed' ? lastRun.error_message : null,
    });
  } catch (err: any) {
    console.error('Scraper status error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
