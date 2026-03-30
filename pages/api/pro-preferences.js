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
    // Build update object with only known columns
    const updateObj = {};
    if (preferred_regions !== undefined) updateObj.preferred_regions = preferred_regions || [];
    if (max_budget !== undefined) updateObj.max_budget = max_budget || null;
    if (min_budget !== undefined) updateObj.min_budget = min_budget || null;
    if (business_types !== undefined) updateObj.business_types = business_types || [];

    // Try optional columns in a safe way
    const optionalFields = {};
    if (tenure_preference !== undefined) optionalFields.tenure_preference = tenure_preference || 'any';
    if (experience_level !== undefined) optionalFields.experience_level = experience_level || null;
    if (timeline !== undefined) optionalFields.timeline = timeline || null;

    // First update core fields
    const { data, error } = await supabase
      .from('insider_subscribers')
      .update({ ...updateObj, ...optionalFields })
      .eq('email', session.email.toLowerCase())
      .select()
      .single();

    // If optional fields cause error, retry with just core fields
    if (error && Object.keys(optionalFields).length > 0) {
      const { data: data2, error: error2 } = await supabase
        .from('insider_subscribers')
        .update(updateObj)
        .eq('email', session.email.toLowerCase())
        .select()
        .single();
      if (error2) throw error2;
      return res.status(200).json({ success: true, subscriber: data2 });
    }

    if (error) throw error;

    return res.status(200).json({ success: true, subscriber: data });
  } catch (err) {
    console.error('Error saving preferences:', err);
    return res.status(500).json({ error: 'Failed to save preferences', detail: err?.message || String(err) });
  }
}
