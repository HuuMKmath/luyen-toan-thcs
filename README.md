# Luyện toán THCS

Các trang luyện toán chấm tự động trên trình duyệt (Toán Kết nối tri thức): luyện tập theo gói, bài kiểm tra có đồng hồ, mã đề, phân tích phần kiến thức còn yếu và kết quả gửi cho giáo viên.

## Các bài

| Lớp | Bài | Thư mục | Mã kết quả |
|---|---|---|---|
| 6 | Bội chung, bội chung nhỏ nhất | `boi-chung-nho-nhat/` | `BC6-` |
| 6 | Tập hợp các số nguyên (Chương III, Bài 13) | `tap-hop-so-nguyen/` | `SN6-` |
| 6 | Phép cộng và phép trừ số nguyên (Chương III, Bài 14) | `phep-cong-tru-so-nguyen/` | `PC6-` |
| 6 | Quy tắc dấu ngoặc (Chương III, Bài 15) | `quy-tac-dau-ngoac/` | `DN6-` |
| 7 | Tam giác bằng nhau | thư mục gốc (`index.html`) | `TG7-` |
| 7 | Tập hợp các số hữu tỉ (Chương I, Bài 1) | `tap-hop-so-huu-ti/` | `SH7-` |
| 7 | Cộng, trừ, nhân, chia số hữu tỉ (Chương I, Bài 2) | `cong-tru-nhan-chia-so-huu-ti/` | `CT7-` |
| 7 | Luỹ thừa với số mũ tự nhiên của một số hữu tỉ (Chương I, Bài 3) | `luy-thua-so-huu-ti/` | `LT7-` |
| 7 | Bài tập cuối chương I | `bai-tap-cuoi-chuong-1-toan-7/` | `CC7-` |
| 7 | Các trường hợp bằng nhau của tam giác vuông (Chương IV, Bài 15) | `tam-giac-vuong-bang-nhau/` | `TV7-` |

Trang chung liệt kê các bài: `cac-bai/`.

## Địa chỉ khi bật GitHub Pages

- Trang chung: `https://huumkmath.github.io/tam-giac-bang-nhau/cac-bai/`
- Tam giác bằng nhau: `https://huumkmath.github.io/tam-giac-bang-nhau/`
- Bội chung nhỏ nhất: `https://huumkmath.github.io/tam-giac-bang-nhau/boi-chung-nho-nhat/`
- Tập hợp các số nguyên: `https://huumkmath.github.io/tam-giac-bang-nhau/tap-hop-so-nguyen/`
- Phép cộng và phép trừ số nguyên: `https://huumkmath.github.io/tam-giac-bang-nhau/phep-cong-tru-so-nguyen/`
- Quy tắc dấu ngoặc: `https://huumkmath.github.io/tam-giac-bang-nhau/quy-tac-dau-ngoac/`
- Tập hợp các số hữu tỉ: `https://huumkmath.github.io/tam-giac-bang-nhau/tap-hop-so-huu-ti/`
- Cộng, trừ, nhân, chia số hữu tỉ: `https://huumkmath.github.io/tam-giac-bang-nhau/cong-tru-nhan-chia-so-huu-ti/`
- Luỹ thừa với số mũ tự nhiên của một số hữu tỉ: `https://huumkmath.github.io/tam-giac-bang-nhau/luy-thua-so-huu-ti/`
- Bài tập cuối chương I: `https://huumkmath.github.io/tam-giac-bang-nhau/bai-tap-cuoi-chuong-1-toan-7/`
- Các trường hợp bằng nhau của tam giác vuông: `https://huumkmath.github.io/tam-giac-bang-nhau/tam-giac-vuong-bang-nhau/`

## Cách dùng cho giáo viên

- Học sinh nhập mã học sinh, làm bài kiểm tra (nhập mã đề nếu có); kết quả tự gửi về Google Sheet chung "LUYỆN TOÁN THCS".
- Giáo viên xem điểm ở hai trang tính **Xem điểm** và **Sổ điểm** của Sheet chung.
- Dự phòng khi học sinh không gửi được (mất mạng): các em đưa mã kết quả, giáo viên mở mục **Giáo viên** của đúng bài (thêm `#giao-vien` vào cuối địa chỉ) rồi dán mã. Mỗi bài có tiền tố mã riêng nên không dán lẫn giữa các bài.
- Trong một gói luyện tập hay một đề kiểm tra không có hai câu giống hệt nhau; câu tự sinh bị trùng sẽ được sinh lại.

## Google Sheet chung và mã học sinh

Cả website dùng **một Google Sheet** với script `google-sheet/Code.gs` (dán vào Tiện ích mở rộng > Apps Script, triển khai một lần dạng ứng dụng web).

- Trang tính **Học sinh**: cột A = Lớp, B = Họ tên, C = Mã HS. Menu **Học sinh > Tạo mã cho học sinh chưa có mã** cấp cho mỗi em một mã 6 chữ số ngẫu nhiên; mã đã có thì giữ nguyên.
- Mỗi bài học có một trang tính riêng (ví dụ "7 - Tam giác bằng nhau"), script tự tạo khi có kết quả đầu tiên.
- Menu **Bảng điểm > Tạo / cập nhật bảng điểm** tạo hai trang tính: **Xem điểm** (chọn Lớp, Bài, Loại bài: danh sách cả lớp với điểm cao nhất, số lần làm, phần còn yếu, em nào chưa làm) và **Sổ điểm** (chọn Lớp: mỗi học sinh một dòng, mỗi bài một cột). Hai bảng tự làm mới khi mở Sheet hoặc đổi ô chọn.
- Học sinh nhập mã một lần trên máy của mình, sau đó luyện tập và làm bài kiểm tra ở mọi bài. Kết quả kiểm tra chỉ được ghi khi mã có trong trang tính Học sinh; họ tên và lớp lấy từ danh sách, không lấy từ máy học sinh.

## Thêm một bài mới

Tạo thư mục mới với một file `index.html` tự chứa (theo mẫu `boi-chung-nho-nhat/index.html`), đặt tiền tố mã riêng, giữ nguyên `SHEET_URL` của Sheet chung và đặt `SHEET_TAB`, `SHEET_TOPICS` cho bài (không phải làm gì thêm trên Google Sheet), rồi thêm một thẻ vào đúng section lớp (`lop-6` đến `lop-9`) trong `cac-bai/index.html` và một dòng vào bảng trên. Section lớp chưa có bài hiện dòng "Chưa có bài"; khi thêm thẻ đầu tiên thì thay dòng đó bằng khối `<div class="list">` như các lớp khác.
