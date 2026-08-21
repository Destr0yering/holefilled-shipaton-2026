create extension if not exists pgcrypto;

create type public.hole_status as enum ('open','contacting','approval_needed','filled','unfilled','cancelled');
create type public.offer_status as enum ('pending','contacting','negotiating','accepted','declined','expired','closed');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  phone_e164 text,
  created_at timestamptz not null default now()
);

create table public.memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner','admin','manager','worker')),
  status text not null default 'active',
  primary key (organization_id,user_id,role)
);

create table public.worksites (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  id uuid not null default gen_random_uuid(),
  name text not null,
  timezone text not null,
  external_provider text,
  external_id text,
  primary key (organization_id,id),
  unique (organization_id,external_provider,external_id)
);

create table public.worker_eligibility (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  worksite_id uuid not null,
  role_code text not null,
  qualification_codes text[] not null default '{}',
  available_from timestamptz,
  available_until timestamptz,
  outreach_consented boolean not null default false,
  primary key (organization_id,worker_id,worksite_id,role_code),
  foreign key (organization_id,worksite_id) references public.worksites(organization_id,id)
);

create table public.staffing_holes (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  id uuid not null default gen_random_uuid(),
  external_provider text not null,
  external_id text not null,
  idempotency_key text not null,
  worksite_id uuid not null,
  role_code text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  severity text not null check (severity in ('standard','high','critical')),
  required_qualifications text[] not null default '{}',
  status public.hole_status not null default 'open',
  version integer not null default 1,
  auto_incentive_limit_cents integer not null default 0,
  manager_incentive_limit_cents integer not null default 0,
  ride_credit_limit_cents integer not null default 0,
  assigned_worker_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  primary key (organization_id,id),
  foreign key (organization_id,worksite_id) references public.worksites(organization_id,id),
  unique (organization_id,idempotency_key),
  unique (organization_id,external_provider,external_id),
  check (ends_at > starts_at)
);

create table public.shift_offers (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  id uuid not null default gen_random_uuid(),
  hole_id uuid not null,
  worker_id uuid not null references public.profiles(id),
  hole_version integer not null,
  policy_version integer not null default 1,
  status public.offer_status not null default 'pending',
  channel text not null check (channel in ('voice','sms','push')),
  barrier_code text,
  incentive_cents integer not null default 0,
  transportation_type text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  primary key (organization_id,id),
  foreign key (organization_id,hole_id) references public.staffing_holes(organization_id,id),
  unique (organization_id,hole_id,worker_id)
);

create table public.assignments (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  id uuid not null default gen_random_uuid(),
  hole_id uuid not null,
  offer_id uuid not null,
  worker_id uuid not null references public.profiles(id),
  accepted_at timestamptz not null default now(),
  eta timestamptz,
  primary key (organization_id,id),
  foreign key (organization_id,hole_id) references public.staffing_holes(organization_id,id),
  foreign key (organization_id,offer_id) references public.shift_offers(organization_id,id),
  unique (organization_id,hole_id)
);

create table public.approval_requests (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  id uuid not null default gen_random_uuid(),
  hole_id uuid not null,
  offer_id uuid not null,
  requested_cents integer not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','expired')),
  decided_by uuid references public.profiles(id),
  decided_at timestamptz,
  primary key (organization_id,id),
  foreign key (organization_id,hole_id) references public.staffing_holes(organization_id,id),
  foreign key (organization_id,offer_id) references public.shift_offers(organization_id,id)
);

create table public.audit_events (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  id uuid not null default gen_random_uuid(),
  aggregate_type text not null,
  aggregate_id uuid not null,
  aggregate_version integer,
  actor_type text not null,
  event_type text not null,
  event_version integer not null default 1,
  detail jsonb not null default '{}',
  correlation_id uuid,
  created_at timestamptz not null default now(),
  primary key (organization_id,id)
);

create table public.outbox_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  event_type text not null,
  event_version integer not null default 1,
  aggregate_id uuid not null,
  aggregate_version integer not null,
  payload jsonb not null,
  dedupe_key text not null unique,
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  processed_at timestamptz,
  dead_lettered_at timestamptz
);

create table public.provider_events (
  provider text not null,
  provider_event_id text not null,
  payload_hash text not null,
  status text not null default 'received',
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error_code text,
  primary key (provider,provider_event_id)
);

create table public.access_grants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  capability text not null,
  source_provider text not null,
  source_reference text not null,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  unique (source_provider,source_reference,capability)
);

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.worksites enable row level security;
alter table public.worker_eligibility enable row level security;
alter table public.staffing_holes enable row level security;
alter table public.shift_offers enable row level security;
alter table public.assignments enable row level security;
alter table public.approval_requests enable row level security;
alter table public.audit_events enable row level security;
alter table public.access_grants enable row level security;

create or replace function public.is_member(target_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.memberships m where m.organization_id=target_org and m.user_id=auth.uid() and m.status='active');
$$;

create policy "members read organizations" on public.organizations for select using (public.is_member(id));
create policy "members read memberships" on public.memberships for select using (public.is_member(organization_id));
create policy "members read worksites" on public.worksites for select using (public.is_member(organization_id));
create policy "members read eligibility" on public.worker_eligibility for select using (public.is_member(organization_id));
create policy "members read holes" on public.staffing_holes for select using (public.is_member(organization_id));
create policy "members read offers" on public.shift_offers for select using (public.is_member(organization_id));
create policy "members read assignments" on public.assignments for select using (public.is_member(organization_id));
create policy "members read approvals" on public.approval_requests for select using (public.is_member(organization_id));
create policy "members read audit" on public.audit_events for select using (public.is_member(organization_id));
create policy "members read access" on public.access_grants for select using (public.is_member(organization_id) or user_id=auth.uid());

comment on table public.staffing_holes is 'Tenant-scoped staffing incident; authoritative state transitions execute through privileged commands.';
comment on table public.outbox_events is 'Durable at-least-once delivery source. Workers claim with FOR UPDATE SKIP LOCKED.';

