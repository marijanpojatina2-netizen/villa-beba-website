# Weekly GSC Feedback Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an automated weekly Google Search Console digest that opens a GitHub Issue every Monday with page-2 ranking opportunities, query gains/slips, and CTR outliers.

**Architecture:** A pure-logic Node script (`scripts/gsc-report.mjs`) authenticates to the Search Console API with a service account, pulls two 7-day windows of Search Analytics data, and prints a Markdown report to stdout. A GitHub Actions workflow runs it on a Monday cron and wraps the Markdown in an Issue. All report math is in exported pure functions unit-tested with Node's built-in `node --test` runner; network code runs only from a guarded `main()`.

**Tech Stack:** Node.js 24 (ESM `.mjs`), `google-auth-library` (JWT signing only), native `fetch`, `node:test`, GitHub Actions, `actions/github-script@v9`.

**Spec:** `docs/superpowers/specs/2026-05-15-gsc-feedback-loop-design.md`

---

## File structure

| File | Responsibility |
|---|---|
| `scripts/gsc-report.mjs` | New. Auth, API fetch, pure report builders, guarded `main()`. Exports every pure function. |
| `scripts/gsc-report.test.mjs` | New. `node --test` unit tests for the pure functions. |
| `.github/workflows/weekly-gsc-report.yml` | New. Monday cron + `workflow_dispatch`; runs the script, opens the Issue. |
| `package.json` | Modify. Add `google-auth-library` dep + `gsc-report` / `test:gsc` scripts. |
| `docs/seo/gsc-report-setup.md` | New. One-time Google Cloud service-account + GitHub secret setup. |

Conventions to follow (from existing repo code):
- Scripts are `.mjs` with a top-of-file comment block explaining purpose + usage (see `scripts/indexnow.mjs`).
- Workflows pin `actions/checkout@v6`, `actions/setup-node@v6` with `node-version: '24'`, and create Issues via `actions/github-script@v9` (see `.github/workflows/weekly-content-reminder.yml`).
- `main().catch()` with `process.exit(1)` on failure.

---

## Task 1: Project scaffold + date windows

**Files:**
- Modify: `package.json`
- Create: `scripts/gsc-report.mjs`
- Create: `scripts/gsc-report.test.mjs`

- [ ] **Step 1: Install the auth dependency**

Run: `npm install google-auth-library`
Expected: `package.json` gains `google-auth-library` under `dependencies`; `package-lock.json` updates.

- [ ] **Step 2: Write the failing test**

Create `scripts/gsc-report.test.mjs`:

```js
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: FAIL — cannot find module `./gsc-report.mjs`.

- [ ] **Step 4: Create the script with header, constants, and `reportWindows`**

Create `scripts/gsc-report.mjs`:

```js
#!/usr/bin/env node
// Weekly Google Search Console digest. Pulls Search Analytics for the
// domain property, computes a week-over-week report, and prints Markdown
// to stdout. The weekly-gsc-report.yml workflow wraps that Markdown into a
// GitHub Issue. Auth: a service-account JSON in the GSC_SERVICE_ACCOUNT_JSON
// env var (see docs/seo/gsc-report-setup.md).
//
// Usage:
//   GSC_SERVICE_ACCOUNT_JSON="$(cat key.json)" node scripts/gsc-report.mjs
//
// The pure report logic (buildReport + helpers) is exported and unit-tested
// in gsc-report.test.mjs via `node --test`. Network code runs only from
// main(), guarded so importing the module stays side-effect free.

import { pathToFileURL } from 'node:url';
import { JWT } from 'google-auth-library';

const SITE_URL = 'sc-domain:ballenaandbeluga.com';
const API_BASE = 'https://www.googleapis.com/webmasters/v3/sites';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const ROW_LIMIT = 5000;

// --- date windows ---------------------------------------------------------

export function reportWindows(today = new Date()) {
  const dayUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  const minus = (offset) => {
    const t = new Date(dayUTC);
    t.setUTCDate(t.getUTCDate() - offset);
    return t.toISOString().slice(0, 10);
  };
  // GSC data lags ~2-3 days; end each window 3 days back. Each window
  // spans 7 inclusive days.
  return {
    thisWeek: { startDate: minus(9), endDate: minus(3) },
    priorWeek: { startDate: minus(16), endDate: minus(10) },
  };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: PASS — 3 tests.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json scripts/gsc-report.mjs scripts/gsc-report.test.mjs
git commit -m "feat(gsc): scaffold weekly GSC report script + date windows"
```

---

## Task 2: Row normalization and aggregation helpers

**Files:**
- Modify: `scripts/gsc-report.mjs`
- Modify: `scripts/gsc-report.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append to `scripts/gsc-report.test.mjs`:

```js
import {
  normalizeRows,
  sumMetrics,
  groupByPage,
  joinByKey,
} from './gsc-report.mjs';

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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: FAIL — `normalizeRows`/`sumMetrics`/`groupByPage`/`joinByKey` are not exported.

- [ ] **Step 3: Add the helpers**

Append to `scripts/gsc-report.mjs` (after `reportWindows`):

```js
// --- row helpers ----------------------------------------------------------

export function normalizeRows(apiRows) {
  if (!Array.isArray(apiRows)) return [];
  return apiRows.map((r) => ({
    query: r.keys[0],
    page: r.keys[1],
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  }));
}

export function sumMetrics(rows) {
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  const weightedPos = rows.reduce((s, r) => s + r.position * r.impressions, 0);
  return {
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    position: impressions ? weightedPos / impressions : 0,
  };
}

export function groupByPage(rows) {
  const map = new Map();
  for (const r of rows) {
    const g = map.get(r.page) ?? { page: r.page, rows: [] };
    g.rows.push(r);
    map.set(r.page, g);
  }
  return [...map.values()].map((g) => ({ page: g.page, ...sumMetrics(g.rows) }));
}

const rowKey = (r) => `${r.query} ${r.page}`;

export function joinByKey(thisRows, priorRows) {
  const prior = new Map(priorRows.map((r) => [rowKey(r), r]));
  return thisRows.map((r) => {
    const p = prior.get(rowKey(r));
    return {
      query: r.query,
      page: r.page,
      clicks: r.clicks,
      impressions: r.impressions,
      position: r.position,
      priorClicks: p ? p.clicks : 0,
      priorImpressions: p ? p.impressions : 0,
      clickDelta: r.clicks - (p ? p.clicks : 0),
      impressionDelta: r.impressions - (p ? p.impressions : 0),
      isNew: !p,
    };
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: PASS — 9 tests total.

- [ ] **Step 5: Commit**

```bash
git add scripts/gsc-report.mjs scripts/gsc-report.test.mjs
git commit -m "feat(gsc): row normalization and aggregation helpers"
```

---

## Task 3: Markdown formatting helpers + headline section

**Files:**
- Modify: `scripts/gsc-report.mjs`
- Modify: `scripts/gsc-report.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append to `scripts/gsc-report.test.mjs`:

```js
import { headlineSection } from './gsc-report.mjs';

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
});

test('headlineSection: omits deltas and notes missing prior data on first run', () => {
  const md = headlineSection([ROW({ clicks: 10, impressions: 1000, position: 8 })], []);
  assert.match(md, /No prior-week data/);
  assert.doesNotMatch(md, /▲|▼/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: FAIL — `headlineSection` is not exported.

- [ ] **Step 3: Add the formatting helpers and headline section**

Append to `scripts/gsc-report.mjs`:

```js
// --- markdown helpers -----------------------------------------------------

function arrow(delta) {
  if (delta > 0) return `▲ +${Math.round(delta)}`;
  if (delta < 0) return `▼ ${Math.round(delta)}`;
  return '—';
}

function pct(n) {
  return `${(n * 100).toFixed(1)}%`;
}

function num(n) {
  return Math.round(n).toLocaleString('en-US');
}

function pagePath(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

// --- report sections ------------------------------------------------------

export function headlineSection(thisRows, priorRows) {
  const t = sumMetrics(thisRows);
  const lines = ['## Headline', ''];
  if (priorRows.length === 0) {
    lines.push('| Metric | This week |', '|---|---|');
    lines.push(`| Clicks | ${num(t.clicks)} |`);
    lines.push(`| Impressions | ${num(t.impressions)} |`);
    lines.push(`| CTR | ${pct(t.ctr)} |`);
    lines.push(`| Avg position | ${t.position.toFixed(1)} |`);
    lines.push('', '_No prior-week data — deltas start next week._');
    return lines.join('\n');
  }
  const p = sumMetrics(priorRows);
  lines.push('| Metric | This week | Prior week | Δ |', '|---|---|---|---|');
  lines.push(`| Clicks | ${num(t.clicks)} | ${num(p.clicks)} | ${arrow(t.clicks - p.clicks)} |`);
  lines.push(`| Impressions | ${num(t.impressions)} | ${num(p.impressions)} | ${arrow(t.impressions - p.impressions)} |`);
  lines.push(`| CTR | ${pct(t.ctr)} | ${pct(p.ctr)} | ${pct(t.ctr - p.ctr)} |`);
  // Avg position: lower is better, so a negative Δ is an improvement.
  lines.push(`| Avg position | ${t.position.toFixed(1)} | ${p.position.toFixed(1)} | ${(t.position - p.position).toFixed(1)} |`);
  return lines.join('\n');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: PASS — 11 tests total.

- [ ] **Step 5: Commit**

```bash
git add scripts/gsc-report.mjs scripts/gsc-report.test.mjs
git commit -m "feat(gsc): markdown helpers + headline section"
```

---

## Task 4: Page-2 opportunities + top pages sections

**Files:**
- Modify: `scripts/gsc-report.mjs`
- Modify: `scripts/gsc-report.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append to `scripts/gsc-report.test.mjs`:

```js
import { pageTwoSection, topPagesSection } from './gsc-report.mjs';

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
  assert.match(md, /No queries in positions 11.20 this week/);
});

test('topPagesSection: ranks pages by clicks', () => {
  const md = topPagesSection([
    ROW({ page: 'https://x.com/low', clicks: 1, impressions: 10 }),
    ROW({ page: 'https://x.com/high', clicks: 50, impressions: 100 }),
  ]);
  assert.match(md, /## Top pages/);
  assert.ok(md.indexOf('/high') < md.indexOf('/low'));
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: FAIL — `pageTwoSection`/`topPagesSection` not exported.

- [ ] **Step 3: Add the two sections**

Append to `scripts/gsc-report.mjs`:

```js
export function pageTwoSection(thisRows) {
  const rows = thisRows
    .filter((r) => r.position >= 11 && r.position <= 20)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);
  const lines = ['## 🎯 Page-2 opportunities', ''];
  if (rows.length === 0) {
    lines.push('_No queries in positions 11–20 this week._');
    return lines.join('\n');
  }
  lines.push('Queries Google ranks just off page 1 — expand the page targeting these.', '');
  lines.push('| Query | Pos | Impressions | Clicks | Page |', '|---|---|---|---|---|');
  for (const r of rows) {
    lines.push(`| ${r.query} | ${r.position.toFixed(1)} | ${num(r.impressions)} | ${num(r.clicks)} | ${pagePath(r.page)} |`);
  }
  lines.push('', '**Action:** pick the highest-impression row and expand that guide.');
  return lines.join('\n');
}

export function topPagesSection(thisRows) {
  const pages = groupByPage(thisRows)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);
  const lines = ['## Top pages', ''];
  if (pages.length === 0) {
    lines.push('_No page data this week._');
    return lines.join('\n');
  }
  lines.push('| Page | Clicks | Impressions | CTR |', '|---|---|---|---|');
  for (const p of pages) {
    lines.push(`| ${pagePath(p.page)} | ${num(p.clicks)} | ${num(p.impressions)} | ${pct(p.ctr)} |`);
  }
  return lines.join('\n');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: PASS — 14 tests total.

- [ ] **Step 5: Commit**

```bash
git add scripts/gsc-report.mjs scripts/gsc-report.test.mjs
git commit -m "feat(gsc): page-2 opportunities and top pages sections"
```

---

## Task 5: Gaining / slipping / new query sections

**Files:**
- Modify: `scripts/gsc-report.mjs`
- Modify: `scripts/gsc-report.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append to `scripts/gsc-report.test.mjs`:

```js
import { gainingSection, slippingSection, newQueriesSection } from './gsc-report.mjs';

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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: FAIL — the three section functions are not exported.

- [ ] **Step 3: Add the three sections**

Append to `scripts/gsc-report.mjs`:

```js
export function gainingSection(joined) {
  const rows = joined
    .filter((r) => r.clickDelta > 0 || r.impressionDelta > 0)
    .sort((a, b) => b.clickDelta - a.clickDelta || b.impressionDelta - a.impressionDelta)
    .slice(0, 10);
  const lines = ['## 📈 Gaining queries', ''];
  if (rows.length === 0) {
    lines.push('_No queries gained week-over-week._');
    return lines.join('\n');
  }
  lines.push('| Query | Clicks (Δ) | Impressions (Δ) |', '|---|---|---|');
  for (const r of rows) {
    lines.push(`| ${r.query} | ${num(r.clicks)} (${arrow(r.clickDelta)}) | ${num(r.impressions)} (${arrow(r.impressionDelta)}) |`);
  }
  return lines.join('\n');
}

export function slippingSection(joined) {
  const rows = joined
    .filter((r) => r.clickDelta < 0 || r.impressionDelta < 0)
    .sort((a, b) => a.clickDelta - b.clickDelta || a.impressionDelta - b.impressionDelta)
    .slice(0, 10);
  const lines = ['## 📉 Slipping queries', ''];
  if (rows.length === 0) {
    lines.push('_No queries slipped week-over-week._');
    return lines.join('\n');
  }
  lines.push('| Query | Clicks (Δ) | Impressions (Δ) |', '|---|---|---|');
  for (const r of rows) {
    lines.push(`| ${r.query} | ${num(r.clicks)} (${arrow(r.clickDelta)}) | ${num(r.impressions)} (${arrow(r.impressionDelta)}) |`);
  }
  return lines.join('\n');
}

export function newQueriesSection(joined) {
  const rows = joined
    .filter((r) => r.isNew)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);
  const lines = ['## 🆕 New queries', ''];
  if (rows.length === 0) {
    lines.push('_No new queries this week._');
    return lines.join('\n');
  }
  lines.push('Search terms with impressions this week and none the week before.', '');
  lines.push('| Query | Impressions | Clicks | Page |', '|---|---|---|---|');
  for (const r of rows) {
    lines.push(`| ${r.query} | ${num(r.impressions)} | ${num(r.clicks)} | ${pagePath(r.page)} |`);
  }
  return lines.join('\n');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: PASS — 18 tests total.

- [ ] **Step 5: Commit**

```bash
git add scripts/gsc-report.mjs scripts/gsc-report.test.mjs
git commit -m "feat(gsc): gaining, slipping, and new query sections"
```

---

## Task 6: CTR outliers section

**Files:**
- Modify: `scripts/gsc-report.mjs`
- Modify: `scripts/gsc-report.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append to `scripts/gsc-report.test.mjs`:

```js
import { ctrOutliersSection } from './gsc-report.mjs';

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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: FAIL — `ctrOutliersSection` is not exported.

- [ ] **Step 3: Add the section**

Append to `scripts/gsc-report.mjs`:

```js
export function ctrOutliersSection(thisRows) {
  const site = sumMetrics(thisRows);
  const pages = groupByPage(thisRows)
    .filter((p) => p.impressions >= 50 && p.ctr < site.ctr * 0.5)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);
  const lines = ['## 🔧 CTR outliers', ''];
  if (pages.length === 0) {
    lines.push('_No pages materially underperforming on CTR._');
    return lines.join('\n');
  }
  lines.push(
    `Pages with ≥50 impressions and CTR below half the site average (${pct(site.ctr)}).`,
    '',
  );
  lines.push('| Page | Impressions | CTR |', '|---|---|---|');
  for (const p of pages) {
    lines.push(`| ${pagePath(p.page)} | ${num(p.impressions)} | ${pct(p.ctr)} |`);
  }
  lines.push('', '**Action:** rewrite the title/description — run the `villa-beba-seo:meta-optimize` skill on these pages.');
  return lines.join('\n');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: PASS — 20 tests total.

- [ ] **Step 5: Commit**

```bash
git add scripts/gsc-report.mjs scripts/gsc-report.test.mjs
git commit -m "feat(gsc): CTR outliers section"
```

---

## Task 7: Assemble the full report

**Files:**
- Modify: `scripts/gsc-report.mjs`
- Modify: `scripts/gsc-report.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append to `scripts/gsc-report.test.mjs`:

```js
import { buildReport } from './gsc-report.mjs';

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
});

test('buildReport: collapses delta sections on the first run (no prior data)', () => {
  const thisRows = [ROW({ query: 'q', page: 'https://x.com/p', clicks: 1, impressions: 10, position: 5 })];
  const md = buildReport({ thisRows, priorRows: [], windows: WINDOWS });
  assert.match(md, /Needs two weeks of history/);
  assert.doesNotMatch(md, /## 📈 Gaining queries\n/);
});

test('buildReport: produces a non-empty report even with zero rows', () => {
  const md = buildReport({ thisRows: [], priorRows: [], windows: WINDOWS });
  assert.match(md, /# SEO weekly/);
  assert.match(md, /No queries in positions 11/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: FAIL — `buildReport` is not exported.

- [ ] **Step 3: Add `buildReport`**

Append to `scripts/gsc-report.mjs`:

```js
export function buildReport({ thisRows, priorRows, windows }) {
  const joined = joinByKey(thisRows, priorRows);
  const sections = [
    `# SEO weekly — ${windows.thisWeek.startDate} to ${windows.thisWeek.endDate}`,
    `_Compared with ${windows.priorWeek.startDate} to ${windows.priorWeek.endDate}. ` +
      `Source: Google Search Console (${SITE_URL}). Data lags ~3 days._`,
    headlineSection(thisRows, priorRows),
    pageTwoSection(thisRows),
  ];
  if (priorRows.length === 0) {
    sections.push(
      '## 📈 Gaining / 📉 Slipping / 🆕 New queries\n\n' +
        "_Needs two weeks of history — these start in next week's report._",
    );
  } else {
    sections.push(
      gainingSection(joined),
      slippingSection(joined),
      newQueriesSection(joined),
    );
  }
  sections.push(
    ctrOutliersSection(thisRows),
    topPagesSection(thisRows),
    '---',
    '_Auto-generated by `scripts/gsc-report.mjs`. Close this issue once reviewed._',
  );
  return sections.join('\n\n');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: PASS — 23 tests total.

- [ ] **Step 5: Commit**

```bash
git add scripts/gsc-report.mjs scripts/gsc-report.test.mjs
git commit -m "feat(gsc): assemble full weekly report"
```

---

## Task 8: Auth, API client, and `main()`

**Files:**
- Modify: `scripts/gsc-report.mjs`

No unit tests — this is network/auth code. It is verified by the local smoke test in Step 3 and the CI dry run in Task 9.

- [ ] **Step 1: Add auth, the API client, and a guarded `main()`**

Append to `scripts/gsc-report.mjs`:

```js
// --- google search console api -------------------------------------------

async function getAccessToken() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GSC_SERVICE_ACCOUNT_JSON env var is not set');
  let key;
  try {
    key = JSON.parse(raw);
  } catch {
    throw new Error('GSC_SERVICE_ACCOUNT_JSON is not valid JSON');
  }
  const client = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: [SCOPE],
  });
  const { token } = await client.getAccessToken();
  if (!token) throw new Error('failed to mint a Google access token');
  return token;
}

async function querySearchAnalytics(token, window) {
  const url = `${API_BASE}/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate: window.startDate,
      endDate: window.endDate,
      dimensions: ['query', 'page'],
      rowLimit: ROW_LIMIT,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC API ${res.status} ${res.statusText}: ${text}`);
  }
  const json = await res.json();
  return normalizeRows(json.rows);
}

// --- entry point ----------------------------------------------------------

async function main() {
  const windows = reportWindows();
  const token = await getAccessToken();
  const thisRows = await querySearchAnalytics(token, windows.thisWeek);
  const priorRows = await querySearchAnalytics(token, windows.priorWeek);
  process.stdout.write(buildReport({ thisRows, priorRows, windows }) + '\n');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error('gsc-report failed:', err.message);
    process.exit(1);
  });
}
```

- [ ] **Step 2: Confirm importing the module is still side-effect free**

Run: `node --test scripts/gsc-report.test.mjs`
Expected: PASS — still 23 tests, no network call (the `import.meta.url` guard keeps `main()` from running under the test runner).

- [ ] **Step 3: Local smoke test against the live API**

This requires the Google Cloud service account from Task 10's setup doc to exist. If it does not yet, skip this step and rely on the Task 9 CI dry run instead.

PowerShell:
```powershell
$env:GSC_SERVICE_ACCOUNT_JSON = Get-Content -Raw .\gsc-service-account.json
node scripts/gsc-report.mjs
```
Expected: a Markdown report printed to the terminal, starting with `# SEO weekly — …`. If auth fails, the script exits non-zero with a descriptive error (`GSC_SERVICE_ACCOUNT_JSON …` or `GSC API 4xx …`).

- [ ] **Step 4: Commit**

```bash
git add scripts/gsc-report.mjs
git commit -m "feat(gsc): service-account auth, API client, and entry point"
```

---

## Task 9: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/weekly-gsc-report.yml`

- [ ] **Step 1: Create the workflow**

Create `.github/workflows/weekly-gsc-report.yml`:

```yaml
name: Weekly GSC report

# Fires every Monday at 07:00 UTC (09:00 local CET). Pulls Google Search
# Console data and opens an Issue with the weekly SEO digest. GitHub emails
# the assignee when an issue is opened.
#
# Requires the repo secret GSC_SERVICE_ACCOUNT_JSON — see
# docs/seo/gsc-report-setup.md. workflow_dispatch is enabled so you can
# test without waiting for Monday (Actions tab -> "Weekly GSC report" ->
# "Run workflow").

on:
  schedule:
    # Cron is in UTC. 07:00 UTC = 09:00 CET (winter) / 09:00 CEST (summer).
    - cron: '0 7 * * 1'
  workflow_dispatch:

permissions:
  issues: write

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: '24'

      - name: Install dependencies
        run: npm ci

      - name: Generate GSC report
        env:
          GSC_SERVICE_ACCOUNT_JSON: ${{ secrets.GSC_SERVICE_ACCOUNT_JSON }}
        run: |
          set -euo pipefail
          node scripts/gsc-report.mjs > gsc-report.md
          echo "Report generated ($(wc -l < gsc-report.md) lines)."

      - name: Open report issue
        uses: actions/github-script@v9
        with:
          script: |
            const fs = require('fs');
            const body = fs.readFileSync('gsc-report.md', 'utf8');
            const today = new Date().toISOString().slice(0, 10);
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `SEO weekly — week of ${today}`,
              body,
              assignees: ['marijanpojatina2-netizen'],
              labels: ['seo-report'],
            });
```

Note: if `node scripts/gsc-report.mjs` exits non-zero (auth/API failure), `set -e` fails the step and the "Open report issue" step is skipped — the run shows red in the Actions tab and GitHub notifies the committer. No partial Issue is created. The `seo-report` label is created automatically by the API on first use.

- [ ] **Step 2: Verify the workflow YAML is valid**

Run: `node -e "const yaml=require('node:fs').readFileSync('.github/workflows/weekly-gsc-report.yml','utf8'); if(!yaml.includes('cron')||!yaml.includes('github-script')) throw new Error('workflow missing key fields'); console.log('workflow file looks structurally complete')"`
Expected: `workflow file looks structurally complete`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/weekly-gsc-report.yml
git commit -m "feat(gsc): weekly Monday workflow that opens the report issue"
```

- [ ] **Step 4: CI dry run (after Task 10 setup is done and pushed)**

Once the `GSC_SERVICE_ACCOUNT_JSON` secret exists and this branch is pushed:
GitHub → Actions tab → "Weekly GSC report" → "Run workflow" → branch `v7-light`.
Expected: green run; a new Issue titled `SEO weekly — week of <date>` appears, assigned to `marijanpojatina2-netizen`, labelled `seo-report`. If the secret is missing or invalid, the "Generate GSC report" step fails red with a descriptive error — fix the secret and re-run.

---

## Task 10: Setup docs + package.json scripts

**Files:**
- Modify: `package.json`
- Create: `docs/seo/gsc-report-setup.md`

- [ ] **Step 1: Add npm scripts**

In `package.json`, add to the `scripts` block (alongside the existing `indexnow` entries):

```json
"gsc-report": "node scripts/gsc-report.mjs",
"test:gsc": "node --test scripts/gsc-report.test.mjs"
```

- [ ] **Step 2: Verify the scripts resolve**

Run: `npm run test:gsc`
Expected: PASS — 23 tests.

- [ ] **Step 3: Write the setup doc**

Create `docs/seo/gsc-report-setup.md`:

```markdown
# Weekly GSC report — one-time setup

The `Weekly GSC report` GitHub Action (`.github/workflows/weekly-gsc-report.yml`)
needs read access to Google Search Console data. This is a one-time setup.

## 1. Create a Google Cloud project + service account

1. Go to <https://console.cloud.google.com/> and create a new project
   (e.g. `villa-beba-seo`). It is free.
2. In **APIs & Services → Library**, search for **Google Search Console API**
   and click **Enable**.
3. In **APIs & Services → Credentials → Create credentials → Service account**,
   name it `gsc-report`, and create it (no roles needed).
4. Open the new service account → **Keys → Add key → Create new key → JSON**.
   A `.json` file downloads. Keep it private — it is a credential.

## 2. Grant the service account access to Search Console

1. Open the downloaded JSON and copy the `client_email` value
   (looks like `gsc-report@villa-beba-seo.iam.gserviceaccount.com`).
2. Go to <https://search.google.com/search-console> → select the
   `ballenaandbeluga.com` domain property.
3. **Settings → Users and permissions → Add user.** Paste the
   `client_email`, set permission to **Full** (or **Restricted** — read access
   is enough), and add.

## 3. Store the key as a GitHub secret

1. In the GitHub repo: **Settings → Secrets and variables → Actions →
   New repository secret.**
2. Name: `GSC_SERVICE_ACCOUNT_JSON`. Value: paste the **entire contents** of
   the downloaded JSON file. Save.

## 4. Verify

GitHub → **Actions** tab → **Weekly GSC report** → **Run workflow** on
`v7-light`. A green run opens an Issue titled `SEO weekly — week of <date>`.

After that, the report opens automatically every Monday at 07:00 UTC.

## Notes

- The service-account JSON never expires — no token rotation needed.
- The property is young; early reports will be sparse and that is expected.
  Week-over-week delta sections begin populating from the second report.
- To stop the report: disable the workflow in the Actions tab, or delete
  `.github/workflows/weekly-gsc-report.yml`.
```

- [ ] **Step 4: Commit**

```bash
git add package.json docs/seo/gsc-report-setup.md
git commit -m "feat(gsc): npm scripts + service-account setup doc"
```

---

## Done criteria

- `npm run test:gsc` passes (23 tests).
- `.github/workflows/weekly-gsc-report.yml` exists and is structurally valid.
- `docs/seo/gsc-report-setup.md` documents the Google Cloud + secret setup.
- After the owner completes the setup doc and pushes the branch, a manual
  `workflow_dispatch` run produces a green build and a `seo-report`-labelled
  Issue.
- The weekly cron then runs unattended every Monday.

## Notes for the implementer

- **Branch:** all work targets `v7-light` (the default/production branch).
  Pushes auto-promote to production, but nothing here renders on the public
  site — the script and workflow are build-time/CI only.
- **The owner must do Task 10's setup steps** (Google Cloud, GitHub secret)
  before the workflow can succeed. Tasks 1–9 are fully implementable and
  committable without it; only the live smoke test (Task 8 Step 3) and the CI
  dry run (Task 9 Step 4) depend on the secret.
- **Do not add a fallback** that posts an empty Issue when the API fails. A
  loud red workflow run is the intended behavior — a silently-empty report
  would hide a dead credential for weeks.
```
