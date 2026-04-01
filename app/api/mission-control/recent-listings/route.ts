import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.FCM_PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const broker = searchParams.get('broker');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    let query = supabase
      .from('insider_picks')
      .select('id, business_name, source_platform, price, price_label, region, po_salary, pick_badge, status, created_at, updated_at')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    // Filter by broker
    if (broker && broker !== 'all') {
      query = query.ilike('source_platform', `%${broker}%`);
    }

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Category filter is applied client-side since it's derived
    let listings = (data || []).map(p => {
      let cat = 'Other';
      const name = (p.business_name || '').toLowerCase();
      if (name.includes('post office') || p.po_salary) cat = 'Post Office';
      else if (name.includes('convenience') || name.includes('newsagent') || name.includes('off licence')) cat = 'Convenience Store';
      else if (name.includes('forecourt') || name.includes('petrol') || name.includes('filling station')) cat = 'Forecourt / Petrol Station';

      return {
        id: p.id,
        businessName: p.business_name,
        broker: p.source_platform || 'Unknown',
        price: p.price,
        priceLabel: p.price_label,
        region: p.region,
        category: cat,
        status: p.status,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      };
    });

    // Apply category filter if specified
    if (category && category !== 'all') {
      listings = listings.filter(l => l.category === category);
    }

    return NextResponse.json(listings);
  } catch (err: any) {
    console.error('Recent listings error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
