import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { orderId, order } = await req.json();
    
    // Log for now - the main agent will handle Discord notifications
    console.log('='.repeat(50));
    console.log('NEW ORDER RECEIVED');
    console.log('='.repeat(50));
    console.log(`Order ID: ${orderId}`);
    console.log(`Tier: ${order.report.tier} (£${order.report.price})`);
    console.log(`Business: ${order.business.name}`);
    console.log(`Location: ${order.business.postcode}, ${order.business.town}`);
    console.log(`Customer: ${order.customer.email}`);
    console.log('='.repeat(50));
    
    // Write to a notification file that the main agent can monitor
    const fs = await import('fs/promises');
    const notificationPath = '/Users/mickagent/.openclaw/reports/notifications.jsonl';
    
    const notification = {
      type: 'new_order',
      orderId,
      timestamp: new Date().toISOString(),
      summary: `New ${order.report.tier} report order (£${order.report.price}) for ${order.business.name} from ${order.customer.email}`,
      order,
    };
    
    await fs.appendFile(notificationPath, JSON.stringify(notification) + '\n');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
  }
}
