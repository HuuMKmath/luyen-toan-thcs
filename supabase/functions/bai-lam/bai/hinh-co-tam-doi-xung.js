// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ hinh-co-tam-doi-xung/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "hinh-co-tam-doi-xung";
export const TIEN_TO = "TX6-";

export function taoBai() {
  "use strict";
  // Thay cho các đối tượng của trình duyệt (phần ngân hàng chỉ khai báo, không dùng tới)
  // GM: lớp điểm thưởng của trang (gamify.js) – trên máy chủ chỉ là vỏ rỗng, mọi lời gọi trả về null
  const GM = new Proxy({}, { get: (t, k) => (k in t ? t[k] : () => null), set: (t, k, v) => { t[k] = v; return true; } });
  const window = { GM };
  const localStorage = { getItem() { return null; }, setItem() {} };
  const document = { getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; } };
  const setInterval = () => 0, clearInterval = () => {};

// ===== Ngân hàng câu hỏi, bộ sinh số liệu, trạng thái (nguyên văn) =====
if(!window.GM)window.GM={onPractice(){return null;},onFinish(){return null;},barHTML(){return '';},resultHTML(){return '';},fx(){},refresh(){},sync(){},rebar(){},gate(){return true;}}; // gamify.js không tải được thì trang vẫn chạy bình thường

/* ============ Viết số ============ */
const N=x=>x<0?'−'+(-x):''+x;
const nb=s=>s.replace(/ /g,' ');   // khoảng trắng không ngắt dòng
const sum=v=>v.reduce((s,x)=>s+x,0);

/* ============ Ngẫu nhiên có hạt giống ============ */
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^=h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function pickOpts(goodT,cands){
  const seen=new Set([goodT]),out=[];
  for(const c of cands){if(!seen.has(c.t)){seen.add(c.t);out.push({t:c.t,err:c.err});}if(out.length===3)break;}
  return out;
}
const C=(t,err)=>({t,err});
const mk=(stem,good,cands,exp,fig)=>{const q={stem,opts:[{t:good}].concat(pickOpts(good,cands)),ans:0,exp};if(fig)q.fig=fig;return q;};
function tryGen(f){
  for(let n=0;n<100;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>o.t)).size===4)return r;}
  return FB_MC();
}
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
const LB='abcd';

/* ============ Hình vẽ (SVG, vẽ từ đầu, màu theo giao diện sáng/tối) ============ */
const f1=x=>Math.round(x*10)/10;
const pts=a=>a.map(p=>f1(p[0])+','+f1(p[1])).join(' ');
const fb=svg=>`<div class="figbox">${svg}</div>`;
const fbw=svg=>`<div class="figbox wide">${svg}</div>`;
function regPoly(n,r,rot){const a=[];for(let i=0;i<n;i++){const t=rot+i*2*Math.PI/n;a.push([50+r*Math.cos(t),50+r*Math.sin(t)]);}return a;}
function star(n,R,r){const a=[];for(let i=0;i<2*n;i++){const t=-Math.PI/2+i*Math.PI/n,q=i%2?r:R;a.push([50+q*Math.cos(t),52+q*Math.sin(t)]);}return a;}
const poly=a=>`<polygon class="sh" points="${pts(a)}"/>`;
const rot90=(p,k)=>{let [x,y]=p;for(let i=0;i<k;i++){[x,y]=[100-y,x];}return [x,y];};
/* Mỗi hình nằm trong ô 100 × 100; ax = số trục đối xứng (Infinity: vô số). n = tên hình theo SGK (nếu có). */
const SH={
  tron:{n:'hình tròn',ax:Infinity,d:()=>`<circle class="sh" cx="50" cy="50" r="36"/>`},
  vuong:{n:'hình vuông',ax:4,d:()=>poly([[18,18],[82,18],[82,82],[18,82]])},
  cn:{n:'hình chữ nhật',ax:2,d:()=>poly([[8,26],[92,26],[92,74],[8,74]])},
  thoi:{n:'hình thoi',ax:2,d:()=>poly([[50,10],[88,50],[50,90],[12,50]])},
  tgd:{n:'hình tam giác đều',ax:3,d:()=>poly([[50,16],[89,83.5],[11,83.5]])},
  lgd:{n:'hình lục giác đều',ax:6,d:()=>poly(regPoly(6,40,0))},
  tc:{n:'hình thang cân',ax:1,d:()=>poly([[8,74],[92,74],[70,30],[30,30]])},
  bh:{n:'hình bình hành',ax:0,d:()=>poly([[6,74],[66,74],[94,28],[34,28]])},
  tgt:{n:null,ax:0,d:()=>poly([[10,82],[90,82],[30,18]])},
  sao5:{n:null,ax:5,d:()=>poly(star(5,44,18))},
  sao6:{n:null,ax:6,d:()=>poly(star(6,42,24.25))},
  sao4:{n:null,ax:4,d:()=>poly(star(4,44,15))},
  tim:{n:null,ax:1,d:()=>`<path class="sh" d="M50 88 C22 66 8 52 8 34 C8 20 19 12 30 12 C40 12 47 18 50 26 C53 18 60 12 70 12 C81 12 92 20 92 34 C92 52 78 66 50 88 Z"/>`},
  dieu:{n:null,ax:1,d:()=>poly([[50,8],[80,38],[50,94],[20,38]])},
  mui:{n:null,ax:1,d:()=>poly([[8,40],[56,40],[56,22],[92,50],[56,78],[56,60],[8,60]])},
  chong:{n:null,ax:0,d:()=>[0,1,2,3].map(k=>poly([[50,50],[50,10],[76,26]].map(p=>rot90(p,k)))).join('')},
  thap:{n:null,ax:4,d:()=>poly([[38,10],[62,10],[62,38],[90,38],[90,62],[62,62],[62,90],[38,90],[38,62],[10,62],[10,38],[38,38]])},
  zz:{n:null,ax:0,d:()=>poly([[10,24],[60,24],[60,48],[90,48],[90,76],[40,76],[40,52],[10,52]])},
  lc:{n:null,ax:0,d:()=>poly([[22,8],[46,8],[46,68],[78,68],[78,90],[22,90]])},
  ch2:{n:null,ax:0,d:()=>poly([[50,50],[38,8],[64,14]])+poly([[50,50],[62,92],[36,86]])},
  ch3:{n:null,ax:0,d:()=>[0,1,2].map(k=>{const t=k*2*Math.PI/3,R=p=>[50+(p[0]-50)*Math.cos(t)-(p[1]-50)*Math.sin(t),50+(p[0]-50)*Math.sin(t)+(p[1]-50)*Math.cos(t)];return poly([[50,50],[50,8],[74,22]].map(R));}).join('')}
};
/* Có tâm đối xứng hay không */
const TAM={tron:true,vuong:true,cn:true,thoi:true,tgd:false,lgd:true,tc:false,bh:true,tgt:false,sao5:false,sao6:true,sao4:true,tim:false,dieu:false,mui:false,chong:true,thap:true,zz:true,lc:false,ch2:true,ch3:false};
const CEN=k=>k==='tgd'?[50,61]:[50,50];
const AXN=a=>a===Infinity?'vô số':String(a);
const shapeG=(k,ox,extra)=>`<g data-s="${k}" transform="translate(${ox},0)">${SH[k].d()}${extra||''}</g>`;
/* Hàng hình có nhãn a), b), c), d) */
function figRow(keys,lines,alt){
  const n=keys.length,W=104*n;
  let s=keys.map((k,i)=>shapeG(k,i*104+2,lines&&lines[i]?`<line class="ax" data-l="${lines[i].ax?1:0}" x1="${f1(lines[i].p[0][0])}" y1="${f1(lines[i].p[0][1])}" x2="${f1(lines[i].p[1][0])}" y2="${f1(lines[i].p[1][1])}"/>`:'')).join('');
  s+=keys.map((k,i)=>`<text class="vl" x="${i*104+54}" y="118" text-anchor="middle">${LB[i]})</text>`).join('');
  return `<svg class="fig" viewBox="-2 -2 ${W+4} 126" role="img" aria-label="${alt||'Các hình được đánh nhãn '+keys.map((k,i)=>LB[i]).join(', ')}">${s}</svg>`;
}
/* Đường thẳng thử (nét đứt) trên từng hình: ax = có phải trục đối xứng không */
const LN={
  cn:[{p:[[50,12],[50,88]],ax:true,why:'Đường thẳng đi qua trung điểm hai cạnh đối diện là trục đối xứng của hình chữ nhật.'},{p:[[2,22.6],[98,77.4]],ax:false,why:'Đường chéo của hình chữ nhật (không phải hình vuông) không phải trục đối xứng: gấp theo đường chéo, hai phần không chồng khít.'}],
  vuong:[{p:[[10,10],[90,90]],ax:true,why:'Mỗi đường chéo của hình vuông là một trục đối xứng.'},{p:[[8,50],[92,50]],ax:true,why:'Đường thẳng đi qua trung điểm hai cạnh đối diện của hình vuông là trục đối xứng.'}],
  thoi:[{p:[[50,2],[50,98]],ax:true,why:'Mỗi đường chéo là một trục đối xứng của hình thoi.'},{p:[[22.5,21],[77.5,79]],ax:false,why:'Đường thẳng nối trung điểm hai cạnh đối diện của hình thoi (không phải hình vuông) không phải trục đối xứng.'}],
  bh:[{p:[[0,77.1],[100,24.9]],ax:false,why:'Hình bình hành không có trục đối xứng, kể cả đường chéo.'},{p:[[32.4,80],[67.6,22]],ax:false,why:'Hình bình hành không có trục đối xứng: gấp theo đường này hai phần không chồng khít.'}],
  tgd:[{p:[[50,6],[50,94]],ax:true,why:'Đường thẳng đi qua một đỉnh và trung điểm cạnh đối diện là trục đối xứng của tam giác đều.'},{p:[[10,49.75],[90,49.75]],ax:false,why:'Đường thẳng đi qua trung điểm hai cạnh của tam giác đều chia hình thành hai phần không chồng khít, không phải trục đối xứng.'}],
  tc:[{p:[[50,20],[50,86]],ax:true,why:'Đường thẳng đi qua trung điểm hai đáy là trục đối xứng của hình thang cân.'},{p:[[0,79.7],[100,8.7]],ax:false,why:'Đường chéo của hình thang cân không phải trục đối xứng.'},{p:[[2,52],[98,52]],ax:false,why:'Hai đáy của hình thang cân dài khác nhau nên gấp theo đường nằm ngang này, hai phần không chồng khít.'}],
  tron:[{p:[[6,30],[94,70]],ax:true,why:'Mỗi đường thẳng đi qua tâm là một trục đối xứng của hình tròn.'},{p:[[4,30],[96,30]],ax:false,why:'Đường thẳng không đi qua tâm chia hình tròn thành hai phần không bằng nhau nên không phải trục đối xứng.'}],
  lgd:[{p:[[2,50],[98,50]],ax:true,why:'Đường thẳng đi qua hai đỉnh đối diện là trục đối xứng của hình lục giác đều.'},{p:[[50,4],[50,96]],ax:true,why:'Đường thẳng đi qua trung điểm hai cạnh đối diện là trục đối xứng của hình lục giác đều.'}]
};
/* Lưới ô vuông. o.W, o.H: số cột, số hàng; o.cells: ô được tô [x,y]; o.ax: {o:'v'|'h',k} trục nằm trên đường kẻ thứ k;
   o.pts: điểm ở tâm ô {x,y,l}; o.num: đánh số ô 1, 2, 3, ... theo hàng. */
function figGrid(o){
  const s=o.pts&&o.pts.length?30:24,p=14,W=o.W*s+2*p+(o.ax&&o.ax.o==='h'?18:0),H=o.H*s+2*p+(o.ax?12:0),y0=p+(o.ax&&o.ax.o==='v'?12:0);
  let g='';
  for(let i=0;i<=o.W;i++)g+=`<line class="gl" x1="${p+i*s}" y1="${y0}" x2="${p+i*s}" y2="${y0+o.H*s}"/>`;
  for(let j=0;j<=o.H;j++)g+=`<line class="gl" x1="${p}" y1="${y0+j*s}" x2="${p+o.W*s}" y2="${y0+j*s}"/>`;
  (o.cells||[]).forEach(([x,y])=>{g+=`<rect class="on" data-c="${x},${y}" x="${p+x*s}" y="${y0+y*s}" width="${s}" height="${s}"/>`;});
  if(o.num){let k=1;for(let y=0;y<o.H;y++)for(let x=0;x<o.W;x++){g+=`<text class="nm" data-n="${x},${y},${k}" x="${p+x*s+s/2}" y="${y0+y*s+s/2+5}" text-anchor="middle">${k}</text>`;k++;}}
  (o.pts||[]).forEach(q=>{const cx=p+q.x*s+s/2,cy=y0+q.y*s+s/2;g+=`<circle class="pt" data-p="${q.x},${q.y},${q.l}" cx="${cx}" cy="${cy}" r="3.6"/><text class="vl sm" x="${cx+7}" y="${cy-4}">${q.l}</text>`;});
  if(o.O){const cx=p+o.O.x*s,cy=y0+o.O.y*s;g+=`<circle class="po" data-o="${o.O.x},${o.O.y}" cx="${cx}" cy="${cy}" r="4.2"/>${o.num?'':`<text class="vl" x="${cx+6}" y="${cy+16}">O</text>`}`;}
  if(o.ax){if(o.ax.o==='v'){const x=p+o.ax.k*s;g+=`<line class="ax" data-ax="v,${o.ax.k}" x1="${x}" y1="${y0-10}" x2="${x}" y2="${y0+o.H*s+8}"/><text class="vl" x="${x+5}" y="${y0-2}">d</text>`;}
    else{const y=y0+o.ax.k*s;g+=`<line class="ax" data-ax="h,${o.ax.k}" x1="${p-8}" y1="${y}" x2="${p+o.W*s+8}" y2="${y}"/><text class="vl" x="${p+o.W*s+11}" y="${y+5}">d</text>`;}}
  return `<svg class="fig" viewBox="0 0 ${W} ${H}" style="max-width:${Math.min(400,W*1.25)}px" role="img" aria-label="${o.alt||'Lưới ô vuông có đường thẳng d'}">${g}</svg>`;
}
/* Quay nửa vòng quanh O (giao điểm đường kẻ): ô (x, y) trùng với ô nào */
const rot=(O,[x,y])=>[2*O.x-1-x,2*O.y-1-y];
function needT(cells,fs){const S=new Set(cells.map(c=>c[0]+','+c[1])),out=new Set();let cur=cells.slice(),grow=true;while(grow){grow=false;for(const c of cur.slice())for(const f of fs){const m=f(c),k=m[0]+','+m[1];if(!S.has(k)){S.add(k);out.add(k);cur.push(m);grow=true;}}}return out.size;}
/* Gấp theo trục: ô (x, y) trùng với ô nào */
const mir=(ax,[x,y])=>ax.o==='v'?[2*ax.k-1-x,y]:[x,2*ax.k-1-y];
const key=([x,y])=>x+','+y;
/* Số ô cần tô thêm để hình nhận trục làm trục đối xứng */
function needAdd(cells,axes){const S=new Set(cells.map(key)),out=new Set();
  let grow=true,cur=cells.slice();while(grow){grow=false;for(const c of cur.slice())for(const ax of axes){const m=mir(ax,c),k=key(m);if(!S.has(k)){S.add(k);out.add(k);cur.push(m);grow=true;}}}
  return out.size;}
/* Chu vi (số cạnh ô nằm ở biên) của một tập ô */
function perim(cells){const S=new Set(cells.map(key));let n=0;cells.forEach(([x,y])=>{[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{if(!S.has((x+a)+','+(y+b)))n++;});});return n;}
/* Sinh một nửa hình liền khối, bám vào trục (trục dọc ở đường kẻ k, nửa bên trái) */
function growHalf(k,H,n){const S=new Set(),c=[];const add=(x,y)=>{if(x<0||x>=k||y<0||y>=H||S.has(x+','+y))return false;S.add(x+','+y);c.push([x,y]);return true;};
  add(k-1,ri(0,H-1));let t=0;while(c.length<n&&t<400){t++;const [x,y]=sel(c),[a,b]=sel([[1,0],[-1,0],[0,1],[0,-1]]);add(x+a,y+b);}return c;}
/* Giấy gấp đôi: nếp gấp ở cạnh trái, phần cắt (nét đỏ) */
function figFold(kind,alt){
  const fold=`<rect class="paper" x="20" y="8" width="96" height="104"/><line class="fold" x1="20" y1="2" x2="20" y2="118"/><text class="vl sm" x="24" y="128">nếp gấp</text>`;
  const C={
    cn:`<polygon class="cut" points="20,26 70,26 70,94 20,94"/>`,
    tamg:`<polygon class="cut" points="20,18 52,60 20,102"/>`,
    tgd:`<polygon class="cut" points="20,20 62,92.7 20,92.7"/>`,
    luc:`<polygon class="cut" points="20,20 54.6,40 54.6,80 20,100"/>`,
    nua:`<path class="cut" d="M20 20 A40 40 0 0 1 20 100 Z"/>`,
    vg:`<polygon class="cut" points="20,30 50,60 20,90"/>`
  };
  return `<svg class="fig" viewBox="0 0 136 134" style="max-width:190px" role="img" aria-label="${alt||'Tờ giấy gấp đôi, nếp gấp ở cạnh trái, nét đỏ là đường cắt'}">${fold}${C[kind]}</svg>`;
}
/* Chữ cái in hoa (theo cách xét quen thuộc trong sách) */
const LET={
  doc:['A','M','T','U','V','W','Y'],      // chỉ có trục dọc (thẳng đứng)
  ngang:['B','C','D','E'],                // chỉ có trục ngang
  hai:['H','I','O','X'],                  // có hai trục: dọc và ngang
  khong:['F','G','J','L','N','P','Q','R','S','Z']
};
const TAMC=['H','I','N','O','S','X','Z'],NOTAM=['A','B','C','D','E','F','G','J','L','M','P','Q','R','T','U','V','W','Y'];
const letTam=c=>TAMC.includes(c);
const letAx=c=>LET.hai.includes(c)?2:(LET.doc.includes(c)||LET.ngang.includes(c))?1:0;
const figLet=(arr,alt)=>`<svg class="fig" viewBox="0 0 ${arr.length*56+8} 70" style="max-width:${Math.min(400,arr.length*70)}px" role="img" aria-label="${alt||'Các chữ cái '+arr.join(', ')}">${arr.map((c,i)=>`<text class="big" data-ch="${c}" x="${i*56+32}" y="58" text-anchor="middle">${c}</text>`).join('')}</svg>`;

const FB_MC=()=>({stem:'Tâm đối xứng của hình bình hành là:',opts:[{t:'giao điểm của hai đường chéo'},{t:'trung điểm của một cạnh',err:'Quay nửa vòng quanh trung điểm một cạnh, hình không chồng khít với chính nó.'},{t:'một đỉnh của hình bình hành',err:'Quay quanh một đỉnh, hình bị chuyển sang chỗ khác.'},{t:'hình bình hành không có tâm đối xứng',err:'Hình bình hành có tâm đối xứng là giao điểm hai đường chéo.'}],ans:0,exp:'Tâm đối xứng của hình bình hành là giao điểm của hai đường chéo.'});
const FB_TF=()=>({stem:'Xét các phát biểu sau:',items:[
  IT('Tâm đối xứng của hình chữ nhật là giao điểm hai đường chéo.',true,'hp','NB','Nhận xét trong SGK.'),
  IT('Hình tam giác đều có tâm đối xứng.',false,'hp','NB','Quay nửa vòng, tam giác đều bị lộn ngược, không chồng khít với chính nó.'),
  IT('Hình tròn có tâm đối xứng là tâm của hình tròn.',true,'hp','NB','Quay nửa vòng quanh tâm, hình tròn chồng khít với chính nó.'),
  IT('Hình thang cân có tâm đối xứng.',false,'hp','NB','Hai đáy dài khác nhau nên quay nửa vòng không chồng khít.')]});

/* ============ Nội dung, mức độ ============ */
const TOPICS={
  kn:{short:'Hình có tâm đối xứng',name:'Hình có tâm đối xứng trong thực tế',rule:'Một hình có tâm đối xứng nếu có một điểm O mà khi quay hình đó xung quanh điểm O đúng một nửa vòng thì hình thu được "chồng khít" với chính nó ở vị trí ban đầu (trước khi quay). Điểm O là tâm đối xứng của hình. Ví dụ: hình tròn, chong chóng hai cánh, chong chóng bốn cánh, chữ H, N, X.',tip:'Phải quay đúng nửa vòng (không phải gấp theo một đường thẳng). Chong chóng ba cánh quay nửa vòng không chồng khít nên không có tâm đối xứng.'},
  hp:{short:'Tâm của hình phẳng',name:'Tâm đối xứng của một số hình phẳng',rule:'Tâm đối xứng của hình bình hành, hình thoi, hình vuông, hình chữ nhật là giao điểm của hai đường chéo. Tâm đối xứng của hình lục giác đều là giao điểm của các đường chéo chính. Tâm đối xứng của hình tròn là tâm của hình tròn; của đoạn thẳng là trung điểm của đoạn thẳng. Hình tam giác đều, hình thang cân không có tâm đối xứng.',tip:'Quay nửa vòng quanh tâm, mỗi đỉnh trùng với đỉnh đối diện: tâm là trung điểm của mỗi đường chéo, nên OA = OC, OB = OD.'},
  ve:{short:'Quay nửa vòng trên lưới',name:'Quay nửa vòng quanh điểm O trên giấy kẻ ô',rule:'Trên giấy kẻ ô vuông, quay nửa vòng quanh điểm O thì mỗi ô (mỗi điểm) trùng với ô (điểm) ở phía đối diện qua O: đi từ ô đó đến O bao nhiêu ô sang ngang, bao nhiêu ô theo chiều dọc thì đi tiếp từ O đúng bấy nhiêu ô theo cùng hướng. Muốn hình nhận O là tâm đối xứng thì mỗi ô được tô phải có ô "trùng với nó khi quay nửa vòng" cũng được tô.',tip:'Quay nửa vòng đổi cả trái thành phải và trên thành dưới; đừng nhầm với gấp theo một đường thẳng (chỉ đổi một chiều).'},
  tt:{short:'Tâm và trục, cắt giấy',name:'Tâm đối xứng và trục đối xứng, cắt hình bằng giấy',rule:'Có hình vừa có tâm vừa có trục đối xứng (hình chữ nhật, hình vuông, hình thoi, hình tròn, chữ H, X), có hình chỉ có tâm (hình bình hành, chữ N, S, Z), có hình chỉ có trục (tam giác đều, hình thang cân, chữ A, T), có hình không có cả hai. Gấp đôi tờ giấy hai lần rồi cắt, mở ra được hình có hai trục là hai nếp gấp và có tâm là giao điểm của hai nếp gấp.',tip:'Xét riêng từng tính chất: quay nửa vòng để kiểm tra tâm, gấp theo đường thẳng để kiểm tra trục.'}
};
const TKEYS=['kn','hp','ve','tt'];
const TDESC={kn:'Quay nửa vòng, nhận ra hình, chữ cái, biển báo có tâm đối xứng',hp:'Tâm của hình bình hành, hình thoi, hình chữ nhật, hình vuông, lục giác đều, hình tròn, đoạn thẳng',ve:'Điểm, ô trùng nhau khi quay nửa vòng quanh O, tô thêm ô để có tâm đối xứng',tt:'So sánh tâm và trục đối xứng, gấp giấy hai lần để cắt hình'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhớ thế nào là hình có tâm đối xứng, nhận ra tâm đối xứng của các hình phẳng quen thuộc.',TH:'Kiểm tra một điểm có phải tâm đối xứng, quay nửa vòng trên lưới ô vuông, phân biệt tâm và trục đối xứng.',VD:'Hoàn thiện hình có tâm đối xứng rồi tính diện tích, chu vi, độ dài đường chéo, cắt giấy gấp hai lần.'};

/* ============ Dữ liệu dùng chung ============ */
const Cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const nameOf=k=>SH[k].n;
const NO_T=['tgd','tc','tgt','sao5','tim','dieu','mui','lc','ch3'];
const HAS_T=['tron','vuong','cn','thoi','lgd','bh','sao6','sao4','chong','thap','zz','ch2'];
const tWhyNo=k=>SH[k].n?`${Cap(SH[k].n)} không có tâm đối xứng: quay nửa vòng quanh điểm nào thì hình cũng không chồng khít với chính nó.`:(k==='ch3'?'Chong chóng ba cánh quay nửa vòng thì các cánh không trùng chỗ cũ, nên không có tâm đối xứng.':'Quay nửa vòng quanh điểm nào thì hình cũng không chồng khít với chính nó, nên không có tâm đối xứng.');
const tWhyYes=k=>SH[k].n?`${Cap(SH[k].n)} có tâm đối xứng.`:'Quay hình này nửa vòng quanh điểm chính giữa, hình chồng khít với chính nó: hình có tâm đối xứng.';
const LETALL=TAMC.concat(NOTAM);
const tLet=c=>letTam(c)?`Chữ ${c} có tâm đối xứng: quay nửa vòng quanh điểm chính giữa, chữ trùng với chính nó.`:`Chữ ${c} không có tâm đối xứng: quay nửa vòng, chữ bị lộn ngược, không trùng với chính nó.`;
/* chữ cái: trục (theo Bài 21) */
const axWord=c=>LET.hai.includes(c)?'có hai trục đối xứng':(LET.doc.includes(c)||LET.ngang.includes(c))?'có trục đối xứng':'không có trục đối xứng';
const bothLet=c=>`Chữ ${c} ${letTam(c)?'có':'không có'} tâm đối xứng và ${axWord(c)}.`;
/* hình: trục + tâm */
const bothWhy=k=>`${SH[k].n?Cap(SH[k].n):'Hình này'} ${TAM[k]?'có':'không có'} tâm đối xứng và ${SH[k].ax>0?'có '+(SH[k].ax===Infinity?'vô số':SH[k].ax)+' trục đối xứng':'không có trục đối xứng'}.`;
const LBH=(i,k)=>bothWhy(k).replace(/^Hình này/,'Hình '+LB[i]+')');

/* ---------- Hàng 4 hình ---------- */
function rowOddT(want){const one=sel(want?HAS_T:NO_T),rest=shuffle(want?NO_T:HAS_T.filter(k=>k!=='tron')).slice(0,3),keys=shuffle([one].concat(rest)),i=keys.indexOf(one);return {keys,i};}
function genKnCo(){return tryGen(()=>{const {keys,i}=rowOddT(true);
  return mk('Hình nào dưới đây có tâm đối xứng?','Hình '+LB[i]+')',keys.map((k,j)=>j===i?null:C('Hình '+LB[j]+')',tWhyNo(k))).filter(Boolean),tWhyYes(keys[i]).replace(/^Quay hình này/,'Quay hình '+LB[i]+')')+' Các hình còn lại quay nửa vòng không chồng khít với chính nó.',fb(figRow(keys)));});}
function genKnKhong(){return tryGen(()=>{const {keys,i}=rowOddT(false);
  return mk('Hình nào dưới đây không có tâm đối xứng?','Hình '+LB[i]+')',keys.map((k,j)=>j===i?null:C('Hình '+LB[j]+')',tWhyYes(k).replace(/^Quay hình này/,'Quay hình '+LB[j]+')'))).filter(Boolean),tWhyNo(keys[i])+' Các hình còn lại đều có tâm đối xứng.',fb(figRow(keys)));});}
function genLetCo(){return tryGen(()=>{const c=sel(TAMC),w=shuffle(NOTAM).slice(0,3),arr=shuffle([c].concat(w));
  return mk('Chữ cái in hoa nào dưới đây có tâm đối xứng?','Chữ '+c,w.map(x=>C('Chữ '+x,tLet(x))),tLet(c),fb(figLet(arr)));});}
function genLetKhong(){return tryGen(()=>{const c=sel(NOTAM),w=shuffle(TAMC).slice(0,3),arr=shuffle([c].concat(w));
  return mk('Chữ cái in hoa nào dưới đây không có tâm đối xứng?','Chữ '+c,w.map(x=>C('Chữ '+x,tLet(x))),tLet(c),fb(figLet(arr)));});}
/* Hàng 4 hình có đánh dấu điểm O */
const OPOS={ // [điểm, có phải tâm, lí do]
  tron:[[[50,50],true,'Tâm của hình tròn là tâm đối xứng.'],[[50,22],false,'Điểm này không phải tâm hình tròn: quay nửa vòng quanh nó, hình tròn bị dời đi chỗ khác.']],
  vuong:[[[50,50],true,'Giao điểm hai đường chéo của hình vuông là tâm đối xứng.'],[[50,18],false,'Trung điểm một cạnh không phải tâm đối xứng của hình vuông.']],
  cn:[[[50,50],true,'Giao điểm hai đường chéo của hình chữ nhật là tâm đối xứng.'],[[30,50],false,'Điểm này không phải giao điểm hai đường chéo: quay nửa vòng quanh nó, hình chữ nhật bị dời sang bên trái.']],
  thoi:[[[50,50],true,'Giao điểm hai đường chéo của hình thoi là tâm đối xứng.'],[[50,30],false,'Điểm này nằm trên một đường chéo nhưng không phải trung điểm: không phải tâm đối xứng.']],
  bh:[[[50,51],true,'Giao điểm hai đường chéo của hình bình hành là tâm đối xứng.'],[[36,74],false,'Trung điểm một cạnh không phải tâm đối xứng của hình bình hành.']],
  lgd:[[[50,50],true,'Giao điểm các đường chéo chính của hình lục giác đều là tâm đối xứng.'],[[70,50],false,'Điểm này không phải giao điểm các đường chéo chính.']],
  tgd:[[[50,61],false,'Tam giác đều không có tâm đối xứng: quay nửa vòng quanh điểm chính giữa, tam giác bị lộn ngược.']],
  tc:[[[50,52],false,'Hình thang cân không có tâm đối xứng: hai đáy dài khác nhau nên quay nửa vòng không chồng khít.']]
};
function oRow(want){const good=[],bad=[];Object.keys(OPOS).forEach(k=>OPOS[k].forEach(x=>(x[1]?good:bad).push([k,x])));
  const one=sel(want?good:bad),rest=[];for(const x of shuffle(want?bad:good)){if(rest.length<3&&x[0]!==one[0]&&!rest.some(r=>r[0]===x[0]))rest.push(x);}
  const all=shuffle([one].concat(rest));return {all,i:all.indexOf(one)};}
function figRowO(all,alt){const keys=all.map(x=>x[0]),W=104*keys.length;
  let s=keys.map((k,i)=>{const [p]=all[i][1];return shapeG(k,i*104+2,`<circle class="po" data-o="${p[0]},${p[1]}" cx="${p[0]}" cy="${p[1]}" r="3.6"/><text class="vl sm" x="${p[0]+5}" y="${p[1]-5}">O</text>`);}).join('');
  s+=keys.map((k,i)=>`<text class="vl" x="${i*104+54}" y="118" text-anchor="middle">${LB[i]})</text>`).join('');
  return `<svg class="fig" viewBox="-2 -2 ${W+4} 126" role="img" aria-label="${alt||'Bốn hình, mỗi hình có đánh dấu một điểm O'}">${s}</svg>`;}
function genKnPoint(){return tryGen(()=>{const {all,i}=oRow(true);
  return mk('Trong hình nào dưới đây, điểm O là tâm đối xứng của hình?','Hình '+LB[i]+')',all.map((x,j)=>j===i?null:C('Hình '+LB[j]+')',x[1][2])).filter(Boolean),all[i][1][2],fb(figRowO(all)));});}
function genKnPointNot(){return tryGen(()=>{const {all,i}=oRow(false);
  return mk('Trong hình nào dưới đây, điểm O không phải là tâm đối xứng của hình?','Hình '+LB[i]+')',all.map((x,j)=>j===i?null:C('Hình '+LB[j]+')',x[1][2])).filter(Boolean),all[i][1][2],fb(figRowO(all)));});}
function countRowT(){const n=ri(1,4),keys=shuffle(shuffle(HAS_T).slice(0,n).concat(shuffle(NO_T).slice(0,4-n)));return {keys,n:keys.filter(k=>TAM[k]).length};}
const cntExpT=keys=>keys.map((k,j)=>`Hình ${LB[j]}) ${TAM[k]?'có':'không có'} tâm đối xứng`).join('; ')+'.';
function genKnDem(){return tryGen(()=>{const {keys,n}=countRowT();
  return mk('Trong bốn hình dưới đây, có bao nhiêu hình có tâm đối xứng?',n+' hình',[1,2,3,4].filter(x=>x!==n).map(x=>C(x+' hình',x>n?'Có hình đếm thừa: hình không có tâm đối xứng thì quay nửa vòng không chồng khít.':'Còn sót hình có tâm đối xứng; hãy thử quay từng hình nửa vòng quanh điểm chính giữa.')),cntExpT(keys)+` Vậy có ${n} hình.`,fb(figRow(keys)));});}
/* ---------- Tâm của hình phẳng ---------- */
function genHpKhongNB(){return tryGen(()=>{const r=sel(['tgd','tc']),w=shuffle(['vuong','cn','thoi','tron','bh','lgd']).slice(0,3);
  return mk('Hình nào dưới đây không có tâm đối xứng?',Cap(nameOf(r)),w.map(k=>C(Cap(nameOf(k)),`${Cap(nameOf(k))} có tâm đối xứng (${k==='tron'?'tâm của hình tròn':k==='lgd'?'giao điểm các đường chéo chính':'giao điểm hai đường chéo'}).`)),tWhyNo(r));});}
const QD={bh:'hình bình hành',thoi:'hình thoi',cn:'hình chữ nhật',vuong:'hình vuông'};
function genHpTam(){return tryGen(()=>{const k=sel(Object.keys(QD)),n=sel(['ABCD','MNPQ','EFGH']),[A,B,Cc,D]=n.split('');
  return mk(`Tâm đối xứng của ${QD[k]} ${n} là:`,`giao điểm của hai đường chéo ${A}${Cc} và ${B}${D}`,[C(`trung điểm của cạnh ${A}${B}`,'Quay nửa vòng quanh trung điểm một cạnh, hình bị dời đi, không chồng khít với chính nó.'),C(`đỉnh ${A}`,'Quay nửa vòng quanh một đỉnh, hình bị dời sang phía bên kia đỉnh.'),C(`${Cap(QD[k])} ${n} không có tâm đối xứng`,`Tâm đối xứng của ${QD[k]} là giao điểm hai đường chéo.`)],`Tâm đối xứng của hình bình hành, hình thoi, hình vuông, hình chữ nhật là giao điểm của hai đường chéo, ở đây là giao điểm của ${A}${Cc} và ${B}${D}.`);});}
function bhData(){const k=sel(Object.keys(QD)),a=ri(2,9),b=k==='cn'||k==='vuong'?a:ri(2,9);return {k,a,b,n:sel(['ABCD','MNPQ'])};}
function genHpDoan(){return tryGen(()=>{const o=bhData(),[A,B,Cc,D]=o.n.split(''),S=2*o.a+2*o.b;
  return mk(`${Cap(QD[o.k])} ${o.n} có tâm đối xứng O. Biết O${A} = ${o.a} cm${o.k==='cn'||o.k==='vuong'?'':`, O${B} = ${o.b} cm`}. Tổng độ dài hai đường chéo ${A}${Cc} + ${B}${D} bằng:`,S+' cm',[C((o.a+o.b)+' cm',`Quay nửa vòng quanh O, ${A} trùng ${Cc} nên O${Cc} = O${A}: đường chéo ${A}${Cc} dài gấp đôi O${A}.`),C(2*o.a+' cm',`Đây mới là độ dài một đường chéo ${A}${Cc}.`),C((S+2)+' cm','Tính lại: mỗi đường chéo dài gấp đôi đoạn từ O đến một đầu mút.')],`O là tâm đối xứng nên quay nửa vòng quanh O thì ${A} trùng ${Cc}, ${B} trùng ${D}: O${Cc} = O${A} = ${o.a} cm, O${D} = O${B} = ${o.b} cm${o.k==='cn'||o.k==='vuong'?' (hai đường chéo của '+QD[o.k]+' bằng nhau)':''}. ${A}${Cc} + ${B}${D} = ${2*o.a} + ${2*o.b} = ${S} (cm).`);});}
/* ---------- Quay nửa vòng trên lưới ---------- */
function quayData(){for(;;){const W=8,H=6,O={x:4,y:3},A=[ri(0,3),ri(0,H-1)],M=rot(O,A);
  const w1=[2*O.x-1-A[0],A[1]],w2=[A[0],2*O.y-1-A[1]],w3=[M[0]+sel([-1,1]),M[1]];
  const all=[M,w1,w2,w3],ok=p=>p[0]>=0&&p[0]<W&&p[1]>=0&&p[1]<H;if(!all.every(ok)||new Set(all.map(key).concat([key(A)])).size<5)continue;
  const L=shuffle(['M','N','P','Q']),pts=[{x:A[0],y:A[1],l:'A'}].concat(all.map((p,i)=>({x:p[0],y:p[1],l:L[i]})));
  return {W,H,O,A,M,L,pts,fig:fb(figGrid({W,H,O,pts,alt:'Lưới ô vuông có điểm O, điểm A và bốn điểm M, N, P, Q'}))};}}
function genVeQuay(){return tryGen(()=>{const o=quayData(),dx=o.O.x-o.A[0],dy=o.O.y-o.A[1];
  return mk('Quay tờ giấy kẻ ô nửa vòng quanh điểm O. Điểm A trùng với điểm nào?','Điểm '+o.L[0],[C('Điểm '+o.L[1],'Điểm này có được khi gấp theo đường thẳng đứng đi qua O, không phải khi quay nửa vòng: quay nửa vòng đổi cả trái – phải lẫn trên – dưới.'),C('Điểm '+o.L[2],'Điểm này có được khi gấp theo đường nằm ngang đi qua O; quay nửa vòng còn đổi cả bên trái sang bên phải.'),C('Điểm '+o.L[3],'Lệch một ô: điểm trùng với A phải cách O một khoảng như A, ở phía đối diện.')],`A ở bên trái O và ${dy>0?'phía trên':'phía dưới'} O. Quay nửa vòng, A chuyển sang phía đối diện qua O: sang phải bao nhiêu ô, ${dy>0?'xuống dưới':'lên trên'} bấy nhiêu ô như từ A đến O. Đó là điểm ${o.L[0]}.`,o.fig);});}
function toTData(mixed){for(;;){const W=8,H=6,O={x:4,y:3},f=c=>rot(O,c),S=new Map();
  let p=mixed?ri(1,3):0,g=0;while(p>0&&g++<50){const c=[ri(0,7),ri(0,5)],m=f(c);if(!S.has(key(c))&&!S.has(key(m))&&key(c)!==key(m)){S.set(key(c),c);S.set(key(m),m);p--;}}
  const n=ri(3,6);let s=0;g=0;while(s<n&&g++<80){const c=mixed?[ri(0,7),ri(0,5)]:[ri(0,3),ri(0,5)],m=f(c);if(!S.has(key(c))&&!S.has(key(m))){S.set(key(c),c);s++;}}
  const cells=[...S.values()],need=needT(cells,[f]);if(need<2)continue;
  return {W,H,O,cells,need,total:cells.length,fig:fb(figGrid({W,H,O,cells,alt:`Lưới ô vuông có ${cells.length} ô được tô và điểm O`}))};}}
const toTExp=o=>`Với mỗi ô đã tô, tìm ô trùng với nó khi quay nửa vòng quanh O (phía đối diện qua O). Có ${o.need} ô như vậy chưa được tô${o.total>o.need?' (các ô còn lại đã có ô tương ứng được tô)':''}, nên cần tô thêm ít nhất ${o.need} ô.`;
function genVeTo(mixed){return ()=>tryGen(()=>{const o=toTData(mixed),n=o.need;
  return mk('Cần tô thêm ít nhất bao nhiêu ô vuông để hình gồm các ô được tô nhận điểm O là tâm đối xứng?',String(n),[C(String(o.total),'Đây là số ô đã tô. Chỉ cần tô các ô chưa có ô tương ứng qua O.'),C(String(n+o.total),'Đây là số ô của cả hình sau khi tô thêm.'),C(String(n-1),'Còn sót: mỗi ô đã tô chưa có ô tương ứng qua O đều cần thêm một ô.'),C(String(n+1),'Đếm thừa: ô đã có ô tương ứng được tô thì không cần tô thêm.')],toTExp(o),o.fig);});}
const genVeTo1=genVeTo(false),genVeTo2=genVeTo(true);
function halfTData(){for(;;){const n=ri(4,7),O={x:4,y:3},S=new Set(),c=[];const add=(x,y)=>{if(x<0||x>=4||y<0||y>=6||S.has(x+','+y))return false;S.add(x+','+y);c.push([x,y]);return true;};
  add(3,sel([2,3]));let t=0;while(c.length<n&&t++<400){const [x,y]=sel(c),[a,b]=sel([[1,0],[-1,0],[0,1],[0,-1]]);add(x+a,y+b);}if(c.length!==n)continue;
  const full=c.concat(c.map(q=>rot(O,q))),F=new Set(full.map(key));if(F.size!==2*n)continue;const P=perim(full),Ph=perim(c);
  return {n,O,half:c,full,P,Ph,fig:fb(figGrid({W:8,H:6,O,cells:c,alt:`Một nửa của hình gồm ${n} ô vuông nằm bên trái điểm O`}))};}}
const HTSTEM='Trên giấy kẻ ô vuông cạnh 1 cm, bạn Lan đã tô một phần của một hình (các ô màu, nằm bên trái điểm O). Lan tô thêm phần còn lại để được hình nhận O là tâm đối xứng, mỗi ô đã tô có đúng một ô tương ứng qua O.';
function genVeDt(){return tryGen(()=>{const o=halfTData(),A=2*o.n;
  return mk(HTSTEM+' Diện tích của cả hình là:',A+' cm²',[C(o.n+' cm²','Đây mới là diện tích phần đã tô.'),C(4*o.n+' cm²','Chỉ cần nhân đôi một lần: phần còn lại có số ô bằng phần đã tô.'),C((A+2)+' cm²','Mỗi ô đã tô chỉ có đúng một ô tương ứng qua O, nên số ô gấp đôi.')],`Phần đã tô có ${o.n} ô, phần thêm có ${o.n} ô: ${o.n} · 2 = ${A} (cm²).`,o.fig);});}
const cvTExp=o=>`Vẽ đủ cả hình (mỗi ô quay nửa vòng quanh O sang phía đối diện) rồi đếm các cạnh ô nằm ở biên: ${o.P} cạnh, mỗi cạnh 1 cm, nên chu vi là ${o.P} cm.`;
function genVeCv(){return tryGen(()=>{const o=halfTData();
  return mk(HTSTEM+' Chu vi của cả hình là:',o.P+' cm',[C(2*o.Ph+' cm','Chu vi cả hình không bằng 2 lần chu vi phần đã tô: có cạnh của hai phần chạm nhau, không còn ở biên.'),C(o.Ph+' cm','Đây là chu vi phần đã tô.'),C((o.P+2)+' cm','Đếm sai số cạnh ở biên; hãy vẽ đủ cả hình rồi đếm lại.')],cvTExp(o),o.fig);});}
/* ---------- Tâm và trục (kết hợp Bài 21) ---------- */
const BOTH=['tron','vuong','cn','thoi','lgd','sao6','sao4','thap'],ONLYT=['bh','chong','zz','ch2'],ONLYA=['tgd','tc','sao5','tim','dieu','mui'],NONE=['tgt','lc','ch3'];
function genTtCa(){return tryGen(()=>{const one=sel(BOTH),rest=[sel(ONLYT),sel(ONLYA),sel(ONLYT.concat(ONLYA,NONE))];if(new Set(rest).size<3)return null;const keys=shuffle([one].concat(rest)),i=keys.indexOf(one);
  return mk('Hình nào dưới đây vừa có tâm đối xứng vừa có trục đối xứng?','Hình '+LB[i]+')',keys.map((k,j)=>j===i?null:C('Hình '+LB[j]+')',LBH(j,k))).filter(Boolean),LBH(i,one),fb(figRow(keys)));});}
function genTtChiTam(){return tryGen(()=>{const one=sel(ONLYT),rest=shuffle([sel(BOTH),sel(ONLYA),sel(ONLYA.concat(NONE))]);if(new Set(rest).size<3)return null;const keys=shuffle([one].concat(rest)),i=keys.indexOf(one);
  return mk('Hình nào dưới đây có tâm đối xứng nhưng không có trục đối xứng?','Hình '+LB[i]+')',keys.map((k,j)=>j===i?null:C('Hình '+LB[j]+')',LBH(j,k))).filter(Boolean),LBH(i,one),fb(figRow(keys)));});}
const LONLYT=['N','S','Z'],LBOTH=['H','I','O','X'],LONLYA=['A','M','T','U','V','W','Y','B','C','D','E'];
function genLetTt(){return tryGen(()=>{const c=sel(LONLYT),w=[sel(LBOTH),sel(LONLYA),sel(LONLYA.concat(['F','G','J','L','P','Q','R']))];if(new Set(w).size<3)return null;
  return mk('Chữ cái in hoa nào dưới đây có tâm đối xứng nhưng không có trục đối xứng?','Chữ '+c,w.map(x=>C('Chữ '+x,bothLet(x))),bothLet(c),fb(figLet(shuffle([c].concat(w)))));});}
function bothRow(){const n=ri(1,3),keys=shuffle(shuffle(BOTH).slice(0,n).concat(shuffle(ONLYT.concat(ONLYA,NONE)).slice(0,4-n)));return {keys,n:keys.filter(k=>TAM[k]&&SH[k].ax>0).length};}
function genTtDem(){return tryGen(()=>{const {keys,n}=bothRow();
  return mk('Trong bốn hình dưới đây, có bao nhiêu hình vừa có tâm đối xứng vừa có trục đối xứng?',n+' hình',[0,1,2,3,4].filter(x=>x!==n).slice(0,3).map(x=>C(x+' hình','Xét riêng từng hình: quay nửa vòng để kiểm tra tâm, gấp theo đường thẳng để kiểm tra trục; chỉ đếm hình có cả hai.')),keys.map((k,j)=>LBH(j,k)).join(' ')+` Có ${n} hình có cả hai.`,fb(figRow(keys)));});}
const MC=[
 {id:'m_dn',topic:'kn',level:'NB',stem:'Điểm O là tâm đối xứng của một hình nếu:',ans:0,opts:[
  {t:'quay hình đó xung quanh O đúng một nửa vòng thì hình thu được chồng khít với chính nó ở vị trí ban đầu'},
  {t:'quay hình đó xung quanh O đúng một vòng thì hình trở về vị trí ban đầu',err:'Hình nào quay đủ một vòng cũng trở về chỗ cũ; tâm đối xứng xét khi quay đúng nửa vòng.'},
  {t:'gấp hình theo một đường thẳng đi qua O thì hai phần chồng khít',err:'Gấp theo đường thẳng là cách kiểm tra trục đối xứng (Bài 21), không phải tâm đối xứng.'},
  {t:'O là một đỉnh của hình',err:'Tâm đối xứng là điểm mà quay nửa vòng quanh nó hình chồng khít với chính nó, thường nằm ở chính giữa hình.'}],
  exp:'Hình có tâm đối xứng: có điểm O mà khi quay hình quanh O đúng một nửa vòng thì hình thu được chồng khít với chính nó ở vị trí ban đầu. O là tâm đối xứng.'},
 {id:'m_doan',topic:'hp',level:'NB',stem:'Đoạn thẳng AB là một hình có tâm đối xứng. Tâm đối xứng của nó là:',ans:0,opts:[
  {t:'trung điểm của đoạn thẳng AB'},{t:'điểm A',err:'Quay nửa vòng quanh A, điểm B chuyển sang phía bên kia A: đoạn thẳng bị dời đi.'},
  {t:'một điểm bất kì nằm trên đoạn thẳng AB',err:'Chỉ khi quay quanh trung điểm, A mới trùng B và B trùng A.'},{t:'đoạn thẳng không có tâm đối xứng',err:'Quay nửa vòng quanh trung điểm, A trùng B và B trùng A: đoạn thẳng có tâm đối xứng.'}],
  exp:'Quay nửa vòng quanh trung điểm của AB thì A trùng B, B trùng A: trung điểm là tâm đối xứng của đoạn thẳng AB (Luyện tập 1, SGK).'},
 {id:'m_hbh',topic:'hp',level:'NB',stem:'Tâm đối xứng của hình bình hành là:',ans:0,opts:[
  {t:'giao điểm của hai đường chéo'},{t:'trung điểm của một cạnh',err:'Quay nửa vòng quanh trung điểm một cạnh, hình bình hành bị dời đi.'},
  {t:'một đỉnh của hình bình hành',err:'Quay quanh một đỉnh, hình bị chuyển sang phía bên kia đỉnh.'},{t:'hình bình hành không có tâm đối xứng',err:'Hình bình hành không có trục đối xứng nhưng có tâm đối xứng (HĐ3, SGK).'}],
  exp:'Tâm đối xứng của hình bình hành, hình thoi, hình vuông, hình chữ nhật là giao điểm của hai đường chéo.'},
 {id:'m_lgd',topic:'hp',level:'NB',stem:'Tâm đối xứng của hình lục giác đều là:',ans:0,opts:[
  {t:'giao điểm của các đường chéo chính'},{t:'một đỉnh của hình lục giác đều',err:'Quay quanh một đỉnh, hình bị dời đi chỗ khác.'},
  {t:'trung điểm của một cạnh',err:'Quay quanh trung điểm một cạnh, hình bị dời đi.'},{t:'hình lục giác đều không có tâm đối xứng',err:'Quay nửa vòng quanh giao điểm các đường chéo chính, lục giác đều chồng khít với chính nó.'}],
  exp:'Tâm đối xứng của hình lục giác đều là giao điểm của các đường chéo chính.'},
 {id:'m_tron',topic:'hp',level:'NB',stem:'Tâm đối xứng của hình tròn là:',ans:0,opts:[
  {t:'tâm của hình tròn'},{t:'một điểm bất kì trên đường tròn',err:'Quay quanh một điểm trên đường tròn, hình tròn bị dời sang phía bên kia.'},
  {t:'mọi điểm nằm trong hình tròn',err:'Chỉ quay quanh tâm thì hình tròn mới chồng khít với chính nó; hình tròn có đúng một tâm đối xứng.'},{t:'hình tròn không có tâm đối xứng',err:'Hình tròn là ví dụ đầu tiên của hình có tâm đối xứng (HĐ2, SGK).'}],
  exp:'Quay hình tròn nửa vòng quanh tâm, hình chồng khít với chính nó: tâm của hình tròn là tâm đối xứng.'},
 {id:'m_gap',topic:'tt',level:'VD',mix:[21],stem:'Gấp đôi một tờ giấy hình vuông hai lần (lần sau gấp đôi tiếp tờ giấy đã gấp) như ở Thực hành 1 của SGK, cắt theo một nét vẽ rồi mở ra. Gọi O là giao điểm của hai nếp gấp. Khẳng định nào chắc chắn đúng?',ans:0,opts:[
  {t:'Hình nhận được có tâm đối xứng là O và có hai trục đối xứng là hai nếp gấp'},
  {t:'Hình nhận được chỉ có một trục đối xứng',err:'Mỗi nếp gấp đều là một trục đối xứng, nên có ít nhất hai trục.'},
  {t:'Hình nhận được không có tâm đối xứng',err:'Bốn phần cắt cùng lúc; quay nửa vòng quanh O, mỗi phần trùng với phần đối diện, nên O là tâm đối xứng.'},
  {t:'Hình nhận được có vô số trục đối xứng',err:'Chỉ chắc chắn có hai trục là hai nếp gấp; hình như bông hoa bốn cánh không có vô số trục.'}],
  exp:'Bốn lớp giấy được cắt cùng lúc nên hình mở ra nhận mỗi nếp gấp làm trục đối xứng (Bài 21). Gấp theo nếp thứ nhất rồi theo nếp thứ hai cũng như quay nửa vòng quanh O, nên O là tâm đối xứng.'}
].map(q=>Object.assign({type:'mc'},q));
const addMC=(id,topic,level,gen,mix)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},mix?{mix}:{}));
const rep=(n,f)=>[...Array(n).keys()].map(i=>f('abcdef'[i]));
rep(3,x=>addMC('g_knco_'+x,'kn','NB',genKnCo));
rep(2,x=>addMC('g_knkhong_'+x,'kn','NB',genKnKhong));
rep(2,x=>addMC('g_letco_'+x,'kn','NB',genLetCo));
rep(1,x=>addMC('g_letkhong_'+x,'kn','NB',genLetKhong));
rep(1,x=>addMC('g_hpkhong_'+x,'hp','NB',genHpKhongNB));
rep(2,x=>addMC('g_knpoint_'+x,'kn','TH',genKnPoint));
rep(1,x=>addMC('g_knpointnot_'+x,'kn','TH',genKnPointNot));
rep(1,x=>addMC('g_kndem_'+x,'kn','TH',genKnDem));
rep(2,x=>addMC('g_hptam_'+x,'hp','TH',genHpTam));
rep(2,x=>addMC('g_vequay_'+x,'ve','TH',genVeQuay));
rep(1,x=>addMC('g_veto_'+x,'ve','TH',genVeTo1));
rep(1,x=>addMC('g_ttca_'+x,'tt','TH',genTtCa,[21]));
rep(1,x=>addMC('g_ttchitam_'+x,'tt','TH',genTtChiTam,[21]));
rep(1,x=>addMC('g_lettt_'+x,'tt','TH',genLetTt,[21]));
rep(2,x=>addMC('g_hpdoan_'+x,'hp','VD',genHpDoan));
rep(2,x=>addMC('g_veto2_'+x,'ve','VD',genVeTo2));
rep(1,x=>addMC('g_vedt_'+x,'ve','VD',genVeDt));
rep(1,x=>addMC('g_vecv_'+x,'ve','VD',genVeCv));
rep(1,x=>addMC('g_ttdem_'+x,'tt','VD',genTtDem,[21]));

/* ============ Đúng sai ============ */
function pick4(Ts,Fs){const nT=ri(1,3);return shuffle(shuffle(Ts).slice(0,nT).concat(shuffle(Fs).slice(0,4-nT)));}
const call=a=>a.map(f=>typeof f==='function'?f():f);
function four(make){return ()=>{for(let n=0;n<80;n++){const items=make();if(items.every(Boolean)&&tfOK(items))return {stem:'Xét các phát biểu sau:',items};}return FB_TF();};}
const tfNB=(Ts,Fs)=>four(()=>call(pick4(Ts,Fs)));
const KN_T=[IT('Nếu quay một hình nửa vòng quanh tâm đối xứng của nó thì hình thu được chồng khít với chính nó ở vị trí ban đầu.',true,'kn','NB','Đó là tính chất của tâm đối xứng.'),
  IT('Chong chóng bốn cánh (như hình trong SGK) có tâm đối xứng.',true,'kn','NB','Quay nửa vòng, mỗi cánh trùng với cánh đối diện.'),
  ()=>{const c=sel(TAMC);return IT(`Chữ cái in hoa ${c} có tâm đối xứng.`,true,'kn','NB',tLet(c));}];
const KN_F=[IT('Chong chóng ba cánh (như hình trong SGK) có tâm đối xứng.',false,'kn','NB','Quay nửa vòng, các cánh của chong chóng ba cánh không trùng chỗ cũ.'),
  IT('Mọi hình quay một vòng quanh một điểm đều có tâm đối xứng.',false,'kn','NB','Quay đủ một vòng thì hình nào cũng trở về chỗ cũ; tâm đối xứng xét khi quay đúng nửa vòng.'),
  ()=>{const c=sel(NOTAM);return IT(`Chữ cái in hoa ${c} có tâm đối xứng.`,false,'kn','NB',tLet(c));}];
const HP_T=[IT('Tâm đối xứng của hình bình hành là giao điểm của hai đường chéo.',true,'hp','NB','Nhận xét trong SGK.'),
  IT('Tâm đối xứng của hình chữ nhật là giao điểm của hai đường chéo.',true,'hp','NB','Nhận xét trong SGK.'),
  IT('Tâm đối xứng của hình lục giác đều là giao điểm của các đường chéo chính.',true,'hp','NB','Nhận xét trong SGK.'),
  IT('Tâm đối xứng của đoạn thẳng là trung điểm của đoạn thẳng đó.',true,'hp','NB','Quay nửa vòng quanh trung điểm, hai đầu mút đổi chỗ cho nhau.'),
  IT('Tâm đối xứng của hình tròn là tâm của hình tròn.',true,'hp','NB','Quay nửa vòng quanh tâm, hình tròn chồng khít với chính nó.')];
const HP_F=[IT('Hình tam giác đều có tâm đối xứng.',false,'hp','NB','Quay nửa vòng, tam giác đều bị lộn ngược nên không có tâm đối xứng.'),
  IT('Hình bình hành không có tâm đối xứng.',false,'hp','NB','Hình bình hành có tâm đối xứng là giao điểm hai đường chéo.'),
  IT('Hình tròn có vô số tâm đối xứng.',false,'hp','NB','Hình tròn có vô số trục đối xứng nhưng chỉ có một tâm đối xứng là tâm của nó.'),
  IT('Tâm đối xứng của hình thoi là một đỉnh của hình thoi.',false,'hp','NB','Tâm đối xứng của hình thoi là giao điểm hai đường chéo.'),
  IT('Hình thang cân có tâm đối xứng.',false,'hp','NB','Hai đáy dài khác nhau nên quay nửa vòng không chồng khít.')];
/* Thông hiểu: tâm và trục (kết hợp Bài 21) */
const HPT_T=[IT('Hình bình hành có tâm đối xứng nhưng không có trục đối xứng.',true,'hp','TH','Bài 21: hình bình hành không có trục; Bài 22: có tâm là giao điểm hai đường chéo.'),
  IT('Hình tam giác đều có trục đối xứng nhưng không có tâm đối xứng.',true,'hp','TH','Tam giác đều có 3 trục nhưng quay nửa vòng thì bị lộn ngược.'),
  IT('Hình chữ nhật vừa có tâm đối xứng vừa có trục đối xứng.',true,'hp','TH','Hình chữ nhật có 2 trục và có tâm là giao điểm hai đường chéo.'),
  IT('Hình thang cân có trục đối xứng nhưng không có tâm đối xứng.',true,'hp','TH','Hình thang cân có 1 trục, không có tâm.')];
const HPT_F=[IT('Hình nào có tâm đối xứng thì cũng có trục đối xứng.',false,'hp','TH','Hình bình hành có tâm nhưng không có trục.'),
  IT('Hình nào có trục đối xứng thì cũng có tâm đối xứng.',false,'hp','TH','Tam giác đều có trục nhưng không có tâm.'),
  IT('Hình thoi có trục đối xứng nhưng không có tâm đối xứng.',false,'hp','TH','Hình thoi có tâm là giao điểm hai đường chéo.'),
  IT('Hình lục giác đều có trục đối xứng nhưng không có tâm đối xứng.',false,'hp','TH','Hình lục giác đều có tâm là giao điểm các đường chéo chính.')];
const KNT_T=[()=>{const c=sel(LONLYT);return IT(`Chữ cái in hoa ${c} có tâm đối xứng nhưng không có trục đối xứng.`,true,'kn','TH',bothLet(c));},
  ()=>{const c=sel(LBOTH);return IT(`Chữ cái in hoa ${c} vừa có tâm đối xứng vừa có trục đối xứng.`,true,'kn','TH',bothLet(c));},
  ()=>{const c=sel(['A','M','T','U','V','W','Y']);return IT(`Chữ cái in hoa ${c} có trục đối xứng nhưng không có tâm đối xứng.`,true,'kn','TH',bothLet(c));}];
const KNT_F=[()=>{const c=sel(['A','M','T','U','V','W','Y']);return IT(`Chữ cái in hoa ${c} có tâm đối xứng.`,false,'kn','TH',bothLet(c));},
  ()=>{const c=sel(LONLYT);return IT(`Chữ cái in hoa ${c} có trục đối xứng.`,false,'kn','TH',bothLet(c));},
  ()=>{const c=sel(['B','C','D','E']);return IT(`Chữ cái in hoa ${c} vừa có tâm đối xứng vừa có trục đối xứng.`,false,'kn','TH',bothLet(c));}];
/* Lưới: quay nửa vòng */
function tfGridT(){
  for(let n=0;n<60;n++){const o=toTData(false),f=c=>rot(o.O,c),S=new Set(o.cells.map(key));const free=[];
    for(let x=0;x<4;x++)for(let y=0;y<6;y++){const c=[x,y];if(!S.has(key(c))&&!S.has(key(f(c))))free.push(c);}
    if(!free.length)continue;const A=sel(free),M=f(A),Wr=[2*o.O.x-1-A[0],A[1]];if(S.has(key(Wr))||key(Wr)===key(M))continue;
    const L=shuffle(['M','N']),v=[0,1,2].map(()=>RNG()<.5);
    const fig=fb(figGrid({W:o.W,H:o.H,O:o.O,cells:o.cells,pts:[{x:A[0],y:A[1],l:'A'},{x:M[0],y:M[1],l:L[0]},{x:Wr[0],y:Wr[1],l:L[1]}],alt:'Lưới ô vuông có các ô được tô, điểm O và ba điểm A, M, N'}));
    const nShow=v[1]?o.need:o.need+sel([-1,1]),mShow=v[2]?o.total+o.need:o.total+o.need+sel([-2,2]);
    const items=[IT(`Quay nửa vòng quanh O, điểm A trùng với điểm ${v[0]?L[0]:L[1]}.`,v[0],'ve','TH',`A trùng với điểm ở phía đối diện qua O: điểm ${L[0]}. Điểm ${L[1]} có được khi gấp theo đường thẳng đứng qua O, không phải khi quay.`),
      IT(`Cần tô thêm đúng ${nShow} ô thì hình gồm các ô được tô nhận O là tâm đối xứng.`,v[1],'ve','TH',toTExp(o)),
      IT(`Sau khi tô thêm ít nhất số ô cần thiết, hình có tất cả ${mShow} ô.`,v[2],'ve','TH',`Có ${o.total} ô đã tô, tô thêm ${o.need} ô: ${o.total} + ${o.need} = ${o.total+o.need} (ô).`),
      IT(`Nếu chỉ tô thêm ${o.need-1} ô thì hình đã có thể nhận O là tâm đối xứng.`,false,'ve','TH',`Cần ít nhất ${o.need} ô.`)];
    if(tfOK(items))return {stem:'Quan sát hình vẽ trên giấy kẻ ô vuông. Xét các phát biểu sau:',fig,items};}
  return FB_TF();}
/* Vận dụng */
function ttVdItems(){const v=[0,1,2,3].map(()=>RNG()<.5),o=bhData(),[A,B,Cc,D]=o.n.split(''),ks=shuffle(BOTH.concat(ONLYT,ONLYA,NONE)).slice(0,4),nb2=ks.filter(k=>TAM[k]&&SH[k].ax>0).length;
  return [IT(`${Cap(QD[o.k])} ${o.n} có tâm đối xứng O, O${A} = ${o.a} cm. Khi đó ${A}${Cc} = ${v[0]?2*o.a:o.a+1} cm.`,v[0],'hp','VD',`Quay nửa vòng quanh O, ${A} trùng ${Cc} nên O${Cc} = O${A} = ${o.a} cm, ${A}${Cc} = ${2*o.a} cm.`),
    IT(`Hình gồm một hình vuông và một hình tròn có cùng tâm ${v[1]?'vừa có tâm đối xứng vừa có trục đối xứng':'có trục đối xứng nhưng không có tâm đối xứng'}.`,v[1],'tt','VD','Quay nửa vòng quanh tâm chung, cả hai hình đều chồng khít; hai hình cũng có chung 4 trục của hình vuông.'),
    IT(`Hình gồm một hình tam giác đều và một hình tròn có cùng tâm (tâm của hình tròn trùng với điểm chính giữa của tam giác) ${v[2]?'không có':'có'} tâm đối xứng.`,v[2],'tt','VD','Quay nửa vòng, hình tròn chồng khít nhưng tam giác đều bị lộn ngược, nên cả hình không có tâm đối xứng.'),
    IT(`Hình chữ nhật, hình thoi, hình vuông và hình bình hành đều có tâm đối xứng, nhưng chỉ ${v[3]?'ba':'hai'} hình trong số đó có trục đối xứng.`,v[3],'tt','VD','Hình chữ nhật, hình thoi, hình vuông có trục; hình bình hành không có trục. Có ba hình có trục.')];}
/* Tình huống: cắt giấy gấp hai lần */
function hoaData(){for(;;){const a=ri(2,6),b=ri(2,6);if(a===b)continue;return {a,b,W:2*a,H:2*b,P:2*(2*a+2*b),S:4*a*b};}}
function ctxHoa(){const o=hoaData(),v=[0,1,2].map(()=>RNG()<.5);
  return {stem:`Bạn Hà gấp đôi tờ giấy hai lần như ở Thực hành 1 (SGK) để được 4 lớp giấy, góc có hai nếp gấp gọi là O. Hà cắt một hình chữ nhật có một đỉnh ở O, hai cạnh nằm trên hai nếp gấp, dài ${o.a} cm và ${o.b} cm, rồi mở ra.`,items:[
    IT(`Mở ra được hình chữ nhật có hai cạnh là ${v[0]?o.W:o.a} cm và ${v[0]?o.H:o.b} cm.`,v[0],'tt','VD',`Mỗi cạnh nằm trên một nếp gấp được nhân đôi khi mở: ${o.a} · 2 = ${o.W} (cm), ${o.b} · 2 = ${o.H} (cm).`),
    IT(`Diện tích hình chữ nhật mở ra là ${v[1]?o.S:2*o.a*o.b} cm².`,v[1],'tt','VD',`${o.W} · ${o.H} = ${o.S} (cm²), gấp 4 lần phần cắt.`),
    IT('Điểm O là tâm đối xứng của hình chữ nhật mở ra.',true,'tt','VD','O là giao điểm hai nếp gấp, cũng là giao điểm hai đường chéo của hình chữ nhật mở ra.'),
    IT(`Chu vi hình chữ nhật mở ra là ${v[2]?o.P:2*(o.a+o.b)} cm.`,v[2],'tt','VD',`${nb(`2 · (${o.W} + ${o.H}) = ${o.P}`)} (cm).`)]};}
const LSTEMT='Bạn Lan thiết kế một hoa văn trên giấy kẻ ô vuông cạnh 1 cm. Lan đã tô phần bên trái điểm O (các ô màu); hoa văn hoàn chỉnh nhận O là tâm đối xứng, mỗi ô đã tô có đúng một ô tương ứng qua O.';
function ctxLuoiT(){const o=halfTData(),v=[0,1,2].map(()=>RNG()<.5);
  return {stem:LSTEMT,fig:o.fig,items:[
    IT(`Lan cần tô thêm đúng ${v[0]?o.n:o.n+sel([-1,1])} ô.`,v[0],'ve','VD',`Mỗi ô đã tô có đúng một ô tương ứng qua O: tô thêm ${o.n} ô.`),
    IT(`Diện tích hoa văn là ${v[1]?2*o.n:o.n} cm².`,v[1],'ve','VD',`${o.n} · 2 = ${2*o.n} (ô), diện tích ${2*o.n} cm².`),
    IT(`Chu vi hoa văn là ${v[2]?o.P:(2*o.Ph!==o.P?2*o.Ph:o.P+2)} cm.`,v[2],'ve','VD',cvTExp(o)),
    IT('Phần tô thêm nằm hoàn toàn bên phải điểm O.',true,'ve','VD','Phần đã tô nằm bên trái O; quay nửa vòng quanh O, mỗi ô chuyển sang phía đối diện nên nằm bên phải O.')]};}
function tfCtx(make){return ()=>{for(let n=0;n<80;n++){const u=make();if(tfOK(u.items))return u;}return FB_TF();};}
const TF=[];
const addTF=(id,topic,level,gen,mix)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},mix?{mix}:{}));
addTF('tf_nb_kn_a','kn','NB',tfNB(KN_T,KN_F));addTF('tf_nb_kn_b','kn','NB',tfNB(KN_T,KN_F));
addTF('tf_nb_hp_a','hp','NB',tfNB(HP_T,HP_F));addTF('tf_nb_hp_b','hp','NB',tfNB(HP_T,HP_F));
addTF('tf_nb_mix','hp','NB',tfNB(HP_T.concat(KN_T),HP_F.concat(KN_F)));
addTF('tf_hp_th','hp','TH',tfNB(HPT_T,HPT_F),[21]);
addTF('tf_kn_th','kn','TH',tfNB(KNT_T,KNT_F),[21]);
addTF('tf_ve_th_a','ve','TH',tfGridT);addTF('tf_ve_th_b','ve','TH',tfGridT);
addTF('tf_tt_th','tt','TH',tfNB(HPT_T.concat(KNT_T),HPT_F.concat(KNT_F)),[21]);
addTF('tf_tt_vd','tt','VD',four(ttVdItems),[21]);
addTF('tf_ctx_hoa','tt','VD',tfCtx(ctxHoa),[21]);
addTF('tf_ctx_luoi','ve','VD',tfCtx(ctxLuoiT));

/* ============ Trả lời ngắn ============ */
function saKnNamed(){const ks=shuffle(['vuong','cn','thoi','tron','bh','tc','tgd','lgd']).slice(0,4),n=ks.filter(k=>TAM[k]).length;
  return {stem:`Trong các hình: ${ks.map(nameOf).join(', ')}, có bao nhiêu hình có tâm đối xứng?`,ans:[n],exp:ks.map(k=>`${Cap(nameOf(k))}: ${TAM[k]?'có':'không có'} tâm đối xứng`).join('; ')+`. Có ${n} hình.`};}
function saLetNB(){const list=shuffle(TAMC).slice(0,ri(1,3)).concat(shuffle(NOTAM).slice(0,3));const l=shuffle(list),n=l.filter(letTam).length;
  return {stem:`Trong các chữ cái in hoa ${l.join(', ')}, có bao nhiêu chữ cái có tâm đối xứng?`,fig:fb(figLet(l)),ans:[n],exp:l.map(tLet).join(' ')+` Có ${n} chữ.`};}
function saKnRow(){const {keys,n}=countRowT();return {stem:'Trong bốn hình dưới đây, có bao nhiêu hình có tâm đối xứng?',fig:fb(figRow(keys)),ans:[n],exp:cntExpT(keys)+` Có ${n} hình.`};}
function numTData(){for(;;){const W=sel([4,6]),H=4,O={x:W/2,y:2},c=[ri(0,W-1),ri(0,H-1)],m=rot(O,c),a=c[1]*W+c[0]+1,b=m[1]*W+m[0]+1;if(Math.abs(a-b)<2)continue;return {W,H,O,a,b};}}
function saVeNum(){const o=numTData();return {stem:`Các ô vuông được đánh số như hình. Điểm O (chấm đỏ) nằm ở chính giữa. Quay tờ giấy nửa vòng quanh điểm O, ô số ${o.a} trùng với ô số mấy?`,fig:fb(figGrid({W:o.W,H:o.H,O:o.O,num:true,alt:'Lưới ô vuông đánh số và điểm O ở chính giữa'})),ans:[o.b],exp:`Quay nửa vòng quanh O, ô số ${o.a} chuyển sang phía đối diện qua O (đổi cả trái – phải và trên – dưới): đó là ô số ${o.b}.`};}
function saVeTo(mixed){return ()=>{const o=toTData(mixed);return {stem:'Cần tô thêm ít nhất bao nhiêu ô vuông để hình gồm các ô được tô nhận điểm O là tâm đối xứng?',fig:o.fig,ans:[o.need],exp:toTExp(o)};};}
function saHpOC(){const o=bhData(),[A,B,Cc,D]=o.n.split('');return {stem:`${Cap(QD[o.k])} ${o.n} có tâm đối xứng O. Biết ${A}${Cc} = ${2*o.a} cm. Độ dài O${Cc} là bao nhiêu xăng-ti-mét?`,ans:[o.a],exp:`O là trung điểm của ${A}${Cc} (quay nửa vòng quanh O, ${A} trùng ${Cc}): O${Cc} = ${2*o.a} : 2 = ${o.a} (cm).`};}
function saLetTh(){const l=shuffle(LETALL).slice(0,6),n=l.filter(letTam).length;return {stem:`Trong các chữ cái in hoa ${l.join(', ')}, có bao nhiêu chữ cái có tâm đối xứng?`,fig:fb(figLet(l)),ans:[n],exp:l.map(tLet).join(' ')+` Có ${n} chữ.`};}
function saLetBoth(){const pool=LBOTH.concat(LONLYT,['A','M','T','U','V','W','Y','B','C','D','E'],['F','G','J','L','P','Q','R']),l=shuffle(pool).slice(0,6),n=l.filter(c=>letTam(c)&&letAx(c)>0).length;
  return {stem:`Trong các chữ cái in hoa ${l.join(', ')}, có bao nhiêu chữ cái vừa có tâm đối xứng vừa có trục đối xứng?`,fig:fb(figLet(l)),ans:[n],exp:l.map(bothLet).join(' ')+` Có ${n} chữ.`};}
function saVeDt(){const o=halfTData();return {stem:HTSTEM+' Diện tích của cả hình là bao nhiêu xăng-ti-mét vuông?',fig:o.fig,ans:[2*o.n],exp:`${o.n} · 2 = ${2*o.n} (cm²).`};}
function saVeCv(){const o=halfTData();return {stem:HTSTEM+' Chu vi của cả hình là bao nhiêu xăng-ti-mét?',fig:o.fig,ans:[o.P],exp:cvTExp(o)};}
function saHpVd(){const o=bhData(),[A,B,Cc,D]=o.n.split(''),S=2*o.a+2*o.b;return {stem:`${Cap(QD[o.k])} ${o.n} có tâm đối xứng O. Biết O${A} = ${o.a} cm${o.k==='cn'||o.k==='vuong'?'':`, O${B} = ${o.b} cm`}. Tính tổng độ dài hai đường chéo ${A}${Cc} + ${B}${D} (xăng-ti-mét).`,ans:[S],exp:`O${Cc} = O${A} = ${o.a} cm, O${D} = O${B} = ${o.b} cm${o.k==='cn'||o.k==='vuong'?' (hai đường chéo bằng nhau)':''}. ${A}${Cc} + ${B}${D} = ${2*o.a} + ${2*o.b} = ${S} (cm).`};}
function saHoaS(){const o=hoaData();return {stem:`Gấp đôi tờ giấy hai lần như ở Thực hành 1 (SGK), góc có hai nếp gấp là O. Cắt một hình chữ nhật có một đỉnh ở O, hai cạnh nằm trên hai nếp gấp, dài ${o.a} cm và ${o.b} cm. Mở ra, diện tích hình chữ nhật nhận được là bao nhiêu xăng-ti-mét vuông?`,ans:[o.S],exp:`Mở ra, hai cạnh được nhân đôi: ${o.W} cm và ${o.H} cm. Diện tích: ${o.W} · ${o.H} = ${o.S} (cm²).`};}
function saHoaP(){const o=hoaData();return {stem:`Gấp đôi tờ giấy hai lần như ở Thực hành 1 (SGK), góc có hai nếp gấp là O. Cắt một hình chữ nhật có một đỉnh ở O, hai cạnh nằm trên hai nếp gấp, dài ${o.a} cm và ${o.b} cm. Mở ra, chu vi hình chữ nhật nhận được là bao nhiêu xăng-ti-mét?`,ans:[o.P],exp:`Mở ra được hình chữ nhật ${o.W} cm × ${o.H} cm. Chu vi: ${nb(`2 · (${o.W} + ${o.H}) = ${o.P}`)} (cm).`};}
function saTtDem(){const {keys,n}=bothRow();return {stem:'Trong bốn hình dưới đây, có bao nhiêu hình vừa có tâm đối xứng vừa có trục đối xứng?',fig:fb(figRow(keys)),ans:[n],exp:keys.map((k,j)=>LBH(j,k)).join(' ')+` Có ${n} hình.`};}
const SA=[
 {id:'s_kn_nb',topic:'kn',level:'NB',unit:'hình',gen:saKnNamed},
 {id:'s_let_nb',topic:'kn',level:'NB',unit:'chữ',gen:saLetNB},
 {id:'s_kn_th',topic:'kn',level:'TH',unit:'hình',gen:saKnRow},
 {id:'s_let_th',topic:'kn',level:'TH',unit:'chữ',gen:saLetTh},
 {id:'s_ve_num_a',topic:'ve',level:'TH',unit:'',gen:saVeNum},
 {id:'s_ve_num_b',topic:'ve',level:'TH',unit:'',gen:saVeNum},
 {id:'s_ve_to',topic:'ve',level:'TH',unit:'ô',gen:saVeTo(false)},
 {id:'s_hp_th',topic:'hp',level:'TH',unit:'cm',gen:saHpOC},
 {id:'s_tt_th',topic:'tt',level:'TH',unit:'chữ',gen:saLetBoth,mix:[21]},
 {id:'s_ve_to2',topic:'ve',level:'VD',unit:'ô',gen:saVeTo(true)},
 {id:'s_ve_dt',topic:'ve',level:'VD',unit:'cm²',gen:saVeDt},
 {id:'s_ve_cv',topic:'ve',level:'VD',unit:'cm',gen:saVeCv},
 {id:'s_hp_vd',topic:'hp',level:'VD',unit:'cm',gen:saHpVd},
 {id:'s_tt_hoa',topic:'tt',level:'VD',unit:'cm²',gen:saHoaS},
 {id:'s_tt_cv',topic:'tt',level:'VD',unit:'cm',gen:saHoaP},
 {id:'s_tt_dem',topic:'tt',level:'VD',unit:'hình',gen:saTtDem,mix:[21]}
].map(q=>Object.assign({type:'sa'},q));

/* ============ Gói Thử thách (30 phút) ============ */
/* Dòng chữ có tâm đối xứng: quay nửa vòng vẫn như cũ (đọc ngược giống đọc xuôi và mọi chữ đều có tâm) */
const wordT=w=>[...w].every(letTam)&&[...w].reverse().join('')===w;
function wordGenT(good){for(;;){let w;if(good){const n=ri(1,2),h=Array.from({length:n},()=>sel(TAMC)),mid=RNG()<.5?[sel(TAMC)]:[];w=h.concat(mid,h.slice().reverse()).join('');}else w=Array.from({length:ri(3,4)},()=>sel(RNG()<.6?TAMC:NOTAM)).join('');if(w.length>=3)return w;}}
function tfHard(){for(let n=0;n<80;n++){const v=[0,1,2].map(()=>RNG()<.5),w=wordGenT(v[0]),o=bhData(),[A,B,Cc,D]=o.n.split(''),k=ri(3,8);
  const items=shuffle([
    IT(`Dòng chữ ${w} có tâm đối xứng.`,wordT(w),'kn','VD',`Quay nửa vòng quanh điểm chính giữa dòng, chữ đầu đổi chỗ với chữ cuối, chữ thứ hai với chữ kế cuối, ... và mỗi chữ bị quay nửa vòng: dòng có tâm khi mọi chữ có tâm và các cặp chữ giống nhau. ${[...new Set(w)].map(tLet).join(' ')}`),
    IT(`Hình tròn có ${v[1]?'đúng một':'vô số'} tâm đối xứng.`,v[1],'hp','VD','Hình tròn có vô số trục đối xứng nhưng chỉ có một tâm đối xứng là tâm của hình tròn.'),
    IT(`Trong ${QD[o.k]} ${o.n} có tâm đối xứng O, nếu ${A}${Cc} = ${2*k} cm thì O${A} ${v[2]?'=':'≠'} ${k} cm.`,v[2],'hp','VD',`O là trung điểm của ${A}${Cc} nên O${A} = ${2*k} : 2 = ${k} (cm).`),
    IT('Chữ cái N có tâm đối xứng nhưng không có trục đối xứng.',true,'tt','VD',bothLet('N'))]);
  if(tfOK(items))return {stem:'Xét các phát biểu sau:',items};}
  return FB_TF();}
function hTo(){for(;;){const W=10,H=8,O={x:5,y:4},f=c=>rot(O,c),S=new Map(),n=ri(4,7);for(let i=0;i<n;i++){const c=[ri(0,9),ri(0,7)];S.set(key(c),c);}
  const cells=[...S.values()],need=needT(cells,[f]);if(need<4)continue;return {stem:'Cần tô thêm ít nhất bao nhiêu ô vuông để hình gồm các ô được tô nhận điểm O là tâm đối xứng?',fig:fb(figGrid({W,H,O,cells,alt:'Lưới 10 × 8 ô có các ô được tô và điểm O'})),ans:[need],exp:`Với mỗi ô đã tô, tìm ô ở phía đối diện qua O; đếm các ô đó chưa được tô (ô nào đã có ô tương ứng thì bỏ qua): ${need} ô.`};}}
function hHai(){for(;;){const W=8,H=8,O={x:4,y:4},ax={o:'v',k:4},S=new Map(),n=ri(3,5);for(let i=0;i<n;i++){const c=[ri(0,7),ri(0,7)];S.set(key(c),c);}
  const cells=[...S.values()],need=needT(cells,[c=>rot(O,c),c=>mir(ax,c)]);if(need<5||need>14)continue;
  return {stem:'Cần tô thêm ít nhất bao nhiêu ô vuông để hình gồm các ô được tô vừa nhận điểm O là tâm đối xứng, vừa nhận đường thẳng d là trục đối xứng?',fig:fb(figGrid({W,H,O,ax,cells,alt:'Lưới 8 × 8 ô có các ô được tô, đường thẳng d và điểm O'})),ans:[need],exp:`Mỗi ô đã tô kéo theo ô quay nửa vòng quanh O, ô gấp theo d, và ô gấp theo d của ô quay (tối đa 4 ô ở bốn phần lưới). Đếm các ô trong nhóm chưa được tô: ${need} ô.`};}}
function hCv(){for(;;){const n=ri(7,11),O={x:5,y:3},S=new Set(),c=[];const add=(x,y)=>{if(x<0||x>=5||y<0||y>=6||S.has(x+','+y))return false;S.add(x+','+y);c.push([x,y]);return true;};
  add(4,sel([2,3]));let t=0;while(c.length<n&&t++<400){const [x,y]=sel(c),[a,b]=sel([[1,0],[-1,0],[0,1],[0,-1]]);add(x+a,y+b);}if(c.length!==n)continue;
  const full=c.concat(c.map(q=>rot(O,q)));if(new Set(full.map(key)).size!==2*n)continue;const P=perim(full);
  return {stem:HTSTEM+' Chu vi của cả hình là bao nhiêu xăng-ti-mét?',fig:fb(figGrid({W:10,H:6,O,cells:c,alt:`Một phần của hình gồm ${n} ô vuông bên trái điểm O`})),ans:[P],exp:`Vẽ đủ cả hình rồi đếm các cạnh ô ở biên: ${P} cạnh, chu vi ${P} cm.`};}}
function hBh(){const a=ri(2,9),b=ri(2,9),S=2*a+2*b;return {stem:`Hình bình hành ABCD có tâm đối xứng O. Biết AC + BD = ${S} cm và OA = ${a} cm. Độ dài OB là bao nhiêu xăng-ti-mét?`,ans:[b],exp:`O là trung điểm của AC nên AC = 2 · ${a} = ${2*a} (cm). BD = ${S} − ${2*a} = ${2*b} (cm). O là trung điểm của BD nên OB = ${2*b} : 2 = ${b} (cm).`};}
function hGap(){for(;;){const W=2*ri(5,9),H=2*ri(4,8),a=ri(1,W/2-1),b=ri(1,H/2-1),R=W*H-4*a*b;
  return {stem:`Một tờ giấy hình chữ nhật ${W} cm × ${H} cm được gấp đôi hai lần như ở Thực hành 1 (SGK) (hai nếp gấp đi qua trung điểm các cạnh), góc có hai nếp gấp là O. Cắt bỏ một hình chữ nhật có một đỉnh ở O, hai cạnh nằm trên hai nếp gấp, dài ${a} cm và ${b} cm. Mở ra, diện tích phần giấy còn lại là bao nhiêu xăng-ti-mét vuông?`,ans:[R],exp:`Lỗ cắt mở ra là hình chữ nhật ${2*a} cm × ${2*b} cm ở giữa tờ giấy (tâm là O), diện tích ${4*a*b} cm². Còn lại: ${W} · ${H} − ${4*a*b} = ${R} (cm²).`};}}
function hLet(){const pool=LBOTH.concat(LONLYT,['A','M','T','U','V','W','Y','B','C','D','E'],['F','G','J','L','P','Q','R']),l=shuffle(pool).slice(0,8),n=l.filter(c=>letTam(c)&&letAx(c)===0).length;
  return {stem:`Trong các chữ cái in hoa ${l.join(', ')}, có bao nhiêu chữ cái có tâm đối xứng nhưng không có trục đối xứng?`,fig:fb(figLet(l)),ans:[n],exp:l.map(bothLet).join(' ')+` Có ${n} chữ.`};}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'kn',level:'VD',gen:tfHard}],sa:[
 {id:'h_to',topic:'ve',level:'VD',unit:'ô',gen:hTo},
 {id:'h_hai',topic:'tt',level:'VD',unit:'ô',gen:hHai,mix:[21]},
 {id:'h_cv',topic:'ve',level:'VD',unit:'cm',gen:hCv},
 {id:'h_bh',topic:'hp',level:'VD',unit:'cm',gen:hBh},
 {id:'h_gap',topic:'tt',level:'VD',unit:'cm²',gen:hGap},
 {id:'h_let',topic:'tt',level:'VD',unit:'chữ',gen:hLet,mix:[21]}
].map(q=>Object.assign({type:'sa'},q))};

/* ============ Gói Toán thực tế ============ */
function pisaChong(){const ks=shuffle(['ch2','ch3','chong']),L=k=>'Hình '+LB[ks.indexOf(k)]+')',p=sel([3,4,5]),n=ri(20,40);
  const fig=`<svg class="fig" viewBox="-2 -2 316 126" role="img" aria-label="Ba chong chóng giấy: hai cánh, ba cánh và bốn cánh, đánh nhãn a, b, c">${ks.map((k,i)=>shapeG(k,i*104+2)+`<text class="vl" x="${i*104+54}" y="118" text-anchor="middle">${LB[i]})</text>`).join('')}</svg>`;
  return {title:'Làm chong chóng giấy',ctx:`<p class="stem">Câu lạc bộ Toán làm ba mẫu chong chóng giấy: hai cánh, ba cánh và bốn cánh (hình dưới). Mỗi cánh cắt từ một mảnh giấy màu giá ${p} trăm đồng. Câu lạc bộ làm ${n} chiếc mỗi mẫu.</p>${fb(fig)}`,qs:[
    mcq('Chong chóng nào không có tâm đối xứng?',L('ch3'),[[L('ch2'),'Chong chóng hai cánh quay nửa vòng thì hai cánh đổi chỗ cho nhau, chồng khít với chính nó.'],[L('chong'),'Chong chóng bốn cánh quay nửa vòng, mỗi cánh trùng với cánh đối diện.'],['Cả ba chong chóng đều có tâm đối xứng','Chong chóng ba cánh quay nửa vòng thì các cánh không trùng chỗ cũ.']],'Chong chóng ba cánh không có tâm đối xứng; hai chong chóng còn lại có tâm đối xứng (HĐ2, SGK).','kn','TH'),
    saq('Có bao nhiêu mẫu chong chóng có tâm đối xứng?',2,'mẫu','Chong chóng hai cánh và bốn cánh có tâm đối xứng; ba cánh thì không.','kn','TH'),
    saq(`Làm ${n} chiếc mỗi mẫu thì cần tất cả bao nhiêu mảnh giấy màu?`,9*n,'mảnh',`Mỗi bộ ba mẫu có 2 + 3 + 4 = 9 cánh. ${n} bộ: ${n} · 9 = ${9*n} (mảnh).`,'kn','VD'),
    saq('Tiền mua giấy màu cho các chong chóng có tâm đối xứng là bao nhiêu trăm đồng?',6*n*p,'trăm đồng',`Chong chóng có tâm: hai cánh và bốn cánh, mỗi bộ 2 + 4 = 6 cánh. ${n} bộ: ${n} · 6 = ${6*n} (mảnh); tiền: ${6*n} · ${p} = ${6*n*p} (trăm đồng).`,'kn','VD')]};}
function pisaGachT(){const o=halfTData(),p=sel([15,18,20,25]),s=sel([20,25,30]),T=2*o.n;
  return {title:'Lát gạch hoa văn có tâm đối xứng',ctx:`<p class="stem">Bác Ba lát một mảng hoa văn bằng gạch vuông cạnh ${s} cm, mỗi ô trên hình là một viên gạch màu. Hình mới có phần bên trái điểm O; hoa văn hoàn chỉnh nhận O là tâm đối xứng. Mỗi viên gạch màu giá ${p} nghìn đồng.</p>${o.fig}`,qs:[
    saq('Hoa văn hoàn chỉnh cần bao nhiêu viên gạch màu?',T,'viên',`Phần đã có ${o.n} viên, phần đối diện qua O cũng ${o.n} viên: ${T} viên.`,'ve','TH'),
    saq('Tiền mua gạch màu là bao nhiêu nghìn đồng?',T*p,'nghìn đồng',`${T} · ${p} = ${T*p} (nghìn đồng).`,'ve','TH'),
    mcq('Muốn đặt viên gạch tương ứng với một viên gạch đã có, bác Ba làm thế nào?','Đi qua O sang phía đối diện, cách O đúng bằng khoảng cách từ viên gạch đó đến O',[['Đặt ở vị trí đối xứng qua một đường thẳng đứng đi qua O','Đó là cách vẽ hình có trục đối xứng; hình có tâm thì phải quay nửa vòng quanh O.'],['Đặt ngay bên phải viên gạch đó','Viên tương ứng nằm ở phía đối diện qua O, không phải sát bên.'],['Đặt ở vị trí đối xứng qua một đường nằm ngang đi qua O','Gấp theo đường nằm ngang chỉ đổi trên – dưới; quay nửa vòng đổi cả trái – phải.']],'Quay nửa vòng quanh O, mỗi viên gạch chuyển sang phía đối diện qua O, cách O một khoảng như cũ.','ve','VD'),
    saq('Đường viền bao quanh hoa văn dài bao nhiêu xăng-ti-mét?',o.P*s,'cm',`Có ${o.P} cạnh gạch ở biên, mỗi cạnh ${s} cm: ${o.P} · ${s} = ${o.P*s} (cm).`,'ve','VD')]};}
function pisaHoa(){const W=2*ri(6,10),H=W,a=ri(1,W/2-2),b=ri(1,W/2-2),p=sel([2,3,5]);if(a===b)return pisaHoa();const S=4*a*b,R=W*H-S,P=2*(2*a+2*b);
  return {title:'Cắt cửa sổ cho thiệp',ctx:`<p class="stem">Bạn Minh làm thiệp từ tờ giấy hình vuông cạnh ${W} cm. Minh gấp đôi tờ giấy hai lần như ở Thực hành 1 (SGK), góc có hai nếp gấp là O, rồi cắt bỏ một hình chữ nhật có một đỉnh ở O, hai cạnh trên hai nếp gấp dài ${a} cm và ${b} cm. Mở ra được một "cửa sổ" ở giữa tấm thiệp. Minh dán ruy băng quanh mép cửa sổ, giá ${p} trăm đồng mỗi xăng-ti-mét.</p>`,qs:[
    mcq('Khẳng định nào đúng về cửa sổ mở ra?','Cửa sổ là hình chữ nhật có tâm đối xứng là O',[['Cửa sổ là hình chữ nhật nhưng O không phải tâm đối xứng của nó','O là giao điểm hai nếp gấp, cũng là giao điểm hai đường chéo của cửa sổ.'],['Cửa sổ là hình bình hành không có trục đối xứng','Hai nếp gấp là hai trục đối xứng của cửa sổ; cửa sổ là hình chữ nhật.'],['Cửa sổ chỉ có một trục đối xứng','Cả hai nếp gấp đều là trục đối xứng của cửa sổ.']],'Bốn lớp giấy được cắt cùng lúc nên cửa sổ là hình chữ nhật nhận hai nếp gấp làm trục và O làm tâm đối xứng.','tt','TH'),
    saq('Diện tích cửa sổ là bao nhiêu xăng-ti-mét vuông?',S,'cm²',`Cửa sổ là hình chữ nhật ${2*a} cm × ${2*b} cm: ${2*a} · ${2*b} = ${S} (cm²).`,'tt','TH'),
    saq('Diện tích phần giấy còn lại của tấm thiệp là bao nhiêu xăng-ti-mét vuông?',R,'cm²',`${W} · ${W} − ${S} = ${R} (cm²).`,'tt','VD'),
    saq('Tiền mua ruy băng là bao nhiêu trăm đồng?',P*p,'trăm đồng',`Chu vi cửa sổ: ${nb(`2 · (${2*a} + ${2*b}) = ${P}`)} (cm). Tiền: ${P} · ${p} = ${P*p} (trăm đồng).`,'tt','VD')]};}
const SIGN={
  cam:{t:true,ax:2,d:`<circle class="sgr" cx="50" cy="50" r="40"/><rect class="sgw" x="20" y="43" width="60" height="14"/>`,why:'Biển tròn có vạch ngang ở giữa: có tâm đối xứng và có 2 trục.'},
  xx:{t:true,ax:4,d:`<circle class="sgo" cx="50" cy="50" r="38"/><line class="sgl" x1="27" y1="27" x2="73" y2="73"/><line class="sgl" x1="73" y1="27" x2="27" y2="73"/>`,why:'Biển tròn có hai vạch chéo cắt nhau ở tâm: có tâm đối xứng và có 4 trục.'},
  phai:{t:false,ax:1,d:`<circle class="sgb" cx="50" cy="50" r="40"/><polygon class="sgw" points="24,44 56,44 56,32 78,50 56,68 56,56 24,56"/>`,why:'Biển tròn có mũi tên chỉ sang phải: quay nửa vòng thì mũi tên chỉ sang trái, nên không có tâm đối xứng; có 1 trục nằm ngang.'},
  nguy:{t:false,ax:1,d:`<polygon class="sgt" points="50,12 90,84 10,84"/><rect class="sgk" x="47" y="36" width="6" height="28"/><circle class="sgk" cx="50" cy="73" r="4"/>`,why:'Biển tam giác có dấu chấm than: không có tâm đối xứng, có 1 trục thẳng đứng.'},
  pp:{t:false,ax:0,d:`<rect class="sgb" x="14" y="14" width="72" height="72" rx="8"/><text class="sgp" x="50" y="72" text-anchor="middle">P</text>`,why:'Biển vuông có chữ P: không có tâm đối xứng, không có trục đối xứng.'}
};
const figSigns=ks=>`<svg class="fig" viewBox="-2 -2 ${ks.length*104+4} 126" role="img" aria-label="Bốn biển báo giao thông đánh nhãn a, b, c, d">${ks.map((k,i)=>`<g data-sg="${k}" transform="translate(${i*104+2},0)">${SIGN[k].d}</g><text class="vl" x="${i*104+54}" y="118" text-anchor="middle">${LB[i]})</text>`).join('')}</svg>`;
function pisaBienT(){const ks=shuffle(['xx','pp'].concat(shuffle(['cam','phai','nguy']).slice(0,2))),L=k=>'Biển '+LB[ks.indexOf(k)]+')';
  const nt=ks.filter(k=>SIGN[k].t).length,onlyA=ks.filter(k=>!SIGN[k].t&&SIGN[k].ax>0).length;
  return {title:'Biển báo giao thông',ctx:`<p class="stem">Bạn Khoa vẽ lại bốn biển báo giao thông (hình dưới) và tìm tâm đối xứng, trục đối xứng của mỗi biển.</p>${fbw(figSigns(ks))}`,qs:[
    saq('Có bao nhiêu biển có tâm đối xứng?',nt,'biển',ks.map(k=>L(k)+': '+SIGN[k].why).join(' '),'kn','TH'),
    mcq('Biển nào không có tâm đối xứng và cũng không có trục đối xứng?',L('pp'),ks.filter(k=>k!=='pp').map(k=>[L(k),SIGN[k].why]),SIGN.pp.why,'kn','TH'),
    saq('Có bao nhiêu biển có trục đối xứng nhưng không có tâm đối xứng?',onlyA,'biển',ks.map(k=>L(k)+': '+SIGN[k].why).join(' '),'tt','VD'),
    mcq('Biển nào có nhiều trục đối xứng nhất?',L('xx'),ks.filter(k=>k!=='xx').map(k=>[L(k),SIGN[k].why]),SIGN.xx.why,'tt','VD')]};}
const PISA=[pisaChong,pisaGachT,pisaHoa,pisaBienT];
const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'kn',fig:fb(figRow(['ch2','chong','ch3','zz'],null,'Chong chóng hai cánh, bốn cánh và hình chữ Z có tâm đối xứng; chong chóng ba cánh không có')),extra:'Hình a), b), d) có tâm đối xứng; chong chóng ba cánh (hình c) thì không.'},
  {k:'hp',fig:fb(figRowO([['bh',OPOS.bh[0]],['cn',OPOS.cn[0]],['thoi',OPOS.thoi[0]],['lgd',OPOS.lgd[0]]],'Tâm đối xứng O của hình bình hành, hình chữ nhật, hình thoi, hình lục giác đều')),extra:'O là giao điểm các đường chéo; quay nửa vòng quanh O, mỗi đỉnh trùng với đỉnh đối diện.'},
  {k:'ve',fig:fb(figGrid({W:8,H:4,O:{x:4,y:2},cells:[[1,0],[2,0],[2,1],[6,3],[5,3],[5,2]],pts:[{x:0,y:3,l:'A'},{x:7,y:0,l:'A′'}],alt:'Lưới ô vuông: các ô tô màu đối xứng qua O, hai điểm A, A′ trùng nhau khi quay nửa vòng'})),extra:'A ở bên trái và phía dưới O nên A′ ở bên phải và phía trên O, cách O cùng số ô.'},
  {k:'tt',fig:fb(figRow(['cn','bh','tgd','tgt'],null,'Hình chữ nhật có cả tâm và trục, hình bình hành chỉ có tâm, tam giác đều chỉ có trục, tam giác thường không có cả hai')),extra:'a) cả tâm và trục; b) chỉ có tâm; c) chỉ có trục; d) không có cả hai.'}
];

/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='tx6_seen';
function fmtTime(s){s=Math.max(0,Math.round(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
let tick=null;
function stopTimer(){if(tick){clearInterval(tick);tick=null;}}
function updateTimer(){
  if(state.view!=='quiz'||!S)return;
  const el=document.getElementById('timer'),used=Math.floor((Date.now()-state.t0)/1000);
  if(S.mode!=='practice'){
    const lim=LIMIT[S.mode],left=lim-used;
    if(el){el.textContent='Còn '+fmtTime(left);el.classList.toggle('low',left<=Math.min(300,lim*0.2));}
    if(left<=0){state.timedOut=true;finish(true);}
  }else if(el)el.textContent='Đã dùng '+fmtTime(used);
}
function startTimer(){stopTimer();updateTimer();if(state.view==='quiz')tick=setInterval(updateTimer,1000);}
let S=null;
const $app=document.getElementById('app');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>{const s=n.toFixed(2).replace(/\.?0+$/,'');return s.replace('.',',');};
function status(p){return p>=80?['good','Thành thạo']:p>=50?['warn','Cần củng cố']:['bad','Cần học lại'];}
function inst(q){return q.gen?Object.assign({},q,q.gen()):q;}
let seen={};try{seen=JSON.parse(localStorage.getItem(SEEN_KEY)||'{}')||{};}catch(e){seen={};}
function markSeen(list){list.forEach(q=>{seen[q.id]=(seen[q.id]||0)+1;});try{localStorage.setItem(SEEN_KEY,JSON.stringify(seen));}catch(e){}}
function ordered(pool){if(SEEDED)return shuffle(pool);const w=q=>(seen[q.id]||0)*(q.gen?0.25:1);return shuffle(pool).sort((a,b)=>w(a)-w(b));}


// ===== Dựng gói (nguyên văn) =====
/* ============ Dựng phiên làm bài ============ */
function pick(pool,used){
  const x=ordered(pool.filter(x=>!used.has(x.id)))[0];used.add(x.id);return x;
}
function makeSession(mode,spec,title,by){
  const list=[];
  // không để hai câu giống hệt nhau trong cùng một phiên: câu tự sinh bị trùng thì sinh lại
  // và cố tránh hai câu cùng một khuôn đề chỉ khác số (nếu bộ sinh có khuôn đề khác)
  {const sig=q=>JSON.stringify([q.stem,q.fig||'',(q.opts||[]).map(o=>JSON.stringify(o)).sort(),(q.items||[]).map(i=>i.t)]);
   const near=q=>q.type+'|'+String(q.stem).replace(/<[^>]+>/g,'').replace(/[0-9]+/g,'#');
   const sg=new Set(),ng=new Set();
   TYPES.forEach(t=>by[t]=by[t].map(q=>{
     let x=inst(q);
     if(q.gen){
       for(let k=0;k<12&&(sg.has(sig(x))||ng.has(near(x)));k++){const y=inst(q);if(!sg.has(sig(y))||sg.has(sig(x)))x=y;}
       for(let k=0;k<20&&sg.has(sig(x));k++)x=inst(q);
     }
     sg.add(sig(x));ng.add(near(x));return x;}));}
  TYPES.forEach(t=>by[t].forEach(q=>list.push(q)));
  const idx={};TYPES.forEach(t=>by[t].forEach((q,i)=>idx[q.id]=i));
  state.ans={};state.pr={};state.result=null;state.perm={};
  state.t0=Date.now();state.elapsed=0;state.timedOut=false;if(!SEEDED)markSeen(list);
  {const keep=RNG;RNG=Math.random;by.mc.forEach(q=>{state.perm[q.id]=shuffle(q.opts.map((_,i)=>i));});RNG=keep;}
  S={mode,spec,title,by,list,idx};
}
function buildTest(){
  const used=new Set();
  const mcSlots=[['kn',['NB','TH']],['kn',['TH','VD']],['hp',['NB','TH']],['hp',['TH','VD']],['ve',['TH','VD']],['tt',['TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['kn','hp','ve'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=TKEYS.map(t=>pick(MC.filter(q=>q.topic===t&&q.level!=='VD'),used));
  const sa=[pick(SA.filter(q=>q.topic==='kn'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='hp'&&q.level!=='VD'),used)];
  makeSession('quick',null,'Kiểm tra nhanh',{mc,tf:[],sa});
}
function buildHard(){
  const vd=q=>q.level==='VD';
  const mc=ordered(MC.filter(vd)).slice(0,6);
  const tf=ordered(HARD.tf).slice(0,1).concat(ordered(TF.filter(vd)).slice(0,2));
  const sa=ordered(HARD.sa).slice(0,4);
  makeSession('hard',null,'Thử thách',{mc,tf,sa});
}
function buildPisa(){
  const units=shuffle(PISA).slice(0,3).map(f=>f());
  const by={mc:[],tf:[],sa:[]};
  units.forEach((u,ui)=>u.qs.forEach((q,k)=>{q.id='p'+ui+'_'+k;q.no=k;q.lb=`Tình huống ${ui+1}, câu ${k+1}`;by[q.type].push(q);}));
  makeSession('practice',{kind:'pisa'},'Gói Toán thực tế',by);
  S.units=units;
}
function buildPractice(spec){
  let f,title;
  if(spec.kind==='level'){f=q=>q.level===spec.val;title='Gói '+LEVELS[spec.val];}
  else if(spec.kind==='topic'){f=q=>q.topic===spec.val;title='Gói '+TOPICS[spec.val].short;}
  else{f=q=>spec.topics.includes(q.topic);title='Gói ôn điểm yếu';}
  const nSA=spec.kind==='topic'?4:3;
  // ưu tiên các dạng câu khác nhau trong một gói; thiếu thì mới lấy thêm câu cùng dạng
  const take=(arr,n)=>{const o=ordered(arr.filter(f)),out=[],g=new Set();o.forEach(q=>{if(out.length<n&&!(q.gen&&g.has(q.gen))){out.push(q);if(q.gen)g.add(q.gen);}});o.forEach(q=>{if(out.length<n&&!out.includes(q))out.push(q);});return out;};
  makeSession('practice',spec,title,{mc:take(MC,6),tf:take(TF,2),sa:take(SA,nSA)});
}


// ===== Nhãn câu (nguyên văn) =====
const PART_NAME={mc:'Phần I',tf:'Phần II',sa:'Phần III'},PART_QUICK={mc:'Phần I',sa:'Phần II'};
const partName=t=>S.mode==='quick'?PART_QUICK[t]:PART_NAME[t];
const TYPE_NAME={mc:'Nhiều lựa chọn',tf:'Đúng sai',sa:'Trả lời ngắn'};
function lbl(t,i,j){
  const q0=S.by[t][i];if(q0&&q0.lb)return j==null?q0.lb:`${q0.lb}, ý ${'abcd'[j]}`;
  const base=S.mode!=='practice'?`${partName(t)}, câu ${i+1}`:`${TYPE_NAME[t]}, câu ${i+1}`;
  return j==null?base:`${base}, ý ${'abcd'[j]}`;
}

// ===== Chấm điểm (nguyên văn) =====
/* ============ Chấm điểm ============ */
function parseNum(s){
  s=String(s).trim().replace(/[−–—]/g,'-');
  if(/^[1-9]\d{0,2}([.\s]\d{3})+$/.test(s))s=s.replace(/[.\s]/g,'');
  s=s.replace(/,/g,'.').replace(/[^0-9.\-\/]/g,'');
  if(!s)return NaN;
  if(s.includes('/')){const [a,b]=s.split('/');return parseFloat(a)/parseFloat(b);}
  return parseFloat(s);
}
function evalQ(q,a){
  if(q.type==='mc')return [a===q.ans];
  if(q.type==='tf'){a=a||[];return q.items.map((it,j)=>a[j]===it.v);}
  const v=parseNum(a==null?'':a);
  return [!isNaN(v)&&q.ans.some(x=>Math.abs(x-v)<1e-6)];
}
function grade(){
  const test=S.mode!=='practice',quick=S.mode==='quick';
  const items=[],sc={mc:0,tf:0,sa:0},errs=[],qres=[];
  const ansOf=q=>test?state.ans[q.id]:(state.pr[q.id]&&state.pr[q.id].firstAns);
  const oksOf=q=>{
    if(test)return evalQ(q,ansOf(q));
    const P=state.pr[q.id];return P&&P.first?P.first:Array(q.type==='tf'?q.items.length:1).fill(false);
  };
  S.by.mc.forEach((q,i)=>{
    const a=ansOf(q),ok=oksOf(q)[0];
    if(ok)sc.mc+=quick?1.25:0.5;else if(a!=null&&q.opts[a]&&q.opts[a].err)errs.push({where:lbl('mc',i),topic:q.topic,text:q.opts[a].err});
    items.push({topic:q.topic,level:q.level,ok,label:lbl('mc',i)});
    qres.push({kind:'mc',q,i,a,ok,pts:ok?(quick?1.25:0.5):0,max:quick?1.25:0.5});
  });
  S.by.tf.forEach((q,i)=>{
    const a=ansOf(q)||[],oks=oksOf(q);let k=0;
    q.items.forEach((it,j)=>{
      const ok=oks[j];if(ok)k++;
      items.push({topic:it.topic,level:it.level,ok,label:lbl('tf',i,q.items.length>1?j:null)});
      if(!ok&&typeof a[j]==='boolean')errs.push({where:lbl('tf',i,q.items.length>1?j:null),topic:it.topic,text:it.exp});
    });
    const pts=quick?(k?1.25:0):TF_SCORE[k];sc.tf+=pts;
    qres.push({kind:'tf',q,i,a,oks,k,pts,max:quick?1.25:1});
  });
  S.by.sa.forEach((q,i)=>{
    const raw=ansOf(q)||'',ok=oksOf(q)[0];
    if(ok)sc.sa+=quick?2.5:1;
    items.push({topic:q.topic,level:q.level,ok,label:lbl('sa',i)});
    qres.push({kind:'sa',q,i,raw,ok,pts:ok?(quick?2.5:1):0,max:quick?2.5:1});
  });
  const topics={};TKEYS.forEach(k=>topics[k]={c:0,n:0});
  const levels={NB:{c:0,n:0},TH:{c:0,n:0},VD:{c:0,n:0}};
  items.forEach(it=>{topics[it.topic].n++;levels[it.level].n++;if(it.ok){topics[it.topic].c++;levels[it.level].c++;}});
  const total=Math.round((sc.mc+sc.tf+sc.sa)*100)/100;
  return {items,sc,total,topics,levels,errs,qres};
}
function pct(o){return o.n?Math.round(100*o.c/o.n):0;}
function updateWeak(r){
  TKEYS.forEach(k=>{if(r.topics[k].n)state.topicPct[k]=pct(r.topics[k]);});
  state.weak=TKEYS.filter(k=>state.topicPct[k]!==undefined&&state.topicPct[k]<80).sort((a,b)=>state.topicPct[a]-state.topicPct[b]);
}


// ===== Giao tiếp với máy chủ =====
  const XAY = { test: buildTest, quick: buildQuick, hard: buildHard, pisa: buildPisa };
  return {
    TOPICS, TKEYS, LEVELS, LIMIT,
    /** Dựng một phiên. cheDo: test | quick | hard | pisa | practice; spec cho practice; maDe: cùng mã → cùng đề. */
    taoPhien(cheDo, spec, maDe) {
      if (cheDo !== "practice" && !XAY[cheDo]) throw new Error("Chế độ không hợp lệ: " + cheDo);
      const chay = () => (cheDo === "practice" ? buildPractice(spec) : XAY[cheDo]());
      if (maDe) {
        RNG = mulberry32(hashStr(cheDo + "|" + maDe)); SEEDED = true;
        try { chay(); } finally { RNG = Math.random; SEEDED = false; }
      } else chay();
      return JSON.parse(JSON.stringify({ mode: S.mode, spec: S.spec, title: S.title, by: S.by, idx: S.idx, units: S.units || null, perm: state.perm }));
    },
    /** Chấm. traLoi: { id: câu trả lời } (bài kiểm tra) hoặc { id: {first, firstAns} } (luyện tập). */
    cham(phien, traLoi) {
      S = { mode: phien.mode, spec: phien.spec, title: phien.title, by: phien.by, idx: phien.idx, units: phien.units, list: [] };
      TYPES.forEach(t => S.by[t].forEach(q => S.list.push(q)));
      if (phien.mode === "practice") { state.pr = traLoi || {}; state.ans = {}; }
      else { state.ans = traLoi || {}; state.pr = {}; }
      const r = grade();
      return {
        total: r.total, sc: r.sc, topics: r.topics, levels: r.levels, errs: r.errs,
        qres: r.qres.map(x => ({ kind: x.kind, id: x.q.id, i: x.i, ok: x.ok, oks: x.oks, k: x.k, pts: x.pts, max: x.max }))
      };
    },
    /** Kiểm tra một câu (dùng cho chế độ luyện tập). */
    kiemTra(q, a) { return evalQ(q, a); },
  };
}
