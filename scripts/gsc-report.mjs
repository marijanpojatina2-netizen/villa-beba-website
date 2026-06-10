#!/usr/bin/env node
// Weekly Google Search Console digest. Pulls Search Analytics for the
// domain property, computes a week-over-week report, and prints Markdown
// to stdout. The weekly-gsc-report.yml workflow wraps that Markdown into a
// GitHub Issue. Auth: an OAuth refresh token for a Google account that owns
// the Search Console property — set GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET
// and GSC_OAUTH_REFRESH_TOKEN. Run scripts/gsc-oauth-setup.mjs once to mint the
// refresh token (see docs/seo/gsc-report-setup.md).
//
// Usage:
//   GSC_OAUTH_CLIENT_ID=... GSC_OAUTH_CLIENT_SECRET=... GSC_OAUTH_REFRESH_TOKEN=... \
//     node scripts/gsc-report.mjs
//
// The pure report logic (buildReport + helpers) is exported and unit-tested
// in gsc-report.test.mjs via `node --test`. Network code runs only from
// main(), guarded so importing the module stays side-effect free.

import { pathToFileURL } from 'node:url';
import { OAuth2Client } from 'google-auth-library';

const SITE_URL = 'sc-domain:ballenaandbeluga.com';
const API_BASE = 'https://www.googleapis.com/webmasters/v3/sites';
const INSPECT_API = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const PROD_BASE = 'https://www.ballenaandbeluga.com';
const ROW_LIMIT = 5000;
// URL Inspection API quota is 2,000 calls/day per property; the sitemap has
// ~64 URLs, so a weekly full sweep uses ~3% of one day's quota.
const INSPECT_CONCURRENCY = 4;

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

const rowKey = (r) => `${r.query} ${r.page}`;

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
  const ctrDelta = t.ctr - p.ctr;
  const ctrDeltaStr = (ctrDelta > 0 ? '+' : '') + pct(ctrDelta);
  // Avg position: lower is better, so a negative Δ is an improvement.
  const posDelta = t.position - p.position;
  const posDeltaStr = (posDelta > 0 ? '+' : '') + posDelta.toFixed(1);
  lines.push(`| Clicks | ${num(t.clicks)} | ${num(p.clicks)} | ${arrow(t.clicks - p.clicks)} |`);
  lines.push(`| Impressions | ${num(t.impressions)} | ${num(p.impressions)} | ${arrow(t.impressions - p.impressions)} |`);
  lines.push(`| CTR | ${pct(t.ctr)} | ${pct(p.ctr)} | ${ctrDeltaStr} |`);
  lines.push(`| Avg position | ${t.position.toFixed(1)} | ${p.position.toFixed(1)} | ${posDeltaStr} |`);
  return lines.join('\n');
}

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

// --- index coverage (URL Inspection API) -----------------------------------

export function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

export function indexCoverageSection(coverage) {
  const lines = ['## 📇 Index coverage', ''];
  if (!coverage || coverage.error || !coverage.inspections?.length) {
    lines.push(
      `_Index inspection unavailable this week${coverage?.error ? ` — ${coverage.error}` : ''}._`,
    );
    return lines.join('\n');
  }
  const { inspections } = coverage;
  const indexed = inspections.filter(
    (i) => i.coverageState === 'Submitted and indexed',
  ).length;
  lines.push(
    `**${indexed}/${inspections.length}** sitemap URLs indexed. ` +
      'The single most important trend line on this report — it moves when referring domains are added, not when content is.',
    '',
  );
  const byState = new Map();
  for (const i of inspections) {
    byState.set(i.coverageState, (byState.get(i.coverageState) ?? 0) + 1);
  }
  lines.push('| Coverage state | URLs |', '|---|---|');
  for (const [state, count] of [...byState.entries()].sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${state} | ${count} |`);
  }
  const stuck = inspections.filter((i) => i.coverageState !== 'Submitted and indexed');
  if (stuck.length) {
    lines.push('', '<details><summary>Non-indexed URLs</summary>', '');
    for (const i of stuck) {
      lines.push(`- \`${pagePath(i.url)}\` — ${i.coverageState}`);
    }
    lines.push('', '</details>');
  }
  return lines.join('\n');
}

export function buildReport({ thisRows, priorRows, windows, coverage }) {
  const sections = [
    `# SEO weekly — ${windows.thisWeek.startDate} to ${windows.thisWeek.endDate}`,
    `_Compared with ${windows.priorWeek.startDate} to ${windows.priorWeek.endDate}. ` +
      `Source: Google Search Console (${SITE_URL}). Data lags ~3 days._`,
    headlineSection(thisRows, priorRows),
    // Coverage is optional so the report still builds if inspection fails
    // (quota, scope, network) — the section then explains why it's missing.
    ...(coverage !== undefined ? [indexCoverageSection(coverage)] : []),
    pageTwoSection(thisRows),
  ];
  if (priorRows.length === 0) {
    sections.push(
      '## 📈 Gaining / 📉 Slipping / 🆕 New queries\n\n' +
        "_Needs two weeks of history — these start in next week's report._",
    );
  } else {
    const joined = joinByKey(thisRows, priorRows);
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

// --- google search console api -------------------------------------------

async function getAccessToken() {
  const clientId = process.env.GSC_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GSC_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GSC_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'OAuth env vars missing — set GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET and GSC_OAUTH_REFRESH_TOKEN',
    );
  }
  const client = new OAuth2Client(clientId, clientSecret);
  client.setCredentials({ refresh_token: refreshToken });
  const { token } = await client.getAccessToken();
  if (!token) throw new Error('failed to mint a Google access token');
  return token;
}

async function inspectUrl(token, url) {
  const res = await fetch(INSPECT_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
  });
  if (!res.ok) {
    throw new Error(`inspection API ${res.status}`);
  }
  const json = await res.json();
  const r = json.inspectionResult?.indexStatusResult ?? {};
  return {
    url,
    verdict: r.verdict ?? 'UNKNOWN',
    coverageState: r.coverageState ?? 'Unknown',
  };
}

// Small worker pool — the shared index is safe because workers only advance
// it synchronously between awaits (single-threaded event loop).
async function inspectAll(token, urls) {
  const results = [];
  let next = 0;
  const worker = async () => {
    while (next < urls.length) {
      const url = urls[next++];
      try {
        results.push(await inspectUrl(token, url));
      } catch (err) {
        results.push({ url, verdict: 'ERROR', coverageState: `Inspection failed (${err.message})` });
      }
    }
  };
  await Promise.all(Array.from({ length: INSPECT_CONCURRENCY }, worker));
  return results;
}

async function fetchIndexCoverage(token) {
  const res = await fetch(`${PROD_BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch ${res.status}`);
  const locs = parseSitemapLocs(await res.text());
  if (locs.length === 0) throw new Error('sitemap contained no <loc> entries');
  return { inspections: await inspectAll(token, locs) };
}

async function querySearchAnalytics(token, period) {
  const url = `${API_BASE}/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate: period.startDate,
      endDate: period.endDate,
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
  let coverage;
  try {
    coverage = await fetchIndexCoverage(token);
  } catch (err) {
    coverage = { error: err.message };
  }
  process.stdout.write(buildReport({ thisRows, priorRows, windows, coverage }) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error('gsc-report failed:', err.message);
    process.exit(1);
  });
}
