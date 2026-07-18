/**
 * HydroTrack v3.0 — Historical Data Seed Script
 * 
 * Writes 30 days of historical telemetry directly to InfluxDB (bypassing MQTT)
 * so trend charts, tables, and historical views have data on first load.
 * 
 * Usage: npx tsx scripts/seedHistoricalData.ts
 * 
 * Run ONCE after docker-compose up, before starting the live seed script.
 */

import { InfluxDB, Point } from '@influxdata/influxdb-client';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const INFLUXDB_URL = process.env.INFLUXDB_URL || 'http://localhost:8086';
const INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN || 'hydrotrack-dev-token';
const INFLUXDB_ORG = process.env.INFLUXDB_ORG || 'hydrotrack';
const INFLUXDB_BUCKET = process.env.INFLUXDB_BUCKET || 'hydrotrack_telemetry';
const DAYS_OF_HISTORY = 30;
const POINTS_PER_HOUR = 4; // one reading every 15 minutes

// ─── DEVICE FLEET (same as seedDemoData) ─────────────────────────────────────
const DEVICES = [
  { deviceId: 'HT-4F2A', zone: 'Ward-5-Shivajinagar', baseFlowRate: 6.4, baseDailyLiters: 120, baseTemp: 24.1, baseTds: 180 },
  { deviceId: 'HT-88C1', zone: 'Ward-8-Erandwane', baseFlowRate: 7.2, baseDailyLiters: 138, baseTemp: 28.5, baseTds: 165 },
  { deviceId: 'HT-11B8', zone: 'Ward-2-Aundh', baseFlowRate: 5.8, baseDailyLiters: 110, baseTemp: 23.4, baseTds: 195 },
  { deviceId: 'HT-32X0', zone: 'Ward-12-Kothrud', baseFlowRate: 8.1, baseDailyLiters: 155, baseTemp: 25.0, baseTds: 210 },
  { deviceId: 'HT-92K4', zone: 'Ward-12-Kothrud', baseFlowRate: 6.0, baseDailyLiters: 105, baseTemp: 22.8, baseTds: 175 },
  { deviceId: 'HT-99B1', zone: 'Ward-8-Baner', baseFlowRate: 7.5, baseDailyLiters: 142, baseTemp: 24.8, baseTds: 342 },
  { deviceId: 'HT-12C8', zone: 'Ward-15-Shivajinagar', baseFlowRate: 5.2, baseDailyLiters: 98, baseTemp: 23.1, baseTds: 220 },
  { deviceId: 'HT-55D4', zone: 'Ward-12-Kothrud', baseFlowRate: 6.8, baseDailyLiters: 130, baseTemp: 25.5, baseTds: 190 },
  { deviceId: 'HT-7A23', zone: 'Ward-8-Baner', baseFlowRate: 5.5, baseDailyLiters: 115, baseTemp: 24.0, baseTds: 200 },
  { deviceId: 'HT-22F0', zone: 'Ward-15-Shivajinagar', baseFlowRate: 7.0, baseDailyLiters: 135, baseTemp: 23.8, baseTds: 185 },
  { deviceId: 'HT-88E2', zone: 'Ward-8-Baner', baseFlowRate: 6.3, baseDailyLiters: 125, baseTemp: 24.5, baseTds: 178 },
  { deviceId: 'HT-33A1', zone: 'Ward-12-Kothrud', baseFlowRate: 5.9, baseDailyLiters: 112, baseTemp: 25.2, baseTds: 205 },
  { deviceId: 'HT-44C9', zone: 'Ward-15-Shivajinagar', baseFlowRate: 7.8, baseDailyLiters: 148, baseTemp: 23.5, baseTds: 172 },
  { deviceId: 'HT-11B0', zone: 'Ward-8-Baner', baseFlowRate: 6.1, baseDailyLiters: 118, baseTemp: 24.3, baseTds: 188 },
  { deviceId: 'HT-09X2', zone: 'Ward-12-Kothrud', baseFlowRate: 5.7, baseDailyLiters: 108, baseTemp: 25.8, baseTds: 215 },
  { deviceId: 'HT-66G5', zone: 'Ward-15-Shivajinagar', baseFlowRate: 6.6, baseDailyLiters: 128, baseTemp: 23.9, baseTds: 182 },
  { deviceId: 'HT-2B77', zone: 'Ward-5-Shivajinagar', baseFlowRate: 7.3, baseDailyLiters: 140, baseTemp: 24.6, baseTds: 176 },
  { deviceId: 'HT-44D9', zone: 'Ward-22-Kharadi', baseFlowRate: 5.4, baseDailyLiters: 102, baseTemp: 22.5, baseTds: 168 },
  { deviceId: 'HT-11A0', zone: 'Ward-8-Baner', baseFlowRate: 6.9, baseDailyLiters: 132, baseTemp: 24.2, baseTds: 192 },
  { deviceId: 'HT-99X2', zone: 'Ward-22-Hadapsar', baseFlowRate: 7.6, baseDailyLiters: 145, baseTemp: 25.1, baseTds: 198 },
];

const ANOMALY_TYPES = ['Micro-Leak', 'Water Hammer', 'Pipe Cavitation', 'Thermal-Hazard'] as const;
const ANOMALY_STATUSES = ['open', 'acknowledged', 'resolved'] as const;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function jitter(base: number, maxPercent: number): number {
  const factor = 1 + (Math.random() * 2 - 1) * (maxPercent / 100);
  return parseFloat((base * factor).toFixed(2));
}

function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌊 HydroTrack v3.0 — Historical Data Seed');
  console.log(`📊 Writing ${DAYS_OF_HISTORY} days of history to InfluxDB at ${INFLUXDB_URL}`);

  const client = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_TOKEN });
  const writeApi = client.getWriteApi(INFLUXDB_ORG, INFLUXDB_BUCKET, 's');
  writeApi.useDefaultTags({ source: 'seed-historical' });

  const now = new Date();
  let totalPoints = 0;
  let totalAnomalies = 0;

  for (let dayOffset = DAYS_OF_HISTORY; dayOffset >= 0; dayOffset--) {
    const dayDate = new Date(now);
    dayDate.setDate(dayDate.getDate() - dayOffset);

    for (let hour = 0; hour < 24; hour++) {
      for (let pointIdx = 0; pointIdx < POINTS_PER_HOUR; pointIdx++) {
        const timestamp = new Date(dayDate);
        timestamp.setHours(hour, pointIdx * 15, Math.floor(Math.random() * 60));

        for (const device of DEVICES) {
          // Add time-of-day variation (more consumption during day)
          const timeMultiplier = hour >= 6 && hour <= 22 ? 1.0 + Math.sin((hour - 6) / 16 * Math.PI) * 0.3 : 0.4;

          const point = new Point('device_telemetry')
            .tag('device_id', device.deviceId)
            .tag('zone', device.zone)
            .floatField('flow_rate_lpm', jitter(device.baseFlowRate * timeMultiplier, 15))
            .floatField('daily_total_liters', jitter(device.baseDailyLiters, 20))
            .floatField('temperature_c', jitter(device.baseTemp, 10))
            .intField('tds_ppm', Math.round(jitter(device.baseTds, 12)))
            .floatField('acoustic_confidence', 0.0)
            .floatField('battery_voltage', jitter(3.6, 5))
            .booleanField('scald_risk', false)
            .booleanField('uvc_active', Math.random() > 0.05)
            .timestamp(timestamp);

          writeApi.writePoint(point);
          totalPoints++;
        }

        // Randomly generate anomaly events (~2% of 15-min windows)
        if (Math.random() < 0.02) {
          const device = randomPick(DEVICES);
          const anomalyType = randomPick(ANOMALY_TYPES);
          const status = dayOffset > 2 ? 'resolved' : randomPick(ANOMALY_STATUSES);

          const anomalyPoint = new Point('anomaly_events')
            .tag('device_id', device.deviceId)
            .tag('zone', device.zone)
            .tag('anomaly_type', anomalyType)
            .floatField('confidence', parseFloat((0.6 + Math.random() * 0.4).toFixed(2)))
            .stringField('frequency_range_hz', `${Math.round(50 + Math.random() * 1000)} Hz - ${Math.round(1500 + Math.random() * 3000)} Hz`)
            .floatField('peak_value', anomalyType === 'Thermal-Hazard' ? jitter(55, 15) : jitter(0.85, 10))
            .stringField('status', status)
            .timestamp(timestamp);

          writeApi.writePoint(anomalyPoint);
          totalAnomalies++;
        }
      }
    }

    // Progress logging every 5 days
    if (dayOffset % 5 === 0) {
      console.log(`   📅 Day -${dayOffset}: ${totalPoints} telemetry points, ${totalAnomalies} anomaly events`);
      await writeApi.flush();
    }
  }

  console.log(`\n⏳ Flushing final writes to InfluxDB...`);
  await writeApi.close();

  console.log(`\n✅ Historical data seed complete!`);
  console.log(`   📊 Total telemetry points: ${totalPoints.toLocaleString()}`);
  console.log(`   ⚡ Total anomaly events: ${totalAnomalies.toLocaleString()}`);
  console.log(`   📅 Date range: ${DAYS_OF_HISTORY} days`);
  console.log(`   🔧 Devices: ${DEVICES.length}`);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
