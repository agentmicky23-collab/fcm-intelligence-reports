import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal-page-layout";

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for FCM Intelligence.',
  alternates: { canonical: 'https://fcmreport.com/cookies' },
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="16 March 2026">
      <h2>What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help the site 
        function properly and can provide information about how the site is used.
      </p>

      <h2>Cookies We Use</h2>

      <h3>Essential Cookies (Always Active)</h3>
      <p>These are necessary for the website to function. You cannot opt out of these.</p>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Provider</th><th>Purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr><td>Session cookie</td><td>fcmreport.com</td><td>Keeps you logged in during your visit</td><td>Session</td></tr>
          <tr><td>Stripe cookies</td><td>stripe.com</td><td>Enables secure payment processing</td><td>Session</td></tr>
          <tr><td>Auth cookies</td><td>fcmreport.com</td><td>Manages FCM Insider login state</td><td>30 days</td></tr>
          <tr><td>CSRF token</td><td>fcmreport.com</td><td>Prevents cross-site request forgery</td><td>Session</td></tr>
        </tbody>
      </table>

      <h3>Analytics Cookies (Require Consent)</h3>
      <p>These help us understand how visitors use our website so we can improve it.</p>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Provider</th><th>Purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr><td>Vercel Analytics</td><td>vercel.com</td><td>Anonymous page view tracking</td><td>24 hours</td></tr>
        </tbody>
      </table>

      <p><strong>We do NOT use:</strong></p>
      <ul>
        <li>Google Analytics</li>
        <li>Facebook Pixel</li>
        <li>Any advertising or remarketing cookies</li>
        <li>Any third-party tracking for ad targeting</li>
      </ul>

      <h2>Your Choices</h2>
      <p>When you first visit our website, you will see a cookie consent banner. You can:</p>
      <ul>
        <li><strong>Accept all cookies</strong> — essential + analytics</li>
        <li><strong>Essential only</strong> — only cookies necessary for the site to function</li>
      </ul>
      <p>You can change your preferences at any time by clearing your browser cookies and revisiting the site.</p>

      <h2>How to Control Cookies in Your Browser</h2>
      <p>You can also control cookies through your browser settings:</p>
      <ul>
        <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
        <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies</li>
        <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
        <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
      </ul>
      <p>
        Note: Blocking essential cookies may prevent parts of the website from functioning correctly.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about our use of cookies: <a href="mailto:reports@fcmreport.com">reports@fcmreport.com</a>
      </p>
    </LegalPageLayout>
  );
}
