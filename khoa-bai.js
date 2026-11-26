/* Khóa bài theo thứ tự (dùng chung cho trang Các bài và các trang bài học).
   Chỉ áp dụng cho các bài soạn từ 25/11/2026 trở đi; bài cũ và bài đầu mỗi chương luôn mở.

   Điều kiện để mở một bài: ở BÀI TRƯỚC, học sinh đã
     (1) làm xong 3 gói Nhận biết, Thông hiểu, Vận dụng (làm hết các câu của gói), và
     (2) đạt từ 5 điểm ở bài Kiểm tra 25 phút HOẶC bài Thử thách 30 phút (lấy điểm cao nhất).
   Chưa đạt thì chờ giáo viên mở: giáo viên tích ô "Mở" cho lớp và bài đó ở trang tính "Mở bài" của Google Sheet.
   Mã giáo viên (lớp GV) luôn vào được. Mất mạng, không kiểm tra được thì cho vào (học sinh không bị kẹt).

   THÊM BÀI MỚI: thêm một dòng vào KHOA bên dưới,
     "<tên trang tính của bài mới>": ["<tên trang tính của bài trước>", "<thư mục bài trước>/"],
   theo đúng thứ tự dạy (kế hoạch giáo dục). Bài đầu chương thì KHÔNG thêm dòng. */
(function () {
  "use strict";
  var KHOA = {
    // "7 - Tên bài mới": ["7 - Tên bài trước", "thu-muc-bai-truoc/"],
    "7 - Tam giác cân, đường trung trực": ["7 - Tam giác vuông bằng nhau", "tam-giac-vuong-bang-nhau/"],
    "7 - Biểu đồ hình quạt tròn": ["7 - Thu thập và phân loại dữ liệu", "thu-thap-phan-loai-du-lieu/"],
  };
  var DIEM_QUA = 5;
  var GOI = [["NB", "Nhận biết"], ["TH", "Thông hiểu"], ["VD", "Vận dụng"]];
  var HS_KEY = "luyentoan-hs";

  function num(x) { var n = parseFloat(String(x == null ? "" : x).replace(",", ".")); return isFinite(n) ? n : -1; }
  function laGV(c) { return /^\s*gv\s*$/i.test(String(c || "")); }
  function chuan(s) { return String(s || "").replace(/\s+/g, " ").trim().toLowerCase(); }
  // Thư mục gốc của website (nơi có khoa-bai.js)
  var GOC = "";
  try { GOC = new URL(".", document.currentScript.src).href; } catch (e) {}

  /* Xét một bài với dữ liệu tiến độ o (từ Sheet: ?ma=...&tiendo=1).
     Trả về { mo: true } hoặc { mo: false, truoc, url, thieu: [...], goiThieu: [...], diem } */
  function xet(o, tab) {
    var k = KHOA[tab];
    if (!k || !o || laGV(o.c)) return { mo: true };
    var mo = (o.mo || []).map(chuan);
    if (mo.indexOf(chuan(tab)) >= 0) return { mo: true, gvMo: true };
    var truoc = k[0], goi = String((o.goi || {})[truoc] || "").split(/\s+/);
    var bai = o.bai || {}, a = bai[truoc], b = bai[truoc + " - Thử thách"];
    var diem = Math.max(a ? num(a.k) : -1, b ? num(b.k) : -1);
    var goiThieu = GOI.filter(function (g) { return goi.indexOf(g[0]) < 0; }).map(function (g) { return g[1]; });
    var thieu = [];
    if (goiThieu.length) thieu.push("làm xong gói " + goiThieu.join(", "));
    if (diem < DIEM_QUA) thieu.push("đạt từ " + DIEM_QUA + " điểm ở bài Kiểm tra 25 phút hoặc Thử thách 30 phút" + (diem >= 0 ? " (điểm cao nhất hiện nay: " + String(diem).replace(".", ",") + ")" : ""));
    return thieu.length ? { mo: false, truoc: truoc, url: GOC ? GOC + k[1] : "", thieu: thieu, goiThieu: goiThieu, diem: diem } : { mo: true };
  }
  function tenBai(tab) { return String(tab || "").replace(/^\s*\d+\s*-\s*/, ""); }
  function loiNhan(x) { return "Để mở bài này, ở bài “" + tenBai(x.truoc) + "” em cần " + x.thieu.join(" và ") + "."; }

  /* Ghi lên Sheet khi học sinh làm hết các câu của gói Nhận biết / Thông hiểu / Vận dụng (gọi từ gamify.js). */
  var daGui = {};
  function goiXong(url, u, bai, goi) {
    if (!url || !u || !bai || ["NB", "TH", "VD"].indexOf(goi) < 0) return;
    var key = u + "|" + bai + "|" + goi, k2 = "luyentoan-goi:" + key;
    try { if (localStorage.getItem(k2)) return; } catch (e) {}
    if (daGui[key]) return; daGui[key] = 1;
    var opt = { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ xg: 1, u: u, bai: bai, goi: goi }) };
    fetch(url, opt).then(function (r) { return r.json(); }).then(function (o) {
      if (o && o.ok) { try { localStorage.setItem(k2, "1"); } catch (e) {} } else daGui[key] = 0;
    }).catch(function () {
      // thử lại kiểu no-cors (không đọc được trả lời, lần sau vào bài sẽ gửi lại nếu cần)
      fetch(url, Object.assign({ mode: "no-cors" }, opt)).catch(function () {}); daGui[key] = 0;
    });
  }

  /* ---- Trên trang bài học: nếu bài bị khóa thì che trang và chỉ đường về bài trước ---- */
  function trangBai() {
    var tab = "", url = "";
    try { tab = SHEET_TAB; url = SHEET_URL; } catch (e) { return; }   // eslint-disable-line no-undef
    if (!KHOA[tab] || !url) return;
    var daXet = "", che = null;
    function hs() { try { var o = JSON.parse(localStorage.getItem(HS_KEY) || "null"); return o && o.u ? o : null; } catch (e) { return null; } }
    function bo() { if (che) { che.remove(); che = null; } }
    function hien(x) {
      if (!che) {
        che = document.createElement("div");
        che.setAttribute("role", "dialog"); che.setAttribute("aria-modal", "true"); che.setAttribute("aria-labelledby", "kb-t");
        che.style.cssText = "position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:16px;background:rgba(20,30,60,.55);backdrop-filter:blur(3px)";
        document.body.appendChild(che);
      }
      var goc = GOC ? GOC + "cac-bai/" : "../cac-bai/";
      che.innerHTML = '<div style="max-width:440px;width:100%;background:var(--card,#fff);color:var(--ink,#1c2340);border-radius:18px;padding:22px 20px;box-shadow:0 12px 40px rgba(0,0,0,.25);font-family:inherit">' +
        '<div style="font-size:2rem;line-height:1" aria-hidden="true">🔒</div>' +
        '<h2 id="kb-t" style="margin:8px 0 6px;font-size:1.2rem">Bài này chưa mở</h2>' +
        '<p style="margin:0 0 10px;line-height:1.5">' + esc(loiNhan(x)) + "</p>" +
        '<p style="margin:0 0 14px;line-height:1.5;opacity:.8;font-size:.92rem">Nếu chưa đạt, em chờ thầy cô mở bài cho cả lớp nhé.</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
        (x.url ? '<a href="' + esc(x.url) + '" style="flex:1 1 auto;text-align:center;padding:11px 14px;border-radius:12px;background:var(--accent,#3b6cf6);color:#fff;font-weight:600;text-decoration:none">Về bài trước</a>' : "") +
        '<a href="' + esc(goc) + '" style="flex:1 1 auto;text-align:center;padding:11px 14px;border-radius:12px;border:1.5px solid currentColor;color:inherit;font-weight:600;text-decoration:none">Trang Các bài</a>' +
        '<button type="button" id="kb-doi" style="flex:1 1 100%;padding:9px;border:0;background:none;color:inherit;opacity:.75;text-decoration:underline;cursor:pointer;font:inherit">Không phải em? Đổi học sinh</button>' +
        "</div></div>";
      che.querySelector("#kb-doi").onclick = function () { try { localStorage.removeItem(HS_KEY); } catch (e) {} location.reload(); };
      var a = che.querySelector("a"); if (a) a.focus();
    }
    function kiem() {
      var h = hs();
      var id = h ? h.u : "";
      if (id === daXet) return;
      daXet = id;
      if (!h || laGV(h.c)) { bo(); return; }
      fetch(url + "?ma=" + encodeURIComponent(h.u) + "&tiendo=1").then(function (r) { return r.json(); }).then(function (o) {
        if (daXet !== id) return;
        if (!o || !o.ok) { bo(); return; }
        var x = xet(o, tab);
        if (x.mo) bo(); else hien(x);
      }).catch(function () { bo(); });
    }
    kiem();
    setInterval(kiem, 1500);   // học sinh vừa nhập mã trên trang thì xét lại
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  window.KB = { KHOA: KHOA, xet: xet, loiNhan: loiNhan, goiXong: goiXong, coKhoa: function (tab) { return !!KHOA[tab]; } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", trangBai); else trangBai();
})();
