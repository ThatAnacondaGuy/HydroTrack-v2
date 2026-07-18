import { z } from 'zod';

export const telemetryPayloadSchema = z.object({
  deviceId: z.string(),
  zone: z.string(),
  timestamp: z.string().datetime(),
  flow: z.object({
    volumetricRateLpm: z.number(),
    dailyTotalLiters: z.number(),
    viscosityCompensated: z.boolean()
  }),
  thermal: z.object({
    temperatureC: z.number(),
    scaldRisk: z.boolean()
  }),
  waterQuality: z.object({
    tdsPpm: z.number(),
    uvcCycleActive: z.boolean()
  }),
  acoustic: z.object({
    classification: z.enum(['Normal', 'Micro-Leak', 'Water Hammer', 'Pipe Cavitation']),
    confidence: z.number(),
    frequencyRangeHz: z.string().nullable()
  }),
  battery: z.object({
    voltage: z.number(),
    estDaysRemaining: z.number()
  })
});

export const alertPayloadSchema = z.object({
  deviceId: z.string(),
  zone: z.string(),
  type: z.string(),
  severity: z.enum(['warning', 'critical']),
  message: z.string(),
  timestamp: z.string().datetime()
});

export const statusPayloadSchema = z.object({
  deviceId: z.string(),
  zone: z.string(),
  status: z.enum(['online', 'offline']),
  battery: z.number(),
  timestamp: z.string().datetime()
});
