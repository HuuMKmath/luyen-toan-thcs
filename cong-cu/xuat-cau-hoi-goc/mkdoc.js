const fs=require('fs');const D=require('docx');
const {Document,Packer,Paragraph,TextRun,HeadingLevel,AlignmentType,Math:DMath,MathFraction,MathRun,MathSuperScript,Footer,PageNumber,BorderStyle,ImageRun}=D;
const [,, inp,out,title,sub]=process.argv;const R=JSON.parse(fs.readFileSync(inp,'utf8'));
const FONT='Times New Roman';
const dec=s=>s.replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
// HTML ngắn -> các run của Word: phân số thành phân số thật, <sup> thành chỉ số trên
// tử số, mẫu số của phân số: chữ thường và luỹ thừa (cơ số liền trước thẻ <sup>)
function mparts(html){const out=[],re=/([^\s<·:+]+)<sup>([\s\S]*?)<\/sup>/g;let i=0,m;const clean=t=>dec(String(t).replace(/<\/?[a-zA-Z][^<>]*>/g,''));
  while((m=re.exec(html))){const pre=clean(html.slice(i,m.index));if(pre)out.push(new MathRun(pre));out.push(new MathSuperScript({children:[new MathRun(clean(m[1]))],superScript:[new MathRun(clean(m[2]))]}));i=re.lastIndex;}
  const rest=clean(html.slice(i));if(rest)out.push(new MathRun(rest));return out.length?out:[new MathRun('')];}
function runs(html,base){base=base||{};const out=[];let s=String(html==null?'':html);
  const re=/<span class="fr"><span>([\s\S]*?)<\/span>\s*<span>([\s\S]*?)<\/span><\/span>|<sup>([\s\S]*?)<\/sup>|<b>([\s\S]*?)<\/b>|<\/?[a-zA-Z][^<>]*>/g;let i=0,m;
  const txt=t=>{t=dec(t.replace(/<\/?[a-zA-Z][^<>]*>/g,''));if(t)out.push(new TextRun(Object.assign({text:t,font:FONT},base)));};
  while((m=re.exec(s))){txt(s.slice(i,m.index));i=re.lastIndex;
    if(m[1]!==undefined)out.push(new DMath({children:[new MathFraction({numerator:mparts(m[1]),denominator:mparts(m[2])})]}));
    else if(m[3]!==undefined)out.push(new TextRun(Object.assign({text:dec(m[3].replace(/<\/?[a-zA-Z][^<>]*>/g,'')),font:FONT,superScript:true},base)));
    else if(m[4]!==undefined)out.push(new TextRun(Object.assign({text:dec(m[4].replace(/<\/?[a-zA-Z][^<>]*>/g,'')),font:FONT},base,{bold:true})));}
  txt(s.slice(i));return out;}
const P=(children,o)=>new Paragraph(Object.assign({children,spacing:{before:0,after:80,line:300}},o||{}));
const T=(text,o)=>new TextRun(Object.assign({text,font:FONT},o||{}));
// Đáp án trả lời ngắn: số nguyên, số thập phân (dấu phẩy) hoặc phân số tối giản
function fmtAns(q){const v=q.ans[0],neg=v<0?'−':'',a=Math.abs(v);if(Number.isInteger(a))return neg+a;
  let best=null;for(let d=1;d<=5000&&!best;d++){const n=Math.round(a*d);if(Math.abs(n/d-a)<1e-9)best=[n,d];}
  const dec=String(Math.round(a*1e8)/1e8).replace('.',',');if(!best)return neg+dec;
  let d=best[1];while(d%2===0)d/=2;while(d%5===0)d/=5;const fr=best[0]+'/'+best[1];
  if(d!==1)return neg+fr;
  return /phân số/.test(String(q.stem).replace(/<\/?[a-zA-Z][^<>]*>/g,''))&&!/số thập phân/.test(String(q.stem).replace(/<\/?[a-zA-Z][^<>]*>/g,''))?neg+fr+' (= '+neg+dec+')':neg+dec;}
const body=[];
body.push(new Paragraph({heading:HeadingLevel.TITLE,alignment:AlignmentType.CENTER,children:[T(title)]}));
body.push(P([T(sub,{italics:true})],{alignment:AlignmentType.CENTER}));
const cnt={mc:0,tf:0,sa:0},fix=R.roots.filter(q=>!q.gen).length;R.roots.forEach(q=>cnt[q.t]++);
body.push(P([T(`Tổng số: ${R.roots.length} câu hỏi gốc, gồm ${cnt.mc} câu nhiều lựa chọn, ${cnt.tf} câu đúng sai, ${cnt.sa} câu trả lời ngắn. Trong đó ${fix} câu cố định và ${R.roots.length-fix} câu tự đổi số liệu.`)],{spacing:{before:120,after:80,line:300}}));
body.push(P([T('Câu ghi "Tự đổi số liệu" là một khuôn đề: trên website mỗi lần làm máy thay số mới và tính lại đáp án, ở đây in một ví dụ. Với câu nhiều lựa chọn, đáp án đúng được in đậm; trên website thứ tự A, B, C, D được xáo riêng cho từng học sinh.')],{spacing:{before:0,after:160,line:300}}));
const tk=Object.keys(R.topics),lv=Object.keys(R.levels);
const sortQ=a=>a.slice().sort((x,y)=>tk.indexOf(x.topic)-tk.indexOf(y.topic)||lv.indexOf(x.level)-lv.indexOf(y.level));
const head=(n,q)=>P([T(`Câu ${n}. `,{bold:true}),T(`[${R.levels[q.level]} · ${R.topics[q.topic]} · ${q.gen?'Tự đổi số liệu':'Cố định'}]`,{italics:true,color:'555555',size:22})],{spacing:{before:200,after:60,line:300},keepNext:true});
const sol=q=>q.exp?[P([T('Lời giải: ',{italics:true,bold:true})].concat(runs(q.exp,{italics:true})))]:[];
[['mc','Phần I. Câu nhiều lựa chọn'],['tf','Phần II. Câu đúng sai'],['sa','Phần III. Câu trả lời ngắn']].forEach(([t,name])=>{
  const qs=sortQ(R.roots.filter(q=>q.t===t));if(!qs.length)return;
  body.push(new Paragraph({heading:HeadingLevel.HEADING_1,children:[T(name)]}));
  qs.forEach((q,i)=>{body.push(head(i+1,q));body.push(P(runs(q.stem),q.figpng?{keepNext:true}:{}));
    if(q.figpng){const w=Math.min(q.figw*0.8,330),h=w*q.figh/q.figw;body.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:40,after:100},children:[new ImageRun({type:'png',data:fs.readFileSync(q.figpng),transformation:{width:Math.round(w),height:Math.round(h)},altText:{title:'Hình vẽ',description:q.figalt||'Hình vẽ của câu hỏi',name:'hinh'}})]}));}
    if(t==='mc'){q.opts.forEach((o,k)=>{const good=k===q.ans;body.push(P([T('ABCD'[k]+'. ',{bold:good})].concat(runs(o.t,good?{bold:true}:{})),{indent:{left:360}}));});
      body.push(P([T('Đáp án: ',{bold:true}),T('ABCD'[q.ans],{bold:true})]));sol(q).forEach(p=>body.push(p));}
    else if(t==='tf'){q.items.forEach((it,k)=>{body.push(P([T('abcd'[k]+') ')].concat(runs(it.t),[T(it.v?'   [Đúng]':'   [Sai]',{bold:true})]),{indent:{left:360}}));
        if(it.exp)body.push(P(runs(it.exp,{italics:true}),{indent:{left:720}}));});
      sol(q).forEach(p=>body.push(p));}
    else{body.push(P([T('Đáp án: ',{bold:true}),T(fmtAns(q)+(q.unit?' '+q.unit:''),{bold:true})]));sol(q).forEach(p=>body.push(p));}
  });});
const doc=new Document({creator:'Luyện toán THCS',title,
  styles:{default:{document:{run:{font:FONT,size:26}},
    title:{run:{font:FONT,size:34,bold:true},paragraph:{spacing:{before:0,after:120},keepNext:true}},
    heading1:{run:{font:FONT,size:28,bold:true},paragraph:{spacing:{before:360,after:120},keepNext:true}}}},
  sections:[{properties:{page:{margin:{top:1134,bottom:1134,left:1417,right:1134}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[T('Trang ',{size:22}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:22})]})]})},
    children:body}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync(out,b);console.log('ok',out,b.length);});
