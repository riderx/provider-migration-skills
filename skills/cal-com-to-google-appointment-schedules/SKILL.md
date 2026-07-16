---
name: cal-com-to-google-appointment-schedules
description: Move Cal.com booking event types, availability, booking links, and embeds to Google Appointment Schedules with a compatibility audit, test booking, referrer cutover, and reversible rollback. Use when replacing Cal.com scheduling with Google booking pages.
license: MIT
compatibility: Requires authorized access to Cal.com, the relevant Google Calendar/Workspace account, and every site or message surface that publishes booking links. Network access required. Never store credentials or booking records in repository files.
metadata:
  author: provider-migration-skills
  version: "1.0.0"
---

# Cal.com to Google Appointment Schedules

Google calls this product **Appointment schedules**. Do not assume it is a field-for-field Cal.com replacement. Team routing, round robin, workflows, payments, webhooks, custom questions, reminders, and embeds need an explicit compatibility decision.

## Required outcome

Deliver a cutover report with:

- every Cal.com event type and its target Google Appointment Schedule or approved exception;
- the full availability, time-zone, duration, buffer, location, host/calendar, form, notification, and routing comparison;
- a complete inventory of public booking links, embeds, email templates, CRM messages, QR codes, and custom domains;
- a successful external test booking and cancellation/reschedule check;
- a reversible link rollback and source-retention date.

Do not delete Cal.com event types or existing bookings during the migration. Keep the old booking surface reachable until the agreed soak period ends.

## 1. Preflight

1. Confirm the Google account/calendar owner, Workspace entitlement, time zone, scheduling boundaries, and target public/custom booking URL.
2. Confirm whether the desired Google booking capability is available in the target account today. If a provider does not expose a stable supported API for a setting, use the dashboard and document the manual step rather than inventing automation.
3. Agree which Cal.com features must be preserved, which can change, and who approves exceptions.
4. Identify the rollback owner and keep the current Cal.com link/embedding source untouched until validation succeeds.

## 2. Inventory Cal.com and its referrers

For each Cal.com event type, record:

- title, slug, public URL, host or team, duration, location, calendar connection;
- availability windows, date range, time zone, buffers, minimum notice, booking limits, and conflict calendars;
- invitee fields, custom questions, confirmation and reminder behavior;
- routing, round robin, workflows, payments, webhooks, integrations, and embeds;
- all locations where the link is published: website, email templates, CRM sequences, docs, social bios, QR codes, support macros, and custom domains.

Make a stable source event-type ID to target schedule/link table. Use [the compatibility map](references/compatibility-map.md), [the referrer audit](references/referrer-audit.md), and [the cutover checklist](references/cutover-checklist.md).

## 3. Map before creating

Create a table with preserve, manual replacement, approved change, or unsupported for every behavior. Do not replace a routing or payment workflow with a generic availability page without explicit approval.

Use the same time zone and test a daylight-saving boundary if the audience books across regions. Confirm which calendar blocks conflicts; a target schedule that ignores a busy calendar can double-book even if its page looks correct.

## 4. Create target schedules

Build Google Appointment Schedules only after the mapping is accepted. Configure the intended host calendar, title, duration, availability, buffers, booking limits, location, booking form details, confirmation text, and public link.

Fetch or inspect the resulting target configuration after each creation. Capture the canonical target URL and test it in a private/incognito browser session. Do not cut over links based solely on an authenticated owner view.

## 5. Test a real booking flow

Run a non-production test booking as an external invitee and verify:

- the target schedule offers the expected slots in the invitee's and host's time zones;
- unavailable/busy periods, buffers, minimum notice, and booking limits are honored;
- the event appears on the intended calendar without duplicate or conflicting events;
- invitee confirmation, host notification, cancellation, and rescheduling behave as approved;
- required form data reaches the intended destination; and
- the public/custom booking URL and any embed render for an unauthenticated visitor.

Do a second test at a different time zone or DST boundary when the schedule serves multiple regions.

## 6. Cut over referrers deliberately

Replace Cal.com URLs and embeds one surface at a time. Re-fetch or render each surface after updating it. Search the repository, website, email templates, CRM, and documentation again to make sure stale links are not left behind.

If the public URL is behind a custom domain, verify DNS/routing and the final page before declaring cutover. Do not redirect a working source link until the target page has passed the external test booking.

## 7. Soak and rollback

Keep Cal.com event types and their links available through the agreed soak period. Roll back by restoring the prior referrer links or disabling the new schedule, not by deleting bookings or configurations. Request explicit approval before retiring any Cal.com event type, webhook, workflow, integration, or subscription.
