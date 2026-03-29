import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal-page-layout";

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for FCM Intelligence reports and listings platform.',
  alternates: { canonical: 'https://fcmreport.com/terms' },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="16 March 2026">
      <h2>1. Who We Are</h2>
      <p>
        FCM Intelligence (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website www.fcmreport.com and provides market intelligence 
        reports and listings for Post Office and convenience store acquisitions in the United Kingdom.
      </p>
      <p>
        By purchasing a report, subscribing to FCM Insider, or using our website, you agree to these Terms of Service.
      </p>

      <h2>2. What We Provide</h2>
      <h3>2.1 Intelligence Reports</h3>
      <p>
        We produce bespoke market intelligence reports analysing specific Post Office and convenience store businesses 
        that are listed for sale. Reports are available in two tiers:
      </p>
      <ul>
        <li><strong>Insight Report (£199):</strong> 10 sections covering location, demographics, competition, footfall, and market analysis.</li>
        <li><strong>Intelligence Report (£499):</strong> 15 sections including everything in Insight, plus financial analysis, risk assessment, profit improvement strategy, and a 60-minute strategy call.</li>
      </ul>

      <h3>2.2 FCM Insider</h3>
      <p>
        FCM Insider is a subscription service providing curated listings, early alerts, and market intelligence 
        for Post Office business buyers.
      </p>

      <h3>2.3 Free Listings</h3>
      <p>
        We display Post Office and convenience store listings sourced from third-party platforms (Daltons, RightBiz, 
        Christie &amp; Co, BusinessesForSale). These are provided for informational purposes only.
      </p>

      <h2>3. Important Disclaimer — Not Financial Advice</h2>
      <p>
        <strong>Our reports are for informational purposes only.</strong> They do not constitute financial, legal, 
        investment, or professional advice. FCM Intelligence is not regulated by the Financial Conduct Authority 
        (FCA) and does not provide regulated financial advice.
      </p>
      <p>
        You should always seek independent professional advice from a qualified solicitor, accountant, or financial 
        advisor before making any acquisition decision. We are not responsible for any decision you make based on 
        our reports.
      </p>

      <h2>4. Data Sources and Accuracy</h2>
      <p>Our reports use data from publicly available sources including, but not limited to:</p>
      <ul>
        <li>Office for National Statistics (ONS)</li>
        <li>data.police.uk (crime statistics)</li>
        <li>Post Office Ltd branch finder</li>
        <li>Ofcom (broadband/connectivity data)</li>
        <li>Companies House</li>
        <li>Land Registry / VOA</li>
        <li>Google Maps / Google Business</li>
        <li>Third-party listing platforms</li>
      </ul>
      <p>
        While we take reasonable care to ensure accuracy, we cannot guarantee the accuracy, completeness, or 
        timeliness of third-party data. Data may change between the time of research and report delivery. 
        All sources are cited within the report.
      </p>
      <p>
        <strong>Financial estimates</strong> presented in reports are clearly labelled as estimates and shown as 
        ranges. They should not be relied upon as precise figures.
      </p>

      <h2>5. Your Obligations</h2>
      <h3>5.1 Accurate Information</h3>
      <p>
        When ordering a report, you must provide accurate information about the business you want analysed, 
        including the correct business name, postcode, and listing details. If you provide incorrect information, 
        we may not be able to produce the report or may produce a report for the wrong business. In such cases, 
        our refund policy applies.
      </p>

      <h3>5.2 Uploaded Documents</h3>
      <p>
        For Insight and Intelligence reports, you may upload supporting documents (financial accounts, broker 
        particulars, lease agreements). By uploading documents, you confirm that you have the right to share 
        them with us for the purpose of preparing your report.
      </p>

      <h3>5.3 Report Licence</h3>
      <p>
        Your report is licensed for your personal use only. You may share relevant findings with your professional 
        advisors (solicitor, accountant, mortgage broker) in connection with your assessment of the subject business. 
        You may not:
      </p>
      <ul>
        <li>Forward or distribute the complete report to any other party</li>
        <li>Publish any part of the report online</li>
        <li>Use the report for any commercial purpose other than your own acquisition decision</li>
        <li>Remove or alter the watermark</li>
      </ul>
      <p>
        Reports are watermarked with the purchaser&apos;s identity. Unauthorised distribution may be traced and may 
        result in legal action.
      </p>

      <h2>6. Payment</h2>
      <p>
        All payments are processed securely by Stripe. We do not store your card details. Prices are in 
        British Pounds (GBP) and include VAT where applicable.
      </p>
      <p>
        Report orders are confirmed by email once payment is received. Reports are typically delivered within 
        48 hours, though complex reports may take longer — we will notify you if this is the case.
      </p>

      <h2>7. Delivery</h2>
      <p>
        Reports are delivered as PDF files to the email address you provide at checkout. It is your responsibility 
        to ensure the email address is correct. We are not responsible for non-delivery caused by incorrect email 
        addresses, spam filters, or full inboxes.
      </p>
      <p>
        If you do not receive your report within 48 hours of ordering, please check your spam/junk folder and then 
        contact us at reports@fcmreport.com.
      </p>

      <h2>8. Refund Policy</h2>
      <h3>Reports</h3>
      <p>
        Our reports are bespoke, personalised products created specifically for your chosen business listing. 
        Because of this:
      </p>
      <ul>
        <li>If we have <strong>NOT yet started work</strong> on your report, you may request a full refund within 24 hours of purchase by emailing reports@fcmreport.com.</li>
        <li>Once work has commenced, reports are <strong>non-refundable</strong>.</li>
        <li>If your report contains a factual error that materially affects its conclusions, we will correct the report free of charge within 14 days of you notifying us.</li>
        <li>If we are unable to produce a report for your chosen listing (for example, if the listing has been removed or insufficient information is available), we will offer a full refund or the option to redirect your report to a different listing.</li>
      </ul>

      <h3>FCM Insider</h3>
      <ul>
        <li>You may cancel your FCM Insider subscription at any time.</li>
        <li>Access continues until the end of your current billing period.</li>
        <li>No refunds are issued for partial months.</li>
        <li>You may resubscribe at any time at the then-current price.</li>
      </ul>
      <p>To request a refund: <a href="mailto:reports@fcmreport.com">reports@fcmreport.com</a></p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law:
      </p>
      <ul>
        <li>FCM Intelligence accepts no liability for any loss, damage, or expense arising from decisions made in reliance on our reports.</li>
        <li>Our total liability for any claim arising from a report shall not exceed the price paid for that report.</li>
        <li>We are not liable for any indirect, consequential, or special damages, including lost profits or business opportunities.</li>
      </ul>
      <p>
        Nothing in these terms excludes or limits liability for death or personal injury caused by negligence, 
        fraud or fraudulent misrepresentation, or any other liability that cannot be excluded by law.
      </p>

      <h2>10. Intellectual Property</h2>
      <p>
        All content on fcmreport.com and within our reports is © {new Date().getFullYear()} FCM Intelligence. 
        All rights reserved. Our reports, website content, branding, and analysis methodology are protected 
        by UK copyright law.
      </p>

      <h2>11. Privacy</h2>
      <p>
        We take your privacy seriously. For full details on how we collect, use, and protect your personal data, 
        please see our <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>12. Cookies</h2>
      <p>
        Our website uses cookies. For details, see our <a href="/cookies">Cookie Policy</a>.
      </p>

      <h2>13. Changes to These Terms</h2>
      <p>
        We may update these Terms of Service from time to time. Material changes will be posted on our website 
        with a new effective date. Continued use of our services after changes constitutes acceptance of the 
        updated terms.
      </p>

      <h2>14. Governing Law</h2>
      <p>
        These terms are governed by the laws of England and Wales. Any disputes arising from these terms or 
        our services will be subject to the exclusive jurisdiction of the courts of England and Wales.
      </p>

      <h2>15. Contact Us</h2>
      <p>
        For any questions about these Terms of Service:
      </p>
      <p>
        <strong>FCM Intelligence</strong><br />
        Email: <a href="mailto:reports@fcmreport.com">reports@fcmreport.com</a><br />
        Website: <a href="https://www.fcmreport.com">www.fcmreport.com</a>
      </p>
    </LegalPageLayout>
  );
}
