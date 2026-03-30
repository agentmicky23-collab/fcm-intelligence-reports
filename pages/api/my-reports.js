// pages/api/my-reports.js
// Data endpoint — returns enriched report list for a verified email.
// Only exposes score/grade from metadata, NOT the full report JSON.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Get all orders for this email
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customer_email, business_name, report_tier, report_price, status, created_at, delivered_at')
      .eq('customer_email', normalizedEmail)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('[my-reports] Orders query error:', ordersError);
      throw ordersError;
    }

    const orderIds = (orders || []).map((o) => o.id);
    const reportData = {};

    if (orderIds.length > 0) {
      // Only select the fields we need — NOT the full report_json
      // We extract score/grade from report_json->metadata via Supabase JSON operators
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('order_id, tier, status, report_json')
        .in('order_id', orderIds);

      if (!reportsError && reports) {
        reports.forEach((r) => {
          // Extract only score + grade from metadata — never expose full JSON
          const meta = r.report_json?.metadata;
          reportData[r.order_id] = {
            report_status: r.status,
            report_tier: r.tier,
            overall_score: meta?.overall_score || null,
            overall_grade: meta?.overall_grade || null,
          };
        });
      }
    }

    // Merge order + report data (strip any raw report_json from response)
    const enriched = (orders || []).map((o) => ({
      id: o.id,
      customer_email: o.customer_email,
      business_name: o.business_name,
      report_tier: o.report_tier,
      report_price: o.report_price,
      status: o.status,
      created_at: o.created_at,
      delivered_at: o.delivered_at,
      ...(reportData[o.id] || {}),
    }));

    return res.status(200).json({ reports: enriched });
  } catch (err) {
    console.error('[my-reports] Error:', err);
    return res.status(500).json({ error: 'Failed to load reports' });
  }
}
