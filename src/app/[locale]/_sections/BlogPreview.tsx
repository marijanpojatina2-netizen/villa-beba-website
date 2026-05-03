'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function BlogPreview() {
  const t = useTranslations('home');

  const blogPosts = [
    { slug: 'why-istria-luxury-villa-holiday', title: t('blogPost0Title'), excerpt: t('blogPost0Excerpt'), category: 'Destination', image: '/images/ballena/ballena-42.jpg' },
    { slug: 'istrian-food-guide-truffles-olive-oil-wine', title: t('blogPost1Title'), excerpt: t('blogPost1Excerpt'), category: 'Food & Wine', image: '/images/experiences/tartufi.jpg' },
    { slug: 'things-to-do-near-svetvincenat-istria', title: t('blogPost2Title'), excerpt: t('blogPost2Excerpt'), category: 'Experiences', image: '/images/experiences/pula-arena.jpg' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="label-section">(JOURNAL)</h2>
          <Link href="/blog" className="btn-editorial !text-[0.6rem]">{t('blogViewAll')}</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}` as '/blog/why-istria-luxury-villa-holiday'} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line transition-all duration-500 group-hover:border-line-strong">
                <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" quality={75} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-heading uppercase tracking-widest text-white/80 backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <h3 className="mt-4 font-heading text-sm font-medium uppercase tracking-[0.08em] text-text transition-colors duration-300 group-hover:text-text-muted">{post.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
