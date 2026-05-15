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
// Locale-neutral image with per-locale ALT text. Width/height are required so
// next/image can reserve layout space (no CLS) and so Article JSON-LD can ship
// dimensions alongside the URL for richer image attribution.
export type GuideImage = {
  src: string;
  alt: { en: string; de: string };
  width: number;
  height: number;
};
export type Guide = {
  slug: string;
  category: 'arrival' | 'planning' | 'amenities' | 'events';
  datePublished: string;
  dateModified?: string;
  // Hero image renders between H1 and intro; passed to Article schema.
  hero?: GuideImage;
  // Optional second image inserted after the named section (zero-indexed).
  inlineImage?: { afterSectionIndex: number; image: GuideImage };
  en: GuideLocale;
  de: GuideLocale;
};

export const guides: Guide[] = [
  {
    slug: 'getting-here-from-pula-airport',
    category: 'arrival',
    datePublished: '2026-05-04',
    dateModified: '2026-05-15',
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
          body: 'Trieste (TRS, 110 km, 1 h 50 min) and Ljubljana (LJU, 170 km, 2 h 30 min) often have lower-cost summer flights from Northern Europe. Both routes now run entirely within the Schengen Area — Croatia joined in 2023 — so there are no longer systematic border checks; carry your ID or passport but expect no border queues. Venice (VCE, 240 km) is feasible if you are continuing on by car or are renting a vehicle for a longer regional trip.',
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
          body: 'Triest (TRS, 110 km, 1 h 50) und Ljubljana (LJU, 170 km, 2 h 30) bieten oft günstigere Sommerflüge aus Nordeuropa. Beide Routen verlaufen heute vollständig im Schengen-Raum — Kroatien ist 2023 beigetreten —, sodass es keine systematischen Grenzkontrollen mehr gibt; führen Sie Ausweis oder Reisepass mit, rechnen Sie aber nicht mit Wartezeiten an der Grenze. Venedig (VCE, 240 km) ist sinnvoll, wenn Sie einen längeren regionalen Roadtrip planen.',
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
  {
    slug: 'day-trips-from-svetvincenat',
    category: 'planning',
    datePublished: '2026-05-06',
    en: {
      title: 'Day trips from Svetvinčenat — 6 places within an hour of the villa',
      excerpt: 'Pula, Rovinj, the Brijuni Islands, the Limski Kanal, Motovun, and Pazin — the practical day-trip radius from Villa Ballena & Beluga, with timings, parking notes, and what to actually do once you arrive.',
      intro: 'Svetvinčenat sits in the geographic middle of Istria, which is the single biggest underrated advantage of staying here over a coastal hotel: every classic Istrian destination is within about an hour by car, and most are 25–40 minutes. You can wake up at the villa, swim, drive to a UNESCO-listed Roman amphitheatre, eat truffle pasta on a hilltop, swim again on the way back, and be home for dinner. This guide covers the six places we send guests most often, with honest timing and what to skip.',
      sections: [
        {
          heading: 'Pula (35 minutes south)',
          body: 'Croatia\'s best-preserved Roman amphitheatre sits in the centre of Pula — built in the 1st century, capacity 23,000, still used for summer concerts. Buy tickets online to skip the queue, and aim to arrive before 10:00 or after 16:00 to avoid both the cruise-ship crowd and the midday heat on the unshaded stone. Combine the Arena with the Forum (the main square, with a 1st-century Roman temple still standing intact at its end), the Triumphal Arch of the Sergii, and a long lunch at one of the konobas in the old town. For an afternoon swim, drive 10 minutes to the Verudela peninsula — Hawaii Beach (Havajska plaža) and Ambrela are family-friendly with shade and easy water entry. Parking in central Pula is easiest at the Karolina garage; expect €2–3/hour.',
        },
        {
          heading: 'Rovinj (35 minutes west)',
          body: 'The most photographed town on the Istrian coast — pastel houses stacked on a small peninsula, the Church of St. Euphemia at the crown, narrow stepped lanes paved with worn limestone. The town itself is small enough to see in 90 minutes; the trick is to arrive late afternoon, walk the loop slowly, find a wine bar with a view of the harbour, and stay for the sunset (which from the small jetties on the western side is genuinely one of the best in the Mediterranean). Park outside the old town — the multi-storey on Valdibora is the closest legal option, then it\'s a 5-minute walk along the harbour. For dinner, La Puntulina or Monte are special-occasion spots; for a casual sit-down, Maestral on the harbour does excellent grilled fish.',
        },
        {
          heading: 'Brijuni Islands (40 minutes + 15-minute ferry)',
          body: 'A small archipelago off the coast at Fažana — declared a national park, formerly Tito\'s summer residence, now a managed nature reserve where peacocks walk through olive groves and Roman villa ruins. The standard visit is a half-day: drive 40 minutes to Fažana, park (free), take the official 15-minute Brijuni Tourist Bureau ferry to Veliki Brijun. Once on the island, hire bikes (recommended) or take the small tourist train for the 4-hour loop that covers the safari park (zebras, llamas — Tito received them as gifts), the Roman villa, and the Byzantine castrum. Book ferry tickets on the Brijuni National Park website at least two days ahead in summer; same-day tickets sell out by 09:30 in July and August.',
        },
        {
          heading: 'Limski Kanal (25 minutes north-west)',
          body: 'A 12-km flooded river valley that looks like a Norwegian fjord cutting into the Istrian coast — narrow, steep-sided, brackish. Two reasons to go: the oysters, farmed in the channel since Roman times and considered among the best in the Adriatic, served at the small restaurants on the southern bank (Viking and Fjord are the classic two); and the swimming, which is calm, sheltered from wind, and far less busy than the open coast. The pirate-themed restaurant signs are kitsch, the food is genuinely good. Combine with a stop at the medieval village of Sveti Lovreč on the way back.',
        },
        {
          heading: 'Motovun (50 minutes north)',
          body: 'A hilltop town visible from miles away — fortified medieval walls, a population of 500, surrounded by oak forest that is one of Europe\'s richest white-truffle grounds. Park at the foot of the hill (€5/day in season; the upper car park is reserved for residents) and walk up the cobbled ramp through the two town gates. The full loop of the medieval walls takes 25 minutes and gives you a 360° view of central Istria — the rolling vineyards south toward Buje, the Mirna river valley below, the Učka mountains east. Lunch options at the top: Mondo Konoba is the most famous (book ahead, truffle-heavy menu), Pod Voltom is the locals\' choice. The Motovun Film Festival in late July transforms the town into an open-air cinema; outside that week it stays quiet even in August.',
        },
        {
          heading: 'Pazin (35 minutes east)',
          body: 'The geographic and administrative centre of Istria, often skipped by tourists chasing the coast — which is exactly why it\'s worth the detour. The Pazin Castle is the largest preserved fortification in the region (now an ethnographic museum) and sits dramatically on the edge of the Pazinska jama, a karst chasm where the Pazinčica river disappears underground. Jules Verne set the climax of his novel Mathias Sandorf here in 1885. The cave system below the castle can be visited on a 90-minute guided tour in summer. For lunch in Pazin, Konoba Vela Vrata is the safe pick. Combine with a stop at Tinjan (10 minutes south) for the famous Istrian prosciutto — Tinjan ham (pršut) is Istria\'s best-known cured meat.',
        },
        {
          heading: 'Other shorter trips worth a half-day',
          body: 'Bale (22 minutes west) — a tiny medieval village with one perfect square and excellent food at La Grisa hotel restaurant. Vodnjan (28 minutes south-west) — three mummified saints in the parish church and an Istria-best olive oil scene. Fažana (40 minutes south) — the embarkation point for Brijuni, with a charming working harbour and the best sardine restaurants in central Istria (Stara Konoba). And Svetvinčenat itself — the medieval Kaštel Morosini-Grimani is 300 metres from the villa and most guests don\'t look up at it once; the inner courtyard is open most afternoons in summer and the village square holds a small farmers\' market on Saturday mornings.',
        },
      ],
      faq: [
        { q: 'Do I really need a car for these day trips?', a: 'Yes — the day-trip radius assumes a rental car. Public buses connect Svetvinčenat to Pula and Rovinj but on a sparse schedule (4–5 a day), so a car is what makes "wake up at the villa, swim, day-trip, swim again, dinner at home" possible.' },
        { q: 'Which day trip is best with young children?', a: 'Brijuni Islands — the bike loop, the safari park animals, the small tourist train, and easy swimming on the way back at Fažana all read well to under-10s. Limski Kanal is the second pick for the calm, shallow water.' },
        { q: 'How early do I need to book Brijuni ferry tickets?', a: 'Two to three days ahead in July and August; same-day is fine in May, June, and September outside weekends. Book directly on the Brijuni National Park website to lock the time slot.' },
        { q: 'Can I do Motovun and Rovinj in the same day?', a: 'Possible but rushed — both deserve 3–4 hours. Better to pair Motovun with a stop in Pazin or with truffle hunting in the Mirna valley, and treat Rovinj as its own evening trip.' },
        { q: 'Is Pula crowded in summer?', a: 'In July and August, yes — cruise ships dock 2–3 times a week, and the Arena queue at midday can be 30 minutes. Going before 10:00 or after 16:00 avoids both the queue and the heat on the unshaded amphitheatre seating.' },
      ],
    },
    de: {
      title: 'Tagesausflüge von Svetvinčenat — 6 Orte innerhalb einer Stunde von der Villa',
      excerpt: 'Pula, Rovinj, die Brijuni-Inseln, der Limski-Kanal, Motovun und Pazin — der praktische Tagesausflugsradius ab Villa Ballena & Beluga, mit Fahrzeiten, Parkhinweisen und was vor Ort wirklich lohnt.',
      intro: 'Svetvinčenat liegt im geografischen Zentrum Istriens — der größte unterschätzte Vorteil eines Aufenthalts hier gegenüber einem Hotel an der Küste: jedes klassische istrische Reiseziel ist mit dem Auto in etwa einer Stunde erreichbar, die meisten sogar in 25–40 Minuten. Sie können in der Villa aufwachen, schwimmen, zu einem UNESCO-gelisteten römischen Amphitheater fahren, Trüffelpasta auf einem Hügel essen, auf dem Rückweg nochmal baden und rechtzeitig zum Abendessen zurück sein. Dieser Leitfaden behandelt die sechs Ziele, zu denen wir Gäste am häufigsten schicken — mit ehrlichen Zeitangaben und Hinweisen, was man auslassen kann.',
      sections: [
        {
          heading: 'Pula (35 Minuten südlich)',
          body: 'Kroatiens am besten erhaltenes römisches Amphitheater steht im Zentrum von Pula — erbaut im 1. Jahrhundert, Kapazität 23.000 Personen, bis heute für Sommerkonzerte genutzt. Tickets online kaufen, um die Schlange zu vermeiden, und vor 10:00 oder nach 16:00 ankommen, um sowohl der Kreuzfahrtmenge als auch der Mittagshitze auf den unbeschatteten Steinrängen auszuweichen. Kombinieren Sie die Arena mit dem Forum (Hauptplatz mit einem intakten römischen Tempel aus dem 1. Jahrhundert), dem Triumphbogen der Sergier und einem ausgedehnten Mittagessen in einer der Konobas in der Altstadt. Für ein Bad am Nachmittag fahren Sie 10 Minuten zur Halbinsel Verudela — Hawaii (Havajska plaža) und Ambrela sind familienfreundlich mit Schatten und einfachem Wassereinstieg. Parken im Zentrum am einfachsten in der Tiefgarage Karolina; ca. 2–3 €/Stunde.',
        },
        {
          heading: 'Rovinj (35 Minuten westlich)',
          body: 'Die meistfotografierte Stadt an der istrischen Küste — pastellfarbene Häuser auf einer kleinen Halbinsel gestapelt, die Kirche der Heiligen Euphemia als Krone, schmale Treppengassen aus abgenutztem Kalkstein. Die Stadt selbst ist klein genug für 90 Minuten; der Trick ist, am späten Nachmittag anzukommen, die Schleife langsam zu laufen, eine Weinbar mit Blick auf den Hafen zu finden und bis zum Sonnenuntergang zu bleiben (von den kleinen Stegen auf der Westseite einer der besten im Mittelmeerraum). Parken außerhalb der Altstadt — das Parkhaus Valdibora ist die nächste legale Option, von dort 5 Minuten am Hafen entlang. Zum Abendessen sind La Puntulina und Monte besondere Adressen; für etwas Lockereres serviert Maestral am Hafen ausgezeichneten Grillfisch.',
        },
        {
          heading: 'Brijuni-Inseln (40 Minuten + 15-Minuten-Fähre)',
          body: 'Ein kleines Archipel vor der Küste bei Fažana — Nationalpark, ehemalige Sommerresidenz Titos, heute kontrolliertes Naturreservat, wo Pfauen durch Olivenhaine spazieren und römische Villa-Ruinen stehen. Standardbesuch ist ein halber Tag: 40 Minuten Fahrt nach Fažana, kostenfrei parken, mit der offiziellen 15-Minuten-Fähre des Brijuni-Tourismusbüros nach Veliki Brijun. Auf der Insel Fahrräder mieten (empfohlen) oder die kleine Touristenbahn für die 4-stündige Schleife mit Safaripark (Zebras, Lamas — Tito erhielt sie als Geschenke), römischer Villa und byzantinischem Castrum. Fähren-Tickets auf der Brijuni-Nationalpark-Website mindestens zwei Tage im Voraus buchen; Same-Day-Tickets sind im Juli und August bis 09:30 ausverkauft.',
        },
        {
          heading: 'Limski-Kanal (25 Minuten nordwestlich)',
          body: 'Ein 12 km langer überfluteter Flusstal-Einschnitt, der wie ein norwegischer Fjord in die istrische Küste schneidet — eng, steilwandig, brackisch. Zwei Gründe, hinzufahren: die Austern, seit römischen Zeiten im Kanal gezüchtet und unter den besten der Adria, serviert in den kleinen Restaurants am Südufer (Viking und Fjord sind die Klassiker); und das Schwimmen, ruhig, windgeschützt und deutlich weniger besucht als die offene Küste. Die Piraten-Themen-Schilder sind Kitsch, das Essen ist tatsächlich gut. Kombinierbar mit einem Stopp im mittelalterlichen Sveti Lovreč auf dem Rückweg.',
        },
        {
          heading: 'Motovun (50 Minuten nördlich)',
          body: 'Ein Hügelort, schon aus der Ferne sichtbar — befestigte mittelalterliche Mauern, 500 Einwohner, umgeben von Eichenwald, der zu Europas reichsten weißen Trüffelvorkommen zählt. Parken am Fuß des Hügels (5 €/Tag in der Saison; der obere Parkplatz ist Anwohnern vorbehalten), dann zu Fuß die Kopfsteinpflaster-Rampe hinauf durch die zwei Stadttore. Die komplette Runde der mittelalterlichen Mauern dauert 25 Minuten und bietet einen 360°-Blick auf das zentrale Istrien — die wellige Weingegend südlich Richtung Buje, das Tal der Mirna unten, im Osten das Učka-Gebirge. Mittagessen oben: Konoba Mondo ist die berühmteste Adresse (Reservierung nötig, trüffellastige Karte), Pod Voltom die Wahl der Einheimischen. Das Motovun Film Festival Ende Juli verwandelt die Stadt in ein Open-Air-Kino; außerhalb dieser Woche bleibt es selbst im August ruhig.',
        },
        {
          heading: 'Pazin (35 Minuten östlich)',
          body: 'Das geografische und administrative Zentrum Istriens, von Touristen oft übersehen, die der Küste nachjagen — genau deshalb der Umweg lohnt. Die Burg Pazin ist die größte erhaltene Festung der Region (heute ethnografisches Museum) und steht dramatisch am Rand der Pazinska jama, einer Karstschlucht, in der der Fluss Pazinčica unter die Erde verschwindet. Jules Verne verlegte 1885 den Höhepunkt seines Romans Mathias Sandorf hierher. Das Höhlensystem unterhalb der Burg kann im Sommer auf einer 90-minütigen Führung besucht werden. Zum Mittagessen in Pazin ist Konoba Vela Vrata die sichere Wahl. Kombinierbar mit einem Stopp in Tinjan (10 Minuten südlich) für den berühmten istrischen Prosciutto — Tinjan-Schinken (pršut) ist Istriens bekanntester gepökelter Aufschnitt.',
        },
        {
          heading: 'Weitere kürzere Halbtagesausflüge',
          body: 'Bale (22 Minuten westlich) — ein winziges mittelalterliches Dorf mit einem perfekten Platz und ausgezeichneter Küche im Hotel La Grisa. Vodnjan (28 Minuten südwestlich) — drei mumifizierte Heilige in der Pfarrkirche und eine der besten Olivenölszenen Istriens. Fažana (40 Minuten südlich) — Anlegestelle nach Brijuni, mit charmantem Arbeitshafen und den besten Sardinen-Restaurants im Zentrum Istriens (Stara Konoba). Und Svetvinčenat selbst — der mittelalterliche Kaštel Morosini-Grimani liegt 300 Meter von der Villa entfernt und die meisten Gäste schauen nicht einmal hoch; der Innenhof ist im Sommer an den meisten Nachmittagen geöffnet, und auf dem Dorfplatz findet samstags vormittags ein kleiner Bauernmarkt statt.',
        },
      ],
      faq: [
        { q: 'Brauche ich für diese Tagesausflüge wirklich ein Auto?', a: 'Ja — der Tagesausflugsradius setzt einen Mietwagen voraus. Öffentliche Busse verbinden Svetvinčenat mit Pula und Rovinj, aber mit dünnem Fahrplan (4–5 pro Tag); ein Auto ermöglicht erst „in der Villa aufwachen, schwimmen, Tagesausflug, nochmal baden, Abendessen daheim".' },
        { q: 'Welcher Tagesausflug eignet sich am besten mit kleinen Kindern?', a: 'Die Brijuni-Inseln — Fahrradrunde, Safaripark-Tiere, kleine Touristenbahn und einfaches Schwimmen auf dem Rückweg in Fažana funktionieren bei unter 10-Jährigen gut. Limski-Kanal ist die zweite Wahl wegen ruhigem, flachem Wasser.' },
        { q: 'Wie früh muss ich Brijuni-Fähren-Tickets buchen?', a: 'Im Juli und August zwei bis drei Tage im Voraus; im Mai, Juni und September außerhalb von Wochenenden ist Same-Day in Ordnung. Direkt auf der Brijuni-Nationalpark-Website buchen, um den Zeitslot zu sichern.' },
        { q: 'Kann ich Motovun und Rovinj am selben Tag schaffen?', a: 'Möglich, aber gehetzt — beide verdienen jeweils 3–4 Stunden. Besser Motovun mit einem Stopp in Pazin oder mit Trüffelsuche im Mirna-Tal verbinden, und Rovinj als eigenen Abendausflug behandeln.' },
        { q: 'Ist Pula im Sommer überlaufen?', a: 'Im Juli und August, ja — Kreuzfahrtschiffe legen 2–3 mal pro Woche an, und die Arena-Schlange kann mittags 30 Minuten dauern. Vor 10:00 oder nach 16:00 vermeidet sowohl die Schlange als auch die Hitze auf den unbeschatteten Sitzreihen.' },
      ],
    },
  },
  {
    slug: 'istrian-wineries-near-svetvincenat',
    category: 'planning',
    datePublished: '2026-05-06',
    en: {
      title: 'Istrian wineries near Svetvinčenat — 6 producers worth the drive',
      excerpt: 'Six of Istria\'s most respected wineries within 60 minutes of Villa Ballena & Beluga — from a 15-minute Malvazija reference to the Momjan premium cluster — with booking notes, drive times, and what to taste at each.',
      intro: 'Istria has quietly become one of Europe\'s most interesting wine regions in the past fifteen years — Malvazija Istarska as the signature white, Teran as the regional red, and a small cluster of estates pushing both into international competition. The good news for guests at Villa Ballena & Beluga: most of the producers worth visiting are within an hour\'s drive, two are inside 30 minutes, and the rest cluster around Momjan and Umag where you can fit two visits into a single afternoon. This guide covers six estates we send guests to most often, sorted by drive time from the villa, with what to taste and how to book.',
      sections: [
        {
          heading: 'Matošević — Krunčići (15 minutes)',
          body: 'The closest serious winery to the villa — 15 minutes north on the D75 toward Sv. Lovreč. Antonio Mario Matošević built one of Istria\'s most respected Malvazija programmes here, with a tasting room cut into the hillside and views over the surrounding vineyards. Order the "Alba" Malvazija (steel, mineral, classical) and the "Grimalda" red blend (Merlot–Teran, oak-aged). Tastings are €25–40 per person depending on the flight; book at least 24 hours ahead via their website. Open Monday–Saturday, closed Sundays. The drive home through the rolling vineyards is itself part of the experience.',
        },
        {
          heading: 'Trapan — Šišan (25 minutes)',
          body: 'Bruno Trapan represents the modern, bottle-driven generation of Istrian winemakers — minimalist label design, single-vineyard expressions, restaurant lists across Croatia. The estate sits in Šišan, 8 km from Pula, surrounded by red-soil vineyards facing the Adriatic. Taste the "Uroboros" Malvazija (oak-aged, age-worthy) and the "Nigra Virgo" Teran. Tastings €25–35; book ahead. A natural pairing with a half-day in Pula — visit the Arena in the morning, lunch in the old town, drive 15 minutes south to Trapan in the afternoon.',
        },
        {
          heading: 'Clai — Krasica near Buzet (50 minutes)',
          body: 'Giorgio Clai is Istria\'s most prominent natural-wine producer — orange Malvazija made with extended skin contact, biodynamic vineyards, no commercial yeasts, no filtration. The cellar in Krasica (8 km from Buzet, deep in central-northern Istria) is small and the visits are personal. Try "Sveti Jakov" Malvazija (skin-contact, amber, complex) and "Ottocento Bianco" (white blend, oxidative). Reservations essential, often 1–2 weeks ahead in season. Best combined with a Motovun day trip — Clai is on the way back south.',
        },
        {
          heading: 'Kabola — Momjan (55 minutes)',
          body: 'The Markežić family produced the first Croatian wine awarded "Decanter" recognition. The estate sits high in Momjan, the chalk-hill area on the Slovenian border, and Kabola\'s Malvazija aged in clay amphorae underground for six months has become its calling card. Taste the "Amfora" Malvazija (orange, mineral, distinctive), the classical Malvazija for contrast, and the Muscat from Momjan (the local sweet variety). Tastings €30–50; reservations required. Combine with Kozlović 5 minutes away.',
        },
        {
          heading: 'Kozlović — Momjan (55 minutes)',
          body: 'The reference Momjan estate — Antonio Kozlović\'s family has farmed these slopes for generations, but the modern winery (built into the hillside, contemporary architecture) signals the shift to international quality. Taste "Santa Lucia" Malvazija (single-vineyard, oak-influenced) and the Momjan Muscat. The view from the panoramic tasting terrace over the Mirna river valley is the best of any winery in Istria — schedule the visit for late afternoon, into golden hour. Tastings €30–45; book ahead. Pair with Kabola for a Momjan double-bill.',
        },
        {
          heading: 'Coronica — Koreniki near Umag (60–70 minutes)',
          body: 'Moreno Coronica is widely considered the best Teran producer in Istria — his "Gran Teran" is the benchmark expression of the region\'s notoriously difficult red grape, aged in large oak for two years and built to age another twenty. The estate also produces an exemplary Malvazija and a small-production rosé. The drive is the longest on this list (a full hour, slightly more in coastal traffic), but for a Teran-focused tasting it\'s worth treating as its own afternoon. €30–40 per person; reservations essential. Pair with lunch in Umag or in the small village of Brtonigla on the way.',
        },
        {
          heading: 'Booking & logistics — applies to all visits',
          body: 'Every winery on this list requires advance booking (24 hours minimum, 1–2 weeks in season for the smaller estates). Walk-ins are not the culture here. Tastings typically run 60–90 minutes, include 4–6 wines and a light food pairing (cheese, prosciutto, olives), and cost €25–50 per person. Spit buckets are always provided — designate a driver, or take a Bolt/Uber from Pula if you plan to taste seriously. Most estates ship internationally for case orders. The villa fridge holds bottles fine, and most guests come back from a winery visit with a case for the rest of the stay.',
        },
      ],
      faq: [
        { q: 'Which winery is closest to the villa?', a: 'Matošević in Krunčići is 15 minutes north on the D75 toward Sv. Lovreč. The next closest is Trapan in Šišan, 25 minutes south near Pula.' },
        { q: 'Can I just turn up at a winery without booking?', a: 'No — every estate on this list requires a reservation, typically 24 hours minimum and 1–2 weeks in summer for the smaller producers (Clai, Kabola). Walk-ins are not the culture in Istria.' },
        { q: 'How much does a typical tasting cost?', a: '€25–50 per person, including 4–6 wines and a small food pairing of local cheese, prosciutto, and olives. Premium flights at Kozlović or Kabola can reach €60.' },
        { q: 'Is there a designated driver service?', a: 'Bolt and Uber operate in Pula and reach the inland wineries with advance booking. For groups of 4–8, we can also arrange a private driver through our network — email us at least 48 hours ahead.' },
        { q: 'What\'s the best Istrian wine to take home?', a: 'A bottle of Malvazija from Matošević or Kozlović for a wine-friend gift; an "Amfora" from Kabola or "Sveti Jakov" from Clai for someone who already drinks orange wine; a Coronica Gran Teran for a serious cellar.' },
        { q: 'Can I do two wineries in one afternoon?', a: 'Yes — Kabola and Kozlović are 5 minutes apart in Momjan, and Matošević and Trapan can be combined with a Pula day. Pace yourselves: 4–6 wines per estate adds up fast.' },
      ],
    },
    de: {
      title: 'Istrische Weingüter nahe Svetvinčenat — 6 Erzeuger, die die Fahrt wert sind',
      excerpt: 'Sechs der angesehensten Weingüter Istriens innerhalb 60 Minuten ab Villa Ballena & Beluga — vom 15-Minuten-Malvazija-Referenzgut bis zum Momjan-Premium-Cluster — mit Reservierungshinweisen, Fahrzeiten und was bei jedem zu probieren ist.',
      intro: 'Istrien hat sich in den letzten fünfzehn Jahren still und leise zu einer der spannendsten Weinregionen Europas entwickelt — Malvazija Istarska als Signature-Weiß, Teran als regionaler Rotwein und eine kleine Gruppe von Gütern, die beide international bekannt machen. Die gute Nachricht für Gäste der Villa Ballena & Beluga: Die meisten besuchenswerten Erzeuger liegen innerhalb einer Stunde Fahrt, zwei sogar unter 30 Minuten, und der Rest gruppiert sich um Momjan und Umag — dort lassen sich zwei Besuche an einem Nachmittag verbinden. Dieser Leitfaden behandelt sechs Güter, zu denen wir Gäste am häufigsten schicken, sortiert nach Fahrzeit ab der Villa, mit Verkostungs- und Buchungsempfehlungen.',
      sections: [
        {
          heading: 'Matošević — Krunčići (15 Minuten)',
          body: 'Das nächstgelegene ernsthafte Weingut zur Villa — 15 Minuten nördlich auf der D75 Richtung Sv. Lovreč. Antonio Mario Matošević hat hier eines der angesehensten Malvazija-Programme Istriens aufgebaut, mit einem in den Hang geschnittenen Verkostungsraum und Blick über die umgebenden Weinberge. Bestellen Sie die „Alba" Malvazija (Stahl, mineralisch, klassisch) und die „Grimalda" Rotcuvée (Merlot–Teran, im Holzfass gereift). Verkostungen 25–40 € pro Person je nach Flight; Reservierung mindestens 24 Stunden im Voraus über die Website. Montag–Samstag geöffnet, sonntags geschlossen. Die Rückfahrt durch die wellige Weinlandschaft gehört selbst zum Erlebnis.',
        },
        {
          heading: 'Trapan — Šišan (25 Minuten)',
          body: 'Bruno Trapan steht für die moderne, flaschenbetonte Generation istrischer Winzer — minimalistisches Label-Design, Einzellagen-Cuvées, Restaurantlisten in ganz Kroatien. Das Gut liegt in Šišan, 8 km von Pula entfernt, umgeben von roterdigen, zur Adria gerichteten Weinbergen. Probieren Sie „Uroboros" Malvazija (im Holzfass gereift, lagerfähig) und „Nigra Virgo" Teran. Verkostungen 25–35 €; Reservierung empfohlen. Natürlicher Halbtag-Kombi mit Pula — morgens die Arena, mittags Altstadt, nachmittags 15 Minuten südlich zu Trapan.',
        },
        {
          heading: 'Clai — Krasica bei Buzet (50 Minuten)',
          body: 'Giorgio Clai ist Istriens bekanntester Naturwein-Erzeuger — orange Malvazija mit langer Maischestandzeit, biodynamische Weinberge, keine Reinzuchthefen, unfiltriert. Der Keller in Krasica (8 km von Buzet, tief im zentralen Norden Istriens) ist klein und die Besuche persönlich. Probieren Sie „Sveti Jakov" Malvazija (Maischegärung, bernsteinfarben, komplex) und „Ottocento Bianco" (Weiß-Cuvée, oxidativ). Reservierung erforderlich, oft 1–2 Wochen im Voraus in der Saison. Am besten kombinierbar mit einem Motovun-Tagesausflug — Clai liegt auf dem Rückweg nach Süden.',
        },
        {
          heading: 'Kabola — Momjan (55 Minuten)',
          body: 'Die Familie Markežić produzierte den ersten kroatischen Wein mit „Decanter"-Auszeichnung. Das Gut liegt hoch in Momjan, im Kreidegebiet an der slowenischen Grenze, und Kabolas Malvazija, sechs Monate in unterirdischen Tonamphoren gereift, ist sein Markenzeichen. Probieren Sie „Amfora" Malvazija (orange, mineralisch, charakterstark), die klassische Malvazija als Vergleich und den Muscat aus Momjan (lokale süße Sorte). Verkostungen 30–50 €; Reservierung erforderlich. Kombinierbar mit Kozlović 5 Minuten entfernt.',
        },
        {
          heading: 'Kozlović — Momjan (55 Minuten)',
          body: 'Das Referenzgut Momjans — die Familie Antonio Kozlović bewirtschaftet diese Hänge seit Generationen, aber die moderne, in den Hang gebaute Kellerei (zeitgenössische Architektur) markiert den Schritt zu internationaler Spitzenqualität. Probieren Sie „Santa Lucia" Malvazija (Einzellage, Holzfass-Einfluss) und den Momjaner Muscat. Der Blick von der Panorama-Verkostungsterrasse über das Mirna-Tal ist der beste aller istrischen Weingüter — Termin auf den späten Nachmittag legen, in die goldene Stunde hinein. Verkostungen 30–45 €; Reservierung. Mit Kabola als Momjan-Doppel kombinieren.',
        },
        {
          heading: 'Coronica — Koreniki bei Umag (60–70 Minuten)',
          body: 'Moreno Coronica gilt als bester Teran-Erzeuger Istriens — sein „Gran Teran" ist der Maßstab dieser eigenwilligen regionalen Rebsorte, zwei Jahre in großen Holzfässern gereift und für weitere zwanzig Jahre Lagerung gebaut. Das Gut produziert auch eine vorbildliche Malvazija und einen Klein-Produktions-Rosé. Die Fahrt ist die längste dieser Liste (volle Stunde, etwas mehr bei Küstenverkehr), aber für eine Teran-fokussierte Verkostung lohnt sich das als eigener Nachmittag. 30–40 € pro Person; Reservierung erforderlich. Kombinierbar mit einem Mittagessen in Umag oder im kleinen Brtonigla auf dem Weg.',
        },
        {
          heading: 'Reservierung & Logistik — für alle Besuche',
          body: 'Jedes Weingut auf dieser Liste verlangt Voranmeldung (mindestens 24 Stunden, 1–2 Wochen in der Saison für die kleineren Güter). Walk-Ins sind hier nicht die Kultur. Verkostungen dauern in der Regel 60–90 Minuten, umfassen 4–6 Weine und eine kleine Speisepaarung (Käse, Prosciutto, Oliven) und kosten 25–50 € pro Person. Spuckgefäße werden immer gestellt — Fahrer bestimmen oder ein Bolt/Uber aus Pula nehmen, wenn ernsthaft probiert wird. Die meisten Güter versenden international auf Kistenebene. Der Villa-Kühlschrank fasst Flaschen bequem, und die meisten Gäste kommen mit einer Kiste für den Rest des Aufenthalts zurück.',
        },
      ],
      faq: [
        { q: 'Welches Weingut liegt am nächsten zur Villa?', a: 'Matošević in Krunčići, 15 Minuten nördlich auf der D75 Richtung Sv. Lovreč. Das nächstnähere ist Trapan in Šišan, 25 Minuten südlich nahe Pula.' },
        { q: 'Kann ich ohne Voranmeldung beim Weingut auftauchen?', a: 'Nein — jedes Gut auf dieser Liste verlangt Reservierung, typisch 24 Stunden im Voraus und 1–2 Wochen im Sommer für die kleineren Erzeuger (Clai, Kabola). Walk-Ins sind in Istrien nicht üblich.' },
        { q: 'Was kostet eine typische Verkostung?', a: '25–50 € pro Person, einschließlich 4–6 Weine und einer kleinen Speisepaarung mit lokalem Käse, Prosciutto und Oliven. Premium-Flights bei Kozlović oder Kabola können 60 € erreichen.' },
        { q: 'Gibt es einen Fahrerservice?', a: 'Bolt und Uber sind in Pula verfügbar und erreichen die Hinterland-Güter mit Vorbestellung. Für Gruppen von 4–8 organisieren wir auch einen privaten Fahrer über unser Netzwerk — mindestens 48 Stunden im Voraus per E-Mail.' },
        { q: 'Welcher istrische Wein eignet sich am besten als Mitbringsel?', a: 'Eine Flasche Malvazija von Matošević oder Kozlović als Wein-Geschenk; ein „Amfora" von Kabola oder „Sveti Jakov" von Clai für jemanden, der bereits Orange-Wein trinkt; ein Coronica Gran Teran für einen ernsthaften Keller.' },
        { q: 'Kann ich zwei Weingüter an einem Nachmittag schaffen?', a: 'Ja — Kabola und Kozlović liegen 5 Minuten auseinander in Momjan, und Matošević + Trapan lassen sich mit einem Pula-Tag verbinden. Pacing wichtig: 4–6 Weine pro Gut summieren sich schnell.' },
      ],
    },
  },
  {
    slug: 'truffle-hunting-near-svetvincenat',
    category: 'events',
    datePublished: '2026-05-13',
    hero: {
      src: '/images/guides/truffle-hunting/hunt-motovun-forest.webp',
      alt: {
        en: 'A handful of black summer truffles cradled in a forager\'s earth-stained hand inside the Motovun oak forest, central Istria',
        de: 'Eine Handvoll schwarzer Sommertrüffel in der erdverschmierten Hand eines Suchers im Eichenwald von Motovun, Zentralistrien',
      },
      width: 1408,
      height: 768,
    },
    inlineImage: {
      afterSectionIndex: 4,
      image: {
        src: '/images/guides/truffle-hunting/tasting-istrian-stone-courtyard.webp',
        alt: {
          en: 'Black truffles arranged with garlic, rosemary and thyme on a rustic wooden board in a stone Istrian courtyard, ready for a post-hunt tasting',
          de: 'Schwarze Trüffel mit Knoblauch, Rosmarin und Thymian auf einem rustikalen Holzbrett in einem istrischen Steinhof, bereit für die Verkostung nach der Trüffeljagd',
        },
        width: 1408,
        height: 768,
      },
    },
    en: {
      title: 'Truffle hunting near Svetvinčenat — joining a real hunt in the Motovun forest',
      excerpt: 'The Motovun-Buzet truffle country is 45–55 minutes from Villa Ballena & Beluga. Here are the three family operators we send guests to for an authentic hunt with Lagotto dogs, which season catches which truffle, and how to time your visit around the Subotina festival in early September.',
      intro: 'The Motovun forest (Motovunska šuma) is one of Europe\'s few remaining native habitats for the white truffle (Tuber magnatum pico) — the same species harvested in Piedmont and worth more by weight than gold at peak season. The hunt itself is a quiet, slow walk through oak forest with a trained Lagotto Romagnolo dog leading; the host explains the soil, the season, and the technique while the dog works. Three family operators within an hour of the villa run hunts in English, and most also in German. This guide covers each, the truffle calendar so you book in the right month, what actually happens on a hunt, and the Buzet festival weekends if you can time your stay around early September.',
      sections: [
        {
          heading: 'The truffle calendar — when to go (and which truffle)',
          body: 'Istria yields four edible truffle species across the year, but two matter for visitors. White truffle (Tuber magnatum pico) is the prize — strongly aromatic, only ever served raw, with a season that runs late September through January and October–November as the most reliable weeks. Summer black truffle (Tuber aestivum) runs May to August — milder, more affordable, easier to find, and a fully legitimate experience if an autumn visit isn\'t possible. Winter black (Tuber brumale, smaller crop) overlaps with white in December–January. Operators schedule hunts year-round, but white-truffle weekends book out 4–6 weeks ahead. If a hunt is on your shortlist, fix the dates first and slot the rest of the holiday around them.',
        },
        {
          heading: 'Karlić Tartufi — Paladini (45 minutes)',
          body: 'The Karlić family has been hunting truffles in the forests above Buzet since the 1960s and runs what is widely regarded as the most authentic experience in the region — a working family operation, not a tourism factory. Hunts depart from their farm in Paladini, head into oak forest with two or three Lagotto dogs, and last around two hours. Back at the farm, Marina or Radmila walks you through a tasting: scrambled eggs with shaved truffle, truffled cheese, prosciutto, their own olive oil and grappa. Hunt + tasting from €80–110 per person; a premium chef\'s-lunch tier reaches €160. English-speaking guides standard, German on request. Book at least one week ahead in summer and at least four weeks ahead for white-truffle weekends.',
        },
        {
          heading: 'Zigante Tartufi — Livade (50 minutes)',
          body: 'Giancarlo Zigante is the man who pulled a 1.31 kg white truffle out of the Motovun forest in 1999 — a Guinness record at the time — and built it into central Istria\'s most visible truffle brand. The Livade headquarters has a tasting shop, a fine-dining restaurant, and runs hunts daily in season with their own trainer and dogs. The experience is more polished and more commercial than Karlić, with cleaner facilities and a broader international guest profile, but the hunt itself is real and the dogs work the same forest. Hunt + tasting from €75–95 per person; the restaurant-pairing tier with a multi-course truffle menu sits at €130–180. Online booking; English, German, and Italian guides routinely available.',
        },
        {
          heading: 'Prodan Tartufi — Buzet hills (55 minutes)',
          body: 'The smallest of the three and the most intimate — Ivan Prodan typically takes one family or one couple at a time, with two of his Lagottos, into a quieter stretch of forest above Buzet. The hunt is unhurried (closer to three hours including the tasting), the tasting is whatever Ivan\'s wife has cooked that morning, and the conversation tends to drift into how truffle prices have moved over the past decade and what the dogs cost to train. Hunt + tasting from €90–130 per person. English fluent, German basic. Booking by phone or email 2–3 weeks ahead is the norm; the operation does not over-book itself.',
        },
        {
          heading: 'What actually happens on a hunt',
          body: 'Expect comfortable forest-walk clothing (long trousers and closed shoes — the underbrush bites in summer, autumn mornings are cool and damp), a 1.5–3 km loop through oak forest, and a guide who has worked this exact patch for years. The dogs scent a truffle, signal it, then dig at the spot — the guide steps in and finishes the excavation by hand to protect both the truffle and the dog\'s claws. A successful hunt yields one to three truffles in a normal session; in shoulder seasons the dogs sometimes draw a blank, but the experience and tasting always run regardless. The tasting back at the farm is the second half of the value — fresh shaved truffle over scrambled eggs is the regional benchmark dish and worth the trip on its own.',
        },
        {
          heading: 'Buzet truffle festivals — early September into October',
          body: 'Buzet positions itself as Croatia\'s truffle capital, and the September–October festival cycle is the best concentration of food, music, and producer stalls on the calendar. The headline event is Subotina po starinski on the second Saturday of September, when the town fries a 2,500-egg truffle omelette in a 2-metre pan in the main square — visually absurd, free to taste, and reliably one of the photogenic moments of an Istrian autumn. Tuberfest runs across the following four weekends in Buzet and Livade, with smaller producer markets, music, and tasting menus across local restaurants. If you can route a stay through the second weekend of September, this is the single best week to be in central Istria.',
        },
        {
          heading: 'Booking & logistics',
          body: 'All three operators require advance booking — the same minimums as winery visits, with the caveat that white-truffle weekends (mid-October to mid-November) book 4–6 weeks ahead. Hunts run rain or shine; cancellation policies vary, so confirm at booking. Drive yourselves — every operator has on-site parking — or pre-book a private driver through us; the trip home after a tasting that includes grappa is no joke. Plan a half-day: leaving the villa at 09:30 lands you back by 14:30. Most guests pair the hunt with a slow afternoon in Motovun (the truffle-country hilltop town, 25 minutes from each operator) and dinner at one of the konobas there before heading home.',
        },
      ],
      faq: [
        { q: 'When is truffle season in Istria?', a: 'White truffle runs late September through January, peaking October–November. Summer black runs May to August. Winter black overlaps with white in December–January. Hunts operate year-round, but white-truffle weekends book out 4–6 weeks ahead.' },
        { q: 'Are the truffle dogs treated well?', a: 'The Lagotto Romagnolo is the only breed bred specifically for truffle hunting, and at every operator on this list the dogs are family pets that sleep in the house, not working animals in kennels. The hunts themselves are short — under two hours of actual scenting work — and the dogs visibly enjoy them.' },
        { q: 'Can children join a hunt?', a: 'Yes — the operators take families regularly. Children 8+ usually love the dog work; under 5 may find the forest walk long. Pricing for children is typically 50 % off at Karlić and Prodan, around €30–40 at Zigante. Confirm at booking.' },
        { q: 'How much does a hunt cost per person?', a: '€75–130 per person for the standard hunt + tasting at all three operators. Premium chef-lunch upgrades at Karlić and Zigante reach €150–180. Children are usually half price.' },
        { q: 'Do I need to drive, or can a transfer be arranged?', a: 'Both work. The operators have free parking and the drive to Paladini, Livade, or Buzet is straightforward. For groups of four or more, or if your tasting includes grappa, we can arrange a private driver — email us at least 48 hours ahead.' },
        { q: 'What is the difference between white and black truffles?', a: 'White truffle is the rarer and more aromatic species, only ever served raw and shaved at the table, with wholesale prices of €2,000–4,000 per kilo at peak. Summer black is milder, holds heat better (it can be cooked into pasta or risotto), and costs roughly a tenth of white. For the hunt experience both are equally enjoyable; for a culinary highlight, white in October–November is the once-in-a-lifetime expression.' },
      ],
    },
    de: {
      title: 'Trüffelsuche nahe Svetvinčenat — eine echte Jagd im Wald von Motovun',
      excerpt: 'Das Trüffelgebiet rund um Motovun und Buzet liegt 45–55 Minuten von Villa Ballena & Beluga entfernt. Hier sind die drei Familienbetriebe, zu denen wir Gäste für eine authentische Trüffelsuche mit Lagotto-Hunden schicken — welche Saison welchen Trüffel bringt und wie Sie Ihren Besuch um das Subotina-Fest Anfang September planen.',
      intro: 'Der Wald von Motovun (Motovunska šuma) ist einer der wenigen verbliebenen natürlichen Lebensräume Europas für den weißen Trüffel (Tuber magnatum pico) — derselben Art, die im Piemont geerntet wird und in der Hochsaison gewichtsmäßig mehr wert ist als Gold. Die Jagd selbst ist ein ruhiger, langsamer Spaziergang durch Eichenwald; ein ausgebildeter Lagotto Romagnolo führt, der Gastgeber erklärt Boden, Saison und Technik. Drei Familienbetriebe innerhalb einer Stunde Fahrt von der Villa bieten Jagden auf Englisch an, die meisten auch auf Deutsch. Dieser Leitfaden geht durch alle drei, den Trüffelkalender für die richtige Monatswahl, den Ablauf einer typischen Jagd und die Buzet-Festwochenenden Anfang September.',
      sections: [
        {
          heading: 'Trüffelkalender — wann hingehen (und welcher Trüffel)',
          body: 'In Istrien gedeihen vier essbare Trüffelarten übers Jahr, aber zwei sind für Besucher relevant. Weißer Trüffel (Tuber magnatum pico) ist der Königstrüffel — intensiv aromatisch, ausschließlich roh serviert; Saison von Ende September bis Januar mit Oktober–November als verlässlichster Phase. Sommer-Schwarztrüffel (Tuber aestivum) läuft von Mai bis August — milder, günstiger, leichter zu finden und ein vollwertiges Erlebnis, wenn ein Herbstbesuch nicht möglich ist. Winter-Schwarztrüffel (Tuber brumale, kleinere Ernte) überlappt mit dem weißen Trüffel im Dezember–Januar. Jagden laufen ganzjährig, aber Weißtrüffel-Wochenenden sind 4–6 Wochen im Voraus ausgebucht. Wenn eine Jagd auf Ihrer Wunschliste steht, fixieren Sie zuerst die Termine und planen Sie den Rest des Urlaubs darum herum.',
        },
        {
          heading: 'Karlić Tartufi — Paladini (45 Minuten)',
          body: 'Die Familie Karlić jagt seit den 1960er Jahren Trüffel in den Wäldern oberhalb Buzets und betreibt das, was weithin als authentischstes Erlebnis der Region gilt — ein arbeitender Familienbetrieb, keine Tourismusfabrik. Die Jagden starten am Hof in Paladini, führen mit zwei bis drei Lagotto-Hunden in den Eichenwald und dauern etwa zwei Stunden. Zurück am Hof führt Marina oder Radmila durch die Verkostung: Rührei mit gehobeltem Trüffel, Trüffelkäse, Prosciutto, hauseigenes Olivenöl und Grappa. Jagd + Verkostung 80–110 € pro Person; eine Premium-Stufe mit Chefmenü erreicht 160 €. Englischsprachige Guides Standard, Deutsch auf Anfrage. Mindestens eine Woche im Voraus im Sommer, mindestens vier Wochen im Voraus für Weißtrüffel-Wochenenden buchen.',
        },
        {
          heading: 'Zigante Tartufi — Livade (50 Minuten)',
          body: 'Giancarlo Zigante ist der Mann, der 1999 einen 1,31 kg schweren weißen Trüffel aus dem Wald von Motovun zog — damals ein Guinness-Rekord — und daraus die sichtbarste Trüffelmarke Zentralistriens aufbaute. Der Hauptsitz in Livade hat einen Verkostungsshop, ein Restaurant der gehobenen Küche und führt in der Saison täglich Jagden mit eigenem Trainer und Hunden durch. Das Erlebnis ist polierter und kommerzieller als bei Karlić, mit modernen Anlagen und einem breiteren internationalen Gästeprofil, aber die Jagd selbst ist echt und die Hunde arbeiten denselben Wald. Jagd + Verkostung 75–95 € pro Person; Restaurant-Pairing-Stufe mit mehrgängigem Trüffelmenü liegt bei 130–180 €. Online buchbar; englisch-, deutsch- und italienischsprachige Guides regelmäßig verfügbar.',
        },
        {
          heading: 'Prodan Tartufi — Hügel über Buzet (55 Minuten)',
          body: 'Der kleinste der drei Betriebe und der persönlichste — Ivan Prodan begleitet typischerweise eine Familie oder ein Paar gleichzeitig, mit zwei seiner Lagottos, in einen ruhigeren Waldstrich oberhalb Buzets. Die Jagd ist unaufgeregt (eher drei Stunden inklusive Verkostung), die Verkostung ist, was Ivans Frau am Morgen gekocht hat, und das Gespräch driftet meist dahin, wie sich Trüffelpreise im letzten Jahrzehnt entwickelt haben und was die Ausbildung der Hunde kostet. Jagd + Verkostung 90–130 € pro Person. Englisch fließend, Deutsch grundlegend. Buchung per Telefon oder E-Mail 2–3 Wochen im Voraus ist üblich; der Betrieb bucht sich nicht über.',
        },
        {
          heading: 'Was bei einer Jagd tatsächlich passiert',
          body: 'Erwartet werden bequeme Waldspaziergangs-Kleidung (lange Hosen und feste Schuhe — das Unterholz beißt im Sommer, Herbstmorgen sind kühl und feucht), eine 1,5–3 km lange Runde durch Eichenwald und ein Guide, der genau diesen Waldstrich seit Jahren kennt. Die Hunde wittern einen Trüffel, zeigen ihn an und graben an der Stelle — der Guide übernimmt die Ausgrabung von Hand, um Trüffel und Hundekrallen zu schonen. Eine erfolgreiche Jagd bringt ein bis drei Trüffel in einer normalen Sitzung; in der Nebensaison kommen die Hunde manchmal mit leeren Pfoten zurück, aber Erlebnis und Verkostung finden in jedem Fall statt. Die Verkostung am Hof ist die zweite Hälfte des Werts — frisch gehobelter Trüffel über Rührei ist das regionale Referenzgericht und allein die Fahrt wert.',
        },
        {
          heading: 'Buzet-Trüffelfeste — Anfang September bis Oktober',
          body: 'Buzet positioniert sich als kroatische Trüffelhauptstadt, und der September–Oktober-Festkalender ist die beste Konzentration aus Essen, Musik und Produzentenständen im Jahr. Das Hauptereignis ist Subotina po starinski am zweiten Samstag im September, wenn die Stadt ein 2.500-Eier-Trüffelomelett in einer 2-Meter-Pfanne auf dem Hauptplatz brät — visuell absurd, kostenlos zu verkosten und verlässlich einer der fotogensten Momente eines istrischen Herbstes. Tuberfest läuft an den folgenden vier Wochenenden in Buzet und Livade, mit kleineren Produzentenmärkten, Musik und Verkostungsmenüs in lokalen Restaurants. Wer einen Aufenthalt um das zweite Septemberwochenende legen kann, hat die beste Woche, um in Zentralistrien zu sein.',
        },
        {
          heading: 'Reservierung & Logistik',
          body: 'Alle drei Betriebe verlangen Voranmeldung — gleiche Mindestvorlauf wie bei Weingutbesuchen, mit der Einschränkung, dass Weißtrüffel-Wochenenden (Mitte Oktober bis Mitte November) 4–6 Wochen im Voraus ausgebucht sind. Jagden finden bei jedem Wetter statt; Stornierungsregeln variieren, also bei Buchung klären. Selbst fahren — alle Betriebe haben Parkplätze vor Ort — oder vorab einen privaten Fahrer über uns buchen; die Heimfahrt nach einer Verkostung mit Grappa ist nicht trivial. Halbtag einplanen: Abfahrt um 09:30 von der Villa, Rückkehr gegen 14:30. Die meisten Gäste verbinden die Jagd mit einem ruhigen Nachmittag in Motovun (das Trüffel-Hügelstädtchen, 25 Minuten von jedem Betrieb entfernt) und Abendessen in einer der dortigen Konobas, bevor sie zurückfahren.',
        },
      ],
      faq: [
        { q: 'Wann ist Trüffelsaison in Istrien?', a: 'Weißer Trüffel: Ende September bis Januar, Höhepunkt Oktober–November. Sommer-Schwarz: Mai bis August. Winter-Schwarz: Dezember–Januar, überlappt mit Weiß. Jagden laufen ganzjährig, aber Weißtrüffel-Wochenenden sind 4–6 Wochen im Voraus ausgebucht.' },
        { q: 'Werden die Trüffelhunde artgerecht gehalten?', a: 'Der Lagotto Romagnolo ist die einzige speziell für die Trüffeljagd gezüchtete Rasse, und bei allen Betrieben dieser Liste sind die Hunde Familienmitglieder, die im Haus schlafen — keine Arbeitstiere in Zwingern. Die Jagden selbst sind kurz, unter zwei Stunden tatsächliche Witterarbeit, und die Hunde zeigen sichtbare Freude daran.' },
        { q: 'Können Kinder bei einer Jagd dabei sein?', a: 'Ja — die Betriebe nehmen regelmäßig Familien an. Kinder ab 8 sind meist begeistert von der Hundearbeit; unter 5 finden den Waldspaziergang lang. Kinderpreis typischerweise 50 % bei Karlić und Prodan, 30–40 € bei Zigante. Bei Buchung bestätigen.' },
        { q: 'Was kostet eine Jagd pro Person?', a: '75–130 € pro Person für die Standard-Jagd + Verkostung bei allen drei Betrieben. Premium-Chefmenü-Upgrades bei Karlić und Zigante erreichen 150–180 €. Kinder meist zum halben Preis.' },
        { q: 'Muss ich selbst fahren, oder kann ein Transfer organisiert werden?', a: 'Beides geht. Die Betriebe haben kostenlose Parkplätze, und die Anfahrt nach Paladini, Livade oder Buzet ist unkompliziert. Für Gruppen ab vier Personen oder wenn die Verkostung Grappa beinhaltet, organisieren wir einen privaten Fahrer — mindestens 48 Stunden im Voraus per E-Mail.' },
        { q: 'Was ist der Unterschied zwischen weißem und schwarzem Trüffel?', a: 'Der weiße Trüffel ist die seltenere und aromatischere Art, ausschließlich roh am Tisch gehobelt serviert, mit Großhandelspreisen von 2.000–4.000 € pro Kilo zur Hochsaison. Sommer-Schwarz ist milder, hitzestabiler (kann in Pasta oder Risotto verarbeitet werden) und kostet etwa ein Zehntel des weißen. Für ein Jagderlebnis sind beide gleich schön; für ein kulinarisches Highlight ist Weiß im Oktober–November der Einmal-im-Leben-Ausdruck.' },
      ],
    },
  },
  {
    slug: 'restaurants-central-istria',
    category: 'planning',
    datePublished: '2026-05-15',
    hero: {
      src: '/images/guides/restaurants-central-istria/istrian-stone-courtyard-dinner-dusk.webp',
      alt: {
        en: 'A long candlelit dinner table set under a vine pergola in a stone Istrian hamlet courtyard at dusk, central Istria',
        de: 'Eine lange, kerzenbeleuchtete Tafel unter einer Weinpergola in einem istrischen Steinhof in der Abenddämmerung, Zentralistrien',
      },
      width: 1024,
      height: 683,
    },
    inlineImage: {
      afterSectionIndex: 3,
      image: {
        src: '/images/guides/restaurants-central-istria/istrian-antipasti-octopus-carpaccio.webp',
        alt: {
          en: 'An Istrian table laid with octopus carpaccio, antipasti, fresh bread and a glass of Malvazija white wine',
          de: 'Ein istrischer Tisch mit Oktopus-Carpaccio, Antipasti, frischem Brot und einem Glas Malvazija-Weißwein',
        },
        width: 1920,
        height: 1006,
      },
    },
    en: {
      title: 'Restaurants in central Istria — konobas, agroturizam and truffle tables near Svetvinčenat',
      excerpt: 'Where to eat in green inland Istria — six restaurants within an hour of Villa Ballena & Beluga, from a family agroturizam 30 minutes away to the Slow Food legend of Konoba Toklarija, with what to order, how to book, and which sight to build the day around.',
      intro: 'Most visitors picture Istria as a coastline — Rovinj, Poreč, the seafood restaurants along the water. The interior is a different country: green hills, medieval towns stacked on hilltops, oak forest, vineyards and olive groves, and a cooking tradition that has nothing to do with the sea. Central Istria eats boškarin (the indigenous white ox), game, wild asparagus, truffles, hand-rolled fuži pasta and maneštra — the regional minestrone — cooked slowly in family konobas and on working farms. For guests at Villa Ballena & Beluga the best of it is within an hour\'s drive, and the closest is barely thirty minutes away. This guide covers six tables we send guests to, sorted by drive time, with what to order, how to book, and which sight to build the day around.',
      sections: [
        {
          heading: 'Konoba, agroturizam, fine dining — how central Istria eats',
          body: 'Three kinds of place serve food in inland Istria, and the names matter when you book. A konoba is a rustic family tavern — the regional default, usually a single dining room and a terrace, a short handwritten menu, the family in the kitchen. An agroturizam is a working farm licensed to serve meals: you eat what the farm grows and raises, at long shared tables, often with the animals and vegetable garden in view. Fine dining exists but is rare — a handful of white-tablecloth kitchens, mostly built around truffles. Across all three the cooking is inland and seasonal: boškarin (the indigenous Istrian ox), autumn game, spring wild asparagus, truffles, hand-rolled fuži pasta, maneštra (the Istrian minestrone), ombolo and sausages off the open hearth. Portions are generous, lunches are long, and almost nowhere reliably takes walk-ins in summer.',
        },
        {
          heading: 'Agroturizam Ograde — Lindar near Pazin (30 minutes)',
          body: 'The closest of our recommendations and the table we send families to first. Ograde is a working farm near Lindar, in the hills above Pazin — they raise their own animals, grow their own vegetables and press their own olive oil, and the menu is simply whatever is in season. Long wooden tables, a garden, farm animals the children can visit between courses. Order the antipasti board to start (the farm\'s own prosciutto, cheese, sausages and pickled vegetables), then fuži with game or truffles and a bowl of maneštra. Expect roughly €25–40 per person with house wine. Open for lunch and dinner; book a day ahead, more in August. It pairs naturally with Pazin — the castle and the Pazin Cave, the river chasm that gave Jules Verne the setting for a novel.',
        },
        {
          heading: 'Konoba Mondo — Motovun (45 minutes)',
          body: 'Just below Motovun\'s main gate, Mondo is the truffle konoba the guidebooks send you to — and it earns the listing. A small dining room, a handful of outdoor tables under the trees, and a kitchen that works truffle into almost everything in season. Order the truffle steak, the fuži with truffles, or the truffle-and-cheese starter; through the autumn white-truffle weeks the fresh-shaved supplements are worth the splurge. Mains run €15–28, truffle dishes higher. Reservations are essential in summer and right through truffle season — see our separate truffle-hunting guide for why October and November are the peak. Pair the meal with a slow walk around Motovun\'s ramparts.',
        },
        {
          heading: 'Konoba Pod Voltom — Motovun (45 minutes)',
          body: 'Inside the town walls, tucked under the vaulted gate that gives it its name — "under the arch" — Pod Voltom is the traditional counterpoint to Mondo. The same hilltop, a more classic Istrian menu, and terrace tables looking down the Mirna valley. Hand-rolled pasta, Istrian steak, seasonal game, and an honest local wine list heavy on Malvazija and Teran. Mains €14–24. It is the easy choice if you are already up in Motovun for the walls, or on the way back from the wineries around Momjan — see our wineries guide. Book ahead for a terrace table near sunset; the view is the reason to be there.',
        },
        {
          heading: 'Restaurant Zigante — Livade (50 minutes)',
          body: 'The fine-dining table of central Istria, attached to the Zigante truffle house in Livade. White tablecloths, a deep wine cellar, and a tasting menu built entirely around truffles and the season\'s Istrian produce. This is the special-occasion choice — an anniversary, a milestone dinner — and the kitchen has held that standard for two decades. À la carte mains run €30–55; the multi-course truffle tasting menu is roughly €90–140 with wine pairings. Reserve well ahead. Livade is also where the Zigante truffle hunts depart, so a morning hunt followed by lunch here is the natural itinerary — our truffle-hunting guide has the booking detail.',
        },
        {
          heading: 'Konoba Dolina — Gradinje near Livade (50 minutes)',
          body: 'A short drive on from Livade, in the hamlet of Gradinje, Dolina is the konoba locals name when you ask where to eat truffles without the fine-dining markup. Family-run, unfussy, with a terrace under the trees. The fuži with truffles and the truffle-topped steak are the dishes to order, but the homemade pasta and the Istrian antipasti hold their own without truffle at all. Mains €15–26. Book ahead, especially at weekends and right through the autumn season, when the truffle crowd fills both the inland konobas and the tables in Livade.',
        },
        {
          heading: 'Konoba Toklarija — Sovišćina near Buzet (55 minutes)',
          body: 'The one that needs a paragraph of warning before the praise. Toklarija, in a 14th-century house in the tiny hamlet of Sovišćina, is run by Nevio Sirotić as something close to a Slow Food shrine — there is no menu, no choosing, and no rushing. You sit down, and you are fed whatever Nevio has decided to cook that day, usually built around boškarin and the season, across many small courses that can run three or four hours. It is not cheap — budget €80–130 per person before wine — and it is no place for a hungry toddler. But for two people who want the single most characterful long lunch in inland Istria, nothing else on this list comes close. Reserve by phone, several days ahead, and clear the whole afternoon.',
        },
        {
          heading: 'Booking, timing & getting there',
          body: 'Reserve everything — central Istria runs on reservations, and in July and August the good tables are gone by mid-morning. Lunch is the regional main event: many konobas open around noon, a long lunch from 13:00 is the local rhythm, and some smaller places close between services or do not serve dinner at all, so confirm hours when you book. Drive yourselves — every restaurant here has parking — but if the meal will include the local rakija or a serious wine list, designate a driver or pre-book one through us at least 48 hours ahead. Each of these tables pairs naturally with a sight: Ograde with Pazin\'s castle and cave, Mondo and Pod Voltom with Motovun\'s walls, Zigante and Dolina with a truffle hunt, Toklarija with a slow afternoon in the Buzet hills. Tell us what you would like to do and we will help you build the day around the table.',
        },
      ],
      faq: [
        { q: 'Which restaurant is closest to the villa?', a: 'Agroturizam Ograde, near Lindar above Pazin, is about 30 minutes away — the closest of our recommendations. The rest cluster around Motovun (45 minutes) and Livade and Buzet (50–55 minutes).' },
        { q: 'Do I need to book a table in advance?', a: 'Yes. Central Istria runs on reservations and in July and August the good tables are gone by mid-morning. Toklarija and Restaurant Zigante need several days\' notice; a konoba a day ahead is usually enough outside peak season.' },
        { q: 'Where should we go to eat truffles?', a: 'Konoba Mondo in Motovun or Konoba Dolina near Livade for konoba-style truffle dishes at fair prices; Restaurant Zigante in Livade for the fine-dining truffle tasting menu. October and November are the white-truffle peak — our truffle-hunting guide covers the season in detail.' },
        { q: 'Which restaurant is best for families with children?', a: 'Agroturizam Ograde — a working farm with animals to visit, a garden, long shared tables and a relaxed pace. Toklarija and Restaurant Zigante are adult, special-occasion meals and a poor fit for young children.' },
        { q: 'How much does a meal cost?', a: 'Konoba mains run €14–28; a farm lunch at an agroturizam with house wine is roughly €25–40 per person; fine dining and tasting menus run €90–140 per person. Truffle dishes carry a premium and are highest through the autumn season.' },
        { q: 'Is lunch or dinner the better choice?', a: 'Lunch. It is the regional main event, and some smaller konobas do not serve dinner or close in the late afternoon. Book a long lunch from around 13:00 and leave the afternoon open.' },
      ],
    },
    de: {
      title: 'Restaurants in Zentralistrien — Konobas, Agrotourismus und Trüffeltische nahe Svetvinčenat',
      excerpt: 'Wo man im grünen Inneren Istriens isst — sechs Restaurants innerhalb einer Stunde ab Villa Ballena & Beluga, vom familiären Agrotourismus 30 Minuten entfernt bis zur Slow-Food-Legende Konoba Toklarija, mit Bestellempfehlungen, Reservierungshinweisen und welcher Sehenswürdigkeit man den Tag widmet.',
      intro: 'Die meisten Besucher stellen sich Istrien als Küste vor — Rovinj, Poreč, die Fischrestaurants am Wasser. Das Landesinnere ist ein anderes Land: grüne Hügel, mittelalterliche Städte auf Hügelkuppen, Eichenwald, Weinberge und Olivenhaine — und eine Kochtradition, die nichts mit dem Meer zu tun hat. Zentralistrien isst Boškarin (das einheimische weiße Rind), Wild, wilden Spargel, Trüffel, handgerollte Fuži-Nudeln und Maneštra — die regionale Minestrone — langsam gegart in Familien-Konobas und auf arbeitenden Bauernhöfen. Für Gäste der Villa Ballena & Beluga liegt das Beste davon innerhalb einer Stunde Fahrt, und das Nächstgelegene kaum dreißig Minuten entfernt. Dieser Leitfaden behandelt sechs Tische, zu denen wir Gäste schicken, sortiert nach Fahrzeit, mit Bestellempfehlungen, Reservierungshinweisen und welcher Sehenswürdigkeit man den Tag widmet.',
      sections: [
        {
          heading: 'Konoba, Agrotourismus, gehobene Küche — wie Zentralistrien isst',
          body: 'Drei Arten von Lokalen servieren Essen im Inneren Istriens, und die Bezeichnungen sind bei der Reservierung wichtig. Eine Konoba ist eine rustikale Familientaverne — der regionale Standard, meist ein einzelner Gastraum mit Terrasse, eine kurze handgeschriebene Karte, die Familie in der Küche. Ein Agrotourismus ist ein arbeitender Bauernhof mit Bewirtungslizenz: Man isst, was der Hof anbaut und hält, an langen gemeinsamen Tischen, oft mit Blick auf die Tiere und den Gemüsegarten. Gehobene Küche gibt es, ist aber selten — eine Handvoll Tischtuch-Küchen, meist um den Trüffel herum aufgebaut. In allen drei ist die Küche binnenländisch und saisonal: Boškarin (das einheimische istrische Rind), Herbstwild, wilder Spargel im Frühling, Trüffel, handgerollte Fuži-Nudeln, Maneštra (die istrische Minestrone), Ombolo und Würste vom offenen Herd. Die Portionen sind großzügig, die Mittagessen lang, und kaum irgendwo werden im Sommer verlässlich Gäste ohne Reservierung angenommen.',
        },
        {
          heading: 'Agroturizam Ograde — Lindar bei Pazin (30 Minuten)',
          body: 'Die nächstgelegene unserer Empfehlungen und der Tisch, zu dem wir Familien zuerst schicken. Ograde ist ein arbeitender Bauernhof bei Lindar, in den Hügeln oberhalb von Pazin — die Familie hält eigene Tiere, baut eigenes Gemüse an und presst eigenes Olivenöl, und die Karte ist schlicht, was gerade Saison hat. Lange Holztische, ein Garten, Hoftiere, die die Kinder zwischen den Gängen besuchen können. Als Vorspeise das Antipasti-Brett bestellen (hofeigener Prosciutto, Käse, Würste und eingelegtes Gemüse), dann Fuži mit Wild oder Trüffel und eine Schale Maneštra. Rechnen Sie mit etwa 25–40 € pro Person inklusive Hauswein. Mittags und abends geöffnet; einen Tag im Voraus reservieren, im August früher. Lässt sich gut mit Pazin verbinden — der Burg und der Pazin-Höhle, der Flussschlucht, die Jules Verne den Schauplatz für einen Roman lieferte.',
        },
        {
          heading: 'Konoba Mondo — Motovun (45 Minuten)',
          body: 'Direkt unterhalb des Haupttors von Motovun ist Mondo die Trüffel-Konoba, zu der die Reiseführer schicken — und der Eintrag ist verdient. Ein kleiner Gastraum, eine Handvoll Tische im Freien unter den Bäumen und eine Küche, die in der Saison Trüffel in fast alles einarbeitet. Bestellen Sie das Trüffelsteak, die Fuži mit Trüffel oder die Trüffel-Käse-Vorspeise; in den herbstlichen Weißtrüffel-Wochen lohnt sich der Aufschlag für frisch gehobelte Trüffel. Hauptgerichte 15–28 €, Trüffelgerichte höher. Reservierung ist im Sommer und durch die gesamte Trüffelsaison unerlässlich — unser separater Trüffel-Leitfaden erklärt, warum Oktober und November die Hochsaison sind. Verbinden Sie das Essen mit einem gemächlichen Spaziergang über die Stadtmauern von Motovun.',
        },
        {
          heading: 'Konoba Pod Voltom — Motovun (45 Minuten)',
          body: 'Innerhalb der Stadtmauern, eingebettet unter dem Gewölbetor, das ihr den Namen gibt — „unter dem Bogen" — ist Pod Voltom der traditionelle Gegenpol zu Mondo. Derselbe Hügelgipfel, eine klassischere istrische Karte und Terrassentische mit Blick hinab ins Mirna-Tal. Handgerollte Nudeln, istrisches Steak, saisonales Wild und eine ehrliche lokale Weinkarte mit viel Malvazija und Teran. Hauptgerichte 14–24 €. Die einfache Wahl, wenn Sie ohnehin für die Stadtmauern in Motovun sind oder von den Weingütern um Momjan zurückkommen — siehe unseren Weingut-Leitfaden. Für einen Terrassentisch um den Sonnenuntergang im Voraus reservieren; der Ausblick ist der Grund, dort zu sein.',
        },
        {
          heading: 'Restaurant Zigante — Livade (50 Minuten)',
          body: 'Der Tisch der gehobenen Küche Zentralistriens, dem Trüffelhaus Zigante in Livade angeschlossen. Weiße Tischdecken, ein tiefer Weinkeller und ein Degustationsmenü, das vollständig um Trüffel und die saisonalen istrischen Erzeugnisse herum aufgebaut ist. Das ist die Wahl für besondere Anlässe — ein Jahrestag, ein Festessen — und die Küche hält diesen Standard seit zwei Jahrzehnten. À-la-carte-Hauptgerichte 30–55 €; das mehrgängige Trüffel-Degustationsmenü liegt bei etwa 90–140 € mit Weinbegleitung. Rechtzeitig reservieren. Von Livade starten auch die Zigante-Trüffelsuchen, sodass eine morgendliche Jagd mit anschließendem Mittagessen hier die naheliegende Tagesplanung ist — unser Trüffel-Leitfaden enthält die Buchungsdetails.',
        },
        {
          heading: 'Konoba Dolina — Gradinje bei Livade (50 Minuten)',
          body: 'Eine kurze Fahrt weiter von Livade, im Weiler Gradinje, ist Dolina die Konoba, die Einheimische nennen, wenn man fragt, wo man Trüffel ohne den Aufschlag der gehobenen Küche isst. Familiengeführt, unkompliziert, mit einer Terrasse unter den Bäumen. Die Fuži mit Trüffel und das Steak mit Trüffelhaube sind die Gerichte zur Wahl, doch die hausgemachte Pasta und die istrischen Antipasti bestehen auch ganz ohne Trüffel. Hauptgerichte 15–26 €. Im Voraus reservieren, besonders an Wochenenden und durch die gesamte Herbstsaison, wenn das Trüffelpublikum sowohl die Konobas im Landesinneren als auch die Tische in Livade füllt.',
        },
        {
          heading: 'Konoba Toklarija — Sovišćina bei Buzet (55 Minuten)',
          body: 'Das eine Lokal, das vor dem Lob einen warnenden Absatz braucht. Toklarija, in einem Haus aus dem 14. Jahrhundert im winzigen Weiler Sovišćina, wird von Nevio Sirotić als beinahe ein Slow-Food-Heiligtum geführt — es gibt keine Karte, keine Wahl und keine Eile. Man setzt sich, und man wird mit dem bewirtet, was Nevio an diesem Tag zu kochen beschlossen hat, meist um Boškarin und die Saison herum, über viele kleine Gänge, die sich drei oder vier Stunden ziehen können. Es ist nicht günstig — kalkulieren Sie 80–130 € pro Person vor Wein — und es ist kein Ort für ein hungriges Kleinkind. Aber für zwei Personen, die das charaktervollste lange Mittagessen im Inneren Istriens suchen, kommt nichts anderes auf dieser Liste heran. Telefonisch reservieren, mehrere Tage im Voraus, und den ganzen Nachmittag freihalten.',
        },
        {
          heading: 'Reservierung, Timing & Anfahrt',
          body: 'Reservieren Sie alles — Zentralistrien läuft über Reservierungen, und im Juli und August sind die guten Tische am späten Vormittag vergeben. Das Mittagessen ist das regionale Hauptereignis: Viele Konobas öffnen gegen Mittag, ein langes Mittagessen ab 13:00 Uhr ist der lokale Rhythmus, und manche kleineren Lokale schließen zwischen den Servicezeiten oder bieten gar kein Abendessen an — klären Sie die Öffnungszeiten bei der Reservierung. Fahren Sie selbst — jedes Restaurant hier hat Parkplätze —, aber wenn das Essen den lokalen Rakija oder eine ernsthafte Weinkarte einschließt, bestimmen Sie einen Fahrer oder buchen Sie vorab einen über uns, mindestens 48 Stunden im Voraus. Jeder dieser Tische lässt sich gut mit einer Sehenswürdigkeit verbinden: Ograde mit Pazins Burg und Höhle, Mondo und Pod Voltom mit den Stadtmauern von Motovun, Zigante und Dolina mit einer Trüffelsuche, Toklarija mit einem gemächlichen Nachmittag in den Hügeln um Buzet. Sagen Sie uns, was Sie unternehmen möchten, und wir helfen Ihnen, den Tag um den Tisch herum zu planen.',
        },
      ],
      faq: [
        { q: 'Welches Restaurant liegt am nächsten zur Villa?', a: 'Agroturizam Ograde, bei Lindar oberhalb von Pazin, ist etwa 30 Minuten entfernt — die nächstgelegene unserer Empfehlungen. Der Rest gruppiert sich um Motovun (45 Minuten) sowie Livade und Buzet (50–55 Minuten).' },
        { q: 'Muss ich einen Tisch im Voraus reservieren?', a: 'Ja. Zentralistrien läuft über Reservierungen, und im Juli und August sind die guten Tische am späten Vormittag vergeben. Toklarija und Restaurant Zigante brauchen mehrere Tage Vorlauf; bei einer Konoba genügt außerhalb der Hauptsaison meist ein Tag im Voraus.' },
        { q: 'Wo sollten wir hingehen, um Trüffel zu essen?', a: 'Konoba Mondo in Motovun oder Konoba Dolina bei Livade für Trüffelgerichte im Konoba-Stil zu fairen Preisen; Restaurant Zigante in Livade für das Trüffel-Degustationsmenü der gehobenen Küche. Oktober und November sind die Weißtrüffel-Hochsaison — unser Trüffel-Leitfaden behandelt die Saison im Detail.' },
        { q: 'Welches Restaurant eignet sich am besten für Familien mit Kindern?', a: 'Agroturizam Ograde — ein arbeitender Bauernhof mit Tieren zum Besuchen, einem Garten, langen gemeinsamen Tischen und entspanntem Tempo. Toklarija und Restaurant Zigante sind Essen für Erwachsene und besondere Anlässe und für kleine Kinder schlecht geeignet.' },
        { q: 'Was kostet ein Essen?', a: 'Konoba-Hauptgerichte liegen bei 14–28 €; ein Hofmittagessen im Agrotourismus mit Hauswein bei etwa 25–40 € pro Person; gehobene Küche und Degustationsmenüs bei 90–140 € pro Person. Trüffelgerichte haben einen Aufschlag und sind durch die Herbstsaison am höchsten.' },
        { q: 'Ist Mittag- oder Abendessen die bessere Wahl?', a: 'Das Mittagessen. Es ist das regionale Hauptereignis, und manche kleineren Konobas bieten kein Abendessen an oder schließen am späten Nachmittag. Reservieren Sie ein langes Mittagessen ab etwa 13:00 Uhr und halten Sie den Nachmittag frei.' },
      ],
    },
  },
  {
    slug: 'driving-to-istria-by-car',
    category: 'arrival',
    datePublished: '2026-05-15',
    hero: {
      src: '/images/guides/driving-to-istria-by-car/istrian-motorway-summer.webp',
      alt: {
        en: 'Cars on the Istrian Y motorway (A8/A9) on a clear summer day',
        de: 'Autos auf dem Istrischen Ypsilon (A8/A9) an einem klaren Sommertag',
      },
      width: 1200,
      height: 800,
    },
    inlineImage: {
      afterSectionIndex: 4,
      image: {
        src: '/images/guides/driving-to-istria-by-car/istria-country-road-hill-town.webp',
        alt: {
          en: 'An open country road through green central Istria curving toward a medieval hilltop town',
          de: 'Eine offene Landstraße durch das grüne Zentralistrien, die sich zu einem mittelalterlichen Hügelstädtchen windet',
        },
        width: 1600,
        height: 1200,
      },
    },
    en: {
      title: 'Driving to Villa Ballena & Beluga — the road route from Germany and Austria',
      excerpt: 'Many guests from Germany and Austria drive to Istria. Here is the full road route — distances, the Austrian and Slovenian vignettes, the Karawanken Tunnel toll, Croatian motorway tolls, and the now border-free Schengen crossing into Croatia.',
      intro: 'Istria is one of the most popular self-drive holiday destinations for German and Austrian families — and for good reason. From Munich the villas are roughly a six-and-a-half-hour drive; from Vienna around five and a half; from Graz under four. Having your own car also makes the wineries, beaches and hill towns of Istria effortless once you arrive. This guide covers the whole road route to Villa Ballena & Beluga in Svetvinčenat: which vignettes and tolls you need, what they cost in 2026, the border situation, and the final approach to the villa.',
      sections: [
        {
          heading: 'Route overview — Munich, Vienna and Graz to central Istria',
          body: 'The drive funnels everyone through the same corridor: south through Austria, across a short stretch of Slovenia, and onto the Istrian peninsula. From Munich, the usual route runs via Salzburg, Villach and the Karawanken Tunnel into Slovenia, past Ljubljana toward Koper, then into Istria — roughly 600 km and 6 to 6.5 hours of driving. From Vienna, you travel via Graz and Maribor, around 520 km and 5.5 hours. From Graz it is shortest of all, about 340 km and four hours. Add an hour or so for fuel, food and the inevitable summer-Saturday traffic. The last 30 minutes inside Istria are covered in detail in our guide to arriving from Pula Airport, which also explains check-in.',
        },
        {
          heading: 'Austria — the vignette and the Karawanken Tunnel toll',
          body: 'To use Austrian motorways you need a vignette. For a one-week holiday the 10-day digital vignette is the right choice — €12.80 in 2026 for a car up to 3.5 t. Buy it online from the official ASFINAG shop (the 10-day version is valid immediately) or at a petrol station near the German border. On top of the vignette, the Karawanken Tunnel between Austria and Slovenia carries a separate toll of €9.00 per passage, charged once on the way south. You need both — the vignette does not cover the tunnel. You can pay the tunnel toll at the toll station or buy it online in advance. Note: from 2027 the Austrian vignette becomes digital-only; in 2026 the windscreen sticker still exists, but the digital version is simpler for a one-off trip.',
        },
        {
          heading: 'Slovenia — the e-vignette',
          body: 'Slovenia replaced its windscreen sticker with an electronic vignette (e-vinjeta) — there is nothing to stick on, and the toll is linked to your number plate. For a holiday, buy the 7-day vignette: €16.00 in 2026 for a standard car. Purchase it online at evinjeta.dars.si before you cross the border, or at petrol stations and kiosks in Austria and Slovenia. It is mandatory on all Slovenian motorways and expressways, including the A1 you will use between the Karawanken Tunnel, Ljubljana and Koper. Cameras enforce it automatically, so buy it before you drive — the fines are steep.',
        },
        {
          heading: 'Croatia — tolls, no vignette, and the border that disappeared',
          body: 'Croatia has no vignette at all. Instead you pay a toll for the distance you drive, collected at toll plazas by cash, card or the ENC electronic tag. On the Istrian motorway network — the Istrian Y (A8/A9, operated by Bina-Istra) — the toll for a holiday drive is modest, a few euros. The bigger news for returning visitors: since Croatia joined the Schengen Area in 2023, there are no longer systematic passport checks at the Slovenia–Croatia border. The hours-long summer queues that older guidebooks warn about are gone. Carry your ID card or passport — occasional spot checks still happen — but expect to drive straight through. Croatia also uses the euro, so there is no currency to change.',
        },
        {
          heading: 'The final approach to Svetvinčenat',
          body: 'Entering Istria from the Slovenian side, you join the A9 — the western arm of the Istrian Y — and head south down the peninsula. Exit at Kanfanar and follow the D75 south-east for 8 km into Svetvinčenat; the villas are signposted from the village square, with free private parking on-site for four cars per villa. If you approach instead from the Rijeka or Zagreb direction, you will use the toll-charged Učka Tunnel into Istria — both tunnel tubes have been open since late 2025. For the precise final turns and our late-arrival check-in procedure, see our companion guide on arriving from Pula Airport — the last stretch is the same.',
        },
        {
          heading: 'What the trip costs, and where to break the journey',
          body: 'Budget roughly €38 in vignettes and tunnel toll for the one-way trip from Germany — €12.80 Austrian 10-day vignette, €16.00 Slovenian 7-day e-vignette, €9.00 Karawanken Tunnel — plus Croatian motorway tolls of a few euros, and fuel. A natural place to break the drive is Ljubljana, an easy and pretty stop for lunch, or the Postojna Cave area if you are travelling with children. Try not to reach the Karawanken Tunnel on a summer Saturday morning, the peak changeover slot; a Friday evening or a weekday is far calmer. The prices quoted are 2026 rates and can change — check the official vignette shops before you travel.',
        },
      ],
      faq: [
        { q: 'Do I need a vignette to drive to Istria?', a: 'Yes — you need an Austrian motorway vignette (€12.80 for 10 days in 2026) and a Slovenian e-vignette (€16.00 for 7 days), plus the €9.00 Karawanken Tunnel toll. Croatia has no vignette; there you pay motorway tolls per section at toll plazas.' },
        { q: 'Is there still a border control between Slovenia and Croatia?', a: 'No. Croatia joined the Schengen Area in 2023, so there are no longer systematic passport checks on the Slovenia–Croatia border. Carry your ID card or passport for occasional spot checks, but the long summer queues are gone.' },
        { q: 'How long is the drive from Munich to the villas?', a: 'About 600 km and 6 to 6.5 hours of driving, plus stops. From Vienna it is around 5.5 hours, and from Graz about 4 hours.' },
        { q: 'Can I avoid the Karawanken Tunnel toll?', a: 'Yes — mountain passes such as the Wurzenpass, or a route through north-east Italy, avoid the tunnel, but the tunnel is the fastest and simplest option. Most guests simply pay the €9.00.' },
        { q: 'Does Croatia use the euro?', a: 'Yes. Croatia adopted the euro in 2023, so guests from Germany and Austria need no currency exchange.' },
      ],
    },
    de: {
      title: 'Anreise zur Villa Ballena & Beluga mit dem Auto — die Route aus Deutschland und Österreich',
      excerpt: 'Viele Gäste aus Deutschland und Österreich reisen mit dem Auto nach Istrien an. Hier finden Sie die komplette Route — Entfernungen, die österreichische und slowenische Vignette, die Maut für den Karawankentunnel, die kroatischen Autobahngebühren und der inzwischen wegfallende Grenzübergang.',
      intro: 'Istrien ist eines der beliebtesten Selbstfahrer-Ziele für Familien aus Deutschland und Österreich — aus gutem Grund. Von München sind die Villen rund sechseinhalb Stunden Fahrt entfernt, von Wien etwa fünfeinhalb, von Graz keine vier. Ein eigenes Auto macht außerdem Istriens Weingüter, Strände und Hügelstädte vor Ort mühelos erreichbar. Dieser Reiseführer beschreibt die gesamte Strecke zur Villa Ballena & Beluga in Svetvinčenat: welche Vignetten und Maut Sie brauchen, was sie 2026 kosten, die aktuelle Grenzsituation und den letzten Abschnitt bis zur Villa.',
      sections: [
        {
          heading: 'Routenüberblick — von München, Wien und Graz nach Zentralistrien',
          body: 'Alle Routen führen durch denselben Korridor: südwärts durch Österreich, über ein kurzes Stück Slowenien und auf die Halbinsel Istrien. Von München verläuft die übliche Strecke über Salzburg, Villach und den Karawankentunnel nach Slowenien, an Ljubljana vorbei Richtung Koper und dann nach Istrien — rund 600 km und 6 bis 6,5 Stunden reine Fahrzeit. Von Wien fahren Sie über Graz und Maribor, etwa 520 km und 5,5 Stunden. Von Graz ist es am kürzesten, rund 340 km und vier Stunden. Rechnen Sie etwa eine Stunde zusätzlich für Tanken, Essen und den unvermeidlichen Sommer-Samstag-Verkehr ein. Die letzten 30 Minuten innerhalb Istriens beschreibt unser Reiseführer zur Anreise ab Flughafen Pula im Detail — dort finden Sie auch den Check-in.',
        },
        {
          heading: 'Österreich — Vignette und Maut für den Karawankentunnel',
          body: 'Für die österreichischen Autobahnen brauchen Sie eine Vignette. Für einen einwöchigen Urlaub ist die digitale 10-Tages-Vignette die richtige Wahl — 2026 kostet sie 12,80 € für einen Pkw bis 3,5 t. Kaufen Sie sie online im offiziellen ASFINAG-Shop (die 10-Tages-Vignette gilt sofort) oder an einer Tankstelle nahe der deutschen Grenze. Zusätzlich zur Vignette wird für den Karawankentunnel zwischen Österreich und Slowenien eine separate Maut von 9,00 € pro Durchfahrt fällig, die einmal auf der Hinfahrt nach Süden anfällt. Sie brauchen beides — die Vignette deckt den Tunnel nicht ab. Die Tunnelmaut zahlen Sie an der Mautstelle oder kaufen sie vorab online. Hinweis: Ab 2027 gibt es die österreichische Vignette nur noch digital; 2026 existiert die Klebevignette noch, doch für eine einmalige Reise ist die digitale Variante einfacher.',
        },
        {
          heading: 'Slowenien — die E-Vignette',
          body: 'Slowenien hat die Klebevignette durch eine elektronische Vignette (E-Vinjeta) ersetzt — es gibt nichts mehr aufzukleben, und die Maut ist mit Ihrem Kennzeichen verknüpft. Für den Urlaub kaufen Sie die 7-Tages-Vignette: 2026 kostet sie 16,00 € für einen normalen Pkw. Erwerben Sie sie vor dem Grenzübertritt online unter evinjeta.dars.si oder an Tankstellen und Kiosken in Österreich und Slowenien. Sie ist auf allen slowenischen Autobahnen und Schnellstraßen Pflicht — auch auf der A1, die Sie zwischen Karawankentunnel, Ljubljana und Koper nutzen. Kameras kontrollieren automatisch, kaufen Sie die Vignette also vor der Fahrt — die Bußgelder sind hoch.',
        },
        {
          heading: 'Kroatien — Maut, keine Vignette und die verschwundene Grenze',
          body: 'Kroatien hat überhaupt keine Vignette. Stattdessen zahlen Sie eine Maut für die gefahrene Strecke, erhoben an Mautstationen — bar, mit Karte oder per ENC-Gerät. Auf dem istrischen Autobahnnetz, dem Istrischen Ypsilon (A8/A9, betrieben von Bina-Istra), ist die Maut für eine Urlaubsfahrt gering, einige Euro. Die größere Neuigkeit für wiederkehrende Gäste: Seit Kroatien 2023 dem Schengen-Raum beigetreten ist, gibt es an der Grenze Slowenien–Kroatien keine systematischen Passkontrollen mehr. Die stundenlangen Sommerstaus, vor denen ältere Reiseführer warnen, sind Geschichte. Führen Sie Personalausweis oder Reisepass mit — gelegentliche Stichproben gibt es weiterhin —, doch rechnen Sie damit, einfach durchzufahren. Kroatien nutzt zudem den Euro, es muss also kein Geld gewechselt werden.',
        },
        {
          heading: 'Der letzte Abschnitt nach Svetvinčenat',
          body: 'Wenn Sie von der slowenischen Seite nach Istrien einfahren, gelangen Sie auf die A9 — den westlichen Arm des Istrischen Ypsilon — und fahren die Halbinsel nach Süden hinunter. Verlassen Sie die Autobahn bei Kanfanar und folgen Sie der D75 acht Kilometer südöstlich bis Svetvinčenat; die Villen sind ab dem Dorfplatz ausgeschildert, mit kostenfreien Privatparkplätzen für vier Autos pro Villa. Wenn Sie stattdessen aus Richtung Rijeka oder Zagreb kommen, nutzen Sie den mautpflichtigen Učka-Tunnel nach Istrien — beide Tunnelröhren sind seit Ende 2025 geöffnet. Die genauen letzten Abzweigungen und unseren Check-in-Ablauf bei später Ankunft finden Sie in unserem Begleitartikel zur Anreise ab Flughafen Pula — der Schlussabschnitt ist derselbe.',
        },
        {
          heading: 'Was die Reise kostet und wo sich eine Pause anbietet',
          body: 'Rechnen Sie für die einfache Fahrt aus Deutschland mit rund 38 € für Vignetten und Tunnelmaut — 12,80 € österreichische 10-Tages-Vignette, 16,00 € slowenische 7-Tages-E-Vignette, 9,00 € Karawankentunnel — dazu einige Euro kroatische Autobahnmaut und Kraftstoff. Ein natürlicher Zwischenstopp ist Ljubljana, ein unkomplizierter und hübscher Ort für ein Mittagessen, oder die Gegend um die Höhle von Postojna, wenn Sie mit Kindern reisen. Versuchen Sie, den Karawankentunnel nicht an einem Sommer-Samstagvormittag zu erreichen — das ist die Hauptreisezeit; ein Freitagabend oder ein Wochentag ist deutlich entspannter. Die genannten Preise sind Tarife für 2026 und können sich ändern — prüfen Sie die offiziellen Vignetten-Shops vor der Abreise.',
        },
      ],
      faq: [
        { q: 'Brauche ich eine Vignette für die Fahrt nach Istrien?', a: 'Ja — Sie benötigen eine österreichische Autobahnvignette (2026: 12,80 € für 10 Tage) und eine slowenische E-Vignette (16,00 € für 7 Tage) sowie die Maut von 9,00 € für den Karawankentunnel. Kroatien hat keine Vignette; dort zahlen Sie streckenabhängige Maut an den Mautstationen.' },
        { q: 'Gibt es noch eine Grenzkontrolle zwischen Slowenien und Kroatien?', a: 'Nein. Kroatien ist 2023 dem Schengen-Raum beigetreten, daher gibt es an der Grenze Slowenien–Kroatien keine systematischen Passkontrollen mehr. Führen Sie Personalausweis oder Reisepass für gelegentliche Stichproben mit — die langen Sommerstaus sind jedoch vorbei.' },
        { q: 'Wie lange dauert die Fahrt von München zu den Villen?', a: 'Etwa 600 km und 6 bis 6,5 Stunden reine Fahrzeit, zuzüglich Pausen. Von Wien sind es rund 5,5 Stunden, von Graz etwa 4 Stunden.' },
        { q: 'Kann ich die Maut für den Karawankentunnel umgehen?', a: 'Ja — Gebirgspässe wie der Wurzenpass oder eine Route durch den Nordosten Italiens umgehen den Tunnel, doch der Tunnel ist die schnellste und einfachste Option. Die meisten Gäste zahlen einfach die 9,00 €.' },
        { q: 'Wird in Kroatien mit dem Euro bezahlt?', a: 'Ja. Kroatien hat 2023 den Euro eingeführt — Gäste aus Deutschland und Österreich brauchen kein Geld zu wechseln.' },
      ],
    },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find(g => g.slug === slug);
}
