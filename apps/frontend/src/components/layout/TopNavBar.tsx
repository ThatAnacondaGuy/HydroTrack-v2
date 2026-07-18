import React from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useAuthStore } from '../../store/useAuthStore';

export const TopNavBar: React.FC = () => {
  const { onlineDeviceCount } = useTelemetryStore();
  const { user, logout } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container/80 backdrop-blur-xl border-b border-outline-variant/15 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="font-headline-md text-primary font-bold text-xl tracking-tight">HydroTrack v3.0</h1>
        <div className="hidden md:flex items-center px-3 py-1 bg-surface-container-highest/50 rounded-full border border-outline-variant/30 ml-4">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse mr-2"></span>
          <span className="text-xs font-data-mono-sm text-on-surface-variant">{onlineDeviceCount} Nodes Online</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center flex-1 max-w-md px-8">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
          <input 
            type="text" 
            placeholder="Search zones, devices, or alerts..." 
            className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg py-1.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-functional-red rounded-full border-2 border-surface-container"></span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
          <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container font-semibold border border-primary-container/30 cursor-pointer" onClick={logout}>
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
