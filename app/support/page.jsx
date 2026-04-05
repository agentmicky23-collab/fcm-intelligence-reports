import SupportClient from "./SupportClient";

export const metadata = {
  title: 'FCM Support — Tools and Research for Working Postmasters | FCM Intelligence',
  description:
    'Free tools and research for working Postmasters. Insurance audit, policy analysis, and market intelligence — built by operators who understand the real risks.',
  alternates: {
    canonical: 'https://fcmreport.com/support',
  },
  openGraph: {
    title: 'FCM Support — Tools for Working Postmasters',
    description:
      'Free tools and research for working Postmasters. Insurance audit, policy analysis, and market intelligence.',
    url: 'https://fcmreport.com/support',
  },
};

export default function SupportPage() {
  return <SupportClient />;
}
