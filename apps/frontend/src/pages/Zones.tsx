import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { KpiCard } from '../components/ui/KpiCard';

export const Zones: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg-mobile text-2xl mb-1">Zone Management</h2>
          <p className="text-on-surface-variant text-sm font-data-mono-sm">District metered areas and PMZ breakdown.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'North Sector', nodes: 342, alerts: 2, status: 'Warning' },
          { name: 'East Hub', nodes: 512, alerts: 0, status: 'Nominal' },
          { name: 'South District', nodes: 188, alerts: 5, status: 'Critical' },
        ].map((zone, i) => (
          <GlassPanel key={i} className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-headline-md text-lg text-primary">{zone.name}</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-label-caps ${zone.status === 'Critical' ? 'bg-functional-red/20 text-functional-red border border-functional-red/30' : zone.status === 'Warning' ? 'bg-functional-amber/20 text-functional-amber border border-functional-amber/30' : 'bg-primary-container/20 text-primary-container border border-primary-container/30'}`}>
                {zone.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-label-caps text-on-surface-variant mb-1">ACTIVE NODES</div>
                <div className="font-data-mono-lg text-xl">{zone.nodes}</div>
              </div>
              <div>
                <div className="text-[10px] font-label-caps text-on-surface-variant mb-1">ACTIVE ALERTS</div>
                <div className={`font-data-mono-lg text-xl ${zone.alerts > 0 ? 'text-functional-red' : ''}`}>{zone.alerts}</div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-sm hover:bg-surface-container-high transition">View Zone Map</button>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
};
