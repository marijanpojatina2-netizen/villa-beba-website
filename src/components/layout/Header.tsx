'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [villasOpen, setVillasOpen] = useState(false);
  const [mobileVillasOpen, setMobileVillasOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const switchLocale = useCallback(
    (newLocale: string) => {
      router.replace(pathname, { locale: newLocale });
    },
    [router, pathname],
  );

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/experiences', label: t('experiences') },
    { href: '/weddings', label: t('weddings') },
    { href: '/pricing', label: t('pricing') },
    { href: '/contact', label: t('contact') },
  ];

  const villaLinks = [
    { href: '/villa-ballena', label: t('villaBallena') },
    { href: '/villa-beluga', label: t('villaBeluga') },
    { href: '/complex-beba', label: t('villaComplex') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-midnight/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-[0.2em] text-white">
                Ballena <span className="text-gold">&amp;</span> Beluga
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink href="/" label={t('home')} pathname={pathname} />

              {/* Villas Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setVillasOpen(true)}
                onMouseLeave={() => setVillasOpen(false)}
              >
                <button className="group relative flex items-center gap-1 text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:text-gold">
                  {t('villas')}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${villasOpen ? 'rotate-180' : ''}`}
                  />
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </button>

                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
                    villasOpen
                      ? 'pointer-events-auto translate-y-0 opacity-100'
                      : 'pointer-events-none -translate-y-2 opacity-0'
                  }`}
                >
                  <div className="min-w-[200px] rounded-lg border border-white/10 bg-midnight/95 p-3 backdrop-blur-md shadow-xl">
                    {villaLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block rounded-md px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <NavLink href="/experiences" label={t('experiences')} pathname={pathname} />
              <NavLink href="/weddings" label={t('weddings')} pathname={pathname} />
              <NavLink href="/pricing" label={t('pricing')} pathname={pathname} />
              <NavLink href="/contact" label={t('contact')} pathname={pathname} />
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="hidden sm:flex items-center gap-1 text-sm">
                <button
                  onClick={() => switchLocale('en')}
                  className={`px-1.5 py-0.5 uppercase tracking-wider transition-colors ${
                    locale === 'en'
                      ? 'text-gold font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <span className="text-white/30">|</span>
                <button
                  onClick={() => switchLocale('de')}
                  className={`px-1.5 py-0.5 uppercase tracking-wider transition-colors ${
                    locale === 'de'
                      ? 'text-gold font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  DE
                </button>
              </div>

              {/* Book Now Button */}
              <Link
                href="/contact"
                className="hidden sm:inline-flex rounded-full border border-gold bg-gold/10 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
              >
                {t('bookNow')}
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-midnight/98 backdrop-blur-lg transition-all duration-500 lg:hidden ${
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-6">
          {/* Mobile Language Switcher */}
          <div className="flex items-center gap-3 text-base mb-4">
            <button
              onClick={() => {
                switchLocale('en');
                setMobileOpen(false);
              }}
              className={`uppercase tracking-wider transition-colors ${
                locale === 'en' ? 'text-gold font-semibold' : 'text-white/60'
              }`}
            >
              EN
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => {
                switchLocale('de');
                setMobileOpen(false);
              }}
              className={`uppercase tracking-wider transition-colors ${
                locale === 'de' ? 'text-gold font-semibold' : 'text-white/60'
              }`}
            >
              DE
            </button>
          </div>

          {/* Mobile Nav Links */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="text-2xl font-[family-name:var(--font-heading)] uppercase tracking-[0.15em] text-white transition-colors hover:text-gold"
          >
            {t('home')}
          </Link>

          {/* Villas Accordion */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setMobileVillasOpen(!mobileVillasOpen)}
              className="flex items-center gap-2 text-2xl font-[family-name:var(--font-heading)] uppercase tracking-[0.15em] text-white transition-colors hover:text-gold"
            >
              {t('villas')}
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                  mobileVillasOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`flex flex-col items-center gap-3 overflow-hidden transition-all duration-300 ${
                mobileVillasOpen
                  ? 'mt-4 max-h-48 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              {villaLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg text-white/70 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-[family-name:var(--font-heading)] uppercase tracking-[0.15em] text-white transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Book Now */}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-6 rounded-full border border-gold bg-gold/10 px-8 py-3 text-base font-semibold uppercase tracking-wider text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
          >
            {t('bookNow')}
          </Link>
        </div>
      </div>
    </>
  );
}

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group relative text-sm font-medium uppercase tracking-wider transition-colors ${
        isActive ? 'text-gold' : 'text-white/80 hover:text-gold'
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-1 left-0 h-[1px] bg-gold transition-all duration-300 ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  );
}
