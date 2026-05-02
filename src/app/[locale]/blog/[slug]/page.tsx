import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

/* ─────────────────────── Data ─────────────────────── */

const blogPosts = [
  {
    slug: 'truffle-season-in-istria',
    title: 'Truffle Season in Istria: A Complete Guide',
    category: 'Experiences',
    date: '2026-02-15',
    gradient: 'from-[#2a1a0d] via-[#3d2815] to-[#1a1008]',
  },
  {
    slug: 'rovinj-gem-of-the-adriatic',
    title: 'Rovinj: The Gem of the Adriatic Coast',
    category: 'Destination',
    date: '2026-02-01',
    gradient: 'from-[#0d1a2a] via-[#15283d] to-[#08101a]',
  },
  {
    slug: 'best-beaches-near-svetvincenat',
    title: 'Best Beaches Near Svetvinčenat',
    category: 'Destination',
    date: '2026-01-20',
    gradient: 'from-[#0d2a1a] via-[#153d28] to-[#081a10]',
  },
  {
    slug: 'istrian-wine-journey',
    title: 'Istrian Wine: A Journey Through Vineyards',
    category: 'Experiences',
    date: '2026-01-10',
    gradient: 'from-[#1a0d28] via-[#201235] to-[#180e2a]',
  },
  {
    slug: 'planning-the-perfect-istrian-wedding',
    title: 'Planning the Perfect Istrian Wedding',
    category: 'Events',
    date: '2025-12-28',
    gradient: 'from-[#2a0d1a] via-[#3d1528] to-[#1a0810]',
  },
  {
    slug: 'family-friendly-activities-central-istria',
    title: 'Family-Friendly Activities in Central Istria',
    category: 'Seasonal',
    date: '2025-12-15',
    gradient: 'from-[#1a2a0d] via-[#283d15] to-[#101a08]',
  },
];

/* ─────────────────────── Static Params ─────────────────────── */

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

/* ─────────────────────── Page ─────────────────────── */

function BlogPostContent({ slug }: { slug: string }) {
  const t = useTranslations('blog');
  const post = blogPosts.find((p) => p.slug === slug) ?? blogPosts[0];

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main>
      {/* ──────── Hero ──────── */}
      <section className="relative flex h-[50vh] min-h-[400px] items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,169,110,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full bg-gold/90 px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-midnight">
            {post.category}
          </span>
          <h1 className="heading-lg mt-6 text-3xl text-white sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <time className="mt-4 block text-sm tracking-wider text-white/40">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </section>

      {/* ──────── Article Body ──────── */}
      <section className="section-padding bg-midnight">
        <div className="mx-auto max-w-3xl px-6">
          <article className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-white/70">
              The rolling hills of Istria, dotted with centuries-old olive groves and vineyards, have long been a sanctuary for those who seek an authentic Mediterranean experience. Nestled in the heart of this peninsula, the medieval village of Svetvinčenat offers a gateway to a world where time seems to slow, where every meal tells a story, and where the landscape itself becomes a companion to your journey.
            </p>

            <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

            <p className="text-base leading-relaxed text-white/60">
              Istria has been called many things: the new Tuscany, Croatia&apos;s hidden gem, a food lover&apos;s paradise. Yet none of these labels quite capture its essence. It is a place of contrasts, where the azure waters of the Adriatic meet ancient hilltop towns shrouded in morning mist, where Roman ruins stand beside contemporary art galleries, and where a simple plate of hand-rolled pasta becomes an unforgettable experience.
            </p>

            <p className="mt-6 text-base leading-relaxed text-white/60">
              For visitors staying at Villa Ballena or Villa Beluga, the experience begins the moment you arrive. The warm stone, the scent of Mediterranean herbs drifting through open windows, the sound of cicadas on a summer evening — these are the details that transform a holiday into a memory. The villas themselves are designed to be a seamless extension of the Istrian landscape, with materials and aesthetics that honor the region&apos;s traditions while embracing contemporary luxury.
            </p>

            <p className="mt-6 text-base leading-relaxed text-white/60">
              Beyond the villas, the region unfolds like a series of beautifully curated chapters. Drive fifteen minutes in any direction and you might find yourself at a family winery pouring biodynamic Malvazija, at a coastal town where the day&apos;s catch is grilled over open flames, or at a forest clearing where trained dogs sniff out the prized white truffle. Each experience is distinct yet connected by the common thread of Istrian hospitality — warm, genuine, and unhurried.
            </p>

            <p className="mt-6 text-base leading-relaxed text-white/60">
              Whether you come for the gastronomy, the beaches, the culture, or simply the peace of a private pool under the Croatian sun, Istria rewards curiosity. It is a destination that reveals itself slowly, layer by layer, inviting you to return again and again. And with Villa Ballena and Villa Beluga as your home base, every adventure begins and ends in comfort.
            </p>
          </article>

          {/* ──────── Villa CTA ──────── */}
          <div className="mt-16 rounded-2xl border border-gold/20 bg-gradient-to-br from-midnight-light to-midnight p-8 text-center md:p-12">
            <p className="font-accent text-2xl italic text-gold md:text-3xl">
              Experience this from Villa Ballena
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50">
              Make Istria your home for a week. Explore the region from the comfort of a luxury villa with a heated pool, private sauna, and everything you need.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/villa-ballena"
                className="rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-widest text-midnight transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]"
              >
                Explore Villa Ballena
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-gold/40 px-8 py-3 text-sm font-medium uppercase tracking-widest text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
              >
                Check Availability
              </Link>
            </div>
          </div>

          {/* ──────── Back to Blog ──────── */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gold transition-all duration-300 hover:gap-3"
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
      <section className="section-padding border-t border-white/5 bg-midnight-light">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="heading-md mb-12 text-center text-xl text-white md:text-2xl">
            {t('relatedPosts')}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}` as '/blog/truffle-season-in-istria'}
                className="group overflow-hidden rounded-xl border border-white/5 transition-all duration-500 hover:border-gold/20"
              >
                <div className={`aspect-[16/10] bg-gradient-to-br ${related.gradient}`}>
                  <div className="flex h-full items-end bg-gradient-to-t from-midnight/60 to-transparent p-4">
                    <span className="rounded-full bg-gold/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-midnight">
                      {related.category}
                    </span>
                  </div>
                </div>
                <div className="bg-midnight/50 p-5">
                  <h3 className="heading-md text-sm text-white transition-colors duration-300 group-hover:text-gold">
                    {related.title}
                  </h3>
                  <time className="mt-2 block text-xs tracking-wider text-white/30">
                    {new Date(related.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
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
