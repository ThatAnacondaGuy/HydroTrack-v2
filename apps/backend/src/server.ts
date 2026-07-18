import { app } from './app.js';
import { config } from './config/env.js';
import { startMqttClient, closeMqttClient } from './mqtt/mqttClient.js';
import { seedDemoUsers } from './services/authService.js';
import { influxClient } from './db/influxClient.js';
import pino from 'pino';

const logger = pino();

async function start() {
  try {
    await seedDemoUsers();
    logger.info('Demo users seeded');

    startMqttClient();

    const server = app.listen(config.PORT, () => {
      logger.info(`Server listening on port ${config.PORT}`);
    });

    const shutdown = async () => {
      logger.info('Shutting down...');
      server.close();
      closeMqttClient();
      await influxClient.flush();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

start();
