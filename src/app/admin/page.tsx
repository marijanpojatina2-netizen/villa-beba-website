import Link from 'next/link';
import { requireAdmin } from '@/lib/checkin/admin-guard';
import { listLinks } from '@/lib/checkin/db';
import { createCheckinLink, adminLogout } from '@/app/actions/admin';

export const dynamic = 'force-dynamic';

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  submitted: 'bg-blue-100 text-blue-800',
  pushed: 'bg-green-100 text-green-800',
};

export default async function AdminPage() {
  await requireAdmin();
  const links = await listLinks();
  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Guest check-ins</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/evisitor-test" className="text-sm text-neutral-500 underline">
            eVisitor test
          </Link>
          <form action={adminLogout}>
            <button className="text-sm text-neutral-500 underline">Log out</button>
          </form>
        </div>
      </div>

      <section className="mt-8 rounded border border-neutral-200 bg-white p-4">
        <h2 className="font-medium">New check-in link</h2>
        <form action={createCheckinLink} className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            Villa
            <br />
            <select name="villa" className="mt-1 rounded border border-neutral-300 px-2 py-1.5">
              <option value="ballena">Villa Ballena</option>
              <option value="beluga">Villa Beluga</option>
              <option value="both">Both (Complex BeBa)</option>
            </select>
          </label>
          <label className="text-sm">
            Arrival
            <br />
            <input
              type="date"
              name="arrivalDate"
              required
              className="mt-1 rounded border border-neutral-300 px-2 py-1.5"
            />
          </label>
          <label className="text-sm">
            Departure
            <br />
            <input
              type="date"
              name="departureDate"
              required
              className="mt-1 rounded border border-neutral-300 px-2 py-1.5"
            />
          </label>
          <label className="text-sm">
            Guests
            <br />
            <input
              type="number"
              name="expectedGuests"
              min={1}
              max={20}
              defaultValue={2}
              className="mt-1 w-20 rounded border border-neutral-300 px-2 py-1.5"
            />
          </label>
          <label className="text-sm">
            Booking via
            <br />
            <select
              name="arrivalOrganization"
              className="mt-1 rounded border border-neutral-300 px-2 py-1.5"
            >
              <option value="osobno">Direct (osobno)</option>
              <option value="agencija">Agency (Booking/Airbnb/Vrbo)</option>
            </select>
          </label>
          <button className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
            Create link
          </button>
        </form>
      </section>

      <section className="mt-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-300 text-left text-neutral-500">
              <th className="py-2">Villa</th>
              <th>Stay</th>
              <th>Guests</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => (
              <tr key={l.id} className="border-b border-neutral-100">
                <td className="py-2 capitalize">{l.villa}</td>
                <td>
                  {l.arrival_date} → {l.departure_date}
                </td>
                <td>{l.expected_guests}</td>
                <td>
                  <span className={`rounded px-2 py-0.5 text-xs ${STATUS_STYLE[l.status]}`}>
                    {l.status}
                  </span>
                </td>
                <td>
                  <Link className="underline" href={`/admin/links/${l.id}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-neutral-400">
                  No links yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
