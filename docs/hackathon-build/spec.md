# Technical Spec

## Overview

Build HoleFilled as a TypeScript modular monolith with a universal Expo client and a Supabase/Postgres source of truth. The proof of concept runs fully in demo mode with deterministic fixtures, while production adapters isolate Supabase, RevenueCat, AI, communications, HR events, and mobility providers.

## Stack

- Expo Router + React Native + TypeScript for Android, iOS, and responsive web.
- React Native Web for the manager command center; shared accessible components and design tokens.
- Supabase Auth/Postgres/Realtime/Edge Functions for production persistence and commands.
- In-memory demo repository for zero-credential local judging and deterministic tests.
- RevenueCat `react-native-purchases` behind a platform-safe entitlement adapter.
- Zod for runtime contracts, Vitest for domain tests, Expo tooling for type/build validation.
- Future adapters: OneSignal/Twilio communications, PostHog analytics, Sentry observability, Stripe/RevenueCat web funnel, Got2Get2Work mobility.

## Architecture

### Client shell

Expo Router exposes role-aware manager, worker, and paywall routes. A repository/provider layer selects demo or production mode. UI never writes authoritative assignment state directly.

### Modular domain

- Identity and tenancy: profiles, organizations, memberships, roles.
- Workforce: worksites, qualifications, worker availability, holes, candidates, offers, assignments.
- Outreach: bounded waves, conversation state, decline reasons, negotiation proposals.
- Policy: deterministic eligibility and incentive authorization.
- Mobility: transportation requests and adapter outcomes.
- Billing/access: RevenueCat mirror and normalized access grants.
- Audit: immutable timeline and event envelope.

### Production command boundary

Privileged commands execute as Postgres RPCs/Edge Functions with tenant context, idempotency keys, and row-level security. Realtime broadcasts committed projections only; it is not used as a queue.

### Concurrency

Candidate generation tags results with `hole_version` and `policy_version`. Acceptance locks or conditionally updates the hole, revalidates eligibility and expiry, inserts one active assignment, closes competing offers, increments the version, and writes outbox/audit events in one transaction.

## File Structure

```text
app/
  _layout.tsx                 navigation, providers, accessibility defaults
  index.tsx                   role-aware landing/command center
  hole/[id].tsx               live HoleFilled incident
  worker/[offerId].tsx        filler conversation and acceptance
  paywall.tsx                 RevenueCat-aware upgrade/restore
src/
  components/                 accessible shared UI
  design/                     tokens and status semantics
  domain/
    models.ts                 canonical types
    matching.ts               deterministic candidate filter/rank
    negotiation.ts            policy-controlled barrier resolution
    assignment.ts             pure acceptance transition
  data/
    demoRepository.ts         deterministic proof-of-concept state
    supabaseRepository.ts     production repository boundary
  services/
    aiAgent.ts                structured AI suggestion interface/fallback
    communications.ts         simulated and future voice/SMS adapters
    mobility.ts               Got2Get2Work/ride-credit interface
    revenuecat.ts             native/web/demo entitlement adapter
  state/HoleFilledProvider.tsx incident commands and projections
  test/                       domain and concurrency tests
supabase/
  migrations/                 tenant, workforce, outbox, billing schema/RLS
  functions/                  HR webhook, outreach worker, RevenueCat webhook
docs/
  architecture/               ADRs, contracts, security/accessibility notes
  hackathon-build/            scope, PRD, spec, checklist, journal
```

## Data Flow

1. HR webhook/manual form creates a canonical `HoleCreated` command with external idempotency key.
2. Transaction stores the hole and an outbox event.
3. Matcher reads the hole version and produces explainable candidates.
4. Outreach worker creates a bounded wave and notification/conversation jobs.
5. Worker response becomes a structured conversation action.
6. Negotiation policy allows, denies, or requests approval for assistance.
7. Accept command atomically creates the assignment and closes competitors.
8. Committed state updates manager/worker projections and audit timeline.
9. Analytics receives redacted product events; it never becomes authoritative.

## Components And Responsibilities

### Manager Command Center

Implements: `prd.md > Epic 1`, `Epic 2`, `Epic 6`.

Shows severity-sorted holes, candidate wave, approvals, audit timeline, and success state.

### Filler Conversation

Implements: `prd.md > Epic 3`, `Epic 4`, `Epic 5`.

Presents shift facts, friendly negotiation, barrier options, consent, and acceptance outcome.

### Matching and policy engine

Implements: `prd.md > Epic 2`, `Epic 4`.

Uses deterministic, versioned rules. AI may phrase or classify a conversation but cannot authorize eligibility, spending, or employment consequences.

### Assignment transaction

Implements: `prd.md > Epic 5`.

Guarantees one winner, idempotent retries, stale-offer rejection, stable loser response, and durable events.

### RevenueCat adapter

Implements: `prd.md > Epic 7`.

Uses stable profile UUID as app user id; provides configure, customer info, purchase, restore, and demo methods. Server access combines tenant membership and mirrored entitlement.

### Accessibility system

Implements: `prd.md > Epic 8`.

Semantic labels/roles, focus visibility, status text plus color, scalable type, 44px targets, reduced motion, and contrast-safe tokens.

## External APIs And Dependencies

- Expo: https://docs.expo.dev/
- Expo Router: https://docs.expo.dev/router/introduction/
- RevenueCat React Native: https://www.revenuecat.com/docs/getting-started/installation/reactnative
- RevenueCat Expo: https://www.revenuecat.com/docs/getting-started/installation/expo
- Supabase JavaScript: https://supabase.com/docs/reference/javascript/introduction
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

## AI Usage

AI classifies free-form worker responses into a constrained schema, selects employer-approved conversational templates, and generates persuasive but friendly wording. Every result is validated. Deterministic fallbacks handle model failure. AI cannot infer qualifications, commit assignments, promise unapproved incentives, discipline workers, or reveal private data.

## Risks And Verification

- Voice/SMS legal consent: keep production communications disabled until jurisdictional review; demo is simulated.
- Cross-tenant leakage: deny-by-default RLS and tenant-consistent foreign keys/tests.
- Double assignment: unique active assignment plus atomic command and concurrency tests.
- Overspending: server-side policy limits and approval state.
- Vendor claims: label all placeholders and adapters accurately.
- Accessibility: automated checks plus keyboard, screen reader, text scaling, and reduced-motion manual checks.
- Store deadline: Android-first release path, RevenueCat test purchase early, store submission well before deadline.

## Demo And Submission Flow

Open manager dashboard → select urgent warehouse hole → start concurrent outreach → inspect three live conversations → choose transportation barrier in worker view → apply approved ride credit → accept → return to manager → “HoleFilled” success state → open RevenueCat paywall/restore screen → show audit timeline and accessibility controls.

