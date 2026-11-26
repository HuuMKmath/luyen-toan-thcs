// Phần "giống Google Sheet cũ" của hàm máy chủ: các trang web vẫn gọi đúng như khi gọi Apps Script
// (bản dựng cho Cloudflare chỉ đổi địa chỉ SHEET_URL sang hàm này), máy chủ trả lời cùng dạng nhưng đọc, ghi Supabase.
//
//   GET  ?ma=…                → {ok, n, c}                     tra mã học sinh
//   GET  ?ma=…&tiendo=1       → {ok, n, c, bai, goi, mo}       tiến độ (trang Các bài, khóa bài)
//   GET  ?ma=…&bxh=1          → bảng xếp hạng lớp, khối (mã GV: mọi khối)
//   GET  ?ma=…&sodiem=1[&lop=…] → sổ điểm (chỉ mã GV): danh sách lớp, bài; có lop thì kèm điểm cả lớp
//   POST {gm:1, u, g, pid, dx} → {ok, g}                        đồng bộ XP, chuỗi ngày, huy hiệu
//   POST {xg:1, u, bai, goi}   → {ok}                           ghi gói NB/TH/VD đã làm hết câu
// Mọi yêu cầu đều qua bước chống dò mã giống lúc đăng nhập.
import { SAI_TOI_DA, SAI_PHUT } from "./xu-ly.js";

export const DX_TOI_DA = 3000;          // XP tối đa cộng trong một lần gửi (giống Code.gs)
export const XP_NGAY_TOI_DA = 2500;     // XP tối đa cộng trong một ngày
const BXH_SO = 10;
const GOI_MUC = ["NB", "TH", "VD"];

const soMa = x => String(x == null ? "" : x).replace(/\D/g, "");
const soDuong = (x, max) => { const n = Math.floor(Number(x)); return isFinite(n) && n > 0 ? Math.min(n, max) : 0; };
const ngayChuoi = x => { const t = String(x || ""); return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : ""; };
const laGV = c => /^\s*gv\s*$/i.test(String(c || ""));
const chuanTen = s => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
const khoiLop = s => { const m = String(s || "").match(/\d+/); return m ? m[0] : ""; };

// Giờ Việt Nam
function vn(ms) {
  const d = new Date(ms + 7 * 3600 * 1000);
  const p = n => String(n).padStart(2, "0");
  return { ngay: `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`, thu: d.getUTCDay() || 7, gio: `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}` };
}
export function tuanNay(ms) { const t = vn(ms); return vn(ms - (t.thu - 1) * 86400000).ngay; }

export function tenTat(ten) {
  const p = String(ten || "").trim().split(/\s+/).filter(Boolean);
  if (p.length < 2) return p[0] || "";
  return p.slice(0, -1).map(w => w.charAt(0).toUpperCase() + ".").join("") + " " + p[p.length - 1];
}

/* Học sinh theo mã, kèm lớp. Trả về null nếu mã sai / chưa xếp lớp.
   c = lớp chính (lớp đầu tiên, không kể lớp GV); mã chỉ ở lớp GV thì c = "GV". */
export async function hocSinhVaLop(db, ma) {
  const hs = ma.length === 6 ? await db.timHocSinh(ma) : null;
  if (!hs) return null;
  const lops = await db.cacLop(hs.id);          // [{ten, khoi, loai}] theo thứ tự
  if (!lops.length) return { ...hs, lops, chuaXepLop: true };
  const thuong = lops.filter(l => l.loai !== "gv");
  const gv = lops.some(l => l.loai === "gv");
  return { ...hs, lops, gv, c: thuong.length ? thuong[0].ten : "GV", khoi: thuong.length ? thuong[0].khoi : null };
}

function gMacDinh() {
  return { xp: 0, streak: 0, last: "", day: "", dayCorrect: 0, goalDay: "", badges: {}, stats: { retry: 0, bestCombo: 0 }, pids: [] };
}
// Gộp phần "không phải XP" của hai bản (giống gopThuong trong Code.gs)
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
  [a.badges, b.badges].forEach(bd => {
    Object.keys(bd || {}).slice(0, 40).forEach(id => {
      const d = ngayChuoi(bd[id]);
      if (/^\w{1,20}$/.test(id) && d && (!o.badges[id] || d < o.badges[id])) o.badges[id] = d;
    });
  });
  o.stats.retry = Math.max(soDuong((a.stats || {}).retry, 100000), soDuong((b.stats || {}).retry, 100000));
  o.stats.bestCombo = Math.max(soDuong((a.stats || {}).bestCombo, 100000), soDuong((b.stats || {}).bestCombo, 100000));
  return o;
}

async function thuongDongBo(db, hs, body, bay_gio) {
  const dong = await db.docThuong(hs.id);       // dòng bảng thuong hoặc null
  const cu = Object.assign(gMacDinh(), dong ? (dong.du_lieu || {}) : {});
  if (dong) {
    cu.xp = dong.xp; cu.badges = dong.huy_hieu || {}; cu.streak = dong.chuoi_ngay; cu.last = dong.ngay_cuoi || "";
    cu.wk = dong.tuan || ""; cu.wxp = dong.xp_tuan;
  }
  const g = gopThuong(cu, body.g || {});
  g.xp = soDuong(cu.xp, 100000000);
  g.pids = Array.isArray(cu.pids) ? cu.pids.slice(-30).map(String) : [];
  const pid = String(body.pid || "").slice(0, 40);
  const dx = soDuong(body.dx, DX_TOI_DA);
  const tuan = tuanNay(bay_gio);
  g.wk = tuan; g.wxp = cu.wk === tuan ? soDuong(cu.wxp, 100000000) : 0;
  const homNay = vn(bay_gio).ngay;
  g.dn = homNay; g.dxn = cu.dn === homNay ? soDuong(cu.dxn, 100000000) : 0;
  const nhan = Math.min(dx, Math.max(0, XP_NGAY_TOI_DA - g.dxn));
  if (dx && pid && g.pids.indexOf(pid) < 0) { g.xp += nhan; g.wxp += nhan; g.dxn += nhan; g.pids.push(pid); g.pids = g.pids.slice(-30); }
  const { xp, wxp, wk, streak, last, badges, ...con_lai } = g;
  await db.ghiThuong(hs.id, {
    xp, xp_tuan: wxp, tuan: wk, chuoi_ngay: streak, ngay_cuoi: last || null, huy_hieu: badges, du_lieu: con_lai,
    cap_nhat: new Date(bay_gio).toISOString(),
  });
  delete g.pids;
  return { ok: true, g };
}

/* Tiến độ: bai["<tên trang tính cũ>"] = {d: điểm cao nhất, l: số lần, p: phút của lần cao nhất, t: lần gần nhất,
   y: phần còn yếu của lần cao nhất, k: điểm cao nhất bài Kiểm tra 25 phút / Thử thách}; Thử thách ghi ở "<tên> - Thử thách". */
async function tienDo(db, hs) {
  const [ds, bai, goi, mo] = await Promise.all([db.luotDaNop(hs.id), db.dsBai(), db.goiXong(hs.id), db.moBai()]);
  const tab = {}; bai.forEach(b => { tab[b.id] = b.tab_cu || b.id; });
  const out = {};
  for (const l of ds) {
    if (!tab[l.bai_id] || l.diem == null) continue;
    const ten = l.loai === "thu_thach" ? tab[l.bai_id] + " - Thử thách" : tab[l.bai_id];
    const k = out[ten] || (out[ten] = { d: -1, l: 0, p: "", t: "", y: "", k: -1, _moi: 0 });
    const diem = Number(l.diem);
    k.l++;
    if (l.loai !== "kt5" && diem > k.k) k.k = diem;
    const nop = Date.parse(l.nop_luc);
    if (nop > k._moi) { k._moi = nop; k.t = vn(nop).gio; }
    if (diem > k.d) {
      k.d = diem;
      const phut = (nop - Date.parse(l.bat_dau)) / 60000;
      k.p = isFinite(phut) && phut >= 0 ? Math.round(phut * 10) / 10 : "";
      k.y = Object.entries(l.diem_dang || {}).filter(([, v]) => Array.isArray(v) && v[1] > 0 && v[0] / v[1] < 0.5).map(([t]) => t).join(", ");
    }
  }
  Object.values(out).forEach(k => delete k._moi);
  const goiOut = {};
  goi.forEach(g => { if (tab[g.bai_id]) { const t = tab[g.bai_id]; goiOut[t] = ((goiOut[t] ? goiOut[t] + " " : "") + g.goi).trim(); } });
  Object.keys(goiOut).forEach(t => { goiOut[t] = GOI_MUC.filter(m => goiOut[t].split(" ").includes(m)).join(" "); });
  // Bài giáo viên đã mở: theo tên lớp, số khối hoặc "Tất cả"
  const lops = hs.lops.map(l => chuanTen(l.ten)), khois = hs.lops.map(l => String(l.khoi || khoiLop(l.ten)));
  const moOut = [];
  mo.forEach(m => {
    const p = chuanTen(m.pham_vi);
    if (!tab[m.bai_id]) return;
    if (p === "tất cả" || lops.includes(p) || (/^\d+$/.test(p) && khois.includes(p))) moOut.push(tab[m.bai_id]);
  });
  return { ok: true, n: hs.ho_ten, c: hs.c, bai: out, goi: goiOut, mo: moOut };
}

function xepHang(ds, truong, ma, kemLop) {
  const s = ds.slice().sort((a, b) => b[truong] - a[truong] || (a.t < b.t ? -1 : a.t > b.t ? 1 : 0));
  let hang = 0, truoc = -1, toi = null;
  const out = s.map((h, i) => {
    if (h[truong] !== truoc) { hang = i + 1; truoc = h[truong]; }
    const o = { r: hang, n: h.t, x: h[truong], me: h.u === ma ? 1 : 0 };
    if (kemLop) o.l = h.l;
    if (o.me) toi = o;
    return o;
  });
  return { top: out.slice(0, BXH_SO), toi };
}

async function bangXepHang(db, hs, bay_gio) {
  const tuan = tuanNay(bay_gio);
  const xpTuan = r => (r.tuan && String(r.tuan).slice(0, 10) === tuan ? r.xp_tuan || 0 : 0);
  if (hs.c === "GV" || (hs.gv && !hs.khoi)) {
    // Mã giáo viên: mọi học sinh, nhóm theo khối, họ tên đầy đủ
    const khoi = {};
    for (const r of await db.dsXepHang(null)) {
      (khoi[r.khoi] = khoi[r.khoi] || []).push({ n: r.ho_ten, l: r.cac_lop[0], ls: r.cac_lop, a: r.xp || 0, w: xpTuan(r) });
    }
    return { ok: true, gv: 1, tuan, khoi };
  }
  const ma = hs.ma_hs;
  const ds = (hs.khoi ? await db.dsXepHang(hs.khoi) : []).map(r => ({ u: r.ma_hs, t: tenTat(r.ho_ten), l: r.cac_lop[0], ls: r.cac_lop, a: r.xp || 0, w: xpTuan(r) }));
  if (!ds.some(h => h.u === ma)) ds.push({ u: ma, t: tenTat(hs.ho_ten), l: hs.c, ls: [hs.c], a: 0, w: 0 });
  const lop = ds.filter(h => h.ls.includes(hs.c));
  const out = { ok: true, c: hs.c, tuan, so: lop.length, tuanNay: xepHang(lop, "w", ma, false), tatCa: xepHang(lop, "a", ma, false) };
  if (hs.khoi) out.khoi = { k: String(hs.khoi), so: ds.length, tuanNay: xepHang(ds, "w", ma, true), tatCa: xepHang(ds, "a", ma, true) };
  return out;
}

/* Sổ điểm cho giáo viên (chỉ mã ở lớp GV).
   Không có lop: {ok, gv:1, lops:[{ten, khoi, so}], bai:[{id, k, t, c}]}
   Có lop:       thêm lop, hs:[{n, d:{<mã bài>:{kt25|kt5|tt:[điểm cao nhất, số lần, lần gần nhất]}}}] (họ tên A→Z). */
const LOAI_SO = { kt25: "kt25", kt5: "kt5", thu_thach: "tt" };
async function soDiem(db, hs, yc) {
  if (!hs.gv) return { ok: false, khong_phai_gv: 1 };
  const [lops, bai] = await Promise.all([db.dsLopDay(), db.dsBaiDayDu()]);
  const out = {
    ok: true, gv: 1,
    lops: lops.map(l => ({ ten: l.ten, khoi: l.khoi, so: l.so })),
    bai: bai.map(b => ({ id: b.id, k: b.khoi, t: b.tieu_de, c: b.chuong })),
  };
  const ten = String(yc.lop || "").trim();
  if (!ten) return out;
  if (!lops.some(l => l.ten === ten)) return { ...out, ok: false, khong_co_lop: 1 };
  const dsHS = await db.hsTrongLop(ten);                 // [{id, ho_ten}]
  const theoId = {};
  const hsOut = dsHS.map(h => (theoId[h.id] = { n: h.ho_ten, d: {} }));
  for (const l of await db.luotCuaHS(dsHS.map(h => h.id))) {
    const o = theoId[l.hoc_sinh_id], loai = LOAI_SO[l.loai];
    if (!o || !loai || l.diem == null || !l.nop_luc) continue;
    const b = o.d[l.bai_id] || (o.d[l.bai_id] = {});
    const k = b[loai] || (b[loai] = [-1, 0, 0]);
    const diem = Number(l.diem), nop = Date.parse(l.nop_luc);
    if (diem > k[0]) k[0] = diem;
    k[1]++;
    if (nop > k[2]) k[2] = nop;
  }
  hsOut.forEach(h => Object.values(h.d).forEach(b => Object.values(b).forEach(k => { k[2] = vn(k[2]).gio; })));
  const tenRieng = n => String(n).trim().split(/\s+/).pop();
  hsOut.sort((a, b) => tenRieng(a.n).localeCompare(tenRieng(b.n), "vi") || a.n.localeCompare(b.n, "vi"));
  return { ...out, lop: ten, hs: hsOut };
}

async function ghiGoiXong(db, hs, body) {
  const goi = String(body.goi || "");
  if (!GOI_MUC.includes(goi)) return { ok: false };
  const ten = String(body.bai || "").replace(/\s+/g, " ").trim();
  const b = (await db.dsBai()).find(x => x.tab_cu === ten || x.id === ten);
  if (!b) return { ok: false };
  if (!hs.gv && hs.khoi && hs.khoi !== b.khoi) return { ok: false };
  await db.ghiGoiXong(hs.id, b.id, goi);
  return { ok: true };
}

/* yc: tham số GET ({ma, tiendo, bxh, sodiem, lop}) hoặc thân POST ({gm|xg, u, ...}). */
export async function xuLyCu(yc, { db, bay_gio = () => Date.now() }) {
  yc = yc || {};
  const ma = soMa(yc.gm || yc.xg ? yc.u : yc.ma);
  if (!ma && !yc.gm && !yc.xg) return "ready";
  if ((await db.demSai(SAI_PHUT)) >= SAI_TOI_DA) return { ok: false, err: 1 };
  const hs = await hocSinhVaLop(db, ma);
  if (!hs) { await db.ghiSai(); return { ok: false }; }
  if (hs.chuaXepLop) return { ok: false, chua_xep_lop: 1 };
  const t = bay_gio();
  if (yc.gm) return thuongDongBo(db, hs, yc, t);
  if (yc.xg) return ghiGoiXong(db, hs, yc);
  if (yc.tiendo) return tienDo(db, hs);
  if (yc.bxh) return bangXepHang(db, hs, t);
  if (yc.sodiem) return soDiem(db, hs, yc);
  return { ok: true, n: hs.ho_ten, c: hs.c };
}
