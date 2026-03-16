import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const ORDERS_PATH = '/Users/mickagent/.openclaw/reports/orders';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderPath = join(ORDERS_PATH, id, 'order.json');
    const orderData = await readFile(orderPath, 'utf-8');
    return NextResponse.json(JSON.parse(orderData));
  } catch (error) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const orderPath = join(ORDERS_PATH, id, 'order.json');
    
    const orderData = await readFile(orderPath, 'utf-8');
    const order = JSON.parse(orderData);
    
    // Update status
    if (updates.status) {
      order.status = updates.status;
      order.timeline[updates.status] = new Date().toISOString();
    }
    
    // Add notes
    if (updates.note) {
      order.notes.push({
        timestamp: new Date().toISOString(),
        message: updates.note,
      });
    }
    
    await writeFile(orderPath, JSON.stringify(order, null, 2));
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
