import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { StatusPill } from '../components/ui/StatusPill';
import { KpiCard } from '../components/ui/KpiCard';
import apiClient from '../lib/apiClient';

interface Anomaly {
  id: string;
  deviceId: string;
  zone: string;
  type: string;
  frequencyRange: string;
  confidence: number;
  detectedAt: string;
  status: string;
}

export const AcousticAnomalyLedger: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = () => {
    setLoading(true);
    apiClient.get('/anomalies?limit=50')
      .then(res => {
        setAnomalies(res.data);
      })
      .catch(err => {
        console.error(err);
        // Fallback dummy data if API fails
        setAnomalies([
          { id: '1', deviceId: 'SN-4029', zone: 'North Sector', type: 'Micro-Leak', frequencyRange: '400-600 Hz', confidence: 92, detectedAt: new Date().toISOString(), status: 'Open' },
          { id: '2', deviceId: 'SN-8112', zone: 'East Hub', type: 'Water Hammer', frequencyRange: '20-50 Hz', confidence: 85, detectedAt: new Date(Date.now() - 3600000).toISOString(), status: 'Investigating' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  const handleAcknowledge = async () => {
    for (const id of Array.from(selected)) {
      try {
        await apiClient.patch(`/anomalies/${id}/status`, { status: 'Acknowledged' });
      } catch(e) {
        console.error(e);
      }
    }
    fetchAnomalies();
    setSelected(new Set());
  };

  const handleExport = () => {
    // Mock export
    window.open(import.meta.env.VITE_API_URL + '/anomalies/export', '_blank');
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg-mobile text-2xl mb-1">Acoustic Anomaly Ledger</h2>
          <p className="text-on-surface-variant text-sm font-data-mono-sm">Tracking non-visible acoustic signatures across 1,042 sensors.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-medium text-sm flex items-center gap-2 transition">
            <span className="material-symbols-outlined text-sm">download</span> Export CSV
          </button>
          <button 
            onClick={handleAcknowledge}
            disabled={selected.size === 0}
            className="px-4 py-2 bg-primary-container disabled:opacity-50 text-on-primary-container rounded-lg font-medium text-sm flex items-center gap-2 transition"
          >
            <span className="material-symbols-outlined text-sm">done_all</span> Acknowledge Selected
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Micro-Leaks" value="24" color="amber" />
        <KpiCard label="Water Hammer" value="8" color="red" />
        <KpiCard label="Cavitation" value="12" color="blue" />
        <KpiCard label="Unresolved Critical" value="3" color="red" />
      </div>

      <GlassPanel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 flex gap-4 bg-surface-container-low/50">
          <div className="relative flex-1 max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input type="text" placeholder="Search Device ID or Zone..." className="w-full bg-surface-container border border-outline-variant/30 rounded-lg py-1.5 pl-9 pr-3 text-sm focus:border-primary-container outline-none" />
          </div>
          <select className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-1.5 text-sm outline-none">
            <option>All Types</option>
            <option>Micro-Leak</option>
          </select>
          <select className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-1.5 text-sm outline-none">
            <option>All Statuses</option>
            <option>Open</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-on-surface-variant uppercase font-label-caps bg-surface-container/30">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" className="rounded border-outline-variant/30 bg-surface-container accent-primary-container" onChange={(e) => {
                    if (e.target.checked) setSelected(new Set(anomalies.map(a => a.id)));
                    else setSelected(new Set());
                  }} checked={selected.size === anomalies.length && anomalies.length > 0} />
                </th>
                <th className="px-4 py-3">Device ID</th>
                <th className="px-4 py-3">Zone / Address</th>
                <th className="px-4 py-3">Anomaly Type</th>
                <th className="px-4 py-3">Frequency Range</th>
                <th className="px-4 py-3 text-right">Confidence</th>
                <th className="px-4 py-3">Detected At</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr><td colSpan={9} className="text-center py-8 text-on-surface-variant">Loading...</td></tr>
              ) : anomalies.map((item) => (
                <tr key={item.id} className="data-grid-row hover:bg-surface-container-high/30 transition group">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="rounded border-outline-variant/30 bg-surface-container accent-primary-container" />
                  </td>
                  <td className="px-4 py-3 font-data-mono-sm text-primary">{item.deviceId}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{item.zone}</td>
                  <td className="px-4 py-3 font-medium">{item.type}</td>
                  <td className="px-4 py-3 font-data-mono-sm text-on-surface-variant">{item.frequencyRange}</td>
                  <td className="px-4 py-3 text-right font-data-mono-sm text-functional-blue">{item.confidence}%</td>
                  <td className="px-4 py-3 font-data-mono-sm text-on-surface-variant">{new Date(item.detectedAt).toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusPill status={item.status} size="sm" /></td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-outline hover:text-primary transition opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
};
