import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  // Stop next-intl from writing the `NEXT_LOCALE` cookie on every response —
  // the cookie was making Vercel's edge mark every HTML response private and
  // skip the CDN cache (X-Vercel-Cache: MISS site-wide). Locale is still
  // resolved from the URL path, which is the only signal Googlebot uses
  // anyway. Trade-off: bare-domain visitors no longer get auto-detected
  // browser language, but the permanent / → /en redirect in next.config.ts
  // already routes them to the EN default.
  localeDetection: false,
});
