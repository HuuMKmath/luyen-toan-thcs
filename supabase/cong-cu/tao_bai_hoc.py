#!/usr/bin/env python3
"""Sinh dữ liệu bảng bai_hoc từ trang Các bài (cac-bai/index.html) và từng thư mục bài.

Cách dùng (trong thư mục gốc của kho):
    python3 supabase/cong-cu/tao_bai_hoc.py > supabase/du-lieu/bai_hoc.sql

Mỗi lần thêm bài mới trên website chỉ cần chạy lại; câu lệnh dùng "on conflict do update"
nên chạy nhiều lần không bị trùng.
"""
import html
import pathlib
import re
import sys

GOC = pathlib.Path(__file__).resolve().parents[2]


def sql(s):
    return "'" + str(s).replace("'", "''") + "'"


def doc(p):
    return (GOC / p).read_text(encoding="utf-8")


def khong_the(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def main():
    trang = doc("cac-bai/index.html")
    dong = []
    thu_tu = 0
    # Mỗi khối: <section class="grade" id="lop-6"> ... ; mỗi chương: <div class="chap"> <h3>...</h3>
    for khoi_m in re.finditer(r'<section class="grade" id="lop-(\d)"(.*?)</section>', trang, re.S):
        khoi = int(khoi_m.group(1))
        phan = khoi_m.group(2)
        chuong = ""
        for m in re.finditer(r'<h3>(.*?)</h3>|<a class="lesson" href="\.\./([^"/]*)/?" data-tab="([^"]*)">(.*?)</a>', phan, re.S):
            if m.group(1) is not None:
                chuong = re.sub(r"\s+", " ", khong_the(m.group(1).replace("</span><span>", ": ")))
                continue
            slug, tab, than = m.group(2) or "tam-giac-bang-nhau", html.unescape(m.group(3)), m.group(4)
            tieu_de = khong_the(re.search(r"<h4>(.*?)</h4>", than, re.S).group(1))
            mo_ta_m = re.search(r'<span class="ds">(.*?)</span>', than, re.S)
            mo_ta = khong_the(mo_ta_m.group(1)) if mo_ta_m else ""
            tep = "index.html" if slug == "tam-giac-bang-nhau" else f"{slug}/index.html"
            if not (GOC / tep).exists():
                print(f"-- BỎ QUA: không thấy {tep}", file=sys.stderr)
                continue
            nguon = doc(tep)
            tt = re.search(r"PREFIX\s*=\s*'([A-Z0-9]+-)'", nguon) or re.search(r"'([A-Z]{2}\d-)'", nguon)
            if not tt:
                print(f"-- BỎ QUA: không thấy tiền tố mã kết quả trong {tep}", file=sys.stderr)
                continue
            thu_tu += 10
            dong.append((slug, khoi, chuong, tieu_de, mo_ta, tt.group(1), tab, thu_tu))

    print("-- Sinh tự động bởi supabase/cong-cu/tao_bai_hoc.py – không sửa tay.")
    print("insert into public.bai_hoc (id, khoi, chuong, tieu_de, mo_ta, tien_to, tab_cu, thu_tu) values")
    print(",\n".join(
        f"  ({sql(s)}, {k}, {sql(c)}, {sql(t)}, {sql(m)}, {sql(p)}, {sql(tab)}, {o})"
        for s, k, c, t, m, p, tab, o in dong
    ))
    print("on conflict (id) do update set khoi = excluded.khoi, chuong = excluded.chuong, tieu_de = excluded.tieu_de,")
    print("  mo_ta = excluded.mo_ta, tien_to = excluded.tien_to, tab_cu = excluded.tab_cu, thu_tu = excluded.thu_tu;")
    print(f"-- {len(dong)} bài", file=sys.stderr)


if __name__ == "__main__":
    main()
