'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroImages } from '@/lib/images';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const t = useTranslations('hero');
  const tc = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
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
      {/* LCP image: `priority` makes Next emit `<link rel="preload" as="image">`
          plus `loading="eager"` and `fetchpriority="high"`. Quality drops to
          75 so the AVIF derivative shaves ~10% off the wire — a meaningful
          slice of the 5.7 s mobile LCP we measured. The remaining headroom
          lives in the apex→www→/en redirect chain (see
          docs/seo/vercel-domain-redirect.md) and is dashboard-only. */}
      <Image src={heroImages.homepage} alt="Villa Ballena and Villa Beluga aerial view at dusk" fill className="object-cover" priority quality={75} sizes="100vw" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-[12vh] sm:pb-[10vh] lg:px-10 lg:pb-[8vh]">
        <div ref={titleRef} className="max-w-[90vw]">
          <h1 className="display-hero text-white">
            <span className="block overflow-hidden"><span className="hero-line block">BALLENA</span></span>
            <span className="block overflow-hidden"><span className="hero-line block">&amp; BELUGA</span></span>
          </h1>
        </div>
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
