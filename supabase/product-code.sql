-- Pegá TODO este archivo en el SQL Editor de Supabase y tocá RUN.
-- Asigna un código automático a cada producto: IF-0001, IF-0002, …

create sequence if not exists public.product_code_seq;

alter table public.products add column if not exists code text;

do $$
declare
  max_n int;
begin
  select coalesce(max((regexp_match(coalesce(code, ''), '([0-9]+)$'))[1]::int), 0)
  into max_n
  from public.products;
  perform setval('public.product_code_seq', greatest(max_n, 1), max_n > 0);
  update public.products
  set code = 'IF-' || lpad(nextval('public.product_code_seq')::text, 4, '0')
  where code is null or btrim(code) = '';
end $$;

alter table public.products alter column code set default ('IF-' || lpad(nextval('public.product_code_seq')::text, 4, '0'));

create unique index if not exists products_code_uidx on public.products (code);

grant usage, select on sequence public.product_code_seq to authenticated;

notify pgrst, 'reload schema';
