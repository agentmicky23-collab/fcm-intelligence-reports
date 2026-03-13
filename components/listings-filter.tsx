/**
 * Listings Filter Component
 * Search and filter UI for opportunities listings
 */

'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface ListingsFilterProps {
  regions: string[];
  businessTypes: Array<{ value: string; label: string }>;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  searchQuery: string;
  region: string;
  businessType: string;
  status: string;
  minPrice: string;
  maxPrice: string;
}

export function ListingsFilter({ regions, businessTypes, onFilterChange }: ListingsFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    region: '',
    businessType: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      searchQuery: '',
      region: '',
      businessType: '',
      status: '',
      minPrice: '',
      maxPrice: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="mb-8">
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by business name, location, or postcode..."
          value={filters.searchQuery}
          onChange={(e) => handleChange('searchQuery', e.target.value)}
          className="w-full bg-fcm-card border border-gray-800 rounded-lg pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-fcm-gold transition-colors"
        />
      </div>

      {/* Filter toggle button (mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden flex items-center gap-2 w-full justify-center py-3 bg-fcm-card border border-gray-800 rounded-lg text-white hover:border-fcm-gold transition-colors mb-4"
      >
        <Filter size={18} />
        <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        {hasActiveFilters && (
          <span className="bg-fcm-gold text-black px-2 py-0.5 rounded-full text-xs font-bold">
            Active
          </span>
        )}
      </button>

      {/* Filters grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Region</label>
          <select
            value={filters.region}
            onChange={(e) => handleChange('region', e.target.value)}
            className="w-full bg-fcm-card border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fcm-gold transition-colors"
          >
            <option value="">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
          <select
            value={filters.businessType}
            onChange={(e) => handleChange('businessType', e.target.value)}
            className="w-full bg-fcm-card border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fcm-gold transition-colors"
          >
            <option value="">All Types</option>
            {businessTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full bg-fcm-card border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fcm-gold transition-colors"
          >
            <option value="">All Status</option>
            <option value="new">Available</option>
            <option value="watch">Under Offer</option>
            <option value="closed">Sold</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Min Price</label>
          <input
            type="number"
            placeholder="£0"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="w-full bg-fcm-card border border-gray-800 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-fcm-gold transition-colors"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Max Price</label>
          <input
            type="number"
            placeholder="£1,000,000"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="w-full bg-fcm-card border border-gray-800 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-fcm-gold transition-colors"
          />
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-fcm-gold transition-colors"
          >
            <X size={16} />
            <span>Clear all filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
