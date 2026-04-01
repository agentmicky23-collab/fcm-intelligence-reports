import type { Metadata } from "next";
import { ProductSchemaInsight, ProductSchemaIntelligence } from "@/components/StructuredData";
import ReportsClient from "./ReportsClient";

export const metadata: Metadata = {
  title: 'Retail Business Intelligence Reports — Insight £199 · Intelligence £499',
  description:
    'Comprehensive due diligence reports for retail business acquisitions. 10-section Insight report or 15-section Intelligence report with consultation call. Crime, competition, demographics, financials — all verified.',
  alternates: {
    canonical: 'https://fcmreport.com/reports',
  },
  openGraph: {
    title: 'Retail Business Intelligence Reports — Insight & Intelligence Tiers',
    description:
      'Comprehensive due diligence reports for retail business acquisitions. Crime, competition, demographics, financial analysis — all verified.',
    url: 'https://fcmreport.com/reports',
  },
};

function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an FCM Intelligence report?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FCM Intelligence reports are scored due diligence analyses covering 10-15 sections including crime, competition, demographics, financials, and risk assessment. Each section receives a grade (A-F) based on verified data from public sources."
        }
      },
      {
        "@type": "Question",
        "name": "How long does a report take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Reports are delivered within 48 hours of order placement. Intelligence tier reports (with consultation) may take slightly longer to schedule the call."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between Insight and Intelligence?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Insight (£199) includes 10 core sections covering location, crime, competition, and demographics. Intelligence (£499) includes all 15 sections plus financial analysis, profit improvements, negotiation strategy, and a 60-minute consultation call."
        }
      },
      {
        "@type": "Question",
        "name": "Can I upgrade from Insight to Intelligence?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. If you've purchased an Insight report, you can upgrade to Intelligence for £300 (the difference between tiers). No new research is needed — we expand your existing report with the Intelligence-only sections."
        }
      },
      {
        "@type": "Question",
        "name": "What businesses do you cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We specialize in Post Offices, convenience stores, forecourts, and other retail businesses across the UK. Our reports are tailored for acquisition due diligence."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ReportsPage() {
  return (
    <>
      <ProductSchemaInsight />
      <ProductSchemaIntelligence />
      <FAQSchema />
      <ReportsClient />
    </>
  );
}
