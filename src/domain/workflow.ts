import { AssignmentResult, Candidate, StaffingHole } from './models';

export const qualifiedCandidates = (hole: StaffingHole): Candidate[] =>
  hole.candidates
    .filter((candidate) =>
      candidate.available &&
      candidate.consented &&
      hole.qualifications.every((qualification) => candidate.qualifications.includes(qualification)),
    )
    .sort((a, b) => b.score - a.score);

export const confirmedCandidates = (hole: StaffingHole): Candidate[] =>
  qualifiedCandidates(hole)
    .filter((candidate) => candidate.status === 'confirmed')
    .sort((a, b) =>
      (a.restraintScore ?? 99) - (b.restraintScore ?? 99)
      || a.distanceMiles - b.distanceMiles
      || b.score - a.score,
    );

export const incentiveDecision = (
  hole: StaffingHole,
  requestedCents: number,
): 'auto-approved' | 'manager-approval' | 'denied' => {
  if (requestedCents <= hole.policy.autonomousLimitCents) return 'auto-approved';
  if (requestedCents <= hole.policy.managerLimitCents) return 'manager-approval';
  return 'denied';
};

export const acceptCandidate = (
  current: StaffingHole,
  candidateId: string,
  expectedVersion: number,
  details: { incentiveCents: number; transportation: string; eta: string },
): AssignmentResult => {
  if (current.status === 'filled') return { ok: false, code: 'HOLE_ALREADY_FILLED', hole: current };
  if (current.version !== expectedVersion) return { ok: false, code: 'STALE_VERSION', hole: current };
  const eligible = qualifiedCandidates(current).some((candidate) => candidate.id === candidateId);
  if (!eligible) return { ok: false, code: 'CANDIDATE_INELIGIBLE', hole: current };

  const hole: StaffingHole = {
    ...current,
    version: current.version + 1,
    status: 'filled',
    assignedCandidateId: candidateId,
    incentiveCents: details.incentiveCents,
    transportation: details.transportation,
    eta: details.eta,
    candidates: current.candidates.map((candidate) => ({
      ...candidate,
      status: candidate.id === candidateId ? 'accepted' : 'closed',
      message: candidate.id === candidateId
        ? 'Shift confirmed. Transportation support is ready.'
        : 'Thanks for responding. This shift has been filled.',
    })),
  };
  return { ok: true, code: 'ASSIGNED', hole };
};
