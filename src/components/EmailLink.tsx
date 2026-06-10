'use client';

import { useSyncExternalStore } from 'react';
import { CONTACT } from '@/lib/contact';

// Hydration detector without the setState-in-effect lint trap: the server
// snapshot is false, the client snapshot is true, and React re-renders once
// after hydration — exactly the old useEffect(() => setHydrated(true)) timing.
const emptySubscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

// Render an obfuscated email at SSR time — `info [at] domain.com` — and
// hydrate to a working mailto: after the page is interactive. Crawlers
// that don't execute JS (most spam harvesters and SEOptimizer's clear-
// text email check) only see the obfuscated form, while real users get
// a one-tap mailto: as soon as React hydrates.
//
// Usage: <EmailLink className="..." />  (no children needed)
export default function EmailLink({ className }: { className?: string }) {
  const hydrated = useHydrated();

  // The CONTACT.email constant lives in code, never reaches the static
  // HTML — Next.js inlines it into the JS bundle, but harvesters that
  // scrape rendered HTML won't pull it.
  const [user, domain] = CONTACT.email.split('@');

  if (!hydrated) {
    return (
      <span className={className} aria-label={`Email: ${user} at ${domain}`}>
        {user}
        <span aria-hidden="true"> [at] </span>
        {domain}
      </span>
    );
  }

  return (
    <a href={`mailto:${CONTACT.email}`} className={className}>
      {CONTACT.email}
    </a>
  );
}
