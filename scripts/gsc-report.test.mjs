import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reportWindows } from './gsc-report.mjs';

test('reportWindows: this week is a 7-day window ending 3 days before today', () => {
  const w = reportWindows(new Date('2026-05-15T12:00:00Z'));
  assert.equal(w.thisWeek.startDate, '2026-05-06');
  assert.equal(w.thisWeek.endDate, '2026-05-12');
});

test('reportWindows: prior week is the 7 days immediately before this week', () => {
  const w = reportWindows(new Date('2026-05-15T12:00:00Z'));
  assert.equal(w.priorWeek.startDate, '2026-04-29');
  assert.equal(w.priorWeek.endDate, '2026-05-05');
});

test('reportWindows: handles month boundary in UTC', () => {
  const w = reportWindows(new Date('2026-03-05T00:30:00Z'));
  assert.equal(w.thisWeek.endDate, '2026-03-02');
  assert.equal(w.thisWeek.startDate, '2026-02-24');
});
