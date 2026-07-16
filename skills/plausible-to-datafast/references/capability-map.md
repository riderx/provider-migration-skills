# Plausible to DataFast capability map

| Source surface | Target path | Contract | Required control |
| --- | --- | --- | --- |
| Core historical analytics | Export the Plausible **Export Data** ZIP from site settings, then upload it in DataFast Website settings → Import | Supported browser workflow | Require a new or owner-approved empty target, or ledger proof that its checksum was not already applied. Never re-upload after ambiguous completion; retain the ZIP outside the repository and compare fixed historical ranges. The full export excludes data Plausible previously imported from external sources. |
| Pageviews, visitors, referrers, device, country/location, UTM, bounce rate, session duration | Included in the documented DataFast importer | Supported | Check each named dimension/metric for the approved date ranges, not only total pageviews. |
| Tracker script | Replace the repository-owned Plausible tag with the documented DataFast tracker using the approved website ID and root domain | Supported repository change | Keep Plausible live while testing a real target pageview; check CSP, proxy, consent, and duplicate-script behavior. |
| Custom goal definitions and event instrumentation | Rebuild with DataFast's documented custom-goal interfaces after a field-by-field review | Manual | Inventory source goal settings in Plausible plus repository, CMS, or GTM instrumentation. Normalise names and properties; DataFast goal names are lowercase and limited to 64 characters, and properties have documented count/name/value limits. |
| Historical custom events and goals | No documented DataFast import path in the Plausible importer | Unsupported | Preserve source evidence separately; do not say an event-history transfer occurred because future goals were rebuilt. |
| Plausible callbacks, pageview goals, automated measurements, and revenue-goal semantics | Review each target behavior individually | Manual | Stop for an owner decision when a target meaning differs. Do not mechanically rename an event and call it equivalent. |
| Dashboards, shared links, segments, and funnels | Rebuild approved target views in the dashboard | Manual | Test each replacement as the intended recipient. Do not infer that a target view preserves source filtering or attribution. |
| Team members, roles, and billing | Invite/recreate only after owner approval | Manual | Never copy access, subscription, or payment-provider authorization automatically. |
| Revenue attribution and payment integrations | Configure separately in the target if explicitly approved | Manual | The documented Plausible importer does not promise historical revenue-goal transfer. Test a non-production or controlled conversion before production use. |
| Consent, cookies, subdomains, cross-domain tracking, proxy, and CSP | Choose a DataFast configuration and update code/deployment controls | Manual | Treat this as a legal/product decision. DataFast's default and cookieless configurations have different tracking behavior. |
| Optional API baselines | Use Plausible Stats API and a scoped DataFast `dft_` token restricted to the target website with `analytics:read` | Manual | API access is not required for the ZIP importer. Use only required read scopes, keep tokens out of client code, and reserve a `df_` website key for an actual website-key operation rather than comparison. |

## Event-mapping ledger

For each source event or goal, record:

- repository location and trigger;
- source display name, event name, properties, callback/redirect behavior, and target audience;
- proposed normalized DataFast goal name and permitted properties;
- whether it is browser, server, payment, pageview, or automated behavior;
- target test steps and the owner who accepted any semantic change.

Never place production event payloads, visitor identifiers, payment data, or tokens in this ledger.
