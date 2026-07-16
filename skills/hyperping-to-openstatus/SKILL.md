---
name: hyperping-to-openstatus
description: Migrate Hyperping HTTP monitors and status-page configuration to OpenStatus with full configuration preservation, read-back reconciliation, public latency verification, and reversible cutover. Use when moving monitoring or status pages from Hyperping to OpenStatus.
license: MIT
compatibility: Requires authenticated access to both providers and permission to create monitors and status-page components. Network access required. Never store credentials in repository files.
metadata:
  author: provider-migration-skills
  version: "1.0.0"
---

# Hyperping to OpenStatus

Migrate behavior, not merely named monitors. A monitor that exists but has a different assertion, region set, public visibility, or cadence is not a successful transfer.

## Required outcome

Deliver a reconciliation report containing:

- source monitor IDs/names mapped to destination IDs/names;
- the full configuration diff and every unsupported field;
- source and destination inventory counts and unmatched entries;
- status-page component/group mappings;
- results from target health checks, public status pages, /monitors, and at least one latency detail page for each public latency monitor;
- the agreed soak period and rollback procedure.

Do not delete the Hyperping source, revoke credentials, or silently change alert behavior before the report is accepted.

## 1. Preflight and snapshot

1. Confirm the source and target workspaces, the intended status-page URL/slug, source-retention period, desired cadence, regions, and which monitors should expose public latency.
2. Check the OpenStatus plan and current API/dashboard capabilities before creating anything. Required cadence or multi-region checks can be plan-limited.
3. Fetch the complete Hyperping monitor and status-page inventories. Fetch the complete OpenStatus monitor and status-page inventories too.
4. Store a redacted, local migration plan outside the skill repository. Assign a stable source ID to destination ID mapping before retrying any write.
5. Stop and resolve duplicates, unknown source fields, and destination name conflicts before applying changes.

## 2. Normalize the desired configuration

For every source monitor, record URL, HTTP method, headers, body, expected status, body/keyword assertion, timeout, retry policy, redirect behavior, cadence, complete region set, enabled state, public visibility, alerting, and status-page grouping.

Use [the field mapping](references/field-mapping.md) to make unsupported behavior explicit. Never silently omit it.

Treat body assertions as literal strings unless the destination explicitly supports semantic parsing. Test whitespace, line endings, quoting, and JSON formatting against a real response before creating the monitor.

## 3. Dry run

Produce a table before writes:

| Source | Destination name | Result | Exceptions | Public latency |
| --- | --- | --- | --- | --- |
| source ID/name | proposed monitor | create/update/skip | unsupported or manual behavior | yes/no |

Ask for a decision if a source field has no equivalent or target plan/API support is missing. Do not substitute a looser check without stating it.

## 4. Apply safely

1. Create one destination monitor using the complete normalized configuration.
2. Immediately fetch it and compare it against the plan before continuing.
3. For an existing destination monitor, fetch the full current object, merge only intentional changes, and submit the full desired set of fields. Always carry active, public, the complete regions list, cadence, assertions, retry, timeout, and redirect settings.
4. If a network or provider error occurs, read the destination inventory before retrying. Never assume a failed response means no mutation occurred.
5. Make retries idempotent through the source-to-destination mapping. Do not create a second monitor because a write timed out.

See [the verification checklist](references/verification.md) for the required read-back gates.

## 5. Wire the status page

1. Create or update page metadata only after the mapped monitors pass their read-back comparison.
2. Maintain an explicit page group/component to destination monitor ID table.
3. Attach only the intended public components, then fetch the page and compare its component list with the plan.
4. Verify the public page as an unauthenticated visitor. A 200 response alone does not prove the correct components are displayed.

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

Keep Hyperping live during the agreed soak period. Disable or detach destination components to roll back; do not destroy data as a first rollback action. Replace status-page links and alert destinations only after the inventory/config/public-view gates pass.

At the end, report open gaps and ask for explicit approval before deleting source monitors, status pages, integrations, or credentials.
