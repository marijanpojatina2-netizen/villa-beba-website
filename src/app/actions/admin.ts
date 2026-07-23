'use server';

import { timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signSession } from '@/lib/checkin/admin-auth';
import { ADMIN_COOKIE, assertAdmin } from '@/lib/checkin/admin-guard';
import { generateToken } from '@/lib/checkin/token';
import {
  createLink, markPushed, getLinkWithGuests, getGuestRowsForPush,
  setGuestPushResult, refreshLinkPushStatus,
} from '@/lib/checkin/db';
import { pushGuestsToEvisitor, cancelEvisitorCheckIn } from '@/lib/checkin/evisitor-api';

const SESSION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function adminLogin(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const password = String(formData.get('password') ?? '');
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!expected || !secret) return { error: 'Admin auth is not configured.' };
  if (!password || !safeEqual(password, expected)) {
    return { error: 'Wrong password.' };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, signSession(Date.now() + SESSION_MS, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MS / 1000,
  });
  redirect('/admin');
}

export async function adminLogout(): Promise<void> {
  await assertAdmin();
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect('/admin/login');
}

export async function createCheckinLink(formData: FormData): Promise<void> {
  await assertAdmin();
  const villa = String(formData.get('villa') ?? '');
  const arrivalDate = String(formData.get('arrivalDate') ?? '');
  const departureDate = String(formData.get('departureDate') ?? '');
  const expectedGuests = Number(formData.get('expectedGuests') ?? 2);
  const arrivalOrganization = String(formData.get('arrivalOrganization') ?? 'osobno');
  if (
    !['osobno', 'agencija'].includes(arrivalOrganization) ||
    !['ballena', 'beluga', 'both'].includes(villa) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(arrivalDate) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(departureDate) ||
    departureDate <= arrivalDate ||
    !Number.isInteger(expectedGuests) ||
    expectedGuests < 1 ||
    expectedGuests > 20
  ) {
    throw new Error('Invalid link parameters');
  }
  const id = await createLink({
    token: generateToken(),
    villa,
    arrivalDate,
    departureDate,
    expectedGuests,
    arrivalOrganization,
  });
  redirect(`/admin/links/${id}`);
}

export async function markLinkPushed(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid id');
  await markPushed(id);
  redirect(`/admin/links/${id}`);
}

export async function pushLinkToEvisitor(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid id');
  const data = await getLinkWithGuests(id);
  if (!data) throw new Error('Link not found');

  const rows = await getGuestRowsForPush(id);
  const pending = rows.filter((r) => !r.evisitorId);
  if (pending.length) {
    const { error, results } = await pushGuestsToEvisitor(
      data.link.villa,
      data.link.arrival_organization ?? 'osobno',
      pending.map((r) => ({ guestId: r.guestId, input: r.input })),
    );
    if (error) {
      // Global failure (login/config/lookup) — record on every pending guest.
      for (const r of pending) await setGuestPushResult(r.guestId, null, error);
    } else {
      for (const result of results) {
        await setGuestPushResult(
          result.guestId,
          result.evisitorId ?? null,
          result.error ?? null,
        );
      }
    }
    await refreshLinkPushStatus(id);
  }
  redirect(`/admin/links/${id}`);
}

export async function cancelGuestEvisitor(formData: FormData): Promise<void> {
  await assertAdmin();
  const guestId = Number(formData.get('guestId'));
  const linkId = Number(formData.get('linkId'));
  const evisitorId = String(formData.get('evisitorId') ?? '');
  if (!Number.isInteger(guestId) || !Number.isInteger(linkId) || !evisitorId) {
    throw new Error('Invalid cancel request');
  }
  try {
    await cancelEvisitorCheckIn(evisitorId, 'Pogrešan unos — poništeno iz admin sučelja');
    await setGuestPushResult(guestId, null, null);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await setGuestPushResult(guestId, evisitorId, `Cancel failed: ${message}`);
  }
  await refreshLinkPushStatus(linkId);
  redirect(`/admin/links/${linkId}`);
}
