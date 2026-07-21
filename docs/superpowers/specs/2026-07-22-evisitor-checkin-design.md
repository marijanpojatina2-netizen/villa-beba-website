# eVisitor Guest Check-in — Design

**Date:** 2026-07-22
**Status:** Approved (brainstorm with owner, 2026-07-22)

## Goal

Let guests register their personal data online before arrival, so the owner can submit
tourist registrations to the Croatian eVisitor system without retyping passport data.

- Owner creates a unique check-in link per booking and sends it to the guest.
- Guest opens the link, confirms guest count, fills one form per guest — either by
  photographing their ID/passport (AI extracts the fields) or by typing manually —
  reviews, and submits.
- Owner reviews submissions in a password-protected admin page and pushes them to
  eVisitor: copy-paste payload now, real API push once HTZ grants API access (phase 2).

## Scope decisions (agreed)

| Decision | Choice |
|---|---|
| v1 scope | Collect + admin review + semi-automatic eVisitor push (adapter stubbed until API access) |
| Storage | Neon Postgres via Vercel Marketplace (EU region), `@neondatabase/serverless`, plain SQL, no ORM |
| Document images | Processed in memory only, never stored |
| Guest access | Unique random token link per booking (`/checkin/[token]`) |
| Admin auth | Single password from env var → signed httpOnly cookie (30 days) |
| Languages | EN + DE via existing next-intl setup |
| Architecture | Approach A "Lean": server actions, minimal dependencies, existing project patterns |

## Architecture

All inside the existing Next.js app and Vercel deploy.

### Routes

- `/{locale}/checkin/[token]` — guest wizard (EN/DE). `noindex` meta + robots.txt disallow.
- `/admin` — link creation, submission review, eVisitor push. Password login at
  `/admin/login`. `noindex` + robots disallow.
- No public API routes; all mutations are server actions (pattern of `src/app/actions/contact.ts`):
  `createCheckinLink`, `scanDocument`, `submitCheckin`, `adminLogin`, `pushToEvisitor`.
- One cron route for data retention purge (Vercel cron).

### New environment variables

`DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_COOKIE_SECRET`, `ANTHROPIC_API_KEY`,
later `EVISITOR_*` credentials.

## Data model

```sql
checkin_links (
  id, token UNIQUE,            -- ~22 chars, 128-bit random, URL-safe
  villa,                        -- ballena | beluga | both
  arrival_date, departure_date,
  expected_guests,
  status,                       -- pending -> submitted -> pushed
  created_at, submitted_at
)

guests (
  id, link_id -> checkin_links,
  first_name, last_name, gender,
  citizenship,                  -- eVisitor country codelist
  birth_date, birth_place,
  document_type,                -- id_card | passport | other
  document_number,
  residence_country, residence_city,
  arrival_date, departure_date, -- inherited from link, per-guest editable
  pushed_at,
  created_at
)
```

Guest fields map 1:1 to the eVisitor tourist registration form so the phase-2 push is a
pure mapping, no transformation.

## Guest flow (mobile-first wizard)

1. **Intro** — villa name + dates prefilled from the link, short explanation of the legal
   registration requirement, link to privacy policy. Guest confirms/adjusts guest count.
2. **Per guest** — choice: “Scan document” or “Type manually”.
   - **Scan:** camera/file input → client-side downscale to ~1600 px (canvas) → server
     action → Claude vision (`claude-haiku-4-5`) reads the MRZ zone and visual fields →
     returns JSON fields + per-field confidence. The image is discarded after the API
     call; this is stated on screen. MRZ check digits are verified server-side
     (document number, birth date, expiry) to catch misreads mathematically.
   - Fields prefill the form; the guest always reviews and confirms. Low-confidence
     fields are visually highlighted.
   - Scan failure / unreadable document → friendly message, manual entry fallback.
3. **Review all guests → Submit.** Transactional insert; link status → `submitted`.
   Resend email notifies the owner: names and guest count only, **no document numbers
   in email** — details live only in the database/admin.
   Re-opening a submitted link shows a confirmation page, not the form.

## Admin flow + eVisitor adapter

- Dashboard lists links with status; click-through shows full guest data.
- `src/lib/evisitor.ts` exposes `pushGuests(guests): Promise<PushResult>`.
  - **Now:** button renders the exact eVisitor payload for copy-paste (plus CSV export),
    so manual entry into eVisitor is one-screen reading.
  - **Phase 2:** fill the adapter with the HTZ API client; button becomes a real push;
    rows get `pushed_at`, link status → `pushed`.
- **Retention:** cron purges guest rows 90 days after departure — eVisitor is the legal
  record; the site keeps no long-term copy.

## Edge cases & security

- Invalid/expired token → polite “link not valid, contact us” page.
- Double submit (two tabs) → status guard inside the transaction; second submit sees the
  confirmation page, not an error.
- Claude API down → manual entry always available. Resend down → submission still saved
  (email is only a notification).
- Rate limit `scanDocument` (~20 scans per link) to cap API spend.
- Server-side validation: required fields, date sanity, country codes restricted to the
  eVisitor codelist.
- Token is unguessable (128-bit); admin cookie is signed (HMAC) with `ADMIN_COOKIE_SECRET`.

## Testing

- Unit tests via `node --test` (existing GSC test pattern): field validation, MRZ check
  digit verification, eVisitor payload mapping, token generation.
- Manual E2E through preview: scan with a real sample document, manual entry, admin flow,
  double-submit, invalid token.

## Out of scope (v1)

- Real eVisitor API calls (adapter stubbed until HTZ credentials).
- Storing document images in any form.
- Additional languages beyond EN/DE.
- Multi-user admin, roles, audit log.
