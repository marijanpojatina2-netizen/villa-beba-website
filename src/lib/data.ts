export const villaCommon = {
  area: '350 m²',
  grounds: '1,000 m²',
  built: 2021,
  bedrooms: 4,
  bathrooms: 4,
  guestWCs: 3,
  maxGuests: '8+1',
  pool: {
    size: '8x4m (32 m²)',
    depth: '1.30m',
    type: 'Biological natural pool water',
    features: ['Hydromassage', 'Pool steps', 'Outdoor shower'],
    season: 'May 1 – October 30',
    towelsIncluded: true,
  },
  outdoor: {
    bbq: 'Gas BBQ with accessories',
    dining: 'Max 12 seats',
    parking: '4 cars',
    tennisCourt: 'Shared clay tennis court',
    fence: 'Fenced courtyard (max 1.10m)',
  },
  indoor: {
    ac: 'Central air conditioning',
    heating: 'Underfloor heating',
    fireplace: true,
    wifi: '125 Mbit/s',
    entertainment: ['Netflix', 'Smart TV', 'Bluetooth sound system'],
    kitchen: ['Induction hob', 'Oven', 'Ice maker', 'Dishwasher', 'Capsule coffee machine', 'Microwave'],
    laundry: 'Washer + dryer',
    safe: true,
  },
  checkIn: '16:00',
  checkOut: '10:00',
  deposit: '€1,500',
  included: ['Bed linen', 'Towels', 'Pool towels', 'Final cleaning'],
  pets: 'Up to 2, no extra charge',
};

export const villaBallena = {
  name: 'Villa Ballena',
  tagline: 'The Serene Wellness Retreat',
  slug: 'villa-ballena',
  keyFeatures: ['Private sauna', 'Heated pool', 'Dark designer interiors'],
  unique: {
    sauna: 'Finnish sauna in basement',
    wellnessShower: true,
    terrace: 'Covered terrace + outdoor kitchen',
  },
  bedrooms: [
    { name: 'Room 1', beds: '2x single beds (100x210cm)', enSuite: true },
    { name: 'Room 2', beds: '2x single beds (90x210cm)', enSuite: true },
    { name: 'Room 3', beds: '1x double bed (180x210cm)', enSuite: true },
    { name: 'Room 4', beds: '1x double bed (180x210cm)', enSuite: true },
  ],
  bookingLinks: {
    myluxoria: 'https://www.myluxoria.com/hr/vile-rovinj/villa-ballena',
    crovillas: 'https://crovillas.com/hr/villa/ballena',
    rlvc: 'https://rentluxuryvillascroatia.com/hr/v/villa-ballena',
    airbnb: 'https://www.airbnb.com/rooms/1539753391009885386',
  },
};

export const villaBeluga = {
  name: 'Villa Beluga',
  tagline: 'The Entertainment & Lifestyle Villa',
  slug: 'villa-beluga',
  keyFeatures: ['Game room', 'Glass terrace', 'Family-friendly'],
  unique: {
    gameRoom: ['Billiard table', 'Foosball', 'Darts', 'PlayStation', 'Board games', 'Badminton (outdoor)'],
    glassTerrace: true,
    loungers: '8 loungers by pool',
    premiumServices: ['Private chef on request', 'Private party and wedding organization', 'Daily cleaning on request', '24/7 guest support', 'Baby-friendly (cot + high chair)'],
  },
  bedrooms: [
    { name: 'Room 1', beds: '2x single beds (100x210cm)', enSuite: true },
    { name: 'Room 2', beds: '2x single beds (90x210cm)', enSuite: true },
    { name: 'Room 3', beds: '1x double bed (180x210cm) — can split into 2x90cm', enSuite: true },
    { name: 'Room 4', beds: '1x double bed (180x210cm) — can split into 2x90cm', enSuite: true },
  ],
  bookingLinks: {
    myluxoria: 'https://www.myluxoria.com/hr/vile-rovinj/villa-beluga',
    crovillas: 'https://crovillas.com/hr/villa/beluga',
    airbnb: 'https://www.airbnb.com/rooms/1635490517116416278',
  },
};

export const complexBeba = {
  bookingLink: 'https://crovillas.com/hr/villa/complex-beba',
  maxGuests: 18,
  sharedAmenities: ['Shared clay tennis court'],
};

export const standardPricing = [
  { period: 'May 17 – May 31', price: 600, minStay: 5 },
  { period: 'June 1 – June 20', price: 700, minStay: 7 },
  { period: 'June 21 – July 4', price: 900, minStay: 7 },
  { period: 'July 5 – August 16', price: 1000, minStay: 7 },
  { period: 'August 17 – August 30', price: 900, minStay: 7 },
  { period: 'Aug 31 – Sep 6', price: 700, minStay: 7 },
  { period: 'Sep 7 – Sep 27', price: 600, minStay: 7 },
  { period: 'Sep 28 – Nov 1', price: 600, minStay: 5 },
];

export const weddingPricing = standardPricing.map(p => ({
  ...p,
  price: Math.round(p.price * 1.5),
}));

export const corporatePricing = standardPricing.map(p => ({
  ...p,
  price: Math.round(p.price * 1.25),
}));

export const distances = [
  { destination: 'Village center', distance: '300 m' },
  { destination: 'Nearest supermarket', distance: '400 m' },
  { destination: 'Kaštel Morosini-Grimani', distance: '550 m' },
  { destination: 'Pizzeria Grimani', distance: '600 m' },
  { destination: 'Highway (Kanfanar)', distance: '8.8 km' },
  { destination: 'Bale beach', distance: '19 km' },
  { destination: 'Fažana', distance: '22 km' },
  { destination: 'Rovinj', distance: '23 km' },
  { destination: 'Brijuni NP', distance: '26 km' },
  { destination: 'Pula', distance: '27.5 km' },
  { destination: 'Pula Airport', distance: '33 km' },
  { destination: 'Poreč', distance: '37 km' },
];

export const experiences = [
  { title: 'Wine Tasting', description: 'Discover Istria\'s finest wines at renowned wineries like Kozlović, Clai, and Coronica.', distance: '30 min drive', category: 'gastronomy' },
  { title: 'Truffle Hunting', description: 'Join local guides on an authentic truffle hunting adventure through Istrian forests.', distance: 'Nearby', category: 'gastronomy' },
  { title: 'Olive Oil Tasting', description: 'Visit family-owned estates producing award-winning Istrian olive oil.', distance: '20 min drive', category: 'gastronomy' },
  { title: 'Cooking Class', description: 'Learn to prepare traditional Istrian dishes with local chefs.', distance: 'On request', category: 'gastronomy' },
  { title: 'Rovinj Day Trip', description: 'Explore the stunning coastal town of Rovinj with its colorful harbor and winding streets.', distance: '23 km', category: 'daytrip' },
  { title: 'Pula Arena', description: 'Visit the magnificently preserved Roman amphitheater, one of the best in the world.', distance: '27.5 km', category: 'daytrip' },
  { title: 'Brijuni National Park', description: 'Discover the stunning archipelago with ancient Roman ruins and exotic wildlife.', distance: '26 km', category: 'daytrip' },
  { title: 'Motovun & Grožnjan', description: 'Hilltop medieval towns with breathtaking views over the Mirna river valley.', distance: '45 min drive', category: 'daytrip' },
  { title: 'Beach Days', description: 'Crystal-clear Adriatic waters at Bale, Fažana, and Rovinj beaches.', distance: '19-23 km', category: 'nature' },
  { title: 'Tennis & Sports', description: 'Shared clay tennis court on-site, plus cycling and hiking in the Istrian countryside.', distance: 'On-site', category: 'sports' },
  { title: 'Aquapark Istralandia', description: 'Fun-filled water park adventure for the whole family.', distance: '40 km', category: 'family' },
  { title: 'Kaštel Morosini-Grimani', description: 'Medieval castle hosting summer concerts, just a short walk from the villas.', distance: '550 m', category: 'culture' },
];

export const reviews = [
  { text: 'Fantastic stay at this beautiful villa... spacious, clean, providing a peaceful escape', author: 'Guest', lang: 'en' },
  { text: 'Pool, sauna, and even a tennis court, all well-maintained', author: 'Guest', lang: 'en' },
  { text: 'Within walking distance of a nearby village with 2 supermarkets and a stunning castle', author: 'Guest', lang: 'en' },
  { text: 'Wir hatten einen super Aufenthalt. Es hat an nichts gefehlt.', author: 'Gast', lang: 'de' },
  { text: 'Hosts were welcoming and friendly', author: 'Guest', lang: 'en' },
  { text: 'Great spot for anyone looking to enjoy Croatia in a tranquil, scenic setting.', author: 'Guest', lang: 'en' },
];

export const faqItems = [
  { q: 'Is the pool heated?', a: 'Yes, both villas have heated pools (8x4m, biological water, hydromassage). Open May 1 – October 30.' },
  { q: 'Can we bring pets?', a: 'Up to 2 pets welcome, no extra charge.' },
  { q: 'What\'s the nearest beach?', a: 'Bale beach, 19 km (20 min). Also Fažana (22 km) and Rovinj (23 km).' },
  { q: 'Is there A/C?', a: 'Central air conditioning throughout + underfloor heating.' },
  { q: 'Can you arrange airport transfer?', a: 'Yes, from Pula Airport (33 km). Car rental also available.' },
  { q: 'What\'s included in the price?', a: 'Bed linen, towels, pool towels, final cleaning. No hidden fees.' },
  { q: 'Do you offer early check-in?', a: 'Standard check-in from 16:00. Early check-in possible on request.' },
  { q: 'Can we book both villas?', a: 'Yes, as "Complex BeBa" for up to 18 guests. Ideal for weddings and large groups.' },
  { q: 'Is there a game room?', a: 'Villa Beluga has a full game room: billiards, foosball, darts, PlayStation, board games.' },
  { q: 'Does Villa Ballena have a sauna?', a: 'Yes, a private Finnish sauna + wellness shower in the basement.' },
  { q: 'How far is the nearest restaurant?', a: 'Pizzeria Grimani is 600m walk. Village center with cafés is 300m.' },
  { q: 'What\'s the WiFi speed?', a: '125 Mbit/s throughout both properties.' },
];
