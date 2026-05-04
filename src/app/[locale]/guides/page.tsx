import { Link } from '@/i18n/navigation';
import { getBreadcrumbSchema } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';
import { guides } from '@/lib/guides';

const baseUrl = 'https://www.ballenaandbeluga.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Guides · Antworten zu Ihrem Aufenthalt' : 'Guides · Answers about your stay';
  const description = isDE
    ? 'Praktische Antworten auf häufige Fragen zur Anreise, Pool- und Saunasaison, Hochzeiten und Packlisten für Villa Ballena & Beluga.'
    : 'Practical answers about getting here, pool and sauna season, weddings, and packing for a stay at Villa Ballena & Beluga.';
  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/guides`,
      languages: {
        en: `${baseUrl}/en/guides`,
        de: `${baseUrl}/de/guides`,
        'x-default': `${baseUrl}/en/guides`,
      },
    },
  };
}

export default async function GuidesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([
    { name: isDE ? 'Startseite' : 'Home', url: `/${locale}` },
    { name: 'Guides', url: `/${locale}/guides` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="mx-auto max-w-4xl px-6 lg:px-10 pt-32 pb-24 text-text">
        <p className="font-heading text-[0.6875rem] uppercase tracking-[0.2em] text-text-dim">
          {isDE ? '(LEITFÄDEN)' : '(HELP CENTER)'}
        </p>
        <h1 className="mt-4 font-display text-4xl lg:text-5xl">
          {isDE ? 'Guides für Ihren Aufenthalt' : 'Guides for your stay'}
        </h1>
        <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-text-dim">
          {isDE
            ? 'Detaillierte, ehrliche Antworten auf die häufigsten Fragen vor und während Ihres Aufenthalts in Villa Ballena oder Villa Beluga. Für Schnellantworten siehe '
            : 'Detailed, honest answers to the most common questions before and during your stay at Villa Ballena or Villa Beluga. For quick answers see the '}
          <Link href="/faq" className="underline underline-offset-4 hover:text-text">FAQ</Link>
          {isDE ? '. Für persönliche Antworten ' : '. For anything personal, '}
          <Link href="/contact" className="underline underline-offset-4 hover:text-text">
            {isDE ? 'kontaktieren Sie uns' : 'contact us'}
          </Link>.
        </p>

        <div className="mt-14 grid gap-5">
          {guides.map(guide => {
            const loc = isDE ? guide.de : guide.en;
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}` as `/guides/${string}`}
                className="group block rounded-sm border border-line bg-bg-elevated p-6 transition-colors hover:border-text"
              >
                <p className="font-heading text-[0.625rem] uppercase tracking-[0.2em] text-text-dim">
                  {guide.category}
                </p>
                <h2 className="mt-2 font-display text-xl lg:text-2xl text-text group-hover:underline underline-offset-4">
                  {loc.title}
                </h2>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-text-dim">
                  {loc.excerpt}
                </p>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
