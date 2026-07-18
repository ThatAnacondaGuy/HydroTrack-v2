import React from 'react';
import { GlassPanel } from './GlassPanel';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendLabel?: string;
  color?: 'primary' | 'red' | 'amber' | 'blue' | 'default';
  children?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  label, value, unit, trend, trendLabel, color = 'default', children 
}) => {
  
  let valueColorClass = 'text-on-surface';
  if (color === 'primary') valueColorClass = 'text-primary';
  if (color === 'red') valueColorClass = 'text-functional-red';
  if (color === 'amber') valueColorClass = 'text-functional-amber';
  if (color === 'blue') valueColorClass = 'text-functional-blue';

  return (
    <GlassPanel className="p-4 flex flex-col justify-between">
      <div className="text-on-surface-variant font-label-caps uppercase tracking-wider mb-2 flex justify-between items-start">
        <span>{label}</span>
        {children}
      </div>
      <div className="flex items-baseline gap-1 mt-auto">
        <span className={`font-data-mono-lg text-3xl font-bold ${valueColorClass}`}>{value}</span>
        {unit && <span className="text-on-surface-variant text-sm font-data-mono-sm">{unit}</span>}
      </div>
      {(trend || trendLabel) && (
        <div className="flex items-center gap-2 mt-2 text-xs">
          {trend && <span className={trend.startsWith('+') ? 'text-functional-amber' : 'text-primary'}>{trend}</span>}
          {trendLabel && <span className="text-on-surface-variant">{trendLabel}</span>}
        </div>
      )}
    </GlassPanel>
  );
};
