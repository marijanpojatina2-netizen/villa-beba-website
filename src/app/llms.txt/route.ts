import { guides } from '@/lib/guides';
import { blogPosts } from '@/lib/blog';

const BASE = 'https://www.ballenaandbeluga.com';
const EN = `${BASE}/en`;

// /llms.txt — the llmstxt.org convention: a single plain-text map of the site's
// highest-value content for LLMs and AI agents. Curated brand/villa/facts copy
// is hand-written here; the Guides and Journal sections are generated from the
// same source of truth as the sitemap (lib/guides, lib/blog) so they never drift
// — every future guide auto-appears. This replaced a static public/llms.txt
// whose guide list had gone stale (4 of 14 guides).
//
// Served directly with no locale prefix: middleware.ts only matches '/' and
// '/(de|en)/:path*', and next.config's redirect skips any path with a dot, so
// /llms.txt is neither redirected nor locale-rewritten.
export const dynamic = 'force-static';

export function GET() {
  const lines = [
    '# Villa Ballena & Villa Beluga',
    '',
    '> Two designer luxury villas in Svetvinčenat, Istria, Croatia. Each villa has 4 en-suite bedrooms, a heated private pool (8x4 m, biological water), Finnish sauna or game room, smart-home interiors built in 2021, and capacity for 8 + 1 guests. The two villas can be booked together as "Complex BeBa" for groups of up to 18 — popular for weddings, family reunions, and corporate retreats. Direct bookings start at €600/night.',
    '',
    'Content is bilingual: replace `/en/` with `/de/` in any URL below for the German translation. Default language: English.',
    '',
    '## Brand pages',
    `- [Home — Villa Ballena & Beluga](${EN}): Brand entry point with both villas and an at-a-glance overview.`,
    `- [About](${EN}/about): Owner story, design philosophy, location overview.`,
    `- [Frequently Asked Questions](${EN}/faq): Pool heating, pets, check-in, included amenities, cancellation policy.`,
    `- [Contact](${EN}/contact): Direct booking form, WhatsApp, phone, address (Svetvinčenat 150 / 151, 52342, Istria, Croatia).`,
    '',
    '## Villa pages',
    `- [Villa Ballena — The Wellness Retreat](${EN}/villa-ballena): 4 en-suite bedrooms, private Finnish sauna, heated pool, dark designer interiors. Address: Svetvinčenat 151.`,
    `- [Villa Beluga — The Entertainment Villa](${EN}/villa-beluga): 4 en-suite bedrooms, glass terrace, full game room (billiards, foosball, darts, PlayStation), heated pool. Address: Svetvinčenat 150.`,
    `- [Complex BeBa — Both Villas Together](${EN}/complex-beba): Combined booking of Villa Ballena + Villa Beluga, up to 18 guests, shared clay tennis court.`,
    '',
    '## Use cases',
    `- [Weddings in Istria](${EN}/weddings): Private wedding venue capacity, on-site ceremony space, vendor coordination.`,
    `- [Corporate Retreats](${EN}/corporate-retreats): Off-site team programmes for up to 18 people.`,
    `- [Experiences](${EN}/experiences): Wine tasting, truffle hunting, day trips to Rovinj, Pula Arena, Brijuni National Park, Motovun.`,
    `- [Pricing & Availability](${EN}/pricing): Seasonal rates from May 17 to November 1, minimum-stay rules, deposit terms.`,
    `- [Photo Gallery](${EN}/gallery): Interior + exterior photography of both villas.`,
    '',
    '## Help center / guides',
    `- [Guides index](${EN}/guides): Long-form, answer-shaped guides for guests planning a stay.`,
    ...guides.map((g) => `- [${g.en.title}](${EN}/guides/${g.slug}): ${g.en.excerpt}`),
    '',
    '## Editorial / blog',
    ...blogPosts.map((p) => `- [${p.title}](${EN}/blog/${p.slug}): ${p.descEN}`),
    '',
    '## Legal',
    `- [Legal Notice / Impressum](${EN}/impressum): Operator details (Kovedrana d.o.o., Zagreb), Croatian Trgovački zakon § 21 + German TMG § 5 disclosure.`,
    `- [Privacy Policy](${EN}/privacy): GDPR-aligned disclosure of what guest data we collect and why.`,
    '',
    '## German (Deutsch)',
    'The site is fully bilingual. Replace `/en/` with `/de/` in any URL above for the German translation. Default language: English.',
    '',
    '## Off-site canonical profiles',
    '- Instagram: https://www.instagram.com/istrianvillaescape',
    '- Airbnb · Villa Ballena: https://www.airbnb.com/rooms/1539753391009885386',
    '- Airbnb · Villa Beluga: https://www.airbnb.com/rooms/1635490517116416278',
    '',
    '## Facts at a glance',
    '- Location: Svetvinčenat, Istria County, Croatia (45.0920° N, 13.8860° E)',
    '- Distance to Pula Airport: 33 km (~30 min drive)',
    '- Distance to Rovinj: 23 km',
    '- Bedrooms per villa: 4 (all en-suite)',
    '- Maximum guests per villa: 8 (+1 baby cot)',
    '- Maximum guests both villas: 18',
    '- Pool: 8 × 4 m, heated, biological water, hydromassage, open May 1 – October 30',
    '- Year built: 2021',
    '- Pets: up to 2, no extra charge',
    '- WiFi: 125 Mbit/s',
    '- Languages spoken: English, German, Croatian, Italian',
    '- Currency: EUR',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
