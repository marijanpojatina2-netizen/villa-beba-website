'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { complexBeba, villaCommon } from '@/lib/data';
import { heroImages } from '@/lib/images';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  const t = useTranslations('complex');
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
      <Image src={heroImages.complexBeba} alt="Aerial panorama of Complex Beba" fill className="object-cover" priority quality={90} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
        <div ref={titleRef} className="max-w-[90vw]">
          <div className="overflow-hidden"><h1 className="hero-line display-hero text-white">COMPLEX</h1></div>
          <div className="overflow-hidden"><h1 className="hero-line display-hero text-white">BEBA</h1></div>
        </div>
        <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right">
          <p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">{t('subtitle')}</p>
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
   INTRODUCTION
   ═══════════════════════════════════════════════════════════ */
function Introduction() {
  const t = useTranslations('complex');
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
        <p className="label-section mb-16 lg:mb-24">(THE ESTATE)</p>
        <div ref={textRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <p className="display-md !not-italic !font-bold">The ultimate Istrian experience</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="body-editorial !max-w-none">{t('intro')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   KEY STATS
   ═══════════════════════════════════════════════════════════ */
function KeyStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const stats = [
    { end: 18, suffix: '', label: 'Guests' },
    { end: 8, suffix: '', label: 'Bedrooms' },
    { end: 2, suffix: '', label: 'Pools' },
    { end: 700, suffix: ' m\u00B2', label: 'Living Space' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const counters = sectionRef.current.querySelectorAll('.stat-number');
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        if (isNaN(target) || target === 0) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.5, ease: 'power2.out',
          scrollTrigger: { trigger: counter, start: 'top 85%' },
          onUpdate: () => { counter.textContent = Math.round(obj.val).toString(); },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-b border-line bg-bg-elevated py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="stat-number display-hero text-[clamp(3rem,8vw,6rem)] text-text/90" data-target={stat.end}>0</span>
              {stat.suffix && <span className="font-accent text-xl italic text-text-muted">{stat.suffix}</span>}
              <p className="mt-2 font-heading text-[0.6875rem] uppercase tracking-[0.15em] text-text-dim">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARED AMENITIES
   ═══════════════════════════════════════════════════════════ */
function SharedAmenities() {
  const t = useTranslations('complex');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.amenity-card');
      gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(SHARED AMENITIES)</p>
        <h2 className="display-lg mb-16">{t('shared')}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {complexBeba.sharedAmenities.map((amenity) => (
            <div key={amenity} className="amenity-card rounded-sm border border-line bg-bg-elevated p-8 text-center transition-all duration-300 hover:border-line-strong">
              <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{amenity}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   IDEAL FOR
   ═══════════════════════════════════════════════════════════ */
function IdealFor() {
  const t = useTranslations('complex');
  const sectionRef = useRef<HTMLElement>(null);

  const events = [
    { title: t('weddings'), description: 'Host up to 60 guests across both properties with private catering, decorations, and event coordination.' },
    { title: t('retreats'), description: 'Team-building in a Mediterranean setting with 125 Mbit/s WiFi, flexible workspaces, and AV-ready areas.' },
    { title: t('reunions'), description: 'Bring the whole family together with 8 bedrooms, 2 pools, and endless entertainment for all ages.' },
    { title: t('celebrations'), description: 'Birthdays, anniversaries, and milestones deserve an extraordinary setting in the heart of Istria.' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.event-card');
      items.forEach((item, i) => {
        gsap.fromTo(item, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.12, scrollTrigger: { trigger: item, start: 'top 88%' } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(IDEAL FOR)</p>
        <h2 className="display-lg mb-16">{t('idealFor')}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {events.map((event, i) => (
            <div key={event.title} className="event-card rounded-sm border border-line bg-bg p-8 transition-all duration-300 hover:border-line-strong">
              <span className="font-heading text-[0.6875rem] text-text-dim">({String(i + 1).padStart(2, '0')})</span>
              <h3 className="mt-4 font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{event.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMBINED FEATURES
   ═══════════════════════════════════════════════════════════ */
function CombinedFeatures() {
  const t = useTranslations('complex');
  const sectionRef = useRef<HTMLElement>(null);

  const features = [
    { title: 'Outdoor Dining for 24+', description: 'Two fully equipped outdoor kitchens with gas BBQ, covered terraces, and seating for the entire group.' },
    { title: 'Two Heated Pools', description: 'Each villa has its own 8x4m heated biological pool with hydromassage. That is 64m\u00B2 of pool space.' },
    { title: 'Wellness + Entertainment', description: 'Villa Ballena brings the sauna and wellness shower. Villa Beluga brings the game room and glass terrace. Together, the best of both worlds.' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.feature-card');
      gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-8">(COMBINED)</p>
        <p className="micro-italic mb-16">{t('combined')}</p>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card rounded-sm border border-line bg-bg-elevated p-8 transition-all duration-300 hover:border-line-strong">
              <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   VILLA COMPARISON
   ═══════════════════════════════════════════════════════════ */
function VillaComparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll('.villa-compare');
      cards.forEach((card, i) => {
        gsap.fromTo(card, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.2, scrollTrigger: { trigger: card, start: 'top 85%' } });
        const img = card.querySelector('img');
        if (img) gsap.fromTo(img, { scale: 1.1 }, { scale: 1, scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-16 lg:mb-24">(TWO PERSONALITIES)</p>
        <h2 className="display-lg mb-16">Two Personalities, One Estate</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="villa-compare rounded-sm border border-line bg-bg p-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
              <Image src="/images/ballena/ballena-5.jpg" alt="Villa Ballena exterior daytime" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" quality={80} />
            </div>
            <h3 className="mt-6 font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">Villa Ballena</h3>
            <p className="mt-1 micro-italic">The Serene Wellness Retreat</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Private sauna', 'Wellness shower', 'Dark interiors'].map((tag) => (
                <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-text-muted">{tag}</span>
              ))}
            </div>
            <Link href="/villa-ballena" className="btn-editorial mt-6 w-fit !text-[0.6rem]">Explore Ballena</Link>
          </div>
          <div className="villa-compare rounded-sm border border-line bg-bg p-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
              <Image src="/images/beluga/img_4847.jpg" alt="Villa Beluga exterior daytime" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" quality={80} />
            </div>
            <h3 className="mt-6 font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">Villa Beluga</h3>
            <p className="mt-1 micro-italic">The Entertainment &amp; Lifestyle Villa</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Game room', 'Glass terrace', 'Family-friendly'].map((tag) => (
                <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-text-muted">{tag}</span>
              ))}
            </div>
            <Link href="/villa-beluga" className="btn-editorial mt-6 w-fit !text-[0.6rem]">Explore Beluga</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  const t = useTranslations('complex');

  return (
    <section className="bg-bg">
      <div className="line-h" />
      <div className="py-32 lg:py-48">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
          <p className="label-section mb-6">{t('maxGuests')}</p>
          <h2 className="display-lg">{t('bookComplex')}</h2>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href={complexBeba.bookingLink} target="_blank" rel="noopener noreferrer" className="btn-editorial">
              {t('bookComplex')}
            </a>
            <Link href="/contact" className="btn-editorial">Get in Touch</Link>
          </div>
        </div>
      </div>
      <div className="line-h" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPLEX BEBA PAGE
   ═══════════════════════════════════════════════════════════ */
export default function ComplexBebaPage() {
  return (
    <main>
      <Hero />
      <Introduction />
      <KeyStats />
      <SharedAmenities />
      <IdealFor />
      <CombinedFeatures />
      <VillaComparison />
      <CTASection />
    </main>
  );
}
