# Vercel domain redirect — apex → www → /en

## Problem

Mobile PageSpeed Insights flagged "Avoid multiple page redirects — 2.43 s saved". When a user (or Googlebot) types `ballenaandbeluga.com` they currently traverse:

1. `http://ballenaandbeluga.com/` → `https://ballenaandbeluga.com/` (HTTPS upgrade, ~50–200 ms)
2. `https://ballenaandbeluga.com/` → `https://www.ballenaandbeluga.com/` (Vercel apex→www, ~700 ms TLS handshake new origin)
3. `https://www.ballenaandbeluga.com/` → `/en` (next.config.ts permanent redirect, ~50 ms)

Total: 2.43 s on slow mobile networks. Steps 1 and 3 are unavoidable / cheap. **Step 2 is the win.**

## Fix (Vercel dashboard — outside this repo)

1. Open https://vercel.com/dashboard → villa-beba project → **Settings → Domains**
2. Add `ballenaandbeluga.com` (apex) if not already present
3. Click the **⋯** menu next to `ballenaandbeluga.com` → **Edit**
4. Set the redirect to **No redirect** (i.e. apex serves directly)
5. Click the **⋯** menu next to `www.ballenaandbeluga.com` → **Edit**
6. Set redirect: `Redirect to ballenaandbeluga.com` (308 permanent)
7. After a few minutes the CDN flips. Apex now serves directly; www becomes the redirect target.

Then in this repo:

8. Search-and-replace `www.ballenaandbeluga.com` → `ballenaandbeluga.com` across:
   - `src/app/[locale]/layout.tsx` (`metadataBase`, `alternates.languages`)
   - `src/app/[locale]/page.tsx` (`baseUrl`, `alternates`)
   - Every other `page.tsx` with `alternates.canonical`
   - `src/app/sitemap.ts` (`BASE_URL`)
   - `src/app/robots.ts` (`sitemap`)
   - `src/lib/schema.ts` (`BASE_URL`)
   - `public/llms.txt`
9. Re-deploy. Submit updated sitemap to Google Search Console.

## Re-test

After the dashboard change + redeploy, re-run https://seoptimizer.com/ on `ballenaandbeluga.com`. The "Avoid multiple page redirects" item should drop from 2.43 s to ≤0.3 s and Mobile PSI should jump 8–12 points.

## Why we're keeping www today

Memory note dated 2026-05-04: production was migrated to ballenaandbeluga.com with WWW kept as the canonical brand URL because the GBP listings, Booking.com pre-fill forms, and printed marketing materials all reference `www.`. Switching to apex requires re-aligning those touchpoints — defer until after GBP postcard verification is complete (~2026-05-15).
