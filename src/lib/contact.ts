export const CONTACT = {
  phoneE164: '+385912524094',
  phoneDisplay: '+385 91 2524 094',
  whatsappNumber: '385912524094',
  email: 'info@villa-beba.com',
  instagramHandle: 'istrianvillaescape',
  // Coordinates for the Svetvinčenat property (used in map embed + JSON-LD)
  geo: { lat: 45.091986, lng: 13.886013 },
} as const;

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}`;
export const INSTAGRAM_URL = `https://www.instagram.com/${CONTACT.instagramHandle}`;
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${CONTACT.geo.lat},${CONTACT.geo.lng}&z=15&output=embed`;
export const MAP_LINK_URL = `https://maps.google.com/?q=${CONTACT.geo.lat},${CONTACT.geo.lng}`;
