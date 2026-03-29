import type { Metadata } from "next";
import OpportunitiesClient from "./OpportunitiesClient";

export const metadata: Metadata = {
  title: 'Post Office Businesses For Sale — 35+ Live Opportunities',
  description:
    'Browse 35+ verified Post Office businesses for sale across the UK. Daily-updated listings from Daltons, RightBiz, and BusinessesForSale. Prices from £50,000 to £500,000+.',
  alternates: {
    canonical: 'https://fcmreport.com/opportunities',
  },
  openGraph: {
    title: '35+ Post Office Businesses For Sale — FCM Intelligence',
    description:
      'Browse verified Post Office businesses for sale across the UK. Daily-updated from Daltons, RightBiz, and BusinessesForSale.',
    url: 'https://fcmreport.com/opportunities',
  },
};

export default function OpportunitiesPage() {
  return <OpportunitiesClient />;
}
