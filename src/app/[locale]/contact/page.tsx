import { getBreadcrumbSchema } from '@/lib/schema';
import ContactPage from './ContactClient';

const baseUrl = 'https://www.ballenaandbeluga.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Kontakt · Buchen Sie direkt in Istrien' : 'Contact · Book Direct in Istria';
  const description = isDE
    ? 'Kontaktieren Sie uns fuer Buchungen und Anfragen. Villa Ballena & Villa Beluga in Svetvinčenat, Istrien. Telefon, E-Mail oder WhatsApp.'
    : 'Contact us for bookings and inquiries. Villa Ballena & Villa Beluga in Svetvinčenat, Istria. Phone, email or WhatsApp.';
  return {
    title, description,
    keywords: isDE ? ['Kontakt Villa Istrien', 'Buchung Villa Kroatien'] : ['contact villa Istria', 'book villa Croatia'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/og/contact.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/contact`, languages: { en: `${baseUrl}/en/contact`, de: `${baseUrl}/de/contact` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: isDE ? 'Kontakt' : 'Contact', url: `/${locale}/contact` }]);
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><ContactPage /></>);
}
