import { getBreadcrumbSchema, getArticleSchema } from '@/lib/schema';
import BlogPostContent from './BlogPostClient';

const baseUrl = 'https://www.villabeba.com';

const blogPosts = [
  { slug: 'truffle-season-in-istria', title: 'Truffle Season in Istria: A Complete Guide', category: 'Experiences', date: '2026-02-15', image: '/images/ballena/ballena-35-1.jpg', titleDE: 'Trüffelsaison in Istrien: Ein vollständiger Leitfaden', descDE: 'Entdecken Sie wann und wo Sie die kostbaren weißen und schwarzen Trüffel Istriens finden.', descEN: 'Discover when and where to find the prized white and black truffles of Istria.' },
  { slug: 'rovinj-gem-of-the-adriatic', title: 'Rovinj: The Gem of the Adriatic Coast', category: 'Destination', date: '2026-02-01', image: '/images/beluga/beluga-42.jpg', titleDE: 'Rovinj: Das Juwel der Adriaküste', descDE: 'Nur 23 km von unseren Villen entfernt besticht Rovinj mit seinem pastellfarbenen Hafen.', descEN: 'Just 23 km from our villas, Rovinj enchants with its pastel harbor and cobblestone streets.' },
  { slug: 'best-beaches-near-svetvincenat', title: 'Best Beaches Near Svetvincenat', category: 'Destination', date: '2026-01-20', image: '/images/beluga/beluga-25.jpg', titleDE: 'Die besten Strände nahe Svetvincenat', descDE: 'Kristallklares Adriawasser erwartet Sie an versteckten Buchten.', descEN: 'Crystal-clear Adriatic waters await at hidden coves and sandy shores.' },
  { slug: 'istrian-wine-journey', title: 'Istrian Wine: A Journey Through Vineyards', category: 'Experiences', date: '2026-01-10', image: '/images/beluga/beluga-13.jpg', titleDE: 'Istrischer Wein: Eine Reise durch die Weinberge', descDE: 'Malvazija, Teran und Muskat — istrische Weine erobern die Welt.', descEN: 'Malvazija, Teran, and Muskat — Istrian wines are making waves worldwide.' },
  { slug: 'planning-the-perfect-istrian-wedding', title: 'Planning the Perfect Istrian Wedding', category: 'Events', date: '2025-12-28', image: '/images/ballena/ballena-42.jpg', titleDE: 'Die perfekte Hochzeit in Istrien planen', descDE: 'Von mittelalterlichen Burgen bis zu Zeremonien unter Sternen am Pool.', descEN: 'From medieval castles to poolside ceremonies under the stars.' },
  { slug: 'family-friendly-activities-central-istria', title: 'Family-Friendly Activities in Central Istria', category: 'Seasonal', date: '2025-12-15', image: '/images/beluga/beluga-36.jpg', titleDE: 'Familienfreundliche Aktivitäten in Zentralistrien', descDE: 'Unterhalten Sie die ganze Familie mit Wasserparks und mittelalterlichen Dörfern.', descEN: 'Keep the whole family entertained with water parks and medieval villages.' },
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
    { name: post.title, url: `/${locale}/blog/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <BlogPostContent slug={slug} />
    </>
  );
}
