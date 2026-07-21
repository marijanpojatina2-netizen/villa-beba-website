// src/lib/checkin/token.ts
import { randomBytes } from 'node:crypto';

// 16 random bytes -> 22 base64url chars (~128 bits): unguessable booking link.
export function generateToken(): string {
  return randomBytes(16).toString('base64url');
}

export function isValidTokenFormat(token: string): boolean {
  return /^[A-Za-z0-9_-]{22}$/.test(token);
}
