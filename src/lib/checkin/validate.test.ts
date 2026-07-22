// src/lib/checkin/validate.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateGuest, COUNTRIES, type GuestInput } from './validate';

const ok: GuestInput = {
  firstName: 'Anna', lastName: 'Eriksson', gender: 'F', citizenship: 'DE',
  birthDate: '1974-08-12', birthCountry: 'DE', birthPlace: 'Berlin',
  documentType: 'passport', documentNumber: 'L898902C3',
  residenceCountry: 'DE', residenceCity: 'Berlin',
  arrivalDate: '2026-08-01', departureDate: '2026-08-08',
};

test('valid foreign guest has no errors', () => {
  assert.deepEqual(validateGuest(ok), []);
});

test('missing required fields are reported', () => {
  const errs = validateGuest({ ...ok, firstName: ' ', documentNumber: '' });
  assert.ok(errs.includes('firstName'));
  assert.ok(errs.includes('documentNumber'));
});

test('birthCountry is required', () => {
  assert.ok(validateGuest({ ...ok, birthCountry: '' }).includes('birthCountry'));
});

test('birthPlace and residenceCity required for everyone (eVisitor API)', () => {
  assert.ok(validateGuest({ ...ok, birthPlace: '' }).includes('birthPlace'));
  assert.ok(validateGuest({ ...ok, residenceCity: ' ' }).includes('residenceCity'));
  assert.deepEqual(validateGuest({ ...ok, birthCountry: 'HR', birthPlace: 'Pula' }), []);
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
