import { describe, expect, it } from 'vitest';
import { CommunicationsProvider, dispatchOutreachWave, OutreachTarget } from '../services/outreachCoordinator';

const targets: OutreachTarget[] = [
  { candidateId: 'maya', destination: '+15550000001', channel: 'voice' },
  { candidateId: 'carlos', destination: '+15550000002', channel: 'sms' },
  { candidateId: 'jordan', destination: '+15550000003', channel: 'voice' },
];

describe('concurrent outreach coordinator', () => {
  it('starts every independent negotiation before waiting for any result', async () => {
    const started: string[] = [];
    const provider: CommunicationsProvider = {
      sendSms: async (target) => { started.push(target.candidateId); await new Promise((resolve) => setTimeout(resolve, 15)); return `SM-${target.candidateId}`; },
      startVoiceCall: async (target) => { started.push(target.candidateId); await new Promise((resolve) => setTimeout(resolve, 15)); return `CA-${target.candidateId}`; },
    };
    const pending = dispatchOutreachWave(provider, 'wave-1', targets, 'Fictional shift request');
    expect(started).toEqual(['maya', 'carlos', 'jordan']);
    const results = await pending;
    expect(results.map((result) => result.state)).toEqual(['queued', 'queued', 'queued']);
  });

  it('isolates a provider failure instead of canceling the whole wave', async () => {
    const provider: CommunicationsProvider = {
      sendSms: async () => { throw new Error('provider unavailable'); },
      startVoiceCall: async (target) => `CA-${target.candidateId}`,
    };
    const results = await dispatchOutreachWave(provider, 'wave-2', targets, 'Fictional shift request');
    expect(results.filter((result) => result.state === 'queued')).toHaveLength(2);
    expect(results.find((result) => result.candidateId === 'carlos')?.errorCode).toBe('PROVIDER_ERROR');
  });

  it('rejects oversized or duplicate waves before contacting anyone', async () => {
    const provider: CommunicationsProvider = { sendSms: async () => 'SM', startVoiceCall: async () => 'CA' };
    await expect(dispatchOutreachWave(provider, 'wave-3', [...targets, ...targets], 'message')).rejects.toThrow('limit');
    await expect(dispatchOutreachWave(provider, 'wave-4', [targets[0], targets[0]], 'message')).rejects.toThrow('more than once');
  });
});

