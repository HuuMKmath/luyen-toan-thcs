// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ phep-cong-tru-so-nguyen/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "phep-cong-tru-so-nguyen";
export const TIEN_TO = "PC6-";

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

/* ============ Số nguyên: cách viết ============ */
const N=x=>x<0?'−'+(-x):''+x;          // viết số nguyên, số âm dùng dấu trừ "−"
const L=a=>a.map(N).join('; ');
const P=x=>x<0?'('+N(x)+')':N(x);       // số âm đặt trong ngoặc khi đứng sau dấu phép tính
const nb=s=>s.replace(/ /g,' ');   // khoảng trắng không ngắt dòng, để phép tính không bị tách đôi
const ADD=(a,b)=>nb(N(a)+' + '+P(b));
const SUB=(a,b)=>nb(N(a)+' − '+P(b));
const SUMX=v=>nb(v.map((x,i)=>i===0?N(x):'+ '+P(x)).join(' '));   // 3 + (−5) + 7
function EX(v0,ops){let s=N(v0),val=v0;for(const [g,v] of ops){s+=(g>0?' + ':' − ')+P(v);val+=g*v;}return {txt:nb(s),val};}
const sum=v=>v.reduce((s,x)=>s+x,0);
const sgn=()=>RNG()<.5?-1:1;

/* ============ Ngẫu nhiên có hạt giống ============ */
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^=h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function sample(n,lo,hi){const all=[];for(let v=lo;v<=hi;v++)all.push(v);return shuffle(all).slice(0,n);}
const asc=a=>a.slice().sort((x,y)=>x-y);

function pickOpts(goodT,cands){
  const seen=new Set([goodT]),out=[];
  for(const c of cands){if(!seen.has(c.t)){seen.add(c.t);out.push({t:c.t,err:c.err});}if(out.length===3)break;}
  return out;
}
const C=(t,err)=>({t,err});
const mk=(stem,good,cands,exp)=>({stem,opts:[{t:good}].concat(pickOpts(good,cands)),ans:0,exp});
const FB_MC=()=>({stem:`Kết quả của phép tính ${ADD(-6,-4)} là bao nhiêu?`,opts:[{t:'−10'},{t:'10',err:'Tổng của hai số nguyên âm là số nguyên âm, không thể là số dương.'},{t:'−2',err:'Bạn đã lấy hiệu hai số. Hai số cùng dấu thì ta cộng phần số tự nhiên của chúng.'},{t:'2',err:'Bạn đã trừ hai số thay vì cộng, và sai cả dấu.'}],ans:0,exp:'Hai số cùng dấu âm: cộng hai số tự nhiên 6 + 4 = 10, rồi đặt dấu "−" trước kết quả: −10.'});
function tryGen(f){
  for(let n=0;n<100;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>o.t)).size===4)return r;}
  return FB_MC();
}

/* ============ Bộ sinh câu nhiều lựa chọn ============ */
/* --- Cộng hai số nguyên --- */
function genAddNeg(){return tryGen(()=>{
  const [a,b]=sample(2,2,60);
  return mk(`Kết quả của phép tính ${ADD(-a,-b)} là bao nhiêu?`,N(-(a+b)),[
    C(N(a+b),'Tổng của hai số nguyên âm là số nguyên âm, không thể là số dương.'),
    C(N(-Math.abs(a-b)),'Bạn đã lấy hiệu hai số. Hai số cùng dấu thì ta cộng phần số tự nhiên của chúng.'),
    C(N(Math.abs(a-b)),'Bạn đã trừ hai số thay vì cộng, và sai cả dấu.')],
    `Hai số cùng dấu âm: cộng hai số tự nhiên ${a} + ${b} = ${a+b}, rồi đặt dấu "−" trước kết quả: ${N(-(a+b))}.`);
});}
function genAddDiff(){return tryGen(()=>{
  const [x,y]=sample(2,2,60),neg1=RNG()<.5;
  const a=neg1?-x:x,b=neg1?y:-y,s=a+b,big=Math.max(x,y),small=Math.min(x,y);
  return mk(`Tính ${ADD(a,b)}.`,N(s),[
    C(N(-s),'Dấu của kết quả phải là dấu của số có giá trị tuyệt đối lớn hơn.'),
    C(N(x+y),'Hai số khác dấu thì ta lấy hiệu hai giá trị tuyệt đối chứ không cộng chúng.'),
    C(N(-(x+y)),'Hai số khác dấu thì ta lấy hiệu hai giá trị tuyệt đối chứ không cộng chúng.')],
    `Hai số khác dấu: lấy ${big} − ${small} = ${big-small}. Số có giá trị tuyệt đối lớn hơn là ${N(big===x?a:b)} nên kết quả mang dấu ${s<0?'"−"':'"+"'}: ${N(s)}.`);
});}
function genSum4(){return tryGen(()=>{
  const v=[sgn()*ri(2,30),sgn()*ri(2,30),sgn()*ri(2,30),sgn()*ri(2,30)],s=sum(v);
  if(s===0||v.every(x=>x>0)||v.every(x=>x<0))return null;
  return mk(`Tính ${SUMX(v)}.`,N(s),[
    C(N(-s),'Kết quả có dấu ngược lại. Hãy cộng từng bước và để ý dấu của số có giá trị tuyệt đối lớn hơn.'),
    C(N(s-2*v[3]),`Bạn đã đổi dấu số hạng cuối ${N(v[3])}.`),
    C(N(s-2*v[0]),`Bạn đã đổi dấu số hạng đầu ${N(v[0])}.`)],
    `Cộng lần lượt: ${N(v[0])} + ${P(v[1])} = ${N(v[0]+v[1])}; ${N(v[0]+v[1])} + ${P(v[2])} = ${N(v[0]+v[1]+v[2])}; ${N(v[0]+v[1]+v[2])} + ${P(v[3])} = ${N(s)}.`);
});}
function rangeSum(a,b){return (b*(b+1)-a*(a+1))/2;}   // tổng các số nguyên từ −a đến b
function genRangeSum(){return tryGen(()=>{
  const [a,b]=sample(2,2,9),s=rangeSum(a,b);
  const drop=b>a?s-b:s+a;
  return mk(`Tổng tất cả các số nguyên x thỏa mãn ${nb(N(-a)+' ≤ x ≤ '+b)} là bao nhiêu?`,N(s),[
    C('0','Các cặp số đối nhau triệt tiêu, nhưng khi hai đầu mút không đối nhau thì vẫn còn các số ở một phía.'),
    C(N(-s),'Dấu của kết quả bị ngược: phần còn lại là các số ở phía có giá trị tuyệt đối lớn hơn.'),
    C(N(drop),'Bạn đã bỏ sót một đầu mút của khoảng. Dấu "≤" cho phép lấy cả hai đầu mút.')],
    `Các cặp số đối nhau có tổng bằng 0. ${b>a?`Còn lại các số từ ${a+1} đến ${b}`:`Còn lại các số từ ${N(-a)} đến ${N(-(b+1))}`}. Tổng của chúng là ${N(s)}.`);
});}
/* --- Tính chất phép cộng --- */
const FORM={'Giao hoán':'a + b = b + a','Kết hợp':'(a + b) + c = a + (b + c)','Cộng với số 0':'a + 0 = a','Cộng với số đối':'a + (−a) = 0'};
function genProp(){return tryGen(()=>{
  const [a0,b0,c0]=sample(3,2,30),a=sgn()*a0,b=sgn()*b0,c=sgn()*c0,k=ri(0,3);
  const names=Object.keys(FORM);
  const eq=[
    `${ADD(a,b)} = ${ADD(b,a)}`,
    nb(`(${N(a)} + ${P(b)}) + ${P(c)} = ${N(a)} + (${N(b)} + ${P(c)})`),
    nb(`${N(a)} + 0 = ${N(a)}`),
    `${ADD(a,-a)} = 0`][k];
  return mk(`Đẳng thức ${eq} thể hiện tính chất nào của phép cộng?`,names[k],
    shuffle(names.filter((_,i)=>i!==k)).map(n=>C(n,`Tính chất "${n.toLowerCase()}" được viết là ${FORM[n]}, không phải dạng của đẳng thức đã cho.`)),
    `Đẳng thức có dạng ${FORM[names[k]]} nên đó là tính chất ${names[k].toLowerCase()} của phép cộng.`);
});}
function genAssoc3(){return tryGen(()=>{
  const [x0,y0]=sample(2,2,60),x=sgn()*x0,y=sgn()*y0;
  return mk(`Tính hợp lý: ${SUMX(shuffle([x,y,-x]))}.`,N(y),[
    C(N(-y),'Hai số đối nhau cộng lại bằng 0, còn lại số hạng kia giữ nguyên dấu.'),
    C(N(x+y),'Bạn đã bỏ sót một số hạng. Hai số đối nhau là '+N(x)+' và '+N(-x)+', cộng lại bằng 0.'),
    C(N(y-x),'Hai số đối nhau cộng lại bằng 0; kết quả chỉ còn lại số hạng kia.')],
    `Nhóm hai số đối nhau: ${N(x)} + ${P(-x)} = 0. Do đó tổng bằng 0 + ${P(y)} = ${N(y)}.`);
});}
function genAssoc4(){return tryGen(()=>{
  const [x0,y0,z0]=sample(3,2,50),x=sgn()*x0,y=sgn()*y0,z=sgn()*z0,s=y+z;
  if(s===0)return null;
  return mk(`Tính hợp lý: ${SUMX(shuffle([x,y,-x,z]))}.`,N(s),[
    C(N(-s),'Sai dấu. Hãy nhóm hai số đối nhau, rồi cộng hai số còn lại.'),
    C(N(y-z),`Bạn đã đổi dấu số hạng ${N(z)}.`),
    C(N(x+y+z),`Bạn chưa triệt tiêu cặp số đối nhau ${N(x)} và ${N(-x)}.`)],
    `Nhóm hai số đối nhau: ${N(x)} + ${P(-x)} = 0. Còn lại ${N(y)} + ${P(z)} = ${N(s)}.`);
});}
/* --- Trừ hai số nguyên --- */
function genOpp(){return tryGen(()=>{
  const a=ri(2,80),x=sgn()*a;
  return mk(`Số đối của ${N(x)} là số nào?`,N(-x),[
    C(N(x),'Đó là chính số đã cho. Số đối của một số có dấu ngược lại.'),
    C('0','Chỉ số 0 mới có số đối là chính nó.'),
    C('Không có số đối','Mọi số nguyên đều có số đối.')],
    `Số đối của ${N(x)} là ${N(-x)}, vì ${ADD(x,-x)} = 0.`);
});}
function genSubNB(){return tryGen(()=>{
  const [x,y]=sample(2,1,60);
  return mk(`Tính ${nb(x+' − '+y)}.`,N(x-y),[
    C(N(y-x),'Bạn đã đảo thứ tự hai số. Phép trừ không có tính chất giao hoán.'),
    C(N(x+y),'Bạn đã làm phép cộng thay vì phép trừ.'),
    C(N(-(x+y)),'Bạn đã làm phép cộng thay vì phép trừ, rồi lại đổi dấu.')],
    `${nb(x+' − '+y)} = ${ADD(x,-y)} = ${N(x-y)}.`);
});}
function genSubNeg(){return tryGen(()=>{
  const a=sgn()*ri(2,40),b=ri(2,40);
  return mk(`Tính ${SUB(a,-b)}.`,N(a+b),[
    C(N(a-b),'Trừ cho một số âm thì ta cộng với số đối của nó, là số dương: a − (−b) = a + b.'),
    C(N(-(a+b)),'Dấu của kết quả bị ngược. Hãy chuyển phép trừ thành phép cộng với số đối.'),
    C(N(b-a),'Bạn đã đảo thứ tự hai số.')],
    `${SUB(a,-b)} = ${N(a)} + ${b} = ${N(a+b)}, vì số đối của ${N(-b)} là ${b}.`);
});}
function genSubAsAdd(){return tryGen(()=>{
  const [a,b]=sample(2,2,60);
  return mk(`Phép tính nào sau đây có cùng kết quả với ${nb(a+' − '+b)}?`,nb(`${a} + (−${b})`),[
    C(nb(`${a} + ${b}`),'Đó là phép cộng a + b. Muốn trừ b thì phải cộng với số đối của b.'),
    C(nb(`(−${a}) + ${b}`),'Bạn đã đổi dấu số bị trừ thay vì số trừ. Kết quả ngược dấu.'),
    C(nb(`(−${a}) + (−${b})`),'Bạn đã đổi dấu cả hai số.')],
    `${nb(a+' − '+b)} = ${nb(`${a} + (−${b})`)}, vì số đối của ${b} là −${b}.`);
});}
function genDiffTemp(){return tryGen(()=>{
  const lo=ri(3,25),hi=ri(2,25),d=hi+lo;
  return mk(`Nhiệt độ lúc sáng sớm là ${N(-lo)}°C, đến trưa là ${hi}°C. Nhiệt độ đã tăng bao nhiêu độ?`,`${d}°C`,[
    C(`${Math.abs(hi-lo)}°C`,'Bạn đã lấy hiệu hai giá trị tuyệt đối. Số độ tăng là hiệu hai nhiệt độ: hi − (−lo), tức là phép cộng.'),
    C(`${hi}°C`,'Đó là nhiệt độ lúc trưa, chưa phải số độ đã tăng.'),
    C(`${N(-d)}°C`,'Nhiệt độ tăng nên số độ tăng là số dương.')],
    `Số độ tăng = nhiệt độ lúc trưa − nhiệt độ lúc sáng = ${hi} − (${N(-lo)}) = ${hi} + ${lo} = ${d}°C.`);
});}
function genSub3(){return tryGen(()=>{
  const g=[sgn(),sgn()],v0=sgn()*ri(2,30),b=sgn()*ri(2,30),c=sgn()*ri(2,30),e=EX(v0,[[g[0],b],[g[1],c]]);
  return mk(`Tính ${e.txt}.`,N(e.val),[
    C(N(-e.val),'Kết quả có dấu ngược lại. Hãy đổi từng phép trừ thành cộng với số đối rồi cộng lần lượt.'),
    C(N(e.val-2*g[0]*b),`Bạn đã nhầm dấu ở số ${N(b)}: ${g[0]>0?'cộng':'trừ'} ${P(b)} nghĩa là cộng với ${P(g[0]*b)}.`),
    C(N(e.val-2*g[1]*c),`Bạn đã nhầm dấu ở số ${N(c)}: ${g[1]>0?'cộng':'trừ'} ${P(c)} nghĩa là cộng với ${P(g[1]*c)}.`)],
    `Đổi phép trừ thành cộng với số đối: ${SUMX([v0,g[0]*b,g[1]*c])} = ${N(e.val)}.`);
});}
function genUnknown(){return tryGen(()=>{
  const a=ri(2,40),b=sgn()*ri(2,40);
  if(RNG()<.5)return mk(`Tìm số nguyên x biết ${nb('x + '+P(-a)+' = '+N(b))}.`,N(a+b),[
    C(N(b-a),'Số hạng chưa biết bằng tổng trừ số hạng đã biết: x = '+N(b)+' − '+P(-a)+', trừ cho số âm thì cộng với số đối của nó.'),
    C(N(-(a+b)),'Dấu của kết quả bị ngược.'),
    C(N(a-b),'Bạn đã đảo thứ tự số bị trừ và số trừ.')],
    `x = ${N(b)} − ${P(-a)} = ${N(b)} + ${a} = ${N(a+b)}.`);
  return mk(`Tìm số nguyên x biết ${nb(N(a)+' − x = '+N(b))}.`,N(a-b),[
    C(N(a+b),'Số trừ bằng số bị trừ trừ hiệu: x = '+N(a)+' − '+P(b)+', không phải cộng.'),
    C(N(b-a),'Bạn đã đảo thứ tự số bị trừ và số trừ.'),
    C(N(-(a-b)),'Dấu của kết quả bị ngược.')],
    `x = ${N(a)} − ${P(b)} = ${N(a-b)}.`);
});}
/* --- Bài toán thực tế, trục số --- */
function genMove(){return tryGen(()=>{
  const a=ri(3,25),b=ri(a+1,a+25),right=RNG()<.5,val=-a+(right?b:-b);
  return mk(`Trên trục số, điểm A biểu diễn số ${N(-a)}. Điểm B nằm bên ${right?'phải':'trái'} điểm A và cách A ${b} đơn vị. Điểm B biểu diễn số nào?`,N(val),[
    C(N(-a+(right?-b:b)),'Bạn đã nhầm chiều di chuyển: sang phải là cộng, sang trái là trừ.'),
    C(N(-val),'Kết quả bị ngược dấu.'),
    C(right?N(a+b):N(a-b),'Bạn đã bỏ qua dấu "−" của số '+N(-a)+' nên tính nhầm phép tính trên trục số.')],
    `Sang ${right?'phải':'trái'} là ${right?'cộng':'trừ'}: ${nb(EX(-a,[[right?1:-1,b]]).txt)} = ${N(val)}.`);
});}
function genDiffAlt(){return tryGen(()=>{
  const a=ri(10,80),b=ri(5,60),d=a+b;
  return mk(`Điểm A ở độ cao ${a} m, điểm B ở độ cao ${N(-b)} m so với mực nước biển. Điểm A cao hơn điểm B bao nhiêu mét?`,`${d} m`,[
    C(`${Math.abs(a-b)} m`,'Bạn đã lấy hiệu hai giá trị tuyệt đối. Chênh lệch là hiệu hai độ cao: a − (−b) = a + b.'),
    C(`${a} m`,'Đó là độ cao của điểm A, chưa phải chênh lệch độ cao của hai điểm.'),
    C(`${N(-d)} m`,'A cao hơn B nên chênh lệch là số dương.')],
    `Chênh lệch độ cao = độ cao của A − độ cao của B = ${nb(`${a} − ${P(-b)} = ${a} + ${b} = ${d}`)} (m).`);
});}
function genElev(){return tryGen(()=>{
  const b=ri(1,4),c=ri(b+2,b+9),d=ri(2,c+b-1),val=-b+c-d;
  if(val===0||c===d)return null;
  return mk(`Một thang máy đang ở tầng ${N(-b)} (tầng hầm). Thang máy đi lên ${c} tầng, rồi đi xuống ${d} tầng. Cuối cùng thang máy ở tầng nào?`,`tầng ${N(val)}`,[
    C(`tầng ${N(-b-c+d)}`,'Bạn đã nhầm hướng: đi lên là cộng, đi xuống là trừ.'),
    C(`tầng ${N(b+c-d)}`,'Tầng hầm là số âm: lúc đầu thang máy ở tầng '+N(-b)+', không phải tầng '+b+'.'),
    C(`tầng ${N(-b+c+d)}`,'Đi xuống là trừ đi d tầng, không phải cộng thêm.')],
    `Đi lên thì cộng, đi xuống thì trừ: ${nb(EX(-b,[[1,c],[-1,d]]).txt)} = ${N(val)}. Thang máy ở tầng ${N(val)}.`);
});}
function genAfterTemp(){return tryGen(()=>{
  const t=sgn()*ri(1,20),d=ri(3,25),up=RNG()<.5,val=t+(up?d:-d);
  return mk(`Lúc đầu nhiệt độ là ${N(t)}°C. Sau đó nhiệt độ ${up?'tăng':'giảm'} ${d}°C. Nhiệt độ lúc sau là bao nhiêu?`,`${N(val)}°C`,[
    C(`${N(t+(up?-d:d))}°C`,`Bạn đã nhầm ${up?'tăng':'giảm'} với ${up?'giảm':'tăng'}. ${up?'Tăng là phép cộng':'Giảm là phép trừ'}.`),
    C(`${N(-val)}°C`,'Kết quả bị ngược dấu.'),
    C(`${N(d-t)}°C`,'Bạn đã đảo thứ tự số bị trừ và số trừ.')],
    `${up?'Tăng':'Giảm'} ${d}°C nghĩa là ${up?'cộng thêm':'trừ đi'} ${d}: ${nb(EX(t,[[up?1:-1,d]]).txt)} = ${N(val)}°C.`);
});}
function genAlt(){return tryGen(()=>{
  const a=ri(10,60),b=ri(5,a-1),c=ri(3,30),val=-a+b-c;
  return mk(`Một tàu ngầm đang ở độ cao ${N(-a)} m so với mực nước biển. Tàu nổi lên ${b} m, sau đó lặn xuống ${c} m. Độ cao của tàu lúc sau là bao nhiêu?`,`${N(val)} m`,[
    C(`${N(-a-b+c)} m`,'Bạn đã nhầm hướng: nổi lên là cộng, lặn xuống là trừ.'),
    C(`${N(-a+b+c)} m`,'Lặn xuống là trừ đi c mét, không phải cộng thêm.'),
    C(`${N(a+b-c)} m`,'Độ cao ban đầu là số âm −'+a+', không phải +'+a+'.')],
    `Độ cao lúc sau: ${nb(EX(-a,[[1,b],[-1,c]]).txt)} = ${N(val)} m.`);
});}
function genProfit(){return tryGen(()=>{
  const m=[ri(5,40),ri(5,40),ri(5,40)].map(v=>sgn()*v),s=sum(m);
  if(s===0||m.every(x=>x>0)||m.every(x=>x<0))return null;
  const nm=['Tháng 1','Tháng 2','Tháng 3'],txt=m.map((v,i)=>`${nm[i].toLowerCase()} ${v>0?'lãi':'lỗ'} ${Math.abs(v)} triệu đồng`).join(', ');
  return mk(`Một cửa hàng trong ba tháng liên tiếp: ${txt}. Tổng lợi nhuận ba tháng (số âm là lỗ) là bao nhiêu triệu đồng?`,N(s),[
    C(N(-s),'Kết quả bị ngược dấu: hãy cộng lãi (số dương) và lỗ (số âm).'),
    C(N(m[0]+m[1]),'Bạn mới cộng hai tháng đầu, chưa tính tháng 3.'),
    C(N(Math.abs(m[0])+Math.abs(m[1])+Math.abs(m[2])),'Bạn đã cộng cả lãi và lỗ như nhau. Lỗ phải là số âm.')],
    `Lãi là số dương, lỗ là số âm: ${SUMX(m)} = ${N(s)} triệu đồng.`);
});}

/* ============ Bộ sinh đúng sai ============ */
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
function pick4(Ts,Fs){
  const nT=ri(1,3);
  return shuffle(shuffle(Ts).slice(0,nT).concat(shuffle(Fs).slice(0,4-nT)));
}
function mixed(make){ // tạo 4 ý, bảo đảm có cả ý đúng và ý sai, không trùng nhau
  for(let n=0;n<60;n++){const items=make();const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===items.length)return items;}
  return null;
}
const FB_TF=()=>({stem:'Xét các phát biểu sau:',items:[
  IT(nb('(−6) + (−4) = −10'),true,'cg','TH','Cộng hai số nguyên âm: 6 + 4 = 10, kết quả mang dấu "−".'),
  IT('Tổng của hai số nguyên đối nhau bằng chính số đó.',false,'cg','TH','Tổng của hai số đối nhau bằng 0.'),
  IT(nb('5 − 8 = −3'),true,'tr','TH','5 − 8 = 5 + (−8) = −3.'),
  IT(nb('7 − (−2) = 5'),false,'tr','TH','7 − (−2) = 7 + 2 = 9.')]});
const wrongOf=(s,list)=>{const l=list.filter(x=>x!==s);return l.length?sel(l):s+1;};
/* một ý: phép cộng hai số nguyên */
function addItem(){
  const [x,y]=sample(2,2,50),kind=ri(0,2);
  let a,b;if(kind===0){a=-x;b=-y;}else{a=sgn()*x;b=a<0?y:-y;}
  const s=a+b,v=RNG()<.5,shown=v?s:wrongOf(s,kind===0?[x+y,-Math.abs(x-y)]:[-s,x+y,-(x+y)]);
  return IT(`${ADD(a,b)} = ${N(shown)}`,v,'cg','TH',v?`${ADD(a,b)} = ${N(s)}.${kind===0?' Hai số âm: cộng phần số tự nhiên rồi đặt dấu "−".':' Hai số khác dấu: lấy hiệu hai giá trị tuyệt đối, đặt dấu của số có giá trị tuyệt đối lớn hơn.'}`:`Kết quả đúng của ${ADD(a,b)} là ${N(s)}, không phải ${N(shown)}.`);
}
/* một ý: tổng nhiều số hạng (vận dụng) */
function sum3Item(){
  const v=[sgn()*ri(2,30),sgn()*ri(2,30),sgn()*ri(2,30)],s=sum(v),t=RNG()<.5,shown=t?s:wrongOf(s,[-s,s-2*v[2],s-2*v[0]]);
  return IT(`${SUMX(v)} = ${N(shown)}`,t,'cg','VD',t?`${N(v[0])} + ${P(v[1])} = ${N(v[0]+v[1])}; ${N(v[0]+v[1])} + ${P(v[2])} = ${N(s)}.`:`Cộng lần lượt được ${N(s)}, không phải ${N(shown)}.`);
}
function tfCalc(level){return ()=>{const f=level==='VD'?sum3Item:addItem;const items=mixed(()=>[f(),f(),f(),f()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};}
/* một ý: phép trừ hai số nguyên */
function subItem(){
  const a=sgn()*ri(1,30),b=sgn()*ri(1,30),s=a-b,v=RNG()<.5,shown=v?s:wrongOf(s,[a+b,b-a,-s]);
  return IT(`${SUB(a,b)} = ${N(shown)}`,v,'tr','TH',v?`${SUB(a,b)} = ${N(a)} + ${P(-b)} = ${N(s)}.`:`${SUB(a,b)} = ${N(a)} + ${P(-b)} = ${N(s)}, không phải ${N(shown)}.`);
}
function sub3Item(){
  const g=[sgn(),sgn()],v0=sgn()*ri(2,30),b=sgn()*ri(2,30),c=sgn()*ri(2,30),e=EX(v0,[[g[0],b],[g[1],c]]),t=RNG()<.5;
  const conv=[v0,g[0]*b,g[1]*c],shown=t?e.val:wrongOf(e.val,[-e.val,e.val-2*g[0]*b,e.val-2*g[1]*c]);
  return IT(`${e.txt} = ${N(shown)}`,t,'tr','VD',`Đổi mỗi phép trừ thành phép cộng với số đối: ${SUMX(conv)} = ${N(e.val)}.`);
}
function tfSub(level){return ()=>{const f=level==='VD'?sub3Item:subItem;const items=mixed(()=>[f(),f(),f(),f()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};}
/* tính chất phép cộng */
const PT=[
 IT('Với mọi số nguyên a và b, a + b = b + a.',true,'tc','NB','Đây là tính chất giao hoán của phép cộng.'),
 IT('Với mọi số nguyên a, b, c: (a + b) + c = a + (b + c).',true,'tc','NB','Đây là tính chất kết hợp của phép cộng.'),
 IT('Với mọi số nguyên a, a + 0 = a.',true,'tc','NB','Cộng một số với 0 thì được chính số đó.'),
 IT('Tổng của hai số nguyên đối nhau luôn bằng 0.',true,'cg','NB','Ví dụ 6 + (−6) = 0. Với mọi số nguyên a: a + (−a) = 0.'),
 IT('Tổng của hai số nguyên âm là một số nguyên âm.',true,'cg','NB','Cộng hai số nguyên âm thì cộng hai số tự nhiên rồi đặt dấu "−", nên kết quả âm.'),
 IT('Với mọi số nguyên a và b, a − b = a + (−b).',true,'tr','NB','Đó là quy tắc trừ hai số nguyên: cộng với số đối của số trừ.'),
 IT('Hiệu của hai số nguyên luôn là một số nguyên.',true,'tr','NB','Trong tập hợp ℤ phép trừ luôn thực hiện được, ví dụ 3 − 7 = −4.'),
 IT('Số nguyên âm có thể dùng để biểu diễn nhiệt độ dưới 0°C, độ cao dưới mực nước biển hoặc số tiền nợ.',true,'dn','NB','Đúng: nhiệt độ dưới 0°C, độ cao dưới mực nước biển, tiền nợ hay lỗ đều được biểu diễn bằng số nguyên âm.')];
const PF=[
 IT('Với mọi số nguyên a và b, a − b = b − a.',false,'tr','NB','Phép trừ không có tính chất giao hoán: 5 − 3 = 2 nhưng 3 − 5 = −2.'),
 IT('Tổng của hai số nguyên âm là một số nguyên dương.',false,'cg','NB','Tổng của hai số nguyên âm luôn là số nguyên âm, ví dụ (−2) + (−3) = −5.'),
 IT('Tổng của một số nguyên âm và một số nguyên dương luôn là số nguyên âm.',false,'cg','NB','Dấu của tổng phụ thuộc vào số có giá trị tuyệt đối lớn hơn. Ví dụ (−2) + 7 = 5 là số dương.'),
 IT('Tổng của hai số nguyên đối nhau bằng chính số đó.',false,'cg','NB','Tổng của hai số đối nhau bằng 0, không phải chính số đó.'),
 IT('Hiệu của hai số nguyên dương luôn là số nguyên dương.',false,'tr','NB','Ví dụ 3 − 5 = −2 là số nguyên âm.'),
 IT('Khi nhiệt độ giảm, ta cộng thêm số độ giảm vào nhiệt độ ban đầu.',false,'dn','NB','Nhiệt độ giảm là trừ đi số độ giảm, nhiệt độ tăng mới là cộng thêm.'),
 IT('Với mọi số nguyên a, a + a = 0.',false,'tc','NB','Chỉ đúng khi a = 0. Tổng bằng 0 khi hai số đối nhau: a + (−a) = 0.'),
 IT('Phép cộng các số nguyên không có tính chất giao hoán.',false,'tc','NB','Phép cộng có tính chất giao hoán: a + b = b + a.')];
function tfPropNB(){return ()=>({stem:'Xét các phát biểu sau:',items:pick4(PT,PF)});}
function propItem(kind,v){
  const [x0,y0]=sample(2,2,40),x=sgn()*x0,y=sgn()*y0;
  if(kind===0)return IT(`${SUMX([x,y,-x])} = ${N(v?y:-y)}`,v,'tc','TH',v?`${N(x)} + ${P(-x)} = 0 nên tổng chỉ còn ${N(y)}.`:`Hai số đối nhau ${N(x)} và ${N(-x)} cộng lại bằng 0, tổng còn ${N(y)}, không phải ${N(-y)}.`);
  if(kind===1)return IT(`${ADD(x,y)} = ${v?ADD(y,x):ADD(-y,-x)}`,v,'tc','TH',v?'Đổi chỗ hai số hạng thì tổng không đổi (tính chất giao hoán).':`${ADD(x,y)} = ${N(x+y)} còn ${ADD(-y,-x)} = ${N(-x-y)}, hai kết quả đối nhau.`);
  if(kind===2)return IT(`${N(x)} + 0 = ${v?N(x):'0'}`,v,'tc','TH',v?`Cộng với 0 thì được chính số đó: ${N(x)} + 0 = ${N(x)}.`:`${N(x)} + 0 = ${N(x)}, không phải 0.`);
  return IT(`${ADD(x,-x)} = ${v?'0':N(2*x)}`,v,'tc','TH',v?'Tổng của hai số đối nhau bằng 0.':`${ADD(x,-x)} = 0, không phải ${N(2*x)}.`);
}
function tfPropTH(){return ()=>{
  const items=mixed(()=>shuffle([0,1,2,3]).map(k=>propItem(k,RNG()<.5)));
  return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};}
function cancelItem(){
  const [x0,y0,z0]=sample(3,2,40),x=sgn()*x0,y=sgn()*y0,z=sgn()*z0,s=y+z,t=RNG()<.5;
  if(s===0)return cancelItem();
  const shown=t?s:wrongOf(s,[-s,y-z,x+y+z]);
  return IT(`${SUMX(shuffle([x,y,-x,z]))} = ${N(shown)}`,t,'tc','VD',t?`Nhóm ${N(x)} và ${N(-x)} (tổng bằng 0), còn lại ${N(y)} + ${P(z)} = ${N(s)}.`:`Nhóm hai số đối nhau, còn lại ${N(y)} + ${P(z)} = ${N(s)}, không phải ${N(shown)}.`);
}
function tfPropVD(){return ()=>{const items=mixed(()=>[cancelItem(),cancelItem(),cancelItem(),cancelItem()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};}
/* trục số, chênh lệch, tìm x */
function lineItem(){
  const p=sgn()*ri(1,15),d=ri(3,20),right=RNG()<.5,r=p+(right?d:-d),v=RNG()<.5,sh=v?r:wrongOf(r,[p+(right?-d:d),-r]);
  return IT(`Trên trục số, điểm ${N(p)} dịch chuyển sang ${right?'phải':'trái'} ${d} đơn vị thì đến điểm ${N(sh)}.`,v,'dn','TH',`Sang ${right?'phải':'trái'} là ${right?'cộng':'trừ'}: ${nb(EX(p,[[right?1:-1,d]]).txt)} = ${N(r)}${v?'.':`, không phải ${N(sh)}.`}`);
}
function tfLineTH(){return ()=>{for(let n=0;n<60;n++){const items=mixed(()=>[lineItem(),lineItem(),lineItem(),lineItem()]);if(items&&new Set(items.map(i=>i.t)).size===4)return {stem:'Xét các phát biểu sau:',items};}return FB_TF();};}
function gapItem(){
  const a=ri(5,60),b=ri(5,40),d=a+b,v=RNG()<.5,sh=v?d:wrongOf(d,[Math.abs(a-b),d+10]);
  return IT(`Điểm A ở độ cao ${a} m, điểm B ở độ cao ${N(-b)} m so với mực nước biển. Điểm A cao hơn điểm B ${sh} m.`,v,'dn','VD',`Chênh lệch độ cao là ${nb(`${a} − ${P(-b)} = ${a} + ${b} = ${d}`)} (m)${v?'.':`, không phải ${sh} m.`}`);
}
function unkItem(){
  const a=ri(3,40),b=sgn()*ri(2,40),v=RNG()<.5,k=ri(0,1);
  if(k===0){const r=a+b,sh=v?r:wrongOf(r,[b-a,-r]);return IT(`Biết ${nb('x − '+a+' = '+N(b))}. Khi đó x = ${N(sh)}.`,v,'dn','VD',`Số bị trừ bằng hiệu cộng số trừ: ${nb(`x = ${N(b)} + ${a} = ${N(r)}`)}${v?'.':`, không phải ${N(sh)}.`}`);}
  const r=b-a,sh=v?r:wrongOf(r,[a+b,-r]);return IT(`Biết ${nb('x + '+a+' = '+N(b))}. Khi đó x = ${N(sh)}.`,v,'dn','VD',`Số hạng chưa biết bằng tổng trừ số hạng đã biết: ${nb(`x = ${N(b)} − ${a} = ${N(r)}`)}${v?'.':`, không phải ${N(sh)}.`}`);
}
function tfGapVD(){return ()=>{for(let n=0;n<60;n++){const items=mixed(()=>[gapItem(),unkItem(),gapItem(),unkItem()]);if(items&&new Set(items.map(i=>i.t)).size===4)return {stem:'Xét các phát biểu sau:',items:shuffle(items)};}return FB_TF();};}
/* bài toán thực tế */
function realItem(kind){
  const v=RNG()<.5;
  if(kind===0){const t=sgn()*ri(1,15),d=ri(3,20),r=t+d,sh=v?r:wrongOf(r,[t-d,-r]);return IT(`Nhiệt độ ${N(t)}°C tăng thêm ${d}°C thì được ${N(sh)}°C.`,v,'dn','TH',v?`Tăng là cộng: ${N(t)} + ${d} = ${N(r)}°C.`:`Tăng ${d}°C là cộng: ${N(t)} + ${d} = ${N(r)}°C, không phải ${N(sh)}°C.`);}
  if(kind===1){const t=sgn()*ri(1,15),d=ri(3,20),r=t-d,sh=v?r:wrongOf(r,[t+d,d-t]);return IT(`Nhiệt độ ${N(t)}°C giảm ${d}°C thì được ${N(sh)}°C.`,v,'dn','TH',v?`Giảm là trừ: ${N(t)} − ${d} = ${N(r)}°C.`:`Giảm ${d}°C là trừ: ${N(t)} − ${d} = ${N(r)}°C, không phải ${N(sh)}°C.`);}
  if(kind===2){const a=ri(5,40),b=ri(3,30),r=-(a+b),sh=v?r:wrongOf(r,[-a+b,a+b]);return IT(`Một thợ lặn đang ở độ cao ${N(-a)} m, lặn thêm xuống ${b} m thì ở độ cao ${N(sh)} m.`,v,'dn','TH',v?`Lặn xuống là trừ: ${N(-a)} − ${b} = ${N(r)} m.`:`Lặn xuống ${b} m là trừ: ${N(-a)} − ${b} = ${N(r)} m, không phải ${N(sh)} m.`);}
  const a=ri(5,40),b=ri(5,40);if(a===b)return realItem(3);const r=b-a,sh=v?r:wrongOf(r,[a-b,a+b]);
  return IT(`Tháng trước cửa hàng lỗ ${a} triệu đồng, tháng này lãi ${b} triệu đồng thì tổng hai tháng là ${N(sh)} triệu đồng (số âm là lỗ).`,v,'dn','TH',v?`Lỗ là số âm: ${N(-a)} + ${b} = ${N(r)} triệu đồng.`:`Lỗ là số âm: ${N(-a)} + ${b} = ${N(r)} triệu đồng, không phải ${N(sh)}.`);
}
function tfRealTH(){return ()=>{const items=mixed(()=>[0,1,2,3].map(k=>realItem(k)));return items?{stem:'Xét các phát biểu sau:',items:shuffle(items)}:FB_TF();};}

/* tình huống thực tế: một ngữ cảnh, bốn ý từ dễ đến khó */
function ctxSub(){
  const a=ri(20,60),b=ri(10,40);let c;do{c=ri(10,a+b-5);}while(c===b);
  const d1=-(a+b),fin=d1+c,v=[0,1,2,3].map(()=>RNG()<.5),s1=v[0]?d1:wrongOf(d1,[b-a,a+b]),s3=v[2]?fin:wrongOf(fin,[b-a-c,-fin,d1-c]),up=c>b;
  return {stem:`Một tàu ngầm đang ở độ cao ${N(-a)} m so với mực nước biển. Tàu lặn xuống thêm ${b} m, sau đó nổi lên ${c} m.`,items:[
    IT(`Sau khi lặn xuống thêm ${b} m, tàu ở độ cao ${N(s1)} m.`,v[0],'dn','TH',`Lặn xuống là trừ: ${nb(`${N(-a)} − ${b} = ${N(d1)}`)} (m)${v[0]?'.':`, không phải ${N(s1)} m.`}`),
    IT(`Độ cao cuối cùng của tàu (tính bằng mét) là kết quả của phép tính ${nb(v[1]?`${N(-a)} − ${b} + ${c}`:`${N(-a)} + ${b} − ${c}`)}.`,v[1],'dn','TH',`Lặn xuống thì trừ, nổi lên thì cộng: ${nb(`${N(-a)} − ${b} + ${c}`)}.`),
    IT(`Cuối cùng tàu ở độ cao ${N(s3)} m.`,v[2],'dn','VD',`${nb(`${N(-a)} − ${b} + ${c} = ${N(fin)}`)} (m)${v[2]?'.':`, không phải ${N(s3)} m.`}`),
    IT(`Cuối cùng tàu ở vị trí ${v[3]===up?'cao':'thấp'} hơn so với lúc đầu.`,v[3],'dn','VD',up?`Tàu nổi lên ${c} m, nhiều hơn đoạn lặn xuống ${b} m, nên cao hơn lúc đầu ${c-b} m.`:`Tàu lặn xuống ${b} m, nhiều hơn đoạn nổi lên ${c} m, nên thấp hơn lúc đầu ${b-c} m.`)]};
}
function ctxTemp(){
  const t=ri(-8,2),u=ri(5,12),w=ri(u+2,u+10),noon=t+u,night=noon-w,v=[0,1,2,3].map(()=>RNG()<.5);
  const s1=v[0]?noon:wrongOf(noon,[t-u,-noon]),s3=v[2]?night:wrongOf(night,[noon+w,t-w]),s4=v[3]?w-u:sel([w+u,w]);
  return {stem:`Ở Sa Pa, nhiệt độ lúc 6 giờ sáng là ${N(t)}°C. Đến trưa nhiệt độ tăng ${u}°C, đến đêm lại giảm ${w}°C so với buổi trưa.`,items:[
    IT(`Nhiệt độ buổi trưa là ${N(s1)}°C.`,v[0],'dn','TH',`Tăng là cộng: ${nb(`${N(t)} + ${u} = ${N(noon)}`)} (°C)${v[0]?'.':`, không phải ${N(s1)}°C.`}`),
    IT(`Nhiệt độ ban đêm (tính bằng °C) là kết quả của phép tính ${nb(v[1]?`${N(t)} + ${u} − ${w}`:`${N(t)} − ${u} + ${w}`)}.`,v[1],'dn','TH',`Tăng thì cộng, giảm thì trừ: ${nb(`${N(t)} + ${u} − ${w}`)}.`),
    IT(`Nhiệt độ ban đêm là ${N(s3)}°C.`,v[2],'dn','VD',`${nb(`${N(t)} + ${u} − ${w} = ${N(night)}`)} (°C)${v[2]?'.':`, không phải ${N(s3)}°C.`}`),
    IT(`Ban đêm lạnh hơn lúc 6 giờ sáng ${s4}°C.`,v[3],'dn','VD',`Tăng ${u}°C rồi giảm ${w}°C nên so với buổi sáng nhiệt độ giảm ${nb(`${w} − ${u} = ${w-u}`)} (°C)${v[3]?'.':`, không phải ${s4}°C.`}`)]};
}
function ctxShop(){
  const a=ri(15,40),b=ri(5,a-5);let c;do{c=ri(5,30);}while(c===a-b);
  const tot=a-b-c,v=[0,1,2,3].map(()=>RNG()<.5),s2=v[1]?-(b+c):wrongOf(-(b+c),[b+c,c-b]),gain=tot>0;
  return {stem:`Một cửa hàng tháng 1 lãi ${a} triệu đồng, tháng 2 lỗ ${b} triệu đồng, tháng 3 lỗ ${c} triệu đồng. Quy ước: lãi là số dương, lỗ là số âm.`,items:[
    IT(`Kết quả kinh doanh tháng 2 được biểu diễn bởi số ${v[0]?N(-b):b}.`,v[0],'dn','NB',`Lỗ ${b} triệu đồng được biểu diễn bởi số âm ${N(-b)}.`),
    IT(`Tổng kết quả của tháng 2 và tháng 3 là ${N(s2)} triệu đồng.`,v[1],'dn','TH',`${nb(`${N(-b)} + ${P(-c)} = ${N(-(b+c))}`)} (triệu đồng)${v[1]?'.':`, không phải ${N(s2)}.`}`),
    IT(`Sau ba tháng, cửa hàng ${v[2]===gain?'lãi':'lỗ'} ${Math.abs(tot)} triệu đồng.`,v[2],'dn','VD',`${nb(`${a} + ${P(-b)} + ${P(-c)} = ${N(tot)}`)}: cửa hàng ${gain?'lãi':'lỗ'} ${Math.abs(tot)} triệu đồng.`),
    IT(`Để sau ba tháng không bị lỗ, tháng 3 cửa hàng chỉ được lỗ nhiều nhất ${v[3]?a-b:a+b} triệu đồng.`,v[3],'dn','VD',`Sau hai tháng đầu cửa hàng còn lãi ${nb(`${a} − ${b} = ${a-b}`)} (triệu đồng), nên tháng 3 chỉ được lỗ nhiều nhất ${a-b} triệu đồng.`)]};
}
function tfCtx(make){return ()=>{
  for(let n=0;n<60;n++){const q=make(),k=q.items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(q.items.map(i=>i.t)).size===4)return q;}
  return FB_TF();};}
/* mức nhận biết: dấu của kết quả, số đối, đổi phép trừ thành phép cộng */
function signItem(k){
  const v=RNG()<.5,[x,y]=sample(2,2,30);
  if(k===0)return IT(`Tổng ${ADD(-x,-y)} là một số nguyên ${v?'âm':'dương'}.`,v,'cg','NB','Tổng của hai số nguyên âm luôn là một số nguyên âm.');
  if(k===1){const pos=y>x;return IT(`Tổng ${ADD(-x,y)} là một số nguyên ${v===pos?'dương':'âm'}.`,v,'cg','NB',`Hai số khác dấu: tổng mang dấu của số có giá trị tuyệt đối lớn hơn. Vì ${Math.max(x,y)} > ${Math.min(x,y)} nên tổng là số nguyên ${pos?'dương':'âm'}.`);}
  if(k===2)return IT(`Số đối của ${N(-x)} là ${v?x:N(-x)}.`,v,'tr','NB',`Số đối của ${N(-x)} là ${x}, vì ${ADD(-x,x)} = 0.`);
  if(k===3)return IT(`${SUB(x,-y)} = ${nb(v?`${x} + ${y}`:`${x} − ${y}`)}`,v,'tr','NB',`Trừ một số là cộng với số đối của số đó: ${SUB(x,-y)} = ${nb(`${x} + ${y}`)}.`);
  const neg=x<y;return IT(`Hiệu ${SUB(x,y)} là một số nguyên ${v===neg?'âm':'dương'}.`,v,'tr','NB',`${SUB(x,y)} = ${N(x-y)} là số nguyên ${neg?'âm':'dương'} vì số bị trừ ${neg?'nhỏ':'lớn'} hơn số trừ.`);
}
function tfSignNB(){return ()=>{const items=mixed(()=>shuffle([0,1,2,3,4]).slice(0,4).map(signItem));return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};}

/* ============ Bộ sinh trả lời ngắn ============ */
function saAddNeg(){const [a,b]=sample(2,1,40);return{stem:`Tính ${ADD(-a,-b)}.`,ans:[-(a+b)],exp:`Hai số âm: ${a} + ${b} = ${a+b}, đặt dấu "−": ${N(-(a+b))}.`};}
function saAddDiff(){const [x,y]=sample(2,2,60),neg=RNG()<.5,a=neg?-x:x,b=neg?y:-y;return{stem:`Tính ${ADD(a,b)}.`,ans:[a+b],exp:`Hai số khác dấu: lấy hiệu hai giá trị tuyệt đối ${Math.max(x,y)} − ${Math.min(x,y)} = ${Math.abs(x-y)}, đặt dấu của số có giá trị tuyệt đối lớn hơn: ${N(a+b)}.`};}
function saSum4(){let v,s;do{v=[sgn()*ri(2,30),sgn()*ri(2,30),sgn()*ri(2,30),sgn()*ri(2,30)];s=sum(v);}while(v.every(x=>x>0)||v.every(x=>x<0));return{stem:`Tính ${SUMX(v)}.`,ans:[s],exp:`Cộng lần lượt: ${N(v[0])} + ${P(v[1])} = ${N(v[0]+v[1])}; rồi ${N(v[0]+v[1])} + ${P(v[2])} = ${N(v[0]+v[1]+v[2])}; rồi ${N(v[0]+v[1]+v[2])} + ${P(v[3])} = ${N(s)}.`};}
function saRange(){let a,b;do{[a,b]=sample(2,2,12);}while(a===b);const s=rangeSum(a,b);return{stem:`Tính tổng tất cả các số nguyên x thỏa mãn ${nb(N(-a)+' ≤ x ≤ '+b)}.`,ans:[s],exp:`Các cặp số đối nhau có tổng bằng 0. ${b>a?`Còn lại các số từ ${a+1} đến ${b}`:`Còn lại các số từ ${N(-a)} đến ${N(-(b+1))}`}, tổng bằng ${N(s)}.`};}
function saZero(){const x=sgn()*ri(2,60);return{stem:`Tìm số nguyên a thỏa mãn ${nb('a + '+P(x)+' = 0')}.`,ans:[-x],exp:`Hai số có tổng bằng 0 là hai số đối nhau, nên a là số đối của ${N(x)}: a = ${N(-x)}.`};}
function saAssoc3(){const [x0,y0]=sample(2,2,60),x=sgn()*x0,y=sgn()*y0;return{stem:`Tính hợp lý: ${SUMX(shuffle([x,y,-x]))}.`,ans:[y],exp:`${N(x)} + ${P(-x)} = 0 nên tổng bằng ${N(y)}.`};}
function saAssoc6(){const [x0,y0,z0,w0]=sample(4,2,50),x=sgn()*x0,y=sgn()*y0,z=sgn()*z0,w=sgn()*w0;return{stem:`Tính hợp lý: ${SUMX(shuffle([x,y,z,w,-x,-y]))}.`,ans:[z+w],exp:`Nhóm các cặp số đối nhau: ${N(x)} + ${P(-x)} = 0 và ${N(y)} + ${P(-y)} = 0. Còn lại ${N(z)} + ${P(w)} = ${N(z+w)}.`};}
function saSubNB(){const [x,y]=sample(2,1,60);return{stem:`Tính ${nb(x+' − '+y)}.`,ans:[x-y],exp:`${nb(x+' − '+y)} = ${ADD(x,-y)} = ${N(x-y)}.`};}
function saSubTH(){const a=sgn()*ri(1,40),b=sgn()*ri(1,40);return{stem:`Tính ${SUB(a,b)}.`,ans:[a-b],exp:`${SUB(a,b)} = ${N(a)} + ${P(-b)} = ${N(a-b)}.`};}
function saSub3(){const g=[sgn(),sgn()],v0=sgn()*ri(2,30),b=sgn()*ri(2,30),c=sgn()*ri(2,30),e=EX(v0,[[g[0],b],[g[1],c]]);return{stem:`Tính ${e.txt}.`,ans:[e.val],exp:`Đổi phép trừ thành cộng với số đối: ${SUMX([v0,g[0]*b,g[1]*c])} = ${N(e.val)}.`};}
function saUnknown(){const a=ri(2,40),b=sgn()*ri(2,40);return RNG()<.5?{stem:`Tìm số nguyên x biết ${nb('x + '+P(-a)+' = '+N(b))}.`,ans:[b+a],exp:`Số hạng chưa biết bằng tổng trừ số hạng đã biết: x = ${N(b)} − ${P(-a)} = ${N(b)} + ${a} = ${N(b+a)}.`}:{stem:`Tìm số nguyên x biết ${nb(N(a)+' − x = '+N(b))}.`,ans:[a-b],exp:`Số trừ bằng số bị trừ trừ hiệu: x = ${N(a)} − ${P(b)} = ${N(a-b)}.`};}
function saDiffTemp(){const lo=ri(3,25),hi=ri(2,25);return{stem:`Nhiệt độ lúc sáng sớm là ${N(-lo)}°C, đến trưa là ${hi}°C. Nhiệt độ đã tăng bao nhiêu độ?`,ans:[hi+lo],exp:`Số độ tăng = ${hi} − (${N(-lo)}) = ${hi} + ${lo} = ${hi+lo}°C.`};}
function saMove(){const a=ri(3,25),b=ri(a+1,a+25),right=RNG()<.5,val=-a+(right?b:-b);return{stem:`Trên trục số, điểm A biểu diễn số ${N(-a)}. Điểm B nằm bên ${right?'phải':'trái'} điểm A và cách A ${b} đơn vị. Điểm B biểu diễn số nào?`,ans:[val],exp:`Sang ${right?'phải':'trái'} là ${right?'cộng':'trừ'}: ${nb(EX(-a,[[right?1:-1,b]]).txt)} = ${N(val)}.`};}
function saGap(){const a=ri(10,80),b=ri(5,60);return{stem:`Điểm A ở độ cao ${a} m, điểm B ở độ cao ${N(-b)} m so với mực nước biển. Điểm A cao hơn điểm B bao nhiêu mét?`,ans:[a+b],exp:`Chênh lệch độ cao: ${nb(`${a} − ${P(-b)} = ${a} + ${b} = ${a+b}`)} (m).`};}
function saAfterTemp(){const t=sgn()*ri(1,20),d=ri(3,25),up=RNG()<.5,val=t+(up?d:-d);return{stem:`Lúc đầu nhiệt độ là ${N(t)}°C. Sau đó nhiệt độ ${up?'tăng':'giảm'} ${d}°C. Nhiệt độ lúc sau là bao nhiêu độ C?`,ans:[val],exp:`${up?'Tăng':'Giảm'} là ${up?'cộng':'trừ'}: ${EX(t,[[up?1:-1,d]]).txt} = ${N(val)}°C.`};}
function saAlt(){const a=ri(10,60),b=ri(5,a-1),c=ri(3,30),val=-a+b-c;return{stem:`Một tàu ngầm đang ở độ cao ${N(-a)} m so với mực nước biển. Tàu nổi lên ${b} m, sau đó lặn xuống ${c} m. Độ cao của tàu lúc sau là bao nhiêu mét?`,ans:[val],exp:`${EX(-a,[[1,b],[-1,c]]).txt} = ${N(val)} m.`};}
function saProfit(){let m,s;do{m=[ri(5,40),ri(5,40),ri(5,40)].map(v=>sgn()*v);s=sum(m);}while(s===0||m.every(x=>x>0)||m.every(x=>x<0));const nm=['tháng 1','tháng 2','tháng 3'];return{stem:`Một cửa hàng trong ba tháng liên tiếp: ${m.map((v,i)=>`${nm[i]} ${v>0?'lãi':'lỗ'} ${Math.abs(v)} triệu đồng`).join(', ')}. Tổng lợi nhuận ba tháng là bao nhiêu triệu đồng? (Số âm là lỗ.)`,ans:[s],exp:`Lãi là số dương, lỗ là số âm: ${SUMX(m)} = ${N(s)} triệu đồng.`};}

const SA=[
 {id:'s_cg_nb',topic:'cg',level:'NB',unit:'',gen:saAddNeg},
 {id:'s_cg_th',topic:'cg',level:'TH',unit:'',gen:saAddDiff},
 {id:'s_cg_vd',topic:'cg',level:'TH',unit:'',gen:saSum4},
 {id:'s_cg_vd2',topic:'cg',level:'VD',unit:'',gen:saRange},
 {id:'s_tc_nb',topic:'tc',level:'NB',unit:'',gen:saZero},
 {id:'s_tc_th',topic:'tc',level:'TH',unit:'',gen:saAssoc3},
 {id:'s_tc_vd',topic:'tc',level:'VD',unit:'',gen:saAssoc6},
 {id:'s_tr_nb',topic:'tr',level:'NB',unit:'',gen:saSubNB},
 {id:'s_tr_th',topic:'tr',level:'TH',unit:'',gen:saSubTH},
 {id:'s_tr_th2',topic:'tr',level:'TH',unit:'°C',gen:saDiffTemp},
 {id:'s_tr_vd',topic:'tr',level:'TH',unit:'',gen:saSub3},
 {id:'s_tr_vd2',topic:'tr',level:'TH',unit:'',gen:saUnknown},
 {id:'s_dn_nb',topic:'dn',level:'NB',unit:'',gen:saMove},
 {id:'s_dn_th',topic:'dn',level:'TH',unit:'m',gen:saGap},
 {id:'s_dn_th2',topic:'dn',level:'TH',unit:'°C',gen:saAfterTemp},
 {id:'s_dn_vd',topic:'dn',level:'VD',unit:'m',gen:saAlt},
 {id:'s_dn_vd2',topic:'dn',level:'VD',unit:'triệu đồng',gen:saProfit}
].map(q=>Object.assign({type:'sa'},q));
SA.push(...SA.map(q=>Object.assign({},q,{id:q.id+'b'})));

/* ============ Chủ đề ============ */
const TOPICS={
  cg:{short:'Cộng hai số nguyên',name:'Cộng hai số nguyên',rule:'Cộng hai số nguyên âm: cộng hai số tự nhiên sau dấu "−" rồi đặt dấu "−" trước kết quả. Cộng hai số nguyên khác dấu (không đối nhau): lấy số lớn trừ số nhỏ trong hai giá trị tuyệt đối, rồi đặt trước kết quả dấu của số có giá trị tuyệt đối lớn hơn. Hai số đối nhau có tổng bằng 0.',tip:'Hai số khác dấu thì lấy hiệu, không cộng hai giá trị tuyệt đối. Dấu của kết quả là dấu của số có giá trị tuyệt đối lớn hơn.'},
  tc:{short:'Tính chất phép cộng',name:'Tính chất của phép cộng',rule:'Giao hoán: a + b = b + a. Kết hợp: (a + b) + c = a + (b + c). Cộng với số 0: a + 0 = a. Cộng với số đối: a + (−a) = 0.',tip:'Nhóm các số đối nhau (tổng bằng 0) trước để tính nhanh, và nhớ giữ nguyên dấu của mỗi số hạng khi đổi chỗ.'},
  tr:{short:'Trừ hai số nguyên',name:'Trừ hai số nguyên',rule:'Muốn trừ số nguyên a cho số nguyên b, ta cộng a với số đối của b: a − b = a + (−b). Hiệu của hai số nguyên luôn là một số nguyên.',tip:'Trừ cho một số âm thì thành cộng với số dương: a − (−b) = a + b. Không đảo thứ tự: a − b khác b − a.'},
  dn:{short:'Bài toán thực tế',name:'Bài toán thực tế và trục số',rule:'Số nguyên âm biểu diễn nhiệt độ dưới 0°C, độ cao dưới mực nước biển, số tiền nợ hay lỗ. Tăng là cộng, giảm là trừ. Trên trục số, cộng là sang phải, trừ là sang trái. Chênh lệch giữa hai giá trị là hiệu của số lớn trừ số bé.',tip:'Đọc kĩ tình huống và viết phép tính trước khi tính. Cẩn thận khi trừ cho số âm: 8 − (−5) = 8 + 5 = 13, không phải 3.'}
};
const TKEYS=['cg','tc','tr','dn'];
const TDESC={cg:'Cộng hai số nguyên âm, hai số khác dấu, hai số đối nhau',tc:'Giao hoán, kết hợp, cộng với 0, cộng với số đối, tính hợp lý',tr:'Số đối, trừ hai số nguyên, a − (−b)',dn:'Trục số, nhiệt độ, độ cao, lãi lỗ'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhớ quy tắc cộng, trừ số nguyên, tên các tính chất, số đối, ý nghĩa của số âm trong thực tế.',TH:'Cộng, trừ hai số nguyên; tính hợp lý ba số; trục số; bài toán thực tế một bước.',VD:'Tính tổng nhiều số hạng, tính hợp lý, tìm x, bài toán thực tế nhiều bước.'};

/* ============ Ngân hàng nhiều lựa chọn ============ */
const O=(t,err)=>err?{t,err}:{t};
const MC=[
 {id:'m1',topic:'cg',level:'NB',stem:'Muốn cộng hai số nguyên âm, ta làm thế nào?',ans:0,opts:[
   O('Cộng hai số tự nhiên sau dấu "−" rồi đặt dấu "−" trước kết quả'),
   O('Lấy hiệu hai số tự nhiên rồi đặt dấu "+" trước kết quả','Hai số cùng dấu thì ta cộng chứ không lấy hiệu, và kết quả mang dấu chung "−".'),
   O('Cộng hai số tự nhiên sau dấu "−" rồi đặt dấu "+" trước kết quả','Tổng của hai số nguyên âm luôn là số nguyên âm.'),
   O('Lấy số lớn trừ số nhỏ rồi đặt dấu của số lớn hơn','Đó là quy tắc cho hai số khác dấu, không phải hai số cùng dấu.')],
  exp:'Cộng hai số nguyên âm: cộng hai số tự nhiên sau dấu "−" rồi đặt dấu "−" trước kết quả. Ví dụ (−3) + (−4) = −7.'},
 {id:'m2',topic:'cg',level:'NB',stem:'Tổng của hai số nguyên âm là:',ans:0,opts:[
   O('luôn là một số nguyên âm'),
   O('luôn là một số nguyên dương','Cộng hai số âm thì kết quả vẫn là số âm. Ví dụ (−2) + (−5) = −7.'),
   O('có thể bằng 0','Tổng bằng 0 chỉ khi hai số đối nhau, mà khi đó một số âm, một số dương.'),
   O('có thể là số âm, có thể là số dương','Hai số nguyên âm cộng lại luôn cho số nguyên âm.')],
  exp:'Cộng hai số nguyên âm được số nguyên âm (cộng hai số tự nhiên rồi đặt dấu "−").'},
 {id:'m3',topic:'cg',level:'NB',stem:'Tổng của hai số nguyên đối nhau bằng bao nhiêu?',ans:0,opts:[
   O('0'),O('Chính số đó','Ví dụ 4 + (−4) = 0, không phải 4.'),O('Gấp đôi số đó','Ví dụ 4 + (−4) = 0, không phải 8.'),O('Số đối của số đó','Ví dụ 4 + (−4) = 0, không phải −4.')],
  exp:'Hai số đối nhau có tổng bằng 0: a + (−a) = 0.'},
 {id:'m4',topic:'cg',level:'TH',stem:'Quy tắc cộng hai số nguyên khác dấu (không đối nhau) là gì?',ans:0,opts:[
   O('Lấy số lớn trừ số nhỏ trong hai giá trị tuyệt đối, rồi đặt trước kết quả dấu của số có giá trị tuyệt đối lớn hơn'),
   O('Cộng hai giá trị tuyệt đối rồi đặt dấu "−" trước kết quả','Hai số khác dấu thì ta lấy hiệu hai giá trị tuyệt đối chứ không cộng.'),
   O('Lấy số lớn trừ số nhỏ trong hai giá trị tuyệt đối rồi đặt dấu "+" trước kết quả','Dấu của kết quả là dấu của số có giá trị tuyệt đối lớn hơn, có thể là dấu "−".'),
   O('Cộng hai giá trị tuyệt đối rồi đặt dấu của số đứng trước','Phải lấy hiệu hai giá trị tuyệt đối, không phải tổng.')],
  exp:'Ví dụ (−9) + 4: lấy 9 − 4 = 5, số −9 có giá trị tuyệt đối lớn hơn nên kết quả là −5.'},
 {id:'m5',topic:'cg',level:'TH',stem:'Phép tính nào sau đây có kết quả là một số nguyên âm?',ans:0,opts:[
   O('(−12) + 5'),O('12 + (−5)','Kết quả là 7, số dương, vì số 12 có giá trị tuyệt đối lớn hơn.'),O('(−5) + 12','Kết quả là 7, số dương, vì số 12 có giá trị tuyệt đối lớn hơn.'),O('9 + (−4)','Kết quả là 5, số dương, vì số 9 có giá trị tuyệt đối lớn hơn.')],
  exp:'(−12) + 5 = −7: số −12 có giá trị tuyệt đối lớn hơn nên kết quả là số âm.'},
 {id:'m6',topic:'cg',level:'TH',stem:'Cho a là số nguyên âm, b là số nguyên dương và |a| > |b|. Khẳng định nào đúng?',ans:0,opts:[
   O('a + b là số nguyên âm'),
   O('a + b là số nguyên dương','Dấu của tổng là dấu của số có giá trị tuyệt đối lớn hơn, đó là số a (âm).'),
   O('a + b = 0','Tổng chỉ bằng 0 khi |a| = |b|.'),
   O('a + b > b','Vì a âm nên a + b nhỏ hơn b.')],
  exp:'Số a có giá trị tuyệt đối lớn hơn nên a + b mang dấu của a, tức là số nguyên âm. Ví dụ (−7) + 3 = −4.'},
 {id:'m7',topic:'cg',level:'VD',stem:'Cho a là số nguyên âm, b là số nguyên dương và a + b = 0. Khẳng định nào đúng?',ans:0,opts:[
   O('a và b là hai số đối nhau'),
   O('a = b','a âm còn b dương nên không thể bằng nhau.'),
   O('a và b đều bằng 0','a là số nguyên âm, b là số nguyên dương nên cả hai đều khác 0.'),
   O('Không có hai số a, b như vậy','Ví dụ a = −3 và b = 3 thỏa mãn.')],
  exp:'Hai số có tổng bằng 0 là hai số đối nhau, ví dụ −3 và 3.'},
 {id:'m8',topic:'tc',level:'NB',stem:'Đẳng thức nào sau đây thể hiện tính chất kết hợp của phép cộng?',ans:0,opts:[
   O('(a + b) + c = a + (b + c)'),O('a + b = b + a','Đây là tính chất giao hoán.'),O('a + 0 = a','Đây là tính chất cộng với số 0.'),O('a + (−a) = 0','Đây là tính chất cộng với số đối.')],
  exp:'Tính chất kết hợp: khi cộng ba số, ta có thể nhóm hai số bất kì trước: (a + b) + c = a + (b + c).'},
 {id:'m9',topic:'tc',level:'NB',stem:'Với mọi số nguyên a, đẳng thức nào luôn đúng?',ans:0,opts:[
   O('a + 0 = a'),O('a + 0 = 0','Cộng với 0 thì giữ nguyên số đó, không phải bằng 0.'),O('a + a = 0','Chỉ đúng khi a = 0. Đẳng thức đúng với mọi a là a + (−a) = 0.'),O('a + 0 = −a','Cộng với 0 không đổi dấu của số đó.')],
  exp:'Số 0 cộng với số nguyên nào cũng bằng chính số đó: a + 0 = a.'},
 {id:'m10',topic:'tc',level:'TH',stem:'Khi tính hợp lý (−46) + 17 + 46, ta nên nhóm hai số nào lại với nhau trước?',ans:0,opts:[
   O('(−46) và 46'),O('(−46) và 17','Hai số này không đối nhau nên không triệt tiêu được.'),O('17 và 46','Hai số này không đối nhau nên không triệt tiêu được.'),O('Không thể nhóm','Phép cộng có tính chất giao hoán và kết hợp nên có thể nhóm tùy ý.')],
  exp:'(−46) + 46 = 0, nên tổng bằng 0 + 17 = 17.'},
 {id:'m11',topic:'tc',level:'TH',stem:'Tính chất nào cho phép viết (−7) + 4 + 7 = (−7) + 7 + 4?',ans:0,opts:[
   O('Tính chất giao hoán'),O('Tính chất cộng với số 0','Hai vế không có số 0 để so sánh; ở đây hai số hạng 4 và 7 đổi chỗ cho nhau.'),O('Tính chất cộng với số đối','Tính chất đó nói a + (−a) = 0; ở đây chỉ là đổi chỗ hai số hạng.'),O('Phép trừ có tính chất giao hoán','Đề bài chỉ có phép cộng, không có phép trừ.')],
  exp:'Hai số hạng 4 và 7 đổi chỗ cho nhau, tổng không đổi: đó là tính chất giao hoán.'},
 {id:'m12',topic:'tr',level:'NB',stem:'Muốn trừ số nguyên a cho số nguyên b, ta cộng a với:',ans:0,opts:[
   O('số đối của b'),O('số đối của a','Phải đổi dấu số trừ b, không phải số bị trừ a.'),O('chính số b','Cộng với b chỉ cho a + b, không phải a − b.'),O('số 0','Cộng với 0 không thay đổi a.')],
  exp:'a − b = a + (−b): cộng a với số đối của b.'},
 {id:'m13',topic:'tr',level:'NB',stem:'Đẳng thức nào sau đây đúng với mọi số nguyên a và b?',ans:0,opts:[
   O('a − b = a + (−b)'),O('a − b = b − a','Phép trừ không giao hoán. Ví dụ 5 − 3 = 2 còn 3 − 5 = −2.'),O('a − b = (−a) + b','Đây là b − a, ngược dấu với a − b.'),O('a − b = a + b','Chỉ đúng khi b = 0.')],
  exp:'Quy tắc trừ hai số nguyên: a − b = a + (−b).'},
 {id:'m14',topic:'tr',level:'TH',stem:'Trong tập hợp ℤ, phép trừ có luôn thực hiện được không?',ans:0,opts:[
   O('Luôn thực hiện được: hiệu của hai số nguyên là một số nguyên'),
   O('Chỉ thực hiện được khi số bị trừ lớn hơn hoặc bằng số trừ','Đó là điều kiện trong tập ℕ. Trong ℤ, 3 − 5 = −2 vẫn là số nguyên.'),
   O('Chỉ thực hiện được khi cả hai số đều dương','Phép trừ thực hiện được với mọi cặp số nguyên, không cần điều kiện dấu.'),
   O('Chỉ thực hiện được khi cả hai số đều âm','Phép trừ thực hiện được với mọi cặp số nguyên, không cần điều kiện dấu.')],
  exp:'Hiệu của hai số nguyên bất kì luôn là một số nguyên, vì a − b = a + (−b) và tổng hai số nguyên là số nguyên.'},
 {id:'m15',topic:'dn',level:'NB',stem:'Số dư tài khoản của một người là −200 nghìn đồng. Điều đó có nghĩa là người đó:',ans:0,opts:[
   O('đang nợ 200 nghìn đồng'),O('có 200 nghìn đồng','Số dư âm không phải là có tiền. Số âm biểu diễn tiền nợ.'),O('có 2 000 nghìn đồng','Số dư là −200, giá trị tuyệt đối của nó là 200, không phải 2 000.'),O('chưa có khoản nào','Số dư khác 0 nên đã có giao dịch; số dư âm là đang nợ.')],
  exp:'Số nguyên âm dùng để biểu diễn tiền nợ, nên số dư −200 nghìn đồng nghĩa là nợ 200 nghìn đồng.'},
 {id:'m16',topic:'dn',level:'NB',stem:'Nhiệt độ lúc đầu là −3°C, sau đó tăng 5°C. Phép tính nào cho nhiệt độ lúc sau?',ans:0,opts:[
   O('(−3) + 5'),O('(−3) − 5','Nhiệt độ tăng thì cộng thêm, không phải trừ đi.'),O('3 + 5','Nhiệt độ lúc đầu là −3°C, không phải 3°C.'),O('3 − 5','Nhiệt độ lúc đầu là −3°C và tăng là phép cộng.')],
  exp:'Tăng là cộng: (−3) + 5 = 2, nhiệt độ lúc sau là 2°C.'},
 {id:'m17',topic:'tr',level:'TH',stem:'Cho A = 15 − (−7) và B = 15 + (−7). Khẳng định nào đúng?',ans:0,opts:[
   O('A > B'),O('A = B','A = 15 + 7 = 22 còn B = 15 − 7 = 8, hai số khác nhau.'),O('A < B','A = 22 lớn hơn B = 8.'),O('A và B là hai số đối nhau','A = 22 và B = 8 không phải hai số đối nhau.')],
  exp:'A = 15 − (−7) = 15 + 7 = 22; B = 15 + (−7) = 8. Vậy A > B.'}
].map(q=>Object.assign({type:'mc'},q));
const addMC=(id,topic,level,gen)=>MC.push({id,type:'mc',topic,level,gen});
['a','b','c'].forEach(x=>{
  addMC('g_addneg_'+x,'cg','NB',genAddNeg);
  addMC('g_adddiff_'+x,'cg','TH',genAddDiff);
  addMC('g_sum4_'+x,'cg','TH',genSum4);
  addMC('g_range_'+x,'cg','VD',genRangeSum);
  addMC('g_prop_'+x,'tc','NB',genProp);
  addMC('g_assoc3_'+x,'tc','TH',genAssoc3);
  addMC('g_assoc4_'+x,'tc','VD',genAssoc4);
  addMC('g_opp_'+x,'tr','NB',genOpp);
  addMC('g_subnb_'+x,'tr','NB',genSubNB);
  addMC('g_subneg_'+x,'tr','TH',genSubNeg);
  addMC('g_subadd_'+x,'tr','TH',genSubAsAdd);
  addMC('g_dtemp_'+x,'tr','TH',genDiffTemp);
  addMC('g_sub3_'+x,'tr','TH',genSub3);
  addMC('g_unk_'+x,'tr','TH',genUnknown);
  addMC('g_atemp_'+x,'dn','TH',genAfterTemp);
  addMC('g_alt_'+x,'dn','VD',genAlt);
  addMC('g_profit_'+x,'dn','VD',genProfit);
});

['a','b'].forEach(x=>addMC('g_move_'+x,'dn','NB',genMove));
['a','b','c'].forEach(x=>{addMC('g_diffalt_'+x,'dn','TH',genDiffAlt);addMC('g_elev_'+x,'dn','VD',genElev);});

const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
const tCalcTH=tfCalc('TH'),tCalcVD=tfCalc('VD'),tSubTH=tfSub('TH'),tSubVD=tfSub('VD');
['a','b'].forEach(x=>{
  addTF('tf_prop_nb_'+x,'tc','NB',tfPropNB());
  addTF('tf_prop_th_'+x,'tc','TH',tfPropTH());
  addTF('tf_prop_vd_'+x,'tc','VD',tfPropVD());
  addTF('tf_calc_th_'+x,'cg','TH',tCalcTH);
  addTF('tf_calc_vd_'+x,'cg','VD',tCalcVD);
  addTF('tf_sub_th_'+x,'tr','TH',tSubTH);
  addTF('tf_sub_vd_'+x,'tr','VD',tSubVD);
  addTF('tf_line_'+x,'dn','TH',tfLineTH());
  addTF('tf_gap_'+x,'dn','VD',tfGapVD());
  addTF('tf_real_'+x,'dn','TH',tfRealTH());
});
addTF('tf_real_c','dn','TH',tfRealTH());
addTF('tf_calc_th_c','cg','TH',tCalcTH);
addTF('tf_sub_th_c','tr','TH',tSubTH);
addTF('tf_prop_th_c','tc','TH',tfPropTH());
addTF('tf_ctx_tau','dn','VD',tfCtx(ctxSub));
addTF('tf_ctx_nhiet','dn','VD',tfCtx(ctxTemp));
addTF('tf_ctx_lai','dn','VD',tfCtx(ctxShop));
['a','b','c'].forEach(x=>addTF('tf_sign_nb_'+x,'cg','NB',tfSignNB()));
addTF('tf_prop_nb_c','tc','NB',tfPropNB());

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
function tfHardC(){
  for(let n=0;n<60;n++){
    const m=ri(5,30),k=ri(2,20),[p,q]=sample(2,11,60),v=[0,1,2,3].map(()=>RNG()<.5);
    const items=shuffle([
      IT(`Tổng tất cả các số nguyên x thỏa mãn ${nb(`${N(-m)} ≤ x ≤ ${m}`)} bằng ${v[0]?0:m}.`,v[0],'tc','VD',`Các số từ ${N(-m)} đến ${m} gồm số 0 và các cặp số đối nhau, mỗi cặp có tổng bằng 0. Vậy tổng bằng 0.`),
      IT(v[1]?`Nếu a là số nguyên âm thì ${nb(`a − ${k}`)} là số nguyên âm.`:`Nếu a là số nguyên âm thì ${nb(`${k} − a`)} là số nguyên âm.`,v[1],'tr','VD',v[1]?`${nb(`a − ${k} = a + (−${k})`)} là tổng của hai số nguyên âm nên là số nguyên âm.`:`${nb(`${k} − a = ${k} + (−a)`)}, mà −a là số nguyên dương, nên kết quả là số nguyên dương.`),
      IT(v[2]?'Hiệu của một số nguyên âm và một số nguyên dương luôn là một số nguyên âm.':'Hiệu của hai số nguyên âm luôn là một số nguyên âm.',v[2],'tr','VD',v[2]?'Trừ đi một số nguyên dương là cộng với một số nguyên âm; tổng của hai số nguyên âm là số nguyên âm.':'Ví dụ (−2) − (−5) = (−2) + 5 = 3 là số nguyên dương.'),
      IT(v[3]?'Nếu hai số nguyên a và b có a + b = 0 thì a và b là hai số đối nhau.':'Nếu hai số nguyên a và b có a + b = 0 thì a = b.',v[3],'tc','VD',v[3]?'Hai số nguyên có tổng bằng 0 là hai số đối nhau.':'Ví dụ 3 + (−3) = 0 nhưng 3 ≠ −3. Hai số có tổng bằng 0 là hai số đối nhau, không phải hai số bằng nhau.')]);
    if(tfOK(items))return {stem:'Xét các phát biểu sau:',items};
  }
  return FB_TF();
}
const HARD={tf:[{id:'h_tc',type:'tf',topic:'tr',level:'VD',gen:tfHardC}],sa:[
 {id:'h_tong',topic:'tc',level:'VD',unit:'',gen:()=>{const a=ri(4,12),b=a+ri(0,3),rest=[];for(let x=a;x<=b;x++)rest.push(x);const s=sum(rest);return{stem:`Tính tổng tất cả các số nguyên x thỏa mãn ${nb(`${N(-a)} < x ≤ ${b}`)}.`,ans:[s],exp:`Các số từ ${N(-(a-1))} đến ${a-1} gồm số 0 và các cặp số đối nhau nên có tổng bằng 0. Còn lại ${rest.length>1?nb(rest.join(' + ')+' = '+s):s}. Vậy tổng bằng ${s}.`};}},
 {id:'h_hl',topic:'tc',level:'VD',unit:'',gen:()=>{const [p,q,r,t]=sample(4,120,480);return{stem:`Tính một cách hợp lí: ${SUMX(shuffle([p,-q,r,-p,q,-t]))}.`,ans:[r-t],exp:`Nhóm các cặp số đối nhau: ${nb(`${p} + ${P(-p)} = 0`)}; ${nb(`${q} + ${P(-q)} = 0`)}. Còn lại ${nb(`${r} + ${P(-t)} = ${N(r-t)}`)}.`};}},
 {id:'h_x',topic:'tr',level:'VD',unit:'',gen:()=>{const a=ri(5,60),b=sgn()*ri(5,60),c=sgn()*ri(5,60);return{stem:`Tìm số nguyên x, biết ${nb(`x − ${a} = ${N(b)} + ${P(c)}`)}.`,ans:[a+b+c],exp:`Tính vế phải: ${nb(`${N(b)} + ${P(c)} = ${N(b+c)}`)}. Vậy ${nb(`x = ${N(b+c)} + ${a} = ${N(a+b+c)}`)}.`};}},
 {id:'h_day',topic:'tc',level:'VD',unit:'',gen:()=>{const n=ri(20,60);return{stem:`Tính ${nb(`S = 1 − 2 + 3 − 4 + … + ${2*n-1} − ${2*n}`)}.`,ans:[-n],exp:`Nhóm thành ${n} cặp: ${nb(`(1 − 2) + (3 − 4) + … + (${2*n-1} − ${2*n})`)}. Mỗi cặp bằng −1 nên S = ${N(-n)}.`};}},
 {id:'h_tk',topic:'tr',level:'VD',unit:'nghìn đồng',gen:()=>{const x=10*ri(5,30),y=10*ri(10,40),z=10*ri(5,30),R=10*ri(-20,30),s0=R-x+y+z;return{stem:`Tài khoản của bác Lan nhận thêm ${x} nghìn đồng, rồi chi ${y} nghìn đồng và chi tiếp ${z} nghìn đồng thì số dư là ${N(R)} nghìn đồng (số dư âm nghĩa là đang nợ). Hỏi lúc đầu tài khoản có bao nhiêu nghìn đồng?`,ans:[s0],exp:`Gọi số tiền lúc đầu là a. Ta có ${nb(`a + ${x} − ${y} − ${z} = ${N(R)}`)}, nên ${nb(`a = ${N(R)} − ${x} + ${y} + ${z} = ${N(s0)}`)} (nghìn đồng).`};}}
].map(q=>Object.assign({type:'sa'},q))};
const SG=x=>x>0?'+'+x:N(x);
const PISA=[
 ()=>{const s0=10*ri(5,15),rows=[['Đóng quỹ đợt 1',10*ri(15,30)],['Mua hoa ngày 20/11',-10*ri(12,25)],['Liên hoan cuối kì',-10*ri(15,30)],['Bán giấy vụn',10*ri(3,9)],['Mua phần thưởng',-10*ri(8,20)]];
  let cur=s0,mn=s0;const run=rows.map(r=>{cur+=r[1];mn=Math.min(mn,cur);return cur;}),chi=sum(rows.map(r=>r[1]).filter(v=>v<0)),fin=cur,T=(Math.ceil(Math.max(fin,0)/100)+2)*100;
  return {title:'Quỹ lớp 6A',ctx:`<p class="stem">Thủ quỹ lớp 6A ghi lại các khoản thu (số dương) và chi (số âm) của quỹ lớp trong học kì I theo thứ tự thời gian, đơn vị nghìn đồng. Đầu học kì quỹ có ${s0} nghìn đồng.</p>${tbl(['Nội dung','Số tiền (nghìn đồng)'],rows.map(r=>[r[0],SG(r[1])]))}`,qs:[
   saq('Tổng các khoản chi trong bảng, viết dưới dạng một số nguyên âm, là bao nhiêu nghìn đồng?',chi,'nghìn đồng',`${nb(rows.filter(r=>r[1]<0).map((r,i)=>i?P(r[1]):N(r[1])).join(' + ')+' = '+N(chi))}.`,'cg','TH'),
   saq('Cuối học kì I, quỹ lớp còn bao nhiêu nghìn đồng? (Nếu quỹ bị thiếu thì ghi số âm.)',fin,'nghìn đồng',`${nb(s0+' + '+rows.map(r=>P(r[1])).join(' + ')+' = '+N(fin))}.`,'dn','VD'),
   saq('Trong cả học kì, lúc quỹ ở mức thấp nhất thì quỹ có bao nhiêu nghìn đồng? (Nếu quỹ bị thiếu thì ghi số âm.)',mn,'nghìn đồng',`Số tiền trong quỹ lần lượt là: ${[s0].concat(run).map(N).join('; ')}. Mức thấp nhất là ${N(mn)}.`,'dn','VD'),
   saq(`Lớp muốn đầu học kì II quỹ có ${T} nghìn đồng. Cả lớp cần đóng thêm bao nhiêu nghìn đồng?`,T-fin,'nghìn đồng',`Cuối học kì I quỹ có ${N(fin)} nghìn đồng. Cần đóng thêm ${nb(`${T} − ${P(fin)} = ${T-fin}`)} (nghìn đồng).`,'tr','VD')]};},
 ()=>{for(;;){const D=['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm'],lo=D.map(()=>ri(-9,1)),hi=lo.map(l=>l+ri(4,12)),amp=lo.map((l,i)=>hi[i]-l),mx=Math.max(...amp);
   if(amp.filter(a=>a===mx).length>1||lo[3]===lo[0]||!lo.some(l=>l<0))continue;
   const negs=lo.map((l,i)=>l<0&&hi[i]>0?i:-1).filter(i=>i>=0);if(!negs.length)continue;
   const i=sel(negs),im=amp.indexOf(mx),H=Math.max(...hi),L=Math.min(...lo);
   return {title:'Dự báo thời tiết vùng núi cao',ctx:`<p class="stem">Bảng sau là dự báo nhiệt độ thấp nhất và cao nhất trong bốn ngày ở một thị trấn vùng núi cao.</p>${tbl(['Ngày','Thấp nhất (°C)','Cao nhất (°C)'],D.map((d,j)=>[d,N(lo[j]),N(hi[j])]))}`,qs:[
   saq(`Trong ngày ${D[i]}, nhiệt độ cao nhất hơn nhiệt độ thấp nhất bao nhiêu độ C?`,amp[i],'°C',`${nb(`${hi[i]} − ${P(lo[i])} = ${hi[i]} + ${-lo[i]} = ${amp[i]}`)} (°C).`,'tr','TH'),
   mcq('Ngày nào có chênh lệch giữa nhiệt độ cao nhất và nhiệt độ thấp nhất lớn nhất?',D[im],D.map((d,j)=>[d,`Ngày này chênh lệch ${nb(`${N(hi[j])} − ${P(lo[j])} = ${amp[j]}`)}°C, nhỏ hơn ${mx}°C của ${D[im]}.`]).filter((_,j)=>j!==im),`Chênh lệch từng ngày: ${D.map((d,j)=>`${d} ${amp[j]}°C`).join('; ')}. Lớn nhất là ${D[im]}.`,'tr','VD'),
   saq('Nhiệt độ cao nhất của cả bốn ngày hơn nhiệt độ thấp nhất của cả bốn ngày bao nhiêu độ C?',H-L,'°C',`Cao nhất là ${N(H)}°C, thấp nhất là ${N(L)}°C. Chênh lệch: ${nb(`${N(H)} − ${P(L)} = ${H-L}`)} (°C).`,'tr','VD'),
   saq('So với Thứ Hai, nhiệt độ thấp nhất của Thứ Năm thay đổi bao nhiêu độ C? (Tăng thì ghi số dương, giảm thì ghi số âm.)',lo[3]-lo[0],'°C',`${nb(`${N(lo[3])} − ${P(lo[0])} = ${N(lo[3]-lo[0])}`)}: nhiệt độ thấp nhất ${lo[3]>lo[0]?'tăng':'giảm'} ${Math.abs(lo[3]-lo[0])}°C.`,'tr','VD')]};}}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'cg',fig:'<div class="figbox"><p>(−6) + (−4) = −(6 + 4) = −10</p><p>(−9) + 4 = −(9 − 4) = −5</p><p>7 + (−7) = 0</p></div>',extra:'Hai số khác dấu: lấy hiệu hai giá trị tuyệt đối, dấu của số có giá trị tuyệt đối lớn hơn.'},
  {k:'tc',fig:'<div class="figbox"><p>a + b = b + a</p><p>(a + b) + c = a + (b + c)</p><p>a + 0 = a; a + (−a) = 0</p></div>',extra:'Ví dụ: (−46) + 17 + 46 = ((−46) + 46) + 17 = 17.'},
  {k:'tr',fig:'<div class="figbox"><p>a − b = a + (−b)</p><p>5 − 8 = 5 + (−8) = −3</p><p>7 − (−2) = 7 + 2 = 9</p></div>',extra:'Trừ cho một số âm thì thành cộng với số dương.'},
  {k:'dn',fig:'<div class="figbox"><p>Tăng là cộng, giảm là trừ</p><p>(−3) + 5 = 2 (nhiệt độ −3°C tăng 5°C)</p><p>Chênh lệch: 8 − (−5) = 8 + 5 = 13</p></div>',extra:'Lỗ, nợ, dưới 0 là số nguyên âm. Trên trục số, cộng là sang phải, trừ là sang trái.'}
];

/* ==== Toán thực tế bổ sung: bắt đầu ==== */
{
const nm=x=>{const r=Math.round(x*1e6)/1e6;return (r<0?'−':'')+String(Math.abs(r)).replace('.',',');};
const T=(h,r)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${r.map(w=>`<tr>${w.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const P=s=>`<p class="stem">${s}</p>`;
const Fh=(n,d)=>`<span class="fr"><span>${nm(n)}</span><span>${nm(d)}</span></span>`;
const MCQ=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const SAQ=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const M=(stem,right,wr,exp,tp,lv)=>{const q=MCQ(stem,right,wr,exp,tp,lv);if(q.opts.length!==4||new Set(q.opts.map(o=>String(o.t))).size!==4||q.opts.slice(1).some(o=>!o.err))throw 0;return q;};
const A=(stem,ans,unit,exp,tp,lv,at)=>{if(!isFinite(ans))throw 0;return Object.assign(SAQ(stem,ans,unit,exp,tp,lv),{at:at||nm(ans)});};
const G=f=>()=>{for(let k=0;k<3000;k++){try{const u=f();if(u)return u;}catch(e){if(e!==0)throw e;}}throw new Error('Toán thực tế: không sinh được tình huống');};
const pk=(a,n)=>shuffle(a).slice(0,n);
const near5=(x,k)=>{const v=Math.abs(x)*Math.pow(10,k);return Math.abs(v-Math.floor(v)-0.5)<0.02;};
const rd=(x,k)=>{const p=Math.pow(10,k);return Math.round(x*p+(x>=0?1e-9:-1e-9))/p;};
const dexp=(p,q)=>{const I=Math.floor(p/q);let r=p%q;const seen={},ds=[];while(r&&seen[r]===undefined){seen[r]=ds.length;r*=10;ds.push(Math.floor(r/q));r%=q;}if(!r)return {I,pre:ds.join(''),per:''};const k=seen[r];return {I,pre:ds.slice(0,k).join(''),per:ds.slice(k).join('')};};
const dstr=o=>o.per?`${o.I},${o.pre}(${o.per})`:(o.pre?`${o.I},${o.pre}`:`${o.I}`);
const dig=(p,q,k)=>{let r=p%q,d=0;for(let i=0;i<k;i++){r*=10;d=Math.floor(r/q);r%=q;}return d;};
const gc=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t;}return a;};
const fin=(p,q)=>{q/=gc(p,q);while(q%2===0)q/=2;while(q%5===0)q/=5;return q===1;};
PISA.push(
 G(()=>{const s=ri(-3,6),mv=[ri(3,9),-ri(4,9),-ri(3,8),ri(3,9)];
  const pos=[s];mv.forEach(d=>pos.push(pos[pos.length-1]+d));
  if(pos.some(x=>x<-4||x>15)||pos[3]>=0)throw 0;
  const W=d=>d>0?`Lên ${d} tầng`:`Xuống ${-d} tầng`,ab=mv.map(Math.abs);
  const ex=(sg)=>`${nm(s)} ${sg[0]} ${ab[0]} ${sg[1]} ${ab[1]} ${sg[2]} ${ab[2]} ${sg[3]} ${ab[3]}`;
  const hi=Math.max(...pos),lo=Math.min(...pos);
  return {title:'Thang máy của toà nhà',ctx:P(`Trong một toà nhà, tầng trệt ghi là tầng 0, các tầng hầm ghi là −1; −2; −3; −4. Một thang máy xuất phát từ tầng ${nm(s)} rồi lần lượt thực hiện bốn lượt di chuyển như bảng sau.`)+T(['Lượt','Di chuyển'],mv.map((d,i)=>[i+1,W(d)])),qs:[
   A('Sau lượt 1, thang máy ở tầng nào?',pos[1],'',`${nm(s)} + ${ab[0]} = ${nm(pos[1])}.`,'cg','TH'),
   M('Biểu thức nào cho biết tầng của thang máy sau cả bốn lượt?',ex(['+','−','−','+']),[[ex(['+','+','+','+']),'Đi xuống thì số tầng giảm, phải trừ.'],[ex(['−','+','+','−']),'Đi lên thì cộng, đi xuống thì trừ; biểu thức này làm ngược lại.'],[ex(['+','−','−','−']),`Lượt 4 là đi lên ${ab[3]} tầng nên phải cộng ${ab[3]}.`]],`Đi lên thì cộng, đi xuống thì trừ: ${ex(['+','−','−','+'])}.`,'tr','TH'),
   A('Sau cả bốn lượt, thang máy ở tầng nào?',pos[4],'',`${ex(['+','−','−','+'])} = ${nm(pos[1])} − ${ab[1]} − ${ab[2]} + ${ab[3]} = ${nm(pos[2])} − ${ab[2]} + ${ab[3]} = ${nm(pos[3])} + ${ab[3]} = ${nm(pos[4])}.`,'dn','VD'),
   A('Tính cả tầng xuất phát, tầng cao nhất và tầng thấp nhất mà thang máy dừng lại cách nhau bao nhiêu tầng?',hi-lo,'tầng',`Thang máy dừng ở các tầng ${pos.map(nm).join('; ')}. Cao nhất là ${nm(hi)}, thấp nhất là ${nm(lo)}. Khoảng cách: ${nm(hi)} − (${nm(lo)}) = ${hi-lo} tầng.`,'tr','VD')]};}),
 G(()=>{const sc=()=>{const x=5*ri(1,8);return RNG()<.5?x:-x;},X=[sc(),sc(),sc(),sc()],D=[sc(),sc(),sc(),sc()];
  const sx=X.reduce((a,b)=>a+b,0),sd=D.reduce((a,b)=>a+b,0);if(sx===sd||X.every(x=>x>0)||D.every(x=>x>0)||X.every(x=>x<0)||D.every(x=>x<0))throw 0;
  const lead=sx>sd?'Đội Xanh':'Đội Đỏ',oth=sx>sd?'Đội Đỏ':'Đội Xanh',k=Math.abs(sx-sd),kw=Math.abs(sx)+Math.abs(sd);
  if(kw===k)throw 0;const m=sc(),need=sd+m-sx;
  const ps=v=>v.map((x,i)=>i?(x<0?` + (${nm(x)})`:` + ${x}`):nm(x)).join('');
  return {title:'Trò chơi tích điểm',ctx:P('Trong một trò chơi, mỗi vòng đội chơi được cộng điểm (ghi số dương) hoặc bị trừ điểm (ghi số âm). Bảng sau ghi điểm của hai đội trong bốn vòng đầu.')+T(['Vòng','Đội Xanh','Đội Đỏ'],X.map((x,i)=>[i+1,nm(x),nm(D[i])])),qs:[
   A('Sau hai vòng đầu, Đội Xanh có bao nhiêu điểm?',X[0]+X[1],'điểm',`${ps(X.slice(0,2))} = ${nm(X[0]+X[1])}.`,'cg','TH'),
   A('Sau bốn vòng, Đội Đỏ có bao nhiêu điểm?',sd,'điểm',`${ps(D)} = ${nm(sd)}.`,'cg','TH'),
   M('Sau bốn vòng, đội nào dẫn trước và hơn đội kia bao nhiêu điểm?',`${lead}, hơn ${k} điểm`,[[`${oth}, hơn ${k} điểm`,`Đội Xanh có ${nm(sx)} điểm, Đội Đỏ có ${nm(sd)} điểm; số lớn hơn là của ${lead}.`],[`${lead}, hơn ${kw} điểm`,'Không cộng phần số của hai tổng điểm; hiệu hai số nguyên là số lớn trừ số nhỏ.'],[`${oth}, hơn ${kw} điểm`,'Cả đội dẫn trước và số điểm hơn đều chưa đúng.']],`Đội Xanh: ${nm(sx)} điểm, Đội Đỏ: ${nm(sd)} điểm. ${lead} hơn: ${nm(Math.max(sx,sd))} − (${nm(Math.min(sx,sd))}) = ${k} điểm.`,'tr','VD'),
   A(`Ở vòng 5, Đội Đỏ được ghi ${nm(m)} điểm. Đội Xanh phải được ghi bao nhiêu điểm ở vòng 5 để sau năm vòng hai đội bằng điểm nhau?`,need,'điểm',`Sau vòng 5, Đội Đỏ có ${nm(sd)} + (${nm(m)}) = ${nm(sd+m)} điểm. Đội Xanh cần ghi ${nm(sd+m)} − (${nm(sx)}) = ${nm(need)} điểm.`,'tr','VD')]};})
);
}
/* ==== Toán thực tế bổ sung: kết thúc ==== */
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='pc6_seen';
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
  const mcSlots=[['cg',['NB']],['cg',['TH']],['tc',['NB']],['tc',['TH','VD']],['tr',['NB','TH']],['dn',['TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['cg','tr','dn'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=[
    pick(MC.filter(q=>q.topic==='cg'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='tc'&&q.level!=='VD'),used),
    pick(MC.filter(q=>q.topic==='tr'&&q.level!=='VD'),used),
    pick(MC.filter(q=>q.topic==='dn'&&q.level==='TH'),used)
  ];
  const sa=[pick(SA.filter(q=>q.topic==='cg'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='tr'&&q.level!=='VD'),used)];
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
