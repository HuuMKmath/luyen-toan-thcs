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
  var ui = { open: null, hint: {}, step: {} };   // trạng thái trên màn hình (không lưu)

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
    s += k ? '<button class="btn ghost sm" data-tl="hide:' + q.id + '">Ẩn lời giải</button>' : '<button class="btn sm" data-tl="sol:' + q.id + '">Xem lời giải</button>';
    s += "</div>";
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
    "@media (max-width:560px){#tl-box{padding:14px 12px}.tl-q{padding:12px 10px}.tl-sol{padding:10px 8px}.tl-sol ol{padding-left:18px}.tl-sol .figbox{margin:4px 0}}";
  try { var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st); } catch (e) {}

  window.TuLuan = { html: html, rerender: rerender, LV: LV };
})();
