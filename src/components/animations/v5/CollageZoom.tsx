'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CollageZoomProps {
  children: React.ReactNode;
}

export default function CollageZoom({ children }: CollageZoomProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const ctx = gsap.context(() => {
      gsap.to(inner, {
        scale: 0.5,
        borderRadius: '24px',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: wrapper,
          start: 'bottom bottom',
          end: '+=60%',
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Apply perspective and slight rotation proportional to progress
            const progress = self.progress;
            const rotateX = progress * 4;
            inner.style.perspective = '1200px';
            inner.style.transform = `scale(${1 - progress * 0.5}) rotateX(${rotateX}deg)`;
          },
        },
      });
    }, wrapper);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Background visible when content scales down */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)',
        }}
      />
      <div
        ref={innerRef}
        className="relative overflow-hidden bg-white"
        style={{
          transformOrigin: 'center top',
          willChange: 'transform, border-radius',
        }}
      >
        {children}
      </div>
    </div>
  );
}
