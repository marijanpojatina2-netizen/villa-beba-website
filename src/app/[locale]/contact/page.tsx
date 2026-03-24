'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { submitContactForm } from '@/app/actions/contact';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { FadeUp } from '@/components/animations/MotionWrappers';

/* ─────────────────────── Types ─────────────────────── */

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  villa: string;
  guests: string;
  message: string;
  howFound: string;
}

/* ─────────────────────── Component ─────────────────────── */

export default function ContactPage() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setStatus('sending');
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const result = await submitContactForm(formData);
      if (result.success) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClasses =
    'w-full rounded-lg border border-body-dark/10 bg-white px-4 py-3 text-sm text-body-dark placeholder:text-body-dark/30 transition-all duration-300 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30';
  const labelClasses = 'mb-2 block text-xs font-medium uppercase tracking-wider text-body-dark/50';

  return (
    <main>
      {/* ──────── Hero ──────── */}
      <section className="relative flex h-[40vh] min-h-[320px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/ballena/Ballena 36.jpg" alt="Villa Ballena terrace and pool at night" fill className="object-cover" priority quality={85} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="heading-xl text-4xl text-white sm:text-5xl md:text-6xl">
            {t('title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="mt-4 font-accent text-lg italic text-gold/90 md:text-xl">
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* ──────── Two-Column Layout ──────── */}
      <section className="section-padding bg-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* ── Left: Form ── */}
            <FadeUp className="lg:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name & Email */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClasses}>{t('name')} *</label>
                    <input id="name" type="text" className={inputClasses} placeholder="John Smith" {...register('name', { required: true })} />
                    {errors.name && <p className="mt-1 text-xs text-red-500">Required</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClasses}>{t('email')} *</label>
                    <input id="email" type="email" className={inputClasses} placeholder="john@example.com" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
                    {errors.email && <p className="mt-1 text-xs text-red-500">Valid email required</p>}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={labelClasses}>{t('phone')}</label>
                  <input id="phone" type="tel" className={inputClasses} placeholder="+385 91 525 1565" {...register('phone')} />
                </div>

                {/* Check-in & Check-out */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="checkIn" className={labelClasses}>{t('checkIn')}</label>
                    <input id="checkIn" type="date" className={inputClasses} {...register('checkIn')} />
                  </div>
                  <div>
                    <label htmlFor="checkOut" className={labelClasses}>{t('checkOut')}</label>
                    <input id="checkOut" type="date" className={inputClasses} {...register('checkOut')} />
                  </div>
                </div>

                {/* Villa & Guests */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="villa" className={labelClasses}>{t('villaPreference')}</label>
                    <select id="villa" className={inputClasses} {...register('villa')}>
                      <option value="">{t('selectVilla')}</option>
                      <option value="ballena">Villa Ballena</option>
                      <option value="beluga">Villa Beluga</option>
                      <option value="both">{t('bothVillas')}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="guests" className={labelClasses}>{t('guests')}</label>
                    <input id="guests" type="number" min="1" max="18" className={inputClasses} placeholder="4" {...register('guests')} />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className={labelClasses}>{t('message')}</label>
                  <textarea id="message" rows={5} className={inputClasses} placeholder="Tell us about your trip..." {...register('message')} />
                </div>

                {/* How found */}
                <div>
                  <label htmlFor="howFound" className={labelClasses}>{t('howFound')}</label>
                  <select id="howFound" className={inputClasses} {...register('howFound')}>
                    <option value="">Select...</option>
                    <option value="google">Google</option>
                    <option value="instagram">Instagram</option>
                    <option value="airbnb">Airbnb</option>
                    <option value="booking">Booking.com</option>
                    <option value="friend">Friend / Recommendation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-full rounded-full bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] disabled:opacity-50 sm:w-auto"
                >
                  {status === 'sending' ? t('sending') : t('send')}
                </motion.button>

                {/* Status messages */}
                {status === 'success' && (
                  <div className="rounded-lg border border-green-500/20 bg-green-50 p-4">
                    <p className="text-sm text-green-600">{t('success')}</p>
                  </div>
                )}
                {status === 'error' && (
                  <div className="rounded-lg border border-red-500/20 bg-red-50 p-4">
                    <p className="text-sm text-red-600">{t('error')}</p>
                  </div>
                )}
              </form>
            </FadeUp>

            {/* ── Right: Contact Info ── */}
            <ScrollReveal delay={0.2} className="lg:col-span-2">
              <div className="rounded-2xl border border-body-dark/5 bg-white p-8 shadow-sm">
                <h2 className="heading-md text-lg text-body-dark">{t('directContact')}</h2>

                <div className="mt-8 space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
                      <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-body-dark/40">Email</p>
                      <a href="mailto:info@villa-beba.com" className="mt-1 block text-sm text-gold transition-colors hover:text-gold-light">info@villa-beba.com</a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
                      <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-body-dark/40">Phone</p>
                      <a href="tel:+385915251565" className="mt-1 block text-sm text-gold transition-colors hover:text-gold-light">+385 91 525 1565</a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
                      <svg className="h-5 w-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-body-dark/40">WhatsApp</p>
                      <a href="https://wa.me/385915251565" target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-gold transition-colors hover:text-gold-light">+385 91 525 1565</a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
                      <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-body-dark/40">Location</p>
                      <p className="mt-1 text-sm text-body-dark/70">{t('location')}</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-body-dark/10 to-transparent" />

                {/* Map placeholder */}
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-body-dark/5 bg-offwhite">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-body-dark/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <p className="mt-3 text-xs uppercase tracking-wider text-body-dark/30">Map Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
