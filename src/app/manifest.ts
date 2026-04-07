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
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  };
}
