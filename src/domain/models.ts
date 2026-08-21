export type HoleStatus = 'open' | 'contacting' | 'approval-needed' | 'filled' | 'unfilled';
export type CandidateStatus = 'ready' | 'contacting' | 'declined' | 'negotiating' | 'accepted' | 'closed';
export type Barrier = 'none' | 'transportation' | 'incentive' | 'timing' | 'personal';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  distanceMiles: number;
  qualifications: string[];
  available: boolean;
  consented: boolean;
  score: number;
  status: CandidateStatus;
  channel: 'voice' | 'sms';
  barrier: Barrier;
  message: string;
}

export interface IncentivePolicy {
  autonomousLimitCents: number;
  managerLimitCents: number;
  rideCreditLimitCents: number;
}

export interface StaffingHole {
  id: string;
  organizationId: string;
  version: number;
  externalId: string;
  worksite: string;
  role: string;
  startsAt: string;
  endsAt: string;
  severity: 'critical' | 'high' | 'standard';
  status: HoleStatus;
  qualifications: string[];
  policy: IncentivePolicy;
  candidates: Candidate[];
  assignedCandidateId?: string;
  incentiveCents?: number;
  transportation?: string;
  eta?: string;
}

export interface DemoScenario {
  id: string;
  sector: 'Distribution' | 'Hospitality' | 'Food service' | 'Healthcare' | 'Public sector';
  organizationLabel: string;
  operationsLabel: string;
  headline: string;
  requiredLabel: string;
  escalationMinutes: number;
  winnerCandidateId: string;
  resolutionLabel: string;
  transportation: string;
  incentiveCents: number;
  eta: string;
  hole: StaffingHole;
  audit: AuditEvent[];
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: 'system' | 'ai' | 'manager' | 'worker';
  label: string;
  detail: string;
}

export interface AssignmentResult {
  ok: boolean;
  code: 'ASSIGNED' | 'HOLE_ALREADY_FILLED' | 'STALE_VERSION' | 'CANDIDATE_INELIGIBLE';
  hole: StaffingHole;
}
