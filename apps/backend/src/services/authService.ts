import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../types/telemetry.types.js';

export const users = new Map<string, any>();

export async function seedDemoUsers() {
  const engineerPass = await bcrypt.hash('hydro2026', 10);
  const adminPass = await bcrypt.hash('admin2026', 10);

  users.set('engineer@hydrotrack.in', {
    id: 'usr-1',
    email: 'engineer@hydrotrack.in',
    passwordHash: engineerPass,
    role: 'engineer'
  });

  users.set('admin@hydrotrack.in', {
    id: 'usr-2',
    email: 'admin@hydrotrack.in',
    passwordHash: adminPass,
    role: 'admin'
  });
}

export async function login(email: string, password: string) {
  const user = users.get(email);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  // We actually need require('jsonwebtoken') or import jwt from 'jsonwebtoken'
  // Will fix import below in final output
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRY }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, config.JWT_SECRET);
}

export function getUser(id: string): User | null {
  for (const user of users.values()) {
    if (user.id === id) {
      return { id: user.id, email: user.email, role: user.role };
    }
  }
  return null;
}
