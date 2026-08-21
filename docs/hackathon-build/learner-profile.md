# Learner Profile

## Participant

- Name: Thomas Ohmstead; public creator identity: Destr0yering
- Background: Founder, planner, thought engineer, and workforce/transportation logistics domain expert with experience directing complex software deployments.
- What brought them to the hackathon: Build and publicly launch a monetized, production-minded workforce automation product for RevenueCat Shipaton 2026.

## Project Idea

- Initial idea: HoleFilled is a standalone AI-powered voice and SMS staffing agent. It detects schedule holes from employer HR/scheduling events, contacts qualified coworkers from that employer's internal worker pool, negotiates coverage concurrently, escalates employer-approved incentives, identifies transportation barriers, and updates the manager and source system when a filler is confirmed.
- Related platform: Got2Get2Work is a separate coworker mobility product. HoleFilled may call its API to arrange transportation, alongside employer-approved Uber/Lyft credits or other mobility options.
- Integration direction: HoleFilled should expose an API suitable for UKG and other major HR/scheduling platforms. The launch build will use a canonical integration boundary rather than claiming completed vendor partnerships.

## Technical Experience

- Experience level: Product/technical founder who leads planning, architecture, systems thinking, and domain decisions; delegates implementation detail to AI coding tools.
- Languages/frameworks known: Has directed work across Expo/React Native, TypeScript, Fastify, Firebase, Cloud Run, APIs, mobile releases, and operational tooling. Exact hands-on language depth is less important than architecture and product ownership.
- AI coding tools used before: Codex, ChatGPT, OpenRouter-routed models, Gemini, and local/Nano model tooling.
- Prior experience planning before coding: Strong; planning and thought engineering are core strengths.

## Build Preferences

- Preferred pace: Fast and autonomous after product decisions are established, with clear verification gates for consequential actions.
- Likely support needs: End-to-end implementation, integration contracts, accessibility implementation, transactional correctness, testing, store release, monetization, and submission packaging.
- Notes for downstream commands:
  - HoleFilled is the Shipaton submission; Got2Get2Work is a separate API integration.
  - Brand voice is persuasive, friendly, professional, and free of innuendo.
  - Employer selects/configures the AI voice and escalation policy.
  - Visual direction is a clean SaaS interface.
  - Accessibility is a first-class requirement for mobile and web, targeting WCAG 2.2 AA and platform accessibility APIs; avoid claiming legal compliance without an audit.
  - Signature success state is simply “HoleFilled.” It should feel like a normal office operations term and support a celebratory, human moment.
  - Incentives follow employer policy: autonomous offers within configured thresholds, manager approval above the threshold.
  - Multiple qualified fillers may be contacted concurrently, but only one acceptance can be committed atomically.

