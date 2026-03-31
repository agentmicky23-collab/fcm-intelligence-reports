import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { signClarificationToken } from '@/lib/clarification-jwt';
import { fcmEmailWrapper, goldButton } from '@/lib/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const apiKey = req.headers.get('x-api-key');
    if (apiKey !== process.env.FCM_PIPELINE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, questions } = body;

    if (!orderId || !questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, questions (non-empty array)' },
        { status: 400 }
      );
    }

    // Fetch order from Supabase to get customer email and business name
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('customer_email, business_name, order_id')
      .eq('order_id', orderId)
      .single();

    if (fetchError || !order) {
      console.error('Order fetch error:', fetchError);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const customerEmail = order.customer_email;
    const businessName = order.business_name || 'your business';

    // Generate JWT (48h expiry)
    const token = signClarificationToken({ orderId, email: customerEmail });

    // Save questions to order
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        clarification_questions: questions,
        clarification_sent_at: new Date().toISOString(),
      })
      .eq('order_id', orderId);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json({ error: 'Failed to save questions' }, { status: 500 });
    }

    // Build clarification URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com';
    const clarifyUrl = `${siteUrl}/clarify/${orderId}?token=${token}`;

    // Build email
    const questionsHtml = questions
      .map(
        (q: string, i: number) =>
          `<tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
            <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#8b949e;margin-right:8px;">${i + 1}.</span>
            <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#e6edf3;">${q}</span>
          </td></tr>`
      )
      .join('');

    const emailHtml = fcmEmailWrapper({
      preheader: `A few questions about your ${businessName} report`,
      content: `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:32px 32px 16px;">
              <h1 style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:#e6edf3;margin:0 0 8px;">Help us complete your report</h1>
              <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#8b949e;line-height:1.6;margin:0;">
                Your report for <strong style="color:#c9a227;">${businessName}</strong> is being prepared. To ensure maximum accuracy, we have a few questions:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(11,29,58,0.4);border:1px solid rgba(201,162,39,0.15);border-radius:8px;padding:8px 16px;">
                ${questionsHtml}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 32px;text-align:center;">
              ${goldButton('Answer Questions →', clarifyUrl)}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#484f58;line-height:1.5;margin:0;text-align:center;">
                No worries if you can't answer these — your report will be delivered within 48 hours either way.
              </p>
            </td>
          </tr>
        </table>`,
      footerExtra: '',
    });

    // Send email via Resend (wrapped in try/catch to never break pipeline)
    try {
      const emailFrom = process.env.EMAIL_FROM || 'FCM Intelligence <reports@fcmreport.com>';
      await resend.emails.send({
        from: emailFrom,
        to: customerEmail,
        subject: `A few questions about your ${businessName} report`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Email send error (non-fatal):', emailError);
      // Don't fail the pipeline — questions are saved, customer can still be contacted
      return NextResponse.json({
        success: true,
        warning: 'Questions saved but email failed to send',
      });
    }

    return NextResponse.json({ success: true, clarifyUrl });
  } catch (error) {
    console.error('Send-clarification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
