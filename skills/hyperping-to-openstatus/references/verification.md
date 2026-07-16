# Verification and rollback checklist

## Access and key preflight

- [ ] A dedicated Hyperping project key can read the selected source project; it has no broader source-write permission unless an approved source edit needs it.
- [ ] An OpenStatus token created from **Settings → API Tokens** can read the intended destination page and is authorized for the planned target mutations.
- [ ] **OPENSTATUS_PAGE_ID** identifies the approved target page, and optional **HYPERPING_STATUS_PAGE_IDS** values identify only the intended source pages.
- [ ] The history helper completes a dry run with the expected source inventory and no unmapped components before any --apply attempt.
- [ ] Keys, full export files, headers, and token values are absent from the repository, ledger, reconciliation report, and captured command output.

## Inventory

- [ ] Source and destination monitor counts match after approved exclusions.
- [ ] Every source monitor ID has exactly one destination ID or a documented exception.
- [ ] No duplicate destination monitors were created by retries.
- [ ] Every source public-incident ID has one destination status-report ID in the local ledger.
- [ ] Every source maintenance ID has one destination maintenance ID in the local ledger.
- [ ] Source and destination record counts and timestamp ranges agree by type: incidents, incident updates, and maintenances.

## Configuration

- [ ] Each created or updated monitor was fetched after write.
- [ ] URL, method, headers, body, assertions, timeout, retry, redirects, cadence, regions, active state, and public state match the approved plan.
- [ ] Assertions were checked against a real response, including whitespace-sensitive body values.

## History

- [ ] Each imported status report is attached to the intended status page and exact page-component IDs.
- [ ] Each report's title, initial timestamp, update timestamps, phase, and message match the source plan.
- [ ] Updates appear in chronological order on target read-back and the public page.
- [ ] Generic source updates have a documented carried-forward or default phase.
- [ ] A source top-level incident timestamp was synthesized only when it preceded every real update; later conflicting timestamps are documented, not inserted out of order.
- [ ] Imported reports and updates were created with notifications disabled.
- [ ] Each maintenance title, from/to timestamps, target page, and page components match the source plan.
- [ ] Maintenance update text, if any, is present in the target message and the lack of a target update timeline is documented.
- [ ] Maintenance state is checked against its schedule rather than a copied source status field.
- [ ] A retry after an injected or real transport failure does not create a second report, update, or maintenance.

## Status and public views

- [ ] Every required status-page component points to the intended destination monitor ID.
- [ ] The public status page renders expected groups, services, historical reports, and maintenance windows.
- [ ] Every intended public latency monitor appears on /monitors.
- [ ] Each intended latency monitor has a live response-time detail view after enough intervals.
- [ ] A clean synthetic request and any relevant authenticated request agree with the expected status.

## Cutover

- [ ] Source is still available for the agreed soak period.
- [ ] Replacement links, alert destinations, and documentation have been tested.
- [ ] Rollback is documented as disable/detach/repoint, not destructive deletion.
- [ ] The user explicitly approved any permanent source cleanup.
