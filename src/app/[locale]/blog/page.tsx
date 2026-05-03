import { getBreadcrumbSchema } from '@/lib/schema';
import BlogPage from './BlogClient';

const baseUrl = 'https://www.villabeba.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Journal | Istrien Reisetipps & Erlebnisse' : 'Journal | Istria Travel Tips & Experiences';
  const description = isDE
    ? 'Reisetipps, lokale Erlebnisse und Reisefuehrer fuer Istrien — vom Team hinter Villa Ballena & Villa Beluga in Svetvinčenat.'
    : 'Travel tips, local experiences, and guides to Istria — from the team behind Villa Ballena & Villa Beluga in Svetvinčenat.';
  return {
    title, description,
    keywords: isDE ? ['Istrien Blog', 'Reisetipps Kroatien', 'Istrien Reisefuehrer'] : ['Istria blog', 'Croatia travel tips', 'Istria travel guide'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/images/beluga/beluga-42.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/blog`, languages: { en: `${baseUrl}/en/blog`, de: `${baseUrl}/de/blog` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: 'Journal', url: `/${locale}/blog` }]);
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><BlogPage /></>);
}
