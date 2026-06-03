import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getBreadcrumbSchema, getFAQSchema, getArticleSchema } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';
import { guides, getGuide } from '@/lib/guides';

const baseUrl = 'https://www.ballenaandbeluga.com';

export function generateStaticParams() {
  return guides.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const isDE = locale === 'de';
  const loc = isDE ? guide.de : guide.en;
  // Social/Pinterest share image. Use the guide hero when present (each guide's
  // most compelling photo) so Pinterest pins and link previews carry a real
  // image — otherwise fall back to the site OG card. The hero is webp, which
  // Pinterest renders fine; the jpg fallback keeps heroless guides shareable.
  const ogImage = guide.hero
    ? {
        url: `${baseUrl}${guide.hero.src}`,
        width: guide.hero.width,
        height: guide.hero.height,
        alt: isDE ? guide.hero.alt.de : guide.hero.alt.en,
      }
    : { url: `${baseUrl}/og/home.jpg`, width: 1200, height: 630, alt: loc.title };
  return {
    title: loc.title,
    description: loc.excerpt,
    openGraph: {
      title: loc.title,
      description: loc.excerpt,
      url: `${baseUrl}/${locale}/guides/${slug}`,
      type: 'article',
      publishedTime: guide.datePublished,
      ...(guide.dateModified ? { modifiedTime: guide.dateModified } : {}),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: loc.title,
      description: loc.excerpt,
      images: [ogImage.url],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/guides/${slug}`,
      languages: {
        en: `${baseUrl}/en/guides/${slug}`,
        de: `${baseUrl}/de/guides/${slug}`,
        'x-default': `${baseUrl}/en/guides/${slug}`,
      },
    },
  };
}

export default async function GuideDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const isDE = locale === 'de';
  const loc = isDE ? guide.de : guide.en;

  const breadcrumb = getBreadcrumbSchema([
    { name: isDE ? 'Startseite' : 'Home', url: `/${locale}` },
    { name: 'Guides', url: `/${locale}/guides` },
    { name: loc.title, url: `/${locale}/guides/${slug}` },
  ]);
  const faqSchema = getFAQSchema(loc.faq);
  const articleSchema = getArticleSchema({
    title: loc.title,
    description: loc.excerpt,
    slug,
    pathPrefix: 'guides',
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    image: guide.hero?.src,
    locale,
  });

  return (
    <>
      <JsonLd data={[articleSchema, faqSchema, breadcrumb]} />
      <main className="mx-auto max-w-3xl px-6 lg:px-10 pt-32 pb-24 text-text">
        <p className="font-heading text-[0.6875rem] uppercase tracking-[0.2em] text-text-dim">
          {guide.category}
        </p>
        <h1 className="mt-4 font-display text-3xl lg:text-5xl leading-tight">
          {loc.title}
        </h1>
        {guide.hero && (
          <div className="mt-8 -mx-6 lg:mx-0 lg:rounded-sm overflow-hidden bg-bg-subtle">
            <Image
              src={guide.hero.src}
              alt={isDE ? guide.hero.alt.de : guide.hero.alt.en}
              width={guide.hero.width}
              height={guide.hero.height}
              sizes="(min-width: 1024px) 720px, 100vw"
              priority
              className="w-full h-auto"
            />
          </div>
        )}
        <p className="mt-6 text-[1rem] leading-relaxed text-text-dim">
          {loc.intro}
        </p>

        <div className="mt-12 space-y-10">
          {loc.sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="font-heading text-base uppercase tracking-[0.12em] text-text">
                {s.heading}
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed">{s.body}</p>
              {guide.inlineImage?.afterSectionIndex === i && (
                <figure className="mt-6 -mx-6 lg:mx-0 lg:rounded-sm overflow-hidden bg-bg-subtle">
                  <Image
                    src={guide.inlineImage.image.src}
                    alt={isDE ? guide.inlineImage.image.alt.de : guide.inlineImage.image.alt.en}
                    width={guide.inlineImage.image.width}
                    height={guide.inlineImage.image.height}
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className="w-full h-auto"
                  />
                </figure>
              )}
            </section>
          ))}
        </div>

        <section className="mt-16 rounded-sm border border-line bg-bg-subtle p-6 lg:p-8">
          <h2 className="font-heading text-base uppercase tracking-[0.12em] text-text">
            {isDE ? 'Häufige Fragen' : 'Frequently asked questions'}
          </h2>
          <dl className="mt-6 space-y-6">
            {loc.faq.map(item => (
              <div key={item.q}>
                <dt className="font-heading text-[0.95rem] text-text">{item.q}</dt>
                <dd className="mt-2 text-[0.95rem] leading-relaxed text-text-dim">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem]">
          <Link href="/guides" className="underline underline-offset-4 hover:text-text-muted">
            {isDE ? '← Alle Guides' : '← All guides'}
          </Link>
          <Link href="/contact" className="underline underline-offset-4 hover:text-text-muted">
            {isDE ? 'Eine Frage stellen' : 'Ask us a question'}
          </Link>
          <Link href="/faq" className="underline underline-offset-4 hover:text-text-muted">FAQ</Link>
        </div>
      </main>
    </>
  );
}
