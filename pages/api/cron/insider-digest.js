// pages/api/cron/insider-digest.js
// Vercel Cron: runs every Monday at 8:00 AM UTC
// Sends weekly hand-picked opportunities to active Insider subscribers
//
// Add to vercel.json:
// {
//   "crons": [
//     { "path": "/api/cron/insider-digest", "schedule": "0 8 * * 1" }
//   ]
// }

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Verify this is a genuine cron request (Vercel sets this header)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    // Also allow POST with secret for manual triggers
    if (req.method !== 'POST' || req.body?.secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    // 1. Get all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('insider_subscribers')
      .select('*')
      .eq('status', 'active');

    if (subError) throw subError;
    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({ message: 'No active subscribers', sent: 0 });
    }

    // 2. Get this week's date range for the "new this week" badge
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    // 3. Build the digest email
    // NOTE: In production, this would pull from a listings table/API
    // For now, the digest includes a curated intro + CTA to browse
    // Micky can later add an "insider_picks" table for hand-picked listings

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const firstName = subscriber.name ? subscriber.name.split(' ')[0] : 'Insider';

      const htmlBody = buildDigestEmail({
        firstName,
        dateStr,
        digestNumber: (subscriber.digest_count || 0) + 1,
      });

      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'FCM Intelligence <reports@fcmreport.com>',
            to: [subscriber.email],
            subject: `Weekly Insider Digest — ${dateStr}`,
            html: htmlBody,
          }),
        });

        if (response.ok) {
          sent++;
          // Update last digest sent timestamp
          await supabase
            .from('insider_subscribers')
            .update({
              last_digest_sent_at: now.toISOString(),
              digest_count: (subscriber.digest_count || 0) + 1,
              updated_at: now.toISOString(),
            })
            .eq('id', subscriber.id);
        } else {
          failed++;
          const err = await response.json();
          console.error(`Failed to send to ${subscriber.email}:`, err);
        }
      } catch (emailErr) {
        failed++;
        console.error(`Email error for ${subscriber.email}:`, emailErr);
      }
    }

    return res.status(200).json({
      success: true,
      total: subscribers.length,
      sent,
      failed,
      date: dateStr,
    });
  } catch (err) {
    console.error('Digest cron error:', err);
    return res.status(500).json({ error: err.message });
  }
}

function buildDigestEmail({ firstName, dateStr, digestNumber }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FCM Insider Weekly Digest</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Your weekly hand-picked opportunities and market intelligence from FCM Insider.</div>
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <tr><td style="height:3px;background:linear-gradient(90deg, #0d1117, #c9a227, #d4b84a, #c9a227, #0d1117);"></td></tr>
          
          <!-- Header -->
          <tr>
            <td style="background-color:#0B1D3A;padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:11px;font-weight:700;color:#c9a227;text-transform:uppercase;letter-spacing:3px;">FCM Intelligence</div>
                  </td>
                  <td style="text-align:right;">
                    <span style="font-size:10px;color:rgba(201,162,39,0.5);background:rgba(201,162,39,0.08);border:1px solid rgba(201,162,39,0.15);padding:3px 10px;border-radius:12px;">⭐ INSIDER</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Hero -->
          <tr>
            <td style="background-color:#161b22;padding:32px 32px 20px;">
              <h1 style="font-size:24px;font-weight:700;color:#ffffff;margin:0 0 6px;">Weekly Digest #${digestNumber}</h1>
              <p style="font-size:14px;color:#8b949e;margin:0;">${dateStr} — Hey ${firstName}, here's what moved this week.</p>
            </td>
          </tr>
          
          <!-- Market summary -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B1D3A;border-radius:10px;border:1px solid rgba(201,162,39,0.1);">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font-size:10px;font-weight:600;color:#c9a227;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">This Week's Market</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align:center;padding:8px;width:33%;">
                          <div style="font-size:28px;font-weight:700;color:#c9a227;line-height:1;">35+</div>
                          <div style="font-size:11px;color:#8b949e;margin-top:4px;">Active Listings</div>
                        </td>
                        <td style="text-align:center;padding:8px;width:33%;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);">
                          <div style="font-size:28px;font-weight:700;color:#22c55e;line-height:1;">NEW</div>
                          <div style="font-size:11px;color:#8b949e;margin-top:4px;">Listings This Week</div>
                        </td>
                        <td style="text-align:center;padding:8px;width:33%;">
                          <div style="font-size:28px;font-weight:700;color:#e6edf3;line-height:1;">£50k</div>
                          <div style="font-size:11px;color:#8b949e;margin-top:4px;">Lowest Entry Point</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Insider Picks intro -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 24px;">
              <div style="font-size:10px;font-weight:600;color:#c9a227;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">⭐ Insider Picks This Week</div>
              <p style="font-size:14px;color:#8b949e;line-height:1.6;margin:0 0 16px;">These are the opportunities our team would look at first — based on value, location strength, and growth potential. You're seeing these before they hit our public page.</p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg, #c9a227, #d4b84a);border-radius:8px;padding:14px 32px;">
                    <a href="https://fcmreport.com/opportunities" style="font-size:15px;font-weight:700;color:#0B1D3A;text-decoration:none;">View All Opportunities →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px;">
              <div style="height:1px;background:rgba(255,255,255,0.06);"></div>
            </td>
          </tr>
          
          <!-- Services reminder -->
          <tr>
            <td style="background-color:#161b22;padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,162,39,0.04);border:1px solid rgba(201,162,39,0.1);border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:13px;color:#c9a227;font-weight:600;margin-bottom:4px;">🎓 Your Insider Discount</div>
                    <div style="font-size:13px;color:#8b949e;line-height:1.5;">Remember — you get <strong style="color:#c9a227;">15% off</strong> all FCM services: business plans, interview prep, operator training, and advisory. Just mention your Insider membership when you enquire.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Quick tip -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B1D3A;border-radius:10px;border-left:3px solid #c9a227;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:13px;color:#c9a227;font-weight:600;margin-bottom:4px;">💡 Insider Tip</div>
                    <div style="font-size:13px;color:#8b949e;line-height:1.5;">Spot a listing you like? Order an Insight Report (£199) before visiting. Buyers who arrive with verified intelligence negotiate 10-15% better on average. The report pays for itself.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#0B1D3A;padding:24px 32px;border-top:1px solid rgba(201,162,39,0.15);">
              <p style="font-size:12px;color:#8b949e;margin:0 0 12px;text-align:center;">You're receiving this because you're an FCM Insider subscriber.</p>
              <p style="font-size:11px;color:#484f58;line-height:1.5;margin:0;text-align:center;">
                Firstclass Managerial Ltd trading as FCM Intelligence<br>
                <a href="https://fcmreport.com" style="color:#c9a227;text-decoration:none;">fcmreport.com</a> &nbsp;|&nbsp;
                <a href="https://fcmreport.com/insider" style="color:#484f58;text-decoration:none;">Manage Subscription</a>
              </p>
            </td>
          </tr>
          
          <tr><td style="height:3px;background:linear-gradient(90deg, #0d1117, #c9a227, #d4b84a, #c9a227, #0d1117);"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
