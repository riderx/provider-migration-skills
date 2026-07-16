---
name: plausible-to-datafast
description: Migrate Plausible Analytics historical traffic, future tracker configuration, and custom goals to DataFast with explicit access setup, an official ZIP import, source-to-target event mapping, and reversible cutover. Use when moving website analytics from Plausible to DataFast.
license: MIT
compatibility: Requires owner-approved access to the Plausible site settings, the DataFast target website, and the website repository. The official history-import path is dashboard based and needs no API key; optional baseline automation uses provider keys. Network access required. Never store credentials or analytics exports in repository files.
metadata:
  author: provider-migration-skills
  version: "1.0.0"
---

# Plausible Analytics to DataFast

This is an analytics continuity migration, not a promise that every dashboard number or event semantic has a one-to-one replacement. DataFast has an official importer for Plausible's full data-export ZIP, but custom events and goals must be reconfigured after import.

## Required outcome

Deliver a reconciliation report containing:

- the approved Plausible site/domain and DataFast website ID/domain mapping;
- protected source-export location and checksum, target website ID, import date, and the fixed historical date ranges used for comparison;
- imported core-metric checks for pageviews, visitors, referrers, devices, countries, UTM campaigns, bounce rate, and session duration;
- source-tracker locations, a reviewed target-tracker change list, and each custom-event/goal mapping;
- every manual, unsupported, or intentionally excluded surface, including historical event/goal data, dashboards, team access, billing, revenue attribution, consent, and domain topology;
- live pageview and goal verification evidence after a parallel-run period;
- source-retention date, rollback steps, and the owner who approved cutover.

Do not cancel Plausible, delete its site configuration, remove the source tracker, or delete the source ZIP before the report is accepted.

## 0. Create access and decide whether keys are needed

The official Plausible-to-DataFast history import is a browser workflow. It needs owner-approved dashboard access to the Plausible site and the DataFast target website, but it does **not** require an API key.

1. Confirm the exact Plausible site, target DataFast account, target website, source repository, data-retention period, and rollback owner. Create the target DataFast website before importing so it has a stable website ID and approved root domain.
2. For the browser import, export through **Plausible site settings → Imports & Exports → Export Data**. Do not use the chart's export button: it is not the full portability export accepted by DataFast.
3. For optional automated baselines only, a Plausible Stats API key is created in **Account settings → API Keys**. It is a Business-plan feature and must not be required for this skill's browser import path.
4. For optional DataFast API/CLI baseline read-back, prefer a scoped **dft_** account token from **Account settings → API**, restricted to the target website with `analytics:read` and only any additional read scopes needed. A one-site **df_** key from **Website settings → Developer** is for a genuine website-key use such as server-side goal tracking; do not use it merely for read-only comparisons. Do not give an agent broad account or team permissions just to compare analytics.
5. Keep any API key in an approved secret manager or current shell session. Never put a token in tracker markup, repository files, a committed .env, an analytics export, a mapping ledger, or the reconciliation report. A DataFast data-website-id is a public tracker identifier, not a secret.

See [the primary-source notes](references/source-notes.md) for the documented access paths. Stop if the source site, target website, domain, or owner approval is ambiguous.

## 1. Inventory before writes

1. Record the source domain, reporting timezone, script URL/proxy, consent behavior, linked sites/subdomains, custom domains, goals, custom properties, event calls, CSS attributes, shared dashboards, team members, integrations, revenue settings, and external references to the dashboard.
2. Search the repository and deployment configuration for Plausible script tags, proxy/CSP rules, plausible() calls, goal attributes, consent gating, and any server-side event path. Record file paths and behavior, never credentials or visitor data.
3. Create a field-level mapping ledger using [the capability map](references/capability-map.md). Normalise every target goal name and property before changing code; flag unsupported behavior instead of inventing an equivalent.
4. Capture agreed baseline date ranges. If optional APIs are available, use read-only queries for a repeatable baseline; otherwise record dashboard observations and retain the protected full export.
5. Stop if a source feature requires an unapproved privacy/consent choice, a cross-domain topology has no approved target design, or a source-imported dataset is expected to transfer. Plausible's full portability export contains native data, not data previously imported from another source.

## 2. Export and import core history

1. In Plausible site settings, request **Export Data** and download the emailed full-export ZIP. Store it outside the repository with restricted access and record only its location/checksum in the migration ledger.
2. Before upload, confirm the target is a new or owner-approved empty DataFast website, or that the ledger proves this ZIP checksum has not already been applied to that website. Record the target website ID and checksum together.
3. In the chosen DataFast website, open **Website settings → Import**, upload that ZIP once, and select **Start Import**. This browser mutation is human-owned.
4. Wait for completion, then read the target dashboard and compare the agreed historical ranges. Reconcile pageviews, visitors, referrers, device information, country/location, UTM campaigns, bounce rate, and session duration with the source plan.
5. If completion is ambiguous, do **not** re-upload the ZIP. Inspect the target dashboard and ledger, obtain documented provider clarification, or use an owner-approved fresh target; resolve the uncertainty before any retry.
6. Keep the original ZIP and Plausible site intact. A completed browser upload does not prove the intended website, date range, or dimensions were imported.

The importer does not establish a supported path for historical Plausible custom-event, goal, revenue, dashboard, team, or billing data. Treat each of those as a separate capability.

## 3. Install DataFast alongside Plausible

1. Add the documented DataFast tracker to the website's head with the approved target website ID and root domain. Preserve the domain, proxy, CSP, consent, and cross-domain decisions from the mapping ledger.
2. Keep Plausible running during a defined parallel-run period. Do not replace its script until DataFast receives a real production-like pageview and each mapped goal.
3. Translate each approved source event/goal deliberately. Check DataFast's goal-name and property limits before applying a repository change. Do not mechanically map Plausible callbacks, pageview goals, automated measurements, or revenue behavior without an accepted semantic review.
4. Run the repository's relevant build, lint, test, and deployment checks. Then verify the public page loads one copy of each intended tracker and no browser error, CSP error, or consent violation occurs.

Use [the cutover checklist](references/cutover-checklist.md) for the mandatory end-to-end gates.

## 4. Verify, cut over, and retain rollback

1. Verify the imported historical ranges separately from new live tracking. Historical import and tracker installation are two different checks.
2. Test a real pageview and every mapped custom goal from an unauthenticated browser session. Confirm the target dashboard/API reads the intended site, domain, event name, and allowed properties.
3. Compare parallel-run trends over a normal traffic cycle. Exact numerical parity is not an acceptance condition when providers use different collection, cookie, consent, or attribution behavior; explain every material divergence instead.
4. Obtain explicit owner approval before removing the Plausible tracker, cancelling service, changing dashboard links, deleting exports, or revoking access.

Rollback means restoring the prior Plausible tracker and links while retaining the DataFast import for diagnosis. Do not delete target data or source evidence as a first rollback action.
