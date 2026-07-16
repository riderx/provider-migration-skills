---
name: ionic-appflow-to-capgo
description: Migrate Ionic Appflow Live Updates configuration, updater code, version targeting, and deployment automation to Capgo with a repository audit, new-native-binary gate, device verification, and reversible cutover. Use when moving a Capacitor app from Ionic Appflow to Capgo live updates.
license: MIT
compatibility: Requires authorized access to the Ionic Appflow and Capgo projects, the Capacitor app repository, CI configuration, and test devices. Network access required. Never store credentials, provisioning files, signing keys, or source bundles in repository files.
metadata:
  author: provider-migration-skills
  version: "1.0.0"
---

# Ionic Appflow to Capgo

This is a live-update migration, not a generic native build or app-store migration. The Capgo updater plugin must be compiled into a new native binary before a device can receive Capgo bundles. An existing Appflow-only binary cannot be silently repointed to a different native updater.

## Required outcome

Deliver a migration report containing:

- the Appflow app, channels, update strategy, target native versions, CI jobs, and source-to-target channel map;
- the exact updater package/configuration/API-call changes and every removed custom update path;
- the new native binary version and internal/device validation evidence;
- Capgo channel and uploaded-bundle read-back evidence, including version targeting where used;
- the source-bundle archive location, explicit gaps, source-retention date, rollback procedure, and the owner who approved cutover.

Do not delete Appflow configuration, source bundles, signing material, or CI secrets during this migration.

## Scope and non-goals

This skill covers repository-owned live-update code, configuration, delivery automation, and the operational cutover. Treat these as separate, human-approved work:

- native build credentials, signing keys, app-store submissions, and binary distribution;
- historical Appflow bundle, analytics, device, or audit-data import;
- Ionic enterprise plugins outside Live Updates;
- new billing, user entitlement, or security configuration.

Archive source history if it matters. Do not claim that a new Capgo project imported it unless a documented, tested import path exists.

## 1. Preflight and source inventory

1. Confirm the Capgo organization/app, owners, intended channels, source-retention period, rollback owner, and internal test-device path.
2. Inventory the Appflow app ID, each channel/deployment, update strategy, native version rule, retention behavior, signing-key reference, and every CI job that builds or deploys a bundle. Record references, never key values.
3. Inspect the repository for the Appflow updater package, `capacitor.config.*`, manual `sync`, `download`, `reload`, resume, splash-screen, and error-handling logic.
4. Capture the production web directory from the existing build and the native version/application IDs that will ship the new updater plugin.
5. Build a source-to-target channel/version table before changing code. Use [the capability map](references/capability-map.md) and [the cutover checklist](references/cutover-checklist.md).

Stop if a source behavior has no approved Capgo equivalent. Do not make a background update looser, turn off a force-update rule, or reduce version targeting without an explicit decision.

## 2. Replace the updater SDK and native integration

For the standard Appflow Live Updates package, replace the dependency and synchronize native projects:

~~~sh
npm uninstall @capacitor/live-updates
npm install @capgo/capacitor-updater
npx cap sync
~~~

Use the actual package and source code found in the repository as the authority for the source side. Then:

1. Replace imports with `@capgo/capacitor-updater`.
2. Call `CapacitorUpdater.notifyAppReady()` as soon as the app is genuinely ready. Do not place it after slow network, authentication, or startup work that can exceed the configured readiness window; verify its placement on a real device.
3. Preserve forced/mandatory-update semantics explicitly. A target mandatory bundle and a `majorAvailable` listener after `notifyAppReady()` need an accepted product decision and device test.
4. Translate any other custom updater code deliberately. Appflow `sync()` can be native automatic behavior; custom download/reload or diagnostics need the documented Capgo equivalents and device tests.
5. Do not copy the old Appflow configuration wholesale. Start from the minimal Capgo configuration, then add only options needed for an accepted behavior map.
6. Run the repository’s formatter, type checks, and native build/sync checks before producing the first binary.

A successful JavaScript build is insufficient: `npx cap sync` changes native projects, so the Capgo-enabled binary must be built and distributed to internal devices before live cutover.

## 3. Map channels, version targeting, and CI

1. Create the target app/channels through the documented Capgo dashboard, API, or CLI path. Read them back and compare the map with the approved plan.
2. Preserve compatibility boundaries. When a source deployment targets a native version, use a corresponding Capgo channel or native-version rule; do not send a bundle to an incompatible binary.
3. Keep the existing CI provider if it works. Replace only the Appflow bundle-delivery step after the web build succeeds.
4. Use an approved runtime secret source for Capgo authentication. Do not paste tokens into workflow files, logs, or the migration report.
5. Upload to a non-production channel first. A public CLI shape is:

~~~sh
npx @capgo/cli@latest bundle upload --path <web-directory> --channel <channel>
~~~
Add the documented native-version option only when the migration plan requires it. For every upload, require Capgo bundle compatibility/release-type metadata and use the target CLI’s `--fail-on-incompatible` guard (or an equivalent enforced CI check). Capgo does not block every incompatible upload by default, and rollback cannot make an incompatible native bundle safe. Fetch the target channel/bundle after upload and reconcile the version, channel, intended web artifact, and compatibility result.

## 4. Validate on the new native binary

Install the new Capgo-enabled binary on real internal devices before changing production distribution.

Verify all of the following:
- the app launches and reaches `notifyAppReady()` as soon as it is genuinely ready on first install and after a restart;
- a known test bundle is discovered, downloaded, applied, and recorded against the intended Capgo channel;
- the first target bundle reaches only the new binary cohort, the CI gate rejects an incompatible bundle before publication, and the channel/version rule excludes incompatible native binaries;
- resume/background, mandatory-update, and any intentional custom update timing behave as mapped;
- a controlled failed-start test on a non-production device exercises the intended Capgo rollback behavior;
- the CI job uploads only after a successful web build and reports the expected target bundle; and
- the Appflow production path remains unchanged while this validation runs.

Capture screenshots, device logs, and target read-back in the migration report. Do not use a production user as the first validation device.

## 5. Cut over by native-binary adoption

Publish the Capgo-enabled binary through the normal internal/app-store process. Only migrate users as that binary is adopted; old binaries keep their existing updater integration.

After the new binary and production channel pass the agreed soak period, move CI uploads and rollout controls to Capgo according to the approved channel map. Retain Appflow configuration and archived bundles until the user explicitly accepts retirement.
Rollback means stopping or redirecting Capgo channel delivery and returning a Capgo-native binary to a prior compatible Capgo bundle. Old Appflow-enabled binaries can remain on the Appflow path during the soak, but a Capgo-native binary cannot be switched back to the Appflow native updater by changing a channel; that requires another native release. Do not delete bundles, credentials, channels, or release history as a rollback action.
