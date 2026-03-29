// pages/api/insider-preferences.js
// POST /api/insider-preferences
// Saves subscriber preferences and runs matching engine immediately
//
// Body: { email, name?, business_types, preferred_regions, budget,
//         tenure_preference, min_profit, experience_level, timeline,
//         wants_consultation, notes }

import { createClient } from '@supabase/supabase-js';
import { runMatchingEngine } from '../../lib/matching-engine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Budget string → numeric min/max
const BUDGET_RANGES = {
  'Under £50k':       { min: 0, max: 50000 },
  '£50k - £100k':     { min: 50000, max: 100000 },
  '£100k - £200k':    { min: 100000, max: 200000 },
  '£200k - £350k':    { min: 200000, max: 350000 },
  '£350k - £500k':    { min: 350000, max: 500000 },
  '£200k+':           { min: 200000, max: null },
  '£500k+':           { min: 500000, max: null },
  'No limit':         { min: 0, max: null },
};

// Profit string → numeric
const PROFIT_MAP = {
  'Any':    0,
  '£25k+':  25000,
  '£40k+':  40000,
  '£60k+':  60000,
  '£80k+':  80000,
};

// Experience string → DB value
const EXPERIENCE_MAP = {
  'First-time buyer':                      'first_time',
  'Existing operator looking to expand':   'existing_operator',
  'Investor / Group':                      'investor',
};

// Timeline string → DB value
const TIMELINE_MAP = {
  'Just browsing':        'browsing',
  'Within 3 months':      '3_months',
  'Within 6 months':      '6_months',
  'Ready now':            'ready_now',
};

// Tenure string → DB value
const TENURE_MAP = {
  'Freehold only':                'freehold',
  'Leasehold only':               'leasehold',
  'Either — I\'m flexible':       'either',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    email,
    name,
    business_types,    // string[] from form pills
    preferred_regions, // string[] from form pills
    budget,            // string like "£100k - £200k"
    tenure_preference, // string like "Freehold only"
    min_profit,        // string like "£40k+"
    experience_level,  // string like "First-time buyer"
    timeline,          // string like "Within 3 months"
    wants_consultation, // boolean
    notes,             // string
  } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Parse budget range
  const budgetRange = BUDGET_RANGES[budget] || { min: 0, max: null };

  // Build update payload
  const updatePayload = {
    business_types: business_types || [],
    preferred_regions: preferred_regions || [],
    min_budget: budgetRange.min,
    max_budget: budgetRange.max,
    tenure_preference: TENURE_MAP[tenure_preference] || tenure_preference || 'any',
    min_profit: PROFIT_MAP[min_profit] || (typeof min_profit === 'number' ? min_profit : 0),
    experience_level: EXPERIENCE_MAP[experience_level] || experience_level || null,
    timeline: TIMELINE_MAP[timeline] || timeline || null,
    wants_consultation: wants_consultation === true || wants_consultation === 'Yes',
    notes: notes || null,
    onboarding_complete: true,
    updated_at: new Date().toISOString(),
  };

  // Also update name if provided
  if (name) {
    updatePayload.name = name;
  }

  // First check if subscriber exists
  const { data: existing, error: lookupErr } = await supabase
    .from('insider_subscribers')
    .select('id')
    .eq('email', email)
    .single();

  if (lookupErr && lookupErr.code !== 'PGRST116') {
    console.error('Subscriber lookup error:', lookupErr);
    return res.status(500).json({ error: 'Database error' });
  }

  let subscriber;

  if (existing) {
    // Update existing subscriber
    const { data, error } = await supabase
      .from('insider_subscribers')
      .update(updatePayload)
      .eq('email', email)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: error.message });
    }
    subscriber = data;
  } else {
    // Create new subscriber (they might be setting preferences before Stripe subscription)
    const { data, error } = await supabase
      .from('insider_subscribers')
      .insert({
        email,
        name: name || null,
        status: 'pending', // Will become 'active' when Stripe confirms
        ...updatePayload,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ error: error.message });
    }
    subscriber = data;
  }

  // Run matching engine immediately
  let matchCount = 0;
  try {
    const matches = await runMatchingEngine(subscriber);
    matchCount = matches.length;
  } catch (matchErr) {
    console.error('Matching engine error:', matchErr);
    // Don't fail the request — preferences are saved
  }

  return res.status(200).json({
    success: true,
    matchCount,
    message: matchCount > 0
      ? `Preferences saved! We found ${matchCount} matching opportunities.`
      : 'Preferences saved! We\'ll notify you when matching listings appear.',
  });
}
