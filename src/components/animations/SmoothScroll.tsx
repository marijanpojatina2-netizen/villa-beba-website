'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Respect users who request reduced motion at the OS level.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Skip Lenis on mobile (≤768px). Native scroll is smoother + cheaper there:
    // it benefits from momentum, GPU compositing, and battery-friendly idle.
    if (window.matchMedia('(max-width: 768px)').matches) return;

    let cleanup: (() => void) | undefined;

    // Defer Lenis init until the browser is idle. This keeps the main thread
    // clear during LCP and hydration — the smooth-scroll experience is a
    // post-load enhancement, not a critical-path feature. Falls back to a
    // 1s setTimeout for browsers without requestIdleCallback (Safari < 17).
    const startLenis = () => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tickerCallback);
        lenis.destroy();
        lenisRef.current = null;
      };
    };

    const idle =
      'requestIdleCallback' in window
        ? (window as typeof window & {
            requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
          }).requestIdleCallback(startLenis, { timeout: 2000 })
        : window.setTimeout(startLenis, 1000);

    return () => {
      if ('cancelIdleCallback' in window) {
        (window as typeof window & {
          cancelIdleCallback: (handle: number) => void;
        }).cancelIdleCallback(idle);
      } else {
        clearTimeout(idle);
      }
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
