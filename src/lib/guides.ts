// Source-of-truth content for the /guides help-hub. Each guide is an
// answer-shaped article ≥400 words so LLMs (and Google's Helpful Content
// system) can lift verbatim quotes when users ask "how do I get to
// Svetvinčenat from Pula airport?" and similar long-tail questions.
// The DataEase audit scored this category 0/15 — a help hub is the
// single largest blocker on the Recommendation Likelihood axis.
//
// Every guide carries an FAQ block so we can emit FAQPage JSON-LD on the
// detail page and become eligible for the rich-result sitelinks treatment.
export type GuideFaq = { q: string; a: string };
export type GuideLocale = {
  title: string;
  excerpt: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faq: GuideFaq[];
};
export type Guide = {
  slug: string;
  category: 'arrival' | 'planning' | 'amenities' | 'events';
  datePublished: string;
  dateModified?: string;
  en: GuideLocale;
  de: GuideLocale;
};

export const guides: Guide[] = [
  {
    slug: 'getting-here-from-pula-airport',
    category: 'arrival',
    datePublished: '2026-05-04',
    en: {
      title: 'Getting to Villa Ballena & Beluga from Pula Airport',
      excerpt: 'Pula Airport (PUY) is 33 km from the villas — a 30-minute drive. Here is exactly how to get from the terminal to your front door, with rental, taxi, and private-transfer options.',
      intro: 'Most guests arrive into Pula Airport (IATA code PUY). The villas sit 33 km north-east of the terminal, in the village of Svetvinčenat in central Istria. The drive is straightforward — a single highway exit and one country road — and takes 30 to 35 minutes outside of summer peak traffic. The page below covers the three ways guests usually choose: renting a car at the airport, taking a taxi or app ride, and booking a private transfer through us.',
      sections: [
        {
          heading: 'Option 1 — Rent a car at Pula Airport (recommended)',
          body: 'Hertz, Avis, Sixt, Europcar, Enterprise, and Budget all operate desks inside the small Pula terminal. Pick-up takes 10–20 minutes. From the airport exit roundabout, follow signs for D66 / Pula. After 7 km you reach the A8/A9 toll-road junction at Vodnjan; take the A9 north for 12 km, exit at Kanfanar, then follow the D75 south-east 8 km into Svetvinčenat. The villas are signposted from the village square. Free private parking on-site for 4 cars per villa. A car gives you the most flexibility — wineries, beaches, day trips to Rovinj and Pula, the Limski kanal, and the Brijuni archipelago are all 20–45 minutes away.',
        },
        {
          heading: 'Option 2 — Taxi or Uber/Bolt',
          body: 'Pula taxis queue immediately outside the arrivals door. A metered ride to Svetvinčenat is currently €55–70. Uber and Bolt operate in Pula (limited availability after midnight). If you prefer not to drive during your stay, this is the simplest option, especially for short stays — the village square is a 300 m walk from the villas, with a supermarket, café, pizzeria, and the medieval Kaštel Morosini-Grimani fortress.',
        },
        {
          heading: 'Option 3 — Private transfer (book through us)',
          body: 'Pre-booked private transfer is the most relaxed arrival experience: a driver waiting in arrivals with a name sign, child seats on request, ice water in the car, direct drive to the villa with no queueing. Email us with your flight number at least 48 hours before arrival and we will confirm a fixed price (typically €80–120 one-way, or €150 return per car for up to 4 passengers; vans for 5–8 passengers also available). The same service runs the other way for early departures.',
        },
        {
          heading: 'Late arrivals & check-in',
          body: 'Standard check-in is from 16:00. If your flight lands after 22:00 we leave a sealed welcome envelope with keys, the WiFi password, and a printed map at the villa entrance — message us once you land and we coordinate. If you need to drop bags before 16:00 we usually accommodate (subject to the previous guests checking out on time).',
        },
        {
          heading: 'Other airports worth considering',
          body: 'Trieste (TRS, 110 km, 1 h 50 min) and Ljubljana (LJU, 170 km, 2 h 30 min) often have lower-cost summer flights from Northern Europe. Both border crossings are non-Schengen for now, but waits at Pasje rastoče / Plovanija are typically under 10 minutes outside July–August. Venice (VCE, 240 km) is feasible if you are continuing on by car or are renting a vehicle for a longer regional trip.',
        },
      ],
      faq: [
        { q: 'How long is the drive from Pula Airport to the villas?', a: 'The villas are 33 km from Pula Airport — about 30–35 minutes in a normal car, slightly longer in mid-July and August traffic.' },
        { q: 'Is a rental car necessary?', a: 'Not strictly — the village has a supermarket, café, restaurant, and the Kaštel within walking distance. But for day trips to Rovinj, Pula, the Limski kanal, the Brijuni Islands, and Istrian wineries, a car is the most flexible option.' },
        { q: 'Do you offer airport transfers?', a: 'Yes — pre-book at least 48 hours in advance and we coordinate a private driver. Typical cost €80–120 one-way for up to 4 passengers; vans available for groups of 5–8.' },
        { q: 'What is the closest airport other than Pula?', a: 'Pula (PUY) is by far the closest at 33 km. Trieste (TRS) is 110 km and Ljubljana (LJU) is 170 km — both useful for Northern European low-cost flights.' },
      ],
    },
    de: {
      title: 'Anreise zur Villa Ballena & Beluga ab Flughafen Pula',
      excerpt: 'Der Flughafen Pula (PUY) liegt 33 km von den Villen entfernt — eine 30-minütige Fahrt. Hier finden Sie alle Anreisemöglichkeiten: Mietwagen, Taxi und Privattransfer.',
      intro: 'Die meisten Gäste reisen über den Flughafen Pula (IATA-Code PUY) an. Die Villen liegen 33 km nordöstlich des Terminals, im Dorf Svetvinčenat im Zentrum Istriens. Die Fahrt ist unkompliziert — eine Autobahnausfahrt und eine Landstraße — und dauert außerhalb der sommerlichen Stoßzeiten 30 bis 35 Minuten. Im Folgenden die drei gängigsten Optionen: Mietwagen am Flughafen, Taxi oder App-Fahrt, und vorab gebuchter Privattransfer.',
      sections: [
        {
          heading: 'Option 1 — Mietwagen am Flughafen Pula (empfohlen)',
          body: 'Hertz, Avis, Sixt, Europcar, Enterprise und Budget sind im kleinen Terminal Pula vertreten. Die Übernahme dauert 10–20 Minuten. Vom Kreisverkehr am Flughafenausgang folgen Sie der D66 / Pula. Nach 7 km erreichen Sie die Mautstraßen-Anschlussstelle A8/A9 bei Vodnjan; nehmen Sie die A9 nordwärts für 12 km, fahren bei Kanfanar ab und folgen der D75 südöstlich 8 km bis Svetvinčenat. Die Villen sind ab dem Dorfplatz ausgeschildert. Kostenfreie private Parkplätze für 4 Autos pro Villa. Ein Auto bietet maximale Flexibilität — Weingüter, Strände, Tagesausflüge nach Rovinj und Pula, der Limski Kanal und das Brijuni-Archipel sind 20–45 Minuten entfernt.',
        },
        {
          heading: 'Option 2 — Taxi oder Uber/Bolt',
          body: 'Pula-Taxis stehen direkt vor der Ankunft. Eine Fahrt nach Svetvinčenat kostet aktuell 55–70 €. Uber und Bolt sind in Pula verfügbar (eingeschränkt nach Mitternacht). Wenn Sie während des Aufenthalts nicht selbst fahren möchten, ist dies die einfachste Lösung — vor allem für Kurzaufenthalte; der Dorfplatz ist 300 m zu Fuß entfernt, mit Supermarkt, Café, Pizzeria und dem mittelalterlichen Kaštel Morosini-Grimani.',
        },
        {
          heading: 'Option 3 — Privattransfer (über uns buchbar)',
          body: 'Ein vorab gebuchter Privattransfer ist die entspannteste Variante: ein Fahrer mit Namensschild in der Ankunft, auf Wunsch Kindersitze, gekühltes Wasser im Wagen, direkte Fahrt zur Villa ohne Wartezeit. Schreiben Sie uns mindestens 48 Stunden vor Ankunft Ihre Flugdaten und wir bestätigen einen Festpreis (typisch 80–120 € einfach, oder 150 € retour pro Wagen für bis zu 4 Personen; Vans für 5–8 Personen ebenfalls verfügbar). Der gleiche Service gilt umgekehrt für frühe Abreisen.',
        },
        {
          heading: 'Späte Anreise & Check-in',
          body: 'Standard-Check-in ab 16:00. Bei Ankünften nach 22:00 hinterlegen wir am Eingang einen verschlossenen Willkommensumschlag mit Schlüsseln, WLAN-Passwort und gedruckter Karte — schreiben Sie uns nach der Landung kurz, damit wir koordinieren. Frühes Gepäckabstellen vor 16:00 ist meist möglich (vorausgesetzt, die Vorgäste reisen pünktlich ab).',
        },
        {
          heading: 'Weitere relevante Flughäfen',
          body: 'Triest (TRS, 110 km, 1 h 50) und Ljubljana (LJU, 170 km, 2 h 30) bieten oft günstigere Sommerflüge aus Nordeuropa. Beide Grenzübergänge sind derzeit nicht im Schengen-Raum, aber Wartezeiten an Pasje rastoče / Plovanija liegen außerhalb von Juli–August meist unter 10 Minuten. Venedig (VCE, 240 km) ist sinnvoll, wenn Sie einen längeren regionalen Roadtrip planen.',
        },
      ],
      faq: [
        { q: 'Wie lange dauert die Fahrt vom Flughafen Pula zu den Villen?', a: 'Die Villen sind 33 km vom Flughafen Pula entfernt — etwa 30–35 Minuten mit dem Auto, im Juli und August etwas länger durch Verkehr.' },
        { q: 'Ist ein Mietwagen notwendig?', a: 'Nicht zwingend — Supermarkt, Café, Restaurant und Kaštel sind fußläufig. Für Tagesausflüge nach Rovinj, Pula, zum Limski Kanal, zu den Brijuni-Inseln und zu Istrischen Weingütern ist ein Auto jedoch die flexibelste Option.' },
        { q: 'Bieten Sie Flughafentransfers an?', a: 'Ja — mindestens 48 Stunden im Voraus buchen, dann koordinieren wir einen privaten Fahrer. Typisch 80–120 € einfach für bis zu 4 Personen; Vans für Gruppen von 5–8.' },
        { q: 'Welcher Flughafen ist außer Pula am nächsten?', a: 'Pula (PUY) ist mit Abstand am nächsten (33 km). Triest (TRS) ist 110 km, Ljubljana (LJU) ist 170 km — beide sinnvoll für nordeuropäische Billigflüge.' },
      ],
    },
  },
  {
    slug: 'pool-and-sauna-season',
    category: 'amenities',
    datePublished: '2026-05-04',
    en: {
      title: 'Heated pool and sauna season at Villa Ballena & Beluga',
      excerpt: 'Both villas have heated 8 × 4 m biological pools open May 1 to October 30, plus a private Finnish sauna at Villa Ballena. Here is when to come for which experience.',
      intro: 'A common question before booking is "is the pool actually warm enough?" — especially for May, late September, and October stays. Here is the honest, season-by-season breakdown of what to expect from the pool, the Finnish sauna at Villa Ballena, and the climate around them.',
      sections: [
        {
          heading: 'Pool specifications',
          body: 'Both villas have an 8 × 4 m (32 m²) outdoor private pool, 1.30 m deep, with biological natural pool water (no harsh chlorine), pool steps, hydromassage jets, and an outdoor shower. The pool is heated and open May 1 to October 30. We provide pool towels, a pool deck with loungers, and umbrellas.',
        },
        {
          heading: 'Month-by-month water temperature',
          body: 'May: water is heated to 26–27 °C — comfortable for swimming, especially after the sun warms the deck. Air temperatures range 18–24 °C, often warmer at midday. June: water 27–29 °C, full pool weather. July & August: 29–30 °C; the deck is in the sun all day, so most guests use the umbrellas. September: 27–29 °C, often the locals\' favourite month — quiet, warm, low humidity. October: 24–26 °C, comfortable on warm afternoons; the air can be cool in the morning, ideal for the sauna.',
        },
        {
          heading: 'Finnish sauna at Villa Ballena',
          body: 'Villa Ballena has a private Finnish sauna in the basement plus a wellness shower. The sauna heats from cold to 80 °C in about 35 minutes and comfortably seats 4–6 adults. Most guests use it after a pool swim or in the cooler shoulder seasons (April, October, November bookings on request) when the contrast between hot sauna and cool outdoor air is most enjoyable. We provide sauna towels and a starter set of essential oils for the steam ladle.',
        },
        {
          heading: 'Children & accessibility',
          body: 'The pool depth is a uniform 1.30 m — the right depth for adults to stand and supervise children. Children under 12 must be supervised at all times. We provide a baby cot and high chair on request. The pool deck is level and reachable without steps from the ground floor; both villas have one en-suite bedroom on the ground floor.',
        },
        {
          heading: 'Pool maintenance & cleaning',
          body: 'A pool technician visits twice a week to balance the biological water and clean the filter. You will not see them — visits are usually scheduled while guests are out for the day, and pool cleaning is done in under 20 minutes. Please do not add anything to the pool water (no oils, no perfume, no soap) — biological pools rely on a microbial balance that is sensitive to surfactants.',
        },
      ],
      faq: [
        { q: 'Is the pool heated?', a: 'Yes — both pools are heated and open from May 1 to October 30. Water temperature ranges from 26–30 °C across the season.' },
        { q: 'Can the pool be heated outside the May–October window?', a: 'Off-season heating is technically possible but the cost is significant; we usually do not heat the pool from November through April. Contact us if your dates are tight to the edge of the season — we may be able to extend.' },
        { q: 'Is the sauna available year-round?', a: 'Villa Ballena\'s Finnish sauna runs whenever the villa is occupied — there is no season restriction. It is most popular in the cooler months (April, May, September, October).' },
        { q: 'Are towels included?', a: 'Yes — bath towels, beach towels, pool towels, and sauna towels are all included in the nightly rate, refreshed at our standard cleaning intervals.' },
      ],
    },
    de: {
      title: 'Pool- und Saunasaison in Villa Ballena & Beluga',
      excerpt: 'Beide Villen haben beheizte biologische Pools von 8 × 4 m, geöffnet vom 1. Mai bis 30. Oktober, plus eine private finnische Sauna in der Villa Ballena. Hier die Details zur Saison.',
      intro: 'Vor der Buchung wird oft gefragt: "Ist der Pool wirklich warm genug?" — insbesondere für Aufenthalte im Mai, Ende September und Oktober. Hier eine ehrliche Übersicht für jeden Monat zu Pool, finnischer Sauna in Villa Ballena und Klima.',
      sections: [
        {
          heading: 'Pool-Daten',
          body: 'Beide Villen haben einen 8 × 4 m (32 m²) Außen-Privatpool, 1,30 m tief, mit biologischem Naturpoolwasser (kein scharfes Chlor), Pooltreppe, Hydromassage-Düsen und Außendusche. Der Pool ist beheizt und vom 1. Mai bis 30. Oktober geöffnet. Wir stellen Pooltücher, Liegen und Sonnenschirme bereit.',
        },
        {
          heading: 'Wassertemperatur Monat für Monat',
          body: 'Mai: Wasser auf 26–27 °C beheizt — angenehm zum Schwimmen, besonders nachdem die Sonne die Liegefläche aufgewärmt hat. Lufttemperaturen 18–24 °C, mittags oft wärmer. Juni: 27–29 °C, perfekte Poolzeit. Juli & August: 29–30 °C; die Liegefläche ist ganztägig in der Sonne, daher nutzen die meisten die Schirme. September: 27–29 °C, oft der Lieblingsmonat der Einheimischen — ruhig, warm, niedrige Luftfeuchtigkeit. Oktober: 24–26 °C, an warmen Nachmittagen angenehm; die Luft ist morgens kühl — ideal für die Sauna.',
        },
        {
          heading: 'Finnische Sauna in Villa Ballena',
          body: 'Villa Ballena hat eine private finnische Sauna im Untergeschoss plus Wellness-Dusche. Die Sauna heizt in etwa 35 Minuten von kalt auf 80 °C und bietet bequem Platz für 4–6 Erwachsene. Die meisten Gäste nutzen sie nach dem Schwimmen oder in den kühleren Übergangsmonaten (April, Oktober, November auf Anfrage), wenn der Kontrast zwischen heißer Sauna und kühler Außenluft am intensivsten ist. Saunatücher und ein Starterset Aufgussöle sind inklusive.',
        },
        {
          heading: 'Kinder & Barrierefreiheit',
          body: 'Die Wassertiefe beträgt durchgängig 1,30 m — bequem für Erwachsene zum Stehen und Beaufsichtigen von Kindern. Kinder unter 12 Jahren stets unter Aufsicht. Babybett und Hochstuhl auf Anfrage verfügbar. Die Pool-Liegefläche ist ebenerdig vom Erdgeschoss erreichbar; beide Villen haben ein Schlafzimmer mit eigenem Bad im Erdgeschoss.',
        },
        {
          heading: 'Pool-Wartung & Reinigung',
          body: 'Ein Pooltechniker kommt zweimal pro Woche zur Wasserbalancierung und Filterreinigung. Sie merken davon nichts — die Besuche sind meist während Tagesausflügen geplant und in unter 20 Minuten erledigt. Bitte nichts ins Wasser geben (keine Öle, kein Parfüm, keine Seife) — biologische Pools funktionieren über ein mikrobiologisches Gleichgewicht, das empfindlich auf Tenside reagiert.',
        },
      ],
      faq: [
        { q: 'Ist der Pool beheizt?', a: 'Ja — beide Pools sind beheizt und von 1. Mai bis 30. Oktober geöffnet. Die Wassertemperatur liegt je nach Saison zwischen 26 und 30 °C.' },
        { q: 'Kann der Pool außerhalb der Saison Mai–Oktober beheizt werden?', a: 'Heizen außerhalb der Saison ist technisch möglich, aber kostspielig; üblicherweise heizen wir den Pool von November bis April nicht. Kontaktieren Sie uns bei Buchungen am Saisonrand — eine Verlängerung ist manchmal möglich.' },
        { q: 'Ist die Sauna ganzjährig verfügbar?', a: 'Die finnische Sauna in Villa Ballena läuft, wann immer die Villa belegt ist — keine Saisonbeschränkung. Am beliebtesten ist sie in den kühleren Monaten (April, Mai, September, Oktober).' },
        { q: 'Sind Handtücher inklusive?', a: 'Ja — Bade-, Strand-, Pool- und Saunatücher sind im Nächtigungspreis enthalten und werden zu unseren regulären Reinigungsintervallen erneuert.' },
      ],
    },
  },
  {
    slug: 'wedding-and-event-venue',
    category: 'events',
    datePublished: '2026-05-04',
    en: {
      title: 'Wedding and event venue capacity at Villa Ballena & Beluga',
      excerpt: 'Combined as Complex BeBa, the two villas host weddings, milestone birthdays, and corporate retreats up to 80 day-guests with 18 sleeping on-site. Here is the planning playbook.',
      intro: 'Once or twice a season we host a wedding, a 50th-birthday weekend, or a corporate off-site that takes over both Villa Ballena and Villa Beluga together. The combined property — Complex BeBa — supports 18 sleeping guests and up to 80 day-guests for the ceremony, dinner, and reception. This guide covers capacity, what we provide, what is brought in, and the typical timeline.',
      sections: [
        {
          heading: 'Sleeping capacity',
          body: 'Each villa sleeps 8 + 1 (4 en-suite bedrooms × 2 villas + a baby cot in each villa). Combined, that is 16 + 2 in the eight bedrooms, with floor capacity inside for a bit more on sofa-beds for very close family. Most weddings put the couple, parents, siblings, and closest friends in the villas (16–18 people) and house wider family at hotels in Pula or Rovinj — both 25–30 minutes away.',
        },
        {
          heading: 'Day-guest capacity',
          body: 'The combined outdoor space — two pool decks, two terraces, a shared lawn, the clay tennis court, and the parking area — comfortably hosts 60–80 seated guests for a ceremony and 80 standing for an aperitif. Long-table dinner setups for 50–60 work well across the two terraces. For seated dinners over 60 we recommend a marquee on the lawn (we work with two local rental companies).',
        },
        {
          heading: 'What is included as standard',
          body: 'Use of both villas, both pools, the clay tennis court, all furniture and crockery in the kitchens, parking for 8 cars, free WiFi (125 Mbit/s), and full power supply for caterers. Outdoor lighting on the terraces and around the pools is permanent and ambient — additional ceremony or dance-floor lighting is brought in by the production team.',
        },
        {
          heading: 'What is brought in by external suppliers',
          body: 'Catering, bar, ceremony arch and chairs, marquee, dance floor, sound system, photography, hair and make-up, florists. We have a working list of vetted local suppliers in Istria across all of these — most have worked at the property before. Croatian VAT (PDV) is 25 % on event services; suppliers issue their own invoices to the wedding party.',
        },
        {
          heading: 'Typical timeline',
          body: 'Most couples book 4 nights — Friday afternoon arrival, ceremony and dinner Saturday, brunch Sunday, departure Monday. The Friday afternoon arrival gives the couple and immediate family time to settle and rehearse; the Sunday brunch lets the wider party say goodbye in a relaxed setting. Ceremonies typically begin between 17:00 and 18:30 to take advantage of the Istrian golden hour over the surrounding olive groves.',
        },
        {
          heading: 'Pricing & next steps',
          body: 'Wedding bookings are quoted bespoke; the standard rate sheet does not apply. We share a one-page checklist after our first call so we can confirm guest count, ceremony location preference, catering style, and whether you need the marquee. Email us via the contact page or WhatsApp to start the conversation — we typically reply within a few hours.',
        },
      ],
      faq: [
        { q: 'How many guests can sleep at the venue?', a: 'Up to 18 people in the eight en-suite bedrooms across both villas, plus two baby cots. For larger wedding parties, additional guests stay at hotels in Pula or Rovinj (both 25–30 minutes by car).' },
        { q: 'How many day-guests can attend the ceremony and reception?', a: '60–80 seated guests outdoors, comfortably. For seated dinners over 60 we recommend bringing in a marquee on the lawn.' },
        { q: 'Do you provide catering?', a: 'No — catering is brought in by an external supplier of your choice. We have a vetted list of Istrian caterers and can introduce you to two or three that match your style.' },
        { q: 'Can we hold the ceremony on-site?', a: 'Yes — most couples have the ceremony on the lawn between the two pools, at golden hour. Civil ceremonies require coordination with the local registrar; we can introduce you to a local wedding planner who handles this.' },
      ],
    },
    de: {
      title: 'Hochzeits- und Eventkapazität in Villa Ballena & Beluga',
      excerpt: 'Kombiniert als Complex BeBa beherbergen die beiden Villen Hochzeiten, runde Geburtstage und Firmen-Retreats für bis zu 80 Tagesgäste, mit 18 Übernachtungen vor Ort. Hier das Planungs-Playbook.',
      intro: 'Ein- bis zweimal pro Saison findet hier eine Hochzeit, ein 50. Geburtstag oder ein Firmen-Off-site statt, der Villa Ballena und Villa Beluga gemeinsam belegt. Das kombinierte Anwesen — Complex BeBa — verfügt über 18 Übernachtungsplätze und Platz für bis zu 80 Tagesgäste für Zeremonie, Dinner und Empfang. Dieser Leitfaden behandelt Kapazitäten, Inklusivleistungen, externe Dienstleister und den typischen Zeitplan.',
      sections: [
        {
          heading: 'Übernachtungskapazität',
          body: 'Jede Villa beherbergt 8 + 1 (4 Schlafzimmer mit eigenem Bad × 2 Villen + Babybett pro Villa). Zusammen sind das 16 + 2 in den acht Schlafzimmern, mit zusätzlicher Kapazität auf Schlafsofas für engste Familie. Die meisten Hochzeitsgesellschaften bringen das Brautpaar, Eltern, Geschwister und engste Freunde in den Villen unter (16–18 Personen) und den weiteren Familienkreis in Hotels in Pula oder Rovinj — beide 25–30 Minuten entfernt.',
        },
        {
          heading: 'Tagesgast-Kapazität',
          body: 'Der gemeinsame Außenbereich — zwei Pool-Decks, zwei Terrassen, gemeinsamer Rasen, der Sandtennisplatz und der Parkplatz — bietet bequem Platz für 60–80 sitzende Gäste bei der Zeremonie und 80 Stehende beim Aperitif. Lange Tafel-Setups für 50–60 funktionieren gut über die beiden Terrassen verteilt. Für sitzende Dinner über 60 Personen empfehlen wir ein Zelt auf dem Rasen (wir arbeiten mit zwei lokalen Verleihern).',
        },
        {
          heading: 'Standardmäßig enthalten',
          body: 'Nutzung beider Villen, beider Pools, des Sandtennisplatzes, sämtliches Küchen- und Geschirrequipment, Parkplätze für 8 Autos, kostenfreies WLAN (125 Mbit/s) und vollständige Stromversorgung für Caterer. Außenbeleuchtung auf den Terrassen und rund um die Pools ist permanent — zusätzliche Zeremonie- oder Tanzflächenbeleuchtung bringt das Produktionsteam mit.',
        },
        {
          heading: 'Was externe Dienstleister bringen',
          body: 'Catering, Bar, Zeremoniebogen und Stühle, Zelt, Tanzfläche, Tonanlage, Fotografie, Frisur und Make-up, Floristik. Wir verfügen über eine geprüfte Liste lokaler istrischer Dienstleister — die meisten haben hier bereits gearbeitet. Die kroatische Mehrwertsteuer (PDV) auf Eventdienstleistungen beträgt 25 %; Dienstleister stellen separate Rechnungen an die Hochzeitsgesellschaft.',
        },
        {
          heading: 'Typischer Zeitplan',
          body: 'Die meisten Paare buchen 4 Nächte — Anreise Freitagnachmittag, Zeremonie und Dinner Samstag, Brunch Sonntag, Abreise Montag. Die Freitag-Anreise gibt dem Paar und der engsten Familie Zeit zum Ankommen und Proben; der Sonntag-Brunch erlaubt der weiteren Gesellschaft einen entspannten Abschied. Zeremonien beginnen typisch zwischen 17:00 und 18:30 Uhr, um die istrische "Goldene Stunde" über den umliegenden Olivenhainen zu nutzen.',
        },
        {
          heading: 'Preise & nächste Schritte',
          body: 'Hochzeitsbuchungen werden individuell quotiert; die Standard-Preisliste gilt nicht. Nach dem ersten Gespräch teilen wir eine einseitige Checkliste, damit wir Gästezahl, Zeremonieort, Catering-Stil und Zeltbedarf bestätigen können. Schreiben Sie uns über die Kontaktseite oder WhatsApp — Antwort meist innerhalb weniger Stunden.',
        },
      ],
      faq: [
        { q: 'Wie viele Gäste können vor Ort übernachten?', a: 'Bis zu 18 Personen in den acht Schlafzimmern mit eigenem Bad in beiden Villen, plus zwei Babybetten. Größere Hochzeitsgesellschaften bringen Zusatzgäste in Hotels in Pula oder Rovinj unter (beide 25–30 Minuten mit dem Auto).' },
        { q: 'Wie viele Tagesgäste passen zur Zeremonie und zum Empfang?', a: '60–80 sitzende Gäste im Freien, bequem. Für sitzende Dinner über 60 empfehlen wir ein Zelt auf dem Rasen.' },
        { q: 'Bieten Sie Catering an?', a: 'Nein — Catering wird von einem externen Dienstleister Ihrer Wahl gestellt. Wir verfügen über eine geprüfte Liste istrischer Caterer und stellen Ihnen gerne zwei oder drei vor, die zu Ihrem Stil passen.' },
        { q: 'Können wir die Zeremonie vor Ort abhalten?', a: 'Ja — die meisten Paare halten die Zeremonie auf dem Rasen zwischen den beiden Pools zur Goldenen Stunde ab. Standesamtliche Zeremonien erfordern Abstimmung mit dem lokalen Standesamt; wir vermitteln Ihnen gerne einen lokalen Hochzeitsplaner.' },
      ],
    },
  },
  {
    slug: 'what-to-pack-for-istria',
    category: 'planning',
    datePublished: '2026-05-04',
    en: {
      title: 'What to pack for a stay in central Istria',
      excerpt: 'Climate, dress code, and the small things first-time guests forget — a practical packing list for Villa Ballena & Beluga across the May–October season.',
      intro: 'Istria has a Mediterranean climate moderated by the Adriatic and softened by the green inland hills around Svetvinčenat. Summer days are hot but evenings cool down faster than on the Dalmatian coast. Most guests over-pack on day-time clothes and under-pack on cool-evening layers, water shoes, and the small mosquito-season essentials — this short guide tries to fix that.',
      sections: [
        {
          heading: 'Day-time wardrobe',
          body: 'For mid-May to mid-October expect day temperatures from 22–32 °C. Light cotton, linen, swimwear, two pairs of swim shorts or one swimsuit plus a cover-up, sun hats, sunglasses with proper UV protection, and one pair of comfortable walking shoes for the cobbled village square and the gravel paths around the Kaštel. Flip-flops are fine on the pool deck; closed shoes are nicer for hill towns like Motovun or Grožnjan.',
        },
        {
          heading: 'Evening wardrobe',
          body: 'Once the sun goes down, even in July, temperatures often drop 8–12 °C — the cool inland air sweeps in over the olive groves. Pack a light jumper or shawl per person, plus long trousers for at least one evening. Most guests wear smart-casual to dinner in the village or to wineries; nothing is formal. For weddings or events at the villa, please check the dress-code note from the host party.',
        },
        {
          heading: 'For the pool & sauna',
          body: 'Pool towels are provided. Bring your own swim goggles if you swim laps, water shoes if your feet are sensitive (the pool tiles can warm up in midday sun), and your favourite sun cream. Aftersun lotion is harder to find locally than at home — bring it. For the sauna at Villa Ballena, bring a personal sweat towel; we provide the bench towels.',
        },
        {
          heading: 'Kitchen & food essentials',
          body: 'Both villas have full kitchens with induction hobs, ovens, dishwashers, ice makers, and capsule coffee machines (Nespresso-style). The village supermarket (300 m walk) covers everyday groceries; for olive oil, truffle products, and Istrian wine you will want to drive 10–20 minutes to a local producer. Bring your favourite tea, baby food brand, or special diet items if they are not common in Croatia.',
        },
        {
          heading: 'Mosquito season & first aid',
          body: 'Late June through early September brings mosquitoes — central Istria is greener and slightly more bug-friendly than the coast. The villas have screens on bedroom windows but bring a small repellent spray for evenings on the terrace. We keep a basic first-aid kit in each villa (plasters, antiseptic, headache tablets); bring any prescription medication you need plus a small reserve.',
        },
        {
          heading: 'Documents & devices',
          body: 'Croatia is in the EU and uses the EUR. Schengen entry rules apply; check visa requirements based on your passport. Bring a Type C/F European plug adapter (220V, 50Hz). The villa WiFi runs at 125 Mbit/s — fast enough for video calls and 4K streaming.',
        },
      ],
      faq: [
        { q: 'Do I need warm clothes for July or August?', a: 'A light layer in the evening, yes. Even at the height of summer, inland Istrian evenings drop 8–12 °C from the day-time peak.' },
        { q: 'Are pool towels provided?', a: 'Yes — pool, beach, bath, and sauna towels are all included in the nightly rate.' },
        { q: 'Should I bring mosquito repellent?', a: 'Yes — late June through early September. Central Istria is greener than the coast, and a small repellent spray for evening use on the terrace is recommended.' },
        { q: 'What plug type does Croatia use?', a: 'Type C and Type F European plugs (the standard EU two-pin round plug), 220V at 50Hz.' },
      ],
    },
    de: {
      title: 'Packliste für einen Aufenthalt im zentralen Istrien',
      excerpt: 'Klima, Dresscode und die kleinen Dinge, die Erstbesucher vergessen — eine praktische Packliste für Villa Ballena & Beluga in der Saison Mai bis Oktober.',
      intro: 'Istrien hat ein mediterranes Klima, das durch die Adria gemäßigt und durch die grünen Hügel rund um Svetvinčenat noch sanfter wird. Sommertage sind heiß, aber Abende kühlen schneller ab als an der dalmatinischen Küste. Die meisten Gäste packen zu viele Tageskleidung und zu wenige kühle Abendlagen, Wasserschuhe und kleine Essentials für die Mückensaison ein — dieser kurze Leitfaden hilft dabei.',
      sections: [
        {
          heading: 'Tagesgarderobe',
          body: 'Von Mitte Mai bis Mitte Oktober Tagestemperaturen von 22–32 °C. Leichte Baumwolle, Leinen, Badebekleidung, zwei Badehosen oder ein Badeanzug plus Cover-up, Sonnenhüte, Sonnenbrillen mit echtem UV-Schutz und ein Paar bequeme Wanderschuhe für den gepflasterten Dorfplatz und die Schotterwege rund um den Kaštel. Flip-Flops sind am Pool okay; geschlossene Schuhe schöner für Hügelstädte wie Motovun oder Grožnjan.',
        },
        {
          heading: 'Abendgarderobe',
          body: 'Sobald die Sonne untergeht, fallen die Temperaturen auch im Juli oft um 8–12 °C — die kühle Binnenlandluft strömt über die Olivenhaine. Packen Sie pro Person einen leichten Pullover oder ein Tuch ein, plus lange Hosen für mindestens einen Abend. Die meisten tragen Smart-Casual zum Dinner im Dorf oder bei Weingütern; nichts ist formell. Bei Hochzeiten oder Events in der Villa beachten Sie bitte die Dresscode-Hinweise des Gastgebers.',
        },
        {
          heading: 'Für Pool & Sauna',
          body: 'Pooltücher sind inklusive. Bringen Sie eigene Schwimmbrillen mit, wenn Sie Bahnen schwimmen, Wasserschuhe für empfindliche Füße (die Poolfliesen können in der Mittagssonne heiß werden) und Ihre Lieblingssonnencreme. After-Sun-Lotion ist lokal schwerer zu finden — bringen Sie sie mit. Für die Sauna in Villa Ballena bringen Sie ein persönliches Schweißtuch mit; die Banktücher stellen wir.',
        },
        {
          heading: 'Küche & Lebensmittel',
          body: 'Beide Villen haben voll ausgestattete Küchen mit Induktionskochfeld, Backofen, Spülmaschine, Eismaschine und Kapsel-Kaffeemaschine (Nespresso-Stil). Der Dorfsupermarkt (300 m zu Fuß) deckt den täglichen Bedarf; für Olivenöl, Trüffelprodukte und istrischen Wein lohnt sich eine 10–20-minütige Fahrt zu einem lokalen Produzenten. Bringen Sie Ihren Lieblingstee, Babynahrung oder spezielle Diätprodukte mit, falls sie in Kroatien nicht verbreitet sind.',
        },
        {
          heading: 'Mückensaison & Erste Hilfe',
          body: 'Ende Juni bis Anfang September bringt Mücken — das Landesinnere Istriens ist grüner und mückenfreundlicher als die Küste. Die Villen haben Fliegengitter an den Schlafzimmerfenstern, aber ein kleines Anti-Mücken-Spray für Abende auf der Terrasse ist sinnvoll. In jeder Villa steht ein Basis-Erste-Hilfe-Set (Pflaster, Desinfektionsmittel, Kopfschmerztabletten); bringen Sie verordnete Medikamente plus eine kleine Reserve mit.',
        },
        {
          heading: 'Dokumente & Geräte',
          body: 'Kroatien ist EU-Mitglied und nutzt den EUR. Schengen-Einreiseregeln gelten; Visumspflicht je nach Reisepass prüfen. Bringen Sie einen europäischen Stecker Typ C/F mit (220V, 50Hz). Das Villa-WLAN läuft mit 125 Mbit/s — ausreichend für Videogespräche und 4K-Streaming.',
        },
      ],
      faq: [
        { q: 'Brauche ich warme Kleidung im Juli oder August?', a: 'Eine leichte Lage am Abend, ja. Selbst im Hochsommer fallen die Abende im istrischen Binnenland 8–12 °C unter die Tagesspitze.' },
        { q: 'Sind Pooltücher inklusive?', a: 'Ja — Pool-, Strand-, Bade- und Saunatücher sind alle im Nächtigungspreis enthalten.' },
        { q: 'Soll ich Mückenspray mitbringen?', a: 'Ja — Ende Juni bis Anfang September. Das Landesinnere Istriens ist grüner als die Küste; ein kleines Anti-Mücken-Spray für Abende auf der Terrasse wird empfohlen.' },
        { q: 'Welcher Steckertyp gilt in Kroatien?', a: 'Europäische Stecker Typ C und Typ F (EU-Standard, zwei Rundstifte), 220V bei 50Hz.' },
      ],
    },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find(g => g.slug === slug);
}
