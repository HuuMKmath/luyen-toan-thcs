/* Lộ trình của em (trang mỗi bài học, phương án 1 "Lộ trình từng bước", làm thử ở Bài 16 Toán 7).
   5 bước: Ôn kiến thức → Gói Nhận biết → Gói Thông hiểu → Gói Vận dụng → Kiểm tra 25 phút (hoặc Thử thách 30 phút) từ 5 điểm.
   Bước NB, TH, VD, KT trùng điều kiện mở bài tiếp theo trong khoa-bai.js (không đổi).
   Bước "Tập phân tích" đã bỏ khỏi Lộ trình (thầy chốt 27/11/2026): bài mẫu 4 bước nằm trong từng dạng của phần tự luận;
   nút "Cùng phân tích cách giải" khi sai câu Vận dụng vẫn giữ (tu-luan.js).

   Tiến độ lấy từ:
     - máy chủ (SHEET_URL?ma=...&tiendo=1, giống khoa-bai.js): gói đã xong và điểm cao nhất;
     - máy học sinh (localStorage): đánh dấu khi vừa làm xong, để thấy dấu tích ngay cả khi mất mạng.

   Cách dùng trong trang bài:
     LoTrinh.init({ tab: SHEET_TAB, url: SHEET_URL, user: () => mã HS, next: { ten, url }, onChange: render });
     LoTrinh.html({ recap: '<html phần ôn kiến thức>' })   → khung lộ trình (đặt đầu trang)
     LoTrinh.goi('NB' | 'TH' | 'VD')                       → gọi khi làm hết câu của gói
     LoTrinh.diem(so_diem)                                 → gọi khi nộp Kiểm tra 25 phút / Thử thách 30 phút
     LoTrinh.click(e)                                      → trả về true nếu đã xử lí nút của lộ trình */
(function () {
  "use strict";
  var DIEM_QUA = 5;
  var BUOC = [
    { k: "ON", ten: "Ôn kiến thức", mo: "Đọc quy tắc và ví dụ mẫu của từng phần" },
    { k: "NB", ten: "Gói Nhận biết", mo: "Nhớ đúng khái niệm, kí hiệu, tính chất" },
    { k: "TH", ten: "Gói Thông hiểu", mo: "Tính toán, suy luận một hai bước" },
    { k: "VD", ten: "Gói Vận dụng", mo: "Bài nhiều bước, kết hợp bài trước, tình huống thực tế" },
    { k: "KT", ten: "Kiểm tra 25 phút", mo: "Đạt từ " + DIEM_QUA + " điểm (hoặc Thử thách 30 phút từ " + DIEM_QUA + " điểm)" }
  ];
  var cfg = {}, sv = null, svU = "", dangTai = false, lastO = null;
  var BAT_BUOC = ["NB", "TH", "VD", "KT"];
  function buoc() { return BUOC; }

  function u() { try { return (cfg.user && cfg.user()) || ""; } catch (e) { return ""; } }
  function key(t) { return "luyentoan-lt:" + u() + "|" + cfg.tab + "|" + t; }
  function get(t) { try { return localStorage.getItem(key(t)); } catch (e) { return null; } }
  function set(t, v) { try { localStorage.setItem(key(t), String(v)); } catch (e) {} }
  function num(x) { var n = parseFloat(String(x == null ? "" : x).replace(",", ".")); return isFinite(n) ? n : -1; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function taiMayChu() {
    var id = u();
    if (!cfg.url || !id || dangTai || svU === id) return;
    dangTai = true;
    fetch(cfg.url + "?ma=" + encodeURIComponent(id) + "&tiendo=1").then(function (r) { return r.json(); }).then(function (o) {
      dangTai = false; svU = id;
      if (o && o.ok) { sv = o; if (cfg.onChange) cfg.onChange(); }
    }).catch(function () { dangTai = false; svU = id; });
  }

  function trangThai() {
    var goi = [], diem = num(get("KT"));
    if (sv && svU === u()) {
      goi = String((sv.goi || {})[cfg.tab] || "").split(/\s+/);
      var bai = sv.bai || {}, a = bai[cfg.tab], b = bai[cfg.tab + " - Thử thách"];
      diem = Math.max(diem, a ? num(a.k) : -1, b ? num(b.k) : -1);
    }
    var xong = {};
    xong.ON = !!get("ON");
    ["NB", "TH", "VD"].forEach(function (g) {
      var k2 = "luyentoan-goi:" + u() + "|" + cfg.tab + "|" + g, daGui = null;
      try { daGui = localStorage.getItem(k2); } catch (e) {}
      xong[g] = goi.indexOf(g) >= 0 || !!get(g) || !!daGui;
    });
    xong.KT = diem >= DIEM_QUA;
    return { xong: xong, diem: diem };
  }

  function html(o) {
    o = o || {}; lastO = o;
    taiMayChu();
    var BUOC = buoc(), t = trangThai(), x = t.xong, n = BUOC.filter(function (b) { return x[b.k]; }).length;
    var hienTai = -1;
    for (var i = 0; i < BUOC.length; i++) if (!x[BUOC[i].k]) { hienTai = i; break; }
    var duDK = BAT_BUOC.every(function (k) { return x[k]; });   // đủ điều kiện mở bài tiếp theo
    var truocKT = x.NB && x.TH && x.VD;                          // đã xong ba gói: được làm Kiểm tra
    var s = '<section class="card lt" id="lo-trinh" style="margin-top:18px" aria-labelledby="lt-h">';
    s += '<div class="lt-top"><h2 id="lt-h">Lộ trình của em</h2><span class="lt-n">' + n + "/" + BUOC.length + " bước</span></div>";
    s += '<div class="lt-bar" aria-hidden="true">' + BUOC.map(function (b) { return '<i class="' + (x[b.k] ? "ok" : "") + '"></i>'; }).join("") + "</div>";
    s += '<ol class="lt-list">';
    BUOC.forEach(function (b, i) {
      var ok = x[b.k], now = i === hienTai;
      var cls = ok ? "done" : now ? "now" : "todo";
      var phu = b.mo;
      if (b.k === "KT" && t.diem >= 0) phu = "Điểm cao nhất hiện nay: " + String(t.diem).replace(".", ",") + (ok ? "" : " (cần từ " + DIEM_QUA + " điểm)");
      s += '<li class="lt-st ' + cls + '"><span class="lt-dot" aria-hidden="true">' + (ok ? "✓" : i + 1) + "</span>";
      s += '<div class="lt-tx"><b>' + b.ten + '</b><span class="sr"> ' + (ok ? "(đã xong)" : now ? "(bước đang làm)" : "(chưa làm)") + "</span><small>" + esc(phu) + "</small>";
      if (b.tuy) s += '<span class="lt-tuy">Không bắt buộc để mở bài tiếp theo</span>';
      if (now) s += '<button class="btn sm lt-go" data-lt="' + b.k + '">' + (b.k === "ON" ? "Ôn ngay" : b.k === "KT" ? "Đến phần Kiểm tra" : "Làm ngay") + "</button>";
      else if (b.k === "KT" && !ok && truocKT) s += '<button class="btn sm ghost lt-go" data-lt="KT">Đến phần Kiểm tra</button>';
      else if (ok && b.k !== "ON" && b.k !== "KT") s += '<button class="lt-re" data-lt="' + b.k + '">Làm lại</button>';
      else if (ok && b.k === "ON") s += '<button class="lt-re" data-lt="ON">Xem lại</button>';
      s += "</div></li>";
    });
    s += "</ol>";
    var moTiep = cfg.next && cfg.next.url ? 'Bài tiếp theo đã mở: <a href="' + esc(cfg.next.url) + '">' + esc(cfg.next.ten) + " →</a>" : "";
    if (hienTai < 0) {
      s += '<div class="lt-ok">🎉 Em đã đi hết lộ trình của bài này.' + (moTiep ? " " + moTiep : "") + "</div>";
    } else if (duDK) {
      s += '<div class="lt-ok">🎉 Em đã đủ điều kiện qua bài.' + (moTiep ? " " + moTiep : "") + "</div>";
    } else {
      s += '<p class="small muted" style="margin:10px 0 0">Xong ba gói Nhận biết, Thông hiểu, Vận dụng và Kiểm tra 25 phút từ ' + DIEM_QUA + ' điểm là mở được bài tiếp theo' + (cfg.next ? " (" + esc(cfg.next.ten) + ")" : "") + ". Các gói khác ở mục Luyện thêm bên dưới.</p>";
    }
    // Phần ôn kiến thức nằm ngay trong lộ trình, mở ra khi bấm Ôn ngay / Xem lại
    s += '<details class="lt-on" id="lt-on"' + (o.moOn ? " open" : "") + "><summary>📘 Ôn kiến thức và ví dụ mẫu</summary>" + (o.recap || "");
    s += '<div class="row" style="margin-top:12px">' + (x.ON ? '<span class="small muted">Em đã ôn phần này ✓</span>' : '<button class="btn" data-lt="ON-XONG">Em đã ôn xong, sang Gói Nhận biết</button>') + "</div></details>";
    s += "</section>";
    return s;
  }

  function click(e) {
    var el = e.target.closest && e.target.closest("[data-lt]");
    if (!el) return false;
    var k = el.getAttribute("data-lt");
    if (k === "ON") { var d = document.getElementById("lt-on"); if (d) { d.open = true; d.scrollIntoView({ behavior: "smooth", block: "start" }); } return true; }
    if (k === "ON-XONG") { set("ON", 1); if (cfg.onChange) cfg.onChange(); var l = document.getElementById("lo-trinh"); if (l) l.scrollIntoView({ block: "start" }); return true; }
    if (k === "KT") { var kt = document.getElementById("kt-box"); if (kt) { kt.open = true; kt.scrollIntoView({ behavior: "smooth", block: "start" }); } return true; }
    if (cfg.startLevel) cfg.startLevel(k);
    return true;
  }

  window.LoTrinh = {
    init: function (c) { cfg = c || {}; },
    html: html,
    click: click,
    goi: function (g) { if (["NB", "TH", "VD"].indexOf(g) >= 0) set(g, 1); },
    diem: function (d) { var n = num(d); if (n > num(get("KT"))) set("KT", n); },
    lamMoi: function () { svU = ""; },
    /* tu-luan.js vẫn gọi hai hàm này khi em phân tích xong một bài mẫu; Lộ trình không còn bước Tập phân tích nên chỉ ghi nhớ, vẽ lại như cũ. */
    phanTich: function () { set("PT", 1); },
    capNhat: function () {
      var el = document.getElementById("lo-trinh");
      if (el && lastO) { var o2 = Object.assign({}, lastO), d = document.getElementById("lt-pt"), d2 = document.getElementById("lt-on"); o2.moPt = d ? d.open : lastO.moPt; o2.moOn = d2 ? d2.open : lastO.moOn; el.outerHTML = html(o2); }
    }
  };
})();
