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

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function PricingHero() {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      <Image src="/images/beluga/beluga-40.jpg" alt="Villa Beluga exterior view" fill className="object-cover" priority quality={85} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
        <div ref={titleRef} className="max-w-[90vw]">
          <div className="overflow-hidden"><h1 className="hero-line display-hero text-white">PRICING</h1></div>
        </div>
        <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right">
          <p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">Season 2026</p>
          <p className="mt-4 text-[0.75rem] leading-relaxed text-white/50 font-body">Transparent pricing. No hidden fees.</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRICING TABLES
   ═══════════════════════════════════════════════════════════ */
function PricingTables() {
  const [activeTab, setActiveTab] = useState<PricingTab>('standard');

  const tabs: { key: PricingTab; label: string }[] = [
    { key: 'standard', label: 'Standard' },
    { key: 'wedding', label: 'Wedding' },
    { key: 'corporate', label: 'Corporate' },
  ];

  const pricingData = {
    standard: standardPricing,
    wedding: weddingPricing,
    corporate: corporatePricing,
  };

  const notes = {
    standard: 'Rates are per villa, per night. Both Villa Ballena and Villa Beluga share the same pricing.',
    wedding: 'Wedding rates include a 50% event premium over standard accommodation rates. Rates are per villa — book both villas for the Grand Celebration package.',
    corporate: 'Corporate rates include a +25% premium for exclusive use. EU invoicing available. VAT-compliant receipts provided for all bookings.',
  };

  const startingPrices = {
    standard: 600,
    wedding: 900,
    corporate: 750,
  };

  return (
    <section className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
        {/* Starting price highlight */}
        <div className="mb-12 text-center">
          <p className="label-section mb-4">
            {activeTab === 'standard' ? '(STANDARD)' : activeTab === 'wedding' ? '(WEDDING)' : '(CORPORATE)'}
          </p>
          <p className="font-heading text-[0.6875rem] uppercase tracking-[0.3em] text-text-dim">
            {activeTab === 'standard' ? 'Starting from' : activeTab === 'wedding' ? 'Wedding rates from' : 'Corporate rates from'}
          </p>
          <p className="mt-4 display-lg">
            &euro;{startingPrices[activeTab]}
            <span className="ml-2 text-lg font-normal text-text-muted">/night</span>
          </p>
        </div>

        {/* Tab buttons */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn-editorial !text-[0.625rem] !px-6 !py-2 ${activeTab === tab.key ? '!bg-text !text-bg !border-text' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-sm border border-line">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-bg-elevated">
                <th className="px-6 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">Period</th>
                <th className="px-6 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">Rate / Night</th>
                <th className="px-6 py-4 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">Min. Stay</th>
              </tr>
            </thead>
            <tbody>
              {pricingData[activeTab].map((row, i) => (
                <tr key={`${activeTab}-${row.period}`} className={i % 2 === 0 ? 'bg-bg' : 'bg-bg-elevated'}>
                  <td className="px-6 py-4 text-sm text-text">{row.period}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-text">&euro;{row.price}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">{row.minStay} nights</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-center text-sm text-text-dim">{notes[activeTab]}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHAT'S INCLUDED
   ═══════════════════════════════════════════════════════════ */
function WhatsIncluded() {
  const sectionRef = useRef<HTMLElement>(null);

  const included = [
    'Bed linen', 'Towels', 'Pool towels', 'Final cleaning',
    'WiFi (125 Mbit/s)', 'Netflix & Smart TV', 'Parking (4 cars)', 'Pets welcome (up to 2)',
  ];

  const notIncluded = [
    { item: 'Security deposit', note: '\u20AC1,500 (refundable)' },
    { item: 'Private chef', note: 'Available on request' },
    { item: 'Daily cleaning', note: 'Available on request' },
    { item: 'Airport transfer', note: 'Pula Airport, 33 km' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll('.inc-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: i * 0.1, scrollTrigger: { trigger: card, start: 'top 85%' } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(INCLUSIONS)</p>
        <h2 className="display-lg mb-16">What&apos;s Included</h2>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="inc-card rounded-sm border border-line bg-bg p-8">
            <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text mb-6">Included in Every Stay</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {included.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-text">&#10003;</span>
                  <span className="text-sm text-text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="inc-card rounded-sm border border-line bg-bg p-8">
            <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text-dim mb-6">Not Included</h3>
            <div className="space-y-4">
              {notIncluded.map((entry) => (
                <div key={entry.item} className="flex items-start gap-3">
                  <span className="text-text-dim">+</span>
                  <div>
                    <span className="text-sm text-text-muted">{entry.item}</span>
                    <span className="ml-2 text-sm text-text-dim">&mdash; {entry.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════════════ */
function PricingCTA() {
  return (
    <section className="bg-bg">
      <div className="line-h" />
      <div className="py-32 lg:py-48">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
          <h2 className="display-lg">Ready to Book?</h2>
          <p className="mt-6 micro-italic">Limited summer 2026 availability &mdash; secure your dates today</p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn-editorial">Check Availability</Link>
            <a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="btn-editorial">WhatsApp Us</a>
          </div>
        </div>
      </div>
      <div className="line-h" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRICING PAGE
   ═══════════════════════════════════════════════════════════ */
export default function PricingPage() {
  return (
    <main>
      <PricingHero />
      <PricingTables />
      <WhatsIncluded />
      <PricingCTA />
    </main>
  );
}
