import InsightsClient from "./InsightsClient";

export const metadata = {
  title: 'Insights — FCM Intelligence',
  description: 'Analysis for people buying Post Office branches',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function InsightsPage() {
  return <InsightsClient />;
}

