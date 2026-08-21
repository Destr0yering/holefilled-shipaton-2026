import { AuditEvent, DemoScenario, StaffingHole } from './domain/models';

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

const scenario = (
  config: Omit<DemoScenario, 'hole' | 'audit'> & { externalId: string; worksite: string; role: string; startsAt: string; endsAt: string; qualifications: string[]; candidates: StaffingHole['candidates']; policy: StaffingHole['policy'] },
): DemoScenario => ({
  id: config.id,
  sector: config.sector,
  organizationLabel: config.organizationLabel,
  operationsLabel: config.operationsLabel,
  headline: config.headline,
  requiredLabel: config.requiredLabel,
  escalationMinutes: config.escalationMinutes,
  winnerCandidateId: config.winnerCandidateId,
  resolutionLabel: config.resolutionLabel,
  transportation: config.transportation,
  incentiveCents: config.incentiveCents,
  eta: config.eta,
  hole: {
    id: `hole-${config.id}`,
    organizationId: `org-${config.id}`,
    version: 1,
    externalId: config.externalId,
    worksite: config.worksite,
    role: config.role,
    startsAt: config.startsAt,
    endsAt: config.endsAt,
    severity: 'critical',
    status: 'open',
    qualifications: config.qualifications,
    policy: config.policy,
    candidates: config.candidates,
  },
  audit: [
    { id: `${config.id}-a1`, at: 'Now', actor: 'system', label: 'Hole detected', detail: `${config.externalId} created a critical coverage incident.` },
    { id: `${config.id}-a2`, at: 'Now', actor: 'system', label: 'Eligibility evaluated', detail: `3 internal coworkers passed employer-defined role, qualification, availability, conflict, and consent rules.` },
  ],
});

export const demoScenarios: DemoScenario[] = [
  scenario({ id:'warehouse', sector:'Distribution', organizationLabel:'Atlantic Distribution', operationsLabel:'Night operations', headline:'A certified warehouse shift needs immediate coverage.', requiredLabel:'Forklift certification', escalationMinutes:47, winnerCandidateId:'maya', resolutionLabel:'Offer Maya transportation and fill shift', transportation:'Got2Get2Work pickup + $20 ride credit', incentiveCents:2000, eta:'9:34 PM', externalId:'UKG-DEMO-8841', worksite:'Atlantic Distribution Center', role:'Forklift Operator — Night Shift', startsAt:'Tonight, 10:00 PM', endsAt:'Tomorrow, 6:00 AM', qualifications:['forklift-certified','night-shift'], policy:{autonomousLimitCents:2500,managerLimitCents:7500,rideCreditLimitCents:4000}, candidates:initialHole.candidates }),
  scenario({ id:'server', sector:'Hospitality', organizationLabel:'Harborview Hotel', operationsLabel:'Banquet operations', headline:'A sold-out banquet service needs one more server.', requiredLabel:'Alcohol-service training', escalationMinutes:62, winnerCandidateId:'nia', resolutionLabel:'Offer Nia a ride credit and fill shift', transportation:'Employer rideshare credit', incentiveCents:1500, eta:'4:42 PM', externalId:'UKG-DEMO-2194', worksite:'Harborview Grand Ballroom', role:'Banquet Server — Dinner Service', startsAt:'Today, 5:00 PM', endsAt:'Today, 11:30 PM', qualifications:['banquet-service','alcohol-service'], policy:{autonomousLimitCents:2000,managerLimitCents:6000,rideCreditLimitCents:3000}, candidates:[
    {id:'nia',name:'Nia P.',role:'Banquet Server',distanceMiles:6.1,qualifications:['banquet-service','alcohol-service'],available:true,consented:true,score:95,status:'ready',channel:'sms',barrier:'transportation',message:'I can cover if I can get downtown in time.'},
    {id:'owen',name:'Owen L.',role:'Restaurant Server',distanceMiles:3.8,qualifications:['banquet-service','alcohol-service'],available:true,consented:true,score:91,status:'ready',channel:'voice',barrier:'personal',message:'I already have a family commitment.'},
    {id:'tasha',name:'Tasha B.',role:'Banquet Server',distanceMiles:9.2,qualifications:['banquet-service','alcohol-service'],available:true,consented:true,score:87,status:'ready',channel:'sms',barrier:'incentive',message:'Is there a same-day premium for this event?'},
  ]}),
  scenario({ id:'cook', sector:'Food service', organizationLabel:'Metro Table Group', operationsLabel:'Kitchen operations', headline:'Dinner prep is at risk without a qualified line cook.', requiredLabel:'Food-handler certification', escalationMinutes:38, winnerCandidateId:'devon', resolutionLabel:'Offer Devon parking support and fill shift', transportation:'Shared parking + fuel credit', incentiveCents:2000, eta:'3:48 PM', externalId:'UKG-DEMO-5307', worksite:'Metro Table — Riverside', role:'Line Cook — Dinner Shift', startsAt:'Today, 4:00 PM', endsAt:'Tonight, 11:00 PM', qualifications:['food-handler','line-cook'], policy:{autonomousLimitCents:2500,managerLimitCents:5000,rideCreditLimitCents:2500}, candidates:[
    {id:'devon',name:'Devon S.',role:'Line Cook',distanceMiles:8.4,qualifications:['food-handler','line-cook'],available:true,consented:true,score:97,status:'ready',channel:'voice',barrier:'transportation',message:'I can work, but parking and fuel make the short shift tough.'},
    {id:'mei',name:'Mei C.',role:'Prep Cook',distanceMiles:2.7,qualifications:['food-handler','line-cook'],available:true,consented:true,score:88,status:'ready',channel:'sms',barrier:'timing',message:'I cannot arrive until 5:00.'},
    {id:'rafael',name:'Rafael G.',role:'Line Cook',distanceMiles:5.3,qualifications:['food-handler','line-cook'],available:true,consented:true,score:85,status:'ready',channel:'voice',barrier:'incentive',message:'Can the emergency shift include a premium?'},
  ]}),
  scenario({ id:'nurse', sector:'Healthcare', organizationLabel:'Northstar Health Network', operationsLabel:'Clinical staffing office', headline:'A licensed medical-surgical shift is approaching escalation.', requiredLabel:'Active RN + unit competency', escalationMinutes:74, winnerCandidateId:'elena', resolutionLabel:'Offer Elena approved transport and fill shift', transportation:'Employer-arranged ride credit', incentiveCents:3000, eta:'6:36 PM', externalId:'UKG-DEMO-7718', worksite:'Northstar Medical Center — 4 West', role:'Registered Nurse — Med/Surg', startsAt:'Today, 7:00 PM', endsAt:'Tomorrow, 7:00 AM', qualifications:['active-rn','med-surg-competency'], policy:{autonomousLimitCents:3500,managerLimitCents:10000,rideCreditLimitCents:5000}, candidates:[
    {id:'elena',name:'Elena V.',role:'Registered Nurse',distanceMiles:12.1,qualifications:['active-rn','med-surg-competency'],available:true,consented:true,score:98,status:'ready',channel:'sms',barrier:'transportation',message:'I am rested and available, but my vehicle will not start.'},
    {id:'marcus',name:'Marcus H.',role:'Registered Nurse',distanceMiles:7.5,qualifications:['active-rn','med-surg-competency'],available:true,consented:true,score:92,status:'ready',channel:'voice',barrier:'personal',message:'I cannot safely take an additional shift tonight.'},
    {id:'priya',name:'Priya N.',role:'Float Pool RN',distanceMiles:10.3,qualifications:['active-rn','med-surg-competency'],available:true,consented:true,score:90,status:'ready',channel:'sms',barrier:'incentive',message:'Does this qualify for the critical-coverage differential?'},
  ]}),
  scenario({ id:'crossing-guard', sector:'Public sector', organizationLabel:'Lakeside Public Schools', operationsLabel:'Student safety operations', headline:'A school crossing post must be covered before arrival.', requiredLabel:'Board-authorized crossing guard', escalationMinutes:29, winnerCandidateId:'samuel', resolutionLabel:'Arrange Samuel’s district shuttle and fill shift', transportation:'District operations shuttle', incentiveCents:0, eta:'7:18 AM', externalId:'UKG-DEMO-4062', worksite:'Lakeside Elementary — East Crossing', role:'Crossing Guard — Morning Arrival', startsAt:'Tomorrow, 7:30 AM', endsAt:'Tomorrow, 9:00 AM', qualifications:['board-authorized','crossing-guard-trained'], policy:{autonomousLimitCents:1000,managerLimitCents:3000,rideCreditLimitCents:2000}, candidates:[
    {id:'samuel',name:'Samuel T.',role:'Crossing Guard',distanceMiles:5.6,qualifications:['board-authorized','crossing-guard-trained'],available:true,consented:true,score:96,status:'ready',channel:'voice',barrier:'transportation',message:'I am available if district operations can get me to the post.'},
    {id:'aisha',name:'Aisha W.',role:'Crossing Guard',distanceMiles:2.2,qualifications:['board-authorized','crossing-guard-trained'],available:true,consented:true,score:93,status:'ready',channel:'sms',barrier:'timing',message:'I am assigned to another post until 7:45.'},
    {id:'lee',name:'Lee M.',role:'Substitute Crossing Guard',distanceMiles:4.1,qualifications:['board-authorized','crossing-guard-trained'],available:true,consented:true,score:89,status:'ready',channel:'sms',barrier:'personal',message:'I am not available tomorrow morning.'},
  ]}),
];
