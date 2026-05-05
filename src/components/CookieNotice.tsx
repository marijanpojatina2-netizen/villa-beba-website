'use client';

import { useState, useSyncExternalStore } from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

// Storage key — bumped if the notice copy changes materially (e.g. when
// Google Analytics is added and visitors must re-consent to tracking).
const STORAGE_KEY = 'bb-notice-v1';

// Informational notice rather than a true CMP. The site sets zero
// first-party cookies (Vercel Analytics is cookieless, locale cookie
// disabled in routing.ts) — so legally a consent banner isn't required
// today. The notice exists for two reasons:
//   1. Embedded Google Maps loads Google's own cookies inside its iframe;
//      visitors deserve the heads-up before clicking the map.
//   2. Croatian / German visitors expect *some* notice on a hospitality
//      site — its absence reads as oversight, not as good privacy hygiene.
// Dismissal stored in localStorage, NOT a cookie, so the privacy page's
// "no cookies" claim stays true byte-for-byte.

// `useSyncExternalStore` keeps the SSR snapshot stable (always "dismissed",
// so the banner doesn't flash into the static HTML) and only flips on the
// client after hydration if storage actually disagrees. This avoids both
// the hydration mismatch warning and the `set-state-in-effect` lint rule.
function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getStoredDismissed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'dismissed';
  } catch {
    return true;
  }
}

function getServerSnapshot(): boolean {
  return true;
}

export default function CookieNotice() {
  const locale = useLocale();
  const persistedDismissed = useSyncExternalStore(subscribe, getStoredDismissed, getServerSnapshot);
  const [sessionDismissed, setSessionDismissed] = useState(false);

  if (persistedDismissed || sessionDismissed) return null;

  const isDE = locale === 'de';
  const text = isDE
    ? 'Diese Webseite setzt keine Tracking-Cookies. Eingebettete Google-Karten können eigene Cookies setzen. Mehr in unserer'
    : 'This site uses no tracking cookies. Embedded Google Maps may set its own cookies. Read our';
  const linkLabel = isDE ? 'Datenschutzerklärung' : 'privacy policy';
  const dismiss = isDE ? 'Verstanden' : 'Got it';

  function close() {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      // Storage blocked — fall back to in-memory dismissal so the user
      // isn't stuck staring at the banner this session.
    }
    setSessionDismissed(true);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isDE ? 'Datenschutzhinweis' : 'Privacy notice'}
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-md rounded-md border border-white/10 bg-[#1B2A4A] px-5 py-4 text-[0.8125rem] leading-relaxed text-white/85 shadow-lg sm:left-auto sm:right-6 sm:bottom-6"
    >
      <p className="font-body">
        {text}{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
          {linkLabel}
        </Link>
        .
      </p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={close}
          className="rounded border border-white/30 px-4 py-1.5 font-heading text-[0.625rem] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1B2A4A]"
        >
          {dismiss}
        </button>
      </div>
    </div>
  );
}
