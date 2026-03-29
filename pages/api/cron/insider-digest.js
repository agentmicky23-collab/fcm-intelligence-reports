/**
 * GET /api/cron/insider-digest
 *
 * Weekly personalised digest — runs Monday 8:00 AM UTC via Vercel Cron.
 * Uses concierge-toned email builder.
 *
 * Drop-in replacement for pages/api/cron/insider-digest.js
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { buildDigestEmail } from '../../../emails/digest-email-builder';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com';
    const weekLabel = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    // Get all active subscribers
    const { data: subscribers, error: subErr } = await supabase
      .from('insider_subscribers')
      .select('*')
      .eq('status', 'active');

    if (subErr) throw subErr;
    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({ sent: 0, message: 'No active subscribers' });
    }

    let sent = 0;
    const errors = [];

    for (const subscriber of subscribers) {
      try {
        // Get top 5 undelivered matches for this subscriber
        const { data: matches } = await supabase
          .from('insider_matches')
          .select('*, pick:insider_picks(*)')
          .eq('subscriber_id', subscriber.id)
          .eq('included_in_digest', false)
          .order('match_score', { ascending: false })
          .limit(5);

        // Build email (handles no-prefs nudge, no-matches, and normal digest)
        const { subject, html } = buildDigestEmail({
          subscriber,
          matches: matches || [],
          weekLabel,
          siteUrl,
        });

        // Send
        await resend.emails.send({
          from: 'FCM Intelligence <reports@fcmreport.com>',
          to: subscriber.email,
          subject,
          html,
        });

        // Mark matches as delivered
        if (matches && matches.length > 0) {
          const matchIds = matches.map(m => m.id);
          await supabase
            .from('insider_matches')
            .update({
              included_in_digest: true,
              digest_sent_at: new Date().toISOString(),
            })
            .in('id', matchIds);
        }

        // Update subscriber digest tracking
        await supabase
          .from('insider_subscribers')
          .update({
            last_digest_sent_at: new Date().toISOString(),
            digest_count: (subscriber.digest_count || 0) + 1,
          })
          .eq('id', subscriber.id);

        sent++;
      } catch (emailErr) {
        console.error(`Digest failed for ${subscriber.email}:`, emailErr);
        errors.push({ email: subscriber.email, error: emailErr.message });
        // Per critical rule #7: failed email must not break the loop
      }
    }

    return res.status(200).json({
      sent,
      total: subscribers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Digest cron failed:', err);
    return res.status(500).json({ error: 'Digest cron failed', detail: err.message });
  }
}
