'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageCompressorProps {
  children: React.ReactNode;
  className?: string;
}

export default function ImageCompressor({
  children,
  className = '',
}: ImageCompressorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      gsap.to(wrapper, {
        scale: 0.92,
        borderRadius: '20px',
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, wrapper);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transformOrigin: 'center center',
        willChange: 'transform, border-radius',
      }}
    >
      {children}
    </div>
  );
}
