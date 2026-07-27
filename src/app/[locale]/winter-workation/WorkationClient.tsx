'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WHATSAPP_URL } from '@/lib/contact';

gsap.registerPlugin(ScrollTrigger);

function WorkationHero() {
  const t = useTranslations('workation');
  const tc = useTranslations('common');
  const titleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.hero-line');
        gsap.fromTo(lines, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 });
      }
    });
    return () => ctx.revert();
  }, []);
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image src="/images/ballena/ballena-33.jpg" alt="Villa Ballena exterior at sunset in Istria" fill className="object-cover" priority quality={85} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
        <div ref={titleRef} className="max-w-[90vw]">
          <h1 className="display-hero text-white">
            <span className="block overflow-hidden"><span className="hero-line block">{t('heroTitle1')}</span></span>
            <span className="block overflow-hidden"><span className="hero-line block italic">{t('heroTitle2')}</span></span>
          </h1>
        </div>
        <div className="mt-6 max-w-[300px] text-left lg:absolute lg:right-10 lg:bottom-16 lg:mt-0 lg:text-right">
          <p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">{t('subtitle')}</p>
          <p className="mt-4 text-[0.75rem] leading-relaxed text-white/50 font-body">Svetvin&#269;enat, Istria</p>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
          <span className="font-heading text-[0.5625rem] uppercase tracking-[0.3em] text-white/40">{tc('scroll')}</span>
          <div className="h-8 w-px bg-white/20 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function StatsRow() {
  const t = useTranslations('workation');
  const stats = [
    { label: t('statInternet'), value: t('statInternetValue') },
    { label: t('statBedrooms'), value: t('statBedroomsValue') },
    { label: t('statSeason'), value: t('statSeasonValue') },
  ];
  return (
    <section className="bg-dark">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="px-6 py-10 text-center lg:py-14">
            <p className="display-md !text-3xl !not-italic !font-bold text-white">{s.value}</p>
            <p className="mt-2 font-heading text-[0.6875rem] uppercase tracking-[0.15em] text-white/50">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyHere() {
  const t = useTranslations('workation');
  const sectionRef = useRef<HTMLElement>(null);
  const reasons = [1, 2, 3, 4, 5, 6].map((i) => ({
    title: t(`why${i}Title`),
    description: t(`why${i}Desc`),
  }));
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.why-card');
      gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
    });
    return () => ctx.revert();
  }, []);
  return (
    <section ref={sectionRef} className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">{t('whyLabel')}</p>
        <h2 className="display-lg mb-6">{t('whyTitle')}</h2>
        <p className="body-editorial mb-16">{t('whySubtitle')}</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <div key={r.title} className="why-card rounded-sm border border-line bg-bg-elevated p-8 transition-all duration-300 hover:border-line-strong">
              <span className="font-heading text-[0.6875rem] text-text-dim">({String(i + 1).padStart(2, '0')})</span>
              <h3 className="mt-4 font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Offer() {
  const t = useTranslations('workation');
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (sectionRef.current) gsap.fromTo(sectionRef.current.querySelector('.offer-box'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
    });
    return () => ctx.revert();
  }, []);
  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
        <p className="label-section mb-16">{t('offerLabel')}</p>
        <h2 className="display-lg mb-12">{t('offerTitle')}</h2>
        <div className="offer-box rounded-sm border border-line bg-bg p-8 md:p-12">
          <p className="display-md !text-4xl !not-italic !font-bold text-text">
            {t('offerPrice')}
            <span className="ml-2 font-heading text-sm font-normal uppercase tracking-[0.12em] text-text-dim">{t('offerPriceUnit')}</span>
          </p>
          <p className="body-editorial !max-w-none mt-6">{t('offerBody')}</p>
          <ul className="mt-8 space-y-3 text-sm text-text-muted">
            {[t('offerPoint1'), t('offerPoint2'), t('offerPoint3')].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 text-text">&#10003;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function LocationAndVisa() {
  const t = useTranslations('workation');
  return (
    <section className="section-editorial bg-bg">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
        <div>
          <p className="label-section mb-10">{t('locationLabel')}</p>
          <h2 className="display-lg mb-6 !text-3xl">{t('locationTitle')}</h2>
          <p className="body-editorial !max-w-none">{t('locationBody')}</p>
        </div>
        <div>
          <p className="label-section mb-10">{t('visaLabel')}</p>
          <h2 className="display-lg mb-6 !text-3xl">{t('visaTitle')}</h2>
          <p className="body-editorial !max-w-none">{t('visaBody')}</p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const t = useTranslations('workation');
  const faqs = [1, 2, 3, 4].map((i) => ({ q: t(`faq${i}Q`), a: t(`faq${i}A`) }));
  return (
    <section className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
        <p className="label-section mb-16">{t('faqLabel')}</p>
        <div className="space-y-10">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{f.q}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  const t = useTranslations('workation');
  return (
    <section className="section-editorial bg-dark">
      <div className="mx-auto max-w-[800px] px-6 text-center lg:px-10">
        <h2 className="display-lg mb-6 text-white">{t('ctaTitle')}</h2>
        <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-white/70">{t('ctaBody')}</p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-block rounded-full bg-white px-8 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-dark transition-opacity hover:opacity-90"
          >
            {t('ctaButton')}
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-white/30 px-8 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-white transition-colors hover:border-white/60"
          >
            {t('ctaWhatsApp')}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function WorkationPage() {
  return (
    <>
      <WorkationHero />
      <StatsRow />
      <WhyHere />
      <Offer />
      <LocationAndVisa />
      <Faq />
      <Cta />
    </>
  );
}
