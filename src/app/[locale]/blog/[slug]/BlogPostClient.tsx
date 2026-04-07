'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

const blogPostSlugs = [
  { slug: 'truffle-season-in-istria', date: '2026-02-15' },
  { slug: 'rovinj-gem-of-the-adriatic', date: '2026-02-01' },
  { slug: 'best-beaches-near-svetvincenat', date: '2026-01-20' },
  { slug: 'istrian-wine-journey', date: '2026-01-10' },
  { slug: 'planning-the-perfect-istrian-wedding', date: '2025-12-28' },
  { slug: 'family-friendly-activities-central-istria', date: '2025-12-15' },
];

export default function BlogPostContent({ slug }: { slug: string }) {
  const t = useTranslations('blog');
  const locale = useLocale();

  const blogPosts = blogPostSlugs.map((p, i) => ({
    ...p,
    title: t(`post${i}Title`),
    category: t(`post${i}Category`),
  }));

  const post = blogPosts.find((p) => p.slug === slug) ?? blogPosts[0];
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

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
          <p className="text-lg leading-relaxed text-text-muted">{t('articleP1')}</p>
          <div className="my-10 line-h" />
          <p className="text-base leading-relaxed text-text-muted">{t('articleP2')}</p>
          <p className="mt-6 text-base leading-relaxed text-text-muted">{t('articleP3')}</p>
          <p className="mt-6 text-base leading-relaxed text-text-muted">{t('articleP4')}</p>
          <p className="mt-6 text-base leading-relaxed text-text-muted">{t('articleP5')}</p>
        </article>

        <div className="mt-16 rounded-sm border border-line bg-bg-elevated p-8 text-center md:p-12">
          <p className="display-md">{t('articleCta')}</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-muted">{t('articleCtaBody')}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"><Link href="/villa-ballena" className="btn-editorial">{t('exploreVillaBallena')}</Link><Link href="/contact" className="btn-editorial">{t('checkAvailability')}</Link></div>
        </div>

        <div className="mt-12"><Link href="/blog" className="inline-flex items-center gap-2 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text transition-all duration-300 hover:gap-3"><svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>{t('backToBlog')}</Link></div>
      </div></section>

      <section className="section-editorial border-t border-line bg-bg-elevated"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><p className="label-section mb-12">(RELATED)</p><h2 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text mb-12">{t('relatedPosts')}</h2><div className="grid gap-8 md:grid-cols-3">
        {relatedPosts.map((related) => (
          <Link key={related.slug} href={`/blog/${related.slug}` as '/blog/truffle-season-in-istria'} className="group overflow-hidden rounded-sm border border-line transition-all duration-500 hover:border-line-strong">
            <div className="aspect-[16/10] bg-bg-subtle"><div className="flex h-full items-end p-4"><span className="label-section">({related.category.toUpperCase()})</span></div></div>
            <div className="bg-bg p-5"><h3 className="font-heading text-sm font-medium uppercase tracking-[0.08em] text-text transition-colors duration-300 group-hover:text-text-muted">{related.title}</h3><time className="mt-2 block font-heading text-[0.6875rem] tracking-wider text-text-dim">{new Date(related.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</time></div>
          </Link>
        ))}
      </div></div></section>
    </main>
  );
}
