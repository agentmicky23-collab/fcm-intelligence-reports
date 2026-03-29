// pages/api/send-report.js
// Sends report delivery email via Resend API
// Called when report status reaches 'delivered'

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ error: 'order_id required' });
  }

  try {
    // Fetch order and report from Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('order_id', order_id)
      .single();

    if (reportError || !report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Get overall score and grade from report JSON
    const reportJson = report.report_json;
    const overallScore = reportJson.sections?.s1_executive_summary?.overall_score || 'N/A';
    const overallGrade = reportJson.sections?.s1_executive_summary?.overall_grade || 'N/A';
    const verdict = reportJson.sections?.s1_executive_summary?.verdict || 'Analysis Complete';

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'FCM Intelligence <reports@fcmreport.com>',
      to: order.customer_email,
      subject: `Your ${order.tier === 'intelligence' ? 'Intelligence' : 'Insight'} Report is Ready`,
      html: generateEmailHtml({
        customerName: order.customer_name,
        businessName: order.business_name,
        orderId: order.id,
        tier: order.tier,
        overallScore,
        overallGrade,
        verdict,
      }),
    });

    if (emailError) {
      console.error('Failed to send email:', emailError);
      return res.status(500).json({ error: emailError.message });
    }

    console.log('Report email sent:', emailData.id);

    // Update order status
    await supabase
      .from('orders')
      .update({
        status: 'delivered',
        delivered_at: new Date().toISOString(),
      })
      .eq('id', order_id);

    // Log notification
    await supabase.from('notifications').insert({
      order_id,
      type: 'email_sent',
      message: `Report delivered to ${order.customer_email}`,
      metadata: { email_id: emailData.id },
    });

    res.json({ success: true, email_id: emailData.id });
  } catch (error) {
    console.error('Send report error:', error);
    res.status(500).json({ error: error.message });
  }
}

function generateEmailHtml({ customerName, businessName, orderId, tier, overallScore, overallGrade, verdict }) {
  const tierName = tier === 'intelligence' ? 'Intelligence' : 'Insight';
  const reportUrl = `https://fcmreport.com/report/${orderId}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your FCM ${tierName} Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Your Report is Ready</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hi ${customerName || 'there'},
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      Your <strong>FCM ${tierName} Report</strong> for <strong>${businessName}</strong> is now complete.
    </p>

    <div style="background: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <div style="margin-bottom: 12px;">
        <span style="color: #6b7280; font-size: 14px;">Overall Score:</span>
        <span style="font-size: 24px; font-weight: bold; color: #1e3a8a; margin-left: 10px;">${overallScore}/100</span>
        <span style="font-size: 20px; font-weight: bold; color: #3b82f6; margin-left: 10px;">(${overallGrade})</span>
      </div>
      <div>
        <span style="color: #6b7280; font-size: 14px;">Verdict:</span>
        <span style="font-weight: 600; color: #1e3a8a; margin-left: 10px;">${verdict}</span>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        View Your Report
      </a>
    </div>

    ${tier === 'insight' ? `
    <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 6px; margin: 30px 0;">
      <h3 style="margin-top: 0; color: #92400e; font-size: 18px;">🔓 Upgrade to Intelligence</h3>
      <p style="color: #92400e; margin-bottom: 15px;">
        Unlock 5 additional sections including financial analysis, profit improvement strategies, and a complete due diligence pack for just <strong>£300</strong>.
      </p>
      <a href="${reportUrl}" style="color: #92400e; font-weight: 600; text-decoration: underline;">
        Upgrade Now →
      </a>
    </div>
    ` : ''}

    <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
        <strong>What's included in your ${tierName} Report:</strong>
      </p>
      <ul style="font-size: 14px; color: #6b7280; line-height: 1.8;">
        ${tier === 'insight' ? `
        <li>Executive Summary with overall assessment</li>
        <li>Post Office remuneration breakdown</li>
        <li>Online presence audit</li>
        <li>Location intelligence & demographics</li>
        <li>Crime & safety analysis</li>
        <li>Competition mapping</li>
        <li>Footfall analysis</li>
        <li>Infrastructure assessment</li>
        <li>Risk assessment grid</li>
        <li><strong>Total: 10 detailed sections</strong></li>
        ` : `
        <li>All Insight sections PLUS:</li>
        <li>Financial analysis with benchmarking</li>
        <li>Staffing cost breakdown</li>
        <li>Future outlook & development pipeline</li>
        <li>Profit improvement action plan</li>
        <li>Complete due diligence pack with negotiation strategy</li>
        <li><strong>Total: 15 comprehensive sections</strong></li>
        `}
      </ul>
    </div>

    <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
      <p style="font-size: 14px; color: #6b7280;">
        Questions about your report? Reply to this email or contact us at 
        <a href="mailto:mikesh@interimenterprises.co.uk" style="color: #3b82f6;">mikesh@interimenterprises.co.uk</a>
      </p>
    </div>

  </div>

  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
    <p>© 2026 Firstclass Managerial Ltd trading as FCM Intelligence</p>
    <p>
      <a href="https://fcmreport.com" style="color: #3b82f6; text-decoration: none;">fcmreport.com</a>
    </p>
  </div>

</body>
</html>
  `;
}
