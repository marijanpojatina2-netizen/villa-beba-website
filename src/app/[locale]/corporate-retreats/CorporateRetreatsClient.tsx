'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { corporatePricing } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

function CorporateHero() {
  const t = useTranslations('corporate');
  const tc = useTranslations('common');
  const titleRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const ctx = gsap.context(() => { if (titleRef.current) { const lines = titleRef.current.querySelectorAll('.hero-line'); gsap.fromTo(lines, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 }); } }); return () => ctx.revert(); }, []);
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image src="/images/ballena/ballena-33.jpg" alt="Villa Ballena exterior at sunset" fill className="object-cover" priority quality={85} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
        <div ref={titleRef} className="max-w-[90vw]">
          <h1 className="display-hero text-white">
            <span className="block overflow-hidden"><span className="hero-line block">{t('heroTitle1')}</span></span>
            <span className="block overflow-hidden"><span className="hero-line block italic">{t('heroTitle2')}</span></span>
          </h1>
        </div>
        <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right"><p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">{t('subtitle')}</p><p className="mt-4 text-[0.75rem] leading-relaxed text-white/50 font-body">Svetvin&#269;enat, Istria</p></div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"><span className="font-heading text-[0.5625rem] uppercase tracking-[0.3em] text-white/40">{tc('scroll')}</span><div className="h-8 w-px bg-white/20 animate-pulse" /></div>
      </div>
    </section>
  );
}

function VenueCapabilities() {
  const t = useTranslations('corporate');
  const sectionRef = useRef<HTMLElement>(null);
  const capabilities = [
    { title: t('capWifiTitle'), value: t('capWifiValue'), description: t('capWifiDesc') },
    { title: t('capWorkspacesTitle'), value: t('capWorkspacesValue'), description: t('capWorkspacesDesc') },
    { title: t('capAvTitle'), value: t('capAvValue'), description: t('capAvDesc') },
  ];
  useEffect(() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const ctx = gsap.context(() => { if (!sectionRef.current) return; const items = sectionRef.current.querySelectorAll('.cap-card'); gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }); }); return () => ctx.revert(); }, []);
  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><p className="label-section mb-16 lg:mb-24">(CAPABILITIES)</p><h2 className="display-lg mb-6">{t('venueCapabilities')}</h2><p className="body-editorial mb-16">{t('venueSubtitle')}</p><div className="grid gap-8 md:grid-cols-3">{capabilities.map((cap) => (<div key={cap.title} className="cap-card rounded-sm border border-line bg-bg p-8 text-center transition-all duration-300 hover:border-line-strong"><h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{cap.title}</h3><p className="mt-2 display-md !text-2xl !not-italic !font-bold">{cap.value}</p><p className="mt-4 text-sm leading-relaxed text-text-muted">{cap.description}</p></div>))}</div></div></section>
  );
}

function StrategyPackage() {
  const t = useTranslations('corporate');
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const ctx = gsap.context(() => { if (sectionRef.current) gsap.fromTo(sectionRef.current.querySelector('.package-box'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }); }); return () => ctx.revert(); }, []);
  return (
    <section ref={sectionRef} className="section-editorial bg-bg"><div className="mx-auto max-w-[1000px] px-6 lg:px-10"><p className="label-section mb-16">(PACKAGE)</p><h2 className="display-lg mb-2">{t('packageTitle')}</h2><p className="micro-italic mb-12">{t('packageSubtitle')}</p><div className="package-box rounded-sm border border-line bg-bg-elevated p-8 md:p-12"><p className="body-editorial !max-w-none">{t('packageBody')}</p><div className="mt-8 grid gap-8 sm:grid-cols-2"><div><h4 className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text">{t('included')}</h4><ul className="mt-4 space-y-3 text-sm text-text-muted"><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('includedItem1')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('includedItem2')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('includedItem3')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('includedItem4')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('includedItem5')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>{t('includedItem6')}</span></li></ul></div><div><h4 className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('addOns')}</h4><ul className="mt-4 space-y-3 text-sm text-text-muted"><li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>{t('addOn1')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>{t('addOn2')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>{t('addOn3')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>{t('addOn4')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>{t('addOn5')}</span></li><li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>{t('addOn6')}</span></li></ul></div></div></div></div></section>
  );
}

function TeamBuilding() {
  const t = useTranslations('corporate');
  const sectionRef = useRef<HTMLElement>(null);
  const activities = [
    { title: t('teamAct1Title'), description: t('teamAct1Desc') },
    { title: t('teamAct2Title'), description: t('teamAct2Desc') },
    { title: t('teamAct3Title'), description: t('teamAct3Desc') },
    { title: t('teamAct4Title'), description: t('teamAct4Desc') },
  ];
  useEffect(() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const ctx = gsap.context(() => { if (!sectionRef.current) return; const items = sectionRef.current.querySelectorAll('.activity-card'); gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }); }); return () => ctx.revert(); }, []);
  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><p className="label-section mb-16 lg:mb-24">(TEAM BUILDING)</p><h2 className="display-lg mb-6">{t('teamBuildingTitle')}</h2><p className="body-editorial mb-16">{t('teamBuildingSubtitle')}</p><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{activities.map((act, i) => (<div key={act.title} className="activity-card rounded-sm border border-line bg-bg p-8 transition-all duration-300 hover:border-line-strong"><span className="font-heading text-[0.6875rem] text-text-dim">({String(i + 1).padStart(2, '0')})</span><h3 className="mt-4 font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{act.title}</h3><p className="mt-3 text-sm leading-relaxed text-text-muted">{act.description}</p></div>))}</div></div></section>
  );
}

function CorporatePricingTable() {
  const t = useTranslations('corporate');
  const tc = useTranslations('common');
  return (
    <section className="section-editorial bg-bg"><div className="mx-auto max-w-[1000px] px-6 lg:px-10"><p className="label-section mb-16">(RATES)</p><h2 className="display-lg mb-4">{t('ratesTitle')}</h2><p className="body-editorial mb-12">{t('ratesSubtitle')}</p><div className="overflow-hidden rounded-sm border border-line"><table className="w-full text-left"><thead><tr className="border-b border-line bg-bg-elevated"><th className="px-6 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('tablePeriod')}</th><th className="px-6 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('tableRate')}</th><th className="px-6 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('tableMinStay')}</th></tr></thead><tbody>{corporatePricing.map((row, i) => (<tr key={row.period} className={i % 2 === 0 ? 'bg-bg' : 'bg-bg-elevated'}><td className="px-6 py-4 text-sm text-text">{row.period}</td><td className="px-6 py-4 text-sm font-semibold text-text">&euro;{row.price}</td><td className="px-6 py-4 text-sm text-text-muted">{row.minStay} {tc('nights')}</td></tr>))}</tbody></table></div><div className="mt-6 space-y-2 text-center text-sm text-text-dim"><p>{t('ratesNote1')}</p><p>{t('ratesNote2')}</p></div></div></section>
  );
}

function CorporateCTA() {
  const t = useTranslations('corporate');
  const tc = useTranslations('common');
  return (<section className="bg-bg"><div className="line-h" /><div className="py-32 lg:py-48"><div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center"><h2 className="display-lg">{t('ctaTitle')}</h2><p className="mt-6 micro-italic">{t('ctaSubtitle')}</p><div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"><Link href="/contact" className="btn-editorial">{t('getQuote')}</Link><a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="btn-editorial">{tc('whatsappUs')}</a></div></div></div><div className="line-h" /></section>);
}

export default function CorporateRetreatsPage() {
  return (<main><CorporateHero /><VenueCapabilities /><StrategyPackage /><TeamBuilding /><CorporatePricingTable /><CorporateCTA /></main>);
}
