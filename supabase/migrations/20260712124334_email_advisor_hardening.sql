create index email_delivery_events_outbox_idx
  on public.email_delivery_events(outbox_id)
  where outbox_id is not null;

create policy "clients cannot access email outbox"
on public.email_outbox for all to anon, authenticated
using (false)
with check (false);

create policy "clients cannot access email delivery events"
on public.email_delivery_events for all to anon, authenticated
using (false)
with check (false);
