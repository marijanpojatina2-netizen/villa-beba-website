// src/lib/checkin/validate.ts
// Guest record shape mirrors the eVisitor tourist-registration form 1:1.

export interface GuestInput {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  citizenship: string; // ISO 3166-1 alpha-2
  birthDate: string; // YYYY-MM-DD
  birthPlace: string;
  documentType: 'id_card' | 'passport' | 'other';
  documentNumber: string;
  residenceCountry: string; // ISO 3166-1 alpha-2
  residenceCity: string;
  arrivalDate: string; // YYYY-MM-DD
  departureDate: string; // YYYY-MM-DD
}

// ISO 3166-1 alpha-2. Render names client-side with Intl.DisplayNames.
export const COUNTRIES: string[] = [
  'AD','AE','AF','AG','AL','AM','AO','AR','AT','AU','AZ','BA','BB','BD','BE',
  'BF','BG','BH','BI','BJ','BN','BO','BR','BS','BT','BW','BY','BZ','CA','CD',
  'CF','CG','CH','CI','CL','CM','CN','CO','CR','CU','CV','CY','CZ','DE','DJ',
  'DK','DM','DO','DZ','EC','EE','EG','ER','ES','ET','FI','FJ','FM','FR','GA',
  'GB','GD','GE','GH','GM','GN','GQ','GR','GT','GW','GY','HN','HR','HT','HU',
  'ID','IE','IL','IN','IQ','IR','IS','IT','JM','JO','JP','KE','KG','KH','KI',
  'KM','KN','KP','KR','KW','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU',
  'LV','LY','MA','MC','MD','ME','MG','MH','MK','ML','MM','MN','MR','MT','MU',
  'MV','MW','MX','MY','MZ','NA','NE','NG','NI','NL','NO','NP','NR','NZ','OM',
  'PA','PE','PG','PH','PK','PL','PS','PT','PW','PY','QA','RO','RS','RU','RW',
  'SA','SB','SC','SD','SE','SG','SI','SK','SL','SM','SN','SO','SR','SS','ST',
  'SV','SY','SZ','TD','TG','TH','TJ','TL','TM','TN','TO','TR','TT','TV','TW',
  'TZ','UA','UG','US','UY','UZ','VA','VC','VE','VN','VU','WS','XK','YE','ZA',
  'ZM','ZW',
];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(s: string): boolean {
  if (!ISO_DATE.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && s === d.toISOString().slice(0, 10);
}

// Returns list of invalid field names (empty = valid).
export function validateGuest(g: GuestInput): string[] {
  const errs: string[] = [];
  if (!g.firstName?.trim() || g.firstName.length > 100) errs.push('firstName');
  if (!g.lastName?.trim() || g.lastName.length > 100) errs.push('lastName');
  if (g.gender !== 'M' && g.gender !== 'F') errs.push('gender');
  if (!COUNTRIES.includes(g.citizenship)) errs.push('citizenship');
  if (!isRealDate(g.birthDate) || g.birthDate > new Date().toISOString().slice(0, 10)) {
    errs.push('birthDate');
  }
  if (g.birthPlace.length > 100) errs.push('birthPlace'); // optional field
  if (!['id_card', 'passport', 'other'].includes(g.documentType)) errs.push('documentType');
  if (!g.documentNumber?.trim() || !/^[A-Za-z0-9<\- ]{3,20}$/.test(g.documentNumber)) {
    errs.push('documentNumber');
  }
  if (!COUNTRIES.includes(g.residenceCountry)) errs.push('residenceCountry');
  if (!g.residenceCity?.trim() || g.residenceCity.length > 100) errs.push('residenceCity');
  if (!isRealDate(g.arrivalDate)) errs.push('arrivalDate');
  if (!isRealDate(g.departureDate) || g.departureDate <= g.arrivalDate) {
    errs.push('departureDate');
  }
  return errs;
}
