'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface OverlappingImagesProps {
  frontSrc: string;
  backSrc: string;
  frontAlt: string;
  backAlt: string;
  className?: string;
}

export default function OverlappingImages({
  frontSrc,
  backSrc,
  frontAlt,
  backAlt,
  className = '',
}: OverlappingImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const front = frontRef.current;
    const back = backRef.current;
    if (!container || !front || !back) return;

    const ctx = gsap.context(() => {
      // Back image moves slower (negative parallax)
      gsap.to(back, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Front image moves faster (positive parallax)
      gsap.to(front, {
        y: -120,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ minHeight: '70vh' }}
    >
      {/* Back image: larger, offset right and up */}
      <div
        ref={backRef}
        className="relative w-[65%] md:w-[55%] ml-auto aspect-[4/5] overflow-hidden rounded-lg"
        style={{ willChange: 'transform' }}
      >
        <Image
          src={backSrc}
          alt={backAlt}
          fill
          sizes="(max-width: 768px) 65vw, 55vw"
          className="object-cover"
        />
      </div>

      {/* Front image: smaller, overlapping bottom-left */}
      <div
        ref={frontRef}
        className="absolute bottom-[5%] left-0 w-[50%] md:w-[40%] aspect-[3/4] overflow-hidden rounded-lg shadow-2xl z-10"
        style={{ willChange: 'transform' }}
      >
        <Image
          src={frontSrc}
          alt={frontAlt}
          fill
          sizes="(max-width: 768px) 50vw, 40vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
