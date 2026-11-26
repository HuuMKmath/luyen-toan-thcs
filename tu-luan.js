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
  var ui = { open: null, hint: {}, step: {}, ng: {}, map: {} };   // trạng thái trên màn hình (không lưu)

  function data() { return window.TL_DATA || null; }
  function user() { try { return (window.GM && GM.user && GM.user()) || "local"; } catch (e) { return "local"; } }
  function key() { var d = data(); return "tl1:" + user() + ":" + (d ? d.bai : ""); }
  function load() { try { return JSON.parse(localStorage.getItem(key()) || "{}") || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(key(), JSON.stringify(o)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function byLv(lv) { var d = data(); return d ? d.items.filter(function (q) { return q.lv === lv; }) : []; }
  function num(q) { var D = dangOf(q); return D ? D.ids.indexOf(q.id) + 1 : byLv(q.lv).indexOf(q) + 1; }
  /* Chia theo dạng (thầy chốt 27/11/2026): TL_DATA.dang = [{ ten, pp: [phương pháp], ids: [...] }]. Bài chưa có dạng thì chia theo mức như cũ. */
  var LV2 = { NB: "Nhận biết", TH: "Thông hiểu", VD: "Vận dụng", HSG: "Vận dụng cao" };
  function dangs() { var d = data(); return d && d.dang && d.dang.length ? d.dang : null; }
  function dangOf(q) { var D = dangs(); if (!D) return null; for (var i = 0; i < D.length; i++) if (D[i].ids.indexOf(q.id) >= 0) return D[i]; return null; }
  function byIds(ids) { var d = data(); return ids.map(function (id) { return d.items.filter(function (q) { return q.id === id; })[0]; }).filter(Boolean); }

  function itemHTML(q, marks) {
    var k = ui.step[q.id] || 0, n = q.steps.length, m = marks[q.id], fig = "";
    var s = '<article class="card tl-q" id="tl-' + q.id + '">';
    s += '<div class="tl-head"><b>Bài ' + num(q) + "</b>" + (dangOf(q) ? ' <span class="chip tl-lv tl-lv-' + q.lv + '">' + LV2[q.lv] + "</span>" : "") + (m ? ' <span class="chip tl-' + m.m + '">' + MARK[m.m] + "</span>" : "") + "</div>";
    s += '<div class="stem">' + q.de + "</div>";
    s += '<div class="row tl-btns">';
    s += '<button class="btn ghost sm" data-tl="hint:' + q.id + '" aria-expanded="' + (!!ui.hint[q.id]) + '">' + (ui.hint[q.id] ? "Ẩn gợi ý" : "Gợi ý") + "</button>";
    if (q.nguoc) s += '<button class="btn sm tl-ngbtn" data-tl="ng:' + q.id + '" aria-expanded="' + (!!ui.ng[q.id]) + '">' + (ui.ng[q.id] ? "Đóng phân tích" : "🧭 Giải theo 4 bước") + "</button>";
    // Bài có phân tích 4 bước: sơ đồ và lời giải nằm trong bước 3, không cần nút riêng.
    if (k) s += '<button class="btn ghost sm" data-tl="hide:' + q.id + '">Ẩn lời giải</button>';
    else if (!q.nguoc) s += '<button class="btn sm" data-tl="sol:' + q.id + '">Xem lời giải</button>';
    s += "</div>";
    if (ui.map[q.id]) s += mapHTML(q);
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
    var D = dangs();
    if (D) {
      s += '<div class="pack">';
      D.forEach(function (x, i) {
        var L = byIds(x.ids), dn = L.filter(function (q) { return marks[q.id]; }).length, o = "D" + i;
        var muc = []; L.forEach(function (q) { if (muc.indexOf(LV2[q.lv]) < 0) muc.push(LV2[q.lv]); });
        s += '<button class="pk' + (ui.open === o ? " on" : "") + '" data-tl="open:' + o + '" aria-expanded="' + (ui.open === o) + '"><b>Dạng ' + (i + 1) + ". " + x.ten + " · " + L.length + " bài</b><span>" + (muc.length > 1 ? "Từ " + muc[0].toLowerCase() + " đến " + muc[muc.length - 1].toLowerCase() : "Mức " + muc[0].toLowerCase()) + "." + (dn ? " Đã làm " + dn + "/" + L.length + "." : "") + "</span></button>";
      });
      var H = byLv("HSG");   // bài HSG: mục riêng, giải theo 4 bước (thầy dặn 27/11/2026)
      if (H.length) { var dh = H.filter(function (q) { return marks[q.id]; }).length; s += '<button class="pk pk-hsg' + (ui.open === "HSG" ? " on" : "") + '" data-tl="open:HSG" aria-expanded="' + (ui.open === "HSG") + '"><b>' + LV.HSG + " · " + H.length + " bài</b><span>" + LV_DESC.HSG + (dh ? " Đã làm " + dh + "/" + H.length + "." : "") + "</span></button>"; }
      s += "</div>";
      if (ui.open === "HSG" && H.length) { s += '<div class="tl-list"><h3 style="margin:4px 0 0">' + LV.HSG + "</h3>"; H.forEach(function (q) { s += itemHTML(q, marks); }); return s + "</div></section>"; }
      var k = ui.open && ui.open[0] === "D" ? +ui.open.slice(1) : -1;
      if (D[k]) {
        s += '<div class="tl-list"><h3 style="margin:4px 0 0">Dạng ' + (k + 1) + ". " + D[k].ten + "</h3>";
        s += '<div class="tl-pp"><b>Phương pháp giải</b><ul>' + D[k].pp.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></div>";
        byIds(D[k].ids).forEach(function (q) { s += itemHTML(q, marks); });
        s += "</div>";
      }
      return s + "</section>";
    }
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


  /* ---------- Phân tích theo 4 bước giải toán của G. Pólya ----------
     Bước 1. Tìm hiểu đề bài: q.hieu = { gt, kl, hoi: [[câu hỏi, trả lời], ...] }
     Bước 2. Xây dựng chương trình giải (phân tích đi lên, suy luận ngược):
       q.nguoc = [{ ten, dich, ket, buoc: [{ ve?, hoi, nho?, chon: [[lựa chọn, đúng?, giải thích], ...], dat }] }]
       Mỗi bước là một câu hỏi mở "muốn có điều này thì cần gì?": học sinh tự nghĩ trước, rồi mới xem các hướng;
       bí thì bấm "Gợi nhớ kiến thức" (nho). Sơ đồ bên trên cho biết em đang ở đâu.
     Bước 3. Thực hiện chương trình giải: trình bày xuôi (q.steps).
     Bước 4. Kiểm tra và nghiên cứu lời giải: q.nhin = [[câu hỏi, trả lời], ...] (thử lại, cách khác, bài đảo, mở rộng). */
  var POLYA = ["Tìm hiểu đề bài", "Xây dựng chương trình giải", "Thực hiện chương trình giải", "Kiểm tra và nghiên cứu lời giải"];
  function ngState(id) { return ui.ng[id]; }
  function ngNew(a, p) { return { p: p || 1, a: a || 0, k: 0, t: {}, ok: false, sh: false, nh: false, r1: {}, r4: {} }; }
  function soBuoc(q) { return q.hieu ? 1 : 2; }

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
  function sdHTML(A, ref) {   // sơ đồ phân tích đi lên gọn: mỗi ô là điều cần có; đọc từ dưới lên là lời giải
    if (!A.sd) return ngMap(A, null, true);
    var s = '<div class="ng-map" aria-label="Sơ đồ phân tích đi lên"><div class="ng-cap">Sơ đồ phân tích (đọc từ trên xuống: muốn có ô trên thì cần ô dưới)</div>';
    s += '<div class="ng-node ng-goal"><span class="ng-tag">Cần</span><span>' + A.dich + "</span></div>";
    A.sd.forEach(function (x, i) {
      s += '<div class="ng-arrow">⇑ muốn vậy, cần có</div>';
      s += '<div class="ng-node"><span class="ng-tag">' + (i + 1) + "</span><span>" + x[0] + (ref ? '<span class="ng-ref">Lời giải: bước ' + x[1].join(", ") + "</span>" : "") + "</span></div>";
    });
    s += '<div class="ng-arrow">⇑</div><div class="ng-node ng-gt"><span class="ng-tag">✓</span><span>Giả thiết: ' + (A.gt || "điều đề đã cho") + "</span></div>";
    return s + "</div>";
  }
  function hoiDap(q, list, rv, code) {   // danh sách câu hỏi: em tự trả lời trước, bấm mới hiện câu trả lời
    var s = '<ol class="ng-hd">';
    list.forEach(function (x, i) {
      s += "<li><div class=\"ng-q\"><span>" + x[0] + '</span><button class="btn ghost sm ng-say" data-tl="ngsay:' + q.id + ":" + code + i + '" aria-label="Đọc câu hỏi">🔊</button></div>';
      s += rv[i] ? '<div class="ng-ans">' + x[1] + "</div>" : '<button class="btn ghost sm" data-tl="ngxem:' + q.id + ":" + code + i + '">Em nghĩ xong, xem trả lời</button>';
      s += "</li>";
    });
    return s + "</ol>";
  }

  function ngQA(q, B, i, n) {   // một câu hỏi đã trả lời: câu hỏi, trả lời đúng, và vì sao không đi hướng khác
    var ok = B.chon.filter(function (c) { return c[1]; })[0], sai = B.chon.filter(function (c) { return !c[1]; });
    var s = '<div class="ng-q"><span>Câu hỏi ' + (i + 1) + "/" + n + ". " + B.hoi + "</span></div>";
    s += '<div class="ng-ans"><b>Trả lời:</b> ' + ok[0] + ". " + ok[2].replace(/^Đúng\.\s*/, "") + "</div>";
    if (sai.length) {
      s += '<details class="ng-khac"><summary>Vì sao không đi hướng khác?</summary><ul>';
      sai.forEach(function (c) { s += "<li><b>" + c[0] + ":</b> " + c[2] + "</li>"; });
      s += "</ul></details>";
    }
    return s;
  }

  function ngHTML(q) {
    var st = ngState(q.id), L = q.nguoc, A = L[st.a], fin = st.k >= A.buoc.length;
    var s = '<div class="tl-ng" id="ng-' + q.id + '">';
    s += '<div class="ng-top"><b>Giải bài toán theo 4 bước</b><button class="btn ghost sm" data-tl="ngauto:' + q.id + '" aria-pressed="' + docAuto() + '">🔊 Tự đọc: ' + (docAuto() ? "Bật" : "Tắt") + "</button></div>";
    s += '<div class="ng-polya" role="group" aria-label="Bốn bước">';
    POLYA.forEach(function (t, i) {
      if (i === 0 && !q.hieu) return;
      if (i === 3 && !q.nhin) return;
      s += '<button class="ng-pb' + (st.p === i + 1 ? " on" : "") + '" data-tl="ngp:' + q.id + ":" + (i + 1) + '" aria-pressed="' + (st.p === i + 1) + '"><b>' + (i + 1) + "</b> " + t + "</button>";
    });
    s += "</div>";
    if (st.p === 1 && q.hieu) {
      var H = q.hieu;
      s += '<p class="ng-ph">Bước 1. Tìm hiểu đề bài</p><p class="small" style="margin:0">Đọc kĩ đề, nhìn hình. Đề cho gì? Đề hỏi gì? Tự trả lời rồi mới bấm xem.</p>';
      if (q.fig) { try { s += q.fig(true); } catch (e) {} }
      s += '<div class="ng-gtkl"><div><b>Giả thiết (đề cho):</b> ' + H.gt + "</div><div><b>Kết luận (đề hỏi):</b> " + H.kl + "</div></div>";
      if (H.hoi) s += hoiDap(q, H.hoi, st.r1, "h");
      s += '<div class="row"><button class="btn sm" data-tl="ngp:' + q.id + ':2">Sang bước 2: Phân tích đi lên</button></div>';
    } else if (st.p === 2) {
      s += '<p class="ng-ph">Bước 2. Xây dựng chương trình giải (phân tích đi lên)</p>';
      s += '<p class="small" style="margin:0">Đi ngược từ điều phải tìm. Mỗi bước tự hỏi: <i>muốn có điều này thì cần có điều gì?</i> Cứ thế cho đến khi gặp điều đề đã cho.</p>';
      if (L.length > 1) {
        s += '<div class="row ng-tabs">';
        L.forEach(function (x, i) { s += '<button class="btn ' + (i === st.a ? "" : "ghost ") + 'sm" data-tl="nga:' + q.id + ":" + i + '" aria-pressed="' + (i === st.a) + '">' + x.ten + "</button>"; });
        s += "</div>";
      }
      s += ngFig(q, A, st, fin);
      s += '<ol class="ng-chain">';
      for (var i = 0; i < st.k; i++) s += "<li>" + ngQA(q, A.buoc[i], i, A.buoc.length) + "</li>";
      if (!fin) {
        var B = A.buoc[st.k];
        s += '<li class="ng-step ng-cur"><div class="ng-q"><span>Câu hỏi ' + (st.k + 1) + "/" + A.buoc.length + ". " + B.hoi + '</span><button class="btn ghost sm ng-say" data-tl="ngsay:' + q.id + ':q" aria-label="Đọc câu hỏi">🔊</button></div>';
        if (B.nho && st.nh) s += '<div class="ng-nho"><b>Gợi nhớ kiến thức:</b> ' + B.nho + "</div>";
        s += '<p class="small muted" style="margin:0">Em hãy tự trả lời trước (nói ra hoặc viết nháp), rồi mới bấm xem.</p>';
        s += '<div class="row"><button class="btn sm" data-tl="ngsh:' + q.id + '">Em nghĩ xong, xem trả lời</button>' + (B.nho && !st.nh ? '<button class="btn ghost sm" data-tl="ngnho:' + q.id + '">💡 Gợi nhớ kiến thức</button>' : "") + "</div></li>";
      }
      s += "</ol>";
      if (fin) {
        var sau = st.a + 1 < L.length;
        s += '<div class="ng-end"><p style="margin:0"><b>Đã đi ngược đến điều đề cho.</b> ' + A.ket + "</p>";
        s += '<div class="row"><button class="btn sm" data-tl="' + (sau ? "nga:" + q.id + ":" + (st.a + 1) + '">Phân tích tiếp ' + L[st.a + 1].ten : "ngp:" + q.id + ':3">Sang bước 3: Trình bày lời giải') + '</button></div></div>';
      }
    } else if (st.p === 3) {
      s += '<p class="ng-ph">Bước 3. Thực hiện chương trình giải (trình bày xuôi)</p>';
      s += '<p style="margin:0">Sơ đồ dưới đây tóm tắt phần phân tích ở bước 2. Khi trình bày, em đọc sơ đồ <b>từ dưới lên</b>: đi từ giả thiết, qua từng ô, đến kết luận. Mỗi ô ghi rõ ứng với bước nào của lời giải. Em hãy tự viết vào vở, mỗi bước ghi rõ căn cứ, rồi mới đối chiếu.</p>';
      if (q.fig) { try { s += q.fig(false); } catch (e) {} }
      L.forEach(function (x) { s += (L.length > 1 ? '<div class="ng-cap" style="margin:0">' + x.ten + "</div>" : "") + sdHTML(x, true); });
      s += '<div class="row"><button class="btn sm" data-tl="ngsol:' + q.id + '">Đối chiếu: xem lời giải từng bước</button><button class="btn ghost sm ng-say" data-tl="ngmsay:' + q.id + '">🔊 Đọc sơ đồ</button>' + (q.nhin ? '<button class="btn ghost sm" data-tl="ngp:' + q.id + ':4">Sang bước 4: Nhìn lại</button>' : "") + "</div>";
    } else if (st.p === 4 && q.nhin) {
      s += '<p class="ng-ph">Bước 4. Kiểm tra và nghiên cứu lời giải (nhìn lại)</p>';
      s += '<p class="small" style="margin:0">Giải xong chưa phải là hết. Thử lại kết quả, xem đã dùng hết giả thiết chưa, tìm cách khác, đặt bài toán mới.</p>';
      s += hoiDap(q, q.nhin, st.r4, "n");
      s += '<div class="row"><button class="btn ghost sm" data-tl="ngr:' + q.id + '">Làm lại từ bước 1</button></div>';
    }
    return s + "</div>";
  }

  /* Hình vẽ trong phần phân tích: chưa đến bước kẻ thêm thì chỉ vẽ hình của đề (không lộ hình phụ). */
  function ngFig(q, A, st, fin) {
    if (!q.fig) return "";
    var v = -1; A.buoc.forEach(function (b, i) { if (b.ve && v < 0) v = i; });
    var goc = fin ? false : v >= 0 ? st.k <= v : st.a === 0;
    try { return q.fig(goc); } catch (e) { return ""; }
  }
  function mapHTML(q) {   // hiện luôn toàn bộ sơ đồ suy luận ngược
    var s = '<div class="tl-ng" id="map-' + q.id + '"><div class="ng-top"><b>Sơ đồ suy luận ngược</b><button class="btn ghost sm ng-say" data-tl="ngmsay:' + q.id + '">🔊 Đọc sơ đồ</button></div>';
    s += '<p class="small" style="margin:0">Đọc từ trên xuống: muốn có điều trên thì cần có điều dưới. Viết lời giải thì đi ngược lại, từ dưới lên.</p>';
    if (q.fig) { try { s += q.fig(false); } catch (e) {} }
    q.nguoc.forEach(function (A) {
      if (q.nguoc.length > 1) s += '<div class="ng-cap" style="margin-top:4px">' + A.ten + "</div>";
      s += sdHTML(A, false) + '<p class="small" style="margin:0"><b>Kết luận:</b> ' + A.ket + "</p>";
    });
    return s + "</div>";
  }

  /* ---------- Giọng đọc: giọng tiếng Việt có sẵn của trình duyệt (miễn phí, không tải thêm) ---------- */
  var KEY_DOC = "tl-doc";
  function docAuto() { try { return localStorage.getItem(KEY_DOC) !== "0"; } catch (e) { return true; } }   // mặc định bật, học sinh tắt được
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
  /* Chỉ đọc bằng giọng tiếng Việt. Máy không có giọng tiếng Việt thì không đọc (tránh giọng tiếng Anh đọc sai) và hướng dẫn cài. */
  function giong() {
    try {
      var v = speechSynthesis.getVoices().filter(function (x) { return /^vi([-_]|$)/i.test(x.lang) || /vietnam|tiếng việt/i.test(x.name); });
      v.sort(function (a, b) { return (/natural|online|google/i.test(b.name) ? 1 : 0) - (/natural|online|google/i.test(a.name) ? 1 : 0); });
      return v[0] || null;
    } catch (e) { return null; }
  }
  function choGiong(cb) {   // trình duyệt nạp danh sách giọng chậm: chờ tối đa 1,5 giây
    try { if (speechSynthesis.getVoices().length) return cb(); } catch (e) { return cb(); }
    var xong = false, f = function () { if (!xong) { xong = true; cb(); } };
    try { speechSynthesis.addEventListener("voiceschanged", f); } catch (e) {}
    setTimeout(f, 1500);
  }
  try { if (window.speechSynthesis) speechSynthesis.getVoices(); } catch (e) {}
  function huongDanGiong() {
    var ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua)) return "Máy em chưa có giọng đọc tiếng Việt. Cài như sau: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Việt → tải giọng Linh. Tải xong mở lại trang.";
    if (/Android/i.test(ua)) return "Máy em chưa có giọng đọc tiếng Việt. Cài như sau: Cài đặt → tìm \"Chuyển văn bản thành giọng nói\" → chọn Công cụ của Google → bấm biểu tượng bánh răng → Cài đặt dữ liệu giọng nói → Tiếng Việt → tải về. Tải xong mở lại trang.";
    if (/Edg\//.test(ua)) return "Máy tính chưa có giọng đọc tiếng Việt. Cài như sau: Cài đặt Windows → Thời gian và ngôn ngữ → Ngôn ngữ và vùng → Thêm ngôn ngữ → Tiếng Việt → tích ô Giọng nói (Text-to-speech) → Cài đặt. Xong thì mở lại trình duyệt.";
    return "Máy chưa có giọng đọc tiếng Việt. Trên máy tính, cách dễ nhất là mở trang bằng trình duyệt Microsoft Edge (có sẵn giọng tiếng Việt). Hoặc cài cho Windows: Cài đặt → Thời gian và ngôn ngữ → Ngôn ngữ và vùng → Thêm ngôn ngữ → Tiếng Việt → tích ô Giọng nói → Cài đặt, rồi mở lại trình duyệt.";
  }
  function noi(text, el) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { baoGiong(el, "Trình duyệt này chưa hỗ trợ đọc to."); return; }
    try { speechSynthesis.cancel(); } catch (e) {}
    choGiong(function () {
      var v = giong();
      if (!v) { baoGiong(el, huongDanGiong()); return; }
      try {
        var u = new SpeechSynthesisUtterance(doc(text));
        u.lang = v.lang || "vi-VN"; u.rate = 0.9;
        try { u.voice = v; } catch (e) { u.__v = v; }
        speechSynthesis.speak(u);
      } catch (e) { baoGiong(el, "Không đọc được trên máy này."); }
    });
  }
  function baoGiong(el, msg) {
    var box = el && el.isConnected && el.closest ? el.closest(".tl-ng") : null;
    if (!box && el && el.closest) { var art = el.isConnected ? el.closest(".tl-q") : null; box = art && art.querySelector(".tl-ng"); }
    if (!box) box = document.querySelector(".tl-ng");
    if (!box || box.querySelector(".ng-voice")) return;
    var p = document.createElement("p"); p.className = "small ng-voice"; p.style.cssText = "margin:0;background:var(--warn-bg);border-radius:8px;padding:8px 10px"; p.textContent = msg; box.appendChild(p);
  }
  function ngText(q, what) {
    var st = ngState(q.id), A = q.nguoc[st.a], B = A.buoc[Math.min(st.k, A.buoc.length - 1)];
    if (what === "q") return B.hoi;
    if (what === "e") return B.hoi;
    if (/^[hn]\d+$/.test(what)) { var x = (what[0] === "h" ? q.hieu.hoi : q.nhin)[+what.slice(1)]; return x ? x[0] : ""; }
    if (what === "p") {
      if (st.p === 1) return "Bước 1. Tìm hiểu đề bài. Giả thiết: " + q.hieu.gt + ". Kết luận: " + q.hieu.kl + ".";
      if (st.p === 2) return "Bước 2. Phân tích đi lên. " + (st.k < A.buoc.length ? B.hoi : mapText(A));
      if (st.p === 3) return "Bước 3. Trình bày lời giải. Đọc sơ đồ từ dưới lên, em hãy tự viết lời giải vào vở, mỗi bước ghi rõ vì sao.";
      return "Bước 4. Nhìn lại. Thử lại kết quả, xem đã dùng hết giả thiết chưa, tìm cách khác, đặt bài toán mới.";
    }
    return mapText(A);
  }
  function mapText(A) {
    if (A.sd) {
      var t = "Sơ đồ phân tích. Cần: " + A.dich + ". ";
      A.sd.forEach(function (x) { t += "Muốn vậy, cần có: " + x[0] + ". "; });
      return t + "Đến đây đã gặp giả thiết: " + (A.gt || "") + ". Khi trình bày lời giải, đi ngược lại từ dưới lên.";
    }
    var s = "Cần: " + A.dich + ". ";
    A.buoc.forEach(function (b) { s += "Muốn vậy, cần có: " + b.dat + ". "; });
    return s + "Đến đây đã gặp điều đề cho. " + A.ket;
  }
  function ngAct(act, q, a, b) {
    var id = q.id, st = ngState(id), box = function () { return document.getElementById("ng-" + id); };
    var len = function () { return document.querySelector("#ng-" + id + " .ng-ph"); };
    if (act === "ngmap") { if (ui.map[id]) { delete ui.map[id]; try { speechSynthesis.cancel(); } catch (e) {} } else ui.map[id] = 1; rerender("ngmap:" + id); return; }
    if (act === "ngmsay") { noi(q.nguoc.map(function (A) { return (q.nguoc.length > 1 ? A.ten + ". " : "") + mapText(A); }).join(" "), b); return; }
    if (act === "ng") { if (st) { delete ui.ng[id]; try { speechSynthesis.cancel(); } catch (e) {} } else ui.ng[id] = ngNew(0, soBuoc(q)); rerender("ng:" + id); if (ui.ng[id] && docAuto()) noi(ngText(q, "p"), b); return; }
    if (!st) return;
    var A = q.nguoc[st.a];
    if (act === "ngp") {
      var p = +a[2]; if (p === 1 && !q.hieu || p === 4 && !q.nhin) return;
      st.p = p; rerender("ngp:" + id + ":" + p);
      var h = len(); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); h.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
      if (docAuto()) noi(ngText(q, "p"), box());
    }
    else if (act === "nga") { ui.ng[id] = ngNew(+a[2], 2); rerender("nga:" + id + ":" + a[2]); if (docAuto()) noi(ngText(q, "q"), b); }
    else if (act === "ngsh") {
      var Bk = A.buoc[st.k], okc = Bk.chon.filter(function (c) { return c[1]; })[0];
      st.k++; st.nh = false; rerender(null);
      var cur = document.querySelector('#ng-' + id + ' .ng-cur') || document.querySelector('#ng-' + id + ' .ng-end');
      if (cur) { cur.setAttribute("tabindex", "-1"); cur.focus({ preventScroll: true }); cur.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
      if (docAuto()) noi("Trả lời: " + okc[0] + ". " + (st.k < A.buoc.length ? "Câu hỏi tiếp. " + A.buoc[st.k].hoi : A.ket), box());
    }
    else if (act === "ngnho") { st.nh = true; rerender(null); var B0 = A.buoc[st.k]; if (docAuto() && B0 && B0.nho) noi("Gợi nhớ kiến thức. " + B0.nho, box()); }
    else if (act === "ngxem") {
      var c0 = a[2][0], i0 = +a[2].slice(1), L0 = c0 === "h" ? q.hieu.hoi : q.nhin; if (!L0 || !L0[i0]) return;
      (c0 === "h" ? st.r1 : st.r4)[i0] = true; rerender(null);
      if (docAuto()) noi(L0[i0][1], box());
    }
    else if (act === "ngc") {
      var j = +a[2], c = A.buoc[st.k].chon[j]; if (!c) return;
      st.t[j] = true; if (c[1]) st.ok = true;
      rerender(c[1] ? "ngn:" + id : null);
      if (docAuto()) noi((c[1] ? "Đúng hướng. " : "Chưa dẫn tới đích. ") + c[2], box());
      if (!c[1]) { var w = document.querySelector('#ng-' + id + ' .ng-opt:not([disabled])'); if (w) w.focus({ preventScroll: true }); }
    }
    else if (act === "ngn") { st.k++; st.t = {}; st.ok = false; st.sh = false; st.nh = false; rerender(null); var f = document.querySelector('#ng-' + id + ' .ng-q span'); if (f) { f.setAttribute("tabindex", "-1"); f.focus({ preventScroll: true }); } if (docAuto()) noi(st.k < A.buoc.length ? ngText(q, "q") : A.ket, box()); }
    else if (act === "ngr") { ui.ng[id] = ngNew(0, soBuoc(q)); rerender(null); if (docAuto()) noi(ngText(q, "p"), box()); }
    else if (act === "ngsol") { ui.step[id] = 1; rerender("next:" + id); var o2 = document.querySelector("#tl-" + id + " .tl-sol"); if (o2) o2.scrollIntoView({ block: "start", behavior: "smooth" }); }
    else if (act === "ngsay") { var w2 = a[2]; noi(w2 === "m" ? ngText(q, "m") : w2 === "e" ? ngText(q, "e") : /^[hn]\d+$/.test(w2) ? ngText(q, w2) : ngText(q, "q"), b); }
    else if (act === "ngauto") { try { localStorage.setItem(KEY_DOC, docAuto() ? "0" : "1"); } catch (e) {} rerender("ngauto:" + id); if (docAuto()) noi(ngText(q, st.p === 2 && st.k < A.buoc.length ? "q" : "p"), b); else try { speechSynthesis.cancel(); } catch (e) {} }
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
    ".ng-polya{display:flex;flex-wrap:wrap;gap:6px}.ng-pb{font:inherit;font-size:.88em;color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:999px;padding:5px 11px;cursor:pointer}.ng-pb b{color:var(--accent)}.ng-pb.on{background:var(--accent);border-color:var(--accent);color:#fff}.ng-pb.on b{color:#fff}" +
    ".ng-ph{margin:0;font-weight:700;color:var(--accent)}" +
    ".ng-gtkl{background:var(--paper);border-radius:10px;padding:8px 12px;display:flex;flex-direction:column;gap:4px}" +
    ".ng-hd{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:10px}.ng-hd li>.btn{margin-top:4px}" +
    ".tl-pp{background:var(--paper);border-left:4px solid var(--accent);border-radius:10px;padding:10px 12px}.tl-pp ul{margin:6px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:4px}" +
    ".tl-lv{font-size:.8em;font-weight:600}.tl-lv-NB{background:var(--good-bg);color:var(--good)}.tl-lv-TH{background:var(--paper);color:var(--accent)}.tl-lv-VD{background:var(--warn-bg);color:var(--warn)}.tl-lv-HSG{background:var(--bad-bg);color:var(--bad)}" +
    ".ng-ref{display:block;font-size:.82em;color:var(--muted);margin-top:2px}" +
    ".ng-ans{background:var(--good-bg);border-radius:8px;padding:6px 10px;margin-top:4px}" +
    ".ng-chain{margin:0;padding-left:0;list-style:none;display:flex;flex-direction:column;gap:12px}.ng-chain>li{border-left:3px solid var(--line);padding-left:10px;display:flex;flex-direction:column;gap:6px}.ng-chain>li.ng-cur{border-left-color:var(--accent)}" +
    ".ng-khac summary{cursor:pointer;color:var(--muted);font-size:.92em}.ng-khac ul{margin:4px 0 0;padding-left:20px;font-size:.92em}" +
    ".ng-nho{background:var(--warn-bg);border-radius:8px;padding:6px 10px}" +
    "@media (max-width:560px){#tl-box{padding:14px 12px}.tl-q{padding:12px 10px}.tl-sol{padding:10px 8px}.tl-sol ol{padding-left:18px}.tl-sol .figbox{margin:4px 0}}";
  try { var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st); } catch (e) {}

  window.TuLuan = { html: html, rerender: rerender, LV: LV, doc: doc };
})();
