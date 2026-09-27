import { NextResponse, type NextRequest } from "next/server";

// ============================================================
// MAINTENANCE MODE
// The site is offline while it is rebuilt on fcmintelligence.com.
// Every route serves the holding page (or a 503 for APIs) except:
//  - existing customers' report links (/report/<id> + its API)
//  - Stripe webhooks, so subscription events are still recorded
//  - static assets those pages need
// Set MAINTENANCE_MODE to false (or delete this file) to restore the site.
// ============================================================
const MAINTENANCE_MODE = true;

const ALLOWED_PATHS: RegExp[] = [
  /^\/report\/[^/]+\/?$/,
  /^\/api\/report\/view\/?$/,
  /^\/api\/webhooks\/stripe\/?$/,
  /^\/api\/stripe-webhook\/?$/,
  /^\/_next\//,
  /^\/images\//,
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
];

const HOLDING_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>FCM Intelligence — Under Construction</title>
<style>
  :root { --bg: #0a0a0a; --fg: #f5f5f5; --muted: rgba(245,245,245,0.6); --gold: #C9A227; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    background: var(--bg); color: var(--fg);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
    display: flex; align-items: center; justify-content: center;
    padding: 24px; text-align: center; -webkit-font-smoothing: antialiased;
  }
  main { max-width: 520px; }
  .brand { color: var(--gold); font-weight: 700; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; }
  .rule { width: 48px; height: 2px; background: var(--gold); margin: 28px auto; }
  h1 { font-size: clamp(28px, 6vw, 40px); font-weight: 600; line-height: 1.2; }
  p { color: var(--muted); font-size: 16px; line-height: 1.6; margin-top: 16px; }
  a { color: var(--gold); text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
<main>
  <div class="brand">FCM Intelligence</div>
  <div class="rule"></div>
  <h1>Currently under construction</h1>
  <p>We'll be back soon.</p>
  <p>Existing customers can still open their reports using the link in their delivery email.</p>
</main>
</body>
</html>`;

export function proxy(request: NextRequest) {
  if (!MAINTENANCE_MODE) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (ALLOWED_PATHS.some((re) => re.test(pathname))) {
    return NextResponse.next();
  }

  const headers = { "Retry-After": "86400", "Cache-Control": "no-store" };

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Service temporarily unavailable — under construction." },
      { status: 503, headers }
    );
  }

  return new NextResponse(HOLDING_PAGE, {
    status: 503,
    headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
  });
}
