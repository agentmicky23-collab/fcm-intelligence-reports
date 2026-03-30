// pages/api/pro-preferences.js
// Saves updated subscriber preferences

import { createClient } from '@supabase/supabase-js';
import { verifyProSession } from '../../lib/pro-session';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await verifyProSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const {
    preferred_regions,
    max_budget,
    min_budget,
    business_types,
    tenure_preference,
    experience_level,
    timeline,
  } = req.body;

  try {
    const { data, error } = await supabase
      .from('insider_subscribers')
      .update({
        preferred_regions: preferred_regions || [],
        max_budget: max_budget || null,
        min_budget: min_budget || null,
        business_types: business_types || [],
        tenure_preference: tenure_preference || 'any',
        experience_level: experience_level || null,
        timeline: timeline || null,
        updated_at: new Date().toISOString(),
      })
      .eq('email', session.email.toLowerCase())
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, subscriber: data });
  } catch (err) {
    console.error('Error saving preferences:', err);
    return res.status(500).json({ error: 'Failed to save preferences' });
  }
}
