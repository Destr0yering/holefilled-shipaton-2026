type Target = { candidateId: string; destination: string; channel: 'sms' | 'voice'; sessionId: string };
declare const Deno: { env: { get(name: string): string | undefined }; serve(handler: (request: Request) => Response | Promise<Response>): void };

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const required = (name: string) => { const value = Deno.env.get(name); if (!value) throw new Error(`${name} is not configured`); return value; };

const twilioPost = async (path: string, fields: Record<string,string>) => {
  const accountSid = required('TWILIO_ACCOUNT_SID');
  const authToken = required('TWILIO_AUTH_TOKEN');
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/${path}`, {
    method: 'POST',
    headers: { authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`Twilio ${response.status}: ${payload?.message ?? 'provider error'}`);
  return payload.sid as string;
};

Deno.serve(async (request) => {
  if (request.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
  if (request.headers.get('authorization') !== `Bearer ${required('OUTREACH_WORKER_TOKEN')}`) return json({ error: 'UNAUTHORIZED' }, 401);

  const { waveId, message, targets } = await request.json() as { waveId: string; message: string; targets: Target[] };
  const maxParallel = Number(Deno.env.get('OUTREACH_MAX_PARALLEL') ?? '5');
  if (!waveId || !message || !Array.isArray(targets) || targets.length < 1 || targets.length > maxParallel) return json({ error: 'INVALID_WAVE' }, 400);
  if (new Set(targets.map((target) => target.candidateId)).size !== targets.length) return json({ error: 'DUPLICATE_CANDIDATE' }, 409);

  const callbackBase = required('COMMUNICATIONS_WEBHOOK_URL');
  const messagingServiceSid = required('TWILIO_MESSAGING_SERVICE_SID');
  const voiceFrom = required('TWILIO_VOICE_FROM');
  const dispatches = targets.map(async (target) => {
    try {
      const sid = target.channel === 'sms'
        ? await twilioPost('Messages.json', { To: target.destination, MessagingServiceSid: messagingServiceSid, Body: message, StatusCallback: `${callbackBase}?event=status&session=${encodeURIComponent(target.sessionId)}` })
        : await twilioPost('Calls.json', { To: target.destination, From: voiceFrom, Url: `${callbackBase}?event=voice-start&session=${encodeURIComponent(target.sessionId)}`, StatusCallback: `${callbackBase}?event=status&session=${encodeURIComponent(target.sessionId)}`, StatusCallbackEvent: 'initiated ringing answered completed' });
      return { candidateId: target.candidateId, channel: target.channel, providerReference: sid, state: 'queued' };
    } catch (error) {
      return { candidateId: target.candidateId, channel: target.channel, state: 'failed', error: error instanceof Error ? error.message : 'provider error' };
    }
  });

  return json({ waveId, dispatches: await Promise.all(dispatches) }, 202);
});
