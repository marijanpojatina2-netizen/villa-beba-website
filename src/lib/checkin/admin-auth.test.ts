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
