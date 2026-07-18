import { TelemetryPayload, AlertEvent } from '../types/telemetry.types.js';
import * as thresholds from '../config/thresholds.js';

export function evaluate(payload: TelemetryPayload): AlertEvent[] {
  const alerts: AlertEvent[] = [];

  // Consumption limits
  if (payload.flow.dailyTotalLiters >= thresholds.TARGET_150_CRITICAL_LITERS) {
    alerts.push({
      deviceId: payload.deviceId,
      zone: payload.zone,
      type: 'Consumption Limit',
      severity: 'critical',
      message: `Daily limit exceeded: ${payload.flow.dailyTotalLiters}L`,
      timestamp: payload.timestamp,
      value: payload.flow.dailyTotalLiters,
      threshold: thresholds.TARGET_150_CRITICAL_LITERS
    });
  } else if (payload.flow.dailyTotalLiters >= thresholds.TARGET_150_WARNING_LITERS) {
    alerts.push({
      deviceId: payload.deviceId,
      zone: payload.zone,
      type: 'Consumption Limit',
      severity: 'warning',
      message: `Daily warning limit reached: ${payload.flow.dailyTotalLiters}L`,
      timestamp: payload.timestamp,
      value: payload.flow.dailyTotalLiters,
      threshold: thresholds.TARGET_150_WARNING_LITERS
    });
  }

  // Thermal hazards
  if (payload.thermal.temperatureC >= thresholds.THERMAL_HAZARD_CRITICAL_C || payload.thermal.scaldRisk) {
    alerts.push({
      deviceId: payload.deviceId,
      zone: payload.zone,
      type: 'Thermal Hazard',
      severity: 'critical',
      message: `Scald risk detected! Temp: ${payload.thermal.temperatureC}C`,
      timestamp: payload.timestamp,
      value: payload.thermal.temperatureC,
      threshold: thresholds.THERMAL_HAZARD_CRITICAL_C
    });
  }

  // TDS / Water Quality
  if (payload.waterQuality.tdsPpm >= thresholds.TDS_UNSAFE_PPM) {
    alerts.push({
      deviceId: payload.deviceId,
      zone: payload.zone,
      type: 'Water Quality',
      severity: 'critical',
      message: `Unsafe TDS level: ${payload.waterQuality.tdsPpm} PPM`,
      timestamp: payload.timestamp,
      value: payload.waterQuality.tdsPpm,
      threshold: thresholds.TDS_UNSAFE_PPM
    });
  } else if (payload.waterQuality.tdsPpm >= thresholds.TDS_WATCH_PPM) {
    alerts.push({
      deviceId: payload.deviceId,
      zone: payload.zone,
      type: 'Water Quality',
      severity: 'warning',
      message: `High TDS level watch: ${payload.waterQuality.tdsPpm} PPM`,
      timestamp: payload.timestamp,
      value: payload.waterQuality.tdsPpm,
      threshold: thresholds.TDS_WATCH_PPM
    });
  }

  // Acoustic Anomaly
  if (payload.acoustic.classification !== 'Normal' && payload.acoustic.confidence >= thresholds.ACOUSTIC_CONFIDENCE_THRESHOLD) {
    const severity = payload.acoustic.classification === 'Pipe Cavitation' ? 'critical' : 'warning';
    alerts.push({
      deviceId: payload.deviceId,
      zone: payload.zone,
      type: 'Acoustic Anomaly',
      severity,
      message: `Acoustic anomaly detected: ${payload.acoustic.classification}`,
      timestamp: payload.timestamp,
      value: payload.acoustic.confidence,
      threshold: thresholds.ACOUSTIC_CONFIDENCE_THRESHOLD
    });
  }

  return alerts;
}
