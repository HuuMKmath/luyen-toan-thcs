// Script cho MỘT Google Sheet dùng chung cả website luyện toán.
//  - Trang tính "Học sinh": cột A = Lớp, B = Họ tên, C = Mã HS (dòng 1 là tiêu đề).
//  - Mỗi bài học có một trang tính riêng, script tự tạo khi có kết quả đầu tiên của bài đó.
//  - Chỉ ghi điểm khi mã học sinh có trong trang tính "Học sinh".
//  - Chỉ ghi điểm ở bài đúng khối lớp của học sinh; tạm ngừng tra mã khi có quá nhiều lần nhập mã sai (chống dò mã).
//  - Trang tính "Thưởng": script tự tạo, lưu XP, chuỗi ngày và huy hiệu của từng học sinh để đổi máy vẫn giữ được.
//  - Bảng xếp hạng lớp và khối: học sinh chỉ thấy lớp, khối của mình (XP tuần này và tổng XP, tên viết tắt).
//    Tắt cả hai bằng BXH_BAT = false; chỉ tắt bảng khối bằng BXH_KHOI = false.
//  - Menu "Bảng điểm" tạo hai trang tính "Xem điểm" (một lớp, một bài) và "Sổ điểm" (một lớp, mọi bài).
// Thêm bài mới trên website KHÔNG cần sửa script này.

const TAB_HS = 'Học sinh';
const TAB_XEM = 'Xem điểm'; // một lớp, một bài
const TAB_SO = 'Sổ điểm';   // một lớp, tất cả các bài
const TAB_THUONG = 'Thưởng'; // XP, chuỗi ngày, huy hiệu
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

// Chống dò mã: nếu trong SAI_PHUT phút có quá SAI_TOI_DA lần nhập mã sai (tính chung mọi máy),
// script tạm ngừng tra mã cho đến hết khoảng thời gian đó. Học sinh đã đăng nhập và việc nộp bài không bị ảnh hưởng.
const SAI_TOI_DA = 40;
const SAI_PHUT = 10;
const KHOA_SAI = 'tra-ma-sai';

function soLanSai() {
  const v = CacheService.getScriptCache().get(KHOA_SAI);
  if (!v) return { n: 0, t: 0 };
  const p = v.split('|');
  return { n: Number(p[0]) || 0, t: Number(p[1]) || 0 };
}

function ghiLanSai() {
  const now = Date.now();
  const cu = soLanSai();
  const t = cu.t && now - cu.t < SAI_PHUT * 60000 ? cu.t : now; // mốc bắt đầu của khoảng đang đếm
  const n = t === cu.t ? cu.n + 1 : 1;
  const con = Math.max(1, Math.ceil((t + SAI_PHUT * 60000 - now) / 1000));
  CacheService.getScriptCache().put(KHOA_SAI, n + '|' + t, con);
}

// Trang hỏi: mã học sinh này có trong danh sách không?
function doGet(e) {
  const ma = e && e.parameter && e.parameter.ma;
  if (!ma) return ok('ready');
  try {
    if (soLanSai().n >= SAI_TOI_DA) return json({ ok: false, err: 1 }); // đang tạm ngừng tra mã
    const hs = timHocSinh(ma);
    if (!hs) ghiLanSai();
    if (hs && e.parameter.tiendo) return json(tienDo(hs, ma)); // trang chung: tiến độ cá nhân
    if (hs && e.parameter.bxh) return json(bangXepHang(hs, ma)); // bảng xếp hạng của lớp học sinh
    return json(hs ? { ok: true, n: hs.n, c: hs.c } : { ok: false });
  } catch (err) {
    return json({ ok: false, err: 1 });
  }
}

// Tiến độ cá nhân cho trang chung: mỗi bài học = điểm cao nhất, số lần làm, lần gần nhất, phần còn yếu.
// Chỉ trả về dữ liệu của chính học sinh có mã này (mã đã qua bước tra và chống dò ở doGet).
function tienDo(hs, ma) {
  const u = soMa(ma);
  const bai = {};
  dsBai().forEach(function (sh) {
    const k = ketQuaBai(sh, '').kq[u];
    if (k) bai[sh.getName()] = {
      d: k.diem, l: k.lan, p: k.phut,
      t: k.moi ? Utilities.formatDate(k.moi, 'Asia/Ho_Chi_Minh', 'dd/MM HH:mm') : '',
      y: k.yeu
    };
  });
  return { ok: true, n: hs.n, c: hs.c, bai: bai };
}

/* ---------- Khối lớp ---------- */
// Khối của học sinh = số đầu tiên trong tên lớp (7A, 6T1). Khối của bài = số đứng đầu tên trang tính ("7 - Tam giác bằng nhau").
function khoiLop(lop) { const m = String(lop || '').match(/\d+/); return m ? m[0] : ''; }
function khoiBai(tab) { const m = String(tab || '').match(/^\s*(\d+)/); return m ? m[1] : ''; }

/* ---------- Nhận kết quả bài kiểm tra ---------- */

function tenTab(s) {
  return String(s || '').replace(/[\[\]\*\?\/\\:]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.gm) return thuongDongBo(body);
    const code = String(body.code || '');
    const cut = code.indexOf('-');
    const tab = tenTab(body.bai);
    const keys = Array.isArray(body.tk) ? body.tk.slice(0, 12).map(String) : [];
    const names = Array.isArray(body.tn) ? body.tn.slice(0, 12).map(function (s) { return String(s).slice(0, 60); }) : [];
    if (cut < 1 || !tab || tab === TAB_HS || tab === TAB_XEM || tab === TAB_SO || tab === TAB_THUONG || keys.length !== names.length) return ok('bad');
    const text = Utilities.newBlob(Utilities.base64Decode(code.slice(cut + 1))).getDataAsString('UTF-8');
    const o = JSON.parse(text);

    // Chỉ nhận kết quả của học sinh có mã trong danh sách
    const hs = timHocSinh(o.u);
    if (!hs) return ok('nocode');
    // Học sinh chỉ được ghi điểm ở bài đúng khối của mình
    const kb = khoiBai(tab), kl = khoiLop(hs.c);
    if (kb && kl && kb !== kl) return ok('wronggrade');
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


/* ---------- Điểm thưởng (XP, chuỗi ngày, huy hiệu) ---------- */
// Trang web gửi: { gm:1, u:<mã HS>, dx:<XP mới thêm>, pid:<mã gói>, g:{streak,last,day,dayCorrect,goalDay,badges,stats} }.
// XP được cộng dồn theo dx (mỗi pid chỉ cộng một lần), nên học sinh dùng hai máy vẫn không mất XP.
// Các trường còn lại được gộp: ngày mới hơn thắng, huy hiệu lấy hợp của hai bên, số liệu lấy giá trị lớn hơn.
// Mã sai tính vào bộ đếm chống dò mã như khi đăng nhập.
// Chú ý: XP chỉ là phần thưởng, không phải điểm. Máy học sinh gửi gì thì lưu nấy (có giới hạn mỗi lần).

const COT_THUONG = ['Mã HS', 'Họ tên', 'Lớp', 'XP', 'Chuỗi ngày', 'Ngày gần nhất', 'Số huy hiệu', 'Dữ liệu', 'Cập nhật', 'XP tuần', 'Tuần (từ thứ Hai)'];
const DX_TOI_DA = 3000; // XP tối đa được cộng trong một lần gửi
// XP tối đa được cộng trong một ngày (giờ Việt Nam). Website đã giới hạn 3 lần mỗi gói và 8 gói hoặc 120 phút mỗi ngày;
// mức này chặn thêm ở Sheet để em nào vượt giới hạn trên máy (ví dụ dùng trình duyệt ẩn danh) cũng không cộng XP quá mức.
const XP_NGAY_TOI_DA = 2500;

function gMacDinh() {
  return { xp: 0, streak: 0, last: '', day: '', dayCorrect: 0, goalDay: '', badges: {}, stats: { retry: 0, bestCombo: 0 }, pids: [] };
}

function soDuong(x, max) { const n = Math.floor(Number(x)); return isFinite(n) && n > 0 ? Math.min(n, max) : 0; }
function ngayChuoi(x) { const t = String(x || ''); return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : ''; }

// Gộp phần "không phải XP" của hai bản
function gopThuong(a, b) {
  const o = gMacDinh();
  const lastA = ngayChuoi(a.last), lastB = ngayChuoi(b.last);
  if (lastA > lastB || (lastA === lastB && soDuong(a.streak, 10000) >= soDuong(b.streak, 10000))) { o.last = lastA; o.streak = soDuong(a.streak, 10000); }
  else { o.last = lastB; o.streak = soDuong(b.streak, 10000); }
  const dA = ngayChuoi(a.day), dB = ngayChuoi(b.day);
  if (dA > dB || (dA === dB && soDuong(a.dayCorrect, 1000) >= soDuong(b.dayCorrect, 1000))) { o.day = dA; o.dayCorrect = soDuong(a.dayCorrect, 1000); }
  else { o.day = dB; o.dayCorrect = soDuong(b.dayCorrect, 1000); }
  const gA = ngayChuoi(a.goalDay), gB = ngayChuoi(b.goalDay);
  o.goalDay = gA > gB ? gA : gB;
  [a.badges, b.badges].forEach(function (bd) {
    Object.keys(bd || {}).slice(0, 40).forEach(function (id) {
      const d = ngayChuoi(bd[id]);
      if (/^\w{1,20}$/.test(id) && d && (!o.badges[id] || d < o.badges[id])) o.badges[id] = d;
    });
  });
  o.stats.retry = Math.max(soDuong((a.stats || {}).retry, 100000), soDuong((b.stats || {}).retry, 100000));
  o.stats.bestCombo = Math.max(soDuong((a.stats || {}).bestCombo, 100000), soDuong((b.stats || {}).bestCombo, 100000));
  return o;
}

function thuongDongBo(body) {
  try {
    if (soLanSai().n >= SAI_TOI_DA) return json({ ok: false, err: 1 });
    const hs = timHocSinh(body.u);
    if (!hs) { ghiLanSai(); return json({ ok: false }); }
    const ma = soMa(body.u);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(TAB_THUONG);
    if (!sh) {
      sh = ss.insertSheet(TAB_THUONG, ss.getNumSheets());
      sh.getRange(1, 1, 1, COT_THUONG.length).setValues([COT_THUONG]).setFontWeight('bold');
      sh.getRange(2, 1, 998, 1).setNumberFormat('@');
      sh.setFrozenRows(1);
    }
    if (sh.getLastColumn() < COT_THUONG.length) sh.getRange(1, 1, 1, COT_THUONG.length).setValues([COT_THUONG]).setFontWeight('bold');
    // Tìm dòng của học sinh
    let row = 0, cu = gMacDinh();
    const last = sh.getLastRow();
    if (last > 1) {
      const maCot = sh.getRange(2, 1, last - 1, 1).getValues();
      for (let i = 0; i < maCot.length; i++) if (soMa(maCot[i][0]) === ma) { row = i + 2; break; }
    }
    if (row) {
      try { cu = Object.assign(gMacDinh(), JSON.parse(sh.getRange(row, 8).getValue() || '{}')); } catch (err) { cu = gMacDinh(); }
    }
    const g = gopThuong(cu, body.g || {});
    g.xp = soDuong(cu.xp, 100000000);
    g.pids = Array.isArray(cu.pids) ? cu.pids.slice(-30).map(String) : [];
    const pid = String(body.pid || '').slice(0, 40);
    const dx = soDuong(body.dx, DX_TOI_DA);
    const tuan = tuanNay();
    g.wk = tuan; g.wxp = cu.wk === tuan ? soDuong(cu.wxp, 100000000) : 0; // XP tuần: sang tuần mới thì tính lại từ 0
    const homNay = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    g.dn = homNay; g.dxn = cu.dn === homNay ? soDuong(cu.dxn, 100000000) : 0; // XP đã cộng trong hôm nay
    const nhan = Math.min(dx, Math.max(0, XP_NGAY_TOI_DA - g.dxn));
    if (dx && pid && g.pids.indexOf(pid) < 0) { g.xp += nhan; g.wxp += nhan; g.dxn += nhan; g.pids.push(pid); g.pids = g.pids.slice(-30); }
    const hang = [ma, hs.n, hs.c, g.xp, g.streak, g.last, Object.keys(g.badges).length, JSON.stringify(g), new Date(), g.wxp, tuan];
    if (row) sh.getRange(row, 1, 1, COT_THUONG.length).setValues([hang]);
    else { sh.appendRow(hang); sh.getRange(sh.getLastRow(), 1).setNumberFormat('@').setValue(ma); }
    delete g.pids;
    CacheService.getScriptCache().remove(khoaBxh(khoiLop(hs.c) || hs.c));
    return json({ ok: true, g: g });
  } catch (err) {
    return json({ ok: false, err: 1 });
  }
}

/* ---------- Bảng xếp hạng lớp ---------- */
// Học sinh (đã qua bước tra mã) chỉ nhận bảng của chính lớp mình và của khối mình (khối = số đầu tên lớp): 10 bạn đứng đầu theo XP tuần này và theo tổng XP,
// tên viết tắt (ví dụ "N.V. An"), kèm thứ hạng của chính em. Lớp "GV" (mã giáo viên) không được xếp hạng,
// nhưng mã giáo viên xem được bảng đầy đủ của mọi lớp, mọi khối (bxhGiaoVien).
const BXH_BAT = true;   // đặt false để tắt bảng xếp hạng trên website
const BXH_KHOI = true;  // đặt false để chỉ giữ bảng lớp, tắt bảng xếp hạng toàn khối
const BXH_SO = 10;      // số bạn hiện trong bảng

// Ngày thứ Hai của tuần hiện tại (giờ Việt Nam), dạng yyyy-MM-dd
function tuanNay() {
  const tz = 'Asia/Ho_Chi_Minh', now = new Date();
  const thu = Number(Utilities.formatDate(now, tz, 'u')); // 1 = thứ Hai ... 7 = Chủ nhật
  return Utilities.formatDate(new Date(now.getTime() - (thu - 1) * 86400000), tz, 'yyyy-MM-dd');
}
function khoaBxh(lop) { return 'bxh:' + String(lop || '').slice(0, 40); }
function laLopGV(lop) { return /^\s*gv\s*$/i.test(String(lop || '')); }

function tenTat(ten) {
  const p = String(ten || '').trim().split(/\s+/).filter(String);
  if (p.length < 2) return p[0] || '';
  return p.slice(0, -1).map(function (w) { return w.charAt(0).toUpperCase() + '.'; }).join('') + ' ' + p[p.length - 1];
}

function xepHang(ds, truong, ma, kemLop) {
  const s = ds.slice().sort(function (a, b) { return b[truong] - a[truong] || (a.t < b.t ? -1 : a.t > b.t ? 1 : 0); });
  let hang = 0, truoc = -1, toi = null;
  const out = s.map(function (h, i) {
    if (h[truong] !== truoc) { hang = i + 1; truoc = h[truong]; }
    const o = { r: hang, n: h.t, x: h[truong], me: h.u === ma ? 1 : 0 };
    if (kemLop) o.l = h.l; // bảng khối: ghi kèm lớp để phân biệt các bạn trùng tên viết tắt
    if (o.me) toi = o;
    return o;
  });
  return { top: out.slice(0, BXH_SO), toi: toi };
}

// Bảng xếp hạng cho giáo viên (mã lớp "GV"): mọi học sinh trong trang tính "Học sinh", nhóm theo khối,
// họ tên đầy đủ, lớp, tổng XP và XP tuần này. Trang web tự xếp hạng theo khối hoặc theo từng lớp.
// Em chưa có dòng ở trang tính "Thưởng" vẫn hiện với 0 XP để giáo viên biết em nào chưa luyện tập.
function bxhGiaoVien() {
  const tuan = tuanNay(), xpCua = {};
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_THUONG);
  if (sh && sh.getLastRow() > 1) {
    const cot = Math.max(sh.getLastColumn(), COT_THUONG.length);
    sh.getRange(2, 1, sh.getLastRow() - 1, cot).getValues().forEach(function (r) {
      const m = soMa(r[0]);
      if (!m) return;
      const wxp = String(r[10] instanceof Date ? Utilities.formatDate(r[10], 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') : r[10]) === tuan ? soDuong(r[9], 100000000) : 0;
      xpCua[m] = { a: soDuong(r[3], 100000000), w: wxp };
    });
  }
  // Một mã có thể nằm ở nhiều dòng (ví dụ lớp chính khóa và lớp học thêm): mỗi khối chỉ hiện em đó MỘT lần,
  // l = lớp ở dòng đầu tiên, ls = mọi lớp của em (trang web dùng ls để lọc theo từng lớp).
  const khoi = {}, daCo = {};
  dsHocSinh().forEach(function (h) {
    if (!h.u || !h.c || laLopGV(h.c)) return;
    const k = khoiLop(h.c) || h.c, key = k + '|' + h.u;
    if (daCo[key]) { if (daCo[key].ls.indexOf(h.c) < 0) daCo[key].ls.push(h.c); return; }
    const x = xpCua[h.u] || { a: 0, w: 0 };
    daCo[key] = { n: h.n, l: h.c, ls: [h.c], a: x.a, w: x.w };
    (khoi[k] = khoi[k] || []).push(daCo[key]);
  });
  return { ok: true, gv: 1, tuan: tuan, khoi: khoi };
}

function bangXepHang(hs, ma) {
  if (!BXH_BAT) return { ok: true, off: 1 };
  if (laLopGV(hs.c)) return bxhGiaoVien(); // mã giáo viên: xem bảng của mọi lớp, mọi khối
  const khoi = khoiLop(hs.c);
  const u = soMa(ma), cache = CacheService.getScriptCache(), k = khoaBxh(khoi || hs.c);
  let ds = null;
  try { ds = JSON.parse(cache.get(k) || 'null'); } catch (err) { ds = null; }
  if (!ds) {
    // Lớp lấy theo trang tính "Học sinh" hiện tại (học sinh chuyển lớp thì đi theo lớp mới).
    // Lấy cả khối một lần (bảng lớp lọc lại từ đây), bỏ lớp GV.
    // Một mã có thể nằm ở nhiều lớp (chính khóa và học thêm): em đó chỉ được tính MỘT lần,
    // lớp hiển thị là lớp ở dòng đầu tiên (giống lúc tra mã), ls = mọi lớp để xếp vào bảng của từng lớp.
    const lopCua = {}, tenCua = {}, lopsCua = {};
    dsHocSinh().forEach(function (h) {
      if (!h.u) return;
      if (!lopsCua[h.u]) { lopsCua[h.u] = []; lopCua[h.u] = h.c; tenCua[h.u] = h.n; }
      if (lopsCua[h.u].indexOf(h.c) < 0) lopsCua[h.u].push(h.c);
    });
    const cungKhoi = function (lop) { return !laLopGV(lop) && (khoi ? khoiLop(lop) === khoi : lop === hs.c); };
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_THUONG);
    const tuan = tuanNay();
    ds = [];
    if (sh && sh.getLastRow() > 1) {
      const cot = Math.max(sh.getLastColumn(), COT_THUONG.length);
      sh.getRange(2, 1, sh.getLastRow() - 1, cot).getValues().forEach(function (r) {
        const m = soMa(r[0]);
        if (!m || !lopsCua[m] || !lopsCua[m].some(cungKhoi)) return;
        const xp = soDuong(r[3], 100000000);
        const wxp = String(r[10] instanceof Date ? Utilities.formatDate(r[10], 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') : r[10]) === tuan ? soDuong(r[9], 100000000) : 0;
        ds.push({ u: m, t: tenTat(tenCua[m]), l: lopCua[m], ls: lopsCua[m], a: xp, w: wxp });
      });
    }
    try { cache.put(k, JSON.stringify(ds), 120); } catch (err) {}
  }
  if (!ds.some(function (h) { return h.u === u; })) ds.push({ u: u, t: tenTat(hs.n), l: hs.c, ls: [hs.c], a: 0, w: 0 });
  const lop = ds.filter(function (h) { return (h.ls || [h.l]).indexOf(hs.c) >= 0; });
  const out = { ok: true, c: hs.c, tuan: tuanNay(), so: lop.length, tuanNay: xepHang(lop, 'w', u, false), tatCa: xepHang(lop, 'a', u, false) };
  if (BXH_KHOI && khoi) out.khoi = { k: khoi, so: ds.length, tuanNay: xepHang(ds, 'w', u, true), tatCa: xepHang(ds, 'a', u, true) };
  return out;
}
