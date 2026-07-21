// src/lib/checkin/mrz.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mrzCheckDigit, verifyMrz, mrzDateToIso } from './mrz';

test('mrzCheckDigit matches ICAO 9303 example', () => {
  // Known examples from ICAO doc 9303: "L898902C3" -> 6 ; "740812" -> 2 ; "120415" -> 9
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
