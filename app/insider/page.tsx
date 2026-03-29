import type { Metadata } from "next";
import InsiderClient from "./InsiderClient";

export const metadata: Metadata = {
  title: 'FCM Insider — £15/month Retail Business Buyer Membership',
  description:
    'Get weekly retail business listing alerts, hand-picked recommendations, 15% off consultation services, and priority support. Cancel anytime. Join 50+ serious buyers.',
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
