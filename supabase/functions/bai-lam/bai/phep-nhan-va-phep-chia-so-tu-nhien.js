// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ phep-nhan-va-phep-chia-so-tu-nhien/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "phep-nhan-va-phep-chia-so-tu-nhien";
export const TIEN_TO = "NC6-";

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
const nb=s=>s.replace(/ /g,'\u00a0');    // không ngắt dòng giữa các kí hiệu
const nbT=o=>Object.assign(o,{t:nb(o.t)});

/* ============ Ngẫu nhiên có hạt giống ============ */
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^=h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function sample(n,lo,hi){const all=[];for(let v=lo;v<=hi;v++)all.push(v);return shuffle(all).slice(0,n);}
const asc=a=>a.slice().sort((x,y)=>x-y);
const range=(lo,hi)=>{const o=[];for(let v=lo;v<=hi;v++)o.push(v);return o;};

function pickOpts(goodT,cands){
  const seen=new Set([goodT]),out=[];
  for(const c of cands){if(c&&!seen.has(c.t)){seen.add(c.t);out.push({t:c.t,err:c.err});}if(out.length===3)break;}
  return out;
}
const FB_MC=()=>({stem:'Trong phép chia có dư, số dư luôn:',opts:[{t:'nhỏ hơn số chia'},{t:'lớn hơn số chia',err:'Ví dụ 5 580 : 157 = 35 (dư 85), 85 < 157.'},{t:'bằng số chia',err:'Nếu số dư bằng số chia thì còn chia tiếp được 1 lần nữa.'},{t:'lớn hơn thương',err:'Số dư chỉ cần nhỏ hơn số chia, không so với thương.'}],ans:0,exp:'Với a = b · q + r thì 0 ≤ r < b: số dư bao giờ cũng nhỏ hơn số chia.'});
function tryGen(f){for(let n=0;n<100;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>String(o.t))).size===4)return r;}return FB_MC();}
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
function mixed(make){for(let n=0;n<60;n++){const items=make();if(!items)continue;const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}return null;}
const wrap=items=>items?items.map(i=>Object.assign(i,{t:nb(i.t)})):null;
const F=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const E=s=>nb(s);
const P10=k=>Math.pow(10,k);
const sum=a=>a.reduce((x,y)=>x+y,0);
const fl=Math.floor;
const NAMES=['Mai','Lan','An','Minh','Hà','Bình'];
/* nhân mà quên lùi tích riêng thứ hai sang trái */
const noShift=(a,b)=>a*(b%10)+a*fl(b/10);
const dropZero=n=>+String(n).replace(/0/g,'')||n+1;

/* ============ Hình: các chấm tròn xếp thành hàng ============ */
function dots(r,c1,c2){
  c2=c2||0;const c=c1+c2,g=16,gap=c2?14:0,W=c*g+gap+20,H=r*g+16;
  let s='';for(let i=0;i<r;i++)for(let j=0;j<c;j++){const x=10+j*g+(j>=c1?gap:0)+g/2,y=8+i*g+g/2;s+=`<circle cx="${x}" cy="${y}" r="5.2" style="fill:${j<c1?'var(--accent)':'var(--mark)'}"/>`;}
  if(c2){const x=10+c1*g+gap/2;s+=`<line x1="${x}" y1="4" x2="${x}" y2="${H-4}" style="stroke:var(--muted);stroke-width:1.2" stroke-dasharray="3 3"/>`;}
  const desc=c2?`Các chấm tròn xếp thành ${r} hàng; mỗi hàng có ${c1} chấm màu xanh bên trái và ${c2} chấm màu đỏ bên phải.`:`Các chấm tròn xếp thành ${r} hàng, mỗi hàng có ${c1} chấm.`;
  return `<div class="figbox" style="max-width:${Math.min(400,W*1.6+20)}px"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${desc}" style="width:100%;height:auto;display:block">${s}</svg></div>`;
}

/* ============ Bộ sinh câu nhiều lựa chọn ============ */
const NM_ERR={'Thừa số':'Thừa số là các số được nhân với nhau.','Tích':'Tích là kết quả của phép nhân.','Số bị chia':'Số bị chia là số đứng trước dấu ":".','Số chia':'Số chia là số đứng sau dấu ":".','Thương':'Thương là kết quả của phép chia.','Số dư':'Số dư là số ghi trong ngoặc "(dư …)".'};
/* --- Phép nhân (pn) --- */
function genPNames(){return tryGen(()=>{const a=ri(12,99),b=ri(3,40);if(a===b)return null;const c=a*b,k=ri(0,2),v=[a,b,c][k],r=k<2?'Thừa số':'Tích';
  const w=['Thừa số','Tích','Thương','Số bị chia'].filter(x=>x!==r);
  return {stem:`Trong phép nhân ${E(`${F(a)} · ${F(b)} = ${F(c)}`)}, số ${F(v)} được gọi là:`,opts:[{t:r}].concat(w.map(x=>({t:x,err:x==='Thương'||x==='Số bị chia'?'Đây là tên gọi trong phép chia.':NM_ERR[x]}))),ans:0,exp:`Trong phép nhân a · b = c: a, b là các thừa số, c là tích. Số ${F(v)} là ${r.toLowerCase()}.`};});}
function genMul(){return tryGen(()=>{const a=ri(102,999),b=ri(12,98);if(b%10===0)return null;const c=a*b;
  return {stem:`Kết quả của phép nhân ${E(`${F(a)} · ${b}`)} là:`,opts:[{t:F(c)}].concat(pickOpts(F(c),[{t:F(noShift(a,b)),err:'Tích riêng thứ hai phải viết lùi sang trái một cột so với tích riêng thứ nhất.'},{t:F(c+a),err:'Kiểm tra lại các tích riêng.'},{t:F(c-a),err:'Kiểm tra lại các tích riêng.'},{t:F(c+100),err:'Kiểm tra lại phép nhớ khi cộng các tích riêng.'}])),ans:0,exp:`Đặt tính: ${F(a)} · ${b%10} = ${F(a*(b%10))}; ${F(a)} · ${fl(b/10)} = ${F(a*fl(b/10))} (viết lùi sang trái một cột). Cộng lại được ${F(c)}.`};});}
function genRep(){return tryGen(()=>{const a=ri(3,99),n=ri(3,6);if(a===n||a===n+1)return null;
  return {stem:`Tổng ${E(Array(n).fill(a).join(' + '))} viết thành tích là:`,opts:[{t:`${a} · ${n}`},{t:`${a} + ${n}`,err:`Tổng có ${n} số hạng bằng ${a} nên viết thành phép nhân.`},{t:`${a} · ${n+1}`,err:`Đếm lại: có ${n} số hạng.`},{t:`${n} · ${n}`,err:`Mỗi số hạng bằng ${a}.`}].map(nbT),ans:0,exp:`a · b = a + a + … + a (b số hạng): tổng của ${n} số hạng bằng ${a} là ${a} · ${n} = ${a*n}.`};});}
function genDots(){return tryGen(()=>{const r=ri(2,6),c=ri(3,9);if(r===c)return null;
  return {stem:'Số chấm tròn trong hình dưới đây được tính bằng phép tính nào?',fig:dots(r,c),opts:[{t:`${r} · ${c}`}].concat(pickOpts(`${r} · ${c}`,[{t:`${r} + ${c}`,err:`Có ${r} hàng, mỗi hàng ${c} chấm: phải nhân.`},{t:`${r} · ${c+1}`,err:`Mỗi hàng có ${c} chấm.`},{t:`${r+1} · ${c}`,err:`Hình có ${r} hàng.`},{t:`${r-1} · ${c}`,err:`Hình có ${r} hàng.`}])).map(nbT),ans:0,exp:`Có ${r} hàng, mỗi hàng ${c} chấm: ${r} · ${c} = ${r*c} chấm.`};});}
const LT=['a','b','m','n','x','y'];
function genNotation(){return tryGen(()=>{const [p,q]=shuffle(LT).slice(0,2),k=ri(2,9),d1=ri(2,9),d2=ri(2,9);
  const good=sel([`${p} · ${q} = ${p}${q}`,`${k} · ${p} = ${k}${p}`]);
  return {stem:'Cách viết nào sau đây đúng?',opts:[{t:good},{t:`${d1} · ${d2} = ${d1}${d2}`,err:`Chỉ bỏ dấu nhân khi các thừa số đều bằng chữ hoặc chỉ có một thừa số bằng số; ${d1} · ${d2} = ${d1*d2}.`},{t:`${p} · ${q} = ${p} + ${q}`,err:'Tích khác tổng.'},{t:`${p} · 1 = 1`,err:`${p} · 1 = ${p}.`}].map(nbT),ans:0,exp:'Nếu các thừa số đều bằng chữ, hoặc chỉ có một thừa số bằng số, thì có thể không viết dấu nhân: a · b = ab; 2 · m = 2m.'};});}
function genLED(){return tryGen(()=>{const r=ri(12,40),b=ri(4,10),p=ri(60,120)*1000,n=r*b,T=n*p;
  return {stem:`Một trường thay bóng đèn LED cho ${r} phòng học, mỗi phòng ${b} bóng. Mỗi bóng giá ${F(p)} đồng. Nhà trường phải trả bao nhiêu tiền?`,opts:[{t:F(T)+' đồng'}].concat(pickOpts(F(T)+' đồng',[{t:F(r*p)+' đồng',err:`Đây là tiền cho ${r} bóng; cả trường có ${r} · ${b} = ${n} bóng.`},{t:F(n)+' đồng',err:`${n} là số bóng đèn, chưa nhân với giá.`},{t:F((r+b)*p)+' đồng',err:'Số bóng là tích, không phải tổng.'},{t:F(b*p)+' đồng',err:'Đây là tiền bóng của một phòng.'}])),ans:0,exp:`Số bóng: ${r} · ${b} = ${n}. Số tiền: ${n} · ${F(p)} = ${F(T)} (đồng).`};});}
function genSeats(){return tryGen(()=>{const r=ri(20,60),k=ri(8,15),s=sel([2,4]),T=r*k*s;
  return {stem:`Một trường có ${r} phòng học, mỗi phòng có ${k} bộ bàn ghế, mỗi bộ xếp được ${s} học sinh. Trường có thể nhận nhiều nhất bao nhiêu học sinh?`,opts:[{t:F(T)}].concat(pickOpts(F(T),[{t:F(r*k),err:'Đây là số bộ bàn ghế.'},{t:F(r*k+s),err:'Phải nhân với số học sinh mỗi bộ.'},{t:F(r+k+s),err:'Phải nhân, không cộng.'},{t:F(r*s),err:'Còn thiếu số bộ bàn ghế mỗi phòng.'}])),ans:0,exp:`${r} · ${k} · ${s} = ${F(T)} (học sinh).`};});}

/* --- Tính chất của phép nhân, tính nhẩm (tn) --- */
function genTProp(){return tryGen(()=>{const a=ri(3,30),b=ri(3,30),c=ri(3,30),k=ri(0,3);
  const st=[`${a} · ${b} = ${b} · ${a}`,`(${a} · ${b}) · ${c} = ${a} · (${b} · ${c})`,`${a} · (${b} + ${c}) = ${a} · ${b} + ${a} · ${c}`,`${a} · 1 = 1 · ${a} = ${a}`][k];
  const N=['Tính chất giao hoán','Tính chất kết hợp','Tính chất phân phối của phép nhân đối với phép cộng','Nhân với số 1'],r=N[k];
  const W={'Tính chất giao hoán':'Giao hoán là đổi chỗ các thừa số: ab = ba.','Tính chất kết hợp':'Kết hợp là thay đổi cách nhóm: (ab)c = a(bc).','Tính chất phân phối của phép nhân đối với phép cộng':'Phân phối: a(b + c) = ab + ac.','Nhân với số 1':'a · 1 = 1 · a = a.'};
  return {stem:`Đẳng thức ${E(st)} thể hiện:`,opts:[{t:r}].concat(N.filter(x=>x!==r).map(x=>({t:x,err:W[x]}))),ans:0,exp:W[r]};});}
function genZero(){return tryGen(()=>{const a=ri(100,9999),b=ri(12,99),pos=ri(0,2),ex=pos===0?`0 · ${F(a)} · ${b}`:pos===1?`${F(a)} · 0 · ${b}`:`${F(a)} · ${b} · 0`;
  return {stem:`Kết quả của phép tính ${E(ex)} là:`,opts:[{t:'0'},{t:F(a*b),err:'Nhân một số với 0 thì được 0.'},{t:F(a),err:'Nhân một số với 0 thì được 0.'},{t:F(a+b),err:'Nhân một số với 0 thì được 0.'}],ans:0,exp:'a · 0 = 0 · a = 0, nên tích có một thừa số bằng 0 thì bằng 0.'};});}
function genNham(){return tryGen(()=>{const x=ri(102,3999),k=sel([['25','4',100],['125','8',1000],['2','5',10],['4','25',100]]),ex=sel([`${F(x)} · ${k[0]} · ${k[1]}`,`${k[0]} · ${F(x)} · ${k[1]}`]),r=x*k[2];
  return {stem:`Tính nhẩm: ${E(ex)}. Kết quả là:`,opts:[{t:F(r)}].concat(pickOpts(F(r),[{t:F(x*k[2]*10),err:`${k[0]} · ${k[1]} = ${k[2]}, kiểm tra lại số chữ số 0.`},{t:F(k[2]===10?x*100:x*10),err:`${k[0]} · ${k[1]} = ${k[2]}.`},{t:F(x+k[2]),err:'Phải nhân với tích, không cộng.'},{t:F(r+k[2]),err:'Tính lại.'}])),ans:0,exp:`${k[0]} · ${k[1]} = ${k[2]}, nên ${ex} = ${F(x)} · ${k[2]} = ${F(r)}.`};});}
function genNham2(){return tryGen(()=>{const k=ri(2,39),f=sel([[4,25,100],[8,125,1000],[2,5,10]]),a=k*f[0],r=k*f[2];if(a===f[1])return null;
  return {stem:`Tính nhẩm: ${E(`${F(a)} · ${f[1]}`)}. Kết quả là:`,opts:[{t:F(r)}].concat(pickOpts(F(r),[{t:F(r*10),err:'Kiểm tra lại số chữ số 0.'},{t:F(k*f[2]/10),err:'Kiểm tra lại số chữ số 0.'},{t:F(r+f[1]),err:'Tính lại.'},{t:F(a+f[1]),err:'Đây là tổng, không phải tích.'}])),ans:0,exp:`${F(a)} · ${f[1]} = (${k} · ${f[0]}) · ${f[1]} = ${k} · (${f[0]} · ${f[1]}) = ${k} · ${f[2]} = ${F(r)}.`};});}
function genDist(){return tryGen(()=>{const a=ri(12,999),up=RNG()<.5,k=sel([10,100]),b=up?k+1:k-1;
  return {stem:`Cách tính nhẩm nào sau đây đúng với ${E(`${F(a)} · ${b}`)}?`,opts:[{t:up?`${F(a)} · ${k} + ${F(a)}`:`${F(a)} · ${k} − ${F(a)}`}].concat(up?[{t:`${F(a)} · ${k} + 1`,err:`${F(a)} · ${b} = ${F(a)} · (${k} + 1) = ${F(a)} · ${k} + ${F(a)} · 1.`},{t:`${F(a)} · ${k} − ${F(a)}`,err:`${b} = ${k} + 1 nên phải cộng.`},{t:`${F(a)} + ${k} + 1`,err:'Phải nhân, không cộng.'}]:[{t:`${F(a)} · ${k} − 1`,err:`${F(a)} · ${b} = ${F(a)} · (${k} − 1) = ${F(a)} · ${k} − ${F(a)} · 1.`},{t:`${F(a)} · ${k} + ${F(a)}`,err:`${b} = ${k} − 1 nên phải trừ.`},{t:`${F(a)} · ${b-1} + 1`,err:`Viết ${b} = ${k} − 1.`}]).map(nbT),ans:0,exp:`${F(a)} · ${b} = ${F(a)} · (${k} ${up?'+':'−'} 1) = ${F(a)} · ${k} ${up?'+':'−'} ${F(a)} = ${F(a*b)}.`};});}
function genDistSum(){return tryGen(()=>{const a=ri(12,99),b=ri(11,89),c=100-b,minus=RNG()<.4;let ex,r,B,C;
  if(minus){B=100+b;C=b;ex=`${a} · ${B} − ${a} · ${C}`;r=100*a;}else{ex=`${a} · ${b} + ${a} · ${c}`;r=100*a;B=b;C=c;}
  return {stem:`Tính một cách hợp lí: ${E(ex)}. Kết quả là:`,opts:[{t:F(r)}].concat(pickOpts(F(r),[{t:F(a+100),err:`${a} · (${B} ${minus?'−':'+'} ${C}) = ${a} · 100.`},{t:F(1000*a),err:'Kiểm tra lại số chữ số 0.'},{t:F(r+a),err:'Tính lại.'},{t:F(10*a),err:`${B} ${minus?'−':'+'} ${C} = 100.`}])),ans:0,exp:`${ex} = ${a} · (${B} ${minus?'−':'+'} ${C}) = ${a} · 100 = ${F(r)}.`};});}
function genFindC(){return tryGen(()=>{const a=ri(2,9),b=ri(2,9),c=ri(2,12);if(new Set([a,b,c]).size<3||a*b===c)return null;
  return {stem:`Tìm số tự nhiên c sao cho ${E(`(${a} · ${b}) · ${c} = ${a} · (${b} · c)`)}.`,opts:[{t:'c = '+c}].concat(pickOpts('c = '+c,[{t:'c = '+a*b*c,err:'Theo tính chất kết hợp, c bằng thừa số thứ ba ở vế trái.'},{t:'c = '+a,err:`Thay vào: ${a} · (${b} · ${a}) khác vế trái.`},{t:'c = '+b,err:`Thay vào: ${a} · (${b} · ${b}) khác vế trái.`},{t:'c = '+(a*b),err:`Thay vào để kiểm tra.`}])).map(nbT),ans:0,exp:`Tính chất kết hợp: (ab)c = a(bc), nên c = ${c}.`};});}

/* --- Phép chia hết và phép chia có dư (cd) --- */
function genDNames(){return tryGen(()=>{const b=ri(12,99),q=ri(12,99),rr=RNG()<.5?ri(1,b-1):0,a=b*q+rr;if(new Set([a,b,q,rr]).size<(rr?4:3)||q===b)return null;
  const parts=rr?[[a,'Số bị chia'],[b,'Số chia'],[q,'Thương'],[rr,'Số dư']]:[[a,'Số bị chia'],[b,'Số chia'],[q,'Thương']];const p=sel(parts);
  const w=['Số bị chia','Số chia','Thương','Số dư','Tích'].filter(x=>x!==p[1]&&(rr||x!=='Số dư')).slice(0,3);
  return {stem:`Trong phép chia ${E(`${F(a)} : ${b} = ${q}`+(rr?` (dư ${rr})`:''))}, số ${F(p[0])} được gọi là:`,opts:[{t:p[1]}].concat(w.map(x=>({t:x,err:x==='Tích'?'Tích là tên gọi trong phép nhân.':NM_ERR[x]}))),ans:0,exp:rr?'a : b = q (dư r): a là số bị chia, b là số chia, q là thương, r là số dư.':'a : b = q: a là số bị chia, b là số chia, q là thương.'};});}
function genDiv(){return tryGen(()=>{const b=ri(12,99),z=RNG()<.5,q=z?ri(1,9)*100+ri(1,9):ri(11,99),a=b*q;
  return {stem:`Kết quả của phép chia ${E(`${F(a)} : ${b}`)} là:`,opts:[{t:F(q)}].concat(pickOpts(F(q),[{t:F(dropZero(q)),err:'Mỗi lần hạ một chữ số xuống mà không chia được thì phải viết 0 vào thương.'},{t:F(q+1),err:`Thử lại: ${b} · ${q+1} = ${F(b*(q+1))}.`},{t:F(q-1),err:`Thử lại: ${b} · ${q-1} = ${F(b*(q-1))}.`},{t:F(q*10),err:'Thương có thừa một chữ số 0.'}])),ans:0,exp:`${F(a)} : ${b} = ${F(q)}. Thử lại: ${b} · ${F(q)} = ${F(a)}.`};});}
function genDivR(){return tryGen(()=>{const b=ri(12,199),q=ri(11,99),r=ri(1,b-1),a=b*q+r,o=(qq,rr)=>`Thương ${F(qq)}, số dư ${F(rr)}`;
  return {stem:`Phép chia ${E(`${F(a)} : ${b}`)} có thương và số dư là:`,opts:[{t:o(q,r)}].concat(pickOpts(o(q,r),[{t:o(q-1,r+b),err:`Số dư ${r+b} lớn hơn số chia ${b}: còn chia được nữa.`},{t:o(q,b-r),err:`Thử lại: ${b} · ${q} + ${b-r} khác ${F(a)}.`},{t:o(q+1,r),err:`Thử lại: ${b} · ${q+1} + ${r} khác ${F(a)}.`},{t:o(q,r+1),err:'Tính lại số dư.'}])),ans:0,exp:`${F(a)} = ${b} · ${q} + ${r} với ${r} < ${b}, nên ${F(a)} : ${b} = ${q} (dư ${r}).`};});}
function genRem(){return tryGen(()=>{const b=ri(3,12),r=ri(0,b-1),w=sample(3,b,b+6);
  return {stem:`Khi chia một số tự nhiên cho ${b}, số dư có thể là số nào sau đây?`,opts:[{t:''+r}].concat(w.map(x=>({t:''+x,err:`Số dư phải nhỏ hơn số chia ${b}.`}))),ans:0,exp:`Số dư r thoả mãn 0 ≤ r < ${b}: r có thể là 0; 1; …; ${b-1}.`};});}
function genABQR(){return tryGen(()=>{const b=ri(6,60),q=ri(5,99),r=ri(1,b-1),a=b*q+r;
  return {stem:`Một số tự nhiên chia cho ${b} được thương là ${q} và số dư là ${r}. Số đó là:`,opts:[{t:F(a)}].concat(pickOpts(F(a),[{t:F(b*q),err:`Còn phải cộng số dư ${r}.`},{t:F(b*q-r),err:`a = b · q + r: cộng số dư, không trừ.`},{t:F(b*(q+r)),err:'a = b · q + r.'},{t:F(q*r+b),err:'a = b · q + r.'}])),ans:0,exp:`a = b · q + r = ${b} · ${q} + ${r} = ${F(a)}.`};});}
function genExact(){return tryGen(()=>{const b=ri(6,40),ok=b*ri(11,99),w=[];while(w.length<3){const x=b*ri(11,99)+ri(1,b-1);if(!w.includes(x))w.push(x);}
  return {stem:`Phép chia nào sau đây là phép chia hết?`,opts:[{t:`${F(ok)} : ${b}`}].concat(w.map(x=>({t:`${F(x)} : ${b}`,err:`${F(x)} : ${b} = ${fl(x/b)} (dư ${x%b}).`}))).map(nbT),ans:0,exp:`${F(ok)} : ${b} = ${ok/b} (số dư bằng 0).`};});}
/* bài toán "ít nhất" (làm tròn lên) và "nhiều nhất" (làm tròn xuống) */
const CEIL=[
  (n,s)=>[`Phải dùng ít nhất bao nhiêu xe ô tô ${s} chỗ ngồi để chở hết ${F(n)} cổ động viên của một đội bóng?`,'xe'],
  (n,s)=>[`Một trường có ${F(n)} học sinh dự lễ tổng kết. Mỗi ghế băng có ${s} chỗ ngồi. Phải có ít nhất bao nhiêu ghế băng để tất cả học sinh đều có chỗ ngồi?`,'ghế'],
  (n,s)=>[`Một nhà máy cần chuyển ${F(n)} kiện hàng tới cửa hàng. Mỗi chuyến xe chở được ${s} kiện. Cần ít nhất bao nhiêu chuyến xe để chuyển hết số kiện hàng?`,'chuyến']];
const FLOOR=[
  (n,s,nm)=>[`Bạn ${nm} có ${F(n)} đồng. Mỗi quyển vở giá ${F(s)} đồng. Bạn ${nm} mua được nhiều nhất bao nhiêu quyển vở?`,'quyển'],
  (n,s)=>[`Có ${F(n)} cái bánh, xếp vào các hộp, mỗi hộp ${s} cái. Xếp được nhiều nhất bao nhiêu hộp đầy?`,'hộp'],
  (n,s)=>[`Một sợi dây dài ${F(n)} cm được cắt thành các đoạn dài ${s} cm. Cắt được nhiều nhất bao nhiêu đoạn như thế?`,'đoạn']];
function ceilCase(){for(;;){const k=ri(0,2),s=[sel([16,29,35,45]),sel([4,5,6]),sel([25,35,45])][k],n=k===1?ri(300,999):ri(150,1500);if(n%s===0)continue;const [st,u]=CEIL[k](n,s);return {st,u,n,s,q:fl(n/s),r:n%s};}}
function floorCase(){for(;;){const k=ri(0,2),s=[ri(5,15)*1000,sel([6,8,10,12]),sel([15,25,35,45])][k],n=k===0?ri(5,20)*10000+ri(1,9)*1000:ri(100,999);if(n%s===0)continue;const [st,u]=FLOOR[k](n,s,sel(NAMES));return {st,u,n,s,q:fl(n/s),r:n%s};}}
function genCeil(){return tryGen(()=>{const c=ceilCase();
  return {stem:c.st,opts:[{t:`${c.q+1} ${c.u}`}].concat(pickOpts(`${c.q+1} ${c.u}`,[{t:`${c.q} ${c.u}`,err:`Còn thừa ${c.r} chưa được xếp, phải thêm 1 ${c.u} nữa.`},{t:`${c.q+2} ${c.u}`,err:'Chỉ cần thêm 1 để chở phần dư.'},{t:`${c.r} ${c.u}`,err:'Đây là số dư của phép chia.'}])),ans:0,exp:`${F(c.n)} : ${c.s} = ${c.q} (dư ${c.r}). Còn thừa ${c.r} nên cần thêm 1: ${c.q} + 1 = ${c.q+1} (${c.u}).`};});}
function genFloor(){return tryGen(()=>{const c=floorCase();
  return {stem:c.st,opts:[{t:`${c.q} ${c.u}`}].concat(pickOpts(`${c.q} ${c.u}`,[{t:`${c.q+1} ${c.u}`,err:`Phần dư ${F(c.r)} không đủ thêm một ${c.u} nữa.`},{t:`${c.q-1} ${c.u}`,err:'Tính lại thương.'},{t:`${c.q+2} ${c.u}`,err:`${c.q+2} · ${F(c.s)} = ${F((c.q+2)*c.s)} > ${F(c.n)}.`}])),ans:0,exp:`${F(c.n)} : ${F(c.s)} = ${c.q} (dư ${F(c.r)}), nên được nhiều nhất ${c.q} ${c.u}.`};});}

/* --- Tìm số chưa biết (ud) --- */
const RULES=[['thừa số chưa biết','tích chia cho thừa số đã biết'],['số bị chia','thương nhân với số chia'],['số chia','số bị chia chia cho thương']];
function genRule(){const k=ri(0,2),r=RULES[k][1],w=RULES.filter((_,i)=>i!==k).map(x=>({t:x[1],err:`Đây là cách tìm ${x[0]}.`})).concat([{t:k===0?'tích nhân với thừa số đã biết':k===1?'thương chia cho số chia':'thương chia cho số bị chia',err:'Thử lại với một ví dụ cụ thể để kiểm tra.'}]);
  return {stem:`Muốn tìm ${RULES[k][0]}${k===0?'':' (trong phép chia hết)'}, ta lấy:`,opts:[{t:r}].concat(w),ans:0,exp:['Từ a · x = b suy ra x = b : a.','Từ x : a = b suy ra x = b · a.','Từ a : x = b suy ra x = a : b.'][k]};}
function genX1(){return tryGen(()=>{const a=ri(3,99),x=ri(3,200),b=a*x,f=RNG()<.5?`x · ${a} = ${F(b)}`:`${a} · x = ${F(b)}`;
  return {stem:`Tìm số tự nhiên x, biết ${E(f)}.`,opts:[{t:'x = '+F(x)}].concat(pickOpts('x = '+F(x),[{t:'x = '+F(a*b),err:'Muốn tìm thừa số chưa biết, lấy tích chia cho thừa số đã biết.'},{t:'x = '+F(b-a),err:'Phải chia, không trừ.'},{t:'x = '+F(x+1),err:'Thay x vào để thử lại.'},{t:'x = '+F(x*10),err:'Kiểm tra lại phép chia.'}])).map(nbT),ans:0,exp:`x = ${F(b)} : ${a} = ${F(x)}.`};});}
function genX2(){return tryGen(()=>{const a=ri(3,60),b=ri(3,200),div=RNG()<.5;
  if(div){const x=a*b;return {stem:`Tìm số tự nhiên x, biết ${E(`x : ${a} = ${b}`)}.`,opts:[{t:'x = '+F(x)}].concat(pickOpts('x = '+F(x),[{t:'x = '+F(b+a),err:'Muốn tìm số bị chia, lấy thương nhân với số chia.'},{t:'x = '+F(a*(b+1)),err:'Tính lại phép nhân.'},{t:'x = '+F(b),err:`Thay vào: ${b} : ${a} khác ${b}.`},{t:'x = '+F(x*10),err:'Tính lại.'}])).map(nbT),ans:0,exp:`x = ${b} · ${a} = ${F(x)}.`};}
  const A=a*b;return {stem:`Tìm số tự nhiên x, biết ${E(`${F(A)} : x = ${b}`)}.`,opts:[{t:'x = '+F(a)}].concat(pickOpts('x = '+F(a),[{t:'x = '+F(A*b),err:'Muốn tìm số chia, lấy số bị chia chia cho thương.'},{t:'x = '+F(A-b),err:'Phải chia, không trừ.'},{t:'x = '+F(a+1),err:'Thay x vào để thử lại.'},{t:'x = '+F(b),err:`Thay vào: ${F(A)} : ${b} = ${a}, khác ${b}.`}])).map(nbT),ans:0,exp:`x = ${F(A)} : ${b} = ${a}.`};});}
function genX0(){return tryGen(()=>{const a=ri(2,999);return {stem:`Tìm số tự nhiên x, biết ${E(`${F(a)} · x = 0`)}.`,opts:[{t:'x = 0'},{t:'x = '+F(a),err:`${F(a)} · ${F(a)} khác 0.`},{t:'x = 1',err:`${F(a)} · 1 = ${F(a)}.`},{t:'Không có số x nào',err:`${F(a)} · 0 = 0 nên x = 0 thoả mãn.`}].map(nbT),ans:0,exp:`${F(a)} khác 0, mà tích bằng 0 nên x = 0.`};});}
/* phương trình nhiều bước */
function linEq(){for(;;){const k=ri(0,4),x=ri(3,60),a=ri(2,12),b=ri(2,40);let st,X,w;
  if(k===0){const c=a*x+b;X=x;st=`${a} · x + ${b} = ${F(c)}`;w=[[(c+b)/a,`Trước hết ${a} · x = ${F(c)} − ${b}.`],[c-b-a,'Muốn tìm thừa số, lấy tích chia cho thừa số đã biết.'],[c-b,`Đây là giá trị của ${a} · x.`]];}
  else if(k===1){X=x+b;st=`${a} · (x − ${b}) = ${F(a*x)}`;w=[[x,`Đây là giá trị của x − ${b}.`],[a*x+b,`x − ${b} = ${F(a*x)} : ${a} = ${x}.`],[a*x-b,`Trước hết x − ${b} = ${F(a*x)} : ${a}.`]];}
  else if(k===2){if(x<=b)continue;const c=x-b;X=a*x;st=`x : ${a} − ${b} = ${c}`;w=[[x,`Đây là giá trị của x : ${a}.`],[a*c,`x : ${a} = ${c} + ${b} = ${x}.`],[a*(c-b),`Trước hết x : ${a} = ${c} + ${b}.`]];}
  else if(k===3){X=a*x-b;if(X<1)continue;st=`(x + ${b}) : ${a} = ${x}`;w=[[a*x,`Đây là giá trị của x + ${b}.`],[a*x+b,`x + ${b} = ${F(a*x)} nên x = ${F(a*x)} − ${b}.`],[x-b,`Trước hết x + ${b} = ${x} · ${a}.`]];}
  else {const t=ri(5,200),A=a*x+t;X=x;st=`${F(A)} − ${a} · x = ${t}`;w=[[(A+t)/a,'Muốn tìm số trừ, lấy số bị trừ trừ đi hiệu.'],[A-t,`Đây là giá trị của ${a} · x.`],[x+1,'Thay x vào để thử lại.']];}
  w=w.filter(z=>Number.isInteger(z[0])&&z[0]>=0&&z[0]!==X);if(w.length<3||new Set(w.map(z=>z[0])).size<3)continue;return {st,x:X,w};}}
function genX3(){return tryGen(()=>{const q=linEq(),w=q.w;
  return {stem:`Tìm số tự nhiên x, biết ${E(q.st)}.`,opts:[{t:'x = '+F(q.x)}].concat(w.slice(0,3).map(z=>({t:'x = '+F(z[0]),err:z[1]}))).map(nbT),ans:0,exp:'Tìm từng bước từ ngoài vào trong, rồi thay x vào để thử lại. Kết quả x = '+F(q.x)+'.'};});}
function genXword(){return tryGen(()=>{for(;;){const x=ri(2,40),m=ri(2,9),k=ri(1,40),d=ri(2,9);if((x*m+k)%d)continue;const c=(x*m+k)/d;
  return {stem:`Tìm số tự nhiên x, biết rằng nếu nhân x với ${m} rồi cộng thêm ${k}, sau đó chia cho ${d} thì được ${c}.`,opts:[{t:F(x)}].concat(pickOpts(F(x),[{t:F(c*d+k),err:`(x · ${m} + ${k}) = ${c} · ${d} = ${c*d}, còn phải trừ ${k} rồi chia cho ${m}.`},{t:F((c*d-k)*m),err:`x · ${m} = ${c*d-k} nên x = ${c*d-k} : ${m}.`},{t:F(c*d-k),err:`Đây là giá trị của x · ${m}.`},{t:F(x+1),err:'Thay x vào để thử lại.'}])),ans:0,exp:`(x · ${m} + ${k}) : ${d} = ${c} ⇒ x · ${m} + ${k} = ${c*d} ⇒ x · ${m} = ${c*d-k} ⇒ x = ${x}.`};}});}

/* ============ Ngân hàng nhiều lựa chọn ============ */
const MC=[];
const addMC=(id,topic,level,gen)=>MC.push({id,type:'mc',topic,level,gen});
['a','b'].forEach(x=>{
  addMC('g_pnames_'+x,'pn','NB',genPNames);
  addMC('g_mul_'+x,'pn','NB',genMul);
  addMC('g_rep_'+x,'pn','NB',genRep);
  addMC('g_dots_'+x,'pn','TH',genDots);
  addMC('g_seats_'+x,'pn','TH',genSeats);
  addMC('g_led_'+x,'pn','VD',genLED);
  addMC('g_tprop_'+x,'tn','NB',genTProp);
  addMC('g_zero_'+x,'tn','NB',genZero);
  addMC('g_nham_'+x,'tn','TH',genNham);
  addMC('g_nham2_'+x,'tn','TH',genNham2);
  addMC('g_dist_'+x,'tn','VD',genDist);
  addMC('g_dsum_'+x,'tn','VD',genDistSum);
  addMC('g_dnames_'+x,'cd','NB',genDNames);
  addMC('g_div_'+x,'cd','NB',genDiv);
  addMC('g_rem_'+x,'cd','NB',genRem);
  addMC('g_divr_'+x,'cd','TH',genDivR);
  addMC('g_abqr_'+x,'cd','TH',genABQR);
  addMC('g_ceil_'+x,'cd','VD',genCeil);
  addMC('g_rule_'+x,'ud','NB',genRule);
  addMC('g_x1_'+x,'ud','NB',genX1);
  addMC('g_x2_'+x,'ud','TH',genX2);
  addMC('g_x3_'+x,'ud','VD',genX3);
  addMC('g_xword_'+x,'ud','VD',genXword);
});
addMC('g_notation','pn','TH',genNotation);
addMC('g_findc','tn','TH',genFindC);
addMC('g_exact','cd','TH',genExact);
addMC('g_floor_a','cd','VD',genFloor);addMC('g_floor_b','cd','VD',genFloor);addMC('g_led_c','pn','VD',genLED);
addMC('g_x0','ud','TH',genX0);
addMC('g_remlt','cd','NB',FB_MC);

/* ============ Câu đúng sai ============ */
function tfStatic(pool,stem){return ()=>{const items=mixed(()=>shuffle(pool).slice(0,4).map(p=>sel(p)));return {stem,items:wrap(items)};};}
const POOL_A=[
  [IT('Trong phép nhân a · b = c, a và b gọi là các thừa số, c gọi là tích.',true,'pn','NB','Tên gọi các thành phần của phép nhân.'),IT('Trong phép nhân a · b = c, a và b gọi là các tích, c gọi là thừa số.',false,'pn','NB','a, b là thừa số; c là tích.')],
  [IT('Với mọi số tự nhiên a, ta có a · 1 = a.',true,'tn','NB','Nhân với 1 được chính số đó.'),IT('Với mọi số tự nhiên a, ta có a · 1 = 1.',false,'tn','NB','a · 1 = a.')],
  [IT('Với mọi số tự nhiên a, ta có a · 0 = 0.',true,'tn','NB','Nhân với 0 được 0.'),IT('Với mọi số tự nhiên a, ta có a · 0 = a.',false,'tn','NB','a · 0 = 0.')],
  [IT('Khi đổi chỗ các thừa số trong một tích thì tích không đổi.',true,'tn','NB','Tính chất giao hoán: ab = ba.'),IT('Khi đổi chỗ các thừa số trong một tích thì tích thay đổi.',false,'tn','NB','Tính chất giao hoán: ab = ba.')],
  [IT('a · (b + c) = ab + ac',true,'tn','NB','Tính chất phân phối của phép nhân đối với phép cộng.'),IT('a · (b + c) = ab + c',false,'tn','NB','Phải nhân a với cả b và c.')],
  [IT('Tích 4 · x có thể viết gọn là 4x.',true,'pn','NB','Chỉ có một thừa số bằng số thì có thể bỏ dấu nhân.'),IT('Tích 4 · 5 có thể viết gọn là 45.',false,'pn','NB','4 · 5 = 20; chỉ bỏ dấu nhân khi có thừa số bằng chữ.')]];
const POOL_B=[
  [IT('Trong phép chia có dư, số dư bao giờ cũng nhỏ hơn số chia.',true,'cd','NB','0 ≤ r < b.'),IT('Trong phép chia có dư, số dư có thể lớn hơn số chia.',false,'cd','NB','Số dư luôn nhỏ hơn số chia.')],
  [IT('Nếu a = b · q + r với 0 ≤ r < b và r = 0 thì ta có phép chia hết.',true,'cd','NB','Số dư bằng 0 là phép chia hết.'),IT('Nếu a = b · q + r với 0 < r < b thì ta có phép chia hết.',false,'cd','NB','r khác 0 là phép chia có dư.')],
  [IT('Trong phép chia a : b, số chia b phải khác 0.',true,'cd','NB','Ta chỉ chia cho số khác 0.'),IT('Trong phép chia a : b, số chia b có thể bằng 0.',false,'cd','NB','Số chia phải khác 0.')],
  [IT('Trong phép chia a : b = q (dư r), a là số bị chia, b là số chia, q là thương, r là số dư.',true,'cd','NB','Tên gọi các thành phần của phép chia có dư.'),IT('Trong phép chia a : b = q (dư r), q là số chia, b là thương.',false,'cd','NB','b là số chia, q là thương.')],
  [IT('Khi chia một số tự nhiên cho 5, số dư có thể là 0; 1; 2; 3; 4.',true,'cd','NB','Số dư nhỏ hơn 5.'),IT('Khi chia một số tự nhiên cho 5, số dư có thể là 5.',false,'cd','NB','Số dư phải nhỏ hơn 5.')]];
const eqIT=(L,R,ok,topic,level,why)=>IT(`${L} = ${R}`,ok,topic,level,why);
function tfMulCalc(level){return ()=>{const items=mixed(()=>{const o=[];for(let i=0;i<4;i++){const a=level==='NB'?ri(12,999):ri(102,9999),b=level==='NB'?ri(2,9):ri(12,98),r=a*b,v=RNG()<.5,c=[r+10,r-10,r+a,b>9?noShift(a,b):r+100].filter(z=>z!==r&&z>=0),sh=v?r:sel(c);
  o.push(eqIT(`${F(a)} · ${b}`,F(sh),sh===r,'pn',level,`${F(a)} · ${b} = ${F(r)}.`));}return o;});return {stem:'Xét các phép tính sau:',items:wrap(items)};};}
function tfDivCalc(level){return ()=>{const items=mixed(()=>{const o=[];for(let i=0;i<4;i++){const b=level==='NB'?ri(2,9):ri(12,99),q=ri(11,299),r=RNG()<.5?0:ri(1,b-1),a=b*q+r,v=RNG()<.5;let t;
  if(v)t=r?`${F(a)} : ${b} = ${q} (dư ${r})`:`${F(a)} : ${b} = ${q}`;else t=sel(r?[`${F(a)} : ${b} = ${q}`,`${F(a)} : ${b} = ${q-1} (dư ${r+b})`,`${F(a)} : ${b} = ${q+1} (dư ${r})`]:[`${F(a)} : ${b} = ${q+1}`,`${F(a)} : ${b} = ${q-1} (dư ${b})`,`${F(a)} : ${b} = ${q} (dư 1)`]);
  o.push(IT(t,v,'cd',level,r?`${F(a)} = ${b} · ${q} + ${r}, nên ${F(a)} : ${b} = ${q} (dư ${r}).`:`${b} · ${q} = ${F(a)}, nên ${F(a)} : ${b} = ${q}.`));}return o;});return {stem:'Xét các phép chia sau:',items:wrap(items)};};}
function tfProp(){const items=mixed(()=>{const a=ri(3,30),b=ri(3,30),c=ri(3,30),R=()=>RNG()<.5,o=[];if(a===b||b===c)return null;
  {const v=R();o.push(eqIT(`${a} · ${b}`,v?`${b} · ${a}`:`${b} · ${a+1}`,v,'tn','TH',`Giao hoán: ${a} · ${b} = ${b} · ${a}.`));}
  {const v=R();o.push(eqIT(`(${a} · ${b}) · ${c}`,v?`${a} · (${b} · ${c})`:`${a} · (${b} + ${c})`,v,'tn','TH','Kết hợp: (ab)c = a(bc).'));}
  {const v=R();o.push(eqIT(`${a} · (${b} + ${c})`,v?`${a} · ${b} + ${a} · ${c}`:`${a} · ${b} + ${c}`,v,'tn','TH',`Phân phối: ${a} · (${b} + ${c}) = ${a} · ${b} + ${a} · ${c}.`));}
  {const v=R();o.push(eqIT(`${a} · (${b} + ${c})`,v?`${a*(b+c)}`:`${a*b+c}`,v,'tn','TH',`${a} · ${b+c} = ${a*(b+c)}.`));}
  return o;});return {stem:'Xét các đẳng thức sau:',items:wrap(items)};}
function tfDots(){const r=ri(2,5),c1=ri(2,6),c2=ri(2,5),c=c1+c2;
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`Hình có tất cả ${v?r*c:r*c+c} chấm tròn.`,v,'pn','TH',`${r} · ${c} = ${r*c}.`));}
    {const v=R();o.push(IT(v?`Số chấm tròn bằng ${r} · ${c1} + ${r} · ${c2}.`:`Số chấm tròn bằng ${r} · ${c1} + ${c2}.`,v,'tn','TH',`Chấm xanh: ${r} · ${c1}; chấm đỏ: ${r} · ${c2}.`));}
    {const v=R();o.push(IT(`Số chấm tròn màu đỏ là ${v?r*c2:r*c2+r}.`,v,'pn','TH',`${r} · ${c2} = ${r*c2}.`));}
    {const v=R();o.push(IT(v?`Hình minh hoạ đẳng thức ${r} · (${c1} + ${c2}) = ${r} · ${c1} + ${r} · ${c2}.`:`Hình minh hoạ đẳng thức ${r} · (${c1} + ${c2}) = ${r} · ${c1} + ${c2}.`,v,'tn','TH','Tính chất phân phối của phép nhân đối với phép cộng.'));}return o;});
  return {stem:'Cho hình dưới đây. Xét các phát biểu sau:',fig:dots(r,c1,c2),items:wrap(items)};}
function tfFind(level){return ()=>{const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
  {const a=ri(3,40),x=ri(3,90),v=R();o.push(IT(`Nếu ${a} · x = ${F(a*x)} thì x = ${F(v?x:a*x-a)}.`,v,'ud',level,`x = ${F(a*x)} : ${a} = ${x}.`));}
  {const a=ri(3,40),b=ri(3,90),v=R();o.push(IT(`Nếu x : ${a} = ${b} thì x = ${F(v?a*b:a+b)}.`,v,'ud',level,`x = ${b} · ${a} = ${F(a*b)}.`));}
  {const a=ri(3,40),b=ri(3,40),v=R();o.push(IT(`Nếu ${F(a*b)} : x = ${b} thì x = ${F(v?a:a*b*b)}.`,v,'ud',level,`x = ${F(a*b)} : ${b} = ${a}.`));}
  if(level==='TH'){const q=linEq(),w=q.w.filter(z=>Number.isInteger(z[0])&&z[0]>=0&&z[0]!==q.x),v=R()||!w.length;o.push(IT(`Nếu ${q.st} thì x = ${F(v?q.x:w[0][0])}.`,v,'ud',level,`x = ${F(q.x)}.`));}
  else {const v=R();o.push(IT(v?'Muốn tìm số bị chia, ta lấy thương nhân với số chia.':'Muốn tìm số bị chia, ta lấy thương chia cho số chia.',v,'ud',level,'Số bị chia = thương · số chia.'));}
  return o;});return {stem:'Xét các khẳng định sau:',items:wrap(items)};};}
function tfShop(){const nm=sel(NAMES),nv=ri(5,12),pv=ri(6,12)*1000,nb2=ri(3,10),pb=ri(3,8)*1000,T=nv*pv+nb2*pb,M=(fl(T/50000)+1)*50000+sel([0,50000]),r=M-T;
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`Tiền mua vở là ${F(v?nv*pv:nv+pv)} đồng.`,v,'pn','VD',`${nv} · ${F(pv)} = ${F(nv*pv)}.`));}
    {const v=R();o.push(IT(`${nm} phải trả tất cả ${F(v?T:nv*pv+pb)} đồng.`,v,'pn','VD',`${F(nv*pv)} + ${F(nb2*pb)} = ${F(T)}.`));}
    {const v=R();o.push(IT(`${nm} được trả lại ${F(v?r:r+pb)} đồng.`,v,'pn','VD',`${F(M)} − ${F(T)} = ${F(r)}.`));}
    {const k=fl(r/pv),v=R();o.push(IT(`Với tiền được trả lại, ${nm} mua thêm được nhiều nhất ${v?k:k+1} quyển vở cùng loại.`,v,'cd','VD',`${F(r)} : ${F(pv)} = ${k} (dư ${F(r%pv)}).`));}return o;});
  return {stem:`${nm} mua ${nv} quyển vở, mỗi quyển giá ${F(pv)} đồng, và ${nb2} chiếc bút bi, mỗi chiếc giá ${F(pb)} đồng. ${nm} đưa cho cô bán hàng ${F(M)} đồng. Xét các phát biểu sau:`,items:wrap(items)};}
function tfBus(){const n=ri(150,600),s=sel([29,35,45]),cost=ri(15,30)*100000;if(n%s===0)return tfBus();const q=fl(n/s),r=n%s,buses=q+1;
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`${F(n)} : ${s} = ${q} (dư ${v?r:r+1})`,v,'cd','VD',`${s} · ${q} + ${r} = ${F(n)}.`));}
    {const v=R();o.push(IT(`Cần ít nhất ${v?buses:q} xe để chở hết học sinh.`,v,'ud','VD',`Còn thừa ${r} học sinh nên cần thêm 1 xe: ${buses} xe.`));}
    {const v=R();o.push(IT(`Tiền thuê xe là ${F(v?buses*cost:q*cost)} đồng.`,v,'pn','VD',`${buses} · ${F(cost)} = ${F(buses*cost)}.`));}
    {const v=R(),e=buses*s-n;o.push(IT(`Khi đi đủ số xe ít nhất, còn ${v?e:r} chỗ ngồi trống.`,v||e===r,'ud','VD',`${buses} · ${s} − ${F(n)} = ${e}.`));}return o;});
  return {stem:`Trường tổ chức cho ${F(n)} học sinh đi tham quan bằng xe ô tô ${s} chỗ (mỗi học sinh một chỗ). Giá thuê mỗi xe là ${F(cost)} đồng. Xét các phát biểu sau:`,items:wrap(items)};}
function tfNhamVD(){const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
  {const a=ri(12,999),v=R();o.push(IT(`${F(a)} · 101 = ${F(v?a*101:a*100+1)}`,v,'tn','VD',`${F(a)} · 101 = ${F(a)} · 100 + ${F(a)} = ${F(a*101)}.`));}
  {const a=ri(12,99),v=R();o.push(IT(`${a} · 99 = ${F(v?a*99:a*100-1)}`,v,'tn','VD',`${a} · 99 = ${a} · 100 − ${a} = ${F(a*99)}.`));}
  {const x=ri(102,999),v=R();o.push(IT(`${F(x)} · 125 · 8 = ${F(v?x*1000:x*100)}`,v,'tn','VD',`125 · 8 = 1 000.`));}
  {const a=ri(12,99),b=ri(11,89),v=R();o.push(IT(`${a} · ${b} + ${a} · ${100-b} = ${F(v?a*100:a*10)}`,v,'tn','VD',`${a} · (${b} + ${100-b}) = ${a} · 100.`));}
  return o;});return {stem:'Xét các đẳng thức sau:',items:wrap(items)};}
const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
['a','b'].forEach(x=>{
  addTF('tf_a_nb_'+x,'tn','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));
  addTF('tf_b_nb_'+x,'cd','NB',tfStatic(POOL_B,'Xét các phát biểu sau:'));
  addTF('tf_mul_nb_'+x,'pn','NB',tfMulCalc('NB'));
  addTF('tf_prop_th_'+x,'tn','TH',tfProp);
  addTF('tf_div_th_'+x,'cd','TH',tfDivCalc('TH'));
  addTF('tf_find_th_'+x,'ud','TH',tfFind('TH'));
  addTF('tf_bus_'+x,'ud','VD',tfBus);
});
addTF('tf_div_nb','cd','NB',tfDivCalc('NB'));
addTF('tf_find_nb','ud','NB',tfFind('NB'));
addTF('tf_mul_th','pn','TH',tfMulCalc('TH'));
addTF('tf_dots_th','pn','TH',tfDots);
addTF('tf_shop_vd_a','pn','VD',tfShop);addTF('tf_shop_vd_b','pn','VD',tfShop);
addTF('tf_nham_vd','tn','VD',tfNhamVD);

/* ============ Câu trả lời ngắn ============ */
const SA=[
 {id:'s_pn_nb',topic:'pn',level:'NB',unit:'',gen:()=>{const a=ri(102,999),b=ri(12,99);return{stem:`Tính: ${E(`${F(a)} · ${b}`)}.`,ans:[a*b],exp:`${F(a)} · ${b} = ${F(a*b)}.`};}},
 {id:'s_pn_nb2',topic:'pn',level:'NB',unit:'chấm',gen:()=>{const r=ri(3,7),c=ri(3,9);return{stem:'Hình dưới đây có bao nhiêu chấm tròn?',fig:dots(r,c),ans:[r*c],exp:`${r} hàng, mỗi hàng ${c} chấm: ${r} · ${c} = ${r*c}.`};}},
 {id:'s_pn_th',topic:'pn',level:'TH',unit:'',gen:()=>{const a=ri(102,1999),b=ri(102,399);return{stem:`Tính: ${E(`${F(a)} · ${b}`)}.`,ans:[a*b],exp:`${F(a)} · ${b} = ${F(a*b)}.`};}},
 {id:'s_pn_vd',topic:'pn',level:'VD',unit:'km',gen:()=>{const m=ri(6,9),s=ri(1,59);return{stem:`Ánh sáng đi từ một ngôi sao đến một trạm quan sát hết ${m} phút ${s} giây. Mỗi giây ánh sáng đi được khoảng 300 000 km. Tính quãng đường đó (theo km).`,ans:[(60*m+s)*300000],exp:`${m} phút ${s} giây = 60 · ${m} + ${s} = ${60*m+s} giây. Quãng đường: ${60*m+s} · 300 000 = ${F((60*m+s)*300000)} (km).`};}},
 {id:'s_tn_nb',topic:'tn',level:'NB',unit:'',gen:()=>{const a=ri(102,9999),k=sel([10,100,1000]);return{stem:`Tính nhẩm: ${E(`${F(a)} · ${F(k)}`)}.`,ans:[a*k],exp:`Nhân với ${F(k)} thì viết thêm ${String(k).length-1} chữ số 0: ${F(a*k)}.`};}},
 {id:'s_tn_th',topic:'tn',level:'TH',unit:'',gen:()=>{const k=ri(2,39),f=sel([[4,25,100],[8,125,1000]]);return{stem:`Tính nhẩm: ${E(`${F(k*f[0])} · ${f[1]}`)}.`,ans:[k*f[2]],exp:`(${k} · ${f[0]}) · ${f[1]} = ${k} · ${f[2]} = ${F(k*f[2])}.`};}},
 {id:'s_tn_th2',topic:'tn',level:'TH',unit:'',gen:()=>{const a=ri(12,99),b=ri(11,89);return{stem:`Tính một cách hợp lí: ${E(`${a} · ${b} + ${a} · ${100-b}`)}.`,ans:[100*a],exp:`${a} · (${b} + ${100-b}) = ${a} · 100 = ${F(100*a)}.`};}},
 {id:'s_tn_vd',topic:'tn',level:'VD',unit:'',gen:()=>{const a=ri(12,999),b=sel([99,101,999,1001]);return{stem:`Tính nhẩm: ${E(`${F(a)} · ${F(b)}`)}.`,ans:[a*b],exp:`${F(a)} · ${F(b)} = ${F(a)} · ${F(b>500?1000:100)} ${b%10===1?'+':'−'} ${F(a)} = ${F(a*b)}.`};}},
 {id:'s_cd_nb',topic:'cd',level:'NB',unit:'',gen:()=>{const b=ri(12,99),q=ri(11,199);return{stem:`Tính: ${E(`${F(b*q)} : ${b}`)}.`,ans:[q],exp:`${F(b*q)} : ${b} = ${q}.`};}},
 {id:'s_cd_th',topic:'cd',level:'TH',unit:'',gen:()=>{const b=ri(12,99),q=ri(11,199),r=ri(1,b-1);return{stem:`Tìm số dư của phép chia ${E(`${F(b*q+r)} : ${b}`)}.`,ans:[r],exp:`${F(b*q+r)} = ${b} · ${q} + ${r}.`};}},
 {id:'s_cd_th2',topic:'cd',level:'TH',unit:'',gen:()=>{const b=ri(6,60),q=ri(5,99),r=ri(1,b-1);return{stem:`Tìm số tự nhiên a, biết a chia cho ${b} được thương là ${q} và số dư là ${r}.`,ans:[b*q+r],exp:`a = ${b} · ${q} + ${r} = ${F(b*q+r)}.`};}},
 {id:'s_cd_vd',topic:'cd',level:'VD',unit:'',gen:()=>{const b=ri(6,40),r=ri(1,b-1),big=RNG()<.5;let a=big?999:100;if(big){while(a%b!==r)a--;}else{while(a%b!==r)a++;}return{stem:`Tìm số tự nhiên ${big?'lớn':'nhỏ'} nhất có ba chữ số mà chia cho ${b} thì dư ${r}.`,ans:[a],exp:`Số đó có dạng ${b} · q + ${r}. Thử ${big?'từ 999 trở xuống':'từ 100 trở lên'}: ${a} = ${b} · ${(a-r)/b} + ${r}.`};}},
 {id:'s_ud_nb',topic:'ud',level:'NB',unit:'',gen:()=>{const a=ri(3,99),x=ri(3,200);return{stem:`Tìm số tự nhiên x, biết ${E(`${a} · x = ${F(a*x)}`)}.`,ans:[x],exp:`x = ${F(a*x)} : ${a} = ${x}.`};}},
 {id:'s_ud_th',topic:'ud',level:'TH',unit:'',gen:()=>{const a=ri(3,60),b=ri(3,200);return{stem:`Tìm số tự nhiên x, biết ${E(`x : ${a} = ${b}`)}.`,ans:[a*b],exp:`x = ${b} · ${a} = ${F(a*b)}.`};}},
 {id:'s_ud_vd',topic:'ud',level:'VD',unit:'',gen:()=>{const q=linEq();return{stem:`Tìm số tự nhiên x, biết ${E(q.st)}.`,ans:[q.x],exp:`Tìm từng bước từ ngoài vào trong: x = ${F(q.x)}.`};}},
 {id:'s_ud_vd2',topic:'ud',level:'VD',unit:'',gen:()=>{const c=ceilCase();return{stem:c.st,ans:[c.q+1],exp:`${F(c.n)} : ${c.s} = ${c.q} (dư ${c.r}); cần thêm 1: ${c.q+1} (${c.u}).`};}},
 {id:'s_ud_vd3',topic:'cd',level:'VD',unit:'',gen:()=>{const c=floorCase();return{stem:c.st,ans:[c.q],exp:`${F(c.n)} : ${F(c.s)} = ${c.q} (dư ${F(c.r)}).`};}},
 {id:'s_pn_th2',topic:'pn',level:'TH',unit:'học sinh',gen:()=>{const r=ri(20,60),k=ri(8,15),s=sel([2,4]);return{stem:`Một trường có ${r} phòng học, mỗi phòng có ${k} bộ bàn ghế, mỗi bộ xếp được ${s} học sinh. Trường có thể nhận nhiều nhất bao nhiêu học sinh?`,ans:[r*k*s],exp:`${r} · ${k} · ${s} = ${F(r*k*s)}.`};}}
].map(q=>Object.assign({type:'sa'},q));

/* ============ Chủ đề ============ */
const TOPICS={
  pn:{short:'Phép nhân',name:'Phép nhân số tự nhiên',rule:'Phép nhân hai số tự nhiên a và b cho ta một số tự nhiên gọi là tích, kí hiệu a × b hoặc a · b; a, b là các thừa số. a · b = a + a + … + a (b số hạng). Nếu các thừa số đều bằng chữ, hoặc chỉ có một thừa số bằng số, có thể bỏ dấu nhân: a · b = ab; 2 · m = 2m.',tip:'Khi đặt tính nhân, tích riêng thứ hai viết lùi sang trái một cột.'},
  tn:{short:'Tính chất, tính nhẩm',name:'Tính chất của phép nhân, tính nhẩm',rule:'Giao hoán: ab = ba. Kết hợp: (ab)c = a(bc). Phân phối của phép nhân đối với phép cộng: a(b + c) = ab + ac. a · 1 = 1 · a = a; a · 0 = 0 · a = 0.',tip:'Nhớ các tích 2 · 5 = 10; 4 · 25 = 100; 8 · 125 = 1 000 để tính nhẩm.'},
  cd:{short:'Phép chia',name:'Phép chia hết và phép chia có dư',rule:'Với hai số tự nhiên a và b (b khác 0), luôn tìm được đúng hai số tự nhiên q và r sao cho a = bq + r, trong đó 0 ≤ r < b. Nếu r = 0 ta có phép chia hết a : b = q; nếu r ≠ 0 ta có phép chia có dư a : b = q (dư r).',tip:'Số dư bao giờ cũng nhỏ hơn số chia. Thử lại: số bị chia = số chia · thương + số dư.'},
  ud:{short:'Tìm x, bài toán',name:'Tìm số chưa biết, bài toán thực tế',rule:'Tìm thừa số: lấy tích chia cho thừa số đã biết. Tìm số bị chia: lấy thương nhân với số chia. Tìm số chia: lấy số bị chia chia cho thương.',tip:'Bài hỏi "ít nhất bao nhiêu xe" mà phép chia còn dư thì phải thêm 1.'}
};
const TKEYS=['pn','tn','cd','ud'];
const TDESC={pn:'Thừa số, tích, đặt tính nhân, cách viết ab',tn:'Giao hoán, kết hợp, phân phối, tính nhẩm',cd:'Số bị chia, số chia, thương, số dư; chia hết và chia có dư',ud:'Tìm thừa số, số bị chia, số chia; bài toán ít nhất, nhiều nhất'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Gọi tên thành phần phép tính, nhân chia trực tiếp, số dư nhỏ hơn số chia, tìm x đơn giản.',TH:'Tìm thương và số dư, tìm số bị chia từ thương và số dư, tính nhẩm với 25 · 4, 125 · 8.',VD:'Tính nhẩm bằng tính chất phân phối, bài toán thực tế "ít nhất", "nhiều nhất", tìm x nhiều bước.'};

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
function tfHard(){for(;;){const d=sel([3,4,5,6]),m=ri(2,4),b=d*m,r=ri(d,b-1),n=ri(3,9),b2=ri(6,15);
  const P=[
    [IT(`Một số chia cho ${b} dư ${r} thì số đó chia cho ${d} dư ${r%d}.`,true,'cd','VD',`Số đó = ${b} · q + ${r} = ${d} · (${m}q) + ${r}, mà ${r} = ${d} · ${fl(r/d)} + ${r%d}.`),IT(`Một số chia cho ${b} dư ${r} thì số đó chia cho ${d} cũng dư ${r}.`,false,'cd','VD',`Số dư khi chia cho ${d} phải nhỏ hơn ${d}; đúng là ${r%d}.`)],
    [IT(`Số lớn nhất mà chia cho ${b2} có thương bằng số dư là ${b2*(b2-1)+b2-1}.`,true,'cd','VD',`Số dư lớn nhất là ${b2-1}: ${b2} · ${b2-1} + ${b2-1} = ${b2*(b2-1)+b2-1}.`),IT(`Số lớn nhất mà chia cho ${b2} có thương bằng số dư là ${b2*b2+b2}.`,false,'cd','VD',`Số dư phải nhỏ hơn ${b2}.`)],
    [IT(`Nếu tăng một thừa số thêm ${n} đơn vị và giữ nguyên thừa số kia là 12 thì tích tăng thêm ${12*n}.`,true,'tn','VD',`(a + ${n}) · 12 = 12a + ${12*n}.`),IT(`Nếu tăng một thừa số thêm ${n} đơn vị và giữ nguyên thừa số kia là 12 thì tích tăng thêm ${n}.`,false,'tn','VD',`(a + ${n}) · 12 = 12a + 12 · ${n}.`)],
    [IT('Nếu a · b = 0 thì a = 0 hoặc b = 0.',true,'ud','VD','Nếu cả hai đều khác 0 thì tích khác 0.'),IT('Nếu a · b = 0 thì cả a và b đều bằng 0.',false,'ud','VD','Ví dụ 0 · 5 = 0 nhưng 5 khác 0.')],
    [IT('Đánh số trang một cuốn sách từ 1 đến 120 cần 252 chữ số.',true,'pn','VD','9 · 1 + 90 · 2 + 21 · 3 = 252.'),IT('Đánh số trang một cuốn sách từ 1 đến 120 cần 360 chữ số.',false,'pn','VD','Trang 1 đến 9 chỉ cần 1 chữ số mỗi trang: 252 chữ số.')]];
  const its=wrap(shuffle(P).slice(0,4).map(p=>sel(p)));if(tfOK(its))return {stem:'Xét các phát biểu sau:',items:its};}}
const HARD={tf:[{id:'h_kn',type:'tf',topic:'cd',level:'VD',gen:tfHard}],sa:[
 {id:'h_elec',topic:'pn',level:'VD',unit:'đồng',gen:()=>{const p=[ri(17,19)*100,ri(18,20)*100+ri(0,9)*10,ri(22,24)*100],u=ri(110,200);const c=50*p[0]+50*p[1]+(u-100)*p[2];return{stem:`Giá điện: 50 số đầu tiên giá ${F(p[0])} đồng/số; 50 số tiếp theo (từ số 51 đến số 100) giá ${F(p[1])} đồng/số; từ số 101 đến số 200 giá ${F(p[2])} đồng/số. Tháng này nhà bạn Minh dùng hết ${u} số điện. Tính số tiền điện phải trả.`,ans:[c],exp:`50 · ${F(p[0])} + 50 · ${F(p[1])} + ${u-100} · ${F(p[2])} = ${F(50*p[0])} + ${F(50*p[1])} + ${F((u-100)*p[2])} = ${F(c)} (đồng).`};}},
 {id:'h_mod',topic:'cd',level:'VD',unit:'',gen:()=>{const d=sel([3,4,5,6]),m=ri(2,4),b=d*m,r=ri(d,b-1);return{stem:`Một số tự nhiên chia cho ${b} dư ${r}. Hỏi số đó chia cho ${d} dư bao nhiêu?`,ans:[r%d],exp:`Số đó = ${b} · q + ${r} = ${d} · (${m} · q) + ${r}. Mà ${r} = ${d} · ${fl(r/d)} + ${r%d}, nên số đó chia cho ${d} dư ${r%d}.`};}},
 {id:'h_qr',topic:'cd',level:'VD',unit:'',gen:()=>{const b=ri(6,30);return{stem:`Tìm số tự nhiên lớn nhất mà khi chia cho ${b} thì thương bằng số dư.`,ans:[b*(b-1)+b-1],exp:`a = ${b} · r + r với r ≤ ${b-1}. Lớn nhất khi r = ${b-1}: ${b} · ${b-1} + ${b-1} = ${b*(b-1)+b-1}.`};}},
 {id:'h_inc',topic:'tn',level:'VD',unit:'',gen:()=>{const y=ri(6,99),m=ri(3,15);return{stem:`Khi tăng thừa số thứ nhất thêm ${m} đơn vị và giữ nguyên thừa số thứ hai thì tích tăng thêm ${F(m*y)}. Tìm thừa số thứ hai.`,ans:[y],exp:`(a + ${m}) · b = ab + ${m} · b, nên ${m} · b = ${F(m*y)}, b = ${y}.`};}},
 {id:'h_pages',topic:'pn',level:'VD',unit:'chữ số',gen:()=>{const n=ri(100,600);return{stem:`Để đánh số trang một cuốn sách dày ${n} trang (bắt đầu từ trang 1) cần dùng bao nhiêu chữ số?`,ans:[9+180+3*(n-99)],exp:`Trang 1 đến 9: 9 chữ số; trang 10 đến 99: 90 · 2 = 180 chữ số; trang 100 đến ${n}: ${n-99} · 3 = ${3*(n-99)} chữ số. Tổng: ${9+180+3*(n-99)}.`};}},
 {id:'h_zero',topic:'ud',level:'VD',unit:'',gen:()=>{const a=ri(2,40),b=ri(2,40);return{stem:`Tìm số tự nhiên x, biết ${E(`(x + ${a}) · (x − ${b}) = 0`)}.`,ans:[b],exp:`x + ${a} ≥ ${a} nên x + ${a} khác 0. Tích bằng 0 nên x − ${b} = 0, x = ${b}.`};}}
].map(q=>Object.assign({type:'sa'},q))};

const qsOK=u=>u.qs.every(q=>q.type!=='mc'||(q.opts.length===4&&new Set(q.opts.map(o=>o.t)).size===4));
const PISA=[
 ()=>{for(;;){const fl3=[ri(6,12),ri(6,12),ri(6,12)],b=ri(6,10),p=ri(70,120)*1000,rooms=sum(fl3),n=rooms*b,T=n*p,bud=(fl(T/10000000)+sel([0,1]))*10000000+sel([0,5000000]);if(bud<=0)continue;
   const u={title:'Thay bóng đèn LED',ctx:`<p class="stem">Một trường học thay tất cả bóng đèn cũ bằng bóng đèn LED. Mỗi phòng học lắp ${b} bóng, mỗi bóng giá ${F(p)} đồng. Bảng sau ghi số phòng học ở mỗi tầng.</p>${tbl(['Tầng','Số phòng học'],[['Tầng 1',fl3[0]],['Tầng 2',fl3[1]],['Tầng 3',fl3[2]]])}`,qs:[
    saq('Trường có tất cả bao nhiêu phòng học?',rooms,'phòng',`${fl3.join(' + ')} = ${rooms}.`,'pn','NB'),
    saq('Cần mua tất cả bao nhiêu bóng đèn LED?',n,'bóng',`${rooms} · ${b} = ${n}.`,'pn','TH'),
    saq('Nhà trường phải trả bao nhiêu đồng tiền mua bóng đèn?',T,'đồng',`${n} · ${F(p)} = ${F(T)}.`,'pn','VD'),
    mcq(`Nhà trường dự trù ${F(bud)} đồng. Nhận xét nào đúng?`,bud>=T?`Đủ tiền, còn thừa ${F(bud-T)} đồng`:`Thiếu ${F(T-bud)} đồng`,bud>=T?[[`Thiếu ${F(bud-T)} đồng`,`${F(bud)} ≥ ${F(T)}.`],[`Đủ tiền, còn thừa ${F(bud-n)} đồng`,'Phải trừ số tiền, không trừ số bóng.'],[`Đủ tiền, còn thừa ${F(bud-rooms*p)} đồng`,'Chưa nhân với số bóng mỗi phòng.']]:[[`Đủ tiền, còn thừa ${F(T-bud)} đồng`,`${F(bud)} < ${F(T)}.`],[`Thiếu ${F(T-bud+p)} đồng`,'Tính lại.'],[`Thiếu ${F(rooms*p)} đồng`,'Tính lại số tiền phải trả.']],`Phải trả ${F(T)} đồng; dự trù ${F(bud)} đồng.`,'pn','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const cls=['6A','6B','6C','6D'],st=cls.map(()=>ri(38,46)),s=sel([29,35,45]),cost=ri(18,30)*100000,N=sum(st);if(N%s===0)continue;const q=fl(N/s),bus=q+1;
   const u={title:'Thuê xe đi tham quan',ctx:`<p class="stem">Khối 6 tổ chức đi tham quan. Nhà trường thuê xe ô tô ${s} chỗ (mỗi học sinh ngồi một chỗ), giá thuê mỗi xe là ${F(cost)} đồng. Bảng sau ghi số học sinh đăng kí của mỗi lớp.</p>${tbl(['Lớp','Số học sinh'],cls.map((c,i)=>[c,st[i]]))}`,qs:[
    saq('Khối 6 có tất cả bao nhiêu học sinh đăng kí?',N,'học sinh',`${st.join(' + ')} = ${N}.`,'pn','NB'),
    mcq('Cần thuê ít nhất bao nhiêu xe?',`${bus} xe`,[[`${q} xe`,`${N} : ${s} = ${q} (dư ${N%s}); còn ${N%s} học sinh nên phải thêm 1 xe.`],[`${bus+1} xe`,'Chỉ cần thêm 1 xe cho phần dư.'],[`${N%s} xe`,'Đây là số dư.']],`${N} : ${s} = ${q} (dư ${N%s}); cần ${bus} xe.`,'ud','VD'),
    saq('Tiền thuê xe là bao nhiêu đồng?',bus*cost,'đồng',`${bus} · ${F(cost)} = ${F(bus*cost)}.`,'pn','TH'),
    saq('Khi đi bằng số xe ít nhất ở trên, còn bao nhiêu chỗ ngồi trống?',bus*s-N,'chỗ',`${bus} · ${s} − ${N} = ${bus*s-N}.`,'ud','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const p=[ri(17,19)*100,ri(18,20)*100,ri(22,24)*100],u1=ri(60,100),u2=ri(110,180),c=x=>Math.min(x,50)*p[0]+Math.max(0,Math.min(x,100)-50)*p[1]+Math.max(0,x-100)*p[2];if(p[1]<=p[0])continue;
   const u={title:'Tiền điện bậc thang',ctx:`<p class="stem">Bảng sau ghi giá bán lẻ điện sinh hoạt (đơn vị: đồng cho mỗi số điện).</p>${tbl(['Bậc','Số điện','Giá (đồng/số)'],[['Bậc 1','Từ 0 đến 50',F(p[0])],['Bậc 2','Từ 51 đến 100',F(p[1])],['Bậc 3','Từ 101 đến 200',F(p[2])]])}`,qs:[
    saq('Tiền 50 số điện đầu tiên là bao nhiêu đồng?',50*p[0],'đồng',`50 · ${F(p[0])} = ${F(50*p[0])}.`,'pn','NB'),
    saq(`Tháng 9, nhà An dùng ${u1} số điện. Tính tiền điện tháng 9.`,c(u1),'đồng',`50 · ${F(p[0])} + ${u1-50} · ${F(p[1])} = ${F(c(u1))}.`,'pn','TH'),
    mcq(`Tháng 10, nhà An dùng ${u2} số điện. Tiền điện tháng 10 là:`,F(c(u2))+' đồng',[[F(u2*p[0])+' đồng','Mỗi bậc có giá khác nhau, không tính tất cả theo giá bậc 1.'],[F(u2*p[2])+' đồng','Chỉ phần từ số 101 trở đi mới tính giá bậc 3.'],[F(50*p[0]+50*p[1]+u2*p[2])+' đồng',`Bậc 3 chỉ có ${u2-100} số.`]],`50 · ${F(p[0])} + 50 · ${F(p[1])} + ${u2-100} · ${F(p[2])} = ${F(c(u2))}.`,'pn','VD'),
    saq('Tiền điện tháng 10 nhiều hơn tháng 9 bao nhiêu đồng?',c(u2)-c(u1),'đồng',`${F(c(u2))} − ${F(c(u1))} = ${F(c(u2)-c(u1))}.`,'pn','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const n=ri(800,2500),s=sel([24,36,48]),box=ri(8,20),q=fl(n/s),r=n%s;if(!r)continue;const full=q,trucks=Math.ceil(q/box);if(q%box===0)continue;
   const u={title:'Đóng gói hàng',ctx:`<p class="stem">Một xưởng sản xuất được ${F(n)} hộp sữa. Các hộp được đóng vào thùng, mỗi thùng ${s} hộp. Mỗi chuyến xe chở được ${box} thùng. Chỉ những thùng đầy mới được chở đi.</p>`,qs:[
    saq('Đóng được nhiều nhất bao nhiêu thùng đầy?',full,'thùng',`${F(n)} : ${s} = ${q} (dư ${r}).`,'cd','TH'),
    saq('Còn lại bao nhiêu hộp sữa chưa được đóng thùng?',r,'hộp',`${F(n)} − ${s} · ${q} = ${r}.`,'cd','TH'),
    mcq('Cần ít nhất bao nhiêu chuyến xe để chở hết các thùng đầy?',`${trucks} chuyến`,[[`${trucks-1} chuyến`,`${q} : ${box} = ${fl(q/box)} (dư ${q%box}); còn ${q%box} thùng nên phải thêm 1 chuyến.`],[`${trucks+1} chuyến`,'Chỉ cần thêm 1 chuyến cho phần dư.'],[`${q%box} chuyến`,'Đây là số dư.']],`${q} : ${box} = ${fl(q/box)} (dư ${q%box}); cần ${trucks} chuyến.`,'ud','VD')]};if(qsOK(u))return u;}}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'pn',fig:dots(3,5),extra:'3 hàng, mỗi hàng 5 chấm: 3 · 5 = 5 + 5 + 5 = 15. 3 và 5 là các thừa số, 15 là tích.'},
  {k:'tn',fig:'<div class="figbox"><p>24 · 25 = (6 · 4) · 25 = 6 · (4 · 25) = 6 · 100 = 600</p><p>125 · 101 = 125 · 100 + 125 = 12 625</p></div>',extra:'Nhớ: 2 · 5 = 10; 4 · 25 = 100; 8 · 125 = 1 000.'},
  {k:'cd',fig:'<div class="figbox"><p>4 847 : 131 = 37 (phép chia hết)</p><p>5 580 : 157 = 35 (dư 85), vì 5 580 = 157 · 35 + 85 và 85 < 157</p></div>',extra:'Số dư bao giờ cũng nhỏ hơn số chia.'},
  {k:'ud',fig:'<div class="figbox"><p>487 : 45 = 10 (dư 37)</p><p>Chở 487 người bằng xe 45 chỗ cần ít nhất 10 + 1 = 11 xe</p></div>',extra:'x : 5 = 12 ⇒ x = 12 · 5 = 60; 60 : x = 12 ⇒ x = 60 : 12 = 5.'}
];

/* ============ Câu kết hợp kiến thức bài trước (Bài 1, 2, 3, 4) ============ */
const PL=[[100000,'100 000'],[10000,'10 000'],[1000,'1 000'],[100,'100'],[10,'10'],[1,'1']];
function x5SetRem(){return tryGen(()=>{const b=ri(3,9),L=range(0,b-1);
  return {stem:`Tập hợp R các số dư có thể có khi chia một số tự nhiên cho ${b} là:`,opts:[{t:'R = '+SET(L)},{t:'R = '+SET(range(1,b-1)),err:'Số dư có thể bằng 0 (phép chia hết).'},{t:'R = '+SET(range(0,b)),err:`Số dư phải nhỏ hơn ${b}.`},{t:'R = '+SET(range(1,b)),err:`Số dư có thể bằng 0 và phải nhỏ hơn ${b}.`}].map(nbT),ans:0,exp:`0 ≤ r < ${b} nên R = ${SET(L)}.`};});}
function x5SumForm(){return tryGen(()=>{let n;do{n=ri(100000,999999);}while(!String(n).includes('0'));const d=String(n).split('').map(Number);
  const terms=sh=>d.map((x,i)=>[x,PL[Math.min(5,i+sh)][1]]).filter(t=>t[0]).map(t=>t[1]==='1'?`${t[0]} · 1`:`${t[0]} · ${t[1]}`).join(' + ');
  const good=terms(0),w1=d.map((x,i)=>x?`${x} · ${PL[i][1]}`:null).filter(Boolean).slice(0,-1).join(' + '),w2=d.filter(Boolean).join(' + '),w3=terms(1);
  return {stem:`Biểu diễn số ${F(n)} thành tổng giá trị các chữ số của nó (bỏ các chữ số 0):`,opts:[{t:good},{t:w1,err:'Còn thiếu giá trị của chữ số cuối cùng khác 0.'},{t:w2,err:'Mỗi chữ số phải nhân với giá trị của hàng.'},{t:w3,err:'Chữ số đầu tiên của số có sáu chữ số ở hàng trăm nghìn.'}].map(nbT),ans:0,exp:`Mỗi chữ số nhân với giá trị hàng của nó: ${F(n)} = ${good}.`};});}
function x5CmpProd(){return tryGen(()=>{const x=ri(12,999),t=ri(0,2);let A,Bs,r,e;
  if(t===0){A=`${F(x)} · 125 · 8`;Bs=`${F(x)} · 999`;r='A > B';e=`A = ${F(x)} · 1 000 > ${F(x)} · 999 = B.`;}
  else if(t===1){A=`25 · ${F(x)} · 4`;Bs=`${F(x)} · 100`;r='A = B';e=`A = ${F(x)} · (25 · 4) = ${F(x)} · 100 = B.`;}
  else {A=`${F(x)} · 99`;Bs=`${F(x)} · 100 − ${F(x)} + 1`;r='A < B';e=`B = ${F(x)} · 99 + 1 nên B lớn hơn A.`;}
  return {stem:`Không tính giá trị, so sánh ${E(`A = ${A}`)} và ${E(`B = ${Bs}`)}:`,opts:[{t:r}].concat(['A < B','A > B','A = B'].filter(z=>z!==r).map(z=>({t:z,err:e})),[{t:'Không so sánh được',err:'Dùng tính chất của phép nhân để so sánh.'}]),ans:0,exp:e};});}
function x5SetX(){return tryGen(()=>{const a=ri(2,9),k=ri(3,6),b=a*k+ri(1,a-1)||a*k+1,le=RNG()<.5,L=range(0,Math.floor((le?b:b-1)/a));if(b%a===0)return null;
  return {stem:`Viết tập hợp các số tự nhiên x thoả mãn ${E(`${a} · x ${le?'≤':'<'} ${b}`)}:`,opts:[{t:SET(L)}].concat(pickOpts(SET(L),[{t:SET(L.slice(1)),err:`x = 0 cũng thoả mãn: ${a} · 0 = 0.`},{t:SET(L.concat([L.length])),err:`${a} · ${L.length} = ${a*L.length} > ${b}.`},{t:SET(L.slice(0,-1)),err:`${a} · ${L[L.length-1]} = ${a*L[L.length-1]} ${le?'≤':'<'} ${b}.`}])).map(nbT),ans:0,exp:`${a} · ${L[L.length-1]} = ${a*L[L.length-1]} ${le?'≤':'<'} ${b} còn ${a} · ${L.length} = ${a*L.length} > ${b}: ${SET(L)}.`};});}
function x5Tour(){return tryGen(()=>{const T=ri(18,26)*1000000,q1=ri(4000,7000)*1000+ri(1,9)*100,q2=ri(3000,6000)*1000+ri(1,9)*100;let rest=T-q1-q2;if(rest%2)return null;const h=rest/2;
  return {stem:`Kế hoạch cả năm đón ${F(T)} lượt khách du lịch quốc tế. Quý I và quý II đã đón lần lượt ${F(q1)} và ${F(q2)} lượt. Nếu quý III và quý IV đón số lượt bằng nhau thì mỗi quý cần đón bao nhiêu lượt để hoàn thành kế hoạch?`,opts:[{t:F(h)}].concat(pickOpts(F(h),[{t:F(rest),err:'Đây là số lượt của cả hai quý cuối.'},{t:F((T-q1)/1|0),err:'Còn phải trừ số lượt của quý II.'},{t:F(T/4),err:'Phải trừ số lượt đã đón ở hai quý đầu.'},{t:F(h+50000),err:'Tính lại phép chia.'}])),ans:0,exp:`Hai quý đầu: ${F(q1)} + ${F(q2)} = ${F(q1+q2)}. Hai quý cuối: ${F(T)} − ${F(q1+q2)} = ${F(rest)}. Mỗi quý: ${F(rest)} : 2 = ${F(h)}.`};});}
[['x5_setrem','cd','TH',x5SetRem,[1]],['x5_sumform','pn','VD',x5SumForm,[2]],['x5_cmpprod','tn','TH',x5CmpProd,[3]],['x5_setx','ud','VD',x5SetX,[1,3]],['x5_tour','ud','VD',x5Tour,[4]]].forEach(([id,t,l,g,mx])=>{['a','b'].forEach(s=>{MC.push({id:id+'_'+s,type:'mc',topic:t,level:l,gen:g,mix:mx});});});
function tfX5(){let n;do{n=ri(10000,99999)*10;}while(new Set(String(n)).size===6);const d=String(n),S=[...new Set(d)].map(Number),k=ri(1,4),dk=+d[k],vk=dk*Math.pow(10,5-k);
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`Tập hợp các chữ số của n có ${v?S.length:S.length+1} phần tử.`,v,'pn','VD',`Tập hợp đó là ${SET(S)}.`));}
    {const v=R();o.push(IT(`n = ${F(n/10)} · ${v?10:100}`,v,'pn','VD',`${F(n/10)} · 10 = ${F(n)}.`));}
    {const v=R();o.push(IT(`Chữ số hàng ${['trăm nghìn','chục nghìn','nghìn','trăm','chục','đơn vị'][k]} của n có giá trị ${F(v?vk:vk*10)}.`,v||dk===0,'pn','VD',`${dk} · ${F(Math.pow(10,5-k))} = ${F(vk)}.`));}
    {const v=R(),q=Math.floor(n/7),r=n%7;o.push(IT(`n : 7 = ${F(q)} (dư ${v?r:(r+1)%7})`,v,'cd','VD',`${F(n)} = 7 · ${F(q)} + ${r}.`));}return o;});
  return {stem:`Cho số n = ${F(n)}. Xét các phát biểu sau:`,items:wrap(items)};}
['a','b'].forEach(s=>TF.push({id:'x5_tf_'+s,type:'tf',topic:'pn',level:'VD',gen:tfX5,mix:[1,2]}));
SA.push(
 {id:'x5_s_rem',type:'sa',topic:'cd',level:'VD',unit:'số',mix:[1],gen:()=>{const b=ri(3,12),r=ri(0,b-1),L=range(10,99).filter(x=>x%b===r);return{stem:`Tập hợp các số tự nhiên có hai chữ số mà chia cho ${b} dư ${r} có bao nhiêu phần tử?`,ans:[L.length],exp:`Các số đó là ${L[0]}; ${L[1]}; …; ${L[L.length-1]}: có ${L.length} số.`};}},
 {id:'x5_s_place',type:'sa',topic:'pn',level:'TH',unit:'',mix:[2],gen:()=>{const a=ri(1,9),b=ri(1,9),c=ri(1,9);return{stem:`Tính ${E(`${a} · 100 000 + ${b} · 1 000 + ${c} · 10`)}.`,ans:[a*100000+b*1000+c*10],exp:`Số gồm ${a} trăm nghìn, ${b} nghìn và ${c} chục: ${F(a*100000+b*1000+c*10)}.`};}},
 {id:'x5_s_tour',type:'sa',topic:'ud',level:'VD',unit:'người',mix:[4],gen:()=>{const p=ri(30,60)*1000,n=ri(25,45),k=ri(2,5),M=ri(8,20)*1000000;return{stem:`Một đoàn có ${n} người đi tham quan, vé vào cửa giá ${F(p)} đồng một người; ngoài ra mỗi người được tặng ${k} chai nước. Trưởng đoàn mang ${F(M)} đồng. Sau khi mua vé cho cả đoàn, trưởng đoàn còn lại bao nhiêu đồng?`,ans:[M-n*p],exp:`Tiền vé: ${n} · ${F(p)} = ${F(n*p)}. Còn lại: ${F(M)} − ${F(n*p)} = ${F(M-n*p)} (đồng).`};}});
const MIX_OLD={tf_shop_vd_a:[4],tf_shop_vd_b:[4],h_elec:[4],h_pages:[2]};
[...MC,...TF,...SA,...HARD.sa,...HARD.tf].forEach(q=>{if(MIX_OLD[q.id])q.mix=MIX_OLD[q.id];});
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='nc6_seen';
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
  const mcSlots=[['pn',['NB']],['tn',['NB','TH']],['cd',['NB','TH']],['ud',['NB']],['ud',['TH']],[null,['VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['pn','tn','cd'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=[
    pick(MC.filter(q=>q.topic==='pn'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='tn'&&q.level!=='VD'),used),
    pick(MC.filter(q=>q.topic==='cd'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='ud'&&q.level==='TH'),used)
  ];
  const sa=[pick(SA.filter(q=>q.topic==='pn'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='ud'&&q.level!=='VD'),used)];
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
