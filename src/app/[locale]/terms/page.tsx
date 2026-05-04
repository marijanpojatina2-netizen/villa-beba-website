import { CONTACT, VILLAS } from '@/lib/contact';
import { getBreadcrumbSchema } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';

const baseUrl = 'https://www.ballenaandbeluga.com';
const LAST_UPDATED = '2026-05-04';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const title = isDE ? 'Nutzungsbedingungen' : 'Terms of Service';
  const description = isDE
    ? 'Buchungs- und Nutzungsbedingungen für Villa Ballena & Villa Beluga in Svetvinčenat, Istrien.'
    : 'Booking and stay terms for Villa Ballena & Villa Beluga in Svetvinčenat, Istria, Croatia.';
  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/terms`,
      languages: {
        en: `${baseUrl}/en/terms`,
        de: `${baseUrl}/de/terms`,
        'x-default': `${baseUrl}/en/terms`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isDE = locale === 'de';
  const breadcrumb = getBreadcrumbSchema([
    { name: isDE ? 'Startseite' : 'Home', url: `/${locale}` },
    { name: isDE ? 'Nutzungsbedingungen' : 'Terms', url: `/${locale}/terms` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="mx-auto max-w-3xl px-6 lg:px-10 pt-32 pb-24 text-text">
        <p className="font-heading text-[0.6875rem] uppercase tracking-[0.2em] text-text-dim">
          {isDE ? 'Rechtliches' : 'Legal'}
        </p>
        <h1 className="mt-4 font-display text-4xl lg:text-5xl">
          {isDE ? 'Nutzungs- und Buchungsbedingungen' : 'Terms of Service & Booking'}
        </h1>
        <p className="mt-4 text-sm text-text-dim">
          {isDE ? 'Zuletzt aktualisiert: ' : 'Last updated: '}
          {LAST_UPDATED}
        </p>

        <div className="prose prose-neutral mt-12 space-y-8 text-[0.95rem] leading-relaxed">
          {isDE ? <TermsDE /> : <TermsEN />}

          <section>
            <h2 className="font-heading text-lg uppercase tracking-[0.12em]">
              {isDE ? 'Vermieter / Kontakt' : 'Operator / contact'}
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

function TermsEN() {
  return (
    <>
      <p>
        These terms govern direct bookings of Villa Ballena and/or Villa Beluga made through
        ballenaandbeluga.com or by direct contact with the operator. Bookings made through third-party
        platforms (Airbnb, myluxoria, crovillas, etc.) are governed by that platform&rsquo;s terms in
        addition to the house rules below.
      </p>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">1. Booking confirmation</h2>
        <p className="mt-3">
          A booking is confirmed only after we acknowledge the dates by email and the agreed deposit is
          received. We reserve the right to decline any enquiry without giving a reason. Direct bookings
          are quoted in EUR; the rate sheet on the Pricing page reflects the standard nightly price by
          season — bespoke quotes apply for weddings, retreats, and the combined Complex BeBa booking.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">2. Payment &amp; deposit</h2>
        <p className="mt-3">
          A 30 % deposit is due within 7 days of the booking confirmation email. The remaining 70 % is
          due 30 days before arrival. A refundable damage deposit of €1,500 per villa is held against
          breakages — refunded within 7 days of departure after a final inspection. We accept SEPA bank
          transfer; card payments via direct invoice on request.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">3. Cancellation</h2>
        <p className="mt-3">
          More than 60 days before arrival: full refund less a €100 administrative fee. 30–60 days
          before arrival: deposit is forfeit, balance refunded. Less than 30 days before arrival: no
          refund, but we will help you re-sell the dates. We strongly recommend travel insurance.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">4. Check-in &amp; check-out</h2>
        <p className="mt-3">
          Check-in from 16:00, check-out by 10:00. Early check-in and late check-out are subject to
          availability and may incur a €100 fee per villa. We are required by Croatian law to register
          every overnight guest with the police (eVisitor) — please bring valid ID or passport for every
          person in your party at arrival.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">5. Capacity &amp; events</h2>
        <p className="mt-3">
          Maximum 8 + 1 guests per villa, 18 across both. Day visitors are not permitted without prior
          written agreement. Weddings, parties, and corporate events require a separate event agreement
          and uplifted nightly rate (see Weddings and Corporate Retreats pages).
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">6. House rules</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Quiet hours 22:00–08:00. No amplified music outdoors after 22:00 (Croatian noise ordinance).</li>
          <li>No smoking inside either villa. Smoking is permitted on outdoor terraces.</li>
          <li>Up to 2 pets per villa welcome at no extra charge — please notify us in advance.</li>
          <li>The pool is open May 1 – October 30. Children under 12 must be supervised at all times.</li>
          <li>The shared clay tennis court is available daily — please book the slot at the welcome desk.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">7. Liability</h2>
        <p className="mt-3">
          Guests are responsible for the safety of their own party while using the pool, sauna, tennis
          court, and outdoor grounds. We carry public liability insurance for the villas but recommend
          travel insurance covering personal injury and lost belongings. Damage caused by negligence is
          deducted from the damage deposit.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">8. Force majeure</h2>
        <p className="mt-3">
          Should the property become unusable due to events outside our control (natural disaster,
          government order, utility failure that we cannot remedy within 24 hours), we will refund
          unused nights pro-rata. We are not liable for travel disruption affecting your ability to
          arrive.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">9. Governing law</h2>
        <p className="mt-3">
          These terms are governed by Croatian law. Disputes that cannot be resolved amicably are
          submitted to the court with jurisdiction over Pula, Croatia.
        </p>
      </section>
    </>
  );
}

function TermsDE() {
  return (
    <>
      <p>
        Diese Bedingungen gelten für Direktbuchungen von Villa Ballena und/oder Villa Beluga über
        ballenaandbeluga.com oder bei Direktkontakt mit dem Vermieter. Buchungen über Drittplattformen
        (Airbnb, myluxoria, crovillas u. a.) unterliegen den Bedingungen der jeweiligen Plattform
        zusätzlich zu den unten genannten Hausregeln.
      </p>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">1. Buchungsbestätigung</h2>
        <p className="mt-3">
          Eine Buchung gilt erst nach unserer schriftlichen Bestätigung und Eingang der vereinbarten
          Anzahlung als verbindlich. Wir behalten uns vor, Anfragen ohne Angabe von Gründen abzulehnen.
          Direktbuchungen werden in EUR quotiert; die Preisseite zeigt den Standard-Nächtigungssatz nach
          Saison — für Hochzeiten, Retreats und die kombinierte Complex-BeBa-Buchung gelten
          individuelle Angebote.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">2. Zahlung &amp; Kaution</h2>
        <p className="mt-3">
          30 % Anzahlung sind innerhalb von 7 Tagen nach Buchungsbestätigung fällig. Die restlichen
          70 % sind 30 Tage vor Anreise zu zahlen. Eine erstattungsfähige Kaution von 1.500 € pro Villa
          wird für Schäden hinterlegt — Rückerstattung innerhalb von 7 Tagen nach Abreise nach
          Endkontrolle. Wir akzeptieren SEPA-Überweisungen; Kartenzahlungen per Direktrechnung auf
          Anfrage.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">3. Stornierung</h2>
        <p className="mt-3">
          Mehr als 60 Tage vor Anreise: Volle Rückerstattung abzüglich 100 € Bearbeitungsgebühr.
          30–60 Tage vor Anreise: Anzahlung verfällt, Restbetrag wird erstattet. Weniger als 30 Tage
          vor Anreise: keine Erstattung, wir helfen jedoch beim Weiterverkauf der Termine. Reise- und
          Stornoversicherung dringend empfohlen.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">4. Check-in &amp; Check-out</h2>
        <p className="mt-3">
          Check-in ab 16:00 Uhr, Check-out bis 10:00 Uhr. Früher Check-in und später Check-out auf
          Anfrage und vorbehaltlich der Verfügbarkeit, ggf. mit 100 €-Aufpreis pro Villa. Nach
          kroatischem Recht sind wir verpflichtet, jeden Übernachtungsgast bei der Polizei (eVisitor)
          anzumelden — bitte bringen Sie für jede Person einen gültigen Ausweis oder Reisepass mit.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">5. Belegung &amp; Veranstaltungen</h2>
        <p className="mt-3">
          Maximal 8 + 1 Gäste pro Villa, 18 in beiden zusammen. Tagesbesucher sind ohne vorherige
          schriftliche Vereinbarung nicht zulässig. Hochzeiten, Feiern und Firmenveranstaltungen
          erfordern eine gesonderte Veranstaltungsvereinbarung und einen erhöhten Übernachtungspreis
          (siehe Hochzeiten- und Firmen-Retreat-Seiten).
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">6. Hausordnung</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Ruhezeiten 22:00–08:00 Uhr. Keine verstärkte Musik im Freien nach 22:00 Uhr (kroatische Lärmverordnung).</li>
          <li>Rauchverbot in beiden Villen. Rauchen auf den Außenterrassen erlaubt.</li>
          <li>Bis zu 2 Haustiere pro Villa kostenfrei willkommen — bitte vorher ankündigen.</li>
          <li>Pool geöffnet vom 1. Mai bis 30. Oktober. Kinder unter 12 Jahren stets unter Aufsicht.</li>
          <li>Der gemeinsame Sandtennisplatz ist täglich verfügbar — Reservierung an der Rezeption.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">7. Haftung</h2>
        <p className="mt-3">
          Die Gäste sind für die Sicherheit ihrer Gruppe bei Nutzung von Pool, Sauna, Tennisplatz und
          Außenanlagen selbst verantwortlich. Wir verfügen über eine Haftpflichtversicherung, empfehlen
          aber dringend eine Reiseversicherung mit Personen- und Gepäckschutz. Schäden durch
          Fahrlässigkeit werden von der Kaution einbehalten.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">8. Höhere Gewalt</h2>
        <p className="mt-3">
          Sollte die Unterkunft durch Ereignisse außerhalb unserer Kontrolle (Naturereignis, behördliche
          Anordnung, nicht binnen 24 Stunden behebbarer Versorgungsausfall) unbenutzbar werden,
          erstatten wir nicht genutzte Nächte anteilig. Für reisebedingte Anreiseprobleme übernehmen
          wir keine Haftung.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-lg uppercase tracking-[0.12em]">9. Anwendbares Recht</h2>
        <p className="mt-3">
          Es gilt kroatisches Recht. Streitigkeiten, die nicht einvernehmlich beigelegt werden können,
          werden vor dem für Pula zuständigen Gericht entschieden.
        </p>
      </section>
    </>
  );
}
