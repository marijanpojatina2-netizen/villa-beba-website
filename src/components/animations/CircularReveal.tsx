'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CircularRevealProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

export default function CircularReveal({
  children,
  className,
  bgColor = '#FFFFFF',
}: CircularRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(el, { clipPath: 'circle(150% at 50% 50%)' });
      return;
    }

    gsap.fromTo(
      el,
      { clipPath: 'circle(0% at 50% 50%)' },
      {
        clipPath: 'circle(150% at 50% 50%)',
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: 'circle(0% at 50% 50%)',
        backgroundColor: bgColor,
      }}
    >
      {children}
    </div>
  );
}
