'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';
import CountUp from '@/components/animations/CountUp';
import { villaCommon, villaBeluga } from '@/lib/data';
import { heroImages, belugaGallery } from '@/lib/images';

/* ─────────────────────────── Hero ─────────────────────────── */
function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src={heroImages.beluga} alt="Villa Beluga exterior with pool at dusk" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-midnight/30 to-midnight/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <ScrollReveal>
          <p className="mb-6 font-accent text-lg italic tracking-wide text-gold/80 md:text-xl">
            Svetvincenat, Istria
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <h1 className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Villa Beluga
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-lg font-accent text-xl italic text-gold/70 md:text-2xl">
            The Entertainment &amp; Lifestyle Villa
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.45}>
          <div className="mt-10 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Discover</span>
            <div className="animate-bounce">
              <svg className="h-5 w-5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
              </svg>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ────────────────────── Introduction ──────────────────────── */
function Introduction() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <p className="font-accent text-2xl italic leading-relaxed text-gold md:text-3xl">
            Pool by day. Billiards by night.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="mt-8 text-base leading-relaxed text-body-dark md:text-lg">
            Villa Beluga is the villa where everyone finds their thing &mdash; kids in the game room,
            parents on the glass terrace, teenagers on PlayStation. A 350m&sup2; designer residence built in 2021,
            where family-friendly meets sophisticated design. Four en-suite bedrooms, a fully equipped game room,
            and a glass-enclosed terrace make this the ultimate entertainment retreat in the heart of Istria.
          </p>
        </ScrollReveal>
        <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>
    </section>
  );
}

/* ──────────────────── Photo Gallery Grid ──────────────────── */
function PhotoGallery() {
  const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-[4/5]', 'aspect-[3/4]'];

  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="heading-lg mb-16 text-center text-3xl text-midnight md:text-4xl">
            Gallery
          </h2>
        </ScrollReveal>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {belugaGallery.slice(0, 6).map((image, i) => (
            <ScrollReveal key={image.src} delay={i * 0.1}>
              <div className="group mb-4 break-inside-avoid overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all duration-500 hover:border-gold/20">
                <div className={`${heights[i]} relative`}>
                  <Image src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wider text-white/60 backdrop-blur-sm">
                      {image.category}
                    </span>
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

/* ──────────────── The Entertainment Zone ───────────────────── */
function GameRoomSpotlight() {
  const t = useTranslations('villa');

  const features = villaBeluga.unique.gameRoom;
  const icons = [
    'M4 6h16M4 10h16M4 14h16M4 18h16', // billiard
    'M13 10V3L4 14h7v7l9-11h-7z', // foosball
    'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // darts
    'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z', // playstation
    'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', // board games
    'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', // badminton
  ];

  return (
    <section className="relative section-padding bg-cream overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <h2 className="heading-lg mb-4 text-center text-3xl text-midnight md:text-4xl">
            {t('gameRoom')}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="mx-auto mb-16 max-w-2xl text-center text-base leading-relaxed text-body-dark md:text-lg">
            {t('gameRoomDesc')}
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <ScrollReveal key={feature} delay={i * 0.1}>
              <div className="group rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:border-gold/20">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5 transition-colors group-hover:bg-gold/10">
                  <svg className="h-7 w-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icons[i]} />
                  </svg>
                </div>
                <h3 className="heading-md text-sm text-midnight">{feature}</h3>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── Glass Terrace Feature ────────────────────── */
function GlassTerrace() {
  const t = useTranslations('villa');

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <div>
              <h2 className="heading-lg text-3xl text-midnight md:text-4xl">
                {t('glassTerrace')}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-body-dark md:text-lg">
                An enclosed glass terrace that transforms evening gatherings into something special.
                Watch the sun set over Istrian hills while sheltered from the evening breeze.
                Perfect for aperitivo hour, family dinners, or late-night conversations under the stars.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Evening gatherings', 'Sheltered dining', 'Panoramic views'].map((tag) => (
                  <span key={tag} className="rounded-full border border-gold/20 bg-gold/5 px-4 py-2 text-xs uppercase tracking-wider text-gold/80">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <Image src="/images/beluga/Beluga 25.jpg" alt="Villa Beluga glass terrace" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" quality={85} />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 via-transparent to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────── Premium Services ─────────────────────────── */
function PremiumServices() {
  const t = useTranslations('villa');

  const serviceIcons = [
    'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546',
    'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <h2 className="heading-lg mb-12 text-center text-3xl text-midnight md:text-4xl">
            {t('premiumServices')}
          </h2>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {villaBeluga.unique.premiumServices.map((service, i) => (
            <ScrollReveal key={service} delay={i * 0.1}>
              <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gold/20">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
                  <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={serviceIcons[i]} />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed text-body-dark">{service}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Specifications Tabs ──────────────────── */
function Specifications() {
  const t = useTranslations('villa');
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: t('bedrooms'), key: 'bedrooms' },
    { label: 'Game Room', key: 'gameroom' },
    { label: t('outdoor'), key: 'outdoor' },
    { label: t('indoor'), key: 'indoor' },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <h2 className="heading-lg mb-12 text-center text-3xl text-midnight md:text-4xl">
            {t('specifications')}
          </h2>
        </ScrollReveal>

        {/* Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(i)}
              className={`relative rounded-full px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                activeTab === i
                  ? 'bg-gold/10 text-gold'
                  : 'text-body-dark/50 hover:text-body-dark/80'
              }`}
            >
              {tab.label}
              {activeTab === i && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-gray-200 bg-cream/50 p-8">
          {activeTab === 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {villaBeluga.bedrooms.map((room) => (
                <div key={room.name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="heading-md text-lg text-gold">{room.name}</h3>
                  <p className="mt-2 text-sm text-body-dark">{room.beds}</p>
                  {room.enSuite && (
                    <span className="mt-3 inline-block rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs text-gold/80">
                      En-suite bathroom
                    </span>
                  )}
                </div>
              ))}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
                <div className="grid grid-cols-2 gap-4 text-sm text-body-dark">
                  <p><span className="text-gold">Bathrooms:</span> {villaCommon.bathrooms}</p>
                  <p><span className="text-gold">Guest WCs:</span> {villaCommon.guestWCs}</p>
                  <p><span className="text-gold">Max guests:</span> {villaCommon.maxGuests}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="grid gap-6 md:grid-cols-2">
              {villaBeluga.unique.gameRoom.map((item) => (
                <div key={item} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="heading-md text-lg text-gold">{item}</h3>
                  <p className="mt-2 text-sm text-body-dark">Available in the dedicated game room</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 2 && (
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(villaCommon.outdoor).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="heading-md text-sm text-gold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</h3>
                  <p className="mt-2 text-sm text-body-dark">{value}</p>
                </div>
              ))}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="heading-md text-sm text-gold">Glass Terrace</h3>
                <p className="mt-2 text-sm text-body-dark">Enclosed glass terrace for evening gatherings</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="heading-md text-sm text-gold">Loungers</h3>
                <p className="mt-2 text-sm text-body-dark">{villaBeluga.unique.loungers}</p>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="heading-md text-sm text-gold">Climate</h3>
                <p className="mt-2 text-sm text-body-dark">{villaCommon.indoor.ac}</p>
                <p className="mt-1 text-sm text-body-dark">{villaCommon.indoor.heating}</p>
                {villaCommon.indoor.fireplace && <p className="mt-1 text-sm text-body-dark">Fireplace</p>}
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="heading-md text-sm text-gold">Entertainment</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {villaCommon.indoor.entertainment.map((e) => (
                    <span key={e} className="rounded-full border border-gray-200 bg-cream px-3 py-1 text-xs text-body-dark">
                      {e}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-body-dark/70">WiFi: {villaCommon.indoor.wifi}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="heading-md text-sm text-gold">Kitchen</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {villaCommon.indoor.kitchen.map((k) => (
                    <span key={k} className="rounded-full border border-gray-200 bg-cream px-3 py-1 text-xs text-body-dark">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="heading-md text-sm text-gold">Laundry & Security</h3>
                <p className="mt-2 text-sm text-body-dark">{villaCommon.indoor.laundry}</p>
                {villaCommon.indoor.safe && <p className="mt-1 text-sm text-body-dark">In-room safe</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── A Day at Villa Beluga ────────────────────── */
function DayTimeline() {
  const t = useTranslations('villa');

  const timeSlots = [
    { time: '08:00', period: 'Morning', description: t('morning'), icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
    { time: '12:00', period: 'Midday', description: t('midday'), icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { time: '15:00', period: 'Afternoon', description: t('afternoon'), icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { time: '20:00', period: 'Evening', description: 'BBQ on the terrace, billiards tournament, game night with the family', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <h2 className="heading-lg mb-16 text-center text-3xl text-midnight md:text-4xl">
            {t('dayTitle', { villa: 'Villa Beluga' })}
          </h2>
        </ScrollReveal>

        <div className="relative">
          {/* Gold timeline line */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent md:block" />

          <div className="space-y-12">
            {timeSlots.map((slot, i) => (
              <ScrollReveal key={slot.period} delay={i * 0.15}>
                <div className="relative flex items-start gap-8">
                  {/* Timeline dot */}
                  <div className="relative z-10 hidden flex-shrink-0 md:block">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-white">
                      <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={slot.icon} />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gold">{slot.time}</span>
                      <span className="heading-md text-sm text-midnight">{slot.period}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-body-dark">{slot.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────── Practical Information ────────────────────── */
function PracticalInfo() {
  const t = useTranslations('villa');

  const items = [
    { label: t('checkIn'), value: villaCommon.checkIn, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: t('checkOut'), value: villaCommon.checkOut, icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
    { label: t('deposit'), value: villaCommon.deposit, icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { label: t('included'), value: villaCommon.included.join(', '), icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: t('petsAllowed'), value: villaCommon.pets, icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Living Space', value: `${villaCommon.area} on ${villaCommon.grounds} grounds`, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <h2 className="heading-lg mb-12 text-center text-3xl text-body-dark md:text-4xl">
            {t('practicalInfo')}
          </h2>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 0.08}>
              <div className="rounded-xl border border-body-dark/10 bg-white p-6 transition-all duration-300 hover:border-gold/30 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                    <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-body-dark">{item.label}</p>
                    <p className="mt-1 text-sm text-body-dark/70">{item.value}</p>
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

/* ───────────────── Pricing Quick View ─────────────────────── */
function PricingQuickView() {
  const t = useTranslations('villa');

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-[0.3em] text-body-dark/50">Starting from</p>
          <p className="mt-4 text-gradient-gold text-5xl font-bold md:text-6xl lg:text-7xl font-heading">
            {t('pricingTeaser')}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <Link
            href="/pricing"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gold transition-colors hover:text-gold-light"
          >
            {t('viewPricing')}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────────────── CTA ─────────────────────────────── */
function CTASection() {
  const t = useTranslations('villa');

  return (
    <section className="relative overflow-hidden bg-midnight-light py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,169,110,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(201,169,110,0.06)_0%,transparent_50%)]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <h2 className="heading-lg text-3xl text-white md:text-4xl lg:text-5xl">
            {t('bookVilla', { villa: 'Villa Beluga' })}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={villaBeluga.bookingLinks.crovillas}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-gold px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-midnight transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] sm:w-auto"
            >
              {t('bookVilla', { villa: 'Villa Beluga' })}
            </a>
            <Link
              href="/contact"
              className="w-full rounded-full border border-gold/40 px-10 py-4 text-center text-sm font-semibold uppercase tracking-widest text-gold transition-all duration-300 hover:bg-gold hover:text-midnight sm:w-auto"
            >
              {t('inquireDates')}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ═══════════════════ VILLA BELUGA PAGE ════════════════════════ */
export default function VillaBelugaPage() {
  return (
    <main>
      <Hero />
      <Introduction />
      <PhotoGallery />
      <GameRoomSpotlight />
      <GlassTerrace />
      <PremiumServices />
      <Specifications />
      <DayTimeline />
      <PracticalInfo />
      <PricingQuickView />
      <CTASection />
    </main>
  );
}
