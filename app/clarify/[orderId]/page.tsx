import { Metadata } from 'next';
import ClarifyClient from './ClarifyClient';

export const metadata: Metadata = {
  title: 'Help Us Complete Your Report',
  description: 'Answer a few questions to improve the accuracy of your FCM Intelligence report.',
  robots: { index: false, follow: false },
};

export default function ClarifyPage() {
  return <ClarifyClient />;
}
