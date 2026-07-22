import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // AVIF first (~20-30% smaller than WebP for photographs). Browsers that
    // don't accept it fall through to WebP via the Accept header.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85],
  },
  async headers() {
    return [
      {
        // Security headers for all routes
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            // camera=(self) — the guest check-in scanner (/en|de/checkin)
            // uses getUserMedia; camera=() would block it browser-wide
            // before the permission prompt even appears.
            key: 'Permissions-Policy',
            value:
              'camera=(self), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // Cache images for 1 year
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Next.js static assets for 1 year
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // OG/Twitter cards are immutable per deploy and re-fetched by
        // Facebook/X/LinkedIn crawlers on every share — long-cache them.
        source: '/og/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Permanent (308) so Googlebot consolidates link equity from any
        // bare-domain external links (Booking/Airbnb directories, social
        // bios, business cards) onto the canonical /en path. next-intl's
        // own middleware would otherwise issue a 307 here, costing crawl
        // budget and blocking PageRank flow.
        source: '/',
        destination: '/en',
        permanent: true,
      },
      {
        // Locale-less deep paths (e.g. /weddings, /pricing,
        // /guides/wedding-and-event-venue) 404 because middleware.ts only
        // matches '/' and '/(de|en)/:path*' — next-intl never sees them, so
        // there is no locale fallback. Pre-migration external links and
        // Google's cache still point at these unprefixed URLs (4 surfaced as
        // "Not found (404)" in Search Console). Consolidate them onto the
        // canonical /en/* with a 308. The negative lookahead skips the locale
        // prefixes (no self-redirect loop) and anything Next serves from the
        // filesystem before redirects run: /_next, /api, and any path with a
        // file extension (favicon.ico, sitemap.xml, robots.txt, images, og).
        // /admin is a locale-less route (guest check-in dashboard) — without
        // the exclusion it would 308 to /en/admin and 404.
        source: '/:path((?!en$|en/|de$|de/|_next/|api/|admin$|admin/|.*\\.).*)',
        destination: '/en/:path',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
