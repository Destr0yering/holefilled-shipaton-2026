# Live SMS and Voice Architecture

## Status

The application contains a tested concurrent coordinator and deployable server-only Twilio/OpenRouter boundaries. Live carrier delivery remains disabled until credentials, verified sender identities, public webhooks, consent policy, and jurisdictional review are configured. The visual demo continues to use fictional conversations.

## Near-simultaneous dispatch

1. A committed staffing hole produces an employer-scoped candidate list.
2. The server creates one outreach wave and one isolated communication session per filler.
3. A bounded `Promise.all` fan-out starts every SMS or voice REST request in the same event-loop turn.
4. Twilio delivers each conversation independently and reports lifecycle changes through signed callbacks.
5. OpenRouter classifies and phrases responses into an allowlisted structure. Internal reasoning is discarded.
6. Deterministic policy authorizes or rejects incentives, transportation, eligibility, and acceptance.
7. The existing atomic acceptance command commits one winner and closes the other sessions courteously.

The initial default is five simultaneous fillers. Employers may configure a lower bound; larger waves require deliberate capacity, consent, cost, and carrier review.

## Channel behavior

### SMS

- Send through a Twilio Messaging Service with a status callback.
- Inbound replies enter the signed communications webhook.
- STOP and standard opt-out keywords bypass AI and receive a deterministic acknowledgement; production persistence must also close the session and update consent immediately.
- Delivery failure affects only that candidate session; the rest of the wave continues.

### Voice

- Create outbound calls concurrently through Twilio Calls.
- Twilio requests TwiML and `<Gather>` captures speech or keypad input.
- Each turn is classified and receives a short, professional reply.
- Voice is optional per employer and must be disabled where consent, calling-hour, recording, or labor rules have not been approved.
- Recording is off by default. No raw audio is stored by HoleFilled in this foundation.

## Security and privacy

- OpenRouter and Twilio keys remain server-side Supabase secrets and are never shipped in Expo or an APK.
- Twilio webhooks require `X-Twilio-Signature` HMAC validation before processing.
- Phone destinations are encrypted at rest and excluded from client projections.
- Raw model reasoning is not stored. Only validated intent, approved reply, provider reference, and an audit event are retained.
- Do not transmit clinical details, protected characteristics, discipline history, or unnecessary worker data to the model.
- AI cannot verify credentials, authorize spending, decide employment consequences, or assign the shift.

## Remaining activation work

- Provision a dedicated Twilio subaccount, Messaging Service, voice number, restricted API credentials, spend alerts, and geographic permissions.
- Implement durable session lookup for inbound SMS using provider identifiers and encrypted From/To mappings.
- Persist every callback idempotently in `provider_events`, then update session projections transactionally.
- Persist deterministic STOP handling into the worker consent record before acknowledging the opt-out.
- Deploy Edge Functions and validate their public URLs with Twilio.
- Complete carrier registration, consent/opt-out copy, quiet hours, accessibility, labor, call-recording, healthcare, and jurisdictional review.
- Conduct real-device tests with controlled tester numbers before contacting any employee.
