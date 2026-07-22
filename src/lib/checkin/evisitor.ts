// src/lib/checkin/evisitor.ts
// Copy-paste-ready mapping to the official eVisitor tourist registration form
// (gov.hr "Prijava i odjava turista"). When HTZ grants API access, pushGuests()
// gets a real implementation and the admin button flips to a live push.

import type { GuestInput } from './validate';

const FACILITY: Record<string, string> = {
  ballena: 'Villa Ballena',
  beluga: 'Villa Beluga',
  both: 'Villa Ballena + Villa Beluga',
};

// eVisitor: default check-in/check-out times entered with the stay dates.
export const DEFAULT_ARRIVAL_TIME = '16:00';
export const DEFAULT_DEPARTURE_TIME = '10:00';

export const ARRIVAL_ORGANIZATION_LABEL: Record<string, string> = {
  osobno: 'Osobno (individualno)',
  agencija: 'Agencijski (grupno)',
};

// Kategorija obveznika plaćanja turističke pristojbe, derived from age at
// arrival: under 12 exempt, 12–17 pays 50%, adults 100%.
export function ttCategory(birthDate: string, arrivalDate: string): string {
  const b = new Date(birthDate + 'T00:00:00Z');
  const a = new Date(arrivalDate + 'T00:00:00Z');
  let age = a.getUTCFullYear() - b.getUTCFullYear();
  const beforeBirthday =
    a.getUTCMonth() < b.getUTCMonth() ||
    (a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() < b.getUTCDate());
  if (beforeBirthday) age -= 1;
  if (age < 12) return 'Djeca do 12 godina (oslobođeno)';
  if (age < 18) return 'Djeca 12-18 godina (50%)';
  return 'Sve ostale kategorije (100%)';
}

export interface EvisitorTourist {
  surname: string;
  name: string;
  gender: 'M' | 'F';
  citizenshipCode: string;
  dateOfBirth: string;
  countryOfBirthCode: string;
  placeOfBirth: string; // only filled when countryOfBirthCode is HR
  documentType: string;
  documentNumber: string;
  residenceCountryCode: string;
  residenceCity: string; // only filled when residenceCountryCode is HR
  stayFrom: string;
  arrivalTime: string;
  foreseenStayUntil: string;
  departureTime: string;
  ttCategory: string;
}

export function buildEvisitorPayload(
  link: { villa: string; arrival_organization?: string },
  guests: GuestInput[],
): { facility: string; arrivalOrganization: string; tourists: EvisitorTourist[] } {
  return {
    facility: FACILITY[link.villa] ?? link.villa,
    arrivalOrganization:
      ARRIVAL_ORGANIZATION_LABEL[link.arrival_organization ?? 'osobno'] ??
      ARRIVAL_ORGANIZATION_LABEL.osobno,
    tourists: guests.map((g) => ({
      surname: g.lastName,
      name: g.firstName,
      gender: g.gender,
      citizenshipCode: g.citizenship,
      dateOfBirth: g.birthDate,
      countryOfBirthCode: g.birthCountry,
      placeOfBirth: g.birthCountry === 'HR' ? g.birthPlace : '',
      documentType: g.documentType,
      documentNumber: g.documentNumber,
      residenceCountryCode: g.residenceCountry,
      residenceCity: g.residenceCountry === 'HR' ? g.residenceCity : '',
      stayFrom: g.arrivalDate,
      arrivalTime: DEFAULT_ARRIVAL_TIME,
      foreseenStayUntil: g.departureDate,
      departureTime: DEFAULT_DEPARTURE_TIME,
      ttCategory: ttCategory(g.birthDate, g.arrivalDate),
    })),
  };
}

const CSV_COLS: Array<[string, (g: GuestInput) => string]> = [
  ['surname', (g) => g.lastName],
  ['name', (g) => g.firstName],
  ['gender', (g) => g.gender],
  ['citizenship', (g) => g.citizenship],
  ['dateOfBirth', (g) => g.birthDate],
  ['countryOfBirth', (g) => g.birthCountry],
  ['placeOfBirth', (g) => (g.birthCountry === 'HR' ? g.birthPlace : '')],
  ['documentType', (g) => g.documentType],
  ['documentNumber', (g) => g.documentNumber],
  ['residenceCountry', (g) => g.residenceCountry],
  ['residenceCity', (g) => (g.residenceCountry === 'HR' ? g.residenceCity : '')],
  ['stayFrom', (g) => g.arrivalDate],
  ['stayUntil', (g) => g.departureDate],
  ['ttCategory', (g) => ttCategory(g.birthDate, g.arrivalDate)],
];

function csvCell(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function guestsToCsv(guests: GuestInput[]): string {
  const header = CSV_COLS.map(([name]) => name).join(',');
  const rows = guests.map((g) => CSV_COLS.map(([, fn]) => csvCell(fn(g))).join(','));
  return [header, ...rows].join('\n') + '\n';
}
