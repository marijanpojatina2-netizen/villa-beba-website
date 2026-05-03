'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { weddingPricing } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

function WeddingHero() {
  const t = useTranslations('weddings');
  const titleRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const ctx = gsap.context(() => { if (titleRef.current) { const lines = titleRef.current.querySelectorAll('.hero-line'); gsap.fromTo(lines, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 }); } }); return () => ctx.revert(); }, []);
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image src="/images/beluga/beluga-33.jpg" alt="Villa Beluga evening ambiance for weddings" fill className="object-cover" priority quality={85} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
        <div ref={titleRef} className="max-w-[90vw]">
          <h1 className="display-hero text-white">
            <span className="block overflow-hidden"><span className="hero-line block italic">{t('heroTitle1')}</span></span>
            <span className="block overflow-hidden"><span className="hero-line block">{t('heroTitle2')}</span></span>
          </h1>
        </div>
        <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right"><p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">{t('subtitle')}</p><p className="mt-4 text-[0.75rem] leading-relaxed text-white/50 font-body">Svetvin&#269;enat, Istria</p></div>
      </div>
    </section>
  );
}

function WhyIstria() {
  const t = useTranslations('weddings');
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const ctx = gsap.context(() => { if (textRef.current) gsap.fromTo(textRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: textRef.current, start: 'top 85%' } }); }); return () => ctx.revert(); }, []);
  return (
    <section className="section-editorial bg-bg"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><p className="label-section mb-16 lg:mb-24">(WHY ISTRIA)</p><div ref={textRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8"><div className="lg:col-span-5"><h2 className="display-lg">{t('whyIstriaTitle')}</h2></div><div className="lg:col-span-6 lg:col-start-7"><p className="display-md mb-8">{t('whyIstriaIntro')}</p><p className="body-editorial !max-w-none">{t('whyIstriaBody')}</p></div></div></div></section>
  );
}

function WeddingPackages() {
  const t = useTranslations('weddings');
  const tc = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => { const ctx = gsap.context(() => { if (!sectionRef.current) return; const cards = sectionRef.current.querySelectorAll('.package-card'); cards.forEach((card, i) => { gsap.fromTo(card, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.2, scrollTrigger: { trigger: card, start: 'top 85%' } }); }); }); return () => ctx.revert(); }, []);
  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><p className="label-section mb-16 lg:mb-24">(PACKAGES)</p><h2 className="display-lg mb-6">{t('packagesTitle')}</h2><p className="body-editorial mb-16">{t('packagesSubtitle')}</p><div className="grid gap-8 md:grid-cols-2"><div className="package-card rounded-sm border border-line bg-bg p-8 md:p-10"><span className="label-section">(INTIMATE)</span><h3 className="mt-4 display-md !text-2xl !not-italic !font-bold">{t('package1')}</h3><p className="mt-2 micro-italic">{t('package1Subtitle')}</p><div className="my-6 line-h" /><ul className="space-y-3 text-sm text-text-muted"><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package1Feature1')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package1Feature2')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package1Feature3')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package1Feature4')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package1Feature5')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package1Feature6')}</span></li></ul><Link href="/contact" className="btn-editorial mt-8 w-fit">{tc('inquireNow')}</Link></div><div className="package-card rounded-sm border border-line-strong bg-bg p-8 md:p-10"><span className="label-section">(GRAND)</span><h3 className="mt-4 display-md !text-2xl !not-italic !font-bold">{t('package2')}</h3><p className="mt-2 micro-italic">{t('package2Subtitle')}</p><div className="my-6 line-h" /><ul className="space-y-3 text-sm text-text-muted"><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package2Feature1')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package2Feature2')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package2Feature3')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package2Feature4')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package2Feature5')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package2Feature6')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('package2Feature7')}</span></li></ul><Link href="/contact" className="btn-editorial mt-8 w-fit">{t('requestGrandPackage')}</Link></div></div></div></section>
  );
}

function WeddingExperiences() {
  const t = useTranslations('weddings');
  const sectionRef = useRef<HTMLElement>(null);
  const expList = [
    { title: t('weddingExp1Title'), description: t('weddingExp1Desc'), image: '/images/experiences/wine-tasting.jpg' },
    { title: t('weddingExp2Title'), description: t('weddingExp2Desc'), image: '/images/experiences/tartufi.jpg' },
    { title: t('weddingExp3Title'), description: t('weddingExp3Desc'), image: '/images/experiences/rovinj.jpg' },
    { title: t('weddingExp4Title'), description: t('weddingExp4Desc'), image: '/images/experiences/cooking-class.jpg' },
  ];
  useEffect(() => { const ctx = gsap.context(() => { if (!sectionRef.current) return; const items = sectionRef.current.querySelectorAll('.exp-card'); items.forEach((item, i) => { gsap.fromTo(item, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, scrollTrigger: { trigger: item, start: 'top 88%' } }); const img = item.querySelector('img'); if (img) gsap.fromTo(img, { scale: 1.1 }, { scale: 1, scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } }); }); }); return () => ctx.revert(); }, []);
  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><p className="label-section mb-16 lg:mb-24">(WEDDING WEEK)</p><h2 className="display-lg mb-6">{t('weddingWeekTitle')}</h2><p className="body-editorial mb-16">{t('weddingWeekSubtitle')}</p><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{expList.map((exp) => (<div key={exp.title} className="exp-card group overflow-hidden rounded-sm border border-line transition-all duration-500 hover:border-line-strong"><div className="aspect-[3/4] relative overflow-hidden"><Image src={exp.image} alt={exp.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" quality={75} /><div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" /><div className="absolute inset-0 flex flex-col justify-end p-6"><h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{exp.title}</h3><p className="mt-2 text-sm leading-relaxed text-text-muted">{exp.description}</p></div></div></div>))}</div></div></section>
  );
}

function WeddingCTA() {
  const t = useTranslations('weddings');
  const tc = useTranslations('common');
  return (<section className="bg-bg"><div className="line-h" /><div className="py-32 lg:py-48"><div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center"><h2 className="display-lg">{t('ctaTitle')}</h2><p className="mt-6 micro-italic">{t('ctaSubtitle')}</p><div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"><Link href="/contact" className="btn-editorial">{t('requestPackage')}</Link><a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="btn-editorial">{tc('whatsappUs')}</a></div></div></div><div className="line-h" /></section>);
}

export default function WeddingsPage() {
  return (<main><WeddingHero /><WhyIstria /><WeddingPackages /><WeddingExperiences /><WeddingCTA /></main>);
}
