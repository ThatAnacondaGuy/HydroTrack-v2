import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  INFLUXDB_URL: z.string().url(),
  INFLUXDB_TOKEN: z.string().min(1),
  INFLUXDB_ORG: z.string().min(1),
  INFLUXDB_BUCKET: z.string().min(1),
  MQTT_BROKER_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRY: z.string().default('24h'),
  PORT: z.string().transform(Number).default('3000')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
