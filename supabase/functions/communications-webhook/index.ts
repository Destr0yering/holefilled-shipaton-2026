const xml = (value: string) => new Response(value, { headers: { 'content-type': 'text/xml; charset=utf-8' } });
declare const Deno: { env: { get(name: string): string | undefined }; serve(handler: (request: Request) => Response | Promise<Response>): void };
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[char]!));
const baseUrl = () => Deno.env.get('COMMUNICATIONS_WEBHOOK_URL') ?? '';
const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
};
const validTwilioRequest = async (request: Request, form: URLSearchParams) => {
  const signature = request.headers.get('x-twilio-signature') ?? '';
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN') ?? '';
  if (!signature || !authToken) return false;
  const sorted = [...form.entries()].map(([key,value]) => [key,value] as const).sort(([a],[b]) => a.localeCompare(b));
  const source = request.url + sorted.map(([key,value]) => `${key}${value}`).join('');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(authToken), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(source));
  const expected = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return timingSafeEqual(expected, signature);
};

const classify = async (workerText: string) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: Deno.env.get('OPENROUTER_MODEL') ?? 'stealth/ox-alpha',
      temperature: 0,
      max_tokens: 1200,
      messages: [
        { role: 'system', content: 'Classify a worker response. AI may phrase and classify only. It cannot verify eligibility, authorize spending, or assign a shift. Return JSON only.' },
        { role: 'user', content: `Worker response: ${workerText}\nReturn keys intent (accept|decline|question|transportation|incentive|stop|unknown), reply, requires_manager, safety_notes.` },
      ],
    }),
  });
  if (!response.ok) return { intent: 'unknown', reply: 'Thanks for responding. A manager will follow up.', requires_manager: true, safety_notes: 'Deterministic fallback used.' };
  const payload = await response.json();
  try {
    const parsed = JSON.parse(payload.choices?.[0]?.message?.content ?? '{}');
    const allowed = new Set(['accept','decline','question','transportation','incentive','stop','unknown']);
    if (!allowed.has(parsed.intent) || typeof parsed.reply !== 'string' || parsed.reply.length > 600 || typeof parsed.requires_manager !== 'boolean') throw new Error('invalid classification');
    return { intent: parsed.intent, reply: parsed.reply, requires_manager: parsed.requires_manager, safety_notes: String(parsed.safety_notes ?? '').slice(0,600) };
  }
  catch { return { intent: 'unknown', reply: 'Thanks for responding. A manager will follow up.', requires_manager: true, safety_notes: 'Invalid model output rejected.' }; }
};

const deterministicReply = (intent: string) => {
  switch (intent) {
    case 'accept': return 'Thank you. HoleFilled is verifying current eligibility and availability. The shift is not assigned until you receive a confirmation.';
    case 'decline': return 'Thank you for responding. We have recorded your decline. There is no penalty for declining this request.';
    case 'transportation': return 'Thank you. Transportation may be available under your employer policy. A permitted option will be confirmed before anything is promised.';
    case 'incentive': return 'Thank you. Your request will be checked against employer policy. Any amount requiring approval will be sent to a manager before it is offered.';
    case 'stop': return 'You are opted out of this outreach. No further messages will be sent for this request.';
    default: return 'Thank you for responding. A manager will follow up with the information you requested.';
  }
};

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const url = new URL(request.url);
  const event = url.searchParams.get('event');
  const session = url.searchParams.get('session') ?? '';
  const form = new URLSearchParams(await request.text());
  if (!(await validTwilioRequest(request, form))) return new Response('Forbidden', { status: 403 });
  if (event === 'voice-start') {
    const action = `${baseUrl()}?event=voice-response&amp;session=${encodeURIComponent(session)}`;
    return xml(`<Response><Gather input="speech dtmf" action="${action}" method="POST" speechTimeout="auto" actionOnEmptyResult="true"><Say>Hello, this is HoleFilled calling about an available shift from your employer. You may decline without penalty. Are you interested, or is there a barrier we may be able to help with?</Say></Gather><Say>We did not receive a response. A manager can follow up.</Say></Response>`);
  }

  const workerText = String(form.get('SpeechResult') ?? form.get('Body') ?? '').slice(0, 1000);
  const isStop = /^(stop|unsubscribe|cancel|end|quit)$/i.test(workerText.trim());
  if (event === 'voice-response') {
    const result = isStop ? { intent: 'stop' } : await classify(workerText);
    const action = `${baseUrl()}?event=voice-response&amp;session=${encodeURIComponent(session)}`;
    if (result.intent === 'stop') return xml(`<Response><Say>${escapeXml(deterministicReply('stop'))}</Say></Response>`);
    return xml(`<Response><Gather input="speech dtmf" action="${action}" method="POST" speechTimeout="auto"><Say>${escapeXml(deterministicReply(String(result.intent)))}</Say></Gather></Response>`);
  }
  if (event === 'sms-inbound') {
    const result = isStop ? { intent: 'stop' } : await classify(workerText);
    return xml(`<Response><Message>${escapeXml(deterministicReply(String(result.intent)))}</Message></Response>`);
  }
  return xml('<Response></Response>');
});
