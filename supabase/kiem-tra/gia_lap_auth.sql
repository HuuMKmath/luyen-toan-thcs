-- Giả lập phần auth của Supabase để chạy thử trên Postgres thường (KHÔNG chạy trên Supabase thật).
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
create schema auth;
create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create function auth.role() returns text language sql stable as $$ select nullif(current_setting('request.jwt.claim.role', true), '') $$;
grant usage on schema auth to anon, authenticated, service_role;
-- Giống dự án Supabase tạo với ô "Grant API access to new tables automatically" TẮT: không tự cấp quyền bảng mới.
alter default privileges in schema public revoke execute on functions from public;
grant execute on all functions in schema auth to anon, authenticated, service_role;
