# Provider Migration Skills

Portable [Agent Skills](https://agentskills.io/specification) for moving operational workflows from one SaaS provider to another without treating a successful API response as proof of a successful migration.

Each skill follows the same safety contract: capture the source inventory, normalize the intended configuration, dry-run the mapping, create or update the destination, read it back, test the public/user-facing behavior, and retain the source until the cutover is accepted.

## Included skills

| Skill | Covers |
| --- | --- |
| [hyperping-to-openstatus](skills/hyperping-to-openstatus/SKILL.md) | HTTP monitors, monitor assertions, regions, cadence, status pages, public monitor visibility, response-time charts, public incident timelines, and maintenance windows. |
| [google-analytics-to-datafast](skills/google-analytics-to-datafast/SKILL.md) | Google Analytics 4 source-history retention, tracker and goal mapping, privacy/domain decisions, parallel verification, and reversible cutover to DataFast. |
| [plausible-to-datafast](skills/plausible-to-datafast/SKILL.md) | Plausible full-export historical analytics import, tracking-script and custom-goal mapping, privacy/domain decisions, verification, and reversible cutover to DataFast. |
| [cal-com-to-google-appointment-schedules](skills/cal-com-to-google-appointment-schedules/SKILL.md) | Booking event types, availability, booking links and embeds, Google Appointment Schedules, and a reversible cutover. |
| [ionic-appflow-to-capgo](skills/ionic-appflow-to-capgo/SKILL.md) | Ionic Appflow Live Updates SDK/configuration, update strategies, deployment automation, and a new-native-binary cutover to Capgo. |
| [capawesome-cloud-to-capgo-live-updates](skills/capawesome-cloud-to-capgo-live-updates/SKILL.md) | Capawesome Cloud Live Updates SDK/configuration, channel/rollout decisions, CI uploads, and device-level verification in Capgo. |

## Evidence-informed migration model

The [evidence ledger](research/ai-assisted-provider-migrations.md) records public, source-labelled examples of AI-assisted provider and platform migrations. It informs the controls used here; it does not imply that any provider pair is automatic or equivalent.

The recurring successful pattern is deliberately conservative: human-owned scope and rollback decisions; AI-assisted inventory, mapping, mechanical code/configuration work, and comparison; read-back against the target; and a real-user or real-device validation gate before cutover.

## Install

The [Skills CLI](https://www.skills.sh/docs/cli) is the standard installer. Replace riderx after forking this repository.

~~~sh
npx skills add riderx/provider-migration-skills --list
npx skills add riderx/provider-migration-skills --skill hyperping-to-openstatus
npx skills add riderx/provider-migration-skills --skill google-analytics-to-datafast
npx skills add riderx/provider-migration-skills --skill plausible-to-datafast
npx skills add riderx/provider-migration-skills --skill cal-com-to-google-appointment-schedules
npx skills add riderx/provider-migration-skills --skill ionic-appflow-to-capgo
npx skills add riderx/provider-migration-skills --skill capawesome-cloud-to-capgo-live-updates
~~~

For a non-interactive global Codex install:

~~~sh
npx skills add riderx/provider-migration-skills --skill hyperping-to-openstatus -g -a codex -y
~~~

To disable anonymous Skills CLI telemetry for a command, prefix it with DISABLE_TELEMETRY=1.

## What a migration skill must do

1. **Plan before writes.** Produce a source-to-target mapping and list every unsupported field or behavior.
2. **Preserve behavior.** Capture settings that look secondary but change outcomes: time zone, assertions, redirects, buffers, regions, notification paths, visibility, and custom links.
3. **Read after write.** Re-fetch destination objects and compare the full desired configuration. Do not infer success from a 2xx response.
4. **Test the real surface.** Verify public status pages, booking pages, confirmation emails, monitor detail pages, and any embed or custom domain that users actually use.
5. **Keep a rollback path.** Do not delete the source provider or revoke its credentials until the user accepts a documented soak period and the reconciliation report is clean.

The skills never ask agents to commit credentials, personal data, booking records, or production exports. Use environment variables, provider dashboards, or an approved secret manager at runtime.

## Repository layout

~~~text
providers/
  providers.json       # canonical provider IDs, access methods, primary docs
skills/
  <provider-pair>/
    SKILL.md           # concise activation instructions
    migration.json     # machine-readable capability contract
    scripts/           # optional dependency-free migration helpers
    references/        # focused field maps and verification checklists
research/
  ai-assisted-provider-migrations.md # source-labelled public evidence ledger
scripts/
  build-migration-matrix.mjs # produces the committed capability matrix
  validate-skills.mjs # dependency-free repository validation
MIGRATION-MATRIX.md   # generated supported/manual/unsupported capability map
~~~

This uses the Agent Skills SKILL.md format, progressive disclosure, and a skills.sh.json grouping file, following the structure used by the [Vercel Agent Skills collection](https://github.com/vercel-labs/agent-skills). See the [Agent Skills best practices](https://agentskills.io/skill-creation/best-practices) before adding a new provider pair.

## Provider-pair contracts

Every provider pair has a `migration.json` contract. It declares each capability as `supported`, `manual`, `unsupported`, or `not-applicable`, plus the source and target access path (`api`, `browser`, `cli`, `repo`, `manual`, or `none`), who may apply it, and how to verify it.

The generated [migration matrix](MIGRATION-MATRIX.md) lets an agent or maintainer see what can move, what requires a human/browser session, and what must stay behind before it starts a migration. Read [ARCHITECTURE.md](ARCHITECTURE.md) to add a provider or pair without inventing a new schema.

## Validate

~~~sh
node scripts/build-migration-matrix.mjs --check
node scripts/validate-skills.mjs
~~~

The validator checks required frontmatter, provider IDs, capability contracts, matrix freshness, description quality constraints, and obvious credential-shaped strings. It is intentionally lightweight; review provider-specific safety and behavior manually.

## Contribute a provider transfer

Read [CONTRIBUTING.md](CONTRIBUTING.md). A new skill needs a real migration contract, provider documentation links, an explicit unsupported-feature path, a dry-run/read-back/rollback sequence, and verification of the user-facing result.

## License

[MIT](LICENSE)
