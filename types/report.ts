/**
 * Report Types
 * TypeScript interfaces for due diligence reports and products
 */

export interface Report {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  type: 'one-time' | 'recurring';
  description: string;
  features: string[];
  pageCount?: string;
  deliveryFormat: string;
  consultationIncluded: boolean;
  consultationMinutes?: number;
  stripeProductId?: string | null;
  stripePriceId?: string | null;
  bestFor?: string;
  mostPopular?: boolean;
  bundleDiscount?: string;
}

export interface Membership {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  billingPeriod: string;
  type: string;
  description: string;
  features: string[];
  cancellable: boolean;
  noLongTermCommitment: boolean;
  stripeProductId?: string | null;
  stripePriceId?: string | null;
  currentMembers?: number;
}

export interface ReportsData {
  reports: Report[];
  membership: Membership[];
}
