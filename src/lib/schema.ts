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
      latitude: 45.0544,
      longitude: 13.8781,
    },
    priceRange: '€600 - €1,000/night',
    starRating: {
      '@type': 'Rating',
      ratingValue: '5',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Private Heated Pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
    ],
  };
}

export function getVacationRentalSchema(villa: 'ballena' | 'beluga') {
  const isBalena = villa === 'ballena';
  return {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    name: isBalena ? 'Villa Ballena' : 'Villa Beluga',
    description: isBalena
      ? 'Luxury wellness villa with private sauna, heated pool, and 4 en-suite bedrooms in Istria, Croatia.'
      : 'Luxury entertainment villa with game room, glass terrace, heated pool, and 4 en-suite bedrooms in Istria, Croatia.',
    url: `${BASE_URL}/en/${isBalena ? 'villa-ballena' : 'villa-beluga'}`,
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
