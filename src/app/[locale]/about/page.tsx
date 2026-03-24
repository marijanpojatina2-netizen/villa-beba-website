'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

/* ─────────────────────── Component ─────────────────────── */

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    {
      title: 'Privacy',
      description:
        'Your own fenced grounds, private pool, and secluded terrace. No shared lobbies, no neighbors peering over. Just your family and the Istrian sky.',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      title: 'Design',
      description:
        'Every detail is intentional. From the underfloor heating to the biological pool water, our villas blend contemporary aesthetics with functional luxury.',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
    },
    {
      title: 'Authenticity',
      description:
        'We are rooted in Istria. We know the truffle hunters, the winemakers, the fishermen. Every experience we recommend is one we have lived ourselves.',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.692-.8 1.26l.018.105c.07.417-.254.782-.642.782H11.25" />
        </svg>
      ),
    },
    {
      title: 'Hospitality',
      description:
        'No rigid schedules or impersonal service. Just attentive, warm support when you need it and complete freedom when you do not.',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
  ];

  return (
    <main>
      {/* ──────── Hero ──────── */}
      <section className="relative flex h-[60vh] min-h-[480px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/ballena/Ballena 35-1.jpg" alt="Olive tree courtyard at Villa Ballena" fill className="object-cover" priority quality={85} />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-midnight/30 to-midnight/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {t('title')}
          </h1>
          <p className="mt-6 font-accent text-xl italic text-gold/80 md:text-2xl">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* ──────── Story Section ──────── */}
      <section className="section-padding bg-midnight">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h2 className="heading-lg text-2xl text-white md:text-3xl lg:text-4xl">
                {t('storyTitle')}
              </h2>
              <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent lg:mx-0" />
              <p className="mt-8 font-accent text-lg leading-relaxed text-white/70 md:text-xl">
                {t('story')}
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/ballena/Ballena 42.jpg"
                alt="Aerial view of both villas at dusk"
                fill
                className="object-cover"
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ──────── Philosophy Section ──────── */}
      <section className="section-padding bg-midnight-light">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="heading-lg text-2xl text-white md:text-3xl lg:text-4xl">
              {t('philosophyTitle')}
            </h2>
            <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <p className="mt-8 text-base leading-relaxed text-white/60 md:text-lg">
              {t('philosophy')}
            </p>
          </div>
        </div>
      </section>

      {/* ──────── Values Grid ──────── */}
      <section className="section-padding bg-midnight">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-white/5 bg-midnight-light/30 p-8 transition-all duration-500 hover:border-gold/20"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold transition-all duration-300 group-hover:bg-gold/20">
                  {value.icon}
                </div>
                <h3 className="mt-6 heading-md text-base text-white">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="relative overflow-hidden bg-midnight-light py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,169,110,0.08)_0%,transparent_50%)]" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="font-accent text-2xl italic text-gold md:text-3xl lg:text-4xl">
            Experience our philosophy firsthand
          </p>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-white/50">
            Whether you seek a quiet wellness retreat or a lively family celebration, Villa Ballena and Villa Beluga await you in the heart of Istria.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-midnight transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
