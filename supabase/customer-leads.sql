-- Pegá TODO este archivo en el SQL Editor y tocá RUN.
-- Deja que las consultas de WhatsApp se guarden solas en Clientes.

grant insert on public.customers to anon;

drop policy if exists "Public can leave consult leads" on public.customers;
create policy "Public can leave consult leads"
on public.customers for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 2 and 80
  and phone is not null
  and char_length(phone) between 8 and 15
  and email is null
  and char_length(coalesce(notes, '')) <= 500
);

create unique index if not exists customers_phone_unique on public.customers (phone);
