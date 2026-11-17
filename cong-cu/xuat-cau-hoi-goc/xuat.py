#!/usr/bin/env python3
"""Xuất câu hỏi gốc của MỘT bài ra tệp Word.

Cách dùng (chạy từ thư mục gốc của kho):
  python3 cong-cu/xuat-cau-hoi-goc/xuat.py <thư mục bài> "<Bài N. Tên bài>" "<Toán L, Kết nối tri thức, Chương X>" <tệp ra .docx>
Ví dụ:
  python3 cong-cu/xuat-cau-hoi-goc/xuat.py tap-hop-so-thuc "Bài 7. Tập hợp các số thực" "Toán 7, Kết nối tri thức, Chương II" "/mnt/user-data/outputs/Bài 07. Tập hợp các số thực - Câu hỏi gốc.docx"
Bài Tam giác bằng nhau nằm ở thư mục gốc: dùng "." làm thư mục bài.

Cần: python playwright, /usr/bin/google-chrome, node với gói docx (đều có sẵn trong môi trường làm việc).
Mỗi bộ sinh (generator) là một câu gốc và được in kèm một ví dụ; các id dùng chung một bộ sinh chỉ tính một câu.
"""
import asyncio, json, os, re, subprocess, sys, tempfile
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
JS = '''()=>{const gens=new Map();const roots=[];
[['mc',MC],['tf',TF],['sa',SA]].forEach(([t,a])=>a.forEach(q=>{
  if(q.gen){if(gens.has(q.gen)){gens.get(q.gen).ids.push(q.id);return;}
    const x=Object.assign({},q,q.gen());const r={t,ids:[q.id],gen:true,topic:q.topic,level:q.level,x};gens.set(q.gen,r);roots.push(r);}
  else roots.push({t,ids:[q.id],gen:false,topic:q.topic,level:q.level,x:q});}));
return {topics:Object.fromEntries(TKEYS.map(k=>[k,TOPICS[k].name||TOPICS[k].short])),levels:LEVELS,
 roots:roots.map(r=>({t:r.t,ids:r.ids,gen:r.gen,topic:r.topic,level:r.level,stem:r.x.stem,fig:r.x.fig||'',opts:(r.x.opts||[]).map(o=>typeof o==='string'?{t:o}:o),ans:r.x.ans,items:(r.x.items||[]).map(i=>({t:i.t,v:i.v,exp:i.exp||''})),exp:r.x.exp||'',unit:r.x.unit||''}))};}'''

async def main(lesson, title, sub, out):
    tmp = tempfile.mkdtemp(prefix='cau-hoi-goc-')
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': 700, 'height': 900}, device_scale_factor=2, color_scheme='light')
        await ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith('file:') else r.abort())
        pg = await ctx.new_page()
        await pg.goto('file://' + os.path.join(REPO, lesson, 'index.html'))
        r = await pg.evaluate(JS)
        await pg.evaluate("()=>{const h=document.createElement('div');h.id='figbox';h.style.cssText='position:absolute;left:0;top:0;background:#fff;padding:6px;display:inline-block;z-index:99999';document.body.appendChild(h);}")
        for i, q in enumerate(r['roots']):
            if q['fig']:  # hình vẽ: chụp thành ảnh PNG để chèn vào Word
                await pg.evaluate("(h)=>{document.getElementById('figbox').innerHTML=h;}", q['fig'])
                el = await pg.query_selector('#figbox')
                q['figpng'] = os.path.join(tmp, f'{i}.png')
                await el.screenshot(path=q['figpng'])
                bb = await el.bounding_box()
                q['figw'], q['figh'] = bb['width'], bb['height']
                m = re.search(r'aria-label="([^"]*)"', q['fig'])
                q['figalt'] = m.group(1) if m else ''
            q['fig'] = ''
        await b.close()
    data = os.path.join(tmp, 'roots.json')
    json.dump(r, open(data, 'w', encoding='utf-8'), ensure_ascii=False)
    subprocess.run(['node', os.path.join(HERE, 'mkdoc.js'), data, out, title, 'Câu hỏi gốc của website Luyện toán THCS · ' + sub], check=True)
    subprocess.run(['zip', '-d', out, '*/'], capture_output=True)  # bỏ mục thư mục trong tệp zip
    n = {t: sum(1 for q in r['roots'] if q['t'] == t) for t in ('mc', 'tf', 'sa')}
    print(f"{len(r['roots'])} câu gốc: {n['mc']} nhiều lựa chọn, {n['tf']} đúng sai, {n['sa']} trả lời ngắn; {sum(1 for q in r['roots'] if q.get('figpng'))} hình")

if __name__ == '__main__':
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    asyncio.run(main(*sys.argv[1:]))
