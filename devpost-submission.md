# Title

HoleFilled

## One-line Summary

HoleFilled helps employers recover from an unexpected callout by finding a qualified internal coworker, resolving barriers such as transportation, and returning a confirmed shift assignment.

## Problem

A single last-minute absence can disrupt a warehouse line, hotel desk, restaurant service, healthcare unit, or event operation. Managers often respond with phone trees and group texts while trying to determine who is qualified, available, willing, and able to arrive. Existing scheduling software records the hole; it rarely carries the conversation through to a reliable human outcome.

## Solution

HoleFilled is an AI-assisted shift-recovery layer designed to connect to an employer's existing HR or scheduling system. When a schedule change creates an open shift, HoleFilled ranks qualified people from that employer's internal worker pool, starts bounded SMS outreach and optional voice outreach, learns why candidates decline, and applies employer-approved remedies. If transportation is the blocker, it can propose Got2Get2Work coordination or a rideshare credit. Incentives remain constrained by policy, with manager approval required above configured limits. The first eligible acceptance wins atomically and competing outreach is closed.

The current hackathon build is a deterministic cross-platform proof of concept demonstrating this complete decision flow with fictional warehouse data. It does not claim that production telephony or HR connectors are already live.

## Why This Matters

Hourly workers lose income when transportation or communication prevents them from accepting available work. Employers lose output and overload managers when shifts remain empty. HoleFilled is designed to address both sides: preserve qualified workers' access to hours and give operations teams a faster, auditable response to staffing gaps.

For the RevenueCat Peace Prize, the social-good case is practical rather than abstract: reduce avoidable lost wages, make transportation barriers visible, and expand fair access to open shifts inside an employer's existing workforce.

## How We Used AI

AI is used as a conversational and orchestration layer, not as the final authority for employment decisions. It can explain a shift, respond persuasively but professionally, classify a worker's stated barrier, and suggest an allowed next action. Deterministic application rules control qualification, contact consent, incentive ceilings, assignment eligibility, and the one-winner transaction. This separation is intentional: conversational flexibility where it helps people, hard policy boundaries where employment and money are involved.

The proof of concept simulates these conversations so judges can inspect the complete flow safely. Production voice/SMS models and provider integrations remain future integration work.

## How We Used Codex

Codex helped convert the founder's workforce-logistics concept into a focused Shipaton scope, PRD, technical specification, implementation checklist, and clean Expo codebase. It implemented the responsive manager experience, deterministic workflow engine, RevenueCat adapter boundary, Supabase schema, tests, accessibility notes, and architecture documentation. Codex also ran Expo health checks, domain tests, TypeScript validation, a production web export, and a visual rendering check. A separate architecture review challenged the design around tenant isolation, outbox delivery, webhook idempotency, and atomic acceptance. OpenRouter's free router supplied an additional skeptical submission critique; only evidence-backed suggestions were retained.

## Key Features

- Critical open-shift command center with role, location, deadline, and severity.
- Ranked internal filler candidates based on fictional qualification and availability data.
- Bounded concurrent SMS and employer-optional voice outreach simulation.
- Decline-reason and transportation-barrier capture.
- Employer-policy-controlled incentives and manager approval thresholds.
- Got2Get2Work or rideshare-credit transportation paths.
- Atomic first-eligible-acceptance-wins workflow with stale-version protection.
- Professional “HoleFilled” confirmation with filler, assistance, transportation, and ETA.
- RevenueCat entitlement boundary for Pro access, purchase, and restore flows.
- Responsive, keyboard-aware, high-contrast interface designed toward WCAG 2.2 AA.

## Architecture

The application uses Expo 57, React Native, React Native Web, TypeScript, and React 19. Its domain workflow is implemented as pure deterministic transitions so matching and assignment behavior can be tested independently of the interface.

The production boundary is a modular monolith backed by tenant-scoped PostgreSQL/Supabase tables. The included schema covers organizations, memberships, workers, shifts, holes, candidate outreach, assignments, incentives, transportation, audit events, outbox events, provider-event idempotency, and normalized RevenueCat access grants. Realtime UI updates are projections; they are not treated as the durable job queue.

RevenueCat is isolated behind native and web adapters. Store entitlements normalize into internal access grants so consumer subscriptions and future enterprise contracts can share one authorization model.

## Testing Instructions

Prerequisites: a current Node.js installation and npm.

```bash
npm install
npm test
npm run typecheck
npm run web
```

In the application:

1. Review the critical warehouse incident and the three qualified fictional fillers.
2. Start outreach and observe concurrent candidate states.
3. Continue until Maya's transportation barrier is identified.
4. Apply the policy-approved transportation/incentive response.
5. Confirm the first eligible acceptance and inspect the “HoleFilled” result.
6. Open the Pro experience to inspect the RevenueCat purchase/restore boundary.

Verified on August 21, 2026: Expo Doctor 21/21 checks, four domain tests passed, TypeScript passed, and the production web export completed.

## Public Demo Link

**TODO:** Add the deployed demonstration URL. A web export exists locally, but the official entry requires a published iOS, Android, or Galaxy Store application.

## Public Repository Link

**TODO:** Add the public GitHub repository URL after a secret scan and initial commit.

## Demo Video

**TODO:** Add a public YouTube or Vimeo URL. Keep the video at or below two minutes.

Proposed sequence:

- 0:00–0:12 — A critical warehouse shift becomes open.
- 0:12–0:30 — HoleFilled ranks three qualified internal coworkers and starts bounded outreach.
- 0:30–0:52 — Two people decline; Maya identifies transportation as her barrier.
- 0:52–1:15 — HoleFilled offers Got2Get2Work pickup and a policy-approved ride credit.
- 1:15–1:32 — Maya accepts and the atomic assignment closes other outreach.
- 1:32–1:48 — The manager sees “HoleFilled,” the ETA, assistance, and audit timeline.
- 1:48–2:00 — Show the RevenueCat-powered Pro boundary and close with: “A worker called out. HoleFilled got the shift covered.”

## Screenshot Shot List

1. Required 1179×2556 no-frame capture of the critical incident and ranked fillers.
2. Concurrent outreach with the transportation barrier visible.
3. “HoleFilled” confirmation with filler, ETA, and approved assistance.
4. RevenueCat Pro paywall and restore action.
5. Optional audit timeline demonstrating accountable decisions.

Also create the required uncropped 1024×1024 application icon.

## Submission Readiness Notes

The product story, local proof of concept, architecture, tests, and demo script are ready for iteration. The official Shipaton entry is not ready for final delivery until the application is publicly released and the required media and RevenueCat project evidence exist.

Recommended award positioning:

1. RevenueCat Peace Prize — strongest fit because the product protects access to work and addresses transportation barriers.
2. RevenueCat Design Award — credible after mobile capture and interaction polish.
3. HAMM Award — pursue only after a real RevenueCat product, paywall, pricing, and testable purchase/free-trial path are configured.

## Known Limitations

- The current conversations, candidates, and provider outcomes are simulated with fictional data.
- No live HR, SMS, voice, Uber, Lyft, or Got2Get2Work service connector is active.
- The RevenueCat SDK boundary exists, but the real RevenueCat project, store products, entitlement, and free trial or promo path are not configured.
- No public App Store, Google Play, or Galaxy Store release URL exists yet.
- Production consent, labor-policy, privacy, security, accessibility, and legal review remain required.
- The web dashboard is visually verified; required native-device capture and store testing remain outstanding.

## TODO Official Form Fields

- **27378 — Includes App Icon (required):** Attach an uncropped 1024×1024 icon, then confirm.
- **27379 — Includes screenshot (required):** Attach a 1179×2556 screenshot without a device frame, then confirm.
- **27380 — First Version Date Confirmation:** Confirm only after the first store release occurs between August 1 and September 30, 2026.
- **27382 — App type (required):** Planned selections: iOS and Android; confirm against actual published builds.
- **27383 / 27384 / 28117 — Store URLs:** Add the actual published store URL(s).
- **28118 — RevenueCat project ID (required):** Add from RevenueCat Project Settings.
- **28135 — Promo code:** Add a working code, or configure a free trial instead.
- **27388 — HAMM Award:** Use the monetization explanation below only after the live purchase path exists.
- **27389 — Peace Prize:** Use the social-good explanation from “Why This Matters,” updated with any real pilot evidence.
- **27391 — Design Award:** Describe the manager command center, professional language, barrier-resolution interaction, accessible hierarchy, and restrained success state after native polish.
- **27392 — Additional notes:** State clearly which integrations are demonstrated versus live.

### Draft HAMM response

HoleFilled uses a two-sided entitlement strategy: manager/fleet capabilities for organizations and optional Pro capabilities for individual workers. RevenueCat provides one entitlement boundary for native purchases while internal access grants leave room for enterprise contracts. The model was chosen so smaller teams can start with a self-serve purchase while larger employers can adopt governed, multi-seat access. Pricing, conversion, and revenue claims must remain blank until the live products are configured and measured.

### Draft Peace Prize response

HoleFilled is designed to reduce the human cost of an unexpected absence. It gives qualified internal workers a fair, timely opportunity to recover hours and makes barriers such as transportation actionable instead of treating a declined shift as the end of the conversation. Employers retain policy control, and deterministic qualification and assignment rules keep the AI conversational layer from making final employment decisions.

### Draft Design Award response

HoleFilled treats urgent staffing recovery as a calm, professional workflow. The interface uses a clear critical-incident hierarchy, concise candidate cards, explicit conversation states, restrained incentive controls, accessible color contrast, and a decisive “HoleFilled” completion state. The design keeps the name professional and operational: a manager can ask whether the hole was filled, check the screen, and immediately understand the answer.
