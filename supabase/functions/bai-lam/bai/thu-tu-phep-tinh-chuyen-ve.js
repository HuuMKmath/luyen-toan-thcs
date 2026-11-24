// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ thu-tu-phep-tinh-chuyen-ve/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "thu-tu-phep-tinh-chuyen-ve";
export const TIEN_TO = "TC7-";

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

/* ============ Hàm dùng chung ============ */
const N=x=>x<0?'−'+(-x):''+x;
const fr=(n,d)=>`<span class="fr"><span>${N(n)}</span><span>${N(d)}</span></span>`;
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t;}return a;};
const Rq=(n,d)=>{const g=gcd(n,d)||1;n/=g;d/=g;if(d<0){n=-n;d=-d;}return [n,d];};
const eqQ=(a,b)=>a[0]===b[0]&&a[1]===b[1];
const qa=(a,b)=>Rq(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const qs=(a,b)=>Rq(a[0]*b[1]-b[0]*a[1],a[1]*b[1]);
const qm=(a,b)=>Rq(a[0]*b[0],a[1]*b[1]);
const qd=(a,b)=>b[0]===0?null:Rq(a[0]*b[1],a[1]*b[0]);
const qp=(a,e)=>{let r=[1,1];for(let i=0;i<e;i++)r=qm(r,a);return r;};
const canDec=q=>{let d=Array.isArray(q)?q[1]:q;while(d%2===0)d/=2;while(d%5===0)d/=5;return d===1;};
const DEC=q=>{let k=0,m=1;while(m%q[1]!==0){m*=10;k++;}const v=String(Math.abs(q[0])*(m/q[1])).padStart(k+1,'0');return (q[0]<0?'−':'')+(k?v.slice(0,v.length-k)+','+v.slice(v.length-k):v);};
const SH=q=>q[1]===1?N(q[0]):fr(q[0],q[1]);
const SHD=q=>(q[1]>1&&canDec(q)&&q[1]<=100)?DEC(q):SH(q);
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^=h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const sgn=()=>RNG()<.5?-1:1;
const vq=q=>q[0]/q[1];
/* ============ Biểu thức: dãy dấu (số, phép tính, ngoặc, số mũ) ============ */
const NUM=(q,h)=>({q,h:h||SH(q)});
const NI=n=>NUM([n,1],N(n));
const ND=q=>NUM(q,SHD(q));
const PAR={'(':')','[':']','{':'}'};
const SUP={2:'²',3:'³'};
function tokText(ts){return ts.map(t=>typeof t==='string'?t:t.h).join('');}
/* trình bày: có khoảng trắng quanh phép tính, không có khoảng trắng trong ngoặc */
function show(ts){let s='';ts.forEach((t,i)=>{if(typeof t==='string'){if('+−·:'.includes(t))s+=' '+t+' ';else s+=t;}else s+=t.h;});return s;}
/* tính giá trị theo chế độ: ok | noparen | lr | addfirst | pow2 ; trả về [tử, mẫu] hoặc null */
function evalToks(ts,mode){
  mode=mode||'ok';
  if(mode==='noparen'||mode==='lrnp')ts=ts.filter(t=>typeof t!=='string'||!'()[]{}'.includes(t));
  let p=0,bad=false;
  const peek=()=>ts[p];
  function atom(){const t=ts[p];if(t===undefined){bad=true;return [0,1];}
    if(typeof t==='object'){p++;return t.q;}
    if(t in PAR){p++;const v=expr();if(ts[p]===PAR[t])p++;return v;}
    bad=true;return [0,1];}
  function power(){let v=atom();const t=ts[p];if(t==='²'||t==='³'){p++;v=mode==='pow2'?qm(v,[t==='²'?2:3,1]):qp(v,t==='²'?2:3);}return v;}
  function term(){let v=power();for(;;){const t=ts[p];if(t==='·'||t===':'){p++;const w=mode==='lr'||mode==='lrnp'?powerOrTerm():power();if(t==='·')v=qm(v,w);else{const r=qd(v,w);if(!r){bad=true;return [0,1];}v=r;}}else break;}return v;}
  function powerOrTerm(){return power();}
  function expr(){
    if(mode==='lr'||mode==='lrnp'){let v=power();for(;;){const t=ts[p];if(t==='+'||t==='−'||t==='·'||t===':'){p++;const w=power();v=t==='+'?qa(v,w):t==='−'?qs(v,w):t==='·'?qm(v,w):(()=>{const r=qd(v,w);if(!r){bad=true;return [0,1];}return r;})();}else break;}return v;}
    if(mode==='addfirst'){let v=sumg();for(;;){const t=ts[p];if(t==='·'||t===':'){p++;const w=sumg();if(t==='·')v=qm(v,w);else{const r=qd(v,w);if(!r){bad=true;return [0,1];}v=r;}}else break;}return v;}
    let v=term();for(;;){const t=ts[p];if(t==='+'||t==='−'){p++;const w=term();v=t==='+'?qa(v,w):qs(v,w);}else break;}return v;}
  function sumg(){let v=power();for(;;){const t=ts[p];if(t==='+'||t==='−'){p++;const w=power();v=t==='+'?qa(v,w):qs(v,w);}else break;}return v;}
  const r=expr();if(bad||p!==ts.length)return null;return r;
}
const E=ts=>show(ts);
/* ============ Dựng câu nhiều lựa chọn ============ */
function pickOpts(goodT,cands){const seen=new Set([goodT]),out=[];for(const c of cands){if(c&&!seen.has(c.t)){seen.add(c.t);out.push({t:c.t,err:c.err});}if(out.length===3)break;}return out;}
const C=(t,err)=>({t,err});
const mk=(stem,good,cands,exp)=>({stem,opts:[{t:good}].concat(pickOpts(good,cands)),ans:0,exp});
const FB_MC=()=>({stem:`Giá trị của biểu thức 2 + 3 · 4 là:`,opts:[{t:'14'},{t:'20',err:'Phải thực hiện phép nhân trước phép cộng.'},{t:'24',err:'Nhân 2 với 3 và 4 là sai thứ tự.'},{t:'10',err:'Cộng 2 với 3 rồi nhân là sai thứ tự phép tính.'}],ans:0,fb:true,exp:'Nhân trước, cộng sau: 2 + 3 · 4 = 2 + 12 = 14.'});
function tryGen(f){for(let n=0;n<400;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>o.t)).size===4)return r;}return FB_MC();}
/* một số ngẫu nhiên hiển thị: nguyên, thập phân một chữ số, hoặc phân số */
const rint=(a,b)=>NI(ri(a,b));
const rdec1=(lo,hi)=>{const v=ri(lo*10,hi*10);return v%10===0?NI(v/10):ND(Rq(v,10));};
const rfrac=()=>{for(;;){const d=sel([2,3,4,5,6,8]),n=ri(1,2*d-1);const q=Rq(n,d);if(q[1]>1)return NUM(q);}};
const inPar=t=>t.q[0]<0?['(',t,')']:[t];
/* chuỗi các số có dấu: nối bằng phép tính, số âm đứng sau phép tính được đặt trong ngoặc */
function chain(items,ops){const out=[];items.forEach((t,i)=>{if(i>0)out.push(ops[i-1]);if(i===0)out.push(t);else out.push(...inPar(t));});return out;}
const OPN={'+':'cộng','−':'trừ','·':'nhân',':':'chia'};
/* hiển thị giá trị: số nguyên, thập phân hữu hạn hoặc phân số */
const VAL=q=>SHD(q);
const VALS=q=>SH(q);

/* ============ Chủ đề ============ */
const TOPICS={
  tt:{short:'Thứ tự phép tính',name:'Thứ tự thực hiện các phép tính (không có dấu ngoặc)',rule:'Thứ tự thực hiện phép tính đối với số tự nhiên vẫn đúng với số hữu tỉ. Biểu thức chỉ có cộng, trừ hoặc chỉ có nhân, chia: thực hiện từ trái sang phải. Biểu thức không có dấu ngoặc: luỹ thừa trước, rồi nhân và chia, cuối cùng cộng và trừ.',tip:'Nhân, chia làm trước cộng, trừ; luỹ thừa làm trước hết. Cộng với trừ (hoặc nhân với chia) cùng bậc nên làm từ trái sang phải. Ví dụ: 1,2 − 3² + 7,5 : 3 = 1,2 − 9 + 2,5 = −5,3.'},
  nn:{short:'Biểu thức có ngoặc',name:'Thứ tự thực hiện các phép tính (có dấu ngoặc)',rule:'Biểu thức có dấu ngoặc: thực hiện trong ngoặc trước, ngoài ngoặc sau, theo thứ tự ngoặc tròn ( ), rồi ngoặc vuông [ ], rồi ngoặc nhọn { }. Trong mỗi ngoặc vẫn làm theo thứ tự luỹ thừa, nhân chia, cộng trừ.',tip:'Làm từ ngoặc trong cùng ra ngoài. Ví dụ [5 + 2 · (9 − 2³)] : 7: trong ngoặc tròn làm 2³ = 8 rồi 9 − 8 = 1; sau đó 2 · 1 = 2, 5 + 2 = 7, cuối cùng 7 : 7 = 1.'},
  dt:{short:'Đẳng thức',name:'Đẳng thức và các tính chất',rule:'Hệ thức A = B gọi là một đẳng thức; A là vế trái, B là vế phải. Nếu a = b thì b = a và a + c = b + c. Chẳng hạn từ 5,1 + x = 7 ta có thể cộng cùng một số vào cả hai vế mà vẫn được đẳng thức.',tip:'Muốn tìm số chưa biết, cộng (hoặc trừ) cùng một số vào cả hai vế của đẳng thức. Ví dụ từ a + 6 = −9: cộng thêm (−6) vào cả hai vế được a = −9 + (−6) = −15.'},
  cv:{short:'Quy tắc chuyển vế',name:'Quy tắc chuyển vế',rule:'Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải đổi dấu số hạng đó: dấu "+" đổi thành dấu "−" và dấu "−" đổi thành dấu "+". Nếu a + b = c thì a = c − b; nếu a − b = c thì a = c + b.',tip:'Chuyển vế phải đổi dấu: x + 3 = 8 thì x = 8 − 3; x − 3 = 8 thì x = 8 + 3. Với a − x = b thì x = a − b, không phải x = b − a. Nhớ bỏ dấu ngoặc đúng quy tắc trước khi chuyển vế.'}
};
const TKEYS=['tt','nn','dt','cv'];
const TDESC={tt:'Thứ tự luỹ thừa, nhân chia, cộng trừ; tính giá trị biểu thức không có ngoặc',nn:'Thứ tự ngoặc ( ), [ ], { }; tính giá trị biểu thức có ngoặc',dt:'Vế trái, vế phải, tính chất của đẳng thức, tìm số hạng chưa biết',cv:'Quy tắc chuyển vế, tìm x, bài toán thực tế dẫn đến chuyển vế'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhớ thứ tự thực hiện phép tính, gọi tên vế trái, vế phải, phát biểu quy tắc chuyển vế.',TH:'Tính giá trị biểu thức có luỹ thừa, số thập phân, ngoặc; tìm x bằng quy tắc chuyển vế.',VD:'Biểu thức nhiều ngoặc lồng nhau, tìm x có dấu ngoặc, bài toán thực tế.'};

/* ============ Dựng biểu thức ============ */
const vstr=q=>VALS(q);                   // hiển thị phân số / số nguyên
const isFin=q=>q&&canDec(q[1]===undefined?1:q[1]);
const okVal=(q,lim)=>q&&canDec(q[1])&&Math.abs(vq(q))<=(lim||5000);
const ERR={
  lr:'Cộng, trừ và nhân, chia không cùng thứ bậc: nhân, chia phải làm trước cộng, trừ (bạn đã tính từ trái sang phải).',
  addfirst:'Phải thực hiện nhân, chia trước cộng, trừ.',
  pow2:'a² là a · a (a³ là a · a · a), không phải 2 · a hay 3 · a.',
  noparen:'Phải thực hiện các phép tính trong ngoặc trước.',
  neg:'Sai dấu ở bước cuối cùng.',
  lrnp:'Phải thực hiện trong ngoặc trước, và nhân, chia trước cộng, trừ.'
};
const hasFr=ts=>ts.some(t=>typeof t==='object'&&t.h.includes('class="fr"'));
function distractVals(ts,modes,good){
  const F=hasFr(ts)?VALS:VAL;const cs=[];modes.forEach(m=>{const v=evalToks(ts,m);if(v&&!eqQ(v,good))cs.push(C(F(v),ERR[m]));});
  const ng=[-good[0],good[1]];if(!eqQ(ng,good))cs.push(C(F(ng),ERR.neg));
  return cs;
}
const addOff=(cs,good,deltas,F)=>{F=F||VAL;deltas.forEach(d=>{const v=qa(good,[d,1]);cs.push(C(F(v),'Đã tính sai một bước trong dãy phép tính.'));});return cs;};
/* các mẫu biểu thức không ngoặc */
const TT_T=[
  ()=>{const a=ri(2,30),b=ri(2,9),c=ri(2,9);return chain([NI(a),NI(b),NI(c)],[sel(['+','−']),'·']);},
  ()=>{const c=ri(2,9),b=c*ri(2,9),a=ri(2,40);return chain([NI(a),NI(b),NI(c)],[sel(['+','−']),':']);},
  ()=>{const a=ri(2,9),b=ri(2,9),d=ri(2,9),c=d*ri(2,9);return chain([NI(a),NI(b),NI(c),NI(d)],['·',sel(['+','−']),':']);},
  ()=>{const a=ri(5,40),b=ri(2,5),c=ri(2,9),e=sel([2,3]);return [NI(a),sel(['+','−']),NI(b),SUP[e],'·',NI(c)];},
  ()=>{const a=ri(5,60),b=ri(2,6),e=sel([2,3]),c=sel([2,4,8].filter(x=>(Math.pow(b,e))%x===0)||[1]);return [NI(a),sel(['+','−']),NI(b),SUP[e],':',NI(c||1)];},
  ()=>{const x=rdec1(1,9),y=rdec1(1,9),b=ri(2,4),c=sel([2,3,5]);return [x,'−',NI(b),'²','+',y,':',NI(c)];},
  ()=>{const x=rdec1(1,9),y=rdec1(1,9),z=ri(2,9);return chain([x,y,NI(z)],[sel(['+','−']),'·']);},
  ()=>{const A=rfrac(),B=rfrac(),Cc=rfrac();return chain([A,B,Cc],['+','·']);},
  ()=>{const A=rfrac(),B=rfrac(),Cc=rfrac();return chain([A,B,Cc],[sel(['+','−']),':']);}
];
function genTtVal(){return tryGen(()=>{
  const ts=sel(TT_T)(),good=evalToks(ts);if(!okVal(good,3000)&&!(good&&good[1]<=60))return null;
  const cs=distractVals(ts,['lr','addfirst','pow2'],good);addOff(cs,good,[1,-1,2,10],hasFr(ts)?VALS:VAL);
  const F=hasFr(ts)?VALS:VAL;return mk(`Giá trị của biểu thức ${E(ts)} là:`,F(good),cs,`Thực hiện đúng thứ tự (luỹ thừa, nhân và chia, rồi cộng và trừ): ${E(ts)} = ${F(good)}.`);
});}
/* các mẫu có ngoặc */
const NN_T=[
  ()=>{const a=ri(2,15),b=ri(2,15),c=ri(2,9),d=ri(2,30);return ['(',NI(a),'+',NI(b),')','·',NI(c),'−',NI(d)];},
  ()=>{const a=ri(2,9),b=ri(8,20),c=ri(2,7),d=ri(2,9),e=ri(2,5);return [NI(a),'·','(',NI(b),'−',NI(c),')','+',NI(d*e),':',NI(e)];},
  ()=>{const c=ri(2,3),t=ri(1,5),e=ri(2,6),b=ri(2,6),k=ri(2,8),a=e*k-b*t;if(a<1)return ['(',NI(2),'+',NI(3),')','·',NI(4),'−',NI(5)];return ['[',NI(a),'+',NI(b),'·','(',NI(c*c+t),'−',NI(c),'²',')',']',':',NI(e)];},
  ()=>{const a=ri(20,60),b=ri(2,9),c=ri(2,9),d=ri(2,9),e=ri(2,5);return [NI(a),'−','[',NI(b),'+',NI(c),'·','(',NI(d),'−',NI(e),')',']'];},
  ()=>{const a=ri(2,9),b=ri(2,9),c=ri(2,9),d=ri(2,6);return ['(',NI(a),'+',NI(b),')','²','−',NI(c),'·',NI(d)];},
  ()=>{const b=ri(2,9),c=ri(2,9),k=ri(2,6),d=ri(2,12);return [NI((b+c)*k),':','(',NI(b),'+',NI(c),')','+',NI(d)];},
  ()=>{const x=rdec1(1,9),y=rdec1(1,9),z=ri(2,5),w=ri(2,9);return ['(',x,'+',y,')','·',NI(z),'−',NI(w)];},
  ()=>{const A=rfrac(),B=rfrac(),Cc=rfrac();return ['(',A,'+',B,')',':',...inPar(Cc)];},
  ()=>{const x=rdec1(2,9),y=ri(2,9),z=ri(2,9),k=ri(2,5);return [NI(y),'·','(',x,'−',NI(k),')','²','+',NI(z)];}
];
function genNnVal(){return tryGen(()=>{
  const ts=sel(NN_T)(),good=evalToks(ts);if(!good||!canDec(good[1])||Math.abs(vq(good))>3000)return null;
  const cs=distractVals(ts,['noparen','lr','addfirst','pow2'],good);addOff(cs,good,[1,-1,2,10],hasFr(ts)?VALS:VAL);
  const F=hasFr(ts)?VALS:VAL;return mk(`Giá trị của biểu thức ${E(ts)} là:`,F(good),cs,`Thực hiện trong ngoặc trước, rồi luỹ thừa, nhân chia, cộng trừ: ${E(ts)} = ${F(good)}.`);
});}
/* phép tính cần làm đầu tiên */
const FIRST_A=[
  ()=>{const a=ri(2,30),b=ri(2,9),c=ri(2,9);return {ts:[NI(a),'+',NI(b),'·',NI(c)],ok:`${b} · ${c}`,wr:[`${a} + ${b}`,`${a} + ${b} · ${c}`],why:'Nhân, chia làm trước cộng, trừ.'};},
  ()=>{const a=ri(2,30),b=ri(2,9),c=ri(2,9);return {ts:[NI(a),'−',NI(b),':',NI(c)],ok:`${b} : ${c}`,wr:[`${a} − ${b}`,`${a} − ${b} : ${c}`],why:'Nhân, chia làm trước cộng, trừ.'};},
  ()=>{const a=ri(10,60),b=ri(2,9),c=ri(2,9);return {ts:[NI(a),':',NI(b),'·',NI(c)],ok:`${a} : ${b}`,wr:[`${b} · ${c}`,`${a} · ${c}`],why:'Nhân và chia cùng bậc, làm từ trái sang phải.'};},
  ()=>{const a=ri(10,60),b=ri(2,9),c=ri(2,9);return {ts:[NI(a),'−',NI(b),'+',NI(c)],ok:`${a} − ${b}`,wr:[`${b} + ${c}`,`${a} + ${c}`],why:'Cộng và trừ cùng bậc, làm từ trái sang phải.'};},
  ()=>{const a=ri(2,9),b=ri(2,9),e=sel([2,3]);return {ts:[NI(a),'·',NI(b),SUP[e]],ok:`${b}${SUP[e]}`,wr:[`${a} · ${b}`,`${a} · ${b}${SUP[e]}`],why:'Luỹ thừa làm trước nhân, chia.'};}
];
const FIRST_B=[
  ()=>{const a=ri(2,15),b=ri(2,15),c=ri(2,9);return {ts:['(',NI(a),'+',NI(b),')','·',NI(c)],ok:`${a} + ${b}`,wr:[`${b} · ${c}`,`(${a} + ${b}) · ${c}`],why:'Thực hiện trong ngoặc trước.'};},
  ()=>{const a=ri(2,9),b=ri(8,20),c=ri(2,7),d=ri(2,30);return {ts:[NI(a),'·','(',NI(b),'−',NI(c),')','+',NI(d)],ok:`${b} − ${c}`,wr:[`${a} · ${b}`,`${a} · (${b} − ${c})`],why:'Thực hiện trong ngoặc trước.'};},
  ()=>{const a=ri(2,9),b=ri(2,9),c=ri(5,12),d=ri(2,4),e=ri(2,9);return {ts:['[',NI(a),'+',NI(b),'·','(',NI(c),'−',NI(d),')',']',':',NI(e)],ok:`${c} − ${d}`,wr:[`${b} · (${c} − ${d})`,`${a} + ${b}`],why:'Làm từ ngoặc trong cùng: ngoặc tròn trước ngoặc vuông.'};},
  ()=>{const a=ri(20,60),b=ri(2,9),c=ri(2,9),d=ri(2,5);return {ts:[NI(a),'−','(',NI(b),'+',NI(c),'·',NI(d),')'],ok:`${c} · ${d}`,wr:[`${b} + ${c}`,`${a} − ${b}`],why:'Trong ngoặc: nhân trước cộng.'};}
];
function genFirst(list){return tryGen(()=>{
  const f=sel(list)(),opts=[f.ok].concat(f.wr);
  const cs=f.wr.map(w=>C(w,'Đây không phải phép tính cần thực hiện đầu tiên theo thứ tự phép tính.'));
  const last=f.ts.filter(t=>typeof t==='object').map(t=>t.h);
  while(cs.length<3)cs.push(C(`${last[0]} + ${last[last.length-1]}`,'Đây không phải phép tính cần thực hiện đầu tiên.'));
  return mk(`Trong biểu thức ${E(f.ts)}, phép tính nào cần thực hiện đầu tiên?`,f.ok,cs,`${f.why} Phép tính cần thực hiện đầu tiên là ${f.ok}.`);
});}
const genTtFirst=()=>genFirst(FIRST_A);
const genNnFirst=()=>genFirst(FIRST_B);
/* ============ Đẳng thức, chuyển vế: phương trình dạng token có biến x ============ */
const X='x';
/* giá trị của x (tìm bằng thử hai giá trị, vì biểu thức tuyến tính) */
function evalX(ts,xv){const t2=ts.map(t=>t==='x'?NUM(xv,'x'):t);return evalToks(t2);}
function solveEq(L,R){const f=v=>{const l=evalX(L,v),r=evalX(R,v);return l&&r?qs(l,r):null;};const f0=f([0,1]),f1=f([1,1]);if(!f0||!f1)return null;const d=qs(f1,f0);if(d[0]===0)return null;return qd([-f0[0],f0[1]],d);}
const eqS=(L,R)=>`${show(L)} = ${show(R)}`;
const sub=(ts,xv)=>ts.map(t=>t==='x'?NUM(xv,SHD(xv)):t);
/* các dạng phương trình: trả về {L,R,sol,form,ctx} */
function randTerm(kind){return kind==='int'?NI(ri(2,30)):kind==='dec'?rdec1(1,20):rfrac();}
function eqForm(f,kind){
  const fl=t=>RNG()<.4?negT(t):t;
  const a=fl(randTerm(kind)),b=fl(randTerm(kind)),c=fl(randTerm(kind));
  if(f==='x+a')return {L:['x','+',...inPar(a)],R:[b],a,b,f};
  if(f==='x-a')return {L:['x','−',...inPar(a)],R:[b],a,b,f};
  if(f==='a+x')return {L:[...inPar(a),'+','x'],R:[b],a,b,f};
  if(f==='a-x')return {L:[...inPar(a),'−','x'],R:[b],a,b,f};
  if(f==='x-(a-b)')return {L:['x','−','(',a,'−',...inPar(b),')'],R:[c],a,b,c,f};
  if(f==='a-x=b-(c)')return {L:[...inPar(a),'−','x'],R:[b,'−',...inPar(c)],a,b,c,f};
  return null;
}
const FORMS=['x+a','x-a','a+x','a-x','x-(a-b)','a-x=b-(c)'];
const eqOK=(e)=>{if(!e)return false;const s=solveEq(e.L,e.R);return s&&canDec(s[1])&&s[1]<=100&&Math.abs(vq(s))<500&&Math.abs(vq(s))>0;};
const negT=t=>{const q=[-t.q[0],t.q[1]];return NUM(q,/,/.test(t.h)?SHD(q):SH(q));};
const tk=(p,o,q)=>[p,o,...inPar(q)];
function genCvStep(){return tryGen(()=>{
  const kind=sel(['int','dec','frac']),f=sel(['x+a','x-a','a+x']);const e=eqForm(f,kind);if(!e||!eqOK(e))return null;
  const a=e.a,b=e.b,sol=solveEq(e.L,e.R),minus=f==='x-a';
  const goodL=minus?tk(b,'+',a):tk(b,'−',a);
  const lists=[[minus?tk(b,'−',a):tk(b,'+',a),minus?'Chuyển −a sang vế phải phải đổi dấu thành +a.':'Chuyển +a sang vế phải phải đổi dấu thành −a.'],
    [tk(a,'−',b),'Sai vị trí các số hạng sau khi chuyển vế.'],
    [tk(negT(b),'−',a),'Chỉ đổi dấu số hạng được chuyển vế, không đổi dấu cả vế phải.'],
    [tk(negT(a),'−',b),'Đã đổi dấu sai số hạng.']];
  const cs=[];lists.forEach(([l,err])=>{const v=evalToks(l);if(v&&!eqQ(v,sol))cs.push(C(`x = ${show(l)}`,err));});
  return mk(`Từ đẳng thức ${eqS(e.L,e.R)}, chuyển vế ta được:`,`x = ${show(goodL)}`,cs,`Chuyển ${minus?'−':'+'}${show(inPar(a))} sang vế phải và đổi dấu: x = ${show(goodL)}.`);
});}
function genCvSolve(){return tryGen(()=>{
  const kind=sel(['int','dec','dec','frac']),f=sel(FORMS);const e=eqForm(f,kind);if(!eqOK(e))return null;
  const sol=solveEq(e.L,e.R),{a,b,c}=e;let wr;
  const V=q=>q&&canDec(q[1])?q:q;
  if(f==='x+a'||f==='a+x')wr=[[evalToks(tk(b,'+',a)),'Chuyển +a phải đổi dấu thành −a.'],[evalToks(tk(a,'−',b)),'Sai thứ tự: x = b − a, không phải a − b.'],[evalToks(tk(negT(b),'−',a)),'Chỉ đổi dấu số hạng được chuyển vế.']];
  else if(f==='x-a')wr=[[evalToks(tk(b,'−',a)),'Chuyển −a phải đổi dấu thành +a.'],[evalToks(tk(a,'−',b)),'Sai thứ tự các số hạng.'],[evalToks(tk(negT(b),'−',a)),'Chỉ đổi dấu số hạng được chuyển vế.']];
  else if(f==='a-x')wr=[[evalToks(tk(b,'−',a)),'Từ a − x = b ta có x = a − b, không phải b − a.'],[evalToks(tk(a,'+',b)),'Chuyển −x phải đổi dấu: a − b = x.'],[evalToks(tk(negT(a),'−',b)),'Đã đổi dấu sai số hạng.']];
  else if(f==='x-(a-b)')wr=[[evalToks([c,'−',...inPar(a),'−',...inPar(b)]),'Bỏ dấu ngoặc có dấu trừ đằng trước phải đổi dấu các số hạng trong ngoặc.'],[evalToks([c,'−',...inPar(a),'+',...inPar(b)]),'Chuyển −(a − b) sang vế phải: cộng (a − b), tức là cộng a rồi trừ b.'],[evalToks([...inPar(a),'−',b,'−',...inPar(c)]),'Sai quy tắc chuyển vế.']];
  else wr=[[evalToks([c,'−',b,...[]].slice(0,3)),'Sai dấu khi bỏ ngoặc hoặc chuyển vế.'],[evalToks([...inPar(a),'+',...inPar(b),'−',...inPar(c)]),'Sai dấu khi bỏ ngoặc hoặc chuyển vế.'],[evalToks([...inPar(a),'−',...inPar(b),'−',...inPar(c)]),'Sai dấu khi bỏ ngoặc hoặc chuyển vế.']];
  const cs=wr.filter(w=>w[0]&&!eqQ(w[0],sol)).map(w=>C('x = '+VAL(w[0]),w[1]));
  cs.push(C('x = '+VAL(qa(sol,[1,1])),'Tính sai ở bước cuối cùng.'),C('x = '+VAL([-sol[0],sol[1]]),'Sai dấu của kết quả.'));
  return mk(`Tìm x, biết: ${eqS(e.L,e.R)}`,'x = '+VAL(sol),cs,`Chuyển vế rồi tính: x = ${VAL(sol)}.`);
});}

/* ============ Đẳng thức: các bộ sinh còn lại ============ */
const eqChoice=()=>{const kind=sel(['int','dec','int']),f=sel(['x+a','x-a','a+x','a-x']);const e=eqForm(f,kind);return eqOK(e)?e:null;};
function genDtSide(){return tryGen(()=>{
  const e=eqChoice();if(!e)return null;const left=RNG()<.5,L=show(e.L),R=show(e.R);
  const good=left?L:R,wrong=left?R:L;
  const cs=[C(wrong,left?'Đây là vế phải, nằm bên phải dấu "=".':'Đây là vế trái, nằm bên trái dấu "=".'),C(`${L} + ${R}`,'Vế là biểu thức nằm một bên dấu "=", không phải tổng của hai vế.'),C(`${L} − ${R}`,'Vế là biểu thức nằm một bên dấu "=", không phải hiệu của hai vế.')];
  return mk(`Trong đẳng thức ${eqS(e.L,e.R)}, vế ${left?'trái':'phải'} là:`,good,cs,`Vế ${left?'trái':'phải'} là biểu thức ở bên ${left?'trái':'phải'} dấu "=": ${good}.`);
});}
function genDtProp(){return tryGen(()=>{
  const e=eqChoice();if(!e)return null;const c=sel([2,3,4,5,6,7,8,9,12,15]),L=show(e.L),R=show(e.R);
  const good=`${L} + ${c} = ${R} + ${c}`;
  const cs=[C(`${L} + ${c} = ${R}`,'Phải cộng cùng một số vào cả hai vế, không chỉ một vế.'),C(`${L} = ${R} + ${c}`,'Phải cộng cùng một số vào cả hai vế, không chỉ một vế.'),C(`${L} − ${c} = ${R} + ${c}`,'Hai vế phải cùng cộng c (hoặc cùng trừ c), không làm khác nhau.')];
  return mk(`Từ đẳng thức ${eqS(e.L,e.R)}, cộng ${c} vào cả hai vế ta được:`,good,cs,`Nếu a = b thì a + c = b + c, nên ${good}.`);
});}
function genDtTest(){return tryGen(()=>{
  const e=eqChoice();if(!e)return null;const sol=solveEq(e.L,e.R);if(!sol)return null;const L=show(e.L);
  const ds=[1,2,3,5].map(d=>RNG()<.5?d:-d);const k=VAL(sol);
  const w=d=>{const r=evalToks(e.R);const v=qa(r,[d,1]);return `${L} = ${VAL(v)}`;};
  const cs=ds.slice(0,3).map(d=>C(w(d),'Thay x vào hai vế không cho hai kết quả bằng nhau.'));
  return mk(`Với x = ${k}, đẳng thức nào sau đây đúng?`,eqS(e.L,e.R),cs,`Thay x = ${k}: vế trái bằng ${VAL(evalToks(e.R))}, bằng vế phải nên ${eqS(e.L,e.R)} đúng.`);
});}
function genCvSign(){return tryGen(()=>{
  const a=ri(2,30),neg=RNG()<.5,s=neg?'−':'+';
  const flipped=neg?`+${a}`:`−${a}`,same=neg?`−${a}`:`+${a}`;
  const cs=[C(same,'Khi chuyển vế phải đổi dấu số hạng.'),C(`${neg?'−':'+'}${fr(1,a)}`,'Chuyển vế chỉ đổi dấu, không lấy số nghịch đảo.'),C(`${neg?'+':'−'}${2*a}`,'Chuyển vế chỉ đổi dấu, không đổi giá trị.')];
  return mk(`Khi chuyển số hạng ${s}${a} từ vế trái sang vế phải của một đẳng thức, số hạng đó trở thành:`,flipped,cs,`Chuyển vế phải đổi dấu: ${s}${a} thành ${flipped}.`);
});}
/* ============ Ngân hàng nhiều lựa chọn (câu cố định) ============ */
const O=(t,err)=>err?{t,err}:{t};
const MC=[
 {id:'m1',topic:'tt',level:'NB',stem:'Biểu thức không có dấu ngoặc chỉ có phép cộng và phép trừ (hoặc chỉ có phép nhân và phép chia) thì ta thực hiện các phép tính theo thứ tự:',ans:0,opts:[O('từ trái sang phải'),O('từ phải sang trái','Các phép tính cùng bậc được thực hiện từ trái sang phải.'),O('phép cộng trước, phép trừ sau','Cộng và trừ cùng bậc nên làm từ trái sang phải.'),O('tuỳ ý, không cần theo thứ tự','Thứ tự thực hiện phép tính ảnh hưởng đến kết quả.')],exp:'Với biểu thức chỉ có cộng và trừ, hoặc chỉ có nhân và chia, ta thực hiện từ trái sang phải.'},
 {id:'m2',topic:'tt',level:'NB',stem:'Với biểu thức không có dấu ngoặc, thứ tự thực hiện các phép tính là:',ans:0,opts:[O('luỹ thừa, rồi nhân và chia, rồi cộng và trừ'),O('cộng và trừ, rồi nhân và chia, rồi luỹ thừa','Đây là thứ tự ngược lại.'),O('nhân và chia, rồi luỹ thừa, rồi cộng và trừ','Luỹ thừa phải làm trước nhân và chia.'),O('luỹ thừa, rồi cộng và trừ, rồi nhân và chia','Nhân và chia phải làm trước cộng và trừ.')],exp:'Thứ tự: luỹ thừa → nhân và chia → cộng và trừ.'},
 {id:'m3',topic:'tt',level:'NB',stem:'Thứ tự thực hiện các phép tính đối với số tự nhiên khi áp dụng cho các số hữu tỉ:',ans:0,opts:[O('vẫn đúng'),O('không còn đúng','Thứ tự thực hiện phép tính đối với số tự nhiên vẫn đúng với số hữu tỉ.'),O('chỉ đúng với số nguyên','Thứ tự này vẫn đúng với mọi số hữu tỉ.'),O('chỉ đúng với số thập phân','Thứ tự này vẫn đúng với cả phân số và số thập phân.')],exp:'Thứ tự thực hiện phép tính đối với số tự nhiên vẫn đúng đối với số hữu tỉ.'},
 {id:'m4',topic:'tt',level:'TH',stem:'Giá trị của biểu thức 10 + 36 : 2 · 3 là:',ans:0,opts:[O('64'),O('69','Chia 36 cho 2 rồi nhân với 3 phải làm trước khi cộng 10.'),O('16','36 : 2 · 3 làm từ trái sang phải: 36 : 2 = 18 rồi 18 · 3 = 54, không phải 36 : 6.'),O('54','Đã bỏ quên phép cộng với 10.')],exp:'36 : 2 = 18; 18 · 3 = 54; 10 + 54 = 64.'},
 {id:'m5',topic:'tt',level:'TH',stem:'Giá trị của biểu thức 1,2 − 3² + 7,5 : 3 là:',ans:0,opts:[O('−5,3'),O('3,58','Luỹ thừa và chia phải làm trước cộng, trừ.'),O('−0,3','Đã bỏ quên phép chia 7,5 : 3.'),O('−7,8','Đã bỏ quên phép cộng với 7,5 : 3 = 2,5.')],exp:'3² = 9 và 7,5 : 3 = 2,5. Do đó 1,2 − 9 + 2,5 = −5,3.'},
 {id:'m6',topic:'nn',level:'NB',stem:'Với biểu thức có dấu ngoặc, ta thực hiện:',ans:0,opts:[O('trong ngoặc trước, ngoài ngoặc sau'),O('ngoài ngoặc trước, trong ngoặc sau','Phải thực hiện trong ngoặc trước.'),O('từ trái sang phải, bỏ qua ngoặc','Dấu ngoặc cho biết phải làm các phép tính trong ngoặc trước.'),O('nhân, chia trước, cộng, trừ sau, bỏ qua ngoặc','Dấu ngoặc làm thay đổi thứ tự thực hiện phép tính.')],exp:'Với biểu thức có dấu ngoặc, ta thực hiện trong ngoặc trước, ngoài ngoặc sau.'},
 {id:'m7',topic:'nn',level:'NB',stem:'Thứ tự thực hiện các loại dấu ngoặc là:',ans:0,opts:[O('( ), rồi [ ], rồi { }'),O('{ }, rồi [ ], rồi ( )','Phải làm ngoặc tròn ( ) (ngoặc trong cùng) trước.'),O('[ ], rồi ( ), rồi { }','Phải làm ngoặc tròn ( ) trước ngoặc vuông [ ].'),O('( ), rồi { }, rồi [ ]','Ngoặc vuông [ ] phải làm trước ngoặc nhọn { }.')],exp:'Thứ tự thực hiện: ngoặc tròn ( ) → ngoặc vuông [ ] → ngoặc nhọn { }.'},
 {id:'m8',topic:'nn',level:'TH',stem:'Giá trị của biểu thức 5 + 2 · (9 − 2³) là:',ans:0,opts:[O('7'),O('15','Phải làm trong ngoặc (9 − 2³) trước khi nhân.'),O('11','2³ = 8, không phải 6.'),O('2','Đã bỏ quên số hạng 5.')],exp:'2³ = 8; 9 − 8 = 1; 2 · 1 = 2; 5 + 2 = 7.'},
 {id:'m9',topic:'nn',level:'VD',stem:'Giá trị của biểu thức [5 + 2 · (9 − 2³)] : 7 là:',ans:0,opts:[O('1'),O('7','Đã bỏ quên phép chia cho 7.'),O('0','5 + 2 · 1 = 7 chia 7 bằng 1, không phải 0.'),O('4','Sai thứ tự phép tính trong ngoặc.')],exp:'Trong ngoặc tròn: 9 − 2³ = 1; 2 · 1 = 2; 5 + 2 = 7; cuối cùng 7 : 7 = 1.'},
 {id:'m10',topic:'dt',level:'NB',stem:'Hệ thức A = B được gọi là:',ans:0,opts:[O('một đẳng thức'),O('một bất đẳng thức','Bất đẳng thức dùng các dấu <, >.'),O('một phân số','Đây là hệ thức hai biểu thức bằng nhau.'),O('một luỹ thừa','Luỹ thừa có dạng aⁿ.')],exp:'Hệ thức A = B được gọi là một đẳng thức.'},
 {id:'m11',topic:'dt',level:'NB',stem:'Trong đẳng thức A = B, A được gọi là:',ans:0,opts:[O('vế trái'),O('vế phải','Vế phải là biểu thức B ở bên phải dấu "=".'),O('số hạng','Vế là cả biểu thức ở một bên dấu "=".'),O('thừa số','Vế là cả biểu thức ở một bên dấu "=".')],exp:'Trong đẳng thức A = B, A là vế trái và B là vế phải.'},
 {id:'m12',topic:'dt',level:'NB',stem:'Nếu a = b thì:',ans:0,opts:[O('b = a'),O('a + c = b','Phải cộng c vào cả hai vế.'),O('a = b + c','Phải cộng c vào cả hai vế.'),O('a − b = 1','Nếu a = b thì a − b = 0.')],exp:'Nếu a = b thì b = a và a + c = b + c.'},
 {id:'m13',topic:'dt',level:'TH',stem:'Nếu a = b thì khẳng định nào sau đây luôn đúng?',ans:0,opts:[O('a + c = b + c'),O('a + c = b − c','Hai vế phải cùng cộng c.'),O('a − c = b + c','Hai vế phải cùng cộng hoặc cùng trừ một số.'),O('a = b + c','Cộng c vào cả hai vế mới được đẳng thức mới.')],exp:'Cộng cùng một số c vào cả hai vế của đẳng thức a = b ta được a + c = b + c.'},
 {id:'m14',topic:'cv',level:'NB',stem:'Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải:',ans:0,opts:[O('đổi dấu số hạng đó'),O('giữ nguyên dấu số hạng đó','Chuyển vế phải đổi dấu: "+" thành "−" và "−" thành "+".'),O('nhân số hạng đó với 2','Chuyển vế không thay đổi giá trị của số hạng, chỉ đổi dấu.'),O('chia số hạng đó cho 2','Chuyển vế không thay đổi giá trị của số hạng, chỉ đổi dấu.')],exp:'Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải đổi dấu số hạng đó.'},
 {id:'m15',topic:'cv',level:'NB',stem:'Nếu a + b = c thì:',ans:0,opts:[O('a = c − b'),O('a = c + b','Chuyển +b sang vế phải phải đổi dấu thành −b.'),O('a = b − c','Sai thứ tự: a = c − b.'),O('a = −c − b','Chỉ đổi dấu số hạng được chuyển vế, không đổi dấu vế phải.')],exp:'Chuyển b sang vế phải và đổi dấu: a = c − b.'},
 {id:'m16',topic:'cv',level:'NB',stem:'Nếu a − b = c thì:',ans:0,opts:[O('a = c + b'),O('a = c − b','Chuyển −b sang vế phải phải đổi dấu thành +b.'),O('a = b − c','Sai thứ tự và sai dấu.'),O('a = −c + b','Chỉ đổi dấu số hạng được chuyển vế, không đổi dấu vế phải.')],exp:'Chuyển −b sang vế phải và đổi dấu thành +b: a = c + b.'},
 {id:'m17',topic:'cv',level:'TH',stem:'Từ đẳng thức x − 0,5 = 2, theo quy tắc chuyển vế ta được:',ans:0,opts:[O('x = 2 + 0,5'),O('x = 2 − 0,5','Chuyển −0,5 sang vế phải phải đổi dấu thành +0,5.'),O('x = 0,5 − 2','Sai thứ tự và sai dấu.'),O('x = −2 − 0,5','Chỉ đổi dấu số hạng được chuyển vế, không đổi dấu vế phải.')],exp:'Chuyển −0,5 sang vế phải và đổi dấu: x = 2 + 0,5 = 2,5.'},
 {id:'m18',topic:'nn',level:'VD',stem:'Giá trị của biểu thức 100 : {2 + [3 · (5 − 2²)]} là:',ans:0,opts:[O('20'),O('53','Phải thực hiện trong ngoặc trước, rồi mới chia 100.'),O('25','Tính sai trong ngoặc: 5 − 2² = 1, 3 · 1 = 3, 2 + 3 = 5.'),O('5','Đã bỏ quên phép chia 100 cho kết quả trong ngoặc.')],exp:'Ngoặc tròn: 2² = 4; 5 − 4 = 1. Ngoặc vuông: 3 · 1 = 3. Ngoặc nhọn: 2 + 3 = 5. Cuối cùng 100 : 5 = 20.'},
 {id:'m19',topic:'tt',level:'VD',stem:'Giá trị của biểu thức 2³ + 3² · 2 − 20 : 5 là:',ans:0,opts:[O('22'),O('6','Đã bỏ quên phép chia 20 : 5 = 4 (phép trừ phải trừ đi 4, không phải 20).'),O('26','Đã bỏ quên phép trừ 20 : 5.'),O('20','2³ = 8, không phải 6.')],exp:'2³ = 8; 3² · 2 = 18; 20 : 5 = 4. Do đó 8 + 18 − 4 = 22.'},
 {id:'m20',topic:'cv',level:'VD',stem:'Nếu x − (a − b) = c thì:',ans:0,opts:[O('x = c + a − b'),O('x = c − a + b','Chuyển −(a − b) sang vế phải: cộng (a − b), tức là cộng a và trừ b.'),O('x = c + a + b','Cộng (a − b) là cộng a rồi trừ b, không phải cộng b.'),O('x = c − a − b','Chuyển −(a − b) sang vế phải phải đổi dấu thành +(a − b).')],exp:'Chuyển −(a − b) sang vế phải và đổi dấu: x = c + (a − b) = c + a − b.'},
 {id:'m21',topic:'cv',level:'VD',stem:'Từ đẳng thức a − x = b, ta suy ra:',ans:0,opts:[O('x = a − b'),O('x = b − a','Chuyển −x sang vế phải và b sang vế trái: a − b = x.'),O('x = a + b','Chuyển vế phải đổi dấu: x = a − b.'),O('x = −a − b','Chỉ đổi dấu số hạng được chuyển vế.')],exp:'Chuyển x sang vế phải và b sang vế trái: a − b = x, tức là x = a − b.'},
 {id:'m22',topic:'dt',level:'TH',stem:'Từ đẳng thức x + 5 = 12, cộng −5 vào cả hai vế ta được:',ans:0,opts:[O('x = 7'),O('x = 17','Cộng −5 (không phải 5) vào cả hai vế: 12 + (−5) = 7.'),O('x = −7','5 + (−5) = 0 ở vế trái, vế phải là 12 + (−5) = 7.'),O('x = 5 − 12','Vế phải là 12 + (−5), không phải 5 − 12.')],exp:'x + 5 + (−5) = 12 + (−5), nên x = 7.'}
];
MC.forEach(q=>q.type='mc');
const addMC=(id,topic,level,gen)=>['a','b'].forEach(x=>MC.push({id:id+'_'+x,type:'mc',topic,level,gen}));
addMC('g_ttval','tt','TH',genTtVal);addMC('g_ttfirst','tt','NB',genTtFirst);
addMC('g_nnval','nn','TH',genNnVal);addMC('g_nnfirst','nn','TH',genNnFirst);
addMC('g_dtside','dt','NB',genDtSide);addMC('g_dtprop','dt','TH',genDtProp);addMC('g_dttest','dt','TH',genDtTest);
addMC('g_cvstep','cv','TH',genCvStep);addMC('g_cvsolve','cv','VD',genCvSolve);addMC('g_cvsign','cv','NB',genCvSign);

/* ============ Bộ sinh đúng sai ============ */
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
function pick4(Ts,Fs){const nT=ri(1,3);return shuffle(shuffle(Ts).slice(0,nT).concat(shuffle(Fs).slice(0,4-nT)));}
function mixed(make){for(let n=0;n<80;n++){const items=make();if(items.some(i=>!i))continue;const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}return null;}
const FB_TF=()=>({fb:true,stem:'Xét các phát biểu sau:',items:[
  IT('Giá trị của biểu thức 2 + 3 · 4 bằng 14',true,'tt','TH','Nhân trước, cộng sau: 2 + 12 = 14.'),
  IT('Giá trị của biểu thức 2 + 3 · 4 bằng 20',false,'tt','TH','Phải nhân trước: 2 + 3 · 4 = 14.'),
  IT('Nếu a = b thì b = a',true,'dt','NB','Đây là tính chất của đẳng thức.'),
  IT('Từ x + 3 = 8 suy ra x = 8 + 3',false,'cv','TH','Chuyển +3 sang vế phải phải đổi dấu: x = 8 − 3.')]});
const four=f=>()=>{const items=mixed(()=>[f(),f(),f(),f()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};
const wrongNear=(good)=>{const d=sel([1,-1,2,-2,5,-5,10]);return qa(good,[d,1]);};
function valItem(ts,tp,lv){
  const good=evalToks(ts);if(!good||!canDec(good[1])||Math.abs(vq(good))>3000)return null;
  const ok=RNG()<.5;let shown=good;
  if(!ok){const alts=['lr','addfirst','pow2','noparen'].map(m=>evalToks(ts,m)).filter(v=>v&&!eqQ(v,good)&&canDec(v[1]));shown=alts.length&&RNG()<.6?sel(alts):wrongNear(good);}
  return IT(`Giá trị của biểu thức ${E(ts)} bằng ${VAL(shown)}`,ok,tp,lv,`${E(ts)} = ${VAL(good)}${ok?'.':`, không phải ${VAL(shown)}.`}`);
}
const FIX_TT=[
 ['Biểu thức chỉ có phép cộng và phép trừ được thực hiện từ trái sang phải',true,'Các phép tính cùng bậc làm từ trái sang phải.'],
 ['Biểu thức chỉ có phép nhân và phép chia được thực hiện từ phải sang trái',false,'Các phép tính cùng bậc làm từ trái sang phải.'],
 ['Trong biểu thức không có dấu ngoặc, luỹ thừa được thực hiện trước phép nhân và phép chia',true,'Thứ tự: luỹ thừa, nhân và chia, cộng và trừ.'],
 ['Trong biểu thức không có dấu ngoặc, phép cộng được thực hiện trước phép nhân',false,'Nhân và chia làm trước cộng và trừ.'],
 ['Thứ tự thực hiện phép tính đối với số tự nhiên vẫn đúng đối với số hữu tỉ',true,'Thứ tự này đúng với mọi số hữu tỉ.'],
 ['Thứ tự thực hiện phép tính đối với số hữu tỉ khác với số tự nhiên',false,'Thứ tự thực hiện phép tính vẫn như đối với số tự nhiên.']
];
const FIX_NN=[
 ['Biểu thức có dấu ngoặc thì thực hiện trong ngoặc trước, ngoài ngoặc sau',true,'Đây là quy tắc đối với biểu thức có dấu ngoặc.'],
 ['Biểu thức có dấu ngoặc thì thực hiện ngoài ngoặc trước, trong ngoặc sau',false,'Phải thực hiện trong ngoặc trước.'],
 ['Phép tính trong ngoặc vuông được thực hiện trước phép tính trong ngoặc tròn',false,'Thứ tự là ngoặc tròn, rồi ngoặc vuông, rồi ngoặc nhọn.'],
 ['Phép tính trong ngoặc tròn được thực hiện trước phép tính trong ngoặc vuông',true,'Thứ tự là ngoặc tròn, rồi ngoặc vuông, rồi ngoặc nhọn.']
];
function ttItem(lv){
  if(RNG()<.3){const f=sel(FIX_TT);return IT(f[0],f[1],'tt','TH',f[2]);}
  return valItem(sel(TT_T)(),'tt','TH');
}
function nnItem(lv){
  if(RNG()<.25){const f=sel(FIX_NN);return IT(f[0],f[1],'nn','TH',f[2]);}
  return valItem(sel(NN_T)(),'nn',lv==='VD'?'VD':'TH');
}
function dtItem(lv){
  const t=ri(0,4);
  if(t<=1){const e=eqChoice();if(!e)return null;const sol=solveEq(e.L,e.R),ok=RNG()<.5,shown=ok?sol:wrongNear(sol);return IT(`Với x = ${VAL(shown)} thì ${eqS(e.L,e.R)}`,ok,'dt','TH',`Thay x = ${VAL(sol)} thì hai vế bằng nhau (cùng bằng ${VAL(evalToks(e.R))})${ok?'.':`; x = ${VAL(shown)} thì không.`}`);}
  if(t===2){const e=eqChoice();if(!e)return null;const left=RNG()<.5,ok=RNG()<.5,L=show(e.L),R=show(e.R),pickside=ok?(left?L:R):(left?R:L);return IT(`Trong đẳng thức ${eqS(e.L,e.R)}, vế ${left?'trái':'phải'} là ${pickside}`,ok,'dt','TH',`Vế ${left?'trái':'phải'} là ${left?L:R}.`);}
  const f=sel([['Nếu a = b thì b = a',true,'Tính chất của đẳng thức.'],['Nếu a = b thì a + c = b + c',true,'Cộng cùng một số vào cả hai vế.'],['Nếu a = b thì a + c = b',false,'Phải cộng c vào cả hai vế.'],['Nếu a = b thì a = b + c',false,'Phải cộng c vào cả hai vế.']]);
  return IT(f[0],f[1],'dt','TH',f[2]);
}
function cvItem(lv){
  const t=ri(0,4);
  if(t<=2){const kind=sel(['int','dec','frac']),f=sel(['x+a','x-a','a+x']),e=eqForm(f,kind);if(!eqOK(e))return null;const a=e.a,b=e.b,minus=f==='x-a',ok=RNG()<.5;const goodL=minus?tk(b,'+',a):tk(b,'−',a),badL=minus?tk(b,'−',a):tk(b,'+',a);const sol=solveEq(e.L,e.R);if(eqQ(evalToks(badL),sol))return null;const shown=ok?goodL:badL;return IT(`Từ ${eqS(e.L,e.R)} suy ra x = ${show(shown)}`,ok,'cv','TH',`Chuyển vế đổi dấu: x = ${show(goodL)}${ok?'.':`, không phải x = ${show(badL)}.`}`);}
  if(t===3){const f=sel([['Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải đổi dấu số hạng đó',true,'Đây là quy tắc chuyển vế.'],['Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta giữ nguyên dấu số hạng đó',false,'Phải đổi dấu số hạng được chuyển vế.'],['Nếu a + b = c thì a = c − b',true,'Chuyển b sang vế phải và đổi dấu.'],['Nếu a − b = c thì a = c − b',false,'Chuyển −b sang vế phải thành +b: a = c + b.']]);return IT(f[0],f[1],'cv','TH',f[2]);}
  const kind=sel(['int','dec']),e=eqForm(sel(['a-x','x-(a-b)']),kind);if(!eqOK(e))return null;const sol=solveEq(e.L,e.R),ok=RNG()<.5,shown=ok?sol:wrongNear(sol);return IT(`Nghiệm của ${eqS(e.L,e.R)} là x = ${VAL(shown)}`,ok,'cv','VD',`Nghiệm của phương trình là x = ${VAL(sol)}${ok?'.':`, không phải ${VAL(shown)}.`}`);
}
const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
['a','b'].forEach(x=>{addTF('tf_tt_th_'+x,'tt','TH',four(()=>ttItem('TH')));addTF('tf_nn_th_'+x,'nn','TH',four(()=>nnItem('TH')));addTF('tf_dt_th_'+x,'dt','TH',four(()=>dtItem('TH')));addTF('tf_cv_th_'+x,'cv','TH',four(()=>cvItem('TH')));});
addTF('tf_tt_vd','tt','VD',four(()=>ttItem('VD')));addTF('tf_nn_vd','nn','VD',four(()=>nnItem('VD')));addTF('tf_dt_vd','dt','VD',four(()=>dtItem('VD')));addTF('tf_cv_vd','cv','VD',four(()=>cvItem('VD')));
addTF('tf_mix_a','nn','TH',four(()=>[ttItem,nnItem,dtItem,cvItem][ri(0,3)]('TH')));
addTF('tf_mix_b','cv','VD',four(()=>[ttItem,nnItem,dtItem,cvItem][ri(0,3)]('VD')));
const PT=[
 IT('Biểu thức chỉ có phép cộng và phép trừ thì thực hiện từ trái sang phải',true,'tt','NB','Các phép tính cùng bậc làm từ trái sang phải.'),
 IT('Luỹ thừa được thực hiện trước phép nhân và phép chia',true,'tt','NB','Thứ tự: luỹ thừa, nhân và chia, cộng và trừ.'),
 IT('Nhân và chia được thực hiện trước cộng và trừ',true,'tt','NB','Nhân, chia làm trước cộng, trừ.'),
 IT('2 + 3 · 4 = 14',true,'tt','NB','Nhân trước: 3 · 4 = 12 rồi 2 + 12 = 14.'),
 IT('Biểu thức có dấu ngoặc thì thực hiện trong ngoặc trước',true,'nn','NB','Quy tắc đối với biểu thức có ngoặc.'),
 IT('Thứ tự thực hiện các dấu ngoặc là ( ), rồi [ ], rồi { }',true,'nn','NB','Làm từ ngoặc trong cùng ra ngoài.'),
 IT('(2 + 3) · 4 = 20',true,'nn','NB','Làm trong ngoặc trước: 5 · 4 = 20.'),
 IT('[5 + 2 · (9 − 2³)] : 7 = 1',true,'nn','NB','2³ = 8; 9 − 8 = 1; 2 · 1 = 2; 5 + 2 = 7; 7 : 7 = 1.'),
 IT('Hệ thức A = B được gọi là một đẳng thức',true,'dt','NB','Đây là định nghĩa đẳng thức.'),
 IT('Trong đẳng thức A = B, A là vế trái',true,'dt','NB','A ở bên trái dấu "=".'),
 IT('Nếu a = b thì b = a',true,'dt','NB','Tính chất của đẳng thức.'),
 IT('Nếu a = b thì a + c = b + c',true,'dt','NB','Cộng cùng một số vào cả hai vế.'),
 IT('Khi chuyển một số hạng từ vế này sang vế kia, ta phải đổi dấu số hạng đó',true,'cv','NB','Đây là quy tắc chuyển vế.'),
 IT('Nếu a + b = c thì a = c − b',true,'cv','NB','Chuyển b sang vế phải và đổi dấu.'),
 IT('Nếu a − b = c thì a = c + b',true,'cv','NB','Chuyển −b sang vế phải thành +b.'),
 IT('Từ x + 3 = 8 suy ra x = 8 − 3',true,'cv','NB','Chuyển +3 sang vế phải thành −3.')
];
const PF=[
 IT('Biểu thức chỉ có phép cộng và phép trừ thì thực hiện từ phải sang trái',false,'tt','NB','Các phép tính cùng bậc làm từ trái sang phải.'),
 IT('Phép cộng được thực hiện trước phép nhân',false,'tt','NB','Nhân, chia làm trước cộng, trừ.'),
 IT('Luỹ thừa được thực hiện sau phép cộng',false,'tt','NB','Luỹ thừa làm trước hết.'),
 IT('2 + 3 · 4 = 20',false,'tt','NB','Phải nhân trước: 2 + 12 = 14.'),
 IT('Biểu thức có dấu ngoặc thì thực hiện ngoài ngoặc trước',false,'nn','NB','Phải làm trong ngoặc trước.'),
 IT('Thứ tự thực hiện các dấu ngoặc là { }, rồi [ ], rồi ( )',false,'nn','NB','Phải làm ngoặc tròn ( ) trước.'),
 IT('(2 + 3) · 4 = 14',false,'nn','NB','Làm trong ngoặc trước: 5 · 4 = 20.'),
 IT('[5 + 2 · (9 − 2³)] : 7 = 7',false,'nn','NB','Còn phải chia cho 7: 7 : 7 = 1.'),
 IT('Hệ thức A = B được gọi là một bất đẳng thức',false,'dt','NB','A = B là một đẳng thức.'),
 IT('Trong đẳng thức A = B, A là vế phải',false,'dt','NB','A là vế trái.'),
 IT('Nếu a = b thì a + c = b',false,'dt','NB','Phải cộng c vào cả hai vế.'),
 IT('Nếu a = b thì a = b + c',false,'dt','NB','Phải cộng c vào cả hai vế.'),
 IT('Khi chuyển một số hạng từ vế này sang vế kia, ta giữ nguyên dấu số hạng đó',false,'cv','NB','Phải đổi dấu số hạng được chuyển vế.'),
 IT('Nếu a + b = c thì a = c + b',false,'cv','NB','Chuyển +b sang vế phải thành −b: a = c − b.'),
 IT('Nếu a − b = c thì a = c − b',false,'cv','NB','Chuyển −b sang vế phải thành +b: a = c + b.'),
 IT('Từ x + 3 = 8 suy ra x = 8 + 3',false,'cv','NB','Chuyển +3 sang vế phải thành −3: x = 8 − 3.')
];
const tfNB=t=>()=>({stem:'Xét các phát biểu sau:',items:pick4(PT.filter(i=>i.topic===t),PF.filter(i=>i.topic===t))});
TKEYS.forEach(t=>addTF('tf_nb_'+t,t,'NB',tfNB(t)));

/* ============ Bộ sinh trả lời ngắn ============ */
function saExpr(list,idxs,id){
  for(let n=0;n<400;n++){
    const ts=list[sel(idxs)](),v=evalToks(ts);if(!v||!canDec(v[1])||Math.abs(vq(v))>2000)continue;
    const bad=['lr','addfirst','noparen'].some(m=>{const w=evalToks(ts,m);return w&&!eqQ(w,v);});if(!bad&&n<300)continue;
    return {stem:`Tính giá trị của biểu thức ${E(ts)}.`,ans:[vq(v)],at:v[1]===1?undefined:DEC(v),exp:`Thực hiện đúng thứ tự phép tính: ${E(ts)} = ${VAL(v)}.`};
  }
  return {stem:'Tính giá trị của biểu thức 2 + 3 · 4.',ans:[14],exp:'3 · 4 = 12; 2 + 12 = 14.'};
}
const saTtNb=()=>saExpr(TT_T,[0,1,2]);
const saTtVal=()=>saExpr(TT_T,[3,4,5,6]);
const saNnVal=()=>saExpr(NN_T,[0,1,4,5,6]);
const saNnBig=()=>saExpr(NN_T,[2,3,8]);
function eqSA(forms,kinds,stemF){
  for(let n=0;n<400;n++){const e=eqForm(sel(forms),sel(kinds));if(!eqOK(e))continue;const sol=solveEq(e.L,e.R);
    return {stem:stemF(e),ans:[vq(sol)],at:sol[1]===1?undefined:DEC(sol),exp:`Chuyển vế và tính: x = ${VAL(sol)}.`};}
}
const saDtFind=()=>eqSA(['x+a','x-a','a+x'],['int','dec'],e=>`Tìm x, biết: ${eqS(e.L,e.R)} (cộng cùng một số vào cả hai vế).`);
const saCvx=()=>eqSA(['x+a','x-a','a-x','a+x'],['int','dec','dec'],e=>`Tìm x, biết: ${eqS(e.L,e.R)}`);
const saCvVd=()=>eqSA(['x-(a-b)','a-x=b-(c)'],['int','dec'],e=>`Tìm x, biết: ${eqS(e.L,e.R)}`);
function saDtEx(){for(let n=0;n<400;n++){
  const e=eqForm(sel(['x+a','x-a']),sel(['int','dec']));if(!eqOK(e))continue;const sol=solveEq(e.L,e.R),c=sel([1,2,3,4,5,6,8,10]),pl=RNG()<.5,tsx=['x',pl?'+':'−',NI(c)];
  const v=evalX(tsx,sol);if(!v||!canDec(v[1]))continue;
  return {stem:`Biết ${eqS(e.L,e.R)}. Tính ${show(tsx)}.`,ans:[vq(v)],at:v[1]===1?undefined:DEC(v),exp:`Chuyển vế: x = ${VAL(sol)}. Do đó ${show(tsx)} = ${VAL(v)}.`};}}
function saCvTt(){const A=ri(150,450)/100,B=ri(50,Math.floor(A*100)-10)/100;const a=Rq(Math.round(A*100),100),b=Rq(Math.round(B*100),100),d=qs(a,b);
  return {stem:`Để làm một cái bánh cần ${VAL(a)} cốc bột. Lan đã có ${VAL(b)} cốc bột. Hỏi Lan cần thêm bao nhiêu cốc bột nữa để vừa đủ làm một cái bánh?`,ans:[vq(d)],at:d[1]===1?undefined:DEC(d),exp:`Số cốc bột cần thêm là ${VAL(a)} − ${VAL(b)} = ${VAL(d)} (cốc).`};}
/* ============ Bổ sung theo các dạng trong tài liệu dạy thêm của giáo viên ============
   thứ tự phép tính với phân số và luỹ thừa, ngoặc lồng nhau, tìm x có hệ số, x ở cả hai vế, thu gọn x, có dấu ngoặc, nhiều bước */
const bNeg=q=>[-q[0],q[1]],bPA=(q,h)=>q[0]<0?`(${h})`:h,bS=q=>bPA(q,SH(q)),bSup=n=>`<sup>${n}</sup>`;
const bFr=()=>{for(;;){const d=ri(2,6),q=Rq(ri(1,2*d-1)*sgn(),d);if(q[1]>1)return q;}};       // phân số không nguyên
const bPos=()=>{for(;;){const q=bFr();if(q[0]>0)return q;}};
const bNum=()=>RNG()<.35?[sgn()*ri(1,6),1]:bFr();
const bPw=(q,n)=>{let r=[1,1];for(let i=0;i<n;i++)r=qm(r,q);return r;};
const bOk=(g,d,n)=>g&&g[1]<=(d||60)&&Math.abs(g[0])<=(n||300);
const bW=(good,q,err)=>(!q||q[1]===0||eqQ(Rq(q[0],q[1]),good))?null:C(SH(Rq(q[0],q[1])),err);
const bSA=(stem,g,exp)=>({stem:stem+' Nhập kết quả dạng phân số tối giản hoặc số nguyên.',ans:[g[0]/g[1]],at:SH(g),exp});
const bT=(q,first)=>first?SH(q):(q[0]<0?`− ${SH(bNeg(q))}`:`+ ${SH(q)}`);                       // số hạng có dấu trong một tổng
const bX=(c,first)=>{const a=Math.abs(c[0]),h=(c[1]===1?(a===1?'':String(a)):SH([a,c[1]]))+'x';return first?(c[0]<0?'−'+h:h):(c[0]<0?`− ${h}`:`+ ${h}`);};   // số hạng chứa x
const bMk=(d,verb)=>{const X=verb.startsWith('Tìm');return mk(`${verb} ${d.h}${X?'':' là:'}`,(X?'x = ':'')+SH(d.good),X?d.wr.map(w=>w&&C('x = '+w.t,w.err)):d.wr,d.exp);};
/* --- không ngoặc, có phân số --- */
function ttFrData(){
  for(;;){const A=bFr(),B=bFr(),Cc=bFr(),pm=sel(['+','−']),md=sel(['·',':']),t=md==='·'?qm(B,Cc):qd(B,Cc),good=pm==='+'?qa(A,t):qs(A,t);
    if(!bOk(good,48,200)||!bOk(t,48,200))continue;
    const ab=pm==='+'?qa(A,B):qs(A,B),t2=md==='·'?qd(B,Cc):qm(B,Cc);
    return {good,h:`${SH(A)} ${pm} ${bS(B)} ${md} ${bS(Cc)}`,exp:`Nhân, chia trước: ${SH(B)} ${md} ${bS(Cc)} = ${SH(t)}. Sau đó ${SH(A)} ${pm} ${bS(t)} = ${SH(good)}.`,
      wr:[bW(good,md==='·'?qm(ab,Cc):qd(ab,Cc),'Phải thực hiện nhân, chia trước cộng, trừ. Bạn đã tính từ trái sang phải.'),
        bW(good,pm==='+'?qa(A,t2):qs(A,t2),md==='·'?'Bạn đã chia thay vì nhân.':'Chia cho một phân số là nhân với nghịch đảo của nó.'),
        bW(good,pm==='+'?qs(A,t):qa(A,t),'Bạn nhầm phép cộng với phép trừ ở bước cuối.'),bW(good,bNeg(good),'Sai dấu của kết quả.')]};}
}
const genTtFr=()=>tryGen(()=>bMk(ttFrData(),'Giá trị của biểu thức'));
const saTtFr=()=>{const d=ttFrData();return bSA(`Tính giá trị của biểu thức ${d.h}.`,d.good,d.exp);};
/* --- có ngoặc, có phân số --- */
function nnFrData(){
  for(;;){const A=bFr(),B=bFr(),Cc=bFr();
    if(RNG()<.5){const k=ri(2,6),sm=qa(B,Cc),good=qs(A,qm([k,1],sm));if(!bOk(good,36,200)||sm[0]===0)continue;
      return {good,h:`${SH(A)} − ${k} · (${SH(B)} + ${bS(Cc)})`,exp:`Trong ngoặc trước: ${SH(B)} + ${bS(Cc)} = ${SH(sm)}. Nhân: ${k} · ${bS(sm)} = ${SH(qm([k,1],sm))}. Vậy ${SH(A)} − ${bS(qm([k,1],sm))} = ${SH(good)}.`,
        wr:[bW(good,qm(qs(A,[k,1]),sm),'Phải tính trong ngoặc rồi nhân, sau đó mới trừ. Bạn đã trừ trước.'),
          bW(good,qa(qs(A,qm([k,1],B)),Cc),`Phải nhân ${k} với cả tổng trong ngoặc, không chỉ với số hạng đầu.`),
          bW(good,qa(A,qm([k,1],sm)),'Bạn nhầm phép trừ thành phép cộng.'),bW(good,bNeg(good),'Sai dấu của kết quả.')]};}
    const n=ri(1,5),df=qs(A,B),t=qd(df,Cc);if(!t||df[0]===0)continue;const good=qa(t,[n,1]);if(!bOk(good,36,200))continue;
    return {good,h:`(${SH(A)} − ${bS(B)}) : ${bS(Cc)} + ${n}`,exp:`Trong ngoặc trước: ${SH(A)} − ${bS(B)} = ${SH(df)}. Chia: ${SH(df)} : ${bS(Cc)} = ${SH(t)}. Vậy ${SH(t)} + ${n} = ${SH(good)}.`,
      wr:[bW(good,qa(qs(A,qd(B,Cc)),[n,1]),'Phải thực hiện phép tính trong ngoặc trước.'),
        bW(good,qd(df,qa(Cc,[n,1])),'Phép chia làm trước phép cộng. Bạn đã cộng trước.'),
        bW(good,qa(qm(df,Cc),[n,1]),'Chia cho một phân số là nhân với nghịch đảo của nó.'),bW(good,bNeg(good),'Sai dấu của kết quả.')]};}
}
const genNnFr=()=>tryGen(()=>bMk(nnFrData(),'Giá trị của biểu thức'));
const saNnFr=()=>{const d=nnFrData();return bSA(`Tính giá trị của biểu thức ${d.h}.`,d.good,d.exp);};
/* --- có luỹ thừa của phân số --- */
function ttPowData(){
  for(;;){const q=ri(2,4),p=sgn()*ri(1,q-1);if(gcd(p,q)!==1)continue;const B=[p,q],k=q*sel([q,2*q,1,3]),r=bFr(),pm=sel(['+','−']);
    const sq=bPw(B,2),t=qm([k,1],sq),good=pm==='+'?qa(t,r):qs(t,r);if(!bOk(good,36,300))continue;
    const fin=v=>pm==='+'?qa(v,r):qs(v,r),P=`(${SH(B)})${bSup(2)}`;
    return {good,h:`${k} · ${P} ${pm} ${bS(r)}`,exp:`Luỹ thừa trước: ${P} = ${SH(sq)}. Nhân: ${k} · ${SH(sq)} = ${SH(t)}. Vậy ${SH(t)} ${pm} ${bS(r)} = ${SH(good)}.`,
      wr:[bW(good,fin(bPw(qm([k,1],B),2)),'Luỹ thừa làm trước phép nhân. Bạn đã nhân rồi mới bình phương.'),
        bW(good,fin(qm([k,1],qm(B,[2,1]))),'Bình phương là nhân số đó với chính nó, không phải nhân với 2.'),
        bW(good,fin(qm([k,1],[p*p,q])),'Bình phương một phân số thì bình phương cả tử và mẫu.'),
        bW(good,fin(bNeg(t)),'Bình phương của một số âm là số dương.'),bW(good,bNeg(good),'Sai dấu của kết quả.')]};}
}
const genTtPow=()=>tryGen(()=>bMk(ttPowData(),'Giá trị của biểu thức'));
const saTtPow=()=>{const d=ttPowData();return bSA(`Tính giá trị của biểu thức ${d.h}.`,d.good,d.exp);};
function genTtPoly(){return tryGen(()=>{
  const q=sel([2,3,4]),p=sgn()*sel(q===4?[1,3]:q===3?[1,2]:[1]),B=[p,q],a=q*q*q,b=q*q*ri(1,4),c=ri(1,6),P=n=>`(${SH(B)})${bSup(n)}`;
  const t3=qm([a,1],bPw(B,3)),t2=qm([b,1],bPw(B,2)),good=qs(qa(t3,t2),[c,1]);
  return mk(`Giá trị của biểu thức ${a} · ${P(3)} + ${b} · ${P(2)} − ${c} · ${P(0)} là:`,SH(good),[
    bW(good,qa(t3,t2),`${P(0)} = 1 (mọi số khác 0 có luỹ thừa bậc 0 bằng 1), không phải 0.`),
    bW(good,qs(qa(t3,t2),qm([c,1],B)),`${P(0)} = 1, không phải ${SH(B)}.`),
    bW(good,qs(qa(bNeg(t3),t2),[c,1]),p<0?'Luỹ thừa bậc lẻ của số âm là số âm.':'Luỹ thừa của số dương là số dương.'),
    bW(good,qs(qa(t3,bNeg(t2)),[c,1]),'Luỹ thừa bậc chẵn luôn là số dương.'),bW(good,bNeg(good),'Sai dấu của kết quả.')],
    `${P(3)} = ${SH(bPw(B,3))}, ${P(2)} = ${SH(bPw(B,2))}, ${P(0)} = 1. Biểu thức bằng ${SH(t3)} + ${SH(t2)} − ${c} = ${SH(good)}.`);
});}
/* --- ngoặc lồng nhau --- */
function nnNestData(){
  for(;;){const A=bFr(),B=bFr(),m=ri(2,6),c1=ri(1,2*m-1),c2=ri(1,2*m-1);if(gcd(c1,m)!==1||gcd(c2,m)!==1)continue;
    const Cc=[c1,m],D=Rq(c2,m),inn=qa(Cc,D),mid=qs(B,inn),good=qs(A,mid);if(!bOk(good,36,200)||mid[0]===0)continue;
    return {good,h:`${SH(A)} − [${SH(B)} − (${fr(c1,m)} + ${fr(c2,m)})]`,exp:`Ngoặc tròn trước: ${fr(c1,m)} + ${fr(c2,m)} = ${SH(inn)}. Ngoặc vuông: ${SH(B)} − ${bS(inn)} = ${SH(mid)}. Vậy ${SH(A)} − ${bS(mid)} = ${SH(good)}.`,
      wr:[bW(good,qs(qs(A,B),inn),'Trước ngoặc vuông có dấu "−", trong ngoặc vuông lại có dấu "−" trước ngoặc tròn, nên tổng trong ngoặc tròn được cộng vào.'),
        bW(good,qs(qa(qs(A,B),Cc),D),'Khi bỏ ngoặc phải đổi dấu tất cả các số hạng trong ngoặc, không chỉ số hạng đầu.'),
        bW(good,qa(qs(A,B),qs(D,Cc)),'Khi bỏ ngoặc phải đổi dấu tất cả các số hạng trong ngoặc, không chỉ số hạng đầu.'),
        bW(good,qs(qa(A,B),inn),'Bạn đổi dấu sai khi bỏ ngoặc vuông.'),bW(good,bNeg(good),'Sai dấu của kết quả.')]};}
}
const genNnNest=()=>tryGen(()=>bMk(nnNestData(),'Giá trị của biểu thức'));
const saNnNest=()=>{const d=nnNestData();return bSA(`Tính giá trị của biểu thức ${d.h}.`,d.good,d.exp);};
/* --- tìm x có hệ số --- */
function cvLinData(){
  for(;;){const x0=bNum(),c=RNG()<.6?[ri(2,5),1]:bPos(),A=bNum(),plus=RNG()<.5,B=plus?qa(A,qm(c,x0)):qs(A,qm(c,x0));if(!bOk(B,48,200))continue;
    const t=plus?qs(B,A):qs(A,B),cx=bX(c,true);
    return {good:x0,h:`${SH(A)} ${plus?'+':'−'} ${cx} = ${SH(B)}`,exp:`Chuyển vế: ${cx} = ${plus?`${SH(B)} − ${bS(A)}`:`${SH(A)} − ${bS(B)}`} = ${SH(t)}. Vậy x = ${SH(t)} : ${SH(c)} = ${SH(x0)}.`,
      wr:[bW(x0,t,`Bạn mới tìm được ${cx} = ${SH(t)}, còn phải chia cho ${SH(c)}.`),bW(x0,qd(plus?qa(B,A):qa(A,B),c),'Khi chuyển vế phải đổi dấu số hạng.'),
        bW(x0,qm(t,c),`Từ ${cx} = ${SH(t)} phải chia cho ${SH(c)}, không nhân.`),bW(x0,bNeg(x0),'Sai dấu của kết quả.')]};}
}
const genCvLin=()=>tryGen(()=>bMk(cvLinData(),'Tìm x, biết:'));
const saCvLin=()=>{const d=cvLinData();return bSA(`Tìm x, biết: ${d.h}.`,d.good,d.exp);};
/* --- x ở cả hai vế --- */
function cvBothData(){
  for(;;){const a=ri(2,6),c=ri(1,5);if(a===c)continue;const x0=bNum(),b=bNum(),d=qa(qm([a-c,1],x0),b);if(!bOk(d,36,200)||d[0]===0)continue;
    const A=[a,1],Cc=[c,1],k=[a-c,1],t=qs(d,b);
    return {a,c,b,d,good:x0,h:`${bX(A,true)} ${bT(b)} = ${bX(Cc,true)} ${bT(d)}`,exp:`Chuyển các số hạng chứa x sang vế trái, các số sang vế phải: ${bX(A,true)} ${bX(bNeg(Cc))} = ${SH(d)} ${bT(bNeg(b))}, tức là ${bX(k,true)} = ${SH(t)}.${a-c===1?'':` Vậy x = ${SH(x0)}.`}`,
      wr:[bW(x0,qd(qa(d,b),k),'Khi chuyển một số hạng sang vế kia phải đổi dấu số hạng đó.'),bW(x0,qd(t,[a+c,1]),`Chuyển ${bX(Cc,true)} sang vế trái phải đổi dấu thành ${bX(bNeg(Cc))}.`),
        bW(x0,t,`Bạn mới tìm được ${bX(k,true)} = ${SH(t)}, còn phải chia cho ${N(a-c)}.`),bW(x0,bNeg(x0),'Sai dấu của kết quả.')]};}
}
const genCvBoth=()=>tryGen(()=>bMk(cvBothData(),'Tìm x, biết:'));
const saCvBoth=()=>{const d=cvBothData();return bSA(`Tìm x, biết: ${d.h}.`,d.good,d.exp);};
/* --- thu gọn các số hạng chứa x --- */
function cvColData(){
  for(;;){const p=bPos(),q=bFr();if(p[1]===q[1])continue;const sm=qa(p,q);if(sm[0]===0)continue;const x0=RNG()<.5?[sgn()*ri(1,6),1]:bFr(),r=qm(sm,x0);if(!bOk(r,60,300)||!bOk(sm,36,100))continue;
    return {p,q,sm,r,good:x0,h:`${bX(p,true)} ${bX(q)} = ${SH(r)}`,exp:`Thu gọn vế trái: (${SH(p)} ${bT(q)})x = ${bX(sm,true)}. Do đó ${bX(sm,true)} = ${SH(r)}, suy ra x = ${SH(r)} : ${bS(sm)} = ${SH(x0)}.`,
      wr:[bW(x0,qd(r,qm(p,q)),'Thu gọn hai số hạng chứa x là cộng hai hệ số, không phải nhân.'),bW(x0,qm(r,sm),`Từ ${bX(sm,true)} = ${SH(r)} phải chia cho ${SH(sm)}, không nhân.`),
        bW(x0,qd(r,qs(p,q)),'Bạn cộng hai hệ số sai dấu.'),bW(x0,bNeg(x0),'Sai dấu của kết quả.')]};}
}
const genCvCol=()=>tryGen(()=>bMk(cvColData(),'Tìm x, biết:'));
const saCvCol=()=>{const d=cvColData();return bSA(`Tìm x, biết: ${d.h}.`,d.good,d.exp);};
/* --- có dấu ngoặc chứa x --- */
function cvBrData(){
  for(;;){const b=ri(1,4),a=b+ri(1,4),c=bNum(),x0=bNum(),d=qs(qm([a-b,1],x0),c);if(!bOk(d,36,200))continue;
    const A=[a,1],B=[b,1],k=[a-b,1],t=qa(d,c);
    return {a,b,c,d,good:x0,h:`${bX(A,true)} − (${bX(B,true)} ${bT(c)}) = ${SH(d)}`,exp:`Bỏ ngoặc (đổi dấu các số hạng trong ngoặc): ${bX(A,true)} ${bX(bNeg(B))} ${bT(bNeg(c))} = ${SH(d)}, tức là ${bX(k,true)} = ${SH(d)} ${bT(c)} = ${SH(t)}. Vậy x = ${SH(x0)}.`,
      wr:[bW(x0,qd(qs(d,c),k),'Bỏ ngoặc có dấu "−" đằng trước phải đổi dấu tất cả các số hạng trong ngoặc.'),bW(x0,qd(t,[a+b,1]),`Bỏ ngoặc thì ${bX(B,true)} đổi dấu thành ${bX(bNeg(B))}.`),
        bW(x0,t,`Bạn mới tìm được ${bX(k,true)} = ${SH(t)}${a-b===1?'':', còn phải chia cho '+(a-b)}.`),bW(x0,bNeg(x0),'Sai dấu của kết quả.'),bW(x0,qa(x0,[1,1]),'Hãy thay lại vào đẳng thức để kiểm tra.')]};}
}
const genCvBr=()=>tryGen(()=>bMk(cvBrData(),'Tìm x, biết:'));
/* --- tìm x qua nhiều bước --- */
function cvChainData(){
  for(;;){const p=bNum(),q=RNG()<.5?[ri(2,4),1]:bPos(),r=bNum(),x0=bNum(),u=qd(qs(x0,p),q);if(!u||u[0]===0)continue;const s2=qa(u,r);if(!bOk(s2,48,200))continue;
    return {good:x0,h:`(x ${bT(bNeg(p))}) : ${SH(q)} ${bT(r)} = ${SH(s2)}`,exp:`(x ${bT(bNeg(p))}) : ${SH(q)} = ${SH(s2)} ${bT(bNeg(r))} = ${SH(u)}. Suy ra x ${bT(bNeg(p))} = ${SH(u)} · ${SH(q)} = ${SH(qm(u,q))}. Vậy x = ${SH(x0)}.`,
      wr:[bW(x0,qa(qd(u,q),p),`Từ (x ${bT(bNeg(p))}) : ${SH(q)} = ${SH(u)} phải nhân ${SH(u)} với ${SH(q)}, không chia.`),bW(x0,qa(qm(qa(s2,r),q),p),'Khi chuyển vế phải đổi dấu số hạng.'),
        bW(x0,qs(qm(u,q),p),`Từ x ${bT(bNeg(p))} = ${SH(qm(u,q))} khi chuyển vế phải đổi dấu.`),bW(x0,qm(u,q),`${SH(qm(u,q))} là giá trị của x ${bT(bNeg(p))}, chưa phải x.`),bW(x0,bNeg(x0),'Sai dấu của kết quả.')]};}
}
const genCvChain=()=>tryGen(()=>bMk(cvChainData(),'Tìm x, biết:'));
const saCvChain=()=>{const d=cvChainData();return bSA(`Tìm x, biết: ${d.h}.`,d.good,d.exp);};
/* --- đúng sai: bước biến đổi nào đúng --- */
function tCvSteps(){
  const both=()=>{const a=ri(3,7),c=ri(1,a-1),b=ri(1,9),d=ri(1,9),ok=RNG()<.5;
    return IT(`Từ ${a}x + ${b} = ${bX([c,1],true)} + ${d} suy ra ${a}x − ${bX([c,1],true)} = ${d} ${ok?'−':'+'} ${b}`,ok,'cv','VD',`Chuyển ${bX([c,1],true)} sang vế trái và ${b} sang vế phải, mỗi số hạng đổi dấu: ${a}x − ${bX([c,1],true)} = ${d} − ${b}.`);};
  const br=()=>{const b=ri(1,4),a=b+ri(1,4),c=ri(1,9),d=ri(1,9),ok=RNG()<.5;
    return IT(`Từ ${a}x − (${bX([b,1],true)} + ${c}) = ${d} suy ra ${a}x − ${bX([b,1],true)} ${ok?'−':'+'} ${c} = ${d}`,ok,'cv','VD',`Bỏ ngoặc có dấu "−" đằng trước thì đổi dấu mọi số hạng trong ngoặc: ${a}x − ${bX([b,1],true)} − ${c} = ${d}.`);};
  const col=()=>{const p=bPos(),q=bPos();if(p[1]===q[1])return null;const r=ri(1,9),ok=RNG()<.5,sm=qa(p,q),w=qm(p,q);
    return IT(`Từ ${bX(p,true)} + ${bX(q,true)} = ${r} suy ra ${bX(ok?sm:w,true)} = ${r}`,ok,'cv','VD',`Thu gọn bằng cách cộng hai hệ số: ${SH(p)} + ${SH(q)} = ${SH(sm)}, nên ${bX(sm,true)} = ${r}.`);};
  const coef=()=>{const k=ri(2,6),m=bFr(),ok=RNG()<.5,g=qd(m,[k,1]),w=sel([qm(m,[k,1]),qs(m,[k,1])]);
    return IT(`Từ ${k}x = ${SH(m)} suy ra x = ${SH(ok?g:w)}`,ok,'cv','VD',`Chia hai vế cho ${k}: x = ${SH(m)} : ${k} = ${SH(g)}.`);};
  const items=mixed(()=>[both(),br(),col(),coef()]);
  return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();
}
addMC('g_ttfr','tt','TH',genTtFr);addMC('g_nnfr','nn','TH',genNnFr);addMC('g_ttpow','tt','TH',genTtPow);addMC('g_ttpoly','tt','VD',genTtPoly);addMC('g_nnnest','nn','VD',genNnNest);
addMC('g_cvlin','cv','VD',genCvLin);addMC('g_cvboth','cv','VD',genCvBoth);addMC('g_cvcol','cv','VD',genCvCol);addMC('g_cvbr','cv','VD',genCvBr);addMC('g_cvchain','cv','VD',genCvChain);
addTF('tf_cv_vd2','cv','VD',tCvSteps);

function SA_BUILD(){const S=[];const add=(id,topic,level,gen)=>['a','b'].forEach(x=>S.push({id:id+x,type:'sa',topic,level,unit:'',gen}));
  add('s_ttnb','tt','NB',saTtNb);add('s_ttval','tt','TH',saTtVal);
  add('s_nnval','nn','TH',saNnVal);add('s_nnbig','nn','VD',saNnBig);
  add('s_dtfind','dt','NB',saDtFind);add('s_dtex','dt','TH',saDtEx);
  add('s_ttfr','tt','TH',saTtFr);add('s_nnfr','nn','TH',saNnFr);add('s_ttpow','tt','TH',saTtPow);add('s_nnnest','nn','VD',saNnNest);
  add('s_cvlin','cv','VD',saCvLin);add('s_cvboth','cv','VD',saCvBoth);add('s_cvcol','cv','VD',saCvCol);add('s_cvchain','cv','VD',saCvChain);
  add('s_cvx','cv','TH',saCvx);add('s_cvvd','cv','VD',saCvVd);add('s_cvtt','cv','VD',saCvTt);
  return S;}
const BANK={mc:MC,tf:TF,sa:SA_BUILD()};
const SA=BANK.sa;
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level,at)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp,at});
function tfHard(){const fs=[ttItem,nnItem,dtItem,cvItem];const items=mixed(()=>shuffle(fs).map(f=>f('VD')));return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();}
const hardExpr=(list,idxs,topic)=>()=>{const r=saExpr(list,idxs);return r;};
const HARD={tf:[{id:'h_tf',type:'tf',topic:'cv',level:'VD',gen:tfHard}],sa:[
 {id:'h_val',topic:'nn',level:'VD',unit:'',gen:()=>saExpr(NN_T,[2,3,6,8])},
 {id:'h_tt',topic:'tt',level:'VD',unit:'',gen:()=>saExpr(TT_T,[3,4,5,6])},
 {id:'h_x',topic:'cv',level:'VD',unit:'',gen:()=>eqSA(['x-(a-b)','a-x=b-(c)'],['dec'],e=>`Tìm x, biết: ${eqS(e.L,e.R)}`)},
 {id:'h_ex',topic:'dt',level:'VD',unit:'',gen:()=>{for(let n=0;n<400;n++){const e=eqForm(sel(['x+a','x-a']),'int');if(!eqOK(e))continue;const sol=solveEq(e.L,e.R),c=ri(1,9),d=sel([2,3,4,5]),tsx=['(','x','−',NI(c),')','·',NI(d)];const v=evalX(tsx,sol);if(!v||v[1]!==1)continue;return {stem:`Biết ${eqS(e.L,e.R)}. Tính ${show(tsx)}.`,ans:[v[0]],exp:`Chuyển vế: x = ${VAL(sol)}. Do đó ${show(tsx)} = ${VAL(v)}.`};}}}
].map(q=>Object.assign({type:'sa'},q))};
HARD.sa.push(...[{id:'h_nest',topic:'nn',gen:saNnNest},{id:'h_both',topic:'cv',gen:saCvBoth},{id:'h_col',topic:'cv',gen:saCvCol},{id:'h_chain',topic:'cv',gen:saCvChain}].map(q=>Object.assign({type:'sa',level:'VD',unit:''},q)));
const PISA=[
 ()=>{for(;;){
  const A=ri(10,30)/10,B=ri(40,90)/10,a=Rq(Math.round(A*10),10),b=Rq(Math.round(B*10),10),x=qs(b,a);
  const fa=VAL(a),fb=VAL(b);
  return {title:'Cân thăng bằng',ctx:`<p class="stem">Một chiếc cân thăng bằng: một đĩa đặt quả cam nặng ${fa} kg và quả bưởi nặng x kg; đĩa còn lại đặt quả mít nặng ${fb} kg.</p>`,qs:[
   mcq('Đẳng thức nào biểu diễn việc cân ở trạng thái thăng bằng?',`${fa} + x = ${fb}`,[[`x − ${fa} = ${fb}`,'Khối lượng ở hai đĩa phải bằng nhau: đĩa trái là quả cam cộng quả bưởi.'],[`${fa} + ${fb} = x`,'Quả cam và quả bưởi nằm cùng một đĩa, đĩa kia là quả mít.'],[`${fa} − x = ${fb}`,'Hai quả ở cùng một đĩa nên khối lượng của chúng được cộng lại.']],`Đĩa trái nặng ${fa} + x (kg) bằng đĩa phải nặng ${fb} kg.`,'dt','TH'),
   saq('Quả bưởi nặng bao nhiêu kilôgam?',vq(x),'kg',`Chuyển vế: x = ${fb} − ${fa} = ${VAL(x)} (kg).`,'cv','TH',x[1]===1?undefined:DEC(x)),
   saq('Hai quả bưởi như vậy nặng bao nhiêu kilôgam?',2*vq(x),'kg',`x = ${VAL(x)} nên hai quả nặng 2 · ${VAL(x)} = ${VAL(qm([2,1],x))} (kg).`,'cv','TH',(()=>{const y=qm([2,1],x);return y[1]===1?undefined:DEC(y);})()),
   saq('Nếu thêm một quả táo nặng 0,5 kg vào đĩa chứa quả mít thì phải đặt thêm lên đĩa kia bao nhiêu kilôgam để cân vẫn thăng bằng?',0.5,'kg','Cộng 0,5 vào vế phải thì phải cộng 0,5 vào vế trái: cần thêm 0,5 kg.','dt','VD','0,5')]};}},
 ()=>{for(;;){
  const T=sel([80,90,100,120])/100,G=sel([40,45,50,55])/100,D=sel([10,12.5,15,8])/100,L=sel([4,5,6])/100;
  const m=Math.round((T-G-D-L)*1000)/1000;if(m<=0.02)continue;
  const t=Rq(Math.round(T*100),100),g=Rq(Math.round(G*100),100),d=Rq(Math.round(D*1000),1000),l=Rq(Math.round(L*100),100),th=Rq(Math.round(m*1000),1000);
  const ft=VAL(t),fg=VAL(g),fd=VAL(d),fl=VAL(l);
  return {title:'Bánh chưng',ctx:`<p class="stem">Một cái bánh chưng nặng khoảng ${ft} kg gồm ${fg} kg gạo nếp, ${fd} kg đậu xanh, ${fl} kg lá dong, phần còn lại là thịt lợn.</p>`,qs:[
   mcq('Biểu thức nào cho khối lượng thịt lợn trong cái bánh?',`${ft} − ${fg} − ${fd} − ${fl}`,[[`${ft} + ${fg} + ${fd} + ${fl}`,'Khối lượng thịt phải nhỏ hơn khối lượng cả bánh nên không được cộng.'],[`${fg} + ${fd} + ${fl} − ${ft}`,'Phải lấy khối lượng cả bánh trừ đi khối lượng các nguyên liệu khác.'],[`${ft} − ${fg} + ${fd} − ${fl}`,'Phải trừ đi cả ba loại: gạo, đậu xanh và lá dong.']],`Thịt = cả bánh − gạo − đậu xanh − lá dong.`,'tt','TH'),
   saq('Khối lượng thịt lợn trong cái bánh là bao nhiêu kilôgam?',m,'kg',`${ft} − ${fg} − ${fd} − ${fl} = ${VAL(th)} (kg).`,'tt','TH',DEC(th)),
   saq('Gạo nếp và đậu xanh nặng tổng cộng bao nhiêu kilôgam?',Math.round((G+D)*1000)/1000,'kg',`${fg} + ${fd} = ${VAL(qa(g,d))} (kg).`,'tt','TH',DEC(qa(g,d))),
   saq('Làm 5 cái bánh như vậy thì cần bao nhiêu kilôgam thịt lợn?',Math.round(5*m*1000)/1000,'kg',`5 · ${VAL(th)} = ${VAL(qm([5,1],th))} (kg).`,'tt','VD',(()=>{const y=qm([5,1],th);return y[1]===1?undefined:DEC(y);})())]};}}
];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'tt',fig:`<div class="figbox"><p>Luỹ thừa → Nhân, chia → Cộng, trừ</p><p>Cùng bậc: làm từ trái sang phải</p><p>1,2 − 3² + 7,5 : 3 = 1,2 − 9 + 2,5 = −5,3</p></div>`,extra:'Thứ tự thực hiện phép tính đối với số tự nhiên vẫn đúng với số hữu tỉ.'},
  {k:'nn',fig:`<div class="figbox"><p>( ) → [ ] → { }</p><p>[5 + 2 · (9 − 2³)] : 7</p><p>= [5 + 2 · 1] : 7 = 7 : 7 = 1</p></div>`,extra:'Trong ngoặc trước, ngoài ngoặc sau; trong mỗi ngoặc vẫn làm luỹ thừa, nhân chia, rồi cộng trừ.'},
  {k:'dt',fig:`<div class="figbox"><p>A = B: A là vế trái, B là vế phải</p><p>Nếu a = b thì b = a và a + c = b + c</p><p>a + 6 = −9 ⇒ a = −9 − 6 = −15</p></div>`,extra:'Có thể cộng (hoặc trừ) cùng một số vào cả hai vế của đẳng thức.'},
  {k:'cv',fig:`<div class="figbox"><p>a + b = c ⇒ a = c − b</p><p>a − b = c ⇒ a = c + b</p><p>x − 3,5 = 8 ⇒ x = 8 + 3,5 = 11,5</p></div>`,extra:'Chuyển một số hạng sang vế kia phải đổi dấu: "+" thành "−" và "−" thành "+".'}
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
 G(()=>{const a=5*ri(14,24),b=5*ri(8,13),c=5*ri(10,16),p=ri(2,3),q=ri(1,3),r=ri(1,3),d=sel([10,15,20]);if(b>=a)throw 0;
  const tot=p*a+q*b+r*c,tue=p*(a-d)+q*(b-d)+r*c,e=sel([10,12,15]),x=ri(2,5),f=5*ri(2,10),Mm=tot+e*x+f;
  const ex=`${p} · ${a} + ${q} · ${b} + ${r} · ${c}`;
  return {title:'Đi xem phim',ctx:P(`Giá vé xem phim là ${a} nghìn đồng cho mỗi người lớn và ${b} nghìn đồng cho mỗi trẻ em. Mỗi phần bỏng ngô kèm nước giá ${c} nghìn đồng. Gia đình bạn Hà gồm ${p} người lớn và ${q} trẻ em đi xem phim và mua ${r} phần bỏng ngô kèm nước.`),qs:[
   M('Biểu thức nào tính tổng số tiền gia đình bạn Hà phải trả (nghìn đồng)?',ex,[[`(${p} + ${q}) · (${a} + ${b}) + ${r} · ${c}`,'Biểu thức này tính như thể mỗi người mua cả vé người lớn lẫn vé trẻ em.'],[`${p} · (${a} + ${q}) · ${b} + ${r} · ${c}`,'Đặt dấu ngoặc sai làm thay đổi thứ tự thực hiện phép tính.'],[`(${p} + ${q} + ${r}) · (${a} + ${b} + ${c})`,'Mỗi loại có số lượng và giá riêng, phải nhân từng cặp rồi mới cộng.']],`Tiền vé người lớn + tiền vé trẻ em + tiền bỏng ngô: ${ex}.`,'tt','TH'),
   A('Gia đình bạn Hà phải trả tất cả bao nhiêu nghìn đồng?',tot,'nghìn đồng',`Nhân trước, cộng sau: ${ex} = ${p*a} + ${q*b} + ${r*c} = ${tot}.`,'tt','TH'),
   A(`Vào thứ Ba, mỗi vé (cả người lớn và trẻ em) được giảm ${d} nghìn đồng, bỏng ngô không giảm giá. Nếu đi vào thứ Ba thì gia đình bạn Hà phải trả bao nhiêu nghìn đồng?`,tue,'nghìn đồng',`${p} · (${a} − ${d}) + ${q} · (${b} − ${d}) + ${r} · ${c} = ${p*(a-d)} + ${q*(b-d)} + ${r*c} = ${tue}. Làm phép tính trong ngoặc trước.`,'nn','VD'),
   A(`Một ngày thường, gia đình bạn Hà mang theo ${Mm} nghìn đồng. Sau khi mua vé và bỏng ngô như trên, Hà mua thêm một số chai nước, mỗi chai ${e} nghìn đồng, thì còn lại ${f} nghìn đồng. Hà đã mua bao nhiêu chai nước?`,x,'chai',`Gọi số chai nước là x. Ta có ${tot} + ${e} · x + ${f} = ${Mm}. Chuyển vế: ${e} · x = ${Mm} − ${tot} − ${f} = ${e*x}, nên x = ${e*x} : ${e} = ${x}.`,'cv','VD')]};}),
 G(()=>{const b=sel([20,25,30,40,50]),c=sel([10,20,25,30,50]),g=(x,y)=>y?g(y,x%y):x,L=b*(b+c)/g(b,b+c);
  const k=ri(1,6),need=L*k;if(need<400||need>3000)throw 0;const a=5*ri(10,60),Pr=a+need,w=ri(3,6);
  const x=need/b,y=need/(b+c);if(!Number.isInteger(x)||!Number.isInteger(y)||w>=x)throw 0;
  return {title:'Để dành tiền mua xe đạp',ctx:P(`Bạn Minh muốn mua một chiếc xe đạp giá ${Pr} nghìn đồng. Minh đã có sẵn ${a} nghìn đồng và mỗi tuần để dành thêm được ${b} nghìn đồng.`),qs:[
   A(`Sau ${w} tuần, Minh có tất cả bao nhiêu nghìn đồng?`,a+w*b,'nghìn đồng',`${a} + ${w} · ${b} = ${a} + ${w*b} = ${a+w*b}.`,'tt','TH'),
   M('Gọi x là số tuần Minh cần để dành để có vừa đủ tiền mua xe. Đẳng thức nào đúng?',`${a} + ${b} · x = ${Pr}`,[[`(${a} + ${b}) · x = ${Pr}`,`Số tiền có sẵn ${a} nghìn đồng chỉ tính một lần, không nhân với số tuần.`],[`${a} · x + ${b} = ${Pr}`,`Số tiền mỗi tuần để dành là ${b} nghìn đồng, nên ${b} mới nhân với số tuần.`],[`${b} · x − ${a} = ${Pr}`,'Số tiền có sẵn được cộng thêm vào, không bị trừ đi.']],`Tiền có sẵn + tiền để dành trong x tuần = giá xe: ${a} + ${b} · x = ${Pr}.`,'dt','TH'),
   A('Minh cần để dành trong bao nhiêu tuần thì vừa đủ tiền mua xe?',x,'tuần',`${a} + ${b} · x = ${Pr}. Chuyển vế: ${b} · x = ${Pr} − ${a} = ${need}, nên x = ${need} : ${b} = ${x}.`,'cv','VD'),
   A(`Nếu từ tuần đầu tiên, mỗi tuần Minh để dành thêm được ${c} nghìn đồng nữa (tức là ${b+c} nghìn đồng mỗi tuần) thì Minh cần để dành trong bao nhiêu tuần?`,y,'tuần',`${a} + ${b+c} · y = ${Pr}. Chuyển vế: ${b+c} · y = ${need}, nên y = ${need} : ${b+c} = ${y}.`,'cv','VD')]};})
);
}
/* ==== Toán thực tế bổ sung: kết thúc ==== */
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='tc7_seen';
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
  const mcSlots=[['tt',['NB','TH']],['tt',['TH']],['nn',['NB','TH']],['nn',['TH','VD']],['dt',['NB','TH']],['cv',['NB','TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>q.topic===t&&l.includes(q.level)),used));
  const tf=[sel(['tt','nn']),'dt','cv'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set(),t1=sel(['tt','dt']),t2=sel(['nn','cv']);
  const mc=['tt','nn','dt','cv'].map(t=>pick(MC.filter(q=>q.topic===t&&q.level!=='VD'),used));
  const sa=[pick(SA.filter(q=>q.topic===t1&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic===t2&&q.level!=='VD'),used)];
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
