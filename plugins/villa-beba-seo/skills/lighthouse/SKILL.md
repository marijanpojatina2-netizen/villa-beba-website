---
description: Run a Lighthouse audit against the live deployment using chrome-devtools-mcp. Returns Performance / SEO / Accessibility / Best Practices scores plus actionable recommendations. Triggers on "lighthouse", "lighthouse audit", "page speed", "performance score", "core web vitals".
---

# Lighthouse Audit

Run Google Lighthouse on the live deployment via the `chrome-devtools-mcp` plugin.

## Prerequisites

- `chrome-devtools-mcp` plugin must be installed (it is — comes with Claude Code defaults).
- A live URL to audit. Default targets:
  - Production: `https://www.villa-beba.com/en` (when domain is wired)
  - Preview: the latest Vercel preview URL for v7-light branch
  - Pass-through: any URL the user provides

## Process

1. **Confirm target URL** with user if not provided. Latest Vercel preview is best for newest changes.
2. **Run the lighthouse_audit MCP tool**:
   - Use `mcp__plugin_chrome-devtools-mcp_chrome-devtools__lighthouse_audit`
   - Categories to enable: `performance`, `seo`, `accessibility`, `best-practices`
   - Form factor: start with `desktop`, then run again for `mobile` (Google's primary indexing is mobile)
3. **Parse results**:
   - Capture each category's score (0-100)
   - Capture top 5 opportunities (potential savings in seconds/bytes)
   - Capture top 5 diagnostics (issues without measurable savings — e.g., "Image elements do not have explicit width and height")
4. **Cross-reference with project code**:
   - For each finding, point to the file:line that's responsible (e.g., LCP image is `[locale]/page.tsx`'s Hero `<Image>`)
   - Note Next 16 / next-intl idioms (e.g., `priority` flag, `sizes` attribute)

## Audit pages (in order of importance)

1. `/en` (homepage — flagship LCP, hero image, schema)
2. `/en/villa-ballena` (highest-conversion villa page)
3. `/en/villa-beluga`
4. `/en/contact` (form page — INP critical)
5. `/en/blog/things-to-do-near-svetvincenat-istria` (longest content)

## Output format

```
## Lighthouse — <URL> @ <date> [<form-factor>]

| Category | Score | Target |
| --- | --- | --- |
| Performance | XX | ≥ 90 |
| SEO | XX | 100 |
| Accessibility | XX | ≥ 95 |
| Best Practices | XX | ≥ 95 |

### Core Web Vitals
- LCP: X.Xs (target < 2.5s)
- INP: XXXms (target < 200ms)
- CLS: 0.XX (target < 0.1)

### Top opportunities
1. <opportunity> — saves X.Xs / X KB
   File: <file:line>
   Fix: <one-line>

### Top diagnostics
1. <diagnostic>
   File: <file:line>
   Fix: <one-line>

### Already passing
- <bullet list>
```

## Common Next.js Lighthouse fixes (cheat sheet)

| Lighthouse complaint | Project fix |
|---|---|
| "Image elements do not have explicit width and height" | `next/image` with `fill` needs sized parent OR use explicit `width`/`height` |
| "Largest Contentful Paint image was lazily loaded" | Add `priority` to LCP `<Image>` (Hero) |
| "Avoid serving legacy JavaScript to modern browsers" | Update `next.config.ts` browserslist target; check `target` in tsconfig |
| "Eliminate render-blocking resources" | Move large CSS to dynamic import, avoid blocking fonts (use `display: 'swap'` already done in layout) |
| "Reduce unused JavaScript" | Code-split via `dynamic()` for above-fold-only components; check Lenis + GSAP only loaded where used |
| "Properly size images" | Add `sizes` attribute to `<Image fill>` so Next emits correct srcset |
| "Defer offscreen images" | Already default in `next/image` — verify lazy loading isn't disabled |
| "Document does not have a meta description" | Check `generateMetadata` returns `description` |
| "Document does not have a valid `lang` attribute" | Server-side `<html lang={locale}>` (P0-3 fix landed) |
| "Headings are not in a sequentially-descending order" | Audit page H1→H2→H3 with grep |
| "Background and foreground colors do not have sufficient contrast" | See `globals.css` `--color-text-dim`/`--color-text-muted` (P1 fix landed bumped to ≥ AA) |

## Don't

- Don't run Lighthouse without confirming target URL.
- Don't claim a score without actually running the tool.
- Don't suggest fixes that contradict project conventions (e.g., "use plain `<img>`" — the project uses `next/image`).
