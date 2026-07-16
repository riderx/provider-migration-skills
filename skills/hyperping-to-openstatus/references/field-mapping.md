# Field mapping and fidelity notes

Confirm the current provider documentation and actual API response shapes before execution. Provider APIs and plan entitlements change.

## Monitor and page mapping

| Hyperping behavior | OpenStatus target behavior | Migration rule |
| --- | --- | --- |
| Name and URL | Monitor name and URL | Preserve exactly; deduplicate by source ID, not name alone. |
| HTTP method, headers, body | HTTP request configuration | Copy the full request. Redact values in reports. |
| Expected status | Status assertion | Preserve the exact accepted status/status set. |
| Keyword or body assertion | Body/status assertion | Test against a live response first. Literal matching can fail on insignificant-looking whitespace. |
| Check interval | periodicity | Preserve the source cadence when the destination plan supports it; otherwise record the user-approved exception. |
| Regions | regions | Carry the full desired list on every update. Omitted regions may be cleared by an update API. |
| Timeout, retry, redirects | timeout, retry, followRedirects | Preserve all three; do not rely on provider defaults. |
| Enabled state | active | Include explicitly on every update. An omitted value may be cleared. |
| Public monitoring/latency | public plus active | Only make monitors public when intended; public monitors appear on monitor/latency surfaces. |
| Status-page group/card | Component linked to monitor ID | Maintain an ID map and read the page back. Do not map cards by similar names. |
| Alerts/integrations | Provider-specific | Audit separately. Record any unsupported routing or notification behavior before cutover. |

## Status-page subscribers

| Hyperping source | OpenStatus target | Migration rule |
| --- | --- | --- |
| Email subscriber returned by the source page API | Vendor-managed email subscription | Require status-page-owner approval. The target creation route activates the recipient without another confirmation. |
| “All components except X” | Explicit componentIds allowlist | Resolve X to every target child component, then send every remaining page-component ID. An empty array means the entire page. |
| Source subscriber page | pageId | Map the exact source page to the approved target page. Do not use a matching name alone. |
| Source email address | emailChannel.email | Normalize and deduplicate case-insensitively. Do not expose addresses in reports or commit them to the migration repository. |
| Active target duplicate | Existing target row | Skip it after confirming its component scope. Do not create a duplicate on retry. |
| Target unsubscribed row | Target opt-out | Preserve it. Do not reactivate without fresh owner approval. |
| Source SMS, Slack, Teams, webhook, or other channel | No automatic email conversion | Report the count and re-enroll supported destinations separately with authorization. |
| Create response component IDs | Scope evidence | Require an exact match to the planned allowlist before continuing. If REST list responses omit component IDs, use the authenticated subscriber dashboard for read-back. |

## Public incident and maintenance history

| Hyperping source | OpenStatus target | Migration rule |
| --- | --- | --- |
| Public incident | Status report | Do not map to an automatic OpenStatus monitor incident; those are internal detection records and cannot be backfilled manually. |
| Incident title | Status-report title | Use the source English value when available, otherwise the first non-empty locale. Record the locale choice. |
| Incident affectedComponents | Status-report pageComponentIds | Resolve through a source-service-ID to target-component-ID map. Stop on any unmapped component. |
| Incident update timestamp/message | Status-report initial entry or update | Sort chronologically and preserve exact timestamps/messages. Create the initial report from the earliest event. |
| Hyperping update type investigating/identified/monitoring/resolved | Matching status-report phase | Copy directly. |
| Hyperping generic update | Status-report update | Carry the most recent non-generic phase; default a leading generic update to investigating and record that fallback. |
| Incident top-level date | Optional synthetic detected entry | Use only when it precedes every source update. If it is later than the first update, do not create a misleading out-of-order event. |
| Incident notification behavior | notify false | Historical imports must not notify current subscribers. |
| Maintenance title and message | Maintenance title and message | Preserve title and source text. |
| Maintenance start_date/end_date | Maintenance from/to | Preserve RFC 3339 timestamps exactly and require from before to. |
| Maintenance monitors | Maintenance pageComponentIds | Resolve exact target components; never use a similarly named monitor as a fallback. |
| Maintenance status | Derived from from/to | The target computes upcoming/active/past state from the schedule; no direct status import exists. |
| Maintenance update timeline | Maintenance message | Fold dated source updates into the message with a clear provenance heading. The target has no maintenance-update timeline API. |
| Source author, creator, notification settings | No equivalent | Record as an unsupported fidelity gap; do not expose copied credentials or re-notify subscribers. |

## Update rule

Use GET -> merge -> full update -> GET. Partial updates have previously cleared regions or enabled state when fields were omitted. Treat every mutable destination object as a full configuration document unless provider documentation proves otherwise.

For history writes, use snapshot -> plan -> create/update -> GET -> ledger. If a transport failure happens after a write, query the target and recover the source-to-target mapping before issuing another create request.

## Assertion rule

An endpoint can be healthy while a monitor is red because its assertion is wrong. Compare the exact response bytes and expected assertion before changing the endpoint, destination monitor, or source monitor.
