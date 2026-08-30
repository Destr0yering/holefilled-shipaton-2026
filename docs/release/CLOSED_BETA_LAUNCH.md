# Closed-beta AAB launch checklist

Use this checklist before uploading a new Android App Bundle to Google Play closed testing.

## Build safeguards

- [ ] `EXPO_PUBLIC_ENABLE_BETA_AUTH` is unset or `false`; the beta must not offer account creation or sign-in.
- [ ] Only public RevenueCat SDK keys are present in EAS environment variables. Never add a RevenueCat secret key, Supabase service-role key, webhook secret, or employer credential to an Expo variable.
- [ ] `EXPO_PUBLIC_ENABLE_BETA_PURCHASES` is unset or `false`; RevenueCat purchase products remain unavailable unless an intentional Play test product and trial have been configured and physically tested.
- [ ] Capture protection has been tested on a physical Android device: screenshot, screen recording, and recent-app preview are blocked.
- [ ] The app contains no real employer, worker, customer, payment, health, or sensitive data.

## Tester safeguards

- [ ] Publish the updated policy pages to their public, non-editable URLs and open each one on a phone: `privacy.html`, `terms.html`, `beta-terms.html`, `support.html`, and `account-deletion.html`.
- [ ] Testers receive the closed-test opt-in link privately, not in public posts.
- [ ] Each tester accepts the in-app beta acknowledgement before entering the demo.
- [ ] The tester instructions link to `privacy.html`, `terms.html`, `beta-terms.html`, `support.html`, and `account-deletion.html`.
- [ ] Feedback submitted through public GitHub issues contains no personal, employer, employee, payment, or confidential information.
- [ ] A private support contact is established before enabling authentication, real data, or sensitive feedback.

## Build and test

- [ ] Run `npm test -- --run` and `npm run typecheck`.
- [ ] Run `npm run release:check`.
- [ ] Create a fresh production-profile AAB so the Android version code increments.
- [ ] Install the exact AAB through Play testing on at least one physical Android device.
- [ ] Test: first launch, beta checkbox, blocked capture, each fictional scenario, offline behavior, update/install, and the disabled/unconfigured purchase state.

## Play Console

- [ ] Upload the finished Android version-code 4 AAB to the intended test track, save/review the release, and wait until Play Console accepts and processes it before distributing any tester link.
- [ ] Confirm the privacy-policy URL is public and matches the beta's actual data handling.
- [ ] Keep Data Safety declarations consistent with the anonymous beta build.
- [ ] Add 15–20 trusted Android testers to protect against drop-off from the required 12 continuous closed-test participants.

Do not promote this build to production while it is a fictional beta or while private support, account deletion, real data controls, and live purchase testing are incomplete.
