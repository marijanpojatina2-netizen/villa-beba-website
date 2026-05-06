import HomePage from './HomeClient';

const baseUrl = 'https://www.ballenaandbeluga.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isDE = locale === 'de';

  // Layout template adds " | Villa Ballena & Beluga" automatically — keep
  // page-specific copy only. Title sized so layout template lands inside
  // SEOptimizer's 50-60 char window with the brand suffix appended.
  const title = isDE
    ? 'Luxusvillen Istrien · Privater Pool & Sauna in Kroatien'
    : 'Luxury Villas in Istria · Private Pool & Sauna, Croatia';
  const description = isDE
    ? 'Villa Ballena & Villa Beluga — zwei Designervillen in Svetvinčenat, Istrien, Kroatien. 4 Schlafzimmer, beheizter Pool, Sauna & Spielzimmer. Ab 600 Euro/Nacht.'
    : 'Villa Ballena & Villa Beluga — two designer villas in Svetvinčenat, Istria, Croatia. 4 bedrooms, heated pool, sauna & game room. From 600 Euro/night. Book direct.';

  return {
    // Use `absolute` so the layout's `%s | Villa Ballena & Beluga` template
    // doesn't push the home title past the SEOptimizer 50-60 char window —
    // the page-level copy already names the brand.
    title: { absolute: title },
    description,
    keywords: isDE
      ? ['Luxusvilla Istrien', 'Ferienvilla Kroatien', 'privater Pool Istrien', 'Villa mieten Kroatien']
      : ['luxury villa Istria', 'villa rental Croatia', 'private pool Istria', 'holiday villa Croatia'],
    openGraph: {
      title,
      description,
      images: [{ url: `${baseUrl}/og/home.jpg`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: { en: `${baseUrl}/en`, de: `${baseUrl}/de`, 'x-default': `${baseUrl}/en` },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <HomePage locale={locale} />;
}
