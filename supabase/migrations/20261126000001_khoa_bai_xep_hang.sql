-- Nền mới – buổi 4: khóa bài theo thứ tự, xếp hạng XP cho trang web học sinh.
-- Chạy MỘT lần trong SQL Editor của Supabase (sau hai tệp 20261124…). Chạy lại cũng không lỗi.

-- Gói Nhận biết / Thông hiểu / Vận dụng học sinh đã làm hết câu (thay trang tính "Gói đã xong")
create table if not exists public.goi_xong (
  hoc_sinh_id uuid not null references public.hoc_sinh (id) on delete cascade,
  bai_id      text not null references public.bai_hoc (id) on delete cascade,
  goi         text not null check (goi in ('NB', 'TH', 'VD')),
  luc         timestamptz not null default now(),
  primary key (hoc_sinh_id, bai_id, goi)
);

-- Giáo viên mở bài cho học sinh chưa đạt điều kiện (thay trang tính "Mở bài").
-- pham_vi: tên lớp (7A), số khối (7) hoặc 'Tất cả'.
create table if not exists public.mo_bai (
  id      bigint generated always as identity primary key,
  pham_vi text not null,
  bai_id  text not null references public.bai_hoc (id) on delete cascade,
  mo      boolean not null default true,
  ghi_chu text not null default '',
  tao_luc timestamptz not null default now()
);

alter table public.goi_xong enable row level security;
alter table public.mo_bai   enable row level security;
drop policy if exists goi_xong_xem on public.goi_xong;
create policy goi_xong_xem on public.goi_xong for select to authenticated
  using (public.gv_day_hoc_sinh(hoc_sinh_id) or public.la_quan_tri());
drop policy if exists mo_bai_gv on public.mo_bai;
create policy mo_bai_gv on public.mo_bai for all to authenticated
  using (public.la_gv_da_duyet()) with check (public.la_gv_da_duyet());

revoke all on public.goi_xong, public.mo_bai from anon;
grant all on public.goi_xong, public.mo_bai to service_role;
grant select on public.goi_xong to authenticated;
grant select, insert, update, delete on public.mo_bai to authenticated;

-- Danh sách xếp hạng XP: mỗi học sinh MỘT dòng cho mỗi khối em học (bỏ lớp GV).
-- Chỉ hàm máy chủ gọi được; hàm máy chủ tự rút gọn tên trước khi gửi cho học sinh.
create or replace function public.ds_xep_hang(p_khoi smallint default null)
returns table (hoc_sinh_id uuid, ma_hs text, ho_ten text, khoi smallint, cac_lop text[], xp integer, xp_tuan integer, tuan date)
language sql stable security definer set search_path = public as $$
  select hs.id, hs.ma_hs, hs.ho_ten, l.khoi,
         array_agg(l.ten order by lh.thu_tu, l.ten),
         coalesce(th.xp, 0), coalesce(th.xp_tuan, 0), th.tuan
  from public.hoc_sinh hs
  join public.lop_hoc_sinh lh on lh.hoc_sinh_id = hs.id
  join public.lop l on l.id = lh.lop_id and l.loai <> 'gv' and l.dang_dung
  left join public.thuong th on th.hoc_sinh_id = hs.id
  where hs.dang_hoc and l.khoi is not null and (p_khoi is null or l.khoi = p_khoi)
  group by hs.id, hs.ma_hs, hs.ho_ten, l.khoi, th.xp, th.xp_tuan, th.tuan;
$$;
revoke execute on function public.ds_xep_hang(smallint) from public, anon, authenticated;
grant execute on function public.ds_xep_hang(smallint) to service_role;
