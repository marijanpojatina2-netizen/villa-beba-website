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
