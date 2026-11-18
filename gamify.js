/* Lớp trò chơi hóa dùng chung cho các trang luyện toán: XP, cấp độ, chuỗi ngày học, mục tiêu ngày, huy hiệu.
   Dữ liệu lưu trong localStorage của trình duyệt, theo mã học sinh, dùng chung cho mọi bài trên cùng địa chỉ web.
   Không ảnh hưởng đến việc chấm bài hay kết quả gửi cho giáo viên. */
(function () {
  "use strict";
  var GOAL = 5;                       // số câu đúng mỗi ngày
  var LV = ["Học trò mới", "Thám tử số", "Thợ giải toán", "Cao thủ", "Chiến binh", "Chuyên gia", "Bậc thầy", "Huyền thoại"];
  var BASE = { NB: 10, TH: 15, VD: 25 };
  /* Giới hạn để học sinh không dùng máy quá nhiều:
     - mỗi gói (bài học + loại gói) làm tối đa 3 lần, lần 2 được 80% XP, lần 3 được 50% XP; sau lần 3 gói nghỉ 5 tiếng
       (có mã đề của thầy cô thì không bị khóa nhưng vẫn tính lượt, quá 3 lần không cộng XP);
     - mỗi ngày quá 120 phút dùng trang hoặc quá 8 gói thì nhắc nghỉ và không cộng XP nữa (vẫn được làm bài).
     Không ảnh hưởng điểm kiểm tra gửi giáo viên. Mã giáo viên (lớp GV) không bị giới hạn. */
  var LIM = { perPack: 3, mult: [1, 0.8, 0.5], cool: 5 * 3600000, dayMin: 120, dayPacks: 8, idle: 120000, tick: 15000 };
  var BXH = "";                       // địa chỉ bảng xếp hạng lớp ở trang Các bài (cùng thư mục gốc với gamify.js)
  try { BXH = new URL("cac-bai/#bxh", document.currentScript.src).href; } catch (e) {}
  var reduce = false;
  try { reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  function lvOf(xp) { return Math.floor(Math.sqrt(xp / 40)) + 1; }
  function xpAt(l) { return 40 * (l - 1) * (l - 1); }
  function title(l) { return LV[Math.min(l, LV.length) - 1]; }

  var BADGES = [
    { id: "first", g: "★", n: "Khởi đầu", d: "Trả lời đúng câu đầu tiên" },
    { id: "combo5", g: "⚡", n: "Chính xác", d: "5 câu đúng liên tiếp ngay lần đầu" },
    { id: "combo10", g: "✦", n: "Không thể cản", d: "10 câu đúng liên tiếp ngay lần đầu" },
    { id: "retry", g: "↺", n: "Không bỏ cuộc", d: "Sửa lại và làm đúng ở lần thử thứ hai, 5 lần" },
    { id: "goal", g: "◎", n: "Đủ mục tiêu", d: "Hoàn thành mục tiêu của một ngày" },
    { id: "streak3", g: "3", n: "Chăm chỉ", d: "Học 3 ngày liên tiếp" },
    { id: "streak7", g: "7", n: "Bền bỉ", d: "Học 7 ngày liên tiếp" },
    { id: "perfect", g: "△", n: "Trọn vẹn", d: "Gói luyện tập từ 8 câu trở lên, đúng hết ngay lần đầu" },
    { id: "test8", g: "8", n: "Vững vàng", d: "Bài kiểm tra từ 8 điểm" },
    { id: "test10", g: "10", n: "Điểm mười", d: "Bài kiểm tra từ 9,5 điểm" },
    { id: "hard", g: "▲", n: "Thử thách", d: "Hoàn thành một bài Thử thách" },
    { id: "xp500", g: "500", n: "Năm trăm XP", d: "Đạt 500 XP" }
  ];

  function ymd(d) { d = d || new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function yest() { var d = new Date(); d.setDate(d.getDate() - 1); return ymd(d); }

  var mem = {};
  function key() { var u = GM.user ? GM.user() : ""; return "gm1:" + (u || "local"); }
  function load() {
    var k = key(), o = null;
    try { o = JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { o = mem[k] || null; }
    if (!o) o = { xp: 0, streak: 0, last: "", day: "", dayCorrect: 0, goalDay: "", badges: {}, stats: { retry: 0, bestCombo: 0 }, sx: 0, pend: null };
    o.sx = o.sx || 0;
    o.badges = o.badges || {}; o.stats = o.stats || { retry: 0, bestCombo: 0 };
    return o;
  }
  function saveLocal(o) {
    var k = key(); mem[k] = o;
    try { localStorage.setItem(k, JSON.stringify(o)); } catch (e) {}
  }
  function save(o) { saveLocal(o); schedule(2500); }

  /* ---- Đồng bộ với Google Sheet (nếu trang đặt GM.sheet): đổi máy vẫn giữ XP, chuỗi ngày, huy hiệu ---- */
  var timer = null, busy = false, tried = {};
  function schedule(ms) {
    if (!GM.sheet || !GM.user || !GM.user()) return;
    clearTimeout(timer); timer = setTimeout(function () { timer = null; push(false); }, ms);
  }
  function meta(o) { return { streak: o.streak, last: o.last, day: o.day, dayCorrect: o.dayCorrect, goalDay: o.goalDay, badges: o.badges, stats: o.stats }; }
  function mergeMeta(a, b) {   // cùng quy tắc với gopThuong trong Code.gs
    var r = {}, n = function (x) { return Number(x) || 0; };
    if ((a.last || "") > (b.last || "") || ((a.last || "") === (b.last || "") && n(a.streak) >= n(b.streak))) { r.last = a.last || ""; r.streak = n(a.streak); } else { r.last = b.last || ""; r.streak = n(b.streak); }
    if ((a.day || "") > (b.day || "") || ((a.day || "") === (b.day || "") && n(a.dayCorrect) >= n(b.dayCorrect))) { r.day = a.day || ""; r.dayCorrect = n(a.dayCorrect); } else { r.day = b.day || ""; r.dayCorrect = n(b.dayCorrect); }
    r.goalDay = (a.goalDay || "") > (b.goalDay || "") ? a.goalDay || "" : b.goalDay || "";
    r.badges = {};
    [a.badges, b.badges].forEach(function (bd) { for (var id in (bd || {})) if (!r.badges[id] || bd[id] < r.badges[id]) r.badges[id] = bd[id]; });
    r.stats = { retry: Math.max(n((a.stats || {}).retry), n((b.stats || {}).retry)), bestCombo: Math.max(n((a.stats || {}).bestCombo), n((b.stats || {}).bestCombo)) };
    return r;
  }
  function push(leaving) {
    var u = GM.user && GM.user();
    if (!GM.sheet || !u || busy) return;
    var k = key(), o = load();
    if (!o.pend) { o.pend = { pid: Math.random().toString(36).slice(2) + Date.now().toString(36), dx: Math.max(0, o.xp - o.sx) }; saveLocal(o); }
    var body = { gm: 1, u: u, dx: o.pend.dx, pid: o.pend.pid, g: meta(o) };
    busy = true; tried[u] = Date.now();
    var fail = function () { busy = false; if (!leaving) schedule(30000); };
    fetch(GM.sheet, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body), keepalive: !!leaving })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        busy = false;
        if (!res || !res.ok || !res.g) { if (res && res.ok === false && !res.err) return; fail(); return; }   // mã không có trong danh sách: bỏ qua
        if (key() !== k) return;                                   // đã đổi học sinh trong lúc chờ
        var o2 = load(), g = res.g, m = mergeMeta(o2, g);
        var unsent = Math.max(0, o2.xp - o2.sx - (o2.pend ? o2.pend.dx : 0));
        o2.xp = (Number(g.xp) || 0) + unsent; o2.sx = Number(g.xp) || 0; o2.pend = null;
        o2.streak = m.streak; o2.last = m.last; o2.day = m.day; o2.dayCorrect = m.dayCorrect; o2.goalDay = m.goalDay; o2.badges = m.badges; o2.stats = m.stats;
        saveLocal(o2);
        GM.rebar();
        if (unsent) schedule(2500);
      })
      .catch(fail);
  }
  function touch(o) {          // ghi nhận có học hôm nay, cập nhật chuỗi ngày
    var t = ymd();
    if (o.last === t) return;
    o.streak = o.last === yest() ? (o.streak || 0) + 1 : 1;
    o.last = t;
  }
  function effStreak(o) { return o.last === ymd() || o.last === yest() ? o.streak || 0 : 0; }
  function earn(o, id, out) { if (!o.badges[id]) { o.badges[id] = ymd(); out.push(id); } }
  function bname(id) { for (var i = 0; i < BADGES.length; i++) if (BADGES[i].id === id) return BADGES[i].n; return id; }
  function afterXp(o, out) {
    if (o.xp >= 500) earn(o, "xp500", out);
    var s = effStreak(o);
    if (s >= 3) earn(o, "streak3", out);
    if (s >= 7) earn(o, "streak7", out);
  }
  /* ---- Giới hạn lượt và thời gian ---- */
  var cur = null;              // gói đang làm: {n: lần thứ mấy, mult: hệ số XP, free: đã quá giới hạn ngày}
  var pass = false, lastAct = Date.now();
  function isGV() { try { var h = JSON.parse(localStorage.getItem("luyentoan-hs") || "null"); return !!h && /^\s*gv\s*$/i.test(String(h.c || "")); } catch (e) { return false; } }
  function dayRoll(o) { if (!o.lim || o.lim.day !== ymd()) o.lim = { day: ymd(), sec: 0, packs: 0, warned: 0 }; return o.lim; }
  function timeOver(o) { return dayRoll(o).sec >= LIM.dayMin * 60; }
  function dayOver(o) { var l = dayRoll(o); return l.sec >= LIM.dayMin * 60 || l.packs >= LIM.dayPacks; }
  function hm(t) { var d = new Date(t); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + (ymd(d) !== ymd() ? " ngày mai" : ""); }
  function packKey(mode, spec) {
    var path = location.pathname.replace(/index\.html?$/, "");
    var sp = mode === "practice" && spec ? "|" + (spec.kind === "weak" ? "weak" : spec.kind + ":" + (spec.val == null ? "" : spec.val)) : "";
    return path + "|" + mode + sp;
  }
  function packState(o, k, now) {
    o.pk = o.pk || {};
    for (var x in o.pk) { var q = o.pk[x]; if (q.until ? now >= q.until : now - q.t >= LIM.cool) delete o.pk[x]; }   // hết 5 tiếng thì tính lại từ đầu
    return o.pk[k] || null;
  }
  function mult(o) { return !cur ? 1 : cur.free || timeOver(o) ? 0 : cur.mult; }   // hệ số XP lúc này
  function limitNote() {
    if (!cur) return "";
    if (cur.free) return "Không cộng XP vì hôm nay em đã học đủ " + LIM.dayMin + " phút hoặc " + LIM.dayPacks + " gói.";
    if (cur.n > LIM.perPack) return "Không cộng XP vì gói này đã làm quá " + LIM.perPack + " lần.";
    if (cur.mult < 1) return "Lần " + cur.n + " của gói này: XP được tính " + Math.round(cur.mult * 100) + "%.";
    return "";
  }

  function result(o, before, gained, out, extra) {
    var l0 = lvOf(before), l1 = lvOf(o.xp);
    var r = { xp: gained, level: l1, levelUp: l1 > l0, badges: out.map(bname), streak: effStreak(o), combo: GM.combo, note: limitNote() };
    if (extra) for (var k in extra) r[k] = extra[k];
    return r;
  }

  var GM = {
    user: null, combo: 0,

    /* Một câu luyện tập được kiểm tra xong (đúng hoặc hết lượt thử). */
    onPractice: function (ok, attempts, level) {
      var o = load(), before = o.xp, out = [], gained = 0, bonus = 0;
      touch(o);
      if (o.day !== ymd()) { o.day = ymd(); o.dayCorrect = 0; }
      if (ok) {
        var base = BASE[level] || 15;
        gained = attempts === 1 ? base : Math.round(base / 2);
        if (attempts === 1) { GM.combo++; } else { GM.combo = 0; o.stats.retry++; if (o.stats.retry >= 5) earn(o, "retry", out); }
        if (GM.combo > o.stats.bestCombo) o.stats.bestCombo = GM.combo;
        if (GM.combo >= 5) earn(o, "combo5", out);
        if (GM.combo >= 10) earn(o, "combo10", out);
        earn(o, "first", out);
        o.dayCorrect++;
        if (o.dayCorrect >= GOAL && o.goalDay !== ymd()) { o.goalDay = ymd(); bonus = 20; earn(o, "goal", out); }
      } else { GM.combo = 0; }
      var m = mult(o);
      gained = Math.round(gained * m); bonus = m ? bonus : 0;
      o.xp += gained + bonus;
      afterXp(o, out);
      save(o);
      return result(o, before, gained + bonus, out, { ok: ok, bonus: bonus });
    },

    /* Nộp bài kiểm tra hoặc xem kết quả gói luyện tập. */
    onFinish: function (r, mode) {
      var o = load(), before = o.xp, out = [], gained = 0;
      touch(o);
      if (mode === "practice") {
        var n = r.items.length, c = r.items.filter(function (i) { return i.ok; }).length;
        if (n) { gained = 10; if (c === n && n >= 8) earn(o, "perfect", out); }
      } else {
        var sc = r.total || 0;
        gained = 20 + Math.round(sc * 10);
        if (mode === "quick") gained = Math.round(gained / 2);            // kiểm tra nhanh 5 phút: một nửa
        if (mode === "hard") { gained = Math.round(gained * 1.5); earn(o, "hard", out); }
        if (sc >= 8) earn(o, "test8", out);
        if (sc >= 9.5) earn(o, "test10", out);
      }
      gained = Math.round(gained * mult(o));
      o.xp += gained;
      afterXp(o, out);
      save(o);
      var res = result(o, before, gained, out, { mode: mode });
      cur = null;
      return res;
    },

    /* Gọi khi bắt đầu một gói. Trả về true nếu được làm ngay; false nếu đang hiện thông báo
       (khi học sinh chọn "Vẫn làm tiếp", hàm cont được gọi lại và lần này được qua). */
    gate: function (mode, spec, code, cont) {
      var o = load(), now = Date.now();
      dayRoll(o);
      if (isGV()) { cur = null; return true; }
      var k = packKey(mode, spec), p = packState(o, k, now), n = p ? p.n : 0;
      if (n >= LIM.perPack && !code) {
        saveLocal(o); pass = false;
        dialog("Gói này đang nghỉ", "Em đã làm gói này " + LIM.perPack + " lần. Hãy nghỉ ngơi, gói sẽ mở lại lúc <b>" + hm(p.until) + "</b>. Em vẫn có thể chọn gói khác.", [["Đã hiểu", null]]);
        return false;
      }
      var over = dayOver(o);
      if (over && !pass) {
        saveLocal(o);
        dialog("Nghỉ ngơi một chút nhé!", "Hôm nay em đã học <b>" + Math.floor(o.lim.sec / 60) + " phút</b> và <b>" + o.lim.packs + " gói</b>. Hãy cho mắt nghỉ ngơi. Nếu làm tiếp, em vẫn được chấm bài nhưng <b>không cộng XP</b> nữa trong hôm nay.",
          [["Nghỉ ngơi", null], ["Vẫn làm tiếp", function () { pass = true; cont && cont(); }]]);
        return false;
      }
      pass = false;
      n++;
      o.pk[k] = { n: n, t: now, until: n >= LIM.perPack ? now + LIM.cool : 0 };
      o.lim.packs++;
      cur = { n: n, mult: n <= LIM.perPack ? LIM.mult[n - 1] : 0, free: over };
      saveLocal(o);
      if (!over && n > 1) toast([n <= LIM.perPack ? "Lần " + n + " của gói này: XP ×" + Math.round(cur.mult * 100) + "%" + (n === LIM.perPack ? ". Sau lần này gói nghỉ 5 tiếng." : "") : "Gói này đã quá " + LIM.perPack + " lần: không cộng XP"]);
      return true;
    },

    /* Thẻ trạng thái ở trang đầu. */
    barHTML: function () {
      var o = load(), l = lvOf(o.xp), a = xpAt(l), b = xpAt(l + 1), p = Math.round(100 * (o.xp - a) / (b - a));
      var dc = o.day === ymd() ? o.dayCorrect : 0, gp = Math.min(100, Math.round(100 * dc / GOAL));
      var s = effStreak(o), badges = BADGES.map(function (x) {
        var got = !!o.badges[x.id];
        return '<li class="gm-b' + (got ? " on" : "") + '" title="' + x.n + ": " + x.d + (got ? "" : " (chưa đạt)") + '"><span class="gm-g" aria-hidden="true">' + x.g + '</span><span class="gm-bn">' + x.n + "</span></li>";
      }).join("");
      var nb = Object.keys(o.badges).length, lim = dayRoll(o), mins = Math.floor(lim.sec / 60), ov = dayOver(o);
      return '<section class="card gm-bar" aria-label="Tiến độ của bạn">' +
        '<div class="gm-top"><div class="gm-lv"><span class="gm-lvn">' + l + '</span><span><b>Cấp ' + l + "</b><br><small>" + title(l) + "</small></span></div>" +
        '<div class="gm-st" title="Số ngày học liên tiếp"><b>' + s + "</b><small>ngày liên tiếp</small></div>" +
        '<div class="gm-st" title="Tổng điểm kinh nghiệm"><b>' + o.xp + "</b><small>XP</small></div></div>" +
        '<div class="gm-row"><span class="gm-lab">Lên cấp ' + (l + 1) + '</span><div class="gm-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p + '"><i style="width:' + p + '%"></i></div><small>' + (o.xp - a) + " / " + (b - a) + " XP</small></div>" +
        '<div class="gm-row"><span class="gm-lab">Hôm nay</span><div class="gm-track goal" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + gp + '"><i style="width:' + gp + '%"></i></div><small>' + Math.min(dc, GOAL) + " / " + GOAL + " câu đúng" + (dc >= GOAL ? " ✓" : "") + "</small></div>" +
        '<p class="gm-lim' + (ov ? " over" : "") + '">Hôm nay đã học <b>' + mins + "/" + LIM.dayMin + " phút</b> · <b>" + lim.packs + "/" + LIM.dayPacks + " gói</b>" + (ov ? " · đủ rồi, nghỉ ngơi nhé! (không cộng XP)" : "") + "</p>" +
        '<details class="gm-det"><summary>Huy hiệu (' + nb + " / " + BADGES.length + ')</summary><ul class="gm-badges">' + badges + "</ul></details>" +
        (BXH && GM.sheet && GM.user && GM.user() ? '<a class="gm-bxh" href="' + BXH + '">Xem bảng xếp hạng lớp và khối →</a>' : "") + "</section>";
    },

    /* Khung thưởng ở trang kết quả. */
    resultHTML: function (g) {
      if (!g) return "";
      var l = g.level;
      var extra = (g.levelUp ? '<p class="gm-up">Lên cấp ' + l + ": " + title(l) + "!</p>" : "") +
        (g.badges.length ? '<p class="gm-new">Huy hiệu mới: ' + g.badges.map(function (n) { return "<b>" + n + "</b>"; }).join(", ") + "</p>" : "") +
        (g.streak > 1 ? '<p class="gm-new">Chuỗi học: <b>' + g.streak + " ngày</b> liên tiếp.</p>" : "") +
        (g.note ? '<p class="gm-note">' + g.note + "</p>" : "");
      return '<section class="card gm-res" role="status"><div class="gm-gain">+' + g.xp + ' <small>XP</small></div><div>' + (extra || '<p class="gm-new">Cố lên, mỗi câu đúng là một bước tiến.</p>') + "</div></section>";
    },

    /* Hiệu ứng và thông báo nhỏ sau mỗi câu. */
    fx: function (g, el) {
      if (!g) return;
      GM.refresh();
      var msgs = [];
      if (g.levelUp) msgs.push("Lên cấp " + g.level + ": " + title(g.level) + "!");
      g.badges.forEach(function (n) { msgs.push("Huy hiệu mới: " + n); });
      if (g.bonus) msgs.push("Đủ mục tiêu hôm nay! +" + g.bonus + " XP");
      if (g.ok && g.combo >= 3) msgs.push("Chuỗi đúng ×" + g.combo);
      toast(msgs);
      if (g.ok && !reduce) burst(el, g.levelUp || g.badges.length ? 26 : 12);
    },

    sheet: "",
    /* Gọi khi vào trang: lấy dữ liệu của học sinh từ Google Sheet (mỗi lần mở trang một lần, thử lại sau 30 giây nếu lỗi). */
    sync: function () {
      var u = GM.user && GM.user();
      if (!GM.sheet || !u || busy || Date.now() - (tried[u] || 0) < 30000) return;
      push(false);
    },
    rebar: function () {
      var b = document.querySelector(".gm-bar");
      if (b) { var d = b.querySelector("details"), open = d && d.open; b.outerHTML = GM.barHTML(); if (open) { var d2 = document.querySelector(".gm-bar details"); if (d2) d2.open = true; } }
      GM.refresh();
    },

    /* Thanh nhỏ cố định ở góc màn hình. */
    refresh: function () {
      var h = document.getElementById("gm-hud");
      if (!h) { h = document.createElement("div"); h.id = "gm-hud"; h.setAttribute("aria-hidden", "true"); document.body.appendChild(h); }
      if (location.hash === "#giao-vien") { h.hidden = true; return; }
      var o = load(), l = lvOf(o.xp);
      h.hidden = false;
      h.innerHTML = "<b>Cấp " + l + "</b> · " + o.xp + " XP" + (effStreak(o) ? " · " + effStreak(o) + " ngày" : "");
    }
  };

  function dialog(title, html, btns) {
    var old = document.getElementById("gm-dlg"); if (old) old.parentNode.removeChild(old);
    var back = document.createElement("div"); back.id = "gm-dlg";
    back.innerHTML = '<div class="gm-dlg" role="dialog" aria-modal="true" aria-labelledby="gm-dlg-t"><h3 id="gm-dlg-t">' + title + "</h3><p>" + html + '</p><div class="gm-dlg-b"></div></div>';
    var box = back.querySelector(".gm-dlg-b"), prev = document.activeElement;
    function close() { if (back.parentNode) back.parentNode.removeChild(back); document.removeEventListener("keydown", esc); try { prev && prev.focus(); } catch (e) {} }
    function esc(e) { if (e.key === "Escape") close(); }
    btns.forEach(function (b, i) {
      var bt = document.createElement("button"); bt.type = "button"; bt.textContent = b[0]; bt.className = i ? "gm-ghost" : "";
      bt.onclick = function () { close(); if (b[1]) b[1](); }; box.appendChild(bt);
    });
    document.addEventListener("keydown", esc);
    document.body.appendChild(back); box.firstChild.focus();
  }
  // Đếm thời gian dùng trang: chỉ khi trang đang hiện và có thao tác trong 2 phút gần nhất
  ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (ev) { window.addEventListener(ev, function () { lastAct = Date.now(); }, { passive: true, capture: true }); });
  setInterval(function () {
    if (document.visibilityState !== "visible" || Date.now() - lastAct > LIM.idle || isGV()) return;
    var o = load(), l = dayRoll(o), was = l.sec >= LIM.dayMin * 60;
    l.sec += LIM.tick / 1000;
    if (!was && l.sec >= LIM.dayMin * 60 && !l.warned) {
      l.warned = 1;
      dialog("Đã " + LIM.dayMin + " phút rồi!", "Hôm nay em đã học đủ <b>" + LIM.dayMin + " phút</b>. Hãy nghỉ ngơi, vận động một chút nhé. Từ giờ đến hết ngày, làm bài vẫn được chấm nhưng <b>không cộng XP</b>.", [["Đã hiểu", null]]);
    }
    saveLocal(o);
    if (Math.floor(l.sec) % 60 === 0) GM.rebar && document.querySelector(".gm-bar") && !document.querySelector(".gm-bar details[open]") && GM.rebar();
  }, LIM.tick);

  function toast(list) {
    if (!list.length) return;
    var t = document.getElementById("gm-toast");
    if (!t) { t = document.createElement("div"); t.id = "gm-toast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite"); document.body.appendChild(t); }
    var i = 0;
    (function next() {
      if (i >= list.length) { t.className = ""; return; }
      t.textContent = list[i++]; t.className = "show";
      setTimeout(function () { t.className = ""; setTimeout(next, 250); }, 1900);
    })();
  }
  function burst(el, n) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    var box = document.createElement("div"); box.className = "gm-fx";
    box.style.left = (r.left + r.width / 2) + "px"; box.style.top = Math.max(80, Math.min(r.top + 60, window.innerHeight - 80)) + "px";
    var col = ["#1f4fd8", "#17a05d", "#f0a30a", "#d9342b", "#8a5cf6"];
    for (var i = 0; i < n; i++) {
      var s = document.createElement("i"), a = Math.random() * 6.283, d = 40 + Math.random() * 90;
      s.style.setProperty("--x", Math.cos(a) * d + "px"); s.style.setProperty("--y", Math.sin(a) * d - 30 + "px");
      s.style.setProperty("--r", Math.round(Math.random() * 540 - 270) + "deg");
      s.style.background = col[i % col.length]; box.appendChild(s);
    }
    document.body.appendChild(box); setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 1100);
  }

  var css = ".gm-bar{margin-top:16px}.gm-top{display:flex;align-items:center;gap:18px;flex-wrap:wrap}" +
    ".gm-lv{display:flex;align-items:center;gap:12px;margin-right:auto;line-height:1.25}.gm-lv small{color:var(--muted)}" +
    ".gm-lvn{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--accent);color:var(--accent-ink);font:700 1.25rem var(--display,serif)}" +
    ".gm-st{text-align:center;line-height:1.2}.gm-st b{display:block;font-size:1.3rem}.gm-st small{color:var(--muted);font-size:.74rem}" +
    ".gm-row{display:flex;align-items:center;gap:10px;margin-top:12px;font-size:.86rem}.gm-lab{min-width:84px;white-space:nowrap;color:var(--muted);flex:none}.gm-row small{color:var(--muted);white-space:nowrap;min-width:92px;text-align:right}" +
    ".gm-track{flex:1;height:10px;border-radius:99px;background:var(--tri,#eaf0fc);border:1px solid var(--line);overflow:hidden}.gm-track i{display:block;height:100%;background:var(--accent);border-radius:99px;transition:width .5s}.gm-track.goal i{background:var(--good)}" +
    ".gm-det{margin-top:14px}.gm-det summary{cursor:pointer;font-weight:600;font-size:.9rem}.gm-badges{list-style:none;margin:12px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:10px}" +
    ".gm-b{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;font-size:.74rem;color:var(--muted);opacity:.55;filter:grayscale(1)}.gm-b.on{opacity:1;filter:none;color:var(--ink)}" +
    ".gm-g{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;border:2px solid var(--line);font-weight:700;background:var(--card)}.gm-b.on .gm-g{border-color:var(--warn);background:var(--warn-bg);color:var(--warn)}" +
    ".gm-bxh{display:inline-block;margin-top:12px;font-weight:600;font-size:.9rem;color:var(--accent)}" +
    ".gm-lim{margin:12px 0 0;font-size:.86rem;color:var(--muted)}.gm-lim b{color:var(--ink)}.gm-lim.over{color:var(--warn)}.gm-note{font-size:.88rem;color:var(--muted)}" +
    "#gm-dlg{position:fixed;inset:0;z-index:50;background:rgba(10,18,40,.55);display:grid;place-items:center;padding:16px}" +
    ".gm-dlg{max-width:420px;width:100%;background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:14px;padding:20px 22px;box-shadow:0 10px 40px rgba(0,0,0,.3)}.gm-dlg h3{margin:0 0 8px;font-size:1.25rem}.gm-dlg p{margin:0;line-height:1.55}" +
    ".gm-dlg-b{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.gm-dlg-b button{font:inherit;font-weight:600;min-height:44px;padding:0 18px;border-radius:10px;border:1.5px solid var(--accent);background:var(--accent);color:var(--card);cursor:pointer}.gm-dlg-b button.gm-ghost{background:transparent;color:var(--accent)}" +
    ".gm-res{margin-top:16px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;border-color:var(--warn)}.gm-gain{font:700 2rem var(--display,serif);color:var(--warn)}.gm-gain small{font-size:.9rem}.gm-res p{margin:2px 0}.gm-up{font-weight:700;color:var(--good)}" +
    "#gm-hud{position:fixed;left:12px;bottom:12px;z-index:30;padding:6px 12px;border-radius:99px;background:var(--card);border:1px solid var(--line);font-size:.8rem;box-shadow:0 2px 8px rgba(0,0,0,.12);pointer-events:none}" +
    "#gm-toast{position:fixed;left:50%;top:18px;transform:translate(-50%,-80px);z-index:40;padding:10px 18px;border-radius:12px;background:var(--ink);color:var(--paper);font-weight:600;font-size:.92rem;opacity:0;transition:transform .3s,opacity .3s;pointer-events:none;max-width:90vw;text-align:center}#gm-toast.show{transform:translate(-50%,0);opacity:1}" +
    ".gm-fx{position:fixed;z-index:35;width:0;height:0;pointer-events:none}.gm-fx i{position:absolute;width:8px;height:12px;border-radius:2px;animation:gmp 1s ease-out forwards}" +
    "@keyframes gmp{from{transform:translate(0,0) rotate(0);opacity:1}to{transform:translate(var(--x),calc(var(--y) + 70px)) rotate(var(--r));opacity:0}}" +
    "@media (prefers-reduced-motion:reduce){.gm-track i,#gm-toast{transition:none}}" +
    "@media (max-width:520px){.gm-lab{min-width:0}.gm-row small{min-width:72px}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  window.addEventListener("pagehide", function () { if (timer) { clearTimeout(timer); timer = null; push(true); } });
  window.GM = GM;
})();
