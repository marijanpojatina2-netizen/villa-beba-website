import { getBreadcrumbSchema, getArticleSchema } from '@/lib/schema';
import BlogPostContent from './BlogPostClient';

const baseUrl = 'https://www.villabeba.com';

const blogPosts = [
  {
    slug: 'why-istria-luxury-villa-holiday',
    title: "Why Istria Is Croatia's Best-Kept Secret for a Luxury Villa Holiday",
    titleDE: 'Warum Istrien Kroatiens bestgehuetetes Geheimnis fuer einen Luxus-Villenurlaub ist',
    descEN: "Discover why Istria — Croatia's green peninsula — is the ultimate destination for a private luxury villa escape, from truffle forests to medieval villages.",
    descDE: 'Entdecken Sie, warum Istrien — Kroatiens gruene Halbinsel — das ultimative Ziel fuer einen privaten Luxus-Villaurlaub ist.',
    category: 'Destination',
    date: '2026-03-15',
    image: '/images/ballena/ballena-42.jpg',
  },
  {
    slug: 'istrian-food-guide-truffles-olive-oil-wine',
    title: "A Food Lover's Guide to Istria: Truffles, Olive Oil, and the Best Meal You've Never Had",
    titleDE: 'Ein Feinschmecker-Guide fuer Istrien: Trueffel, Olivenoel und das beste Essen, das Sie noch nie hatten',
    descEN: "Explore Istria's extraordinary food scene — from world-class truffles and award-winning olive oils to family-run konobas.",
    descDE: 'Erkunden Sie Istriens aussergewoehnliche Kueche — von Weltklasse-Trueffeln und preisgekroenten Olivenoelen bis zu familiengefuehrten Konobas.',
    category: 'Food & Wine',
    date: '2026-03-01',
    image: '/images/ballena/ballena-35-1.jpg',
  },
  {
    slug: 'things-to-do-near-svetvincenat-istria',
    title: 'Beyond the Villa: 10 Unforgettable Experiences in Istria',
    titleDE: 'Jenseits der Villa: 10 unvergessliche Erlebnisse in Istrien',
    descEN: "From truffle hunting to Roman amphitheaters — the best things to do near Svetvinčenat, Istria, all within an hour of your luxury villa.",
    descDE: 'Von der Trueffelsuche bis zum roemischen Amphitheater — die besten Aktivitaeten nahe Svetvinčenat, alle innerhalb einer Stunde.',
    category: 'Experiences',
    date: '2026-02-15',
    image: '/images/beluga/beluga-42.jpg',
  },
];

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const isDE = locale === 'de';
  const post = blogPosts.find((p) => p.slug === slug) ?? blogPosts[0];

  const title = isDE ? post.titleDE : post.title;
  const description = isDE ? post.descDE : post.descEN;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.image ? [{ url: `${baseUrl}${post.image}`, width: 1200, height: 630 }] : [],
      type: 'article',
      publishedTime: post.date,
    },
    twitter: { card: 'summary_large_image' as const, title, description },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: { en: `${baseUrl}/en/blog/${slug}`, de: `${baseUrl}/de/blog/${slug}` },
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isDE = locale === 'de';
  const post = blogPosts.find((p) => p.slug === slug) ?? blogPosts[0];

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.descEN,
    slug: post.slug,
    datePublished: post.date,
    image: post.image,
    locale,
  });

  const breadcrumb = getBreadcrumbSchema([
    { name: isDE ? 'Startseite' : 'Home', url: `/${locale}` },
    { name: 'Journal', url: `/${locale}/blog` },
    { name: isDE ? post.titleDE : post.title, url: `/${locale}/blog/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <BlogPostContent slug={slug} />
    </>
  );
}
