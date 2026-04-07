'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { weddingPricing } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function WeddingHero() {
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
      <Image src="/images/beluga/Beluga 33.jpg" alt="Villa Beluga evening ambiance for weddings" fill className="object-cover" priority quality={85} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
        <div ref={titleRef} className="max-w-[90vw]">
          <div className="overflow-hidden"><h1 className="hero-line display-hero text-white italic">Your Dream</h1></div>
          <div className="overflow-hidden"><h1 className="hero-line display-hero text-white">WEDDING</h1></div>
        </div>
        <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right">
          <p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">Where Mediterranean romance meets luxury</p>
          <p className="mt-4 text-[0.75rem] leading-relaxed text-white/50 font-body">Svetvin&#269;enat, Istria</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHY ISTRIA
   ═══════════════════════════════════════════════════════════ */
function WhyIstria() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) gsap.fromTo(textRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: textRef.current, start: 'top 85%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(WHY ISTRIA)</p>
        <div ref={textRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <h2 className="display-lg">Why Istria</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="display-md mb-8">Imagine exchanging vows beneath the ancient stone walls of Svetvin&#269;enat, as the golden light of the Istrian sunset washes over centuries-old olive groves.</p>
            <p className="body-editorial !max-w-none">
              Nestled in the heart of Istria, our twin luxury villas offer an intimate, private setting for your celebration. The medieval castle of Morosini-Grimani stands just 550 meters away, providing a dramatic backdrop for ceremonies and photographs. With world-class gastronomy, award-winning wines, and the Adriatic coast minutes away, Svetvin&#269;enat is where timeless romance meets modern luxury.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WEDDING PACKAGES
   ═══════════════════════════════════════════════════════════ */
function WeddingPackages() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll('.package-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.2, scrollTrigger: { trigger: card, start: 'top 85%' } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(PACKAGES)</p>
        <h2 className="display-lg mb-6">Wedding Packages</h2>
        <p className="body-editorial mb-16">Two exclusive options for your celebration</p>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Istrian Romance */}
          <div className="package-card rounded-sm border border-line bg-bg p-8 md:p-10">
            <span className="label-section">(INTIMATE)</span>
            <h3 className="mt-4 display-md !text-2xl !not-italic !font-bold">Istrian Romance</h3>
            <p className="mt-2 micro-italic">Up to 30 guests &middot; One villa</p>
            <div className="my-6 line-h" />
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Exclusive use of one luxury villa (8+1 guests accommodation)</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Private heated pool &amp; manicured grounds</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Outdoor ceremony space with Mediterranean backdrop</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Al fresco dining for up to 30 guests</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Wedding coordination assistance</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Recommended local vendors &amp; caterers</span></li>
            </ul>
            <Link href="/contact" className="btn-editorial mt-8 w-fit">Inquire Now</Link>
          </div>

          {/* Grand Celebration */}
          <div className="package-card rounded-sm border border-line-strong bg-bg p-8 md:p-10">
            <span className="label-section">(GRAND)</span>
            <h3 className="mt-4 display-md !text-2xl !not-italic !font-bold">Grand Celebration</h3>
            <p className="mt-2 micro-italic">Up to 60 guests &middot; Both villas</p>
            <div className="my-6 line-h" />
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Exclusive use of both Villa Ballena &amp; Villa Beluga</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Combined capacity: 18 guests accommodation</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Two heated pools, sauna, game room access</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Grand outdoor reception for up to 60 guests</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Shared clay tennis court</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Dedicated wedding planner coordination</span></li>
              <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Private chef &amp; full catering arrangement</span></li>
            </ul>
            <Link href="/contact" className="btn-editorial mt-8 w-fit">Request Grand Package</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WEDDING PRICING TABLE
   ═══════════════════════════════════════════════════════════ */
function WeddingPricingTable() {
  return (
    <section className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
        <p className="label-section mb-16">(RATES)</p>
        <h2 className="display-lg mb-4">Wedding Rates</h2>
        <p className="body-editorial mb-12">Per villa, per night &middot; Season 2026</p>

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
              {weddingPricing.map((row, i) => (
                <tr key={row.period} className={i % 2 === 0 ? 'bg-bg' : 'bg-bg-elevated'}>
                  <td className="px-6 py-4 text-sm text-text">{row.period}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-text">&euro;{row.price}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">{row.minStay} nights</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-center text-sm text-text-dim">
          Wedding rates include a 50% event premium over standard accommodation rates.
          Rates are per villa &mdash; book both villas for the Grand Celebration package.
          All prices exclude additional catering, decoration, and vendor services.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WEDDING WEEK EXPERIENCES
   ═══════════════════════════════════════════════════════════ */
function WeddingExperiences() {
  const sectionRef = useRef<HTMLElement>(null);

  const expList = [
    { title: 'Wine Tasting', description: 'A curated private tasting at renowned Istrian wineries. Toast your love with Malvazija and Teran among the vineyards.', image: '/images/experiences/wine tasting.jpg' },
    { title: 'Truffle Hunting', description: 'An unforgettable pre-wedding adventure through ancient oak forests, guided by local hunters and their truffle dogs.', image: '/images/experiences/tartufi.jpg' },
    { title: 'Rovinj Excursion', description: 'Explore the pastel-colored streets of Rovinj. Perfect for couple portraits, bridal party outings, or a rehearsal dinner by the harbor.', image: '/images/experiences/Rovinj.jpg' },
    { title: 'Cooking Class', description: 'Bond with your wedding party over handmade pasta, fresh truffles, and Istrian olive oil in a private chef-led cooking class.', image: '/images/experiences/cooking class.jpg' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.exp-card');
      items.forEach((item, i) => {
        gsap.fromTo(item, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, scrollTrigger: { trigger: item, start: 'top 88%' } });
        const img = item.querySelector('img');
        if (img) gsap.fromTo(img, { scale: 1.1 }, { scale: 1, scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(WEDDING WEEK)</p>
        <h2 className="display-lg mb-6">Wedding Week Experiences</h2>
        <p className="body-editorial mb-16">Create unforgettable memories beyond the big day</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {expList.map((exp) => (
            <div key={exp.title} className="exp-card group overflow-hidden rounded-sm border border-line transition-all duration-500 hover:border-line-strong">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image src={exp.image} alt={exp.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" quality={75} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-white">{exp.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════════════ */
function WeddingCTA() {
  return (
    <section className="bg-[#1B2A4A] text-white">
      <div className="py-32 lg:py-48">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
          <h2 className="display-lg !text-white">Begin Your Forever</h2>
          <p className="mt-6 font-accent text-sm italic text-white/60">Limited dates available for 2026 wedding season</p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn-editorial !border-white/30 !text-white hover:!bg-white hover:!text-[#1B2A4A]">Request Wedding Package</Link>
            <a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="btn-editorial !border-white/30 !text-white hover:!bg-white hover:!text-[#1B2A4A]">WhatsApp Us</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WEDDING PAGE
   ═══════════════════════════════════════════════════════════ */
export default function WeddingsPage() {
  return (
    <main>
      <WeddingHero />
      <WhyIstria />
      <WeddingPackages />
      <WeddingExperiences />
      <WeddingCTA />
    </main>
  );
}
