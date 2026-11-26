/* Phần Bài tập tự luận dùng chung cho các trang bài (đã chốt 26/11/2026).
   - Bốn mức: Nhận biết, Thông hiểu, Vận dụng, Dành cho học sinh giỏi.
   - Học sinh làm ra giấy, bấm Gợi ý, Xem lời giải (hiện từng bước), rồi tự đánh dấu: Đúng / Đúng một phần / Chưa đúng.
   - Không tính vào điều kiện qua bài, không gửi điểm. Kết quả tự đánh dấu lưu trên máy (theo mã học sinh và bài).
   - XP: mỗi bài được cộng một lần khi tự đánh dấu lần đầu (GM.onEssay), không phụ thuộc đúng hay sai.
   Trang bài nạp tệp này và tệp đề của bài (tu-luan-de.js đặt window.TL_DATA), rồi chèn ${TuLuan.html()} vào trang chủ của bài. */
(function () {
  "use strict";
  var LV = { NB: "Nhận biết", TH: "Thông hiểu", VD: "Vận dụng", HSG: "Dành cho HSG" };
  var LV_DESC = {
    NB: "Bài cơ bản, áp dụng trực tiếp định nghĩa, tính chất.",
    TH: "Lập luận một vài bước, trình bày chứng minh ngắn.",
    VD: "Bài nhiều bước, phối hợp các kiến thức trong bài.",
    HSG: "Bài nâng cao, tổng hợp kiến thức các bài đã học."
  };
  var MARK = { d: "Đúng", p: "Đúng một phần", s: "Chưa đúng" };
  var ui = { open: null, hint: {}, step: {}, ng: {} };   // trạng thái trên màn hình (không lưu)

  function data() { return window.TL_DATA || null; }
  function user() { try { return (window.GM && GM.user && GM.user()) || "local"; } catch (e) { return "local"; } }
  function key() { var d = data(); return "tl1:" + user() + ":" + (d ? d.bai : ""); }
  function load() { try { return JSON.parse(localStorage.getItem(key()) || "{}") || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(key(), JSON.stringify(o)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function byLv(lv) { var d = data(); return d ? d.items.filter(function (q) { return q.lv === lv; }) : []; }
  function num(q) { return byLv(q.lv).indexOf(q) + 1; }

  function itemHTML(q, marks) {
    var k = ui.step[q.id] || 0, n = q.steps.length, m = marks[q.id], fig = "";
    var s = '<article class="card tl-q" id="tl-' + q.id + '">';
    s += '<div class="tl-head"><b>Bài ' + num(q) + "</b>" + (m ? ' <span class="chip tl-' + m.m + '">' + MARK[m.m] + "</span>" : "") + "</div>";
    s += '<div class="stem">' + q.de + "</div>";
    s += '<div class="row tl-btns">';
    s += '<button class="btn ghost sm" data-tl="hint:' + q.id + '" aria-expanded="' + (!!ui.hint[q.id]) + '">' + (ui.hint[q.id] ? "Ẩn gợi ý" : "Gợi ý") + "</button>";
    if (q.nguoc) s += '<button class="btn ghost sm tl-ngbtn" data-tl="ng:' + q.id + '" aria-expanded="' + (!!ui.ng[q.id]) + '">' + (ui.ng[q.id] ? "Đóng phân tích" : "🧭 Phân tích đi lên") + "</button>";
    s += k ? '<button class="btn ghost sm" data-tl="hide:' + q.id + '">Ẩn lời giải</button>' : '<button class="btn sm" data-tl="sol:' + q.id + '">Xem lời giải</button>';
    s += "</div>";
    if (ui.ng[q.id]) s += ngHTML(q);
    if (ui.hint[q.id]) s += '<div class="tl-hint"><b>Gợi ý.</b> ' + q.goi + "</div>";
    if (k) {
      if (q.fig) { try { fig = q.fig(); } catch (e) { fig = ""; } }
      s += '<div class="tl-sol"><div class="tl-cap">Lời giải</div>' + fig + "<ol>";
      for (var i = 0; i < k; i++) s += "<li>" + q.steps[i] + "</li>";
      s += "</ol>";
      if (k < n) s += '<div class="row"><button class="btn sm" data-tl="next:' + q.id + '">Bước tiếp (' + k + "/" + n + ')</button><button class="btn ghost sm" data-tl="all:' + q.id + '">Xem hết</button></div>';
      else {
        s += '<p class="tl-dap"><b>Đáp số / kết luận:</b> ' + q.dap + "</p>";
        if (q.loi) s += '<p class="tl-loi"><b>Lỗi hay gặp:</b> ' + q.loi + "</p>";
        s += '<div class="tl-self"><p><b>So với bài làm trên giấy của em:</b></p><div class="row">';
        ["d", "p", "s"].forEach(function (c) { s += '<button class="btn ' + (m && m.m === c ? "" : "ghost ") + 'sm tl-m-' + c + '" data-tl="mark:' + q.id + ":" + c + '" aria-pressed="' + (!!(m && m.m === c)) + '">' + MARK[c] + "</button>"; });
        s += "</div>" + (m ? '<p class="small muted">Em đã tự đánh dấu. Có thể bấm lại để đổi.</p>' : "") + "</div>";
      }
      s += "</div>";
    }
    return s + "</article>";
  }

  function html() {
    var d = data();
    if (!d || !d.items || !d.items.length) return "";
    var marks = load(), total = d.items.length, done = d.items.filter(function (q) { return marks[q.id]; }).length;
    var s = '<section class="card stack" id="tl-box" style="margin-top:16px">';
    s += '<div><h2>Bài tập tự luận</h2><p class="muted" style="margin:6px 0 0">Làm bài ra giấy, trình bày đầy đủ. Bí thì bấm Gợi ý. Làm xong bấm Xem lời giải, so từng bước với bài của em rồi tự đánh dấu. Phần này để luyện cách trình bày, không tính điểm và không tính vào điều kiện qua bài.</p></div>';
    s += '<p class="small" style="margin:0">Em đã tự đánh dấu <b>' + done + "/" + total + "</b> bài.</p>";
    s += '<div class="pack">';
    Object.keys(LV).forEach(function (lv) {
      var L = byLv(lv); if (!L.length) return;
      var dn = L.filter(function (q) { return marks[q.id]; }).length;
      s += '<button class="pk' + (ui.open === lv ? " on" : "") + '" data-tl="open:' + lv + '" aria-expanded="' + (ui.open === lv) + '"><b>' + LV[lv] + " · " + L.length + " bài</b><span>" + LV_DESC[lv] + (dn ? " Đã làm " + dn + "/" + L.length + "." : "") + "</span></button>";
    });
    s += "</div>";
    if (ui.open) {
      s += '<div class="tl-list"><h3 style="margin:4px 0 0">' + LV[ui.open] + "</h3>";
      byLv(ui.open).forEach(function (q) { s += itemHTML(q, marks); });
      s += "</div>";
    }
    return s + "</section>";
  }

  function rerender(focusId) {
    var box = document.getElementById("tl-box");
    if (!box) return;
    var y = window.scrollY;
    box.outerHTML = html();
    window.scrollTo(0, y);
    if (focusId) { var el = document.querySelector('[data-tl="' + focusId + '"]'); if (el) el.focus({ preventScroll: true }); }
  }

  function mark(id, c, el) {
    var o = load(), first = !o[id];
    o[id] = { m: c, t: Date.now() };
    save(o);
    var q = data().items.filter(function (x) { return x.id === id; })[0];
    var g = null;
    if (first && window.GM && GM.onEssay) { try { g = GM.onEssay(data().bai + ":" + id, q ? q.lv : ""); } catch (e) {} }
    rerender("mark:" + id + ":" + c);
    if (g && window.GM && GM.fx) { try { GM.fx(g, document.querySelector('[data-tl="mark:' + id + ":" + c + '"]')); } catch (e) {} }
  }


  /* ---------- Phân tích đi lên (suy luận ngược) cho bài khó ----------
     Dữ liệu: q.nguoc = [{ ten, dich, buoc: [{ hoi, chon: [[lựa chọn, đúng?, giải thích], ...], dat }], ket }]
     Mỗi bước hỏi "Muốn có điều này thì cần gì?"; học sinh tự nghĩ rồi chọn hướng, hướng sai có giải thích.
     Sơ đồ bên trên cho biết em đang ở đâu. Đi đến giả thiết thì mời xem lời giải trình bày xuôi. */
  function ngState(id) { return ui.ng[id]; }
  function ngNew(a) { return { a: a || 0, k: 0, t: {}, ok: false }; }

  function ngMap(A, st, fin) {
    var s = '<div class="ng-map" aria-label="Sơ đồ phân tích đi lên"><div class="ng-cap">Sơ đồ phân tích</div>';
    s += '<div class="ng-node ng-goal"><span class="ng-tag">Cần</span>' + A.dich + "</div>";
    var n = fin ? A.buoc.length : st.k + (st.ok ? 1 : 0);
    for (var i = 0; i < n; i++) {
      s += '<div class="ng-arrow">⇑ muốn vậy, cần có</div>';
      s += '<div class="ng-node' + (fin && i === A.buoc.length - 1 ? " ng-gt" : "") + '"><span class="ng-tag">' + (i + 1) + "</span>" + A.buoc[i].dat + "</div>";
    }
    if (fin) s += '<div class="ng-arrow">⇑</div><div class="ng-node ng-gt"><span class="ng-tag">✓</span>Giả thiết (điều đã cho)</div>';
    else if (!st.ok) s += '<div class="ng-arrow">⇑ muốn vậy, cần có</div><div class="ng-node ng-here"><span class="ng-tag">?</span>Em đang ở đây</div>';
    return s + "</div>";
  }

  function ngHTML(q) {
    var st = ngState(q.id), L = q.nguoc, A = L[st.a], fin = st.k >= A.buoc.length;
    var s = '<div class="tl-ng" id="ng-' + q.id + '">';
    s += '<div class="ng-top"><b>Phân tích đi lên</b><button class="btn ghost sm" data-tl="ngauto:' + q.id + '" aria-pressed="' + docAuto() + '">🔊 Tự đọc: ' + (docAuto() ? "Bật" : "Tắt") + "</button></div>";
    s += '<p class="small" style="margin:0">Đi ngược từ điều phải tìm. Mỗi bước tự hỏi: <i>muốn có điều này thì cần có điều gì?</i> Cứ thế cho đến khi gặp điều đề đã cho. Em hãy nghĩ trước rồi mới chọn.</p>';
    if (L.length > 1) {
      s += '<div class="row ng-tabs">';
      L.forEach(function (x, i) { s += '<button class="btn ' + (i === st.a ? "" : "ghost ") + 'sm" data-tl="nga:' + q.id + ":" + i + '" aria-pressed="' + (i === st.a) + '">' + x.ten + "</button>"; });
      s += "</div>";
    }
    s += ngMap(A, st, fin);
    if (!fin) {
      var B = A.buoc[st.k];
      s += '<div class="ng-step"><div class="ng-q"><span>Bước ' + (st.k + 1) + "/" + A.buoc.length + ". " + B.hoi + '</span><button class="btn ghost sm ng-say" data-tl="ngsay:' + q.id + ':q" aria-label="Đọc câu hỏi">🔊</button></div>';
      s += '<div class="ng-opts">';
      B.chon.forEach(function (c, j) {
        var tried = st.t[j], cls = tried ? (c[1] ? " ng-right" : " ng-wrong") : "";
        s += '<button class="ng-opt' + cls + '" data-tl="ngc:' + q.id + ":" + j + '"' + (st.ok || tried ? " disabled" : "") + ">" + (tried ? (c[1] ? "✓ " : "✗ ") : "") + c[0] + "</button>";
        if (tried) s += '<div class="ng-why ' + (c[1] ? "ok" : "no") + '">' + (c[1] ? "<b>Đúng hướng.</b> " : "<b>Chưa dẫn tới đích.</b> ") + c[2] + "</div>";
      });
      s += "</div>";
      if (st.ok) s += '<div class="row"><button class="btn sm" data-tl="ngn:' + q.id + '">' + (st.k + 1 < A.buoc.length ? "Bước tiếp" : "Xem sơ đồ đầy đủ") + '</button><button class="btn ghost sm ng-say" data-tl="ngsay:' + q.id + ':e" aria-label="Đọc giải thích">🔊</button></div>';
      else if (Object.keys(st.t).length) s += '<p class="small muted" style="margin:0">Đọc giải thích rồi chọn lại hướng khác.</p>';
      s += "</div>";
    } else {
      s += '<div class="ng-end"><p style="margin:0"><b>Đã đi ngược đến điều đề cho.</b> ' + A.ket + '</p><p class="small" style="margin:6px 0 0">Bây giờ em viết lời giải theo chiều xuôi: đọc sơ đồ từ dưới lên, từ giả thiết đến kết luận.</p>';
      s += '<div class="row"><button class="btn sm" data-tl="ngsol:' + q.id + '">Xem lời giải trình bày xuôi</button><button class="btn ghost sm ng-say" data-tl="ngsay:' + q.id + ':m" aria-label="Đọc sơ đồ">🔊 Đọc sơ đồ</button><button class="btn ghost sm" data-tl="ngr:' + q.id + '">Làm lại</button></div></div>';
    }
    return s + "</div>";
  }

  /* ---------- Giọng đọc: giọng tiếng Việt có sẵn của trình duyệt (miễn phí, không tải thêm) ---------- */
  var KEY_DOC = "tl-doc";
  function docAuto() { try { return localStorage.getItem(KEY_DOC) === "1"; } catch (e) { return false; } }
  var CHU = { A: "a", B: "bê", C: "xê", D: "đê", E: "e", F: "ép", G: "giê", H: "hát", I: "i", K: "ca", L: "lờ", M: "mờ", N: "nờ", O: "o", P: "pê", Q: "quy", R: "rờ", S: "ét", T: "tê", U: "u", V: "vê", X: "ích", Y: "i dài" };
  function doc(t) {
    t = String(t).replace(/<br\s*\/?>/gi, ". ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
    t = t.replace(/c\.g\.c/g, "cạnh góc cạnh").replace(/g\.c\.g/g, "góc cạnh góc").replace(/c\.c\.c/g, "cạnh cạnh cạnh");
    t = t.replace(/(^|\s)([a-d])\)/g, "$1câu $2,");
    t = t.replace(/\/\//g, " song song với ").replace(/⊥/g, " vuông góc với ").replace(/∠/g, " góc ").replace(/Δ/g, " tam giác ");
    t = t.replace(/°/g, " độ").replace(/⇒/g, " suy ra ").replace(/⇑/g, " ").replace(/=/g, " bằng ").replace(/≠/g, " khác ");
    t = t.replace(/</g, " nhỏ hơn ").replace(/>/g, " lớn hơn ").replace(/\+/g, " cộng ").replace(/[−–]/g, " trừ ").replace(/·/g, " nhân ");
    t = t.replace(/([\d)])\s*:\s*(\d)/g, "$1 chia $2").replace(/[()]/g, ", ");
    t = t.replace(/(^|[^\p{L}])([A-Z]{1,4})(?![\p{L}])/gu, function (m, a, w) { return a + " " + w.split("").map(function (c) { return CHU[c] || c; }).join(" ") + " "; });
    return t.replace(/\s+/g, " ").trim();
  }
  function giong() {
    try { var v = speechSynthesis.getVoices(); return v.filter(function (x) { return /^vi/i.test(x.lang); })[0] || null; } catch (e) { return null; }
  }
  try { if (window.speechSynthesis) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () {}; } } catch (e) {}
  function noi(text, el) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { baoGiong(el, "Trình duyệt này chưa hỗ trợ đọc to."); return; }
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(doc(text)), v = giong();
      u.lang = "vi-VN"; u.rate = 0.9;
      if (v) u.voice = v; else baoGiong(el, "Máy em có thể chưa cài giọng tiếng Việt. Trên Android: Cài đặt → Chuyển văn bản thành giọng nói → tải tiếng Việt. Trên iPhone: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Việt.");
      speechSynthesis.speak(u);
    } catch (e) { baoGiong(el, "Không đọc được trên máy này."); }
  }
  function baoGiong(el, msg) {
    var box = el && el.closest && el.closest(".tl-ng"); if (!box || box.querySelector(".ng-voice")) return;
    var p = document.createElement("p"); p.className = "small muted ng-voice"; p.style.margin = "0"; p.textContent = msg; box.appendChild(p);
  }
  function ngText(q, what) {
    var st = ngState(q.id), A = q.nguoc[st.a], B = A.buoc[Math.min(st.k, A.buoc.length - 1)];
    if (what === "q") return B.hoi;
    if (what === "e") { for (var j in st.t) if (B.chon[j][1]) return "Đúng hướng. " + B.chon[j][2]; return B.hoi; }
    var s = "Cần: " + A.dich + ". ";
    A.buoc.forEach(function (b) { s += "Muốn vậy, cần có: " + b.dat + ". "; });
    return s + "Đến đây đã gặp điều đề cho.";
  }
  function ngAct(act, q, a, b) {
    var id = q.id, st = ngState(id);
    if (act === "ng") { if (st) { delete ui.ng[id]; try { speechSynthesis.cancel(); } catch (e) {} } else ui.ng[id] = ngNew(0); rerender("ng:" + id); if (ui.ng[id] && docAuto()) noi(ngText(q, "q"), b); return; }
    if (!st) return;
    var A = q.nguoc[st.a];
    if (act === "nga") { ui.ng[id] = ngNew(+a[2]); rerender("nga:" + id + ":" + a[2]); if (docAuto()) noi(ngText(q, "q"), b); }
    else if (act === "ngc") {
      var j = +a[2], c = A.buoc[st.k].chon[j]; if (!c) return;
      st.t[j] = true; if (c[1]) st.ok = true;
      rerender(c[1] ? "ngn:" + id : null);
      if (docAuto()) noi((c[1] ? "Đúng hướng. " : "Chưa dẫn tới đích. ") + c[2], document.getElementById("ng-" + id));
      if (!c[1]) { var w = document.querySelector('#ng-' + id + ' .ng-opt:not([disabled])'); if (w) w.focus({ preventScroll: true }); }
    }
    else if (act === "ngn") { st.k++; st.t = {}; st.ok = false; rerender(st.k < A.buoc.length ? null : "ngsol:" + id); var f = document.querySelector('#ng-' + id + ' .ng-q span'); if (f) { f.setAttribute("tabindex", "-1"); f.focus({ preventScroll: true }); } if (docAuto()) noi(st.k < A.buoc.length ? ngText(q, "q") : A.ket, document.getElementById("ng-" + id)); }
    else if (act === "ngr") { ui.ng[id] = ngNew(st.a); rerender(null); }
    else if (act === "ngsol") { ui.step[id] = q.steps.length; rerender("mark:" + id + ":d"); var o = document.querySelector("#tl-" + id + " .tl-sol"); if (o) o.scrollIntoView({ block: "start", behavior: "smooth" }); }
    else if (act === "ngsay") noi(a[2] === "m" ? ngText(q, "m") : a[2] === "e" ? ngText(q, "e") : ngText(q, "q"), b);
    else if (act === "ngauto") { try { localStorage.setItem(KEY_DOC, docAuto() ? "0" : "1"); } catch (e) {} rerender("ngauto:" + id); if (docAuto()) noi(ngText(q, st.k < A.buoc.length ? "q" : "m"), b); else try { speechSynthesis.cancel(); } catch (e) {} }
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-tl]");
    if (!b) return;
    var a = b.getAttribute("data-tl").split(":"), act = a[0], id = a[1];
    if (act === "open") { ui.open = ui.open === id ? null : id; rerender("open:" + id); if (ui.open) { var t = document.querySelector(".tl-list"); if (t) t.scrollIntoView({ block: "start", behavior: "smooth" }); } return; }
    var q = data().items.filter(function (x) { return x.id === id; })[0]; if (!q) return;
    if (act === "hint") { ui.hint[id] = !ui.hint[id]; rerender("hint:" + id); }
    else if (act === "sol") { ui.step[id] = 1; rerender("next:" + id); }
    else if (act === "next") { ui.step[id] = Math.min(q.steps.length, (ui.step[id] || 0) + 1); rerender(ui.step[id] < q.steps.length ? "next:" + id : "mark:" + id + ":d"); }
    else if (act === "all") { ui.step[id] = q.steps.length; rerender("mark:" + id + ":d"); }
    else if (act === "hide") { ui.step[id] = 0; rerender("sol:" + id); }
    else if (act === "mark") mark(id, a[2], b);
    else if (act.indexOf("ng") === 0) ngAct(act, q, a, b);
  });

  /* Kiểu dáng riêng của phần tự luận (dùng biến màu của trang). */
  var css = ".tl-list{display:flex;flex-direction:column;gap:12px}" +
    ".tl-q{display:flex;flex-direction:column;gap:10px;background:var(--paper)}" +
    ".tl-head{display:flex;align-items:center;gap:8px}" +
    ".tl-btns{gap:8px}" +
    ".tl-hint{background:var(--warn-bg);color:var(--ink);border-radius:10px;padding:10px 12px}" +
    ".tl-sol{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:8px}" +
    ".tl-sol ol{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px}" +
    ".tl-cap{font-weight:700;color:var(--accent)}" +
    ".tl-dap{margin:0;background:var(--good-bg);border-radius:8px;padding:8px 10px}" +
    ".tl-loi{margin:0;background:var(--bad-bg);border-radius:8px;padding:8px 10px}" +
    ".tl-self p{margin:0 0 6px}" +
    ".chip.tl-d{color:var(--good);border-color:var(--good)}.chip.tl-p{color:var(--warn);border-color:var(--warn)}.chip.tl-s{color:var(--bad);border-color:var(--bad)}" +
    ".pk.on{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}" +
    ".tl-ng{border:2px solid var(--accent);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px;background:var(--card)}" +
    ".ng-top{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;color:var(--accent)}" +
    ".ng-map{display:flex;flex-direction:column;align-items:stretch;gap:2px;background:var(--paper);border-radius:10px;padding:10px}" +
    ".ng-cap{font-weight:700;font-size:.9em;color:var(--muted);margin-bottom:4px}" +
    ".ng-node{border:1px solid var(--line);background:var(--card);border-radius:8px;padding:6px 10px;display:flex;gap:8px;align-items:baseline}" +
    ".ng-tag{flex:none;font-weight:700;color:var(--accent);min-width:1.6em}" +
    ".ng-goal{border-color:var(--accent);font-weight:600}" +
    ".ng-here{border:2px dashed var(--warn);background:var(--warn-bg);font-weight:700}.ng-here .ng-tag{color:var(--warn)}" +
    ".ng-gt{border-color:var(--good);background:var(--good-bg)}.ng-gt .ng-tag{color:var(--good)}" +
    ".ng-arrow{text-align:center;font-size:.85em;color:var(--muted)}" +
    ".ng-step{display:flex;flex-direction:column;gap:8px}" +
    ".ng-q{display:flex;gap:8px;align-items:flex-start;justify-content:space-between;font-weight:600}" +
    ".ng-opts{display:flex;flex-direction:column;gap:6px}" +
    ".ng-opt{text-align:left;font:inherit;color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:9px 12px;cursor:pointer}" +
    ".ng-opt:hover:not([disabled]){border-color:var(--accent)}.ng-opt[disabled]{cursor:default}" +
    ".ng-opt.ng-right{border-color:var(--good);background:var(--good-bg);font-weight:600}.ng-opt.ng-wrong{border-color:var(--bad);background:var(--bad-bg);opacity:.85}" +
    ".ng-why{border-radius:8px;padding:6px 10px;font-size:.95em;margin:-2px 0 2px 12px}.ng-why.ok{color:var(--good)}.ng-why.no{color:var(--bad)}" +
    ".ng-end{background:var(--good-bg);border-radius:10px;padding:10px 12px}" +
    ".ng-say{flex:none}" +
    "@media (max-width:560px){#tl-box{padding:14px 12px}.tl-q{padding:12px 10px}.tl-sol{padding:10px 8px}.tl-sol ol{padding-left:18px}.tl-sol .figbox{margin:4px 0}}";
  try { var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st); } catch (e) {}

  window.TuLuan = { html: html, rerender: rerender, LV: LV, doc: doc };
})();
