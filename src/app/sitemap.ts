import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides';
import { blogPosts } from '@/lib/blog';

const BASE_URL = 'https://www.ballenaandbeluga.com';

// --- Freshness -------------------------------------------------------------
// Per-route lastModified from two sources:
//  - Content hubs ('', '/blog', '/guides') derive from the newest guide/blog
//    date, so shipping content automatically tells Google the hub changed.
//  - Static routes carry the date of their last meaningful edit. Bump a
//    route's date when you genuinely change that page — never in bulk: a
//    shared "everything changed today" date dilutes the freshness signal
//    across the site (that's why the old LAST_UPDATED constant is gone).
const latest = (dates: string[]) =>
  dates.reduce((max, d) => (d > max ? d : max), '1970-01-01');

const NEWEST_GUIDE = latest(guides.map(g => g.dateModified ?? g.datePublished));
const NEWEST_POST = latest(blogPosts.map(p => p.date));
const NEWEST_CONTENT = NEWEST_GUIDE > NEWEST_POST ? NEWEST_GUIDE : NEWEST_POST;

const ROUTE_UPDATED: Record<string, string> = {
  '': NEWEST_CONTENT, // home previews the latest guides/journal entries
  '/villa-ballena': '2026-06-10', // descriptive gallery alts + listing sameAs
  '/villa-beluga': '2026-06-10',
  '/complex-beba': '2026-05-19',
  '/experiences': '2026-05-04',
  '/weddings': '2026-05-15',
  '/corporate-retreats': '2026-05-15',
  '/winter-workation': '2026-07-28', // new landing page (digital nomads, Nov-Apr)
  '/pricing': '2026-05-15',
  '/gallery': '2026-06-10', // descriptive alt text on all images
  '/blog': NEWEST_POST,
  '/contact': '2026-05-15',
  '/faq': '2026-06-10', // FAQPage JSON-LD now localized per language
  '/about': '2026-05-15',
  '/privacy': '2026-05-04',
  '/terms': '2026-05-04',
  '/impressum': '2026-05-05',
  '/guides': NEWEST_GUIDE,
};

// x-default mirrors the <head> hreflang declarations: /en everywhere except
// the impressum, which deliberately defaults to /de (its primary audience is
// German-speaking jurisdictions — TMG § 5). Keep sitemap and <head> in sync.
const alternatesFor = (route: string) => ({
  languages: {
    en: `${BASE_URL}/en${route}`,
    de: `${BASE_URL}/de${route}`,
    'x-default':
      route === '/impressum' ? `${BASE_URL}/de${route}` : `${BASE_URL}/en${route}`,
  },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'de'];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const [route, updated] of Object.entries(ROUTE_UPDATED)) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(updated),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route.includes('villa') ? 0.9 : 0.7,
        alternates: alternatesFor(route),
      });
    }

    for (const post of blogPosts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: alternatesFor(`/blog/${post.slug}`),
      });
    }

    for (const guide of guides) {
      entries.push({
        url: `${BASE_URL}/${locale}/guides/${guide.slug}`,
        lastModified: new Date(guide.dateModified ?? guide.datePublished),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: alternatesFor(`/guides/${guide.slug}`),
      });
    }
  }

  return entries;
}
