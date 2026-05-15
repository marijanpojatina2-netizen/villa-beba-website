// Generate copy-paste-ready Google Business Profile "Update" posts for the
// latest guide (or a specified slug). Run after a guide ships to production —
// pastes into BOTH Villa Ballena and Villa Beluga GBP listings.
//
// Usage:
//   npm run gbp-draft                         # latest guide, English
//   npm run gbp-draft -- --lang de            # latest guide, German
//   npm run gbp-draft -- --slug <slug>        # specific guide
//   npm run gbp-draft -- --slug <slug> --lang de
//
// Why a helper instead of the GBP API: the Posts API requires a separate
// Google-side approval form (~1-4 weeks) AND both listings to be fully
// verified. Both are gated as of 2026-05-13. This helper covers the same
// daily workflow with zero auth setup and ~3 min of clicking per guide.

import { guides, type Guide } from '../src/lib/guides';
import { VILLAS } from '../src/lib/contact';

const PRODUCTION_HOST = 'https://www.ballenaandbeluga.com';
const GBP_POST_CHAR_LIMIT = 1500;

type Lang = 'en' | 'de';

function parseArgs(argv: string[]): { slug?: string; lang: Lang } {
  let slug: string | undefined;
  let lang: Lang = 'en';
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug' && argv[i + 1]) {
      slug = argv[++i];
    } else if (a === '--lang' && argv[i + 1]) {
      const v = argv[++i];
      if (v === 'en' || v === 'de') lang = v;
      else throw new Error(`--lang must be 'en' or 'de', got '${v}'`);
    }
  }
  return { slug, lang };
}

function pickGuide(slug?: string): Guide {
  if (slug) {
    const g = guides.find(x => x.slug === slug);
    if (!g) throw new Error(`Guide with slug '${slug}' not found in src/lib/guides.ts`);
    return g;
  }
  // Latest by datePublished — ISO-8601 dates sort lexicographically
  const sorted = [...guides].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
  return sorted[0];
}

function buildPostBody(guide: Guide, lang: Lang): string {
  const loc = guide[lang];
  const guideUrl = `${PRODUCTION_HOST}/${lang}/guides/${guide.slug}`;
  const cta = lang === 'de'
    ? `\n\nDen vollständigen Leitfaden lesen: ${guideUrl}`
    : `\n\nRead the full guide: ${guideUrl}`;

  // Use the intro as the lead — that's where each guide's voice lands.
  // Truncate at a sentence boundary if intro + cta > char limit.
  const naive = loc.intro + cta;
  if (naive.length <= GBP_POST_CHAR_LIMIT) return naive;

  const room = GBP_POST_CHAR_LIMIT - cta.length;
  const truncated = loc.intro.slice(0, room);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('! '),
    truncated.lastIndexOf('? '),
  );
  const trimmedIntro = lastSentenceEnd > 0
    ? truncated.slice(0, lastSentenceEnd + 1)
    : truncated.trimEnd() + '…';
  return trimmedIntro + cta;
}

function buttonText(lang: Lang): string {
  return lang === 'de' ? 'Leitfaden lesen' : 'Read the guide';
}

function main(): void {
  const { slug, lang } = parseArgs(process.argv.slice(2));
  const guide = pickGuide(slug);
  const loc = guide[lang];
  const guideUrl = `${PRODUCTION_HOST}/${lang}/guides/${guide.slug}`;
  const heroUrl = guide.hero
    ? `${PRODUCTION_HOST}${guide.hero.src}`
    : '(no hero image set — add hero to guides.ts before posting)';
  const body = buildPostBody(guide, lang);

  const sep = '─'.repeat(72);

  console.log('');
  console.log(sep);
  console.log(`  GBP Post Draft  ·  ${loc.title}`);
  console.log(`  slug: ${guide.slug}  ·  lang: ${lang}  ·  published: ${guide.datePublished}`);
  console.log(`  body: ${body.length} / ${GBP_POST_CHAR_LIMIT} chars  ·  hero: ${guide.hero ? 'yes' : 'MISSING'}`);
  console.log(sep);

  console.log('\n┌─ Post body (copy this whole block into the GBP "Update" field) ─');
  console.log(body.split('\n').map(l => `│ ${l}`).join('\n'));
  console.log('└────────────────────────────────────────────────────────────────');

  console.log('\nImage URL:');
  console.log(`  ${heroUrl}`);
  console.log('  (right-click → Save As, or drag the URL into the GBP image upload field)');

  console.log('\nCTA button:');
  console.log(`  Text: "${buttonText(lang)}"`);
  console.log(`  URL:  ${guideUrl}`);

  console.log('\nWhere to post (BOTH listings, same content):');
  for (const [key, villa] of Object.entries(VILLAS) as [keyof typeof VILLAS, typeof VILLAS[keyof typeof VILLAS]][]) {
    const label = villa.name.padEnd(14);
    // VILLAS is `as const`, so villa.gbpUrl is a string-literal type. Widen to
    // `string` before the truthiness check — otherwise, once every listing has
    // a URL set, the `else` branch becomes unreachable and TS narrows `villa`
    // to `never`, breaking villa.name below.
    const gbpUrl: string = villa.gbpUrl;
    if (gbpUrl) {
      console.log(`  ${label}  ${gbpUrl}`);
    } else {
      console.log(`  ${label}  (gbpUrl not set in src/lib/contact.ts — visit https://business.google.com/dashboard and pick "${villa.name}")`);
    }
  }

  console.log('\nSteps for each listing:');
  console.log('  1. Open the listing → Posts (or "Add update")');
  console.log('  2. Paste post body above');
  console.log('  3. Upload the hero image');
  console.log('  4. Click "Add a button" → choose "Learn more" → paste guide URL');
  console.log('  5. Publish');
  console.log('');
  console.log('When both GBP listings are verified AND VILLAS.{ballena,beluga}.gbpUrl');
  console.log('are populated in src/lib/contact.ts, the URLs above become click-through.');
  console.log('');
}

main();
