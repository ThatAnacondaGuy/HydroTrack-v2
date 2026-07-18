import { influxClient } from '../influxClient.js';
import { config } from '../../config/env.js';

export async function getThermalHazards(page = 1, limit = 50, status?: string) {
  try {
    return { data: [], total: 0 };
  } catch (error) {
    throw new Error('Failed to fetch thermal hazards');
  }
}

export async function getActiveThermalHazards() {
  try {
    return [];
  } catch (error) {
    throw new Error('Failed to fetch active thermal hazards');
  }
}
