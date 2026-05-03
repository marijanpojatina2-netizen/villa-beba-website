---
description: Audit and rewrite per-page meta titles, descriptions, OG, Twitter cards, and canonical URLs. Triggers on "meta optimize", "meta tags", "title rewrite", "description audit", "open graph", "og tags".
---

# Meta Tag Optimization

Audit and rewrite each route's `generateMetadata` output for SEO and social-share quality.

## What to check

### 1. Title length and structure
- **Length**: 50–60 characters (Google truncates around 580 pixels). Hard-cap at 60.
- **Format**: `<Primary keyword> | <Brand>` or `<Page topic> · <Brand>` (consistent across site).
- **Uniqueness**: each page MUST have a different title. No duplicates.
- **Brand**: include "Villa Ballena & Beluga" or "Villa Ballena" / "Villa Beluga" depending on page focus. The site-wide template `%s | Villa Ballena & Beluga` (already in [locale]/layout) handles brand suffix automatically — pages provide just the page-specific title.

### 2. Description length and content
- **Length**: 140–160 characters (Google truncates around 920 pixels).
- **Should include**: primary keyword, value prop, location, and call-to-action where natural.
- **No keyword stuffing**: write for humans first, search second.
- Each page MUST have a different description.

### 3. Open Graph
- `og:title` ≤ 60 chars (LinkedIn truncates earlier than Google).
- `og:description` ≤ 200 chars.
- `og:image` 1200×630 minimum (Facebook recommends 1200×630, X/Twitter 1200×675).
- `og:locale` matches `lang` (`en_US` / `de_DE`).
- `og:type` = `website` for general pages, `article` for blog posts.
- `og:siteName` = "Villa Ballena & Villa Beluga".

### 4. Twitter Card
- `twitter:card` = `summary_large_image` for all promotional pages.
- `twitter:title`, `twitter:description` mirror OG.
- `twitter:image` reuses OG image.

### 5. Canonical URL
- Each page emits `<link rel="canonical" href="...">` via `metadata.alternates.canonical`.
- Format: full absolute URL with locale prefix (`https://www.villabeba.com/en/villa-ballena`).
- Trailing slash policy: NO trailing slash (Next 16 default).

### 6. Hreflang alternates
- `metadata.alternates.languages.en` and `.de` set on every page.
- Both URLs absolute.
- Add `x-default` if applicable (Next.js doesn't enforce — manual via `metadata.other`).

## Process

1. **List routes**: `find src/app -name "page.tsx" | sort`.
2. **For each route**:
   - Read `generateMetadata` output (run `npm run build` once, then read `.next/server/app/...html` OR examine source code).
   - Score each field (length, uniqueness, keyword presence).
3. **Compile findings table** (per-route):

```
| Route | Title len | Desc len | OG image? | Hreflang? | Canonical? | Issues |
|---|---|---|---|---|---|---|
| / | 56 | 152 | ✅ | ✅ | ✅ | — |
| /villa-ballena | 65 ❌ | 155 | ✅ | ✅ | ✅ | Title 5 chars over 60 |
```

4. **Suggest rewrites** for any flagged title/description, providing 2-3 alternatives per page so user can pick.

## Title rewrite examples (luxury hospitality patterns)

| Page | Weak | Strong |
|---|---|---|
| Home | "Villa Ballena & Beluga - Luxury Villas" (too short, no location) | "Luxury Villas in Istria · Private Pool & Sauna" (60 chars, includes location, value props) |
| Villa Ballena | "Villa Ballena Wellness Villa Istria Croatia" (keyword stuffing) | "Villa Ballena · Wellness Villa with Sauna in Istria" (52 chars, descriptive) |
| Pricing | "Pricing" (no context) | "Pricing & Availability 2026 · Villa Ballena & Beluga" (54 chars, year signals freshness) |
| Blog post | "Things to do" (vague) | "10 Unforgettable Experiences in Istria · From the Villas" (56 chars, specific number, location) |

## Description rewrite examples

| Page | Weak (84 chars) | Strong (158 chars) |
|---|---|---|
| Home | "Two villas in Istria with pool and sauna." | "Villa Ballena & Beluga — two designer villas in Svetvinčenat, Istria. Heated pool, sauna, 4 en-suite bedrooms each. From €600/night. Direct booking." |
| Villa Beluga | "Entertainment villa with game room." | "Villa Beluga · Designer entertainment villa in Istria with private game room, glass terrace, heated pool & 4 en-suite bedrooms. From €600/night." |

## Per-page targets (Villa Ballena & Beluga)

| Page | Primary keyword | Title template (≤60) | Desc template (≤160) |
|---|---|---|---|
| `/` | luxury villa istria | "Luxury Villas in Istria · Private Pool & Sauna" | "Villa Ballena & Beluga — two designer villas in Svetvinčenat, Istria. Heated pool, sauna, 4 en-suite bedrooms. From €600/night. Direct booking." |
| `/villa-ballena` | wellness villa istria | "Villa Ballena · Wellness Villa with Sauna in Istria" | "350m² designer wellness villa with private sauna, heated biological pool, 4 en-suite bedrooms in Svetvinčenat, Istria. From €600/night." |
| `/villa-beluga` | family villa istria game room | "Villa Beluga · Family Villa with Game Room in Istria" | "350m² family-friendly villa with private game room, glass terrace, heated pool, 4 en-suite bedrooms in Svetvinčenat, Istria. From €600/night." |
| `/complex-beba` | group villa istria 18 guests | "Complex BeBa · Both Villas Together · 18 Guests" | "Book Villa Ballena & Villa Beluga together: 700m², 8 bedrooms, 2 pools, sauna & game room in Istria. Ideal for weddings & family reunions." |
| `/weddings` | wedding villa istria | "Wedding Villa in Istria · Up to 60 Guests" | "Get married at Villa Ballena & Beluga in Istria. Two villas, private pool, catering & wedding planning for up to 60 guests in Svetvinčenat." |
| `/corporate-retreats` | corporate retreat istria | "Corporate Retreats in Istria · 18 Guests, 2 Villas" | "Strategic offsite at Villa Ballena & Beluga: 18 guests, high-speed WiFi, AV-ready spaces, team-building activities in Istria." |
| `/experiences` | things to do istria luxury villa | "Istrian Experiences · Truffle Hunting, Wine, Rovinj" | "Curated experiences from Villa Ballena & Beluga — truffle hunting, wine tasting, Pula Arena, Rovinj day trip, all within an hour." |
| `/pricing` | villa istria price | "Pricing & Availability 2026 · Villa Ballena & Beluga" | "Transparent 2026 rates from €600/night. Wedding & corporate event premiums. Direct booking discount. Villa Ballena & Beluga, Istria." |
| `/gallery` | villa istria photos | "Photo Gallery · Villa Ballena & Beluga" | "Explore Villa Ballena & Beluga in Istria: pools, interiors, bedrooms, exteriors, and the Mediterranean surroundings of Svetvinčenat." |
| `/about` | luxury villa istria story | "Our Story · Villa Ballena & Beluga in Istria" | "The story behind Villa Ballena & Villa Beluga — two designer villas in Svetvinčenat, Istria, born from a love of authentic Mediterranean living." |
| `/contact` | book villa istria contact | "Book or Inquire · Villa Ballena & Beluga" | "Direct booking for Villa Ballena & Beluga in Istria. Phone, email, WhatsApp, or use our inquiry form. Reply within 24 hours." |
| `/faq` | villa istria faq | "Frequently Asked Questions · Villa Ballena & Beluga" | "Everything you need to know before booking Villa Ballena & Beluga: cancellation, pets, check-in, payment, included amenities." |
| `/blog` | istria luxury travel guide | "Journal · Istria Travel Guides from Villa Ballena & Beluga" | "Travel tips, food guides, and experiences in Istria from the team behind Villa Ballena & Beluga in Svetvinčenat." |

## Output format

```
## Meta Tag Audit — <date>

### Findings table
| Route | Title (chars) | Desc (chars) | OG | Hreflang | Canonical | Issues |

### Recommended rewrites
**Route**: /villa-ballena
- Current title (62 chars): "..."
- Suggested title (52 chars): "Villa Ballena · Wellness Villa with Sauna in Istria"

**Route**: ...
```

## Don't

- Don't optimize titles for one keyword while breaking the brand voice (luxury hospitality demands restraint, not keyword density).
- Don't make all titles identical with brand prefix — each page needs unique value-prop.
- Don't ignore description CTA opportunities ("Direct booking", "From €600/night", "Inquire today").
- Don't strip Croatian diacritics from titles (Svetvinčenat, ne Svetvincenat) — see related fix in `008c1ed`.
