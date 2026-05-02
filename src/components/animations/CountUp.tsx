'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}

export default function CountUp({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setDisplay(end);
      return;
    }

    const counter = { value: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        gsap.to(counter, {
          value: end,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            setDisplay(Math.round(counter.value));
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [end, duration]);

  return (
    <span
      ref={ref}
      className={className}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    >
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
