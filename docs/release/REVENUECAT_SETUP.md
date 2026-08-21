# RevenueCat Production Setup

This is the exact dashboard contract expected by the current application.

## Project

- Project name: `HoleFilled`
- Devpost field required after creation: RevenueCat project ID
- Android application ID: `com.destr0yering.holefilled`
- iOS bundle ID: `com.destr0yering.holefilled`

## Entitlement and offering

- Entitlement identifier: `holefilled_pro`
- Offering identifier: `default`
- Package: monthly
- Suggested product ID: `holefilled_pro_monthly`
- Display name: `HoleFilled Pro`
- Initial price hypothesis: USD $49.00/month
- Judge access: configure a free trial or a working promo code

The application requests the first package in the current offering and validates the `holefilled_pro` entitlement. Do not change these identifiers without updating and retesting the native adapter.

## SDK keys

Set only RevenueCat public SDK keys in EAS:

```powershell
npx eas-cli env:create --environment preview --name EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY --value <public-android-sdk-key> --visibility sensitive
npx eas-cli env:create --environment production --name EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY --value <public-android-sdk-key> --visibility sensitive
```

For iOS, use `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`. Never place a RevenueCat secret key in Expo client environment variables or the repository.

## Acceptance test

1. Install a store-connected test build on a physical device.
2. Confirm the paywall shows the store-derived title and localized price.
3. Complete a sandbox purchase.
4. Restart the app and confirm Pro remains active.
5. Reinstall, select Restore Purchases, and confirm Pro is restored.
6. Cancel or expire the sandbox subscription and confirm access is removed after RevenueCat refresh.
7. Verify the RevenueCat customer timeline and entitlement state.

## Production follow-up

- Configure authenticated RevenueCat login when application accounts are enabled.
- Validate RevenueCat webhook signatures server-side.
- Store processed webhook IDs for idempotency.
- Normalize entitlement state into internal `access_grants`; never use client claims for employer-tenant authorization.
