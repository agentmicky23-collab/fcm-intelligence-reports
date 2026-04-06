import SupportClient from "./SupportClient";

export const metadata = {
  title: 'FCM Support',
  description: 'Tools and research for working Postmasters',
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

export default function SupportPage() {
  return <SupportClient />;
}
