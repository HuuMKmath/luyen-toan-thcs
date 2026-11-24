// Chạy thử hàm máy chủ "bai-lam" với cơ sở dữ liệu giả:  node supabase/kiem-tra/thu_may_chu.mjs
import { xuLy, kyPhien, SAI_TOI_DA } from "../functions/bai-lam/xu-ly.js";

let loi = 0;
const ok = (dk, ten) => { if (dk) console.log("OK  " + ten); else { loi++; console.log("SAI " + ten); } };

// ----- Cơ sở dữ liệu giả -----
const HS = [
  { id: "hs-an", ho_ten: "Nguyễn Văn An", ma_hs: "111111", goi: "day_du", dang_hoc: true, lop: { ten: "7A", khoi: 7 } },
  { id: "hs-binh", ho_ten: "Trần Thị Bình", ma_hs: "222222", goi: "day_du", dang_hoc: true, lop: { ten: "7A", khoi: 7 } },
  { id: "hs-dung", ho_ten: "Phạm Dũng", ma_hs: "444444", goi: "day_du", dang_hoc: true, lop: { ten: "6B", khoi: 6 } },
];
const BAI = { "tam-giac-bang-nhau": { id: "tam-giac-bang-nhau", khoi: 7, da_mo: true }, "tap-hop": { id: "tap-hop", khoi: 6, da_mo: true } };
const MA_DE = { DE7A1: { ma: "DE7A1", bai_id: "tam-giac-bang-nhau", loai: "kt25", mo_luc: null, dong_luc: null } };
let sai = 0, n = 0;
const LUOT = {};
const db = {
  demSai: async () => sai, ghiSai: async () => { sai++; },
  timHocSinh: async ma => HS.find(h => h.ma_hs === ma && h.dang_hoc) || null,
  lopChinh: async id => (HS.find(h => h.id === id) || {}).lop || null,
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

// ----- Chống dò mã -----
sai = SAI_TOI_DA;
r = await goi({ viec: "dang_nhap", ma: "111111" });
ok(!r.ok && r.loi === "tam_khoa", "quá nhiều lần nhập sai thì tạm khóa tra mã");

console.log(loi ? `${loi} kiểm tra SAI` : "Tất cả kiểm tra đều đạt");
process.exit(loi ? 1 : 0);
