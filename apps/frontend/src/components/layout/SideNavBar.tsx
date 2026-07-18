import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/gis-heatmap', label: 'GIS Heatmap', icon: 'map' },
  { path: '/acoustic-ledger', label: 'Acoustic Ledger', icon: 'waves' },
  { path: '/water-quality', label: 'Water Quality', icon: 'opacity' },
  { path: '/thermal-hazards', label: 'Thermal Hazards', icon: 'thermostat' },
  { path: '/zones', label: 'Zones', icon: 'grid_view' },
  { path: '/device-fleet', label: 'Device Fleet', icon: 'router' },
];

export const SideNavBar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-surface-container-low/95 backdrop-blur-md border-r border-outline-variant/15 flex flex-col z-40">
      <div className="p-4 border-b border-outline-variant/15">
        <div className="text-on-surface-variant font-label-caps uppercase tracking-wider mb-2 text-[10px]">Entity</div>
        <div className="flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary-container">location_city</span>
          <span className="font-headline-md text-sm font-semibold">PMZ Authority</span>
        </div>
      </div>
      
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-primary-container text-on-primary-container' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest/50 hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-outline-variant/15 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-xl">settings</span>
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-xl">help</span>
          Support
        </button>
      </div>
    </aside>
  );
};
