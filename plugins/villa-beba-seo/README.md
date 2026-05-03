# villa-beba-seo

A comprehensive SEO toolkit for the **Villa Ballena & Beluga** website (Next 16 + next-intl + Tailwind v4, v7-light branch).

## What's inside

### 7 skills
- `villa-beba-seo:audit` — orchestrates a full SEO audit using all other skills
- `villa-beba-seo:lighthouse` — Lighthouse runner via `chrome-devtools-mcp`
- `villa-beba-seo:schema-validate` — JSON-LD validation against Schema.org + Google Rich Results
- `villa-beba-seo:meta-optimize` — meta titles/descriptions/OG/Twitter/canonical audit
- `villa-beba-seo:content-audit` — heading hierarchy, internal linking, alt texts, content depth
- `villa-beba-seo:hospitality` — luxury hospitality vertical (Hotel/Lodging schema, Google Travel, local SEO)
- `villa-beba-seo:core-web-vitals` — LCP, INP, CLS diagnosis with Next 16 specifics

### 1 agent
- `seo-auditor` — spawnable agent that runs all lenses end-to-end and produces a single prioritized report

### 3 hooks (Pre-Edit/Pre-Write)
- `check-image-alt` — warns when `<Image alt="...">` is too short or generic
- `check-meta-length` — warns when title >60 chars or description >160 chars
- `check-image-case` — **blocks** commits introducing uppercase image paths under `/images/` (Linux Vercel case-sensitivity has burned us twice)

## Install

This plugin lives in the project repo at `plugins/villa-beba-seo`. The repo's marketplace at `.claude-plugin/marketplace.json` makes it discoverable.

```bash
# In Claude Code, from this project directory:
/plugin marketplace add ./
/plugin install villa-beba-seo
/reload-plugins
```

Or for one-shot testing without installing:
```bash
claude --plugin-dir ./plugins/villa-beba-seo
```

## Quick start

```text
# Full audit:
/villa-beba-seo:audit

# Run Lighthouse against a URL:
/villa-beba-seo:lighthouse https://villa-beba-website-XXX.vercel.app/en

# Validate JSON-LD only:
/villa-beba-seo:schema-validate

# Spawn the comprehensive audit agent:
"Run a full SEO audit on the latest v7-light commit"
```

## When to use which skill

| You want to... | Skill / Agent |
|---|---|
| Get the full picture, with prioritized findings | `seo-auditor` agent |
| Understand a specific failed Lighthouse metric | `villa-beba-seo:core-web-vitals` |
| Verify rich result eligibility before launch | `villa-beba-seo:schema-validate` |
| Rewrite meta titles for a content sprint | `villa-beba-seo:meta-optimize` |
| Check if alt texts and headings are SEO-fit | `villa-beba-seo:content-audit` |
| Compare against Aman / Six Senses / Maistra patterns | `villa-beba-seo:hospitality` |
| Get measurable scores | `villa-beba-seo:lighthouse` |

## Project assumptions

This plugin is calibrated for THIS project. It expects:
- Next.js 16 App Router (server components for metadata, client components for content)
- next-intl 4 (locale-prefixed routes `[locale]/...`)
- Tailwind v4 (`@theme inline` in `globals.css`)
- `lib/contact.ts` as single contact source-of-truth
- `lib/schema.ts` as JSON-LD source-of-truth
- `<JsonLd>` helper component for raw HTML injection
- All `/public/images/` filenames lowercase ASCII
- v7-light branch as the deployed editorial cream/navy/gold design

If those assumptions change, update the relevant skill files.

## Maintenance

- After Google Search Central guidance updates, re-read the relevant skill and update.
- After a Next.js major version bump, update `core-web-vitals` and `lighthouse` for new patterns.
- The hooks are best-effort — they may produce false positives on dynamic alt texts or computed paths. Tune the regex if you see noise.
