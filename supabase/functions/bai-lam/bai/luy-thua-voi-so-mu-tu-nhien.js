// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ luy-thua-voi-so-mu-tu-nhien/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "luy-thua-voi-so-mu-tu-nhien";
export const TIEN_TO = "LU6-";

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
const FB_MC=()=>({stem:'Với a khác 0, a<sup>0</sup> bằng:',opts:[{t:'1'},{t:'0',err:'Người ta quy ước a<sup>0</sup> = 1 (a khác 0).'},{t:'a',err:'a<sup>1</sup> = a, còn a<sup>0</sup> = 1.'},{t:'Không xác định',err:'Người ta quy ước a<sup>0</sup> = 1 (a khác 0).'}],ans:0,exp:'Quy ước: a<sup>0</sup> = 1 với a khác 0.'});
function tryGen(f){for(let n=0;n<100;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>String(o.t))).size===4)return r;}return FB_MC();}
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
function mixed(make){for(let n=0;n<60;n++){const items=make();if(!items)continue;const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}return null;}
const wrap=items=>items?items.map(i=>Object.assign(i,{t:nb(i.t)})):null;
const F=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const E=s=>nb(s);
const P10=k=>Math.pow(10,k);
const sum=a=>a.reduce((x,y)=>x+y,0);
const fl=Math.floor;
const W=(b,e)=>`${b}<sup>${e}</sup>`;          // luỹ thừa b mũ e
const pw=(b,e)=>Math.pow(b,e);
const rep=(b,n)=>Array(n).fill(b).join(' · ');
const NAMES=['Mai','Lan','An','Minh','Hà','Bình'];

/* ============ Bộ sinh câu nhiều lựa chọn ============ */
/* --- Luỹ thừa, cơ số, số mũ (dn) --- */
function genWrite(){return tryGen(()=>{const b=ri(2,12),n=ri(3,7);if(b===n)return null;
  return {stem:`Viết tích ${E(rep(b,n))} dưới dạng một luỹ thừa:`,opts:[{t:W(b,n)},{t:W(n,b),err:`Cơ số là thừa số được lặp lại (${b}), số mũ là số thừa số (${n}).`},{t:`${b} · ${n}`,err:'Tích các thừa số bằng nhau viết thành luỹ thừa, không phải phép nhân với số thừa số.'},{t:W(b,n-1),err:`Đếm lại: có ${n} thừa số ${b}.`}].map(nbT),ans:0,exp:`Có ${n} thừa số bằng ${b}: ${rep(b,n)} = ${W(b,n)}.`};});}
function genBaseExp(){return tryGen(()=>{const b=ri(2,15),n=ri(2,9);if(b===n)return null;const o=(x,y)=>`Cơ số ${x}, số mũ ${y}`;
  return {stem:`Luỹ thừa ${W(b,n)} có:`,opts:[{t:o(b,n)},{t:o(n,b),err:'Cơ số viết to ở dưới, số mũ viết nhỏ ở trên.'},{t:o(b,b),err:`Số mũ là ${n}.`},{t:o(n,n),err:`Cơ số là ${b}.`}],ans:0,exp:`Trong ${W(b,n)}: ${b} là cơ số, ${n} là số mũ.`};});}
function genRead(){return tryGen(()=>{const b=ri(2,15),k=ri(0,2),n=k===0?ri(4,9):k+1;if(b===n)return null;
  const r=k===0?`${b} mũ ${n}`:k===1?`${b} bình phương`:`${b} lập phương`;
  const w=k===0?[[`${n} mũ ${b}`,'Đọc cơ số trước, rồi đến số mũ.'],[`${b} nhân ${n}`,'Luỹ thừa không phải phép nhân cơ số với số mũ.'],[`${n} luỹ thừa ${b}`,'Đọc cơ số trước, rồi đến số mũ.']]:[[`${b} ${k===1?'lập':'bình'} phương`,k===1?'a<sup>3</sup> mới là a lập phương.':'a<sup>2</sup> mới là a bình phương.'],[`${n} ${k===1?'bình':'lập'} phương`,`Cơ số là ${b}.`],[`${b} nhân ${n}`,'Luỹ thừa không phải phép nhân cơ số với số mũ.']];
  return {stem:`${W(b,n)} còn được đọc là:`,opts:[{t:r}].concat(w.map(x=>({t:x[0],err:x[1]}))),ans:0,exp:k===0?`a<sup>n</sup> đọc là "a mũ n" hoặc "a luỹ thừa n": ${W(b,n)} đọc là "${b} mũ ${n}".`:`a<sup>${n}</sup> còn gọi là a ${k===1?'bình':'lập'} phương.`};});}
function genVal(){return tryGen(()=>{const b=ri(2,9),n=ri(2,b<4?8:4),v=pw(b,n);if(b===n)return null;
  return {stem:`Giá trị của ${W(b,n)} là:`,opts:[{t:F(v)}].concat(pickOpts(F(v),[{t:F(b*n),err:`${W(b,n)} là tích ${n} thừa số ${b}, không phải ${b} · ${n}.`},{t:F(pw(n,b)),err:'Cơ số và số mũ bị đổi chỗ.'},{t:F(pw(b,n-1)),err:`Đếm lại: có ${n} thừa số ${b}.`},{t:F(pw(b,n+1)),err:`Đếm lại: có ${n} thừa số ${b}.`}])),ans:0,exp:`${W(b,n)} = ${rep(b,n)} = ${F(v)}.`};});}
function genMixed(){return tryGen(()=>{const b=ri(2,5),n=ri(2,4),k=2,tail=b*b,e=n+k;
  return {stem:`Viết tích ${E(rep(b,n)+' · '+tail)} dưới dạng một luỹ thừa của ${b}:`,opts:[{t:W(b,e)},{t:W(b,n+1),err:`${tail} = ${b} · ${b} = ${W(b,2)}, không phải một thừa số ${b}.`},{t:W(tail,e),err:`Cơ số vẫn là ${b}.`},{t:W(b,n*k),err:`Có ${n} + 2 = ${e} thừa số ${b}.`}].map(nbT),ans:0,exp:`${tail} = ${b} · ${b}, nên tích có ${e} thừa số ${b}: ${W(b,e)}.`};});}
function genFindExp(){return tryGen(()=>{const b=sel([2,3,5,10]),n=ri(2,b===2?9:b===3?6:5),v=pw(b,n);
  return {stem:`Tìm số tự nhiên n, biết ${E(`${W(b,'n')} = ${F(v)}`)}.`,opts:[{t:'n = '+n}].concat(pickOpts('n = '+n,[{t:'n = '+(n+1),err:`${W(b,n+1)} = ${F(pw(b,n+1))}.`},{t:'n = '+(n-1),err:`${W(b,n-1)} = ${F(pw(b,n-1))}.`},{t:'n = '+F(v/b),err:`Phải tìm số mũ, không phải chia cho ${b}.`},{t:'n = '+(n+2),err:'Thử lại.'}])).map(nbT),ans:0,exp:`${F(v)} = ${rep(b,n)} = ${W(b,n)}, nên n = ${n}.`};});}
function genTable(){return tryGen(()=>{const b=sel([2,3,4,5]),n=ri(3,b===2?9:b===3?6:4),v=pw(b,n);
  return {stem:`Luỹ thừa có cơ số ${b} và có giá trị bằng ${F(v)} là:`,opts:[{t:W(b,n)}].concat(pickOpts(W(b,n),[{t:W(b,n+1),err:`${W(b,n+1)} = ${F(pw(b,n+1))}.`},{t:W(b,n-1),err:`${W(b,n-1)} = ${F(pw(b,n-1))}.`},{t:W(n,b),err:`Cơ số là ${b}.`}])),ans:0,exp:`${F(v)} = ${rep(b,n)} = ${W(b,n)}.`};});}
function genA1(){return tryGen(()=>{const a=ri(3,99),n=ri(2,9);const T=[[`${W(a,1)} = ${a}`,1],[`${W(1,n)} = 1`,1],[`${W(0,n)} = 0`,1],[`${W(a,0)} = 1`,1]],Fz=[[`${W(a,1)} = 1`,`${W(a,1)} = ${a}.`],[`${W(1,n)} = ${n}`,`Tích ${n} thừa số 1 bằng 1.`],[`${W(a,2)} = ${2*a}`,`${W(a,2)} = ${a} · ${a}.`],[`${W(a,0)} = 0`,`Quy ước ${W(a,0)} = 1.`]];
  const t=sel(T);const f=shuffle(Fz).slice(0,3);
  return {stem:'Khẳng định nào sau đây đúng?',opts:[{t:t[0]}].concat(f.map(x=>({t:x[0],err:x[1]}))).map(nbT),ans:0,exp:`a<sup>1</sup> = a; 1<sup>n</sup> = 1; 0<sup>n</sup> = 0 (n khác 0); a<sup>0</sup> = 1 (a khác 0).`};});}
function genCell(){return tryGen(()=>{const k=ri(5,14),v=pw(2,k-1);
  return {stem:`Trên bàn cờ, ô thứ nhất để 1 hạt thóc, ô thứ hai để 2 hạt, ô thứ ba để 4 hạt, … ô sau gấp đôi ô trước. Ô thứ ${k} có bao nhiêu hạt thóc?`,opts:[{t:F(v)}].concat(pickOpts(F(v),[{t:F(2*v),err:`Ô thứ ${k} có ${W(2,k-1)} hạt (ô thứ nhất có ${W(2,0)} = 1 hạt).`},{t:F(v/2),err:'Đếm lại số lần gấp đôi.'},{t:F(2*k),err:'Gấp đôi nhiều lần là nhân với 2 nhiều lần, không phải 2 · số ô.'},{t:F(k*k),err:`Ô thứ ${k} có ${W(2,k-1)} hạt.`}])),ans:0,exp:`Ô thứ ${k} có ${k-1} lần gấp đôi: ${W(2,k-1)} = ${F(v)} hạt.`};});}

/* --- Bình phương, lập phương, luỹ thừa của 10 (bp) --- */
function genSq(){return tryGen(()=>{const a=ri(2,15),cube=RNG()<.4&&a<=10,v=cube?a*a*a:a*a;
  return {stem:`${cube?'Lập':'Bình'} phương của ${a} là:`,opts:[{t:F(v)}].concat(pickOpts(F(v),[{t:F(cube?3*a:2*a),err:`${cube?'Lập phương':'Bình phương'} của ${a} là ${cube?W(a,3):W(a,2)}, không phải ${cube?3:2} · ${a}.`},{t:F(cube?a*a:a*a*a),err:cube?`Đây là bình phương của ${a}.`:`Đây là lập phương của ${a}.`},{t:F(v+a),err:'Tính lại.'},{t:F(v-a),err:'Tính lại.'}])),ans:0,exp:`${cube?W(a,3)+' = '+a+' · '+a+' · '+a:W(a,2)+' = '+a+' · '+a} = ${F(v)}.`};});}
function genPerfect(){return tryGen(()=>{const k=ri(4,30),sq=k*k,w=[sq+1,sq-1,(k+1)*(k+1)-2,sq+k].filter(x=>Math.sqrt(x)%1!==0);const ws=shuffle([...new Set(w)]).slice(0,3);if(ws.length<3)return null;
  return {stem:'Số nào sau đây là số chính phương?',opts:[{t:F(sq)}].concat(ws.map(x=>({t:F(x),err:`${F(x)} không viết được thành bình phương của một số tự nhiên.`}))),ans:0,exp:`${F(sq)} = ${W(k,2)} là số chính phương.`};});}
function genPow10(){return tryGen(()=>{const n=ri(3,9),v=P10(n);
  return {stem:`${W(10,n)} bằng:`,opts:[{t:F(v)}].concat(pickOpts(F(v),[{t:F(10*n),err:`${W(10,n)} là tích ${n} thừa số 10, không phải 10 · ${n}.`},{t:F(v/10),err:`${W(10,n)} có ${n} chữ số 0.`},{t:F(v*10),err:`${W(10,n)} có ${n} chữ số 0.`}])),ans:0,exp:`${W(10,n)} = 1 với ${n} chữ số 0 phía sau: ${F(v)}.`};});}
const expand=(n,sh)=>{const d=String(n).split('').map(Number),L=d.length;return d.map((x,i)=>[x,L-1-i+(sh||0)]).filter(t=>t[0]).map(([x,e])=>e===0?`${x}`:e===1?`${x} · 10`:`${x} · ${W(10,e)}`).join(' + ');};
function genExpand(){return tryGen(()=>{let n;do{n=ri(10000,999999);}while(String(n).split('0').length>3);const L=String(n).length,good=expand(n);
  const w1=expand(n,1),d=String(n).split('').map(Number),w2=d.map((x,i)=>[x,L-1-i]).filter(t=>t[0]).map(([x,e])=>e===0?`${x}`:`${x} · ${W(10,e+1)}`).join(' + '),w3=d.map((x,i)=>[x,L-1-i]).filter(t=>t[0]).map(([x,e])=>e===0?`${x}`:`${x} · ${W(e,10)}`).join(' + ');
  return {stem:`Viết số ${F(n)} thành tổng giá trị các chữ số của nó, dùng các luỹ thừa của 10:`,opts:[{t:good},{t:w1,err:'Chữ số hàng đơn vị không nhân với 10.'},{t:w2,err:`Chữ số hàng chục nhân với 10 = ${W(10,1)}, hàng trăm nhân với ${W(10,2)}, …`},{t:w3,err:'Cơ số là 10, số mũ là vị trí của hàng.'}].map(nbT),ans:0,exp:`Theo mẫu 4 257 = 4 · ${W(10,3)} + 2 · ${W(10,2)} + 5 · 10 + 7: ${F(n)} = ${good}.`};});}
function genOddSum(){return tryGen(()=>{const k=ri(3,8),t=range(1,k).map(i=>2*i-1);
  return {stem:`Ta có 1 + 3 + 5 = 9 = ${W(3,2)}. Tổng ${E(t.join(' + '))} viết dưới dạng bình phương của một số tự nhiên là:`,opts:[{t:W(k,2)},{t:W(2*k-1,2),err:`Có ${k} số hạng nên tổng bằng ${W(k,2)}.`},{t:W(k+1,2),err:`Đếm lại: có ${k} số lẻ.`},{t:W(k-1,2),err:`Đếm lại: có ${k} số lẻ.`}],ans:0,exp:`Tổng ${k} số lẻ đầu tiên: ${t.join(' + ')} = ${k*k} = ${W(k,2)}.`};});}
function gen111(){return tryGen(()=>{const k=sel([4,5]),n=+'1'.repeat(k),v=n*n,w=[+'123'.slice(0,k-1)+'321'.slice(4-k),1232321,12344321,123321,1234321,123454321,12345421].filter(x=>x!==v);
  return {stem:`Biết ${W(11,2)} = 121 và ${W(111,2)} = 12 321. Dự đoán (rồi kiểm tra) giá trị của ${W(F(n),2)}:`,opts:[{t:F(v)}].concat(shuffle([...new Set(w)]).slice(0,3).map(x=>({t:F(x),err:`Chữ số ở giữa của ${W(F(n),2)} là ${k}, các chữ số tăng dần 1; 2; …; ${k} rồi giảm dần.`}))),ans:0,exp:`${W(F(n),2)} = ${F(v)}: các chữ số tăng từ 1 đến ${k} rồi giảm về 1.`};});}

/* --- Nhân hai luỹ thừa cùng cơ số (nh) --- */
function genMul(){return tryGen(()=>{const b=ri(2,12),m=ri(2,9),n=ri(2,9);
  return {stem:`Viết kết quả phép tính ${E(`${W(b,m)} · ${W(b,n)}`)} dưới dạng một luỹ thừa:`,opts:[{t:W(b,m+n)}].concat(pickOpts(W(b,m+n),[{t:W(b,m*n),err:'Nhân hai luỹ thừa cùng cơ số thì cộng các số mũ, không nhân.'},{t:W(b*b,m+n),err:'Giữ nguyên cơ số.'},{t:W(b,Math.abs(m-n)),err:'Nhân thì cộng các số mũ.'},{t:W(2*b,m+n),err:'Giữ nguyên cơ số.'}])),ans:0,exp:`${W(b,m)} · ${W(b,n)} = ${W(b,`${m} + ${n}`)} = ${W(b,m+n)}.`};});}
function genMul3(){return tryGen(()=>{const b=sel([2,5,10]),e=sample(3,2,9);const s=sum(e);
  return {stem:`Viết kết quả phép tính ${E(e.map(x=>W(b,x)).join(' · '))} dưới dạng một luỹ thừa:`,opts:[{t:W(b,s)}].concat(pickOpts(W(b,s),[{t:W(b,e[0]*e[1]*e[2]),err:'Cộng các số mũ, không nhân.'},{t:W(b*b*b,s),err:'Giữ nguyên cơ số.'},{t:W(b,s-1),err:'Cộng lại các số mũ.'},{t:W(b,s+1),err:'Cộng lại các số mũ.'}])),ans:0,exp:`${e.map(x=>W(b,x)).join(' · ')} = ${W(b,e.join(' + '))} = ${W(b,s)}.`};});}
function genMulMix(){return tryGen(()=>{const b=sel([2,3]),k=b===2?ri(2,4):2,c=pw(b,k),m=ri(2,7);
  return {stem:`Viết kết quả phép tính ${E(`${W(b,m)} · ${c}`)} dưới dạng một luỹ thừa của ${b}:`,opts:[{t:W(b,m+k)}].concat(pickOpts(W(b,m+k),[{t:W(b,m+1),err:`${c} = ${W(b,k)}, không phải ${b}.`},{t:W(b,m*k),err:'Cộng các số mũ, không nhân.'},{t:W(c,m+1),err:`Viết ${c} thành luỹ thừa của ${b} trước.`},{t:W(b,m+k+1),err:`${c} = ${W(b,k)}.`}])),ans:0,exp:`${c} = ${W(b,k)}, nên ${W(b,m)} · ${W(b,k)} = ${W(b,m+k)}.`};});}
const RULES=[['nhân hai luỹ thừa cùng cơ số','giữ nguyên cơ số và cộng các số mũ'],['chia hai luỹ thừa cùng cơ số (khác 0)','giữ nguyên cơ số và lấy số mũ của số bị chia trừ số mũ của số chia']];
function genRule(){const k=ri(0,1),r=RULES[k][1],w=k===0?[['giữ nguyên cơ số và nhân các số mũ','Ví dụ 5<sup>6</sup> · 5<sup>3</sup> = 5<sup>9</sup>: cộng 6 + 3.'],['nhân các cơ số và cộng các số mũ','Cơ số giữ nguyên.'],[RULES[1][1],'Đây là quy tắc chia hai luỹ thừa cùng cơ số.']]:[['giữ nguyên cơ số và chia các số mũ','Ví dụ 2<sup>6</sup> : 2<sup>3</sup> = 2<sup>3</sup>: lấy 6 − 3.'],['chia các cơ số và trừ các số mũ','Cơ số giữ nguyên.'],[RULES[0][1],'Đây là quy tắc nhân hai luỹ thừa cùng cơ số.']];
  return {stem:`Khi ${RULES[k][0]}, ta:`,opts:[{t:r}].concat(w.map(x=>({t:x[0],err:x[1]}))),ans:0,exp:k===0?'a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup>.':'a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup> (a khác 0, m ≥ n).'};}
function genMulX(){return tryGen(()=>{const b=sel([2,3,5,7]),m=ri(2,9),n=ri(2,9),s=m+n,left=RNG()<.5;
  return {stem:`Tìm số tự nhiên n, biết ${E(left?`${W(b,'n')} · ${W(b,m)} = ${W(b,s)}`:`${W(b,m)} · ${W(b,'n')} = ${W(b,s)}`)}.`,opts:[{t:'n = '+n}].concat(pickOpts('n = '+n,[{t:'n = '+s,err:'Số mũ của tích bằng tổng các số mũ.'},{t:'n = '+(m+s),err:`n + ${m} = ${s}.`},{t:'n = '+(s%m===0&&s/m!==n?s/m:n+1),err:`Không chia số mũ: n + ${m} = ${s}.`},{t:'n = '+(n+1),err:'Thử lại.'}])).map(nbT),ans:0,exp:`${W(b,'n')} · ${W(b,m)} = ${W(b,`n + ${m}`)} nên n + ${m} = ${s}, n = ${n}.`};});}

/* --- Chia hai luỹ thừa cùng cơ số (ch) --- */
function genDiv(){return tryGen(()=>{const b=ri(2,12),n=ri(2,8),m=n+ri(1,8);
  return {stem:`Viết kết quả phép tính ${E(`${W(b,m)} : ${W(b,n)}`)} dưới dạng một luỹ thừa:`,opts:[{t:W(b,m-n)}].concat(pickOpts(W(b,m-n),[{t:W(b,m+n),err:'Chia hai luỹ thừa cùng cơ số thì trừ các số mũ.'},{t:W(1,m-n),err:'Giữ nguyên cơ số, không chia các cơ số.'},{t:W(b,m%n===0?m/n:m*n),err:'Trừ các số mũ, không chia hoặc nhân.'},{t:W(b,m-n+1),err:'Trừ lại các số mũ.'}])),ans:0,exp:`${W(b,m)} : ${W(b,n)} = ${W(b,`${m} − ${n}`)} = ${W(b,m-n)}.`};});}
function genA0(){return tryGen(()=>{const a=ri(2,2025),n=ri(2,100),k=RNG()<.5;
  const st=k?`Kết quả của phép tính ${E(`${W(F(a),n)} : ${W(F(a),n)}`)} là:`:`Giá trị của ${W(F(a),0)} là:`;
  return {stem:st,opts:[{t:'1'},{t:'0',err:k?'Một số khác 0 chia cho chính nó bằng 1.':`Quy ước ${W('a',0)} = 1 (a khác 0).`},{t:F(a),err:k?`Kết quả là ${W(F(a),0)} = 1.`:`${W(F(a),1)} mới bằng ${F(a)}.`},{t:k?W(F(a),2*n):W(F(a),1),err:k?'Chia thì trừ các số mũ.':`${W(F(a),0)} = 1.`}].map(nbT),ans:0,exp:k?`${W(F(a),n)} : ${W(F(a),n)} = ${W(F(a),0)} = 1.`:`Quy ước a<sup>0</sup> = 1 với a khác 0.`};});}
function genDivMix(){return tryGen(()=>{const b=sel([2,3]),k=b===2?ri(2,5):ri(2,3),c=pw(b,k),m=k+ri(2,8);
  return {stem:`Viết kết quả phép tính ${E(`${W(b,m)} : ${F(c)}`)} dưới dạng một luỹ thừa của ${b}:`,opts:[{t:W(b,m-k)}].concat(pickOpts(W(b,m-k),[{t:W(b,m-1),err:`${F(c)} = ${W(b,k)}, không phải ${b}.`},{t:W(b,m+k),err:'Chia thì trừ các số mũ.'},{t:W(b,m-k-1),err:`${F(c)} = ${W(b,k)}.`},{t:W(b,m-k+1),err:`${F(c)} = ${W(b,k)}.`}])),ans:0,exp:`${F(c)} = ${W(b,k)}, nên ${W(b,m)} : ${W(b,k)} = ${W(b,m-k)}.`};});}
function gen1024(){return tryGen(()=>{const up=RNG()<.5;const v=up?2048:512;
  return {stem:`Biết ${W(2,10)} = 1 024. Giá trị của ${W(2,up?11:9)} là:`,opts:[{t:F(v)}].concat(pickOpts(F(v),[{t:F(up?1025:1023),err:`${W(2,up?11:9)} = ${W(2,10)} ${up?'·':':'} 2, không phải ${up?'cộng':'trừ'} 1.`},{t:F(up?1024*10:102),err:`${up?'Nhân':'Chia'} với 2, không phải với 10.`},{t:F(up?512:2048),err:up?'Đây là 2<sup>9</sup>.':'Đây là 2<sup>11</sup>.'}])),ans:0,exp:`${W(2,up?11:9)} = ${W(2,10)} ${up?'·':':'} 2 = ${F(v)}.`};});}
function genDivX(){return tryGen(()=>{const b=sel([2,3,5,10]),n=ri(2,6),d=ri(1,6),m=n+d,left=RNG()<.5;
  return {stem:`Tìm số tự nhiên n, biết ${E(left?`${W(b,'n')} : ${W(b,n)} = ${W(b,d)}`:`${W(b,m)} : ${W(b,'n')} = ${W(b,d)}`)}.`,opts:[{t:'n = '+(left?m:n)}].concat(pickOpts('n = '+(left?m:n),[{t:'n = '+(left?Math.abs(n-d)||n+2:m+d),err:left?`n − ${n} = ${d} nên n = ${d} + ${n}.`:`${m} − n = ${d} nên n = ${m} − ${d}.`},{t:'n = '+(left?n*d:d),err:'Trừ các số mũ, không nhân.'},{t:'n = '+(left?m+1:n+1),err:'Thử lại.'},{t:'n = '+(left?m-1:Math.max(0,n-1)),err:'Thử lại.'}])).map(nbT),ans:0,exp:left?`n − ${n} = ${d}, n = ${m}.`:`${m} − n = ${d}, n = ${n}.`};});}
function genSun(){return tryGen(()=>{const e1=ri(18,22),e2=ri(5,8),r=e1-e2+1;
  return {stem:`Trái Đất có khối lượng khoảng ${E(`60 · ${W(10,e1)}`)} tấn. Mỗi giây Mặt Trời tiêu thụ khoảng ${E(`6 · ${W(10,e2)}`)} tấn khí hydrogen. Mặt Trời cần bao nhiêu giây để tiêu thụ một lượng khí hydrogen bằng khối lượng Trái Đất?`,opts:[{t:W(10,r)},{t:W(10,r-1),err:'60 = 6 · 10 nên còn một thừa số 10 nữa.'},{t:W(10,e1+e2+1),err:'Chia hai luỹ thừa cùng cơ số thì trừ các số mũ.'},{t:W(10,r+1),err:'Trừ lại các số mũ.'}],ans:0,exp:`60 · ${W(10,e1)} = 6 · ${W(10,e1+1)}; (6 · ${W(10,e1+1)}) : (6 · ${W(10,e2)}) = ${W(10,`${e1+1} − ${e2}`)} = ${W(10,r)} (giây).`};});}

/* ============ Ngân hàng nhiều lựa chọn ============ */
const MC=[];
const addMC=(id,topic,level,gen,mix)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},mix?{mix}:{}));
['a','b'].forEach(x=>{
  addMC('g_write_'+x,'dn','NB',genWrite);
  addMC('g_bexp_'+x,'dn','NB',genBaseExp);
  addMC('g_read_'+x,'dn','NB',genRead);
  addMC('g_val_'+x,'dn','NB',genVal);
  addMC('g_mixed_'+x,'dn','TH',genMixed);
  addMC('g_fexp_'+x,'dn','TH',genFindExp);
  addMC('g_table_'+x,'dn','TH',genTable);
  addMC('g_cell_'+x,'dn','VD',genCell);
  addMC('g_sq_'+x,'bp','NB',genSq);
  addMC('g_p10_'+x,'bp','NB',genPow10);
  addMC('g_perf_'+x,'bp','TH',genPerfect);
  addMC('g_expand_'+x,'bp','TH',genExpand,[2]);
  addMC('g_odd_'+x,'bp','VD',genOddSum);
  addMC('g_mul_'+x,'nh','NB',genMul);
  addMC('g_rule_'+x,'nh','NB',genRule);
  addMC('g_mul3_'+x,'nh','TH',genMul3);
  addMC('g_mulmix_'+x,'nh','TH',genMulMix);
  addMC('g_mulx_'+x,'nh','VD',genMulX);
  addMC('g_div_'+x,'ch','NB',genDiv);
  addMC('g_a0_'+x,'ch','NB',genA0);
  addMC('g_divmix_'+x,'ch','TH',genDivMix);
  addMC('g_1024_'+x,'ch','TH',gen1024);
  addMC('g_divx_'+x,'ch','VD',genDivX);
  addMC('g_sun_'+x,'ch','VD',genSun);
});
addMC('g_a1','dn','TH',genA1);
addMC('g_111','bp','VD',gen111);
addMC('g_a0f','ch','NB',FB_MC);

/* ============ Câu đúng sai ============ */
function tfStatic(pool,stem){return ()=>{const items=mixed(()=>shuffle(pool).slice(0,4).map(p=>sel(p)));return {stem,items:wrap(items)};};}
const POOL_A=[
  [IT('Luỹ thừa bậc n của a là tích của n thừa số bằng nhau, mỗi thừa số bằng a.',true,'dn','NB','Định nghĩa luỹ thừa.'),IT('Luỹ thừa bậc n của a là tích của a và n.',false,'dn','NB','a<sup>n</sup> = a · a · … · a (n thừa số).')],
  [IT('a<sup>2</sup> còn được gọi là a bình phương.',true,'bp','NB','Đây là chú ý trong SGK.'),IT('a<sup>2</sup> còn được gọi là a lập phương.',false,'bp','NB','a<sup>3</sup> mới là a lập phương.')],
  [IT('Trong luỹ thừa a<sup>n</sup>, a là cơ số, n là số mũ.',true,'dn','NB','Tên gọi trong luỹ thừa.'),IT('Trong luỹ thừa a<sup>n</sup>, a là số mũ, n là cơ số.',false,'dn','NB','a là cơ số, n là số mũ.')],
  [IT('Ta có a<sup>1</sup> = a.',true,'dn','NB','Chú ý trong SGK.'),IT('Ta có a<sup>1</sup> = 1.',false,'dn','NB','a<sup>1</sup> = a.')],
  [IT('Các số 0; 1; 4; 9; 16 là các số chính phương.',true,'bp','NB','Đó là 0<sup>2</sup>; 1<sup>2</sup>; 2<sup>2</sup>; 3<sup>2</sup>; 4<sup>2</sup>.'),IT('Các số 2; 4; 6; 8 là các số chính phương.',false,'bp','NB','2; 6; 8 không phải số chính phương.')]];
const POOL_B=[
  [IT('a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup>',true,'nh','NB','Nhân hai luỹ thừa cùng cơ số: cộng các số mũ.'),IT('a<sup>m</sup> · a<sup>n</sup> = a<sup>m · n</sup>',false,'nh','NB','Cộng các số mũ, không nhân.')],
  [IT('a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup> (a khác 0, m ≥ n)',true,'ch','NB','Chia hai luỹ thừa cùng cơ số: trừ các số mũ.'),IT('a<sup>m</sup> : a<sup>n</sup> = a<sup>m : n</sup> (a khác 0, m ≥ n)',false,'ch','NB','Trừ các số mũ, không chia.')],
  [IT('Người ta quy ước a<sup>0</sup> = 1 (a khác 0).',true,'ch','NB','Quy ước trong SGK.'),IT('Người ta quy ước a<sup>0</sup> = 0 (a khác 0).',false,'ch','NB','a<sup>0</sup> = 1.')],
  [IT('Phép nhân nhiều thừa số bằng nhau gọi là phép nâng lên luỹ thừa.',true,'dn','NB','Định nghĩa trong SGK.'),IT('Phép cộng nhiều số hạng bằng nhau gọi là phép nâng lên luỹ thừa.',false,'dn','NB','Đó là phép nhân nhiều thừa số bằng nhau.')]];
function tfVal(level){return ()=>{const items=mixed(()=>{const o=[];const used=new Set();for(let i=0;i<4;i++){const b=ri(2,level==='NB'?10:12),n=ri(2,b<4?8:b<7?4:3);const k=b+'^'+n;if(used.has(k))return null;used.add(k);const v=pw(b,n),ok=RNG()<.5,sh=ok?v:sel([b*n,pw(b,n-1),v+b].filter(z=>z!==v));
  o.push(IT(`${W(b,n)} = ${F(sh)}`,sh===v,'bp',level,`${W(b,n)} = ${rep(b,n)} = ${F(v)}.`));}return o;});return {stem:'Xét các đẳng thức sau:',items:wrap(items)};};}
function tfRule(){const items=mixed(()=>{const o=[],R=()=>RNG()<.5,b=ri(2,9),m=ri(3,9),n=ri(2,m-1),c=ri(2,9);
  {const v=R();o.push(IT(`${W(b,m)} · ${W(b,n)} = ${W(b,v?m+n:m*n)}`,v||m+n===m*n,'nh','TH','Cộng các số mũ.'));}
  {const v=R();o.push(IT(`${W(b,m)} : ${W(b,n)} = ${W(b,v?m-n:m+n)}`,v,'ch','TH','Trừ các số mũ.'));}
  {const v=R();o.push(IT(`${W(c,2)} · ${W(c,3)} · ${c} = ${W(c,v?6:5)}`,v,'nh','TH',`${c} = ${W(c,1)}: 2 + 3 + 1 = 6.`));}
  {const v=R();o.push(IT(`${W(b,n)} : ${W(b,n)} = ${v?1:0}`,v,'ch','TH',`${W(b,0)} = 1.`));}
  return o;});return {stem:'Xét các đẳng thức sau:',items:wrap(items)};}
function tfCmp(){const C=[[2,3,3,2],[2,5,5,2],[2,4,4,2],[3,4,4,3],[2,10,10,3],[3,3,5,2],[2,6,4,3],[10,2,2,7]];
  const items=mixed(()=>{const o=[];for(const [a,m,b,n] of shuffle(C).slice(0,4)){const x=pw(a,m),y=pw(b,n),s=sel(['<','>','=']),v=s==='<'?x<y:s==='>'?x>y:x===y;o.push(IT(`${W(a,m)} ${s} ${W(b,n)}`,v,'dn','TH',`${W(a,m)} = ${F(x)}, ${W(b,n)} = ${F(y)}.`));}return o;});
  return {stem:'Xét các khẳng định sau:',items:wrap(items)};}
function tfExpand(){let n;do{n=ri(1000,99999);}while(String(n).includes('0'));const L=String(n).length,d=String(n);
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`${F(n)} = ${v?expand(n):expand(n,1)}`,v,'bp','TH',`${F(n)} = ${expand(n)}.`));}
    {const v=R();o.push(IT(`Chữ số ${d[0]} trong số ${F(n)} có giá trị ${d[0]} · ${W(10,v?L-1:L)}.`,v,'bp','TH',`Chữ số đầu tiên ở hàng ${['','','chục','trăm','nghìn','chục nghìn'][L]}: ${d[0]} · ${W(10,L-1)}.`));}
    {const v=R();o.push(IT(`${W(10,L-1)} ${v?'<':'>'} ${F(n)}`,v,'bp','TH',`${W(10,L-1)} = ${F(P10(L-1))} < ${F(n)}.`));}
    {const v=R();o.push(IT(`${F(n)} ${v?'<':'>'} ${W(10,L)}`,v,'bp','TH',`${W(10,L)} = ${F(P10(L))}.`));}return o;});
  return {stem:`Cho số ${F(n)}. Xét các phát biểu sau:`,items:wrap(items)};}
function tfChess(){const k=ri(6,12);
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`Ô thứ ${k} có ${W(2,v?k-1:k)} hạt thóc.`,v,'dn','VD',`Ô thứ nhất có ${W(2,0)} hạt, ô thứ ${k} có ${W(2,k-1)} hạt.`));}
    {const v=R();o.push(IT(`Ô thứ 7 có ${v?64:128} hạt thóc.`,v,'dn','VD',`${W(2,6)} = 64.`));}
    {const v=R();o.push(IT(`Ba ô đầu tiên có tất cả ${v?7:8} hạt thóc.`,v,'dn','VD','1 + 2 + 4 = 7.'));}
    {const v=R();o.push(IT(`Số hạt ở ô thứ ${k} ${v?'gấp':'bằng'} ${v?4:2} lần số hạt ở ô thứ ${k-2}.`,v,'nh','VD',`${W(2,k-1)} : ${W(2,k-3)} = ${W(2,2)} = 4.`));}return o;});
  return {stem:'Trên bàn cờ, ô thứ nhất để 1 hạt thóc, ô thứ hai để 2 hạt, ô thứ ba để 4 hạt, … ô sau gấp đôi ô trước. Xét các phát biểu sau:',items:wrap(items)};}
function tfBact(){const t=sel([20,30]),h=ri(2,4),per=60/t,n0=sel([1,2,5]);
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5,k=per*h;
    {const v=R();o.push(IT(`Sau 1 giờ, số vi khuẩn là ${F(n0*pw(2,v?per:per+1))}.`,v,'nh','VD',`1 giờ có ${per} lần phân đôi: ${n0} · ${W(2,per)} = ${n0*pw(2,per)}.`));}
    {const v=R();o.push(IT(`Sau ${h} giờ, vi khuẩn đã phân đôi ${v?k:h} lần.`,v,'dn','VD',`Mỗi giờ phân đôi ${per} lần: ${per} · ${h} = ${k}.`));}
    {const v=R();o.push(IT(`Sau ${h} giờ, số vi khuẩn là ${n0===1?'':n0+' · '}${W(2,v?k:k+1)}.`,v,'nh','VD',`${n0===1?'':n0+' · '}${W(2,k)}.`));}
    {const v=R();o.push(IT(`Số vi khuẩn sau ${h} giờ gấp ${W(2,v?per:per+1)} lần số vi khuẩn sau ${h-1} giờ.`,v,'ch','VD',`${W(2,k)} : ${W(2,k-per)} = ${W(2,per)}.`));}return o;});
  return {stem:`Một loại vi khuẩn cứ ${t} phút lại phân đôi (1 con thành 2 con). Lúc đầu có ${n0} con. Xét các phát biểu sau:`,items:wrap(items)};}
function tfMusic(){const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`1 nốt tròn có trường độ bằng ${v?16:8} nốt móc kép.`,v,'dn','VD','1 tròn = 2<sup>4</sup> móc kép = 16 móc kép.'));}
    {const v=R();o.push(IT(`1 nốt tròn có trường độ bằng ${v?4:2} nốt đen.`,v,'dn','VD','1 tròn = 2<sup>2</sup> đen = 4 đen.'));}
    {const v=R();o.push(IT(`1 nốt trắng có trường độ bằng ${v?8:16} nốt móc kép.`,v,'nh','VD','1 trắng = 2<sup>3</sup> móc kép = 8 móc kép.'));}
    {const v=R();o.push(IT(`1 nốt tròn có trường độ bằng ${v?32:64} nốt móc ba.`,v,'nh','VD','1 tròn = 2 trắng, 1 trắng = 2<sup>4</sup> móc ba, nên 1 tròn = 2 · 2<sup>4</sup> = 2<sup>5</sup> = 32 móc ba.'));}return o;});
  return {stem:'Trong âm nhạc: 1 tròn = 2<sup>1</sup> trắng = 2<sup>2</sup> đen = 2<sup>3</sup> móc đơn = 2<sup>4</sup> móc kép; 1 trắng = 2<sup>1</sup> đen = 2<sup>2</sup> móc đơn = 2<sup>3</sup> móc kép = 2<sup>4</sup> móc ba. Xét các phát biểu sau:',items:wrap(items)};}
const TF=[];
const addTF=(id,topic,level,gen,mix)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},mix?{mix}:{}));
['a','b'].forEach(x=>{
  addTF('tf_a_nb_'+x,'dn','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));
  addTF('tf_b_nb_'+x,'nh','NB',tfStatic(POOL_B,'Xét các phát biểu sau:'));
  addTF('tf_val_nb_'+x,'bp','NB',tfVal('NB'));
  addTF('tf_rule_th_'+x,'nh','TH',tfRule);
  addTF('tf_cmp_th_'+x,'dn','TH',tfCmp);
  addTF('tf_bact_'+x,'nh','VD',tfBact);
});
addTF('tf_rule_th_c','ch','TH',tfRule);
addTF('tf_exp_th','bp','TH',tfExpand,[2]);
addTF('tf_val_th','bp','TH',tfVal('TH'));
addTF('tf_chess_vd','dn','VD',tfChess);
addTF('tf_music_vd','ch','VD',tfMusic);

/* ============ Câu trả lời ngắn ============ */
const SA=[
 {id:'s_dn_nb',topic:'dn',level:'NB',unit:'',gen:()=>{const b=ri(2,9),n=ri(2,b<4?8:4);return{stem:`Tính ${W(b,n)}.`,ans:[pw(b,n)],exp:`${W(b,n)} = ${rep(b,n)} = ${F(pw(b,n))}.`};}},
 {id:'s_dn_th',topic:'dn',level:'TH',unit:'',gen:()=>{const b=ri(2,5),n=ri(2,5);return{stem:`Biết ${E(rep(b,n)+' · '+b*b)} = ${W(b,'n')}. Tìm n.`,ans:[n+2],exp:`${b*b} = ${b} · ${b}, nên có ${n} + 2 = ${n+2} thừa số ${b}.`};}},
 {id:'s_dn_vd',topic:'dn',level:'VD',unit:'hạt',gen:()=>{const k=ri(6,14);return{stem:`Trên bàn cờ, ô thứ nhất để 1 hạt thóc, ô sau gấp đôi ô trước. Ô thứ ${k} có bao nhiêu hạt thóc?`,ans:[pw(2,k-1)],exp:`${W(2,k-1)} = ${F(pw(2,k-1))}.`};}},
 {id:'s_bp_nb',topic:'bp',level:'NB',unit:'',gen:()=>{const a=ri(2,20),c=RNG()<.4&&a<=10;return{stem:`Tính ${c?'lập':'bình'} phương của ${a}.`,ans:[c?a*a*a:a*a],exp:`${W(a,c?3:2)} = ${F(c?a*a*a:a*a)}.`};}},
 {id:'s_bp_th',topic:'bp',level:'TH',unit:'',gen:()=>{const k=ri(4,12);return{stem:`Tính tổng ${E(range(1,k).map(i=>2*i-1).join(' + '))}.`,ans:[k*k],exp:`Tổng ${k} số lẻ đầu tiên bằng ${W(k,2)} = ${k*k}.`};}},
 {id:'s_bp_th2',topic:'bp',level:'TH',unit:'',mix:[2],gen:()=>{const a=ri(1,9),b=ri(1,9),c=ri(1,9),e=ri(4,6);return{stem:`Viết số ${E(`${a} · ${W(10,e)} + ${b} · ${W(10,2)} + ${c}`)} bằng chữ số.`,ans:[a*P10(e)+b*100+c],exp:`${F(a*P10(e))} + ${b*100} + ${c} = ${F(a*P10(e)+b*100+c)}.`};}},
 {id:'s_bp_vd',topic:'bp',level:'VD',unit:'số',mix:[1,3],gen:()=>{const a=ri(10,200),b=a+ri(100,600);const L=[];for(let k=0;k*k<=b;k++)if(k*k>=a)L.push(k*k);return{stem:`Có bao nhiêu số chính phương x thoả mãn ${nb(`${a} ≤ x ≤ ${b}`)}?`,ans:[L.length],exp:`Đó là ${L.map(F).join('; ')}: ${L.length} số.`};}},
 {id:'s_nh_nb',topic:'nh',level:'NB',unit:'',gen:()=>{const b=ri(2,9),m=ri(2,9),n=ri(2,9);return{stem:`Biết ${E(`${W(b,m)} · ${W(b,n)} = ${W(b,'k')}`)}. Tìm k.`,ans:[m+n],exp:`k = ${m} + ${n} = ${m+n}.`};}},
 {id:'s_nh_th',topic:'nh',level:'TH',unit:'',gen:()=>{const b=ri(2,9),m=ri(2,7),n=ri(2,7);return{stem:`Tìm số tự nhiên n, biết ${E(`${W(b,m)} · ${W(b,'n')} = ${W(b,m+n)}`)}.`,ans:[n],exp:`${m} + n = ${m+n}, n = ${n}.`};}},
 {id:'s_nh_vd',topic:'nh',level:'VD',unit:'con',gen:()=>{const t=sel([20,30]),h=ri(1,3),per=60/t;return{stem:`Một loại vi khuẩn cứ ${t} phút lại phân đôi. Lúc đầu có 1 con. Sau ${h} giờ có bao nhiêu con vi khuẩn?`,ans:[pw(2,per*h)],exp:`${h} giờ có ${per*h} lần phân đôi: ${W(2,per*h)} = ${pw(2,per*h)} con.`};}},
 {id:'s_ch_nb',topic:'ch',level:'NB',unit:'',gen:()=>{const b=ri(2,9),n=ri(2,8),m=n+ri(1,8);return{stem:`Biết ${E(`${W(b,m)} : ${W(b,n)} = ${W(b,'k')}`)}. Tìm k.`,ans:[m-n],exp:`k = ${m} − ${n} = ${m-n}.`};}},
 {id:'s_ch_th',topic:'ch',level:'TH',unit:'',gen:()=>{const up=RNG()<.5;return{stem:`Biết ${W(2,10)} = 1 024. Tính ${W(2,up?11:9)}.`,ans:[up?2048:512],exp:`${W(2,up?11:9)} = 1 024 ${up?'·':':'} 2 = ${up?'2 048':512}.`};}},
 {id:'s_ch_vd',topic:'ch',level:'VD',unit:'',gen:()=>{const e1=ri(18,22),e2=ri(5,8);return{stem:`Trái Đất có khối lượng khoảng ${E(`60 · ${W(10,e1)}`)} tấn; mỗi giây Mặt Trời tiêu thụ khoảng ${E(`6 · ${W(10,e2)}`)} tấn khí hydrogen. Thời gian để Mặt Trời tiêu thụ lượng khí bằng khối lượng Trái Đất là ${W(10,'n')} giây. Tìm n.`,ans:[e1+1-e2],exp:`60 · ${W(10,e1)} = 6 · ${W(10,e1+1)}; (6 · ${W(10,e1+1)}) : (6 · ${W(10,e2)}) = ${W(10,e1+1-e2)}.`};}},
 {id:'s_ch_vd2',topic:'ch',level:'VD',unit:'tế bào',gen:()=>{const k=ri(2,6);return{stem:`Mỗi giây cơ thể người tạo ra khoảng ${E(`25 · ${W(10,5)}`)} tế bào hồng cầu. Hỏi trong ${k} phút cơ thể tạo ra bao nhiêu tế bào hồng cầu?`,ans:[2500000*60*k],exp:`${k} phút = ${60*k} giây; ${60*k} · 2 500 000 = ${F(2500000*60*k)}.`};}},
 {id:'s_dn_th2',topic:'dn',level:'TH',unit:'',gen:()=>{const b=sel([2,3,5]),n=ri(3,b===2?9:5);return{stem:`Tìm số tự nhiên n, biết ${E(`${W(b,'n')} = ${F(pw(b,n))}`)}.`,ans:[n],exp:`${F(pw(b,n))} = ${W(b,n)}.`};}},
 {id:'s_mx_set',topic:'bp',level:'VD',unit:'phần tử',mix:[1,3],gen:()=>{const N=ri(20,300);let c=0;while(c*c<N)c++;return{stem:`Tập hợp ${nb(`{x ∈ ℕ | ${W('x',2)} < ${N}}`)} có bao nhiêu phần tử?`,ans:[c],exp:`x = 0; 1; …; ${c-1} (vì ${W(c-1,2)} = ${(c-1)*(c-1)} < ${N} ≤ ${W(c,2)} = ${c*c}): ${c} phần tử.`};}},
 {id:'s_mx_rem',topic:'ch',level:'VD',unit:'',mix:[5],gen:()=>{const b=sel([2,3]),n=ri(4,b===2?10:6),d=ri(5,13),v=pw(b,n);return{stem:`Tìm số dư khi chia ${W(b,n)} cho ${d}.`,ans:[v%d],exp:`${W(b,n)} = ${F(v)} = ${d} · ${fl(v/d)} + ${v%d}.`};}}
].map(q=>Object.assign({type:'sa'},q));

/* ============ Chủ đề ============ */
const TOPICS={
  dn:{short:'Luỹ thừa',name:'Luỹ thừa, cơ số, số mũ',rule:'Luỹ thừa bậc n của a là tích của n thừa số bằng nhau, mỗi thừa số bằng a: a<sup>n</sup> = a · a · … · a (n thừa số, n ∈ ℕ*). a<sup>n</sup> đọc là "a mũ n" hoặc "a luỹ thừa n"; a là cơ số, n là số mũ. Ta có a<sup>1</sup> = a.',tip:'a<sup>n</sup> không phải a · n: 2<sup>5</sup> = 32, còn 2 · 5 = 10.'},
  bp:{short:'Bình phương, lập phương',name:'Bình phương, lập phương, luỹ thừa của 10',rule:'a<sup>2</sup> còn gọi là a bình phương, a<sup>3</sup> còn gọi là a lập phương. Các số 0; 1; 4; 9; 16; … là các số chính phương. 100 = 10<sup>2</sup>; 1 000 = 10<sup>3</sup>; … Có thể viết 4 257 = 4 · 10<sup>3</sup> + 2 · 10<sup>2</sup> + 5 · 10 + 7.',tip:'10<sup>n</sup> là số 1 với n chữ số 0 phía sau.'},
  nh:{short:'Nhân luỹ thừa',name:'Nhân hai luỹ thừa cùng cơ số',rule:'Khi nhân hai luỹ thừa cùng cơ số, ta giữ nguyên cơ số và cộng các số mũ: a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup>.',tip:'Viết các số về cùng một cơ số trước: 2<sup>4</sup> · 8 = 2<sup>4</sup> · 2<sup>3</sup> = 2<sup>7</sup>.'},
  ch:{short:'Chia luỹ thừa',name:'Chia hai luỹ thừa cùng cơ số',rule:'Khi chia hai luỹ thừa cùng cơ số (khác 0), ta giữ nguyên cơ số và lấy số mũ của số bị chia trừ số mũ của số chia: a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup> (a khác 0, m ≥ n). Quy ước a<sup>0</sup> = 1 (a khác 0).',tip:'a<sup>n</sup> : a<sup>n</sup> = a<sup>0</sup> = 1, không phải 0.'}
};
const TKEYS=['dn','bp','nh','ch'];
const TDESC={dn:'Viết tích thành luỹ thừa, cơ số, số mũ, tính giá trị',bp:'Bình phương, lập phương, số chính phương, luỹ thừa của 10',nh:'Nhân hai luỹ thừa cùng cơ số',ch:'Chia hai luỹ thừa cùng cơ số, a<sup>0</sup> = 1'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Cơ số, số mũ, cách đọc, tính giá trị luỹ thừa nhỏ, quy tắc nhân chia.',TH:'Đưa về cùng cơ số rồi nhân chia, viết số bằng luỹ thừa của 10, số chính phương.',VD:'Tìm số mũ, bàn cờ hạt thóc, vi khuẩn phân đôi, bài toán khoa học với luỹ thừa của 10.'};

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
function tfHard(){for(;;){const N=sel([100,500,1000,5000]),c2=(()=>{let n=0;while(pw(2,n)<N)n++;return n;})(),x=ri(2,6),s=3*pw(2,x),k=ri(4,8);
  const P=[
    [IT(`Có ${c2} số tự nhiên n thoả mãn ${W(2,'n')} < ${F(N)}.`,true,'dn','VD',`n = 0; 1; …; ${c2-1}.`),IT(`Có ${c2-1} số tự nhiên n thoả mãn ${W(2,'n')} < ${F(N)}.`,false,'dn','VD',`Đừng quên n = 0: ${W(2,0)} = 1.`)],
    [IT(`Nếu ${W(2,'x')} + ${W(2,'x + 1')} = ${s} thì x = ${x}.`,true,'nh','VD',`${W(2,'x')} + 2 · ${W(2,'x')} = 3 · ${W(2,'x')} = ${s}, ${W(2,'x')} = ${s/3}.`),IT(`Nếu ${W(2,'x')} + ${W(2,'x + 1')} = ${s} thì x = ${x+1}.`,false,'nh','VD',`3 · ${W(2,'x')} = ${s} nên ${W(2,'x')} = ${s/3} = ${W(2,x)}.`)],
    [IT(`1 + 2 + ${W(2,2)} + … + ${W(2,k)} = ${W(2,k+1)} − 1`,true,'nh','VD',`Ví dụ 1 + 2 + 4 = 7 = 8 − 1.`),IT(`1 + 2 + ${W(2,2)} + … + ${W(2,k)} = ${W(2,k+1)}`,false,'nh','VD',`Tổng bằng ${W(2,k+1)} − 1.`)],
    [IT(`${W(2,30)} < ${W(3,20)}`,true,'dn','VD',`${W(2,30)} là tích của 10 thừa số 8 (mỗi nhóm 2 · 2 · 2 = 8); ${W(3,20)} là tích của 10 thừa số 9 (mỗi nhóm 3 · 3 = 9).`),IT(`${W(2,30)} > ${W(3,20)}`,false,'dn','VD',`${W(2,30)} gồm 10 thừa số 8, ${W(3,20)} gồm 10 thừa số 9, nên ${W(2,30)} < ${W(3,20)}.`)],
    [IT('Số chính phương không thể có chữ số tận cùng là 2.',true,'bp','VD','Chữ số tận cùng của a<sup>2</sup> chỉ có thể là 0; 1; 4; 5; 6; 9.'),IT('Có số chính phương có chữ số tận cùng là 7.',false,'bp','VD','Chữ số tận cùng của a<sup>2</sup> chỉ có thể là 0; 1; 4; 5; 6; 9.')]];
  const its=wrap(shuffle(P).slice(0,4).map(p=>sel(p)));if(tfOK(its))return {stem:'Xét các phát biểu sau:',items:its};}}
const HARD={tf:[{id:'h_kn',type:'tf',topic:'dn',level:'VD',gen:tfHard}],sa:[
 {id:'h_cnt',topic:'dn',level:'VD',unit:'số',gen:()=>{const b=sel([2,3]),N=ri(50,5000);let c=0;while(pw(b,c)<N)c++;return{stem:`Có bao nhiêu số tự nhiên n thoả mãn ${nb(`${W(b,'n')} < ${F(N)}`)}?`,ans:[c],exp:`${W(b,c-1)} = ${F(pw(b,c-1))} < ${F(N)} ≤ ${W(b,c)} = ${F(pw(b,c))}; n = 0; 1; …; ${c-1}: có ${c} số (nhớ ${W(b,0)} = 1).`};}},
 {id:'h_sum2',topic:'nh',level:'VD',unit:'',gen:()=>{const x=ri(2,8),k=sel([1,2]),s=pw(2,x)*(1+pw(2,k));return{stem:`Tìm số tự nhiên x, biết ${E(`${W(2,'x')} + ${W(2,`x + ${k}`)} = ${F(s)}`)}.`,ans:[x],exp:`${W(2,`x + ${k}`)} = ${W(2,k)} · ${W(2,'x')}, nên ${1+pw(2,k)} · ${W(2,'x')} = ${F(s)}, ${W(2,'x')} = ${pw(2,x)} = ${W(2,x)}.`};}},
 {id:'h_geo',topic:'nh',level:'VD',unit:'',gen:()=>{const k=ri(5,12);return{stem:`Tính tổng ${E(`1 + 2 + ${W(2,2)} + ${W(2,3)} + … + ${W(2,k)}`)}.`,ans:[pw(2,k+1)-1],exp:`Gọi tổng là S. 2S − S = ${W(2,k+1)} − 1 = ${F(pw(2,k+1)-1)}.`};}},
 {id:'h_last',topic:'bp',level:'VD',unit:'',gen:()=>{const b=sel([2,3,7,4,9]),n=ri(5,30);let r=1;for(let i=0;i<n;i++)r=r*b%10;return{stem:`Tìm chữ số tận cùng của ${W(b,n)}.`,ans:[r],exp:`Chữ số tận cùng của các luỹ thừa của ${b} lặp lại theo chu kì; chữ số tận cùng của ${W(b,n)} là ${r}.`};}},
 {id:'h_odd',topic:'bp',level:'VD',unit:'',gen:()=>{const k=ri(20,60);return{stem:`Tổng ${E(`1 + 3 + 5 + … + ${2*k-1}`)} là bình phương của số tự nhiên nào?`,ans:[k],exp:`Có ${k} số lẻ từ 1 đến ${2*k-1}, nên tổng bằng ${W(k,2)}.`};}},
 {id:'h_x',topic:'ch',level:'VD',unit:'',gen:()=>{const b=sel([2,3,5]),a=ri(1,4),x=ri(1,5),m=x+a+ri(1,3);const r=m-a;return{stem:`Tìm số tự nhiên x, biết ${E(`${W(b,`x + ${a}`)} = ${W(b,m)} : ${W(b,m-x-a)}`)}.`,ans:[x],exp:`Vế phải bằng ${W(b,x+a)}, nên x + ${a} = ${x+a}, x = ${x}.`};}}
].map(q=>Object.assign({type:'sa'},q))};

const qsOK=u=>u.qs.every(q=>q.type!=='mc'||(q.opts.length===4&&new Set(q.opts.map(o=>o.t)).size===4));
const PISA=[
 ()=>{for(;;){const k=ri(8,12),j=ri(5,7),N=sel([100,500,1000]);let f=1;while(pw(2,f-1)<=N)f++;
   const u={title:'Hạt thóc trên bàn cờ',ctx:`<p class="stem">Người phát minh ra bàn cờ vua chọn phần thưởng: ô thứ nhất để 1 hạt thóc, ô thứ hai để 2 hạt, ô thứ ba để 4 hạt, ô thứ tư để 8 hạt, … ô sau gấp đôi ô trước.</p>${tbl(['Ô thứ','Phép tính tìm số hạt thóc','Số hạt thóc'],[['1','1','1'],['2','2','2'],['3','2 · 2','4'],['4','2 · 2 · 2','8'],['5','2 · 2 · 2 · 2','16']])}`,qs:[
    saq(`Ô thứ ${j} có bao nhiêu hạt thóc?`,pw(2,j-1),'hạt',`${W(2,j-1)} = ${pw(2,j-1)}.`,'dn','NB'),
    mcq(`Số hạt thóc ở ô thứ ${k} viết dưới dạng luỹ thừa là:`,W(2,k-1),[[W(2,k),`Ô thứ nhất là ${W(2,0)} nên ô thứ ${k} là ${W(2,k-1)}.`],[W(k,2),'Cơ số là 2.'],[`2 · ${k}`,'Gấp đôi nhiều lần là nhân nhiều thừa số 2.']],`Từ ô 1 đến ô ${k} có ${k-1} lần gấp đôi: ${W(2,k-1)}.`,'dn','TH'),
    saq(`Ô đầu tiên có nhiều hơn ${F(N)} hạt thóc là ô thứ mấy?`,f,'',`${W(2,f-2)} = ${F(pw(2,f-2))} ≤ ${F(N)} < ${W(2,f-1)} = ${F(pw(2,f-1))}: ô thứ ${f}.`,'dn','VD'),
    mcq(`Số hạt ở ô thứ ${k} gấp bao nhiêu lần số hạt ở ô thứ ${j}?`,W(2,k-j),[[W(2,k+j-2),'Chia hai luỹ thừa thì trừ các số mũ.'],[`${k-j}`,`Mỗi ô gấp đôi ô trước, sau ${k-j} ô thì gấp ${W(2,k-j)} lần.`],[W(2,k-j+1),'Trừ lại các số mũ.']],`${W(2,k-1)} : ${W(2,j-1)} = ${W(2,k-j)}.`,'ch','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const t=sel([20,30]),per=60/t,n0=sel([1,3,5]),h=ri(2,3);
   const rows=range(0,4).map(i=>[`${i*t} phút`,F(n0*pw(2,i))]);
   const u={title:'Vi khuẩn phân đôi',ctx:`<p class="stem">Trong phòng thí nghiệm, một loại vi khuẩn cứ ${t} phút lại phân đôi một lần (mỗi con thành 2 con). Bảng sau ghi số vi khuẩn trong những lần đếm đầu tiên.</p>${tbl(['Thời gian','Số vi khuẩn'],rows)}`,qs:[
    saq(`Sau ${5*t} phút có bao nhiêu con vi khuẩn?`,n0*pw(2,5),'con',`${n0} · ${W(2,5)} = ${n0*pw(2,5)}.`,'dn','TH'),
    mcq(`Sau ${h} giờ, số vi khuẩn là:`,n0===1?W(2,per*h):`${n0} · ${W(2,per*h)}`,[[n0===1?W(2,h):`${n0} · ${W(2,h)}`,`Mỗi giờ phân đôi ${per} lần.`],[n0===1?W(2,per*h+1):`${n0} · ${W(2,per*h+1)}`,'Đếm lại số lần phân đôi.'],[n0===1?`2 · ${per*h}`:`${n0} · 2 · ${per*h}`,'Phân đôi nhiều lần là nhân nhiều thừa số 2.']],`${h} giờ có ${per*h} lần phân đôi.`,'nh','VD'),
    saq(`Số vi khuẩn sau ${h} giờ gấp bao nhiêu lần số vi khuẩn sau ${h-1} giờ?`,pw(2,per),'lần',`${W(2,per*h)} : ${W(2,per*(h-1))} = ${W(2,per)} = ${pw(2,per)}.`,'ch','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const k=sel([2,4,8]),mb=ri(3,9)*100;
   const u={title:'Dung lượng bộ nhớ',ctx:`<p class="stem">Trong máy tính, dung lượng bộ nhớ được đo bằng byte. Bảng sau ghi mối liên hệ giữa các đơn vị.</p>${tbl(['Đơn vị','Bằng'],[['1 KB (kilôbai)',`${W(2,10)} byte = 1 024 byte`],['1 MB (mêgabai)',`${W(2,10)} KB`],['1 GB (gigabai)',`${W(2,10)} MB`]])}`,qs:[
    mcq('1 MB bằng bao nhiêu byte?',`${W(2,20)} byte`,[[`${W(2,100)} byte`,'Nhân hai luỹ thừa thì cộng các số mũ: 10 + 10.'],[`${W(4,10)} byte`,'Giữ nguyên cơ số 2.'],[`${W(2,10)} byte`,'Đây là 1 KB.']],`1 MB = ${W(2,10)} · ${W(2,10)} byte = ${W(2,20)} byte.`,'nh','TH'),
    mcq('1 GB bằng bao nhiêu KB?',`${W(2,20)} KB`,[[`${W(2,30)} KB`,'Đây là số byte.'],[`${W(2,10)} KB`,'1 GB = 2<sup>10</sup> MB, mỗi MB = 2<sup>10</sup> KB.'],[`${W(2,100)} KB`,'Cộng các số mũ.']],`1 GB = ${W(2,10)} MB = ${W(2,10)} · ${W(2,10)} KB = ${W(2,20)} KB.`,'nh','VD'),
    saq(`Một thẻ nhớ ${k} GB. Dung lượng đó bằng bao nhiêu MB?`,k*1024,'MB',`${k} · 1 024 = ${F(k*1024)}.`,'dn','TH'),
    saq(`Một ổ đĩa có dung lượng ${W(2,30+(k===2?1:k===4?2:3))} byte. Dung lượng đó bằng bao nhiêu GB?`,k,'GB',`1 GB = ${W(2,10)} · ${W(2,10)} · ${W(2,10)} byte = ${W(2,30)} byte; ${W(2,30+(k===2?1:k===4?2:3))} : ${W(2,30)} = ${W(2,k===2?1:k===4?2:3)} = ${k}.`,'ch','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const a=ri(3,9),b=ri(2,a-1),c=ri(2,6);if(a===b)continue;
   const u={title:'Xếp hộp hình lập phương',ctx:`<p class="stem">Một xưởng đóng các thùng hình lập phương. Mỗi thùng được xếp đầy các hộp nhỏ hình lập phương cạnh 1 dm. Thùng có cạnh n dm thì chứa đúng n · n · n = ${W('n',3)} hộp nhỏ.</p>${tbl(['Loại thùng','Cạnh (dm)'],[['Thùng lớn',a],['Thùng nhỏ',b]])}`,qs:[
    saq('Thùng lớn chứa bao nhiêu hộp nhỏ?',a*a*a,'hộp',`${W(a,3)} = ${a*a*a}.`,'bp','NB'),
    mcq('Một mặt đáy của thùng nhỏ có bao nhiêu hộp nhỏ?',`${b*b}`,[[`${b*b*b}`,'Đây là số hộp của cả thùng.'],[`${2*b}`,`Mặt đáy có ${b} hàng, mỗi hàng ${b} hộp: ${W(b,2)}.`],[`${4*b}`,'Đây không phải số hộp trên mặt đáy.']],`${W(b,2)} = ${b*b}.`,'bp','TH'),
    saq(`Xưởng đóng ${c} thùng lớn và ${c} thùng nhỏ. Cần tất cả bao nhiêu hộp nhỏ?`,c*(a*a*a+b*b*b),'hộp',`${c} · ${W(a,3)} + ${c} · ${W(b,3)} = ${c*a*a*a} + ${c*b*b*b} = ${c*(a*a*a+b*b*b)}.`,'bp','VD')]};if(qsOK(u))return u;}}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'dn',fig:'<div class="figbox"><p>3 · 3 · 3 · 3 · 3 = 3<sup>5</sup>: cơ số 3, số mũ 5</p><p>3<sup>5</sup> đọc là "3 mũ 5" hoặc "3 luỹ thừa 5"</p></div>',extra:'a<sup>1</sup> = a.'},
  {k:'bp',fig:'<div class="figbox"><p>11<sup>2</sup> = 11 · 11 = 121 (11 bình phương)</p><p>4 257 = 4 · 10<sup>3</sup> + 2 · 10<sup>2</sup> + 5 · 10 + 7</p></div>',extra:'Các số 0; 1; 4; 9; 16; … là các số chính phương.'},
  {k:'nh',fig:'<div class="figbox"><p>5<sup>6</sup> · 5<sup>3</sup> = 5<sup>6 + 3</sup> = 5<sup>9</sup></p><p>10<sup>5</sup> · 10<sup>4</sup> · 10<sup>2</sup> = 10<sup>11</sup></p></div>',extra:'Giữ nguyên cơ số, cộng các số mũ.'},
  {k:'ch',fig:'<div class="figbox"><p>2<sup>6</sup> : 2<sup>3</sup> = 2<sup>6 − 3</sup> = 2<sup>3</sup></p><p>10<sup>7</sup> : 10<sup>4</sup> = 10<sup>3</sup></p></div>',extra:'Quy ước a<sup>0</sup> = 1 (a khác 0).'}
];

/* ============ Câu kết hợp kiến thức bài trước (Bài 1–5) ============ */
function x6Cmp(){return tryGen(()=>{const C=[[2,5,5,2],[2,3,3,2],[3,4,4,3],[2,6,6,2],[2,7,5,3],[3,3,5,2],[2,10,10,3],[4,3,8,2],[2,9,3,6]];const [a,m,b,n]=sel(C),x=pw(a,m),y=pw(b,n),r=x<y?'<':x>y?'>':'=';
  return {stem:`So sánh ${W(a,m)} và ${W(b,n)}:`,opts:[{t:`${W(a,m)} ${r} ${W(b,n)}`}].concat(['<','>','='].filter(z=>z!==r).map(z=>({t:`${W(a,m)} ${z} ${W(b,n)}`,err:`Tính giá trị: ${W(a,m)} = ${F(x)}, ${W(b,n)} = ${F(y)}.`})),[{t:'Không so sánh được',err:'Tính giá trị của mỗi luỹ thừa rồi so sánh.'}]).map(nbT),ans:0,exp:`${W(a,m)} = ${F(x)}, ${W(b,n)} = ${F(y)}, nên ${W(a,m)} ${r} ${W(b,n)}.`};});}
function x6SetPow(){return tryGen(()=>{const b=sel([2,3]),N=ri(20,300),L=[];for(let k=0;pw(b,k)<N;k++)L.push(pw(b,k));
  return {stem:`Viết tập hợp A các luỹ thừa của ${b} (có số mũ tự nhiên) nhỏ hơn ${N}:`,opts:[{t:'A = '+SET(L)}].concat(pickOpts('A = '+SET(L),[{t:'A = '+SET(L.slice(1)),err:`${W(b,0)} = 1 cũng là một luỹ thừa của ${b}.`},{t:'A = '+SET(L.concat([L[L.length-1]*b])),err:`${L[L.length-1]*b} không nhỏ hơn ${N}.`},{t:'A = '+SET(L.map((_,i)=>b*i).filter(x=>x<N)),err:`Luỹ thừa của ${b} là tích các thừa số ${b}, không phải các bội của ${b}.`},{t:'A = '+SET(L.slice(0,-1)),err:`${L[L.length-1]} < ${N} nên thuộc A.`}])).map(nbT),ans:0,exp:`${L.map((x,i)=>`${W(b,i)} = ${x}`).join('; ')}; ${W(b,L.length)} = ${pw(b,L.length)} ≥ ${N}.`};});}
function x6Rem(){return tryGen(()=>{const b=sel([2,3,5]),n=ri(3,b===2?10:b===3?6:4),d=ri(3,11),v=pw(b,n),q=fl(v/d),r=v%d;
  return {stem:`Phép chia ${W(b,n)} : ${d} có thương và số dư là:`,opts:[{t:`Thương ${F(q)}, số dư ${r}`}].concat(pickOpts(`Thương ${F(q)}, số dư ${r}`,[{t:`Thương ${F(q)}, số dư ${(r+1)%d}`,err:`${W(b,n)} = ${F(v)} = ${d} · ${F(q)} + ${r}.`},{t:`Thương ${F(q-1)}, số dư ${r+d}`,err:'Số dư phải nhỏ hơn số chia.'},{t:`Thương ${F(fl(b*n/d))}, số dư ${b*n%d}`,err:`${W(b,n)} = ${F(v)}, không phải ${b} · ${n}.`},{t:`Thương ${F(q+1)}, số dư ${r}`,err:'Tính lại thương.'}])),ans:0,exp:`${W(b,n)} = ${F(v)} = ${d} · ${F(q)} + ${r}.`};});}
function x6Sum(){return tryGen(()=>{const a=ri(2,5),m=ri(2,4),b=ri(2,5),n=ri(2,4);if(a===b)return null;const x=pw(a,m),y=pw(b,n),s=x+y;
  return {stem:`Tổng của ${W(a,m)} và ${W(b,n)} bằng:`,opts:[{t:F(s)}].concat(pickOpts(F(s),[{t:F(a*m+b*n),err:`${W(a,m)} = ${x}, không phải ${a} · ${m}.`},{t:F(pw(a+b,m+n)),err:'Không cộng các cơ số và các số mũ; tính từng luỹ thừa rồi cộng.'},{t:F(s+a),err:'Tính lại.'},{t:F(Math.abs(x-y)),err:'Đề bài hỏi tổng.'}])),ans:0,exp:`${W(a,m)} = ${x}, ${W(b,n)} = ${y}; tổng: ${x} + ${y} = ${s}.`};});}
[['x6_cmp','dn','TH',x6Cmp,[3]],['x6_setpow','dn','VD',x6SetPow,[1,3]],['x6_rem','ch','VD',x6Rem,[5]],['x6_sum','dn','TH',x6Sum,[4]]].forEach(([id,t,l,g,mx])=>{['a','b'].forEach(s=>{MC.push({id:id+'_'+s,type:'mc',topic:t,level:l,gen:g,mix:mx});});});
function tfX6(){const b=sel([2,3]),N=ri(30,250),L=[];for(let k=0;pw(b,k)<N;k++)L.push(pw(b,k));
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`A có ${v?L.length:L.length-1} phần tử.`,v,'dn','VD',`A = ${SET(L)}.`));}
    {const v=R();o.push(IT(`${v?1:0} ∈ A`,v,'dn','VD',`${W(b,0)} = 1 ∈ A; 0 không phải luỹ thừa của ${b}.`));}
    {const v=R(),s=sum(L);o.push(IT(`Tổng các phần tử của A là ${v?s:s+1}.`,v,'nh','VD',`${L.join(' + ')} = ${s}.`));}
    {const v=R(),mx=L[L.length-1];o.push(IT(`Phần tử lớn nhất của A là ${W(b,v?L.length-1:L.length)}.`,v,'dn','VD',`${W(b,L.length-1)} = ${mx} < ${N} ≤ ${pw(b,L.length)}.`));}return o;});
  return {stem:`Gọi A là tập hợp các luỹ thừa của ${b} (số mũ tự nhiên) nhỏ hơn ${N}. Xét các phát biểu sau:`,items:wrap(items)};}
['a','b'].forEach(s=>TF.push({id:'x6_tf_'+s,type:'tf',topic:'dn',level:'VD',gen:tfX6,mix:[1,3]}));
SA.push(
 {id:'x6_s_dig',type:'sa',topic:'bp',level:'TH',unit:'chữ số',mix:[2],gen:()=>{const n=ri(3,12),k=ri(2,9);return{stem:`Số ${k} · ${W(10,n)} có bao nhiêu chữ số?`,ans:[n+1],exp:`${k} · ${W(10,n)} là chữ số ${k} và ${n} chữ số 0 phía sau: ${n+1} chữ số.`};}},
 {id:'x6_s_cnt',type:'sa',topic:'dn',level:'VD',unit:'số',mix:[3],gen:()=>{const C=shuffle([[2,5],[3,3],[5,2],[4,3],[2,6],[6,2],[3,4],[10,2]]).slice(0,5),K=ri(20,90);return{stem:`Trong các số ${C.map(c=>W(c[0],c[1])).join('; ')}, có bao nhiêu số lớn hơn ${K}?`,ans:[C.filter(c=>pw(c[0],c[1])>K).length],exp:`Giá trị: ${C.map(c=>`${W(c[0],c[1])} = ${pw(c[0],c[1])}`).join('; ')}.`};}});
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='lu6_seen';
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
  const mcSlots=[['dn',['NB']],['bp',['NB','TH']],['nh',['NB','TH']],['ch',['NB']],['ch',['TH']],[null,['VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['dn','bp','nh'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=[
    pick(MC.filter(q=>q.topic==='dn'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='bp'&&q.level!=='VD'),used),
    pick(MC.filter(q=>q.topic==='nh'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='ch'&&q.level==='TH'),used)
  ];
  const sa=[pick(SA.filter(q=>q.topic==='dn'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='ch'&&q.level!=='VD'),used)];
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
