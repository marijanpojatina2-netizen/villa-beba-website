import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/checkin/admin-guard';
import { getLinkWithGuests, getGuestRowsForPush } from '@/lib/checkin/db';
import { buildEvisitorPayload, guestsToCsv } from '@/lib/checkin/evisitor';
import { evisitorConfigured } from '@/lib/checkin/evisitor-api';
import { markLinkPushed, pushLinkToEvisitor, cancelGuestEvisitor } from '@/app/actions/admin';
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
  const { link } = data;
  const guestRows = await getGuestRowsForPush(numId);
  const guests = guestRows.map((r) => r.input);
  const checkinUrl = `https://www.ballenaandbeluga.com/en/checkin/${link.token}`;
  const payloadJson = JSON.stringify(buildEvisitorPayload(link, guests), null, 2);
  const apiReady = evisitorConfigured();
  const pendingPush = guestRows.some((r) => !r.evisitorId);

  return (
    <main>
      <Link href="/admin" className="text-sm text-neutral-500 underline">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-medium capitalize">
        {link.villa} · {link.arrival_date} → {link.departure_date}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Status: {link.status} · expected guests: {link.expected_guests} · booking:{' '}
        {link.arrival_organization === 'agencija' ? 'agency' : 'direct'}
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

      {guestRows.length > 0 ? (
        <>
          <section className="mt-6 rounded border border-neutral-200 bg-white p-4">
            <h2 className="font-medium">Guests ({guestRows.length})</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {guestRows.map((row) => {
                const g = row.input;
                return (
                  <div key={row.guestId} className="rounded border border-neutral-100 p-3 text-sm">
                    <p className="font-medium">
                      {g.lastName}, {g.firstName} ({g.gender})
                    </p>
                    <p>
                      Born {g.birthDate} · {g.birthPlace}, {g.birthCountry} ·
                      citizenship {g.citizenship}
                    </p>
                    <p>
                      {g.documentType} · {g.documentNumber}
                    </p>
                    <p>
                      Residence: {g.residenceCity}, {g.residenceCountry}
                    </p>
                    <p>
                      Stay: {g.arrivalDate} → {g.departureDate}
                    </p>
                    {row.evisitorId && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                          ✓ in eVisitor
                        </span>
                        <form action={cancelGuestEvisitor}>
                          <input type="hidden" name="guestId" value={row.guestId} />
                          <input type="hidden" name="linkId" value={link.id} />
                          <input type="hidden" name="evisitorId" value={row.evisitorId} />
                          <button className="text-xs text-red-600 underline">
                            Cancel in eVisitor
                          </button>
                        </form>
                      </div>
                    )}
                    {!row.evisitorId && row.pushError && (
                      <p className="mt-2 rounded bg-red-50 p-2 text-xs text-red-700">
                        {row.pushError}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {apiReady && pendingPush && (
            <form action={pushLinkToEvisitor} className="mt-6">
              <input type="hidden" name="id" value={link.id} />
              <button className="rounded bg-green-700 px-4 py-2 text-sm text-white">
                Push to eVisitor (API)
              </button>
              <span className="ml-3 text-xs text-neutral-500">
                Registers each guest via CheckInTourist; per-guest result shown above.
              </span>
            </form>
          )}

          <section className="mt-6 rounded border border-neutral-200 bg-white p-4">
            <h2 className="font-medium">eVisitor payload (manual fallback)</h2>
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
              .
            </p>
            <pre className="mt-3 overflow-x-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100">
              {payloadJson}
            </pre>
            <div className="mt-2 flex gap-2">
              <CopyButton label="Copy JSON" text={payloadJson} />
              <CopyButton label="Copy CSV" text={guestsToCsv(guests)} />
            </div>
          </section>

          {link.status === 'submitted' && !apiReady && (
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
