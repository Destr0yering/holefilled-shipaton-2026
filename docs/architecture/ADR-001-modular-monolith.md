# ADR-001: Modular monolith and authoritative Postgres state

Status: Accepted for Shipaton proof of concept.

HoleFilled begins as a TypeScript modular monolith backed by one tenant-isolated Postgres database. This minimizes deployment and transaction risk while preserving explicit identity, workforce, outreach, policy, mobility, billing, and audit boundaries.

Supabase Realtime distributes committed projections; it is not a job queue. Authoritative commands run in database transactions. Side effects use a transactional outbox with idempotent consumers. AI produces structured suggestions but cannot determine eligibility, approve spending above policy, or commit an assignment.

Services may be extracted only after measured scaling or organizational boundaries justify the operational cost.

