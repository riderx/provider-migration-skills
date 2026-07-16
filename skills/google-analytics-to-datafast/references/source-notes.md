# Primary-source notes

Use these links to refresh live provider behavior before a migration. They support the capability map but do not replace source/target read-back.

## Scope and historical-data boundary

- [DataFast migration FAQ](https://datafa.st/) says that existing-data import is currently available from Plausible and that Google Analytics is next. This is the current boundary for GA4 historical migration.
- [DataFast: Import Plausible data](https://datafa.st/docs/import-from-plausible) documents the existing history importer and confirms its source-specific ZIP workflow; it is not a GA4 importer.
- [Google Analytics: BigQuery export setup](https://support.google.com/analytics/answer/9823238) confirms data begins flowing after linkage, so a new link cannot retrospectively backfill GA4 history. [Google Analytics: BigQuery Export](https://support.google.com/analytics/answer/9358801) documents raw GA4 event export, differences from the Analytics UI, and export limits.
- [Google Analytics reports export](https://support.google.com/analytics/answer/9317657) documents report exports as CSV, PDF, or Google Sheets and their report-shaped limits.
- [Google Analytics data retention](https://support.google.com/analytics/answer/7667196) documents retention choices that can limit detailed user/event investigation and should be captured before source evidence expires.

## Source inventory and optional read-only baselines

- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1) documents configurable GA4 reporting queries.
- [Google Analytics Data API quickstart](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart) documents user/service-account authentication, API enablement, analytics.readonly, and GA4 property access.
- [Google Analytics Admin API](https://developers.google.com/analytics/devguides/config/admin/v1) documents source configuration inventory for properties, streams, custom definitions, events, audiences, and linked services.
- [Google Analytics property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id) documents the GA4 numeric property ID and that the Data API is for Google Analytics properties rather than legacy Universal Analytics.

## Tracker, timezones, goals, and target configuration

- [DataFast: Get started](https://datafa.st/docs/getting-started) documents target tracker setup and website ID/domain configuration.
- [DataFast: Create website API](https://datafa.st/docs/api/account/websites/create) documents the dashboard/API website identifier and website timezone used for target data buckets.
- [DataFast: Script configuration](https://datafa.st/docs/script-configuration) documents the separate tracker trackingId used in client markup.
- [DataFast: Google Tag Manager](https://datafa.st/docs/google-tag-manager) documents a GTM deployment path that must still be published by the workspace owner.
- [DataFast: Track custom goals](https://datafa.st/docs/custom-goals) documents browser and server-side goal interfaces, goal/property limits, and the separate treatment of payment-provider events.
- [DataFast: Track conversion funnels](https://datafa.st/docs/conversion-funnels) documents target funnel creation.
- [DataFast: Connect payment providers](https://datafa.st/docs/connect-payment-provider) documents fresh target revenue configuration.
- [DataFast: Connect Google Search Console](https://datafa.st/docs/google-search-console) documents the owner-approved target authorization flow.

## Privacy and credentials

- [DataFast: GDPR and cookieless tracking](https://datafa.st/docs/gdpr-cookieless-tracking) documents default/cookieless tracking tradeoffs that require a privacy decision.
- [DataFast: Authentication and scopes](https://datafa.st/docs/api/authentication) documents website df_ keys, account dft_ tokens, dashboard locations, scopes, and least-privilege guidance.
- [Google Analytics Admin API overview](https://developers.google.com/analytics/devguides/config/admin/v1) documents source-side configuration APIs; use them for inventory rather than source mutations in this migration.
