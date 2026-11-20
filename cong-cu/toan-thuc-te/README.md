# Gói Toán thực tế: tình huống bổ sung

Mỗi bài có 4 tình huống thực tế; mỗi lần học sinh làm gói Toán thực tế, trang chọn ngẫu nhiên 3 tình huống (khoảng 10–12 câu).

- `tinh-huong/<thư-mục-bài>.js`: các tình huống viết thêm cho từng bài (dùng `RNG`, `ri`, `sel`, `shuffle` nên mã đề cho cùng một đề).
- `_prelude.js`: các hàm dùng chung được ghép kèm.
- `ghep.py`: ghép tình huống vào `index.html` của bài, giữa hai dòng `Toán thực tế bổ sung: bắt đầu / kết thúc`. Chạy lại bao nhiêu lần cũng được.
- `kiem-tra.js` và `kiem-tra/*.chk.js`: sinh mỗi tình huống vài trăm lần, đọc lại số liệu trong đề và bảng rồi tính đáp án bằng cách khác để so sánh.

```
python3 cong-cu/toan-thuc-te/ghep.py tap-hop-so-nguyen
node cong-cu/toan-thuc-te/kiem-tra.js tap-hop-so-nguyen 400
```
Dùng `.` cho trang Tam giác bằng nhau ở thư mục gốc.
