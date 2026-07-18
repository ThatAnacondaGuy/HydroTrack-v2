/**
 * HydroTrack v3.0 — Synthetic Live Data Seed Script
 * 
 * Publishes realistic fake ESP32 Gateway MQTT payloads on a timer,
 * simulating a fleet of ~20 IoT devices across Pune's water network.
 * 
 * Usage: npx tsx scripts/seedDemoData.ts
 * 
 * This script makes the live dashboard visibly "move" during judging:
 * - Every 3s: publishes telemetry for 3-5 random devices
 * - Every 10s: publishes device status/heartbeat for all devices
 * - Occasionally triggers anomalies (micro-leak, water hammer, cavitation, thermal hazard)
 */

import mqtt from 'mqtt';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const TELEMETRY_INTERVAL_MS = 3000;
const HEARTBEAT_INTERVAL_MS = 10000;
const ANOMALY_PROBABILITY = 0.15; // 15% chance per cycle of triggering an anomaly
const THERMAL_HAZARD_PROBABILITY = 0.05; // 5% chance of a thermal hazard

// ─── DEVICE FLEET ────────────────────────────────────────────────────────────
interface DeviceConfig {
  deviceId: string;
  zone: string;
  baseFlowRate: number;
  baseDailyLiters: number;
  baseTemp: number;
  baseTds: number;
  batteryVoltage: number;
  batteryDays: number;
}

const DEVICES: DeviceConfig[] = [
  { deviceId: 'HT-4F2A', zone: 'Ward-5-Shivajinagar', baseFlowRate: 6.4, baseDailyLiters: 120, baseTemp: 24.1, baseTds: 180, batteryVoltage: 3.71, batteryDays: 214 },
  { deviceId: 'HT-88C1', zone: 'Ward-8-Erandwane', baseFlowRate: 7.2, baseDailyLiters: 138, baseTemp: 28.5, baseTds: 165, batteryVoltage: 3.55, batteryDays: 180 },
  { deviceId: 'HT-11B8', zone: 'Ward-2-Aundh', baseFlowRate: 5.8, baseDailyLiters: 110, baseTemp: 23.4, baseTds: 195, batteryVoltage: 3.82, batteryDays: 245 },
  { deviceId: 'HT-32X0', zone: 'Ward-12-Kothrud', baseFlowRate: 8.1, baseDailyLiters: 155, baseTemp: 25.0, baseTds: 210, batteryVoltage: 3.40, batteryDays: 150 },
  { deviceId: 'HT-92K4', zone: 'Ward-12-Kothrud', baseFlowRate: 6.0, baseDailyLiters: 105, baseTemp: 22.8, baseTds: 175, batteryVoltage: 3.90, batteryDays: 260 },
  { deviceId: 'HT-99B1', zone: 'Ward-8-Baner', baseFlowRate: 7.5, baseDailyLiters: 142, baseTemp: 24.8, baseTds: 342, batteryVoltage: 3.30, batteryDays: 120 },
  { deviceId: 'HT-12C8', zone: 'Ward-15-Shivajinagar', baseFlowRate: 5.2, baseDailyLiters: 98, baseTemp: 23.1, baseTds: 220, batteryVoltage: 3.65, batteryDays: 200 },
  { deviceId: 'HT-55D4', zone: 'Ward-12-Kothrud', baseFlowRate: 6.8, baseDailyLiters: 130, baseTemp: 25.5, baseTds: 190, batteryVoltage: 3.75, batteryDays: 220 },
  { deviceId: 'HT-7A23', zone: 'Ward-8-Baner', baseFlowRate: 5.5, baseDailyLiters: 115, baseTemp: 24.0, baseTds: 200, batteryVoltage: 3.60, batteryDays: 190 },
  { deviceId: 'HT-22F0', zone: 'Ward-15-Shivajinagar', baseFlowRate: 7.0, baseDailyLiters: 135, baseTemp: 23.8, baseTds: 185, batteryVoltage: 3.50, batteryDays: 170 },
  { deviceId: 'HT-88E2', zone: 'Ward-8-Baner', baseFlowRate: 6.3, baseDailyLiters: 125, baseTemp: 24.5, baseTds: 178, batteryVoltage: 3.68, batteryDays: 205 },
  { deviceId: 'HT-33A1', zone: 'Ward-12-Kothrud', baseFlowRate: 5.9, baseDailyLiters: 112, baseTemp: 25.2, baseTds: 205, batteryVoltage: 3.45, batteryDays: 155 },
  { deviceId: 'HT-44C9', zone: 'Ward-15-Shivajinagar', baseFlowRate: 7.8, baseDailyLiters: 148, baseTemp: 23.5, baseTds: 172, batteryVoltage: 3.78, batteryDays: 230 },
  { deviceId: 'HT-11B0', zone: 'Ward-8-Baner', baseFlowRate: 6.1, baseDailyLiters: 118, baseTemp: 24.3, baseTds: 188, batteryVoltage: 3.62, batteryDays: 195 },
  { deviceId: 'HT-09X2', zone: 'Ward-12-Kothrud', baseFlowRate: 5.7, baseDailyLiters: 108, baseTemp: 25.8, baseTds: 215, batteryVoltage: 3.35, batteryDays: 140 },
  { deviceId: 'HT-66G5', zone: 'Ward-15-Shivajinagar', baseFlowRate: 6.6, baseDailyLiters: 128, baseTemp: 23.9, baseTds: 182, batteryVoltage: 3.72, batteryDays: 215 },
  { deviceId: 'HT-2B77', zone: 'Ward-5-Shivajinagar', baseFlowRate: 7.3, baseDailyLiters: 140, baseTemp: 24.6, baseTds: 176, batteryVoltage: 3.58, batteryDays: 185 },
  { deviceId: 'HT-44D9', zone: 'Ward-22-Kharadi', baseFlowRate: 5.4, baseDailyLiters: 102, baseTemp: 22.5, baseTds: 168, batteryVoltage: 3.85, batteryDays: 250 },
  { deviceId: 'HT-11A0', zone: 'Ward-8-Baner', baseFlowRate: 6.9, baseDailyLiters: 132, baseTemp: 24.2, baseTds: 192, batteryVoltage: 3.48, batteryDays: 160 },
  { deviceId: 'HT-99X2', zone: 'Ward-22-Hadapsar', baseFlowRate: 7.6, baseDailyLiters: 145, baseTemp: 25.1, baseTds: 198, batteryVoltage: 3.42, batteryDays: 148 },
];

const ANOMALY_TYPES = ['Micro-Leak', 'Water Hammer', 'Pipe Cavitation'] as const;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function jitter(base: number, maxPercent: number): number {
  const factor = 1 + (Math.random() * 2 - 1) * (maxPercent / 100);
  return parseFloat((base * factor).toFixed(2));
}

function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset<T>(arr: readonly T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function nowISO(): string {
  return new Date().toISOString();
}

// ─── PAYLOAD GENERATORS ──────────────────────────────────────────────────────
function buildTelemetryPayload(device: DeviceConfig, forceAnomaly?: typeof ANOMALY_TYPES[number], forceThermal?: boolean) {
  const isAnomaly = forceAnomaly || (Math.random() < ANOMALY_PROBABILITY ? randomPick(ANOMALY_TYPES) : null);
  const isThermalHazard = forceThermal || Math.random() < THERMAL_HAZARD_PROBABILITY;
  const temp = isThermalHazard ? jitter(55, 15) : jitter(device.baseTemp, 10);

  return {
    deviceId: device.deviceId,
    zone: device.zone,
    timestamp: nowISO(),
    flow: {
      volumetricRateLpm: jitter(device.baseFlowRate, 15),
      dailyTotalLiters: jitter(device.baseDailyLiters, 20),
      viscosityCompensated: true,
    },
    thermal: {
      temperatureC: parseFloat(temp.toFixed(1)),
      scaldRisk: temp > 50,
    },
    waterQuality: {
      tdsPpm: Math.round(jitter(device.baseTds, 15)),
      uvcCycleActive: Math.random() > 0.05, // 95% uptime
    },
    acoustic: {
      classification: isAnomaly || 'Normal',
      confidence: isAnomaly ? parseFloat((0.5 + Math.random() * 0.5).toFixed(2)) : 0.0,
      frequencyRangeHz: isAnomaly ? `${Math.round(50 + Math.random() * 1000)} Hz - ${Math.round(1500 + Math.random() * 3000)} Hz` : null,
    },
    battery: {
      voltage: jitter(device.batteryVoltage, 2),
      estDaysRemaining: device.batteryDays,
    },
  };
}

function buildStatusPayload(device: DeviceConfig) {
  return {
    deviceId: device.deviceId,
    zone: device.zone,
    status: 'online',
    battery: {
      voltage: jitter(device.batteryVoltage, 2),
      estDaysRemaining: device.batteryDays,
    },
    timestamp: nowISO(),
  };
}

function buildAlertPayload(device: DeviceConfig, type: string, severity: 'warning' | 'critical', message: string) {
  return {
    deviceId: device.deviceId,
    zone: device.zone,
    type,
    severity,
    message,
    timestamp: nowISO(),
  };
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌊 HydroTrack v3.0 — Synthetic Data Seed');
  console.log(`📡 Connecting to MQTT broker at ${BROKER_URL}...`);

  const client = mqtt.connect(BROKER_URL, {
    clientId: `hydrotrack-seed-${Date.now()}`,
    clean: true,
  });

  await new Promise<void>((resolve, reject) => {
    client.on('connect', () => {
      console.log('✅ Connected to MQTT broker');
      resolve();
    });
    client.on('error', (err) => {
      console.error('❌ MQTT connection error:', err.message);
      reject(err);
    });
  });

  let telemetryCycle = 0;

  // Telemetry publisher — every 3 seconds, 3-5 random devices
  const telemetryTimer = setInterval(() => {
    telemetryCycle++;
    const selectedDevices = randomSubset(DEVICES, 3, 5);

    for (const device of selectedDevices) {
      // Occasionally force anomalies for demo visibility
      const forceAnomaly = telemetryCycle % 10 === 0 ? randomPick(ANOMALY_TYPES) : undefined;
      const forceThermal = telemetryCycle % 20 === 0 && device.deviceId === 'HT-88C1';

      const payload = buildTelemetryPayload(device, forceAnomaly, forceThermal);
      const topic = `hydrotrack/${device.zone}/${device.deviceId}/telemetry`;

      client.publish(topic, JSON.stringify(payload), { qos: 0 });

      // If anomaly or thermal hazard, also publish to alert topic
      if (payload.acoustic.classification !== 'Normal' && payload.acoustic.confidence >= 0.75) {
        const alertPayload = buildAlertPayload(
          device,
          payload.acoustic.classification,
          'warning',
          `${payload.acoustic.classification} detected with ${(payload.acoustic.confidence * 100).toFixed(0)}% confidence`
        );
        client.publish(`hydrotrack/${device.zone}/${device.deviceId}/alert`, JSON.stringify(alertPayload), { qos: 1 });
      }

      if (payload.thermal.scaldRisk) {
        const alertPayload = buildAlertPayload(
          device,
          'Thermal Hazard',
          'critical',
          `Scalding Risk >50°C — Temperature: ${payload.thermal.temperatureC}°C`
        );
        client.publish(`hydrotrack/${device.zone}/${device.deviceId}/alert`, JSON.stringify(alertPayload), { qos: 1 });
      }

      if (payload.waterQuality.tdsPpm > 300) {
        const alertPayload = buildAlertPayload(
          device,
          'TDS Unsafe',
          'warning',
          `TDS at ${payload.waterQuality.tdsPpm} PPM exceeds safe limit (300 PPM)`
        );
        client.publish(`hydrotrack/${device.zone}/${device.deviceId}/alert`, JSON.stringify(alertPayload), { qos: 1 });
      }
    }

    const deviceIds = selectedDevices.map(d => d.deviceId).join(', ');
    console.log(`[${new Date().toLocaleTimeString()}] 📊 Published telemetry for: ${deviceIds}`);
  }, TELEMETRY_INTERVAL_MS);

  // Heartbeat publisher — every 10 seconds, all devices
  const heartbeatTimer = setInterval(() => {
    for (const device of DEVICES) {
      const statusPayload = buildStatusPayload(device);
      const topic = `hydrotrack/${device.zone}/${device.deviceId}/status`;
      client.publish(topic, JSON.stringify(statusPayload), { qos: 0 });
    }
    console.log(`[${new Date().toLocaleTimeString()}] 💓 Published heartbeat for all ${DEVICES.length} devices`);
  }, HEARTBEAT_INTERVAL_MS);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down seed script...');
    clearInterval(telemetryTimer);
    clearInterval(heartbeatTimer);
    client.end(false, () => {
      console.log('✅ Disconnected from MQTT broker');
      process.exit(0);
    });
  });

  console.log(`\n🚀 Seed script running!`);
  console.log(`   📊 Telemetry: every ${TELEMETRY_INTERVAL_MS / 1000}s (3-5 devices per cycle)`);
  console.log(`   💓 Heartbeat: every ${HEARTBEAT_INTERVAL_MS / 1000}s (all ${DEVICES.length} devices)`);
  console.log(`   ⚡ Anomaly probability: ${ANOMALY_PROBABILITY * 100}% per cycle`);
  console.log(`   🔥 Thermal hazard probability: ${THERMAL_HAZARD_PROBABILITY * 100}% per cycle`);
  console.log(`\n   Press Ctrl+C to stop.\n`);
}

main().catch(console.error);
