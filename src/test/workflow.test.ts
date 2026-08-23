import { describe, expect, it } from 'vitest';
import { demoScenarios, initialHole } from '../data';
import { acceptCandidate, confirmedCandidates, incentiveDecision, qualifiedCandidates } from '../domain/workflow';

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

  it('keeps every sector demo deterministic, qualified, and fillable', () => {
    expect(demoScenarios.map((scenario) => scenario.id)).toEqual(['warehouse', 'server', 'cook', 'nurse', 'crossing-guard']);
    for (const scenario of demoScenarios) {
      expect(qualifiedCandidates(scenario.hole)).toHaveLength(8);
      const winner = scenario.hole.candidates.find((candidate) => candidate.id === scenario.winnerCandidateId);
      expect(winner?.barrier).toBe('transportation');
      const responded = {
        ...scenario.hole,
        status: 'contacting' as const,
        candidates: scenario.hole.candidates.map((candidate) => ({
          ...candidate,
          status: candidate.responseOutcome ?? 'confirmed' as const,
        })),
      };
      expect(confirmedCandidates(responded).length).toBeGreaterThanOrEqual(4);
      expect(confirmedCandidates(responded).length).toBeLessThanOrEqual(5);
      expect(confirmedCandidates(responded)[0].id).toBe(scenario.winnerCandidateId);
      const result = acceptCandidate(scenario.hole, scenario.winnerCandidateId, 1, {
        incentiveCents: scenario.incentiveCents,
        transportation: scenario.transportation,
        eta: scenario.eta,
      });
      expect(result.code).toBe('ASSIGNED');
      expect(result.hole.assignedCandidateId).toBe(scenario.winnerCandidateId);
    }
  });
});
