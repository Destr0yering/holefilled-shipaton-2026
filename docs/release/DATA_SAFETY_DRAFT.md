# Google Play Data Safety Draft

This is an engineering inventory, not a final legal declaration. Reconcile it against the production build and every enabled SDK before submitting the Play Console form.

## Current preview

- Fictional workforce and conversation data only.
- No production authentication or employer connector.
- No location permission requested.
- No advertising SDK.
- RevenueCat native SDK included; real store project not yet configured.

## Likely production data categories

| Category | Purpose | Shared externally | Required action |
| --- | --- | --- | --- |
| User IDs | Account, entitlement, tenant membership | RevenueCat and backend processors | Document retention and deletion |
| Phone number | Consented shift outreach | SMS/voice provider | Add explicit consent and opt-out |
| Work information | Qualification and shift matching | Employer workspace and contracted processors | Confirm employer authority |
| App interactions | Audit, reliability, product improvement | Observability/analytics processors if enabled | Configure minimization and retention |
| Purchase history | Subscription entitlement | App store and RevenueCat | Disclose purchase processing |
| Approximate/precise location | Transportation only, if later enabled | Mobility provider only when requested | Keep disabled until a real feature requires it |

## Security answers to verify

- Data is encrypted in transit.
- Tenant data is isolated by database row-level security and server authorization.
- Users have a documented account/data deletion path before launch.
- Optional analytics collection is accurately disclosed.
- No personal data is sold.
- Declining a shift does not create an adverse employment score.

Do not select final Play Console answers until the production dependency list, privacy policy, retention schedule, and deletion workflow have been reviewed together.
