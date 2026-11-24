# Nền mới: cơ sở dữ liệu Supabase

Thư mục này chứa cơ sở dữ liệu của nền mới (Bước 1 trong tài liệu thiết kế). Website hiện tại trên GitHub Pages và Google Sheet **chưa dùng** đến thư mục này; học sinh vẫn làm bài như cũ cho đến ngày chuyển.

| Tệp | Dùng để |
| --- | --- |
| `migrations/20261124000001_cau_truc.sql` | Tạo các bảng, phân quyền, hàm Sổ điểm và xếp hạng. Chạy **một lần** trên dự án Supabase trống. |
| `du-lieu/bai_hoc.sql` | Danh sách 36 bài (sinh tự động từ trang Các bài). Chạy lại mỗi khi thêm bài mới. |
| `cong-cu/tao_bai_hoc.py` | Sinh lại `du-lieu/bai_hoc.sql`. |
| `cong-cu/chuyen_tu_sheet.py` | Chuyển học sinh, kết quả, điểm thưởng từ Google Sheet sang (sinh tệp SQL để dán vào Supabase). |
| `kiem-tra/phan_quyen.sql` | 22 kiểm tra phân quyền, chạy trên Postgres thử. |
| `functions/bai-lam/` | Hàm máy chủ cho học sinh: đăng nhập bằng mã, nhận đề (không kèm đáp án), kiểm tra từng câu khi luyện tập, nộp bài để máy chủ chấm. |
| `functions/bai-lam/bai/*.js` | Ngân hàng câu, bộ sinh số liệu, cách dựng gói và cách chấm của 36 bài – **sinh tự động** từ trang bài bằng `cong-cu/tach_bai.py`, không sửa tay. |
| `kiem-tra/thu_bai.mjs` | Chạy thử mọi bài: đúng hết được điểm tối đa, bỏ trống 0 điểm, cùng mã đề cùng đề, không lộ đáp án. |
| `kiem-tra/thu_may_chu.mjs` | Chạy thử hàm máy chủ với cơ sở dữ liệu giả (23 kiểm tra). |

## Khi sửa hoặc thêm bài

Câu hỏi vẫn soạn trong trang bài như trước. Sau khi sửa trang, chạy:

```
python3 supabase/cong-cu/tach_bai.py      # tách lại ngân hàng câu cho máy chủ
python3 supabase/cong-cu/tao_bai_hoc.py > supabase/du-lieu/bai_hoc.sql
node supabase/kiem-tra/thu_bai.mjs        # phải ra "0 lỗi"
```

## Các bảng

| Bảng | Thay cho | Ai đọc được |
| --- | --- | --- |
| `giao_vien` | (mới) | Chính giáo viên đó, quản trị |
| `lop` | Cột Lớp | Giáo viên của lớp |
| `hoc_sinh` | Trang tính "Học sinh" | Giáo viên dạy em đó |
| `lop_hoc_sinh` | (mới) một em – một mã – có thể ở nhiều lớp | Giáo viên của lớp |
| `bai_hoc` | 36 thư mục bài | Mọi người |
| `cau_hoi`, `dap_an`, `bo_sinh` | Câu hỏi trong trang | **Chỉ hàm máy chủ** |
| `ma_de` | Mã đề | Giáo viên tạo mã |
| `luot_lam` | Trang tính từng bài | Giáo viên dạy em đó |
| `thuong` | Trang tính "Thưởng" | Giáo viên dạy em đó |

Học sinh không đọc thẳng bảng nào: các em nhập mã 6 số, hàm máy chủ kiểm tra rồi mới phát câu, chấm bài (làm ở buổi sau).

## Chuyển dữ liệu từ Google Sheet

1. Giáo viên chủ website đăng nhập nền mới một lần bằng email (để có dòng trong bảng `giao_vien`).
2. Google Sheet "LUYỆN TOÁN THCS" → **Tệp → Tải xuống → Microsoft Excel (.xlsx)**.
3. `python3 supabase/cong-cu/chuyen_tu_sheet.py "LUYỆN TOÁN THCS.xlsx" --email <email> > nhap.sql`
4. Dán `nhap.sql` vào **SQL Editor** của Supabase → **Run**. Chạy lại bao nhiêu lần cũng không trùng.

Tệp `.xlsx` và `nhap.sql` có họ tên, mã học sinh: **không đưa lên GitHub** (`.gitignore` đã chặn).

## Kiểm tra trên máy

```
initdb, pg_ctl start …   # Postgres 16
psql -f kiem-tra/gia_lap_auth.sql -f migrations/… -f du-lieu/bai_hoc.sql -f kiem-tra/phan_quyen.sql
```
Mỗi dòng `OK` là một kiểm tra đạt; gặp `SAI` thì dừng.
