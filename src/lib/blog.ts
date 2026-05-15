// Single source of truth for blog post metadata. Imported by:
//   - src/app/[locale]/blog/page.tsx          (index list)
//   - src/app/[locale]/blog/[slug]/page.tsx   (generateStaticParams + per-post metadata)
//   - src/app/[locale]/blog/[slug]/BlogPostClient.tsx (post-content lookup)
//   - src/app/sitemap.ts                      (sitemap entries)
// Drift between sitemap and routes was producing soft-404s (sitemap promoted
// 6 slugs that fell through to the first post via a `?? blogPosts[0]`
// fallback). Centralising the array here makes the drift impossible.

export type BlogPost = {
  slug: string;
  title: string;
  titleDE: string;
  descEN: string;
  descDE: string;
  category: string;
  date: string;
  image: string;
};

export const blogPosts: readonly BlogPost[] = [
  {
    slug: 'why-istria-luxury-villa-holiday',
    title: "Why Istria Is Croatia's Best-Kept Secret for a Luxury Villa Holiday",
    titleDE: 'Warum Istrien Kroatiens bestgehütetes Geheimnis für einen Luxus-Villenurlaub ist',
    descEN: "Discover why Istria — Croatia's green peninsula — is the ultimate destination for a private luxury villa escape, from truffle forests to medieval villages.",
    descDE: 'Entdecken Sie, warum Istrien — Kroatiens grüne Halbinsel — das ultimative Ziel für einen privaten Luxus-Villaurlaub ist.',
    category: 'Destination',
    date: '2026-03-15',
    image: '/images/ballena/ballena-42.jpg',
  },
  {
    slug: 'istrian-food-guide-truffles-olive-oil-wine',
    title: "A Food Lover's Guide to Istria: Truffles, Olive Oil, and the Best Meal You've Never Had",
    titleDE: 'Ein Feinschmecker-Guide für Istrien: Trüffel, Olivenöl und das beste Essen, das Sie noch nie hatten',
    descEN: "Explore Istria's extraordinary food scene — from world-class truffles and award-winning olive oils to family-run konobas.",
    descDE: 'Erkunden Sie Istriens außergewöhnliche Küche — von Weltklasse-Trüffeln und preisgekrönten Olivenölen bis zu familiengeführten Konobas.',
    category: 'Food & Wine',
    date: '2026-03-01',
    image: '/images/experiences/tartufi.jpg',
  },
  {
    slug: 'things-to-do-near-svetvincenat-istria',
    title: 'Beyond the Villa: 10 Unforgettable Experiences in Istria',
    titleDE: 'Jenseits der Villa: 10 unvergessliche Erlebnisse in Istrien',
    descEN: "From truffle hunting to Roman amphitheaters — the best things to do near Svetvinčenat, Istria, all within an hour of your luxury villa.",
    descDE: 'Von der Trüffelsuche bis zum römischen Amphitheater — die besten Aktivitäten nahe Svetvinčenat, alle innerhalb einer Stunde.',
    category: 'Experiences',
    date: '2026-02-15',
    image: '/images/experiences/pula-arena.jpg',
  },
] as const;

export function findBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
