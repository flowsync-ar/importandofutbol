-- Pegá TODO este archivo en:
-- https://supabase.com/dashboard/project/mrqgpgielwqbtcqbrwwc/sql/new
-- y tocá RUN.
-- Ese es el mismo proyecto de la tienda (mrqgpgielwqbtcqbrwwc).

alter table public.products add column if not exists featured boolean not null default false;
alter table public.products add column if not exists featured_title text;

create table if not exists public.size_guide_rows (
  id uuid primary key default gen_random_uuid(),
  size text not null unique,
  chest text not null,
  length text not null,
  height text not null,
  sort_order integer not null default 0
);

alter table public.size_guide_rows enable row level security;

drop policy if exists "Public can read size guide" on public.size_guide_rows;
create policy "Public can read size guide"
on public.size_guide_rows for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert size guide" on public.size_guide_rows;
create policy "Admins can insert size guide"
on public.size_guide_rows for insert
to authenticated
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can update size guide" on public.size_guide_rows;
create policy "Admins can update size guide"
on public.size_guide_rows for update
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can delete size guide" on public.size_guide_rows;
create policy "Admins can delete size guide"
on public.size_guide_rows for delete
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

grant select on public.size_guide_rows to anon, authenticated;
grant insert, update, delete on public.size_guide_rows to authenticated;

insert into public.size_guide_rows (size, chest, length, height, sort_order)
values
  ('S', '50–52', '69–71', '160–170', 1),
  ('M', '53–55', '71–73', '168–176', 2),
  ('L', '56–58', '73–76', '174–182', 3),
  ('XL', '59–61', '76–79', '180–188', 4),
  ('XXL', '62–64', '79–82', '186–194', 5)
on conflict (size) do nothing;
