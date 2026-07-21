// src/lib/checkin/admin-guard.ts
import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySession } from './admin-auth';

export const ADMIN_COOKIE = 'admin_session';

export async function isAdmin(): Promise<boolean> {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!secret) return false;
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  return !!value && verifySession(value, secret);
}

// For pages: redirects to login. For server actions: throw instead (no redirect
// loops inside actions) — actions call assertAdmin().
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect('/admin/login');
}

export async function assertAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
}
