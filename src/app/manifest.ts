import type { MetadataRoute } from 'next';

// PWA web app manifest — emitted at /manifest.webmanifest by Next.js.
//
// ICON FILES REQUIRED:
//   public/icons/icon-192.png   (192×192, 'any' purpose)
//   public/icons/icon-512.png   (512×512, 'any' purpose)
//   public/icons/maskable-512.png (512×512, 'maskable' — safe-zone padded)
//
// Generate via realfavicongenerator.net from a 1024×1024 source PNG with
// transparent background, then drop the three files into public/icons/.
// Until the files exist, Add-to-Homescreen falls back to the favicon
// (pixelated but functional).

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Villa Ballena & Villa Beluga',
    short_name: 'Villa BeBa',
    description:
      'Two designer luxury villas in Svetvinčenat, Istria — heated pool, sauna, and Mediterranean elegance.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#0D0D1A',
    theme_color: '#C9A96E',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
