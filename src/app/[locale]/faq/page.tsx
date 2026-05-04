import { getBreadcrumbSchema, getFAQSchema } from '@/lib/schema';
import { faqItems } from '@/lib/data';
import FAQPage from './FaqClient';

const baseUrl = 'https://www.ballenaandbeluga.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'FAQ · Häufige Fragen zur Buchung' : 'FAQ · Frequently Asked Questions';
  const description = isDE
    ? 'Antworten auf haeufige Fragen zu Villa Ballena & Villa Beluga: Check-in, Haustiere, Pool, Ausstattung und mehr.'
    : 'Answers to frequently asked questions about Villa Ballena & Villa Beluga: check-in, pets, pool, amenities and more.';
  return {
    title, description,
    keywords: isDE ? ['FAQ Villa Istrien', 'Fragen Ferienhaus Kroatien'] : ['FAQ villa Istria', 'questions holiday home Croatia'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/og/faq.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/faq`, languages: { en: `${baseUrl}/en/faq`, de: `${baseUrl}/de/faq` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: 'FAQ', url: `/${locale}/faq` }]);
  const faqSchema = getFAQSchema(faqItems);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <FAQPage />
    </>
  );
}
