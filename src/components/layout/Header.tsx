'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import gsap from 'gsap';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // a11y: ESC closes the menu, Tab traps focus inside the open overlay,
  // closing the menu returns focus to the hamburger trigger.
  useEffect(() => {
    if (!menuOpen) return;
    const overlay = menuRef.current;
    if (!overlay) return;
    const trigger = hamburgerBtnRef.current;

    const getFocusables = () =>
      Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'));

    const focusFirst = setTimeout(() => getFocusables()[0]?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const fs = getFocusables();
      if (fs.length === 0) return;
      const first = fs[0];
      const last = fs[fs.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusFirst);
      document.removeEventListener('keydown', onKey);
      trigger?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuRef.current || !menuLinksRef.current) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (menuOpen) {
      if (reducedMotion) {
        gsap.set(menuRef.current, { opacity: 1, pointerEvents: 'auto' });
        const links = menuLinksRef.current.querySelectorAll('.menu-link');
        gsap.set(links, { y: 0, opacity: 1 });
      } else {
        gsap.to(menuRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' });
        const links = menuLinksRef.current.querySelectorAll('.menu-link');
        gsap.fromTo(links, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2 });
      }
    } else {
      if (reducedMotion) {
        gsap.set(menuRef.current, { opacity: 0, pointerEvents: 'none' });
      } else {
        gsap.to(menuRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.4, ease: 'power2.in' });
      }
    }
  }, [menuOpen]);

  const switchLocale = useCallback(
    (newLocale: string) => { router.replace(pathname, { locale: newLocale }); },
    [router, pathname],
  );

  const allNavLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/villa-ballena' as const, label: t('villaBallena') },
    { href: '/villa-beluga' as const, label: t('villaBeluga') },
    { href: '/complex-beba' as const, label: t('villaComplex') },
    { href: '/experiences' as const, label: t('experiences') },
    { href: '/weddings' as const, label: t('weddings') },
    { href: '/pricing' as const, label: t('pricing') },
    { href: '/gallery' as const, label: t('gallery') },
    { href: '/blog' as const, label: t('blog') },
    { href: '/about' as const, label: t('about') },
    { href: '/contact' as const, label: t('contact') },
  ];

  // On hero (not scrolled): white text. After scroll: navy text on beige bg.
  // Menu open: always white text (dark overlay).
  const textClass = menuOpen
    ? 'text-white'
    : scrolled
      ? 'text-[#1B2A4A]'
      : 'text-white';

  const lineClass = menuOpen
    ? 'bg-white'
    : scrolled
      ? 'bg-[#1B2A4A]'
      : 'bg-white';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          menuOpen
            ? 'bg-[#1B2A4A]'
            : scrolled
              ? 'bg-[#F5F0E8]/90 backdrop-blur-md shadow-sm'
              : 'bg-transparent'
        }`}
      >
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-colors duration-700 ${
          scrolled && !menuOpen ? 'bg-[rgba(27,42,74,0.1)]' : 'bg-white/10'
        }`} />

        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <div className="flex items-center gap-10 lg:gap-14 z-10">
              <Link href="/" className="flex-shrink-0">
                <span className={`font-heading text-[0.6875rem] font-medium uppercase tracking-[0.25em] transition-colors duration-700 ${textClass}`}>
                  Ballena & Beluga
                </span>
              </Link>

              {/* Primary nav (lg+ only) — top conversion destinations.
                  Hamburger continues to expose the full menu for everything else. */}
              <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
                <Link
                  href="/villa-ballena"
                  className={`font-heading text-[0.6875rem] font-medium uppercase tracking-[0.18em] transition-colors duration-700 ${textClass} hover:opacity-70`}
                >
                  {t('villaBallena')}
                </Link>
                <Link
                  href="/villa-beluga"
                  className={`font-heading text-[0.6875rem] font-medium uppercase tracking-[0.18em] transition-colors duration-700 ${textClass} hover:opacity-70`}
                >
                  {t('villaBeluga')}
                </Link>
                <Link
                  href="/experiences"
                  className={`font-heading text-[0.6875rem] font-medium uppercase tracking-[0.18em] transition-colors duration-700 ${textClass} hover:opacity-70`}
                >
                  {t('experiences')}
                </Link>
                <Link
                  href="/pricing"
                  className={`font-heading text-[0.6875rem] font-medium uppercase tracking-[0.18em] transition-colors duration-700 ${textClass} hover:opacity-70`}
                >
                  {t('pricing')}
                </Link>
              </nav>
            </div>

            {/* Center — Language Switcher (desktop) */}
            <div className={`hidden sm:flex items-center gap-3 text-[0.6875rem] font-heading tracking-[0.15em] transition-colors duration-700`}>
              <button
                onClick={() => switchLocale('en')}
                className={`uppercase transition-colors duration-300 ${
                  locale === 'en'
                    ? textClass
                    : menuOpen ? 'text-white/40' : scrolled ? 'text-[#1B2A4A]/30' : 'text-white/40'
                }`}
              >
                EN
              </button>
              <span className={menuOpen ? 'text-white/40' : scrolled ? 'text-[#1B2A4A]/30' : 'text-white/40'}>—</span>
              <button
                onClick={() => switchLocale('de')}
                className={`uppercase transition-colors duration-300 ${
                  locale === 'de'
                    ? textClass
                    : menuOpen ? 'text-white/40' : scrolled ? 'text-[#1B2A4A]/30' : 'text-white/40'
                }`}
              >
                DE
              </button>
            </div>

            {/* Right — Book Now + Hamburger.
                EN/DE language switcher lives inside the hamburger menu on
                mobile (see line ~289 below) — keeping it here too made the
                logo collide with the locale buttons on phones (≤ sm). */}
            <div className="flex items-center gap-3 sm:gap-4 z-10">
              <Link
                href="/contact"
                className={`inline-flex items-center justify-center gap-0.5 whitespace-nowrap rounded-full px-3 py-1.5 sm:px-5 sm:py-2 text-[0.5625rem] sm:text-[0.625rem] font-heading font-medium uppercase tracking-[0.15em] transition-all duration-700 ${
                  menuOpen
                    ? 'border border-white text-white hover:bg-white hover:text-[#1B2A4A]'
                    : scrolled
                      ? 'border border-[#1B2A4A] bg-[#1B2A4A] text-[#F5F0E8] hover:bg-transparent hover:text-[#1B2A4A]'
                      : 'border border-white bg-white text-[#1B2A4A] hover:bg-transparent hover:text-white'
                }`}
              >
                {t('bookNow')}
              </Link>

              <button
                ref={hamburgerBtnRef}
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-controls="primary-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="relative flex flex-col items-center justify-center w-11 h-11 gap-[6px] sm:w-10 sm:h-10 sm:gap-[5px]"
              >
                <span className={`block h-[1.5px] w-7 sm:w-6 transition-all duration-300 ${lineClass} ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
                <span className={`block h-[1.5px] w-7 sm:w-6 transition-all duration-300 ${lineClass} ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Full-Screen Menu Overlay — starts below header ── */}
      <div
        ref={menuRef}
        id="primary-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        data-lenis-prevent
        className="fixed top-16 lg:top-20 left-0 right-0 bottom-0 z-40 bg-[#1B2A4A] opacity-0 pointer-events-none overflow-y-auto overscroll-contain"
        style={{ willChange: 'opacity' }}
      >
        <div className="flex min-h-full flex-col justify-start px-10 lg:px-20 pt-8 pb-10">
          <div ref={menuLinksRef} className="flex flex-col gap-0">
            {allNavLinks.map((link) => (
              <div key={link.href} className="menu-link border-b border-white/10">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between py-5 lg:py-6"
                >
                  <span className="font-display text-3xl lg:text-5xl font-400 italic text-white transition-colors duration-300 group-hover:text-white/50">
                    {link.label}
                  </span>
                  <svg className="h-5 w-5 text-white/30 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-between text-white/30">
            <div className="flex items-center gap-4 text-sm font-heading tracking-wider">
              <button onClick={() => { switchLocale('en'); setMenuOpen(false); }} className={`uppercase ${locale === 'en' ? 'text-white' : 'hover:text-white/60'}`}>EN</button>
              <span>—</span>
              <button onClick={() => { switchLocale('de'); setMenuOpen(false); }} className={`uppercase ${locale === 'de' ? 'text-white' : 'hover:text-white/60'}`}>DE</button>
            </div>
            <span className="font-accent italic text-sm text-white/40">Svetvinčenat, Istria</span>
          </div>
        </div>
      </div>
    </>
  );
}
