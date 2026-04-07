'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

const blogPostSlugs = [
  { slug: 'why-istria-luxury-villa-holiday', date: '2026-03-15' },
  { slug: 'istrian-food-guide-truffles-olive-oil-wine', date: '2026-03-01' },
  { slug: 'things-to-do-near-svetvincenat-istria', date: '2026-02-15' },
];

/* Each post's content structure: array of { heading?, text } blocks */
function getPostSections(t: (key: string) => string, postIndex: number) {
  if (postIndex === 0) {
    return [
      { text: t('post0Intro') },
      { heading: t('post0H1'), text: t('post0P1') },
      { text: t('post0P1b') },
      { heading: t('post0H2'), text: t('post0P2') },
      { text: t('post0P2b') },
      { heading: t('post0H3'), text: t('post0P3') },
      { text: t('post0P3b') },
      { heading: t('post0H4'), text: t('post0P4') },
      { text: t('post0P4b') },
      { heading: t('post0H5'), text: t('post0P5') },
      { text: t('post0P5b') },
    ];
  }
  if (postIndex === 1) {
    return [
      { text: t('post1Intro') },
      { heading: t('post1H1'), text: t('post1P1') },
      { text: t('post1P1b') },
      { text: t('post1P1c') },
      { heading: t('post1H2'), text: t('post1P2') },
      { text: t('post1P2b') },
      { text: t('post1P2c') },
      { heading: t('post1H3'), text: t('post1P3') },
      { text: t('post1P3b') },
      { text: t('post1P3c') },
      { heading: t('post1H4'), text: t('post1P4') },
      { text: t('post1P4b') },
      { text: t('post1P4c') },
      { heading: t('post1H5'), text: t('post1P5') },
      { text: t('post1P5b') },
      { heading: t('post1H6'), text: t('post1P6') },
      { text: t('post1P6b') },
    ];
  }
  // postIndex === 2
  return [
    { text: t('post2Intro') },
    { heading: t('post2H1'), text: t('post2P1') },
    { heading: t('post2H2'), text: t('post2P2') },
    { heading: t('post2H3'), text: t('post2P3') },
    { heading: t('post2H4'), text: t('post2P4') },
    { heading: t('post2H5'), text: t('post2P5') },
    { heading: t('post2H6'), text: t('post2P6') },
    { heading: t('post2H7'), text: t('post2P7') },
    { heading: t('post2H8'), text: t('post2P8') },
    { heading: t('post2H9'), text: t('post2P9') },
    { heading: t('post2H10'), text: t('post2P10') },
    { text: t('post2Outro') },
  ];
}

export default function BlogPostContent({ slug }: { slug: string }) {
  const t = useTranslations('blog');
  const locale = useLocale();

  const blogPosts = blogPostSlugs.map((p, i) => ({
    ...p,
    title: t(`post${i}Title`),
    category: t(`post${i}Category`),
  }));

  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const idx = postIndex >= 0 ? postIndex : 0;
  const post = blogPosts[idx];
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug);
  const sections = getPostSections(t, idx);

  return (
    <main>
      <section className="relative flex h-[50vh] min-h-[400px] items-end overflow-hidden">
        <div className="absolute inset-0 bg-bg-subtle" />
        <div className="relative z-10 mx-auto w-full max-w-[900px] px-6 lg:px-10 pb-12 lg:pb-16">
          <span className="label-section">({post.category.toUpperCase()})</span>
          <h1 className="mt-4 display-lg">{post.title}</h1>
          <time className="mt-4 block font-heading text-[0.6875rem] tracking-wider text-text-dim">{new Date(post.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>
      </section>

      <section className="section-editorial bg-bg"><div className="mx-auto max-w-[700px] px-6 lg:px-10">
        <article>
          {sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 className="mt-10 mb-4 font-heading text-base font-medium uppercase tracking-[0.08em] text-text md:text-lg">{section.heading}</h2>
              )}
              <p className={`${i === 0 ? 'text-lg' : 'text-base'} ${section.heading ? '' : 'mt-6'} leading-relaxed text-text-muted`}>{section.text}</p>
              {i === 0 && <div className="my-10 line-h" />}
            </div>
          ))}
        </article>

        <div className="mt-16 rounded-sm border border-line bg-bg-elevated p-8 text-center md:p-12">
          <p className="display-md">{t('articleCta')}</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-muted">{t('articleCtaBody')}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"><Link href="/villa-ballena" className="btn-editorial">{t('exploreVillas')}</Link><Link href="/contact" className="btn-editorial">{t('checkAvailability')}</Link></div>
        </div>

        <div className="mt-12"><Link href="/blog" className="inline-flex items-center gap-2 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text transition-all duration-300 hover:gap-3"><svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>{t('backToBlog')}</Link></div>
      </div></section>

      <section className="section-editorial border-t border-line bg-bg-elevated"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><p className="label-section mb-12">(RELATED)</p><h2 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text mb-12">{t('relatedPosts')}</h2><div className="grid gap-8 md:grid-cols-2">
        {relatedPosts.map((related) => (
          <Link key={related.slug} href={`/blog/${related.slug}` as '/blog/why-istria-luxury-villa-holiday'} className="group overflow-hidden rounded-sm border border-line transition-all duration-500 hover:border-line-strong">
            <div className="aspect-[16/10] bg-bg-subtle"><div className="flex h-full items-end p-4"><span className="label-section">({related.category.toUpperCase()})</span></div></div>
            <div className="bg-bg p-5"><h3 className="font-heading text-sm font-medium uppercase tracking-[0.08em] text-text transition-colors duration-300 group-hover:text-text-muted">{related.title}</h3><time className="mt-2 block font-heading text-[0.6875rem] tracking-wider text-text-dim">{new Date(related.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</time></div>
          </Link>
        ))}
      </div></div></section>
    </main>
  );
}
