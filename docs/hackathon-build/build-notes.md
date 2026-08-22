# Build Notes

## 2026-08-21 — Guided build onboarding

- Confirmed HoleFilled and Got2Get2Work are separate applications and platforms.
- Confirmed HoleFilled is the RevenueCat Shipaton 2026 submission.
- Confirmed initial worker pools come from each employer's internal HR/scheduling integration.
- Confirmed trigger events include callouts, schedule changes, terminations, and other uncovered-shift events.
- Confirmed concurrent AI voice/SMS outreach and negotiation are central to the product.
- Confirmed decline-reason handling can identify transportation and incentive barriers.
- Confirmed employer-configured incentive thresholds, with manager approval above policy limits.
- Confirmed clean SaaS visual direction and accessibility-first mobile/web delivery.
- Active shaping moment: participant insisted “HoleFilled” be treated professionally, without innuendo, as a normal office term and visible success state.
- Architecture review: begin as a modular monolith with tenant-isolated Postgres data, deterministic eligibility, durable outbox events, and atomic shift acceptance.
- Onboarding interview completed with one sharpening round and one optional inspiration round.

## 2026-08-21 — Autonomous planning pass

- Participant explicitly handed off the remaining build and requested no approval pauses.
- Scope time budget set to approximately six weeks, with an immediate focused proof of concept.
- Scope cut to one warehouse incident and one complete negotiation/transport/acceptance loop.
- PRD expanded into eight epics with testable acceptance criteria and edge cases.
- Technical direction selected: universal Expo TypeScript application, modular domain, Supabase production boundary, RevenueCat adapter, deterministic demo repository.
- Checklist locked to autonomous mode with automated verification and no participant look-at-it pauses.
- Deepening rounds: scope 0, PRD 0, spec 0, checklist 0; existing conversation supplied sufficient context and participant authorized conservative assumptions.

## 2026-08-21 — Autonomous proof-of-concept build

- Scaffolded a new Expo 57 / React Native 0.86 TypeScript application; no prior app source was copied.
- Implemented responsive manager dashboard, concurrent outreach cards, transportation/incentive barriers, audit timeline, and “HoleFilled” success state.
- Added deterministic matching, incentive policy, stale-version handling, and one-winner acceptance with four passing tests.
- Added RevenueCat native and web/demo platform adapters and an entitlement-aware Pro experience.
- Added tenant-consistent Supabase schema, RLS foundation, audit/outbox/provider-event/access-grant tables.
- Added accessibility verification, architecture ADR, environment contract, README, and submission handoff.
- Verified typecheck, tests, production web export, and initial dashboard rendering.
- Browser plugin bootstrap was unavailable in this environment, so visual verification used installed Chrome headless against the local production export.
- Nano OpenRouter remained unavailable because the SSH noninteractive environment did not receive `OPENROUTER_API_KEY`; no paid fallback was used.

## 2026-08-21 — Multi-sector demonstration expansion

- Added five selectable fictional incidents: forklift operator, banquet server, line cook, registered nurse, and crossing guard.
- Each scenario has sector-specific qualifications, escalation timing, incentive limits, transportation options, concurrent worker responses, and a deterministic winning assignment.
- Added a public-evidence brief based on UKG customer stories across healthcare, manufacturing/distribution, hospitality/food service, and public-sector education.
- Preserved strict claim boundaries: the demo is not certified by UKG, named UKG customers are not represented in product fixtures, and all organizations and outcomes are fictional.
- Kept Got2Get2School outside scope; the crossing-guard scenario is employer workforce coverage, with school-board authorization and background-check responsibility.
- Built the multi-sector source as an internal Android APK with the RevenueCat preview environment, archived it to USB, recorded its SHA-256, and verified its APK v2 signature and package structure.
- No Android device or emulator was attached, so native install and physical interaction testing remain explicit follow-up checks.

## 2026-08-21 — Concurrent SMS and voice foundation

- Implemented a bounded outreach coordinator that starts independent SMS and voice dispatches in the same event-loop turn.
- Added isolation tests proving one provider failure does not cancel the remaining negotiations and invalid waves contact nobody.
- Added Supabase communication-wave/session schema with tenant RLS, provider idempotency, encrypted-destination contract, and validated-classification storage.
- Added server-only Twilio messaging and outbound-call adapters, voice speech/DTMF gathering, lifecycle callbacks, and HMAC webhook validation.
- Added OpenRouter `stealth/ox-alpha` classification with output allowlisting, length limits, deterministic fallback, and no retention of model reasoning.
- Added deterministic acceptance, decline, transportation, incentive, and opt-out replies so AI cannot promise a shift or unauthorized benefit.
- Live carrier delivery remains disabled until Twilio credentials, verified senders, durable inbound routing, compliance review, and controlled-number testing are complete.

## 2026-08-21 — Command-center interface polish

- Reworked the dashboard into a denser workforce-operations command center with a stronger HoleFilled brand mark and live system-readiness signal.
- Upgraded the five-sector selector with visual sector marks, clearer selected state, and portfolio context.
- Added operational hero signals for qualified fillers, communication channels, and the atomic-winner guarantee.
- Added a coverage-risk meter, richer incident summary, qualification/policy hierarchy, and clearer near-simultaneous outreach call to action.
- Polished candidate, timeline, paywall, and completion surfaces while preserving accessible roles, labels, status text, touch targets, and color-independent wording.
- Visually verified the dashboard and live incident in the browser and verified the RevenueCat paywall through its accessible DOM.
