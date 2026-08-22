# RevenueCat Production Setup

This is the exact dashboard contract expected by the current application.

## Project

- Project name: `HoleFilled`
- RevenueCat project ID: `6858b0db`
- RevenueCat Play Store app REST identifier: `app12d449d0ed`
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

## Configured sandbox state

- Test Store app configuration is active.
- Entitlement `holefilled_pro` is active and attached to three Test Store products.
- Offering `default` contains monthly, yearly, and lifetime packages.
- The Test Store public SDK key is stored in the EAS `preview` environment only.
- The Google Play public SDK key is stored in the EAS `production` environment only.
- No Test Store or Google Play SDK key is committed to Git.
- The Google Play app configuration exists for `com.destr0yering.holefilled`.
- Google Play service-account credentials and live Play subscription products remain required.

## Verified sandbox Android build

- Build: https://expo.dev/accounts/destr0yering/projects/holefilled-shipaton-2026/builds/0c16a373-be53-47ab-b23f-798e778c3be4
- USB artifact: `D:\holefilled-build-cache\artifacts\holefilled-revenuecat-sandbox-v1.apk`
- SHA-256: `56E742CD1D642BD8D44087071AC9278238049EE71ADB2FF903380E5F9D82109A`

The application requests the first package in the current offering and validates the `holefilled_pro` entitlement. Do not change these identifiers without updating and retesting the native adapter.

## Verified multi-sector Android test build

- Build: https://expo.dev/accounts/destr0yering/projects/holefilled-shipaton-2026/builds/5362a700-eb41-4705-aed2-675b9c5ba407
- Profile/distribution: `preview` / internal APK
- Source commit: `dcb44dfa4b55941cd49e00b38d51c0233ef00e92`
- USB artifact: `D:\holefilled-build-cache\artifacts\holefilled-multisector-test-v2.apk`
- Size: `72,209,386` bytes
- SHA-256: `94FA3F0BF275A85AB5B447D21454AD30F4158713030DAA6BE8D5AD22DBD00406`
- Package integrity: Android manifest and DEX present; APK Signature Scheme v2 verified with one RSA signer

The build contains all five fictional sector demos and loads the RevenueCat Test Store SDK key from the EAS preview environment. Complete installation, navigation, accessibility, and Test Store purchase/restore checks on an Android device before promoting this source revision to a new production AAB.

## Verified production Android bundle

- Build: https://expo.dev/accounts/destr0yering/projects/holefilled-shipaton-2026/builds/0770b31a-3ee5-450a-a3d3-d0e8df7c8043
- Profile/distribution: `production` / Google Play store
- Version: `1.0.0` (`versionCode` 2)
- Source commit: `75fd724363dda2c5be88bd227b0a34d9df2a8632`
- USB artifact: `D:\holefilled-build-cache\artifacts\holefilled-production-v2.aab`
- Size: `50,117,584` bytes
- SHA-256: `6904486419981C33BB6800C2F82F2665F886514A18437A6EC6927B574C1F2DAE`

This is a store-ready artifact, not evidence of publication or a completed live billing test. Upload it to Play Console, create and activate the live subscription product, import/link that product in RevenueCat, and test through a Play-distributed testing track.

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
