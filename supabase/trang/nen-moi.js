/* Luyện toán THCS – nối trang bài với máy chủ của nền mới (Supabase, hàm "bai-lam").
 * Tệp này chỉ được gắn vào bản dựng cho Cloudflare (supabase/cong-cu/dung_trang_moi.py);
 * website cũ trên GitHub Pages không dùng.
 * Giữ nguyên giao diện của trang bài, chỉ thay:
 *   - đăng nhập bằng mã học sinh  → máy chủ kiểm tra mã, cấp phiên
 *   - dựng gói, dựng đề            → máy chủ phát đề (không kèm đáp án)
 *   - kiểm tra từng câu (luyện tập) → máy chủ kiểm tra
 *   - nộp bài, chấm điểm, gửi kết quả → máy chủ chấm và lưu; đáp án, lời giải chỉ nhận sau khi nộp
 */
(function () {
  "use strict";
  var API = "https://rhfjgaoyrdqglurfzbrw.supabase.co/functions/v1/bai-lam";
  var BAI = document.documentElement.getAttribute("data-bai");
  var KHOA_PHIEN = "luyentoan-phien";
  if (!BAI) return;

  function phien() { try { return localStorage.getItem(KHOA_PHIEN) || ""; } catch (e) { return ""; } }
  function luuPhien(p) { try { if (p) localStorage.setItem(KHOA_PHIEN, p); else localStorage.removeItem(KHOA_PHIEN); } catch (e) {} }
  function goi(viec, du_lieu) {
    var than = Object.assign({ viec: viec, phien: phien() }, du_lieu || {});
    return fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(than) })
      .then(function (r) { return r.json(); });
  }

  // ---------- Thông báo nhỏ ở đầu trang ----------
  var hop = null;
  function bao(thong_bao, loai) {
    if (!hop) {
      hop = document.createElement("div");
      hop.setAttribute("role", "status");
      hop.style.cssText = "position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:9999;max-width:92vw;padding:10px 16px;border-radius:12px;font:600 15px/1.4 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.18)";
      document.body.appendChild(hop);
    }
    if (!thong_bao) { hop.style.display = "none"; return; }
    hop.textContent = thong_bao;
    hop.style.display = "block";
    hop.style.background = loai === "loi" ? "#b3261e" : "#2F5BEA";
    hop.style.color = "#fff";
    if (loai === "loi") setTimeout(function () { if (hop.textContent === thong_bao) bao(""); }, 6000);
  }
  function xuLyLoi(r) {
    if (r && r.loi === "het_phien") { luuPhien(""); saveHS(null); state.view = "home"; render(); }
    bao((r && r.thong_bao) || "Chưa kết nối được máy chủ (có thể mất mạng). Em thử lại nhé.", "loi");
  }
  var dangGui = false;

  // ---------- Đăng nhập ----------
  var saveHSGoc = saveHS;
  saveHS = function (o) { if (!o) luuPhien(""); saveHSGoc(o); };
  recheckHS = function () {};
  checkHS = function () {
    var inp = document.getElementById("hsma"), err = document.getElementById("hserr"), btn = document.getElementById("hsgo");
    var u = inp.value.replace(/\D/g, "");
    if (u.length !== 6) { err.textContent = "Mã học sinh gồm đúng 6 chữ số. Hãy kiểm tra lại."; inp.focus(); return; }
    err.textContent = "Đang kiểm tra mã..."; btn.disabled = true;
    goi("dang_nhap", { ma: u }).then(function (r) {
      if (r && r.ok) { luuPhien(r.phien); saveHS({ u: u, n: r.hs.n, c: r.hs.c || "" }); render(); }
      else { btn.disabled = false; err.textContent = (r && r.thong_bao) || "Mã này không có trong danh sách."; inp.focus(); }
    }).catch(function () { btn.disabled = false; err.textContent = "Chưa kiểm tra được mã (có thể mất mạng). Hãy thử lại."; });
  };
  // Đã có mã trên máy nhưng chưa có phiên của nền mới → đăng nhập lại
  if (state.stu && !phien()) { saveHS(null); }

  // ---------- Nhận đề từ máy chủ ----------
  function napDe(de, luot) {
    var by = { mc: [], tf: [], sa: [] };
    de.cau.forEach(function (c) {
      var q = Object.assign({}, c);
      if (q.opts) q.opts = q.opts.map(function (o) { return { t: o.t }; });
      if (q.items) q.items = q.items.map(function (i) { return Object.assign({}, i); });
      if (q.type === "mc") q.ans = null;
      if (q.type === "sa") q.ans = [];
      by[q.type].push(q);
    });
    var list = [], idx = {};
    TYPES.forEach(function (t) { by[t].forEach(function (q, i) { list.push(q); idx[q.id] = i; }); });
    var units = null;
    if (de.units) {
      units = de.units.map(function (u) { return Object.assign({}, u, { qs: [] }); });
      list.forEach(function (q) { var m = /^p(\d+)_/.exec(q.id); if (m && units[+m[1]]) units[+m[1]].qs.push(q); });
      units.forEach(function (u) { u.qs.sort(function (a, b) { return (a.no || 0) - (b.no || 0); }); });
    }
    state.ans = {}; state.pr = {}; state.result = null; state.perm = {};
    by.mc.forEach(function (q) { state.perm[q.id] = q.opts.map(function (_, i) { return i; }); }); // máy chủ đã xáo sẵn
    state.t0 = Date.now(); state.elapsed = 0; state.timedOut = false; state.sentCode = "";
    S = { mode: de.mode, spec: de.spec, title: de.title, by: by, list: list, idx: idx, units: units, luot: luot };
  }
  function batDau(che_do, spec) {
    if (dangGui) return; dangGui = true;
    bao("Đang tải đề...");
    goi("bat_dau", { bai: BAI, che_do: che_do, spec: spec || null, ma_de: state.code || null }).then(function (r) {
      dangGui = false;
      if (!r || !r.ok) return xuLyLoi(r);
      bao("");
      napDe(r.de, r.luot);
      state.view = "quiz"; render();
    }).catch(function () { dangGui = false; xuLyLoi(null); });
  }
  startTest = function () { if (!GM.gate("test", null, state.code, startTest)) return; batDau("test"); };
  startQuick = function () { if (!GM.gate("quick", null, state.code, startQuick)) return; batDau("quick"); };
  startHard = function () { if (!GM.gate("hard", null, state.code, startHard)) return; batDau("hard"); };
  startPack = function (spec) {
    if (!GM.gate("practice", spec, "", function () { startPack(spec); })) return;
    if (spec.kind === "pisa") batDau("pisa"); else batDau("practice", spec);
  };

  // ---------- Đáp án, lời giải nhận từ máy chủ ----------
  function ghep(q, m) {
    if (!q || !m) return;
    q.exp = m.exp;
    if (q.type === "mc") { q.ans = m.dung; (m.loi || []).forEach(function (e, i) { if (q.opts[i]) q.opts[i].err = e || undefined; }); }
    else if (q.type === "tf") q.items.forEach(function (it, j) { it.v = m.dung[j]; it.exp = (m.exp_y || [])[j] || it.exp; });
    else { q.ans = m.ans; q.at = m.dung; }
  }

  // ---------- Luyện tập: kiểm tra từng câu trên máy chủ ----------
  practiceCheck = function (id) {
    var q = S.list.find(function (x) { return x.id === id; }); if (!q) return;
    var P = state.pr[id] || (state.pr[id] = { attempts: 0, done: false, tried: [] });
    if (P.done || P.busy) return;
    var a = state.ans[id];
    if (q.type === "mc" && a == null) return setFeed(id, "Hãy chọn một đáp án trước.", "info");
    if (q.type === "tf") { var arr = a || []; if (q.items.some(function (_, j) { return typeof arr[j] !== "boolean"; })) return setFeed(id, "Hãy chọn Đúng hoặc Sai cho tất cả các ý trước.", "info"); }
    if (q.type === "sa" && String(a || "").trim() === "") return setFeed(id, "Hãy nhập đáp án trước.", "info");
    P.busy = true; setFeed(id, "Đang kiểm tra...", "info");
    goi("kiem_tra", { luot: S.luot, cau: id, tra_loi: a }).then(function (r) {
      P.busy = false;
      if (!r || !r.ok) { setFeed(id, (r && r.thong_bao) || "Chưa kiểm tra được (có thể mất mạng). Hãy bấm Kiểm tra lần nữa.", "info"); if (r && r.loi === "het_phien") xuLyLoi(r); return; }
      var oks = r.oks, all = oks.every(Boolean);
      P.attempts = r.lan;
      if (r.lan === 1) { P.first = oks; P.firstAns = JSON.parse(JSON.stringify(a)); }
      if (r.mo) ghep(q, r.mo);
      if (all) { P.done = true; P.final = true; P.cls = "ok"; P.msg = P.attempts === 1 ? "Đúng rồi!" : "Đúng ở lần thử thứ hai."; }
      else if (!r.mo) {
        P.cls = "bad";
        if (q.type === "mc") { P.tried.push(a); delete state.ans[id]; P.msg = "Chưa đúng." + (r.loi_chon ? " " + r.loi_chon : "") + " Hãy chọn lại một đáp án khác."; }
        else if (q.type === "tf") { var k = oks.filter(Boolean).length; P.msg = "Mới đúng " + k + "/" + q.items.length + " ý. Hãy xem lại các ý và thử một lần nữa."; }
        else P.msg = "Đáp án chưa đúng. Hãy kiểm tra lại cách tính và thử một lần nữa.";
      } else { P.done = true; P.final = false; P.cls = "bad"; P.msg = "Chưa đúng. Đáp án và lời giải ở bên dưới."; }
      var g = null;
      if (P.done) { g = GM.onPractice(!!P.final, P.attempts, q.level || (q.items && q.items[0] && q.items[0].level) || "TH"); if (g && g.xp) P.msg += " +" + g.xp + " XP"; }
      var el = document.getElementById("q-" + id);
      el.outerHTML = CARD[q.type](q, S.idx[id]);
      updateProgress();
      GM.fx(g, document.getElementById("q-" + id));
    }).catch(function () { P.busy = false; setFeed(id, "Chưa kiểm tra được (có thể mất mạng). Hãy bấm Kiểm tra lần nữa.", "info"); });
  };

  // ---------- Nộp bài: máy chủ chấm và lưu ----------
  var finishGoc = finish;
  finish = function (force) {
    var test = S.mode !== "practice";
    var left = test ? totalItems() - answered() : S.list.length - doneCount();
    if (left > 0 && !force) return finishGoc(false);       // hiện cảnh báo "còn … chưa trả lời" như cũ
    if (dangGui) return; dangGui = true;
    stopTimer();
    state.elapsed = Math.floor((Date.now() - state.t0) / 1000);
    if (test) state.elapsed = Math.min(state.elapsed, LIMIT[S.mode]);
    bao("Đang nộp bài...");
    var gui = function (lan) {
      goi("nop", { luot: S.luot, tra_loi: test ? state.ans : undefined }).then(function (r) {
        dangGui = false;
        if (!r || !r.ok) return xuLyLoi(r);
        bao("");
        Object.keys(r.mo || {}).forEach(function (id) { ghep(S.list.find(function (x) { return x.id === id; }), r.mo[id]); });
        state.result = grade();
        state.result.total = r.ket_qua.total;               // điểm do máy chủ chấm
        updateWeak(state.result);
        state.gm = GM.onFinish(state.result, S.mode);
        state.sentCode = makeCode(state.result);
        state.view = "result"; render();
      }).catch(function () {
        if (lan < 3) return setTimeout(function () { gui(lan + 1); }, 2000 * lan);
        dangGui = false;
        bao("Chưa nộp được bài (có thể mất mạng). Bài làm vẫn còn, em bấm Nộp bài lần nữa nhé.", "loi");
        startTimer();
      });
    };
    gui(1);
  };
  // Kết quả đã lưu trên máy chủ ngay khi nộp, không gửi sang Google Sheet nữa
  sendResult = function () { if (state.result) state.sentCode = makeCode(state.result); setSent("Đã lưu kết quả cho giáo viên."); };

  // Nhãn nhỏ cho biết đang dùng bản thử của nền mới
  var nhan = document.createElement("div");
  nhan.textContent = "Bản thử nền mới";
  nhan.style.cssText = "position:fixed;right:10px;bottom:10px;z-index:9998;padding:4px 10px;border-radius:999px;background:#FFF2CC;color:#5c4400;font:600 12px system-ui,sans-serif;opacity:.9";
  document.body.appendChild(nhan);

  if (state.view === "home") render();
})();
