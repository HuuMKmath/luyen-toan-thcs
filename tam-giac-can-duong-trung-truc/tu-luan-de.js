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
      fig: function () { var p = iso(50); return draw({ P: { A: p[0], B: p[1], C: p[2] }, fill: ["ABC"], tk: [["AB", 1], ["AC", 1]], ang: [["A", "B", "C", "50°", 44]], alt: "Tam giác ABC cân tại A, góc A bằng 50 độ" }); },
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
      fig: function () { return fb(figPB({ lab: ["A", "B", "O", "M"], tick: false, alt: "Đường trung trực d của đoạn thẳng AB cắt AB tại O, M thuộc d" })); },
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
      fig: function () { var p = iso(80); return draw({ P: { A: p[0], B: p[1], C: p[2] }, fill: ["ABC"], ang: [["A", "B", "C", "80°", 34], ["B", "A", "C", "50°", 40]], alt: "Tam giác ABC có góc A 80 độ, góc B 50 độ" }); },
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
      fig: function () { var p = iso(56), M = add(p[1], p[2], 0.5); return draw({ P: { A: p[0], B: p[1], C: p[2], M: M }, fill: ["ABC"], seg: ["AM"], tk: [["AB", 1], ["AC", 1], ["BM", 2], ["MC", 2]], pos: { A: "n", B: "sw", C: "se", M: "s" }, alt: "Tam giác ABC cân tại A, M là trung điểm BC" }); },
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
      fig: function () { var p = iso(52), D = add(p[0], p[1], 0.45), E = add(p[0], p[2], 0.45); return draw({ P: { A: p[0], B: p[1], C: p[2], D: D, E: E }, fill: ["ABC"], seg: ["BE", "CD", "DE"], tk: [["AD", 1], ["AE", 1]], pos: { A: "n", B: "sw", C: "se", D: "w", E: "e" }, alt: "Tam giác ABC cân tại A, D trên AB, E trên AC, AD bằng AE" }); },
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
    {
      id: "vd4", lv: "VD",
      de: "Cho tam giác ABC vuông cân tại A. Gọi M là trung điểm của BC. Trên cạnh AB lấy điểm D, trên cạnh AC lấy điểm E sao cho AD = CE.<br>a) Chứng minh AM ⊥ BC và MA = MB = MC.<br>b) Chứng minh MD = ME và MD ⊥ ME.",
      goi: "a) Chứng minh ΔAMB = ΔAMC, rồi tính các góc của tam giác AMB. b) Xét ΔMAD và ΔMCE; chú ý ∠MAD = ∠MCE = 45°.",
      fig: function () {
        var A = [5, 5], B = [0, 0], C = [10, 0], M = [5, 0], t = 0.35, D = add(A, B, t), E = add(C, A, t);
        return draw({ P: { A: A, B: B, C: C, M: M, D: D, E: E }, fill: ["ABC"], seg: ["AM", "MD", "ME"], tk: [["AD", 1], ["CE", 1], ["BM", 2], ["MC", 2]], rt: [["A", "B", "C"]], pos: { A: "n", B: "sw", C: "se", M: "s", D: "w", E: "e" }, alt: "Tam giác ABC vuông cân tại A, M trung điểm BC, D trên AB, E trên AC" });
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
      id: "vd5", lv: "VD",
      de: "Cho tam giác ABC cân tại A. Trên cạnh AB lấy điểm D, trên tia đối của tia CA lấy điểm E sao cho BD = CE. Kẻ DH và EK vuông góc với đường thẳng BC (H, K thuộc đường thẳng BC). Đoạn thẳng DE cắt BC tại I.<br>a) Chứng minh DH = EK.<br>b) Chứng minh I là trung điểm của DE.",
      goi: "a) ∠ECK và ∠ACB là hai góc đối đỉnh. b) DH và EK cùng vuông góc với BC nên DH // EK; tìm cặp góc so le trong.",
      fig: function () {
        var p = iso(64, 10), A = p[0], B = p[1], C = p[2], t = 0.38, D = add(B, A, t), E = add(C, A, -t), H = foot(D, B, C), K = foot(E, B, C), I = cut(D, E, B, C);
        return draw({ w: 300, P: { A: A, B: B, C: C, D: D, E: E, H: H, K: K, I: I }, fill: ["ABC"], seg: ["CE", "DE", "DH", "EK", "CK"], tk: [["BD", 1], ["CE", 1]], rt: [["H", "D", "C"], ["K", "E", "B"]], pos: { A: "n", B: "sw", C: "ne", D: "w", E: "s", H: "s", I: "sw", K: "e" }, alt: "Tam giác ABC cân tại A, D trên AB, E trên tia đối của CA, DE cắt BC tại I" });
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
    },

    /* ================= DÀNH CHO HỌC SINH GIỎI ================= */
    {
      id: "hsg1", lv: "HSG",
      de: "Cho tam giác ABC cân tại A có ∠A = 20°. Trên cạnh AC lấy điểm D sao cho AD = BC. Tính số đo góc ∠ABD.",
      goi: "Dựng thêm tam giác đều BCE với E nằm trong tam giác ABC. Khi đó BE = BC = AD; hãy tìm một cặp tam giác bằng nhau có chứa AD và BE.",
      hieu: { gt: "ΔABC cân tại A, ∠A = 20°; D nằm trên cạnh AC, AD = BC.", kl: "Tính ∠ABD.",
        hoi: [
          ["Đề cho gì về góc? Em tính ngay được những góc nào?", "Tam giác ABC cân tại A nên ∠B = ∠C = (180° − 20°) : 2 = 80°."],
          ["Đo thử trên hình: ∠ABD khoảng bao nhiêu độ?", "Khoảng 10°, bằng nửa ∠A. Đó mới là dự đoán, em giữ làm đích và đi tìm lí do."],
          ["Giả thiết AD = BC có gì khó dùng?", "Hai đoạn AD và BC nằm xa nhau, không cùng thuộc tam giác nào. Phải tìm cách đưa chúng lại gần nhau."]] },
      nguoc: [
      { ten: "Tính ∠ABD", dich: "Tính ∠ABD",
        sd: [
          ["ΔBAD = ΔABE (c.g.c), nên ∠ABD = ∠BAE; và tính được ∠BAE", [4, 5]],
          ["∠BAD = ∠ABE (= 20°), AD = BE (= BC); ΔABE = ΔACE (c.c.c) nên ∠BAE = 10°", [2, 3]],
          ["Vẽ tam giác đều BCE; ∠ABC = 80°", [1, 2]]],
        gt: "ΔABC cân tại A, ∠A = 20°, AD = BC",
        ket: "∠ABD = ∠BAE = 10°.",
        buoc: [
        { hoi: "Nhìn hình: ∠ABD nằm trong tam giác nào? Tam giác đó đã biết những gì?",
          chon: [
            ["ΔABD: mới biết ∠BAD = 20° và cạnh AD (= BC)", true, "Đúng. Tam giác ABD mới biết một góc; cạnh AD thì bằng BC, một đoạn nằm ở chỗ khác trên hình."],
            ["ΔABC: đã biết ∠ABC = 80°", false, "∠ABD chỉ là một phần của ∠ABC; phần còn lại ∠DBC cũng chưa biết, nên chưa suy ra được."]],
          dat: "ΔABD: mới biết ∠A = 20° và AD (= BC)" },
        { hoi: "Tam giác ABD mới biết một góc, nên tổng ba góc chưa giúp được. Ngoài cách đó, em đã học cách nào khác để biết số đo một góc?",
          nho: "Hai tam giác bằng nhau thì các góc tương ứng bằng nhau. Tam giác cân có hai góc ở đáy bằng nhau. Hai góc đối đỉnh thì bằng nhau.",
          chon: [
            ["Hai góc đối đỉnh thì bằng nhau", false, "Ở đỉnh B không có hai đường thẳng cắt nhau nào tạo ra góc đối đỉnh với ∠ABD."],
            ["Tam giác cân có hai góc ở đáy bằng nhau", false, "Tam giác ABD không có hai cạnh nào bằng nhau (đề cho AD = BC, không phải AD = AB hay AD = BD), nên không dùng được."],
            ["Hai tam giác bằng nhau thì góc tương ứng bằng nhau: tìm một tam giác bằng ΔABD mà góc ứng với ∠ABD tính được", true, "Đúng. Nếu ΔABD bằng một tam giác khác thì ∠ABD bằng góc tương ứng của tam giác đó."]],
          dat: "Một tam giác bằng ΔABD có góc đã biết" },
        { hoi: "AD = BC nhưng hai đoạn nằm xa nhau. Em thử tìm tam giác bằng ΔABD mà có chung cạnh AB với nó. Khi đó ở đỉnh B phải có những gì giống ở đỉnh A?",
          nho: "Trường hợp bằng nhau cạnh – góc – cạnh: hai cạnh và góc xen giữa của tam giác này bằng hai cạnh và góc xen giữa của tam giác kia.",
          chon: [
            ["Một góc bằng ∠BAD = 20° và một đoạn bằng AD, tức là bằng BC", true, "Khi đó hai tam giác có AB chung, một cặp góc 20° và một cặp cạnh bằng nhau: bằng nhau theo c.g.c."],
            ["Một góc bằng ∠ADB", false, "∠ADB chưa biết số đo, nên không vẽ được góc bằng nó."],
            ["Một đoạn bằng BD", false, "BD chưa biết, và không dùng được giả thiết AD = BC."]],
          dat: "Ở đỉnh B: một góc 20° và một đoạn bằng BC" },
        { ve: 1, hoi: "Ở đỉnh B đang có ∠ABC = 80°. Bớt đi bao nhiêu độ thì còn 20°? Góc đó gợi em vẽ thêm hình gì?",
          nho: "Tam giác đều có ba cạnh bằng nhau và mỗi góc bằng 60°.",
          chon: [
            ["Vẽ đường cao AH của tam giác ABC", false, "AH chia góc A thành hai góc 10°, nhưng không tạo ra ở B một góc 20° hay một đoạn bằng BC."],
            ["Vẽ tam giác đều BCE, với E nằm trong tam giác ABC", true, "80° − 60° = 20°. Tam giác đều BCE cho luôn BE = BC = AD và ∠ABE = 80° − 60° = 20° = ∠BAD. Cả hai thứ đang thiếu cùng xuất hiện."],
            ["Lấy trung điểm của cạnh AC", false, "Trung điểm của AC không liên quan đến độ dài BC, không tạo được đoạn bằng AD ở đỉnh B."]],
          dat: "Vẽ tam giác đều BCE: BE = BC = AD, ∠ABE = 20° = ∠BAD" },
        { hoi: "ΔBAD và ΔABE có AB chung, ∠BAD = ∠ABE, AD = BE nên bằng nhau (c.g.c). Vậy ∠ABD bằng góc nào?",
          nho: "Viết hai tam giác bằng nhau theo đúng thứ tự các đỉnh tương ứng, rồi đọc ra các góc tương ứng.",
          chon: [
            ["∠ABE", false, "Ghép nhầm đỉnh: ∠ABE ứng với ∠BAD (cùng bằng 20°), không phải với ∠ABD."],
            ["∠BAE", true, "Viết đúng thứ tự đỉnh ΔBAD = ΔABE: đỉnh B ứng với A, A ứng với B, D ứng với E. Nên ∠ABD ứng với ∠BAE."],
            ["∠AEB", false, "∠AEB ứng với ∠ADB (đỉnh E ứng với đỉnh D), không phải ∠ABD."]],
          dat: "∠ABD = ∠BAE (vì ΔBAD = ΔABE)" },
        { hoi: "Muốn tính ∠BAE, em xem: điểm E và điểm A có chung tính chất gì đối với hai điểm B và C?",
          nho: "Điểm cách đều hai đầu mút của một đoạn thẳng thì nằm trên đường trung trực của đoạn thẳng đó.",
          chon: [
            ["Cả hai đều cách đều B và C, nên AE là đường trung trực của BC", true, "EB = EC và AB = AC nên A, E cùng nằm trên đường trung trực của BC. Nhìn hình thấy ngay AE chia đôi góc A; chứng minh: ΔABE = ΔACE (c.c.c) nên ∠BAE = ∠CAE = 20° : 2 = 10°."],
            ["Tam giác ABE cân tại B", false, "Nếu BA = BE thì BA = BC (vì BE = BC), khi đó tam giác ABC cân tại B và ∠A = ∠C. Nhưng ∠A = 20° còn ∠C = 80°."],
            ["∠BAE = ∠ABE", false, "Nếu vậy thì tam giác ABE cân tại E, tức là EA = EB; không có cơ sở nào cho điều này."]],
          dat: "AE là đường trung trực của BC: ∠BAE = 10° (ΔABE = ΔACE, c.c.c)" }] }],
      nhin: [
        ["Thử lại: với ∠ABD = 10°, tính các góc còn lại trên hình. Có hợp lí không?", "∠ADB = 180° − 20° − 10° = 150°, ∠BDC = 30°, ∠DBC = 80° − 10° = 70°. Trong tam giác BDC: 70° + 30° + 80° = 180°. Hợp lí, và khớp với dự đoán ở bước 1."],
        ["Vì sao lại nghĩ đến tam giác đều?", "Vì ở đỉnh B cần một góc 20° = ∠A, mà 80° − 60° = 20°. Góc 60° gợi tam giác đều, lại cho luôn đoạn BE = BC."],
        ["Bài toán đảo: cho ΔABC cân tại A, ∠A = 20°, D trên cạnh AC sao cho ∠ABD = 10°. Chứng minh AD = BC. Em thử làm nhé.", "Vẫn vẽ tam giác đều BCE như trên, có ∠BAE = 10°. ΔABD và ΔBAE có ∠BAD = ∠ABE (= 20°), AB chung, ∠ABD = ∠BAE (= 10°) nên bằng nhau (g.c.g). Suy ra AD = BE = BC."]],
      fig: function (goc) {
        var p = iso(20, 10), A = p[0], B = p[1], C = p[2], a = Math.hypot(C[0] - B[0], C[1] - B[1]);
        var D = add(A, C, a / 10), E = [(B[0] + C[0]) / 2, B[1] + a * Math.sqrt(3) / 2];
        return draw({ goc: goc, phu: ["E"],  P: { A: A, B: B, C: C, D: D, E: E }, fill: ["ABC"], seg: ["BD"], thin: ["BE", "CE", "AE"], tk: [["AD", 1], ["BC", 1]], ang: [["A", "B", "C", "20°", 48]], pos: { A: "n", B: "sw", C: "se", D: "e", E: "w" }, alt: "Tam giác ABC cân tại A, góc A 20 độ, D trên AC với AD bằng BC, tam giác đều BCE dựng thêm" });
      },
      steps: [
        "Tam giác ABC cân tại A nên ∠ABC = ∠ACB = (180° − 20°) : 2 = 80°.",
        "Vẽ tam giác đều BCE với E nằm trong tam giác ABC (E và A cùng phía đối với BC). Khi đó BE = CE = BC và ∠EBC = ∠ECB = 60°.<br>Vì ∠EBC = 60° < ∠ABC = 80° nên ∠ABE = 80° − 60° = 20°; tương tự ∠ACE = 20°.",
        "Xét ΔABE và ΔACE có: AB = AC; BE = CE; AE là cạnh chung. Do đó ΔABE = ΔACE (c.c.c), suy ra ∠BAE = ∠CAE = 20° : 2 = 10°.",
        "Xét ΔBAD và ΔABE có: AB là cạnh chung; ∠BAD = ∠ABE (= 20°); AD = BE (vì cùng bằng BC).<br>Do đó ΔBAD = ΔABE (c.g.c).",
        "Suy ra ∠ABD = ∠BAE = 10° (hai góc tương ứng)."
      ],
      dap: "∠ABD = 10°.",
      loi: "Đo trên hình rồi đoán kết quả; bài cần dựng thêm tam giác đều BCE mới chứng minh được. Lưu ý ghép đúng cặp: AD ứng với BE, ∠BAD ứng với ∠ABE.",
      mix: [12, 13, 14]
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Cho tam giác ABC có ∠B = 2 · ∠C. Tia phân giác của góc A cắt cạnh BC tại D. Trên cạnh AC lấy điểm E sao cho AE = AB.<br>a) Chứng minh ΔABD = ΔAED.<br>b) Chứng minh tam giác DEC cân.<br>c) Chứng minh AC = AB + BD.",
      goi: "Câu b: ∠AED = ∠ABD = 2 · ∠C, rồi tính ∠EDC theo ∠C. Câu c: AC = AE + EC.",
      hieu: { gt: "ΔABC, ∠B = 2 · ∠C; AD là tia phân giác của góc A (D thuộc BC); E thuộc AC, AE = AB.", kl: "a) ΔABD = ΔAED. b) Tam giác DEC cân. c) AC = AB + BD.",
        hoi: [
          ["Kết luận câu c có dạng gì?", "Một đoạn bằng tổng hai đoạn: AC = AB + BD."],
          ["Ba câu a, b, c có liên quan với nhau không?", "Có. Câu a và câu b là bậc thang để làm câu c. Khi phân tích câu c, em sẽ thấy chúng xuất hiện."]] },
      nguoc: [
      { ten: "Câu c (cả bài)", dich: "AC = AB + BD",
        sd: [
          ["EC = BD, vì AC = AE + EC và AE = AB", [4]],
          ["ED = EC (tam giác DEC cân tại E) và BD = ED", [1, 3]],
          ["∠EDC = ∠C, tính từ ∠DEC = 180° − ∠AED", [2, 3]],
          ["ΔABD = ΔAED (c.g.c): BD = ED, ∠AED = ∠B = 2 · ∠C", [1]]],
        gt: "AE = AB, AD là tia phân giác của góc A, ∠B = 2 · ∠C",
        ket: "Có ∠EDC = ∠C nên ED = EC; lại có BD = ED nên EC = BD, do đó AC = AB + BD. Đi ngược như vậy cũng cho ta luôn câu a và câu b.",
        buoc: [
        { hoi: "Kết luận AC = AB + BD: AC là đoạn dài, AB và BD là hai đoạn ngắn. Nhìn hình, trên đoạn dài AC đề đã cho sẵn điểm nào? Điểm đó giúp gì?",
          nho: "Cách tách đoạn: trên đoạn dài, lấy một đoạn bằng đoạn ngắn thứ nhất; chỉ còn phải chứng minh phần còn lại bằng đoạn ngắn thứ hai.",
          chon: [
            ["Tính độ dài AC, AB, BD rồi so sánh", false, "Đề không cho số đo độ dài nên không tính được."],
            ["Chứng minh AB = BD", false, "Không có cơ sở. Hơn nữa nếu có thì chỉ được AB + BD = 2 · AB, vẫn chưa nói gì về AC."],
            ["Điểm E: AE = AB, nên AC = AE + EC = AB + EC; chỉ còn phải chứng minh EC = BD", true, "Đúng. Đề đã cắt sẵn trên AC một đoạn AE bằng AB. Phần còn lại EC phải bằng BD."]],
          dat: "EC = BD (vì AC = AE + EC, AE = AB)" },
        { hoi: "EC và BD nằm xa nhau, không cùng tam giác nào. Trên hình có đoạn nào vừa chạm BD vừa chạm EC, làm \"cầu nối\" được không?",
          nho: "Hai đoạn cùng bằng một đoạn thứ ba thì bằng nhau.",
          chon: [
            ["Đoạn DE: chung điểm D với BD, chung điểm E với EC. Cần BD = DE và DE = EC", true, "Đúng. DE là đoạn trung gian: BD = DE và DE = EC thì BD = EC."],
            ["Đoạn AD", false, "AD chạm BD tại D nhưng không chạm EC, nên không nối được hai đoạn."],
            ["Chứng minh EC = AB", false, "Không có cơ sở, và AB = AE chứ không bằng EC."]],
          dat: "BD = ED và ED = EC (ED là đoạn trung gian)" },
        { hoi: "Muốn có BD = ED: tam giác nào chứa BD, tam giác nào chứa ED, và chúng có sẵn những gì bằng nhau?",
          nho: "Tia phân giác của một góc chia góc đó thành hai góc bằng nhau. Trường hợp bằng nhau cạnh – góc – cạnh.",
          chon: [
            ["ΔABD và ΔAED: AB = AE, ∠BAD = ∠EAD, AD chung (đây là câu a)", true, "ΔABD = ΔAED (c.g.c), suy ra BD = ED và ∠AED = ∠B."],
            ["D là trung điểm của BE", false, "D nằm trên BC, không nằm trên BE, nên không thể là trung điểm của BE."],
            ["Tam giác BDE đều", false, "Không có góc 60° nào trong đề, không có cơ sở."]],
          dat: "ΔABD = ΔAED (c.g.c) nên BD = ED, ∠AED = ∠B (câu a)" },
        { hoi: "Muốn có ED = EC, tức là tam giác DEC cân tại đỉnh nào? Cần hai góc nào bằng nhau?",
          nho: "Tam giác có hai góc bằng nhau thì là tam giác cân; đỉnh cân là đỉnh không nằm trên cạnh kề hai góc đó.",
          chon: [
            ["Cân tại D, cần ∠DEC = ∠DCE", false, "Tam giác DEC cân tại D cho DE = DC, không phải ED = EC."],
            ["Cân tại E, cần ∠EDC = ∠ECD, tức là ∠EDC = ∠C", true, "Hai góc kề cạnh DC bằng nhau thì đỉnh cân là E, nên ED = EC. Đây là câu b."],
            ["Cần DE ⊥ AC", false, "Không có cơ sở, và góc vuông không cho ra hai cạnh bằng nhau."]],
          dat: "∠EDC = ∠C (câu b)" },
        { hoi: "Giả thiết ∠B = 2 · ∠C chưa dùng đến. Câu a cho ∠AED bằng góc nào? Từ đó tính ∠EDC thế nào?",
          nho: "Hai góc kề bù có tổng bằng 180°. Tổng ba góc của một tam giác bằng 180°.",
          chon: [
            ["∠AED = ∠B = 2 · ∠C, nên ∠DEC = 180° − 2 · ∠C (kề bù); tổng ba góc của tam giác DEC cho ∠EDC = ∠C", true, "∠EDC = 180° − ∠DEC − ∠C = 180° − (180° − 2 · ∠C) − ∠C = ∠C. Đã dùng hết giả thiết."],
            ["∠EDC = ∠ADB vì hai góc đối đỉnh", false, "Hai góc này không đối đỉnh (DE và DA không phải hai tia đối nhau)."],
            ["∠EDC = ∠BAD", false, "Không có cơ sở để hai góc này bằng nhau."]],
          dat: "∠AED = ∠B = 2 · ∠C (giả thiết), tổng ba góc của ΔDEC" }] }],
      nhin: [
        ["Em đã dùng hết giả thiết chưa? Mỗi giả thiết dùng ở đâu?", "Tia phân giác AD dùng ở câu a; AE = AB dùng ở câu a và câu c; ∠B = 2 · ∠C dùng ở câu b."],
        ["Thứ tự phân tích (c → a → b) và thứ tự trình bày (a → b → c) khác nhau thế nào?", "Phân tích đi từ kết luận ngược về giả thiết; trình bày thì đi xuôi. Vì thế đề hỏi câu a, b trước: đó chính là các bậc thang mà phân tích câu c tìm ra."],
        ["Bài toán đảo: cho ΔABC có tia phân giác AD (D thuộc BC) và AC = AB + BD. Chứng minh ∠B = 2 · ∠C. Em thử làm nhé.", "Lấy E trên AC với AE = AB. ΔABD = ΔAED (c.g.c) nên ED = BD và ∠AED = ∠B. EC = AC − AE = BD = ED nên tam giác DEC cân tại E, ∠EDC = ∠C. Do đó ∠DEC = 180° − 2 · ∠C, nên ∠AED = 180° − ∠DEC = 2 · ∠C, tức là ∠B = 2 · ∠C."]],
      fig: function (goc) {
        var B = [0, 0], C = [10, 0], A = cut(B, pol(B, 1, 76), C, pol(C, 1, 142)), ab = Math.hypot(A[0], A[1]), ac = Math.hypot(C[0] - A[0], C[1] - A[1]);
        var D = add(B, C, ab / (ab + ac)), E = add(A, C, ab / ac);
        return draw({ goc: goc,  P: { A: A, B: B, C: C, D: D, E: E }, fill: ["ABC"], seg: ["AD", "DE"], tk: [["AB", 1], ["AE", 1]], arc: [["A", "B", "D", 1], ["A", "D", "C", 1]], pos: { A: "n", B: "sw", C: "se", D: "s", E: "ne" }, alt: "Tam giác ABC có góc B bằng hai lần góc C, AD là tia phân giác, E trên AC với AE bằng AB" });
      },
      steps: [
        "a) Xét ΔABD và ΔAED có: AB = AE (giả thiết); ∠BAD = ∠EAD (AD là tia phân giác của góc A); AD là cạnh chung.<br>Do đó ΔABD = ΔAED (c.g.c), suy ra BD = ED và ∠AED = ∠ABD = 2 · ∠C.",
        "b) ∠DEC = 180° − ∠AED = 180° − 2 · ∠C (hai góc kề bù).",
        "Trong tam giác DEC: ∠EDC = 180° − ∠DEC − ∠C = 180° − (180° − 2 · ∠C) − ∠C = ∠C.<br>Tam giác DEC có ∠EDC = ∠ECD nên cân tại E, suy ra ED = EC.",
        "c) E nằm trên cạnh AC nên AC = AE + EC = AB + ED = AB + BD."
      ],
      dap: "ΔABD = ΔAED (c.g.c); tam giác DEC cân tại E; AC = AB + BD.",
      loi: "Ở câu b kết luận tam giác DEC cân tại D (sai): hai góc bằng nhau là ∠EDC và ∠ECD nên đỉnh là E.",
      mix: [8, 12, 14]
    },
    {
      id: "hsg3", lv: "HSG",
      de: "Cho tam giác ABC cân tại A có ∠A = 80°. Điểm M nằm trong tam giác sao cho ∠MBC = 10° và ∠MCB = 30°.<br>a) Chứng minh BM = BA.<br>b) Tính số đo góc ∠AMC.",
      goi: "Vẽ tia phân giác của góc ABM, cắt tia CM tại K. Tam giác KBC có hai góc 30° nên KB = KC. Tính ∠AKB và ∠BKM, rồi so sánh ΔBKA với ΔBKM.",
      hieu: { gt: "ΔABC cân tại A, ∠A = 80°; M nằm trong tam giác, ∠MBC = 10°, ∠MCB = 30°.", kl: "a) BM = BA. b) Tính ∠AMC.",
        hoi: [
          ["Tính hết các góc đã biết trên hình.", "∠B = ∠C = (180° − 80°) : 2 = 50°; ∠ABM = 50° − 10° = 40°; ∠ACM = 50° − 30° = 20°."],
          ["Kết luận câu a nói gì về tam giác ABM?", "BM = BA nghĩa là tam giác ABM cân tại B. Nhưng chưa biết ∠BAM, ∠BMA nên chưa chứng minh trực tiếp được."]] },
      nguoc: [
      { ten: "Câu a", dich: "BM = BA",
        sd: [
          ["ΔBKA = ΔBKM (g.c.g)", [5]],
          ["∠ABK = ∠MBK (= 20°), BK chung, ∠BKA = ∠BKM (= 120°)", [2, 4]],
          ["∠BAK = 40° (ΔAKB = ΔAKC, c.c.c) và ∠BKC = 120°", [3, 4]],
          ["KB = KC, vì tam giác KBC có ∠KBC = ∠KCB = 30°", [2]],
          ["Vẽ tia phân giác BK của góc ABM (∠ABM = 40°), K nằm trên tia CM", [1, 2]]],
        gt: "ΔABC cân tại A, ∠A = 80°, ∠MBC = 10°, ∠MCB = 30°",
        ket: "ΔBKA = ΔBKM (g.c.g) nên BM = BA.",
        buoc: [
        { hoi: "Nhìn hình: BA và BM cùng là cạnh của tam giác nào? Tam giác đó đã biết những gì?",
          chon: [
            ["ΔABM: mới biết ∠ABM = 40°", true, "Đúng. Muốn BA = BM thì ΔABM phải cân tại B, tức là ∠BAM = ∠BMA. Nhưng chưa biết vị trí của M so với A nên chưa tính được hai góc này."],
            ["ΔABC", false, "BM không phải là cạnh của tam giác ABC."]],
          dat: "ΔABM cân tại B: chưa chứng minh trực tiếp được" },
        { hoi: "Chưa chứng minh trực tiếp được tam giác ABM cân. Em đã học cách nào khác để chứng minh hai đoạn thẳng bằng nhau?",
          nho: "Hai tam giác bằng nhau thì các cạnh tương ứng bằng nhau. Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai đầu mút.",
          chon: [
            ["Hai cạnh tương ứng của hai tam giác bằng nhau: một tam giác có cạnh BA, một tam giác có cạnh BM", true, "Đúng. BA và BM cùng đi ra từ B, nên nghĩ tới hai tam giác có chung một cạnh đi ra từ B."],
            ["Điểm nằm trên đường trung trực thì cách đều hai đầu mút: chứng minh M nằm trên đường trung trực của AB", false, "M nằm trên đường trung trực của AB thì cho MA = MB, không phải BM = BA."]],
          dat: "Hai tam giác bằng nhau chứa BA và BM, chung một cạnh ở B" },
        { ve: 1, hoi: "Trên hình chưa có hai tam giác như vậy. Nếu tam giác ABM cân tại B thì BA và BM nằm \"đối xứng\" nhau qua đường nào đi ra từ B? Vẽ thêm đường đó làm cạnh chung.",
          nho: "Tia phân giác của một góc chia góc đó thành hai góc bằng nhau.",
          chon: [
            ["Nối A với M", false, "Chỉ được tam giác ABM, vẫn chưa biết góc nào ở A hay M, không tạo thêm tam giác nào."],
            ["Vẽ tia phân giác của góc ABM", true, "∠ABM = 40° nên tia phân giác chia thành hai góc 20°. Hai tam giác có cạnh chung nằm trên tia này sẽ có một cặp góc bằng nhau ở B."],
            ["Vẽ đường vuông góc từ B xuống AC", false, "Đường này không chia đôi góc ABM, nên không tạo được cặp góc bằng nhau ở B."]],
          dat: "Vẽ tia phân giác của góc ABM: hai góc 20° ở B" },
        { hoi: "Tia phân giác đó tạo với BC một góc bao nhiêu độ? Em thấy có gì trùng hợp với đề?",
          nho: "Tam giác có hai góc bằng nhau là tam giác cân.",
          chon: [
            ["10° + 20° = 30°, đúng bằng ∠MCB. Gọi K là giao điểm của tia phân giác với tia CM thì tam giác KBC có hai góc 30°", true, "∠KBC = ∠KCB = 30° nên tam giác KBC cân tại K: KB = KC. Bây giờ đã có hai tam giác ΔBKA và ΔBKM chung cạnh BK."],
            ["20°, bằng ∠ACM", false, "20° là góc giữa tia phân giác và BA (hoặc BM). Góc với BC là ∠MBC + 20° = 10° + 20° = 30°."]],
          dat: "K = tia phân giác ∩ tia CM: ∠KBC = ∠KCB = 30°, KB = KC" },
        { hoi: "ΔBKA và ΔBKM đã có BK chung, ∠ABK = ∠MBK (= 20°). Muốn chúng bằng nhau theo g.c.g, cần thêm gì?",
          nho: "Trường hợp bằng nhau góc – cạnh – góc: một cạnh và hai góc kề cạnh đó.",
          chon: [
            ["BA = BM", false, "Đó là điều phải chứng minh, không được dùng làm điều kiện."],
            ["KA = KM", false, "Chưa biết, và đây là điều suy ra sau khi hai tam giác bằng nhau."],
            ["∠BKA = ∠BKM", true, "Đó là hai góc kề cạnh BK ở đỉnh K."]],
          dat: "∠BKA = ∠BKM" },
        { hoi: "∠BKM = ∠BKC = 180° − 30° − 30° = 120°. Muốn tính ∠BKA, cần biết ∠BAK. KB = KC cho em biết gì về vị trí của K?",
          nho: "Điểm cách đều hai đầu mút của một đoạn thẳng thì nằm trên đường trung trực của đoạn thẳng đó.",
          chon: [
            ["K nằm trên đường trung trực của BC, cùng với A; do đó AK chia đôi góc A, ∠BAK = 40°", true, "KB = KC và AB = AC nên ΔAKB = ΔAKC (c.c.c), suy ra ∠BAK = ∠CAK = 40°. Khi đó ∠BKA = 180° − 40° − 20° = 120° = ∠BKM."],
            ["K là trung điểm của CM", false, "Không có cơ sở; KB = KC nói về khoảng cách từ K đến B và C, không nói gì về đoạn CM."]],
          dat: "AK là trung trực của BC: ∠BAK = 40°, ∠BKA = 120° = ∠BKM" }] },
      { ten: "Câu b", dich: "Tính ∠AMC",
        sd: [
          ["∠AMC = 180° − ∠AMK (M nằm giữa C và K)", [6]],
          ["Tam giác AKM cân tại K (KA = KM, câu a) và ∠AKM = 120°", [5, 6]],
          ["∠AKC = ∠AKB = 120° (ΔAKB = ΔAKC)", [3, 4]]],
        gt: "Giả thiết và kết quả câu a",
        ket: "∠AMK = (180° − 120°) : 2 = 30°, nên ∠AMC = 180° − 30° = 150°.",
        buoc: [
        { hoi: "∠AMC chưa tính trực tiếp được. ∠AMC kề bù với góc nào dễ tính hơn?",
          nho: "Hai góc kề bù có tổng bằng 180°.",
          chon: [
            ["∠AMK, vì M nằm giữa C và K", true, "∠AMC = 180° − ∠AMK. Góc ∠AMK nằm trong tam giác AKM, mà câu a đã cho KA = KM: tam giác AKM cân tại K."],
            ["∠MAC, rồi dùng tổng ba góc của tam giác AMC", false, "∠MAC không kề bù với ∠AMC. Hơn nữa tam giác AMC mới biết ∠ACM = 20°, còn thiếu hai góc."]],
          dat: "Tính ∠AMK (vì ∠AMC = 180° − ∠AMK)" },
        { hoi: "Tam giác AKM cân tại K (KA = KM). Muốn tính ∠AMK, ta cần biết góc nào?",
          nho: "Trong tam giác cân, hai góc ở đáy bằng nhau; biết góc ở đỉnh thì tính được góc ở đáy.",
          chon: [
            ["∠KAM", false, "Chưa biết ∠KAM, tìm nó cũng khó như tìm ∠AMK."],
            ["∠AKM ở đỉnh", true, "Tam giác cân biết góc ở đỉnh thì tính được góc ở đáy: ∠AMK = (180° − ∠AKM) : 2."]],
          dat: "Tính ∠AKM" },
        { hoi: "Muốn tính ∠AKM (= ∠AKC), ta dựa vào đâu?",
          chon: [
            ["ΔAKB = ΔAKC (c.c.c) ở câu a, nên ∠AKC = ∠AKB = 120°", true, "AB = AC, KB = KC, AK chung. Góc ∠AKB = 120° đã tính ở câu a."],
            ["∠AKC = ∠BKC vì cùng có đỉnh K", false, "Chung đỉnh không đủ để hai góc bằng nhau; phải chứng minh qua hai tam giác bằng nhau."]],
          dat: "∠AKC = ∠AKB = 120° (ΔAKB = ΔAKC)" }] }],
      nhin: [
        ["Khi đã có BA = BM ở câu a, câu b còn cách nào nhanh hơn không?", "Có. Tam giác BAM cân tại B, ∠ABM = 40° nên ∠BAM = (180° − 40°) : 2 = 70°, suy ra ∠MAC = 80° − 70° = 10°. Tam giác AMC có ∠MCA = 20° nên ∠AMC = 180° − 10° − 20° = 150°. Không cần kẻ thêm gì."],
        ["Thử lại: hai cách tính ∠AMC có cho cùng một kết quả không?", "Cả hai đều cho ∠AMC = 150°."],
        ["Vì sao lại nghĩ ra tia phân giác của góc ABM?", "Muốn tam giác ABM cân tại B thì BA, BM phải đối xứng qua tia phân giác góc B. Vẽ ra mới thấy tia đó tạo với BC góc 30°, trùng với ∠MCB, nên tạo được tam giác cân KBC."]],
      fig: function (goc) {
        var p = iso(80, 10), A = p[0], B = p[1], C = p[2];
        var M = cut(B, pol(B, 1, 10), C, pol(C, 1, 150)), K = cut(B, pol(B, 1, 30), C, M);
        return draw({ goc: goc, phu: ["K"],  w: 300, P: { A: A, B: B, C: C, M: M, K: K }, fill: ["ABC"], seg: ["BM", "CM", "CK", "AM"], thin: ["BK", "AK"], ang: [["B", "M", "C", "10°", 80], ["C", "B", "M", "30°", 50]], pos: { A: "n", B: "sw", C: "se", M: "ne", K: "nw" }, alt: "Tam giác ABC cân tại A, điểm M bên trong, tia phân giác của góc ABM cắt tia CM tại K" });
      },
      steps: [
        "∠ABC = ∠ACB = (180° − 80°) : 2 = 50°, nên ∠ABM = 50° − 10° = 40°.",
        "Vẽ tia phân giác của góc ABM, cắt tia CM tại K. Khi đó ∠ABK = ∠MBK = 40° : 2 = 20° và ∠KBC = 10° + 20° = 30°.<br>Tam giác KBC có ∠KBC = ∠KCB = 30° nên cân tại K: KB = KC. Vì ∠MBC = 10° < 30° = ∠KBC nên M nằm giữa C và K.",
        "Xét ΔAKB và ΔAKC có: AB = AC; KB = KC; AK là cạnh chung. Do đó ΔAKB = ΔAKC (c.c.c), suy ra ∠BAK = ∠CAK = 80° : 2 = 40° và ∠AKB = ∠AKC.",
        "Trong tam giác ABK: ∠AKB = 180° − 40° − 20° = 120°.<br>Trong tam giác BKC: ∠BKC = 180° − 30° − 30° = 120°, nên ∠BKM = 120°.",
        "a) Xét ΔBKA và ΔBKM có: ∠ABK = ∠MBK (= 20°); BK là cạnh chung; ∠BKA = ∠BKM (= 120°).<br>Do đó ΔBKA = ΔBKM (g.c.g), suy ra BA = BM và KA = KM.",
        "b) Từ bước trên: ∠AKC = ∠AKB = 120°, tức là ∠AKM = 120°. Tam giác AKM có KA = KM nên cân tại K: ∠KMA = (180° − 120°) : 2 = 30°.<br>Vì M nằm giữa C và K nên ∠AMC = 180° − ∠AMK = 180° − 30° = 150° (hai góc kề bù)."
      ],
      dap: "a) BM = BA. b) ∠AMC = 150°.",
      loi: "Nhầm vị trí của M và K trên tia CM (M phải nằm giữa C và K); hoặc dùng ∠BKM = 60° thay cho 120°.",
      mix: [12, 13, 14]
    },
    {
      id: "hsg4", lv: "HSG",
      de: "Cho tam giác ABC có ba góc nhọn. Vẽ ra phía ngoài tam giác ABC các tam giác ABD vuông cân tại A và ACE vuông cân tại A.<br>a) Chứng minh BE = CD.<br>b) Chứng minh BE ⊥ CD.",
      goi: "Câu a: ∠BAE và ∠DAC cùng bằng 90° + ∠BAC. Câu b: gọi I là giao điểm của BE và CD, K là giao điểm của AB và CD; so sánh tam giác ADK với tam giác IBK.",
      hieu: { gt: "ΔABC có ba góc nhọn; ΔABD vuông cân tại A, ΔACE vuông cân tại A (vẽ ra phía ngoài).", kl: "a) BE = CD. b) BE ⊥ CD.",
        hoi: [
          ["Hai tam giác vuông cân cho em những gì bằng nhau?", "AB = AD, AC = AE (hai cặp cạnh đi ra từ A) và ∠BAD = ∠CAE = 90°."],
          ["Tô màu hai đoạn BE và CD. Mỗi đoạn nối với A thành tam giác nào?", "BE nằm trong ΔABE, CD nằm trong ΔADC."]] },
      nguoc: [
      { ten: "Câu a", dich: "BE = CD",
        sd: [
          ["ΔABE = ΔADC (c.g.c)", [2]],
          ["AB = AD, AE = AC, ∠BAE = ∠DAC (= ∠BAC + 90°)", [1]]],
        gt: "ΔABD, ΔACE vuông cân tại A",
        ket: "ΔABE = ΔADC (c.g.c) nên BE = CD.",
        buoc: [
        { hoi: "Ở bước 1 em đã thấy BE nằm trong ΔABE, CD nằm trong ΔADC. Muốn BE = CD thì cần hai tam giác nào bằng nhau, ghép đỉnh thế nào?",
          nho: "Hai tam giác bằng nhau thì các cạnh tương ứng bằng nhau; phải viết đúng thứ tự các đỉnh tương ứng.",
          chon: [
            ["ΔABE = ΔACD", false, "Ghép nhầm đỉnh: AB ứng với AD, AE ứng với AC, nên phải viết ΔABE = ΔADC."],
            ["ΔABE = ΔADC", true, "AB = AD nên B ứng với D; AE = AC nên E ứng với C. BE và DC là hai cạnh tương ứng."],
            ["BE và CD cùng bằng BC", false, "Không có cơ sở, nói chung BE và CD không bằng BC."]],
          dat: "ΔABE = ΔADC" },
        { hoi: "ΔABE và ΔADC đã có AB = AD, AE = AC. Cần thêm điều gì để bằng nhau theo c.g.c?",
          nho: "Trường hợp cạnh – góc – cạnh: góc phải xen giữa hai cạnh.",
          chon: [
            ["∠BAE = ∠DAC (góc xen giữa)", true, "∠BAE xen giữa AB, AE; ∠DAC xen giữa AD, AC."],
            ["∠ABE = ∠ADC", false, "Góc này không xen giữa hai cặp cạnh đã có, và nó là điều suy ra sau."]],
          dat: "∠BAE = ∠DAC" },
        { hoi: "∠BAE và ∠DAC, mỗi góc gồm những phần nào?",
          chon: [
            ["Cả hai đều bằng 90°", false, "Quên góc ∠BAC: ∠BAE gồm ∠BAC và ∠CAE."],
            ["Cả hai đều bằng ∠BAC + 90°", true, "∠BAE = ∠BAC + ∠CAE và ∠DAC = ∠DAB + ∠BAC, với ∠CAE = ∠DAB = 90° (giả thiết)."]],
          dat: "∠BAE = ∠DAC = ∠BAC + 90° (giả thiết hai tam giác vuông cân)" }] },
      { ten: "Câu b", dich: "BE ⊥ CD",
        sd: [
          ["∠BIK = 90°: trong tam giác IBK cần ∠IBK + ∠BKI = 90°", [5]],
          ["∠IBK = ∠ADK (câu a), ∠BKI = ∠AKD (đối đỉnh)", [4]],
          ["Tam giác ADK vuông tại A: ∠ADK + ∠AKD = 90°", [3]]],
        gt: "∠BAD = 90° và kết quả câu a",
        ket: "∠BIK = 180° − ∠IBK − ∠IKB = 180° − ∠ADK − ∠AKD = ∠DAK = 90°, nên BE ⊥ CD.",
        buoc: [
        { ve: 1, hoi: "Muốn chứng minh BE ⊥ CD, ta cần chứng minh điều gì?",
          nho: "Hai đường thẳng cắt nhau tạo thành một góc vuông thì vuông góc với nhau.",
          chon: [
            ["Gọi I là giao điểm của BE và CD, chứng minh một góc tại I bằng 90°", true, "Hai đường thẳng vuông góc khi chúng cắt nhau tạo thành một góc vuông."],
            ["BE ⊥ AC", false, "Điều này nói chung không đúng, và cũng không liên quan đến CD."]],
          dat: "Một góc tại I bằng 90° (I là giao điểm của BE và CD)" },
        { hoi: "Trên hình đã có sẵn góc vuông nào ở gần I? Gọi K là giao điểm của AB và CD: góc vuông đó nằm trong tam giác nào?",
          chon: [
            ["∠DAB = 90°, nằm trong tam giác ADK", true, "Tam giác ADK vuông tại A. Nó có chung đỉnh K với tam giác IBK, tam giác chứa góc ở I cần tìm."],
            ["∠ABC, vì tam giác ABC có ba góc nhọn", false, "Ba góc nhọn thì không có góc nào vuông."]],
          dat: "ΔADK vuông tại A (K là giao điểm của AB và CD)" },
        { hoi: "ΔADK và ΔIBK có những cặp góc nào bằng nhau? Từ đó suy ra gì về ∠BIK?",
          nho: "Hai góc đối đỉnh thì bằng nhau. Tổng ba góc của một tam giác bằng 180°.",
          chon: [
            ["∠AKD = ∠IKB (đối đỉnh) và ∠ADK = ∠IBK (từ câu a), nên góc còn lại cũng bằng nhau: ∠BIK = ∠DAK = 90°", true, "Hai tam giác có hai cặp góc bằng nhau thì cặp góc thứ ba cũng bằng nhau, vì tổng ba góc của mỗi tam giác đều bằng 180°."],
            ["AD = IB nên hai tam giác bằng nhau", false, "Không có cơ sở cho AD = IB. Ở đây không cần hai tam giác bằng nhau, chỉ cần các góc."]],
          dat: "∠AKD = ∠IKB (đối đỉnh), ∠ADK = ∠IBK (câu a)" }] }],
      nhin: [
        ["Giả thiết \"ba góc nhọn\" dùng ở đâu?", "Để hình đúng như đã vẽ: ∠BAE = 90° + ∠BAC vẫn nhỏ hơn 180°, BE và CD cắt nhau ở trong như hình."],
        ["Câu b có cách nào khác không?", "Có thể dùng góc vuông ∠CAE trong tam giác ACE: gọi L là giao điểm của AC và BE, so sánh tam giác AEL với tam giác ICL (∠AEB = ∠ACD từ câu a). Em thử viết ra nhé."],
        ["Mở rộng: thay hai tam giác vuông cân bằng hai tam giác đều ABD, ACE vẽ ra phía ngoài. BE và CD còn bằng nhau không? Góc ∠BIK bằng bao nhiêu?", "Vẫn có BE = CD, vì ∠BAE = ∠DAC = ∠BAC + 60° (cùng cách câu a). Làm như câu b: ∠BIK = ∠DAK = 60°."]],
      fig: function (goc) {
        var A = [3.2, 7.5], B = [0, 0], C = [10, 0];
        var rot = function (o, p, s) { return [o[0] - s * (p[1] - o[1]), o[1] + s * (p[0] - o[0])]; };
        var D = rot(A, B, -1), E = rot(A, C, 1), I = cut(B, E, C, D), K = cut(A, B, C, D);
        return draw({ goc: goc, phu: ["I", "K"],  w: 340, P: { A: A, B: B, C: C, D: D, E: E, I: I, K: K }, fill: ["ABC"], seg: ["AD", "BD", "AE", "CE", "BE", "CD"], tk: [["AB", 1], ["AD", 1], ["AC", 2], ["AE", 2]], rt: [["A", "B", "D"], ["A", "C", "E"]], pos: { A: "n", B: "sw", C: "se", D: "w", E: "e", I: "s", K: "w" }, alt: "Tam giác ABC, ra ngoài vẽ tam giác vuông cân ABD và ACE tại A, BE cắt CD tại I" });
      },
      steps: [
        "a) Tam giác ABD vuông cân tại A nên AD = AB, ∠BAD = 90°. Tam giác ACE vuông cân tại A nên AE = AC, ∠CAE = 90°.<br>∠BAE = ∠BAC + ∠CAE = ∠BAC + 90° và ∠DAC = ∠DAB + ∠BAC = 90° + ∠BAC, nên ∠BAE = ∠DAC.",
        "Xét ΔABE và ΔADC có: AB = AD; ∠BAE = ∠DAC; AE = AC. Do đó ΔABE = ΔADC (c.g.c), suy ra BE = DC và ∠ABE = ∠ADC.",
        "b) Gọi I là giao điểm của BE và CD, K là giao điểm của AB và CD. Tam giác ADK vuông tại A nên ∠ADK + ∠AKD = 90°.",
        "Ta có ∠IBK = ∠ABE = ∠ADC = ∠ADK và ∠BKI = ∠AKD (hai góc đối đỉnh). Do đó ∠IBK + ∠BKI = 90°.",
        "Trong tam giác IBK: ∠BIK = 180° − (∠IBK + ∠BKI) = 180° − 90° = 90°. Vậy BE ⊥ CD."
      ],
      dap: "ΔABE = ΔADC (c.g.c) nên BE = CD; ∠BIK = 90° nên BE ⊥ CD.",
      loi: "Ghép nhầm ΔABE với ΔACD (thứ tự đỉnh sai làm sai góc tương ứng); hoặc cho ∠BAE = 90° mà quên cộng ∠BAC.",
      mix: [8, 12, 14]
    },
    {
      id: "hsg5", lv: "HSG",
      de: "Cho tam giác ABC có ∠A = 60°. Tia phân giác của góc B cắt AC tại D, tia phân giác của góc C cắt AB tại E; BD và CE cắt nhau tại I. Chứng minh ID = IE.",
      goi: "Tính ∠BIC rồi suy ra ∠BIE và ∠CID. Kẻ tia phân giác IF của góc BIC (F thuộc BC), so sánh IE và ID với IF.",
      hieu: { gt: "ΔABC, ∠A = 60°; BD là tia phân giác của góc B (D thuộc AC), CE là tia phân giác của góc C (E thuộc AB); BD cắt CE tại I.", kl: "ID = IE.",
        hoi: [
          ["Đo thử trên hình: ID và IE có bằng nhau không? ΔIBE và ΔICD có bằng nhau không?", "ID = IE, nhưng hai tam giác IBE và ICD không bằng nhau (hình dạng khác hẳn). Vậy không chứng minh trực tiếp được, cần một cách khác."],
          ["Giả thiết ∠A = 60° có vẻ đặc biệt. Em đoán nó sẽ dùng để làm gì?", "Để tính được góc tại I, nơi hai tia phân giác cắt nhau."]] },
      nguoc: [
      { ten: "Chứng minh ID = IE", dich: "ID = IE",
        sd: [
          ["IE = IF và ID = IF", [4, 5]],
          ["ΔBIE = ΔBIF, ΔCID = ΔCIF (g.c.g): cần ∠BIE = ∠BIF, ∠CID = ∠CIF", [4, 5]],
          ["Kẻ tia phân giác IF của góc BIC: ∠BIF = ∠CIF = 60°", [3]],
          ["∠BIC = 120°, nên ∠BIE = ∠CID = 60°", [1, 2]]],
        gt: "∠A = 60°, BD và CE là các tia phân giác",
        ket: "ΔBIE = ΔBIF và ΔCID = ΔCIF (g.c.g) nên IE = IF = ID.",
        buoc: [
        { hoi: "Nhìn hình: ID và IE là cạnh của những tam giác nào? Có cặp tam giác bằng nhau nào chứa chúng không?",
          nho: "Hai đoạn cùng bằng một đoạn thứ ba thì bằng nhau.",
          chon: [
            ["ΔIBE và ΔICD, và hai tam giác này bằng nhau", false, "Ở bước 1 em đã đo: hai tam giác có hình dạng khác hẳn. Chúng chỉ có ∠BIE = ∠CID (đối đỉnh), không có cặp cạnh nào bằng nhau."],
            ["ΔIBE và ΔICD, nhưng hai tam giác này không bằng nhau; phải tìm một đoạn trung gian bằng cả ID và IE", true, "Đúng. Khi hai đoạn không nằm trong hai tam giác bằng nhau, ta so sánh cả hai với một đoạn thứ ba."],
            ["ΔIDE: chứng minh tam giác này đều", false, "Không có cơ sở; nói chung tam giác IDE không đều."]],
          dat: "Một đoạn trung gian bằng cả ID và IE" },
        { hoi: "Với hai tia phân giác và ∠A = 60°, em tính được những góc nào tại I?",
          nho: "Tổng ba góc của một tam giác bằng 180°. Hai góc kề bù có tổng bằng 180°.",
          chon: [
            ["∠BIC = 120°, nên ∠BIE = ∠CID = 60°", true, "∠B + ∠C = 120° nên ∠IBC + ∠ICB = 60°, ∠BIC = 180° − 60° = 120°. ∠BIE và ∠CID kề bù với ∠BIC nên cùng bằng 60°."],
            ["∠BIC = 60°", false, "60° là tổng ∠IBC + ∠ICB. Còn ∠BIC = 180° − 60° = 120°."]],
          dat: "∠BIC = 120°, ∠BIE = ∠CID = 60° (vì ∠A = 60°)" },
        { ve: 1, hoi: "Đoạn trung gian nên đi ra từ I (chung đầu I với ID và IE). Quanh I đang có hai góc 60° và góc ∠BIC = 120°. Kẻ thêm thế nào để có thêm hai góc 60°?",
          nho: "Tia phân giác của một góc chia góc đó thành hai góc bằng nhau.",
          chon: [
            ["Kẻ IH ⊥ BC", false, "ΔBIH có góc vuông ở H, còn ΔBIE nói chung không có góc vuông, nên không ghép được hai tam giác bằng nhau."],
            ["Kẻ tia phân giác IF của góc BIC (F thuộc BC)", true, "120° chia đôi thành hai góc 60°: ∠BIF = ∠CIF = 60°, bằng ∠BIE và ∠CID. ΔBIF ghép với ΔBIE (chung BI), ΔCIF ghép với ΔCID (chung CI)."],
            ["Nối I với trung điểm của BC", false, "Trung điểm của BC không tạo ra góc nào bằng nhau ở I."]],
          dat: "Kẻ tia phân giác IF của ∠BIC: ∠BIF = ∠CIF = 60°" },
        { hoi: "Bây giờ ΔBIE và ΔBIF có gì chung, gì bằng nhau?",
          nho: "Trường hợp bằng nhau góc – cạnh – góc.",
          chon: [
            ["BI chung, ∠EBI = ∠FBI, ∠BIE = ∠BIF = 60°: bằng nhau theo g.c.g", true, "Suy ra IE = IF. Tương tự ΔCID = ΔCIF cho ID = IF, nên ID = IE."],
            ["BI chung, BE = BF: bằng nhau theo c.g.c", false, "BE = BF chưa biết, đó là điều suy ra sau khi hai tam giác bằng nhau."]],
          dat: "ΔBIE = ΔBIF, ΔCID = ΔCIF (g.c.g)" }] }],
      nhin: [
        ["Giả thiết ∠A = 60° dùng ở đâu? Nếu ∠A khác 60° thì cách làm còn dùng được không?", "Dùng để tính ∠BIC = 120°, nhờ đó tia phân giác IF tạo ra hai góc 60° bằng ∠BIE và ∠CID. Nếu ∠A khác 60° thì ∠BIF không còn bằng ∠BIE, cách làm không dùng được."],
        ["Thử lại: tính ∠DIE.", "∠DIE = ∠BIC = 120° (đối đỉnh). Tam giác IDE cân tại I có góc ở đỉnh 120°."],
        ["Mở rộng: trên hình đã kẻ, chứng minh BC = BE + CD.", "ΔBIE = ΔBIF cho BE = BF; ΔCID = ΔCIF cho CD = CF. F nằm giữa B và C nên BC = BF + FC = BE + CD."]],
      fig: function (goc) {
        var B = [0, 0], C = [10, 0], A = cut(B, pol(B, 1, 70), C, pol(C, 1, 130)), ab = Math.hypot(A[0], A[1]), ac = Math.hypot(C[0] - A[0], C[1] - A[1]), bc = 10;
        var D = add(A, C, ab / (ab + bc)), E = add(A, B, ac / (ac + bc)), I = cut(B, D, C, E), F = cut(I, add(B, C, 0.5), B, C);
        var bis = function (v, p, q) { var a = Math.atan2(p[1] - v[1], p[0] - v[0]), b = Math.atan2(q[1] - v[1], q[0] - v[0]), x = Math.cos(a) + Math.cos(b), y = Math.sin(a) + Math.sin(b); return [v[0] + x, v[1] + y]; };
        F = cut(I, bis(I, B, C), B, C);
        return draw({ goc: goc, phu: ["F"],  P: { A: A, B: B, C: C, D: D, E: E, I: I, F: F }, fill: ["ABC"], seg: ["BD", "CE"], thin: ["IF"], arc: [["B", "A", "D", 1], ["B", "D", "C", 1], ["C", "B", "E", 2], ["C", "E", "A", 2]], ang: [["A", "B", "C", "60°", 30]], pos: { A: "n", B: "sw", C: "se", D: "ne", E: "nw", I: "n", F: "s" }, alt: "Tam giác ABC có góc A 60 độ, hai tia phân giác BD và CE cắt nhau tại I, IF là tia phân giác góc BIC" });
      },
      steps: [
        "Trong tam giác ABC: ∠B + ∠C = 180° − 60° = 120°. BD, CE là các tia phân giác nên ∠IBC + ∠ICB = (∠B + ∠C) : 2 = 60°.",
        "Trong tam giác IBC: ∠BIC = 180° − 60° = 120°. Suy ra ∠BIE = 180° − 120° = 60° và ∠CID = 180° − 120° = 60° (hai góc kề bù).",
        "Kẻ tia phân giác IF của góc BIC (F thuộc BC): ∠BIF = ∠CIF = 60°.",
        "Xét ΔBIE và ΔBIF có: ∠EBI = ∠FBI (BD là tia phân giác góc B); BI là cạnh chung; ∠BIE = ∠BIF (= 60°). Do đó ΔBIE = ΔBIF (g.c.g), suy ra IE = IF.",
        "Tương tự, ΔCID = ΔCIF (g.c.g), suy ra ID = IF. Vậy ID = IE."
      ],
      dap: "IE = IF và ID = IF nên ID = IE.",
      loi: "Chứng minh trực tiếp ΔIBE = ΔICD (không đủ điều kiện). Mấu chốt là kẻ thêm tia phân giác IF của góc BIC.",
      mix: [8, 12, 14]
    }
  ];

  window.TL_DATA = {
    bai: "cn7",
    ten: "Bài 16. Tam giác cân. Đường trung trực của đoạn thẳng",
    items: ITEMS,
    _helpers: { foot: foot, cut: cut, add: add, pol: pol, iso: iso }
  };
})();
