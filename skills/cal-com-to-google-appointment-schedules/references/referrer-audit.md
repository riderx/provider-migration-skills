# Referrer audit

A booking migration is incomplete if an old URL remains in a template, embed, CRM sequence, support macro, QR code, or custom domain.

## Build the inventory

1. Search all website, application, documentation, and shared-code repositories for Cal.com domains, short links, embeds, and event slugs.
2. Export or inspect operational email templates and broadcast messages. Do not assume repository search covers a hosted email tool.
3. Inspect CRM sequences, sales playbooks, social profile links, QR-code destinations, and redirects.
4. Normalize URLs before counting them. Record trailing slashes, query parameters, visible labels, and the target route each referrer should use.

## Replace only with an explicit map

Maintain a per-source-URL mapping table. Do not blanket-replace the Cal.com domain because different event types can map to different target schedules.

When editing a message or page, update both the link target and its visible call-to-action. Re-render or re-fetch the changed surface, then search again for old mapped URLs and malformed double-slash paths.

## Live availability gate

Open every target booking URL before retiring its source link. A prior referrer cutover found target routes intermittently unavailable even after their textual replacements were correct. Text search is necessary but not proof of a working booking surface.

## Historical boundary

A previous production cutover successfully inventoried and updated web/docs and hosted-email Cal.com links. The attempted Google Calendar schedule provisioning did not complete, so this skill intentionally requires live target creation and external booking validation rather than claiming an existing API clone path.
