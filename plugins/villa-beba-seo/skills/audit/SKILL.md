---
description: Run a comprehensive SEO audit of the villa-beba project. Orchestrates technical, on-page, structured-data, performance, and luxury-hospitality-vertical checks. Triggers on "seo audit", "audit seo", "check seo", "seo report", "seo health".
---

# Full SEO Audit

You are running a comprehensive SEO audit of the villa-beba Next.js 16 site (cream/navy editorial luxury-villa brand on the v7-light branch). Apply ALL the lenses below in one pass and produce a single prioritized report.

## When to invoke

- User asks for "SEO audit", "SEO check", "SEO report", "SEO health", "review my SEO".
- After a content release / before a marketing push.
- Quarterly or after Google algorithm updates.

## What to check (7 lenses)

### 1. Technical SEO
- `<html lang>` is set server-side (server component, not via client useEffect)
- `metadataBase` set in root or [locale] layout
- Per-page `generateMetadata` with title, description, openGraph, twitter, alternates.canonical, alternates.languages (hreflang)
- `app/sitemap.ts` lists all routes with stable `lastModified` (NOT `new Date()` per entry — bumps freshness signal)
- `app/robots.ts` allows `/`, disallows `/api/`, `/_next/`, references sitemap
- `app/manifest.ts` — name, short_name, theme_color, background_color, icons (real PNGs in `/public/icons/`, not just favicon.ico)
- middleware/proxy is configured (next-intl) — note Next 16 deprecation: `middleware` → `proxy`
- `next.config.ts` — `images.formats: ['image/webp']`, qualities allow-list

### 2. On-page SEO
- Each route renders exactly ONE `<h1>` (use `rg "<h1" src` to find duplicates)
- Heading hierarchy: h1 → h2 → h3 (no skipping levels)
- Internal linking density: each `villa-*` page links to companion villa, experiences, weddings, contact
- All `<Image>` components have descriptive `alt=` (NOT just "Ballena" / "Beluga")
- Image filenames are lowercase ASCII (case-sensitive Linux production — see `case_sensitivity_gotcha.md`)
- Image filenames describe content (`pula-arena.jpg` not `IMG_5216.jpg` for promotional use)

### 3. Structured data (JSON-LD via `lib/schema.ts` + `JsonLd` component)
Every page must have at least:
- `LodgingBusiness` (root, in [locale]/layout) — telephone, email from `CONTACT` constants, real `geo` coords
- `BreadcrumbList` (every page below home)
- `VacationRental` (villa-ballena, villa-beluga, complex-beba)
- `FAQPage` (faq route)
- `Article` (each blog post)
- NO unverified `starRating` (Google flags as spam)
- `aggregateRating` only when ≥5 verified reviews exist with platform attribution

Use the `villa-beba-seo:schema-validate` skill for full validation.

### 4. Performance / Core Web Vitals
Use the `villa-beba-seo:core-web-vitals` skill. Target:
- LCP < 2.5s (hero image is LCP — must have `priority` flag, ideal `<picture>` art-direction or appropriate `sizes`)
- INP < 200ms (Lenis + GSAP can hurt — verify reduced-motion guards in place)
- CLS < 0.1 (any layout shift from font swap, late-loading hero, or animated reveal)

### 5. Internationalization SEO
- `<link rel="alternate" hreflang="en">` + `hreflang="de"` + `hreflang="x-default"` on every locale page
- Translation completeness for each route's metadata (title, description, keywords)
- URL structure: `/en/...` and `/de/...` (current pattern OK)
- Locale-specific OG image option (per-page OG already covered)

### 6. Luxury hospitality vertical
Use the `villa-beba-seo:hospitality` skill. Highlights:
- Property has accurate `address`, `geo`, `priceRange`
- `numberOfBedrooms`, `numberOfBathroomsTotal`, `floorSize`, `occupancy` on each VacationRental
- `amenityFeature` lists at least 5 facilities
- `petsAllowed`, `yearBuilt` set
- Local SEO: NAP (Name/Address/Phone) consistent across schema + visible page text + Google Business Profile

### 7. Content quality
- Blog posts ≥800 words with H2/H3 structure
- Featured experience images ARE the actual images from `/public/images/experiences/` (not generic ballena/beluga shots)
- Each villa page has unique selling points content (not duplicated boilerplate)
- "Things to do" / experiences pages have specific distances, names, links

## Process

1. **Quick state scan**: `git status`, current branch, last 5 commits.
2. **Code-level checks**: grep/read for each lens above.
3. **Build & static SEO output verification**: `npm run build` then look at `.next/server/app/index.html` for rendered meta + JSON-LD.
4. **Live URL fetch (if URL provided)**: WebFetch the production URL, check rendered HTML, sitemap.xml, robots.txt.
5. **Lighthouse run (if explicitly requested)**: invoke `villa-beba-seo:lighthouse` for measurable scores.
6. **Compile findings**: group by severity (Catastrophe / Major / Minor / Cosmetic). Each finding gets: heuristic violated, location (file:line), recommendation, est. effort.

## Output format

```
## SEO Audit Results — <date>

### 🔴 Catastrophe (must fix before next deploy)
1. [Heuristic] Issue summary
   - Location: file:line
   - Why it matters: ...
   - Fix: ...

### 🟠 Major
...

### 🟡 Minor
...

### ✅ Already OK
- [Bullet list of areas that pass]

### 📊 Score (if Lighthouse run)
- Performance: X/100
- SEO: X/100
- Best Practices: X/100
- Accessibility: X/100
```

## Don't

- Don't suggest auditing pages I can't access. If the live URL isn't shared, scope to code-level checks.
- Don't fabricate Lighthouse scores — only report after actually running `villa-beba-seo:lighthouse`.
- Don't propose vague fixes. Every finding must point to file:line with a concrete edit.
