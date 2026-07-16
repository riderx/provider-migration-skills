# Cutover checklist

## Before the first target upload

- [ ] A source project/channel/bundle/CI inventory and target channel/version map exists.
- [ ] The repository uses the Capgo updater package and `npx cap sync` completed.
- [ ] Every custom source updater call, including `LiveUpdate.ready()`, has an accepted map, removal, or explicit exception.
- [ ] A new native binary containing the target updater is available to internal devices.
- [ ] Target channels were read back after creation and a non-production bundle was read back after upload with a compatibility/release-type decision.
- [ ] CI authentication uses an approved secret source, source credentials were not copied, and `--fail-on-incompatible` or an equivalent compatibility gate is enforced.

## Device and rollout gates

- [ ] An internal device applies a known target bundle, reaches `notifyAppReady()` as soon as it is genuinely ready, and launches successfully after restart.
- [ ] Version-targeting and channel boundaries are verified on at least one compatible and one incompatible native version when applicable; the CI gate rejects an incompatible bundle before publication and the channel/version rule excludes incompatible native binaries.
- [ ] Any custom resume, manual, or mandatory update path is exercised.
- [ ] A controlled failed-start Capgo rollback test passed on a non-production device.
- [ ] Source delivery remains available for old source-enabled binaries throughout the soak; a Capgo-native binary returns only to a prior compatible Capgo bundle unless another native release restores the old updater.

## Retirement

- [ ] The user approved the production soak result and source-retention end date.
- [ ] Historical data was archived or its non-migration was explicitly accepted.
- [ ] No channel, bundle, credential, or source project is removed without explicit authorization.
