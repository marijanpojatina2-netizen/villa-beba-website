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
