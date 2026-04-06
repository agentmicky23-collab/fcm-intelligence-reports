import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('insights_posts')
      .select('*')
      .lte('published_at', new Date().toISOString())
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[Insights API] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: data || [] });
  } catch (error) {
    console.error('[Insights API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
