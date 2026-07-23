// src/lib/checkin/evisitor-map.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pick, documentTypeCode, arrivalOrganisationCode, ttPaymentCategoryCode,
  genderValue, offeredServiceType, yyyymmdd, buildCheckInBody,
  type CheckInLookups,
} from './evisitor-map';
import type { GuestInput } from './validate';

const guest: GuestInput = {
  firstName: 'Anna', lastName: 'Eriksson', gender: 'F', citizenship: 'DE',
  birthDate: '1974-08-12', birthCountry: 'DE', birthPlace: 'Berlin',
  documentType: 'passport', documentNumber: 'L898902C3',
  residenceCountry: 'DE', residenceCity: 'Berlin',
  arrivalDate: '2026-08-01', departureDate: '2026-08-08',
};

const lookups: CheckInLookups = {
  documentTypes: [
    { Code: '002', Name: 'Osobna iskaznica' },
    { Code: '003', Name: 'Putovnica' },
    { Code: '099', Name: 'Ostalo' },
  ],
  arrivalOrganisations: [
    { CodeMI: 'I', Name: 'Osobno (individualno)' },
    { CodeMI: 'A', Name: 'Agencijski (grupno)' },
  ],
  ttCategories: [
    { Code: 'C1', Name: 'Sve ostale kategorije' },
    { Code: 'C2', Name: 'Djeca od 12 do 18 godina' },
    { Code: 'C3', Name: 'Djeca do 12 godina' },
  ],
  genders: [
    { Name: 'Muški' },
    { Name: 'Ženski' },
  ],
  serviceTypes: [{ Name: 'Noćenje' }],
};

test('pick is case-insensitive across shapes', () => {
  assert.equal(pick({ CodeMI: 'X' }, 'codemi'), 'X');
  assert.equal(pick({ naziv: 'Putovnica' }, 'Name', 'Naziv'), 'Putovnica');
  assert.equal(pick({ Name: '' }, 'Name'), undefined);
});

test('document type maps by keyword', () => {
  assert.equal(documentTypeCode(lookups.documentTypes, 'passport'), '003');
  assert.equal(documentTypeCode(lookups.documentTypes, 'id_card'), '002');
  assert.equal(documentTypeCode(lookups.documentTypes, 'other'), '099');
  assert.equal(documentTypeCode([], 'passport'), undefined);
});

test('arrival organisation maps to CodeMI', () => {
  assert.equal(arrivalOrganisationCode(lookups.arrivalOrganisations, 'osobno'), 'I');
  assert.equal(arrivalOrganisationCode(lookups.arrivalOrganisations, 'agencija'), 'A');
});

test('tt category picks age bucket', () => {
  assert.equal(ttPaymentCategoryCode(lookups.ttCategories, '1974-08-12', '2026-08-01'), 'C1');
  assert.equal(ttPaymentCategoryCode(lookups.ttCategories, '2010-01-01', '2026-08-01'), 'C2');
  assert.equal(ttPaymentCategoryCode(lookups.ttCategories, '2020-01-01', '2026-08-01'), 'C3');
});

test('gender and service type resolve with fallbacks', () => {
  assert.equal(genderValue(lookups.genders, 'F'), 'Ženski');
  assert.equal(genderValue([], 'M'), 'Muški');
  assert.equal(offeredServiceType(lookups.serviceTypes), 'Noćenje');
  assert.equal(offeredServiceType([]), 'Noćenje');
});

test('buildCheckInBody produces the API shape', () => {
  const r = buildCheckInBody('guid-1', guest, 'FAC-123', 'osobno', lookups);
  assert.equal(r.ok, true);
  const b = r.body!;
  assert.equal(b.ID, 'guid-1');
  assert.equal(b.Facility, 'FAC-123');
  assert.equal(b.Citizenship, 'DEU');
  assert.equal(b.CountryOfResidence, 'DEU');
  assert.equal(b.DateOfBirth, '19740812');
  assert.equal(b.StayFrom, '20260801');
  assert.equal(b.ForeseenStayUntil, '20260808');
  assert.equal(b.TimeStayFrom, '16:00');
  assert.equal(b.TimeEstimatedStayUntil, '10:00');
  assert.equal(b.DocumentType, '003');
  assert.equal(b.ArrivalOrganisation, 'I');
  assert.equal(b.TTPaymentCategory, 'C1');
  assert.equal(b.Gender, 'Ženski');
});

test('non-EU residence and agency arrivals are rejected with guidance', () => {
  const us = buildCheckInBody('g', { ...guest, residenceCountry: 'US' }, 'F', 'osobno', lookups);
  assert.equal(us.ok, false);
  assert.match(us.error!, /border crossing/i);
  const ag = buildCheckInBody('g', guest, 'F', 'agencija', lookups);
  assert.equal(ag.ok, false);
  assert.match(ag.error!, /agency/i);
});

test('yyyymmdd strips dashes', () => {
  assert.equal(yyyymmdd('2026-08-01'), '20260801');
});
