# Provider Migration Skills

Portable [Agent Skills](https://agentskills.io/specification) for moving operational workflows from one SaaS provider to another without treating a successful API response as proof of a successful migration.

Each skill follows the same safety contract: capture the source inventory, normalize the intended configuration, dry-run the mapping, create or update the destination, read it back, test the public/user-facing behavior, and retain the source until the cutover is accepted.

## Included skills

| Skill | Covers |
| --- | --- |
| [hyperping-to-openstatus](skills/hyperping-to-openstatus/SKILL.md) | HTTP monitors, monitor assertions, regions, cadence, status pages, public monitor visibility, and latency charts. |
| [cal-com-to-google-appointment-schedules](skills/cal-com-to-google-appointment-schedules/SKILL.md) | Booking event types, availability, booking links and embeds, Google Appointment Schedules, and a reversible cutover. |

## Install

The [Skills CLI](https://www.skills.sh/docs/cli) is the standard installer. Replace riderx after forking this repository.

~~~sh
npx skills add riderx/provider-migration-skills --list
npx skills add riderx/provider-migration-skills --skill hyperping-to-openstatus
npx skills add riderx/provider-migration-skills --skill cal-com-to-google-appointment-schedules
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
skills/
  <provider-pair>/
    SKILL.md          # concise activation instructions
    references/       # focused field maps and verification checklists
scripts/
  validate-skills.mjs # dependency-free repository validation
~~~

This uses the Agent Skills SKILL.md format, progressive disclosure, and a skills.sh.json grouping file, following the structure used by the [Vercel Agent Skills collection](https://github.com/vercel-labs/agent-skills). See the [Agent Skills best practices](https://agentskills.io/skill-creation/best-practices) before adding a new provider pair.

## Validate

~~~sh
node scripts/validate-skills.mjs
~~~

The validator checks required frontmatter, directory/name agreement, description quality constraints, and obvious credential-shaped strings. It is intentionally lightweight; review provider-specific safety and behavior manually.

## Contribute a provider transfer

Read [CONTRIBUTING.md](CONTRIBUTING.md). A new skill needs a real migration contract, provider documentation links, an explicit unsupported-feature path, a dry-run/read-back/rollback sequence, and verification of the user-facing result.

## License

[MIT](LICENSE)
