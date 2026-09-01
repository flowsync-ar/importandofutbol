-- Run after creating the extra admin in Authentication → Users.
-- Replace the email, then ask that person to log in at /admin/login.
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'otro@correo.com';

insert into public.admin_profiles (user_id, must_change_password)
select id, true from auth.users where email = 'otro@correo.com'
on conflict (user_id) do nothing;
