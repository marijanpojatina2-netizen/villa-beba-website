// src/lib/checkin/evisitor.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildEvisitorPayload, guestsToCsv, ttCategory } from './evisitor';
import type { GuestInput } from './validate';

const guest: GuestInput = {
  firstName: 'Anna', lastName: 'Eriksson', gender: 'F', citizenship: 'DE',
  birthDate: '1974-08-12', birthCountry: 'DE', birthPlace: 'Berlin',
  documentType: 'passport', documentNumber: 'L898902C3',
  residenceCountry: 'DE', residenceCity: 'Berlin',
  arrivalDate: '2026-08-01', departureDate: '2026-08-08',
};

test('payload maps 1:1 to eVisitor field names', () => {
  const p = buildEvisitorPayload({ villa: 'ballena', arrival_organization: 'osobno' }, [guest]);
  assert.equal(p.facility, 'Villa Ballena');
  assert.equal(p.arrivalOrganization, 'Osobno (individualno)');
  assert.equal(p.tourists.length, 1);
  const t = p.tourists[0];
  assert.equal(t.surname, 'Eriksson');
  assert.equal(t.name, 'Anna');
  assert.equal(t.gender, 'F');
  assert.equal(t.citizenshipCode, 'DEU');
  assert.equal(t.dateOfBirth, '1974-08-12');
  assert.equal(t.countryOfBirthCode, 'DEU');
  assert.equal(t.placeOfBirth, 'Berlin');
  assert.equal(t.residenceCity, 'Berlin');
  assert.equal(t.documentType, 'passport');
  assert.equal(t.stayFrom, '2026-08-01');
  assert.equal(t.arrivalTime, '16:00');
  assert.equal(t.foreseenStayUntil, '2026-08-08');
  assert.equal(t.departureTime, '10:00');
  assert.equal(t.ttCategory, 'Sve ostale kategorije (100%)');
});

test('agency arrival organization is labeled', () => {
  const p = buildEvisitorPayload({ villa: 'beluga', arrival_organization: 'agencija' }, [guest]);
  assert.equal(p.arrivalOrganization, 'Agencijski (grupno)');
});

test('country codes convert to alpha-3 (eVisitor API format)', () => {
  const hr = { ...guest, birthCountry: 'HR', citizenship: 'HR', residenceCountry: 'GB' };
  const t = buildEvisitorPayload({ villa: 'ballena' }, [hr]).tourists[0];
  assert.equal(t.citizenshipCode, 'HRV');
  assert.equal(t.countryOfBirthCode, 'HRV');
  assert.equal(t.residenceCountryCode, 'GBR');
});

test('ttCategory follows age at arrival', () => {
  assert.equal(ttCategory('2020-01-01', '2026-08-01'), 'Djeca do 12 godina (oslobođeno)');
  assert.equal(ttCategory('2014-08-02', '2026-08-01'), 'Djeca do 12 godina (oslobođeno)'); // 11, birthday day after arrival
  assert.equal(ttCategory('2014-08-01', '2026-08-01'), 'Djeca 12-18 godina (50%)'); // 12 exactly on arrival
  assert.equal(ttCategory('2008-08-02', '2026-08-01'), 'Djeca 12-18 godina (50%)'); // 17
  assert.equal(ttCategory('2008-08-01', '2026-08-01'), 'Sve ostale kategorije (100%)'); // 18 on arrival
});

test('csv has header + one row per guest, quotes commas', () => {
  const csv = guestsToCsv([guest, { ...guest, residenceCity: 'Zagreb, Trešnjevka' }]);
  const rows = csv.trim().split('\n');
  assert.equal(rows.length, 3);
  assert.ok(rows[0].startsWith('surname,name,gender'));
  assert.ok(rows[0].includes('countryOfBirth'));
  assert.ok(rows[0].includes('ttCategory'));
  assert.ok(rows[2].includes('"Zagreb, Trešnjevka"'));
});
