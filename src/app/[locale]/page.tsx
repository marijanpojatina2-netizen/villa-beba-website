import { getBreadcrumbSchema } from '@/lib/schema';
import HomePage from './HomeClient';

const baseUrl = 'https://www.villabeba.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isDE = locale === 'de';

  const title = isDE
    ? 'Luxusvillen in Istrien | Privater Pool & Sauna'
    : 'Luxury Villas in Istria | Private Pool & Sauna';
  const description = isDE
    ? 'Villa Ballena & Villa Beluga — zwei Designervillen in Svetvincenat, Istrien. 4 Schlafzimmer, beheizter Pool, Sauna & Spielzimmer. Ab 600 Euro/Nacht.'
    : 'Villa Ballena & Villa Beluga — two designer villas in Svetvincenat, Istria. 4 bedrooms, heated pool, sauna & game room. From 600 Euro/night. Book direct.';

  return {
    title,
    description,
    keywords: isDE
      ? ['Luxusvilla Istrien', 'Ferienvilla Kroatien', 'privater Pool Istrien', 'Villa mieten Kroatien']
      : ['luxury villa Istria', 'villa rental Croatia', 'private pool Istria', 'holiday villa Croatia'],
    openGraph: {
      title,
      description,
      images: [{ url: `${baseUrl}/images/ballena/ballena-42.jpg`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: { en: `${baseUrl}/en`, de: `${baseUrl}/de` },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: `/${locale}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <HomePage />
    </>
  );
}
