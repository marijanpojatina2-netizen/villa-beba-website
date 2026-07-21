import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin · Villa Ballena & Beluga',
  robots: { index: false, follow: false },
};

// /admin lives outside [locale], so the locale layout's <html> never wraps it —
// this layout must render the document shell itself (root layout is a passthrough).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <div className="mx-auto max-w-4xl px-6 py-10">{children}</div>
      </body>
    </html>
  );
}
