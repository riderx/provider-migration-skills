# Cutover checklist

## Inventory and target design

- [ ] Every active Cal.com event type has a target schedule or approved exception.
- [ ] Availability, time zone, duration, buffers, notice, limits, locations, calendars, and forms are documented.
- [ ] Team routing, workflows, payments, webhooks, and custom questions have an explicit decision.
- [ ] All published Cal.com URLs, embeds, email templates, CRM sequences, docs, and custom-domain routes are inventoried.

## External validation

- [ ] An unauthenticated test visitor can open the target page.
- [ ] A real test booking creates one event on the intended calendar.
- [ ] The host and invitee receive the approved confirmation.
- [ ] Busy time, buffer, minimum-notice, and booking-limit test cases are blocked.
- [ ] Cancellation and rescheduling work as expected.
- [ ] At least one alternate time-zone or daylight-saving test passes where relevant.

## Cutover and rollback

- [ ] Each referrer was updated and rendered/read back after the change.
- [ ] The custom domain/redirect, if any, resolves to the tested target page.
- [ ] Cal.com remains available through the agreed soak period.
- [ ] Rollback is documented as restoring referrers or disabling the target schedule.
- [ ] Permanent Cal.com cleanup has explicit approval.
