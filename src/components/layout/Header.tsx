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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Animate menu open/close
  useEffect(() => {
    if (!menuRef.current || !menuLinksRef.current) return;

    if (menuOpen) {
      // Fade in overlay
      gsap.to(menuRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' });
      // Stagger nav links from below
      const links = menuLinksRef.current.querySelectorAll('.menu-link');
      gsap.fromTo(links,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
      );
    } else {
      gsap.to(menuRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.4, ease: 'power2.in' });
    }
  }, [menuOpen]);

  const switchLocale = useCallback(
    (newLocale: string) => {
      router.replace(pathname, { locale: newLocale });
    },
    [router, pathname],
  );

  const allNavLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/villa-ballena' as const, label: 'Villa Ballena' },
    { href: '/villa-beluga' as const, label: 'Villa Beluga' },
    { href: '/complex-beba' as const, label: 'Complex BeBa' },
    { href: '/experiences' as const, label: t('experiences') },
    { href: '/weddings' as const, label: t('weddings') },
    { href: '/pricing' as const, label: t('pricing') },
    { href: '/gallery' as const, label: 'Gallery' },
    { href: '/about' as const, label: 'About' },
    { href: '/contact' as const, label: t('contact') },
  ];

  return (
    <>
      {/* ── Header Bar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-bg/90 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        {/* Thin header line (like ELYSE) */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-line" />

        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between lg:h-20">

            {/* Logo — left */}
            <Link href="/" className="flex-shrink-0 z-10">
              <span className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-text">
                Ballena & Beluga
              </span>
            </Link>

            {/* Center — Language Switcher */}
            <div className="hidden sm:flex items-center gap-3 text-[0.6875rem] font-heading tracking-[0.15em]">
              <button
                onClick={() => switchLocale('en')}
                className={`uppercase transition-colors duration-300 ${
                  locale === 'en' ? 'text-text' : 'text-text-dim hover:text-text-muted'
                }`}
              >
                EN
              </button>
              <span className="text-text-dim">—</span>
              <button
                onClick={() => switchLocale('de')}
                className={`uppercase transition-colors duration-300 ${
                  locale === 'de' ? 'text-text' : 'text-text-dim hover:text-text-muted'
                }`}
              >
                DE
              </button>
            </div>

            {/* Right — Book a Visit + Hamburger */}
            <div className="flex items-center gap-4 z-10">
              <Link
                href="/contact"
                className="btn-editorial-filled hidden sm:inline-flex"
              >
                {t('bookNow')}
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative flex flex-col items-center justify-center w-10 h-10 gap-[5px]"
                aria-label="Toggle menu"
              >
                <span className={`block h-[1px] w-6 bg-text transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
                <span className={`block h-[1px] w-6 bg-text transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Full-Screen Menu Overlay ── */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-bg opacity-0 pointer-events-none"
        style={{ willChange: 'opacity' }}
      >
        <div className="flex h-full flex-col justify-center px-10 lg:px-20">
          <div ref={menuLinksRef} className="flex flex-col gap-0">
            {allNavLinks.map((link) => (
              <div key={link.href} className="menu-link border-b border-line">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between py-5 lg:py-6"
                >
                  <span className="font-display text-3xl lg:text-5xl font-400 italic text-text transition-colors duration-300 group-hover:text-text-muted">
                    {link.label}
                  </span>
                  <svg
                    className="h-5 w-5 text-text-dim transition-transform duration-300 group-hover:translate-x-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          {/* Menu Footer — Language + Contact */}
          <div className="mt-12 flex items-center justify-between text-text-dim">
            <div className="flex items-center gap-4 text-sm font-heading tracking-wider">
              <button
                onClick={() => { switchLocale('en'); setMenuOpen(false); }}
                className={`uppercase ${locale === 'en' ? 'text-text' : 'hover:text-text-muted'}`}
              >
                EN
              </button>
              <span>—</span>
              <button
                onClick={() => { switchLocale('de'); setMenuOpen(false); }}
                className={`uppercase ${locale === 'de' ? 'text-text' : 'hover:text-text-muted'}`}
              >
                DE
              </button>
            </div>
            <span className="micro-italic">Svetvincenat, Istria</span>
          </div>
        </div>
      </div>
    </>
  );
}
