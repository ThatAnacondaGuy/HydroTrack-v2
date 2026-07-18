import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { KpiCard } from '../components/ui/KpiCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { StatusPill } from '../components/ui/StatusPill';

export const WaterQualityMonitoring: React.FC = () => {
  const chartData = Array.from({length: 24}, (_, i) => ({
    time: `${i}:00`,
    tds: Math.floor(120 + Math.random() * 60 + (i === 14 ? 150 : 0)) // Spike at 14:00
  }));

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg-mobile text-2xl mb-1">Water Quality Monitoring</h2>
          <p className="text-on-surface-variant text-sm font-data-mono-sm">Real-time TDS and Sterilization metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassPanel className="p-4 flex items-center justify-between">
          <div>
            <div className="text-on-surface-variant font-label-caps mb-2">City-wide Avg TDS</div>
            <div className="text-3xl font-data-mono-lg text-functional-blue font-bold">142 <span className="text-sm font-data-mono-sm text-on-surface-variant">PPM</span></div>
          </div>
          <span className="material-symbols-outlined text-4xl text-functional-blue opacity-50">water_drop</span>
        </GlassPanel>
        
        <GlassPanel className="p-4 flex items-center justify-between">
          <div>
            <div className="text-on-surface-variant font-label-caps mb-2">UV-C Uptime</div>
            <div className="text-3xl font-data-mono-lg text-primary font-bold">99.9 <span className="text-sm font-data-mono-sm text-on-surface-variant">%</span></div>
          </div>
          <span className="material-symbols-outlined text-4xl text-primary opacity-50">flare</span>
        </GlassPanel>

        <GlassPanel className="p-4 flex items-center justify-between border-l-4 border-l-functional-red">
          <div>
            <div className="text-on-surface-variant font-label-caps mb-2">Out of Compliance</div>
            <div className="text-3xl font-data-mono-lg text-functional-red font-bold">2 <span className="text-sm font-data-mono-sm text-on-surface-variant">Nodes</span></div>
          </div>
          <span className="material-symbols-outlined text-4xl text-functional-red animate-pulse-red">warning</span>
        </GlassPanel>
      </div>

      <GlassPanel className="p-4 h-72">
        <div className="text-sm font-semibold mb-4">TDS Compliance Trend (24h)</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" fontSize={10} stroke="#8b919f" />
            <YAxis fontSize={10} stroke="#8b919f" />
            <Tooltip contentStyle={{background: '#1c2025', border: 'none', borderRadius: '4px'}} />
            <ReferenceLine y={300} stroke="#E3432B" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '300 PPM Limit', fill: '#E3432B', fontSize: 10 }} />
            <Line type="monotone" dataKey="tds" stroke="#2D8CFF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </GlassPanel>

      <GlassPanel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 text-sm font-semibold">Device Compliance Ledger</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-on-surface-variant uppercase font-label-caps bg-surface-container/30">
              <tr>
                <th className="px-4 py-3">Device ID</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">TDS Level</th>
                <th className="px-4 py-3">UV-C Status</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {[
                { id: 'SN-102', zone: 'North', tds: 140, uvc: true, status: 'Online' },
                { id: 'SN-405', zone: 'East', tds: 310, uvc: false, status: 'Critical' },
              ].map((item, i) => (
                <tr key={i} className="data-grid-row">
                  <td className="px-4 py-3 font-data-mono-sm text-primary">{item.id}</td>
                  <td className="px-4 py-3">{item.zone}</td>
                  <td className={`px-4 py-3 font-data-mono-sm ${item.tds > 300 ? 'text-functional-red font-bold' : ''}`}>{item.tds} PPM</td>
                  <td className="px-4 py-3">
                    {item.uvc ? <span className="text-primary text-xs flex items-center gap-1"><span className="material-symbols-outlined text-sm">flare</span> Active</span> : <span className="text-on-surface-variant text-xs">Inactive</span>}
                  </td>
                  <td className="px-4 py-3"><StatusPill status={item.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
};
