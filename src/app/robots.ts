import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/admin', '/en/checkin/', '/de/checkin/'],
    },
    sitemap: 'https://www.ballenaandbeluga.com/sitemap.xml',
  };
}
