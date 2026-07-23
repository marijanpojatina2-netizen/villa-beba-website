-- scripts/checkin-schema.sql
CREATE TABLE IF NOT EXISTS checkin_links (
  id              SERIAL PRIMARY KEY,
  token           TEXT UNIQUE NOT NULL,
  villa           TEXT NOT NULL CHECK (villa IN ('ballena','beluga','both')),
  arrival_date    DATE NOT NULL,
  departure_date  DATE NOT NULL,
  expected_guests INT  NOT NULL DEFAULT 2 CHECK (expected_guests BETWEEN 1 AND 20),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','submitted','pushed')),
  scan_count      INT  NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS guests (
  id                SERIAL PRIMARY KEY,
  link_id           INT NOT NULL REFERENCES checkin_links(id) ON DELETE CASCADE,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  gender            TEXT NOT NULL CHECK (gender IN ('M','F')),
  citizenship       TEXT NOT NULL,
  birth_date        DATE NOT NULL,
  birth_place       TEXT NOT NULL DEFAULT '',
  document_type     TEXT NOT NULL CHECK (document_type IN ('id_card','passport','other')),
  document_number   TEXT NOT NULL,
  residence_country TEXT NOT NULL,
  residence_city    TEXT NOT NULL,
  arrival_date      DATE NOT NULL,
  departure_date    DATE NOT NULL,
  pushed_at         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guests_link_id_idx ON guests(link_id);

-- v2 (2026-07-23): align fields with the official eVisitor form.
-- birth_country is required by eVisitor; birth_place/residence_city are only
-- required when the respective country is Croatia. arrival_organization
-- (osobno vs agencija) is set by the owner when creating the link.
ALTER TABLE guests ADD COLUMN IF NOT EXISTS birth_country TEXT NOT NULL DEFAULT '';
ALTER TABLE checkin_links ADD COLUMN IF NOT EXISTS arrival_organization TEXT NOT NULL DEFAULT 'osobno';

-- v3 (2026-07-23): real eVisitor Web API push. evisitor_id is the GUID we
-- generate for CheckInTourist (needed later for checkout/cancel); push_error
-- keeps the per-guest API error for display in admin.
ALTER TABLE guests ADD COLUMN IF NOT EXISTS evisitor_id TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS push_error TEXT;
