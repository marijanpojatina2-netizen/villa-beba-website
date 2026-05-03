'use client';

import { useTranslations } from 'next-intl';

export default function Reviews() {
  const t = useTranslations('home');
  return (
    <section className="bg-bg py-20 lg:py-28">
      <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
        <span className="block font-display text-8xl leading-none text-text-dim/20 select-none mb-4">&ldquo;</span>
        <blockquote>
          <p className="font-accent text-xl italic leading-relaxed text-text/80 lg:text-3xl lg:leading-relaxed">
            {t('reviewQuote')}
          </p>
        </blockquote>
        <footer className="mt-10">
          <p className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-text-muted">{t('reviewAuthor')}</p>
          <p className="mt-1 text-[0.75rem] text-text-dim">{t('reviewLocation')}</p>
        </footer>
      </div>
    </section>
  );
}
