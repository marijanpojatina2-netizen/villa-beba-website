# GSC "Request Indexing" — guide pages (2026-06-19)

> **Why this exists:** the 2026-06-16 batch ([`gsc-request-indexing-2026-06.md`](gsc-request-indexing-2026-06.md))
> requested the `/guides` + `/blog` **hubs**, betting that Googlebot would follow the
> internal links and discover the child guides on its own. A `site:` check on 2026-06-19
> shows that **did not propagate** — only the home page surfaces; the individual guide
> pages are still not indexed. So this batch requests **each guide URL directly**.
>
> This is still a stopgap. Request Indexing pushes a URL into Google's priority crawl
> queue; it does not guarantee the page *stays* indexed on a low-authority domain. The
> durable fix remains referring domains — see
> [`directory-submission-pack.md`](directory-submission-pack.md). But it's free, ~15 min,
> and it now has reinforcement: the home page carries a server-rendered **Guides** section
> and the footer links `/guides` sitewide, so the next crawl finds these pages linked from
> already-indexed pages (not just the hub).

## How

1. Google Search Console → property `sc-domain:ballenaandbeluga.com`.
2. Paste a full URL into the **URL Inspection** bar (top).
3. **Request Indexing** → wait for the live test → confirm.
4. Soft quota **~10–12 URLs/day**, so this is split into three batches over three days.

These are the canonical `www` URLs (match the sitemap + `<head>` canonicals), so they
won't be rejected for a canonical mismatch.

---

## Batch 1 — EN guides, highest traffic intent (10)

```
https://www.ballenaandbeluga.com/en/guides/best-time-to-visit-istria
https://www.ballenaandbeluga.com/en/guides/truffle-hunting-near-svetvincenat
https://www.ballenaandbeluga.com/en/guides/istrian-wineries-near-svetvincenat
https://www.ballenaandbeluga.com/en/guides/beaches-near-svetvincenat
https://www.ballenaandbeluga.com/en/guides/olive-oil-tasting-near-svetvincenat
https://www.ballenaandbeluga.com/en/guides/restaurants-central-istria
https://www.ballenaandbeluga.com/en/guides/family-activities-central-istria
https://www.ballenaandbeluga.com/en/guides/day-trips-from-svetvincenat
https://www.ballenaandbeluga.com/en/guides/wedding-vendors-in-istria
https://www.ballenaandbeluga.com/en/guides/what-to-pack-for-istria
```

## Batch 2 — DE guides, highest traffic intent (10)

DE is the Pillar-3 growth market — give the German guide URLs their own direct nudge.

```
https://www.ballenaandbeluga.com/de/guides/best-time-to-visit-istria
https://www.ballenaandbeluga.com/de/guides/truffle-hunting-near-svetvincenat
https://www.ballenaandbeluga.com/de/guides/istrian-wineries-near-svetvincenat
https://www.ballenaandbeluga.com/de/guides/beaches-near-svetvincenat
https://www.ballenaandbeluga.com/de/guides/olive-oil-tasting-near-svetvincenat
https://www.ballenaandbeluga.com/de/guides/restaurants-central-istria
https://www.ballenaandbeluga.com/de/guides/family-activities-central-istria
https://www.ballenaandbeluga.com/de/guides/day-trips-from-svetvincenat
https://www.ballenaandbeluga.com/de/guides/wedding-vendors-in-istria
https://www.ballenaandbeluga.com/de/guides/what-to-pack-for-istria
```

## Batch 3 — remaining guides, EN + DE (8)

The more functional/utility guides — still worth indexing, lower priority.

```
https://www.ballenaandbeluga.com/en/guides/getting-here-from-pula-airport
https://www.ballenaandbeluga.com/de/guides/getting-here-from-pula-airport
https://www.ballenaandbeluga.com/en/guides/driving-to-istria-by-car
https://www.ballenaandbeluga.com/de/guides/driving-to-istria-by-car
https://www.ballenaandbeluga.com/en/guides/pool-and-sauna-season
https://www.ballenaandbeluga.com/de/guides/pool-and-sauna-season
https://www.ballenaandbeluga.com/en/guides/wedding-and-event-venue
https://www.ballenaandbeluga.com/de/guides/wedding-and-event-venue
```

---

## After

- IndexNow already pings Bing/Yandex on ship (covers ChatGPT/Copilot retrieval); this batch
  covers the Google side that IndexNow doesn't reach.
- **Check the next Monday GSC weekly report.** If indexed count climbs off 18 → the direct
  requests + new internal links are working. If it stalls after a week → confirms authority,
  not crawl discovery, is the wall, and the answer is the directory + outreach sprint.
- Re-run a `site:ballenaandbeluga.com/en/guides` check in ~2 weeks to confirm guides are
  surfacing.
