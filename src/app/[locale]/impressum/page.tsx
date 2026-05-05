import { CONTACT, IMPRESSUM } from '@/lib/contact';
import { getBreadcrumbSchema } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';

const baseUrl = 'https://www.ballenaandbeluga.com';
const LAST_UPDATED = '2026-05-05';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Impressum' : 'Legal Notice';
  const description = isDE
    ? `Impressum gemäß § 5 TMG / Art. 21 kroatisches Handelsgesetz für ${IMPRESSUM.legalName} — Betreiber von Villa Ballena & Villa Beluga.`
    : `Legal notice and company details for ${IMPRESSUM.legalName} — operator of Villa Ballena & Villa Beluga.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/impressum`,
      languages: {
        en: `${baseUrl}/en/impressum`,
        de: `${baseUrl}/de/impressum`,
        'x-default': `${baseUrl}/de/impressum`,
      },
    },
    // Impressum must be findable, but it's a legal page with no SEO value —
    // index it (mandatory under TMG: must be reachable from every page) but
    // don't burn link equity sending crawlers deeper from it.
    robots: { index: true, follow: false },
  };
}

// Render a TODO placeholder so the page never silently omits a required
// disclosure field. The placeholder itself signals "data missing — must be
// filled in lib/contact.ts" rather than letting an empty string look intentional.
function field(value: string, fallback: string) {
  return value.trim() === '' ? `[TBD — ${fallback}]` : value;
}

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';

  const breadcrumb = getBreadcrumbSchema([
    { name: isDE ? 'Startseite' : 'Home', url: `/${locale}` },
    { name: isDE ? 'Impressum' : 'Legal Notice', url: `/${locale}/impressum` },
  ]);

  const labels = isDE
    ? {
        eyebrow: 'Rechtliches',
        h1: 'Impressum',
        updated: 'Zuletzt aktualisiert: ',
        intro:
          'Angaben gemäß § 5 Telemediengesetz (TMG) und Art. 21 des kroatischen Gesetzes über Handelsgesellschaften (Zakon o trgovačkim društvima).',
        companyH: 'Anbieter',
        registerH: 'Registereintrag',
        register: 'Eingetragen im Gerichtsregister beim',
        registerNum: 'Matični broj (MB)',
        oib: 'Steuernummer (OIB)',
        capital: 'Stammkapital',
        directorH: 'Geschäftsführer / Vertretungsberechtigte Person',
        contactH: 'Kontakt',
        phone: 'Telefon',
        email: 'E-Mail',
        propertyH: 'Betriebsstätte / Vermietungsobjekte',
        propertyText:
          'Die Vermietung erfolgt an den Objekten Villa Ballena (Svetvinčenat 151) und Villa Beluga (Svetvinčenat 150), 52342 Svetvinčenat, Istrien, Kroatien.',
        disputeH: 'EU-Streitbeilegung',
        disputeText:
          'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:',
        disputeAfter:
          'Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        liabilityH: 'Haftung für Inhalte',
        liabilityText:
          'Die Inhalte dieser Webseite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.',
      }
    : {
        eyebrow: 'Legal',
        h1: 'Legal Notice',
        updated: 'Last updated: ',
        intro:
          'Disclosure required under Croatian Companies Act (Zakon o trgovačkim društvima, Art. 21) and German Telemedia Act (TMG § 5) for visitors from Germany, Austria, and Switzerland.',
        companyH: 'Operator',
        registerH: 'Company register',
        register: 'Registered with',
        registerNum: 'Company register number (MB)',
        oib: 'Tax ID (OIB)',
        capital: 'Share capital',
        directorH: 'Director / Authorised representative',
        contactH: 'Contact',
        phone: 'Phone',
        email: 'Email',
        propertyH: 'Rental properties',
        propertyText:
          'Rentals are operated at Villa Ballena (Svetvinčenat 151) and Villa Beluga (Svetvinčenat 150), 52342 Svetvinčenat, Istria, Croatia.',
        disputeH: 'EU dispute resolution',
        disputeText:
          'The European Commission provides an online dispute resolution (ODR) platform:',
        disputeAfter:
          'We are neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.',
        liabilityH: 'Liability for content',
        liabilityText:
          'The content of this website has been compiled with the greatest possible care. We cannot, however, warrant the accuracy, completeness, or currency of the content. As a service provider, we are responsible for our own content on these pages under general law (TMG § 7).',
      };

  const country = isDE ? IMPRESSUM.countryDE : IMPRESSUM.country;
  const court = isDE ? IMPRESSUM.registrationCourtDE : IMPRESSUM.registrationCourt;

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="mx-auto max-w-3xl px-6 lg:px-10 pt-32 pb-24 text-text">
        <p className="font-heading text-[0.6875rem] uppercase tracking-[0.2em] text-text-dim">
          {labels.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl lg:text-5xl">{labels.h1}</h1>
        <p className="mt-4 text-sm text-text-dim">
          {labels.updated}
          {LAST_UPDATED}
        </p>

        <div className="prose prose-neutral mt-12 space-y-8 text-[0.95rem] leading-relaxed">
          <p>{labels.intro}</p>

          <section>
            <h2 className="font-heading text-lg uppercase tracking-[0.12em]">{labels.companyH}</h2>
            <p className="mt-3">
              {IMPRESSUM.legalName}
              <br />
              {IMPRESSUM.street}
              <br />
              {IMPRESSUM.postalCode} {IMPRESSUM.city}, {country}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg uppercase tracking-[0.12em]">{labels.registerH}</h2>
            <p className="mt-3">
              {labels.register} {court}
              <br />
              {labels.registerNum}: {IMPRESSUM.mb}
              <br />
              {labels.oib}: {IMPRESSUM.oib}
              <br />
              {labels.capital}: {IMPRESSUM.shareCapital}
              {IMPRESSUM.vatId && (
                <>
                  <br />
                  USt-IdNr / VAT ID: {IMPRESSUM.vatId}
                </>
              )}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg uppercase tracking-[0.12em]">{labels.directorH}</h2>
            <p className="mt-3">{field(IMPRESSUM.director, isDE ? 'Geschäftsführer' : 'director name')}</p>
          </section>

          <section>
            <h2 className="font-heading text-lg uppercase tracking-[0.12em]">{labels.contactH}</h2>
            <p className="mt-3">
              {labels.phone}:{' '}
              <a className="underline hover:no-underline" href={`tel:${CONTACT.phoneE164}`}>
                {CONTACT.phoneDisplay}
              </a>
              <br />
              {labels.email}:{' '}
              <a className="underline hover:no-underline" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg uppercase tracking-[0.12em]">{labels.propertyH}</h2>
            <p className="mt-3">{labels.propertyText}</p>
          </section>

          <section>
            <h2 className="font-heading text-lg uppercase tracking-[0.12em]">{labels.disputeH}</h2>
            <p className="mt-3">
              {labels.disputeText}{' '}
              <a
                className="underline hover:no-underline"
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              .
              <br />
              {labels.disputeAfter}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg uppercase tracking-[0.12em]">{labels.liabilityH}</h2>
            <p className="mt-3">{labels.liabilityText}</p>
          </section>
        </div>
      </main>
    </>
  );
}
