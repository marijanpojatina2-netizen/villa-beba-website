// src/lib/checkin/evisitor.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildEvisitorPayload, guestsToCsv, ttCategory } from './evisitor';
import type { GuestInput } from './validate';

const guest: GuestInput = {
  firstName: 'Anna', lastName: 'Eriksson', gender: 'F', citizenship: 'DE',
  birthDate: '1974-08-12', birthCountry: 'DE', birthPlace: '',
  documentType: 'passport', documentNumber: 'L898902C3',
  residenceCountry: 'DE', residenceCity: '',
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
  assert.equal(t.citizenshipCode, 'DE');
  assert.equal(t.dateOfBirth, '1974-08-12');
  assert.equal(t.countryOfBirthCode, 'DE');
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

test('placeOfBirth/residenceCity only pass through for Croatia', () => {
  const hr = { ...guest, birthCountry: 'HR', birthPlace: 'Pula', residenceCountry: 'HR', residenceCity: 'Zagreb' };
  const t = buildEvisitorPayload({ villa: 'ballena' }, [hr]).tourists[0];
  assert.equal(t.placeOfBirth, 'Pula');
  assert.equal(t.residenceCity, 'Zagreb');
  const de = buildEvisitorPayload({ villa: 'ballena' }, [{ ...guest, birthPlace: 'Berlin', residenceCity: 'Berlin' }]).tourists[0];
  assert.equal(de.placeOfBirth, '');
  assert.equal(de.residenceCity, '');
});

test('ttCategory follows age at arrival', () => {
  assert.equal(ttCategory('2020-01-01', '2026-08-01'), 'Djeca do 12 godina (oslobođeno)');
  assert.equal(ttCategory('2014-08-02', '2026-08-01'), 'Djeca do 12 godina (oslobođeno)'); // 11, birthday day after arrival
  assert.equal(ttCategory('2014-08-01', '2026-08-01'), 'Djeca 12-18 godina (50%)'); // 12 exactly on arrival
  assert.equal(ttCategory('2008-08-02', '2026-08-01'), 'Djeca 12-18 godina (50%)'); // 17
  assert.equal(ttCategory('2008-08-01', '2026-08-01'), 'Sve ostale kategorije (100%)'); // 18 on arrival
});

test('csv has header + one row per guest, quotes commas', () => {
  const csv = guestsToCsv([guest, { ...guest, residenceCountry: 'HR', residenceCity: 'Zagreb, Trešnjevka' }]);
  const rows = csv.trim().split('\n');
  assert.equal(rows.length, 3);
  assert.ok(rows[0].startsWith('surname,name,gender'));
  assert.ok(rows[0].includes('countryOfBirth'));
  assert.ok(rows[0].includes('ttCategory'));
  assert.ok(rows[2].includes('"Zagreb, Trešnjevka"'));
});
