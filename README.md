# Luyện toán THCS

Các trang luyện toán chấm tự động trên trình duyệt (Toán Kết nối tri thức): luyện tập theo gói, bài kiểm tra có đồng hồ, mã đề, phân tích phần kiến thức còn yếu và kết quả gửi cho giáo viên.

## Các bài

| Lớp | Bài | Thư mục | Mã kết quả |
|---|---|---|---|
| 6 | Bội chung, bội chung nhỏ nhất | `boi-chung-nho-nhat/` | `BC6-` |
| 7 | Tam giác bằng nhau | thư mục gốc (`index.html`) | `TG7-` |

Trang chung liệt kê các bài: `cac-bai/`.

## Địa chỉ khi bật GitHub Pages

- Trang chung: `https://huumkmath.github.io/tam-giac-bang-nhau/cac-bai/`
- Tam giác bằng nhau: `https://huumkmath.github.io/tam-giac-bang-nhau/`
- Bội chung nhỏ nhất: `https://huumkmath.github.io/tam-giac-bang-nhau/boi-chung-nho-nhat/`

## Cách dùng cho giáo viên

- Học sinh nhập mã học sinh, làm bài kiểm tra (nhập mã đề nếu có); kết quả tự gửi về Google Sheet của bài.
- Giáo viên mở mục **Giáo viên** của đúng bài (thêm `#giao-vien` vào cuối địa chỉ), dán các mã vào để xem bảng tổng hợp.
- Mỗi bài có tiền tố mã riêng nên không dán lẫn giữa các bài.

## Mã học sinh

Mỗi học sinh có một mã 6 chữ số do giáo viên phát. Học sinh nhập mã một lần trên máy của mình, sau đó luyện tập và làm bài kiểm tra ở mọi bài. Kết quả kiểm tra chỉ được ghi khi mã có trong danh sách.

- Danh sách nằm ở một Google Sheet riêng ("Danh sách học sinh"): cột A = Lớp, B = Họ tên, C = Mã HS. Script `danh-sach-hoc-sinh/google-sheet.gs` thêm menu **Học sinh > Tạo mã cho học sinh chưa có mã**.
- Script của từng bài (`google-sheet.gs`, `boi-chung-nho-nhat/google-sheet.gs`) đọc danh sách đó: dán link của Sheet danh sách vào dòng `DANH_SACH`, chạy hàm `kiemTra` một lần để cấp quyền, rồi triển khai lại **phiên bản mới của bản triển khai cũ** (để địa chỉ `/exec` không đổi).
- Họ tên và lớp trong bảng điểm lấy từ danh sách, không lấy từ máy học sinh. Bảng điểm có thêm cột **Mã HS** ở cuối.
- Không dán link của Sheet danh sách vào kho này (kho công khai); chỉ dán trong Apps Script.

## Thêm một bài mới

Tạo thư mục mới với một file `index.html` tự chứa (theo mẫu `boi-chung-nho-nhat/index.html`), đặt tiền tố mã riêng, rồi thêm một thẻ vào đúng section lớp (`lop-6` đến `lop-9`) trong `cac-bai/index.html` và một dòng vào bảng trên. Section lớp chưa có bài hiện dòng "Chưa có bài"; khi thêm thẻ đầu tiên thì thay dòng đó bằng khối `<div class="list">` như các lớp khác.
