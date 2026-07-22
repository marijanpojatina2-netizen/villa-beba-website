import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/checkin/admin-guard';
import { getLinkWithGuests } from '@/lib/checkin/db';
import { buildEvisitorPayload, guestsToCsv } from '@/lib/checkin/evisitor';
import { markLinkPushed } from '@/app/actions/admin';
import CopyButton from './CopyButton';

export const dynamic = 'force-dynamic';

export default async function LinkDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();
  const data = await getLinkWithGuests(numId);
  if (!data) notFound();
  const { link, guests } = data;
  const checkinUrl = `https://www.ballenaandbeluga.com/en/checkin/${link.token}`;
  const payloadJson = JSON.stringify(buildEvisitorPayload(link, guests), null, 2);

  return (
    <main>
      <Link href="/admin" className="text-sm text-neutral-500 underline">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-medium capitalize">
        {link.villa} · {link.arrival_date} → {link.departure_date}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Status: {link.status} · expected guests: {link.expected_guests}
      </p>

      <section className="mt-6 rounded border border-neutral-200 bg-white p-4">
        <h2 className="font-medium">Guest link</h2>
        <p className="mt-2 break-all font-mono text-sm">{checkinUrl}</p>
        <div className="mt-2 flex gap-2">
          <CopyButton label="Copy link" text={checkinUrl} />
          <a
            className="rounded border border-neutral-300 px-3 py-1.5 text-sm"
            href={`https://wa.me/?text=${encodeURIComponent(checkinUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share via WhatsApp
          </a>
        </div>
      </section>

      {guests.length > 0 ? (
        <>
          <section className="mt-6 rounded border border-neutral-200 bg-white p-4">
            <h2 className="font-medium">Guests ({guests.length})</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {guests.map((g, i) => (
                <div key={i} className="rounded border border-neutral-100 p-3 text-sm">
                  <p className="font-medium">
                    {g.lastName}, {g.firstName} ({g.gender})
                  </p>
                  <p>
                    Born {g.birthDate} · {g.birthCountry}
                    {g.birthCountry === 'HR' && g.birthPlace ? ` (${g.birthPlace})` : ''} ·
                    citizenship {g.citizenship}
                  </p>
                  <p>
                    {g.documentType} · {g.documentNumber}
                  </p>
                  <p>
                    Residence: {g.residenceCountry}
                    {g.residenceCountry === 'HR' && g.residenceCity ? ` (${g.residenceCity})` : ''}
                  </p>
                  <p>
                    Stay: {g.arrivalDate} → {g.departureDate}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded border border-neutral-200 bg-white p-4">
            <h2 className="font-medium">eVisitor payload</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Copy-paste while entering guests at{' '}
              <a
                className="underline"
                href="https://www.evisitor.hr"
                target="_blank"
                rel="noopener noreferrer"
              >
                evisitor.hr
              </a>
              . Becomes a one-click push once HTZ grants API access.
            </p>
            <pre className="mt-3 overflow-x-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100">
              {payloadJson}
            </pre>
            <div className="mt-2 flex gap-2">
              <CopyButton label="Copy JSON" text={payloadJson} />
              <CopyButton label="Copy CSV" text={guestsToCsv(guests)} />
            </div>
          </section>

          {link.status === 'submitted' && (
            <form action={markLinkPushed} className="mt-6">
              <input type="hidden" name="id" value={link.id} />
              <button className="rounded bg-green-700 px-4 py-2 text-sm text-white">
                Mark as entered in eVisitor
              </button>
            </form>
          )}
        </>
      ) : (
        <p className="mt-6 text-neutral-400">No guest data submitted yet.</p>
      )}
    </main>
  );
}
