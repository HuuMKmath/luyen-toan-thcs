# Nền mới: cơ sở dữ liệu Supabase

Thư mục này chứa cơ sở dữ liệu và hàm máy chủ của nền mới. Website trên GitHub Pages vẫn dùng Google Sheet; bản trên Cloudflare Pages (luyentoanthcs.pages.dev) dùng hoàn toàn Supabase.

| Tệp | Dùng để |
| --- | --- |
| `migrations/20261124000001_cau_truc.sql` | Tạo các bảng, phân quyền, hàm Sổ điểm và xếp hạng. Chạy **một lần** trên dự án Supabase trống. |
| `du-lieu/bai_hoc.sql` | Danh sách 36 bài (sinh tự động từ trang Các bài). Chạy lại mỗi khi thêm bài mới. |
| `cong-cu/tao_bai_hoc.py` | Sinh lại `du-lieu/bai_hoc.sql`. |
| `cong-cu/chuyen_tu_sheet.py` | Chuyển học sinh, kết quả, điểm thưởng từ Google Sheet sang (sinh tệp SQL để dán vào Supabase). |
| `migrations/20261126000001_khoa_bai_xep_hang.sql` | Buổi 4: bảng `goi_xong` (gói đã xong), `mo_bai` (giáo viên mở bài), hàm `ds_xep_hang`. Chạy **một lần** trong SQL Editor. |
| `migrations/20261127000001_danh_xung_gv.sql` | Cột `danh_xung` (thầy/cô) cho mã giáo viên, để trang Các bài chào "Chào thầy/cô". Chạy **một lần** trong SQL Editor; ghi danh xưng ở Table Editor → `hoc_sinh` → dòng của mã GV. |
| `kiem-tra/phan_quyen.sql` | 26 kiểm tra phân quyền, chạy trên Postgres thử. |
| `functions/bai-lam/` | Hàm máy chủ cho học sinh: đăng nhập bằng mã, nhận đề (không kèm đáp án), kiểm tra từng câu khi luyện tập, nộp bài để máy chủ chấm. |
| `functions/bai-lam/tuong-thich.js` | Phần trả lời **giống Google Sheet cũ**: tra mã, tiến độ (trang Các bài, khóa bài), xếp hạng, XP, gói đã xong. Bản dựng Cloudflare đổi `SHEET_URL` của mọi trang sang hàm này. |
| `functions/bai-lam/bai/*.js` | Ngân hàng câu, bộ sinh số liệu, cách dựng gói và cách chấm của 36 bài – **sinh tự động** từ trang bài bằng `cong-cu/tach_bai.py`, không sửa tay. |
| `kiem-tra/thu_bai.mjs` | Chạy thử mọi bài: đúng hết được điểm tối đa, bỏ trống 0 điểm, cùng mã đề cùng đề, không lộ đáp án. |
| `kiem-tra/thu_may_chu.mjs` | Chạy thử hàm máy chủ với cơ sở dữ liệu giả (đăng nhập, chấm bài, tiến độ, xếp hạng, XP). |

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
| `goi_xong` | Trang tính "Gói đã xong" | Giáo viên dạy em đó |
| `mo_bai` | Trang tính "Mở bài" | Giáo viên đã duyệt |

**Mở bài cho học sinh chưa đạt điều kiện:** Supabase → **Table Editor** → bảng `mo_bai` → **Insert row**: `pham_vi` = tên lớp (7A), số khối (7) hoặc `Tất cả`; `bai_id` = tên thư mục bài (ví dụ `tap-hop`); `mo` để tích. Bỏ tích `mo` (hoặc xóa dòng) để khóa lại.

**Học sinh chưa xếp lớp** (không có dòng trong `lop_hoc_sinh`) không đăng nhập được. Mã giáo viên nằm trong lớp loại `gv` (tên "GV"): vào được mọi khối, xem xếp hạng mọi lớp.

Học sinh không đọc thẳng bảng nào: các em nhập mã 6 số, hàm máy chủ kiểm tra rồi mới phát câu, chấm bài (làm ở buổi sau).

## Chuyển dữ liệu từ Google Sheet

1. Tạo tài khoản giáo viên chủ website (để có dòng trong bảng `giao_vien`): Supabase → **Authentication** → **Users** → **Add user** → **Create new user**, nhập email, mật khẩu, tích **Auto Confirm User**.
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
