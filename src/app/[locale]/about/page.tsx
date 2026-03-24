'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const t = useTranslations('about');
  const titleRef = useRef<HTMLDivElement>(null);
  const storyImageRef = useRef<HTMLDivElement>(null);
  const storyTextRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLElement>(null);

  const values = [
    { title: 'Privacy', description: 'Your own fenced grounds, private pool, and secluded terrace. No shared lobbies, no neighbors peering over. Just your family and the Istrian sky.' },
    { title: 'Design', description: 'Every detail is intentional. From the underfloor heating to the biological pool water, our villas blend contemporary aesthetics with functional luxury.' },
    { title: 'Authenticity', description: 'We are rooted in Istria. We know the truffle hunters, the winemakers, the fishermen. Every experience we recommend is one we have lived ourselves.' },
    { title: 'Hospitality', description: 'No rigid schedules or impersonal service. Just attentive, warm support when you need it and complete freedom when you do not.' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.hero-line');
        gsap.fromTo(lines, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 });
      }
      if (storyImageRef.current) {
        const img = storyImageRef.current.querySelector('img');
        if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, scrollTrigger: { trigger: storyImageRef.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
      if (storyTextRef.current) gsap.fromTo(storyTextRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: storyTextRef.current, start: 'top 85%' } });
      if (valuesRef.current) {
        const items = valuesRef.current.querySelectorAll('.value-card');
        gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, scrollTrigger: { trigger: valuesRef.current, start: 'top 70%' } });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <main>
      {/* ──────── Hero ──────── */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <Image src="/images/ballena/Ballena 35-1.jpg" alt="Olive tree courtyard at Villa Ballena" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
          <div ref={titleRef} className="max-w-[90vw]">
            <div className="overflow-hidden"><h1 className="hero-line display-hero text-white">ABOUT</h1></div>
          </div>
          <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right">
            <p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* ──────── Story Section ──────── */}
      <section className="section-editorial bg-bg">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="label-section mb-16 lg:mb-24">(OUR STORY)</p>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div ref={storyTextRef} className="lg:col-span-5">
              <h2 className="display-lg">{t('storyTitle')}</h2>
              <div className="my-8 line-h w-24" />
              <p className="body-editorial !max-w-none">{t('story')}</p>
            </div>
            <div className="lg:col-span-2" />
            <div ref={storyImageRef} className="lg:col-span-5 overflow-hidden rounded-sm border border-line">
              <div className="relative aspect-[4/3]">
                <Image src="/images/ballena/Ballena 42.jpg" alt="Aerial view of both villas at dusk" fill className="object-cover" quality={80} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── Philosophy Section ──────── */}
      <section className="section-editorial bg-bg-elevated">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
          <p className="label-section mb-16">(PHILOSOPHY)</p>
          <h2 className="display-lg">{t('philosophyTitle')}</h2>
          <div className="mx-auto my-8 line-h w-24" />
          <p className="body-editorial mx-auto !max-w-none">{t('philosophy')}</p>
        </div>
      </section>

      {/* ──────── Values Grid ──────── */}
      <section ref={valuesRef} className="section-editorial bg-bg">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="label-section mb-16 lg:mb-24">(OUR VALUES)</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <div key={value.title} className="value-card rounded-sm border border-line bg-bg-elevated p-8 transition-all duration-300 hover:border-line-strong">
                <span className="font-heading text-[0.6875rem] text-text-dim">({String(i + 1).padStart(2, '0')})</span>
                <h3 className="mt-4 font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="bg-bg">
        <div className="line-h" />
        <div className="py-32 lg:py-48">
          <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
            <p className="display-md">Experience our philosophy firsthand</p>
            <p className="mt-6 body-editorial mx-auto !max-w-lg">
              Whether you seek a quiet wellness retreat or a lively family celebration, Villa Ballena and Villa Beluga await you in the heart of Istria.
            </p>
            <Link href="/contact" className="btn-editorial mt-10">Get in Touch</Link>
          </div>
        </div>
        <div className="line-h" />
      </section>
    </main>
  );
}
