---
description: Validate JSON-LD structured data emitted by the project against Schema.org spec and Google's Rich Results requirements. Triggers on "validate schema", "schema check", "json-ld validate", "rich results", "structured data audit".
---

# JSON-LD Schema Validation

Validate every JSON-LD `<script type="application/ld+json">` the site emits.

## What to validate

The project emits these schemas (defined in `src/lib/schema.ts`, rendered via `<JsonLd data={...} />`):

| Schema | Where used | Required fields | Optional but recommended |
|---|---|---|---|
| **LodgingBusiness** | Every page (via `[locale]/layout.tsx`) | `@context`, `@type`, `name`, `address`, `telephone`, `priceRange` | `geo`, `amenityFeature`, `aggregateRating`, `image`, `url`, `email` |
| **VacationRental** | `/villa-ballena`, `/villa-beluga` | `@context`, `@type`, `name`, `address`, `numberOfBedrooms`, `occupancy` | `floorSize`, `petsAllowed`, `yearBuilt`, `offers.price`, `image` |
| **BreadcrumbList** | Every page below home | `@context`, `@type`, `itemListElement` (≥2 ListItem) | — |
| **Article** | Each blog post | `@context`, `@type`, `headline`, `author`, `datePublished`, `image` | `dateModified`, `publisher.logo` |
| **FAQPage** | `/faq` | `@context`, `@type`, `mainEntity` (≥1 Question) | — |

## Process

1. **Inventory**: read `src/lib/schema.ts`. Confirm each helper function (`getLodgingBusinessSchema`, `getVacationRentalSchema`, `getBreadcrumbSchema`, `getArticleSchema`, `getFAQSchema`) returns valid object.
2. **Check call sites**: every consumer (`[locale]/layout.tsx`, each villa page, `/faq`, blog `[slug]/page.tsx`) should pass schema to `<JsonLd>`.
3. **Field-level validation per schema** (see "Common errors" below).
4. **Build and inspect output**: `npm run build`, then read `.next/server/app/_global-error.html` and the index page output. Look for the JSON-LD scripts. Parse JSON to confirm valid syntax.
5. **External validators** (if URL is live):
   - Google Rich Results Test: `https://search.google.com/test/rich-results?url=<encoded-url>` — fetch via WebFetch, parse output for warnings/errors
   - Schema.org Validator: `https://validator.schema.org/` — POST the JSON-LD content
6. **Report** per schema with severity:
   - **Error**: missing required field, wrong type, or rejected by Google
   - **Warning**: missing recommended field that improves rich result eligibility
   - **Info**: optional improvement

## Common errors and fixes

### LodgingBusiness
- ❌ `telephone: "+385XXXXXXXX"` placeholder — Google flags as spam, blocks rich results.
  - **Fix**: pull from `CONTACT.phoneE164` (already wired in `lib/contact.ts`).
- ❌ `starRating: { ratingValue: "5" }` without `ratingExplanation` or official source — Google may suppress.
  - **Fix**: drop `starRating` until officially classified, or add `ratingExplanation: "https://..."`.
- ⚠️ Missing `aggregateRating` — eligible only when ≥5 reviews. Track when reviews accumulate.
- ⚠️ `geo` coordinates are estimated city-center. Use the actual property pin (already done — `CONTACT.geo`).

### VacationRental
- ❌ `numberOfBedrooms` missing — required for rich result.
- ❌ `occupancy` not as `QuantitativeValue` with `value` and `unitText: "guests"`.
- ⚠️ `offers.priceSpecification.price` should be a number, not a string.
- ⚠️ `floorSize.unitCode: "MTK"` (square meters) — verify ISO 80000-3 unit code if unsure.

### BreadcrumbList
- ❌ Each `ListItem` requires `@type: "ListItem"`, `position` (1-based), `name`, `item` (URL).
- ⚠️ The first item should be the home page (`position: 1`).

### Article
- ❌ Missing `image` — Article cards in Google Discover require image.
- ⚠️ `dateModified` ≥ `datePublished` (use same date if not modified).
- ⚠️ `author` should be Organization (not Person) for brand-published content.

### FAQPage
- ❌ Each Question requires `name` (the question text) and `acceptedAnswer.text`.
- ⚠️ Don't use FAQPage on listings of unrelated questions; it's for genuine FAQs from your site.

## Output format

```
## Schema Validation — <date>

### LodgingBusiness ([locale]/layout.tsx)
- ✅ All required fields present
- ⚠️ Missing aggregateRating — wire when ≥5 verified reviews
- ✅ Telephone is real (CONTACT.phoneE164)

### VacationRental — Villa Ballena (/villa-ballena/page.tsx)
- ❌ numberOfBathroomsTotal missing — Google requires for full rich result
  Fix: add `numberOfBathroomsTotal: 4` to getVacationRentalSchema('ballena')
- ✅ numberOfBedrooms, occupancy, floorSize OK

### BreadcrumbList — Blog post (/blog/[slug]/page.tsx)
- ✅ Three-level chain (Home → Journal → Post)

### Article — All 3 blog posts
- ✅ Required fields OK
- ⚠️ dateModified missing — auto-fills with datePublished

### FAQPage (/faq)
- ✅ 12 questions, all with acceptedAnswer
```

## Don't

- Don't fabricate validation results. Only report what `validator.schema.org` or `search.google.com/test/rich-results` actually said.
- Don't propose fields that aren't part of Schema.org spec — link the spec URL when uncertain (e.g., https://schema.org/LodgingBusiness).
- Don't strip working schema in pursuit of minor warnings — Google's rich result algorithm is forgiving for warnings, brutal for errors.
