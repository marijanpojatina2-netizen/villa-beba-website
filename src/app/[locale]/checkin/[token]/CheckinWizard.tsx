'use client';

import { useMemo, useRef, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { scanDocument, submitCheckin } from '@/app/actions/checkin';
import { COUNTRIES, validateGuest, type GuestInput } from '@/lib/checkin/validate';
import ScanCamera from './ScanCamera';

const VILLA_NAME: Record<string, string> = {
  ballena: 'Villa Ballena',
  beluga: 'Villa Beluga',
  both: 'Complex BeBa (Villa Ballena + Villa Beluga)',
};

// Guests' most common origin countries listed first in the selects.
const PRIORITY_COUNTRIES = ['DE', 'AT', 'CH', 'HR', 'SI', 'IT', 'GB', 'US', 'NL', 'FR'];

type Step = 'count' | number | 'review' | 'done';

function emptyGuest(arrivalDate: string, departureDate: string): GuestInput {
  return {
    firstName: '',
    lastName: '',
    gender: '' as GuestInput['gender'],
    citizenship: '',
    birthDate: '',
    birthCountry: '',
    birthPlace: '',
    documentType: '' as GuestInput['documentType'],
    documentNumber: '',
    residenceCountry: '',
    residenceCity: '',
    arrivalDate,
    departureDate,
  };
}

// Downscale client-side before upload (file-picker path): saves bandwidth +
// API cost, and converts anything the browser can decode to JPEG.
async function downscale(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b ?? file), 'image/jpeg', 0.9),
    );
  } catch {
    return file; // undecodable (e.g. HEIC) — let the server reject politely
  }
}

interface Props {
  locale: string;
  token: string;
  villa: string;
  arrivalDate: string;
  departureDate: string;
  expectedGuests: number;
}

export default function CheckinWizard({
  locale, token, villa, arrivalDate, departureDate, expectedGuests,
}: Props) {
  const t = useTranslations('checkin');
  const [step, setStep] = useState<Step>('count');
  const [count, setCount] = useState(Math.min(expectedGuests, 10));
  const [guests, setGuests] = useState<GuestInput[]>(() =>
    Array.from({ length: Math.min(expectedGuests, 10) }, () =>
      emptyGuest(arrivalDate, departureDate),
    ),
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [reviewFields, setReviewFields] = useState<Record<number, string[]>>({});
  const [scanMsg, setScanMsg] = useState<
    'ok' | 'review' | 'scanFailed' | 'scanLimit' | 'cameraDenied' | null
  >(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, startScan] = useTransition();
  const [submitting, startSubmit] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const countryOptions = useMemo(() => {
    const names = new Intl.DisplayNames([locale], { type: 'region' });
    const label = (c: string) => {
      try { return names.of(c) ?? c; } catch { return c; }
    };
    const rest = COUNTRIES.filter((c) => !PRIORITY_COUNTRIES.includes(c))
      .map((c) => ({ code: c, label: label(c) }))
      .sort((a, b) => a.label.localeCompare(b.label, locale));
    return [...PRIORITY_COUNTRIES.map((c) => ({ code: c, label: label(c) })), ...rest];
  }, [locale]);

  const gi = typeof step === 'number' ? step : 0;
  const guest = guests[gi];

  function setField<K extends keyof GuestInput>(index: number, key: K, value: GuestInput[K]) {
    setGuests((prev) =>
      prev.map((g, i) => {
        if (i !== index) return g;
        const next = { ...g, [key]: value };
        // eVisitor asks for these only when the respective country is Croatia.
        if (key === 'birthCountry' && value !== 'HR') next.birthPlace = '';
        if (key === 'residenceCountry' && value !== 'HR') next.residenceCity = '';
        return next;
      }),
    );
  }

  function applyCount(n: number) {
    setCount(n);
    setGuests((prev) => {
      const next = prev.slice(0, n);
      while (next.length < n) next.push(emptyGuest(arrivalDate, departureDate));
      return next;
    });
  }

  function runScan(blob: Blob) {
    setScanMsg(null);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(blob);
    });
    const fd = new FormData();
    fd.append('token', token);
    fd.append('image', blob, 'scan.jpg');
    startScan(async () => {
      const result = await scanDocument(fd);
      setPreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return null;
      });
      if (!result.success) {
        setScanMsg(result.error === 'scan_limit' ? 'scanLimit' : 'scanFailed');
        return;
      }
      // Prefill only fields the guest hasn't typed yet.
      setGuests((prev) =>
        prev.map((g, i) => {
          if (i !== gi) return g;
          const merged = { ...g };
          for (const [k, v] of Object.entries(result.fields ?? {})) {
            const key = k as keyof GuestInput;
            if (!merged[key] && typeof v === 'string') {
              (merged as Record<string, string>)[key] = v;
            }
          }
          return merged;
        }),
      );
      const review = result.reviewFields ?? [];
      setReviewFields((prev) => ({ ...prev, [gi]: review }));
      setScanMsg(review.length ? 'review' : 'ok');
      setErrors([]);
    });
  }

  async function handlePickedFile(file: File) {
    runScan(await downscale(file));
  }

  function nextFromGuest() {
    const errs = validateGuest(guest);
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setScanMsg(null);
    setStep(gi + 1 < count ? gi + 1 : 'review');
  }

  function handleSubmit() {
    setSubmitError(null);
    startSubmit(async () => {
      const result = await submitCheckin(token, guests);
      if (result.success) {
        setStep('done');
        return;
      }
      if (result.error === 'already_submitted') {
        setSubmitError(t('alreadyBody'));
      } else if (result.error === 'validation' && result.invalidGuests?.length) {
        const first = result.invalidGuests[0];
        setStep(first.index);
        setErrors(first.fields);
        setSubmitError(t('fixErrors'));
      } else {
        setSubmitError(t('errorGeneric'));
      }
    });
  }

  const inputClass = (field: string) =>
    `mt-1 w-full rounded border px-3 py-2 text-[15px] ${
      errors.includes(field)
        ? 'border-red-500 bg-red-50'
        : (reviewFields[gi] ?? []).includes(field) && typeof step === 'number'
          ? 'border-amber-500 bg-amber-50'
          : 'border-neutral-300 bg-white'
    }`;

  const countrySelect = (field: 'citizenship' | 'birthCountry' | 'residenceCountry') => (
    <select
      value={guest[field]}
      onChange={(e) => setField(gi, field, e.target.value)}
      className={inputClass(field)}
    >
      <option value="" disabled>—</option>
      {countryOptions.map((c) => (
        <option key={c.code} value={c.code}>{c.label}</option>
      ))}
    </select>
  );

  const stay = `${arrivalDate} → ${departureDate}`;

  if (step === 'done') {
    return (
      <main className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-medium">{t('doneTitle')}</h1>
        <p className="mt-4 text-neutral-600">{t('doneBody')}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <style>{`
        @keyframes checkin-preview-scan {
          0% { top: 2%; }
          50% { top: 96%; }
          100% { top: 2%; }
        }
      `}</style>

      {cameraOpen && (
        <ScanCamera
          onCapture={(blob) => {
            setCameraOpen(false);
            runScan(blob);
          }}
          onUnavailable={() => {
            setCameraOpen(false);
            setScanMsg('cameraDenied');
            fileRef.current?.click();
          }}
          onClose={() => setCameraOpen(false)}
        />
      )}

      <h1 className="text-2xl font-medium">{t('title')}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {VILLA_NAME[villa] ?? villa} · {stay}
      </p>

      {step === 'count' && (
        <section className="mt-8">
          <p className="text-[15px] leading-relaxed text-neutral-700">{t('intro')}</p>
          <label className="mt-8 block text-sm font-medium">
            {t('guests')}
            <select
              value={count}
              onChange={(e) => applyCount(Number(e.target.value))}
              className="mt-1 w-full rounded border border-neutral-300 bg-white px-3 py-2"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="mt-8 w-full rounded bg-neutral-900 px-4 py-3 text-white"
          >
            {t('next')}
          </button>
        </section>
      )}

      {typeof step === 'number' && (
        <section className="mt-8">
          <p className="text-sm font-medium text-neutral-500">
            {t('guestOf', { n: gi + 1, total: count })}
          </p>

          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handlePickedFile(f);
                e.target.value = '';
              }}
            />

            {scanning && previewUrl ? (
              <div className="relative overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="" className="w-full opacity-80" />
                <div
                  className="absolute left-1 right-1 h-0.5 rounded bg-emerald-400"
                  style={{
                    animation: 'checkin-preview-scan 2s ease-in-out infinite',
                    boxShadow: '0 0 12px 2px rgba(52, 211, 153, 0.8)',
                  }}
                />
                <p className="absolute bottom-2 left-0 right-0 text-center text-sm font-medium text-white drop-shadow">
                  {t('scanning')}
                </p>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  disabled={scanning}
                  onClick={() => setCameraOpen(true)}
                  className="w-full rounded bg-neutral-900 px-4 py-3 text-white disabled:opacity-60"
                >
                  {scanning ? t('scanning') : `📷 ${t('scanCta')}`}
                </button>
                <button
                  type="button"
                  disabled={scanning}
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 w-full text-center text-sm text-neutral-500 underline"
                >
                  {t('uploadInstead')}
                </button>
              </>
            )}

            <p className="mt-2 text-xs leading-relaxed text-neutral-500">{t('scanHint')}</p>
            {scanMsg === 'ok' && <p className="mt-2 text-sm text-green-700">{t('scanOk')}</p>}
            {scanMsg === 'review' && (
              <p className="mt-2 text-sm text-amber-700">{t('scanReview')}</p>
            )}
            {scanMsg === 'scanFailed' && (
              <p className="mt-2 text-sm text-red-600">{t('scanFailed')}</p>
            )}
            {scanMsg === 'scanLimit' && (
              <p className="mt-2 text-sm text-red-600">{t('scanLimit')}</p>
            )}
            {scanMsg === 'cameraDenied' && (
              <p className="mt-2 text-sm text-amber-700">{t('cameraDenied')}</p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              {t('firstName')}
              <input
                type="text"
                value={guest.firstName}
                onChange={(e) => setField(gi, 'firstName', e.target.value)}
                className={inputClass('firstName')}
              />
            </label>
            <label className="text-sm font-medium">
              {t('lastName')}
              <input
                type="text"
                value={guest.lastName}
                onChange={(e) => setField(gi, 'lastName', e.target.value)}
                className={inputClass('lastName')}
              />
            </label>
            <label className="text-sm font-medium">
              {t('gender')}
              <select
                value={guest.gender}
                onChange={(e) => setField(gi, 'gender', e.target.value as GuestInput['gender'])}
                className={inputClass('gender')}
              >
                <option value="" disabled>—</option>
                <option value="F">{t('genderF')}</option>
                <option value="M">{t('genderM')}</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              {t('birthDate')}
              <input
                type="date"
                value={guest.birthDate}
                onChange={(e) => setField(gi, 'birthDate', e.target.value)}
                className={inputClass('birthDate')}
              />
            </label>
            <label className="text-sm font-medium">
              {t('citizenship')}
              {countrySelect('citizenship')}
            </label>
            <label className="text-sm font-medium">
              {t('birthCountry')}
              {countrySelect('birthCountry')}
            </label>
            {guest.birthCountry === 'HR' && (
              <label className="text-sm font-medium">
                {t('birthPlace')}
                <input
                  type="text"
                  value={guest.birthPlace}
                  onChange={(e) => setField(gi, 'birthPlace', e.target.value)}
                  className={inputClass('birthPlace')}
                />
              </label>
            )}
            <label className="text-sm font-medium">
              {t('documentType')}
              <select
                value={guest.documentType}
                onChange={(e) =>
                  setField(gi, 'documentType', e.target.value as GuestInput['documentType'])
                }
                className={inputClass('documentType')}
              >
                <option value="" disabled>—</option>
                <option value="id_card">{t('docIdCard')}</option>
                <option value="passport">{t('docPassport')}</option>
                <option value="other">{t('docOther')}</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              {t('documentNumber')}
              <input
                type="text"
                value={guest.documentNumber}
                onChange={(e) => setField(gi, 'documentNumber', e.target.value)}
                className={inputClass('documentNumber')}
              />
            </label>
            <label className="text-sm font-medium">
              {t('residenceCountry')}
              {countrySelect('residenceCountry')}
            </label>
            {guest.residenceCountry === 'HR' && (
              <label className="text-sm font-medium">
                {t('residenceCity')}
                <input
                  type="text"
                  value={guest.residenceCity}
                  onChange={(e) => setField(gi, 'residenceCity', e.target.value)}
                  className={inputClass('residenceCity')}
                />
              </label>
            )}
            <label className="text-sm font-medium">
              {t('arrivalDate')}
              <input
                type="date"
                value={guest.arrivalDate}
                onChange={(e) => setField(gi, 'arrivalDate', e.target.value)}
                className={inputClass('arrivalDate')}
              />
            </label>
            <label className="text-sm font-medium">
              {t('departureDate')}
              <input
                type="date"
                value={guest.departureDate}
                onChange={(e) => setField(gi, 'departureDate', e.target.value)}
                className={inputClass('departureDate')}
              />
            </label>
          </div>

          {errors.length > 0 && <p className="mt-4 text-sm text-red-600">{t('fixErrors')}</p>}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setErrors([]);
                setScanMsg(null);
                setStep(gi === 0 ? 'count' : gi - 1);
              }}
              className="rounded border border-neutral-300 px-4 py-3"
            >
              {t('back')}
            </button>
            <button
              type="button"
              onClick={nextFromGuest}
              className="flex-1 rounded bg-neutral-900 px-4 py-3 text-white"
            >
              {gi + 1 < count ? t('next') : t('review')}
            </button>
          </div>
        </section>
      )}

      {step === 'review' && (
        <section className="mt-8">
          <h2 className="text-lg font-medium">{t('reviewTitle')}</h2>
          <div className="mt-4 space-y-4">
            {guests.map((g, i) => (
              <div key={i} className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {t('guestN', { n: i + 1 })}: {g.firstName} {g.lastName}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    className="text-neutral-500 underline"
                  >
                    {t('edit')}
                  </button>
                </div>
                <p className="mt-1 text-neutral-600">
                  {t('birthDate')}: {g.birthDate} · {t('birthCountry')}: {g.birthCountry}
                  {g.birthCountry === 'HR' && g.birthPlace ? ` (${g.birthPlace})` : ''} ·{' '}
                  {t('citizenship')}: {g.citizenship}
                </p>
                <p className="text-neutral-600">
                  {g.documentType === 'id_card'
                    ? t('docIdCard')
                    : g.documentType === 'passport'
                      ? t('docPassport')
                      : t('docOther')}{' '}
                  · {g.documentNumber}
                </p>
                <p className="text-neutral-600">
                  {t('residenceCountry')}: {g.residenceCountry}
                  {g.residenceCountry === 'HR' && g.residenceCity ? ` (${g.residenceCity})` : ''}
                </p>
                <p className="text-neutral-600">
                  {g.arrivalDate} → {g.departureDate}
                </p>
              </div>
            ))}
          </div>

          {submitError && <p className="mt-4 text-sm text-red-600">{submitError}</p>}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(count - 1)}
              className="rounded border border-neutral-300 px-4 py-3"
            >
              {t('back')}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex-1 rounded bg-neutral-900 px-4 py-3 text-white disabled:opacity-60"
            >
              {submitting ? t('submitting') : t('submit')}
            </button>
          </div>
        </section>
      )}

      <p className="mt-12 text-center text-xs text-neutral-400">
        <a href={`/${locale}/privacy`} className="underline">{t('privacy')}</a>
      </p>
    </main>
  );
}
