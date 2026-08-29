-- Run after creating the administrator in Authentication → Users.
create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  must_change_password boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

drop policy if exists "Admins can read their own profile" on public.admin_profiles;
create policy "Admins can read their own profile"
on public.admin_profiles for select to authenticated
using ((select auth.uid()) = user_id and (select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can update their own profile" on public.admin_profiles;
create policy "Admins can update their own profile"
on public.admin_profiles for update to authenticated
using ((select auth.uid()) = user_id and (select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.uid()) = user_id and (select auth.jwt()->'app_metadata'->>'role') = 'admin');

grant select, update on public.admin_profiles to authenticated;

-- Assign the administrator role and require a password change on first login.
with admin_user as (
  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
  where email = 'pulga.mendia@gmail.com'
  returning id
)
insert into public.admin_profiles (user_id, must_change_password)
select id, true from admin_user
on conflict (user_id) do update set must_change_password = true;
