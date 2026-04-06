/**
 * POST /api/support-audit-submit
 *
 * Stores completed insurance audit submissions to Supabase.
 * Called when user completes all 17 questions and submits email.
 *
 * Deploy to: app/api/support-audit-submit/route.js
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
    const {
      email,
      branch_name,
      fad_code,
      renewal_bucket,
      answers,
      cover_type,
      critical_count,
      important_count,
      worth_reviewing_count,
      warning_count,
    } = body;

    // Validate required fields
    if (!email || !renewal_bucket || !answers) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user agent for analytics
    const userAgent = request.headers.get('user-agent') || null;

    // Insert submission
    const { data, error } = await supabase
      .from('support_audit_submissions')
      .insert({
        email: email.toLowerCase().trim(),
        branch_name: branch_name || null,
        fad_code: fad_code || null,
        renewal_bucket,
        answers,
        cover_type: cover_type || null,
        critical_count: critical_count || 0,
        important_count: important_count || 0,
        worth_reviewing_count: worth_reviewing_count || 0,
        warning_count: warning_count || 0,
        user_agent: userAgent,
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

    console.log('Audit submission stored:', data.id);
    console.log('Email send skipped in hidden mode');

    // TODO: Trigger confirmation email with gap analysis findings
    // This will be wired separately via Resend or existing email infrastructure

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Audit submission error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
