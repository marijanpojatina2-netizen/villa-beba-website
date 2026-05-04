import { CONTACT, VILLAS } from '@/lib/contact';
import { getBreadcrumbSchema } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';

const baseUrl = 'https://www.ballenaandbeluga.com';
const LAST_UPDATED = '2026-05-04';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Datenschutz' : 'Privacy Policy';
  const description = isDE
    ? 'Wie Villa Ballena & Villa Beluga personenbezogene Daten von Gästen und Webseitenbesuchern verarbeitet — DSGVO-konform.'
    : 'How Villa Ballena & Villa Beluga handles personal data from guests and website visitors — GDPR-aligned.';
  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/privacy`,
      languages: {
        en: `${baseUrl}/en/privacy`,
        de: `${baseUrl}/de/privacy`,
        'x-default': `${baseUrl}/en/privacy`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([
    { name: isDE ? 'Startseite' : 'Home', url: `/${locale}` },
    { name: isDE ? 'Datenschutz' : 'Privacy Policy', url: `/${locale}/privacy` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="mx-auto max-w-3xl px-6 lg:px-10 pt-32 pb-24 text-text">
        <p className="font-heading text-[0.6875rem] uppercase tracking-[0.2em] text-text-dim">
          {isDE ? 'Rechtliches' : 'Legal'}
        </p>
        <h1 className="mt-4 font-display text-4xl lg:text-5xl">
          {isDE ? 'Datenschutzerklärung' : 'Privacy Policy'}
        </h1>
        <p className="mt-4 text-sm text-text-dim">
          {isDE ? 'Zuletzt aktualisiert: ' : 'Last updated: '}
          {LAST_UPDATED}
        </p>

        <div className="prose prose-neutral mt-12 space-y-8 text-[0.95rem] leading-relaxed">
          {isDE ? <PrivacyDE /> : <PrivacyEN />}

          <section>
            <h2 className="font-heading text-lg uppercase tracking-[0.12em]">
              {isDE ? 'Verantwortlich für die Verarbeitung' : 'Data controller'}
            </h2>
            <p className="mt-3">
              Villa Ballena &amp; Villa Beluga<br />
              {VILLAS.ballena.streetAddress} / {VILLAS.beluga.streetAddress}<br />
              {VILLAS.ballena.postalCode} {VILLAS.ballena.locality}, {VILLAS.ballena.region}, {isDE ? 'Kroatien' : 'Croatia'}<br />
              {isDE ? 'Telefon' : 'Phone'}: {CONTACT.phoneDisplay}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

function PrivacyEN() {
  return (
    <>
      <p>
        Villa Ballena &amp; Villa Beluga (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operate the website at
        ballenaandbeluga.com and the two physical villa rentals in Svetvinčenat, Istria, Croatia. This
        policy explains what personal data we collect, why we collect it, and your rights under the EU
        General Data Protection Regulation (Regulation 2016/679, &ldquo;GDPR&rdquo;) and the Croatian
        Personal Data Protection Act.
      </p>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">1. What we collect</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Booking enquiries.</strong> When you submit our contact form we receive your name,
            email address, and the content of your message. We do not collect payment information on the
            website — bookings are confirmed by direct invoice or via the booking platform you used (Airbnb,
            myluxoria, etc.).
          </li>
          <li>
            <strong>On-stay guest data.</strong> Croatian law (Foreigners Act, Tourism Tax Act) requires
            us to register every overnight guest with the local police via the eVisitor system. We collect
            full name, date of birth, nationality, ID/passport number, and dates of stay. This data is
            transmitted only to the eVisitor authority and is deleted from our systems within 24 months.
          </li>
          <li>
            <strong>Anonymous traffic analytics.</strong> We use Vercel Analytics and Vercel Speed
            Insights, which collect anonymised page-view metrics without setting cookies and without
            persistent visitor identifiers.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">2. Why we use it</h2>
        <p className="mt-3">
          Booking enquiries: to reply to your message and prepare a booking offer
          (Art. 6(1)(b) GDPR — pre-contract steps). Guest registration: to comply with our legal
          obligation under Croatian tourism law (Art. 6(1)(c) GDPR). Analytics: to improve site
          performance under our legitimate interest in maintaining a fast website (Art. 6(1)(f) GDPR).
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">3. Who receives the data</h2>
        <p className="mt-3">
          Form submissions are delivered through Resend (a US email API provider with GDPR Standard
          Contractual Clauses). Guest registration data goes to the Croatian eVisitor system. Analytics
          run on Vercel infrastructure (EU regions). We do not sell or rent personal data to anyone.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">4. How long we keep it</h2>
        <p className="mt-3">
          Booking enquiries: up to 12 months after the last interaction, or until you ask us to delete
          them. Guest registration: 24 months (statutory). Analytics: aggregated indefinitely, with no
          link to an identifiable visitor.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">5. Your rights</h2>
        <p className="mt-3">
          You can ask us at any time to access, correct, delete, restrict, or port your personal data,
          and to object to processing based on legitimate interest. Email us at the address below. You
          also have the right to lodge a complaint with the Croatian Personal Data Protection Agency
          (azop.hr).
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">6. Cookies</h2>
        <p className="mt-3">
          The site does not set tracking cookies. A single language preference is read from the URL path
          (/en, /de) — no cookie is written. Embedded Google Maps may set cookies on its own iframe; see
          Google&rsquo;s privacy policy for details.
        </p>
      </section>
    </>
  );
}

function PrivacyDE() {
  return (
    <>
      <p>
        Villa Ballena &amp; Villa Beluga (&bdquo;wir&ldquo;) betreiben die Webseite ballenaandbeluga.com
        und die beiden Villen in Svetvinčenat, Istrien, Kroatien. Diese Datenschutzerklärung beschreibt,
        welche personenbezogenen Daten wir erfassen, warum wir sie erfassen, und Ihre Rechte gemäß der
        EU-Datenschutz-Grundverordnung (Verordnung 2016/679, &bdquo;DSGVO&ldquo;) sowie dem kroatischen
        Datenschutzgesetz.
      </p>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">1. Welche Daten wir erfassen</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Buchungsanfragen.</strong> Wenn Sie unser Kontaktformular nutzen, erhalten wir Ihren
            Namen, Ihre E-Mail-Adresse und den Inhalt Ihrer Nachricht. Zahlungsdaten werden über die
            Webseite nicht erhoben — Buchungen werden per Direktrechnung oder über die genutzte
            Buchungsplattform (Airbnb, myluxoria u. a.) bestätigt.
          </li>
          <li>
            <strong>Gästedaten vor Ort.</strong> Das kroatische Recht (Ausländergesetz, Tourismussteuergesetz)
            verpflichtet uns, jeden Übernachtungsgast über das eVisitor-System bei der örtlichen Polizei
            anzumelden. Erfasst werden vollständiger Name, Geburtsdatum, Nationalität, Ausweis-/Passnummer
            und Aufenthaltsdaten. Diese Daten werden ausschließlich an eVisitor übertragen und nach
            24 Monaten aus unseren Systemen gelöscht.
          </li>
          <li>
            <strong>Anonyme Traffic-Statistiken.</strong> Wir nutzen Vercel Analytics und Vercel Speed
            Insights — anonymisierte Seitenaufruf-Metriken ohne Cookies und ohne dauerhafte Besucher-IDs.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">2. Wofür wir die Daten verwenden</h2>
        <p className="mt-3">
          Buchungsanfragen: zur Beantwortung Ihrer Nachricht und zur Erstellung eines Angebots
          (Art. 6 Abs. 1 lit. b DSGVO — vorvertragliche Maßnahmen). Gästeregistrierung: zur Erfüllung
          unserer gesetzlichen Verpflichtung nach kroatischem Tourismusrecht (Art. 6 Abs. 1 lit. c DSGVO).
          Statistik: berechtigtes Interesse an der Aufrechterhaltung einer schnellen Webseite
          (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">3. Empfänger der Daten</h2>
        <p className="mt-3">
          Formular-Einreichungen werden über Resend (US-E-Mail-API-Anbieter mit DSGVO-Standardvertragsklauseln)
          übermittelt. Gästedaten gehen an das kroatische eVisitor-System. Statistiken laufen auf
          Vercel-Infrastruktur (EU-Regionen). Wir verkaufen oder vermieten keine personenbezogenen Daten.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">4. Speicherdauer</h2>
        <p className="mt-3">
          Buchungsanfragen: bis zu 12 Monate nach dem letzten Kontakt oder bis zur Löschung auf Anfrage.
          Gästeregistrierung: 24 Monate (gesetzlich). Statistiken: aggregiert unbefristet, ohne Bezug zu
          einem identifizierbaren Besucher.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">5. Ihre Rechte</h2>
        <p className="mt-3">
          Sie können jederzeit Auskunft, Berichtigung, Löschung, Einschränkung oder Übertragung Ihrer
          Daten verlangen sowie der Verarbeitung auf Basis berechtigter Interessen widersprechen.
          Schreiben Sie uns dazu an die unten genannte Adresse. Sie haben außerdem das Recht, eine
          Beschwerde bei der kroatischen Datenschutzbehörde (azop.hr) einzureichen.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">6. Cookies</h2>
        <p className="mt-3">
          Die Webseite setzt keine Tracking-Cookies. Die Sprachauswahl wird über den URL-Pfad gelesen
          (/en, /de) — es wird kein Cookie geschrieben. Eingebettete Google Maps kann eigene Cookies in
          ihrem iframe setzen; Details siehe Datenschutzerklärung von Google.
        </p>
      </section>
    </>
  );
}
