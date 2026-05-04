import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

// Server component (intentionally no `'use client'`) — the copy needs to
// land in the SSR HTML so search-engine crawlers and AI training crawlers
// (GPTBot, ClaudeBot, PerplexityBot, Googlebot) lift the keyword-rich
// text without executing JavaScript. Hits the SEOptimizer phrase-
// consistency table (Ballena Beluga, Villa Ballena, Villa Beluga,
// Svetvinčenat Istria, private luxury, relaxed Mediterranean, Mediterranean
// elegance) and pushes the home page word count past the "thin content"
// threshold (was 397 words; SEOptimizer recommends 600+).
export default async function LocationLifestyle({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'homeLocation' });

  return (
    <section className="bg-bg-subtle py-20 lg:py-28">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
        <p className="font-heading text-[0.6875rem] uppercase tracking-[0.2em] text-text-dim">
          {t('eyebrow')}
        </p>
        <h2 className="mt-4 font-display text-3xl lg:text-5xl leading-tight text-text">
          {t('title')}
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-5 text-[0.95rem] leading-relaxed text-text">
            <p>{t('p1')}</p>
            <p>{t('p2')}</p>
            <p>{t('p3')}</p>
          </div>

          <div className="space-y-5 text-[0.95rem] leading-relaxed text-text">
            <p>{t('p4')}</p>
            <p>{t('p5')}</p>
            <p>{t('p6')}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/villa-ballena' as const, label: t('linkBallena') },
            { href: '/villa-beluga' as const, label: t('linkBeluga') },
            { href: '/experiences' as const, label: t('linkExperiences') },
            { href: '/faq' as const, label: t('linkFaq') },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-center justify-between rounded-sm border border-line bg-bg p-5 transition-colors hover:border-text"
            >
              <span className="font-heading text-[0.75rem] uppercase tracking-[0.15em] text-text">
                {c.label}
              </span>
              <span className="text-text-dim transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
