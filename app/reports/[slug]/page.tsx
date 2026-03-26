/**
 * Individual Report Page
 * Detailed view of a specific report product
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { reports, getReportBySlug } from '@/lib/reports-data';

export async function generateStaticParams() {
  return reports.map(report => ({
    slug: report.slug
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const report = getReportBySlug(params.slug);
  
  if (!report) {
    return { title: 'Report Not Found' };
  }
  
  return {
    title: `${report.title} | FCM Intelligence`,
    description: report.description
  };
}

export default function ReportDetailPage({ params }: { params: { slug: string } }) {
  const report = getReportBySlug(params.slug);
  
  if (!report) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-[var(--fcm-dark)] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link 
            href="/reports"
            className="text-sm text-[var(--fcm-gold)] hover:underline mb-4 inline-block"
          >
            ← All Reports
          </Link>
          
          {report.mostPopular && (
            <div className="inline-block px-4 py-2 bg-[var(--fcm-gold)] text-[var(--fcm-dark)] text-sm font-bold uppercase rounded mb-4">
              Most Popular
            </div>
          )}
          
          <h1 className="text-5xl font-bold mb-4">{report.title}</h1>
          <p className="text-xl text-gray-400">{report.description}</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* What's Included */}
              <section>
                <h2 className="text-3xl font-bold mb-6">What's Included</h2>
                <div className="space-y-4">
                  {report.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                      <span className="text-2xl text-[var(--fcm-gold)]">✓</span>
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Report Details */}
              <section>
                <h2 className="text-3xl font-bold mb-6">Report Details</h2>
                <div className="grid grid-cols-2 gap-6">
                  {report.pageCount && (
                    <div className="p-6 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                      <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Length</div>
                      <div className="text-2xl font-bold text-white">{report.pageCount} pages</div>
                    </div>
                  )}
                  
                  <div className="p-6 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                    <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Format</div>
                    <div className="text-2xl font-bold text-white">{report.deliveryFormat}</div>
                  </div>
                  
                  {report.consultationIncluded && (
                    <div className="p-6 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                      <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Consultation</div>
                      <div className="text-2xl font-bold text-white">{report.consultationMinutes} minutes</div>
                    </div>
                  )}
                  
                  <div className="p-6 bg-[var(--fcm-card)] rounded-lg border border-gray-800">
                    <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Delivery</div>
                    <div className="text-2xl font-bold text-white">3-5 days</div>
                  </div>
                </div>
              </section>
              
              {/* Best For */}
              {report.bestFor && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Best For</h2>
                  <div className="p-6 bg-[var(--fcm-gold)]/10 border border-[var(--fcm-gold)] rounded-lg">
                    <p className="text-lg">{report.bestFor}</p>
                  </div>
                </section>
              )}
              
              {/* Sample Preview */}
              <section>
                <h2 className="text-3xl font-bold mb-6">Sample Report Preview</h2>
                <div className="p-8 bg-[var(--fcm-card)] border border-gray-800 rounded-lg text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-400 mb-4">Sample reports available on request</p>
                  <Link 
                    href="/#contact"
                    className="inline-block text-[var(--fcm-gold)] hover:underline font-semibold"
                  >
                    Contact us to request a sample →
                  </Link>
                </div>
              </section>
            </div>
            
            {/* Right Column - Purchase Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 p-8 bg-[var(--fcm-card)] border border-gray-800 rounded-lg">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-5xl font-bold text-[var(--fcm-gold)]">
                      £{report.price}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">One-time payment</div>
                  
                  {report.bundleDiscount && (
                    <div className="mt-3 p-3 bg-green-900/20 border border-green-700 rounded text-sm text-green-400">
                      ✓ {report.bundleDiscount}
                    </div>
                  )}
                </div>
                
                <Link
                  href="/#contact"
                  className="block w-full px-6 py-4 bg-[var(--fcm-gold)] text-[var(--fcm-dark)] font-semibold text-center rounded-lg hover:bg-[var(--fcm-gold-hover)] transition-colors mb-4"
                >
                  Request Report
                </Link>
                
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--fcm-gold)]">✓</span>
                    <span>Delivered in 3-5 business days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--fcm-gold)]">✓</span>
                    <span>Professional online report</span>
                  </div>
                  {report.consultationIncluded && (
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--fcm-gold)]">✓</span>
                      <span>{report.consultationMinutes}-minute consultation call</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--fcm-gold)]">✓</span>
                    <span>Secure payment via invoice</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Questions?
                  </div>
                  <Link 
                    href="/#contact"
                    className="text-sm text-[var(--fcm-gold)] hover:underline"
                  >
                    Contact us for guidance
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Reports */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Other Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports
              .filter(r => r.id !== report.id)
              .slice(0, 2)
              .map(r => (
                <Link
                  key={r.id}
                  href={`/reports/${r.slug}`}
                  className="group block p-6 bg-[var(--fcm-card)] border border-gray-800 rounded-lg hover:border-[var(--fcm-gold)] transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--fcm-gold)] transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{r.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-[var(--fcm-gold)]">
                      £{r.price}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
