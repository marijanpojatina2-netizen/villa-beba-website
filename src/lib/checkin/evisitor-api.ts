// src/lib/checkin/evisitor-api.ts
// Client for the official eVisitor Web API (docs/evisitor-web-api.md).
// Login uses the obveznik's regular eVisitor credentials; every subsequent
// call must echo the login cookies joined with ';'.

import 'server-only';
import { randomUUID } from 'node:crypto';
import type { GuestInput } from './validate';
import {
  buildCheckInBody, pick, rowCode, type CheckInLookups, type LookupRow,
} from './evisitor-map';

const BASE = process.env.EVISITOR_BASE_URL ?? 'https://www.evisitor.hr/eVisitorRhetos_API';

export function evisitorConfigured(): boolean {
  return !!(process.env.EVISITOR_USERNAME && process.env.EVISITOR_PASSWORD);
}

export function facilityCodeFor(villa: string): string | undefined {
  if (villa === 'ballena') return process.env.EVISITOR_FACILITY_BALLENA;
  if (villa === 'beluga') return process.env.EVISITOR_FACILITY_BELUGA;
  return undefined; // 'both' bookings can't be pushed to a single facility
}

interface Session {
  cookies: string;
}

async function login(): Promise<Session> {
  const userName = process.env.EVISITOR_USERNAME;
  const password = process.env.EVISITOR_PASSWORD;
  if (!userName || !password) throw new Error('EVISITOR_USERNAME / EVISITOR_PASSWORD not configured');
  const res = await fetch(`${BASE}/Resources/AspNetFormsAuth/Authentication/Login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ userName, password }),
    cache: 'no-store',
  });
  const bodyText = await res.text();
  if (!res.ok) throw new Error(`eVisitor login HTTP ${res.status}: ${bodyText.slice(0, 200)}`);
  if (bodyText.trim() !== 'true') {
    throw new Error(`eVisitor login rejected (wrong username/password?): ${bodyText.slice(0, 200)}`);
  }
  // Cookies MUST be joined with ';' — space-joined gets rejected by the WAF.
  const cookies = (res.headers.getSetCookie?.() ?? [])
    .map((c) => c.split(';')[0])
    .filter(Boolean)
    .join('; ');
  if (!cookies) throw new Error('eVisitor login returned no session cookies');
  return { cookies };
}

async function apiGet(session: Session, path: string): Promise<unknown> {
  const res = await fetch(`${BASE}/Rest/${path}`, {
    headers: { Cookie: session.cookies, Accept: 'application/json' },
    cache: 'no-store',
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`GET ${path} → HTTP ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

async function apiPost(session: Session, path: string, body: unknown): Promise<string> {
  const res = await fetch(`${BASE}/Rest/${path}`, {
    method: 'POST',
    headers: {
      Cookie: session.cookies,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const text = await res.text();
  if (!res.ok) {
    // Rhetos wraps errors as {UserMessage, SystemMessage} — surface UserMessage.
    let message = text.slice(0, 400);
    try {
      const parsed = JSON.parse(text) as { UserMessage?: string; SystemMessage?: string };
      message = parsed.UserMessage || parsed.SystemMessage || message;
    } catch { /* keep raw */ }
    throw new Error(`${path} → HTTP ${res.status}: ${message}`);
  }
  return text;
}

// Rhetos browse endpoints return either a bare array or {Records: [...]}.
function records(data: unknown): LookupRow[] {
  if (Array.isArray(data)) return data as LookupRow[];
  if (data && typeof data === 'object' && Array.isArray((data as { Records?: unknown[] }).Records)) {
    return (data as { Records: LookupRow[] }).Records;
  }
  return [];
}

async function tryBrowse(session: Session, path: string): Promise<LookupRow[] | { error: string }> {
  try {
    return records(await apiGet(session, path));
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

const BROWSES = {
  facilities: 'Htz/FacilityTouristCheckInLookup/',
  documentTypes: 'Htz/DocumentTtypeLookup/',
  arrivalOrganisations: 'Htz/ArrivalOrganisationLookup/',
  ttCategories: 'Htz/TTPaymentCategoryLookup2/',
  genders: 'Htz/GenderLookup/',
  serviceTypes: 'Htz/OfferedServiceTypeLookup/',
} as const;

export interface ConnectionTestResult {
  ok: boolean;
  error?: string;
  lookups?: Record<string, { count: number; sample: LookupRow[] } | { error: string }>;
}

// Read-only: login + fetch codelists. Safe to run against production —
// nothing is written to eVisitor.
export async function testConnection(): Promise<ConnectionTestResult> {
  let session: Session;
  try {
    session = await login();
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
  const lookups: NonNullable<ConnectionTestResult['lookups']> = {};
  for (const [name, path] of Object.entries(BROWSES)) {
    const result = await tryBrowse(session, path);
    lookups[name] = Array.isArray(result)
      ? { count: result.length, sample: result.slice(0, 10) }
      : result;
  }
  return { ok: true, lookups };
}

export interface GuestPushResult {
  guestId: number;
  evisitorId?: string;
  error?: string;
}

export async function pushGuestsToEvisitor(
  villa: string,
  arrivalOrganization: string,
  guests: Array<{ guestId: number; input: GuestInput }>,
): Promise<{ error?: string; results: GuestPushResult[] }> {
  const facilityCode = facilityCodeFor(villa);
  if (!facilityCode) {
    return {
      error:
        villa === 'both'
          ? 'Combined (both-villa) bookings cannot be pushed to a single facility — enter manually or use one link per villa.'
          : `Facility code for ${villa} is not configured (EVISITOR_FACILITY_${villa.toUpperCase()}).`,
      results: [],
    };
  }

  let session: Session;
  try {
    session = await login();
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err), results: [] };
  }

  const [documentTypes, arrivalOrganisations, genders, serviceTypes, allFacilities] =
    await Promise.all([
      tryBrowse(session, BROWSES.documentTypes),
      tryBrowse(session, BROWSES.arrivalOrganisations),
      tryBrowse(session, BROWSES.genders),
      tryBrowse(session, BROWSES.serviceTypes),
      tryBrowse(session, BROWSES.facilities),
    ]);
  if (!Array.isArray(documentTypes)) return { error: `DocumentTtypeLookup: ${documentTypes.error}`, results: [] };
  if (!Array.isArray(arrivalOrganisations)) return { error: `ArrivalOrganisationLookup: ${arrivalOrganisations.error}`, results: [] };

  // TT categories are facility-scoped; find the facility row to filter by ID.
  let ttCategories = await tryBrowse(session, BROWSES.ttCategories);
  if (!Array.isArray(ttCategories)) return { error: `TTPaymentCategoryLookup2: ${ttCategories.error}`, results: [] };
  if (Array.isArray(allFacilities)) {
    const facilityRow = allFacilities.find((r) => rowCode(r) === facilityCode || pick(r, 'Code') === facilityCode);
    const facilityId = facilityRow ? pick(facilityRow, 'ID', 'FacilityID') : undefined;
    if (facilityId) {
      const scoped = ttCategories.filter((r) => {
        const fid = pick(r, 'FacilityID', 'Facility');
        return !fid || fid === facilityId;
      });
      if (scoped.length) ttCategories = scoped;
    }
  }

  const lookups: CheckInLookups = {
    documentTypes,
    arrivalOrganisations,
    ttCategories,
    genders: Array.isArray(genders) ? genders : [],
    serviceTypes: Array.isArray(serviceTypes) ? serviceTypes : [],
  };

  const results: GuestPushResult[] = [];
  for (const { guestId, input } of guests) {
    const id = randomUUID();
    const built = buildCheckInBody(id, input, facilityCode, arrivalOrganization, lookups);
    if (!built.ok) {
      results.push({ guestId, error: built.error });
      continue;
    }
    try {
      await apiPost(session, 'Htz/CheckInTourist/', built.body);
      results.push({ guestId, evisitorId: id });
      console.log(`[evisitor] checked in guest ${guestId} as ${id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[evisitor] check-in failed for guest ${guestId}: ${message}`);
      results.push({ guestId, error: message });
    }
  }
  return { results };
}

export async function cancelEvisitorCheckIn(evisitorId: string, reason: string): Promise<void> {
  const session = await login();
  await apiPost(session, 'Htz/CancelTouristCheckIn/', { ID: evisitorId, Reason: reason });
  console.log(`[evisitor] cancelled check-in ${evisitorId}`);
}
