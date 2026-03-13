/**
 * Traffic Light Indicators Component
 * Displays revenue health, location strength, and risk level
 */

import type { TrafficLight } from '@/types/valuation';

interface TrafficLightProps {
  label: string;
  status: TrafficLight;
  tooltip?: string;
  showLabel?: boolean;
}

const statusConfig: Record<TrafficLight, {
  color: string;
  bgColor: string;
  icon: string;
}> = {
  green: {
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: '●'
  },
  amber: {
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    icon: '●'
  },
  red: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: '●'
  }
};

export function TrafficLight({ label, status, tooltip, showLabel = true }: TrafficLightProps) {
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center gap-2" title={tooltip}>
      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${config.bgColor}`}>
        <span className={`text-lg ${config.color}`}>{config.icon}</span>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {label}
          </span>
          <span className={`text-xs font-semibold ${config.color} capitalize`}>
            {status}
          </span>
        </div>
      )}
    </div>
  );
}

interface TrafficLightGridProps {
  revenueHealth: TrafficLight;
  locationStrength: TrafficLight;
  riskLevel: TrafficLight;
  compact?: boolean;
}

export function TrafficLightGrid({ 
  revenueHealth, 
  locationStrength, 
  riskLevel,
  compact = false 
}: TrafficLightGridProps) {
  if (compact) {
    return (
      <div className="flex gap-2">
        <TrafficLight 
          label="Revenue" 
          status={revenueHealth} 
          showLabel={false}
          tooltip="Revenue Health"
        />
        <TrafficLight 
          label="Location" 
          status={locationStrength} 
          showLabel={false}
          tooltip="Location Strength"
        />
        <TrafficLight 
          label="Risk" 
          status={riskLevel} 
          showLabel={false}
          tooltip="Risk Level"
        />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 gap-3">
      <TrafficLight 
        label="Revenue Health" 
        status={revenueHealth}
        tooltip="ROI potential based on asking price vs annual fees"
      />
      <TrafficLight 
        label="Location Strength" 
        status={locationStrength}
        tooltip="Competition, demographics, and footfall analysis"
      />
      <TrafficLight 
        label="Risk Level" 
        status={riskLevel}
        tooltip="Overall risk assessment"
      />
    </div>
  );
}

/**
 * Detailed traffic light with explanation
 */
interface TrafficLightDetailProps {
  label: string;
  status: TrafficLight;
  description: string;
  factors: string[];
}

export function TrafficLightDetail({ label, status, description, factors }: TrafficLightDetailProps) {
  const config = statusConfig[status];
  
  return (
    <div className="p-4 rounded-lg bg-[var(--fcm-card)] border border-gray-800">
      <div className="flex items-start gap-3 mb-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${config.bgColor}`}>
          <span className={`text-xl ${config.color}`}>{config.icon}</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{label}</h4>
          <p className={`text-sm font-medium ${config.color} capitalize mb-2`}>
            {status}
          </p>
          <p className="text-sm text-gray-400">
            {description}
          </p>
        </div>
      </div>
      
      {factors.length > 0 && (
        <div className="pl-11">
          <ul className="space-y-1">
            {factors.map((factor, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
