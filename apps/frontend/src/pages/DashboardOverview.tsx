import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { KpiCard } from '../components/ui/KpiCard';
import { StatusPill } from '../components/ui/StatusPill';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import apiClient from '../lib/apiClient';

export const DashboardOverview: React.FC = () => {
  const { alerts, devices, onlineDeviceCount } = useTelemetryStore();
  const [anomalies, setAnomalies] = useState<any[]>([]);
  
  useEffect(() => {
    // Fetch initial anomalies for the ledger
    apiClient.get('/anomalies?limit=4').then(res => {
      setAnomalies(res.data);
    }).catch(e => console.error(e));
  }, []);

  const criticalAlert = alerts.find(a => a.severity === 'critical' && !a.acknowledged);

  const mockTrendData = [
    { day: 'Mon', val: 120 }, { day: 'Tue', val: 135 }, { day: 'Wed', val: 180 },
    { day: 'Thu', val: 145 }, { day: 'Fri', val: 130 }, { day: 'Sat', val: 110 }, { day: 'Sun', val: 115 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Critical Alert Banner */}
      {criticalAlert && (
        <div className="bg-functional-red/10 border border-functional-red animate-pulse-red rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-functional-red text-3xl">warning</span>
            <div>
              <h3 className="font-headline-md text-functional-red font-bold">CRITICAL: {criticalAlert.type.replace('_', ' ')}</h3>
              <p className="text-on-surface font-data-mono-sm">Zone: {criticalAlert.zone} | Device: {criticalAlert.deviceId}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-surface-container text-on-surface rounded font-medium hover:bg-surface-container-high transition">IGNORE</button>
            <button className="px-4 py-2 bg-functional-red text-white rounded font-bold hover:bg-functional-red/90 transition shadow-lg shadow-functional-red/20">ACKNOWLEDGE</button>
          </div>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KpiCard label="Active Nodes" value={onlineDeviceCount || 1042} color="primary">
          <span className="material-symbols-outlined text-primary text-sm">router</span>
        </KpiCard>
        <KpiCard label="Avg Consumption" value="138" unit="L/DAY" color="primary">
          <span className="text-[10px] bg-primary-container/20 text-primary-container px-2 py-0.5 rounded font-label-caps">OPTIMAL</span>
        </KpiCard>
        <KpiCard label="Critical Alerts" value={alerts.filter(a => a.severity === 'critical').length} color="red">
          <span className="material-symbols-outlined text-functional-red text-sm">error</span>
        </KpiCard>
        <KpiCard label="Water Quality" value="99.8" unit="%" color="blue">
          <span className="text-[10px] bg-functional-blue/20 text-functional-blue px-2 py-0.5 rounded font-label-caps">COMPLIANT</span>
        </KpiCard>
        <GlassPanel className="p-4 flex flex-col justify-between">
          <div className="text-on-surface-variant font-label-caps uppercase tracking-wider mb-2 flex justify-between items-start">
            <span>NRW Estimate</span>
            <span className="material-symbols-outlined text-functional-amber text-sm">water_drop</span>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between items-end mb-1">
              <span className="font-data-mono-lg text-2xl font-bold text-functional-amber">8.4%</span>
              <span className="text-xs text-on-surface-variant">+0.2%</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-functional-amber h-full rounded-full" style={{ width: '8.4%' }}></div>
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* GIS Heatmap Panel */}
        <GlassPanel className="col-span-12 lg:col-span-8 relative overflow-hidden min-h-[400px] p-0">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#080d14] via-[#101b2a] to-[#0a121c] opacity-80 mix-blend-screen"></div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button className="bg-surface-container/80 backdrop-blur border border-outline-variant/30 p-2 rounded text-on-surface hover:bg-surface-container-high transition">
              <span className="material-symbols-outlined">layers</span>
            </button>
            <div className="bg-surface-container/80 backdrop-blur border border-outline-variant/30 rounded flex items-center px-3 text-sm">
              <span className="text-on-surface-variant font-label-caps mr-2">ZONE:</span>
              <span className="font-medium">All PMZ</span>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 z-10 bg-surface-container/80 backdrop-blur border border-outline-variant/30 p-3 rounded-lg flex flex-col gap-2">
            <span className="text-[10px] font-label-caps text-on-surface-variant">ANOMALY KEY</span>
            <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-functional-red"></div> Leak</div>
            <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-functional-amber"></div> Pressure</div>
          </div>
        </GlassPanel>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <GlassPanel className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-sm font-semibold">Live Alert Feed</h3>
              <span className="text-[10px] bg-functional-red/20 text-functional-red px-2 py-0.5 rounded font-label-caps flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-functional-red animate-pulse"></span> LIVE
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {alerts.slice(0, 5).map((a, i) => (
                <div key={i} className="flex gap-3 items-start border-l-2 border-functional-red/50 pl-3">
                  <span className="material-symbols-outlined text-functional-red text-sm mt-0.5">notification_important</span>
                  <div>
                    <div className="text-xs font-data-mono-sm text-on-surface-variant">{a.deviceId} • {new Date(a.timestamp).toLocaleTimeString()}</div>
                    <div className="text-sm font-medium mt-0.5">{a.type.replace('_', ' ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
          
          <GlassPanel className="p-4 h-48">
             <div className="text-sm font-semibold mb-2">Consumption Trend</div>
             <div className="h-32 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={mockTrendData}>
                   <XAxis dataKey="day" fontSize={10} tickLine={false} axisLine={false} stroke="#8b919f" />
                   <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: '#1c2025', border: 'none', borderRadius: '4px'}} />
                   <ReferenceLine y={150} stroke="#E8A93D" strokeDasharray="3 3" />
                   <Bar dataKey="val" fill="#2D8CFF" radius={[2, 2, 0, 0]} opacity={0.8} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </GlassPanel>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-12 gap-6">
        <GlassPanel className="col-span-12 lg:col-span-8 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline-md text-sm font-semibold">Acoustic Anomaly Ledger</h3>
            <button className="text-xs text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-on-surface-variant uppercase font-label-caps border-b border-outline-variant/30">
                <tr>
                  <th className="px-2 py-2">Device ID</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2 text-right">Confidence</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {(anomalies.length ? anomalies : [
                  { id: 1, deviceId: 'SN-8834', type: 'Micro-Leak', confidence: 94, status: 'Investigating' },
                  { id: 2, deviceId: 'SN-9102', type: 'Cavitation', confidence: 82, status: 'Open' },
                ]).map((item: any, i) => (
                  <tr key={i} className="data-grid-row hover:bg-surface-container-high/50 transition">
                    <td className="px-2 py-3 font-data-mono-sm text-on-surface">{item.deviceId}</td>
                    <td className="px-2 py-3">{item.type}</td>
                    <td className="px-2 py-3 text-right font-data-mono-sm text-primary">{item.confidence}%</td>
                    <td className="px-2 py-3"><StatusPill status={item.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>

        <GlassPanel className="col-span-12 lg:col-span-4 p-4 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-primary/20 text-primary px-2 py-0.5 rounded font-label-caps text-[10px] flex items-center gap-1">
             <span className="material-symbols-outlined text-xs">flare</span> UV-C ACTIVE
          </div>
          <div className="text-sm font-semibold text-on-surface-variant mb-4 self-start w-full">TDS Purity Level</div>
          
          <div className="relative w-40 h-40 flex items-center justify-center mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#262a30" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#2D8CFF" strokeWidth="8" strokeDasharray="283" strokeDashoffset="56" strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-data-mono-lg font-bold text-functional-blue">142</span>
              <span className="text-xs font-label-caps text-on-surface-variant">PPM SAFE</span>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
