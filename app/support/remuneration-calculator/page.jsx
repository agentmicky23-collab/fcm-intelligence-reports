import CalculatorClient from './CalculatorClient';

export const metadata = {
  title: 'Remuneration Calculator 2026/27 | FCM Intelligence',
  description: 'See what the 2026/27 Post Office rate changes mean for your branch',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function RemunerationCalculatorPage() {
  return <CalculatorClient />;
}
