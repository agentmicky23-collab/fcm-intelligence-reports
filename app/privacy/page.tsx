import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal-page-layout";

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for FCM Intelligence. How we collect, use, and protect your data.',
  alternates: { canonical: 'https://fcmreport.com/privacy' },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="16 March 2026">
      <h2>1. Who We Are</h2>
      <p>
        FCM Intelligence (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website www.fcmreport.com and provides market 
        intelligence reports for Post Office and convenience store acquisitions.
      </p>
      <p>We are the data controller for the personal data described in this policy.</p>
      <p><strong>Contact:</strong> <a href="mailto:reports@fcmreport.com">reports@fcmreport.com</a></p>

      <h2>2. What Data We Collect</h2>

      <h3>2.1 Report Customers</h3>
      <p>When you purchase a report, we collect:</p>
      <table>
        <thead>
          <tr><th>Data</th><th>Why We Need It</th><th>Lawful Basis</th></tr>
        </thead>
        <tbody>
          <tr><td>Full name</td><td>To personalise your report and watermark</td><td>Contract</td></tr>
          <tr><td>Email address</td><td>To deliver your report and communicate about your order</td><td>Contract</td></tr>
          <tr><td>Phone number (optional)</td><td>To contact you about your order if needed</td><td>Contract</td></tr>
          <tr><td>Business of interest</td><td>To produce your report</td><td>Contract</td></tr>
          <tr><td>Payment details</td><td>To process your payment (handled by Stripe — we never see your full card number)</td><td>Contract</td></tr>
        </tbody>
      </table>

      <h3>2.2 Insight &amp; Intelligence Report Customers</h3>
      <p>In addition to the above, you may provide:</p>
      <table>
        <thead>
          <tr><th>Data</th><th>Why We Need It</th><th>Lawful Basis</th></tr>
        </thead>
        <tbody>
          <tr><td>Financial documents (P&amp;L, accounts, tax returns)</td><td>To analyse the business financials in your report</td><td>Contract</td></tr>
          <tr><td>Broker correspondence</td><td>To understand the context of the acquisition</td><td>Contract</td></tr>
          <tr><td>Lease documents</td><td>To assess property terms</td><td>Contract</td></tr>
        </tbody>
      </table>
      <p>
        <strong>Important:</strong> Financial documents you provide are used solely to prepare your report. 
        They are not shared with any third party and are permanently deleted within 30 days of report delivery.
      </p>

      <h3>2.3 FCM Insider Subscribers</h3>
      <table>
        <thead>
          <tr><th>Data</th><th>Why We Need It</th><th>Lawful Basis</th></tr>
        </thead>
        <tbody>
          <tr><td>Full name</td><td>To personalise your membership</td><td>Contract</td></tr>
          <tr><td>Email address</td><td>To send listings, alerts, and membership communications</td><td>Contract</td></tr>
          <tr><td>Location preferences (optional)</td><td>To match you with relevant listings</td><td>Contract</td></tr>
          <tr><td>Budget range (optional)</td><td>To match you with relevant listings</td><td>Contract</td></tr>
        </tbody>
      </table>

      <h3>2.4 Website Visitors</h3>
      <table>
        <thead>
          <tr><th>Data</th><th>Why We Need It</th><th>Lawful Basis</th></tr>
        </thead>
        <tbody>
          <tr><td>Cookies and analytics data</td><td>To understand how our website is used and improve it</td><td>Consent</td></tr>
          <tr><td>IP address</td><td>Collected automatically by our hosting provider (Vercel)</td><td>Legitimate interest</td></tr>
        </tbody>
      </table>

      <h2>3. How We Use Your Data</h2>
      <p>We use your personal data to:</p>
      <ul>
        <li>Process and deliver your report order</li>
        <li>Communicate with you about your order (delivery, queries, follow-ups)</li>
        <li>Send FCM Insider alerts and listings (subscribers only)</li>
        <li>Improve our website and services</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p><strong>We do NOT:</strong></p>
      <ul>
        <li>Sell your data to third parties</li>
        <li>Share your data with marketing companies</li>
        <li>Use your financial documents for any purpose other than your report</li>
        <li>Send marketing emails unless you have subscribed to FCM Insider</li>
        <li>Profile you for advertising purposes</li>
      </ul>

      <h2>4. Who We Share Data With</h2>
      <p>We share your data only with the following service providers, who process it on our behalf:</p>
      <table>
        <thead>
          <tr><th>Provider</th><th>Purpose</th><th>Data Shared</th></tr>
        </thead>
        <tbody>
          <tr><td>Stripe</td><td>Payment processing</td><td>Name, email, payment details</td></tr>
          <tr><td>Resend</td><td>Email delivery</td><td>Name, email</td></tr>
          <tr><td>Vercel</td><td>Website hosting</td><td>IP address, cookies</td></tr>
          <tr><td>Supabase</td><td>Order management</td><td>Name, email, order details</td></tr>
        </tbody>
      </table>
      <p>
        All service providers are bound by data processing agreements and process data only on our instructions.
      </p>
      <p><strong>We do not share customer-provided financial documents with any third party.</strong></p>

      <h2>5. Data Retention</h2>

      <h3>5.1 Report Customers</h3>
      <table>
        <thead>
          <tr><th>Data Type</th><th>Retention Period</th><th>Reason</th></tr>
        </thead>
        <tbody>
          <tr><td>Order details (name, email, which report)</td><td>6 years</td><td>Tax and accounting records (HMRC requirement)</td></tr>
          <tr><td>Your delivered report (PDF)</td><td>12 months</td><td>In case you need it resent</td></tr>
          <tr><td>Customer-uploaded financial documents</td><td><strong>Deleted within 30 days of delivery</strong></td><td>No longer needed</td></tr>
          <tr><td>Customer-uploaded correspondence/files</td><td><strong>Deleted within 30 days of delivery</strong></td><td>No longer needed</td></tr>
        </tbody>
      </table>
      <p>When financial documents are deleted, we will send you a confirmation email.</p>

      <h3>5.2 FCM Insider Subscribers</h3>
      <table>
        <thead>
          <tr><th>Data Type</th><th>Retention Period</th><th>Reason</th></tr>
        </thead>
        <tbody>
          <tr><td>Name and email</td><td>Duration of subscription + 30 days</td><td>To provide the service</td></tr>
          <tr><td>Preferences (location, budget)</td><td>Duration of subscription + 30 days</td><td>To match listings</td></tr>
        </tbody>
      </table>
      <p>
        After cancellation, your data is deleted within 30 days unless you have also purchased reports 
        (in which case order records are retained per 5.1).
      </p>

      <h3>5.3 Website Visitors</h3>
      <table>
        <thead>
          <tr><th>Data Type</th><th>Retention Period</th><th>Reason</th></tr>
        </thead>
        <tbody>
          <tr><td>Analytics cookies</td><td>As per cookie settings (see Cookie Policy)</td><td>Website improvement</td></tr>
          <tr><td>Server logs</td><td>30 days</td><td>Security and troubleshooting</td></tr>
        </tbody>
      </table>

      <h2>6. Your Rights Under UK GDPR</h2>
      <p>You have the following rights regarding your personal data:</p>

      <h3>6.1 Right of Access</h3>
      <p>You can request a copy of all personal data we hold about you. We will respond within 30 days.</p>

      <h3>6.2 Right to Rectification</h3>
      <p>If any data we hold is inaccurate, you can ask us to correct it.</p>

      <h3>6.3 Right to Erasure (&quot;Right to be Forgotten&quot;)</h3>
      <p>
        You can request that we delete your personal data. We will comply within 30 days, except where 
        we are required by law to retain certain records (e.g., tax records for HMRC).
      </p>

      <h3>6.4 Right to Restrict Processing</h3>
      <p>You can ask us to limit how we use your data in certain circumstances.</p>

      <h3>6.5 Right to Data Portability</h3>
      <p>You can request your data in a machine-readable format.</p>

      <h3>6.6 Right to Object</h3>
      <p>You can object to our processing of your data where we rely on legitimate interest as the lawful basis.</p>

      <h3>6.7 Right to Withdraw Consent</h3>
      <p>Where processing is based on your consent (e.g., cookies), you can withdraw consent at any time.</p>

      <h3>6.8 How to Exercise Your Rights</h3>
      <p>
        Email us at <a href="mailto:reports@fcmreport.com"><strong>reports@fcmreport.com</strong></a> with 
        the subject line &quot;Data Rights Request&quot;. We will respond within 30 days.
      </p>
      <p>
        If you are not satisfied with our response, you have the right to complain to the Information 
        Commissioner&apos;s Office (ICO):
      </p>
      <ul>
        <li>Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">https://ico.org.uk</a></li>
        <li>Helpline: 0303 123 1113</li>
      </ul>

      <h2>7. Security</h2>
      <p>We take the security of your data seriously:</p>
      <ul>
        <li>All data is transmitted over encrypted connections (HTTPS/TLS)</li>
        <li>Payment processing is handled by Stripe (PCI DSS compliant) — we never store your card details</li>
        <li>Customer-uploaded financial documents are stored securely and deleted within 30 days</li>
        <li>Reports are watermarked with your details to prevent unauthorised distribution</li>
        <li>Access to customer data is restricted to authorised personnel only</li>
      </ul>

      <h2>8. International Transfers</h2>
      <p>
        Your data is processed within the UK and EU. Our service providers (Stripe, Vercel, Supabase) may 
        process data in the United States. Where this occurs, appropriate safeguards are in place including 
        Standard Contractual Clauses.
      </p>

      <h2>9. Children</h2>
      <p>
        Our services are intended for adults (18+) involved in business acquisitions. We do not knowingly 
        collect data from anyone under 18.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be posted on our website 
        with a new effective date. Continued use of our services after changes constitutes acceptance.
      </p>

      <h2>11. Contact Us</h2>
      <p>For any privacy-related questions or to exercise your data rights:</p>
      <p>
        <strong>FCM Intelligence</strong><br />
        Email: <a href="mailto:reports@fcmreport.com">reports@fcmreport.com</a><br />
        Website: <a href="https://www.fcmreport.com">www.fcmreport.com</a>
      </p>
    </LegalPageLayout>
  );
}
