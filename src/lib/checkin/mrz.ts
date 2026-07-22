// src/lib/checkin/mrz.ts
// ICAO 9303 MRZ check-digit verification. Weights 7,3,1 repeating;
// '<' = 0, '0'-'9' = face value, 'A'-'Z' = 10-35.

const WEIGHTS = [7, 3, 1];

function charValue(c: string): number {
  if (c === '<') return 0;
  if (c >= '0' && c <= '9') return c.charCodeAt(0) - 48;
  if (c >= 'A' && c <= 'Z') return c.charCodeAt(0) - 55;
  return -1;
}

export function mrzCheckDigit(field: string): number {
  let sum = 0;
  for (let i = 0; i < field.length; i++) {
    const v = charValue(field[i]);
    if (v < 0) return -1;
    sum += v * WEIGHTS[i % 3];
  }
  return sum % 10;
}

function fieldValid(field: string, digit: string): boolean {
  return /^[0-9]$/.test(digit) && mrzCheckDigit(field) === Number(digit);
}

// MRZ dates are YYMMDD. Birth dates pivot: <= current 2-digit year -> 20xx.
export function mrzDateToIso(yymmdd: string): string | null {
  if (!/^\d{6}$/.test(yymmdd)) return null;
  const yy = Number(yymmdd.slice(0, 2));
  const cutoff = new Date().getFullYear() - 2000;
  const year = yy <= cutoff ? 2000 + yy : 1900 + yy;
  return `${year}-${yymmdd.slice(2, 4)}-${yymmdd.slice(4, 6)}`;
}

export interface MrzVerification {
  recognized: boolean;
  documentNumber: string | null; // stripped of '<' filler
  documentNumberValid: boolean | null;
  birthDateIso: string | null;
  birthDateValid: boolean | null;
}

const NONE: MrzVerification = {
  recognized: false,
  documentNumber: null,
  documentNumberValid: null,
  birthDateIso: null,
  birthDateValid: null,
};

export function verifyMrz(lines: string[]): MrzVerification {
  const clean = lines.map((l) => l.trim().toUpperCase().replace(/\s/g, ''));
  // TD3 passport: 2 lines x 44
  if (clean.length === 2 && clean[1].length === 44) {
    const l2 = clean[1];
    const doc = l2.slice(0, 9);
    const dob = l2.slice(13, 19);
    return {
      recognized: true,
      documentNumber: doc.replace(/</g, ''),
      documentNumberValid: fieldValid(doc, l2[9]),
      birthDateIso: mrzDateToIso(dob),
      birthDateValid: fieldValid(dob, l2[19]),
    };
  }
  // TD1 id card: 3 lines x 30
  if (clean.length === 3 && clean[0].length === 30 && clean[1].length === 30) {
    const doc = clean[0].slice(5, 14);
    const dob = clean[1].slice(0, 6);
    return {
      recognized: true,
      documentNumber: doc.replace(/</g, ''),
      documentNumberValid: fieldValid(doc, clean[0][14]),
      birthDateIso: mrzDateToIso(dob),
      birthDateValid: fieldValid(dob, clean[1][6]),
    };
  }
  return NONE;
}
