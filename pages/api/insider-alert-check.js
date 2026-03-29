/**
 * POST /api/insider-alert-check
 *
 * Called after new picks are added to insider_picks.
 * Finds subscribers with 85+ match scores on un-alerted matches,
 * sends at most 1 mid-week alert per subscriber per 7 days.
 *
 * Body: { pickIds: string[] } (optional — if omitted, checks all un-alerted matches)
 *
 * Deploy to: pages/api/insider-alert-check.js
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { buildAlertEmail } from '../../emails/alert-email-builder';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

const ALERT_THRESHOLD = 85;
const COOLDOWN_DAYS = 7;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com';
    const cooldownDate = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString();

    // Find un-alerted matches scoring 85+
    const { data: highMatches, error: matchErr } = await supabase
      .from('insider_matches')
      .select(`
        *,
        subscriber:insider_subscribers(*),
        pick:insider_picks(*)
      `)
      .eq('alert_sent', false)
      .gte('match_score', ALERT_THRESHOLD)
      .order('match_score', { ascending: false });

    if (matchErr) throw matchErr;
    if (!highMatches || highMatches.length === 0) {
      return res.status(200).json({ sent: 0, message: 'No high matches to alert' });
    }

    // Group by subscriber, pick the best match per subscriber
    const bestPerSubscriber = {};
    for (const match of highMatches) {
      const sid = match.subscriber_id;
      if (!bestPerSubscriber[sid] || match.match_score > bestPerSubscriber[sid].match_score) {
        bestPerSubscriber[sid] = match;
      }
    }

    let sent = 0;
    const errors = [];

    for (const [subscriberId, match] of Object.entries(bestPerSubscriber)) {
      const subscriber = match.subscriber;
      const pick = match.pick;

      // Skip if subscriber isn't active or hasn't completed onboarding
      if (!subscriber || subscriber.status !== 'active' || !subscriber.onboarding_complete) {
        continue;
      }

      // Rate limit: skip if we sent an alert in the last 7 days
      if (subscriber.last_alert_sent_at && subscriber.last_alert_sent_at > cooldownDate) {
        continue;
      }

      try {
        const { subject, html } = buildAlertEmail({
          subscriber,
          match,
          pick,
          siteUrl,
        });

        await resend.emails.send({
          from: 'FCM Intelligence <reports@fcmreport.com>',
          to: subscriber.email,
          subject,
          html,
        });

        // Mark match as alerted
        await supabase
          .from('insider_matches')
          .update({ alert_sent: true, alert_sent_at: new Date().toISOString() })
          .eq('id', match.id);

        // Update subscriber cooldown
        await supabase
          .from('insider_subscribers')
          .update({ last_alert_sent_at: new Date().toISOString() })
          .eq('id', subscriberId);

        sent++;
      } catch (emailErr) {
        console.error(`Alert email failed for ${subscriber.email}:`, emailErr);
        errors.push({ email: subscriber.email, error: emailErr.message });
      }
    }

    return res.status(200).json({
      sent,
      checked: Object.keys(bestPerSubscriber).length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Alert check failed:', err);
    return res.status(500).json({ error: 'Alert check failed', detail: err.message });
  }
}
