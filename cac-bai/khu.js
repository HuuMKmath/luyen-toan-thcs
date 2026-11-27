/* Bố cục toàn trang (thầy chốt 27/11/2026): thanh dưới đáy Luyện tập · Tự luận · Luyện đề · HSG, lớp 9 thêm Vào 10;
   "Của em" (tiến độ, XP, huy hiệu, xếp hạng) mở bằng nút ở góc trên. Giai đoạn này chưa thu phí nên không hiện nhãn phí.
   Mỗi khu ứng với một địa chỉ #...: #tu-luan, #luyen-de, #hsg, #vao-10, #cua-em (cũ: #bxh); còn lại là Luyện tập.
   Phần tử thuộc khu nào ghi ở thuộc tính data-khu. Khi chưa nhập mã, ô nhập mã (#me) luôn hiện ở Luyện tập. */
(function () {
  // Các bài đã có phần tự luận: thêm thư mục bài vào đây khi bài có tu-luan-de.js
  var TU_LUAN = ["tam-giac-can-duong-trung-truc", "luyen-tap-chung-sau-bai-16", "bai-tap-cuoi-chuong-4-toan-7"];
  var KHU = ["luyen-tap", "tu-luan", "luyen-de", "hsg", "vao-10", "cua-em"];
  var dn = false, lop = "", gv = false;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function coVao10() { return gv || lop === "9"; }
  function khuHienTai() {
    var h = location.hash.replace("#", "");
    if (h === "bxh") h = "cua-em";
    if (KHU.indexOf(h) < 0) h = "luyen-tap";
    if (h === "vao-10" && !coVao10()) h = "luyen-tap";
    if (h === "cua-em" && !dn) h = "luyen-tap";   // chưa nhập mã: ô nhập mã nằm ở Luyện tập
    return h;
  }
  function sapCo(t, m) { return '<div class="k-card"><div class="k-tx"><b>' + t + "</b><span>" + m + '</span></div><span class="chip new">Sắp có</span></div>'; }
  function tuLuanHTML() {
    var cards = [].slice.call(document.querySelectorAll("a.lesson[data-tab]"));
    var ds = cards.filter(function (a) {
      var dir = (a.getAttribute("href") || "").replace(/^\.\.\//, "").replace(/\/$/, "");
      var g = (a.getAttribute("data-tab").match(/^\d+/) || [""])[0];
      return TU_LUAN.indexOf(dir) >= 0 && (!lop || gv || g === lop);
    });
    var s = '<p class="sum">Bài tập tự luận theo từng bài học: chia theo dạng, có phương pháp giải, phân tích ngược và giải theo 4 bước. Em làm ra giấy rồi so với lời giải mẫu.</p>';
    if (ds.length) s += ds.map(function (a) {
      var h = a.querySelector("h4"), g = (a.getAttribute("data-tab").match(/^\d+/) || [""])[0];
      return '<a class="k-card" href="' + esc(a.getAttribute("href")) + '#tu-luan"><div class="k-tx"><b>' + esc(h ? h.textContent : a.getAttribute("data-tab")) + "</b><span>Toán " + esc(g) + '</span></div><span class="k-chev" aria-hidden="true">›</span></a>';
    }).join("");
    s += '<p class="sum k-note">' + (ds.length ? "Các bài khác đang được soạn thêm." : "Phần tự luận của lớp " + esc(lop) + " đang được soạn, sắp có.") + "</p>";
    return s;
  }
  function veKhu() {
    var k = khuHienTai();
    document.body.setAttribute("data-khu", k);
    document.body.classList.toggle("dn", dn);
    [].forEach.call(document.querySelectorAll("[data-khu-el]"), function (el) {
      var thuoc = el.getAttribute("data-khu-el").split(" ");
      var hien = thuoc.indexOf(k) >= 0 || (el.id === "me" && !dn && k === "luyen-tap");
      el.classList.toggle("k-an", !hien);
    });
    [].forEach.call(document.querySelectorAll(".k-nav a"), function (a) {
      var on = a.getAttribute("data-k") === k;
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    var v = document.querySelector('.k-nav a[data-k="vao-10"]'); if (v) v.hidden = !coVao10();
    var nav = document.querySelector(".k-nav"); if (nav) nav.classList.toggle("n5", coVao10());
    var mb = document.getElementById("me-btn"); if (mb) { mb.hidden = !dn; mb.setAttribute("aria-pressed", k === "cua-em" ? "true" : "false"); }
    if (k === "tu-luan") document.getElementById("k-tu-luan-body").innerHTML = tuLuanHTML();
    var lopTx = lop ? " lớp " + lop : "";
    var x = document.getElementById("k-lop-de"); if (x) x.textContent = lopTx;
    var y = document.getElementById("k-lop-hsg"); if (y) y.textContent = lopTx;
  }
  var cuon = "";
  window.addEventListener("hashchange", function () {
    var k = khuHienTai();
    veKhu();
    // Đổi khu thì lên đầu trang; #lop-6… và #bxh thì để trình duyệt tự cuộn tới
    if (k !== cuon && !/^#(lop-\d|bxh)$/.test(location.hash)) window.scrollTo(0, 0);
    cuon = k;
  });
  window.KHU = {
    // Gọi từ trang Các bài: đã nhập mã hay chưa, lớp của em (mã GV xem được mọi khu)
    dn: function (co, lopEm, laGV) { dn = !!co; lop = co ? String(lopEm || "") : ""; gv = !!(co && laGV); veKhu(); },
    ve: veKhu
  };
  document.addEventListener("DOMContentLoaded", function () { cuon = khuHienTai(); veKhu(); });
  if (document.readyState !== "loading") { cuon = khuHienTai(); veKhu(); }
})();
