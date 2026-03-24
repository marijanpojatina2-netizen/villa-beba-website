'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up';
}

export default function ImageReveal({
  children,
  className,
  direction = 'left',
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(overlay, { scaleX: 0, scaleY: 0 });
      return;
    }

    const isVertical = direction === 'up';
    const animProps: gsap.TweenVars = {};

    if (isVertical) {
      gsap.set(overlay, { transformOrigin: 'top center' });
      animProps.scaleY = 0;
    } else {
      const origin =
        direction === 'left' ? 'left center' : 'right center';
      gsap.set(overlay, { transformOrigin: origin });
      animProps.scaleX = 0;
    }

    gsap.to(overlay, {
      ...animProps,
      duration: 0.8,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [direction]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {children}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, #1a1a2e 0%, #c9a96e 100%)',
          zIndex: 10,
        }}
      />
    </div>
  );
}
