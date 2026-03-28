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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuRef.current || !menuLinksRef.current) return;
    if (menuOpen) {
      gsap.to(menuRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' });
      const links = menuLinksRef.current.querySelectorAll('.menu-link');
      gsap.fromTo(links, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2 });
    } else {
      gsap.to(menuRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.4, ease: 'power2.in' });
    }
  }, [menuOpen]);

  const switchLocale = useCallback(
    (newLocale: string) => { router.replace(pathname, { locale: newLocale }); },
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
          scrolled && !menuOpen
            ? 'bg-[#F5F0E8]/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-colors duration-700 ${
          scrolled && !menuOpen ? 'bg-[rgba(27,42,74,0.1)]' : 'bg-white/10'
        }`} />

        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link href="/" className="flex-shrink-0 z-10">
              <span className={`font-heading text-[0.6875rem] font-medium uppercase tracking-[0.25em] transition-colors duration-700 ${textClass}`}>
                Ballena & Beluga
              </span>
            </Link>

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

            {/* Right — Lang (mobile) + Book Now + Hamburger */}
            <div className="flex items-center gap-3 sm:gap-4 z-10">
              <div className={`flex sm:hidden items-center gap-2 text-[0.625rem] font-heading tracking-[0.12em] transition-colors duration-700`}>
                <button
                  onClick={() => switchLocale('en')}
                  className={`uppercase ${locale === 'en' ? textClass : menuOpen ? 'text-white/40' : scrolled ? 'text-[#1B2A4A]/30' : 'text-white/40'}`}
                >
                  EN
                </button>
                <span className={menuOpen ? 'text-white/40' : scrolled ? 'text-[#1B2A4A]/30' : 'text-white/40'}>/</span>
                <button
                  onClick={() => switchLocale('de')}
                  className={`uppercase ${locale === 'de' ? textClass : menuOpen ? 'text-white/40' : scrolled ? 'text-[#1B2A4A]/30' : 'text-white/40'}`}
                >
                  DE
                </button>
              </div>

              <Link
                href="/contact"
                className={`hidden md:inline-flex items-center justify-center gap-0.5 rounded-full px-5 py-2 text-[0.625rem] font-heading font-medium uppercase tracking-[0.15em] transition-all duration-700 ${
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
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative flex flex-col items-center justify-center w-11 h-11 gap-[6px] sm:w-10 sm:h-10 sm:gap-[5px]"
                aria-label="Toggle menu"
              >
                <span className={`block h-[1.5px] w-7 sm:w-6 transition-all duration-300 ${lineClass} ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
                <span className={`block h-[1.5px] w-7 sm:w-6 transition-all duration-300 ${lineClass} ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Full-Screen Menu Overlay — stays dark navy ── */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-[#1B2A4A] opacity-0 pointer-events-none"
        style={{ willChange: 'opacity' }}
      >
        <div className="flex h-full flex-col justify-center px-10 lg:px-20">
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
            <span className="font-accent italic text-sm text-white/40">Svetvincenat, Istria</span>
          </div>
        </div>
      </div>
    </>
  );
}
