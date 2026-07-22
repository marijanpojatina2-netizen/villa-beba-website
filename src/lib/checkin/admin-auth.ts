// src/lib/checkin/admin-auth.ts
// Stateless signed session for the single-admin dashboard:
// cookie value = "<expiryMs>.<hmac-sha256(expiryMs, secret)>".

import { createHmac, timingSafeEqual } from 'node:crypto';

function hmac(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function signSession(expiresAtMs: number, secret: string): string {
  const exp = String(expiresAtMs);
  return `${exp}.${hmac(exp, secret)}`;
}

export function verifySession(value: string, secret: string): boolean {
  const dot = value.indexOf('.');
  if (dot <= 0) return false;
  const exp = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!/^\d{10,16}$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = hmac(exp, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
