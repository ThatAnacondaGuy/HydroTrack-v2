import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { DashboardOverview } from './pages/DashboardOverview';
import { AcousticAnomalyLedger } from './pages/AcousticAnomalyLedger';
import { GisHeatmap } from './pages/GisHeatmap';
import { WaterQualityMonitoring } from './pages/WaterQualityMonitoring';
import { ThermalHazardLog } from './pages/ThermalHazardLog';
import { DeviceFleet } from './pages/DeviceFleet';
import { Zones } from './pages/Zones';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="gis-heatmap" element={<GisHeatmap />} />
        <Route path="acoustic-ledger" element={<AcousticAnomalyLedger />} />
        <Route path="water-quality" element={<WaterQualityMonitoring />} />
        <Route path="thermal-hazards" element={<ThermalHazardLog />} />
        <Route path="device-fleet" element={<DeviceFleet />} />
        <Route path="zones" element={<Zones />} />
      </Route>
    </Routes>
  );
};

export default App;
