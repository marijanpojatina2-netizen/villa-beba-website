import { getVacationRentalSchema, getBreadcrumbSchema } from '@/lib/schema';
import VillaBelugaPage from './VillaBelugaClient';

const baseUrl = 'https://www.ballenaandbeluga.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isDE = locale === 'de';

  const title = isDE
    ? 'Villa Beluga · Familienvilla mit Spielzimmer in Istrien'
    : 'Villa Beluga · Family Villa with Game Room in Istria';
  const description = isDE
    ? 'Villa Beluga — 350 m2 Designervilla mit Spielzimmer, Glasveranda, beheiztem Pool und 4 Schlafzimmern in Svetvinčenat, Istrien. Ab 600 Euro/Nacht.'
    : 'Villa Beluga — 350 sqm designer villa with game room, glass terrace, heated pool & 4 en-suite bedrooms in Svetvinčenat, Istria. From 600 Euro/night.';

  return {
    title,
    description,
    keywords: isDE
      ? ['Villa Beluga', 'Ferienvilla Istrien', 'Spielzimmer Villa Kroatien', 'Familienvilla Svetvinčenat']
      : ['Villa Beluga', 'entertainment villa Istria', 'game room villa Croatia', 'family villa Svetvinčenat'],
    openGraph: {
      title,
      description,
      images: [{ url: `${baseUrl}/og/villa-beluga.jpg`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: {
      canonical: `${baseUrl}/${locale}/villa-beluga`,
      languages: { en: `${baseUrl}/en/villa-beluga`, de: `${baseUrl}/de/villa-beluga`, 'x-default': `${baseUrl}/en/villa-beluga` },
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

  const vacationRental = getVacationRentalSchema('beluga', locale);
  const breadcrumb = getBreadcrumbSchema([
    { name: isDE ? 'Startseite' : 'Home', url: `/${locale}` },
    { name: 'Villa Beluga', url: `/${locale}/villa-beluga` },
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
      <VillaBelugaPage />
    </>
  );
}
