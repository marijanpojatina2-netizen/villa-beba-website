import { getTranslations } from 'next-intl/server';
import { isValidTokenFormat } from '@/lib/checkin/token';
import { getLinkByToken } from '@/lib/checkin/db';
import CheckinWizard from './CheckinWizard';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Guest check-in · Villa Ballena & Beluga',
    robots: { index: false, follow: false },
  };
}

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  const t = await getTranslations('checkin');

  const link = isValidTokenFormat(token) ? await getLinkByToken(token) : null;

  if (!link) {
    return (
      <main className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-medium">{t('invalidTitle')}</h1>
        <p className="mt-4 text-neutral-600">{t('invalidBody')}</p>
      </main>
    );
  }
  if (link.status !== 'pending') {
    return (
      <main className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-medium">{t('alreadyTitle')}</h1>
        <p className="mt-4 text-neutral-600">{t('alreadyBody')}</p>
      </main>
    );
  }
  return (
    <CheckinWizard
      locale={locale}
      token={token}
      villa={link.villa}
      arrivalDate={link.arrival_date}
      departureDate={link.departure_date}
      expectedGuests={link.expected_guests}
    />
  );
}
