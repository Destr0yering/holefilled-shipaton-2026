# Project Scope

## Project Name Candidates

- HoleFilled (selected)
- HoleFilled AI
- HoleFilled Workforce Response

## One-Line Summary

HoleFilled is an AI voice and SMS staffing agent that detects an uncovered shift, negotiates with qualified coworkers, resolves transportation or incentive barriers, and confirms coverage back to the employer.

## Target User

- Primary buyer: shift-based employers in warehousing, manufacturing, hospitality, healthcare, events, and logistics.
- Primary operator: workforce manager, scheduler, or dispatcher responsible for urgent coverage.
- Primary participant: an existing, qualified employee eligible to fill an open shift.
- Integration customer: HR and workforce-management platforms such as UKG through a vendor-neutral API contract.

## Problem

Last-minute callouts, terminations, schedule changes, and uncovered shifts cause operational disruption. Managers manually call or text workers one at a time, lose time repeating details, cannot consistently identify why workers decline, and often discover transportation barriers too late. Existing scheduling tools record the hole but do not actively negotiate to fill it.

## Core Workflow

1. An employer integration or manager creates a staffing hole with required role, qualifications, worksite, start time, urgency, and incentive policy.
2. HoleFilled deterministically identifies eligible coworkers from that employer's internal pool.
3. The AI starts a small concurrent outreach wave over simulated voice/SMS channels.
4. Workers accept, decline, or explain a barrier.
5. HoleFilled may offer an employer-approved incentive automatically within policy limits.
6. Transportation barriers produce a Got2Get2Work integration option, employer ride credit, or manager escalation.
7. The first still-eligible acceptance is committed atomically; competing conversations are closed.
8. The manager sees “HoleFilled” with the confirmed filler, incentive, transportation plan, and ETA.

## What We Are Building

- A new Expo/React Native universal application for Android, iOS, and web.
- Responsive manager command center and worker response experience.
- Secure multi-tenant domain model and employer-scoped worker pools.
- Manual/demo integration adapter plus a documented HR-provider webhook contract.
- Deterministic eligibility and explainable ranking.
- Bounded concurrent outreach simulation with voice/SMS conversation transcripts.
- Decline-reason classification and barrier resolution.
- Employer-configured incentive thresholds and manager approval above the limit.
- Transportation-offer abstraction with a Got2Get2Work placeholder adapter.
- Atomic offer acceptance and visible audit timeline.
- RevenueCat entitlement adapter and paywall integrated into the authorization flow from day one.
- Accessibility-first interaction design targeting WCAG 2.2 AA and mobile accessibility APIs.
- Testable demo data that never implies real customers or vendor partnerships.

## What We Are Not Building

- A production telephony carrier integration in the first proof of concept; conversations are simulated behind a provider interface so Twilio or another provider can be added safely.
- A claimed or certified UKG/Workday integration; only a canonical adapter contract and demo importer.
- The Got2Get2Work application itself; only its API boundary.
- Payroll, attendance discipline, termination decisions, or autonomous employment decisions.
- An open labor marketplace or cross-employer worker sharing.
- Autonomous incentives above employer-configured thresholds.
- Paid passenger transportation, reimbursements, or a transportation network company.
- Got2Get2Church or Got2Get2School workflows.
- A legal guarantee of ADA compliance before independent audit.

## Inspiration And References

- PagerDuty: treat a staffing hole as an operational incident with escalation, ownership, and an audit trail.
- Twilio-style programmable communications: channel-agnostic outreach with durable conversation state.
- Modern workforce marketplaces: rapid shift discovery, while preserving employer-owned pools and qualifications.

## Time Budget

Approximately six weeks remain before the September 30, 2026 submission deadline. The first proof of concept is a focused one-night build, followed by production integrations, store readiness, testing, and launch work.

## Demo Path

Warehouse night-shift callout → manager sees urgent hole → HoleFilled contacts three qualified fillers concurrently → two decline → one identifies transportation as the barrier → employer-approved ride credit/Got2Get2Work option is offered → worker accepts → atomic assignment succeeds → manager dashboard displays “HoleFilled” and a confirmed ETA.

## Submission Story

Scheduling software tells managers that a shift is empty. HoleFilled acts: it talks to the people who can cover, learns what is stopping them, applies policy-controlled solutions, and returns a confirmed human outcome. The professional success phrase is simply “HoleFilled.”

