// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ uoc-chung-lon-nhat/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "uoc-chung-lon-nhat";
export const TIEN_TO = "UC6-";

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

/* ============ Cách viết ============ */
const N=x=>x<0?'−'+(-x):''+x;
const L=a=>a.join('; ');                 // các phần tử cách nhau bởi dấu ";"
const SET=a=>'{'+L(a)+'}';
const nb=s=>s.replace(/ /g,' ');    // không ngắt dòng giữa các kí hiệu
const nbT=o=>Object.assign(o,{t:nb(o.t)});

/* ============ Ngẫu nhiên có hạt giống ============ */
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^=h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const range=(lo,hi)=>{const o=[];for(let v=lo;v<=hi;v++)o.push(v);return o;};
function pickOpts(goodT,cands){
  const seen=new Set([goodT]),out=[];
  for(const c of cands){if(c&&!seen.has(c.t)){seen.add(c.t);out.push({t:c.t,err:c.err});}if(out.length===3)break;}
  return out;
}
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
function mixed(make){for(let n=0;n<80;n++){const items=make();if(!items)continue;const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}return null;}
const wrap=items=>items?items.map(i=>Object.assign(i,{t:nb(i.t)})):null;
const F=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const sum=a=>a.reduce((x,y)=>x+y,0);
const fl=Math.floor;
const NAMES=['Mai','Lan','An','Minh','Hà','Bình','Cường','Dung'];

/* ============ Kí hiệu chia hết (như SGK) ============ */
const DV='⋮', ND='⋮̸';                       // a ⋮ b ; a ⋮̸ b
const dv=(a,b)=>`${F(a)} ${DV} ${F(b)}`;
const nd=(a,b)=>`${F(a)} ${ND} ${F(b)}`;
const rel=(a,b)=>a%b===0?dv(a,b):nd(a,b);           // viết đúng quan hệ
const why=(a,b)=>a%b===0?`${F(a)} = ${F(b)} · ${F(a/b)} nên ${dv(a,b)}`:`${F(a)} = ${F(b)} · ${F(fl(a/b))} + ${a%b} nên ${nd(a,b)}`;
const UO=n=>`Ư(${F(n)})`, BO=n=>`B(${F(n)})`;
function divs(n){const o=[];for(let d=1;d<=n;d++)if(n%d===0)o.push(d);return o;}
const nDiv=n=>divs(n).length;
const nonDiv=(n,lo,hi,not)=>{for(let k=0;k<200;k++){const x=ri(lo,hi);if(n%x&&!(not||[]).includes(x))return x;}return null;};
const RICH=[12,18,20,24,28,30,32,36,40,42,44,45,48,50,54,56,60,63,64,66,70,72,75,78,80,84,90,96,98,100];
const SMALL=[6,8,9,10,12,14,15,16,18,20,21,22,25,26,27,28];
const sumT=a=>a.map(F).join(' + ');

/* ============ Số nguyên tố: công cụ ============ */
const OV=s=>`<span\tstyle="text-decoration:overline">${s}</span>`;
const isP=n=>{if(n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;};
const PR=range(2,1000).filter(isP);
const spf=n=>{for(let d=2;d*d<=n;d++)if(n%d===0)return d;return n;};
function fac(n){const o=[];let d=2;while(n>1){if(n%d===0){let e=0;while(n%d===0){n/=d;e++;}o.push([d,e]);}d++;}return o;}
const FS=f=>f.map(([p,e])=>e>1?`${p}<sup>${e}</sup>`:''+p).join(' · ');      // 2<sup>3</sup> · 3
const fval=f=>f.reduce((s,[p,e])=>s*Math.pow(p,e),1);
const whyC=n=>{const d=spf(n);return `${F(n)} = ${d} · ${F(n/d)} nên ${F(n)} có thêm ước ${d} (ngoài 1 và chính nó), ${F(n)} là hợp số`;};
const whyP=n=>`${F(n)} chỉ có hai ước là 1 và ${F(n)} nên là số nguyên tố`;
const kind=n=>n<2?'không là số nguyên tố, cũng không là hợp số':isP(n)?'là số nguyên tố':'là hợp số';
const whyN=n=>n<2?`${n} không là số nguyên tố, cũng không là hợp số`:isP(n)?whyP(n):whyC(n);
const oddComp=(lo,hi)=>pickN(lo,hi,x=>x%2&&!isP(x)&&x%5);     // hợp số "khó nhận": lẻ, không tận cùng 5
const primeIn=(lo,hi)=>sel(PR.filter(p=>p>=lo&&p<=hi));
function mkNum(ps,minE){let f=shuffle(ps).slice(0,ri(2,3)).sort((x,y)=>x-y).map(p=>[p,ri(1,p<=3?3:p<=5?2:1)]);if(minE&&!f.some(z=>z[1]>1))f[0][1]=2;return f;}
const FB_MC=()=>({stem:'Số nguyên tố là:',opts:[{t:'Số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó'},{t:'Số tự nhiên lẻ',err:'9 lẻ nhưng có ước 3; 2 chẵn nhưng là số nguyên tố.'},{t:'Số tự nhiên chỉ có một ước',err:'Chỉ số 1 có đúng một ước, và 1 không là số nguyên tố.'},{t:'Số tự nhiên không chia hết cho 2',err:'9 không chia hết cho 2 nhưng là hợp số.'}],ans:0,exp:'Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó.'});
function tryGen(f){for(let n=0;n<200;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>String(o.t))).size===4)return r;}return FB_MC();}
const mkMC=(stem,right,wrongs,exp)=>({stem,opts:[{t:nb(right)}].concat(wrongs.map(w=>({t:nb(w[0]),err:w[1]}))),ans:0,exp});
function pickN(lo,hi,pred){for(let k=0;k<3000;k++){const x=ri(lo,hi);if(pred(x))return x;}return null;}

/* ============ Hình: sơ đồ cột, sơ đồ cây ============ */
function colFig(n,hide){ // hide: tập chỉ số ô bị ẩn, dạng 'L2' (cột trái hàng 2) hoặc 'R1'
  const rows=[];let x=n;while(x>1){const p=spf(x);rows.push([x,p]);x/=p;}rows.push([1,'']);
  const td=(v,k,side)=>`<td style="padding:3px 12px;border:none;text-align:${side==='L'?'right':'left'};${side==='L'?'border-right:2px solid currentColor;':''}">${hide.has(side+k)?'<b style="color:var(--accent,#2563eb)">?</b>':v}</td>`;
  return {rows,html:`<div class="figbox" style="max-width:220px"><table role="img" aria-label="Sơ đồ cột phân tích số ${n} ra thừa số nguyên tố" style="border-collapse:collapse;font-size:18px;margin:auto">${rows.map((r,k)=>`<tr>${td(r[0],k,'L')}${td(r[1],k,'R')}</tr>`).join('')}</table></div>`};}
function treeFig(n,hideRoot,hideIdx){ // sơ đồ cây kiểu Hình 2.3: n = p × m, m = q × r ...
  const nodes=[];let x=n,cx=160,cy=26,lv=0;nodes.push({v:n,x:cx,y:cy});
  while(!isP(x)){const p=spf(x),m=x/p;const L={v:p,x:cx-55,y:cy+58},R={v:m,x:cx+55,y:cy+58};nodes.push(L,R);L.par=nodes.indexOf(nodes.find(z=>z.x===cx&&z.y===cy));R.par=L.par;cx+=55;cy+=58;x=m;lv++;}
  const W=Math.max(...nodes.map(z=>z.x))+40,H=cy+34;
  const q=i=>(i===0&&hideRoot)||hideIdx.has(i);
  let s='';nodes.forEach((z,i)=>{if(i>0){const P=nodes[z.par];s+=`<line x1="${P.x}" y1="${P.y+17}" x2="${z.x}" y2="${z.y-17}" stroke="currentColor" stroke-width="1.5"/>`;}});
  nodes.forEach((z,i)=>{if(i>0&&i%2===1){const R=nodes[i+1];s+=`<text x="${(z.x+R.x)/2}" y="${z.y+6}" text-anchor="middle" font-size="15" fill="currentColor">×</text>`;}});
  nodes.forEach((z,i)=>{s+=`<circle cx="${z.x}" cy="${z.y}" r="17" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="${z.x}" y="${z.y+6}" text-anchor="middle" font-size="${String(z.v).length>2?13:16}" fill="currentColor" font-weight="${q(i)?700:400}">${q(i)?'?':z.v}</text>`;});
  return {nodes,html:`<div class="figbox" style="max-width:${W+10}px"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Sơ đồ cây phân tích một số ra thừa số nguyên tố" style="width:100%;max-width:${W}px;height:auto;display:block;color:var(--ink)">${s}</svg></div>`};}

const dsum=n=>String(n).split('').reduce((s,c)=>s+(+c),0);
const dplus=n=>String(n).split('').join(' + ');
function multOf(m,lo,hi){return m*ri(Math.ceil(lo/m),fl(hi/m));}
function notOf(m,lo,hi){for(;;){const x=ri(lo,hi);if(x%m)return x;}}
function sig(n,m){const L=String(n).slice(-1);
  if(m===2)return n%2?`${F(n)} có chữ số tận cùng là ${L} (lẻ) nên ${nd(n,2)}`:`${F(n)} có chữ số tận cùng là ${L} nên ${dv(n,2)}`;
  if(m===5)return n%5?`${F(n)} có chữ số tận cùng là ${L} (khác 0 và 5) nên ${nd(n,5)}`:`${F(n)} có chữ số tận cùng là ${L} nên ${dv(n,5)}`;
  const s=dsum(n);return `${F(n)} có tổng các chữ số ${dplus(n)} = ${s}${s%m?` không chia hết cho ${m} nên ${nd(n,m)}`:` chia hết cho ${m} nên ${dv(n,m)}`}`;}

/* ============ Ước chung, ƯCLN: công cụ ============ */
const R4=()=>ri(1000,9999);
const gcd=(a,b)=>b?gcd(b,a%b):a;
const g3=(a,b,c)=>gcd(gcd(a,b),c);
const FR=(a,b)=>`<span\tclass="fr"><span>${a}</span><span>${b}</span></span>`;   // phân số (không có dấu cách trong thẻ)
const UC=(...a)=>`ƯC(${a.join(', ')})`, UCLN=(...a)=>`ƯCLN(${a.join(', ')})`;
const fmin=(A,B)=>{const fa=fac(A),fb=fac(B);return fa.filter(([p])=>fb.some(z=>z[0]===p)).map(([p,e])=>[p,Math.min(e,fb.find(z=>z[0]===p)[1])]);};
const fmax=(A,B)=>{const m={};fac(A).concat(fac(B)).forEach(([p,e])=>{m[p]=Math.max(m[p]||0,e);});return Object.keys(m).map(Number).sort((a,b)=>a-b).map(p=>[p,m[p]]);};
// cặp số có ƯCLN g và thương nguyên tố cùng nhau
function pairG(gs,lo,hi){for(let k=0;k<500;k++){const g=sel(gs),x=ri(2,fl(hi/g)),y=ri(2,fl(hi/g));if(x===y||gcd(x,y)!==1)continue;const a=g*x,b=g*y;if(a<lo||b<lo)continue;return [a,b,g];}return null;}
const FB_UC=()=>({stem:'Ước chung lớn nhất của hai số là:',opts:[{t:'Số lớn nhất trong tập hợp các ước chung của hai số đó'},{t:'Số nhỏ nhất trong tập hợp các ước chung',err:'Số nhỏ nhất luôn là 1.'},{t:'Tích của hai số đó',err:'Tích chưa chắc là ước của mỗi số.'},{t:'Tập hợp các ước chung của hai số',err:'ƯC(a, b) là tập hợp; ƯCLN(a, b) là một số.'}],ans:0,exp:'Ước chung lớn nhất của hai hay nhiều số là số lớn nhất trong tập hợp các ước chung của các số đó.'});
function tryU(f){for(let n=0;n<200;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>String(o.t))).size===4)return r;}return FB_UC();}
const setOpts=(right,cands)=>{const o=pickOpts(right,cands.filter(z=>z&&z.t!=='{}'));return o.length<3?null:[{t:nb(right)}].concat(o.map(z=>({t:nb(z.t),err:z.err})));};

/* ============ Câu nhiều lựa chọn ============ */
// uc: ước chung
function mUcSet(){return tryU(()=>{const P=pairG([4,6,8,9,10,12,14,15],12,99);if(!P)return null;const [a,b,g]=P,G=divs(g),Da=divs(a),Db=divs(b);
  const xa=Da.find(d=>b%d&&d>1),xb=Db.find(d=>a%d&&d>1);
  const opts=setOpts(SET(G),[{t:SET(G.slice(1)),err:'Thiếu 1: 1 là ước chung của mọi số.'},xa?{t:SET(G.concat([xa]).sort((p,q)=>p-q)),err:`${xa} là ước của ${a} nhưng không là ước của ${b}.`}:null,xb?{t:SET(G.concat([xb]).sort((p,q)=>p-q)),err:`${xb} không là ước của ${a}.`}:null,{t:SET(G.slice(0,-1)),err:`Thiếu ${g}.`},{t:SET(Da),err:`Đây là ${UO(a)}.`}]);if(!opts)return null;
  return {stem:`Tập hợp ${UC(a,b)} là:`,opts,ans:0,exp:`${UO(a)} = ${SET(Da)}; ${UO(b)} = ${SET(Db)}; các số có mặt ở cả hai tập: ${SET(G)}.`};});}
function mIsUc(){return tryU(()=>{const P=pairG([4,6,8,9,10,12,15],12,99);if(!P)return null;const [a,b,g]=P,G=divs(g).filter(d=>d>1);if(!G.length)return null;const c=sel(G);
  const xa=divs(a).filter(d=>b%d&&d>1),xb=divs(b).filter(d=>a%d&&d>1);if(!xa.length||!xb.length)return null;const z=pickN(2,30,x=>a%x&&b%x);
  return mkMC(`Số nào sau đây là ước chung của ${a} và ${b}?`,''+c,[[''+sel(xa),`Là ước của ${a} nhưng không là ước của ${b}.`],[''+sel(xb),`Là ước của ${b} nhưng không là ước của ${a}.`],[''+z,`Không là ước của ${a}, cũng không là ước của ${b}.`]],`${dv(a,c)} và ${dv(b,c)} nên ${c} ∈ ${UC(a,b)}.`);});}
function mFromG(){return tryU(()=>{const P=pairG([6,8,10,12,14,15,18,20,24],20,200);if(!P)return null;const [a,b,g]=P,G=divs(g);
  const opts=setOpts(SET(G),[{t:SET([g]),err:'ƯC(a, b) gồm tất cả các ước của ƯCLN, không chỉ một số.'},{t:SET([g,2*g,3*g]),err:'Đây là các bội của ƯCLN.'},{t:SET(G.slice(1)),err:'Thiếu ước 1.'},{t:SET(G.filter(d=>isP(d))),err:'Không chỉ lấy các ước nguyên tố.'}]);if(!opts)return null;
  return {stem:`Biết ${UCLN(a,b)} = ${g}. Tập hợp ${UC(a,b)} là:`,opts,ans:0,exp:`ƯC(a, b) là tập hợp các ước của ƯCLN(a, b): ${UO(g)} = ${SET(G)}.`};});}
function mUc3(){return tryU(()=>{const g=sel([6,8,10,12,15]),xs=shuffle([2,3,5,7,11]).slice(0,3),[a,b,c]=xs.map(x=>g*x);if(g3(a,b,c)!==g)return null;const G=divs(g);
  const opts=setOpts(SET(G),[{t:SET(divs(gcd(a,b))),err:`Đây là ${UC(a,b)}; còn phải là ước của ${c}.`},{t:SET(G.slice(1)),err:'Thiếu ước 1.'},{t:SET(G.filter(d=>d!==G[1])),err:`Thiếu ${G[1]}.`},{t:SET(G.concat([g*xs[0]]).sort((p,q)=>p-q)),err:`${g*xs[0]} không là ước của ${b}.`}]);if(!opts)return null;
  return {stem:`Tập hợp ${UC(a,b,c)} là:`,opts,ans:0,exp:`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ${c} = ${FS(fac(c))}; ${UCLN(a,b,c)} = ${g}; ${UC(a,b,c)} = ${UO(g)} = ${SET(G)}.`};});}
function mUcX(){return tryU(()=>{const P=pairG([12,18,20,24,30,36],40,250);if(!P)return null;const [a,b,g]=P,G=divs(g),k=sel(G.filter(d=>d>1&&d<g));if(!k)return null;const R=G.filter(d=>d>k);
  const opts=setOpts(SET(R),[{t:SET([k].concat(R)),err:`x > ${k} nên không lấy ${k}.`},{t:SET(G),err:`Còn điều kiện x > ${k}.`},{t:SET(R.slice(0,-1)),err:`Thiếu ${g}.`},{t:SET(R.concat([2*g]).sort((p,q)=>p-q)),err:`${2*g} không là ước của cả ${a} và ${b}.`}]);if(!opts)return null;
  return {stem:`Tìm tập hợp các số tự nhiên x, biết ${a} ⋮ x, ${b} ⋮ x và x > ${k}.`,opts,ans:0,exp:`x ∈ ${UC(a,b)} = ${UO(g)} = ${SET(G)} (vì ${UCLN(a,b)} = ${g}); x > ${k} nên x ∈ ${SET(R)}.`};});}
// ucln
function mSpec(){return tryU(()=>{const b=ri(6,40),k=ri(2,9),a=b*k;
  return mkMC(`${UCLN(a,b)} bằng:`,''+b,[[''+a,`ƯCLN là ước của ${b} nên không vượt quá ${b}.`],['1',`${dv(a,b)} nên ${b} là ước chung lớn nhất.`],[''+k,`${k} là thương ${a} : ${b}.`]],`${a} = ${b} · ${k} nên ${dv(a,b)}; do đó ${UCLN(a,b)} = ${b}.`);});}
function mStmt(){if(RNG()<.4)return FB_UC();const P=[
  ['Nếu a ⋮ b thì ƯCLN(a, b) = b',[['Nếu a ⋮ b thì ƯCLN(a, b) = a','ƯCLN(a, b) là ước của b nên không lớn hơn b.'],['ƯCLN(a, 1) = a','1 chỉ có một ước là 1 nên ƯCLN(a, 1) = 1.'],['ƯC(a, b) là một số','ƯC(a, b) là một tập hợp.']]],
  ['ƯCLN(a, b, 1) = 1',[['ƯCLN(a, b, 1) = a · b','1 chỉ có ước là 1.'],['ƯCLN(a, 1) = a','ƯCLN(a, 1) = 1.'],['ƯCLN(a, b) luôn lớn hơn 1','Ví dụ ƯCLN(8, 9) = 1.']]]];const [r,W]=sel(P);
  return mkMC('Khẳng định nào sau đây đúng (a, b là các số tự nhiên khác 0)?',r,W,'Số 1 chỉ có một ước là 1; nếu a ⋮ b thì b là ước chung lớn nhất của a và b.');}
function mFact(){return tryU(()=>{const P=pairG([4,6,8,9,10,12,18,20],20,300);if(!P)return null;const [a,b,g]=P;const fa=fac(a),fb=fac(b),fmn=fmin(a,b),fmx=fmax(a,b);if(!fmn.length)return null;
  const W=[[FS(fmx),'Chọn số mũ nhỏ nhất của các thừa số chung, không phải lớn nhất.'],[FS(fmx.filter(([p])=>fmn.some(z=>z[0]===p))),'Với mỗi thừa số chung, lấy số mũ nhỏ nhất.'],[FS(fmn.map(([p,e])=>[p,1])),'Lấy số mũ nhỏ nhất của mỗi thừa số chung (không phải luôn là 1).'],[FS(fac(a*b/g).slice(0,2)),'Chỉ lấy các thừa số nguyên tố chung.']];
  const o=pickOpts(FS(fmn),W.map(w=>({t:w[0],err:w[1]})));if(o.length<3)return null;
  return {stem:`Biết ${a} = ${FS(fa)} và ${b} = ${FS(fb)}. ${UCLN(a,b)} bằng:`,opts:[{t:nb(FS(fmn))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`Thừa số nguyên tố chung: ${L(fmn.map(z=>z[0]))}; lấy số mũ nhỏ nhất: ${UCLN(a,b)} = ${FS(fmn)} = ${g}.`};});}
function mGcd2(){return tryU(()=>{const P=pairG([6,8,9,12,14,15,16,18,21,24],30,240);if(!P)return null;const [a,b,g]=P,G=divs(g);
  return mkMC(`${UCLN(a,b)} bằng:`,''+g,[[''+G[G.length-2],`${G[G.length-2]} là ước chung nhưng chưa lớn nhất.`],[''+(2*g),`${2*g} không là ước của ${a%(2*g)?a:b}.`],['1',`${a} và ${b} còn có ước chung ${g}.`]].filter((w,i,A)=>w[0]!==''+g&&A.findIndex(z=>z[0]===w[0])===i),`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ${UCLN(a,b)} = ${FS(fmin(a,b))} = ${g}.`);});}
function mGcd3(){return tryU(()=>{const g=sel([4,6,7,8,9,12,14]),xs=shuffle([2,3,4,5,6,7,9,10,11]).slice(0,3);if(g3(xs[0],xs[1],xs[2])!==1)return null;const [a,b,c]=xs.map(x=>g*x),gab=gcd(a,b);
  return mkMC(`${UCLN(a,b,c)} bằng:`,''+g,[[''+(gab===g?gcd(a,c)===g?g*2:gcd(a,c):gab),gab===g&&gcd(a,c)===g?`${g*2} không là ước của cả ba số.`:'Đây là ƯCLN của hai số, chưa xét số thứ ba.'],[''+Math.min(a,b,c),`Số nhỏ nhất ${Math.min(a,b,c)} không là ước của các số còn lại.`],['1',`Cả ba số còn có ước chung ${g}.`]].filter((w,i,A)=>w[0]!==''+g&&A.findIndex(z=>z[0]===w[0])===i),`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ${c} = ${FS(fac(c))}; ${UCLN(a,b,c)} = ${g}.`);});}
function mEuclid(){return tryU(()=>{const g=ri(12,99),x=ri(15,80),y=ri(3,14);if(gcd(x,y)!==1)return null;const a=g*x,b=g*y;if(a<1000)return null;const r=a%b;
  return mkMC(`Dùng thuật toán Euclid: ${F(a)} chia cho ${b} dư ${r}, nên ${UCLN(F(a),b)} = ${UCLN(b,r)}. ${UCLN(F(a),b)} bằng:`,''+g,[[''+r,`${r} là số dư của phép chia đầu tiên, chưa phải ƯCLN.`],[''+(b%r||b),`Tiếp tục chia ${b} cho ${r} đến khi không còn dư.`],[''+(g*2),`${g*2} không là ước của ${b}.`]].filter((w,i,A)=>w[0]!==''+g&&A.findIndex(z=>z[0]===w[0])===i),`Chia liên tiếp: ${(()=>{let p=a,q=b,s=[];while(q){s.push(`${F(p)} = ${q} · ${fl(p/q)} + ${p%q}`);[p,q]=[q,p%q];}return s.join('; ');})()}. ƯCLN là ${g}.`);});}
// ps: phân số tối giản
function mIsRed(){return tryU(()=>{const mk=red=>{for(;;){const a=ri(2,60),b=ri(2,90);if(a===b)continue;if((gcd(a,b)===1)===red)return [a,b];}};const r=mk(true),W=[mk(false),mk(false),mk(false)];if(new Set(W.map(String).concat([String(r)])).size<4)return null;
  return mkMC('Phân số nào sau đây là phân số tối giản?',FR(...r),W.map(([a,b])=>[FR(a,b),`${UCLN(a,b)} = ${gcd(a,b)} ≠ 1 nên rút gọn được thành ${FR(a/gcd(a,b),b/gcd(a,b))}.`]),`${UCLN(...r)} = 1 nên ${FR(...r)} là phân số tối giản.`);});}
function mReduce(){return tryU(()=>{const g=sel([6,8,9,10,12,14,15,18]),x=ri(2,11),y=ri(2,13);if(x===y||gcd(x,y)!==1)return null;const a=g*x,b=g*y,d=divs(g).find(q=>q>1&&q<g);if(!d)return null;
  return mkMC(`Rút gọn phân số ${FR(a,b)} về phân số tối giản, ta được:`,FR(x,y),[[FR(a/d,b/d),`Mới chia cho ${d}; ${UCLN(a/d,b/d)} = ${g/d} nên còn rút gọn được.`],[FR(y,x),'Đã đổi chỗ tử và mẫu.'],[FR(x,b),'Phải chia cả tử và mẫu cho cùng một số.']],`${UCLN(a,b)} = ${g}; ${FR(a,b)} = ${FR(`${a} : ${g}`,`${b} : ${g}`)} = ${FR(x,y)}.`);});}
function mCoprime(){return tryU(()=>{const comp=()=>pickN(4,99,x=>!isP(x));let a,b;for(let k=0;k<200;k++){a=comp();b=comp();if(a!==b&&gcd(a,b)===1)break;}if(gcd(a,b)!==1)return null;const W=[];
  for(let k=0;k<100&&W.length<3;k++){const c=comp(),d=comp();const g=gcd(c,d);if(c!==d&&g>1&&!W.some(w=>w[0]===`${c} và ${d}`))W.push([`${c} và ${d}`,`${UCLN(c,d)} = ${g} ≠ 1 (cùng chia hết cho ${spf(g)}).`]);}
  return mkMC('Cặp số nào sau đây là hai số nguyên tố cùng nhau?',`${a} và ${b}`,W,`${a} = ${FS(fac(a))}, ${b} = ${FS(fac(b))} không có thừa số nguyên tố chung nên ${UCLN(a,b)} = 1. Hai hợp số vẫn có thể nguyên tố cùng nhau.`);});}
function mRedN(){return tryU(()=>{const m=sel([12,15,18,20,24,30,36]),ok=pickN(2,m*2,x=>gcd(x,m)===1&&x!==1),W=[];for(let k=0;k<60&&W.length<3;k++){const x=pickN(2,m*2,y=>gcd(y,m)>1);if(!W.includes(x))W.push(x);}
  return mkMC(`Với số tự nhiên n nào sau đây thì ${FR('n',m)} là phân số tối giản?`,'n = '+ok,W.map(x=>['n = '+x,`${UCLN(x,m)} = ${gcd(x,m)} nên ${FR(x,m)} chưa tối giản.`]),`${m} = ${FS(fac(m))}; ${ok} không chia hết cho ${fac(m).map(z=>z[0]).join(', ')} nên ${UCLN(ok,m)} = 1.`);});}
// bt: bài toán thực tế
function mPrize(){return tryU(()=>{const P=pairG([6,8,9,12,15,18],24,200);if(!P)return null;const [a,b,g]=P,[i1,i2]=sel([['bút','quyển vở'],['quả cam','quả quýt'],['chiếc bánh','hộp sữa']]);const G=divs(g);
  return mkMC(`Cô giáo có ${a} ${i1} và ${b} ${i2}, muốn chia đều thành các phần thưởng như nhau (mỗi loại chia hết). Có thể chia được nhiều nhất bao nhiêu phần thưởng?`,''+g,[[''+G[G.length-2],'Chia được nhưng chưa phải nhiều nhất.'],[''+(a+b),'Mỗi phần phải có cả hai loại, số phần là ước chung.'],[''+(a/g+b/g),`Đây là số đồ vật trong mỗi phần: ${a/g} + ${b/g}.`]].filter((w,i,A)=>w[0]!==''+g&&A.findIndex(z=>z[0]===w[0])===i),`Số phần thưởng là ước chung của ${a} và ${b}; nhiều nhất là ${UCLN(a,b)} = ${g}.`);});}
function mWays(){return tryU(()=>{const P=pairG([6,8,10,12,15,18],12,60);if(!P)return null;const [a,b,g]=P,G=divs(g).filter(d=>d>=2),c=G.length;if(c<2)return null;
  return mkMC(`Lớp có ${a} học sinh nam và ${b} học sinh nữ. Có bao nhiêu cách chia lớp thành các tổ (ít nhất 2 tổ) sao cho số nam và số nữ được chia đều vào các tổ?`,''+c,[[''+(c+1),'Không tính cách chia thành 1 tổ.'],[''+g,`Đây là ƯCLN; số cách là số ước chung lớn hơn 1.`],[''+(c-1>0?c-1:c+2),'Còn thiếu một cách.']].filter((w,i,A)=>w[0]!==''+c&&A.findIndex(z=>z[0]===w[0])===i),`Số tổ là ước chung của ${a} và ${b}: ${UC(a,b)} = ${SET(divs(g))}; ít nhất 2 tổ: ${SET(G)}.`);});}
function mRows3(){return tryU(()=>{const g=sel([4,6,8,9,12]),xs=shuffle([3,4,5,6,7,8,9]).slice(0,3);if(g3(...xs)!==1)return null;const [a,b,c]=xs.map(x=>g*x);
  return mkMC(`Ba trung đội có ${a}, ${b} và ${c} chiến sĩ xếp thành các hàng dọc đều nhau (số hàng dọc của ba trung đội như nhau) mà không ai bị lẻ hàng. Có thể xếp nhiều nhất bao nhiêu hàng dọc?`,''+g,[[''+gcd(a,b),gcd(a,b)===g?'':'Còn phải là ước của '+c+'.'],[''+(a+b+c),'Số hàng dọc phải là ước chung của ba số.'],[''+Math.min(a,b,c),`${Math.min(a,b,c)} không là ước của cả ba số.`]].filter((w,i,A)=>w[0]!==''+g&&w[1]&&A.findIndex(z=>z[0]===w[0])===i).concat([[''+(g*2),`${g*2} không là ước chung.`]]).slice(0,3),`Số hàng dọc nhiều nhất là ${UCLN(a,b,c)} = ${g}.`);});}
function mSquare(){return tryU(()=>{const P=pairG([4,5,6,8,10,12],20,150);if(!P)return null;const [a,b,g]=P;const n=(a/g)*(b/g);
  return mkMC(`Một tấm bìa hình chữ nhật kích thước ${a} cm × ${b} cm được cắt hết thành các hình vuông bằng nhau, cạnh là số tự nhiên (cm). Cạnh hình vuông lớn nhất có thể là:`,`${g} cm`,[[`${divs(g)[divs(g).length-2]} cm`,'Cắt được nhưng chưa lớn nhất.'],[`${Math.min(a,b)} cm`,`${Math.max(a,b)} ${ND} ${Math.min(a,b)} nên cạnh này không cắt hết được.`],[`${n} cm`,`Đây là số hình vuông cắt được: ${a/g} · ${b/g}.`]].filter((w,i,A)=>w[0]!==`${g} cm`&&A.findIndex(z=>z[0]===w[0])===i),`Cạnh hình vuông là ước chung của ${a} và ${b}; lớn nhất là ${UCLN(a,b)} = ${g} (cm).`);});}
function mRem(){return tryU(()=>{const g=sel([6,7,8,9,11,12,13,14]),r=ri(1,Math.min(5,g-1)),xs=shuffle([3,4,5,6,7,8,9,10]).slice(0,3);if(g3(...xs)!==1)return null;const [a,b,c]=xs.map(x=>g*x+r);
  return mkMC(`Tìm số tự nhiên x lớn nhất sao cho ${a}, ${b} và ${c} chia cho x đều dư ${r}.`,''+g,[[''+g3(a,b,c),`Phải trừ đi số dư trước: ${a} − ${r}, ${b} − ${r}, ${c} − ${r}.`],[''+(g+r),`${a} chia ${g+r} không dư ${r}.`],[''+divs(g).filter(d=>d>r).slice(-2)[0],'Thoả mãn nhưng chưa lớn nhất.']].filter((w,i,A)=>w[0]!==''+g&&A.findIndex(z=>z[0]===w[0])===i),`${a-r}, ${b-r}, ${c-r} đều chia hết cho x và x > ${r}; x lớn nhất là ${UCLN(a-r,b-r,c-r)} = ${g}.`);});}

const MC=[];
const addMC=(id,topic,level,gen,mix)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},mix?{mix}:{}));
addMC('u_set','uc','NB',mUcSet);addMC('u_set2','uc','NB',mUcSet);addMC('u_is','uc','NB',mIsUc);addMC('u_is2','uc','NB',mIsUc);addMC('u_fg','uc','TH',mFromG);addMC('u_3','uc','TH',mUc3,[10]);addMC('u_x','uc','VD',mUcX);
addMC('g_sp','ucln','NB',mSpec,[8]);addMC('g_sp2','ucln','NB',mSpec);addMC('u_is3','uc','NB',mIsUc);addMC('g_st','ucln','NB',mStmt);addMC('g_fa','ucln','TH',mFact,[10]);addMC('g_2','ucln','TH',mGcd2);addMC('g_2b','ucln','TH',mGcd2);addMC('g_3','ucln','VD',mGcd3);addMC('g_eu','ucln','VD',mEuclid);
addMC('p_is','ps','NB',mIsRed);addMC('p_is2','ps','NB',mIsRed);addMC('p_rd','ps','TH',mReduce);addMC('p_rd2','ps','TH',mReduce);addMC('p_cp','ps','TH',mCoprime,[10]);addMC('p_n','ps','VD',mRedN,[10]);
addMC('b_pz','bt','TH',mPrize);addMC('b_pz2','bt','NB',mPrize);addMC('b_wy','bt','VD',mWays,[8]);addMC('b_r3','bt','VD',mRows3);addMC('b_sq','bt','VD',mSquare);addMC('b_rm','bt','VD',mRem,[8]);addMC('b_sq2','bt','TH',mSquare);

/* ============ Câu đúng sai ============ */
function tfStatic(pool,stem){return ()=>{const items=mixed(()=>shuffle(pool).slice(0,4).map(p=>sel(p)));return {stem,items:wrap(items)};};}
const POOL_U=[
  [IT('ƯC(a, b) là một tập hợp, còn ƯCLN(a, b) là một số.',true,'uc','NB','Như SGK.'),IT('ƯC(a, b) và ƯCLN(a, b) đều là các tập hợp.',false,'uc','NB','ƯCLN(a, b) là một số.')],
  [IT('Số 1 là ước chung của mọi số tự nhiên khác 0.',true,'uc','NB','1 là ước của mọi số.'),IT('Hai số tự nhiên khác 0 bất kì luôn có ước chung lớn hơn 1.',false,'uc','NB','ƯC(8, 9) = {1}.')],
  [IT('Nếu a ⋮ b thì ƯCLN(a, b) = b.',true,'ucln','NB','b là ước của cả a và b, và là ước lớn nhất của b.'),IT('Nếu a ⋮ b thì ƯCLN(a, b) = a.',false,'ucln','NB','Ví dụ ƯCLN(18, 6) = 6.')],
  [IT('ƯCLN(a, 1) = 1 với mọi số tự nhiên a khác 0.',true,'ucln','NB','1 chỉ có một ước là 1.'),IT('ƯCLN(a, 1) = a với mọi số tự nhiên a khác 0.',false,'ucln','NB','ƯCLN(a, 1) = 1.')],
  [IT('Phân số a/b là tối giản nếu ƯCLN(a, b) = 1.',true,'ps','NB','Định nghĩa trong SGK.'),IT('Phân số có tử và mẫu đều là hợp số thì không tối giản.',false,'ps','NB','8/9 tối giản dù 8 và 9 đều là hợp số.')],
  [IT('Để tìm ƯCLN, ta lấy các thừa số nguyên tố chung với số mũ nhỏ nhất.',true,'ucln','NB','Các bước tìm ƯCLN trong SGK.'),IT('Để tìm ƯCLN, ta lấy các thừa số nguyên tố chung với số mũ lớn nhất.',false,'ucln','NB','Lấy số mũ nhỏ nhất.')]];
function tfUcNum(){const P=pairG([6,8,10,12,15,18],20,150);const [a,b,g]=P;
  const items=mixed(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){const x=RNG()<.5?sel(divs(g)):sel(divs(a).concat(divs(b)).filter(d=>!(a%d===0&&b%d===0)).concat([g*2]));if(used.has(x))return null;used.add(x);const v=a%x===0&&b%x===0;o.push(IT(`${x} ∈ ${UC(a,b)}`,v,'uc','NB',`${rel(a,x)}; ${rel(b,x)}.`));}return o;});
  return {stem:`Xét các khẳng định sau:`,items:wrap(items)};}
function tfRed(){const items=mixed(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){const a=ri(2,50),b=ri(2,80);if(a===b||used.has(a+'/'+b))return null;used.add(a+'/'+b);const c=RNG()<.5,v=c===(gcd(a,b)===1);o.push(IT(`${FR(a,b)} ${c?'là':'không là'} phân số tối giản.`,v,'ps','NB',`${UCLN(a,b)} = ${gcd(a,b)}.`));}return o;});return {stem:'Xét các khẳng định sau:',items:wrap(items)};}
function tfGcd(){const items=mixed(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){const P=pairG([4,6,8,9,10,12,14,15,18],12,200);if(!P)return null;const [a,b,g]=P;if(used.has(a))return null;used.add(a);const v=RNG()<.5,sh=v?g:sel([2*g,divs(g).slice(-2)[0],1].filter(x=>x!==g));o.push(IT(`${UCLN(a,b)} = ${sh}`,v,'ucln','TH',`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ƯCLN = ${g}.`));}return o;});return {stem:'Xét các khẳng định sau:',items:wrap(items)};}
function tfCop(){const items=mixed(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){const a=ri(4,60),b=ri(4,60);if(a===b||used.has(a+','+b))return null;used.add(a+','+b);const c=RNG()<.5,v=c===(gcd(a,b)===1);o.push(IT(`${a} và ${b} ${c?'là':'không là'} hai số nguyên tố cùng nhau.`,v,'ps','TH',`${UCLN(a,b)} = ${gcd(a,b)}.`));}return o;});return {stem:'Xét các khẳng định sau:',items:wrap(items)};}
function tfFact(){const P=pairG([4,6,8,9,12,18,20],20,300);const [a,b,g]=P;
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`${a} = ${v?FS(fac(a)):FS(fac(a).map((z,i)=>i===0?[z[0],z[1]+1]:z))}`,v,'ucln','TH',`${a} = ${FS(fac(a))}.`));}
    {const v=R();o.push(IT(`Các thừa số nguyên tố chung của ${a} và ${b} là ${v?L(fmin(a,b).map(z=>z[0])):L(fmax(a,b).map(z=>z[0]))}.`,v||fmin(a,b).length===fmax(a,b).length,'ucln','TH',`Chung: ${L(fmin(a,b).map(z=>z[0]))}.`));}
    {const v=R();o.push(IT(`${UCLN(a,b)} = ${v?FS(fmin(a,b)):FS(fmax(a,b))}`,v,'ucln','TH',`Lấy số mũ nhỏ nhất: ${FS(fmin(a,b))} = ${g}.`));}
    {const v=R(),c=divs(g).length;o.push(IT(`${UC(a,b)} có ${v?c:c+1} phần tử.`,v,'uc','TH',`${UC(a,b)} = ${UO(g)} = ${SET(divs(g))}.`));}
    return o;});return {stem:`Cho a = ${a} và b = ${b}. Xét các khẳng định sau:`,items:wrap(items)};}
function tfPrize(){const g=sel([6,8,9,12]),[x,y,z]=shuffle([2,3,4,5,7]).slice(0,3),[a,b,c]=[g*x,g*y,g*z];
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`Chia được nhiều nhất ${v?g:g*2} phần quà.`,v,'bt','VD',`${UCLN(a,b,c)} = ${g}.`));}
    {const v=R();o.push(IT(`Khi chia nhiều nhất, mỗi phần có ${v?x:x+1} quyển vở.`,v,'bt','VD',`${a} : ${g} = ${x}.`));}
    {const v=R(),d=v?sel(divs(g).filter(q=>q>1&&q<g)):sel([5,7,10,11].filter(q=>a%q||b%q||c%q));if(!d)return null;o.push(IT(`Có thể chia thành ${d} phần quà như nhau.`,v,'uc','VD',`${d} ${v?'là':'không là'} ước chung của ${a}, ${b}, ${c}.`));}
    {const v=R(),n=divs(g).length;o.push(IT(`Có ${v?n:n-1} cách chọn số phần quà (kể cả 1 phần).`,v,'uc','VD',`Số phần quà là ước của ${g}: ${SET(divs(g))}.`));}
    return o;});
  return {stem:`Cô Lan có ${a} quyển vở, ${b} chiếc bút và ${c} tập giấy màu, chia đều vào các phần quà (mỗi loại chia hết). Xét các phát biểu sau:`,items:wrap(items)};}
function tfTile(){const P=pairG([3,4,5,6,8],12,90);const [a,b,g]=P;
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`Cạnh viên gạch lớn nhất là ${v?g:g*2} dm.`,v,'bt','VD',`${UCLN(a,b)} = ${g}.`));}
    {const v=R();o.push(IT(`Với gạch lớn nhất, cần ${v?(a/g)*(b/g):(a/g)+(b/g)} viên.`,v,'bt','VD',`${a/g} · ${b/g} = ${(a/g)*(b/g)} viên.`));}
    {const v=R(),d=v?sel(divs(g)):pickN(2,15,x=>a%x||b%x);o.push(IT(`Có thể lát vừa khít bằng gạch cạnh ${d} dm.`,v,'uc','VD',`${d} ${v?'là':'không là'} ước chung của ${a} và ${b}.`));}
    {const v=R();o.push(IT(`${a} và ${b} ${v===(g===1)?'là':'không là'} hai số nguyên tố cùng nhau.`,v,'ps','VD',`${UCLN(a,b)} = ${g}.`));}
    return o;});
  return {stem:`Nền một căn phòng hình chữ nhật kích thước ${a} dm × ${b} dm được lát vừa khít bằng các viên gạch hình vuông bằng nhau, cạnh là số tự nhiên (dm). Xét các phát biểu sau:`,items:wrap(items)};}
const TF=[];
const addTF=(id,topic,level,gen,mix)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},mix?{mix}:{}));
addTF('t_pa','uc','NB',tfStatic(POOL_U,'Xét các phát biểu sau:'));addTF('t_pb','ucln','NB',tfStatic(POOL_U,'Xét các phát biểu sau:'));addTF('t_un','uc','NB',tfUcNum);addTF('t_pc','ps','NB',tfStatic(POOL_U,'Xét các phát biểu sau:'));addTF('t_rd','ps','NB',tfRed);
addTF('t_g','ucln','TH',tfGcd);addTF('t_g2','ucln','TH',tfGcd);addTF('t_cp','ps','TH',tfCop);addTF('t_fa','ucln','TH',tfFact,[10]);addTF('t_fa2','uc','TH',tfFact);
addTF('t_pz','bt','VD',tfPrize);addTF('t_tl','bt','VD',tfTile);addTF('t_tl2','uc','VD',tfTile);

/* ============ Câu trả lời ngắn ============ */
const SA=[
 {id:'s_sp',topic:'ucln',level:'NB',unit:'',gen:()=>{const b=ri(6,40),a=b*ri(2,9);return{stem:`Tìm ${UCLN(a,b)}.`,ans:[b],exp:`${dv(a,b)} nên ${UCLN(a,b)} = ${b}.`};}},
 {id:'s_cu',topic:'uc',level:'NB',unit:'số',gen:()=>{const [a,b,g]=pairG([4,6,8,9,10,12],12,90);return{stem:`Tập hợp ${UC(a,b)} có bao nhiêu phần tử?`,ans:[divs(g).length],exp:`${UC(a,b)} = ${SET(divs(g))}.`};}},
 {id:'s_g',topic:'ucln',level:'TH',unit:'',gen:()=>{const [a,b,g]=pairG([6,8,9,12,14,15,16,18,21,24],30,240);return{stem:`Tìm ${UCLN(a,b)}.`,ans:[g],exp:`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ƯCLN = ${FS(fmin(a,b))} = ${g}.`};}},
 {id:'s_gf',topic:'ucln',level:'TH',unit:'',gen:()=>{const [a,b,g]=pairG([4,6,8,9,12,18,20],20,300);return{stem:`Biết ${a} = ${FS(fac(a))} và ${b} = ${FS(fac(b))}. Tính ${UCLN(a,b)}.`,ans:[g],exp:`${FS(fmin(a,b))} = ${g}.`};}},
 {id:'s_g3',topic:'ucln',level:'TH',unit:'',gen:()=>{for(;;){const g=sel([4,6,7,8,9,12,14]),xs=shuffle([2,3,4,5,6,7,9,10,11]).slice(0,3);if(g3(...xs)!==1)continue;const [a,b,c]=xs.map(x=>g*x);return{stem:`Tìm ${UCLN(a,b,c)}.`,ans:[g],exp:`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ${c} = ${FS(fac(c))}; ƯCLN = ${g}.`};}}},
 {id:'s_rn',topic:'ps',level:'TH',unit:'',gen:()=>{for(;;){const g=sel([6,8,9,12,15,18]),x=ri(2,11),y=ri(2,13);if(x===y||gcd(x,y)!==1)continue;return{stem:`Rút gọn phân số ${FR(g*x,g*y)} về phân số tối giản ${FR('a','b')}. Tính a + b.`,ans:[x+y],exp:`${UCLN(g*x,g*y)} = ${g}; ${FR(g*x,g*y)} = ${FR(x,y)}; a + b = ${x+y}.`};}}},
 {id:'s_rn2',topic:'ps',level:'NB',unit:'',gen:()=>{for(;;){const g=sel([2,3,5,10]),x=ri(2,9),y=ri(2,11);if(x===y||gcd(x,y)!==1)continue;return{stem:`Rút gọn phân số ${FR(g*x,g*y)} về phân số tối giản. Mẫu số của phân số tối giản đó là bao nhiêu?`,ans:[y],exp:`Chia cả tử và mẫu cho ${g}: ${FR(x,y)}.`};}}},
 {id:'s_cucx',topic:'uc',level:'TH',unit:'số',gen:()=>{for(;;){const [a,b,g]=pairG([12,18,20,24,30,36],40,250);const k=ri(2,g-1);const R=divs(g).filter(d=>d>k);if(!R.length)continue;return{stem:`Có bao nhiêu số tự nhiên x thoả mãn ${a} ⋮ x, ${b} ⋮ x và x > ${k}?`,ans:[R.length],exp:`x ∈ ${UC(a,b)} = ${SET(divs(g))}; x > ${k}: ${SET(R)}.`};}}},
 {id:'s_pz',topic:'bt',level:'VD',unit:'phần',gen:()=>{for(;;){const g=sel([6,9,11,12,13,18]),xs=shuffle([2,3,4,5,7]).slice(0,3);if(g3(...xs)!==1)continue;const [a,b,c]=xs.map(x=>g*x);return{stem:`Cô giáo cần chia ${a} bút, ${b} quyển sách và ${c} quyển vở thành các phần thưởng, mỗi loại chia đều. Có thể chia được nhiều nhất bao nhiêu phần thưởng?`,ans:[g],exp:`${UCLN(a,b,c)} = ${g}.`};}}},
 {id:'s_pz2',topic:'bt',level:'VD',unit:'quả',gen:()=>{for(;;){const [a,b,g]=pairG([4,6,8,9,12],12,150);return{stem:`Có ${a} quả cam và ${b} quả xoài, chia đều thành nhiều phần nhất có thể (mỗi loại chia hết). Mỗi phần có tất cả bao nhiêu quả?`,ans:[a/g+b/g],exp:`Số phần nhiều nhất: ${UCLN(a,b)} = ${g}; mỗi phần ${a/g} cam và ${b/g} xoài, tổng ${a/g+b/g} quả.`};}}},
 {id:'s_wy',topic:'bt',level:'VD',unit:'cách',mix:[8],gen:()=>{for(;;){const [a,b,g]=pairG([6,8,10,12,18,24],12,72);if(divs(g).length<3)continue;return{stem:`Một lớp có ${a} học sinh nam và ${b} học sinh nữ. Có bao nhiêu cách chia lớp thành các tổ (ít nhất 2 tổ) sao cho số nam và số nữ được chia đều vào các tổ?`,ans:[divs(g).length-1],exp:`${UC(a,b)} = ${SET(divs(g))}; bỏ 1: có ${divs(g).length-1} cách.`};}}},
 {id:'s_sq',topic:'bt',level:'VD',unit:'hình',gen:()=>{const [a,b,g]=pairG([4,5,6,8,10,12],20,150);return{stem:`Một tấm bìa ${a} cm × ${b} cm được cắt hết thành các hình vuông bằng nhau có cạnh lớn nhất (cạnh là số tự nhiên). Cắt được bao nhiêu hình vuông?`,ans:[(a/g)*(b/g)],exp:`Cạnh hình vuông: ${UCLN(a,b)} = ${g} cm; số hình: ${a/g} · ${b/g} = ${(a/g)*(b/g)}.`};}},
 {id:'s_rm',topic:'bt',level:'VD',unit:'',mix:[8],gen:()=>{for(;;){const g=sel([6,7,8,9,11,12,13]),r=ri(1,Math.min(5,g-1)),xs=shuffle([3,4,5,6,7,8,9,10]).slice(0,3);if(g3(...xs)!==1)continue;const [a,b,c]=xs.map(x=>g*x+r);return{stem:`Tìm số tự nhiên x lớn nhất sao cho ${a}, ${b} và ${c} chia cho x đều dư ${r}.`,ans:[g],exp:`x là ước chung của ${a-r}, ${b-r}, ${c-r} và x > ${r}: x = ${UCLN(a-r,b-r,c-r)} = ${g}.`};}}},
 {id:'s_eu',topic:'ucln',level:'VD',unit:'',gen:()=>{for(;;){const g=ri(12,99),x=ri(15,80),y=ri(3,14);if(gcd(x,y)!==1)continue;const a=g*x,b=g*y;if(a<1000)continue;return{stem:`Dùng thuật toán Euclid (chia liên tiếp), tìm ${UCLN(F(a),b)}.`,ans:[g],exp:`${(()=>{let p=a,q=b,s=[];while(q){s.push(`${F(p)} = ${q} · ${fl(p/q)} + ${p%q}`);[p,q]=[q,p%q];}return s.join('; ');})()}; ƯCLN = ${g}.`};}}},
 {id:'s_x',topic:'uc',level:'VD',unit:'',gen:()=>{for(;;){const [a,b,g]=pairG([12,18,20,24,30,36],40,250);const G=divs(g);const lo=ri(3,15),hi=lo+ri(4,12);const R=G.filter(d=>d>lo&&d<hi);if(R.length!==1)continue;return{stem:`Tìm số tự nhiên x, biết ${a} ⋮ x, ${b} ⋮ x và ${lo} < x < ${hi}.`,ans:[R[0]],exp:`x ∈ ${UC(a,b)} = ${SET(G)}; ${lo} < x < ${hi} nên x = ${R[0]}.`};}}},
 {id:'s_cop',topic:'ps',level:'VD',unit:'số',mix:[10],gen:()=>{const m=sel([12,15,18,20,21,24,30]);return{stem:`Có bao nhiêu số tự nhiên n với 0 < n < ${m} sao cho ${FR('n',m)} là phân số tối giản?`,ans:[range(1,m-1).filter(n=>gcd(n,m)===1).length],exp:`${m} = ${FS(fac(m))}; n không chia hết cho ${fac(m).map(z=>z[0]).join(', ')}: ${SET(range(1,m-1).filter(n=>gcd(n,m)===1))}.`};}},
 {id:'s_one',topic:'ps',level:'NB',unit:'',gen:()=>{for(;;){const a=ri(2,60),b=ri(2,60);if(a===b||gcd(a,b)===1)continue;return{stem:`Tìm ${UCLN(a,b)} để biết cần chia cả tử và mẫu của ${FR(a,b)} cho số nào khi rút gọn về phân số tối giản.`,ans:[gcd(a,b)],exp:`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ${UCLN(a,b)} = ${gcd(a,b)}.`};}}},
 {id:'s_cu2',topic:'uc',level:'NB',unit:'',gen:()=>{const g=sel([6,8,10,12,15,18,20]),[a,b]=[g*sel([2,3,5]),g*sel([7,11])];return{stem:`Biết ${UCLN(a,b)} = ${g}. Ước chung lớn thứ hai của ${a} và ${b} là số nào?`,ans:[divs(g).slice(-2)[0]],exp:`${UC(a,b)} = ${UO(g)} = ${SET(divs(g))}.`};}}
].map(q=>Object.assign({type:'sa'},q));

/* ============ Chủ đề ============ */
const TOPICS={
  uc:{short:'Ước chung',name:'Ước chung',rule:'Ước chung của hai hay nhiều số là ước của tất cả các số đó; ƯC(a, b) là tập hợp các ước chung của a và b. Để tìm ước chung, tìm ƯCLN rồi tìm các ước của ƯCLN.',tip:'ƯC(a, b) là một tập hợp, luôn có số 1.'},
  ucln:{short:'Ước chung lớn nhất',name:'Ước chung lớn nhất',rule:'ƯCLN là số lớn nhất trong tập hợp các ước chung. Nếu a ⋮ b thì ƯCLN(a, b) = b; ƯCLN(a, 1) = 1. Tìm ƯCLN: phân tích ra thừa số nguyên tố, chọn các thừa số chung, lấy mỗi thừa số với số mũ nhỏ nhất rồi nhân lại.',tip:'Lấy số mũ nhỏ nhất, chỉ của các thừa số chung: ƯCLN(24, 60) = 2<sup>2</sup> · 3 = 12.'},
  ps:{short:'Phân số tối giản',name:'Rút gọn về phân số tối giản',rule:'Phân số a/b tối giản khi ƯCLN(a, b) = 1 (a và b là hai số nguyên tố cùng nhau). Để rút gọn về phân số tối giản, chia cả tử và mẫu cho ƯCLN(a, b).',tip:'Hai hợp số vẫn có thể nguyên tố cùng nhau: ƯCLN(8, 9) = 1.'},
  bt:{short:'Bài toán thực tế',name:'Bài toán thực tế về ƯCLN',rule:'Chia đều nhiều loại đồ vật thành các phần, xếp hàng dọc cho nhiều nhóm, cắt hình chữ nhật thành hình vuông: số phần (cạnh) là ước chung; "nhiều nhất", "lớn nhất" là ƯCLN.',tip:'Số phần nhiều nhất là ƯCLN; số đồ vật mỗi phần là thương của từng số cho ƯCLN.'}
};
const TKEYS=['uc','ucln','ps','bt'];
const TDESC={uc:'Tập hợp ƯC, tìm ƯC từ ƯCLN',ucln:'Trường hợp đặc biệt, phân tích ra thừa số, thuật toán Euclid',ps:'Phân số tối giản, hai số nguyên tố cùng nhau',bt:'Chia phần thưởng, hàng dọc, cắt hình vuông'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhận ra ước chung, phân số tối giản, ƯCLN trong trường hợp đặc biệt.',TH:'Tìm ƯCLN bằng phân tích ra thừa số nguyên tố, tìm ƯC từ ƯCLN, rút gọn phân số.',VD:'ƯCLN của ba số, thuật toán Euclid, bài toán chia đều, cắt hình vuông, chia có dư.'};

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
function tfHard(){for(;;){
  const P=[
    [IT('Hai số tự nhiên liên tiếp luôn là hai số nguyên tố cùng nhau.',true,'ps','VD','Ước chung d của n và n + 1 là ước của hiệu 1, nên d = 1.'),IT('Hai số chẵn liên tiếp luôn là hai số nguyên tố cùng nhau.',false,'ps','VD','Hai số chẵn có ước chung 2.')],
    [IT('Hai số lẻ liên tiếp luôn là hai số nguyên tố cùng nhau.',true,'ps','VD','Ước chung d là ước của hiệu 2 và là số lẻ nên d = 1.'),IT('Nếu ƯCLN(a, b) = 1 thì a hoặc b là số nguyên tố.',false,'ps','VD','ƯCLN(8, 9) = 1 nhưng 8, 9 đều là hợp số.')],
    [IT('ƯCLN(a, b) là ước của a + b.',true,'ucln','VD','a và b đều chia hết cho ƯCLN nên tổng cũng chia hết (tính chất 1).'),IT('ƯCLN(a, b) luôn bằng hiệu a − b (a > b).',false,'ucln','VD','ƯCLN(12, 8) = 4 = 12 − 8 nhưng ƯCLN(15, 9) = 3 ≠ 6.')],
    [IT('Nếu ƯCLN(a, b) = d thì ƯCLN(a : d, b : d) = 1.',true,'ucln','VD','Nếu còn ước chung k > 1 thì d · k là ước chung lớn hơn d.'),IT('Nếu ƯCLN(a, b) = d thì ƯCLN(2a, 2b) = d.',false,'ucln','VD','ƯCLN(2a, 2b) = 2d.')]];
  const its=wrap(shuffle(P).slice(0,4).map(p=>sel(p)));if(tfOK(its))return {stem:'Với a, b là các số tự nhiên khác 0, xét các khẳng định sau:',items:its};}}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'ucln',level:'VD',gen:tfHard,mix:[8]}],sa:[
 {id:'h_sum',topic:'ucln',level:'VD',unit:'cặp',gen:()=>{for(;;){const g=sel([6,8,9,12,15]),s=ri(6,16),S=g*s;let c=0;for(let x=1;x<=s/2;x++)if(gcd(x,s-x)===1)c++;if(c<2)continue;return{stem:`Có bao nhiêu cặp số tự nhiên (a; b) với a ≤ b, a + b = ${S} và ${UCLN('a','b')} = ${g}?`,ans:[c],exp:`a = ${g}x, b = ${g}y với x + y = ${s}, ƯCLN(x, y) = 1, x ≤ y: có ${c} cặp.`};}}},
 {id:'h_phi',topic:'ps',level:'VD',unit:'phân số',mix:[10],gen:()=>{const m=sel([24,28,30,36,40,42,45]);return{stem:`Có bao nhiêu phân số tối giản dạng ${FR('a',m)} với a là số tự nhiên, 0 < a < ${m}?`,ans:[range(1,m-1).filter(a=>gcd(a,m)===1).length],exp:`${m} = ${FS(fac(m))}; đếm các số a không chia hết cho ${fac(m).map(z=>z[0]).join(', ')}.`};}},
 {id:'h_rem3',topic:'bt',level:'VD',unit:'',mix:[8],gen:()=>{for(;;){const g=sel([9,11,12,13,14,15,17]),rs=[ri(1,g-1),ri(1,g-1),ri(1,g-1)],xs=shuffle([3,4,5,6,7,8]).slice(0,3);if(g3(...xs)!==1)continue;const v=xs.map((x,i)=>g*x+rs[i]);if(Math.max(...rs)>=g)continue;return{stem:`Tìm số tự nhiên x lớn nhất sao cho ${v[0]} chia x dư ${rs[0]}, ${v[1]} chia x dư ${rs[1]} và ${v[2]} chia x dư ${rs[2]}.`,ans:[g],exp:`x là ước chung của ${v[0]-rs[0]}, ${v[1]-rs[1]}, ${v[2]-rs[2]} và x > ${Math.max(...rs)}: x = ${g}.`};}}},
 {id:'h_prod',topic:'ucln',level:'VD',unit:'cặp',gen:()=>{for(;;){const g=sel([2,3,4,5,6]),P=g*g*sel([6,10,12,15,30,36]);let c=0;for(let a=g;a*a<=P;a+=g){if(P%a)continue;const b=P/a;if(b%g===0&&gcd(a,b)===g)c++;}if(c<2)continue;return{stem:`Có bao nhiêu cặp số tự nhiên (a; b) với a ≤ b, a · b = ${P} và ${UCLN('a','b')} = ${g}?`,ans:[c],exp:`a = ${g}x, b = ${g}y, x · y = ${P/(g*g)}, ƯCLN(x, y) = 1, x ≤ y: có ${c} cặp.`};}}},
 {id:'h_lin',topic:'ucln',level:'VD',unit:'',gen:()=>{const n=ri(2,40);return{stem:`Với n = ${n}, tính ƯCLN(2n + 1, 3n + 1).`,ans:[gcd(2*n+1,3*n+1)],exp:`2n + 1 = ${2*n+1}, 3n + 1 = ${3*n+1}. Mọi ước chung d chia hết 3(2n + 1) − 2(3n + 1) = 1 nên ƯCLN = 1.`};}},
 {id:'h_eu',topic:'ucln',level:'VD',unit:'',gen:()=>{for(;;){const g=ri(20,150),x=ri(40,99),y=ri(11,39);if(gcd(x,y)!==1)continue;return{stem:`Tìm ${UCLN(F(g*x),F(g*y))}.`,ans:[g],exp:`Dùng thuật toán Euclid hoặc phân tích ra thừa số nguyên tố: ƯCLN = ${g}.`};}}}
].map(q=>Object.assign({type:'sa'},q))};

const qsOK=u=>u.qs.every(q=>q.type!=='mc'||(q.opts.length===4&&new Set(q.opts.map(o=>o.t)).size===4));
const mx=(q,m)=>Object.assign(q,{mix:m});
const PISA=[
 ()=>{for(;;){const p=sel([3,5,7,9,11,13]),k=sel([2,4]),q=p*k;const c=[ri(2,8),ri(2,8),ri(2,8),ri(2,8)].map(x=>x*k);const tot=sum(c);const S=tot*p;const prices=divs(g3(g3(c[0]*p,c[1]*p,c[2]*p),c[3]*p,c[3]*p)).filter(d=>d>2);
   const studs=prices.map(d=>S/d).filter(n=>n>=20&&n<=40);if(studs.length!==1||prices.length<2)continue;const pr=S/studs[0];const days=['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm'];const amts=c.map(x=>x*p);const G=g3(g3(amts[0],amts[1],amts[2]),amts[3],amts[3]);
   const u={title:'Tiền vé tham quan',ctx:`<p class="stem">Lớp 6C đi tham quan bảo tàng, mỗi học sinh đóng tiền một vé. Giá vé là số tự nhiên (nghìn đồng) lớn hơn 2. Bảng sau ghi số tiền cô Lan thu được mỗi ngày.</p>${tbl(['Ngày','Số tiền (nghìn đồng)'],days.map((d,i)=>[d,amts[i]]))}`,qs:[
    saq('Tìm ước chung lớn nhất của bốn số tiền trong bảng.',G,'',`${amts.map(a=>`${a} = ${FS(fac(a))}`).join('; ')}; ƯCLN = ${G}.`,'ucln','TH'),
    mcq('Giá vé có thể là những số nào?',L(prices),[[L(divs(G)),'Giá vé lớn hơn 2 nghìn đồng.'],[''+G,'Giá vé là ước chung bất kì lớn hơn 2, không chỉ ƯCLN.'],[L(prices.concat([G*2]).sort((a,b)=>a-b)),`${G*2} không là ước của mọi số tiền.`]],`Giá vé là ước chung của bốn số tiền và lớn hơn 2: ${L(prices)}.`,'uc','TH'),
    mx(saq(`Biết lớp có từ 20 đến 40 học sinh đi tham quan. Giá mỗi vé là bao nhiêu nghìn đồng?`,pr,'nghìn đồng',`Tổng tiền ${S} nghìn đồng; với mỗi giá vé có thể (${L(prices)}), số học sinh là ${prices.map(d=>`${S} : ${d} = ${S/d}`).join('; ')}; chỉ có ${studs[0]} học sinh nằm trong khoảng 20 đến 40.`,'bt','VD'),[8])]};if(qsOK(u))return u;}},
 ()=>{for(;;){const g=sel([6,8,9,12,15]),xs=shuffle([2,3,4,5,7]).slice(0,3);if(g3(...xs)!==1)continue;const L0=xs.map(x=>g*x);const d=sel(divs(g).filter(z=>z>1&&z<g));if(!d)continue;
   const u={title:'Cắt thanh gỗ',ctx:`<p class="stem">Bác thợ mộc có ba tấm gỗ dài ${L(L0)} (dm). Bác muốn cắt cả ba tấm thành các thanh dài bằng nhau (số tự nhiên dm) mà không thừa mẩu gỗ nào.</p>`,qs:[
    saq('Mỗi thanh gỗ dài nhất là bao nhiêu đề-xi-mét?',g,'dm',`${UCLN(...L0)} = ${g}.`,'bt','TH'),
    saq('Khi cắt thanh dài nhất, bác được tất cả bao nhiêu thanh gỗ?',sum(xs),'thanh',`${L0.map(x=>`${x} : ${g} = ${x/g}`).join('; ')}; tổng ${sum(xs)} thanh.`,'bt','VD'),
    mcq(`Bác có thể cắt các thanh dài ${d} dm mà không thừa mẩu gỗ nào không?`,`Được, vì ${d} là ước chung của ba độ dài`,[[`Không, vì ${d} không phải ƯCLN`,'Mọi ước chung đều cắt được, không chỉ ƯCLN.'],[`Không, vì ${d} nhỏ hơn ${g}`,'Thanh ngắn hơn vẫn cắt được nếu là ước chung.'],[`Chỉ cắt được tấm dài ${L0[0]} dm`,`${d} là ước của cả ba độ dài.`]],`${d} là ước của ${g} nên là ước chung của ${L(L0)}.`,'uc','TH')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const [a,b,g]=pairG([3,4,5,6,8],18,90);if(divs(g).length<3)continue;const d=divs(g)[1];
   const u={title:'Lát gạch phòng học',ctx:`<p class="stem">Nền phòng học hình chữ nhật dài ${a} dm, rộng ${b} dm. Nhà trường muốn lát vừa khít bằng các viên gạch hình vuông bằng nhau, cạnh là số tự nhiên (dm).</p>${tbl(['Kích thước','Số đo (dm)'],[['Chiều dài',a],['Chiều rộng',b]])}`,qs:[
    mcq('Cạnh viên gạch phải là:',`Một ước chung của ${a} và ${b}`,[[`Một bội chung của ${a} và ${b}`,'Cạnh gạch phải chia hết các cạnh của nền.'],[`Một ước của ${a} hoặc của ${b}`,'Phải là ước của cả hai số.'],[`Một số nguyên tố bất kì`,'Không phải số nguyên tố nào cũng lát vừa khít.']],'Lát vừa khít theo cả chiều dài và chiều rộng nên cạnh gạch là ước chung.','uc','NB'),
    saq('Cạnh viên gạch lớn nhất là bao nhiêu đề-xi-mét?',g,'dm',`${UCLN(a,b)} = ${g}.`,'ucln','TH'),
    saq('Với gạch cạnh lớn nhất, cần bao nhiêu viên gạch?',(a/g)*(b/g),'viên',`${a/g} · ${b/g} = ${(a/g)*(b/g)}.`,'bt','VD'),
    saq(`Nếu dùng gạch cạnh ${d} dm thì cần bao nhiêu viên?`,(a/d)*(b/d),'viên',`${a/d} · ${b/d} = ${(a/d)*(b/d)}.`,'bt','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const g=sel([8,9,10,12,14,15]),xs=shuffle([2,3,4,5,7]).slice(0,3);if(g3(...xs)!==1)continue;const [a,b,c]=xs.map(x=>g*x);const notD=pickN(3,g-1,x=>a%x||b%x||c%x);if(!notD)continue;const part=[a,b,c].find(x=>x%notD===0);
   const u={title:'Túi quà Trung thu',ctx:`<p class="stem">Chi đội chuẩn bị quà Trung thu cho các em nhỏ, mỗi túi quà giống nhau và mỗi loại phải chia hết.</p>${tbl(['Loại quà','Số lượng'],[['Bánh nướng',a],['Kẹo dẻo',b],['Hộp sữa',c]])}`,qs:[
    saq('Có thể chia nhiều nhất bao nhiêu túi quà?',g,'túi',`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ${c} = ${FS(fac(c))}; ƯCLN = ${g}.`,'ucln','TH'),
    saq('Khi chia nhiều túi nhất, mỗi túi có bao nhiêu chiếc kẹo dẻo?',b/g,'chiếc',`${b} : ${g} = ${b/g}.`,'bt','TH'),
    mcq(`Chi đội có thể chia thành ${notD} túi quà không?`,`Không, vì ${notD} không là ước chung của ${a}, ${b}, ${c}`,[[`Được, vì ${notD} nhỏ hơn ${g}`,'Số túi phải là ước chung, không chỉ nhỏ hơn ƯCLN.'],part?[`Được, vì ${notD} là ước của ${part}`,'Phải là ước của cả ba số.']:[`Được, vì ${notD} là số tự nhiên khác 0`,'Số túi phải là ước chung của ba số.'],[`Không, vì số túi phải bằng ${g}`,'Số túi có thể là bất kì ước chung nào.']],`${[a,b,c].map(x=>rel(x,notD)).join('; ')}.`,'uc','VD')]};if(qsOK(u))return u;}}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'uc',fig:'<div class="figbox"><p>Ư(18) = {1; 2; 3; 6; 9; 18}; Ư(30) = {1; 2; 3; 5; 6; 10; 15; 30}</p><p>ƯC(18, 30) = {1; 2; 3; 6}</p></div>',extra:'ƯC là tập hợp các ước của ƯCLN.'},
  {k:'ucln',fig:'<div class="figbox"><p>24 = 2<sup>3</sup> · 3; 60 = 2<sup>2</sup> · 3 · 5</p><p>ƯCLN(24, 60) = 2<sup>2</sup> · 3 = 12</p></div>',extra:'Thừa số chung, số mũ nhỏ nhất.'},
  {k:'ps',fig:`<div class="figbox"><p>ƯCLN(36, 54) = 18: ${FR(36,54)} = ${FR('36 : 18','54 : 18')} = ${FR(2,3)}</p></div>`,extra:'Chia cả tử và mẫu cho ƯCLN.'},
  {k:'bt',fig:'<div class="figbox"><p>24, 28, 36 chiến sĩ xếp hàng dọc đều nhau:</p><p>nhiều nhất ƯCLN(24, 28, 36) = 4 hàng dọc</p></div>',extra:'"Nhiều nhất", "lớn nhất" thường là ƯCLN.'}
];

/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='uc6_seen';
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
  const mcSlots=[['uc',['NB']],['ucln',['NB']],['ucln',['TH']],['ps',['NB','TH']],['bt',['NB','TH']],[null,['VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['uc','ucln','ps'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=[
    pick(MC.filter(q=>q.topic==='uc'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='ucln'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='ucln'&&q.level==='TH'),used),
    pick(MC.filter(q=>q.topic==='ps'&&q.level!=='VD'),used)
  ];
  const sa=[pick(SA.filter(q=>q.topic==='ucln'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='ps'&&q.level!=='VD'),used)];
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
