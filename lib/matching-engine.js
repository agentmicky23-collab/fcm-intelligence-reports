// lib/matching-engine.js
// Shared matching engine for Insider personalised alerts
// Used by: /api/insider-preferences, /api/cron/insider-digest

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Budget range mappings for form values → numeric min/max
 */
const BUDGET_RANGES = {
  'Under £50k':       { min: 0, max: 50000 },
  '£50k - £100k':     { min: 50000, max: 100000 },
  '£100k - £200k':    { min: 100000, max: 200000 },
  '£200k+':           { min: 200000, max: null },
  'No limit':         { min: 0, max: null },
  // Extended ranges from spec
  '£200k - £350k':    { min: 200000, max: 350000 },
  '£350k - £500k':    { min: 350000, max: 500000 },
  '£500k+':           { min: 500000, max: null },
};

/**
 * Min profit mappings
 */
const MIN_PROFIT_MAP = {
  'Any':      0,
  '£25k+':    25000,
  '£40k+':    40000,
  '£60k+':    60000,
  '£80k+':    80000,
};

/**
 * Experience level mappings from form values → DB values
 */
const EXPERIENCE_MAP = {
  'First-time buyer':                      'first_time',
  'Existing operator looking to expand':   'existing_operator',
  'Investor / Group':                      'investor',
  // DB native values pass through
  'first_time':       'first_time',
  'existing_operator': 'existing_operator',
  'multi_branch':     'multi_branch',
  'investor':         'investor',
};

/**
 * Calculate a match score (0–100) between a subscriber and a listing pick.
 *
 * Scoring breakdown:
 *   Budget:     0–30 points
 *   Region:     0–25 points
 *   Tenure:     0–15 points
 *   Profit:     0–15 points
 *   Experience: 0–15 points
 *   ---
 *   Max: 100
 */
export function calculateMatch(subscriber, pick) {
  let score = 0;
  const reasons = [];

  // ─── Budget (0–30) ───
  const minBudget = subscriber.min_budget || 0;
  const maxBudget = subscriber.max_budget || null;

  if (pick.price) {
    const withinMin = pick.price >= minBudget;
    const withinMax = !maxBudget || pick.price <= maxBudget;

    if (withinMin && withinMax) {
      score += 30;
      if (maxBudget) {
        const pct = Math.round((pick.price / maxBudget) * 100);
        reasons.push(`Within budget (${pct}% of your max)`);
      } else {
        reasons.push('Within your budget range');
      }
    } else if (maxBudget && pick.price <= maxBudget * 1.15) {
      // Slightly over — still worth showing
      score += 10;
      const overBy = Math.round(((pick.price - maxBudget) / maxBudget) * 100);
      reasons.push(`${overBy}% above budget but worth considering`);
    }
    // Outside budget = 0 points, no reason added
  } else {
    // No price listed — give partial score
    score += 15;
  }

  // ─── Region (0–25) ───
  const regions = subscriber.preferred_regions || [];
  if (regions.length === 0 || regions.includes('Anywhere')) {
    score += 25;
    // Don't add "all regions" as a reason — it's not specific enough
  } else if (pick.region && regions.includes(pick.region)) {
    score += 25;
    reasons.push(`In your preferred region (${pick.region})`);
  } else if (pick.region) {
    // Wrong region = 0
  } else {
    // No region on pick — partial
    score += 10;
  }

  // ─── Tenure (0–15) ───
  const tenurePref = subscriber.tenure_preference || 'any';
  if (tenurePref === 'any' || tenurePref === 'either') {
    score += 15;
  } else if (pick.tenure) {
    if (pick.tenure === tenurePref) {
      score += 15;
      reasons.push(`${capitalize(pick.tenure)} — matches your preference`);
    } else if (pick.tenure === 'either') {
      score += 10;
      reasons.push('Flexible tenure available');
    }
    // Mismatch = 0
  } else {
    score += 8; // Unknown tenure
  }

  // ─── Profit (0–15) ───
  const minProfit = subscriber.min_profit || 0;
  if (pick.net_profit_value && minProfit > 0) {
    if (pick.net_profit_value >= minProfit) {
      score += 15;
      reasons.push(`Net profit £${formatK(pick.net_profit_value)} meets your £${formatK(minProfit)} minimum`);
    } else if (pick.net_profit_value >= minProfit * 0.8) {
      // Close to minimum
      score += 5;
      reasons.push(`Net profit £${formatK(pick.net_profit_value)} — close to your target`);
    }
  } else if (!minProfit || minProfit === 0) {
    score += 15; // No minimum set = everything matches
  } else {
    score += 8; // No profit data on pick
  }

  // ─── Experience (0–15) ───
  const expLevel = EXPERIENCE_MAP[subscriber.experience_level] || subscriber.experience_level;
  const suited = pick.experience_suited_for || [];
  if (suited.length === 0) {
    score += 15; // No restriction
  } else if (suited.includes(expLevel)) {
    score += 15;
    if (expLevel === 'first_time') {
      reasons.push('Suitable for first-time buyers');
    } else if (expLevel === 'existing_operator') {
      reasons.push('Good fit for experienced operators');
    } else if (expLevel === 'multi_branch') {
      reasons.push('Suits multi-branch expansion');
    } else if (expLevel === 'investor') {
      reasons.push('Suitable for managed investment');
    }
  }
  // Not suited = 0

  return { score: Math.min(score, 100), reasons };
}

/**
 * Generate a human-readable personalised note for the digest email.
 */
export function generatePersonalisedNote(subscriber, pick, reasons) {
  const parts = [];

  // Lead with budget context
  if (pick.price && subscriber.max_budget) {
    const pct = Math.round((pick.price / subscriber.max_budget) * 100);
    if (pct <= 70) {
      parts.push(`At £${formatK(pick.price)}, this is well within your budget`);
    } else if (pct <= 100) {
      parts.push(`At £${formatK(pick.price)}, this fits your budget`);
    } else {
      parts.push(`At £${formatK(pick.price)}, this is slightly above your budget but worth a look`);
    }
  } else if (pick.price) {
    parts.push(`Listed at £${formatK(pick.price)}`);
  }

  // Add the strongest match reasons (up to 2)
  const topReasons = reasons.filter(r => !r.startsWith('Within budget')).slice(0, 2);
  parts.push(...topReasons);

  // Add profit context if available
  if (pick.net_profit && !reasons.some(r => r.includes('profit'))) {
    parts.push(`Reported profit: ${pick.net_profit}`);
  }

  // Timeline nudge
  if (subscriber.timeline === 'ready_now' || subscriber.timeline === 'Ready now — actively negotiating') {
    parts.push('Move quickly — good listings at this level don\'t last');
  }

  return parts.join('. ') + (parts.length > 0 ? '.' : 'New listing available.');
}

/**
 * Run the matching engine for a single subscriber against all active picks.
 * Creates/updates insider_matches rows via upsert.
 * Returns array of { pick_id, score, reasons }.
 */
export async function runMatchingEngine(subscriber) {
  // Fetch all active/featured picks
  const { data: picks, error } = await supabase
    .from('insider_picks')
    .select('*')
    .in('status', ['active', 'featured']);

  if (error) {
    console.error('Error fetching picks:', error);
    return [];
  }
  if (!picks?.length) return [];

  const matches = [];

  for (const pick of picks) {
    const { score, reasons } = calculateMatch(subscriber, pick);

    if (score > 0) {
      const personalised_note = generatePersonalisedNote(subscriber, pick, reasons);

      const { error: upsertErr } = await supabase
        .from('insider_matches')
        .upsert(
          {
            subscriber_id: subscriber.id,
            pick_id: pick.id,
            match_score: score,
            match_reasons: reasons,
            personalised_note,
          },
          { onConflict: 'subscriber_id,pick_id' }
        );

      if (upsertErr) {
        console.error(`Upsert error for subscriber=${subscriber.id} pick=${pick.id}:`, upsertErr);
      }

      matches.push({ pick_id: pick.id, score, reasons, personalised_note });
    }
  }

  return matches;
}

// ─── Helpers ───

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatK(value) {
  if (!value) return '?';
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return String(value);
}
