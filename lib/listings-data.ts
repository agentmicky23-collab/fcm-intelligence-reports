/**
 * Listings Data Loader
 * Loads and processes migration data from listings-35.json
 */

import type { Listing } from '@/types/listing';
import listingsJson from '@/migration-data/listings-35.json';

// Load listings from JSON
export const listings: Listing[] = listingsJson as Listing[];

// Get unique regions
export function getUniqueRegions(): string[] {
  const regions = new Set<string>();
  listings.forEach(listing => {
    if (listing.region) regions.add(listing.region);
  });
  return Array.from(regions).sort();
}

// Get unique business types
export function getUniqueBusinessTypes(): Array<{ value: string; label: string }> {
  const types = new Set<string>();
  listings.forEach(listing => {
    if (listing.businessType) types.add(listing.businessType);
  });
  
  return Array.from(types).map(type => ({
    value: type,
    label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  })).sort((a, b) => a.label.localeCompare(b.label));
}

// Get listing by ID
export function getListingById(id: string): Listing | undefined {
  return listings.find(listing => listing.id === id);
}

// Filter listings
export interface FilterOptions {
  region?: string;
  businessType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

export function filterListings(options: FilterOptions): Listing[] {
  let filtered = [...listings];

  // Filter by region
  if (options.region) {
    filtered = filtered.filter(l => l.region === options.region);
  }

  // Filter by business type
  if (options.businessType) {
    filtered = filtered.filter(l => l.businessType === options.businessType);
  }

  // Filter by status
  if (options.status) {
    filtered = filtered.filter(l => l.status === options.status);
  }

  // Filter by price range
  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    filtered = filtered.filter(l => {
      if (!l.askingPrice) return false;
      const price = parseInt(l.askingPrice);
      if (options.minPrice !== undefined && price < options.minPrice) return false;
      if (options.maxPrice !== undefined && price > options.maxPrice) return false;
      return true;
    });
  }

  // Search query (business name, location, notes)
  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    filtered = filtered.filter(l => 
      l.businessName.toLowerCase().includes(query) ||
      l.location.toLowerCase().includes(query) ||
      l.notes.toLowerCase().includes(query)
    );
  }

  return filtered;
}
