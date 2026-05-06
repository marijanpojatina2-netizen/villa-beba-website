import { CONTACT, INSTAGRAM_URL, VILLAS } from './contact';
import { villaBallena, villaBeluga } from './data';

const BASE_URL = 'https://www.ballenaandbeluga.com';

// Brand-level "knowledge graph anchors" — the off-site profiles Google /
// Bing / Wikidata use to confirm a single entity behind the website.
// More canonical URLs here = higher Brand Authority + Trust score in
// AI-readiness audits (DataEase scores this as "sameAs / knowledge graph
// anchors", currently 0/15). Order: own social → marketplace listings →
// per-villa GBP. Filter falsy so empty placeholders don't ship as "".
const BRAND_SAME_AS = [
  INSTAGRAM_URL,
  villaBallena.bookingLinks.airbnb,
  villaBeluga.bookingLinks.airbnb,
  VILLAS.ballena.gbpUrl,
  VILLAS.beluga.gbpUrl,
].filter(Boolean);

export function getLocalBusinessSchema() {
  // Brand-level entity shipped from layout.tsx on every page. The two
  // physical villa listings are exposed as `containsPlace` so Google can
  // resolve the brand → 2 lodging branches → 2 GBP listings (matched
  // by exact address strings in VILLAS).
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Villa Ballena & Villa Beluga',
    description: 'Two luxury designer villas in Svetvinčenat, Istria, Croatia. Private pools, sauna, game room, 4 en-suite bedrooms each.',
    url: BASE_URL,
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Svetvinčenat',
      addressRegion: 'Istria',
      postalCode: '52342',
      addressCountry: 'HR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT.geo.lat,
      longitude: CONTACT.geo.lng,
    },
    containsPlace: [
      {
        '@type': 'LodgingBusiness',
        name: VILLAS.ballena.name,
        url: `${BASE_URL}/en/villa-ballena`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: VILLAS.ballena.streetAddress,
          addressLocality: VILLAS.ballena.locality,
          addressRegion: VILLAS.ballena.region,
          postalCode: VILLAS.ballena.postalCode,
          addressCountry: VILLAS.ballena.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: VILLAS.ballena.geo.lat,
          longitude: VILLAS.ballena.geo.lng,
        },
        sameAs: [VILLAS.ballena.gbpUrl, villaBallena.bookingLinks.airbnb].filter(Boolean),
      },
      {
        '@type': 'LodgingBusiness',
        name: VILLAS.beluga.name,
        url: `${BASE_URL}/en/villa-beluga`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: VILLAS.beluga.streetAddress,
          addressLocality: VILLAS.beluga.locality,
          addressRegion: VILLAS.beluga.region,
          postalCode: VILLAS.beluga.postalCode,
          addressCountry: VILLAS.beluga.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: VILLAS.beluga.geo.lat,
          longitude: VILLAS.beluga.geo.lng,
        },
        sameAs: [VILLAS.beluga.gbpUrl, villaBeluga.bookingLinks.airbnb].filter(Boolean),
      },
    ],
    ...(BRAND_SAME_AS.length ? { sameAs: BRAND_SAME_AS } : {}),
    priceRange: '€600 - €1,000/night',
    // Hotel-vertical fields for Google Hotel Search rich result eligibility.
    image: [
      `${BASE_URL}/og/home.jpg`,
      `${BASE_URL}/og/villa-ballena.jpg`,
      `${BASE_URL}/og/villa-beluga.jpg`,
    ],
    numberOfRooms: 8,        // 4 en-suite bedrooms × 2 villas
    checkinTime: '16:00',    // industry-standard luxury villa default; confirm with operator
    checkoutTime: '10:00',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Private Heated Pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Sauna', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Game Room', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Glass Terrace', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Outdoor Dining', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'BBQ Area', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'High-Speed WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free Private Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Concierge', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'En-Suite Bedrooms', value: true },
    ],
  };
}

export function getVacationRentalSchema(
  villa: 'ballena' | 'beluga',
  locale: string = 'en',
) {
  const isBalena = villa === 'ballena';
  const slug = isBalena ? 'villa-ballena' : 'villa-beluga';
  const villaData = VILLAS[villa];
  // Eight-image set per villa — Google's Vacation Rental rich result expects
  // ≥8 images, otherwise the enhanced card is suppressed even when all other
  // required fields are present.
  const images = isBalena
    ? [
        `${BASE_URL}/og/villa-ballena.jpg`,
        `${BASE_URL}/images/ballena/ballena-aerial-pool.jpg`,
        `${BASE_URL}/images/ballena/ballena-1.jpg`,
        `${BASE_URL}/images/ballena/ballena-9.jpg`,
        `${BASE_URL}/images/ballena/ballena-10.jpg`,
        `${BASE_URL}/images/ballena/ballena-30.jpg`,
        `${BASE_URL}/images/ballena/ballena-40.jpg`,
        `${BASE_URL}/images/ballena/ballena-42.jpg`,
      ]
    : [
        `${BASE_URL}/og/villa-beluga.jpg`,
        `${BASE_URL}/images/beluga/beluga-1.jpg`,
        `${BASE_URL}/images/beluga/beluga-3.jpg`,
        `${BASE_URL}/images/beluga/beluga-10.jpg`,
        `${BASE_URL}/images/beluga/beluga-25.jpg`,
        `${BASE_URL}/images/beluga/beluga-31.jpg`,
        `${BASE_URL}/images/beluga/beluga-40.jpg`,
        `${BASE_URL}/images/beluga/beluga-42.jpg`,
      ];
  // 4 en-suite bedrooms in each villa: 2 rooms with twin singles + 2 rooms
  // with euro-king doubles (180x210). Summarised as BedDetails counts.
  const bed = [
    { '@type': 'BedDetails', numberOfBeds: 4, typeOfBed: 'Single' },
    { '@type': 'BedDetails', numberOfBeds: 2, typeOfBed: 'King' },
  ];
  const occupancy = {
    '@type': 'QuantitativeValue',
    value: 8,
    unitText: 'guests',
  };
  const floorSize = {
    '@type': 'QuantitativeValue',
    value: 350,
    unitCode: 'MTK',
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    // Wikidata QID for "vacation rental" — Google requires additionalType
    // pointing at a controlled vocabulary entry to disambiguate the listing
    // from generic LodgingBusiness in the Vacation Rentals rich result.
    additionalType: 'https://www.wikidata.org/wiki/Q15813124',
    name: villaData.name,
    description: isBalena
      ? 'Luxury wellness villa with private sauna, heated pool, and 4 en-suite bedrooms in Istria, Croatia.'
      : 'Luxury entertainment villa with game room, glass terrace, heated pool, and 4 en-suite bedrooms in Istria, Croatia.',
    url: `${BASE_URL}/${locale}/${slug}`,
    // Stable per-property identifier — Google uses propertyID + value to
    // dedupe this listing across the sitemap, GBP, and any Vacation Rentals
    // feed submission. Slug is URL-stable; address text could change.
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'ballenaandbeluga.com',
      value: slug,
    },
    numberOfBedrooms: 4,
    numberOfBathroomsTotal: 4,
    numberOfRooms: 4,
    floorSize,
    occupancy,
    petsAllowed: true,
    yearBuilt: 2021,
    // Per-villa exact street address — must match the GBP listing for
    // this villa byte-for-byte. Source of truth: VILLAS in lib/contact.ts.
    address: {
      '@type': 'PostalAddress',
      streetAddress: villaData.streetAddress,
      postalCode: villaData.postalCode,
      addressLocality: villaData.locality,
      addressRegion: villaData.region,
      addressCountry: villaData.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: villaData.geo.lat,
      longitude: villaData.geo.lng,
    },
    // The rentable unit inside the property. Google's VacationRental model
    // is "Place that contains an Accommodation" — without containsPlace.bed
    // the listing is rejected from the Vacation Rentals rich result.
    containsPlace: {
      '@type': 'Accommodation',
      additionalType: 'EntirePlace',
      name: villaData.name,
      numberOfBedrooms: 4,
      numberOfBathroomsTotal: 4,
      numberOfRooms: 4,
      floorSize,
      occupancy,
      bed,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Private Heated Pool', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'High-Speed WiFi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Free Private Parking', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'En-Suite Bedrooms', value: true },
        isBalena
          ? { '@type': 'LocationFeatureSpecification', name: 'Private Sauna', value: true }
          : { '@type': 'LocationFeatureSpecification', name: 'Game Room', value: true },
      ],
    },
    sameAs: [
      villaData.gbpUrl,
      isBalena ? villaBallena.bookingLinks.airbnb : villaBeluga.bookingLinks.airbnb,
    ].filter(Boolean),
    image: images,
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: 600,
        priceCurrency: 'EUR',
        unitText: 'NIGHT',
      },
      availability: 'https://schema.org/InStock',
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export function getArticleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  image,
  locale = 'en',
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  locale?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${BASE_URL}/${locale}/blog/${slug}`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Organization',
      name: 'Villa Ballena & Villa Beluga',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Villa Ballena & Villa Beluga',
      url: BASE_URL,
      // Article rich snippets prefer a horizontal wordmark (~600x60) on a
      // white background. Until we have one, point at the 512x512 brand
      // mark which clears Google's 60x60 minimum and "image must be
      // crawlable, indexable, and in PNG/JPEG" requirements. Swap to a
      // proper horizontal wordmark in /og/logo.png when available.
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
    image: image ? `${BASE_URL}${image}` : `${BASE_URL}/images/ballena/ballena-42.jpg`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${locale}/blog/${slug}`,
    },
  };
}

export function getFAQSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}
