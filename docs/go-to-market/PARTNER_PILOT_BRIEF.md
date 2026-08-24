# HoleFilled Partner Pilot Brief

## Positioning

**HoleFilled is the shift-recovery layer for workforce systems.** A scheduling system detects the uncovered shift; HoleFilled helps an authorized manager get it covered through governed, explainable outreach to the employer's own eligible workforce.

It is not a labor marketplace, payroll system, or autonomous employment-decision engine. Qualification, consent, spend limits, manager approval, and final assignment remain deterministic employer-controlled decisions.

## 30-second pitch

When someone calls out, most workforce systems record the gap and leave a manager to start calling people. HoleFilled takes over the recovery work: it identifies eligible internal workers, runs a bounded outreach wave, learns whether transport or timing is the blocker, applies only policy-approved options, and returns one manager-approved assignment with an audit trail. We integrate into the scheduling and HR systems employers already use rather than asking them to replace them.

## First customer: a paid design partner

Start with one employer site where unplanned coverage failures are expensive and operationally visible: distribution, hospitality, food service, healthcare support, facilities, or events.

Offer a 6–8 week paid pilot with a tightly bounded use case:

1. One location and one or two roles.
2. Manager-created holes or a read-only schedule export at first; no production write-back until validated.
3. Existing internal workers only, with employer-managed eligibility and outreach consent.
4. Human approval for every assignment and every exception above policy.
5. A weekly review of results, failures, worker feedback, and compliance questions.

## Pilot success metrics

- Median time from open shift to confirmed assignment.
- Fill rate for eligible urgent shifts.
- Manager minutes spent per incident.
- Percentage of declines with an actionable barrier.
- Transportation-barrier resolution rate.
- Worker opt-out, complaint, and assignment-cancellation rates.
- Policy exceptions requested and approved.

Do not promise labor savings or fill-rate improvements before the pilot produces evidence.

## Integration story for workforce platforms

HoleFilled needs four narrow contracts:

1. **Shift event in** — a callout/open-shift event, role, worksite, start time, urgency, and external idempotency key.
2. **Eligibility read** — employer-approved worker, qualification, availability, conflict, and communication-consent data.
3. **Governed outreach** — employer-configured templates, channels, quiet hours, incentive ceilings, and escalation rules.
4. **Assignment event out** — accepted worker, manager approval, ETA/assistance status, and an immutable audit reference.

The first integration should be a secure CSV/SFTP or API export plus manager confirmation. Production HRIS/WFM connectors should follow only after security review, a data-processing agreement, and vendor partner requirements.

## Commercial model

- **Individual Manager Pro:** self-serve subscription only for personal workflow tools; RevenueCat entitlement grants the app-level capability.
- **Employer pilot / organization license:** contracted per site, manager seat, or managed urgent shift. Organization access is provisioned server-side after a contract or invoice; it is not a consumer in-app purchase.
- **Enterprise platform partnership:** per-customer referral, revenue-share, or embedded/OEM agreement after a validated pilot.

RevenueCat is the subscription and entitlement layer. Supabase is the application backend for tenancy, access grants, audit records, and integration state. The customer does not need to host HoleFilled in its own backend for a normal SaaS deployment; an enterprise could later request single-tenant or private deployment as a separate commercial/security decision.

## Buyer conversations to start

- Operations leader: What does one uncovered critical shift cost in delayed work, overtime, or manager time?
- Workforce-management owner: Which shift events and worker fields can be shared safely, and what system is authoritative?
- HR/legal/privacy: What consent, union, notice, wage-and-hour, and transportation policies constrain outreach and incentives?
- Frontline managers and workers: What would make the outreach respectful, useful, and easy to opt out of?

## What to show in a partner demo

1. The warehouse callout and ranked internal candidates.
2. Multiple simulated responses including a transportation barrier.
3. The policy boundary and manager approval.
4. One atomic assignment and the audit timeline.
5. The integration contract and the clear line between current demo functionality and future live connectors.

## Current proof and boundaries

The Shipaton build has a working cross-platform demo, deterministic workflow tests, a RevenueCat entitlement boundary, deployed Supabase foundations, Supabase Auth identity wiring, and a tested signed RevenueCat webhook. It does not yet have a public store listing, live employer HRIS/WFM integration, carrier messaging, or production transport provider integration. Treat it as pilot-ready technical groundwork, not as a production deployment claim.
