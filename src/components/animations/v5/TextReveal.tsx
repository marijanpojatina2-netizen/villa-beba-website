'use client';

import { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  stagger?: number;
  delay?: number;
  splitBy?: 'lines' | 'words';
}

export default function TextReveal({
  children,
  tag: Tag = 'h2',
  className = '',
  stagger = 0.08,
  delay = 0,
  splitBy = 'words',
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const fragments = useMemo(() => {
    if (splitBy === 'lines') {
      return children.split(/<br\s*\/?>|\n/).map((line) => line.trim()).filter(Boolean);
    }
    return children.split(/\s+/).filter(Boolean);
  }, [children, splitBy]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const innerSpans = container.querySelectorAll<HTMLSpanElement>('.reveal-inner');

    const ctx = gsap.context(() => {
      gsap.set(innerSpans, { y: '110%' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          once: true,
        },
        delay,
      });

      tl.to(innerSpans, {
        y: '0%',
        duration: 1,
        ease: 'power4.out',
        stagger,
      });

      triggerRef.current = ScrollTrigger.getAll().pop() ?? null;
    }, container);

    return () => {
      ctx.revert();
    };
  }, [fragments, stagger, delay]);

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className}>
      {fragments.map((fragment, i) => (
        <span
          key={`${fragment}-${i}`}
          className="reveal-mask"
          style={{
            overflow: 'hidden',
            display: 'inline-block',
            verticalAlign: 'top',
          }}
        >
          <span
            className="reveal-inner"
            style={{
              display: 'inline-block',
              willChange: 'transform',
            }}
          >
            {fragment}
          </span>
          {splitBy === 'words' && i < fragments.length - 1 && (
            <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}
