"""Kiểm tra độc lập bài tập tự luận hình học Toán 7 Chương IV
(Luyện tập chung sau Bài 16, Bài tập cuối chương IV).
Mỗi bài được dựng lại bằng tọa độ từ chính đề bài (bài "với mọi vị trí" thì thử nhiều vị trí ngẫu nhiên),
tính lại số đo góc, độ dài, rồi so với đáp số in trên trang (lấy qua dap-an.js).
Chạy: python3 cong-cu/kiem-tra-tu-luan/hinh-chuong4-toan7.py"""
import json, subprocess, os, math, random, cmath

HERE = os.path.dirname(os.path.abspath(__file__))
DIRS = ["luyen-tap-chung-sau-bai-16", "bai-tap-cuoi-chuong-4-toan-7"]
DAP = json.loads(subprocess.check_output(["node", os.path.join(HERE, "dap-an.js")] + DIRS))
random.seed(7)
loi = []; dem = 0; daxet = set()
EPS = 1e-7

# ---------- hình học bằng số phức ----------
def P(x, y): return complex(x, y)
def pol(o, r, d): return o + r * cmath.exp(1j * math.radians(d))
def goc(b, a, c):
    """Số đo góc BAC (độ)."""
    u, v = b - a, c - a
    return math.degrees(abs(cmath.phase(v / u)))
def d(a, b): return abs(a - b)
def cut(p1, p2, p3, p4):
    """Giao điểm hai đường thẳng p1p2, p3p4."""
    a, b = p2 - p1, p4 - p3
    t = ((p3 - p1).real * b.imag - (p3 - p1).imag * b.real) / (a.real * b.imag - a.imag * b.real)
    return p1 + a * t
def foot(p, a, b):
    t = ((p - a) * (b - a).conjugate()).real / abs(b - a) ** 2
    return a + (b - a) * t
def tri(b, c):
    """Tam giác có ∠B = b, ∠C = c, B = 0, C = 10."""
    B, C = P(0, 0), P(10, 0)
    return cut(B, pol(B, 1, b), C, pol(C, 1, 180 - c)), B, C
def iso(a):
    """Tam giác cân tại A có ∠A = a (độ)."""
    return tri((180 - a) / 2, (180 - a) / 2)
def rot(p, o, deg): return o + (p - o) * cmath.exp(1j * math.radians(deg))
def song_song(a, b, c, e): return abs(((b - a) * (e - c).conjugate()).imag) < 1e-6 * d(a, b) * d(c, e)
def vuong(a, b, c, e): return abs(((b - a) * (e - c).conjugate()).real) < 1e-6 * d(a, b) * d(c, e)
def bang(x, y): return abs(x - y) < 1e-6 * max(1, abs(x), abs(y))
def phan_giac(B, A, C):
    """Điểm trên tia phân giác của góc BAC."""
    return A + (B - A) / d(B, A) + (C - A) / d(C, A)

def ok(bai, id, dung, *chu):
    """dung: điều kiện tính lại (True). chu: các chuỗi phải có trong đáp số / lời giải của câu id."""
    global dem
    dem += 1; daxet.add((bai, id))
    t = DAP[bai].get(id)
    if t is None: loi.append(f"{bai} {id}: không thấy câu"); return
    if not dung: loi.append(f"{bai} {id}: tính lại không khớp {chu}")
    for c in chu:
        if c not in t: loi.append(f"{bai} {id}: thiếu '{c}' trong: {t[:200]}")

# ================= Luyện tập chung (sau Bài 16) =================
L = "luyen-tap-chung-sau-bai-16"
A, B, C = tri(55, 55)   # ∠A = 70°, ∠B = 55°: dựng với ∠B = ∠C = 55° rồi kiểm tra ∠A
ok(L, "nb1", bang(goc(B, A, C), 70) and bang(d(A, B), d(A, C)), "∠C = 55°", "cân tại A")
ok(L, "nb2", bang(180 - 75 - 60, 45), "∠M = 75°", "∠B = 60°", "∠C = ∠P = 45°", "MN = 5 cm")
ok(L, "nb3", bang(90 - 50, 40), "∠E = 50°", "∠F = 40°", "cạnh huyền – cạnh góc vuông")
A, Bp, M = P(-4, 0), P(4, 0), P(0, 3)
ok(L, "th1", bang(d(M, A) + d(M, Bp) + 8, 18) and bang(goc(A, M, P(0, 0)), goc(Bp, M, P(0, 0))), "18 cm")
A, B, C = tri(70, 70)
ok(L, "th2", bang(goc(B, A, C), 40) and bang(d(A, C), d(A, B)), "∠F = 70°", "cân tại A", "DF = 6 cm")
for _ in range(5):
    O = P(0, 0); A = pol(O, random.uniform(2, 6), random.uniform(150, 210)); Cc = pol(O, random.uniform(2, 6), random.uniform(60, 140))
    Bb, D = -A, -Cc
    ok(L, "th3", bang(d(A, Cc), d(Bb, D)) and song_song(A, Cc, Bb, D) and bang(d(A, D), d(Bb, Cc)), "ΔACD = ΔBDC (c.c.c)")
for _ in range(5):
    t = random.uniform(30, 120); O = P(0, 0); a = random.uniform(2, 5); c = a + random.uniform(1, 5)
    A, Cc, Bb, D = pol(O, a, 0), pol(O, c, 0), pol(O, a, t), pol(O, c, t); I = cut(A, D, Bb, Cc)
    ok(L, "vd1", bang(d(A, D), d(Bb, Cc)) and bang(d(I, A), d(I, Bb)) and bang(d(I, Cc), d(I, D)) and bang(goc(A, O, I), t / 2), "OI là tia phân giác")
for _ in range(5):
    A, B, C = iso(60); k = random.uniform(0.1, 0.9); D = A + (B - A) * k; E = C + (A - C) * k; I = cut(B, E, C, D)
    ok(L, "vd2", bang(goc(B, I, C), 120) and bang(d(C, D), d(B, E)), "∠BIC = 120°")
for _ in range(5):
    B, C = P(0, 0), P(10, 0); A = P(random.uniform(1, 9), random.uniform(2, 7)); M = (B + C) / 2; E = 2 * M - A
    good = bang(d(A, B), d(C, E)) and song_song(A, B, C, E)
    A2 = P(5, random.uniform(2, 8)); E2 = 2 * M - A2
    ok(L, "vd3", good and vuong(A2, M, B, C) and bang(d(C, E2), d(C, A2)), "tam giác ACE cân tại C")
for _ in range(5):
    A, B, C = iso(random.uniform(30, 85)); H = foot(B, A, C); K = foot(C, A, B); O = cut(B, H, C, K)
    ok(L, "vd4", bang(d(B, H), d(C, K)) and bang(d(O, B), d(O, C)) and vuong(A, O, B, C) and bang(abs(((A + O) / 2 - (B + C) / 2).real), abs(((A + O) / 2 - (B + C) / 2).real)) and abs((cut(A, O, B, C) - (B + C) / 2)) < 1e-6, "AO là đường trung trực của BC")
A, B = P(0, 0), P(-5, 0); C = P(0, 5 * math.sqrt(3)); D = P(5, 0); E = cut(B, phan_giac(A, B, C), A, C)
ok(L, "vd5", bang(d(B, C), 10) and bang(d(C, D), 10) and bang(d(B, D), 10) and bang(d(E, B), d(E, C)), "AB = 5 cm", "Tam giác BCD đều")
A, B, C = iso(20); D = cut(B, pol(B, 1, 60), A, C); E = cut(C, pol(C, 1, 130), A, B)
ok(L, "hsg1", bang(goc(B, D, E), 30) and bang(goc(A, E, D), 50) and bang(goc(B, E, D), 130), "∠BDE = 30°")
A, B, C = iso(100); s = 1 / d(A, B); A, B, C = A * s, B * s, C * s; D = cut(B, phan_giac(A, B, C), A, C)
ok(L, "hsg2", bang(d(B, C), d(B, D) + d(A, D)) and round(d(B, C), 2) == 1.53 and round(d(B, D), 2) == 1.14 and round(d(A, D), 2) == 0.39, "BC = BD + AD")
A, B, C = iso(20); Dd = rot(C, B, 60); M = cut(B, phan_giac(A, B, Dd), A, C)
ok(L, "hsg3", bang(d(A, M), d(B, C)) and bang(goc(B, M, C), 30) and bang(goc(A, B, M), 10), "AM = BC", "∠BMC = 30°")
for _ in range(5):
    A, B, C = P(0, 0), P(6, 0), P(0, 6); t = random.uniform(0.3, 5.7); D = P(t, 0); K = P(0, 6 + (6 - t)); I = cut(D, K, B, C); Pp = P(6, 6)
    ok(L, "hsg4", bang(d(I, D), d(I, K)) and bang(d(Pp, D), d(Pp, K)), "I là trung điểm của DK")
for _ in range(5):
    A, B, O = P(0, 0), P(8, 0), P(4, 0); c = random.uniform(0.5, 7); Cc = P(0, c); D = P(8, 16 / c)   # ∠COD = 90° ⇔ (−4)·4 + c·y = 0
    H = foot(O, Cc, D)
    ok(L, "hsg5", bang(goc(Cc, O, D), 90) and bang(d(Cc, D), c + 16 / c) and bang(goc(O, D, B), goc(O, D, Cc)) and bang(d(O, H), 4) and bang(goc(A, H, B), 90), "CD = AC + BD", "∠AHB = 90°")
# Bài tự luyện
ok(L, "tlNB-0", bang(180 - 2 * 65, 50), "∠C = 65°", "∠A = 50°")
ok(L, "tlNB-1", True, "HI = 4 cm", "IK = 5 cm", "∠P = 35°")
A, B, C = iso(50); M = (B + C) / 2
ok(L, "tlTH-0", bang(goc(B, A, M), 25) and bang(goc(A, M, B), 90), "∠BAM = 25°", "∠AMB = 90°")
A, B = P(-3, 0), P(3, 0); M = P(0, math.sqrt(36 - 9))
ok(L, "tlTH-1", bang(d(M, A), 6) and bang(d(M, B), 6) and bang(goc(M, A, B), 60), "Tam giác MAB đều", "∠MAB = 60°")
A, B, C = iso(30); D = cut(B, pol(B, 1, 30), A, C)   # BD = BC: ∠BDC = ∠C = 75°, nên ∠DBC = 30°
ok(L, "tlVD-0", bang(d(B, D), d(B, C)) and bang(goc(A, B, D), 45), "∠ABD = 45°")
A, B, C = P(0, 0), P(0, 10), P(10 * math.sqrt(3), 0); M = cut(A, pol(A, 1, 90 - 60), B, C)
ok(L, "tlVD-1", bang(goc(A, C, B), 30) and bang(d(M, B), d(M, C)) and bang(d(M, A), d(M, B)), "M là trung điểm của BC")
A, B, C = iso(120); N = (A + B) / 2; D = cut(N, N + (B - A) * 1j, B, C)
ok(L, "tlVD-2", bang(goc(D, A, C), 90) and bang(d(D, A), d(D, B)), "∠DAC = 90°")

# ================= Bài tập cuối chương IV =================
K4 = "bai-tap-cuoi-chuong-4-toan-7"
A, B, C = tri(72, 60)
ok(K4, "nb1", bang(goc(B, A, C), 48), "∠C = 60°", "Tam giác nhọn", "∠ACD = 120°")
ok(K4, "nb2", 4 + 6 + 5 == 15, "DE = 4 cm", "EF = 6 cm", "AC = 5 cm", "15 cm")
ok(K4, "nb3", bang(180 - 140, 40), "AC = 7 cm", "∠C = 70°", "∠A = 40°")
for _ in range(5):
    t = random.uniform(30, 150); O = P(0, 0); M = pol(O, random.uniform(3, 8), t / 2); A = foot(M, O, P(1, 0)); Bb = foot(M, O, pol(O, 1, t))
    ok(K4, "th1", bang(d(M, A), d(M, Bb)) and bang(d(O, A), d(O, Bb)) and vuong(O, M, A, Bb) and abs(cut(O, M, A, Bb) - (A + Bb) / 2) < 1e-6, "OM là đường trung trực của AB")
for _ in range(5):
    A, Bb = P(0, 0), P(10, 0); Cc = P(random.uniform(1, 9), random.uniform(1, 6)); D = Cc.conjugate()
    ok(K4, "th2", bang(goc(Cc, A, Bb), goc(D, A, Bb)) and vuong(A, Bb, Cc, D), "AB là tia phân giác của góc CAD")
A, B, C = tri(40, 40); D = cut(A, phan_giac(B, A, C), B, C)
ok(K4, "th3", bang(goc(B, A, C), 100) and bang(goc(A, D, B), 90) and bang(d(A, B), d(A, C)), "∠BAC = 100°", "∠BAD = 50°", "∠ADB = ∠ADC = 90°")
A, B, C = tri(80, 40); D = cut(A, phan_giac(B, A, C), B, C); E = A + (C - A) * d(A, B) / d(A, C)
ok(K4, "vd1", bang(d(D, B), d(D, E)) and bang(goc(E, D, C), 40), "∠EDC = 40°")
for _ in range(5):
    A = P(0, 0); B = pol(A, 6, random.uniform(95, 175)); C = rot(B, A, -90)   # ∠BAC = 90°, AB = AC; d là trục hoành
    if B.imag <= 0 or C.imag <= 0: continue
    H, K = P(B.real, 0), P(C.real, 0)
    ok(K4, "vd2", bang(d(H, K), d(B, H) + d(C, K)) and bang(goc(H, A, B), goc(K, C, A)), "HK = BH + CK")
    # bước 4: d cắt đoạn BC thì HK = |BH − CK|
    phi = random.uniform(10, 80); A2 = P(0, 0); B2 = pol(A2, 6, phi); C2 = rot(B2, A2, 90)
    if C2.imag < 0:
        H2, K2 = P(B2.real, 0), P(C2.real, 0)
        if not bang(d(H2, K2), abs(abs(B2.imag) - abs(C2.imag))): loi.append("vd2 bước 4: HK không bằng hiệu")
A, B, C = iso(36); D = cut(B, phan_giac(A, B, C), A, C)
ok(K4, "vd3", bang(goc(A, B, D), 36) and bang(goc(B, D, C), 72) and bang(d(A, D), d(B, D)) and bang(d(B, D), d(B, C)), "∠ABD = ∠DBC = 36°", "∠BDC = 72°", "AD = BC")
for _ in range(5):
    B, C = P(0, 0), P(10, 0); A = P(random.uniform(1, 9), random.uniform(2, 7)); M = (B + C) / 2; E = 2 * M - A; H, K = P(A.real, 0), P(E.real, 0)
    ok(K4, "vd4", bang(d(A, H), d(E, K)) and bang(d(M, H), d(M, K)) and song_song(A, B, C, E), "M là trung điểm của HK")
A, B, C = iso(40); N = (A + B) / 2; D = cut(N, N + (B - A) * 1j, A, C)
ok(K4, "vd5", bang(goc(A, B, D), 40) and bang(goc(D, B, C), 30) and bang(d(B, D) + d(D, C) + d(B, C), d(A, B) + d(B, C)), "∠ABD = 40°", "∠DBC = 30°")
def be_cd(b, c):
    A, B, C = tri(b, c); D = cut(B, phan_giac(A, B, C), A, C); E = cut(C, phan_giac(A, C, B), A, B)
    return d(B, E) + d(C, D) - d(B, C)
good = all(abs(be_cd(b, 120 - b)) < 1e-6 for b in [30, 50, 66, 80, 95]) and all(abs(be_cd(b, c)) > 1e-3 for b, c in [(50, 40), (70, 60), (40, 30)])
ok(K4, "hsg1", good, "∠BAC = 60°")
for _ in range(5):
    while True:
        B, C = P(0, 0), P(7, 0); A = P(random.uniform(1, 6), random.uniform(2, 6))
        if goc(B, A, C) < 89 and goc(A, B, C) < 89 and goc(A, C, B) < 89: break
    M = rot(B, A, -90); N = rot(C, A, 90)
    if (M.imag - A.imag) * 0 + 0: pass
    H = foot(A, B, C); Pp = foot(M, A, H); Q = foot(N, A, H); I = cut(M, N, A, H)
    # M khác phía C đối với AB, N khác phía B đối với AC
    s1 = ((B - A) * (M - A).conjugate()).imag * ((B - A) * (C - A).conjugate()).imag < 0
    s2 = ((C - A) * (N - A).conjugate()).imag * ((C - A) * (B - A).conjugate()).imag < 0
    ok(K4, "hsg2", s1 and s2 and bang(d(M, Pp), d(A, H)) and bang(d(N, Q), d(A, H)) and bang(d(I, M), d(I, N)) and bang(d(B, C), 2 * d(A, I)), "BC = 2 · AI")
for _ in range(12):
    A, Bb = P(0, 0), P(10, 0); M = P(random.choice([random.uniform(1, 9), 5, 4.99, 5.01]), 0); Cc = rot(M, A, 60); D = rot(Bb, M, 60)
    I = (A + D) / 2; K = (Bb + Cc) / 2
    ok(K4, "hsg3", bang(d(A, D), d(Cc, Bb)) and bang(d(M, I), d(M, K)) and bang(goc(I, M, K), 60)
       and (bang(goc(I, M, Cc) + goc(Cc, M, K), goc(I, M, K)) and bang(goc(A, M, I) + goc(I, M, Cc), goc(A, M, Cc)) if M.real >= 5 else   # MA ≥ MB
            bang(goc(Cc, M, K) - goc(Cc, M, I), goc(I, M, K)) and bang(goc(A, M, I) - goc(I, M, Cc), goc(A, M, Cc))), "ΔMIK đều")
A, B, C = iso(100); M = cut(B, pol(B, 1, 10), C, pol(C, 1, 160))
ok(K4, "hsg4", bang(goc(A, M, B), 70) and bang(goc(M, A, C), 20) and bang(goc(A, M, C), 140), "∠AMB = 70°")
for _ in range(5):
    A = P(0, 0); B = P(random.uniform(3, 9), 0); C = P(0, random.uniform(2, 8)); H = foot(A, B, C); M = (B + C) / 2; D = 2 * M - A
    I = C + (C - D) / d(C, D) * d(C, A); E = cut(I, I + C - A, A, H)
    ok(K4, "hsg5", song_song(C, D, A, B) and vuong(C, D, A, C) and bang(d(A, E), d(B, C)), "AE = BC")
ok(K4, "tlNB-0", bang(90 - 35, 55) and bang(180 - 35, 145), "∠C = 55°", "∠ABD = 145°")
ok(K4, "tlNB-1", bang(180 - 50 - 60, 70), "∠R = 70°")
ok(K4, "tlTH-0", True, "MA = MB")
A, B, C = iso(50); H = foot(B, A, C)
ok(K4, "tlTH-1", bang(goc(H, B, C), 25), "∠HBC = 25°")
A, B, C = iso(90); M = (B + C) / 2
ok(K4, "tlVD-0", bang(goc(A, M, B), 90) and bang(goc(M, A, B), 45), "vuông cân tại M")
A, B, C = iso(80); k = random.uniform(.2, .8); D = A + (B - A) * k; E = A + (C - A) * k
ok(K4, "tlVD-1", bang(goc(A, D, E), 50) and song_song(D, E, B, C), "∠ADE = 50°", "DE // BC")
A, B, C = tri(70, 50); N = (A + C) / 2; D = cut(N, N + (C - A) * 1j, B, C)
ok(K4, "tlVD-2", bang(goc(B, A, D), 10) and 0 < D.real < 10, "∠BAD = 10°")

# ---------- Các điều dùng trong phần "Giải theo 4 bước" (điểm kẻ thêm, bước 4) ----------
def phu(ten, dung):
    global dem
    dem += 1
    if not dung: loi.append("4 bước: " + ten)
A, B, C = iso(20); D = cut(B, pol(B, 1, 60), A, C); E = cut(C, pol(C, 1, 130), A, B); F = cut(B, pol(B, 1, 20), A, C)
phu("LC hsg1: FB = FE = FD = BC = BE, ∠EFD = 40°", all(bang(x, d(F, B)) for x in [d(F, E), d(F, D), d(B, C), d(B, E)]) and bang(goc(E, F, D), 40))
A, B, C = iso(100); D = cut(B, phan_giac(A, B, C), A, C); E = B + (C - B) * d(B, D) / d(B, C); F = B + (C - B) * d(B, A) / d(B, C)
phu("LC hsg2: DA = DF = DE = EC, F nằm giữa B và E", all(bang(x, d(D, A)) for x in [d(D, F), d(D, E), d(E, C)]) and d(B, F) < d(B, E))
A, B, C = iso(20); Dd = rot(C, B, 60)
phu("LC hsg3: ∠BAD = 10°", bang(goc(B, A, Dd), 10))
A, B, C, Pp = P(0, 0), P(6, 0), P(0, 6), P(6, 6); D = P(0.1, 0); K = P(0, 6 + 5.9); O = (B + C) / 2
phu("LC hsg4: D gần A thì OD < OK; ∠ICK = 135°", d(O, D) < d(O, K) - 1 and bang(goc(B, C, K), 135))
A, B, C = iso(36); D = cut(B, phan_giac(A, B, C), A, C); E = cut(C, phan_giac(B, C, D), B, D)
phu("CC vd3 bước 4: EB = EC = CD", bang(d(E, B), d(E, C)) and bang(d(E, C), d(C, D)))
A, B, C = iso(100); M = cut(B, pol(B, 1, 10), C, pol(C, 1, 160)); D = C + (A - C) * d(C, B) / d(C, A)
phu("CC hsg4: MB = MD = BD, ∠ABD = 30°, A nằm giữa C và D", bang(d(M, B), d(M, D)) and bang(d(B, D), d(B, M)) and bang(goc(A, B, D), 30) and d(C, D) > d(C, A))
A = P(0, 0); B = P(6, 0); C = P(0, 4); D = P(6, 4); I = P(-4, 4); H = foot(A, B, C); E = cut(I, I + C - A, A, H); K = P(-4, 0)
phu("CC hsg5: AK = CA, ∠KAE = ∠ACB, ACIK là hình vuông", bang(d(A, K), d(C, A)) and bang(goc(K, A, E), goc(A, C, B)) and bang(d(C, I), d(C, A)))

# Mọi câu (kể cả bài tự luyện) phải được xét ít nhất một lần
for b in DIRS:
    for k in DAP[b]:
        if (b, k) not in daxet: loi.append(f"{b} {k}: chưa được kiểm tra")
print(f"Đã kiểm tra {dem} lần, {len(daxet)} câu.")
if loi:
    print("LỖI:"); [print(" -", x) for x in loi]; raise SystemExit(1)
print("Tất cả đáp số khớp.")
