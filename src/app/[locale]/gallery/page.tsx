import { getBreadcrumbSchema } from '@/lib/schema';
import GalleryPage from './GalleryClient';

const baseUrl = 'https://www.villabeba.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Fotogalerie · Villen, Pools & Innenräume' : 'Photo Gallery · Villas, Pools & Interiors';
  const description = isDE
    ? 'Bildergalerie von Villa Ballena & Villa Beluga — Pools, Innenraeume, Schlafzimmer und Aussenansichten unserer Luxusvillen in Istrien.'
    : 'Photo gallery of Villa Ballena & Villa Beluga — pools, interiors, bedrooms, and exteriors of our luxury villas in Istria.';
  return {
    title, description,
    keywords: isDE ? ['Galerie Villa Istrien', 'Fotos Luxusvilla Kroatien'] : ['gallery villa Istria', 'luxury villa photos Croatia'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/images/beluga/img_4910.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/gallery`, languages: { en: `${baseUrl}/en/gallery`, de: `${baseUrl}/de/gallery` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: isDE ? 'Galerie' : 'Gallery', url: `/${locale}/gallery` }]);
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><GalleryPage /></>);
}
