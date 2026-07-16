# Cutover checklist

## Before changing production delivery

- [ ] A source inventory and target channel/version map exists.
- [ ] The new binary contains the Capgo updater after `npx cap sync`.
- [ ] A test channel has a known bundle, a compatibility/release-type decision, and target read-back evidence.
- [ ] An internal device installed the new binary, applied the test bundle, restarted successfully, and reached `notifyAppReady()` as soon as the app was genuinely ready.
- [ ] Custom Appflow updater calls and mandatory-update behavior have a tested decision: remove, map, or retain application behavior.
- [ ] CI uses an approved secret source, uploads only after the web build succeeds, and enforces `--fail-on-incompatible` or an equivalent compatibility gate.
- [ ] Appflow production delivery remains intact and source bundles/history are archived if required.

## During the soak

- [ ] Verify the CI gate rejects an incompatible bundle before publication and the channel/version rule excludes incompatible native binaries.
- [ ] Monitor launch, update, mandatory-update, and Capgo rollback signals on internal/non-production cohorts first.
- [ ] Confirm source and target CI jobs cannot both publish a conflicting bundle for the same user cohort.
- [ ] Keep a documented route to stop Capgo delivery and return a Capgo-native binary to a prior compatible Capgo bundle; only old Appflow-enabled binaries can remain on the source delivery path.

## Retirement

- [ ] The user accepted the soak result and source-retention end date.
- [ ] Historical bundles/analytics were archived or their non-migration was accepted.
- [ ] Signing keys, CI secrets, and source settings were not deleted without explicit approval.
