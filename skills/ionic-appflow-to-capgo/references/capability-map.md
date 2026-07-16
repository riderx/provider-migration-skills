# Appflow to Capgo capability map

Use the [Capgo Appflow migration guide](https://capgo.app/docs/upgrade/from-appflow-to-capgo/), [version targeting guide](https://capgo.app/docs/live-updates/version-targeting/), [compatibility guide](https://capgo.app/docs/live-updates/compatibility/), and [readiness-hook guide](https://capgo.app/docs/plugins/updater/notify-app-ready/) as the target authority. Verify current behavior in the actual app and target account.

| Appflow concern | Capgo path | Migration rule |
| --- | --- | --- |
| Live Updates native plugin | `@capgo/capacitor-updater` plus `npx cap sync` | Requires a new native binary; existing Appflow-only binaries cannot load the new native plugin. |
| `sync()` background behavior | Native auto-update | Remove manual sync only after the intended timing is verified on a device. |
| Force/mandatory update behavior | Mandatory target bundle plus `majorAvailable` listener after `notifyAppReady()` | Preserve the user-facing mandatory-update decision explicitly and device-test it. |
| Custom download/reload flow | `CapacitorUpdater.download()` and `set()` where needed | Keep only intentional custom logic; verify resume and rollback behavior. |
| Version diagnostics | `CapacitorUpdater.current()` | Preserve only diagnostics actually used by the app or operations team. |
| Appflow channel/deployment | Capgo channel, bundle compatibility/release type, and optional native-version rule | Make an explicit source-channel to target-channel/version map; read target configuration back. |
| CI bundle deployment | Capgo CLI/API after the existing web build | Preserve the CI provider, require `--fail-on-incompatible` or an equivalent enforced compatibility gate, and keep authentication in the approved secret manager. |
| Bundle history, analytics, device history | No implied import | Archive source records separately and report the gap. |
| Native build credentials and store release | Separate human-owned process | Do not extract, copy, or commit signing material; a new binary still needs normal distribution approval. |

## API-call mapping

The target migration guide maps the common source calls as follows:

| Appflow call | Target handling |
| --- | --- |
| `LiveUpdates.sync()` | Native automatic update behavior, unless custom timing is required. |
| `LiveUpdates.download()` | `CapacitorUpdater.download()` for an intentional custom flow. |
| `LiveUpdates.reload()` | `CapacitorUpdater.set()` for an intentional custom flow. |
| `LiveUpdates.getVersion()` | `CapacitorUpdater.current()` for diagnostics. |

`CapacitorUpdater.notifyAppReady()` is the required readiness hook for the native flow. Call it as soon as the app is genuinely ready, without placing it behind slow network or authentication work, and verify the placement on a real device.
