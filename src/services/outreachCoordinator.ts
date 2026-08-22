export type OutreachChannel = 'sms' | 'voice';

export interface OutreachTarget {
  candidateId: string;
  destination: string;
  channel: OutreachChannel;
}

export interface OutreachDispatch {
  candidateId: string;
  channel: OutreachChannel;
  providerReference: string;
  state: 'queued' | 'failed';
  errorCode?: 'PROVIDER_ERROR';
}

export interface CommunicationsProvider {
  sendSms(target: OutreachTarget, message: string, idempotencyKey: string): Promise<string>;
  startVoiceCall(target: OutreachTarget, message: string, idempotencyKey: string): Promise<string>;
}

export const dispatchOutreachWave = async (
  provider: CommunicationsProvider,
  waveId: string,
  targets: OutreachTarget[],
  message: string,
  maxWaveSize = 5,
): Promise<OutreachDispatch[]> => {
  if (!waveId.trim()) throw new Error('waveId is required');
  if (targets.length === 0) return [];
  if (targets.length > maxWaveSize) throw new Error(`Outreach wave exceeds the configured limit of ${maxWaveSize}`);
  if (new Set(targets.map((target) => target.candidateId)).size !== targets.length) throw new Error('Candidate appears more than once in an outreach wave');

  // Mapping before awaiting starts all provider requests in the same event-loop turn.
  const pending = targets.map(async (target): Promise<OutreachDispatch> => {
    const idempotencyKey = `${waveId}:${target.candidateId}:${target.channel}`;
    try {
      const providerReference = target.channel === 'sms'
        ? await provider.sendSms(target, message, idempotencyKey)
        : await provider.startVoiceCall(target, message, idempotencyKey);
      return { candidateId: target.candidateId, channel: target.channel, providerReference, state: 'queued' };
    } catch {
      return { candidateId: target.candidateId, channel: target.channel, providerReference: '', state: 'failed', errorCode: 'PROVIDER_ERROR' };
    }
  });

  return Promise.all(pending);
};

