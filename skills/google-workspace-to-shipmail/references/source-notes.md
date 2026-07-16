# Primary-source notes

Refresh these links before a production migration. They document current provider behavior but do not replace a source inventory, target read-back, or real external mail test.

## Migration scope and mail import

- [Shipmail: Migrate from Gmail or Google Workspace](https://shipmail.to/docs/guides/migrate-from-gmail) documents custom-domain preparation, mailbox creation before cutover, lower MX TTL, target MX/SPF/DKIM/DMARC, Google IMAP/app-password requirements, final delivery tests, IMAP 993 over SSL/TLS, SMTP 465 over SSL/TLS or 587 with STARTTLS, and the fact that MX changes affect email rather than the wider Workspace suite.
- [Shipmail: Mailbox import](https://shipmail.to/docs/features/mailbox-import) documents background Gmail/IMAP import, folders/labels, read state, dates, duplicate-safe reruns, selected folder/date range, spam/trash options, 50 MB skipped-message reports, VCF contacts, and API/SDK/MCP import interfaces.
- [Shipmail: Mailboxes](https://shipmail.to/docs/mailboxes) documents mailbox storage, forwarding, catch-all, and IMAP mail import behavior.
- [Shipmail: Mailbox, alias, forwarding, and catch-all](https://shipmail.to/docs/guides/mailbox-vs-alias-forwarding-catch-all) documents target address semantics. [Shipmail: Catch-all](https://shipmail.to/docs/features/catch-all) documents the single active catch-all destination per domain.

## Calendar, shared access, and rules

- [Shipmail: Calendars](https://shipmail.to/docs/features/calendars) documents Google Takeout ICS import, recurrence preservation, duplicate-safe reimport, and the 10 MB per-file limit.
- [Shipmail: Shared inbox](https://shipmail.to/docs/guides/shared-inbox) documents shared mailbox setup and teammate invitations; it is a redesign target, not a Google Group importer.
- [Shipmail: Inbox rules](https://shipmail.to/docs/features/inbox-rules) and [Shipmail: Auto-reply](https://shipmail.to/docs/features/auto-reply) document fresh target configuration for manual recreation.

## Domain, authentication, and optional API

- [Shipmail: Domains](https://shipmail.to/docs/domains) and [Shipmail: Email authentication](https://shipmail.to/docs/guides/email-authentication) document domain verification and mail-authentication configuration. Preserve all authorized senders in a single SPF plan.
- [Shipmail: API getting started](https://shipmail.to/docs/guides/api-getting-started) documents account API keys, Bearer authentication, account-wide reach, and idempotency. API automation is optional and must stay owner-approved and secret-managed.
- [Shipmail: Account security](https://shipmail.to/docs/account-security) documents target account and mailbox security controls that must be configured rather than copied from Google.

## Source-only compliance and non-mail services

- [Google Vault: holds](https://support.google.com/vault/answer/7664657), [exports](https://support.google.com/vault/answer/2473458), and [retention rules](https://support.google.com/vault/answer/2990828) document source compliance controls that require legal/compliance direction before deprovisioning.
- [Shipmail compared with Google Workspace](https://shipmail.to/vs/google-workspace) describes the scope boundary: Shipmail is email hosting and is not a direct replacement for Google productivity-suite services. Keep each non-mail workload in a separate accepted plan.
