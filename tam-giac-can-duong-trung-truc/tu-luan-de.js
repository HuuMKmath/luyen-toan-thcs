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
    {
      id: "vd4", lv: "VD",
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
      id: "vd5", lv: "VD",
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
    },

    /* ================= DÀNH CHO HỌC SINH GIỎI ================= */
    {
      id: "hsg1", lv: "HSG",
      de: "Cho tam giác ABC cân tại A có ∠A = 20°. Trên cạnh AC lấy điểm D sao cho AD = BC. Tính số đo góc ∠ABD.",
      goi: "Dựng thêm tam giác đều BCE với E nằm trong tam giác ABC. Khi đó BE = BC = AD; hãy tìm một cặp tam giác bằng nhau có chứa AD và BE.",
      nguoc: [
      { ten: "Tính ∠ABD", dich: "Tính ∠ABD",
        ket: "∠ABD = ∠BAE = 10°.",
        buoc: [
        { hoi: "Muốn tính ∠ABD, ta nên đi theo hướng nào?",
          chon: [
            ["Tính ∠ADB trước rồi dùng tổng ba góc của tam giác ABD", false, "Tam giác ABD mới biết một góc là ∠BAD = 20°, hai góc còn lại đều chưa biết, nên tổng ba góc chưa cho ra kết quả."],
            ["Tìm một tam giác bằng tam giác ABD mà góc tương ứng với ∠ABD đã biết hoặc tính được", true, "∠ABD nằm trong tam giác ABD. Nếu tam giác ABD bằng một tam giác khác thì ∠ABD bằng góc tương ứng của tam giác đó."],
            ["Chứng minh tam giác ABD cân", false, "Không có cặp cạnh hay cặp góc nào bằng nhau để suy ra tam giác ABD cân (đề cho AD = BC, không phải AD = AB hay AD = BD)."]],
          dat: "Một tam giác bằng ΔABD có góc đã biết" },
        { ve: 1, hoi: "Tam giác ABD có cạnh AB, ∠BAD = 20° và AD (= BC). Lấy AB làm cạnh chung, ta cần ở đỉnh B một góc 20° và một đoạn bằng BC. Nên vẽ thêm gì?",
          chon: [
            ["Vẽ đường cao AH của tam giác ABC", false, "AH chia góc A thành hai góc 10°, nhưng không tạo ra đoạn nào xuất phát từ B và bằng BC."],
            ["Lấy trung điểm của cạnh AC", false, "Trung điểm của AC không liên quan đến độ dài BC, không tạo được đoạn bằng AD ở đỉnh B."],
            ["Vẽ tam giác đều BCE, với E nằm trong tam giác ABC", true, "BE = BC = AD. Lại có ∠ABC = 80°, ∠EBC = 60° nên ∠ABE = 20° = ∠BAD. Có đủ cả hai điều cần."]],
          dat: "Vẽ tam giác đều BCE: BE = BC = AD, ∠ABE = 20° = ∠BAD" },
        { hoi: "ΔBAD và ΔABE có AB chung, ∠BAD = ∠ABE, AD = BE nên bằng nhau (c.g.c). Vậy ∠ABD bằng góc nào?",
          chon: [
            ["∠ABE", false, "Ghép nhầm đỉnh: ∠ABE ứng với ∠BAD (cùng bằng 20°), không phải với ∠ABD."],
            ["∠BAE", true, "Viết đúng thứ tự đỉnh ΔBAD = ΔABE: đỉnh B ứng với A, A ứng với B, D ứng với E. Nên ∠ABD ứng với ∠BAE."],
            ["∠AEB", false, "∠AEB ứng với ∠ADB (đỉnh E ứng với đỉnh D), không phải ∠ABD."]],
          dat: "∠ABD = ∠BAE (vì ΔBAD = ΔABE)" },
        { hoi: "Muốn tính ∠BAE, ta cần chứng minh điều gì?",
          chon: [
            ["AE là tia phân giác của góc BAC, nhờ ΔABE = ΔACE", true, "ΔABE và ΔACE có AB = AC, BE = CE, AE chung nên bằng nhau (c.c.c). Suy ra ∠BAE = ∠CAE = 20° : 2 = 10°."],
            ["Tam giác ABE cân tại B", false, "Nếu BA = BE thì BA = BC (vì BE = BC), khi đó tam giác ABC cân tại B và ∠A = ∠C. Nhưng ∠A = 20° còn ∠C = 80°."],
            ["∠BAE = ∠ABE", false, "Nếu vậy thì tam giác ABE cân tại E, tức là EA = EB; không có cơ sở nào cho điều này."]],
          dat: "∠BAE = 10° (ΔABE = ΔACE, c.c.c)" }] }],
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
      nguoc: [
      { ten: "Câu c (cả bài)", dich: "AC = AB + BD",
        ket: "Có ∠EDC = ∠C nên ED = EC; lại có BD = ED nên EC = BD, do đó AC = AB + BD. Đi ngược như vậy cũng cho ta luôn câu a và câu b.",
        buoc: [
        { hoi: "Muốn chứng minh AC = AB + BD, ta cần chứng minh điều gì?",
          chon: [
            ["Tính độ dài AC, AB, BD rồi so sánh", false, "Đề không cho số đo độ dài nên không tính được."],
            ["AB = BD", false, "Không có cơ sở. Hơn nữa nếu có thì chỉ được AB + BD = 2 · AB, vẫn chưa nói gì về AC."],
            ["EC = BD, vì trên AC đã có AE = AB", true, "Đây là cách tách đoạn: trên đoạn dài AC đã cắt AE = AB, nên AC = AE + EC = AB + EC. Chỉ còn phải chứng minh EC = BD."]],
          dat: "EC = BD (vì AC = AE + EC, AE = AB)" },
        { hoi: "EC và BD không nằm trong hai tam giác bằng nhau nào. Nối D với E. Muốn có EC = BD, ta đi qua đoạn trung gian nào?",
          chon: [
            ["BD = ED và ED = EC", true, "ED là đoạn trung gian: ED = BD nhờ câu a, ED = EC nhờ câu b."],
            ["Chứng minh ΔABD = ΔCED", false, "Hai tam giác này không bằng nhau (cạnh AB thường khác cạnh CE), nên không dùng được."],
            ["EC = AB", false, "Không có cơ sở, và AB = AE chứ không bằng EC."]],
          dat: "BD = ED và ED = EC (ED là đoạn trung gian)" },
        { hoi: "Muốn có BD = ED, ta cần điều gì?",
          chon: [
            ["D là trung điểm của BE", false, "D nằm trên BC, không nằm trên BE, nên không thể là trung điểm của BE."],
            ["ΔABD = ΔAED (câu a)", true, "AB = AE, ∠BAD = ∠EAD (AD là tia phân giác), AD chung nên ΔABD = ΔAED (c.g.c), suy ra BD = ED."],
            ["Tam giác BDE đều", false, "Không có góc 60° nào trong đề, không có cơ sở."]],
          dat: "ΔABD = ΔAED (c.g.c) nên BD = ED, ∠AED = ∠B" },
        { hoi: "Muốn có ED = EC, tức là tam giác DEC cân tại E, ta cần chứng minh gì?",
          chon: [
            ["∠DEC = ∠DCE", false, "Nếu vậy thì tam giác DEC cân tại D, cho DE = DC, không phải ED = EC."],
            ["DE ⊥ AC", false, "Không có cơ sở, và góc vuông không cho ra hai cạnh bằng nhau."],
            ["∠EDC = ∠ECD, tức là ∠EDC = ∠C", true, "Tam giác có hai góc bằng nhau thì cân. Hai góc kề cạnh DC bằng nhau thì đỉnh cân là E, nên ED = EC."]],
          dat: "∠EDC = ∠C" },
        { hoi: "Muốn tính ∠EDC theo ∠C, ta dựa vào đâu?",
          chon: [
            ["∠AED = ∠B = 2 · ∠C, nên ∠DEC = 180° − 2 · ∠C, rồi dùng tổng ba góc của tam giác DEC", true, "∠EDC = 180° − ∠DEC − ∠C = 180° − (180° − 2 · ∠C) − ∠C = ∠C. Dùng đúng giả thiết ∠B = 2 · ∠C."],
            ["∠EDC = ∠ADB vì hai góc đối đỉnh", false, "Hai góc này không đối đỉnh (DE và DA không phải hai tia đối nhau)."],
            ["∠EDC = ∠BAD", false, "Không có cơ sở để hai góc này bằng nhau."]],
          dat: "∠AED = ∠B = 2 · ∠C (giả thiết), tổng ba góc của ΔDEC" }] }],
      fig: function (goc) {
        var B = [0, 0], C = [10, 0], A = cut(B, pol(B, 1, 76), C, pol(C, 1, 142)), ab = Math.hypot(A[0], A[1]), ac = Math.hypot(C[0] - A[0], C[1] - A[1]);
        var D = add(B, C, ab / (ab + ac)), E = add(A, C, ab / ac);
        return draw({ goc: goc,  P: { A: A, B: B, C: C, D: D, E: E }, fill: ["ABC"], seg: ["AD", "DE"], tk: [["AB", 1], ["AE", 1], ["BD", 2], ["DE", 2], ["EC", 2]], arc: [["A", "B", "D", 1], ["A", "D", "C", 1]], pos: { A: "n", B: "sw", C: "se", D: "s", E: "ne" }, alt: "Tam giác ABC có góc B bằng hai lần góc C, AD là tia phân giác, E trên AC với AE bằng AB" });
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
      goi: "Gọi K là giao điểm của tia CM với đường trung trực của BC (đường này đi qua A). Tính các góc của tam giác AKB và BKC, rồi so sánh ΔBKA với ΔBKM.",
      nguoc: [
      { ten: "Câu a", dich: "BM = BA",
        ket: "ΔBKA = ΔBKM (g.c.g) nên BM = BA.",
        buoc: [
        { hoi: "Muốn chứng minh BM = BA, ta nên đi theo hướng nào?",
          chon: [
            ["Tính ∠BAM và ∠BMA để chứng minh tam giác ABM cân tại B", false, "Chưa biết gì về vị trí của M so với A nên chưa tính được ∠BAM hay ∠BMA. Đó chính là chỗ khó của bài."],
            ["Tìm hai tam giác bằng nhau, một tam giác chứa BA, một tam giác chứa BM", true, "Hai đoạn bằng nhau thường là hai cạnh tương ứng của hai tam giác bằng nhau. Cả BA và BM đều đi ra từ B, nên tìm hai tam giác chung một cạnh ở B."],
            ["Chứng minh M nằm trên đường trung trực của AB", false, "Điểm trên đường trung trực của AB thì cách đều A và B (MA = MB), không phải BM = BA."]],
          dat: "Hai tam giác bằng nhau chứa BA và BM" },
        { ve: 1, hoi: "Hình vẽ chưa có hai tam giác như vậy. Nên vẽ thêm gì?",
          chon: [
            ["Nối A với M", false, "Chỉ được tam giác ABM, vẫn chưa biết góc nào ở A hay M, không tạo thêm tam giác có góc đã biết."],
            ["Gọi K là giao điểm của tia CM với đường trung trực AH của BC", true, "K thuộc đường trung trực của BC nên KB = KC, ∠KBC = ∠KCB = 30°. Khi đó có ΔBKA và ΔBKM chung cạnh BK."],
            ["Vẽ tia phân giác của góc ABM", false, "Tia này không đi qua điểm nào đặc biệt và không tạo ra tam giác chứa BA."]],
          dat: "K là giao điểm của tia CM và AH: KB = KC" },
        { hoi: "ΔBKA và ΔBKM có cạnh chung BK. Muốn chúng bằng nhau theo g.c.g, ta cần thêm gì?",
          chon: [
            ["BA = BM", false, "Đó là điều phải chứng minh, không được dùng làm điều kiện."],
            ["KA = KM", false, "Chưa biết, và đây là điều suy ra sau khi hai tam giác bằng nhau."],
            ["∠ABK = ∠MBK và ∠BKA = ∠BKM", true, "Hai góc kề cạnh BK. ∠ABK = 50° − 30° = 20°, ∠MBK = 30° − 10° = 20°."]],
          dat: "∠ABK = ∠MBK (= 20°) và ∠BKA = ∠BKM" },
        { hoi: "Muốn có ∠BKA = ∠BKM, ta tính hai góc này dựa vào đâu?",
          chon: [
            ["Tổng ba góc trong ΔABK (∠BAK = 40°, ∠ABK = 20°) và trong ΔBKC (hai góc 30°)", true, "∠AKB = 180° − 40° − 20° = 120°, ∠BKC = 180° − 30° − 30° = 120° = ∠BKM. Các số liệu đều từ giả thiết."],
            ["∠BKA và ∠BKC là hai góc kề bù", false, "A, K, C không thẳng hàng nên hai góc này không kề bù."]],
          dat: "∠BKA = ∠BKM = 120° (∠A = 80°, ∠MBC = 10°, ∠MCB = 30°)" }] },
      { ten: "Câu b", dich: "Tính ∠AMC",
        ket: "∠AMK = (180° − 120°) : 2 = 30°, nên ∠AMC = 180° − 30° = 150°.",
        buoc: [
        { hoi: "Muốn tính ∠AMC, ta tính góc nào trước?",
          chon: [
            ["∠AMK, vì ∠AMC và ∠AMK là hai góc kề bù", true, "M nằm giữa C và K nên ∠AMC = 180° − ∠AMK. Góc ∠AMK nằm trong tam giác AKM, mà câu a đã cho KA = KM."],
            ["∠MAC, rồi dùng tổng ba góc của tam giác AMC", false, "Tam giác AMC chưa biết góc nào ngoài ∠ACM = 20°, nên phải tìm hai góc chưa biết, khó hơn."]],
          dat: "Tính ∠AMK (vì ∠AMC = 180° − ∠AMK)" },
        { hoi: "Tam giác AKM cân tại K (KA = KM). Muốn tính ∠AMK, ta cần biết góc nào?",
          chon: [
            ["∠KAM", false, "Chưa biết ∠KAM, tìm nó cũng khó như tìm ∠AMK."],
            ["∠AKM ở đỉnh", true, "Tam giác cân biết góc ở đỉnh thì tính được góc ở đáy: ∠AMK = (180° − ∠AKM) : 2."]],
          dat: "Tính ∠AKM" },
        { hoi: "Muốn tính ∠AKM (= ∠AKC), ta dựa vào đâu?",
          chon: [
            ["ΔAKB = ΔAKC (c.c.c), nên ∠AKC = ∠AKB = 120°", true, "AB = AC, KB = KC, AK chung. Góc ∠AKB = 120° đã tính ở câu a."],
            ["∠AKC = ∠BKC vì cùng chứa đỉnh K", false, "Chung đỉnh không đủ để hai góc bằng nhau; phải chứng minh qua hai tam giác bằng nhau."]],
          dat: "∠AKC = ∠AKB = 120° (ΔAKB = ΔAKC)" }] }],
      fig: function (goc) {
        var p = iso(80, 10), A = p[0], B = p[1], C = p[2], H = add(B, C, 0.5);
        var M = cut(B, pol(B, 1, 10 + 0), C, pol(C, 1, 150)), K = cut(C, M, A, H);
        return draw({ goc: goc, phu: ["K", "H"],  w: 300, P: { A: A, B: B, C: C, M: M, K: K, H: H }, fill: ["ABC"], seg: ["BM", "CM", "CK", "AM"], thin: ["AH", "BK"], tk: [["BH", 2], ["HC", 2]], rt: [["H", "A", "C"]], ang: [["B", "M", "C", "10°", 80], ["C", "B", "M", "30°", 50]], pos: { A: "n", B: "sw", C: "se", M: "ne", K: "nw", H: "s" }, alt: "Tam giác ABC cân tại A, điểm M bên trong, K là giao của tia CM với đường trung trực AH của BC" });
      },
      steps: [
        "∠ABC = ∠ACB = (180° − 80°) : 2 = 50°. Gọi H là trung điểm của BC. Tam giác ABC cân tại A nên AH là đường trung trực của BC và AH là tia phân giác của góc BAC, ∠BAH = 40°.",
        "Gọi K là giao điểm của tia CM với AH. K nằm trên đường trung trực của BC nên KB = KC, tam giác KBC cân tại K: ∠KBC = ∠KCB = 30°. Vì ∠MBC = 10° < 30° = ∠KBC nên M nằm giữa C và K.",
        "Trong tam giác ABK: ∠ABK = 50° − 30° = 20°, ∠BAK = 40°, nên ∠AKB = 180° − 40° − 20° = 120°.<br>Trong tam giác BKC: ∠BKC = 180° − 30° − 30° = 120°, nên ∠BKM = 120°. Lại có ∠KBM = 30° − 10° = 20°.",
        "a) Xét ΔBKA và ΔBKM có: ∠ABK = ∠MBK (= 20°); BK là cạnh chung; ∠BKA = ∠BKM (= 120°).<br>Do đó ΔBKA = ΔBKM (g.c.g), suy ra BA = BM và KA = KM.",
        "b) ΔAKB = ΔAKC (c.c.c: AB = AC, KB = KC, AK chung) nên ∠AKC = ∠AKB = 120°, tức là ∠AKM = 120°.",
        "Tam giác AKM có KA = KM nên cân tại K: ∠KMA = (180° − 120°) : 2 = 30°.<br>Vì M nằm giữa C và K nên ∠AMC = 180° − ∠AMK = 180° − 30° = 150° (hai góc kề bù)."
      ],
      dap: "a) BM = BA. b) ∠AMC = 150°.",
      loi: "Nhầm vị trí của M và K trên tia CM (M phải nằm giữa C và K); hoặc dùng ∠BKM = 60° thay cho 120°.",
      mix: [12, 13, 14]
    },
    {
      id: "hsg4", lv: "HSG",
      de: "Cho tam giác ABC có ba góc nhọn. Vẽ ra phía ngoài tam giác ABC các tam giác ABD vuông cân tại A và ACE vuông cân tại A.<br>a) Chứng minh BE = CD.<br>b) Chứng minh BE ⊥ CD.",
      goi: "Câu a: ∠BAE và ∠DAC cùng bằng 90° + ∠BAC. Câu b: gọi I là giao điểm của BE và CD, K là giao điểm của AB và CD; so sánh tam giác ADK với tam giác IBK.",
      nguoc: [
      { ten: "Câu a", dich: "BE = CD",
        ket: "ΔABE = ΔADC (c.g.c) nên BE = CD.",
        buoc: [
        { hoi: "Muốn chứng minh BE = CD, ta cần chứng minh điều gì?",
          chon: [
            ["ΔABE = ΔACD", false, "Ghép nhầm đỉnh: AB ứng với AD, AE ứng với AC, nên phải viết ΔABE = ΔADC."],
            ["ΔABE = ΔADC", true, "BE và DC là hai cạnh tương ứng của hai tam giác này (B ứng D, E ứng C)."],
            ["BE và CD cùng bằng BC", false, "Không có cơ sở, nói chung BE và CD không bằng BC."]],
          dat: "ΔABE = ΔADC" },
        { hoi: "ΔABE và ΔADC đã có AB = AD, AE = AC. Cần thêm điều gì để bằng nhau theo c.g.c?",
          chon: [
            ["∠BAE = ∠DAC (góc xen giữa)", true, "Theo c.g.c, góc phải xen giữa hai cạnh: ∠BAE xen giữa AB, AE; ∠DAC xen giữa AD, AC."],
            ["∠ABE = ∠ADC", false, "Góc này không xen giữa hai cặp cạnh đã có, và nó là điều suy ra sau."]],
          dat: "∠BAE = ∠DAC" },
        { hoi: "Vì sao ∠BAE = ∠DAC?",
          chon: [
            ["Vì cả hai đều bằng 90°", false, "Quên góc ∠BAC: ∠BAE gồm ∠BAC và ∠CAE."],
            ["Vì cả hai đều bằng ∠BAC + 90°", true, "∠BAE = ∠BAC + ∠CAE và ∠DAC = ∠DAB + ∠BAC, với ∠CAE = ∠DAB = 90° (giả thiết)."]],
          dat: "∠BAE = ∠DAC = ∠BAC + 90° (giả thiết hai tam giác vuông cân)" }] },
      { ten: "Câu b", dich: "BE ⊥ CD",
        ket: "∠BIK = 180° − 90° = 90°, nên BE ⊥ CD.",
        buoc: [
        { ve: 1, hoi: "Muốn chứng minh BE ⊥ CD, ta cần chứng minh điều gì?",
          chon: [
            ["Gọi I là giao điểm của BE và CD, chứng minh một góc tại I bằng 90°", true, "Hai đường thẳng vuông góc khi chúng cắt nhau tạo thành một góc vuông."],
            ["BE ⊥ AC", false, "Điều này nói chung không đúng, và cũng không liên quan đến CD."]],
          dat: "∠BIK = 90° (I = BE ∩ CD, K = AB ∩ CD)" },
        { hoi: "Trong tam giác IBK, muốn có ∠BIK = 90° thì cần gì?",
          chon: [
            ["∠IBK = ∠BKI", false, "Hai góc bằng nhau cho tam giác cân, không cho góc vuông."],
            ["∠IBK + ∠BKI = 90°", true, "Tổng ba góc là 180°, nên ∠BIK = 90° khi hai góc kia có tổng 90°."]],
          dat: "∠IBK + ∠BKI = 90°" },
        { hoi: "Tam giác nào đã có tổng hai góc bằng 90°, và các góc đó bằng ∠IBK, ∠BKI?",
          chon: [
            ["Tam giác ADK vuông tại A: ∠ADK + ∠AKD = 90°, với ∠ADK = ∠IBK (câu a) và ∠AKD = ∠BKI (đối đỉnh)", true, "Từ ΔABE = ΔADC có ∠ABE = ∠ADC. Hai góc ở K đối đỉnh. Vậy ∠IBK + ∠BKI = ∠ADK + ∠AKD = 90°."],
            ["Tam giác ABC, vì có ba góc nhọn", false, "Ba góc nhọn không cho tổng hai góc bằng 90°."]],
          dat: "ΔADK vuông tại A; ∠ABE = ∠ADC (câu a); hai góc đối đỉnh ở K" }] }],
      fig: function (goc) {
        var A = [3.2, 7.5], B = [0, 0], C = [10, 0];
        var rot = function (o, p, s) { return [o[0] - s * (p[1] - o[1]), o[1] + s * (p[0] - o[0])]; };
        var D = rot(A, B, -1), E = rot(A, C, 1), I = cut(B, E, C, D), K = cut(A, B, C, D);
        return draw({ goc: goc, phu: ["I", "K"],  w: 340, P: { A: A, B: B, C: C, D: D, E: E, I: I, K: K }, fill: ["ABC"], seg: ["AD", "BD", "AE", "CE", "BE", "CD"], tk: [["AB", 1], ["AD", 1], ["AC", 2], ["AE", 2]], rt: [["A", "B", "D"], ["A", "C", "E"], ["I", "B", "C"]], pos: { A: "n", B: "sw", C: "se", D: "w", E: "e", I: "s", K: "w" }, alt: "Tam giác ABC, ra ngoài vẽ tam giác vuông cân ABD và ACE tại A, BE cắt CD tại I" });
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
      nguoc: [
      { ten: "Chứng minh ID = IE", dich: "ID = IE",
        ket: "ΔBIE = ΔBIF và ΔCID = ΔCIF (g.c.g) nên IE = IF = ID.",
        buoc: [
        { hoi: "Muốn chứng minh ID = IE, ta nên đi theo hướng nào?",
          chon: [
            ["Chứng minh ΔIBE = ΔICD", false, "Hai tam giác này chỉ có ∠BIE = ∠CID (đối đỉnh), không có cặp cạnh nào bằng nhau đã biết, nên không đủ điều kiện."],
            ["Chứng minh tam giác IDE đều", false, "Không có cơ sở; nói chung tam giác IDE không đều."],
            ["Tìm một đoạn trung gian bằng cả ID và IE", true, "Khi hai đoạn không nằm trong hai tam giác bằng nhau, ta so sánh cả hai với một đoạn thứ ba."]],
          dat: "Một đoạn trung gian bằng cả ID và IE" },
        { ve: 1, hoi: "Đoạn trung gian nên vẽ thế nào?",
          chon: [
            ["Kẻ IH ⊥ BC", false, "ΔBIH có góc vuông ở H, còn ΔBIE nói chung không có góc vuông, nên không ghép được hai tam giác bằng nhau."],
            ["Kẻ tia phân giác IF của góc BIC (F thuộc BC)", true, "IF tạo ra ΔBIF ghép với ΔBIE (chung BI) và ΔCIF ghép với ΔCID (chung CI)."],
            ["Nối I với trung điểm của BC", false, "Trung điểm của BC không tạo ra góc nào bằng nhau ở I."]],
          dat: "Kẻ tia phân giác IF của góc BIC; cần IE = IF và ID = IF" },
        { hoi: "ΔBIE và ΔBIF có BI chung, ∠EBI = ∠FBI. Muốn bằng nhau theo g.c.g, cần thêm gì?",
          chon: [
            ["∠BIE = ∠BIF", true, "Góc kề cạnh BI ở đỉnh I. Tương tự, cặp ΔCID và ΔCIF cần ∠CID = ∠CIF."],
            ["BE = BF", false, "Đó là điều suy ra sau khi hai tam giác bằng nhau, không dùng làm điều kiện được."]],
          dat: "∠BIE = ∠BIF và ∠CID = ∠CIF" },
        { hoi: "Vì sao ∠BIE = ∠BIF = 60°?",
          chon: [
            ["Vì I là giao điểm của hai tia phân giác", false, "Chưa đủ: cần dùng ∠A = 60° để tính được ∠BIC."],
            ["∠IBC + ∠ICB = (∠B + ∠C) : 2 = 60° nên ∠BIC = 120°; ∠BIE kề bù với ∠BIC; IF chia đôi ∠BIC", true, "∠BIE = 180° − 120° = 60° và ∠BIF = 120° : 2 = 60°. Tương tự ∠CID = ∠CIF = 60°. Đã dùng giả thiết ∠A = 60°."]],
          dat: "∠BIC = 120° (vì ∠A = 60°)" }] }],
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
