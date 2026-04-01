import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.FCM_PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('insider_picks')
      .select('business_name, source_platform, price, price_label, region, postcode, location, tenure, po_salary, annual_turnover, net_profit, pick_reason, pick_badge, source_url, status, created_at, updated_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Build CSV
    const headers = [
      'Business Name', 'Broker', 'Price', 'Price Label', 'Region', 'Postcode',
      'Location', 'Tenure', 'PO Salary', 'Annual Turnover', 'Net Profit',
      'Pick Reason', 'Pick Badge', 'Source URL', 'Status', 'Created At', 'Updated At'
    ];

    const escapeCSV = (val: any) => {
      if (val == null) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = (data || []).map(p => [
      p.business_name, p.source_platform, p.price, p.price_label, p.region,
      p.postcode, p.location, p.tenure, p.po_salary, p.annual_turnover,
      p.net_profit, p.pick_reason, p.pick_badge, p.source_url, p.status,
      p.created_at, p.updated_at,
    ].map(escapeCSV).join(','));

    const csv = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="fcm-listings-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (err: any) {
    console.error('Export listings error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
