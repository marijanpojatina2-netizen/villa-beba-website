'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Beliefs() {
  const t = useTranslations('home');
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (textRef.current) {
        const lines = textRef.current.querySelectorAll('.reveal-line');
        gsap.fromTo(lines, { y: '110%' }, { y: '0%', duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: textRef.current, start: 'top 80%' } });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex justify-end mb-12"><h2 className="label-section">(OUR BELIEFS)</h2></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image src="/images/beluga/img_4778.jpg" alt="Villa exterior with lush garden" fill className="object-cover" quality={85} sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div>
            <div ref={textRef}>
              <div className="overflow-hidden"><p className="reveal-line display-lg">{t('beliefsVision1')}</p></div>
              <div className="overflow-hidden"><p className="reveal-line display-lg font-display italic">{t('beliefsVision2')}</p></div>
            </div>
            <p className="mt-10 body-editorial">{t('beliefsText')}</p>
            <Link href="/contact" className="btn-editorial mt-10 w-fit">{t('beliefsButton')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
