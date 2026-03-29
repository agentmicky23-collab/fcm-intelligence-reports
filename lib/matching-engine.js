/**
 * FCM Intelligence — Enhanced Matching Engine v2
 * Base scoring (100pts) + feedback adjustment (±15pts)
 *
 * Base weights: budget 30, region 25, tenure 15, profit 15, experience 15
 * Feedback bonus: +10 for matching a liked region, +5 for liked tenure
 * Feedback penalty: -10 for avoided region, -5 for avoided tenure
 *
 * Drop-in replacement for lib/matching-engine.js
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Run matching for a subscriber against all active picks.
 * @param {string} subscriberId
 * @returns {Promise<Array>} Array of match results
 */
export async function runMatching(subscriberId) {
  // Get subscriber preferences
  const { data: subscriber, error: subErr } = await supabase
    .from('insider_subscribers')
    .select('*')
    .eq('id', subscriberId)
    .single();

  if (subErr || !subscriber) throw new Error('Subscriber not found');

  // Get active picks
  const { data: picks, error: pickErr } = await supabase
    .from('insider_picks')
    .select('*')
    .in('status', ['active', 'featured']);

  if (pickErr) throw pickErr;
  if (!picks || picks.length === 0) return [];

  // Get feedback signals (may not exist yet)
  let signals = null;
  const { data: sigData } = await supabase
    .from('insider_feedback_signals')
    .select('*')
    .eq('subscriber_id', subscriberId)
    .single();
  signals = sigData; // null if no feedback yet

  // Score each pick
  const results = [];
  for (const pick of picks) {
    const { score, reasons } = calculateScore(subscriber, pick, signals);
    const personalisedNote = generateNote(subscriber, pick, score, reasons);

    results.push({
      subscriber_id: subscriberId,
      pick_id: pick.id,
      match_score: Math.max(0, Math.min(100, score)),
      match_reasons: reasons,
      personalised_note: personalisedNote,
      included_in_digest: false,
    });
  }

  // Upsert matches (UNIQUE constraint on subscriber_id + pick_id)
  for (const match of results) {
    await supabase
      .from('insider_matches')
      .upsert(match, { onConflict: 'subscriber_id,pick_id' });
  }

  return results.sort((a, b) => b.match_score - a.match_score);
}

function calculateScore(subscriber, pick, signals) {
  let score = 0;
  const reasons = [];

  // --- Budget (30pts) ---
  if (pick.price) {
    const min = subscriber.min_budget || 0;
    const max = subscriber.max_budget || Infinity;
    if (pick.price >= min && pick.price <= max) {
      score += 30;
      reasons.push('Within budget');
    } else if (pick.price >= min * 0.8 && pick.price <= max * 1.2) {
      score += 15;
      reasons.push('Near budget range');
    }
  } else {
    score += 10; // Unknown price gets partial credit
  }

  // --- Region (25pts) ---
  const preferredRegions = subscriber.preferred_regions || [];
  if (preferredRegions.length === 0) {
    score += 12; // No preference = partial credit
  } else if (pick.region && preferredRegions.includes(pick.region)) {
    score += 25;
    reasons.push(`In ${pick.region}`);
  }

  // --- Tenure (15pts) ---
  const tenurePref = subscriber.tenure_preference || 'any';
  if (tenurePref === 'any' || tenurePref === 'either') {
    score += 15;
  } else if (pick.tenure === tenurePref || pick.tenure === 'either') {
    score += 15;
    reasons.push(`${tenurePref.charAt(0).toUpperCase() + tenurePref.slice(1)} available`);
  }

  // --- Profit (15pts) ---
  if (subscriber.min_profit && pick.net_profit_value) {
    if (pick.net_profit_value >= subscriber.min_profit) {
      score += 15;
      reasons.push('Meets profit threshold');
    } else if (pick.net_profit_value >= subscriber.min_profit * 0.7) {
      score += 8;
      reasons.push('Close to profit target');
    }
  } else {
    score += 7; // Unknown = partial credit
  }

  // --- Experience (15pts) ---
  const expLevel = subscriber.experience_level || 'first_time';
  const suitedFor = pick.experience_suited_for || [];
  if (suitedFor.length === 0) {
    score += 7;
  } else if (suitedFor.includes(expLevel)) {
    score += 15;
    reasons.push('Suits your experience');
  }

  // --- Feedback adjustments (±15pts max) ---
  if (signals) {
    // Region boost/penalty
    if (pick.region) {
      if (signals.preferred_regions?.includes(pick.region)) {
        score += 10;
        reasons.push('Liked region');
      }
      if (signals.avoided_regions?.includes(pick.region)) {
        score -= 10;
      }
    }

    // Tenure boost
    if (signals.preferred_tenure && pick.tenure === signals.preferred_tenure) {
      score += 5;
    }
  }

  return { score: Math.round(score), reasons };
}

function generateNote(subscriber, pick, score, reasons) {
  const name = (subscriber.name || '').split(' ')[0] || '';
  const location = pick.location || pick.region || '';

  if (score >= 85) {
    return `This ${location} listing ticks a lot of your boxes — it's one of the closest matches we've seen for you.`;
  }
  if (score >= 70) {
    return `A solid option in ${location} that lines up well with what you've told us you're looking for.`;
  }
  if (score >= 50) {
    return `This one's a bit outside your core criteria, but it has some qualities we thought were worth flagging.`;
  }
  return `Not a perfect match on paper, but we thought it was worth keeping on your radar.`;
}

export default { runMatching };
