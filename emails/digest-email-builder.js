/**
 * FCM Intelligence — Weekly Insider Digest Email Builder
 * Concierge tone: warm, personal, "we're watching for you"
 *
 * Usage: buildDigestEmail({ subscriber, matches, weekLabel })
 * Returns: { subject, html }
 */

const BRAND = {
  dark: '#0d1117',
  gold: '#c9a227',
  navy: '#0B1D3A',
  white: '#ffffff',
  lightGrey: '#f4f4f5',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  cardBg: '#161b22',
  border: '#30363d',
};

function greetingForName(name) {
  const first = (name || '').split(' ')[0];
  return first || 'there';
}

function scoreLabel(score) {
  if (score >= 85) return 'Strong match';
  if (score >= 70) return 'Good fit';
  if (score >= 50) return 'Worth a look';
  return 'On your radar';
}

function scoreBadgeColour(score) {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return BRAND.gold;
  if (score >= 50) return '#60a5fa';
  return BRAND.textSecondary;
}

function formatPrice(price) {
  if (!price && price !== 0) return 'Price on request';
  return `£${Number(price).toLocaleString('en-GB')}`;
}

function buildMatchCard(match, subscriberId, siteUrl) {
  const pick = match.pick || match;
  const score = match.match_score || 0;
  const badgeColour = scoreBadgeColour(score);
  const label = scoreLabel(score);
  const personalisedNote = match.personalised_note || '';

  // Click-tracked link
  const clickUrl = `${siteUrl}/api/insider-click?sid=${subscriberId}&mid=${match.id}&url=${encodeURIComponent(pick.source_url || siteUrl + '/opportunities')}`;

  // Feedback URLs (thumbs up/down) — Item 3 adds the API route
  const thumbsUpUrl = `${siteUrl}/api/insider-feedback?sid=${subscriberId}&mid=${match.id}&vote=up`;
  const thumbsDownUrl = `${siteUrl}/api/insider-feedback?sid=${subscriberId}&mid=${match.id}&vote=down`;

  return `
    <tr>
      <td style="padding: 0 0 16px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: ${BRAND.cardBg}; border: 1px solid ${BRAND.border}; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 20px 24px;">
              <!-- Score badge -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                <tr>
                  <td style="background: ${badgeColour}20; border: 1px solid ${badgeColour}40; border-radius: 12px; padding: 3px 10px;">
                    <span style="color: ${badgeColour}; font-size: 12px; font-weight: 600; letter-spacing: 0.3px;">${label} — ${score}%</span>
                  </td>
                  ${pick.pick_badge ? `
                  <td style="padding-left: 8px;">
                    <span style="background: ${BRAND.gold}20; border: 1px solid ${BRAND.gold}40; border-radius: 12px; padding: 3px 10px; color: ${BRAND.gold}; font-size: 12px; font-weight: 600;">★ ${pick.pick_badge}</span>
                  </td>` : ''}
                </tr>
              </table>

              <!-- Business name -->
              <a href="${clickUrl}" style="color: ${BRAND.white}; font-size: 18px; font-weight: 700; text-decoration: none; line-height: 1.3;">
                ${pick.business_name || 'Business Opportunity'}
              </a>

              <!-- Location & price -->
              <p style="color: ${BRAND.textSecondary}; font-size: 14px; margin: 6px 0 0 0; line-height: 1.4;">
                ${pick.location || ''}${pick.location && pick.price_label ? ' · ' : ''}${pick.price_label || formatPrice(pick.price)}
              </p>

              <!-- Personalised note (concierge voice) -->
              ${personalisedNote ? `
              <p style="color: ${BRAND.textPrimary}; font-size: 14px; margin: 14px 0 0 0; line-height: 1.5; font-style: italic; border-left: 3px solid ${BRAND.gold}; padding-left: 12px;">
                "${personalisedNote}"
              </p>` : ''}

              <!-- Match reasons -->
              ${match.match_reasons && match.match_reasons.length > 0 ? `
              <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 12px;">
                <tr>
                  ${match.match_reasons.slice(0, 3).map(reason => `
                  <td style="padding-right: 8px; padding-bottom: 4px;">
                    <span style="background: ${BRAND.navy}; border-radius: 4px; padding: 3px 8px; color: ${BRAND.textSecondary}; font-size: 11px;">✓ ${reason}</span>
                  </td>`).join('')}
                </tr>
              </table>` : ''}

              <!-- CTA + Feedback -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px;" width="100%">
                <tr>
                  <td>
                    <a href="${clickUrl}" style="display: inline-block; background: ${BRAND.gold}; color: ${BRAND.dark}; font-size: 13px; font-weight: 700; text-decoration: none; padding: 8px 18px; border-radius: 6px;">
                      View details →
                    </a>
                  </td>
                  <td align="right" style="white-space: nowrap;">
                    <a href="${thumbsUpUrl}" style="text-decoration: none; font-size: 18px; padding: 4px 6px;" title="This is a good match">👍</a>
                    <a href="${thumbsDownUrl}" style="text-decoration: none; font-size: 18px; padding: 4px 6px;" title="Not what I'm looking for">👎</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function buildNudgeEmail({ subscriber, siteUrl }) {
  const name = greetingForName(subscriber.name);
  const prefsUrl = `${siteUrl}/insider#preferences`;

  return {
    subject: `Your personalised matches are waiting, ${name}`,
    html: wrapInLayout(`
      <tr>
        <td style="padding: 40px 32px; text-align: center;">
          <p style="color: ${BRAND.gold}; font-size: 14px; font-weight: 600; letter-spacing: 1px; margin: 0 0 16px 0;">INSIDER</p>
          <h1 style="color: ${BRAND.white}; font-size: 24px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3;">
            We're ready to start looking for you
          </h1>
          <p style="color: ${BRAND.textPrimary}; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
            Hi ${name}, we noticed you haven't set your preferences yet. Once you tell us what you're looking for — budget, region, business type — we'll start matching you with opportunities that fit.
          </p>
          <p style="color: ${BRAND.textSecondary}; font-size: 14px; line-height: 1.5; margin: 0 0 28px 0;">
            It takes about 60 seconds, and you'll start receiving personalised picks in your next weekly digest.
          </p>
          <a href="${prefsUrl}" style="display: inline-block; background: ${BRAND.gold}; color: ${BRAND.dark}; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 6px;">
            Set my preferences →
          </a>
        </td>
      </tr>
    `),
  };
}

function wrapInLayout(bodyContent) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FCM Insider Digest</title>
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

          <!-- Body -->
          ${bodyContent}

          <!-- Footer -->
          <tr>
            <td style="padding: 32px; text-align: center; border-top: 1px solid ${BRAND.border};">
              <p style="color: ${BRAND.textSecondary}; font-size: 12px; margin: 0 0 8px 0;">
                FCM Intelligence — Retail business acquisition research
              </p>
              <p style="color: ${BRAND.textSecondary}; font-size: 12px; margin: 0;">
                You're receiving this as an FCM Insider subscriber.
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
}

/**
 * Build the weekly digest email
 * @param {Object} params
 * @param {Object} params.subscriber - insider_subscribers row
 * @param {Array}  params.matches - insider_matches rows with joined pick data
 * @param {string} params.weekLabel - e.g. "29 March 2026"
 * @param {string} [params.siteUrl] - defaults to NEXT_PUBLIC_SITE_URL
 * @returns {{ subject: string, html: string }}
 */
function buildDigestEmail({ subscriber, matches, weekLabel, siteUrl }) {
  siteUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://fcmreport.com';
  const name = greetingForName(subscriber.name);

  // No preferences → nudge email
  if (!subscriber.onboarding_complete) {
    return buildNudgeEmail({ subscriber, siteUrl });
  }

  // No matches this week
  if (!matches || matches.length === 0) {
    return {
      subject: `Your weekly check-in — ${weekLabel}`,
      html: wrapInLayout(`
        <tr>
          <td style="padding: 40px 32px;">
            <p style="color: ${BRAND.gold}; font-size: 13px; font-weight: 600; letter-spacing: 1px; margin: 0 0 16px 0;">WEEKLY DIGEST · ${weekLabel.toUpperCase()}</p>
            <h1 style="color: ${BRAND.white}; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3;">
              Hi ${name}, nothing quite right this week
            </h1>
            <p style="color: ${BRAND.textPrimary}; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
              We've been through this week's new listings and none of them were a strong enough fit to put in front of you. We'd rather send you nothing than waste your time.
            </p>
            <p style="color: ${BRAND.textPrimary}; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
              We're still watching daily. As soon as something lands that matches what you're looking for, you'll be the first to know.
            </p>
            <a href="${siteUrl}/opportunities" style="display: inline-block; background: ${BRAND.gold}; color: ${BRAND.dark}; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 22px; border-radius: 6px;">
              Browse all listings →
            </a>
          </td>
        </tr>
      `),
    };
  }

  // Build match cards
  const topMatch = matches[0];
  const matchCards = matches.map(m => buildMatchCard(m, subscriber.id, siteUrl)).join('');

  const subject = topMatch.match_score >= 85
    ? `${name}, we've spotted something strong for you`
    : `Your weekly picks — ${weekLabel}`;

  return {
    subject,
    html: wrapInLayout(`
      <tr>
        <td style="padding: 32px 32px 8px 32px;">
          <p style="color: ${BRAND.gold}; font-size: 13px; font-weight: 600; letter-spacing: 1px; margin: 0 0 16px 0;">WEEKLY DIGEST · ${weekLabel.toUpperCase()}</p>
          <h1 style="color: ${BRAND.white}; font-size: 22px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.3;">
            Hi ${name}, here's what we've found for you this week
          </h1>
          <p style="color: ${BRAND.textPrimary}; font-size: 15px; line-height: 1.6; margin: 0 0 8px 0;">
            We've been watching the market and picked out ${matches.length === 1 ? 'one listing that caught our eye' : `${matches.length} listings that look like they could be a fit`} based on what you've told us you're looking for.
          </p>
        </td>
      </tr>

      <!-- Match cards -->
      <tr>
        <td style="padding: 16px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${matchCards}
          </table>
        </td>
      </tr>

      <!-- Feedback nudge -->
      <tr>
        <td style="padding: 8px 32px 24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: ${BRAND.navy}; border-radius: 8px;">
            <tr>
              <td style="padding: 16px 20px;">
                <p style="color: ${BRAND.textPrimary}; font-size: 13px; margin: 0; line-height: 1.5;">
                  <strong style="color: ${BRAND.gold};">Help us help you:</strong> Use the 👍 👎 buttons on each listing to tell us what's on track. Your feedback sharpens your matches every week.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Consultation CTA -->
      <tr>
        <td style="padding: 8px 32px 32px 32px; text-align: center;">
          <p style="color: ${BRAND.textSecondary}; font-size: 14px; margin: 0 0 12px 0;">
            Thinking about making a move? As an Insider, you get 15% off our consultation services.
          </p>
          <a href="${siteUrl}/insider#consultation" style="color: ${BRAND.gold}; font-size: 14px; font-weight: 600; text-decoration: underline;">
            Book a consultation →
          </a>
        </td>
      </tr>
    `),
  };
}

module.exports = { buildDigestEmail, buildNudgeEmail };
