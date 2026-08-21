# Build Checklist

## Build Preferences

- **Build mode:** Autonomous
- **Comprehension checks:** N/A
- **Git:** Initialize clean repository; commit only at coherent verified milestones when authorized by environment
- **Verification:** Automated; no participant look-at-it pauses until MVP handoff
- **Check-in cadence:** Speed-run with concise progress updates
- **Wow moment:** Three simultaneous filler conversations resolve into one transportation-assisted acceptance and the manager screen changes to “HoleFilled.”

## Checklist

- [x] **1. Scaffold universal Expo application**
  Spec ref: `spec.md > Stack` and `File Structure`
  What to build: Create the TypeScript Expo Router application, scripts, lint/type tooling, design tokens, and baseline accessible shell.
  Acceptance: App launches for web and is structurally buildable for Android/iOS.
  Verify: `npm run typecheck` and `npx expo export --platform web`.

- [x] **2. Implement canonical domain and demo repository**
  Spec ref: `spec.md > Modular domain`
  What to build: Typed models, fictional warehouse fixtures, repository interface, matching rules, negotiation policy, and assignment transitions.
  Acceptance: Eligibility and incentive decisions are explainable and deterministic.
  Verify: Unit tests for matching, thresholds, stale offers, and one-winner acceptance.

- [x] **3. Build manager command center**
  Spec ref: `spec.md > Manager Command Center`
  What to build: Responsive severity queue, incident summary, candidates, outreach timeline, approval state, and empty/error states.
  Acceptance: Manager can understand and start the fictional incident using keyboard or touch.
  Verify: Web export plus component/domain tests and manual semantic review.

- [x] **4. Build concurrent outreach and filler experience**
  Spec ref: `spec.md > Filler Conversation`
  What to build: Simulated concurrent conversations and worker response screen supporting accept, decline, transportation, and incentive paths.
  Acceptance: Three candidates can be contacted in one bounded wave and show independent state.
  Verify: Execute demo state-machine tests and web flow.

- [x] **5. Implement barrier resolution and atomic success flow**
  Spec ref: `spec.md > Assignment transaction`
  What to build: Transportation/Got2Get2Work adapter, ride-credit offer, manager threshold approval, idempotent assignment, competitor closure, and “HoleFilled” success state.
  Acceptance: The demo resolves a transport barrier and commits exactly one filler.
  Verify: Concurrent acceptance and policy tests; run the golden demo path.

- [x] **6. Embed RevenueCat in access flow**
  Spec ref: `spec.md > RevenueCat adapter`
  What to build: Native-safe adapter, demo/web fallback, paywall route, restore action, stable app-user identity boundary, and entitlement-aware feature gate.
  Acceptance: Missing credentials do not crash demo; native configuration has an explicit production path.
  Verify: Typecheck, adapter tests, and paywall rendering in web demo mode.

- [x] **7. Add Supabase production foundation**
  Spec ref: `spec.md > Production command boundary`
  What to build: SQL migrations for tenancy/workforce/offers/assignments/outbox/billing, RLS policies, webhook function stubs, and environment contract.
  Acceptance: Schema represents tenant-safe, idempotent production behavior without requiring credentials for local demo.
  Verify: Migration/static review and contract tests where local Supabase is unavailable.

- [x] **8. Accessibility, privacy, observability, and analytics**
  Spec ref: `spec.md > Accessibility system` and `Risks And Verification`
  What to build: Labels/roles, contrast-safe tokens, reduced motion, privacy copy, error boundary, Sentry/PostHog adapter boundaries, and redacted events.
  Acceptance: Core flow remains understandable without color and supports keyboard/text scaling.
  Verify: Typecheck, accessibility-focused tests, and documented manual checklist.

- [x] **9. Production and submission documentation**
  Spec ref: `spec.md > Demo And Submission Flow`
  What to build: README, architecture ADRs, environment example, deployment/release plan, demo script, store checklist, and truthful integration disclosures.
  Acceptance: A new developer or judge can run the demo without secrets and understand simulated versus production components.
  Verify: Follow README from a clean install and review all claims.

- [x] **10. Prepare Devpost handoff**
  Spec ref: `prd.md > Submission Proof Points`
  What to build: Gather project story, screenshot plan, repository link placeholder, demo instructions, build evidence, and remaining external-account actions.
  Acceptance: The participant has enough material to run `$prepare-submission` when the product is genuinely ready.
  Verify: Final build/test/export passes and handoff gaps are explicit.
