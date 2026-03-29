import type { Metadata } from "next";
import { ProductSchemaInsight, ProductSchemaIntelligence } from "@/components/StructuredData";
import ReportsClient from "./ReportsClient";

export const metadata: Metadata = {
  title: 'Post Office Intelligence Reports — Insight £199 · Intelligence £499',
  description:
    'Comprehensive due diligence reports for Post Office acquisitions. 10-section Insight report or 15-section Intelligence report with consultation call. Crime, competition, demographics, financials — all verified.',
  alternates: {
    canonical: 'https://fcmreport.com/reports',
  },
  openGraph: {
    title: 'Post Office Intelligence Reports — Insight & Intelligence Tiers',
    description:
      'Comprehensive due diligence reports for Post Office acquisitions. Crime, competition, demographics, financial analysis — all verified.',
    url: 'https://fcmreport.com/reports',
  },
};

export default function ReportsPage() {
  return (
    <>
      <ProductSchemaInsight />
      <ProductSchemaIntelligence />
      <ReportsClient />
    </>
  );
}
