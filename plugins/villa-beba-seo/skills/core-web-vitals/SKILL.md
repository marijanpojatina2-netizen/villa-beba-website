---
description: Diagnose and fix Core Web Vitals for the villa-beba project — LCP, INP, CLS — including Next 16 specific patterns. Triggers on "core web vitals", "cwv", "lcp", "inp", "cls", "page speed", "render performance", "loading performance".
---

# Core Web Vitals Optimization

Project-aware optimization for the three Core Web Vitals metrics.

## Targets (Google's "Good" thresholds)

| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5–4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |

Google ranks on the **75th percentile** across real users — pass that threshold or you don't earn the boost.

## LCP — Largest Contentful Paint

The visual element that's largest in the viewport. On villa-beba, this is **always the hero `<Image>`** on each page.

### Quick checks
- Hero `<Image>` has `priority` flag — required for the LCP image.
- Hero uses `fetchPriority="high"` (`next/image` sets this automatically when `priority` is set).
- Hero source is reasonably sized (≤ 1.5MB for 1920×1080).
- Hero uses `sizes` attribute appropriate to layout (`sizes="100vw"` for full-bleed hero).
- No render-blocking JS/CSS upstream of the hero.
- Font swap: each `next/font` config has `display: 'swap'` (already wired).

### Project-specific LCP fixes

| Issue | Where | Fix |
|---|---|---|
| Hero image not preloaded | `next/image` without `priority` | Add `priority` prop |
| Hero image is HUGE source | `public/images/...` | Use sharp via `scripts/optimize-images.mjs` to pre-size to ≤ 1.5MB |
| Hero is below-fold animation that delays render | scroll-trigger compress + opacity reduce | Move scroll animation guard below hero appearance, use `gsap.matchMedia` |
| Lenis smooth scroll delays first paint | `SmoothScroll.tsx` | Verify Lenis only initializes after first paint via `useEffect` |
| Custom fonts blocking render | `[locale]/layout.tsx` | All 5 fonts use `display: 'swap'` (good) — but consider reducing to 2 fonts (P1-1 deferred) |

### Measurement
- DevTools → Performance → Record → look at LCP marker
- Lighthouse (via `villa-beba-seo:lighthouse`)
- Chrome User Experience Report (CrUX): https://pagespeed.web.dev/

## INP — Interaction to Next Paint

Time from a user interaction (tap, click, key) until the next paint reflecting the response. Replaces FID in 2024.

### Quick checks
- Long-running JS on main thread blocks INP.
- Event handlers should not synchronously block — defer expensive work via `requestIdleCallback` or `startTransition`.
- Lenis + GSAP run on every scroll → can spike INP if other JS is also competing.

### Project-specific INP fixes

| Issue | Where | Fix |
|---|---|---|
| Lenis scroll handler ties up main thread on mobile | `SmoothScroll.tsx` | Disable Lenis on `(max-width: 768px)` — mobile native scroll is fine (already partially via reduced-motion check) |
| GSAP ScrollTrigger fires onUpdate aggressively | various `useEffect` w/ `gsap.context` | Use `scrub: true` for declarative; avoid `onUpdate: () => setState(...)` patterns that re-render |
| Form submission blocks interaction | `ContactClient.tsx` `onSubmit` | Already async via `submitContactForm` — verify spinner shows during async |
| Heavy contentlayer/MDX hydration | not in this project | n/a |

### Measurement
- DevTools → Performance → record an interaction
- Lighthouse INP score
- `web-vitals` library at runtime: https://github.com/GoogleChrome/web-vitals

## CLS — Cumulative Layout Shift

Sum of all layout shifts that aren't user-initiated.

### Quick checks
- `<Image>` always has `width`/`height` OR `fill` with sized parent (Next/image guard rails this).
- Reserve space for ads / iframes / embeds.
- Don't insert content above existing content (e.g., late-loading banner pushing hero down).
- Font swap shouldn't cause re-layout (handle via `next/font` size-adjust automatically).

### Project-specific CLS fixes

| Issue | Where | Fix |
|---|---|---|
| Lenis stops on menu open: body overflow change | `Header.tsx` body style toggle | Already prefixed with overflow-hidden lock — verify no offset shift |
| GSAP fromTo with `y: '110%'` on `.reveal-line` | various | Ensure parent `<div className="overflow-hidden">` wraps line so layout doesn't expand |
| Fonts swap CLS | `[locale]/layout.tsx` `next/font` | Add `adjustFontFallback: 'Times New Roman'` (or similar) explicitly if shift seen |
| Map iframe loads | `ContactClient.tsx` map iframe | Already in `aspect-[4/3]` parent → no shift, good |
| OG image swap on hover | n/a | n/a |

### Measurement
- DevTools → Performance → look at "Layout Shift" markers
- Lighthouse CLS score
- `web-vitals` JS library

## Process

1. **Run Lighthouse** (`villa-beba-seo:lighthouse`) on the live URL — both desktop and mobile.
2. **Identify which metric fails** (often LCP first on mobile).
3. **Localize the offending element**: which `<Image>`/`<Component>` causes it.
4. **Apply project-specific fix** from the tables above.
5. **Re-measure**. Lighthouse mobile score should clear 90 for performance after typical fixes.
6. **Real User Monitoring (RUM)**: integrate `web-vitals` to send to Vercel Analytics (`@vercel/analytics`) or similar — measures actual user devices, not lab.

## Output format

```
## Core Web Vitals — <URL> @ <date>

### Lighthouse — Mobile
- LCP: 3.2s ❌ (target < 2.5s)
- INP: 180ms ✅
- CLS: 0.05 ✅
- Performance score: 76/100

### LCP root cause
- Hero image `/images/ballena/ballena-42.jpg` — 2.1MB JPG, served at 1920×1080
- Image has `priority` flag ✅
- BUT: image is 2.1MB → 800ms download on slow 3G
  Fix: re-encode to WebP, target ≤ 800KB

### INP root cause
- (No issues — passing comfortably)

### CLS root cause
- (No issues — passing)

### Action plan
1. (LCP) Run `node scripts/optimize-images.mjs` (if it exists) targeting hero images, output WebP at 1920×1080 ≤ 800KB.
2. (LCP) Add explicit `<link rel="preload" as="image" href={heroSrc}>` in head (Next 16 supports via `<head>` API).
3. Re-run Lighthouse to confirm < 2.5s.
```

## Don't

- Don't optimize for synthetic Lighthouse scores at the cost of real-user experience. Use RUM where possible.
- Don't preload too many images — only the LCP one. Preloading everything hurts LCP.
- Don't add `priority` to multiple `<Image>` components on a page — it confuses Next's prioritization.
- Don't ignore mobile scores. Google indexes mobile-first; mobile is the primary metric.
- Don't claim a fix landed without re-measuring after deploy.
