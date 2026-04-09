import { Fraunces } from 'next/font/google';
import CalculatorClient from './CalculatorClient';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata = {
  title: 'Post Office Remuneration 2026/27 — What Actually Changed | FCM Intelligence',
  description: 'The Post Office rewrote every transaction rate on 30 March 2026. Here\'s what changed and what it means if you\'re buying or running a branch.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function RemunerationCalculatorPage() {
  return (
    <div className={fraunces.variable}>
      <CalculatorClient />
    </div>
  );
}
