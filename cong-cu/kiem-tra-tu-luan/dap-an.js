/* In ra JSON đáp số (đã chuyển phân số thành [tử/mẫu], luỹ thừa thành ^) của các tệp tu-luan-de.js.
   Dùng: node dap-an.js <thư mục bài> ... */
const path = require("path");
global.truc = () => "";
const norm = s => String(s).replace(/<span class="fr"><span>([\s\S]*?)<\/span><span>([\s\S]*?)<\/span><\/span>/g, "[$1/$2]").replace(/<sup>([\s\S]*?)<\/sup>/g, "^$1").replace(/<br>/g, " | ");
const out = {};
for (const d of process.argv.slice(2)) {
  global.window = {};
  const f = path.resolve(__dirname, "../..", d, "tu-luan-de.js");
  delete require.cache[f]; require(f);
  const T = window.TL_DATA, o = out[d] = {};
  for (const q of T.items) o[q.id] = norm(q.dap) + " || " + norm((q.steps || []).join(" "));
  (T.dang || []).forEach((g, k) => (g.tl || []).forEach((t, j) => { o["tl" + k + "-" + j] = norm(t[2]); }));
  Object.entries(T.tlMuc || {}).forEach(([k, a]) => a.forEach((t, j) => { o["tl" + k + "-" + j] = norm(t[2]); }));
}
console.log(JSON.stringify(out));
