'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { allGalleryImages } from '@/lib/images';

gsap.registerPlugin(ScrollTrigger);

type GalleryCategory = 'all' | 'ballena' | 'beluga' | 'common' | 'exterior' | 'interior' | 'pool' | 'bedroom' | 'wellness';

export default function GalleryPage() {
  const t = useTranslations('gallery');
  const tCommon = useTranslations('common');
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<GalleryCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters: { key: GalleryCategory; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: 'ballena', label: t('filterBallena') },
    { key: 'beluga', label: t('filterBeluga') },
    { key: 'pool', label: t('filterPool') },
    { key: 'interior', label: t('filterInteriors') },
    { key: 'exterior', label: t('filterExperiences') },
    { key: 'bedroom', label: t('filterEvents') },
  ];

  const filtered = activeFilter === 'all'
    ? allGalleryImages
    : allGalleryImages.filter((item) => item.villa === activeFilter || item.category === activeFilter);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goNext = useCallback(() => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filtered.length : null)), [filtered.length]);
  const goPrev = useCallback(() => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : null)), [filtered.length]);

  useEffect(() => { const ctx = gsap.context(() => { if (titleRef.current) { const lines = titleRef.current.querySelectorAll('.hero-line'); gsap.fromTo(lines, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 }); } }); return () => ctx.revert(); }, []);
  useEffect(() => { if (!gridRef.current) return; const ctx = gsap.context(() => { const items = gridRef.current!.querySelectorAll('.gallery-thumb'); gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.03, ease: 'power2.out' }); }); return () => ctx.revert(); }, [activeFilter]);

  return (
    <main>
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image src="/images/beluga/img_4910.jpg" alt="Villa Beluga interior" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
          <div ref={titleRef} className="max-w-[90vw]"><div className="overflow-hidden"><h1 className="hero-line display-hero text-white">GALLERY</h1></div></div>
          <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right"><p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">{t('subtitle')}</p></div>
        </div>
      </section>

      <section className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur-md"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">{filters.map((filter) => (<button key={filter.key} onClick={() => setActiveFilter(filter.key)} className={`btn-editorial shrink-0 !text-[0.625rem] !px-5 !py-2 ${activeFilter === filter.key ? '!bg-text !text-bg !border-text' : ''}`}>{filter.label}</button>))}</div></div></section>

      <section className="section-editorial bg-bg"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><div ref={gridRef} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{filtered.map((item, index) => (<button key={`${item.src}-${index}`} onClick={() => openLightbox(index)} className="gallery-thumb group relative aspect-[4/3] overflow-hidden rounded-sm border border-line transition-all duration-500 hover:border-line-strong"><Image src={item.src} alt={item.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" quality={75} sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/80 to-transparent p-4"><p className="text-left text-xs font-medium uppercase tracking-wider text-text-muted">{'villa' in item ? (item as { villa: string }).villa === 'ballena' ? 'Ballena' : (item as { villa: string }).villa === 'beluga' ? 'Beluga' : 'Complex' : ''}</p></div><div className="absolute inset-0 flex items-center justify-center bg-bg/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"><span className="btn-editorial !text-[0.6rem]">View</span></div></button>))}</div></div></section>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-md" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute right-6 top-6 z-60 text-text-muted transition-colors hover:text-text" aria-label={tCommon('close')}><svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 z-60 -translate-y-1/2 rounded-full border border-line bg-bg/60 p-3 text-text-muted transition-colors hover:border-line-strong hover:text-text md:left-8" aria-label={tCommon('previous')}><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
          <div className="relative mx-16 aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-sm border border-line" onClick={(e) => e.stopPropagation()}><Image src={filtered[lightboxIndex].src} alt={filtered[lightboxIndex].alt} fill className="object-cover" quality={90} sizes="(max-width: 1024px) 90vw, 80vw" priority /></div>
          <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 z-60 -translate-y-1/2 rounded-full border border-line bg-bg/60 p-3 text-text-muted transition-colors hover:border-line-strong hover:text-text md:right-8" aria-label={tCommon('next')}><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm tracking-wider text-text-dim">{lightboxIndex + 1} / {filtered.length}</div>
        </div>
      )}
    </main>
  );
}
