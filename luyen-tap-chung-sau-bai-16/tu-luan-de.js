/* Bài tập tự luận – Luyện tập chung (sau Bài 16) (Toán 7, Kết nối tri thức).
   Học sinh làm ra giấy, xem gợi ý và lời giải từng bước rồi tự đánh dấu. Không tính vào điều kiện qua bài.
   Mỗi bài: id, lv (NB, TH, VD, HSG), de (đề), goi (gợi ý), steps (các bước lời giải), dap (đáp số hoặc kết luận),
   loi (lỗi hay gặp, tùy chọn), mix (số các bài trước được dùng, tùy chọn), fig (hàm vẽ hình, gọi khi hiện lời giải).
   Hình vẽ dùng các hàm vẽ của trang bài (SEG, ticks, rmark, arcs, svg...), chỉ gọi lúc hiện nên tệp này nạp trước trang vẫn được. */
(function () {
  "use strict";
  /* ---- Vẽ hình: tọa độ toán học (trục y hướng lên), tự co vào khung ---- */
  var rad = function (d) { return d * Math.PI / 180; };
  var pol = function (o, r, d) { return [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))]; };
  var add = function (p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; };
  function foot(p, a, b) {   // chân đường vuông góc từ p xuống đường thẳng ab
    var dx = b[0] - a[0], dy = b[1] - a[1], t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
    return [a[0] + dx * t, a[1] + dy * t];
  }
  function cut(p1, p2, p3, p4) {   // giao điểm hai đường thẳng p1p2 và p3p4
    var d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
    var a = p1[0] * p2[1] - p1[1] * p2[0], b = p3[0] * p4[1] - p3[1] * p4[0];
    return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
  }
  /* pos: {tên điểm: n|s|e|w|ne|nw|se|sw} đặt nhãn theo hướng; nếu không có thì đặt ra xa tâm c.
     o: {P:{tên:[x,y]}, seg:["AB",...], thin:["AH"], tk:[["AB",1],...], rt:[["H","A","C"]], arc:[["B","A","C",1]],
         ang:[["A","B","C","40°"]], side:[["A","B","5 cm"]], c:"tên điểm làm tâm để đặt nhãn", alt, w} */
  function draw(o) {
    var W = o.w || 280, pad = 26, ks = Object.keys(o.P), xs = ks.map(function (k) { return o.P[k][0]; }), ys = ks.map(function (k) { return o.P[k][1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var sc = Math.min((W - 2 * pad) / ((x1 - x0) || 1), 190 / ((y1 - y0) || 1)), H = Math.round((y1 - y0) * sc + 2 * pad);
    var Q = {};
    ks.forEach(function (k) { Q[k] = [pad + (o.P[k][0] - x0) * sc, H - pad - (o.P[k][1] - y0) * sc]; });
    var g = function (n) { return Q[n]; }, s = "";
    var C = o.c ? (o.c.length > 1 ? cen(o.c.split("").map(g)) : g(o.c)) : cen(ks.map(g));
    (o.fill || []).forEach(function (t) { s += '<polygon class="tri" points="' + t.split("").map(function (n) { return g(n).map(f1).join(","); }).join(" ") + '"/>'; });
    (o.seg || []).forEach(function (e) { s += SEG(g(e[0]), g(e[1])); });
    (o.thin || []).forEach(function (e) { s += SEG(g(e[0]), g(e[1]), "thin"); });
    (o.tk || []).forEach(function (e) { s += ticks(g(e[0][0]), g(e[0][1]), e[1]); });
    (o.rt || []).forEach(function (e) { s += rmark(g(e[0]), g(e[1]), g(e[2])); });
    (o.arc || []).forEach(function (e) { s += arcs(g(e[0]), g(e[1]), g(e[2]), e[3] || 1); });
    (o.ang || []).forEach(function (e) { s += angT(g(e[0]), g(e[1]), g(e[2]), e[3], e[4] || 38); });
    (o.side || []).forEach(function (e) { s += sideT(g(e[0]), g(e[1]), C, e[2]); });
    var DIR = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0], ne: [.75, -.75], nw: [-.75, -.75], se: [.75, .75], sw: [-.75, .75] };
    ks.forEach(function (k) {
      if (k.charAt(0) === "_") return;
      var q = g(k), v = o.pos && DIR[o.pos[k]];
      s += (k !== k.toLowerCase() ? DOT(q) : '') + (v ? TX(q[0] + v[0] * 15, q[1] + v[1] * 15 + 5, k) : lab(q, (o.lc && o.lc[k]) ? g(o.lc[k]) : C, k));
    });
    return fb(svg(W, H, o.alt || "Hình vẽ", s));
  }
  /* tam giác cân tại đỉnh a, góc ở đỉnh d độ, cạnh bên r; trả về [đỉnh, trái, phải] */
  function iso(d, r) { r = r || 10; var A = [0, 0]; return [A, pol(A, r, 270 - d / 2), pol(A, r, 270 + d / 2)]; }
  /* hình hay dùng */
  function eqT() { var A = [0, 0]; return [A, pol(A, 10, 240), pol(A, 10, 300)]; }       // tam giác đều, đỉnh A ở trên
  function bisDir(B, A, C) { var a1 = Math.atan2(A[1] - B[1], A[0] - B[0]), a2 = Math.atan2(C[1] - B[1], C[0] - B[0]); return [B[0] + Math.cos((a1 + a2) / 2), B[1] + Math.sin((a1 + a2) / 2)]; }

  var ITEMS = [
    /* ================= NHẬN BIẾT ================= */
    {
      id: "nb1", lv: "NB",
      de: "Cho tam giác ABC có ∠A = 70°, ∠B = 55°.<br>a) Tính số đo ∠C.<br>b) Tam giác ABC là tam giác gì? Vì sao?",
      goi: "Tổng ba góc của một tam giác bằng 180°. Tam giác có hai góc bằng nhau là tam giác cân.",
      fig: function () { var p = iso(70); return draw({ P: { A: p[0], B: p[1], C: p[2] }, fill: ["ABC"], ang: [["A", "B", "C", "70°", 40], ["B", "A", "C", "55°", 40]], alt: "Tam giác ABC có góc A bằng 70 độ, góc B bằng 55 độ" }); },
      steps: [
        "a) Trong tam giác ABC: ∠A + ∠B + ∠C = 180°, nên ∠C = 180° − (70° + 55°) = 55°.",
        "b) Tam giác ABC có ∠B = ∠C (= 55°) nên là tam giác cân tại A."
      ],
      dap: "a) ∠C = 55°. b) Tam giác ABC cân tại A.",
      loi: "Kết luận cân tại B hoặc tại C. Đỉnh của tam giác cân là đỉnh không thuộc hai góc bằng nhau.",
      mix: [12]
    },
    {
      id: "nb2", lv: "NB",
      de: "Cho ΔABC = ΔMNP, biết ∠A = 75°, ∠N = 60° và AB = 5 cm.<br>a) Tính số đo các góc ∠M, ∠B, ∠C và ∠P.<br>b) Tính độ dài cạnh MN.",
      goi: "Viết các cặp đỉnh tương ứng theo thứ tự: A ↔ M, B ↔ N, C ↔ P.",
      fig: function () { var A = [1.6, 3], B = [0, 0], C = [4.6, 0], M = [8.6, 3], N = [7, 0], P = [11.6, 0]; return draw({ P: { A: A, B: B, C: C, M: M, N: N, P: P }, fill: ["ABC", "MNP"], tk: [["AB", 1], ["MN", 1]], arc: [["A", "B", "C", 1], ["M", "N", "P", 1], ["B", "A", "C", 2], ["N", "M", "P", 2]], pos: { A: "n", B: "sw", C: "se", M: "n", N: "sw", P: "se" }, w: 320, alt: "Hai tam giác bằng nhau ABC và MNP" }); },
      steps: [
        "a) ΔABC = ΔMNP nên A ↔ M, B ↔ N, C ↔ P. Do đó ∠M = ∠A = 75° và ∠B = ∠N = 60°.",
        "Trong tam giác ABC: ∠C = 180° − (75° + 60°) = 45°, nên ∠P = ∠C = 45°.",
        "b) Cạnh MN tương ứng với cạnh AB nên MN = AB = 5 cm."
      ],
      dap: "a) ∠M = 75°, ∠B = 60°, ∠C = ∠P = 45°. b) MN = 5 cm.",
      loi: "Ghép sai cặp đỉnh tương ứng (ví dụ cho ∠B = ∠M).",
      mix: [12, 13]
    },
    {
      id: "nb3", lv: "NB",
      de: "Cho ΔABC vuông tại A và ΔDEF vuông tại D có BC = EF, AC = DF.<br>a) Hai tam giác ABC và DEF có bằng nhau không? Vì sao?<br>b) Biết ∠B = 50°, tính số đo ∠E và ∠F.",
      goi: "BC và EF là cạnh huyền; AC và DF là cạnh góc vuông.",
      fig: function () { var A = [0, 3], B = [0, 0], C = [4, 3], D = [7, 3], E = [7, 0], F = [11, 3]; return draw({ P: { A: A, B: B, C: C, D: D, E: E, F: F }, fill: ["ABC", "DEF"], tk: [["BC", 1], ["EF", 1], ["AC", 2], ["DF", 2]], rt: [["A", "B", "C"], ["D", "E", "F"]], pos: { A: "nw", B: "sw", C: "ne", D: "nw", E: "sw", F: "ne" }, w: 320, alt: "Hai tam giác vuông ABC vuông tại A và DEF vuông tại D" }); },
      steps: [
        "a) Xét hai tam giác vuông ABC (vuông tại A) và DEF (vuông tại D) có: BC = EF (cạnh huyền); AC = DF (cạnh góc vuông).",
        "Do đó ΔABC = ΔDEF (cạnh huyền – cạnh góc vuông).",
        "b) Từ câu a: ∠E = ∠B = 50° (hai góc tương ứng).",
        "Tam giác DEF vuông tại D nên ∠F = 90° − ∠E = 90° − 50° = 40°."
      ],
      dap: "a) Có, ΔABC = ΔDEF (cạnh huyền – cạnh góc vuông). b) ∠E = 50°, ∠F = 40°.",
      loi: "Gọi nhầm là trường hợp hai cạnh góc vuông (BC, EF là cạnh huyền).",
      mix: [12, 15]
    },

    /* ================= THÔNG HIỂU ================= */
    {
      id: "th1", lv: "TH",
      de: "Cho đoạn thẳng AB. Đường trung trực d của AB cắt AB tại O. Lấy điểm M thuộc d (M khác O).<br>a) Chứng minh ΔMOA = ΔMOB.<br>b) Chứng minh MO là tia phân giác của góc AMB.<br>c) Biết AB = 8 cm, MA = 5 cm. Tính chu vi tam giác MAB.",
      goi: "d vuông góc với AB tại trung điểm O. Hai tam giác vuông MOA và MOB có chung cạnh MO.",
      fig: function () { return fb(figPB({ lab: ["A", "B", "O", "M"], alt: "Đường trung trực d của đoạn thẳng AB cắt AB tại O, M thuộc d" })); },
      steps: [
        "a) d là đường trung trực của AB nên d ⊥ AB tại O và OA = OB.",
        "Xét hai tam giác vuông MOA và MOB (vuông tại O) có: OA = OB; MO là cạnh chung. Do đó ΔMOA = ΔMOB (hai cạnh góc vuông).",
        "b) Từ câu a: ∠AMO = ∠BMO (hai góc tương ứng). Tia MO nằm giữa hai tia MA, MB nên MO là tia phân giác của góc AMB.",
        "c) M nằm trên đường trung trực của AB nên MB = MA = 5 cm. Chu vi tam giác MAB là 5 + 5 + 8 = 18 (cm)."
      ],
      dap: "c) Chu vi tam giác MAB bằng 18 cm.",
      loi: "Ở câu a dùng trường hợp c.c.c mà chưa chứng minh MA = MB; ở câu c quên cạnh AB.",
      mix: [15]
    },
    {
      id: "th2", lv: "TH",
      de: "Cho ΔABC = ΔDEF, biết ∠A = 40°, ∠E = 70° và AB = 6 cm.<br>a) Tính số đo ∠F.<br>b) Chứng minh tam giác ABC cân.<br>c) Tính độ dài cạnh DF.",
      goi: "Từ ΔABC = ΔDEF suy ra ∠B = ∠E. Tính ∠C rồi so sánh với ∠B.",
      fig: function () { var p = iso(40); return draw({ P: { A: p[0], B: p[1], C: p[2] }, fill: ["ABC"], ang: [["A", "B", "C", "40°", 44]], side: [["A", "B", "6 cm"]], alt: "Tam giác ABC có góc A bằng 40 độ, AB bằng 6 cm" }); },
      steps: [
        "a) ΔABC = ΔDEF nên ∠D = ∠A = 40°. Trong tam giác DEF: ∠F = 180° − (40° + 70°) = 70°.",
        "b) ∠B = ∠E = 70° và ∠C = ∠F = 70°. Tam giác ABC có ∠B = ∠C nên cân tại A.",
        "c) Tam giác ABC cân tại A nên AC = AB = 6 cm. Cạnh DF tương ứng với cạnh AC nên DF = AC = 6 cm."
      ],
      dap: "a) ∠F = 70°. b) Tam giác ABC cân tại A. c) DF = 6 cm.",
      loi: "Ghép DF với AB (sai cặp tương ứng); thực ra DF = AC, và AC = AB vì tam giác cân.",
      mix: [12, 13]
    },
    {
      id: "th3", lv: "TH",
      de: "Hai đoạn thẳng AB và CD cắt nhau tại O, O là trung điểm của mỗi đoạn thẳng.<br>a) Chứng minh AC = BD.<br>b) Chứng minh AC // BD.<br>c) Chứng minh ΔACD = ΔBDC.",
      goi: "Hai tam giác OAC và OBD có hai góc đối đỉnh. Muốn chứng minh hai đường thẳng song song, tìm hai góc so le trong bằng nhau.",
      fig: function () { var O = [0, 0], A = pol(O, 5, 200), B = pol(O, 5, 20), C = pol(O, 3.6, 120), D = pol(O, 3.6, 300); return draw({ P: { A: A, B: B, C: C, D: D, O: O }, seg: ["AB", "CD", "AC", "BD", "AD", "BC"], tk: [["AO", 1], ["OB", 1], ["CO", 2], ["OD", 2]], pos: { A: "w", B: "e", C: "n", D: "s", O: "e" }, alt: "Hai đoạn thẳng AB và CD cắt nhau tại trung điểm O của mỗi đoạn" }); },
      steps: [
        "a) Xét ΔOAC và ΔOBD có: OA = OB; ∠AOC = ∠BOD (hai góc đối đỉnh); OC = OD. Do đó ΔOAC = ΔOBD (c.g.c), suy ra AC = BD.",
        "b) Từ câu a: ∠OAC = ∠OBD (hai góc tương ứng). Hai góc này ở vị trí so le trong (đối với hai đường thẳng AC, BD và cát tuyến AB), nên AC // BD.",
        "c) Tương tự câu a: ΔOAD = ΔOBC (c.g.c) nên AD = BC.",
        "Xét ΔACD và ΔBDC có: AC = BD (câu a); AD = BC; CD là cạnh chung. Do đó ΔACD = ΔBDC (c.c.c)."
      ],
      dap: "AC = BD, AC // BD và ΔACD = ΔBDC (c.c.c).",
      loi: "Ở câu c dùng ngay AD = BC mà chưa chứng minh; hoặc viết sai thứ tự đỉnh (ΔACD = ΔBCD).",
      mix: [10, 13, 14]
    },

    /* ================= VẬN DỤNG ================= */
    {
      id: "vd1", lv: "VD",
      de: "Cho góc xOy khác góc bẹt. Trên tia Ox lấy hai điểm A, C; trên tia Oy lấy hai điểm B, D sao cho OA = OB, OC = OD (OA < OC). Gọi I là giao điểm của AD và BC. Chứng minh:<br>a) AD = BC;<br>b) ΔIAC = ΔIBD;<br>c) OI là tia phân giác của góc xOy.",
      goi: "Câu b: dùng AC = BD và các góc kề bù với hai góc bằng nhau. Câu c: so sánh ΔOAI và ΔOBI.",
      fig: function () { var O = [0, 0], A = [5, 0], C = [10, 0], B = pol(O, 5, 55), D = pol(O, 10, 55), I = cut(A, D, B, C); return draw({ P: { O: O, A: A, C: C, B: B, D: D, I: I, x: [12.5, 0], y: pol(O, 12.5, 55) }, seg: ["Ox", "Oy", "AD", "BC", "OI"], tk: [["OA", 1], ["OB", 1], ["AC", 2], ["BD", 2]], pos: { O: "w", A: "s", C: "s", B: "nw", D: "nw", I: "e", x: "s", y: "w" }, alt: "Góc xOy, A và C trên Ox, B và D trên Oy, AD cắt BC tại I" }); },
      steps: [
        "a) Xét ΔOAD và ΔOBC có: OA = OB; ∠O là góc chung; OD = OC. Do đó ΔOAD = ΔOBC (c.g.c), suy ra AD = BC.",
        "b) Từ câu a: ∠OAD = ∠OBC và ∠ODA = ∠OCB (các góc tương ứng). Suy ra ∠IAC = ∠IBD (kề bù với hai góc bằng nhau ∠OAD, ∠OBC).",
        "AC = OC − OA = OD − OB = BD.",
        "Xét ΔIAC và ΔIBD có: ∠IAC = ∠IBD; AC = BD; ∠ICA = ∠IDB (vì ∠OCB = ∠ODA). Do đó ΔIAC = ΔIBD (g.c.g).",
        "c) Từ câu b: IA = IB. Xét ΔOAI và ΔOBI có: OA = OB; IA = IB; OI là cạnh chung. Do đó ΔOAI = ΔOBI (c.c.c), suy ra ∠AOI = ∠BOI.",
        "Tia OI nằm giữa hai tia Ox, Oy nên OI là tia phân giác của góc xOy."
      ],
      dap: "AD = BC; ΔIAC = ΔIBD (g.c.g); OI là tia phân giác của góc xOy.",
      loi: "Ở câu b dùng ngay IA = IB hoặc IC = ID để chứng minh hai tam giác bằng nhau (vòng quanh).",
      mix: [13, 14]
    },
    {
      id: "vd2", lv: "VD",
      de: "Cho tam giác đều ABC. Trên cạnh AB lấy điểm D, trên cạnh AC lấy điểm E sao cho AD = CE. Gọi I là giao điểm của BE và CD.<br>a) Chứng minh ΔACD = ΔCBE.<br>b) Tính số đo góc BIC.",
      goi: "Tam giác đều có ba cạnh bằng nhau và mỗi góc bằng 60°. Từ câu a suy ra ∠ACD = ∠CBE.",
      fig: function () { var p = eqT(), A = p[0], B = p[1], C = p[2], D = add(A, B, 0.35), E = add(C, A, 0.35), I = cut(B, E, C, D); return draw({ P: { A: A, B: B, C: C, D: D, E: E, I: I }, fill: ["ABC"], seg: ["BE", "CD"], tk: [["AD", 1], ["CE", 1]], pos: { A: "n", B: "sw", C: "se", D: "w", E: "e", I: "s" }, alt: "Tam giác đều ABC, D trên AB, E trên AC với AD bằng CE, BE cắt CD tại I" }); },
      steps: [
        "a) Xét ΔACD và ΔCBE có: AC = CB (tam giác ABC đều); ∠CAD = ∠BCE (= 60°); AD = CE (giả thiết). Do đó ΔACD = ΔCBE (c.g.c).",
        "b) Từ câu a: ∠ACD = ∠CBE (hai góc tương ứng).",
        "Trong tam giác IBC: ∠IBC + ∠ICB = ∠CBE + ∠ICB = ∠ACD + ∠DCB = ∠ACB = 60°.",
        "Do đó ∠BIC = 180° − 60° = 120°."
      ],
      dap: "b) ∠BIC = 120° (không phụ thuộc vị trí của D).",
      loi: "Ghép sai đỉnh tương ứng (ΔACD = ΔBCE), hoặc cho ∠BIC = 60°.",
      mix: [12, 14]
    },
    {
      id: "vd3", lv: "VD",
      de: "Cho tam giác ABC, M là trung điểm của BC. Trên tia đối của tia MA lấy điểm E sao cho ME = MA.<br>a) Chứng minh AB = CE và AB // CE.<br>b) Giả sử AB = AC. Chứng minh AM ⊥ BC và tam giác ACE cân.",
      goi: "Hai tam giác MAB và MEC có hai góc đối đỉnh tại M.",
      fig: function () { var B = [0, 0], C = [8, 0], A = [2.6, 4.6], M = [4, 0], E = [5.4, -4.6]; return draw({ P: { A: A, B: B, C: C, M: M, E: E }, seg: ["AB", "AC", "BC", "AE", "CE"], tk: [["BM", 1], ["MC", 1], ["AM", 2], ["ME", 2]], pos: { A: "n", B: "w", C: "e", M: "ne", E: "s" }, alt: "Tam giác ABC, M là trung điểm BC, E trên tia đối của tia MA với ME bằng MA" }); },
      steps: [
        "a) Xét ΔMAB và ΔMEC có: MA = ME; ∠AMB = ∠EMC (hai góc đối đỉnh); MB = MC. Do đó ΔMAB = ΔMEC (c.g.c).",
        "Suy ra AB = EC và ∠MAB = ∠MEC. Hai góc này ở vị trí so le trong nên AB // CE.",
        "b) Xét ΔABM và ΔACM có: AB = AC; BM = CM; AM là cạnh chung. Do đó ΔABM = ΔACM (c.c.c), suy ra ∠AMB = ∠AMC.",
        "Mà ∠AMB + ∠AMC = 180° nên ∠AMB = 90°, tức là AM ⊥ BC.",
        "Lại có CE = AB (câu a) và AB = AC, nên CE = CA: tam giác ACE cân tại C."
      ],
      dap: "AB = CE, AB // CE; AM ⊥ BC; tam giác ACE cân tại C.",
      loi: "Kết luận tam giác ACE cân tại A; hoặc chứng minh AB // CE bằng hai góc đồng vị không đúng vị trí.",
      mix: [10, 14]
    },
    {
      id: "vd4", lv: "VD",
      de: "Cho tam giác ABC cân tại A. Kẻ BH ⊥ AC (H thuộc AC), CK ⊥ AB (K thuộc AB). BH cắt CK tại O.<br>a) Chứng minh BH = CK.<br>b) Chứng minh tam giác OBC cân.<br>c) Chứng minh AO là đường trung trực của đoạn thẳng BC.",
      goi: "Câu a: hai tam giác vuông BHC và CKB có chung cạnh huyền BC. Câu c: tìm hai điểm cùng cách đều B và C.",
      fig: function () { var p = iso(50), A = p[0], B = p[1], C = p[2], H = foot(B, A, C), K = foot(C, A, B), O = cut(B, H, C, K); return draw({ P: { A: A, B: B, C: C, H: H, K: K, O: O }, fill: ["ABC"], seg: ["BH", "CK", "AO"], tk: [["AB", 1], ["AC", 1]], rt: [["H", "A", "B"], ["K", "A", "C"]], pos: { A: "n", B: "sw", C: "se", H: "e", K: "w", O: "s" }, alt: "Tam giác ABC cân tại A, BH vuông góc AC, CK vuông góc AB, BH cắt CK tại O" }); },
      steps: [
        "a) Xét hai tam giác vuông BHC (vuông tại H) và CKB (vuông tại K) có: BC là cạnh huyền chung; ∠HCB = ∠KBC (hai góc ở đáy của tam giác cân ABC).",
        "Do đó ΔBHC = ΔCKB (cạnh huyền – góc nhọn), suy ra BH = CK.",
        "b) Cũng từ ΔBHC = ΔCKB: ∠HBC = ∠KCB, tức là ∠OBC = ∠OCB. Vậy tam giác OBC cân tại O.",
        "c) OB = OC nên O nằm trên đường trung trực của BC; AB = AC nên A cũng nằm trên đường trung trực của BC.",
        "Hai điểm A, O phân biệt cùng nằm trên đường trung trực của BC, nên AO là đường trung trực của đoạn thẳng BC."
      ],
      dap: "BH = CK; tam giác OBC cân tại O; AO là đường trung trực của BC.",
      loi: "Ở câu c chỉ nêu một điểm A (hoặc O) nằm trên đường trung trực, chưa đủ để kết luận cả đường thẳng AO.",
      mix: [15]
    },
    {
      id: "vd5", lv: "VD",
      de: "Cho tam giác ABC vuông tại A có ∠B = 60° và BC = 10 cm.<br>a) Trên tia đối của tia AB lấy điểm D sao cho AD = AB. Chứng minh tam giác BCD đều.<br>b) Tính độ dài AB.<br>c) Tia phân giác của góc B cắt AC tại E. Chứng minh E nằm trên đường trung trực của đoạn thẳng BC.",
      goi: "Câu a: chứng minh CB = CD rồi dùng ∠B = 60°. Câu c: tính ∠EBC và ∠C.",
      fig: function () { var A = [0, 0], B = [-5, 0], D = [5, 0], C = [0, 5 * Math.sqrt(3)], E = cut(B, bisDir(B, A, C), A, C); return draw({ P: { A: A, B: B, C: C, D: D, E: E }, fill: ["BCD"], seg: ["AC", "BE"], tk: [["BA", 1], ["AD", 1]], rt: [["A", "D", "C"]], ang: [["B", "D", "C", "60°", 30]], pos: { A: "s", B: "sw", C: "n", D: "se", E: "e" }, alt: "Tam giác ABC vuông tại A, góc B bằng 60 độ, D trên tia đối của tia AB với AD bằng AB, BE là tia phân giác của góc B" }); },
      steps: [
        "a) Xét hai tam giác vuông CAB và CAD có: AB = AD; CA là cạnh chung. Do đó ΔCAB = ΔCAD (hai cạnh góc vuông), suy ra CB = CD.",
        "Tam giác BCD cân tại C và có ∠B = 60° nên là tam giác đều.",
        "b) Tam giác BCD đều nên BD = BC = 10 cm. A là trung điểm của BD nên AB = 10 : 2 = 5 (cm).",
        "c) ∠ACB = 90° − 60° = 30°. BE là tia phân giác của góc B nên ∠EBC = 60° : 2 = 30°.",
        "Tam giác EBC có ∠EBC = ∠ECB (= 30°) nên cân tại E: EB = EC. Vậy E nằm trên đường trung trực của BC."
      ],
      dap: "a) Tam giác BCD đều. b) AB = 5 cm. c) EB = EC nên E thuộc đường trung trực của BC.",
      loi: "Ở câu a mới có CB = CD đã kết luận tam giác đều mà không nhắc đến góc 60°.",
      mix: [12, 15]
    },

    /* ================= DÀNH CHO HSG ================= */
    {
      id: "hsg1", lv: "HSG",
      de: "Cho tam giác ABC cân tại A có ∠A = 20°. Trên cạnh AC lấy điểm D sao cho ∠DBC = 60°, trên cạnh AB lấy điểm E sao cho ∠ECB = 50°. Tính số đo góc BDE.",
      goi: "Tam giác EBC có hai góc 50°. Kẻ thêm tia BF (F thuộc AC) sao cho ∠FBC = 20° rồi tìm các tam giác cân, tam giác đều.",
      fig: function () { var p = iso(20), A = p[0], B = p[1], C = p[2], D = cut(B, pol(B, 1, 60), A, C), E = cut(C, pol(C, 1, 130), A, B), F = cut(B, pol(B, 1, 20), A, C); return draw({ P: { A: A, B: B, C: C, D: D, E: E, F: F }, fill: ["ABC"], seg: ["BD", "CE", "DE"], thin: ["BF", "EF"], tk: [["AB", 1], ["AC", 1]], pos: { A: "n", B: "sw", C: "se", D: "e", E: "w", F: "e" }, w: 220, alt: "Tam giác ABC cân tại A, góc A 20 độ, D trên AC, E trên AB; kẻ thêm BF với góc FBC 20 độ" }); },
      steps: [
        "∠ABC = ∠ACB = (180° − 20°) : 2 = 80°. Trong ΔEBC: ∠BEC = 180° − 80° − 50° = 50° = ∠ECB, nên ΔEBC cân tại B: BE = BC.",
        "Kẻ tia BF (F thuộc AC) sao cho ∠FBC = 20°. Trong ΔFBC: ∠BFC = 180° − 20° − 80° = 80° = ∠BCF, nên ΔFBC cân tại B: BF = BC.",
        "Suy ra BE = BF. Tam giác BEF cân tại B có ∠EBF = 80° − 20° = 60° nên là tam giác đều: EF = BF, ∠BFE = 60°.",
        "Trong ΔBDC: ∠BDC = 180° − 60° − 80° = 40°. Lại có ∠FBD = 60° − 20° = 40°. Tam giác FBD có ∠FBD = ∠FDB = 40° nên cân tại F: FD = FB.",
        "Do đó FD = FE: tam giác FDE cân tại F. ∠BFD = 180° − ∠BFC = 100° (kề bù), nên ∠EFD = 100° − 60° = 40°.",
        "∠FDE = (180° − 40°) : 2 = 70°. Vậy ∠BDE = ∠FDE − ∠FDB = 70° − 40° = 30°."
      ],
      dap: "∠BDE = 30°.",
      loi: "Đo hình rồi đoán đáp số; hoặc cho ∠BDE = ∠DBC − ... mà không có lập luận. Mấu chốt là kẻ thêm BF để có tam giác đều BEF.",
      mix: [12, 16]
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Cho tam giác ABC cân tại A có ∠A = 100°. Tia phân giác của góc B cắt AC tại D. Chứng minh BC = BD + AD.",
      goi: "Trên cạnh BC lấy hai điểm E, F sao cho BE = BD và BF = BA. Chứng minh DA = DF = DE = EC.",
      fig: function () { var p = iso(100), A = p[0], B = p[1], C = p[2], D = cut(B, bisDir(B, A, C), A, C), bd = Math.hypot(D[0] - B[0], D[1] - B[1]), bc = Math.hypot(C[0] - B[0], C[1] - B[1]), E = add(B, C, bd / bc), F = add(B, C, 10 / bc); return draw({ P: { A: A, B: B, C: C, D: D, E: E, F: F }, fill: ["ABC"], seg: ["BD", "DE", "DF"], tk: [["AB", 1], ["AC", 1]], pos: { A: "n", B: "sw", C: "se", D: "ne", E: "s", F: "s" }, alt: "Tam giác ABC cân tại A, góc A 100 độ, BD là tia phân giác góc B; E, F trên BC với BE bằng BD, BF bằng BA" }); },
      steps: [
        "∠ABC = ∠C = (180° − 100°) : 2 = 40°, nên ∠ABD = ∠DBC = 20°.",
        "Trên cạnh BC lấy F sao cho BF = BA. Xét ΔABD và ΔFBD có: BA = BF; ∠ABD = ∠FBD; BD chung. Do đó ΔABD = ΔFBD (c.g.c), suy ra DF = DA và ∠BFD = ∠BAD = 100°, nên ∠DFE = 80° (kề bù).",
        "Trên cạnh BC lấy E sao cho BE = BD. Tam giác BDE cân tại B có ∠DBE = 20° nên ∠BED = (180° − 20°) : 2 = 80°.",
        "Tam giác DFE có ∠DFE = ∠DEF = 80° nên cân tại D: DE = DF = DA.",
        "∠DEC = 180° − 80° = 100°, nên ∠EDC = 180° − 100° − 40° = 40° = ∠C. Tam giác EDC cân tại E: EC = ED.",
        "Vậy BC = BE + EC = BD + ED = BD + AD."
      ],
      dap: "BC = BD + AD.",
      loi: "Chỉ lấy một điểm E trên BC rồi khẳng định DE = DA mà không chứng minh. Cần lấy cả hai điểm E, F.",
      mix: [12, 14]
    },
    {
      id: "hsg3", lv: "HSG",
      de: "Cho tam giác ABC cân tại A có ∠A = 20°. Vẽ tam giác đều BCD sao cho điểm D nằm trong tam giác ABC. Tia phân giác của góc ABD cắt AC tại M.<br>a) Chứng minh AM = BC.<br>b) Tính số đo góc BMC.",
      goi: "Nối AD. Chứng minh AD là tia phân giác của góc BAC, rồi so sánh ΔABM với ΔBAD.",
      fig: function () { var p = iso(20), A = p[0], B = p[1], C = p[2], bc = C[0] - B[0], D = [0, B[1] + bc * Math.sqrt(3) / 2], M = cut(B, pol(B, 1, 70), A, C); return draw({ P: { A: A, B: B, C: C, D: D, M: M }, fill: ["ABC"], seg: ["BD", "CD", "BM"], thin: ["AD"], tk: [["AB", 1], ["AC", 1]], pos: { A: "n", B: "sw", C: "se", D: "w", M: "e" }, w: 220, alt: "Tam giác ABC cân tại A, góc A 20 độ, tam giác đều BCD bên trong, BM là tia phân giác của góc ABD" }); },
      steps: [
        "∠ABC = ∠ACB = (180° − 20°) : 2 = 80°. ∠DBC = 60° nên ∠ABD = 80° − 60° = 20°. BM là tia phân giác góc ABD nên ∠ABM = 10°.",
        "Xét ΔABD và ΔACD có: AB = AC; BD = CD (tam giác BCD đều); AD chung. Do đó ΔABD = ΔACD (c.c.c), suy ra ∠BAD = ∠CAD = 20° : 2 = 10°.",
        "Xét ΔBAM và ΔABD có: ∠BAM = ∠ABD (= 20°); AB là cạnh chung; ∠ABM = ∠BAD (= 10°). Do đó ΔBAM = ΔABD (g.c.g).",
        "Suy ra AM = BD = BC.",
        "b) Trong ΔABM: ∠AMB = 180° − 20° − 10° = 150°, nên ∠BMC = 180° − 150° = 30°."
      ],
      dap: "a) AM = BC. b) ∠BMC = 30°.",
      loi: "Viết sai thứ tự đỉnh tương ứng khi so sánh ΔBAM và ΔABD (đỉnh A ứng với B, B ứng với A).",
      mix: [12, 13, 14]
    },
    {
      id: "hsg4", lv: "HSG",
      de: "Cho tam giác ABC vuông cân tại A. Lấy điểm D trên cạnh AB (D khác A và B). Trên tia đối của tia CA lấy điểm K sao cho CK = BD. Đoạn thẳng DK cắt BC tại I.<br>a) Chứng minh I là trung điểm của DK.<br>b) Chứng minh rằng khi D thay đổi trên cạnh AB, đường trung trực của DK luôn đi qua một điểm cố định.",
      goi: "Câu a: kẻ DF // AC (F thuộc BC). Câu b: gọi P là giao điểm của đường thẳng vuông góc với AB tại B và đường thẳng vuông góc với AC tại C; chứng minh PD = PK.",
      fig: function () { var A = [0, 0], B = [6, 0], C = [0, 6], D = [2.2, 0], K = [0, 6 + 3.8], I = cut(D, K, B, C), F = [2.2, 3.8], P = [6, 6]; return draw({ P: { A: A, B: B, C: C, D: D, K: K, I: I, F: F, P: P }, fill: ["ABC"], seg: ["CK", "DK"], thin: ["DF", "PB", "PC", "PD", "PK"], rt: [["A", "B", "C"]], tk: [["BD", 1], ["CK", 1]], pos: { A: "sw", B: "se", C: "w", D: "s", K: "nw", I: "ne", F: "w", P: "ne" }, alt: "Tam giác ABC vuông cân tại A, D trên AB, K trên tia đối của tia CA với CK bằng BD, DK cắt BC tại I, điểm P cố định" }); },
      steps: [
        "a) Kẻ DF // AC (F thuộc BC). Khi đó ∠BFD = ∠BCA = 45° (hai góc đồng vị) và ∠DBF = 45°, nên tam giác DBF cân tại D: DF = DB = CK.",
        "Xét ΔIDF và ΔIKC có: ∠IDF = ∠IKC (so le trong, DF // CK); DF = KC; ∠IFD = ∠ICK (so le trong). Do đó ΔIDF = ΔIKC (g.c.g), suy ra ID = IK: I là trung điểm của DK.",
        "b) Qua B kẻ đường thẳng vuông góc với AB, qua C kẻ đường thẳng vuông góc với AC; hai đường thẳng này cắt nhau tại P (P cố định vì A, B, C cố định).",
        "∠PBC = 90° − 45° = 45° và ∠PCB = 90° − 45° = 45°, nên tam giác PBC cân tại P: PB = PC.",
        "Xét hai tam giác vuông PBD (vuông tại B) và PCK (vuông tại C) có: PB = PC; BD = CK. Do đó ΔPBD = ΔPCK (hai cạnh góc vuông), suy ra PD = PK.",
        "Vậy P nằm trên đường trung trực của DK: đường trung trực của DK luôn đi qua điểm cố định P."
      ],
      dap: "a) I là trung điểm của DK. b) Đường trung trực của DK luôn đi qua điểm P (giao của đường vuông góc với AB tại B và đường vuông góc với AC tại C).",
      loi: "Ở câu b chỉ chứng minh đường trung trực đi qua I (I thay đổi khi D thay đổi), không phải điểm cố định.",
      mix: [10, 14, 15]
    },
    {
      id: "hsg5", lv: "HSG",
      de: "Cho đoạn thẳng AB, O là trung điểm của AB. Trên cùng một nửa mặt phẳng bờ AB vẽ hai tia Ax, By cùng vuông góc với AB. Trên tia Ax lấy điểm C, trên tia By lấy điểm D sao cho ∠COD = 90°.<br>a) Chứng minh CD = AC + BD.<br>b) Chứng minh DO là tia phân giác của góc BDC.<br>c) Kẻ OH ⊥ CD (H thuộc CD). Chứng minh OH = OA và ∠AHB = 90°.",
      goi: "Tia CO cắt đường thẳng BD tại E. Chứng minh ΔOAC = ΔOBE, rồi chỉ ra DO là đường trung trực của CE.",
      fig: function () { var A = [0, 0], B = [8, 0], O = [4, 0], C = [0, 2], D = [8, 8], E = [8, -2], H = foot(O, C, D); return draw({ P: { A: A, B: B, O: O, C: C, D: D, E: E, H: H }, seg: ["AB", "AC", "BD", "CD", "OC", "OD"], thin: ["OE", "BE", "OH", "AH", "BH"], rt: [["A", "B", "C"], ["B", "A", "D"], ["O", "C", "D"]], tk: [["AO", 1], ["OB", 1]], pos: { A: "sw", B: "e", O: "s", C: "w", D: "ne", E: "se", H: "n" }, alt: "Đoạn thẳng AB với trung điểm O, AC và BD vuông góc với AB, góc COD vuông, CO cắt BD tại E, OH vuông góc CD" }); },
      steps: [
        "a) Tia CO cắt đường thẳng BD tại E (E nằm trên tia đối của tia By). Xét hai tam giác vuông OAC và OBE có: OA = OB; ∠AOC = ∠BOE (hai góc đối đỉnh). Do đó ΔOAC = ΔOBE (cạnh góc vuông – góc nhọn kề), suy ra OC = OE và AC = BE.",
        "DO ⊥ CE tại O và O là trung điểm của CE, nên DO là đường trung trực của CE. Do đó DC = DE = DB + BE = DB + AC.",
        "b) ΔDOC = ΔDOE (hai cạnh góc vuông: OC = OE, OD chung), suy ra ∠ODC = ∠ODE, tức là ∠ODH = ∠ODB. Vậy DO là tia phân giác của góc BDC.",
        "c) Xét hai tam giác vuông ODH và ODB có: OD là cạnh huyền chung; ∠ODH = ∠ODB. Do đó ΔODH = ΔODB (cạnh huyền – góc nhọn), suy ra OH = OB = OA.",
        "Tam giác OAH cân tại O nên ∠OHA = ∠OAH; tam giác OBH cân tại O nên ∠OHB = ∠OBH.",
        "Trong tam giác AHB: ∠AHB = ∠OHA + ∠OHB = ∠HAB + ∠HBA, mà ∠AHB + ∠HAB + ∠HBA = 180° nên ∠AHB = 90°."
      ],
      dap: "CD = AC + BD; DO là tia phân giác của góc BDC; OH = OA và ∠AHB = 90°.",
      loi: "Đặt điểm E tuỳ ý rồi dùng luôn BE = AC; phải xác định E là giao điểm của tia CO với đường thẳng BD.",
      mix: [12, 14, 15]
    }
  ];

  window.TL_DATA = {
    bai: "lc7",
    ten: "Luyện tập chung (sau Bài 16)",
    items: ITEMS,
    _helpers: { foot: foot, cut: cut, add: add, pol: pol, iso: iso }
  };
})();
