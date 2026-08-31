-- Categories managed from the admin panel.
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories"
on public.categories for insert
to authenticated
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can update categories" on public.categories;
create policy "Admins can update categories"
on public.categories for update
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can delete categories" on public.categories;
create policy "Admins can delete categories"
on public.categories for delete
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

insert into public.categories (name, slug, sort_order)
values
  ('Selecciones', 'selecciones', 1),
  ('Clubes', 'clubes', 2),
  ('Retro', 'retro', 3)
on conflict (slug) do nothing;

do $$
declare constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    where con.conrelid = 'public.products'::regclass
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%category%'
  loop
    execute format('alter table public.products drop constraint %I', constraint_name);
  end loop;
end $$;
