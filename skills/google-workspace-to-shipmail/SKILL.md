---
name: google-workspace-to-shipmail
description: Migrate approved Google Workspace custom-domain mail, contacts, calendars, aliases, and mail flow to Shipmail with a duplicate-safe import, verified DNS cutover, and retained source/compliance boundary. Use when replacing Google Workspace email hosting with Shipmail.
license: MIT
compatibility: Scope is a custom-domain Google Workspace email migration. Requires owner-approved Google Workspace and Shipmail dashboard access, DNS authority, enough target storage, and a per-mailbox Google app password if using IMAP import. Browser migration needs no provider API key. Optional Shipmail API work requires an account-wide target key after the owner approves exact writes. Google Drive, Docs, Sheets, Meet, Chat, identity administration, and compliance controls are not transferred. Network access required. Never store credentials, exports, or personal mail in repository files.
metadata:
  author: provider-migration-skills
  version: 1.0.0
---

# Google Workspace to Shipmail

This is a custom-domain email-hosting cutover, not a full Google Workspace replacement. Shipmail's documented migration path covers mailbox history, contacts, calendars, mailboxes, aliases, and email routing. It does not transfer Google Drive, Docs, Sheets, Meet, Chat, Google Groups semantics, SSO/SCIM, device controls, Vault, eDiscovery, or other Workspace administration.

## Required outcome

Deliver a reconciliation report containing:

- the approved source domain, every mailbox and address, source-to-target mailbox ID ledger, aliases, forwarding, catch-all, groups/shared-inbox topology, filters, auto-replies, client settings, external senders, public address references, and owner for each decision;
- the source and target storage/capacity decision, exact import scope, per-mailbox import reports, skipped-message disposition, post-MX source-delta reconciliation, contact counts, calendar counts, and explicit exceptions;
- the target domain, created Shipmail mailboxes/aliases/shared mailboxes, target read-back, and the approved API-or-dashboard apply path;
- the DNS plan, registrar owner, 300-second TTL preparation, one merged SPF record, Shipmail DKIM record, DMARC decision, external sender plan, and accepted rollback owner;
- external inbound, outbound, alias, forwarding, catch-all, shared-mailbox, mail-client, and authentication evidence after cutover; and
- the source-retention, Vault/compliance archive, soak period, cancellation/deprovisioning decision, and explicit owner acceptance.

Do not change MX records, cancel Google Workspace, remove Google forwarding, delete source mail, revoke access, delete Vault exports, or deprovision users before this report is accepted. Keep both services available through the agreed soak period.

## 0. Confirm scope, access, and credentials

1. Stop unless this is an approved **custom-domain** Google Workspace migration. An @gmail.com address remains at Google and is not a Shipmail domain migration. Record the exact domain, DNS registrar, Workspace edition, source retention requirement, target plan/storage capacity, cutover owner, rollback owner, and legal/compliance owner.
2. Confirm the intended scope: mailboxes, mail history, contacts, calendars, aliases, forwarding, catch-all, shared mailboxes, filters, auto-replies, client access, external senders, and public mail-address references. Record every non-mail Workspace workload separately and give it another target or a source-retention plan.
3. The normal migration route is browser-led and needs **no Google or Shipmail API key**. For each mailbox import, use a user-approved Google/Workspace app password with IMAP enabled; a Workspace administrator may need to allow the required access. Do not collect or log a normal Google password.
4. Optional automation uses a Shipmail account API key created in **Settings -> API Keys**. Shipmail documents that this key is account-wide, so use it only after the owner approves the exact target domain/mailbox/import operations. Prefer dashboard creation if that approval is absent. Keep the key and Google app passwords only in an approved secret manager or current shell session; never put them in the repository, import report, mapping ledger, or chat transcript. For API-created mailboxes, pass a new target password only through the approved secret manager, never display or log it, and require the mailbox owner to reset it before normal use.
5. Do a non-mutating source and target inventory before any target write. Produce the field-level mapping in [the capability map](references/capability-map.md). Stop when an address owner, domain, source archive, target capacity, compliance obligation, or rollback authority is ambiguous.
6. Lower the existing MX TTL to 300 at least 24 hours before the approved cutover. This preparation does not authorize an MX change.

See [the primary-source notes](references/source-notes.md) for the live provider documentation. Re-check it before a production cutover; provider behavior and Google tenant policy can change.

## 1. Inventory and stage the target without moving mail

1. Inventory every source mailbox and address: primary address, display name, storage used, aliases, delegated/shared access, Google Group dependencies, forwarding, catch-all, filters, labels, signatures, auto-replies, spam settings, mail clients, SMTP/IMAP integrations, external senders, public website/support/login references, and owner. Do not copy message content, passwords, access tokens, or personal data into the ledger.
2. Inventory source-only controls: Vault matters/holds, retention rules, eDiscovery, audit evidence, legal obligations, billing, account recovery, SSO/SCIM, device management, OAuth apps, Drive/Shared Drives, Docs, Sheets, Slides, Meet, Chat, and Groups. These are not target-migrated merely because email moves.
3. Add the same custom domain in Shipmail and create the approved target mailboxes before cutover. When an owner approved the target API path, make creation idempotent: read the target domain/mailbox by the stable address before creating it, use Shipmail's idempotency mechanism for writes, and read it back afterward. Supply each API-created mailbox password only through the approved secret manager, never log or report it, and require the recipient to reset it before normal use. Otherwise use the dashboard and record the target IDs.
4. Recreate aliases, forwarding, catch-all, shared mailboxes, invitations, filters/inbox rules or Sieve, signatures, auto-replies, client access, and public references manually from the ledger. Target aliases route to an existing mailbox; target forwarding and catch-all semantics differ from Google Workspace. Do not assume a Google Group or filter has an equivalent target object.
5. Confirm target storage is sufficient for the selected mailbox history, attachments, contacts, and calendars. Keep a separate exception list for oversized mail, source labels without a target equivalent, shared resources, external delivery services, and any item deliberately retained at Google.
6. Do not publish new MX, SPF, DKIM, or DMARC records yet. Prepare the exact records and a delivery-test plan in [the cutover checklist](references/cutover-checklist.md).

## 2. Import mail, contacts, and calendars

1. For each approved mailbox, start Shipmail's Gmail/IMAP import in the target UI with the source address and user-approved app password. Select the approved folders and date range. Shipmail copies mail in the background and its documented import preserves folders/labels, read state, and dates; reruns skip duplicates.
2. Reconcile each import report before proceeding. Gmail labels become folders, a multi-label message can appear in each folder while stored once, Starred/Important views are skipped, spam and trash are opt-in, and messages over 50 MB are skipped and reported. Record every skipped item and the owner-approved disposition; do not call the import complete solely because the job ends successfully.
3. Import Google Contacts by exporting an approved VCF file and uploading it in the mailbox import flow. This is a file migration, not a documented live Google Contacts synchronization. Compare counts and sample contact fields after import without exposing contact data in the report.
4. Import calendars independently: export each approved Google Calendar through Google Takeout as ICS, then import the file in Shipmail Calendar. Shipmail documents recurring-event preservation and duplicate-safe reimport. Shared-calendar ACLs, Google Meet behavior, subscriptions, resource calendars, and automation require separate mapping and tests; do not claim they moved automatically.
5. Run a duplicate-safe pre-cutover mail import as close to the approved MX boundary as practical. Schedule a separate post-MX source-delta reconciliation because cached MX can still deliver mail to Google after the switch. Leave Google Workspace available until that reconciliation and the DNS gate complete. Never delete source messages or turn off source accounts as an import cleanup step.

## 3. Cut over domain mail flow

1. Before the MX change, re-read all target mailboxes, aliases, forwarding destinations, shared-mailbox access, catch-all destination, mailbox passwords/2FA setup, import reports, contact/calendar evidence, and storage capacity. Resolve every critical exception or obtain owner acceptance.
2. At the approved DNS window, update the domain at its existing registrar: point MX to **10 mx1.shipmail.to**, publish one SPF record that includes Shipmail and every still-authorized external sender, publish the exact Shipmail DKIM record from the target dashboard, and set the owner-approved DMARC policy. Never publish two SPF records. During coexistence, use a temporary DMARC policy only when the owner approves the risk and later replacement plan.
3. Verify DNS propagation and authentication from independent external senders and recipients. Configure test clients with Shipmail's documented IMAP 993 over SSL/TLS and SMTP 465 over SSL/TLS or 587 with STARTTLS. Test inbound mail, outbound mail, replies, aliases, forwarding confirmation, catch-all, shared mailbox access, client setup, spam behavior, and every critical external sender. Check headers and target read-back rather than assuming a green DNS dashboard proves delivery.
4. Remove Google forwarding only after post-cutover tests prove it is no longer needed; this avoids forwarding loops. Keep the target state and source archive intact when diagnosing failures.
5. After MX propagation and before acceptance, inventory every message that reached Google after the cutover boundary. Run an approved duplicate-safe Shipmail re-import or reconcile it manually, then compare the source count and import report with the target. Record unresolved exceptions and keep the source available.
6. Roll back only through the owner-approved incident plan: restore the prior DNS/mail-flow configuration, keep both providers and all evidence, and reconcile messages received after the cutover boundary. Do not delete Shipmail mail or source evidence as a rollback action.

## 4. Accept, retain, and deprovision deliberately

1. Monitor both source and target mail paths for the agreed soak period, at least one full business day unless the owner approves another period. Re-run delivery, authentication, alias, forwarding, group/shared mailbox, client, and external-sender checks after DNS propagation.
2. Keep Google Workspace, source exports, Vault/eDiscovery material, and billing access according to the legal/compliance plan. A target mail import is not a replacement for Vault, audit, retention, or legal-hold obligations.
3. Obtain explicit owner and compliance approval before cancelling Google Workspace, deleting user accounts, releasing the domain, revoking source credentials, or discarding archives. Non-mail Workspace services must have their own accepted migration or retention plan first.

Use [the cutover checklist](references/cutover-checklist.md) as the acceptance gate. The source remains the rollback path until the owner accepts the final reconciliation report.
