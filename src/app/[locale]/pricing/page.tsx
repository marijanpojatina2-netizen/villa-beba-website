'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import CountUp from '@/components/animations/CountUp';
import { HeadingSlide, FadeUp, StaggerContainer, StaggerItem } from '@/components/animations/MotionWrappers';
import { standardPricing, weddingPricing, corporatePricing } from '@/lib/data';

type PricingTab = 'standard' | 'wedding' | 'corporate';

function PricingHero() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/ballena/Ballena 36.jpg" alt="Villa Ballena terrace and pool at night" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/60" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mb-6 font-accent text-lg italic tracking-wide text-gold/90 md:text-xl">Season 2026</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">Pricing &<br />Availability</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mx-auto mt-6 max-w-lg text-sm uppercase tracking-[0.3em] text-white/60 md:text-base">Transparent pricing. No hidden fees.</motion.p>
      </div>
    </section>
  );
}

function PricingTables() {
  const [activeTab, setActiveTab] = useState<PricingTab>('standard');
  const tabs: { key: PricingTab; label: string }[] = [
    { key: 'standard', label: 'Standard' },
    { key: 'wedding', label: 'Wedding' },
    { key: 'corporate', label: 'Corporate' },
  ];
  const pricingData = { standard: standardPricing, wedding: weddingPricing, corporate: corporatePricing };
  const notes = {
    standard: 'Rates are per villa, per night. Both Villa Ballena and Villa Beluga share the same pricing.',
    wedding: 'Wedding rates include a 50% event premium over standard accommodation rates. Rates are per villa — book both villas for the Grand Celebration package.',
    corporate: 'Corporate rates include a +25% premium for exclusive use. EU invoicing available. VAT-compliant receipts provided for all bookings.',
  };
  const startingPrices = { standard: 600, wedding: 900, corporate: 750 };

  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-wider text-body-dark/40">{activeTab === 'standard' ? 'Starting from' : activeTab === 'wedding' ? 'Wedding rates from' : 'Corporate rates from'}</p>
            <p className="mt-2 font-heading text-5xl font-bold text-body-dark md:text-6xl"><span className="text-gradient-gold">&euro;{startingPrices[activeTab]}</span><span className="ml-2 text-lg font-normal text-body-dark/40">/night</span></p>
          </div>
        </ScrollReveal>
        <FadeUp delay={0.1}>
          <div className="mb-8 flex items-center justify-center gap-1 rounded-full border border-body-dark/10 bg-white p-1">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeTab === tab.key ? 'bg-gold text-white shadow-sm' : 'text-body-dark/40 hover:text-body-dark'}`}>{tab.label}</button>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.15}>
          <div className="overflow-hidden rounded-xl border border-body-dark/10 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead><tr className="border-b border-body-dark/10 bg-body-dark/5"><th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-body-dark/70">Period</th><th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-body-dark/70">Rate / Night</th><th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-body-dark/70">Min. Stay</th></tr></thead>
              <tbody>{pricingData[activeTab].map((row, i) => (<tr key={`${activeTab}-${row.period}`} className={`transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-body-dark/[0.02]'}`}><td className="px-6 py-4 text-sm text-body-dark">{row.period}</td><td className="px-6 py-4 text-sm font-semibold text-body-dark">&euro;{row.price}</td><td className="px-6 py-4 text-sm text-body-dark/70">{row.minStay} nights</td></tr>))}</tbody>
            </table>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}><p className="mt-6 text-center text-sm text-body-dark/50">{notes[activeTab]}</p></FadeUp>
      </div>
    </section>
  );
}

function WhatsIncluded() {
  const included = ['Bed linen','Towels','Pool towels','Final cleaning','WiFi (125 Mbit/s)','Netflix & Smart TV','Parking (4 cars)','Pets welcome (up to 2)'];
  const notIncluded = [{ item: 'Security deposit', note: '\u20AC1,500 (refundable)' },{ item: 'Private chef', note: 'Available on request' },{ item: 'Daily cleaning', note: 'Available on request' },{ item: 'Airport transfer', note: 'Pula Airport, 33 km' }];

  return (
    <section className="section-padding bg-offwhite">
      <div className="mx-auto max-w-6xl px-6">
        <HeadingSlide className="mb-16 text-center"><h2 className="heading-lg text-3xl text-body-dark md:text-4xl">What&apos;s Included</h2></HeadingSlide>
        <div className="grid gap-12 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl border border-body-dark/5 bg-white p-8 shadow-sm">
              <h3 className="mb-6 heading-md text-lg text-gold">Included in Every Stay</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {included.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10"><svg className="h-3.5 w-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></span>
                    <span className="text-sm text-body-dark/60">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="rounded-2xl border border-body-dark/5 bg-white p-8 shadow-sm">
              <h3 className="mb-6 heading-md text-lg text-body-dark/50">Not Included</h3>
              <div className="space-y-4">
                {notIncluded.map((entry) => (
                  <div key={entry.item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-body-dark/5"><svg className="h-3.5 w-3.5 text-body-dark/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></span>
                    <div><span className="text-sm text-body-dark/60">{entry.item}</span><span className="ml-2 text-sm text-body-dark/40">&mdash; {entry.note}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function PricingCTA() {
  return (
    <section className="relative overflow-hidden bg-navy py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,169,110,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(201,169,110,0.06)_0%,transparent_50%)]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <h2 className="heading-lg text-3xl text-white md:text-4xl lg:text-5xl">Ready to Book?</h2>
          <p className="mt-6 font-accent text-xl italic text-gold/80">Limited summer 2026 availability &mdash; secure your dates today</p>
        </ScrollReveal>
        <FadeUp delay={0.15}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}><Link href="/contact" className="w-full rounded-full bg-gold px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] sm:w-auto">Check Availability</Link></motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}><a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="w-full rounded-full border border-gold/40 px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-gold transition-all duration-300 hover:bg-gold hover:text-white sm:w-auto">WhatsApp Us</a></motion.div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (<main><PricingHero /><PricingTables /><WhatsIncluded /><PricingCTA /></main>);
}
