// Script cho MỘT Google Sheet dùng chung cả website luyện toán.
//  - Trang tính "Học sinh": cột A = Lớp, B = Họ tên, C = Mã HS (dòng 1 là tiêu đề).
//  - Mỗi bài học có một trang tính riêng, script tự tạo khi có kết quả đầu tiên của bài đó.
//  - Chỉ ghi điểm khi mã học sinh có trong trang tính "Học sinh".
// Thêm bài mới trên website KHÔNG cần sửa script này.

const TAB_HS = 'Học sinh';
const COT_DAU = ['Thời điểm nộp', 'Mã HS', 'Họ tên', 'Lớp', 'Ngày', 'Loại bài', 'Mã đề', 'Điểm', 'Trắc nghiệm', 'Đúng sai', 'Trả lời ngắn',
  'Thời gian (phút)', 'Giới hạn (phút)'];
const COT_CUOI = ['Ghi chú', 'Mã kết quả'];

/* ---------- Menu tạo mã học sinh ---------- */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Học sinh')
    .addItem('Tạo mã cho học sinh chưa có mã', 'taoMa')
    .addToUi();
}

function taoMa() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(TAB_HS);
  if (!sh) {
    sh = ss.insertSheet(TAB_HS, 0);
    sh.getRange(1, 1, 1, 3).setValues([['Lớp', 'Họ tên', 'Mã HS']]).setFontWeight('bold');
    sh.setFrozenRows(1);
    ui.alert('Đã tạo trang tính "' + TAB_HS + '". Hãy nhập Lớp vào cột A và Họ tên vào cột B (từ dòng 2), rồi bấm lại menu này để tạo mã.');
    return;
  }
  const last = sh.getLastRow();
  if (last < 2) {
    ui.alert('Chưa có học sinh nào. Hãy nhập Lớp vào cột A và Họ tên vào cột B, từ dòng 2.');
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
  ui.alert(made ? 'Đã tạo mã cho ' + made + ' học sinh.' : 'Tất cả học sinh đã có mã, không tạo thêm.');
}

/* ---------- Tra mã học sinh ---------- */

function timHocSinh(ma) {
  const m = String(ma || '').replace(/\D/g, '');
  if (!m) return null;
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_HS);
  if (!sh || sh.getLastRow() < 2) return null;
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues();
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][2]).replace(/\D/g, '') === m) return { n: String(rows[i][1]).trim(), c: String(rows[i][0]).trim() };
  }
  return null;
}

// Trang hỏi: mã học sinh này có trong danh sách không?
function doGet(e) {
  const ma = e && e.parameter && e.parameter.ma;
  if (!ma) return ok('ready');
  try {
    const hs = timHocSinh(ma);
    return json(hs ? { ok: true, n: hs.n, c: hs.c } : { ok: false });
  } catch (err) {
    return json({ ok: false, err: 1 });
  }
}

/* ---------- Nhận kết quả bài kiểm tra ---------- */

function tenTab(s) {
  return String(s || '').replace(/[\[\]\*\?\/\\:]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const body = JSON.parse(e.postData.contents);
    const code = String(body.code || '');
    const cut = code.indexOf('-');
    const tab = tenTab(body.bai);
    const keys = Array.isArray(body.tk) ? body.tk.slice(0, 12).map(String) : [];
    const names = Array.isArray(body.tn) ? body.tn.slice(0, 12).map(function (s) { return String(s).slice(0, 60); }) : [];
    if (cut < 1 || !tab || tab === TAB_HS || keys.length !== names.length) return ok('bad');
    const text = Utilities.newBlob(Utilities.base64Decode(code.slice(cut + 1))).getDataAsString('UTF-8');
    const o = JSON.parse(text);

    // Chỉ nhận kết quả của học sinh có mã trong danh sách
    const hs = timHocSinh(o.u);
    if (!hs) return ok('nocode');
    const maHS = String(o.u).replace(/\D/g, '');

    const HEADERS = COT_DAU.concat(names, COT_CUOI);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(tab);
    if (!sh) sh = ss.insertSheet(tab, ss.getNumSheets());
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }
    // Nếu mã kết quả này đã có thì không ghi lại (học sinh bấm gửi lại)
    const last = sh.getLastRow();
    if (last > 1) {
      const codes = sh.getRange(2, HEADERS.length, last - 1, 1).getValues();
      for (let i = 0; i < codes.length; i++) if (codes[i][0] === code) return ok('dup');
    }

    const topic = keys.map(function (k) { return o.t && o.t[k] && o.t[k][1] ? o.t[k][0] + '/' + o.t[k][1] : ''; });
    const limit = o.L || (o.q === 'quick' ? 300 : 1500);
    const fast = (typeof o.m === 'number' && o.m < 0.25 * limit && o.s < 5) ? 'Làm nhanh, điểm thấp' : '';
    // Họ tên và lớp lấy từ danh sách của giáo viên, không lấy từ máy học sinh
    const row = [new Date(), maHS, hs.n, hs.c, o.d || '', o.q === 'quick' ? 'Kiểm tra nhanh' : 'Kiểm tra', o.k || '',
      o.s, o.p ? o.p[0] : '', o.p ? o.p[1] : '', o.p ? o.p[2] : '',
      typeof o.m === 'number' ? Math.round(o.m / 6) / 10 : '', o.L ? o.L / 60 : ''].concat(topic, [fast, code]);
    sh.appendRow(row);
    return ok('saved');
  } catch (err) {
    return ok('error');
  } finally {
    lock.releaseLock();
  }
}

function ok(msg) {
  return ContentService.createTextOutput(msg);
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
