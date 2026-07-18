import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import apiClient from '../lib/apiClient';

export const GisHeatmap: React.FC = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  useEffect(() => {
    apiClient.get('/devices/geo').then(res => setDevices(res.data)).catch(e => {
       // Mock data
       setDevices([
         { id: 'SN-001', lat: 50, lng: 50, status: 'critical', zone: 'North' },
         { id: 'SN-002', lat: 30, lng: 70, status: 'active', zone: 'East' },
         { id: 'SN-003', lat: 60, lng: 20, status: 'warning', zone: 'West' }
       ]);
    });
  }, []);

  return (
    <div className="absolute inset-0 pt-16 pl-64 overflow-hidden bg-[#080d14]">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#080d14] via-[#101b2a] to-[#0a121c] mix-blend-screen pointer-events-none"></div>
      
      {/* Markers */}
      <div className="relative w-full h-full">
        {devices.map((dev, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedDevice(dev)}
            className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 border-2 border-surface-container hover:scale-150 transition-transform ${
              dev.status === 'critical' ? 'bg-functional-red shadow-[0_0_15px_rgba(227,67,43,0.8)] animate-pulse-red' :
              dev.status === 'warning' ? 'bg-functional-amber shadow-[0_0_10px_rgba(232,169,61,0.6)]' :
              'bg-primary-container shadow-[0_0_10px_rgba(45,140,255,0.4)]'
            }`}
            style={{ top: `${dev.lat}%`, left: `${dev.lng}%` }}
          ></div>
        ))}
      </div>

      {/* Floating Toolbar */}
      <GlassPanel className="absolute top-6 left-6 p-2 flex gap-2">
        <button className="p-2 hover:bg-surface-container-high rounded text-on-surface-variant transition"><span className="material-symbols-outlined text-sm">filter_list</span></button>
        <select className="bg-transparent border border-outline-variant/30 rounded px-2 text-sm outline-none font-label-caps">
          <option>ALL WARDS</option>
          <option>NORTH WARD</option>
        </select>
      </GlassPanel>

      {/* Legend */}
      <GlassPanel className="absolute bottom-6 left-6 p-4">
        <h4 className="text-[10px] font-label-caps text-on-surface-variant mb-3">NODE STATUS KEY</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-functional-red animate-pulse-red"></div> Critical Breach</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-functional-amber"></div> Warning / Anomaly</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-primary-container"></div> Online / Nominal</div>
        </div>
      </GlassPanel>

      {/* Drawer */}
      <div className={`absolute top-0 right-0 h-full w-96 bg-surface-container/95 backdrop-blur-xl border-l border-outline-variant/20 transform transition-transform duration-300 ease-in-out ${selectedDevice ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedDevice && (
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] font-label-caps text-on-surface-variant mb-1">DEVICE DETAILS</div>
                <h3 className="font-data-mono-lg text-primary text-xl">{selectedDevice.id}</h3>
                <p className="text-sm text-on-surface-variant">{selectedDevice.zone} Zone</p>
              </div>
              <button onClick={() => setSelectedDevice(null)} className="p-1 hover:bg-surface-container-high rounded-full transition">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
               <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                 <div className="text-[10px] font-label-caps text-on-surface-variant mb-1">Pressure</div>
                 <div className="font-data-mono-lg text-lg">4.2 <span className="text-xs text-on-surface-variant">BAR</span></div>
               </div>
               <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                 <div className="text-[10px] font-label-caps text-on-surface-variant mb-1">Flow Rate</div>
                 <div className="font-data-mono-lg text-lg">12.5 <span className="text-xs text-on-surface-variant">L/m</span></div>
               </div>
            </div>

            <div className="mt-auto space-y-3">
              <button className="w-full py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-sm font-medium hover:bg-surface-container-high transition">View Full Log</button>
              {selectedDevice.status === 'critical' && (
                <button className="w-full py-2 bg-functional-red text-white rounded-lg text-sm font-bold shadow-lg shadow-functional-red/20 hover:bg-functional-red/90 transition flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-sm">local_shipping</span> Dispatch Field Unit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
