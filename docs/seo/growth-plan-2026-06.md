# Organic growth plan — June 2026

> **Status:** active master plan as of 2026-06-10. Supersedes the priority ordering in
> the May playbooks (which remain the execution references). Re-baseline monthly
> against the weekly GSC report issues.

## Diagnosis (data, 2026-06-10)

| Signal | Value | Source |
| --- | --- | --- |
| Clicks / week | **0** | GSC weekly #10 |
| Impressions / week | 20 (▲ from 10) | GSC weekly #10 |
| Queries with impressions | brand only ("villa ballena" pos 11.9, "villa beluga") | GSC weekly #10 |
| Indexed URLs | 18 / 64 — 42 in "Discovered – currently not indexed" | GSC Pages report |
| Referring domains / backlinks | 0 / 0, Moz DA 1 | DataEase audit |
| Brand SERP | owned by agencies (Crovillas, My Luxoria, RLVC, Vrbo) — own site at pos ~12 | live SERP check |
| Lighthouse mobile | SEO/BP/A11y 100, **Perf 74** (LCP regression: wrong image preloaded) | audit 2026-06-10 |
| /de impressions | ~0 (no DE pages in top-pages report) | GSC weekly #10 |

**Conclusion:** on-site is excellent, off-site is zero. Google won't index or rank a
DA-1 domain regardless of content quality. Content production (12 guides EN+DE) is
already outpacing Google's willingness to index. The bottleneck is **authority**,
the fastest ROI is **winning the brand SERP** (the only queries with impressions
today), and there is one week of **technical fixes** (audit 2026-06-10) to clear
so nothing internal handicaps the off-site push.

---

## Pillar 0 — Technical sprint (this week, Claude, ~1 day of code)

From the 2026-06-10 full audit. Order = leverage.

1. **Apex 307 → 308/301** — Vercel dashboard: set `www` as primary domain, enable
   permanent redirect for apex. *(Operator, 2 min — dashboard toggle, not code.)*
   Every future directory/OTA backlink to the apex currently passes no equity.
2. **DE schema localization** — FAQ JSON-LD now builds from the same next-intl
   messages the visible accordion renders (single source, can't diverge); blog
   Article schema uses `titleDE`/`descDE` on `/de`; brand schema `containsPlace`
   URLs follow the page locale. Unblocks DE rich-result eligibility.
3. **LCP fix** — home `Hero.tsx` is `'use client'` so Next preloads the *blog card*
   image instead of the hero; extract GSAP into a leaf client component, make the
   hero (and villa-page heroes) server-rendered with `priority`. Target: Perf 74 → 85+,
   LCP < 2.5 s.
4. **Home H1** — "BALLENA & BELUGA" → include "Luxury Villas in Istria" (keep the
   decorative spans, demote them from H1).
5. **Gallery alt text** — ~80 images have `alt: 'Ballena'`/`'Beluga'`; write
   descriptive 6–10-word alts from the existing `category` field. Opens Google
   Image Search as a channel.
6. **Sitemap freshness** — replace hardcoded `LAST_UPDATED` (2026-05-05) with real
   per-route dates; add `x-default` to sitemap alternates. (Keep per-locale
   entries — that part is Google's documented hreflang-in-sitemap pattern.)
7. **sameAs expansion** — add the live OTA/agency listing URLs (Vrbo, Crovillas,
   My Luxoria, RLVC) to each villa's schema `sameAs`, alongside the GBP URLs.
   Consolidates the brand entity Google is currently splitting across agencies.

> **Status 2026-06-10:** items 2–7 shipped (plus: H1 keyword fix, 93 descriptive
> gallery alts, index-coverage section in the weekly GSC report, week-8 sprint
> topic swap, outreach drafts in `outreach-emails-2026-06.md`). Item 1 (apex
> 307→308) remains an operator dashboard toggle. The audit's "wrong LCP preload"
> finding was refuted by a live check — preload correctly targets the hero;
> no refactor needed.

## Pillar 1 — Win the brand SERP (weeks 1–2, fastest ROI)

Goal: **top-3 for "villa ballena" / "villa beluga" within 30 days** (now ~12).
Every brand search that lands on an agency = a booking that pays 15–20 % commission.

- GBP is verified (both listings) — start the cadence: 1 post/week per listing
  (`npm run gbp-draft` already outputs copy-paste text), 20+ photos, seed 5–10 Q&As,
  and ask **every** departing guest for a GBP review (direct link in the post-stay email).
- Ask Crovillas / My Luxoria / RLVC to add an "official website" link on their
  listing pages. They already profit from the villas; many agencies will.
  Even nofollow = brand citation.
- Establish who controls the existing Vrbo listing (`vrbo.com/11537768ha`) —
  if agency-run, decide whether to claim it before the FeWo-direkt setup (one
  Vrbo/FeWo/Expedia listing per unit; avoid duplicates).
- Apex 308 fix (Pillar 0 #1) feeds this directly.

## Pillar 2 — Authority: 0 → 15+ referring domains in 90 days (operator, ~3 h/week)

Execute `docs/seo/backlink-outreach-plan.md`, sequenced:

| Week | Action | Expected links |
| --- | --- | --- |
| 1 | Tier-1 directories in one sitting (~2 h): istra.hr, croatia.hr, HomeToGo, Holidu, Plum Guide, Boutique Homes, … | 4–6 |
| 2 | FeWo-direkt per `docs/seo/fewo-direkt-listing-plan.md` — **calendar sync first** | 1 + DE channel |
| 2–3 | **Guide-powered partner outreach**: every vendor named in a guide (Noi Due, LF Weddings, Karlić Tartufi, Kozlović/Clai/Coronica/Kabola, Konoba Morgan, …) gets a short email — "we featured you, here's the link; a 'where to stay' link back would mean a lot". ~12 emails, Claude drafts. | 3–5 |
| 3+ | HARO/Qwoted — 3 pitches/week (Croatia, villa, wedding, wellness filters) | 2–4 over 90 d |
| 4+ | Editorial pitches, DE outlets first (SZ Reise, FAZ Reise, Schöner Wohnen), HR local angle (Glas Istre: "designer villas in Svetvinčenat") | 1–3 |
| ongoing | Reddit karma-building → 1 quality r/Croatia post; TripAdvisor forum answers | 1–2 |

KPI: referring domains 0 → 15+, DA 1 → ~15, GSC "Discovered – not indexed" 42 → < 20.

## Pillar 3 — German market (parallel)

- **Pinterest launch** — kit is fully drafted (`docs/seo/pinterest-launch.md`):
  1 h setup, 5 DE boards, 10 ready pins, then 3–5 pins/week scheduled monthly.
  Pinterest ranks in weeks, not months — referral traffic *this season*.
- **Content sprint retargeting** — week 8 topic "Renting a car for Istria"
  duplicates the existing `driving-to-istria-by-car` guide. Swap for a DE-intent
  topic, e.g. "Istrien mit Hund — pet-friendly villa" (pets are an amenity) or
  "Istrien im September/Oktober — Nebensaison mit beheiztem Pool".
- 2–3 DE-first guides after the sprint ends (week 10): autumn truffle season,
  "Anreise aus Bayern/Österreich" expansion, September weather + heated pool.
- KPI: /de impressions 0 → 100+/week by end of August.

## Pillar 4 — Measurement loop (mostly already automated)

- Monday GSC report (live) — watch: brand position, indexed count, first non-brand queries.
- Friday content sprint (live, weeks 6–10 remaining; week 6 fires 2026-06-12:
  "Family activities in central Istria").
- IndexNow auto-ping after every ship (live).
- **New:** extend `scripts/gsc-report.mjs` with an indexed-URL count via the URL
  Inspection API (64 URLs, well within the 2 000/day quota) so the weekly issue
  tracks indexing progress without manual GSC checks. *(Claude, small code task.)*
- Hygiene: close shipped content-sprint and reviewed seo-report issues (all 10 currently open).
- Monthly: re-run DataEase/SEOptimizer, chart referring domains vs. indexed count.

---

## Expectations (realistic, young domain)

| Horizon | Expected state |
| --- | --- |
| Month 1 (July) | Brand SERP top-3, first clicks, indexed 18 → ~30, Pinterest referrals starting |
| Month 2 (Aug) | 10+ referring domains, indexed 40+, first non-brand long-tail impressions (guides), /de impressions visible |
| Month 3 (Sep) | 50–150 organic clicks/mo, first direct inquiries attributable to organic, DA ~10–15 |
| Dec 2026 | Everything indexed + DA 15+ **before the Jan–Mar 2027 booking-research season** — that's the real payoff window |

## Division of labor

- **Claude (code, drafts):** all of Pillar 0, sameAs wiring, GSC report extension,
  Friday guides, GBP post drafts, outreach email drafts per target, pin descriptions.
- **Operator (~3–4 h/week):** Vercel domain toggle, directory submissions,
  sending outreach emails, GBP posting + photos + review asks, Pinterest account
  + pinning, FeWo-direkt listing + calendar sync, agency "official site" asks.
