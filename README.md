# HoleFilled

HoleFilled is an AI-powered voice and SMS staffing response agent. It detects an uncovered shift, contacts qualified coworkers from an employer-controlled pool, identifies why people decline, applies policy-controlled incentives or transportation assistance, and confirms one valid assignment back to the manager.

This repository is a new RevenueCat Shipaton 2026 application. Got2Get2Work is a separate mobility platform represented here only by an adapter boundary.

## Run the proof of concept

```powershell
npm install
npm run web
```

The default is a deterministic demo using fictional workers and a fictional employer. No secrets are required.

```powershell
npm test
npm run typecheck
npm run export:web
```

## Installable Android preview

- Expo build: https://expo.dev/accounts/destr0yering/projects/holefilled-shipaton-2026/builds/964b9681-1483-40dd-92ed-30d6cbc0d829
- Build type: internal-distribution APK
- Application ID: `com.destr0yering.holefilled`
- Version: `1.0.0` (`versionCode` 1)
- Local USB artifact: `D:\holefilled-build-cache\artifacts\holefilled-preview-v1.apk`
- SHA-256: `233DC106BABAA3EA1ED1D1142C3EB17CB3364F0DD8D0C8CE9B0B43E2C4FCE8E5`

This preview proves that the native Android application compiles and can be installed for device testing. It is not a Google Play release and does not satisfy the published-store requirement by itself.

RevenueCat sandbox build:

- Build: https://expo.dev/accounts/destr0yering/projects/holefilled-shipaton-2026/builds/0c16a373-be53-47ab-b23f-798e778c3be4
- Local USB artifact: `D:\holefilled-build-cache\artifacts\holefilled-revenuecat-sandbox-v1.apk`
- SHA-256: `56E742CD1D642BD8D44087071AC9278238049EE71ADB2FF903380E5F9D82109A`

Multi-sector RevenueCat test build:

- Build: https://expo.dev/accounts/destr0yering/projects/holefilled-shipaton-2026/builds/5362a700-eb41-4705-aed2-675b9c5ba407
- Source commit: `dcb44dfa4b55941cd49e00b38d51c0233ef00e92`
- Scenarios: distribution, hospitality, food service, healthcare, and public sector
- Local USB artifact: `D:\holefilled-build-cache\artifacts\holefilled-multisector-test-v2.apk`
- Size: `72,209,386` bytes
- SHA-256: `94FA3F0BF275A85AB5B447D21454AD30F4158713030DAA6BE8D5AD22DBD00406`
- Native package validation: Android manifest and DEX present; APK Signature Scheme v2 verified with one signer

This is the current direct-install Android test artifact. No Android device or running emulator was attached during packaging, so installation and touch-flow testing remain a tester/device step.

Google Play production bundle:

- Build: https://expo.dev/accounts/destr0yering/projects/holefilled-shipaton-2026/builds/0770b31a-3ee5-450a-a3d3-d0e8df7c8043
- Build type: store-distribution Android App Bundle (`.aab`)
- Version: `1.0.0` (`versionCode` 2)
- Source commit: `75fd724363dda2c5be88bd227b0a34d9df2a8632`
- Local USB artifact: `D:\holefilled-build-cache\artifacts\holefilled-production-v2.aab`
- SHA-256: `6904486419981C33BB6800C2F82F2665F886514A18437A6EC6927B574C1F2DAE`

The bundle is ready for Google Play upload. It is not considered published, and no live subscription claim is made, until Play Console review/distribution and a physical-device purchase test are complete.

## Public project pages

- Project: https://destr0yering.github.io/holefilled-shipaton-2026/
- Privacy policy: https://destr0yering.github.io/holefilled-shipaton-2026/privacy.html
- Support: https://destr0yering.github.io/holefilled-shipaton-2026/support.html

These HTTPS pages are suitable for preview and store-listing preparation. Add a private support email and production legal entity details before public launch.

## Golden demo

1. Open the dashboard and start the critical warehouse outreach.
2. Review the three concurrent voice/SMS conversations.
3. Observe Maya's transportation barrier.
4. Offer the configured Got2Get2Work pickup and $20 ride credit.
5. Confirm that one assignment wins and the manager sees “HoleFilled.”
6. Open Pro to see the RevenueCat-aware purchase and restore boundary.

The dashboard also includes selectable fictional demos for a banquet server, line cook, registered nurse, and crossing guard. Each scenario applies sector-specific qualifications, policy limits, worker responses, and transportation options while using the same auditable HoleFilled workflow. See `docs/research/UKG_SECTOR_DEMO_STRATEGY.md` for the public UKG sector evidence and claim boundaries.

## RevenueCat

Web preview uses a clearly labeled in-memory entitlement. Native builds load `react-native-purchases` through the platform-specific adapter using `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` or `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`. Only RevenueCat public SDK keys belong in Expo environment variables; secret keys must remain server-side.

Create a RevenueCat entitlement named `holefilled_pro`, attach a monthly store product to the current offering, and configure a free trial or judge promo path. Until authenticated user accounts exist, RevenueCat creates an anonymous app user ID. Production authentication should call RevenueCat login with the stable application user ID and reconcile webhook/customer data into internal access grants. Client entitlement data never grants tenant access by itself.

## Android release preparation

The Android package is `com.destr0yering.holefilled`. EAS profiles are defined in `eas.json`; preview produces an APK and production produces an Android App Bundle.

```powershell
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform android --profile production
```

The production bundle has been generated with the RevenueCat Google Android public SDK key stored in EAS. Before public release, finish the live Google Play subscription product, private support contact, store listing, data-safety declaration, and physical-device purchase test.

## Truthful integration status

- Voice/SMS conversations are simulated behind a provider interface.
- The HR event uses a canonical demo external ID and is not a certified UKG integration.
- Got2Get2Work, Uber, and Lyft are not connected or claimed as partners.
- Supabase, Sentry, PostHog, OneSignal, and Stripe are production boundaries requiring project credentials and configuration.
- Accessibility is an explicit engineering target; no legal compliance certification is claimed.

See `docs/hackathon-build/` for scope, product requirements, technical specification, checklist, and decision history.
