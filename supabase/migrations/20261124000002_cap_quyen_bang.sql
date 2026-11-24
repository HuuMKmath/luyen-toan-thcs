-- Cấp quyền dùng bảng cho các vai trò của Supabase.
-- Dự án được tạo với "Grant API access to new tables automatically" TẮT, nên bảng mới chưa cấp quyền cho ai.
-- Quyền ở đây chỉ là "được chạm vào bảng"; ai thấy dòng nào vẫn do các chính sách RLS ở tệp 0001 quyết định.

grant usage on schema public to anon, authenticated, service_role;

-- Hàm máy chủ (service_role): toàn quyền trên mọi bảng, chuỗi số, hàm
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;

-- Giáo viên đăng nhập (authenticated): chỉ những bảng cần, RLS lọc theo lớp của mình
grant select, update on public.giao_vien to authenticated;
grant select, insert, update, delete on public.lop to authenticated;
grant select, insert, update on public.hoc_sinh to authenticated;
grant select, insert, delete on public.lop_hoc_sinh to authenticated;
grant select, insert, update, delete on public.ma_de to authenticated;
grant select on public.luot_lam, public.thuong, public.bai_hoc, public.lop_chinh to authenticated;
grant execute on function public.so_diem(uuid), public.xep_hang_gv(smallint), public.la_quan_tri(), public.la_gv_da_duyet(),
  public.gv_day_hoc_sinh(uuid), public.la_lop_cua_toi(uuid), public.tao_ma_hs() to authenticated;

-- Khách chưa đăng nhập (anon): chỉ xem danh sách bài
grant select on public.bai_hoc to anon;
grant execute on function public.la_quan_tri() to anon;   -- chính sách xem bài học gọi hàm này
