'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { allGalleryImages } from '@/lib/images';

type GalleryCategory = 'all' | 'ballena' | 'beluga' | 'common' | 'exterior' | 'interior' | 'pool' | 'bedroom' | 'wellness';

export default function GalleryPage() {
  const t = useTranslations('gallery');
  const tCommon = useTranslations('common');
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters: { key: GalleryCategory; label: string }[] = [
    { key: 'all', label: t('all') },{ key: 'ballena', label: t('filterBallena') },{ key: 'beluga', label: t('filterBeluga') },{ key: 'pool', label: t('filterPool') },{ key: 'interior', label: t('filterInteriors') },{ key: 'exterior', label: t('filterExperiences') },{ key: 'bedroom', label: t('filterEvents') },
  ];

  const filtered = activeFilter === 'all' ? allGalleryImages : allGalleryImages.filter((item) => item.villa === activeFilter || item.category === activeFilter);
  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goNext = useCallback(() => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filtered.length : null)), [filtered.length]);
  const goPrev = useCallback(() => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : null)), [filtered.length]);

  return (
    <main>
      <section className="relative flex h-[40vh] min-h-[320px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/koridor/IMG_5216.jpg" alt="Corridor between villas with pool view" fill className="object-cover" priority quality={85} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl">{t('title')}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="mt-4 font-accent text-lg italic text-gold/90 md:text-xl">{t('subtitle')}</motion.p>
        </div>
      </section>

      <section className="sticky top-0 z-30 border-b border-body-dark/5 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {filters.map((filter) => (
              <button key={filter.key} onClick={() => setActiveFilter(filter.key)} className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${activeFilter === filter.key ? 'bg-gold text-white' : 'border border-body-dark/10 text-body-dark/50 hover:border-gold/40 hover:text-gold'}`}>{filter.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item, index) => (
              <motion.button key={`${item.src}-${index}`} onClick={() => openLightbox(index)} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (index % 4) * 0.05 }} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 hover:shadow-lg">
                <Image src={item.src} alt={item.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" quality={75} sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/80 to-transparent p-4"><p className="text-left text-xs font-medium uppercase tracking-wider text-body-dark/60">{item.alt}</p></div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"><span className="rounded-full border border-gold px-6 py-2 text-sm font-medium uppercase tracking-widest text-gold">View</span></div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95 backdrop-blur-md" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute right-6 top-6 z-60 text-white/60 transition-colors hover:text-gold" aria-label={tCommon('close')}><svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 z-60 -translate-y-1/2 rounded-full border border-white/10 bg-navy/60 p-3 text-white/60 transition-colors hover:border-gold/40 hover:text-gold md:left-8" aria-label={tCommon('previous')}><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
          <div className="relative mx-16 aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
            <Image src={filtered[lightboxIndex].src} alt={filtered[lightboxIndex].alt} fill className="object-cover" quality={90} sizes="(max-width: 1024px) 90vw, 80vw" priority />
          </div>
          <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 z-60 -translate-y-1/2 rounded-full border border-white/10 bg-navy/60 p-3 text-white/60 transition-colors hover:border-gold/40 hover:text-gold md:right-8" aria-label={tCommon('next')}><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm tracking-wider text-white/40">{lightboxIndex + 1} / {filtered.length}</div>
        </div>
      )}
    </main>
  );
}
