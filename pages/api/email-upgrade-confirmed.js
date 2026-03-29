// pages/api/email-upgrade-confirmed.js
// Triggered by Stripe webhook when upgrade payment (£300) completes
// Tells customer their 5 new sections are unlocked

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
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId required' });

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const reportUrl = `https://fcmreport.com/report/${orderId}`;

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upgrade Complete — FCM Intelligence</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Your report has been upgraded to Intelligence. 5 new sections are now unlocked.</div>
  
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
            <td style="background-color:#161b22;padding:40px 32px 24px;text-align:center;">
              <div style="font-size:48px;margin-bottom:16px;">🔓</div>
              <h1 style="font-size:28px;font-weight:700;color:#c9a227;margin:0 0 8px;">Upgrade Complete</h1>
              <p style="font-size:15px;color:#8b949e;margin:0;">Your report for <strong style="color:#e6edf3;">${order.business_name}</strong> is now Intelligence tier.</p>
            </td>
          </tr>
          
          <!-- Unlocked sections -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <div style="font-size:10px;font-weight:600;color:#c9a227;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">5 New Sections Unlocked</div>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 14px;background:#0B1D3A;border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:24px;vertical-align:middle;"><span style="color:#c9a227;font-size:16px;">🔓</span></td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="font-size:14px;font-weight:600;color:#e6edf3;">Financial Analysis</span>
                          <span style="font-size:12px;color:#8b949e;display:block;">Revenue breakdown, profit margins, financial health</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;background:#0B1D3A;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:24px;vertical-align:middle;"><span style="color:#c9a227;font-size:16px;">🔓</span></td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="font-size:14px;font-weight:600;color:#e6edf3;">Staffing &amp; Costs</span>
                          <span style="font-size:12px;color:#8b949e;display:block;">Wage analysis, staffing requirements, cost optimisation</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;background:#0B1D3A;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:24px;vertical-align:middle;"><span style="color:#c9a227;font-size:16px;">🔓</span></td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="font-size:14px;font-weight:600;color:#e6edf3;">Future Outlook</span>
                          <span style="font-size:12px;color:#8b949e;display:block;">5-year projections, planning applications, market trajectory</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;background:#0B1D3A;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:24px;vertical-align:middle;"><span style="color:#c9a227;font-size:16px;">🔓</span></td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="font-size:14px;font-weight:600;color:#e6edf3;">Profit Improvement Plan</span>
                          <span style="font-size:12px;color:#8b949e;display:block;">Evidence-based actions with projected ROI figures</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;background:#0B1D3A;border-radius:0 0 8px 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:24px;vertical-align:middle;"><span style="color:#c9a227;font-size:16px;">🔓</span></td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="font-size:14px;font-weight:600;color:#e6edf3;">Due Diligence Pack</span>
                          <span style="font-size:12px;color:#8b949e;display:block;">Questions to ask, documents to request, negotiation strategy</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Consultation call -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,162,39,0.06);border:1px solid rgba(201,162,39,0.15);border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:14px;color:#c9a227;font-weight:600;margin-bottom:4px;">📞 60-Minute Consultation Included</div>
                    <div style="font-size:13px;color:#8b949e;">We'll be in touch within 24 hours to schedule your consultation call. Have your report open — we'll walk through every finding together.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg, #c9a227, #d4b84a);border-radius:8px;padding:14px 32px;">
                    <a href="${reportUrl}" style="font-size:15px;font-weight:700;color:#0B1D3A;text-decoration:none;">View Your Full Report →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#0B1D3A;padding:24px 32px;border-top:1px solid rgba(201,162,39,0.15);">
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
        to: [order.customer_email],
        subject: `Upgrade Complete — Intelligence Report for ${order.business_name}`,
        html: htmlBody,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend error:', result);
      return res.status(500).json({ error: 'Failed to send email', details: result });
    }

    return res.status(200).json({ success: true, emailId: result.id });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: err.message });
  }
}
