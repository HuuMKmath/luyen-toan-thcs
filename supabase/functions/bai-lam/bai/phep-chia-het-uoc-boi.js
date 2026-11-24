// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ phep-chia-het-uoc-boi/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "phep-chia-het-uoc-boi";
export const TIEN_TO = "UB6-";

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
function tryGen(f){
  for(let n=0;n<100;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>o.t)).size===4)return r;}
  return FB_MC();
}


const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};

/* ============ Dữ liệu dùng chung cho Bài 17 ============ */
const NN=x=>(x<0?'−':'')+String(Math.abs(x)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');   // 45 000
const nz=(lo,hi)=>ri(lo,hi)*sgn();
const O=(t,err)=>err?{t,err}:{t};
const DV=(a,b)=>nb(`${P(a)} : ${P(b)}`);              // (−45) : 5
const LST=a=>a.map(N).join('; ');
const ab=Math.abs;
const divsP=n=>{n=ab(n);const r=[];for(let d=1;d<=n;d++)if(n%d===0)r.push(d);return r;};
const divsAll=n=>{const p=divsP(n);return p.map(d=>-d).reverse().concat(p);};          // tăng dần: −n; …; −1; 1; …; n
const gcd=(a,b)=>{a=ab(a);b=ab(b);while(b){[a,b]=[b,a%b];}return a;};
const lcm=(a,b)=>ab(a*b)/gcd(a,b);
const SMALLN=[6,8,9,10,12,14,15,16,18,20,21,24,25,28,30,35,40,42,45];
const E_DSGN='Thương của hai số cùng dấu là số dương, thương của hai số khác dấu là số âm.';
const E_MUL='Đề yêu cầu chia, bạn đã nhân hai số.';
const FB_MC=()=>({stem:`Tính ${DV(-36,4)}.`,opts:[{t:'−9'},{t:'9',err:E_DSGN},{t:'−144',err:E_MUL},{t:'−32',err:'Đề yêu cầu chia, bạn đã trừ hai số.'}],ans:0,exp:'Hai số khác dấu nên thương âm: 36 : 4 = 9, vậy (−36) : 4 = −9.'});
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
const FB_TF=()=>({stem:'Xét các phát biểu sau:',items:[
  IT('Thương của hai số nguyên khác dấu (khi chia hết) là một số nguyên âm.',true,'ch','NB','Ví dụ 12 : (−3) = −4.'),
  IT('Thương của hai số nguyên âm (khi chia hết) là một số nguyên âm.',false,'ch','NB','Thương của hai số nguyên cùng dấu là số dương. Ví dụ (−12) : (−3) = 4.'),
  IT('Nếu a chia hết cho b thì a là một bội của b.',true,'ub','NB','Khi a chia hết cho b ta gọi a là một bội của b và b là một ước của a.'),
  IT('Số 0 là ước của mọi số nguyên.',false,'ub','NB','Không thể chia cho 0 nên 0 không là ước của số nào.')]});
function pick4(Ts,Fs){const nT=ri(1,3);return shuffle(shuffle(Ts).slice(0,nT).concat(shuffle(Fs).slice(0,4-nT)));}
function mixed(make){for(let n=0;n<80;n++){const items=make();if(items.some(i=>!i))continue;const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}return null;}
const four=f=>()=>{const items=mixed(()=>[f(),f(),f(),f()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};

/* --- phép chia hết (SGK Ví dụ 1, Luyện tập 1, 3.39) --- */
function divData(){const b=nz(2,15),q=nz(2,30);return {a:b*q,b,q};}
function sameSg(a,b){return (a<0)===(b<0);}
const divWhy=(a,b,q)=>`${sameSg(a,b)?'Hai số cùng dấu nên thương dương':'Hai số khác dấu nên thương âm'}: ${nb(`${ab(a)} : ${ab(b)} = ${ab(q)}`)}. Vậy ${DV(a,b)} = ${N(q)}.`;
function genChDiv(){return tryGen(()=>{const {a,b,q}=divData();
  return mk(`Tính ${DV(a,b)}.`,N(q),[C(N(-q),E_DSGN),C(N(a*b),E_MUL),C(N(q+sgn()*sel([1,10])),`Tính nhẩm sai: ${ab(a)} : ${ab(b)} = ${ab(q)}.`)],divWhy(a,b,q));
});}
function genChSign(){return tryGen(()=>{const {a,b,q}=divData(),good=q<0?'số nguyên âm':'số nguyên dương';
  const all=[['số nguyên dương','Hai số khác dấu thì thương âm.'],['số nguyên âm','Hai số cùng dấu thì thương dương.']].filter(x=>x[0]!==good);
  return mk(`Thương ${DV(a,b)} là:`,good,[C(all[0][0],all[0][1]),C('bằng 0','Thương bằng 0 chỉ khi số bị chia bằng 0.'),C('không thực hiện được','Vì '+N(a)+' = '+P(b)+' · '+P(q)+' nên phép chia thực hiện được.')],`${N(a)} = ${P(b)} · ${P(q)}, nên thương là ${N(q)}, một ${good}.`);
});}
function genChFrom(){return tryGen(()=>{
  const y=ri(2,12),q=ri(2,20),x=y*q,k=sel([[ -x,y,-q,`(−${x}) : ${y}`],[x,-y,-q,`${x} : (−${y})`],[-x,-y,q,`(−${x}) : (−${y})`]]),v=k[2];
  return mk(`Biết ${nb(`${x} : ${y} = ${q}`)}. Thương ${nb(k[3])} bằng:`,N(v),[C(N(-v),E_DSGN),C(N(x*y),E_MUL),C(N(v+sgn()*y),'Đổi dấu số bị chia hoặc số chia chỉ làm đổi dấu của thương, không đổi độ lớn.')],
    `Độ lớn của thương vẫn là ${x} : ${y} = ${q}. ${sameSg(k[0],k[1])?'Hai số cùng dấu nên thương dương':'Hai số khác dấu nên thương âm'}: ${nb(k[3])} = ${N(v)}.`);
});}
function divStmt(){const b=nz(2,15),isT=RNG()<.5;let a;if(isT)a=b*nz(2,30);else{do{a=nz(5,300);}while(a%b===0);}
  return {t:`${N(a)} chia hết cho ${N(b)}`,v:isT,a,b};}
function genChStmt(){return tryGen(()=>{
  const T=[],F=[];for(let i=0;i<80&&(!T.length||F.length<3);i++){const x=divStmt();if(x.v){if(!T.length)T.push(x);}else if(F.length<3)F.push(x);}
  if(!T.length||F.length<3)return null;
  return mk('Trong các phát biểu sau, phát biểu nào đúng?',T[0].t+'.',F.map(f=>C(f.t+'.',`${ab(f.a)} không chia hết cho ${ab(f.b)} nên không có số nguyên q để ${N(f.a)} = ${P(f.b)} · q.`)),`${N(T[0].a)} = ${P(T[0].b)} · ${P(T[0].a/T[0].b)} nên ${N(T[0].a)} chia hết cho ${N(T[0].b)}.`);
});}
function exprData(){
  const c=ri(2,9),t=nz(2,12),diff=c*t,a=ri(20,60),b=a-diff,d=ri(10,40),e=ri(10,40),f=ri(2,9);if(d===e)return exprData();
  const u=diff/(-c),v=(d-e)*f;
  return {a,b,c,d,e,f,u,v,val:u+v,txt:nb(`(${a} − ${P(b)}) : (−${c}) + (${d} − ${e}) · ${f}`),
    exp:`${nb(`(${a} − ${P(b)}) : (−${c}) + (${d} − ${e}) · ${f} = ${P(diff)} : (−${c}) + ${P(d-e)} · ${f} = ${N(u)} + ${P(v)} = ${N(u+v)}`)}.`};}
function genChExpr(){return tryGen(()=>{const o=exprData();
  return mk(`Tính giá trị của biểu thức ${o.txt}.`,N(o.val),[C(N(-o.u+o.v),'Hiệu '+N(o.a-o.b)+' chia cho (−'+o.c+') là số '+(o.u<0?'âm':'dương')+'.'),C(N(o.u-o.v),'Dấu của tích (d − e) · f bị đổi sai.'),C(N(-o.val),'Bạn đã đảo dấu kết quả.')],o.exp);
});}
const CMPW=['lớn hơn','nhỏ hơn','bằng'];
function cmpDivData(){const k=ri(0,4),m=ri(2,12),n=ri(2,9),p=ri(2,12),x=m*n;
  const T=[[DV(-x,n),'0','<','Thương của hai số khác dấu là số âm, mà số âm nhỏ hơn 0.'],
    [DV(-x,-n),'0','>','Thương của hai số cùng dấu là số dương, mà số dương lớn hơn 0.'],
    [DV(x,-n),N(-m),'=','Thương của hai số khác dấu là số âm: '+nb(`${x} : (−${n}) = −${m}`)+'.'],
    [DV(-x,-n),DV(-p*n,n),'>','Thương (−'+x+') : (−'+n+') là số dương, thương (−'+p*n+') : '+n+' là số âm.'],
    [DV(-x,n),DV(x,-n),'=','Hai thương đều bằng −'+m+'.']][k];
  return {l:T[0],r:T[1],rel:T[2],why:T[3]};}
function genChCmp(){return tryGen(()=>{const o=cmpDivData(),name=o.rel==='>'?'lớn hơn':o.rel==='<'?'nhỏ hơn':'bằng';
  return mk(`Không cần tính hết, hãy so sánh ${o.l} với ${o.r}. Số thứ nhất so với số thứ hai là:`,name,CMPW.filter(t=>t!==name).map(t=>C(t,'Hãy xét dấu của mỗi thương: '+o.why)).concat([C('không so sánh được','Biết dấu và độ lớn của các thương thì so sánh được.')]),o.why);
});}

/* --- ước và bội (SGK Ví dụ 2, 3, 4, Luyện tập 2, 3.40, 3.41) --- */
function genUbList(){return tryGen(()=>{const n=sgn()*sel(SMALLN.filter(x=>x<=30)),all=divsAll(n),p=divsP(n);
  const noSelf=all.filter(d=>ab(d)!==ab(n));
  return mk(`Tập hợp tất cả các ước của ${N(n)} là:`,'{'+LST(all)+'}',[C('{'+LST(p)+'}','Mỗi ước dương d luôn đi cùng số đối −d, vì −d cũng là ước.'),C('{'+LST(noSelf)+'}',`${N(n)} và ${N(-n)} cũng là ước của chính ${N(n)}.`),C('{'+LST(all.filter(d=>d<0).concat([0],all.filter(d=>d>0)))+'}','Không có phép chia cho 0 nên 0 không là ước của số nào.')],
    `Các ước dương của ${ab(n)} là ${LST(p)}. Lấy thêm các số đối của chúng, ta được tất cả các ước: ${LST(all)}.`);
});}
function genUbIs(){return tryGen(()=>{const n=sgn()*sel(SMALLN),good=sel(divsAll(n).filter(d=>ab(d)>1&&ab(d)<ab(n))),W=[];
  for(let i=0;i<60&&W.length<3;i++){const w=sgn()*ri(2,ab(n)-1);if(n%w!==0&&!W.includes(w))W.push(w);}
  if(W.length<3)return null;
  return mk(`Số nào sau đây là ước của ${N(n)}?`,N(good),W.map(w=>C(N(w),`${N(n)} không chia hết cho ${N(w)}.`)),`${DV(n,good)} = ${N(n/good)} nên ${N(good)} là ước của ${N(n)}.`);
});}
function genUbMult(){return tryGen(()=>{const n=nz(3,15),k=nz(2,12),good=n*k;
  const W=[n*sgn()*ri(2,12)+sel([1,-1,2,-2])].concat([good+sel([1,-1]),good+sel([2,-2])]);
  return mk(`Số nào sau đây là một bội của ${N(n)}?`,N(good),W.map(w=>C(N(w),`${DV(w,n)} không là số nguyên nên ${N(w)} không là bội của ${N(n)}.`)),`${N(good)} = ${P(n)} · ${P(k)} nên ${N(good)} là một bội của ${N(n)}.`);
});}
function cntMultData(){const n=ri(3,9),a=ri(2,6),b=ri(2,6);return {n,a,b,L:n*a,R:n*b,cnt:a+b-1,txt:nb(`−${n*a} < x < ${n*b}`)};}
function genUbCntMult(){return tryGen(()=>{const o=cntMultData();
  return mk(`Có bao nhiêu số nguyên x là bội của ${o.n} và thỏa mãn ${o.txt}?`,''+o.cnt,[C(''+(o.cnt+1),'Điều kiện chặt (dấu <) nên không lấy hai đầu mút.'),C(''+(o.cnt-1),'Số 0 cũng là bội của '+o.n+' (0 = '+o.n+' · 0).'),C(''+(o.b-1),'Phải đếm cả các bội âm và số 0.')],
    `Các bội của ${o.n} thỏa mãn: ${LST(Array.from({length:o.cnt},(_,i)=>(i-(o.a-1))*o.n))}. Có ${o.cnt} số.`);
});}
function cntDivData(){const n=sel(SMALLN),d=divsP(n).length;return {n,d,cnt:2*d};}
function genUbCntDiv(){return tryGen(()=>{const o=cntDivData(),n=o.n*sgn();
  return mk(`Có bao nhiêu số nguyên là ước của ${N(n)}?`,''+o.cnt,[C(''+o.d,'Mỗi ước dương d còn có ước âm −d, nên số ước nguyên gấp đôi.'),C(''+(o.cnt+1),'0 không là ước của số nào, không đếm số 0.'),C(''+(o.cnt-2),`1, −1 và cả ${o.n}, −${o.n} đều là ước của ${ab(n)}.`)],
    `${ab(n)} có ${o.d} ước dương (${LST(divsP(n))}), cùng với ${o.d} số đối của chúng, tổng cộng ${o.cnt} ước.`);
});}
function genUbCommon(){return tryGen(()=>{
  const d=nz(2,9),u=ri(2,9),v=ri(2,9);if(u===v||gcd(u,v)!==1)return null;const a=d*u*sgn(),b=d*v*sgn();
  const A=divsAll(a).filter(x=>ab(x)>1&&b%x!==0),B=divsAll(b).filter(x=>ab(x)>1&&a%x!==0);if(!A.length||!B.length)return null;
  let w3;for(let i=0;i<60;i++){const w=nz(2,9);if(a%w!==0&&b%w!==0){w3=w;break;}}if(w3===undefined)return null;
  return mk(`Số nào sau đây là ước chung của ${N(a)} và ${N(b)}?`,N(d),[C(N(sel(A)),`Số này là ước của ${N(a)} nhưng không là ước của ${N(b)}.`),C(N(sel(B)),`Số này là ước của ${N(b)} nhưng không là ước của ${N(a)}.`),C(N(w3),`Số này không là ước của ${N(a)} và ${N(b)}.`)],
    `${DV(a,d)} = ${N(a/d)} và ${DV(b,d)} = ${N(b/d)} nên ${N(d)} là ước của cả ${N(a)} và ${N(b)}.`);
});}
function setData(){const m=ri(3,7),L=ri(8,30),R=ri(8,30),lo=-L,els=[];for(let x=lo;x<R;x++)if(x%m===0)els.push(x+0);
  return {m,L,R,els,cnt:els.length,s:els.reduce((p,x)=>p+x,0),txt:nb(`−${L} ≤ x < ${R}`)};}
function genUbSetCnt(){return tryGen(()=>{const o=setData();
  return mk(`Cho ${nb(`M = {x ∈ ℤ | x ⋮ ${o.m} và ${o.txt}}`)}. Tập hợp M có bao nhiêu phần tử?`,''+o.cnt,[C(''+(o.cnt-1),'Bạn bỏ sót một phần tử. Hãy kiểm tra số 0 và đầu mút −'+o.L+' (dấu ≤ lấy đầu mút).'),C(''+(o.cnt+1),'Bạn đếm thừa một phần tử. Hãy kiểm tra đầu mút '+o.R+' (dấu < không lấy đầu mút).'),C(''+(o.cnt+2),'Bạn đếm thừa. Chỉ lấy các bội của '+o.m+' nằm trong khoảng đã cho.')],
    `Các bội của ${o.m} trong khoảng đó: ${LST(o.els)}. Có ${o.cnt} phần tử.`);
});}
function genUbSetSum(){return tryGen(()=>{const o=setData();
  return mk(`Cho ${nb(`M = {x ∈ ℤ | x ⋮ ${o.m} và ${o.txt}}`)}. Tổng các phần tử của M bằng:`,N(o.s),[C(N(-o.s),'Bạn đã đảo dấu của tổng.'),C(N(o.s+o.m),'Bạn đếm thừa hoặc thiếu một phần tử.'),C(N(o.s-o.m),'Bạn đếm thừa hoặc thiếu một phần tử.')],
    `M = {${LST(o.els)}}. Các cặp số đối nhau có tổng 0, phần còn lại cộng lại được ${N(o.s)}.`);
});}

/* --- tìm x, tìm n (SGK Bài 24, 27; tài liệu ổ D dạng 3, 4) --- */
function mulData(){const m=nz(2,12),x=nz(2,25);return {m,x,p:m*x};}
function genTxMul(){return tryGen(()=>{const {m,x,p}=mulData();
  return mk(`Tìm số nguyên x, biết ${nb(`${P(m)} · x = ${N(p)}`)}.`,N(x),[C(N(-x),E_DSGN),C(N(m*p),'Muốn tìm thừa số chưa biết, ta lấy tích chia cho thừa số đã biết.'),C(N(p-m),'Muốn tìm thừa số chưa biết, ta lấy tích chia cho thừa số đã biết.')],
    `${nb(`x = ${N(p)} : ${P(m)} = ${N(x)}`)}.`);
});}
function lin1Data(){const a=nz(2,15),x=nz(-9,12),c=ri(2,9),p=a*(x-c);if(x===0)return lin1Data();return {a,x,c,p,t:p/a,txt:nb(`${a} · (x − ${c}) = ${N(p)}`)};}
function genTxLin1(){return tryGen(()=>{const o=lin1Data();
  return mk(`Tìm số nguyên x, biết ${o.txt}.`,N(o.x),[C(N(o.t),`${o.t} là giá trị của x − ${o.c}, chưa phải x.`),C(N(o.t-o.c),`Từ x − ${o.c} = ${N(o.t)} suy ra x = ${N(o.t)} + ${o.c}, không phải ${N(o.t)} − ${o.c}.`),C(N(-o.x),'Bạn đã đảo dấu kết quả.')],
    `${nb(`x − ${o.c} = ${N(o.p)} : ${P(o.a)} = ${N(o.t)}`)}, suy ra ${nb(`x = ${N(o.t)} + ${o.c} = ${N(o.x)}`)}.`);
});}
function divEqData(){const q=nz(2,12),s=nz(2,20),c=ri(2,9),p=q*s,x=s-c;return {q,s,c,p,x,txt:nb(`${N(p)} : (x + ${c}) = ${N(q)}`)};}
function genTxDiv(){return tryGen(()=>{const o=divEqData();
  return mk(`Tìm số nguyên x, biết ${o.txt}.`,N(o.x),[C(N(o.s),`${N(o.s)} là giá trị của x + ${o.c}, chưa phải x.`),C(N(o.s+o.c),`Từ x + ${o.c} = ${N(o.s)} suy ra x = ${N(o.s)} − ${o.c}, không phải ${N(o.s)} + ${o.c}.`),C(N(-o.x),'Bạn đã đảo dấu kết quả.')],
    `Số chia: ${nb(`x + ${o.c} = ${N(o.p)} : ${P(o.q)} = ${N(o.s)}`)}, suy ra ${nb(`x = ${N(o.s)} − ${o.c} = ${N(o.x)}`)}.`);
});}
function lin2Data(){const a=nz(2,9),x=nz(-9,12),c=ri(1,6),d=ri(1,9),p=a*(x-c)-d;if(x===0)return lin2Data();const t=(p+d)/a;
  return {a,x,c,d,p,t,txt:nb(`${a} · (x − ${c}) − ${d} = ${N(p)}`)};}
function genTxLin2(){return tryGen(()=>{const o=lin2Data();
  return mk(`Tìm số nguyên x, biết ${o.txt}.`,N(o.x),[C(N(o.t),'Bạn quên cộng '+o.c+' sau khi tìm x − '+o.c+'.'),C(N(o.t-o.c),'Từ x − '+o.c+' = '+N(o.t)+' suy ra x = '+N(o.t)+' + '+o.c+'.'),C(N(-o.x),'Bạn đã đảo dấu kết quả.')],
    `${nb(`${o.a} · (x − ${o.c}) = ${N(o.p)} + ${o.d} = ${N(o.p+o.d)}`)}, nên ${nb(`x − ${o.c} = ${N(o.t)}`)} và ${nb(`x = ${N(o.t)} + ${o.c} = ${N(o.x)}`)}.`);
});}
const NEX=(c)=>`n ${c>=0?'+':'−'} ${ab(c)}`;
function nData(){const p=sgn()*sel([6,8,9,10,12,15]),c=nz(1,5),all=divsAll(p),ns=all.map(d=>d-c);
  return {p,c,all,ns,cnt:all.length,sum:ns.reduce((s,x)=>s+x,0)};}
function genTxN(){return tryGen(()=>{const o=nData(),isBoi=RNG()<.5,pos=divsP(o.p);
  const stem=isBoi?`Các số nguyên n sao cho ${N(o.p)} là bội của (${NEX(o.c)}) là:`:`Các số nguyên n sao cho (${NEX(o.c)}) là ước của ${N(o.p)} là:`;
  return mk(stem,LST(o.ns),[C(LST(pos.map(d=>d-o.c)),'(n + c) có thể là ước dương hoặc ước âm của '+N(o.p)+'. Hãy xét cả các ước âm.'),C(LST(o.all.map(d=>d+o.c)),`Từ n ${o.c>=0?'+':'−'} ${ab(o.c)} = d suy ra n = d ${o.c>=0?'−':'+'} ${ab(o.c)}.`),C(LST(o.all),`Đây là các ước của ${N(o.p)}, nhưng ${NEX(o.c)} mới là ước, nên phải tính n.`)],
    `${NEX(o.c)} là ước của ${N(o.p)} nên ${NEX(o.c)} ∈ {${LST(o.all)}}. Suy ra n ∈ {${LST(o.ns)}}.`);
});}
function genTxNCnt(){return tryGen(()=>{const o=nData();
  return mk(`Có bao nhiêu số nguyên n để (${NEX(o.c)}) là ước của ${N(o.p)}?`,''+o.cnt,[C(''+o.cnt/2,'Mỗi ước dương d còn có ước âm −d nên số ước gấp đôi.'),C(''+(o.cnt+1),'0 không là ước của số nào.'),C(''+(o.cnt-2),'Cả 1, −1 và '+ab(o.p)+', −'+ab(o.p)+' đều là ước của '+ab(o.p)+'.')],
    `${N(o.p)} có ${o.cnt} ước nguyên, mỗi ước cho đúng một giá trị của n. Vậy có ${o.cnt} số n.`);
});}
function plusData(){const k=sel([6,8,9,10,12,14,15]),d=divsP(k).length;return {k,d,cnt:2*d,vals:divsAll(k)};}
function genTxPlus(){return tryGen(()=>{const o=plusData();
  return mk(`Có bao nhiêu số nguyên x để ${nb(`x + ${o.k}`)} chia hết cho x?`,''+o.cnt,[C(''+o.d,'x có thể là ước âm hoặc ước dương của '+o.k+'.'),C(''+(o.cnt+1),'x khác 0 vì không chia cho 0.'),C(''+(o.cnt-2),'1, −1 và '+o.k+', −'+o.k+' đều thỏa mãn.')],
    `Vì x chia hết cho x nên x + ${o.k} chia hết cho x khi và chỉ khi ${o.k} chia hết cho x. Vậy x là ước của ${o.k}: ${LST(o.vals)}. Có ${o.cnt} số.`);
});}
function linDivData(){const a=ri(2,4),c=nz(1,3),r=sel([3,5,7,9,11,13,15]),b=r+a*c,all=divsAll(r),ns=all.map(d=>d-c);
  return {a,c,b,r,all,ns,cnt:all.length,sum:ns.reduce((s,x)=>s+x,0),txt:nb(`${a}n ${b>=0?'+':'−'} ${ab(b)}`)};}
function genTxLinDiv(){return tryGen(()=>{const o=linDivData();
  return mk(`Tìm các số nguyên n sao cho ${o.txt} chia hết cho ${nb(NEX(o.c))}. Các số n đó là:`,LST(o.ns),[C(LST(o.all.map(d=>d+o.c)),'Từ '+NEX(o.c)+' = d suy ra n = d '+(o.c>=0?'−':'+')+' '+ab(o.c)+'.'),C(LST(divsP(o.r).map(d=>d-o.c)),'Phải xét cả các ước âm của '+o.r+'.'),C(LST(o.all),'Đây là các ước của '+o.r+', nhưng '+NEX(o.c)+' mới là ước.')],
    `${nb(`${o.txt} = ${o.a} · (${NEX(o.c)}) + ${N(o.r)}`)}. Vì ${NEX(o.c)} chia hết cho ${NEX(o.c)} nên cần ${N(o.r)} chia hết cho ${NEX(o.c)}. Suy ra ${NEX(o.c)} ∈ {${LST(o.all)}}, tức n ∈ {${LST(o.ns)}}.`);
});}

/* --- vận dụng thực tế (SGK Bài 25, 28, 3.49, Ví dụ 2 luyện tập chung) --- */
function avgData(){for(;;){const n=sel([3,4,5,6]),avg=ri(-6,4),t=[];if(avg===0)continue;let s=0;for(let i=0;i<n-1;i++){const v=ri(-9,9);t.push(v);s+=v;}const last=n*avg-s;
  if(ab(last)>12||new Set(t.concat([last])).size<3)continue;t.push(last);const T=shuffle(t);
  return {n,avg,T,sum:n*avg,stem:`Nhiệt độ lúc 6 giờ sáng của ${n} ngày liên tiếp lần lượt là ${T.map(v=>N(v)+' °C').join('; ')}.`,
    exp:`Tổng nhiệt độ: ${nb(`${T.map((v,i)=>i?'+ '+P(v):N(v)).join(' ')} = ${N(n*avg)}`)} (°C). Nhiệt độ trung bình: ${DV(n*avg,n)} = ${N(avg)} (°C).`};}}
function genVdAvg(){return tryGen(()=>{const o=avgData();
  return mk(`${o.stem} Nhiệt độ trung bình lúc 6 giờ sáng của ${o.n} ngày đó là bao nhiêu °C?`,N(o.avg),[C(N(o.sum),`Đó mới là tổng các nhiệt độ, còn phải chia cho ${o.n}.`),C(N(-o.avg),E_DSGN),C(N(o.avg+sel([1,-1])),'Tính tổng sai. Hãy cộng lại từng số, chú ý dấu.')],o.exp);
});}
function debtData(){const n=ri(3,8),e=ri(5,40)*5,D=n*e;return {n,e,D,stem:`Một nhóm ${n} bạn cùng vay tổng cộng ${NN(D)} nghìn đồng để mua quà. Tiền nợ được ghi bằng số nguyên âm. Nếu chia đều số nợ cho các bạn thì số ghi của mỗi bạn là bao nhiêu nghìn đồng?`,
  exp:`Số nợ cả nhóm ghi là −${NN(D)} nghìn đồng. Mỗi bạn: ${nb(`(−${NN(D)}) : ${n} = −${NN(e)}`)} (nghìn đồng).`};}
function genVdDebt(){return tryGen(()=>{const o=debtData();
  return mk(o.stem,NN(-o.e),[C(NN(o.e),'Khoản nợ được ghi bằng số âm nên số ghi của mỗi bạn cũng là số âm.'),C(NN(-o.D*o.n),'Chia đều là phép chia, không phải phép nhân.'),C(NN(-o.D),'Đó là số nợ cả nhóm, còn phải chia đều cho '+o.n+' bạn.')],o.exp);
});}
function profitData(){for(;;){const a=ri(10,60),b=ri(10,60);if((b-a)%2||a===b)continue;const T=3*(b-a),avg=T/6;
  return {a,b,T,avg,stem:`Công ty Ánh Dương có lợi nhuận mỗi tháng của Quý I là −${a} triệu đồng, mỗi tháng của Quý II là ${b} triệu đồng. Sau 6 tháng đầu năm, lợi nhuận trung bình mỗi tháng của công ty là bao nhiêu triệu đồng (số âm là lỗ)?`,
    exp:`Tổng lợi nhuận: ${nb(`3 · (−${a}) + 3 · ${b} = ${N(-3*a)} + ${3*b} = ${N(T)}`)} (triệu đồng). Trung bình mỗi tháng: ${DV(T,6)} = ${N(avg)} (triệu đồng).`};}}
function genVdProfit(){return tryGen(()=>{const o=profitData();
  return mk(o.stem,N(o.avg),[C(N(o.T),'Đó là tổng lợi nhuận 6 tháng, còn phải chia cho 6.'),C(N(-o.avg),E_DSGN),C(N(o.avg*2),'Tổng của 6 tháng phải chia cho 6, bạn đã chia cho 3.')],o.exp);
});}
function wageData(){const g=sel([30000,40000,50000]),f=sel([5000,10000,20000]),c=ri(150,300),w=ri(3,12),val=c*g-w*f;
  return {g,f,c,w,val,stem:`Công nhân làm ra một sản phẩm đạt chất lượng thì được ${NN(g)} đồng, làm ra một sản phẩm không đạt thì bị phạt ${NN(f)} đồng. Tháng vừa qua một công nhân làm được ${c} sản phẩm đạt và ${w} sản phẩm không đạt. Công nhân đó được lĩnh bao nhiêu đồng?`,
    exp:`Tiền thưởng: ${nb(`${c} · ${NN(g)} = ${NN(c*g)}`)} (đồng). Tiền phạt: ${nb(`${w} · (−${NN(f)}) = −${NN(w*f)}`)} (đồng). Tiền lĩnh: ${nb(`${NN(c*g)} − ${NN(w*f)} = ${NN(val)}`)} (đồng).`};}
function genVdWage(){return tryGen(()=>{const o=wageData();
  return mk(o.stem,NN(o.val),[C(NN(o.c*o.g+o.w*o.f),'Sản phẩm không đạt bị phạt nên phải trừ đi, không cộng.'),C(NN(o.c*o.g),'Bạn quên trừ tiền phạt của các sản phẩm không đạt.'),C(NN(o.val-10*o.f),'Tính nhẩm sai khi nhân hoặc trừ.')],o.exp);
});}
function snailData(){const a=ri(3,6),b=ri(1,a-1),k=ri(3,8),H=k*(a-b)+a,n=ri(2,6);
  return {a,b,k,H,n,h:24*k+12,stem1:`Một con ốc sên leo cây. Mỗi ngày, ban ngày nó leo lên ${a} m rồi ban đêm tụt xuống ${b} m. Quy ước quãng đường leo lên là số dương, quãng đường tụt xuống là số âm. Sau ${n} ngày liên tiếp, ốc sên cách gốc cây bao nhiêu mét?`,
    exp1:`Mỗi ngày ốc sên đi được ${nb(`${a} + (−${b}) = ${a-b}`)} (m). Sau ${n} ngày: ${nb(`${n} · ${a-b} = ${n*(a-b)}`)} (m).`,
    stem2:`Một con ốc sên leo lên một cây cao ${H} m. Trong mỗi ngày (24 giờ), 12 giờ đầu ốc sên leo lên ${a} m, 12 giờ sau tụt xuống ${b} m. Lúc 0 giờ ốc sên ở gốc cây và bắt đầu leo lên. Sau bao nhiêu giờ thì ốc sên chạm tới ngọn cây?`,
    exp2:`Mỗi ngày ốc sên tiến thêm ${a-b} m. Sau ${k} ngày ốc sên cách gốc ${nb(`${k} · ${a-b} = ${k*(a-b)}`)} (m). Ngày thứ ${k+1}, trong 12 giờ đầu ốc sên leo thêm ${a} m và tới ${H} m, chạm ngọn. Thời gian: ${nb(`${k} · 24 + 12 = ${24*k+12}`)} (giờ).`};}
function genVdSnail(){return tryGen(()=>{const o=snailData();
  return mk(o.stem1,''+o.n*(o.a-o.b),[C(''+o.n*o.a,'Ban đêm ốc sên tụt xuống, phải trừ quãng đường tụt: '+o.a+' + (−'+o.b+').'),C(''+o.n*(o.a+o.b),'Quãng đường tụt xuống là số âm, phải cộng (−'+o.b+') chứ không cộng '+o.b+'.'),C(''+(o.n*(o.a-o.b)+o.a),'Chỉ tính '+o.n+' ngày trọn vẹn, không cộng thêm quãng đường leo của ngày sau.')],o.exp1);
});}

/* ============ Chủ đề ============ */
const TOPICS={
  ch:{short:'Phép chia hết',name:'Phép chia hết trong tập số nguyên',rule:'Với a, b ∈ ℤ, b ≠ 0: nếu có số nguyên q sao cho a = b · q thì a : b = q và ta nói a chia hết cho b. Thương của hai số cùng dấu là số dương, thương của hai số khác dấu là số âm: (−12) : (−3) = 4, 12 : (−3) = −4. Số 0 chia cho số khác 0 bằng 0, không chia cho 0.',tip:'Hay nhầm dấu của thương: cùng dấu thì dương, khác dấu thì âm. Chia hết chỉ khi tìm được số nguyên q.'},
  ub:{short:'Ước và bội',name:'Ước và bội của một số nguyên',rule:'Nếu a chia hết cho b thì a là một bội của b và b là một ước của a. Nếu a là một bội của b thì −a cũng là một bội của b; nếu b là một ước của a thì −b cũng là một ước của a. Muốn tìm tất cả các ước của a, lấy các ước dương của a cùng với các số đối của chúng. Ước chung của a và b là số vừa là ước của a vừa là ước của b.',tip:'Số nguyên có cả ước âm và ước dương (ước của 6 là −6; −3; −2; −1; 1; 2; 3; 6). Số 0 không là ước của số nào, nhưng là bội của mọi số khác 0.'},
  tx:{short:'Tìm x, tìm n',name:'Tìm số nguyên x, n thỏa mãn điều kiện',rule:'Muốn tìm thừa số chưa biết, lấy tích chia cho thừa số đã biết: từ a · x = p suy ra x = p : a. Muốn tìm số chia, lấy số bị chia chia cho thương. Điều kiện (n + c) là ước của p, hoặc p là bội của (n + c): liệt kê các ước của p (cả âm và dương) rồi tìm n. Nếu a ⋮ c và b ⋮ c thì (a + b) ⋮ c và (a − b) ⋮ c.',tip:'Sau khi tìm được giá trị của biểu thức trong ngoặc, đừng quên bước tìm x hoặc n. Với điều kiện ước, nhớ xét cả các ước âm.'},
  vd:{short:'Vận dụng thực tế',name:'Vận dụng vào bài toán thực tế',rule:'Số âm dùng để ghi khoản nợ, khoản lỗ, nhiệt độ dưới 0 °C, quãng đường đi xuống. Trung bình cộng bằng tổng các số chia cho số số hạng; chia đều một khoản nợ cho n người là (−D) : n. Viết thành biểu thức rồi tính, chú ý dấu của tích và của thương.',tip:'Đọc kĩ đề để biết đại lượng nào là số âm, tính tổng trước rồi mới chia để lấy trung bình.'}
};
const TKEYS=['ch','ub','tx','vd'];
const TDESC={ch:'Thực hiện phép chia hết, dấu của thương, so sánh thương',ub:'Tìm ước, bội, ước chung, liệt kê tập hợp các bội',tx:'Tìm x từ phép nhân, phép chia; tìm n để a là bội, là ước',vd:'Nhiệt độ trung bình, nợ chia đều, lợi nhuận, thưởng phạt, ốc sên'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhớ định nghĩa chia hết, ước, bội, dấu của thương, chia hai số nguyên một bước.',TH:'Tính thương, tìm ước và bội, tìm x trong phép nhân và phép chia, tính trung bình, bài toán thực tế một đến hai bước.',VD:'Tìm n để một biểu thức là ước, tính tổng các phần tử của tập hợp, bài toán thực tế nhiều bước.'};

/* ============ Ngân hàng nhiều lựa chọn ============ */
const MC=[
 {id:'m1',topic:'ch',level:'NB',stem:'Với a, b ∈ ℤ, b ≠ 0, ta nói a chia hết cho b khi:',ans:0,opts:[
   O('có số nguyên q sao cho a = b · q'),O('có số nguyên q sao cho b = a · q','Đây là điều kiện để b chia hết cho a.'),O('a lớn hơn b','Chia hết không liên quan đến việc số nào lớn hơn.'),O('a + b là số chẵn','Chia hết được định nghĩa bằng tích a = b · q.')],
  exp:'Nếu có số nguyên q sao cho a = b · q thì a : b = q, ta nói a chia hết cho b. Ví dụ 12 = (−3) · (−4) nên 12 chia hết cho −3.'},
 {id:'m2',topic:'ch',level:'NB',stem:'Thương của hai số nguyên khác dấu (khi chia hết) là:',ans:0,opts:[
   O('một số nguyên âm'),O('một số nguyên dương','Hai số khác dấu thì thương âm. Ví dụ 12 : (−3) = −4.'),O('bằng 0','Thương bằng 0 chỉ khi số bị chia bằng 0.'),O('có thể âm, có thể dương','Hai số khác dấu thì thương luôn là số âm.')],
  exp:'Thương của hai số nguyên cùng dấu là số dương, của hai số khác dấu là số âm.'},
 {id:'m3',topic:'ch',level:'NB',stem:'Từ '+nb('12 : 3 = 4')+', suy ra đẳng thức nào sau đây đúng?',ans:0,opts:[
   O(nb('12 : (−3) = −4')),O(nb('(−12) : 3 = 4'),'Hai số khác dấu thì thương âm: (−12) : 3 = −4.'),O(nb('(−12) : (−3) = −4'),'Hai số cùng dấu thì thương dương: (−12) : (−3) = 4.'),O(nb('12 : (−3) = 4'),'Hai số khác dấu thì thương âm.')],
  exp:'Độ lớn của thương không đổi, chỉ có dấu thay đổi: 12 : (−3) = −4; (−12) : 3 = −4; (−12) : (−3) = 4.'},
 {id:'m4',topic:'ub',level:'NB',stem:'Khi a chia hết cho b (a, b ∈ ℤ, b ≠ 0), ta nói:',ans:0,opts:[
   O('a là một bội của b và b là một ước của a'),O('a là một ước của b và b là một bội của a','Ngược lại: bội là số bị chia, ước là số chia.'),O('a và b đều là ước của nhau','Chỉ có b là ước của a; a là bội của b.'),O('a và b đều là bội của nhau','Chỉ có a là bội của b; b là ước của a.')],
  exp:'Ví dụ (−35) chia hết cho (−7) nên −35 là một bội của −7 và −7 là một ước của −35.'},
 {id:'m5',topic:'ub',level:'NB',stem:'Nếu a là một bội của b thì:',ans:0,opts:[
   O('−a cũng là một bội của b'),O('−a không là bội của b','Nếu a = b · q thì −a = b · (−q).'),O('a + 1 cũng là một bội của b','Chỉ a và các số đối a, −a hay tích với số nguyên mới là bội của b.'),O('b là một bội của a','Ví dụ 6 là bội của 3 nhưng 3 không là bội của 6.')],
  exp:'Nếu a = b · q thì −a = b · (−q) nên −a cũng là bội của b.'},
 {id:'m6',topic:'ub',level:'NB',stem:'Hai số nguyên nào sau đây là ước của mọi số nguyên?',ans:0,opts:[
   O('1 và −1'),O('0 và 1','0 không là ước của số nào vì không chia được cho 0.'),O('0 và −1','0 không là ước của số nào vì không chia được cho 0.'),O('1 và 10','Số 7 không chia hết cho 10 nên 10 không là ước của mọi số.')],
  exp:'a = 1 · a = (−1) · (−a) với mọi a, nên 1 và −1 là ước của mọi số nguyên a.'},
 {id:'m7',topic:'ub',level:'TH',stem:'Các ước chung của 6 và 4 là:',ans:0,opts:[
   O('−2; −1; 1; 2'),O('1; 2','Ước chung cũng gồm các số âm −1 và −2.'),O('−4; −2; −1; 1; 2; 4','4 là ước của 4 nhưng không là ước của 6.'),O('−6; −4; −3; −2; −1; 1; 2; 3; 4; 6','Ước chung phải là ước của cả hai số, đây là các ước của 6 và các ước của 4 gộp lại.')],
  exp:'Các ước của 6: ±1; ±2; ±3; ±6. Các ước của 4: ±1; ±2; ±4. Các số xuất hiện ở cả hai: −2; −1; 1; 2.'},
 {id:'m8',topic:'ub',level:'TH',stem:'Các bội của 7 là:',ans:0,opts:[
   O('0; 7; −7; 14; −14; 21; −21; …'),O('7; 14; 21; …','Thiếu số 0 và các bội âm −7; −14; …'),O('0; 7; 14; 21; …','Thiếu các bội âm: nếu a là bội của 7 thì −a cũng là bội của 7.'),O('1; 7; 49; 343; …','Bội của 7 là các số 7 · k với k nguyên, không phải lũy thừa của 7.')],
  exp:'Các bội của 7 là 7 · k với k ∈ ℤ: 0; ±7; ±14; ±21; …'},
 {id:'m9',topic:'tx',level:'TH',stem:'Số nguyên x thỏa mãn '+nb('15 · (x − 3) = −75')+' là:',ans:0,opts:[
   O('−2'),O('−5','−5 là giá trị của x − 3, chưa phải x.'),O('−8','Từ x − 3 = −5 suy ra x = −5 + 3, không phải −5 − 3.'),O('2','Bạn đã đảo dấu kết quả.')],
  exp:'x − 3 = (−75) : 15 = −5. Suy ra x = −5 + 3 = −2.'},
 {id:'m10',topic:'ch',level:'VD',stem:'Có hai số nguyên a, b khác nhau mà a chia hết cho b và b chia hết cho a. Khẳng định nào sau đây đúng?',ans:0,opts:[
   O('a và b là hai số đối nhau'),O('a = b','Đề cho a, b khác nhau.'),O('a = 2b','Nếu a = 2b thì b chia hết cho a chỉ khi b = a · q, không có số nguyên q nào (trừ b = 0).'),O('Không có hai số như vậy','Ví dụ a = 5, b = −5: 5 = (−5) · (−1) và −5 = 5 · (−1).')],
  exp:'a = b · q và b = a · q′ nên q · q′ = 1, tức q = 1 hoặc q = −1. Vì a ≠ b nên q = −1, tức a = −b. Ví dụ 5 và −5.'},
 {id:'m11',topic:'ch',level:'TH',stem:'Biết 12 và 21 đều chia hết cho −3. Khẳng định nào sau đây đúng?',ans:0,opts:[
   O('Tổng 12 + 21 và hiệu 12 − 21 đều chia hết cho −3'),O('Chỉ tổng 12 + 21 chia hết cho −3','Hiệu 12 − 21 = −9 cũng chia hết cho −3.'),O('Chỉ hiệu 12 − 21 chia hết cho −3','Tổng 12 + 21 = 33 cũng chia hết cho −3.'),O('Tổng và hiệu đều không chia hết cho −3','12 + 21 = 33 = (−3) · (−11) nên chia hết cho −3.')],
  exp:'Nếu a = (−3) · m và b = (−3) · n thì a + b = (−3) · (m + n) và a − b = (−3) · (m − n). Vậy tổng và hiệu đều chia hết cho −3.'},
 {id:'m12',topic:'ub',level:'NB',stem:'Phát biểu nào sau đây đúng?',ans:0,opts:[
   O('Số 0 là một bội của mọi số nguyên khác 0'),O('Số 0 là ước của mọi số nguyên','Không thể chia cho 0 nên 0 không là ước của số nào.'),O('Số 0 không là bội của số nào','0 = b · 0 nên 0 là bội của mọi số nguyên b khác 0.'),O('Số 1 là bội của mọi số nguyên','1 chỉ là bội của 1 và −1.')],
  exp:'0 = b · 0 với mọi b ≠ 0, nên 0 là bội của mọi số nguyên khác 0.'},
 {id:'m13',topic:'vd',level:'TH',stem:'Nhiệt độ lúc 8 giờ sáng trong 5 ngày liên tiếp lần lượt là −6 °C; −5 °C; −4 °C; 2 °C; 3 °C. Nhiệt độ trung bình lúc 8 giờ sáng của 5 ngày đó là:',ans:0,opts:[
   O('−2 °C'),O('−10 °C','Đó là tổng nhiệt độ, còn phải chia cho 5.'),O('2 °C','Tổng là −10 nên trung bình là số âm.'),O('−3 °C','Tính tổng sai: −6 − 5 − 4 + 2 + 3 = −10.')],
  exp:'Tổng: (−6) + (−5) + (−4) + 2 + 3 = −10. Trung bình: (−10) : 5 = −2 (°C).'},
 {id:'m14',topic:'tx',level:'VD',stem:'Số nguyên x thỏa mãn '+nb('−64 : (−2x + 6) = 4')+' là:',ans:0,opts:[
   O('11'),O('−11','Từ −2x = −22 suy ra x = (−22) : (−2) = 11.'),O('5','Sai khi tính −2x + 6 = −16, hãy tính lại: (−64) : 4 = −16.'),O('−5','Sai dấu khi tìm x từ −2x = −22.')],
  exp:'Số chia: −2x + 6 = (−64) : 4 = −16. Suy ra −2x = −16 − 6 = −22 và x = (−22) : (−2) = 11.'},
 {id:'m15',topic:'tx',level:'VD',stem:'Các số nguyên a sao cho (a + 3) là ước của 7 là:',ans:0,opts:[
   O('−10; −4; −2; 4'),O('−7; −1; 1; 7','Đây là các ước của 7, nhưng a + 3 mới là ước nên phải tìm a.'),O('−10; −4; −2','Bỏ sót ước dương 7: a + 3 = 7 cho a = 4.'),O('−7; −1','Phải xét cả các ước dương 1 và 7.')],
  exp:'a + 3 ∈ {−7; −1; 1; 7} nên a ∈ {−10; −4; −2; 4}.'},
 {id:'m16',topic:'vd',level:'TH',stem:'Một xí nghiệp may gia công thưởng 50 nghìn đồng cho mỗi sản phẩm tốt và phạt 40 nghìn đồng cho mỗi sản phẩm có lỗi. Chị Lan làm được 45 sản phẩm tốt và 5 sản phẩm có lỗi. Số tiền chị Lan nhận được (đơn vị: nghìn đồng) là:',ans:0,opts:[
   O('2 050'),O('2 250','Bạn quên trừ tiền phạt của các sản phẩm có lỗi.'),O('2 500','Tiền phạt phải trừ đi, không cộng thêm.'),O('−2 050','Bạn đã đảo dấu kết quả.')],
  exp:'45 · 50 + 5 · (−40) = 2 250 − 200 = 2 050 (nghìn đồng).'},
 {id:'m17',topic:'ch',level:'TH',stem:'Trong các phát biểu sau, phát biểu nào đúng?',ans:0,opts:[
   O('234 chia hết cho (−6)'),O('−135 chia hết cho 13','−135 không là bội của 13 vì 13 · 10 = 130 và 13 · 11 = 143.'),O('137 chia hết cho (−7)','137 không là bội của 7 vì 7 · 19 = 133 và 7 · 20 = 140.'),O('−234 chia hết cho 35','−234 không là bội của 35 vì 35 · 6 = 210 và 35 · 7 = 245.')],
  exp:'234 = (−6) · (−39) nên 234 chia hết cho −6.'},
 {id:'m18',topic:'tx',level:'VD',stem:'Biết '+nb('(−5) · x = 15')+' và '+nb('22 · y = −44')+'. Giá trị của x + y là:',ans:0,opts:[
   O('−5'),O('1','Bạn đã tính sai dấu của x: x = 15 : (−5) = −3.'),O('−1','Bạn đã tính sai dấu của y: y = (−44) : 22 = −2.'),O('5','Bạn đã đảo dấu kết quả.')],
  exp:'x = 15 : (−5) = −3; y = (−44) : 22 = −2. Vậy x + y = (−3) + (−2) = −5.'}
].map(q=>Object.assign({type:'mc'},q));
const addMC=(id,topic,level,gen)=>MC.push({id,type:'mc',topic,level,gen});
const rep=(n,f)=>[...Array(n).keys()].map(i=>f('abcdef'[i]));
rep(2,x=>addMC('g_chsign_'+x,'ch','NB',genChSign));
rep(3,x=>addMC('g_ubis_'+x,'ub','NB',genUbIs));
rep(2,x=>addMC('g_ubmult_'+x,'ub','NB',genUbMult));
rep(2,x=>addMC('g_vddebt_'+x,'vd','NB',genVdDebt));
rep(3,x=>addMC('g_chdiv_'+x,'ch',x==='c'?'TH':'NB',genChDiv));
rep(2,x=>addMC('g_chfrom_'+x,'ch','TH',genChFrom));
rep(3,x=>addMC('g_chstmt_'+x,'ch','TH',genChStmt));
rep(2,x=>addMC('g_chexpr_'+x,'ch','TH',genChExpr));
rep(2,x=>addMC('g_chcmp_'+x,'ch','NB',genChCmp));
rep(3,x=>addMC('g_ublist_'+x,'ub','TH',genUbList));
rep(2,x=>addMC('g_ubcommon_'+x,'ub','TH',genUbCommon));
rep(2,x=>addMC('g_ubcntmult_'+x,'ub','TH',genUbCntMult));
rep(2,x=>addMC('g_ubcntdiv_'+x,'ub','TH',genUbCntDiv));
rep(2,x=>addMC('g_ubsetcnt_'+x,'ub','TH',genUbSetCnt));
rep(2,x=>addMC('g_txmul_'+x,'tx','NB',genTxMul));
rep(3,x=>addMC('g_txlin1_'+x,'tx','TH',genTxLin1));
rep(2,x=>addMC('g_txdiv_'+x,'tx','TH',genTxDiv));
rep(3,x=>addMC('g_vdavg_'+x,'vd','TH',genVdAvg));
rep(2,x=>addMC('g_vdwage_'+x,'vd','TH',genVdWage));
rep(2,x=>addMC('g_vdsnail_'+x,'vd','TH',genVdSnail));
rep(2,x=>addMC('g_ubsetsum_'+x,'ub','VD',genUbSetSum));
rep(2,x=>addMC('g_txlin2_'+x,'tx','VD',genTxLin2));
rep(3,x=>addMC('g_txn_'+x,'tx','VD',genTxN));
rep(2,x=>addMC('g_txncnt_'+x,'tx','VD',genTxNCnt));
rep(2,x=>addMC('g_txplus_'+x,'tx','VD',genTxPlus));
rep(2,x=>addMC('g_txlindiv_'+x,'tx','VD',genTxLinDiv));
rep(2,x=>addMC('g_vdprofit_'+x,'vd','VD',genVdProfit));

/* ============ Đúng sai ============ */
function tfDivQ(){const {a,b,q}=divData(),t=RNG()<.5,shown=t?q:sel([-q,q+sel([1,-1,2]),a*b].filter(v=>v!==q));
  return IT(`${DV(a,b)} = ${N(shown)}`,t,'ch','TH',divWhy(a,b,q).replace(/\.$/,'')+(t?'.':`, không phải ${N(shown)}.`));}
function tfDivBy(){const s=divStmt();
  return IT(s.t+'.',s.v,'ch','TH',s.v?`${N(s.a)} = ${P(s.b)} · ${P(s.a/s.b)} nên chia hết.`:`${ab(s.a)} không chia hết cho ${ab(s.b)} nên ${N(s.a)} không chia hết cho ${N(s.b)}.`);}
function tfUoc(){const n=sgn()*sel(SMALLN),t=RNG()<.5;let d;
  if(t)d=sel(divsAll(n));else{do{d=nz(2,ab(n));}while(n%d===0);}
  return IT(`${N(d)} là một ước của ${N(n)}.`,t,'ub','TH',t?`${DV(n,d)} = ${N(n/d)} nên ${N(d)} là ước của ${N(n)}.`:`${N(n)} không chia hết cho ${N(d)} nên ${N(d)} không là ước của ${N(n)}.`);}
function tfBoi(){const n=nz(3,15),t=RNG()<.5,k=nz(2,12),m=t?n*k:n*k+sel([1,-1,2,-2]);
  return IT(`${N(m)} là một bội của ${N(n)}.`,t,'ub','TH',t?`${N(m)} = ${P(n)} · ${P(k)} nên là một bội của ${N(n)}.`:`${N(m)} không chia hết cho ${N(n)} nên không là bội của ${N(n)}.`);}
function tfCommon(){const d=nz(2,9),a=d*nz(2,9),t=RNG()<.5;let b;
  if(t)b=d*nz(2,9);else{do{b=nz(5,60);}while(b%d===0);}
  return IT(`${N(d)} là ước chung của ${N(a)} và ${N(b)}.`,t,'ub','VD',t?`${DV(a,d)} = ${N(a/d)} và ${DV(b,d)} = ${N(b/d)}, nên ${N(d)} là ước của cả hai số.`:`${N(d)} là ước của ${N(a)} nhưng ${N(b)} không chia hết cho ${N(d)}, nên ${N(d)} không là ước chung.`);}
function tfTx(){const {m,x,p}=mulData(),t=RNG()<.5,shown=t?x:sel([-x,x+sel([1,-1,2]),p*m].filter(v=>v!==x));
  return IT(`${nb(`x = ${N(shown)}`)} thỏa mãn ${nb(`${P(m)} · x = ${N(p)}`)}.`,t,'tx','TH',`${nb(`x = ${N(p)} : ${P(m)} = ${N(x)}`)}${t?'.':`, không phải ${N(shown)}.`}`);}
function tfNVal(){const o=nData(),t=RNG()<.5,v=t?sel(o.ns):sel(o.all.concat([0,1,2]).filter(x=>!o.ns.includes(x))),w=v+o.c;
  return IT(`${nb(`n = ${N(v)}`)} thỏa mãn (${NEX(o.c)}) là ước của ${N(o.p)}.`,t,'tx','VD',`Với ${nb(`n = ${N(v)}`)} thì ${NEX(o.c)} = ${N(w)}. ${t?`${N(w)} là ước của ${N(o.p)}.`:`${N(o.p)} không chia hết cho ${N(w)}${w===0?' (không chia cho 0)':''}, nên ${N(w)} không là ước của ${N(o.p)}.`}`);}
function tfPlus(){const o=plusData(),t=RNG()<.5;let v;if(t)v=sel(o.vals);else{do{v=nz(2,o.k+3);}while(o.k%v===0);}
  return IT(`${nb(`x = ${N(v)}`)} thỏa mãn ${nb(`x + ${o.k}`)} chia hết cho x.`,t,'tx','VD',t?`${nb(`x + ${o.k} = ${N(v+o.k)}`)}, và ${N(v+o.k)} chia hết cho ${N(v)} vì ${o.k} chia hết cho ${N(v)}.`:`${N(v+o.k)} không chia hết cho ${N(v)} vì ${o.k} không chia hết cho ${N(v)}.`);}
const PTV=[IT('Nếu a chia hết cho b và b chia hết cho c (b, c ≠ 0) thì a chia hết cho c.',true,'ch','VD','a = b · m, b = c · n nên a = c · (n · m).'),
  IT('Hai số đối nhau (khác 0) chia hết cho nhau.',true,'ch','VD','a = (−a) · (−1) nên a chia hết cho −a và ngược lại.'),
  IT('Nếu a chia hết cho 5 và b chia hết cho 5 thì a − b chia hết cho 5.',true,'ch','VD','a = 5m, b = 5n nên a − b = 5(m − n).'),
  IT('Nếu a chia hết cho b thì −a chia hết cho −b (b ≠ 0).',true,'ch','VD','a = b · q nên −a = (−b) · q.'),
  IT('Nếu a chia hết cho b thì tích a · c chia hết cho b với mọi số nguyên c.',true,'ch','VD','a = b · q nên a · c = b · (q · c).')];
const PFV=[IT('Nếu a + b chia hết cho 6 thì cả a và b đều chia hết cho 6.',false,'ch','VD','Ví dụ 4 + 8 = 12 chia hết cho 6 nhưng 4 và 8 không chia hết cho 6.'),
  IT('Nếu a chia hết cho b thì b chia hết cho a.',false,'ch','VD','Ví dụ 6 chia hết cho 3 nhưng 3 không chia hết cho 6.'),
  IT('Tích của hai số nguyên chia hết cho 4 thì chỉ có thể chia hết cho 8.',false,'ch','VD','Ví dụ 4 · 4 = 16 nhưng 4 · 1 = 4 chia hết cho 4 mà không chia hết cho 8.'),
  IT('Thương của hai số nguyên âm chia hết là một số nguyên âm.',false,'ch','VD','Hai số cùng dấu thì thương dương.'),
  IT('Nếu a chia hết cho 2 và b chia hết cho 3 thì a + b chia hết cho 6.',false,'ch','VD','Ví dụ 4 + 3 = 7 không chia hết cho 6.')];
const tfChVD=()=>({stem:'Xét các phát biểu sau:',items:pick4(PTV,PFV)});
const PT={
 ch:[IT('Với a, b ∈ ℤ, b ≠ 0: nếu a = b · q với q ∈ ℤ thì a chia hết cho b.',true,'ch','NB','Đó là định nghĩa phép chia hết.'),
     IT('Thương của hai số nguyên cùng dấu (khi chia hết) là một số nguyên dương.',true,'ch','NB','Ví dụ (−12) : (−3) = 4.'),
     IT('Thương của hai số nguyên khác dấu (khi chia hết) là một số nguyên âm.',true,'ch','NB','Ví dụ 12 : (−3) = −4.'),
     IT(nb('(−12) : (−3) = 4'),true,'ch','NB','Hai số cùng dấu nên thương dương.'),
     IT(nb('0 : 5 = 0'),true,'ch','NB','0 = 5 · 0 nên 0 : 5 = 0.')],
 ub:[IT('Nếu a chia hết cho b thì a là một bội của b.',true,'ub','NB','Khi a chia hết cho b ta gọi a là bội của b.'),
     IT('1 và −1 là ước của mọi số nguyên.',true,'ub','NB','a = 1 · a = (−1) · (−a).'),
     IT('Nếu 6 là một ước của a thì −6 cũng là một ước của a.',true,'ub','NB','Nếu b là ước của a thì −b cũng là ước của a.'),
     IT('−35 là một bội của −7.',true,'ub','NB','(−35) : (−7) = 5.'),
     IT('3 là một ước của −12.',true,'ub','NB','(−12) : 3 = −4.')],
 tx:[IT(nb('x = −12')+' thỏa mãn '+nb('(−3) · x = 36')+'.',true,'tx','NB','(−3) · (−12) = 36.'),
     IT(nb('x = −5')+' thỏa mãn '+nb('4 · x = −20')+'.',true,'tx','NB','4 · (−5) = −20.'),
     IT('Từ '+nb('a · x = p')+' (a ≠ 0) suy ra '+nb('x = p : a')+'.',true,'tx','NB','Muốn tìm thừa số chưa biết, lấy tích chia cho thừa số đã biết.'),
     IT(nb('x = 15')+' thỏa mãn '+nb('(−100) : (x + 5) = −5')+'.',true,'tx','NB','x + 5 = 20 và (−100) : 20 = −5.'),
     IT(nb('x = −2')+' thỏa mãn '+nb('15 · (x − 3) = −75')+'.',true,'tx','NB','15 · (−5) = −75.')],
 vd:[IT('Nhiệt độ trung bình của các ngày −6 °C; −5 °C; −4 °C; 2 °C; 3 °C là −2 °C.',true,'vd','NB','Tổng là −10, chia cho 5 được −2.'),
     IT('Nợ chung 60 nghìn đồng chia đều cho 3 người thì mỗi người ghi −20 nghìn đồng.',true,'vd','NB','(−60) : 3 = −20.'),
     IT('Quãng đường tụt xuống 2 m được ghi là −2 m.',true,'vd','NB','Đi xuống được ghi bằng số âm.'),
     IT('Mỗi tháng lỗ 30 triệu đồng thì lợi nhuận 3 tháng là −90 triệu đồng.',true,'vd','NB','3 · (−30) = −90.'),
     IT('Muốn tính trung bình của các số, ta lấy tổng chia cho số các số.',true,'vd','NB','Đó là cách tính trung bình cộng.')]};
const PF={
 ch:[IT('Không thể chia một số nguyên âm cho một số nguyên âm.',false,'ch','NB','Ví dụ (−12) : (−3) = 4.'),
     IT(nb('(−12) : 3 = 4'),false,'ch','NB','Hai số khác dấu nên thương âm: (−12) : 3 = −4.'),
     IT(nb('(−12) : (−3) = −4'),false,'ch','NB','Hai số cùng dấu nên thương dương: (−12) : (−3) = 4.'),
     IT('Thương của hai số nguyên âm là một số nguyên âm.',false,'ch','NB','Thương của hai số cùng dấu là số dương.'),
     IT('Có thể thực hiện phép chia cho số 0.',false,'ch','NB','Không có phép chia cho 0.')],
 ub:[IT('0 là ước của mọi số nguyên.',false,'ub','NB','Không chia được cho 0 nên 0 không là ước của số nào.'),
     IT('Tất cả các ước của 6 chỉ gồm 1; 2; 3; 6.',false,'ub','NB','Còn các ước âm −1; −2; −3; −6.'),
     IT('5 là một bội của 10.',false,'ub','NB','5 không chia hết cho 10.'),
     IT('Nếu a là một bội của b thì −a không là bội của b.',false,'ub','NB','Nếu a = b · q thì −a = b · (−q).'),
     IT('Số nguyên âm không có ước.',false,'ub','NB','Ví dụ −6 có các ước ±1; ±2; ±3; ±6.')],
 tx:[IT(nb('x = 12')+' thỏa mãn '+nb('(−3) · x = 36')+'.',false,'tx','NB','(−3) · 12 = −36, phải là x = −12.'),
     IT(nb('x = −5')+' thỏa mãn '+nb('4 · x = 20')+'.',false,'tx','NB','4 · (−5) = −20, phải là x = 5.'),
     IT('Từ '+nb('a · x = p')+' (a ≠ 0) suy ra '+nb('x = p · a')+'.',false,'tx','NB','Phải lấy tích chia cho a: x = p : a.'),
     IT(nb('x = 5')+' thỏa mãn '+nb('(−100) : (x + 5) = −5')+'.',false,'tx','NB','(−100) : 10 = −10, phải là x = 15.'),
     IT(nb('x = 2')+' thỏa mãn '+nb('15 · (x − 3) = −75')+'.',false,'tx','NB','15 · (−1) = −15, phải là x = −2.')],
 vd:[IT('Nhiệt độ trung bình của các ngày −6 °C; −5 °C; −4 °C; 2 °C; 3 °C là 2 °C.',false,'vd','NB','Tổng là −10, trung bình là −2.'),
     IT('Nợ chung 60 nghìn đồng chia đều cho 3 người thì mỗi người ghi 20 nghìn đồng.',false,'vd','NB','Nợ ghi bằng số âm: (−60) : 3 = −20.'),
     IT('Quãng đường tụt xuống 2 m được ghi là 2 m.',false,'vd','NB','Tụt xuống được ghi là −2 m.'),
     IT('Mỗi tháng lỗ 30 triệu đồng thì lợi nhuận 3 tháng là 90 triệu đồng.',false,'vd','NB','Lỗ là số âm: 3 · (−30) = −90.'),
     IT('Muốn tính trung bình của các số, ta nhân tổng các số với số các số.',false,'vd','NB','Phải chia tổng cho số các số.')]};
const tfNB=k=>()=>({stem:'Xét các phát biểu sau:',items:pick4(PT[k],PF[k])});
function tfCtx(make){return ()=>{
  for(let n=0;n<60;n++){const q=make(),k=q.items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(q.items.map(i=>i.t)).size===4)return q;}
  return FB_TF();};}
function ctxAvg(){const o=avgData(),v=[0,1,2,3].map(()=>RNG()<.5),lo=Math.min(...o.T),hi=Math.max(...o.T),k=o.T.filter(t=>t<o.avg).length;
  return {stem:o.stem,items:[
    IT(`Tổng các nhiệt độ của ${o.n} ngày là ${N(v[0]?o.sum:o.sum+sel([-2,2,5]))} °C.`,v[0],'vd','TH',`${nb(o.T.map((t,i)=>i?'+ '+P(t):N(t)).join(' '))} = ${N(o.sum)} (°C).`),
    IT(`Nhiệt độ trung bình của ${o.n} ngày là ${N(v[1]?o.avg:-o.avg)} °C.`,v[1],'vd','TH',`${DV(o.sum,o.n)} = ${N(o.avg)} (°C).`),
    IT(`Có ${v[2]?k:k+1} ngày nhiệt độ thấp hơn nhiệt độ trung bình.`,v[2],'vd','VD',`Nhiệt độ trung bình là ${N(o.avg)} °C. Các ngày thấp hơn mức đó: ${o.T.filter(t=>t<o.avg).map(N).join('; ')||'không có'}. Có ${k} ngày.`),
    IT(`Ngày nóng nhất cao hơn ngày lạnh nhất ${v[3]?hi-lo:hi-lo+2} °C.`,v[3],'vd','VD',`${nb(`${N(hi)} − ${P(lo)} = ${hi-lo}`)} (°C).`)]};}
function ctxSnail(){const o=snailData(),v=[0,1,2,3].map(()=>RNG()<.5);
  return {stem:`Một con ốc sên leo lên một cây cao ${o.H} m. Mỗi ngày (24 giờ), 12 giờ đầu ốc sên leo lên ${o.a} m, 12 giờ sau tụt xuống ${o.b} m. Lúc 0 giờ ốc sên ở gốc cây và bắt đầu leo lên.`,items:[
    IT(`Sau mỗi ngày (leo rồi tụt) ốc sên tiến thêm ${v[0]?o.a-o.b:o.a+o.b} m.`,v[0],'vd','TH',`${nb(`${o.a} + (−${o.b}) = ${o.a-o.b}`)} (m).`),
    IT(`Sau ${o.k} ngày đầu ốc sên cách gốc cây ${v[1]?o.k*(o.a-o.b):o.k*o.a-o.b} m.`,v[1],'vd','TH',`${nb(`${o.k} · ${o.a-o.b} = ${o.k*(o.a-o.b)}`)} (m).`),
    IT(`Ốc sên chạm tới ngọn cây sau ${v[2]?24*o.k+12:24*(o.k+1)} giờ.`,v[2],'vd','VD',`Sau ${o.k} ngày ốc sên cách gốc ${o.k*(o.a-o.b)} m; ngày thứ ${o.k+1} nó leo thêm ${o.a} m trong 12 giờ đầu và đến ${o.H} m. Thời gian: ${nb(`${o.k} · 24 + 12 = ${24*o.k+12}`)} giờ.`),
    IT(`Sau ${o.k} ngày đầu, ốc sên còn cách ngọn cây ${v[3]?o.a:o.a+o.b} m.`,v[3],'vd','VD',`Cây cao ${o.H} m, ốc sên ở độ cao ${o.k*(o.a-o.b)} m nên còn cách ngọn ${nb(`${o.H} − ${o.k*(o.a-o.b)} = ${o.a}`)} (m).`)]};}
function ctxWage(){const o=wageData(),v=[0,1,2,3].map(()=>RNG()<.5);
  return {stem:o.stem.replace(' Công nhân đó được lĩnh bao nhiêu đồng?',''),items:[
    IT(`Tiền thưởng của các sản phẩm đạt là ${NN(v[0]?o.c*o.g:o.c*o.g+o.g)} đồng.`,v[0],'vd','TH',`${nb(`${o.c} · ${NN(o.g)} = ${NN(o.c*o.g)}`)} (đồng).`),
    IT(`Tiền phạt của các sản phẩm không đạt là ${NN(v[1]?o.w*o.f:o.w*o.f+o.f)} đồng.`,v[1],'vd','TH',`${nb(`${o.w} · ${NN(o.f)} = ${NN(o.w*o.f)}`)} (đồng).`),
    IT(`Công nhân đó lĩnh ${NN(v[2]?o.val:o.c*o.g+o.w*o.f)} đồng.`,v[2],'vd','VD',`${nb(`${NN(o.c*o.g)} − ${NN(o.w*o.f)} = ${NN(o.val)}`)} (đồng).`),
    IT(`Tiền lĩnh ít hơn tiền thưởng ${NN(v[3]?o.w*o.f:o.w*o.f+o.f)} đồng.`,v[3],'vd','VD',`Tiền lĩnh bằng tiền thưởng trừ tiền phạt, nên ít hơn tiền thưởng đúng ${NN(o.w*o.f)} đồng.`)]};}
const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
addTF('tf_ch_th_a','ch','TH',four(tfDivQ));addTF('tf_ch_th_b','ch','TH',four(tfDivBy));
addTF('tf_ch_vd_a','ch','VD',tfChVD);addTF('tf_ch_vd_b','ch','VD',tfChVD);
addTF('tf_ub_th_a','ub','TH',four(tfUoc));addTF('tf_ub_th_b','ub','TH',four(tfBoi));
addTF('tf_ub_vd_a','ub','VD',four(tfCommon));addTF('tf_ub_vd_b','ub','VD',four(tfCommon));
addTF('tf_tx_th_a','tx','TH',four(tfTx));addTF('tf_tx_th_b','tx','TH',four(tfTx));
addTF('tf_tx_vd_a','tx','VD',four(tfNVal));addTF('tf_tx_vd_b','tx','VD',four(tfPlus));
addTF('tf_ctx_avg','vd','VD',tfCtx(ctxAvg));addTF('tf_ctx_snail','vd','VD',tfCtx(ctxSnail));addTF('tf_ctx_wage','vd','VD',tfCtx(ctxWage));
['ch','ub','tx','vd'].forEach(k=>addTF('tf_nb_'+k,k,'NB',tfNB(k)));
addTF('tf_nb_ch2','ch','NB',tfNB('ch'));addTF('tf_nb_ub2','ub','NB',tfNB('ub'));

/* ============ Trả lời ngắn ============ */
const sa=(f)=>f;
function saChDiv(){const {a,b,q}=divData();return{stem:`Tính ${DV(a,b)}.`,ans:[q],exp:divWhy(a,b,q)};}
function saChTbl(){const {a,b,q}=divData();return{stem:`Cho ${nb('x = '+N(a))} và ${nb('y = '+N(b))}. Tính ${nb('x : y')}.`,ans:[q],exp:divWhy(a,b,q)};}
function saChFrom(){const y=ri(2,12),q=ri(2,20),x=y*q,k=sel([[-x,y,-q,`(−${x}) : ${y}`],[x,-y,-q,`${x} : (−${y})`],[-x,-y,q,`(−${x}) : (−${y})`]]);
  return{stem:`Biết ${nb(`${x} : ${y} = ${q}`)}. Tính ${nb(k[3])}.`,ans:[k[2]],exp:`Độ lớn của thương vẫn là ${q}. ${sameSg(k[0],k[1])?'Hai số cùng dấu nên thương dương':'Hai số khác dấu nên thương âm'}: ${nb(k[3])} = ${N(k[2])}.`};}
function saChExpr(){const o=exprData();return{stem:`Tính giá trị của biểu thức ${o.txt}.`,ans:[o.val],exp:o.exp};}
function saUbCntDiv(){const o=cntDivData(),n=o.n*sgn();return{stem:`Có bao nhiêu số nguyên là ước của ${N(n)}?`,ans:[o.cnt],exp:`${ab(n)} có ${o.d} ước dương (${LST(divsP(n))}), cùng ${o.d} số đối của chúng, tổng cộng ${o.cnt} ước.`};}
function saUbCntMult(){const o=cntMultData();return{stem:`Có bao nhiêu số nguyên x là bội của ${o.n} và thỏa mãn ${o.txt}?`,ans:[o.cnt],exp:`Các bội của ${o.n} thỏa mãn: ${LST(Array.from({length:o.cnt},(_,i)=>(i-(o.a-1))*o.n))}. Có ${o.cnt} số.`};}
function saUbSetCnt(){const o=setData();return{stem:`Cho ${nb(`M = {x ∈ ℤ | x ⋮ ${o.m} và ${o.txt}}`)}. Tập hợp M có bao nhiêu phần tử?`,ans:[o.cnt],exp:`Các bội của ${o.m} trong khoảng đó: ${LST(o.els)}. Có ${o.cnt} phần tử.`};}
function saUbSetSum(){const o=setData();return{stem:`Cho ${nb(`M = {x ∈ ℤ | x ⋮ ${o.m} và ${o.txt}}`)}. Tính tổng các phần tử của M.`,ans:[o.s],exp:`M = {${LST(o.els)}}. Tổng các phần tử bằng ${N(o.s)}.`};}
function saTxMul(){const {m,x,p}=mulData();return{stem:`Tìm số nguyên x, biết ${nb(`${P(m)} · x = ${N(p)}`)}.`,ans:[x],exp:`${nb(`x = ${N(p)} : ${P(m)} = ${N(x)}`)}.`};}
function saTxLin1(){const o=lin1Data();return{stem:`Tìm số nguyên x, biết ${o.txt}.`,ans:[o.x],exp:`${nb(`x − ${o.c} = ${N(o.p)} : ${P(o.a)} = ${N(o.t)}`)}, suy ra ${nb(`x = ${N(o.t)} + ${o.c} = ${N(o.x)}`)}.`};}
function saTxDiv(){const o=divEqData();return{stem:`Tìm số nguyên x, biết ${o.txt}.`,ans:[o.x],exp:`${nb(`x + ${o.c} = ${N(o.p)} : ${P(o.q)} = ${N(o.s)}`)}, suy ra ${nb(`x = ${N(o.s)} − ${o.c} = ${N(o.x)}`)}.`};}
function saTxLin2(){const o=lin2Data();return{stem:`Tìm số nguyên x, biết ${o.txt}.`,ans:[o.x],exp:`${nb(`${o.a} · (x − ${o.c}) = ${N(o.p)} + ${o.d} = ${N(o.p+o.d)}`)}, nên ${nb(`x − ${o.c} = ${N(o.t)}`)} và ${nb(`x = ${N(o.t)} + ${o.c} = ${N(o.x)}`)}.`};}
function saTxNCnt(){const o=nData();return{stem:`Có bao nhiêu số nguyên n để (${NEX(o.c)}) là ước của ${N(o.p)}?`,ans:[o.cnt],exp:`${N(o.p)} có ${o.cnt} ước nguyên, mỗi ước cho đúng một giá trị của n. Vậy có ${o.cnt} số n.`};}
function saVdDebt(){const o=debtData();return{stem:o.stem,ans:[-o.e],exp:o.exp};}
function saVdAvg(){const o=avgData();return{stem:`${o.stem} Nhiệt độ trung bình của ${o.n} ngày đó là bao nhiêu °C?`,ans:[o.avg],exp:o.exp};}
function saVdWage(){const o=wageData();return{stem:o.stem,ans:[o.val],exp:o.exp};}
function saVdProfit(){const o=profitData();return{stem:o.stem,ans:[o.avg],exp:o.exp};}
function saVdSnail(){const o=snailData();return{stem:o.stem1,ans:[o.n*(o.a-o.b)],exp:o.exp1};}
const SA=[
 {id:'s_ch_nb',topic:'ch',level:'NB',unit:'',gen:saChDiv},
 {id:'s_ch_nb2',topic:'ch',level:'NB',unit:'',gen:saChTbl},
 {id:'s_ch_th',topic:'ch',level:'TH',unit:'',gen:saChFrom},
 {id:'s_ch_th2',topic:'ch',level:'TH',unit:'',gen:saChExpr},
 {id:'s_ub_nb',topic:'ub',level:'NB',unit:'',gen:saUbCntDiv},
 {id:'s_ub_th',topic:'ub',level:'TH',unit:'',gen:saUbCntMult},
 {id:'s_ub_th2',topic:'ub',level:'TH',unit:'',gen:saUbSetCnt},
 {id:'s_ub_vd',topic:'ub',level:'VD',unit:'',gen:saUbSetSum},
 {id:'s_tx_th',topic:'tx',level:'TH',unit:'',gen:saTxMul},
 {id:'s_tx_th2',topic:'tx',level:'TH',unit:'',gen:saTxLin1},
 {id:'s_tx_th3',topic:'tx',level:'TH',unit:'',gen:saTxDiv},
 {id:'s_tx_vd',topic:'tx',level:'VD',unit:'',gen:saTxLin2},
 {id:'s_tx_vd2',topic:'tx',level:'VD',unit:'',gen:saTxNCnt},
 {id:'s_vd_nb',topic:'vd',level:'NB',unit:'nghìn đồng',gen:saVdDebt},
 {id:'s_vd_th',topic:'vd',level:'TH',unit:'°C',gen:saVdAvg},
 {id:'s_vd_th2',topic:'vd',level:'TH',unit:'đồng',gen:saVdWage},
 {id:'s_vd_vd',topic:'vd',level:'VD',unit:'triệu đồng',gen:saVdProfit},
 {id:'s_vd_vd2',topic:'vd',level:'VD',unit:'m',gen:saVdSnail}
].map(q=>Object.assign({type:'sa'},q));
SA.push(...SA.map(q=>Object.assign({},q,{id:q.id+'b'})));

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
function hardSetData(){const m=ri(3,8),L=ri(20,60),R=ri(20,60),els=[];for(let x=-L+1;x<=R;x++)if(x%m===0)els.push(x+0);
  return {m,L,R,els,s:els.reduce((p,x)=>p+x,0)};}
const TWO=[[4,-6],[6,-9],[10,15],[-4,6],[8,12],[-6,10],[9,-12]];
function twoData(){for(;;){const [a,b]=sel(TWO),l=lcm(a,b),L=-ri(1,60),R=ri(1,60),els=[];for(let x=L+1;x<R;x++)if(x%a===0&&x%b===0)els.push(x+0);
  if(els.length>=3)return {a,b,l,L,R,els,s:els.reduce((p,x)=>p+x,0)};}}
function tfHardB(){
  for(let n=0;n<80;n++){
    const o=nData(),v=[0,1,2,3].map(()=>RNG()<.5);
    const items=shuffle([
      IT(v[0]?'Nếu a chia hết cho b và a chia hết cho c thì a chia hết cho tích b · c (b, c ≠ 0).':'Nếu a chia hết cho b thì a · c chia hết cho b · c (b, c ≠ 0).',!v[0],'ch','VD',v[0]?'Ví dụ 12 chia hết cho 4 và cho 6 nhưng 12 không chia hết cho 24.':'a = b · q nên a · c = (b · c) · q.'),
      IT(v[1]?'Nếu a và b cùng chia hết cho c (c ≠ 0) thì (a + b) : c = a : c + b : c.':'Với a, b, c nguyên và c ≠ 0 thì (a + b) : c = a : c + b : c.',v[1],'ch','VD',v[1]?'a = c · m, b = c · n nên (a + b) : c = m + n = a : c + b : c.':'Chỉ đúng khi a và b đều chia hết cho c (ví dụ (1 + 1) : 2 = 1 nhưng 1 : 2 không là số nguyên).'),
      IT(`Số các số nguyên n để (${NEX(o.c)}) là ước của ${N(o.p)} bằng ${v[2]?o.cnt:o.cnt/2}.`,v[2],'tx','VD',`${N(o.p)} có ${o.cnt} ước nguyên, mỗi ước cho một giá trị n.`),
      IT(`Tổng tất cả các số nguyên n để (${NEX(o.c)}) là ước của ${N(o.p)} bằng ${N(v[3]?-o.c*o.cnt:o.sum+o.c)}.`,v[3],'tx','VD',`Các ước của ${ab(o.p)} xuất hiện từng cặp đối nhau nên tổng các ước bằng 0. Mỗi n = d − (${N(o.c)}) nên tổng bằng ${nb(`${o.cnt} · (${N(-o.c)}) = ${N(-o.c*o.cnt)}`)}.`)]);
    if(items[0].t===items[1].t)continue;
    if(tfOK(items))return {stem:'Xét các phát biểu sau:',items};
  }
  return FB_TF();
}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'tx',level:'VD',gen:tfHardB}],sa:[
 {id:'h_lin',topic:'tx',level:'VD',unit:'',gen:()=>{const o=linDivData();
   return{stem:`Tìm các số nguyên n sao cho ${o.txt} chia hết cho ${nb(NEX(o.c))}. Tính tổng tất cả các số n đó.`,ans:[o.sum],exp:`${nb(`${o.txt} = ${o.a} · (${NEX(o.c)}) + ${N(o.r)}`)}, nên ${NEX(o.c)} phải là ước của ${N(o.r)}. Suy ra n ∈ {${LST(o.ns)}}. Tổng: ${N(o.sum)}.`};}},
 {id:'h_plus',topic:'tx',level:'VD',unit:'',gen:()=>{const o=plusData();
   return{stem:`Có bao nhiêu số nguyên x để ${nb(`x + ${o.k}`)} chia hết cho x?`,ans:[o.cnt],exp:`x + ${o.k} chia hết cho x khi và chỉ khi ${o.k} chia hết cho x. Các ước của ${o.k}: ${LST(o.vals)}. Có ${o.cnt} số.`};}},
 {id:'h_set',topic:'ub',level:'VD',unit:'',gen:()=>{const o=hardSetData();
   return{stem:`Tính tổng các phần tử của tập hợp ${nb(`A = {x ∈ ℤ | x ⋮ ${o.m} và −${o.L} < x ≤ ${o.R}}`)}.`,ans:[o.s],exp:`A = {${LST(o.els)}}. Các cặp số đối nhau có tổng 0, tổng các phần tử còn lại là ${N(o.s)}.`};}},
 {id:'h_two',topic:'ub',level:'VD',unit:'',gen:()=>{const o=twoData();
   return{stem:`Tính tổng các số nguyên x thỏa mãn: x chia hết cho ${N(o.a)}, x chia hết cho ${N(o.b)} và ${nb(`${N(o.L)} < x < ${o.R}`)}.`,ans:[o.s],exp:`x là bội chung của ${N(o.a)} và ${N(o.b)}, tức là bội của ${o.l}. Các số thỏa mãn: ${LST(o.els)}. Tổng bằng ${N(o.s)}.`};}},
 {id:'h_snail',topic:'vd',level:'VD',unit:'giờ',gen:()=>{const o=snailData();return{stem:o.stem2,ans:[o.h],exp:o.exp2};}},
 {id:'h_ratio',topic:'ch',level:'VD',unit:'',gen:()=>{const m=ri(2,15),k=nz(2,6),val=-m+k;
   return{stem:`Cho a, b là hai số nguyên (b ≠ 0) sao cho ${nb(`a : b = −${m}`)}. Tính ${nb(`(a ${k>0?'+':'−'} ${ab(k)} · b) : b`)}.`,ans:[val],exp:`Vì ${nb(`a : b = −${m}`)} nên ${nb(`a = b · (−${m})`)}. Khi đó ${nb(`a ${k>0?'+':'−'} ${ab(k)} · b = b · (−${m}) ${k>0?'+':'−'} b · ${ab(k)} = b · ${N(val)}`)}, nên thương bằng ${N(val)}.`};}}
].map(q=>Object.assign({type:'sa'},q))};

const DAYS=['Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
function pisaAvg(){const o=avgData(),rows=o.T.map((t,i)=>[DAYS[i],N(t)+' °C']),lo=Math.min(...o.T),hi=Math.max(...o.T),k=o.T.filter(t=>t<o.avg).length;
  const pool=[...Array(o.n+1).keys()].filter(x=>x!==k),W=shuffle(pool).slice(0,3);
  return {title:'Nhiệt độ lúc 6 giờ sáng',ctx:`<p class="stem">Trạm khí tượng ghi nhiệt độ lúc 6 giờ sáng của ${o.n} ngày liên tiếp trong một tuần mùa đông.</p>${tbl(['Ngày','Nhiệt độ lúc 6 giờ'],rows)}`,qs:[
    saq('Tổng các nhiệt độ của các ngày trong bảng là bao nhiêu °C?',o.sum,'°C',`${nb(o.T.map((t,i)=>i?'+ '+P(t):N(t)).join(' '))} = ${N(o.sum)} (°C).`,'vd','TH'),
    saq(`Nhiệt độ trung bình lúc 6 giờ sáng của ${o.n} ngày là bao nhiêu °C?`,o.avg,'°C',`${DV(o.sum,o.n)} = ${N(o.avg)} (°C).`,'vd','TH'),
    mcq('Có bao nhiêu ngày có nhiệt độ thấp hơn nhiệt độ trung bình?',''+k,W.map(w=>[''+w,'Hãy so sánh nhiệt độ từng ngày với nhiệt độ trung bình '+N(o.avg)+' °C.']),`Các ngày thấp hơn ${N(o.avg)} °C: ${o.T.filter(t=>t<o.avg).map(N).join('; ')||'không có'}. Có ${k} ngày.`,'vd','VD'),
    saq('Ngày nóng nhất cao hơn ngày lạnh nhất bao nhiêu °C?',hi-lo,'°C',`${nb(`${N(hi)} − ${P(lo)} = ${hi-lo}`)} (°C).`,'vd','VD')]};}
function pisaSnail(){const o=snailData(),rows=[['Ban ngày (12 giờ đầu)','leo lên '+o.a+' m, ghi '+o.a+' m'],['Ban đêm (12 giờ sau)','tụt xuống '+o.b+' m, ghi −'+o.b+' m']],W=new Set([o.k*o.a,o.k*(o.a+o.b)]);
  return {title:'Ốc sên leo cây',ctx:`<p class="stem">Một con ốc sên leo lên một cây cao ${o.H} m. Lúc 0 giờ ốc sên ở gốc cây và bắt đầu leo lên. Mỗi ngày (24 giờ) nó di chuyển như sau.</p>${tbl(['Thời gian','Di chuyển'],rows)}`,qs:[
    saq('Sau một ngày (leo rồi tụt), ốc sên tiến thêm bao nhiêu mét?',o.a-o.b,'m',`${nb(`${o.a} + (−${o.b}) = ${o.a-o.b}`)} (m).`,'vd','TH'),
    saq(`Sau ${o.k} ngày đầu, ốc sên cách gốc cây bao nhiêu mét?`,o.k*(o.a-o.b),'m',`${nb(`${o.k} · ${o.a-o.b} = ${o.k*(o.a-o.b)}`)} (m).`,'vd','TH'),
    mcq(`Biểu thức nào tính đúng độ cao của ốc sên sau ${o.k} ngày đầu (mét)?`,nb(`${o.k} · (${o.a} + (−${o.b}))`),[
      [nb(`${o.k} · ${o.a}`),'Ban đêm ốc sên tụt xuống nên phải cộng thêm −'+o.b+'.'],
      [nb(`${o.k} · (${o.a} + ${o.b})`),'Quãng đường tụt xuống được ghi là −'+o.b+', không phải '+o.b+'.'],
      [nb(`${o.k} · ${o.a} + ${o.b}`),'Mỗi ngày đều có quãng đường tụt xuống '+o.b+' m, phải tính cho cả '+o.k+' ngày.']],`Mỗi ngày ốc sên đi được ${nb(`${o.a} + (−${o.b})`)} mét, ${o.k} ngày thì nhân với ${o.k}.`,'vd','VD'),
    saq('Sau bao nhiêu giờ thì ốc sên chạm tới ngọn cây?',o.h,'giờ',o.exp2,'vd','VD')]};}
function pisaProfit(){const o=profitData(),q1=-3*o.a,q2=3*o.b;
  return {title:'Lợi nhuận của một công ty',ctx:`<p class="stem">Công ty Ánh Dương ghi lợi nhuận mỗi tháng (đơn vị: triệu đồng). Số âm nghĩa là công ty bị lỗ.</p>${tbl(['Thời gian','Lợi nhuận mỗi tháng'],[['Quý I (3 tháng đầu năm)',N(-o.a)],['Quý II (3 tháng tiếp theo)',N(o.b)]])}`,qs:[
    saq('Lợi nhuận của cả Quý I là bao nhiêu triệu đồng?',q1,'triệu đồng',`${nb(`3 · (−${o.a}) = ${N(q1)}`)} (triệu đồng).`,'vd','TH'),
    saq('Lợi nhuận của cả Quý II là bao nhiêu triệu đồng?',q2,'triệu đồng',`${nb(`3 · ${o.b} = ${q2}`)} (triệu đồng).`,'vd','TH'),
    saq('Lợi nhuận của 6 tháng đầu năm là bao nhiêu triệu đồng?',o.T,'triệu đồng',`${nb(`${N(q1)} + ${q2} = ${N(o.T)}`)} (triệu đồng).`,'vd','VD'),
    saq('Trung bình mỗi tháng trong 6 tháng đầu năm công ty lãi (lỗ) bao nhiêu triệu đồng? (Số âm là lỗ)',o.avg,'triệu đồng',`${DV(o.T,6)} = ${N(o.avg)} (triệu đồng).`,'vd','VD')]};}
const PISA=[pisaAvg,pisaSnail,pisaProfit];
const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'ch',fig:'<div class="figbox"><p>a = b · q ⟹ a : b = q (a chia hết cho b)</p><p>(−12) : (−3) = 4 · 12 : (−3) = −4</p><p>cùng dấu: thương dương · khác dấu: thương âm</p></div>',extra:'Không chia cho 0. Số 0 chia cho số khác 0 bằng 0.'},
  {k:'ub',fig:'<div class="figbox"><p>a chia hết cho b ⟹ a là bội của b, b là ước của a</p><p>Ước của 6: −6; −3; −2; −1; 1; 2; 3; 6</p><p>Bội của 7: 0; ±7; ±14; ±21; …</p></div>',extra:'Ước chung của 6 và 4 là −2; −1; 1; 2. Số 0 là bội của mọi số khác 0 nhưng không là ước của số nào.'},
  {k:'tx',fig:'<div class="figbox"><p>(−3) · x = 36 ⟹ x = 36 : (−3) = −12</p><p>15 · (x − 3) = −75 ⟹ x − 3 = −5 ⟹ x = −2</p><p>(n + 2) là ước của −19 ⟹ n + 2 ∈ {−19; −1; 1; 19}</p></div>',extra:'Từ n + 2 = d suy ra n = d − 2. Xét cả ước âm và ước dương.'},
  {k:'vd',fig:'<div class="figbox"><p>trung bình = tổng : số số hạng</p><p>(−6 − 5 − 4 + 2 + 3) : 5 = −2</p><p>nợ −60 chia đều 3 người: (−60) : 3 = −20</p></div>',extra:'Tính tổng trước, chia sau. Nợ, lỗ, đi xuống ghi bằng số âm.'}
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
 G(()=>{const t0=ri(4,20),h=sel([2,3,4,5,6]),r=ri(2,6),t1=t0-h*r;if(t1>=0)throw 0;
  const k=ri(1,h-1),tk=t0-r*k,mm=ri(2,5),T=t1-r*mm;
  const ws=[[nm(t0+r*k)+'°C','Nhiệt độ giảm nên phải trừ, không cộng.'],[nm(t1+r*k)+'°C',`Đây là tính ngược từ nhiệt độ lúc cuối (${nm(t1)}°C), không phải từ lúc bắt đầu.`],[nm(t0-r*(k+1))+'°C',`Sau ${k} giờ nhiệt độ giảm ${k} lần, mỗi lần ${r}°C; bạn đã tính thừa một giờ.`]];
  return {title:'Kho lạnh hạ nhiệt độ',ctx:P(`Một kho lạnh đang có nhiệt độ ${t0}°C. Người ta bật máy làm lạnh để nhiệt độ giảm đều theo từng giờ. Sau ${h} giờ, nhiệt độ trong kho là ${nm(t1)}°C.`),qs:[
   A(`Sau ${h} giờ, nhiệt độ trong kho đã thay đổi bao nhiêu độ C? (Nhập số âm nếu nhiệt độ giảm.)`,t1-t0,'°C',`${nm(t1)} − ${t0} = ${nm(t1-t0)}.`,'ch','TH'),
   A('Mỗi giờ nhiệt độ trong kho thay đổi bao nhiêu độ C? (Nhập số âm nếu nhiệt độ giảm.)',-r,'°C',`(${nm(t1-t0)}) : ${h} = ${nm(-r)}.`,'ch','TH'),
   M(`Nhiệt độ trong kho sau ${k} giờ kể từ khi bật máy là bao nhiêu?`,nm(tk)+'°C',ws,`${t0} + ${k} · (${nm(-r)}) = ${t0} − ${r*k} = ${nm(tk)} (°C).`,'vd','VD'),
   A(`Kể từ lúc nhiệt độ là ${nm(t1)}°C, nếu máy vẫn chạy như vậy thì cần thêm bao nhiêu giờ nữa để nhiệt độ trong kho là ${nm(T)}°C?`,mm,'giờ',`Nhiệt độ cần thay đổi thêm ${nm(T)} − (${nm(t1)}) = ${nm(T-t1)} (°C). Số giờ cần thêm: (${nm(T-t1)}) : (${nm(-r)}) = ${mm}.`,'tx','VD')]};})
);
}
/* ==== Toán thực tế bổ sung: kết thúc ==== */
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='ub6_seen';
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
  const mcSlots=[['ch',['NB','TH']],['ub',['NB','TH']],['ub',['TH','VD']],['tx',['TH','VD']],['vd',['TH','VD']],['ch',['TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['ch','ub','tx'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=['ch','ub','tx','vd'].map(t=>pick(MC.filter(q=>q.topic===t&&q.level!=='VD'),used));
  const sa=[pick(SA.filter(q=>q.topic==='ch'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='tx'&&q.level!=='VD'),used)];
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
