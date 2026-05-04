import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Villa Ballena & Villa Beluga',
    short_name: 'Villa Beba',
    description:
      'Luxury villas in Istria, Croatia — private pools, sauna, designer interiors',
    start_url: '/en',
    display: 'standalone',
    background_color: '#F5F0E8',
    theme_color: '#1B2A4A',
    // PWA-install icons. Next.js auto-emits the favicon and apple-touch-icon
    // <link> tags from src/app/icon.png and src/app/apple-icon.png — these
    // entries are for Android/Chromium PWA install + maskable rendering.
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
