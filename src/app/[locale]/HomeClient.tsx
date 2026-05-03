// Server-component shell for the home page. Each section is its own client
// island so React can hydrate them independently — the previous monolith was
// one giant `'use client'` boundary that hydrated all 9 sections at once,
// inflating TBT and INP. Per the Performance audit on commit 2ab735f.
import Hero from './_sections/Hero';
import About from './_sections/About';
import VillasShowcase from './_sections/VillasShowcase';
import Beliefs from './_sections/Beliefs';
import BlogPreview from './_sections/BlogPreview';
import ValuesGrid from './_sections/ValuesGrid';
import Amenities from './_sections/Amenities';
import Reviews from './_sections/Reviews';
import CTA from './_sections/CTA';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <VillasShowcase />
      <Beliefs />
      <BlogPreview />
      <ValuesGrid />
      <Amenities />
      <Reviews />
      <CTA />
    </main>
  );
}
