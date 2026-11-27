/* Xuất tệp Word "Bài tập tự luận" của một bài (thầy dặn 27/11/2026).
   Cách chạy: node cong-cu/xuat-tu-luan/xuat-tu-luan.js <thư mục bài> "<tên tệp ra .docx>" "<tiêu đề>" "<phụ đề>"
   Nội dung theo đúng cách chia trên website:
   - Bài chia theo dạng: mỗi dạng có Phương pháp giải; mỗi bài: nhãn mức độ, đề, hình, gợi ý, sơ đồ phân tích ngược (từng câu,
     ghi bước lời giải tương ứng), lời giải từng bước, đáp số, lỗi hay gặp; cuối dạng có Bài tập tự luyện (gợi ý, đáp số).
   - Bài chia theo mức: các mức Nhận biết, Thông hiểu, Vận dụng.
   - Dành cho HSG: giải theo 4 bước (Tìm hiểu đề bài; Xây dựng chương trình giải; Thực hiện chương trình giải; Kiểm tra và nghiên cứu lời giải). */
const fs = require('fs'), path = require('path'), os = require('os');
const { chromium } = require('playwright');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Footer, PageNumber, ImageRun } = D;
const [, , lesson, out, title, sub] = process.argv;
if (!out) { console.log('Cách chạy: node xuat-tu-luan.js <thư mục bài> <ra.docx> <tiêu đề> <phụ đề>'); process.exit(1); }
const REPO = path.resolve(__dirname, '..', '..'), FONT = 'Times New Roman';

const dec = s => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
// Tử hoặc mẫu của phân số: giữ luỹ thừa (<sup>) thành số mũ trong công thức Word.
function mathRuns(t) {
  const clean = x => dec(String(x).replace(/<\/?[a-zA-Z][^<>]*>/g, ''));
  const o = [], re = /(\([^()]*\)|[^\s·+−:()]+)<sup>([\s\S]*?)<\/sup>/g; let i = 0, m;
  while ((m = re.exec(t))) {
    if (m.index > i) o.push(new D.MathRun(clean(t.slice(i, m.index))));
    o.push(new D.MathSuperScript({ children: [new D.MathRun(clean(m[1]))], superScript: [new D.MathRun(clean(m[2]))] }));
    i = re.lastIndex;
  }
  if (i < t.length) o.push(new D.MathRun(clean(t.slice(i))));
  return o.length ? o : [new D.MathRun('')];
}
function runs(html, base) {
  base = base || {}; const o = []; const s = String(html == null ? '' : html);
  const re = /<sup>([\s\S]*?)<\/sup>|<b>([\s\S]*?)<\/b>|<i>([\s\S]*?)<\/i>|<span class="fr"><span>([\s\S]*?)<\/span><span>([\s\S]*?)<\/span><\/span>|<\/?[a-zA-Z][^<>]*>/g; let i = 0, m;
  const clean = t => dec(String(t).replace(/<\/?[a-zA-Z][^<>]*>/g, ''));
  const txt = t => { t = clean(t); if (t) o.push(new TextRun(Object.assign({ text: t, font: FONT }, base))); };
  while ((m = re.exec(s))) {
    txt(s.slice(i, m.index)); i = re.lastIndex;
    if (m[1] !== undefined) o.push(new TextRun(Object.assign({ text: clean(m[1]), font: FONT, superScript: true }, base)));
    else if (m[2] !== undefined) o.push(new TextRun(Object.assign({ text: clean(m[2]), font: FONT }, base, { bold: true })));
    else if (m[3] !== undefined) o.push(new TextRun(Object.assign({ text: clean(m[3]), font: FONT }, base, { italics: true })));
    else if (m[4] !== undefined) o.push(new D.Math({ children: [new D.MathFraction({ numerator: mathRuns(m[4]), denominator: mathRuns(m[5]) })] }));   // phân số (class "fr" của trang)
  }
  txt(s.slice(i)); return o;
}
const P = (children, o) => new Paragraph(Object.assign({ children, spacing: { before: 0, after: 80, line: 300 } }, o || {}));
const T = (text, o) => new TextRun(Object.assign({ text, font: FONT }, o || {}));
const brs = h => String(h || '').split(/<br\s*\/?>/i);
const H1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [T(t)] });
const H2 = t => P([T(t, { bold: true, size: 27 })], { spacing: { before: 240, after: 80, line: 300 }, keepNext: true });
const LB = (t, rest, o) => P([T(t, Object.assign({ bold: true }, o || {}))].concat(runs(rest || '', o)), {});
const IND = (children, n) => P(children, { indent: { left: 360 * (n || 1) } });
const LV = { NB: 'Nhận biết', TH: 'Thông hiểu', VD: 'Vận dụng', HSG: 'Dành cho học sinh giỏi' };

function img(q) {
  if (!q.figpng) return [];
  const w = Math.min(q.figw * 0.8, 300), h = w * q.figh / q.figw;
  return [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 100 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync(q.figpng), transformation: { width: Math.round(w), height: Math.round(h) }, altText: { title: 'Hình vẽ', description: q.figalt || 'Hình vẽ của bài', name: 'hinh' } })] })];
}
function soDo(A, body) {   // sơ đồ phân tích ngược dạng danh sách: Cần → muốn vậy cần có → … → giả thiết
  body.push(IND([T('Cần: ', { bold: true })].concat(runs(A.dich))));
  A.sd.forEach((x, i) => body.push(IND([T('⇑ muốn vậy, cần có (' + (i + 1) + '): ', { italics: true })].concat(runs(x[0]), [T('  [lời giải: bước ' + x[1].join(', ') + ']', { italics: true, color: '555555', size: 22 })]), 2)));
  body.push(IND([T('⇑ Giả thiết: ', { bold: true })].concat(runs(A.gt || 'điều đề đã cho')), 2));
}
function loiGiai(q, body) {
  body.push(P([T('Lời giải:', { bold: true })], { keepNext: true }));
  q.steps.forEach((st, k) => brs(st).forEach((h, j) => body.push(IND((j ? [] : [T('Bước ' + (k + 1) + '. ', { bold: true })]).concat(runs(h))))));
  body.push(P([T('Đáp số / kết luận: ', { bold: true })].concat(runs(q.dap))));
  if (q.loi) body.push(P([T('Lỗi hay gặp: ', { italics: true, bold: true })].concat(runs(q.loi, { italics: true }))));
}
function baiThuong(q, n, body) {
  brs(q.de).forEach((h, k) => body.push(P((k ? [] : [T('Bài ' + n + '. ', { bold: true }), T('[' + LV[q.lv] + '] ', { italics: true, color: '555555', size: 22 })]).concat(runs(h)), { keepNext: true })));
  img(q).forEach(p => body.push(p));
  if (q.goi) body.push(P([T('Gợi ý: ', { italics: true, bold: true })].concat(runs(q.goi, { italics: true }))));
  if (q.pt) {
    body.push(P([T('Phân tích ngược', { bold: true }), T(' (đọc từ trên xuống: muốn có điều trên thì cần điều dưới; trình bày lời giải thì đi từ dưới lên):', { italics: true })], { keepNext: true }));
    q.pt.forEach(A => { if (q.pt.length > 1) body.push(IND([T(A.ten + ':', { bold: true })])); soDo(A, body); });
  }
  loiGiai(q, body);
}
function baiHSG(q, n, body) {
  brs(q.de).forEach((h, k) => body.push(P((k ? [] : [T('Bài ' + n + '. ', { bold: true })]).concat(runs(h)), { keepNext: true })));
  img(q).forEach(p => body.push(p));
  if (!q.nguoc) { if (q.goi) body.push(P([T('Gợi ý: ', { italics: true, bold: true })].concat(runs(q.goi, { italics: true })))); loiGiai(q, body); return; }
  if (q.hieu) {
    body.push(P([T('Bước 1. Tìm hiểu đề bài', { bold: true, color: '1F4E79' })], { keepNext: true }));
    body.push(IND([T('Giả thiết: ', { bold: true })].concat(runs(q.hieu.gt))));
    body.push(IND([T('Kết luận: ', { bold: true })].concat(runs(q.hieu.kl))));
    (q.hieu.hoi || []).forEach(x => { body.push(IND([T('Hỏi: ', { bold: true })].concat(runs(x[0])))); body.push(IND([T('Trả lời: ', { italics: true, bold: true })].concat(runs(x[1], { italics: true })), 2)); });
  }
  body.push(P([T('Bước 2. Xây dựng chương trình giải (phân tích đi lên)', { bold: true, color: '1F4E79' })], { keepNext: true }));
  q.nguoc.forEach(A => {
    if (q.nguoc.length > 1) body.push(IND([T(A.ten + ':', { bold: true })]));
    A.buoc.forEach((B, i) => {
      const ok = B.chon.filter(c => c[1])[0];
      body.push(IND([T('Câu hỏi ' + (i + 1) + '. ', { bold: true })].concat(runs(B.hoi))));
      body.push(IND([T('Trả lời: ', { italics: true, bold: true })].concat(runs(ok[0] + '. ' + ok[2].replace(/^Đúng\.\s*/, ''), { italics: true })), 2));
      if (B.nho) body.push(IND([T('Gợi nhớ kiến thức: ', { italics: true })].concat(runs(B.nho, { italics: true, color: '555555' })), 2));
    });
  });
  body.push(P([T('Bước 3. Thực hiện chương trình giải', { bold: true, color: '1F4E79' })], { keepNext: true }));
  body.push(P([T('Sơ đồ phân tích (trình bày đi từ dưới lên):', { italics: true })], { keepNext: true }));
  q.nguoc.forEach(A => { if (q.nguoc.length > 1) body.push(IND([T(A.ten + ':', { bold: true })])); if (A.sd) soDo(A, body); });
  loiGiai(q, body);
  if (q.nhin) {
    body.push(P([T('Bước 4. Kiểm tra và nghiên cứu lời giải', { bold: true, color: '1F4E79' })], { keepNext: true }));
    q.nhin.forEach(x => { body.push(IND([T('Hỏi: ', { bold: true })].concat(runs(x[0])))); body.push(IND([T('Trả lời: ', { italics: true, bold: true })].concat(runs(x[1], { italics: true })), 2)); });
  }
}

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tu-luan-'));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 700, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' });
  await ctx.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  const pg = await ctx.newPage();
  await pg.goto('file://' + path.join(REPO, lesson, 'index.html'));
  const d = await pg.evaluate(() => { const d = window.TL_DATA; if (!d) return null;
    return { ten: d.ten, dang: d.dang || null, tlMuc: d.tlMuc || null, items: d.items.map(q => { let f = ''; try { f = q.fig ? q.fig() : ''; } catch (e) {} const c = Object.assign({}, q); delete c.fig; c.fightml = f; return c; }) }; });
  if (!d) { console.log('Bài này chưa có tự luận'); process.exit(1); }
  await pg.evaluate(() => { const h = document.createElement('div'); h.id = 'figbox'; h.style.cssText = 'position:absolute;left:0;top:0;background:#fff;padding:6px;display:inline-block;z-index:99999'; document.body.appendChild(h); });
  for (const [i, q] of d.items.entries()) {
    if (!q.fightml) continue;
    await pg.evaluate(h => { document.getElementById('figbox').innerHTML = h; }, q.fightml);
    const el = await pg.$('#figbox'); q.figpng = path.join(tmp, i + '.png'); await el.screenshot({ path: q.figpng });
    const bb = await el.boundingBox(); q.figw = bb.width; q.figh = bb.height;
    const m = /aria-label="([^"]*)"/.exec(q.fightml); q.figalt = m ? m[1] : '';
  }
  await b.close();

  const by = id => d.items.filter(q => q.id === id)[0];
  const body = [];
  body.push(new Paragraph({ heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, children: [T(title)] }));
  body.push(P([T(sub, { italics: true })], { alignment: AlignmentType.CENTER }));
  const hsg = d.items.filter(q => q.lv === 'HSG');
  function tuLuyen(list) {
    if (!list || !list.length) return;
    body.push(H2('Bài tập tự luyện'));
    list.forEach((t, i) => { body.push(P([T('Bài ' + (i + 1) + '. ', { bold: true })].concat(runs(t[0])))); body.push(IND([T('Gợi ý: ', { italics: true, bold: true })].concat(runs(t[1], { italics: true })))); body.push(IND([T('Đáp số: ', { bold: true })].concat(runs(t[2])))); });
  }
  if (d.dang) {
    body.push(P([T('Bài tập chia theo dạng. Mỗi dạng có phương pháp giải, các bài xếp từ dễ đến khó, cuối dạng có bài tập tự luyện.' + (hsg.length ? ' Phần cuối dành cho học sinh giỏi, giải theo 4 bước.' : ''), { italics: true })], { spacing: { before: 120, after: 160, line: 300 } }));
    d.dang.forEach((x, k) => {
      body.push(H1('Dạng ' + (k + 1) + '. ' + x.ten));
      body.push(P([T('Phương pháp giải', { bold: true })], { keepNext: true }));
      x.pp.forEach(t => body.push(IND([T('• ')].concat(runs(t)))));
      x.ids.map(by).filter(Boolean).forEach((q, i) => baiThuong(q, i + 1, body));
      tuLuyen(x.tl);
    });
  } else {
    ['NB', 'TH', 'VD'].forEach(lv => { const qs = d.items.filter(q => q.lv === lv); if (!qs.length) return; body.push(H1(LV[lv] + ' (' + qs.length + ' bài)')); qs.forEach((q, i) => baiThuong(q, i + 1, body)); tuLuyen(d.tlMuc && d.tlMuc[lv]); });
  }
  if (hsg.length) { body.push(H1('Dành cho học sinh giỏi (' + hsg.length + ' bài)')); body.push(P([T('Mỗi bài giải theo 4 bước: Tìm hiểu đề bài; Xây dựng chương trình giải; Thực hiện chương trình giải; Kiểm tra và nghiên cứu lời giải.', { italics: true })])); hsg.forEach((q, i) => baiHSG(q, i + 1, body)); }

  const doc = new Document({ creator: 'Luyện toán THCS', title,
    styles: { default: { document: { run: { font: FONT, size: 26 } },
      title: { run: { font: FONT, size: 34, bold: true }, paragraph: { spacing: { before: 0, after: 120 }, keepNext: true } },
      heading1: { run: { font: FONT, size: 28, bold: true }, paragraph: { spacing: { before: 360, after: 120 }, keepNext: true } } } },
    sections: [{ properties: { page: { margin: { top: 1134, bottom: 1134, left: 1417, right: 1134 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [T('Trang ', { size: 22 }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 22 })] })] }) },
      children: body }] });
  fs.writeFileSync(out, await Packer.toBuffer(doc));
  console.log('ok', out, d.items.length + ' bài, ' + d.items.filter(q => q.figpng).length + ' hình');
})();
