# Primary-source notes

Use these links to refresh live provider behavior before a migration. They support the field map but do not replace target read-back.

- [Hyperping monitor creation](https://hyperping.com/docs/monitoring/create-monitor) documents cadence, regions, request settings, and expected-response configuration.
- [Hyperping monitoring overview](https://hyperping.com/docs/monitoring) documents monitor types and operating concepts.
- [OpenStatus HTTP Monitor reference](https://www.openstatus.dev/docs/reference/http-monitor) documents the target monitor fields and the `public` visibility control.
- [OpenStatus page components reference](https://www.openstatus.dev/docs/reference/page-components) documents linking status-page components to monitors.
- [OpenStatus latency versus response time](https://www.openstatus.dev/docs/concept/latency-vs-response-time) distinguishes the public response-time data expected by this skill from broader network latency.

The built-in [OpenStatus status-page importer](https://www.openstatus.dev/docs/guides/how-to-import-status-page) should be treated as a convenience only. It does not remove the need to reconcile monitors, component IDs, and public views.
