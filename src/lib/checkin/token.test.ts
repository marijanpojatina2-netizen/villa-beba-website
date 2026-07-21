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
