// pages/api/trigger-report.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'Missing orderId' });
  }

  try {
    // Update order status to 'queued'
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'queued',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .eq('status', 'received')
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Order not found or already processing' });
    }

    return res.status(200).json({
      success: true,
      orderId,
      status: 'queued',
      message: 'Pipeline will start within 2 minutes',
    });
  } catch (err) {
    console.error('Error triggering report:', err);
    return res.status(500).json({ error: 'Failed to trigger report', detail: err.message });
  }
}
