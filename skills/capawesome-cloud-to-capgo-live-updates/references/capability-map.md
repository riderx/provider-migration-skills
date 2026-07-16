# Capawesome Cloud to Capgo capability map

Read the [Capgo migration guide](https://capgo.app/docs/upgrade/from-capawesome-to-capgo/), [Capawesome Cloud setup documentation](https://capawesome.io/docs/cloud/live-updates/setup-capacitor-6/), [compatibility guide](https://capgo.app/docs/live-updates/compatibility/), and [readiness-hook guide](https://capgo.app/docs/plugins/updater/notify-app-ready/) before execution. Provider behavior can change; the repository and real device remain the migration authority.

| Source concern | Capgo path | Migration rule |
| --- | --- | --- |
| Native live-update plugin | `@capgo/capacitor-updater` plus `npx cap sync` | Build and distribute a new native binary before any target bundle can reach users. |
| Automatic update behavior | Target native auto-update | Remove source glue only after the corresponding behavior is accepted and device-tested. |
| `LiveUpdate.ready()` | `CapacitorUpdater.notifyAppReady()` | Call the target hook as soon as the app is genuinely ready; do not place it after slow network or authentication work. |
| Forced/mandatory update behavior | Mandatory target bundle plus `majorAvailable` listener after `notifyAppReady()` | Preserve the user-facing mandatory-update decision explicitly and device-test it. |
| Custom fetch/download/select/reload logic | Capgo API calls where still required | Translate one call at a time; do not substitute a looser rollout behavior. |
| Source channel/bundle topology | Capgo channel, bundle compatibility/release type, and optional native-version targeting | Build an explicit mapping and read target configuration/bundles back. |
| CI upload | Capgo CLI/API after the existing web build | Keep the CI provider, require `--fail-on-incompatible` or an equivalent enforced compatibility gate, and use an approved secret source. |
| Bundle, analytics, and device history | No implied import | Archive source data separately and report the non-migration. |
| Signing keys and store credentials | Human-owned target configuration | Do not extract, copy, or commit secrets. |

## API-call mapping

The documented migration guide maps common source calls as follows:

| Capawesome Live Update call | Capgo equivalent | Decision |
| --- | --- | --- |
| `ready()` | `CapacitorUpdater.notifyAppReady()` | Call as soon as the app is genuinely ready; verify the configured readiness window on a device. |
| `fetchLatestBundle()` | `CapacitorUpdater.getLatest()` | Use only when the app intentionally controls fetch timing. |
| `downloadBundle()` | `CapacitorUpdater.download()` | Keep only an intentional custom download flow. |
| `setNextBundle()` | `CapacitorUpdater.next()` | Verify the next-launch selection behavior on a device. |
| `reload()` | `CapacitorUpdater.reload()` | Keep only if the accepted user flow requires an immediate reload. |
| `getCurrentBundle()` | `CapacitorUpdater.current()` | Preserve only necessary diagnostics. |

`CapacitorUpdater.notifyAppReady()` is the required readiness hook for the standard native flow. Call it as soon as the app is genuinely ready, without placing it behind slow network or authentication work, and verify the rollback path on a non-production device.
