import { getBreadcrumbSchema } from '@/lib/schema';
import WorkationClient from './WorkationClient';

const baseUrl = 'https://www.ballenaandbeluga.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE
    ? 'Winter-Workation Istrien · Villa mit Starlink 250+ Mbit/s'
    : 'Winter Workation Istria · Villa with Starlink 250+ Mbps';
  const description = isDE
    ? 'Monatsaufenthalte Nov–Apr für digitale Nomaden: Luxusvilla in Istrien mit Starlink 250+ Mbit/s, beheiztem Pool, Sauna & Tennisplatz. Ab 5.500 €/Monat.'
    : 'Monthly stays Nov–Apr for digital nomads: luxury Istria villa with Starlink 250+ Mbps, heated pool, sauna & tennis court. From €5,500/month.';
  return {
    title,
    description,
    keywords: isDE
      ? ['Workation Istrien', 'digitale Nomaden Kroatien', 'Langzeitmiete Villa Istrien', 'Remote Work Kroatien']
      : ['workation Istria', 'digital nomad Croatia', 'monthly villa rental Istria', 'remote work Croatia winter'],
    openGraph: {
      title,
      description,
      images: [{ url: `${baseUrl}/og/home.jpg`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: {
      canonical: `${baseUrl}/${locale}/winter-workation`,
      languages: {
        en: `${baseUrl}/en/winter-workation`,
        de: `${baseUrl}/de/winter-workation`,
        'x-default': `${baseUrl}/en/winter-workation`,
      },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([
    { name: isDE ? 'Startseite' : 'Home', url: `/${locale}` },
    { name: isDE ? 'Winter-Workation' : 'Winter Workation', url: `/${locale}/winter-workation` },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <WorkationClient />
    </>
  );
}
