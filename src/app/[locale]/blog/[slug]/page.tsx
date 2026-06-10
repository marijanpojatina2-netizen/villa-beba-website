import { notFound } from 'next/navigation';
import { getBreadcrumbSchema, getArticleSchema } from '@/lib/schema';
import { blogPosts, findBlogPost } from '@/lib/blog';
import JsonLd from '@/components/JsonLd';
import BlogPostContent from './BlogPostClient';

const baseUrl = 'https://www.ballenaandbeluga.com';

// Hard 404 for any slug not in `blogPosts`. Without this, Next.js renders the
// fallback (formerly `?? blogPosts[0]`), which serves the first post under
// arbitrary URLs — Google indexes them as duplicate content. Pair with
// `dynamicParams = false` so unknown slugs short-circuit before render.
export const dynamicParams = false;

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const isDE = locale === 'de';
  const post = findBlogPost(slug);
  if (!post) notFound();

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
      languages: { en: `${baseUrl}/en/blog/${slug}`, de: `${baseUrl}/de/blog/${slug}`, 'x-default': `${baseUrl}/en/blog/${slug}` },
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
  const post = findBlogPost(slug);
  if (!post) notFound();

  const articleSchema = getArticleSchema({
    title: isDE ? post.titleDE : post.title,
    description: isDE ? post.descDE : post.descEN,
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
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumb} />
      <BlogPostContent slug={slug} />
    </>
  );
}
