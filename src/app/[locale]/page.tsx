'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { heroImages, villaCards } from '@/lib/images';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import CountUp from '@/components/animations/CountUp';
import { StaggerContainer, StaggerItem, ScaleCard, HeadingSlide, FadeUp } from '@/components/animations/MotionWrappers';

/* ─────────────────────────── Hero ─────────────────────────── */
function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src={heroImages.homepage}
        alt="Villa Ballena and Villa Beluga aerial view at dusk"
        fill
        className="object-cover"
        priority
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6 font-accent text-lg italic tracking-wide text-gold/90 md:text-xl"
        >
          Svetvincenat, Istria
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="heading-xl text-[clamp(2rem,7vw,4.5rem)] text-white"
        >
          {t('title')}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <motion.a
            href="#villas"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="mt-10 inline-block rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]"
          >
            {t('cta')}
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
          <div className="animate-bounce">
            <svg className="h-5 w-5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────── Introduction ──────────────────────── */
function Introduction() {
  const t = useTranslations('home');

  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <p className="font-accent text-xl italic text-gold md:text-2xl">
            {t('introTitle')}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="mt-8 text-base leading-relaxed text-body-dark/70 md:text-lg">
            {t('intro')}
          </p>
        </ScrollReveal>
        {/* Gold divider */}
        <FadeUp delay={0.3}>
          <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────── Two Villas ──────────────────────── */
function VillasSection() {
  const t = useTranslations('home');

  const villas = [
    {
      name: 'Villa Ballena',
      tagline: t('ballenaTagline'),
      features: t('ballenaFeatures').split(' · '),
      href: '/villa-ballena' as const,
      cta: t('discoverBallena'),
      image: villaCards.ballena,
      imageAlt: 'Villa Ballena terrace and pool at night',
    },
    {
      name: 'Villa Beluga',
      tagline: t('belugaTagline'),
      features: t('belugaFeatures').split(' · '),
      href: '/villa-beluga' as const,
      cta: t('discoverBeluga'),
      image: villaCards.beluga,
      imageAlt: 'Villa Beluga exterior with pool at dusk',
    },
  ];

  return (
    <section id="villas" className="section-padding bg-offwhite">
      <div className="mx-auto max-w-7xl px-6">
        <HeadingSlide className="mb-16 text-center">
          <h2 className="heading-lg text-3xl text-body-dark md:text-4xl">
            {t('villasTitle')}
          </h2>
        </HeadingSlide>

        <div className="grid gap-8 md:grid-cols-2">
          {villas.map((villa, i) => (
            <ScaleCard key={villa.name} delay={i * 0.15}>
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-xl">
                {/* Villa image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={villa.image}
                    alt={villa.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    quality={80}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="heading-lg text-2xl text-body-dark md:text-3xl">
                    {villa.name}
                  </h3>
                  <p className="mt-2 font-accent text-lg italic text-gold">
                    {villa.tagline}
                  </p>

                  {/* Features */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {villa.features.map((feat) => (
                      <span
                        key={feat}
                        className="rounded-full border border-body-dark/10 bg-cream px-3 py-1 text-xs tracking-wide text-body-dark/60"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="mt-6 inline-flex">
                    <Link
                      href={villa.href}
                      className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-3 text-sm font-medium uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-white"
                    >
                      {villa.cta}
                      <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </ScaleCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Key Numbers Strip ───────────────────── */
function NumbersStrip() {
  const t = useTranslations('home');

  const stats = [
    { value: 350, suffix: '', label: t('area') },
    { value: 4, suffix: '', label: t('enSuiteBedrooms') },
    { value: 0, display: '8x4m', label: t('heatedPool') },
    { value: 2021, suffix: '', label: t('builtYear') },
    { value: 300, suffix: 'm', label: t('toVillage') },
    { value: 18, suffix: '', label: t('maxGuests') },
  ];

  return (
    <section className="border-y border-body-dark/5 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="mb-12 text-center heading-md text-xl text-body-dark/80 md:text-2xl">
            {t('numbersTitle')}
          </h2>
        </ScrollReveal>
        <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6" staggerDelay={0.1}>
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="text-center">
                {stat.display ? (
                  <p className="text-3xl font-bold text-gold md:text-4xl font-heading">
                    {stat.display}
                  </p>
                ) : (
                  <CountUp end={stat.value} suffix={stat.suffix} className="text-3xl font-bold text-gold md:text-4xl font-heading" />
                )}
                <p className="mt-2 text-xs uppercase tracking-wider text-body-dark/50">
                  {stat.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ────────────────── Experiences Teaser ────────────────────── */
function ExperiencesTeaser() {
  const t = useTranslations('home');

  const experiences = [
    {
      title: 'Wine Tasting',
      description: 'Explore award-winning Istrian cellars with private tastings of Malvazija and Teran.',
      image: '/images/beluga/Beluga 13.jpg',
      imageAlt: 'Stone wall terrace with Mediterranean ambiance for wine tasting',
    },
    {
      title: 'Truffle Hunting',
      description: 'Join a local hunter and his dogs through ancient oak forests in search of Istrian gold.',
      image: '/images/ballena/Ballena 35-1.jpg',
      imageAlt: 'Olive tree courtyard at dusk, truffle hunting setting',
    },
    {
      title: 'Rovinj Day Trip',
      description: 'Just 23 km away, this pastel-colored coastal gem is the jewel of the Adriatic.',
      image: '/images/beluga/Beluga 42.jpg',
      imageAlt: 'Aerial view of Svetvincenat village near Rovinj',
    },
    {
      title: 'Al Fresco Dining',
      description: 'Private chef experiences on your terrace with the finest Istrian ingredients.',
      image: '/images/beluga/Beluga 35.jpg',
      imageAlt: 'Outdoor dining setup at Villa Beluga at night',
    },
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <HeadingSlide className="mb-16 text-center">
          <h2 className="heading-lg text-3xl text-body-dark md:text-4xl">
            {t('experiencesTitle')}
          </h2>
        </HeadingSlide>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.12}>
          {experiences.map((exp) => (
            <StaggerItem key={exp.title}>
              <div className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 hover:shadow-lg">
                {/* Experience image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={exp.image}
                    alt={exp.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    quality={75}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-body-dark">
                      {exp.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-body-dark/60">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.2} className="mt-12 text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="inline-flex">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 rounded-full border border-gold px-8 py-3 text-sm font-medium uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-white"
            >
              {t('experiencesCta')}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────────────────── Reviews Section ────────────────────── */
function ReviewsSection() {
  const t = useTranslations('home');

  const reviews = [
    {
      quote: 'An absolutely stunning property. The attention to detail, the pool, the views — everything exceeded our expectations. We felt like we were in our own private paradise.',
      author: 'Sarah & James',
      origin: 'London, UK',
    },
    {
      quote: 'Wir haben noch nie einen so perfekten Urlaub erlebt. Die Villa ist ein Traum und die Lage ist einfach unschlagbar.',
      author: 'Familie Weber',
      origin: 'Munich, Germany',
    },
    {
      quote: 'From the moment we arrived, everything was taken care of. The truffle hunting experience and the private chef dinner were highlights we will never forget.',
      author: 'The Andersons',
      origin: 'New York, USA',
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <HeadingSlide>
          <h2 className="heading-lg mb-16 text-3xl text-body-dark md:text-4xl">
            {t('reviewsTitle')}
          </h2>
        </HeadingSlide>

        <ScrollReveal>
          {/* Show first review (static for now) */}
          <div className="relative">
            {/* Gold quote marks */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-accent text-8xl leading-none text-gold/20 select-none">
              &ldquo;
            </span>

            <blockquote className="relative z-10">
              <p className="font-accent text-xl italic leading-relaxed text-body-dark/70 md:text-2xl lg:text-3xl">
                {reviews[0].quote}
              </p>
              <footer className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-gold">
                  {reviews[0].author}
                </p>
                <p className="mt-1 text-xs tracking-wide text-body-dark/40">
                  {reviews[0].origin}
                </p>
              </footer>
            </blockquote>

            {/* Dots indicator (static) */}
            <div className="mt-10 flex items-center justify-center gap-2">
              {reviews.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === 0 ? 'w-6 bg-gold' : 'w-2 bg-body-dark/15'
                  }`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ───────────────────── Location Section ───────────────────── */
function LocationSection() {
  const t = useTranslations('home');

  const distances = [
    { place: 'Rovinj', distance: '23 km', icon: '🏘' },
    { place: 'Pula', distance: '27.5 km', icon: '🏛' },
    { place: 'Airport (PUY)', distance: '33 km', icon: '✈' },
    { place: 'Beach', distance: '19 km', icon: '🏖' },
  ];

  return (
    <section className="relative overflow-hidden section-padding">
      {/* Background image */}
      <Image
        src="/images/ballena/Ballena 33.jpg"
        alt="Villa Ballena exterior at sunset"
        fill
        className="object-cover"
        quality={75}
      />
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="heading-lg text-3xl text-body-dark md:text-4xl">
              {t('locationTitle')}
            </h2>
            <p className="mt-4 font-accent text-lg italic text-gold">
              {t('locationSubtitle')}
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 gap-6 md:grid-cols-4" staggerDelay={0.1}>
          {distances.map((item) => (
            <StaggerItem key={item.place}>
              <div className="rounded-xl border border-body-dark/5 bg-white/90 p-6 text-center backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg hover:border-gold/30">
                <span className="text-3xl" role="img" aria-label={item.place}>
                  {item.icon}
                </span>
                <p className="mt-4 text-2xl font-bold text-gold font-heading">
                  {item.distance}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-body-dark/50">
                  {item.place}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ───────────────────── CTA Banner ─────────────────────────── */
function CTABanner() {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden bg-navy py-24">
      {/* Decorative gold gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,169,110,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(201,169,110,0.06)_0%,transparent_50%)]" />

      {/* Gold line accents */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <h2 className="heading-lg text-3xl text-white md:text-4xl lg:text-5xl">
            {t('ctaTitle')}
          </h2>
        </ScrollReveal>

        <FadeUp delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
              <Link
                href="/contact"
                className="w-full rounded-full bg-gold px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] sm:w-auto"
              >
                {t('ctaButton')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
              <a
                href="https://wa.me/385915251565"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full border border-gold/40 px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-gold transition-all duration-300 hover:bg-gold hover:text-white sm:w-auto"
              >
                {t('ctaWhatsapp')}
              </a>
            </motion.div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════ HOME PAGE ═══════════════════════════ */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Introduction />
      <VillasSection />
      <NumbersStrip />
      <ExperiencesTeaser />
      <ReviewsSection />
      <LocationSection />
      <CTABanner />
    </main>
  );
}
