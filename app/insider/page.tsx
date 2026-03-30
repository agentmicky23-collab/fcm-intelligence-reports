import type { Metadata } from "next";
import InsiderClient from "./InsiderClient";

export const metadata: Metadata = {
  title: 'FCM Insider — Retail Business Buyer Membership from £15/month',
  description:
    'Get weekly retail business listing alerts, hand-picked recommendations, dashboard access, and priority support. Standard £15/mo or Pro £50/mo. Cancel anytime.',
  alternates: {
    canonical: 'https://fcmreport.com/insider',
  },
  openGraph: {
    title: 'FCM Insider — Retail Business Buyer Membership',
    description:
      'Weekly listing alerts, hand-picked recommendations, and 15% off services. £15/month, cancel anytime.',
    url: 'https://fcmreport.com/insider',
  },
};

export default function InsiderPage() {
  return <InsiderClient />;
}
