#!/usr/bin/env python3
"""Tách ngân hàng câu hỏi, bộ sinh số liệu, cách dựng gói và cách chấm của từng trang bài
thành mô-đun JavaScript chạy trên máy chủ (hàm Supabase "bai-lam").

Cách dùng (trong thư mục gốc của kho):
    python3 supabase/cong-cu/tach_bai.py

Sinh ra supabase/functions/bai-lam/bai/<mã bài>.js và bai/danh-sach.js.
Mã trong các trang được giữ NGUYÊN VĂN (chỉ bọc lại), nên đề và cách chấm trên máy chủ
giống hệt trang hiện tại. Sửa câu hỏi trong trang rồi chạy lại công cụ này.
"""
import json
import pathlib
import re
import sys

GOC = pathlib.Path(__file__).resolve().parents[2]
RA = GOC / "supabase/functions/bai-lam/bai"


def tach(slug, tep):
    s = (GOC / tep).read_text(encoding="utf-8")
    # 1) Ngân hàng + trạng thái + công cụ: từ đầu khối <script> chính đến phần dựng giao diện
    i = s.index("<script>\n", s.index("gamify.js")) + len("<script>\n")
    j = s.index("/* ============ Dựng phiên làm bài")
    ngan_hang = s[i:j]
    ngan_hang = re.sub(r'^\s*"use strict";\s*', "", ngan_hang)
    # 2) Dựng gói: buildTest, buildQuick, buildHard, buildPisa, buildPractice
    k = s.index("/* ============ Dựng phiên làm bài")
    dung = s[k: s.index("/* ============", k + 10)]
    # 3) Nhãn câu (Phần I, câu 1...) và chấm điểm
    nhan = s[s.index("const PART_NAME"): s.index("function badge(")]
    k = s.index("/* ============ Chấm điểm")
    cham = s[k: s.index("/* ============", k + 10)]
    tt = re.search(r"PREFIX\s*=\s*'([A-Z0-9]+-)'", s) or re.search(r"'([A-Z]{2}\d-)'", s)

    return f"""// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ {tep} – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = {json.dumps(slug)};
export const TIEN_TO = {json.dumps(tt.group(1) if tt else "")};

export function taoBai() {{
  "use strict";
  // Thay cho các đối tượng của trình duyệt (phần ngân hàng chỉ khai báo, không dùng tới)
  // GM: lớp điểm thưởng của trang (gamify.js) – trên máy chủ chỉ là vỏ rỗng, mọi lời gọi trả về null
  const GM = new Proxy({{}}, {{ get: (t, k) => (k in t ? t[k] : () => null), set: (t, k, v) => {{ t[k] = v; return true; }} }});
  const window = {{ GM }};
  const localStorage = {{ getItem() {{ return null; }}, setItem() {{}} }};
  const document = {{ getElementById() {{ return null; }}, querySelector() {{ return null; }}, querySelectorAll() {{ return []; }} }};
  const setInterval = () => 0, clearInterval = () => {{}};

// ===== Ngân hàng câu hỏi, bộ sinh số liệu, trạng thái (nguyên văn) =====
{ngan_hang}
// ===== Dựng gói (nguyên văn) =====
{dung}
// ===== Nhãn câu (nguyên văn) =====
{nhan}
// ===== Chấm điểm (nguyên văn) =====
{cham}
// ===== Giao tiếp với máy chủ =====
  const XAY = {{ test: buildTest, quick: buildQuick, hard: buildHard, pisa: buildPisa }};
  return {{
    TOPICS, TKEYS, LEVELS, LIMIT,
    /** Dựng một phiên. cheDo: test | quick | hard | pisa | practice; spec cho practice; maDe: cùng mã → cùng đề. */
    taoPhien(cheDo, spec, maDe) {{
      if (cheDo !== "practice" && !XAY[cheDo]) throw new Error("Chế độ không hợp lệ: " + cheDo);
      const chay = () => (cheDo === "practice" ? buildPractice(spec) : XAY[cheDo]());
      if (maDe) {{
        RNG = mulberry32(hashStr(cheDo + "|" + maDe)); SEEDED = true;
        try {{ chay(); }} finally {{ RNG = Math.random; SEEDED = false; }}
      }} else chay();
      return JSON.parse(JSON.stringify({{ mode: S.mode, spec: S.spec, title: S.title, by: S.by, idx: S.idx, units: S.units || null, perm: state.perm }}));
    }},
    /** Chấm. traLoi: {{ id: câu trả lời }} (bài kiểm tra) hoặc {{ id: {{first, firstAns}} }} (luyện tập). */
    cham(phien, traLoi) {{
      S = {{ mode: phien.mode, spec: phien.spec, title: phien.title, by: phien.by, idx: phien.idx, units: phien.units, list: [] }};
      TYPES.forEach(t => S.by[t].forEach(q => S.list.push(q)));
      if (phien.mode === "practice") {{ state.pr = traLoi || {{}}; state.ans = {{}}; }}
      else {{ state.ans = traLoi || {{}}; state.pr = {{}}; }}
      const r = grade();
      return {{
        total: r.total, sc: r.sc, topics: r.topics, levels: r.levels, errs: r.errs,
        qres: r.qres.map(x => ({{ kind: x.kind, id: x.q.id, i: x.i, ok: x.ok, oks: x.oks, k: x.k, pts: x.pts, max: x.max }}))
      }};
    }},
    /** Kiểm tra một câu (dùng cho chế độ luyện tập). */
    kiemTra(q, a) {{ return evalQ(q, a); }},
  }};
}}
"""


def main():
    trang = (GOC / "cac-bai/index.html").read_text(encoding="utf-8")
    slugs = [m or "tam-giac-bang-nhau" for m in re.findall(r'<a class="lesson" href="\.\./([^"/]*)/?" data-tab', trang)]
    RA.mkdir(parents=True, exist_ok=True)
    ok = []
    for slug in slugs:
        tep = "index.html" if slug == "tam-giac-bang-nhau" else f"{slug}/index.html"
        try:
            (RA / f"{slug}.js").write_text(tach(slug, tep), encoding="utf-8")
            ok.append(slug)
        except ValueError as e:
            print(f"LỖI {slug}: không tìm thấy đoạn mã cần tách ({e})", file=sys.stderr)
    (RA / "danh-sach.js").write_text(
        "// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py – KHÔNG SỬA TAY.\n"
        "// Nạp mô-đun của một bài khi cần (mỗi bài một tệp).\n"
        "export const NAP = {\n" + "".join(f"  {json.dumps(s)}: () => import(\"./{s}.js\"),\n" for s in ok) + "};\n",
        encoding="utf-8")
    print(f"Đã tách {len(ok)}/{len(slugs)} bài", file=sys.stderr)


if __name__ == "__main__":
    main()
