/**
 * Valuation Types
 * TypeScript interfaces for Business Republic valuation features
 */

export type ValuationBadge = 'good_value' | 'fair_price' | 'overpriced' | 'insufficient_data';
export type TrafficLight = 'green' | 'amber' | 'red';

export interface ValuationData {
  marketMedian: number | null;
  marketAverage: number | null;
  priceVsMarket: number | null; // Percentage above/below market (positive = above, negative = below)
  valuationBadge: ValuationBadge;
  comparablesCount: number;
  revenueHealth: TrafficLight;
  locationStrength: TrafficLight;
  riskLevel: TrafficLight;
  brokerInsights: BrokerInsight[];
}

export interface BrokerInsight {
  id: string;
  type: 'competition' | 'location' | 'lease' | 'market' | 'demographic' | 'risk';
  title: string;
  description: string;
  severity: 'positive' | 'neutral' | 'warning' | 'critical';
  insiderOnly: boolean;
}

export interface MarketComparable {
  id: string;
  businessType: string;
  region: string;
  askingPrice: number;
  soldPrice: number | null;
  annualFees: number;
  sessionsPerMonth: number;
  weeklyTurnover: number;
  yearlyTurnover: number;
  source: string;
  listingDate: Date;
  soldDate: Date | null;
  status: 'listed' | 'sold' | 'withdrawn';
}

export interface OfferCalculation {
  lowOffer: number;
  midOffer: number;
  highOffer: number;
  recommendedOffer: number;
  reasoning: {
    baseValuation: number;
    adjustments: OfferAdjustment[];
  };
  comparables: MarketComparable[];
  riskFactors: string[];
  valueFactors: string[];
}

export interface OfferAdjustment {
  factor: string;
  impact: number; // Percentage adjustment (positive or negative)
  reason: string;
}

export interface ComparisonListing {
  id: string;
  businessName: string;
  askingPrice: number;
  annualFees: number;
  yearlyTurnover: number;
  score: number;
  priceToFeeRatio: number;
  valuationBadge: ValuationBadge;
  revenueHealth: TrafficLight;
  locationStrength: TrafficLight;
  riskLevel: TrafficLight;
  region: string;
  businessType: string;
}

export interface ListingWithValuation {
  // Original listing fields
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
  
  // Enhanced valuation fields
  valuation?: ValuationData;
}
