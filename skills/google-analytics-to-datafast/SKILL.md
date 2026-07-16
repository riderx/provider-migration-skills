---
name: google-analytics-to-datafast
description: Migrate a Google Analytics 4 web property to DataFast through an explicit no-history-import boundary, source archiving, timezone-safe parallel verification, and reversible cutover. Use when replacing GA4 web analytics with DataFast.
license: MIT
compatibility: Scope is Google Analytics 4 web properties only. Requires owner-approved access to the GA4 property, DataFast target website, and repository or Google Tag Manager/CMS publication surface. DataFast currently has no documented Google Analytics history importer. Browser cutover needs no provider API key; optional baseline/read-back uses OAuth and scoped target tokens. Network access required. Never store credentials, exports, or visitor data in repository files.
metadata:
  author: provider-migration-skills
  version: "1.0.0"
---

# Google Analytics 4 to DataFast

This is a GA4 web-property cutover and source-retention skill, not a historical-data replication promise. DataFast currently supports a history importer only for Plausible, and its live FAQ says Google Analytics is next. Preserve GA4 history in Google Analytics or an approved source archive; do not upload GA4 CSV, Data API, or BigQuery data to DataFast.

## Required outcome

Deliver a reconciliation report containing:

- the approved GA4 numeric property ID, web measurement ID, source domains, GA4 reporting timezone, DataFast `websiteId` (dashboard/API), DataFast `trackingId` (tracker), target website timezone, and target root domain;
- an owner-approved timezone conversion and fixed-date comparison convention if the two website timezones differ;
- a source-history retention plan, the approved archive location, and fixed aggregate comparison ranges with metric/dimension definitions;
- source tracker locations, including repository, Google Tag Manager, CMS, proxy, consent, CSP, and server-side paths, plus the dry-run tracker inventory and idempotent target installation decision;
- an accepted mapping for each future event, key event, custom definition, funnel, revenue behavior, and other target goal;
- every manual, unsupported, and intentionally excluded surface, including historical analytics, audiences, Google Ads/remarketing, user identity, dashboards, shares, team access, billing, and privacy choices;
- fresh unauthenticated pageview and mapped-goal evidence from an agreed parallel-run period; and
- source-retention date, rollback steps, and the owner who approved cutover.

Do not delete the GA4 property, remove, disable, or overwrite the approved Google tag, publish a GTM/CMS source-retirement change, revoke source access, or discard the source archive before this report is accepted. After the dry-run gate, an owner-approved additive DataFast tag may be published.

## 0. Confirm GA4 scope and create access

This skill covers a GA4 **web** property. Stop if the source is a legacy Universal Analytics tracking ID (`UA-...`), a Firebase/app-only stream, or an unapproved combined web-and-app scope.

1. Confirm the exact GA4 property, numeric property ID, web data stream, measurement ID, root domain, reporting timezone, repository/GTM/CMS owner, source-retention period, and rollback owner. Record the proposed DataFast website timezone: it must equal the GA4 reporting timezone before first production collection, unless the owner approves a documented conversion and fixed-date comparison convention. A browser-only inventory and target tracker setup do **not** need a generic Google Analytics API key.
2. For optional repeatable aggregate baselines, create or use a Google Cloud project with the Google Analytics Data API enabled. Authenticate with a user or service account that has GA4 property access and the `analytics.readonly` scope. This is OAuth/service-account access, not a static API-key substitute for a private GA4 property.
3. Use the Admin API only for read-only inventory when it is necessary and owner-approved. Request the provider-documented minimum scope for it; do not use source-write access merely to inspect configuration.
4. Create or identify the target DataFast website through the dashboard. Record both the dashboard/API `websiteId` and the tracker `trackingId` (`dfid_...`): `dft_` API/CLI operations use `websiteId`, while client tracker markup uses `trackingId`. For optional API/CLI read-back, prefer a scoped `dft_` account token from **Account settings -> API**: use `analytics:read` for metrics, add `settings:read`, `goals:read`, or `funnels:read` only for the corresponding read-back, and request `websites:read` only when listing or selecting the target. Use a website-scoped `df_` key from **Website settings -> Developer** only for a genuine server-side target operation such as a goal or payment call, never merely for comparison.
5. Keep OAuth credentials, service-account material, and DataFast tokens only in an approved secret manager or current shell session. Never place them in tracker markup, repository files, a committed `.env`, an export, a mapping ledger, or the reconciliation report. The GA4 measurement ID, DataFast `websiteId`, and DataFast `trackingId` identify destinations; they are not API credentials.
6. Before any tracker mutation, perform a dry run: inventory repository, deployment, GTM, CMS, proxy, and consent surfaces for all GA4 and DataFast integrations; record every location and identifier; and produce the proposed additive target change. Do not publish during this gate. Stop if the target destination is ambiguous, an unapproved target tracker already exists, or the expected GA4 measurement ID cannot be located.

See [the primary-source notes](references/source-notes.md) for the documented paths. Stop instead of widening permissions when the property, target website, data stream, source tag, target identifiers, timezone decision, or owner approval is ambiguous.

## 1. Inventory before target changes

1. Record GA4 collection settings and topology: web data stream, Google tag/GTM container/CMS integration, proxy and CSP rules, consent mode, cross-domain measurement, internal-traffic and unwanted-referral exclusions, reporting timezone, property event/user data-retention setting, and linked domains.
2. Inventory events, key events, event-create/edit rules, custom dimensions/metrics, audiences, reports, explorations, shared links, funnels, user-ID/Measurement Protocol paths, Google Ads and Search Console links, BigQuery export, revenue/ecommerce behavior, team access, and billing. Record configuration and ownership, never visitor-level data or credentials.
3. Search the repository, deployment configuration, GTM workspace, and CMS for `gtag`, GTM containers, Google tag IDs, DataFast script or SDK usage, DataFast `trackingId` values, event calls, server-side event code, consent gates, redirects, payment webhooks, and dashboard links. Record locations and behavior, not secrets.
4. Create a field-level mapping ledger using [the capability map](references/capability-map.md). Map a source event or key event only after a human accepts its target meaning; do not equate names, attribution, custom dimensions, audiences, revenue, or identity behavior by label alone.
5. Stop if the requested outcome expects historical GA4 records in DataFast, reuses a source Measurement Protocol secret, transfers user-level identifiers, changes legal/consent behavior without approval, or includes an app/Firebase scope outside this skill.

## 2. Retain source history and capture comparable baselines

1. Do not attempt a CSV, API, or BigQuery upload into DataFast. There is no documented GA4 history-import path, so a successful-looking upload or manual replay would be an unsupported data mutation.
2. Preserve the source property and a protected archive according to the approved retention plan. Use existing BigQuery data only as source evidence; it is not a DataFast ingestion source. If BigQuery is not already linked, do not enable it expecting a retrospective GA4 backfill.
3. Record the GA4 event/user data-retention setting and archive any source-only exploration, funnel, or aggregate evidence needed before it expires. A retained GA4 property alone does not guarantee detailed historical investigation remains available.
4. Agree fixed comparison ranges before parallel tracking. Record the GA4 and DataFast timezones, any approved conversion, dimensions, metrics, filters, attribution choices, and sampling/data-quality indications. Export approved aggregate reports or use read-only Data API `runReport` queries; retain outputs outside the repository.
5. Treat GA4 report exports, Data API results, and BigQuery data as different source views rather than interchangeable truth. Keep their query definitions alongside the archive and avoid placing visitor IDs, raw event payloads, or personal data in the ledger.
6. Label every baseline as source-only evidence. It establishes expected trends for cutover verification; it does not authorize importing historic traffic, events, conversion counts, revenue, attribution, or audiences into DataFast.

## 3. Build DataFast alongside GA4

1. Create or verify the intended DataFast website with the approved root domain and timezone decision. Apply the documented tracker with its approved `trackingId` in client markup; never substitute the dashboard/API `websiteId` there. Preserve proxy, CSP, consent, and cross-domain decisions from the mapping ledger.
2. Recheck the dry-run tracker inventory immediately before applying. An existing target integration may be reused only when the owner approves its exact `trackingId` and it is verified to fire once in the intended page topology; otherwise stop rather than creating a second target tracker.
3. When the source is repository-owned, add the DataFast tracker through the documented integration and keep the Google tag in place. When the source is in Google Tag Manager or a CMS, add a separate target tag/integration only after the dry run and have the owner publish it; do not overwrite, remove, or disable the GA4 tag during parallel running.
4. Rebuild accepted future events and key events deliberately using DataFast goals. Check documented goal-name and parameter limits before changing code. Reimplement server-side measurement or identity behavior only after a separate privacy and semantic review; never copy source API secrets or historic identities.
5. Recreate approved target funnels, reports, shared views, Search Console integration, payment-provider setup, and team access separately. Treat a browser payment-provider connection and a Payment API/checkout-metadata implementation as separate approved target paths. Google Ads audiences, remarketing, historic dashboards, source property roles, and source billing are not automatically transferable.
6. Configure cookies/cookieless mode, consent, exclusions, subdomains, cross-domain tracking, proxy, and CSP only after an owner-approved privacy/product decision. Do not claim GA4 consent mode or attribution has been migrated because a target tracker loads.
7. Run the repository's relevant build, lint, test, and deployment checks. On each intended public page topology, verify that the approved GA4 measurement ID and DataFast `trackingId` each fire once, with no unintended duplicate target sends and no browser, CSP, proxy, or consent errors. Do not delete another approved source tag merely to satisfy a count.
8. Make reruns idempotent: use the approved `trackingId` plus tracker location as the installation key, reuse the approved script/SDK/GTM tag when it is already present, and never append a second target tracker or tag on retry.

Use [the cutover checklist](references/cutover-checklist.md) for end-to-end gates.

## 4. Verify, cut over, and retain rollback

1. Verify fresh DataFast collection separately from the protected source archive. From an unauthenticated browser session, exercise a real pageview and every mapped goal and read back the intended target `websiteId`, domain, goal name, and permitted properties.
2. Compare parallel-run trends over an agreed traffic cycle using the fixed baselines and the same timezone/date-boundary convention. Exact numerical parity is not an acceptance condition: providers can differ in collection, cookies, consent, attribution, bot filtering, and metric definitions. Explain material divergence instead of masking it.
3. Confirm every manual surface independently: DataFast funnels/reports/shares, payment-provider or Payment API integration, Search Console integration, team access, privacy decisions, and external dashboard links. Keep Google Ads/remarketing and source-only historical artifacts under their own approved plan.
4. Obtain explicit owner approval before removing the Google tag, publishing a GTM/CMS change that disables GA4, deleting source reports, changing source links, cancelling service, deleting archives, or revoking access.

Rollback means restoring the GA4 tag and source links while retaining DataFast collection and the source archive for diagnosis. Do not delete target data or historical evidence as a first rollback action.
