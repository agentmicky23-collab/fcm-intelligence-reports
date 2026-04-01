import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.FCM_PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Total active
    const { count: totalActive } = await supabase
      .from('insider_picks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Total all-time
    const { count: totalAllTime } = await supabase
      .from('insider_picks')
      .select('*', { count: 'exact', head: true });

    // Total stale
    const { count: totalStale } = await supabase
      .from('insider_picks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'stale');

    // Last updated
    const { data: lastRow } = await supabase
      .from('insider_picks')
      .select('updated_at, created_at')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(1);

    const lastUpdated = lastRow?.[0]?.updated_at || lastRow?.[0]?.created_at || null;

    // All picks for breakdown
    const { data: allPicks } = await supabase
      .from('insider_picks')
      .select('source_platform, region, tenure, po_salary, business_name, pick_badge')
      .eq('status', 'active');

    // By Broker
    const byBroker: Record<string, number> = {};
    (allPicks || []).forEach(p => {
      const broker = p.source_platform || 'Unknown';
      byBroker[broker] = (byBroker[broker] || 0) + 1;
    });

    // By Category — derive from fields
    const byCategory: Record<string, number> = {};
    (allPicks || []).forEach(p => {
      let category = 'Other';
      const name = (p.business_name || '').toLowerCase();
      const badge = (p.pick_badge || '').toLowerCase();

      if (name.includes('post office') || p.po_salary) {
        category = 'Post Office';
      } else if (name.includes('convenience') || name.includes('newsagent') || name.includes('off licence')) {
        category = 'Convenience Store';
      } else if (name.includes('forecourt') || name.includes('petrol') || name.includes('filling station')) {
        category = 'Forecourt / Petrol Station';
      } else if (name.includes('pharmacy') || name.includes('chemist')) {
        category = 'Pharmacy';
      } else if (badge.includes('post office')) {
        category = 'Post Office';
      }

      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    // By Region
    const byRegion: Record<string, number> = {};
    (allPicks || []).forEach(p => {
      const region = p.region || 'Unknown';
      byRegion[region] = (byRegion[region] || 0) + 1;
    });

    // Sort region by count desc, keep top 10
    const sortedRegion: Record<string, number> = {};
    Object.entries(byRegion)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([k, v]) => { sortedRegion[k] = v; });

    return NextResponse.json({
      totalActive: totalActive || 0,
      totalAllTime: totalAllTime || 0,
      totalStale: totalStale || 0,
      lastUpdated,
      byBroker,
      byCategory,
      byRegion: sortedRegion,
    });
  } catch (err: any) {
    console.error('Listings stats error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
