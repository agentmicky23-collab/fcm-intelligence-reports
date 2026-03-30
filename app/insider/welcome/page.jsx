'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function WelcomeContent() {
  const searchParams = useSearchParams();
  const tier = searchParams?.get('tier') || 'standard';
  const isPro = tier === 'pro';

  return (
    <div style={{
      minHeight: '100vh', background: '#010409',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 500 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
          Welcome to FCM Insider{isPro ? ' Pro' : ''}!
        </h1>
        <p style={{ fontSize: 16, color: '#8b949e', marginBottom: 24, lineHeight: 1.6 }}>
          Your preferences are saved and we&apos;re already matching listings to your criteria.
        </p>
        <p style={{ fontSize: 14, color: '#8b949e', marginBottom: 32, lineHeight: 1.6 }}>
          You&apos;ll receive your first personalised digest within the next 7 days.
          {isPro ? ' Your Pro Dashboard is ready — sign in with your email to access it.' : ' In the meantime, explore what\'s available.'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/opportunities" style={{
            padding: '12px 24px', borderRadius: 10, background: '#D4AF37', color: '#000',
            fontWeight: 600, textDecoration: 'none', fontSize: 15,
          }}>
            Browse Listings
          </a>
          {isPro && (
            <a href="/pro" style={{
              padding: '12px 24px', borderRadius: 10, border: '1px solid #D4AF37',
              color: '#D4AF37', textDecoration: 'none', fontSize: 15, fontWeight: 600,
            }}>
              Open Pro Dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InsiderWelcomePage() {
  return (
    <Suspense fallback={<div style={{ background: '#010409', minHeight: '100vh' }} />}>
      <WelcomeContent />
    </Suspense>
  );
}
