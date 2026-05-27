import type { Metadata } from "next";
import OpportunitiesClient from "./OpportunitiesClient";
import { getActiveOpportunityCount, formatCountString } from "@/lib/live-count";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const count = await getActiveOpportunityCount();
  const countPhrase = formatCountString(count) ?? "Hundreds of";
  const titlePhrase = formatCountString(count) ?? "Hundreds of";
  const title = `Retail Businesses For Sale — ${titlePhrase} Live Opportunities`;
  const description = `Browse ${countPhrase} verified retail businesses for sale across the UK. Daily-updated listings from Daltons, RightBiz, and BusinessesForSale. Prices from £50,000 to £500,000+.`;
  const ogTitle = `${titlePhrase} Retail Businesses For Sale — FCM Intelligence`;

  return {
    title,
    description,
    alternates: { canonical: "https://fcmreport.com/opportunities" },
    openGraph: {
      title: ogTitle,
      description: "Browse verified retail businesses for sale across the UK. Daily-updated from Daltons, RightBiz, and BusinessesForSale.",
      url: "https://fcmreport.com/opportunities",
    },
  };
}

export default function OpportunitiesPage() {
  return <OpportunitiesClient />;
}
