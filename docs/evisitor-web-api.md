# eVisitor Web API — implementation notes (phase 2)

Source: https://www.evisitor.hr/eVisitorWiki/Javno.Web-API.ashx (fetched 2026-07-23;
the wiki redirect-loops without cookies — fetch with a cookie jar and
`?AspxAutoDetectCookieSupport=1`). Related pages: "Web API - Lista šifrarnika",
"WEB API - Novosti".

## Access

- REST root (production): `https://www.evisitor.hr/eVisitorRhetos_API/Rest/`
- Login: `POST https://www.evisitor.hr/eVisitorRhetos_API/Resources/AspNetFormsAuth/Authentication/Login`
  body `{"userName": "...", "password": "..."}` → `true`/`false`.
  **Production uses the obveznik's regular eVisitor credentials** (API key is
  required only on the test platform). Response sets cookies (authentication,
  affinity, language) — **all cookies must be echoed on every subsequent call**,
  joined with `;` (space-joined cookies get rejected by the WAF with "The
  requested URL was rejected").
- Logout: same service, no params.
- Test env: app `https://www.evisitor.hr/test`, API root
  `https://www.evisitor.hr/testApi/...` — separate credentials + API key,
  requested via the local tourist board (docs: "Testna okolina - pristupni
  podaci.docx" attachment on the wiki page). Test data is a stale prod snapshot.
- All parameters JSON; dates in .NET JSON format `"\/Date(1426028400000+0100)\/"`
  **except where a resource specifies otherwise** — CheckInTourist uses plain
  `YYYYMMDD` strings.

## Resource kinds

- **Entity** (CRUD), **Browse** (read-only lookups, e.g.
  `GET .../Rest/Htz/Country/`), **Action** (verbs, e.g.
  `POST .../Rest/Htz/CheckInTourist/`).

## CheckInTourist (`POST .../Rest/Htz/CheckInTourist/`)

All fields required unless noted. Our field mapping in parentheses.

| API field | Notes (our source) |
|---|---|
| `ID` (guid) | client-generated; keep it — needed for CheckOutTourist / change / CancelTouristCheckIn (store on `guests` row when pushing) |
| `Facility` | eVisitor facility code of the villa (env `EVISITOR_FACILITY_BALLENA` / `_BELUGA`; visible in the owner's eVisitor account) |
| `AccommodationUnitType` | optional; from browse `AccommodationUnitFacilityType` filtered by FacilityCode |
| `ArrivalOrganisation` | `CodeMI` from browse `ArrivalOrganisationLookup` (our `checkin_links.arrival_organization`: osobno/agencija) |
| `TouristAgency` | OIB/VAT of agency — REQUIRED when ArrivalOrganisation is "Agencijski", omit for "Osoban" (browse `TouristAgencyBrowse`) |
| `TouristName` / `TouristSurname` | guest first/last name (`TouristMiddleName` optional) |
| `Gender` | "ženski"/"muški" (verify against GenderLookup) |
| `DateOfBirth` | `YYYYMMDD` (our `birth_date` reformatted) |
| `Citizenship` | ISO **alpha-3** (DEU, HRV…) — convert via `toAlpha3()` in `src/lib/checkin/evisitor.ts` |
| `CountryOfBirth` | alpha-3 |
| `CityOfBirth` | required for everyone: HR-born → settlement codelist format "Grad-Naselje" (e.g. "Zagreb-Adamovec"); foreign → free text |
| `CountryOfResidence` | alpha-3 |
| `CityOfResidence` | required for everyone; same HR-settlement rule |
| `ResidenceAddress` | optional street+number |
| `DocumentType` | CODE from `DocumentTtypeLookup` browse (map our id_card/passport/other at push time) |
| `DocumentNumber` | our `document_number` |
| `StayFrom` + `TimeStayFrom` | `YYYYMMDD` + `hh:mm` (our arrival date + 16:00 default). Obveznik cannot change these later. |
| `ForeseenStayUntil` + `TimeEstimatedStayUntil` | `YYYYMMDD` + `hh:mm` (departure + 10:00) |
| `OfferedServiceType` | naziv vrste pružene usluge (lookup; typically "noćenje") |
| `TTPaymentCategory` | code; must be allowed for the facility — browse `TTPaymentCategoryLookup2` filtered by FacilityID (we derive the age-based category; map to codes at push) |
| `IsTTFlatRatePaymentVacationHome` | optional (paušal for vacation homes; not our case) |
| `TouristEmail` / `TouristTelephone` | optional, validated formats |

Key validations enforced server-side: departure > arrival; duplicate check-in
(same facility+birth date+document+residence, still active) rejected; **non-EU
residence country requires `BorderCrossingHr` + `PassageDate`** (border crossing
+ date of entering Croatia — affects GB/US/CH? guests: CH is not EU — check
IsEUMember flag in the Country browse; may require adding these two fields to
the wizard for non-EU residents in phase 2); max stay length; TTPaymentCategory
must be valid for the facility.

## Other useful actions

- `CheckOutTourist` — `{ID, CheckOutDate: YYYYMMDD, CheckOutTime: hh:mm}` (early
  departures: just check out, actual date/time auto-updates).
- `CancelTouristCheckIn` — `{ID, Reason}` for mistaken check-ins.
- Changing an active check-in: call `CheckInTourist` again with the same `ID`
  and ALL fields.
- Lookups (browse GETs, cache them): `Country` (has alpha-3 + IsEUMember),
  `DocumentTtypeLookup`, `ArrivalOrganisationLookup`, `TTPaymentCategoryLookup2`,
  `FacilityTouristCheckInLookup`, settlement codelist for HR cities.

## Implementation plan (when owner provides credentials)

1. Env vars: `EVISITOR_USERNAME`, `EVISITOR_PASSWORD` (recommend creating a
   dedicated additional user in eVisitor for the integration),
   `EVISITOR_FACILITY_BALLENA`, `EVISITOR_FACILITY_BELUGA`.
2. `src/lib/checkin/evisitor-api.ts`: login → cookie jar → cached lookups →
   `pushGuests(link, guests)` calling CheckInTourist per guest with generated
   GUIDs; store returned/sent GUID per guest (`guests.evisitor_id` column) for
   later checkout/cancel.
3. Admin button flips from copy-paste payload to live push when env vars are
   present; per-guest success/error report in admin UI.
4. Optional: test-environment dry run first (request test credentials via TZ
   Svetvinčenat).
5. Debugging etiquette per HTZ: reproduce with curl/Postman before contacting
   support; include timestamp, username, method, params, response status.
