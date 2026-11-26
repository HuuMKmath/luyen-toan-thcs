-- Danh xưng của mã giáo viên ("thầy" hoặc "cô") để trang Các bài chào "Chào thầy, …" / "Chào cô, …".
-- Chạy MỘT LẦN trong SQL Editor của Supabase. Học sinh để trống; mã GV chưa ghi thì trang chào "Chào thầy cô, …".
alter table public.hoc_sinh add column if not exists danh_xung text
  check (danh_xung is null or danh_xung in ('thầy', 'cô'));
comment on column public.hoc_sinh.danh_xung is 'Chỉ dùng cho mã giáo viên (lớp GV): thầy hoặc cô. Học sinh để trống.';
