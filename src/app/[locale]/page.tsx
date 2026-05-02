'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { heroImages, villaCards } from '@/lib/images';

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
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/30 to-midnight/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <p className="mb-6 font-accent text-lg italic tracking-wide text-gold/80 md:text-xl">
          Svetvinčenat, Istria
        </p>
        <h1 className="heading-xl text-[clamp(2rem,7vw,4.5rem)] text-white">
          {t('title')}
        </h1>
        <a
          href="#villas"
          className="mt-10 inline-block rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-midnight transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]"
        >
          {t('cta')}
        </a>
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

/* ────────────────────── Introduction ──────────────────────── */
function Introduction() {
  const t = useTranslations('home');

  return (
    <section className="section-padding bg-midnight">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-accent text-xl italic text-gold md:text-2xl">
          {t('introTitle')}
        </p>
        <p className="mt-8 text-base leading-relaxed text-white/70 md:text-lg">
          {t('intro')}
        </p>
        {/* Gold divider */}
        <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
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
    <section id="villas" className="section-padding bg-midnight-light">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="heading-lg text-3xl text-white md:text-4xl">
            {t('villasTitle')}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {villas.map((villa) => (
            <div
              key={villa.name}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 transition-all duration-500 hover:border-gold/20"
            >
              {/* Villa image */}
              <Image
                src={villa.image}
                alt={villa.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                quality={80}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-midnight/20 to-transparent" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="heading-lg text-2xl text-white md:text-3xl">
                  {villa.name}
                </h3>
                <p className="mt-2 font-accent text-lg italic text-gold/80">
                  {villa.tagline}
                </p>

                {/* Features */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {villa.features.map((feat) => (
                    <span
                      key={feat}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-white/60"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                <Link
                  href={villa.href}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-medium uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
                >
                  {villa.cta}
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
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
    { value: '350', label: t('area') },
    { value: '4', label: t('enSuiteBedrooms') },
    { value: '8x4m', label: t('heatedPool') },
    { value: '2021', label: t('builtYear') },
    { value: '300m', label: t('toVillage') },
    { value: '18', label: t('maxGuests') },
  ];

  return (
    <section className="border-y border-white/5 bg-midnight py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center heading-md text-xl text-white/80 md:text-2xl">
          {t('numbersTitle')}
        </h2>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-gold md:text-4xl font-heading">
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-white/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
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
      imageAlt: 'Aerial view of Svetvinčenat village near Rovinj',
    },
    {
      title: 'Al Fresco Dining',
      description: 'Private chef experiences on your terrace with the finest Istrian ingredients.',
      image: '/images/beluga/Beluga 35.jpg',
      imageAlt: 'Outdoor dining setup at Villa Beluga at night',
    },
  ];

  return (
    <section className="section-padding bg-midnight-light">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="heading-lg text-3xl text-white md:text-4xl">
            {t('experiencesTitle')}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((exp) => (
            <div
              key={exp.title}
              className="group overflow-hidden rounded-xl border border-white/5 transition-all duration-500 hover:border-gold/20"
            >
              {/* Experience image */}
              <div className="relative aspect-[3/4]">
                <Image
                  src={exp.image}
                  alt={exp.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  quality={75}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
                    {exp.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-8 py-3 text-sm font-medium uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
          >
            {t('experiencesCta')}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
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
    <section className="section-padding bg-midnight">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="heading-lg mb-16 text-3xl text-white md:text-4xl">
          {t('reviewsTitle')}
        </h2>

        {/* Show first review (static for now) */}
        <div className="relative">
          {/* Gold quote marks */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-accent text-8xl leading-none text-gold/20 select-none">
            &ldquo;
          </span>

          <blockquote className="relative z-10">
            <p className="font-accent text-xl italic leading-relaxed text-white/80 md:text-2xl lg:text-3xl">
              {reviews[0].quote}
            </p>
            <footer className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-gold">
                {reviews[0].author}
              </p>
              <p className="mt-1 text-xs tracking-wide text-white/40">
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
                  i === 0 ? 'w-6 bg-gold' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
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
      <div className="absolute inset-0 bg-midnight/40" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="mb-16 text-center">
          <h2 className="heading-lg text-3xl text-white md:text-4xl">
            {t('locationTitle')}
          </h2>
          <p className="mt-4 font-accent text-lg italic text-gold/80">
            {t('locationSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {distances.map((item) => (
            <div
              key={item.place}
              className="rounded-xl border border-white/5 bg-midnight/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-gold/20"
            >
              <span className="text-3xl" role="img" aria-label={item.place}>
                {item.icon}
              </span>
              <p className="mt-4 text-2xl font-bold text-gold font-heading">
                {item.distance}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                {item.place}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── CTA Banner ─────────────────────────── */
function CTABanner() {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden bg-midnight py-24">
      {/* Decorative gold gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,169,110,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(201,169,110,0.06)_0%,transparent_50%)]" />

      {/* Gold line accents */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2 className="heading-lg text-3xl text-white md:text-4xl lg:text-5xl">
          {t('ctaTitle')}
        </h2>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="w-full rounded-full bg-gold px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-midnight transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] sm:w-auto"
          >
            {t('ctaButton')}
          </Link>
          <a
            href="https://wa.me/385915251565"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-gold/40 px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-gold transition-all duration-300 hover:border-terracotta hover:bg-terracotta hover:text-cream sm:w-auto"
          >
            {t('ctaWhatsapp')}
          </a>
        </div>
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
