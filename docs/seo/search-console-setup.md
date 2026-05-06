# Google Search Console + Bing Webmaster Tools setup

Both consoles are mandatory before you can measure anything organic.
Google = ~92% of search traffic; Bing = the index ChatGPT/Copilot use.
Together they cover ~99% of meaningful organic discovery.

## Google Search Console (GSC) — manual steps

GSC has no automation we can do in code; this is a one-time human task.

### 1. Add the property

1. Go to https://search.google.com/search-console
2. Sign in with a Google account (recommend `marijanpojatina2@gmail.com`,
   the same one used for Google Business Profile — keeps GSC + GBP
   linked when both verified, which Google's local algorithm rewards).
3. Add property → choose **Domain** (not URL prefix). This covers all
   subdomains and protocol variants from one verification.
4. Property: `ballenaandbeluga.com`

### 2. Verify ownership via DNS TXT

Google will give you a TXT record like:
```
google-site-verification=abcdef123456...
```

Add it as a TXT record on the **root** of `ballenaandbeluga.com` in
Cloudflare DNS (the same DNS used for Email Routing per
[project_email_infrastructure.md](../../../.claude memory)):

- Type: `TXT`
- Name: `@` (or leave blank for root)
- Content: `google-site-verification=...`
- TTL: Auto

Wait 1–10 minutes for propagation, then click "Verify" in GSC.

### 3. Submit sitemap

After verification:
1. Sidebar → Sitemaps
2. Add a new sitemap → enter `sitemap.xml`
3. Submit → status should flip to "Success" within minutes

### 4. Request indexing for top pages (one-time)

For the 5–10 most important URLs, manually request indexing to skip the
Google sandbox waiting time:

1. URL Inspection (top search bar) → paste URL
2. Click "Request indexing"
3. Repeat for each URL

Top-priority URLs:
- `https://www.ballenaandbeluga.com/en`
- `https://www.ballenaandbeluga.com/de`
- `https://www.ballenaandbeluga.com/en/villa-ballena`
- `https://www.ballenaandbeluga.com/de/villa-ballena`
- `https://www.ballenaandbeluga.com/en/villa-beluga`
- `https://www.ballenaandbeluga.com/de/villa-beluga`
- `https://www.ballenaandbeluga.com/en/complex-beba`
- `https://www.ballenaandbeluga.com/en/weddings`
- `https://www.ballenaandbeluga.com/en/pricing`
- `https://www.ballenaandbeluga.com/en/contact`

Limit: ~10 indexing requests per day per property.

### 5. (Optional) GSC API for ranking automation

If you want a VM cron that pulls ranking/impression data weekly:
1. Cloud Console → enable "Search Console API"
2. Create OAuth credentials → download JSON
3. Use `googleapis` npm package or `gcloud` CLI to fetch performance data
4. Pipeline output to a spreadsheet or local DB for trend tracking

This is heavier than current needs warrant — the GSC dashboard itself is
fine for the first 3–6 months. Add the API only when you want
diff-against-last-week reports.

## Bing Webmaster Tools (BWT)

See [indexnow-setup.md](./indexnow-setup.md) — Bing uses the IndexNow key
file for verification, so it's a 30-second click-through after the
IndexNow setup is live.

## Daily / weekly checks (after both verified)

- **GSC**: check "Pages" report once a week — flag any URL stuck on
  "Discovered – currently not indexed" for > 4 weeks; usually means
  thin content or duplicate. (After our soft-404 fix, the 6 fantom blog
  slugs should drop from this report within ~2 weeks.)
- **GSC Performance**: weekly snapshot of impressions/clicks/CTR per
  query — earliest leading indicator that a page is starting to surface.
- **BWT**: similar dashboards. The IndexNow History tab is the only
  Bing-specific actionable view — tells you if our pings are landing.

## Cross-references

- IndexNow setup: [indexnow-setup.md](./indexnow-setup.md)
- Backlink outreach: [backlink-outreach-plan.md](./backlink-outreach-plan.md)
- Wikipedia draft: [wikipedia-draft.md](./wikipedia-draft.md)
