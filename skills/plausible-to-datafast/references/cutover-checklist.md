# Plausible to DataFast cutover checklist

## Access and setup

- [ ] The approved Plausible site and DataFast website are unambiguous, and the target website ID/root domain are recorded in the plan.
- [ ] The migration owner has approved browser access for the ZIP upload and all target writes.
- [ ] No API key is required for the browser importer. Optional baseline comparisons use a target-restricted `dft_` token with `analytics:read` and only necessary read scopes; a `df_` website key is not used merely for read-only comparison. All keys are absent from the repository and report.
- [ ] The source ZIP is stored outside the repository with restricted access, and its retention location is recorded without copying its contents.

## History import

- [ ] The ZIP came from Plausible site settings **Export Data**, not the chart export.
- [ ] Before upload, the target was a new or owner-approved empty DataFast website, or the ledger proved this ZIP checksum was not already applied there.
- [ ] The ZIP was uploaded once to the intended DataFast website and the import completed.
- [ ] If completion was uncertain, target evidence, ledger, and/or provider clarification resolved it before any retry; the ZIP was never blindly re-uploaded.
- [ ] Fixed historical ranges reconcile pageviews, visitors, referrers, devices, country/location, UTM campaigns, bounce rate, and session duration.
- [ ] The report documents that native Plausible data is the supported scope and identifies any excluded source-imported data.
- [ ] Historical custom events, goals, revenue data, and dashboard objects are not claimed as imported unless a separately documented path was verified.

## Tracker and goals

- [ ] Each Plausible tracker location, proxy, CSP rule, consent gate, and linked domain has an approved DataFast replacement or a documented exception.
- [ ] The target tracker carries the intended website ID and root domain and loads without a public browser error or duplicate tracker.
- [ ] A real unauthenticated pageview is visible in the intended DataFast website.
- [ ] Every mapped goal is exercised from its real trigger and read back with the expected normalized name/properties.
- [ ] Source-only callback, pageview-goal, automated-measurement, revenue, and payment semantics have an explicit owner decision.

## Cutover and rollback

- [ ] Plausible and DataFast ran in parallel through an agreed traffic cycle, and material differences are explained.
- [ ] Recreated dashboards, shares, funnels, team access, billing, and integrations were verified separately where approved.
- [ ] The user explicitly approved removal of the Plausible tracker, source links, source service, export, or credentials.
- [ ] Rollback is documented as restoring the Plausible tracker and links, not deleting DataFast data or source evidence.
