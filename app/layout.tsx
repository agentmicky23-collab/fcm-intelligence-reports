import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import { CookieConsent } from "@/components/cookie-consent";
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://fcmreport.com'),
  title: {
    template: '%s | FCM Intelligence',
    default: 'Post Office Due Diligence Reports & Listings | FCM Intelligence',
  },
  description:
    'Data-driven intelligence reports for Post Office business acquisitions. 35+ live opportunities with verified due diligence. From £199.',
  keywords: [
    'post office for sale',
    'buy a post office',
    'post office due diligence',
    'post office business report',
    'post office acquisition',
    'post office listings UK',
    'buy post office branch',
    'post office business intelligence',
    'FCM Intelligence',
    'post office investment',
  ],
  authors: [{ name: 'FCM Intelligence', url: 'https://fcmreport.com' }],
  creator: 'FCM Intelligence',
  publisher: 'Firstclass Managerial Ltd',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://fcmreport.com',
    siteName: 'FCM Intelligence',
    title: 'Post Office Due Diligence Reports & Listings | FCM Intelligence',
    description:
      'Data-driven intelligence reports for Post Office business acquisitions. 35+ live opportunities. 15 years industry experience.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FCM Intelligence — Post Office Due Diligence Reports',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Post Office Due Diligence Reports & Listings | FCM Intelligence',
    description:
      'Data-driven intelligence reports for Post Office acquisitions. 35+ live opportunities with verified due diligence.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://fcmreport.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <OrganizationSchema />
        <WebsiteSchema />
        <SessionProvider>{children}</SessionProvider>
        <FeedbackButton />
        <CookieConsent />
      </body>
    </html>
  );
}
