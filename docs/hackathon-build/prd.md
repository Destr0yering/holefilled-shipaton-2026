# Product Requirements Document

## Product Summary

HoleFilled is an employer-sponsored AI staffing response system. It converts an uncovered shift into a controlled outreach incident, contacts qualified employees by voice or SMS, negotiates within employer policy, resolves common barriers, and records a single confirmed assignment. AI facilitates communication; deterministic rules remain authoritative for eligibility, incentives, and assignment.

## Target User

- Workforce manager: needs fast, trustworthy coverage and oversight.
- Qualified filler: needs clear shift details, respectful negotiation, and a simple response path.
- Employer administrator: configures roles, pools, incentive limits, transportation options, and access.
- Integration partner: sends canonical workforce events and receives status updates.

## Core User Journey

The manager signs in, opens or receives a staffing hole, verifies details and outreach policy, and starts HoleFilled. The command center shows candidate qualification and live outreach status. Workers respond through a mobile-friendly conversation experience. HoleFilled asks why someone declines, offers allowed assistance, requests manager approval when required, and confirms the first valid acceptance. The manager receives a professional “HoleFilled” success state with assignment and arrival details.

## Epics And User Stories

### Epic 1: Create and understand a staffing hole

- As a manager, I want to see urgent holes sorted by severity so that I know what threatens operations first.
- As a manager, I want to create a hole from a guided form so that manual fallback works without an HR integration.
- As an integration, I want to submit an idempotent workforce event so that duplicate callouts do not create duplicate incidents.

Acceptance criteria:

- Dashboard shows open, contacting, approval-needed, filled, and unfilled states.
- A hole includes worksite, role, start/end, urgency, headcount, qualification requirements, and policy.
- Required fields have accessible labels and visible validation.
- Replaying the same external event does not create a second hole.

### Epic 2: Identify qualified fillers

- As a manager, I want HoleFilled to use only my employer's worker pool so that private rosters are isolated.
- As a worker, I want to be contacted only for shifts I am eligible and plausibly available to cover.
- As a manager, I want to understand why each candidate was included or excluded.

Acceptance criteria:

- Candidates are filtered by tenant membership, worksite, role, qualification, availability, conflicts, and contact consent.
- Every candidate card shows an explainable eligibility summary.
- No protected characteristic participates in ranking or negotiation.
- Cross-employer data never appears in the manager experience.

### Epic 3: Conduct concurrent AI outreach

- As a manager, I want several qualified fillers contacted concurrently so that urgent coverage is not delayed by sequential calling.
- As a filler, I want a persuasive but friendly conversation that states who is calling, why, what is offered, and how to opt out.
- As a manager, I want to observe channel and response state without listening to private calls.

Acceptance criteria:

- A bounded outreach wave can contain multiple candidates.
- Each simulated conversation supports accept, decline, ask-a-question, transportation-barrier, and incentive-request paths.
- The interface clearly labels simulated/demo communications.
- Candidates can decline or stop outreach without penalty language.
- Timeline updates appear after committed state changes.

### Epic 4: Resolve barriers within policy

- As a filler, I want to explain why I cannot cover so that the system can offer a relevant solution.
- As an employer, I want autonomous incentives capped by policy so that the agent cannot overspend.
- As a manager, I want to approve or reject exceptions quickly.

Acceptance criteria:

- Decline reasons include transportation, compensation, timing, qualification, personal, and no-reason.
- Transportation can surface Got2Get2Work availability, employer ride credit, or manager follow-up.
- Incentives at or below the configured autonomous limit may be offered automatically.
- Anything above the threshold creates an approval request and cannot be promised before approval.
- Every offer records amount, type, policy source, approver if any, and expiration.

### Epic 5: Commit one assignment safely

- As a filler, I want immediate confirmation when I successfully accept.
- As a manager, I want exactly one active filler for a one-person hole.
- As another candidate, I want a courteous notice if the hole was filled before I accepted.

Acceptance criteria:

- Concurrent acceptance attempts result in one winner.
- Repeated acceptance with the same idempotency key returns the same outcome.
- Losing attempts receive a stable “already filled” result rather than an error.
- Assignment records the worker, accepted offer, incentive, transportation status, and ETA.
- Competing conversations transition to closed.

### Epic 6: Confirm and celebrate the result

- As a manager, I want a concise “HoleFilled” screen so that coverage is unmistakable.
- As an operator, I want an audit timeline so that I can explain what happened.

Acceptance criteria:

- Success state prominently says “HoleFilled” without jokes or innuendo.
- It shows filler name, role, shift, incentive, transportation plan, and ETA using fictional demo data.
- Timeline distinguishes AI suggestions, deterministic decisions, human approvals, and worker actions.
- Motion respects reduced-motion preferences.

### Epic 7: Monetization and access

- As a buyer, I want to understand premium automation value before purchasing.
- As a subscribed user, I want access restored across devices.
- As a judge, I need free-trial or promotional access to all premium demo features.

Acceptance criteria:

- RevenueCat is configured through a platform adapter using a stable internal user ID.
- A paywall explains the HoleFilled Pro/Employer value and supports restore purchases.
- Demo mode works without real store credentials while clearly indicating that state.
- Client entitlement data alone never grants access to another employer's records.

### Epic 8: Accessibility, privacy, and failure recovery

- As a keyboard, screen-reader, low-vision, or reduced-motion user, I want the core workflow to remain operable.
- As an employer, I want sensitive roster and location data minimized and auditable.
- As a demo operator, I want graceful recovery when an external service is unavailable.

Acceptance criteria:

- Core controls are keyboard accessible on web and expose accessible names/roles on mobile.
- Color is never the sole status indicator; contrast targets WCAG 2.2 AA.
- Focus order, validation summaries, touch targets, text scaling, and reduced motion are tested.
- Exact home locations are not shown to employers.
- Failed AI, notification, or mobility integrations surface stable fallback states without corrupting the assignment.

## Edge Cases

- No qualified fillers: show why and allow manager escalation without fabricating candidates.
- All candidates decline: preserve reasons and mark the incident unfilled or expand a policy-approved wave.
- Two workers accept simultaneously: one transaction wins; the other is thanked and released.
- Worker requests an unapproved amount: pause the promise and request manager approval.
- Transportation unavailable: offer only configured alternatives; never guarantee a ride.
- Shift changes during outreach: invalidate stale offers and explain the update.
- Lost connectivity: refetch authoritative state after reconnect.
- RevenueCat unavailable: retain existing cached entitlement briefly but block new purchase claims until verified.
- AI generates an unsafe or unauthorized offer: server policy rejects it and uses a deterministic template.

## What We Are Building

One complete warehouse demo incident, responsive manager and filler views, deterministic matching, simulated conversations, policy-controlled negotiation, atomic assignment, RevenueCat boundary/paywall, audit timeline, accessibility foundation, and vendor-neutral integration contracts.

## What We Would Add With More Time

- Production Twilio/OneSignal voice/SMS delivery and consent workflows.
- Certified UKG, Workday, HotSchedules, and healthcare scheduling adapters.
- Multilingual employer-selectable voices.
- Real Got2Get2Work, Uber, and Lyft commercial integrations.
- Advanced forecast/predictive holes and staffing analytics.
- Multi-headcount holes and sequential arrival tracking.
- Employer invoicing, seat provisioning, and RevenueCat web funnel experiments.

## Submission Proof Points

- One visually clear end-to-end incident completed on device.
- RevenueCat paywall and entitlement-aware workflow.
- AI conversation that identifies a real barrier and changes the outcome.
- Atomic concurrency behavior explained and tested.
- Accessibility evidence and reduced-motion demonstration.
- Transparent labeling of fictional data, simulated calls, and future vendor integrations.

