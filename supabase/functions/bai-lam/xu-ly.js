// Xử lý các yêu cầu của học sinh. Không gọi thẳng cơ sở dữ liệu: nhận "db" từ ngoài vào
// (index.ts dùng Supabase thật; supabase/kiem-tra/thu_may_chu.mjs dùng cơ sở dữ liệu giả để chạy thử).
//
// Các yêu cầu (POST JSON {viec, ...}):
//   dang_nhap {ma}                                  → {ok, phien, hs:{n, c, khoi, goi}}
//   bat_dau   {phien, bai, che_do, spec?, ma_de?}   → {ok, luot, de, gioi_han}
//   kiem_tra  {phien, luot, cau, tra_loi}           → {ok, oks, lan, mo?}      (chỉ chế độ luyện tập)
//   nop       {phien, luot, tra_loi?}               → {ok, ket_qua, mo}
import { NAP } from "./bai/danh-sach.js";
import { anDapAn, doiTraLoi, moDapAn, loiPhuongAn } from "./phien.js";
import { hocSinhVaLop } from "./tuong-thich.js";

export const SAI_TOI_DA = 40, SAI_PHUT = 10;          // chống dò mã, giống Sheet cũ
const NGAY = 24 * 3600 * 1000;
export const PHIEN_HAN = 30 * NGAY;                    // trang tự quên mã sau 2 ngày không vào; phiên máy chủ sống lâu hơn
const LOAI = { test: "kt25", quick: "kt5", hard: "thu_thach", pisa: "thuc_te", practice: "goi" };
const GIAN_HAN_GIAY = 90;                               // cho phép nộp trễ do mạng chậm

// ---------- Phiên đăng nhập của học sinh (ký HMAC, không lưu trên máy chủ) ----------
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const tuB64 = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
async function khoa(bi_mat) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(bi_mat), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
export async function kyPhien(bi_mat, noi_dung) {
  const than = b64(new TextEncoder().encode(JSON.stringify(noi_dung)));
  const chu_ky = await crypto.subtle.sign("HMAC", await khoa(bi_mat), new TextEncoder().encode(than));
  return than + "." + b64(chu_ky);
}
export async function docPhien(bi_mat, phien, bay_gio = Date.now()) {
  const [than, chu_ky] = String(phien || "").split(".");
  if (!than || !chu_ky) return null;
  let dung = false;
  try { dung = await crypto.subtle.verify("HMAC", await khoa(bi_mat), tuB64(chu_ky), new TextEncoder().encode(than)); } catch { return null; }
  if (!dung) return null;
  const o = JSON.parse(new TextDecoder().decode(tuB64(than)));
  return o.het > bay_gio ? o : null;
}

// ---------- Mô-đun bài (nạp một lần, mỗi phiên dùng một bản riêng) ----------
const daNap = {};
async function bai(ma) {
  if (!NAP[ma]) return null;
  if (!daNap[ma]) daNap[ma] = (await NAP[ma]()).taoBai;
  return daNap[ma];
}

const loi = (ma, thong_bao) => ({ ok: false, loi: ma, thong_bao });

function diemPhan(kq) {
  const out = {};
  for (const k of ["mc", "tf", "sa"]) {
    const x = kq.qres.filter(r => r.kind === k);
    if (x.length) out[k] = `${x.filter(r => (k === "tf" ? r.k === (r.oks || []).length : r.ok)).length}/${x.length}`;
  }
  return out;
}
function diemDang(kq, TOPICS) {
  const out = {};
  for (const [k, v] of Object.entries(kq.topics)) if (v.n) out[(TOPICS[k] && (TOPICS[k].name || TOPICS[k].short)) || k] = [v.c, v.n];
  return out;
}

export async function xuLy(yc, { db, bi_mat, bay_gio = () => Date.now() }) {
  const viec = yc && yc.viec;

  if (viec === "dang_nhap") {
    const ma = String(yc.ma || "").replace(/\D/g, "");
    if ((await db.demSai(SAI_PHUT)) >= SAI_TOI_DA) return loi("tam_khoa", "Hệ thống tạm ngừng tra mã vài phút vì có quá nhiều lần nhập sai. Em thử lại sau nhé.");
    const hs = await hocSinhVaLop(db, ma);
    if (!hs) { await db.ghiSai(); return loi("sai_ma", "Mã học sinh không đúng. Em kiểm tra lại hoặc hỏi thầy cô."); }
    if (hs.chuaXepLop) return loi("chua_xep_lop", "Mã này chưa được xếp vào lớp nào. Em báo thầy cô nhé.");
    const phien = await kyPhien(bi_mat, { hs: hs.id, het: bay_gio() + PHIEN_HAN });
    return { ok: true, phien, hs: { n: hs.ho_ten, c: hs.c, khoi: hs.khoi, goi: hs.goi } };
  }

  const p = await docPhien(bi_mat, yc && yc.phien, bay_gio());
  if (!p) return loi("het_phien", "Phiên đăng nhập đã hết. Em nhập lại mã học sinh nhé.");

  if (viec === "bat_dau") {
    const { che_do, spec } = yc;
    if (!LOAI[che_do]) return loi("sai_che_do", "Loại bài không hợp lệ.");
    const b = await db.baiHoc(yc.bai);
    const taoBai = b && b.da_mo ? await bai(b.id) : null;
    if (!taoBai) return loi("khong_co_bai", "Bài này chưa mở.");
    // Khối của học sinh = khối lớp chính; mã giáo viên (lớp GV) vào được mọi khối; chưa xếp lớp thì không vào được
    const lops = await db.cacLop(p.hs);
    const lopHs = lops.filter(l => l.loai !== "gv");
    if (!lops.length) return loi("chua_xep_lop", "Mã này chưa được xếp vào lớp nào. Em báo thầy cô nhé.");
    if (lopHs.length && lopHs[0].khoi && lopHs[0].khoi !== b.khoi) return loi("sai_khoi", `Bài này dành cho lớp ${b.khoi}.`);
    let maDe = null;
    if (yc.ma_de && che_do !== "practice" && che_do !== "pisa") {
      const md = await db.maDe(String(yc.ma_de).trim().toUpperCase());
      const t = bay_gio();
      if (!md || md.bai_id !== b.id || (md.mo_luc && Date.parse(md.mo_luc) > t) || (md.dong_luc && Date.parse(md.dong_luc) < t))
        return loi("sai_ma_de", "Mã đề không đúng hoặc đã đóng.");
      maDe = md.ma;
    }
    const B = taoBai();
    let ph;
    try { ph = B.taoPhien(che_do, che_do === "practice" ? spec : null, maDe); }
    catch (e) { return loi("khong_dung_duoc", "Không tạo được gói câu hỏi này."); }
    const gioi_han = che_do === "practice" || che_do === "pisa" ? null : (B.LIMIT[che_do] || null);
    const luot = await db.taoLuot({
      hoc_sinh_id: p.hs, bai_id: b.id, loai: LOAI[che_do], ten_goi: ph.title, ma_de: maDe,
      cau_phat: ph, bai_lam: { pr: {} }, gioi_han_giay: gioi_han, bat_dau: new Date(bay_gio()).toISOString(),
    });
    return { ok: true, luot, de: anDapAn(ph), gioi_han };
  }

  if (viec === "kiem_tra" || viec === "nop") {
    const l = await db.docLuot(yc.luot);
    if (!l || l.hoc_sinh_id !== p.hs) return loi("khong_co_luot", "Không tìm thấy bài đang làm.");
    const ph = l.cau_phat, B = (await bai(l.bai_id))();

    if (viec === "kiem_tra") {
      if (ph.mode !== "practice") return loi("khong_ho_tro", "Chỉ kiểm tra từng câu khi luyện tập.");
      if (l.nop_luc) return loi("da_nop", "Gói này đã nộp.");
      const q = ["mc", "tf", "sa"].flatMap(t => ph.by[t]).find(x => x.id === yc.cau);
      if (!q) return loi("khong_co_cau", "Không có câu này.");
      const a = doiTraLoi(ph, { [q.id]: yc.tra_loi })[q.id];
      const oks = B.kiemTra(q, a);
      const pr = (l.bai_lam && l.bai_lam.pr) || {};
      const P = pr[q.id] || { attempts: 0 };
      if (P.final) return { ok: true, oks: P.lastOks || oks, lan: P.attempts, mo: moDapAn(ph, q.id)[q.id] };
      P.attempts++;
      if (P.attempts === 1) { P.first = oks; P.firstAns = a; }
      P.lastOks = oks;
      const xong = oks.every(Boolean) || P.attempts >= 2;
      if (xong) P.final = true;
      pr[q.id] = P;
      await db.capNhatLuot(l.id, { bai_lam: { ...(l.bai_lam || {}), pr } });
      const loi_chon = !xong && q.type === "mc" ? loiPhuongAn(ph, q, yc.tra_loi) : null;
      return { ok: true, oks, lan: P.attempts, mo: xong ? moDapAn(ph, q.id)[q.id] : null, loi_chon };
    }

    // nop
    if (l.nop_luc) return { ok: true, ket_qua: l.bai_lam && l.bai_lam.ket_qua, mo: moDapAn(ph), da_nop_truoc: true };
    const t = bay_gio();
    let tra_loi, ghi_chu = "";
    if (ph.mode === "practice") tra_loi = (l.bai_lam && l.bai_lam.pr) || {};
    else {
      tra_loi = doiTraLoi(ph, yc.tra_loi || {});
      const da_lam = (t - Date.parse(l.bat_dau)) / 1000;
      if (l.gioi_han_giay && da_lam > l.gioi_han_giay + GIAN_HAN_GIAY) ghi_chu = `Nộp quá giờ ${Math.round((da_lam - l.gioi_han_giay) / 60)} phút`;
    }
    const kq = B.cham(ph, tra_loi);
    const ket_qua = { ...kq, phan: diemPhan(kq) };
    await db.capNhatLuot(l.id, {
      bai_lam: { ...(l.bai_lam || {}), tra_loi, ket_qua }, diem: kq.total, diem_phan: diemPhan(kq), diem_dang: diemDang(kq, B.TOPICS),
      nop_luc: new Date(t).toISOString(), ghi_chu,
    });
    return { ok: true, ket_qua, mo: moDapAn(ph) };
  }

  return loi("sai_viec", "Yêu cầu không hợp lệ.");
}
