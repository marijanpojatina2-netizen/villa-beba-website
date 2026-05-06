#!/usr/bin/env node
// IndexNow ping — submits URL(s) to Bing/Yandex/Seznam/Naver indexer.
// Google does NOT support IndexNow; for Google use Search Console manual
// "Request indexing" or the GSC API. ChatGPT/Copilot use Bing's index, so
// IndexNow → Bing → ChatGPT discovery within hours instead of weeks.
//
// Usage:
//   node scripts/indexnow.mjs bulk                   # submit ALL sitemap URLs
//   node scripts/indexnow.mjs <url1> [url2 ...]      # submit specific URLs
//
// URL args may be absolute (https://www.ballenaandbeluga.com/en/blog/foo)
// or path-only (/en/blog/foo) — script normalises to the production host.
//
// Key file at public/919d0a030b15698d7abec3f08916fdd4.txt MUST be deployed
// to production before pinging — IndexNow validates the key by GET-ting
// keyLocation and comparing content. If you rotate the key, update both
// the public/<key>.txt filename AND the KEY constant below in lockstep.

const HOST = 'www.ballenaandbeluga.com';
const KEY = '919d0a030b15698d7abec3f08916fdd4';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function normaliseUrl(input) {
  if (input.startsWith('http://') || input.startsWith('https://')) return input;
  const path = input.startsWith('/') ? input : `/${input}`;
  return `https://${HOST}${path}`;
}

async function fetchSitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status} ${res.statusText}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function pingIndexNow(urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

function decodeStatus(status) {
  // https://www.indexnow.org/documentation
  switch (status) {
    case 200:
      return 'OK — URLs accepted and queued for crawling';
    case 202:
      return 'Accepted — key validation pending; URLs queued';
    case 400:
      return 'Bad request — malformed URLs or missing fields';
    case 403:
      return 'Forbidden — key not found at keyLocation, or key mismatch';
    case 422:
      return 'Unprocessable — URLs not on declared host, or invalid';
    case 429:
      return 'Too many requests — rate-limited; back off and retry';
    default:
      return `Unexpected status ${status}`;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage:');
    console.error('  node scripts/indexnow.mjs bulk');
    console.error('  node scripts/indexnow.mjs <url-or-path> [...]');
    process.exit(1);
  }

  let urls;
  if (args[0] === 'bulk') {
    console.log(`Fetching sitemap from https://${HOST}/sitemap.xml ...`);
    urls = await fetchSitemapUrls();
  } else {
    urls = args.map(normaliseUrl);
  }

  console.log(`Submitting ${urls.length} URL${urls.length === 1 ? '' : 's'} to IndexNow:`);
  for (const url of urls.slice(0, 10)) console.log(`  - ${url}`);
  if (urls.length > 10) console.log(`  ... and ${urls.length - 10} more`);

  const result = await pingIndexNow(urls);
  console.log(`\nStatus: ${result.status} — ${decodeStatus(result.status)}`);
  if (result.body) console.log(`Body: ${result.body}`);

  if (result.status >= 400) process.exit(2);
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
