'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ValuesGrid() {
  const t = useTranslations('home');
  const sectionRef = useRef<HTMLElement>(null);
  const values = [
    { num: '1', title: t('value1Title'), desc: t('value1Desc') },
    { num: '2', title: t('value2Title'), desc: t('value2Desc') },
    { num: '3', title: t('value3Title'), desc: t('value3Desc') },
    { num: '4', title: t('value4Title'), desc: t('value4Desc') },
    { num: '5', title: t('value5Title'), desc: t('value5Desc') },
  ];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const items = sectionRef.current.querySelectorAll('.value-item');
      gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] flex items-center overflow-hidden">
      <Image src="/images/beluga/beluga-25.jpg" alt="Villa Beluga glass terrace interior" fill className="object-cover" quality={80} />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10 py-20 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {values.slice(0, 2).map((v) => (
            <div key={v.num} className="value-item col-span-1 lg:col-span-3">
              <h3 className="display-md !text-white whitespace-pre-line !text-xl lg:!text-2xl">{v.title}</h3>
              <p className="mt-3 text-[0.8125rem] text-white/90 leading-relaxed">{v.desc}</p>
              <p className="mt-4 text-white/60 text-sm">({v.num})</p>
            </div>
          ))}
          <div className="value-item col-span-2 lg:col-span-5 lg:col-start-8 lg:row-span-2 flex flex-col justify-start">
            <p className="body-editorial !text-white/90 !max-w-none">{t('valuesBody1')}</p>
            <p className="mt-6 body-editorial !text-white/80 !max-w-none">{t('valuesBody2')}</p>
          </div>
          {values.slice(2).map((v) => (
            <div key={v.num} className="value-item col-span-1 lg:col-span-2">
              <h3 className="display-md !text-white whitespace-pre-line !text-lg lg:!text-xl">{v.title}</h3>
              <p className="mt-3 text-[0.75rem] text-white/90 leading-relaxed">{v.desc}</p>
              <p className="mt-4 text-white/60 text-sm">({v.num})</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
