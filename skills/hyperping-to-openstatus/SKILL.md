---
name: hyperping-to-openstatus
description: Migrate Hyperping HTTP monitors, status-page configuration, public incident timelines, and maintenance windows to OpenStatus with read-back reconciliation, public latency verification, and reversible cutover. Use when moving monitoring or status pages from Hyperping to OpenStatus.
license: MIT
compatibility: Requires authenticated access to both providers and permission to create monitors, status-page components, status reports, and maintenance windows. Network access required. Never store credentials in repository files.
metadata:
  author: provider-migration-skills
  version: "1.1.0"
---

# Hyperping to OpenStatus

Migrate behavior and public history, not merely named monitors. A monitor that exists but has a different assertion, region set, public visibility, cadence, or customer-facing timeline is not a successful transfer.

## Required outcome

Deliver a reconciliation report containing:

- source monitor IDs/names mapped to destination IDs/names;
- the full configuration diff and every unsupported field;
- source and destination inventory counts and unmatched entries;
- status-page component/group mappings;
- source incident IDs mapped to destination status-report IDs, including update counts and timestamp ranges;
- source maintenance IDs mapped to destination IDs, including schedule and component scope;
- status-history fidelity gaps, including synthesized text or any source timestamp that could not be used chronologically;
- results from target health checks, public status pages, /monitors, and at least one latency detail page for each public latency monitor;
- the agreed soak period and rollback procedure.

Do not delete the Hyperping source, revoke credentials, or silently change alert behavior before the report is accepted.

## 1. Preflight and snapshot

1. Confirm the source and target workspaces, intended target page, source retention period, desired cadence, regions, and which monitors should expose public latency.
2. Check the OpenStatus plan and current API/dashboard capabilities before creating anything. Required cadence or multi-region checks can be plan-limited.
3. Fetch complete Hyperping monitor, status-page, incident, and maintenance inventories. Fetch complete OpenStatus monitor, page, status-report, and maintenance inventories too.
4. Resolve source service IDs to exact destination page-component IDs. Do not attach an event to a similar-looking component.
5. Store a redacted local ledger outside the skill repository. It must map each source incident or maintenance ID to its target ID before retries.
6. Stop if the target history is non-empty without a matching ledger, if a source component is unmapped, or if a target cannot preserve the required page scope and timestamp.

OpenStatus automatic monitor incidents are internal detection records. Hyperping public incidents must migrate as OpenStatus status reports; see [the field mapping](references/field-mapping.md).

## 2. Normalize the desired configuration

For every source monitor, record URL, HTTP method, headers, body, expected status, body/keyword assertion, timeout, retry policy, redirect behavior, cadence, complete region set, enabled state, public visibility, alerting, and status-page grouping.

For every public-history record, record title, source page, affected source components, title/message locale chosen for the target, all update timestamps/messages/phases, and maintenance start/end timestamps.

Use [the field mapping](references/field-mapping.md) and [the primary-source notes](references/source-notes.md) to make unsupported behavior explicit. Never silently omit it.

Treat body assertions as literal strings unless the destination explicitly supports semantic parsing. Test whitespace, line endings, quoting, and JSON formatting against a real response before creating the monitor.

## 3. Dry run

Produce a table before writes:

| Source | Destination | Result | Exceptions | Verification |
| --- | --- | --- | --- | --- |
| source monitor/event ID | proposed monitor, report, or maintenance | create/update/skip | unsupported or synthesized behavior | read-back/public surface |

For incident history, sort source updates by their actual timestamp. Create the target report at the earliest trustworthy event. Only synthesize a detected entry if the source incident timestamp precedes every source update; never insert a later top-level timestamp into an otherwise older timeline.

Map Hyperping `investigating`, `identified`, `monitoring`, and `resolved` directly. Carry the last known phase for a generic Hyperping `update`; use `investigating` only when a generic update leads the timeline.

For maintenance, require `from < to`, resolve the exact component IDs, set notifications off, and plan to fold source maintenance-update text into the target maintenance message. OpenStatus has no maintenance-update timeline API.

## 4. Apply safely

1. Create one destination monitor using the complete normalized configuration.
2. Immediately fetch it and compare it against the plan before continuing.
3. For an existing destination monitor, fetch the full current object, merge only intentional changes, and submit the full desired set of fields. Always carry active, public, the complete regions list, cadence, assertions, retry, timeout, and redirect settings.
4. Create each status report at its planned initial timestamp, add the remaining updates in chronological order, and send `notify: false` on every imported record.
5. Create each maintenance window with its historical schedule, exact page components, message, and `notify: false`.
6. Re-fetch every created report and maintenance before advancing. Compare title, page scope, component IDs, timestamps, phases, and messages.
7. If a network or provider error occurs, use the ledger and target read-back before retrying. Never assume a failed response means no mutation occurred.

The included [`migrate-status-history.mjs`](scripts/migrate-status-history.mjs) helper requires Bun and cURL but no package installation, and defaults to a dry run. It requires `HYPERPING_API_KEY`, `OPENSTATUS_API_KEY`, and `OPENSTATUS_PAGE_ID`; use a redacted ledger path outside the repository for `--apply`.

See [the verification checklist](references/verification.md) for the required read-back gates.

## 5. Wire the status page

1. Create or update page metadata only after the mapped monitors pass their read-back comparison.
2. Maintain an explicit page group/component to destination monitor ID table.
3. Attach only the intended public components, then fetch the page and compare its component list with the plan.
4. Verify the public page as an unauthenticated visitor. A 200 response alone does not prove the correct components, reports, and maintenance history are displayed.

## 6. Verify public latency separately

OpenStatus status-home health and latency visibility are different features. Response-time charts are on /monitors and monitor detail pages, not necessarily on the status-page home.

For every monitor intended to show public latency, confirm all of the following after enough check intervals:

- public is true;
- active is true;
- the intended regions and cadence remain present;
- it appears on the public /monitors view;
- its detail page shows response-time data;
- the correct monitor is attached to the visible status-page component.

Do not use deprecated display settings as a proxy for public latency. Make the relevant monitor public and verify the actual monitor views.

## 7. Cut over and retain rollback

Keep Hyperping live during the agreed soak period. Disable or detach destination components to roll back; do not destroy data as a first rollback action. Replace status-page links and alert destinations only after the inventory, timeline, configuration, and public-view gates pass.

At the end, report open gaps and ask for explicit approval before deleting source monitors, status pages, integrations, or credentials.
