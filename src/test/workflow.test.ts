import { describe, expect, it } from 'vitest';
import { initialHole } from '../data';
import { acceptCandidate, incentiveDecision, qualifiedCandidates } from '../domain/workflow';

describe('HoleFilled workflow', () => {
  it('returns explainably eligible candidates in score order', () => {
    expect(qualifiedCandidates(initialHole).map((candidate) => candidate.id)).toEqual(['maya', 'carlos', 'jordan']);
  });

  it('requires manager approval above the autonomous threshold', () => {
    expect(incentiveDecision(initialHole, 2500)).toBe('auto-approved');
    expect(incentiveDecision(initialHole, 4500)).toBe('manager-approval');
    expect(incentiveDecision(initialHole, 10000)).toBe('denied');
  });

  it('commits one winner and closes competing offers', () => {
    const first = acceptCandidate(initialHole, 'maya', 1, { incentiveCents: 2000, transportation: 'Got2Get2Work ride match', eta: '9:34 PM' });
    expect(first.ok).toBe(true);
    expect(first.hole.status).toBe('filled');
    expect(first.hole.candidates.filter((candidate) => candidate.status === 'accepted')).toHaveLength(1);
    const second = acceptCandidate(first.hole, 'jordan', 2, { incentiveCents: 2500, transportation: 'Self-arranged', eta: '9:38 PM' });
    expect(second.code).toBe('HOLE_ALREADY_FILLED');
  });

  it('rejects stale versions', () => {
    expect(acceptCandidate(initialHole, 'maya', 0, { incentiveCents: 0, transportation: '', eta: '' }).code).toBe('STALE_VERSION');
  });
});

