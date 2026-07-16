# Primary-source notes

Refresh these sources during preflight because account eligibility and Google scheduling behavior can change.

- [Cal.com event-type inventory API](https://cal.com/docs/api-reference/v2/event-types/get-all-event-types) and [schedule inventory API](https://cal.com/docs/api-reference/v2/schedules/get-all-schedules) support the source inventory.
- [Cal.com booking inventory API](https://cal.com/docs/api-reference/v2/bookings/get-all-bookings) supports an archive/reconciliation list; it is not a target-booking import instruction.
- [Google Appointment Schedules](https://support.google.com/calendar/answer/10729749?hl=en) documents creation and account eligibility.
- [Google appointment booking pages](https://support.google.com/calendar/answer/10733297?hl=en) documents the public invitee surface.
- [Google Calendar event import](https://support.google.com/calendar/answer/37118?hl=en) documents a separate import mechanism with limits; do not treat it as a lossless Cal.com booking migration.

Google’s documented UI is the target path for schedule creation, so the pair contract deliberately marks schedule configuration as manual rather than pretending there is a stable generic API workflow.
