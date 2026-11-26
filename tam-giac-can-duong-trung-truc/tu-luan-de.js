/* Bài tập tự luận – Bài 16. Tam giác cân. Đường trung trực của đoạn thẳng (Toán 7, Kết nối tri thức).
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
      s += DOT(q) + (v ? TX(q[0] + v[0] * 15, q[1] + v[1] * 15 + 5, k) : lab(q, (o.lc && o.lc[k]) ? g(o.lc[k]) : C, k));
    });
    return fb(svg(W, H, o.alt || "Hình vẽ", s));
  }
  /* tam giác cân tại đỉnh a, góc ở đỉnh d độ, cạnh bên r; trả về [đỉnh, trái, phải] */
  function iso(d, r) { r = r || 10; var A = [0, 0]; return [A, pol(A, r, 270 - d / 2), pol(A, r, 270 + d / 2)]; }

  var ITEMS = [
    /* ================= NHẬN BIẾT ================= */
    {
      id: "nb1", lv: "NB",
      de: "Cho tam giác ABC cân tại A có ∠A = 50°. Tính số đo ∠B và ∠C.",
      goi: "Tam giác cân thì hai góc ở đáy bằng nhau. Tổng ba góc của một tam giác bằng 180°.",
      fig: function () { var p = iso(50); return draw({ P: { A: p[0], B: p[1], C: p[2] }, fill: ["ABC"], tk: [["AB", 1], ["AC", 1]], arc: [["B", "A", "C"], ["C", "A", "B"]], ang: [["A", "B", "C", "50°", 44]], alt: "Tam giác ABC cân tại A, góc A bằng 50 độ" }); },
      steps: [
        "Vì tam giác ABC cân tại A nên ∠B = ∠C (hai góc ở đáy).",
        "Trong tam giác ABC: ∠A + ∠B + ∠C = 180°, suy ra ∠B + ∠C = 180° − 50° = 130°.",
        "Do đó ∠B = ∠C = 130° : 2 = 65°."
      ],
      dap: "∠B = ∠C = 65°.",
      loi: "Quên chia 2 (ghi ∠B = 130°), hoặc tính sai thứ tự thành 180° : 2 − 50° = 40°."
    },
    {
      id: "nb2", lv: "NB",
      de: "Cho tam giác MNP cân tại M có ∠N = 70°. Tính số đo ∠P và ∠M.",
      goi: "Đỉnh của tam giác cân là M, nên hai góc ở đáy là ∠N và ∠P.",
      fig: function () { var p = iso(40); return draw({ P: { M: p[0], N: p[1], P: p[2] }, fill: ["MNP"], tk: [["MN", 1], ["MP", 1]], ang: [["N", "M", "P", "70°", 40]], alt: "Tam giác MNP cân tại M, góc N bằng 70 độ" }); },
      steps: [
        "Vì tam giác MNP cân tại M nên ∠P = ∠N = 70°.",
        "Trong tam giác MNP: ∠M = 180° − (∠N + ∠P) = 180° − (70° + 70°) = 40°."
      ],
      dap: "∠P = 70°, ∠M = 40°.",
      loi: "Nhầm đỉnh của tam giác cân: cho ∠N là góc ở đỉnh rồi tính ∠M = ∠P = 55°."
    },
    {
      id: "nb3", lv: "NB",
      de: "Cho đoạn thẳng AB = 6 cm. Đường thẳng d là đường trung trực của đoạn thẳng AB, cắt AB tại O. Lấy điểm M thuộc d (M khác O) sao cho MA = 5 cm.<br>a) Tính độ dài OA, OB và MB.<br>b) Tam giác MAB là tam giác gì? Vì sao?",
      goi: "Đường trung trực đi qua trung điểm của đoạn thẳng. Điểm nằm trên đường trung trực thì cách đều hai mút của đoạn thẳng.",
      fig: function () { return fb(figPB({ lab: ["A", "B", "O", "M"], alt: "Đường trung trực d của đoạn thẳng AB cắt AB tại O, M thuộc d" })); },
      steps: [
        "a) Đường trung trực d đi qua trung điểm của AB, nên O là trung điểm của AB. Do đó OA = OB = 6 : 2 = 3 (cm).",
        "M nằm trên đường trung trực của AB nên M cách đều A và B: MB = MA = 5 cm.",
        "b) Tam giác MAB có MA = MB nên là tam giác cân tại M."
      ],
      dap: "a) OA = OB = 3 cm, MB = 5 cm. b) Tam giác MAB cân tại M.",
      loi: "Ghi OA = 6 cm (quên O là trung điểm), hoặc nói tam giác MAB cân tại O."
    },

    /* ================= THÔNG HIỂU ================= */
    {
      id: "th1", lv: "TH",
      de: "Cho tam giác ABC có ∠A = 80°, ∠B = 50°.<br>a) Chứng minh tam giác ABC là tam giác cân. Cân tại đỉnh nào?<br>b) Biết AB = 7 cm, BC = 9 cm. Tính chu vi tam giác ABC.",
      goi: "Tính ∠C trước. Tam giác có hai góc bằng nhau là tam giác cân; đỉnh là đỉnh còn lại (không thuộc hai góc bằng nhau).",
      fig: function () { var p = iso(80); return draw({ P: { A: p[0], B: p[1], C: p[2] }, fill: ["ABC"], arc: [["B", "A", "C"], ["C", "A", "B"]], ang: [["A", "B", "C", "80°", 34], ["B", "A", "C", "50°", 40]], alt: "Tam giác ABC có góc A 80 độ, góc B 50 độ" }); },
      steps: [
        "a) Trong tam giác ABC: ∠C = 180° − (∠A + ∠B) = 180° − (80° + 50°) = 50°.",
        "Tam giác ABC có ∠B = ∠C (= 50°) nên là tam giác cân tại A.",
        "b) Tam giác ABC cân tại A nên AC = AB = 7 cm.",
        "Chu vi tam giác ABC là AB + AC + BC = 7 + 7 + 9 = 23 (cm)."
      ],
      dap: "a) Tam giác ABC cân tại A. b) Chu vi bằng 23 cm.",
      loi: "Kết luận cân tại B hoặc C; hoặc cho BC = AB rồi tính chu vi 7 + 9 + 9."
    },
    {
      id: "th2", lv: "TH",
      de: "Cho tam giác ABC cân tại A. Gọi M là trung điểm của cạnh BC.<br>a) Chứng minh ΔABM = ΔACM.<br>b) Chứng minh AM vuông góc với BC và AM là tia phân giác của góc BAC.<br>c) Đường thẳng AM có phải là đường trung trực của đoạn thẳng BC không? Vì sao?",
      goi: "Hai tam giác ABM và ACM có ba cặp cạnh bằng nhau. Hai góc kề bù bằng nhau thì mỗi góc bằng 90°.",
      fig: function () { var p = iso(56), M = add(p[1], p[2], 0.5); return draw({ P: { A: p[0], B: p[1], C: p[2], M: M }, fill: ["ABC"], seg: ["AM"], tk: [["AB", 1], ["AC", 1], ["BM", 2], ["MC", 2]], rt: [["M", "A", "C"]], pos: { A: "n", B: "sw", C: "se", M: "s" }, alt: "Tam giác ABC cân tại A, M là trung điểm BC" }); },
      steps: [
        "a) Xét ΔABM và ΔACM có: AB = AC (tam giác ABC cân tại A); BM = CM (M là trung điểm của BC); AM là cạnh chung.<br>Do đó ΔABM = ΔACM (c.c.c).",
        "b) Từ câu a suy ra ∠AMB = ∠AMC (hai góc tương ứng). Mà ∠AMB + ∠AMC = 180° (hai góc kề bù) nên ∠AMB = ∠AMC = 90°, tức là AM ⊥ BC.",
        "Cũng từ câu a: ∠BAM = ∠CAM (hai góc tương ứng). Tia AM nằm giữa hai tia AB, AC nên AM là tia phân giác của góc BAC.",
        "c) Đường thẳng AM đi qua trung điểm M của BC và vuông góc với BC, nên AM là đường trung trực của đoạn thẳng BC."
      ],
      dap: "ΔABM = ΔACM (c.c.c); AM ⊥ BC; AM là tia phân giác góc BAC; AM là đường trung trực của BC.",
      loi: "Chỉ nêu hai cặp cạnh đã kết luận bằng nhau; hoặc kết luận AM ⊥ BC mà không chỉ ra hai góc kề bù bằng nhau.",
      mix: [13]
    },
    {
      id: "th3", lv: "TH",
      de: "Cho tam giác ABC cân tại A. Trên cạnh AB lấy điểm D, trên cạnh AC lấy điểm E sao cho AD = AE.<br>a) Chứng minh BE = CD.<br>b) Chứng minh tam giác ADE cân và ∠ADE = ∠ABC.",
      goi: "Xét hai tam giác ABE và ACD: chúng có chung góc A.",
      fig: function () { var p = iso(52), D = add(p[0], p[1], 0.45), E = add(p[0], p[2], 0.45); return draw({ P: { A: p[0], B: p[1], C: p[2], D: D, E: E }, fill: ["ABC"], seg: ["BE", "CD", "DE"], tk: [["AD", 1], ["AE", 1], ["DB", 2], ["EC", 2]], pos: { A: "n", B: "sw", C: "se", D: "w", E: "e" }, alt: "Tam giác ABC cân tại A, D trên AB, E trên AC, AD bằng AE" }); },
      steps: [
        "a) Xét ΔABE và ΔACD có: AB = AC (tam giác ABC cân tại A); ∠A là góc chung; AE = AD (giả thiết).<br>Do đó ΔABE = ΔACD (c.g.c), suy ra BE = CD (hai cạnh tương ứng).",
        "b) Tam giác ADE có AD = AE nên cân tại A. Do đó ∠ADE = (180° − ∠A) : 2.",
        "Tam giác ABC cân tại A nên ∠ABC = (180° − ∠A) : 2.",
        "Vậy ∠ADE = ∠ABC."
      ],
      dap: "BE = CD; tam giác ADE cân tại A; ∠ADE = ∠ABC.",
      loi: "Xét hai tam giác DBC và ECB mà chưa có đủ ba yếu tố; hoặc ghi sai thứ tự đỉnh tương ứng (ΔABE = ΔADC).",
      mix: [14]
    },

    /* ================= VẬN DỤNG ================= */
    {
      id: "vd1", lv: "VD",
      de: "Cho tam giác ABC cân tại A. Trên tia đối của tia BC lấy điểm D, trên tia đối của tia CB lấy điểm E sao cho BD = CE.<br>a) Chứng minh tam giác ADE cân.<br>b) Kẻ BH vuông góc với AD (H thuộc AD), CK vuông góc với AE (K thuộc AE). Chứng minh BH = CK.",
      goi: "a) ∠ABD và ∠ACE là hai góc kề bù với hai góc ở đáy. b) Hai tam giác vuông ABH và ACK có cạnh huyền AB = AC.",
      fig: function () {
        var p = iso(56, 10), A = p[0], B = p[1], C = p[2], D = add(C, B, 1.6), E = add(B, C, 1.6), H = foot(B, A, D), K = foot(C, A, E);
        return draw({ w: 300, P: { A: A, B: B, C: C, D: D, E: E, H: H, K: K }, fill: ["ABC"], seg: ["AD", "AE", "DE", "BH", "CK"], tk: [["AB", 1], ["AC", 1], ["DB", 2], ["CE", 2]], rt: [["H", "B", "A"], ["K", "C", "A"]], pos: { A: "n", B: "s", C: "s", D: "sw", E: "se", H: "nw", K: "ne" }, alt: "Tam giác ADE với B, C trên DE, BH vuông góc AD, CK vuông góc AE" });
      },
      steps: [
        "a) Tam giác ABC cân tại A nên ∠ABC = ∠ACB.<br>∠ABD = 180° − ∠ABC và ∠ACE = 180° − ∠ACB (hai góc kề bù), nên ∠ABD = ∠ACE.",
        "Xét ΔABD và ΔACE có: AB = AC; ∠ABD = ∠ACE; BD = CE (giả thiết).<br>Do đó ΔABD = ΔACE (c.g.c), suy ra AD = AE. Vậy tam giác ADE cân tại A.",
        "b) Từ ΔABD = ΔACE suy ra ∠BAD = ∠CAE (hai góc tương ứng), tức là ∠BAH = ∠CAK.",
        "Xét hai tam giác vuông ABH (vuông tại H) và ACK (vuông tại K) có: cạnh huyền AB = AC; góc nhọn ∠BAH = ∠CAK.<br>Do đó ΔABH = ΔACK (cạnh huyền – góc nhọn), suy ra BH = CK."
      ],
      dap: "a) AD = AE nên tam giác ADE cân tại A. b) ΔABH = ΔACK (cạnh huyền – góc nhọn) nên BH = CK.",
      loi: "Dùng ∠ABD = ∠ACE mà không giải thích (phải qua hai góc kề bù). Ở câu b, nhầm cạnh huyền là AH.",
      mix: [14, 15]
    },
    {
      id: "vd2", lv: "VD",
      de: "Cho tam giác ABC cân tại A có ∠A = 40°. Trên tia đối của tia AC lấy điểm D sao cho AD = AB.<br>a) Tính số đo các góc ∠ABC và ∠ADB.<br>b) Tính số đo góc ∠DBC.",
      goi: "Tam giác ABD cân tại A. ∠BAD kề bù với ∠BAC. Tia BA nằm giữa hai tia BD và BC.",
      fig: function () {
        var p = iso(40, 10), A = p[0], B = p[1], C = p[2], D = add(C, A, 2);
        return draw({ P: { A: A, B: B, C: C, D: D }, fill: ["ABC"], seg: ["AD", "BD"], tk: [["AB", 1], ["AC", 1], ["AD", 1]], ang: [["A", "B", "C", "40°", 40]], pos: { A: "ne", B: "sw", C: "se", D: "nw" }, alt: "Tam giác ABC cân tại A, D trên tia đối của AC với AD bằng AB" });
      },
      steps: [
        "a) Tam giác ABC cân tại A nên ∠ABC = ∠ACB = (180° − 40°) : 2 = 70°.",
        "∠BAD = 180° − ∠BAC = 180° − 40° = 140° (hai góc kề bù).<br>Tam giác ABD có AD = AB nên cân tại A, suy ra ∠ADB = ∠ABD = (180° − 140°) : 2 = 20°.",
        "b) Tia BA nằm giữa hai tia BD và BC nên ∠DBC = ∠ABD + ∠ABC = 20° + 70° = 90°."
      ],
      dap: "a) ∠ABC = 70°, ∠ADB = 20°. b) ∠DBC = 90°.",
      loi: "Dùng ∠BAD = 40° (quên góc kề bù) nên ra ∠ADB = 70°.",
      mix: [12]
    },
    {
      id: "vd3", lv: "VD",
      de: "Cho tam giác ABC có ∠B = 90°, ∠C = 30°, AB = 4 cm, AC = 8 cm. Đường trung trực của đoạn thẳng BC cắt cạnh AC tại D.<br>a) Tính số đo góc ∠ABD.<br>b) Tính chu vi tam giác ABD.<br>c) Chứng minh tam giác ABD là tam giác đều.",
      goi: "D nằm trên đường trung trực của BC nên DB = DC: tam giác DBC cân tại D.",
      fig: function () {
        var B = [0, 0], C = [10, 0], A = cut(B, pol(B, 1, 90), C, pol(C, 1, 150)), M = [5, 0], D = cut(M, [5, 1], A, C), T = [5, D[1] + 2.2];
        return draw({ P: { A: A, B: B, C: C, D: D, M: M, _t: T, _b: [5, -1.2] }, fill: ["ABC"], seg: ["BD"], thin: [["_t", "_b"]], tk: [["BM", 2], ["MC", 2]], rt: [["M", "C", "D"], ["B", "C", "A"]], ang: [["C", "A", "B", "30°", 44]], pos: { A: "nw", B: "sw", C: "se", D: "ne", M: "sw" }, alt: "Tam giác ABC vuông tại B, đường trung trực của BC cắt AC tại D" });
      },
      steps: [
        "a) D nằm trên đường trung trực của BC nên DB = DC. Tam giác DBC cân tại D, suy ra ∠DBC = ∠DCB = 30°.",
        "Tia BD nằm giữa hai tia BA và BC nên ∠ABD = ∠ABC − ∠DBC = 90° − 30° = 60°.",
        "b) Chu vi tam giác ABD là AB + BD + AD = AB + DC + AD (vì BD = DC).",
        "D nằm giữa A và C nên AD + DC = AC = 8 cm. Vậy chu vi tam giác ABD là 4 + 8 = 12 (cm).",
        "c) Trong tam giác ABC: ∠A = 180° − (90° + 30°) = 60°. Trong tam giác ABD: ∠ADB = 180° − ∠BAD − ∠ABD = 180° − 60° − 60° = 60°.",
        "Tam giác ABD có ∠BAD = ∠ABD nên cân tại D: DA = DB. Có ∠ABD = ∠ADB nên cân tại A: AB = AD. Vậy AB = BD = DA, tam giác ABD là tam giác đều."
      ],
      dap: "a) ∠ABD = 60°. b) Chu vi tam giác ABD bằng 12 cm. c) Tam giác ABD đều (khi đó AD = AB = 4 cm, D là trung điểm của AC).",
      loi: "Cho rằng thiếu độ dài BD, AD nên không tính được chu vi. Mấu chốt là thay BD bằng DC.",
      mix: [12]
    },

    /* ================= DÀNH CHO HỌC SINH GIỎI ================= */
    {
      id: "hsg1", lv: "HSG",
      de: "Cho tam giác ABC cân tại A. Trên tia đối của tia AB lấy điểm D sao cho AD = AB. Chứng minh ∠BCD = 90°.",
      goi: "Có AD = AB = AC, nên ngoài tam giác ABC còn một tam giác cân nữa. Đặt ∠B = x, ∠D = y rồi dùng tổng ba góc của tam giác BCD.",
      fig: function () {
        var p = iso(50, 10), A = p[0], B = p[1], C = p[2], D = add(B, A, 2);
        return draw({ P: { A: A, B: B, C: C, D: D }, fill: ["ABC"], seg: ["AD", "CD"], tk: [["AB", 1], ["AC", 1], ["AD", 1]], rt: [["C", "B", "D"]], pos: { A: "w", B: "sw", C: "se", D: "n" }, alt: "Tam giác ABC cân tại A, D trên tia đối của AB, AD bằng AB" });
      },
      steps: [
        "Vì AD = AB và AB = AC nên AD = AC: tam giác ACD cân tại A, suy ra ∠ACD = ∠ADC.",
        "Tam giác ABC cân tại A nên ∠ACB = ∠ABC.",
        "Tia CA nằm giữa hai tia CB và CD nên ∠BCD = ∠ACB + ∠ACD = ∠ABC + ∠ADC, tức là ∠BCD = ∠DBC + ∠BDC.",
        "Trong tam giác BCD: ∠BCD + ∠DBC + ∠BDC = 180°, suy ra 2 · ∠BCD = 180°, vậy ∠BCD = 90°."
      ],
      dap: "∠BCD = 90° với mọi tam giác ABC cân tại A.",
      loi: "Chỉ thử với một số đo cụ thể của góc A rồi kết luận; bài yêu cầu chứng minh cho mọi trường hợp.",
      mix: [12]
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Cho tam giác đều ABC. Trên các cạnh AB, BC, CA lần lượt lấy các điểm D, E, F sao cho AD = BE = CF. Chứng minh tam giác DEF là tam giác đều.",
      goi: "Ba tam giác ADF, BED, CFE có các cạnh tương ứng bằng nhau từng đôi: một cạnh bằng AD, một cạnh bằng phần còn lại của cạnh tam giác đều, góc xen giữa đều bằng 60°.",
      fig: function () {
        var A = [5, 8.66], B = [0, 0], C = [10, 0], t = 0.32, D = add(A, B, t), E = add(B, C, t), F = add(C, A, t);
        return draw({ P: { A: A, B: B, C: C, D: D, E: E, F: F }, fill: ["ABC"], seg: ["DE", "EF", "FD"], tk: [["AD", 1], ["BE", 1], ["CF", 1], ["DB", 2], ["EC", 2], ["FA", 2]], pos: { A: "n", B: "sw", C: "se", D: "w", E: "s", F: "e" }, alt: "Tam giác đều ABC, D E F trên ba cạnh, AD bằng BE bằng CF" });
      },
      steps: [
        "Tam giác ABC đều nên AB = BC = CA và ∠A = ∠B = ∠C = 60°.",
        "Vì AD = BE = CF nên DB = AB − AD, EC = BC − BE, FA = CA − CF bằng nhau: DB = EC = FA.",
        "Xét ΔADF và ΔBED có: AD = BE; ∠A = ∠B (= 60°); AF = BD. Do đó ΔADF = ΔBED (c.g.c), suy ra DF = ED.",
        "Tương tự, ΔBED = ΔCFE (c.g.c) (BE = CF, ∠B = ∠C, BD = CE), suy ra ED = FE.",
        "Vậy DF = ED = FE, nên tam giác DEF là tam giác đều."
      ],
      dap: "ΔADF = ΔBED = ΔCFE (c.g.c) nên DE = EF = FD: tam giác DEF đều.",
      loi: "Ghép nhầm cặp cạnh (lấy AD với BD); phải chọn đúng góc xen giữa hai cạnh.",
      mix: [14]
    },
    {
      id: "hsg3", lv: "HSG",
      de: "Cho tam giác ABC vuông cân tại A. Gọi M là trung điểm của BC. Trên cạnh AB lấy điểm D, trên cạnh AC lấy điểm E sao cho AD = CE.<br>a) Chứng minh AM ⊥ BC và MA = MB = MC.<br>b) Chứng minh MD = ME và MD ⊥ ME.",
      goi: "a) Chứng minh ΔAMB = ΔAMC, rồi tính các góc của tam giác AMB. b) Xét ΔMAD và ΔMCE; chú ý ∠MAD = ∠MCE = 45°.",
      fig: function () {
        var A = [5, 5], B = [0, 0], C = [10, 0], M = [5, 0], t = 0.35, D = add(A, B, t), E = add(C, A, t);
        return draw({ P: { A: A, B: B, C: C, M: M, D: D, E: E }, fill: ["ABC"], seg: ["AM", "MD", "ME"], tk: [["AD", 1], ["CE", 1], ["BM", 2], ["MC", 2]], rt: [["A", "B", "C"], ["M", "A", "C"]], pos: { A: "n", B: "sw", C: "se", M: "s", D: "w", E: "e" }, alt: "Tam giác ABC vuông cân tại A, M trung điểm BC, D trên AB, E trên AC" });
      },
      steps: [
        "a) Tam giác ABC vuông cân tại A nên AB = AC và ∠B = ∠C = 45°.<br>Xét ΔAMB và ΔAMC có: AB = AC; MB = MC; AM chung. Do đó ΔAMB = ΔAMC (c.c.c).",
        "Suy ra ∠AMB = ∠AMC, mà hai góc này kề bù nên ∠AMB = 90°, tức là AM ⊥ BC. Cũng có ∠BAM = ∠CAM = 90° : 2 = 45°.",
        "Tam giác AMB có ∠B = ∠BAM = 45° nên cân tại M: MA = MB. Mà MB = MC nên MA = MB = MC.",
        "b) Xét ΔMAD và ΔMCE có: MA = MC (câu a); ∠MAD = ∠MCE (= 45°); AD = CE (giả thiết). Do đó ΔMAD = ΔMCE (c.g.c), suy ra MD = ME và ∠AMD = ∠CME.",
        "Tia MA nằm giữa hai tia MD và ME nên ∠DME = ∠DMA + ∠AME = ∠CME + ∠AME = ∠AMC = 90°. Vậy MD ⊥ ME."
      ],
      dap: "MA = MB = MC; ΔMAD = ΔMCE (c.g.c) nên MD = ME và ∠DME = 90°.",
      loi: "Dùng MA = MB mà chưa chứng minh; hoặc ghép ΔMAD với ΔMBE (sai cặp góc 45°).",
      mix: [13, 14]
    },
    {
      id: "hsg4", lv: "HSG",
      de: "Cho tam giác ABC cân tại A. Trên cạnh AC lấy điểm D sao cho AD = BD = BC. Tính số đo góc ∠A.",
      goi: "Đặt ∠A = x. Tam giác ABD cân tại D, tam giác BCD cân tại B. Lần lượt biểu diễn ∠ADB, ∠BDC, ∠C, ∠ABC theo x.",
      fig: function () {
        var p = iso(36, 10), A = p[0], B = p[1], C = p[2], D = add(C, A, 0.382);
        return draw({ P: { A: A, B: B, C: C, D: D }, fill: ["ABC"], seg: ["BD"], tk: [["AD", 1], ["BD", 1], ["BC", 1], ["AB", 2]], pos: { A: "n", B: "sw", C: "se", D: "e" }, alt: "Tam giác ABC cân tại A, D trên AC với AD bằng BD bằng BC" });
      },
      steps: [
        "Đặt ∠A = x. Tam giác ABD có DA = DB nên cân tại D: ∠ABD = ∠A = x. Suy ra ∠ADB = 180° − 2x.",
        "∠BDC = 180° − ∠ADB = 2x (hai góc kề bù).",
        "Tam giác BCD có BD = BC nên cân tại B: ∠C = ∠BDC = 2x.",
        "Tam giác ABC cân tại A nên ∠ABC = ∠C = 2x. Trong tam giác ABC: x + 2x + 2x = 180°, suy ra 5x = 180°, x = 36°.",
        "Vậy ∠A = 36° (khi đó ∠B = ∠C = 72°)."
      ],
      dap: "∠A = 36°.",
      loi: "Nhầm tam giác BCD cân tại D (BD = BC thì cân tại B, hai góc bằng nhau là ∠BDC và ∠BCD).",
      mix: [12]
    },
    {
      id: "hsg5", lv: "HSG",
      de: "Cho tam giác ABC cân tại A. Trên cạnh AB lấy điểm D, trên tia đối của tia CA lấy điểm E sao cho BD = CE. Kẻ DH và EK vuông góc với đường thẳng BC (H, K thuộc đường thẳng BC). Đoạn thẳng DE cắt BC tại I.<br>a) Chứng minh DH = EK.<br>b) Chứng minh I là trung điểm của DE.",
      goi: "a) ∠ECK và ∠ACB là hai góc đối đỉnh. b) DH và EK cùng vuông góc với BC nên DH // EK; tìm cặp góc so le trong.",
      fig: function () {
        var p = iso(64, 10), A = p[0], B = p[1], C = p[2], t = 0.38, D = add(B, A, t), E = add(C, A, -t), H = foot(D, B, C), K = foot(E, B, C), I = cut(D, E, B, C);
        return draw({ w: 300, P: { A: A, B: B, C: C, D: D, E: E, H: H, K: K, I: I }, fill: ["ABC"], seg: ["CE", "DE", "DH", "EK", "CK"], tk: [["BD", 1], ["CE", 1], ["DI", 2], ["IE", 2]], rt: [["H", "D", "C"], ["K", "E", "B"]], pos: { A: "n", B: "sw", C: "ne", D: "w", E: "s", H: "s", I: "sw", K: "e" }, alt: "Tam giác ABC cân tại A, D trên AB, E trên tia đối của CA, DE cắt BC tại I" });
      },
      steps: [
        "a) Tam giác ABC cân tại A nên ∠ABC = ∠ACB. Mà ∠ECK = ∠ACB (hai góc đối đỉnh) nên ∠DBH = ∠ECK.",
        "Xét hai tam giác vuông DBH (vuông tại H) và ECK (vuông tại K) có: cạnh huyền BD = CE; góc nhọn ∠DBH = ∠ECK.<br>Do đó ΔDBH = ΔECK (cạnh huyền – góc nhọn), suy ra DH = EK.",
        "b) DH ⊥ BC và EK ⊥ BC nên DH // EK. Suy ra ∠HDI = ∠KEI (hai góc so le trong).",
        "Xét hai tam giác vuông DHI (vuông tại H) và EKI (vuông tại K) có: DH = EK (câu a); ∠HDI = ∠KEI.<br>Do đó ΔDHI = ΔEKI (cạnh góc vuông – góc nhọn kề), suy ra ID = IE.",
        "I nằm trên đoạn DE và ID = IE nên I là trung điểm của DE."
      ],
      dap: "ΔDBH = ΔECK nên DH = EK; ΔDHI = ΔEKI nên ID = IE, I là trung điểm DE.",
      loi: "Viết ∠DBH = ∠ECK mà không nói qua góc đối đỉnh; ở câu b quên chứng minh DH // EK trước khi dùng góc so le trong.",
      mix: [10, 15]
    }
  ];

  window.TL_DATA = {
    bai: "cn7",
    ten: "Bài 16. Tam giác cân. Đường trung trực của đoạn thẳng",
    items: ITEMS,
    _helpers: { foot: foot, cut: cut, add: add, pol: pol, iso: iso }
  };
})();
