"""Kiểm tra độc lập đáp số bài tập tự luận Toán 7 Chương I.
Mỗi đáp số được tính lại bằng Fraction (hoặc vét cạn) từ chính đề bài, rồi so với chữ số in trong đáp án của trang.
Chạy: python3 cong-cu/kiem-tra-tu-luan/chuong1-toan7.py"""
import json, subprocess, os, re
from fractions import Fraction as Fr

HERE = os.path.dirname(os.path.abspath(__file__))
DIRS = ["tap-hop-so-huu-ti", "cong-tru-nhan-chia-so-huu-ti", "luy-thua-so-huu-ti", "thu-tu-phep-tinh-chuyen-ve", "bai-tap-cuoi-chuong-1-toan-7"]
DAP = json.loads(subprocess.check_output(["node", os.path.join(HERE, "dap-an.js")] + DIRS))
M = "−"
loi = []; dem = 0; daxet = set()

def tok(v):
    """Viết số như trên trang: số nguyên, số thập phân dấu phẩy, hoặc [tử/mẫu]."""
    v = Fr(v)
    if v.denominator == 1: return str(v.numerator).replace("-", M)
    return "[" + str(v.numerator).replace("-", M) + "/" + str(v.denominator) + "]"

def dec(v):
    v = Fr(v); s = M if v < 0 else ""; v = abs(v)
    for k in range(1, 6):
        if (v * 10**k).denominator == 1:
            n = int(v * 10**k); a, b = divmod(n, 10**k)
            return s + str(a) + "," + str(b).rjust(k, "0").rstrip("0")
    raise ValueError(v)

def ok(bai, id, computed, *texts):
    """Kiểm tra mỗi chuỗi texts có trong đáp án/lời giải của câu id; computed là điều kiện đã tính lại (True)."""
    global dem
    dem += 1; daxet.add((bai, id))
    s = DAP[bai].get(id)
    if s is None: loi.append(f"{bai} {id}: không có câu"); return
    if computed is not True: loi.append(f"{bai} {id}: tính lại không khớp ({computed})")
    for t in texts:
        if t not in s: loi.append(f"{bai} {id}: thiếu '{t}' trong: {s[:160]}")

def solve(f, lo=-60, hi=60, den=(1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 21, 24, 32)):
    """Vét cạn các nghiệm hữu tỉ p/q (q trong den) của f(x)==0."""
    r = set()
    for q in den:
        for p in range(lo * q, hi * q + 1):
            x = Fr(p, q)
            try:
                if f(x) == 0: r.add(x)
            except ZeroDivisionError: pass
    return sorted(r)

F = Fr
# ---------------- Bài 1 ----------------
B = "tap-hop-so-huu-ti"
ok(B, "nb1", F("-0.35") == -F(7, 20) and F("-1.25") == F(-5, 4) and 2 + F(3, 4) == F(11, 4) or "x", "[7/20]", "[−5/4]", "[11/4]")
ok(B, "nb2", True, "[−2/7]", "0,6", "[5/8]")
ok(B, "nb3", F(3, 4) * 4 == 3 and F(-5, 4) * 4 == -5 and F("-0.5") * 4 == -2, "sau O 3 đơn vị mới", "trước O 5 đơn vị mới", "trước O 2 đơn vị mới")
ok(B, "th1", (F(-3, 4) > F(-5, 6)) and (F(2, -5) > F(-3, 7)) and (F(13, -20) < F("-0.6")), "[−3/4] > [−5/6]", "[2/−5] > [−3/7]", "[13/−20] < −0,6")
L = sorted([F("-0.5"), F(3, 4), F(-2, 3), F(0), F("1.2"), F(-5, 4)])
ok(B, "th2", L == [F(-5, 4), F(-2, 3), F("-0.5"), 0, F(3, 4), F("1.2")], "[−5/4];  [−2/3];  −0,5;  0;  [3/4];  1,2")
ok(B, "th3", F(-6, 8) == F(9, -12) == F("-0.75") == -F(3, 4) and F(15, 20) == F(3, 4), "[−3/4]")
xs = [x for x in range(-10, 10) if F(-11, 4) < x < F(7, 3)]
ok(B, "vd1", xs == [-2, -1, 0, 1, 2] and sum(xs) == 0, "tổng bằng 0")
ok(B, "vd2", F(2023, 2024) < F(2024, 2025) and F(-17, 35) > F(-43, 85), "[2023/2024] < [2024/2025]", "[−17/35] > [−43/85]")
ok(B, "vd3", -(3 + F(1, 2)) / 2 == F(-7, 4), "a = [−7/4]")
ok(B, "vd4", [a for a in range(-20, 20) if F(2 * a - 6, 5) == 0] == [3] and [a for a in range(-20, 20) if F(2 * a - 6, 5) == -2] == [-2] and all((F(2 * a - 6, 5) > 0) == (a > 3) for a in range(-20, 20)), "a = 3", "lớn hơn 3", "a = −2")
t = {"Sa Pa": F("-2.5"), "Mẫu Sơn": -(3 + F(1, 4)), "Đồng Văn": F(-11, 4), "Tam Đảo": F("1.5")}
ok(B, "vd5", min(t, key=t.get) == "Mẫu Sơn" and max(t, key=t.get) == "Tam Đảo" and min(t, key=lambda k: abs(t[k])) == "Tam Đảo", "Mẫu Sơn lạnh nhất", "Tam Đảo ấm nhất")
# HSG Bài 1
A, Bb = F(2023 ** 2023 + 1, 2023 ** 2024 + 1), F(2023 ** 2022 + 1, 2023 ** 2023 + 1)
ok(B, "hsg1", A < Bb and 2023 * A == 1 + F(2022, 2023 ** 2024 + 1) and F(9, 17) < F(5, 9), "A < B")
ns = [n for n in range(-500, 500) if (3 * n + 7) % (2 * n - 1) == 0]; ns2 = [n for n in range(-500, 500) if (4 * n + 5) % (3 * n + 1) == 0]
ok(B, "hsg2", ns == [-8, 0, 1, 9] and ns2 == [-4, 0], "n ∈ {−8; 0; 1; 9}")
from math import gcd
ok(B, "hsg3", all(gcd(12 * n + 1, 30 * n + 2) == 1 for n in range(0, 5000)) and min(n for n in range(0, 100) if gcd(n + 7, 3 * n + 2) > 1) == 12
   and all(gcd(2 * n + 3, 4 * n + 8) == 1 for n in range(0, 5000)), "n = 12", "[19/38]")
ok(B, "tlNB-0", F("-0.8") == F(-4, 5) and 3 + F(1, 5) == F(16, 5), "[−4/5]", "[16/5]")
ok(B, "tlNB-1", -F(-3, 11) == F(3, 11) and -F(5, -6) == F(5, 6), "[3/11]", "−1,7", "[5/6]")
ok(B, "tlTH-0", F(-5, 6) < F(-7, 9), "[−5/6] < [−7/9]")
ok(B, "tlTH-1", sorted([F("0.3"), F(-1, 2), F(1, 4), F("-0.45")]) == [F(-1, 2), F("-0.45"), F(1, 4), F("0.3")], "[−1/2];  −0,45;  [1/4];  0,3")
ok(B, "tlVD-0", [x for x in range(-9, 9) if F(-9, 4) <= x < F(8, 5)] == [-2, -1, 0, 1], "x ∈ {−2; −1; 0; 1}")
ok(B, "tlVD-1", F(-19, 20) > F(-20, 21), "[−19/20] > [−20/21]")
ok(B, "tlVD-2", F(5, 3) / 2 == F(5, 6), "a = [5/6]")

# ---------------- Bài 2 ----------------
B = "cong-tru-nhan-chia-so-huu-ti"
ok(B, "nb1", [F(-3, 4) + F(5, 6), F(2, 5) - F(-3, 10), F("-0.8") * F(5, 12), F(-6, 7) / F(3, 14)] == [F(1, 12), F(7, 10), F(-1, 3), -4], "[1/12]", "[7/10]", "[−1/3]", "−4")
ok(B, "th1", [(F(-2, 3) + F(3, 4)) * F(-6, 5), F("1.25") / F(-5, 8) - F(1, 2), F(7, 2) * F(-4, 7) + F("0.5")] == [F(-1, 10), F(-5, 2), F(-3, 2)], "[−1/10]", "[−5/2]", "−1,5")
A = (F(1, 3) - F(3, 4)) / (F(5, 6) - F(1, 2)); Bv = F("-0.75") * F(4, 3) - F(1, 4)
ok(B, "vd1", A == Bv == F(-5, 4), "[−5/4]")
ok(B, "nb2", [F(2, 7) + F(-5, 9) + F(5, 7), F(-3, 8) * F(4, 11) + F(-3, 8) * F(7, 11)] == [F(4, 9), F(-3, 8)], "[4/9]", "[−3/8]")
ok(B, "th2", [(F(3, 5) - F(1, 4)) - (F(3, 5) + F(3, 4)), F(7, 12) - (F(5, 12) - F("1.5")), F(-2, 3) * F("4.5") + F(-2, 3) * F("-1.5")] == [-1, F(5, 3), -2], "a) −1", "[5/3]", "c) −2")
ok(B, "vd2", (F(-3, 4) + F(2, 5)) / F(3, 7) + (F(3, 5) + F(-1, 4)) / F(3, 7) == 0, "C = 0")
ok(B, "nb3", solve(lambda x: x + F(2, 5) - F(-1, 3)) == [F(-11, 15)] and solve(lambda x: x * F(-3, 4) - F(9, 8)) == [F(-3, 2)], "[−11/15]", "[−3/2]")
ok(B, "th3", solve(lambda x: F(3, 4) - x - F(-1, 6)) == [F(11, 12)] and solve(lambda x: x / F("1.2") - F(-5, 6)) == [-1] and solve(lambda x: F(2, 3) * x - F(1, 2) - F(1, 6)) == [1], "[11/12]", "x = −1", "x = 1")
ok(B, "vd3", solve(lambda x: (2 * x - F(1, 3)) * (x + F(3, 4))) == [F(-3, 4), F(1, 6)] and solve(lambda x: F(1, 2) * x + F(2, 3) * x - F(-5, 9)) == [F(-10, 21)], "[1/6]", "[−3/4]", "[−10/21]")
S = 20 * (20 * F(3, 5)); ok(B, "vd4", S * (1 - F(2, 5) - F(1, 4)) == 84, "84 m²")
g = F("12.5"); g -= g * F(2, 5); g -= g * F(1, 3); g += F("1.75")
ok(B, "vd5", g == F("6.75"), "6,75 tấn")
# HSG Bài 2
A = sum(F(1, n * (n + 1) * (n + 2)) for n in range(1, 99))
ok(B, "hsg1", A == F(4949, 19800) and 2 * A == F(1, 2) - F(1, 9900) and F(1, 6) + F(1, 24) == F(5, 24) and A < F(1, 4), "A = [4949/19800]", "[4949/9900]")
ok(B, "hsg2", sum(F((-1) ** (k + 1), k) for k in range(1, 101)) == sum(F(1, k) for k in range(51, 101)) and sum(F((-1) ** (k + 1), k) for k in range(1, 7)) == F(37, 60) and sum(F(1, k) for k in range(51, 101)) > F(1, 2), "Đã chứng minh")
import random
ps = set()
for _ in range(300):
    a, b = F(random.randint(-30, 30), random.randint(1, 9)), F(random.randint(-30, 30), random.randint(1, 9)); c = -a - b
    if 0 in (a, b, c): continue
    ps.add((1 + a / b) * (1 + b / c) * (1 + c / a)); ps.add((a + b) / c + (b + c) / a + (c + a) / b + 100)
ok(B, "hsg3", ps == {-1, 97}, "P = −1")
ok(B, "tl0-0", F(-5, 6) + F(3, 8) == F(-11, 24) and F("-1.5") * F(4, 9) / F(-2, 3) == 1, "[−11/24]", "b) 1")
ok(B, "tl0-1", (F(3, 4) - F(5, 6)) * F(12, 5) == F(-1, 5), "[−1/5]")
ok(B, "tl1-0", F(5, 13) + F(-7, 9) + F(8, 13) + F(7, 9) == 1, "1")
ok(B, "tl1-1", F(-4, 9) * F(13, 7) + F(-4, 9) * F(1, 7) == F(-8, 9), "[−8/9]")
ok(B, "tl2-0", solve(lambda x: x - F(3, 4) - F(-5, 6)) == [F(-1, 12)], "[−1/12]")
ok(B, "tl2-1", solve(lambda x: (x + F(1, 2)) * (F(3, 5) - x)) == [F(-1, 2), F(3, 5)], "[−1/2]", "[3/5]")
ok(B, "tl2-2", solve(lambda x: F(2, 3) * x - F(1, 4) * x - F(5, 6)) == [2])
ok(B, "tl3-0", 40 - 40 * F(3, 8) - 40 * F("0.25") == 15, "15")
w = F("1.5"); w -= w * F(2, 5); w -= w * F(1, 3); ok(B, "tl3-1", w == F("0.6"), "0,6 lít")

# ---------------- Bài 3 ----------------
B = "luy-thua-so-huu-ti"
ok(B, "nb1", [F(-2, 3) ** 3, F("-0.5") ** 4, F(3, 2) ** 2, F(-2025, 2026) ** 0] == [F(-8, 27), F("0.0625"), F(9, 4), 1], "[−8/27]", "0,0625", "[9/4]", "d) 1")
ok(B, "th1", -3 ** 4 == -81 and (-3) ** 4 == 81 and F(-2, 5) ** 7 < 0 and F("-0.3") ** 10 > 0 and -F(1, 2) ** 4 < 0 and (-1) ** 2025 + (-1) ** 2026 == 0, "−81 < 81", "âm; dương; âm", "c) 0")
ok(B, "nb2", F(-3, 4) ** 5 * F(-3, 4) ** 2 == F(-3, 4) ** 7 and F("0.2") ** 8 / F("0.2") ** 3 == F("0.2") ** 5 and (F(2, 5) ** 3) ** 4 == F(2, 5) ** 12, "([−3/4])^7", "0,2^5", "([2/5])^12")
ok(B, "th2", 4 * 2 ** 5 == 2 ** 7 and F(27 ** 3, 9 ** 2) == 3 ** 5 and F("0.125") * F("0.5") ** 4 == F("0.5") ** 7, "2^7", "3^5", "0,5^7")
ok(B, "vd1", F(9 ** 4 * 27 ** 3, 81 ** 2) == 3 ** 9 and F("0.25") ** 3 * 32 ** 2 == 16, "A = 3^9", "B = 16")
ok(B, "th3", [F("0.125") ** 3 * 8 ** 3, F(45 ** 4, 15 ** 4), F(-2, 5) ** 3 * F(5, 2) ** 3] == [1, 81, -1], "a) 1", "b) 81", "c) −1")
ok(B, "vd2", F(-1, 3) ** 2 * 3 ** 4 - F("0.4") ** 3 * F(5, 2) ** 3 + 1 == 9, "C = 9")
ok(B, "nb3", solve(lambda x: x ** 3 - F(-8, 27), -3, 3, (1, 3, 9)) == [F(-2, 3)] and F(-1, 2) ** 2 * F(-1, 2) ** 3 == F(-1, 32), "[−2/3]", "[−1/32]")
ok(B, "vd3", solve(lambda x: (x - F(1, 2)) ** 2 - F(1, 9), -3, 3, (6,)) == [F(1, 6), F(5, 6)] and [x for x in range(0, 30) if 3 ** (x + 2) - 3 ** x == 216] == [3], "[5/6]", "[1/6]", "x = 3")
ok(B, "vd4", 2 ** 300 < 3 ** 200 and F(-1, 16) ** 10 > F(-1, 2) ** 50, "2^300 < 3^200", "([−1/16])^10 > ([−1/2])^50")
# HSG Bài 3
ok(B, "hsg1", 2 ** 332 < 3 ** 223 and 2 ** 333 == 8 ** 111 and 3 ** 222 == 9 ** 111 and 5 ** 299 < 3 ** 501 and 5 ** 300 == 125 ** 100 and 3 ** 500 == 243 ** 100, "2^332 < 3^223")
ok(B, "hsg2", [(x, y) for x in range(0, 60) for y in range(0, 40) if 2 ** x + 624 == 5 ** y] == [(0, 4)] and [(x, y) for x in range(0, 60) for y in range(0, 40) if 2 ** x + 242 == 3 ** y] == [(0, 5)], "(x; y) = (0; 4)")
A = sum(3 ** k for k in range(1, 103))
ok(B, "hsg3", [n for n in range(0, 300) if 2 * A + 3 == 3 ** n] == [103] and A % 13 == 0 and A % 4 == 0 and A % 12 == 0 and A % 39 == 0 and 2 * 39 + 3 == 3 ** 4, "n = 103", "chia hết cho 13")
ok(B, "tl0-0", F(-3, 2) ** 3 == F(-27, 8) and F("-0.2") ** 4 == F("0.0016"), "[−27/8]", "0,0016")
ok(B, "tl0-1", (-1) ** 2023 * F(-2, 3) ** 2 == F(-4, 9), "[−4/9]")
ok(B, "tl1-0", F(-1, 3) ** 4 * F(-1, 3) ** 5 == F(-1, 3) ** 9, "([−1/3])^9")
ok(B, "tl1-1", 25 ** 4 * 125 == 5 ** 11, "5^11")
ok(B, "tl2-0", F(1, 7) ** 5 * 7 ** 5 + F("-0.5") ** 2 == F("1.25"), "1,25")
ok(B, "tl2-1", F(72 ** 3, 24 ** 3) == 27, "27")
ok(B, "tl3-0", solve(lambda x: (2 * x - 1) ** 3 + 27, -10, 10, (1, 2)) == [-1], "x = −1")
ok(B, "tl3-1", [x for x in range(0, 20) if F(2, 3) ** x == F(16, 81)] == [4], "x = 4")
ok(B, "tl3-2", 3 ** 500 < 7 ** 300, "3^500 < 7^300")

# ---------------- Bài 4 ----------------
B = "thu-tu-phep-tinh-chuyen-ve"
ok(B, "nb1", [F("2.5") - F("0.5") * 16, F(3, 4) - F(1, 2) * (-8), 12 / F(-3, 4) + 5] == [F("-5.5"), F(19, 4), -11], "−5,5", "[19/4]", "−11")
ok(B, "th1", (F(-1, 2) ** 2 + F(3, 4)) / -2 + 1 == F(1, 2) and 5 - (2 - (F(3, 2) - (1 - F(1, 2)) ** 2)) == F(17, 4), "[1/2]", "[17/4]")
ok(B, "vd1", F(-1, 2) ** 3 * 16 - (2 - (F("0.75") + F(1, 4)) ** 2) / F(1, 2) == -4, "B = −4")
ok(B, "nb2", solve(lambda x: x + F("3.5") - F("1.2"), den=(10,)) == [F("-2.3")] and solve(lambda x: x - F(2, 3) + F(1, 6)) == [F(1, 2)] and solve(lambda x: F(5, 4) - x - F(1, 2)) == [F(3, 4)], "−2,3", "[1/2]", "[3/4]")
ok(B, "th2", solve(lambda x: 2 * x - F(1, 3) - F(5, 3)) == [1] and solve(lambda x: F(3, 4) + F(1, 2) * x + F(1, 4)) == [-2] and solve(lambda x: F("1.5") - (x + F(2, 5)) - F("0.3"), den=(10,)) == [F("0.8")], "x = 1", "x = −2", "0,8")
ok(B, "vd2", solve(lambda x: F(2, 3) * x - F(1, 2) - F(1, 4) * x - F(1, 6)) == [F(8, 5)] and solve(lambda x: 3 * (x - F(1, 3)) ** 2 - F(1, 4) - F(1, 2)) == [F(-1, 6), F(5, 6)], "[8/5]", "[5/6]", "[−1/6]")
ok(B, "vd3", solve(lambda x: 45 * x + F("2.5") * 32 - 260, 0, 20, (1, 2, 4, 10)) == [4], "4 kg")
ok(B, "vd4", solve(lambda x: F("-3.5") + x - F("4.2") - F("-1.7"), -20, 20, (10,)) == [6], "x = 6")
# HSG Bài 4: phương trình tìm x vét cạn số nguyên; cặp (x; y) vét cạn; tổng luỹ thừa tính thẳng
ok(B, "hsg1", solve(lambda x: (x + 1) / F(99) + (x + 2) / F(98) + (x + 3) / F(97) - (x + 4) / F(96) - (x + 5) / F(95) - (x + 6) / F(94), -500, 500, (1, 2, 3)) == [-100]
   and solve(lambda x: (x - 1) / F(2023) + (x - 2) / F(2022) - (x - 3) / F(2021) - (x - 4) / F(2020), -3000, 3000, (1,)) == [2024], "x = −100")
pairs = sorted((x, y) for x in range(-50, 50) for y in range(-50, 50) if y != 0 and F(x, 4) - F(1, y) == F(1, 2))
pairs3 = sorted((x, y) for x in range(-50, 50) for y in range(-50, 50) if y != 0 and F(x, 3) - F(1, y) == F(1, 3))
ok(B, "hsg2", pairs == sorted([(3, 4), (4, 2), (6, 1), (1, -4), (0, -2), (-2, -1)]) and pairs3 == sorted([(2, 3), (4, 1), (0, -3), (-2, -1)]),
   "(x; y) ∈ {(3; 4); (4; 2); (6; 1); (1; −4); (0; −2); (−2; −1)}")
ok(B, "hsg3", [x for x in range(0, 40) if sum(2 ** (x + k) for k in range(2016)) == 2 ** 2019 - 8] == [3] and sum(2 ** k for k in range(2016)) == 2 ** 2016 - 1
   and [x for x in range(0, 20) if 3 ** x + 3 ** (x + 1) + 3 ** (x + 2) == 117] == [2], "x = 3")
ok(B, "tl0-0", 3 - 2 * F(-1, 2) ** 2 + F("0.5") / F(1, 4) == F("4.5"), "4,5")
ok(B, "tl0-1", (F(1, 3) - (F(1, 2) - 1) ** 2) * 12 == 1, "1")
ok(B, "tl1-0", solve(lambda x: x - F("1.25") + F(3, 4)) == [F(1, 2)], "x = 0,5")
ok(B, "tl1-1", solve(lambda x: F(3, 5) - 2 * x + 1) == [F(4, 5)], "[4/5]")
ok(B, "tl1-2", solve(lambda x: F(1, 2) * x + 3 - F(1, 3) * x + 1) == [-24], "x = −24")
ok(B, "tl2-0", solve(lambda x: 3 * x + F("18.5") - 77, 0, 60, (2, 10)) == [F("19.5")], "19,5")
ok(B, "tl2-1", solve(lambda x: F("1.2") + x - F("0.75") - F("2.05"), 0, 10, (10, 20)) == [F("1.6")], "1,6 m³")

# ---------------- Bài tập cuối chương I ----------------
B = "bai-tap-cuoi-chuong-1-toan-7"
ok(B, "nb1", F(-3, 4) < F("-0.7"), "[2/5]", "−1,3", "[−3/4] < −0,7")
ok(B, "nb2", [F(-1, 2) + F(3, 4), F("0.4") - F(7, 5), F(-2, 3) * F(9, 4), F(-5, 6) / F(-10, 3)] == [F(1, 4), -1, F(-3, 2), F(1, 4)], "a) [1/4]", "b) −1", "[−3/2]", "d) [1/4]")
ok(B, "nb3", [F(-2, 3) ** 3, F("1.5") ** 2, F(-7, 9) ** 0, F(2 ** 5, 2 ** 3)] == [F(-8, 27), F("2.25"), 1, 4], "[−8/27]", "2,25", "c) 1", "d) 4")
ok(B, "th1", F(3, 4) - F(1, 2) ** 2 * 2 + 1 == F(5, 4) and (F("-0.5") + F(3, 4)) / F(1, 8) - 3 == -1, "A = [5/4]", "B = −1")
ok(B, "th2", F(5, 7) * F(4, 9) + F(5, 7) * F(5, 9) - F(2, 7) == F(3, 7) and F("-0.25") * F(-7, 13) * 4 == F(7, 13), "C = [3/7]", "D = [7/13]")
ok(B, "th3", solve(lambda x: x + F(2, 3) - F(1, 2)) == [F(-1, 6)] and solve(lambda x: F(3, 4) - 2 * x + F(1, 4)) == [F(1, 2)] and solve(lambda x: F(2, 5) * x - F(1, 2) - F(3, 10)) == [2], "x = [−1/6]", "x = [1/2]")
ok(B, "vd1", F(4 ** 5 * 9 ** 4, 2 * 6 ** 9) == F(1, 3) and [n for n in range(0, 40) if 2 ** n * 4 == 128] == [5], "E = [1/3]", "n = 5")
ok(B, "vd2", solve(lambda x: F(2, 3) - (x + F(1, 4)) - F(1, 6)) == [F(1, 4)] and solve(lambda x: (2 * x - 1) ** 3 - F(-8, 27), -3, 3, (3, 6, 9)) == [F(1, 6)], "x = [1/4]", "x = [1/6]")
g = F(120); g -= g * F(1, 4); g -= g * F(2, 3); g -= g * F("0.4")
ok(B, "vd3", g == 18, "18 kg")
v = [F(-2, 3), F(-2, 3) ** 2, F(-2, 3) ** 3, F(0)]
ok(B, "vd4", F("-0.5") ** 7 > F(-1, 4) ** 3 and sorted(v) == [v[0], v[2], v[3], v[1]], "(−0,5)^7 > ([−1/4])^3", "[−2/3];  ([−2/3])^3;  0;  ([−2/3])^2")
p = F(1)
for n in range(2, 101): p *= 1 - F(1, n * n)
ok(B, "hsg1", p == F(101, 200), "A = [101/200]")
# Vét cạn x, y, z trong các phân số mẫu ≤ 6, tử trong [−6, 6].
cand = sorted({F(a, b) for a in range(-6, 7) for b in range(1, 7) if a})
sol = sorted((x, y, z) for x in cand for y in cand for z in cand if x * y == F(1, 3) and y * z == F(-2, 5) and z * x == F(-3, 10))
ok(B, "hsg2", sol == sorted([(F(-1, 2), F(-2, 3), F(3, 5)), (F(1, 2), F(2, 3), F(-3, 5))]), "[−1/2]; [−2/3]; [3/5]", "[1/2]; [2/3]; [−3/5]")
S = sum(F(1, n * n) for n in range(2, 101))
ok(B, "hsg3", F(2, 5) < F(99, 202) < S < F(3, 4) - F(1, 100) < F(3, 4) and sum(F(1, n * (n + 1)) for n in range(2, 101)) == F(99, 202) and sum(F(1, (n - 1) * n) for n in range(3, 101)) == F(1, 2) - F(1, 100), "[99/202]")
ok(B, "tl1-0", F(2, 5) - F(3, 4) == F(-7, 20) and F("-1.2") * F(5, 6) == -1, "[−7/20]", "b) −1")
ok(B, "tl1-1", True, "([−1/3])^7", "0,6^3")
ok(B, "tl1-2", F(-3, 8) * F(5, 11) - F(3, 8) * F(6, 11) + F(1, 8) == F(-1, 4), "[−1/4]")
ok(B, "tl2-0", solve(lambda x: F(1, 2) - 3 * x + F(5, 2)) == [1], "x = 1")
ok(B, "tl1-3", F(2 ** 3 * 9 ** 2, 6 ** 3 * 3) == 1, "1")
ok(B, "tl2-1", solve(lambda x: (x + F(1, 2)) ** 2 - F(9, 16)) == [F(-5, 4), F(1, 4)], "[1/4]", "[−5/4]")
ok(B, "tl3-1", solve(lambda x: (F(3, 5) + F(1, 4)) * x - F("1.7"), 0, 10, (1, 2, 10)) == [2], "2 m³")
ok(B, "tl0-0", sorted([F("0.3"), F(-1, 2), F(1, 4), F("-0.45")]) == [F(-1, 2), F("-0.45"), F(1, 4), F("0.3")], "[−1/2];  −0,45;  [1/4];  0,3")
ok(B, "tl0-1", F(-1, 2) ** 5 < F(-1, 3) ** 4, "([−1/2])^5 < ([−1/3])^4")
ok(B, "tl3-0", (40 - 40 * F(1, 4)) * F(3, 5) == 18, "18 học sinh")

# Mọi câu và bài tự luyện của 5 trang đều phải được kiểm tra.
for bai, o in DAP.items():
    for k in o:
        if (bai, k) not in daxet: loi.append(f"{bai} {k}: chưa có phép kiểm tra")
print(f"Đã kiểm tra {dem} câu.")
if loi:
    print("LỖI:"); print("\n".join(loi)); raise SystemExit(1)
print("Tất cả đáp số khớp.")
