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
  var PHU = null;   // các điểm, đoạn kẻ thêm của bài đang vẽ (đặt bởi hinhGoc), để vẽ hình của đề khi goc = true
  function draw(o) {
    if (PHU && !o.goc) o = Object.assign({}, o, { goc: true, phu: PHU });
    if (o.goc && o.phu) {   // hình ban đầu: bỏ các điểm kẻ thêm và mọi đường, kí hiệu đi qua chúng
      var bo = function (t) { return o.phu.some(function (k) { return String(t).indexOf(k) >= 0; }); }, P = {};
      Object.keys(o.P).forEach(function (k) { if (o.phu.indexOf(k) < 0) P[k] = o.P[k]; });
      o = Object.assign({}, o, { P: P,
        seg: (o.seg || []).filter(function (e) { return !bo(e); }), thin: (o.thin || []).filter(function (e) { return !bo(e); }),
        tk: (o.tk || []).filter(function (e) { return !bo(e[0]); }), rt: (o.rt || []).filter(function (e) { return !bo(e.join("")); }),
        arc: (o.arc || []).filter(function (e) { return !bo(e.slice(0, 3).join("")); }), ang: (o.ang || []).filter(function (e) { return !bo(e.slice(0, 3).join("")); }) });
    }
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
      fig: function () { var A = [1.4, 3.2], B = [0, 0], C = [4.8, 0], D = [8.4, 3.2], E = [7, 0], F = [11.8, 0]; return draw({ P: { A: A, B: B, C: C, D: D, E: E, F: F }, fill: ["ABC", "DEF"], side: [["A", "B", "4 cm"], ["B", "C", "6 cm"], ["D", "F", "5 cm"]], pos: { A: "n", B: "sw", C: "se", D: "n", E: "sw", F: "se" }, w: 320, alt: "Hai tam giác bằng nhau ABC và DEF" }); },
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
      fig: function () { var p = iso(40); return draw({ P: { A: p[0], B: p[1], C: p[2] }, fill: ["ABC"], tk: [["AB", 1], ["AC", 1]], ang: [["B", "A", "C", "70°", 40]], side: [["A", "B", "7 cm"]], pos: { A: "n", B: "sw", C: "se" }, w: 220, alt: "Tam giác ABC cân tại A, AB bằng 7 cm, góc B bằng 70 độ" }); },
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
        "a) Xét hai tam giác vuông OAM (vuông tại A) và OBM (vuông tại B) có: OM là cạnh huyền chung; ∠AOM = ∠BOM (Oz là tia phân giác của góc xOy).<br>Do đó ΔOAM = ΔOBM (cạnh huyền – góc nhọn).",
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
        "a) Xét ΔABC và ΔABD có: AC = AD; BC = BD (giả thiết); AB là cạnh chung.<br>Do đó ΔABC = ΔABD (c.c.c).",
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
        "c) Xét ΔABD và ΔACD có: ∠BAD = ∠CAD; AD là cạnh chung; ∠ADB = ∠ADC (= 90°).<br>Do đó ΔABD = ΔACD (g.c.g).",
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
        "a) Xét ΔABD và ΔAED có: AB = AE (giả thiết); ∠BAD = ∠EAD (AD là tia phân giác); AD là cạnh chung.<br>Do đó ΔABD = ΔAED (c.g.c), suy ra DB = DE.",
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
        "b) Xét hai tam giác vuông AHB (vuông tại H) và CKA (vuông tại K) có: cạnh huyền AB = CA (ΔABC vuông cân tại A); ∠HAB = ∠KCA (câu a).<br>Do đó ΔAHB = ΔCKA (cạnh huyền – góc nhọn).",
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
        "a) Xét ΔMAB và ΔMEC có: MA = ME (giả thiết); ∠AMB = ∠EMC (hai góc đối đỉnh); MB = MC (M là trung điểm của BC).<br>Do đó ΔMAB = ΔMEC (c.g.c).",
        "Suy ra AB = EC và ∠MBA = ∠MCE. Hai góc này ở vị trí so le trong nên AB // CE.",
        "b) Xét hai tam giác vuông MHA (vuông tại H) và MKE (vuông tại K) có: cạnh huyền MA = ME; ∠AMH = ∠EMK (hai góc đối đỉnh).<br>Do đó ΔMHA = ΔMKE (cạnh huyền – góc nhọn), suy ra AH = EK.",
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
      fig: function () { var p = tri(66, 54), A = p[0], B = p[1], C = p[2], D = cut(B, bisDir(B, A, C), A, C), E = cut(C, bisDir(C, A, B), A, B), I = cut(B, D, C, E), be = Math.hypot(E[0] - B[0], E[1] - B[1]), F = [be, 0]; return draw({ P: { A: A, B: B, C: C, D: D, E: E, I: I, F: F }, fill: ["ABC"], seg: ["BD", "CE"], thin: ["IF"], tk: [["BE", 1], ["BF", 1]], pos: { A: "n", B: "sw", C: "se", D: "ne", E: "nw", I: "n", F: "s" }, alt: "Tam giác ABC, hai tia phân giác BD và CE cắt nhau tại I, F trên BC với BF bằng BE" }); },
      steps: [
        "Kẻ thêm: trên cạnh BC lấy điểm F sao cho BF = BE (làm được vì BE < BE + CD = BC). Khi đó CF = BC − BF = BC − BE = CD.",
        "Xét ΔBEI và ΔBFI có: BE = BF; ∠EBI = ∠FBI (BI là tia phân giác của góc B); BI là cạnh chung.<br>Do đó ΔBEI = ΔBFI (c.g.c), suy ra ∠BIE = ∠BIF.",
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
      de: "Cho tam giác ABC có ba góc nhọn. Trên nửa mặt phẳng bờ AB không chứa điểm C vẽ đoạn thẳng AM sao cho AM ⊥ AB và AM = AB. Trên nửa mặt phẳng bờ AC không chứa điểm B vẽ đoạn thẳng AN sao cho AN ⊥ AC và AN = AC. Kẻ AH ⊥ BC tại H; đường thẳng AH cắt MN tại I.<br>a) Kẻ MP và NQ vuông góc với đường thẳng AH (P, Q thuộc đường thẳng AH). Chứng minh MP = AH = NQ.<br>b) Chứng minh I là trung điểm của MN.<br>c) Chứng minh BC = 2 · AI.",
      goi: "Câu a: chứng minh ΔMPA = ΔAHB và ΔNQA = ΔAHC (cạnh huyền – góc nhọn). Câu c: BC = BH + HC = AP + AQ.",
      fig: function () { var B = [0, 0], C = [7, 0], A = [2, 4], M = rot(B, A, -1), N = rot(C, A, 1), H = [2, 0], P = [2, M[1]], Q = [2, N[1]], I = cut(M, N, A, H); return draw({ P: { A: A, B: B, C: C, M: M, N: N, H: H, P: P, Q: Q, I: I }, fill: ["ABC"], seg: ["AM", "AN", "MN", "AH"], thin: ["MP", "NQ", "PQ"], rt: [["A", "B", "M"], ["A", "C", "N"], ["H", "C", "A"], ["P", "A", "M"], ["Q", "N", "A"]], pos: { A: "e", B: "sw", C: "se", M: "w", N: "e", H: "s", P: "e", Q: "w", I: "ne" }, w: 300, alt: "Tam giác ABC, AM vuông góc và bằng AB, AN vuông góc và bằng AC, AH vuông góc BC, MP và NQ vuông góc với đường thẳng AH" }); },
      steps: [
        "a) P nằm trên tia đối của tia AH và ∠MAB = 90° nên ∠MAP + ∠BAH = 180° − 90° = 90°. Trong ΔAHB vuông tại H: ∠ABH + ∠BAH = 90°. Suy ra ∠MAP = ∠ABH.",
        "Xét hai tam giác vuông MPA (vuông tại P) và AHB (vuông tại H) có: cạnh huyền AM = BA; ∠MAP = ∠ABH.<br>Do đó ΔMPA = ΔAHB (cạnh huyền – góc nhọn), suy ra MP = AH và AP = BH.",
        "Tương tự, ΔNQA = ΔAHC (cạnh huyền AN = CA, ∠NAQ = ∠ACH), suy ra NQ = AH và AQ = CH. Vậy MP = AH = NQ.",
        "b) MP và NQ cùng vuông góc với đường thẳng AH nên MP // NQ, suy ra ∠PMI = ∠QNI (so le trong).",
        "Xét hai tam giác vuông IPM và IQN có: MP = NQ (câu a); ∠PMI = ∠QNI.<br>Do đó ΔIPM = ΔIQN (cạnh góc vuông – góc nhọn kề), suy ra IM = IN và IP = IQ. Vậy I là trung điểm của MN.",
        "c) Tam giác ABC có ba góc nhọn nên H nằm giữa B và C: BC = BH + HC = AP + AQ (câu a).",
        "P, Q cùng nằm trên tia đối của tia AH và I là trung điểm của PQ (câu b). Không mất tính tổng quát, giả sử AP ≤ AQ; khi đó AP = AI − IP và AQ = AI + IQ.",
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
      fig: function () { var A = [0, 0], M = [6, 0], B = [10, 0], C = pol(A, 6, 60), D = pol(M, 4, 60), I = add(A, D, .5), K = add(B, C, .5); return draw({ P: { A: A, M: M, B: B, C: C, D: D, I: I, K: K }, fill: ["AMC", "MBD"], seg: ["AD", "BC"], thin: ["MI", "MK", "IK"], tk: [["AI", 1], ["ID", 1], ["CK", 2], ["KB", 2]], pos: { A: "sw", M: "s", B: "se", C: "nw", D: "n", I: "nw", K: "ne" }, w: 300, alt: "Hai tam giác đều AMC và BMD cùng phía đối với AB, I và K là trung điểm của AD và BC" }); },
      steps: [
        "a) ∠AMC = ∠BMD = 60° nên ∠AMD = 180° − ∠BMD = 120° và ∠CMB = 180° − ∠AMC = 120°.",
        "Xét ΔAMD và ΔCMB có: AM = CM (ΔAMC đều); ∠AMD = ∠CMB (= 120°); MD = MB (ΔBMD đều).<br>Do đó ΔAMD = ΔCMB (c.g.c), suy ra AD = CB và ∠MAD = ∠MCB.",
        "b) I, K là trung điểm của AD, CB mà AD = CB nên AI = CK.",
        "Xét ΔAMI và ΔCMK có: AM = CM; ∠MAI = ∠MCK (câu a); AI = CK.<br>Do đó ΔAMI = ΔCMK (c.g.c), suy ra MI = MK và ∠AMI = ∠CMK.",
        "c) Từ câu b: ∠AMI = ∠CMK. Trường hợp MA ≥ MB (như hình): tia MI nằm giữa hai tia MA, MC và tia MC nằm giữa hai tia MI, MK, nên ∠IMK = ∠IMC + ∠CMK = ∠IMC + ∠AMI = ∠AMC = 60°.",
        "Trường hợp MA < MB: tia MC nằm giữa hai tia MA, MI và tia MI nằm giữa hai tia MC, MK, nên ∠IMK = ∠CMK − ∠CMI = ∠AMI − ∠CMI = ∠AMC = 60°.",
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
        "Xét ΔCMB và ΔCMD có: CB = CD; ∠MCB = ∠MCD (= 20°); CM chung.<br>Do đó ΔCMB = ΔCMD (c.g.c), suy ra MB = MD và ∠CDM = ∠CBM = 10°.",
        "ΔCBD cân tại C có ∠BCD = 40° nên ∠CDB = ∠CBD = (180° − 40°) : 2 = 70°. Suy ra ∠MDB = 70° − 10° = 60°.",
        "Tam giác MBD có MB = MD và ∠MDB = 60° nên là tam giác đều: BD = BM và ∠MBD = 60°.",
        "Trong ΔABD: ∠BAD = 180° − ∠BAC = 80° (kề bù), ∠ADB = 70°, nên ∠ABD = 180° − 80° − 70° = 30° = ∠ABM.",
        "Xét ΔABM và ΔABD có: BM = BD; ∠ABM = ∠ABD (= 30°); AB chung.<br>Do đó ΔABM = ΔABD (c.g.c), suy ra ∠AMB = ∠ADB = 70°.",
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
        "a) Xét ΔMAB và ΔMDC có: MA = MD; ∠AMB = ∠DMC (đối đỉnh); MB = MC.<br>Do đó ΔMAB = ΔMDC (c.g.c), suy ra CD = AB và ∠MDC = ∠MAB.",
        "Hai góc ∠MDC, ∠MAB ở vị trí so le trong nên CD // AB. Mà AB ⊥ AC nên CD ⊥ AC.",
        "b) Gọi K là giao điểm của đường thẳng IE với đường thẳng AB. Vì IK // AC và AC ⊥ AB nên IK ⊥ AB tại K. Đường thẳng CI trùng với đường thẳng CD nên CI // AK.",
        "Xét ΔACI và ΔIKA có: ∠CAI = ∠KIA (so le trong, AC // IK); AI là cạnh chung; ∠CIA = ∠KAI (so le trong, CI // AK).<br>Do đó ΔACI = ΔIKA (g.c.g), suy ra AK = CI = CA.",
        "Ta có ∠KAE = ∠BAH (hai góc đối đỉnh, vì K nằm trên tia đối của tia AB và E nằm trên tia đối của tia AH). Trong ΔABH vuông tại H và ΔABC vuông tại A: ∠BAH = 90° − ∠B = ∠ACB. Suy ra ∠KAE = ∠ACB.",
        "Xét hai tam giác vuông AKE (vuông tại K) và CAB (vuông tại A) có: cạnh góc vuông AK = CA; góc nhọn kề ∠KAE = ∠ACB.<br>Do đó ΔAKE = ΔCAB (cạnh góc vuông – góc nhọn kề), suy ra AE = CB."
      ],
      dap: "CD // AB, CD ⊥ AC; AE = BC.",
      loi: "Dùng luôn AK = CI mà chưa chứng minh (phải qua hai tam giác ACI và IKA bằng nhau).",
      mix: [12, 13, 14, 15]
    }
  ];


  /* ================= Chuẩn hóa theo khuôn Bài 16 (27/11/2026) =================
     Chia theo dạng như Bài 16 (thầy chốt lại 27/11/2026), khai báo ở TL_DATA.dang.
     - pt: phân tích ngược cho bài Thông hiểu, Vận dụng (mỗi câu a, b, c một sơ đồ; số trong [] là bước của lời giải).
     - hieu, nguoc, nhin: giải theo 4 bước cho bài mẫu mỗi dạng (vd3, vd2, vd1) và mọi bài Dành cho HSG.
     - phu: điểm, đoạn, kí hiệu kẻ thêm; hình của đề (lúc đầu phân tích) không vẽ chúng.
     - Bài tự luyện: cuối mỗi dạng (dang[].tl). */
  var THEM = {
    th1: {
      pt: [
        { ten: "Câu a", dich: "ΔOAM = ΔOBM", sd: [["Cạnh huyền OM chung; ∠AOM = ∠BOM (cạnh huyền – góc nhọn)", [1]]], gt: "Oz là tia phân giác của ∠xOy, MA ⊥ Ox, MB ⊥ Oy" },
        { ten: "Câu b", dich: "MA = MB và OA = OB", sd: [["Các cặp cạnh tương ứng của ΔOAM = ΔOBM (câu a)", [2]]], gt: "Kết quả câu a" },
        { ten: "Câu c", dich: "OM là đường trung trực của AB", sd: [["O và M phân biệt, cùng nằm trên đường trung trực của AB", [3, 4]], ["OA = OB, MA = MB (câu b)", [3]]], gt: "Kết quả câu b" }]
    },
    th2: {
      pt: [
        { ten: "Câu a", dich: "ΔABC = ΔABD", sd: [["AC = AD, BC = BD, AB là cạnh chung (c.c.c)", [1]]], gt: "AC = AD, BC = BD" },
        { ten: "Câu b", dich: "AB là tia phân giác của ∠CAD", sd: [["∠CAB = ∠DAB và tia AB nằm giữa hai tia AC, AD", [2]], ["Hai góc tương ứng của ΔABC = ΔABD (câu a)", [2]]], gt: "C, D khác phía đối với AB và kết quả câu a" },
        { ten: "Câu c", dich: "AB là đường trung trực của CD", sd: [["A và B phân biệt, cùng cách đều C và D", [3]]], gt: "AC = AD, BC = BD" }]
    },
    th3: {
      pt: [
        { ten: "Câu a", dich: "Tính ∠BAC và ∠BAD", sd: [["∠BAD = ∠BAC : 2 (AD là tia phân giác)", [1]], ["∠BAC = 180° − (∠B + ∠C)", [1]]], gt: "∠B = ∠C = 40°" },
        { ten: "Câu b", dich: "Tính ∠ADB và ∠ADC", sd: [["Tổng ba góc trong tam giác ABD và tam giác ACD", [2]], ["∠B = ∠C = 40°, ∠BAD = ∠CAD = 50° (câu a)", [1]]], gt: "∠B = ∠C = 40° và kết quả câu a" },
        { ten: "Câu c", dich: "ΔABD = ΔACD; AB = AC, DB = DC", sd: [["Các cặp cạnh tương ứng của hai tam giác bằng nhau", [4]], ["∠BAD = ∠CAD, AD chung, ∠ADB = ∠ADC (g.c.g)", [3]]], gt: "Kết quả câu a, b" }]
    },
    vd1: {
      /* Bài mẫu dạng 3: giải theo 4 bước. */
      hieu: { gt: "ΔABC, AB < AC; AD là tia phân giác của ∠A (D thuộc BC); E thuộc cạnh AC, AE = AB.", kl: "a) ΔABD = ΔAED và DB = DE. b) AD là đường trung trực của BE. c) Biết ∠ABC = 80°, ∠ACB = 40°, tính ∠EDC.",
        hoi: [
          ["Vì sao lấy được điểm E trên cạnh AC?", "Vì AB < AC nên đoạn AE = AB nằm gọn trên cạnh AC."],
          ["Trên hình có những cặp yếu tố nào bằng nhau?", "AB = AE (đề cho), ∠BAD = ∠EAD (AD là tia phân giác), AD là cạnh chung."]] },
      nguoc: [
        { ten: "Câu a", dich: "ΔABD = ΔAED và DB = DE",
          sd: [["AB = AE, ∠BAD = ∠EAD, AD chung (c.g.c)", [1]]],
          gt: "AE = AB, AD là tia phân giác của ∠A",
          ket: "ΔABD = ΔAED (c.g.c) nên DB = DE.",
          buoc: [
            { hoi: "Hai tam giác ABD và AED đã có những yếu tố nào bằng nhau? Đủ trường hợp nào?",
              nho: "Trường hợp c.g.c: hai cạnh và góc xen giữa.",
              chon: [
                ["AB = AE, ∠BAD = ∠EAD, AD chung: đủ c.g.c", true, "Đúng."],
                ["AB = AE, DB = DE, AD chung: c.c.c", false, "DB = DE chưa biết; đó là điều cần suy ra."]],
              dat: "AB = AE, ∠BAD = ∠EAD, AD chung" }] },
        { ten: "Câu b", dich: "AD là đường trung trực của BE",
          sd: [["A và D phân biệt, cùng cách đều B và E", [2]], ["AB = AE (đề cho), DB = DE (câu a)", [2]]],
          gt: "Kết quả câu a",
          ket: "A và D cùng nằm trên đường trung trực của BE nên AD là đường trung trực của BE.",
          buoc: [
            { hoi: "Muốn chứng minh AD là đường trung trực của BE, em chọn cách nào?",
              nho: "Hai điểm phân biệt cùng cách đều hai đầu mút của một đoạn thẳng thì đường thẳng đi qua hai điểm đó là đường trung trực của đoạn thẳng.",
              chon: [
                ["Chỉ ra A và D đều cách đều B, E: AB = AE, DB = DE", true, "Đúng. Cách này không cần tìm trung điểm của BE."],
                ["Chứng minh AD vuông góc với BE tại trung điểm của BE", false, "Đi được nhưng phải gọi thêm giao điểm và chứng minh thêm hai tam giác bằng nhau."]],
              dat: "A, D cùng cách đều B và E" }] },
        { ten: "Câu c", dich: "Tính ∠EDC",
          sd: [["∠EDC = 180° − (∠DEC + ∠C)", [4]], ["∠DEC = 180° − ∠AED (hai góc kề bù)", [3]], ["∠AED = ∠ABD = 80° (câu a)", [3]]],
          gt: "∠ABC = 80°, ∠ACB = 40° và kết quả câu a",
          ket: "∠DEC = 100°, nên ∠EDC = 180° − 100° − 40° = 40°.",
          buoc: [
            { hoi: "∠EDC là góc của tam giác EDC. Đã biết góc nào, còn thiếu góc nào?",
              nho: "Tổng ba góc của một tam giác bằng 180°.",
              chon: [
                ["Đã biết ∠C = 40°, còn thiếu ∠DEC", true, "Đúng."],
                ["Thiếu cả ∠C", false, "∠C = ∠ACB = 40° đề đã cho."]],
              dat: "Tính ∠DEC" },
            { hoi: "∠DEC liên quan gì với các góc ở câu a?",
              nho: "Hai góc kề bù có tổng 180°; hai tam giác bằng nhau thì các góc tương ứng bằng nhau.",
              chon: [
                ["∠DEC kề bù với ∠AED, mà ∠AED = ∠ABD = 80° (câu a)", true, "Đúng: ∠DEC = 100°."],
                ["∠DEC = ∠ABD = 80°", false, "∠ABD bằng ∠AED; còn ∠DEC kề bù với ∠AED."]],
              dat: "∠AED = ∠ABD = 80° (câu a)" }] }],
      nhin: [
        ["Thử lại: tổng ba góc có đỉnh D nằm về một phía của đường thẳng BC.", "∠BAD = 30°, ∠ADB = 180° − 80° − 30° = 70°, ∠ADE = ∠ADB = 70°, ∠EDC = 40°: 70° + 70° + 40° = 180°. Đúng."],
        ["Tam giác EDC có ∠EDC = ∠ECD = 40°. Em suy ra được gì?", "Tam giác EDC cân tại E: ED = EC, nên DB = DE = EC."]]
    },
    vd2: {
      /* Bài mẫu Vận dụng: giải theo 4 bước. */
      hieu: { gt: "ΔABC vuông cân tại A; đường thẳng d đi qua A, không cắt đoạn BC; BH ⊥ d tại H, CK ⊥ d tại K.", kl: "a) ∠HAB = ∠KCA. b) ΔAHB = ΔCKA. c) HK = BH + CK.",
        hoi: [
          ["Trên đường thẳng d, ba góc nào ở đỉnh A ghép lại thành góc bẹt?", "∠HAB, ∠BAC và ∠CAK; mà ∠BAC = 90° nên ∠HAB + ∠CAK = 90°."],
          ["Đoạn HK trên đường thẳng d gồm những phần nào?", "A nằm giữa H và K nên HK = HA + AK."]] },
      nguoc: [
        { ten: "Câu a", dich: "∠HAB = ∠KCA",
          sd: [["∠HAB và ∠KCA cộng với ∠CAK đều được 90°", [1, 2]]],
          gt: "∠BAC = 90°, CK ⊥ d",
          ket: "∠HAB = 90° − ∠CAK = ∠KCA.",
          buoc: [
            { hoi: "Hai góc ∠HAB và ∠KCA ở hai đỉnh khác nhau. Có góc nào cộng với mỗi góc đó đều được 90° không?",
              nho: "Trong tam giác vuông, hai góc nhọn có tổng bằng 90°.",
              chon: [
                ["∠CAK: ∠HAB + ∠CAK = 90° (vì ∠BAC = 90°) và ∠KCA + ∠CAK = 90° (tam giác CKA vuông tại K)", true, "Đúng. Vậy ∠HAB = ∠KCA."],
                ["∠BAC", false, "∠BAC = 90°; cộng thêm một góc nhọn thì lớn hơn 90°."]],
              dat: "∠HAB + ∠CAK = 90° = ∠KCA + ∠CAK" }] },
        { ten: "Câu b", dich: "ΔAHB = ΔCKA",
          sd: [["Cạnh huyền AB = CA; góc nhọn ∠HAB = ∠KCA (câu a)", [3]]],
          gt: "ΔABC vuông cân tại A và kết quả câu a",
          ket: "ΔAHB = ΔCKA (cạnh huyền – góc nhọn).",
          buoc: [
            { hoi: "Cạnh huyền của hai tam giác vuông AHB và CKA là cạnh nào? Chúng có bằng nhau không?",
              nho: "Cạnh huyền là cạnh đối diện với góc vuông.",
              chon: [
                ["AB và CA, bằng nhau vì tam giác ABC vuông cân tại A", true, "Đúng. Thêm ∠HAB = ∠KCA (câu a) là đủ: cạnh huyền – góc nhọn."],
                ["AH và CK", false, "AH, CK là cạnh góc vuông; cạnh huyền đối diện với góc vuông ở H và K."]],
              dat: "AB = CA và ∠HAB = ∠KCA (câu a)" }] },
        { ten: "Câu c", dich: "HK = BH + CK",
          sd: [["HK = HA + AK", [4]], ["HA = CK, AK = BH (câu b)", [4]]],
          gt: "Kết quả câu b",
          ket: "HK = HA + AK = CK + BH.",
          buoc: [
            { hoi: "HK = HA + AK. Hai đoạn HA, AK bằng đoạn nào? Chú ý ghép đúng cặp tương ứng.",
              nho: "Viết ΔAHB = ΔCKA: A ↔ C, H ↔ K, B ↔ A.",
              chon: [
                ["AH = CK và HB = KA", true, "Đúng. Vậy HK = CK + BH."],
                ["AH = AK và BH = CK", false, "Ghép sai: AH ứng với CK, HB ứng với KA."]],
              dat: "AH = CK, HB = KA (câu b)" }] }],
      nhin: [
        ["Thử lại khi d song song với BC.", "Khi đó ∠HAB = ∠ABC = 45° (so le trong), các tam giác AHB, CKA vuông cân: BH = AH = AK = CK, nên HK = 2 · BH = BH + CK. Đúng."],
        ["Nếu d cắt đoạn BC (B, C nằm khác phía đối với d) thì sao?", "Vẫn có ΔAHB = ΔCKA, nhưng H và K nằm cùng phía đối với A, nên HK bằng hiệu của hai đoạn BH và CK (đoạn dài trừ đoạn ngắn)."]]
    },
    vd3: {
      /* Bài mẫu Vận dụng: giải theo 4 bước. */
      hieu: { gt: "ΔABC cân tại A, ∠A = 36°; BD là tia phân giác của ∠B (D thuộc AC).", kl: "a) Tính ∠ABD, ∠DBC, ∠BDC. b) Tam giác ABD và tam giác BDC cân. c) AD = BC.",
        hoi: [
          ["Góc nào tính được ngay?", "∠ABC = ∠ACB = (180° − 36°) : 2 = 72°."],
          ["AD và BC có cùng nằm trong một tam giác không?", "Không. Phải tìm một đoạn trung gian bằng cả hai."]] },
      nguoc: [
        { ten: "Câu c (cả bài)", dich: "AD = BC",
          sd: [["AD = BD và BD = BC", [5]], ["Tam giác ABD cân tại D; tam giác BDC cân tại B", [3, 4]], ["∠DAB = ∠DBA = 36°; ∠BDC = ∠BCD = 72°", [1, 2]]],
          gt: "∠A = 36°, AB = AC, BD là tia phân giác của ∠B",
          ket: "AD = BD = BC. Đi ngược như vậy, em tính luôn được các góc của câu a và có câu b.",
          buoc: [
            { hoi: "AD và BC nằm xa nhau. Đoạn nào trên hình có chung đầu mút với cả AD và BC?",
              chon: [
                ["BD: chung đầu D với AD, chung đầu B với BC", true, "Đúng. Thử chứng minh AD = BD và BD = BC."],
                ["AC", false, "AC chứa AD, nhưng AC = AB, mà AB lớn hơn BC; không dùng được."]],
              dat: "AD = BD và BD = BC" },
            { hoi: "Muốn AD = BD thì tam giác ABD phải thế nào? Kiểm tra các góc.",
              nho: "Tam giác có hai góc bằng nhau là tam giác cân; đỉnh là đỉnh còn lại.",
              chon: [
                ["Tam giác ABD cân tại D: ∠DAB = 36° và ∠DBA = 72° : 2 = 36°", true, "Đúng."],
                ["Tam giác ABD cân tại A", false, "Khi đó AD = AB, nhưng D nằm giữa A và C nên AD < AC = AB."]],
              dat: "Tam giác ABD cân tại D (∠DAB = ∠DBA = 36°)" },
            { hoi: "Muốn BD = BC thì tam giác BDC phải cân tại đỉnh nào? Tính ∠BDC.",
              chon: [
                ["Cân tại B: ∠BDC = 180° − 36° − 72° = 72° = ∠BCD", true, "Đúng."],
                ["Cân tại D", false, "Cân tại D thì ∠DBC = ∠DCB, nhưng 36° ≠ 72°."]],
              dat: "Tam giác BDC cân tại B (∠BDC = ∠BCD = 72°)" }] }],
      nhin: [
        ["Thử lại: tổng ba góc của tam giác ABD.", "∠ADB = 180° − 72° = 108° (kề bù với ∠BDC); 36° + 36° + 108° = 180°. Đúng."],
        ["Tam giác BDC có các góc 36°, 72°, 72° giống tam giác ABC. Nếu kẻ tiếp tia phân giác của ∠BCD cắt BD tại E thì em đoán được gì?", "Làm như trên với tam giác BDC (đỉnh B): EB = EC = CD."]]
    },
    vd4: {
      pt: [
        { ten: "Câu a", dich: "AB = CE và AB // CE", sd: [["AB = EC; ∠MBA = ∠MCE (so le trong)", [2]], ["ΔMAB = ΔMEC (c.g.c)", [1]]], gt: "MB = MC, MA = ME" },
        { ten: "Câu b", dich: "AH = EK", sd: [["ΔMHA = ΔMKE (cạnh huyền – góc nhọn)", [3]], ["Cạnh huyền MA = ME; ∠AMH = ∠EMK (đối đỉnh)", [3]]], gt: "AH ⊥ BC, EK ⊥ BC, MA = ME" },
        { ten: "Câu c", dich: "M là trung điểm của HK", sd: [["MH = MK và M nằm giữa H, K", [4]], ["ΔMHA = ΔMKE (câu b)", [4]]], gt: "Kết quả câu b" }]
    },
    vd5: {
      pt: [
        { ten: "Câu a", dich: "Tam giác ABD cân, tính ∠ABD", sd: [["DA = DB nên ∠ABD = ∠BAD", [1]], ["D nằm trên đường trung trực của AB", [1]]], gt: "∠A = 40°, D thuộc đường trung trực của AB" },
        { ten: "Câu b", dich: "Tính ∠DBC", sd: [["∠DBC = ∠ABC − ∠ABD", [2]], ["∠ABC = 70°, ∠ABD = 40° (câu a)", [2]]], gt: "ΔABC cân tại A, ∠A = 40°" },
        { ten: "Câu c", dich: "Chu vi ΔBDC = AB + BC", sd: [["BD + DC = AD + DC = AC = AB", [3]], ["BD = AD (câu a)", [3]]], gt: "AB = AC và kết quả câu a" }]
    },

    /* ---------------- Dành cho HSG: giải theo 4 bước ---------------- */
    hsg1: {
      phu: ["F", "BE"],
      hieu: { gt: "ΔABC; BD, CE là tia phân giác của ∠B, ∠C (D thuộc AC, E thuộc AB); BD cắt CE tại I; BE + CD = BC.", kl: "Tính ∠BAC.",
        hoi: [
          ["Muốn tính ∠BAC, chỉ cần biết gì?", "Biết ∠ABC + ∠ACB, hoặc ∠IBC + ∠ICB (bằng nửa tổng đó), hoặc ∠BIC."],
          ["Giả thiết BE + CD = BC gợi em làm gì trên đoạn BC?", "Chia BC thành hai đoạn: một đoạn bằng BE, đoạn còn lại bằng CD."],
          ["Thử với tam giác đều: có thỏa mãn đề không?", "Có: khi đó D, E là trung điểm nên BE + CD = BC. Tam giác đều có ∠A = 60°; đó là dự đoán."]] },
      nguoc: [
        { ten: "Tính ∠BAC", dich: "Tính ∠BAC",
          sd: [
            ["∠BAC = 180° − 2 · (∠IBC + ∠ICB) = 180° − 2 · 60°", [6, 7]],
            ["∠BIC = 120°, vì ∠BIE = 60°", [5, 6]],
            ["∠BIE = ∠BIF = ∠FIC = ∠CID; ba góc ∠BIE, ∠BIF, ∠FIC ghép thành góc bẹt", [2, 3, 4, 5]],
            ["Lấy F trên BC: BF = BE, CF = CD", [1]]],
          gt: "BD, CE là tia phân giác; BE + CD = BC",
          ket: "∠BIE = 60°, ∠BIC = 120°, nên ∠BAC = 60°.",
          buoc: [
            { hoi: "∠BAC liên hệ thế nào với ∠BIC?",
              nho: "BI, CI là tia phân giác nên ∠IBC + ∠ICB = (∠ABC + ∠ACB) : 2.",
              chon: [
                ["∠IBC + ∠ICB = 180° − ∠BIC và ∠ABC + ∠ACB = 2 · (∠IBC + ∠ICB): biết ∠BIC thì tính được ∠BAC", true, "Đúng. Cần tính ∠BIC."],
                ["∠BAC = ∠BIC", false, "Không đúng: tam giác đều có ∠A = 60° nhưng ∠BIC = 120°."]],
              dat: "Tính ∠BIC" },
            { ve: 1, hoi: "Dùng giả thiết BE + CD = BC: em lấy điểm F trên BC thế nào?",
              nho: "Hai tam giác có hai cạnh và góc xen giữa bằng nhau thì bằng nhau.",
              chon: [
                ["Lấy F trên BC với BF = BE; khi đó CF = CD", true, "Đúng. Ta có ΔBEI = ΔBFI và ΔCDI = ΔCFI (c.g.c)."],
                ["Lấy F là trung điểm của BC", false, "Chỉ dùng được khi BE = CD."]],
              dat: "F thuộc BC: BF = BE, CF = CD" },
            { hoi: "Từ ΔBEI = ΔBFI và ΔCDI = ΔCFI, những góc nào ở đỉnh I bằng nhau?",
              nho: "Hai góc đối đỉnh thì bằng nhau.",
              chon: [
                ["∠BIE = ∠BIF, ∠CID = ∠CIF, lại có ∠BIE = ∠CID (đối đỉnh): bốn góc bằng nhau", true, "Đúng. Ba góc ∠BIE, ∠BIF, ∠FIC ghép lại thành góc bẹt EIC, nên mỗi góc bằng 60°."],
                ["∠BIE = ∠BIC", false, "∠BIE và ∠BIC kề bù chứ không bằng nhau."]],
              dat: "∠BIE = ∠BIF = ∠FIC = ∠CID = 60°" }] }],
      nhin: [
        ["Vì sao lấy được F trên cạnh BC?", "Vì BE < BE + CD = BC nên trên cạnh BC lấy được F với BF = BE."],
        ["Bài toán đảo: nếu ∠BAC = 60° thì BE + CD = BC. Em thử chứng minh.", "∠BAC = 60° nên ∠IBC + ∠ICB = 60°, ∠BIC = 120°, ∠BIE = ∠CID = 60°. Kẻ tia phân giác IF của ∠BIC (F thuộc BC): ∠BIF = ∠FIC = 60°. ΔBEI = ΔBFI (g.c.g) cho BF = BE; ΔCDI = ΔCFI (g.c.g) cho CF = CD. Cộng lại: BE + CD = BC."]]
    },
    hsg2: {
      hieu: { gt: "ΔABC có ba góc nhọn; AM ⊥ AB, AM = AB (M, C khác phía đối với AB); AN ⊥ AC, AN = AC (N, B khác phía đối với AC); AH ⊥ BC tại H; đường thẳng AH cắt MN tại I; MP, NQ vuông góc với đường thẳng AH.", kl: "a) MP = AH = NQ. b) I là trung điểm của MN. c) BC = 2 · AI.",
        hoi: [
          ["Trên hình có những cặp đoạn thẳng vừa bằng nhau vừa vuông góc nào?", "AM = AB, AM ⊥ AB; AN = AC, AN ⊥ AC."],
          ["MP và AH là cạnh của hai tam giác vuông nào?", "ΔMPA (vuông tại P) và ΔAHB (vuông tại H); hai cạnh huyền AM và BA bằng nhau."]] },
      nguoc: [
        { ten: "Câu a", dich: "MP = AH = NQ",
          sd: [["ΔMPA = ΔAHB và ΔNQA = ΔAHC (cạnh huyền – góc nhọn)", [2, 3]], ["∠MAP = ∠ABH (cùng cộng với ∠BAH được 90°)", [1]]],
          gt: "AM = AB, AM ⊥ AB, AN = AC, AN ⊥ AC, AH ⊥ BC",
          ket: "MP = AH và NQ = AH.",
          buoc: [
            { hoi: "MP = AH: tìm hai tam giác vuông chứa MP và AH có cạnh huyền bằng nhau.",
              chon: [
                ["ΔMPA và ΔAHB: cạnh huyền AM = BA", true, "Đúng. Còn cần một cặp góc nhọn bằng nhau."],
                ["ΔMPA và ΔAHC", false, "Cạnh huyền AM = AB, không bằng AC."]],
              dat: "ΔMPA = ΔAHB" },
            { hoi: "Cặp góc nhọn nào bằng nhau? Vì sao?",
              nho: "Ba góc ∠MAP, ∠MAB, ∠BAH ghép thành góc bẹt; trong tam giác vuông, hai góc nhọn có tổng bằng 90°.",
              chon: [
                ["∠MAP = ∠ABH: cả hai cộng với ∠BAH đều được 90°", true, "Đúng. Làm tương tự với tam giác NQA và AHC."],
                ["∠MAP = ∠BAH", false, "∠MAP + ∠BAH = 90°; hai góc chỉ bằng nhau khi mỗi góc bằng 45°."]],
              dat: "∠MAP = ∠ABH" }] },
        { ten: "Câu b", dich: "IM = IN",
          sd: [["ΔIPM = ΔIQN (cạnh góc vuông – góc nhọn kề)", [5]], ["MP = NQ (câu a); ∠PMI = ∠QNI (so le trong, MP // NQ)", [4, 5]]],
          gt: "Kết quả câu a",
          ket: "IM = IN: I là trung điểm của MN.",
          buoc: [
            { hoi: "IM, IN là cạnh của hai tam giác vuông nào? Đã có gì?",
              chon: [
                ["ΔIPM và ΔIQN: MP = NQ (câu a), vuông tại P và Q", true, "Đúng. Cần thêm một góc nhọn kề cạnh MP, NQ."],
                ["ΔAIM và ΔAIN", false, "Chưa biết AM = AN, và nói chung AM ≠ AN."]],
              dat: "ΔIPM = ΔIQN" },
            { hoi: "Góc nhọn nào kề cạnh MP, NQ và bằng nhau?",
              nho: "Hai đường thẳng cùng vuông góc với một đường thẳng thì song song với nhau.",
              chon: [
                ["∠PMI = ∠QNI: so le trong, vì MP // NQ", true, "Đúng."],
                ["∠MIP = ∠NIQ (đối đỉnh)", false, "Hai góc này bằng nhau, nhưng không kề cạnh MP, NQ; dùng ∠PMI, ∠QNI để có trường hợp cạnh góc vuông – góc nhọn kề."]],
              dat: "∠PMI = ∠QNI (MP // NQ)" }] },
        { ten: "Câu c", dich: "BC = 2 · AI",
          sd: [["AP + AQ = 2 · AI (I là trung điểm của PQ)", [7, 8]], ["BC = BH + HC = AP + AQ", [6]]],
          gt: "Kết quả câu a, b",
          ket: "BC = AP + AQ = 2 · AI.",
          buoc: [
            { hoi: "BC = BH + HC. Hai đoạn BH, HC bằng đoạn nào trên đường thẳng AH?",
              chon: [
                ["BH = AP, HC = AQ (câu a)", true, "Đúng. Còn cần AP + AQ = 2 · AI."],
                ["BH = MP", false, "MP = AH, không phải BH."]],
              dat: "BC = AP + AQ" },
            { hoi: "Vì sao AP + AQ = 2 · AI?",
              chon: [
                ["IP = IQ (câu b) nên I là trung điểm của PQ; P, Q cùng nằm trên tia đối của tia AH, nên AP + AQ = (AI − IP) + (AI + IQ) = 2 · AI", true, "Đúng."],
                ["Vì AP = AQ", false, "AP = BH và AQ = CH chỉ bằng nhau khi AB = AC."]],
              dat: "I là trung điểm của PQ" }] }],
      nhin: [
        ["Thử lại khi AB = AC.", "Khi đó BH = CH, các điểm P, Q, I trùng nhau và AI = AP = BH = BC : 2. Đúng."],
        ["Điều gì đáng nhớ ở bài này?", "Đường thẳng AH đi qua trung điểm I của MN, và AI bằng nửa BC."]]
    },
    hsg3: {
      hieu: { gt: "M nằm giữa A và B; tam giác AMC và BMD đều, cùng một nửa mặt phẳng bờ AB; I, K là trung điểm của AD, BC.", kl: "a) AD = CB. b) MI = MK. c) Tam giác MIK đều.",
        hoi: [
          ["Tính ∠CMD, ∠AMD và ∠CMB.", "∠CMD = 180° − 60° − 60° = 60°; ∠AMD = ∠CMB = 120°."],
          ["AD và CB là cạnh của hai tam giác nào có chung đỉnh M?", "Tam giác AMD và tam giác CMB."]] },
      nguoc: [
        { ten: "Câu a", dich: "AD = CB",
          sd: [["ΔAMD = ΔCMB (c.g.c)", [2]], ["AM = CM, ∠AMD = ∠CMB = 120°, MD = MB", [1, 2]]],
          gt: "Tam giác AMC, BMD đều",
          ket: "AD = CB.",
          buoc: [
            { hoi: "AD, CB là cạnh của hai tam giác nào, mỗi tam giác chứa một cạnh của mỗi tam giác đều?",
              nho: "Tam giác đều có ba cạnh bằng nhau, ba góc bằng 60°.",
              chon: [
                ["Tam giác AMD và tam giác CMB: AM = CM, MD = MB", true, "Đúng. Còn cần góc xen giữa."],
                ["Tam giác ACD và tam giác BCD", false, "Ngoài cạnh chung CD, chưa biết cặp cạnh nào của hai tam giác này bằng nhau."]],
              dat: "ΔAMD = ΔCMB" },
            { hoi: "Vì sao hai góc xen giữa ∠AMD và ∠CMB bằng nhau?",
              chon: [
                ["Mỗi góc bằng 180° − 60° = 120° (kề bù với một góc của tam giác đều)", true, "Đúng."],
                ["Vì chúng là hai góc đối đỉnh", false, "∠AMD và ∠CMB không đối đỉnh."]],
              dat: "∠AMD = ∠CMB = 120°" }] },
        { ten: "Câu b", dich: "MI = MK",
          sd: [["ΔAMI = ΔCMK (c.g.c)", [4]], ["AM = CM, ∠MAI = ∠MCK (câu a), AI = CK (nửa của AD = CB)", [3, 4]]],
          gt: "Kết quả câu a",
          ket: "MI = MK.",
          buoc: [
            { hoi: "MI, MK là cạnh của hai tam giác nào? Kiểm tra đủ ba yếu tố.",
              chon: [
                ["Tam giác AMI và CMK: AM = CM; AI = CK vì AD = CB; ∠MAI = ∠MCK (hai góc tương ứng ở câu a)", true, "Đúng: ΔAMI = ΔCMK (c.g.c)."],
                ["Tam giác DMI và BMK", false, "Hướng này cũng đi được (MD = MB, DI = BK, ∠MDI = ∠MBK). Em để dành cho bước 4."]],
              dat: "ΔAMI = ΔCMK" }] },
        { ten: "Câu c", dich: "Tam giác MIK đều",
          sd: [["MI = MK và ∠IMK = 60°", [5, 6, 7]], ["∠IMK = ∠AMC, vì ∠CMK = ∠AMI (câu b)", [5, 6]]],
          gt: "Kết quả câu b",
          ket: "∠IMK = 60° nên tam giác MIK đều.",
          buoc: [
            { hoi: "Đã có MI = MK. Còn thiếu gì để tam giác MIK đều?",
              nho: "Tam giác cân có một góc bằng 60° là tam giác đều.",
              chon: [
                ["Một góc bằng 60°, chẳng hạn ∠IMK", true, "Đúng."],
                ["Chứng minh MI = IK", false, "Khó chứng minh trực tiếp; dùng góc 60° nhanh hơn."]],
              dat: "∠IMK = 60°" },
            { hoi: "∠IMK ghép từ những góc nào? Thay ∠CMK bằng góc nào?",
              chon: [
                ["Như hình (MA ≥ MB): ∠IMK = ∠IMC + ∠CMK = ∠IMC + ∠AMI = ∠AMC = 60° (vì ∠CMK = ∠AMI, câu b)", true, "Đúng. Nếu MA < MB thì các tia đổi chỗ: ∠IMK = ∠CMK − ∠CMI = ∠AMI − ∠CMI = ∠AMC, vẫn bằng 60°."],
                ["∠IMK = ∠CMD vì nhìn hình thấy bằng nhau", false, "Kết quả cũng là 60°, nhưng nhìn hình không phải lí do."]],
              dat: "∠CMK = ∠AMI (câu b)" }] }],
      nhin: [
        ["Kết quả có thay đổi khi M di chuyển giữa A và B không?", "Không: dù M ở đâu giữa A và B, tam giác MIK luôn đều."],
        ["Cách khác cho câu b: dùng tam giác DMI và BMK. Em thử nhé.", "Từ ΔAMD = ΔCMB: ∠MDA = ∠MBC. Hai tam giác DMI và BMK có MD = MB, ∠MDI = ∠MBK, DI = BK (nửa của AD = CB), nên bằng nhau (c.g.c), suy ra MI = MK."]]
    },
    hsg4: {
      phu: ["D", "CB"],
      hieu: { gt: "ΔABC cân tại A, ∠A = 100°; M nằm trong tam giác, ∠MBC = 10°, ∠MCB = 20°.", kl: "Tính ∠AMB.",
        hoi: [
          ["Tính các góc ở B và C.", "∠B = ∠C = 40°; ∠ABM = 30°; ∠MCA = 20° = ∠MCB, nên CM là tia phân giác của ∠ACB."],
          ["Tam giác ABM mới biết ∠ABM = 30°. Có cặp cạnh nào bằng nhau không?", "Chưa có. Phải tạo thêm hình."]] },
      nguoc: [
        { ten: "Tính ∠AMB", dich: "Tính ∠AMB",
          sd: [
            ["∠AMB = ∠ADB = 70° (ΔABM = ΔABD, c.g.c)", [6, 7]],
            ["BM = BD (tam giác MBD đều); ∠ABM = ∠ABD = 30°", [4, 5, 6]],
            ["ΔCMB = ΔCMD (c.g.c) nên MB = MD, ∠CDM = 10°", [3]],
            ["Lấy D trên tia CA với CD = CB", [2, 8]]],
          gt: "∠A = 100°, AB = AC, ∠MBC = 10°, ∠MCB = 20°",
          ket: "∠AMB = ∠ADB = 70°.",
          buoc: [
            { ve: 1, hoi: "CM là tia phân giác của ∠ACB. Dựa vào tia phân giác đó, em lấy trên tia CA một điểm D thế nào để có hai tam giác bằng nhau?",
              nho: "Hai tam giác có hai cạnh và góc xen giữa bằng nhau thì bằng nhau.",
              chon: [
                ["D trên tia CA với CD = CB: ΔCMB = ΔCMD (c.g.c), nên MD = MB và ∠CDM = ∠CBM = 10°", true, "Đúng."],
                ["D là trung điểm của AC", false, "Không tạo được cặp tam giác bằng nhau với tam giác CMB."]],
              dat: "D thuộc tia CA, CD = CB: MD = MB, ∠CDM = 10°" },
            { hoi: "Tam giác MBD có MB = MD. Tính ∠MDB.",
              nho: "Tam giác CBD cân tại C có góc ở đỉnh 40°.",
              chon: [
                ["∠CDB = (180° − 40°) : 2 = 70°, nên ∠MDB = 70° − 10° = 60°: tam giác MBD đều, BD = BM", true, "Đúng."],
                ["∠MDB = 70°", false, "Phải trừ đi ∠CDM = 10°."]],
              dat: "Tam giác MBD đều: BD = BM" },
            { hoi: "So sánh tam giác ABM và tam giác ABD.",
              chon: [
                ["BM = BD, AB chung, ∠ABM = ∠ABD = 30° (∠ABD = 180° − 80° − 70°): ΔABM = ΔABD (c.g.c)", true, "Đúng. Suy ra ∠AMB = ∠ADB = 70°."],
                ["ΔABM = ΔDBM", false, "Không đủ yếu tố: chưa biết AM = DM hay ∠ABM = ∠DBM."]],
              dat: "ΔABM = ΔABD (c.g.c)" }] }],
      nhin: [
        ["Thử lại: tính các góc còn lại quanh điểm M.", "∠BMC = 180° − 10° − 20° = 150°, ∠AMC = 360° − 150° − 70° = 140°. Trong tam giác AMC: ∠MAC = 180° − 140° − 20° = 20°, nên ∠BAM = 100° − 20° = 80°; tam giác ABM có 80° + 30° + 70° = 180°. Hợp lí."],
        ["Vì sao nghĩ đến điểm D?", "CM là tia phân giác của ∠ACB; lấy CD = CB thì chuyển được B sang D mà vẫn giữ MB = MD, rồi góc 60° xuất hiện."]]
    },
    hsg5: {
      phu: ["K", "AI"],
      hieu: { gt: "ΔABC vuông tại A; AH ⊥ BC; M là trung điểm của BC; D trên tia đối của tia MA, MD = MA; I trên tia đối của tia CD, CI = CA; IE // AC, E thuộc đường thẳng AH.", kl: "a) CD // AB và CD ⊥ AC. b) AE = BC.",
        hoi: [
          ["AE và BC: em muốn đặt chúng vào hai tam giác nào?", "BC là cạnh huyền của tam giác CAB vuông tại A. Cần một tam giác vuông có cạnh huyền AE và bằng tam giác CAB."],
          ["Đề cho CI = CA. Đoạn CA có vai trò gì trong tam giác CAB?", "CA là cạnh góc vuông, kề với góc C."]] },
      nguoc: [
        { ten: "Câu a", dich: "CD // AB và CD ⊥ AC",
          sd: [["∠MDC = ∠MAB (so le trong)", [2]], ["ΔMAB = ΔMDC (c.g.c)", [1]]],
          gt: "MA = MD, MB = MC",
          ket: "CD // AB; mà AB ⊥ AC nên CD ⊥ AC.",
          buoc: [
            { hoi: "Muốn CD // AB, cần cặp góc nào bằng nhau? Lấy từ đâu?",
              nho: "Nếu một đường thẳng cắt hai đường thẳng tạo thành hai góc so le trong bằng nhau thì hai đường thẳng đó song song.",
              chon: [
                ["∠MDC = ∠MAB (so le trong, cát tuyến AD): có từ ΔMAB = ΔMDC (c.g.c)", true, "Đúng."],
                ["∠ACD = ∠BAC", false, "Đó là điều chỉ suy ra sau khi biết CD ⊥ AC."]],
              dat: "ΔMAB = ΔMDC" }] },
        { ten: "Câu b", dich: "AE = BC",
          sd: [["ΔAKE = ΔCAB (cạnh góc vuông – góc nhọn kề)", [6]], ["AK = CA và ∠KAE = ∠ACB", [4, 5]], ["ΔACI = ΔIKA (g.c.g) cho AK = CI = CA", [4]], ["Gọi K là giao điểm của đường thẳng IE với đường thẳng AB", [3]]],
          gt: "CI = CA, IE // AC, AH ⊥ BC và kết quả câu a",
          ket: "ΔAKE = ΔCAB nên AE = CB.",
          buoc: [
            { ve: 1, hoi: "Muốn có một tam giác vuông với cạnh huyền AE, em kẻ thêm thế nào?",
              nho: "Nếu IE // AC và AC ⊥ AB thì IE ⊥ AB.",
              chon: [
                ["Kéo dài IE cắt đường thẳng AB tại K: tam giác AKE vuông tại K", true, "Đúng. Rồi so sánh tam giác AKE với tam giác CAB."],
                ["Kẻ EF ⊥ AC", false, "Cũng có tam giác vuông, nhưng không nối được với giả thiết CI = CA."]],
              dat: "K là giao điểm của IE với AB: tam giác AKE vuông tại K" },
            { hoi: "Tam giác AKE và CAB cần cặp cạnh góc vuông nào bằng nhau? Vì sao?",
              nho: "Nối AI. Hai đường thẳng song song tạo ra các cặp góc so le trong bằng nhau.",
              chon: [
                ["AK = CA: ΔACI = ΔIKA (g.c.g, AI chung) cho AK = CI, mà CI = CA", true, "Đúng."],
                ["KE = AB", false, "Chưa có cách so sánh trực tiếp KE với AB."]],
              dat: "AK = CI = CA (ΔACI = ΔIKA)" },
            { hoi: "Góc nhọn kề cạnh AK là ∠KAE. Nó bằng góc nào của tam giác CAB?",
              nho: "Hai góc đối đỉnh thì bằng nhau; trong tam giác vuông, hai góc nhọn có tổng bằng 90°.",
              chon: [
                ["∠KAE = ∠BAH (đối đỉnh) = 90° − ∠ABC = ∠ACB", true, "Đúng. ∠ACB kề cạnh CA của tam giác CAB."],
                ["∠KAE = ∠ABC", false, "∠KAE = ∠BAH, mà ∠BAH + ∠ABC = 90°."]],
              dat: "∠KAE = ∠ACB" }] }],
      nhin: [
        ["Bốn điểm A, C, I, K tạo thành hình gì?", "Có bốn góc vuông (∠CAK, ∠ACI, ∠AKI, ∠CIK) và AC = CI: đó là một hình vuông."],
        ["Từ ΔAKE = ΔCAB em còn suy ra được gì?", "KE = AB (hai cạnh tương ứng)."]]
    }
  };
  /* Gắn phần thêm vào từng bài; bài có phu: hình của đề (goc = true) bỏ điểm, đoạn kẻ thêm. */
  ITEMS.forEach(function (q) {
    var t = THEM[q.id]; if (!t) return;
    Object.keys(t).forEach(function (k) { if (k !== "phu") q[k] = t[k]; });
    if (t.phu && q.fig) { var f = q.fig; q.fig = function (goc) { PHU = goc ? t.phu : null; try { return f(); } finally { PHU = null; } }; }
  });



  window.TL_DATA = {
    bai: "c47",
    ten: "Bài tập cuối chương IV",
    items: ITEMS,
    /* Chia theo dạng (thầy chốt lại 27/11/2026: bài Luyện tập chung, Bài tập cuối chương cũng chia theo dạng như Bài 16).
       Mỗi dạng có phương pháp giải, bài xếp từ dễ đến khó, một bài mẫu giải theo 4 bước, bài tự luyện [đề, gợi ý, đáp số].
       Bài HSG không thuộc dạng nào: để riêng ở mục Dành cho HSG. */
    dang: [
      { ten: "Tính số đo góc, độ dài đoạn thẳng",
        pp: ["Tổng ba góc của một tam giác bằng 180°; hai góc kề bù có tổng 180°.",
             "Hai tam giác bằng nhau: viết đúng thứ tự các đỉnh tương ứng rồi đọc ra cạnh, góc tương ứng.",
             "Tam giác cân: hai cạnh bên bằng nhau, hai góc ở đáy bằng nhau; tam giác có hai góc bằng nhau là tam giác cân.",
             "Với tia phân giác: mỗi góc bằng nửa góc ban đầu. Tính từng bước, ghi lí do của mỗi số đo."],
        ids: ["nb1", "nb2", "nb3", "vd3"],
        tl: [
          ["Cho tam giác ABC vuông tại A có ∠B = 35°. Tính ∠C. Trên tia đối của tia BC lấy điểm D, tính ∠ABD.", "Hai góc nhọn của tam giác vuông có tổng 90°; ∠ABD kề bù với ∠ABC.", "∠C = 55°, ∠ABD = 145°."],
          ["Cho tam giác ABC cân tại A có ∠A = 50°. Kẻ BH ⊥ AC (H thuộc AC). Tính ∠HBC.", "Tính ∠C, rồi dùng tam giác HBC vuông tại H.", "∠HBC = 25°."],
          ["Cho tam giác ABC cân tại A có ∠A = 80°. Trên cạnh AB lấy điểm D, trên cạnh AC lấy điểm E sao cho AD = AE. Tính ∠ADE và chứng minh DE // BC.", "Tam giác ADE cân tại A.", "∠ADE = 50° = ∠ABC (hai góc đồng vị) nên DE // BC."]] },
      { ten: "Chứng minh hai tam giác bằng nhau, suy ra hai đoạn thẳng, hai góc bằng nhau",
        pp: ["Chọn hai tam giác chứa hai đoạn thẳng (hai góc) cần chứng minh bằng nhau.",
             "Tìm đủ ba yếu tố theo một trường hợp: c.c.c, c.g.c, g.c.g; tam giác vuông thì dùng thêm cạnh huyền – góc nhọn, cạnh huyền – cạnh góc vuông, hai cạnh góc vuông.",
             "Yếu tố hay dùng: cạnh chung, hai góc đối đỉnh, hai góc cùng cộng với một góc thành 90°, trung điểm.",
             "Muốn chứng minh tổng hai đoạn bằng một đoạn: tách đoạn dài thành hai phần rồi chứng minh từng phần bằng nhau."],
        ids: ["th3", "vd4", "vd2"],
        tl: [
          ["Cho ΔABC = ΔPQR, biết ∠A = 50°, ∠Q = 60°. Tính ∠R.", "∠B = ∠Q; ∠R = ∠C.", "∠R = 70°."],
          ["Cho tam giác ABC vuông cân tại A, M là trung điểm của BC. Chứng minh tam giác AMB vuông cân.", "ΔABM = ΔACM (c.c.c) nên AM ⊥ BC; ∠B = 45°.", "∠AMB = 90°, ∠MAB = ∠B = 45° nên tam giác AMB vuông cân tại M."]] },
      { ten: "Tia phân giác và đường trung trực",
        pp: ["Tia phân giác chia góc thành hai góc bằng nhau: dùng làm cặp góc bằng nhau khi chứng minh hai tam giác bằng nhau.",
             "Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai đầu mút; ngược lại, điểm cách đều hai đầu mút thì nằm trên đường trung trực.",
             "Chứng minh một đường thẳng là đường trung trực của một đoạn thẳng: chỉ ra hai điểm phân biệt của nó cùng cách đều hai đầu mút.",
             "Từ MA = MB suy ra tam giác MAB cân tại M, dùng để tính góc, chu vi."],
        ids: ["th1", "th2", "vd5", "vd1"],
        tl: [
          ["Cho góc xOy và tia phân giác Ot của nó. Trên Ox lấy điểm A, trên Oy lấy điểm B sao cho OA = OB; M là một điểm thuộc tia Ot. Chứng minh MA = MB.", "Xét tam giác OAM và OBM.", "ΔOAM = ΔOBM (c.g.c) nên MA = MB."],
          ["Cho tam giác ABC có ∠B = 70°, ∠C = 50°. Đường trung trực của AC cắt cạnh BC tại D. Tính ∠BAD.", "DA = DC nên ∠DAC = ∠C.", "∠BAD = 10°."]] }
    ],
    mau: { ids: ["vd3", "vd2", "vd1"], theoPhan: { tg: "vd3", cn: "vd3", bn: "vd2", tv: "vd2", tt: "vd1" } },
    _helpers: { foot: foot, cut: cut, add: add, pol: pol, iso: iso, tri: tri, rot: rot }
  };
})();
