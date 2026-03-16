/**
 * Listing Types
 * TypeScript interfaces for business opportunity listings
 */

export interface ListingDetail {
  label: string;
  value: string;
}

export interface Listing {
  id: string;
  businessName: string;
  businessType: 'post_office' | 'convenience_store' | 'forecourt' | 'newsagent';
  location: string;
  region: string;
  askingPrice: string | null;
  weeklyTurnover: string;
  yearlyTurnover: string;
  annualFees: string;
  sessionsPerMonth: number;
  score: number;
  confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'SPECULATIVE';
  status: 'new' | 'watch' | 'pursue' | 'closed' | 'dismissed';
  source: string;
  sourceUrl: string;
  notes: string;
  insiderVisible: boolean;
  // Sold tracking
  soldStatus?: 'active' | 'sold';
  soldDate?: string | null;
  // Listed date for urgency display
  listedDate?: string;
  // Enriched fields from old site (optional for backwards compat)
  badge?: string;
  priceLabel?: string;
  priceDisplay?: string;
  headerGradient?: string;
  headerEmoji?: string;
  headerTag?: string;
  headerTagBg?: string;
  details?: ListingDetail[];
  summary?: string;
  originalUrl?: string;
  originalUrlLabel?: string;
  originalUrlDisabled?: boolean;
  sourceAttribution?: string;
  verifiedDate?: string;
}

export type BusinessType = Listing['businessType'];
export type Region = string;
export type ListingStatus = Listing['status'];
export type Confidence = Listing['confidence'];
