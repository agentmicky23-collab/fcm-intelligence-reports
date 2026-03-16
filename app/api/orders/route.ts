import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const ORDERS_PATH = '/Users/mickagent/.openclaw/reports/orders';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    
    const entries = await readdir(ORDERS_PATH, { withFileTypes: true });
    const orderDirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('temp'));
    
    const orders = [];
    
    for (const dir of orderDirs) {
      try {
        const orderPath = join(ORDERS_PATH, dir.name, 'order.json');
        const orderData = await readFile(orderPath, 'utf-8');
        const order = JSON.parse(orderData);
        
        if (!status || order.status === status) {
          orders.push(order);
        }
      } catch (e) {
        // Skip invalid orders
      }
    }
    
    // Sort by created date, newest first
    orders.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    
    return NextResponse.json({ orders, count: orders.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list orders' }, { status: 500 });
  }
}
