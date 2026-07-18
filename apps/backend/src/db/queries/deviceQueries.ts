import { influxClient } from '../influxClient.js';
import { config } from '../../config/env.js';

const DEVICE_REGISTRY: Record<string, { lat: number; lng: number; zone: string; address: string }> = {
  'HT-4F2A': { lat: 18.5308, lng: 73.8475, zone: 'Ward-5-Shivajinagar', address: 'Shivajinagar Main' },
  'HT-88C1': { lat: 18.5074, lng: 73.8278, zone: 'Ward-8-Erandwane', address: 'Erandwane Sector 4' },
  'HT-11B8': { lat: 18.5584, lng: 73.8070, zone: 'Ward-2-Aundh', address: 'Aundh Main Road' },
  'HT-32X0': { lat: 18.5074, lng: 73.8077, zone: 'Ward-12-Kothrud', address: 'Kothrud Main Trunk' },
  'HT-92K4': { lat: 18.5074, lng: 73.8077, zone: 'Ward-12-Kothrud', address: 'Paud Road Junction' },
  'HT-99B1': { lat: 18.5590, lng: 73.7689, zone: 'Ward-8-Baner', address: 'Pashan Road' },
  'HT-12C8': { lat: 18.5308, lng: 73.8475, zone: 'Ward-15-Shivajinagar', address: 'JM Road' },
  'HT-55D4': { lat: 18.5074, lng: 73.8077, zone: 'Ward-12-Kothrud', address: 'Paud Road Junction' },
  'HT-7A23': { lat: 18.5590, lng: 73.7689, zone: 'Ward-8-Baner', address: 'Balewadi High Street' },
  'HT-22F0': { lat: 18.5308, lng: 73.8475, zone: 'Ward-15-Shivajinagar', address: 'University Circle' },
  'HT-88E2': { lat: 18.5590, lng: 73.7689, zone: 'Ward-8-Baner', address: 'Main Line S-Curve' },
  'HT-33A1': { lat: 18.5074, lng: 73.8077, zone: 'Ward-12-Kothrud', address: 'Ideal Colony Road' },
  'HT-44C9': { lat: 18.5308, lng: 73.8475, zone: 'Ward-15-Shivajinagar', address: 'FC Road' },
  'HT-11B0': { lat: 18.5590, lng: 73.7689, zone: 'Ward-8-Baner', address: 'Sakal Nagar' },
  'HT-09X2': { lat: 18.5074, lng: 73.8077, zone: 'Ward-12-Kothrud', address: 'Karve Road Bypass' },
  'HT-66G5': { lat: 18.5308, lng: 73.8475, zone: 'Ward-15-Shivajinagar', address: 'Congress House' },
  'HT-2B77': { lat: 18.5308, lng: 73.8475, zone: 'Ward-5-Shivajinagar', address: 'Shivajinagar West' },
  'HT-44D9': { lat: 18.5626, lng: 73.9372, zone: 'Ward-22-Kharadi', address: 'Kharadi Zone' },
  'HT-11A0': { lat: 18.5590, lng: 73.7689, zone: 'Ward-8-Baner', address: 'Baner High Street' },
  'HT-99X2': { lat: 18.5362, lng: 73.9294, zone: 'Ward-22-Hadapsar', address: 'Hadapsar IT Park' },
};

export async function getDevicesGeo() {
  try {
    return Object.entries(DEVICE_REGISTRY).map(([id, data]) => ({
      deviceId: id,
      ...data,
      status: 'online'
    }));
  } catch (error) {
    throw new Error('Failed to fetch device geos');
  }
}

export async function getDeviceDetail(deviceId: string) {
  try {
    return { deviceId, status: 'online', telemetry: {}, events: [] };
  } catch (error) {
    throw new Error('Failed to fetch device details');
  }
}

export async function getDeviceFleet(page = 1, limit = 50, zone?: string, status?: string) {
  try {
    return { data: [], total: 0 };
  } catch (error) {
    throw new Error('Failed to fetch device fleet');
  }
}

export async function getZones() {
  try {
    const zones = new Set(Object.values(DEVICE_REGISTRY).map(d => d.zone));
    return Array.from(zones).map(z => ({ name: z, deviceCount: 0 }));
  } catch (error) {
    throw new Error('Failed to fetch zones');
  }
}
