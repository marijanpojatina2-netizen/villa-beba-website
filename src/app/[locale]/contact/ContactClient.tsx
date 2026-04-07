'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForm } from 'react-hook-form';
import { submitContactForm } from '@/app/actions/contact';

gsap.registerPlugin(ScrollTrigger);

interface ContactFormData {
  name: string; email: string; phone: string; checkIn: string; checkOut: string; villa: string; guests: string; message: string; howFound: string;
}

export default function ContactPage() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const titleRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  useEffect(() => { const ctx = gsap.context(() => { if (titleRef.current) { const lines = titleRef.current.querySelectorAll('.hero-line'); gsap.fromTo(lines, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 }); } }); return () => ctx.revert(); }, []);

  const onSubmit = async (data: ContactFormData) => {
    setStatus('sending');
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => { formData.append(key, value); });
      const result = await submitContactForm(formData);
      if (result.success) { setStatus('success'); reset(); } else { setStatus('error'); }
    } catch { setStatus('error'); }
  };

  const inputClasses = 'w-full rounded-sm border border-line bg-transparent px-4 py-3 text-sm text-text placeholder:text-text-dim transition-all duration-300 focus:border-text-muted focus:outline-none';
  const labelClasses = 'mb-2 block font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim';

  return (
    <main>
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image src="/images/ballena/ballena-36.jpg" alt="Villa Ballena terrace and pool at night" fill className="object-cover" priority quality={85} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
          <div ref={titleRef} className="max-w-[90vw]"><div className="overflow-hidden"><h1 className="hero-line display-hero text-white">CONTACT</h1></div></div>
          <div className="absolute right-6 bottom-12 lg:right-10 lg:bottom-16 max-w-[280px] text-right"><p className="font-accent text-sm italic leading-relaxed text-white/80 lg:text-base">{t('subtitle')}</p></div>
        </div>
      </section>

      <section className="section-editorial bg-bg"><div className="mx-auto max-w-[1400px] px-6 lg:px-10"><div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-3"><p className="label-section mb-12">(INQUIRY)</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2"><div><label htmlFor="name" className={labelClasses}>{t('name')} *</label><input id="name" type="text" className={inputClasses} placeholder={t('placeholderName')} {...register('name', { required: true })} />{errors.name && <p className="mt-1 text-xs text-red-400">{t('required')}</p>}</div><div><label htmlFor="email" className={labelClasses}>{t('email')} *</label><input id="email" type="email" className={inputClasses} placeholder={t('placeholderEmail')} {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />{errors.email && <p className="mt-1 text-xs text-red-400">{t('validEmailRequired')}</p>}</div></div>
            <div><label htmlFor="phone" className={labelClasses}>{t('phone')}</label><input id="phone" type="tel" className={inputClasses} placeholder="+385 91 525 1565" {...register('phone')} /></div>
            <div className="grid gap-6 sm:grid-cols-2"><div><label htmlFor="checkIn" className={labelClasses}>{t('checkIn')}</label><input id="checkIn" type="date" className={inputClasses} {...register('checkIn')} /></div><div><label htmlFor="checkOut" className={labelClasses}>{t('checkOut')}</label><input id="checkOut" type="date" className={inputClasses} {...register('checkOut')} /></div></div>
            <div className="grid gap-6 sm:grid-cols-2"><div><label htmlFor="villa" className={labelClasses}>{t('villaPreference')}</label><select id="villa" className={inputClasses} {...register('villa')}><option value="">{t('selectVilla')}</option><option value="ballena">Villa Ballena</option><option value="beluga">Villa Beluga</option><option value="both">{t('bothVillas')}</option></select></div><div><label htmlFor="guests" className={labelClasses}>{t('guests')}</label><input id="guests" type="number" min="1" max="18" className={inputClasses} placeholder="4" {...register('guests')} /></div></div>
            <div><label htmlFor="message" className={labelClasses}>{t('message')}</label><textarea id="message" rows={5} className={inputClasses} placeholder={t('placeholderMessage')} {...register('message')} /></div>
            <div><label htmlFor="howFound" className={labelClasses}>{t('howFound')}</label><select id="howFound" className={inputClasses} {...register('howFound')}><option value="">{t('selectDefault')}</option><option value="google">{t('optionGoogle')}</option><option value="instagram">{t('optionInstagram')}</option><option value="airbnb">{t('optionAirbnb')}</option><option value="booking">{t('optionBooking')}</option><option value="friend">{t('optionFriend')}</option><option value="other">{t('optionOther')}</option></select></div>
            <button type="submit" disabled={status === 'sending'} className="btn-editorial disabled:opacity-50">{status === 'sending' ? t('sending') : t('send')}</button>
            {status === 'success' && (<div className="rounded-sm border border-green-500/20 bg-green-500/10 p-4"><p className="text-sm text-green-400">{t('success')}</p></div>)}
            {status === 'error' && (<div className="rounded-sm border border-red-500/20 bg-red-500/10 p-4"><p className="text-sm text-red-400">{t('error')}</p></div>)}
          </form>
        </div>
        <div className="lg:col-span-2"><p className="label-section mb-12">(DIRECT CONTACT)</p><div className="rounded-sm border border-line bg-bg-elevated p-8"><h2 className="font-heading text-sm font-medium uppercase tracking-[0.12em] text-text">{t('directContact')}</h2><div className="mt-8 space-y-6"><div><p className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('emailLabel')}</p><a href="mailto:info@villa-beba.com" className="mt-1 block text-sm text-text transition-colors hover:text-text-muted">info@villa-beba.com</a></div><div className="line-h" /><div><p className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('phoneLabel')}</p><a href="tel:+385915251565" className="mt-1 block text-sm text-text transition-colors hover:text-text-muted">+385 91 525 1565</a></div><div className="line-h" /><div><p className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('whatsappLabel')}</p><a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-text transition-colors hover:text-text-muted">+385 91 525 1565</a></div><div className="line-h" /><div><p className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-dim">{t('locationLabel')}</p><p className="mt-1 text-sm text-text-muted">{t('location')}</p></div></div><div className="my-8 line-h" /><div className="aspect-[4/3] overflow-hidden rounded-sm border border-line bg-bg-subtle"><div className="flex h-full items-center justify-center"><div className="text-center"><svg className="mx-auto h-12 w-12 text-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg><p className="mt-3 font-heading text-[0.6875rem] uppercase tracking-[0.15em] text-text-dim">{t('mapComingSoon')}</p></div></div></div></div></div>
      </div></div></section>
    </main>
  );
}
