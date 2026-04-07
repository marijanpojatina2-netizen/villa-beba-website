import { getBreadcrumbSchema } from '@/lib/schema';
import CorporateRetreatsPage from './CorporateRetreatsClient';

const baseUrl = 'https://www.villabeba.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Firmenretreat in Istrien | Team-Offsite Villa Ballena & Beluga' : 'Corporate Retreat in Istria | Team Offsite Villa Ballena & Beluga';
  const description = isDE
    ? 'Firmenretreat in Kroatien: 2 Luxusvillen, 18 Gaeste, High-Speed WiFi, Teambuilding-Aktivitaeten in Svetvincenat, Istrien.'
    : 'Corporate retreat in Croatia: 2 luxury villas, 18 guests, high-speed WiFi, team-building activities in Svetvincenat, Istria.';
  return {
    title, description,
    keywords: isDE ? ['Firmenretreat Kroatien', 'Team-Offsite Istrien', 'Corporate Villa'] : ['corporate retreat Croatia', 'team offsite Istria', 'corporate villa'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/images/ballena/ballena-33.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/corporate-retreats`, languages: { en: `${baseUrl}/en/corporate-retreats`, de: `${baseUrl}/de/corporate-retreats` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: isDE ? 'Firmenretreats' : 'Corporate Retreats', url: `/${locale}/corporate-retreats` }]);
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><CorporateRetreatsPage /></>);
}
