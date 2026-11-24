// Chạy thử mô-đun máy chủ của mọi bài:  node supabase/kiem-tra/thu_bai.mjs [số lần]
// Với mỗi bài và mỗi loại gói: dựng phiên, trả lời đúng hết → phải đạt điểm tối đa,
// bỏ trống → phải 0 điểm, cùng mã đề → cùng đề, câu gửi xuống máy học sinh không lộ đáp án.
import { NAP } from "../functions/bai-lam/bai/danh-sach.js";
import { anDapAn } from "../functions/bai-lam/phien.js";

const LAN = Number(process.argv[2] || 3);
let loi = 0, dem = 0;
const sai = (bai, m) => { loi++; console.log(`SAI  ${bai}: ${m}`); };

function dapAnDung(ph) {
  const a = {};
  for (const q of ph.by.mc) a[q.id] = q.ans;
  for (const q of ph.by.tf) a[q.id] = q.items.map(i => i.v);
  for (const q of ph.by.sa) a[q.id] = String(q.ans[0]).replace(".", ",");
  return a;
}
function luyenTapDung(ph) {
  const a = dapAnDung(ph), pr = {};
  for (const t of ["mc", "tf", "sa"]) for (const q of ph.by[t])
    pr[q.id] = { first: t === "tf" ? q.items.map(() => true) : [true], firstAns: a[q.id] };
  return pr;
}
const toiDa = r => Math.round(r.qres.reduce((s, x) => s + x.max, 0) * 100) / 100;

for (const [bai, nap] of Object.entries(NAP)) {
  const { taoBai } = await nap();
  const B = taoBai();
  const cheDo = [["test"], ["quick"], ["hard"], ["pisa"],
    ...Object.keys(B.LEVELS).map(v => ["practice", { kind: "level", val: v }]),
    ...B.TKEYS.map(v => ["practice", { kind: "topic", val: v }])];
  for (let lan = 0; lan < LAN; lan++) for (const [cd, spec] of cheDo) {
    dem++;
    let ph;
    try { ph = taoBai().taoPhien(cd, spec); } catch (e) { sai(bai, `${cd} ${JSON.stringify(spec || "")} không dựng được: ${e.message}`); continue; }
    const n = ph.by.mc.length + ph.by.tf.length + ph.by.sa.length;
    if (!n) { sai(bai, `${cd} gói rỗng`); continue; }
    const C = taoBai();
    const dung = C.cham(ph, ph.mode === "practice" ? luyenTapDung(ph) : dapAnDung(ph));
    if (Math.abs(dung.total - toiDa(dung)) > 1e-9) sai(bai, `${cd} trả lời đúng hết chỉ được ${dung.total}/${toiDa(dung)}`);
    if (cd === "test" && Math.abs(dung.total - 10) > 1e-9) sai(bai, `bài kiểm tra đúng hết không phải 10 điểm (${dung.total})`);
    const trong = taoBai().cham(ph, {});
    if (trong.total !== 0) sai(bai, `${cd} bỏ trống vẫn được ${trong.total}`);
    // Bản gửi xuống máy học sinh không chứa đáp án, lời giải
    const view = JSON.stringify(anDapAn(ph));
    if (/"(ans|exp|err|v)":/.test(view)) sai(bai, `${cd} bản gửi học sinh còn lộ đáp án`);
  }
  // Cùng mã đề → cùng đề; khác mã → khác đề
  for (const cd of ["test", "quick", "hard"]) {
    const a = JSON.stringify(taoBai().taoPhien(cd, null, "ABC12").by);
    const b = JSON.stringify(taoBai().taoPhien(cd, null, "ABC12").by);
    const c = JSON.stringify(taoBai().taoPhien(cd, null, "XYZ99").by);
    if (a !== b) sai(bai, `${cd}: cùng mã đề nhưng khác đề`);
    if (a === c) sai(bai, `${cd}: khác mã đề nhưng trùng đề`);
  }
  process.stdout.write(".");
}
console.log(`\n${Object.keys(NAP).length} bài, ${dem} phiên thử, ${loi} lỗi`);
process.exit(loi ? 1 : 0);
