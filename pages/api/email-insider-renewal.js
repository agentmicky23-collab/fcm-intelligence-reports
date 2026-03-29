// pages/api/email-insider-renewal.js
// Triggered by Stripe webhook: invoice.payment_succeeded (for recurring)
// or manually 3 days before renewal

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, renewalDate, type } = req.body;
    // type: 'renewal_success' | 'renewal_reminder'
    if (!email) return res.status(400).json({ error: 'email required' });

    const firstName = name ? name.split(' ')[0] : 'there';
    const formattedDate = renewalDate || 'your next billing date';

    let subject, htmlBody;

    if (type === 'renewal_reminder') {
      subject = `Your FCM Insider membership renews on ${formattedDate}`;
      htmlBody = buildRenewalReminder({ firstName, formattedDate });
    } else {
      subject = `Payment received — FCM Insider renewed`;
      htmlBody = buildRenewalSuccess({ firstName, formattedDate });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FCM Intelligence <reports@fcmreport.com>',
        to: [email],
        subject,
        html: htmlBody,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to send', details: result });
    }

    return res.status(200).json({ success: true, emailId: result.id });
  } catch (err) {
    console.error('Renewal email error:', err);
    return res.status(500).json({ error: err.message });
  }
}

function buildRenewalReminder({ firstName, formattedDate }) {
  return wrapEmail({
    preheader: `Your FCM Insider membership renews on ${formattedDate}. No action needed.`,
    emoji: '🔔',
    headline: 'Renewal Reminder',
    headlineColor: '#e6edf3',
    body: `
      <p style="font-size:15px;color:#8b949e;line-height:1.6;margin:0 0 20px;">
        Hey ${firstName} — your FCM Insider membership (£15/month) renews on 
        <strong style="color:#e6edf3;">${formattedDate}</strong>. No action needed — your card will be charged automatically.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B1D3A;border-radius:10px;border:1px solid rgba(255,255,255,0.06);margin-bottom:20px;">
        <tr>
          <td style="padding:16px 20px;">
            <div style="font-size:10px;font-weight:600;color:#8b949e;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Your Insider Benefits</div>
            <div style="font-size:13px;color:#8b949e;line-height:1.8;">
              ⭐ Hand-picked Insider Picks<br>
              📧 Weekly listing alerts<br>
              🎓 15% off all consultation services<br>
              🎯 Priority support (24hr response)
            </div>
          </td>
        </tr>
      </table>
      <p style="font-size:13px;color:#484f58;margin:0;">
        Want to cancel? You can do so anytime — your access continues until the end of your current period. Just reply to this email.
      </p>`,
    ctaText: 'Browse This Week\'s Listings',
    ctaUrl: 'https://fcmreport.com/opportunities',
  });
}

function buildRenewalSuccess({ firstName, formattedDate }) {
  return wrapEmail({
    preheader: 'Your FCM Insider membership has been renewed. Thanks for staying.',
    emoji: '✅',
    headline: 'Membership Renewed',
    headlineColor: '#22c55e',
    body: `
      <p style="font-size:15px;color:#8b949e;line-height:1.6;margin:0 0 16px;">
        Hey ${firstName} — your FCM Insider membership has been renewed. £15 has been charged to your card.
      </p>
      <p style="font-size:14px;color:#8b949e;margin:0;">
        Your next renewal: <strong style="color:#e6edf3;">${formattedDate}</strong>
      </p>`,
    ctaText: 'Browse Opportunities',
    ctaUrl: 'https://fcmreport.com/opportunities',
  });
}

function wrapEmail({ preheader, emoji, headline, headlineColor, body, ctaText, ctaUrl }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headline} — FCM Intelligence</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr><td style="height:3px;background:linear-gradient(90deg, #0d1117, #c9a227, #d4b84a, #c9a227, #0d1117);"></td></tr>
          <tr>
            <td style="background-color:#0B1D3A;padding:28px 32px;text-align:center;">
              <div style="font-size:11px;font-weight:700;color:#c9a227;text-transform:uppercase;letter-spacing:3px;">FCM Intelligence</div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#161b22;padding:32px 32px 16px;text-align:center;">
              <div style="font-size:40px;margin-bottom:12px;">${emoji}</div>
              <h1 style="font-size:24px;font-weight:700;color:${headlineColor};margin:0;">${headline}</h1>
            </td>
          </tr>
          <tr>
            <td style="background-color:#161b22;padding:0 32px 28px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="background-color:#161b22;padding:0 32px 36px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg, #c9a227, #d4b84a);border-radius:8px;padding:12px 28px;">
                    <a href="${ctaUrl}" style="font-size:14px;font-weight:700;color:#0B1D3A;text-decoration:none;">${ctaText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0B1D3A;padding:20px 32px;border-top:1px solid rgba(201,162,39,0.15);">
              <p style="font-size:11px;color:#484f58;line-height:1.5;margin:0;text-align:center;">
                Firstclass Managerial Ltd trading as FCM Intelligence<br>
                <a href="https://fcmreport.com" style="color:#c9a227;text-decoration:none;">fcmreport.com</a>
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
