'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experiences } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

type Category = 'all' | 'gastronomy' | 'daytrip' | 'nature' | 'sports' | 'family' | 'culture';

const categoryLabels: Record<Category, string> = {
  all: 'All',
  gastronomy: 'Gastronomy',
  daytrip: 'Day Trips',
  nature: 'Nature',
  sports: 'Sports',
  family: 'Family',
  culture: 'Culture',
};

const experienceImages: Record<string, string> = {
  'Wine Tasting': '/images/experiences/wine tasting.jpg',
  'Truffle Hunting': '/images/experiences/tartufi.jpg',
  'Cooking Class': '/images/experiences/cooking class.jpg',
  'Rovinj': '/images/experiences/Rovinj.jpg',
  'Pula Arena': '/images/experiences/pula-arena.jpg',
  'Brijuni': '/images/experiences/brijuni_iz_zraka2.jpg',
  'Motovun': '/images/experiences/Motovun.jpg',
  'Beach': '/images/experiences/istarske plaze.jpg',
  'Istralandia': '/images/experiences/istralandia.jpg',
  'Kaštel': '/images/experiences/kaštel morosini.jpg',
  'Olive Oil': '/images/experiences/maslinici.jpg',
  'Tennis': '/images/experiences/tenis.jpg',
};

const fallbackImages = [
  '/images/experiences/Rovinj.jpg',
  '/images/experiences/wine tasting.jpg',
  '/images/experiences/Motovun.jpg',
  '/images/experiences/tartufi.jpg',
];

function getExperienceImage(title: string, index: number): string {
  for (const [key, src] of Object.entries(experienceImages)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return src;
  }
  return fallbackImages[index % fallbackImages.length];
}

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function ExperiencesHero() {
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
      <Image src="/images/experiences/hero.jpg" alt="Istrian experiences landscape" fill className="object-cover" priority quality={85} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
        <div ref={titleRef} className="max-w-[90vw]">
          <div className="overflow-hidden"><h1 className="hero-line display-hero text-white">ISTRIAN</h1></div>
          <div className="overflow-hidden"><h1 className="hero-line display-hero text-white italic">Experiences</h1></div>
        </div>
        <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right">
          <p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">Beyond the villa</p>
          <p className="mt-4 text-[0.75rem] leading-relaxed text-white/50 font-body">Your villa is the beginning. Istria is the adventure.</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE CARDS
   ═══════════════════════════════════════════════════════════ */
function ExperienceCards() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const sectionRef = useRef<HTMLElement>(null);

  const filteredExperiences = activeCategory === 'all'
    ? experiences
    : experiences.filter((exp) => exp.category === activeCategory);

  const categories: Category[] = ['all', 'gastronomy', 'daytrip', 'nature', 'sports', 'family', 'culture'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll('.exp-card');
      gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
    });
    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section ref={sectionRef} className="section-editorial bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="label-section mb-12">(EXPLORE)</p>

        {/* Filter buttons */}
        <div className="mb-12 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn-editorial !text-[0.625rem] !px-5 !py-2 ${activeCategory === cat ? '!bg-text !text-bg !border-text' : ''}`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Staggered editorial cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExperiences.map((exp, i) => (
            <div key={exp.title} className="exp-card group overflow-hidden rounded-sm border border-line bg-bg-elevated transition-all duration-500 hover:border-line-strong">
              <div className="aspect-[16/10] relative overflow-hidden">
                <Image
                  src={getExperienceImage(exp.title, i)}
                  alt={exp.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated/90 via-transparent to-transparent" />
                <div className="absolute right-4 top-4">
                  <span className="rounded-full border border-line bg-bg/80 px-3 py-1 text-xs tracking-wide text-text-muted backdrop-blur-sm">
                    {exp.distance}
                  </span>
                </div>
                <div className="absolute left-4 top-4">
                  <span className="rounded-full border border-line bg-bg/40 px-3 py-1 text-[10px] uppercase tracking-wider text-text-muted backdrop-blur-sm">
                    {categoryLabels[exp.category as Category] || exp.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{exp.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{exp.description}</p>
                <p className="mt-4 micro-italic">We can arrange this for you</p>
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
function ExperiencesCTA() {
  return (
    <section className="bg-[#1B2A4A] text-white">
      <div className="py-32 lg:py-48">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
          <h2 className="display-lg !text-white">Let Us Curate<br />Your Istrian Adventure</h2>
          <p className="mt-6 font-accent text-sm italic text-white/60">Tell us your interests and we will create your perfect itinerary</p>
          <Link href="/contact" className="btn-editorial mt-12 !border-white/30 !text-white hover:!bg-white hover:!text-[#1B2A4A]">Plan My Experiences</Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERIENCES PAGE
   ═══════════════════════════════════════════════════════════ */
export default function ExperiencesPage() {
  return (
    <main>
      <ExperiencesHero />
      <ExperienceCards />
      <ExperiencesCTA />
    </main>
  );
}
