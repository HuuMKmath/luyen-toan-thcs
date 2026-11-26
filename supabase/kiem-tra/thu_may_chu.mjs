// Chạy thử hàm máy chủ "bai-lam" với cơ sở dữ liệu giả:  node supabase/kiem-tra/thu_may_chu.mjs
import { xuLy, kyPhien, SAI_TOI_DA } from "../functions/bai-lam/xu-ly.js";
import { xuLyCu, tuanNay } from "../functions/bai-lam/tuong-thich.js";

let loi = 0;
const ok = (dk, ten) => { if (dk) console.log("OK  " + ten); else { loi++; console.log("SAI " + ten); } };

// ----- Cơ sở dữ liệu giả -----
const HS = [
  { id: "hs-an", ho_ten: "Nguyễn Văn An", ma_hs: "111111", goi: "day_du", dang_hoc: true, lop: { ten: "7A", khoi: 7 } },
  { id: "hs-binh", ho_ten: "Trần Thị Bình", ma_hs: "222222", goi: "day_du", dang_hoc: true, lop: { ten: "7A", khoi: 7 } },
  { id: "hs-dung", ho_ten: "Phạm Dũng", ma_hs: "444444", goi: "day_du", dang_hoc: true, lop: { ten: "6B", khoi: 6 } },
  { id: "hs-cuong", ho_ten: "Lê Văn Cường", ma_hs: "555555", goi: "day_du", dang_hoc: true, lops: [{ ten: "7B", khoi: 7, loai: "chinh_khoa" }, { ten: "7 học thêm", khoi: 7, loai: "hoc_them" }] },
  { id: "hs-gv", ho_ten: "Thầy Hữu", ma_hs: "999999", goi: "day_du", dang_hoc: true, lops: [{ ten: "GV", khoi: null, loai: "gv" }] },
  { id: "hs-moi", ho_ten: "Học sinh mới", ma_hs: "666666", goi: "day_du", dang_hoc: true, lops: [] },
];
const BAI = { "tam-giac-bang-nhau": { id: "tam-giac-bang-nhau", khoi: 7, da_mo: true, tab_cu: "7 - Tam giác bằng nhau" }, "tap-hop": { id: "tap-hop", khoi: 6, da_mo: true, tab_cu: "6 - Tập hợp" } };
const lopCua = h => h.lops || (h.lop ? [{ ...h.lop, loai: "chinh_khoa" }] : []);
const GOI = [], MO = [], THUONG = {};
const MA_DE = { DE7A1: { ma: "DE7A1", bai_id: "tam-giac-bang-nhau", loai: "kt25", mo_luc: null, dong_luc: null } };
let sai = 0, n = 0;
const LUOT = {};
const db = {
  dsLopDay: async () => {
    const m = {};
    HS.filter(h => h.dang_hoc).forEach(h => lopCua(h).filter(l => l.loai !== "gv").forEach(l => { (m[l.ten] = m[l.ten] || { ten: l.ten, khoi: l.khoi, so: 0 }).so++; }));
    return Object.values(m);
  },
  dsBaiDayDu: async () => Object.values(BAI).map(b => ({ ...b, tieu_de: b.id, chuong: "" })),
  hsTrongLop: async ten => HS.filter(h => h.dang_hoc && lopCua(h).some(l => l.ten === ten)).map(h => ({ id: h.id, ho_ten: h.ho_ten })),
  luotCuaHS: async ids => Object.values(LUOT).filter(l => ids.includes(l.hoc_sinh_id) && l.nop_luc),
  demSai: async () => sai, ghiSai: async () => { sai++; },
  timHocSinh: async ma => HS.find(h => h.ma_hs === ma && h.dang_hoc) || null,
  cacLop: async id => lopCua(HS.find(h => h.id === id) || {}),
  dsBai: async () => Object.values(BAI),
  luotDaNop: async id => Object.values(LUOT).filter(l => l.hoc_sinh_id === id && l.nop_luc && ["kt25", "kt5", "thu_thach"].includes(l.loai)),
  goiXong: async id => GOI.filter(g => g.hoc_sinh_id === id),
  ghiGoiXong: async (id, bai_id, goi) => { if (!GOI.some(g => g.hoc_sinh_id === id && g.bai_id === bai_id && g.goi === goi)) GOI.push({ hoc_sinh_id: id, bai_id, goi }); },
  moBai: async () => MO,
  docThuong: async id => (THUONG[id] ? JSON.parse(JSON.stringify(THUONG[id])) : null),
  ghiThuong: async (id, d) => { THUONG[id] = JSON.parse(JSON.stringify(d)); },
  dsXepHang: async khoi => {
    const out = [];
    for (const h of HS) {
      const theoKhoi = {};
      lopCua(h).filter(l => l.loai !== "gv" && l.khoi).forEach(l => { (theoKhoi[l.khoi] = theoKhoi[l.khoi] || []).push(l.ten); });
      for (const [k, ls] of Object.entries(theoKhoi)) if (khoi == null || +k === khoi) {
        const t = THUONG[h.id] || {};
        out.push({ hoc_sinh_id: h.id, ma_hs: h.ma_hs, ho_ten: h.ho_ten, khoi: +k, cac_lop: ls, xp: t.xp || 0, xp_tuan: t.xp_tuan || 0, tuan: t.tuan || null });
      }
    }
    return out;
  },
  baiHoc: async id => BAI[id] || null,
  maDe: async ma => MA_DE[ma] || null,
  taoLuot: async row => { const id = `00000000-0000-0000-0000-${String(++n).padStart(12, "0")}`; LUOT[id] = { id, ...JSON.parse(JSON.stringify(row)), nop_luc: null }; return id; },
  docLuot: async id => (LUOT[id] ? JSON.parse(JSON.stringify(LUOT[id])) : null),
  capNhatLuot: async (id, p) => { Object.assign(LUOT[id], JSON.parse(JSON.stringify(p))); },
};
let gio = Date.parse("2026-11-25T08:00:00+07:00");
const ctx = { db, bi_mat: "khoa-thu", bay_gio: () => gio };
const goi = yc => xuLy(yc, ctx);

// ----- Đăng nhập -----
let r = await goi({ viec: "dang_nhap", ma: "123456" });
ok(!r.ok && r.loi === "sai_ma" && sai === 1, "mã sai bị từ chối và được đếm");
r = await goi({ viec: "dang_nhap", ma: "111 111" });
ok(r.ok && r.hs.n === "Nguyễn Văn An" && r.hs.c === "7A" && r.hs.khoi === 7, "đăng nhập đúng mã, có họ tên và lớp");
const phienAn = r.phien;
const phienDung = (await goi({ viec: "dang_nhap", ma: "444444" })).phien;
const phienBinh = (await goi({ viec: "dang_nhap", ma: "222222" })).phien;
r = await goi({ viec: "bat_dau", phien: phienAn.slice(0, -2) + "xx", bai: "tam-giac-bang-nhau", che_do: "test" });
ok(!r.ok && r.loi === "het_phien", "phiên bị sửa thì không dùng được");
const phienCu = await kyPhien("khoa-thu", { hs: "hs-an", het: gio - 1 });
r = await goi({ viec: "bat_dau", phien: phienCu, bai: "tam-giac-bang-nhau", che_do: "test" });
ok(!r.ok && r.loi === "het_phien", "phiên hết hạn thì phải đăng nhập lại");

// ----- Bắt đầu bài -----
r = await goi({ viec: "bat_dau", phien: phienDung, bai: "tam-giac-bang-nhau", che_do: "test" });
ok(!r.ok && r.loi === "sai_khoi", "học sinh lớp 6 không làm được bài lớp 7");
r = await goi({ viec: "bat_dau", phien: phienAn, bai: "khong-co", che_do: "test" });
ok(!r.ok && r.loi === "khong_co_bai", "bài không tồn tại bị từ chối");
r = await goi({ viec: "bat_dau", phien: phienAn, bai: "tam-giac-bang-nhau", che_do: "test" });
ok(r.ok && r.de.cau.length === 13 && r.gioi_han === 1500, "bài kiểm tra 13 câu, 25 phút");
ok(!/"(ans|exp|err|v|at|meta)":/.test(JSON.stringify(r.de)), "đề gửi xuống không có đáp án, lời giải");
const luot = r.luot, ph = LUOT[luot].cau_phat;

// ----- Nộp bài: trả lời đúng hết theo vị trí hiển thị -----
const traLoiDung = {};
for (const q of ph.by.mc) traLoiDung[q.id] = ph.perm[q.id].indexOf(q.ans);
for (const q of ph.by.tf) traLoiDung[q.id] = q.items.map(i => i.v);
for (const q of ph.by.sa) traLoiDung[q.id] = String(q.ans[0]).replace(".", ",");
r = await goi({ viec: "nop", phien: phienBinh, luot, tra_loi: traLoiDung });
ok(!r.ok && r.loi === "khong_co_luot", "học sinh khác không nộp được bài của bạn");
gio += 20 * 60 * 1000;
r = await goi({ viec: "nop", phien: phienAn, luot, tra_loi: traLoiDung });
ok(r.ok && r.ket_qua.total === 10, "đúng hết được 10 điểm (máy chủ chấm)");
ok(LUOT[luot].diem === 10 && LUOT[luot].nop_luc && LUOT[luot].diem_phan.mc === "6/6", "điểm, giờ nộp, điểm từng phần được lưu");
ok(Object.keys(LUOT[luot].diem_dang).length > 0, "điểm theo dạng kiến thức được lưu");
ok(r.mo && Object.keys(r.mo).length === 13, "sau khi nộp mới trả đáp án, lời giải");
r = await goi({ viec: "nop", phien: phienAn, luot, tra_loi: {} });
ok(r.ok && r.da_nop_truoc && LUOT[luot].diem === 10, "nộp lại lần hai không đổi điểm");

// Nộp sai hết, nộp quá giờ
r = await goi({ viec: "bat_dau", phien: phienAn, bai: "tam-giac-bang-nhau", che_do: "quick" });
const l2 = r.luot;
gio += 9 * 60 * 1000;
r = await goi({ viec: "nop", phien: phienAn, luot: l2, tra_loi: {} });
ok(r.ok && r.ket_qua.total === 0 && /quá giờ/.test(LUOT[l2].ghi_chu), "bỏ trống 0 điểm; nộp quá giờ có ghi chú");

// ----- Mã đề: cùng mã → cùng đề -----
const a1 = await goi({ viec: "bat_dau", phien: phienAn, bai: "tam-giac-bang-nhau", che_do: "test", ma_de: "de7a1" });
const a2 = await goi({ viec: "bat_dau", phien: phienBinh, bai: "tam-giac-bang-nhau", che_do: "test", ma_de: "DE7A1" });
ok(a1.ok && a2.ok && JSON.stringify(a1.de.cau.map(c => c.stem)) === JSON.stringify(a2.de.cau.map(c => c.stem)), "cùng mã đề: hai bạn cùng đề");
r = await goi({ viec: "bat_dau", phien: phienAn, bai: "tam-giac-bang-nhau", che_do: "test", ma_de: "SAIMA" });
ok(!r.ok && r.loi === "sai_ma_de", "mã đề không có thì bị từ chối");

// ----- Luyện tập: kiểm tra từng câu -----
r = await goi({ viec: "bat_dau", phien: phienAn, bai: "tam-giac-bang-nhau", che_do: "practice", spec: { kind: "level", val: "NB" } });
ok(r.ok && r.gioi_han === null && r.de.cau.length > 0, "gói luyện tập không giới hạn giờ");
const l3 = r.luot, p3 = LUOT[l3].cau_phat, q0 = p3.by.mc[0];
const viTriDung = p3.perm[q0.id].indexOf(q0.ans), viTriSai = (viTriDung + 1) % q0.opts.length;
r = await goi({ viec: "kiem_tra", phien: phienAn, luot: l3, cau: q0.id, tra_loi: viTriSai });
ok(r.ok && r.oks[0] === false && r.lan === 1 && r.mo === null, "trả lời sai lần 1: chưa lộ đáp án");
ok(r.loi_chon === (q0.opts[p3.perm[q0.id][viTriSai]].err || null), "chọn sai: có lời nhắc lỗi của phương án vừa chọn");
r = await goi({ viec: "kiem_tra", phien: phienAn, luot: l3, cau: q0.id, tra_loi: viTriDung });
ok(r.ok && r.oks[0] === true && r.lan === 2 && r.mo && r.mo.dung === viTriDung, "lần 2: đúng, hiện đáp án và lời giải");
r = await goi({ viec: "nop", phien: phienAn, luot: l3 });
ok(r.ok && r.ket_qua.qres.find(x => x.id === q0.id).ok === false, "luyện tập tính theo lần trả lời đầu tiên");
r = await goi({ viec: "kiem_tra", phien: phienAn, luot: luot, cau: "x", tra_loi: 0 });
ok(!r.ok && r.loi === "khong_ho_tro", "bài kiểm tra không cho kiểm tra từng câu");

// ----- Học sinh chưa xếp lớp, mã giáo viên -----
r = await goi({ viec: "dang_nhap", ma: "666666" });
ok(!r.ok && r.loi === "chua_xep_lop", "học sinh chưa xếp lớp không đăng nhập được");
const phienMoi = await kyPhien("khoa-thu", { hs: "hs-moi", het: gio + 1e9 });
r = await goi({ viec: "bat_dau", phien: phienMoi, bai: "tap-hop", che_do: "test" });
ok(!r.ok && r.loi === "chua_xep_lop", "học sinh chưa xếp lớp không làm được bài");
r = await goi({ viec: "dang_nhap", ma: "999999" });
ok(r.ok && r.hs.c === "GV" && r.hs.khoi === null, "mã giáo viên đăng nhập, lớp GV");
const phienGV = r.phien;
r = await goi({ viec: "bat_dau", phien: phienGV, bai: "tap-hop", che_do: "test" });
const r7 = await goi({ viec: "bat_dau", phien: phienGV, bai: "tam-giac-bang-nhau", che_do: "test" });
ok(r.ok && r7.ok, "mã giáo viên làm được bài mọi khối");
r = await goi({ viec: "dang_nhap", ma: "555555" });
ok(r.ok && r.hs.c === "7B", "em học hai lớp: lớp chính là lớp đầu tiên");

// ----- Phần giống Google Sheet cũ (trang Các bài, khóa bài, XP) -----
const cu = yc => xuLyCu(yc, { db, bay_gio: () => gio });
ok(await cu({}) === "ready", "gọi không có mã: trả lời ready như Sheet cũ");
r = await cu({ ma: "111111" });
ok(r.ok && r.n === "Nguyễn Văn An" && r.c === "7A", "tra mã: họ tên, lớp");
const saiTruoc = sai;
r = await cu({ ma: "000001" });
ok(r.ok === false && sai === saiTruoc + 1, "tra mã sai: bị đếm lần sai");
r = await cu({ ma: "666666" });
ok(r.ok === false && r.chua_xep_lop, "tra mã chưa xếp lớp: từ chối");

r = await cu({ ma: "111111", tiendo: "1" });
const tdAn = r.bai["7 - Tam giác bằng nhau"];
ok(r.ok && tdAn && tdAn.d === 10 && tdAn.k === 10 && tdAn.l >= 2, "tiến độ: điểm cao nhất, số lần theo tên trang tính cũ");
ok(/^\d\d\/\d\d \d\d:\d\d$/.test(tdAn.t) && tdAn.y === "", "tiến độ: lần gần nhất, phần yếu của lần cao nhất");
r = await cu({ xg: 1, u: "111111", bai: "7 - Tam giác bằng nhau", goi: "TH" });
const r2 = await cu({ xg: 1, u: "111111", bai: "7 - Tam giác bằng nhau", goi: "NB" });
await cu({ xg: 1, u: "111111", bai: "7 - Tam giác bằng nhau", goi: "NB" });
ok(r.ok && r2.ok && GOI.filter(g => g.hoc_sinh_id === "hs-an").length === 2, "ghi gói đã xong, gửi lại không trùng");
r = await cu({ xg: 1, u: "444444", bai: "7 - Tam giác bằng nhau", goi: "NB" });
ok(!r.ok, "không ghi gói của bài khác khối");
MO.push({ pham_vi: "7A", bai_id: "tam-giac-bang-nhau" }, { pham_vi: "6", bai_id: "tap-hop" });
r = await cu({ ma: "111111", tiendo: "1" });
ok(r.goi["7 - Tam giác bằng nhau"] === "NB TH" && r.mo.join() === "7 - Tam giác bằng nhau", "tiến độ: gói đã xong và bài giáo viên đã mở cho lớp");
r = await cu({ ma: "444444", tiendo: "1" });
ok(r.mo.join() === "6 - Tập hợp" && Object.keys(r.bai).length === 0, "mở bài theo khối; em chưa làm bài nào");

r = await cu({ gm: 1, u: "111111", dx: 120, pid: "p1", g: { streak: 2, last: "2026-11-25", badges: { first: "2026-11-24" } } });
ok(r.ok && r.g.xp === 120 && r.g.streak === 2 && r.g.badges.first === "2026-11-24" && r.g.wxp === 120, "đồng bộ XP lần đầu");
r = await cu({ gm: 1, u: "111111", dx: 120, pid: "p1", g: {} });
ok(r.ok && r.g.xp === 120, "gửi lại cùng một gói XP không cộng hai lần");
r = await cu({ gm: 1, u: "111111", dx: 5000, pid: "p2", g: {} });
ok(r.g.xp === 120 + 2380 && THUONG["hs-an"].xp === 2500, "giới hạn XP trong ngày");
ok(THUONG["hs-an"].tuan === tuanNay(gio) && THUONG["hs-an"].chuoi_ngay === 2 && THUONG["hs-an"].huy_hieu.first, "lưu XP tuần, chuỗi ngày, huy hiệu vào bảng thuong");
await cu({ gm: 1, u: "222222", dx: 300, pid: "b1", g: {} });
await cu({ gm: 1, u: "555555", dx: 50, pid: "c1", g: {} });

r = await cu({ ma: "222222", bxh: "1" });
ok(r.ok && r.c === "7A" && r.so === 2 && r.tatCa.top[0].n === "N.V. An" && r.tatCa.toi.r === 2, "xếp hạng lớp: tên viết tắt, thứ hạng của em");
ok(r.khoi && r.khoi.so === 3 && r.khoi.tatCa.top[2].l === "7B", "xếp hạng khối: mỗi em một lần, kèm lớp");
ok(!JSON.stringify(r).includes("111111"), "xếp hạng không lộ mã học sinh khác");
r = await cu({ ma: "999999", bxh: "1" });
ok(r.ok && r.gv && r.khoi[7].length === 3 && r.khoi[6].length === 1 && r.khoi[7].some(h => h.n === "Lê Văn Cường" && h.ls.length === 2), "mã giáo viên: bảng đầy đủ mọi khối");

// ----- Sổ điểm (chỉ mã GV) -----
r = await cu({ ma: "111111", sodiem: "1" });
ok(!r.ok && r.khong_phai_gv, "sổ điểm: mã học sinh bị từ chối");
r = await cu({ ma: "999999", sodiem: "1" });
ok(r.ok && r.lops.some(l => l.ten === "7A" && l.so === 2) && !r.lops.some(l => l.ten === "GV") && r.bai.length === 2 && !r.hs, "sổ điểm: danh sách lớp (không có lớp GV), bài");
r = await cu({ ma: "999999", sodiem: "1", lop: "7A" });
const an = r.hs && r.hs.find(h => h.n === "Nguyễn Văn An");
const kAn = an && an.d["tam-giac-bang-nhau"];
const nopAn = Object.values(LUOT).filter(l => l.hoc_sinh_id === "hs-an" && l.nop_luc && l.bai_id === "tam-giac-bang-nhau" && l.loai === "kt25");
ok(r.ok && r.lop === "7A" && r.hs.length === 2 && kAn && kAn.kt25 && kAn.kt25[1] === nopAn.length && kAn.kt25[0] === Math.max(...nopAn.map(l => Number(l.diem))) && /^\d\d\/\d\d \d\d:\d\d$/.test(kAn.kt25[2]), "sổ điểm lớp 7A: điểm cao nhất, số lần, lần cuối");
ok(r.hs[0].n === "Nguyễn Văn An" && !JSON.stringify(r).includes("111111"), "sổ điểm: xếp theo tên, không lộ mã học sinh");
r = await cu({ ma: "999999", sodiem: "1", lop: "9Z" });
ok(!r.ok && r.khong_co_lop, "sổ điểm: lớp không có thì báo");

// ----- Chống dò mã -----
sai = SAI_TOI_DA;
r = await goi({ viec: "dang_nhap", ma: "111111" });
ok(!r.ok && r.loi === "tam_khoa", "quá nhiều lần nhập sai thì tạm khóa tra mã");

console.log(loi ? `${loi} kiểm tra SAI` : "Tất cả kiểm tra đều đạt");
process.exit(loi ? 1 : 0);
