# Public evidence: AI-assisted provider and platform migrations

This ledger records public examples that informed the repository’s migration controls. It is deliberately not a collection of conversion claims: most published examples are infrastructure, data, or code migrations rather than a field-for-field SaaS configuration transfer. They show how teams use AI safely, not that a provider pair is interchangeable.

## Evidence standard

- **First-party engineering account**: published by the team that performed the work.
- **Provider-published customer case**: useful but the provider selected and reported the outcome; treat metrics as reported, not independently verified.
- **Self-reported account**: useful for workflow and failure modes, not a benchmark.
- **Reference implementation**: an open migration skill or official guide, not proof of a completed customer outcome.

## Public cases and what they teach

| Evidence | Migration and AI role | Published result or observation | Control adopted here |
| --- | --- | --- | --- |
| [Datadog engineering account](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/) | Storage-engine migration using Claude/Cursor for narrow implementation work, while human engineers retained architectural decisions. | Datadog describes adding tests around every target method and running a blue/green validator on a 30-second cycle for weeks before retiring the old path. | Define the target mapping before writes; use read-back and side-by-side/real-surface validation; retain the source during a soak. |
| [KDDI engineering account](https://tech-note.kddi.com/n/nb76d462e507d?hl=en-US) | Pentaho XML workloads translated to PySpark/Databricks with AI assistance. | KDDI describes a later corrective phase after AI-generated work exposed omissions and bugs, followed by data/output comparison. | Treat AI output as a draft; keep explicit gaps, test behavior and output, and add a corrective loop before cutover. |
| [Vector Limited customer case](https://aws.amazon.com/solutions/case-studies/vector-limited-case-study/) | VMware Cloud on AWS workloads migrated to native AWS with agentic-AI support for inventory, network conversion, sizing, and migration waves. | AWS reports a 34% faster migration; this is a provider-published customer metric, not an independent benchmark. | Inventory first, map dependencies, sequence small waves, and retain human control for network/security/cutover decisions. |
| [CSL customer case](https://aws.amazon.com/solutions/case-studies/csl-agenticai/) | 29 data centers and 5,000 VMware servers migrated to AWS using agentic AI for dependency mapping and phased migration-wave planning. | AWS reports 10× faster wave planning and 12× faster discovery; these are provider-published customer metrics, not independently verified benchmarks. | Treat dependency discovery and wave planning as aids to a human-owned continuity, outage, and acceptance plan. |
| [CME Group customer case](https://cloud.google.com/customers/cmegroup) | Legacy Java/Oracle regulatory reports migrated to BigQuery with Gemini Code Assist. | Google reports the team migrated roughly 2,000 reports and estimated 3–4 months rather than 9; this is a provider-published customer estimate. | Use AI for repeatable transformation and documentation, but validate against production-like data and human-owned regulatory/acceptance gates. |
| [Self-reported AWS to DigitalOcean migration](https://dev.to/anand_rathnas_d5b608cc3de/how-claude-code-helped-me-migrate-from-aws-to-digitalocean-in-4-hours-with-live-traffic-hmg) | A developer used Claude Code to inventory and move a small live application from AWS to DigitalOcean. | The author reports a four-hour migration; it is a self-reported result, not a transferable time estimate. | Keep a concrete inventory covering compute, database, SSL, DNS, traffic cutover, and logs; use it as a failure checklist rather than a schedule promise. |

## Open skill architecture precedent

[DigitalOcean’s App Platform migration skill](https://github.com/digitalocean-labs/do-app-platform-skills/tree/main/skills/migration) provides a public precedent for an AI-oriented migration workflow: discover the source, map and refactor, validate, document unmappable items, and hand off. Its [AI-assisted migration guide](https://docs.digitalocean.com/products/app-platform/getting-started/migrate-from-heroku/#ai-assisted-migration-heroku-to-app-platform) reinforces that a migration artifact must make assumptions and manual work visible.

This repository extends that idea with a provider registry and per-pair `migration.json` contracts. The generated [migration matrix](../MIGRATION-MATRIX.md) makes the supported/manual/unsupported boundary inspectable before an agent acts.

## Controls distilled into this repository

1. **Inventory before changes.** Collect source objects, configuration, dependencies, public links, and target state before applying mutations.
2. **Map capability by capability.** A named object moving does not prove that history, alerts, routing, keys, billing, webhooks, version targeting, or public visibility moved.
3. **Make the access path explicit.** Prefer deterministic API/repository work; state browser-only and human-approved steps rather than fabricating automation.
4. **Read back and validate the real surface.** Confirm target configuration after each write, then use the status page, booking page, CI job, or real device that users actually rely on.
5. **Keep the old path during a soak.** A target object or successful upload is not a safe cutover. Keep a documented rollback and retain the source until the user accepts the result.
6. **Never migrate secrets by imitation.** Reauthorize credentials and signing material through the approved target process; do not copy them into code, logs, or migration artifacts.

## What this evidence does not prove

- It does not prove migration time, cost, completeness, or success for any skill in this repository.
- It does not authorize destructive retirement or the transfer of personal data, history, or credentials.
- It does not replace current provider documentation or target read-back; provider APIs, plans, and browser workflows can change.
