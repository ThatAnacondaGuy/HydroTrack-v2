import mqtt, { MqttClient } from 'mqtt';
import { useTelemetryStore, DeviceTelemetry } from '../store/useTelemetryStore';

let client: MqttClient | null = null;

export const connectMqtt = () => {
  if (client) return;

  const url = import.meta.env.VITE_MQTT_URL || 'ws://localhost:9001';
  client = mqtt.connect(url);

  client.on('connect', () => {
    console.log('Connected to MQTT Broker');
    client?.subscribe('hydrotrack/#', (err) => {
      if (err) {
        console.error('Subscription error:', err);
      }
    });
  });

  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      if (topic.startsWith('hydrotrack/telemetry')) {
        useTelemetryStore.getState().updateTelemetry(payload as DeviceTelemetry);
        
        if (payload.scaldRisk) {
           useTelemetryStore.getState().addAlert({
             id: Math.random().toString(36).substring(7),
             deviceId: payload.deviceId,
             zone: payload.zone,
             type: 'SCALD_RISK',
             message: `High temperature detected: ${payload.temperatureC}°C`,
             timestamp: payload.timestamp || new Date().toISOString(),
             severity: 'critical',
             acknowledged: false
           });
        }
      } else if (topic.startsWith('hydrotrack/alerts')) {
        useTelemetryStore.getState().addAlert(payload);
      }
    } catch (e) {
      console.error('Error parsing MQTT message:', e);
    }
  });

  client.on('error', (err) => {
    console.error('MQTT connection error:', err);
  });
};

export const disconnectMqtt = () => {
  if (client) {
    client.end();
    client = null;
  }
};
