'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { faqItems } from '@/lib/data';

/* ─────────────────────── Component ─────────────────────── */

export default function FAQPage() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  /* JSON-LD structured data */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <main>
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ──────── Hero ──────── */}
      <section className="relative flex h-[40vh] min-h-[320px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/ballena/Ballena 33.jpg" alt="Villa Ballena exterior at sunset" fill className="object-cover" priority quality={85} />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-midnight/30 to-midnight/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-4 font-accent text-lg italic text-gold/80 md:text-xl">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* ──────── Accordion ──────── */}
      <section className="section-padding bg-midnight">
        <div className="mx-auto max-w-3xl px-6">
          <div className="divide-y divide-white/5">
            {faqItems.map((item, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between py-6 text-left transition-colors duration-300"
                  aria-expanded={openIndex === index}
                >
                  <span
                    className={`pr-8 text-base font-medium transition-colors duration-300 md:text-lg ${
                      openIndex === index ? 'text-gold' : 'text-white/80 group-hover:text-white'
                    }`}
                  >
                    {item.q}
                  </span>

                  {/* Plus / Minus icon */}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      openIndex === index
                        ? 'border-gold/40 bg-gold/10 text-gold'
                        : 'border-white/10 text-white/40 group-hover:border-white/20'
                    }`}
                  >
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-45' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-sm leading-relaxed text-white/50 md:text-base">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="relative overflow-hidden bg-midnight-light py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,169,110,0.06)_0%,transparent_50%)]" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <p className="font-accent text-2xl italic text-gold md:text-3xl">
            Still have questions?
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Our team is happy to help with any questions about the villas, availability, or planning your Istrian experience.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-midnight transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
