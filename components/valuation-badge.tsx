/**
 * Valuation Badge Component
 * Displays valuation indicator on listing cards
 */

import type { ValuationBadge } from '@/types/valuation';

interface ValuationBadgeProps {
  badge: ValuationBadge;
  priceVsMarket: number | null;
  className?: string;
}

const badgeConfig: Record<ValuationBadge, { 
  label: string; 
  bgColor: string; 
  textColor: string;
  icon: string;
}> = {
  good_value: {
    label: 'GOOD VALUE',
    bgColor: 'bg-green-900/30 border-green-500',
    textColor: 'text-green-400',
    icon: '↓'
  },
  fair_price: {
    label: 'FAIR PRICE',
    bgColor: 'bg-amber-900/30 border-amber-500',
    textColor: 'text-amber-400',
    icon: '='
  },
  overpriced: {
    label: 'OVERPRICED',
    bgColor: 'bg-red-900/30 border-red-500',
    textColor: 'text-red-400',
    icon: '↑'
  },
  insufficient_data: {
    label: 'INSUFFICIENT DATA',
    bgColor: 'bg-gray-800/30 border-gray-600',
    textColor: 'text-gray-400',
    icon: '?'
  }
};

export function ValuationBadge({ badge, priceVsMarket, className = '' }: ValuationBadgeProps) {
  const config = badgeConfig[badge];
  
  const percentText = priceVsMarket !== null 
    ? `${Math.abs(priceVsMarket).toFixed(0)}% ${priceVsMarket < 0 ? 'below' : 'above'} market average`
    : 'cannot determine market value';
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgColor} ${className}`}>
      <span className={`text-lg font-bold ${config.textColor}`}>{config.icon}</span>
      <div className="flex flex-col">
        <span className={`text-xs font-semibold ${config.textColor} uppercase tracking-wide`}>
          {config.label}
        </span>
        <span className="text-xs text-gray-300">
          {percentText}
        </span>
      </div>
    </div>
  );
}

/**
 * Compact version for smaller spaces
 */
export function ValuationBadgeCompact({ badge, priceVsMarket }: ValuationBadgeProps) {
  const config = badgeConfig[badge];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border ${config.bgColor}`}>
      <span className={`text-sm font-bold ${config.textColor}`}>{config.icon}</span>
      <span className={`text-xs font-semibold ${config.textColor} uppercase`}>
        {config.label}
      </span>
      {priceVsMarket !== null && (
        <span className="text-xs text-gray-400">
          {Math.abs(priceVsMarket).toFixed(0)}%
        </span>
      )}
    </div>
  );
}
