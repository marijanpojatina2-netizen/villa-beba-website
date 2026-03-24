'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Slide {
  image: string;
  alt: string;
  title: string;
  description: string;
  href: string;
}

interface HorizontalGalleryProps {
  slides: Slide[];
  className?: string;
}

export default function HorizontalGallery({
  slides,
  className = '',
}: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const slideCount = slides.length;
    const slideWidth = window.innerWidth * 0.7;
    const gap = 24;
    const totalWidth = slideCount * (slideWidth + gap) - gap;
    const scrollDistance = totalWidth - window.innerWidth + slideWidth * 0.15;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.min(
              slideCount - 1,
              Math.floor(progress * slideCount)
            );
            setActiveIndex(newIndex);
          },
        },
      });

      tl.to(track, {
        x: -scrollDistance,
        ease: 'none',
      });

      // Scale effect for slides
      const slideEls = track.querySelectorAll<HTMLDivElement>('.gallery-slide');
      slideEls.forEach((slide, i) => {
        const center = (i + 0.5) / slideCount;
        tl.fromTo(
          slide,
          { scale: 0.92 },
          {
            scale: 1,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          center - 0.15
        );
        tl.to(
          slide,
          {
            scale: 0.92,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          center + 0.05
        );
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [slides]);

  return (
    <section ref={sectionRef} className={`relative h-screen overflow-hidden ${className}`}>
      {/* Pagination dots */}
      <div className="absolute top-8 right-8 z-10 flex gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`block w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'bg-white scale-125'
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-8 left-8 z-10 font-serif text-sm text-white/60">
        <span className="text-white">{String(activeIndex + 1).padStart(2, '0')}</span>
        {' / '}
        {String(slides.length).padStart(2, '0')}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex items-center h-full gap-6 pl-[15vw]"
        style={{ willChange: 'transform' }}
      >
        {slides.map((slide, i) => (
          <a
            key={`${slide.href}-${i}`}
            href={slide.href}
            className="gallery-slide flex-shrink-0 relative group"
            style={{
              width: '70vw',
              height: '75vh',
              willChange: 'transform',
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="70vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={i === 0}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Slide content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <h3
                  className="font-serif text-white leading-[1.1] mb-3"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 3rem)' }}
                >
                  {slide.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base max-w-md leading-relaxed">
                  {slide.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
