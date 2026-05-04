import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.ballenaandbeluga.com';

// Bump this when significant site content changes. Per-route dates would
// be better, but using new Date() per entry tells Google "everything
// changed just now" which dilutes the freshness signal across the site.
const LAST_UPDATED = new Date('2026-05-03');

const routes = [
  '',
  '/villa-ballena',
  '/villa-beluga',
  '/complex-beba',
  '/experiences',
  '/weddings',
  '/corporate-retreats',
  '/pricing',
  '/gallery',
  '/blog',
  '/contact',
  '/faq',
  '/about',
];

const blogSlugs = [
  'truffle-season-in-istria',
  'rovinj-gem-of-adriatic',
  'best-beaches-near-svetvincenat',
  'istrian-wine-journey',
  'planning-perfect-istrian-wedding',
  'family-friendly-activities-central-istria',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'de'];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: LAST_UPDATED,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route.includes('villa') ? 0.9 : 0.7,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${route}`,
            de: `${BASE_URL}/de${route}`,
          },
        },
      });
    }

    for (const slug of blogSlugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${slug}`,
        lastModified: LAST_UPDATED,
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/blog/${slug}`,
            de: `${BASE_URL}/de/blog/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
