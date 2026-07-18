import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { StatusPill } from '../components/ui/StatusPill';

export const DeviceFleet: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg-mobile text-2xl mb-1">Device Fleet Management</h2>
          <p className="text-on-surface-variant text-sm font-data-mono-sm">Hardware provisioning and lifecycle tracking.</p>
        </div>
        <button className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary-container/90 transition">
          <span className="material-symbols-outlined text-sm">add</span> Provision Node
        </button>
      </div>

      <GlassPanel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 flex gap-4 bg-surface-container-low/50">
          <input type="text" placeholder="Search MAC or ID..." className="bg-surface-container border border-outline-variant/30 rounded-lg py-1.5 px-3 text-sm focus:border-primary-container outline-none" />
          <select className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-1.5 text-sm outline-none">
            <option>All Statuses</option>
            <option>Online</option>
            <option>Offline</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-on-surface-variant uppercase font-label-caps bg-surface-container/30">
              <tr>
                <th className="px-4 py-3">Device ID</th>
                <th className="px-4 py-3">MAC Address</th>
                <th className="px-4 py-3">Firmware</th>
                <th className="px-4 py-3">Battery</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {[
                { id: 'SN-001', mac: '00:1A:2B:3C:4D:5E', fw: 'v3.0.1', bat: '98%', status: 'Online' },
                { id: 'SN-002', mac: '00:1A:2B:3C:4D:5F', fw: 'v3.0.0', bat: '12%', status: 'Warning' },
              ].map((dev, i) => (
                <tr key={i} className="data-grid-row">
                  <td className="px-4 py-3 font-data-mono-sm text-primary">{dev.id}</td>
                  <td className="px-4 py-3 font-data-mono-sm text-on-surface-variant">{dev.mac}</td>
                  <td className="px-4 py-3 font-data-mono-sm">{dev.fw}</td>
                  <td className={`px-4 py-3 font-data-mono-sm ${dev.bat.startsWith('1') ? 'text-functional-amber' : ''}`}>{dev.bat}</td>
                  <td className="px-4 py-3"><StatusPill status={dev.status} size="sm" /></td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-outline hover:text-primary"><span className="material-symbols-outlined text-sm">edit</span></button>
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
