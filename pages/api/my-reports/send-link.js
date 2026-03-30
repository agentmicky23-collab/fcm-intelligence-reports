// pages/api/my-reports/send-link.js
// Sends a magic link email if orders exist for the given email.
// Always returns 200 to prevent email enumeration.

import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.FCM_PIPELINE_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!JWT_SECRET) {
    console.error('[my-reports/send-link] FCM_PIPELINE_SECRET not configured');
    return res.status(200).json({ sent: true });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Check if any orders exist for this email
    const { data: orders, error: dbError } = await supabase
      .from('orders')
      .select('id')
      .eq('customer_email', normalizedEmail)
      .limit(1);

    if (dbError) {
      console.error('[my-reports/send-link] DB error:', dbError);
      return res.status(200).json({ sent: true });
    }

    // Only send email if orders exist
    if (orders && orders.length > 0) {
      // Dynamic import jsonwebtoken (avoid bundling issues)
      const jwt = (await import('jsonwebtoken')).default;

      const token = jwt.sign(
        { email: normalizedEmail, purpose: 'my_reports' },
        JWT_SECRET,
        { expiresIn: '30m' }
      );

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com';
      const magicLink = `${siteUrl}/my-reports?token=${token}`;

      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'FCM Intelligence <reports@fcmreport.com>',
            to: normalizedEmail,
            subject: 'Access your FCM reports',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; background: #0d1117; color: #e6edf3; padding: 40px 32px; border-radius: 12px;">
                <div style="text-align: center;">
                  <div style="font-size: 12px; font-weight: 700; color: #D4AF37; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px;">FCM INTELLIGENCE</div>
                  <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px;">Access your reports</h1>
                  <p style="font-size: 14px; color: #8b949e; margin: 0 0 24px;">Click the button below to view all your reports. This link expires in 30 minutes.</p>
                  <a href="${magicLink}" style="display: inline-block; background: #D4AF37; color: #000; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin-bottom: 16px;">View my reports</a>
                  <p style="font-size: 12px; color: #57606a; margin-top: 16px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
              </div>
            `,
          }),
        });

        if (!emailRes.ok) {
          console.error('[my-reports/send-link] Resend error:', await emailRes.text());
        }
      } catch (emailErr) {
        console.error('[my-reports/send-link] Email send error:', emailErr);
      }
    }
  } catch (err) {
    console.error('[my-reports/send-link] Unexpected error:', err);
  }

  // Always return success to prevent email enumeration
  return res.status(200).json({ sent: true });
}
