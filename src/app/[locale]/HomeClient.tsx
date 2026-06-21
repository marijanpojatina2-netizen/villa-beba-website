// Server-component shell for the home page. Each section is its own client
// island so React can hydrate them independently — the previous monolith was
// one giant `'use client'` boundary that hydrated all 9 sections at once,
// inflating TBT and INP. Per the Performance audit on commit 2ab735f.
import Hero from './_sections/Hero';
import About from './_sections/About';
import VillasShowcase from './_sections/VillasShowcase';
import Beliefs from './_sections/Beliefs';
import LocationLifestyle from './_sections/LocationLifestyle';
import BlogPreview from './_sections/BlogPreview';
import GuidesPreview from './_sections/GuidesPreview';
import ValuesGrid from './_sections/ValuesGrid';
import Amenities from './_sections/Amenities';
import Reviews from './_sections/Reviews';
import CTA from './_sections/CTA';

export default function HomePage({ locale }: { locale: string }) {
  return (
    <main>
      <Hero />
      <About />
      <VillasShowcase />
      <Beliefs />
      {/* Server-rendered, copy-rich SEO section — see comment in
          LocationLifestyle.tsx. Placed after Beliefs so the home page
          surfaces the brand's location/lifestyle pitch before the blog
          previews and values grid. */}
      <LocationLifestyle locale={locale} />
      <BlogPreview />
      <GuidesPreview locale={locale} />
      <ValuesGrid />
      <Amenities />
      <Reviews />
      <CTA />
    </main>
  );
}
