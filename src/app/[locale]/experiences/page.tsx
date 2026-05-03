import { getBreadcrumbSchema } from '@/lib/schema';
import ExperiencesPage from './ExperiencesClient';

const baseUrl = 'https://www.villabeba.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Erlebnisse in Istrien · Wein, Trüffel, Ausflüge' : 'Istrian Experiences · Wine, Truffles, Day Trips';
  const description = isDE
    ? 'Entdecken Sie die besten Erlebnisse in Istrien: Weinverkostungen, Trüffeljagd, Rovinj-Ausflüge und mehr — arrangiert von Villa Ballena & Beluga.'
    : 'Discover the best Istrian experiences: wine tastings, truffle hunting, Rovinj day trips and more — arranged by Villa Ballena & Beluga.';
  return {
    title, description,
    keywords: isDE ? ['Erlebnisse Istrien', 'Weinverkostung Kroatien', 'Trüffeljagd Istrien'] : ['Istria experiences', 'wine tasting Croatia', 'truffle hunting Istria'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/og/experiences.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/experiences`, languages: { en: `${baseUrl}/en/experiences`, de: `${baseUrl}/de/experiences` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: isDE ? 'Erlebnisse' : 'Experiences', url: `/${locale}/experiences` }]);
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><ExperiencesPage /></>);
}
