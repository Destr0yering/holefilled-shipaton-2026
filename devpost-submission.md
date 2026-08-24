# Title

HoleFilled

## One-line Summary

HoleFilled helps employers recover from an unexpected callout by finding a qualified internal coworker, resolving barriers such as transportation, and returning a confirmed shift assignment.

## Problem

A single last-minute absence can disrupt a warehouse line, hotel desk, restaurant service, healthcare unit, or event operation. Managers often respond with phone trees and group texts while trying to determine who is qualified, available, willing, and able to arrive. Existing scheduling software records the hole; it rarely carries the conversation through to a reliable human outcome.

## Solution

HoleFilled is an AI-assisted shift-recovery layer designed to connect to an employer's existing HR or scheduling system. When a schedule change creates an open shift, HoleFilled ranks qualified people from that employer's internal worker pool, starts bounded SMS outreach and optional voice outreach, learns why candidates decline, and applies employer-approved remedies. If transportation is the blocker, it can propose Got2Get2Work coordination or a rideshare credit. Incentives remain constrained by policy, with manager approval required above configured limits. Multiple workers can confirm availability; HoleFilled recommends the option with the fewest restraints, the employer makes the final selection, and one assignment is committed atomically while competing outreach closes.

The current hackathon build is a deterministic cross-platform proof of concept demonstrating this decision flow across five fictional employer scenarios: warehouse, hospitality, food service, healthcare, and public-sector education. It does not claim that production telephony or HR connectors are already live.

## Why This Matters

Hourly workers lose income when transportation or communication prevents them from accepting available work. Employers lose output and overload managers when shifts remain empty. HoleFilled is designed to address both sides: preserve qualified workers' access to hours and give operations teams a faster, auditable response to staffing gaps.

For the RevenueCat Peace Prize, the social-good case is practical rather than abstract: reduce avoidable lost wages, make transportation barriers visible, and expand fair access to open shifts inside an employer's existing workforce.

## How We Used AI

AI is used as a conversational and orchestration layer, not as the final authority for employment decisions. It can explain a shift, respond persuasively but professionally, classify a worker's stated barrier, and suggest an allowed next action. Deterministic application rules control qualification, contact consent, incentive ceilings, assignment eligibility, and the one-winner transaction. This separation is intentional: conversational flexibility where it helps people, hard policy boundaries where employment and money are involved.

The proof of concept simulates these conversations so judges can inspect the complete flow safely. Server-side voice/SMS and AI-classification adapter rails exist, but live carrier delivery and employer HR connections remain disabled until provider credentials, consent review, and controlled testing are complete.

## How We Used Codex

Codex helped convert the founder's workforce-logistics concept into a focused Shipaton scope, PRD, technical specification, implementation checklist, and clean Expo codebase. It implemented the responsive manager experience, deterministic workflow engine, RevenueCat adapter boundary, Supabase schema, tests, accessibility notes, and architecture documentation. Codex also ran Expo health checks, domain tests, TypeScript validation, a production web export, and a visual rendering check. A separate architecture review challenged the design around tenant isolation, outbox delivery, webhook idempotency, and atomic acceptance. OpenRouter's free router supplied an additional skeptical submission critique; only evidence-backed suggestions were retained.

## Key Features

- Critical open-shift command center with role, location, deadline, and severity.
- Eight ranked internal filler candidates per incident based on fictional qualification and availability data.
- Bounded near-simultaneous SMS and employer-optional voice outreach with deterministic response timing.
- Four to five confirmed fillers, transparent constraint scoring, a recommended fit, and manager override.
- Decline-reason and transportation-barrier capture.
- Employer-policy-controlled incentives and manager approval thresholds.
- Got2Get2Work or rideshare-credit transportation paths.
- Atomic manager-selected assignment with stale-version protection and automatic closure of competing offers.
- Professional “HoleFilled” confirmation with filler, assistance, transportation, and ETA.
- RevenueCat entitlement boundary for Pro access, purchase, and restore flows.
- Responsive, keyboard-aware, high-contrast interface designed toward WCAG 2.2 AA.

## Architecture

The application uses Expo 57, React Native, React Native Web, TypeScript, and React 19. Its domain workflow is implemented as pure deterministic transitions so matching and assignment behavior can be tested independently of the interface.

The production boundary is a modular monolith backed by tenant-scoped PostgreSQL/Supabase tables. The included schema covers organizations, memberships, workers, shifts, holes, candidate outreach, assignments, incentives, transportation, audit events, outbox events, provider-event idempotency, and normalized RevenueCat access grants. Realtime UI updates are projections; they are not treated as the durable job queue.

RevenueCat is isolated behind native and web adapters. Store entitlements normalize into internal access grants so consumer subscriptions and future enterprise contracts can share one authorization model.

### Live technical foundation (verified August 24, 2026)

- Supabase migrations for the tenant, workforce, billing, audit, and idempotency foundation are deployed to the HoleFilled project.
- Supabase Auth is wired into the client. A signed-in user is mapped to the same stable RevenueCat app-user identity used by the entitlement adapter.
- The deployed RevenueCat-to-Supabase webhook verifies the raw-body HMAC signature, rejects unsigned requests, deduplicates provider events, and mirrors access grants. A signed RevenueCat test event returned HTTP 200.
- These are infrastructure and integration foundations, not a claim that a live store purchase, real employer data connection, or production HR workflow has been completed.

## Testing Instructions

Prerequisites: a current Node.js installation and npm.

```bash
npm install
npm test
npm run typecheck
npm run web
```

In the application:

1. Choose a fictional sector scenario, or use the warehouse incident as the primary judging path, and review its eight qualified fillers.
2. Start outreach and observe simulated responses arriving across voice and SMS.
3. Compare four to five confirmed fillers by constraints, distance, and qualification match.
4. Keep the recommended fit or select another confirmed worker as the employer.
5. Confirm the selected filler and inspect the “HoleFilled” result and closed competing offers.
6. Open the Pro experience to inspect the RevenueCat purchase/restore boundary.

Verified on August 23, 2026: eight automated tests and TypeScript passed; the production web export and release gate completed; three mobile-width axe states reported zero serious or critical accessibility violations; the GitHub Actions application and Lighthouse jobs passed; and signed Android release and RevenueCat Test Store development APKs were produced through EAS.

## Public Demo Link

Project and policy site: https://destr0yering.github.io/holefilled-shipaton-2026/

Current RevenueCat Test Store development build: https://expo.dev/accounts/destr0yering/projects/holefilled-shipaton-2026/builds/05a58a82-26a9-4f92-a42d-adc9cfdb72a1

Current Auth-enabled internal Android preview APK: https://expo.dev/artifacts/eas/dnJu61LSB-rooabQYBc6tAwz8MQPZ35zKQn9R34Rq_E.apk

The Android preview is not a published store release. **TODO:** Add the qualifying Google Play, App Store, or Galaxy Store URL.

## Public Repository Link

https://github.com/Destr0yering/holefilled-shipaton-2026

The repository was scanned for likely committed secrets before publication. Development credentials remain outside the repository.

## Demo Video

**TODO:** Add a public YouTube or Vimeo URL. Keep the video at or below two minutes.

A 31.8-second, silent first cut has been rendered from the supplied app captures at `docs/video-assets/holefilled-submission-first-cut.mp4`. It needs narration or licensed audio, a final review, and public YouTube/Vimeo hosting before it can be used for the entry.

Proposed sequence:

- 0:00–0:12 — A critical warehouse shift becomes open.
- 0:12–0:30 — HoleFilled ranks eight qualified internal coworkers and starts one bounded outreach wave.
- 0:30–0:52 — Simulated voice/SMS responses produce multiple confirmations, declines, no-responses, and constraints.
- 0:52–1:13 — The manager compares confirmed fillers and sees Maya recommended by the fewest restraints.
- 1:13–1:30 — The employer selects Maya; the assignment commits and competing outreach closes.
- 1:30–1:48 — The manager sees “HoleFilled,” the ETA, assistance, and audit timeline.
- 1:48–2:00 — Show the RevenueCat-powered Pro boundary and close with: “A worker called out. HoleFilled got the shift covered.”

## Screenshot Shot List

1. Required 1179×2556 no-frame capture of the command center with eight outreach targets.
2. Manager shortlist showing multiple confirmed fillers and the recommended fit.
3. Concurrent conversations showing confirmation, decline, no-response, and barrier states.
4. “HoleFilled” confirmation with selected filler, ETA, and approved assistance.
5. RevenueCat Pro paywall and restore action.

Also create the required uncropped 1024×1024 application icon.

Exact-size no-frame draft captures generated from the verified web build:

- `docs/submission-assets/01-command-center-1179x2556.png`
- `docs/submission-assets/02-manager-shortlist-1179x2556.png`
- `docs/submission-assets/03-holefilled-success-1179x2556.png`
- `docs/submission-assets/04-revenuecat-paywall-1179x2556.png`

All four files were confirmed at exactly 1179×2556 on August 24, 2026. The app-configured icon at `assets/icon-holefilled-1024.png` was confirmed at 1024×1024. These are unapproved local draft assets only: they have not been uploaded to Devpost, and the form checkboxes must remain unmarked until you approve and upload them.

The manager-shortlist and success captures were visually inspected after generation. Capture at least one equivalent native Android screen before final entry delivery if practical.

## Submission Readiness Notes

The product story, local proof of concept, architecture, tests, and demo script are ready for iteration. The official Shipaton entry is not ready for final delivery until the application is publicly released and the required media and RevenueCat project evidence exist.

Verified live on August 24, 2026: the Devpost project page is published, but the Shipaton entry's `submitted_at` value is still empty. Do not represent the project as submitted.

Recommended award positioning:

1. RevenueCat Peace Prize — strongest fit because the product protects access to work and addresses transportation barriers.
2. RevenueCat Design Award — credible after mobile capture and interaction polish.
3. HAMM Award — pursue only after a real RevenueCat product, paywall, pricing, and testable purchase/free-trial path are configured.

## Known Limitations

- The current conversations, candidates, and provider outcomes are simulated with fictional data.
- No live HR, SMS, voice, Uber, Lyft, or Got2Get2Work service connector is active.
- RevenueCat project `6858b0db`, Test Store products, the `default` offering, and `holefilled_pro` entitlement are configured; a live Google Play product and judge free-trial or promo path remain required.
- No public App Store, Google Play, or Galaxy Store release URL exists yet.
- Production consent, labor-policy, privacy, security, accessibility, and legal review remain required.
- The Android development client loaded successfully through the Expo tunnel; required native purchase completion, exact-size screenshot capture, and store-distributed testing remain outstanding.

## TODO Official Form Fields

- **27378 — Includes App Icon (required):** Attach an uncropped 1024×1024 icon, then confirm.
- **27379 — Includes screenshot (required):** Attach a 1179×2556 screenshot without a device frame, then confirm.
- **27380 — First Version Date Confirmation:** Confirm only after the first store release occurs between August 1 and September 30, 2026.
- **27382 — App type (required):** Select `Android` for the initial published release; add another platform only if it is actually published before entry update.
- **27384 — Google Play URL:** Add the actual public production listing. Leave Apple and Galaxy fields blank unless those releases exist.
- **28118 — RevenueCat project ID (required):** `6858b0db`
- **28135 — Promo code:** Add a working code, or configure a free trial instead.
- **27388 — HAMM Award:** Use the monetization explanation below only after the live purchase path exists.
- **27389 — Peace Prize:** Use the social-good explanation from “Why This Matters,” updated with any real pilot evidence.
- **27391 — Design Award:** Describe the manager command center, professional language, barrier-resolution interaction, accessible hierarchy, and restrained success state after native polish.
- **27392 — Additional notes:** State clearly which integrations are demonstrated versus live.

### Live Devpost project record

Devpost project `1372490` was renamed to `HoleFilled` on August 23, 2026 and populated with the reviewed tagline, product description, technology list, repository URL, and project-site URL. Public project page: https://devpost.com/software/got2get2work-rlf8hz. The legacy URL slug remains unchanged, but the displayed product name is correct. The project page is published; the RevenueCat Shipaton entry still has no `submitted_at` timestamp and remains incomplete until its required media, public store URL, premium-access path, and form answers are supplied.

### Official deadline and deliverables checked August 23, 2026

- Submission closes September 30, 2026 at 11:45 PM Pacific (`2026-10-01T06:45:00Z`).
- A public YouTube or Vimeo demo of no more than two minutes is required.
- A public App Store, Google Play, or Samsung Galaxy Store URL is required for the standard track.
- A 1024×1024 app icon and at least one 1179×2556 no-frame screenshot are required.
- Judges need either a free trial or a promo code to unlock premium functionality.

### Draft HAMM response

HoleFilled uses a two-sided entitlement strategy: manager/fleet capabilities for organizations and optional Pro capabilities for individual workers. RevenueCat provides one entitlement boundary for native purchases while internal access grants leave room for enterprise contracts. The model was chosen so smaller teams can start with a self-serve purchase while larger employers can adopt governed, multi-seat access. Pricing, conversion, and revenue claims must remain blank until the live products are configured and measured.

### Draft Peace Prize response

HoleFilled is designed to reduce the human cost of an unexpected absence. It gives qualified internal workers a fair, timely opportunity to recover hours and makes barriers such as transportation actionable instead of treating a declined shift as the end of the conversation. Employers retain policy control, and deterministic qualification and assignment rules keep the AI conversational layer from making final employment decisions.

### Draft Design Award response

HoleFilled treats urgent staffing recovery as a calm, professional workflow. The interface uses a clear critical-incident hierarchy, concise candidate cards, explicit conversation states, restrained incentive controls, accessible color contrast, and a decisive “HoleFilled” completion state. The design keeps the name professional and operational: a manager can ask whether the hole was filled, check the screen, and immediately understand the answer.
