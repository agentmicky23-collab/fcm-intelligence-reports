/**
 * Reports Data Loader
 * Loads and processes report products from migration data
 */

import type { Report, Membership, ReportsData } from '@/types/report';
import reportsJson from '@/migration-data/reports-products.json';

// Load data
const data = reportsJson as ReportsData;

// Export reports with slugs
export const reports: Report[] = data.reports.map(report => ({
  ...report,
  slug: report.id.toLowerCase().replace('rpt-', '').replace(/_/g, '-')
}));

// Export membership data
export const memberships: Membership[] = data.membership.map(m => ({
  ...m,
  slug: m.id.toLowerCase().replace('mem-', '').replace(/_/g, '-')
}));

/**
 * Get report by slug
 */
export function getReportBySlug(slug: string): Report | undefined {
  return reports.find(r => r.slug === slug);
}

/**
 * Get report by ID
 */
export function getReportById(id: string): Report | undefined {
  return reports.find(r => r.id === id);
}

/**
 * Get all reports sorted by price
 */
export function getReportsSortedByPrice(): Report[] {
  return [...reports].sort((a, b) => a.price - b.price);
}

/**
 * Get featured report (most popular)
 */
export function getFeaturedReport(): Report | undefined {
  return reports.find(r => r.mostPopular);
}
