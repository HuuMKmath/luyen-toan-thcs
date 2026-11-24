#!/usr/bin/env python3
"""Dựng bản website cho nền mới (Cloudflare Pages) vào thư mục dist/.

Cloudflare chạy lệnh này mỗi khi kho có thay đổi:
    Build command:  python3 supabase/cong-cu/dung_trang_moi.py
    Output:         dist

Bản dựng = website hiện tại + tệp supabase/trang/nen-moi.js gắn vào cuối mỗi trang bài,
để trang gọi máy chủ Supabase thay cho Google Sheet. Các trang gốc trong kho không bị sửa.
"""
import pathlib
import re
import shutil

GOC = pathlib.Path(__file__).resolve().parents[2]
RA = GOC / "dist"
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
    # Cloudflare: không lưu bộ nhớ đệm cho nen-moi.js quá lâu
    (RA / "_headers").write_text("/nen-moi.js\n  Cache-Control: no-cache\n", encoding="utf-8")
    print(f"Đã dựng dist/: {gan} trang bài gắn nen-moi.js")


if __name__ == "__main__":
    main()
