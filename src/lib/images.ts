// Centralized image mapping for the entire website
// All paths are relative to /public

export const heroImages = {
  homepage: '/images/ballena/ballena-42.jpg',        // Drone shot both villas at dusk
  ballena: '/images/ballena/ballena-1.jpg',             // Exterior daytime front view
  beluga: '/images/beluga/beluga-2.jpg',               // Beluga exterior daytime
  complexBeba: '/images/beluga/beluga-39.jpg',          // Complex Beba aerial/exterior
  weddings: '/images/ballena/ballena-35-1.jpg',       // Olive tree courtyard at dusk
  corporate: '/images/ballena/ballena-33.jpg',        // Exterior at sunset
  experiences: '/images/beluga/beluga-13.jpg',        // Stone wall terrace, Mediterranean
  pricing: '/images/ballena/ballena-36.jpg',          // Terrace/pool at night
  gallery: '/images/koridor/img_5216.jpg',            // Both villas corridor
  about: '/images/ballena/ballena-35-1.jpg',          // Olive tree courtyard
};

export const villaCards = {
  ballena: '/images/ballena/ballena-5.jpg',            // Exterior daytime, blue sky
  beluga: '/images/beluga/img_4847.jpg',       // Beluga exterior daytime, green grass
};

// Alt text guidelines: describe what's actually in the photo (verified ones
// are specific; unverified ones stay at category level so the alt never lies),
// lead with the villa name for image-search relevance, and vary the phrasing —
// identical alts across a gallery read as spam to Google Images.
export const ballenaGallery = [
  { src: '/images/ballena/ballena-1.jpg', alt: 'Villa Ballena navy-blue facade with timber slats above the heated pool', category: 'exterior' },
  { src: '/images/ballena/ballena-2.jpg', alt: 'Villa Ballena modern exterior surrounded by Istrian greenery', category: 'exterior' },
  { src: '/images/ballena/ballena-3.jpg', alt: 'Villa Ballena cantilevered designer architecture, Svetvinčenat', category: 'exterior' },
  { src: '/images/ballena/ballena-4.jpg', alt: 'Villa Ballena luxury holiday villa exterior in central Istria', category: 'exterior' },
  { src: '/images/ballena/ballena-5.jpg', alt: 'Villa Ballena front elevation under a clear Istrian sky', category: 'exterior' },
  { src: '/images/ballena/ballena-6.jpg', alt: 'Villa Ballena poolside terrace and outdoor lounge area', category: 'exterior' },
  { src: '/images/ballena/ballena-7.jpg', alt: 'Villa Ballena open-plan living space with contemporary design', category: 'interior' },
  { src: '/images/ballena/ballena-8.jpg', alt: 'Villa Ballena interior with floor-to-ceiling glazing', category: 'interior' },
  { src: '/images/ballena/ballena-9.jpg', alt: 'Villa Ballena designer interior with warm wood accents', category: 'interior' },
  { src: '/images/ballena/ballena-10.jpg', alt: 'Villa Ballena heated pool beneath the circular net-hammock oculus and covered outdoor kitchen', category: 'pool' },
  { src: '/images/ballena/ballena-11.jpg', alt: 'Villa Ballena contemporary interior, luxury villa Istria', category: 'interior' },
  { src: '/images/ballena/ballena-12.jpg', alt: 'Villa Ballena living area opening onto the covered terrace', category: 'interior' },
  { src: '/images/ballena/ballena-13.jpg', alt: 'Villa Ballena modern interior design detail', category: 'interior' },
  { src: '/images/ballena/ballena-14.jpg', alt: 'Villa Ballena interior with Mediterranean natural light', category: 'interior' },
  { src: '/images/ballena/ballena-15.jpg', alt: 'Villa Ballena designer furnishings in the main living space', category: 'interior' },
  { src: '/images/ballena/ballena-16.jpg', alt: 'Villa Ballena interior view of the open living zone', category: 'interior' },
  { src: '/images/ballena/ballena-17.jpg', alt: 'Villa Ballena contemporary interior styling, Svetvinčenat villa', category: 'interior' },
  { src: '/images/ballena/ballena-20.jpg', alt: 'Villa Ballena interior with modern art and curated decor', category: 'interior' },
  { src: '/images/ballena/ballena-21.jpg', alt: 'Villa Ballena luxury villa interior, central Istria', category: 'interior' },
  { src: '/images/ballena/ballena-22.jpg', alt: 'Villa Ballena rooftop terrace with sun loungers and round net daybed', category: 'wellness' },
  { src: '/images/ballena/ballena-23.jpg', alt: 'Villa Ballena exterior and landscaped grounds', category: 'exterior' },
  { src: '/images/ballena/ballena-30.jpg', alt: 'Villa Ballena modern villa exterior in the Istrian countryside', category: 'exterior' },
  { src: '/images/ballena/ballena-32.jpg', alt: 'Villa Ballena designer villa seen from the garden', category: 'exterior' },
  { src: '/images/ballena/ballena-33.jpg', alt: 'Villa Ballena exterior at sunset, Svetvinčenat, Istria', category: 'exterior' },
  { src: '/images/ballena/ballena-34.jpg', alt: 'Villa Ballena private heated pool with hydromassage', category: 'pool' },
  { src: '/images/ballena/ballena-35.jpg', alt: 'Villa Ballena outdoor area among olive trees', category: 'exterior' },
  { src: '/images/ballena/ballena-35-1.jpg', alt: 'Villa Ballena olive tree courtyard at dusk', category: 'exterior' },
  { src: '/images/ballena/ballena-36.jpg', alt: 'Villa Ballena terrace and pool illuminated at night', category: 'exterior' },
  { src: '/images/ballena/ballena-37.jpg', alt: 'Villa Ballena holiday villa exterior with evening lighting', category: 'exterior' },
  { src: '/images/ballena/ballena-38.jpg', alt: 'Villa Ballena pool area, luxury villa with private pool in Istria', category: 'pool' },
  { src: '/images/ballena/ballena-39.jpg', alt: 'Villa Ballena architecture framed by Istrian nature', category: 'exterior' },
  { src: '/images/ballena/ballena-40.jpg', alt: 'Villa Ballena exterior view of the designer holiday home', category: 'exterior' },
  { src: '/images/ballena/ballena-42.jpg', alt: 'Aerial drone view of Villa Ballena and Villa Beluga at dusk, Svetvinčenat', category: 'exterior' },
  { src: '/images/ballena/img_5011.jpg', alt: 'Villa Ballena interior with contemporary Mediterranean style', category: 'interior' },
  { src: '/images/ballena/img_5023.jpg', alt: 'Villa Ballena modern living interior, Istria villa rental', category: 'interior' },
  { src: '/images/ballena/img_5040.jpg', alt: 'Villa Ballena en-suite bedroom with king bed, work desk and TV', category: 'bedroom' },
  { src: '/images/ballena/img_5058.jpg', alt: 'Villa Ballena bright en-suite bedroom, one of four', category: 'bedroom' },
  { src: '/images/ballena/img_5085.jpg', alt: 'Villa Ballena interior detail with designer furniture', category: 'interior' },
  { src: '/images/ballena/img_5103.jpg', alt: 'Villa Ballena contemporary interior of the luxury villa', category: 'interior' },
  { src: '/images/ballena/img_5118.jpg', alt: 'Villa Ballena en-suite bedroom with contemporary styling', category: 'bedroom' },
  { src: '/images/ballena/img_5140.jpg', alt: 'Villa Ballena interior living space with natural light', category: 'interior' },
  { src: '/images/ballena/img_5247.jpg', alt: 'Villa Ballena exterior and grounds in Svetvinčenat, Croatia', category: 'exterior' },
];

export const belugaGallery = [
  { src: '/images/beluga/beluga-1.jpg', alt: 'Villa Beluga modern white exterior, family villa in Istria', category: 'exterior' },
  { src: '/images/beluga/beluga-2.jpg', alt: 'Villa Beluga designer holiday villa exterior, Svetvinčenat', category: 'exterior' },
  { src: '/images/beluga/beluga-3.jpg', alt: 'Villa Beluga contemporary architecture in the Istrian countryside', category: 'exterior' },
  { src: '/images/beluga/beluga-4.jpg', alt: 'Villa Beluga exterior with landscaped Mediterranean garden', category: 'exterior' },
  { src: '/images/beluga/beluga-5.jpg', alt: 'Villa Beluga luxury family villa seen from the grounds', category: 'exterior' },
  { src: '/images/beluga/beluga-6.jpg', alt: 'Villa Beluga outdoor terrace and pool area', category: 'exterior' },
  { src: '/images/beluga/beluga-7.jpg', alt: 'Villa Beluga open-plan living space with contemporary design', category: 'interior' },
  { src: '/images/beluga/beluga-8.jpg', alt: 'Villa Beluga interior with floor-to-ceiling glass walls', category: 'interior' },
  { src: '/images/beluga/beluga-9.jpg', alt: 'Villa Beluga covered al-fresco dining terrace with slatted wood ceiling beside the pool', category: 'pool' },
  { src: '/images/beluga/beluga-10.jpg', alt: 'Villa Beluga designer interior, luxury villa Croatia', category: 'interior' },
  { src: '/images/beluga/beluga-11.jpg', alt: 'Villa Beluga contemporary living interior with warm textiles', category: 'interior' },
  { src: '/images/beluga/beluga-12.jpg', alt: 'Villa Beluga interior view of the family living zone', category: 'interior' },
  { src: '/images/beluga/beluga-13.jpg', alt: 'Villa Beluga stone-wall terrace with Mediterranean planting', category: 'exterior' },
  { src: '/images/beluga/beluga-14.jpg', alt: 'Villa Beluga modern interior with natural Istrian light', category: 'interior' },
  { src: '/images/beluga/beluga-15.jpg', alt: 'Villa Beluga interior styling detail, designer furniture', category: 'interior' },
  { src: '/images/beluga/beluga-16.jpg', alt: 'Villa Beluga living space opening to the covered terrace', category: 'interior' },
  { src: '/images/beluga/beluga-17.jpg', alt: 'Villa Beluga double-height living room with corner sofa and kilim rug', category: 'interior' },
  { src: '/images/beluga/beluga-18.jpg', alt: 'Villa Beluga contemporary interior of the family villa', category: 'interior' },
  { src: '/images/beluga/beluga-21.jpg', alt: 'Villa Beluga interior with curated modern decor', category: 'interior' },
  { src: '/images/beluga/beluga-25.jpg', alt: 'Villa Beluga exterior and grounds on a sunny day', category: 'exterior' },
  { src: '/images/beluga/beluga-26.jpg', alt: 'Villa Beluga private heated pool, family villa Istria', category: 'pool' },
  { src: '/images/beluga/beluga-27.jpg', alt: 'Villa Beluga holiday villa exterior, central Istria', category: 'exterior' },
  { src: '/images/beluga/beluga-31.jpg', alt: 'Villa Beluga modern villa among Istrian greenery', category: 'exterior' },
  { src: '/images/beluga/beluga-33.jpg', alt: 'Villa Beluga exterior view with outdoor lounge', category: 'exterior' },
  { src: '/images/beluga/beluga-34.jpg', alt: 'Villa Beluga designer villa exterior, Svetvinčenat, Croatia', category: 'exterior' },
  { src: '/images/beluga/beluga-35.jpg', alt: 'Villa Beluga architecture and garden in the evening light', category: 'exterior' },
  { src: '/images/beluga/beluga-36.jpg', alt: 'Villa Beluga exterior of the luxury family holiday home', category: 'exterior' },
  { src: '/images/beluga/beluga-37.jpg', alt: 'Villa Beluga terrace and exterior, villa with pool Istria', category: 'exterior' },
  { src: '/images/beluga/beluga-38.jpg', alt: 'Villa Beluga grounds and modern facade', category: 'exterior' },
  { src: '/images/beluga/beluga-39.jpg', alt: 'Aerial view of Villa Beluga and Villa Ballena lit up at dusk, Svetvinčenat', category: 'exterior' },
  { src: '/images/beluga/beluga-40.jpg', alt: 'Villa Beluga exterior in the green heart of Istria', category: 'exterior' },
  { src: '/images/beluga/beluga-42.jpg', alt: 'Villa Beluga modern holiday villa exterior view', category: 'exterior' },
  { src: '/images/beluga/dji_0146.jpg', alt: 'Drone view of Villa Beluga and the surrounding Istrian landscape', category: 'exterior' },
  { src: '/images/beluga/img_4759.jpg', alt: 'Villa Beluga contemporary interior with Mediterranean accents', category: 'interior' },
  { src: '/images/beluga/img_4778.jpg', alt: 'Villa Beluga outdoor area with Mediterranean landscaping', category: 'exterior' },
  { src: '/images/beluga/img_4789.jpg', alt: 'Villa Beluga pool deck with sun loungers, dry-stone wall and wisteria', category: 'exterior' },
  { src: '/images/beluga/img_4847.jpg', alt: 'Villa Beluga exterior with green lawn, family villa Croatia', category: 'exterior' },
  { src: '/images/beluga/img_4876.jpg', alt: 'Villa Beluga interior of the open living space', category: 'interior' },
  { src: '/images/beluga/img_4884.jpg', alt: 'Villa Beluga designer interior detail, Istria villa rental', category: 'interior' },
  { src: '/images/beluga/img_4903.jpg', alt: 'Villa Beluga modern interior with warm wood tones', category: 'interior' },
  { src: '/images/beluga/img_4910.jpg', alt: 'Villa Beluga contemporary living interior', category: 'interior' },
  { src: '/images/beluga/img_4958crop.jpg', alt: 'Villa Beluga interior with floor-to-ceiling glazing and modern furniture', category: 'interior' },
  { src: '/images/beluga/img_4968.jpg', alt: 'Villa Beluga family villa interior, Svetvinčenat', category: 'interior' },
  { src: '/images/beluga/img_4979.jpg', alt: 'Villa Beluga interior view with designer furnishings', category: 'interior' },
  { src: '/images/beluga/img_4986.jpg', alt: 'Villa Beluga bright contemporary interior space', category: 'interior' },
  { src: '/images/beluga/img_5002.jpg', alt: 'Villa Beluga en-suite bedroom, one of four', category: 'bedroom' },
  { src: '/images/beluga/img_5164.jpg', alt: 'Villa Beluga interior with natural light and modern design', category: 'interior' },
  { src: '/images/beluga/img_5223.jpg', alt: 'Villa Beluga living interior of the luxury family villa', category: 'interior' },
  { src: '/images/beluga/img_5228.jpg', alt: 'Villa Beluga contemporary interior, holiday villa Istria', category: 'interior' },
  { src: '/images/beluga/img_5240.jpg', alt: 'Villa Beluga exterior and grounds at golden hour', category: 'exterior' },
];

export const allGalleryImages = [
  ...ballenaGallery.map(img => ({ ...img, villa: 'ballena' as const })),
  ...belugaGallery.map(img => ({ ...img, villa: 'beluga' as const })),
  { src: '/images/koridor/img_5216.jpg', alt: 'Corridor between villas with pool view', villa: 'common' as const, category: 'pool' },
  { src: '/images/koridor/img_4961.jpg', alt: 'Shared outdoor terrace area', villa: 'common' as const, category: 'exterior' },
  { src: '/images/koridor/img_5178.jpg', alt: 'Villa complex exterior', villa: 'common' as const, category: 'exterior' },
  { src: '/images/koridor/img_4857.jpg', alt: 'Property grounds with pool', villa: 'common' as const, category: 'pool' },
];
