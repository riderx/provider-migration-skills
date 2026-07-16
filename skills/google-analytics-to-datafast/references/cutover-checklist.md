# Google Analytics 4 to DataFast cutover checklist

## Scope and access

- [ ] The numeric GA4 property ID, web data stream, measurement ID, root domain, GA4 reporting timezone, DataFast websiteId, DataFast trackingId, target website timezone, and target root domain are unambiguous.
- [ ] The target website timezone matches GA4 before production collection, or the owner approved a written timezone conversion and fixed-date comparison convention.
- [ ] The source is GA4 web analytics, not a legacy UA property or an unapproved Firebase/app scope.
- [ ] Browser inventory and target setup use owner-approved dashboard access; no generic Google Analytics API key is assumed or embedded in client code.
- [ ] Optional GA4 baselines use OAuth/service-account access with analytics.readonly, Data API enablement, and property access. Optional DataFast read-back uses a target-restricted dft_ token with analytics:read and only the specific settings/goals/funnels/websites read scopes required.
- [ ] A df_ website key is used only for an approved server-side target operation, never merely for comparison. All credentials, exports, and visitor data are absent from the repository and report.

## Source history and baseline

- [ ] The migration record states that there is no documented GA4 history import into DataFast; no GA4 CSV, Data API, or BigQuery data was uploaded or replayed into the target.
- [ ] The source property and protected archive remain available according to an approved retention plan.
- [ ] GA4 event/user data-retention settings are recorded, and needed source-only exploration, funnel, and aggregate evidence is archived before it expires.
- [ ] Existing BigQuery evidence, if any, is recorded as source-only. A new link was not created with an expectation of retrospective GA4 backfill.
- [ ] Fixed aggregate comparison ranges document both website timezones, the approved conversion when relevant, dimensions, metrics, filters, attribution choices, and sampling/data-quality indications.
- [ ] Aggregate reports/API queries and their retained locations are documented without storing raw visitor data in the repository.

## Tracker and goals

- [ ] A non-mutating dry run inventoried all GA4 and DataFast tracker locations in repository, deployment, GTM, CMS, proxy, and consent surfaces, and produced the proposed additive target change.
- [ ] The public tracker uses the approved DataFast trackingId rather than dashboard/API websiteId. Reruns reuse the approved trackingId plus location instead of adding another script, SDK, or GTM tag.
- [ ] DataFast is configured for the approved target root domain, proxy/CSP, consent, exclusions, and cross-domain topology.
- [ ] On each intended page topology, the approved GA4 measurement ID and DataFast trackingId each fire once, with no unintended duplicate target sends and no browser, CSP, proxy, or consent errors.
- [ ] A real unauthenticated target pageview appears in the intended DataFast websiteId.
- [ ] Every mapped event/key event is exercised from its real trigger and read back with the approved target goal name and allowed properties.
- [ ] Server-side, identity, payment-provider, Payment API, and revenue behavior each has explicit privacy and semantic approval; GA Measurement Protocol secrets and historical identifiers were not reused.

## Manual surfaces, cutover, and rollback

- [ ] Target funnels, reports, shares, Search Console, payment-provider integrations, Payment API/checkout metadata, team access, and links are recreated and verified only where approved.
- [ ] Google Ads audiences, remarketing, and advertising activation are preserved or redesigned under a separate approved plan; they are not claimed as migrated.
- [ ] Parallel trends over an agreed traffic cycle are compared with the fixed timezone/date-boundary convention, and material differences are explained rather than hidden as parity failures.
- [ ] The owner explicitly approved removal of the Google tag, a GTM/CMS publication that disables GA4, source links, source service, archives, or credentials.
- [ ] Rollback restores the GA4 tag and source links while retaining DataFast data and source evidence for diagnosis.
