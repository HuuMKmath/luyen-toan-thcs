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
      fig: function () { var A = [1.6, 3], B = [0, 0], C = [4.6, 0], M = [8.6, 3], N = [7, 0], P = [11.6, 0]; return draw({ P: { A: A, B: B, C: C, M: M, N: N, P: P }, fill: ["ABC", "MNP"], ang: [["A", "B", "C", "75°", 34], ["N", "M", "P", "60°", 38]], side: [["A", "B", "5 cm"]], pos: { A: "n", B: "sw", C: "se", M: "n", N: "sw", P: "se" }, w: 320, alt: "Hai tam giác bằng nhau ABC và MNP" }); },
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
      fig: function () { return fb(figPB({ lab: ["A", "B", "O", "M"], tick: false, alt: "Đường trung trực d của đoạn thẳng AB cắt AB tại O, M thuộc d" })); },
      steps: [
        "a) d là đường trung trực của AB nên d ⊥ AB tại O và OA = OB.",
        "Xét hai tam giác vuông MOA và MOB (vuông tại O) có: OA = OB; MO là cạnh chung.<br>Do đó ΔMOA = ΔMOB (hai cạnh góc vuông).",
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
        "a) Xét ΔOAC và ΔOBD có: OA = OB; ∠AOC = ∠BOD (hai góc đối đỉnh); OC = OD.<br>Do đó ΔOAC = ΔOBD (c.g.c), suy ra AC = BD.",
        "b) Từ câu a: ∠OAC = ∠OBD (hai góc tương ứng). Hai góc này ở vị trí so le trong (đối với hai đường thẳng AC, BD và cát tuyến AB), nên AC // BD.",
        "c) Tương tự câu a: ΔOAD = ΔOBC (c.g.c) nên AD = BC.",
        "Xét ΔACD và ΔBDC có: AC = BD (câu a); AD = BC; CD là cạnh chung.<br>Do đó ΔACD = ΔBDC (c.c.c)."
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
      fig: function () { var O = [0, 0], A = [5, 0], C = [10, 0], B = pol(O, 5, 55), D = pol(O, 10, 55), I = cut(A, D, B, C); return draw({ P: { O: O, A: A, C: C, B: B, D: D, I: I, x: [12.5, 0], y: pol(O, 12.5, 55) }, seg: ["Ox", "Oy", "AD", "BC", "OI"], tk: [["OA", 1], ["OB", 1]], pos: { O: "w", A: "s", C: "s", B: "nw", D: "nw", I: "e", x: "s", y: "w" }, alt: "Góc xOy, A và C trên Ox, B và D trên Oy, AD cắt BC tại I" }); },
      steps: [
        "a) Xét ΔOAD và ΔOBC có: OA = OB; ∠O là góc chung; OD = OC.<br>Do đó ΔOAD = ΔOBC (c.g.c), suy ra AD = BC.",
        "b) Từ câu a: ∠OAD = ∠OBC và ∠ODA = ∠OCB (các góc tương ứng). Suy ra ∠IAC = ∠IBD (kề bù với hai góc bằng nhau ∠OAD, ∠OBC).",
        "AC = OC − OA = OD − OB = BD.",
        "Xét ΔIAC và ΔIBD có: ∠IAC = ∠IBD; AC = BD; ∠ICA = ∠IDB (vì ∠OCB = ∠ODA).<br>Do đó ΔIAC = ΔIBD (g.c.g).",
        "c) Từ câu b: IA = IB. Xét ΔOAI và ΔOBI có: OA = OB; IA = IB; OI là cạnh chung.<br>Do đó ΔOAI = ΔOBI (c.c.c), suy ra ∠AOI = ∠BOI.",
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
        "a) Xét ΔACD và ΔCBE có: AC = CB (tam giác ABC đều); ∠CAD = ∠BCE (= 60°); AD = CE (giả thiết).<br>Do đó ΔACD = ΔCBE (c.g.c).",
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
        "a) Xét ΔMAB và ΔMEC có: MA = ME; ∠AMB = ∠EMC (hai góc đối đỉnh); MB = MC.<br>Do đó ΔMAB = ΔMEC (c.g.c).",
        "Suy ra AB = EC và ∠MAB = ∠MEC. Hai góc này ở vị trí so le trong nên AB // CE.",
        "b) Xét ΔABM và ΔACM có: AB = AC; BM = CM; AM là cạnh chung.<br>Do đó ΔABM = ΔACM (c.c.c), suy ra ∠AMB = ∠AMC.",
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
        "a) Xét hai tam giác vuông CAB và CAD có: AB = AD; CA là cạnh chung.<br>Do đó ΔCAB = ΔCAD (hai cạnh góc vuông), suy ra CB = CD.",
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
        "Trên cạnh BC lấy F sao cho BF = BA. Xét ΔABD và ΔFBD có: BA = BF; ∠ABD = ∠FBD; BD chung.<br>Do đó ΔABD = ΔFBD (c.g.c), suy ra DF = DA và ∠BFD = ∠BAD = 100°, nên ∠DFE = 80° (kề bù).",
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
        "Xét ΔABD và ΔACD có: AB = AC; BD = CD (tam giác BCD đều); AD chung.<br>Do đó ΔABD = ΔACD (c.c.c), suy ra ∠BAD = ∠CAD = 20° : 2 = 10°.",
        "Xét ΔBAM và ΔABD có: ∠BAM = ∠ABD (= 20°); AB là cạnh chung; ∠ABM = ∠BAD (= 10°).<br>Do đó ΔBAM = ΔABD (g.c.g).",
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
        "Xét ΔIDF và ΔIKC có: ∠IDF = ∠IKC (so le trong, DF // CK); DF = KC; ∠IFD = ∠ICK (so le trong).<br>Do đó ΔIDF = ΔIKC (g.c.g), suy ra ID = IK: I là trung điểm của DK.",
        "b) Qua B kẻ đường thẳng vuông góc với AB, qua C kẻ đường thẳng vuông góc với AC; hai đường thẳng này cắt nhau tại P (P cố định vì A, B, C cố định).",
        "∠PBC = 90° − 45° = 45° và ∠PCB = 90° − 45° = 45°, nên tam giác PBC cân tại P: PB = PC.",
        "Xét hai tam giác vuông PBD (vuông tại B) và PCK (vuông tại C) có: PB = PC; BD = CK.<br>Do đó ΔPBD = ΔPCK (hai cạnh góc vuông), suy ra PD = PK.",
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
        "a) Tia CO cắt đường thẳng BD tại E (E nằm trên tia đối của tia By). Xét hai tam giác vuông OAC và OBE có: OA = OB; ∠AOC = ∠BOE (hai góc đối đỉnh).<br>Do đó ΔOAC = ΔOBE (cạnh góc vuông – góc nhọn kề), suy ra OC = OE và AC = BE.",
        "DO ⊥ CE tại O và O là trung điểm của CE, nên DO là đường trung trực của CE. Do đó DC = DE = DB + BE = DB + AC.",
        "b) ΔDOC = ΔDOE (hai cạnh góc vuông: OC = OE, OD chung), suy ra ∠ODC = ∠ODE, tức là ∠ODH = ∠ODB. Vậy DO là tia phân giác của góc BDC.",
        "c) Xét hai tam giác vuông ODH và ODB có: OD là cạnh huyền chung; ∠ODH = ∠ODB.<br>Do đó ΔODH = ΔODB (cạnh huyền – góc nhọn), suy ra OH = OB = OA.",
        "Tam giác OAH cân tại O nên ∠OHA = ∠OAH; tam giác OBH cân tại O nên ∠OHB = ∠OBH.",
        "Trong tam giác AHB: ∠AHB = ∠OHA + ∠OHB = ∠HAB + ∠HBA, mà ∠AHB + ∠HAB + ∠HBA = 180° nên ∠AHB = 90°."
      ],
      dap: "CD = AC + BD; DO là tia phân giác của góc BDC; OH = OA và ∠AHB = 90°.",
      loi: "Đặt điểm E tuỳ ý rồi dùng luôn BE = AC; phải xác định E là giao điểm của tia CO với đường thẳng BD.",
      mix: [12, 14, 15]
    }
  ];

  /* ================= Chuẩn hóa theo khuôn Bài 16 (27/11/2026) =================
     Chia theo dạng như Bài 16 (thầy chốt lại 27/11/2026), khai báo ở TL_DATA.dang.
     - pt: phân tích ngược cho bài Thông hiểu, Vận dụng (mỗi câu a, b, c một sơ đồ; số trong [] là bước của lời giải).
     - hieu, nguoc, nhin: giải theo 4 bước cho bài mẫu mỗi dạng (vd2, vd3, vd4) và mọi bài Dành cho HSG.
     - phu: điểm, đoạn kẻ thêm; hình của đề (lúc đầu phân tích) không vẽ chúng.
     - Bài tự luyện: cuối mỗi dạng (dang[].tl). */
  var THEM = {
    th1: {
      pt: [
        { ten: "Câu a", dich: "ΔMOA = ΔMOB", sd: [["Hai tam giác vuông tại O có OA = OB, MO là cạnh chung (hai cạnh góc vuông)", [2]], ["d ⊥ AB tại trung điểm O của AB", [1]]], gt: "d là đường trung trực của AB, M thuộc d" },
        { ten: "Câu b", dich: "MO là tia phân giác của ∠AMB", sd: [["∠AMO = ∠BMO và tia MO nằm giữa hai tia MA, MB", [3]], ["Hai góc tương ứng của ΔMOA = ΔMOB (câu a)", [3]]], gt: "Kết quả câu a" },
        { ten: "Câu c", dich: "Chu vi = MA + MB + AB", sd: [["Cần MB (đã biết MA = 5 cm, AB = 8 cm)", [4]], ["MB = MA, vì M nằm trên đường trung trực của AB", [4]]], gt: "AB = 8 cm, MA = 5 cm, M thuộc d" }]
    },
    th2: {
      pt: [
        { ten: "Câu a", dich: "Tính ∠F", sd: [["∠F = 180° − (∠D + ∠E)", [1]], ["∠D = ∠A = 40° (hai góc tương ứng)", [1]]], gt: "ΔABC = ΔDEF, ∠A = 40°, ∠E = 70°" },
        { ten: "Câu b", dich: "Tam giác ABC cân", sd: [["Hai góc bằng nhau: ∠B = ∠C", [2]], ["∠B = ∠E = 70°, ∠C = ∠F = 70° (câu a)", [2]]], gt: "ΔABC = ΔDEF và kết quả câu a" },
        { ten: "Câu c", dich: "Tính DF", sd: [["DF = AC (hai cạnh tương ứng)", [3]], ["AC = AB = 6 cm, vì tam giác ABC cân tại A (câu b)", [3]]], gt: "AB = 6 cm và kết quả câu b" }]
    },
    th3: {
      pt: [
        { ten: "Câu a", dich: "AC = BD", sd: [["ΔOAC = ΔOBD", [1]], ["OA = OB, ∠AOC = ∠BOD (đối đỉnh), OC = OD (c.g.c)", [1]]], gt: "O là trung điểm của AB và của CD" },
        { ten: "Câu b", dich: "AC // BD", sd: [["Hai góc so le trong bằng nhau: ∠OAC = ∠OBD", [2]], ["Hai góc tương ứng của ΔOAC = ΔOBD (câu a)", [2]]], gt: "Kết quả câu a" },
        { ten: "Câu c", dich: "ΔACD = ΔBDC", sd: [["AC = BD, AD = BC, CD là cạnh chung (c.c.c)", [4]], ["AD = BC, vì ΔOAD = ΔOBC (c.g.c)", [3]], ["AC = BD (câu a)", [1]]], gt: "O là trung điểm của AB, CD và kết quả câu a" }]
    },
    vd1: {
      pt: [
        { ten: "Câu a", dich: "AD = BC", sd: [["ΔOAD = ΔOBC", [1]], ["OA = OB, ∠O chung, OD = OC (c.g.c)", [1]]], gt: "OA = OB, OC = OD" },
        { ten: "Câu b", dich: "ΔIAC = ΔIBD", sd: [["∠IAC = ∠IBD, AC = BD, ∠ICA = ∠IDB (g.c.g)", [4]], ["AC = OC − OA = OD − OB = BD", [3]], ["∠IAC, ∠IBD kề bù với hai góc bằng nhau ∠OAD, ∠OBC; ∠OCB = ∠ODA (câu a)", [2]]], gt: "OA = OB, OC = OD và kết quả câu a" },
        { ten: "Câu c", dich: "OI là tia phân giác của ∠xOy", sd: [["∠AOI = ∠BOI", [5, 6]], ["ΔOAI = ΔOBI (c.c.c): OA = OB, IA = IB, OI chung", [5]], ["IA = IB, vì ΔIAC = ΔIBD (câu b)", [5]]], gt: "OA = OB và kết quả câu b" }]
    },
    vd2: {
      /* Bài mẫu Vận dụng: giải theo 4 bước. */
      hieu: { gt: "ΔABC đều; D trên cạnh AB, E trên cạnh AC, AD = CE; I là giao điểm của BE và CD.", kl: "a) ΔACD = ΔCBE. b) Tính ∠BIC.",
        hoi: [
          ["Tam giác đều cho em biết những gì?", "Ba cạnh bằng nhau: AB = BC = CA; ba góc bằng nhau, mỗi góc 60°."],
          ["Trong hai tam giác ACD và CBE, đỉnh nào ứng với đỉnh nào?", "Theo thứ tự viết: A ↔ C, C ↔ B, D ↔ E. Cạnh AC ứng với CB, AD ứng với CE, ∠CAD ứng với ∠BCE."],
          ["Đo thử trên hình: ∠BIC khoảng bao nhiêu độ? Dời D đến chỗ khác thì sao?", "Khoảng 120°, và hình như không đổi khi D dời đi. Đó mới là dự đoán, em giữ làm đích và đi tìm lí do."]] },
      nguoc: [
        { ten: "Câu a", dich: "ΔACD = ΔCBE",
          sd: [["AC = CB, ∠CAD = ∠BCE (= 60°), AD = CE (c.g.c)", [1]]],
          gt: "ΔABC đều, AD = CE",
          ket: "ΔACD = ΔCBE (c.g.c).",
          buoc: [
            { hoi: "Hai tam giác ACD và CBE đã có sẵn những cặp cạnh nào bằng nhau?",
              nho: "Tam giác đều có ba cạnh bằng nhau.",
              chon: [
                ["AD = CE (đề cho) và AC = CB (tam giác ABC đều)", true, "Đúng. Còn thiếu một yếu tố nữa."],
                ["AD = CE và CD = BE", false, "Chưa biết CD = BE; đó là điều chỉ suy ra được sau khi hai tam giác bằng nhau."]],
              dat: "AD = CE và AC = CB" },
            { hoi: "Đã có hai cặp cạnh. Cần thêm cặp góc nào để dùng trường hợp cạnh – góc – cạnh?",
              nho: "Trường hợp c.g.c: góc phải xen giữa hai cạnh đã có.",
              chon: [
                ["∠CAD = ∠BCE: góc xen giữa AC, AD và góc xen giữa CB, CE; cả hai bằng 60°", true, "Đúng. ∠CAD chính là ∠BAC, ∠BCE chính là ∠BCA của tam giác đều."],
                ["∠ADC = ∠CEB", false, "Góc này không xen giữa hai cạnh đã có, và chưa biết hai góc này bằng nhau."]],
              dat: "∠CAD = ∠BCE = 60°" }] },
        { ten: "Câu b", dich: "Tính ∠BIC",
          sd: [["∠BIC = 180° − (∠IBC + ∠ICB)", [4]], ["∠IBC + ∠ICB = ∠ACD + ∠DCB = ∠ACB = 60°", [3]], ["∠CBE = ∠ACD (câu a)", [2]]],
          gt: "Kết quả câu a và ∠ACB = 60°",
          ket: "∠IBC + ∠ICB = 60° nên ∠BIC = 180° − 60° = 120°.",
          buoc: [
            { hoi: "∠BIC là góc của tam giác nào? Muốn tính nó cần biết gì?",
              nho: "Tổng ba góc của một tam giác bằng 180°.",
              chon: [
                ["Tam giác IBC: cần biết tổng ∠IBC + ∠ICB", true, "Đúng. Không cần biết riêng từng góc, chỉ cần tổng của chúng."],
                ["Tam giác IBD: cần ∠IBD và ∠IDB", false, "∠BIC không phải góc của tam giác IBD."]],
              dat: "∠IBC + ∠ICB" },
            { hoi: "Từng góc ∠IBC, ∠ICB đều thay đổi theo vị trí của D. Có thể thay ∠IBC (tức ∠CBE) bằng góc nào để ghép với ∠ICB thành một góc đã biết?",
              nho: "Hai tam giác bằng nhau thì các góc tương ứng bằng nhau. Nếu tia Oy nằm giữa hai tia Ox, Oz thì ∠xOy + ∠yOz = ∠xOz.",
              chon: [
                ["∠CBE = ∠ACD (câu a), nên ∠IBC + ∠ICB = ∠ACD + ∠DCB = ∠ACB = 60°", true, "Đúng. Tia CD nằm giữa hai tia CA, CB nên hai góc ghép lại thành ∠ACB."],
                ["∠CBE = ∠ABE", false, "Chỉ đúng khi BE là tia phân giác, tức là khi D là trung điểm của AB; đề không cho như vậy."]],
              dat: "∠CBE = ∠ACD (câu a)" }] }],
      nhin: [
        ["Thử lại với trường hợp đặc biệt: D là trung điểm của AB.", "Khi đó E là trung điểm của AC; BE, CD là tia phân giác của ∠B, ∠C nên ∠IBC = ∠ICB = 30°, ∠BIC = 180° − 60° = 120°. Khớp."],
        ["Kết quả có phụ thuộc vị trí của D không?", "Không. Dù D ở đâu trên cạnh AB (D khác A, B), luôn có ∠BIC = 120°."],
        ["Từ câu a em còn suy ra được điều gì?", "CD = BE (hai cạnh tương ứng)."]]
    },
    vd3: {
      /* Bài mẫu dạng 2: giải theo 4 bước. */
      hieu: { gt: "ΔABC; M là trung điểm của BC; E nằm trên tia đối của tia MA, ME = MA.", kl: "a) AB = CE và AB // CE. b) Nếu AB = AC thì AM ⊥ BC và tam giác ACE cân.",
        hoi: [
          ["Điểm M là trung điểm của những đoạn thẳng nào?", "Của BC (đề cho) và của AE (vì E nằm trên tia đối của tia MA và ME = MA)."],
          ["Hai đoạn AB và CE nằm trong hai tam giác nào có chung đỉnh M?", "Tam giác MAB và tam giác MEC."]] },
      nguoc: [
        { ten: "Câu a", dich: "AB = CE và AB // CE",
          sd: [["AB = EC và ∠MAB = ∠MEC (so le trong)", [2]], ["ΔMAB = ΔMEC (c.g.c): MA = ME, ∠AMB = ∠EMC (đối đỉnh), MB = MC", [1]]],
          gt: "M là trung điểm của BC, ME = MA",
          ket: "ΔMAB = ΔMEC nên AB = EC; ∠MAB = ∠MEC là hai góc so le trong nên AB // CE.",
          buoc: [
            { hoi: "AB và CE là cạnh của hai tam giác nào có thể bằng nhau?",
              nho: "Hai tam giác bằng nhau thì các cạnh tương ứng, các góc tương ứng bằng nhau.",
              chon: [
                ["ΔMAB và ΔMEC: đã có MA = ME, MB = MC", true, "Đúng. Còn cần góc xen giữa."],
                ["ΔABC và ΔECB", false, "Chưa biết AC = EB, nên chưa đủ yếu tố."]],
              dat: "ΔMAB = ΔMEC" },
            { hoi: "Góc xen giữa hai cặp cạnh đó là góc nào? Vì sao chúng bằng nhau?",
              nho: "Hai góc đối đỉnh thì bằng nhau.",
              chon: [
                ["∠AMB = ∠EMC, hai góc đối đỉnh", true, "Đúng: ΔMAB = ΔMEC (c.g.c)."],
                ["∠ABM = ∠ECM", false, "Đó là điều chỉ suy ra được sau khi hai tam giác bằng nhau."]],
              dat: "∠AMB = ∠EMC (đối đỉnh)" },
            { hoi: "Muốn AB // CE, cần cặp góc nào bằng nhau?",
              nho: "Hai đường thẳng tạo với một cát tuyến hai góc so le trong bằng nhau thì song song.",
              chon: [
                ["∠MAB = ∠MEC: so le trong với cát tuyến AE, là hai góc tương ứng của ΔMAB = ΔMEC", true, "Đúng."],
                ["∠ABC = ∠ACB", false, "Hai góc này không ở vị trí so le trong đối với hai đường thẳng AB, CE."]],
              dat: "∠MAB = ∠MEC (so le trong)" }] },
        { ten: "Câu b", dich: "AM ⊥ BC và tam giác ACE cân",
          sd: [["∠AMB = ∠AMC mà hai góc kề bù, nên ∠AMB = 90°; CE = CA", [4, 5]], ["ΔABM = ΔACM (c.c.c); CE = AB (câu a) và AB = AC", [3, 5]]],
          gt: "AB = AC, MB = MC và kết quả câu a",
          ket: "AM ⊥ BC; CE = AB = AC nên tam giác ACE cân tại C.",
          buoc: [
            { hoi: "Muốn AM ⊥ BC, em chỉ ra góc nào bằng 90°? Bằng cách nào?",
              nho: "Hai góc kề bù mà bằng nhau thì mỗi góc bằng 90°.",
              chon: [
                ["∠AMB = ∠AMC: hai góc kề bù bằng nhau nên mỗi góc 90°; lấy từ ΔABM = ΔACM (c.c.c)", true, "Đúng."],
                ["∠BAM = 90°", false, "∠BAM là góc ở đỉnh A, không liên quan đến AM ⊥ BC."]],
              dat: "ΔABM = ΔACM (c.c.c)" },
            { hoi: "Tam giác ACE cân tại đỉnh nào? Hai cạnh nào bằng nhau?",
              chon: [
                ["Cân tại C: CE = AB (câu a) và AB = AC, nên CE = CA", true, "Đúng."],
                ["Cân tại A: AC = AE", false, "AE = 2 · AM, chưa có lí do để bằng AC."]],
              dat: "CE = CA" }] }],
      nhin: [
        ["Cách khác cho AB // CE: dùng cặp góc so le trong ∠ABM và ∠ECM.", "Từ ΔMAB = ΔMEC: ∠ABM = ∠ECM, hai góc so le trong đối với cát tuyến BC, nên AB // CE."],
        ["Từ câu a, em có chứng minh được AC = BE và AC // BE không?", "Có: tương tự, ΔMAC = ΔMEB (c.g.c)."]]
    },
    vd4: {
      /* Bài mẫu Vận dụng: giải theo 4 bước. */
      hieu: { gt: "ΔABC cân tại A; BH ⊥ AC (H thuộc AC), CK ⊥ AB (K thuộc AB); BH cắt CK tại O.", kl: "a) BH = CK. b) Tam giác OBC cân. c) AO là đường trung trực của BC.",
        hoi: [
          ["Trên hình có những tam giác vuông nào chứa BH hoặc CK?", "ΔBHC, ΔBHA vuông tại H; ΔCKB, ΔCKA vuông tại K."],
          ["Muốn chứng minh một đường thẳng là đường trung trực của BC, em đã học những cách nào?", "Cách 1: chứng minh nó vuông góc với BC tại trung điểm của BC. Cách 2: chỉ ra hai điểm phân biệt của nó cùng cách đều B và C."]] },
      nguoc: [
        { ten: "Câu a", dich: "BH = CK",
          sd: [["ΔBHC = ΔCKB (cạnh huyền – góc nhọn)", [2]], ["Cạnh huyền BC chung; ∠HCB = ∠KBC (hai góc ở đáy)", [1]]],
          gt: "ΔABC cân tại A, BH ⊥ AC, CK ⊥ AB",
          ket: "ΔBHC = ΔCKB nên BH = CK.",
          buoc: [
            { hoi: "BH và CK là cạnh của hai tam giác vuông nào có chung một cạnh?",
              nho: "Hai tam giác bằng nhau thì các cạnh tương ứng bằng nhau.",
              chon: [
                ["ΔBHC (vuông tại H) và ΔCKB (vuông tại K): chung cạnh huyền BC", true, "Đúng. Hai tam giác này còn có sẵn hai góc ở đáy của tam giác cân."],
                ["ΔBHA và ΔCKA: chung góc A", false, "Hướng này cũng đi được (cạnh huyền AB = AC, góc A chung). Em để dành cho bước 4."],
                ["ΔOBK và ΔOCH", false, "Chưa biết cặp cạnh nào của hai tam giác này bằng nhau."]],
              dat: "ΔBHC = ΔCKB" },
            { hoi: "Hai tam giác vuông BHC và CKB đã có cạnh huyền BC chung. Cần thêm gì?",
              nho: "Hai tam giác vuông bằng nhau nếu có cạnh huyền và một góc nhọn bằng nhau.",
              chon: [
                ["Một góc nhọn: ∠HCB = ∠KBC, hai góc ở đáy của tam giác cân ABC", true, "Đúng. Đó là trường hợp cạnh huyền – góc nhọn."],
                ["HC = KB", false, "Chưa biết; đó là điều suy ra được sau khi hai tam giác bằng nhau."]],
              dat: "∠HCB = ∠KBC (ΔABC cân tại A)" }] },
        { ten: "Câu b", dich: "Tam giác OBC cân tại O",
          sd: [["∠OBC = ∠OCB", [3]], ["∠HBC = ∠KCB: hai góc tương ứng của ΔBHC = ΔCKB (câu a)", [3]]],
          gt: "Kết quả câu a",
          ket: "∠OBC = ∠OCB nên tam giác OBC cân tại O.",
          buoc: [
            { hoi: "Muốn chứng minh tam giác OBC cân, em chứng minh hai cạnh bằng nhau hay hai góc bằng nhau? Góc nào?",
              nho: "Tam giác có hai góc bằng nhau là tam giác cân.",
              chon: [
                ["Hai góc ∠OBC = ∠OCB", true, "Đúng. ∠OBC chính là ∠HBC, ∠OCB chính là ∠KCB."],
                ["Hai cạnh OB = OC, bằng cách chứng minh ΔOBK = ΔOCH", false, "Đi được nhưng dài hơn: phải chứng minh thêm hai tam giác bằng nhau."]],
              dat: "∠OBC = ∠OCB" },
            { hoi: "Vì sao ∠HBC = ∠KCB?",
              chon: [
                ["Hai góc tương ứng của ΔBHC = ΔCKB (câu a)", true, "Đúng. Kết quả câu a là bậc thang cho câu b."],
                ["Đó là hai góc ở đáy của tam giác ABC", false, "Hai góc ở đáy là ∠ABC, ∠ACB; còn ∠HBC, ∠KCB chỉ là một phần của chúng."]],
              dat: "∠HBC = ∠KCB (câu a)" }] },
        { ten: "Câu c", dich: "AO là đường trung trực của BC",
          sd: [["A và O phân biệt, cùng cách đều B và C", [4, 5]], ["AB = AC (đề cho); OB = OC (câu b)", [4]]],
          gt: "ΔABC cân tại A và kết quả câu b",
          ket: "A và O cùng nằm trên đường trung trực của BC nên AO là đường trung trực của BC.",
          buoc: [
            { hoi: "Câu b cho OB = OC. Điều đó cho biết gì về điểm O đối với đoạn thẳng BC?",
              nho: "Điểm cách đều hai đầu mút của một đoạn thẳng thì nằm trên đường trung trực của đoạn thẳng đó.",
              chon: [
                ["O nằm trên đường trung trực của BC", true, "Đúng. Một đường thẳng cần hai điểm, nên còn thiếu một điểm nữa."],
                ["AO đã là đường trung trực của BC", false, "Mới có một điểm O; một điểm chưa xác định được một đường thẳng."]],
              dat: "O nằm trên đường trung trực của BC" },
            { hoi: "Điểm nào nữa trên đường thẳng AO cũng cách đều B và C?",
              chon: [
                ["A, vì AB = AC (tam giác ABC cân tại A)", true, "Đúng. Hai điểm phân biệt A, O cùng nằm trên đường trung trực của BC."],
                ["H, vì H nằm trên BH", false, "H không nằm trên đường thẳng AO, và chưa biết HB = HC."]],
              dat: "A nằm trên đường trung trực của BC (AB = AC)" }] }],
      nhin: [
        ["Cách khác cho câu a: dùng hai tam giác vuông ABH và ACK. Em thử nhé.", "Hai tam giác vuông ABH (vuông tại H) và ACK (vuông tại K) có cạnh huyền AB = AC, góc nhọn ∠A chung, nên ΔABH = ΔACK (cạnh huyền – góc nhọn), suy ra BH = CK."],
        ["Từ câu c, đường thẳng AO còn là gì của góc BAC?", "ΔABO = ΔACO (c.c.c: AB = AC, OB = OC, AO chung) nên ∠BAO = ∠CAO: AO là tia phân giác của góc BAC."]]
    },
    vd5: {
      pt: [
        { ten: "Câu a", dich: "Tam giác BCD đều", sd: [["Tam giác BCD cân tại C và có ∠B = 60°", [2]], ["CB = CD, vì ΔCAB = ΔCAD (hai cạnh góc vuông)", [1]]], gt: "∠BAC = 90°, ∠B = 60°, AD = AB" },
        { ten: "Câu b", dich: "Tính AB", sd: [["AB = BD : 2 (A là trung điểm của BD)", [3]], ["BD = BC = 10 cm (tam giác BCD đều, câu a)", [3]]], gt: "BC = 10 cm và kết quả câu a" },
        { ten: "Câu c", dich: "E nằm trên đường trung trực của BC", sd: [["EB = EC", [5]], ["Tam giác EBC cân tại E: ∠EBC = ∠ECB = 30°", [4, 5]], ["∠EBC = 60° : 2; ∠ECB = 90° − 60°", [4]]], gt: "∠B = 60°, BE là tia phân giác của góc B" }]
    },

    /* ---------------- Dành cho HSG: giải theo 4 bước ---------------- */
    hsg1: {
      phu: ["F"],
      hieu: { gt: "ΔABC cân tại A, ∠A = 20°; D trên cạnh AC, ∠DBC = 60°; E trên cạnh AB, ∠ECB = 50°.", kl: "Tính ∠BDE.",
        hoi: [
          ["Em tính ngay được những góc nào?", "∠ABC = ∠ACB = 80°; trong ΔEBC: ∠BEC = 180° − 80° − 50° = 50°; trong ΔDBC: ∠BDC = 180° − 60° − 80° = 40°."],
          ["Từ ∠BEC = ∠ECB = 50°, em có thêm điều gì?", "Tam giác EBC cân tại B: BE = BC."],
          ["∠BDE nằm trong tam giác BDE. Tam giác này đã biết những gì?", "Mới biết ∠DBE = 80° − 60° = 20°, chưa biết cặp cạnh nào bằng nhau. Phải tìm thêm."]] },
      nguoc: [
        { ten: "Tính ∠BDE", dich: "Tính ∠BDE",
          sd: [
            ["∠BDE = ∠FDE − ∠FDB = 70° − 40°", [6]],
            ["Tam giác FDE cân tại F (FD = FE), ∠EFD = 40°", [5]],
            ["FD = FB (ΔFBD cân tại F) và FE = FB (ΔBEF đều)", [3, 4]],
            ["Kẻ BF (F thuộc AC) với ∠FBC = 20°: BF = BC = BE", [1, 2]]],
          gt: "∠A = 20°, ∠DBC = 60°, ∠ECB = 50°",
          ket: "∠FDE = 70°, ∠FDB = 40°, nên ∠BDE = 70° − 40° = 30°.",
          buoc: [
            { hoi: "Tam giác BDE mới biết một góc nên chưa dùng được tổng ba góc. Theo em, đi đường nào để tới ∠BDE?",
              nho: "Tam giác cân có hai góc ở đáy bằng nhau. Biết góc ở đỉnh thì tính được góc ở đáy.",
              chon: [
                ["Tìm một tam giác cân có cạnh DE, tính góc ở đáy của nó, rồi trừ đi một góc đã biết", true, "Đúng hướng. Hình hiện chưa có tam giác cân nào chứa DE; ta sẽ tạo ra nó."],
                ["Dùng tổng ba góc của tam giác BDE", false, "Mới biết một góc ∠DBE = 20° nên chưa tính được."]],
              dat: "Một tam giác cân có cạnh DE" },
            { ve: 1, hoi: "Đã có BE = BC. Em kẻ thêm từ B một đoạn nữa bằng BC, đầu mút nằm trên AC. Chọn góc nào ở đỉnh B để tam giác mới cân tại B?",
              nho: "Trong tam giác FBC, nếu ∠BFC = ∠BCF = 80° thì BF = BC.",
              chon: [
                ["Kẻ BF (F thuộc AC) với ∠FBC = 20°: ∠BFC = 180° − 20° − 80° = 80° = ∠BCF, nên BF = BC", true, "Đúng. Vậy BF = BC = BE."],
                ["Kẻ BF với ∠FBC = 40°", false, "Khi đó ∠BFC = 60°, khác ∠BCF = 80°: tam giác FBC không cân tại B."]],
              dat: "Kẻ BF (F thuộc AC), ∠FBC = 20°: BF = BC = BE" },
            { hoi: "Tam giác BEF có BE = BF. Góc ∠EBF bằng bao nhiêu? Đó là tam giác gì?",
              nho: "Tam giác cân có một góc bằng 60° là tam giác đều.",
              chon: [
                ["∠EBF = 80° − 20° = 60°: tam giác BEF đều, FE = FB", true, "Đúng."],
                ["∠EBF = 20°: tam giác BEF chỉ cân", false, "∠EBF = ∠ABC − ∠FBC = 80° − 20° = 60°."]],
              dat: "Tam giác BEF đều: FE = FB, ∠BFE = 60°" },
            { hoi: "Còn FD thì sao? Trong tam giác FBD, tính ∠FBD và ∠FDB.",
              chon: [
                ["∠FBD = 60° − 20° = 40° và ∠FDB = ∠BDC = 40°: tam giác FBD cân tại F, FD = FB", true, "Đúng. Vậy FD = FB = FE."],
                ["∠FDB = 60°", false, "∠FDB chính là ∠BDC = 180° − 60° − 80° = 40°."]],
              dat: "Tam giác FBD cân tại F: FD = FB = FE" },
            { hoi: "Tam giác FDE cân tại F. Tính góc ở đỉnh ∠EFD, rồi góc ở đáy ∠FDE.",
              chon: [
                ["∠BFD = 180° − 80° = 100° (kề bù với ∠BFC), ∠EFD = 100° − 60° = 40°, ∠FDE = (180° − 40°) : 2 = 70°", true, "Đúng. Vậy ∠BDE = ∠FDE − ∠FDB = 70° − 40° = 30°."],
                ["∠EFD = 60°", false, "60° là ∠BFE; còn ∠EFD = ∠BFD − ∠BFE."]],
              dat: "∠FDE = 70° (tam giác FDE cân tại F, ∠EFD = 40°)" }] }],
      nhin: [
        ["Thử lại: tính ∠AED theo hai cách.", "Cách 1: ∠ADB = 180° − 40° = 140°, ∠ADE = 140° − 30° = 110°, trong ΔADE: ∠AED = 180° − 20° − 110° = 50°. Cách 2: trong ΔBDE: ∠BED = 180° − 20° − 30° = 130°, nên ∠AED = 180° − 130° = 50°. Hai cách khớp nhau."],
        ["Vì sao chọn góc 20° khi kẻ BF?", "Để tam giác FBC có hai góc 80°, cho BF = BC = BE; khi đó ∠EBF = 60° làm xuất hiện tam giác đều BEF."],
        ["Mấu chốt của bài là gì?", "Từ tam giác cân EBC, tạo thêm tam giác cân FBC và tam giác đều BEF; ba đoạn FB, FE, FD bằng nhau làm lộ ra tam giác cân FDE chứa cạnh DE."]]
    },
    hsg2: {
      phu: ["E", "F"],
      hieu: { gt: "ΔABC cân tại A, ∠A = 100°; BD là tia phân giác của góc B (D thuộc AC).", kl: "BC = BD + AD.",
        hoi: [
          ["Em tính được những góc nào?", "∠B = ∠C = (180° − 100°) : 2 = 40°; ∠ABD = ∠DBC = 20°."],
          ["Muốn chứng minh một đoạn bằng tổng hai đoạn, em thường làm thế nào?", "Trên đoạn dài (BC) lấy một điểm chia nó thành hai phần, rồi chứng minh mỗi phần bằng một đoạn ngắn."]] },
      nguoc: [
        { ten: "Chứng minh BC = BD + AD", dich: "BC = BD + AD",
          sd: [
            ["BC = BE + EC với BE = BD, EC = AD", [6]],
            ["EC = ED (tam giác EDC cân tại E) và ED = DF = DA", [4, 5]],
            ["ΔABD = ΔFBD (c.g.c) nên DF = DA; tam giác BDE cân tại B", [2, 3]],
            ["Lấy E, F trên BC: BE = BD, BF = BA", [2, 3]]],
          gt: "∠A = 100°, AB = AC, BD là tia phân giác của góc B",
          ket: "BC = BE + EC = BD + AD.",
          buoc: [
            { ve: 1, hoi: "Trên BC, em lấy điểm E thế nào để phần BE bằng ngay một đoạn đã có?",
              nho: "Muốn chứng minh BC = BD + AD, lấy trên BC một đoạn bằng BD rồi chứng minh phần còn lại bằng AD.",
              chon: [
                ["Lấy E trên BC sao cho BE = BD; còn phải chứng minh EC = AD", true, "Đúng."],
                ["Lấy E là trung điểm của BC", false, "Chưa chắc BC = 2 · BD; trung điểm không giúp gì."]],
              dat: "E thuộc BC, BE = BD; cần EC = AD" },
            { hoi: "EC và AD nằm xa nhau. Tính các góc của tam giác EDC: tam giác này có cân không?",
              nho: "Tam giác BDE cân tại B có góc ở đỉnh ∠DBE = 20°.",
              chon: [
                ["∠BED = 80°, nên ∠DEC = 100°, ∠EDC = 180° − 100° − 40° = 40° = ∠C: tam giác EDC cân tại E, EC = ED", true, "Đúng. Còn cần ED = AD."],
                ["Tam giác EDC cân tại D", false, "Hai góc bằng nhau là ∠EDC và ∠C, nên tam giác cân tại E."]],
              dat: "EC = ED (tam giác EDC cân tại E); cần ED = AD" },
            { hoi: "ED và AD chưa nằm trong hai tam giác bằng nhau. Dựa vào tia phân giác BD, em lấy thêm điểm F trên BC thế nào để có một đoạn bằng AD?",
              nho: "Hai tam giác có hai cạnh và góc xen giữa bằng nhau thì bằng nhau.",
              chon: [
                ["Lấy F trên BC sao cho BF = BA: ΔABD = ΔFBD (c.g.c), nên DF = DA và ∠BFD = ∠BAD = 100°", true, "Đúng."],
                ["Lấy F sao cho DF ⊥ BC", false, "Khi đó chưa có cặp tam giác bằng nhau nào cho DF = DA (vì ∠A không vuông)."]],
              dat: "F thuộc BC, BF = BA: DF = DA" },
            { hoi: "Còn cần ED = DF. Tính các góc của tam giác DFE.",
              chon: [
                ["∠DFE = 180° − 100° = 80° và ∠DEF = ∠BED = 80°: tam giác DFE cân tại D, DE = DF", true, "Đúng. Vậy EC = ED = DF = DA."],
                ["∠DFE = 100°", false, "100° là ∠BFD; ∠DFE kề bù với nó."]],
              dat: "∠DFE = ∠DEF = 80°: DE = DF" }] }],
      nhin: [
        ["Thử lại bằng số đo: nếu AB = AC = 1 cm thì đo trên hình vẽ chính xác được BC ≈ 1,53 cm, BD ≈ 1,14 cm, AD ≈ 0,39 cm. BD + AD có bằng BC không?", "1,14 + 0,39 = 1,53. Khớp."],
        ["Vì sao phải lấy cả hai điểm E và F?", "E tạo phần BE = BD trên BC; F mang đoạn DA về sát E (DF = DA). Hai tam giác cân DFE và EDC nối DA với EC."]]
    },
    hsg3: {
      phu: ["AD"],
      hieu: { gt: "ΔABC cân tại A, ∠A = 20°; tam giác đều BCD, D nằm trong ΔABC; BM là tia phân giác của ∠ABD (M thuộc AC).", kl: "a) AM = BC. b) Tính ∠BMC.",
        hoi: [
          ["Tính các góc ở đỉnh B.", "∠ABC = 80°, ∠DBC = 60° nên ∠ABD = 20°; BM là tia phân giác nên ∠ABM = ∠MBD = 10°."],
          ["AM và BC nằm xa nhau. BC bằng đoạn nào nằm gần AM hơn?", "BC = BD = CD (tam giác BCD đều). Đoạn BD xuất phát từ B, sát tam giác ABM."]] },
      nguoc: [
        { ten: "Câu a", dich: "AM = BC",
          sd: [
            ["AM = BD (= BC)", [4]],
            ["ΔBAM = ΔABD (g.c.g): ∠BAM = ∠ABD = 20°, AB chung, ∠ABM = ∠BAD = 10°", [3]],
            ["Nối AD: ΔABD = ΔACD (c.c.c) nên ∠BAD = 10°", [1, 2]]],
          gt: "∠A = 20°, AB = AC, tam giác BCD đều, BM là tia phân giác của ∠ABD",
          ket: "AM = BD = BC. Từ đó ∠AMB = 180° − 20° − 10° = 150° và ∠BMC = 30°.",
          buoc: [
            { hoi: "AM là cạnh của tam giác ABM. Thay BC bằng BD. Tam giác nào chứa BD có thể bằng tam giác ABM?",
              nho: "Hai tam giác bằng nhau thì các cạnh tương ứng bằng nhau.",
              chon: [
                ["Tam giác BAD: chung cạnh AB, lại có ∠ABD = ∠BAM (= 20°)", true, "Đúng. Viết ΔBAM và ΔABD: B ↔ A, A ↔ B, M ↔ D; cạnh AM ứng với BD."],
                ["Tam giác BCD", false, "Tam giác BCD đều, các góc 60°, không thể bằng tam giác ABM."]],
              dat: "ΔBAM = ΔABD" },
            { hoi: "Hai tam giác đã có AB chung và ∠BAM = ∠ABD. Cần thêm cặp góc nào để dùng g.c.g? Đã biết chưa?",
              nho: "Trường hợp g.c.g: hai góc kề với cạnh chung.",
              chon: [
                ["∠ABM = ∠BAD: đã biết ∠ABM = 10°, còn cần ∠BAD = 10°", true, "Đúng. Phải tính ∠BAD."],
                ["∠AMB = ∠ADB", false, "Hai góc này không kề cạnh AB."]],
              dat: "∠BAD = 10° (= ∠ABM)" },
            { ve: 1, hoi: "Muốn tính ∠BAD, em kẻ thêm đoạn nào? Vì sao?",
              nho: "Hai tam giác có ba cặp cạnh bằng nhau thì bằng nhau.",
              chon: [
                ["Nối AD: AB = AC, DB = DC, AD chung nên ΔABD = ΔACD (c.c.c), ∠BAD = ∠CAD = 20° : 2 = 10°", true, "Đúng."],
                ["Kẻ qua D đường thẳng song song với BC", false, "Không tạo ra cặp tam giác bằng nhau nào chứa ∠BAD."]],
              dat: "Nối AD: ΔABD = ΔACD (c.c.c)" }] }],
      nhin: [
        ["Thử lại câu b bằng tam giác BMC.", "∠MBC = ∠MBD + ∠DBC = 10° + 60° = 70°, ∠MCB = 80°, nên ∠BMC = 180° − 70° − 80° = 30°. Khớp."],
        ["So sánh với bài Dành cho HSG đầu tiên của Bài 16 (D trên AC với AD = BC thì ∠ABD = 10°).", "Đây là cùng một hình: M trên AC với AM = BC thì ∠ABM = 10°. Bài này đi theo chiều ngược lại: cho ∠ABM = 10°, chứng minh AM = BC."]]
    },
    hsg4: {
      phu: ["F", "P"],
      hieu: { gt: "ΔABC vuông cân tại A; D trên cạnh AB; K trên tia đối của tia CA, CK = BD; DK cắt BC tại I.", kl: "a) I là trung điểm của DK. b) Đường trung trực của DK luôn đi qua một điểm cố định.",
        hoi: [
          ["Các góc của tam giác ABC bằng bao nhiêu?", "∠A = 90°, ∠B = ∠C = 45°."],
          ["Câu b: làm sao đoán được điểm cố định?", "Vẽ thử với hai vị trí khác nhau của D, vẽ hai đường trung trực của DK, xem chúng cắt nhau ở đâu. Điểm đó là đỉnh thứ tư của hình vuông có ba đỉnh B, A, C."]] },
      nguoc: [
        { ten: "Câu a", dich: "ID = IK",
          sd: [["ΔIDF = ΔIKC (g.c.g)", [2]], ["DF = CK, vì DF = DB (tam giác DBF cân tại D)", [1]], ["Kẻ DF // AC (F thuộc BC)", [1]]],
          gt: "ΔABC vuông cân tại A, CK = BD",
          ket: "ΔIDF = ΔIKC nên ID = IK: I là trung điểm của DK.",
          buoc: [
            { hoi: "ID và IK nằm trong hai tam giác IBD và ICK. Hai tam giác này có bằng nhau không?",
              chon: [
                ["Không: BD = CK nhưng ∠IBD = 45° còn ∠ICK = 180° − 45° = 135°", true, "Đúng. Phải tạo một tam giác mới chứa ID, bằng tam giác ICK."],
                ["Có, vì BD = CK", false, "Mới có một cặp cạnh; hơn nữa ∠IBD = 45°, ∠ICK = 135°."]],
              dat: "Một tam giác chứa ID, bằng tam giác IKC" },
            { ve: 1, hoi: "CK nằm trên đường thẳng AC. Qua D em kẻ đường nào để có một đoạn bằng CK và các cặp góc so le trong?",
              nho: "Hai đường thẳng song song tạo với cát tuyến các cặp góc so le trong bằng nhau.",
              chon: [
                ["Kẻ DF // AC (F thuộc BC): ∠BFD = ∠BCA = 45° (đồng vị) nên tam giác DBF cân tại D, DF = DB = CK", true, "Đúng. ΔIDF và ΔIKC có DF = KC và hai cặp góc so le trong."],
                ["Kẻ DF ⊥ BC", false, "DF khi đó không song song với CK, không có góc so le trong."]],
              dat: "Kẻ DF // AC: DF = DB = CK" }] },
        { ten: "Câu b", dich: "Đường trung trực của DK đi qua một điểm cố định",
          sd: [["PD = PK", [5, 6]], ["ΔPBD = ΔPCK (hai cạnh góc vuông): PB = PC, BD = CK", [4, 5]], ["P là giao điểm của đường vuông góc với AB tại B và đường vuông góc với AC tại C", [3]]],
          gt: "CK = BD; A, B, C cố định",
          ket: "PD = PK nên đường trung trực của DK luôn đi qua điểm cố định P.",
          buoc: [
            { hoi: "Đường trung trực của DK đi qua một điểm P khi nào?",
              nho: "Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai đầu mút, và ngược lại.",
              chon: [
                ["Khi PD = PK", true, "Đúng. Cần tìm điểm P cố định có PD = PK với mọi vị trí của D."],
                ["Khi P nằm trên DK", false, "Đường trung trực cắt DK tại trung điểm I, mà I thay đổi theo D."]],
              dat: "PD = PK" },
            { ve: 1, hoi: "Đoán P: điểm nào cách đều D và K dù D ở đâu? Gợi ý: hai tam giác vuông có cạnh BD và CK bằng nhau.",
              chon: [
                ["P là giao điểm của đường vuông góc với AB tại B và đường vuông góc với AC tại C: hai tam giác vuông PBD, PCK có BD = CK", true, "Đúng. Còn cần PB = PC."],
                ["Trung điểm O của BC", false, "Khi D rất gần A thì OD nhỏ hơn hẳn OK, nên O không cách đều D và K."]],
              dat: "P: PB ⊥ AB, PC ⊥ AC; cần PB = PC" },
            { hoi: "Vì sao PB = PC?",
              chon: [
                ["∠PBC = 90° − 45° = 45° = ∠PCB, nên tam giác PBC cân tại P", true, "Đúng. Rồi ΔPBD = ΔPCK (hai cạnh góc vuông) cho PD = PK."],
                ["Vì P nằm trên đường trung trực của DK", false, "Đó là điều cần chứng minh, không dùng làm lí do được."]],
              dat: "PB = PC (tam giác PBC cân tại P)" }] }],
      nhin: [
        ["Vì sao P không phụ thuộc vị trí của D?", "P chỉ được dựng từ A, B, C (đường vuông góc với AB tại B và với AC tại C), không dùng đến D."],
        ["Bốn điểm A, B, P, C tạo thành hình gì?", "Bốn góc vuông và AB = AC: đó là một hình vuông; P là đỉnh thứ tư."]]
    },
    hsg5: {
      phu: ["E"],
      hieu: { gt: "O là trung điểm của AB; Ax ⊥ AB, By ⊥ AB, cùng nửa mặt phẳng bờ AB; C thuộc Ax, D thuộc By, ∠COD = 90°; OH ⊥ CD.", kl: "a) CD = AC + BD. b) DO là tia phân giác của ∠BDC. c) OH = OA và ∠AHB = 90°.",
        hoi: [
          ["AC và BD nằm ở hai bên, không nối liền nhau. Muốn có tổng AC + BD, em làm gì?", "Đưa một đoạn sang nối tiếp đoạn kia trên cùng một đường thẳng, chẳng hạn tạo trên đường thẳng BD một đoạn BE = AC."],
          ["∠COD = 90° gợi gì nếu kéo dài CO?", "DO vuông góc với đường thẳng CO; nếu O là trung điểm của đoạn CE thì DO là đường trung trực của CE."]] },
      nguoc: [
        { ten: "Câu a", dich: "CD = AC + BD",
          sd: [["DC = DE = DB + BE với BE = AC", [2]], ["DO là đường trung trực của CE", [2]], ["ΔOAC = ΔOBE: OC = OE, AC = BE", [1]], ["Tia CO cắt đường thẳng BD tại E", [1]]],
          gt: "OA = OB, AC ⊥ AB, BD ⊥ AB, ∠COD = 90°",
          ket: "DC = DE = DB + BE = BD + AC.",
          buoc: [
            { ve: 1, hoi: "Muốn có tổng AC + BD trên một đường thẳng, em đưa AC về nối tiếp BD thế nào?",
              nho: "Hai góc đối đỉnh thì bằng nhau. Hai tam giác vuông bằng nhau nếu có một cạnh góc vuông và góc nhọn kề cạnh ấy bằng nhau.",
              chon: [
                ["Kéo dài CO cắt đường thẳng BD tại E: ΔOAC = ΔOBE nên BE = AC, OC = OE", true, "Đúng. Khi đó DE = DB + BE = DB + AC; còn cần DC = DE."],
                ["Lấy E trên tia By sao cho BE = AC", false, "E như vậy nằm cùng phía với D, không cho tổng DB + BE; lại không liên quan gì đến ∠COD."]],
              dat: "E là giao điểm của tia CO với đường thẳng BD: BE = AC, OC = OE; cần DC = DE" },
            { hoi: "Vì sao DC = DE?",
              nho: "Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai đầu mút.",
              chon: [
                ["DO ⊥ CE tại O và OC = OE: DO là đường trung trực của CE, nên DC = DE", true, "Đúng."],
                ["Vì tam giác DOC cân", false, "Tam giác DOC vuông tại O, chưa có cơ sở nào để nó cân."]],
              dat: "DO là đường trung trực của CE" }] },
        { ten: "Câu b", dich: "DO là tia phân giác của ∠BDC",
          sd: [["∠ODC = ∠ODE (= ∠ODB)", [3]], ["ΔDOC = ΔDOE (hai cạnh góc vuông)", [3]]],
          gt: "OC = OE (câu a)",
          ket: "∠ODC = ∠ODB nên DO là tia phân giác của ∠BDC.",
          buoc: [
            { hoi: "∠ODB chính là góc nào của tam giác ODE? Tam giác này bằng tam giác nào?",
              chon: [
                ["∠ODB = ∠ODE; ΔDOE = ΔDOC (OE = OC, OD chung, cùng vuông tại O)", true, "Đúng. Suy ra ∠ODE = ∠ODC."],
                ["ΔODB = ΔOAC", false, "Hai tam giác này không có cặp cạnh nào đã biết là bằng nhau."]],
              dat: "ΔDOC = ΔDOE" }] },
        { ten: "Câu c", dich: "OH = OA và ∠AHB = 90°",
          sd: [["∠AHB = ∠HAB + ∠HBA, nên ∠AHB = 90°", [5, 6]], ["Tam giác OAH, OBH cân tại O (OH = OA = OB)", [5]], ["OH = OB: ΔODH = ΔODB (cạnh huyền – góc nhọn)", [4]]],
          gt: "Kết quả câu b",
          ket: "OH = OB = OA và ∠AHB = 90°.",
          buoc: [
            { hoi: "OH và OB là cạnh của hai tam giác vuông nào?",
              nho: "Hai tam giác vuông bằng nhau nếu có cạnh huyền và một góc nhọn bằng nhau.",
              chon: [
                ["ΔODH (vuông tại H) và ΔODB (vuông tại B): cạnh huyền OD chung, ∠ODH = ∠ODB (câu b)", true, "Đúng. Suy ra OH = OB = OA."],
                ["ΔOCH và ΔOCA", false, "Hướng này cần CO là tia phân giác của ∠ACD, điều chưa chứng minh."]],
              dat: "ΔODH = ΔODB: OH = OB = OA" },
            { hoi: "Đã có OA = OH = OB. Muốn chứng minh ∠AHB = 90°, em dùng những tam giác nào?",
              nho: "Tam giác cân có hai góc ở đáy bằng nhau; tổng ba góc của một tam giác bằng 180°.",
              chon: [
                ["Hai tam giác OAH, OBH cân tại O: ∠AHB = ∠OHA + ∠OHB = ∠HAB + ∠HBA, mà tổng ba góc của tam giác AHB là 180° nên 2 · ∠AHB = 180°", true, "Đúng. ∠AHB = 90°."],
                ["Tam giác AHB cân", false, "Chưa biết HA = HB, và điều đó nói chung không đúng."]],
              dat: "Tam giác OAH, OBH cân tại O" }] }],
      nhin: [
        ["Kiểm tra câu a với trường hợp đặc biệt AC = BD.", "Khi đó hình đối xứng, ∠AOC = ∠BOD = 45°, nên AC = OA, BD = OB và CD = AB = AC + BD. Đúng."],
        ["Kéo dài DO thay cho CO có được không?", "Được: vai trò của C và D như nhau, kéo dài DO cắt đường thẳng AC tại một điểm rồi lập luận tương tự."]]
    }
  };
  /* Bài có phu: hình của đề (goc = true) bỏ điểm, đoạn kẻ thêm. */
  ITEMS.forEach(function (q) {
    var t = THEM[q.id]; if (!t) return;
    Object.keys(t).forEach(function (k) { if (k !== "phu") q[k] = t[k]; });
    if (t.phu && q.fig) { var f = q.fig; q.fig = function (goc) { PHU = goc ? t.phu : null; try { return f(); } finally { PHU = null; } }; }
  });


  window.TL_DATA = {
    bai: "lc7",
    ten: "Luyện tập chung (sau Bài 16)",
    items: ITEMS,
    /* Chia theo dạng (thầy chốt lại 27/11/2026: bài Luyện tập chung, Bài tập cuối chương cũng chia theo dạng như Bài 16).
       Mỗi dạng có phương pháp giải, bài xếp từ dễ đến khó, một bài mẫu giải theo 4 bước, bài tự luyện [đề, gợi ý, đáp số].
       Bài HSG không thuộc dạng nào: để riêng ở mục Dành cho HSG. */
    dang: [
      { ten: "Tính số đo góc, độ dài đoạn thẳng",
        pp: ["Tổng ba góc của một tam giác bằng 180°; trong tam giác vuông, hai góc nhọn có tổng 90°.",
             "Hai tam giác bằng nhau: viết đúng thứ tự các đỉnh tương ứng rồi đọc ra cạnh, góc tương ứng.",
             "Tam giác cân: hai góc ở đáy bằng nhau, góc ở đáy = (180° − góc ở đỉnh) : 2; tam giác đều mỗi góc 60°.",
             "Dùng thêm hai góc kề bù, hai góc đối đỉnh, tia nằm giữa hai tia để ghép hoặc tách góc."],
        ids: ["nb1", "nb2", "th2", "vd2"],
        tl: [
          ["Cho tam giác ABC cân tại A có ∠B = 70°. Tính số đo ∠C và ∠A.", "Hai góc ở đáy bằng nhau.", "∠C = 70°, ∠A = 40°."],
          ["Cho ΔMNP = ΔHIK, biết MN = 4 cm, NP = 5 cm và ∠K = 35°. Tính HI, IK và ∠P.", "Các cặp đỉnh tương ứng: M ↔ H, N ↔ I, P ↔ K.", "HI = 4 cm, IK = 5 cm, ∠P = 35°."],
          ["Cho tam giác ABC cân tại A có ∠A = 30°. Trên cạnh AC lấy điểm D sao cho BD = BC. Tính ∠ABD.", "Tam giác BDC cân tại B nên ∠BDC = ∠C.", "∠ABD = 45°."]] },
      { ten: "Chứng minh hai tam giác bằng nhau, suy ra cạnh, góc bằng nhau, hai đường thẳng song song",
        pp: ["Chọn hai tam giác chứa hai cạnh (hai góc) cần chứng minh bằng nhau.",
             "Tìm đủ ba yếu tố theo một trường hợp: c.c.c, c.g.c, g.c.g; tam giác vuông thì thêm các trường hợp cạnh huyền – góc nhọn, cạnh huyền – cạnh góc vuông, hai cạnh góc vuông.",
             "Yếu tố hay dùng: cạnh chung, góc chung, hai góc đối đỉnh, trung điểm, tia phân giác.",
             "Muốn chứng minh song song: chỉ ra hai góc so le trong (hoặc đồng vị) bằng nhau, thường là hai góc tương ứng của hai tam giác bằng nhau."],
        ids: ["nb3", "th3", "vd3", "vd1"],
        tl: [
          ["Cho tam giác ABC cân tại A có ∠BAC = 50°, M là trung điểm của BC. Tính ∠BAM và ∠AMB.", "ΔABM = ΔACM (c.c.c).", "∠BAM = 25°, ∠AMB = 90°."],
          ["Cho tam giác ABC có AB = AC. Tia phân giác của góc A cắt BC tại D. Chứng minh DB = DC và AD ⊥ BC.", "So sánh ΔABD và ΔACD.", "ΔABD = ΔACD (c.g.c) nên DB = DC và ∠ADB = ∠ADC = 90°."]] },
      { ten: "Tam giác cân và đường trung trực của đoạn thẳng",
        pp: ["Chứng minh tam giác cân: chỉ ra hai cạnh bằng nhau hoặc hai góc bằng nhau; nói rõ cân tại đỉnh nào.",
             "Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai đầu mút; ngược lại, điểm cách đều hai đầu mút thì nằm trên đường trung trực.",
             "Chứng minh một đường thẳng là đường trung trực của AB: chỉ ra hai điểm phân biệt của nó cùng cách đều A và B, hoặc nó vuông góc với AB tại trung điểm.",
             "Tam giác cân có một góc 60° là tam giác đều."],
        ids: ["th1", "vd5", "vd4"],
        tl: [
          ["Cho đoạn thẳng AB = 6 cm. Điểm M nằm trên đường trung trực của AB và MA = 6 cm. Tam giác MAB là tam giác gì? Tính ∠MAB.", "M nằm trên đường trung trực của AB thì MA = MB.", "Tam giác MAB đều; ∠MAB = 60°."],
          ["Cho tam giác ABC vuông tại A có ∠C = 30°. Trên cạnh BC lấy điểm M sao cho ∠BAM = 60°. Chứng minh M là trung điểm của BC.", "Tam giác ABM đều; tam giác AMC cân tại M.", "MB = MA = MC nên M là trung điểm của BC."],
          ["Cho tam giác ABC cân tại A có ∠A = 120°. Đường trung trực của AB cắt BC tại D. Tính ∠DAC.", "DA = DB nên ∠DAB = ∠B.", "∠DAC = 90°."]] }
    ],
    mau: { ids: ["vd2", "vd3", "vd4"], theoPhan: { bn: "vd3", tv: "vd3", cn: "vd2", tt: "vd4" } },
    _helpers: { foot: foot, cut: cut, add: add, pol: pol, iso: iso }
  };
})();
