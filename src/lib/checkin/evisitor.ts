// src/lib/checkin/evisitor.ts
// Copy-paste-ready mapping to the eVisitor tourist registration form.
// When HTZ grants API access, pushGuests() gets a real implementation and the
// admin button flips from "show payload" to a live push.

import type { GuestInput } from './validate';

const FACILITY: Record<string, string> = {
  ballena: 'Villa Ballena',
  beluga: 'Villa Beluga',
  both: 'Villa Ballena + Villa Beluga',
};

export interface EvisitorTourist {
  surname: string;
  name: string;
  gender: 'M' | 'F';
  citizenshipCode: string;
  dateOfBirth: string;
  placeOfBirth: string;
  documentType: string;
  documentNumber: string;
  residenceCountryCode: string;
  residenceCity: string;
  stayFrom: string;
  foreseenStayUntil: string;
}

export function buildEvisitorPayload(
  link: { villa: string },
  guests: GuestInput[],
): { facility: string; tourists: EvisitorTourist[] } {
  return {
    facility: FACILITY[link.villa] ?? link.villa,
    tourists: guests.map((g) => ({
      surname: g.lastName,
      name: g.firstName,
      gender: g.gender,
      citizenshipCode: g.citizenship,
      dateOfBirth: g.birthDate,
      placeOfBirth: g.birthPlace,
      documentType: g.documentType,
      documentNumber: g.documentNumber,
      residenceCountryCode: g.residenceCountry,
      residenceCity: g.residenceCity,
      stayFrom: g.arrivalDate,
      foreseenStayUntil: g.departureDate,
    })),
  };
}

const CSV_COLS: Array<[string, (g: GuestInput) => string]> = [
  ['surname', (g) => g.lastName],
  ['name', (g) => g.firstName],
  ['gender', (g) => g.gender],
  ['citizenship', (g) => g.citizenship],
  ['dateOfBirth', (g) => g.birthDate],
  ['placeOfBirth', (g) => g.birthPlace],
  ['documentType', (g) => g.documentType],
  ['documentNumber', (g) => g.documentNumber],
  ['residenceCountry', (g) => g.residenceCountry],
  ['residenceCity', (g) => g.residenceCity],
  ['stayFrom', (g) => g.arrivalDate],
  ['stayUntil', (g) => g.departureDate],
];

function csvCell(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function guestsToCsv(guests: GuestInput[]): string {
  const header = CSV_COLS.map(([name]) => name).join(',');
  const rows = guests.map((g) => CSV_COLS.map(([, fn]) => csvCell(fn(g))).join(','));
  return [header, ...rows].join('\n') + '\n';
}
