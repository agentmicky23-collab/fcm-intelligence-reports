/**
 * Listing Card Component
 * Matches old site design EXACTLY
 */

import Link from 'next/link';
import type { Listing } from '@/types/listing';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Badge style based on content
  const getBadgeStyle = (): string => {
    const badge = listing.badge || '';
    if (badge.includes('⚠️')) return 'background: linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
    if (badge.includes('💰')) return 'background: linear-gradient(135deg, #c9a227 0%, #9a7b1a 100%)';
    return 'background: linear-gradient(135deg, #c9a227 0%, #9a7b1a 100%)';
  };

  return (
    <div className="listing-card-old">
      {/* Badge */}
      {listing.badge && (
        <div className="listing-badge-top" style={{ [getBadgeStyle().split(':')[0]]: getBadgeStyle().split(':').slice(1).join(':').trim() }}>
          {listing.badge}
        </div>
      )}

      {/* Header Image */}
      <div 
        className="listing-header-image"
        style={{ 
          background: listing.headerGradient || 'linear-gradient(135deg, #1e3a5f 0%, #0d1117 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '160px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{listing.headerEmoji || '📍'}</div>
          {listing.headerTag && (
            <div style={{ 
              background: listing.headerTagBg || '#c9a227', 
              color: '#fff', 
              padding: '4px 16px', 
              borderRadius: '4px', 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              letterSpacing: '1px' 
            }}>
              {listing.headerTag}
            </div>
          )}
        </div>
      </div>

      {/* Business Type Badge */}
      <div className={`listing-type-badge ${listing.businessType === 'post_office' ? 'post-office' : 'convenience'}`}>
        {formatType(listing.businessType)}
      </div>

      {/* Content */}
      <div className="listing-card-content">
        <h3 className="listing-card-title">{listing.businessName}</h3>
        <div className="listing-card-location">📍 {listing.location}</div>
        
        <div className="listing-card-price">
          <span className="price-amount">{listing.priceDisplay || (listing.askingPrice ? `£${parseInt(listing.askingPrice).toLocaleString()}` : 'POA')}</span>
          <span className="price-label-text">{listing.priceLabel || 'Leasehold'}</span>
        </div>

        {/* Detail Items */}
        {listing.details && listing.details.length > 0 && (
          <div className="listing-card-details">
            {listing.details.map((detail, idx) => (
              <div key={idx} className="detail-row">
                <span className="detail-label-text">{detail.label}</span>
                <span className="detail-value-text">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <p className="listing-card-summary">
          {listing.summary || listing.notes}
        </p>

        {/* Actions */}
        <div className="listing-card-actions">
          {listing.originalUrlDisabled ? (
            <span className="btn-listing-original disabled">
              {listing.originalUrlLabel || 'Listing'}
            </span>
          ) : listing.originalUrl ? (
            <a 
              href={listing.originalUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-listing-original"
            >
              View Listing →
            </a>
          ) : (
            <span className="btn-listing-original disabled">
              {listing.originalUrlLabel || 'Listing'}
            </span>
          )}
          <Link href="/contact" className="btn-get-report-card">
            Get Report £149
          </Link>
        </div>

        {/* Source */}
        <div className="listing-card-source">
          Source: {listing.sourceAttribution || `${listing.source} • Verified ${listing.verifiedDate || '6 Mar 2026'}`}
        </div>
      </div>
    </div>
  );
}
