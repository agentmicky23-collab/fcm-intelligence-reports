import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getActiveOpportunityCount, formatCountString } from "@/lib/live-count";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const count = await getActiveOpportunityCount();
  const countPhrase = formatCountString(count) ?? "hundreds of";
  const description = `Buy a retail business smarter. Data-driven intelligence reports from £199, plus ${countPhrase} verified live opportunities. 15 years industry experience, 40 branches operated.`;
  const ogDescription = `Buy a retail business smarter. Data-driven intelligence reports from £199, plus ${countPhrase} verified live opportunities.`;

  return {
    title: "Retail Business Due Diligence Reports & Listings | FCM Intelligence",
    description,
    alternates: { canonical: "https://fcmreport.com" },
    openGraph: {
      title: "Retail Business Due Diligence Reports & Listings | FCM Intelligence",
      description: ogDescription,
      url: "https://fcmreport.com",
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
