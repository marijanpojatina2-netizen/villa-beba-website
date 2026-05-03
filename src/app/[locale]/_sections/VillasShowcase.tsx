'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { villaCards } from '@/lib/images';

gsap.registerPlugin(ScrollTrigger);

export default function VillasShowcase() {
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
