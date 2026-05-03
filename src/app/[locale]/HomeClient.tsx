'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroImages, villaCards } from '@/lib/images';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   S1 — HERO
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  const t = useTranslations('hero');
  const tc = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      // Softer hero compression on scroll — luxury hospitality feel
      if (sectionRef.current) {
        gsap.to(sectionRef.current, {
          scale: 0.92, borderRadius: '24px', opacity: 0.85,
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '80% top', scrub: true },
        });
      }
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.hero-line');
        gsap.fromTo(lines, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden" style={{ transformOrigin: 'center top' }}>
      <Image src={heroImages.homepage} alt="Villa Ballena and Villa Beluga aerial view at dusk" fill className="object-cover" priority quality={90} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      {/* Content — title in bottom third */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-[12vh] sm:pb-[10vh] lg:px-10 lg:pb-[8vh]">
        <div ref={titleRef} className="max-w-[90vw]">
          <h1 className="display-hero text-white">
            <span className="block overflow-hidden"><span className="hero-line block">BALLENA</span></span>
            <span className="block overflow-hidden"><span className="hero-line block">&amp; BELUGA</span></span>
          </h1>
        </div>
        {/* Subtitle — below title, left-aligned, larger */}
        <div className="mt-6 lg:mt-8 max-w-[500px]">
          <p className="font-accent text-base italic leading-relaxed text-white/80 lg:text-xl">{t('title')}</p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-white/50 font-body lg:text-sm">Svetvinčenat, Istria</p>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-heading text-[0.5625rem] uppercase tracking-[0.3em] text-white/40">{tc('scroll')}</span>
          <div className="h-8 w-px bg-white/20 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S2 — ABOUT
   ═══════════════════════════════════════════════════════════ */
function About() {
  const t = useTranslations('home');
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        const img = imageRef.current.querySelector('img');
        if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, scrollTrigger: { trigger: imageRef.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
      if (textRef.current) gsap.fromTo(textRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: textRef.current, start: 'top 85%' } });
      if (bigTextRef.current) {
        const lines = bigTextRef.current.querySelectorAll('.reveal-line');
        gsap.fromTo(lines, { y: '110%' }, { y: '0%', duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: bigTextRef.current, start: 'top 80%' } });
      }
      if (statsRef.current) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const counters = statsRef.current.querySelectorAll('.stat-number');
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          if (isNaN(target) || target === 0) return;
          // Skip the count-up animation when motion is reduced — leave SSR
          // final value untouched. Otherwise reset to 0 right before scroll
          // trigger fires so the JS animation starts from 0.
          if (reducedMotion) return;
          counter.textContent = '0';
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 1.5, ease: 'power2.out',
            scrollTrigger: { trigger: counter, start: 'top 85%' },
            onUpdate: () => { counter.textContent = Math.round(obj.val).toString(); },
          });
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-bg relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <h2 className="label-section mb-12 lg:mb-16">(ABOUT)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4">
          <div className="hidden lg:block lg:col-span-3" />
          <div ref={imageRef} className="lg:col-span-4 overflow-hidden rounded-sm">
            <div className="relative aspect-[3/4]">
              <Image src="/images/beluga/dji_0146.jpg" alt="Aerial view of villa pool and terrace from drone" fill className="object-cover" quality={85} sizes="(max-width: 1024px) 100vw, 33vw" />
            </div>
          </div>
          <div ref={textRef} className="lg:col-span-5 flex flex-col justify-start lg:pt-8 lg:pl-12">
            <p className="body-editorial">{t('intro')}</p>
            <p className="mt-6 micro-italic">{t('introTitle')}</p>
            <Link href="/about" className="btn-editorial mt-8 w-fit">{t('aboutLearnMore')}</Link>
          </div>
        </div>
        <div ref={bigTextRef} className="mt-16 lg:mt-24 max-w-[600px]">
          <div className="overflow-hidden"><p className="reveal-line display-lg font-display italic">{t('bigText1')}</p></div>
          <div className="overflow-hidden"><p className="reveal-line display-lg">{t('bigText2')}</p></div>
          <div className="overflow-hidden"><p className="reveal-line display-lg font-display italic font-bold">{t('bigText3')}</p></div>
          <div className="overflow-hidden"><p className="reveal-line display-lg font-display italic font-bold">{t('bigText4')}</p></div>
          <div className="overflow-hidden"><p className="reveal-line display-lg">{t('bigText5')}</p></div>
        </div>

        {/* Stats — directly below big text, 4 in one row on desktop, bigger numbers */}
        <div ref={statsRef} className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 lg:gap-x-12">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="stat-number font-hero text-[clamp(3.5rem,8vw,6rem)] font-bold text-text/90" data-target="700">700</span>
              <span className="font-accent text-xl italic text-text-muted">m&sup2;</span>
            </div>
            <p className="mt-1 text-[0.8125rem] text-text-dim leading-relaxed">{t('statLivingSpace')}</p>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="stat-number font-hero text-[clamp(3.5rem,8vw,6rem)] font-bold text-text/90" data-target="60">60</span>
              <span className="font-accent text-xl italic text-text-muted">%</span>
            </div>
            <p className="mt-1 text-[0.8125rem] text-text-dim leading-relaxed">{t('statGreenSpaces')}</p>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="stat-number font-hero text-[clamp(3.5rem,8vw,6rem)] font-bold text-text/90" data-target="8">8</span>
            </div>
            <p className="mt-1 text-[0.8125rem] text-text-dim leading-relaxed">{t('statBedrooms')}</p>
          </div>
          <div>
            <span className="font-hero text-[clamp(3.5rem,8vw,6rem)] font-bold italic text-text/90">24/7</span>
            <p className="mt-1 text-[0.8125rem] text-text-dim leading-relaxed">{t('statConcierge')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S4 — VILLAS SHOWCASE
   ═══════════════════════════════════════════════════════════ */
function VillasShowcase() {
  const t = useTranslations('home');
  const sectionRef = useRef<HTMLElement>(null);

  const villas = [
    { name: 'Villa Ballena', tagline: t('ballenaTagline'), href: '/villa-ballena' as const, image: villaCards.ballena, imageAlt: 'Villa Ballena terrace and pool at night' },
    { name: 'Villa Beluga', tagline: t('belugaTagline'), href: '/villa-beluga' as const, image: villaCards.beluga, imageAlt: 'Villa Beluga exterior with pool at dusk' },
  ];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll('.villa-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%' }, delay: i * 0.2 });
        const img = card.querySelector('img');
        if (img) gsap.fromTo(img, { scale: 1.1 }, { scale: 1, scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="label-section">(OUR VILLAS)</h2>
          <div className="flex items-center gap-3 text-[0.6875rem] font-heading tracking-wider text-text-dim">
            <span className="text-text">(1)</span><span>(2)</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {villas.map((villa) => (
            <Link key={villa.name} href={villa.href} className="villa-card group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image src={villa.image} alt={villa.imageAlt} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" quality={85} sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="mt-6 flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-sm uppercase tracking-[0.12em] text-text">{villa.name}</h3>
                  <p className="mt-1 micro-italic">{villa.tagline}</p>
                </div>
                <span className="btn-editorial text-[0.6rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{t('villaExplore')}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S5 — BELIEFS
   ═══════════════════════════════════════════════════════════ */
function Beliefs() {
  const t = useTranslations('home');
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (textRef.current) {
        const lines = textRef.current.querySelectorAll('.reveal-line');
        gsap.fromTo(lines, { y: '110%' }, { y: '0%', duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: textRef.current, start: 'top 80%' } });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex justify-end mb-12"><h2 className="label-section">(OUR BELIEFS)</h2></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image src="/images/beluga/img_4778.jpg" alt="Villa exterior with lush garden" fill className="object-cover" quality={85} sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div>
            <div ref={textRef}>
              <div className="overflow-hidden"><p className="reveal-line display-lg">{t('beliefsVision1')}</p></div>
              <div className="overflow-hidden"><p className="reveal-line display-lg font-display italic">{t('beliefsVision2')}</p></div>
            </div>
            <p className="mt-10 body-editorial">{t('beliefsText')}</p>
            <Link href="/contact" className="btn-editorial mt-10 w-fit">{t('beliefsButton')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S5b — BLOG PREVIEW
   ═══════════════════════════════════════════════════════════ */
function BlogPreview() {
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
                <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" quality={60} sizes="(max-width: 768px) 100vw, 33vw" />
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

/* ═══════════════════════════════════════════════════════════
   S6 — VALUES GRID OVER PHOTO
   ═══════════════════════════════════════════════════════════ */
function ValuesGrid() {
  const t = useTranslations('home');
  const sectionRef = useRef<HTMLElement>(null);
  const values = [
    { num: '1', title: t('value1Title'), desc: t('value1Desc') },
    { num: '2', title: t('value2Title'), desc: t('value2Desc') },
    { num: '3', title: t('value3Title'), desc: t('value3Desc') },
    { num: '4', title: t('value4Title'), desc: t('value4Desc') },
    { num: '5', title: t('value5Title'), desc: t('value5Desc') },
  ];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.value-item');
      gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] flex items-center overflow-hidden">
      <Image src="/images/beluga/beluga-25.jpg" alt="Villa Beluga glass terrace interior" fill className="object-cover" quality={80} />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10 py-20 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {values.slice(0, 2).map((v) => (
            <div key={v.num} className="value-item col-span-1 lg:col-span-3">
              <h3 className="display-md !text-white whitespace-pre-line !text-xl lg:!text-2xl">{v.title}</h3>
              <p className="mt-3 text-[0.8125rem] text-white/90 leading-relaxed">{v.desc}</p>
              <p className="mt-4 text-white/60 text-sm">({v.num})</p>
            </div>
          ))}
          <div className="value-item col-span-2 lg:col-span-5 lg:col-start-8 lg:row-span-2 flex flex-col justify-start">
            <p className="body-editorial !text-white/90 !max-w-none">{t('valuesBody1')}</p>
            <p className="mt-6 body-editorial !text-white/80 !max-w-none">{t('valuesBody2')}</p>
          </div>
          {values.slice(2).map((v) => (
            <div key={v.num} className="value-item col-span-1 lg:col-span-2">
              <h3 className="display-md !text-white whitespace-pre-line !text-lg lg:!text-xl">{v.title}</h3>
              <p className="mt-3 text-[0.75rem] text-white/90 leading-relaxed">{v.desc}</p>
              <p className="mt-4 text-white/60 text-sm">({v.num})</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S7 — AMENITIES (Overlapping Images)
   ═══════════════════════════════════════════════════════════ */
function Amenities() {
  const t = useTranslations('home');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const text = sectionRef.current.querySelector('.amenity-text');
      const imgs = sectionRef.current.querySelectorAll('.amenity-img');
      if (text) gsap.fromTo(text, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: text, start: 'top 85%' } });
      imgs.forEach((img, i) => { gsap.fromTo(img, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: i * 0.15, scrollTrigger: { trigger: img, start: 'top 85%' } }); });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-bg overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="amenity-text">
            <h2 className="display-lg"><span className="font-bold">{t('amenitiesTitle1')}</span><br /><span className="font-bold">{t('amenitiesTitle2')}</span><br /><span className="italic">{t('amenitiesTitle3')}</span></h2>
            <p className="mt-8 body-editorial">{t('amenitiesText')}</p>
            <Link href="/villa-ballena" className="btn-editorial mt-8 w-fit">{t('amenitiesLearnMore')}</Link>
          </div>
          <div className="relative h-[500px] lg:h-[600px]">
            <div className="amenity-img absolute top-0 right-0 w-[65%] h-[70%] overflow-hidden rounded-sm">
              <Image src="/images/ballena/img_5140.jpg" alt="Villa interior wellness area" fill className="object-cover" quality={80} sizes="40vw" />
            </div>
            <div className="amenity-img absolute bottom-0 left-0 w-[55%] h-[55%] overflow-hidden rounded-sm z-10 border border-line">
              <Image src="/images/ballena/img_5118.jpg" alt="Villa Ballena bedroom interior" fill className="object-cover" quality={80} sizes="35vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S8 — REVIEWS
   ═══════════════════════════════════════════════════════════ */
function Reviews() {
  const t = useTranslations('home');
  return (
    <section className="bg-bg py-20 lg:py-28">
      <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
        <span className="block font-display text-8xl leading-none text-text-dim/20 select-none mb-4">&ldquo;</span>
        <blockquote>
          <p className="font-accent text-xl italic leading-relaxed text-text/80 lg:text-3xl lg:leading-relaxed">
            {t('reviewQuote')}
          </p>
        </blockquote>
        <footer className="mt-10">
          <p className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-text-muted">{t('reviewAuthor')}</p>
          <p className="mt-1 text-[0.75rem] text-text-dim">{t('reviewLocation')}</p>
        </footer>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S9 — CTA
   ═══════════════════════════════════════════════════════════ */
function CTA() {
  const t = useTranslations('home');
  const tc = useTranslations('common');
  return (
    <section className="bg-bg">
      <div className="line-h" />
      <div className="py-20 lg:py-28">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
          <h2 className="display-lg">{t('ctaTitleHome')}</h2>
          <p className="mt-6 micro-italic">{t('ctaSubtitle')}</p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn-editorial">{tc('bookAVisit')}</Link>
            <a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="btn-editorial">{tc('whatsappUs')}</a>
          </div>
        </div>
      </div>
      <div className="line-h" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <VillasShowcase />
      <Beliefs />
      <BlogPreview />
      <ValuesGrid />
      <Amenities />
      <Reviews />
      <CTA />
    </main>
  );
}
