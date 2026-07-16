# Field mapping and fidelity notes

Confirm the current provider documentation and actual API response shapes before execution. Provider APIs and plan entitlements change.

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

## Update rule

Use GET -> merge -> full update -> GET. Partial updates have previously cleared regions or enabled state when fields were omitted. Treat every mutable destination object as a full configuration document unless provider documentation proves otherwise.

## Assertion rule

An endpoint can be healthy while a monitor is red because its assertion is wrong. Compare the exact response bytes and expected assertion before changing the endpoint, destination monitor, or source monitor.
