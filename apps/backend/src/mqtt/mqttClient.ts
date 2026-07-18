import mqtt from 'mqtt';
import pino from 'pino';
import { config } from '../config/env.js';
import { handleIngest } from './ingestHandler.js';

const logger = pino();
let client: mqtt.MqttClient;

export function startMqttClient() {
  client = mqtt.connect(config.MQTT_BROKER_URL, {
    reconnectPeriod: 5000,
  });

  client.on('connect', () => {
    logger.info(`Connected to MQTT broker at ${config.MQTT_BROKER_URL}`);
    client.subscribe('hydrotrack/#', (err) => {
      if (err) logger.error('Subscription error:', err);
      else logger.info('Subscribed to hydrotrack/#');
    });
  });

  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      if (topic.endsWith('/telemetry')) {
        handleIngest(payload);
      } else if (topic.endsWith('/alert')) {
        // handleAlert(payload);
      } else if (topic.endsWith('/status')) {
        // handleStatus(payload);
      }
    } catch (e) {
      logger.error({ err: e, topic }, 'Failed to parse MQTT message');
    }
  });

  client.on('error', (err) => {
    logger.error('MQTT error:', err);
  });
}

export function closeMqttClient() {
  if (client) {
    client.end();
  }
}
