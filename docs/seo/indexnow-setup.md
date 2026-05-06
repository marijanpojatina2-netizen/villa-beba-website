# IndexNow setup

Tells Bing/Yandex/Seznam/Naver about new or updated URLs **within minutes**
instead of waiting for their crawler to find them. ChatGPT and Microsoft
Copilot pull from Bing's index, so a successful IndexNow ping → ChatGPT
can recommend the URL **same day** rather than 4–6 weeks later.

**Google does not support IndexNow.** For Google, see
[search-console-setup.md](./search-console-setup.md).

## What's already in place

- Key file: `public/919d0a030b15698d7abec3f08916fdd4.txt`
  - Served at `https://www.ballenaandbeluga.com/919d0a030b15698d7abec3f08916fdd4.txt`
  - Content: the key (32 hex chars) — required for IndexNow validation
- Script: `scripts/indexnow.mjs` (zero dependencies, uses Node 18+ fetch)
- npm scripts:
  - `npm run indexnow:bulk` — submit every URL in sitemap.xml
  - `npm run indexnow -- /en/blog/foo /de/blog/foo` — submit specific URLs

## When to ping

- **After every production deploy that adds or changes content.** Don't ping
  on every code change — IndexNow throttles repeat-pings of the same URL
  and you'll waste rate limit on cosmetic edits.
- **Initial submission**: run `npm run indexnow:bulk` once after the first
  go-live to seed Bing with everything.
- **New blog post / guide**: `npm run indexnow -- /en/blog/<slug> /de/blog/<slug>`
- **Updated existing page (real content change, not just typo)**: same
  pattern — ping the EN and DE variants together.

## Verify on Bing Webmaster Tools

Bing accepts the IndexNow key file as a verification method, so the same
file does double duty:

1. Go to https://www.bing.com/webmasters
2. Sign in with a Microsoft account (you can create one on the spot)
3. Add site → enter `https://www.ballenaandbeluga.com`
4. Choose verification method: **IndexNow API key**
5. Bing will fetch `https://www.ballenaandbeluga.com/919d0a030b15698d7abec3f08916fdd4.txt`
   and verify the contents match. Should be instant.
6. Submit sitemap: `https://www.ballenaandbeluga.com/sitemap.xml`

After verification, Bing Webmaster Tools also exposes:
- Indexed pages count
- Search performance (clicks, impressions)
- Crawl errors
- IndexNow submission history (useful sanity check)

## Yandex Webmaster Tools (optional, only if you target Russian visitors)

Same key works. https://webmaster.yandex.com → Add site → IndexNow key
verification → submit sitemap.

## Rate limits & gotchas

- **10,000 URLs per single API call** — well above our ~57 routes.
- **Don't ping the same URL > ~10 times/day** — IndexNow may temporarily
  reject if you do. Our deploy cadence won't trip this.
- **Key MUST be deployed before first ping.** If you change the KEY
  constant in `scripts/indexnow.mjs` without also deploying a matching
  `public/<new-key>.txt`, every ping returns 403.
- **422 = host mismatch.** All URLs in a single submission must share the
  same host (the script normalises path-only args to `www.ballenaandbeluga.com`).
- **Git Bash on Windows path-mangles `/...` arguments** into Windows paths
  (e.g. `/en/...` becomes `C:/Program Files/Git/en/...`). The script
  detects and strips this prefix automatically. If you see the mangled
  URLs printed in the submission output, your Git Bash MSYS install is
  in a non-default location — update the regex in scripts/indexnow.mjs
  or always pass full `https://...` URLs from PowerShell instead.

## Possible automation (future)

- Vercel Deploy Hook + serverless function that runs `indexnow:bulk`
  after each successful production deploy. Skipped for now: the manual
  step is < 5 sec and mistaken pings on rolled-back deploys cost nothing
  but are noise.
- VM cron: weekly `indexnow:bulk` as a low-cost re-ping in case Bing
  drops indexing on inactive URLs. Optional.
