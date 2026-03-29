/**
 * FCM Intelligence — Mid-Week Match Alert Email
 * Sent when a new pick scores 85+ for a subscriber (max 1 per week)
 * Concierge tone: urgent but not pushy, "we spotted this just now"
 */

const BRAND = {
  dark: '#0d1117',
  gold: '#c9a227',
  navy: '#0B1D3A',
  white: '#ffffff',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  cardBg: '#161b22',
  border: '#30363d',
};

function buildAlertEmail({ subscriber, match, pick, siteUrl }) {
  siteUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com';
  const name = (subscriber.name || '').split(' ')[0] || 'there';
  const score = match.match_score || 0;
  const personalisedNote = match.personalised_note || '';

  const clickUrl = `${siteUrl}/api/insider-click?sid=${subscriber.id}&mid=${match.id}&url=${encodeURIComponent(pick.source_url || siteUrl + '/opportunities')}`;
  const thumbsUpUrl = `${siteUrl}/api/insider-feedback?sid=${subscriber.id}&mid=${match.id}&vote=up`;
  const thumbsDownUrl = `${siteUrl}/api/insider-feedback?sid=${subscriber.id}&mid=${match.id}&vote=down`;

  const subject = `${name}, something just came up that looks right for you`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FCM Insider Alert</title>
</head>
<body style="margin: 0; padding: 0; background: ${BRAND.dark}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: ${BRAND.dark};">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; text-align: center;">
              <span style="color: ${BRAND.gold}; font-size: 20px; font-weight: 800; letter-spacing: 1.5px;">FCM</span>
              <span style="color: ${BRAND.white}; font-size: 20px; font-weight: 300; letter-spacing: 0.5px;"> INTELLIGENCE</span>
            </td>
          </tr>

          <!-- Alert badge -->
          <tr>
            <td style="padding: 0 32px 8px 32px; text-align: center;">
              <span style="display: inline-block; background: #22c55e20; border: 1px solid #22c55e40; border-radius: 16px; padding: 4px 14px; color: #22c55e; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;">
                ⚡ MID-WEEK ALERT · ${score}% MATCH
              </span>
            </td>
          </tr>

          <!-- Main copy -->
          <tr>
            <td style="padding: 16px 32px 8px 32px;">
              <h1 style="color: ${BRAND.white}; font-size: 22px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.3;">
                Hi ${name}, we've just spotted something
              </h1>
              <p style="color: ${BRAND.textPrimary}; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                A new listing has come in that's a strong fit based on your preferences. We didn't want to wait until Monday to tell you about it.
              </p>
            </td>
          </tr>

          <!-- Business card -->
          <tr>
            <td style="padding: 0 32px 16px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: ${BRAND.cardBg}; border: 1px solid ${BRAND.gold}40; border-radius: 8px;">
                <tr>
                  <td style="padding: 24px;">
                    <!-- Business name -->
                    <a href="${clickUrl}" style="color: ${BRAND.white}; font-size: 20px; font-weight: 700; text-decoration: none; line-height: 1.3;">
                      ${pick.business_name || 'Business Opportunity'}
                    </a>

                    <p style="color: ${BRAND.textSecondary}; font-size: 14px; margin: 8px 0 0 0;">
                      ${pick.location || ''}${pick.location && pick.price_label ? ' · ' : ''}${pick.price_label || (pick.price ? `£${Number(pick.price).toLocaleString('en-GB')}` : 'Price on request')}
                    </p>

                    ${personalisedNote ? `
                    <p style="color: ${BRAND.textPrimary}; font-size: 14px; margin: 16px 0 0 0; line-height: 1.5; font-style: italic; border-left: 3px solid ${BRAND.gold}; padding-left: 12px;">
                      "${personalisedNote}"
                    </p>` : ''}

                    ${match.match_reasons && match.match_reasons.length > 0 ? `
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 14px;">
                      <tr>
                        ${match.match_reasons.slice(0, 3).map(r => `
                        <td style="padding-right: 8px;">
                          <span style="background: ${BRAND.navy}; border-radius: 4px; padding: 3px 8px; color: ${BRAND.textSecondary}; font-size: 11px;">✓ ${r}</span>
                        </td>`).join('')}
                      </tr>
                    </table>` : ''}

                    <!-- CTA + Feedback -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;" width="100%">
                      <tr>
                        <td>
                          <a href="${clickUrl}" style="display: inline-block; background: ${BRAND.gold}; color: ${BRAND.dark}; font-size: 14px; font-weight: 700; text-decoration: none; padding: 10px 22px; border-radius: 6px;">
                            View this listing →
                          </a>
                        </td>
                        <td align="right">
                          <a href="${thumbsUpUrl}" style="text-decoration: none; font-size: 20px; padding: 4px 6px;" title="Good match">👍</a>
                          <a href="${thumbsDownUrl}" style="text-decoration: none; font-size: 20px; padding: 4px 6px;" title="Not for me">👎</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reassurance -->
          <tr>
            <td style="padding: 8px 32px 32px 32px; text-align: center;">
              <p style="color: ${BRAND.textSecondary}; font-size: 13px; margin: 0; line-height: 1.5;">
                You'll still receive your regular weekly digest on Monday. We only send mid-week alerts for especially strong matches.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; text-align: center; border-top: 1px solid ${BRAND.border};">
              <p style="color: ${BRAND.textSecondary}; font-size: 12px; margin: 0 0 8px 0;">
                FCM Intelligence — Retail business acquisition research
              </p>
              <p style="color: ${BRAND.textSecondary}; font-size: 12px; margin: 0;">
                <a href="{{{unsubscribe_url}}}" style="color: ${BRAND.gold}; text-decoration: underline;">Manage subscription</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

module.exports = { buildAlertEmail };
