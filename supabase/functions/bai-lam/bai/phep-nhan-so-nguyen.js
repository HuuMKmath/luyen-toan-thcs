// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ phep-nhan-so-nguyen/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "phep-nhan-so-nguyen";
export const TIEN_TO = "NH6-";

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

/* ============ Dữ liệu dùng chung cho Bài 16 ============ */
const PRD=v=>nb(v.map(P).join(' · '));                 // tích: (−25) · (−17) · 4
const prod=v=>v.reduce((p,x)=>p*x,1);
const NN=x=>(x<0?'−':'')+String(Math.abs(x)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');   // 45 000
const nz=(lo,hi)=>ri(lo,hi)*sgn();
const O=(t,err)=>err?{t,err}:{t};
const E_SGN='Tích của hai số nguyên khác dấu là số âm, tích của hai số nguyên cùng dấu là số dương.';
const E_ADD='Đề yêu cầu nhân, bạn đã cộng hai số.';
const FB_MC=()=>({stem:`Tính ${PRD([-12,5])}.`,opts:[{t:'−60'},{t:'60',err:E_SGN},{t:'−7',err:E_ADD},{t:'−70',err:'Tính nhẩm sai: 12 · 5 = 60.'}],ans:0,exp:'Hai số khác dấu nên tích âm: 12 · 5 = 60, vậy (−12) · 5 = −60.'});
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
const FB_TF=()=>({stem:'Xét các phát biểu sau:',items:[
  IT('Tích của hai số nguyên khác dấu là một số nguyên âm.',true,'qt','NB','Ví dụ 25 · (−4) = −100.'),
  IT('Tích của hai số nguyên âm là một số nguyên âm.',false,'qt','NB','Tích của hai số nguyên âm là số nguyên dương. Ví dụ (−10) · (−15) = 150.'),
  IT(nb('a · (b + c) = a · b + a · c')+' với mọi số nguyên a, b, c.',true,'tc','NB','Đây là tính chất phân phối của phép nhân đối với phép cộng.'),
  IT(nb('a · (b + c) = a · b + c')+' với mọi số nguyên a, b, c.',false,'tc','NB','Phải nhân a với cả b và c: a · (b + c) = a · b + a · c.')]});
function pick4(Ts,Fs){const nT=ri(1,3);return shuffle(shuffle(Ts).slice(0,nT).concat(shuffle(Fs).slice(0,4-nT)));}
function mixed(make){for(let n=0;n<80;n++){const items=make();if(items.some(i=>!i))continue;const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}return null;}
const four=f=>()=>{const items=mixed(()=>[f(),f(),f(),f()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};

/* --- nhân hai số nguyên (3.32, 3.33, 3.34, 3.36) --- */
function genQtMul(){return tryGen(()=>{
  const a=ri(3,30),b=ri(3,30),x=sgn()*a,y=sgn()*b,p=x*y;
  return mk(`Tính ${PRD([x,y])}.`,N(p),[C(N(-p),E_SGN),C(N(x+y),E_ADD),C(N(p+sgn()*sel([a,b])),`Tính nhẩm sai: ${a} · ${b} = ${a*b}.`)],
    `${x*y<0?'Hai số khác dấu nên tích âm':'Hai số cùng dấu nên tích dương'}: ${nb(`${a} · ${b} = ${a*b}`)}. Vậy ${PRD([x,y])} = ${N(p)}.`);
});}
function signQ(n,allowZero){
  const k=ri(1,n-1),f=[];for(let i=0;i<n;i++)f.push(i<k?-ri(2,9):ri(2,9));
  let hasZero=false;if(allowZero&&RNG()<.2){f[ri(k,n-1)]=0;hasZero=true;}
  return {f:shuffle(f),k,zero:hasZero};}
function genQtSign(n,allowZero){return ()=>tryGen(()=>{
  const o=signQ(n(),allowZero),p=prod(o.f),good=o.zero?'bằng 0':p<0?'số nguyên âm':'số nguyên dương';
  const all=['số nguyên dương','số nguyên âm','bằng 0'];
  const err=t=>o.zero?'Có một thừa số bằng 0 nên tích bằng 0.':t==='bằng 0'?'Không có thừa số nào bằng 0 nên tích khác 0.':`Có ${o.k} thừa số âm: ${o.k%2?'số lẻ thừa số âm thì tích âm':'số chẵn thừa số âm thì tích dương'}.`;
  const wrong=all.filter(t=>t!==good).map(t=>C(t,err(t))).concat([C('chưa xác định được dấu','Biết dấu của từng thừa số thì xác định được dấu của tích.')]);
  return mk(`Tích ${PRD(o.f)} là:`,good,wrong,o.zero?'Trong tích có một thừa số bằng 0 nên tích bằng 0.':`Có ${o.k} thừa số mang dấu âm, ${o.k%2?'số lẻ nên tích là số âm':'số chẵn nên tích là số dương'}. Tích bằng ${N(p)}.`);
});}
const genQtSignNB=genQtSign(()=>ri(2,3),false),genQtSignTH=genQtSign(()=>ri(4,5),true);
function genQtFrom(){return tryGen(()=>{
  const [n,m]=sel([[3,12],[4,9],[6,6],[2,18],[4,12],[5,10],[3,16],[6,8],[7,6],[9,4],[5,12]]),P0=n*m,k=sel(['n · (−m)','(−n) · m','(−n) · (−m)']),v=k==='(−n) · (−m)'?P0:-P0;
  return mk(`Cho n và m là hai số tự nhiên có tích ${nb('n · m = '+P0)}. Tích ${nb(k)} bằng:`,N(v),[C(N(-v),E_SGN),C(N(v+n),'Đổi dấu thừa số chỉ làm đổi dấu tích, không đổi độ lớn: tích là ±'+P0+'.'),C(N(v-m),'Đổi dấu thừa số chỉ làm đổi dấu tích, không đổi độ lớn: tích là ±'+P0+'.')],
    `${k==='(−n) · (−m)'?'Hai số cùng dấu nên (−n) · (−m) = n · m':'Hai số khác dấu nên '+k+' = −(n · m)'} = ${N(v)}.`);
});}

/* --- tính chất của phép nhân (Ví dụ 3, 3.35, 3.37) --- */
const TCN={g:'giao hoán',k:'kết hợp',p:'phân phối của phép nhân đối với phép cộng',z:'nhân với số 0'};
const TCE={g:'Tính chất giao hoán: a · b = b · a (đổi chỗ các thừa số).',k:'Tính chất kết hợp: a · (b · c) = (a · b) · c (đổi cách nhóm các thừa số).',p:'Tính chất phân phối: a · (b + c) = a · b + a · c (nhân a với từng số hạng của tổng).',z:'Tích của một số nguyên với 0 luôn bằng 0: a · 0 = 0.'};
function genTcName(){return tryGen(()=>{
  const t=sel(['g','k','p']),[a,b,c]=[nz(2,15),nz(2,15),nz(2,15)];let eq;
  if(t==='g')eq=`${P(a)} · ${P(b)} = ${P(b)} · ${P(a)}`;
  else if(t==='k')eq=`(${P(a)} · ${P(b)}) · ${P(c)} = ${P(a)} · (${P(b)} · ${P(c)})`;
  else eq=`${P(a)} · (${N(b)} + ${P(c)}) = ${P(a)} · ${P(b)} + ${P(a)} · ${P(c)}`;
  return mk(`Đẳng thức ${nb(eq)} thể hiện tính chất nào của phép nhân?`,TCN[t],['g','k','p','z'].filter(x=>x!==t).map(x=>C(TCN[x],TCE[x])),TCE[t]);
});}
function combData(){
  const [a1,a2]=sel([[4,25],[2,50],[8,125],[20,5],[5,2],[25,8],[4,50]]),x=ri(11,99),s=[sgn(),sgn(),sgn()],v=[s[0]*a1,s[1]*a2,s[2]*x];
  const f=sel([[0,2,1],[2,0,1],[0,1,2],[1,0,2]]).map(i=>v[i]),p=prod(v);
  return {a1,a2,x,v,f,p,exp:`Đổi chỗ và nhóm hai thừa số ${P(v[0])} và ${P(v[1])}: ${nb(`${P(v[0])} · ${P(v[1])} = ${N(v[0]*v[1])}`)}. Rồi nhân với ${P(v[2])}: ${nb(`${N(v[0]*v[1])} · ${P(v[2])} = ${N(p)}`)}.`};}
function genTcComb(){return tryGen(()=>{const o=combData();
  return mk(`Tính ${PRD(o.f)}.`,N(o.p),[C(N(-o.p),E_SGN),C(N(o.p/10),'Bạn bỏ sót một chữ số 0 khi nhân.'),C(N(o.p*10),'Bạn thừa một chữ số 0 khi nhân.')],o.exp);
});}
function distData(){const a=nz(2,9),b=ri(100,200),c=nz(10,40),val=a*(b+c);
  return {a,b,c,val,txt:nb(`${P(a)} · (${b} ${c<0?'−':'+'} ${Math.abs(c)})`),wv:[a*b+c,a*b-a*c,-val],
    exp:`Tính chất phân phối: ${nb(`${P(a)} · (${b} ${c<0?'−':'+'} ${Math.abs(c)}) = ${P(a)} · ${b} + ${P(a)} · ${P(c)} = ${N(a*b)} + ${P(a*c)} = ${N(val)}`)}.`};}
function genTcDist(){return tryGen(()=>{const o=distData();
  return mk(`Tính ${o.txt}.`,N(o.val),[C(N(o.wv[0]),'Phải nhân a với cả hai số hạng: a · (b + c) = a · b + a · c.'),C(N(o.wv[1]),'Dấu của a · c bị đổi sai.'),C(N(o.wv[2]),E_SGN)],o.exp);
});}
function facData(){const a=nz(2,9),B=ri(30,60),C0=ri(10,29),val=a*(-B+C0);
  return {a,B,C0,val,txt:nb(`${P(a)} · ${P(-B)} − ${P(a)} · ${P(-C0)}`),wv:[a*(-B-C0),-val,a*(-B)+C0],
    exp:`${nb(`${P(a)} · ${P(-B)} − ${P(a)} · ${P(-C0)} = ${P(a)} · (${P(-B)} − ${P(-C0)}) = ${P(a)} · ${P(-B+C0)} = ${N(val)}`)}.`};}
function genTcFac(){return tryGen(()=>{const o=facData();
  return mk(`Tính ${o.txt}.`,N(o.val),[C(N(o.wv[0]),'Trừ đi một số âm thì thành cộng: −(−c) = +c, nên trong ngoặc là −B + C.'),C(N(o.wv[1]),E_SGN),C(N(o.wv[2]),'Bạn quên nhân a với số hạng thứ hai.')],o.exp);
});}
function sameData(){const a=ri(2,9),p=ri(1000,2500),q=ri(1000,2500);
  return {a,p,q,val:a*p,txt:nb(`${a} · (${NN(p)} + ${NN(q)}) + ${a} · (−${NN(q)})`),wv:[a*(p+q),-a*p,a*(p-q)],
    exp:`${nb(`${a} · (${NN(p)} + ${NN(q)}) + ${a} · (−${NN(q)}) = ${a} · ${NN(p)} + ${a} · ${NN(q)} + ${a} · (−${NN(q)}) = ${a} · ${NN(p)} = ${NN(a*p)}`)}, vì ${nb(`${a} · ${NN(q)}`)} và ${nb(`${a} · (−${NN(q)})`)} là hai số đối nhau.`};}
function genTcSame(){return tryGen(()=>{const o=sameData();
  return mk(`Tính một cách hợp lí: ${o.txt}.`,NN(o.val),[C(NN(o.wv[0]),'Bạn quên cộng a · (−q), hai số a · q và a · (−q) đối nhau.'),C(NN(o.wv[1]),'Tích của hai số dương là số dương.'),C(NN(o.wv[2]),'a · (p + q) + a · (−q) không bằng a · (p − q).')],o.exp);
});}
function hardData(){const a=ri(12,60),b=ri(10,20),c=ri(1,9),N1=1000+b-c,val=-1000*a;
  return {a,b,c,N1,val,txt:nb(`(−${a}) · ${NN(N1)} − ${a} · (−${b}) + ${a} · (−${c})`),wv:[1000*a,-a*N1-a*b-a*c,-a*N1+a*b+a*c],
    exp:`${nb(`(−${a}) · ${NN(N1)} − ${a} · (−${b}) + ${a} · (−${c}) = (−${a}) · ${NN(N1)} + (−${a}) · (−${b}) + (−${a}) · ${c}`)} = ${nb(`(−${a}) · (${NN(N1)} − ${b} + ${c})`)} = ${nb(`(−${a}) · 1 000 = ${NN(val)}`)}.`};}
function genTcHard(){return tryGen(()=>{const o=hardData();
  return mk(`Tính một cách hợp lí: ${o.txt}.`,NN(o.val),[C(NN(o.wv[0]),E_SGN),C(NN(o.wv[1]),'Bạn đã tính sai dấu của a · (−b): − a · (−b) = + a · b.'),C(NN(o.wv[2]),'Bạn đã tính sai dấu của a · (−c): nó bằng −a · c, không phải +a · c.')],o.exp);
});}

/* --- giá trị biểu thức, so sánh, tháp số --- */
function evalData(){
  const p=ri(2,9),q=ri(2,9),op=sel([1,-1]),x=nz(1,9),y=nz(1,9);if(x>0&&y>0)return evalData();
  const val=p*x+op*q*y,expr=`${p}x ${op>0?'+':'−'} ${q}y`;
  return {p,q,op,x,y,val,expr,stem:`Tính giá trị của biểu thức ${nb('A = '+expr)} khi ${nb('x = '+N(x))} và ${nb('y = '+N(y))}.`,
    wv:[p*x-op*q*y,-val,p*Math.abs(x)+op*q*Math.abs(y)],exp:`Thay số: ${nb(`A = ${p} · ${P(x)} ${op>0?'+':'−'} ${q} · ${P(y)} = ${N(p*x)} ${op>0?'+':'−'} ${P(q*y)} = ${N(val)}`)}.`};}
function genBtEval(){return tryGen(()=>{const o=evalData();
  return mk(o.stem,N(o.val),[C(N(o.wv[0]),'Bạn đã tính sai dấu của số hạng thứ hai khi thay số âm.'),C(N(o.wv[1]),E_SGN),C(N(o.wv[2]),'Bạn đã bỏ dấu âm của x hoặc y khi thay số.')],o.exp);
});}
function eval2Data(){const x=nz(2,9),y=nz(2,9),val=x*(y-1)+y*(x+1);
  return {x,y,val,txt:nb('x · (y − 1) + y · (x + 1)'),wv:[2*x*y+x+y,2*x*y-x-y,-2*x*y-x+y],
    exp:`Thay số: ${nb(`${P(x)} · (${N(y)} − 1) + ${P(y)} · (${N(x)} + 1) = ${P(x)} · ${P(y-1)} + ${P(y)} · ${P(x+1)} = ${N(x*(y-1))} + ${P(y*(x+1))} = ${N(val)}`)}.`};}
function genBtEval2(){return tryGen(()=>{const o=eval2Data();
  return mk(`Tính giá trị của biểu thức ${o.txt} khi ${nb('x = '+N(o.x))} và ${nb('y = '+N(o.y))}.`,N(o.val),o.wv.map(v=>C(N(v),'Thay số rồi tính từng tích, chú ý dấu của tích và dấu của các số trong ngoặc.')),o.exp);
});}
function abcData(){const a=nz(2,9),b=ri(10,30),c=nz(2,9),val=a*(b+c);
  return {a,b,c,val,txt:nb('a · (b + c)'),wv:[a*b+c,a*b-a*c,-val],exp:`${nb(`a · (b + c) = ${P(a)} · (${b} ${c<0?'−':'+'} ${Math.abs(c)}) = ${P(a)} · ${N(b+c)} = ${N(val)}`)}. Cũng có ${nb(`a · b + a · c = ${N(a*b)} + ${P(a*c)} = ${N(val)}`)}.`};}
function genBtAbc(){return tryGen(()=>{const o=abcData();
  return mk(`Tính ${o.txt} khi ${nb('a = '+N(o.a))}, ${nb('b = '+N(o.b))}, ${nb('c = '+N(o.c))}.`,N(o.val),[C(N(o.wv[0]),'Phải nhân a với cả b và c: a · (b + c) = a · b + a · c.'),C(N(o.wv[1]),'Dấu của a · c bị đổi sai.'),C(N(o.wv[2]),E_SGN)],o.exp);
});}
const CMP=['lớn hơn','nhỏ hơn','bằng'];
function cmpData(){
  const p=ri(2,99),q=ri(2,99),r=ri(1,50),k=ri(0,6);
  const T=[
    [PRD([-p,-q]),'0','>','Tích của hai số nguyên âm là số dương, mà số dương lớn hơn 0.'],
    [PRD([-p,q]),'0','<','Tích của hai số nguyên khác dấu là số âm, mà số âm nhỏ hơn 0.'],
    [PRD([-p,-q]),N(-r),'>','Tích của hai số nguyên âm là số dương, mà số dương lớn hơn số âm.'],
    [PRD([p,-q]),''+r,'<','Tích của hai số nguyên khác dấu là số âm, mà số âm nhỏ hơn số dương.'],
    [PRD([-p,-q]),PRD([p,q]),'=','Tích của hai số nguyên âm bằng tích của hai số tự nhiên tương ứng: (−p) · (−q) = p · q.'],
    [PRD([-p,q]),PRD([p,-q]),'=','Hai tích đều bằng −(p · q).'],
    [PRD([-p,-q]),PRD([-p,q]),'>','Tích (−p) · (−q) là số dương, tích (−p) · q là số âm.']][k];
  return {l:T[0],r:T[1],rel:T[2],why:T[3]};}
function genBtCmp(){return tryGen(()=>{const o=cmpData(),name=o.rel==='>'?'lớn hơn':o.rel==='<'?'nhỏ hơn':'bằng';
  return mk(`Không làm phép tính, hãy so sánh ${o.l} với ${o.r}. Tích ${o.l} ... ${o.r}.`,name,CMP.filter(t=>t!==name).map(t=>C(t,'Hãy xét dấu của mỗi tích: '+o.why)).concat([C('không so sánh được','Biết dấu và độ lớn của các thừa số thì so sánh được hai tích.')]),o.why);
});}
function pyrData(){for(;;){const v=[0,0,0,0].map(()=>sel([-3,-2,-1,1,2,3])),r3=[v[0]*v[1],v[1]*v[2],v[2]*v[3]],r2=[r3[0]*r3[1],r3[1]*r3[2]],top=r2[0]*r2[1];
  if(Math.abs(top)>2000||new Set([top,-top,prod(r3),prod(v)]).size<4)continue;
  return {v,r3,r2,top,wv:[-top,prod(r3),prod(v)],exp:`Hàng thứ ba: ${r3.map(N).join('; ')}. Hàng thứ hai: ${r2.map(N).join('; ')}. Đỉnh: ${nb(`${P(r2[0])} · ${P(r2[1])} = ${N(top)}`)}.`};}}
const PYST=o=>`Một tháp số có hàng dưới cùng gồm bốn ô, từ trái sang phải là ${o.v.map(N).join('; ')}. Mỗi ô ở hàng trên bằng tích của hai ô kề nó ở hàng dưới (hàng thứ ba có ba ô, hàng thứ hai có hai ô, hàng trên cùng có một ô). Số ở ô trên cùng là:`;
function genBtPyr(){return tryGen(()=>{const o=pyrData();
  return mk(PYST(o),N(o.top),[C(N(o.wv[0]),'Chú ý: tích của hai số âm là số dương.'),C(N(o.wv[1]),'Phải tính lần lượt từng hàng rồi mới đến ô trên cùng.'),C(N(o.wv[2]),'Không nhân trực tiếp bốn ô dưới cùng: mỗi ô còn được dùng nhiều lần ở các hàng trên.')],o.exp);
});}

/* --- vận dụng thực tế (mở đầu, 3.38, vải may) --- */
function spendData(){const a=1000*ri(5,50),k=ri(2,6);return {a,k,v:-a*k,stem:`Bạn Cao dùng số nguyên âm để ghi các khoản chi vào sổ tay. Trong tháng, có ${k} lần Cao ghi −${NN(a)} đồng. Tổng các khoản đã ghi của ${k} lần đó là bao nhiêu đồng?`,exp:`${k} lần ghi −${NN(a)} đồng: ${nb(`(−${NN(a)}) · ${k} = −${NN(a*k)}`)} (đồng). Cao đã chi ${NN(a*k)} đồng.`};}
function genVdSpend(){return tryGen(()=>{const o=spendData(),{a,k}=o;
  return mk(o.stem,NN(o.v),[C(NN(a*k),'Khoản chi được ghi bằng số âm nên tổng cũng là số âm.'),C(NN(-a-k),'Cộng k lần số −a chính là phép nhân (−a) · k.'),C(NN(-a*(k-1)),`Có ${k} lần ghi, nhân với ${k} chứ không phải ${k-1}.`)],o.exp);
});}
const DPT=[10,7,3,-1,-3];
function dartData(){for(;;){const names=['An','Bình','Cường'],cnt=names.map(()=>{const c=[0,0,0,0,0];for(let i=0;i<5;i++)c[ri(0,4)]++;return c;}),
  sc=cnt.map(r=>r.reduce((s,c,i)=>s+c*DPT[i],0)),mx=Math.max(...sc);
  if(sc.filter(x=>x===mx).length!==1||new Set(sc).size<3)continue;
  return {names,cnt,sc,mx,top:names[sc.indexOf(mx)],fig:tbl(['Bạn','10 điểm','7 điểm','3 điểm','−1 điểm','−3 điểm'],names.map((n,i)=>[n].concat(cnt[i].map(String))))};}}
const dartExp=(d,i)=>`${d.names[i]}: ${nb(d.cnt[i].map((c,j)=>c?`${c} · ${P(DPT[j])}`:null).filter(Boolean).join(' + '))} = ${N(d.sc[i])} (điểm).`;
const DSTEM='Ba bạn An, Bình, Cường chơi ném tiêu, mỗi bạn ném 5 lần. Mỗi lần ném được 10, 7, 3, −1 hoặc −3 điểm. Bảng cho biết số lần mỗi bạn ném được từng mức điểm.';
function genVdDart(){return tryGen(()=>{const d=dartData();
  return Object.assign(mk(`${DSTEM} Bạn nào đạt điểm cao nhất?`,d.top,d.names.filter(n=>n!==d.top).map(n=>C(n,'Điểm của '+n+' là '+N(d.sc[d.names.indexOf(n)])+', chưa phải cao nhất.')).concat([C('Ba bạn bằng điểm','Điểm của ba bạn khác nhau: '+d.names.map((n,i)=>n+' '+N(d.sc[i])).join('; ')+'.')]),
    `${d.names.map((n,i)=>dartExp(d,i)).join(' ')} Bạn ${d.top} đạt điểm cao nhất (${N(d.mx)} điểm).`),{fig:d.fig});
});}
function fabData(){const n=sel([250,420,450,500,1500]),x=sgn()*ri(5,25),val=n*x;
  return {n,x,val,stem:`Một xí nghiệp may mỗi ngày ${n} bộ quần áo. Theo mẫu mới, số vải dùng để may một bộ thay đổi ${N(x)} dm so với mẫu cũ (số dương là tăng, số âm là giảm). Mỗi ngày, số vải dùng thay đổi bao nhiêu đề-xi-mét?`,
    exp:`${nb(`${n} · ${P(x)} = ${NN(val)}`)} (dm). ${val<0?'Số vải dùng mỗi ngày giảm '+NN(-val)+' dm.':'Số vải dùng mỗi ngày tăng '+NN(val)+' dm.'}`};}
function genVdFab(){return tryGen(()=>{const o=fabData();
  return mk(o.stem,NN(o.val),[C(NN(-o.val),'Tích mang dấu của '+N(o.x)+': số vải thay đổi cùng chiều với mức thay đổi của mỗi bộ.'),C(NN(o.n+o.x),'Đề hỏi số vải của cả '+o.n+' bộ: đó là phép nhân.'),C(N(o.x),`Đây là mức thay đổi của một bộ, cả ${o.n} bộ phải nhân với ${o.n}.`)],o.exp);
});}
function backData(){const T=ri(-5,10),k=ri(2,5),h=ri(2,6),val=T+k*h;
  return {T,k,h,val,stem:`Lúc 12 giờ trưa nhiệt độ ngoài trời là ${N(T)} °C. Nhiệt độ giảm đều mỗi giờ ${k} °C. Hỏi ${h} giờ trước đó (lúc ${12-h} giờ) nhiệt độ là bao nhiêu °C?`,wv:[T-k*h,T+k+h,-val],
    exp:`Mỗi giờ nhiệt độ thay đổi −${k} °C. Sau −${h} giờ (tức ${h} giờ trước) nhiệt độ thay đổi ${nb(`(−${k}) · (−${h}) = ${k*h}`)} (°C). Vậy nhiệt độ lúc đó là ${nb(`${N(T)} + ${k*h} = ${N(val)}`)} (°C).`};}
function genVdBack(){return tryGen(()=>{const o=backData();
  return mk(o.stem,N(o.val),[C(N(o.wv[0]),'Nhiệt độ đang giảm nên lúc trước nhiệt độ phải cao hơn lúc này.'),C(N(o.wv[1]),'Đây là phép nhân k · h chứ không phải phép cộng k + h.'),C(N(o.wv[2]),'Bạn đã đảo dấu kết quả. Trước đó h giờ là −h giờ: (−k) · (−h) = k · h, là số dương.')],o.exp);
});}
function scoreData(){const a=ri(4,10),b=ri(1,4),c=ri(4,15),w=ri(1,8),val=a*c-b*w;
  return {a,b,c,w,val,stem:`Trong một bài thi trắc nghiệm, mỗi câu trả lời đúng được ${a} điểm, mỗi câu trả lời sai bị trừ ${b} điểm. Bạn Lan trả lời đúng ${c} câu và sai ${w} câu. Tổng điểm của Lan là bao nhiêu?`,wv:[a*c+b*w,a*c-b,-val],
    exp:`Điểm các câu đúng: ${nb(`${a} · ${c} = ${a*c}`)}. Điểm các câu sai: ${nb(`(−${b}) · ${w} = −${b*w}`)}. Tổng điểm: ${nb(`${a*c} + (−${b*w}) = ${N(val)}`)}.`};}
function genVdScore(){return tryGen(()=>{const o=scoreData();
  return mk(o.stem,N(o.val),[C(N(o.wv[0]),'Câu sai bị trừ điểm nên phải trừ b · w, không cộng.'),C(N(o.wv[1]),`Có ${o.w} câu sai, mỗi câu bị trừ ${o.b} điểm: phải trừ ${o.b} · ${o.w}.`),C(N(o.wv[2]),'Bạn đã đảo dấu tổng điểm.')],o.exp);
});}

/* ============ Chủ đề ============ */
const TOPICS={
  qt:{short:'Nhân hai số nguyên',name:'Quy tắc nhân hai số nguyên',rule:'Muốn nhân hai số nguyên khác dấu, ta nhân phần số tự nhiên của hai số đó với nhau rồi đặt dấu "−" trước kết quả nhận được: m · (−n) = −(m · n). Muốn nhân hai số nguyên âm, ta nhân phần số tự nhiên của hai số đó với nhau: (−m) · (−n) = m · n. Nhân với 0: a · 0 = 0. Tích có số lẻ thừa số âm thì âm, số chẵn thừa số âm thì dương.',tip:'Hay nhầm tích hai số âm là số âm. Cùng dấu thì tích dương, khác dấu thì tích âm.'},
  tc:{short:'Tính chất, tính hợp lí',name:'Tính chất của phép nhân, tính hợp lí',rule:'Giao hoán: a · b = b · a. Kết hợp: a · (b · c) = (a · b) · c. Phân phối: a · (b + c) = a · b + a · c và a · (b − c) = a · b − a · c. Trong một tích nhiều thừa số có thể đổi chỗ, nhóm các thừa số tùy ý để tính nhẩm (ví dụ 4 · 25 = 100).',tip:'Khi dùng tính chất phân phối phải nhân a với tất cả các số hạng trong ngoặc và giữ đúng dấu của từng tích.'},
  bt:{short:'Giá trị biểu thức, so sánh',name:'Giá trị biểu thức, so sánh tích',rule:'Thay số vào biểu thức (số âm đặt trong ngoặc) rồi thực hiện phép nhân trước, phép cộng, trừ sau. So sánh tích không cần tính: xét dấu của mỗi tích rồi so sánh với số 0 hoặc với số kia.',tip:'Khi thay số âm, nhớ đặt trong ngoặc và tính dấu của tích trước khi cộng, trừ.'},
  vd:{short:'Vận dụng thực tế',name:'Vận dụng vào bài toán thực tế',rule:'Khoản chi, nhiệt độ giảm, điểm bị trừ được biểu diễn bằng số nguyên âm. Cộng nhiều lần cùng một số là phép nhân: k lần số (−a) là (−a) · k. Viết thành biểu thức rồi tính, chú ý dấu của tích.',tip:'Đọc kĩ đề để biết đại lượng nào là số âm, rồi mới nhân. Trước đó h giờ là −h giờ.'}
};
const TKEYS=['qt','tc','bt','vd'];
const TDESC={qt:'Tích hai số nguyên khác dấu, cùng dấu, nhân với 0, dấu của tích nhiều thừa số',tc:'Giao hoán, kết hợp, phân phối, tính nhẩm và tính hợp lí',bt:'Thay số vào biểu thức, so sánh tích không tính, tháp số',vd:'Khoản chi, ném tiêu, tăng giảm vải, nhiệt độ, điểm thi'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhớ quy tắc nhân, nhận ra tính chất của phép nhân, nhân hai số một bước.',TH:'Tính tích hai số nguyên, xét dấu của tích nhiều thừa số, dùng tính chất để tính nhẩm, thay số vào biểu thức, so sánh tích.',VD:'Tính hợp lí biểu thức dài, biểu thức nhiều bước, tháp số, bài toán thực tế nhiều bước.'};

/* ============ Ngân hàng nhiều lựa chọn ============ */
const MC=[
 {id:'m1',topic:'qt',level:'NB',stem:'Tích của hai số nguyên khác dấu là:',ans:0,opts:[
   O('một số nguyên âm'),O('một số nguyên dương','Khác dấu thì tích âm. Ví dụ 25 · (−4) = −100.'),O('bằng 0','Tích bằng 0 chỉ khi có một thừa số bằng 0.'),O('có thể âm, có thể dương','Hai số khác dấu thì tích luôn là số âm.')],
  exp:'Muốn nhân hai số nguyên khác dấu, ta nhân phần số tự nhiên của hai số rồi đặt dấu "−" trước kết quả. Ví dụ (−10) · 11 = −110.'},
 {id:'m2',topic:'qt',level:'NB',stem:'Tích của hai số nguyên âm là:',ans:0,opts:[
   O('một số nguyên dương'),O('một số nguyên âm','Hai số cùng dấu thì tích dương. Ví dụ (−10) · (−15) = 150.'),O('bằng 0','Hai số âm đều khác 0 nên tích khác 0.'),O('một số nguyên âm lớn hơn các thừa số','Tích của hai số nguyên âm là số dương.')],
  exp:'(−m) · (−n) = m · n. Ví dụ (−10) · (−15) = 10 · 15 = 150.'},
 {id:'m3',topic:'qt',level:'NB',stem:'Với m, n là các số tự nhiên khác 0, đẳng thức nào sau đây đúng?',ans:0,opts:[
   O(nb('(−m) · (−n) = m · n')),O(nb('(−m) · (−n) = −(m · n)'),'Tích của hai số âm là số dương.'),O(nb('m · (−n) = m · n'),'Tích của hai số khác dấu là số âm: m · (−n) = −(m · n).'),O(nb('(−m) · n = m · n'),'Tích của hai số khác dấu là số âm: (−m) · n = −(m · n).')],
  exp:'Hai số cùng dấu thì tích dương, hai số khác dấu thì tích âm.'},
 {id:'m4',topic:'qt',level:'NB',stem:'Với mọi số nguyên a, tích '+nb('a · 0')+' bằng:',ans:0,opts:[
   O('0'),O('a','Nhân với 0 luôn cho kết quả 0, không phải a.'),O('1','Nhân với 0 luôn cho kết quả 0.'),O('−a','Nhân với 0 luôn cho kết quả 0.')],
  exp:'Tích của một số nguyên với 0 luôn bằng 0: a · 0 = 0 · a = 0.'},
 {id:'m5',topic:'qt',level:'VD',stem:'Cho hai số nguyên a, b thỏa mãn '+nb('a · b > 0')+' và '+nb('a + b < 0')+'. Khẳng định nào đúng?',ans:0,opts:[
   O('a và b đều là số nguyên âm'),O('a và b đều là số nguyên dương','Hai số dương có tổng dương, không thỏa a + b < 0.'),O('a âm, b dương','Hai số khác dấu có tích âm, không thỏa a · b > 0.'),O('a dương, b âm','Hai số khác dấu có tích âm, không thỏa a · b > 0.')],
  exp:'a · b > 0 nên a, b cùng dấu. a + b < 0 nên không thể cùng dương. Vậy a, b đều âm.'},
 {id:'m6',topic:'qt',level:'VD',stem:'Cho bốn số nguyên khác 0 có tính chất: tích của ba số bất kì trong bốn số đó luôn là số nguyên âm. Tích của cả bốn số là:',ans:0,opts:[
   O('một số nguyên dương'),O('một số nguyên âm','Cả bốn số đều âm (có bốn thừa số âm) nên tích dương.'),O('bằng 0','Bốn số đều khác 0 nên tích khác 0.'),O('có thể âm, có thể dương','Từ điều kiện suy ra cả bốn số đều âm nên tích xác định là số dương.')],
  exp:'Nếu có một số dương a thì tích của a với hai số bất kì còn lại phải âm, nên ba số còn lại đôi một khác dấu. Điều đó không thể xảy ra. Vậy cả bốn số đều âm, tích bốn số âm là số dương.'},
 {id:'m7',topic:'tc',level:'NB',stem:'Tính chất phân phối của phép nhân đối với phép cộng được viết là:',ans:0,opts:[
   O(nb('a · (b + c) = a · b + a · c')),O(nb('a · (b + c) = a · b + c'),'Phải nhân a với cả b và c.'),O(nb('a · (b + c) = a + b · c'),'Phải nhân a với cả b và c.'),O(nb('a · b = b · a'),'Đây là tính chất giao hoán.')],
  exp:'Ví dụ (−2) · (150 + 14) = (−2) · 150 + (−2) · 14 = −328.'},
 {id:'m8',topic:'tc',level:'TH',stem:'Giá trị của tích '+nb('(−25) · (−17) · 4')+' là:',ans:0,opts:[
   O('1 700'),O('−1 700','Có hai thừa số âm nên tích dương.'),O('170','Bạn bỏ sót một chữ số 0: 25 · 4 = 100.'),O('17 000','Bạn thừa một chữ số 0: 25 · 4 = 100.')],
  exp:'(−25) · (−17) · 4 = (−25) · 4 · (−17) = (−100) · (−17) = 1 700.'},
 {id:'m9',topic:'tc',level:'TH',stem:'Giá trị của '+nb('(−2) · (150 + 14)')+' là:',ans:0,opts:[
   O('−328'),O('328','Tích của số âm với số dương là số âm.'),O('−286','Phải nhân (−2) với cả 150 và 14: (−2) · 150 + (−2) · 14.'),O('−272','(−2) · 14 = −28, phải cộng −28 chứ không trừ.')],
  exp:'(−2) · (150 + 14) = (−2) · 150 + (−2) · 14 = (−300) + (−28) = −328.'},
 {id:'m10',topic:'tc',level:'NB',stem:'Phép nhân cũng có tính chất phân phối đối với phép trừ. Đẳng thức nào đúng?',ans:0,opts:[
   O(nb('a · (b − c) = a · b − a · c')),O(nb('a · (b − c) = a · b + a · c'),'Phải giữ dấu "−" trước a · c.'),O(nb('a · (b − c) = a · b − c'),'Phải nhân a với cả b và c.'),O(nb('a · (b − c) = a − b · c'),'Phải nhân a với cả b và c.')],
  exp:'Ví dụ 4 · (−39) − 4 · (−14) = 4 · (−39 + 14) = 4 · (−25) = −100.'},
 {id:'m11',topic:'tc',level:'TH',stem:'Giá trị của tích '+nb('P = 3 · (−4) · 5 · (−6)')+' là:',ans:0,opts:[
   O('360'),O('−360','Có hai thừa số âm (số chẵn) nên tích dương.'),O('36','Bạn bỏ sót một chữ số 0.'),O('3 600','Bạn thừa một chữ số 0.')],
  exp:'Có hai thừa số âm nên tích dương: 3 · 4 · 5 · 6 = 360.'},
 {id:'m12',topic:'tc',level:'VD',stem:'Cho '+nb('P = 3 · (−4) · 5 · (−6)')+'. Nếu đổi dấu tất cả các thừa số của P thì giá trị của P:',ans:0,opts:[
   O('không thay đổi'),O('đổi dấu','Bốn thừa số đều đổi dấu thì có thêm bốn lần đổi dấu, một số chẵn lần nên tích không đổi.'),O('bằng 0','Các thừa số đều khác 0 nên tích khác 0.'),O('giảm đi một nửa','Độ lớn của tích không đổi.')],
  exp:'Mỗi lần đổi dấu một thừa số thì tích đổi dấu. Đổi dấu cả bốn thừa số là đổi dấu bốn lần (số chẵn) nên tích không thay đổi: (−3) · 4 · (−5) · 6 = 360.'},
 {id:'m13',topic:'bt',level:'TH',stem:'Tính '+nb('a · (b + c)')+' khi '+nb('a = −2')+', '+nb('b = 14')+', '+nb('c = −4')+'.',ans:0,opts:[
   O('−20'),O('20','Tích của số âm với số dương là số âm.'),O('−32','Phải nhân a với cả b và c: a · b + a · c = −28 + 8.'),O('−36','a · c = (−2) · (−4) = 8, không phải −8.')],
  exp:'a · (b + c) = (−2) · (14 + (−4)) = (−2) · 10 = −20. Cũng có a · b + a · c = −28 + 8 = −20.'},
 {id:'m14',topic:'bt',level:'VD',stem:'Một tháp số có hàng dưới cùng gồm bốn ô, từ trái sang phải là −1; ?; ?; −1. Hàng thứ ba có ba ô là −1; ?; 1. Mỗi ô ở hàng trên bằng tích của hai ô kề nó ở hàng dưới. Số ở ô trên cùng là:',ans:0,opts:[
   O('−1'),O('1','Hai ô ở hàng thứ hai là 1 và −1, tích của chúng là −1.'),O('0','Các ô đều khác 0 nên tích khác 0.'),O('−2','Mọi ô đều là 1 hoặc −1 nên tích cũng là 1 hoặc −1.')],
  exp:'Ô thứ hai hàng dưới cùng: (−1) · ? = −1 nên ? = 1; ô thứ ba: ? · (−1) = 1 nên ? = −1. Hàng thứ ba: −1; −1; 1. Hàng thứ hai: (−1) · (−1) = 1 và (−1) · 1 = −1. Đỉnh: 1 · (−1) = −1.'},
 {id:'m16',topic:'vd',level:'NB',stem:'Bạn Cao ghi vào sổ tay ba lần mỗi lần −15 000 đồng (số âm là khoản chi). Tổng số đã ghi của ba lần đó là:',ans:0,opts:[
   O('−45 000 đồng'),O('45 000 đồng','Khoản chi được ghi bằng số âm nên tổng cũng là số âm.'),O('−15 003 đồng','Cộng ba lần số −15 000 là phép nhân (−15 000) · 3, không phải cộng với 3.'),O('−5 000 đồng','Số tiền chi của ba lần phải lớn hơn một lần chi nhiều lần.')],
  exp:'(−15 000) · 3 = −45 000 (đồng). Bạn Cao đã chi 45 000 đồng.'},
 {id:'m17',topic:'vd',level:'TH',stem:'Ba bạn An, Bình, Cường chơi ném tiêu, mỗi bạn ném 5 lần. Mỗi lần ném được 10, 7, 3, −1 hoặc −3 điểm. Bảng cho biết số lần mỗi bạn ném được từng mức điểm. Bạn nào đạt điểm cao nhất?',fig:null,ans:0,opts:[
   O('Cường'),O('An','An được 10 + 14 + 0 − 1 − 3 = 20 điểm, ít hơn Cường.'),O('Bình','Bình được 20 + 0 + 3 + 0 − 6 = 17 điểm, ít hơn Cường.'),O('An và Bình bằng điểm','An được 20 điểm, Bình được 17 điểm.')],
  exp:'An: 1 · 10 + 2 · 7 + 0 · 3 + 1 · (−1) + 1 · (−3) = 20. Bình: 2 · 10 + 0 · 7 + 1 · 3 + 0 · (−1) + 2 · (−3) = 17. Cường: 0 · 10 + 3 · 7 + 1 · 3 + 1 · (−1) + 0 · (−3) = 23. Cường cao nhất.'}
].map(q=>Object.assign({type:'mc'},q));
MC.find(q=>q.id==='m17').fig=tbl(['Bạn','10 điểm','7 điểm','3 điểm','−1 điểm','−3 điểm'],[['An','1','2','0','1','1'],['Bình','2','0','1','0','2'],['Cường','0','3','1','1','0']]);
const addMC=(id,topic,level,gen)=>MC.push({id,type:'mc',topic,level,gen});
const rep=(n,f)=>[...Array(n).keys()].map(i=>f('abcdef'[i]));
rep(2,x=>addMC('g_qtsign_nb_'+x,'qt','NB',genQtSignNB));
rep(3,x=>addMC('g_tcname_'+x,'tc','NB',genTcName));
rep(3,x=>addMC('g_vdspend_'+x,'vd','NB',genVdSpend));
rep(3,x=>addMC('g_qtmul_'+x,'qt','TH',genQtMul));
rep(3,x=>addMC('g_qtsign_th_'+x,'qt','TH',genQtSignTH));
rep(3,x=>addMC('g_qtfrom_'+x,'qt','TH',genQtFrom));
rep(3,x=>addMC('g_tccomb_'+x,'tc','TH',genTcComb));
rep(3,x=>addMC('g_tcdist_'+x,'tc','TH',genTcDist));
rep(2,x=>addMC('g_tcfac_'+x,'tc','TH',genTcFac));
rep(2,x=>addMC('g_tcsame_'+x,'tc','TH',genTcSame));
rep(3,x=>addMC('g_bteval_'+x,'bt','TH',genBtEval));
rep(2,x=>addMC('g_btabc_'+x,'bt','TH',genBtAbc));
rep(3,x=>addMC('g_btcmp_'+x,'bt','TH',genBtCmp));
rep(3,x=>addMC('g_vddart_'+x,'vd','TH',genVdDart));
rep(3,x=>addMC('g_vdfab_'+x,'vd','TH',genVdFab));
rep(3,x=>addMC('g_tchard_'+x,'tc','VD',genTcHard));
rep(2,x=>addMC('g_bteval2_'+x,'bt','VD',genBtEval2));
rep(2,x=>addMC('g_btpyr_'+x,'bt','VD',genBtPyr));
rep(3,x=>addMC('g_vdback_'+x,'vd','VD',genVdBack));
rep(3,x=>addMC('g_vdscore_'+x,'vd','VD',genVdScore));

/* ============ Đúng sai ============ */
function qtMulItem(){const a=ri(3,30),b=ri(3,30),x=sgn()*a,y=sgn()*b,p=x*y,t=RNG()<.5,shown=t?p:sel([-p,x+y,p+sgn()*a].filter(v=>v!==p));
  return IT(`${PRD([x,y])} = ${N(shown)}`,t,'qt','TH',`${p<0?'Hai số khác dấu nên tích âm':'Hai số cùng dấu nên tích dương'}: ${nb(`${a} · ${b} = ${a*b}`)}. Vậy ${PRD([x,y])} = ${N(p)}${t?'.':`, không phải ${N(shown)}.`}`);}
function qtSignItem(){const o=signQ(ri(3,5),false),p=prod(o.f),t=RNG()<.5,claim=(p<0)===t?'âm':'dương';
  return IT(`Tích ${PRD(o.f)} là một số nguyên ${claim}.`,t,'qt','TH',`Có ${o.k} thừa số âm, ${o.k%2?'số lẻ nên tích là số nguyên âm':'số chẵn nên tích là số nguyên dương'}${t?'.':`, không phải số nguyên ${claim}.`}`);}
function qtFromItem(){const [n,m]=sel([[3,12],[4,9],[6,6],[2,18],[4,12],[5,10]]),P0=n*m,k=sel(['n · (−m)','(−n) · m','(−n) · (−m)']),v=k==='(−n) · (−m)'?P0:-P0,t=RNG()<.5,shown=t?v:-v;
  return IT(`Nếu ${nb('n · m = '+P0)} thì ${nb(k+' = '+N(shown))}.`,t,'qt','TH',`${k==='(−n) · (−m)'?'(−n) · (−m) = n · m':k+' = −(n · m)'} = ${N(v)}${t?'.':`, không phải ${N(shown)}.`}`);}
const PTV=[IT('Nếu a · b > 0 thì a và b cùng dấu.',true,'qt','VD','Tích dương chỉ khi hai thừa số cùng dấu.'),
  IT('Nếu a · b < 0 thì a và b khác dấu.',true,'qt','VD','Tích âm chỉ khi hai thừa số khác dấu.'),
  IT('Nếu a < 0 và a · b > 0 thì b < 0.',true,'qt','VD','a âm, tích dương nên b cùng dấu với a, tức b âm.'),
  IT('Tích của 5 số nguyên âm là một số nguyên âm.',true,'qt','VD','Có 5 thừa số âm (số lẻ) nên tích âm.'),
  IT('Tích của 6 số nguyên âm là một số nguyên dương.',true,'qt','VD','Có 6 thừa số âm (số chẵn) nên tích dương.')];
const PFV=[IT('Nếu a · b > 0 thì a > 0 và b > 0.',false,'qt','VD','Có thể a, b cùng âm, ví dụ (−2) · (−3) = 6 > 0.'),
  IT('Tích của 4 số nguyên âm là một số nguyên âm.',false,'qt','VD','Có 4 thừa số âm (số chẵn) nên tích dương.'),
  IT('Nếu a < 0 và a · b < 0 thì b < 0.',false,'qt','VD','a âm, tích âm nên b khác dấu với a, tức b dương.'),
  IT('Tích của 3 số nguyên âm và 2 số nguyên dương là một số nguyên dương.',false,'qt','VD','Có 3 thừa số âm (số lẻ) nên tích âm.'),
  IT('Nếu a · b < 0 thì a < 0 và b < 0.',false,'qt','VD','a · b < 0 thì a, b khác dấu, không thể cùng âm.')];
const tfQtVD=()=>({stem:'Xét các phát biểu sau:',items:pick4(PTV,PFV)});
function tcItem(){const [a,b,c]=[nz(2,9),nz(10,60),nz(2,9)],t=RNG()<.5,k=ri(0,2);
  if(k===0){const e=`${P(a)} · (${N(b)} + ${P(c)}) = ${P(a)} · ${P(b)} + `,r=t?`${P(a)} · ${P(c)}`:P(c);return IT(nb(e+r),t,'tc','TH',`Tính chất phân phối: a · (b + c) = a · b + a · c${t?'.':`. Vế phải phải là ${nb(`${P(a)} · ${P(b)} + ${P(a)} · ${P(c)}`)}.`}`);}
  if(k===1){const e=`${P(a)} · (${N(b)} − ${P(c)}) = ${P(a)} · ${P(b)} `,r=t?`− ${P(a)} · ${P(c)}`:`+ ${P(a)} · ${P(c)}`;return IT(nb(e+r),t,'tc','TH',`Tính chất phân phối đối với phép trừ: a · (b − c) = a · b − a · c${t?'.':'. Phải giữ dấu "−" trước a · c.'}`);}
  const l=`(${P(a)} · ${P(b)}) · ${P(c)} = ${P(a)} · `,r=t?`(${P(b)} · ${P(c)})`:`(${P(b)} + ${P(c)})`;
  if(!t&&a*b*c===a*(b+c))return null;
  return IT(nb(l+r),t,'tc','TH',`Tính chất kết hợp: (a · b) · c = a · (b · c)${t?'.':'. Không thể thay phép nhân bằng phép cộng.'}`);}
function tcValItem(){const k=ri(0,3),t=RNG()<.5;let e,v,x;
  if(k===0){x=combData();e=PRD(x.f);v=x.p;}
  else if(k===1){x=facData();e=x.txt;v=x.val;}
  else if(k===2){x=sameData();e=x.txt;v=x.val;}
  else{x=hardData();e=x.txt;v=x.val;}
  const shown=t?v:(k===0?-v:x.wv[ri(0,x.wv.length-1)]);if(!t&&shown===v)return null;
  return IT(`${e} = ${NN(shown)}`,t,'tc','VD',`${x.exp.replace(/\.$/,'')}${t?'.':`, không phải ${NN(shown)}.`}`);}
const RW={'>':'lớn hơn','<':'nhỏ hơn','=':'bằng'};
function btCmpItem(){const o=cmpData(),t=RNG()<.5,rel=t?o.rel:sel(['>','<','='].filter(r=>r!==o.rel));
  return IT(`${o.l} ${RW[rel]} ${o.r}.`,t,'bt','TH',`${o.why}${t?'':` Vậy ${o.l} ${RW[o.rel]} ${o.r}.`}`);}
function btEvalItem(){const o=evalData(),t=RNG()<.5,shown=t?o.val:sel(o.wv.filter(v=>v!==o.val));
  return IT(`Khi ${nb('x = '+N(o.x))} và ${nb('y = '+N(o.y))}, biểu thức ${nb('A = '+o.expr)} có giá trị ${N(shown)}.`,t,'bt','VD',`${o.exp.replace(/\.$/,'')}${t?'.':`, không phải ${N(shown)}.`}`);}
/* --- ý đúng sai nhận biết --- */
const PT={
 qt:[IT('Tích của hai số nguyên khác dấu là một số nguyên âm.',true,'qt','NB','Ví dụ 25 · (−4) = −100.'),
     IT('Tích của hai số nguyên âm là một số nguyên dương.',true,'qt','NB','Ví dụ (−10) · (−15) = 150.'),
     IT(nb('a · 0 = 0')+' với mọi số nguyên a.',true,'qt','NB','Tích của một số nguyên với 0 luôn bằng 0.'),
     IT(nb('(−m) · (−n) = m · n')+' với m, n là các số tự nhiên khác 0.',true,'qt','NB','Tích của hai số nguyên âm bằng tích hai số tự nhiên tương ứng.'),
     IT(nb('(−6) · 7 = −42'),true,'qt','NB','Hai số khác dấu nên tích âm: 6 · 7 = 42.')],
 tc:[IT('Phép nhân các số nguyên có tính chất giao hoán: '+nb('a · b = b · a')+'.',true,'tc','NB','Đổi chỗ các thừa số thì tích không đổi.'),
     IT(nb('a · (b · c) = (a · b) · c')+' với mọi số nguyên a, b, c.',true,'tc','NB','Đây là tính chất kết hợp.'),
     IT(nb('a · (b + c) = a · b + a · c')+' với mọi số nguyên a, b, c.',true,'tc','NB','Đây là tính chất phân phối của phép nhân đối với phép cộng.'),
     IT(nb('a · (b − c) = a · b − a · c')+' với mọi số nguyên a, b, c.',true,'tc','NB','Phép nhân cũng phân phối đối với phép trừ.'),
     IT('Trong một tích nhiều thừa số, ta có thể đổi chỗ các thừa số tùy ý.',true,'tc','NB','Nhờ tính chất giao hoán và kết hợp.')],
 bt:[IT('Nếu '+nb('a < 0')+' và '+nb('b > 0')+' thì '+nb('a · b < 0')+'.',true,'bt','NB','Hai số khác dấu thì tích âm.'),
     IT('Tích của hai số nguyên âm lớn hơn 0.',true,'bt','NB','Tích của hai số nguyên âm là số dương.'),
     IT(nb('(−15) · (−15) = 15 · 15')+'.',true,'bt','NB','Tích của hai số nguyên âm bằng tích của hai số đối của chúng.'),
     IT('Khi thay số âm vào biểu thức, ta nên đặt số âm trong ngoặc.',true,'bt','NB','Ví dụ 3x với x = −2 là 3 · (−2).'),
     IT(nb('(−10) · 7 < 7')+'.',true,'bt','NB','(−10) · 7 = −70 là số âm, nhỏ hơn 7.')],
 vd:[IT('Khoản chi 15 000 đồng được ghi là −15 000 đồng.',true,'vd','NB','Khoản chi được ghi bằng số nguyên âm.'),
     IT('Ghi ba lần mỗi lần −15 000 đồng thì tổng các số ghi là '+nb('(−15 000) · 3 = −45 000')+'.',true,'vd','NB','Cộng ba lần số −15 000 là phép nhân (−15 000) · 3.'),
     IT('Mỗi giờ nhiệt độ giảm 2 °C thì sau 3 giờ nhiệt độ thay đổi '+nb('(−2) · 3 = −6')+' (°C).',true,'vd','NB','Giảm là số âm nên tích là số âm.'),
     IT('Mỗi câu sai bị trừ 2 điểm, sai 3 câu thì tổng điểm bị trừ là '+nb('(−2) · 3 = −6')+' điểm.',true,'vd','NB','Bị trừ điểm là số âm.'),
     IT('Số vải của mỗi bộ quần áo giảm 10 dm, may 100 bộ thì số vải thay đổi '+nb('100 · (−10) = −1 000')+' dm.',true,'vd','NB','Giảm là số âm nên tích là số âm.')]};
const PF={
 qt:[IT('Tích của hai số nguyên âm là một số nguyên âm.',false,'qt','NB','Tích của hai số nguyên âm là số nguyên dương.'),
     IT('Tích của hai số nguyên khác dấu là một số nguyên dương.',false,'qt','NB','Tích của hai số nguyên khác dấu là số nguyên âm.'),
     IT(nb('a · 0 = a')+' với mọi số nguyên a.',false,'qt','NB','a · 0 = 0 với mọi số nguyên a.'),
     IT(nb('(−3) · (−4) = −12'),false,'qt','NB','Hai số cùng dấu nên tích dương: (−3) · (−4) = 12.'),
     IT(nb('(−5) · 7 = 35'),false,'qt','NB','Hai số khác dấu nên tích âm: (−5) · 7 = −35.'),
     IT('Tích của một số nguyên âm và một số nguyên dương có thể là số nguyên dương.',false,'qt','NB','Tích của hai số nguyên khác dấu luôn là số nguyên âm.')],
 tc:[IT(nb('a · (b + c) = a · b + c')+' với mọi số nguyên a, b, c.',false,'tc','NB','Phải nhân a với cả b và c.'),
     IT(nb('a · (b − c) = a · b + a · c')+' với mọi số nguyên a, b, c.',false,'tc','NB','a · (b − c) = a · b − a · c.'),
     IT('Phép nhân các số nguyên không có tính chất giao hoán.',false,'tc','NB','Phép nhân các số nguyên có tính chất giao hoán: a · b = b · a.'),
     IT(nb('(a · b) · c = a · (b + c)')+' với mọi số nguyên a, b, c.',false,'tc','NB','Tính chất kết hợp là (a · b) · c = a · (b · c).'),
     IT('Trong một tích nhiều thừa số, ta không được dùng dấu ngoặc để nhóm các thừa số.',false,'tc','NB','Ta có thể nhóm các thừa số tùy ý bằng dấu ngoặc.')],
 bt:[IT(nb('(−12) · 5 > 0')+'.',false,'bt','NB','(−12) · 5 = −60 là số âm.'),
     IT(nb('(−8) · (−9) < 0')+'.',false,'bt','NB','(−8) · (−9) = 72 là số dương.'),
     IT('Nếu '+nb('a · b < 0')+' thì a và b cùng dấu.',false,'bt','NB','Tích âm thì hai thừa số khác dấu.'),
     IT('Tích của hai số nguyên âm luôn nhỏ hơn 0.',false,'bt','NB','Tích của hai số nguyên âm là số dương.'),
     IT(nb('(−10) · 7 > 7')+'.',false,'bt','NB','(−10) · 7 = −70 là số âm, nhỏ hơn 7.')],
 vd:[IT('Ghi ba lần mỗi lần −15 000 đồng thì tổng các số ghi là 45 000.',false,'vd','NB','Tổng các số ghi là (−15 000) · 3 = −45 000.'),
     IT('Mỗi giờ nhiệt độ giảm 2 °C thì sau 3 giờ nhiệt độ tăng 6 °C.',false,'vd','NB','Nhiệt độ giảm nên thay đổi (−2) · 3 = −6 (°C).'),
     IT('Mỗi câu sai bị trừ 2 điểm, sai 3 câu thì tổng điểm bị trừ được viết là 6 điểm.',false,'vd','NB','Bị trừ điểm là số âm: (−2) · 3 = −6 điểm.'),
     IT('Khoản nợ 50 nghìn đồng có thể ghi là 50 nghìn đồng.',false,'vd','NB','Khoản nợ ghi bằng số âm: −50 nghìn đồng.'),
     IT('Số vải của mỗi bộ quần áo giảm 10 dm, may 100 bộ thì số vải thay đổi 1 000 dm.',false,'vd','NB','Giảm là số âm: 100 · (−10) = −1 000 (dm).')]};
const tfNB=k=>()=>({stem:'Xét các phát biểu sau:',items:pick4(PT[k],PF[k])});
function tfCtx(make){return ()=>{
  for(let n=0;n<60;n++){const q=make(),k=q.items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(q.items.map(i=>i.t)).size===4)return q;}
  return FB_TF();};}
function ctxDart(){const d=dartData(),v=[0,1,2,3].map(()=>RNG()<.5),ia=ri(0,2),S=sum(d.sc),order=[0,1,2].sort((x,y)=>d.sc[y]-d.sc[x]),hi=d.names[order[0]],lo=d.names[order[1]],other=sel(d.names.filter(n=>n!==d.top)),wr=d.sc[ia]+sel([-2,2,4]);
  return {stem:DSTEM,fig:d.fig,items:[
    IT(`${d.names[ia]} được ${N(v[0]?d.sc[ia]:wr)} điểm.`,v[0],'vd','TH',`${dartExp(d,ia)}${v[0]?'':` Không phải ${N(wr)} điểm.`}`),
    IT(`${v[1]?hi:lo} được nhiều điểm hơn ${v[1]?lo:hi}.`,v[1],'vd','TH',`${dartExp(d,order[0])} ${dartExp(d,order[1])}`),
    IT(`Bạn ${v[2]?d.top:other} đạt điểm cao nhất.`,v[2],'vd','TH',`${d.names.map((n,i)=>dartExp(d,i)).join(' ')} Bạn ${d.top} cao nhất.`),
    IT(`Tổng điểm của ba bạn là ${N(v[3]?S:S+sel([-3,3,5]))}.`,v[3],'vd','VD',`${d.sc.map(N).join(' + ')} = ${N(S)}.`)]};}
function ctxScore(){const o=scoreData(),v=[0,1,2,3].map(()=>RNG()<.5),{a,b,c,w,val}=o;
  return {stem:o.stem.replace(' Tổng điểm của Lan là bao nhiêu?',''),items:[
    IT(`Các câu đúng được tất cả ${v[0]?a*c:a*c+sel([-a,a])} điểm.`,v[0],'vd','TH',`${nb(`${a} · ${c} = ${a*c}`)} (điểm).`),
    IT(`Các câu sai làm Lan bị trừ tất cả ${v[1]?b*w:b*w+sel([-b,b])} điểm.`,v[1],'vd','TH',`${nb(`${b} · ${w} = ${b*w}`)} (điểm), vì mỗi câu sai bị trừ ${b} điểm.`),
    IT(`Tổng điểm của Lan là ${N(v[2]?val:val+2*b*w)}.`,v[2],'vd','VD',`${nb(`${a*c} + (−${b*w}) = ${N(val)}`)} (điểm).`),
    IT(`Tổng điểm của Lan ${v[3]?'nhỏ hơn':'lớn hơn'} ${a*c} điểm.`,v[3],'vd','VD',`Các câu sai làm mất điểm nên tổng điểm ${N(val)} nhỏ hơn ${a*c} điểm.`)]};}
function ctxFab(){const n=sel([250,420,450,500,1500]),a=ri(5,25),b=ri(5,25),v=[0,1,2,3].map(()=>RNG()<.5);
  return {stem:`Một xí nghiệp may mỗi ngày ${n} bộ quần áo. Theo mẫu mới, số vải dùng để may một bộ thay đổi x dm so với mẫu cũ (số dương là tăng, số âm là giảm).`,items:[
    IT(`Khi ${nb('x = '+a)}, mỗi ngày số vải dùng thay đổi ${NN(v[0]?n*a:n+a)} dm.`,v[0],'vd','TH',`${nb(`${n} · ${a} = ${NN(n*a)}`)} (dm)${v[0]?'.':`, không phải ${NN(n+a)} dm.`}`),
    IT(`Khi ${nb('x = −'+b)}, mỗi ngày số vải dùng thay đổi ${NN(v[1]?-n*b:n*b)} dm.`,v[1],'vd','TH',`${nb(`${n} · (−${b}) = ${NN(-n*b)}`)} (dm)${v[1]?'.':`. Dấu của tích là "−", không phải ${NN(n*b)}.`}`),
    IT(`Khi ${nb('x = −'+b)}, mỗi ngày xí nghiệp dùng ${v[2]?'ít':'nhiều'} vải hơn trước.`,v[2],'vd','TH',`Số vải thay đổi ${nb(`${n} · (−${b}) = ${NN(-n*b)}`)} dm là số âm nên số vải giảm, tức là dùng ít vải hơn.`),
    IT(`Khi ${nb('x = −'+b)}, sau hai ngày tổng số vải thay đổi ${NN(v[3]?-2*n*b:-n*b)} dm.`,v[3],'vd','VD',`Mỗi ngày thay đổi ${NN(-n*b)} dm, hai ngày thay đổi ${nb(`2 · (${NN(-n*b)}) = ${NN(-2*n*b)}`)} dm${v[3]?'.':`, không phải ${NN(-n*b)} dm.`}`)]};}
const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
const tQtTH=four(qtMulItem),tQtTH2=four(()=>sel([qtSignItem,qtFromItem,qtMulItem])()),tTcTH=four(tcItem),tTcVD=four(tcValItem),tBtTH=four(btCmpItem),tBtVD=four(btEvalItem);
['a','b'].forEach(x=>{
  addTF('tf_qt_th_'+x,'qt','TH',x==='a'?tQtTH:tQtTH2);
  addTF('tf_qt_vd_'+x,'qt','VD',tfQtVD);
  addTF('tf_tc_th_'+x,'tc','TH',tTcTH);addTF('tf_tc_vd_'+x,'tc','VD',tTcVD);
  addTF('tf_bt_th_'+x,'bt','TH',tBtTH);addTF('tf_bt_vd_'+x,'bt','VD',tBtVD);
});
addTF('tf_ctx_dart','vd','VD',tfCtx(ctxDart));
addTF('tf_ctx_score','vd','VD',tfCtx(ctxScore));
addTF('tf_ctx_fab','vd','VD',tfCtx(ctxFab));
['qt','tc','bt','vd'].forEach(k=>addTF('tf_nb_'+k,k,'NB',tfNB(k)));
addTF('tf_nb_qt2','qt','NB',tfNB('qt'));

/* ============ Trả lời ngắn ============ */
function saQtMul(){const a=ri(3,30),b=ri(3,30),x=sgn()*a,y=sgn()*b;return{stem:`Tính ${PRD([x,y])}.`,ans:[x*y],exp:`${x*y<0?'Hai số khác dấu nên tích âm':'Hai số cùng dấu nên tích dương'}: ${nb(`${a} · ${b} = ${a*b}`)}. Vậy ${PRD([x,y])} = ${N(x*y)}.`};}
function saQtTbl(){const x=nz(5,25),y=nz(5,25);return{stem:`Cho ${nb('x = '+N(x))} và ${nb('y = '+N(y))}. Tính ${nb('x · y')}.`,ans:[x*y],exp:`${nb(`x · y = ${P(x)} · ${P(y)} = ${N(x*y)}`)}.`};}
function saQtFrom(){const [n,m]=sel([[3,12],[4,9],[6,6],[2,18],[4,12],[5,10],[3,16],[6,8]]),P0=n*m,k=sel(['n · (−m)','(−n) · m','(−n) · (−m)']),v=k==='(−n) · (−m)'?P0:-P0;
  return{stem:`Cho n và m là hai số tự nhiên có tích ${nb('n · m = '+P0)}. Tính ${nb(k)}.`,ans:[v],exp:`${k==='(−n) · (−m)'?'Hai số cùng dấu nên (−n) · (−m) = n · m':'Hai số khác dấu nên '+k+' = −(n · m)'} = ${N(v)}.`};}
function saTcComb(){const o=combData();return{stem:`Tính ${PRD(o.f)}.`,ans:[o.p],exp:o.exp};}
function saTcDist(){const o=distData();return{stem:`Tính ${o.txt}.`,ans:[o.val],exp:o.exp};}
function saTcFac(){const o=facData();return{stem:`Tính ${o.txt}.`,ans:[o.val],exp:o.exp};}
function saTcSame(){const o=sameData();return{stem:`Tính một cách hợp lí: ${o.txt}.`,ans:[o.val],exp:o.exp};}
function saTcHard(){const o=hardData();return{stem:`Tính một cách hợp lí: ${o.txt}.`,ans:[o.val],exp:o.exp};}
function saBtEval(){const o=evalData();return{stem:o.stem,ans:[o.val],exp:o.exp};}
function saBtEval2(){const o=eval2Data();return{stem:`Tính giá trị của biểu thức ${o.txt} khi ${nb('x = '+N(o.x))} và ${nb('y = '+N(o.y))}.`,ans:[o.val],exp:o.exp};}
function saBtPyr(){const o=pyrData();return{stem:PYST(o).replace('là:','là bao nhiêu?'),ans:[o.top],exp:o.exp};}
function saVdSpend(){const o=spendData();return{stem:o.stem,ans:[o.v],exp:o.exp};}
function saVdDart(){const d=dartData();return{stem:`${DSTEM} Điểm của bạn cao nhất hơn điểm của bạn thấp nhất bao nhiêu điểm?`,fig:d.fig,ans:[d.mx-Math.min(...d.sc)],exp:`${d.names.map((n,i)=>dartExp(d,i)).join(' ')} Hiệu: ${nb(`${N(d.mx)} − ${P(Math.min(...d.sc))} = ${d.mx-Math.min(...d.sc)}`)} (điểm).`};}
function saVdFab(){const o=fabData();return{stem:o.stem,ans:[o.val],exp:o.exp};}
function saVdBack(){const o=backData();return{stem:o.stem,ans:[o.val],exp:o.exp};}
function saVdScore(){const o=scoreData();return{stem:o.stem,ans:[o.val],exp:o.exp};}
const SA=[
 {id:'s_qt_nb',topic:'qt',level:'NB',unit:'',gen:saQtMul},
 {id:'s_qt_nb2',topic:'qt',level:'NB',unit:'',gen:saQtTbl},
 {id:'s_qt_th',topic:'qt',level:'TH',unit:'',gen:saQtFrom},
 {id:'s_tc_th',topic:'tc',level:'TH',unit:'',gen:saTcComb},
 {id:'s_tc_th2',topic:'tc',level:'TH',unit:'',gen:saTcDist},
 {id:'s_tc_th3',topic:'tc',level:'TH',unit:'',gen:saTcFac},
 {id:'s_tc_th4',topic:'tc',level:'TH',unit:'',gen:saTcSame},
 {id:'s_tc_vd',topic:'tc',level:'VD',unit:'',gen:saTcHard},
 {id:'s_bt_th',topic:'bt',level:'TH',unit:'',gen:saBtEval},
 {id:'s_bt_vd',topic:'bt',level:'VD',unit:'',gen:saBtEval2},
 {id:'s_bt_vd2',topic:'bt',level:'VD',unit:'',gen:saBtPyr},
 {id:'s_vd_nb',topic:'vd',level:'NB',unit:'đồng',gen:saVdSpend},
 {id:'s_vd_th',topic:'vd',level:'TH',unit:'điểm',gen:saVdDart},
 {id:'s_vd_th2',topic:'vd',level:'TH',unit:'dm',gen:saVdFab},
 {id:'s_vd_vd',topic:'vd',level:'VD',unit:'°C',gen:saVdBack},
 {id:'s_vd_vd2',topic:'vd',level:'VD',unit:'điểm',gen:saVdScore}
].map(q=>Object.assign({type:'sa'},q));
SA.push(...SA.map(q=>Object.assign({},q,{id:q.id+'b'})));

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
function tfHardB(){
  for(let n=0;n<80;n++){
    const nn=ri(2,9),mm=ri(1,5),v=[0,1,2,3].map(()=>RNG()<.5),neg=nn%2===1;
    const items=shuffle([
      IT(`Nếu ${nb('a · b > 0')} và ${nb('b · c < 0')} thì ${nb('a · c '+(v[0]?'< 0':'> 0'))}.`,v[0],'qt','VD','a · b > 0 nên a, b cùng dấu; b · c < 0 nên b, c khác dấu. Suy ra a và c khác dấu, tức a · c < 0.'),
      IT(`Tích của ${nn} số nguyên âm và ${mm} số nguyên dương là một số nguyên ${(neg===v[1])?'âm':'dương'}.`,v[1],'qt','VD',`Có ${nn} thừa số âm, ${neg?'số lẻ nên tích âm':'số chẵn nên tích dương'}.`),
      IT(nb(v[2]?'a · (b − c) − a · (b + c) = −2 · a · c':'a · (b − c) − a · (b + c) = 2 · a · c')+' với mọi số nguyên a, b, c.',v[2],'tc','VD','Phân phối: a · b − a · c − a · b − a · c = −2 · a · c.'),
      IT(nb(v[3]?'x · (y + 1) − y · (x + 1) = x − y':'x · (y + 1) − y · (x + 1) = y − x')+' với mọi số nguyên x, y.',v[3],'tc','VD','x · y + x − y · x − y = x − y.')]);
    if(tfOK(items))return {stem:'Xét các phát biểu sau:',items};
  }
  return FB_TF();
}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'qt',level:'VD',gen:tfHardB}],sa:[
 {id:'h_hl',topic:'tc',level:'VD',unit:'',gen:saTcHard},
 {id:'h_from',topic:'qt',level:'VD',unit:'',gen:()=>{const m=ri(5,40),t=ri(2,9),s=sgn(),ab=s*m,val=t*ab;
   return{stem:`Cho hai số nguyên a, b có tích ${nb('a · b = '+N(ab))}. Tính ${nb(`(−a) · b · (−${t})`)}.`,ans:[val],exp:`Đổi dấu hai thừa số a và ${t} nên tích không đổi dấu hai lần: ${nb(`(−a) · b · (−${t}) = ${t} · (a · b) = ${t} · ${P(ab)} = ${N(val)}`)}.`};}},
 {id:'h_diff',topic:'tc',level:'VD',unit:'',gen:()=>{const p=nz(5,60),q=nz(5,60);
   return{stem:`Cho ba số nguyên a, b, c thỏa mãn ${nb(`a · b = ${N(p)}`)} và ${nb(`a · c = ${N(q)}`)}. Tính ${nb('a · (b − c)')}.`,ans:[p-q],exp:`Tính chất phân phối: ${nb(`a · (b − c) = a · b − a · c = ${P(p)} − ${P(q)} = ${N(p-q)}`)}.`};}},
 {id:'h_exp',topic:'bt',level:'VD',unit:'',gen:()=>{const x=nz(2,9),y=nz(2,9),z=nz(2,9),val=z*(x+y);
   return{stem:`Tính giá trị của ${nb('A = x · (y + z) − y · (x − z)')} khi ${nb('x = '+N(x))}, ${nb('y = '+N(y))}, ${nb('z = '+N(z))}.`,ans:[val],exp:`Rút gọn: ${nb('A = x · y + x · z − y · x + y · z = z · (x + y)')}. Thay số: ${nb(`A = ${P(z)} · (${N(x)} + ${P(y)}) = ${P(z)} · ${P(x+y)} = ${N(val)}`)}.`};}},
 {id:'h_pyr',topic:'bt',level:'VD',unit:'',gen:saBtPyr},
 {id:'h_fab',topic:'vd',level:'VD',unit:'dm',gen:()=>{const n1=sel([250,420,450,500]),n2=sel([300,400,600,800]),a=ri(5,20),b=ri(5,20),val=n1*(-a)+n2*b;
   return{stem:`Một xí nghiệp may. Một ngày của tháng đầu may ${n1} bộ, mỗi bộ dùng ít hơn mẫu cũ ${a} dm vải. Một ngày của tháng sau may ${n2} bộ, mỗi bộ dùng nhiều hơn mẫu cũ ${b} dm vải. Tổng số vải dùng của hai ngày đó thay đổi bao nhiêu dm so với mẫu cũ (số dương là tăng, số âm là giảm)?`,ans:[val],exp:`Ngày tháng đầu: ${nb(`${n1} · (−${a}) = ${N(-n1*a)}`)} (dm). Ngày tháng sau: ${nb(`${n2} · ${b} = ${n2*b}`)} (dm). Tổng: ${nb(`${N(-n1*a)} + ${n2*b} = ${N(val)}`)} (dm).`};}}
].map(q=>Object.assign({type:'sa'},q))};

function pisaDart(){const d=dartData(),a=ri(0,2),b=(a+ri(1,2))%3,tot=sum(d.sc),
    rights=[...d.names.map((n,i)=>[n,i])].filter(([n])=>n!==d.top).map(([n,i])=>[n,'Điểm của '+n+' là '+N(d.sc[i])+', chưa phải cao nhất.']);
  return {title:'Trò chơi ném tiêu',ctx:`<p class="stem">${DSTEM}</p>${d.fig}`,qs:[
    saq(`Bạn ${d.names[a]} được bao nhiêu điểm?`,d.sc[a],'điểm',dartExp(d,a),'vd','TH'),
    saq(`Bạn ${d.names[b]} được bao nhiêu điểm?`,d.sc[b],'điểm',dartExp(d,b),'vd','TH'),
    mcq('Bạn nào đạt điểm cao nhất?',d.top,rights.concat([['Ba bạn bằng điểm','Điểm của ba bạn khác nhau: '+d.names.map((n,i)=>n+' '+N(d.sc[i])).join('; ')+'.']]),d.names.map((n,i)=>dartExp(d,i)).join(' ')+` Bạn ${d.top} cao nhất.`,'vd','TH'),
    saq('Điểm cao nhất hơn điểm thấp nhất bao nhiêu điểm?',d.mx-Math.min(...d.sc),'điểm',`${d.names.map((n,i)=>dartExp(d,i)).join(' ')} Hiệu: ${nb(`${N(d.mx)} − ${P(Math.min(...d.sc))} = ${d.mx-Math.min(...d.sc)}`)} (điểm).`,'vd','VD')]};}
function pisaFab(){const n1=sel([250,420,450,500]),n2=sel([300,600,800,1500]),a=ri(5,20),b=ri(5,20),rows=[['Mẫu A',n1+' bộ',N(-a)+' dm'],['Mẫu B',n2+' bộ',N(b)+' dm']],ta=-n1*a,tb=n2*b;
  return {title:'Xí nghiệp may đổi mẫu',ctx:`<p class="stem">Một xí nghiệp thử hai mẫu áo mới. Mỗi ngày xí nghiệp may mỗi mẫu một số bộ như bảng. Cột cuối cho biết số vải dùng cho một bộ thay đổi bao nhiêu so với mẫu cũ (số dương là tăng, số âm là giảm).</p>${tbl(['Mẫu','Số bộ mỗi ngày','Thay đổi vải mỗi bộ'],rows)}`,qs:[
    saq('Mỗi ngày, số vải dùng cho mẫu A thay đổi bao nhiêu dm (số dương là tăng, số âm là giảm)?',ta,'dm',`${nb(`${n1} · (−${a}) = ${N(ta)}`)} (dm).`,'vd','TH'),
    saq('Mỗi ngày, số vải dùng cho mẫu B thay đổi bao nhiêu dm (số dương là tăng, số âm là giảm)?',tb,'dm',`${nb(`${n2} · ${b} = ${tb}`)} (dm).`,'vd','TH'),
    mcq('Biểu thức nào tính đúng tổng số vải thay đổi mỗi ngày của cả hai mẫu (dm)?',nb(`${n1} · (−${a}) + ${n2} · ${b}`),[
      [nb(`${n1} · ${a} + ${n2} · ${b}`),`Mẫu A dùng ít vải hơn nên thay đổi là −${a} dm mỗi bộ.`],
      [nb(`(${n1} + ${n2}) · (−${a} + ${b})`),'Mỗi mẫu có số bộ và mức thay đổi riêng, phải nhân riêng rồi mới cộng.'],
      [nb(`${n1} · (−${a}) − ${n2} · ${b}`),'Tổng hai mẫu là phép cộng hai thay đổi.']],`Mẫu A: ${nb(`${n1} · (−${a})`)}; mẫu B: ${nb(`${n2} · ${b}`)}. Cộng lại.`,'vd','VD'),
    saq('Tổng số vải thay đổi mỗi ngày của cả hai mẫu là bao nhiêu dm (số dương là tăng, số âm là giảm)?',ta+tb,'dm',`${nb(`${N(ta)} + ${tb} = ${N(ta+tb)}`)} (dm).`,'vd','VD')]};}
function pisaBook(){const k1=ri(3,8),a1=ri(5,20),k2=ri(2,6),a2=ri(10,40),r1=-k1*a1,r2=-k2*a2,rows=[['Ăn sáng',k1+' lần',N(-a1)],['Mua sách vở',k2+' lần',N(-a2)]];
  return {title:'Sổ ghi chi tiêu của bạn Cao',ctx:`<p class="stem">Bạn Cao ghi chi tiêu trong tuần vào sổ tay bằng số nguyên âm (đơn vị nghìn đồng). Bảng cho biết số lần chi và số tiền ghi mỗi lần.</p>${tbl(['Khoản chi','Số lần','Số ghi mỗi lần (nghìn đồng)'],rows)}`,qs:[
    saq('Tổng các số ghi cho khoản Ăn sáng là bao nhiêu nghìn đồng?',r1,'nghìn đồng',`${nb(`${k1} · (−${a1}) = ${N(r1)}`)} (nghìn đồng).`,'vd','TH'),
    saq('Tổng các số ghi cho khoản Mua sách vở là bao nhiêu nghìn đồng?',r2,'nghìn đồng',`${nb(`${k2} · (−${a2}) = ${N(r2)}`)} (nghìn đồng).`,'vd','TH'),
    mcq('Biểu thức nào tính đúng tổng số ghi của cả hai khoản chi (nghìn đồng)?',nb(`${k1} · (−${a1}) + ${k2} · (−${a2})`),[
      [nb(`${k1} · ${a1} + ${k2} · ${a2}`),'Khoản chi được ghi bằng số âm.'],
      [nb(`(${k1} + ${k2}) · (−${a1} − ${a2})`),'Mỗi khoản có số lần và số tiền riêng, phải nhân riêng rồi cộng.'],
      [nb(`(−${a1}) + (−${a2}) + ${k1} + ${k2}`),'Cộng k lần số −a là phép nhân k · (−a).']],'Mỗi khoản: số lần nhân với số ghi mỗi lần, rồi cộng hai kết quả.','vd','VD'),
    saq('Cuối tuần, Cao có thêm 50 nghìn đồng tiền thưởng ghi là +50. Tổng các số ghi trong tuần (cả hai khoản chi và tiền thưởng) là bao nhiêu nghìn đồng?',r1+r2+50,'nghìn đồng',`${nb(`${N(r1)} + ${N(r2)} + 50 = ${N(r1+r2+50)}`)} (nghìn đồng).`,'vd','VD')]};}
const PISA=[pisaDart,pisaFab,pisaBook];
const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'qt',fig:'<div class="figbox"><p>3 · (−4) = −12 (khác dấu: tích âm)</p><p>(−3) · (−4) = 12 (cùng dấu: tích dương)</p><p>a · 0 = 0</p></div>',extra:'Tích có số lẻ thừa số âm thì âm, số chẵn thừa số âm thì dương. Ví dụ (−15 000) · 3 = −45 000.'},
  {k:'tc',fig:'<div class="figbox"><p>a · b = b · a (giao hoán)</p><p>(a · b) · c = a · (b · c) (kết hợp)</p><p>a · (b + c) = a · b + a · c (phân phối)</p></div>',extra:'Ví dụ: (−25) · (−17) · 4 = (−25) · 4 · (−17) = (−100) · (−17) = 1 700.'},
  {k:'bt',fig:'<div class="figbox"><p>A = 3x + 2y, x = −4, y = 5</p><p>A = 3 · (−4) + 2 · 5 = −12 + 10 = −2</p><p>(−7) · (−9) > 0 > (−7) · 9</p></div>',extra:'Thay số âm vào biểu thức thì đặt trong ngoặc. So sánh tích: xét dấu từng tích trước.'},
  {k:'vd',fig:'<div class="figbox"><p>khoản chi, giảm, bị trừ điểm: số âm</p><p>k lần số (−a): k · (−a) = −(k · a)</p><p>h giờ trước: −h giờ</p></div>',extra:'Đọc kĩ đề để biết đại lượng nào là số âm, viết biểu thức rồi tính.'}
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
 G(()=>{const a=5*ri(4,12),b=5*ri(2,8),x=ri(8,30),y=ri(6,25),q=y*(-b),tot=x*a+q,y2=ri(10,30),need=Math.ceil(y2*b/a);
  if(a===b||y2*b%a===0)throw 0;
  const E=(p,r,s,t)=>`${p} · ${r} + ${s} · ${t}`;
  return {title:'Cửa hàng bán quần áo cuối mùa',ctx:P(`Một cửa hàng bán áo và quần. Mỗi chiếc áo bán ra cửa hàng lãi ${a} nghìn đồng. Quần được bán hạ giá nên mỗi chiếc quần bán ra cửa hàng lỗ ${b} nghìn đồng. Người ta ghi tiền lãi bằng số dương, tiền lỗ bằng số âm. Trong ngày, cửa hàng bán được ${x} chiếc áo và ${y} chiếc quần.`),qs:[
   A('Kết quả kinh doanh từ số quần bán được trong ngày là bao nhiêu nghìn đồng? (Nhập số âm nếu bị lỗ.)',q,'nghìn đồng',`Mỗi chiếc quần lỗ ${b} nghìn đồng, ghi là ${nm(-b)}. ${y} · (${nm(-b)}) = ${nm(q)}.`,'qt','TH'),
   M('Biểu thức nào cho biết kết quả kinh doanh của cửa hàng trong ngày (nghìn đồng)?',E(x,a,y,`(${nm(-b)})`),[[E(x,a,y,b),'Tiền lỗ phải ghi bằng số âm.'],[`(${x} + ${y}) · (${a} − ${b})`,'Số áo và số quần khác nhau nên không gộp chung như vậy được.'],[E(x,`(${nm(-b)})`,y,a),'Lãi đi với số áo, lỗ đi với số quần; biểu thức này đã đổi chỗ.']],`Kết quả = ${x} · ${a} + ${y} · (${nm(-b)}).`,'bt','TH'),
   A('Kết quả kinh doanh của cửa hàng trong ngày là bao nhiêu nghìn đồng? (Nhập số âm nếu bị lỗ.)',tot,'nghìn đồng',`${x} · ${a} + ${y} · (${nm(-b)}) = ${x*a} + (${nm(q)}) = ${nm(tot)}.`,'bt','VD'),
   A(`Hôm sau cửa hàng bán được ${y2} chiếc quần như vậy. Cửa hàng phải bán được ít nhất bao nhiêu chiếc áo để hôm đó không bị lỗ?`,need,'chiếc áo',`Tiền lỗ từ quần: ${y2} · (${nm(-b)}) = ${nm(-y2*b)}. Bán ${need-1} áo được ${(need-1)*a} < ${y2*b} nên vẫn lỗ; bán ${need} áo được ${need*a} ≥ ${y2*b}. Vậy cần ít nhất ${need} chiếc áo.`,'vd','VD')]};})
);
}
/* ==== Toán thực tế bổ sung: kết thúc ==== */
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='nh6_seen';
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
  const mcSlots=[['qt',['NB','TH']],['qt',['TH','VD']],['tc',['NB','TH']],['tc',['TH','VD']],['bt',['TH','VD']],['vd',['TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['qt','tc','bt'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=['qt','tc','bt','vd'].map(t=>pick(MC.filter(q=>q.topic===t&&q.level!=='VD'),used));
  const sa=[pick(SA.filter(q=>q.topic==='qt'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='tc'&&q.level!=='VD'),used)];
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
