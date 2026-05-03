'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Amenities() {
  const t = useTranslations('home');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      const text = sectionRef.current.querySelector('.amenity-text');
      const imgs = sectionRef.current.querySelectorAll('.amenity-img');
      if (text) gsap.fromTo(text, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: text, start: 'top 85%' } });
      imgs.forEach((img, i) => { gsap.fromTo(img, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: i * 0.15, scrollTrigger: { trigger: img, start: 'top 85%' } }); });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-bg overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="amenity-text">
            <h2 className="display-lg"><span className="font-bold">{t('amenitiesTitle1')}</span><br /><span className="font-bold">{t('amenitiesTitle2')}</span><br /><span className="italic">{t('amenitiesTitle3')}</span></h2>
            <p className="mt-8 body-editorial">{t('amenitiesText')}</p>
            <Link href="/villa-ballena" className="btn-editorial mt-8 w-fit">{t('amenitiesLearnMore')}</Link>
          </div>
          <div className="relative h-[500px] lg:h-[600px]">
            <div className="amenity-img absolute top-0 right-0 w-[65%] h-[70%] overflow-hidden rounded-sm">
              <Image src="/images/ballena/img_5140.jpg" alt="Villa interior wellness area" fill className="object-cover" quality={80} sizes="40vw" />
            </div>
            <div className="amenity-img absolute bottom-0 left-0 w-[55%] h-[55%] overflow-hidden rounded-sm z-10 border border-line">
              <Image src="/images/ballena/img_5118.jpg" alt="Villa Ballena bedroom interior" fill className="object-cover" quality={80} sizes="35vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
