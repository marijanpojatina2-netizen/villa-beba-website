// src/lib/checkin/db.ts
import 'server-only';
import { neon } from '@neondatabase/serverless';
import type { GuestInput } from './validate';

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

export interface CheckinLink {
  id: number;
  token: string;
  villa: 'ballena' | 'beluga' | 'both';
  arrival_date: string;
  departure_date: string;
  expected_guests: number;
  arrival_organization: 'osobno' | 'agencija';
  status: 'pending' | 'submitted' | 'pushed';
  scan_count: number;
  created_at: string;
  submitted_at: string | null;
}

// Neon returns DATE columns as JS Date objects (parsed at *local* midnight) or
// strings depending on driver version — normalize to YYYY-MM-DD using local
// components. toISOString() would shift a day west of UTC.
function iso(d: unknown): string {
  if (d instanceof Date) {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  return String(d).slice(0, 10);
}

function normalizeLink(r: Record<string, unknown>): CheckinLink {
  return {
    ...(r as unknown as CheckinLink),
    arrival_date: iso(r.arrival_date),
    departure_date: iso(r.departure_date),
  };
}

export function normalizeGuest(r: Record<string, unknown>): GuestInput {
  return {
    firstName: String(r.first_name),
    lastName: String(r.last_name),
    gender: r.gender as 'M' | 'F',
    citizenship: String(r.citizenship),
    birthDate: iso(r.birth_date),
    birthCountry: String(r.birth_country),
    birthPlace: String(r.birth_place),
    documentType: r.document_type as GuestInput['documentType'],
    documentNumber: String(r.document_number),
    residenceCountry: String(r.residence_country),
    residenceCity: String(r.residence_city),
    arrivalDate: iso(r.arrival_date),
    departureDate: iso(r.departure_date),
  };
}

export async function createLink(input: {
  token: string;
  villa: string;
  arrivalDate: string;
  departureDate: string;
  expectedGuests: number;
  arrivalOrganization: string;
}): Promise<number> {
  const rows = await sql()`
    INSERT INTO checkin_links (token, villa, arrival_date, departure_date, expected_guests, arrival_organization)
    VALUES (${input.token}, ${input.villa}, ${input.arrivalDate}, ${input.departureDate}, ${input.expectedGuests}, ${input.arrivalOrganization})
    RETURNING id`;
  return rows[0].id as number;
}

export async function getLinkByToken(token: string): Promise<CheckinLink | null> {
  const rows = await sql()`SELECT * FROM checkin_links WHERE token = ${token}`;
  return rows.length ? normalizeLink(rows[0]) : null;
}

// Atomically claim the link for submission; null if already submitted/pushed.
export async function claimSubmission(token: string): Promise<number | null> {
  const rows = await sql()`
    UPDATE checkin_links SET status = 'submitted', submitted_at = now()
    WHERE token = ${token} AND status = 'pending' RETURNING id`;
  return rows.length ? (rows[0].id as number) : null;
}

export async function revertSubmission(linkId: number): Promise<void> {
  await sql()`
    UPDATE checkin_links SET status = 'pending', submitted_at = NULL
    WHERE id = ${linkId}`;
}

export async function insertGuests(linkId: number, guests: GuestInput[]): Promise<void> {
  const s = sql();
  await s.transaction(
    guests.map((g) => s`
      INSERT INTO guests (link_id, first_name, last_name, gender, citizenship,
        birth_date, birth_country, birth_place, document_type, document_number,
        residence_country, residence_city, arrival_date, departure_date)
      VALUES (${linkId}, ${g.firstName}, ${g.lastName}, ${g.gender}, ${g.citizenship},
        ${g.birthDate}, ${g.birthCountry}, ${g.birthPlace}, ${g.documentType}, ${g.documentNumber},
        ${g.residenceCountry}, ${g.residenceCity}, ${g.arrivalDate}, ${g.departureDate})`),
  );
}

// Returns false when the scan budget for this link is exhausted.
export async function tryConsumeScan(token: string, limit = 20): Promise<boolean> {
  const rows = await sql()`
    UPDATE checkin_links SET scan_count = scan_count + 1
    WHERE token = ${token} AND status = 'pending' AND scan_count < ${limit}
    RETURNING id`;
  return rows.length > 0;
}

export async function listLinks(): Promise<CheckinLink[]> {
  const rows = await sql()`SELECT * FROM checkin_links ORDER BY created_at DESC LIMIT 200`;
  return rows.map(normalizeLink);
}

export async function getLinkWithGuests(
  id: number,
): Promise<{ link: CheckinLink; guests: GuestInput[] } | null> {
  const s = sql();
  const links = await s`SELECT * FROM checkin_links WHERE id = ${id}`;
  if (!links.length) return null;
  const guests = await s`SELECT * FROM guests WHERE link_id = ${id} ORDER BY id`;
  return { link: normalizeLink(links[0]), guests: guests.map(normalizeGuest) };
}

export async function markPushed(id: number): Promise<void> {
  const s = sql();
  await s.transaction([
    s`UPDATE checkin_links SET status = 'pushed' WHERE id = ${id} AND status = 'submitted'`,
    s`UPDATE guests SET pushed_at = now() WHERE link_id = ${id} AND pushed_at IS NULL`,
  ]);
}

// Retention: everything goes 90 days after departure (eVisitor is the legal record).
export async function purgeExpired(): Promise<number> {
  const rows = await sql()`
    DELETE FROM checkin_links
    WHERE departure_date < CURRENT_DATE - 90
    RETURNING id`;
  return rows.length;
}
