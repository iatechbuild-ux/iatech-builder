create type public.email_delivery_status as enum ('pending', 'processing', 'sent', 'failed', 'cancelled');

create table public.email_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  reminders_enabled boolean not null default true,
  weekly_summary_enabled boolean not null default true,
  inactivity_reminders_enabled boolean not null default true,
  timezone text not null default 'Africa/Lagos',
  updated_at timestamptz not null default now()
);

create table public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.profiles(id) on delete set null,
  recipient_email text,
  recipient_name text,
  event_type text not null,
  template_key text not null,
  payload jsonb not null default '{}'::jsonb,
  dedupe_key text not null unique,
  status public.email_delivery_status not null default 'pending',
  attempts integer not null default 0 check (attempts between 0 and 10),
  scheduled_at timestamptz not null default now(),
  locked_at timestamptz,
  provider_message_id text,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (recipient_id is not null or recipient_email is not null)
);

create table public.email_delivery_events (
  id bigint generated always as identity primary key,
  outbox_id uuid references public.email_outbox(id) on delete set null,
  provider_message_id text,
  event_type text not null,
  recipient_email text,
  occurred_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index email_outbox_due_idx
  on public.email_outbox(status, scheduled_at)
  where status in ('pending', 'failed');
create index email_outbox_recipient_idx on public.email_outbox(recipient_id, created_at desc);
create index email_delivery_events_message_idx on public.email_delivery_events(provider_message_id, occurred_at desc);

alter table public.email_preferences enable row level security;
alter table public.email_outbox enable row level security;
alter table public.email_delivery_events enable row level security;

create policy "users read own email preferences"
on public.email_preferences for select to authenticated
using ((select auth.uid()) = user_id);

create policy "users update own email preferences"
on public.email_preferences for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select, update on public.email_preferences to authenticated;
revoke all on public.email_outbox, public.email_delivery_events from anon, authenticated;

insert into public.email_preferences (user_id)
select id from public.profiles
on conflict (user_id) do nothing;

create or replace function public.create_email_preferences_for_profile()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.email_preferences (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger create_profile_email_preferences
after insert on public.profiles
for each row execute function public.create_email_preferences_for_profile();

revoke execute on function public.create_email_preferences_for_profile() from public, anon, authenticated;
