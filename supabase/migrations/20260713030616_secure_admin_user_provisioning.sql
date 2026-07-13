-- Public sign-up may only create learner or parent accounts. Privileged roles
-- are assigned after an authenticated admin provisions the user server-side.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
  selected_role public.app_role;
  selected_name text := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'name', ''),
    split_part(new.email, '@', 1),
    'IATECH Builder user'
  );
begin
  selected_role := case
    when requested_role = 'parent' then 'parent'::public.app_role
    else 'student'::public.app_role
  end;

  insert into public.profiles (id, role, full_name, display_name)
  values (new.id, selected_role, selected_name, selected_name)
  on conflict (id) do update set
    role = excluded.role,
    full_name = excluded.full_name,
    display_name = excluded.display_name,
    updated_at = now();

  if selected_role = 'student' then
    insert into public.students (profile_id) values (new.id)
    on conflict (profile_id) do nothing;
  else
    insert into public.parents (profile_id) values (new.id)
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$;

revoke execute on function public.handle_new_auth_user() from public, anon, authenticated;
