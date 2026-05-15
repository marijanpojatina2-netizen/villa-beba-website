# Weekly GSC report — one-time setup (OAuth)

The `Weekly GSC report` GitHub Action (`.github/workflows/weekly-gsc-report.yml`)
needs read access to Google Search Console data. It authenticates with an
**OAuth refresh token** for a Google account that already owns the
`ballenaandbeluga.com` Search Console property.

> **Why OAuth and not a service account?** In early May 2026 Google confirmed
> a bug that breaks adding *new service accounts* to Search Console (the
> "email not found" error). OAuth sidesteps it entirely: the workflow simply
> acts as your own Google account, which already owns the property — nothing
> has to be added to Search Console at all.

This is a one-time setup. The Google Cloud project (`villa-beba-seo`) and the
enabled Search Console API from the earlier attempt can be reused.

## 1. Configure the OAuth consent screen

1. Go to <https://console.cloud.google.com/> and select the `villa-beba-seo`
   project.
2. Open **APIs & Services → OAuth consent screen** (in the newer UI this may
   be called **Google Auth Platform → Branding / Audience**).
3. User type: **External**. App name e.g. `Villa Beba SEO report`; set your
   own email as both the user support email and the developer contact. Save.
4. **Publish the app:** on the consent screen / Audience page, click
   **Publish app** so the publishing status becomes **In production**.
   This matters — while the app is in *Testing* status, OAuth refresh tokens
   expire after 7 days and the weekly report would break every week.

## 2. Create an OAuth client ID

1. **APIs & Services → Credentials → Create credentials → OAuth client ID.**
2. Application type: **Desktop app**. Name it `gsc-report`. Create.
3. Copy the **Client ID** and the **Client secret** — you need them next.

## 3. Mint the refresh token

In the `villa-beba` project on your computer, run:

```
npm run gsc-oauth-setup
```

1. Paste the Client ID and Client secret when prompted.
2. A browser window opens. Choose the Google account that owns the
   Search Console property (`marijanpojatina2@gmail.com`).
3. You will see **"Google hasn't verified this app"** — this is expected for
   a personal app. Click **Advanced → Go to Villa Beba SEO report (unsafe)**
   and continue. It is safe: it is your own app accessing your own data.
4. Approve the **"See Search Console data"** permission.
5. Back in the terminal, the script prints three values:
   `GSC_OAUTH_CLIENT_ID`, `GSC_OAUTH_CLIENT_SECRET`, `GSC_OAUTH_REFRESH_TOKEN`.

## 4. Store the three GitHub secrets

In the GitHub repo: **Settings → Secrets and variables → Actions →
New repository secret.** Add all three, names and values exactly as printed:

- `GSC_OAUTH_CLIENT_ID`
- `GSC_OAUTH_CLIENT_SECRET`
- `GSC_OAUTH_REFRESH_TOKEN`

If a `GSC_SERVICE_ACCOUNT_JSON` secret still exists from the earlier attempt,
delete it — it is no longer used.

## 5. Create the `seo-report` label

If not already done: in the GitHub repo, **Issues → Labels → New label**,
name it `seo-report`, save. The workflow tags every weekly report Issue
with this label.

## 6. Verify

GitHub → **Actions** tab → **Weekly GSC report** → **Run workflow** on
`v7-light`. A green run opens an Issue titled `SEO weekly — week of <date>`.

After that, the report opens automatically every Monday at 07:00 UTC.

## Notes

- Keep the OAuth consent screen in **In production** status — *Testing* mode
  expires the refresh token after 7 days.
- A refresh token can still be revoked if you change your Google password or
  remove the app under your Google Account → Security → Third-party access.
  If a weekly run ever fails on authentication, re-run `npm run gsc-oauth-setup`
  and update the `GSC_OAUTH_REFRESH_TOKEN` secret with the new value.
- The property is young; early reports will be sparse and that is expected.
  Week-over-week delta sections begin populating from the second report.
- To stop the report: disable the workflow in the Actions tab, or delete
  `.github/workflows/weekly-gsc-report.yml`.
