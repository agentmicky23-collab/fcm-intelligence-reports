import ProDashboardClient from './ProDashboardClient';

export const metadata = {
  title: 'Insider Pro Dashboard | FCM Intelligence',
  description: 'Your acquisition command centre. Intelligence before broker contact, not after it.',
  robots: 'noindex, nofollow',
};

export default function ProPage() {
  return <ProDashboardClient />;
}
