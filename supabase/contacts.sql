-- Pegá TODO este archivo en el SQL Editor y tocá RUN.
-- Contactos editables desde el admin (WhatsApp, Instagram, TikTok, etc).

create table if not exists public.contact_channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  value text not null,
  button_label text not null,
  href text,
  sort_order integer not null default 0
);

alter table public.contact_channels enable row level security;

drop policy if exists "Public can read contacts" on public.contact_channels;
create policy "Public can read contacts"
on public.contact_channels for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert contacts" on public.contact_channels;
create policy "Admins can insert contacts"
on public.contact_channels for insert
to authenticated
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can update contacts" on public.contact_channels;
create policy "Admins can update contacts"
on public.contact_channels for update
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

drop policy if exists "Admins can delete contacts" on public.contact_channels;
create policy "Admins can delete contacts"
on public.contact_channels for delete
to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

grant select on public.contact_channels to anon, authenticated;
grant insert, update, delete on public.contact_channels to authenticated;

insert into public.contact_channels (name, value, button_label, href, sort_order)
select seed.name, seed.value, seed.button_label, seed.href, seed.sort_order
from (values
  ('WhatsApp', '+54 9 2954 82-7189', 'Escribir por WhatsApp', null::text, 1),
  ('Instagram', '@Importandofutbol.lp', 'Abrir Instagram', 'https://instagram.com/Importandofutbol.lp', 2)
) as seed(name, value, button_label, href, sort_order)
where not exists (select 1 from public.contact_channels);
