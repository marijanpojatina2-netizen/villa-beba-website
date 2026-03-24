'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import CountUp from '@/components/animations/CountUp';
import { StaggerContainer, StaggerItem, HeadingSlide, FadeUp, ScaleCard } from '@/components/animations/MotionWrappers';
import { complexBeba, villaCommon } from '@/lib/data';
import { heroImages } from '@/lib/images';

function Hero() {
  const t = useTranslations('complex');
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src={heroImages.complexBeba} alt="Aerial panorama of Complex Beba" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/60" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mb-6 font-accent text-lg italic tracking-wide text-gold/90 md:text-xl">Svetvincenat, Istria</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">{t('title')}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mx-auto mt-6 max-w-lg font-accent text-xl italic text-gold/80 md:text-2xl">{t('subtitle')}</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="mt-10 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Discover</span>
          <div className="animate-bounce"><svg className="h-5 w-5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" /></svg></div>
        </motion.div>
      </div>
    </section>
  );
}

function Introduction() {
  const t = useTranslations('complex');
  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal><p className="font-accent text-2xl italic leading-relaxed text-gold md:text-3xl">The ultimate Istrian experience</p></ScrollReveal>
        <ScrollReveal delay={0.2}><p className="mt-8 text-base leading-relaxed text-body-dark/60 md:text-lg">{t('intro')}</p></ScrollReveal>
        <FadeUp delay={0.3}><div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" /></FadeUp>
      </div>
    </section>
  );
}

function KeyStats() {
  const stats = [{ end: 18, suffix: '', label: 'Guests' },{ end: 8, suffix: '', label: 'Bedrooms' },{ end: 2, suffix: '', label: 'Pools' },{ end: 700, suffix: ' m\u00B2', label: 'Living Space' }];
  return (
    <section className="border-y border-body-dark/5 bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-4" staggerDelay={0.1}>
          {stats.map((stat) => (<StaggerItem key={stat.label}><div className="text-center"><CountUp end={stat.end} suffix={stat.suffix} className="text-4xl font-bold text-gold md:text-5xl font-heading" /><p className="mt-2 text-xs uppercase tracking-wider text-body-dark/40">{stat.label}</p></div></StaggerItem>))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function SharedAmenities() {
  const t = useTranslations('complex');
  const amenityIcons = ['M13 10V3L4 14h7v7l9-11h-7z','M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064','M21 12a9 9 0 01-2 5.796 9 9 0 01-14 0A9 9 0 0112 3a9 9 0 019 9z'];
  return (
    <section className="section-padding bg-offwhite">
      <div className="mx-auto max-w-5xl px-6">
        <HeadingSlide><h2 className="heading-lg mb-12 text-center text-3xl text-body-dark md:text-4xl">{t('shared')}</h2></HeadingSlide>
        <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.15}>
          {complexBeba.sharedAmenities.map((amenity, i) => (
            <StaggerItem key={amenity}>
              <div className="group rounded-xl border border-body-dark/5 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:border-gold/20 hover:shadow-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5 transition-colors group-hover:bg-gold/10"><svg className="h-7 w-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={amenityIcons[i]} /></svg></div>
                <h3 className="heading-md text-sm text-body-dark">{amenity}</h3>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function IdealFor() {
  const t = useTranslations('complex');
  const events = [
    { title: t('weddings'), description: 'Host up to 60 guests across both properties with private catering, decorations, and event coordination.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: t('retreats'), description: 'Team-building in a Mediterranean setting with 125 Mbit/s WiFi, flexible workspaces, and AV-ready areas.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { title: t('reunions'), description: 'Bring the whole family together with 8 bedrooms, 2 pools, and endless entertainment for all ages.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { title: t('celebrations'), description: 'Birthdays, anniversaries, and milestones deserve an extraordinary setting in the heart of Istria.', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  ];
  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-6xl px-6">
        <HeadingSlide><h2 className="heading-lg mb-16 text-center text-3xl text-body-dark md:text-4xl">{t('idealFor')}</h2></HeadingSlide>
        <StaggerContainer className="grid gap-6 sm:grid-cols-2" staggerDelay={0.12}>
          {events.map((event) => (
            <StaggerItem key={event.title}>
              <div className="group overflow-hidden rounded-xl border border-body-dark/5 bg-white shadow-sm transition-all duration-500 hover:border-gold/20 hover:shadow-md">
                <div className="p-8">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
                    <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={event.icon} /></svg>
                  </div>
                  <h3 className="heading-md text-lg text-body-dark">{event.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body-dark/50">{event.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function CombinedFeatures() {
  const t = useTranslations('complex');
  const features = [
    { title: 'Outdoor Dining for 24+', description: 'Two fully equipped outdoor kitchens with gas BBQ, covered terraces, and seating for the entire group.', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
    { title: 'Two Heated Pools', description: 'Each villa has its own 8x4m heated biological pool with hydromassage. That is 64m\u00B2 of pool space.', icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546' },
    { title: 'Wellness + Entertainment', description: 'Villa Ballena brings the sauna and wellness shower. Villa Beluga brings the game room and glass terrace. Together, the best of both worlds.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  ];
  return (
    <section className="section-padding bg-offwhite">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal><p className="mb-12 text-center font-accent text-lg italic text-gold md:text-xl">{t('combined')}</p></ScrollReveal>
        <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.15}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="rounded-xl border border-body-dark/5 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gold/20 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold/5"><svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} /></svg></div>
                <h3 className="heading-md text-sm text-body-dark">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-body-dark/50">{feature.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function VillaComparison() {
  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-5xl px-6">
        <HeadingSlide><h2 className="heading-lg mb-16 text-center text-3xl text-body-dark md:text-4xl">Two Personalities, One Estate</h2></HeadingSlide>
        <div className="grid gap-8 md:grid-cols-2">
          <ScaleCard delay={0.1}>
            <div className="rounded-2xl border border-body-dark/5 bg-white p-8 shadow-sm">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl"><Image src="/images/ballena/Ballena 36.jpg" alt="Villa Ballena terrace and pool at night" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" quality={80} /></div>
              <h3 className="heading-md mt-6 text-lg text-gold">Villa Ballena</h3>
              <p className="mt-1 font-accent text-sm italic text-body-dark/40">The Serene Wellness Retreat</p>
              <div className="mt-4 flex flex-wrap gap-2">{['Private sauna', 'Wellness shower', 'Dark interiors'].map((tag) => (<span key={tag} className="rounded-full border border-body-dark/10 bg-cream px-3 py-1 text-xs text-body-dark/50">{tag}</span>))}</div>
              <Link href="/villa-ballena" className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gold transition-colors hover:text-gold-light">Explore Ballena<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
            </div>
          </ScaleCard>
          <ScaleCard delay={0.2}>
            <div className="rounded-2xl border border-body-dark/5 bg-white p-8 shadow-sm">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl"><Image src="/images/beluga/Beluga 36.jpg" alt="Villa Beluga pool and terrace at dusk" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" quality={80} /></div>
              <h3 className="heading-md mt-6 text-lg text-gold">Villa Beluga</h3>
              <p className="mt-1 font-accent text-sm italic text-body-dark/40">The Entertainment &amp; Lifestyle Villa</p>
              <div className="mt-4 flex flex-wrap gap-2">{['Game room', 'Glass terrace', 'Family-friendly'].map((tag) => (<span key={tag} className="rounded-full border border-body-dark/10 bg-cream px-3 py-1 text-xs text-body-dark/50">{tag}</span>))}</div>
              <Link href="/villa-beluga" className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gold transition-colors hover:text-gold-light">Explore Beluga<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
            </div>
          </ScaleCard>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const t = useTranslations('complex');
  return (
    <section className="relative overflow-hidden bg-navy py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,169,110,0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(201,169,110,0.08)_0%,transparent_50%)]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/40">{t('maxGuests')}</p>
          <h2 className="heading-lg text-3xl text-white md:text-4xl lg:text-5xl">{t('bookComplex')}</h2>
        </ScrollReveal>
        <FadeUp delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.a href={complexBeba.bookingLink} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="w-full rounded-full bg-gold px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] sm:w-auto">{t('bookComplex')}</motion.a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}><Link href="/contact" className="w-full rounded-full border border-gold/40 px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-gold transition-all duration-300 hover:bg-gold hover:text-white sm:w-auto">Get in Touch</Link></motion.div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export default function ComplexBebaPage() {
  return (<main><Hero /><Introduction /><KeyStats /><SharedAmenities /><IdealFor /><CombinedFeatures /><VillaComparison /><CTASection /></main>);
}
