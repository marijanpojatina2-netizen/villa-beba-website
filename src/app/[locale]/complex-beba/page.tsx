import { getBreadcrumbSchema } from '@/lib/schema';
import ComplexBebaPage from './ComplexBebaClient';

const baseUrl = 'https://www.villabeba.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';

  const title = isDE
    ? 'Complex BeBa · Beide Villen — 18 Gäste, 2 Pools'
    : 'Complex BeBa · Both Villas — 18 Guests, 2 Pools';
  const description = isDE
    ? 'Buchen Sie Villa Ballena & Villa Beluga zusammen als Complex BeBa. 700 m2, 8 Schlafzimmer, 2 Pools, Sauna & Spielzimmer in Istrien.'
    : 'Book Villa Ballena & Villa Beluga together as Complex BeBa. 700 sqm, 8 bedrooms, 2 pools, sauna & game room in Istria, Croatia.';

  return {
    title, description,
    keywords: isDE ? ['Complex BeBa', 'Grosses Ferienhaus Istrien', 'Gruppenunterkunft Kroatien'] : ['Complex BeBa', 'large holiday home Istria', 'group accommodation Croatia'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/og/complex-beba.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/complex-beba`, languages: { en: `${baseUrl}/en/complex-beba`, de: `${baseUrl}/de/complex-beba` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: 'Complex BeBa', url: `/${locale}/complex-beba` }]);
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><ComplexBebaPage /></>);
}
