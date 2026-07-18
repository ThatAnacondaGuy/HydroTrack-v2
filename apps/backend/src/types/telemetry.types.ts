export interface TelemetryPayload {
  deviceId: string;
  zone: string;
  timestamp: string;
  flow: { volumetricRateLpm: number; dailyTotalLiters: number; viscosityCompensated: boolean };
  thermal: { temperatureC: number; scaldRisk: boolean };
  waterQuality: { tdsPpm: number; uvcCycleActive: boolean };
  acoustic: { classification: 'Normal' | 'Micro-Leak' | 'Water Hammer' | 'Pipe Cavitation'; confidence: number; frequencyRangeHz: string | null };
  battery: { voltage: number; estDaysRemaining: number };
}

export interface AlertEvent {
  deviceId: string;
  zone: string;
  type: string;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: string;
  value: number;
  threshold: number;
}

export interface AnomalyRecord {
  id: string;
  deviceId: string;
  zone: string;
  type: string;
  severity: string;
  message: string;
  status: 'open' | 'acknowledged' | 'resolved';
  timestamp: string;
}

export interface DeviceGeo {
  deviceId: string;
  lat: number;
  lng: number;
  zone: string;
  status: 'online' | 'offline' | 'alert';
}

export interface DashboardSummary {
  activeNodes: number;
  avgConsumption: number;
  criticalAlerts: number;
  waterQualityCompliance: number;
  estimatedNRW: number;
}

export interface User {
  id: string;
  email: string;
  role: 'engineer' | 'admin';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
