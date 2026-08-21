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

## Golden demo

1. Open the dashboard and start the critical warehouse outreach.
2. Review the three concurrent voice/SMS conversations.
3. Observe Maya's transportation barrier.
4. Offer the configured Got2Get2Work pickup and $20 ride credit.
5. Confirm that one assignment wins and the manager sees “HoleFilled.”
6. Open Pro to see the RevenueCat-aware purchase and restore boundary.

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

Do not start a production build until the Android RevenueCat public key, Google Play subscription product, privacy policy, support contact, store listing, and data-safety answers are configured.

## Truthful integration status

- Voice/SMS conversations are simulated behind a provider interface.
- The HR event uses a canonical demo external ID and is not a certified UKG integration.
- Got2Get2Work, Uber, and Lyft are not connected or claimed as partners.
- Supabase, Sentry, PostHog, OneSignal, and Stripe are production boundaries requiring project credentials and configuration.
- Accessibility is an explicit engineering target; no legal compliance certification is claimed.

See `docs/hackathon-build/` for scope, product requirements, technical specification, checklist, and decision history.
