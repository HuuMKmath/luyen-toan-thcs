#!/usr/bin/env python3
"""Chuyển dữ liệu từ Google Sheet "LUYỆN TOÁN THCS" sang cơ sở dữ liệu mới (Supabase).

Chuẩn bị:
  1. Mở Google Sheet → Tệp → Tải xuống → Microsoft Excel (.xlsx).
  2. Giáo viên chủ website đã có tài khoản giáo viên trên nền mới (đăng nhập một lần bằng email).

Cách dùng:
    python3 supabase/cong-cu/chuyen_tu_sheet.py "LUYỆN TOÁN THCS.xlsx" --email email@cua-ban > nhap.sql
rồi dán nhap.sql vào SQL Editor của Supabase và bấm Run.

Chạy lại nhiều lần không bị trùng:
  * học sinh nhận diện theo Mã HS, lớp theo tên lớp, lượt làm theo "Mã kết quả" của Sheet;
  * điểm thưởng lấy theo Sheet mới nhất (ghi đè).

Không đưa ra ngoài: tệp .xlsx và tệp .sql sinh ra có họ tên, mã học sinh. Không đưa hai tệp này lên GitHub.
"""
import argparse
import datetime as dt
import json
import re
import sys

import openpyxl

TAB_HS, TAB_XEM, TAB_SO, TAB_THUONG = "Học sinh", "Xem điểm", "Sổ điểm", "Thưởng"
SO_COT_DAU = 13          # Thời điểm nộp … Giới hạn (phút)
SO_COT_CUOI = 2          # Ghi chú, Mã kết quả
VN = dt.timezone(dt.timedelta(hours=7))


def sql(v):
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(v)
    return "'" + str(v).replace("'", "''") + "'"


def jsql(o):
    return sql(json.dumps(o, ensure_ascii=False)) + "::jsonb"


def ma_so(x):
    s = re.sub(r"\D", "", str(x if x is not None else ""))
    if not s:
        return ""
    return s.zfill(6) if len(s) <= 6 else s


def thoi_diem(x):
    """Ô ngày giờ của Sheet (giờ Việt Nam) → chuỗi ISO có múi giờ."""
    if isinstance(x, dt.datetime):
        return x.replace(tzinfo=VN).isoformat()
    if isinstance(x, dt.date):
        return dt.datetime(x.year, x.month, x.day, tzinfo=VN).isoformat()
    s = str(x or "").strip()
    for f in ("%d/%m/%Y %H:%M:%S", "%d/%m/%Y %H:%M", "%Y-%m-%d %H:%M:%S", "%d/%m/%Y"):
        try:
            return dt.datetime.strptime(s, f).replace(tzinfo=VN).isoformat()
        except ValueError:
            pass
    return None


def ngay(x):
    if isinstance(x, (dt.datetime, dt.date)):
        return x.strftime("%Y-%m-%d")
    s = str(x or "").strip()
    return s if re.fullmatch(r"\d{4}-\d{2}-\d{2}", s) else None


def so(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def la_lop_gv(lop):
    return re.fullmatch(r"\s*gv\s*", str(lop or ""), re.I) is not None


def loai_lop(lop):
    s = str(lop).lower()
    if la_lop_gv(lop):
        return "gv"
    return "hoc_them" if ("thêm" in s or re.search(r"\bht\b", s)) else "chinh_khoa"


def khoi_lop(lop):
    m = re.search(r"[6-9]", str(lop))
    return int(m.group(0)) if m else None


def doc_tab(wb, ten):
    if ten not in wb.sheetnames:
        return None, []
    ws = wb[ten]
    rows = [list(r) for r in ws.iter_rows(values_only=True)]
    if not rows:
        return None, []
    return [str(h).strip() if h is not None else "" for h in rows[0]], [r for r in rows[1:] if any(c not in (None, "") for c in r)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("xlsx")
    ap.add_argument("--email", required=True, help="email tài khoản giáo viên chủ website trên nền mới")
    ap.add_argument("--nam-hoc", default="2026-2027")
    ap.add_argument("--bai-hoc", default="supabase/du-lieu/bai_hoc.sql", help="tệp bai_hoc.sql để biết tên trang tính cũ của từng bài")
    a = ap.parse_args()

    # Tiền tố mã kết quả (TG7-…) và tên trang tính cũ → mã bài.
    # Tải Google Sheet thành .xlsx sẽ cắt tên trang tính quá 31 ký tự, nên nhận bài chủ yếu theo tiền tố mã kết quả.
    tab_bai, tien_to_bai = {}, {}
    for m in re.finditer(r"\(\s*'([^']+)',\s*\d,\s*'(?:[^']|'')*',\s*'(?:[^']|'')*',\s*'(?:[^']|'')*',\s*'([^']*)',\s*'((?:[^']|'')*)'", open(a.bai_hoc, encoding="utf-8").read()):
        tab_bai[m.group(3).replace("''", "'")] = m.group(1)
        tien_to_bai[m.group(2)] = m.group(1)

    wb = openpyxl.load_workbook(a.xlsx, data_only=True, read_only=True)
    out, bao = [], []
    gv = f"(select id from public.giao_vien where lower(email) = lower({sql(a.email)}))"

    out.append("-- Sinh bởi supabase/cong-cu/chuyen_tu_sheet.py. CÓ DỮ LIỆU HỌC SINH – không đưa lên GitHub.")
    out.append("begin;")
    out.append(f"do $$ begin if not exists (select 1 from public.giao_vien where lower(email) = lower({sql(a.email)})) then "
               f"raise exception 'Chưa có tài khoản giáo viên với email {a.email}: hãy đăng nhập nền mới một lần trước'; end if; end $$;")
    out.append(f"update public.giao_vien set trang_thai = 'da_duyet', la_quan_tri = true where lower(email) = lower({sql(a.email)});")

    # ---------- Học sinh và lớp ----------
    head, rows = doc_tab(wb, TAB_HS)
    if head is None:
        sys.exit(f"Không thấy trang tính '{TAB_HS}' trong tệp")
    lops, hs, thu_tu, bo_gv = [], {}, {}, 0
    for r in rows:
        lop, ten, ma = str(r[0] or "").strip(), str(r[1] or "").strip(), ma_so(r[2] if len(r) > 2 else "")
        if not ten or not ma or not lop:
            continue
        if la_lop_gv(lop):
            bo_gv += 1          # mã GV cũ: nền mới giáo viên đăng nhập bằng email
            continue
        if lop not in lops:
            lops.append(lop)
        if ma not in hs:
            hs[ma] = {"ten": ten, "lops": []}
        if lop not in hs[ma]["lops"]:
            hs[ma]["lops"].append(lop)
    for lop in lops:
        out.append(f"insert into public.lop (giao_vien_id, ten, khoi, nam_hoc, loai) values ({gv}, {sql(lop)}, {sql(khoi_lop(lop))}, "
                   f"{sql(a.nam_hoc)}, {sql(loai_lop(lop))}) on conflict (giao_vien_id, nam_hoc, ten) do nothing;")
    for ma, h in hs.items():
        out.append(f"insert into public.hoc_sinh (ho_ten, ma_hs) values ({sql(h['ten'])}, {sql(ma)}) "
                   f"on conflict (ma_hs) do update set ho_ten = excluded.ho_ten;")
        for i, lop in enumerate(h["lops"]):
            out.append("insert into public.lop_hoc_sinh (lop_id, hoc_sinh_id, thu_tu) select l.id, s.id, "
                       f"{i} from public.lop l, public.hoc_sinh s where l.giao_vien_id = {gv} and l.nam_hoc = {sql(a.nam_hoc)} "
                       f"and l.ten = {sql(lop)} and s.ma_hs = {sql(ma)} on conflict do nothing;")
    bao.append(f"{len(hs)} học sinh, {len(lops)} lớp ({sum(1 for h in hs.values() if len(h['lops']) > 1)} em ở nhiều lớp); bỏ {bo_gv} dòng mã GV")

    # ---------- Kết quả từng bài ----------
    tong_luot, bo_khong_ma, bo_tab = 0, 0, []
    for ten_tab in wb.sheetnames:
        if ten_tab in (TAB_HS, TAB_XEM, TAB_SO, TAB_THUONG):
            continue
        goc, thu_thach = ten_tab, "thử thách" in ten_tab.lower()
        if ten_tab.endswith(" - Thử thách"):
            goc = ten_tab[: -len(" - Thử thách")]
        bai_tab = tab_bai.get(goc) or next((b for t, b in tab_bai.items() if len(goc) >= 25 and t.startswith(goc)), None)
        head, rows = doc_tab(wb, ten_tab)
        nhan_duoc = False
        if not head or len(head) < SO_COT_DAU + SO_COT_CUOI:
            continue
        dang = head[SO_COT_DAU: len(head) - SO_COT_CUOI]
        for r in rows:
            r = r + [None] * (len(head) - len(r))
            ma, ma_kq = ma_so(r[1]), str(r[-1] or "").strip()
            diem = so(r[7])
            if not ma or not ma_kq or diem is None:
                continue
            bai = tien_to_bai.get(ma_kq.split("-")[0] + "-") or bai_tab
            if not bai:
                continue
            nhan_duoc = True
            if ma not in hs:
                bo_khong_ma += 1
                continue
            gioi_han = so(r[12])
            # Thử thách: theo tên trang tính, hoặc giới hạn 30 phút (bài kiểm tra thường 25 phút, kiểm tra nhanh 5 phút)
            loai = "thu_thach" if (thu_thach or gioi_han == 30) else ("kt5" if str(r[5]).strip() == "Kiểm tra nhanh" else "kt25")
            phan = {"mc": r[8], "ds": r[9], "tln": r[10]}
            phan = {k: str(v) for k, v in phan.items() if v not in (None, "")}
            dd = {}
            for i, ten_dang in enumerate(dang):
                v = str(r[SO_COT_DAU + i] or "")
                m = re.fullmatch(r"\s*(\d+)\s*/\s*(\d+)\s*", v)
                if ten_dang and m:
                    dd[ten_dang] = [int(m.group(1)), int(m.group(2))]
            phut = so(r[11])
            nop = thoi_diem(r[0])
            bat_dau = (dt.datetime.fromisoformat(nop) - dt.timedelta(minutes=phut)).isoformat() if nop and phut is not None else nop
            ghi_chu = "; ".join(x for x in (str(r[-2] or "").strip(), f"Mã đề cũ: {r[6]}" if r[6] not in (None, "") else "") if x)
            out.append(
                "insert into public.luot_lam (hoc_sinh_id, bai_id, loai, diem, diem_phan, diem_dang, bat_dau, nop_luc, gioi_han_giay, ghi_chu, nguon, ma_ket_qua_cu) "
                f"select s.id, {sql(bai)}, {sql(loai)}, {diem}, {jsql(phan)}, {jsql(dd)}, coalesce({sql(bat_dau)}::timestamptz, now()), "
                f"{sql(nop)}::timestamptz, {sql(int(gioi_han * 60) if gioi_han else None)}, {sql(ghi_chu)}, 'sheet', {sql(ma_kq)} "
                f"from public.hoc_sinh s where s.ma_hs = {sql(ma)} on conflict (ma_ket_qua_cu) do nothing;")
            tong_luot += 1
        if rows and not nhan_duoc:
            bo_tab.append(ten_tab)
    bao.append(f"{tong_luot} lượt làm bài; bỏ {bo_khong_ma} lượt của mã không còn trong danh sách")
    if bo_tab:
        bao.append("KHÔNG NHẬN RA trang tính (bỏ qua): " + ", ".join(bo_tab))

    # ---------- Điểm thưởng ----------
    head, rows = doc_tab(wb, TAB_THUONG)
    so_thuong = 0
    for r in rows or []:
        r = r + [None] * (11 - len(r))
        ma = ma_so(r[0])
        if ma not in hs:
            continue
        try:
            g = json.loads(r[7] or "{}")
        except (TypeError, ValueError):
            g = {}
        huy_hieu = g.pop("badges", {}) if isinstance(g, dict) else {}
        out.append(
            "insert into public.thuong (hoc_sinh_id, xp, xp_tuan, tuan, chuoi_ngay, ngay_cuoi, huy_hieu, du_lieu, cap_nhat) "
            f"select s.id, {int(so(r[3]) or 0)}, {int(so(r[9]) or 0)}, {sql(ngay(r[10]))}::date, {int(so(r[4]) or 0)}, {sql(ngay(r[5]))}::date, "
            f"{jsql(huy_hieu)}, {jsql(g if isinstance(g, dict) else {})}, coalesce({sql(thoi_diem(r[8]))}::timestamptz, now()) "
            f"from public.hoc_sinh s where s.ma_hs = {sql(ma)} on conflict (hoc_sinh_id) do update set xp = excluded.xp, xp_tuan = excluded.xp_tuan, "
            "tuan = excluded.tuan, chuoi_ngay = excluded.chuoi_ngay, ngay_cuoi = excluded.ngay_cuoi, huy_hieu = excluded.huy_hieu, "
            "du_lieu = excluded.du_lieu, cap_nhat = excluded.cap_nhat;")
        so_thuong += 1
    bao.append(f"{so_thuong} học sinh có điểm thưởng")

    out.append("commit;")
    for b in bao:
        out.append(f"-- {b}")
        print(b, file=sys.stderr)
    print("\n".join(out))


if __name__ == "__main__":
    main()
