'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';
import CountUp from '@/components/animations/CountUp';
import { corporatePricing } from '@/lib/data';

/* ─────────────────────────── Hero ─────────────────────────── */
function CorporateHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0">
        <Image src="/images/ballena/Ballena 33.jpg" alt="Villa Ballena exterior at sunset" fill className="object-cover" priority quality={85} />
        {/* No overlay — clean photo */}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center [text-shadow:0_2px_20px_rgba(0,0,0,0.7),0_4px_40px_rgba(0,0,0,0.5)]">
        <ScrollReveal>
          <p className="mb-6 font-accent text-lg italic tracking-wide text-gold md:text-xl">
            Svetvinčenat, Istria &middot; Croatia
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <h1 className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Corporate Retreats<br />in Istria
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-lg text-sm uppercase tracking-[0.3em] text-white/50 md:text-base">
            Strategy meets Mediterranean tranquility
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.45}>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-midnight transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]"
          >
            Get Corporate Quote
          </Link>
        </ScrollReveal>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
          <div className="animate-bounce">
            <svg className="h-5 w-5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────── Venue Capabilities ──────────────────── */
function VenueCapabilities() {
  const capabilities = [
    {
      icon: (
        <svg className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
        </svg>
      ),
      title: 'High-Speed WiFi',
      value: '125 Mbit/s',
      description: 'Reliable fibre-optic connectivity throughout both properties. Video calls, cloud access, and presentations without interruption.',
    },
    {
      icon: (
        <svg className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
      title: 'Flexible Workspaces',
      value: '350 m\u00B2 per villa',
      description: 'Multiple indoor and outdoor areas adaptable for workshops, breakout sessions, and plenary meetings. Open-air terraces for creative thinking.',
    },
    {
      icon: (
        <svg className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      title: 'AV-Ready Spaces',
      value: 'Smart TV & Sound',
      description: 'Smart TVs with screen casting, Bluetooth sound systems, and ample power outlets. Netflix and streaming for evening entertainment.',
    },
  ];

  return (
    <section className="section-padding bg-midnight-light">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="heading-lg text-3xl text-white md:text-4xl">
              Venue Capabilities
            </h2>
            <p className="mt-4 text-base text-white/60">
              Everything your team needs to focus, collaborate, and recharge
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <ScrollReveal key={cap.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border-2 border-gold/20 bg-midnight/50 p-8 text-center transition-all duration-500 hover:border-gold/40">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
                  {cap.icon}
                </div>
                <h3 className="mt-6 heading-md text-lg text-white">
                  {cap.title}
                </h3>
                <p className="mt-2 text-2xl font-bold text-gold font-heading">
                  {cap.value}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  {cap.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── Strategy Offsite Package ───────────────── */
function StrategyPackage() {
  return (
    <section className="section-padding bg-midnight">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="heading-lg text-3xl text-white md:text-4xl">
              Strategy Offsite Package
            </h2>
            <p className="mt-4 font-accent text-lg italic text-gold/80">
              The complete corporate retreat experience
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-12 rounded-2xl border border-gold/20 bg-midnight-light/50 p-8 md:p-12">
            <p className="text-base leading-relaxed text-white/70 md:text-lg">
              Our Strategy Offsite Package transforms Villa Ballena and Villa Beluga into your private executive retreat. With exclusive use of both properties, your team of up to 18 can work, collaborate, and unwind in a setting that inspires breakthrough thinking.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">
                  Included
                </h4>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">&#10003;</span>
                    <span>Exclusive use of both villas (up to 18 guests)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">&#10003;</span>
                    <span>Multiple indoor &amp; outdoor work zones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">&#10003;</span>
                    <span>High-speed WiFi (125 Mbit/s)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">&#10003;</span>
                    <span>Smart TVs &amp; Bluetooth audio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">&#10003;</span>
                    <span>Sauna &amp; wellness area (Villa Ballena)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">&#10003;</span>
                    <span>Game room for team bonding (Villa Beluga)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">
                  Available Add-Ons
                </h4>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">+</span>
                    <span>Private chef &amp; catering services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">+</span>
                    <span>Daily housekeeping</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">+</span>
                    <span>Airport transfers (Pula, 33 km)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">+</span>
                    <span>Team-building activity coordination</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">+</span>
                    <span>Local restaurant reservations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-gold">+</span>
                    <span>Car rental arrangements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────── Team-Building Activities ───────────────── */
function TeamBuilding() {
  const activities = [
    {
      title: 'Truffle Hunting',
      description: 'Navigate Istrian forests with a local guide and truffle dogs. A unique team challenge that combines nature, competition, and culinary reward.',
      gradient: 'from-[#0d2a1a] to-[#081a10]',
    },
    {
      title: 'Wine Tasting',
      description: 'Private group tastings at award-winning Istrian wineries. Learn about Malvazija and Teran while bonding over shared discovery.',
      gradient: 'from-[#2a1a0d] to-[#1a1008]',
    },
    {
      title: 'Cooking Class',
      description: 'Collaborative cooking with a local chef. Teams compete to create the best Istrian dishes using fresh, seasonal ingredients.',
      gradient: 'from-[#2a0d1a] to-[#1a0810]',
    },
    {
      title: 'Tennis Tournament',
      description: 'Organize a friendly doubles tournament on the shared clay tennis court. Ideal for healthy competition and team spirit.',
      gradient: 'from-[#0d1a2a] to-[#08101a]',
    },
  ];

  return (
    <section className="section-padding bg-midnight-light">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="heading-lg text-3xl text-white md:text-4xl">
              Team-Building Activities
            </h2>
            <p className="mt-4 text-base text-white/60">
              Strengthen bonds beyond the boardroom
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((act, i) => (
            <ScrollReveal key={act.title} delay={i * 0.1}>
              <div className="group overflow-hidden rounded-xl border border-white/5 transition-all duration-500 hover:border-gold/20">
                <div className={`aspect-[3/4] bg-gradient-to-b ${act.gradient} relative`}>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
                    <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
                      {act.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {act.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Corporate Pricing Table ────────────────── */
function CorporatePricingTable() {
  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="heading-lg text-3xl text-body-dark md:text-4xl">
              Corporate Rates
            </h2>
            <p className="mt-4 text-base text-body-dark/70">
              Per villa, per night &middot; Season 2026
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-body-dark/10 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-body-dark/10 bg-body-dark/5">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-body-dark/70">
                    Period
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-body-dark/70">
                    Rate / Night
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-body-dark/70">
                    Min. Stay
                  </th>
                </tr>
              </thead>
              <tbody>
                {corporatePricing.map((row, i) => (
                  <tr
                    key={row.period}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-body-dark/[0.02]'}
                  >
                    <td className="px-6 py-4 text-sm text-body-dark">
                      {row.period}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-body-dark">
                      &euro;{row.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-body-dark/70">
                      {row.minStay} nights
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-6 space-y-2 text-center text-sm text-body-dark/60">
            <p>
              Corporate rates include a +25% premium for exclusive use.
              Rates are per villa &mdash; book both villas for the full Complex BeBa experience.
            </p>
            <p>
              EU invoicing available. VAT-compliant receipts provided for all bookings.
              Contact us for multi-week or recurring retreat discounts.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA ──────────────────────────── */
function CorporateCTA() {
  return (
    <section className="relative overflow-hidden bg-midnight py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,169,110,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(201,169,110,0.06)_0%,transparent_50%)]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <h2 className="heading-lg text-3xl text-white md:text-4xl lg:text-5xl">
            Elevate Your Next Offsite
          </h2>
          <p className="mt-6 font-accent text-xl italic text-gold/80">
            Where strategy and inspiration converge
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="w-full rounded-full bg-gold px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-midnight transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] sm:w-auto"
            >
              Get Corporate Quote
            </Link>
            <a
              href="https://wa.me/385915251565"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-gold/40 px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-gold transition-all duration-300 hover:bg-gold hover:text-midnight sm:w-auto"
            >
              WhatsApp Us
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ═══════════════ CORPORATE RETREATS PAGE ════════════════════ */
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
