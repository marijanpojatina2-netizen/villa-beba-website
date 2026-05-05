// Single source of truth for owner contact info — referenced by JSON-LD schema,
// the contact page, footer, and WhatsApp/maps URLs. Treat as Name-Address-Phone
// (NAP) data: every change here MUST be mirrored on Google Business Profile,
// Booking.com, Airbnb, and any directory listings, or Google's local algorithm
// will lower entity confidence and rankings.
export const CONTACT = {
  phoneE164: '+385912524094',
  phoneDisplay: '+385 91 2524 094',
  whatsappNumber: '385912524094',
  email: 'info@ballenaandbeluga.com',
  instagramHandle: 'istrianvillaescape',
  // Coordinates for the Svetvinčenat property (used in map embed + JSON-LD)
  geo: { lat: 45.091986, lng: 13.886013 },
} as const;

// Per-villa physical addresses for separate Google Business Profile listings
// at Svetvinčenat 151 (Ballena) and 150 (Beluga). Strings here MUST match the
// GBP listings byte-for-byte — Google's local algorithm cross-references the
// site's JSON-LD address against the GBP address when linking the entity.
// Add the GBP listing URL to `gbpUrl` after each property is verified
// (postcard verification takes 5-14 days post-signup).
export const VILLAS = {
  ballena: {
    name: 'Villa Ballena',
    streetAddress: 'Svetvinčenat 151',
    postalCode: '52342',
    locality: 'Svetvinčenat',
    region: 'Istria',
    country: 'HR',
    geo: { lat: 45.091986, lng: 13.886013 },
    gbpUrl: '', // TODO: paste Google Business Profile URL after verification
  },
  beluga: {
    name: 'Villa Beluga',
    streetAddress: 'Svetvinčenat 150',
    postalCode: '52342',
    locality: 'Svetvinčenat',
    region: 'Istria',
    country: 'HR',
    geo: { lat: 45.091986, lng: 13.886013 },
    gbpUrl: '',
  },
} as const;

// Legal entity behind the rentals — used by /impressum (TMG § 5 disclosure
// for DE/AT visitors + Croatian Trgovački zakon § 21 mandatory disclosure).
// Items marked TODO must be filled in before deploying — the impressum
// page renders them verbatim and missing values appear as placeholder text.
export const IMPRESSUM = {
  legalName: 'Kovedrana d.o.o.',
  street: 'Crnojezerska 15a',
  postalCode: '10090',
  city: 'Zagreb',
  country: 'Hrvatska',
  countryDE: 'Kroatien',
  oib: '77401050769',
  // Matični broj (8-digit company number from Državni zavod za statistiku).
  // Note: this is MB, not MBS — MBS would be a longer court-register number;
  // Croatian impressums commonly publish MB and that's what visitors recognise.
  mb: '04941942',
  registrationCourt: 'Trgovački sud u Zagrebu',
  registrationCourtDE: 'Handelsgericht in Zagreb',
  // Share capital in EUR. Croatian convention uses comma as decimal separator
  // and "uplaćen u cijelosti" (paid in full) — but EUR amounts are typically
  // shown in standard EU format on a public impressum.
  shareCapital: '2.500,00 EUR',
  director: 'Marijan Pojatina',
  // VAT ID — leave empty if the company is not in the VAT system.
  vatId: '',
} as const;

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}`;
export const INSTAGRAM_URL = `https://www.instagram.com/${CONTACT.instagramHandle}`;
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${CONTACT.geo.lat},${CONTACT.geo.lng}&z=15&output=embed`;
export const MAP_LINK_URL = `https://maps.google.com/?q=${CONTACT.geo.lat},${CONTACT.geo.lng}`;
