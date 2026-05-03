import { getBreadcrumbSchema } from '@/lib/schema';
import WeddingsPage from './WeddingsClient';

const baseUrl = 'https://www.villabeba.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Hochzeit in Istrien | Hochzeitslocation Villa Ballena & Beluga' : 'Wedding in Istria | Wedding Venue Villa Ballena & Beluga';
  const description = isDE
    ? 'Heiraten Sie in Istrien: Luxusvillen mit privatem Pool, bis zu 60 Gaeste, Catering & Hochzeitsplanung in Svetvinčenat, Kroatien.'
    : 'Get married in Istria: luxury villas with private pool, up to 60 guests, catering & wedding planning in Svetvinčenat, Croatia.';
  return {
    title, description,
    keywords: isDE ? ['Hochzeit Istrien', 'Hochzeitslocation Kroatien', 'Villa Hochzeit'] : ['wedding Istria', 'wedding venue Croatia', 'villa wedding'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/images/beluga/beluga-33.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/weddings`, languages: { en: `${baseUrl}/en/weddings`, de: `${baseUrl}/de/weddings` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: isDE ? 'Hochzeiten' : 'Weddings', url: `/${locale}/weddings` }]);
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><WeddingsPage /></>);
}
