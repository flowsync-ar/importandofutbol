-- Pegá TODO este archivo en el SQL Editor y tocá RUN.
-- Dos espacios de publicidad editables desde el admin.

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  slot text not null unique,
  title text not null default '',
  description text not null default '',
  href text not null default '',
  image_url text,
  active boolean not null default false
);

alter table public.ads enable row level security;

drop policy if exists "Public can read ads" on public.ads;
create policy "Public can read ads"
on public.ads for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert ads" on public.ads;
create policy "Admins can insert ads"
on public.ads for insert
to authenticated
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can update ads" on public.ads;
create policy "Admins can update ads"
on public.ads for update
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can delete ads" on public.ads;
create policy "Admins can delete ads"
on public.ads for delete
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

grant select on public.ads to anon, authenticated;
grant insert, update, delete on public.ads to authenticated;

insert into public.ads (slot, title, description, href, active)
values
  ('home', '', '', '', false),
  ('catalog', '', '', '', false)
on conflict (slot) do nothing;
