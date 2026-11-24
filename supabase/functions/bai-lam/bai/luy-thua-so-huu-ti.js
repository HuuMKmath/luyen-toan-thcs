// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ luy-thua-so-huu-ti/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "luy-thua-so-huu-ti";
export const TIEN_TO = "LT7-";

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

/* ============ Số hữu tỉ: cách viết ============ */
const N=x=>x<0?'−'+(-x):''+x;            // số nguyên, số âm dùng dấu trừ "−"
const nb=s=>s.replace(/ /g,' ');     // khoảng trắng không ngắt dòng
const fr=(n,d)=>`<span class="fr"><span>${N(n)}</span><span>${N(d)}</span></span>`;   // phân số n/d (HTML)
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t;}return a;};
const lcm=(a,b)=>a/gcd(a,b)*b;
const Rq=(n,d)=>{const g=gcd(n,d)||1;n/=g;d/=g;if(d<0){n=-n;d=-d;}return [n,d];};   // tối giản, mẫu dương
const cmpQ=(a,b)=>a[0]*b[1]-b[0]*a[1];     // cùng dấu với a − b (hai mẫu dương)
const negQ=a=>[-a[0],a[1]];
const floorQ=a=>Math.floor(a[0]/a[1]);
const SH=q=>q[1]===1?N(q[0]):fr(q[0],q[1]);                // hiển thị dạng tối giản
const canDec=q=>q[1]>1&&100%q[1]===0;
const DEC=q=>{const k=100/q[1],v=Math.abs(q[0])*k;let s=String(Math.floor(v/100));const r=v%100;if(r)s+=','+(r%10?String(r).padStart(2,'0'):String(r/10));return (q[0]<0?'−':'')+s;};   // số thập phân hữu hạn
const MIXD=q=>{const a=Math.abs(q[0]),w=Math.floor(a/q[1]),r=a%q[1];return (q[0]<0?'−':'')+w+fr(r,q[1]);};   // hỗn số
const val=q=>q[0]/q[1];

/* ============ Ngẫu nhiên có hạt giống ============ */
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^=h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function sample(n,lo,hi){const all=[];for(let v=lo;v<=hi;v++)all.push(v);return shuffle(all).slice(0,n);}
const sgn=()=>RNG()<.5?-1:1;

/* số hữu tỉ ngẫu nhiên, không nguyên, tối giản */
function qr(maxN,maxD){for(;;){const d=ri(2,maxD),n=ri(1,maxN)*sgn(),q=Rq(n,d);if(q[1]>1)return q;}}
/* một số hữu tỉ viết ở nhiều dạng: nguyên, phân số, phân số chưa rút gọn (có thể mẫu âm), thập phân, hỗn số */
const UNR=q=>{const k=ri(2,4);return (RNG()<.5||q[0]===0)?fr(q[0]*k,q[1]*k):fr(-q[0]*k,-q[1]*k);};
const KINDS=q=>{const ks=[];if(q[1]===1)ks.push('int','unr');else{ks.push('frac','unr');if(canDec(q))ks.push('dec');if(Math.abs(q[0])>q[1])ks.push('mix');}return ks;};
function disp(q,kind){return kind==='int'?N(q[0]):kind==='frac'?SH(q):kind==='dec'?DEC(q):kind==='mix'?MIXD(q):UNR(q);}
const FORM=(q,kinds)=>{const ks=KINDS(q),ok=kinds?ks.filter(k=>kinds.includes(k)):ks;return disp(q,sel(ok.length?ok:ks));};
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;


/* ============ Phép tính trên số hữu tỉ (biểu diễn [tử, mẫu], mẫu dương, tối giản) ============ */
const qa=(a,b)=>Rq(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const qs=(a,b)=>qa(a,negQ(b));
const qm=(a,b)=>Rq(a[0]*b[0],a[1]*b[1]);
const qinv=a=>Rq(a[1],a[0]);
const qd=(a,b)=>qm(a,qinv(b));
const eqQ=(a,b)=>a[0]===b[0]&&a[1]===b[1];
const E=s=>`<i class="ex">${s}</i>`;                       // bọc biểu thức để chương trình kiểm tra đọc lại
const PA=(q,h)=>q[0]<0?`(${h})`:h;                         // số âm đứng sau dấu phép tính thì đặt trong ngoặc
const disp2=(q,dec)=>(dec&&canDec(q)&&q[1]>1)?DEC(q):SH(q);
const I=(q,dec)=>({q,h:disp2(q,dec)});
const X=(items,ops)=>items.map((it,i)=>i===0?it.h:`${ops[i-1]} ${it.n?it.h:PA(it.q,it.h)}`).join(' ');
const show=(q,dec)=>disp2(q,dec);
const rfr=()=>{for(;;){const d=ri(2,9),q=Rq(ri(1,2*d)*sgn(),d);if(q[1]>1)return q;}};   // phân số không nguyên
const rnz=()=>RNG()<.2?[sgn()*ri(1,6),1]:rfr();                                      // số hữu tỉ khác 0
const rdec=()=>{for(;;){const q=Rq(sgn()*ri(1,59),sel([2,4,5,10]));if(q[1]>1&&canDec(q))return q;}};
const rdiff=()=>{for(;;){const A=rfr(),B=rfr();if(A[1]!==B[1])return [A,B];}};
const SGN2=q=>q[0]<0?'âm':q[0]>0?'dương':'bằng 0';

/* ============ Dựng câu nhiều lựa chọn ============ */
function pickOpts(goodT,cands){
  const seen=new Set([goodT]),out=[];
  for(const c of cands){if(c&&!seen.has(c.t)){seen.add(c.t);out.push({t:c.t,err:c.err});}if(out.length===3)break;}
  return out;
}
const C=(t,err)=>({t,err});
const mk=(stem,good,cands,exp)=>({stem,opts:[{t:good}].concat(pickOpts(good,cands)),ans:0,exp});
const Wq=(good,q,err,dec)=>(!q||q[1]===0||!isFinite(q[0]/q[1]))?null:(eqQ(Rq(q[0],q[1]),good)?null:C(show(Rq(q[0],q[1]),dec),err));
function tryGen(f){
  for(let n=0;n<300;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>o.t)).size===4)return r;}
  return FB_MC();
}
const lcmQ=(a,b)=>lcm(a[1],b[1]);
const QD=(A,B)=>{const L=lcmQ(A,B);return `${fr(A[0],A[1])} = ${fr(A[0]*L/A[1],L)} và ${fr(B[0],B[1])} = ${fr(B[0]*L/B[1],L)}`;};

/* ============ Luỹ thừa của số hữu tỉ ============ */
const pw=(q,n)=>{let r=[1,1];for(let i=0;i<n;i++)r=qm(r,q);return r;};            // x^n (n tự nhiên)
const SUP=n=>`<sup>${n}</sup>`;
const PW=(q,n,dec)=>{const h=disp2(q,dec);return (q[1]===1&&q[0]>=0)?h+SUP(n):`(${h})${SUP(n)}`;};   // viết luỹ thừa; cơ số âm hoặc phân số đặt trong ngoặc
const FB_MC=()=>({stem:`Giá trị của luỹ thừa ${E(PW([2,1],3))} là:`,opts:[{t:'8'},{t:'6',err:'Luỹ thừa bậc 3 là tích của 3 thừa số 2, không phải 2 · 3.'},{t:'9',err:'Đó là 3'+SUP(2)+', còn đề hỏi 2'+SUP(3)+'.'},{t:'−8',err:'Luỹ thừa của một số dương luôn là số dương.'}],ans:0,exp:'2'+SUP(3)+' = 2 · 2 · 2 = 8.'});
const BR=h=>`[${h}]`;                                                                // ngoặc vuông cho luỹ thừa của luỹ thừa
const okq=q=>q&&Math.abs(q[0])<=4e14&&q[1]<=4e14;
const Wt=(good,v,t,err)=>(!okq(v)||eqQ(v,good))?null:C(t,err);                        // lựa chọn sai dạng luỹ thừa (so theo giá trị)
const bi=()=>[sgn()*ri(2,5),1];                                                      // cơ số nguyên
const bf=()=>{for(;;){const d=ri(2,5),q=Rq(sgn()*ri(1,5),d);if(q[1]>1)return q;}};  // cơ số phân số
const bq=()=>RNG()<.5?bi():bf();
const prodStr=(q,n,dec)=>Array(n).fill(PA(q,disp2(q,dec))).join(' · ');
const magOK=q=>Math.abs(q[0])<=1e6&&q[1]<=1e6;

/* ============ Nội dung 1: luỹ thừa với số mũ tự nhiên ============ */
function genDnVal(){return tryGen(()=>{
  const a=sgn()*ri(2,6),n=ri(2,4),A=[a,1],good=pw(A,n);
  return mk(`Tính ${E(PW(A,n))}.`,show(good),[
    Wq(good,[a*n,1],'Luỹ thừa bậc n là tích của n thừa số bằng cơ số, không phải cơ số nhân số mũ.'),
    Wq(good,negQ(good),a<0?'Luỹ thừa bậc chẵn của số âm là số dương, bậc lẻ của số âm là số âm; bạn đã đảo dấu.':'Luỹ thừa của một số dương luôn là số dương.'),
    Wq(good,pw(A,n-1),'Bạn nhân thiếu một thừa số: cần đủ n thừa số.'),
    Wq(good,pw(A,n+1),'Bạn nhân thừa một thừa số.')],
    `${PW(A,n)} = ${prodStr(A,n)} = ${SH(good)}.`);
});}
function genDnName(){return tryGen(()=>{
  const q=bq(),n=ri(3,6),which=sel(['cơ số','số mũ']),good=which==='cơ số'?q:[n,1];
  return mk(`Trong luỹ thừa ${E(PW(q,n))}, ${which} là:`,show(good),[
    which==='cơ số'?Wq(good,[n,1],'Đó là số mũ của luỹ thừa.'):Wq(good,q,'Đó là cơ số của luỹ thừa.'),
    Wq(good,pw(q,n),'Đó là giá trị của luỹ thừa, không phải '+which+'.'),
    Wq(good,which==='cơ số'?negQ(q):[n+1,1],which==='cơ số'?'Cơ số là số đứng trong ngoặc, giữ nguyên dấu của nó.':'Số mũ là số nhỏ viết phía trên bên phải.'),
    Wq(good,which==='cơ số'?[n,1]:[1,1],'Hãy xác định đúng '+which+' của luỹ thừa.')],
    `Trong x${SUP('n')}, x gọi là cơ số và n gọi là số mũ. Ở đây cơ số là ${SH(q)}, số mũ là ${n}.`);
});}
function genDnWrite(){return tryGen(()=>{
  const q=bq(),n=ri(3,5),good=pw(q,n),cands=[
    Wt(good,pw(q,n-1),PW(q,n-1),'Bạn đếm thiếu một thừa số.'),
    Wt(good,pw(q,n+1),PW(q,n+1),'Bạn đếm thừa một thừa số.'),
    Wt(good,qm(q,[n,1]),`${PA(q,disp2(q))} · ${n}`,'Tích của n thừa số bằng nhau là luỹ thừa bậc n, không phải cơ số nhân với n.')];
  if(q[1]===1&&q[0]<0)cands.unshift(Wt(good,negQ(pw([-q[0],1],n)),`−${-q[0]}${SUP(n)}`,'Thiếu ngoặc: −'+(-q[0])+SUP(n)+' khác '+PW(q,n)+'.'));
  return mk(`Viết tích ${E(prodStr(q,n))} dưới dạng luỹ thừa.`,PW(q,n),cands,`Tích có ${n} thừa số bằng nhau, mỗi thừa số là ${SH(q)}, nên bằng ${PW(q,n)}.`);
});}
function genDnRep(){return tryGen(()=>{
  const b=sel([2,3,5]),n=ri(3,b===2?9:b===3?6:5),v=Math.pow(b,n),good=[v,1];
  return mk(`Viết số ${E(N(v))} dưới dạng luỹ thừa của ${b}.`,`${b}${SUP(n)}`,[
    Wt(good,[Math.pow(b,n-1),1],`${b}${SUP(n-1)}`,'Bạn đếm thiếu một thừa số '+b+'.'),
    Wt(good,[Math.pow(b,n+1),1],`${b}${SUP(n+1)}`,'Bạn đếm thừa một thừa số '+b+'.'),
    Wt(good,[Math.pow(n,b),1],`${n}${SUP(b)}`,'Bạn nhầm cơ số và số mũ.'),
    Wt(good,[b*n,1],`${b} · ${n}`,'Luỹ thừa là tích của các thừa số bằng nhau, không phải cơ số nhân số mũ.')],
    `${N(v)} = ${Array(n).fill(b).join(' · ')} = ${b}${SUP(n)}.`);
});}
function genDnFr(){return tryGen(()=>{
  const dec=RNG()<.3,q=dec?rdec():rfr(),n=dec?ri(2,3):ri(2,4),good=pw(q,n);if(!magOK(good))return null;
  return mk(`Tính ${E(PW(q,n,dec))}. Chọn kết quả (dạng tối giản).`,show(good),[
    Wq(good,[Math.pow(q[0],n),q[1]],'Phải luỹ thừa cả tử và mẫu, bạn mới luỹ thừa tử số.'),
    Wq(good,[q[0],Math.pow(q[1],n)],'Phải luỹ thừa cả tử và mẫu, bạn mới luỹ thừa mẫu số.'),
    Wq(good,qm(q,[n,1]),'Luỹ thừa bậc n là tích của n thừa số, không phải cơ số nhân số mũ.'),
    Wq(good,negQ(good),q[0]<0?'Luỹ thừa bậc chẵn của số âm là số dương, bậc lẻ là số âm.':'Luỹ thừa của một số dương luôn là số dương.')],
    `${PW(q,n,dec)} = ${prodStr(q,n,dec)} = ${SH(good)}.`);
});}
function genDnSign(){return tryGen(()=>{
  const wantNeg=RNG()<.6,a=ri(2,5),b=ri(2,5),c=ri(2,5),d=ri(2,5),ev=()=>2*ri(1,2),od=()=>2*ri(0,2)+1;
  const NEGS=[()=>PW([-a,1],od()),()=>PW([-b,1],od()),()=>PW([-c,1],od())];
  const POSS=[()=>PW([-a,1],ev()),()=>PW([b,1],ri(2,4)),()=>PW([-c,1],ev()),()=>PW([d,1],ri(2,3))];
  const good=wantNeg?sel(NEGS)():sel(POSS)(),pool=wantNeg?POSS:NEGS,ws=shuffle(pool).slice(0,3).map(f=>f());
  if(new Set(ws.concat([good])).size!==4)return null;
  return mk(`Trong các số sau, số nào là số ${wantNeg?'âm':'dương'}?`,good,ws.map(t=>C(t,wantNeg?'Luỹ thừa này là số dương: cơ số dương, hoặc cơ số âm với số mũ chẵn.':'Luỹ thừa này là số âm: cơ số âm với số mũ lẻ.')),
    `Luỹ thừa bậc chẵn của số âm là số dương, bậc lẻ của số âm là số âm. Số ${wantNeg?'âm':'dương'} ở đây là ${good}.`);
});}
function genDnMax(){return tryGen(()=>{
  const ps=[];for(let i=0;i<4;i++)ps.push({q:[sgn()*ri(2,4),1],n:ri(1,4)});
  const vs=ps.map(p=>pw(p.q,p.n));if(new Set(vs.map(v=>v[0])).size!==4)return null;
  let m=0;vs.forEach((v,i)=>{if(v[0]>vs[m][0])m=i;});
  return mk('Luỹ thừa nào dưới đây có giá trị lớn nhất?',PW(ps[m].q,ps[m].n),ps.filter((p,i)=>i!==m).map(p=>C(PW(p.q,p.n),`Giá trị của luỹ thừa này là ${N(pw(p.q,p.n)[0])}, nhỏ hơn giá trị lớn nhất ${N(vs[m][0])}.`)),
    ps.map(p=>`${PW(p.q,p.n)} = ${N(pw(p.q,p.n)[0])}`).join('; ')+`. Giá trị lớn nhất là ${N(vs[m][0])}.`);
});}
function genDnZero(){return tryGen(()=>{
  const A=bq(),B=bq(),op=sel(['+','−']),f=(x,y)=>op==='+'?qa(x,y):qs(x,y),good=f([1,1],B);
  return mk(`Tính ${E(`${PW(A,0)} ${op} ${PW(B,1)}`)}.`,show(good),[
    Wq(good,f([0,1],B),'Luỹ thừa bậc 0 của số khác 0 bằng 1, không bằng 0.'),
    Wq(good,f(A,B),'Luỹ thừa bậc 0 bằng 1, không bằng cơ số.'),
    Wq(good,f([1,1],[1,1]),'Luỹ thừa bậc 1 của một số bằng chính số đó, không bằng 1.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `${PW(A,0)} = 1 (cơ số khác 0) và ${PW(B,1)} = ${SH(B)}. Do đó kết quả là 1 ${op} ${PA(B,SH(B))} = ${SH(good)}.`);
});}
function genDnExpr(){return tryGen(()=>{
  const A=bi(),B=bi(),C3=bi(),m=ri(2,3),n=ri(2,3),k=ri(2,3),o1=sel(['+','−']),o2=sel(['+','−']),
    f=(x,y,o)=>o==='+'?qa(x,y):qs(x,y),v1=pw(A,m),v2=pw(B,n),v3=pw(C3,k),good=f(f(v1,v2,o1),v3,o2);
  return mk(`Tính ${E(`${PW(A,m)} ${o1} ${PW(B,n)} ${o2} ${PW(C3,k)}`)}.`,show(good),[
    Wq(good,f(f([A[0]*m,1],v2,o1),v3,o2),'Bạn nhân cơ số với số mũ thay vì nhân n thừa số bằng cơ số.'),
    Wq(good,f(f(v1,negQ(v2),o1),v3,o2),'Bạn tính sai dấu của một luỹ thừa: số âm mũ chẵn là số dương, mũ lẻ là số âm.'),
    Wq(good,f(f(v1,v2,o1),negQ(v3),o2),'Bạn tính sai dấu của luỹ thừa cuối.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `${PW(A,m)} = ${SH(v1)}; ${PW(B,n)} = ${SH(v2)}; ${PW(C3,k)} = ${SH(v3)}. Kết quả: ${SH(v1)} ${o1} ${PA(v2,SH(v2))} ${o2} ${PA(v3,SH(v3))} = ${SH(good)}.`);
});}
function genDnGiven(){return tryGen(()=>{
  const b=sgn()*ri(2,5),n=ri(3,6),up=RNG()<.7,B=[b,1],v=pw(B,n),tgt=up?n+1:n-1,good=pw(B,tgt);
  if(!up&&tgt<2)return null;
  return mk(`Biết ${E(PW(B,n))} = ${N(v[0])}. Giá trị của ${E(PW(B,tgt))} là:`,show(good),[
    up?Wq(good,qa(v,B),'Bạn cộng cơ số vào thay vì nhân với cơ số.'):Wq(good,qm(v,B),'Muốn lùi một bậc phải chia cho cơ số, không nhân.'),
    up?Wq(good,qd(v,B),'Muốn tăng thêm một bậc phải nhân với cơ số, không chia.'):Wq(good,qs(v,B),'Muốn lùi một bậc phải chia cho cơ số, không trừ.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.'),
    Wq(good,qm(v,[tgt,1]),'Bạn nhân với số mũ thay vì với cơ số.')],
    up?`${PW(B,tgt)} = ${PW(B,n)} · ${PA(B,N(b))} = ${N(v[0])} · ${PA(B,N(b))} = ${SH(good)}.`:`${PW(B,tgt)} = ${PW(B,n)} : ${PA(B,N(b))} = ${N(v[0])} : ${PA(B,N(b))} = ${SH(good)}.`);
});}

/* ============ Nội dung 2: luỹ thừa của một tích, một thương ============ */
function genTtProd(){return tryGen(()=>{
  const a=sgn()*ri(2,4),b=sgn()*ri(1,4),n=ri(2,3),A=[a,1],Bq=[b,1],good=pw(qm(A,Bq),n);if(Math.abs(b)===1&&RNG()<.5)return null;
  return mk(`Tính ${E(`(${N(a)} · ${PA(Bq,N(b))})${SUP(n)}`)}.`,show(good),[
    Wq(good,qm(pw(A,n),Bq),'Luỹ thừa của một tích bằng tích các luỹ thừa: phải luỹ thừa cả hai thừa số.'),
    Wq(good,qm(A,pw(Bq,n)),'Luỹ thừa của một tích bằng tích các luỹ thừa: phải luỹ thừa cả hai thừa số.'),
    Wq(good,qa(pw(A,n),pw(Bq,n)),'Luỹ thừa của một tích là tích các luỹ thừa, không phải tổng.'),
    Wq(good,qm(qm(A,Bq),[n,1]),'Luỹ thừa bậc n không phải là nhân với n.')],
    `(${N(a)} · ${PA(Bq,N(b))})${SUP(n)} = ${PW(A,n)} · ${PW(Bq,n)} = ${SH(pw(A,n))} · ${PA(pw(Bq,n),SH(pw(Bq,n)))} = ${SH(good)}.`);
});}
function genTtMul(){return tryGen(()=>{
  const q=ri(2,5),p=sgn()*ri(1,5);if(gcd(p,q)!==1)return null;const n=ri(2,5),Pq=[p,q],good=[Math.pow(p,n),1];if(!magOK(good))return null;
  return mk(`Tính ${E(`${PW(Pq,n)} · ${PW([q,1],n)}`)}.`,show(good),[
    Wq(good,qm(pw(Pq,n),[q,1]),'Bạn chỉ nhân với '+q+', phải nhân với '+q+SUP(n)+'.'),
    Wq(good,pw(Pq,n),'Bạn chưa nhân với '+q+SUP(n)+'.'),
    Wq(good,[p*n,1],'Luỹ thừa bậc n không phải là nhân với n.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `${PW(Pq,n)} · ${PW([q,1],n)} = (${SH(Pq)} · ${q})${SUP(n)} = ${PW([p,1],n)} = ${SH(good)}.`);
});}
function genTtDiv(){return tryGen(()=>{
  const a=sgn()*ri(2,5),k=ri(2,5),n=ri(2,4),good=[Math.pow(a,n),1];
  return mk(`Tính ${E(`${PW([a*k,1],n)} : ${PW([k,1],n)}`)}.`,show(good),[
    Wq(good,[a,1],'Bạn chưa nâng thương lên luỹ thừa bậc n.'),
    Wq(good,qm([a,1],[n,1]),'Luỹ thừa bậc n không phải là nhân với n.'),
    Wq(good,qd(pw([a*k,1],n),[k,1]),'Bạn chỉ chia cho '+k+', phải chia cho '+k+SUP(n)+'.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `${PW([a*k,1],n)} : ${PW([k,1],n)} = (${N(a*k)} : ${k})${SUP(n)} = ${PW([a,1],n)} = ${SH(good)}.`);
});}
function genTtCombo(){return tryGen(()=>{
  const a=sgn()*ri(2,6),b=sgn()*ri(2,6),c=ri(2,5);if((a*b)%c!==0)return null;const t=a*b/c,n=ri(2,3);if(Math.abs(t)<2||Math.abs(t)>6)return null;const good=[Math.pow(t,n),1];
  return mk(`Tính ${E(`${PW([a,1],n)} · ${PW([b,1],n)} : ${PW([c,1],n)}`)}.`,show(good),[
    Wq(good,[t,1],'Bạn chưa nâng kết quả lên luỹ thừa bậc n.'),
    Wq(good,[t*n,1],'Luỹ thừa bậc n không phải là nhân với n.'),
    Wq(good,qd(qm(pw([a,1],n),pw([b,1],n)),[c,1]),'Bạn chỉ chia cho '+c+', phải chia cho '+c+SUP(n)+'.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `${PW([a,1],n)} · ${PW([b,1],n)} : ${PW([c,1],n)} = (${N(a)} · ${PA([b,1],N(b))} : ${c})${SUP(n)} = ${PW([t,1],n)} = ${SH(good)}.`);
});}
function genTtDec(){return tryGen(()=>{
  const c=ri(2,9),n=ri(2,3),Q=Rq(c,10),good=[Math.pow(c,n),1];
  return mk(`Tính ${E(`${PW(Q,n,true)} · ${PW([10,1],n)}`)}.`,show(good),[
    Wq(good,pw(Q,n),'Bạn chưa nhân với 10'+SUP(n)+'.'),
    Wq(good,qm(pw(Q,n),[10,1]),'Bạn chỉ nhân với 10, phải nhân với 10'+SUP(n)+'.'),
    Wq(good,[c*n,1],'Luỹ thừa bậc n không phải là nhân với n.'),
    Wq(good,[c,1],'Bạn chưa nâng kết quả lên luỹ thừa bậc n.')],
    `${PW(Q,n,true)} · 10${SUP(n)} = (${DEC(Q)} · 10)${SUP(n)} = ${c}${SUP(n)} = ${N(good[0])}.`);
});}

/* ============ Nội dung 3: nhân và chia hai luỹ thừa cùng cơ số ============ */
function genNcMul(){return tryGen(()=>{
  const A=bq(),m=ri(2,6),n=ri(2,6),good=pw(A,m+n);if(m+n>10)return null;
  return mk(`Viết kết quả phép tính ${E(`${PW(A,m)} · ${PW(A,n)}`)} dưới dạng luỹ thừa.`,PW(A,m+n),[
    Wt(good,pw(A,m*n),PW(A,m*n),'Khi nhân hai luỹ thừa cùng cơ số, ta cộng hai số mũ, không nhân.'),
    Wt(good,pw(qm(A,A),m+n),PW(qm(A,A),m+n),'Phải giữ nguyên cơ số, không nhân hai cơ số với nhau.'),
    Wt(good,pw(A,Math.abs(m-n)),PW(A,Math.abs(m-n)),'Trừ hai số mũ là quy tắc của phép chia, không phải phép nhân.'),
    Wt(good,pw(A,Math.max(m,n)),PW(A,Math.max(m,n)),'Phải cộng hai số mũ.')],
    `Giữ nguyên cơ số, cộng hai số mũ: ${PW(A,m)} · ${PW(A,n)} = ${PW(A,m+n)}.`);
});}
function genNcDiv(){return tryGen(()=>{
  const A=bq(),n=ri(2,5),m=ri(n+1,n+5),good=pw(A,m-n);
  return mk(`Viết kết quả phép tính ${E(`${PW(A,m)} : ${PW(A,n)}`)} dưới dạng luỹ thừa.`,PW(A,m-n),[
    Wt(good,pw(A,m+n),PW(A,m+n),'Khi chia hai luỹ thừa cùng cơ số, ta trừ hai số mũ, không cộng.'),
    Wt(good,pw(A,m*n),PW(A,m*n),'Khi chia hai luỹ thừa cùng cơ số, ta trừ hai số mũ, không nhân.'),
    Wt(good,[1,1],'1','Phải giữ nguyên cơ số và trừ hai số mũ, không phải lấy cơ số chia cho cơ số.'),
    Wt(good,pw(A,m-n+1),PW(A,m-n+1),'Bạn tính sai hiệu hai số mũ.')],
    `Giữ nguyên cơ số, lấy số mũ của luỹ thừa bị chia trừ số mũ của luỹ thừa chia: ${PW(A,m)} : ${PW(A,n)} = ${PW(A,m-n)}.`);
});}
function genNcSame(){return tryGen(()=>{
  const A=bq(),k=ri(5,9),i=ri(2,k-3),j=k-i,s=ri(2,4),good=pw(A,k),useDiv=RNG()<.5;
  const prod=(x,y)=>`${PW(A,x)} · ${PW(A,y)}`,quo=(x,y)=>`${PW(A,x)} : ${PW(A,y)}`;
  const goodT=useDiv?quo(k+s,s):prod(i,j);
  const w=[Wt(good,pw(A,k+1),prod(i,j+1),'Tổng hai số mũ phải bằng '+k+'.'),Wt(good,pw(A,k-1),prod(i,j-1),'Tổng hai số mũ phải bằng '+k+'.'),
    Wt(good,pw(A,k+1),quo(k+s,s-1),'Hiệu hai số mũ phải bằng '+k+'.'),Wt(good,pw(A,k-1),quo(k+s-1,s),'Hiệu hai số mũ phải bằng '+k+'.'),
    ].filter(c=>c);
  return mk(`Biểu thức nào sau đây bằng ${E(PW(A,k))}?`,goodT,w,useDiv?`${quo(k+s,s)} = ${PW(A,k)}: giữ nguyên cơ số, trừ hai số mũ (${k+s} − ${s} = ${k}).`:`${prod(i,j)} = ${PW(A,k)}: giữ nguyên cơ số, cộng hai số mũ (${i} + ${j} = ${k}).`);
});}
function genNcVal(){return tryGen(()=>{
  const A=sgn()*ri(2,4),m=ri(2,4),n=ri(2,4),Aq=[A,1],good=pw(Aq,m+n);
  return mk(`Tính ${E(`${PW(Aq,m)} · ${PW(Aq,n)}`)}.`,show(good),[
    Wq(good,pw(Aq,m*n),'Khi nhân hai luỹ thừa cùng cơ số, ta cộng hai số mũ, không nhân.'),
    Wq(good,pw([A*A,1],m+n),'Phải giữ nguyên cơ số, không nhân hai cơ số với nhau.'),
    Wq(good,qa(pw(Aq,m),pw(Aq,n)),'Đây là phép nhân hai luỹ thừa, không phải phép cộng.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `${PW(Aq,m)} · ${PW(Aq,n)} = ${PW(Aq,m+n)} = ${SH(good)}.`);
});}
function genNcEval(){return tryGen(()=>{
  const a=sgn()*ri(2,3),m=ri(2,5),n=ri(2,5),p=ri(2,m+n-2),A=[a,1],good=pw(A,m+n-p);
  return mk(`Tính ${E(`${PW(A,m)} · ${PW(A,n)} : ${PW(A,p)}`)}.`,show(good),[
    Wq(good,pw(A,m+n+p),'Phép chia phải trừ số mũ, bạn đã cộng thêm.'),
    Wq(good,pw(A,m+n-p+1),'Bạn tính sai hiệu số mũ.'),
    Wq(good,pw(A,m*n-p),'Khi nhân hai luỹ thừa cùng cơ số ta cộng hai số mũ, không nhân.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `${PW(A,m)} · ${PW(A,n)} = ${PW(A,m+n)}; ${PW(A,m+n)} : ${PW(A,p)} = ${PW(A,m+n-p)} = ${SH(good)}.`);
});}

/* ============ Nội dung 4: luỹ thừa của luỹ thừa ============ */
function genLtForm(){return tryGen(()=>{
  const A=bq(),m=ri(2,4),n=ri(2,4);if(m===n||m*n>12)return null;const good=pw(A,m*n);
  return mk(`Viết ${E(BR(PW(A,m))+SUP(n))} dưới dạng luỹ thừa của ${SH(A)}.`,PW(A,m*n),[
    Wt(good,pw(A,m+n),PW(A,m+n),'Khi tính luỹ thừa của một luỹ thừa, ta nhân hai số mũ, không cộng.'),
    Wt(good,pw(A,m),PW(A,m),'Bạn bỏ quên số mũ ngoài.'),
    Wt(good,pw(A,n),PW(A,n),'Bạn bỏ quên số mũ trong.'),
    Wt(good,pw(A,m*n+1),PW(A,m*n+1),'Bạn tính sai tích hai số mũ.')],
    `Giữ nguyên cơ số, nhân hai số mũ: ${BR(PW(A,m))}${SUP(n)} = ${PW(A,m*n)}.`);
});}
function genLtVal(){return tryGen(()=>{
  const a=sgn()*ri(2,3),m=ri(2,3),n=ri(2,3),A=[a,1],good=pw(A,m*n);
  return mk(`Tính ${E(BR(PW(A,m))+SUP(n))}.`,show(good),[
    Wq(good,pw(A,m+n),'Khi tính luỹ thừa của một luỹ thừa, ta nhân hai số mũ, không cộng.'),
    Wq(good,pw(A,Math.pow(m,n)),'Bạn đã lấy luỹ thừa của số mũ.'),
    Wq(good,pw(A,m),'Bạn bỏ quên số mũ ngoài.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `${BR(PW(A,m))}${SUP(n)} = ${PW(A,m*n)} = ${SH(good)}.`);
});}
const BASES_LT=[[1,2],[1,3],[2,3],[3,2],[1,4],[3,4],[2,5],[1,5]];
function genLtBase(){return tryGen(()=>{
  const r=sel(BASES_LT),k=ri(2,3),n=ri(2,5);if(k*n>12)return null;const rk=pw(r,k),good=pw(r,k*n);
  return mk(`Viết ${E(PW(rk,n))} dưới dạng luỹ thừa cơ số ${SH(r)}.`,PW(r,k*n),[
    Wt(good,pw(r,k+n),PW(r,k+n),'Khi tính luỹ thừa của một luỹ thừa, ta nhân hai số mũ, không cộng.'),
    Wt(good,pw(r,n),PW(r,n),'Bạn chưa đổi cơ số '+SH(rk)+' thành '+PW(r,k)+'.'),
    Wt(good,pw(r,k),PW(r,k),'Bạn bỏ quên số mũ ngoài.'),
    Wt(good,pw(r,k*n+k),PW(r,k*n+k),'Bạn tính sai tích hai số mũ.')],
    `${SH(rk)} = ${PW(r,k)} nên ${PW(rk,n)} = ${BR(PW(r,k))}${SUP(n)} = ${PW(r,k*n)}.`);
});}
function genLtMix(){return tryGen(()=>{
  const a=ri(2,4)*sgn(),A=[a,1],m=ri(2,3),n=ri(2,3),k=ri(2,4),div=RNG()<.4,e=div?m*n-k:m*n+k;if(div&&e<1)return null;const good=pw(A,e);
  return mk(`Viết ${E(`${BR(PW(A,m))}${SUP(n)} ${div?':':'·'} ${PW(A,k)}`)} dưới dạng luỹ thừa của ${N(a)}.`,PW(A,e),[
    Wt(good,pw(A,div?m*n+k:m*n-k),PW(A,div?m*n+k:m*n-k),div?'Phép chia phải trừ số mũ, không cộng.':'Phép nhân phải cộng số mũ, không trừ.'),
    Wt(good,pw(A,m+n+(div?-k:k)),PW(A,m+n+(div?-k:k)),'Luỹ thừa của luỹ thừa: phải nhân hai số mũ '+m+' và '+n+'.'),
    Wt(good,pw(A,m*n*k),PW(A,m*n*k),'Bạn nhân cả ba số mũ với nhau.'),
    Wt(good,pw(A,e+1),PW(A,e+1),'Bạn tính sai số mũ.')],
    `${BR(PW(A,m))}${SUP(n)} = ${PW(A,m*n)}; ${PW(A,m*n)} ${div?':':'·'} ${PW(A,k)} = ${PW(A,e)}.`);
});}

/* ============ Câu nhiều lựa chọn viết sẵn ============ */
const O=(t,err)=>err?{t,err}:{t};
const X1=(b,s)=>`${b}${SUP(s)}`;
const MC=[
 {id:'m1',topic:'dn',level:'NB',stem:`Luỹ thừa bậc n của số hữu tỉ x (n là số tự nhiên lớn hơn 1) là:`,ans:0,opts:[O('tích của n thừa số x'),O('tích của x và n','Luỹ thừa là tích của n thừa số bằng nhau, không phải x nhân n.'),O('tổng của n số hạng x','Luỹ thừa là phép nhân lặp, không phải phép cộng lặp.'),O('thương của x và n','Luỹ thừa không phải là phép chia x cho n.')],
  exp:`${X1('x','n')} = x · x · … · x (n thừa số x).`},
 {id:'m2',topic:'dn',level:'NB',stem:`Trong luỹ thừa ${X1('x','n')}, số x gọi là:`,ans:0,opts:[O('cơ số'),O('số mũ','Số n mới gọi là số mũ.'),O('luỹ thừa','Luỹ thừa là cả biểu thức '+X1('x','n')+'.'),O('hệ số','Trong luỹ thừa không có hệ số.')],
  exp:`Trong ${X1('x','n')}, x gọi là cơ số, n gọi là số mũ.`},
 {id:'m3',topic:'dn',level:'NB',stem:`Cách đọc nào sau đây không đúng với ${X1('x','n')}?`,ans:0,opts:[O('x nhân n'),O('x mũ n','Đây là cách đọc đúng.'),O('x luỹ thừa n','Đây là cách đọc đúng.'),O('luỹ thừa bậc n của x','Đây là cách đọc đúng.')],
  exp:`${X1('x','n')} đọc là x mũ n, hoặc x luỹ thừa n, hoặc luỹ thừa bậc n của x. Không đọc là "x nhân n".`},
 {id:'m4',topic:'dn',level:'NB',stem:`Quy ước nào sau đây đúng (x là số hữu tỉ khác 0)?`,ans:0,opts:[O(`${X1('x','0')} = 1`),O(`${X1('x','0')} = 0`,'Quy ước x'+SUP(0)+' = 1 với x ≠ 0.'),O(`${X1('x','0')} = x`,'Quy ước x'+SUP(1)+' = x, còn x'+SUP(0)+' = 1.'),O(`${X1('x','1')} = 1`,'Luỹ thừa bậc 1 của x bằng chính x.')],
  exp:`Quy ước: ${X1('x','0')} = 1 (x ≠ 0); ${X1('x','1')} = x.`},
 {id:'m5',topic:'dn',level:'TH',stem:'Phát biểu nào sau đây đúng?',ans:0,opts:[O(`${PW([-3,1],4)} = 81`),O(`${PW([-3,1],4)} = −81`,'Luỹ thừa bậc chẵn của số âm là số dương.'),O(`${PW([-3,1],4)} = −12`,'Luỹ thừa bậc 4 là tích của 4 thừa số, không phải nhân cơ số với 4.'),O(`${PW([-3,1],4)} = 12`,'Luỹ thừa bậc 4 là tích của 4 thừa số, không phải nhân cơ số với 4.')],
  exp:`${PW([-3,1],4)} = (−3) · (−3) · (−3) · (−3) = 81.`},
 {id:'m6',topic:'dn',level:'TH',stem:'Luỹ thừa bậc lẻ của một số hữu tỉ âm là:',ans:0,opts:[O('một số âm'),O('một số dương','Luỹ thừa bậc chẵn của số âm mới là số dương.'),O('bằng 0','Số âm luỹ thừa lên không bao giờ bằng 0.'),O('có thể âm hoặc dương','Luỹ thừa bậc lẻ của số âm luôn là số âm.')],
  exp:'Tích của một số lẻ các thừa số âm là một số âm.'},
 {id:'m7',topic:'tt',level:'NB',stem:`Với x, y là số hữu tỉ, ${'(x · y)'+SUP('n')} bằng:`,ans:0,opts:[O(`${X1('x','n')} · ${X1('y','n')}`),O(`${X1('x','n')} · y`,'Phải luỹ thừa cả hai thừa số.'),O(`${X1('x','n')} + ${X1('y','n')}`,'Luỹ thừa của một tích là tích các luỹ thừa, không phải tổng.'),O(`x · y · n`,'Luỹ thừa bậc n không phải là nhân với n.')],
  exp:`Luỹ thừa của một tích bằng tích các luỹ thừa: (x · y)${SUP('n')} = ${X1('x','n')} · ${X1('y','n')}.`},
 {id:'m8',topic:'tt',level:'NB',stem:`Với x, y là số hữu tỉ, y ≠ 0, ${'(x : y)'+SUP('n')} bằng:`,ans:0,opts:[O(`${X1('x','n')} : ${X1('y','n')}`),O(`${X1('x','n')} : y`,'Phải luỹ thừa cả số bị chia và số chia.'),O(`${X1('x','n')} − ${X1('y','n')}`,'Luỹ thừa của một thương là thương các luỹ thừa, không phải hiệu.'),O(`x : y : n`,'Luỹ thừa bậc n không phải là chia cho n.')],
  exp:`Luỹ thừa của một thương bằng thương các luỹ thừa: (x : y)${SUP('n')} = ${X1('x','n')} : ${X1('y','n')}.`},
 {id:'m9',topic:'tt',level:'TH',stem:'Đẳng thức nào sau đây đúng với mọi số hữu tỉ x, y?',ans:0,opts:[O(`(x · y)${SUP(3)} = ${X1('x',3)} · ${X1('y',3)}`),O(`(x + y)${SUP(2)} = ${X1('x',2)} + ${X1('y',2)}`,'Luỹ thừa của một tổng không bằng tổng các luỹ thừa. Ví dụ (1 + 1)'+SUP(2)+' = 4 nhưng 1'+SUP(2)+' + 1'+SUP(2)+' = 2.'),O(`(x · y)${SUP(2)} = x · ${X1('y',2)}`,'Phải luỹ thừa cả hai thừa số.'),O(`(x · y)${SUP(2)} = 2 · x · y`,'Luỹ thừa bậc 2 không phải là nhân với 2.')],
  exp:`Chỉ có luỹ thừa của một tích bằng tích các luỹ thừa: (x · y)${SUP(3)} = ${X1('x',3)} · ${X1('y',3)}.`},
 {id:'m10',topic:'nc',level:'NB',stem:`Với x là số hữu tỉ, m, n là số tự nhiên, ${X1('x','m')} · ${X1('x','n')} bằng:`,ans:0,opts:[O(X1('x','m + n')),O(X1('x','m · n'),'Khi nhân hai luỹ thừa cùng cơ số, ta cộng hai số mũ, không nhân.'),O(X1('x','m − n'),'Trừ hai số mũ là quy tắc của phép chia.'),O(X1('(x · x)','m + n'),'Phải giữ nguyên cơ số.')],
  exp:`Khi nhân hai luỹ thừa cùng cơ số, ta giữ nguyên cơ số và cộng hai số mũ: ${X1('x','m')} · ${X1('x','n')} = ${X1('x','m + n')}.`},
 {id:'m11',topic:'nc',level:'NB',stem:`Với x ≠ 0, m ≥ n, ${X1('x','m')} : ${X1('x','n')} bằng:`,ans:0,opts:[O(X1('x','m − n')),O(X1('x','m + n'),'Khi chia hai luỹ thừa cùng cơ số, ta trừ hai số mũ, không cộng.'),O(X1('x','m : n'),'Phải lấy hiệu hai số mũ, không phải thương.'),O('1','Chỉ khi m = n thì thương bằng 1.')],
  exp:`Khi chia hai luỹ thừa cùng cơ số khác 0, ta giữ nguyên cơ số và lấy số mũ của luỹ thừa bị chia trừ số mũ của luỹ thừa chia: ${X1('x','m')} : ${X1('x','n')} = ${X1('x','m − n')}.`},
 {id:'m12',topic:'nc',level:'TH',stem:`Kết quả của ${PW([-2,1],5)} : ${PW([-2,1],5)} là:`,ans:0,opts:[O('1'),O('0','Hai số bằng nhau (khác 0) chia cho nhau được 1.'),O(PW([-2,1],10),'Phép chia phải trừ số mũ: 5 − 5 = 0.'),O(PW([-2,1],25),'Phải trừ số mũ, không nhân.')],
  exp:`${PW([-2,1],5)} : ${PW([-2,1],5)} = ${PW([-2,1],0)} = 1.`},
 {id:'m13',topic:'lt',level:'NB',stem:`Với x là số hữu tỉ, m, n là số tự nhiên, ${'('+X1('x','m')+')'+SUP('n')} bằng:`,ans:0,opts:[O(X1('x','m · n')),O(X1('x','m + n'),'Khi tính luỹ thừa của một luỹ thừa, ta nhân hai số mũ, không cộng.'),O(`${X1('x','m')} · ${X1('x','n')}`,'Đây là tích hai luỹ thừa, có số mũ cộng lại.'),O(X1('x',`m${SUP('n')}`),'Phải nhân hai số mũ, không lấy luỹ thừa của số mũ.')],
  exp:`Khi tính luỹ thừa của một luỹ thừa, ta giữ nguyên cơ số và nhân hai số mũ: (${X1('x','m')})${SUP('n')} = ${X1('x','m · n')}.`},
 {id:'m14',topic:'lt',level:'TH',stem:'Khẳng định nào sau đây đúng?',ans:0,opts:[O(`(${X1('2',3)})${SUP(2)} = ${X1('2',6)}`),O(`(${X1('2',3)})${SUP(2)} = ${X1('2',5)}`,'Phải nhân hai số mũ: 3 · 2 = 6, không cộng.'),O(`(${X1('2',3)})${SUP(2)} = ${X1('2',9)}`,'Phải nhân hai số mũ 3 · 2 = 6, không lấy 3'+SUP(2)+'.'),O(`(${X1('2',3)})${SUP(2)} = ${X1('4',6)}`,'Phải giữ nguyên cơ số 2.')],
  exp:`(${X1('2',3)})${SUP(2)} = ${X1('2','3 · 2')} = ${X1('2',6)} = 64.`}
].map(q=>Object.assign({type:'mc'},q));
const addMC=(id,topic,level,gen)=>MC.push({id,type:'mc',topic,level,gen});
['a','b','c'].forEach(x=>{
  addMC('g_dnval_'+x,'dn','NB',genDnVal);addMC('g_dnname_'+x,'dn','NB',genDnName);addMC('g_dnwrite_'+x,'dn','NB',genDnWrite);addMC('g_dnrep_'+x,'dn','NB',genDnRep);
  addMC('g_dnfr_'+x,'dn','TH',genDnFr);addMC('g_dnsign_'+x,'dn','TH',genDnSign);addMC('g_dnmax_'+x,'dn','TH',genDnMax);addMC('g_dnzero_'+x,'dn','TH',genDnZero);
  addMC('g_dnexpr_'+x,'dn','TH',genDnExpr);addMC('g_dngiven_'+x,'dn','TH',genDnGiven);
  addMC('g_ttprod_'+x,'tt','NB',genTtProd);addMC('g_ttmul_'+x,'tt','TH',genTtMul);addMC('g_ttdiv_'+x,'tt','TH',genTtDiv);addMC('g_ttcombo_'+x,'tt','TH',genTtCombo);addMC('g_ttdec_'+x,'tt','VD',genTtDec);
  addMC('g_ncmul_'+x,'nc','NB',genNcMul);addMC('g_ncdiv_'+x,'nc','TH',genNcDiv);addMC('g_ncsame_'+x,'nc','TH',genNcSame);addMC('g_ncval_'+x,'nc','TH',genNcVal);addMC('g_nceval_'+x,'nc','TH',genNcEval);
  addMC('g_ltform_'+x,'lt','NB',genLtForm);addMC('g_ltval_'+x,'lt','TH',genLtVal);addMC('g_ltbase_'+x,'lt','TH',genLtBase);addMC('g_ltmix_'+x,'lt','VD',genLtMix);
});

/* ============ Đúng sai ============ */
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
const FB_TF=()=>({stem:'Xét các phát biểu sau:',items:[
  IT(`${PW([2,1],3)} = 8`,true,'dn','TH','2 · 2 · 2 = 8.'),
  IT(`${PW([2,1],3)} = 6`,false,'dn','TH','Luỹ thừa bậc 3 là tích của 3 thừa số 2, bằng 8, không phải 2 · 3.'),
  IT(`${PW([3,1],2)} · ${PW([3,1],4)} = ${PW([3,1],6)}`,true,'nc','TH','Cộng hai số mũ: 2 + 4 = 6.'),
  IT(`${BR(PW([2,1],2))}${SUP(3)} = ${PW([2,1],5)}`,false,'lt','TH','Phải nhân hai số mũ: 2 · 3 = 6.')]});
function pick4(Ts,Fs){const nT=ri(1,3);return shuffle(shuffle(Ts).slice(0,nT).concat(shuffle(Fs).slice(0,4-nT)));}
function mixed(make){
  for(let n=0;n<120;n++){const items=make();if(items.some(i=>!i))continue;const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}
  return null;
}
const four=f=>()=>{const items=mixed(()=>[f(),f(),f(),f()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};
/* ý đúng sai so hai vế theo GIÁ TRỊ: chân trị luôn được tính từ hai giá trị, không gán tay */
const relEq=(L,lv,R,rv,topic,level,exp)=>(okq(lv)&&okq(rv))?IT(`${L} = ${R}`,eqQ(lv,rv),topic,level,exp):null;
function eqItem(left,right,lies,topic,level,exp){const ok=RNG()<.5,pool=lies.filter(q=>q&&q[1]!==0&&!eqQ(Rq(q[0],q[1]),right)),w=ok?right:(pool.length?sel(pool):null);if(!w)return null;return IT(`${left} = ${show(Rq(w[0],w[1]))}`,ok,topic,level,exp);}
const pickW=(ok,good,wrongs)=>ok?good:sel(wrongs);
function itDn(){
  const t=ri(0,4),A=bq(),n=ri(2,4),v=pw(A,n);
  switch(t){
    case 0:return eqItem(PW(A,n),v,[qm(A,[n,1]),negQ(v),pw(A,n-1)],'dn','TH',`${PW(A,n)} = ${prodStr(A,n)} = ${SH(v)}.`);
    case 1:{const r=sel(['<','>']),ok=(r==='>')===(v[0]>0);return IT(`${PW(A,n)} ${r} 0`,ok,'dn','TH',`${PW(A,n)} là số ${v[0]>0?'dương':'âm'}: ${A[0]<0?(n%2===0?'số mũ chẵn nên luỹ thừa của số âm là số dương':'số mũ lẻ nên luỹ thừa của số âm là số âm'):'luỹ thừa của số dương là số dương'}.`);}
    case 2:{const ok=RNG()<.5;return IT(`${PW(A,0)} = ${ok?'1':sel(['0',SH(A)])}`,ok,'dn','NB','Với x ≠ 0 thì '+X1('x',0)+' = 1.');}
    case 3:{const a=ri(2,4),m=ri(2,5);const lv=pw([-a,1],m),rv=negQ(pw([a,1],m));return relEq(`${PW([-a,1],m)}`,lv,`−${a}${SUP(m)}`,rv,'dn','TH',`${PW([-a,1],m)} = ${N(lv[0])} còn −${a}${SUP(m)} = ${N(rv[0])}. ${m%2?'Số mũ lẻ nên hai giá trị bằng nhau.':'Số mũ chẵn nên hai giá trị khác nhau.'}`);}
    default:{const ok=RNG()<.5;return IT(`${PW(A,1)} = ${ok?SH(A):'1'}`,ok,'dn','NB','Luỹ thừa bậc 1 của một số bằng chính số đó: '+X1('x',1)+' = x.');}
  }
}
function itTt(){
  const t=ri(0,3),A=[sgn()*ri(2,5),1],B=[sgn()*ri(2,4),1],n=ri(2,3),AB=qm(A,B),lv=pw(AB,n);
  switch(t){
    case 0:{const c=[[`${PW(A,n)} · ${PW(B,n)}`,qm(pw(A,n),pw(B,n))],[`${PW(A,n)} · ${PA(B,N(B[0]))}`,qm(pw(A,n),B)],[`${PW(A,n)} + ${PW(B,n)}`,qa(pw(A,n),pw(B,n))],[`${PA(A,N(A[0]))} · ${PW(B,n)}`,qm(A,pw(B,n))]],pk=RNG()<.5?c[0]:sel(c.slice(1));
      return relEq(`(${N(A[0])} · ${PA(B,N(B[0]))})${SUP(n)}`,lv,pk[0],pk[1],'tt','TH',`(${N(A[0])} · ${PA(B,N(B[0]))})${SUP(n)} = ${PW(A,n)} · ${PW(B,n)} = ${SH(lv)}: luỹ thừa của một tích bằng tích các luỹ thừa.`);}
    case 1:{const k=ri(2,5),a=sgn()*ri(2,4),Aq=[a*k,1],Kq=[k,1],lq=pw(qd(Aq,Kq),n),c=[[`${PW(Aq,n)} : ${PW(Kq,n)}`,qd(pw(Aq,n),pw(Kq,n))],[`${PW(Aq,n)} : ${k}`,qd(pw(Aq,n),Kq)],[`${N(a*k)} : ${PW(Kq,n)}`,qd(Aq,pw(Kq,n))],[`(${N(a*k)} − ${k})${SUP(n)}`,pw(qs(Aq,Kq),n)]],pk=RNG()<.5?c[0]:sel(c.slice(1));
      return relEq(`(${N(a*k)} : ${k})${SUP(n)}`,lq,pk[0],pk[1],'tt','TH',`(${N(a*k)} : ${k})${SUP(n)} = ${N(a*k)}${SUP(n)} : ${k}${SUP(n)}: luỹ thừa của một thương bằng thương các luỹ thừa.`);}
    case 2:{const c=[[`(${N(A[0])} · ${PA(B,N(B[0]))})${SUP(n)}`,lv],[`(${N(A[0])} + ${PA(B,N(B[0]))})${SUP(n)}`,pw(qa(A,B),n)]],pk=RNG()<.5?c[0]:c[1];
      return relEq(`${PW(A,n)} · ${PW(B,n)}`,qm(pw(A,n),pw(B,n)),pk[0],pk[1],'tt','TH',`${PW(A,n)} · ${PW(B,n)} = (${N(A[0])} · ${PA(B,N(B[0]))})${SUP(n)}, không phải luỹ thừa của tổng.`);}
    default:{const p=sgn()*ri(1,5),q=ri(2,5);if(gcd(p,q)!==1)return null;const P=[p,q],c=[[fr(Math.pow(p,n),Math.pow(q,n)),pw(P,n)],[fr(Math.pow(p,n),q),[Math.pow(p,n),q]],[fr(p,Math.pow(q,n)),[p,Math.pow(q,n)]]],pk=RNG()<.5?c[0]:sel(c.slice(1));
      return relEq(PW(P,n),pw(P,n),pk[0],Rq(pk[1][0],pk[1][1]),'tt','TH','Luỹ thừa của một thương bằng thương các luỹ thừa: phải luỹ thừa cả tử và mẫu.');}
  }
}
function itNc(){
  const t=ri(0,3),A=bq(),m=ri(2,5),n=ri(2,5);
  switch(t){
    case 0:{if(m+n>10)return null;const ks=[m+n,m*n,m+n+1,Math.abs(m-n)+1],k=RNG()<.5?m+n:sel(ks.slice(1));return relEq(`${PW(A,m)} · ${PW(A,n)}`,pw(A,m+n),PW(A,k),pw(A,k),'nc','TH',`${PW(A,m)} · ${PW(A,n)} = ${PW(A,m+n)}: giữ nguyên cơ số, cộng hai số mũ.`);}
    case 1:{const mm=n+ri(1,4),ks=[mm-n,mm+n,mm*n,mm-n+1],k=RNG()<.5?mm-n:sel(ks.slice(1));return relEq(`${PW(A,mm)} : ${PW(A,n)}`,pw(A,mm-n),PW(A,k),pw(A,k),'nc','TH',`${PW(A,mm)} : ${PW(A,n)} = ${PW(A,mm-n)}: giữ nguyên cơ số, trừ hai số mũ.`);}
    case 2:{const B=bq();if(eqQ(A,B))return null;return relEq(`${PW(A,m)} · ${PW(B,n)}`,qm(pw(A,m),pw(B,n)),PW(qm(A,B),m+n),pw(qm(A,B),m+n),'nc','TH','Chỉ cộng được số mũ khi hai luỹ thừa có cùng cơ số.');}
    default:{const a=sgn()*ri(2,3),Aq=[a,1],mm=ri(2,4),nn=ri(2,4);return eqItem(`${PW(Aq,mm)} · ${PW(Aq,nn)}`,pw(Aq,mm+nn),[pw(Aq,mm*nn),qa(pw(Aq,mm),pw(Aq,nn)),pw([a*a,1],mm+nn)],'nc','TH',`${PW(Aq,mm)} · ${PW(Aq,nn)} = ${PW(Aq,mm+nn)} = ${N(pw(Aq,mm+nn)[0])}.`);}
  }
}
function itLt(){
  const t=ri(0,3),A=bq(),m=ri(2,4),n=ri(2,4);
  switch(t){
    case 0:{if(m*n>12)return null;const ks=[m*n,m+n,m,n],k=RNG()<.5?m*n:sel(ks.slice(1));return relEq(`${BR(PW(A,m))}${SUP(n)}`,pw(A,m*n),PW(A,k),pw(A,k),'lt','TH',`${BR(PW(A,m))}${SUP(n)} = ${PW(A,m*n)}: giữ nguyên cơ số, nhân hai số mũ.`);}
    case 1:{if(m*n>12)return null;const c=[[`${BR(PW(A,n))}${SUP(m)}`,pw(A,m*n)],[`${PW(A,m)} · ${PW(A,n)}`,pw(A,m+n)],[`${PW(A,m+n)}`,pw(A,m+n)]],pk=RNG()<.5?c[0]:sel(c.slice(1));return relEq(`${BR(PW(A,m))}${SUP(n)}`,pw(A,m*n),pk[0],pk[1],'lt','TH','Luỹ thừa của luỹ thừa: nhân hai số mũ. Tích hai luỹ thừa cùng cơ số mới cộng hai số mũ.');}
    case 2:{const a=sgn()*ri(2,3),Aq=[a,1],mm=ri(2,3),nn=ri(2,3);return eqItem(`${BR(PW(Aq,mm))}${SUP(nn)}`,pw(Aq,mm*nn),[pw(Aq,mm+nn),pw(Aq,Math.pow(mm,nn)),pw(Aq,mm)],'lt','TH',`${BR(PW(Aq,mm))}${SUP(nn)} = ${PW(Aq,mm*nn)} = ${N(pw(Aq,mm*nn)[0])}.`);}
    default:{const r=sel(BASES_LT),k=ri(2,3),nn=ri(2,5);if(k*nn>12)return null;const ks=[k*nn,k+nn,nn],kk=RNG()<.5?k*nn:sel(ks.slice(1));return relEq(PW(pw(r,k),nn),pw(r,k*nn),PW(r,kk),pw(r,kk),'lt','TH',`${SH(pw(r,k))} = ${PW(r,k)} nên ${PW(pw(r,k),nn)} = ${PW(r,k*nn)}.`);}
  }
}
function itVD(){
  const t=ri(0,3);
  switch(t){
    case 0:{const a=sgn()*ri(2,3),A=[a,1],i=ri(2,5),j=ri(2,5),p=ri(2,i+j-1),r=i+j-p,kk=RNG()<.5?r:sel([r+1,r-1,r+p]);if(kk<0)return null;return relEq(`${PW(A,i)} · ${PW(A,j)} : ${PW(A,p)}`,pw(A,r),PW(A,kk),pw(A,kk),'nc','VD',`${PW(A,i)} · ${PW(A,j)} = ${PW(A,i+j)}; ${PW(A,i+j)} : ${PW(A,p)} = ${PW(A,r)}.`);}
    case 1:{const b=sgn()*ri(2,5),n=ri(3,6),B=[b,1],g=pw(B,n+1),c=[[`${PW(B,n)} · ${PA(B,N(b))}`,g],[`${PW(B,n)} : ${PA(B,N(b))}`,pw(B,n-1)],[`${PW(B,n)} + ${PA(B,N(b))}`,qa(pw(B,n),B)]],pk=RNG()<.5?c[0]:sel(c.slice(1));return relEq(PW(B,n+1),g,pk[0],pk[1],'dn','VD',`${PW(B,n+1)} = ${PW(B,n)} · ${PA(B,N(b))}. Nhân thêm một thừa số cơ số thì số mũ tăng thêm 1.`);}
    case 2:{const P=[[2,3,3,2],[2,4,5,2],[3,4,2,6],[2,5,3,3],[7,2,3,4]],[a,r,b,s]=sel(P),k=ri(2,4),L=pw([a,1],r*k),R=pw([b,1],s*k),rl=sel(['<','>']),ok=(rl==='<')===(L[0]<R[0]);if(!okq(L)||!okq(R))return null;
      return IT(`${PW([a,1],r*k)} ${rl} ${PW([b,1],s*k)}`,ok,'dn','VD',`${PW([a,1],r*k)} = (${a}${SUP(r)})${SUP(k)} = ${N(Math.pow(a,r))}${SUP(k)}; ${PW([b,1],s*k)} = (${b}${SUP(s)})${SUP(k)} = ${N(Math.pow(b,s))}${SUP(k)}. Cùng số mũ ${k} thì so sánh hai cơ số ${N(Math.pow(a,r))} và ${N(Math.pow(b,s))}.`);}
    default:{const A=[sgn()*ri(2,4),1],B=[sgn()*ri(2,4),1],n=ri(2,3),AB=qm(A,B);if(eqQ(A,B)||eqQ(AB,[1,1]))return null;const c=[['1',[1,1]],['0',[0,1]],[N(AB[0]),AB]],pk=RNG()<.5?c[0]:sel(c.slice(1));
      return relEq(`${PW(A,n)} · ${PW(B,n)} : ${PW(AB,n)}`,qd(qm(pw(A,n),pw(B,n)),pw(AB,n)),pk[0],pk[1],'tt','VD',`${PW(A,n)} · ${PW(B,n)} = (${N(A[0])} · ${PA(B,N(B[0]))})${SUP(n)} = ${PW(AB,n)} nên thương bằng 1.`);}
  }
}

/* ============ Ý đúng sai viết sẵn (nhận biết) ============ */
const S1=(t,topic,exp)=>({t,topic,exp});
const PT=[
 S1(`Luỹ thừa bậc n của số hữu tỉ x (n là số tự nhiên lớn hơn 1) là tích của n thừa số x.`,'dn','Đây là định nghĩa luỹ thừa với số mũ tự nhiên.'),
 S1(`Với x ≠ 0 thì ${X1('x',0)} = 1.`,'dn','Đây là quy ước của luỹ thừa bậc 0.'),
 S1(`${X1('x',1)} = x với mọi số hữu tỉ x.`,'dn','Quy ước luỹ thừa bậc 1.'),
 S1('Luỹ thừa bậc chẵn của một số hữu tỉ âm là một số dương.','dn','Tích của một số chẵn các thừa số âm là số dương.'),
 S1(`Luỹ thừa của một tích bằng tích các luỹ thừa: (x · y)${SUP('n')} = ${X1('x','n')} · ${X1('y','n')}.`,'tt','Phải luỹ thừa từng thừa số.'),
 S1(`Với y ≠ 0: (x : y)${SUP('n')} = ${X1('x','n')} : ${X1('y','n')}.`,'tt','Luỹ thừa của một thương bằng thương các luỹ thừa.'),
 S1(`(2 · 3)${SUP(2)} = ${X1('2',2)} · ${X1('3',2)}.`,'tt','Hai vế cùng bằng 36.'),
 S1(`${X1('x','m')} · ${X1('x','n')} = ${X1('x','m + n')}.`,'nc','Nhân hai luỹ thừa cùng cơ số: giữ nguyên cơ số, cộng hai số mũ.'),
 S1(`Với x ≠ 0, m ≥ n: ${X1('x','m')} : ${X1('x','n')} = ${X1('x','m − n')}.`,'nc','Chia hai luỹ thừa cùng cơ số: giữ nguyên cơ số, trừ hai số mũ.'),
 S1('Khi nhân hai luỹ thừa cùng cơ số, ta giữ nguyên cơ số và cộng hai số mũ.','nc','Đây là quy tắc nhân hai luỹ thừa cùng cơ số.'),
 S1(`(${X1('x','m')})${SUP('n')} = ${X1('x','m · n')}.`,'lt','Luỹ thừa của luỹ thừa: giữ nguyên cơ số, nhân hai số mũ.'),
 S1('Khi tính luỹ thừa của một luỹ thừa, ta giữ nguyên cơ số và nhân hai số mũ.','lt','Đây là quy tắc luỹ thừa của luỹ thừa.'),
 S1(`(${X1('x','m')})${SUP('n')} = (${X1('x','n')})${SUP('m')}.`,'lt','Cả hai vế đều bằng '+X1('x','m · n')+'.')];
const PF=[
 S1(`${X1('x','n')} = x · n.`,'dn','Luỹ thừa là tích của n thừa số x, không phải x nhân n.'),
 S1('Luỹ thừa bậc lẻ của một số hữu tỉ âm là một số dương.','dn','Luỹ thừa bậc lẻ của số âm là số âm.'),
 S1(`Trong ${X1('x','n')}, n gọi là cơ số.`,'dn','n gọi là số mũ, x mới là cơ số.'),
 S1(`${PW([-2,1],4)} = −16.`,'dn','(−2) · (−2) · (−2) · (−2) = 16.'),
 S1(`(x · y)${SUP('n')} = x · ${X1('y','n')}.`,'tt','Phải luỹ thừa cả hai thừa số.'),
 S1(`(x + y)${SUP('n')} = ${X1('x','n')} + ${X1('y','n')}.`,'tt','Luỹ thừa của một tổng không bằng tổng các luỹ thừa; chẳng hạn (1 + 1)'+SUP(2)+' = 4 còn 1'+SUP(2)+' + 1'+SUP(2)+' = 2.'),
 S1(`Với y ≠ 0: (x : y)${SUP('n')} = ${X1('x','n')} : y.`,'tt','Phải luỹ thừa cả số bị chia và số chia.'),
 S1(`${X1('x','m')} · ${X1('x','n')} = ${X1('x','m · n')}.`,'nc','Nhân hai luỹ thừa cùng cơ số thì cộng hai số mũ.'),
 S1('Khi chia hai luỹ thừa cùng cơ số khác 0, ta cộng hai số mũ.','nc','Phải trừ hai số mũ.'),
 S1(`${X1('2',3)} · ${X1('3',2)} = ${X1('6',5)}.`,'nc','Hai luỹ thừa khác cơ số nên không cộng được số mũ: 8 · 9 = 72, còn 6'+SUP(5)+' = 7776.'),
 S1(`(${X1('x','m')})${SUP('n')} = ${X1('x','m + n')}.`,'lt','Luỹ thừa của luỹ thừa thì nhân hai số mũ.'),
 S1(`(${X1('x','m')})${SUP('n')} = ${X1('x','m')} · ${X1('x','n')}.`,'lt','Vế phải bằng '+X1('x','m + n')+', còn vế trái bằng '+X1('x','m · n')+'.'),
 S1('Khi tính luỹ thừa của một luỹ thừa, ta cộng hai số mũ.','lt','Phải nhân hai số mũ.')];
const tfNB=t=>()=>{const f=(L,v)=>shuffle(L.filter(i=>i.topic===t)).map(i=>({t:i.t,v,topic:t,level:'NB',exp:i.exp,s:1}));const nT=ri(1,3);return {stem:'Xét các phát biểu sau:',items:shuffle(f(PT,true).slice(0,nT).concat(f(PF,false).slice(0,4-nT)))};};
const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
const TKEYS_LIST=['dn','tt','nc','lt'];
const ITM={dn:itDn,tt:itTt,nc:itNc,lt:itLt};
TKEYS_LIST.forEach(t=>{
  addTF('tf_nb_'+t,t,'NB',tfNB(t));
  ['a','b'].forEach(x=>addTF(`tf_${t}_th_${x}`,t,'TH',four(ITM[t])));
  addTF('tf_'+t+'_vd',t,'VD',four(()=>RNG()<.5?itVD():ITM[t]()));
});
addTF('tf_mix_a','tt','TH',four(()=>sel([itDn,itTt,itNc,itLt])()));
addTF('tf_mix_b','nc','VD',four(()=>RNG()<.6?itVD():sel([itDn,itTt,itNc,itLt])()));

/* ============ Gói Thử thách và Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const mcQ=(stem,right,wrongs,exp,topic,level)=>{const seen=new Set([SH(right)]),w=[];for(const [q,e] of wrongs){const t=SH(q);if(!seen.has(t)){seen.add(t);w.push([t,e]);}}return w.length<3?null:mcq(stem,SH(right),w.slice(0,3),exp,topic,level);};
const saq=(stem,ans,unit,exp,topic,level,at)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp,at});
const ansq=(q,topic,level,stem,exp,unit)=>saq(stem,q[0]/q[1],unit||'',exp,topic,level,SH(q));
function tfHardC(){return four(()=>RNG()<.75?itVD():sel([itDn,itTt,itNc,itLt])())();}
const HARD={tf:[{id:'h_tc',type:'tf',topic:'dn',level:'VD',gen:tfHardC}],sa:[
 {id:'h_cmp',topic:'dn',level:'VD',unit:'',gen:()=>{const [a,r,b,s]=sel([[2,3,3,2],[2,4,5,2],[3,4,2,6],[2,5,3,3],[7,2,3,4],[5,2,2,5]]),k=sel([10,20,25,30,50,100]),big=Math.pow(a,r)>Math.pow(b,s)?1:2;
   return {stem:`So sánh hai số ${E(PW([a,1],r*k))} và ${E(PW([b,1],s*k))}. Nhập 1 nếu số thứ nhất lớn hơn, nhập 2 nếu số thứ hai lớn hơn.`,ans:[big],exp:`${PW([a,1],r*k)} = (${a}${SUP(r)})${SUP(k)} = ${Math.pow(a,r)}${SUP(k)} và ${PW([b,1],s*k)} = (${b}${SUP(s)})${SUP(k)} = ${Math.pow(b,s)}${SUP(k)}. Cùng số mũ ${k}, cơ số ${Math.pow(a,r)} ${big===1?'>':'<'} ${Math.pow(b,s)} nên số ${big===1?'thứ nhất':'thứ hai'} lớn hơn.`};}},
 {id:'h_sum',topic:'nc',level:'VD',unit:'',gen:()=>{const b=sel([2,3,4]),n=ri(4,7);let s=0;for(let i=0;i<=n;i++)s+=Math.pow(b,i);
   return {stem:`Tính S = 1 + ${b} + ${X1(b,2)} + ${X1(b,3)} + … + ${X1(b,n)}.`,ans:[s],exp:`Nhân hai vế với ${b}: ${b}S = ${b} + ${X1(b,2)} + … + ${X1(b,n+1)}. Trừ vế cho vế: ${b-1}S = ${X1(b,n+1)} − 1 = ${Math.pow(b,n+1)-1}. Vậy S = ${s}.`};}},
 {id:'h_pow',topic:'tt',level:'VD',unit:'',gen:()=>{for(;;){const q=ri(2,5),p=ri(1,5);if(gcd(p,q)!==1)continue;const t=ri(2,4),n=ri(3,5),r=Rq(t*q,p);if(r[1]!==1&&r[0]>9)continue;
   return {stem:`Tính ${E(`${PW([p,q],n)} · ${PW(r,n)}`)}.`,ans:[Math.pow(t,n)],exp:`${PW([p,q],n)} · ${PW(r,n)} = (${fr(p,q)} · ${SH(r)})${SUP(n)} = ${PW([t,1],n)} = ${Math.pow(t,n)}.`};}}},
 {id:'h_n',topic:'lt',level:'VD',unit:'',gen:()=>{const a=sel([2,3]),i=ri(2,3),j=ri(2,3),k=ri(2,4),l=ri(3,4),n=k*l-i*j;if(n<1)return null;
   return {stem:`Tìm số tự nhiên n biết ${X1(a,'n')} · (${X1(a,i)})${SUP(j)} = (${X1(a,k)})${SUP(l)}.`,ans:[n],exp:`${BR(X1(a,i))}${SUP(j)} = ${X1(a,i*j)} và (${X1(a,k)})${SUP(l)} = ${X1(a,k*l)}. Do đó ${X1(a,'n')} · ${X1(a,i*j)} = ${X1(a,k*l)}, suy ra n + ${i*j} = ${k*l} và n = ${n}.`};}}
].map(q=>{const f=q.gen;return Object.assign({type:'sa'},q,{gen:()=>{for(let i=0;i<200;i++){const r=f();if(r)return r;}throw new Error('h_n');}});})};
const PISA=[
 ()=>{for(;;){
  const a=ri(2,4),k=ri(2,3),b=a*k;
  const R1={title:'Bể nước hình lập phương',ctx:`<p class="stem">Hai bể nước đều có dạng hình lập phương. Cạnh của mỗi bể cho trong bảng (đơn vị: mét).</p>${tbl(['Bể','Cạnh (m)'],[['Bể A',String(a)],['Bể B',String(b)]])}`,qs:[
   mcQ('Thể tích của bể A (m³) là:',[a*a*a,1],[[[3*a,1],'Thể tích hình lập phương cạnh a là a'+SUP(3)+', không phải 3 · a.'],[[a*a,1],'Đó là diện tích một mặt, còn thể tích là a'+SUP(3)+'.'],[[2*a*a,1],'Thể tích hình lập phương cạnh a là a · a · a.']],`V = a${SUP(3)} = ${PW([a,1],3)} = ${a*a*a} (m³).`,'dn','TH'),
   ansq([a*a,1],'dn','NB','Diện tích một mặt của bể A là bao nhiêu mét vuông?',`Mặt bể là hình vuông cạnh ${a} m: ${a}${SUP(2)} = ${a*a} (m²).`,'m²'),
   ansq([k*k*k,1],'tt','VD','Thể tích bể B gấp bao nhiêu lần thể tích bể A?',`${PW([b,1],3)} : ${PW([a,1],3)} = (${b} : ${a})${SUP(3)} = ${PW([k,1],3)} = ${k*k*k}.`,'lần'),
   ansq([1,k*k*k],'tt','VD','Nếu rót đầy nước của bể A sang bể B thì nước chiếm bao nhiêu phần thể tích bể B? Nhập dạng phân số tối giản.',`${PW([a,1],3)} : ${PW([b,1],3)} = (${a} : ${b})${SUP(3)} = ${PW([1,k],3)} = ${fr(1,k*k*k)}.`,'')]};if(R1.qs[0])return R1;}},
 ()=>{for(;;){
  const c=ri(2,5),n=ri(4,7),m=ri(2,3),big=ri(2,3);
  const R2={title:'Vi khuẩn phân chia',ctx:`<p class="stem">Một loại vi khuẩn cứ sau mỗi giờ thì mỗi con phân chia thành 2 con. Lúc đầu có ${c} con vi khuẩn.</p>`,qs:[
   mcQ('Sau 3 giờ, số vi khuẩn là bao nhiêu con?',[c*8,1],[[[c*6,1],'Mỗi giờ số vi khuẩn gấp đôi: sau 3 giờ là nhân với 2'+SUP(3)+', không phải 2 · 3.'],[[c*9,1],'Hệ số nhân sau 3 giờ là 2'+SUP(3)+' = 8, không phải 3'+SUP(2)+'.'],[[c*4,1],'Sau 3 giờ phải nhân với 2 ba lần, không phải hai lần.']],`Sau 3 giờ: ${c} · ${X1(2,3)} = ${c*8} (con).`,'dn','TH'),
   ansq([c*Math.pow(2,n),1],'dn','TH',`Sau ${n} giờ có bao nhiêu con vi khuẩn?`,`${c} · ${X1(2,n)} = ${c*Math.pow(2,n)} (con).`,'con'),
   saq(`Sau bao nhiêu giờ thì số vi khuẩn là ${c*Math.pow(2,n+1)} con?`,n+1,'giờ',`${c*Math.pow(2,n+1)} : ${c} = ${Math.pow(2,n+1)} = ${X1(2,n+1)} nên sau ${n+1} giờ.`,'dn','VD'),
   saq(`Số vi khuẩn sau ${m+big} giờ gấp bao nhiêu lần số vi khuẩn sau ${m} giờ?`,Math.pow(2,big),'lần',`${X1(2,m+big)} : ${X1(2,m)} = ${X1(2,big)} = ${Math.pow(2,big)}.`,'nc','VD')]};if(R2.qs[0])return R2;}}
];

/* ============ Trả lời ngắn ============ */
const saF=(stem,g,exp,at)=>({stem,ans:[g[0]/g[1]],at:at===undefined?SH(g):at,exp});
function saDnVal(){const a=sgn()*ri(2,6),n=ri(2,4),A=[a,1],g=pw(A,n);return {stem:`Tính ${E(PW(A,n))}.`,ans:[g[0]],exp:`${PW(A,n)} = ${prodStr(A,n)} = ${N(g[0])}.`};}
function saDnRep(){const b=sel([2,3,5]),n=ri(3,b===2?9:b===3?6:5),v=Math.pow(b,n);return {stem:`Số ${E(N(v))} viết được dưới dạng ${b}${SUP('n')}. Tìm số tự nhiên n.`,ans:[n],exp:`${N(v)} = ${Array(n).fill(b).join(' · ')} = ${b}${SUP(n)} nên n = ${n}.`};}
function saDnFr(){for(;;){const dec=RNG()<.3,q=dec?rdec():rfr(),n=dec?ri(2,3):ri(2,4),g=pw(q,n);if(!magOK(g))continue;return saF(`Tính ${E(PW(q,n,dec))}. Nhập dạng phân số tối giản hoặc số nguyên.`,g,`${PW(q,n,dec)} = ${prodStr(q,n,dec)} = ${SH(g)}.`);}}
function saDnExp(){const b=sel([2,3,4,5]),n=ri(3,b===2?9:b===3?6:5),v=Math.pow(b,n);return {stem:`Tìm số tự nhiên n biết ${b}${SUP('n')} = ${v}.`,ans:[n],exp:`${v} = ${Array(n).fill(b).join(' · ')} = ${b}${SUP(n)} nên n = ${n}.`};}
function saDnExpr(){for(;;){const A=bi(),B=bi(),C3=bi(),m=ri(2,3),n=ri(2,3),k=ri(2,3),o1=sel(['+','−']),o2=sel(['+','−']),f=(x,y,o)=>o==='+'?qa(x,y):qs(x,y),v1=pw(A,m),v2=pw(B,n),v3=pw(C3,k),g=f(f(v1,v2,o1),v3,o2);
  return {stem:`Tính ${E(`${PW(A,m)} ${o1} ${PW(B,n)} ${o2} ${PW(C3,k)}`)}.`,ans:[g[0]],exp:`${SH(v1)} ${o1} ${PA(v2,SH(v2))} ${o2} ${PA(v3,SH(v3))} = ${SH(g)}.`};}}
function saTtProd(){for(;;){const a=sgn()*ri(2,4),b=sgn()*ri(2,4),n=ri(2,3),g=pw([a*b,1],n);return {stem:`Tính ${E(`(${N(a)} · ${PA([b,1],N(b))})${SUP(n)}`)}.`,ans:[g[0]],exp:`(${N(a)} · ${PA([b,1],N(b))})${SUP(n)} = ${PW([a*b,1],n)} = ${N(g[0])}.`};}}
function saTtMul(){for(;;){const q=ri(2,5),p=sgn()*ri(1,5);if(gcd(p,q)!==1)continue;const n=ri(2,5),Pq=[p,q];return {stem:`Tính ${E(`${PW(Pq,n)} · ${PW([q,1],n)}`)}.`,ans:[Math.pow(p,n)],exp:`${PW(Pq,n)} · ${PW([q,1],n)} = (${SH(Pq)} · ${q})${SUP(n)} = ${PW([p,1],n)} = ${N(Math.pow(p,n))}.`};}}
function saTtDiv(){const a=sgn()*ri(2,5),k=ri(2,5),n=ri(2,4);return {stem:`Tính ${E(`${PW([a*k,1],n)} : ${PW([k,1],n)}`)}.`,ans:[Math.pow(a,n)],exp:`${PW([a*k,1],n)} : ${PW([k,1],n)} = (${N(a*k)} : ${k})${SUP(n)} = ${PW([a,1],n)} = ${N(Math.pow(a,n))}.`};}
function saTtCombo(){for(;;){const a=sgn()*ri(2,6),b=sgn()*ri(2,6),c=ri(2,5);if((a*b)%c!==0)continue;const t=a*b/c,n=ri(2,3);if(Math.abs(t)<2||Math.abs(t)>6)continue;
  return {stem:`Tính ${E(`${PW([a,1],n)} · ${PW([b,1],n)} : ${PW([c,1],n)}`)}.`,ans:[Math.pow(t,n)],exp:`(${N(a)} · ${PA([b,1],N(b))} : ${c})${SUP(n)} = ${PW([t,1],n)} = ${N(Math.pow(t,n))}.`};}}
function saTtDec(){const c=ri(2,9),n=ri(2,3),Q=Rq(c,10);return {stem:`Tính ${E(`${PW(Q,n,true)} · ${PW([10,1],n)}`)}.`,ans:[Math.pow(c,n)],exp:`${PW(Q,n,true)} · 10${SUP(n)} = (${DEC(Q)} · 10)${SUP(n)} = ${c}${SUP(n)} = ${Math.pow(c,n)}.`};}
function saNcMul(){for(;;){const a=sgn()*ri(2,5),A=[a,1],m=ri(2,6),n=ri(2,6);if(m+n>10)continue;return {stem:`Viết ${E(`${PW(A,m)} · ${PW(A,n)}`)} dưới dạng ${PW(A,'k')}. Tìm k.`,ans:[m+n],exp:`${PW(A,m)} · ${PW(A,n)} = ${PW(A,m+n)} nên k = ${m+n}.`};}}
function saNcDiv(){const a=sgn()*ri(2,5),A=[a,1],n=ri(2,5),m=ri(n+1,n+6);return {stem:`Viết ${E(`${PW(A,m)} : ${PW(A,n)}`)} dưới dạng ${PW(A,'k')}. Tìm k.`,ans:[m-n],exp:`${PW(A,m)} : ${PW(A,n)} = ${PW(A,m-n)} nên k = ${m-n}.`};}
function saNcVal(){const a=sgn()*ri(2,4),A=[a,1],m=ri(2,4),n=ri(2,4),g=pw(A,m+n);return {stem:`Tính ${E(`${PW(A,m)} · ${PW(A,n)}`)}.`,ans:[g[0]],exp:`${PW(A,m)} · ${PW(A,n)} = ${PW(A,m+n)} = ${N(g[0])}.`};}
function saNcEval(){const a=sgn()*ri(2,3),A=[a,1],m=ri(2,5),n=ri(2,5),p=ri(2,m+n-2),g=pw(A,m+n-p);return {stem:`Tính ${E(`${PW(A,m)} · ${PW(A,n)} : ${PW(A,p)}`)}.`,ans:[g[0]],exp:`${PW(A,m)} · ${PW(A,n)} : ${PW(A,p)} = ${PW(A,m+n-p)} = ${N(g[0])}.`};}
function saLtExp(){for(;;){const a=sgn()*ri(2,5),A=[a,1],m=ri(2,4),n=ri(2,4);return {stem:`Viết ${E(BR(PW(A,m))+SUP(n))} dưới dạng ${PW(A,'k')}. Tìm k.`,ans:[m*n],exp:`${BR(PW(A,m))}${SUP(n)} = ${PW(A,m*n)} nên k = ${m*n}.`};}}
function saLtVal(){const a=sgn()*ri(2,3),A=[a,1],m=ri(2,3),n=ri(2,3),g=pw(A,m*n);return {stem:`Tính ${E(BR(PW(A,m))+SUP(n))}.`,ans:[g[0]],exp:`${BR(PW(A,m))}${SUP(n)} = ${PW(A,m*n)} = ${N(g[0])}.`};}
function saLtBase(){for(;;){const r=sel(BASES_LT),k=ri(2,3),n=ri(2,5);if(k*n>12)continue;return {stem:`Viết ${E(PW(pw(r,k),n))} dưới dạng ${PW(r,'k')}. Tìm k.`,ans:[k*n],exp:`${SH(pw(r,k))} = ${PW(r,k)} nên ${PW(pw(r,k),n)} = ${BR(PW(r,k))}${SUP(n)} = ${PW(r,k*n)}, suy ra k = ${k*n}.`};}}
function saLtMix(){for(;;){const a=sgn()*ri(2,3),A=[a,1],m=ri(2,3),n=ri(2,3),k=ri(2,4),div=RNG()<.4,e=div?m*n-k:m*n+k;if(e<1)continue;const g=pw(A,e);if(Math.abs(g[0])>1e6)continue;
  return {stem:`Tính ${E(`${BR(PW(A,m))}${SUP(n)} ${div?':':'·'} ${PW(A,k)}`)}.`,ans:[g[0]],exp:`${BR(PW(A,m))}${SUP(n)} = ${PW(A,m*n)}; ${PW(A,m*n)} ${div?':':'·'} ${PW(A,k)} = ${PW(A,e)} = ${N(g[0])}.`};}}

/* ============ Câu vận dụng bổ sung: tìm x, tìm số mũ, so sánh luỹ thừa, đổi cơ số, bài toán thực tế ============ */
function genVdFindX(){return tryGen(()=>{
  const a=sgn()*ri(2,5),A=[a,1],m=ri(2,4),n=ri(m+2,m+4),div=RNG()<.5,e=div?m+n:n-m,good=pw(A,e),T=k=>'x = '+PW(A,k);
  if(div)return mk(`Tìm x, biết ${E(`x : ${PW(A,m)} = ${PW(A,n)}`)}.`,T(e),[
    Wt(good,pw(A,n-m),T(n-m),'Muốn tìm số bị chia, ta lấy thương nhân với số chia. Bạn đã chia nên trừ hai số mũ.'),
    Wt(good,pw(A,m*n),T(m*n),'Nhân hai luỹ thừa cùng cơ số thì cộng hai số mũ, không nhân hai số mũ.'),
    Wt(good,pw(A,n),T(n),'Bạn chưa nhân thương với số chia.'),
    Wt(good,pw(A,m+n+1),T(m+n+1),'Bạn cộng sai hai số mũ.')],
    `x = ${PW(A,n)} · ${PW(A,m)} = ${PW(A,`${n} + ${m}`)} = ${PW(A,e)}.`);
  return mk(`Tìm x, biết ${E(`${PW(A,m)} · x = ${PW(A,n)}`)}.`,T(e),[
    Wt(good,pw(A,m+n),T(m+n),'Muốn tìm thừa số chưa biết, ta lấy tích chia cho thừa số đã biết. Bạn đã nhân nên cộng hai số mũ.'),
    n%m===0?Wt(good,pw(A,n/m),T(n/m),'Chia hai luỹ thừa cùng cơ số thì trừ hai số mũ, không chia hai số mũ.'):null,
    Wt(good,pw(A,n),T(n),'Bạn chưa chia tích cho thừa số đã biết.'),
    Wt(good,pw(A,e+1),T(e+1),'Bạn trừ sai hai số mũ.'),
    Wt(good,pw(A,e-1),T(e-1),'Bạn trừ sai hai số mũ.')],
    `x = ${PW(A,n)} : ${PW(A,m)} = ${PW(A,`${n} − ${m}`)} = ${PW(A,e)}.`);
});}
const CMP_VD=[[2,3,3,2],[2,5,5,2],[3,3,5,2],[2,7,5,3],[2,5,3,3],[3,4,4,3]];   // [a,p,b,q]: so sánh a^p với b^q
function vdCmpData(){
  let [a,p,b,q]=sel(CMP_VD);const k=ri(5,25);
  if(RNG()<.5){[a,p,b,q]=[b,q,a,p];}
  return {a,p,b,q,k,u:Math.pow(a,p),v:Math.pow(b,q)};
}
function genVdCmp(){return tryGen(()=>{
  const d=vdCmpData(),{a,p,b,q,k,u,v}=d,A=PW([a,1],p*k),B=PW([b,1],q*k),sg=u<v?'<':'>',op=u<v?'>':'<';
  const how=`${A} = (${a}${SUP(p)})${SUP(k)} = ${u}${SUP(k)} và ${B} = (${b}${SUP(q)})${SUP(k)} = ${v}${SUP(k)}`;
  return mk(`So sánh ${E(A)} và ${E(B)}.`,`${A} ${sg} ${B}`,[
    C(`${A} ${op} ${B}`,`Cơ số lớn hơn hay số mũ lớn hơn chưa đủ để kết luận. Hãy đưa về cùng số mũ ${k}: ${how}.`),
    C(`${A} = ${B}`,`Hai luỹ thừa này không bằng nhau: ${how}, mà ${u} ≠ ${v}.`),
    C('Không so sánh được vì khác cả cơ số và số mũ',`Vẫn so sánh được nếu đưa về cùng số mũ ${k}: ${how}.`)],
    `Đưa về cùng số mũ ${k}: ${how}. Vì ${u} ${sg} ${v} nên ${u}${SUP(k)} ${sg} ${v}${SUP(k)}, tức là ${A} ${sg} ${B}.`);
});}
function vdGrowData(){
  if(RNG()<.5){const t=sel([15,20,30]),n=ri(3,7);return {n,stem:`Một loại vi khuẩn cứ ${t} phút lại phân đôi một lần (mỗi con thành 2 con). Ban đầu có 1 con vi khuẩn. Sau ${t*n} phút có tất cả bao nhiêu con vi khuẩn?`,why:`Trong ${t*n} phút có ${t*n} : ${t} = ${n} lần phân đôi. Sau mỗi lần số vi khuẩn gấp đôi`,unit:'con'};}
  const n=ri(3,6);return {n,stem:`Bạn Lan gấp đôi một tờ giấy, rồi lại gấp đôi tiếp. Sau ${n} lần gấp đôi liên tiếp, xấp giấy thu được dày bao nhiêu lớp giấy?`,why:`Sau mỗi lần gấp đôi, số lớp giấy tăng gấp 2`,unit:'lớp'};
}
function genVdGrow(){return tryGen(()=>{
  const d=vdGrowData(),n=d.n,good=[Math.pow(2,n),1];
  return mk(d.stem,show(good),[
    Wq(good,[2*n,1],`Sau mỗi lần số lượng gấp đôi, tức là nhân với 2, không phải cộng thêm 2. Kết quả là 2${SUP(n)}, không phải 2 · ${n}.`),
    Wq(good,[n*n,1],`Bạn nhầm cơ số và số mũ: phải tính 2${SUP(n)}, không phải ${n}${SUP(2)}.`),
    Wq(good,[Math.pow(2,n-1),1],'Bạn đếm thiếu một lần gấp đôi.'),
    Wq(good,[Math.pow(2,n+1),1],'Bạn đếm thừa một lần gấp đôi.')],
    `${d.why}, nên kết quả là ${Array(n).fill(2).join(' · ')} = 2${SUP(n)} = ${N(good[0])}.`);
});}
function vdBaseData(){
  const r=sel([2,3]),a=ri(2,4);let b=ri(2,4);while(b===a)b=ri(2,4);
  return {r,a,b,u:r*r,v:r*r*r,e:2*a+3*b};
}
function genVdBase(){return tryGen(()=>{
  const {r,a,b,u,v,e}=vdBaseData(),R=[r,1],good=pw(R,e),P=k=>PW(R,k);
  return mk(`Viết ${E(`${PW([u,1],a)} · ${PW([v,1],b)}`)} dưới dạng luỹ thừa của ${r}.`,P(e),[
    Wt(good,pw(R,a+b),P(a+b),`Phải đổi ${u} = ${r}${SUP(2)} và ${v} = ${r}${SUP(3)} trước, rồi mới cộng các số mũ.`),
    Wt(good,pw(R,3*a+2*b),P(3*a+2*b),`Bạn nhầm: ${u} = ${r}${SUP(2)} và ${v} = ${r}${SUP(3)}, không phải ngược lại.`),
    Wt(good,pw(R,a+3*b),P(a+3*b),`Bạn mới đổi ${v} = ${r}${SUP(3)}, còn ${u} = ${r}${SUP(2)} chưa đổi.`),
    Wt(good,pw(R,2*a+b),P(2*a+b),`Bạn mới đổi ${u} = ${r}${SUP(2)}, còn ${v} = ${r}${SUP(3)} chưa đổi.`)],
    `${PW([u,1],a)} = (${r}${SUP(2)})${SUP(a)} = ${P(2*a)} và ${PW([v,1],b)} = (${r}${SUP(3)})${SUP(b)} = ${P(3*b)}. Vậy ${PW([u,1],a)} · ${PW([v,1],b)} = ${P(2*a)} · ${P(3*b)} = ${P(`${2*a} + ${3*b}`)} = ${P(e)}.`);
});}
function vdTenData(){
  const k=ri(2,4),j=ri(1,2),two=RNG()<.5,m=two?k+j:k,n=two?k:k+j,rest=Math.pow(two?2:5,j),val=rest*Math.pow(10,k);
  const ex=`${PW([2,1],m)} · ${PW([5,1],n)}`;
  const exp=two?`${ex} = 2${SUP(j)} · (2${SUP(k)} · 5${SUP(k)}) = ${rest} · 10${SUP(k)} = ${N(val)}.`:`${ex} = (2${SUP(k)} · 5${SUP(k)}) · 5${SUP(j)} = 10${SUP(k)} · ${rest} = ${N(val)}.`;
  return {k,j,m,n,val,ex,exp};
}
function genVdTen(){return tryGen(()=>{
  const d=vdTenData(),good=[d.val,1];
  return mk(`Tính một cách hợp lí ${E(d.ex)}.`,show(good),[
    Wq(good,[Math.pow(10,d.m+d.n),1],`Hai luỹ thừa khác cơ số nên không cộng số mũ được. Chỉ ghép được 2${SUP(d.k)} · 5${SUP(d.k)} = 10${SUP(d.k)}.`),
    Wq(good,[Math.pow(10,d.k),1],`Bạn đã ghép 2${SUP(d.k)} · 5${SUP(d.k)} = 10${SUP(d.k)} nhưng bỏ quên thừa số còn lại.`),
    Wq(good,[Math.pow(10,d.k+d.j),1],`Chỉ có ${d.k} cặp thừa số 2 và 5 để ghép thành 10, không phải ${d.k+d.j} cặp.`)],
    d.exp);
});}
function saVdGrow(){const d=vdGrowData(),v=Math.pow(2,d.n);return {stem:d.stem,ans:[v],exp:`${d.why}, nên kết quả là ${Array(d.n).fill(2).join(' · ')} = 2${SUP(d.n)} = ${v}.`};}
function saVdTen(){const d=vdTenData();return {stem:`Tính một cách hợp lí ${E(d.ex)}.`,ans:[d.val],exp:d.exp};}
function saVdFindN(){const a=sel([2,3,5]),A=[a,1],k=ri(2,3),div=RNG()<.5;
  if(div){const n=k+ri(1,4),v=Math.pow(a,n-k);return {stem:`Tìm số tự nhiên n, biết ${E(`${PW(A,'n')} : ${PW(A,k)} = ${N(v)}`)}.`,ans:[n],exp:`${N(v)} = ${PW(A,n-k)} và ${PW(A,'n')} : ${PW(A,k)} = ${PW(A,'n − '+k)}. Vậy n − ${k} = ${n-k}, suy ra n = ${n}.`};}
  const n=ri(2,4),v=Math.pow(a,n+k);return {stem:`Tìm số tự nhiên n, biết ${E(`${PW(A,'n')} · ${PW(A,k)} = ${N(v)}`)}.`,ans:[n],exp:`${N(v)} = ${PW(A,n+k)} và ${PW(A,'n')} · ${PW(A,k)} = ${PW(A,'n + '+k)}. Vậy n + ${k} = ${n+k}, suy ra n = ${n}.`};}
function saVdFindN2(){const a=sel([2,3]),A=[a,1],k=ri(2,3),n=ri(2,3),v=Math.pow(a,n*k);
  return {stem:`Tìm số tự nhiên n, biết ${E(`${BR(PW(A,'n'))}${SUP(k)} = ${N(v)}`)}.`,ans:[n],exp:`${N(v)} = ${PW(A,n*k)} và ${BR(PW(A,'n'))}${SUP(k)} = ${PW(A,'n · '+k)}. Vậy n · ${k} = ${n*k}, suy ra n = ${n}.`};}
function saVdQuot(){const c=ri(2,4),a=c+ri(1,3),b=ri(2,3),d=2*b-ri(1,2),v=Math.pow(2,a-c)*Math.pow(3,2*b-d);
  return {stem:`Tính ${E(`(${PW([2,1],a)} · ${PW([9,1],b)}) : (${PW([2,1],c)} · ${PW([3,1],d)})`)}.`,ans:[v],exp:`${PW([9,1],b)} = (3${SUP(2)})${SUP(b)} = ${PW([3,1],2*b)}. Do đó biểu thức bằng (${PW([2,1],a)} : ${PW([2,1],c)}) · (${PW([3,1],2*b)} : ${PW([3,1],d)}) = ${PW([2,1],a-c)} · ${PW([3,1],2*b-d)} = ${Math.pow(2,a-c)} · ${Math.pow(3,2*b-d)} = ${v}.`};}
['a','b','c'].forEach(x=>{
  addMC('g_vdgrow_'+x,'dn','VD',genVdGrow);addMC('g_vdten_'+x,'tt','VD',genVdTen);addMC('g_vdfindx_'+x,'nc','VD',genVdFindX);
  addMC('g_vdcmp_'+x,'lt','VD',genVdCmp);addMC('g_vdbase_'+x,'lt','VD',genVdBase);
});

/* ============ Bổ sung theo các dạng trong tài liệu dạy thêm của giáo viên ============
   tìm x với cơ số là phân số, tìm số mũ, hai luỹ thừa cùng số mũ, rút gọn biểu thức luỹ thừa dạng phân số,
   so sánh hai luỹ thừa có cơ số nhỏ hơn 1 */
const FRH=(a,b)=>`<span class="fr"><span>${a}</span><span>${b}</span></span>`;      // phân số có tử, mẫu là biểu thức
const rbase=()=>{for(;;){const q=ri(2,5),p=ri(1,q-1);if(gcd(p,q)===1)return [sgn()*p,q];}};   // cơ số là phân số, giá trị tuyệt đối nhỏ hơn 1
/* --- tìm x, cơ số là phân số --- */
function findXqData(){
  const B=rbase(),mul=RNG()<.5,m=mul?ri(2,5):ri(2,3),e=ri(2,3);
  if(mul){const good=pw(B,e);return {B,m,e,mul,good,h:`${PW(B,m)} · x = ${PW(B,m+e)}`,exp:`x = ${PW(B,m+e)} : ${PW(B,m)} = ${PW(B,`${m+e} − ${m}`)} = ${PW(B,e)} = ${SH(good)}.`};}
  const k=ri(1,2),good=pw(B,m+k);if(m+k>5)return null;
  return {B,m,e:m+k,k,mul,good,h:`x : ${PW(B,m)} = ${PW(B,k)}`,exp:`x = ${PW(B,k)} · ${PW(B,m)} = ${PW(B,`${k} + ${m}`)} = ${PW(B,m+k)} = ${SH(good)}.`};
}
function genNcFindXq(){return tryGen(()=>{const d=findXqData();if(!d)return null;const {B,e,good}=d;
  return mk(`Tìm x, biết ${E(d.h)}.`,show(good),[
    Wq(good,pw(B,e+1),'Bạn tính sai số mũ của kết quả.'),
    e>1?Wq(good,pw(B,e-1),'Bạn tính sai số mũ của kết quả.'):null,
    Wq(good,negQ(good),`Sai dấu: ${PW(B,e)} = ${SH(good)}.`),
    Wq(good,qinv(good),'Bạn đã viết ngược tử số và mẫu số của kết quả.'),
    Wq(good,[good[0]*e,good[1]],'Luỹ thừa không phải là nhân cơ số với số mũ.')],d.exp);
});}
const saNcFindXq=()=>{for(;;){const d=findXqData();if(d)return saF(`Tìm x, biết ${E(d.h)}. Nhập dạng phân số tối giản hoặc số nguyên.`,d.good,d.exp);}};
/* --- tìm số mũ --- */
function findExpData(){const B=rbase(),n=ri(2,5),V=pw(B,n);return {B,n,V,h:`${PW(B,'x')} = ${SH(V)}`,exp:`${SH(V)} = ${PW(B,n)} nên x = ${n}.`};}
function genDnFindExp(){return tryGen(()=>{const d=findExpData(),{B,n,V}=d;
  return mk(`Tìm số tự nhiên x, biết ${E(d.h)}.`,String(n),[
    C(String(n+1),`${PW(B,n+1)} = ${SH(pw(B,n+1))}, khác ${SH(V)}.`),
    C(String(n-1),`${PW(B,n-1)} = ${SH(pw(B,n-1))}, khác ${SH(V)}.`),
    C(String(V[1]/B[1]),`Bạn đã lấy mẫu số ${V[1]} chia cho ${B[1]}. Phải viết ${SH(V)} thành luỹ thừa của ${SH(B)}.`),
    C(String(n*2),'Bạn tính sai số mũ.')],d.exp);
});}
const saDnFindExp=()=>{const d=findExpData();return {stem:`Tìm số tự nhiên x, biết ${E(d.h)}.`,ans:[d.n],exp:d.exp};};
function expEqData(){
  for(;;){const B=rbase(),c=ri(2,3),x0=ri(1,3),dd=ri(-2,3),e=c*x0+dd;if(e<2||e>6||dd===0)continue;
    const V=pw(B,e),ex=`${c}x ${dd<0?'−':'+'} ${Math.abs(dd)}`;
    return {B,c,x0,dd,e,V,h:`${PW(B,ex)} = ${SH(V)}`,exp:`${SH(V)} = ${PW(B,e)} nên ${ex} = ${e}, suy ra ${c}x = ${e-dd} và x = ${x0}.`};}
}
function genVdExpEq(){return tryGen(()=>{const d=expEqData(),{c,x0,dd,e}=d;
  return mk(`Tìm số tự nhiên x, biết ${E(d.h)}.`,String(x0),[
    C(String(e),`${e} là giá trị của cả số mũ ${c}x ${dd<0?'−':'+'} ${Math.abs(dd)}, chưa phải x.`),
    C(String(e-dd),`${e-dd} là giá trị của ${c}x, còn phải chia cho ${c}.`),
    C(String(x0+1),'Hãy thay lại vào số mũ để kiểm tra.'),
    C(String(Math.abs(x0-1)),'Hãy thay lại vào số mũ để kiểm tra.')],d.exp);
});}
const saVdExpEq=()=>{const d=expEqData();return {stem:`Tìm số tự nhiên x, biết ${E(d.h)}.`,ans:[d.x0],exp:d.exp};};
/* --- hai luỹ thừa cùng số mũ --- */
function pow3Data(){
  for(;;){const r=Rq(sgn()*ri(1,3),ri(1,3)),c=sel([1,1,2,3]),p=RNG()<.5?[ri(1,4),1]:Rq(ri(1,3),ri(2,4)),good=qd(qa(r,p),[c,1]),V=pw(r,3);
    if(good[1]>24||good[0]===0||Math.abs(r[0])===r[1])continue;
    const cx=c===1?'x':`${c}x`;
    return {r,c,p,good,V,cx,h:`(${cx} − ${SH(p)})${SUP(3)} = ${SH(V)}`,exp:`${SH(V)} = ${PW(r,3)} nên ${cx} − ${SH(p)} = ${SH(r)}. Suy ra ${cx} = ${SH(qa(r,p))}${c===1?'':` và x = ${SH(good)}`}.`};}
}
function genVdPow3(){return tryGen(()=>{const d=pow3Data(),{r,c,p,good,V}=d;
  return mk(`Tìm x, biết ${E(d.h)}.`,show(good),[
    Wq(good,qd(qa(V,p),[c,1]),`Phải viết ${SH(V)} = ${PW(r,3)} để suy ra ${d.cx} − ${SH(p)} = ${SH(r)}. Bạn chưa đưa về cùng số mũ.`),
    Wq(good,qd(qs(r,p),[c,1]),`Từ ${d.cx} − ${SH(p)} = ${SH(r)} suy ra ${d.cx} = ${SH(r)} + ${SH(p)}. Bạn đã trừ.`),
    Wq(good,r,`${SH(r)} là giá trị của ${d.cx} − ${SH(p)}, chưa phải x.`),
    c>1?Wq(good,qa(r,p),`${SH(qa(r,p))} là giá trị của ${d.cx}, còn phải chia cho ${c}.`):null,
    Wq(good,negQ(good),'Sai dấu của kết quả.')],d.exp);
});}
const saVdPow3=()=>{const d=pow3Data();return saF(`Tìm x, biết ${E(d.h)}. Nhập dạng phân số tối giản hoặc số nguyên.`,d.good,d.exp);};
function genVdPow2(){return tryGen(()=>{
  const r=Rq(ri(1,5),ri(1,4)),p=RNG()<.5?[sgn()*ri(1,4),1]:Rq(sgn()*ri(1,3),ri(2,4)),V=pw(r,2),x1=qs(r,p),x2=qs(negQ(r),p);
  if(x1[1]>24)return null;
  const f=p[0]<0?`x − ${SH(negQ(p))}`:`x + ${SH(p)}`,T=(a,b)=>`x = ${SH(a)} hoặc x = ${SH(b)}`,h=qm(V,[1,2]);
  return mk(`Tìm x, biết ${E(`(${f})${SUP(2)} = ${SH(V)}`)}.`,T(x1,x2),[
    C(`Chỉ có x = ${SH(x1)}`,`Hai số đối nhau có bình phương bằng nhau, nên ${f} = ${SH(r)} hoặc ${f} = ${SH(negQ(r))}.`),
    C(T(qa(r,p),qa(negQ(r),p)),`Từ ${f} = ${SH(r)} suy ra x = ${SH(x1)}. Bạn đã chuyển vế sai dấu.`),
    C(T(qs(h,p),qs(negQ(h),p)),`${SH(V)} = ${PW(r,2)}, không phải ${SH(h)} · 2. Bình phương không phải là nhân với 2.`),
    C(T(qs(V,p),qs(negQ(V),p)),`Phải viết ${SH(V)} = ${PW(r,2)} rồi mới suy ra ${f} = ${SH(r)} hoặc ${f} = ${SH(negQ(r))}.`)],
    `${SH(V)} = ${PW(r,2)} = ${PW(negQ(r),2)} nên ${f} = ${SH(r)} hoặc ${f} = ${SH(negQ(r))}. Vậy x = ${SH(x1)} hoặc x = ${SH(x2)}.`);
});}
/* --- rút gọn biểu thức luỹ thừa dạng phân số --- */
function fracData(){
  for(;;){const c=ri(2,6),d=ri(2,3),u=ri(-3,3),v=ri(-2,3);if((c+v)%2!==0||(u===0&&v===0))continue;const b=(c+v)/2,a=u+c+3*d;if(b<2||a<2||a>18)continue;
    const P=(x,y)=>Rq(Math.pow(2,Math.max(x,0))*Math.pow(3,Math.max(y,0)),Math.pow(2,Math.max(-x,0))*Math.pow(3,Math.max(-y,0)));
    const h=FRH(`2${SUP(a)} · 9${SUP(b)}`,`6${SUP(c)} · 8${SUP(d)}`);
    const mid=FRH(`2${SUP(a)} · 3${SUP(2*b)}`,`2${SUP(c+3*d)} · 3${SUP(c)}`);
    return {a,b,c,d,u,v,P,good:P(u,v),h,exp:`Đưa về cơ số 2 và 3: 9${SUP(b)} = 3${SUP(2*b)}, 6${SUP(c)} = 2${SUP(c)} · 3${SUP(c)}, 8${SUP(d)} = 2${SUP(3*d)}. Biểu thức bằng ${mid} = ${SH(P(u,v))}.`};}
}
function genVdFrac(){return tryGen(()=>{const D=fracData(),{a,b,c,d,u,v,P,good}=D;
  return mk(`Rút gọn biểu thức ${E(D.h)}.`,show(good),[
    Wq(good,P(u,b-c),`9${SUP(b)} = (3${SUP(2)})${SUP(b)} = 3${SUP(2*b)}, không phải 3${SUP(b)}.`),
    Wq(good,P(a-c-d,v),`8${SUP(d)} = (2${SUP(3)})${SUP(d)} = 2${SUP(3*d)}, không phải 2${SUP(d)}.`),
    Wq(good,P(a-3*d,v),`6${SUP(c)} = 2${SUP(c)} · 3${SUP(c)}: bạn quên thừa số 2${SUP(c)} ở mẫu.`),
    Wq(good,qinv(good),'Bạn đã viết ngược tử số và mẫu số của kết quả.'),
    Wq(good,P(u+1,v),'Bạn tính sai số mũ của 2.')],D.exp);
});}
const saVdFrac=()=>{const D=fracData();return saF(`Rút gọn biểu thức ${E(D.h)}. Nhập dạng phân số tối giản hoặc số nguyên.`,D.good,D.exp);};
/* --- so sánh hai luỹ thừa có cơ số nhỏ hơn 1 --- */
function cmpQData(){
  if(RNG()<.55){let [a,p,b,q]=sel(CMP_VD);const k=ri(4,20);if(RNG()<.5)[a,p,b,q]=[b,q,a,p];
    const u=Math.pow(a,p),v=Math.pow(b,q),A=PW([1,a],p*k),B=PW([1,b],q*k),sym=u<v?'>':'<';
    return {A,B,sym,exp:`Đưa về cùng số mũ ${k}: ${A} = ${PW([1,u],k)} và ${B} = ${PW([1,v],k)}. Vì ${fr(1,u)} ${sym} ${fr(1,v)} (cùng tử, mẫu nhỏ hơn thì lớn hơn) nên ${A} ${sym} ${B}.`,hint:`Hãy đưa về cùng số mũ ${k} rồi so sánh hai cơ số ${fr(1,u)} và ${fr(1,v)}.`};}
  for(;;){const t=sel([2,3]),[i,j]=sample(2,2,5),m=ri(3,12),n=ri(3,12),e1=i*m,e2=j*n;if(e1===e2)continue;
    const A=PW([1,Math.pow(t,i)],m),B=PW([1,Math.pow(t,j)],n),sym=e1<e2?'>':'<';
    return {A,B,sym,exp:`Đưa về cùng cơ số ${fr(1,t)}: ${A} = ${PW([1,t],e1)} và ${B} = ${PW([1,t],e2)}. Cơ số ${fr(1,t)} nhỏ hơn 1 nên số mũ càng lớn thì luỹ thừa càng nhỏ. Vì ${e1} ${e1<e2?'<':'>'} ${e2} nên ${A} ${sym} ${B}.`,hint:`Hãy đưa về cùng cơ số ${fr(1,t)}. Cơ số nhỏ hơn 1 thì số mũ càng lớn, luỹ thừa càng nhỏ.`};}
}
function genVdCmpQ(){return tryGen(()=>{const d=cmpQData(),txt=s=>`${d.A} ${s} ${d.B}`,op=d.sym==='<'?'>':'<';
  return {stem:`So sánh ${E(d.A)} và ${E(d.B)}.`,opts:[{t:txt(d.sym)},{t:txt(op),err:d.hint},{t:txt('='),err:'Hai luỹ thừa này không bằng nhau. '+d.hint},{t:'Không so sánh được',err:d.hint}],ans:0,exp:d.exp};
});}
/* --- đúng sai tổng hợp --- */
function tLtAdv(){
  const cmp=()=>{const d=cmpQData(),claim=sel(['<','>']);return IT(`${d.A} ${claim} ${d.B}`,claim===d.sym,'lt','VD',d.exp);};
  const sq=()=>{const r=Rq(ri(1,4),ri(2,5)),odd=RNG()<.5,rr=odd&&RNG()<.5?negQ(r):r,V=pw(rr,odd?3:2);
    return odd?IT(`Nếu x${SUP(3)} = ${SH(V)} thì x = ${SH(rr)}`,true,'dn','VD',`${SH(V)} = ${PW(rr,3)} và số mũ lẻ nên chỉ có x = ${SH(rr)}.`)
      :IT(`Nếu x${SUP(2)} = ${SH(V)} thì chỉ có x = ${SH(r)}`,false,'dn','VD',`Còn x = ${SH(negQ(r))} nữa, vì ${PW(negQ(r),2)} = ${SH(V)}.`);};
  const ex=()=>{const d=findExpData(),lie=RNG()<.5,n=lie?d.n+sel([-1,1]):d.n;return IT(`Nếu ${d.h} thì x = ${n}`,!lie,'nc','VD',d.exp);};
  const items=mixed(()=>[cmp(),cmp(),sq(),ex()]);
  return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();
}
['a','b'].forEach(x=>{
  addMC('g_ncfindxq_'+x,'nc','TH',genNcFindXq);addMC('g_dnfindexp_'+x,'dn','TH',genDnFindExp);addMC('g_vdexpeq_'+x,'nc','VD',genVdExpEq);
  addMC('g_vdpow3_'+x,'dn','VD',genVdPow3);addMC('g_vdpow2_'+x,'dn','VD',genVdPow2);addMC('g_vdfrac_'+x,'tt','VD',genVdFrac);addMC('g_vdcmpq_'+x,'lt','VD',genVdCmpQ);
});
addTF('tf_lt_vd2','lt','VD',tLtAdv);
// Thử thách: tổng hai luỹ thừa cùng cơ số có số mũ chứa x
HARD.sa.push({id:'h_expsum',type:'sa',topic:'nc',level:'VD',unit:'',gen:()=>{const a=sel([2,3,5]),x0=ri(1,4),plus=RNG()<.5,V=plus?Math.pow(a,x0)*(a+1):Math.pow(a,x0)*(a*a-1);
  return {stem:`Tìm số tự nhiên x, biết ${E(plus?`${X1(a,'x + 1')} + ${X1(a,'x')} = ${V}`:`${X1(a,'x + 2')} − ${X1(a,'x')} = ${V}`)}.`,ans:[x0],exp:plus?`${X1(a,'x + 1')} + ${X1(a,'x')} = ${X1(a,'x')} · (${a} + 1) = ${a+1} · ${X1(a,'x')}. Do đó ${X1(a,'x')} = ${V} : ${a+1} = ${Math.pow(a,x0)} = ${X1(a,x0)}, vậy x = ${x0}.`:`${X1(a,'x + 2')} − ${X1(a,'x')} = ${X1(a,'x')} · (${X1(a,2)} − 1) = ${a*a-1} · ${X1(a,'x')}. Do đó ${X1(a,'x')} = ${V} : ${a*a-1} = ${Math.pow(a,x0)} = ${X1(a,x0)}, vậy x = ${x0}.`};}});

const BANK={mc:MC,tf:TF,sa:SA_BUILD()};
function SA_BUILD(){
  const S=[];const add=(id,topic,level,gen,unit)=>['a','b'].forEach(x=>S.push({id:id+x,type:'sa',topic,level,unit:unit||'',gen}));
  add('s_dnval','dn','NB',saDnVal);add('s_dnrep','dn','NB',saDnRep);add('s_dnfr','dn','TH',saDnFr);add('s_dnexp','dn','TH',saDnExp);add('s_dnexpr','dn','TH',saDnExpr);
  add('s_ttprod','tt','NB',saTtProd);add('s_ttmul','tt','TH',saTtMul);add('s_ttdiv','tt','TH',saTtDiv);add('s_ttcombo','tt','TH',saTtCombo);add('s_ttdec','tt','VD',saTtDec);
  add('s_ncmul','nc','NB',saNcMul);add('s_ncdiv','nc','NB',saNcDiv);add('s_ncval','nc','TH',saNcVal);add('s_nceval','nc','TH',saNcEval);
  add('s_vdgrow','dn','VD',saVdGrow);add('s_vdten','tt','VD',saVdTen);add('s_vdquot','tt','VD',saVdQuot);add('s_vdfindn','nc','VD',saVdFindN);add('s_vdfindn2','lt','VD',saVdFindN2);
  add('s_ncfindxq','nc','TH',saNcFindXq);add('s_dnfindexp','dn','TH',saDnFindExp);add('s_vdexpeq','nc','VD',saVdExpEq);add('s_vdpow3','dn','VD',saVdPow3);add('s_vdfrac','tt','VD',saVdFrac);
  add('s_ltexp','lt','NB',saLtExp);add('s_ltval','lt','TH',saLtVal);add('s_ltbase','lt','VD',saLtBase);add('s_ltmix','lt','VD',saLtMix);
  return S;
}
const SA=BANK.sa;
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Nội dung, mức độ, ôn nhanh ============ */
const TOPICS={
  dn:{short:'Luỹ thừa số mũ tự nhiên',name:'Luỹ thừa với số mũ tự nhiên',rule:`Luỹ thừa bậc n của số hữu tỉ x, kí hiệu ${X1('x','n')}, là tích của n thừa số x (n là số tự nhiên lớn hơn 1): ${X1('x','n')} = x · x · … · x. ${X1('x','n')} đọc là x mũ n, x luỹ thừa n hoặc luỹ thừa bậc n của x; x gọi là cơ số, n gọi là số mũ. Quy ước: ${X1('x',0)} = 1 (x ≠ 0); ${X1('x',1)} = x.`,tip:`Cơ số âm hoặc phân số phải đặt trong ngoặc: ${PW([-2,1],4)} = 16 còn −${X1(2,4)} = −16. Luỹ thừa bậc chẵn của số âm là số dương, bậc lẻ của số âm là số âm.`},
  tt:{short:'Luỹ thừa của tích, thương',name:'Luỹ thừa của một tích, một thương',rule:`Luỹ thừa của một tích bằng tích các luỹ thừa: (x · y)${SUP('n')} = ${X1('x','n')} · ${X1('y','n')}. Luỹ thừa của một thương bằng thương các luỹ thừa: (x : y)${SUP('n')} = ${X1('x','n')} : ${X1('y','n')} (y ≠ 0). Hai công thức này giúp tính nhanh, chẳng hạn ${PW([2,3],10)} · ${X1(3,10)} = ${X1(2,10)}.`,tip:`Phải luỹ thừa cả hai thừa số (cả số bị chia và số chia), không chỉ một thừa số. Không có quy tắc tương tự cho tổng: (x + y)${SUP('n')} khác ${X1('x','n')} + ${X1('y','n')}.`},
  nc:{short:'Nhân, chia cùng cơ số',name:'Nhân và chia hai luỹ thừa cùng cơ số',rule:`Khi nhân hai luỹ thừa cùng cơ số, ta giữ nguyên cơ số và cộng hai số mũ: ${X1('x','m')} · ${X1('x','n')} = ${X1('x','m + n')}. Khi chia hai luỹ thừa cùng cơ số khác 0, ta giữ nguyên cơ số và lấy số mũ của luỹ thừa bị chia trừ số mũ của luỹ thừa chia: ${X1('x','m')} : ${X1('x','n')} = ${X1('x','m − n')} (x ≠ 0, m ≥ n).`,tip:'Chỉ áp dụng khi hai luỹ thừa có cùng cơ số: giữ nguyên cơ số, cộng (hoặc trừ) số mũ. Không nhân hai cơ số với nhau và không nhân số mũ.'},
  lt:{short:'Luỹ thừa của luỹ thừa',name:'Luỹ thừa của luỹ thừa',rule:`Khi tính luỹ thừa của một luỹ thừa, ta giữ nguyên cơ số và nhân hai số mũ: (${X1('x','m')})${SUP('n')} = ${X1('x','m · n')}.`,tip:`Phải nhân hai số mũ, không cộng. (${X1('x','m')})${SUP('n')} khác ${X1('x','m')} · ${X1('x','n')} (tích này có số mũ là m + n).`}
};
const TKEYS=['dn','tt','nc','lt'];
const TDESC={dn:'Cơ số, số mũ, tính luỹ thừa, dấu của luỹ thừa, quy ước x⁰ và x¹',tt:'Luỹ thừa của một tích, của một thương, tính một cách hợp lí',nc:'Nhân và chia hai luỹ thừa cùng cơ số, viết dưới dạng luỹ thừa',lt:'Luỹ thừa của luỹ thừa, đổi cơ số rồi viết dưới dạng luỹ thừa'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhớ định nghĩa luỹ thừa, cơ số, số mũ, các công thức nhân, chia luỹ thừa cùng cơ số, luỹ thừa của luỹ thừa, tính luỹ thừa đơn giản.',TH:'Tính luỹ thừa của số âm, phân số, số thập phân; áp dụng công thức luỹ thừa của tích, thương; nhân, chia luỹ thừa cùng cơ số.',VD:'Tính biểu thức nhiều luỹ thừa, tính một cách hợp lí, so sánh luỹ thừa, tìm số mũ, bài toán thực tế.'};
const RECAP=[
  {k:'dn',fig:`<div class="figbox"><p>${X1('x','n')} = x · x · … · x (n thừa số), n &gt; 1</p><p>${X1('x',0)} = 1 (x ≠ 0); ${X1('x',1)} = x</p><p>${PW([-2,1],3)} = −8; ${PW([-2,1],4)} = 16; ${PW([1,3],4)} = ${fr(1,81)}</p></div>`,extra:`Ví dụ: ${PW([-3,1],3)} = (−3) · (−3) · (−3) = −27 và ${PW([1,3],4)} = ${fr(1,3)} · ${fr(1,3)} · ${fr(1,3)} · ${fr(1,3)} = ${fr(1,81)}.`},
  {k:'tt',fig:`<div class="figbox"><p>(x · y)${SUP('n')} = ${X1('x','n')} · ${X1('y','n')}</p><p>(x : y)${SUP('n')} = ${X1('x','n')} : ${X1('y','n')} (y ≠ 0)</p><p>${PW([2,3],10)} · ${X1(3,10)} = (${fr(2,3)} · 3)${SUP(10)} = ${X1(2,10)}</p></div>`,extra:`Ví dụ: (−125)${SUP(3)} : ${X1(25,3)} = (−125 : 25)${SUP(3)} = ${PW([-5,1],3)} = −125.`},
  {k:'nc',fig:`<div class="figbox"><p>${X1('x','m')} · ${X1('x','n')} = ${X1('x','m + n')}</p><p>${X1('x','m')} : ${X1('x','n')} = ${X1('x','m − n')} (x ≠ 0, m ≥ n)</p><p>${PW([-2,1],3)} · ${PW([-2,1],4)} = ${PW([-2,1],7)}</p></div>`,extra:`Ví dụ: ${PW([5,2],7)} : ${PW([5,2],3)} = ${PW([5,2],4)}, và ${PW([-5,1],5)} : ${PW([-5,1],5)} = ${PW([-5,1],0)} = 1.`},
  {k:'lt',fig:`<div class="figbox"><p>(${X1('x','m')})${SUP('n')} = ${X1('x','m · n')}</p><p>${BR(PW([-5,1],3))}${SUP(7)} = ${PW([-5,1],21)}</p><p>${PW([1,4],8)} = ${BR(PW([1,2],2))}${SUP(8)} = ${PW([1,2],16)}</p></div>`,extra:`Ví dụ: ${PW([1,8],3)} = ${BR(PW([1,2],3))}${SUP(3)} = ${PW([1,2],9)}. Muốn đổi cơ số, hãy viết cơ số cũ dưới dạng luỹ thừa của cơ số mới.`}
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
 G(()=>{const d=sel([0.1,0.05,0.08,0.2]),m=sel([3,4]),n=ri(5,8),k=ri(2,4),thick=rd(d*Math.pow(2,n),4);
  const pw=(b,e)=>`${b}<sup>${e}</sup>`;
  return {title:'Gấp đôi tờ giấy',ctx:P(`Một tờ giấy dày ${nm(d)} mm. Mỗi lần gấp đôi tờ giấy thì số lớp giấy tăng lên gấp đôi (lúc đầu có 1 lớp).`),qs:[
   A(`Sau ${m} lần gấp, tờ giấy có bao nhiêu lớp?`,Math.pow(2,m),'lớp',`Sau ${m} lần gấp có ${Array(m).fill(2).join(' · ')} = ${pw(2,m)} = ${Math.pow(2,m)} lớp.`,'dn','TH'),
   M(`Số lớp giấy sau ${n} lần gấp là`,pw(2,n),[[`2 · ${n}`,'Mỗi lần gấp, số lớp được nhân 2, không phải cộng thêm 2. Phải nhân 2 với chính nó nhiều lần.'],[pw(n,2),'Cơ số và số mũ bị đổi chỗ: cơ số là 2, số mũ là số lần gấp.'],[pw(2,n-1),`Lúc đầu có 1 lớp, sau ${n} lần gấp số lớp được nhân 2 đúng ${n} lần.`]],`Sau ${n} lần gấp có ${pw(2,n)} = ${Math.pow(2,n)} lớp giấy.`,'dn','TH'),
   A(`Sau ${n} lần gấp, xấp giấy dày bao nhiêu mi-li-mét?`,thick,'mm',`Có ${pw(2,n)} = ${Math.pow(2,n)} lớp, mỗi lớp dày ${nm(d)} mm. Độ dày: ${Math.pow(2,n)} · ${nm(d)} = ${nm(thick)} (mm).`,'dn','VD'),
   A(`Sau ${n} lần gấp, nếu gấp đôi thêm ${k} lần nữa thì số lớp giấy gấp bao nhiêu lần so với lúc vừa gấp xong ${n} lần?`,Math.pow(2,k),'lần',`${pw(2,n+k)} : ${pw(2,n)} = ${pw(2,k)} = ${Math.pow(2,k)}.`,'nc','VD')]};}),
 G(()=>{const half=RNG()<.5,r=half?[1,2]:[3,4],h=half?sel([8,16,24,32,40]):sel([64,128,256]),n=ri(4,6);
  const hk=j=>h*Math.pow(r[0],j)/Math.pow(r[1],j),X=sel([1,2,3,5,10,20,30].filter(x=>x<hk(2)&&x>hk(5)));if(!X)throw 0;
  let first=1;while(hk(first)>=X)first++;if([1,2,3,4,5,6,7,8].some(j=>Math.abs(hk(j)-X)<1e-9))throw 0;
  const rr=Fh(r[0],r[1]),pw=(b,e)=>`(${b})<sup>${e}</sup>`,h3=rd(hk(3),4);
  return {title:'Quả bóng nảy',ctx:P(`Thả một quả bóng từ độ cao ${h} m. Mỗi lần chạm đất, quả bóng nảy lên đến độ cao bằng ${rr} độ cao của lần rơi ngay trước đó.`),qs:[
   A('Sau lần chạm đất thứ nhất, quả bóng nảy lên cao bao nhiêu mét?',hk(1),'m',`${h} · ${rr} = ${nm(hk(1))} (m).`,'dn','TH'),
   M(`Độ cao (mét) quả bóng nảy lên sau lần chạm đất thứ ${n} là`,`${h} · ${pw(rr,n)}`,[[`${h} · ${rr} · ${n}`,`Mỗi lần nảy, độ cao được nhân với ${rr}, nên phải dùng luỹ thừa, không nhân với ${n}.`],[pw(`${h} · ${rr}`,n),`Chỉ có ${rr} được nhân ${n} lần, độ cao ban đầu ${h} m chỉ nhân một lần.`],[`${h} · ${pw(rr,n-1)}`,`Sau lần chạm đất thứ ${n}, độ cao đã được nhân với ${rr} đúng ${n} lần.`]],`Sau mỗi lần chạm đất độ cao nhân thêm ${rr}, nên sau lần thứ ${n} là ${h} · ${pw(rr,n)}.`,'tt','TH'),
   A('Sau lần chạm đất thứ ba, quả bóng nảy lên cao bao nhiêu mét?',h3,'m',`${h} · ${pw(rr,3)} = ${h} · ${Fh(Math.pow(r[0],3),Math.pow(r[1],3))} = ${nm(h3)} (m).`,'dn','VD'),
   A(`Lần chạm đất thứ mấy là lần đầu tiên quả bóng nảy lên thấp hơn ${X} m?`,first,'',`Độ cao sau các lần chạm đất: ${Array.from({length:first},(_,j)=>nm(hk(j+1))+' m').join('; ')}. Lần thứ ${first} là lần đầu tiên thấp hơn ${X} m.`,'dn','VD')]};})
);
}
/* ==== Toán thực tế bổ sung: kết thúc ==== */
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='lt7_seen';
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
  const mcSlots=[['dn',['NB','TH']],['dn',['TH','VD']],['tt',['NB','TH','VD']],['nc',['NB','TH','VD']],['lt',['NB','TH']],['lt',['TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>q.topic===t&&l.includes(q.level)),used));
  const tf=['dn',sel(['tt','nc']),'lt'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set(),t1=sel(['dn','tt']),t2=sel(['nc','lt']);
  const mc=TKEYS.map(t=>pick(MC.filter(q=>q.topic===t&&q.level!=='VD'),used));
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
