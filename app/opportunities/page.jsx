import OpportunitiesClient from "./OpportunitiesClient";

export const metadata = {
  title: "Opportunities — Post Offices & Retail Businesses For Sale | FCM Intelligence",
  description:
    "Browse every post office, convenience store, and forecourt for sale in the UK. Live listings from multiple brokers, updated daily. Prices from £50,000 to £500,000+.",
  alternates: {
    canonical: "https://fcmreport.com/opportunities",
  },
  openGraph: {
    title: "Opportunities — Retail Businesses For Sale | FCM Intelligence",
    description:
      "Every post office, convenience store, and forecourt for sale in the UK. Multiple brokers. One deck. Updated daily.",
    url: "https://fcmreport.com/opportunities",
  },
};

export default function OpportunitiesPage() {
  return <OpportunitiesClient />;
}