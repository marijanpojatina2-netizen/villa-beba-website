'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FlyingImage {
  src: string;
  alt: string;
  startX: string;
  startY: string;
}

interface FlyingImagesProps {
  images: FlyingImage[];
  className?: string;
}

export default function FlyingImages({ images, className = '' }: FlyingImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const imageEls = container.querySelectorAll<HTMLDivElement>('.flying-image');

    const ctx = gsap.context(() => {
      imageEls.forEach((el, i) => {
        const img = images[i];
        if (!img) return;

        gsap.set(el, {
          x: img.startX,
          y: img.startY,
          opacity: 0,
          scale: 0.8,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });

      imageEls.forEach((el, i) => {
        tl.to(
          el,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
          },
          i * 0.1
        );
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [images]);

  return (
    <div ref={containerRef} className={`relative grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {images.map((img, i) => (
        <div
          key={`${img.src}-${i}`}
          className="flying-image overflow-hidden rounded-lg aspect-[3/4]"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
