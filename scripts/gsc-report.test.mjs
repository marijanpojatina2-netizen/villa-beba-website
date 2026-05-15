import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reportWindows, normalizeRows, sumMetrics, groupByPage, joinByKey, headlineSection, pageTwoSection, topPagesSection, gainingSection, slippingSection, newQueriesSection, ctrOutliersSection, buildReport } from './gsc-report.mjs';

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

test('normalizeRows: maps GSC keys array into named fields', () => {
  const rows = normalizeRows([
    { keys: ['truffle istria', '/en/guides/truffles'], clicks: 4, impressions: 100, ctr: 0.04, position: 13.5 },
  ]);
  assert.deepEqual(rows[0], {
    query: 'truffle istria',
    page: '/en/guides/truffles',
    clicks: 4,
    impressions: 100,
    ctr: 0.04,
    position: 13.5,
  });
});

test('normalizeRows: returns [] when the API omits the rows field', () => {
  assert.deepEqual(normalizeRows(undefined), []);
});

test('sumMetrics: totals clicks/impressions and weights position by impressions', () => {
  const s = sumMetrics([
    { query: 'a', page: '/p', clicks: 2, impressions: 100, ctr: 0.02, position: 10 },
    { query: 'b', page: '/p', clicks: 3, impressions: 300, ctr: 0.01, position: 20 },
  ]);
  assert.equal(s.clicks, 5);
  assert.equal(s.impressions, 400);
  assert.equal(s.ctr, 5 / 400);
  assert.equal(s.position, (10 * 100 + 20 * 300) / 400);
});

test('sumMetrics: empty input yields zeroes, no divide-by-zero', () => {
  assert.deepEqual(sumMetrics([]), { clicks: 0, impressions: 0, ctr: 0, position: 0 });
});

test('groupByPage: aggregates rows that share a page', () => {
  const groups = groupByPage([
    { query: 'a', page: '/p1', clicks: 1, impressions: 50, ctr: 0.02, position: 5 },
    { query: 'b', page: '/p1', clicks: 2, impressions: 50, ctr: 0.04, position: 7 },
    { query: 'c', page: '/p2', clicks: 9, impressions: 10, ctr: 0.9, position: 1 },
  ]);
  const p1 = groups.find((g) => g.page === '/p1');
  assert.equal(p1.clicks, 3);
  assert.equal(p1.impressions, 100);
  assert.equal(p1.position, 6);
});

test('joinByKey: computes deltas and flags new query/page pairs', () => {
  const joined = joinByKey(
    [
      { query: 'a', page: '/p', clicks: 5, impressions: 100, ctr: 0.05, position: 8 },
      { query: 'new', page: '/p', clicks: 1, impressions: 20, ctr: 0.05, position: 12 },
    ],
    [{ query: 'a', page: '/p', clicks: 2, impressions: 60, ctr: 0.03, position: 9 }],
  );
  const a = joined.find((r) => r.query === 'a');
  assert.equal(a.clickDelta, 3);
  assert.equal(a.impressionDelta, 40);
  assert.equal(a.isNew, false);
  const fresh = joined.find((r) => r.query === 'new');
  assert.equal(fresh.isNew, true);
  assert.equal(fresh.clickDelta, 1);
});

const ROW = (over = {}) => ({
  query: 'q', page: '/p', clicks: 0, impressions: 0, ctr: 0, position: 0, ...over,
});

test('headlineSection: shows week-over-week deltas when prior data exists', () => {
  const md = headlineSection(
    [ROW({ clicks: 10, impressions: 1000, position: 8 })],
    [ROW({ clicks: 6, impressions: 800, position: 9 })],
  );
  assert.match(md, /## Headline/);
  assert.match(md, /Clicks/);
  assert.match(md, /▲ \+4/);
  assert.match(md, /This week \| Prior week \| Δ/);
  assert.match(md, /Impressions.*▲ \+200/);
  assert.match(md, /CTR \|.*\+/);
  assert.match(md, /Avg position \| 8\.0 \| 9\.0 \| -1\.0/);
});

test('headlineSection: omits deltas and notes missing prior data on first run', () => {
  const md = headlineSection([ROW({ clicks: 10, impressions: 1000, position: 8 })], []);
  assert.match(md, /No prior-week data/);
  assert.doesNotMatch(md, /▲|▼/);
});

test('pageTwoSection: lists only queries in positions 11-20, by impressions', () => {
  const md = pageTwoSection([
    ROW({ query: 'page1', position: 4, impressions: 999 }),
    ROW({ query: 'edge11', position: 11, impressions: 50 }),
    ROW({ query: 'big', position: 15, impressions: 800 }),
    ROW({ query: 'page3', position: 24, impressions: 999 }),
  ]);
  assert.match(md, /🎯 Page-2 opportunities/);
  assert.match(md, /big/);
  assert.match(md, /edge11/);
  assert.doesNotMatch(md, /page1|page3/);
  // higher-impression "big" must appear before "edge11"
  assert.ok(md.indexOf('big') < md.indexOf('edge11'));
});

test('pageTwoSection: prints an explicit empty-state line', () => {
  const md = pageTwoSection([ROW({ query: 'top', position: 3, impressions: 500 })]);
  assert.match(md, /No queries in positions 11–20 this week/);
});

test('topPagesSection: ranks pages by clicks', () => {
  const md = topPagesSection([
    ROW({ page: 'https://x.com/low', clicks: 1, impressions: 10 }),
    ROW({ page: 'https://x.com/high', clicks: 50, impressions: 100 }),
  ]);
  assert.match(md, /## Top pages/);
  assert.ok(md.indexOf('/high') < md.indexOf('/low'));
});

const JOINED = (over = {}) => ({
  query: 'q', page: '/p', clicks: 0, impressions: 0, position: 0,
  priorClicks: 0, priorImpressions: 0, clickDelta: 0, impressionDelta: 0,
  isNew: false, ...over,
});

test('gainingSection: shows positive movers, biggest first', () => {
  const md = gainingSection([
    JOINED({ query: 'small', clicks: 2, clickDelta: 1 }),
    JOINED({ query: 'huge', clicks: 20, clickDelta: 15 }),
    JOINED({ query: 'flat', clickDelta: 0, impressionDelta: 0 }),
  ]);
  assert.match(md, /📈 Gaining queries/);
  assert.ok(md.indexOf('huge') < md.indexOf('small'));
  assert.doesNotMatch(md, /flat/);
});

test('slippingSection: shows negative movers, biggest drop first', () => {
  const md = slippingSection([
    JOINED({ query: 'minordrop', clickDelta: -1 }),
    JOINED({ query: 'bigdrop', clickDelta: -12 }),
  ]);
  assert.match(md, /📉 Slipping queries/);
  assert.ok(md.indexOf('bigdrop') < md.indexOf('minordrop'));
});

test('newQueriesSection: lists only isNew rows by impressions', () => {
  const md = newQueriesSection([
    JOINED({ query: 'fresh', isNew: true, impressions: 30 }),
    JOINED({ query: 'old', isNew: false, impressions: 999 }),
  ]);
  assert.match(md, /🆕 New queries/);
  assert.match(md, /fresh/);
  assert.doesNotMatch(md, /\bold\b/);
});

test('gainingSection: empty-state line when nothing gained', () => {
  assert.match(gainingSection([]), /No queries gained/);
});

test('slippingSection: empty-state line when nothing slipped', () => {
  assert.match(slippingSection([]), /No queries slipped/);
});

test('newQueriesSection: empty-state line when no new queries', () => {
  assert.match(newQueriesSection([]), /No new queries/);
});

test('ctrOutliersSection: flags pages below half the site-average CTR', () => {
  // Site avg CTR is driven high by /good; /bad has many impressions, near-zero CTR.
  const md = ctrOutliersSection([
    ROW({ query: 'a', page: 'https://x.com/good', clicks: 50, impressions: 100, position: 2 }),
    ROW({ query: 'b', page: 'https://x.com/bad', clicks: 1, impressions: 500, position: 6 }),
  ]);
  assert.match(md, /🔧 CTR outliers/);
  assert.match(md, /\/bad/);
  assert.doesNotMatch(md, /\/good/);
  assert.match(md, /meta-optimize/);
});

test('ctrOutliersSection: ignores low-impression pages and shows empty state', () => {
  const md = ctrOutliersSection([
    ROW({ query: 'a', page: 'https://x.com/good', clicks: 9, impressions: 10, position: 1 }),
    ROW({ query: 'b', page: 'https://x.com/tiny', clicks: 0, impressions: 20, position: 8 }),
  ]);
  assert.match(md, /No pages materially underperforming/);
});

const WINDOWS = {
  thisWeek: { startDate: '2026-05-06', endDate: '2026-05-12' },
  priorWeek: { startDate: '2026-04-29', endDate: '2026-05-05' },
};

test('buildReport: includes every section when prior data exists', () => {
  const thisRows = [
    ROW({ query: 'truffle istria', page: 'https://x.com/g/truffle', clicks: 8, impressions: 400, ctr: 0.02, position: 14 }),
  ];
  const priorRows = [
    ROW({ query: 'truffle istria', page: 'https://x.com/g/truffle', clicks: 3, impressions: 200, ctr: 0.015, position: 16 }),
  ];
  const md = buildReport({ thisRows, priorRows, windows: WINDOWS });
  assert.match(md, /# SEO weekly — 2026-05-06 to 2026-05-12/);
  assert.match(md, /## Headline/);
  assert.match(md, /🎯 Page-2 opportunities/);
  assert.match(md, /📈 Gaining queries/);
  assert.match(md, /🔧 CTR outliers/);
  assert.match(md, /## Top pages/);
  assert.match(md, /_Compared with 2026-04-29 to 2026-05-05/);
  assert.match(md, /Auto-generated by/);
});

test('buildReport: collapses delta sections on the first run (no prior data)', () => {
  const thisRows = [ROW({ query: 'q', page: 'https://x.com/p', clicks: 1, impressions: 10, position: 5 })];
  const md = buildReport({ thisRows, priorRows: [], windows: WINDOWS });
  assert.match(md, /Needs two weeks of history/);
  assert.doesNotMatch(md, /## 📈 Gaining queries/);
});

test('buildReport: produces a non-empty report even with zero rows', () => {
  const md = buildReport({ thisRows: [], priorRows: [], windows: WINDOWS });
  assert.match(md, /# SEO weekly/);
  assert.match(md, /No queries in positions 11/);
});
