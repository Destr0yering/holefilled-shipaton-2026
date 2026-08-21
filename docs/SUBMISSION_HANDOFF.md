# Shipaton Submission Handoff

## One-line story

Scheduling software identifies an empty shift; HoleFilled talks to the qualified people who can cover it, learns what is stopping them, applies employer-approved solutions, and returns a confirmed human outcome.

## Two-minute demo outline

- 0:00–0:12 — Critical warehouse hole appears; show role, deadline, and three qualified fillers.
- 0:12–0:28 — Start bounded concurrent outreach; explain voice/SMS simulations and deterministic eligibility.
- 0:28–0:50 — Show two declines and Maya's transportation barrier.
- 0:50–1:12 — Offer Got2Get2Work pickup plus policy-approved $20 ride credit.
- 1:12–1:27 — Maya accepts; explain atomic one-winner assignment and competitor closure.
- 1:27–1:42 — Manager sees the professional “HoleFilled” result and ETA.
- 1:42–1:55 — Open RevenueCat-powered Pro screen, purchase/restore boundary, and audit timeline.
- 1:55–2:00 — Close: “A worker called out. HoleFilled got the shift covered.”

## Screenshot plan

1. Manager command center with critical incident and three qualified fillers.
2. Concurrent conversation cards with transportation and incentive barriers.
3. “HoleFilled” success state with filler, assistance, transportation, and ETA.
4. RevenueCat Pro paywall.

Required store/Devpost export: at least one 1179×2556 screenshot without a device frame and one 1024×1024 app icon.

## Verified evidence

- TypeScript typecheck passes.
- Four deterministic domain tests pass.
- Expo production web export succeeds.
- Initial manager dashboard visually inspected at 1440×1200.
- RevenueCat native adapter and web/demo adapter compile behind a platform boundary.
- Tenant-safe Supabase schema/RLS foundation exists.

## External setup still required

- Create RevenueCat project/app, entitlement `holefilled_pro`, product, offering, and test purchase.
- Configure Google Play and/or Galaxy Store application and real store API key.
- Create Supabase project and apply migration after security review.
- Connect selected production voice/SMS provider and complete consent/legal review.
- Configure Sentry, PostHog, OneSignal, Stripe Funnel, domains, and signed webhooks.
- Produce final icon/screenshots, record public YouTube/Vimeo video, execute accessibility device testing, and publish the app.

## Truth constraints

Never present demo data as customer traction. Never claim certified UKG, Got2Get2Work, Uber, or Lyft integration. Never claim ADA certification without an independent audit. Describe AI as a communication facilitator constrained by deterministic eligibility, spending, and assignment policy.

