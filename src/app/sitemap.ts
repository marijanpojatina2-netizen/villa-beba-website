import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.villabeba.com';

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
        lastModified: new Date(),
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
        lastModified: new Date(),
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
