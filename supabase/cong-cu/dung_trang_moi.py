#!/usr/bin/env python3
"""Dựng bản website cho nền mới (Cloudflare Pages) vào thư mục dist/.

Cloudflare chạy lệnh này mỗi khi kho có thay đổi:
    Build command:  python3 supabase/cong-cu/dung_trang_moi.py
    Output:         dist

Bản dựng = website hiện tại + tệp supabase/trang/nen-moi.js gắn vào cuối mỗi trang bài,
để trang gọi máy chủ Supabase thay cho Google Sheet; địa chỉ Google Sheet (SHEET_URL) ở mọi trang
(trang Các bài: tiến độ, xếp hạng; trang bài: tra mã, XP, khóa bài) đổi sang hàm máy chủ Supabase.
Các trang gốc trong kho không bị sửa.
"""
import pathlib
import re
import shutil

GOC = pathlib.Path(__file__).resolve().parents[2]
RA = GOC / "dist"
# Hàm máy chủ Supabase thay cho Apps Script của Google Sheet cũ (trả lời cùng dạng, xem functions/bai-lam/tuong-thich.js)
MAY_CHU = "https://rhfjgaoyrdqglurfzbrw.supabase.co/functions/v1/bai-lam"
SHEET_CU = re.compile(r"https://script\.google\.com/macros/s/[A-Za-z0-9_-]+/exec")
BO_QUA = {".git", ".github", "dist", "supabase", "google-sheet", "node_modules"}


def main():
    if RA.exists():
        shutil.rmtree(RA)
    RA.mkdir()
    for p in GOC.iterdir():
        if p.name in BO_QUA or p.name.startswith("."):
            continue
        if p.is_dir():
            shutil.copytree(p, RA / p.name, ignore=shutil.ignore_patterns("*.xlsx", "*.docx", "nhap*.sql"))
        elif p.suffix != ".md":
            shutil.copy2(p, RA / p.name)
    shutil.copy2(GOC / "supabase/trang/nen-moi.js", RA / "nen-moi.js")

    trang = (GOC / "cac-bai/index.html").read_text(encoding="utf-8")
    slugs = [m or "tam-giac-bang-nhau" for m in re.findall(r'<a class="lesson" href="\.\./([^"/]*)/?" data-tab', trang)]
    gan = 0
    for slug in slugs:
        tep = RA / ("index.html" if slug == "tam-giac-bang-nhau" else f"{slug}/index.html")
        s = tep.read_text(encoding="utf-8")
        s = re.sub(r"<html([^>]*)>", lambda m: f'<html{m.group(1)} data-bai="{slug}">', s, count=1)
        # gắn sau khối <script> chính của trang (trước đoạn đăng ký bộ nhớ đệm ở cuối trang)
        dau = "<script>if('serviceWorker'"
        assert s.count(dau) == 1, f"{slug}: không tìm thấy chỗ gắn"
        s = s.replace(dau, '<script src="/nen-moi.js"></script>\n' + dau)
        tep.write_text(s, encoding="utf-8")
        gan += 1
    # Mọi chỗ gọi Google Sheet cũ → hàm máy chủ Supabase
    doi = 0
    for tep in RA.rglob("*.html"):
        s = tep.read_text(encoding="utf-8")
        s2, n = SHEET_CU.subn(MAY_CHU, s)
        if n:
            tep.write_text(s2, encoding="utf-8")
            doi += 1
    assert doi >= gan, f"chỉ đổi được địa chỉ Sheet ở {doi} trang"
    con = [str(t.relative_to(RA)) for t in RA.rglob("*") if t.is_file() and t.suffix in (".html", ".js") and "script.google.com/macros" in t.read_text(encoding="utf-8", errors="ignore")]
    assert not con, "còn trang gọi Google Sheet: " + ", ".join(con)
    # Cloudflare: không lưu bộ nhớ đệm cho nen-moi.js quá lâu
    (RA / "_headers").write_text("/nen-moi.js\n  Cache-Control: no-cache\n", encoding="utf-8")
    print(f"Đã dựng dist/: {gan} trang bài gắn nen-moi.js, {doi} trang chuyển từ Google Sheet sang Supabase")


if __name__ == "__main__":
    main()
