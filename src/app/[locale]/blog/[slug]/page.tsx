import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const blogPosts = [
  { slug: 'truffle-season-in-istria', title: 'Truffle Season in Istria: A Complete Guide', category: 'Experiences', date: '2026-02-15' },
  { slug: 'rovinj-gem-of-the-adriatic', title: 'Rovinj: The Gem of the Adriatic Coast', category: 'Destination', date: '2026-02-01' },
  { slug: 'best-beaches-near-svetvincenat', title: 'Best Beaches Near Svetvincenat', category: 'Destination', date: '2026-01-20' },
  { slug: 'istrian-wine-journey', title: 'Istrian Wine: A Journey Through Vineyards', category: 'Experiences', date: '2026-01-10' },
  { slug: 'planning-the-perfect-istrian-wedding', title: 'Planning the Perfect Istrian Wedding', category: 'Events', date: '2025-12-28' },
  { slug: 'family-friendly-activities-central-istria', title: 'Family-Friendly Activities in Central Istria', category: 'Seasonal', date: '2025-12-15' },
];

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

function BlogPostContent({ slug }: { slug: string }) {
  const t = useTranslations('blog');
  const post = blogPosts.find((p) => p.slug === slug) ?? blogPosts[0];
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main>
      {/* ──────── Hero ──────── */}
      <section className="relative flex h-[50vh] min-h-[400px] items-end overflow-hidden">
        <div className="absolute inset-0 bg-bg-subtle" />
        <div className="relative z-10 mx-auto w-full max-w-[900px] px-6 lg:px-10 pb-12 lg:pb-16">
          <span className="label-section">({post.category.toUpperCase()})</span>
          <h1 className="mt-4 display-lg">{post.title}</h1>
          <time className="mt-4 block font-heading text-[0.6875rem] tracking-wider text-text-dim">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>
      </section>

      {/* ──────── Article Body ──────── */}
      <section className="section-editorial bg-bg">
        <div className="mx-auto max-w-[700px] px-6 lg:px-10">
          <article>
            <p className="text-lg leading-relaxed text-text-muted">
              The rolling hills of Istria, dotted with centuries-old olive groves and vineyards, have long been a sanctuary for those who seek an authentic Mediterranean experience. Nestled in the heart of this peninsula, the medieval village of Svetvincenat offers a gateway to a world where time seems to slow, where every meal tells a story, and where the landscape itself becomes a companion to your journey.
            </p>

            <div className="my-10 line-h" />

            <p className="text-base leading-relaxed text-text-muted">
              Istria has been called many things: the new Tuscany, Croatia&apos;s hidden gem, a food lover&apos;s paradise. Yet none of these labels quite capture its essence. It is a place of contrasts, where the azure waters of the Adriatic meet ancient hilltop towns shrouded in morning mist, where Roman ruins stand beside contemporary art galleries, and where a simple plate of hand-rolled pasta becomes an unforgettable experience.
            </p>

            <p className="mt-6 text-base leading-relaxed text-text-muted">
              For visitors staying at Villa Ballena or Villa Beluga, the experience begins the moment you arrive. The warm stone, the scent of Mediterranean herbs drifting through open windows, the sound of cicadas on a summer evening — these are the details that transform a holiday into a memory. The villas themselves are designed to be a seamless extension of the Istrian landscape, with materials and aesthetics that honor the region&apos;s traditions while embracing contemporary luxury.
            </p>

            <p className="mt-6 text-base leading-relaxed text-text-muted">
              Beyond the villas, the region unfolds like a series of beautifully curated chapters. Drive fifteen minutes in any direction and you might find yourself at a family winery pouring biodynamic Malvazija, at a coastal town where the day&apos;s catch is grilled over open flames, or at a forest clearing where trained dogs sniff out the prized white truffle. Each experience is distinct yet connected by the common thread of Istrian hospitality — warm, genuine, and unhurried.
            </p>

            <p className="mt-6 text-base leading-relaxed text-text-muted">
              Whether you come for the gastronomy, the beaches, the culture, or simply the peace of a private pool under the Croatian sun, Istria rewards curiosity. It is a destination that reveals itself slowly, layer by layer, inviting you to return again and again. And with Villa Ballena and Villa Beluga as your home base, every adventure begins and ends in comfort.
            </p>
          </article>

          {/* ──────── Villa CTA ──────── */}
          <div className="mt-16 rounded-sm border border-line bg-bg-elevated p-8 text-center md:p-12">
            <p className="display-md">Experience this from Villa Ballena</p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-muted">
              Make Istria your home for a week. Explore the region from the comfort of a luxury villa with a heated pool, private sauna, and everything you need.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/villa-ballena" className="btn-editorial">Explore Villa Ballena</Link>
              <Link href="/contact" className="btn-editorial">Check Availability</Link>
            </div>
          </div>

          {/* ──────── Back to Blog ──────── */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text transition-all duration-300 hover:gap-3"
            >
              <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </section>

      {/* ──────── Related Posts ──────── */}
      <section className="section-editorial border-t border-line bg-bg-elevated">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="label-section mb-12">(RELATED)</p>
          <h2 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text mb-12">{t('relatedPosts')}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}` as '/blog/truffle-season-in-istria'}
                className="group overflow-hidden rounded-sm border border-line transition-all duration-500 hover:border-line-strong"
              >
                <div className="aspect-[16/10] bg-bg-subtle">
                  <div className="flex h-full items-end p-4">
                    <span className="label-section">({related.category.toUpperCase()})</span>
                  </div>
                </div>
                <div className="bg-bg p-5">
                  <h3 className="font-heading text-sm font-medium uppercase tracking-[0.08em] text-text transition-colors duration-300 group-hover:text-text-muted">
                    {related.title}
                  </h3>
                  <time className="mt-2 block font-heading text-[0.6875rem] tracking-wider text-text-dim">
                    {new Date(related.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostContent slug={slug} />;
}
