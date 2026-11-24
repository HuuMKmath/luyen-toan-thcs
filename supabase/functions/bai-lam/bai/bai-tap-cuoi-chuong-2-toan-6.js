// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ bai-tap-cuoi-chuong-2-toan-6/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "bai-tap-cuoi-chuong-2-toan-6";
export const TIEN_TO = "CC2-";

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

/* ============ Luyện tập chung (sau Bài 12): công cụ ============ */
const gcd=(a,b)=>b?gcd(b,a%b):a;
const lcm=(a,b)=>a/gcd(a,b)*b;
const gA=a=>a.reduce(gcd), lA=a=>a.reduce(lcm);
const FR=(a,b)=>`<span\tclass="fr"><span>${a}</span><span>${b}</span></span>`;   // phân số (không có dấu cách trong thẻ)
const UCLN=(...a)=>`ƯCLN(${a.join(', ')})`, BCNN=(...a)=>`BCNN(${a.join(', ')})`;
const fmin=(A,B)=>{const fa=fac(A),fb=fac(B);return fa.filter(([p])=>fb.some(z=>z[0]===p)).map(([p,e])=>[p,Math.min(e,fb.find(z=>z[0]===p)[1])]);};
const fmax=(A,B)=>{const m={};fac(A).concat(fac(B)).forEach(([p,e])=>{m[p]=Math.max(m[p]||0,e);});return Object.keys(m).map(Number).sort((a,b)=>a-b).map(p=>[p,m[p]]);};
const FSn=n=>n===1?'1':FS(fac(n));
const uniq=a=>a.filter((x,i)=>a.indexOf(x)===i);
// cặp a = g·x, b = g·y với ƯCLN(x, y) = 1, x ≠ y, cả hai ≥ 2
function pairG(gs,hi){for(let k=0;k<500;k++){const g=sel(gs),x=ri(2,fl(hi/g)),y=ri(2,fl(hi/g));if(x===y||gcd(x,y)!==1)continue;return [g*x,g*y,g];}return [12,18,6];}
// phân số tối giản có mẫu cho trước
const numFor=(d,lo)=>pickN(lo||1,d-1,x=>gcd(x,d)===1)||1;
const FB_LC=()=>({stem:'Khi tìm BCNN bằng cách phân tích ra thừa số nguyên tố, ta chọn:',opts:[{t:'Các thừa số nguyên tố chung và riêng, mỗi thừa số lấy với số mũ lớn nhất'},{t:'Các thừa số nguyên tố chung, mỗi thừa số lấy với số mũ nhỏ nhất',err:'Đây là cách tìm ƯCLN.'},{t:'Các thừa số nguyên tố chung và riêng, mỗi thừa số lấy với số mũ nhỏ nhất',err:'BCNN lấy số mũ lớn nhất.'},{t:'Chỉ các thừa số nguyên tố riêng',err:'Phải lấy cả thừa số chung.'}],ans:0,exp:'BCNN: chọn các thừa số nguyên tố chung và riêng, lấy mỗi thừa số với số mũ lớn nhất.'});
function tryL(f){for(let n=0;n<200;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>String(o.t))).size===4)return r;}return FB_LC();}
// lựa chọn: đáp án đúng + các lựa chọn sai khác nhau, bỏ những lựa chọn trùng đáp án
const opt4=(stem,right,W,exp)=>{const o=pickOpts(right,W.filter(w=>w&&w[0]!==undefined).map(w=>({t:''+w[0],err:w[1]})));return o.length<3?null:{stem,opts:[{t:nb(''+right)}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp};};
const CAN=['Giáp','Ất','Bính','Đinh','Mậu','Kỉ','Canh','Tân','Nhâm','Quý'],CHI=['Tí','Sửu','Dần','Mão','Thìn','Tị','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const ccName=y=>CAN[(y-4)%10]+' '+CHI[(y-4)%12];
const DAYS=['thứ Hai','thứ Ba','thứ Tư','thứ Năm','thứ Sáu','thứ Bảy','Chủ nhật'];
const tfMake=(make,stem)=>{for(let n=0;n<60;n++){const it=mixed(make);if(it)return {stem:typeof stem==='function'?stem():stem,items:wrap(it)};}return null;};


/* ============ Bài tập cuối chương II: công cụ riêng ============ */
const MON=m=>`tháng ${m}`;
const addM=(M,k)=>((M-1+k)%12)+1;
const nOm=n=>fac(n).length;                      // số ước nguyên tố
const PR2=PR.filter(p=>p>=11&&p<100);
// biểu thức tính rồi phân tích (theo bài 2.54)
function calcExpr(){for(let k=0;k<300;k++){const t=ri(0,2);let s,V,W;
  if(t===0){const a=ri(3,15),b=ri(2,9),c=ri(2,9);s=`${a}<sup>2</sup> + ${b}<sup>2</sup> + ${c}<sup>2</sup>`;V=a*a+b*b+c*c;W=(a+b+c)*(a+b+c);}
  else if(t===1){const y=sel([2,4,5,8]),q=ri(20,90),z=ri(10,90);const x=y*q;s=`${x} : ${y} + ${z}`;V=q+z;W=(x%(y+z)===0)?x/(y+z):2*V+2;}
  else {const a=ri(3,12),b=ri(3,12),c=ri(2,9),d=ri(2,9);s=`${a} · ${b} + ${c} · ${d}`;V=a*b+c*d;W=(a*b+c)*d;}
  if(V<20||V>2000||isP(V)||fac(V).length<2||W===V)continue;return {s,V,W};}return {s:'400 : 5 + 40',V:120,W:9};}
// cặp hợp số nguyên tố cùng nhau và các cặp gây nhiễu
const COMP=range(4,60).filter(n=>!isP(n));
// điều kiện xếp hàng (bài toán cổ 2.62)
function duckSet(N){for(let k=0;k<2000;k++){const x=ri(30,N-1),ms=shuffle([2,3,4,5,6,7,8,9]).slice(0,ri(4,5)).sort((a,b)=>a-b);let nNot=0;
  const C=ms.map(m=>{const r=x%m;if(r===0)return {m,t:'du',txt:`xếp hàng ${m} thì vừa đủ`,f:v=>v%m===0};
    const c=RNG();if(c<.3&&nNot<2){nNot++;return {m,t:'not',txt:`xếp hàng ${m} thì chưa vừa`,f:v=>v%m!==0};}
    if(c<.65)return {m,t:'th',txt:`xếp hàng ${m} thì thừa ${r} con`,f:v=>v%m===r};return {m,t:'ti',txt:`xếp hàng ${m} thì thiếu ${m-r} con`,f:v=>v%m===r};});
  const S=range(1,N-1).filter(v=>C.every(c=>c.f(v)));if(S.length!==1||!C.some(c=>c.t==='du'))continue;return {x,C,N};}return null;}

/* ============ Câu nhiều lựa chọn ============ */
// ch: chia hết
function mDivOf(){return tryL(()=>{const n=sel([12,15,18,20,24,30,36,45]),ds=divs(n).filter(d=>d>1&&d<n),d=sel(ds);const nd2=range(2,n-1).filter(k=>n%k&&gcd(k,n)>1);
  return opt4(`Biết a ⋮ ${n}. Khẳng định nào sau đây chắc chắn đúng?`,`a ⋮ ${d}`,[[`a ⋮ ${2*n}`,`Ví dụ a = ${n} không chia hết cho ${2*n}.`],...shuffle(nd2).slice(0,4).map(k=>[`a ⋮ ${k}`,`Ví dụ a = ${n} không chia hết cho ${k}.`])],`${n} ⋮ ${d} nên mọi bội của ${n} đều chia hết cho ${d}.`);});}
function mPow(){return tryL(()=>{const p=sel([2,3,4,5,6,7]),n=ri(2,6);const V=Math.pow(p,n)*(p+1);const W=shuffle(range(2,3*p+3).filter(d=>V%d&&d!==p+1)).slice(0,4).map(d=>[''+d,`${p}<sup>${n}</sup> + ${p}<sup>${n+1}</sup> = ${p}<sup>${n}</sup> · ${p+1} không chia hết cho ${d}.`]);
  return opt4(`Không tính giá trị, tổng ${p}<sup>${n}</sup> + ${p}<sup>${n+1}</sup> chia hết cho số nào sau đây?`,''+(p+1),W,`${p}<sup>${n}</sup> + ${p}<sup>${n+1}</sup> = ${p}<sup>${n}</sup> · (1 + ${p}) = ${p}<sup>${n}</sup> · ${p+1} chia hết cho ${p+1}.`);});}
const RULE4=[
  ['Một số tự nhiên chia hết cho cả 2, 5 và 9 khi và chỉ khi:','Chữ số tận cùng là 0 và tổng các chữ số chia hết cho 9',[['Chữ số tận cùng là 0 và tổng các chữ số chia hết cho 3','Tổng chia hết cho 3 chưa đủ để chia hết cho 9.'],['Chữ số tận cùng là 5 và tổng các chữ số chia hết cho 9','Tận cùng 5 thì không chia hết cho 2.'],['Chữ số tận cùng là số chẵn và tổng các chữ số chia hết cho 9','Còn phải chia hết cho 5: tận cùng 0.']],'Chia hết cho 2 và 5: tận cùng 0; chia hết cho 9: tổng các chữ số chia hết cho 9.'],
  ['Số tự nhiên nào chia hết cho 6?','Số chia hết cho cả 2 và 3',[['Số có chữ số tận cùng là 6','Ví dụ 16 không chia hết cho 6.'],['Số có tổng các chữ số chia hết cho 6','Ví dụ 15 có tổng chữ số 6 nhưng không chia hết cho 6.'],['Số chia hết cho 2 hoặc chia hết cho 3','Ví dụ 4 chia hết cho 2 nhưng không chia hết cho 6.']],'6 = 2 · 3 với 2 và 3 nguyên tố cùng nhau: chia hết cho 6 khi chia hết cho cả 2 và 3.']];
function mRule4(){const [s,r,W,e]=sel(RULE4);return mkMC(s,r,W,e);}
const BIG=()=>sel([ri(40,99),ri(100,999),ri(1000,2100)]);
function mSetX(){return tryL(()=>{const [m1,m2]=sel([[2,3],[3,5],[2,9],[5,9],[2,5],[3,2]]),a=ri(5,39),b=ri(5,39);const ok=v=>(v-a)%m1===0&&v>a&&(v+b)%m2===0;
  const xs=[];for(let k=0;k<40&&xs.length<4;k++){const v=BIG();if(v>a&&!xs.includes(v)&&(xs.filter(ok).length===0||!ok(v)))xs.push(v);}if(xs.length<4||xs.filter(ok).length!==1)return null;const R=xs.find(ok);
  const why=v=>!((v-a)%m1===0)?`${v} − ${a} = ${v-a} không chia hết cho ${m1}.`:`${v} + ${b} = ${v+b} không chia hết cho ${m2}.`;
  return opt4(`Số x nào trong tập hợp {${xs.map(F).join('; ')}} thoả mãn x − ${a} chia hết cho ${m1} và x + ${b} chia hết cho ${m2}?`,F(R),xs.filter(v=>v!==R).map(v=>[F(v),why(v)]),`${F(R)} − ${a} = ${F(R-a)} ⋮ ${m1} và ${F(R)} + ${b} = ${F(R+b)} ⋮ ${m2}.`);});}
// nt: số nguyên tố, phân tích
function mCalc(){return tryL(()=>{const {s,V,W}=calcExpr();const f=fac(V);const bad1=f.map(([p,e],i)=>i===0?[p,e+1]:[p,e]);const p0=f[0][0];const comp=f[0][1]>=2?[[p0*p0,1]].concat(f.slice(0).map(([p,e],i)=>i===0?[p,e-2]:[p,e]).filter(z=>z[1]>0)):null;
  return opt4(`Thực hiện phép tính ${s} rồi phân tích kết quả ra thừa số nguyên tố, ta được:`,FS(f),[[FS(bad1),`${FS(bad1)} = ${F(fval(bad1))} ≠ ${F(V)}.`],comp?[comp.map(([p,e])=>e>1?`${p}<sup>${e}</sup>`:''+p).join(' · '),`${p0*p0} không phải số nguyên tố.`]:null,[FSn(W),`Đã tính sai thứ tự hoặc sai phép tính: kết quả đúng là ${F(V)}.`],[FS(f.map(([p,e])=>[p,e]).concat([[f[f.length-1][0]<7?7:11,1]]).sort((a,b)=>a[0]-b[0]).filter((z,i,A)=>A.findIndex(y=>y[0]===z[0])===i)),'Thừa một thừa số nguyên tố.']].filter(Boolean),`${s} = ${F(V)} = ${FS(f)}.`);});}
function mCoph(){return tryL(()=>{const pairs=[];for(let k=0;k<80&&pairs.length<1;k++){const a=sel(COMP),b=sel(COMP);if(a<b&&gcd(a,b)===1)pairs.push([a,b]);}if(!pairs.length)return null;const [a,b]=pairs[0];
  const W=[];for(let k=0;k<80&&W.length<6;k++){const x=ri(4,50),y=ri(4,50);if(x>=y)continue;if(gcd(x,y)>1)W.push([`${x} và ${y}`,`${UCLN(x,y)} = ${gcd(x,y)} ≠ 1.`]);else if(isP(x)||isP(y))W.push([`${x} và ${y}`,`${isP(x)?x:y} là số nguyên tố, không phải hợp số.`]);}
  return opt4('Cặp số nào sau đây gồm hai hợp số và là hai số nguyên tố cùng nhau?',`${a} và ${b}`,shuffle(W),`${a} = ${FSn(a)}, ${b} = ${FSn(b)} đều là hợp số và ${UCLN(a,b)} = 1.`);});}
const PQ=[['Với p, q là hai số nguyên tố khác nhau, khẳng định nào sau đây luôn đúng?','ƯCLN(p, q) = 1 và BCNN(p, q) = p · q',[['p · q là số nguyên tố','p · q có các ước 1, p, q, p · q nên là hợp số.'],['p + q là số chẵn','2 + 3 = 5 là số lẻ.'],['ƯCLN(p, q) = p','Ước chung của p và q chỉ có 1.']],'Hai số nguyên tố khác nhau chỉ có ước chung là 1, nên nguyên tố cùng nhau; BCNN bằng tích.'],
  ['Số nào sau đây có đúng ba ước?','Bình phương của một số nguyên tố',[['Một số nguyên tố','Số nguyên tố có đúng hai ước.'],['Tích của hai số nguyên tố khác nhau','p · q có bốn ước: 1, p, q, p · q.'],['Lập phương của một số nguyên tố','p<sup>3</sup> có bốn ước: 1, p, p<sup>2</sup>, p<sup>3</sup>.']],'p<sup>2</sup> có đúng ba ước: 1, p, p<sup>2</sup>.'],
  ['Biết p là số nguyên tố lớn hơn 2. Khẳng định nào sau đây đúng?','p là số lẻ',[['p chia hết cho 3','Ví dụ p = 5 không chia hết cho 3.'],['p + 2 là số nguyên tố','Ví dụ p = 7 thì p + 2 = 9 là hợp số.'],['p + 1 là số nguyên tố','p lẻ nên p + 1 là số chẵn lớn hơn 2, là hợp số.']],'Số nguyên tố chẵn duy nhất là 2, nên số nguyên tố lớn hơn 2 là số lẻ.']];
function mPQ(){const [s,r,W,e]=sel(PQ);return mkMC(s,r,W,e);}
function mUcCnt(){return tryL(()=>{const ps=shuffle([2,3,5,7]).slice(0,ri(2,3)).sort((a,b)=>a-b),f=ps.map(p=>[p,ri(1,3)]),n=f.reduce((s,[p,e])=>s*(e+1),1);
  return opt4(`Biết ${UCLN('a','b')} = ${FS(f)}. Tập hợp ƯC(a, b) có bao nhiêu phần tử?`,''+n,[[''+(n-1),'Còn đếm cả ước 1.'],[''+f.reduce((s,[p,e])=>s*e,1),'Số ước của p<sup>e</sup> là e + 1, không phải e.'],[''+f.reduce((s,[p,e])=>s+e+1,0),'Phải nhân các (số mũ + 1), không cộng.'],[''+(n+1),'Đếm lại các ước.']],`ƯC(a, b) = Ư(${FS(f)}); số ước là ${f.map(([p,e])=>`(${e} + 1)`).join(' · ')} = ${n}.`);});}
// ub: ƯCLN, BCNN, phân số
function mPrimes(){return tryL(()=>{const [p,q]=shuffle(PR2).slice(0,2);
  return opt4(`Biết ${p} và ${q} là hai số nguyên tố. ƯCLN và BCNN của hai số này lần lượt là:`,`1 và ${F(p*q)}`,[[`${F(p*q)} và 1`,'Đã đổi chỗ ƯCLN và BCNN.'],[`1 và ${p+q}`,'BCNN bằng tích, không phải tổng.'],[`${Math.min(p,q)} và ${F(p*q)}`,`${Math.min(p,q)} không là ước của ${Math.max(p,q)}.`],[`1 và ${Math.max(p,q)}`,`${Math.max(p,q)} không chia hết cho ${Math.min(p,q)}.`]],`Hai số nguyên tố khác nhau có ƯCLN = 1 và BCNN = ${p} · ${q} = ${F(p*q)}.`);});}
function mExpAB(){return tryL(()=>{const [p,q]=shuffle([2,3,5,7]).slice(0,2).sort((a,b)=>a-b);const u=ri(1,4),v=ri(1,4);let a=ri(1,5),b=ri(1,5);if(a===u||b===v)return null;
  const G=`${p}<sup>${Math.min(a,u)}</sup> · ${q}<sup>${Math.min(v,b)}</sup>`,Lm=`${p}<sup>${Math.max(a,u)}</sup> · ${q}<sup>${Math.max(v,b)}</sup>`;
  const E=e=>e===1?'':`<sup>${e}</sup>`;return opt4(`Biết hai số ${p}<sup>a</sup> · ${q}${E(v)} và ${p}${E(u)} · ${q}<sup>b</sup> có ƯCLN là ${G.replace(/<sup>1<\/sup>/g,'')} và BCNN là ${Lm.replace(/<sup>1<\/sup>/g,'')}. Khi đó a + b bằng:`,''+(a+b),[[''+(Math.min(a,u)+Math.min(b,v)),'Đã lấy số mũ trong ƯCLN, cần so sánh với số mũ đã biết.'],[''+(Math.max(a,u)+Math.max(b,v)),'Đã lấy số mũ trong BCNN, cần so sánh với số mũ đã biết.'],[''+(u+v),'Đây là tổng các số mũ đã biết.'],[''+(a+b+1),'Xét lại từng thừa số.']],`Số mũ của ${p}: min(a, ${u}) = ${Math.min(a,u)}, max(a, ${u}) = ${Math.max(a,u)} nên a = ${a}. Số mũ của ${q}: min(${v}, b) = ${Math.min(v,b)}, max = ${Math.max(v,b)} nên b = ${b}. a + b = ${a+b}.`);});}
function mRedSig(){return tryL(()=>{const mk=g=>{for(let k=0;k<200;k++){const x=ri(11,199),y=ri(x+1,399);if(gcd(x,y)===g)return [x,y];}return null;};const R=mk(sel([3,9,5,15])),W=[mk(1),mk(1),mk(1),mk(1)];if(!R||W.some(w=>!w))return null;
  return opt4('Phân số nào sau đây chưa tối giản?',FR(...R),W.map(w=>[FR(...w),`${UCLN(...w)} = 1 nên phân số đã tối giản.`]),`${UCLN(...R)} = ${gcd(...R)} (dùng dấu hiệu chia hết cho ${gcd(...R)%5===0?5:3}) nên ${FR(...R)} = ${FR(R[0]/gcd(...R),R[1]/gcd(...R))}.`);});}
function mPq2(){return tryL(()=>{const [p,q]=shuffle(PR.filter(x=>x>2&&x<60)).slice(0,2).sort((a,b)=>a-b);
  return opt4(`Hai số nguyên tố p và q (p < q) có ${BCNN('p','q')} = ${p*q}. Hiệu q − p bằng:`,''+(q-p),[[''+(p*q-1),'BCNN của hai số nguyên tố bằng tích, cần phân tích ra thừa số nguyên tố.'],[''+(q+p),'Đây là tổng.'],[''+(q-p+2),`Phân tích lại ${p*q} = ${p} · ${q}.`],[''+(q-1),`p = ${p}, không phải 1.`]],`${p*q} = ${p} · ${q} nên p = ${p}, q = ${q}; q − p = ${q-p}.`);});}
// tt: thực tế
function mMonth(){return tryL(()=>{const a=sel([2,3,4,6]),b=sel([3,4,6,8,9,12].filter(x=>x!==a)),M=ri(1,12),l=lcm(a,b);if(l>24)return null;const R=addM(M,l);
  return opt4(`Bác Nam định kì ${a} tháng một lần thay dầu, ${b} tháng một lần xoay lốp xe. Nếu bác làm hai việc đó cùng lúc vào tháng ${M} năm nay thì lần gần nhất tiếp theo bác cùng làm hai việc vào tháng nào (có thể của năm sau)?`,'Tháng '+R,[['Tháng '+addM(M,a*b),a*b!==l?`${a} · ${b} = ${a*b} tháng là bội chung nhưng chưa nhỏ nhất.`:'x'],['Tháng '+addM(M,Math.max(a,b)),`Sau ${Math.max(a,b)} tháng chỉ làm một việc.`],['Tháng '+((M+l)>12?M+l-12+1:M+l+1),'Đếm lại số tháng.'],['Tháng '+addM(M,a+b),'Không cộng hai chu kì.'],['Tháng '+addM(M,l+12),'Chưa phải lần gần nhất.']].filter(w=>w[1]!=='x'),`Sau ${BCNN(a,b)} = ${l} tháng; tháng ${M} + ${l} → tháng ${R}${M+l>12?' năm sau':''}.`);});}
function mFruit(){return tryL(()=>{const g=ri(3,9),xs=shuffle([2,3,4,5,6,7]).slice(0,3);if(gA(xs)!==1)return null;const [c,x,b]=xs.map(v=>v*g);const k=ri(0,2),nm=['ổ bánh mì','hộp sữa','quả chuối'][k];
  return opt4(`Đội tình nguyện có ${c} ổ bánh mì, ${x} hộp sữa và ${b} quả chuối, chia đều mỗi loại vào các suất ăn sao cho số suất nhiều nhất. Khi đó mỗi suất có bao nhiêu ${nm}?`,''+xs[k],[[''+g,'Đây là số suất ăn.'],[''+xs[(k+1)%3],`Đây là số ${['ổ bánh mì','hộp sữa','quả chuối'][(k+1)%3]} mỗi suất.`],[''+(xs[k]+1),'Tính lại phép chia.'],[''+[c,x,b][k]/gcd(...[c,x,b].filter((_,i)=>i!==k)),'Số suất ăn là ƯCLN của cả ba số.']].filter(w=>Number.isInteger(+w[0])&&+w[0]!==xs[k]),`Số suất nhiều nhất là ${UCLN(c,x,b)} = ${g}; mỗi suất có ${[c,x,b][k]} : ${g} = ${xs[k]} ${nm}.`);});}
function mDuck(){return tryL(()=>{const D=duckSet(sel([150,200,250]));if(!D)return null;const {x,C,N}=D;const W=[];
  const near=range(1,N-1).filter(v=>v!==x).map(v=>({v,bad:C.filter(c=>!c.f(v))})).filter(o=>o.bad.length===1).slice(0,30);shuffle(near).slice(0,3).forEach(o=>W.push([''+o.v,`${o.v}: không thoả mãn điều kiện "${o.bad[0].txt}".`]));
  return opt4(`Một đàn vịt có chưa đến ${N} con. Biết ${C.map(c=>c.txt).join('; ')}. Số vịt là:`,''+x,W,`Kiểm tra lần lượt các bội của ${C.filter(c=>c.t==='du').map(c=>c.m).join(', ')} nhỏ hơn ${N}: chỉ có ${x} thoả mãn mọi điều kiện.`);});}
function mGroup(){return tryL(()=>{const xs=shuffle([8,9,10,12,15,18]).slice(0,3),l=lA(xs);if(l>180)return null;const r=ri(1,Math.min(...xs)-1),m=sel([7,11,13]);let S=[];const lo=ri(200,400),hi=lo+ri(150,300);for(let v=lo;v<=hi;v++)if(xs.every(h=>v%h===r)&&v%m===0)S.push(v);if(S.length!==1)return null;const x=S[0];
  const W=[];for(let v=lo;v<=hi;v++)if(xs.every(h=>v%h===r)&&v!==x)W.push([''+v,`${v} không chia hết cho ${m}.`]);for(let v=lo;v<=hi&&W.length<6;v++)if(v%m===0&&v!==x&&(v-r)%l)W.push([''+v,`${v} − ${r} = ${v-r} không chia hết cho ${l}.`]);
  return opt4(`Số học sinh của một trường trong khoảng từ ${lo} đến ${hi}. Khi xếp hàng ${xs.join(', hàng ')} đều thừa ${r} em, còn xếp hàng ${m} thì vừa đủ. Số học sinh của trường là:`,''+x,shuffle(W),`Số học sinh − ${r} là bội của ${BCNN(...xs)} = ${l}; trong khoảng đã cho, chỉ có ${x} chia hết cho ${m}.`);});}

const MC=[];
const addMC=(id,topic,level,gen,mix)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},mix?{mix}:{}));
addMC('c_dv','ch','NB',mDivOf,[8]);addMC('c_dv2','ch','NB',mDivOf,[8]);addMC('c_r4','ch','NB',mRule4);addMC('c_r42','ch','NB',mRule4);addMC('c_set','ch','TH',mSetX,[8,9]);addMC('c_set2','ch','TH',mSetX,[8,9]);addMC('c_pw','ch','VD',mPow,[8]);
addMC('n_pq3','nt','NB',mPQ,[10]);addMC('c_pw2','ch','TH',mPow,[8]);
addMC('n_pq','nt','NB',mPQ,[10,11]);addMC('n_pq2','nt','NB',mPQ,[10,11]);addMC('n_coph','nt','TH',mCoph,[10,11]);addMC('n_calc','nt','TH',mCalc,[10]);addMC('n_calc2','nt','TH',mCalc,[10]);addMC('n_uc','nt','VD',mUcCnt,[10,11]);
addMC('u_pr','ub','NB',mPrimes,[10]);addMC('u_pr2','ub','NB',mPrimes,[10]);addMC('u_red','ub','TH',mRedSig,[9,11]);addMC('u_pq','ub','TH',mPq2,[10,12]);addMC('u_exp','ub','VD',mExpAB,[10]);addMC('u_exp2','ub','VD',mExpAB,[10]);
addMC('t_mon','tt','TH',mMonth,[8,12]);addMC('t_mon2','tt','TH',mMonth,[8,12]);addMC('t_fr','tt','TH',mFruit);addMC('t_dk','tt','VD',mDuck,[8,9]);addMC('t_gr','tt','VD',mGroup,[8,12]);

/* ============ Câu đúng sai ============ */
const POOLC=[
  [IT('Nếu a ⋮ 6 thì a ⋮ 3.',true,'ch','NB','6 ⋮ 3 nên a ⋮ 3.'),IT('Nếu a ⋮ 3 thì a ⋮ 6.',false,'ch','NB','9 ⋮ 3 nhưng 9 không chia hết cho 6.')],
  [IT('Nếu a ⋮ 3 và a ⋮ 5 thì a ⋮ 15.',true,'ch','NB','3 và 5 nguyên tố cùng nhau, BCNN(3, 5) = 15.'),IT('Nếu a ⋮ 6 và a ⋮ 9 thì a ⋮ 54.',false,'ch','NB','18 chia hết cho 6 và 9 nhưng không chia hết cho 54; BCNN(6, 9) = 18.')],
  [IT('Nếu a là số nguyên tố lớn hơn 2 thì a + 1 chia hết cho 2.',true,'nt','NB','Số nguyên tố lớn hơn 2 là số lẻ.'),IT('Nếu a là số nguyên tố thì a + 1 là hợp số.',false,'nt','NB','a = 2 thì a + 1 = 3 là số nguyên tố.')],
  [IT('Nếu a là hợp số thì a có ít nhất ba ước.',true,'nt','NB','Hợp số có nhiều hơn hai ước.'),IT('Nếu a có đúng hai ước thì a là hợp số.',false,'nt','NB','Số có đúng hai ước là số nguyên tố.')],
  [IT('Hai số nguyên tố khác nhau luôn là hai số nguyên tố cùng nhau.',true,'ub','NB','Ước chung của chúng chỉ có 1.'),IT('Hai hợp số khác nhau không thể là hai số nguyên tố cùng nhau.',false,'ub','NB','8 và 9 là hợp số, ƯCLN(8, 9) = 1.')],
  [IT('Nếu a ⋮ 10 thì chữ số tận cùng của a là 0.',true,'ch','NB','a ⋮ 2 và a ⋮ 5 nên tận cùng là 0.'),IT('Nếu chữ số tận cùng của a là 5 thì a ⋮ 10.',false,'ch','NB','15 không chia hết cho 10.')]];
function tfPoolC(){return tfMake(()=>shuffle(POOLC).slice(0,4).map(p=>sel(p)),'Với a là số tự nhiên, xét các phát biểu sau:');}
function tfNB(){return tfMake(()=>{const o=[],R=()=>RNG()<.5;
  {const v=R(),p=sel(PR.filter(x=>x>10&&x<100)),c=pickN(11,99,x=>!isP(x)&&x%2&&x%5&&x%3);o.push(IT(`${v?p:c} là số nguyên tố.`,v,'nt','NB',v?`${p} chỉ có hai ước là 1 và ${p}.`:`${c} = ${FSn(c)} là hợp số.`));}
  {const v=R(),n=ri(100,999)*9+(v?0:ri(1,8));o.push(IT(`${F(n)} chia hết cho 9.`,n%9===0,'ch','NB',`Tổng các chữ số là ${dsum(n)}.`));}
  {const v=R(),[p,q]=shuffle(PR2).slice(0,2);o.push(IT(`BCNN(${p}, ${q}) = ${v?p*q:p+q}`,v,'ub','NB',`${p}, ${q} là hai số nguyên tố khác nhau nên BCNN bằng tích ${p*q}.`));}
  {const v=R(),ps=shuffle([2,3,5,7]).slice(0,ri(1,3)).sort((a,b)=>a-b),f=ps.map(p=>[p,ri(1,2)]),k=v?ps.length:ps.length+1;o.push(IT(`Số ${F(fval(f))} có đúng ${k} ước nguyên tố.`,k===ps.length,'nt','NB',`${F(fval(f))} = ${FS(f)}.`));}
  return o;},'Xét các khẳng định sau:');}
function tfSet(){for(let k=0;k<200;k++){const xs=uniq([ri(40,99),ri(100,999),ri(100,999),ri(1000,2100),ri(1000,2100),ri(1000,2100)]);if(xs.length<6)continue;const R=()=>RNG()<.5;
  const conds=shuffle([[2,'−',ri(5,39)],[3,'−',ri(5,39)],[5,'+',ri(5,39)],[9,'+',ri(5,39)]]);
  const r=tfMake(()=>conds.map(([m,s,a])=>{const S=xs.filter(v=>s==='−'?(v>a&&(v-a)%m===0):(v+a)%m===0);const v=R();const k2=v?S.length:(S.length?S.length-1:1);
    return IT(k2?`Có đúng ${k2} số x ∈ A để x ${s} ${a} chia hết cho ${m}.`:`Không có số x nào thuộc A để x ${s} ${a} chia hết cho ${m}.`,k2===S.length,'ch','TH',S.length?`Các số đó: ${S.map(F).join('; ')}.`:'Không có số nào.');}),`Cho tập hợp A = {${xs.map(F).join('; ')}}. Xét các khẳng định sau:`);if(r)return r;}return tfNB();}
function tfAB(){for(;;){const g=sel([6,12,18,30,36,45]),x=sel([2,3,5,7]),y=sel([4,5,7,9,11]);if(gcd(x,y)!==1||x===y)continue;const a=g*x,b=g*y,R=()=>RNG()<.5;
  const r=tfMake(()=>{const o=[];
    {const v=R(),d=sel([2,3,5,9]);const t=a%d===0;o.push(IT(`${F(a)} chia hết cho ${d}.`,t,'ch','TH',`${F(a)} = ${FS(fac(a))}${t?'':''}; ${t?'có':'không có'} ${d===9?'3<sup>2</sup>':d} trong phân tích.`));}
    {const v=R();o.push(IT(`${F(b)} = ${v?FS(fac(b)):FS(fac(b).map(([p,e],i)=>i===0?[p,e+1]:[p,e]))}`,v,'nt','TH',`${F(b)} = ${FS(fac(b))}.`));}
    {const v=R();o.push(IT(`${UCLN(a,b)} = ${v?g:g*2}`,v,'ub','TH',`ƯCLN = ${FS(fmin(a,b))} = ${g}.`));}
    {const v=R();o.push(IT(`${BCNN(a,b)} = ${v?F(lcm(a,b)):F(a*b)}`,v,'ub','TH',`BCNN = ${FS(fmax(a,b))} = ${F(lcm(a,b))}.`));}
    return o;},`Với hai số ${F(a)} và ${F(b)}, xét các khẳng định sau:`);if(r)return r;}}
function tfExp(){for(;;){const [p,q]=shuffle([2,3,5]).slice(0,2).sort((a,b)=>a-b),u=ri(1,4),v=ri(1,4),a=ri(1,5),b=ri(1,5);if(a===u||b===v)continue;const R=()=>RNG()<.5,f1=[[p,a],[q,v]],f2=[[p,u],[q,b]];
  const P=e=>e===1?'':`<sup>${e}</sup>`;
  const r=tfMake(()=>{const o=[];
    {const t=R(),w=t?a:Math.min(a,u);o.push(IT(`a = ${w}`,w===a,'ub','VD',`Số mũ của ${p} trong ƯCLN là ${Math.min(a,u)}, trong BCNN là ${Math.max(a,u)}; một trong hai là ${u} nên a = ${a}.`));}
    {const t=R(),w=t?b:Math.max(b,v)+1;o.push(IT(`b = ${w}`,w===b,'ub','VD',`Số mũ của ${q}: một trong hai số ${Math.min(b,v)}, ${Math.max(b,v)} là ${v} nên b = ${b}.`));}
    {const t=R(),n1=Math.pow(p,a)*Math.pow(q,v);o.push(IT(`Số thứ nhất bằng ${F(t?n1:n1*p)}.`,t,'ub','VD',`${p}${P(a)} · ${q}${P(v)} = ${F(n1)}.`));}
    {const t=R(),c=(Math.min(a,u)+1)*(Math.min(b,v)+1);o.push(IT(`Hai số có đúng ${t?c:c+1} ước chung.`,t,'ub','VD',`ƯC = Ư(ƯCLN); ƯCLN = ${p}${P(Math.min(a,u))} · ${q}${P(Math.min(b,v))} có ${c} ước.`));}
    return o;},`Biết hai số ${p}<sup>a</sup> · ${q}${P(v)} và ${p}${P(u)} · ${q}<sup>b</sup> có ƯCLN là ${p}${P(Math.min(a,u))} · ${q}${P(Math.min(b,v))} và BCNN là ${p}${P(Math.max(a,u))} · ${q}${P(Math.max(b,v))}. Xét các khẳng định sau:`);if(r)return r;}}
function tfMonth(){for(;;){const a=sel([2,3,4]),b=sel([3,4,6,8].filter(x=>x!==a)),c=sel([6,9,12].filter(x=>x!==a&&x!==b)),M=ri(1,12),l2=lcm(a,b),l3=lA([a,b,c]);if(l3>36)continue;const R=()=>RNG()<.5;
  const r=tfMake(()=>{const o=[];
    {const t=R(),w=t?addM(M,l2):addM(M,a*b);o.push(IT(`Lần gần nhất tiếp theo bác cùng thay dầu và xoay lốp là vào tháng ${w}.`,w===addM(M,l2),'tt','VD',`${BCNN(a,b)} = ${l2} tháng; tháng ${M} + ${l2} → tháng ${addM(M,l2)}.`));}
    {const t=R(),w=t?l3:a*b*c;o.push(IT(`Sau ít nhất ${w} tháng bác lại làm cả ba việc cùng lúc.`,w===l3,'tt','VD',`${BCNN(a,b,c)} = ${l3}.`));}
    {const t=R(),n=t?fl(24/a):fl(24/a)+1;o.push(IT(`Trong 24 tháng tiếp theo, bác thay dầu ${n} lần.`,n===fl(24/a),'tt','VD',`24 : ${a} = ${24/a|0}${24%a?` (dư ${24%a})`:''}.`));}
    {const t=R(),m2=t?addM(M,l3):addM(M,l3+1);o.push(IT(`Lần đầu tiếp theo bác làm cả ba việc cùng lúc là vào tháng ${m2}.`,m2===addM(M,l3),'tt','VD',`Sau ${l3} tháng: tháng ${addM(M,l3)}.`));}
    return o;},`Bác Nam định kì ${a} tháng thay dầu, ${b} tháng xoay lốp và ${c} tháng kiểm tra phanh xe. Bác làm cả ba việc vào tháng ${M} năm nay. Xét các khẳng định sau:`);if(r)return r;}}
function tfDuck(){for(;;){const D=duckSet(200);if(!D)continue;const {x,C,N}=D,R=()=>RNG()<.5;
  const r=tfMake(()=>{const o=[];const du=C.find(c=>c.t==='du');
    {const t=R(),m=t?du.m:sel([2,3,4,5,6,7,8,9].filter(z=>x%z));o.push(IT(`Số vịt chia hết cho ${m}.`,x%m===0,'tt','VD',`Số vịt là ${x}; ${rel(x,m)}.`));}
    {const t=R();o.push(IT(`Số vịt là số ${t===(x%2===1)?'lẻ':'chẵn'}.`,t,'tt','VD',`Số vịt là ${x}.`));}
    {const t=R(),near=range(1,N-1).filter(v=>v!==x&&C.filter(c=>!c.f(v)).length===1),w=t?x:(near.length?sel(near):sel(range(1,N-1).filter(v=>v!==x&&v%du.m===0)));o.push(IT(`Số vịt là ${w}.`,w===x,'tt','VD',w===x?`${x} thoả mãn mọi điều kiện và là số duy nhất nhỏ hơn ${N}.`:`${w} không thoả mãn điều kiện "${C.find(c=>!c.f(w)).txt}".`));}
    {const t=R(),m=sel([2,3,4,5,6,7,8,9,10]),rr=t?x%m:(x%m+1)%m;o.push(IT(`Nếu xếp hàng ${m} thì thừa ${rr} con.`,rr===x%m,'tt','VD',`${x} = ${m} · ${fl(x/m)} + ${x%m}.`));}
    return o;},`Một đàn vịt có chưa đến ${N} con. Biết ${C.map(c=>c.txt).join('; ')}. Xét các khẳng định sau:`);if(r)return r;}}
const TF=[];
const addTF=(id,topic,level,gen,mix)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},mix?{mix}:{}));
addTF('f_pc','ch','NB',tfPoolC);addTF('f_pc2','nt','NB',tfPoolC);addTF('f_nb','ub','NB',tfNB,[9,10,12]);addTF('f_nb2','nt','NB',tfNB,[9,10,12]);
addTF('f_set','ch','TH',tfSet,[8,9]);addTF('f_ab','ub','TH',tfAB,[9,10,11,12]);addTF('f_ab2','nt','TH',tfAB,[9,10,11,12]);addTF('f_set2','ch','TH',tfSet,[8,9]);
addTF('f_exp','ub','VD',tfExp,[10,11,12]);addTF('f_mon','tt','VD',tfMonth,[8,12]);addTF('f_dk','tt','VD',tfDuck,[8,9]);addTF('f_mon2','tt','VD',tfMonth,[8,12]);

/* ============ Câu trả lời ngắn ============ */
const SA=[
 {id:'s_cnt',topic:'ch',level:'NB',unit:'số',gen:()=>{for(;;){const xs=uniq([BIG(),BIG(),BIG(),BIG(),BIG(),BIG()]),m=sel([2,5,9,3]),a=ri(5,39),pl=RNG()<.5;const S=xs.filter(v=>pl?(v+a)%m===0:(v>a&&(v-a)%m===0));if(xs.length<6||!S.length)continue;return{stem:`Trong tập hợp {${xs.map(F).join('; ')}}, có bao nhiêu số x để x ${pl?'+':'−'} ${a} chia hết cho ${m}?`,ans:[S.length],exp:`Các số: ${S.map(F).join('; ')}.`};}},mix:[8,9]},
 {id:'s_pr',topic:'ub',level:'NB',unit:'',gen:()=>{const [p,q]=shuffle(PR2).slice(0,2);return{stem:`Biết ${p} và ${q} là hai số nguyên tố. Tính ${BCNN(p,q)} − ${UCLN(p,q)}.`,ans:[p*q-1],exp:`ƯCLN = 1, BCNN = ${p} · ${q} = ${F(p*q)}; hiệu ${F(p*q-1)}.`};},mix:[10]},
 {id:'s_calc',topic:'nt',level:'TH',unit:'',mix:[10],gen:()=>{const {s,V}=calcExpr();const f=fac(V);return{stem:`Thực hiện phép tính ${s} rồi phân tích kết quả ra thừa số nguyên tố. Tìm ước nguyên tố lớn nhất của kết quả.`,ans:[f[f.length-1][0]],exp:`${s} = ${F(V)} = ${FS(f)}.`};}},
 {id:'s_prm',topic:'nt',level:'TH',unit:'số',mix:[8,10],gen:()=>{const m=sel([3,4,5,6]),r=sel(range(1,m-1).filter(z=>gcd(z,m)===1));const S=PR.filter(p=>p>=10&&p<100&&p%m===r);if(!S.length)return SA[3].gen();return{stem:`Có bao nhiêu số nguyên tố có hai chữ số mà chia cho ${m} dư ${r}?`,ans:[S.length],exp:`Các số đó: ${S.join('; ')}.`};}},
 {id:'s_cop',topic:'ub',level:'VD',unit:'số',mix:[10,11],gen:()=>{const m=sel([6,10,12,14,15,21,30]),N=sel([20,24,30,36,40,50,60]);const S=range(1,N).filter(x=>gcd(x,m)===1);return{stem:`Có bao nhiêu số tự nhiên x với 1 ≤ x ≤ ${N} sao cho x và ${m} là hai số nguyên tố cùng nhau?`,ans:[S.length],exp:`${m} = ${FS(fac(m))}; x không chia hết cho ${fac(m).map(z=>z[0]).join(', ')}: ${S.join('; ')}.`};}},
 {id:'s_uc',topic:'ub',level:'VD',unit:'',mix:[10,11],gen:()=>{const ps=[2,3,5],f1=ps.map(p=>[p,ri(1,4)]),f2=ps.map(p=>[p,ri(0,4)]).filter(z=>z[1]>0);const g=f1.map(([p,e])=>{const z=f2.find(y=>y[0]===p);return z?[p,Math.min(e,z[1])]:null;}).filter(Boolean);if(!g.length)return SA[6].gen();const n=g.reduce((s,[p,e])=>s*(e+1),1);return{stem:`Cho a = ${FS(f1)} và b = ${FS(f2)}. Hai số a và b có bao nhiêu ước chung?`,ans:[n],exp:`${UCLN('a','b')} = ${FS(g)}; ƯC(a, b) = Ư(ƯCLN) có ${g.map(([p,e])=>`(${e} + 1)`).join(' · ')} = ${n} phần tử.`};}},
 {id:'s_exp',topic:'ub',level:'VD',unit:'',mix:[10],gen:()=>{const r=mExpAB();if(r.stem.startsWith('Khi tìm'))return SA[7].gen();return{stem:r.stem.replace(' Khi đó a + b bằng:',' Tính a + b.'),ans:[+r.opts[0].t],exp:r.exp};}},
 {id:'s_ex',topic:'nt',level:'TH',unit:'',mix:[10,12],gen:()=>{for(;;){const xs=shuffle([4,6,8,9,10,12,14,15,18,20]).slice(0,3),l=lA(xs);if(l>2000)continue;const f=fac(l);return{stem:`Phân tích ${BCNN(...xs)} ra thừa số nguyên tố. Tính tổng các số mũ của các thừa số nguyên tố trong kết quả.`,ans:[f.reduce((t,z)=>t+z[1],0)],exp:`${BCNN(...xs)} = ${F(l)} = ${f.map(([p,e])=>`${p}<sup>${e}</sup>`).join(' · ')}; tổng các số mũ ${f.map(z=>z[1]).join(' + ')} = ${f.reduce((t,z)=>t+z[1],0)}.`};}}},
 {id:'s_div',topic:'ch',level:'TH',unit:'',mix:[9,10],gen:()=>{for(;;){const pre=''+ri(1,9)+ri(0,9),suf=''+ri(0,9);const m=sel([[2,9],[5,9],[3,5],[2,3]]);const S=range(0,9).filter(d=>+(pre+d+suf)%m[0]===0&&+(pre+d+suf)%m[1]===0);if(S.length<2)continue;return{stem:`Tính tổng các chữ số * thoả mãn số ${OV(pre+'*'+suf)} chia hết cho cả ${m[0]} và ${m[1]}.`,ans:[S.reduce((s,v)=>s+v,0)],exp:`Thử từng chữ số: ${S.map(d=>pre+d+suf).join('; ')} thoả mãn; tổng các chữ số * là ${S.reduce((s,v)=>s+v,0)}.`};}}},
 {id:'s_mon',topic:'tt',level:'TH',unit:'',mix:[8,12],gen:()=>{for(;;){const a=sel([2,3,4,6]),b=sel([3,4,5,6,8,9]),M=ri(1,12),l=lcm(a,b);if(a===b||l>24)continue;return{stem:`Một nhà máy cứ ${a} tháng bảo dưỡng máy một lần và ${b} tháng kiểm tra điện một lần. Hai việc cùng làm vào tháng ${M} năm nay. Lần gần nhất tiếp theo cùng làm hai việc là tháng mấy (có thể của năm sau)?`,ans:[addM(M,l)],exp:`${BCNN(a,b)} = ${l} tháng; tháng ${M} + ${l} → tháng ${addM(M,l)}.`};}}},
 {id:'s_fr',topic:'tt',level:'TH',unit:'suất',gen:()=>{for(;;){const g=ri(3,12),xs=shuffle([2,3,4,5,6,7,8]).slice(0,3);if(gA(xs)!==1)continue;const v=xs.map(x=>x*g);return{stem:`Một bếp ăn từ thiện có ${v[0]} ổ bánh mì, ${v[1]} hộp sữa và ${v[2]} quả chuối. Chia đều mỗi loại vào các suất ăn sao cho suất nào cũng có đủ ba loại. Có thể chia được nhiều nhất bao nhiêu suất ăn?`,ans:[g],exp:`${UCLN(...v)} = ${g}.`};}}},
 {id:'s_gr',topic:'tt',level:'VD',unit:'học sinh',mix:[8,12],gen:()=>{for(;;){const r=mGroup();if(r.stem.startsWith('Khi tìm'))continue;return{stem:r.stem.replace(' Số học sinh của trường là:',' Tính số học sinh của trường.'),ans:[+r.opts[0].t],exp:r.exp};}}},
 {id:'s_dk',topic:'tt',level:'VD',unit:'con',mix:[8,9],gen:()=>{for(;;){const D=duckSet(sel([150,200,300]));if(!D)continue;return{stem:`Bài toán cổ. Một đàn vịt có chưa đến ${D.N} con. Biết ${D.C.map(c=>c.txt).join('; ')}. Tính số vịt.`,ans:[D.x],exp:`Thử các bội của ${D.C.filter(c=>c.t==='du').map(c=>c.m).join(', ')} nhỏ hơn ${D.N}: chỉ có ${D.x} thoả mãn mọi điều kiện.`};}}},
 {id:'s_cons',topic:'ch',level:'TH',unit:'',mix:[8],gen:()=>{const n=ri(10,300),S=3*n+3;return{stem:`Tổng của ba số tự nhiên liên tiếp bằng ${S}. Tìm số lớn nhất trong ba số đó.`,ans:[n+2],exp:`Tổng ba số liên tiếp = 3 · (số ở giữa); số ở giữa = ${S} : 3 = ${n+1}; số lớn nhất là ${n+2}.`};}},
 {id:'s_pp',topic:'nt',level:'VD',unit:'',mix:[10,12],gen:()=>{const [p,q]=shuffle(PR.filter(x=>x<40)).slice(0,2).sort((a,b)=>a-b);return{stem:`Hai số nguyên tố p và q (p < q) có ${BCNN('p','q')} = ${p*q}. Tính p + q.`,ans:[p+q],exp:`${p*q} = ${p} · ${q} nên p = ${p}, q = ${q}; p + q = ${p+q}.`};}},
 {id:'s_omb',topic:'ub',level:'TH',unit:'',mix:[10,12],gen:()=>{const [a,b,g]=pairG([4,6,10,12,15,18],120);const l=lcm(a,b);return{stem:`Phân tích ${BCNN(a,b)} ra thừa số nguyên tố. Kết quả có bao nhiêu thừa số nguyên tố khác nhau?`,ans:[fac(l).length],exp:`${BCNN(a,b)} = ${F(l)} = ${FS(fac(l))}.`};}},
 {id:'s_pw',topic:'ch',level:'NB',unit:'',mix:[8],gen:()=>{const p=sel([2,3,4,5,6,8,9]),n=ri(2,7),k=ri(1,3*p);return{stem:`Không tính giá trị, tìm số dư khi chia ${p}<sup>${n}</sup> + ${p}<sup>${n+1}</sup> + ${k} cho ${p+1}.`,ans:[k%(p+1)],exp:`${p}<sup>${n}</sup> + ${p}<sup>${n+1}</sup> = ${p}<sup>${n}</sup> · ${p+1} chia hết cho ${p+1}; ${k} chia cho ${p+1} dư ${k%(p+1)}.`};}}
].map(q=>Object.assign({type:'sa'},q));

/* ============ Chủ đề ============ */
const TOPICS={
  ch:{short:'Chia hết',name:'Quan hệ chia hết, dấu hiệu chia hết',rule:'Nếu các số hạng đều chia hết cho m thì tổng (hiệu) chia hết cho m. Chia hết cho 2, 5: xem chữ số tận cùng; chia hết cho 3, 9: xem tổng các chữ số.',tip:'Tổng các chữ số chia hết cho 3 chưa chắc chia hết cho 9; chữ số tận cùng chỉ dùng cho 2 và 5.'},
  nt:{short:'Số nguyên tố',name:'Số nguyên tố, phân tích ra thừa số nguyên tố',rule:'Số nguyên tố chỉ có hai ước 1 và chính nó. Mọi hợp số đều phân tích được ra thừa số nguyên tố, và chỉ có một cách (không kể thứ tự).',tip:'Thực hiện phép tính trước rồi mới phân tích; kết quả phân tích chỉ gồm các số nguyên tố.'},
  ub:{short:'ƯCLN, BCNN',name:'ƯCLN, BCNN và phân số',rule:'ƯCLN: thừa số chung, số mũ nhỏ nhất; BCNN: thừa số chung và riêng, số mũ lớn nhất. ƯC(a, b) là tập các ước của ƯCLN(a, b). Phân số tối giản khi tử và mẫu nguyên tố cùng nhau.',tip:'Hai số nguyên tố khác nhau có ƯCLN = 1, BCNN bằng tích. Hai hợp số vẫn có thể nguyên tố cùng nhau.'},
  tt:{short:'Thực tế',name:'Bài toán thực tế tổng hợp',rule:'Chia đều nhiều nhất: ƯCLN. Lặp lại, xếp hàng vừa đủ ít nhất: BCNN. Thừa r, thiếu r: bớt hoặc thêm cho đủ rồi tìm bội chung.',tip:'Đọc kĩ điều kiện "thừa", "thiếu", "chưa vừa", "vừa đủ"; đếm tháng vượt quá 12 thì sang năm sau.'}
};
const TKEYS=['ch','nt','ub','tt'];
const TDESC={ch:'Tính chất chia hết, dấu hiệu chia hết cho 2, 3, 5, 9',nt:'Số nguyên tố, hợp số, tính rồi phân tích ra thừa số nguyên tố',ub:'ƯCLN, BCNN, ước chung, phân số tối giản',tt:'Thay dầu xoay lốp, suất ăn tình nguyện, bài toán cổ đàn vịt, xếp hàng'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhận ra tính chất chia hết, số nguyên tố, hai số nguyên tố cùng nhau.',TH:'Áp dụng dấu hiệu chia hết, phân tích ra thừa số nguyên tố, tìm ƯCLN, BCNN.',VD:'Kết hợp nhiều bài trong chương: tìm số mũ, đếm ước chung, bài toán cổ, bài toán nhiều điều kiện.'};

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
const HP=[
  [IT('Nếu p là số nguyên tố lớn hơn 3 thì p<sup>2</sup> − 1 chia hết cho 3.',true,'nt','VD','p không chia hết cho 3 nên p chia 3 dư 1 hoặc 2; khi đó p<sup>2</sup> chia 3 dư 1.'),IT('Nếu p là số nguyên tố lớn hơn 3 thì p + 1 chia hết cho 3.',false,'nt','VD','p = 7 thì p + 1 = 8 không chia hết cho 3.')],
  [IT('Tổng của hai số nguyên tố lớn hơn 2 là một hợp số.',true,'nt','VD','Hai số nguyên tố lớn hơn 2 đều lẻ nên tổng là số chẵn lớn hơn 2.'),IT('Hiệu của hai số nguyên tố lớn hơn 2 luôn là số nguyên tố.',false,'nt','VD','7 − 3 = 4 là hợp số.')],
  [IT('Nếu a ⋮ 4 và a ⋮ 9 thì a ⋮ 36.',true,'ch','VD','4 và 9 nguyên tố cùng nhau, BCNN(4, 9) = 36.'),IT('Nếu a ⋮ 4 và a ⋮ 6 thì a ⋮ 24.',false,'ch','VD','12 chia hết cho 4 và 6 nhưng không chia hết cho 24; BCNN(4, 6) = 12.')],
  [IT('Số có đúng ba ước là bình phương của một số nguyên tố.',true,'nt','VD','n có đúng ba ước thì n = p<sup>2</sup> với p nguyên tố.'),IT('Số có đúng bốn ước là lập phương của một số nguyên tố.',false,'nt','VD','6 có bốn ước 1, 2, 3, 6 nhưng không là lập phương.')],
  [IT('ƯC(a, b) chính là tập hợp các ước của ƯCLN(a, b).',true,'ub','VD','Như nhận xét trong SGK Bài 11.'),IT('BC(a, b) chính là tập hợp các ước của BCNN(a, b).',false,'ub','VD','BC(a, b) là tập hợp các bội của BCNN(a, b).')]];
function tfHard(){for(;;){const its=wrap(shuffle(HP).slice(0,4).map(p=>sel(p)));if(tfOK(its))return {stem:'Xét các khẳng định sau (a, b là các số tự nhiên khác 0, p là số nguyên tố):',items:its};}}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'nt',level:'VD',gen:tfHard}],sa:[
 {id:'h_dk',topic:'tt',level:'VD',unit:'con',mix:[8,9],gen:()=>{for(;;){const D=duckSet(sel([300,400]));if(!D||D.C.length<5)continue;return{stem:`Một đàn vịt có chưa đến ${D.N} con. Biết ${D.C.map(c=>c.txt).join('; ')}. Tính số vịt.`,ans:[D.x],exp:`Thử các bội của ${D.C.filter(c=>c.t==='du').map(c=>c.m).join(', ')} nhỏ hơn ${D.N}: chỉ có ${D.x} thoả mãn mọi điều kiện.`};}}},
 {id:'h_exp3',topic:'ub',level:'VD',unit:'',mix:[10],gen:()=>{for(;;){const ps=[2,3,5],k=[ri(1,4),ri(1,4),ri(1,4)],a=[ri(1,5),ri(1,5),ri(1,5)],own=[0,1,0];if(a.some((x,i)=>x===k[i]))continue;
   const E=e=>e===1?'':`<sup>${e}</sup>`;const A=ps.map((p,i)=>own[i]?`${p}${E(k[i])}`:`${p}<sup>${'abc'[i]}</sup>`).join(' · '),B=ps.map((p,i)=>own[i]?`${p}<sup>${'abc'[i]}</sup>`:`${p}${E(k[i])}`).join(' · ');
   const G=ps.map((p,i)=>`${p}<sup>${Math.min(a[i],k[i])}</sup>`).join(' · ').replace(/<sup>1<\/sup>/g,''),Lm=ps.map((p,i)=>`${p}<sup>${Math.max(a[i],k[i])}</sup>`).join(' · ').replace(/<sup>1<\/sup>/g,'');
   return{stem:`Biết hai số ${A} và ${B} có ƯCLN là ${G} và BCNN là ${Lm}. Tính a + b + c.`,ans:[a[0]+a[1]+a[2]],exp:`So sánh số mũ từng thừa số với số mũ đã biết: a = ${a[0]}, b = ${a[1]}, c = ${a[2]}; tổng ${a[0]+a[1]+a[2]}.`};}}},
 {id:'h_ucc',topic:'ub',level:'VD',unit:'ước',mix:[10,11],gen:()=>{for(;;){const [a,b,g]=pairG([12,18,24,30,36,60,72],400);const d=divs(g),c=d.filter(x=>x>1&&!isP(x)).length;if(c<2)continue;return{stem:`Hai số ${a} và ${b} có bao nhiêu ước chung là hợp số?`,ans:[c],exp:`${UCLN(a,b)} = ${g}; ƯC = Ư(${g}) = ${SET(d)}; các hợp số: ${d.filter(x=>x>1&&!isP(x)).join('; ')}.`};}}},
 {id:'h_mon',topic:'tt',level:'VD',unit:'',mix:[8,12],gen:()=>{for(;;){const a=sel([2,3,4]),b=sel([3,5,6,8]),M=ri(1,12),l=lcm(a,b),k=ri(2,4);if(a===b||l>15)continue;return{stem:`Một cửa hàng cứ ${a} tháng nhập hàng một lần, ${b} tháng kiểm kê một lần. Hai việc cùng làm vào tháng ${M} năm nay (tính là lần thứ nhất). Lần thứ ${k+1} cửa hàng cùng làm hai việc là vào tháng mấy?`,ans:[addM(M,k*l)],exp:`Hai việc cùng làm sau mỗi ${BCNN(a,b)} = ${l} tháng; lần thứ ${k+1} cách lần thứ nhất ${k} · ${l} = ${k*l} tháng → tháng ${addM(M,k*l)}.`};}}},
 {id:'h_dig',topic:'ch',level:'VD',unit:'',mix:[9,12],gen:()=>{const [S,ms]=sel([[18,[2,5,9]],[27,[2,5,9]],[18,[4,9]],[27,[2,3,5]],[18,[5,9]]]);const l=lA(ms);let x=l;while(dsum(x)!==S)x+=l;return{stem:`Tìm số tự nhiên nhỏ nhất chia hết cho cả ${ms.join(', ')} và có tổng các chữ số bằng ${S}.`,ans:[x],exp:`Số cần tìm là bội của ${BCNN(...ms)} = ${l}; thử lần lượt các bội của ${l}: số nhỏ nhất có tổng các chữ số bằng ${S} là ${F(x)}.`};}},
 {id:'h_pt',topic:'nt',level:'VD',unit:'',mix:[10,11],gen:()=>{for(;;){const {s,V}=calcExpr(),m=sel([12,18,20,24,30,36,40,45]);const g=gcd(V,m);if(g<2)continue;return{stem:`Thực hiện phép tính A = ${s}. Tính ${UCLN('A',m)}.`,ans:[g],exp:`A = ${F(V)} = ${FS(fac(V))}; ${m} = ${FS(fac(m))}; ƯCLN = ${g}.`};}}}
].map(q=>Object.assign({type:'sa'},q))};

const qsOK=u=>u.qs.every(q=>q.type!=='mc'||(q.opts.length===4&&new Set(q.opts.map(o=>o.t)).size===4));
const mx=(q,m)=>Object.assign(q,{mix:m});
const PISA=[
 ()=>{for(;;){const a=sel([2,3,4]),b=sel([3,4,6,8].filter(x=>x!==a)),c=sel([6,9,12].filter(x=>x!==a&&x!==b)),M=ri(1,12),l2=lcm(a,b),l3=lA([a,b,c]);if(l3>36||l2===l3)continue;const T=sel([24,36]);
   const W=uniq(['Tháng '+addM(M,l3+1),'Tháng '+addM(M,l2),'Tháng '+addM(M,a*b*c),'Tháng '+addM(M,l3-1),'Tháng '+addM(M,c)]).filter(x=>x!=='Tháng '+addM(M,l3)).slice(0,3);
   const u={title:'Bảo dưỡng xe ô tô',ctx:`<p class="stem">Bác Nam ghi lịch bảo dưỡng xe ô tô như bảng dưới. Tháng ${M} năm nay bác làm cả ba việc cùng lúc.</p>${tbl(['Công việc','Làm định kì'],[['Thay dầu',`${a} tháng một lần`],['Xoay lốp',`${b} tháng một lần`],['Kiểm tra phanh',`${c} tháng một lần`]])}`,qs:[
    saq('Sau ít nhất bao nhiêu tháng bác lại thay dầu và xoay lốp cùng lúc?',l2,'tháng',`${BCNN(a,b)} = ${l2}.`,'tt','TH'),
    saq('Sau ít nhất bao nhiêu tháng bác lại làm cả ba việc cùng lúc?',l3,'tháng',`${BCNN(a,b,c)} = ${l3}.`,'tt','VD'),
    mx(mcq('Lần gần nhất tiếp theo bác làm cả ba việc cùng lúc là vào tháng nào (có thể của năm sau)?','Tháng '+addM(M,l3),W.map(w=>[w,`Tháng ${M} cộng ${l3} tháng; quá 12 tháng thì sang năm sau.`]),`Tháng ${M} + ${l3} tháng → tháng ${addM(M,l3)}${M+l3>12?' (năm sau)':''}.`,'tt','VD'),[8]),
    saq(`Trong ${T} tháng tiếp theo (không kể tháng ${M} năm nay), bác thay dầu bao nhiêu lần?`,T/a,'lần',`${T} : ${a} = ${T/a}.`,'tt','TH')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const D=duckSet(200);if(!D)continue;const {x,C,N}=D,ti=C.find(c=>c.t==='ti');if(!ti)continue;const k=sel([2,3,4,5,6,7,8,9,10,11].filter(z=>!C.some(c=>c.m===z)));const r=x%ti.m;
   const u={title:'Bài toán cổ: đàn vịt',ctx:`<p class="stem">Bác kia chăn một đàn vịt có chưa đến ${N} con. Bác thử xếp đàn vịt thành các hàng và ghi lại kết quả.</p>${tbl(['Cách xếp','Kết quả'],C.map(c=>[`Hàng ${c.m}`,c.txt.replace(`xếp hàng ${c.m} thì `,'')]))}`,qs:[
    mx(mcq(`Kết quả "hàng ${ti.m}: ${ti.txt.replace(`xếp hàng ${ti.m} thì `,'')}" cho biết số vịt chia cho ${ti.m} dư bao nhiêu?`,''+r,uniq([''+(ti.m-r),'0',''+((r+1)%ti.m),''+((r+2)%ti.m)]).filter(w=>w!==''+r).slice(0,3).map(w=>[w,`Thiếu ${ti.m-r} con thì đủ hàng, nên số vịt chia cho ${ti.m} dư ${ti.m} − ${ti.m-r} = ${r}.`]),`Thêm ${ti.m-r} con thì vừa đủ hàng ${ti.m}, nên số vịt chia cho ${ti.m} dư ${r}.`,'ch','TH'),[8]),
    saq('Đàn vịt có bao nhiêu con?',x,'con',`Thử các số nhỏ hơn ${N} thoả mãn mọi kết quả trong bảng: chỉ có ${x}.`,'tt','VD'),
    mx(mcq(`Nếu xếp đàn vịt thành hàng ${k} thì:`,x%k?`Thừa ${x%k} con`:'Vừa đủ',uniq([x%k?'Vừa đủ':'Thừa 1 con',`Thừa ${(x%k+1)%k||k-1} con`,`Thiếu ${x%k||1} con`,`Thừa ${(x%k+2)%k||2} con`]).filter(w=>w!==(x%k?`Thừa ${x%k} con`:'Vừa đủ')&&!(x%k&&w===`Thiếu ${k-x%k} con`)).slice(0,3).map(w=>[w,`${x} = ${k} · ${fl(x/k)} + ${x%k}.`]),`${x} = ${k} · ${fl(x/k)} + ${x%k}.`,'tt','VD'),[8]),
    mcq('Số vịt có bao nhiêu ước?',''+nDiv(x),uniq([''+(nDiv(x)+1),''+(nDiv(x)-1),''+fac(x).length,''+(nDiv(x)+2)]).filter(w=>w!==''+nDiv(x)).slice(0,3).map(w=>[w,`${x} = ${FSn(x)}; liệt kê lại các ước.`]),`Ư(${x}) = ${SET(divs(x))}.`,'nt','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const g=sel([12,18,20,24,30,36,42]),x=ri(3,9),y=ri(3,9);if(gcd(x,y)!==1||x===y)continue;const a=g*x,b=g*y,d=divs(g),fp=fac(g).map(z=>z[0]),P=fp[fp.length-1];
   const u={title:'Hội khoẻ Phù Đổng',ctx:`<p class="stem">Trường chọn ${a} học sinh nam và ${b} học sinh nữ tham gia đồng diễn. Thầy tổng phụ trách chia đều số nam và số nữ vào các đội (số đội lớn hơn 1; số nam các đội như nhau, số nữ các đội như nhau).</p>`,qs:[
    saq(`Tìm ${UCLN(a,b)}.`,g,'',`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ƯCLN = ${g}.`,'ub','TH'),
    saq('Có bao nhiêu cách chọn số đội?',d.length-1,'cách',`Số đội là ước chung khác 1 của ${a} và ${b}, tức là ước khác 1 của ${g}: ${d.filter(v=>v>1).join('; ')}.`,'ub','VD'),
    mx(saq('Có bao nhiêu cách chọn mà số đội là một số nguyên tố?',fp.length,'cách',`${g} = ${FS(fac(g))}; các ước nguyên tố: ${fp.join('; ')}.`,'nt','VD'),[10]),
    mx(mcq('Nếu số đội là số nguyên tố lớn nhất có thể thì mỗi đội có bao nhiêu học sinh?',''+(a+b)/P,uniq([''+(x+y),''+(a+b)/fp[0],''+a/P,''+((a+b)/P+1)]).filter(w=>w!==''+(a+b)/P).slice(0,3).map(w=>[w,`Số đội là ${P} (ước nguyên tố lớn nhất của ${g}); mỗi đội có ${a} : ${P} + ${b} : ${P} học sinh.`]),`Ước nguyên tố lớn nhất của ${g} là ${P}; mỗi đội có ${a/P} nam và ${b/P} nữ, tất cả ${(a+b)/P} học sinh.`,'tt','VD'),[10])]};if(qsOK(u))return u;}},
 ()=>{for(;;){const g=ri(4,12),xs=shuffle([2,3,4,5,6,7]).slice(0,3);if(gA(xs)!==1)continue;const v=xs.map(z=>z*g);const a=sel([2,3,4,6]),b=sel([3,4,5,8,9,10].filter(z=>z!==a&&z%a&&a%z)),l=lcm(a,b),s0=ri(0,6);
   const u={title:'Đội tình nguyện',ctx:`<p class="stem">Đội tình nguyện chuẩn bị đồ ăn cho một chuyến thiện nguyện và chia thành hai nhóm đi phát quà.</p>${tbl(['Đồ ăn','Bánh mì (ổ)','Sữa (hộp)','Chuối (quả)'],[['Số lượng',v[0],v[1],v[2]]])}<p class="stem">Nhóm A cứ ${a} ngày đi phát quà một lần, nhóm B cứ ${b} ngày một lần. Hôm nay (${DAYS[s0]}) cả hai nhóm cùng đi.</p>`,qs:[
    saq('Chia đều mỗi loại đồ ăn vào các suất (suất nào cũng có đủ ba loại). Chia được nhiều nhất bao nhiêu suất?',g,'suất',`${UCLN(...v)} = ${g}.`,'ub','TH'),
    mcq('Khi chia nhiều suất nhất, mỗi suất có bao nhiêu hộp sữa?',''+xs[1],uniq([''+xs[0],''+xs[2],''+g,''+(xs[1]+1)]).filter(w=>w!==''+xs[1]).slice(0,3).map(w=>[w,`Mỗi suất có ${v[1]} : ${g} = ${xs[1]} hộp sữa.`]),`${v[1]} : ${g} = ${xs[1]}.`,'tt','TH'),
    saq('Sau ít nhất bao nhiêu ngày hai nhóm lại cùng đi phát quà?',l,'ngày',`${BCNN(a,b)} = ${l}.`,'tt','TH'),
    mx(mcq('Lần tiếp theo hai nhóm cùng đi phát quà là vào ngày nào trong tuần?',DAYS[(s0+l)%7],uniq([DAYS[(s0+l+1)%7],DAYS[(s0+a*b)%7],DAYS[(s0+l+6)%7],DAYS[(s0+a+b)%7]]).filter(w=>w!==DAYS[(s0+l)%7]).slice(0,3).map(w=>[w,`Sau ${l} ngày; ${l} = 7 · ${fl(l/7)} + ${l%7}, nên tính tiếp ${l%7} ngày kể từ ${DAYS[s0]}.`]),`Sau ${l} ngày; ${l} = 7 · ${fl(l/7)} + ${l%7} nên là ngày cách ${DAYS[s0]} ${l%7} ngày: ${DAYS[(s0+l)%7]}.`,'tt','VD'),[8])]};if(qsOK(u))return u;}}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'ch',fig:'<div class="figbox"><p>a ⋮ m và b ⋮ m ⇒ (a + b) ⋮ m</p><p>Chia hết cho 2, 5: chữ số tận cùng; cho 3, 9: tổng các chữ số</p></div>',extra:'Chia hết cho cả 2, 5 và 9: tận cùng 0 và tổng các chữ số chia hết cho 9.'},
  {k:'nt',fig:'<div class="figbox"><p>14<sup>2</sup> + 5<sup>2</sup> + 2<sup>2</sup> = 196 + 25 + 4 = 225 = 3<sup>2</sup> · 5<sup>2</sup></p></div>',extra:'Tính giá trị trước, rồi mới phân tích ra thừa số nguyên tố.'},
  {k:'ub',fig:'<div class="figbox"><p>36 = 2<sup>2</sup> · 3<sup>2</sup>; 54 = 2 · 3<sup>3</sup></p><p>ƯCLN(36, 54) = 2 · 3<sup>2</sup> = 18; BCNN(36, 54) = 2<sup>2</sup> · 3<sup>3</sup> = 108</p></div>',extra:'ƯC(a, b) là các ước của ƯCLN(a, b); hai số nguyên tố khác nhau có ƯCLN = 1.'},
  {k:'tt',fig:'<div class="figbox"><p>Thay dầu 3 tháng, xoay lốp 6 tháng, cùng làm tháng 4</p><p>BCNN(3, 6) = 6 tháng → tháng 10</p></div>',extra:'Thừa r: bớt r rồi tìm bội chung; thiếu r: thêm r rồi tìm bội chung.'}
];

/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='cc2_seen';
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
  const mcSlots=[['ch',['NB']],['ch',['TH']],['nt',['NB','TH']],['ub',['NB','TH']],['tt',['TH']],[null,['VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['ch','ub','tt'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=[['ch','NB'],['nt','NB'],['ub','NB'],['tt','TH']].map(([t,l])=>pick(MC.filter(q=>q.topic===t&&q.level===l),used));
  const sa=[pick(SA.filter(q=>q.topic==='ch'&&q.level==='NB'),used),pick(SA.filter(q=>q.topic==='ub'&&q.level==='NB'),used)];
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
