-- =====================================================================
-- LUYỆN TOÁN THCS – CƠ SỞ DỮ LIỆU NỀN MỚI (Bước 1)
-- Chạy một lần trên dự án Supabase trống (SQL Editor → dán → Run).
-- Thiết kế: tài liệu "Thiết kế Bước 1–2: Nền móng mới và tài khoản giáo viên".
--
-- Nguyên tắc phân quyền:
--   * Giáo viên đăng nhập bằng Supabase Auth (email/Google), phải được quản trị duyệt.
--   * Giáo viên chỉ đọc, sửa lớp và học sinh của chính mình.
--   * Học sinh KHÔNG đăng nhập Supabase Auth: các em nhập mã 6 số, hàm máy chủ kiểm tra
--     và cấp phiên riêng (làm ở buổi sau). Vì vậy học sinh không đọc thẳng bảng nào.
--   * Câu hỏi, đáp án, bộ sinh câu: KHÔNG ai đọc được qua API, chỉ hàm máy chủ (khóa service_role).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Giáo viên
-- ---------------------------------------------------------------------
create table public.giao_vien (
  id          uuid primary key references auth.users (id) on delete cascade,
  ho_ten      text not null default '',
  email       text not null default '',
  truong      text not null default '',
  trang_thai  text not null default 'cho_duyet' check (trang_thai in ('cho_duyet', 'da_duyet', 'tu_choi', 'tam_khoa')),
  la_quan_tri boolean not null default false,
  goi         text not null default 'mien_phi' check (goi in ('mien_phi', 'day_du')),
  tao_luc     timestamptz not null default now(),
  duyet_luc   timestamptz
);
comment on table public.giao_vien is 'Tài khoản giáo viên; mới đăng ký ở trạng thái cho_duyet, quản trị duyệt mới dùng được.';

-- Hàm kiểm tra quyền (security definer để dùng được trong chính sách mà không vòng lặp RLS)
create or replace function public.la_quan_tri() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.giao_vien where id = auth.uid() and la_quan_tri and trang_thai = 'da_duyet');
$$;

create or replace function public.la_gv_da_duyet() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.giao_vien where id = auth.uid() and trang_thai = 'da_duyet');
$$;

-- Tự tạo dòng giáo viên (chờ duyệt) khi có tài khoản đăng ký mới
create or replace function public.tao_giao_vien_moi() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.giao_vien (id, email, ho_ten)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger khi_co_tai_khoan_moi
  after insert on auth.users
  for each row execute function public.tao_giao_vien_moi();

-- Giáo viên tự sửa được họ tên, trường; trạng thái, quyền quản trị, gói chỉ quản trị đổi
create or replace function public.chan_tu_doi_quyen() returns trigger
language plpgsql security invoker set search_path = public as $$
begin
  -- Chỉ chặn khi người gọi là giáo viên đăng nhập qua API (vai trò authenticated) mà không phải quản trị.
  -- Chủ dự án chạy trong SQL Editor và hàm máy chủ (service_role) không bị chặn.
  if current_user = 'authenticated' and not public.la_quan_tri() then
    if new.trang_thai is distinct from old.trang_thai
       or new.la_quan_tri is distinct from old.la_quan_tri
       or new.goi is distinct from old.goi
       or new.duyet_luc is distinct from old.duyet_luc
       or new.email is distinct from old.email then
      raise exception 'Chỉ quản trị được đổi trạng thái, quyền hoặc gói của tài khoản giáo viên';
    end if;
  end if;
  if new.trang_thai = 'da_duyet' and old.trang_thai is distinct from 'da_duyet' then
    new.duyet_luc := now();
  end if;
  return new;
end $$;

create trigger giu_quyen_giao_vien
  before update on public.giao_vien
  for each row execute function public.chan_tu_doi_quyen();

-- ---------------------------------------------------------------------
-- Lớp, học sinh (một học sinh – một mã – có thể thuộc nhiều lớp)
-- ---------------------------------------------------------------------
create table public.lop (
  id           uuid primary key default gen_random_uuid(),
  giao_vien_id uuid not null references public.giao_vien (id) on delete cascade,
  ten          text not null,
  khoi         smallint check (khoi between 6 and 9),   -- để trống cho lớp GV
  nam_hoc      text not null default '2026-2027',
  loai         text not null default 'chinh_khoa' check (loai in ('chinh_khoa', 'hoc_them', 'gv')),
  dang_dung    boolean not null default true,
  tao_luc      timestamptz not null default now(),
  unique (giao_vien_id, nam_hoc, ten)
);

create table public.hoc_sinh (
  id         uuid primary key default gen_random_uuid(),
  ho_ten     text not null,
  ma_hs      text not null unique check (ma_hs ~ '^[0-9]{6}$'),
  goi        text not null default 'day_du' check (goi in ('mien_phi', 'day_du')),
  dang_hoc   boolean not null default true,
  tao_luc    timestamptz not null default now()
);
comment on column public.hoc_sinh.ma_hs is 'Mã 6 số học sinh dùng để đăng nhập. Chỉ giáo viên của lớp và hàm máy chủ đọc được.';

create table public.lop_hoc_sinh (
  lop_id      uuid not null references public.lop (id) on delete cascade,
  hoc_sinh_id uuid not null references public.hoc_sinh (id) on delete cascade,
  thu_tu      integer not null default 0,              -- thứ tự trong danh sách; nhỏ nhất = lớp chính của em
  them_luc    timestamptz not null default now(),
  primary key (lop_id, hoc_sinh_id)
);
create index on public.lop_hoc_sinh (hoc_sinh_id);

-- Giáo viên có dạy học sinh này không (qua bất kỳ lớp nào của mình)
create or replace function public.gv_day_hoc_sinh(p_hs uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.lop_hoc_sinh lh join public.lop l on l.id = lh.lop_id
    where lh.hoc_sinh_id = p_hs and l.giao_vien_id = auth.uid()
  );
$$;

create or replace function public.la_lop_cua_toi(p_lop uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.lop where id = p_lop and giao_vien_id = auth.uid());
$$;

-- Tạo mã HS 6 số ngẫu nhiên chưa trùng
create or replace function public.tao_ma_hs() returns text
language plpgsql volatile security definer set search_path = public as $$
declare m text;
begin
  loop
    m := lpad((floor(random() * 900000) + 100000)::int::text, 6, '0');
    exit when not exists (select 1 from public.hoc_sinh where ma_hs = m);
  end loop;
  return m;
end $$;
alter table public.hoc_sinh alter column ma_hs set default public.tao_ma_hs();

-- ---------------------------------------------------------------------
-- Bài học và ngân hàng câu hỏi
-- ---------------------------------------------------------------------
create table public.bai_hoc (
  id         text primary key,                 -- tên thư mục, ví dụ 'tap-hop'
  khoi       smallint not null check (khoi between 6 and 9),
  chuong     text not null default '',
  tieu_de    text not null,                    -- có số bài như SGK: 'Bài 1. Tập hợp'
  mo_ta      text not null default '',
  tien_to    text not null unique,             -- tiền tố mã kết quả cũ, ví dụ 'TH6-'
  tab_cu     text not null default '',         -- tên trang tính trong Google Sheet cũ
  dang       jsonb not null default '[]',      -- các dạng kiến thức: [{"k":"...","ten":"..."}]
  thu_tu     integer not null default 0,
  da_mo      boolean not null default true,
  tao_luc    timestamptz not null default now()
);

create table public.cau_hoi (
  id        text primary key,                  -- mã ổn định, ví dụ 'tap-hop/mc-012'
  bai_id    text not null references public.bai_hoc (id) on delete cascade,
  loai      text not null check (loai in ('mc', 'ds', 'tln')),        -- nhiều lựa chọn, đúng sai, trả lời ngắn
  muc_do    text not null check (muc_do in ('nb', 'th', 'vd')),       -- nhận biết, thông hiểu, vận dụng
  dang      text not null default '',
  goi       text[] not null default '{luyen_tap}',                    -- luyen_tap, thu_thach, thuc_te
  tinh_huong text,                                                    -- nhóm câu Toán thực tế dùng chung đề dẫn
  noi_dung  jsonb not null,                    -- đề, phương án, hình (không có đáp án)
  loi_giai  text not null default '',
  bo_sinh_id text,                             -- câu tự đổi số liệu: dùng bộ sinh nào
  dang_dung boolean not null default true,
  tao_luc   timestamptz not null default now()
);
create index on public.cau_hoi (bai_id, loai, muc_do);

create table public.dap_an (
  cau_hoi_id text primary key references public.cau_hoi (id) on delete cascade,
  dap_an     jsonb not null,
  cach_cham  jsonb not null default '{}'       -- ví dụ {"so": true, "dau_phay": true}
);

create table public.bo_sinh (
  id       text primary key,
  bai_id   text not null references public.bai_hoc (id) on delete cascade,
  dang     text not null default '',
  ma_nguon text not null                       -- hàm JavaScript sinh câu, chạy trên máy chủ
);

-- ---------------------------------------------------------------------
-- Mã đề, lượt làm, điểm thưởng
-- ---------------------------------------------------------------------
create table public.ma_de (
  ma           text primary key,
  giao_vien_id uuid references public.giao_vien (id) on delete set null,
  bai_id       text not null references public.bai_hoc (id) on delete cascade,
  loai         text not null check (loai in ('kt25', 'kt5', 'thu_thach')),
  hat_giong    bigint not null default (floor(random() * 2147483647))::bigint,
  lop_ids      uuid[] not null default '{}',   -- để trống = mọi lớp của giáo viên
  mo_luc       timestamptz not null default now(),
  dong_luc     timestamptz,
  tao_luc      timestamptz not null default now()
);

create table public.luot_lam (
  id            uuid primary key default gen_random_uuid(),
  hoc_sinh_id   uuid not null references public.hoc_sinh (id) on delete cascade,
  bai_id        text not null references public.bai_hoc (id) on delete cascade,
  loai          text not null check (loai in ('goi', 'kt25', 'kt5', 'thu_thach', 'thuc_te')),
  ten_goi       text not null default '',      -- với loai = 'goi': tên gói luyện tập
  ma_de         text references public.ma_de (ma) on delete set null,
  cau_phat      jsonb not null default '[]',   -- các câu đã phát (kèm số liệu đã sinh)
  bai_lam       jsonb,
  diem          numeric(4, 2),
  diem_phan     jsonb,                         -- {"mc":"5/6","ds":"...","tln":"..."}
  diem_dang     jsonb,                         -- {"<dạng>":[đúng, tổng]}
  bat_dau       timestamptz not null default now(),
  nop_luc       timestamptz,
  gioi_han_giay integer,
  ghi_chu       text not null default '',
  nguon         text not null default 'moi' check (nguon in ('moi', 'sheet')),
  ma_ket_qua_cu text unique                    -- mã kết quả của Sheet cũ (chống nhập trùng)
);
create index on public.luot_lam (hoc_sinh_id, bai_id);
create index on public.luot_lam (bai_id, nop_luc);

create table public.thuong (
  hoc_sinh_id uuid primary key references public.hoc_sinh (id) on delete cascade,
  xp          integer not null default 0,
  xp_tuan     integer not null default 0,
  tuan        date,                            -- thứ Hai của tuần đang tính xp_tuan
  chuoi_ngay  integer not null default 0,
  ngay_cuoi   date,
  huy_hieu    jsonb not null default '{}',
  du_lieu     jsonb not null default '{}',     -- phần còn lại của dữ liệu thưởng (thống kê, số gói trong ngày...)
  cap_nhat    timestamptz not null default now()
);

-- Chống dò mã: ghi các lần nhập mã sai (hàm máy chủ đọc/ghi)
create table public.tra_ma_sai (
  id      bigint generated always as identity primary key,
  luc     timestamptz not null default now(),
  dau_vet text not null default ''             -- dấu vết đã băm của máy gửi (không lưu IP thô)
);
create index on public.tra_ma_sai (luc);

-- ---------------------------------------------------------------------
-- BẬT RLS cho mọi bảng và đặt chính sách
-- ---------------------------------------------------------------------
alter table public.giao_vien    enable row level security;
alter table public.lop          enable row level security;
alter table public.hoc_sinh     enable row level security;
alter table public.lop_hoc_sinh enable row level security;
alter table public.bai_hoc      enable row level security;
alter table public.cau_hoi      enable row level security;
alter table public.dap_an       enable row level security;
alter table public.bo_sinh      enable row level security;
alter table public.ma_de        enable row level security;
alter table public.luot_lam     enable row level security;
alter table public.thuong       enable row level security;
alter table public.tra_ma_sai   enable row level security;

-- giao_vien: tự xem, tự sửa thông tin của mình; quản trị xem, sửa tất cả
create policy gv_xem on public.giao_vien for select to authenticated
  using (id = auth.uid() or public.la_quan_tri());
create policy gv_sua on public.giao_vien for update to authenticated
  using (id = auth.uid() or public.la_quan_tri())
  with check (id = auth.uid() or public.la_quan_tri());

-- lop: giáo viên đã duyệt quản lý lớp của mình
create policy lop_xem on public.lop for select to authenticated
  using (giao_vien_id = auth.uid() or public.la_quan_tri());
create policy lop_them on public.lop for insert to authenticated
  with check (giao_vien_id = auth.uid() and public.la_gv_da_duyet());
create policy lop_sua on public.lop for update to authenticated
  using (giao_vien_id = auth.uid() or public.la_quan_tri())
  with check (giao_vien_id = auth.uid() or public.la_quan_tri());
create policy lop_xoa on public.lop for delete to authenticated
  using (giao_vien_id = auth.uid() or public.la_quan_tri());

-- hoc_sinh: giáo viên xem, sửa học sinh trong lớp mình; thêm mới khi đã được duyệt
create policy hs_xem on public.hoc_sinh for select to authenticated
  using (public.gv_day_hoc_sinh(id) or public.la_quan_tri());
create policy hs_them on public.hoc_sinh for insert to authenticated
  with check (public.la_gv_da_duyet());
create policy hs_sua on public.hoc_sinh for update to authenticated
  using (public.gv_day_hoc_sinh(id) or public.la_quan_tri())
  with check (public.gv_day_hoc_sinh(id) or public.la_quan_tri());

-- lop_hoc_sinh: thêm, bỏ học sinh khỏi lớp của mình
create policy lhs_xem on public.lop_hoc_sinh for select to authenticated
  using (public.la_lop_cua_toi(lop_id) or public.la_quan_tri());
create policy lhs_them on public.lop_hoc_sinh for insert to authenticated
  with check ((public.la_lop_cua_toi(lop_id) and public.la_gv_da_duyet()) or public.la_quan_tri());
create policy lhs_xoa on public.lop_hoc_sinh for delete to authenticated
  using (public.la_lop_cua_toi(lop_id) or public.la_quan_tri());

-- bai_hoc: ai cũng xem được danh sách bài đã mở (kể cả chưa đăng nhập)
create policy bai_xem on public.bai_hoc for select to anon, authenticated
  using (da_mo or public.la_quan_tri());

-- cau_hoi, dap_an, bo_sinh, tra_ma_sai: KHÔNG có chính sách nào → chỉ hàm máy chủ (service_role) đọc được.

-- ma_de: giáo viên quản lý mã đề của mình
create policy made_xem on public.ma_de for select to authenticated
  using (giao_vien_id = auth.uid() or public.la_quan_tri());
create policy made_them on public.ma_de for insert to authenticated
  with check (giao_vien_id = auth.uid() and public.la_gv_da_duyet());
create policy made_sua on public.ma_de for update to authenticated
  using (giao_vien_id = auth.uid() or public.la_quan_tri())
  with check (giao_vien_id = auth.uid() or public.la_quan_tri());
create policy made_xoa on public.ma_de for delete to authenticated
  using (giao_vien_id = auth.uid() or public.la_quan_tri());

-- luot_lam, thuong: giáo viên chỉ xem của học sinh mình (ghi do hàm máy chủ)
create policy luot_xem on public.luot_lam for select to authenticated
  using (public.gv_day_hoc_sinh(hoc_sinh_id) or public.la_quan_tri());
create policy thuong_xem on public.thuong for select to authenticated
  using (public.gv_day_hoc_sinh(hoc_sinh_id) or public.la_quan_tri());

-- Không cho khách (anon) chạm vào bảng nào ngoài bai_hoc
revoke all on public.giao_vien, public.lop, public.hoc_sinh, public.lop_hoc_sinh, public.cau_hoi, public.dap_an,
  public.bo_sinh, public.ma_de, public.luot_lam, public.thuong, public.tra_ma_sai from anon;
-- Giáo viên không bao giờ đọc trực tiếp ngân hàng câu hỏi
revoke all on public.cau_hoi, public.dap_an, public.bo_sinh, public.tra_ma_sai from authenticated;

-- ---------------------------------------------------------------------
-- SỔ ĐIỂM, XẾP HẠNG (đọc qua hàm, tôn trọng phân quyền của người gọi)
-- ---------------------------------------------------------------------

-- Sổ điểm một lớp: mỗi học sinh × mỗi bài, điểm cao nhất của bài kiểm tra (25 phút, 5 phút, có/không mã đề)
create or replace function public.so_diem(p_lop uuid)
returns table (hoc_sinh_id uuid, ho_ten text, ma_hs text, bai_id text, diem_cao_nhat numeric, so_lan integer, lan_cuoi timestamptz)
language sql stable security invoker set search_path = public as $$
  select hs.id, hs.ho_ten, hs.ma_hs, ll.bai_id, max(ll.diem), count(ll.id)::int, max(ll.nop_luc)
  from public.lop_hoc_sinh lh
  join public.hoc_sinh hs on hs.id = lh.hoc_sinh_id
  left join public.luot_lam ll on ll.hoc_sinh_id = hs.id and ll.nop_luc is not null and ll.loai in ('kt25', 'kt5')
  where lh.lop_id = p_lop
  group by hs.id, hs.ho_ten, hs.ma_hs, ll.bai_id
  order by hs.ho_ten;
$$;

-- Lớp chính của học sinh = lớp có thu_tu nhỏ nhất (giống "dòng đầu tiên" trong Sheet cũ)
create or replace view public.lop_chinh with (security_invoker = true) as
  select distinct on (lh.hoc_sinh_id) lh.hoc_sinh_id, l.id as lop_id, l.ten as ten_lop, l.khoi
  from public.lop_hoc_sinh lh join public.lop l on l.id = lh.lop_id
  where l.loai <> 'gv'
  order by lh.hoc_sinh_id, lh.thu_tu, l.tao_luc;

-- Xếp hạng XP cho giáo viên: mỗi học sinh MỘT dòng, kèm mọi lớp của em (trong phạm vi giáo viên thấy được)
create or replace function public.xep_hang_gv(p_khoi smallint default null)
returns table (hoc_sinh_id uuid, ho_ten text, lop_chinh text, cac_lop text[], khoi smallint, xp integer, xp_tuan integer)
language sql stable security invoker set search_path = public as $$
  with tuan_nay as (select (date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh'))::date as t)
  select hs.id, hs.ho_ten, lc.ten_lop,
         array_agg(distinct l.ten order by l.ten),
         lc.khoi,
         coalesce(th.xp, 0),
         case when th.tuan = (select t from tuan_nay) then coalesce(th.xp_tuan, 0) else 0 end
  from public.hoc_sinh hs
  join public.lop_hoc_sinh lh on lh.hoc_sinh_id = hs.id
  join public.lop l on l.id = lh.lop_id and l.loai <> 'gv'
  left join public.lop_chinh lc on lc.hoc_sinh_id = hs.id
  left join public.thuong th on th.hoc_sinh_id = hs.id
  where hs.dang_hoc and (p_khoi is null or l.khoi = p_khoi)
  group by hs.id, hs.ho_ten, lc.ten_lop, lc.khoi, th.xp, th.xp_tuan, th.tuan
  order by 6 desc, hs.ho_ten;
$$;

grant execute on function public.so_diem(uuid), public.xep_hang_gv(smallint) to authenticated;
revoke execute on function public.so_diem(uuid), public.xep_hang_gv(smallint), public.tao_ma_hs() from anon;
