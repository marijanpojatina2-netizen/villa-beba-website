// src/lib/checkin/evisitor-map.ts
// Pure mapping helpers between our guest records and the eVisitor Web API
// CheckInTourist body (docs/evisitor-web-api.md). Lookup rows come from the
// live šifrarnici; field names there vary, so matching is defensive.

import type { GuestInput } from './validate';
import { toAlpha3, ttCategory, DEFAULT_ARRIVAL_TIME, DEFAULT_DEPARTURE_TIME } from './evisitor';

export type LookupRow = Record<string, unknown>;

// Case-insensitive property access across unknown row shapes.
export function pick(row: LookupRow, ...keys: string[]): string | undefined {
  const lower = new Map(Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]));
  for (const key of keys) {
    const v = lower.get(key.toLowerCase());
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v);
  }
  return undefined;
}

export function rowName(row: LookupRow): string {
  return (pick(row, 'Name', 'Naziv', 'Title', 'Description', 'Opis') ?? '').toLowerCase();
}

export function rowCode(row: LookupRow): string | undefined {
  return pick(row, 'Code', 'CodeMI', 'Oznaka', 'Sifra', 'ID');
}

// Find the šifrarnik code for our document type by name keywords.
export function documentTypeCode(
  rows: LookupRow[],
  type: GuestInput['documentType'],
): string | undefined {
  const keyword =
    type === 'passport' ? 'putovnic' : type === 'id_card' ? 'osobn' : 'ostal';
  const row = rows.find((r) => rowName(r).includes(keyword));
  return row ? rowCode(row) : undefined;
}

// ArrivalOrganisationLookup: match "osobno" vs "agencijski" by name; the API
// wants CodeMI.
export function arrivalOrganisationCode(
  rows: LookupRow[],
  organization: string,
): string | undefined {
  const keyword = organization === 'agencija' ? 'agencij' : 'osob';
  const row = rows.find((r) => rowName(r).includes(keyword));
  return row ? (pick(row, 'CodeMI', 'Code', 'Oznaka') ?? undefined) : undefined;
}

// TTPaymentCategory: derive the age bucket, then find the matching category
// code among the facility's allowed categories.
export function ttPaymentCategoryCode(
  rows: LookupRow[],
  birthDate: string,
  arrivalDate: string,
): string | undefined {
  const label = ttCategory(birthDate, arrivalDate);
  const keyword = label.includes('do 12')
    ? 'do 12'
    : label.includes('12-18')
      ? '12'
      : 'ostale';
  const match =
    keyword === '12'
      ? rows.find((r) => /12\s*(-|do)\s*18/.test(rowName(r)))
      : rows.find((r) => rowName(r).includes(keyword));
  return match ? rowCode(match) : undefined;
}

export function genderValue(rows: LookupRow[], gender: 'M' | 'F'): string {
  const keyword = gender === 'M' ? 'mu' : 'žen';
  const row = rows.find((r) => rowName(r).startsWith(keyword));
  const name = row ? pick(row, 'Name', 'Naziv') : undefined;
  return name ?? (gender === 'M' ? 'Muški' : 'Ženski');
}

export function offeredServiceType(rows: LookupRow[]): string {
  const row = rows.find((r) => rowName(r).includes('noćenje') || rowName(r).includes('nocenje'));
  return (row && pick(row, 'Name', 'Naziv')) || 'Noćenje';
}

// EU members — non-EU residence requires BorderCrossingHr + PassageDate in the
// API, which the guest wizard doesn't collect (v1: those guests go in manually).
export const EU_MEMBERS = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
  'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
]);

export function yyyymmdd(isoDate: string): string {
  return isoDate.replaceAll('-', '');
}

export interface CheckInLookups {
  documentTypes: LookupRow[];
  arrivalOrganisations: LookupRow[];
  ttCategories: LookupRow[];
  genders: LookupRow[];
  serviceTypes: LookupRow[];
}

export interface CheckInBodyResult {
  ok: boolean;
  error?: string;
  body?: Record<string, string>;
}

export function buildCheckInBody(
  id: string,
  guest: GuestInput,
  facilityCode: string,
  arrivalOrganization: string,
  lookups: CheckInLookups,
): CheckInBodyResult {
  if (!EU_MEMBERS.has(guest.residenceCountry)) {
    return {
      ok: false,
      error:
        'Residence outside the EU — eVisitor requires border crossing + entry date; enter this guest manually.',
    };
  }
  if (arrivalOrganization === 'agencija') {
    return {
      ok: false,
      error:
        'Agency arrivals need the agency OIB/VAT from the eVisitor codelist — enter this guest manually for now.',
    };
  }
  const docType = documentTypeCode(lookups.documentTypes, guest.documentType);
  if (!docType) return { ok: false, error: 'Could not map document type to the eVisitor codelist.' };
  const arrOrg = arrivalOrganisationCode(lookups.arrivalOrganisations, arrivalOrganization);
  if (!arrOrg) return { ok: false, error: 'Could not map arrival organisation to the eVisitor codelist.' };
  const ttCat = ttPaymentCategoryCode(lookups.ttCategories, guest.birthDate, guest.arrivalDate);
  if (!ttCat) return { ok: false, error: 'Could not map the tourist-tax category for this facility.' };

  return {
    ok: true,
    body: {
      ID: id,
      ArrivalOrganisation: arrOrg,
      Citizenship: toAlpha3(guest.citizenship),
      CityOfBirth: guest.birthPlace,
      CityOfResidence: guest.residenceCity,
      CountryOfBirth: toAlpha3(guest.birthCountry),
      CountryOfResidence: toAlpha3(guest.residenceCountry),
      DateOfBirth: yyyymmdd(guest.birthDate),
      DocumentNumber: guest.documentNumber,
      DocumentType: docType,
      Facility: facilityCode,
      ForeseenStayUntil: yyyymmdd(guest.departureDate),
      Gender: genderValue(lookups.genders, guest.gender),
      OfferedServiceType: offeredServiceType(lookups.serviceTypes),
      StayFrom: yyyymmdd(guest.arrivalDate),
      TimeEstimatedStayUntil: DEFAULT_DEPARTURE_TIME,
      TimeStayFrom: DEFAULT_ARRIVAL_TIME,
      TouristName: guest.firstName,
      TouristSurname: guest.lastName,
      TTPaymentCategory: ttCat,
    },
  };
}
