import Link from 'next/link';
import { requireAdmin } from '@/lib/checkin/admin-guard';
import { evisitorConfigured, testConnection } from '@/lib/checkin/evisitor-api';

export const dynamic = 'force-dynamic';

// Read-only diagnostics: logs in to the eVisitor Web API and lists the
// codelists (facilities, document types, …). Writes nothing to eVisitor.
export default async function EvisitorTestPage() {
  await requireAdmin();

  if (!evisitorConfigured()) {
    return (
      <main>
        <Link href="/admin" className="text-sm text-neutral-500 underline">← Back</Link>
        <h1 className="mt-2 text-2xl font-medium">eVisitor connection test</h1>
        <div className="mt-6 rounded border border-amber-300 bg-amber-50 p-4 text-sm">
          <p className="font-medium">Not configured yet.</p>
          <p className="mt-2">Add these environment variables in Vercel (Production):</p>
          <ul className="mt-2 list-disc pl-5 font-mono text-xs">
            <li>EVISITOR_USERNAME</li>
            <li>EVISITOR_PASSWORD</li>
          </ul>
          <p className="mt-2">
            Use your eVisitor login (or better, create a dedicated additional user in
            eVisitor for this integration), then redeploy and reload this page.
          </p>
        </div>
      </main>
    );
  }

  const result = await testConnection();

  return (
    <main>
      <Link href="/admin" className="text-sm text-neutral-500 underline">← Back</Link>
      <h1 className="mt-2 text-2xl font-medium">eVisitor connection test</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Read-only: logs in and fetches codelists. Nothing is written to eVisitor.
      </p>

      {!result.ok ? (
        <div className="mt-6 rounded border border-red-300 bg-red-50 p-4 text-sm">
          <p className="font-medium text-red-700">Login failed</p>
          <p className="mt-1 font-mono text-xs">{result.error}</p>
        </div>
      ) : (
        <>
          <p className="mt-4 rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800">
            ✓ Login OK — session established with the eVisitor Web API.
          </p>
          {Object.entries(result.lookups ?? {}).map(([name, data]) => (
            <section key={name} className="mt-6 rounded border border-neutral-200 bg-white p-4">
              <h2 className="font-medium">
                {name}{' '}
                {'count' in data && (
                  <span className="text-sm font-normal text-neutral-500">
                    ({data.count} rows{data.count > 10 ? ', first 10 shown' : ''})
                  </span>
                )}
              </h2>
              {'error' in data ? (
                <p className="mt-2 font-mono text-xs text-red-600">{data.error}</p>
              ) : (
                <pre className="mt-2 max-h-80 overflow-auto rounded bg-neutral-900 p-3 text-xs text-neutral-100">
                  {JSON.stringify(data.sample, null, 2)}
                </pre>
              )}
            </section>
          ))}
          <p className="mt-6 text-sm text-neutral-600">
            Next step: find your two facilities in the <strong>facilities</strong> list
            above and set their <code className="font-mono">Code</code> values as{' '}
            <code className="font-mono">EVISITOR_FACILITY_BALLENA</code> and{' '}
            <code className="font-mono">EVISITOR_FACILITY_BELUGA</code> env vars.
          </p>
        </>
      )}
    </main>
  );
}
