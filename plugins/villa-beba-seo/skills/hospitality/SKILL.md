---
description: Luxury-hospitality vertical SEO — Google Travel, Hotel/Lodging schema specifics, local SEO patterns, and competitor benchmarking against Aman/Six Senses/Belmond/Maistra. Triggers on "hospitality seo", "hotel seo", "luxury hospitality", "google travel", "lodging schema", "local seo".
---

# Luxury Hospitality SEO

Vertical-specific patterns for hotels, vacation rentals, and luxury lodging properties — what Google Travel, Hotel Insights, and the rich result pipeline reward.

## What's specific to hospitality

### 1. Google Hotel & Vacation Rental verticals
Google maintains TWO separate verticals:
- **Google Hotel Search** — feeds traditional hotels (`Hotel`, `LodgingBusiness` schema) into "Hotels in <city>" SERP module.
- **Google Vacation Rentals** — feeds short-term rentals (`VacationRental` schema with `numberOfBedrooms`, `occupancy`) into "Vacation rentals" tab.

The project uses **both**:
- `LodgingBusiness` (umbrella, in [locale]/layout) — fits "Hotel near Svetvinčenat" queries
- `VacationRental` (per-villa) — fits "Vacation rentals in Istria 4 bedrooms" queries

### 2. Hotel-specific schema fields (LodgingBusiness)

Required:
- `@type: "LodgingBusiness"` (parent class) or specialised: `Hotel`, `Resort`, `BedAndBreakfast`, `VacationRentalListing`
- `name`, `address` (PostalAddress with all locality/region/country/postal-code)
- `telephone` (E.164 format)
- `url`

Strongly recommended:
- `image` (1+ high-res, ideally 1200×630 minimum)
- `priceRange` (`$$`/`$$$`/`$$$$` OR explicit currency range like `"€600 – €1,000"`)
- `geo` (lat/lng of the property pin, NOT city centre)
- `amenityFeature` (each as `LocationFeatureSpecification` with `name` + `value: true`)
- `aggregateRating` (only when ≥5 verified reviews from real platform — Google may suppress otherwise)
- `starRating` (ONLY with official classification — without source, Google flags as spam)

### 3. Vacation Rental specifics

Beyond LodgingBusiness, VacationRental MUST have:
- `numberOfBedrooms` (integer)
- `numberOfBathroomsTotal` (integer)
- `floorSize` (`QuantitativeValue` with `value` and `unitCode: "MTK"` for m²)
- `occupancy` (`QuantitativeValue` with `value`, `unitText: "guests"`)
- `petsAllowed` (boolean)
- `yearBuilt` (year integer)
- `offers.priceSpecification` (`UnitPriceSpecification` with `price`, `priceCurrency`, `unitText: "NIGHT"`, `availability`)

### 4. Local SEO (NAP consistency)

**NAP** = Name, Address, Phone. Must be **byte-identical** across:
- Schema.org JSON-LD
- Visible page text (footer, contact page)
- Google Business Profile (formerly Google My Business)
- Booking.com listing
- Airbnb listing
- TripAdvisor / Tripadvisor / Hotels.com / Expedia
- Local directories (Visit Istria, Croatian National Tourism Board, etc.)

Inconsistencies trigger Google's local algorithm to lower confidence in the entity. Fix before chasing keyword wins.

### 5. Hreflang for hospitality

Critical because guests search in their native language:
- `en` / `de` already wired
- **Strongly recommend adding**: `it` (Italian — closest tourist market for Istria), `hr` (Croatian — domestic luxury market)
- `x-default` fallback to EN (already wired via `metadata.alternates.languages`)

### 6. Image SEO for hospitality

- **Primary hero**: 1920×1080 minimum, JPG ≤ 500 KB, `priority` flag.
- **Property exterior** drone shot — preferred for Google Hotels "main photo".
- **Pool/wellness** images for Pinterest/Instagram-friendly social discovery.
- **Filenames**: `villa-ballena-pool-night.jpg` not `IMG_5216.jpg`.
- **Multiple aspect ratios** for different surfaces: 1:1 (Instagram), 16:9 (web), 4:5 (Pinterest), 9:16 (stories).

### 7. Booking-intent signals

Pages that signal commercial intent improve "near me" / "book a stay" rankings:
- Visible price OR "Get a quote" CTA above fold
- Calendar / "Check availability" widget
- Direct booking form (project has /contact form — good)
- WhatsApp / phone CTAs prominent (already wired)
- Short response time claims ("Reply within 24 hours")
- Cancellation policy linked from pricing page

## Competitor benchmarking (luxury hospitality references)

When auditing, compare against these for inspiration (NOT to copy):

| Brand | What they do well |
|---|---|
| **Aman Resorts** (aman.com) | Restrained editorial copy. Single hero image per property. No prices displayed (intentional — invite inquiry). Schema: very thorough Hotel + Resort markup. |
| **Six Senses** (sixsenses.com) | Wellness storytelling. Each property page has a "Your day at Six Senses" timeline (which v7-light's villa pages emulate via `DayTimeline` — keep). |
| **Belmond** (belmond.com) | Heritage / history-heavy content. Strong E-E-A-T from "since 1860" framing. Heavy use of Article schema for travel-journal blog posts. |
| **Maistra** (maistra.com) | Croatian-Adriatic competitor. Strong Croatian-tourism keyword targeting in HR/EN/DE/IT. Note: their Istrian properties (Rovinj area) are direct geographic competitors. |

Don't copy their copy or design — borrow patterns, never content. Google penalizes near-duplicate content.

## Process for a hospitality SEO audit

1. **Schema sanity** — invoke `villa-beba-seo:schema-validate`.
2. **NAP audit** — check phone/email/address match across:
   - `lib/contact.ts` (CONTACT)
   - `lib/schema.ts` (LodgingBusiness telephone, email, address)
   - `Footer.tsx` rendered text
   - `ContactClient.tsx` rendered text
   - Google Business Profile (manual check, link out)
   - Booking.com listing (manual check)
3. **Image SEO** — descriptive filenames, alt texts, drone shot for property hero, all lowercase.
4. **Hreflang completeness** — every page has en+de alternates (verify build output).
5. **Booking-intent signals** — CTA visibility audit using `villa-beba-seo:meta-optimize` lens.
6. **Local SEO** — verify Google Business Profile is claimed, content matches site, photos uploaded.
7. **Competitor benchmark** — pick 2-3 direct competitors (Maistra Istria properties, Plitvice/Brijuni-area villas) and screenshot their meta titles for comparison.

## Don't

- Don't add `aggregateRating` until you have 5+ real reviews with platform attribution. Fake or self-reviewed = Google penalty.
- Don't claim official `starRating` without classification. Croatian Ministry of Tourism does NOT classify private vacation rentals; use `petFriendly`/`amenityFeature` instead.
- Don't pad amenityFeature with trivial items ("doormat: true"). 8-12 substantive amenities is ideal.
- Don't submit hospitality schema with placeholder data (CONTACT.phoneE164 placeholder = ❌, real number = ✅).
- Don't ignore Croatian-specific signals: Istria, Adriatic, dalmatian, Mediterranean — these are local SERP differentiators.
