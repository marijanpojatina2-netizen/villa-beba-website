'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { FadeUp } from '@/components/animations/MotionWrappers';
import { faqItems } from '@/lib/data';

export default function FAQPage() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (index: number) => setOpenIndex(openIndex === index ? null : index);

  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="relative flex h-[40vh] min-h-[320px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/ballena/Ballena 33.jpg" alt="Villa Ballena exterior at sunset" fill className="object-cover" priority quality={85} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl">{t('title')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="mt-4 font-accent text-lg italic text-gold/90 md:text-xl">{t('subtitle')}</motion.p>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="mx-auto max-w-3xl px-6">
          <div className="divide-y divide-body-dark/5">
            {faqItems.map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }} className="group">
                <button onClick={() => toggle(index)} className="flex w-full items-center justify-between py-6 text-left transition-colors duration-300" aria-expanded={openIndex === index}>
                  <span className={`pr-8 text-base font-medium transition-colors duration-300 md:text-lg ${openIndex === index ? 'text-gold' : 'text-body-dark/70 group-hover:text-body-dark'}`}>{item.q}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${openIndex === index ? 'border-gold/40 bg-gold/10 text-gold' : 'border-body-dark/10 text-body-dark/30 group-hover:border-body-dark/20'}`}>
                    <svg className={`h-4 w-4 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                  <p className="text-sm leading-relaxed text-body-dark/50 md:text-base">{item.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,169,110,0.06)_0%,transparent_50%)]" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <ScrollReveal>
            <p className="font-accent text-2xl italic text-gold md:text-3xl">Still have questions?</p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">Our team is happy to help with any questions about the villas, availability, or planning your Istrian experience.</p>
          </ScrollReveal>
          <FadeUp delay={0.2}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="mt-8 inline-flex">
              <Link href="/contact" className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]">Contact Us</Link>
            </motion.div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
