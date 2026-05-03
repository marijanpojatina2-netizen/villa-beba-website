import { getBreadcrumbSchema } from '@/lib/schema';
import AboutPage from './AboutClient';

const baseUrl = 'https://www.villabeba.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Über uns · Unsere Geschichte in Istrien' : 'About Us · Our Story in Istria';
  const description = isDE
    ? 'Erfahren Sie die Geschichte und Philosophie hinter Villa Ballena & Villa Beluga in Svetvinčenat, Istrien, Kroatien.'
    : 'Discover the story and philosophy behind Villa Ballena & Villa Beluga in Svetvinčenat, Istria, Croatia.';
  return {
    title, description,
    keywords: isDE ? ['Ueber uns Villa Istrien', 'Geschichte Villa Kroatien'] : ['about villa Istria', 'villa story Croatia'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/images/beluga/beluga-14.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/about`, languages: { en: `${baseUrl}/en/about`, de: `${baseUrl}/de/about` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: isDE ? 'Ueber uns' : 'About', url: `/${locale}/about` }]);
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><AboutPage /></>);
}
