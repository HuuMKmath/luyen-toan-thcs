// Nhận kết quả bài Tam giác bằng nhau (mã TG7-) và ghi vào bảng tính này.
// Dán vào Apps Script của Google Sheet RIÊNG cho bài này.
// Chỉ ghi điểm khi mã học sinh có trong Sheet "Danh sách học sinh".

// Dán đường link của Google Sheet "Danh sách học sinh" vào giữa hai dấu nháy ở dòng dưới.
const DANH_SACH = 'DÁN_LINK_DANH_SÁCH_HỌC_SINH_VÀO_ĐÂY';

const PREFIX = 'TG7-';
const TOPICS = ['tu', 'ccc', 'cgc', 'gcg'];
const HEADERS = ['Thời điểm nộp', 'Họ tên', 'Lớp', 'Ngày', 'Loại bài', 'Mã đề', 'Điểm', 'Trắc nghiệm', 'Đúng sai', 'Trả lời ngắn',
  'Thời gian (phút)', 'Giới hạn (phút)', 'Tổng quan tam giác', 'Cạnh-cạnh-cạnh', 'Cạnh-góc-cạnh', 'Góc-cạnh-góc', 'Ghi chú', 'Mã kết quả', 'Mã HS'];
const COT_MA_KQ = HEADERS.length - 1; // cột "Mã kết quả" (giữ nguyên vị trí cũ)
const COT_MA_HS = HEADERS.length;     // cột "Mã HS" (cột mới, ở cuối)

// Đọc danh sách học sinh: trang tính đầu tiên, cột A = Lớp, B = Họ tên, C = Mã HS.
function docDanhSach() {
  const ss = DANH_SACH.indexOf('http') === 0 ? SpreadsheetApp.openByUrl(DANH_SACH) : SpreadsheetApp.openById(DANH_SACH);
  const sh = ss.getSheets()[0];
  const last = sh.getLastRow();
  const map = {};
  if (last < 2) return map;
  sh.getRange(2, 1, last - 1, 3).getValues().forEach(function (r) {
    const m = String(r[2]).replace(/\D/g, '');
    if (m) map[m] = { n: String(r[1]).trim(), c: String(r[0]).trim() };
  });
  return map;
}

function timHocSinh(ma) {
  const m = String(ma || '').replace(/\D/g, '');
  if (!m) return null;
  return docDanhSach()[m] || null;
}

// Chạy hàm này một lần trong trình soạn Apps Script để cấp quyền và kiểm tra đã đọc được danh sách.
function kiemTra() {
  const n = Object.keys(docDanhSach()).length;
  Logger.log('Đọc được ' + n + ' học sinh có mã trong danh sách.');
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

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const body = JSON.parse(e.postData.contents);
    const code = String(body.code || '');
    if (code.indexOf(PREFIX) !== 0) return ok('bad');
    const text = Utilities.newBlob(Utilities.base64Decode(code.slice(PREFIX.length))).getDataAsString('UTF-8');
    const o = JSON.parse(text);

    // Chỉ nhận kết quả của học sinh có mã trong danh sách
    const hs = timHocSinh(o.u);
    if (!hs) return ok('nocode');
    const maHS = String(o.u).replace(/\D/g, '');

    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    } else if (!String(sh.getRange(1, COT_MA_HS).getValue()).trim()) {
      sh.getRange(1, COT_MA_HS).setValue('Mã HS').setFontWeight('bold'); // bảng cũ: thêm tiêu đề cột mới
    }
    // Nếu mã kết quả này đã có thì không ghi lại (học sinh bấm gửi lại)
    const last = sh.getLastRow();
    if (last > 1) {
      const codes = sh.getRange(2, COT_MA_KQ, last - 1, 1).getValues();
      for (let i = 0; i < codes.length; i++) if (codes[i][0] === code) return ok('dup');
    }

    const topic = TOPICS.map(function (k) { return o.t && o.t[k] && o.t[k][1] ? o.t[k][0] + '/' + o.t[k][1] : ''; });
    const limit = o.L || (o.q === 'quick' ? 300 : 1500);
    const fast = (typeof o.m === 'number' && o.m < 0.25 * limit && o.s < 5) ? 'Làm nhanh, điểm thấp' : '';
    // Họ tên và lớp lấy từ danh sách của giáo viên, không lấy từ máy học sinh
    const row = [new Date(), hs.n, hs.c, o.d || '', o.q === 'quick' ? 'Kiểm tra nhanh' : 'Kiểm tra', o.k || '',
      o.s, o.p ? o.p[0] : '', o.p ? o.p[1] : '', o.p ? o.p[2] : '',
      typeof o.m === 'number' ? Math.round(o.m / 6) / 10 : '', o.L ? o.L / 60 : ''].concat(topic, [fast, code, maHS]);
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
