# eVisitor Guest Check-in — Setup & Daily Use

Feature branch: `feature/evisitor-checkin`. Guest wizard: `/en/checkin/<token>` +
`/de/checkin/<token>`. Admin: `/admin`. Spec:
`docs/superpowers/specs/2026-07-22-evisitor-checkin-design.md`.

## 1. One-time setup

### a) Create the Neon database (EU region)

1. Vercel dashboard → your project → **Storage** → **Create Database** → **Neon**.
2. Pick region **Frankfurt (eu-central-1)** — keeps guest data in the EU (GDPR).
3. Connect it to the project. Vercel auto-adds `DATABASE_URL` to the project env.
4. Pull it locally (or copy from dashboard into `.env.local`):

```powershell
npm i -g vercel        # if not installed
vercel env pull .env.local
```

### b) Apply the schema

PowerShell:

```powershell
$env:DATABASE_URL="postgres://...copy from Neon..."; node scripts/db-setup.mjs
```

Expected output ends with `Schema ready.`

### c) Set the remaining env vars

Generate secrets:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Add in **Vercel → Settings → Environment Variables** (Production + Preview) and in
`.env.local`:

| Var | Value |
|---|---|
| `DATABASE_URL` | added automatically by Neon integration |
| `ADMIN_PASSWORD` | your chosen strong password for `/admin` |
| `ADMIN_COOKIE_SECRET` | output of the generator above |
| `CRON_SECRET` | output of the generator above (run it again) |
| `ANTHROPIC_API_KEY` | from console.anthropic.com → API keys (needed for document scan) |
| `RESEND_API_KEY` | already configured (contact form) |
| `OWNER_EMAIL` | already configured (Gmail override) |

### d) Deploy

Merge `feature/evisitor-checkin` into `v7-light` and push — auto-promotes to
production. The cron in `vercel.json` (daily 03:00 UTC) registers on deploy.

## 2. Daily flow

1. Open **ballenaandbeluga.com/admin** → log in.
2. **New check-in link**: pick villa, dates, guest count → *Create link*.
3. Copy the link (or *Share via WhatsApp*) and send it to the guest.
4. Guest fills the wizard — scans ID/passport (AI prefills, photo never stored)
   or types manually — reviews and submits.
5. You get an email (names only, no document numbers). Open the link detail in
   `/admin` → **eVisitor payload** section.
6. Enter guests at [evisitor.hr](https://www.evisitor.hr) using the payload /
   CSV → click **Mark as entered in eVisitor**.

Data is deleted automatically 90 days after departure (eVisitor is the legal
record; the site keeps no long-term copy).

## 3. Phase 2 — real eVisitor API push

1. Request API access from the Croatian National Tourist Board (HTZ) for the
   eVisitor system (they issue technical credentials per obveznik).
2. Implement the push in `src/lib/checkin/evisitor.ts` (payload mapping already
   matches the eVisitor tourist form 1:1) and wire the admin button in
   `src/app/admin/links/[id]/page.tsx` to a new server action.
3. Store credentials as `EVISITOR_*` env vars — never in the repo.

## 4. Notes

- Scan model: `claude-opus-4-8` (constant `SCAN_MODEL` in
  `src/app/actions/checkin.ts`); ~<1 cent per scan, 20 scans max per link.
- Admin session lasts 30 days; log out from the dashboard.
- Unit tests: `npm run test:checkin`.
