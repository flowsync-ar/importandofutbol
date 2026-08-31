-- Customer directory for the admin panel. Not public.
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists customers_created_at_idx on public.customers (created_at desc);

alter table public.customers enable row level security;

drop policy if exists "Admins can read customers" on public.customers;
create policy "Admins can read customers"
on public.customers for select
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can insert customers" on public.customers;
create policy "Admins can insert customers"
on public.customers for insert
to authenticated
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can update customers" on public.customers;
create policy "Admins can update customers"
on public.customers for update
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can delete customers" on public.customers;
create policy "Admins can delete customers"
on public.customers for delete
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

grant select, insert, update, delete on public.customers to authenticated;
