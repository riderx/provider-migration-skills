# Google Workspace to Shipmail cutover checklist

## Scope, access, and inventory

- [ ] The source is an approved custom-domain Google Workspace email scope; @gmail.com addresses are recorded as non-transferable.
- [ ] The domain, registrar/DNS owner, Workspace edition, target plan/storage, cutover owner, rollback owner, source-retention owner, and legal/compliance owner are unambiguous.
- [ ] The mailbox/address ledger includes primary addresses, aliases, forwarding, catch-all, group/shared-mailbox dependencies, filters, labels, signatures, auto-replies, clients, external senders, public references, and owners.
- [ ] All non-mail Workspace services and source-only controls have separate migration, replacement, or retention decisions.
- [ ] Google IMAP/app-password requirements are confirmed per mailbox. No normal Google password, app password, API key, OAuth material, mail export, or personal data was placed in the repository or reconciliation report.
- [ ] Browser-led migration is the default. Any Shipmail API use has written owner approval for exact account-wide key operations, idempotent target behavior, and read-back.
- [ ] Existing MX TTL was lowered to 300 at least 24 hours before the approved DNS window.

## Target staging and import

- [ ] The same custom domain and every approved Shipmail mailbox exist and were read back before any MX change.
- [ ] For each API-created mailbox, the new target password used an approved secret-manager-only handoff, never entered a report or log, and the recipient reset it before normal use.
- [ ] Target aliases, forwarding, catch-all, shared mailbox/team access, rules/Sieve, signatures, auto-replies, client access, mailbox passwords/2FA, and public references were recreated and tested where approved.
- [ ] Target capacity covers selected email, attachments, contacts, and calendars, with accepted exceptions documented.
- [ ] Each mailbox import selected the approved folders/date range and used a user-approved app password.
- [ ] Each import report was reconciled, including labels-to-folders behavior, skipped Starred/Important views, spam/trash decision, and messages over 50 MB.
- [ ] Contacts were imported from approved VCF files and counts/sample fields were reconciled without exposing personal data in the report.
- [ ] Each approved calendar was imported from ICS, and recurrence/time-zone/duplicate-safe reimport checks passed. ACLs, resource calendars, subscriptions, conferencing, and automation have separate decisions.
- [ ] A duplicate-safe pre-cutover import completed near the approved MX boundary, and Google Workspace remains available for post-MX source-delta reconciliation.

## DNS, mail flow, and external verification

- [ ] The exact MX, one merged SPF record, Shipmail DKIM record, owner-approved DMARC policy, and every authorized external sender were reviewed before DNS changes.
- [ ] No duplicate SPF record exists. A temporary DMARC policy, if used, has a named owner and replacement date.
- [ ] At the approved window, MX was set to **10 mx1.shipmail.to** and Shipmail shows verified domain/authentication state.
- [ ] Independent external tests prove inbound delivery, outbound delivery, reply path, aliases, forwarding confirmation, catch-all, shared mailbox access, external senders, IMAP/SMTP clients, and expected authentication headers.
- [ ] Google forwarding was removed only after target delivery tests avoided loops.
- [ ] After MX propagation, every source message that arrived in Google after the cutover boundary was duplicate-safely re-imported into Shipmail or manually reconciled, with source/target counts, import report, and exceptions recorded before acceptance.
- [ ] Rollback instructions and authority are documented. A rollback restores approved source mail-flow configuration while preserving Shipmail, Google, and source-compliance evidence for reconciliation.

## Soak, source retention, and acceptance

- [ ] Both source and target mail paths are monitored for at least one business day or an owner-approved alternative soak period.
- [ ] Vault/eDiscovery, retention, holds, audit evidence, source exports, recovery access, and source billing are preserved under the approved legal/compliance plan.
- [ ] Drive, Docs, Sheets, Meet, Chat, Groups, identity/device administration, OAuth apps, and other non-mail Workspace services have an accepted separate plan.
- [ ] Owner and compliance approval explicitly cover cancellation, account deletion, credential revocation, archive disposal, and source deprovisioning. No source action occurs before that approval.
