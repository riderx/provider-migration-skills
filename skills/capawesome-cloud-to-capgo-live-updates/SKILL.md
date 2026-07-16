---
name: capawesome-cloud-to-capgo-live-updates
description: Migrate Capawesome Cloud Live Updates updater code, configuration, channels, CI uploads, and rollout controls to Capgo with a compatibility audit, new-native-binary gate, device validation, and reversible cutover. Use when moving a Capacitor app from Capawesome Cloud Live Updates to Capgo.
license: MIT
compatibility: Requires authorized access to the Capawesome Cloud and Capgo projects, the Capacitor app repository, CI configuration, and test devices. Network access required. Never store credentials, provisioning files, signing keys, or source bundles in repository files.
metadata:
  author: provider-migration-skills
  version: "1.0.0"
---

# Capawesome Cloud Live Updates to Capgo

Move the updater runtime and delivery path as one migration. Replacing a JavaScript package without building and distributing a new native binary does not move existing users: the Capgo native updater must exist inside the installed app before it can receive Capgo bundles.

## Required outcome

Deliver a reconciliation report containing:

- the source project, channel/bundle topology, updater configuration, manual API calls, CI jobs, and source-to-target channel map;
- the exact package, import, configuration, and API-call changes with approved behavior differences;
- target channel/bundle read-back evidence and device-level proof on a new Capgo-enabled binary;
- a source archive/retention decision for bundles, analytics, audit records, and signing-key references;
- the soak period, rollback owner, and explicit approval required before source retirement.

Do not delete Capawesome Cloud bundles, channels, keys, CI secrets, or project data during the migration.

## Scope and boundaries

This skill covers Live Updates. It does not automatically migrate historical bundles, installed-device history, analytics, billing, signing material, app-store credentials, or unrelated plugins. Treat each as a separately approved capability; [the capability map](references/capability-map.md) makes that boundary explicit.

## 1. Preflight and inventory

1. Confirm the Capgo organization/app, source-retention period, rollback owner, target channels, native-version compatibility rules, and internal-device rollout path.
2. Record the source Cloud project, each channel and bundle, source updater configuration, auto-update/manual strategy, retention, signing-key references, and CI delivery jobs. Store references and redacted metadata only.
3. Search the repository for `@capawesome/capacitor-live-update`, its configuration, `ready`, fetch/download/select/reload/current-bundle APIs, resume listeners, splash logic, and custom error/retry behavior.
4. Capture the application IDs, current native versions, web build directory, and every pipeline that can publish a bundle.
5. Create a source-to-target channel/version table and classify each capability against `migration.json` before code or dashboard writes.

Stop when a behavior is not documented or cannot be tested. Do not interpret a channel name match as proof that version targeting, mandatory updates, keys, or rollout behavior match.

## 2. Replace the SDK and synchronize native projects

For the standard package, make the dependency change and synchronize both native projects:

~~~sh
npm uninstall @capawesome/capacitor-live-update
npm install @capgo/capacitor-updater
npx cap sync
~~~

Then make the repository changes deliberately:

1. Replace updater imports with `@capgo/capacitor-updater`.
2. Add `CapacitorUpdater.notifyAppReady()` as soon as the app is genuinely ready. Do not place it after slow network, authentication, or startup work that can exceed the configured readiness window; verify its placement on a real device.
3. Preserve forced/mandatory-update semantics explicitly. A target mandatory bundle and a `majorAvailable` listener after `notifyAppReady()` need an accepted product decision and device test.
4. Translate custom updater calls one by one using [the API map](references/capability-map.md). Remove only source calls that Capgo now performs automatically.
5. Start from minimal Capgo configuration; do not copy legacy source configuration fields that have a different target meaning.
6. Run the repository formatter, type checks, and native build/sync checks before distributing a binary.

No bundle may be cut over until a new native binary containing the Capgo updater is available on internal devices.

## 3. Set up target delivery without widening scope

1. Create the Capgo app/channels through a documented target path and read the resulting configuration back.
2. Map source channels, rollout rules, and native-version constraints explicitly. Keep a narrow internal/test channel for the first bundle.
3. Preserve CI structure where possible. Replace the source bundle-upload step only after the web build succeeds and use an approved runtime secret source for Capgo authentication.
4. A public upload shape is:

~~~sh
npx @capgo/cli@latest bundle upload --path <web-directory> --channel <channel>
~~~

5. Upload a known test artifact to the non-production channel. Require Capgo bundle compatibility/release-type metadata and use the target CLI’s `--fail-on-incompatible` guard (or an equivalent enforced CI check); Capgo does not block every incompatible upload by default. Fetch the target state and reconcile app, channel, native-version constraints, bundle metadata, and compatibility result.

Do not copy credentials between providers, commit them to CI files, or treat a successful upload response as proof that a device can apply the update. Rollback cannot make an incompatible native bundle safe.

## 4. Verify on real devices

Use new Capgo-enabled internal binaries and a non-production target channel to prove the migration:
- app startup reaches `notifyAppReady()` as soon as it is genuinely ready after first install and restart;
- the expected bundle is discovered, downloaded, selected, and survives a restart;
- the first target bundle reaches only the new binary cohort, the CI gate rejects an incompatible bundle before publication, and the channel/version rule excludes incompatible native binaries;
- any intentional manual, resume, or mandatory-update behavior follows the accepted map;
- a controlled non-production failed-start test exercises the intended Capgo rollback behavior; and
- CI publishes the expected artifact to the intended target channel only after a successful web build.

Keep source delivery unchanged during this stage. Capture device evidence and Capgo read-back in the final report.

## 5. Roll out by binary adoption and retain rollback

Distribute the Capgo-enabled binary through the normal internal/app-store process. Users on old binaries remain on their existing source updater integration; migrate operational delivery only for the adopted Capgo-capable cohort.

After the approved soak period, move production uploads/channel controls to Capgo. Roll back by stopping or redirecting Capgo channel delivery and returning a Capgo-native binary to a prior compatible Capgo bundle. Old Capawesome-enabled binaries can remain on the source path during the soak, but a Capgo-native binary cannot switch back to the Capawesome native updater by changing a channel; that requires another native release. Do not delete history, bundles, keys, or source configuration as a rollback action.
