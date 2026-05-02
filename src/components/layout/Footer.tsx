'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT, INSTAGRAM_URL } from '@/lib/contact';

export default function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: '/villas/ballena', label: t('ballena') },
    { href: '/villas/beluga', label: t('beluga') },
    { href: '/villas/complex', label: t('complex') },
    { href: '/pricing', label: t('pricing') },
    { href: '/experiences', label: t('experiences') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <footer className="border-t border-gold/10 bg-midnight-light">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-[0.2em] text-white">
                Ballena <span className="text-gold">&amp;</span> Beluga
              </span>
            </Link>
            <p className="mt-4 font-[family-name:var(--font-accent)] text-lg italic text-white/50">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-[0.15em] text-gold">
              {t('quickLinks')}
            </h3>
            <ul className="mt-6 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-[0.15em] text-gold">
              {t('contactTitle')}
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-gold"
                >
                  <Mail size={16} className="flex-shrink-0 text-gold/60" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phoneE164}`}
                  className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-gold"
                >
                  <Phone size={16} className="flex-shrink-0 text-gold/60" />
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 text-sm text-white/60">
                  <MapPin size={16} className="flex-shrink-0 text-gold/60" />
                  {t('location')}
                </span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-[0.15em] text-gold">
              {t('followUs')}
            </h3>
            <div className="mt-6 flex gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-gold/50 hover:text-gold"
                aria-label={`Villa Ballena & Beluga on Instagram (@${CONTACT.instagramHandle})`}
              >
                <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/40">
              &copy; {year} Ballena &amp; Beluga. {t('rights')}
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-xs text-white/40 transition-colors hover:text-gold"
              >
                {t('privacy')}
              </Link>
              <Link
                href="/terms"
                className="text-xs text-white/40 transition-colors hover:text-gold"
              >
                {t('terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
