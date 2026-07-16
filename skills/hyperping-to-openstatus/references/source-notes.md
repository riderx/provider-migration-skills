# Primary-source notes

Use these links to refresh live provider behavior before a migration. They support the field map but do not replace target read-back.

## Authentication and API keys

- [Hyperping API authentication](https://hyperping.com/docs/api/authentication) documents creating a project key in **Project settings → Developers**, its read-only and Read & Write modes, and bearer authentication.
- [OpenStatus API](https://www.openstatus.dev/tooling/api) documents generating a token in **Settings → API Tokens**, the **x-openstatus-key** header, and the target resources available through the API.

## Monitoring and page configuration

- [Hyperping monitor creation](https://hyperping.com/docs/monitoring/create-monitor) documents cadence, regions, request settings, and expected-response configuration.
- [Hyperping monitoring overview](https://hyperping.com/docs/monitoring) documents monitor types and operating concepts.
- [OpenStatus HTTP Monitor reference](https://www.openstatus.dev/docs/reference/http-monitor) documents the target monitor fields and the `public` visibility control.
- [OpenStatus page components reference](https://www.openstatus.dev/docs/reference/page-components) documents linking status-page components to monitors.
- [OpenStatus latency versus response time](https://www.openstatus.dev/docs/concept/latency-vs-response-time) distinguishes the public response-time data expected by this skill from broader network latency.

## Public incident and maintenance history

- [Hyperping incident list](https://hyperping.com/docs/api/incidents/list) documents `GET /v3/incidents`, source IDs, localized titles, affected components, status pages, and update timelines.
- [Hyperping incident detail](https://hyperping.com/docs/api/incidents/get) documents incident update fields and timestamps.
- [Hyperping maintenance list](https://hyperping.com/docs/api/maintenance/list) documents `GET /v1/maintenance-windows`, schedules, components, status pages, and source maintenance state.
- [OpenStatus status-report service](https://www.openstatus.dev/docs/sdk/nodejs/status-report-service) documents creating reports and timestamped timeline updates.
- [OpenStatus status reports and incidents](https://www.openstatus.dev/docs/concept/status-reports-and-incidents) explains why public provider incidents map to status reports rather than automatic target monitor incidents.
- [OpenStatus status-report reference](https://www.openstatus.dev/docs/reference/status-report) documents report phases, timestamps, messages, page components, and historical context.
- [OpenStatus maintenance reference](https://www.openstatus.dev/docs/reference/maintenance) documents historical maintenance schedules, component scope, public rendering, and subscriber notification semantics.
- [OpenStatus API](https://www.openstatus.dev/tooling/api) documents the API key header and typed RPC surface.

The built-in [OpenStatus status-page importer](https://www.openstatus.dev/docs/guides/how-to-import-status-page) should be treated as a convenience only. It does not remove the need to reconcile monitors, component IDs, public views, status reports, or maintenance windows.
