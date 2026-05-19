import { getBreadcrumbSchema } from '@/lib/schema';
import { getTranslations } from 'next-intl/server';
import JsonLd from '@/components/JsonLd';
import ComplexBebaPage from './ComplexBebaClient';

const baseUrl = 'https://www.ballenaandbeluga.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';

  const title = isDE
    ? 'Großes Ferienhaus Istrien für 18 Personen · Complex BeBa'
    : 'Large Villa in Istria for up to 18 Guests · Complex BeBa';
  const description = isDE
    ? 'Complex BeBa — Villa Ballena & Villa Beluga zusammen gebucht: 8 Schlafzimmer, 2 beheizte Pools, 700 m² für Mehrgenerationenurlaub, Familientreffen und große Gruppen in Svetvinčenat, Istrien.'
    : 'Complex BeBa — Villa Ballena & Villa Beluga booked together: 8 bedrooms, 2 heated pools, 700 sqm for multi-generational holidays, family reunions and large groups in Svetvinčenat, Istria.';

  return {
    title, description,
    keywords: isDE
      ? ['Großes Ferienhaus Istrien', 'Mehrgenerationenurlaub Kroatien', 'Ferienhaus große Gruppe Istrien', 'Gruppenunterkunft Kroatien']
      : ['large villa Istria', 'multi-generational villa Croatia', 'large group accommodation Istria', 'big holiday house Istria'],
    openGraph: { title, description, images: [{ url: `${baseUrl}/og/complex-beba.jpg`, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: { canonical: `${baseUrl}/${locale}/complex-beba`, languages: { en: `${baseUrl}/en/complex-beba`, de: `${baseUrl}/de/complex-beba`, 'x-default': `${baseUrl}/en/complex-beba` } },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const t = await getTranslations({ locale, namespace: 'complex' });
  const breadcrumb = getBreadcrumbSchema([{ name: isDE ? 'Startseite' : 'Home', url: `/${locale}` }, { name: 'Complex BeBa', url: `/${locale}/complex-beba` }]);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: t('faqQ1'), acceptedAnswer: { '@type': 'Answer', text: t('faqA1') } },
      { '@type': 'Question', name: t('faqQ2'), acceptedAnswer: { '@type': 'Answer', text: t('faqA2') } },
      { '@type': 'Question', name: t('faqQ3'), acceptedAnswer: { '@type': 'Answer', text: t('faqA3') } },
      { '@type': 'Question', name: t('faqQ4'), acceptedAnswer: { '@type': 'Answer', text: t('faqA4') } },
      { '@type': 'Question', name: t('faqQ5'), acceptedAnswer: { '@type': 'Answer', text: t('faqA5') } },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><JsonLd data={faqSchema} /><ComplexBebaPage /></>);
}
