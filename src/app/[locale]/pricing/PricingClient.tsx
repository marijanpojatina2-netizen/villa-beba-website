'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { standardPricing, weddingPricing, corporatePricing } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

type PricingTab = 'standard' | 'wedding' | 'corporate';

function PricingHero() {
  const t = useTranslations('pricing');
  const titleRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const ctx = gsap.context(() => { if (titleRef.current) { const lines = titleRef.current.querySelectorAll('.hero-line'); gsap.fromTo(lines, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 }); } }); return () => ctx.revert(); }, []);
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image src="/images/beluga/beluga-40.jpg" alt="Villa Beluga exterior view" fill className="object-cover" priority quality={85} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
        <div ref={titleRef} className="max-w-[90vw]"><div className="overflow-hidden"><h1 className="hero-line display-hero text-white">PRICING</h1></div></div>
        <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right"><p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">{t('season2026')}</p><p className="mt-4 text-[0.75rem] leading-relaxed text-white/50 font-body">{t('transparentPricing')}</p></div>
      </div>
    </section>
  );
}

function PricingTables() {
  const t = useTranslations('pricing');
  const tc = useTranslations('common');
  const [activeTab, setActiveTab] = useState<PricingTab>('standard');
  const tabs: { key: PricingTab; label: string }[] = [{ key: 'standard', label: t('tabStandard') }, { key: 'wedding', label: t('tabWedding') }, { key: 'corporate', label: t('tabCorporate') }];
  const pricingData = { standard: standardPricing, wedding: weddingPricing, corporate: corporatePricing };
  const notes: Record<PricingTab, string> = { standard: t('standardNote'), wedding: t('weddingNote'), corporate: t('corporateNote') };
  const startingPrices = { standard: 600, wedding: 900, corporate: 750 };
  const startingLabels: Record<PricingTab, string> = { standard: t('startingFrom'), wedding: t('weddingRatesFrom'), corporate: t('corporateRatesFrom') };

  return (
    <section className="section-editorial bg-bg"><div className="mx-auto max-w-[1000px] px-6 lg:px-10"><div className="mb-12 text-center"><p className="label-section mb-4">{activeTab === 'standard' ? '(STANDARD)' : activeTab === 'wedding' ? '(WEDDING)' : '(CORPORATE)'}</p><p className="font-heading text-[0.6875rem] uppercase tracking-[0.3em] text-text-dim">{startingLabels[activeTab]}</p><p className="mt-4 display-lg">&euro;{startingPrices[activeTab]}<span className="ml-2 text-lg font-normal text-text-muted">{t('perNight')}</span></p></div><div className="mb-10 flex flex-wrap justify-center gap-2">{tabs.map((tab) => (<button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`btn-editorial !text-[0.625rem] !px-6 !py-2 ${activeTab === tab.key ? '!bg-text !text-bg !border-text' : ''}`}>{tab.label}</button>))}</div><div className="overflow-hidden rounded-sm border border-line"><table className="w-full text-left"><thead><tr className="border-b border-line bg-bg-elevated"><th className="px-6 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('tablePeriod')}</th><th className="px-6 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('tableRate')}</th><th className="px-6 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('tableMinStay')}</th></tr></thead><tbody>{pricingData[activeTab].map((row, i) => (<tr key={`${activeTab}-${row.period}`} className={i % 2 === 0 ? 'bg-bg' : 'bg-bg-elevated'}><td className="px-6 py-4 text-sm text-text">{row.period}</td><td className="px-6 py-4 text-sm font-semibold text-text">&euro;{row.price}</td><td className="px-6 py-4 text-sm text-text-muted">{row.minStay} {tc('nights')}</td></tr>))}</tbody></table></div><p className="mt-6 text-center text-sm text-text-dim">{notes[activeTab]}</p></div></section>
  );
}

function WhatsIncluded() {
  const t = useTranslations('pricing');
  const sectionRef = useRef<HTMLElement>(null);
  const included = [t('inc1'), t('inc2'), t('inc3'), t('inc4'), t('inc5'), t('inc6'), t('inc7'), t('inc8')];
  const notIncluded = [{ item: t('notInc1'), note: t('notInc1Note') }, { item: t('notInc2'), note: t('notInc2Note') }, { item: t('notInc3'), note: t('notInc3Note') }, { item: t('notInc4'), note: t('notInc4Note') }];
  useEffect(() => { const ctx = gsap.context(() => { if (!sectionRef.current) return; const cards = sectionRef.current.querySelectorAll('.inc-card'); cards.forEach((card, i) => { gsap.fromTo(card, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: i * 0.1, scrollTrigger: { trigger: card, start: 'top 85%' } }); }); }); return () => ctx.revert(); }, []);
  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><p className="label-section mb-16 lg:mb-24">(INCLUSIONS)</p><h2 className="display-lg mb-16">{t('whatsIncluded')}</h2><div className="grid gap-8 md:grid-cols-2"><div className="inc-card rounded-sm border border-line bg-bg p-8"><h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text mb-6">{t('includedInEveryStay')}</h3><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{included.map((item, i) => (<div key={i} className="flex items-center gap-3"><span className="text-text">&#10003;</span><span className="text-sm text-text-muted">{item}</span></div>))}</div></div><div className="inc-card rounded-sm border border-line bg-bg p-8"><h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text-dim mb-6">{t('notIncluded')}</h3><div className="space-y-4">{notIncluded.map((entry, i) => (<div key={i} className="flex items-start gap-3"><span className="text-text-dim">+</span><div><span className="text-sm text-text-muted">{entry.item}</span><span className="ml-2 text-sm text-text-dim">&mdash; {entry.note}</span></div></div>))}</div></div></div></div></section>
  );
}

function PricingCTA() {
  const t = useTranslations('pricing');
  const tc = useTranslations('common');
  return (<section className="bg-bg"><div className="line-h" /><div className="py-32 lg:py-48"><div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center"><h2 className="display-lg">{t('ctaTitle')}</h2><p className="mt-6 micro-italic">{t('ctaSubtitle')}</p><div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"><Link href="/contact" className="btn-editorial">{t('checkAvailability')}</Link><a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="btn-editorial">{tc('whatsappUs')}</a></div></div></div><div className="line-h" /></section>);
}

export default function PricingPage() {
  return (<main><PricingHero /><PricingTables /><WhatsIncluded /><PricingCTA /></main>);
}
