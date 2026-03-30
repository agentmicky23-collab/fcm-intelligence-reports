// pages/api/write-report.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // API key auth
  const authHeader = req.headers['x-api-key'] || req.headers['authorization'];
  if (authHeader !== process.env.FCM_PIPELINE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { orderId, reportJson, customerEmail, tier } = req.body;

  if (!orderId || !reportJson || !customerEmail || !tier) {
    return res.status(400).json({ error: 'Missing required fields: orderId, reportJson, customerEmail, tier' });
  }

  try {
    // Upsert report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .upsert({
        order_id: orderId,
        report_json: reportJson,
        customer_email: customerEmail.toLowerCase(),
        tier: tier,
        status: 'approved',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'order_id' })
      .select()
      .single();

    if (reportError) throw reportError;

    // Update order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (orderError) throw orderError;

    // Insert notification
    try {
      await supabase.from('notifications').insert({
        type: 'report_ready',
        message: `✅ Report ready: ${orderId} (${tier})`,
        data: { orderId, tier },
        read: false,
      });
    } catch (e) {
      // Don't fail if notification fails
    }

    return res.status(200).json({
      success: true,
      reportId: report.id,
      reportUrl: `https://fcmreport.com/report/${orderId}`,
    });
  } catch (err) {
    console.error('Error writing report:', err);
    return res.status(500).json({ error: 'Failed to write report', detail: err.message });
  }
}
