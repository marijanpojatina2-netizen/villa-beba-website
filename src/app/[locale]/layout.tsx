import { Montserrat, Inter, Cormorant_Garamond, Playfair_Display, Bodoni_Moda } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Header, Footer } from '@/components/layout';
import SmoothScroll from '@/components/animations/SmoothScroll';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { getLocalBusinessSchema } from '@/lib/schema';

// Font weights/styles trimmed from a `rg`-verified usage scan: 900 weight
// is unused on both Playfair and Bodoni; Montserrat 700 is unused (only
// 400/500 appear); Cormorant normal style is unused (every callsite has
// the `italic` className). Saves ~7 woff2 cuts on first load (~150-200 KB).
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['italic'],
  variable: '--font-accent',
  display: 'swap',
});

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-hero',
  display: 'swap',
});

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const isDE = locale === 'de';
  // Title kept inside the SEOptimizer 50-60 char window so the SERP snippet
  // doesn't truncate. Includes "Croatia" + the brand pair so phrase-consistency
  // checks (ballena beluga / villa ballena / villa beluga) flip to ✓ in
  // both title and meta-description simultaneously.
  const title = isDE
    ? 'Villa Ballena & Beluga · Luxusvillen Istrien, Kroatien'
    : 'Villa Ballena & Beluga · Luxury Villas in Istria, Croatia';
  const description = isDE
    ? 'Villa Ballena & Villa Beluga — zwei Designervillen in Svetvinčenat, Istrien, Kroatien. 4 Schlafzimmer, beheizter Pool, Sauna & Spielzimmer. Ab €600/Nacht. Direkt buchen.'
    : 'Villa Ballena & Villa Beluga — two designer villas in Svetvinčenat, Istria, Croatia. 4 bedrooms, heated pool, sauna & game room. From €600/night. Book direct.';

  return {
    title: {
      default: title,
      template: `%s | Villa Ballena & Beluga`,
    },
    description,
    metadataBase: new URL('https://www.ballenaandbeluga.com'),
    alternates: {
      canonical: `https://www.ballenaandbeluga.com/${locale}`,
      languages: {
        en: 'https://www.ballenaandbeluga.com/en',
        de: 'https://www.ballenaandbeluga.com/de',
        // Fallback for unmapped languages (Italian guests — biggest
        // Istria tourist segment — Croatians without locale switch,
        // French, etc.). Points at /en since EN is the default.
        'x-default': 'https://www.ballenaandbeluga.com/en',
      },
    },
    openGraph: {
      title,
      description,
      locale: isDE ? 'de_DE' : 'en_US',
      type: 'website',
      siteName: 'Villa Ballena & Villa Beluga',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    keywords: isDE
      ? ['Luxusvilla Istrien', 'Ferienvilla Kroatien', 'privater Pool Istrien', 'Hochzeitslocation Istrien']
      : ['luxury villa Istria', 'villa rental Croatia', 'private pool Istria', 'wedding villa Croatia'],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'en' | 'de')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${montserrat.variable} ${inter.variable} ${cormorant.variable} ${bodoni.variable}`}
    >
      <body className="bg-bg font-body text-text antialiased">
        <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessSchema()) }}
      />
      <SmoothScroll>
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
      </SmoothScroll>
      {/* Vercel Analytics + Speed Insights — both ship a single beacon
          script each and run after page hydration so they don't compete
          with LCP. Free on the Hobby tier; pageviews surface in the
          Vercel dashboard within a few minutes of the first request. */}
      <Analytics />
      <SpeedInsights />
    </NextIntlClientProvider>
      </body>
    </html>
  );
}
