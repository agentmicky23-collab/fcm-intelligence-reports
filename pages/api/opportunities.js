// pages/api/opportunities.js
// Public route — returns all active listings from insider_picks for the /opportunities page

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: picks, error } = await supabase
      .from('insider_picks')
      .select('*')
      .eq('status', 'active')
      .order('is_curated', { ascending: false })
      .order('added_at', { ascending: false });

    if (error) throw error;

    const listings = (picks || []).map(pick => ({
      id: pick.id,
      business_name: pick.business_name,
      location: pick.location,
      region: pick.region,
      postcode: pick.postcode,
      price: pick.price,
      price_label: pick.price_label,
      tenure: pick.tenure,
      category: pick.category,
      is_curated: pick.is_curated,
      po_salary: pick.po_salary,
      annual_turnover: pick.annual_turnover,
      net_profit: pick.net_profit,
      accommodation: pick.accommodation,
      premises_size: pick.premises_size,
      pick_reason: pick.pick_reason,
      pick_badge: pick.pick_badge,
      source_platform: pick.source_platform,
      source_url: pick.source_url,
      verified_at: pick.verified_at,
      added_at: pick.added_at,
    }));

    // Extract unique regions
    const regions = [...new Set(listings.map(l => l.region).filter(Boolean))].sort();

    // Extract unique source platforms for broker count
    const brokers = [...new Set(listings.map(l => l.source_platform).filter(Boolean))];

    return res.status(200).json({
      listings,
      total: listings.length,
      regions,
      brokers: brokers.length,
    });
  } catch (err) {
    console.error('Error fetching opportunities:', err);
    return res.status(500).json({ error: 'Failed to fetch listings' });
  }
}