# Provider-pair contract architecture

This repository keeps provider-specific guidance in Agent Skills while exposing a small, machine-readable contract for every route. The contract prevents an agent from treating a provider migration as an open-ended scrape-and-copy exercise.

## Data model

`providers/providers.json` is the canonical provider registry. Each provider has a stable ID, its primary domain, the access methods genuinely available, and primary documentation.

Every `skills/<source>-to-<target>/migration.json` has this shape:

~~~json
{
  "version": 1,
  "skill": "source-to-target",
  "source": "source-provider-id",
  "target": "target-provider-id",
  "summary": "What this pair covers.",
  "capabilities": [
    {
      "id": "capability-name",
      "status": "supported",
      "source_method": "api",
      "target_method": "api",
      "apply": "agent",
      "verification": ["target-readback", "public-surface"],
      "notes": "The material limit or control."
    }
  ]
}
~~~

The generated [migration matrix](MIGRATION-MATRIX.md) is the cross-pair view of these contracts. It is committed so people and agents can inspect it without executing a script, but it is never hand-edited.

## Status and path semantics

| Field | Values | Meaning |
| --- | --- | --- |
| `status` | `supported`, `manual`, `unsupported`, `not-applicable` | Whether the target has a documented path, needs an intentional human decision, lacks a warranted route, or falls outside this pair’s scope. |
| `source_method` / `target_method` | `api`, `browser`, `cli`, `repo`, `manual`, `none` | The practical path needed to read or apply the capability. `none` means there is no migration path. |
| `apply` | `agent`, `human`, `none` | Who may perform the action after planning. A browser path can still be agent-led, but destructive, consent, or credential actions stay human-owned. |
| `verification` | one or more named gates | Evidence required before cutover, such as `target-readback`, `public-surface`, `external-user`, `device`, `ci`, or `rollback-plan`. |

`supported` does not mean "blindly automatic." It still requires the verification gates in the contract. `manual` is not a failure; it is a truthful boundary where a UI-only setting, a billing entitlement, an approval, a secret, or an external system prevents safe unattended execution.
The validator permits `api`, `browser`, `cli`, and `repo` only when the relevant provider declares that path in the registry. `manual` and `none` are contract control paths, not provider APIs. It also enforces that `unsupported`/`not-applicable` capabilities use `target_method: none` and `apply: none`, while `manual` capabilities keep a real target path and a non-none actor. The `apply` field then distinguishes safe agent-led browser work from human-owned consent, credentials, billing, or irreversible actions.
## Add a provider pair

1. Add source and target entries to `providers/providers.json` if they are absent. Use only primary documentation for the registry.
2. Add `SKILL.md` with concise instructions, decision gates, and outputs. Put detailed maps in `references/`.
3. Add `migration.json`. Enumerate all material capabilities, especially source-only data, historical records, alerting, billing, secrets, webhooks, routing, and public URLs.
4. Classify each capability before writing automation. Do not write an API script for a browser-only or human-approved target path.
5. Regenerate and validate the matrix:

~~~sh
node scripts/build-migration-matrix.mjs
node scripts/validate-skills.mjs
~~~

6. In the skill, require dry-run, stable source-to-target IDs, target read-back, a real external/device test, source retention, and a reversible rollback.

## Design rules

- Keep provider pair contracts declarative. The skill owns provider-specific reasoning; the contract tells an orchestrator what it may attempt.
- Treat source history, analytics, signed artifacts, secrets, billing, and external integrations as separate capabilities. They are never implicitly copied because a monitor, booking page, or updater configuration moved.
- Prefer API or repository paths for deterministic, idempotent changes. Use browser paths only where the provider does not document a stable API. Keep human application for consent, secrets, billing, or irreversible choices.
- A generated matrix is a planning aid, not authorization. The invoking user still decides scope and approves exceptions or destructive retirement.
