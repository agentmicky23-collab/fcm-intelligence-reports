/**
 * Listing Card Component
 * Matches old site design with SOLD badges and urgency timers
 */

import Link from 'next/link';
import type { Listing } from '@/types/listing';

interface ListingCardProps {
  listing: Listing;
}

// Calculate days since listing was added
function getDaysOnMarket(listedDate?: string): number {
  if (!listedDate) return 0;
  const listed = new Date(listedDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - listed.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Check if sold listing should still be visible (within 3 days)
export function isSoldListingVisible(listing: Listing): boolean {
  if (listing.soldStatus !== 'sold') return true;
  if (!listing.soldDate) return false;
  
  const soldDate = new Date(listing.soldDate);
  const now = new Date();
  const daysSinceSold = Math.floor((now.getTime() - soldDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceSold <= 3;
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

  const isSold = listing.soldStatus === 'sold';
  const daysOnMarket = getDaysOnMarket(listing.listedDate);

  return (
    <div className="listing-card-old" style={{ position: 'relative' }}>
      {/* SOLD Overlay */}
      {isSold && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            background: 'rgba(239, 68, 68, 0.95)',
            color: '#fff',
            padding: '12px 40px',
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.5)',
            zIndex: 20,
            border: '3px solid #fff',
          }}
        >
          SOLD
        </div>
      )}

      {/* Badge */}
      {listing.badge && !isSold && (
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
          opacity: isSold ? 0.5 : 1,
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

      {/* Urgency Timer */}
      {daysOnMarket > 0 && !isSold && (
        <div 
          style={{
            position: 'absolute',
            top: '140px',
            right: '8px',
            background: daysOnMarket <= 7 ? 'rgba(34, 197, 94, 0.9)' : daysOnMarket <= 14 ? 'rgba(234, 179, 8, 0.9)' : 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 10,
          }}
        >
          <span>⏱️</span>
          <span>{daysOnMarket} {daysOnMarket === 1 ? 'day' : 'days'} on market</span>
        </div>
      )}

      {/* Business Type Badge */}
      <div 
        className={`listing-type-badge ${listing.businessType === 'post_office' ? 'post-office' : 'convenience'}`}
        style={{ opacity: isSold ? 0.5 : 1 }}
      >
        {formatType(listing.businessType)}
      </div>

      {/* Content */}
      <div className="listing-card-content" style={{ opacity: isSold ? 0.6 : 1 }}>
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
          {isSold ? (
            <span className="btn-listing-original disabled" style={{ opacity: 0.5 }}>
              Sold
            </span>
          ) : listing.originalUrlDisabled ? (
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
          {!isSold && (
            <Link href="/contact" className="btn-get-report-card">
              Get Report £149
            </Link>
          )}
        </div>

        {/* Source */}
        <div className="listing-card-source">
          Source: {listing.sourceAttribution || `${listing.source} • Verified ${listing.verifiedDate || '6 Mar 2026'}`}
        </div>
      </div>
    </div>
  );
}
