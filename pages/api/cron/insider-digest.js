// pages/api/cron/insider-digest.js
// Vercel Cron: runs every Monday at 8:00 AM UTC
// Sends PERSONALISED weekly opportunities to each active Insider subscriber
// Each subscriber gets different listings matched to their preferences
//
// Add to vercel.json:
// {
//   "crons": [
//     { "path": "/api/cron/insider-digest", "schedule": "0 8 * * 1" }
//   ]
// }

import { createClient } from '@supabase/supabase-js';
import { runMatchingEngine } from '../../../lib/matching-engine';

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

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    let sent = 0;
    let failed = 0;
    let nudged = 0;

    for (const subscriber of subscribers) {
      const firstName = subscriber.name ? subscriber.name.split(' ')[0] : 'Insider';
      const digestNumber = (subscriber.digest_count || 0) + 1;

      try {
        let htmlBody;

        // If subscriber hasn't set up preferences, send a nudge instead
        if (!subscriber.onboarding_complete) {
          htmlBody = buildNudgeEmail({ firstName, dateStr, digestNumber });
          nudged++;
        } else {
          // Run matching engine for this subscriber
          await runMatchingEngine(subscriber);

          // Fetch top 5 undelivered matches (highest score first)
          const { data: topMatches, error: matchErr } = await supabase
            .from('insider_matches')
            .select('*, insider_picks(*)')
            .eq('subscriber_id', subscriber.id)
            .eq('included_in_digest', false)
            .order('match_score', { ascending: false })
            .limit(5);

          if (matchErr) {
            console.error(`Match fetch error for ${subscriber.email}:`, matchErr);
          }

          if (!topMatches || topMatches.length === 0) {
            // No new matches — send a short "nothing new" digest
            htmlBody = buildNoMatchesEmail({ firstName, dateStr, digestNumber });
          } else {
            // Build personalised digest with matched listings
            htmlBody = buildPersonalisedDigest({
              firstName,
              dateStr,
              digestNumber,
              matches: topMatches,
            });

            // Mark matches as delivered
            const matchIds = topMatches.map(m => m.id);
            await supabase
              .from('insider_matches')
              .update({
                included_in_digest: true,
                digest_sent_at: now.toISOString(),
              })
              .in('id', matchIds);
          }
        }

        // Send via Resend
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'FCM Intelligence <reports@fcmreport.com>',
            to: [subscriber.email],
            subject: subscriber.onboarding_complete
              ? `Your Personalised Picks — ${dateStr}`
              : `Set up your alerts — ${dateStr}`,
            html: htmlBody,
          }),
        });

        if (response.ok) {
          sent++;
          await supabase
            .from('insider_subscribers')
            .update({
              last_digest_sent_at: now.toISOString(),
              digest_count: digestNumber,
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
      nudged,
      date: dateStr,
    });
  } catch (err) {
    console.error('Digest cron error:', err);
    return res.status(500).json({ error: err.message });
  }
}


// ═══════════════════════════════════════════════════════════════════
// Email Builders
// ═══════════════════════════════════════════════════════════════════

function buildPersonalisedDigest({ firstName, dateStr, digestNumber, matches }) {
  const listingsHtml = matches.map((match, i) => {
    const pick = match.insider_picks;
    if (!pick) return '';

    const clickUrl = `https://fcmreport.com/api/insider-click?match=${match.id}&url=${encodeURIComponent(pick.listing_url || 'https://fcmreport.com/opportunities')}`;
    const scoreColor = match.match_score >= 80 ? '#22c55e' : match.match_score >= 60 ? '#c9a227' : '#8b949e';

    return `
      <tr>
        <td style="padding:0 0 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B1D3A;border-radius:10px;border:1px solid rgba(201,162,39,0.15);">
            <tr>
              <td style="padding:18px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <div style="font-size:16px;font-weight:700;color:#e6edf3;margin-bottom:6px;">${pick.business_name || 'New Listing'}</div>
                    </td>
                    <td style="text-align:right;vertical-align:top;">
                      <span style="font-size:12px;font-weight:700;color:${scoreColor};background:${scoreColor}15;border:1px solid ${scoreColor}40;padding:3px 10px;border-radius:12px;">${match.match_score}% match</span>
                    </td>
                  </tr>
                </table>
                <div style="font-size:13px;color:#8b949e;margin-bottom:8px;">
                  📍 ${pick.location || 'Location TBC'} ${pick.price ? `&nbsp;&nbsp;💰 £${formatPrice(pick.price)}` : ''} ${pick.tenure ? `&nbsp;&nbsp;🏠 ${capitalize(pick.tenure)}` : ''}
                </div>
                ${match.personalised_note ? `<div style="font-size:13px;color:#c9a227;line-height:1.5;margin-bottom:12px;padding:10px 14px;background:rgba(201,162,39,0.06);border-left:3px solid rgba(201,162,39,0.3);border-radius:0 6px 6px 0;">💡 ${match.personalised_note}</div>` : ''}
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:linear-gradient(135deg, #c9a227, #d4b84a);border-radius:6px;padding:10px 20px;">
                      <a href="${clickUrl}" style="font-size:13px;font-weight:700;color:#0B1D3A;text-decoration:none;">View Listing →</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FCM Insider Weekly Digest</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Your personalised picks this week — ${matches.length} ${matches.length === 1 ? 'opportunity' : 'opportunities'} matched to your criteria.</div>
  
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
              <h1 style="font-size:24px;font-weight:700;color:#ffffff;margin:0 0 6px;">Your Personalised Picks #${digestNumber}</h1>
              <p style="font-size:14px;color:#8b949e;margin:0;">${dateStr} — Hey ${firstName}, we found ${matches.length} ${matches.length === 1 ? 'opportunity' : 'opportunities'} matching your criteria.</p>
            </td>
          </tr>
          
          <!-- Matched Listings -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 24px;">
              <div style="font-size:10px;font-weight:600;color:#c9a227;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">🎯 Matched to Your Preferences</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${listingsHtml}
              </table>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px;">
              <div style="height:1px;background:rgba(255,255,255,0.06);"></div>
            </td>
          </tr>
          
          <!-- Update preferences link -->
          <tr>
            <td style="background-color:#161b22;padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,162,39,0.04);border:1px solid rgba(201,162,39,0.1);border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:13px;color:#8b949e;line-height:1.5;">Not seeing what you need? <a href="https://fcmreport.com/insider#signup-form" style="color:#c9a227;text-decoration:underline;">Update your preferences</a> to refine your matches. You also get <strong style="color:#c9a227;">15% off</strong> all FCM services as an Insider.</div>
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
                    <div style="font-size:13px;color:#8b949e;line-height:1.5;">Spot a listing you like? Order an Insight Report (£199) before visiting. Buyers who arrive with verified intelligence negotiate 10-15% better on average.</div>
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


function buildNudgeEmail({ firstName, dateStr, digestNumber }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Set Up Your Personalised Alerts</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Set up your preferences to start receiving personalised listing matches.</div>
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <tr><td style="height:3px;background:linear-gradient(90deg, #0d1117, #c9a227, #d4b84a, #c9a227, #0d1117);"></td></tr>
          
          <tr>
            <td style="background-color:#0B1D3A;padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td><div style="font-size:11px;font-weight:700;color:#c9a227;text-transform:uppercase;letter-spacing:3px;">FCM Intelligence</div></td>
                  <td style="text-align:right;"><span style="font-size:10px;color:rgba(201,162,39,0.5);background:rgba(201,162,39,0.08);border:1px solid rgba(201,162,39,0.15);padding:3px 10px;border-radius:12px;">⭐ INSIDER</span></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color:#161b22;padding:40px 32px;text-align:center;">
              <div style="font-size:48px;margin-bottom:16px;">🎯</div>
              <h1 style="font-size:24px;font-weight:700;color:#c9a227;margin:0 0 12px;">You're Missing Out, ${firstName}!</h1>
              <p style="font-size:15px;color:#8b949e;line-height:1.6;margin:0 0 24px;">You haven't set up your personalised alerts yet. Right now, other Insiders are getting listings matched to their exact criteria every Monday. You could be too.</p>
              <p style="font-size:14px;color:#e6edf3;line-height:1.6;margin:0 0 24px;">Tell us your budget, preferred regions, and what you're looking for — takes 2 minutes. Then we'll automatically match you with the right opportunities.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg, #c9a227, #d4b84a);border-radius:8px;padding:16px 36px;">
                    <a href="https://fcmreport.com/insider#signup-form" style="font-size:16px;font-weight:700;color:#0B1D3A;text-decoration:none;">Set Up My Alerts →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B1D3A;border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;text-align:center;">
                    <div style="font-size:13px;color:#8b949e;line-height:1.5;">In the meantime, you can still <a href="https://fcmreport.com/opportunities" style="color:#c9a227;text-decoration:underline;">browse all opportunities</a> on our site.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
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


function buildNoMatchesEmail({ firstName, dateStr, digestNumber }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FCM Insider Weekly Update</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">No new matches this week — but we're still scanning for you.</div>
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <tr><td style="height:3px;background:linear-gradient(90deg, #0d1117, #c9a227, #d4b84a, #c9a227, #0d1117);"></td></tr>
          
          <tr>
            <td style="background-color:#0B1D3A;padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td><div style="font-size:11px;font-weight:700;color:#c9a227;text-transform:uppercase;letter-spacing:3px;">FCM Intelligence</div></td>
                  <td style="text-align:right;"><span style="font-size:10px;color:rgba(201,162,39,0.5);background:rgba(201,162,39,0.08);border:1px solid rgba(201,162,39,0.15);padding:3px 10px;border-radius:12px;">⭐ INSIDER</span></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color:#161b22;padding:32px 32px 20px;">
              <h1 style="font-size:24px;font-weight:700;color:#ffffff;margin:0 0 6px;">Weekly Update #${digestNumber}</h1>
              <p style="font-size:14px;color:#8b949e;margin:0;">${dateStr}</p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B1D3A;border-radius:10px;border:1px solid rgba(201,162,39,0.1);">
                <tr>
                  <td style="padding:24px 20px;text-align:center;">
                    <div style="font-size:15px;color:#e6edf3;margin-bottom:12px;">Hey ${firstName} — no new listings matched your criteria this week.</div>
                    <div style="font-size:14px;color:#8b949e;line-height:1.6;">We're scanning daily and will send your personalised matches as soon as the right opportunities appear. Good things are worth waiting for.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;text-align:center;">
              <p style="font-size:13px;color:#8b949e;margin:0 0 16px;">Want to see more matches? Try <a href="https://fcmreport.com/insider#signup-form" style="color:#c9a227;text-decoration:underline;">broadening your preferences</a>.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="border:1px solid rgba(201,162,39,0.3);border-radius:8px;padding:12px 28px;">
                    <a href="https://fcmreport.com/opportunities" style="font-size:14px;font-weight:600;color:#c9a227;text-decoration:none;">Browse All Opportunities →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
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


// ─── Helpers ───

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatPrice(value) {
  if (!value) return '?';
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return String(value);
}
