# GSC "Request Indexing" batch — 2026-06-16

> **Goal:** manually force-feed Google the highest-value URLs that are currently
> "unknown to Google" (per GSC weekly #11, 18/66 indexed). This is a **stopgap**, not the
> fix — Request Indexing pushes a URL into Google's priority crawl queue, it doesn't
> guarantee indexing. The durable fix is referring domains (see
> [`directory-submission-pack.md`](directory-submission-pack.md)). But it's free, ~15 min,
> and directly attacks the "unknown" state while authority builds.

## How

1. Open Google Search Console → property `sc-domain:ballenaandbeluga.com`.
2. Paste a full URL (below) into the **URL Inspection** bar at the top.
3. Click **Request Indexing**. Wait for the test, confirm.
4. Repeat. There's a soft quota of **~10–12 URLs/day** — that's why this is split into two
   batches. Do Batch 1 today, Batch 2 tomorrow.

## What's NOT here (and why)

- **Villa pages & EN funnel are already indexed** — `/en` + `/de` homepages,
  `/en/villa-ballena`, `/de/villa-ballena`, both `villa-beluga`, `/en/complex-beba`,
  `/en/weddings`, `/en/pricing`, `/en/contact` aren't in the "unknown" list. Don't spend
  quota re-requesting indexed URLs.
- **Skip legal/thin pages entirely:** `/{en,de}/impressum`, `/{en,de}/terms`,
  `/{en,de}/privacy`. No SEO value (impressum is even `follow:false`), pure quota waste.

---

## Batch 1 — today (10 URLs)

**The 4 content hubs first.** Requesting a hub is the highest-leverage move: when Googlebot
crawls `/guides` or `/blog` it follows the internal links and *discovers* all ~30 child
guide/blog URLs that are currently unknown — one request seeds many. Then the 6 highest-value
German funnel pages (the DE villa pages are already indexed, so completing their funnel is
quick ROI, and DE is the Pillar-3 growth market).

```
https://www.ballenaandbeluga.com/en/guides
https://www.ballenaandbeluga.com/de/guides
https://www.ballenaandbeluga.com/en/blog
https://www.ballenaandbeluga.com/de/blog
https://www.ballenaandbeluga.com/de/complex-beba
https://www.ballenaandbeluga.com/de/pricing
https://www.ballenaandbeluga.com/de/weddings
https://www.ballenaandbeluga.com/de/experiences
https://www.ballenaandbeluga.com/de/contact
https://www.ballenaandbeluga.com/de/gallery
```

## Batch 2 — tomorrow (10 URLs)

Remaining funnel/secondary pages, plus a direct nudge to the two strongest individual content
pieces (in case the hub crawl is slow to reach them).

```
https://www.ballenaandbeluga.com/de/corporate-retreats
https://www.ballenaandbeluga.com/en/experiences
https://www.ballenaandbeluga.com/en/gallery
https://www.ballenaandbeluga.com/en/corporate-retreats
https://www.ballenaandbeluga.com/en/about
https://www.ballenaandbeluga.com/de/about
https://www.ballenaandbeluga.com/en/faq
https://www.ballenaandbeluga.com/de/faq
https://www.ballenaandbeluga.com/en/blog/istrian-food-guide-truffles-olive-oil-wine
https://www.ballenaandbeluga.com/en/guides/wedding-vendors-in-istria
```

---

## After

- These are the canonical `www` URLs (matching the sitemap + `<head>` canonicals), so the
  request won't be rejected for a canonical mismatch.
- **Check next Monday's GSC weekly report** — if the indexed count moves off 18, Request
  Indexing is helping; if it doesn't budge after a week, that confirms the diagnosis that
  **authority, not crawling, is the wall** — Google found the URLs but won't *keep* a DA-1
  domain's pages indexed. Either way the answer is the directory + outreach sprint.
- IndexNow already pings Bing/Yandex on ship; this covers the Google side that IndexNow
  doesn't reach.
