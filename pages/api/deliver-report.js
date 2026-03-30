// pages/api/deliver-report.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers['x-api-key'] || req.headers['authorization'];
  if (authHeader !== process.env.FCM_PIPELINE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'Missing orderId' });
  }

  try {
    // Get order + report details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) throw new Error('Order not found');

    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('tier, status')
      .eq('order_id', orderId)
      .single();

    if (reportError || !report) throw new Error('Report not found');

    const reportUrl = `https://fcmreport.com/report/${orderId}`;
    const tierLabel = report.tier === 'intelligence' ? 'Intelligence' : 'Insight';

    // Send delivery email via Resend
    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'FCM Intelligence <reports@fcmreport.com>',
          to: order.customer_email,
          subject: `Your FCM ${tierLabel} Report is Ready — ${order.business_name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #e6edf3; padding: 40px 32px; border-radius: 12px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="font-size: 12px; font-weight: 700; color: #D4AF37; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">FCM INTELLIGENCE</div>
                <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">Your ${tierLabel} Report is Ready</h1>
                <p style="font-size: 15px; color: #8b949e; margin: 0;">${order.business_name}</p>
              </div>
              
              <div style="background: #161b22; border: 1px solid #1e2733; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
                <p style="font-size: 15px; color: #8b949e; margin: 0 0 16px;">Your report has been verified and is ready to view. Click below to access it.</p>
                <a href="${reportUrl}" style="display: inline-block; background: #D4AF37; color: #000; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 8px; text-decoration: none;">View Your Report →</a>
              </div>
              
              <div style="font-size: 13px; color: #6b7280; text-align: center; margin-bottom: 16px;">
                <p style="margin: 0 0 4px;">You'll need to verify your email address (${order.customer_email}) to access the report.</p>
                <p style="margin: 0;">Bookmark the link — you can access your report anytime.</p>
                <p style="margin: 8px 0 0;">You can also access all your reports at <a href="https://fcmreport.com/my-reports" style="color: #D4AF37; text-decoration: underline;">fcmreport.com/my-reports</a></p>
              </div>
              
              ${report.tier === 'insight' ? `
              <div style="background: #D4AF3710; border: 1px solid #D4AF3730; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 16px;">
                <p style="font-size: 14px; color: #D4AF37; font-weight: 600; margin: 0 0 4px;">Want the full picture?</p>
                <p style="font-size: 13px; color: #8b949e; margin: 0 0 8px;">Upgrade to Intelligence for £300 — unlock financial analysis, profit improvement, negotiation strategy, and a 60-minute consultation call.</p>
                <a href="${reportUrl}?upgrade=true" style="color: #D4AF37; font-weight: 600; text-decoration: underline;">Upgrade now →</a>
              </div>
              ` : ''}
              
              <div style="border-top: 1px solid #1e2733; padding-top: 16px; text-align: center;">
                <p style="font-size: 11px; color: #6b7280; margin: 0;">This report is for informational purposes only. Always consult qualified professionals before making acquisition decisions.</p>
                <p style="font-size: 11px; color: #6b7280; margin: 4px 0 0;">© 2026 FCM Intelligence — Firstclass Managerial Ltd</p>
              </div>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Email send failed:', await emailResponse.text());
      }
    } catch (emailErr) {
      console.error('Email error:', emailErr);
      // Don't fail delivery just because email failed
    }

    // Update statuses
    await supabase.from('orders').update({
      status: 'delivered',
      delivered_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', orderId);

    await supabase.from('reports').update({
      status: 'delivered',
      updated_at: new Date().toISOString(),
    }).eq('order_id', orderId);

    // Notification
    try {
      await supabase.from('notifications').insert({
        type: 'report_delivered',
        message: `📧 Report delivered: ${orderId} to ${order.customer_email}`,
        data: { orderId, email: order.customer_email },
        read: false,
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      delivered: true,
      reportUrl,
      email: order.customer_email,
    });
  } catch (err) {
    console.error('Error delivering report:', err);
    return res.status(500).json({ error: 'Failed to deliver report', detail: err.message });
  }
}
