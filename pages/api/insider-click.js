// pages/api/insider-click.js
// GET /api/insider-click?match={matchId}&url={destinationUrl}
// Tracks click engagement on digest email listing CTAs
// Updates insider_matches.clicked + clicked_at, then redirects

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { match, url } = req.query;

  // Default redirect if params are missing
  const fallbackUrl = 'https://fcmreport.com/opportunities';

  if (!match || !url) {
    return res.redirect(302, url || fallbackUrl);
  }

  // Track the click asynchronously — don't block redirect
  try {
    await supabase
      .from('insider_matches')
      .update({
        clicked: true,
        clicked_at: new Date().toISOString(),
      })
      .eq('id', match);
  } catch (err) {
    // Log but don't fail — the user should still get redirected
    console.error('Click tracking error:', err);
  }

  // Redirect to the actual destination
  const destination = decodeURIComponent(url);
  return res.redirect(302, destination);
}
