// pages/api/email-insider-cancelled.js
// Triggered by Stripe webhook: customer.subscription.deleted
// Confirms cancellation and reminds them access continues until period end

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
    const { email, name, accessUntil, subscriptionId } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    const firstName = name ? name.split(' ')[0] : 'there';
    const formattedDate = accessUntil || 'the end of your billing period';

    // Update subscriber status in Supabase
    if (subscriptionId) {
      await supabase
        .from('insider_subscribers')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId);
    }

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Membership Cancelled — FCM Intelligence</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Your FCM Insider membership has been cancelled. Access continues until ${formattedDate}.</div>
  
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
          
          <!-- Hero -->
          <tr>
            <td style="background-color:#161b22;padding:32px 32px 20px;text-align:center;">
              <h1 style="font-size:24px;font-weight:700;color:#e6edf3;margin:0 0 8px;">Membership Cancelled</h1>
              <p style="font-size:15px;color:#8b949e;margin:0;">Sorry to see you go, ${firstName}.</p>
            </td>
          </tr>
          
          <!-- Access continues notice -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:14px;color:#22c55e;font-weight:600;margin-bottom:4px;">Your access continues</div>
                    <div style="font-size:14px;color:#8b949e;line-height:1.5;">
                      You'll keep full Insider access until <strong style="color:#e6edf3;">${formattedDate}</strong>. 
                      After that, you'll still be able to browse our free listings and order reports — you just won't receive 
                      Insider Picks, weekly digests, or the 15% service discount.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- What you'll miss -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 24px;">
              <div style="font-size:10px;font-weight:600;color:#8b949e;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">What You'll Lose After ${formattedDate}</div>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 14px;background:#0B1D3A;border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:14px;color:#484f58;">⭐ Hand-picked Insider Picks — early access to the best deals</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;background:#0B1D3A;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:14px;color:#484f58;">📧 Weekly listing digest matched to your criteria</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;background:#0B1D3A;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:14px;color:#484f58;">🎓 15% discount on all consultation services</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;background:#0B1D3A;border-radius:0 0 8px 8px;">
                    <span style="font-size:14px;color:#484f58;">🎯 Priority support (24hr response time)</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Resubscribe CTA -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 16px;text-align:center;">
              <p style="font-size:14px;color:#8b949e;margin:0 0 16px;">Changed your mind? You can resubscribe anytime.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg, #c9a227, #d4b84a);border-radius:8px;padding:12px 28px;">
                    <a href="https://fcmreport.com/insider" style="font-size:14px;font-weight:700;color:#0B1D3A;text-decoration:none;">Resubscribe to Insider</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Still available -->
          <tr>
            <td style="background-color:#161b22;padding:16px 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,162,39,0.04);border:1px solid rgba(201,162,39,0.1);border-radius:10px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <div style="font-size:13px;color:#c9a227;font-weight:600;margin-bottom:4px;">Still available to you</div>
                    <div style="font-size:13px;color:#8b949e;line-height:1.5;">Free listing browsing, Insight Reports (£199), Intelligence Reports (£499), and all consultation services at standard pricing. We're here whenever you need us.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Feedback -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <p style="font-size:13px;color:#484f58;line-height:1.5;margin:0;text-align:center;">
                We'd love to know why you left — reply to this email and let us know. Your feedback helps us improve.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
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

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FCM Intelligence <reports@fcmreport.com>',
        to: [email],
        subject: `Your FCM Insider membership has been cancelled`,
        html: htmlBody,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to send', details: result });
    }

    return res.status(200).json({ success: true, emailId: result.id });
  } catch (err) {
    console.error('Cancellation email error:', err);
    return res.status(500).json({ error: err.message });
  }
}
