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

export default function ReportsPage() {
  return (
    <>
      <ProductSchemaInsight />
      <ProductSchemaIntelligence />
      <ReportsClient />
    </>
  );
}
