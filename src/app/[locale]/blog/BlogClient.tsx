'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BlogPage() {
  const t = useTranslations('blog');
  const locale = useLocale();
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const blogPosts = [
    { slug: 'why-istria-luxury-villa-holiday', title: t('post0Title'), excerpt: t('post0Excerpt'), category: t('post0Category'), date: '2026-03-15', image: '/images/ballena/ballena-42.jpg' },
    { slug: 'istrian-food-guide-truffles-olive-oil-wine', title: t('post1Title'), excerpt: t('post1Excerpt'), category: t('post1Category'), date: '2026-03-01', image: '/images/ballena/ballena-35-1.jpg' },
    { slug: 'things-to-do-near-svetvincenat-istria', title: t('post2Title'), excerpt: t('post2Excerpt'), category: t('post2Category'), date: '2026-02-15', image: '/images/beluga/beluga-42.jpg' },
  ];

  useEffect(() => { const ctx = gsap.context(() => {
    if (titleRef.current) { const lines = titleRef.current.querySelectorAll('.hero-line'); gsap.fromTo(lines, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 }); }
    if (gridRef.current) { const cards = gridRef.current.querySelectorAll('.blog-card'); cards.forEach((card, i) => { gsap.fromTo(card, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, scrollTrigger: { trigger: card, start: 'top 88%' } }); const img = card.querySelector('img'); if (img) gsap.fromTo(img, { scale: 1.1 }, { scale: 1, scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } }); }); }
  }); return () => ctx.revert(); }, []);

  return (
    <main>
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image src="/images/beluga/beluga-42.jpg" alt="Aerial view of Svetvincenat village" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
          <div ref={titleRef} className="max-w-[90vw]"><div className="overflow-hidden"><h1 className="hero-line display-hero text-white">JOURNAL</h1></div></div>
          <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right"><p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">{t('subtitle')}</p></div>
        </div>
      </section>

      <section className="section-editorial bg-bg"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><p className="label-section mb-16 lg:mb-24">(ARTICLES)</p><div ref={gridRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article key={post.slug} className="blog-card group overflow-hidden rounded-sm border border-line transition-all duration-500 hover:border-line-strong">
            <div className="relative aspect-[16/10] overflow-hidden"><Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" quality={75} /><div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" /><div className="absolute left-4 top-4"><span className="rounded-full border border-line bg-bg/60 px-3 py-1 text-[10px] font-heading uppercase tracking-widest text-text-muted backdrop-blur-sm">{post.category}</span></div></div>
            <div className="bg-bg-elevated p-6">
              <time className="font-heading text-[0.6875rem] tracking-wider text-text-dim">{new Date(post.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <h2 className="mt-3 font-heading text-sm font-medium uppercase tracking-[0.08em] text-text transition-colors duration-300 group-hover:text-text-muted md:text-base">{post.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}` as '/blog/why-istria-luxury-villa-holiday'} className="mt-5 inline-flex items-center gap-2 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text transition-all duration-300 hover:gap-3">{t('readMore')}<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
            </div>
          </article>
        ))}
      </div></div></section>
    </main>
  );
}
