# Contributing

Provider transfers are production changes. A new skill is accepted only when it can explain how an agent proves the destination behaves as intended.

## Add a skill

1. Add each provider to [providers/providers.json](providers/providers.json) before using its ID. Include primary documentation and the access methods that are genuinely available.
2. Create `skills/<source>-to-<destination>/SKILL.md` using valid Agent Skills frontmatter. The name must exactly match the directory.
3. Add `skills/<source>-to-<destination>/migration.json` using the contract described in [ARCHITECTURE.md](ARCHITECTURE.md). Declare every material capability as supported, manual, unsupported, or not-applicable; never leave a silence that looks like support.
4. Keep `SKILL.md` focused on activation, decision gates, safe execution, and the output the agent must report. Put field maps and long checklists in `references/`.
5. Cover the full lifecycle: preflight, source inventory, normalized mapping, dry run, idempotent apply, destination read-back, end-to-end verification, source retention, and rollback.
6. State every material mismatch. Do not silently claim a destination supports source behavior such as routing, payments, alert policies, custom questions, or webhooks.
7. Link primary provider documentation and label assumptions that need live verification.
8. Run `node scripts/build-migration-matrix.mjs` and `node scripts/validate-skills.mjs` before opening a change.

## Safety bar

- Never commit API keys, cookies, access tokens, booking records, customer data, or production exports.
- Never delete, disable, or overwrite a source provider during the initial migration unless the user explicitly asks after verification.
- For updates, fetch the full destination object first. Send every field that the provider can clear when omitted.
- Retrying a failed write must first read the destination so the retry does not create duplicates.
- A public page, custom domain, alert, or booking confirmation must be tested as an external user would see it.

## Scope bar

Prefer one provider pair per skill. A pair is useful only when it captures the provider-specific differences and the checks that generic migration advice misses. Avoid scripts until a deterministic, repeatable operation clearly benefits from one.

## Evidence bar

When adding a public case or claim to the evidence ledger, include the direct source URL, an evidence class (for example, first-party engineering account, provider-published customer case, or self-reported account), the actual scope, and the migration controls it supports. Attribute reported metrics to the source; do not present them as independently verified outcomes or as a guarantee for another provider pair.
