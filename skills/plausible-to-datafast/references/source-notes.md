# Primary-source notes

Use these links to refresh live provider behavior before a migration. They support the capability map but do not replace target read-back.

## Export and historical import

- [Plausible: Export your website stats](https://plausible.io/docs/export-stats) documents the full portability export from site settings, the email-delivered ZIP, and the limitation that it contains native data rather than data previously imported into Plausible.
- [DataFast: Import Plausible data](https://datafa.st/docs/import-from-plausible) documents the accepted Plausible ZIP, the DataFast Website settings → Import flow, the imported core metrics/dimensions, and the requirement to reconfigure Plausible custom events and goals.

## Tracker and goal mapping

- [DataFast: Get started](https://datafa.st/docs/getting-started) documents the tracker installation and its required website ID/domain configuration.
- [DataFast: Script configuration](https://datafa.st/docs/script-configuration) documents required tracker attributes, domain/cross-domain options, and custom-goal naming/property limits.
- [Plausible: Custom event tracking](https://plausible.io/docs/custom-event-goals) documents source custom-event/goal patterns that need a field-by-field target review.
- [DataFast: Track custom goals](https://datafa.st/docs/custom-goals) documents target goal tracking behavior.

## API keys and privacy decisions

- [Plausible Stats API](https://plausible.io/docs/stats-api) documents creating a Stats API key under Account settings → API Keys, bearer authentication, and its Business-plan availability.
- [DataFast: Authentication and scopes](https://datafa.st/docs/api/authentication) documents website **df_** keys, account **dft_** tokens, their dashboard locations, scopes, and least-privilege guidance.
- [DataFast CLI: Get started](https://datafa.st/docs/cli-introduction) documents the CLI, its account/site-key authentication choices, and its management/query surface.
- [DataFast: GDPR and cookieless tracking](https://datafa.st/docs/gdpr-cookieless-tracking) documents the cookie/consent tradeoffs that require a human privacy decision.
- [DataFast: Track across subdomains](https://datafa.st/docs/subdomain-tracking) and [track across different domains](https://datafa.st/docs/cross-domain-tracking) document topology decisions that cannot be inferred from the source tracker.
