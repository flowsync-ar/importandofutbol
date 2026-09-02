-- Run this once in Supabase Dashboard → SQL Editor.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  team text not null,
  price numeric(12,2) check (price is null or price >= 0),
  sizes text[] not null default '{}',
  badge text,
  image_url text,
  image_urls text[] not null default '{}',
  featured boolean not null default false,
  featured_title text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Public can read active products"
on public.products for select
to anon, authenticated
using (active = true or (select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "Admins can insert products"
on public.products for insert
to authenticated
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "Admins can update products"
on public.products for update
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "Admins can delete products"
on public.products for delete
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

-- Categories: also run supabase/categories.sql
-- Customers: also run supabase/customers.sql
-- Contacts: also run supabase/contacts.sql
-- Ads: also run supabase/ads.sql

-- Product highlights: also run supabase/featured.sql
-- Extra admin users: also run supabase/add-admin.sql
-- Product images: also run supabase/storage.sql to create the public bucket and upload policies.

-- After creating the admin user in Authentication → Users, replace the email:
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'admin@example.com';
