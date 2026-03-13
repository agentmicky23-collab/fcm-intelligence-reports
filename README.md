# FCM Intelligence — Reports & Listings

Post Office business opportunity listings and due diligence reports, split from the main [FCM Intelligence](https://fcm-intelligence-nextjs.vercel.app) site.

## What's Here

- **35 live Post Office listings** with filtering by region, business type, and FCM Insider picks
- **Individual listing detail pages** with financial breakdowns and expert analysis
- **Report pricing** — 4 tiers (Location £99, Basic £149, Professional £249, Premium £449)
- **Individual report detail pages** with features, delivery info, and purchase CTAs

## Tech Stack

- **Next.js 16** (App Router, static generation)
- **TypeScript** + **Tailwind CSS**
- **Inter** + **JetBrains Mono** fonts
- FCM brand dark theme (black/gold/red)

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # Production build
```

## Deployment

Deployed to Vercel. Connected to `agentmicky23-collab/fcm-intelligence-reports`.

## Architecture

This site is the **listings/reports split** from the main FCM Intelligence site:
- **Main site** (`fcm-intelligence-nextjs`): Consultancy, brand, services, blog, Inter-Mission
- **This site** (`fcm-intelligence-reports`): Listings, reports, due diligence pricing

Contact and consultation links point back to the main FCM Intelligence site.
