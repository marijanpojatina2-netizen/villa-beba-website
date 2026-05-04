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

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}`;
export const INSTAGRAM_URL = `https://www.instagram.com/${CONTACT.instagramHandle}`;
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${CONTACT.geo.lat},${CONTACT.geo.lng}&z=15&output=embed`;
export const MAP_LINK_URL = `https://maps.google.com/?q=${CONTACT.geo.lat},${CONTACT.geo.lng}`;
