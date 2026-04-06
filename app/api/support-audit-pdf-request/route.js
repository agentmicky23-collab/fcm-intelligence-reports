/**
 * POST /api/support-audit-pdf-request
 *
 * Stores PDF requests when users bounce at the policy-check interstitial.
 * Triggers immediate PDF send + schedules 7-day follow-up.
 *
 * Deploy to: app/api/support-audit-pdf-request/route.js
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, branch_name } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // LAYER 2: Server-side duplicate check (10-second window)
    const { data: existingRequest, error: checkError } = await supabase
      .from('support_audit_pdf_requests')
      .select('id')
      .eq('email', normalizedEmail)
      .gte('created_at', new Date(Date.now() - 10000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Duplicate check error:', checkError);
    }

    if (existingRequest) {
      console.log('Duplicate PDF request detected within 10s, returning existing ID:', existingRequest.id);
      return NextResponse.json({ success: true, id: existingRequest.id, duplicate: true });
    }

    // Insert PDF request
    const { data, error } = await supabase
      .from('support_audit_pdf_requests')
      .insert({
        email: normalizedEmail,
        branch_name: branch_name || null,
        pdf_sent_at: null, // Will be updated when PDF email sends
        follow_up_sent_at: null,
        converted_to_submission: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Database insert failed' },
        { status: 500 }
      );
    }

    console.log('PDF request stored:', data.id);
    console.log('Email send skipped in hidden mode');

    // TODO: Trigger immediate PDF email
    // TODO: Schedule 7-day follow-up email
    // This will be wired separately via Resend or existing email infrastructure

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('PDF request error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
