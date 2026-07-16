# Google Analytics 4 to DataFast capability map

| Source surface | Target path | Contract | Required control |
| --- | --- | --- | --- |
| Historical GA4 traffic, events, conversions, ecommerce/revenue, attribution, audiences, and user data | No documented DataFast import path | Unsupported | Preserve GA4 or an approved source archive. Never upload GA4 CSV, Data API, or BigQuery data to DataFast or synthesize old events as new target events. |
| GA4 aggregate reports, Data API baselines, existing BigQuery evidence, and retention-bound exploration/funnel evidence | Required source-only archive and fixed-date comparison evidence | Manual source-only control | Record GA4 event/user retention, timezone, query/report definition, filters, sampling/data-quality status, checksum/location, and retention owner outside the repository. A new GA4 BigQuery link does not backfill prior history. |
| GA4 reporting timezone | DataFast website timezone and comparison calendar | Manual | Match the target website timezone before production collection, or record an owner-approved conversion and use it for every fixed-date comparison. |
| Google tag / repository tracker | Add the documented DataFast tracker with the approved trackingId and root domain | Supported repository change | The tracker markup uses trackingId (dfid_...); dashboard/API read-back uses websiteId. Dry-run all surfaces first, keep GA4 active during parallel running, and reuse the approved tracker on rerun. |
| Google Tag Manager or CMS tracker | Add a separate documented DataFast integration | Manual browser publication | The owner publishes the additive GTM/CMS change after dry-run. Do not overwrite or disable the GA4 tag while verifying the target. |
| GA4 events, key events, event rules, custom dimensions, and custom metrics | Rebuild accepted future behavior as DataFast goals and allowed properties | Manual | Inventory GA4 settings plus repository/GTM/CMS instrumentation. Normalise names and properties; never call same-name events semantically equal without owner approval. |
| Server-side Measurement Protocol, user ID, and identity paths | Rebuild only approved target server-side behavior | Manual | Do not copy GA API secrets or historic identifiers. Require a privacy review and least-privilege target credential before an implementation. |
| Funnels, reports, explorations, shared links, and dashboard navigation | Rebuild approved target funnels/views manually | Manual | Verify stages, filters, attribution, and recipient access independently. Historical GA4 dashboard objects are not imported. |
| Google Search Console | Authorize a fresh DataFast Search Console integration | Manual | Confirm the matching verified Search Console property and owner approval; do not infer it is transferred from a GA4 link. |
| Google Ads links, audiences, remarketing lists, and ad activation | No documented automatic DataFast target migration | Unsupported | Retain/rebuild under a separately approved advertising plan. DataFast filters or goals are not a replacement claim for advertising audiences. |
| Ecommerce/revenue payment-provider setup | Connect an approved DataFast payment provider | Manual browser setup | Treat it as a fresh owner-approved target integration. Do not represent historic GA4 revenue/attribution as imported. |
| Payment API or checkout metadata | Implement an approved DataFast server-side path | Manual repository change | Require financial, privacy, and semantic approval; use the target key only where documented, make delivery idempotent, and never duplicate payment events or replay historical GA4 revenue. |
| Cookies, consent mode, exclusions, subdomains, cross-domain tracking, proxy, and CSP | Choose and implement DataFast behavior | Manual | Treat as a legal/product decision; default and cookieless target modes can materially alter attribution and returning-visitor behavior. |
| Team access, property settings, and billing | Create target access/settings manually | Manual | Do not copy roles, data-sharing settings, subscriptions, or payment authorization between providers. |

## Event-mapping ledger

For every future event or key event, record:

- source setting location and real repository/GTM/CMS/server trigger;
- source event name, parameters, key-event status, redirect/callback behavior, and intended business meaning;
- proposed DataFast goal name, permitted properties, and whether it is browser, server, payment, or identity behavior;
- target test steps, target audience, and the owner who accepted any semantic difference; and
- whether historical evidence remains source-only.

Never put production payloads, visitor/user identifiers, Measurement Protocol secrets, OAuth material, payment data, or DataFast credentials in this ledger.
