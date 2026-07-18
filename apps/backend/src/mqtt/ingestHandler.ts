import pino from 'pino';
import { Point } from '@influxdata/influxdb-client';
import { influxClient } from '../db/influxClient.js';
import { telemetryPayloadSchema } from './payloadSchema.js';
import { evaluate } from '../services/alertRules.js';
import { v4 as uuidv4 } from 'uuid';

const logger = pino();

export function handleIngest(rawPayload: unknown) {
  const result = telemetryPayloadSchema.safeParse(rawPayload);
  
  if (!result.success) {
    logger.warn({ error: result.error }, 'Dropped invalid telemetry packet');
    return;
  }

  const payload = result.data;

  try {
    const point = new Point('device_telemetry')
      .tag('device_id', payload.deviceId)
      .tag('zone', payload.zone)
      .floatField('flow_rate_lpm', payload.flow.volumetricRateLpm)
      .floatField('daily_total_liters', payload.flow.dailyTotalLiters)
      .floatField('temperature_c', payload.thermal.temperatureC)
      .floatField('tds_ppm', payload.waterQuality.tdsPpm)
      .floatField('acoustic_confidence', payload.acoustic.confidence)
      .floatField('battery_voltage', payload.battery.voltage)
      .booleanField('scald_risk', payload.thermal.scaldRisk)
      .booleanField('uvc_active', payload.waterQuality.uvcCycleActive)
      .timestamp(new Date(payload.timestamp));

    influxClient.writeApi.writePoint(point);

    const alerts = evaluate(payload);
    
    for (const alert of alerts) {
      const alertPoint = new Point('anomaly_events')
        .tag('device_id', payload.deviceId)
        .tag('zone', payload.zone)
        .tag('anomaly_type', alert.type)
        .tag('severity', alert.severity)
        .stringField('message', alert.message)
        .stringField('status', 'open')
        .stringField('id', uuidv4())
        .floatField('value', alert.value)
        .floatField('threshold', alert.threshold)
        .timestamp(new Date(payload.timestamp));
        
      influxClient.writeApi.writePoint(alertPoint);
    }
  } catch (error) {
    logger.error({ error }, 'Failed to write telemetry to InfluxDB');
  }
}
