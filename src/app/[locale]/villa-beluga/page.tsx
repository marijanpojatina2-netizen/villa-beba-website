'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { villaCommon, villaBeluga } from '@/lib/data';
import { heroImages, belugaGallery } from '@/lib/images';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   S1 — HERO
   ═══════════════════════════════════════════════════════════ */
function Hero() {
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
      <Image src={heroImages.beluga} alt="Villa Beluga exterior with pool at dusk" fill className="object-cover" priority quality={90} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
        <div ref={titleRef} className="max-w-[90vw]">
          <div className="overflow-hidden"><h1 className="hero-line display-hero text-white">BELUGA</h1></div>
        </div>
        <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right">
          <p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">The Entertainment &amp; Lifestyle Villa</p>
          <p className="mt-4 text-[0.75rem] leading-relaxed text-white/50 font-body">Svetvincenat, Istria</p>
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
   S2 — INTRODUCTION
   ═══════════════════════════════════════════════════════════ */
function Introduction() {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        const img = imageRef.current.querySelector('img');
        if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, scrollTrigger: { trigger: imageRef.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
      if (textRef.current) gsap.fromTo(textRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: textRef.current, start: 'top 85%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(THE VILLA)</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4">
          <div ref={textRef} className="lg:col-span-5 flex flex-col justify-start lg:pt-8 lg:pr-12">
            <p className="display-md !not-italic !font-bold">Pool by day. Billiards by night.</p>
            <p className="mt-8 body-editorial">
              Villa Beluga is the villa where everyone finds their thing &mdash; kids in the game room,
              parents on the glass terrace, teenagers on PlayStation. A 350m&sup2; designer residence built in 2021,
              where family-friendly meets sophisticated design. Four en-suite bedrooms, a fully equipped game room,
              and a glass-enclosed terrace make this the ultimate entertainment retreat in the heart of Istria.
            </p>
            <Link href="/gallery" className="btn-editorial mt-8 w-fit">View Gallery</Link>
          </div>
          <div className="hidden lg:block lg:col-span-3" />
          <div ref={imageRef} className="lg:col-span-4 overflow-hidden rounded-sm">
            <div className="relative aspect-[3/4]">
              <Image src="/images/beluga/Beluga 35.jpg" alt="Villa Beluga interior" fill className="object-cover" quality={85} sizes="(max-width: 1024px) 100vw, 33vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S3 — EDITORIAL GALLERY
   ═══════════════════════════════════════════════════════════ */
function PhotoGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-[4/5]', 'aspect-[3/4]'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.gallery-item');
      items.forEach((item, i) => {
        gsap.fromTo(item, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, scrollTrigger: { trigger: item, start: 'top 88%' } });
        const img = item.querySelector('img');
        if (img) gsap.fromTo(img, { scale: 1.1 }, { scale: 1, scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(GALLERY)</p>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {belugaGallery.slice(0, 6).map((image, i) => (
            <div key={image.src} className="gallery-item mb-4 break-inside-avoid group overflow-hidden rounded-sm border border-line transition-all duration-500 hover:border-line-strong">
              <div className={`${heights[i]} relative`}>
                <Image src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full border border-line bg-bg/40 px-3 py-1 text-xs uppercase tracking-wider text-text-muted backdrop-blur-sm">
                    {image.category}
                  </span>
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
   S4 — ENTERTAINMENT ZONE
   ═══════════════════════════════════════════════════════════ */
function GameRoomSpotlight() {
  const t = useTranslations('villa');
  const sectionRef = useRef<HTMLElement>(null);
  const features = villaBeluga.unique.gameRoom;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.game-item');
      gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative section-editorial bg-bg overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/beluga/Beluga 10.jpg" alt="Villa Beluga game room" fill className="object-cover opacity-10" quality={75} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/90 to-bg" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(ENTERTAINMENT)</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <h2 className="display-lg">{t('gameRoom')}</h2>
            <p className="mt-6 body-editorial">{t('gameRoomDesc')}</p>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature} className="game-item rounded-sm border border-line bg-bg-elevated/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-line-strong">
                  <h3 className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-text">{feature}</h3>
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
   S5 — GLASS TERRACE
   ═══════════════════════════════════════════════════════════ */
function GlassTerrace() {
  const t = useTranslations('villa');
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        const img = imageRef.current.querySelector('img');
        if (img) gsap.fromTo(img, { scale: 1.1 }, { scale: 1, scrollTrigger: { trigger: imageRef.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
      if (textRef.current) gsap.fromTo(textRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: textRef.current, start: 'top 85%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div ref={textRef}>
            <p className="label-section mb-8">(FEATURE)</p>
            <h2 className="display-lg">{t('glassTerrace')}</h2>
            <p className="mt-6 body-editorial">
              An enclosed glass terrace that transforms evening gatherings into something special.
              Watch the sun set over Istrian hills while sheltered from the evening breeze.
              Perfect for aperitivo hour, family dinners, or late-night conversations under the stars.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Evening gatherings', 'Sheltered dining', 'Panoramic views'].map((tag) => (
                <span key={tag} className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div ref={imageRef} className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
            <Image src="/images/beluga/Beluga 25.jpg" alt="Villa Beluga glass terrace" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" quality={85} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S6 — SPECIFICATIONS
   ═══════════════════════════════════════════════════════════ */
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
    <section className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center justify-between mb-16">
          <p className="label-section">(SPECIFICATIONS)</p>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(i)}
              className={`btn-editorial !text-[0.625rem] !px-5 !py-2 ${activeTab === i ? '!bg-text !text-bg !border-text' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-sm border border-line bg-bg-elevated p-8">
          {activeTab === 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {villaBeluga.bedrooms.map((room) => (
                <div key={room.name} className="rounded-sm border border-line bg-bg p-6">
                  <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{room.name}</h3>
                  <p className="mt-2 text-sm text-text-muted">{room.beds}</p>
                  {room.enSuite && (
                    <span className="mt-3 inline-block rounded-full border border-line px-3 py-1 text-xs text-text-muted">En-suite bathroom</span>
                  )}
                </div>
              ))}
              <div className="rounded-sm border border-line bg-bg p-6 md:col-span-2">
                <div className="grid grid-cols-2 gap-4 text-sm text-text-muted">
                  <p><span className="text-text">Bathrooms:</span> {villaCommon.bathrooms}</p>
                  <p><span className="text-text">Guest WCs:</span> {villaCommon.guestWCs}</p>
                  <p><span className="text-text">Max guests:</span> {villaCommon.maxGuests}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="grid gap-6 md:grid-cols-2">
              {villaBeluga.unique.gameRoom.map((item) => (
                <div key={item} className="rounded-sm border border-line bg-bg p-6">
                  <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{item}</h3>
                  <p className="mt-2 text-sm text-text-muted">Available in the dedicated game room</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 2 && (
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(villaCommon.outdoor).map(([key, value]) => (
                <div key={key} className="rounded-sm border border-line bg-bg p-6">
                  <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</h3>
                  <p className="mt-2 text-sm text-text-muted">{value}</p>
                </div>
              ))}
              <div className="rounded-sm border border-line bg-bg p-6">
                <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">Glass Terrace</h3>
                <p className="mt-2 text-sm text-text-muted">Enclosed glass terrace for evening gatherings</p>
              </div>
              <div className="rounded-sm border border-line bg-bg p-6">
                <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">Loungers</h3>
                <p className="mt-2 text-sm text-text-muted">{villaBeluga.unique.loungers}</p>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-sm border border-line bg-bg p-6">
                <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">Climate</h3>
                <p className="mt-2 text-sm text-text-muted">{villaCommon.indoor.ac}</p>
                <p className="mt-1 text-sm text-text-muted">{villaCommon.indoor.heating}</p>
                {villaCommon.indoor.fireplace && <p className="mt-1 text-sm text-text-muted">Fireplace</p>}
              </div>
              <div className="rounded-sm border border-line bg-bg p-6">
                <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">Entertainment</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {villaCommon.indoor.entertainment.map((e) => (
                    <span key={e} className="rounded-full border border-line px-3 py-1 text-xs text-text-muted">{e}</span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-text-dim">WiFi: {villaCommon.indoor.wifi}</p>
              </div>
              <div className="rounded-sm border border-line bg-bg p-6">
                <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">Kitchen</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {villaCommon.indoor.kitchen.map((k) => (
                    <span key={k} className="rounded-full border border-line px-3 py-1 text-xs text-text-muted">{k}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-sm border border-line bg-bg p-6">
                <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">Laundry & Security</h3>
                <p className="mt-2 text-sm text-text-muted">{villaCommon.indoor.laundry}</p>
                {villaCommon.indoor.safe && <p className="mt-1 text-sm text-text-muted">In-room safe</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S7 — A DAY AT VILLA BELUGA
   ═══════════════════════════════════════════════════════════ */
function DayTimeline() {
  const t = useTranslations('villa');
  const sectionRef = useRef<HTMLElement>(null);

  const timeSlots = [
    { time: '08:00', period: 'Morning', description: t('morning') },
    { time: '12:00', period: 'Midday', description: t('midday') },
    { time: '15:00', period: 'Afternoon', description: t('afternoon') },
    { time: '20:00', period: 'Evening', description: 'BBQ on the terrace, billiards tournament, game night with the family' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.timeline-item');
      gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(A DAY AT BELUGA)</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4">
          <div className="lg:col-span-5">
            <h2 className="display-lg">{t('dayTitle', { villa: 'Villa Beluga' })}</h2>
          </div>
          <div className="lg:col-span-7">
            <div className="space-y-0">
              {timeSlots.map((slot) => (
                <div key={slot.period} className="timeline-item border-t border-line py-8">
                  <div className="flex items-baseline gap-6">
                    <span className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim w-16">{slot.time}</span>
                    <div>
                      <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{slot.period}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">{slot.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t border-line" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S8 — PRACTICAL INFORMATION
   ═══════════════════════════════════════════════════════════ */
function PracticalInfo() {
  const t = useTranslations('villa');
  const sectionRef = useRef<HTMLElement>(null);

  const items = [
    { label: t('checkIn'), value: villaCommon.checkIn },
    { label: t('checkOut'), value: villaCommon.checkOut },
    { label: t('deposit'), value: villaCommon.deposit },
    { label: t('included'), value: villaCommon.included.join(', ') },
    { label: t('petsAllowed'), value: villaCommon.pets },
    { label: 'Living Space', value: `${villaCommon.area} on ${villaCommon.grounds} grounds` },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll('.info-card');
      gsap.fromTo(cards, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(PRACTICAL INFO)</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="info-card rounded-sm border border-line bg-bg-elevated p-6 transition-all duration-300 hover:border-line-strong">
              <p className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{item.label}</p>
              <p className="mt-2 text-sm text-text-muted">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S9 — PRICING TEASER
   ═══════════════════════════════════════════════════════════ */
function PricingQuickView() {
  const t = useTranslations('villa');

  return (
    <section className="bg-bg">
      <div className="line-h" />
      <div className="py-32 lg:py-48">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
          <p className="label-section mb-6">(PRICING)</p>
          <p className="font-heading text-[0.6875rem] uppercase tracking-[0.3em] text-text-dim">Starting from</p>
          <p className="mt-4 display-lg">{t('pricingTeaser')}</p>
          <Link href="/pricing" className="btn-editorial mt-10 inline-flex items-center gap-2">
            {t('viewPricing')}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="line-h" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   S10 — CTA
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  const t = useTranslations('villa');

  return (
    <section className="bg-bg">
      <div className="py-32 lg:py-48">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
          <h2 className="display-lg">{t('bookVilla', { villa: 'Villa Beluga' })}</h2>
          <p className="mt-6 micro-italic">Limited summer 2026 availability</p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href={villaBeluga.bookingLinks.crovillas} target="_blank" rel="noopener noreferrer" className="btn-editorial">
              {t('bookVilla', { villa: 'Villa Beluga' })}
            </a>
            <Link href="/contact" className="btn-editorial">{t('inquireDates')}</Link>
          </div>
        </div>
      </div>
      <div className="line-h" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   VILLA BELUGA PAGE
   ═══════════════════════════════════════════════════════════ */
export default function VillaBelugaPage() {
  return (
    <main>
      <Hero />
      <Introduction />
      <PhotoGallery />
      <GameRoomSpotlight />
      <GlassTerrace />
      <Specifications />
      <DayTimeline />
      <PracticalInfo />
      <PricingQuickView />
      <CTASection />
    </main>
  );
}
