'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src?: string;
  alt?: string;
  className?: string;
  speed?: number;
}

export default function ParallaxImage({
  src,
  alt = '',
  className,
  speed = 0.3,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const distance = container.offsetHeight * speed;

    gsap.fromTo(
      inner,
      { y: -distance },
      {
        y: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <div
        ref={innerRef}
        style={{
          position: 'absolute',
          inset: `-${speed * 100}% 0`,
          width: '100%',
          height: `${100 + speed * 200}%`,
        }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            }}
          />
        )}
      </div>
    </div>
  );
}
