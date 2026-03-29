// app/api/insider-click/route.ts
// GET /api/insider-click?match={matchId}&url={destinationUrl}
// Tracks click engagement on digest email listing CTAs
// Updates insider_matches.clicked + clicked_at, then redirects

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const FALLBACK_URL = 'https://fcmreport.com/opportunities';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const match = searchParams.get('match');
  const url = searchParams.get('url');

  // Default redirect if params are missing
  if (!match || !url) {
    return NextResponse.redirect(url || FALLBACK_URL, { status: 302 });
  }

  // Track the click — don't block redirect on failure
  try {
    await supabase
      .from('insider_matches')
      .update({
        clicked: true,
        clicked_at: new Date().toISOString(),
      })
      .eq('id', match);
  } catch (err) {
    console.error('Click tracking error:', err);
  }

  // Redirect to the actual destination
  const destination = decodeURIComponent(url);
  return NextResponse.redirect(destination, { status: 302 });
}
