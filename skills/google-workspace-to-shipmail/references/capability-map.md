# Google Workspace to Shipmail capability map

| Source surface | Target path | Contract | Required control |
| --- | --- | --- | --- |
| Custom-domain mailbox history, labels, read state, and dates | Shipmail Gmail/IMAP mailbox import | Supported browser import | Use a per-user app password, select scope deliberately, reconcile the import report, and run an approved duplicate-safe post-MX source-delta import or documented manual reconciliation. Labels become folders; record skipped spam/trash, Starred/Important views, and messages over 50 MB. |
| Google Workspace user/address inventory | Shipmail mailboxes | Supported target API or dashboard setup | Create only owner-approved same-domain mailboxes after dry-run. API automation is optional and requires a target account key; use stable-address lookup, idempotent write, full read-back, a secret-manager-only target password handoff, and recipient reset before normal use. |
| Google Contacts | VCF upload during target mailbox import | Manual file transfer | Export and import only approved contact data. Compare counts and samples without placing contact data in the reconciliation report. No documented live Google Contacts sync exists. |
| Google Calendar | Google Takeout ICS -> Shipmail Calendar import | Manual file transfer | Import each approved calendar separately. Verify recurrence, time zone, and duplicate-safe reimport. Redesign ACLs, resource calendars, subscriptions, conferencing, and automation separately. |
| Aliases | Existing Shipmail mailbox alias | Manual recreation | Map each address to one approved target mailbox and test external delivery. An alias is not an independent inbox or credential. |
| Forwarding | Target per-mailbox forwarding | Manual recreation | Confirm every external destination and target limit. Retire Google forwarding only after post-cutover delivery tests avoid loops. |
| Catch-all | One Shipmail catch-all mailbox per domain | Manual recreation | Choose and test a single destination. Enabling a replacement changes the previous catch-all behavior. |
| Google Groups, delegated mail, shared inboxes | Shipmail shared mailbox plus invitations | Manual topology redesign | Record membership, access, send-as behavior, delivery rules, moderation, and owner; recreate only approved behavior and test with real recipients. |
| Gmail filters and labels rules | Shipmail inbox rules or Sieve | Manual translation | Mail labels import as folders, but filter logic does not. Translate each approved rule, test it with fresh mail, and retain a source rule ledger. |
| Signatures, auto-replies, spam choices, mail clients, passwords, 2FA, and SSO | Target mailbox/account settings | Manual recreation | Do not copy Google credentials or identity controls. Configure and test only approved target behavior. |
| Custom domain, MX, SPF, DKIM, and DMARC | Existing registrar + Shipmail domain setup | Manual cutover | Add domain and target mailboxes before moving MX. Lower TTL first; publish one merged SPF, target DKIM, and an owner-approved DMARC policy; prove real external mail flow. |
| External SMTP senders, apps, web forms, support tools, and public address references | Re-authorized target integrations and updated references | Manual recreation | Inventory every sender/reference, preserve it in the SPF/DKIM plan where applicable, update only after tests, and check real user-facing surfaces. |
| Mail history, Vault, retention, holds, eDiscovery, audit evidence, and legal obligations | Protected source archive and compliance process | Mandatory source-only control | Do not claim it migrated. Preserve/export under legal direction, retain access and billing through acceptance, and do not deprovision while a hold or retention requirement remains. |
| Drive, Shared Drives, Docs, Sheets, Slides, Meet, Chat, SSO/SCIM, device management, OAuth apps, admin policies, DLP, and audit services | No Shipmail target path | Unsupported | Assign each workload an independent migration, replacement, or retention plan before cancelling Workspace. |
| @gmail.com addresses | No custom-domain target address transfer | Not applicable | Keep the Google address or plan separate forwarding/communications. Do not represent it as an owned Shipmail address. |

## Required mailbox ledger

For every source mailbox or address, record:

- source address, owner, source mailbox ID, storage used, mailbox history scope, and legal/retention status;
- target mailbox ID, alias/shared/catch-all/forwarding decision, target owner/access, and import job/report reference;
- source filters, labels, signatures, auto-replies, client/integration dependencies, external sender dependencies, and public references;
- import result: selected folders/date range, imported summary, skipped-item summary, contact result, calendar result, exception owner, pre-cutover result, post-MX source-delta reconciliation, and final exception status; and
- external test evidence, cutover/rollback owner, source retention date, and deprovisioning approval.

Never include mail bodies, attachments, passwords, Google app passwords, API keys, OAuth material, recovery codes, raw contact data, or Vault exports in this ledger.
