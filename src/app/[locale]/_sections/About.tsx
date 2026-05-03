'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
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
        const counters = statsRef.current.querySelectorAll('.stat-number');
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          if (isNaN(target) || target === 0) return;
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

        <div ref={statsRef} className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 lg:gap-x-12">
          <dl className="flex flex-col" aria-label={`700 m² ${t('statLivingSpace')}`}>
            {/* DOM source order must be dt → dd (axe rule); flex `order-*` flips visually. */}
            <dt className="order-2 mt-1 text-[0.8125rem] text-text-dim leading-relaxed">{t('statLivingSpace')}</dt>
            <dd className="order-1 flex items-baseline gap-1">
              <span aria-hidden="true" className="stat-number font-hero text-[clamp(3.5rem,8vw,6rem)] font-bold text-text/90" data-target="700">700</span>
              <span aria-hidden="true" className="font-accent text-xl italic text-text-muted">m&sup2;</span>
            </dd>
          </dl>
          <dl className="flex flex-col" aria-label={`60% ${t('statGreenSpaces')}`}>
            <dt className="order-2 mt-1 text-[0.8125rem] text-text-dim leading-relaxed">{t('statGreenSpaces')}</dt>
            <dd className="order-1 flex items-baseline gap-1">
              <span aria-hidden="true" className="stat-number font-hero text-[clamp(3.5rem,8vw,6rem)] font-bold text-text/90" data-target="60">60</span>
              <span aria-hidden="true" className="font-accent text-xl italic text-text-muted">%</span>
            </dd>
          </dl>
          <dl className="flex flex-col" aria-label={`8 ${t('statBedrooms')}`}>
            <dt className="order-2 mt-1 text-[0.8125rem] text-text-dim leading-relaxed">{t('statBedrooms')}</dt>
            <dd className="order-1 flex items-baseline gap-1">
              <span aria-hidden="true" className="stat-number font-hero text-[clamp(3.5rem,8vw,6rem)] font-bold text-text/90" data-target="8">8</span>
            </dd>
          </dl>
          <dl className="flex flex-col" aria-label={`24/7 ${t('statConcierge')}`}>
            <dt className="order-2 mt-1 text-[0.8125rem] text-text-dim leading-relaxed">{t('statConcierge')}</dt>
            <dd className="order-1 font-hero text-[clamp(3.5rem,8vw,6rem)] font-bold italic text-text/90">24/7</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
