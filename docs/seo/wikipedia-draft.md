# Wikipedia & Wikidata submission draft

> **Status:** ready for human review and submission. The DataEase audit shows Wikipedia 0/40 and Wikidata 0/25 — together that's 65 of the 100 points blocked behind off-site action. This file gives you the article text, the citations, and the Wikidata payload ready to paste.

## ⚠️ Wikipedia notability bar

A standalone Wikipedia article on a vacation-rental brand is **unlikely to survive AfD** unless the property has substantial third-party press coverage (architecture review in a national magazine, an award, a TV feature, etc.). What probably *will* survive:

1. **A short paragraph in the existing [Svetvinčenat](https://en.wikipedia.org/wiki/Svetvin%C4%8Denat) Wikipedia article** under "Tourism" — referencing the villas alongside other tourism infrastructure. Easy to add. Low takedown risk.
2. **A Wikidata entity** (no notability bar) for `Villa Ballena & Villa Beluga` with `instance of: vacation home`, `located in: Svetvinčenat`, `coordinate location`, `official website`, `Instagram username`. This alone unlocks knowledge-graph signals.

We do option 2 immediately. Option 1 we attempt when we have ≥2 independent press citations (HARO journalist outreach in Task 16 is the path).

## Wikidata entity payload

Sign in to https://www.wikidata.org → **Create new item** → fill as below. After creation note the QID (Qxxxxx) and add it to `src/lib/contact.ts` so we can include it in JSON-LD as a `sameAs` link.

```yaml
labels:
  en: Villa Ballena & Villa Beluga
  de: Villa Ballena & Villa Beluga
  hr: Villa Ballena i Villa Beluga

descriptions:
  en: Two designer luxury vacation villas in Svetvinčenat, Istria, Croatia.
  de: Zwei Designer-Luxus-Ferienvillen in Svetvinčenat, Istrien, Kroatien.
  hr: Dvije dizajnerske luksuzne vile za odmor u Svetvinčenatu, Istra, Hrvatska.

aliases:
  en: [Villa Ballena, Villa Beluga, Complex BeBa, Ballena & Beluga]
  hr: [Villa Ballena, Villa Beluga, Complex BeBa]

statements:
  P31  (instance of):       Q1799794   # vacation home
  P17  (country):           Q224        # Croatia
  P131 (located in admin):  Q971146     # Svetvinčenat (municipality)
  P625 (coordinate location): 45.091986, 13.886013
  P571 (inception):         2021
  P856 (official website):  https://www.ballenaandbeluga.com
  P2003 (Instagram username): istrianvillaescape
  P1296 (Croatian Encyclopedia): (skip — not eligible)

# Optional once GBP listings are verified:
  P3749 (Google Maps CID):  <Ballena CID>
  P3749 (Google Maps CID):  <Beluga CID>
```

## Svetvinčenat article — proposed paragraph addition

Open https://en.wikipedia.org/wiki/Svetvin%C4%8Denat and add to the **Tourism** section (or create one if missing):

> The municipality has invested in upmarket vacation-rental capacity since the late 2010s. Notable additions include Villa Ballena and Villa Beluga (built 2021), a pair of 350 m² designer villas with private heated pools and a Finnish sauna, located on the southern edge of the village.[CITATION]

**Citation requirements** (Wikipedia rejects self-published sources for this):

- ✅ Local Croatian press article on the property (Glas Istre, 24sata, Slobodna Dalmacija)
- ✅ Architecture / interior-design publication (Dezeen, Designboom, Architectural Digest if achievable)
- ✅ Tourism-board listing (visit-istria.com)
- ❌ Our own website
- ❌ Booking platform listing (Airbnb, Booking.com)
- ❌ Press release

**If you don't yet have any of these**, hold off on submitting. The Svetvinčenat article is patrolled and the edit will be reverted within hours without a citation. Use the Task 16 outreach plan to land press first.

## Standalone article (optional, advanced)

Should the press coverage from Task 16 produce 2+ qualifying sources, the following stub satisfies WP:GNG and can be drafted at https://en.wikipedia.org/wiki/Draft:Villa_Ballena_%26_Villa_Beluga and submitted via AfC.

```wiki
{{Infobox hotel
| name              = Villa Ballena & Villa Beluga
| image             =
| caption           =
| former_names      =
| location          = Svetvinčenat 150 / 151, 52342 Svetvinčenat, Istria County, Croatia
| coordinates       = {{coord|45.091986|13.886013|type:landmark_region:HR|display=inline,title}}
| opening_date      = 2021
| operator          =
| owner             =
| number_of_rooms   = 8 (4 en-suite per villa)
| number_of_suites  =
| floors            = 2 per villa
| website           = https://www.ballenaandbeluga.com
}}

'''Villa Ballena''' and '''Villa Beluga''' are a pair of luxury vacation villas in
[[Svetvinčenat]], [[Istria County]], [[Croatia]]. Built in 2021, the two adjacent
350 m² properties share a clay tennis court and can be booked individually or
together as ''Complex BeBa'' for groups of up to 18 guests.<ref>[CITATION 1]</ref>

== Design ==
The villas were designed in a contemporary minimalist style with [reference
designer/architect once known]. Each villa features four en-suite bedrooms,
underfloor heating, central air conditioning, and a heated 8 × 4 m biological
swimming pool. Villa Ballena has a private Finnish sauna in the basement;
Villa Beluga has a glass-walled terrace and a games room with a billiard
table.<ref>[CITATION 2]</ref>

== Reception ==
[Press coverage / reviews — to be added once published]

== References ==
{{reflist}}

== External links ==
* {{official|https://www.ballenaandbeluga.com}}
* [https://www.instagram.com/istrianvillaescape Villa Ballena & Beluga on Instagram]

[[Category:Buildings and structures in Istria County]]
[[Category:Hotels in Croatia]]
[[Category:Hotels established in 2021]]
[[Category:Buildings and structures completed in 2021]]
```

## Submission checklist

- [ ] Create Wikidata entity (no citations needed) → record QID
- [ ] Add QID to `src/lib/contact.ts` `WIKIDATA_ID` constant
- [ ] Surface QID in `src/lib/schema.ts` `BRAND_SAME_AS` as `https://www.wikidata.org/wiki/<QID>`
- [ ] Re-run DataEase audit — Wikidata 0/25 should jump to 25/25
- [ ] Land 2+ qualifying press citations (see Task 16 / outreach plan)
- [ ] Add the Svetvinčenat-tourism paragraph with citation
- [ ] Optional: draft standalone article at Draft:Villa Ballena & Villa Beluga
- [ ] Submit via Articles for Creation (AfC); be ready for 2–8 weeks of reviewer feedback
