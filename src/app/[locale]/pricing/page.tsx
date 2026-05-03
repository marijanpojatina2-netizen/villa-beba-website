import { getBreadcrumbSchema } from '@/lib/schema';
import PricingPage from './PricingClient';

const baseUrl = 'https://www.villabeba.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Preise & Verfügbarkeit 2026 · Ab 600 €/Nacht' : 'Pricing & Availability 2026 · From €600/Night';
  const description = isDE
    ? 'Transparente Preise fuer Villa Ballena & Villa Beluga in Istrien. Standard-, Hochzeits- und Firmentarife ab 600 Euro/Nacht.'
    : 'Transparent pricing for Villa Ballena & Villa Beluga in Istria. Standard, wedding, and corporate rates from 600 Euro/night.';
  return {
    title, description,
    keywords: isDE ? ['Preise Villa Istrien', 'Ferienhaus Preise Kroatien'] : ['villa pricing Istria', 'holiday home rates Croatia'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/og/pricing.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/pricing`, languages: { en: `${baseUrl}/en/pricing`, de: `${baseUrl}/de/pricing` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: isDE ? 'Preise' : 'Pricing', url: `/${locale}/pricing` }]);
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><PricingPage /></>);
}
