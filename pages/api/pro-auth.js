/**
 * POST /api/pro-auth
 * 
 * Body: { email: string } — verify and create session
 * Body: { action: 'logout' } — clear session
 * GET  /api/pro-auth — check current session
 * 
 * Deploy to: pages/api/pro-auth.js
 */

import { verifyProEmail, createProSession, verifyProSession, clearProSession } from '../../lib/pro-session';

export default async function handler(req, res) {
  // GET — check current session
  if (req.method === 'GET') {
    const subscriber = await verifyProSession(req);
    if (!subscriber) {
      return res.status(401).json({ authenticated: false });
    }
    return res.status(200).json({
      authenticated: true,
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        tier: subscriber.tier,
        preferred_regions: subscriber.preferred_regions,
        business_types: subscriber.business_types,
        min_budget: subscriber.min_budget,
        max_budget: subscriber.max_budget,
        onboarding_complete: subscriber.onboarding_complete,
        subscribed_at: subscriber.subscribed_at,
        digest_count: subscriber.digest_count,
      },
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, action } = req.body;

  // Logout
  if (action === 'logout') {
    res.setHeader('Set-Cookie', clearProSession());
    return res.status(200).json({ authenticated: false });
  }

  // Login — verify email
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const subscriber = await verifyProEmail(email);
  
  if (!subscriber) {
    // Check if they're an Insider (not Pro) — offer upgrade
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { data: insiderSub } = await supabase
      .from('insider_subscribers')
      .select('id, tier, status')
      .eq('email', email.toLowerCase().trim())
      .eq('status', 'active')
      .single();
    
    if (insiderSub && insiderSub.tier === 'insider') {
      return res.status(403).json({
        error: 'insider_not_pro',
        message: 'You have an Insider subscription. Upgrade to Insider Pro to access the dashboard.',
        upgradeAvailable: true,
      });
    }
    
    return res.status(401).json({
      error: 'not_found',
      message: 'No active Insider Pro subscription found for this email.',
    });
  }

  // Create session
  res.setHeader('Set-Cookie', createProSession(subscriber.id));
  return res.status(200).json({
    authenticated: true,
    subscriber: {
      id: subscriber.id,
      email: subscriber.email,
      name: subscriber.name,
      tier: subscriber.tier,
    },
  });
}
