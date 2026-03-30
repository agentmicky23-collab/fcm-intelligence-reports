// pages/api/email-order-confirmed.js
// Triggered by Stripe webhook after checkout.session.completed
// Sends immediate confirmation that order is received and report is in progress

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

    // Fetch order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const tierLabel = order.report_tier === 'intelligence' ? 'Intelligence' : 'Insight';
    const sectionCount = order.report_tier === 'intelligence' ? '15' : '10';
    const price = order.report_tier === 'intelligence' ? '£499' : '£199';
    const includesCall = order.report_tier === 'intelligence';

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed — FCM Intelligence</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Your ${tierLabel} Report for ${order.business_name} is now being prepared. Delivery within 48 hours.</div>
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Gold top line -->
          <tr><td style="height:3px;background:linear-gradient(90deg, #0d1117, #c9a227, #d4b84a, #c9a227, #0d1117);"></td></tr>
          
          <!-- Header -->
          <tr>
            <td style="background-color:#0B1D3A;padding:28px 32px;text-align:center;">
              <div style="font-size:11px;font-weight:700;color:#c9a227;text-transform:uppercase;letter-spacing:3px;">FCM Intelligence</div>
            </td>
          </tr>
          
          <!-- Hero -->
          <tr>
            <td style="background-color:#161b22;padding:40px 32px 24px;text-align:center;">
              <div style="font-size:48px;margin-bottom:16px;">✅</div>
              <h1 style="font-size:28px;font-weight:700;color:#ffffff;margin:0 0 8px;">Order Confirmed</h1>
              <p style="font-size:15px;color:#8b949e;margin:0;">Your report is now being prepared by our team.</p>
            </td>
          </tr>
          
          <!-- Order details card -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B1D3A;border-radius:12px;border:1px solid rgba(201,162,39,0.15);">
                <tr>
                  <td style="padding:20px 24px;">
                    <div style="font-size:10px;font-weight:600;color:#c9a227;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Order Details</div>
                    
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <span style="font-size:13px;color:#8b949e;">Order Reference</span>
                        </td>
                        <td style="padding:8px 0;text-align:right;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <span style="font-size:13px;color:#e6edf3;font-weight:600;font-family:monospace;">${orderId}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <span style="font-size:13px;color:#8b949e;">Business</span>
                        </td>
                        <td style="padding:8px 0;text-align:right;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <span style="font-size:13px;color:#e6edf3;font-weight:600;">${order.business_name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <span style="font-size:13px;color:#8b949e;">Report Tier</span>
                        </td>
                        <td style="padding:8px 0;text-align:right;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <span style="font-size:13px;color:#c9a227;font-weight:600;">${tierLabel} Report (${sectionCount} sections)</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="font-size:13px;color:#8b949e;">Amount Paid</span>
                        </td>
                        <td style="padding:8px 0;text-align:right;">
                          <span style="font-size:13px;color:#e6edf3;font-weight:600;">${price}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- What happens next -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <div style="font-size:10px;font-weight:600;color:#c9a227;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">What Happens Next</div>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:12px 0;vertical-align:top;width:40px;">
                    <div style="width:28px;height:28px;border-radius:50%;background:rgba(201,162,39,0.1);border:1px solid rgba(201,162,39,0.2);text-align:center;line-height:28px;font-size:13px;color:#c9a227;font-weight:700;">1</div>
                  </td>
                  <td style="padding:12px 0 12px 12px;vertical-align:top;">
                    <div style="font-size:14px;font-weight:600;color:#e6edf3;margin-bottom:2px;">Research &amp; Analysis</div>
                    <div style="font-size:13px;color:#8b949e;">Our team is now researching ${order.business_name} across ${sectionCount} categories.</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;vertical-align:top;width:40px;">
                    <div style="width:28px;height:28px;border-radius:50%;background:rgba(201,162,39,0.1);border:1px solid rgba(201,162,39,0.2);text-align:center;line-height:28px;font-size:13px;color:#c9a227;font-weight:700;">2</div>
                  </td>
                  <td style="padding:12px 0 12px 12px;vertical-align:top;">
                    <div style="font-size:14px;font-weight:600;color:#e6edf3;margin-bottom:2px;">Quality Review</div>
                    <div style="font-size:13px;color:#8b949e;">Every finding is verified and cross-referenced before delivery.</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;vertical-align:top;width:40px;">
                    <div style="width:28px;height:28px;border-radius:50%;background:rgba(201,162,39,0.1);border:1px solid rgba(201,162,39,0.2);text-align:center;line-height:28px;font-size:13px;color:#c9a227;font-weight:700;">3</div>
                  </td>
                  <td style="padding:12px 0 12px 12px;vertical-align:top;">
                    <div style="font-size:14px;font-weight:600;color:#e6edf3;margin-bottom:2px;">Delivery Within 48 Hours</div>
                    <div style="font-size:13px;color:#8b949e;">You'll receive an email with a link to your interactive report.${includesCall ? ' We\'ll also arrange your 60-minute consultation call.' : ''}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          ${order.report_tier === 'insight' ? `
          <!-- Upgrade nudge -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,162,39,0.06);border:1px solid rgba(201,162,39,0.12);border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:14px;color:#c9a227;font-weight:600;margin-bottom:4px;">💡 Want the full picture?</div>
                    <div style="font-size:13px;color:#8b949e;">Upgrade to Intelligence for £300 anytime — adds financial analysis, due diligence pack, profit improvement plan, and a 60-minute consultation call.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}
          
          <!-- CTA -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg, #c9a227, #d4b84a);border-radius:8px;padding:14px 32px;">
                    <a href="https://fcmreport.com/opportunities" style="font-size:15px;font-weight:700;color:#0B1D3A;text-decoration:none;">Browse More Opportunities</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#0B1D3A;padding:24px 32px;border-top:1px solid rgba(201,162,39,0.15);">
              <p style="font-size:12px;color:#8b949e;margin:0 0 8px;text-align:center;">You can access all your reports anytime at <a href="https://fcmreport.com/my-reports" style="color:#c9a227;text-decoration:none;">fcmreport.com/my-reports</a></p>
              <p style="font-size:12px;color:#8b949e;margin:0 0 8px;text-align:center;">Questions about your order? Reply to this email.</p>
              <p style="font-size:11px;color:#484f58;line-height:1.5;margin:0;text-align:center;">
                Firstclass Managerial Ltd trading as FCM Intelligence<br>
                <a href="https://fcmreport.com" style="color:#c9a227;text-decoration:none;">fcmreport.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Gold bottom line -->
          <tr><td style="height:3px;background:linear-gradient(90deg, #0d1117, #c9a227, #d4b84a, #c9a227, #0d1117);"></td></tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Send via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FCM Intelligence <reports@fcmreport.com>',
        to: [order.customer_email],
        subject: `Order Confirmed — ${tierLabel} Report for ${order.business_name}`,
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
