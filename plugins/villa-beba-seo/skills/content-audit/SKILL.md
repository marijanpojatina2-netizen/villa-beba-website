---
description: Audit on-page content for heading hierarchy, internal linking density, alt-text quality, content depth, and keyword targeting. Triggers on "content audit", "on-page seo", "heading audit", "alt text audit", "internal links".
---

# On-page Content Audit

Audit each route's rendered content for SEO and user-experience signals.

## What to check

### 1. Heading hierarchy
- Exactly **one `<h1>`** per page.
- Order: `h1 → h2 → h3 → h4` (no skipping; e.g., don't go from h1 directly to h3).
- H1 should contain the page's primary keyword.
- H2s define section topics; H3s subdivide.

**Detect**: `grep -E "<h[1-6]" src/app/[locale]/<route>/<file>` and read sequentially.

### 2. Internal linking
- Each villa page links to: companion villa, complex-beba, experiences, contact, weddings.
- Home links to all villa pages, gallery, contact.
- Blog posts link to relevant villa pages within the body (contextual, not just navigation).
- No broken internal links — the project uses next-intl `Link` from `@/i18n/navigation`, so type-safe routes prevent typos.
- **Anchor text**: descriptive, not "click here" / "read more". Prefer "Discover Villa Ballena's wellness suite" over "Click here".

### 3. Alt text
Run `grep -rn 'alt=' src/app/[locale]` and `grep -rn 'alt:' src/lib/images.ts`.
- ❌ Reject: `alt="Ballena"`, `alt="Beluga"`, `alt="image"`, empty alt for content images.
- ✅ Accept: `alt="Villa Ballena pool at dusk"`, `alt="Olive tree courtyard at Villa Ballena"`.
- **Decorative images**: `alt=""` only when image carries no meaning (decorative pattern). Hero images are NOT decorative — they need alt.

### 4. Content depth (per page word count)
- Home: ≥ 600 visible words (excluding nav/footer).
- Villa pages: ≥ 800 words (long-form sales).
- Blog posts: ≥ 1,000 words.
- FAQ: ≥ 50 words per question (substantive answers).

Use Bash: `cat src/app/[locale]/<route>/<file>.tsx | grep -oE "'[A-Z][^']{30,}'" | wc -w` as rough proxy for visible text length.

### 5. Keyword targeting (E-E-A-T signals)
- **Experience**: page references the actual property (specific room names, exact distances, real activities arranged).
- **Expertise**: technical details (m², bedroom counts, year built, certifications).
- **Authoritativeness**: links out to authoritative sources (UNESCO sites, official tourism boards) where contextually relevant.
- **Trustworthiness**: real reviews with platform attribution, real contact info, real addresses.

### 6. Image SEO
- Filename describes content: `villa-ballena-pool-night.jpg` (not `IMG_5216.jpg`).
- Lowercase ASCII (Linux production case-sensitive).
- WebP/AVIF when possible (Next.js handles via `formats: ['image/webp']`).
- LCP image has `priority` flag.
- Below-fold images use default lazy loading (not `priority`).
- Each `<Image>` has `sizes` attribute when using `fill` prop.

## Process

1. **Pick scope**: single page, single route, or all routes.
2. **For each in-scope route**:
   - Read the page's `*Client.tsx` (since pages are split server/client).
   - Run heading grep, alt grep, link grep.
   - Word count proxy.
3. **Compile report**:
   - List ALL violations (not just summary).
   - Severity: Error (missing required), Warning (suboptimal), Info (improvement).
4. **Recommend** specific edits with file:line.

## Output format

```
## Content Audit — <route> — <date>

### Headings
- ✅ One h1 ("VILLA BALLENA")
- ⚠️ h1 → h3 jump in PhotoGallery section (PhotoGallery.tsx:42 — change h3 to h2 or add intermediate h2)
- ✅ h2/h3 chain correct in DayTimeline

### Internal links
- ✅ Links to /villa-beluga, /complex-beba, /contact
- ⚠️ Missing link to /weddings (could fit naturally in PracticalInfo's "Special events" mention)

### Alt text
- ❌ 3 images with `alt="Ballena"` (lib/images.ts:23-25) — replace with descriptive alts
- ✅ Hero image has good alt
- ✅ Gallery thumbnails individually described

### Word count proxy
- Visible body text: ~620 words → below 800 target for villa page
- Recommended additions: expand "What's included" section with 200 words about heating/cooling, expand DayTimeline with sensory detail.

### Image SEO
- ❌ 2 images still IMG_*.jpg (case-sensitivity already fixed but check filenames are descriptive)
- ✅ Hero has priority flag
- ⚠️ PhotoGallery <Image> components missing sizes attribute — Next emits oversized srcset

### Keyword targeting (E-E-A-T)
- Experience: ✅ specific room names, real distances ("23 km to Rovinj")
- Expertise: ✅ m², bedrooms, year built
- Authoritativeness: ⚠️ no outbound links to UNESCO Pula Arena, Istrian truffle association
- Trustworthiness: ⚠️ single review without platform attribution
```

## Don't

- Don't recommend keyword stuffing (e.g., "Villa Ballena luxury villa Istria luxury villa wellness sauna villa").
- Don't auto-add internal links unless the prose context supports them naturally.
- Don't suggest replacing real photos with stock — the project's brand depends on authenticity.
- Don't downgrade alt-text quality just to add keywords; alt is for screen readers first, SEO second.
