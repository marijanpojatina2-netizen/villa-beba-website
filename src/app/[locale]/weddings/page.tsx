'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import CountUp from '@/components/animations/CountUp';
import { StaggerContainer, StaggerItem, HeadingSlide, FadeUp, ScaleCard } from '@/components/animations/MotionWrappers';
import { weddingPricing } from '@/lib/data';

/* ─────────────────────────── Hero ─────────────────────────── */
function WeddingHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/ballena/Ballena 35-1.jpg" alt="Olive tree courtyard at Villa Ballena" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/60" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mb-6 font-accent text-lg italic tracking-wide text-gold/90 md:text-xl">Svetvinčenat, Istria &middot; Croatia</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">Your Dream Wedding<br />in Istria</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mx-auto mt-6 max-w-lg text-sm uppercase tracking-[0.3em] text-white/60 md:text-base">Where Mediterranean romance meets luxury</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="mt-10 inline-flex">
            <Link href="/contact" className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]">Request Wedding Package</Link>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }} className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
          <div className="animate-bounce"><svg className="h-5 w-5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" /></svg></div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────── Why Istria ─────────────────────── */
function WhyIstria() {
  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <HeadingSlide><h2 className="heading-lg text-3xl text-body-dark md:text-4xl">Why Istria</h2></HeadingSlide>
        <ScrollReveal delay={0.1}>
          <p className="mt-8 font-accent text-xl italic leading-relaxed text-gold md:text-2xl">
            Imagine exchanging vows beneath the ancient stone walls of Svetvinčenat, as the golden light of the Istrian sunset washes over centuries-old olive groves and the warm Mediterranean breeze carries the scent of lavender and sea salt.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="mt-6 text-base leading-relaxed text-body-dark/60 md:text-lg">
            Nestled in the heart of Istria, our twin luxury villas offer an intimate, private setting for your celebration. The medieval castle of Morosini-Grimani stands just 550 meters away, providing a dramatic backdrop for ceremonies and photographs. With world-class gastronomy, award-winning wines, and the Adriatic coast minutes away, Svetvinčenat is where timeless romance meets modern luxury.
          </p>
        </ScrollReveal>
        <FadeUp delay={0.3}><div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" /></FadeUp>
      </div>
    </section>
  );
}

/* ──────────────────── Wedding Packages ──────────────────── */
function WeddingPackages() {
  return (
    <section className="section-padding bg-offwhite">
      <div className="mx-auto max-w-7xl px-6">
        <HeadingSlide className="mb-16 text-center">
          <h2 className="heading-lg text-3xl text-body-dark md:text-4xl">Wedding Packages</h2>
          <p className="mt-4 text-base text-body-dark/50 md:text-lg">Two exclusive options for your celebration</p>
        </HeadingSlide>

        <div className="grid gap-8 md:grid-cols-2">
          <ScaleCard delay={0.1}>
            <div className="h-full rounded-2xl border-2 border-gold/30 bg-white p-8 shadow-sm transition-all duration-500 hover:border-gold/50 hover:shadow-md md:p-10">
              <div className="mb-6"><span className="inline-block rounded-full border border-gold/30 px-4 py-1 text-xs uppercase tracking-wider text-gold">Intimate</span></div>
              <h3 className="heading-md text-2xl text-body-dark">Istrian Romance</h3>
              <p className="mt-2 font-accent text-lg italic text-gold">Up to 30 guests &middot; One villa</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />
              <ul className="mt-6 space-y-3 text-sm text-body-dark/60">
                {['Exclusive use of one luxury villa (8+1 guests accommodation)','Private heated pool & manicured grounds','Outdoor ceremony space with Mediterranean backdrop','Al fresco dining for up to 30 guests','Wedding coordination assistance','Recommended local vendors & caterers'].map(item => (
                  <li key={item} className="flex items-start gap-3"><span className="mt-0.5 text-gold">&#10003;</span><span>{item}</span></li>
                ))}
              </ul>
              <div className="mt-8">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="inline-flex">
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-3 text-sm font-medium uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-white">Inquire Now</Link>
                </motion.div>
              </div>
            </div>
          </ScaleCard>

          <ScaleCard delay={0.2}>
            <div className="h-full rounded-2xl border-2 border-gold bg-gradient-to-br from-gold/5 via-gold/[0.02] to-white p-8 shadow-md transition-all duration-500 hover:shadow-lg md:p-10">
              <div className="mb-6"><span className="inline-block rounded-full bg-gold px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">Grand</span></div>
              <h3 className="heading-md text-2xl text-body-dark">Grand Celebration</h3>
              <p className="mt-2 font-accent text-lg italic text-gold">Up to 60 guests &middot; Both villas</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />
              <ul className="mt-6 space-y-3 text-sm text-body-dark/60">
                {['Exclusive use of both Villa Ballena & Villa Beluga','Combined capacity: 18 guests accommodation','Two heated pools, sauna, game room access','Grand outdoor reception for up to 60 guests','Shared clay tennis court','Dedicated wedding planner coordination','Private chef & full catering arrangement'].map(item => (
                  <li key={item} className="flex items-start gap-3"><span className="mt-0.5 text-gold">&#10003;</span><span>{item}</span></li>
                ))}
              </ul>
              <div className="mt-8">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="inline-flex">
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]">Request Grand Package</Link>
                </motion.div>
              </div>
            </div>
          </ScaleCard>
        </div>
      </div>
    </section>
  );
}

/* ────────────────── Wedding Pricing Table ────────────────── */
function WeddingPricingTable() {
  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-4xl px-6">
        <HeadingSlide className="mb-12 text-center">
          <h2 className="heading-lg text-3xl text-body-dark md:text-4xl">Wedding Rates</h2>
          <p className="mt-4 text-base text-body-dark/50">Per villa, per night &middot; Season 2026</p>
        </HeadingSlide>
        <FadeUp delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-body-dark/10 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead><tr className="border-b border-body-dark/10 bg-body-dark/5"><th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-body-dark/70">Period</th><th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-body-dark/70">Rate / Night</th><th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-body-dark/70">Min. Stay</th></tr></thead>
              <tbody>
                {weddingPricing.map((row, i) => (
                  <tr key={row.period} className={i % 2 === 0 ? 'bg-white' : 'bg-body-dark/[0.02]'}>
                    <td className="px-6 py-4 text-sm text-body-dark">{row.period}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-body-dark">&euro;{row.price}</td>
                    <td className="px-6 py-4 text-sm text-body-dark/70">{row.minStay} nights</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}><p className="mt-6 text-center text-sm text-body-dark/50">Wedding rates include a 50% event premium over standard accommodation rates. Rates are per villa &mdash; book both villas for the Grand Celebration package. All prices exclude additional catering, decoration, and vendor services.</p></FadeUp>
      </div>
    </section>
  );
}

/* ──────────────── Wedding Week Experiences ───────────────── */
function WeddingExperiences() {
  const experiences = [
    { title: 'Wine Tasting', description: 'A curated private tasting at renowned Istrian wineries. Toast your love with Malvazija and Teran among the vineyards.', image: '/images/beluga/Beluga 13.jpg' },
    { title: 'Truffle Hunting', description: 'An unforgettable pre-wedding adventure through ancient oak forests, guided by local hunters and their truffle dogs.', image: '/images/ballena/Ballena 35-1.jpg' },
    { title: 'Rovinj Excursion', description: 'Explore the pastel-colored streets of Rovinj. Perfect for couple portraits, bridal party outings, or a rehearsal dinner by the harbor.', image: '/images/beluga/Beluga 42.jpg' },
    { title: 'Cooking Class', description: 'Bond with your wedding party over handmade pasta, fresh truffles, and Istrian olive oil in a private chef-led cooking class.', image: '/images/beluga/Beluga 35.jpg' },
  ];

  return (
    <section className="section-padding bg-offwhite">
      <div className="mx-auto max-w-7xl px-6">
        <HeadingSlide className="mb-16 text-center">
          <h2 className="heading-lg text-3xl text-body-dark md:text-4xl">Wedding Week Experiences</h2>
          <p className="mt-4 text-base text-body-dark/50">Create unforgettable memories beyond the big day</p>
        </HeadingSlide>
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
          {experiences.map((exp) => (
            <StaggerItem key={exp.title}>
              <div className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 hover:shadow-lg">
                <div className="aspect-[3/4] relative">
                  <Image src={exp.image} alt={exp.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" quality={75} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-body-dark">{exp.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-body-dark/60">{exp.description}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA ──────────────────────────── */
function WeddingCTA() {
  return (
    <section className="relative overflow-hidden bg-navy py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,169,110,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(160,100,180,0.05)_0%,transparent_50%)]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <h2 className="heading-lg text-3xl text-white md:text-4xl lg:text-5xl">Begin Your Forever</h2>
          <p className="mt-6 font-accent text-xl italic text-gold/80">Limited dates available for 2026 wedding season</p>
        </ScrollReveal>
        <FadeUp delay={0.15}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
              <Link href="/contact" className="w-full rounded-full bg-gold px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] sm:w-auto">Request Wedding Package</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
              <a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="w-full rounded-full border border-gold/40 px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-gold transition-all duration-300 hover:bg-gold hover:text-white sm:w-auto">WhatsApp Us</a>
            </motion.div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════ WEDDING PAGE ═══════════════════════════ */
export default function WeddingsPage() {
  return (
    <main>
      <WeddingHero />
      <WhyIstria />
      <WeddingPackages />
      <WeddingPricingTable />
      <WeddingExperiences />
      <WeddingCTA />
    </main>
  );
}
