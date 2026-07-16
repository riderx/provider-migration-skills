# Compatibility map

Use this as a decision register, not as an assumption that two products are equivalent. Verify current provider documentation and the connected account's capabilities during every migration.

| Cal.com capability | Google Appointment Schedules decision | Required proof |
| --- | --- | --- |
| Event type title, duration, location | Recreate when supported | Target page and test booking show the intended details. |
| Availability, date range, time zone | Recreate | Test as an invitee in at least one alternate time zone. |
| Buffers, minimum notice, limits | Recreate only if the target supports the exact rule | Test a slot that should be blocked. |
| Calendar conflict handling | Configure target calendar/conflict source | Create a busy event and confirm no double booking. |
| Invitee form and custom questions | Map field by field or explicitly accept loss | Test confirmation and downstream notification content. |
| Team, round robin, routing forms | Usually a separate design decision | Document an approved alternate routing path. |
| Workflows, reminders, SMS, webhooks | Audit separately | Verify notification/webhook behavior end to end. |
| Payments, coupons, limits by customer | Audit separately | Do not claim support without an approved target flow. |
| Website embed and custom booking domain | Replace only after target page passes external test | Render the live production surface unauthenticated. |
| Existing bookings | Retain on source unless explicitly migrated with a tested path | Confirm no booked appointment is lost or duplicated. |

## Minimum mapping record

| Cal.com event type | Target schedule URL | Owner calendar | Time zone | Referrers | Gaps | Approval |
| --- | --- | --- | --- | --- | --- | --- |
| source ID/slug | target URL | calendar | IANA zone | all URLs/embeds | explicit list | name/date |
