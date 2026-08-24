declare const Deno: { env: { get(name: string): string | undefined }; serve(handler: (request: Request) => Response | Promise<Response>): void };

type RevenueCatEvent = {
  id?: string;
  type?: string;
  app_user_id?: string;
  entitlement_ids?: string[];
  expiration_at_ms?: number | null;
};

const entitlementId = 'holefilled_pro';
const encoder = new TextEncoder();

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
};

const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const verifySignature = async (rawBody: string, signatureHeader: string, secret: string) => {
  const timestamp = signatureHeader.match(/(?:^|,)\s*t=(\d+)/)?.[1] ?? '';
  const signature = signatureHeader.match(/(?:^|,)\s*v1=([a-f0-9]+)/i)?.[1] ?? '';
  if (!timestamp || !signature || Math.abs(Date.now() - Number(timestamp) * 1000) > 5 * 60 * 1000) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${rawBody}`));
  const expected = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return timingSafeEqual(expected, signature);
};

const supabase = async (path: string, init: RequestInit) => {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) throw new Error('Supabase server configuration is missing.');
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}`, 'content-type': 'application/json', ...(init.headers ?? {}) },
  });
};

const recordEvent = async (eventId: string, rawBody: string) => {
  const existing = await supabase(`provider_events?provider=eq.revenuecat&provider_event_id=eq.${encodeURIComponent(eventId)}&select=provider_event_id`, { method: 'GET' });
  if (!existing.ok) throw new Error('Unable to read provider event.');
  if ((await existing.json() as Array<{ provider_event_id: string }>).length > 0) return false;
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(rawBody));
  const payloadHash = [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const response = await supabase('provider_events', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ provider: 'revenuecat', provider_event_id: eventId, payload_hash: payloadHash }),
  });
  if (response.status === 409) return false;
  if (!response.ok) throw new Error('Unable to record provider event.');
  return true;
};

const updateEvent = (eventId: string, status: 'processed' | 'ignored' | 'failed') => supabase(`provider_events?provider=eq.revenuecat&provider_event_id=eq.${encodeURIComponent(eventId)}`, {
  method: 'PATCH', body: JSON.stringify({ status, processed_at: new Date().toISOString() }),
});

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const rawBody = await request.text();
  const signingSecret = Deno.env.get('REVENUECAT_WEBHOOK_SIGNING_SECRET') ?? '';
  const signature = request.headers.get('x-revenuecat-webhook-signature') ?? '';
  if (!signingSecret || !(await verifySignature(rawBody, signature, signingSecret))) return new Response('Unauthorized', { status: 401 });

  let payload: { event?: RevenueCatEvent };
  try { payload = JSON.parse(rawBody); } catch { return new Response('Invalid JSON', { status: 400 }); }
  const event = payload.event;
  const eventId = event?.id ?? '';
  if (!event || !eventId) return new Response('Missing event identifier', { status: 400 });
  // RevenueCat dashboard test events prove the signed delivery path only; they must not mutate access data.
  if (event.type === 'TEST') return new Response('OK', { status: 200 });

  try {
    const isNew = await recordEvent(eventId, rawBody);
    if (!isNew) return new Response('OK', { status: 200 });
    const userId = event.app_user_id ?? '';
    const hasPro = event.entitlement_ids?.includes(entitlementId) ?? false;
    const isExpiration = event.type === 'EXPIRATION';
    if (!isUuid(userId) || (!hasPro && !isExpiration)) {
      await updateEvent(eventId, 'ignored');
      return new Response('OK', { status: 200 });
    }

    const endsAt = isExpiration ? new Date().toISOString() : event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null;
    const grant = { user_id: userId, capability: entitlementId, source_provider: 'revenuecat', source_reference: userId, starts_at: new Date().toISOString(), ends_at: endsAt };
    const result = await supabase('access_grants?on_conflict=source_provider,source_reference,capability', {
      method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(grant),
    });
    if (!result.ok) throw new Error('Unable to synchronize access grant.');
    await updateEvent(eventId, 'processed');
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('RevenueCat webhook processing failed', error instanceof Error ? error.message : 'unknown error');
    return new Response('Retry later', { status: 503 });
  }
});
