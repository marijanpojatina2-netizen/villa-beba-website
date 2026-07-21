# eVisitor Guest Check-in Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Guests register personal data via a unique per-booking link (with AI ID/passport scan); owner reviews in a password-protected admin and gets an eVisitor-ready payload.

**Architecture:** Everything inside the existing Next.js 16 app. Neon Postgres (plain SQL via `@neondatabase/serverless`), server actions for all mutations (pattern of `src/app/actions/contact.ts`), Claude vision (`@anthropic-ai/sdk`, structured outputs) for document scan — image processed in memory, never stored. Guest wizard under `/{locale}/checkin/[token]` (EN/DE, noindex); admin under `/admin` (English, HMAC-signed cookie auth). Daily Vercel cron purges data 90 days after departure.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, next-intl, `@neondatabase/serverless`, `@anthropic-ai/sdk`, Resend, `node --test` (Node 24, native TS type-stripping is NOT used — tests run via `npx -y tsx --test` so `@/`-free relative extensionless imports work).

**Spec:** `docs/superpowers/specs/2026-07-22-evisitor-checkin-design.md`

**New env vars:** `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_COOKIE_SECRET`, `ANTHROPIC_API_KEY`, `CRON_SECRET` (plus existing `RESEND_API_KEY`, `OWNER_EMAIL`).

**Conventions for all tasks:**
- Commit after every green step; never commit `.env*`.
- Pure-logic modules in `src/lib/checkin/` must not import Next.js/React or use `@/` aliases between each other (tests run outside Next via tsx).
- Deviation from spec (approved rationale): scan model is `claude-opus-4-8` (not Haiku) — accuracy on MRZ/ID reading matters more than <1¢/scan; single `SCAN_MODEL` constant to change.

---

### Task 0: Dependencies + test script

**Files:**
- Modify: `package.json`

- [ ] **Step 0.1: Install deps**

Run: `npm install @neondatabase/serverless @anthropic-ai/sdk`
Expected: both added to `dependencies`, no peer errors.

- [ ] **Step 0.2: Add test script**

In `package.json` `"scripts"`, add:

```json
"test:checkin": "npx -y tsx --test src/lib/checkin/token.test.ts src/lib/checkin/mrz.test.ts src/lib/checkin/validate.test.ts src/lib/checkin/evisitor.test.ts src/lib/checkin/admin-auth.test.ts"
```

- [ ] **Step 0.3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(checkin): add neon + anthropic deps and checkin test script"
```

---

### Task 1: Token utility (TDD)

**Files:**
- Create: `src/lib/checkin/token.ts`
- Test: `src/lib/checkin/token.test.ts`

- [ ] **Step 1.1: Write the failing test**

```ts
// src/lib/checkin/token.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateToken, isValidTokenFormat } from './token';

test('generateToken returns 22-char URL-safe string', () => {
  const t = generateToken();
  assert.equal(t.length, 22);
  assert.match(t, /^[A-Za-z0-9_-]+$/);
});

test('generateToken is unique across calls', () => {
  const set = new Set(Array.from({ length: 100 }, () => generateToken()));
  assert.equal(set.size, 100);
});

test('isValidTokenFormat accepts generated tokens, rejects junk', () => {
  assert.equal(isValidTokenFormat(generateToken()), true);
  assert.equal(isValidTokenFormat(''), false);
  assert.equal(isValidTokenFormat('short'), false);
  assert.equal(isValidTokenFormat('x'.repeat(22) + '!'), false);
  assert.equal(isValidTokenFormat("'; DROP TABLE guests;--"), false);
});
```

- [ ] **Step 1.2: Run to verify it fails**

Run: `npx -y tsx --test src/lib/checkin/token.test.ts`
Expected: FAIL (cannot find module './token').

- [ ] **Step 1.3: Implement**

```ts
// src/lib/checkin/token.ts
import { randomBytes } from 'node:crypto';

// 16 random bytes -> 22 base64url chars (~128 bits): unguessable booking link.
export function generateToken(): string {
  return randomBytes(16).toString('base64url');
}

export function isValidTokenFormat(token: string): boolean {
  return /^[A-Za-z0-9_-]{22}$/.test(token);
}
```

- [ ] **Step 1.4: Run test — PASS.** Then commit:

```bash
git add src/lib/checkin/token.ts src/lib/checkin/token.test.ts
git commit -m "feat(checkin): booking-link token generator"
```

---

### Task 2: MRZ check-digit verification (TDD)

The machine-readable zone on passports (TD3, 2×44 chars) and EU ID cards (TD1, 3×30 chars) carries check digits (weights 7,3,1; `<`=0, digits=face value, A–Z=10–35). We use them to mathematically confirm the AI-read document number and birth date.

**Files:**
- Create: `src/lib/checkin/mrz.ts`
- Test: `src/lib/checkin/mrz.test.ts`

- [ ] **Step 2.1: Write the failing test**

```ts
// src/lib/checkin/mrz.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mrzCheckDigit, verifyMrz, mrzDateToIso } from './mrz';

test('mrzCheckDigit matches ICAO 9303 example', () => {
  // Known example from ICAO doc 9303: "L898902C3" -> 6 ; "740812" -> 2 ; "120415" -> 9
  assert.equal(mrzCheckDigit('L898902C3'), 6);
  assert.equal(mrzCheckDigit('740812'), 2);
  assert.equal(mrzCheckDigit('120415'), 9);
});

test('verifyMrz validates TD3 (passport) specimen', () => {
  const lines = [
    'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<',
    'L898902C36UTO7408122F1204159ZE184226B<<<<<10',
  ];
  const v = verifyMrz(lines);
  assert.equal(v.recognized, true);
  assert.equal(v.documentNumber, 'L898902C3');
  assert.equal(v.documentNumberValid, true);
  assert.equal(v.birthDateValid, true);
  assert.equal(v.birthDateIso, '1974-08-12');
});

test('verifyMrz flags corrupted check digit', () => {
  const lines = [
    'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<',
    'L898902C37UTO7408122F1204159ZE184226B<<<<<10', // doc check digit 6 -> 7
  ];
  assert.equal(verifyMrz(lines).documentNumberValid, false);
});

test('verifyMrz validates TD1 (ID card) layout', () => {
  // TD1 line1: doc type(2) + issuer(3) + docnum(9) + check(1) + optional
  // Build a synthetic-but-valid TD1 using our own check digits.
  const doc = 'D23145890';
  const dob = '740812';
  const l1 = ('I<UTO' + doc + mrzCheckDigit(doc)).padEnd(30, '<');
  const l2 = (dob + mrzCheckDigit(dob) + 'F1204159UTO').padEnd(29, '<') + '6';
  const l3 = 'ERIKSSON<<ANNA<MARIA<<<<<<<<<<';
  const v = verifyMrz([l1, l2, l3]);
  assert.equal(v.recognized, true);
  assert.equal(v.documentNumber, doc);
  assert.equal(v.documentNumberValid, true);
  assert.equal(v.birthDateValid, true);
});

test('verifyMrz returns unrecognized for junk', () => {
  assert.equal(verifyMrz(['hello']).recognized, false);
  assert.equal(verifyMrz([]).recognized, false);
});

test('mrzDateToIso applies birth-date century pivot', () => {
  assert.equal(mrzDateToIso('740812'), '1974-08-12');
  assert.equal(mrzDateToIso('150301'), '2015-03-01');
  assert.equal(mrzDateToIso('badxxx'), null);
});
```

- [ ] **Step 2.2: Run to verify it fails**

Run: `npx -y tsx --test src/lib/checkin/mrz.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 2.3: Implement**

```ts
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
  documentNumber: string | null;    // stripped of '<' filler
  documentNumberValid: boolean | null;
  birthDateIso: string | null;
  birthDateValid: boolean | null;
}

const NONE: MrzVerification = {
  recognized: false, documentNumber: null, documentNumberValid: null,
  birthDateIso: null, birthDateValid: null,
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
```

- [ ] **Step 2.4: Run test — PASS.** Commit:

```bash
git add src/lib/checkin/mrz.ts src/lib/checkin/mrz.test.ts
git commit -m "feat(checkin): ICAO 9303 MRZ check-digit verification"
```

---

### Task 3: Guest types, country list, validation (TDD)

**Files:**
- Create: `src/lib/checkin/validate.ts`
- Test: `src/lib/checkin/validate.test.ts`

- [ ] **Step 3.1: Write the failing test**

```ts
// src/lib/checkin/validate.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateGuest, COUNTRIES, type GuestInput } from './validate';

const ok: GuestInput = {
  firstName: 'Anna', lastName: 'Eriksson', gender: 'F', citizenship: 'DE',
  birthDate: '1974-08-12', birthPlace: 'Berlin', documentType: 'passport',
  documentNumber: 'L898902C3', residenceCountry: 'DE', residenceCity: 'Berlin',
  arrivalDate: '2026-08-01', departureDate: '2026-08-08',
};

test('valid guest has no errors', () => {
  assert.deepEqual(validateGuest(ok), []);
});

test('missing required fields are reported', () => {
  const errs = validateGuest({ ...ok, firstName: ' ', documentNumber: '' });
  assert.ok(errs.includes('firstName'));
  assert.ok(errs.includes('documentNumber'));
});

test('bad enum/country/date values are reported', () => {
  assert.ok(validateGuest({ ...ok, gender: 'X' as never }).includes('gender'));
  assert.ok(validateGuest({ ...ok, citizenship: 'ZZ' }).includes('citizenship'));
  assert.ok(validateGuest({ ...ok, birthDate: '12.08.1974' }).includes('birthDate'));
  assert.ok(validateGuest({ ...ok, birthDate: '2999-01-01' }).includes('birthDate'));
  assert.ok(validateGuest({ ...ok, departureDate: '2026-07-01' }).includes('departureDate'));
});

test('country list contains key markets and is deduped', () => {
  for (const c of ['HR', 'DE', 'AT', 'GB', 'US', 'CH', 'IT', 'SI', 'NL', 'FR']) {
    assert.ok(COUNTRIES.includes(c), c);
  }
  assert.equal(new Set(COUNTRIES).size, COUNTRIES.length);
});
```

- [ ] **Step 3.2: Run to verify it fails** — `npx -y tsx --test src/lib/checkin/validate.test.ts` → FAIL.

- [ ] **Step 3.3: Implement**

```ts
// src/lib/checkin/validate.ts
// Guest record shape mirrors the eVisitor tourist-registration form 1:1.

export interface GuestInput {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  citizenship: string;       // ISO 3166-1 alpha-2
  birthDate: string;         // YYYY-MM-DD
  birthPlace: string;
  documentType: 'id_card' | 'passport' | 'other';
  documentNumber: string;
  residenceCountry: string;  // ISO 3166-1 alpha-2
  residenceCity: string;
  arrivalDate: string;       // YYYY-MM-DD
  departureDate: string;     // YYYY-MM-DD
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
```

- [ ] **Step 3.4: Run test — PASS.** Commit:

```bash
git add src/lib/checkin/validate.ts src/lib/checkin/validate.test.ts
git commit -m "feat(checkin): guest validation + ISO country list"
```

---

### Task 4: eVisitor payload + CSV export (TDD)

**Files:**
- Create: `src/lib/checkin/evisitor.ts`
- Test: `src/lib/checkin/evisitor.test.ts`

- [ ] **Step 4.1: Write the failing test**

```ts
// src/lib/checkin/evisitor.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildEvisitorPayload, guestsToCsv } from './evisitor';
import type { GuestInput } from './validate';

const guest: GuestInput = {
  firstName: 'Anna', lastName: 'Eriksson', gender: 'F', citizenship: 'DE',
  birthDate: '1974-08-12', birthPlace: 'Berlin', documentType: 'passport',
  documentNumber: 'L898902C3', residenceCountry: 'DE', residenceCity: 'Berlin',
  arrivalDate: '2026-08-01', departureDate: '2026-08-08',
};

test('payload maps 1:1 to eVisitor field names', () => {
  const p = buildEvisitorPayload({ villa: 'ballena' }, [guest]);
  assert.equal(p.facility, 'Villa Ballena');
  assert.equal(p.tourists.length, 1);
  const t = p.tourists[0];
  assert.equal(t.surname, 'Eriksson');
  assert.equal(t.name, 'Anna');
  assert.equal(t.gender, 'F');
  assert.equal(t.citizenshipCode, 'DE');
  assert.equal(t.dateOfBirth, '1974-08-12');
  assert.equal(t.documentType, 'passport');
  assert.equal(t.stayFrom, '2026-08-01');
  assert.equal(t.foreseenStayUntil, '2026-08-08');
});

test('csv has header + one row per guest, quotes commas', () => {
  const csv = guestsToCsv([guest, { ...guest, residenceCity: 'Berlin, Mitte' }]);
  const rows = csv.trim().split('\n');
  assert.equal(rows.length, 3);
  assert.ok(rows[0].startsWith('surname,name,gender'));
  assert.ok(rows[2].includes('"Berlin, Mitte"'));
});
```

- [ ] **Step 4.2: Run to verify it fails** → FAIL (module not found).

- [ ] **Step 4.3: Implement**

```ts
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
```

- [ ] **Step 4.4: Run test — PASS.** Commit:

```bash
git add src/lib/checkin/evisitor.ts src/lib/checkin/evisitor.test.ts
git commit -m "feat(checkin): eVisitor payload mapping + CSV export"
```

---

### Task 5: Admin session signing (TDD)

**Files:**
- Create: `src/lib/checkin/admin-auth.ts`
- Test: `src/lib/checkin/admin-auth.test.ts`

- [ ] **Step 5.1: Write the failing test**

```ts
// src/lib/checkin/admin-auth.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signSession, verifySession } from './admin-auth';

const SECRET = 'test-secret';

test('signed session verifies before expiry', () => {
  const v = signSession(Date.now() + 60_000, SECRET);
  assert.equal(verifySession(v, SECRET), true);
});

test('expired session fails', () => {
  const v = signSession(Date.now() - 1000, SECRET);
  assert.equal(verifySession(v, SECRET), false);
});

test('tampered value or wrong secret fails', () => {
  const v = signSession(Date.now() + 60_000, SECRET);
  assert.equal(verifySession(v, 'other-secret'), false);
  const [exp, sig] = v.split('.');
  assert.equal(verifySession(`${Number(exp) + 999999}.${sig}`, SECRET), false);
  assert.equal(verifySession('garbage', SECRET), false);
  assert.equal(verifySession('', SECRET), false);
});
```

- [ ] **Step 5.2: Run to verify it fails** → FAIL.

- [ ] **Step 5.3: Implement**

```ts
// src/lib/checkin/admin-auth.ts
// Stateless signed session for the single-admin dashboard:
// cookie value = "<expiryMs>.<hmac-sha256(expiryMs, secret)>".

import { createHmac, timingSafeEqual } from 'node:crypto';

function hmac(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function signSession(expiresAtMs: number, secret: string): string {
  const exp = String(expiresAtMs);
  return `${exp}.${hmac(exp, secret)}`;
}

export function verifySession(value: string, secret: string): boolean {
  const dot = value.indexOf('.');
  if (dot <= 0) return false;
  const exp = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!/^\d{10,16}$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = hmac(exp, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
```

- [ ] **Step 5.4: Run all unit tests**

Run: `npm run test:checkin`
Expected: all 5 test files PASS.

- [ ] **Step 5.5: Commit**

```bash
git add src/lib/checkin/admin-auth.ts src/lib/checkin/admin-auth.test.ts
git commit -m "feat(checkin): HMAC-signed admin session"
```

---

### Task 6: Database schema + setup script + data access

**Files:**
- Create: `scripts/checkin-schema.sql`
- Create: `scripts/db-setup.mjs`
- Create: `src/lib/checkin/db.ts`

- [ ] **Step 6.1: Schema**

```sql
-- scripts/checkin-schema.sql
CREATE TABLE IF NOT EXISTS checkin_links (
  id              SERIAL PRIMARY KEY,
  token           TEXT UNIQUE NOT NULL,
  villa           TEXT NOT NULL CHECK (villa IN ('ballena','beluga','both')),
  arrival_date    DATE NOT NULL,
  departure_date  DATE NOT NULL,
  expected_guests INT  NOT NULL DEFAULT 2 CHECK (expected_guests BETWEEN 1 AND 20),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','submitted','pushed')),
  scan_count      INT  NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS guests (
  id                SERIAL PRIMARY KEY,
  link_id           INT NOT NULL REFERENCES checkin_links(id) ON DELETE CASCADE,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  gender            TEXT NOT NULL CHECK (gender IN ('M','F')),
  citizenship       TEXT NOT NULL,
  birth_date        DATE NOT NULL,
  birth_place       TEXT NOT NULL DEFAULT '',
  document_type     TEXT NOT NULL CHECK (document_type IN ('id_card','passport','other')),
  document_number   TEXT NOT NULL,
  residence_country TEXT NOT NULL,
  residence_city    TEXT NOT NULL,
  arrival_date      DATE NOT NULL,
  departure_date    DATE NOT NULL,
  pushed_at         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guests_link_id_idx ON guests(link_id);
```

- [ ] **Step 6.2: Setup script**

```js
// scripts/db-setup.mjs
// One-time schema setup: DATABASE_URL=... node scripts/db-setup.mjs
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set. Get it from the Neon dashboard (Vercel > Storage).');
  process.exit(1);
}

const schemaPath = join(dirname(fileURLToPath(import.meta.url)), 'checkin-schema.sql');
const ddl = readFileSync(schemaPath, 'utf8');
const sql = neon(url);

// Split on ';' at end of statement — schema file has no procedural SQL.
const statements = ddl.split(/;\s*(?:\n|$)/).map((s) => s.trim()).filter(Boolean);
for (const stmt of statements) {
  await sql.query(stmt);
  console.log('OK:', stmt.split('\n')[0]);
}
console.log('Schema ready.');
```

- [ ] **Step 6.3: Data access layer**

```ts
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
  status: 'pending' | 'submitted' | 'pushed';
  scan_count: number;
  created_at: string;
  submitted_at: string | null;
}

export interface GuestRow extends Record<string, unknown> {
  id: number;
  link_id: number;
  first_name: string;
  last_name: string;
  gender: 'M' | 'F';
  citizenship: string;
  birth_date: string;
  birth_place: string;
  document_type: 'id_card' | 'passport' | 'other';
  document_number: string;
  residence_country: string;
  residence_city: string;
  arrival_date: string;
  departure_date: string;
  pushed_at: string | null;
}

// Neon returns DATE columns as JS Date objects or strings depending on driver
// version — normalize to YYYY-MM-DD.
function iso(d: unknown): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
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
  token: string; villa: string; arrivalDate: string; departureDate: string; expectedGuests: number;
}): Promise<number> {
  const rows = await sql()`
    INSERT INTO checkin_links (token, villa, arrival_date, departure_date, expected_guests)
    VALUES (${input.token}, ${input.villa}, ${input.arrivalDate}, ${input.departureDate}, ${input.expectedGuests})
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
        birth_date, birth_place, document_type, document_number,
        residence_country, residence_city, arrival_date, departure_date)
      VALUES (${linkId}, ${g.firstName}, ${g.lastName}, ${g.gender}, ${g.citizenship},
        ${g.birthDate}, ${g.birthPlace}, ${g.documentType}, ${g.documentNumber},
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
```

Note: `server-only` package — Next.js provides this; if the import errors at build, run `npm i server-only`.

- [ ] **Step 6.4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors (pre-existing errors, if any, unchanged).

- [ ] **Step 6.5: Commit**

```bash
git add scripts/checkin-schema.sql scripts/db-setup.mjs src/lib/checkin/db.ts
git commit -m "feat(checkin): neon schema, setup script, data access layer"
```

---

### Task 7: Admin guard + admin/checkin route plumbing (config edits)

**Files:**
- Create: `src/lib/checkin/admin-guard.ts`
- Modify: `next.config.ts` (redirect regex — **without this `/admin` 308s to `/en/admin` and 404s**)
- Modify: `src/app/robots.ts`

- [ ] **Step 7.1: Admin guard (server-side helper)**

```ts
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
```

- [ ] **Step 7.2: Fix locale-less redirect to exclude /admin**

In `next.config.ts`, change the second redirect's `source` from:

```ts
source: '/:path((?!en$|en/|de$|de/|_next/|api/|.*\\.).*)',
```

to:

```ts
source: '/:path((?!en$|en/|de$|de/|_next/|api/|admin$|admin/|.*\\.).*)',
```

- [ ] **Step 7.3: robots.ts — disallow admin + checkin**

Replace the `disallow` array in `src/app/robots.ts`:

```ts
disallow: ['/api/', '/_next/', '/admin', '/en/checkin/', '/de/checkin/'],
```

- [ ] **Step 7.4: Typecheck + commit**

Run: `npx tsc --noEmit` → clean.

```bash
git add src/lib/checkin/admin-guard.ts next.config.ts src/app/robots.ts
git commit -m "feat(checkin): admin guard; exclude /admin from locale redirect; robots disallow"
```

---

### Task 8: Server actions — scan, submit, admin

**Files:**
- Create: `src/app/actions/checkin.ts`
- Create: `src/app/actions/admin.ts`

- [ ] **Step 8.1: Guest-facing actions (scan + submit)**

```ts
// src/app/actions/checkin.ts
'use server';

import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { CONTACT } from '@/lib/contact';
import { isValidTokenFormat } from '@/lib/checkin/token';
import { verifyMrz } from '@/lib/checkin/mrz';
import { validateGuest, type GuestInput } from '@/lib/checkin/validate';
import {
  getLinkByToken, tryConsumeScan, claimSubmission, insertGuests, revertSubmission,
} from '@/lib/checkin/db';

// Opus for accuracy on MRZ/ID reading; cost per scan is <1 cent at ~1600px.
const SCAN_MODEL = 'claude-opus-4-8';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const SCAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'firstName', 'lastName', 'gender', 'citizenship', 'birthDate', 'birthPlace',
    'documentType', 'documentNumber', 'mrzLines', 'lowConfidenceFields',
  ],
  properties: {
    firstName: { type: ['string', 'null'] },
    lastName: { type: ['string', 'null'] },
    gender: { type: ['string', 'null'], enum: ['M', 'F', null] },
    citizenship: {
      type: ['string', 'null'],
      description: 'ISO 3166-1 alpha-2 country code of citizenship/nationality',
    },
    birthDate: { type: ['string', 'null'], description: 'YYYY-MM-DD' },
    birthPlace: { type: ['string', 'null'] },
    documentType: { type: ['string', 'null'], enum: ['id_card', 'passport', 'other', null] },
    documentNumber: { type: ['string', 'null'] },
    mrzLines: {
      type: 'array', items: { type: 'string' },
      description: 'Machine-readable zone lines exactly as printed, or empty array',
    },
    lowConfidenceFields: {
      type: 'array', items: { type: 'string' },
      description: 'Names of fields you are not confident about',
    },
  },
} as const;

const SCAN_PROMPT =
  'Read this identity document (ID card or passport). Extract the holder’s data ' +
  'into the JSON schema. Use the MRZ lines when present — transcribe them character-' +
  'for-character including "<" fillers. Dates as YYYY-MM-DD. citizenship as ISO ' +
  '3166-1 alpha-2 (e.g. DE, HR, AT). If a field is unreadable or absent, use null ' +
  'and list it in lowConfidenceFields. Do not guess document numbers.';

export interface ScanResult {
  success: boolean;
  error?: 'invalid_request' | 'scan_limit' | 'unreadable' | 'scan_failed';
  fields?: Partial<GuestInput>;
  // Fields the guest should double-check (AI unsure or MRZ checksum mismatch).
  reviewFields?: string[];
  mrzVerified?: boolean;
}

export async function scanDocument(formData: FormData): Promise<ScanResult> {
  const token = String(formData.get('token') ?? '');
  const file = formData.get('image');
  if (!isValidTokenFormat(token) || !(file instanceof File)) {
    return { success: false, error: 'invalid_request' };
  }
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES ||
      !IMAGE_TYPES.includes(file.type as (typeof IMAGE_TYPES)[number])) {
    return { success: false, error: 'invalid_request' };
  }
  if (!(await tryConsumeScan(token))) {
    return { success: false, error: 'scan_limit' };
  }

  // Image is held in memory only for the duration of this call — never persisted.
  const data = Buffer.from(await file.arrayBuffer()).toString('base64');

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: SCAN_MODEL,
      max_tokens: 2000,
      output_config: { format: { type: 'json_schema', schema: SCAN_SCHEMA } },
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
              data,
            },
          },
          { type: 'text', text: SCAN_PROMPT },
        ],
      }],
    });

    if (response.stop_reason === 'refusal' || response.content.length === 0) {
      return { success: false, error: 'unreadable' };
    }
    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return { success: false, error: 'scan_failed' };
    }
    const raw = JSON.parse(textBlock.text) as {
      firstName: string | null; lastName: string | null; gender: 'M' | 'F' | null;
      citizenship: string | null; birthDate: string | null; birthPlace: string | null;
      documentType: GuestInput['documentType'] | null; documentNumber: string | null;
      mrzLines: string[]; lowConfidenceFields: string[];
    };

    const review = new Set(raw.lowConfidenceFields);
    let mrzVerified = false;
    const mrz = verifyMrz(raw.mrzLines ?? []);
    if (mrz.recognized) {
      // Checksum-verified MRZ values override the visually-read ones.
      if (mrz.documentNumberValid && mrz.documentNumber) {
        raw.documentNumber = mrz.documentNumber;
        review.delete('documentNumber');
      } else if (mrz.documentNumberValid === false) {
        review.add('documentNumber');
      }
      if (mrz.birthDateValid && mrz.birthDateIso) {
        raw.birthDate = mrz.birthDateIso;
        review.delete('birthDate');
      } else if (mrz.birthDateValid === false) {
        review.add('birthDate');
      }
      mrzVerified = mrz.documentNumberValid === true && mrz.birthDateValid === true;
    }

    const fields: Partial<GuestInput> = {};
    if (raw.firstName) fields.firstName = raw.firstName;
    if (raw.lastName) fields.lastName = raw.lastName;
    if (raw.gender) fields.gender = raw.gender;
    if (raw.citizenship) {
      fields.citizenship = raw.citizenship.toUpperCase();
      // Sensible default: residence country usually matches citizenship.
      fields.residenceCountry = raw.citizenship.toUpperCase();
    }
    if (raw.birthDate) fields.birthDate = raw.birthDate;
    if (raw.birthPlace) fields.birthPlace = raw.birthPlace;
    if (raw.documentType) fields.documentType = raw.documentType;
    if (raw.documentNumber) fields.documentNumber = raw.documentNumber.toUpperCase();

    if (Object.keys(fields).length === 0) {
      return { success: false, error: 'unreadable' };
    }
    return { success: true, fields, reviewFields: [...review], mrzVerified };
  } catch (err) {
    console.error('[checkin] scan error:', err instanceof Error ? err.message : String(err));
    return { success: false, error: 'scan_failed' };
  }
}

export interface SubmitResult {
  success: boolean;
  error?: 'invalid_request' | 'already_submitted' | 'validation' | 'server';
  invalidGuests?: Array<{ index: number; fields: string[] }>;
}

export async function submitCheckin(
  token: string,
  guests: GuestInput[],
): Promise<SubmitResult> {
  if (!isValidTokenFormat(token) || !Array.isArray(guests) ||
      guests.length === 0 || guests.length > 20) {
    return { success: false, error: 'invalid_request' };
  }
  const link = await getLinkByToken(token);
  if (!link) return { success: false, error: 'invalid_request' };
  if (link.status !== 'pending') return { success: false, error: 'already_submitted' };

  const invalid = guests
    .map((g, index) => ({ index, fields: validateGuest(g) }))
    .filter((r) => r.fields.length > 0);
  if (invalid.length) {
    return { success: false, error: 'validation', invalidGuests: invalid };
  }

  const linkId = await claimSubmission(token);
  if (linkId === null) return { success: false, error: 'already_submitted' };

  try {
    await insertGuests(linkId, guests);
  } catch (err) {
    console.error('[checkin] insert error:', err instanceof Error ? err.message : String(err));
    await revertSubmission(linkId).catch(() => {});
    return { success: false, error: 'server' };
  }

  // Email is a notification only — submission already saved. No document
  // numbers in the email; details live in /admin.
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const names = guests.map((g) => `${g.firstName} ${g.lastName}`).join(', ');
      await resend.emails.send({
        from: 'Villa Ballena & Beluga <onboarding@resend.dev>',
        to: [process.env.OWNER_EMAIL || CONTACT.email],
        subject: `Guest check-in received — ${link.villa} — ${link.arrival_date}`,
        html:
          `<p>${guests.length} guest(s) submitted check-in data for ` +
          `<strong>${link.villa}</strong>, ${link.arrival_date} → ${link.departure_date}.</p>` +
          `<p>${names}</p>` +
          `<p><a href="https://www.ballenaandbeluga.com/admin">Open admin</a> to review and push to eVisitor.</p>`,
      });
    }
  } catch (err) {
    console.error('[checkin] notify error:', err instanceof Error ? err.message : String(err));
  }

  return { success: true };
}
```

- [ ] **Step 8.2: Admin actions**

```ts
// src/app/actions/admin.ts
'use server';

import { timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signSession } from '@/lib/checkin/admin-auth';
import { ADMIN_COOKIE, assertAdmin } from '@/lib/checkin/admin-guard';
import { generateToken } from '@/lib/checkin/token';
import { createLink, markPushed } from '@/lib/checkin/db';

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
  if (!['ballena', 'beluga', 'both'].includes(villa) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(arrivalDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(departureDate) ||
      departureDate <= arrivalDate ||
      !Number.isInteger(expectedGuests) || expectedGuests < 1 || expectedGuests > 20) {
    throw new Error('Invalid link parameters');
  }
  const id = await createLink({
    token: generateToken(), villa, arrivalDate, departureDate, expectedGuests,
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
```

- [ ] **Step 8.3: Typecheck + commit**

Run: `npx tsc --noEmit` → clean. If the SDK type for `output_config` complains, check the installed `@anthropic-ai/sdk` version supports `output_config` (upgrade to latest if not) — do NOT silence with `as never`.

```bash
git add src/app/actions/checkin.ts src/app/actions/admin.ts
git commit -m "feat(checkin): scan + submit + admin server actions"
```

---

### Task 9: Guest wizard UI (EN/DE)

**Files:**
- Create: `src/app/[locale]/checkin/[token]/page.tsx`
- Create: `src/app/[locale]/checkin/[token]/CheckinWizard.tsx`
- Modify: `messages/en.json`, `messages/de.json` (add `"checkin"` namespace)

- [ ] **Step 9.1: Add translations**

Add to `messages/en.json` (top-level key, alphabetical placement not required — append before final `}`):

```json
"checkin": {
  "title": "Guest check-in",
  "intro": "Croatian law requires us to register every guest with the national eVisitor system. Please enter the details below exactly as they appear on your travel document. Your data is transmitted securely, used only for this registration and deleted 90 days after departure.",
  "stay": "Your stay",
  "guests": "Number of guests",
  "guestN": "Guest {n}",
  "scanCta": "Scan document",
  "scanHint": "Photograph your ID card or passport — we fill the form for you. The photo is processed once and never stored.",
  "scanning": "Reading document…",
  "scanFailedTitle": "We could not read the document",
  "scanFailed": "Please try a sharper photo, or enter the details manually below.",
  "scanLimit": "Scan limit reached — please enter the details manually.",
  "scanOk": "Document read successfully. Please review every field before continuing.",
  "scanReview": "Please double-check the highlighted fields.",
  "manualCta": "Enter manually",
  "firstName": "First name",
  "lastName": "Last name",
  "gender": "Gender",
  "genderM": "Male",
  "genderF": "Female",
  "citizenship": "Citizenship",
  "birthDate": "Date of birth",
  "birthPlace": "Place of birth",
  "documentType": "Document type",
  "docIdCard": "ID card",
  "docPassport": "Passport",
  "docOther": "Other",
  "documentNumber": "Document number",
  "residenceCountry": "Country of residence",
  "residenceCity": "City of residence",
  "arrivalDate": "Arrival",
  "departureDate": "Departure",
  "next": "Next guest",
  "back": "Back",
  "review": "Review & submit",
  "reviewTitle": "Please review all details",
  "edit": "Edit",
  "submit": "Submit check-in",
  "submitting": "Submitting…",
  "fixErrors": "Please correct the highlighted fields.",
  "doneTitle": "Thank you — check-in received!",
  "doneBody": "Your details were sent to your hosts at Villa Ballena & Beluga. There is nothing else to do — we look forward to welcoming you!",
  "alreadyTitle": "Check-in already completed",
  "alreadyBody": "The details for this stay were already submitted. If something needs to change, just contact us.",
  "invalidTitle": "This link is not valid",
  "invalidBody": "The check-in link is invalid or has expired. Please contact us and we will send you a new one.",
  "privacy": "Privacy policy",
  "errorGeneric": "Something went wrong. Please try again."
}
```

Add the German equivalents to `messages/de.json` (same keys; translate naturally, formal "Sie" — e.g. `"title": "Gäste-Check-in"`, `"scanCta": "Dokument scannen"`, `"doneTitle": "Vielen Dank — Check-in erhalten!"`, `"intro": "Nach kroatischem Recht müssen wir jeden Gast im nationalen eVisitor-System anmelden. Bitte tragen Sie die Daten genau so ein, wie sie in Ihrem Reisedokument stehen. Ihre Daten werden sicher übertragen, nur für diese Anmeldung verwendet und 90 Tage nach Abreise gelöscht."` etc. — translate every key).

- [ ] **Step 9.2: Server page (token lookup + noindex)**

```tsx
// src/app/[locale]/checkin/[token]/page.tsx
import { getTranslations } from 'next-intl/server';
import { isValidTokenFormat } from '@/lib/checkin/token';
import { getLinkByToken } from '@/lib/checkin/db';
import CheckinWizard from './CheckinWizard';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Guest check-in · Villa Ballena & Beluga',
    robots: { index: false, follow: false },
  };
}

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  const t = await getTranslations('checkin');

  const link = isValidTokenFormat(token) ? await getLinkByToken(token) : null;

  if (!link) {
    return (
      <main className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-medium">{t('invalidTitle')}</h1>
        <p className="mt-4 text-neutral-600">{t('invalidBody')}</p>
      </main>
    );
  }
  if (link.status !== 'pending') {
    return (
      <main className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-medium">{t('alreadyTitle')}</h1>
        <p className="mt-4 text-neutral-600">{t('alreadyBody')}</p>
      </main>
    );
  }
  return (
    <CheckinWizard
      locale={locale}
      token={token}
      villa={link.villa}
      arrivalDate={link.arrival_date}
      departureDate={link.departure_date}
      expectedGuests={link.expected_guests}
    />
  );
}
```

- [ ] **Step 9.3: Wizard client component**

The largest file. Requirements it must satisfy (implement exactly):

- `'use client'`; props: `locale, token, villa, arrivalDate, departureDate, expectedGuests`.
- Steps: `count` → one step per guest (`guest-0..n-1`) → `review` → `done`.
- Guest state: `GuestInput[]` initialized from `expectedGuests` with `arrivalDate`/`departureDate` prefilled and empty other fields; count adjustable 1–10 (slice/extend array).
- Per-guest step: two buttons at top — **Scan** (label `t('scanCta')` + hint) and manual entry always visible below (fields render regardless; scan just prefills).
  - Scan input: `<input type="file" accept="image/*" capture="environment">` hidden, triggered by button.
  - Client-side downscale before upload (saves API cost + mobile bandwidth):

```ts
async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b ?? file), 'image/jpeg', 0.85),
  );
}
```

  - On scan: build `FormData` (`token`, `image` as `scan.jpg`), call `scanDocument` inside `useTransition`; while pending show `t('scanning')` spinner state on the button; on success merge `result.fields` into the guest (do not overwrite fields the guest already typed), store `result.reviewFields` to highlight those inputs (amber border + `t('scanReview')` note); on error show the mapped message (`scan_limit` → `t('scanLimit')`, else `t('scanFailed')`).
- Field inputs: text inputs for names/places/document number; `<select>` for gender, documentType, citizenship + residenceCountry (options from `COUNTRIES`, labels via `new Intl.DisplayNames([locale], { type: 'region' })`, sorted by label; HR/DE/AT/SI/IT/GB/US/CH/NL/FR listed first); `<input type="date">` for the three dates.
- Client-side validation with `validateGuest` on "next"; invalid fields get red border; error text `t('fixErrors')`.
- Review step: card per guest with all values + `t('edit')` button jumping back to that guest step.
- Submit: `submitCheckin(token, guests)` in `useTransition`; on success → `done` step (`t('doneTitle')`/`t('doneBody')`); on `already_submitted` → show `t('alreadyTitle')`; on `validation` → jump to first invalid guest; other errors → `t('errorGeneric')`.
- Footer link to `/${locale}/privacy` labeled `t('privacy')`.
- Styling: mobile-first, Tailwind, consistent with site (max-w-xl container, py-24, existing font vars are inherited from `[locale]/layout.tsx`; use `font-heading` classes sparingly). Simple progress indicator "Guest 2 / 4".
- Uses `useTranslations('checkin')` from `next-intl` (provider already wraps `[locale]` layout).

- [ ] **Step 9.4: Build + manual check**

Run: `npx tsc --noEmit` then `npm run build` — both clean.

- [ ] **Step 9.5: Commit**

```bash
git add "src/app/[locale]/checkin" messages/en.json messages/de.json
git commit -m "feat(checkin): guest check-in wizard (EN/DE) with AI document scan"
```

---

### Task 10: Admin UI

**Files:**
- Create: `src/app/admin/layout.tsx` (must render `<html>`/`<body>` — root layout is a passthrough and `<html>` lives in `[locale]/layout.tsx`, which /admin does not use)
- Create: `src/app/admin/login/page.tsx` + `src/app/admin/login/LoginForm.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/links/[id]/page.tsx` + `src/app/admin/links/[id]/CopyButton.tsx`

- [ ] **Step 10.1: Admin layout**

```tsx
// src/app/admin/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin · Villa Ballena & Beluga',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <div className="mx-auto max-w-4xl px-6 py-10">{children}</div>
      </body>
    </html>
  );
}
```

- [ ] **Step 10.2: Login page**

```tsx
// src/app/admin/login/page.tsx
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <main className="mx-auto mt-24 max-w-sm">
      <h1 className="text-xl font-medium">Admin login</h1>
      <LoginForm />
    </main>
  );
}
```

```tsx
// src/app/admin/login/LoginForm.tsx
'use client';

import { useActionState } from 'react';
import { adminLogin } from '@/app/actions/admin';

export default function LoginForm() {
  const [state, action, pending] = useActionState(adminLogin, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input
        type="password" name="password" required autoFocus placeholder="Password"
        className="w-full rounded border border-neutral-300 px-3 py-2"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit" disabled={pending}
        className="w-full rounded bg-neutral-900 px-3 py-2 text-white disabled:opacity-50"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
```

- [ ] **Step 10.3: Dashboard (list + create form)**

```tsx
// src/app/admin/page.tsx
import { requireAdmin } from '@/lib/checkin/admin-guard';
import { listLinks } from '@/lib/checkin/db';
import { createCheckinLink, adminLogout } from '@/app/actions/admin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  submitted: 'bg-blue-100 text-blue-800',
  pushed: 'bg-green-100 text-green-800',
};

export default async function AdminPage() {
  await requireAdmin();
  const links = await listLinks();
  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Guest check-ins</h1>
        <form action={adminLogout}>
          <button className="text-sm text-neutral-500 underline">Log out</button>
        </form>
      </div>

      <section className="mt-8 rounded border border-neutral-200 bg-white p-4">
        <h2 className="font-medium">New check-in link</h2>
        <form action={createCheckinLink} className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-sm">Villa<br />
            <select name="villa" className="mt-1 rounded border border-neutral-300 px-2 py-1.5">
              <option value="ballena">Villa Ballena</option>
              <option value="beluga">Villa Beluga</option>
              <option value="both">Both (Complex BeBa)</option>
            </select>
          </label>
          <label className="text-sm">Arrival<br />
            <input type="date" name="arrivalDate" required className="mt-1 rounded border border-neutral-300 px-2 py-1.5" />
          </label>
          <label className="text-sm">Departure<br />
            <input type="date" name="departureDate" required className="mt-1 rounded border border-neutral-300 px-2 py-1.5" />
          </label>
          <label className="text-sm">Guests<br />
            <input type="number" name="expectedGuests" min={1} max={20} defaultValue={2} className="mt-1 w-20 rounded border border-neutral-300 px-2 py-1.5" />
          </label>
          <button className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">Create link</button>
        </form>
      </section>

      <section className="mt-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-300 text-left text-neutral-500">
              <th className="py-2">Villa</th><th>Stay</th><th>Guests</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => (
              <tr key={l.id} className="border-b border-neutral-100">
                <td className="py-2 capitalize">{l.villa}</td>
                <td>{l.arrival_date} → {l.departure_date}</td>
                <td>{l.expected_guests}</td>
                <td>
                  <span className={`rounded px-2 py-0.5 text-xs ${STATUS_STYLE[l.status]}`}>
                    {l.status}
                  </span>
                </td>
                <td><Link className="underline" href={`/admin/links/${l.id}`}>Open</Link></td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-neutral-400">No links yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
```

- [ ] **Step 10.4: Link detail (guest data + eVisitor payload + CSV + mark pushed)**

```tsx
// src/app/admin/links/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/checkin/admin-guard';
import { getLinkWithGuests } from '@/lib/checkin/db';
import { buildEvisitorPayload, guestsToCsv } from '@/lib/checkin/evisitor';
import { markLinkPushed } from '@/app/actions/admin';
import CopyButton from './CopyButton';

export const dynamic = 'force-dynamic';

export default async function LinkDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();
  const data = await getLinkWithGuests(numId);
  if (!data) notFound();
  const { link, guests } = data;
  const checkinUrl = `https://www.ballenaandbeluga.com/en/checkin/${link.token}`;

  return (
    <main>
      <Link href="/admin" className="text-sm text-neutral-500 underline">← Back</Link>
      <h1 className="mt-2 text-2xl font-medium capitalize">
        {link.villa} · {link.arrival_date} → {link.departure_date}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Status: {link.status} · expected guests: {link.expected_guests}
      </p>

      <section className="mt-6 rounded border border-neutral-200 bg-white p-4">
        <h2 className="font-medium">Guest link</h2>
        <p className="mt-2 break-all font-mono text-sm">{checkinUrl}</p>
        <div className="mt-2 flex gap-2">
          <CopyButton label="Copy link" text={checkinUrl} />
          <a
            className="rounded border border-neutral-300 px-3 py-1.5 text-sm"
            href={`https://wa.me/?text=${encodeURIComponent(checkinUrl)}`}
            target="_blank" rel="noopener noreferrer"
          >Share via WhatsApp</a>
        </div>
      </section>

      {guests.length > 0 && (
        <>
          <section className="mt-6 rounded border border-neutral-200 bg-white p-4">
            <h2 className="font-medium">Guests ({guests.length})</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {guests.map((g, i) => (
                <div key={i} className="rounded border border-neutral-100 p-3 text-sm">
                  <p className="font-medium">{g.lastName}, {g.firstName} ({g.gender})</p>
                  <p>Born {g.birthDate}{g.birthPlace ? ` in ${g.birthPlace}` : ''} · {g.citizenship}</p>
                  <p>{g.documentType} · {g.documentNumber}</p>
                  <p>Residence: {g.residenceCity}, {g.residenceCountry}</p>
                  <p>Stay: {g.arrivalDate} → {g.departureDate}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded border border-neutral-200 bg-white p-4">
            <h2 className="font-medium">eVisitor payload</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Copy-paste while entering guests at
              {' '}<a className="underline" href="https://www.evisitor.hr" target="_blank" rel="noopener noreferrer">evisitor.hr</a>.
              Becomes a one-click push once HTZ grants API access.
            </p>
            <pre className="mt-3 overflow-x-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100">
              {JSON.stringify(buildEvisitorPayload(link, guests), null, 2)}
            </pre>
            <div className="mt-2 flex gap-2">
              <CopyButton label="Copy JSON" text={JSON.stringify(buildEvisitorPayload(link, guests), null, 2)} />
              <CopyButton label="Copy CSV" text={guestsToCsv(guests)} />
            </div>
          </section>

          {link.status === 'submitted' && (
            <form action={markLinkPushed} className="mt-6">
              <input type="hidden" name="id" value={link.id} />
              <button className="rounded bg-green-700 px-4 py-2 text-sm text-white">
                Mark as entered in eVisitor
              </button>
            </form>
          )}
        </>
      )}
      {guests.length === 0 && (
        <p className="mt-6 text-neutral-400">No guest data submitted yet.</p>
      )}
    </main>
  );
}
```

```tsx
// src/app/admin/links/[id]/CopyButton.tsx
'use client';

import { useState } from 'react';

export default function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="rounded border border-neutral-300 px-3 py-1.5 text-sm"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? 'Copied ✓' : label}
    </button>
  );
}
```

- [ ] **Step 10.5: Typecheck + build + commit**

Run: `npx tsc --noEmit` and `npm run build` → clean.

```bash
git add src/app/admin
git commit -m "feat(checkin): admin dashboard, link creation, eVisitor payload view"
```

---

### Task 11: Retention cron

**Files:**
- Create: `src/app/api/cron/purge-checkins/route.ts`
- Create: `vercel.json`

- [ ] **Step 11.1: Cron route**

```ts
// src/app/api/cron/purge-checkins/route.ts
import { NextResponse } from 'next/server';
import { purgeExpired } from '@/lib/checkin/db';

// Vercel cron sends Authorization: Bearer <CRON_SECRET>.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const purged = await purgeExpired();
  console.log(`[cron] purged ${purged} check-in link(s) past retention`);
  return NextResponse.json({ purged });
}
```

- [ ] **Step 11.2: vercel.json**

```json
{
  "crons": [
    { "path": "/api/cron/purge-checkins", "schedule": "0 3 * * *" }
  ]
}
```

- [ ] **Step 11.3: Typecheck + commit**

```bash
git add src/app/api/cron/purge-checkins/route.ts vercel.json
git commit -m "feat(checkin): daily retention purge cron (90 days after departure)"
```

---

### Task 12: Setup docs + final verification

**Files:**
- Create: `docs/checkin-setup.md`

- [ ] **Step 12.1: Write owner setup doc**

`docs/checkin-setup.md` must cover, concretely:
1. **Neon:** Vercel dashboard → Storage → Create Database → Neon (region: Frankfurt/EU) → connect to project → `DATABASE_URL` is auto-added to Vercel env; `vercel env pull` or copy it into `.env.local` locally.
2. **Schema:** run `DATABASE_URL="postgres://..." node scripts/db-setup.mjs` (PowerShell: `$env:DATABASE_URL="postgres://..."; node scripts/db-setup.mjs`).
3. **Env vars** to add in Vercel (Production) and `.env.local`: `ADMIN_PASSWORD` (choose a strong one), `ADMIN_COOKIE_SECRET` (`node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`), `ANTHROPIC_API_KEY` (console.anthropic.com), `CRON_SECRET` (same generator). `RESEND_API_KEY`/`OWNER_EMAIL` already exist.
4. **Daily flow:** create link at `/admin` → send to guest → email arrives on submit → open link detail → copy payload into evisitor.hr → "Mark as entered".
5. **Phase 2 note:** request eVisitor API access from HTZ; implementation slot is `src/lib/checkin/evisitor.ts`.

- [ ] **Step 12.2: Full verification pass**

1. `npm run test:checkin` → all pass.
2. `npm run build` → clean.
3. With `.env.local` populated and schema applied: `npm run dev`, then verify in browser/preview:
   - `/admin` redirects to `/admin/login`; wrong password rejected; right password → dashboard.
   - Create link → detail page shows URL; open URL in second tab → wizard renders EN; `/de/checkin/<token>` renders DE.
   - Manual entry for 1 guest → submit → done screen; re-open link → "already completed"; admin detail shows guest + JSON payload + CSV; "Mark as entered" flips status to pushed.
   - Scan path with a test image (any sample ID/passport specimen photo, e.g. the ICAO Utopia specimen found locally — do not use a real person's document in testing) → fields prefill.
   - Garbage token `/en/checkin/xxxxxxxxxxxxxxxxxxxxxx` → invalid-link screen.
   - `curl.exe -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/cron/purge-checkins` → `{"purged":0}`; without header → 401.
4. `npx next lint` (or `npm run lint`) → no new errors.

- [ ] **Step 12.3: Commit**

```bash
git add docs/checkin-setup.md
git commit -m "docs(checkin): owner setup guide for eVisitor check-in"
```

**Do not push** — pushes to `v7-light` auto-deploy to production. Push only after the user confirms env vars + Neon DB exist in Vercel.

---

## Self-review notes

- Spec coverage: token links (T1,8), MRZ verification (T2,8), validation/codelist (T3), payload+CSV adapter (T4), admin auth (T5,7,10), storage+transactional submit+scan rate limit (T6,8), noindex/robots/redirect fix (T7,9,10), wizard EN/DE + scan fallback + double-submit guard (T8,9), admin review + push stub (T10), retention cron (T11), env/docs/E2E (T12). Email without document numbers: T8. Image never stored: T8 (memory-only buffer).
- Type consistency: `GuestInput` defined once in `validate.ts`, used by db/evisitor/actions/wizard; `CheckinLink.status` union matches SQL CHECK; `ScanResult.fields: Partial<GuestInput>`.
- Known deviation from spec: scan model `claude-opus-4-8` instead of `claude-haiku-4-5` (accuracy > sub-cent cost; single constant).
