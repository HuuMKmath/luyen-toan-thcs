// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ hinh-co-truc-doi-xung/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "hinh-co-truc-doi-xung";
export const TIEN_TO = "DX6-";

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
  lc:{n:null,ax:0,d:()=>poly([[22,8],[46,8],[46,68],[78,68],[78,90],[22,90]])}
};
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
  if(o.ax){if(o.ax.o==='v'){const x=p+o.ax.k*s;g+=`<line class="ax" data-ax="v,${o.ax.k}" x1="${x}" y1="${y0-10}" x2="${x}" y2="${y0+o.H*s+8}"/><text class="vl" x="${x+5}" y="${y0-2}">d</text>`;}
    else{const y=y0+o.ax.k*s;g+=`<line class="ax" data-ax="h,${o.ax.k}" x1="${p-8}" y1="${y}" x2="${p+o.W*s+8}" y2="${y}"/><text class="vl" x="${p+o.W*s+11}" y="${y+5}">d</text>`;}}
  return `<svg class="fig" viewBox="0 0 ${W} ${H}" style="max-width:${Math.min(400,W*1.25)}px" role="img" aria-label="${o.alt||'Lưới ô vuông có đường thẳng d'}">${g}</svg>`;
}
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
const letAx=c=>LET.hai.includes(c)?2:(LET.doc.includes(c)||LET.ngang.includes(c))?1:0;
const figLet=(arr,alt)=>`<svg class="fig" viewBox="0 0 ${arr.length*56+8} 70" style="max-width:${Math.min(400,arr.length*70)}px" role="img" aria-label="${alt||'Các chữ cái '+arr.join(', ')}">${arr.map((c,i)=>`<text class="big" data-ch="${c}" x="${i*56+32}" y="58" text-anchor="middle">${c}</text>`).join('')}</svg>`;

const FB_MC=()=>({stem:'Hình tròn có bao nhiêu trục đối xứng?',opts:[{t:'Vô số'},{t:'1',err:'Mỗi đường thẳng đi qua tâm đều là một trục đối xứng của hình tròn.'},{t:'2',err:'Không chỉ hai đường: mọi đường thẳng đi qua tâm đều là trục đối xứng.'},{t:'4',err:'Hình vuông có 4 trục; hình tròn có vô số trục.'}],ans:0,exp:'Mỗi đường thẳng đi qua tâm là một trục đối xứng của hình tròn, nên hình tròn có vô số trục đối xứng.'});
const FB_TF=()=>({stem:'Xét các phát biểu sau:',items:[
  IT('Mỗi đường chéo là một trục đối xứng của hình thoi.',true,'hp','NB','Đúng như nhận xét trong SGK.'),
  IT('Mỗi đường chéo là một trục đối xứng của hình chữ nhật.',false,'hp','NB','Hình chữ nhật (không phải hình vuông) có hai trục đối xứng là hai đường thẳng đi qua trung điểm hai cạnh đối diện; đường chéo không phải trục.'),
  IT('Hình tròn có vô số trục đối xứng.',true,'hp','NB','Mỗi đường thẳng đi qua tâm là một trục đối xứng.'),
  IT('Hình bình hành có hai trục đối xứng.',false,'hp','NB','Hình bình hành không có trục đối xứng.')]});

/* ============ Nội dung, mức độ ============ */
const TOPICS={
  kn:{short:'Hình có trục đối xứng',name:'Hình có trục đối xứng trong thực tế',rule:'Một hình có trục đối xứng nếu có một đường thẳng d chia hình thành hai phần mà khi "gấp" hình theo đường thẳng d thì hai phần đó "chồng khít" lên nhau. Đường thẳng d là trục đối xứng của hình. Ví dụ: con bướm, chữ A, chữ H. Một hình có thể có một hoặc nhiều trục đối xứng, cũng có hình không có trục đối xứng.',tip:'Chia hình thành hai phần thôi chưa đủ: phải tưởng tượng gấp theo đường thẳng đó và thấy hai phần chồng khít hoàn toàn mới là trục đối xứng.'},
  hp:{short:'Trục của hình phẳng',name:'Trục đối xứng của một số hình phẳng',rule:'Mỗi đường thẳng đi qua tâm là một trục đối xứng của hình tròn (hình tròn có vô số trục). Mỗi đường chéo là một trục đối xứng của hình thoi. Mỗi đường thẳng đi qua trung điểm hai cạnh đối diện là một trục đối xứng của hình chữ nhật. Hình vuông có 4 trục, hình tam giác đều có 3 trục, hình lục giác đều có 6 trục, hình thang cân có 1 trục (đi qua trung điểm hai đáy), hình bình hành không có trục đối xứng.',tip:'Hay nhầm: đường chéo của hình chữ nhật không phải trục đối xứng (trừ hình vuông); đường chéo của hình thang cân, của hình bình hành cũng không phải trục.'},
  ve:{short:'Gấp hình trên lưới ô vuông',name:'Gấp hình theo trục trên lưới ô vuông',rule:'Trên giấy kẻ ô vuông, khi gấp theo đường thẳng d, mỗi ô (mỗi điểm) trùng với ô (điểm) ở phía bên kia d, cùng một hàng (hoặc cùng một cột) và cách d cùng một số ô. Muốn hình nhận d là trục đối xứng thì mỗi ô được tô phải có ô trùng với nó khi gấp cũng được tô.',tip:'Đếm từ ô (điểm) đến đường thẳng d có mấy ô, rồi đếm sang phía bên kia đúng bằng số ô đó, giữ nguyên hàng (hoặc cột).'},
  ud:{short:'Cắt giấy, chu vi, diện tích',name:'Ứng dụng: cắt chữ, cắt hình bằng giấy; chu vi và diện tích',rule:'Để cắt một hình (một chữ) có trục đối xứng, ta gấp đôi tờ giấy theo trục đối xứng rồi chỉ cắt một nửa hình; mở ra được cả hình. Khi mở ra, đoạn nằm trên nếp gấp giữ nguyên, đoạn đi ra từ nếp gấp được nhân đôi. Diện tích cả hình bằng 2 lần diện tích một nửa.',tip:'Chu vi cả hình không bằng 2 lần chu vi nửa hình: đoạn nằm trên nếp gấp (trên trục) không còn là cạnh của hình sau khi mở ra.'}
};
const TKEYS=['kn','hp','ve','ud'];
const TDESC={kn:'Nhận ra hình, chữ cái, đường thẳng là trục đối xứng',hp:'Trục đối xứng của hình tròn, hình thoi, hình chữ nhật, hình vuông, tam giác đều, lục giác đều, hình thang cân',ve:'Gấp theo đường thẳng d trên giấy kẻ ô, tô thêm ô để có trục đối xứng',ud:'Cắt chữ, cắt hình bằng cách gấp giấy, tính chu vi và diện tích'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhớ thế nào là hình có trục đối xứng, nhận ra trục đối xứng của hình tròn, hình thoi, hình chữ nhật.',TH:'Đếm số trục đối xứng, kiểm tra một đường thẳng có phải trục đối xứng, gấp hình trên lưới ô vuông, cắt chữ bằng giấy.',VD:'Hình ghép, hoàn thiện hình có trục đối xứng rồi tính diện tích, chu vi, bài toán cắt giấy nhiều bước.'};

/* ============ Dữ liệu dùng chung ============ */
const NAMED=['tron','vuong','cn','thoi','tgd','lgd','tc','bh'];
const Cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const nameOf=k=>SH[k].n;
const NO_AX=['bh','tgt','chong','zz','lc'];
const HAS_AX=['tron','vuong','cn','thoi','tgd','lgd','tc','sao5','sao6','tim','dieu','mui','thap'];
const whyNo=k=>SH[k].n?`${Cap(SH[k].n)} không có trục đối xứng.`:'Gấp hình theo đường thẳng nào thì hai phần cũng không chồng khít, nên hình không có trục đối xứng.';
const whyYes=k=>SH[k].n?`${Cap(SH[k].n)} có ${AXN(SH[k].ax)} trục đối xứng.`:`Hình này có ${AXN(SH[k].ax)} trục đối xứng.`;
const LETALL=[].concat(LET.doc,LET.ngang,LET.hai,LET.khong);
const letWhy=c=>LET.hai.includes(c)?`Chữ ${c} có hai trục đối xứng (dọc và ngang).`:LET.doc.includes(c)?`Chữ ${c} có một trục đối xứng thẳng đứng.`:LET.ngang.includes(c)?`Chữ ${c} có một trục đối xứng nằm ngang.`:`Chữ ${c} không có trục đối xứng: gấp theo đường nào hai phần cũng không chồng khít.`;
const OPTN=['0','1','2','3','4','5','6','Vô số'];
function axOpts(right,errFn){return shuffle(OPTN.filter(t=>t!==right)).map(t=>C(t,errFn(t)));}

/* ---------- Hàng 4 hình: một hình có (không có) trục ---------- */
function rowOdd(wantAx){const one=sel(wantAx?HAS_AX:NO_AX),rest=shuffle(wantAx?NO_AX:HAS_AX.filter(k=>k!=='tron')).slice(0,3),keys=shuffle([one].concat(rest)),i=keys.indexOf(one);return {keys,i};}
function genKnCo(){return tryGen(()=>{const {keys,i}=rowOdd(true);
  return mk('Hình nào dưới đây có trục đối xứng?','Hình '+LB[i]+')',keys.map((k,j)=>j===i?null:C('Hình '+LB[j]+')',whyNo(k))).filter(Boolean),`${whyYes(keys[i]).replace(/^Hình này/,'Hình '+LB[i]+')')} Các hình còn lại không có trục đối xứng: gấp theo đường thẳng nào hai phần cũng không chồng khít.`,fb(figRow(keys)));});}
function genKnKhong(){return tryGen(()=>{const {keys,i}=rowOdd(false);
  return mk('Hình nào dưới đây không có trục đối xứng?','Hình '+LB[i]+')',keys.map((k,j)=>j===i?null:C('Hình '+LB[j]+')',whyYes(k).replace(/^Hình này/,'Hình '+LB[j]+')'))).filter(Boolean),`${whyNo(keys[i])} Các hình còn lại đều có trục đối xứng.`,fb(figRow(keys)));});}
/* ---------- Chữ cái ---------- */
function genLetCo(){return tryGen(()=>{const c=sel([].concat(LET.doc,LET.ngang,LET.hai)),w=shuffle(LET.khong).slice(0,3),arr=shuffle([c].concat(w));
  return mk('Chữ cái in hoa nào dưới đây có trục đối xứng?','Chữ '+c,w.map(x=>C('Chữ '+x,letWhy(x))),letWhy(c),fb(figLet(arr)));});}
function genLetKhong(){return tryGen(()=>{const c=sel(LET.khong),w=shuffle([].concat(LET.doc,LET.ngang,LET.hai)).slice(0,3),arr=shuffle([c].concat(w));
  return mk('Chữ cái in hoa nào dưới đây không có trục đối xứng?','Chữ '+c,w.map(x=>C('Chữ '+x,letWhy(x))),letWhy(c),fb(figLet(arr)));});}
/* ---------- Đường nét đứt có phải trục ---------- */
function lineRow(wantTrue){
  const shapes=shuffle(Object.keys(LN));const good=[],bad=[];
  shapes.forEach(k=>LN[k].forEach(l=>(l.ax?good:bad).push([k,l])));
  const one=sel(wantTrue?good:bad),rest=[];const pool=shuffle(wantTrue?bad:good);
  for(const x of pool){if(rest.length<3&&x[0]!==one[0]&&!rest.some(r=>r[0]===x[0]))rest.push(x);}
  const all=shuffle([one].concat(rest));return {all,i:all.indexOf(one)};
}
function genKnLine(){return tryGen(()=>{const {all,i}=lineRow(true);
  return mk('Trong hình nào dưới đây, đường nét đứt là trục đối xứng của hình?','Hình '+LB[i]+')',all.map((x,j)=>j===i?null:C('Hình '+LB[j]+')',x[1].why)).filter(Boolean),all[i][1].why,fb(figRow(all.map(x=>x[0]),all.map(x=>x[1]),'Bốn hình, mỗi hình có một đường nét đứt')));});}
function genKnLineNot(){return tryGen(()=>{const {all,i}=lineRow(false);
  return mk('Trong hình nào dưới đây, đường nét đứt không phải là trục đối xứng của hình?','Hình '+LB[i]+')',all.map((x,j)=>j===i?null:C('Hình '+LB[j]+')',x[1].why)).filter(Boolean),all[i][1].why,fb(figRow(all.map(x=>x[0]),all.map(x=>x[1]),'Bốn hình, mỗi hình có một đường nét đứt')));});}
/* ---------- Đếm hình có trục ---------- */
function countRow(){const n=ri(1,4),keys=shuffle(shuffle(HAS_AX).slice(0,n).concat(shuffle(NO_AX).slice(0,4-n)));return {keys,n:keys.filter(k=>SH[k].ax>0).length};}
const cntExp=keys=>keys.map((k,j)=>`Hình ${LB[j]}) ${SH[k].ax>0?'có':'không có'} trục đối xứng`).join('; ')+'.';
function genKnDem(){return tryGen(()=>{const {keys,n}=countRow();
  return mk('Trong bốn hình dưới đây, có bao nhiêu hình có trục đối xứng?',n+' hình',[1,2,3,4].filter(x=>x!==n).map(x=>C(x+' hình',x>n?'Có hình đếm thừa: hình không có trục đối xứng thì gấp theo đường nào hai phần cũng không chồng khít.':'Còn sót hình có trục đối xứng; hãy thử gấp từng hình theo đường thẳng thích hợp.')),cntExp(keys)+` Vậy có ${n} hình.`,fb(figRow(keys)));});}
/* ---------- Số trục của hình phẳng ---------- */
const AXERR={
  tron:t=>t==='1'||t==='2'||t==='4'?'Mỗi đường thẳng đi qua tâm đều là một trục đối xứng của hình tròn, nên có vô số trục.':'Hình tròn có vô số trục đối xứng (mỗi đường thẳng đi qua tâm).',
  vuong:t=>t==='2'?'Hình vuông có hai trục đi qua trung điểm hai cạnh đối diện và còn hai trục là hai đường chéo: tất cả 4 trục.':'Hình vuông có 4 trục: hai đường chéo và hai đường thẳng đi qua trung điểm hai cạnh đối diện.',
  cn:t=>t==='4'?'Đường chéo của hình chữ nhật (không phải hình vuông) không phải trục đối xứng, nên chỉ có 2 trục.':'Hình chữ nhật có 2 trục: hai đường thẳng đi qua trung điểm hai cạnh đối diện.',
  thoi:t=>t==='4'?'Đường thẳng nối trung điểm hai cạnh đối diện của hình thoi không phải trục đối xứng; chỉ có hai đường chéo là trục.':'Hình thoi có 2 trục đối xứng là hai đường chéo.',
  tgd:t=>t==='1'?'Tam giác đều có ba đỉnh như nhau: mỗi đường thẳng đi qua một đỉnh và trung điểm cạnh đối diện là một trục, tất cả 3 trục.':'Hình tam giác đều có 3 trục đối xứng.',
  lgd:t=>t==='3'?'Ngoài 3 đường thẳng đi qua hai đỉnh đối diện, còn 3 đường thẳng đi qua trung điểm hai cạnh đối diện: tất cả 6 trục.':'Hình lục giác đều có 6 trục đối xứng.',
  tc:t=>t==='2'?'Hai đáy của hình thang cân dài khác nhau nên đường nằm ngang không phải trục; chỉ có 1 trục đi qua trung điểm hai đáy.':'Hình thang cân có đúng 1 trục đối xứng, đi qua trung điểm hai đáy.',
  bh:t=>t==='2'?'Đường chéo của hình bình hành không phải trục đối xứng.':'Hình bình hành không có trục đối xứng.'
};
const AXX={tron:'Mỗi đường thẳng đi qua tâm là một trục đối xứng của hình tròn, nên hình tròn có vô số trục đối xứng.',vuong:'Hình vuông có 4 trục đối xứng: hai đường chéo và hai đường thẳng đi qua trung điểm hai cạnh đối diện.',cn:'Mỗi đường thẳng đi qua trung điểm hai cạnh đối diện là một trục đối xứng của hình chữ nhật: có 2 trục.',thoi:'Mỗi đường chéo là một trục đối xứng của hình thoi: có 2 trục.',tgd:'Mỗi đường thẳng đi qua một đỉnh và trung điểm cạnh đối diện là một trục: tam giác đều có 3 trục.',lgd:'Ba đường thẳng đi qua hai đỉnh đối diện và ba đường thẳng đi qua trung điểm hai cạnh đối diện: lục giác đều có 6 trục.',tc:'Hình thang cân có 1 trục đối xứng là đường thẳng đi qua trung điểm hai đáy.',bh:'Hình bình hành không có trục đối xứng.'};
function genHpSo(keys){return ()=>tryGen(()=>{const k=sel(keys),r=AXN(SH[k].ax)==='vô số'?'Vô số':AXN(SH[k].ax);
  return mk(`${Cap(nameOf(k))} có bao nhiêu trục đối xứng?`,r,axOpts(r,AXERR[k]),AXX[k]);});}
const genHpSoNB=genHpSo(['tron','cn','thoi']),genHpSoTH=genHpSo(['vuong','tgd','lgd','tc']);
function genHpMost(){return tryGen(()=>{const cand=shuffle(['vuong','cn','tgd','lgd','tc','bh']);const pick=[];cand.forEach(k=>{if(pick.length<4&&!pick.some(p=>SH[p].ax===SH[k].ax))pick.push(k);});
  if(pick.length<4)return null;const best=pick.reduce((a,b)=>SH[a].ax>SH[b].ax?a:b);
  return mk('Trong các hình sau, hình nào có nhiều trục đối xứng nhất?',Cap(nameOf(best)),pick.filter(k=>k!==best).map(k=>C(Cap(nameOf(k)),`${Cap(nameOf(k))} chỉ có ${SH[k].ax} trục, ít hơn ${nameOf(best)} (${SH[best].ax} trục).`)),pick.map(k=>`${Cap(nameOf(k))}: ${SH[k].ax} trục`).join('; ')+'.');});}
function genHpDung2(){return tryGen(()=>{const r=sel(['cn','thoi']),w=shuffle(['vuong','tgd','tc','bh','lgd']).slice(0,3);
  return mk('Hình nào dưới đây có đúng hai trục đối xứng?',Cap(nameOf(r)),w.map(k=>C(Cap(nameOf(k)),`${Cap(nameOf(k))} có ${SH[k].ax} trục đối xứng.`)),AXX[r]);});}
function genHpKhong(){return tryGen(()=>{const w=shuffle(['vuong','cn','thoi','tron','tc','tgd']).slice(0,3);
  return mk('Hình nào dưới đây không có trục đối xứng?','Hình bình hành',w.map(k=>C(Cap(nameOf(k)),`${Cap(nameOf(k))} có ${AXN(SH[k].ax)} trục đối xứng.`)),'Hình bình hành không có trục đối xứng: gấp theo đường chéo hay theo đường nối trung điểm hai cạnh đối diện, hai phần đều không chồng khít.');});}
function sumData(){const ks=shuffle(['vuong','cn','thoi','tgd','lgd','tc','bh']).slice(0,3),s=sum(ks.map(k=>SH[k].ax));return {ks,s,txt:ks.map(nameOf).join(', ').replace(/, ([^,]*)$/,' và $1'),exp:ks.map(k=>`${Cap(nameOf(k))}: ${SH[k].ax} trục`).join('; ')+`. Tổng: ${ks.map(k=>SH[k].ax).join(' + ')} = ${s}.`};}
function genHpTong(){return tryGen(()=>{const o=sumData();
  return mk(`Tổng số trục đối xứng của ${o.txt} là:`,String(o.s),[C(String(o.s+2),'Có hình được đếm thừa trục: kiểm tra lại, ví dụ đường chéo của hình chữ nhật không phải trục.'),C(String(o.s-1),'Còn sót trục đối xứng của một hình.'),C(String(o.s+1),'Có hình được đếm thừa một trục.'),C(String(Math.max(0,o.s-2)),'Còn sót trục: ví dụ hình vuông có 4 trục, không phải 2.')],o.exp);});}
/* ---------- Hình ghép với hình tròn cùng tâm ---------- */
const GH={vuong:[50,50,22],tgd:[50,61,14],lgd:[50,50,24],cn:[50,50,18],thoi:[50,50,16]};
const figGhep=k=>`<svg class="fig" viewBox="0 0 100 100" style="max-width:150px" role="img" aria-label="${Cap(nameOf(k))} và một hình tròn có cùng tâm nằm bên trong">${SH[k].d()}<circle class="sh2" data-s="tron" cx="${GH[k][0]}" cy="${GH[k][1]}" r="${GH[k][2]}"/></svg>`;
const ghepExp=k=>`Một đường thẳng là trục đối xứng của hình ghép khi gấp theo nó cả hai hình đều chồng khít. Hình tròn chồng khít với mọi đường thẳng đi qua tâm, nên trục của hình ghép chính là các trục của ${nameOf(k)}: ${SH[k].ax} trục.`;
function genHpGhep(){return tryGen(()=>{const k=sel(['vuong','tgd','lgd']),r=String(SH[k].ax);
  return mk(`Hình bên gồm ${nameOf(k)} và một hình tròn có cùng tâm. Hình đó có bao nhiêu trục đối xứng?`,r,[C('Vô số','Hình tròn có vô số trục, nhưng một đường thẳng chỉ là trục của hình ghép khi cũng là trục của '+nameOf(k)+'.'),C(String(SH[k].ax+1),'Đếm thừa: không có trục nào ngoài các trục của '+nameOf(k)+'.'),C(String(SH[k].ax*2),'Không nhân đôi: mỗi trục của '+nameOf(k)+' đồng thời là trục của hình tròn, chỉ tính một lần.'),C('1','Hình ghép có nhiều hơn một trục.')],ghepExp(k),fb(figGhep(k)));});}
/* ---------- Ngôi sao, chữ thập ---------- */
const STARK=['sao5','thap'],STARK2=['sao6','sao4'];
const figOne=k=>`<svg class="fig" viewBox="0 0 100 100" style="max-width:150px" role="img" aria-label="${k==='sao5'?'Ngôi sao năm cánh đều':k==='sao6'?'Ngôi sao sáu cánh đều':k==='sao4'?'Ngôi sao bốn cánh đều':'Hình chữ thập có bốn cánh bằng nhau'}"><g data-s="${k}">${SH[k].d()}</g></svg>`;
const starExp=k=>k==='sao4'?'Hai đường thẳng đi qua hai đỉnh cánh đối diện và hai đường thẳng đi qua hai góc lõm đối diện: ngôi sao bốn cánh đều có 4 trục đối xứng.':k==='sao5'?'Mỗi đường thẳng đi qua một đỉnh cánh sao và tâm ngôi sao là một trục: ngôi sao năm cánh đều có 5 trục đối xứng.':k==='sao6'?'Ba đường thẳng đi qua hai đỉnh cánh đối diện và ba đường thẳng đi qua hai góc lõm đối diện: ngôi sao sáu cánh đều có 6 trục.':'Hai đường thẳng (dọc, ngang) đi qua giữa các cánh và hai đường chéo: hình chữ thập có 4 trục đối xứng.';
function genHpStar(){return tryGen(()=>{const k=sel(STARK),r=String(SH[k].ax);
  return mk('Hình bên có bao nhiêu trục đối xứng?',r,shuffle(['1','2','3','4','5','6','8','10'].filter(t=>t!==r)).map(t=>C(t,Number(t)<SH[k].ax?'Còn sót trục: xét cả các đường thẳng đi qua đỉnh cánh và các đường thẳng đi qua góc lõm.':'Đếm thừa: mỗi trục là một đường thẳng, không đếm hai lần hai nửa của cùng một đường thẳng.')),starExp(k),fb(figOne(k)));});}
/* ---------- Gấp trên lưới: điểm trùng ---------- */
function foldData(){
  for(;;){const vert=RNG()<.5,W=vert?8:6,H=vert?6:8,k=4,ax={o:vert?'v':'h',k};
    const A=vert?[ri(0,k-1),ri(1,H-2)]:[ri(1,W-2),ri(0,k-1)],M=mir(ax,A);
    const w1=vert?[M[0]+sel([-1,1]),M[1]]:[M[0],M[1]+sel([-1,1])],w2=vert?[M[0],M[1]+sel([-1,1])]:[M[0]+sel([-1,1]),M[1]],w3=vert?[A[0]+k,A[1]]:[A[0],A[1]+k];
    const ok=p=>p[0]>=0&&p[0]<W&&p[1]>=0&&p[1]<H&&(vert?p[0]>=k:p[1]>=k);
    const all=[M,w1,w2,w3];if(!all.every(ok)||new Set(all.map(key)).size<4)continue;
    const L=shuffle(['M','N','P','Q']),pts=[{x:A[0],y:A[1],l:'A'}].concat(all.map((p,i)=>({x:p[0],y:p[1],l:L[i]})));
    const t=vert?k-A[0]:k-A[1];
    return {vert,W,H,ax,A,M,L,pts,t,fig:fb(figGrid({W,H,ax,pts,alt:'Lưới ô vuông có đường thẳng d, điểm A và bốn điểm M, N, P, Q'}))};}
}
function genVeGap(){return tryGen(()=>{const o=foldData(),side=o.vert?'bên phải':'bên dưới';
  const E=[`Điểm này lệch một ô: điểm trùng với A phải cách d đúng ${o.t} ô như A.`,`Điểm này không cùng ${o.vert?'hàng':'cột'} với A; khi gấp theo d, A chỉ chuyển sang phía bên kia, vẫn trên cùng ${o.vert?'hàng':'cột'}.`,`Điểm này có được khi trượt A sang ${o.vert?'phải':'dưới'} ${o.ax.k} ô, không phải khi gấp: khi gấp, điểm gần d trùng với điểm gần d.`];
  return mk('Gấp tờ giấy kẻ ô vuông theo đường thẳng d. Điểm A trùng với điểm nào?','Điểm '+o.L[0],[1,2,3].map(i=>C('Điểm '+o.L[i],E[i-1])),`A nằm ở ô thứ ${o.t} tính từ d. Khi gấp, A trùng với điểm cùng ${o.vert?'hàng':'cột'}, nằm ở ô thứ ${o.t} tính từ d về phía ${side}: đó là điểm ${o.L[0]}.`,o.fig);});}
/* ---------- Tô thêm ô ---------- */
function toData(mixed){
  for(;;){const vert=RNG()<.5,k=4,W=vert?8:6,H=vert?6:8,ax={o:vert?'v':'h',k};
    const inGrid=([x,y])=>x>=0&&x<W&&y>=0&&y<H,left=([x,y])=>vert?x<k:y<k;
    const rnd=()=>vert?[ri(0,k-1),ri(0,H-1)]:[ri(0,W-1),ri(0,k-1)];
    const S=new Map();const n=ri(3,6);
    let p=mixed?ri(1,3):0;let guard=0;
    while(p>0&&guard++<50){const c=rnd(),m=mir(ax,c);if(!S.has(key(c))&&!S.has(key(m))){S.set(key(c),c);S.set(key(m),m);p--;}}
    let s=0;guard=0;while(s<n&&guard++<80){let c=rnd();if(mixed&&RNG()<.5)c=mir(ax,c);const m=mir(ax,c);if(!S.has(key(c))&&!S.has(key(m))){S.set(key(c),c);s++;}}
    const cells=[...S.values()];if(!cells.every(inGrid))continue;const need=needAdd(cells,[ax]);if(need<2)continue;
    return {W,H,ax,cells,need,total:cells.length,fig:fb(figGrid({W,H,ax,cells,alt:`Lưới ô vuông có ${cells.length} ô được tô và đường thẳng d`}))};}
}
const toExp=o=>`Xét từng ô đã tô: nếu ô trùng với nó khi gấp theo d chưa được tô thì phải tô thêm ô đó. Có ${o.need} ô như vậy${o.total>o.need?` (các ô còn lại đã có ô trùng với nó được tô)`:''}, nên cần tô thêm ít nhất ${o.need} ô.`;
function genVeTo(mixed){return ()=>tryGen(()=>{const o=toData(mixed),n=o.need;
  return mk('Cần tô thêm ít nhất bao nhiêu ô vuông để hình gồm các ô được tô nhận đường thẳng d là trục đối xứng?',String(n),[C(String(o.total),'Đây là số ô đã tô. Chỉ cần tô các ô chưa có ô trùng với nó khi gấp theo d.'),C(String(n+o.total),'Đây là số ô của cả hình sau khi tô thêm, không phải số ô cần tô thêm.'),C(String(n-1),'Còn sót: mỗi ô đã tô chưa có ô trùng với nó đều cần thêm một ô.'),C(String(n+1),'Đếm thừa: ô đã có ô trùng với nó được tô thì không cần tô thêm.')],toExp(o),o.fig);});}
const genVeTo1=genVeTo(false),genVeTo2=genVeTo(true);
/* ---------- Hoàn thiện nửa hình: diện tích, chu vi ---------- */
function halfData(){for(;;){const k=4,H=5,n=ri(4,7),half=growHalf(k,H,n);if(half.length!==n)continue;
  const ax={o:'v',k},full=half.concat(half.map(c=>mir(ax,c))),P=perim(full),Ph=perim(half),onAx=half.filter(c=>c[0]===k-1).length;
  return {k,H,n,half,full,P,Ph,onAx,fig:fb(figGrid({W:2*k,H,ax,cells:half,alt:`Nửa bên trái của một hình gồm ${n} ô vuông, đường thẳng d`}))};}}
const HSTEM='Trên giấy kẻ ô vuông cạnh 1 cm, bạn Minh đã tô một nửa của một hình (các ô màu, nằm bên trái đường thẳng d). Minh tô tiếp nửa còn lại để được hình nhận d là trục đối xứng.';
function genVeDt(){return tryGen(()=>{const o=halfData(),A=2*o.n;
  return mk(HSTEM+' Diện tích của cả hình là:',A+' cm²',[C(o.n+' cm²','Đây mới là diện tích nửa hình đã tô.'),C(4*o.n+' cm²','Chỉ cần nhân đôi một lần: nửa còn lại có số ô bằng nửa đã tô.'),C((A+o.onAx)+' cm²','Đếm thừa các ô sát d: mỗi ô bên trái chỉ có đúng một ô trùng với nó bên phải.')],`Nửa đã tô có ${o.n} ô, nửa còn lại cũng có ${o.n} ô. Diện tích: ${o.n} · 2 = ${A} (cm²).`,o.fig);});}
const cvExp=o=>`Vẽ đủ hai nửa rồi đếm các cạnh ô nằm ở biên của cả hình: được ${o.P} cạnh, mỗi cạnh dài 1 cm, nên chu vi là ${o.P} cm. Chú ý ${o.onAx} cạnh ô của nửa trái nằm trên d không còn ở biên.`;
function genVeCv(){return tryGen(()=>{const o=halfData();
  return mk(HSTEM+' Chu vi của cả hình là:',o.P+' cm',[C(2*o.Ph+' cm','Chu vi cả hình không bằng 2 lần chu vi nửa hình: các cạnh nằm trên d không còn ở biên của hình.'),C(o.Ph+' cm','Đây là chu vi nửa hình đã tô.'),C((o.P+2)+' cm','Đếm sai số cạnh ở biên; hãy vẽ đủ cả hình rồi đếm lại.')],cvExp(o),o.fig);});}
/* ---------- Gấp giấy cắt hình ---------- */
const CUT={cn:'Hình chữ nhật',tamg:'Hình thoi',tgd:'Hình tam giác đều',luc:'Hình lục giác đều',nua:'Hình tròn',vg:'Hình vuông'};
const CUTW={'Hình chữ nhật':'Muốn được hình chữ nhật, phần cắt phải là hình chữ nhật có một cạnh nằm trên nếp gấp.','Hình thoi':'Muốn được hình thoi, phần cắt phải là tam giác có một cạnh nằm trên nếp gấp, đỉnh còn lại ở giữa cạnh ấy.','Hình tam giác đều':'Muốn được tam giác đều, phần cắt là nửa tam giác đều: một cạnh góc vuông nằm trên nếp gấp.','Hình lục giác đều':'Muốn được lục giác đều, phần cắt là nửa hình lục giác đều, hai đỉnh nằm trên nếp gấp.','Hình tròn':'Muốn được hình tròn, phần cắt phải là nửa hình tròn có đường kính nằm trên nếp gấp.','Hình vuông':'Muốn được hình vuông, phần cắt phải có dạng một nửa hình vuông (hai cạnh hoặc hai nửa đường chéo bằng nhau).'};
const CUTX={cn:'Phần cắt là hình chữ nhật có một cạnh trên nếp gấp; mở ra, hai nửa ghép lại thành hình chữ nhật (nếp gấp là trục đối xứng).',tamg:'Phần cắt là tam giác có một cạnh trên nếp gấp; mở ra được hình có bốn cạnh bằng nhau, nếp gấp là một đường chéo: hình thoi.',tgd:'Phần cắt là nửa tam giác đều (cạnh góc vuông trên nếp gấp); mở ra được tam giác đều.',luc:'Phần cắt là nửa hình lục giác đều (đường nối hai đỉnh đối diện nằm trên nếp gấp); mở ra được hình lục giác đều.',nua:'Phần cắt là nửa hình tròn có đường kính nằm trên nếp gấp; mở ra được hình tròn.',vg:'Phần cắt là tam giác có một cạnh trên nếp gấp, đỉnh còn lại cách nếp gấp đúng bằng nửa cạnh ấy; mở ra được hình có hai đường chéo bằng nhau: hình vuông.'};
function genUdMo(ks){return ()=>tryGen(()=>{const k=sel(ks),r=CUT[k];let w=Object.values(CUT).filter(t=>t!==r);if(k==='vg')w=w.filter(t=>t!=='Hình thoi'&&t!=='Hình chữ nhật');
  return mk('Gấp đôi một tờ giấy rồi cắt theo nét đỏ như hình bên. Mở tờ giấy ra, ta được hình gì?',r,shuffle(w).map(t=>C(t,CUTW[t])),CUTX[k],fb(figFold(k)));});}
const FOLD4=['Gấp theo nếp dọc (thẳng đứng)','Gấp theo nếp ngang (nằm ngang)','Gấp theo nếp dọc hoặc nếp ngang đều được','Không cắt được bằng cách gấp đôi tờ giấy một lần'];
const foldAns=c=>LET.doc.includes(c)?0:LET.ngang.includes(c)?1:LET.hai.includes(c)?2:3;
function genUdChu(){return tryGen(()=>{const c=sel(LETALL),r=foldAns(c);
  return mk(`Bạn Mai muốn cắt chữ ${c} (chữ in hoa) bằng cách gấp đôi tờ giấy theo trục đối xứng của chữ rồi chỉ cắt một nửa chữ. Mai phải gấp tờ giấy thế nào?`,FOLD4[r],FOLD4.map((t,i)=>i===r?null:C(t,letWhy(c))).filter(Boolean),letWhy(c)+(r===3?' Vì vậy không thể cắt bằng cách gấp đôi một lần.':' Nếp gấp phải nằm đúng trên trục đối xứng ấy.'),fb(figLet([c],'Chữ '+c)));});}
function rectData(){for(;;){const h=ri(3,10),w=ri(2,6);if(h===w||h===2*w)continue;return {h,w,P:2*(h+2*w),A:2*h*w};}}
const RSTEM=o=>`Gấp đôi một tờ giấy. Cắt theo nét vẽ một hình chữ nhật có một cạnh nằm trên nếp gấp: cạnh nằm trên nếp gấp dài ${o.h} cm, cạnh kia dài ${o.w} cm. Mở tờ giấy ra được một hình chữ nhật.`;
const rExp=o=>`Mở ra, cạnh nằm trên nếp gấp giữ nguyên ${o.h} cm; cạnh kia được nhân đôi: ${o.w} · 2 = ${2*o.w} (cm). Chu vi: ${nb(`2 · (${o.h} + ${2*o.w}) = ${o.P}`)} (cm).`;
function genUdCv(){return tryGen(()=>{const o=rectData();
  return mk(RSTEM(o)+' Chu vi hình chữ nhật đó là:',o.P+' cm',[C(2*(o.h+o.w)+' cm','Đây là chu vi phần cắt lúc giấy còn gấp; mở ra, cạnh kia dài gấp đôi.'),C(4*(o.h+o.w)+' cm','Chu vi không gấp đôi: cạnh nằm trên nếp gấp không bị nhân đôi.'),C(2*(2*o.h+o.w)+' cm','Nhầm cạnh được nhân đôi: cạnh nằm trên nếp gấp giữ nguyên, cạnh kia mới được nhân đôi.')],rExp(o),fb(figFold('cn')));});}
function rhoData(){for(;;){const h=2*ri(2,6),w=ri(2,7);if(h===2*w)continue;return {h,w,A:h*w};}}
const RHSTEM=o=>`Gấp đôi một tờ giấy. Cắt theo nét vẽ một hình tam giác có một cạnh dài ${o.h} cm nằm trên nếp gấp, đỉnh còn lại cách nếp gấp ${o.w} cm và nằm ngang giữa cạnh ấy. Mở tờ giấy ra được một hình thoi.`;
const rhExp=o=>`Hình thoi có một đường chéo nằm trên nếp gấp dài ${o.h} cm, đường chéo kia dài ${o.w} · 2 = ${2*o.w} (cm). Diện tích: ${nb(`${o.h} · ${2*o.w} : 2 = ${o.A}`)} (cm²).`;
function genUdDt(){return tryGen(()=>{const o=rhoData();
  return mk(RHSTEM(o)+' Diện tích hình thoi đó là:',o.A+' cm²',[C(o.A/2+' cm²','Đây là diện tích phần cắt lúc giấy còn gấp; mở ra diện tích gấp đôi.'),C(2*o.A+' cm²','Diện tích hình thoi bằng nửa tích hai đường chéo, không phải tích hai đường chéo.'),C(4*o.A+' cm²','Đường chéo nằm trên nếp gấp giữ nguyên, chỉ đường chéo kia được nhân đôi.')],rhExp(o),fb(figFold('tamg')));});}

/* ============ Ngân hàng nhiều lựa chọn ============ */
const MC=[
 {id:'m_dn',topic:'kn',level:'NB',stem:'Đường thẳng d là trục đối xứng của một hình nếu:',ans:0,opts:[
  {t:'gấp hình theo đường thẳng d thì hai phần của hình chồng khít lên nhau'},
  {t:'đường thẳng d chia hình thành hai phần',err:'Chưa đủ: hai phần đó còn phải chồng khít lên nhau khi gấp theo d.'},
  {t:'đường thẳng d chia hình thành hai phần có diện tích bằng nhau',err:'Hai phần bằng diện tích chưa chắc chồng khít; ví dụ đường chéo chia hình chữ nhật thành hai phần bằng nhau nhưng không phải trục đối xứng.'},
  {t:'đường thẳng d đi qua một đỉnh của hình',err:'Đi qua một đỉnh không liên quan; điều kiện là gấp theo d thì hai phần chồng khít.'}],
  exp:'Hình có trục đối xứng: có đường thẳng d chia hình thành hai phần mà nếu gấp hình theo d thì hai phần đó chồng khít lên nhau. Đường thẳng d là trục đối xứng.'},
 {id:'m_hd3',topic:'kn',level:'NB',stem:'Gấp đôi một tờ giấy, dùng kéo cắt theo một nét bất kì đi từ nếp gấp rồi quay lại nếp gấp, sau đó mở ra. Hình nhận được:',ans:0,opts:[
  {t:'có trục đối xứng là nếp gấp'},
  {t:'không có trục đối xứng',err:'Hai nửa được cắt cùng một lúc nên chồng khít lên nhau khi gấp theo nếp gấp: hình có trục đối xứng.'},
  {t:'luôn là hình tròn',err:'Hình nhận được tùy theo nét cắt, không phải lúc nào cũng là hình tròn.'},
  {t:'có trục đối xứng là một đường thẳng vuông góc với nếp gấp',err:'Trục đối xứng là chính nếp gấp, vì hai nửa chồng khít khi gấp theo nếp gấp.'}],
  exp:'Hai nửa hình được cắt cùng lúc trên hai lớp giấy nên khi gấp lại theo nếp gấp chúng chồng khít: nếp gấp là trục đối xứng của hình.'},
 {id:'m_tron',topic:'hp',level:'NB',stem:'Trục đối xứng của hình tròn là:',ans:0,opts:[
  {t:'mỗi đường thẳng đi qua tâm'},
  {t:'chỉ một đường thẳng nằm ngang đi qua tâm',err:'Không chỉ một đường: mọi đường thẳng đi qua tâm đều là trục đối xứng.'},
  {t:'mỗi đường thẳng cắt hình tròn',err:'Đường thẳng không đi qua tâm chia hình tròn thành hai phần không chồng khít.'},
  {t:'hình tròn không có trục đối xứng',err:'Gấp hình tròn theo đường thẳng đi qua tâm, hai nửa chồng khít (HĐ2 trong SGK).'}],
  exp:'Mỗi đường thẳng đi qua tâm là một trục đối xứng của hình tròn.'},
 {id:'m_thoi',topic:'hp',level:'NB',stem:'Trục đối xứng của hình thoi là:',ans:0,opts:[
  {t:'mỗi đường chéo của hình thoi'},
  {t:'mỗi cạnh của hình thoi',err:'Cạnh nằm ở biên của hình, không chia hình thành hai phần.'},
  {t:'mỗi đường thẳng đi qua trung điểm hai cạnh đối diện',err:'Đó là trục đối xứng của hình chữ nhật; với hình thoi (không vuông) gấp theo đường này hai phần không chồng khít.'},
  {t:'hình thoi không có trục đối xứng',err:'Gấp hình thoi theo đường chéo, hai phần chồng khít (HĐ5 trong SGK).'}],
  exp:'Mỗi đường chéo là một trục đối xứng của hình thoi.'},
 {id:'m_cn',topic:'hp',level:'NB',stem:'Trục đối xứng của hình chữ nhật là:',ans:0,opts:[
  {t:'mỗi đường thẳng đi qua trung điểm hai cạnh đối diện'},
  {t:'mỗi đường chéo của hình chữ nhật',err:'Gấp hình chữ nhật (không vuông) theo đường chéo, hai phần không chồng khít.'},
  {t:'mỗi đường thẳng đi qua một đỉnh',err:'Trục của hình chữ nhật đi qua trung điểm hai cạnh đối diện, không đi qua đỉnh.'},
  {t:'hình chữ nhật không có trục đối xứng',err:'Gấp hình chữ nhật theo đường nối trung điểm hai cạnh đối diện, hai phần chồng khít (HĐ6 trong SGK).'}],
  exp:'Mỗi đường thẳng đi qua trung điểm hai cạnh đối diện là một trục đối xứng của hình chữ nhật.'},
 {id:'m_co',topic:'kn',level:'TH',stem:'Lá cờ Việt Nam là hình chữ nhật nền đỏ, ở chính giữa có ngôi sao vàng năm cánh, một cánh hướng thẳng lên trên. Lá cờ có bao nhiêu trục đối xứng?',ans:0,opts:[
  {t:'1'},
  {t:'2',err:'Gấp theo đường nằm ngang thì ngôi sao không chồng khít (một cánh hướng lên, phía dưới có hai cánh), nên đường nằm ngang không phải trục.'},
  {t:'5',err:'Ngôi sao có 5 trục nhưng lá cờ hình chữ nhật: chỉ đường thẳng đứng đi qua giữa lá cờ là trục của cả hai.'},
  {t:'0',err:'Đường thẳng đứng đi qua giữa lá cờ là trục: gấp theo nó, nền đỏ và ngôi sao đều chồng khít.'}],
  exp:'Trục phải là trục của cả hình chữ nhật và ngôi sao. Hình chữ nhật có trục dọc và trục ngang; ngôi sao (cánh hướng lên) chỉ chồng khít khi gấp theo đường thẳng đứng. Lá cờ có 1 trục đối xứng.'}
].map(q=>Object.assign({type:'mc'},q));
const addMC=(id,topic,level,gen)=>MC.push({id,type:'mc',topic,level,gen});
const rep=(n,f)=>[...Array(n).keys()].map(i=>f('abcdef'[i]));
rep(3,x=>addMC('g_knco_'+x,'kn','NB',genKnCo));
rep(2,x=>addMC('g_knkhong_'+x,'kn','NB',genKnKhong));
rep(3,x=>addMC('g_letco_'+x,'kn','NB',genLetCo));
rep(1,x=>addMC('g_letkhong_'+x,'kn','NB',genLetKhong));
rep(2,x=>addMC('g_hpsonb_'+x,'hp','NB',genHpSoNB));
rep(1,x=>addMC('g_hpkhong_'+x,'hp','NB',genHpKhong));
rep(2,x=>addMC('g_knline_'+x,'kn','TH',genKnLine));
rep(1,x=>addMC('g_knlinenot_'+x,'kn','TH',genKnLineNot));
rep(1,x=>addMC('g_kndem_'+x,'kn','TH',genKnDem));
rep(2,x=>addMC('g_hpsoth_'+x,'hp','TH',genHpSoTH));
rep(1,x=>addMC('g_hpmost_'+x,'hp','TH',genHpMost));
rep(1,x=>addMC('g_hpdung2_'+x,'hp','TH',genHpDung2));
rep(1,x=>addMC('g_hptong_'+x,'hp','TH',genHpTong));
rep(2,x=>addMC('g_vegap_'+x,'ve','TH',genVeGap));
rep(1,x=>addMC('g_veto_'+x,'ve','TH',genVeTo1));
addMC('g_udmo_a','ud','TH',genUdMo(['cn','tamg','nua']));addMC('g_udmo_b','ud','TH',genUdMo(['tgd','luc','vg']));
rep(1,x=>addMC('g_udchu_'+x,'ud','TH',genUdChu));
rep(2,x=>addMC('g_hpghep_'+x,'hp','VD',genHpGhep));
rep(1,x=>addMC('g_hpstar_'+x,'hp','VD',genHpStar));
rep(2,x=>addMC('g_veto2_'+x,'ve','VD',genVeTo2));
rep(1,x=>addMC('g_vedt_'+x,'ve','VD',genVeDt));
rep(1,x=>addMC('g_vecv_'+x,'ve','VD',genVeCv));
rep(2,x=>addMC('g_udcv_'+x,'ud','VD',genUdCv));
rep(2,x=>addMC('g_uddt_'+x,'ud','VD',genUdDt));

/* ============ Đúng sai ============ */
function pick4(Ts,Fs){const nT=ri(1,3);return shuffle(shuffle(Ts).slice(0,nT).concat(shuffle(Fs).slice(0,4-nT)));}
const call=a=>a.map(f=>typeof f==='function'?f():f);
function four(make){return ()=>{for(let n=0;n<80;n++){const items=make();if(items.every(Boolean)&&tfOK(items))return {stem:'Xét các phát biểu sau:',items};}return FB_TF();};}
const letT=()=>{const c=sel([].concat(LET.doc,LET.ngang,LET.hai));return IT(`Chữ cái in hoa ${c} có trục đối xứng.`,true,'kn','NB',letWhy(c));};
const letF=()=>{const c=sel(LET.khong);return IT(`Chữ cái in hoa ${c} có trục đối xứng.`,false,'kn','NB',letWhy(c));};
const KN_T=[IT('Nếu gấp một hình theo trục đối xứng của nó thì hai phần của hình chồng khít lên nhau.',true,'kn','NB','Đó chính là tính chất của trục đối xứng.'),
  IT('Một hình có thể có nhiều hơn một trục đối xứng.',true,'kn','NB','Ví dụ hình chữ nhật có hai trục, hình tròn có vô số trục.'),
  IT('Có những hình không có trục đối xứng.',true,'kn','NB','Ví dụ hình bình hành, chữ F không có trục đối xứng.'),letT];
const KN_F=[IT('Mỗi đường thẳng chia một hình thành hai phần đều là trục đối xứng của hình đó.',false,'kn','NB','Hai phần còn phải chồng khít khi gấp theo đường thẳng đó.'),
  IT('Một hình chỉ có thể có nhiều nhất một trục đối xứng.',false,'kn','NB','Hình chữ nhật có hai trục, hình tròn có vô số trục.'),
  IT('Đường thẳng chia một hình thành hai phần có diện tích bằng nhau luôn là trục đối xứng của hình.',false,'kn','NB','Đường chéo chia hình chữ nhật thành hai phần bằng nhau nhưng không phải trục đối xứng.'),letF];
const HP_T=[IT('Mỗi đường thẳng đi qua tâm là một trục đối xứng của hình tròn.',true,'hp','NB','Nhận xét trong SGK.'),
  IT('Mỗi đường chéo là một trục đối xứng của hình thoi.',true,'hp','NB','Nhận xét trong SGK.'),
  IT('Mỗi đường thẳng đi qua trung điểm hai cạnh đối diện là một trục đối xứng của hình chữ nhật.',true,'hp','NB','Nhận xét trong SGK.'),
  IT('Hình tròn có vô số trục đối xứng.',true,'hp','NB','Mỗi đường thẳng đi qua tâm là một trục.'),
  IT('Hình chữ nhật có hai trục đối xứng.',true,'hp','NB','Hai đường thẳng đi qua trung điểm hai cạnh đối diện.')];
const HP_F=[IT('Mỗi đường chéo là một trục đối xứng của hình chữ nhật.',false,'hp','NB','Gấp hình chữ nhật (có hai cạnh kề không bằng nhau) theo đường chéo, hai phần không chồng khít.'),
  IT('Hình tròn chỉ có hai trục đối xứng.',false,'hp','NB','Mỗi đường thẳng đi qua tâm là một trục, nên có vô số trục.'),
  IT('Hình bình hành có hai trục đối xứng là hai đường chéo.',false,'hp','NB','Hình bình hành không có trục đối xứng.'),
  IT('Mỗi đường thẳng cắt hình tròn đều là trục đối xứng của hình tròn.',false,'hp','NB','Chỉ đường thẳng đi qua tâm mới là trục.'),
  IT('Hình thoi có bốn trục đối xứng.',false,'hp','NB','Hình thoi (không vuông) chỉ có 2 trục là hai đường chéo.')];
const tfNB=(Ts,Fs)=>four(()=>call(pick4(Ts,Fs)));
const HPT_T=[IT('Hình vuông có 4 trục đối xứng.',true,'hp','TH','Hai đường chéo và hai đường thẳng đi qua trung điểm hai cạnh đối diện.'),
  IT('Hình tam giác đều có 3 trục đối xứng.',true,'hp','TH','Mỗi đường thẳng đi qua một đỉnh và trung điểm cạnh đối diện.'),
  IT('Hình lục giác đều có 6 trục đối xứng.',true,'hp','TH','3 đường qua hai đỉnh đối diện và 3 đường qua trung điểm hai cạnh đối diện.'),
  IT('Hình thang cân có đúng một trục đối xứng.',true,'hp','TH','Trục đi qua trung điểm hai đáy.'),
  IT('Hình bình hành không có trục đối xứng.',true,'hp','TH','Gấp theo đường nào hai phần cũng không chồng khít.'),
  IT('Mỗi đường chéo là một trục đối xứng của hình vuông.',true,'hp','TH','Hình vuông cũng là hình thoi nên mỗi đường chéo là một trục.')];
const HPT_F=[IT('Hình vuông có 2 trục đối xứng.',false,'hp','TH','Hình vuông có 4 trục đối xứng.'),
  IT('Hình tam giác đều có 1 trục đối xứng.',false,'hp','TH','Hình tam giác đều có 3 trục đối xứng.'),
  IT('Hình lục giác đều có 3 trục đối xứng.',false,'hp','TH','Hình lục giác đều có 6 trục đối xứng.'),
  IT('Mỗi đường chéo là một trục đối xứng của hình thang cân.',false,'hp','TH','Trục của hình thang cân là đường thẳng đi qua trung điểm hai đáy.'),
  IT('Hình thang cân có hai trục đối xứng.',false,'hp','TH','Hai đáy dài khác nhau nên chỉ có 1 trục.'),
  IT('Hình chữ nhật có nhiều trục đối xứng hơn hình vuông.',false,'hp','TH','Hình chữ nhật có 2 trục, hình vuông có 4 trục.')];
const KNT_T=[()=>{const c=sel(LET.hai);return IT(`Chữ cái in hoa ${c} có hai trục đối xứng.`,true,'kn','TH',letWhy(c));},
  ()=>{const c=sel(LET.ngang);return IT(`Chữ cái in hoa ${c} có trục đối xứng nằm ngang.`,true,'kn','TH',letWhy(c));},
  ()=>{const c=sel(LET.doc);return IT(`Chữ cái in hoa ${c} có trục đối xứng thẳng đứng.`,true,'kn','TH',letWhy(c));},
  ()=>{const l=sel(['cn','tc','lgd'].map(k=>[k,LN[k].find(x=>x.ax)]));return IT(`Đường thẳng đi qua ${l[0]==='cn'?'trung điểm hai cạnh đối diện của hình chữ nhật':l[0]==='tc'?'trung điểm hai đáy của hình thang cân':'hai đỉnh đối diện của hình lục giác đều'} là trục đối xứng của hình đó.`,true,'kn','TH',l[1].why);}];
const KNT_F=[()=>{const c=sel(LET.doc);return IT(`Chữ cái in hoa ${c} có hai trục đối xứng.`,false,'kn','TH',letWhy(c));},
  ()=>{const c=sel(LET.doc);return IT(`Chữ cái in hoa ${c} có trục đối xứng nằm ngang.`,false,'kn','TH',letWhy(c));},
  ()=>{const c=sel(LET.ngang);return IT(`Chữ cái in hoa ${c} có trục đối xứng thẳng đứng.`,false,'kn','TH',letWhy(c));},
  IT('Đường chéo của hình chữ nhật là trục đối xứng của hình chữ nhật đó.',false,'kn','TH',LN.cn[1].why),
  IT('Đường chéo của hình bình hành là trục đối xứng của hình bình hành đó.',false,'kn','TH',LN.bh[0].why)];
/* Lưới: điểm trùng và tô thêm */
function tfGrid(){
  for(let n=0;n<60;n++){const o=toData(false),ax=o.ax,vert=ax.o==='v';
    const S=new Set(o.cells.map(key));const free=[];for(let x=0;x<o.W;x++)for(let y=0;y<o.H;y++){const c=[x,y],m=mir(ax,c);if((vert?x<ax.k:y<ax.k)&&!S.has(key(c))&&!S.has(key(m)))free.push(c);}
    if(!free.length)continue;const A=sel(free),M=mir(ax,A),Wr=vert?[M[0],M[1]+sel([-1,1])]:[M[0]+sel([-1,1]),M[1]];
    if(Wr[0]<0||Wr[0]>=o.W||Wr[1]<0||Wr[1]>=o.H||S.has(key(Wr)))continue;
    const L=shuffle(['M','N']),v=[0,1,2].map(()=>RNG()<.5);
    const fig=fb(figGrid({W:o.W,H:o.H,ax,cells:o.cells,pts:[{x:A[0],y:A[1],l:'A'},{x:M[0],y:M[1],l:L[0]},{x:Wr[0],y:Wr[1],l:L[1]}],alt:'Lưới ô vuông có các ô được tô, đường thẳng d và ba điểm A, M, N'}));
    const nShow=v[1]?o.need:o.need+sel([-1,1]),mShow=v[2]?o.total+o.need:o.total+o.need+sel([-2,2]);
    const items=[IT(`Khi gấp theo d, điểm A trùng với điểm ${v[0]?L[0]:L[1]}.`,v[0],'ve','TH',`A trùng với điểm cùng ${vert?'hàng':'cột'}, cách d cùng số ô ở phía bên kia: điểm ${L[0]}.`),
      IT(`Cần tô thêm đúng ${nShow} ô thì hình gồm các ô được tô nhận d là trục đối xứng.`,v[1],'ve','TH',toExp(o)),
      IT(`Sau khi tô thêm ít nhất số ô cần thiết, hình có tất cả ${mShow} ô.`,v[2],'ve','TH',`Có ${o.total} ô đã tô, tô thêm ${o.need} ô: ${o.total} + ${o.need} = ${o.total+o.need} (ô).`),
      IT(`Nếu chỉ tô thêm ${o.need-1} ô thì hình đã có thể nhận d là trục đối xứng.`,false,'ve','TH',`Cần ít nhất ${o.need} ô: mỗi ô đã tô chưa có ô trùng với nó đều cần thêm một ô.`)];
    if(tfOK(items))return {stem:'Quan sát hình vẽ trên giấy kẻ ô vuông. Xét các phát biểu sau:',fig,items};}
  return FB_TF();
}
const UDT_T=[IT('Gấp đôi tờ giấy rồi cắt một nửa hình tròn có đường kính nằm trên nếp gấp, mở ra ta được một hình tròn.',true,'ud','TH',CUTX.nua),
  ()=>{const c=sel(LET.doc);return IT(`Để cắt chữ ${c} bằng cách gấp đôi tờ giấy một lần, ta gấp theo nếp dọc (thẳng đứng).`,true,'ud','TH',letWhy(c));},
  ()=>{const c=sel(LET.ngang);return IT(`Để cắt chữ ${c} bằng cách gấp đôi tờ giấy một lần, ta gấp theo nếp ngang.`,true,'ud','TH',letWhy(c));},
  ()=>{const o=rectData();return IT(RSTEM(o)+` Chu vi hình chữ nhật đó là ${o.P} cm.`,true,'ud','TH',rExp(o));}];
const UDT_F=[IT('Cắt hình chữ nhật có một cạnh nằm trên nếp gấp từ tờ giấy gấp đôi; mở ra, cạnh nằm trên nếp gấp dài gấp đôi.',false,'ud','TH','Cạnh nằm trên nếp gấp giữ nguyên; cạnh kia mới được nhân đôi.'),
  ()=>{const c=sel(LET.khong);return IT(`Có thể cắt được chữ ${c} bằng cách gấp đôi tờ giấy một lần rồi cắt một nửa chữ.`,false,'ud','TH',letWhy(c));},
  ()=>{const c=sel(LET.doc);return IT(`Để cắt chữ ${c} bằng cách gấp đôi tờ giấy một lần, ta gấp theo nếp ngang.`,false,'ud','TH',letWhy(c));},
  ()=>{const o=rectData();return IT(RSTEM(o)+` Chu vi hình chữ nhật đó là ${2*(o.h+o.w)} cm.`,false,'ud','TH',rExp(o));}];
/* Vận dụng: hình ghép, so sánh số trục */
function hpVdItems(){const v=[0,1,2,3].map(()=>RNG()<.5),k=sel(Object.keys(GH)),o=sumData();
  const cmp=sel([['hình lục giác đều','hình tam giác đều','gấp đôi',true],['hình vuông','hình chữ nhật','gấp đôi',true],['hình lục giác đều','hình chữ nhật','gấp ba',true],['hình vuông','hình thang cân','gấp ba',false],['hình tam giác đều','hình thoi','gấp đôi',false],['hình lục giác đều','hình vuông','gấp đôi',false]]);
  const sk=sel(['sao5','sao6']),sax=SH[sk].ax;
  return [IT(`Hình gồm ${nameOf(k)} và một hình tròn có cùng tâm có ${v[0]?SH[k].ax:'vô số'} trục đối xứng.`,v[0],'hp','VD',ghepExp(k)),
    IT(`Tổng số trục đối xứng của ${o.txt} là ${v[1]?o.s:o.s+sel([-2,-1,1,2])}.`,v[1],'hp','VD',o.exp),
    IT(`${Cap(cmp[0])} có số trục đối xứng ${cmp[2]} số trục đối xứng của ${cmp[1]}.`,cmp[3],'hp','VD',`${Cap(cmp[0])}: ${{'hình lục giác đều':6,'hình vuông':4,'hình tam giác đều':3}[cmp[0]]} trục; ${cmp[1]}: ${{'hình tam giác đều':3,'hình chữ nhật':2,'hình thang cân':1,'hình thoi':2,'hình vuông':4}[cmp[1]]} trục.`),
    IT(`Ngôi sao ${sk==='sao5'?'năm':'sáu'} cánh đều có ${v[3]?sax:2*sax} trục đối xứng.`,v[3],'hp','VD',starExp(sk))];}
/* Tình huống thực tế (đúng sai) */
function chuData(){for(;;){const list=shuffle(LETALL).slice(0,5);const k=list.filter(c=>letAx(c)>0).length;if(k<2||k>4)continue;const a=ri(4,8),b=ri(6,10);return {list,k,a,b,S:k*a*b};}}
const chuStem=o=>`Lớp 6A cắt các chữ in hoa ${o.list.join(', ')} để trang trí bảng tin. Mỗi chữ được cắt từ một mảnh giấy hình chữ nhật ${o.a} cm × ${o.b} cm. Chữ nào có trục đối xứng thì gấp đôi mảnh giấy theo trục ấy rồi chỉ cắt một nửa chữ.`;
const chuExp=o=>o.list.map(letWhy).join(' ');
function ctxChu(){const o=chuData(),v=[0,1,2,3].map(()=>RNG()<.5),x=sel(o.list),y=sel(o.list);
  return {stem:chuStem(o),items:[
    IT(`Chữ ${x} cắt được bằng cách gấp mảnh giấy theo nếp dọc (thẳng đứng).`,LET.doc.includes(x)||LET.hai.includes(x),'ud','VD',letWhy(x)),
    IT(`Có đúng ${v[1]?o.k:o.k+sel([-1,1])} chữ cắt được bằng cách gấp đôi mảnh giấy.`,v[1],'kn','VD',chuExp(o)+` Có ${o.k} chữ có trục đối xứng.`),
    IT(`Chữ ${y} có thể gấp theo nếp dọc hoặc nếp ngang đều được.`,LET.hai.includes(y),'kn','VD',letWhy(y)),
    IT(`Tổng diện tích các mảnh giấy dùng để cắt những chữ có trục đối xứng là ${v[3]?o.S:o.S+sel([-1,1])*o.a*o.b} cm².`,v[3],'ud','VD',`Có ${o.k} chữ có trục đối xứng, mỗi mảnh giấy ${o.a} · ${o.b} = ${o.a*o.b} (cm²). Tổng: ${o.k} · ${o.a*o.b} = ${o.S} (cm²).`)]};}
const LSTEM='Bạn Nga thiết kế một logo trên giấy kẻ ô vuông cạnh 1 cm. Nga đã tô nửa bên trái (các ô màu); logo hoàn chỉnh nhận đường thẳng d là trục đối xứng.';
function ctxLuoi(){const o=halfData(),v=[0,1,2].map(()=>RNG()<.5);
  return {stem:LSTEM,fig:o.fig,items:[
    IT(`Nga cần tô thêm đúng ${v[0]?o.n:o.n+sel([-1,1])} ô ở bên phải d.`,v[0],'ve','VD',`Mỗi ô bên trái có đúng một ô trùng với nó bên phải: cần tô thêm ${o.n} ô.`),
    IT(`Diện tích logo là ${v[1]?2*o.n:o.n} cm².`,v[1],'ve','VD',`Logo có ${o.n} · 2 = ${2*o.n} ô, diện tích ${2*o.n} cm².`),
    IT(`Chu vi logo là ${v[2]?o.P:2*o.Ph} cm.`,v[2],'ve','VD',cvExp(o)),
    IT('Chu vi logo bằng hai lần chu vi phần Nga đã tô.',false,'ve','VD',`Chu vi phần đã tô là ${o.Ph} cm, chu vi logo là ${o.P} cm, khác ${2*o.Ph} cm vì các cạnh ô nằm trên d không còn ở biên.`)]};}
function ctxGiay(){const o=rectData(),q=rhoData(),v=[0,1,2,3].map(()=>RNG()<.5);
  return {stem:`Bạn Huy gấp đôi hai tờ giấy. Tờ thứ nhất: cắt hình chữ nhật có một cạnh dài ${o.h} cm nằm trên nếp gấp, cạnh kia dài ${o.w} cm. Tờ thứ hai: cắt hình tam giác có một cạnh dài ${q.h} cm nằm trên nếp gấp, đỉnh còn lại cách nếp gấp ${q.w} cm và nằm ngang giữa cạnh ấy.`,items:[
    IT(`Mở tờ thứ nhất ra được hình chữ nhật có hai cạnh là ${v[0]?o.h:2*o.h} cm và ${v[0]?2*o.w:o.w} cm.`,v[0],'ud','VD',`Cạnh trên nếp gấp giữ nguyên ${o.h} cm, cạnh kia nhân đôi thành ${2*o.w} cm.`),
    IT(`Chu vi hình chữ nhật mở ra là ${v[1]?o.P:4*(o.h+o.w)} cm.`,v[1],'ud','VD',rExp(o)),
    IT(`Mở tờ thứ hai ra được hình thoi có hai đường chéo dài ${v[2]?q.h:q.h/2} cm và ${v[2]?2*q.w:q.w} cm.`,v[2],'ud','VD',`Đường chéo trên nếp gấp dài ${q.h} cm, đường chéo kia dài ${q.w} · 2 = ${2*q.w} (cm).`),
    IT(`Diện tích hình thoi mở ra là ${v[3]?q.A:2*q.A} cm².`,v[3],'ud','VD',rhExp(q))]};}
function tfCtx(make){return ()=>{for(let n=0;n<80;n++){const u=make();if(tfOK(u.items))return u;}return FB_TF();};}
const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
addTF('tf_nb_kn_a','kn','NB',tfNB(KN_T,KN_F));addTF('tf_nb_kn_b','kn','NB',tfNB(KN_T,KN_F));
addTF('tf_nb_hp_a','hp','NB',tfNB(HP_T,HP_F));addTF('tf_nb_hp_b','hp','NB',tfNB(HP_T,HP_F));
addTF('tf_nb_mix','hp','NB',tfNB(HP_T.concat(KN_T),HP_F.concat(KN_F)));
addTF('tf_hp_th_a','hp','TH',tfNB(HPT_T,HPT_F));addTF('tf_hp_th_b','hp','TH',tfNB(HPT_T,HPT_F));
addTF('tf_kn_th','kn','TH',tfNB(KNT_T,KNT_F));
addTF('tf_ve_th_a','ve','TH',tfGrid);addTF('tf_ve_th_b','ve','TH',tfGrid);
addTF('tf_ud_th','ud','TH',tfNB(UDT_T,UDT_F));
addTF('tf_hp_vd','hp','VD',four(hpVdItems));
addTF('tf_ctx_chu','ud','VD',tfCtx(ctxChu));
addTF('tf_ctx_luoi','ve','VD',tfCtx(ctxLuoi));
addTF('tf_ctx_giay','ud','VD',tfCtx(ctxGiay));

/* ============ Trả lời ngắn ============ */
function saHpSo(){const k=sel(['cn','thoi','vuong']);return {stem:`Một tờ giấy có dạng ${nameOf(k)}. Có bao nhiêu cách gấp tờ giấy làm đôi (theo một đường thẳng) để hai nửa chồng khít lên nhau?`,ans:[SH[k].ax],exp:`Mỗi cách gấp như vậy là gấp theo một trục đối xứng. ${AXX[k]}`};}
function saKnNamed(){const ks=shuffle(['vuong','cn','thoi','tron','bh','tc','tgd']).slice(0,4),n=ks.filter(k=>SH[k].ax>0).length;
  return {stem:`Trong các hình: ${ks.map(nameOf).join(', ')}, có bao nhiêu hình có trục đối xứng?`,ans:[n],exp:ks.map(k=>`${Cap(nameOf(k))}: ${SH[k].ax>0?'có':'không có'} trục đối xứng`).join('; ')+`. Có ${n} hình.`};}
function saKnRow(){const {keys,n}=countRow();return {stem:'Trong bốn hình dưới đây, có bao nhiêu hình có trục đối xứng?',fig:fb(figRow(keys)),ans:[n],exp:cntExp(keys)+` Có ${n} hình.`};}
function saLet(){const list=shuffle(LETALL).slice(0,6),n=list.filter(c=>letAx(c)>0).length;return {stem:`Trong các chữ cái in hoa ${list.join(', ')}, có bao nhiêu chữ cái có trục đối xứng?`,fig:fb(figLet(list)),ans:[n],exp:list.map(letWhy).join(' ')+` Có ${n} chữ.`};}
function saHpTong(){const o=sumData();return {stem:`Tổng số trục đối xứng của ${o.txt} là bao nhiêu?`,ans:[o.s],exp:o.exp};}
function numData(){for(;;){const vert=RNG()<.5,W=vert?6:4,H=vert?3:4,ax={o:vert?'v':'h',k:vert?3:2};const c=[ri(0,W-1),ri(0,H-1)],m=mir(ax,c),a=c[1]*W+c[0]+1,b=m[1]*W+m[0]+1;if(Math.abs(a-b)<2)continue;return {W,H,ax,a,b,vert};}}
function saVeNum(){const o=numData();return {stem:`Các ô vuông được đánh số như hình. Gấp tờ giấy theo đường thẳng d, ô số ${o.a} trùng với ô số mấy?`,fig:fb(figGrid({W:o.W,H:o.H,ax:o.ax,num:true,alt:'Lưới ô vuông đánh số và đường thẳng d'})),ans:[o.b],exp:`Ô số ${o.a} và ô trùng với nó nằm cùng ${o.vert?'hàng':'cột'}, cách d cùng một số ô ở hai phía của d: đó là ô số ${o.b}.`};}
function saVeTo(mixed){return ()=>{const o=toData(mixed);return {stem:'Cần tô thêm ít nhất bao nhiêu ô vuông để hình gồm các ô được tô nhận đường thẳng d là trục đối xứng?',fig:o.fig,ans:[o.need],exp:toExp(o)};};}
const GH2={
  lt:{ax:3,d:()=>SH.lgd.d()+poly(regPoly(3,40,0)),alt:'Hình lục giác đều và hình tam giác đều có ba đỉnh là ba đỉnh cách nhau của lục giác',exp:'Gấp theo một đường thẳng, cả hai hình phải cùng chồng khít. Lục giác đều có 6 trục, nhưng chỉ 3 trục đi qua một đỉnh của tam giác và trung điểm cạnh đối diện của tam giác cũng là trục của tam giác đều. Hình có 3 trục đối xứng.'},
  vt:{ax:2,d:()=>SH.vuong.d()+poly([[50,18],[78,50],[50,82],[22,50]]),alt:'Hình vuông và một hình thoi nằm bên trong, hai hình có cùng tâm',exp:'Hình vuông có 4 trục, hình thoi chỉ có 2 trục là hai đường chéo (một đường đứng, một đường ngang). Hai đường chéo hình vuông không phải trục của hình thoi. Hình có 2 trục đối xứng.'},
  ct:{ax:2,d:()=>SH.cn.d()+poly([[50,26],[92,50],[50,74],[8,50]]),alt:'Hình chữ nhật và hình thoi có bốn đỉnh là trung điểm bốn cạnh của hình chữ nhật',exp:'Hai đường chéo của hình thoi chính là hai đường thẳng đi qua trung điểm hai cạnh đối diện của hình chữ nhật: cả hai hình chồng khít khi gấp theo hai đường này. Hình có 2 trục đối xứng.'}
};
function saGhep(){const k=sel(Object.keys(GH2)),g=GH2[k];return {stem:'Hình bên gồm hai hình có cùng tâm. Hình đó có bao nhiêu trục đối xứng?',fig:fb(`<svg class="fig" viewBox="0 0 100 100" style="max-width:150px" role="img" aria-label="${g.alt}">${g.d()}</svg>`),ans:[g.ax],exp:g.exp};}
function saStar(){const k=sel(STARK2);return {stem:'Ngôi sao ở hình bên có bao nhiêu trục đối xứng?',fig:fb(figOne(k)),ans:[SH[k].ax],exp:starExp(k)};}
function saVeDt(){const o=halfData();return {stem:HSTEM+' Diện tích của cả hình là bao nhiêu xăng-ti-mét vuông?',fig:o.fig,ans:[2*o.n],exp:`Nửa đã tô có ${o.n} ô, nửa còn lại cũng có ${o.n} ô. Diện tích: ${o.n} · 2 = ${2*o.n} (cm²).`};}
function saVeCv(){const o=halfData();return {stem:HSTEM+' Chu vi của cả hình là bao nhiêu xăng-ti-mét?',fig:o.fig,ans:[o.P],exp:cvExp(o)};}
function saUdCv(){const o=rectData();return {stem:RSTEM(o)+' Chu vi hình chữ nhật đó là bao nhiêu xăng-ti-mét?',fig:fb(figFold('cn')),ans:[o.P],exp:rExp(o)};}
function saUdDt(){const o=rhoData();return {stem:RHSTEM(o)+' Diện tích hình thoi đó là bao nhiêu xăng-ti-mét vuông?',fig:fb(figFold('tamg')),ans:[o.A],exp:rhExp(o)};}
function saUdCanh(){const o=rectData();return {stem:RSTEM(o)+' Cạnh không nằm trên nếp gấp của hình chữ nhật mở ra dài bao nhiêu xăng-ti-mét?',fig:fb(figFold('cn')),ans:[2*o.w],exp:`Khi mở ra, cạnh đi ra từ nếp gấp được nhân đôi: ${o.w} · 2 = ${2*o.w} (cm). Cạnh nằm trên nếp gấp giữ nguyên ${o.h} cm.`};}
const SA=[
 {id:'s_hp_nb_a',topic:'hp',level:'NB',unit:'cách',gen:saHpSo},
 {id:'s_hp_nb_b',topic:'hp',level:'NB',unit:'cách',gen:saHpSo},
 {id:'s_kn_nb',topic:'kn',level:'NB',unit:'hình',gen:saKnNamed},
 {id:'s_kn_th',topic:'kn',level:'TH',unit:'hình',gen:saKnRow},
 {id:'s_let_th',topic:'kn',level:'TH',unit:'chữ',gen:saLet},
 {id:'s_hp_th',topic:'hp',level:'TH',unit:'trục',gen:saHpTong},
 {id:'s_ve_num_a',topic:'ve',level:'TH',unit:'',gen:saVeNum},
 {id:'s_ve_num_b',topic:'ve',level:'TH',unit:'',gen:saVeNum},
 {id:'s_ve_to',topic:'ve',level:'TH',unit:'ô',gen:saVeTo(false)},
 {id:'s_ud_th',topic:'ud',level:'TH',unit:'cm',gen:saUdCanh},
 {id:'s_hp_vd',topic:'hp',level:'VD',unit:'trục',gen:saGhep},
 {id:'s_hp_star',topic:'hp',level:'VD',unit:'trục',gen:saStar},
 {id:'s_ve_to2',topic:'ve',level:'VD',unit:'ô',gen:saVeTo(true)},
 {id:'s_ve_dt',topic:'ve',level:'VD',unit:'cm²',gen:saVeDt},
 {id:'s_ve_cv',topic:'ve',level:'VD',unit:'cm',gen:saVeCv},
 {id:'s_ud_cv',topic:'ud',level:'VD',unit:'cm',gen:saUdCv},
 {id:'s_ud_dt',topic:'ud',level:'VD',unit:'cm²',gen:saUdDt}
].map(q=>Object.assign({type:'sa'},q));

/* ============ Gói Thử thách (30 phút) ============ */
/* Dòng chữ in hoa: có trục ngang khi mọi chữ có trục ngang; có trục dọc khi đọc ngược vẫn như cũ và mọi chữ có trục dọc */
const hasH=c=>LET.ngang.includes(c)||LET.hai.includes(c),hasV=c=>LET.doc.includes(c)||LET.hai.includes(c);
const wordH=w=>[...w].every(hasH),wordV=w=>[...w].every(hasV)&&[...w].reverse().join('')===w;
function wordGen(kind){for(;;){let w;
  if(kind==='h')w=Array.from({length:ri(3,4)},()=>sel([].concat(LET.ngang,LET.hai))).join('');
  else if(kind==='v'){const n=ri(1,2),h=Array.from({length:n},()=>sel([].concat(LET.doc,LET.hai))),mid=RNG()<.5?[sel([].concat(LET.doc,LET.hai))]:[];w=h.concat(mid,h.slice().reverse()).join('');}
  else w=Array.from({length:ri(3,4)},()=>sel(LETALL)).join('');
  if(w.length>=3)return w;}}
function tfHard(){
  for(let n=0;n<80;n++){const v=[0,1,2].map(()=>RNG()<.5);
    const w1=wordGen(v[0]?'h':'x'),w2=wordGen(v[1]?'v':'x'),o=rectData();
    const items=shuffle([
      IT(`Dòng chữ ${w1} có trục đối xứng nằm ngang.`,wordH(w1),'kn','VD',`Dòng chữ có trục nằm ngang khi mọi chữ cái trong dòng đều có trục nằm ngang (cùng nằm trên đường giữa dòng). ${[...new Set(w1)].map(letWhy).join(' ')}`),
      IT(`Dòng chữ ${w2} có trục đối xứng thẳng đứng.`,wordV(w2),'kn','VD',`Gấp theo đường thẳng đứng ở giữa dòng thì chữ đầu trùng chữ cuối, chữ thứ hai trùng chữ kế cuối, ...: các cặp chữ phải giống nhau và mỗi chữ phải có trục thẳng đứng. ${[...new Set(w2)].map(letWhy).join(' ')}`),
      IT(`Cắt từ tờ giấy gấp đôi một hình chữ nhật có cạnh ${o.h} cm nằm trên nếp gấp, cạnh kia ${o.w} cm. Chu vi hình mở ra ${v[2]?'nhỏ hơn':'lớn hơn'} 2 lần chu vi phần cắt.`,v[2],'ud','VD',`Chu vi hình mở ra: ${o.P} cm; 2 lần chu vi phần cắt: ${4*(o.h+o.w)} cm. Hình mở ra luôn có chu vi nhỏ hơn vì cạnh nằm trên nếp gấp không bị nhân đôi.`),
      IT('Nếu một hình có đúng hai trục đối xứng thì hai trục đó là hai đường chéo của hình.',false,'hp','VD','Hình chữ nhật có đúng hai trục nhưng đó là hai đường thẳng đi qua trung điểm hai cạnh đối diện, không phải đường chéo.')]);
    if(tfOK(items))return {stem:'Xét các phát biểu sau:',items};}
  return FB_TF();
}
function hHai(){for(;;){const W=8,H=8,a1={o:'v',k:4},a2={o:'h',k:4},S=new Map();const n=ri(3,5);
  for(let i=0;i<n;i++){const c=[ri(0,7),ri(0,7)];S.set(key(c),c);}
  const cells=[...S.values()],need=needAdd(cells,[a1,a2]);if(need<5||need>14)continue;
  const g=figGrid({W,H,ax:a1,cells,alt:'Lưới 8 × 8 ô có các ô được tô và hai đường thẳng d, d′'}).replace('</svg>',`<line class="ax" data-ax="h,4" x1="6" y1="${14+12+4*24}" x2="${14+8*24+8}" y2="${14+12+4*24}"/><text class="vl" x="${14+8*24+4}" y="${14+12+4*24-6}" text-anchor="end">d′</text></svg>`);
  return {stem:'Cần tô thêm ít nhất bao nhiêu ô vuông để hình gồm các ô được tô nhận cả hai đường thẳng d và d′ là trục đối xứng?',fig:fb(g),ans:[need],exp:`Mỗi ô đã tô kéo theo các ô trùng với nó khi gấp theo d, khi gấp theo d′, và khi gấp tiếp theo cả hai đường (tối đa 4 ô ở bốn phần lưới). Đếm các ô trong nhóm đó chưa được tô: cần tô thêm ${need} ô.`};}}
function h2lan(){for(;;){const a=2*ri(4,10),c=ri(1,a/2-1);const R=a*a-4*c*c;
  return {stem:`Một tờ giấy hình vuông cạnh ${a} cm được gấp đôi, rồi gấp đôi tiếp để được hình vuông nhỏ cạnh ${a/2} cm (hai nếp gấp đều đi qua trung điểm hai cạnh đối diện của tờ giấy). Ở góc có hai nếp gấp, cắt bỏ một hình vuông cạnh ${c} cm. Mở tờ giấy ra, diện tích phần giấy còn lại là bao nhiêu xăng-ti-mét vuông?`,ans:[R],exp:`Mở ra, lỗ cắt là hình vuông ở giữa tờ giấy, cạnh ${c} · 2 = ${2*c} (cm), diện tích ${2*c} · ${2*c} = ${4*c*c} (cm²). Phần còn lại: ${a} · ${a} − ${4*c*c} = ${R} (cm²).`};}}
function hCv(){for(;;){const k=5,H=6,n=ri(8,12),half=growHalf(k,H,n);if(half.length!==n)continue;const ax={o:'v',k},full=half.concat(half.map(c=>mir(ax,c))),P=perim(full);
  return {stem:HSTEM+' Chu vi của cả hình là bao nhiêu xăng-ti-mét?',fig:fb(figGrid({W:2*k,H,ax,cells:half,alt:`Nửa bên trái của một hình gồm ${n} ô vuông, đường thẳng d`})),ans:[P],exp:`Vẽ đủ hai nửa rồi đếm các cạnh ô nằm ở biên của cả hình: ${P} cạnh, mỗi cạnh 1 cm. Chu vi ${P} cm.`};}}
function hLet(){const list=shuffle(LETALL).slice(0,8),n=list.filter(c=>letAx(c)===1).length;
  return {stem:`Trong các chữ cái in hoa ${list.join(', ')}, có bao nhiêu chữ cái có đúng một trục đối xứng?`,fig:fb(figLet(list)),ans:[n],exp:list.map(letWhy).join(' ')+` Chữ có hai trục (H, I, O, X) và chữ không có trục không được tính. Có ${n} chữ.`};}
function hRectBack(){const o=rectData();return {stem:`Gấp đôi một tờ giấy rồi cắt một hình chữ nhật có một cạnh nằm trên nếp gấp. Mở ra được hình chữ nhật có chu vi ${o.P} cm, trong đó cạnh nằm trên nếp gấp dài ${o.h} cm. Lúc giấy còn gấp, cạnh còn lại của phần cắt dài bao nhiêu xăng-ti-mét?`,ans:[o.w],exp:`Nửa chu vi hình mở ra: ${o.P} : 2 = ${o.P/2} (cm). Cạnh kia của hình mở ra: ${o.P/2} − ${o.h} = ${2*o.w} (cm). Cạnh này gấp đôi cạnh của phần cắt, nên phần cắt có cạnh ${2*o.w} : 2 = ${o.w} (cm).`};}
function hRhoBack(){const o=rhoData();return {stem:`Gấp đôi một tờ giấy rồi cắt một hình tam giác có một cạnh dài ${o.h} cm nằm trên nếp gấp, đỉnh còn lại nằm ngang giữa cạnh ấy. Mở ra được hình thoi có diện tích ${o.A} cm². Đỉnh còn lại của tam giác cách nếp gấp bao nhiêu xăng-ti-mét?`,ans:[o.w],exp:`Diện tích hình thoi bằng nửa tích hai đường chéo: đường chéo kia dài ${o.A} · 2 : ${o.h} = ${2*o.w} (cm). Đỉnh cách nếp gấp bằng nửa đường chéo này: ${o.w} cm.`};}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'kn',level:'VD',gen:tfHard}],sa:[
 {id:'h_hai',topic:'ve',level:'VD',unit:'ô',gen:hHai},
 {id:'h_2lan',topic:'ud',level:'VD',unit:'cm²',gen:h2lan},
 {id:'h_cv',topic:'ve',level:'VD',unit:'cm',gen:hCv},
 {id:'h_let',topic:'kn',level:'VD',unit:'chữ',gen:hLet},
 {id:'h_rect',topic:'ud',level:'VD',unit:'cm',gen:hRectBack},
 {id:'h_rho',topic:'ud',level:'VD',unit:'cm',gen:hRhoBack}
].map(q=>Object.assign({type:'sa'},q))};

/* ============ Gói Toán thực tế (4 tình huống, mỗi lần chọn 3) ============ */
function pisaChu(){for(;;){const o=chuData();const no=o.list.filter(c=>letAx(c)===0),two=o.list.filter(c=>letAx(c)===2),yes=o.list.filter(c=>letAx(c)>0),nottwo=o.list.filter(c=>letAx(c)!==2);if(!no.length||!two.length||yes.length<3||nottwo.length<3)continue;
  const x=sel(no),y=sel(two);
  return {title:'Cắt chữ trang trí bảng tin',ctx:`<p class="stem">${chuStem(o)}</p>${fb(figLet(o.list))}`,qs:[
    mcq('Chữ nào không cắt được bằng cách gấp đôi mảnh giấy?','Chữ '+x,shuffle(yes).slice(0,3).map(c=>['Chữ '+c,letWhy(c)+' Vì vậy cắt được bằng cách gấp đôi theo trục ấy.']),letWhy(x)+' Vì vậy không gấp đôi được để cắt.','kn','TH'),
    saq('Có bao nhiêu chữ cắt được bằng cách gấp đôi mảnh giấy?',o.k,'chữ',chuExp(o)+` Có ${o.k} chữ.`,'kn','TH'),
    mcq('Chữ nào có thể gấp mảnh giấy theo nếp dọc hoặc nếp ngang đều được?','Chữ '+y,shuffle(nottwo).slice(0,3).map(c=>['Chữ '+c,letWhy(c)]),letWhy(y),'kn','VD'),
    saq('Tổng diện tích các mảnh giấy dùng để cắt những chữ có trục đối xứng là bao nhiêu xăng-ti-mét vuông?',o.S,'cm²',`Mỗi mảnh: ${o.a} · ${o.b} = ${o.a*o.b} (cm²). ${o.k} mảnh: ${o.k} · ${o.a*o.b} = ${o.S} (cm²).`,'ud','VD')]};}}
function pisaGach(){const o=halfData(),p=sel([15,18,20,25]),s=sel([20,25,30]),T=2*o.n;
  return {title:'Lát gạch theo mẫu đối xứng',ctx:`<p class="stem">Bác Tư lát một mảng trang trí bằng gạch vuông cạnh ${s} cm, mỗi ô trên hình là một viên gạch màu. Hình vẽ mới có nửa bên trái; mảng trang trí hoàn chỉnh nhận đường thẳng d là trục đối xứng. Mỗi viên gạch màu giá ${p} nghìn đồng.</p>${o.fig}`,qs:[
    saq('Mảng trang trí hoàn chỉnh cần bao nhiêu viên gạch màu?',T,'viên',`Nửa trái ${o.n} viên, nửa phải cũng ${o.n} viên: ${o.n} · 2 = ${T} (viên).`,'ve','TH'),
    saq('Tiền mua gạch màu là bao nhiêu nghìn đồng?',T*p,'nghìn đồng',`${T} · ${p} = ${T*p} (nghìn đồng).`,'ud','TH'),
    mcq('Muốn tính độ dài đường viền bao quanh mảng trang trí, cách nào đúng?','Vẽ đủ hai nửa rồi đếm các cạnh gạch ở biên',[['Lấy chu vi nửa đã vẽ nhân 2','Các cạnh nằm trên d không còn ở biên, nên chu vi cả hình không bằng 2 lần chu vi nửa hình.'],['Lấy số viên gạch nhân 4','Nhiều cạnh gạch nằm bên trong, không ở biên.'],['Lấy số viên gạch nhân 2','Số cạnh ở biên không phụ thuộc đơn giản vào số viên gạch như vậy.']],cvExp(o),'ve','VD'),
    saq('Đường viền bao quanh mảng trang trí dài bao nhiêu xăng-ti-mét?',o.P*s,'cm',`Có ${o.P} cạnh gạch ở biên, mỗi cạnh ${s} cm: ${o.P} · ${s} = ${o.P*s} (cm).`,'ve','VD')]};}
function pisaKhan(){const h=ri(8,15),w=ri(3,7),p=sel([2,3,4,5]),W2=2*w,A=h*W2,P=2*(h+W2);
  if(h===W2)return pisaKhan();
  return {title:'Cắt khăn trải bàn',ctx:`<p class="stem">Cô Lan gấp đôi một tấm vải rồi cắt một hình chữ nhật có một cạnh nằm trên nếp gấp: cạnh nằm trên nếp gấp dài ${h} dm, cạnh kia dài ${w} dm. Mở ra được chiếc khăn trải bàn hình chữ nhật. Cô may ren quanh mép khăn, giá ren ${p} nghìn đồng mỗi đề-xi-mét.</p>${fb(figFold('cn'))}`,qs:[
    saq('Cạnh không nằm trên nếp gấp của chiếc khăn dài bao nhiêu đề-xi-mét?',W2,'dm',`Mở ra, cạnh này được nhân đôi: ${w} · 2 = ${W2} (dm).`,'ud','TH'),
    saq('Diện tích chiếc khăn là bao nhiêu đề-xi-mét vuông?',A,'dm²',`${h} · ${W2} = ${A} (dm²).`,'ud','TH'),
    saq('Cần bao nhiêu đề-xi-mét ren để may quanh mép khăn?',P,'dm',`Chu vi khăn: ${nb(`2 · (${h} + ${W2}) = ${P}`)} (dm).`,'ud','VD'),
    saq('Tiền mua ren là bao nhiêu nghìn đồng?',P*p,'nghìn đồng',`${P} · ${p} = ${P*p} (nghìn đồng).`,'ud','VD')]};}
/* Biển báo giao thông (vẽ đơn giản) */
const SIGN={
  cam:{ax:2,d:`<circle class="sgr" cx="50" cy="50" r="40"/><rect class="sgw" x="20" y="43" width="60" height="14"/>`,why:'Biển tròn có vạch ngang ở giữa: 2 trục (thẳng đứng và nằm ngang).'},
  phai:{ax:1,d:`<circle class="sgb" cx="50" cy="50" r="40"/><polygon class="sgw" points="24,44 56,44 56,32 78,50 56,68 56,56 24,56"/>`,why:'Biển tròn có mũi tên chỉ sang phải: chỉ có 1 trục nằm ngang.'},
  nguy:{ax:1,d:`<polygon class="sgt" points="50,12 90,84 10,84"/><rect class="sgk" x="47" y="36" width="6" height="28"/><circle class="sgk" cx="50" cy="73" r="4"/>`,why:'Biển tam giác có dấu chấm than: chỉ có 1 trục thẳng đứng.'},
  gach:{ax:2,d:`<circle class="sgo" cx="50" cy="50" r="38"/><line class="sgl" x1="23" y1="23" x2="77" y2="77"/>`,why:'Biển tròn có một vạch chéo: 2 trục (đường chứa vạch chéo và đường vuông góc với vạch chéo tại tâm).'},
  pp:{ax:0,d:`<rect class="sgb" x="14" y="14" width="72" height="72" rx="8"/><text class="sgp" x="50" y="72" text-anchor="middle">P</text>`,why:'Biển vuông có chữ P: chữ P không có trục đối xứng nên cả biển không có trục.'}
};
const figSigns=ks=>`<svg class="fig" viewBox="-2 -2 ${ks.length*104+4} 126" role="img" aria-label="Bốn biển báo giao thông đánh nhãn a, b, c, d">${ks.map((k,i)=>`<g data-sg="${k}" transform="translate(${i*104+2},0)">${SIGN[k].d}</g><text class="vl" x="${i*104+54}" y="118" text-anchor="middle">${LB[i]})</text>`).join('')}</svg>`;
function pisaBien(){const ks=shuffle(['pp','phai'].concat(shuffle(['cam','nguy','gach']).slice(0,2))),L=k=>'Biển '+LB[ks.indexOf(k)]+')';
  const n=ks.filter(k=>SIGN[k].ax>0).length,T=sum(ks.map(k=>SIGN[k].ax));
  return {title:'Biển báo giao thông',ctx:`<p class="stem">Bạn Khoa vẽ lại bốn biển báo giao thông gặp trên đường đến trường (hình dưới) và tìm trục đối xứng của mỗi biển.</p>${fbw(figSigns(ks))}`,qs:[
    mcq('Biển nào không có trục đối xứng?',L('pp'),ks.filter(k=>k!=='pp').map(k=>[L(k),SIGN[k].why]),SIGN.pp.why,'kn','TH'),
    saq('Có bao nhiêu biển có trục đối xứng?',n,'biển',ks.map(k=>L(k)+': '+SIGN[k].why).join(' '),'kn','TH'),
    mcq('Biển nào chỉ có một trục đối xứng và trục đó nằm ngang?',L('phai'),ks.filter(k=>k!=='phai').map(k=>[L(k),SIGN[k].why]),SIGN.phai.why,'kn','VD'),
    saq('Tổng số trục đối xứng của cả bốn biển là bao nhiêu?',T,'trục',ks.map(k=>L(k)+': '+SIGN[k].ax+' trục').join('; ')+`. Tổng: ${ks.map(k=>SIGN[k].ax).join(' + ')} = ${T}.`,'hp','VD')]};}
const PISA=[pisaChu,pisaGach,pisaKhan,pisaBien];
const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'kn',fig:fb(figRow(['tim','dieu','mui','tgt'],[{p:[[50,4],[50,96]],ax:true},{p:[[50,2],[50,98]],ax:true},{p:[[2,50],[98,50]],ax:true},null],'Trái tim, cánh diều, mũi tên có trục đối xứng (nét đứt); tam giác bên phải không có trục')),extra:'Ba hình đầu có trục đối xứng (đường nét đứt), hình d) không có trục đối xứng.'},
  {k:'hp',fig:fb(figRow(['tron','thoi','cn','tc'],[LN.tron[0],LN.thoi[0],LN.cn[0],LN.tc[0]],'Một trục đối xứng của hình tròn, hình thoi, hình chữ nhật, hình thang cân')),extra:'Số trục: hình tròn vô số; hình vuông 4; hình chữ nhật 2; hình thoi 2; tam giác đều 3; lục giác đều 6; hình thang cân 1; hình bình hành 0.'},
  {k:'ve',fig:fb(figGrid({W:8,H:4,ax:{o:'v',k:4},cells:[[1,1],[2,1],[3,2],[6,1],[5,1],[4,2]],pts:[{x:0,y:3,l:'A'},{x:7,y:3,l:'A′'}],alt:'Lưới ô vuông: các ô tô màu và hai điểm A, A′ trùng nhau khi gấp theo d'})),extra:'A ở ô thứ 4 tính từ d (bên trái) nên trùng với A′ ở ô thứ 4 tính từ d (bên phải), cùng hàng.'},
  {k:'ud',fig:fb(figFold('cn','Tờ giấy gấp đôi, cắt hình chữ nhật có một cạnh trên nếp gấp')),extra:'Cắt hình chữ nhật có cạnh h nằm trên nếp gấp, cạnh kia w: mở ra được hình chữ nhật có cạnh h và 2 · w.'}
];

/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='dx6_seen';
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
  const mcSlots=[['kn',['NB','TH']],['kn',['TH','VD']],['hp',['NB','TH']],['hp',['TH','VD']],['ve',['TH','VD']],['ud',['TH','VD']]];
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
