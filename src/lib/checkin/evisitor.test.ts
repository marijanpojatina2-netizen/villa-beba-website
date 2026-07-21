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
