import { LegalPageLayout } from "@/components/legal-page-layout";

export default function RefundsPage() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="16 March 2026">
      <h2>Reports</h2>
      <p>
        Our reports are bespoke, personalised products created specifically for your chosen business listing. 
        Because of this:
      </p>
      <ul>
        <li>
          If we have <strong>NOT yet started work</strong> on your report, you may request a full refund within 
          24 hours of purchase by emailing <a href="mailto:reports@fcmreport.com">reports@fcmreport.com</a>.
        </li>
        <li>
          Once work has commenced, reports are <strong>non-refundable</strong>.
        </li>
        <li>
          If your report contains a factual error that materially affects its conclusions, we will correct 
          the report free of charge within 14 days of you notifying us.
        </li>
        <li>
          If we are unable to produce a report for your chosen listing (for example, if the listing has been 
          removed or insufficient information is available), we will offer a full refund or the option to 
          redirect your report to a different listing.
        </li>
      </ul>

      <h2>FCM Insider</h2>
      <ul>
        <li>You may cancel your FCM Insider subscription at any time.</li>
        <li>Access continues until the end of your current billing period.</li>
        <li>No refunds are issued for partial months.</li>
        <li>You may resubscribe at any time at the then-current price.</li>
      </ul>

      <h2>How to Request a Refund</h2>
      <p>
        Email us at <a href="mailto:reports@fcmreport.com"><strong>reports@fcmreport.com</strong></a> with 
        your order reference number and reason for the refund request. We aim to respond within 24 hours.
      </p>

      <h2>Further Information</h2>
      <p>
        For full details on all terms and conditions, please see our{' '}
        <a href="/terms">Terms of Service</a>.
      </p>
    </LegalPageLayout>
  );
}
