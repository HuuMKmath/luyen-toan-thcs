// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ luyen-tap-chung-sau-bai-12/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "luyen-tap-chung-sau-bai-12";
export const TIEN_TO = "LC3-";

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

/* ============ Câu nhiều lựa chọn ============ */
// hai: ƯCLN và BCNN
const RULES=[
  ['Khi tìm ƯCLN và BCNN bằng cách phân tích ra thừa số nguyên tố, cách chọn nào sau đây đúng?','ƯCLN: các thừa số chung, số mũ nhỏ nhất; BCNN: các thừa số chung và riêng, số mũ lớn nhất',[['ƯCLN: các thừa số chung, số mũ lớn nhất; BCNN: các thừa số chung và riêng, số mũ nhỏ nhất','Đã đổi chỗ số mũ: ƯCLN lấy nhỏ nhất, BCNN lấy lớn nhất.'],['ƯCLN: các thừa số chung và riêng, số mũ nhỏ nhất; BCNN: các thừa số chung, số mũ lớn nhất','ƯCLN chỉ lấy thừa số chung; BCNN lấy cả chung và riêng.'],['Cả ƯCLN và BCNN: các thừa số chung, số mũ lớn nhất','BCNN còn lấy thừa số riêng; ƯCLN lấy số mũ nhỏ nhất.']],'ƯCLN: thừa số nguyên tố chung, số mũ nhỏ nhất. BCNN: thừa số nguyên tố chung và riêng, số mũ lớn nhất.'],
  ['Với a, b là hai số tự nhiên khác 0, khẳng định nào sau đây luôn đúng?','ƯCLN(a, b) · BCNN(a, b) = a · b',[['ƯCLN(a, b) + BCNN(a, b) = a + b','Với a = 4, b = 6: 2 + 12 = 14 ≠ 10.'],['BCNN(a, b) = a · b','BCNN(4, 6) = 12 ≠ 24; chỉ đúng khi a, b nguyên tố cùng nhau.'],['ƯCLN(a, b) = BCNN(a, b) : a','Với a = 4, b = 6: 12 : 4 = 3 ≠ 2.']],'Kết luận của bài 2.45 (SGK): ƯCLN(a, b) · BCNN(a, b) = a · b.'],
  ['Với a, b là hai số tự nhiên khác 0, so sánh nào sau đây luôn đúng?','ƯCLN(a, b) ≤ a ≤ BCNN(a, b)',[['BCNN(a, b) ≤ a ≤ ƯCLN(a, b)','ƯCLN là ước của a nên không lớn hơn a; BCNN là bội của a nên không nhỏ hơn a.'],['ƯCLN(a, b) < a < BCNN(a, b)','Có thể xảy ra dấu bằng: ƯCLN(6, 12) = 6, BCNN(12, 6) = 12.'],['a ≤ ƯCLN(a, b) ≤ BCNN(a, b)','ƯCLN(4, 6) = 2 < 4.']],'ƯCLN(a, b) là ước của a nên ƯCLN(a, b) ≤ a; BCNN(a, b) là bội khác 0 của a nên a ≤ BCNN(a, b).'],
  ['Biết ƯCLN(a, b) = 6. Số nào sau đây có thể là BCNN(a, b)?','72',[['3','BCNN(a, b) là bội của ƯCLN(a, b) nên không thể nhỏ hơn 6.'],['20','20 không chia hết cho 6, mà BCNN(a, b) chia hết cho a, a chia hết cho 6.'],['9','9 không chia hết cho 6.']],'BCNN(a, b) chia hết cho a, mà a chia hết cho ƯCLN(a, b) = 6, nên BCNN là bội của 6. Ví dụ a = 6, b = 72 hoặc a = 18, b = 24.']];
function mRule(){const [s,r,W,e]=sel(RULES);return mkMC(s,r,W,e);}
const pairTxt=(g,l)=>`${F(g)} và ${F(l)}`;
function mPairSp(){return tryL(()=>{let a,b;if(RNG()<.5){b=ri(4,25);a=b*ri(2,8);}else{for(;;){a=ri(3,20);b=ri(3,20);if(a!==b&&gcd(a,b)===1)break;}}const g=gcd(a,b),l=lcm(a,b);
  return opt4(`${UCLN(a,b)} và ${BCNN(a,b)} lần lượt là:`,pairTxt(g,l),[[pairTxt(l,g),'Đã đổi chỗ: ƯCLN nhỏ, BCNN lớn.'],g>1?[pairTxt(1,a*b),'Hai số không nguyên tố cùng nhau.']:[pairTxt(1,a+b),'BCNN của hai số nguyên tố cùng nhau là tích, không phải tổng.'],g>1?[pairTxt(g,a*b),`${a} ⋮ ${b} nên BCNN là ${a}, không phải tích.`]:[pairTxt(Math.min(a,b),a*b),'Hai số nguyên tố cùng nhau có ƯCLN bằng 1.'],[pairTxt(g,2*l),`${2*l} là bội chung nhưng chưa nhỏ nhất.`]],g>1?`${dv(a,b)} nên ${UCLN(a,b)} = ${b}, ${BCNN(a,b)} = ${a}.`:`${UCLN(a,b)} = 1 (nguyên tố cùng nhau) nên ${BCNN(a,b)} = ${a} · ${b} = ${l}.`);});}
function mPairGen(){return tryL(()=>{const [a,b,g]=pairG([4,6,8,9,10,12,14,15],120);const l=lcm(a,b);if(a%b===0||b%a===0)return null;
  return opt4(`${UCLN(a,b)} và ${BCNN(a,b)} lần lượt là:`,pairTxt(g,l),[[pairTxt(l,g),'Đã đổi chỗ ƯCLN và BCNN.'],[pairTxt(g,a*b),'BCNN chỉ bằng tích khi hai số nguyên tố cùng nhau.'],[pairTxt(1,l),`${a} và ${b} có ước chung ${g}.`],[pairTxt(divs(g).slice(-2)[0],l),'Đó là một ước chung nhưng chưa lớn nhất.']],`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}. ƯCLN = ${FS(fmin(a,b))} = ${g}; BCNN = ${FS(fmax(a,b))} = ${l}.`);});}
function mThree(){return tryL(()=>{const g=sel([2,3,4,6]),xs=shuffle([2,3,4,5,6,7,9]).slice(0,3);if(gA(xs)!==1)return null;const [a,b,c]=xs.map(x=>g*x),l=lA([a,b,c]);if(l>1500)return null;
  return opt4(`ƯCLN và BCNN của ba số ${a}, ${b}, ${c} lần lượt là:`,pairTxt(g,l),[[pairTxt(l,g),'Đã đổi chỗ ƯCLN và BCNN.'],[pairTxt(gcd(a,b),l),gcd(a,b)!==g?`${gcd(a,b)} không là ước của ${c}.`:''],[pairTxt(g,lcm(a,b)),lcm(a,b)!==l?`${lcm(a,b)} chưa chia hết cho ${c}.`:''],[pairTxt(g,a*b*c/g),'Không lấy tích rồi chia cho ƯCLN với ba số.'],[pairTxt(1,l),`Ba số cùng chia hết cho ${g}.`]].filter(w=>w[1]),`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ${c} = ${FS(fac(c))}. ƯCLN = ${g}; BCNN = ${FS(fac(l))} = ${F(l)}.`);});}
function mProd(){return tryL(()=>{const [a,b,g]=pairG([3,4,5,6,8,9,12],90),P=a*b,l=P/g;
  return opt4(`Hai số tự nhiên a, b có ${UCLN('a','b')} = ${g} và a · b = ${F(P)}. ${BCNN('a','b')} bằng:`,F(l),[[F(P),'Phải chia tích cho ƯCLN.'],[F(P*g),'Phải chia, không nhân với ƯCLN.'],[F(P/(g*g)),'Chỉ chia tích cho ƯCLN một lần.'],[F(l+g),'BCNN = a · b : ƯCLN.']],`ƯCLN(a, b) · BCNN(a, b) = a · b nên BCNN(a, b) = ${F(P)} : ${g} = ${F(l)}.`);});}
function mRatio(){return tryL(()=>{const [a,b,g]=pairG([4,6,8,9,12,18,20],400);if(a>2000||b>2000)return null;const l=lcm(a,b),r=l/g;
  return opt4(`Cho a = ${FS(fac(a))} và b = ${FS(fac(b))}. Thương ${BCNN('a','b')} : ${UCLN('a','b')} bằng:`,F(r),[[F(l),'Đây là BCNN, chưa chia cho ƯCLN.'],[F(a/g+b/g),'Thương bằng (a : ƯCLN) · (b : ƯCLN), không phải tổng.'],[F(g),'Đây là ƯCLN.'],[F(r*g*g),'Phải chia BCNN cho ƯCLN.']],`${UCLN('a','b')} = ${FS(fmin(a,b))} = ${g}; ${BCNN('a','b')} = ${FS(fmax(a,b))} = ${F(l)}; thương ${F(l)} : ${g} = ${F(r)}.`);});}
function mOther(){return tryL(()=>{const g=sel([2,3,4,6,10,12,20]),ps=shuffle([2,3,5,7]);let x=sel([1,ps[0],ps[0]*ps[0]]),y=sel([ps[1],ps[1]*ps[1],ps[1]*ps[2]]);if(RNG()<.5)[x,y]=[y,x];if(x===y||gcd(x,y)!==1)return null;const a=g*x,b=g*y,l=lcm(a,b);
  return opt4(`Hai số có BCNN là ${FSn(l)} và ƯCLN là ${FSn(g)}. Biết một trong hai số bằng ${FSn(a)}. Số còn lại là:`,FSn(b),[[FSn(y),'Đã lấy BCNN chia cho số đã biết; phải lấy (ƯCLN · BCNN) chia cho số đã biết.'],[FSn(l),'Số còn lại là ƯCLN · BCNN : số đã biết.'],[FSn(g*l),'Còn phải chia cho số đã biết.'],[FSn(b*ps[3]),'Số này làm BCNN có thêm thừa số nguyên tố.']],`Số còn lại = ƯCLN · BCNN : ${FSn(a)} = ${F(g*l)} : ${F(a)} = ${F(b)} = ${FSn(b)}.`);});}
// ps: rút gọn, quy đồng mẫu
const QD_RULES=[
  ['Khi quy đồng mẫu nhiều phân số, ta thường chọn mẫu chung là:','BCNN của các mẫu',[['ƯCLN của các mẫu','ƯCLN thường không chia hết cho từng mẫu.'],['Tổng các mẫu','Tổng các mẫu thường không chia hết cho từng mẫu.'],['Mẫu lớn nhất trong các mẫu','Mẫu lớn nhất chưa chắc chia hết cho các mẫu còn lại.']],'Mẫu chung là một bội chung của các mẫu, thường chọn BCNN.'],
  ['Khi quy đồng mẫu, thừa số phụ của mỗi mẫu được tìm bằng cách:','Chia mẫu chung cho mẫu đó',[['Nhân mẫu chung với mẫu đó','Thừa số phụ nhân với mẫu phải ra mẫu chung.'],['Lấy mẫu chung trừ đi mẫu đó','Phải chia, không trừ.'],['Chia mẫu đó cho mẫu chung','Đã chia ngược.']],'Thừa số phụ = mẫu chung : mẫu.'],
  ['Muốn rút gọn một phân số về phân số tối giản, ta chia cả tử và mẫu cho:','ƯCLN của tử và mẫu',[['BCNN của tử và mẫu','BCNN không là ước của tử và mẫu.'],['Một ước chung bất kì khác 1','Chia cho ước chung khác ƯCLN có thể chưa tối giản.'],['Số nguyên tố nhỏ nhất','Chưa chắc là ước chung, chưa chắc tối giản.']],'Chia tử và mẫu cho ƯCLN thì được phân số tối giản.']];
function mQdRule(){const [s,r,W,e]=sel(QD_RULES);return mkMC(s,r,W,e);}
function denPair(easy){for(;;){let b,d;if(easy){b=sel([2,3,4,5,6]);d=b*ri(2,5);}else{b=sel([4,6,8,9,10,12,14,15,18]);d=sel([6,8,9,10,12,14,15,16,18,20,21,24]);if(b===d||d%b===0||b%d===0||gcd(b,d)===1)continue;}if(RNG()<.5)[b,d]=[d,b];return [numFor(b),b,numFor(d),d];}}
function mMsc(easy){return ()=>tryL(()=>{const [p,b,q,d]=denPair(easy),l=lcm(b,d);
  return opt4(`Mẫu chung nhỏ nhất của hai phân số ${FR(p,b)} và ${FR(q,d)} là:`,''+l,[[''+b*d,`${b} · ${d} là một mẫu chung nhưng chưa nhỏ nhất.`],[''+gcd(b,d),`${gcd(b,d)} không chia hết cho ${Math.max(b,d)}.`],[''+(b+d),`${b+d} không chia hết cho ${b}.`],[''+2*l,`${2*l} là mẫu chung nhưng chưa nhỏ nhất.`]],`Mẫu chung nhỏ nhất là ${BCNN(b,d)} = ${l}.`);});}
function mFactor(){return tryL(()=>{const [p,b,q,d]=denPair(false),l=lcm(b,d);
  return opt4(`Quy đồng mẫu hai phân số ${FR(p,b)} và ${FR(q,d)} với mẫu chung ${l}. Thừa số phụ của mẫu ${b} là:`,''+l/b,[[''+l/d,`Đây là thừa số phụ của mẫu ${d}.`],[''+l*b,'Phải chia mẫu chung cho mẫu.'],[''+(l-b),'Phải chia, không trừ.'],[''+d,`Nhân ${b} với ${d} được ${b*d}, không phải ${l}.`]],`${l} : ${b} = ${l/b}.`);});}
function mQd(){return tryL(()=>{const [p,b,q,d]=denPair(false),l=lcm(b,d),x=l/b,y=l/d;
  return opt4(`Quy đồng mẫu hai phân số ${FR(p,b)} và ${FR(q,d)} với mẫu chung là BCNN của các mẫu, ta được:`,`${FR(p*x,l)} và ${FR(q*y,l)}`,[[`${FR(p,l)} và ${FR(q,l)}`,'Phải nhân cả tử với thừa số phụ.'],[`${FR(p*d,b*d)} và ${FR(q*b,b*d)}`,`Mẫu chung ${b*d} chưa phải BCNN của ${b} và ${d}.`],[`${FR(p*y,l)} và ${FR(q*x,l)}`,'Đã nhân nhầm thừa số phụ của mẫu kia.']],`${BCNN(b,d)} = ${l}; thừa số phụ: ${l} : ${b} = ${x}, ${l} : ${d} = ${y}. ${FR(p,b)} = ${FR(p*x,l)}; ${FR(q,d)} = ${FR(q*y,l)}.`);});}
function mAdd(){return tryL(()=>{const [p,b,q,d]=denPair(false),l=lcm(b,d),plus=RNG()<.6;const n=plus?p*l/b+q*l/d:p*l/b-q*l/d;if(n<=0)return null;const g=gcd(n,l),R=FR(n/g,l/g);
  const val=(x,y)=>x*l===n*y;const W=[[FR(plus?p+q:p-q,b+d),'Không cộng (trừ) các mẫu với nhau.'],[FR(plus?p+q:p-q,l),'Phải nhân tử với thừa số phụ trước.'],[FR(plus?p*l/b+q:p*l/b-q,l),`Quên nhân tử ${q} với thừa số phụ ${l/d}.`],[FR(plus?p*d+q*b:p*d-q*b,b*d+1),'Mẫu chung phải là bội chung của hai mẫu.']].filter(w=>{const m=w[0].match(/<span>(-?\d+)<\/span><span>(\d+)<\/span>/);return m&&+m[1]>0&&!val(+m[1],+m[2]);});
  return opt4(`Kết quả của phép tính ${FR(p,b)} ${plus?'+':'−'} ${FR(q,d)} (viết dưới dạng phân số tối giản) là:`,R,W,`Mẫu chung ${BCNN(b,d)} = ${l}: ${FR(p*l/b,l)} ${plus?'+':'−'} ${FR(q*l/d,l)} = ${FR(n,l)}${g>1?` = ${R}`:''}.`);});}
function mRedMsc(){return tryL(()=>{const mk=()=>{const k=ri(2,6),d=sel([4,6,8,9,10,12,14,15]);return [numFor(d)*k,d*k,d];};const [A,B,d1]=mk(),[C,D,d2]=mk();if(d1===d2||gcd(A,B)!==B/d1||gcd(C,D)!==D/d2)return null;const l=lcm(d1,d2);if(lcm(B,D)===l)return null;
  return opt4(`Rút gọn hai phân số ${FR(A,B)} và ${FR(C,D)} về phân số tối giản rồi quy đồng mẫu. Mẫu chung nhỏ nhất là:`,''+l,[[''+lcm(B,D),'Phải rút gọn trước rồi mới tìm BCNN của các mẫu mới.'],[''+d1*d2,`${d1} · ${d2} chưa chắc là mẫu chung nhỏ nhất.`],[''+gcd(d1,d2),'Mẫu chung là BCNN, không phải ƯCLN.'],[''+B*D,'Phải rút gọn và lấy BCNN.']],`${FR(A,B)} = ${FR(A*d1/B,d1)}; ${FR(C,D)} = ${FR(C*d2/D,d2)}; ${BCNN(d1,d2)} = ${l}.`);});}
// tim: tìm số theo điều kiện chia hết
function mWhich(){return tryL(()=>{const [a,b]=pairG([2,3,4,5,6],60);const up=RNG()<.5;
  return opt4(up?`Tìm số tự nhiên x lớn nhất sao cho ${a} ⋮ x và ${b} ⋮ x. Số x cần tìm là:`:`Tìm số tự nhiên x nhỏ nhất khác 0 sao cho x ⋮ ${a} và x ⋮ ${b}. Số x cần tìm là:`,up?UCLN(a,b):BCNN(a,b),[[up?BCNN(a,b):UCLN(a,b),up?`x là ước của ${a} và ${b} nên là ước chung.`:`x chia hết cho ${a} và ${b} nên là bội chung.`],[`${a} · ${b}`,up?'Tích không là ước của mỗi số.':'Tích là bội chung nhưng chưa chắc nhỏ nhất.'],[up?`Số nhỏ hơn trong hai số ${a} và ${b}`:`Số lớn hơn trong hai số ${a} và ${b}`,up?`${Math.min(a,b)} chưa chắc là ước của ${Math.max(a,b)}.`:`${Math.max(a,b)} chưa chắc chia hết cho ${Math.min(a,b)}.`]],up?`${a} ⋮ x và ${b} ⋮ x nên x ∈ ƯC(${a}, ${b}); x lớn nhất là ${UCLN(a,b)} = ${gcd(a,b)}.`:`x ⋮ ${a} và x ⋮ ${b} nên x ∈ BC(${a}, ${b}); x nhỏ nhất khác 0 là ${BCNN(a,b)} = ${lcm(a,b)}.`);});}
function mXbc(){return tryL(()=>{const [a,b]=pairG([2,3,4,6,5],40),l=lcm(a,b);if(l>150)return null;const k=ri(2,6),x=k*l,lo=x-ri(1,l-1),hi=x+ri(1,l-1);if(lo<=l)return null;
  return opt4(`Tìm số tự nhiên x, biết x ⋮ ${a}, x ⋮ ${b} và ${lo} < x < ${hi}.`,'x = '+x,[['x = '+l,`${l} không nằm giữa ${lo} và ${hi}.`],['x = '+(x+l),`${x+l} > ${hi}.`],['x = '+(x-l),`${x-l} < ${lo}.`],['x = '+((lo+hi)%2?lo+1:(lo+hi)/2),'Số này không là bội chung của hai số.']].filter(w=>{const v=+w[0].slice(4);return !(v%a===0&&v%b===0&&v>lo&&v<hi);}),`x ∈ BC(${a}, ${b}) = B(${l}) = {0; ${l}; ${2*l}; ${3*l}; ...}; ${lo} < x < ${hi} nên x = ${x}.`);});}
function mBig3(){return tryL(()=>{const [a,b]=pairG([2,3,4,5,6],40),l=lcm(a,b);if(l<12||l>99)return null;const x=Math.ceil(100/l)*l;
  return opt4(`Số nhỏ nhất có ba chữ số là bội chung của ${a} và ${b} là:`,''+x,[[''+l,`${l} chưa có ba chữ số.`],[''+(x+l),`${x+l} là bội chung nhưng chưa nhỏ nhất.`],[''+Math.ceil(100/Math.max(a,b))*Math.max(a,b),`Số này chưa chia hết cho ${Math.min(a,b)}.`],[''+(a*b>=100?a*b:100),'Số này không phải bội chung nhỏ nhất có ba chữ số.']].filter(w=>+w[0]!==x),`${BCNN(a,b)} = ${l}; các bội chung: ${l}; ${2*l}; ...; số nhỏ nhất có ba chữ số là ${x}.`);});}
function mChain(){return tryL(()=>{const d=sel([2,3,4,5,6,8]),n=d*sel([6,8,10,12,18,20,24,30]);const S=divs(n).filter(x=>x%d===0);
  return opt4(`Có bao nhiêu số tự nhiên x thoả mãn x ⋮ ${d} và ${n} ⋮ x?`,''+S.length,[[''+divs(n).length,`Còn điều kiện x ⋮ ${d}.`],[''+(n/d),`Đây là số bội của ${d} từ ${d} đến ${n}, nhưng x còn phải là ước của ${n}.`],[''+(S.length-1),'Còn thiếu một số (chú ý cả hai số đầu, cuối).'],[''+(S.length+1),'Số 0 không là ước của số nào.']],`x là ước của ${n} và là bội của ${d}: ${SET(S)}; có ${S.length} số.`);});}
function mPair(){return tryL(()=>{const g=sel([2,3,4,5,6]),k=sel([6,10,12,15,18,20,30]),l=g*k;const ok=[],bad=[];
  for(let x=1;x<=k;x++){if(k%x)continue;const y=k/x;if(x>=y)continue;(gcd(x,y)===1?ok:bad).push([g*x,g*y]);}
  const good=ok.filter(p=>p[0]!==g);const r=sel(good.length?good:ok);const W=bad.map(p=>[`(${p[0]}; ${p[1]})`,`Tích đúng bằng ƯCLN · BCNN nhưng ${UCLN(p[0],p[1])} = ${gcd(p[0],p[1])} ≠ ${g}.`]);
  W.push([`(${g}; ${l*g})`,`${BCNN(g,l*g)} = ${l*g} ≠ ${l}.`],[`(${g*2}; ${l})`,lcm(g*2,l)===l&&gcd(g*2,l)===g?'':`${UCLN(2*g,l)} = ${gcd(2*g,l)}, ${BCNN(2*g,l)} = ${lcm(2*g,l)}.`],[`(${l}; ${l*2})`,`${UCLN(l,2*l)} = ${l} ≠ ${g}.`]);
  return opt4(`Hai số tự nhiên a, b (a < b) có ${UCLN('a','b')} = ${g} và ${BCNN('a','b')} = ${l}. Cặp (a; b) nào sau đây thoả mãn?`,`(${r[0]}; ${r[1]})`,shuffle(W.filter(w=>w[1])),`${UCLN(r[0],r[1])} = ${g} và ${BCNN(r[0],r[1])} = ${l}.`);});}
const DIGP=[[2,9],[5,9],[2,3],[3,5],[2,5],[5,3]];
function mDigit(){return tryL(()=>{const [m1,m2]=sel(DIGP),pos=ri(0,2),d=[ri(1,9),ri(0,9),ri(0,9)];const val=x=>{const t=d.slice();t[pos]=x;return +t.join('');};const xs=range(pos===0?1:0,9);const S=xs.filter(x=>val(x)%m1===0&&val(x)%m2===0);if(S.length!==1)return null;const pat=d.map((c,i)=>i===pos?'*':c).join('');
  const only1=xs.filter(x=>val(x)%m1===0&&val(x)%m2),only2=xs.filter(x=>val(x)%m2===0&&val(x)%m1),none=xs.filter(x=>val(x)%m1&&val(x)%m2);
  return opt4(`Số ${OV(pat)} là bội chung của ${m1} và ${m2}. Chữ số * là:`,''+S[0],[...[sel(only1),sel(only2),sel(none)].map((x,i)=>x===undefined?null:[''+x,[`Số ${val(x)} chia hết cho ${m1} nhưng không chia hết cho ${m2}.`,`Số ${val(x)} chia hết cho ${m2} nhưng không chia hết cho ${m1}.`,`Số ${val(x)} không chia hết cho ${m1}, cũng không chia hết cho ${m2}.`][i]]),none.length>1?[''+none[none.length-1],`Số ${val(none[none.length-1])} không là bội chung.`]:null,only1.length>1?[''+only1[only1.length-1],`Số ${val(only1[only1.length-1])} chưa chia hết cho ${m2}.`]:null].filter(Boolean).filter(w=>+w[0]!==S[0]),`Bội chung của ${m1} và ${m2} chia hết cho cả hai số; thử từng chữ số: chỉ có ${val(S[0])} thoả mãn.`);});}
// tt: bài toán thực tế
const SIT_BC=[(a,b)=>`Hai đèn nháy cứ ${a} giây và ${b} giây sáng một lần; tìm thời gian ít nhất để hai đèn lại cùng sáng`,(a,b)=>`Tìm số học sinh ít nhất (khác 0) để xếp hàng ${a} hay hàng ${b} đều vừa đủ`,(a,b)=>`Hai tàu cứ ${a} ngày và ${b} ngày cập bến một lần; tìm số ngày ít nhất để hai tàu lại cùng cập bến`];
const SIT_UC=[(a,b)=>`Chia ${a} quyển vở và ${b} chiếc bút thành nhiều phần thưởng nhất, mỗi loại chia đều`,(a,b)=>`Cắt hai sợi dây dài ${a} m và ${b} m thành các đoạn bằng nhau, dài nhất có thể`,(a,b)=>`Xếp ${a} bạn nam và ${b} bạn nữ thành nhiều hàng dọc nhất, số nam và số nữ ở các hàng như nhau`];
function mPick(){const [a,b]=pairG([2,3,4,5,6],48),up=RNG()<.5;const R=sel(up?SIT_BC:SIT_UC)(a,b),O=shuffle(up?SIT_UC:SIT_BC).map(f=>[f(a,b),up?'Bài toán này tìm ƯCLN (chia đều, nhiều nhất, dài nhất).':'Bài toán này tìm BCNN (lặp lại, ít nhất để cùng xảy ra).']);
  return mkMC(`Bài toán nào sau đây được giải bằng cách tìm ${up?'BCNN':'ƯCLN'} của ${a} và ${b}?`,R,O,up?'Hai sự việc lặp lại, hoặc số nhỏ nhất chia hết cho cả hai số: tìm BCNN.':'Chia đều thành nhiều phần nhất, cắt đoạn dài nhất: tìm ƯCLN.');}
function runP(){for(;;){const p=sel([40,45,48,50,60,72,75,80,90,100,120]),q=sel([45,48,50,60,72,75,80,90,100,120,150]);if(p===q||p%q===0||q%p===0)continue;const l=lcm(p,q);if(l%60||l>1800)continue;return [p,q,l];}}
function mRun(){return tryL(()=>{const [p,q,l]=runP();
  return opt4(`Hai vận động viên xuất phát cùng lúc, cùng vị trí, chạy cùng chiều quanh một sân. Người thứ nhất chạy một vòng hết ${p} giây, người thứ hai hết ${q} giây (tốc độ không đổi). Sau ít nhất bao nhiêu phút họ lại cùng có mặt ở chỗ xuất phát?`,`${l/60} phút`,[[`${l} phút`,`${l} là số giây, phải đổi ra phút.`],[`${p*q/60} phút`,'Tích hai số là một bội chung nhưng chưa nhỏ nhất.'],[`${(p+q)/60} phút`,'Không cộng thời gian hai người.'],[`${2*l/60} phút`,'Đây là lần thứ hai họ cùng ở chỗ xuất phát.']].filter(w=>Number.isInteger(+w[0].split(' ')[0])),`Thời gian là ${BCNN(p,q)} = ${l} giây = ${l/60} phút.`);});}
function mGear(){return tryL(()=>{const a=ri(12,40),b=ri(12,40);if(a===b||gcd(a,b)===1||a%b===0||b%a===0)return null;const l=lcm(a,b);
  return opt4(`Hai bánh răng ăn khớp nhau: bánh A có ${a} răng, bánh B có ${b} răng. Lúc đầu, hai răng được đánh dấu chạm nhau. Bánh A phải quay ít nhất bao nhiêu vòng thì hai răng đó lại chạm nhau?`,`${l/a} vòng`,[[`${l/b} vòng`,'Đây là số vòng của bánh B.'],[`${l} vòng`,`${l} là số răng mỗi bánh đi qua, chưa chia cho ${a}.`],[`${b} vòng`,`Quay ${b} vòng thì đúng nhưng chưa ít nhất.`],[`${gcd(a,b)} vòng`,'Số răng đi qua phải là bội chung của số răng hai bánh.']],`Số răng đi qua chỗ tiếp xúc là ${BCNN(a,b)} = ${l}; bánh A quay ${l} : ${a} = ${l/a} vòng.`);});}
function mCanChi(){return tryL(()=>{const Y=ri(1990,2030),n=ccName(Y);
  return opt4(`Tên năm âm lịch ghép một trong 10 can với một trong 12 chi, cả can và chi đều lần lượt lặp lại. Năm ${Y} là năm ${n}. Năm gần nhất sau đó cũng là năm ${n} là năm:`,''+(Y+60),[[''+(Y+10),`Năm ${Y+10} là năm ${ccName(Y+10)}: chỉ trùng can.`],[''+(Y+12),`Năm ${Y+12} là năm ${ccName(Y+12)}: chỉ trùng chi.`],[''+(Y+120),'Đúng tên nhưng chưa gần nhất.'],[''+(Y+22),`Năm ${Y+22} là năm ${ccName(Y+22)}.`]],`Tên năm lặp lại sau ${BCNN(10,12)} = 60 năm: ${Y} + 60 = ${Y+60}.`);});}
function mWeek(){return tryL(()=>{const xs=shuffle([2,3,4,5,6,8,9,10,12]).slice(0,3),l=lA(xs);if(l>90||l<12)return null;const s=ri(0,6),[a,b,c]=xs;const day=k=>DAYS[(s+k)%7];
  return opt4(`Hôm nay là ${DAYS[s]}, ba bạn An, Bình, Chi cùng đến thư viện. An cứ ${a} ngày đến một lần, Bình cứ ${b} ngày, Chi cứ ${c} ngày. Lần gần nhất tiếp theo cả ba bạn cùng đến thư viện là ngày nào trong tuần?`,day(l),[[day(lcm(a,b)),`Mới tính cho An và Bình (${lcm(a,b)} ngày).`],[day(l+1),'Đã đếm thêm cả hôm nay.'],[day(l%7?l%7-1+7:6),'Đếm sai số ngày dư khi chia cho 7.'],[day(a+b+c),'Không cộng các chu kì.'],[day(0+1),'Không phải ngày mai.']].filter(w=>w[0]!==day(l)),`Sau ${BCNN(a,b,c)} = ${l} ngày; ${l} = 7 · ${fl(l/7)} + ${l%7} nên là ngày cách ${DAYS[s]} ${l%7} ngày: ${day(l)}.`);});}
function mThieu(){return tryL(()=>{const xs=shuffle([2,3,4,5,6,8,9,10,12]).slice(0,3),l=lA(xs);if(l<20||l>120)return null;const k=ri(2,Math.max(2,fl(400/l))),x=k*l-1,lo=x-ri(1,l-2),hi=x+ri(1,l-2);if(lo<10)return null;
  return opt4(`Số học sinh khối 6 của một trường trong khoảng từ ${lo} đến ${hi}. Khi xếp hàng ${xs[0]}, hàng ${xs[1]}, hàng ${xs[2]} đều thiếu 1 em. Số học sinh khối 6 là:`,''+x,[[''+(x+1),'Đây là số chia hết cho cả ba số; thiếu 1 em nên phải bớt 1.'],[''+(x+2),'Thiếu 1 em, không phải thừa 1 em.'],[''+(x-l),`${x-l} < ${lo}.`],[''+(x+l),`${x+l} > ${hi}.`]].filter(w=>+w[0]<lo||+w[0]>hi||(+w[0]+1)%l),`Thêm 1 em thì vừa đủ: số học sinh + 1 ∈ BC(${L(xs).replace(/; /g,', ')}) = B(${l}). Trong khoảng đã cho: ${x} + 1 = ${x+1}, nên có ${x} học sinh.`);});}

const MC=[];
const addMC=(id,topic,level,gen,mix)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},mix?{mix}:{}));
addMC('l_rule','hai','NB',mRule);addMC('l_rule2','hai','NB',mRule);addMC('l_psp','hai','NB',mPairSp);addMC('l_psp2','hai','NB',mPairSp);addMC('l_pg','hai','TH',mPairGen,[10]);addMC('l_3','hai','TH',mThree);addMC('l_prod','hai','TH',mProd);addMC('l_rat','hai','VD',mRatio,[10]);addMC('l_oth','hai','VD',mOther,[10]);
addMC('l_qdr','ps','NB',mQdRule);addMC('l_qdr2','ps','NB',mQdRule);addMC('l_msc','ps','NB',mMsc(true));addMC('l_msc2','ps','TH',mMsc(false));addMC('l_fac','ps','TH',mFactor);addMC('l_qd','ps','TH',mQd);addMC('l_add','ps','VD',mAdd);addMC('l_rm','ps','VD',mRedMsc);
addMC('l_wh','tim','NB',mWhich);addMC('l_wh2','tim','NB',mWhich);addMC('l_xbc','tim','TH',mXbc);addMC('l_b3','tim','TH',mBig3);addMC('l_ch','tim','VD',mChain,[8]);addMC('l_pr','tim','VD',mPair);addMC('l_dg','tim','VD',mDigit,[9]);
addMC('l_pk','tt','NB',mPick);addMC('l_pk2','tt','NB',mPick);addMC('l_run','tt','TH',mRun);addMC('l_cc','tt','TH',mCanChi);addMC('l_gr','tt','VD',mGear);addMC('l_wk','tt','VD',mWeek,[8]);addMC('l_th','tt','VD',mThieu,[8]);

/* ============ Câu đúng sai ============ */
const POOL_L=[
  [IT('ƯCLN(a, b) là ước của BCNN(a, b).',true,'hai','NB','BCNN chia hết cho a, mà a chia hết cho ƯCLN.'),IT('BCNN(a, b) là ước của ƯCLN(a, b).',false,'hai','NB','Ví dụ BCNN(4, 6) = 12 không là ước của ƯCLN(4, 6) = 2.')],
  [IT('ƯCLN(a, b) · BCNN(a, b) = a · b.',true,'hai','NB','Kết luận của bài 2.45 trong SGK.'),IT('ƯCLN(a, b) + BCNN(a, b) = a + b.',false,'hai','NB','ƯCLN(4, 6) + BCNN(4, 6) = 2 + 12 = 14 ≠ 10.')],
  [IT('ƯCLN(a, b) ≤ BCNN(a, b).',true,'hai','NB','ƯCLN(a, b) ≤ a ≤ BCNN(a, b).'),IT('ƯCLN(a, b) và BCNN(a, b) không bao giờ bằng nhau.',false,'hai','NB','Khi a = b thì ƯCLN(a, b) = BCNN(a, b) = a.')],
  [IT('Nếu a ⋮ b thì BCNN(a, b) = a và ƯCLN(a, b) = b.',true,'hai','NB','a là bội của b, b là ước của a.'),IT('Nếu a ⋮ b thì ƯCLN(a, b) · BCNN(a, b) = a.',false,'hai','NB','Tích bằng b · a, không phải a. Ví dụ ƯCLN(12, 4) · BCNN(12, 4) = 4 · 12 = 48.')]];
const POOL_P=[
  [IT('Có thể lấy BCNN của các mẫu làm mẫu chung khi quy đồng mẫu.',true,'ps','NB','BCNN là bội chung nhỏ nhất của các mẫu.'),IT('Mẫu chung nhỏ nhất của hai phân số luôn bằng tích hai mẫu.',false,'ps','NB','Hai phân số có mẫu 4 và 6 có mẫu chung nhỏ nhất là 12, không phải 24.')],
  [IT('Thừa số phụ của một mẫu bằng mẫu chung chia cho mẫu đó.',true,'ps','NB','Như các bước quy đồng mẫu trong SGK.'),IT('Thừa số phụ của một mẫu bằng mẫu chung trừ đi mẫu đó.',false,'ps','NB','Phải chia, không trừ.')],
  [IT('Chia cả tử và mẫu cho ƯCLN của chúng thì được phân số tối giản.',true,'ps','NB','Như SGK Bài 11.'),IT('Chia cả tử và mẫu cho BCNN của chúng thì được phân số tối giản.',false,'ps','NB','BCNN thường không là ước của tử và mẫu.')],
  [IT('Số x lớn nhất thoả mãn a ⋮ x và b ⋮ x là ƯCLN(a, b).',true,'tim','NB','x là ước chung; lớn nhất là ƯCLN.'),IT('Số x nhỏ nhất khác 0 thoả mãn x ⋮ a và x ⋮ b là ƯCLN(a, b).',false,'tim','NB','x là bội chung; nhỏ nhất khác 0 là BCNN.')],
  [IT('Số x nhỏ nhất khác 0 thoả mãn x ⋮ a và x ⋮ b là BCNN(a, b).',true,'tim','NB','x là bội chung nhỏ nhất khác 0.'),IT('Số x lớn nhất thoả mãn a ⋮ x và b ⋮ x là BCNN(a, b).',false,'tim','NB','BCNN(a, b) không là ước của a (trừ khi a ⋮ b).')]];
function tfPool(P){return ()=>tfMake(()=>shuffle(P).slice(0,4).map(p=>sel(p)),'Với a, b là các số tự nhiên khác 0, xét các phát biểu sau:');}
function tfSpec(){return tfMake(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){let a,b;if(RNG()<.5){b=ri(3,15);a=b*ri(2,6);}else{for(;;){a=ri(3,15);b=ri(3,15);if(a!==b&&gcd(a,b)===1)break;}}if(used.has(a+','+b))return null;used.add(a+','+b);
  const isL=RNG()<.5,v=RNG()<.5,tr=isL?lcm(a,b):gcd(a,b),wr=isL?(gcd(a,b)>1?a*b:a+b):(gcd(a,b)>1?a:Math.min(a,b));o.push(IT(`${isL?BCNN(a,b):UCLN(a,b)} = ${v?tr:wr}`,v,'hai','NB',gcd(a,b)>1?`${dv(a,b)} nên ${UCLN(a,b)} = ${b}, ${BCNN(a,b)} = ${a}.`:`${a} và ${b} nguyên tố cùng nhau: ${UCLN(a,b)} = 1, ${BCNN(a,b)} = ${a*b}.`));}return o;},'Xét các khẳng định sau:');}
function tfNum(){const [a,b,g]=pairG([4,6,8,9,10,12],100),l=lcm(a,b),R=()=>RNG()<.5;
  return tfMake(()=>{const o=[];
    {const v=R();o.push(IT(`${UCLN(a,b)} = ${v?g:2*g}`,v,'hai','TH',`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ƯCLN = ${FS(fmin(a,b))} = ${g}.`));}
    {const v=R();o.push(IT(`${BCNN(a,b)} = ${v?l:a*b}`,v,'hai','TH',`BCNN = ${FS(fmax(a,b))} = ${l} (khác tích ${a*b} vì hai số không nguyên tố cùng nhau).`));}
    {const v=R();o.push(IT(`${UCLN(a,b)} · ${BCNN(a,b)} = ${v?a*b:a*b+g}`,v,'hai','TH',`${g} · ${l} = ${g*l} = ${a} · ${b}.`));}
    {const v=R();o.push(IT(`${BCNN(a,b)} : ${UCLN(a,b)} = ${v?l/g:a/g+b/g}`,v,'hai','TH',`${l} : ${g} = ${l/g}.`));}
    return o;},`Cho hai số ${a} và ${b}. Xét các khẳng định về ƯCLN và BCNN của chúng:`);}
function tfFrac(){const [p,b,q,d]=denPair(false),l=lcm(b,d),x=l/b,y=l/d,n=p*x+q*y,g=gcd(n,l),R=()=>RNG()<.5;
  return tfMake(()=>{const o=[];
    {const v=R();o.push(IT(`Mẫu chung nhỏ nhất của hai phân số là ${v?l:b*d}.`,v,'ps','TH',`${BCNN(b,d)} = ${l}.`));}
    {const v=R();o.push(IT(`Thừa số phụ của mẫu ${b} là ${v?x:y}.`,v,'ps','TH',`${l} : ${b} = ${x}.`));}
    {const v=R();o.push(IT(`Sau khi quy đồng với mẫu chung nhỏ nhất, ${FR(p,b)} = ${v?FR(p*x,l):FR(p*y,l)}.`,v,'ps','TH',`${FR(p,b)} = ${FR(`${p} · ${x}`,`${b} · ${x}`)} = ${FR(p*x,l)}.`));}
    {const v=R(),w=FR(p+q,b+d);o.push(IT(`${FR(p,b)} + ${FR(q,d)} = ${v?FR(n/g,l/g):w}`,v,'ps','TH',`${FR(p*x,l)} + ${FR(q*y,l)} = ${FR(n,l)}${g>1?` = ${FR(n/g,l/g)}`:''}.`));}
    return o;},`Cho hai phân số ${FR(p,b)} và ${FR(q,d)}. Xét các khẳng định sau:`);}
function tfX(){for(;;){const [a,b]=pairG([2,3,4,6],30),l=lcm(a,b);if(l>60||l===a*b)continue;const N=l*ri(4,8)+ri(1,l-1),M=range(1,N-1).filter(x=>x%l===0),R=()=>RNG()<.5;const z=sel(M),w=pickN(l+1,N-1,x=>x%a===0&&x%l)||pickN(l+1,N-1,x=>x%b===0&&x%l);if(!w)continue;
  const r=tfMake(()=>{const o=[];
    {const v=R();o.push(IT(`M có ${v?M.length:M.length+1} phần tử.`,v,'tim','VD',`M = ${SET(M)}.`));}
    {const v=R();o.push(IT(`Số nhỏ nhất trong M là ${v?l:a*b}.`,v,'tim','VD',`Số nhỏ nhất khác 0 là ${BCNN(a,b)} = ${l}.`));}
    {const v=R();o.push(IT(`${v?z:w} ∈ M`,v,'tim','VD',v?`${z} chia hết cho ${l}.`:`${rel(w,a)}; ${rel(w,b)}.`));}
    {const v=R();o.push(IT(`Mọi phần tử của M đều chia hết cho ${v?l:a*b}.`,v,'tim','VD',v?`Các bội chung đều là bội của BCNN = ${l}.`:`${l} ∈ M nhưng ${nd(l,a*b)}.`));}
    return o;},`Gọi M là tập hợp các số tự nhiên x khác 0 thoả mãn x ⋮ ${a}, x ⋮ ${b} và x < ${N}. Xét các khẳng định sau:`);if(r)return r;}}
function tfGL(){const g=sel([2,3,4,5,6]),k=sel([6,10,12,15,30]),l=g*k,P=[];for(let x=1;x*x<k;x++)if(k%x===0&&gcd(x,k/x)===1)P.push([g*x,g*k/x]);const A=P.map(p=>p[0]).concat(P.map(p=>p[1])),R=()=>RNG()<.5;
  const notA=divs(l).filter(d=>d%g===0&&!A.includes(d));
  return tfMake(()=>{const o=[];
    {const v=R();o.push(IT(`a · b = ${v?g*l:g+l}`,v,'hai','VD',`a · b = ƯCLN · BCNN = ${g} · ${l} = ${g*l}.`));}
    {const v=R();o.push(IT(v?`Cả a và b đều là ước của ${l}.`:`Cả a và b đều là bội của ${l}.`,v,'hai','VD',`a và b là ước của BCNN = ${l}${v?'':' (không phải bội, trừ khi a = b = '+l+')'}.`));}
    {const v=R()||!notA.length,x=v?sel(A):sel(notA);o.push(IT(`Có thể a = ${x}.`,v,'hai','VD',v?`Ví dụ (${P.find(p=>p.includes(x)).join('; ')}) có ƯCLN = ${g}, BCNN = ${l}.`:`Nếu a = ${x} thì b = ${g*l} : ${x} = ${g*l/x}, khi đó ${UCLN(x,g*l/x)} = ${gcd(x,g*l/x)} ≠ ${g}.`));}
    {const v=R();o.push(IT(`Có đúng ${v?P.length:P.length+1} cặp (a; b) với a < b thoả mãn.`,v,'hai','VD',`Các cặp: ${P.map(p=>`(${p[0]}; ${p[1]})`).join(', ')}.`));}
    return o;},`Hai số tự nhiên a và b có ${UCLN('a','b')} = ${g} và ${BCNN('a','b')} = ${l}. Xét các khẳng định sau:`);}
function tfRun(){const [p,q,l]=runP(),R=()=>RNG()<.5,T=l*ri(2,4)/60+ri(0,Math.max(0,l/60-1));
  return tfMake(()=>{const o=[];
    {const v=R();o.push(IT(`Sau ${v?l:(p*q!==l?p*q:2*l)} giây, lần đầu tiên hai người lại cùng có mặt ở chỗ xuất phát.`,v,'tt','VD',`${BCNN(p,q)} = ${l} giây.`));}
    {const v=R();o.push(IT(`Lúc đó người thứ nhất đã chạy được ${v?l/p:l/q} vòng.`,v,'tt','VD',`${l} : ${p} = ${l/p} vòng.`));}
    {const v=R(),t=v?2*l:l+fl(l/2);o.push(IT(`Sau ${t} giây kể từ lúc xuất phát, hai người cùng có mặt ở chỗ xuất phát.`,t%p===0&&t%q===0,'tt','VD',`${rel(t,p)}; ${rel(t,q)}.`));}
    {const v=R(),c=fl(T*60/l);o.push(IT(`Trong ${T} phút đầu, hai người cùng có mặt ở chỗ xuất phát ${v?c:c+1} lần (không kể lúc xuất phát).`,v,'tt','VD',`${T} phút = ${T*60} giây; các thời điểm là bội của ${l}: có ${c} lần.`));}
    return o;},`Hai vận động viên xuất phát cùng lúc, cùng vị trí, chạy cùng chiều quanh sân. Người thứ nhất chạy một vòng hết ${p} giây, người thứ hai hết ${q} giây (tốc độ không đổi). Xét các khẳng định sau:`);}
function tfGear(){for(;;){const a=ri(12,36),b=ri(12,36);if(a===b||gcd(a,b)===1||a%b===0||b%a===0)continue;const l=lcm(a,b),R=()=>RNG()<.5;
  const r=tfMake(()=>{const o=[];
    {const v=R();o.push(IT(`Hai răng đánh dấu lại chạm nhau lần đầu khi mỗi bánh đã có ${v?l:a*b} răng đi qua chỗ tiếp xúc.`,v,'tt','VD',`${BCNN(a,b)} = ${l}.`));}
    {const v=R();o.push(IT(`Khi đó bánh A quay được ${v?l/a:l/b} vòng.`,v,'tt','VD',`${l} : ${a} = ${l/a}.`));}
    {const v=R();o.push(IT(`Khi đó bánh B quay được ${v?l/b:l/a} vòng.`,v||l/a===l/b,'tt','VD',`${l} : ${b} = ${l/b}.`));}
    {const v=R();o.push(IT(`Nếu bánh A quay ${v?2*l/a:l/a+1} vòng thì hai răng đánh dấu cũng chạm nhau.`,v,'tt','VD',v?`${2*l/a} · ${a} = ${2*l} là bội chung của ${a} và ${b}.`:`${l/a+1} · ${a} = ${(l/a+1)*a} ${ND} ${b}.`));}
    return o;},`Hai bánh răng ăn khớp nhau: bánh A có ${a} răng, bánh B có ${b} răng. Lúc đầu, hai răng được đánh dấu chạm nhau. Xét các khẳng định sau:`);if(r)return r;}}
function tfCanChi(){const Y=ri(1990,2030),n=ccName(Y),R=()=>RNG()<.5;
  return tfMake(()=>{const o=[];
    {const v=R();o.push(IT(`Cứ ${v?60:120} năm thì tên năm âm lịch lặp lại (chu kì ngắn nhất).`,v,'tt','VD',`${BCNN(10,12)} = 60.`));}
    {const v=R(),y=v?Y+60:Y+12;o.push(IT(`Năm ${y} là năm ${n}.`,v,'tt','VD',`Năm ${y} là năm ${ccName(y)}.`));}
    {const v=R();o.push(IT(`Năm ${Y+10} có cùng ${v?'can':'chi'} với năm ${Y}.`,v,'tt','VD',`Năm ${Y+10} là năm ${ccName(Y+10)}: can lặp lại sau 10 năm, chi lặp lại sau 12 năm.`));}
    {const v=R(),y=v?Y-60:Y-50;o.push(IT(`Năm ${y} cũng là năm ${n}.`,v,'tt','VD',`Năm ${y} là năm ${ccName(y)}.`));}
    return o;},`Tên năm âm lịch ghép một can (trong 10 can) với một chi (trong 12 chi), cả can và chi đều lần lượt lặp lại. Năm ${Y} là năm ${n}. Xét các khẳng định sau:`);}
function tfPick(){return tfMake(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){const [a,b]=pairG([2,3,4,5],40),up=RNG()<.5,k=ri(0,2);if(used.has((up?'b':'u')+k))return null;used.add((up?'b':'u')+k);const s=(up?SIT_BC:SIT_UC)[k](a,b),say=RNG()<.5;
  o.push(IT(`“${s}”: tìm ${say?'BCNN':'ƯCLN'}(${a}, ${b}).`,say===up,'tt','NB',up?'Sự việc lặp lại, số ít nhất chia hết cho cả hai số: BCNN.':'Chia đều nhiều phần nhất, đoạn dài nhất: ƯCLN.'));}return o;},'Xét cách giải các bài toán sau:');}
const TF=[];
const addTF=(id,topic,level,gen,mix)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},mix?{mix}:{}));
addTF('t_pl','hai','NB',tfPool(POOL_L));addTF('t_pp','ps','NB',tfPool(POOL_P));addTF('t_sp','hai','NB',tfSpec);addTF('t_pk','tt','NB',tfPick);addTF('t_pl2','tim','NB',tfPool(POOL_P.slice(3).concat(POOL_L.slice(0,2))));
addTF('t_num','hai','TH',tfNum);addTF('t_num2','hai','TH',tfNum);addTF('t_fr','ps','TH',tfFrac);addTF('t_fr2','ps','TH',tfFrac);
addTF('t_x','tim','VD',tfX);addTF('t_gl','hai','VD',tfGL);addTF('t_run','tt','VD',tfRun);addTF('t_gear','tt','VD',tfGear);addTF('t_cc','tt','VD',tfCanChi);

/* ============ Câu trả lời ngắn ============ */
const SA=[
 {id:'s_dv',topic:'hai',level:'NB',unit:'',gen:()=>{const b=ri(4,30),a=b*ri(2,9);return{stem:`Tính ${BCNN(a,b)} − ${UCLN(a,b)}.`,ans:[a-b],exp:`${dv(a,b)} nên ${BCNN(a,b)} = ${a}, ${UCLN(a,b)} = ${b}; ${a} − ${b} = ${a-b}.`};}},
 {id:'s_cop',topic:'hai',level:'NB',unit:'',gen:()=>{for(;;){const a=ri(4,25),b=ri(4,25);if(a===b||gcd(a,b)!==1)continue;return{stem:`Hai số ${a} và ${b} là hai số nguyên tố cùng nhau. Tính ${BCNN(a,b)}.`,ans:[a*b],exp:`Hai số nguyên tố cùng nhau có BCNN bằng tích: ${a} · ${b} = ${a*b}.`};}}},
 {id:'s_gl',topic:'hai',level:'TH',unit:'',gen:()=>{const [a,b,g]=pairG([3,4,5,6,8,9,12],90);return{stem:`Hai số tự nhiên a, b có ${BCNN('a','b')} = ${F(lcm(a,b))} và a · b = ${F(a*b)}. Tính ${UCLN('a','b')}.`,ans:[g],exp:`ƯCLN(a, b) = a · b : BCNN(a, b) = ${F(a*b)} : ${F(lcm(a,b))} = ${g}.`};}},
 {id:'s_rat',topic:'hai',level:'TH',unit:'',gen:()=>{const [a,b,g]=pairG([4,6,8,9,10,12,15],150);return{stem:`Tính ${BCNN(a,b)} : ${UCLN(a,b)}.`,ans:[lcm(a,b)/g],exp:`${UCLN(a,b)} = ${g}; ${BCNN(a,b)} = ${lcm(a,b)}; ${lcm(a,b)} : ${g} = ${lcm(a,b)/g}.`};}},
 {id:'s_sum',topic:'hai',level:'TH',unit:'',gen:()=>{const [a,b,g]=pairG([4,6,8,9,10,12,14],120);return{stem:`Tính ${UCLN(a,b)} + ${BCNN(a,b)}.`,ans:[g+lcm(a,b)],exp:`${a} = ${FS(fac(a))}; ${b} = ${FS(fac(b))}; ƯCLN = ${g}, BCNN = ${lcm(a,b)}; tổng ${g+lcm(a,b)}.`};}},
 {id:'s_msc',topic:'ps',level:'NB',unit:'',gen:()=>{const [p,b,q,d]=denPair(true);return{stem:`Tìm mẫu chung nhỏ nhất của hai phân số ${FR(p,b)} và ${FR(q,d)}.`,ans:[lcm(b,d)],exp:`${BCNN(b,d)} = ${lcm(b,d)} (số lớn chia hết cho số nhỏ).`};}},
 {id:'s_tu',topic:'ps',level:'NB',unit:'',gen:()=>{const [p,b,q,d]=denPair(false),l=lcm(b,d);return{stem:`Quy đồng mẫu hai phân số ${FR(p,b)} và ${FR(q,d)} với mẫu chung ${l}. Tử số mới của phân số ${FR(q,d)} là bao nhiêu?`,ans:[q*l/d],exp:`Thừa số phụ ${l} : ${d} = ${l/d}; tử mới ${q} · ${l/d} = ${q*l/d}.`};}},
 {id:'s_m3',topic:'ps',level:'TH',unit:'',mix:[10],gen:()=>{for(;;){const ds=shuffle([4,6,8,9,10,12,14,15,18]).slice(0,3),l=lA(ds);if(l>360||ds.some(x=>l===x))continue;const ns=ds.map(d=>numFor(d));return{stem:`Tìm mẫu chung nhỏ nhất của ba phân số ${ds.map((d,i)=>FR(ns[i],d)).join('; ')}.`,ans:[l],exp:`${ds.map(d=>`${d} = ${FS(fac(d))}`).join('; ')}; ${BCNN(...ds)} = ${FS(fac(l))} = ${l}.`};}}},
 {id:'s_add',topic:'ps',level:'VD',unit:'',gen:()=>{for(;;){const [p,b,q,d]=denPair(false),l=lcm(b,d),n=p*l/b+q*l/d,g=gcd(n,l);if(g===1)continue;return{stem:`Tính ${FR(p,b)} + ${FR(q,d)} rồi viết kết quả dưới dạng phân số tối giản. Mẫu số của phân số tối giản đó là bao nhiêu?`,ans:[l/g],exp:`${FR(p*l/b,l)} + ${FR(q*l/d,l)} = ${FR(n,l)} = ${FR(n/g,l/g)} (chia cả tử và mẫu cho ${UCLN(n,l)} = ${g}).`};}}},
 {id:'s_big',topic:'tim',level:'TH',unit:'',mix:[8],gen:()=>{for(;;){const xs=shuffle([2,3,4,5,6,8,9,10,12]).slice(0,3),l=lA(xs);if(l<20||l>200)continue;const x=fl(999/l)*l;return{stem:`Tìm số lớn nhất có ba chữ số là bội chung của ${xs[0]}, ${xs[1]} và ${xs[2]}.`,ans:[x],exp:`${BCNN(...xs)} = ${l}; 999 = ${l} · ${fl(999/l)} + ${999%l}; số cần tìm là ${l} · ${fl(999/l)} = ${x}.`};}}},
 {id:'s_xg',topic:'tim',level:'TH',unit:'',gen:()=>{for(;;){const g=sel([4,6,8,9,12,15]),xs=shuffle([2,3,5,7,4,9]).slice(0,3);if(gA(xs)!==1)continue;const v=xs.map(x=>g*x);return{stem:`Tìm số tự nhiên x lớn nhất, biết ${v[0]} ⋮ x, ${v[1]} ⋮ x và ${v[2]} ⋮ x.`,ans:[g],exp:`x là ước chung của ${L(v)}; x lớn nhất là ${UCLN(...v)} = ${g}.`};}}},
 {id:'s_ch',topic:'tim',level:'VD',unit:'số',mix:[8],gen:()=>{const d=sel([3,4,5,6,7]),n=d*sel([8,12,16,18,20,24,36]);const S=divs(n).filter(x=>x%d===0);return{stem:`Có bao nhiêu số tự nhiên x vừa là bội của ${d}, vừa là ước của ${n}?`,ans:[S.length],exp:`Các ước của ${n} chia hết cho ${d}: ${SET(S)}.`};}},
 {id:'s_dg',topic:'tim',level:'VD',unit:'',mix:[9],gen:()=>{for(;;){const r=mDigit();if(r.stem.startsWith('Khi tìm'))continue;return{stem:r.stem.replace(' Chữ số * là:',' Tìm chữ số *.'),ans:[+r.opts[0].t],exp:r.exp};}}},
 {id:'s_run',topic:'tt',level:'TH',unit:'phút',gen:()=>{const [p,q,l]=runP();return{stem:`Hai bạn chạy quanh sân, xuất phát cùng lúc, cùng vị trí, cùng chiều. Bạn thứ nhất chạy một vòng hết ${p} giây, bạn thứ hai hết ${q} giây. Sau ít nhất bao nhiêu phút hai bạn lại cùng có mặt ở chỗ xuất phát?`,ans:[l/60],exp:`${BCNN(p,q)} = ${l} giây = ${l/60} phút.`};}},
 {id:'s_cc',topic:'tt',level:'TH',unit:'năm',gen:()=>{const Y=ri(1990,2030),A=ri(1700,1850),B=A+ri(100,200);let c=0;for(let y=A;y<=B;y++)if(ccName(y)===ccName(Y))c++;return{stem:`Năm ${Y} là năm ${ccName(Y)}. Biết tên năm âm lịch lặp lại sau mỗi BCNN(10, 12) năm. Từ năm ${A} đến năm ${B}, có bao nhiêu năm tên là ${ccName(Y)}?`,ans:[c],exp:`Tên năm lặp lại sau 60 năm; các năm ${ccName(Y)} cách ${Y} một bội của 60: ${range(A,B).filter(y=>(Y-y)%60===0).join('; ')}.`};}},
 {id:'s_gr',topic:'tt',level:'VD',unit:'vòng',gen:()=>{for(;;){const a=ri(12,40),b=ri(12,40);if(a===b||gcd(a,b)===1||a%b===0||b%a===0)continue;const l=lcm(a,b);return{stem:`Hai bánh răng ăn khớp nhau: bánh A có ${a} răng, bánh B có ${b} răng. Lúc đầu hai răng đánh dấu chạm nhau. Bánh B phải quay ít nhất bao nhiêu vòng thì hai răng đó lại chạm nhau?`,ans:[l/b],exp:`${BCNN(a,b)} = ${l} răng; bánh B quay ${l} : ${b} = ${l/b} vòng.`};}}},
 {id:'s_bo',topic:'tt',level:'VD',unit:'cuốn',gen:()=>{for(;;){const xs=shuffle([6,8,9,10,12,15,18,20]).slice(0,3),l=lA(xs);if(l<30||l>200)continue;const k=ri(2,Math.max(2,fl(700/l))),x=k*l,lo=x-ri(1,l-1),hi=x+ri(1,l-1);return{stem:`Một số sách khi xếp thành từng bó ${xs[0]} cuốn, ${xs[1]} cuốn hay ${xs[2]} cuốn đều vừa đủ bó. Biết số sách trong khoảng từ ${lo} đến ${hi}. Tính số sách.`,ans:[x],exp:`Số sách ∈ BC(${xs.join(', ')}) = B(${l}); trong khoảng từ ${lo} đến ${hi} chỉ có ${x}.`};}}},
 {id:'s_cay',topic:'tt',level:'VD',unit:'vị trí',gen:()=>{for(;;){const [a,b]=pairG([2,3,4,5],30),l=lcm(a,b);if(l>60||l===a*b&&RNG()<.5)continue;const D=l*ri(3,9)+ri(0,l-1);return{stem:`Trên một con đường thẳng, từ đầu đường cứ ${a} m trồng một cây và cứ ${b} m đặt một cột đèn (đầu đường có cả cây và cột đèn). Trên đoạn đường dài ${D} m tính từ đầu đường (kể cả đầu đường), có bao nhiêu vị trí vừa có cây vừa có cột đèn?`,ans:[fl(D/l)+1],exp:`Các vị trí cách đầu đường một bội chung của ${a} và ${b}, tức bội của ${BCNN(a,b)} = ${l}: 0; ${l}; ...; ${fl(D/l)*l} (m). Có ${fl(D/l)+1} vị trí.`};}}}
].map(q=>Object.assign({type:'sa'},q));

/* ============ Chủ đề ============ */
const TOPICS={
  hai:{short:'ƯCLN và BCNN',name:'Tìm ƯCLN, BCNN và quan hệ giữa chúng',rule:'ƯCLN: chọn các thừa số nguyên tố chung, lấy số mũ nhỏ nhất. BCNN: chọn các thừa số nguyên tố chung và riêng, lấy số mũ lớn nhất. Với a, b khác 0: ƯCLN(a, b) · BCNN(a, b) = a · b.',tip:'BCNN(a, b) = a · b chỉ khi a, b nguyên tố cùng nhau; nếu a ⋮ b thì ƯCLN = b, BCNN = a.'},
  ps:{short:'Phân số',name:'Rút gọn và quy đồng mẫu phân số',rule:'Rút gọn về phân số tối giản: chia tử và mẫu cho ƯCLN. Quy đồng mẫu: lấy mẫu chung là BCNN của các mẫu, thừa số phụ = mẫu chung : mẫu, nhân cả tử và mẫu với thừa số phụ.',tip:'Mẫu chung nhỏ nhất là BCNN của các mẫu, không phải lúc nào cũng là tích các mẫu.'},
  tim:{short:'Tìm số',name:'Tìm số theo điều kiện chia hết',rule:'a ⋮ x và b ⋮ x: x là ước chung, x lớn nhất là ƯCLN(a, b). x ⋮ a và x ⋮ b: x là bội chung, x nhỏ nhất khác 0 là BCNN(a, b).',tip:'Nhìn x đứng trước hay sau dấu ⋮ để biết cần tìm ước chung hay bội chung.'},
  tt:{short:'Thực tế',name:'Bài toán thực tế: chọn ƯCLN hay BCNN',rule:'Chia đều thành nhiều phần nhất, cắt thành đoạn dài nhất: tìm ƯCLN. Sự việc lặp lại, "sau ít nhất bao lâu cùng xảy ra", số nhỏ nhất chia hết cho các số: tìm BCNN.',tip:'Đọc kĩ câu hỏi hỏi thời gian, số vòng hay số phần; nhớ đổi đơn vị (giây sang phút).'}
};
const TKEYS=['hai','ps','tim','tt'];
const TDESC={hai:'Tìm cả ƯCLN và BCNN, ƯCLN · BCNN = a · b',ps:'Rút gọn, mẫu chung, thừa số phụ, cộng phân số',tim:'Tìm x là ước chung hay bội chung',tt:'Chạy vòng sân, bánh răng, lịch can chi, xếp hàng'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Phân biệt cách tìm ƯCLN và BCNN, trường hợp đặc biệt, chọn mẫu chung.',TH:'Tìm ƯCLN, BCNN của hai, ba số; quy đồng mẫu; tìm số theo điều kiện chia hết.',VD:'Dùng ƯCLN · BCNN = a · b, cộng phân số, tìm cặp số, bài toán thực tế nhiều bước.'};

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
const HP=[
  [IT('Nếu BCNN(a, b) = a · b thì ƯCLN(a, b) = 1.',true,'hai','VD','Từ ƯCLN · BCNN = a · b suy ra ƯCLN = 1.'),IT('Nếu BCNN(a, b) = a · b thì a hoặc b là số nguyên tố.',false,'hai','VD','BCNN(8, 9) = 72 = 8 · 9 nhưng 8, 9 đều là hợp số.')],
  [IT('Nếu ƯCLN(a, b) = BCNN(a, b) thì a = b.',true,'hai','VD','ƯCLN ≤ a, b ≤ BCNN nên a = b = ƯCLN.'),IT('Nếu BCNN(a, b) = b thì ƯCLN(a, b) = b.',false,'hai','VD','BCNN(a, b) = b thì b ⋮ a, nên ƯCLN(a, b) = a. Ví dụ BCNN(4, 12) = 12 nhưng ƯCLN = 4.')],
  [IT('BCNN(2a, 2b) = 2 · BCNN(a, b).',true,'hai','VD','Nhân cả hai số với 2 thì số mũ của 2 trong BCNN tăng thêm 1.'),IT('BCNN(a, b, c) · ƯCLN(a, b, c) = a · b · c với mọi a, b, c khác 0.',false,'hai','VD','Với a = b = c = 2: 2 · 2 = 4 ≠ 8.')],
  [IT('BCNN(a, b) : ƯCLN(a, b) là tích của hai số nguyên tố cùng nhau.',true,'hai','VD','a = d · x, b = d · y với ƯCLN(x, y) = 1; thương bằng x · y.'),IT('BCNN(a, b) luôn lớn hơn cả a và b.',false,'hai','VD','BCNN(12, 4) = 12 không lớn hơn 12.')]];
function tfHard(){for(;;){const its=wrap(shuffle(HP).slice(0,4).map(p=>sel(p)));if(tfOK(its))return {stem:'Với a, b, c là các số tự nhiên khác 0, xét các khẳng định sau:',items:its};}}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'hai',level:'VD',gen:tfHard}],sa:[
 {id:'h_pairs',topic:'hai',level:'VD',unit:'cặp',gen:()=>{for(;;){const g=sel([2,3,4,5,6,7]),k=sel([6,10,12,15,30,36,60,42,70,84]);let c=0;for(let x=1;x*x<k;x++)if(k%x===0&&gcd(x,k/x)===1)c++;if(c<2)continue;return{stem:`Có bao nhiêu cặp số tự nhiên (a; b) với a < b, ${UCLN('a','b')} = ${g} và ${BCNN('a','b')} = ${g*k}?`,ans:[c],exp:`a = ${g}x, b = ${g}y với ƯCLN(x, y) = 1 và x · y = ${g*k} : ${g} = ${k}, x < y. Các cặp (x; y): ${range(1,k).filter(x=>x*x<k&&k%x===0&&gcd(x,k/x)===1).map(x=>`(${x}; ${k/x})`).join(', ')}.`};}}},
 {id:'h_lcmn',topic:'hai',level:'VD',unit:'số',gen:()=>{for(;;){const a=sel([4,6,8,9,10,12,15,18]),L0=a*sel([2,3,5,6,10]);const S=divs(L0).filter(n=>lcm(n,a)===L0);if(S.length<2)continue;return{stem:`Có bao nhiêu số tự nhiên n sao cho ${BCNN('n',a)} = ${L0}?`,ans:[S.length],exp:`n phải là ước của ${L0} = ${FS(fac(L0))} và mang đủ các lũy thừa mà ${a} = ${FS(fac(a))} còn thiếu: ${SET(S)}.`};}}},
 {id:'h_sgl',topic:'hai',level:'VD',unit:'',gen:()=>{for(;;){const g=sel([3,4,5,6,7,8,9,12]),x=ri(2,9),y=ri(x+1,13);if(gcd(x,y)!==1)continue;const S=g*(x+y),l=g*x*y;let c=0;for(let a=1;a<S/2;a++)if(gcd(a,S-a)===g&&lcm(a,S-a)===l)c++;if(c!==1)continue;return{stem:`Hai số tự nhiên a, b (a < b) có a + b = ${S}, ${UCLN('a','b')} = ${g} và ${BCNN('a','b')} = ${l}. Tìm b.`,ans:[g*y],exp:`a = ${g}x, b = ${g}y với x + y = ${x+y}, x · y = ${l} : ${g} = ${x*y}; ƯCLN(x, y) = 1, x < y nên x = ${x}, y = ${y}; b = ${g*y}.`};}}},
 {id:'h_frn',topic:'ps',level:'VD',unit:'',gen:()=>{for(;;){const mk=()=>{const k=ri(2,5),d=sel([4,6,8,9,10,12,14,15]);return [numFor(d)*k,d*k,d];};const [A,B,d1]=mk(),[C,D,d2]=mk();if(d1===d2||gcd(A,B)!==B/d1||gcd(C,D)!==D/d2)continue;const n=lcm(d1,d2);return{stem:`Tìm số tự nhiên n nhỏ nhất khác 0 sao cho n · ${FR(A,B)} và n · ${FR(C,D)} đều là số tự nhiên.`,ans:[n],exp:`${FR(A,B)} = ${FR(A*d1/B,d1)}, ${FR(C,D)} = ${FR(C*d2/D,d2)} (tối giản) nên n phải chia hết cho ${d1} và ${d2}: n = ${BCNN(d1,d2)} = ${n}.`};}}},
 {id:'h_rect',topic:'tt',level:'VD',unit:'',gen:()=>{for(;;){const [a,b,g]=pairG([2,3,4,5,6],40);if(a>40||b>40)continue;const l=lcm(a,b),m=(a/g)*(b/g),n=(l/a)*(l/b);return{stem:`Có nhiều tấm bìa hình chữ nhật giống nhau, kích thước ${a} cm × ${b} cm. Gọi m là số hình vuông nhiều nhất cắt được từ một tấm bìa (các hình vuông bằng nhau, cạnh lớn nhất, cạnh là số tự nhiên, không thừa bìa), n là số tấm bìa ít nhất để ghép thành một hình vuông (đặt cùng chiều, không cắt). Tính m + n.`,ans:[m+n],exp:`Cạnh hình vuông cắt ra: ${UCLN(a,b)} = ${g}, m = ${a/g} · ${b/g} = ${m}. Cạnh hình vuông ghép: ${BCNN(a,b)} = ${l}, n = ${l/a} · ${l/b} = ${n}. m + n = ${m+n}.`};}}},
 {id:'h_week',topic:'tt',level:'VD',unit:'ngày',mix:[8],gen:()=>{for(;;){const xs=shuffle([2,3,4,5,6,8,9,10]).slice(0,2),l=lcm(...xs);if(l%7===0||l>60)continue;return{stem:`Hôm nay là thứ Hai, An và Bình cùng đi bơi. An cứ ${xs[0]} ngày đi bơi một lần, Bình cứ ${xs[1]} ngày đi bơi một lần. Sau ít nhất bao nhiêu ngày nữa hai bạn lại cùng đi bơi vào một ngày thứ Hai?`,ans:[lcm(l,7)],exp:`Hai bạn cùng đi bơi sau một bội của ${BCNN(...xs)} = ${l} ngày; lại là thứ Hai khi số ngày là bội của 7. Số ngày ít nhất là ${BCNN(l,7)} = ${lcm(l,7)}.`};}}}
].map(q=>Object.assign({type:'sa'},q))};

const qsOK=u=>u.qs.every(q=>q.type!=='mc'||(q.opts.length===4&&new Set(q.opts.map(o=>o.t)).size===4));
const mx=(q,m)=>Object.assign(q,{mix:m});
const PISA=[
 ()=>{for(;;){const [p,q,l]=runP();const r=sel([60,72,80,90,100,120,150].filter(x=>x!==p&&x!==q));const L3=lA([p,q,r]);if(L3%60||L3>3600||L3===l)continue;const T=sel([60,90,120]),c=fl(T*60/L3);
   const u={title:'Chạy bộ quanh sân',ctx:`<p class="stem">Ba bạn An, Bình, Chi cùng xuất phát một lúc tại vạch xuất phát và chạy cùng chiều quanh sân vận động. Thời gian mỗi bạn chạy một vòng (không đổi) cho trong bảng.</p>${tbl(['Bạn','Thời gian chạy một vòng (giây)'],[['An',p],['Bình',q],['Chi',r]])}`,qs:[
    saq('Sau ít nhất bao nhiêu giây thì An và Bình lại cùng có mặt ở vạch xuất phát?',l,'giây',`${BCNN(p,q)} = ${l}.`,'tt','TH'),
    saq('Khi đó An đã chạy được bao nhiêu vòng?',l/p,'vòng',`${l} : ${p} = ${l/p}.`,'tt','TH'),
    saq('Sau ít nhất bao nhiêu phút thì cả ba bạn cùng có mặt ở vạch xuất phát?',L3/60,'phút',`${BCNN(p,q,r)} = ${L3} giây = ${L3/60} phút.`,'tt','VD'),
    mcq(`Nếu cả ba bạn chạy liên tục trong ${T} phút thì có bao nhiêu lần cả ba cùng có mặt ở vạch xuất phát (không kể lúc xuất phát)?`,''+c,[[''+(c+1),'Không tính lúc xuất phát.'],[''+fl(T*60/l),`Đây là số lần An và Bình cùng có mặt ở vạch xuất phát.`],[''+(c>1?c-1:c+2),`${T} phút = ${T*60} giây; đếm các bội của ${L3} không vượt quá ${T*60}.`]].filter((w,i,A)=>w[0]!==''+c&&A.findIndex(z=>z[0]===w[0])===i).concat([[''+(c+3),'Đếm sai số bội.']]).slice(0,3),`${T} phút = ${T*60} giây; ${T*60} = ${L3} · ${c} + ${T*60-L3*c} nên có ${c} lần.`,'tt','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const p=sel([6,8,10,12,15]),q=sel([4,5,6,8,9,10,12]);if(p===q||p%q===0||q%p===0)continue;const l=lcm(p,q),c=sel([24,30,36,40,45,48,60]),g=gcd(l,c);if(g<3||g===l||g===c)continue;
   const u={title:'Mua đồ dùng cho lớp',ctx:`<p class="stem">Cửa hàng bán bút bi theo hộp, mỗi hộp ${p} chiếc; bán vở theo lốc, mỗi lốc ${q} quyển (không bán lẻ). Cô chủ nhiệm muốn mua số bút bằng số vở và mua ít nhất có thể. Lớp đã có sẵn ${c} chiếc thước kẻ.</p>`,qs:[
    saq('Cô phải mua ít nhất bao nhiêu chiếc bút?',l,'chiếc',`Số bút là bội của ${p}, số vở là bội của ${q}, hai số bằng nhau nên ít nhất là ${BCNN(p,q)} = ${l}.`,'tt','TH'),
    saq('Khi đó cô mua bao nhiêu hộp bút?',l/p,'hộp',`${l} : ${p} = ${l/p}.`,'tt','TH'),
    mcq(`Cô chia hết ${l} bút, ${l} quyển vở và ${c} chiếc thước thành các phần quà như nhau (mỗi loại chia đều). Có thể chia nhiều nhất bao nhiêu phần quà?`,''+g,[[''+l,`${c} chiếc thước không chia đều được thành ${l} phần.`],[''+lcm(l,c),'Số phần quà là ước chung, không phải bội chung.'],[''+divs(g).slice(-2)[0],'Chia được nhưng chưa nhiều nhất.']],`${UCLN(l,l,c)} = ${UCLN(l,c)} = ${g}.`,'hai','VD'),
    saq('Khi chia nhiều phần quà nhất, mỗi phần có bao nhiêu chiếc thước?',c/g,'chiếc',`${c} : ${g} = ${c/g}.`,'tt','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const Y=ri(2000,2030),n=ccName(Y),Z=ri(1900,1990),k=sel([10,12,24,36]);const W=uniq([ccName(Z+1),ccName(Z+10),ccName(Z+12),ccName(Z-1),ccName(Z+6)]).filter(x=>x!==ccName(Z));const cnt=range(2001,2100).filter(y=>ccName(y)===n).length;
   const u={title:'Lịch can chi',ctx:`<p class="stem">Tên năm âm lịch ghép một can với một chi. Can và chi đều lần lượt lặp lại theo thứ tự dưới đây. Năm ${Y} là năm ${n}.</p><div class="figbox"><p><b>10 can:</b> ${CAN.join(', ')}.</p><p><b>12 chi:</b> ${CHI.join(', ')}.</p></div>`,qs:[
    saq('Sau ít nhất bao nhiêu năm thì tên năm âm lịch lặp lại?',60,'năm',`Can lặp lại sau 10 năm, chi lặp lại sau 12 năm; tên năm lặp lại sau ${BCNN(10,12)} = 60 năm.`,'tt','TH'),
    mcq(`Năm ${Y+k} là năm:`,ccName(Y+k),uniq([ccName(Y),ccName(Y+k+1),ccName(Y+k-1),ccName(Y+k+2)]).filter(x=>x!==ccName(Y+k)).slice(0,3).map(x=>[x,`Sau ${k} năm, can lùi lại ${k%10} vị trí... đếm lại: can tiến ${k%10}, chi tiến ${k%12} vị trí.`]),`Sau ${k} năm: can tiến ${k%10} vị trí (${k} = 10 · ${fl(k/10)} + ${k%10}), chi tiến ${k%12} vị trí (${k} = 12 · ${fl(k/12)} + ${k%12}).`,'tt','VD'),
    mx(mcq(`Năm ${Z} là năm:`,ccName(Z),W.slice(0,3).map(x=>[x,'Tính số dư khi chia khoảng cách năm cho 10 và cho 12 để biết can, chi.']),`${Y} − ${Z} = ${Y-Z}; ${Y-Z} = 10 · ${fl((Y-Z)/10)} + ${(Y-Z)%10}, ${Y-Z} = 12 · ${fl((Y-Z)/12)} + ${(Y-Z)%12}: lùi can ${(Y-Z)%10} vị trí, lùi chi ${(Y-Z)%12} vị trí từ ${n}.`,'tt','VD'),[8]),
    saq(`Trong thế kỉ XXI (từ năm 2001 đến năm 2100), có bao nhiêu năm tên là ${n}?`,cnt,'năm',`Các năm ${n} cách ${Y} một bội của 60: ${range(2001,2100).filter(y=>ccName(y)===n).join('; ')}.`,'tt','VD')]};
   u.qs[1].opts.slice(1).forEach(o=>{o.err=`Sau ${k} năm, can tiến ${k%10} vị trí, chi tiến ${k%12} vị trí.`;});if(qsOK(u))return u;}},
 ()=>{for(;;){const xs=shuffle([8,9,10,12,15,18,20]).slice(0,3),l=lA(xs);if(l<60||l>200)continue;const r=ri(2,Math.min(...xs)-1),k=ri(2,Math.max(2,fl(600/l))),N=k*l+r,lo=N-ri(1,l-r-1),hi=N+ri(1,l-r-1);if(lo<=0||hi-lo>=l)continue;const dd=[7,11,13].filter(z=>N%z);if(!dd.length)continue;const d=sel(dd);const m=sel([90,120,150,180,240,300]),g=gcd(N-r,m);if(g<3)continue;
   const u={title:'Ngày hội đọc sách',ctx:`<p class="stem">Thư viện trường nhận được từ ${lo} đến ${hi} cuốn truyện. Khi xếp thành các chồng ${xs[0]} cuốn, ${xs[1]} cuốn hay ${xs[2]} cuốn thì đều thừa ${r} cuốn.</p>`,qs:[
    saq(`Tìm ${BCNN(...xs)}.`,l,'',`${xs.map(x=>`${x} = ${FS(fac(x))}`).join('; ')}; BCNN = ${FS(fac(l))} = ${l}.`,'hai','TH'),
    saq('Thư viện nhận được bao nhiêu cuốn truyện?',N,'cuốn',`Số truyện − ${r} là bội chung của ${xs.join(', ')}, tức là bội của ${l}. Trong khoảng đã cho: ${N} − ${r} = ${N-r} = ${l} · ${k}.`,'tt','VD'),
    mx(saq(`Nếu xếp số truyện đó thành các chồng ${d} cuốn thì thừa bao nhiêu cuốn?`,N%d,'cuốn',`${N} = ${d} · ${fl(N/d)} + ${N%d}.`,'tt','VD'),[8]),
    mcq(`Thư viện để riêng ${r} cuốn thừa, rồi chia đều ${N-r} cuốn truyện còn lại và ${m} cuốn sách khoa học vào các tủ (mỗi loại chia đều). Chia được nhiều nhất bao nhiêu tủ?`,''+g,[[''+lcm(N-r,m),'Số tủ là ước chung, không phải bội chung.'],[''+gcd(N,m),gcd(N,m)!==g?`Phải dùng ${N-r} cuốn, không phải ${N} cuốn.`:''],[''+divs(g).slice(-2)[0],'Chia được nhưng chưa nhiều nhất.'],[''+l,`${l} chưa chắc là ước của ${m}.`]].filter((w,i,A)=>w[1]&&w[0]!==''+g&&A.findIndex(z=>z[0]===w[0])===i).slice(0,3),`${UCLN(N-r,m)} = ${g}.`,'hai','VD')]};if(qsOK(u))return u;}}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'hai',fig:'<div class="figbox"><p>12 = 2<sup>2</sup> · 3; 18 = 2 · 3<sup>2</sup></p><p>ƯCLN(12, 18) = 2 · 3 = 6; BCNN(12, 18) = 2<sup>2</sup> · 3<sup>2</sup> = 36</p><p>6 · 36 = 216 = 12 · 18</p></div>',extra:'ƯCLN: chung, mũ nhỏ nhất. BCNN: chung và riêng, mũ lớn nhất.'},
  {k:'ps',fig:`<div class="figbox"><p>${FR(5,6)} + ${FR(3,8)}: BCNN(6, 8) = 24</p><p>${FR(5,6)} = ${FR(20,24)}; ${FR(3,8)} = ${FR(9,24)}; tổng ${FR(29,24)}</p></div>`,extra:'Mẫu chung nhỏ nhất là BCNN của các mẫu.'},
  {k:'tim',fig:'<div class="figbox"><p>24 ⋮ x, 36 ⋮ x, x lớn nhất: x = ƯCLN(24, 36) = 12</p><p>x ⋮ 24, x ⋮ 36, x nhỏ nhất khác 0: x = BCNN(24, 36) = 72</p></div>',extra:'x sau dấu ⋮: ước chung. x trước dấu ⋮: bội chung.'},
  {k:'tt',fig:'<div class="figbox"><p>Chạy một vòng: 360 giây và 420 giây</p><p>Cùng ở chỗ xuất phát sau BCNN(360, 420) = 2 520 giây = 42 phút</p></div>',extra:'Lặp lại, "sau ít nhất": BCNN. Chia đều, "nhiều nhất": ƯCLN.'}
];

/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='lc3_seen';
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
  const mcSlots=[['hai',['NB']],['hai',['TH']],['ps',['NB','TH']],['tim',['NB','TH']],['tt',['NB','TH']],[null,['VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['hai','ps','tt'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=TKEYS.map(t=>pick(MC.filter(q=>q.topic===t&&q.level==='NB'),used));
  const sa=[pick(SA.filter(q=>q.topic==='hai'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='ps'&&q.level!=='VD'),used)];
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
