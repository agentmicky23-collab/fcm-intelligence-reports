// pages/api/email-insider-welcome.js
// Triggered by Stripe webhook when Insider subscription starts
// Welcomes new member and explains what they get

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    const firstName = name ? name.split(' ')[0] : 'there';

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to FCM Insider</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">You're in. FCM Insider picks, weekly alerts, and 15% off all services — starting now.</div>
  
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
              <div style="font-size:48px;margin-bottom:16px;">⭐</div>
              <h1 style="font-size:28px;font-weight:700;color:#c9a227;margin:0 0 8px;">Welcome to FCM Insider</h1>
              <p style="font-size:15px;color:#8b949e;margin:0;">Hey ${firstName} — you've just joined the smartest buyers in the market.</p>
            </td>
          </tr>
          
          <!-- What you get -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <div style="font-size:10px;font-weight:600;color:#c9a227;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Your Membership Includes</div>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:14px 16px;background:#0B1D3A;border-radius:10px 10px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;"><span style="font-size:20px;">⭐</span></td>
                        <td style="padding-left:12px;">
                          <div style="font-size:15px;font-weight:600;color:#e6edf3;margin-bottom:4px;">FCM Insider Picks</div>
                          <div style="font-size:13px;color:#8b949e;line-height:1.5;">Our hand-selected recommended listings — the ones we'd buy ourselves. You see them before anyone else.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;background:#0B1D3A;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;"><span style="font-size:20px;">📧</span></td>
                        <td style="padding-left:12px;">
                          <div style="font-size:15px;font-weight:600;color:#e6edf3;margin-bottom:4px;">Weekly Listing Alerts</div>
                          <div style="font-size:13px;color:#8b949e;line-height:1.5;">Every new opportunity matching your criteria, delivered to your inbox every Monday.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;background:#0B1D3A;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;"><span style="font-size:20px;">🎓</span></td>
                        <td style="padding-left:12px;">
                          <div style="font-size:15px;font-weight:600;color:#c9a227;margin-bottom:4px;">15% Off All Services</div>
                          <div style="font-size:13px;color:#8b949e;line-height:1.5;">Business plans, interview prep, operator training, advisory — your Insider discount applies automatically.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;background:#0B1D3A;border-radius:0 0 10px 10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;"><span style="font-size:20px;">🎯</span></td>
                        <td style="padding-left:12px;">
                          <div style="font-size:15px;font-weight:600;color:#e6edf3;margin-bottom:4px;">Priority Support</div>
                          <div style="font-size:13px;color:#8b949e;line-height:1.5;">Your questions answered within 24 hours. Jump the queue.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- First step -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,162,39,0.06);border:1px solid rgba(201,162,39,0.15);border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:14px;color:#c9a227;font-weight:600;margin-bottom:4px;">🚀 Your First Step</div>
                    <div style="font-size:13px;color:#8b949e;line-height:1.5;">Browse our 35+ live opportunities — and if one catches your eye, order a report. As an Insider, you'll have the context to spot the real gems before other buyers even know they exist.</div>
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
                    <a href="https://fcmreport.com/opportunities" style="font-size:15px;font-weight:700;color:#0B1D3A;text-decoration:none;">Browse Opportunities →</a>
                  </td>
                </tr>
              </table>
              <p style="font-size:12px;color:#484f58;margin:16px 0 0;">Your first weekly digest arrives next Monday.</p>
            </td>
          </tr>
          
          <!-- Membership details -->
          <tr>
            <td style="background-color:#161b22;padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B1D3A;border-radius:10px;border:1px solid rgba(255,255,255,0.06);">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:10px;font-weight:600;color:#8b949e;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">Membership Details</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;"><span style="font-size:13px;color:#8b949e;">Plan</span></td>
                        <td style="padding:4px 0;text-align:right;"><span style="font-size:13px;color:#e6edf3;font-weight:600;">FCM Insider — £15/month</span></td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;"><span style="font-size:13px;color:#8b949e;">Billing</span></td>
                        <td style="padding:4px 0;text-align:right;"><span style="font-size:13px;color:#e6edf3;">Monthly, cancel anytime</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#0B1D3A;padding:24px 32px;border-top:1px solid rgba(201,162,39,0.15);">
              <p style="font-size:12px;color:#8b949e;margin:0 0 8px;text-align:center;">Questions? Just reply to this email.</p>
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
        subject: `Welcome to FCM Insider ⭐`,
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
