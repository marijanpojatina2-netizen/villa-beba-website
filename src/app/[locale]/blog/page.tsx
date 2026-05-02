'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

/* ─────────────────────── Data ─────────────────────── */

const blogPosts = [
  {
    slug: 'truffle-season-in-istria',
    title: 'Truffle Season in Istria: A Complete Guide',
    excerpt: 'Discover when and where to find the prized white and black truffles of Istria. From forest hunts with trained dogs to gourmet dining experiences.',
    category: 'Experiences',
    date: '2026-02-15',
    image: '/images/ballena/Ballena 35-1.jpg',
  },
  {
    slug: 'rovinj-gem-of-the-adriatic',
    title: 'Rovinj: The Gem of the Adriatic Coast',
    excerpt: 'Just 23 km from our villas, Rovinj enchants with its pastel harbor and winding cobblestone streets. A perfect day trip from Svetvinčenat.',
    category: 'Destination',
    date: '2026-02-01',
    image: '/images/beluga/Beluga 42.jpg',
  },
  {
    slug: 'best-beaches-near-svetvincenat',
    title: 'Best Beaches Near Svetvinčenat',
    excerpt: 'Crystal-clear Adriatic waters await at hidden coves and sandy shores. Our guide to the finest beaches within a short drive of the villas.',
    category: 'Destination',
    date: '2026-01-20',
    image: '/images/beluga/Beluga 25.jpg',
  },
  {
    slug: 'istrian-wine-journey',
    title: 'Istrian Wine: A Journey Through Vineyards',
    excerpt: 'Malvazija, Teran, and Muskat — Istrian wines are making waves worldwide. Explore the cellars and vineyards that make this region special.',
    category: 'Experiences',
    date: '2026-01-10',
    image: '/images/beluga/Beluga 13.jpg',
  },
  {
    slug: 'planning-the-perfect-istrian-wedding',
    title: 'Planning the Perfect Istrian Wedding',
    excerpt: 'From medieval castles to poolside ceremonies under the stars, Istria offers the dreamiest wedding backdrop in the Mediterranean.',
    category: 'Events',
    date: '2025-12-28',
    image: '/images/ballena/Ballena 42.jpg',
  },
  {
    slug: 'family-friendly-activities-central-istria',
    title: 'Family-Friendly Activities in Central Istria',
    excerpt: 'Keep the whole family entertained with water parks, medieval villages, and outdoor adventures. Istria is a paradise for families of all ages.',
    category: 'Seasonal',
    date: '2025-12-15',
    image: '/images/beluga/Beluga 36.jpg',
  },
];

/* ─────────────────────── Component ─────────────────────── */

export default function BlogPage() {
  const t = useTranslations('blog');

  return (
    <main>
      {/* ──────── Hero ──────── */}
      <section className="relative flex h-[40vh] min-h-[320px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/beluga/Beluga 42.jpg" alt="Aerial view of Svetvinčenat village" fill className="object-cover" priority quality={85} />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-midnight/30 to-midnight/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-4 font-accent text-lg italic text-gold/80 md:text-xl">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* ──────── Blog Grid ──────── */}
      <section className="section-padding bg-midnight">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group overflow-hidden rounded-2xl border border-white/5 transition-all duration-500 hover:border-gold/20"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 to-transparent" />
                  {/* Category tag */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-gold/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-midnight">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-midnight-light/50 p-6">
                  <time className="text-xs tracking-wider text-white/40">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>

                  <h2 className="mt-3 heading-md text-base text-white transition-colors duration-300 group-hover:text-gold md:text-lg">
                    {post.title}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}` as '/blog/truffle-season-in-istria'}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gold transition-all duration-300 hover:gap-3"
                  >
                    {t('readMore')}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
