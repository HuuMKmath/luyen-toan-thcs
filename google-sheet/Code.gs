// Script cho MỘT Google Sheet dùng chung cả website luyện toán.
//  - Trang tính "Học sinh": cột A = Lớp, B = Họ tên, C = Mã HS (dòng 1 là tiêu đề).
//  - Mỗi bài học có một trang tính riêng, script tự tạo khi có kết quả đầu tiên của bài đó.
//  - Chỉ ghi điểm khi mã học sinh có trong trang tính "Học sinh".
//  - Menu "Bảng điểm" tạo hai trang tính "Xem điểm" (một lớp, một bài) và "Sổ điểm" (một lớp, mọi bài).
// Thêm bài mới trên website KHÔNG cần sửa script này.

const TAB_HS = 'Học sinh';
const TAB_XEM = 'Xem điểm'; // một lớp, một bài
const TAB_SO = 'Sổ điểm';   // một lớp, tất cả các bài
const COT_DAU = ['Thời điểm nộp', 'Mã HS', 'Họ tên', 'Lớp', 'Ngày', 'Loại bài', 'Mã đề', 'Điểm', 'Trắc nghiệm', 'Đúng sai', 'Trả lời ngắn',
  'Thời gian (phút)', 'Giới hạn (phút)'];
const COT_CUOI = ['Ghi chú', 'Mã kết quả'];

/* ---------- Menu tạo mã học sinh ---------- */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Học sinh')
    .addItem('Tạo mã cho học sinh chưa có mã', 'taoMa')
    .addToUi();
  SpreadsheetApp.getUi().createMenu('Bảng điểm')
    .addItem('Tạo / cập nhật bảng điểm', 'capNhatBangDiem')
    .addToUi();
  // Mở Sheet thì làm mới hai bảng điểm (nếu đã tạo)
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss.getSheetByName(TAB_XEM)) capNhatXemDiem();
    if (ss.getSheetByName(TAB_SO)) capNhatSoDiem();
  } catch (err) {}
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
    if (cut < 1 || !tab || tab === TAB_HS || tab === TAB_XEM || tab === TAB_SO || keys.length !== names.length) return ok('bad');
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

/* ---------- Bảng điểm: "Xem điểm" và "Sổ điểm" ---------- */
// Điểm của một học sinh ở một bài = điểm CAO NHẤT trong các lần làm.
// Hai bảng tự cập nhật khi mở Sheet, khi đổi ô chọn Lớp / Bài / Loại bài, hoặc khi bấm menu Bảng điểm.

const LOAI = ['Tất cả', 'Kiểm tra', 'Kiểm tra nhanh'];
const DONG_XEM = 6; // dòng tiêu đề của bảng Xem điểm
const DONG_SO = 4;  // dòng tiêu đề của bảng Sổ điểm

function soMa(x) { return String(x === null || x === undefined ? '' : x).replace(/\D/g, ''); }

// Danh sách học sinh theo đúng thứ tự trong trang tính Học sinh
function dsHocSinh() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_HS);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues()
    .map(function (r) { return { c: String(r[0]).trim(), n: String(r[1]).trim(), u: soMa(r[2]) }; })
    .filter(function (h) { return h.n; });
}

function dsLop(hs) {
  const out = [];
  hs.forEach(function (h) { if (h.c && out.indexOf(h.c) < 0) out.push(h.c); });
  return out;
}

// Các trang tính bài học: dòng 1 bắt đầu bằng "Thời điểm nộp", "Mã HS"
function dsBai() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets().filter(function (sh) {
    if (sh.getLastRow() < 1 || sh.getLastColumn() < COT_DAU.length + COT_CUOI.length) return false;
    const h = sh.getRange(1, 1, 1, 2).getValues()[0];
    return h[0] === COT_DAU[0] && h[1] === COT_DAU[1];
  });
}

// Gom kết quả của một bài theo mã học sinh: lần điểm cao nhất, số lần làm, lần gần nhất
function ketQuaBai(sh, loai) {
  const out = {};
  const last = sh.getLastRow(), cols = sh.getLastColumn();
  if (last < 2) return { kq: out, chuDe: [] };
  const head = sh.getRange(1, 1, 1, cols).getValues()[0];
  const chuDe = head.slice(COT_DAU.length, cols - COT_CUOI.length).map(String);
  sh.getRange(2, 1, last - 1, cols).getValues().forEach(function (r) {
    const u = soMa(r[1]);
    const diem = Number(r[7]);
    if (!u || r[7] === '' || isNaN(diem)) return;
    if (loai && loai !== LOAI[0] && r[5] !== loai) return;
    const k = out[u] || (out[u] = { diem: -1, lan: 0, moi: null, phut: '', yeu: '' });
    k.lan++;
    if (r[0] instanceof Date && (!k.moi || r[0] > k.moi)) k.moi = r[0];
    if (diem > k.diem) {
      k.diem = diem;
      k.phut = r[11];
      k.yeu = chuDe.filter(function (ten, i) {
        const m = String(r[COT_DAU.length + i]).match(/^(\d+)\/(\d+)$/);
        return m && Number(m[2]) > 0 && Number(m[1]) / Number(m[2]) < 0.5;
      }).join(', ');
    }
  });
  return { kq: out, chuDe: chuDe };
}

function oChon(sh, row, list, macDinh) {
  const cell = sh.getRange(row, 2);
  if (list.length) cell.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(list, true).setAllowInvalid(false).build());
  let v = String(cell.getValue()).trim();
  if (list.indexOf(v) < 0) { v = list.length ? (macDinh || list[0]) : ''; cell.setValue(v); }
  return v;
}

function xoaBang(sh, tuDong) {
  const last = sh.getLastRow(), cols = Math.max(sh.getLastColumn(), 1);
  if (last >= tuDong) sh.getRange(tuDong, 1, last - tuDong + 1, cols).clearContent();
}

function trangTinh(ten) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(ten) || ss.insertSheet(ten, 1);
}

function capNhatXemDiem() {
  const sh = trangTinh(TAB_XEM);
  const hs = dsHocSinh(), bai = dsBai();
  sh.getRange(1, 1, 3, 1).setValues([['Lớp'], ['Bài'], ['Loại bài']]).setFontWeight('bold');
  const lop = oChon(sh, 1, dsLop(hs));
  const tenBai = oChon(sh, 2, bai.map(function (b) { return b.getName(); }));
  const loai = oChon(sh, 3, LOAI);
  xoaBang(sh, DONG_XEM - 2);
  const shBai = bai.filter(function (b) { return b.getName() === tenBai; })[0];
  const lopHS = hs.filter(function (h) { return h.c === lop; });
  if (!shBai || !lopHS.length) {
    sh.getRange(DONG_XEM - 2, 1).setValue(!lopHS.length ? 'Chưa có học sinh nào trong trang tính Học sinh.' : 'Chưa có bài nào có kết quả.');
    return;
  }
  const kq = ketQuaBai(shBai, loai).kq;
  let daLam = 0, tong = 0;
  const rows = lopHS.map(function (h, i) {
    const k = kq[h.u];
    if (!k) return [i + 1, h.n, h.u, 'chưa làm', 0, '', '', ''];
    daLam++; tong += k.diem;
    return [i + 1, h.n, h.u, k.diem, k.lan, k.moi || '', k.phut, k.yeu];
  });
  sh.getRange(DONG_XEM - 2, 1).setValue('Đã làm: ' + daLam + '/' + lopHS.length +
    (daLam ? '   ·   Điểm trung bình (các em đã làm): ' + Math.round(tong / daLam * 10) / 10 : ''));
  sh.getRange(DONG_XEM, 1, 1, 8).setValues([['STT', 'Họ tên', 'Mã HS', 'Điểm cao nhất', 'Số lần làm', 'Lần gần nhất', 'Thời gian (phút)', 'Phần còn yếu (dưới 50%)']]).setFontWeight('bold');
  sh.getRange(DONG_XEM + 1, 1, rows.length, 8).setValues(rows);
  sh.getRange(DONG_XEM + 1, 6, rows.length, 1).setNumberFormat('dd/MM HH:mm');
  sh.setFrozenRows(DONG_XEM);
}

function capNhatSoDiem() {
  const sh = trangTinh(TAB_SO);
  const hs = dsHocSinh(), bai = dsBai();
  sh.getRange(1, 1).setValue('Lớp').setFontWeight('bold');
  const lop = oChon(sh, 1, dsLop(hs));
  xoaBang(sh, DONG_SO - 2);
  const lopHS = hs.filter(function (h) { return h.c === lop; });
  if (!lopHS.length) {
    sh.getRange(DONG_SO - 2, 1).setValue('Chưa có học sinh nào trong trang tính Học sinh.');
    return;
  }
  sh.getRange(DONG_SO - 2, 1).setValue('Điểm cao nhất của từng bài. Ô trống = chưa làm.');
  const kqs = bai.map(function (b) { return ketQuaBai(b, '').kq; });
  const head = ['STT', 'Họ tên', 'Mã HS'].concat(bai.map(function (b) { return b.getName(); }), ['Số bài đã làm']);
  const rows = lopHS.map(function (h, i) {
    let n = 0;
    const d = kqs.map(function (kq) { const k = kq[h.u]; if (k) n++; return k ? k.diem : ''; });
    return [i + 1, h.n, h.u].concat(d, [n + '/' + bai.length]);
  });
  sh.getRange(DONG_SO, 1, 1, head.length).setValues([head]).setFontWeight('bold');
  sh.getRange(DONG_SO + 1, 1, rows.length, head.length).setValues(rows);
  sh.setFrozenRows(DONG_SO);
}

// Menu "Bảng điểm": tạo hai trang tính nếu chưa có, rồi cập nhật
function capNhatBangDiem() {
  capNhatXemDiem();
  capNhatSoDiem();
}

// Tự cập nhật khi đổi ô chọn Lớp / Bài / Loại bài
function onEdit(e) {
  if (!e || !e.range) return;
  const ten = e.range.getSheet().getName();
  if (e.range.getColumn() !== 2) return;
  if (ten === TAB_XEM && e.range.getRow() <= 3) capNhatXemDiem();
  else if (ten === TAB_SO && e.range.getRow() === 1) capNhatSoDiem();
}
