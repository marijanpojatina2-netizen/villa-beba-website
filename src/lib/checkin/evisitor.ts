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

// eVisitor Web API (CheckInTourist) takes ISO 3166-1 alpha-3 country codes
// (e.g. DEU, HRV); the site stores alpha-2. Covers every code in COUNTRIES.
const ALPHA3: Record<string, string> = {
  AD:'AND',AE:'ARE',AF:'AFG',AG:'ATG',AL:'ALB',AM:'ARM',AO:'AGO',AR:'ARG',
  AT:'AUT',AU:'AUS',AZ:'AZE',BA:'BIH',BB:'BRB',BD:'BGD',BE:'BEL',BF:'BFA',
  BG:'BGR',BH:'BHR',BI:'BDI',BJ:'BEN',BN:'BRN',BO:'BOL',BR:'BRA',BS:'BHS',
  BT:'BTN',BW:'BWA',BY:'BLR',BZ:'BLZ',CA:'CAN',CD:'COD',CF:'CAF',CG:'COG',
  CH:'CHE',CI:'CIV',CL:'CHL',CM:'CMR',CN:'CHN',CO:'COL',CR:'CRI',CU:'CUB',
  CV:'CPV',CY:'CYP',CZ:'CZE',DE:'DEU',DJ:'DJI',DK:'DNK',DM:'DMA',DO:'DOM',
  DZ:'DZA',EC:'ECU',EE:'EST',EG:'EGY',ER:'ERI',ES:'ESP',ET:'ETH',FI:'FIN',
  FJ:'FJI',FM:'FSM',FR:'FRA',GA:'GAB',GB:'GBR',GD:'GRD',GE:'GEO',GH:'GHA',
  GM:'GMB',GN:'GIN',GQ:'GNQ',GR:'GRC',GT:'GTM',GW:'GNB',GY:'GUY',HN:'HND',
  HR:'HRV',HT:'HTI',HU:'HUN',ID:'IDN',IE:'IRL',IL:'ISR',IN:'IND',IQ:'IRQ',
  IR:'IRN',IS:'ISL',IT:'ITA',JM:'JAM',JO:'JOR',JP:'JPN',KE:'KEN',KG:'KGZ',
  KH:'KHM',KI:'KIR',KM:'COM',KN:'KNA',KP:'PRK',KR:'KOR',KW:'KWT',KZ:'KAZ',
  LA:'LAO',LB:'LBN',LC:'LCA',LI:'LIE',LK:'LKA',LR:'LBR',LS:'LSO',LT:'LTU',
  LU:'LUX',LV:'LVA',LY:'LBY',MA:'MAR',MC:'MCO',MD:'MDA',ME:'MNE',MG:'MDG',
  MH:'MHL',MK:'MKD',ML:'MLI',MM:'MMR',MN:'MNG',MR:'MRT',MT:'MLT',MU:'MUS',
  MV:'MDV',MW:'MWI',MX:'MEX',MY:'MYS',MZ:'MOZ',NA:'NAM',NE:'NER',NG:'NGA',
  NI:'NIC',NL:'NLD',NO:'NOR',NP:'NPL',NR:'NRU',NZ:'NZL',OM:'OMN',PA:'PAN',
  PE:'PER',PG:'PNG',PH:'PHL',PK:'PAK',PL:'POL',PS:'PSE',PT:'PRT',PW:'PLW',
  PY:'PRY',QA:'QAT',RO:'ROU',RS:'SRB',RU:'RUS',RW:'RWA',SA:'SAU',SB:'SLB',
  SC:'SYC',SD:'SDN',SE:'SWE',SG:'SGP',SI:'SVN',SK:'SVK',SL:'SLE',SM:'SMR',
  SN:'SEN',SO:'SOM',SR:'SUR',SS:'SSD',ST:'STP',SV:'SLV',SY:'SYR',SZ:'SWZ',
  TD:'TCD',TG:'TGO',TH:'THA',TJ:'TJK',TL:'TLS',TM:'TKM',TN:'TUN',TO:'TON',
  TR:'TUR',TT:'TTO',TV:'TUV',TW:'TWN',TZ:'TZA',UA:'UKR',UG:'UGA',US:'USA',
  UY:'URY',UZ:'UZB',VA:'VAT',VC:'VCT',VE:'VEN',VN:'VNM',VU:'VUT',WS:'WSM',
  XK:'XKX',YE:'YEM',ZA:'ZAF',ZM:'ZMB',ZW:'ZWE',
};

export function toAlpha3(alpha2: string): string {
  return ALPHA3[alpha2] ?? alpha2;
}

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
      citizenshipCode: toAlpha3(g.citizenship),
      dateOfBirth: g.birthDate,
      countryOfBirthCode: toAlpha3(g.birthCountry),
      placeOfBirth: g.birthPlace,
      documentType: g.documentType,
      documentNumber: g.documentNumber,
      residenceCountryCode: toAlpha3(g.residenceCountry),
      residenceCity: g.residenceCity,
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
  ['citizenship', (g) => toAlpha3(g.citizenship)],
  ['dateOfBirth', (g) => g.birthDate],
  ['countryOfBirth', (g) => toAlpha3(g.birthCountry)],
  ['placeOfBirth', (g) => g.birthPlace],
  ['documentType', (g) => g.documentType],
  ['documentNumber', (g) => g.documentNumber],
  ['residenceCountry', (g) => toAlpha3(g.residenceCountry)],
  ['residenceCity', (g) => g.residenceCity],
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
