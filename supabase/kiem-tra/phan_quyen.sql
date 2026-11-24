-- Kiểm tra phân quyền trên Postgres thử (có giả lập auth của Supabase). Mỗi dòng "OK" là một kiểm tra đạt.
\set ON_ERROR_STOP 1
set client_min_messages = warning;
-- Dữ liệu giả: 3 giáo viên (A quản trị, B đã duyệt, C chờ duyệt)
insert into auth.users (id, email) values
 ('00000000-0000-0000-0000-00000000000a','a@x.vn'),('00000000-0000-0000-0000-00000000000b','b@x.vn'),('00000000-0000-0000-0000-00000000000c','c@x.vn');
update public.giao_vien set trang_thai='da_duyet', la_quan_tri = (email='a@x.vn') where email in ('a@x.vn','b@x.vn');
insert into public.lop (id, giao_vien_id, ten, khoi, loai) values
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-00000000000a','7A',7,'chinh_khoa'),
 ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-00000000000a','Học thêm 7',7,'hoc_them'),
 ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-00000000000b','7C',7,'chinh_khoa');
insert into public.hoc_sinh (id, ho_ten, ma_hs) values
 ('20000000-0000-0000-0000-000000000001','Nguyễn Văn An','111111'),
 ('20000000-0000-0000-0000-000000000002','Trần Thị Bình','222222'),
 ('20000000-0000-0000-0000-000000000003','Lê Văn Cường','333333');
insert into public.lop_hoc_sinh (lop_id, hoc_sinh_id, thu_tu) values
 ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001',0),
 ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001',1),
 ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002',0),
 ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000003',0);
insert into public.thuong (hoc_sinh_id, xp, xp_tuan, tuan) values
 ('20000000-0000-0000-0000-000000000001',500,50,(date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh'))::date),
 ('20000000-0000-0000-0000-000000000002',300,0,null);
insert into public.luot_lam (hoc_sinh_id, bai_id, loai, diem, nop_luc) values
 ('20000000-0000-0000-0000-000000000001','tam-giac-bang-nhau','kt25',7.5,now()),
 ('20000000-0000-0000-0000-000000000001','tam-giac-bang-nhau','kt25',9,now()),
 ('20000000-0000-0000-0000-000000000003','tam-giac-bang-nhau','kt25',6,now());
insert into public.cau_hoi (id, bai_id, loai, muc_do, noi_dung) values ('tam-giac-bang-nhau/mc-1','tam-giac-bang-nhau','mc','nb','{}');
insert into public.dap_an (cau_hoi_id, dap_an) values ('tam-giac-bang-nhau/mc-1','"B"');

create function pg_temp.ok(dk boolean, ten text) returns void language plpgsql as $$
begin if not dk then raise exception 'SAI: %', ten; end if; raise notice 'OK  %', ten; end $$;
set client_min_messages = notice;

-- Khách chưa đăng nhập
set role anon;
select pg_temp.ok((select count(*) from public.bai_hoc) = 36, 'khách xem được 36 bài');
do $$ begin perform 1 from public.hoc_sinh; raise exception 'SAI: khách đọc được hoc_sinh'; exception when insufficient_privilege then raise notice 'OK  khách không đọc được hoc_sinh'; end $$;
reset role;

-- Giáo viên A (quản trị) và B
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
select pg_temp.ok((select count(*) from public.hoc_sinh) = 1, 'GV B chỉ thấy 1 học sinh của mình');
select pg_temp.ok((select count(*) from public.luot_lam) = 1, 'GV B chỉ thấy lượt làm của học sinh mình');
select pg_temp.ok((select count(*) from public.lop) = 1, 'GV B chỉ thấy lớp mình');
do $$ begin perform 1 from public.dap_an; raise exception 'SAI: GV đọc được đáp án'; exception when insufficient_privilege then raise notice 'OK  GV không đọc được đáp án'; end $$;
do $$ begin perform 1 from public.cau_hoi; raise exception 'SAI: GV đọc được câu hỏi'; exception when insufficient_privilege then raise notice 'OK  GV không đọc được ngân hàng câu hỏi'; end $$;
do $$ begin update public.giao_vien set la_quan_tri = true where id = auth.uid(); raise exception 'SAI: GV tự cấp quyền quản trị'; exception when raise_exception then
  if sqlerrm like 'SAI%' then raise; end if; raise notice 'OK  GV không tự cấp quyền quản trị'; end $$;
update public.giao_vien set truong = 'THCS Thử' where id = auth.uid();
select pg_temp.ok((select truong from public.giao_vien where id = auth.uid()) = 'THCS Thử', 'GV tự sửa được tên trường');
update public.hoc_sinh set ho_ten = 'Đổi tên' where ma_hs = '111111';
reset role; select pg_temp.ok((select ho_ten from public.hoc_sinh where ma_hs='111111') = 'Nguyễn Văn An', 'GV B không sửa được học sinh của GV A');
set role authenticated;

set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
select pg_temp.ok((select count(*) from public.xep_hang_gv(7::smallint) where ho_ten='Nguyễn Văn An') = 1, 'xếp hạng: em ở 2 lớp chỉ hiện 1 lần');
select pg_temp.ok((select cac_lop from public.xep_hang_gv(7::smallint) where ho_ten='Nguyễn Văn An') = array['7A','Học thêm 7'], 'xếp hạng: ghi đủ 2 lớp của em');
select pg_temp.ok((select lop_chinh from public.xep_hang_gv(7::smallint) where ho_ten='Nguyễn Văn An') = '7A', 'lớp chính là lớp có thứ tự đầu');
select pg_temp.ok((select xp_tuan from public.xep_hang_gv(7::smallint) where ho_ten='Trần Thị Bình') = 0, 'XP tuần = 0 khi tuần cũ');
select pg_temp.ok((select diem_cao_nhat from public.so_diem('10000000-0000-0000-0000-000000000001') where ho_ten='Nguyễn Văn An') = 9, 'sổ điểm lấy lần cao nhất');
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
select pg_temp.ok((select count(*) from public.so_diem('10000000-0000-0000-0000-000000000001')) = 0, 'GV B không xem được sổ điểm lớp của GV A');
select pg_temp.ok((select count(*) from public.xep_hang_gv(7::smallint)) = 1, 'xếp hạng của GV B chỉ có học sinh của B');

-- Giáo viên C chờ duyệt
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
do $$ begin insert into public.lop (giao_vien_id, ten, khoi) values (auth.uid(), '6A', 6); raise exception 'SAI: GV chờ duyệt tạo được lớp';
  exception when insufficient_privilege then raise notice 'OK  GV chờ duyệt chưa tạo được lớp'; end $$;
reset role;
select pg_temp.ok((select trang_thai from public.giao_vien where email='c@x.vn') = 'cho_duyet', 'tài khoản mới tự ở trạng thái chờ duyệt');
-- Quản trị duyệt C
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
update public.giao_vien set trang_thai = 'da_duyet' where email = 'c@x.vn';
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
insert into public.lop (giao_vien_id, ten, khoi) values (auth.uid(), '6A', 6);
select pg_temp.ok((select count(*) from public.lop) = 1, 'sau khi duyệt GV C tạo được lớp');
reset role;
select pg_temp.ok((select duyet_luc is not null from public.giao_vien where email='c@x.vn'), 'ghi lại thời điểm duyệt');
select pg_temp.ok((select public.tao_ma_hs() ~ '^[0-9]{6}$'), 'tạo mã HS 6 số');
