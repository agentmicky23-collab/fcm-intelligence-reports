import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: 'Post Office Due Diligence Reports & Listings | FCM Intelligence',
  description:
    'Buy a Post Office smarter. Data-driven intelligence reports from £199, plus 35+ verified live opportunities. 15 years industry experience, 40 branches operated.',
  alternates: {
    canonical: 'https://fcmreport.com',
  },
  openGraph: {
    title: 'Post Office Due Diligence Reports & Listings | FCM Intelligence',
    description:
      'Buy a Post Office smarter. Data-driven intelligence reports from £199, plus 35+ verified live opportunities.',
    url: 'https://fcmreport.com',
  },
};

export default function Home() {
  return <HomeClient />;
}
