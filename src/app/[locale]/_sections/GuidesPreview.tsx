import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { guides } from '@/lib/guides';

// Server component (intentionally no `'use client'`) so the guide links land in
// the SSR HTML. The home page is one of the few already-indexed pages, so these
// are the internal links that let Googlebot — and AI crawlers (GPTBot,
// ClaudeBot, PerplexityBot) — discover and value the guide hub while off-site
// authority builds. Same SSR-for-crawlers rationale as LocationLifestyle.tsx.
const FEATURED = [
  'hiking-and-cycling-near-svetvincenat',
  'pet-friendly-villa-istria',
  'best-time-to-visit-istria',
  'truffle-hunting-near-svetvincenat',
  'beaches-near-svetvincenat',
  'olive-oil-tasting-near-svetvincenat',
];

const CATEGORY_LABEL: Record<string, { en: string; de: string }> = {
  planning: { en: 'Planning', de: 'Planung' },
  events: { en: 'Events', de: 'Events' },
  amenities: { en: 'Amenities', de: 'Ausstattung' },
  arrival: { en: 'Arrival', de: 'Anreise' },
};

export default function GuidesPreview({ locale }: { locale: string }) {
  const isDE = locale === 'de';
  const featured = FEATURED.map((slug) =>
    guides.find((g) => g.slug === slug),
  ).filter((g): g is NonNullable<typeof g> => Boolean(g?.hero));

  if (featured.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="label-section">{isDE ? '(REISEFÜHRER)' : '(GUIDES)'}</h2>
          <Link href="/guides" className="btn-editorial !text-[0.6rem]">
            {isDE ? 'Alle ansehen' : 'View All'}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((guide) => {
            const loc = isDE ? guide.de : guide.en;
            const hero = guide.hero!;
            const category =
              CATEGORY_LABEL[guide.category]?.[isDE ? 'de' : 'en'] ?? guide.category;
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line transition-all duration-500 group-hover:border-line-strong">
                  <Image
                    src={hero.src}
                    alt={isDE ? hero.alt.de : hero.alt.en}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-heading uppercase tracking-widest text-white/80 backdrop-blur-sm">
                      {category}
                    </span>
                  </div>
                </div>
                <h3 className="mt-4 font-heading text-sm font-medium uppercase tracking-[0.08em] text-text transition-colors duration-300 group-hover:text-text-muted">
                  {loc.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
                  {loc.excerpt}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
