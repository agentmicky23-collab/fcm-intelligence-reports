/**
 * Valuation Logic Engine
 * Core calculation logic for Business Republic valuation features
 */

import type {
  ValuationData,
  ValuationBadge,
  TrafficLight,
  BrokerInsight,
  MarketComparable,
  OfferCalculation,
  OfferAdjustment,
  ListingWithValuation
} from '@/types/valuation';
import type { Listing } from '@/types/listing';

/**
 * Calculate valuation badge based on price vs market
 */
export function getValuationBadge(priceVsMarket: number | null): ValuationBadge {
  if (priceVsMarket === null) return 'insufficient_data';
  
  if (priceVsMarket <= -10) return 'good_value';
  if (priceVsMarket >= 15) return 'overpriced';
  return 'fair_price';
}

/**
 * Calculate revenue health traffic light
 * Based on ROI potential (annual fees / asking price)
 */
export function calculateRevenueHealth(annualFees: number, askingPrice: number): TrafficLight {
  if (!annualFees || !askingPrice) return 'red';
  
  const roi = (annualFees / askingPrice) * 100;
  
  if (roi > 30) return 'green';
  if (roi >= 15) return 'amber';
  return 'red';
}

/**
 * Calculate location strength (mock implementation)
 * In production, this would use real location data
 */
export function calculateLocationStrength(region: string, location: string): TrafficLight {
  // Mock logic - in production, use real competition/demographic data
  const strongRegions = ['London', 'South East', 'Scotland'];
  const weakRegions = ['North East', 'Wales'];
  
  if (strongRegions.includes(region)) return 'green';
  if (weakRegions.includes(region)) return 'amber';
  return 'amber'; // Default
}

/**
 * Calculate risk level
 */
export function calculateRiskLevel(
  confidence: string,
  revenueHealth: TrafficLight,
  locationStrength: TrafficLight
): TrafficLight {
  const riskScore = 
    (confidence === 'HIGH' ? 0 : confidence === 'MODERATE' ? 1 : 2) +
    (revenueHealth === 'green' ? 0 : revenueHealth === 'amber' ? 1 : 2) +
    (locationStrength === 'green' ? 0 : locationStrength === 'amber' ? 1 : 2);
  
  if (riskScore <= 1) return 'green';
  if (riskScore <= 3) return 'amber';
  return 'red';
}

/**
 * Generate broker insights for a listing
 */
export function generateBrokerInsights(listing: Listing): BrokerInsight[] {
  const insights: BrokerInsight[] = [];
  
  // Check asking price vs annual fees ratio
  const price = parseInt(listing.askingPrice || '0');
  const fees = parseInt(listing.annualFees || '0');
  
  if (price && fees) {
    const ratio = price / fees;
    
    if (ratio < 1.5) {
      insights.push({
        id: `${listing.id}-insight-1`,
        type: 'market',
        title: 'Exceptional Valuation',
        description: `This listing is priced at just ${ratio.toFixed(1)}x annual Post Office fees — significantly below the typical 2-3x market range. This signals either a motivated seller or potential hidden issues worth investigating.`,
        severity: 'positive',
        insiderOnly: false
      });
    } else if (ratio > 3) {
      insights.push({
        id: `${listing.id}-insight-1`,
        type: 'market',
        title: 'Premium Pricing',
        description: `Asking price is ${ratio.toFixed(1)}x annual fees, which is above the typical 2-3x market range. This may reflect strong retail performance, freehold property, or accommodation value — verify the justification.`,
        severity: 'warning',
        insiderOnly: false
      });
    }
  }
  
  // Regional insights
  if (listing.region === 'Scotland') {
    insights.push({
      id: `${listing.id}-insight-2`,
      type: 'location',
      title: 'Scottish Market Dynamics',
      description: 'Scotland historically shows stronger Post Office retention and higher remuneration levels. Competition for quality branches is intense. Factor in Scottish business rates relief if applicable.',
      severity: 'positive',
      insiderOnly: true
    });
  }
  
  if (listing.region === 'London') {
    insights.push({
      id: `${listing.id}-insight-3`,
      type: 'location',
      title: 'London Operating Costs',
      description: 'London branches face higher operating costs (rent, rates, staff wages) and intense competition. Verify footfall justifies the premium location costs.',
      severity: 'warning',
      insiderOnly: true
    });
  }
  
  // Session volume insights
  if (listing.sessionsPerMonth > 1000) {
    insights.push({
      id: `${listing.id}-insight-4`,
      type: 'market',
      title: 'High Transaction Volume',
      description: `${listing.sessionsPerMonth.toLocaleString()} sessions per month indicates strong customer flow. Verify staffing requirements and Post Office Ltd service quality benchmarks.`,
      severity: 'positive',
      insiderOnly: true
    });
  }
  
  return insights;
}

/**
 * Generate mock market comparables (in production, query database)
 */
function generateMockComparables(listing: Listing): MarketComparable[] {
  const price = parseInt(listing.askingPrice || '0');
  const fees = parseInt(listing.annualFees || '0');
  
  // Generate 3-5 mock comparables with variation
  return [
    {
      id: 'comp-1',
      businessType: listing.businessType,
      region: listing.region,
      askingPrice: price * 0.85,
      soldPrice: price * 0.80,
      annualFees: fees * 0.9,
      sessionsPerMonth: listing.sessionsPerMonth * 0.95,
      weeklyTurnover: parseInt(listing.weeklyTurnover || '0') * 0.9,
      yearlyTurnover: parseInt(listing.yearlyTurnover || '0') * 0.9,
      source: 'Christie & Co',
      listingDate: new Date('2025-09-15'),
      soldDate: new Date('2025-11-20'),
      status: 'sold'
    },
    {
      id: 'comp-2',
      businessType: listing.businessType,
      region: listing.region,
      askingPrice: price * 1.1,
      soldPrice: price * 1.05,
      annualFees: fees * 1.1,
      sessionsPerMonth: listing.sessionsPerMonth * 1.1,
      weeklyTurnover: parseInt(listing.weeklyTurnover || '0') * 1.05,
      yearlyTurnover: parseInt(listing.yearlyTurnover || '0') * 1.05,
      source: 'Daltons Business',
      listingDate: new Date('2025-10-01'),
      soldDate: new Date('2025-12-15'),
      status: 'sold'
    },
    {
      id: 'comp-3',
      businessType: listing.businessType,
      region: listing.region,
      askingPrice: price * 0.95,
      soldPrice: null,
      annualFees: fees * 0.95,
      sessionsPerMonth: listing.sessionsPerMonth,
      weeklyTurnover: parseInt(listing.weeklyTurnover || '0'),
      yearlyTurnover: parseInt(listing.yearlyTurnover || '0'),
      source: 'RightBiz',
      listingDate: new Date('2026-01-10'),
      soldDate: null,
      status: 'listed'
    }
  ];
}

/**
 * Calculate valuation data for a listing
 */
export function calculateValuation(listing: Listing): ValuationData {
  const price = parseInt(listing.askingPrice || '0');
  const fees = parseInt(listing.annualFees || '0');
  
  // Generate mock comparables
  const comparables = generateMockComparables(listing);
  const soldComparables = comparables.filter(c => c.soldPrice);
  
  // Calculate market median and average
  let marketMedian: number | null = null;
  let marketAverage: number | null = null;
  let priceVsMarket: number | null = null;
  
  if (soldComparables.length > 0) {
    const soldPrices = soldComparables.map(c => c.soldPrice!).sort((a, b) => a - b);
    marketMedian = soldPrices[Math.floor(soldPrices.length / 2)];
    marketAverage = soldPrices.reduce((a, b) => a + b, 0) / soldPrices.length;
    
    if (price && marketAverage) {
      priceVsMarket = ((price - marketAverage) / marketAverage) * 100;
    }
  }
  
  // Calculate traffic lights
  const revenueHealth = calculateRevenueHealth(fees, price);
  const locationStrength = calculateLocationStrength(listing.region, listing.location);
  const riskLevel = calculateRiskLevel(listing.confidence, revenueHealth, locationStrength);
  
  // Generate insights
  const brokerInsights = generateBrokerInsights(listing);
  
  return {
    marketMedian,
    marketAverage,
    priceVsMarket,
    valuationBadge: getValuationBadge(priceVsMarket),
    comparablesCount: comparables.length,
    revenueHealth,
    locationStrength,
    riskLevel,
    brokerInsights
  };
}

/**
 * Calculate offer recommendation
 */
export function calculateOffer(listing: ListingWithValuation): OfferCalculation {
  const price = parseInt(listing.askingPrice || '0');
  const fees = parseInt(listing.annualFees || '0');
  const comparables = generateMockComparables(listing);
  
  // Base valuation: 2x annual fees (industry standard)
  const baseValuation = fees * 2;
  
  const adjustments: OfferAdjustment[] = [];
  
  // Adjustment 1: Valuation badge
  if (listing.valuation?.valuationBadge === 'good_value') {
    adjustments.push({
      factor: 'Below Market Value',
      impact: 5,
      reason: 'Listing is already priced below market — offer closer to asking price'
    });
  } else if (listing.valuation?.valuationBadge === 'overpriced') {
    adjustments.push({
      factor: 'Above Market Value',
      impact: -15,
      reason: 'Listing is priced above market — strong negotiation position'
    });
  }
  
  // Adjustment 2: Revenue health
  if (listing.valuation?.revenueHealth === 'green') {
    adjustments.push({
      factor: 'Strong ROI Potential',
      impact: 5,
      reason: 'Revenue health is strong — justifies higher offer'
    });
  } else if (listing.valuation?.revenueHealth === 'red') {
    adjustments.push({
      factor: 'Weak ROI Potential',
      impact: -10,
      reason: 'Revenue health concerns — factor into offer price'
    });
  }
  
  // Adjustment 3: Risk level
  if (listing.valuation?.riskLevel === 'red') {
    adjustments.push({
      factor: 'High Risk Factors',
      impact: -10,
      reason: 'Multiple risk flags — reflect in conservative offer'
    });
  }
  
  // Calculate final offer range
  const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
  const adjustedBase = baseValuation * (1 + totalAdjustment / 100);
  
  const lowOffer = Math.round(adjustedBase * 0.85);
  const midOffer = Math.round(adjustedBase);
  const highOffer = Math.round(adjustedBase * 1.1);
  const recommendedOffer = midOffer;
  
  return {
    lowOffer,
    midOffer,
    highOffer,
    recommendedOffer,
    reasoning: {
      baseValuation,
      adjustments
    },
    comparables,
    riskFactors: listing.valuation?.brokerInsights
      .filter(i => i.severity === 'warning' || i.severity === 'critical')
      .map(i => i.title) || [],
    valueFactors: listing.valuation?.brokerInsights
      .filter(i => i.severity === 'positive')
      .map(i => i.title) || []
  };
}

/**
 * Enhance listings with valuation data
 */
export function enhanceListingsWithValuation(listings: Listing[]): ListingWithValuation[] {
  return listings.map(listing => ({
    ...listing,
    valuation: calculateValuation(listing)
  }));
}
