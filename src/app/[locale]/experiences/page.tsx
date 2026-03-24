'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { experiences } from '@/lib/data';

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

/* Image mapping for experience cards by title */
const experienceImages: Record<string, string> = {
  'Wine Tasting': '/images/beluga/Beluga 13.jpg',
  'Truffle Hunting': '/images/ballena/Ballena 35-1.jpg',
  'Rovinj': '/images/beluga/Beluga 42.jpg',
  'Beaches': '/images/beluga/Beluga 25.jpg',
};

/* Rotating fallback images for cards without a specific mapping */
const fallbackImages = [
  '/images/ballena/Ballena 42.jpg',
  '/images/beluga/Beluga 36.jpg',
  '/images/ballena/Ballena 36.jpg',
  '/images/beluga/Beluga 35.jpg',
  '/images/ballena/Ballena 38.jpg',
  '/images/beluga/Beluga 27.jpg',
  '/images/ballena/Ballena 23.jpg',
  '/images/beluga/Beluga 9.jpg',
];

function getExperienceImage(title: string, index: number): string {
  /* Check for exact or partial title match */
  for (const [key, src] of Object.entries(experienceImages)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return src;
    }
  }
  return fallbackImages[index % fallbackImages.length];
}

/* ─────────────────────────── Hero ─────────────────────────── */
function ExperiencesHero() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/beluga/Beluga 13.jpg" alt="Stone wall terrace at Villa Beluga" fill className="object-cover" priority quality={85} />
        {/* No overlay — clean photo */}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center [text-shadow:0_2px_20px_rgba(0,0,0,0.7),0_4px_40px_rgba(0,0,0,0.5)]">
        <ScrollReveal>
          <p className="mb-6 font-accent text-lg italic tracking-wide text-gold md:text-xl">
            Beyond the villa
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <h1 className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Istrian Experiences
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-xl text-sm uppercase tracking-[0.3em] text-white/50 md:text-base">
            Your villa is the beginning. Istria is the adventure.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ────────────────── Experience Cards Grid ────────────────── */
function ExperienceCards() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredExperiences =
    activeCategory === 'all'
      ? experiences
      : experiences.filter((exp) => exp.category === activeCategory);

  const categories: Category[] = ['all', 'gastronomy', 'daytrip', 'nature', 'sports', 'family', 'culture'];

  return (
    <section className="section-padding bg-midnight">
      <div className="mx-auto max-w-7xl px-6">
        {/* Filter buttons */}
        <ScrollReveal>
          <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gold text-midnight'
                    : 'border border-white/10 bg-white/5 text-white/60 hover:border-gold/30 hover:text-gold'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExperiences.map((exp, i) => (
            <ScrollReveal key={exp.title} delay={(i % 3) * 0.1}>
              <div className="group h-full overflow-hidden rounded-xl border border-white/5 bg-midnight-light/50 transition-all duration-500 hover:border-gold/20">
                {/* Image */}
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={getExperienceImage(exp.title, i)}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    quality={75}
                  />
                  {/* No overlay — clean experience photo */}

                  {/* Distance badge */}
                  <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-midnight/80 px-3 py-1 text-xs tracking-wide text-gold backdrop-blur-sm">
                      {exp.distance}
                    </span>
                  </div>

                  {/* Category tag */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-wider text-white/60 backdrop-blur-sm">
                      {categoryLabels[exp.category as Category] || exp.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="heading-md text-lg text-white">
                    {exp.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {exp.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-gold">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                      </svg>
                    </span>
                    <span className="font-accent text-sm italic text-gold/70">
                      We can arrange this for you
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

/* ───────────────────────── CTA ──────────────────────────── */
function ExperiencesCTA() {
  return (
    <section className="relative overflow-hidden bg-midnight py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,169,110,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(201,169,110,0.06)_0%,transparent_50%)]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <h2 className="heading-lg text-3xl text-white md:text-4xl lg:text-5xl">
            Let Us Curate<br />Your Istrian Adventure
          </h2>
          <p className="mt-6 font-accent text-xl italic text-gold/80">
            Tell us your interests and we will create your perfect itinerary
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-midnight transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]"
            >
              Plan My Experiences
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ═══════════════════ EXPERIENCES PAGE ═══════════════════════ */
export default function ExperiencesPage() {
  return (
    <main>
      <ExperiencesHero />
      <ExperienceCards />
      <ExperiencesCTA />
    </main>
  );
}
