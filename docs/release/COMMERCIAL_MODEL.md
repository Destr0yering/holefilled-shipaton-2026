# HoleFilled commercial and access model

## Decision

HoleFilled sells employer access as an organization license. `HoleFilled Pro` remains an optional individual-manager subscription, purchased through the device store and administered through RevenueCat. They grant different commercial rights, but normalize to the same internal capability checks.

No public price, trial, savings, or performance claim is made here. Commercial pricing and terms are set in a signed order form or the relevant store listing before launch.

| Path | Buyer | Commercial motion | Access source | System of record |
| --- | --- | --- | --- | --- |
| Employer license | Staffing company, facility, or multi-site operator | Contract with optional implementation/onboarding fee and recurring monthly or annual license | Organization-level capabilities | Contract/billing system plus HoleFilled access grants |
| Manager Pro | Individual manager | Monthly, yearly, or lifetime store product | `holefilled_pro` RevenueCat entitlement | RevenueCat and the app-store receipt |
| Web self-serve | Named individual, not an enterprise procurement flow | Hosted web checkout, when enabled | Same entitlement as Manager Pro | Stripe Billing connected to RevenueCat |

## Hosting boundary

- **RevenueCat hosts mobile purchase validation and entitlement lifecycle.** The mobile app uses its public SDK key only. RevenueCat secret keys remain server-side.
- **HoleFilled hosts the operational product backend.** Supabase/Postgres is the planned source of truth for organizations, membership, shifts, outreach, audit history, and authorization.
- **The client never authorizes tenant data by itself.** A valid subscription is one input to a server-side access decision; the user must also be an active member of the organization.
- **Employer billing is separate from store billing.** RevenueCat Billing is not the B2B billing system for an employer license. Use contracts/invoices (or a separately configured Stripe business flow) and provision the organization server-side.

## Authorization model

1. An authenticated user belongs to an active HoleFilled organization.
2. The server evaluates a non-expired `access_grants` capability for that user or organization.
3. A manager’s valid RevenueCat entitlement can produce a user-scoped Pro grant after a verified webhook event.
4. An employer contract can produce an organization-scoped grant after an authorized provisioning action.
5. A request proceeds only when both membership and capability checks succeed.

The existing `public.access_grants` table supports user- or organization-scoped grants and records `source_provider`, `source_reference`, start time, and optional end time. RevenueCat webhook events must be stored in `provider_events` before grants are inserted or changed so delivery is idempotent.

## Launch sequence

1. Keep the current RevenueCat Test Store offering for the Shipaton purchase demonstration.
2. For live Manager Pro, create/activate the matching Play/App Store product, link it to `holefilled_pro`, configure authenticated RevenueCat login, and verify a physical-device purchase and restore.
3. For the first employer pilot, sign the commercial terms, create the organization and memberships in Supabase, then write a time-bounded organization access grant from the contract record.
4. When web self-serve is needed, connect Stripe Billing to RevenueCat and expose a hosted checkout only for the individual Manager Pro product—not enterprise procurement.

## Explicit non-goals for the demo

- The custom in-app paywall is not an employer invoicing portal.
- Test Store products are not live commercial offers.
- No organization access is granted merely because a device reports a client-side entitlement.
- No Stripe, contract, or invoice workflow is configured in this repository yet.
