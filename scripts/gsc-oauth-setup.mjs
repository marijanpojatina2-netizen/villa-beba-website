#!/usr/bin/env node
// One-time OAuth setup for the weekly GSC report. Run this locally ONCE:
//   node scripts/gsc-oauth-setup.mjs
//
// It opens a Google consent screen in your browser, then prints a refresh
// token. Store the three printed values as GitHub repo secrets
// (GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN).
// The weekly-gsc-report.yml workflow then authenticates as the Google
// account that owns the Search Console property — no service account, so
// it is unaffected by Google's "email not found" service-account bug.
//
// Prerequisite: a Google Cloud OAuth client of type "Desktop app" — see
// docs/seo/gsc-report-setup.md.

import { createServer } from 'node:http';
import { createInterface } from 'node:readline/promises';
import { spawn } from 'node:child_process';
import { OAuth2Client } from 'google-auth-library';

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const PORT = 4100;
const REDIRECT = `http://localhost:${PORT}`;

async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

async function main() {
  const clientId = process.env.GSC_OAUTH_CLIENT_ID || (await ask('OAuth Client ID: '));
  const clientSecret =
    process.env.GSC_OAUTH_CLIENT_SECRET || (await ask('OAuth Client Secret: '));
  if (!clientId || !clientSecret) {
    throw new Error('Client ID and Client Secret are both required');
  }

  const client = new OAuth2Client(clientId, clientSecret, REDIRECT);
  const authUrl = client.generateAuthUrl({
    access_type: 'offline', // request a refresh token
    response_type: 'code', // OAuth authorization-code flow (required)
    prompt: 'consent', // force a fresh refresh token every run
    scope: [SCOPE],
  });

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, REDIRECT);
      const authCode = url.searchParams.get('code');
      const authError = url.searchParams.get('error');
      // Ignore unrelated requests (e.g. the browser's favicon probe).
      if (!authCode && !authError) {
        res.statusCode = 204;
        res.end();
        return;
      }
      res.end(
        authCode
          ? 'Authorisation complete — close this tab and return to the terminal.'
          : `Authorisation failed: ${authError}`,
      );
      server.close();
      if (authCode) resolve(authCode);
      else reject(new Error(authError));
    });
    server.listen(PORT, () => {
      console.log('\nOpen this URL in your browser and grant access:\n');
      console.log(`  ${authUrl}\n`);
      console.log('(Waiting for you to finish in the browser...)');
      // Best-effort auto-open on Windows; harmless if it fails.
      try {
        spawn('cmd', ['/c', 'start', '', authUrl], { stdio: 'ignore', detached: true });
      } catch {
        /* user opens the URL manually */
      }
    });
  });

  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      'No refresh token returned. Re-run the script and make sure you fully approve the consent screen.',
    );
  }

  console.log('\n=== SUCCESS — store these three as GitHub repo secrets ===\n');
  console.log(`GSC_OAUTH_CLIENT_ID      =  ${clientId}`);
  console.log(`GSC_OAUTH_CLIENT_SECRET  =  ${clientSecret}`);
  console.log(`GSC_OAUTH_REFRESH_TOKEN  =  ${tokens.refresh_token}`);
  console.log('\nKeep these private — they grant read access to your Search Console data.');
}

main().catch((err) => {
  console.error('OAuth setup failed:', err.message);
  process.exit(1);
});
