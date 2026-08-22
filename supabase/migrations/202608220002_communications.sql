create type public.communication_channel as enum ('sms','voice');
create type public.communication_state as enum ('queued','sent','delivered','in_progress','responded','failed','closed');

create table public.outreach_waves (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  hole_id uuid not null,
  max_parallel smallint not null default 5 check (max_parallel between 1 and 10),
  created_at timestamptz not null default now(),
  unique (organization_id,id),
  foreign key (organization_id,hole_id) references public.staffing_holes(organization_id,id)
);

create table public.communication_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  wave_id uuid not null,
  offer_id uuid not null,
  channel public.communication_channel not null,
  state public.communication_state not null default 'queued',
  provider text not null,
  provider_reference text,
  destination_ciphertext text not null,
  idempotency_key text not null,
  last_classification jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id,idempotency_key),
  unique (provider,provider_reference),
  foreign key (organization_id,wave_id) references public.outreach_waves(organization_id,id),
  foreign key (organization_id,offer_id) references public.shift_offers(organization_id,id)
);

alter table public.outreach_waves enable row level security;
alter table public.communication_sessions enable row level security;

create policy "members read outreach waves" on public.outreach_waves for select using (public.is_member(organization_id));
create policy "members read communication sessions" on public.communication_sessions for select using (public.is_member(organization_id));

comment on column public.communication_sessions.destination_ciphertext is 'Encrypted phone destination; never expose through client projections.';
comment on column public.communication_sessions.last_classification is 'Validated structured classification only; raw audio and unrestricted model reasoning are not stored.';

