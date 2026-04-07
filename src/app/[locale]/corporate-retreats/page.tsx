'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { corporatePricing } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function CorporateHero() {
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
      <Image src="/images/ballena/ballena-33.jpg" alt="Villa Ballena exterior at sunset" fill className="object-cover" priority quality={85} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
        <div ref={titleRef} className="max-w-[90vw]">
          <div className="overflow-hidden"><h1 className="hero-line display-hero text-white">CORPORATE</h1></div>
          <div className="overflow-hidden"><h1 className="hero-line display-hero text-white italic">Retreats</h1></div>
        </div>
        <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right">
          <p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">Strategy meets Mediterranean tranquility</p>
          <p className="mt-4 text-[0.75rem] leading-relaxed text-white/50 font-body">Svetvin&#269;enat, Istria</p>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-heading text-[0.5625rem] uppercase tracking-[0.3em] text-white/40">Scroll</span>
          <div className="h-8 w-px bg-white/20 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   VENUE CAPABILITIES
   ═══════════════════════════════════════════════════════════ */
function VenueCapabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  const capabilities = [
    { title: 'High-Speed WiFi', value: '125 Mbit/s', description: 'Reliable fibre-optic connectivity throughout both properties. Video calls, cloud access, and presentations without interruption.' },
    { title: 'Flexible Workspaces', value: '350 m\u00B2 per villa', description: 'Multiple indoor and outdoor areas adaptable for workshops, breakout sessions, and plenary meetings. Open-air terraces for creative thinking.' },
    { title: 'AV-Ready Spaces', value: 'Smart TV & Sound', description: 'Smart TVs with screen casting, Bluetooth sound systems, and ample power outlets. Netflix and streaming for evening entertainment.' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.cap-card');
      gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(CAPABILITIES)</p>
        <h2 className="display-lg mb-6">Venue Capabilities</h2>
        <p className="body-editorial mb-16">Everything your team needs to focus, collaborate, and recharge</p>

        <div className="grid gap-8 md:grid-cols-3">
          {capabilities.map((cap) => (
            <div key={cap.title} className="cap-card rounded-sm border border-line bg-bg p-8 text-center transition-all duration-300 hover:border-line-strong">
              <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{cap.title}</h3>
              <p className="mt-2 display-md !text-2xl !not-italic !font-bold">{cap.value}</p>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   STRATEGY OFFSITE PACKAGE
   ═══════════════════════════════════════════════════════════ */
function StrategyPackage() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.fromTo(sectionRef.current.querySelector('.package-box'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
        <p className="label-section mb-16">(PACKAGE)</p>
        <h2 className="display-lg mb-2">Strategy Offsite Package</h2>
        <p className="micro-italic mb-12">The complete corporate retreat experience</p>

        <div className="package-box rounded-sm border border-line bg-bg-elevated p-8 md:p-12">
          <p className="body-editorial !max-w-none">
            Our Strategy Offsite Package transforms Villa Ballena and Villa Beluga into your private executive retreat. With exclusive use of both properties, your team of up to 18 can work, collaborate, and unwind in a setting that inspires breakthrough thinking.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text">Included</h4>
              <ul className="mt-4 space-y-3 text-sm text-text-muted">
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Exclusive use of both villas (up to 18 guests)</span></li>
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Multiple indoor &amp; outdoor work zones</span></li>
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>High-speed WiFi (125 Mbit/s)</span></li>
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Smart TVs &amp; Bluetooth audio</span></li>
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Sauna &amp; wellness area (Villa Ballena)</span></li>
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text">&#10003;</span><span>Game room for team bonding (Villa Beluga)</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">Available Add-Ons</h4>
              <ul className="mt-4 space-y-3 text-sm text-text-muted">
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>Private chef &amp; catering services</span></li>
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>Daily housekeeping</span></li>
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>Airport transfers (Pula, 33 km)</span></li>
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>Team-building activity coordination</span></li>
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>Local restaurant reservations</span></li>
                <li className="flex items-start gap-3"><span className="mt-0.5 text-text-dim">+</span><span>Car rental arrangements</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEAM-BUILDING ACTIVITIES
   ═══════════════════════════════════════════════════════════ */
function TeamBuilding() {
  const sectionRef = useRef<HTMLElement>(null);

  const activities = [
    { title: 'Truffle Hunting', description: 'Navigate Istrian forests with a local guide and truffle dogs. A unique team challenge that combines nature, competition, and culinary reward.' },
    { title: 'Wine Tasting', description: 'Private group tastings at award-winning Istrian wineries. Learn about Malvazija and Teran while bonding over shared discovery.' },
    { title: 'Cooking Class', description: 'Collaborative cooking with a local chef. Teams compete to create the best Istrian dishes using fresh, seasonal ingredients.' },
    { title: 'Tennis Tournament', description: 'Organize a friendly doubles tournament on the shared clay tennis court. Ideal for healthy competition and team spirit.' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.activity-card');
      gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(TEAM BUILDING)</p>
        <h2 className="display-lg mb-6">Team-Building Activities</h2>
        <p className="body-editorial mb-16">Strengthen bonds beyond the boardroom</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((act, i) => (
            <div key={act.title} className="activity-card rounded-sm border border-line bg-bg p-8 transition-all duration-300 hover:border-line-strong">
              <span className="font-heading text-[0.6875rem] text-text-dim">({String(i + 1).padStart(2, '0')})</span>
              <h3 className="mt-4 font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{act.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{act.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CORPORATE PRICING TABLE
   ═══════════════════════════════════════════════════════════ */
function CorporatePricingTable() {
  return (
    <section className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
        <p className="label-section mb-16">(RATES)</p>
        <h2 className="display-lg mb-4">Corporate Rates</h2>
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
              {corporatePricing.map((row, i) => (
                <tr key={row.period} className={i % 2 === 0 ? 'bg-bg' : 'bg-bg-elevated'}>
                  <td className="px-6 py-4 text-sm text-text">{row.period}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-text">&euro;{row.price}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">{row.minStay} nights</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-2 text-center text-sm text-text-dim">
          <p>
            Corporate rates include a +25% premium for exclusive use.
            Rates are per villa &mdash; book both villas for the full Complex BeBa experience.
          </p>
          <p>
            EU invoicing available. VAT-compliant receipts provided for all bookings.
            Contact us for multi-week or recurring retreat discounts.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════════════ */
function CorporateCTA() {
  return (
    <section className="bg-[#1B2A4A] text-white">
      <div className="py-32 lg:py-48">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
          <h2 className="display-lg !text-white">Elevate Your Next Offsite</h2>
          <p className="mt-6 font-accent text-sm italic text-white/60">Where strategy and inspiration converge</p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn-editorial !border-white/30 !text-white hover:!bg-white hover:!text-[#1B2A4A]">Get Corporate Quote</Link>
            <a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="btn-editorial !border-white/30 !text-white hover:!bg-white hover:!text-[#1B2A4A]">WhatsApp Us</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CORPORATE RETREATS PAGE
   ═══════════════════════════════════════════════════════════ */
export default function CorporateRetreatsPage() {
  return (
    <main>
      <CorporateHero />
      <VenueCapabilities />
      <StrategyPackage />
      <TeamBuilding />
      <CorporatePricingTable />
      <CorporateCTA />
    </main>
  );
}
