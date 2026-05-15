# Weekly GSC report — one-time setup

The `Weekly GSC report` GitHub Action (`.github/workflows/weekly-gsc-report.yml`)
needs read access to Google Search Console data. This is a one-time setup.

## 1. Create a Google Cloud project + service account

1. Go to <https://console.cloud.google.com/> and create a new project
   (e.g. `villa-beba-seo`). It is free.
2. In **APIs & Services → Library**, search for **Google Search Console API**
   and click **Enable**.
3. In **APIs & Services → Credentials → Create credentials → Service account**,
   name it `gsc-report`, and create it (no roles needed).
4. Open the new service account → **Keys → Add key → Create new key → JSON**.
   A `.json` file downloads. Keep it private — it is a credential.

## 2. Grant the service account access to Search Console

1. Open the downloaded JSON and copy the `client_email` value
   (looks like `gsc-report@villa-beba-seo.iam.gserviceaccount.com`).
2. Go to <https://search.google.com/search-console> → select the
   `ballenaandbeluga.com` domain property.
3. **Settings → Users and permissions → Add user.** Paste the
   `client_email`, set permission to **Full** (or **Restricted** — read access
   is enough), and add.

## 3. Create the `seo-report` label

In the GitHub repo, go to **Issues → Labels → New label**, name it
`seo-report`, and save. The workflow tags every weekly report Issue with this
label; creating it ahead of time guarantees the first run cannot fail on a
missing label.

## 4. Store the key as a GitHub secret

1. In the GitHub repo: **Settings → Secrets and variables → Actions →
   New repository secret.**
2. Name: `GSC_SERVICE_ACCOUNT_JSON`. Value: paste the **entire contents** of
   the downloaded JSON file. Save.

## 5. Verify

GitHub → **Actions** tab → **Weekly GSC report** → **Run workflow** on
`v7-light`. A green run opens an Issue titled `SEO weekly — week of <date>`.

After that, the report opens automatically every Monday at 07:00 UTC.

## Notes

- The service-account JSON never expires — no token rotation needed.
- The property is young; early reports will be sparse and that is expected.
  Week-over-week delta sections begin populating from the second report.
- To stop the report: disable the workflow in the Actions tab, or delete
  `.github/workflows/weekly-gsc-report.yml`.
