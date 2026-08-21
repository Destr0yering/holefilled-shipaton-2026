import { AuditEvent, StaffingHole } from './domain/models';

export const initialHole: StaffingHole = {
  id: 'hole-demo-001',
  organizationId: 'org-atlantic-distribution',
  version: 1,
  externalId: 'UKG-DEMO-8841',
  worksite: 'Atlantic Distribution Center',
  role: 'Forklift Operator — Night Shift',
  startsAt: 'Tonight, 10:00 PM',
  endsAt: 'Tomorrow, 6:00 AM',
  severity: 'critical',
  status: 'open',
  qualifications: ['forklift-certified', 'night-shift'],
  policy: { autonomousLimitCents: 2500, managerLimitCents: 7500, rideCreditLimitCents: 4000 },
  candidates: [
    { id: 'maya', name: 'Maya R.', role: 'Forklift Operator', distanceMiles: 7.2, qualifications: ['forklift-certified', 'night-shift'], available: true, consented: true, score: 96, status: 'ready', channel: 'voice', barrier: 'transportation', message: 'Available, but my car is in the shop.' },
    { id: 'carlos', name: 'Carlos D.', role: 'Forklift Operator', distanceMiles: 11.8, qualifications: ['forklift-certified', 'night-shift'], available: true, consented: true, score: 89, status: 'ready', channel: 'sms', barrier: 'personal', message: 'I cannot cover tonight.' },
    { id: 'jordan', name: 'Jordan K.', role: 'Warehouse Associate', distanceMiles: 4.4, qualifications: ['forklift-certified', 'night-shift'], available: true, consented: true, score: 84, status: 'ready', channel: 'voice', barrier: 'incentive', message: 'Could you add a shift premium?' },
  ],
};

export const initialAudit: AuditEvent[] = [
  { id: 'a1', at: '8:41 PM', actor: 'system', label: 'Hole detected', detail: 'Schedule event UKG-DEMO-8841 created a critical coverage incident.' },
  { id: 'a2', at: '8:41 PM', actor: 'system', label: 'Eligibility evaluated', detail: '3 of 14 internal coworkers passed worksite, certification, availability, and consent rules.' },
];

