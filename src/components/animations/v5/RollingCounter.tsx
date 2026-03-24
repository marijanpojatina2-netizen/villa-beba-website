'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RollingCounterProps {
  end: number;
  suffix?: string;
  label?: string;
  className?: string;
}

export default function RollingCounter({
  end,
  suffix = '',
  label,
  className = '',
}: RollingCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const proxy = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        value: end,
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          end: 'bottom 30%',
          scrub: true,
        },
        onUpdate: () => {
          setDisplayValue(Math.round(proxy.value));
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [end]);

  const formatted = displayValue.toLocaleString();

  return (
    <div ref={containerRef} className={`inline-flex flex-col items-start ${className}`}>
      <div className="flex items-baseline overflow-hidden">
        <span
          className="font-serif tabular-nums"
          style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatted}
        </span>
        {suffix && (
          <span
            className="font-serif"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
              lineHeight: 1,
              marginLeft: '0.05em',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      {label && (
        <span
          className="mt-2 text-sm uppercase tracking-[0.2em] opacity-60"
          style={{ fontFamily: 'var(--font-sans, sans-serif)' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
