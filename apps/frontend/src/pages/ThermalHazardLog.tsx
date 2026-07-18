import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { StatusPill } from '../components/ui/StatusPill';

export const ThermalHazardLog: React.FC = () => {
  const { thermalHazards } = useTelemetryStore();
  
  const activeHazards = thermalHazards.filter(h => !h.acknowledged);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display-lg-mobile text-2xl mb-1 flex items-center gap-2">
            Thermal Hazard Log 
            <span className="bg-functional-red/20 text-functional-red px-2 py-0.5 rounded text-xs font-label-caps border border-functional-red/30">&gt;50°C THRESHOLD</span>
          </h2>
          <p className="text-on-surface-variant text-sm font-data-mono-sm">Monitoring extreme temperature anomalies to prevent scald risks.</p>
        </div>
        {activeHazards.length > 0 && (
          <div className="bg-functional-red px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(227,67,43,0.4)] animate-pulse">
            <span className="text-white font-bold text-sm">{activeHazards.length} ACTIVE HAZARDS</span>
          </div>
        )}
      </div>

      {activeHazards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeHazards.map(hazard => (
            <div key={hazard.id} className="bg-functional-red/10 border border-functional-red rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-functional-red animate-ping"></span>
                <span className="text-functional-red font-label-caps text-[10px]">LIVE</span>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-functional-red/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-functional-red">thermostat</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-functional-red">Scald Risk Detected</h3>
                  <div className="text-sm font-data-mono-sm mt-1">Device: {hazard.deviceId} | Zone: {hazard.zone}</div>
                  <div className="text-xs text-on-surface-variant mt-1">{new Date(hazard.timestamp).toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="flex-1 bg-functional-red text-white py-1.5 rounded font-bold text-sm shadow-lg shadow-functional-red/20 hover:bg-functional-red/90 transition">ACKNOWLEDGE BREACH</button>
                <button className="px-3 bg-surface-container border border-outline-variant/30 rounded text-on-surface hover:bg-surface-container-high transition">
                  <span className="material-symbols-outlined text-sm">map</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <GlassPanel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 text-sm font-semibold">Incident Resolution History</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-on-surface-variant uppercase font-label-caps bg-surface-container/30">
              <tr>
                <th className="px-4 py-3">Device ID</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Peak Temp</th>
                <th className="px-4 py-3">Detected At</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {thermalHazards.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-on-surface-variant">No history recorded.</td></tr>
              ) : thermalHazards.map((item, i) => (
                <tr key={item.id || i} className="data-grid-row">
                  <td className="px-4 py-3 font-data-mono-sm text-primary">{item.deviceId}</td>
                  <td className="px-4 py-3">{item.zone}</td>
                  <td className="px-4 py-3 font-data-mono-sm text-functional-red font-bold">52.4°C</td>
                  <td className="px-4 py-3 font-data-mono-sm text-on-surface-variant">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusPill status={item.acknowledged ? 'Resolved' : 'Breaching'} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
};
