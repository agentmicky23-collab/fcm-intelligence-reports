/**
 * GET /api/insider-feedback?sid=...&mid=...&vote=up|down
 *
 * Handles thumbs up/down from digest and alert emails.
 * Records feedback on the match, updates aggregate signals,
 * then redirects to a thank-you page or back to the site.
 *
 * Deploy to: app/api/insider-feedback/route.ts (App Router, like insider-click)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriberId = searchParams.get('sid');
    const matchId = searchParams.get('mid');
    const vote = searchParams.get('vote');

    // Validate
    if (!subscriberId || !matchId || !['up', 'down'].includes(vote)) {
      return NextResponse.redirect(`${SITE_URL}/insider?feedback=invalid`);
    }

    // 1. Record feedback on the match
    const { error: matchErr } = await supabase
      .from('insider_matches')
      .update({
        feedback: vote,
        feedback_at: new Date().toISOString(),
      })
      .eq('id', matchId)
      .eq('subscriber_id', subscriberId);

    if (matchErr) {
      console.error('Feedback update failed:', matchErr);
    }

    // 2. Update aggregate signals
    await updateFeedbackSignals(subscriberId);

    // 3. Redirect to a friendly confirmation
    const emoji = vote === 'up' ? '👍' : '👎';
    const message = vote === 'up'
      ? "Thanks! We'll find more like this."
      : "Got it — we'll adjust your matches.";

    return NextResponse.redirect(
      `${SITE_URL}/insider?feedback=${vote}&msg=${encodeURIComponent(message)}`
    );
  } catch (err) {
    console.error('Feedback handler error:', err);
    return NextResponse.redirect(`${SITE_URL}/insider?feedback=error`);
  }
}

/**
 * Rebuild the feedback signals for a subscriber based on all their feedback.
 * This creates a "learned preferences" profile that the matching engine can use.
 */
async function updateFeedbackSignals(subscriberId) {
  try {
    // Get all feedback for this subscriber with pick data
    const { data: feedbackMatches, error } = await supabase
      .from('insider_matches')
      .select('feedback, pick:insider_picks(region, price, tenure, business_name)')
      .eq('subscriber_id', subscriberId)
      .not('feedback', 'is', null);

    if (error || !feedbackMatches || feedbackMatches.length === 0) return;

    const upMatches = feedbackMatches.filter(m => m.feedback === 'up');
    const downMatches = feedbackMatches.filter(m => m.feedback === 'down');

    // Extract region preferences from feedback patterns
    const regionCounts = {};
    for (const m of upMatches) {
      if (m.pick?.region) {
        regionCounts[m.pick.region] = (regionCounts[m.pick.region] || 0) + 1;
      }
    }
    const avoidedRegions = {};
    for (const m of downMatches) {
      if (m.pick?.region) {
        avoidedRegions[m.pick.region] = (avoidedRegions[m.pick.region] || 0) + 1;
      }
    }

    // Extract price range from liked picks
    const likedPrices = upMatches
      .map(m => m.pick?.price)
      .filter(p => p && p > 0);
    const priceMin = likedPrices.length > 0 ? Math.min(...likedPrices) * 0.8 : null;
    const priceMax = likedPrices.length > 0 ? Math.max(...likedPrices) * 1.2 : null;

    // Extract tenure preference
    const tenureCounts = {};
    for (const m of upMatches) {
      if (m.pick?.tenure) {
        tenureCounts[m.pick.tenure] = (tenureCounts[m.pick.tenure] || 0) + 1;
      }
    }
    const preferredTenure = Object.entries(tenureCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Upsert the signals
    await supabase
      .from('insider_feedback_signals')
      .upsert({
        subscriber_id: subscriberId,
        preferred_regions: Object.keys(regionCounts),
        avoided_regions: Object.keys(avoidedRegions),
        preferred_price_min: priceMin ? Math.round(priceMin) : null,
        preferred_price_max: priceMax ? Math.round(priceMax) : null,
        preferred_tenure: preferredTenure,
        total_thumbs_up: upMatches.length,
        total_thumbs_down: downMatches.length,
        last_feedback_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'subscriber_id',
      });

  } catch (err) {
    console.error('Failed to update feedback signals:', err);
  }
}
