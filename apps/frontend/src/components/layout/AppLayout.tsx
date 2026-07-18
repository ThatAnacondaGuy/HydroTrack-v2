import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavBar } from './TopNavBar';
import { SideNavBar } from './SideNavBar';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { useLiveTelemetry } from '../../hooks/useLiveTelemetry';

export const AppLayout: React.FC = () => {
  const isAuthenticated = useAuthGuard();
  useLiveTelemetry();

  if (!isAuthenticated) {
    return null; // Will redirect in useAuthGuard
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md selection:bg-primary-container/30">
      <TopNavBar />
      <SideNavBar />
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
