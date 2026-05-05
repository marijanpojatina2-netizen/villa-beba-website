import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides';
import { blogPosts } from '@/lib/blog';

const BASE_URL = 'https://www.ballenaandbeluga.com';

// Bump this when significant site content changes. Per-route dates would
// be better, but using new Date() per entry tells Google "everything
// changed just now" which dilutes the freshness signal across the site.
const LAST_UPDATED = new Date('2026-05-05');

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
  '/privacy',
  '/terms',
  '/impressum',
  '/guides',
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

    for (const post of blogPosts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/blog/${post.slug}`,
            de: `${BASE_URL}/de/blog/${post.slug}`,
          },
        },
      });
    }

    for (const guide of guides) {
      entries.push({
        url: `${BASE_URL}/${locale}/guides/${guide.slug}`,
        lastModified: new Date(guide.dateModified ?? guide.datePublished),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/guides/${guide.slug}`,
            de: `${BASE_URL}/de/guides/${guide.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
