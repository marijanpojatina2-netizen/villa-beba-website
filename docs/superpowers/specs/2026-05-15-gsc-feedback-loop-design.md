# Weekly GSC Feedback Loop — Design

**Date:** 2026-05-15
**Status:** Approved (design phase)
**Branch:** v7-light

## Problem

The site already automates the *publish → index* half of SEO (IndexNow ping,
weekly content-sprint cron, schema, llms.txt). Nothing automates the *feedback*
half: there is no recurring read on what queries the site actually ranks for.
The 10-week content sprint therefore publishes blind — topics are picked from a
fixed queue rather than from evidence of what Google is rewarding.

This project closes that loop: a weekly automated digest from the Google Search
Console API that tells the owner which pages are close to ranking, which queries
are gaining or slipping, and which pages need a meta-tag rewrite.

## Goals

- Weekly, zero-effort visibility into Search Console performance.
- Each report ends with concrete next actions (expand guide X, rewrite meta on Y).
- Reuse existing repo conventions — no new infrastructure beyond a Google
  service account.

## Non-goals

- AI-written narrative recommendations (possible later enhancement; out of scope).
- Bing/IndexNow analytics, GBP insights, rank tracking (separate projects B–E).
- A hosted dashboard. The report is push-only (GitHub Issue + email).

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Delivery | GitHub Issue | Reuses `weekly-content-reminder.yml` pattern; GitHub auto-emails the assignee. |
| Auth | Google Cloud service account | Dedicated machine identity, credentials never expire, reusable for future GBP automation. |
| Cadence | Monday 07:00 UTC | Start the week with data before choosing content; spaced from the Friday content Issue. |
| Implementation | Node script + GitHub Action, deterministic | Mirrors `indexnow.mjs` + workflow; no LLM cost; the analysis is plain data math. |
| GSC property | Domain property `sc-domain:ballenaandbeluga.com` | Aggregates apex + www + http/https into one dataset. |

## Architecture

Two new files.

### `scripts/gsc-report.mjs`

Pure report generator — API in, Markdown out. Never touches GitHub.

Responsibilities:
1. Read service-account JSON from the `GSC_SERVICE_ACCOUNT_JSON` env var.
2. Mint a Google access token via a signed JWT, using `google-auth-library`
   (small dependency — crypto only, not the full `googleapis` package).
3. `POST` to the Search Analytics API
   (`https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`)
   for the domain property, twice:
   - **This week** — 7-day window ending 3 days ago (clears the GSC data lag).
   - **Prior week** — the 7 days immediately before that window.
   Query dimensions: `query` and `page`.
4. Compute the digest via a pure function (`buildReport(thisWeek, priorWeek)`).
5. Print Markdown to stdout.

Exit behaviour: any auth or API failure → `process.exit(1)` with the error on
stderr. Never prints a partial report.

### `.github/workflows/weekly-gsc-report.yml`

Scheduler — owns GitHub interaction.

- Triggers: `cron: '0 7 * * 1'` (Monday 07:00 UTC) + `workflow_dispatch`.
- Steps: checkout → setup Node 24 → `npm ci` → run script capturing stdout →
  `gh issue create` with that Markdown as the body.
- Issue: title `SEO weekly — week of <YYYY-MM-DD>`, label `seo-report`,
  assignee `marijanpojatina2-netizen`.

### Data flow

```
cron / dispatch
  → workflow
    → node scripts/gsc-report.mjs
      → GSC Search Analytics API  (this week)
      → GSC Search Analytics API  (prior week)
      → buildReport()  → Markdown (stdout)
    → gh issue create
  → GitHub Issue + email to assignee
```

## Report content

Markdown Issue body, ordered most-actionable first. Every table caps at ~10 rows.

1. **Headline** — table of clicks, impressions, avg CTR, avg position;
   this week vs prior week with ▲/▼ deltas.
2. **🎯 Page-2 opportunities** — queries at position 11–20, sorted by
   impressions, each with its ranking page URL. Prints a one-line suggested
   action ("expand the guide targeting these"). Primary driver of the content
   sprint.
3. **📈 Gaining queries** — biggest week-over-week click/impression gains.
4. **📉 Slipping queries** — biggest declines; regression early-warning.
5. **🆕 New queries** — terms with impressions this week and none prior.
6. **🔧 CTR outliers** — pages with high impressions but below-average CTR.
   Prints a one-line action pointing at the `villa-beba-seo:meta-optimize` skill.
7. **Top pages** — top 10 pages by clicks, for context.

## Edge cases & error handling

- **Sparse data** — each section that has no rows prints an explicit
  "No … this week." line instead of an empty table. The Issue is always created.
- **Missing prior week** (first run) — headline shows current numbers with
  "— no prior data" instead of deltas; gaining/slipping/new sections note they
  need two weeks of history. Self-heals from week 2.
- **Auth / API failure** — script exits non-zero with the error; the workflow
  step fails loudly and GitHub emails the failure. No silent fallback to an
  empty report — a dead credential must surface within one Monday.

## Testing

No test framework in the repo (consistent with existing `scripts/*.mjs`).
Verification is tiered:

1. **Local smoke test** — export `GSC_SERVICE_ACCOUNT_JSON`,
   run `node scripts/gsc-report.mjs`, eyeball the Markdown.
2. **Pure-function check** — `buildReport()` is fed a small fixture of fake GSC
   rows and asserted with a `node:assert` block; proves delta math, position
   bucketing, and sorting without the network.
3. **`workflow_dispatch` dry run** — manually trigger the Action once to confirm
   the secret resolves in CI and the Issue is created, before trusting the cron.

## One-time setup (owner)

To be expanded into step-by-step instructions in the implementation plan:

1. Create a Google Cloud project (free); enable the **Search Console API**.
2. Create a service account; download its JSON key.
3. In Search Console → Settings → Users and permissions, add the service
   account's email as a user (Full or Restricted).
4. Add the JSON key as the GitHub repo secret `GSC_SERVICE_ACCOUNT_JSON`.
5. `npm install google-auth-library` (committed to `package.json`).

## Files

| File | Action |
|---|---|
| `scripts/gsc-report.mjs` | new |
| `.github/workflows/weekly-gsc-report.yml` | new |
| `package.json` | add `google-auth-library` dep; optional `gsc-report` script |

## Future enhancements (out of scope)

- AI narrative layer over the raw tables (brainstorming Approach 2).
- Bing Webmaster Tools equivalent.
- Auto-create content-sprint Issues from page-2 opportunities.
