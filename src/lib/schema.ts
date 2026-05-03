import { CONTACT } from './contact';

const BASE_URL = 'https://www.villabeba.com';

export function getLocalBusinessSchema() {
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
      addressCountry: 'HR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT.geo.lat,
      longitude: CONTACT.geo.lng,
    },
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
  return {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    name: isBalena ? 'Villa Ballena' : 'Villa Beluga',
    description: isBalena
      ? 'Luxury wellness villa with private sauna, heated pool, and 4 en-suite bedrooms in Istria, Croatia.'
      : 'Luxury entertainment villa with game room, glass terrace, heated pool, and 4 en-suite bedrooms in Istria, Croatia.',
    url: `${BASE_URL}/${locale}/${slug}`,
    numberOfBedrooms: 4,
    numberOfBathroomsTotal: 4,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: 350,
      unitCode: 'MTK',
    },
    occupancy: {
      '@type': 'QuantitativeValue',
      value: 8,
      unitText: 'guests',
    },
    petsAllowed: true,
    yearBuilt: 2021,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Svetvinčenat',
      addressRegion: 'Istria',
      addressCountry: 'HR',
    },
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
  image,
  locale = 'en',
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
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
    dateModified: datePublished,
    author: {
      '@type': 'Organization',
      name: 'Villa Ballena & Villa Beluga',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Villa Ballena & Villa Beluga',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.ico`,
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
