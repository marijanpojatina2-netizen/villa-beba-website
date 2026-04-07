import { getVacationRentalSchema, getBreadcrumbSchema } from '@/lib/schema';
import VillaBallenaPage from './VillaBallenaClient';

const baseUrl = 'https://www.villabeba.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isDE = locale === 'de';

  const title = isDE
    ? 'Villa Ballena | Wellness-Villa mit Sauna & Pool in Istrien'
    : 'Villa Ballena | Wellness Villa with Sauna & Pool in Istria';
  const description = isDE
    ? 'Villa Ballena — 350 m2 Designervilla mit privater Sauna, beheiztem Biopool und 4 Schlafzimmern in Svetvincenat, Istrien. Ab 600 Euro/Nacht.'
    : 'Villa Ballena — 350 sqm designer villa with private sauna, heated biological pool & 4 en-suite bedrooms in Svetvincenat, Istria. From 600 Euro/night.';

  return {
    title,
    description,
    keywords: isDE
      ? ['Villa Ballena', 'Wellnessvilla Istrien', 'Sauna Villa Kroatien', 'Luxusvilla Svetvincenat']
      : ['Villa Ballena', 'wellness villa Istria', 'sauna villa Croatia', 'luxury villa Svetvincenat'],
    openGraph: {
      title,
      description,
      images: [{ url: `${baseUrl}/images/ballena/ballena-42.jpg`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: {
      canonical: `${baseUrl}/${locale}/villa-ballena`,
      languages: { en: `${baseUrl}/en/villa-ballena`, de: `${baseUrl}/de/villa-ballena` },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isDE = locale === 'de';

  const vacationRental = getVacationRentalSchema('ballena');
  const breadcrumb = getBreadcrumbSchema([
    { name: isDE ? 'Startseite' : 'Home', url: `/${locale}` },
    { name: 'Villa Ballena', url: `/${locale}/villa-ballena` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vacationRental) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <VillaBallenaPage />
    </>
  );
}
