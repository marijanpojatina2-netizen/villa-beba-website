// Centralized image mapping for the entire website
// All paths are relative to /public

export const heroImages = {
  homepage: '/images/ballena/Ballena 42.jpg',        // Drone shot both villas at dusk
  ballena: '/images/ballena/Ballena 38.jpg',          // Pool at night, cinematic
  beluga: '/images/beluga/Beluga 36.jpg',             // Exterior with pool at dusk
  complexBeba: '/images/beluga/Beluga 42.jpg',        // Aerial panorama of location
  weddings: '/images/ballena/Ballena 35-1.jpg',       // Olive tree courtyard at dusk
  corporate: '/images/ballena/Ballena 33.jpg',        // Exterior at sunset
  experiences: '/images/beluga/Beluga 13.jpg',        // Stone wall terrace, Mediterranean
  pricing: '/images/ballena/Ballena 36.jpg',          // Terrace/pool at night
  gallery: '/images/koridor/IMG_5216.jpg',            // Both villas corridor
  about: '/images/ballena/Ballena 35-1.jpg',          // Olive tree courtyard
};

export const villaCards = {
  ballena: '/images/ballena/Ballena 36.jpg',          // Moody dark elegance
  beluga: '/images/beluga/Beluga 36.jpg',             // Warm vibrant evening
};

export const ballenaGallery = [
  { src: '/images/ballena/Ballena 1.jpg', alt: 'Villa Ballena exterior with pool', category: 'exterior' },
  { src: '/images/ballena/Ballena 33.jpg', alt: 'Villa Ballena exterior at sunset', category: 'exterior' },
  { src: '/images/ballena/Ballena 36.jpg', alt: 'Villa Ballena terrace and pool at night', category: 'exterior' },
  { src: '/images/ballena/Ballena 38.jpg', alt: 'Villa Ballena pool at dusk', category: 'pool' },
  { src: '/images/ballena/Ballena 10.jpg', alt: 'Villa Ballena covered terrace with pool', category: 'pool' },
  { src: '/images/ballena/Ballena 35-1.jpg', alt: 'Villa Ballena olive tree courtyard', category: 'exterior' },
  { src: '/images/ballena/Ballena 11.jpg', alt: 'Villa Ballena interior living area', category: 'interior' },
  { src: '/images/ballena/Ballena 17.jpg', alt: 'Villa Ballena dining area', category: 'interior' },
  { src: '/images/ballena/Ballena 15.jpg', alt: 'Villa Ballena lounge area', category: 'interior' },
  { src: '/images/ballena/Copy of IMG_5058.jpg', alt: 'Villa Ballena bedroom', category: 'bedroom' },
  { src: '/images/ballena/Copy of IMG_5040.jpg', alt: 'Villa Ballena bedroom with red accents', category: 'bedroom' },
  { src: '/images/ballena/Ballena 20.jpg', alt: 'Villa Ballena modern bathroom', category: 'interior' },
  { src: '/images/ballena/Ballena 22.jpg', alt: 'Villa Ballena sauna area', category: 'wellness' },
  { src: '/images/ballena/Ballena 23.jpg', alt: 'Villa Ballena outdoor dining', category: 'exterior' },
  { src: '/images/ballena/Ballena 34.jpg', alt: 'Villa Ballena poolside terrace', category: 'pool' },
  { src: '/images/ballena/Ballena 42.jpg', alt: 'Aerial view both villas at dusk', category: 'exterior' },
];

export const belugaGallery = [
  { src: '/images/beluga/Beluga 1.jpg', alt: 'Villa Beluga exterior daytime', category: 'exterior' },
  { src: '/images/beluga/Beluga 36.jpg', alt: 'Villa Beluga pool and terrace at dusk', category: 'exterior' },
  { src: '/images/beluga/Beluga 35.jpg', alt: 'Villa Beluga outdoor dining at night', category: 'exterior' },
  { src: '/images/beluga/Beluga 9.jpg', alt: 'Villa Beluga covered terrace with pool', category: 'pool' },
  { src: '/images/beluga/Beluga 25.jpg', alt: 'Villa Beluga rooftop terrace', category: 'exterior' },
  { src: '/images/beluga/Copy of DJI_0146.jpg', alt: 'Villa Beluga aerial view', category: 'exterior' },
  { src: '/images/beluga/Beluga 11.jpg', alt: 'Villa Beluga living room', category: 'interior' },
  { src: '/images/beluga/Beluga 10.jpg', alt: 'Villa Beluga game room', category: 'interior' },
  { src: '/images/beluga/Beluga 15.jpg', alt: 'Villa Beluga glass terrace lounge', category: 'interior' },
  { src: '/images/beluga/Beluga 17.jpg', alt: 'Villa Beluga bedroom', category: 'bedroom' },
  { src: '/images/beluga/Beluga 14.jpg', alt: 'Villa Beluga kitchen area', category: 'interior' },
  { src: '/images/beluga/Beluga 13.jpg', alt: 'Villa Beluga stone wall terrace', category: 'exterior' },
  { src: '/images/beluga/Beluga 26.jpg', alt: 'Villa Beluga poolside loungers', category: 'pool' },
  { src: '/images/beluga/Beluga 27.jpg', alt: 'Villa Beluga wooden terrace', category: 'exterior' },
  { src: '/images/beluga/Beluga 42.jpg', alt: 'Aerial view Svetvinčenat village', category: 'exterior' },
  { src: '/images/beluga/Beluga 21.jpg', alt: 'Villa Beluga modern bathroom', category: 'interior' },
];

export const allGalleryImages = [
  ...ballenaGallery.map(img => ({ ...img, villa: 'ballena' as const })),
  ...belugaGallery.map(img => ({ ...img, villa: 'beluga' as const })),
  { src: '/images/koridor/IMG_5216.jpg', alt: 'Corridor between villas with pool view', villa: 'common' as const, category: 'pool' },
  { src: '/images/koridor/IMG_4961.jpg', alt: 'Shared outdoor terrace area', villa: 'common' as const, category: 'exterior' },
  { src: '/images/koridor/IMG_5178.jpg', alt: 'Villa complex exterior', villa: 'common' as const, category: 'exterior' },
  { src: '/images/koridor/IMG_4857.jpg', alt: 'Property grounds with pool', villa: 'common' as const, category: 'pool' },
];
