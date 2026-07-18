import { create } from 'zustand';

export interface DeviceTelemetry {
  deviceId: string;
  zone: string;
  timestamp: string;
  flowRate: number;
  dailyTotal: number;
  temperatureC: number;
  tdsPpm: number;
  acousticClass: string;
  acousticConfidence: number;
  batteryVoltage: number;
  scaldRisk: boolean;
  uvcActive: boolean;
  status: string;
}

export interface Alert {
  id: string;
  deviceId: string;
  zone: string;
  type: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  acknowledged: boolean;
}

interface TelemetryState {
  devices: Map<string, DeviceTelemetry>;
  alerts: Alert[];
  thermalHazards: Alert[];
  onlineDeviceCount: number;
  updateTelemetry: (payload: DeviceTelemetry) => void;
  addAlert: (alert: Alert) => void;
  updateDeviceStatus: (deviceId: string, status: string) => void;
  clearAlerts: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  devices: new Map(),
  alerts: [],
  thermalHazards: [],
  onlineDeviceCount: 0,
  updateTelemetry: (payload) =>
    set((state) => {
      const newDevices = new Map(state.devices);
      newDevices.set(payload.deviceId, payload);
      return { 
        devices: newDevices,
        onlineDeviceCount: Array.from(newDevices.values()).filter(d => d.status === 'online' || d.status === 'active' || d.status === 'warning' || d.status === 'critical').length
      };
    }),
  addAlert: (alert) =>
    set((state) => {
      const isThermal = alert.type.toLowerCase().includes('scald') || alert.type.toLowerCase().includes('temperature');
      const newAlerts = [alert, ...state.alerts].slice(0, 50);
      const newThermalHazards = isThermal ? [alert, ...state.thermalHazards].slice(0, 50) : state.thermalHazards;
      return { alerts: newAlerts, thermalHazards: newThermalHazards };
    }),
  updateDeviceStatus: (deviceId, status) =>
    set((state) => {
      const newDevices = new Map(state.devices);
      const device = newDevices.get(deviceId);
      if (device) {
        newDevices.set(deviceId, { ...device, status });
      }
      return { devices: newDevices };
    }),
  clearAlerts: () => set({ alerts: [], thermalHazards: [] }),
}));
