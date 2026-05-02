import { Montserrat, Inter, Cormorant_Garamond } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import SmoothScroll from '@/components/animations/SmoothScroll';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { getLocalBusinessSchema } from '@/lib/schema';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'],
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
  style: ['normal', 'italic'],
  variable: '--font-accent',
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
  const title = isDE
    ? 'Luxusvillen in Istrien | Privater Pool & Sauna | Villa Ballena & Beluga'
    : 'Luxury Villas in Istria | Private Pool & Sauna | Villa Ballena & Beluga';
  const description = isDE
    ? 'Zwei Designervillen in Svetvinčenat, Istrien. 4 Schlafzimmer, beheizter Pool, Sauna & Spielzimmer. Ab €600/Nacht. Direkt buchen.'
    : 'Two designer villas in Svetvinčenat, Istria. 4 bedrooms, heated pool, sauna & game room. From €600/night. Book direct for the best experience.';

  return {
    title: {
      default: title,
      template: `%s | Villa Ballena & Beluga`,
    },
    description,
    metadataBase: new URL('https://www.villabeba.com'),
    alternates: {
      canonical: `https://www.villabeba.com/${locale}`,
      languages: {
        en: 'https://www.villabeba.com/en',
        de: 'https://www.villabeba.com/de',
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
      className={`${montserrat.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body className="bg-midnight font-body text-white antialiased">
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
