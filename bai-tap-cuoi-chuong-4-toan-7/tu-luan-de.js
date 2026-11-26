/* Bài tập tự luận – Bài tập cuối chương IV (Toán 7, Kết nối tri thức).
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

  /* tam giác có ∠B = b, ∠C = c, BC nằm ngang dài 10; trả về [A, B, C] */
  function tri(b, c) { var B = [0, 0], C = [10, 0]; return [cut(B, pol(B, 1, b), C, pol(C, 1, 180 - c)), B, C]; }
  /* quay điểm p quanh o một góc 90° (s = 1 ngược chiều kim đồng hồ, s = −1 cùng chiều) */
  function rot(p, o, s) { return [o[0] - s * (p[1] - o[1]), o[1] + s * (p[0] - o[0])]; }

  var ITEMS = [
    /* ================= NHẬN BIẾT ================= */
    {
      id: "nb1", lv: "NB",
      de: "Cho tam giác ABC có ∠A = 48°, ∠B = 72°.<br>a) Tính số đo ∠C.<br>b) Tam giác ABC là tam giác nhọn, tam giác vuông hay tam giác tù? Vì sao?<br>c) Trên tia đối của tia CB lấy điểm D. Tính số đo ∠ACD.",
      goi: "Tổng ba góc của một tam giác bằng 180°. Hai góc ∠ACB và ∠ACD kề bù.",
      fig: function () { var p = tri(72, 60), D = [15, 0]; return draw({ P: { A: p[0], B: p[1], C: p[2], D: D }, fill: ["ABC"], seg: ["CD"], ang: [["A", "B", "C", "48°", 34], ["B", "A", "C", "72°", 38]], pos: { A: "n", B: "sw", C: "s", D: "se" }, alt: "Tam giác ABC có góc A 48 độ, góc B 72 độ, D trên tia đối của tia CB" }); },
      steps: [
        "a) Trong tam giác ABC: ∠C = 180° − (∠A + ∠B) = 180° − (48° + 72°) = 60°.",
        "b) Ba góc của tam giác là 48°, 72°, 60° đều là góc nhọn nên ΔABC là tam giác nhọn.",
        "c) D nằm trên tia đối của tia CB nên ∠ACB và ∠ACD là hai góc kề bù: ∠ACD = 180° − 60° = 120°."
      ],
      dap: "a) ∠C = 60°. b) Tam giác nhọn. c) ∠ACD = 120°.",
      loi: "Ở câu c lấy ∠ACD = ∠ACB = 60° (nhầm kề bù với đối đỉnh)."
    },
    {
      id: "nb2", lv: "NB",
      de: "Cho ΔABC = ΔDEF, biết AB = 4 cm, BC = 6 cm và DF = 5 cm.<br>a) Tính độ dài các cạnh DE, EF, AC.<br>b) Tính chu vi tam giác ABC và chu vi tam giác DEF.<br>c) Viết các cặp góc tương ứng bằng nhau.",
      goi: "Viết các cặp đỉnh tương ứng theo thứ tự: A ↔ D, B ↔ E, C ↔ F.",
      fig: function () { var A = [1.4, 3.2], B = [0, 0], C = [4.8, 0], D = [8.4, 3.2], E = [7, 0], F = [11.8, 0]; return draw({ P: { A: A, B: B, C: C, D: D, E: E, F: F }, fill: ["ABC", "DEF"], tk: [["AB", 1], ["DE", 1], ["BC", 2], ["EF", 2], ["AC", 3], ["DF", 3]], pos: { A: "n", B: "sw", C: "se", D: "n", E: "sw", F: "se" }, w: 320, alt: "Hai tam giác bằng nhau ABC và DEF" }); },
      steps: [
        "a) ΔABC = ΔDEF nên A ↔ D, B ↔ E, C ↔ F. Suy ra DE = AB = 4 cm, EF = BC = 6 cm, AC = DF = 5 cm.",
        "b) Chu vi tam giác ABC: AB + BC + AC = 4 + 6 + 5 = 15 (cm). Chu vi tam giác DEF: DE + EF + DF = 4 + 6 + 5 = 15 (cm).",
        "c) ∠A = ∠D, ∠B = ∠E, ∠C = ∠F."
      ],
      dap: "a) DE = 4 cm, EF = 6 cm, AC = 5 cm. b) Cả hai tam giác có chu vi 15 cm. c) ∠A = ∠D, ∠B = ∠E, ∠C = ∠F.",
      loi: "Ghép sai cạnh tương ứng, ví dụ cho AC = EF."
    },
    {
      id: "nb3", lv: "NB",
      de: "Cho tam giác ABC cân tại A có AB = 7 cm và ∠B = 70°.<br>a) Tính độ dài cạnh AC.<br>b) Tính số đo ∠C và ∠A.",
      goi: "Tam giác cân tại A có hai cạnh bên AB = AC và hai góc ở đáy ∠B = ∠C.",
      fig: function () { var p = iso(40); return draw({ P: { A: p[0], B: p[1], C: p[2] }, fill: ["ABC"], tk: [["AB", 1], ["AC", 1]], arc: [["B", "A", "C", 1], ["C", "A", "B", 1]], pos: { A: "n", B: "sw", C: "se" }, w: 220, alt: "Tam giác ABC cân tại A" }); },
      steps: [
        "a) ΔABC cân tại A nên hai cạnh bên bằng nhau: AC = AB = 7 cm.",
        "b) Hai góc ở đáy bằng nhau: ∠C = ∠B = 70°.",
        "Trong tam giác ABC: ∠A = 180° − (70° + 70°) = 40°."
      ],
      dap: "a) AC = 7 cm. b) ∠C = 70°, ∠A = 40°.",
      loi: "Cho AC = BC hoặc ∠A = ∠B (nhầm đỉnh của tam giác cân).",
      mix: [12]
    },

    /* ================= THÔNG HIỂU ================= */
    {
      id: "th1", lv: "TH",
      de: "Cho góc xOy và tia phân giác Oz của nó. Lấy điểm M trên tia Oz (M khác O), kẻ MA ⊥ Ox tại A, MB ⊥ Oy tại B.<br>a) Chứng minh ΔOAM = ΔOBM.<br>b) Chứng minh MA = MB và OA = OB.<br>c) Chứng minh OM là đường trung trực của đoạn thẳng AB.",
      goi: "Hai tam giác vuông OAM, OBM có chung cạnh huyền OM. Câu c: tìm hai điểm cùng cách đều A và B.",
      fig: function () { var O = [0, 0], M = pol(O, 8, 28), A = [M[0], 0], B = foot(M, O, pol(O, 1, 56)); return draw({ P: { O: O, M: M, A: A, B: B, _x: [11, 0], _y: pol(O, 11, 56), _z: pol(O, 11, 28) }, seg: [["O", "_x"], ["O", "_y"], "MA", "MB"], thin: [["O", "_z"], "AB"], rt: [["A", "O", "M"], ["B", "O", "M"]], arc: [["O", "_x", "_z", 1], ["O", "_z", "_y", 1]], pos: { O: "w", M: "e", A: "s", B: "nw" }, alt: "Tia Oz là tia phân giác của góc xOy, MA vuông góc với Ox, MB vuông góc với Oy" }); },
      steps: [
        "a) Xét hai tam giác vuông OAM (vuông tại A) và OBM (vuông tại B) có: OM là cạnh huyền chung; ∠AOM = ∠BOM (Oz là tia phân giác của góc xOy). Do đó ΔOAM = ΔOBM (cạnh huyền – góc nhọn).",
        "b) Từ câu a suy ra MA = MB và OA = OB (các cặp cạnh tương ứng).",
        "c) OA = OB nên O nằm trên đường trung trực của AB; MA = MB nên M nằm trên đường trung trực của AB.",
        "Hai điểm phân biệt O và M cùng nằm trên đường trung trực của AB, vậy OM là đường trung trực của đoạn thẳng AB."
      ],
      dap: "ΔOAM = ΔOBM (cạnh huyền – góc nhọn); MA = MB, OA = OB; OM là đường trung trực của AB.",
      loi: "Dùng trường hợp hai cạnh góc vuông khi chưa biết OA = OB hay MA = MB.",
      mix: [15, 16]
    },
    {
      id: "th2", lv: "TH",
      de: "Cho đoạn thẳng AB. Hai điểm C và D nằm khác phía đối với đường thẳng AB sao cho AC = AD và BC = BD.<br>a) Chứng minh ΔABC = ΔABD.<br>b) Chứng minh AB là tia phân giác của góc CAD.<br>c) Chứng minh đường thẳng AB là đường trung trực của đoạn thẳng CD.",
      goi: "Câu a dùng trường hợp c.c.c. Câu c: A và B đều cách đều C và D.",
      fig: function () { var A = [0, 0], B = [10, 0], C = [3.4, 4.4], D = [3.4, -4.4]; return draw({ P: { A: A, B: B, C: C, D: D }, fill: ["ABC", "ABD"], thin: ["CD"], tk: [["AC", 1], ["AD", 1], ["BC", 2], ["BD", 2]], pos: { A: "w", B: "e", C: "n", D: "s" }, alt: "Hai tam giác ABC và ABD có AC bằng AD, BC bằng BD" }); },
      steps: [
        "a) Xét ΔABC và ΔABD có: AC = AD; BC = BD (giả thiết); AB là cạnh chung. Do đó ΔABC = ΔABD (c.c.c).",
        "b) Từ câu a: ∠CAB = ∠DAB (hai góc tương ứng). Tia AB nằm giữa hai tia AC, AD (vì C, D khác phía đối với AB) nên AB là tia phân giác của góc CAD.",
        "c) AC = AD nên A nằm trên đường trung trực của CD; BC = BD nên B nằm trên đường trung trực của CD. Vậy đường thẳng AB là đường trung trực của đoạn thẳng CD."
      ],
      dap: "ΔABC = ΔABD (c.c.c); AB là tia phân giác của góc CAD; AB là đường trung trực của CD.",
      loi: "Ở câu c chỉ nêu một điểm A cách đều C, D rồi kết luận; cần hai điểm cùng cách đều C và D.",
      mix: [16]
    },
    {
      id: "th3", lv: "TH",
      de: "Cho tam giác ABC có ∠B = ∠C = 40°. Tia phân giác của góc A cắt cạnh BC tại D.<br>a) Tính số đo ∠BAC và ∠BAD.<br>b) Tính số đo ∠ADB và ∠ADC.<br>c) Chứng minh ΔABD = ΔACD, từ đó suy ra AB = AC và DB = DC.",
      goi: "Câu b: tính góc thứ ba của các tam giác ABD, ACD. Câu c dùng trường hợp g.c.g với cạnh chung AD.",
      fig: function () { var p = tri(40, 40), D = [5, 0]; return draw({ P: { A: p[0], B: p[1], C: p[2], D: D }, fill: ["ABC"], seg: ["AD"], ang: [["B", "A", "C", "40°", 40], ["C", "A", "B", "40°", 40]], arc: [["A", "B", "D", 1], ["A", "D", "C", 1]], pos: { A: "n", B: "sw", C: "se", D: "s" }, alt: "Tam giác ABC có góc B bằng góc C bằng 40 độ, AD là tia phân giác của góc A" }); },
      steps: [
        "a) ∠BAC = 180° − (40° + 40°) = 100°. AD là tia phân giác nên ∠BAD = ∠CAD = 100° : 2 = 50°.",
        "b) Trong ΔABD: ∠ADB = 180° − (40° + 50°) = 90°. Trong ΔACD: ∠ADC = 180° − (40° + 50°) = 90°.",
        "c) Xét ΔABD và ΔACD có: ∠BAD = ∠CAD; AD là cạnh chung; ∠ADB = ∠ADC (= 90°). Do đó ΔABD = ΔACD (g.c.g).",
        "Suy ra AB = AC và DB = DC (các cặp cạnh tương ứng)."
      ],
      dap: "a) ∠BAC = 100°, ∠BAD = 50°. b) ∠ADB = ∠ADC = 90°. c) ΔABD = ΔACD (g.c.g), AB = AC, DB = DC.",
      loi: "Dùng trường hợp g.c.g với ∠B = ∠C và ∠BAD = ∠CAD: hai góc này không cùng kề cạnh chung AD.",
      mix: [12, 14]
    },

    /* ================= VẬN DỤNG ================= */
    {
      id: "vd1", lv: "VD",
      de: "Cho tam giác ABC có AB < AC, tia phân giác của góc A cắt BC tại D. Trên cạnh AC lấy điểm E sao cho AE = AB.<br>a) Chứng minh ΔABD = ΔAED và DB = DE.<br>b) Chứng minh AD là đường trung trực của đoạn thẳng BE.<br>c) Biết ∠ABC = 80°, ∠ACB = 40°. Tính số đo góc EDC.",
      goi: "Câu c: ∠AED = ∠ABD; ∠DEC kề bù với ∠AED.",
      fig: function () { var p = tri(80, 40), A = p[0], B = p[1], C = p[2], D = cut(A, bisDir(A, B, C), B, C), ab = Math.hypot(B[0] - A[0], B[1] - A[1]), ac = Math.hypot(C[0] - A[0], C[1] - A[1]), E = add(A, C, ab / ac); return draw({ P: { A: A, B: B, C: C, D: D, E: E }, fill: ["ABC"], seg: ["AD", "DE"], thin: ["BE"], tk: [["AB", 1], ["AE", 1]], arc: [["A", "B", "D", 1], ["A", "D", "C", 1]], pos: { A: "n", B: "sw", C: "se", D: "s", E: "ne" }, alt: "Tam giác ABC, AD là tia phân giác của góc A, E trên AC với AE bằng AB" }); },
      steps: [
        "a) Xét ΔABD và ΔAED có: AB = AE (giả thiết); ∠BAD = ∠EAD (AD là tia phân giác); AD là cạnh chung. Do đó ΔABD = ΔAED (c.g.c), suy ra DB = DE.",
        "b) AB = AE nên A nằm trên đường trung trực của BE; DB = DE nên D nằm trên đường trung trực của BE. Vậy AD là đường trung trực của đoạn thẳng BE.",
        "c) Từ câu a: ∠AED = ∠ABD = 80°. Hai góc ∠AED và ∠DEC kề bù nên ∠DEC = 180° − 80° = 100°.",
        "Trong ΔDEC: ∠EDC = 180° − (∠DEC + ∠ECD) = 180° − (100° + 40°) = 40°."
      ],
      dap: "a) ΔABD = ΔAED (c.g.c), DB = DE. b) AD là đường trung trực của BE. c) ∠EDC = 40°.",
      loi: "Ở câu c lấy ∠DEC = ∠ABD = 80° (quên ∠DEC kề bù với ∠AED).",
      mix: [12, 14, 16]
    },
    {
      id: "vd2", lv: "VD",
      de: "Cho tam giác ABC vuông cân tại A. Qua A kẻ đường thẳng d không cắt đoạn thẳng BC (B và C nằm cùng phía đối với d). Kẻ BH ⊥ d tại H, CK ⊥ d tại K.<br>a) Chứng minh ∠HAB = ∠KCA.<br>b) Chứng minh ΔAHB = ΔCKA.<br>c) Chứng minh HK = BH + CK.",
      goi: "∠HAB + ∠BAC + ∠CAK = 180° và ∠BAC = 90°. Trong ΔCKA vuông tại K: ∠KCA + ∠KAC = 90°.",
      fig: function () { var A = [0, 0], B = pol(A, 6, 150), C = pol(A, 6, 60), H = [B[0], 0], K = [C[0], 0]; return draw({ P: { A: A, B: B, C: C, H: H, K: K, _l: [-8, 0], _r: [5.5, 0] }, fill: ["ABC"], seg: [["_l", "_r"], "BH", "CK"], tk: [["AB", 1], ["AC", 1]], rt: [["A", "B", "C"], ["H", "A", "B"], ["K", "C", "A"]], txt: [["_r", "d", 0, -8]], pos: { A: "s", B: "nw", C: "ne", H: "s", K: "s" }, w: 300, alt: "Tam giác ABC vuông cân tại A, đường thẳng d qua A, BH và CK vuông góc với d" }); },
      steps: [
        "a) Ba điểm H, A, K thẳng hàng nên ∠HAB + ∠BAC + ∠CAK = 180°, mà ∠BAC = 90° nên ∠HAB + ∠CAK = 90°.",
        "Trong ΔCKA vuông tại K: ∠KCA + ∠CAK = 90°. Do đó ∠HAB = ∠KCA.",
        "b) Xét hai tam giác vuông AHB (vuông tại H) và CKA (vuông tại K) có: cạnh huyền AB = CA (ΔABC vuông cân tại A); ∠HAB = ∠KCA (câu a). Do đó ΔAHB = ΔCKA (cạnh huyền – góc nhọn).",
        "c) Từ câu b: AH = CK và BH = AK (các cặp cạnh tương ứng). A nằm giữa H và K nên HK = HA + AK = CK + BH."
      ],
      dap: "∠HAB = ∠KCA; ΔAHB = ΔCKA (cạnh huyền – góc nhọn); HK = BH + CK.",
      loi: "Ghép sai cạnh tương ứng: AH = AK hoặc BH = CK.",
      mix: [12, 15, 16]
    },
    {
      id: "vd3", lv: "VD",
      de: "Cho tam giác ABC cân tại A có ∠A = 36°. Tia phân giác của góc B cắt cạnh AC tại D.<br>a) Tính số đo các góc ∠ABD, ∠DBC và ∠BDC.<br>b) Chứng minh hai tam giác ABD và BDC đều là tam giác cân.<br>c) Chứng minh AD = BC.",
      goi: "Tính ∠ABC trước. Tam giác có hai góc bằng nhau là tam giác cân.",
      fig: function () { var p = iso(36), A = p[0], B = p[1], C = p[2], D = cut(B, bisDir(B, A, C), A, C); return draw({ P: { A: A, B: B, C: C, D: D }, fill: ["ABC"], seg: ["BD"], tk: [["AB", 1], ["AC", 1]], arc: [["B", "A", "D", 1], ["B", "D", "C", 1]], ang: [["A", "B", "C", "36°", 44]], pos: { A: "n", B: "sw", C: "se", D: "e" }, w: 220, alt: "Tam giác ABC cân tại A có góc A 36 độ, BD là tia phân giác của góc B" }); },
      steps: [
        "a) ∠ABC = ∠ACB = (180° − 36°) : 2 = 72°. BD là tia phân giác nên ∠ABD = ∠DBC = 72° : 2 = 36°.",
        "Trong ΔBDC: ∠BDC = 180° − (∠DBC + ∠C) = 180° − (36° + 72°) = 72°.",
        "b) ΔABD có ∠DAB = ∠DBA (= 36°) nên cân tại D, suy ra DA = DB.",
        "ΔBDC có ∠BDC = ∠BCD (= 72°) nên cân tại B, suy ra BD = BC.",
        "c) Từ câu b: AD = BD và BD = BC, nên AD = BC."
      ],
      dap: "a) ∠ABD = ∠DBC = 36°, ∠BDC = 72°. b) ΔABD cân tại D, ΔBDC cân tại B. c) AD = BC.",
      loi: "Kết luận ΔBDC cân tại D (nhầm đỉnh): hai góc bằng nhau là ∠BDC và ∠C nên tam giác cân tại B.",
      mix: [12]
    },
    {
      id: "vd4", lv: "VD",
      de: "Cho tam giác ABC, M là trung điểm của BC. Trên tia đối của tia MA lấy điểm E sao cho ME = MA.<br>a) Chứng minh AB = CE và AB // CE.<br>b) Kẻ AH ⊥ BC tại H, EK ⊥ BC tại K. Chứng minh AH = EK.<br>c) Chứng minh M là trung điểm của HK.",
      goi: "Câu a: ΔMAB = ΔMEC (c.g.c). Câu b: hai tam giác vuông MHA và MKE có cạnh huyền MA = ME.",
      fig: function () { var B = [0, 0], C = [10, 0], A = [3, 5.4], M = [5, 0], E = [7, -5.4], H = [3, 0], K = [7, 0]; return draw({ P: { A: A, B: B, C: C, M: M, E: E, H: H, K: K }, fill: ["ABC"], seg: ["AE", "CE", "AH", "EK"], thin: ["BE"], tk: [["BM", 1], ["MC", 1], ["AM", 2], ["ME", 2]], rt: [["H", "C", "A"], ["K", "B", "E"]], pos: { A: "n", B: "w", C: "e", M: "s", E: "s", H: "s", K: "n" }, h: 200, alt: "Tam giác ABC, M là trung điểm của BC, E trên tia đối của tia MA với ME bằng MA, AH và EK vuông góc với BC" }); },
      steps: [
        "a) Xét ΔMAB và ΔMEC có: MA = ME (giả thiết); ∠AMB = ∠EMC (hai góc đối đỉnh); MB = MC (M là trung điểm của BC). Do đó ΔMAB = ΔMEC (c.g.c).",
        "Suy ra AB = EC và ∠MBA = ∠MCE. Hai góc này ở vị trí so le trong nên AB // CE.",
        "b) Xét hai tam giác vuông MHA (vuông tại H) và MKE (vuông tại K) có: cạnh huyền MA = ME; ∠AMH = ∠EMK (hai góc đối đỉnh). Do đó ΔMHA = ΔMKE (cạnh huyền – góc nhọn), suy ra AH = EK.",
        "c) Cũng từ ΔMHA = ΔMKE: MH = MK. Mà H, M, K thẳng hàng (cùng nằm trên BC) và H, K nằm khác phía đối với M, nên M là trung điểm của HK."
      ],
      dap: "AB = CE, AB // CE; AH = EK; M là trung điểm của HK.",
      loi: "Ở câu b dùng trường hợp hai cạnh góc vuông khi chưa biết MH = MK.",
      mix: [14, 15]
    },
    {
      id: "vd5", lv: "VD",
      de: "Cho tam giác ABC cân tại A có ∠A = 40°. Đường trung trực của cạnh AB cắt cạnh AC tại D.<br>a) Chứng minh tam giác ABD cân và tính số đo ∠ABD.<br>b) Tính số đo ∠DBC.<br>c) Chứng minh chu vi tam giác BDC bằng AB + BC.",
      goi: "D nằm trên đường trung trực của AB thì DA = DB. Chu vi ΔBDC = BD + DC + BC, thay BD bằng AD.",
      fig: function () { var p = iso(40), A = p[0], B = p[1], C = p[2], M = add(A, B, .5), D = cut(M, [M[0] + (B[1] - A[1]), M[1] - (B[0] - A[0])], A, C); return draw({ P: { A: A, B: B, C: C, D: D, M: M }, fill: ["ABC"], seg: ["BD"], thin: ["MD"], tk: [["AM", 2], ["MB", 2]], rt: [["M", "A", "D"]], pos: { A: "n", B: "sw", C: "se", D: "e", M: "w" }, w: 220, alt: "Tam giác ABC cân tại A, đường trung trực của AB đi qua trung điểm M của AB và cắt AC tại D" }); },
      steps: [
        "a) D nằm trên đường trung trực của AB nên DA = DB, tam giác ABD cân tại D. Do đó ∠ABD = ∠BAD = 40°.",
        "b) ∠ABC = ∠ACB = (180° − 40°) : 2 = 70°. D nằm giữa A và C nên ∠DBC = ∠ABC − ∠ABD = 70° − 40° = 30°.",
        "c) Chu vi ΔBDC = BD + DC + BC = AD + DC + BC = AC + BC = AB + BC (vì AC = AB)."
      ],
      dap: "a) ΔABD cân tại D, ∠ABD = 40°. b) ∠DBC = 30°. c) Chu vi ΔBDC = AB + BC.",
      loi: "Cho D là trung điểm của AC (nhầm với trung điểm M của AB).",
      mix: [12, 16]
    },

    /* ================= DÀNH CHO HỌC SINH GIỎI ================= */
    {
      id: "hsg1", lv: "HSG",
      de: "Cho tam giác ABC. Tia phân giác của góc B cắt cạnh AC tại D, tia phân giác của góc C cắt cạnh AB tại E; BD và CE cắt nhau tại I. Biết BE + CD = BC. Tính số đo góc BAC.",
      goi: "Lấy điểm F trên cạnh BC sao cho BF = BE; khi đó CF = CD. Chứng minh bốn góc ∠BIE, ∠BIF, ∠CIF, ∠CID bằng nhau.",
      fig: function () { var p = tri(66, 54), A = p[0], B = p[1], C = p[2], D = cut(B, bisDir(B, A, C), A, C), E = cut(C, bisDir(C, A, B), A, B), I = cut(B, D, C, E), be = Math.hypot(E[0] - B[0], E[1] - B[1]), F = [be, 0]; return draw({ P: { A: A, B: B, C: C, D: D, E: E, I: I, F: F }, fill: ["ABC"], seg: ["BD", "CE"], thin: ["IF"], tk: [["BE", 1], ["BF", 1], ["CD", 2], ["CF", 2]], pos: { A: "n", B: "sw", C: "se", D: "ne", E: "nw", I: "n", F: "s" }, alt: "Tam giác ABC, hai tia phân giác BD và CE cắt nhau tại I, F trên BC với BF bằng BE" }); },
      steps: [
        "Kẻ thêm: trên cạnh BC lấy điểm F sao cho BF = BE (làm được vì BE < BE + CD = BC). Khi đó CF = BC − BF = BC − BE = CD.",
        "Xét ΔBEI và ΔBFI có: BE = BF; ∠EBI = ∠FBI (BI là tia phân giác của góc B); BI là cạnh chung. Do đó ΔBEI = ΔBFI (c.g.c), suy ra ∠BIE = ∠BIF.",
        "Tương tự, ΔCDI = ΔCFI (c.g.c: CD = CF, ∠DCI = ∠FCI, CI chung), suy ra ∠CID = ∠CIF.",
        "Lại có ∠BIE = ∠CID (hai góc đối đỉnh). Vậy ∠BIE = ∠BIF = ∠CIF = ∠CID.",
        "Ba điểm E, I, C thẳng hàng nên ∠BIE + ∠BIC = 180°, mà ∠BIC = ∠BIF + ∠FIC (F nằm giữa B và C). Do đó ∠BIE + ∠BIF + ∠FIC = 180°, tức là 3 · ∠BIE = 180°, ∠BIE = 60°.",
        "Suy ra ∠BIC = 120°. Trong ΔIBC: ∠IBC + ∠ICB = 60°, nên ∠ABC + ∠ACB = 2 · 60° = 120°.",
        "Vậy ∠BAC = 180° − 120° = 60°."
      ],
      dap: "∠BAC = 60°.",
      loi: "Chỉ kiểm tra với tam giác đều rồi kết luận; phải chứng minh cho mọi tam giác thỏa mãn BE + CD = BC.",
      mix: [12, 14]
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Cho tam giác ABC có ∠A < 90°. Trên nửa mặt phẳng bờ AB không chứa điểm C vẽ đoạn thẳng AM sao cho AM ⊥ AB và AM = AB. Trên nửa mặt phẳng bờ AC không chứa điểm B vẽ đoạn thẳng AN sao cho AN ⊥ AC và AN = AC. Kẻ AH ⊥ BC tại H; đường thẳng AH cắt MN tại I.<br>a) Kẻ MP và NQ vuông góc với đường thẳng AH (P, Q thuộc đường thẳng AH). Chứng minh MP = AH = NQ.<br>b) Chứng minh I là trung điểm của MN.<br>c) Chứng minh BC = 2 · AI.",
      goi: "Câu a: chứng minh ΔMPA = ΔAHB và ΔNQA = ΔAHC (cạnh huyền – góc nhọn). Câu c: BC = BH + HC = AP + AQ.",
      fig: function () { var B = [0, 0], C = [7, 0], A = [2, 4], M = rot(B, A, -1), N = rot(C, A, 1), H = [2, 0], P = [2, M[1]], Q = [2, N[1]], I = cut(M, N, A, H); return draw({ P: { A: A, B: B, C: C, M: M, N: N, H: H, P: P, Q: Q, I: I }, fill: ["ABC"], seg: ["AM", "AN", "MN", "AH"], thin: ["MP", "NQ", "BM", "CN", "PQ"], rt: [["A", "B", "M"], ["A", "C", "N"], ["H", "C", "A"], ["P", "A", "M"], ["Q", "N", "A"]], pos: { A: "e", B: "sw", C: "se", M: "w", N: "e", H: "s", P: "e", Q: "w", I: "ne" }, w: 300, alt: "Tam giác ABC, AM vuông góc và bằng AB, AN vuông góc và bằng AC, AH vuông góc BC, MP và NQ vuông góc với đường thẳng AH" }); },
      steps: [
        "a) P nằm trên tia đối của tia AH và ∠MAB = 90° nên ∠MAP + ∠BAH = 180° − 90° = 90°. Trong ΔAHB vuông tại H: ∠ABH + ∠BAH = 90°. Suy ra ∠MAP = ∠ABH.",
        "Xét hai tam giác vuông MPA (vuông tại P) và AHB (vuông tại H) có: cạnh huyền AM = BA; ∠MAP = ∠ABH. Do đó ΔMPA = ΔAHB (cạnh huyền – góc nhọn), suy ra MP = AH và AP = BH.",
        "Tương tự, ΔNQA = ΔAHC (cạnh huyền AN = CA, ∠NAQ = ∠ACH), suy ra NQ = AH và AQ = CH. Vậy MP = AH = NQ.",
        "b) MP và NQ cùng vuông góc với đường thẳng AH nên MP // NQ, suy ra ∠PMI = ∠QNI (so le trong).",
        "Xét hai tam giác vuông IPM và IQN có: MP = NQ (câu a); ∠PMI = ∠QNI. Do đó ΔIPM = ΔIQN (cạnh góc vuông – góc nhọn kề), suy ra IM = IN và IP = IQ. Vậy I là trung điểm của MN.",
        "c) BC = BH + HC = AP + AQ (câu a). Không mất tính tổng quát, giả sử P nằm giữa A và I (nếu không thì đổi vai trò của P và Q); khi đó I nằm giữa P và Q, AP = AI − IP và AQ = AI + IQ.",
        "Do IP = IQ nên AP + AQ = 2 · AI. Vậy BC = 2 · AI."
      ],
      dap: "MP = AH = NQ; I là trung điểm của MN; BC = 2 · AI.",
      loi: "Ở câu a lấy ∠MAP = ∠BAH; đúng là ∠MAP = ∠ABH (cùng phụ với ∠BAH).",
      mix: [12, 13, 15]
    },
    {
      id: "hsg3", lv: "HSG",
      de: "Cho điểm M nằm giữa hai điểm A và B. Trên cùng một nửa mặt phẳng bờ AB vẽ hai tam giác đều AMC và BMD. Gọi I và K lần lượt là trung điểm của AD và BC.<br>a) Chứng minh AD = CB.<br>b) Chứng minh MI = MK.<br>c) Chứng minh tam giác MIK là tam giác đều.",
      goi: "Câu a: ΔAMD = ΔCMB (c.g.c) vì ∠AMD = ∠CMB = 120°. Câu c: chứng minh ∠IMK = ∠AMC.",
      fig: function () { var A = [0, 0], M = [4, 0], B = [10, 0], C = pol(A, 4, 60), D = pol(M, 6, 60), I = add(A, D, .5), K = add(B, C, .5); return draw({ P: { A: A, M: M, B: B, C: C, D: D, I: I, K: K }, fill: ["AMC", "MBD"], seg: ["AD", "BC"], thin: ["MI", "MK", "IK"], tk: [["AI", 1], ["ID", 1], ["CK", 2], ["KB", 2]], pos: { A: "sw", M: "s", B: "se", C: "nw", D: "n", I: "nw", K: "ne" }, w: 300, alt: "Hai tam giác đều AMC và BMD cùng phía đối với AB, I và K là trung điểm của AD và BC" }); },
      steps: [
        "a) ∠AMC = ∠BMD = 60° nên ∠AMD = 180° − ∠BMD = 120° và ∠CMB = 180° − ∠AMC = 120°.",
        "Xét ΔAMD và ΔCMB có: AM = CM (ΔAMC đều); ∠AMD = ∠CMB (= 120°); MD = MB (ΔBMD đều). Do đó ΔAMD = ΔCMB (c.g.c), suy ra AD = CB và ∠MAD = ∠MCB.",
        "b) I, K là trung điểm của AD, CB mà AD = CB nên AI = CK.",
        "Xét ΔAMI và ΔCMK có: AM = CM; ∠MAI = ∠MCK (câu a); AI = CK. Do đó ΔAMI = ΔCMK (c.g.c), suy ra MI = MK và ∠AMI = ∠CMK.",
        "c) ∠IMK = ∠IMC + ∠CMK = ∠IMC + ∠AMI = ∠AMC = 60°.",
        "Tam giác MIK có MI = MK nên cân tại M, lại có ∠IMK = 60° nên là tam giác đều."
      ],
      dap: "AD = CB; MI = MK; ΔMIK đều.",
      loi: "Ở câu c chỉ chứng minh MI = MK rồi kết luận tam giác đều; cần thêm một góc bằng 60°.",
      mix: [12, 14]
    },
    {
      id: "hsg4", lv: "HSG",
      de: "Cho tam giác ABC cân tại A có ∠A = 100°. Điểm M nằm trong tam giác sao cho ∠MBC = 10° và ∠MCB = 20°. Tính số đo góc AMB.",
      goi: "CM là tia phân giác của góc ACB. Trên tia CA lấy điểm D sao cho CD = CB; chứng minh tam giác MBD đều.",
      fig: function () { var p = tri(40, 40), A = p[0], B = p[1], C = p[2], M = cut(B, pol(B, 1, 10), C, pol(C, 1, 160)), cb = 10, u = [A[0] - C[0], A[1] - C[1]], L = Math.hypot(u[0], u[1]), D = [C[0] + u[0] / L * cb, C[1] + u[1] / L * cb]; return draw({ P: { A: A, B: B, C: C, M: M, D: D }, fill: ["ABC"], seg: ["MB", "MC", "AM", "AD"], thin: ["BD", "MD"], tk: [["CB", 1], ["CD", 1]], pos: { A: "e", B: "sw", C: "se", M: "s", D: "n" }, alt: "Tam giác ABC cân tại A, góc A 100 độ, điểm M trong tam giác, D trên tia CA với CD bằng CB" }); },
      steps: [
        "∠ABC = ∠ACB = (180° − 100°) : 2 = 40°. Do đó ∠MCA = 40° − 20° = 20° = ∠MCB, tức CM là tia phân giác của góc ACB; và ∠ABM = 40° − 10° = 30°.",
        "Kẻ thêm: trên tia CA lấy điểm D sao cho CD = CB. Khi đó A nằm giữa C và D (giải thích ở bước cuối).",
        "Xét ΔCMB và ΔCMD có: CB = CD; ∠MCB = ∠MCD (= 20°); CM chung. Do đó ΔCMB = ΔCMD (c.g.c), suy ra MB = MD và ∠CDM = ∠CBM = 10°.",
        "ΔCBD cân tại C có ∠BCD = 40° nên ∠CDB = ∠CBD = (180° − 40°) : 2 = 70°. Suy ra ∠MDB = 70° − 10° = 60°.",
        "Tam giác MBD có MB = MD và ∠MDB = 60° nên là tam giác đều: BD = BM và ∠MBD = 60°.",
        "Trong ΔABD: ∠BAD = 180° − ∠BAC = 80° (kề bù), ∠ADB = 70°, nên ∠ABD = 180° − 80° − 70° = 30° = ∠ABM.",
        "Xét ΔABM và ΔABD có: BM = BD; ∠ABM = ∠ABD (= 30°); AB chung. Do đó ΔABM = ΔABD (c.g.c), suy ra ∠AMB = ∠ADB = 70°.",
        "Giải thích vì sao A nằm giữa C và D: nếu D nằm giữa C và A thì ∠BDA kề bù với ∠CDB nên ∠BDA = 110°, khi đó tam giác ABD có ∠BAD + ∠BDA = 100° + 110° > 180°, vô lí; nếu D trùng A thì ∠CAB = ∠CDB = 70°, trái với ∠A = 100°."
      ],
      dap: "∠AMB = 70°.",
      loi: "Đoán ∠AMB từ hình vẽ đo bằng thước đo góc; phải dựng thêm điểm D và chứng minh.",
      mix: [12, 13, 16]
    },
    {
      id: "hsg5", lv: "HSG",
      de: "Cho tam giác ABC vuông tại A. Kẻ AH ⊥ BC tại H. Gọi M là trung điểm của BC; trên tia đối của tia MA lấy điểm D sao cho MD = MA. Trên tia đối của tia CD lấy điểm I sao cho CI = CA. Qua I kẻ đường thẳng song song với AC, cắt đường thẳng AH tại E.<br>a) Chứng minh CD // AB và CD ⊥ AC.<br>b) Chứng minh AE = BC.",
      goi: "Gọi K là giao điểm của đường thẳng IE với đường thẳng AB. Chứng minh ΔACI = ΔIKA (g.c.g) để có AK = AC, rồi so sánh ΔAKE với ΔCAB.",
      fig: function () { var A = [0, 0], B = [6, 0], C = [0, 4], D = [6, 4], I = [-4, 4], E = [-4, -6], K = [-4, 0], H = foot(A, B, C), M = [3, 2]; return draw({ P: { A: A, B: B, C: C, D: D, I: I, E: E, K: K, H: H, M: M }, fill: ["ABC"], seg: ["AD", "CD", "CI", "IE", "AE", "AH"], thin: ["KA", "AI"], tk: [["AM", 1], ["MD", 1], ["CI", 2], ["CA", 2]], rt: [["A", "B", "C"], ["H", "C", "A"]], pos: { A: "sw", B: "se", C: "n", D: "ne", I: "nw", E: "sw", K: "w", H: "ne", M: "e" }, w: 300, alt: "Tam giác ABC vuông tại A, AH vuông góc BC, D đối xứng A qua trung điểm M của BC, I trên tia đối của tia CD với CI bằng CA, IE song song AC cắt AH tại E" }); },
      steps: [
        "a) Xét ΔMAB và ΔMDC có: MA = MD; ∠AMB = ∠DMC (đối đỉnh); MB = MC. Do đó ΔMAB = ΔMDC (c.g.c), suy ra CD = AB và ∠MDC = ∠MAB.",
        "Hai góc ∠MDC, ∠MAB ở vị trí so le trong nên CD // AB. Mà AB ⊥ AC nên CD ⊥ AC.",
        "b) Gọi K là giao điểm của đường thẳng IE với đường thẳng AB. Vì IK // AC và AC ⊥ AB nên IK ⊥ AB tại K. Đường thẳng CI trùng với đường thẳng CD nên CI // AK.",
        "Xét ΔACI và ΔIKA có: ∠CAI = ∠KIA (so le trong, AC // IK); AI là cạnh chung; ∠CIA = ∠KAI (so le trong, CI // AK). Do đó ΔACI = ΔIKA (g.c.g), suy ra AK = CI = CA.",
        "Ta có ∠KAE = ∠BAH (hai góc đối đỉnh, vì K nằm trên tia đối của tia AB và E nằm trên tia đối của tia AH). Trong ΔABH vuông tại H và ΔABC vuông tại A: ∠BAH = 90° − ∠B = ∠ACB. Suy ra ∠KAE = ∠ACB.",
        "Xét hai tam giác vuông AKE (vuông tại K) và CAB (vuông tại A) có: cạnh góc vuông AK = CA; góc nhọn kề ∠KAE = ∠ACB. Do đó ΔAKE = ΔCAB (cạnh góc vuông – góc nhọn kề), suy ra AE = CB."
      ],
      dap: "CD // AB, CD ⊥ AC; AE = BC.",
      loi: "Dùng luôn AK = CI mà chưa chứng minh (phải qua hai tam giác ACI và IKA bằng nhau).",
      mix: [12, 13, 14, 15]
    }
  ];


  window.TL_DATA = {
    bai: "c47",
    ten: "Bài tập cuối chương IV",
    items: ITEMS,
    _helpers: { foot: foot, cut: cut, add: add, pol: pol, iso: iso, tri: tri, rot: rot }
  };
})();
