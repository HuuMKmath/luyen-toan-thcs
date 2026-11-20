// Kiểm tra gói Toán thực tế: node cong-cu/toan-thuc-te/kiem-tra.js ten-thu-muc-bai [so-lan]
// Sinh mỗi tình huống nhiều lần, tính lại đáp án độc lập từ đề (kiem-tra/*.chk.js) và kiểm tra cấu trúc câu hỏi.
const fs=require('fs'),path=require('path');
const page=process.argv[2],RUNS=+process.argv[3]||300;
const REPO=path.resolve(__dirname,'..','..');
const file=page==='.'?REPO+'/index.html':`${REPO}/${page}/index.html`;
const h=fs.readFileSync(file,'utf8');
const a=h.indexOf('"use strict";'),b=h.indexOf('/* ============ Trạng thái');
const pre="var window=globalThis;var document={addEventListener(){},querySelector(){return null},getElementById(){return null}};var localStorage={getItem(){return null},setItem(){}};var location={search:'',hash:''};var navigator={};\n";
const tmp=`/tmp/h_${page.replace(/\W/g,'_')}.js`;
fs.writeFileSync(tmp,pre+h.slice(a,b)+'\n;module.exports={PISA,TKEYS,setR:f=>{RNG=f},mulberry32};');
const m=require(tmp);
const U=require('./kiem-tra/util.js');
const chkFile=path.join(__dirname,'kiem-tra',`${page==='.'?'tam-giac':page}.chk.js`);
const CH=fs.existsSync(chkFile)?require(chkFile):{};
let bad=0,seenT={};
const report=(t,msg)=>{bad++;if(bad<25)console.log('  LỖI',t,':',msg);};
// tính tất định với hạt giống
for(const [i,g] of m.PISA.entries()){
  m.setR(m.mulberry32(12345));const x=JSON.stringify(g());m.setR(m.mulberry32(12345));const y=JSON.stringify(g());
  if(x!==y)report('#'+i,'không tất định theo hạt giống');
}
m.setR(Math.random);
for(let r=0;r<RUNS;r++)for(const [i,g] of m.PISA.entries()){
  const u=g();const t=u.title;seenT[t]=(seenT[t]||0)+1;
  if(!u.qs||u.qs.length<3||u.qs.length>4)report(t,'số câu '+(u.qs&&u.qs.length));
  u.qs.forEach((q,k)=>{
    if(!m.TKEYS.includes(q.topic))report(t,`câu ${k+1} topic ${q.topic}`);
    if(!['NB','TH','VD'].includes(q.level))report(t,`câu ${k+1} level`);
    if(!q.exp)report(t,`câu ${k+1} thiếu lời giải`);
    if(q.type==='tf')report(t,'có câu TF');
    if(q.type==='mc'){if(q.opts.length!==4||new Set(q.opts.map(o=>U.txt(o.t))).size!==4)report(t,`câu ${k+1} lựa chọn trùng: `+q.opts.map(o=>U.txt(o.t)).join(' | '));
      if(q.opts.slice(1).some(o=>!o.err))report(t,`câu ${k+1} thiếu err`);}
    if(q.type==='sa'&&(!Array.isArray(q.ans)||!isFinite(q.ans[0])))report(t,`câu ${k+1} đáp án không phải số`);
  });
  if(CH[t]){let exp;try{exp=CH[t](u,U);}catch(e){report(t,'checker lỗi '+e.stack.split('\n').slice(0,2).join(' '));continue;}
    exp.forEach((e,k)=>{if(e===undefined)return;const q=u.qs[k];
      if(q.type==='sa'){if(Math.abs(q.ans[0]-e)>1e-6)report(t,`câu ${k+1}: máy ${q.ans[0]} ≠ kiểm tra ${e} | ${U.txt(q.stem)}`);}
      else{const R=U.txt(q.opts[0].t);const ok=typeof e==='function'?e(R,q.opts.map(o=>U.txt(o.t))):R===U.txt(e);
        if(!ok)report(t,`câu ${k+1}: đáp án "${R}" ≠ kiểm tra "${typeof e==='function'?'(hàm)':U.txt(e)}"`);
        if(typeof e!=='function')q.opts.slice(1).forEach(o=>{if(U.txt(o.t)===U.txt(e))report(t,`câu ${k+1}: lựa chọn sai trùng đáp án`);});}
    });
  }else if(r===0)console.log('  (chưa có hàm kiểm tra cho "'+t+'")');
}
console.log(page,'tình huống:',m.PISA.length,JSON.stringify(seenT),bad?`LỖI: ${bad}`:'không lỗi');
process.exitCode=bad?1:0;
