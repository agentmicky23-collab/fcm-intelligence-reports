/**
 * Individual Listing Detail Page
 * Shows full details for a single business opportunity
 */

import { notFound } from 'next/navigation';
import { getListingById, listings } from '@/lib/listings-data';
import type { Listing } from '@/types/listing';
import { MapPin, ArrowLeft, Building2, TrendingUp, DollarSign, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export async function generateStaticParams() {
  return listings.map((listing) => ({
    id: listing.id,
  }));
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function ListingDetailPage({ params }: PageProps) {
  const listing = getListingById(params.id);

  if (!listing) {
    notFound();
  }

  // Format currency
  const formatPrice = (price: string | null) => {
    if (!price || price === '0') return 'N/A';
    return `£${parseInt(price).toLocaleString()}`;
  };

  // Format business type
  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-fcm-red text-white',
      available: 'bg-fcm-red text-white',
      watch: 'bg-yellow-500 text-black',
      pursue: 'bg-fcm-gold text-black',
      closed: 'bg-gray-500 text-white',
    };
    return styles[status.toLowerCase()] || 'bg-gray-600 text-white';
  };

  // Confidence badge
  const getConfidenceBadge = (confidence: string) => {
    const styles: Record<string, string> = {
      HIGH: 'bg-green-500/20 text-green-400 border-green-500/50',
      MODERATE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      LOW: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      SPECULATIVE: 'bg-red-500/20 text-red-400 border-red-500/50',
    };
    return styles[confidence] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-900 bg-black/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image 
                src="/images/logo-transparent.png" 
                alt="FCM Intelligence" 
                width={120} 
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-fcm-gold font-semibold">Listings</a>
              <a href="/reports" className="text-gray-400 hover:text-fcm-gold transition-colors">Reports</a>
              <a href="https://fcm-intelligence-nextjs.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-fcm-gold transition-colors">FCM Intelligence ↗</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Back link */}
      <div className="border-b border-gray-900 bg-gray-950">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-fcm-gold transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Listings</span>
          </Link>
        </div>
      </div>

      {/* Hero section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-950 to-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            {/* Status and confidence badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`px-4 py-2 text-sm font-bold uppercase rounded-lg ${getStatusBadge(listing.status)}`}>
                {listing.status}
              </span>
              <span className={`px-4 py-2 text-sm font-bold uppercase rounded-lg border ${getConfidenceBadge(listing.confidence)}`}>
                {listing.confidence} Confidence
              </span>
              <span className="px-4 py-2 text-sm font-bold uppercase rounded-lg bg-fcm-card border border-gray-800 text-gray-300">
                {formatType(listing.businessType)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              {listing.businessName}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 text-xl text-gray-400 mb-6">
              <MapPin size={24} className="text-fcm-gold" />
              <span>{listing.location}</span>
            </div>

            {/* Price */}
            {listing.askingPrice && listing.askingPrice !== '0' && (
              <div className="mb-8">
                <div className="text-sm text-gray-400 mb-1">Asking Price</div>
                <div className="text-5xl font-bold text-fcm-gold font-mono">
                  {formatPrice(listing.askingPrice)}
                </div>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-fcm-card border border-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-fcm-gold font-mono mb-1">
                  {listing.score}
                </div>
                <div className="text-sm text-gray-400">Score (out of 100)</div>
              </div>
              {listing.yearlyTurnover && listing.yearlyTurnover !== '0' && (
                <div className="bg-fcm-card border border-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-fcm-gold font-mono mb-1">
                    {formatPrice(listing.yearlyTurnover)}
                  </div>
                  <div className="text-sm text-gray-400">Annual Turnover</div>
                </div>
              )}
              {listing.annualFees && listing.annualFees !== '0' && (
                <div className="bg-fcm-card border border-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-fcm-gold font-mono mb-1">
                    {formatPrice(listing.annualFees)}
                  </div>
                  <div className="text-sm text-gray-400">Annual Fees</div>
                </div>
              )}
              {listing.sessionsPerMonth > 0 && (
                <div className="bg-fcm-card border border-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-fcm-gold font-mono mb-1">
                    {listing.sessionsPerMonth.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Sessions/Month</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            {/* Details section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Building2 className="text-fcm-gold" size={28} />
                <span>Business Details</span>
              </h2>
              <div className="bg-fcm-card border border-gray-800 rounded-lg p-6 md:p-8">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {listing.notes}
                </p>
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <DollarSign className="text-fcm-gold" size={28} />
                <span>Financial Overview</span>
              </h2>
              <div className="bg-fcm-card border border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-800">
                    {listing.askingPrice && listing.askingPrice !== '0' && (
                      <tr>
                        <td className="px-6 py-4 text-gray-400">Asking Price</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-fcm-gold text-lg">
                          {formatPrice(listing.askingPrice)}
                        </td>
                      </tr>
                    )}
                    {listing.yearlyTurnover && listing.yearlyTurnover !== '0' && (
                      <tr>
                        <td className="px-6 py-4 text-gray-400">Annual Turnover</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-fcm-gold text-lg">
                          {formatPrice(listing.yearlyTurnover)}
                        </td>
                      </tr>
                    )}
                    {listing.weeklyTurnover && listing.weeklyTurnover !== '0' && (
                      <tr>
                        <td className="px-6 py-4 text-gray-400">Weekly Turnover</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-fcm-gold text-lg">
                          {formatPrice(listing.weeklyTurnover)}
                        </td>
                      </tr>
                    )}
                    {listing.annualFees && listing.annualFees !== '0' && (
                      <tr>
                        <td className="px-6 py-4 text-gray-400">Annual Fees</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-fcm-gold text-lg">
                          {formatPrice(listing.annualFees)}
                        </td>
                      </tr>
                    )}
                    {listing.sessionsPerMonth > 0 && (
                      <tr>
                        <td className="px-6 py-4 text-gray-400">Sessions per Month</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-fcm-gold text-lg">
                          {listing.sessionsPerMonth.toLocaleString()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Source info */}
            {listing.source && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Award className="text-fcm-gold" size={28} />
                  <span>Source Information</span>
                </h2>
                <div className="bg-fcm-card border border-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Listed via</div>
                      <div className="text-lg font-semibold text-white">{listing.source}</div>
                    </div>
                    {listing.sourceUrl && (
                      <a 
                        href={listing.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-fcm-gold text-black font-semibold rounded-lg hover:bg-fcm-gold-hover transition-colors"
                      >
                        View Original Listing →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CTA section */}
            <div className="bg-gradient-to-r from-fcm-gold to-yellow-600 rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-black mb-4">
                Interested in this opportunity?
              </h2>
              <p className="text-black/80 text-lg mb-8">
                Get in touch with our team to learn more and arrange a viewing.
              </p>
              <a 
                href="https://fcm-intelligence-nextjs.vercel.app/contact" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-black text-fcm-gold font-bold text-lg rounded-lg hover:bg-gray-900 transition-colors"
              >
                Request More Information ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Image 
                src="/images/logo-transparent.png" 
                alt="FCM Intelligence" 
                width={100} 
                height={33}
                className="h-8 w-auto opacity-60"
              />
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} FCM Intelligence. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="https://fcm-intelligence-nextjs.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-fcm-gold transition-colors">FCM Intelligence</a>
              <a href="/reports" className="text-gray-400 hover:text-fcm-gold transition-colors">Reports</a>
              <a href="https://fcm-intelligence-nextjs.vercel.app/contact" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-fcm-gold transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
