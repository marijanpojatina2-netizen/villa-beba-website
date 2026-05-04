'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CONTACT, INSTAGRAM_URL } from '@/lib/contact';
import EmailLink from '@/components/EmailLink';

export default function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1B2A4A]">
      {/* Top line */}
      <div className="h-px w-full bg-white/10" />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="inline-block">
              <span className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-white">
                Ballena & Beluga
              </span>
            </Link>
            <p className="mt-3 font-accent italic text-sm text-white/65 max-w-[25ch]">
              {t('tagline')}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { href: '/villa-ballena' as const, label: t('ballena') },
              { href: '/villa-beluga' as const, label: t('beluga') },
              { href: '/experiences' as const, label: t('experiences') },
              { href: '/weddings' as const, label: t('weddings') },
              { href: '/pricing' as const, label: t('pricing') },
              { href: '/contact' as const, label: t('contact') },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.75rem] font-heading uppercase tracking-[0.12em] text-white/65 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2">
            <EmailLink className="text-[0.8125rem] text-white/70 transition-colors hover:text-white" />
            <a href={`tel:${CONTACT.phoneE164}`} className="text-[0.8125rem] text-white/70 transition-colors hover:text-white">
              {CONTACT.phoneDisplay}
            </a>
            <div className="flex items-center gap-4 mt-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/65 transition-colors hover:text-white"
                aria-label={`Villa Ballena & Beluga on Instagram (@${CONTACT.instagramHandle})`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-5">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-[0.625rem] font-heading uppercase tracking-[0.15em] text-white/65">
            &copy; {year} Ballena & Beluga. {t('rights')}
          </p>
          <div className="flex items-center gap-5 text-[0.625rem] font-heading uppercase tracking-[0.15em] text-white/65">
            <Link href="/privacy" className="transition-colors hover:text-white">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              {t('terms')}
            </Link>
          </div>
          <p className="font-accent italic text-[0.75rem] text-white/65">
            {t('location')}
          </p>
        </div>
      </div>
    </footer>
  );
}
