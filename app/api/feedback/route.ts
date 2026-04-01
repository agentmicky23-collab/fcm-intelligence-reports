import { NextRequest, NextResponse } from 'next/server';

const SENTIMENT_MAP: Record<string, { emoji: string; label: string }> = {
  positive: { emoji: '👍', label: 'Positive' },
  neutral: { emoji: '😐', label: 'Neutral' },
  negative: { emoji: '👎', label: 'Negative' },
};

async function sendFeedbackEmail(feedback: {
  sentiment: string;
  message: string;
  email?: string;
  page: string;
  timestamp: string;
}) {
  const { emoji, label } = SENTIMENT_MAP[feedback.sentiment] || { emoji: '❓', label: feedback.sentiment };
  const formattedTime = new Date(feedback.timestamp).toLocaleString('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'FCM Intelligence <reports@fcmreport.com>',
      to: ['info@fcmreport.com'],
      subject: `[FCM Feedback] ${emoji} ${label} - ${feedback.page}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0B1D3A; color: #ffffff; border-radius: 8px;">
          <h2 style="color: #BF9B51; margin-top: 0;">New Feedback Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #9CA3AF; width: 100px;">Sentiment</td>
              <td style="padding: 8px 0; font-size: 16px;">${emoji} ${label}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9CA3AF;">Page</td>
              <td style="padding: 8px 0;">${feedback.page}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9CA3AF;">Time</td>
              <td style="padding: 8px 0;">${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9CA3AF;">Email</td>
              <td style="padding: 8px 0;">${feedback.email || 'Not provided'}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: rgba(255,255,255,0.05); border-left: 3px solid #BF9B51; border-radius: 4px;">
            <p style="margin: 0; color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
            <p style="margin: 8px 0 0; font-size: 15px; line-height: 1.5;">"${feedback.message}"</p>
          </div>
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0 12px;" />
          <p style="margin: 0; font-size: 11px; color: #6B7280;">FCM Intelligence — Feedback System</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function POST(req: NextRequest) {
  try {
    const { sentiment, message, email, page } = await req.json();
    const timestamp = new Date().toISOString();

    console.log('Feedback received:', { sentiment, message, email, page, timestamp });

    // Send email notification (non-blocking — don't fail the response)
    sendFeedbackEmail({ sentiment, message, email, page, timestamp })
      .then(() => console.log('Feedback email sent successfully'))
      .catch((err) => console.error('Failed to send feedback email:', err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
