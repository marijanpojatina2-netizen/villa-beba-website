'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { WHATSAPP_URL } from '@/lib/contact';

export default function CTA() {
  const t = useTranslations('home');
  const tc = useTranslations('common');
  return (
    <section className="bg-bg">
      <div className="line-h" />
      <div className="py-20 lg:py-28">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
          <h2 className="display-lg">{t('ctaTitleHome')}</h2>
          <p className="mt-6 micro-italic">{t('ctaSubtitle')}</p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contact" className="btn-editorial">{tc('bookAVisit')}</Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-editorial">{tc('whatsappUs')}</a>
          </div>
        </div>
      </div>
      <div className="line-h" />
    </section>
  );
}
