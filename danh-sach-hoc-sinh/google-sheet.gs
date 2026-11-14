// Script cho Google Sheet "Danh sách học sinh".
// Trang tính đầu tiên có ba cột: A = Lớp, B = Họ tên, C = Mã HS (dòng 1 là tiêu đề).
// Dán script này vào Tiện ích mở rộng > Apps Script của Sheet danh sách, lưu lại, rồi tải lại Sheet.
// Menu "Học sinh" sẽ xuất hiện: bấm "Tạo mã cho học sinh chưa có mã".
// Mỗi học sinh nhận một mã 6 chữ số ngẫu nhiên, không trùng nhau. Mã đã có thì giữ nguyên.

const TIEU_DE = ['Lớp', 'Họ tên', 'Mã HS'];

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Học sinh')
    .addItem('Tạo mã cho học sinh chưa có mã', 'taoMa')
    .addToUi();
}

function taoMa() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  // Ghi tiêu đề nếu dòng 1 còn trống
  const head = sh.getRange(1, 1, 1, 3).getValues()[0];
  if (!String(head[0]).trim() && !String(head[1]).trim() && !String(head[2]).trim()) {
    sh.getRange(1, 1, 1, 3).setValues([TIEU_DE]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  const last = sh.getLastRow();
  if (last < 2) {
    SpreadsheetApp.getUi().alert('Chưa có học sinh nào. Hãy nhập Lớp vào cột A và Họ tên vào cột B, từ dòng 2.');
    return;
  }
  sh.getRange(2, 3, last - 1, 1).setNumberFormat('@'); // cột mã là văn bản
  const rows = sh.getRange(2, 1, last - 1, 3).getValues();
  const used = {};
  rows.forEach(function (r) {
    const m = String(r[2]).replace(/\D/g, '');
    if (m) used[m] = true;
  });
  let made = 0;
  const out = rows.map(function (r) {
    let m = String(r[2]).replace(/\D/g, '');
    if (!m && String(r[1]).trim()) {
      do { m = String(100000 + Math.floor(Math.random() * 900000)); } while (used[m]);
      used[m] = true;
      made++;
    }
    return [m];
  });
  sh.getRange(2, 3, out.length, 1).setValues(out);
  SpreadsheetApp.getUi().alert(made ? 'Đã tạo mã cho ' + made + ' học sinh.' : 'Tất cả học sinh đã có mã, không tạo thêm.');
}
