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
