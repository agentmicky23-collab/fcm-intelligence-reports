import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FCM Intelligence — Reports & Listings",
  description: "Post Office business listings and due diligence reports. 35+ live opportunities with expert analysis.",
  openGraph: {
    title: "FCM Intelligence — Reports & Listings",
    description: "Post Office business listings and due diligence reports. 35+ live opportunities with expert analysis.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FCM Intelligence — Reports & Listings",
    description: "Post Office business listings and due diligence reports.",
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
