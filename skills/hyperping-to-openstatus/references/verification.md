# Verification and rollback checklist

## Inventory

- [ ] Source and destination monitor counts match after approved exclusions.
- [ ] Every source ID has exactly one destination ID or a documented exception.
- [ ] No duplicate destination monitors were created by retries.

## Configuration

- [ ] Each created or updated monitor was fetched after write.
- [ ] URL, method, headers, body, assertions, timeout, retry, redirects, cadence, regions, active state, and public state match the approved plan.
- [ ] Assertions were checked against a real response, including whitespace-sensitive body values.

## Status and public views

- [ ] Every required status-page component points to the intended destination monitor ID.
- [ ] The public status page renders expected groups and services.
- [ ] Every intended public latency monitor appears on /monitors.
- [ ] Each intended latency monitor has a live response-time detail view after enough intervals.
- [ ] A clean synthetic request and any relevant authenticated request agree with the expected status.

## Cutover

- [ ] Source is still available for the agreed soak period.
- [ ] Replacement links, alert destinations, and documentation have been tested.
- [ ] Rollback is documented as disable/detach/repoint, not destructive deletion.
- [ ] The user explicitly approved any permanent source cleanup.
