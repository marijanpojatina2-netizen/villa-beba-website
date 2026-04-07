'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { faqItems } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function FAQPage() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.hero-line');
        gsap.fromTo(lines, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 });
      }
      if (accordionRef.current) {
        const items = accordionRef.current.querySelectorAll('.faq-item');
        gsap.fromTo(items, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: accordionRef.current, start: 'top 75%' } });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ──────── Hero ──────── */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image src="/images/ballena/ballena-33.jpg" alt="Villa Ballena exterior at sunset" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
          <div ref={titleRef} className="max-w-[90vw]">
            <div className="overflow-hidden"><h1 className="hero-line display-hero text-white">FAQ</h1></div>
          </div>
          <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right">
            <p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* ──────── Accordion ──────── */}
      <section className="section-editorial bg-bg">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10">
          <p className="label-section mb-16">(QUESTIONS)</p>
          <div ref={accordionRef} className="divide-y divide-line">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item group">
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between py-8 text-left transition-colors duration-300"
                  aria-expanded={openIndex === index}
                >
                  <span className={`pr-8 font-display text-lg font-bold leading-snug transition-colors duration-300 md:text-xl ${openIndex === index ? 'text-text' : 'text-text-muted group-hover:text-text'}`}>
                    {item.q}
                  </span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${openIndex === index ? 'border-line-strong text-text' : 'border-line text-text-dim group-hover:border-line-strong'}`}>
                    <svg className={`h-4 w-4 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-96 pb-8' : 'max-h-0'}`}>
                  <p className="text-sm leading-relaxed text-text-muted md:text-base">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="bg-bg">
        <div className="line-h" />
        <div className="py-32 lg:py-48">
          <div className="mx-auto max-w-[900px] px-6 lg:px-10 text-center">
            <p className="display-md">Still have questions?</p>
            <p className="mt-4 body-editorial mx-auto">Our team is happy to help with any questions about the villas, availability, or planning your Istrian experience.</p>
            <Link href="/contact" className="btn-editorial mt-10">Contact Us</Link>
          </div>
        </div>
        <div className="line-h" />
      </section>
    </main>
  );
}
