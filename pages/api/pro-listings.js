// pages/api/pro-listings.js
// Returns all active listings from insider_picks, joined with match scores for the authenticated subscriber

import { createClient } from '@supabase/supabase-js';
import { verifyProSession } from '../../lib/pro-session';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify Pro session
  const session = await verifyProSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Get all active picks
    const { data: picks, error: picksError } = await supabase
      .from('insider_picks')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (picksError) throw picksError;

    // Get subscriber info
    const { data: subscriber } = await supabase
      .from('insider_subscribers')
      .select('id, preferred_regions, max_budget, min_budget, business_types, tenure_preference, experience_level, timeline')
      .eq('email', session.email.toLowerCase())
      .single();

    // Get match scores if subscriber exists
    let matches = {};
    if (subscriber) {
      const { data: matchData } = await supabase
        .from('insider_matches')
        .select('pick_id, match_score, personalised_note, feedback, shortlisted')
        .eq('subscriber_id', subscriber.id);

      if (matchData) {
        matchData.forEach(m => {
          matches[m.pick_id] = m;
        });
      }
    }

    // Merge picks with match data
    const listings = (picks || []).map(pick => ({
      id: pick.id,
      name: pick.business_name,
      location: pick.location,
      region: pick.region,
      postcode: pick.postcode,
      price: pick.price,
      priceLabel: pick.price_label,
      tenure: pick.tenure,
      poSalary: pick.po_salary,
      annualTurnover: pick.annual_turnover,
      netProfit: pick.net_profit,
      pickReason: pick.pick_reason,
      pickBadge: pick.pick_badge,
      sourcePlatform: pick.source_platform,
      sourceUrl: pick.source_url,
      matchScore: matches[pick.id]?.match_score || null,
      matchNote: matches[pick.id]?.personalised_note || null,
      feedback: matches[pick.id]?.feedback || null,
      shortlisted: matches[pick.id]?.shortlisted || false,
      createdAt: pick.created_at,
    }));

    // Sort: matched listings first (by match score desc), then unmatched (by price desc)
    listings.sort((a, b) => {
      if (a.matchScore && !b.matchScore) return -1;
      if (!a.matchScore && b.matchScore) return 1;
      if (a.matchScore && b.matchScore) return b.matchScore - a.matchScore;
      return (b.price || 0) - (a.price || 0);
    });

    // Generate market data from picks
    const regionMap = {};
    (picks || []).forEach(p => {
      const r = p.region || 'Unknown';
      if (!regionMap[r]) {
        regionMap[r] = { region: r, listings: 0, totalPrice: 0, priceCount: 0 };
      }
      regionMap[r].listings++;
      if (p.price > 0) {
        regionMap[r].totalPrice += p.price;
        regionMap[r].priceCount++;
      }
    });

    const marketData = Object.values(regionMap).map(r => ({
      region: r.region,
      listings: r.listings,
      avgPrice: r.priceCount > 0 ? Math.round(r.totalPrice / r.priceCount) : 0,
    })).sort((a, b) => b.listings - a.listings);

    return res.status(200).json({
      listings,
      marketData,
      subscriber: subscriber ? {
        preferredRegions: subscriber.preferred_regions || [],
        maxBudget: subscriber.max_budget,
        minBudget: subscriber.min_budget,
        businessTypes: subscriber.business_types || [],
        tenurePreference: subscriber.tenure_preference,
        experienceLevel: subscriber.experience_level,
        timeline: subscriber.timeline,
      } : null,
      total: listings.length,
      matched: Object.keys(matches).length,
    });
  } catch (err) {
    console.error('Error fetching pro listings:', err);
    return res.status(500).json({ error: 'Failed to fetch listings' });
  }
}
