// Xử lý phiên làm bài phía máy chủ, không phụ thuộc cơ sở dữ liệu (để chạy thử được bằng Node).
//  - anDapAn: bản câu hỏi gửi xuống máy học sinh, đã bỏ đáp án, lời giải, tham số bộ sinh
//  - doiTraLoi: đổi lựa chọn theo vị trí hiển thị (đã xáo) về vị trí gốc trước khi chấm
//  - moDapAn: đáp án và lời giải trả về SAU khi nộp

const KHOA_CAU = ["id", "type", "topic", "level", "stem", "fig", "unit", "no", "lb", "mix", "src"];
const lay = (o, khoa) => Object.fromEntries(khoa.filter(k => o[k] !== undefined).map(k => [k, o[k]]));

/** Câu hỏi gửi cho học sinh: phương án nhiều lựa chọn đã xáo theo ph.perm, không có đáp án. */
export function anDapAn(ph) {
  const cau = [];
  for (const t of ["mc", "tf", "sa"]) {
    for (const q of ph.by[t]) {
      const v = lay(q, KHOA_CAU);
      if (q.opts) {
        const perm = (ph.perm && ph.perm[q.id]) || q.opts.map((_, i) => i);
        v.opts = perm.map(i => ({ t: q.opts[i].t }));
      }
      if (q.items) v.items = q.items.map(it => ({ t: it.t, topic: it.topic, level: it.level }));
      cau.push(v);
    }
  }
  const units = ph.units ? ph.units.map(u => lay(u, ["title", "ctx", "fig"])) : null;
  return { mode: ph.mode, title: ph.title, spec: ph.spec, units, cau };
}

/** Câu trả lời của máy học sinh (vị trí hiển thị) → câu trả lời theo vị trí gốc để chấm. */
export function doiTraLoi(ph, traLoi) {
  const out = {};
  for (const q of ph.by.mc) {
    const a = traLoi[q.id];
    if (Number.isInteger(a)) {
      const perm = (ph.perm && ph.perm[q.id]) || q.opts.map((_, i) => i);
      if (a >= 0 && a < perm.length) out[q.id] = perm[a];
    }
  }
  for (const q of ph.by.tf) {
    const a = traLoi[q.id];
    if (Array.isArray(a)) out[q.id] = q.items.map((_, j) => (typeof a[j] === "boolean" ? a[j] : null));
  }
  for (const q of ph.by.sa) {
    const a = traLoi[q.id];
    if (a != null) out[q.id] = String(a).slice(0, 60);
  }
  return out;
}

/** Vị trí hiển thị của đáp án đúng (nhiều lựa chọn), để trang tô màu sau khi nộp. */
function viTriDung(ph, q) {
  const perm = (ph.perm && ph.perm[q.id]) || q.opts.map((_, i) => i);
  return perm.indexOf(q.ans);
}

/** Đáp án, lời giải, lỗi sai thường gặp – chỉ gửi sau khi đã nộp (hoặc khi luyện tập đã trả lời câu đó). */
export function moDapAn(ph, chiCau) {
  const out = {};
  for (const t of ["mc", "tf", "sa"]) {
    for (const q of ph.by[t]) {
      if (chiCau && chiCau !== q.id) continue;
      const o = { exp: q.exp };
      if (t === "mc") {
        const perm = (ph.perm && ph.perm[q.id]) || q.opts.map((_, i) => i);
        o.dung = viTriDung(ph, q);
        o.loi = perm.map(i => q.opts[i].err || null);
      } else if (t === "tf") {
        o.dung = q.items.map(it => it.v);
        o.exp_y = q.items.map(it => it.exp || null);
      } else {
        o.dung = q.at || String(q.ans[0]).replace(".", ",");
      }
      out[q.id] = o;
    }
  }
  return out;
}
