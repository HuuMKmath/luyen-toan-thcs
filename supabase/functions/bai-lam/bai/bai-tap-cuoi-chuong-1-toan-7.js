// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ bai-tap-cuoi-chuong-1-toan-7/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "bai-tap-cuoi-chuong-1-toan-7";
export const TIEN_TO = "CC7-";

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
const BR=h=>`[${h}]`;                                                                // ngoặc vuông cho luỹ thừa của luỹ thừa
const okq=q=>q&&Math.abs(q[0])<=4e14&&q[1]<=4e14;
const Wt=(good,v,t,err)=>(!okq(v)||eqQ(v,good))?null:C(t,err);                        // lựa chọn sai dạng luỹ thừa (so theo giá trị)
const bi=()=>[sgn()*ri(2,5),1];                                                      // cơ số nguyên
const bf=()=>{for(;;){const d=ri(2,5),q=Rq(sgn()*ri(1,5),d);if(q[1]>1)return q;}};  // cơ số phân số
const bq=()=>RNG()<.5?bi():bf();
const prodStr=(q,n,dec)=>Array(n).fill(PA(q,disp2(q,dec))).join(' · ');
const magOK=q=>Math.abs(q[0])<=1e6&&q[1]<=1e6;
const FB_MC=()=>({stem:`Kết quả của phép tính ${E(fr(1,2)+' + '+fr(1,3))} là:`,opts:[{t:fr(5,6)},{t:fr(2,5),err:'Không được cộng tử với tử và mẫu với mẫu.'},{t:fr(1,6),err:'Đó là tích của hai phân số, không phải tổng.'},{t:fr(1,5),err:'Phải quy đồng mẫu số trước khi cộng.'}],ans:0,exp:`${fr(1,2)} + ${fr(1,3)} = ${fr(3,6)} + ${fr(2,6)} = ${fr(5,6)}.`});

const BASES_LT=[[1,2],[1,3],[2,3],[3,2],[1,4],[3,4],[2,5],[1,5]];
function genDnVal(){return tryGen(()=>{
  const a=sgn()*ri(2,6),n=ri(2,4),A=[a,1],good=pw(A,n);
  return mk(`Tính ${E(PW(A,n))}.`,show(good),[
    Wq(good,[a*n,1],'Luỹ thừa bậc n là tích của n thừa số bằng cơ số, không phải cơ số nhân số mũ.'),
    Wq(good,negQ(good),a<0?'Luỹ thừa bậc chẵn của số âm là số dương, bậc lẻ của số âm là số âm; bạn đã đảo dấu.':'Luỹ thừa của một số dương luôn là số dương.'),
    Wq(good,pw(A,n-1),'Bạn nhân thiếu một thừa số: cần đủ n thừa số.'),
    Wq(good,pw(A,n+1),'Bạn nhân thừa một thừa số.')],
    `${PW(A,n)} = ${prodStr(A,n)} = ${SH(good)}.`);
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
function genTtMul(){return tryGen(()=>{
  const q=ri(2,5),p=sgn()*ri(1,5);if(gcd(p,q)!==1)return null;const n=ri(2,5),Pq=[p,q],good=[Math.pow(p,n),1];if(!magOK(good))return null;
  return mk(`Tính ${E(`${PW(Pq,n)} · ${PW([q,1],n)}`)}.`,show(good),[
    Wq(good,qm(pw(Pq,n),[q,1]),'Bạn chỉ nhân với '+q+', phải nhân với '+q+SUP(n)+'.'),
    Wq(good,pw(Pq,n),'Bạn chưa nhân với '+q+SUP(n)+'.'),
    Wq(good,[p*n,1],'Luỹ thừa bậc n không phải là nhân với n.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `${PW(Pq,n)} · ${PW([q,1],n)} = (${SH(Pq)} · ${q})${SUP(n)} = ${PW([p,1],n)} = ${SH(good)}.`);
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

function genLtVal(){return tryGen(()=>{
  const a=sgn()*ri(2,3),m=ri(2,3),n=ri(2,3),A=[a,1],good=pw(A,m*n);
  return mk(`Tính ${E(BR(PW(A,m))+SUP(n))}.`,show(good),[
    Wq(good,pw(A,m+n),'Khi tính luỹ thừa của một luỹ thừa, ta nhân hai số mũ, không cộng.'),
    Wq(good,pw(A,Math.pow(m,n)),'Bạn đã lấy luỹ thừa của số mũ.'),
    Wq(good,pw(A,m),'Bạn bỏ quên số mũ ngoài.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `${BR(PW(A,m))}${SUP(n)} = ${PW(A,m*n)} = ${SH(good)}.`);
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

const O=(t,err)=>err?{t,err}:{t};
const X1=(b,s)=>`${b}${SUP(s)}`;
const MC3=[
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
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
function pick4(Ts,Fs){const nT=ri(1,3);return shuffle(shuffle(Ts).slice(0,nT).concat(shuffle(Fs).slice(0,4-nT)));}
function mixed(make){
  for(let n=0;n<120;n++){const items=make();if(items.some(i=>!i))continue;const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}
  return null;
}
const four=f=>()=>{const items=mixed(()=>[f(),f(),f(),f()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};
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
function itVD3(){
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

const S1=(t,topic,exp)=>({t,topic,exp});
const saF=(stem,g,exp,at)=>({stem,ans:[g[0]/g[1]],at:at===undefined?SH(g):at,exp});
function saDnVal(){const a=sgn()*ri(2,6),n=ri(2,4),A=[a,1],g=pw(A,n);return {stem:`Tính ${E(PW(A,n))}.`,ans:[g[0]],exp:`${PW(A,n)} = ${prodStr(A,n)} = ${N(g[0])}.`};}
function saNcDiv(){const a=sgn()*ri(2,5),A=[a,1],n=ri(2,5),m=ri(n+1,n+6);return {stem:`Viết ${E(`${PW(A,m)} : ${PW(A,n)}`)} dưới dạng ${PW(A,'k')}. Tìm k.`,ans:[m-n],exp:`${PW(A,m)} : ${PW(A,n)} = ${PW(A,m-n)} nên k = ${m-n}.`};}
function saDnFr(){for(;;){const dec=RNG()<.3,q=dec?rdec():rfr(),n=dec?ri(2,3):ri(2,4),g=pw(q,n);if(!magOK(g))continue;return saF(`Tính ${E(PW(q,n,dec))}. Nhập dạng phân số tối giản hoặc số nguyên.`,g,`${PW(q,n,dec)} = ${prodStr(q,n,dec)} = ${SH(g)}.`);}}
function saLtVal(){const a=sgn()*ri(2,3),A=[a,1],m=ri(2,3),n=ri(2,3),g=pw(A,m*n);return {stem:`Tính ${E(BR(PW(A,m))+SUP(n))}.`,ans:[g[0]],exp:`${BR(PW(A,m))}${SUP(n)} = ${PW(A,m*n)} = ${N(g[0])}.`};}
function saNcEval(){const a=sgn()*ri(2,3),A=[a,1],m=ri(2,5),n=ri(2,5),p=ri(2,m+n-2),g=pw(A,m+n-p);return {stem:`Tính ${E(`${PW(A,m)} · ${PW(A,n)} : ${PW(A,p)}`)}.`,ans:[g[0]],exp:`${PW(A,m)} · ${PW(A,n)} : ${PW(A,p)} = ${PW(A,m+n-p)} = ${N(g[0])}.`};}
function saLtMix(){for(;;){const a=sgn()*ri(2,3),A=[a,1],m=ri(2,3),n=ri(2,3),k=ri(2,4),div=RNG()<.4,e=div?m*n-k:m*n+k;if(e<1)continue;const g=pw(A,e);if(Math.abs(g[0])>1e6)continue;
  return {stem:`Tính ${E(`${BR(PW(A,m))}${SUP(n)} ${div?':':'·'} ${PW(A,k)}`)}.`,ans:[g[0]],exp:`${BR(PW(A,m))}${SUP(n)} = ${PW(A,m*n)}; ${PW(A,m*n)} ${div?':':'·'} ${PW(A,k)} = ${PW(A,e)} = ${N(g[0])}.`};}}

function saLtBase(){for(;;){const r=sel(BASES_LT),k=ri(2,3),n=ri(2,5);if(k*n>12)continue;return {stem:`Viết ${E(PW(pw(r,k),n))} dưới dạng ${PW(r,'k')}. Tìm k.`,ans:[k*n],exp:`${SH(pw(r,k))} = ${PW(r,k)} nên ${PW(pw(r,k),n)} = ${BR(PW(r,k))}${SUP(n)} = ${PW(r,k*n)}, suy ra k = ${k*n}.`};}}

const sg1=o=>o==='+'?1:-1, flip=o=>o==='+'?'−':'+', sq=(q,f)=>f>0?q:negQ(q), opq=(o,a,b)=>o==='+'?qa(a,b):qs(a,b);
function genCtSame(){return tryGen(()=>{
  const d=ri(3,12),a=ri(1,2*d)*sgn(),b=ri(1,2*d)*sgn(),A=Rq(a,d),B=Rq(b,d);if(A[1]===1&&B[1]===1)return null;
  const good=qa(A,B);
  return mk(`Tính ${E(X([{q:A,h:fr(a,d)},{q:B,h:fr(b,d)}],['+']))}.`,show(good),[
    Wq(good,[a+b,2*d],'Cộng hai phân số cùng mẫu thì giữ nguyên mẫu, không cộng hai mẫu.'),
    Wq(good,[a-b,d],'Bạn đã trừ hai tử số thay vì cộng.'),
    Wq(good,[a*b,d],'Bạn đã nhân hai tử số thay vì cộng.'),
    Wq(good,[-(a+b),d],'Sai dấu của kết quả.')],
    `${fr(a,d)} + ${PA(B,fr(b,d))} = ${fr(a+b,d)} = ${SH(good)}.`);
});}
function genCtDiff(){return tryGen(()=>{
  const [A,B]=rdiff(),L=lcmQ(A,B),good=qa(A,B);
  return mk(`Tính ${E(X([I(A),I(B)],['+']))}.`,show(good),[
    Wq(good,[A[0]+B[0],A[1]+B[1]],'Không được cộng tử với tử và mẫu với mẫu. Phải quy đồng mẫu số trước.'),
    Wq(good,[A[0]+B[0],L],'Bạn quy đồng mẫu nhưng chưa đổi tử số tương ứng.'),
    Wq(good,qs(A,B),'Bạn đã trừ thay vì cộng.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `Quy đồng mẫu số ${L}: ${QD(A,B)}. Do đó tổng bằng ${fr(A[0]*L/A[1]+B[0]*L/B[1],L)} = ${SH(good)}.`);
});}
function genCtSub(){return tryGen(()=>{
  const [A,B]=rdiff(),L=lcmQ(A,B),good=qs(A,B);
  return mk(`Tính ${E(X([I(A),I(B)],['−']))}.`,show(good),[
    Wq(good,qs(B,A),'Bạn đã lấy số trừ trừ đi số bị trừ (ngược thứ tự).'),
    Wq(good,qa(A,B),'Bạn đã cộng thay vì trừ.'),
    Wq(good,[A[0]-B[0],A[1]-B[1]],'Không được trừ tử với tử và mẫu với mẫu. Phải quy đồng mẫu số trước.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `Quy đồng mẫu số ${L}: ${QD(A,B)}. Hiệu bằng ${fr(A[0]*L/A[1]-B[0]*L/B[1],L)} = ${SH(good)}.`);
});}
function genCtThree(){return tryGen(()=>{
  const A=rnz(),B=rnz(),Cc=rnz(),o1=sel(['+','−']),o2=sel(['+','−']);
  const f=(s1,s2)=>qa(qa(A,s1===1?B:negQ(B)),s2===1?Cc:negQ(Cc));
  const s1=o1==='+'?1:-1,s2=o2==='+'?1:-1,good=f(s1,s2);if(good[1]>80)return null;
  return mk(`Tính ${E(X([I(A),I(B),I(Cc)],[o1,o2]))}.`,show(good),[
    Wq(good,f(-s1,s2),`Bạn đã đổi phép tính thứ nhất (${o1}).`),Wq(good,f(s1,-s2),`Bạn đã đổi phép tính thứ hai (${o2}).`),Wq(good,f(-s1,-s2),'Bạn đã đổi cả hai phép tính.'),Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `Tính từ trái sang phải: ${SH(A)} ${o1} ${PA(B,SH(B))} = ${SH(qa(A,s1===1?B:negQ(B)))}; rồi ${o2} ${PA(Cc,SH(Cc))} = ${SH(good)}.`);
});}
function genNhFr(){return tryGen(()=>{
  const A=rfr(),B=rfr(),good=qm(A,B);
  return mk(`Tính ${E(X([I(A),I(B)],['·']))}.`,show(good),[
    Wq(good,[A[0]*B[0],A[1]+B[1]],'Nhân hai phân số: nhân tử với tử và nhân mẫu với mẫu, không cộng mẫu.'),
    Wq(good,qa(A,B),'Bạn đã cộng thay vì nhân.'),
    Wq(good,qd(A,B),'Bạn đã chia thay vì nhân (đảo ngược phân số thứ hai).'),
    Wq(good,negQ(good),'Sai dấu của tích: hai số cùng dấu thì tích dương, khác dấu thì tích âm.')],
    `${PA(A,SH(A))} · ${PA(B,SH(B))} = ${fr(A[0]*B[0],A[1]*B[1])} = ${SH(good)}.`);
});}
function genNhSign(){return tryGen(()=>{
  const n=3,zero=RNG()<.2,vals=[];
  for(let i=0;i<n;i++)vals.push(rnz());
  if(zero)vals[ri(0,n-1)]=[0,1];
  const P=vals.reduce((a,b)=>qm(a,b),[1,1]),neg=vals.filter(q=>q[0]<0).length,s=zero?'bằng 0':P[0]<0?'âm':'dương';
  const lab={'dương':'dương','âm':'âm','bằng 0':'bằng 0','chưa xác định':'chưa xác định được dấu'};
  const errs={'dương':`Có ${neg} thừa số âm: số thừa số âm chẵn thì tích dương.`,'âm':`Có ${neg} thừa số âm: số thừa số âm lẻ thì tích âm.`,'bằng 0':'Chỉ khi một thừa số bằng 0 thì tích mới bằng 0.','chưa xác định':'Biết dấu của từng thừa số thì xác định được dấu của tích.'};
  const exp2=zero?'Có một thừa số bằng 0 nên tích bằng 0.':`Có ${neg} thừa số âm. ${neg%2?'Số thừa số âm lẻ nên tích âm.':'Số thừa số âm chẵn nên tích dương.'}`;
  return mk(`Không cần tính, hãy cho biết tích ${E(X(vals.map(q=>I(q)),['·','·']))} là số nào dưới đây?`,'Số '+lab[s],Object.keys(lab).filter(k=>k!==s).map(k=>C((k==='bằng 0'?'Số ':'Số ')+lab[k],errs[k])),exp2);
});}
function genNhThree(){return tryGen(()=>{
  const A=rnz(),B=rnz(),Cc=rnz(),good=qm(qm(A,B),Cc);if(good[1]>200||Math.abs(good[0])>400)return null;
  return mk(`Tính ${E(X([I(A),I(B),I(Cc)],['·','·']))}.`,show(good),[
    Wq(good,qm(A,B),'Bạn quên nhân với thừa số thứ ba.'),
    Wq(good,negQ(good),'Sai dấu của tích.'),
    Wq(good,qa(qa(A,B),Cc),'Bạn đã cộng thay vì nhân.'),
    Wq(good,qm(qm(A,B),qinv(Cc)),'Bạn đã chia cho thừa số thứ ba thay vì nhân.')],
    `${PA(A,SH(A))} · ${PA(B,SH(B))} = ${SH(qm(A,B))}; rồi · ${PA(Cc,SH(Cc))} = ${SH(good)}.`);
});}
function genChInv(){return tryGen(()=>{
  const A=RNG()<.35?[sgn()*ri(2,9),1]:rfr();if(Math.abs(A[0])===A[1])return null;
  const good=qinv(A);
  return mk(`Nghịch đảo của số hữu tỉ ${E(SH(A))} là:`,show(good),[
    Wq(good,negQ(A),'Đó là số đối, không phải nghịch đảo.'),
    Wq(good,A,'Đó là chính số đã cho. Nghịch đảo là số nhân với nó được 1.'),
    Wq(good,negQ(good),'Nghịch đảo của một số khác 0 cùng dấu với số đó.')],
    `${SH(A)} · ${SH(good)} = 1 nên nghịch đảo của ${SH(A)} là ${SH(good)}.`);
});}
function genChDiv(){return tryGen(()=>{
  const A=rfr(),B=rfr(),good=qd(A,B);if(good[1]>80||Math.abs(good[0])>80)return null;
  return mk(`Tính ${E(X([I(A),I(B)],[':']))}.`,show(good),[
    Wq(good,qm(A,B),'Chia cho một phân số là nhân với nghịch đảo của nó; bạn đã nhân thẳng.'),
    Wq(good,qd(B,A),'Bạn đã chia ngược thứ tự (số chia chia cho số bị chia).'),
    Wq(good,negQ(good),'Sai dấu của thương.'),
    Wq(good,[A[0]*B[0],A[1]*B[1]+1],'Bạn thực hiện sai khi nhân với nghịch đảo.')],
    `${PA(A,SH(A))} : ${PA(B,SH(B))} = ${PA(A,SH(A))} · ${PA(qinv(B),SH(qinv(B)))} = ${SH(good)}.`);
});}
function genChChain(){return tryGen(()=>{
  const A=rnz(),B=rnz(),Cc=rnz(),good=qm(qd(A,B),Cc);if(good[1]>100||Math.abs(good[0])>200)return null;
  return mk(`Tính ${E(X([I(A),I(B),I(Cc)],[':','·']))}.`,show(good),[
    Wq(good,qd(A,qm(B,Cc)),'Phép chia và phép nhân cùng cấp: thực hiện từ trái sang phải, không nhân trước.'),
    Wq(good,qm(qm(A,B),Cc),'Bạn đã nhân thay vì chia ở phép tính đầu.'),
    Wq(good,qd(qd(A,B),Cc),'Bạn đã chia thay vì nhân ở phép tính sau.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `Làm từ trái sang phải: ${PA(A,SH(A))} : ${PA(B,SH(B))} = ${SH(qd(A,B))}; rồi · ${PA(Cc,SH(Cc))} = ${SH(good)}.`);
});}
function genChFind(){return tryGen(()=>{
  const A=rnz(),B=rnz(),good=qd(B,A);
  return mk(`Tìm x biết ${E('x · '+PA(A,SH(A))+' = '+SH(B))}.`,show(good),[
    Wq(good,qm(B,A),'Muốn tìm thừa số chưa biết, ta chia tích cho thừa số đã biết, không nhân.'),
    Wq(good,qd(A,B),'Bạn đã chia ngược thứ tự (thừa số chia cho tích).'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `x · ${PA(A,SH(A))} = ${SH(B)} nên x = ${SH(B)} : ${PA(A,SH(A))} = ${SH(good)}.`);
});}
function br1(){ // A − (B ± C)
  const A=rnz(),B=rnz(),Cc=rnz(),o=sel(['+','−']),f=sg1(o),good=qs(A,qa(B,sq(Cc,f)));
  const val=(a,b)=>qa(A,qa(sq(B,a),sq(Cc,b)));
  return {e:`${SH(A)} − (${SH(B)} ${o} ${PA(Cc,SH(Cc))})`,good,
    wr:[[val(-1,f),'Trước ngoặc có dấu "−" nên khi bỏ ngoặc phải đổi dấu tất cả các số hạng trong ngoặc; bạn đã giữ nguyên dấu số hạng cuối.'],
        [val(1,-f),'Trước ngoặc có dấu "−" nên phải đổi dấu cả số hạng đầu tiên trong ngoặc, bạn chưa đổi.'],
        [val(1,f),'Bạn đã bỏ ngoặc mà không đổi dấu số hạng nào; trước ngoặc là dấu "−" nên phải đổi dấu tất cả.'],
        [negQ(good),'Sai dấu của kết quả.']],
    exp:`Bỏ dấu ngoặc có dấu "−" đằng trước, ta đổi dấu các số hạng trong ngoặc: ${SH(A)} − (${SH(B)} ${o} ${PA(Cc,SH(Cc))}) = ${SH(A)} − ${PA(B,SH(B))} ${flip(o)} ${PA(Cc,SH(Cc))} = ${SH(good)}.`};
}
function br2(){ // A ± (B ± C)
  const A=rnz(),B=rnz(),Cc=rnz(),s=sel(['+','−']),o=sel(['+','−']),f=sg1(o),e1=sg1(s),good=qa(A,sq(qa(B,sq(Cc,f)),e1));
  const val=(a,b)=>qa(A,qa(sq(B,a),sq(Cc,b))),ok=[e1,e1*f],wr=[];
  [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(p=>{if(p[0]===ok[0]&&p[1]===ok[1])return;
    wr.push([val(p[0],p[1]),s==='+'?'Trước ngoặc có dấu "+" nên khi bỏ ngoặc ta giữ nguyên dấu các số hạng trong ngoặc.':'Trước ngoặc có dấu "−" nên khi bỏ ngoặc ta đổi dấu tất cả các số hạng trong ngoặc.']);});
  const rule=s==='+'?'Bỏ dấu ngoặc có dấu "+" đằng trước, giữ nguyên dấu các số hạng trong ngoặc':'Bỏ dấu ngoặc có dấu "−" đằng trước, đổi dấu các số hạng trong ngoặc';
  const o2=s==='+'?o:flip(o);
  return {e:`${SH(A)} ${s} (${SH(B)} ${o} ${PA(Cc,SH(Cc))})`,good,wr,
    exp:`${rule}: ${SH(A)} ${s} (${SH(B)} ${o} ${PA(Cc,SH(Cc))}) = ${SH(A)} ${s} ${PA(B,SH(B))} ${o2} ${PA(Cc,SH(Cc))} = ${SH(good)}.`};
}
function br3(){ // A ± [B ± (C ± D)]
  const A=rnz(),B=rnz(),Cc=rnz(),D=rnz(),s1=sel(['+','−']),o=sel(['+','−']),p=sel(['+','−']);
  if(s1==='+'&&o==='+')return null;
  const f1=sg1(s1),fo=sg1(o),fp=sg1(p),inner=qa(B,sq(qa(Cc,sq(D,fp)),fo)),good=qa(A,sq(inner,f1));
  const straight=qa(qa(qa(A,sq(B,f1)),sq(Cc,fo)),sq(D,fp));                         // bỏ cả hai ngoặc mà không đổi dấu
  const roundOnly=qa(qa(qa(A,sq(B,f1)),sq(Cc,f1*fo)),sq(D,f1*fo*fp));                // bỏ ngoặc tròn đúng, ngoặc vuông không đổi dấu
  const squareOnly=qa(A,sq(qa(qa(B,sq(Cc,fo)),sq(D,fp)),f1));                        // bỏ ngoặc vuông đúng, ngoặc tròn không đổi dấu
  const o2=o==='+'?p:flip(p),exp3=`${SH(B)} ${o} (${SH(Cc)} ${p} ${PA(D,SH(D))}) = ${SH(B)} ${o} ${PA(Cc,SH(Cc))} ${o2} ${PA(D,SH(D))} = ${SH(inner)}`;
  return {e:`${SH(A)} ${s1} [${SH(B)} ${o} (${SH(Cc)} ${p} ${PA(D,SH(D))})]`,good,
    wr:[[straight,'Bạn đã bỏ cả hai lớp ngoặc mà không đổi dấu. Phải bỏ ngoặc từ trong ra ngoài và đổi dấu khi trước ngoặc có dấu "−".'],
        [roundOnly,'Bạn bỏ ngoặc tròn đúng nhưng khi bỏ ngoặc vuông chưa đổi dấu các số hạng trong ngoặc (trước ngoặc vuông là dấu "−").'],
        [squareOnly,'Bạn bỏ ngoặc vuông đúng nhưng ngoặc tròn có dấu "−" đứng trước mà chưa đổi dấu các số hạng trong ngoặc tròn.'],
        [negQ(good),'Sai dấu của kết quả.']],
    exp:`Bỏ ngoặc tròn trước: ${exp3}. Rồi bỏ ngoặc vuông: ${SH(A)} ${s1} ${PA(inner,SH(inner))} = ${SH(good)}.`};
}
const genBr=f=>()=>tryGen(()=>{const r=f();if(!r)return null;return mk(`Tính ${E(r.e)}.`,show(r.good),r.wr.map(w=>Wq(r.good,w[0],w[1])),r.exp);});
const genTcBr1=genBr(br1),genTcBr2=genBr(br2),genTcBr3=genBr(br3);
function genTcHop(){return tryGen(()=>{
  const A=rfr(),B=rfr();if(eqQ(A,B)||eqQ(A,negQ(B)))return null;
  const order=sel([0,1,2]),terms=[{q:A,h:SH(A)},{q:B,h:SH(B)},{q:negQ(A),h:SH(negQ(A))}];
  const lst=[[0,1,2],[0,2,1],[1,0,2]][order].map(i=>terms[i]),good=B;
  return mk(`Tính một cách hợp lí ${E(X(lst,['+','+']))}.`,show(good),[
    Wq(good,A,'Bạn đã bỏ nhầm số hạng B thay vì cặp số đối A và −A.'),
    Wq(good,qa(A,B),'Hai số đối nhau cộng lại bằng 0, nên chỉ còn lại B.'),
    Wq(good,qa(B,qm([2,1],A)),'Bạn đã cộng hai lần A thay vì triệt tiêu A và −A.'),
    Wq(good,negQ(B),'Sai dấu của kết quả.')],
    `Nhóm hai số đối nhau: ${SH(A)} + ${PA(negQ(A),SH(negQ(A)))} = 0 nên tổng bằng ${SH(B)}.`);
});}
function genTcDist(){return tryGen(()=>{
  const A=rfr(),k=sgn()*ri(1,3),B=rfr(),Cc=qs([k,1],B),good=qm(A,[k,1]);if(Cc[1]===1||Cc[0]===0)return null;
  const ab=qm(A,B),ac=qm(A,Cc);
  return mk(`Tính một cách hợp lí ${E(X([{q:ab,h:`${PA(A,SH(A))} · ${PA(B,SH(B))}`,n:1},{q:ac,h:`${PA(A,SH(A))} · ${PA(Cc,SH(Cc))}`,n:1}],['+']).replace(/^\((.*?)\) ·/,'$1 ·'))}.`,show(good),[
    Wq(good,qm(A,qm(B,Cc)),'Đặt A làm thừa số chung được A·(B + C), không phải A·(B·C).'),
    Wq(good,qa(ab,Cc),'Bạn chỉ nhân A với B rồi cộng C.'),
    Wq(good,qa(A,qa(B,Cc)),'Bạn đã cộng A vào thay vì nhân A với (B + C).'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `Đặt thừa số chung: ${SH(A)} · [${SH(B)} + ${PA(Cc,SH(Cc))}] = ${SH(A)} · ${N(k)} = ${SH(good)}.`);
});}

function itCt(){
  const t=ri(0,5),[A,B]=rdiff(),L=lcmQ(A,B);
  switch(t){
    case 0:{const g=qa(A,B);return eqItem(X([I(A),I(B)],['+']),g,[[A[0]+B[0],A[1]+B[1]],[A[0]+B[0],L],qs(A,B)],'ct','TH',`Quy đồng mẫu ${L}: ${QD(A,B)}. Tổng bằng ${SH(g)}.`);}
    case 1:{const g=qs(A,B);return eqItem(X([I(A),I(B)],['−']),g,[[A[0]-B[0],A[1]-B[1]],qs(B,A),qa(A,B)],'ct','TH',`Quy đồng mẫu ${L}: ${QD(A,B)}. Hiệu bằng ${SH(g)}.`);}
    case 2:{const ok=RNG()<.5;return IT(`${X([I(A),I(B)],['−'])} = ${ok?X([I(A),I(negQ(B))],['+']):X([I(A),I(B)],['+'])}`,ok,'ct','TH',ok?'Trừ một số bằng cộng với số đối của nó.':'Trừ một số bằng cộng với số đối của nó, không phải cộng với chính nó.');}
    case 3:{const ok=RNG()<.5;return IT(`${X([I(A),I(B)],['+'])} = ${ok?X([I(B),I(A)],['+']):X([I(B),I(A)],['−'])}`,ok,'ct','TH',ok?'Phép cộng có tính chất giao hoán.':'Phép trừ không có tính chất giao hoán: B − A là số đối của A − B.');}
    case 4:{const g=qa(A,negQ(B)),ok=RNG()<.5;return IT(`${X([I(A),I(negQ(B))],['+'])} ${ok===(val(g)>0)?'>':'<'} 0`,ok,'ct','TH',`${SH(A)} + ${PA(negQ(B),SH(negQ(B)))} = ${SH(g)}, là số ${SGN2(g)}.`);}
    default:{const Z=rfr(),ok=RNG()<.5;return IT(`${X([I(Z),I(negQ(Z))],['+'])} = ${ok?'0':SH(Z)}`,ok,'ct','TH',ok?'Hai số đối nhau có tổng bằng 0.':'Hai số đối nhau có tổng bằng 0, không bằng số đã cho.');}
  }
}
function itNh(){
  const t=ri(0,4),A=rfr(),B=rfr(),g=qm(A,B);
  switch(t){
    case 0:return eqItem(X([I(A),I(B)],['·']),g,[[A[0]*B[0],A[1]+B[1]],qa(A,B),negQ(g)],'nh','TH',`${PA(A,SH(A))} · ${PA(B,SH(B))} = ${SH(g)}.`);
    case 1:{const ok=RNG()<.5;return IT(`${X([I(A),I(B)],['·'])} ${ok===(val(g)>0)?'>':'<'} 0`,ok,'nh','TH',`Hai thừa số ${(A[0]>0)===(B[0]>0)?'cùng dấu':'khác dấu'} nên tích là số ${SGN2(g)}.`);}
    case 2:{const ok=RNG()<.5;return IT(`${X([I(A),I(B)],['·'])} = ${ok?X([I(B),I(A)],['·']):X([I(B),I(A)],[':'])}`,ok,'nh','TH',ok?'Phép nhân có tính chất giao hoán.':'Phép chia không có tính chất giao hoán.');}
    case 3:{const k=ri(2,6)*sgn(),ok=RNG()<.5,w=ok?qm([k,1],A):qa([k,1],A);if(!ok&&eqQ(w,qm([k,1],A)))return null;return IT(`${X([{q:[k,1],h:N(k)},I(A)],['·'])} = ${SH(w)}`,ok,'nh','TH',`${N(k)} · ${PA(A,SH(A))} = ${SH(qm([k,1],A))}.`);}
    default:{const ok=RNG()<.5;return IT(`${X([I(A),{q:[1,1],h:'1'}],['·'])} = ${ok?SH(A):SH(negQ(A))}`,ok,'nh','TH',ok?'Nhân với 1 không làm thay đổi số.':'Nhân với 1 cho lại chính số đó, không phải số đối.');}
  }
}
function itCh(){
  const t=ri(0,4),A=rfr(),B=rfr(),g=qd(A,B);
  switch(t){
    case 0:return eqItem(X([I(A),I(B)],[':']),g,[qm(A,B),qd(B,A),negQ(g)],'ch','TH',`${PA(A,SH(A))} : ${PA(B,SH(B))} = ${PA(A,SH(A))} · ${PA(qinv(B),SH(qinv(B)))} = ${SH(g)}.`);
    case 1:{const ok=RNG()<.5,w=ok?qinv(A):negQ(A);return IT(`Nghịch đảo của ${SH(A)} là ${SH(w)}`,ok,'ch','TH',ok?`${SH(A)} · ${SH(qinv(A))} = 1.`:`Nghịch đảo của ${SH(A)} là ${SH(qinv(A))}; ${SH(negQ(A))} là số đối của nó.`);}
    case 2:{const ok=RNG()<.5;return IT(`${X([I(A),I(B)],[':'])} ${ok===(val(g)>0)?'>':'<'} 0`,ok,'ch','TH',`Hai số ${(A[0]>0)===(B[0]>0)?'cùng dấu':'khác dấu'} nên thương là số ${SGN2(g)}.`);}
    case 3:{const ok=RNG()<.5,k=ri(2,6)*sgn(),w=ok?qd(A,[k,1]):qm(A,[k,1]);return IT(`${X([I(A),{q:[k,1],h:N(k)}],[':'])} = ${SH(w)}`,ok,'ch','TH',`${PA(A,SH(A))} : ${PA([k,1],N(k))} = ${SH(qd(A,[k,1]))}.`);}
    default:{const ok=RNG()<.5;return IT(`${X([I(A),I(B)],[':'])} = ${ok?X([I(A),I(qinv(B))],['·']):X([I(A),I(B)],['·'])}`,ok,'ch','TH',ok?'Chia cho một số bằng nhân với nghịch đảo của số đó.':'Chia cho một số bằng nhân với nghịch đảo của số đó, không phải nhân với chính số đó.');}
  }
}
function itTc(){
  const t=ri(0,4),A=rnz(),B=rnz(),Cc=rnz();
  switch(t){
    case 0:{const o=sel(['+','−']),f=sg1(o),g=qs(A,qa(B,sq(Cc,f))),ok=RNG()<.5,w=ok?g:sel([qa(A,qa(B,sq(Cc,f))),qa(A,qa(negQ(B),sq(Cc,f))),qs(A,qa(B,sq(Cc,-f)))]);if(!ok&&eqQ(w,g))return null;return IT(`${SH(A)} − (${SH(B)} ${o} ${PA(Cc,SH(Cc))}) = ${SH(w)}`,ok,'tc','TH',`Bỏ ngoặc có dấu "−" đằng trước, đổi dấu các số hạng trong ngoặc: ${SH(A)} − ${PA(B,SH(B))} ${flip(o)} ${PA(Cc,SH(Cc))} = ${SH(g)}.`);}
    case 1:{const o=sel(['+','−']),f=sg1(o),g=qa(A,qa(B,sq(Cc,f))),ok=RNG()<.5,w=ok?g:sel([qs(A,qa(B,sq(Cc,f))),qa(A,qa(B,sq(Cc,-f))),qa(A,qa(negQ(B),sq(Cc,f)))]);if(!ok&&eqQ(w,g))return null;return IT(`${SH(A)} + (${SH(B)} ${o} ${PA(Cc,SH(Cc))}) = ${SH(w)}`,ok,'tc','TH',`Bỏ ngoặc có dấu "+" đằng trước, giữ nguyên dấu các số hạng trong ngoặc: ${SH(A)} + ${PA(B,SH(B))} ${o} ${PA(Cc,SH(Cc))} = ${SH(g)}.`);}
    case 2:{const ok=RNG()<.5;if(!ok&&eqQ(qm(A,qa(B,Cc)),qa(qm(A,B),Cc)))return null;return IT(`${PA(A,SH(A))} · (${X([I(B),I(Cc)],['+'])}) = ${ok?X([{q:qm(A,B),h:`${PA(A,SH(A))} · ${PA(B,SH(B))}`,n:1},{q:qm(A,Cc),h:`${PA(A,SH(A))} · ${PA(Cc,SH(Cc))}`,n:1}],['+']):`${PA(A,SH(A))} · ${PA(B,SH(B))} + ${PA(Cc,SH(Cc))}`}`.replace(/^\((.*?)\) ·/,'$1 ·'),ok,'tc','TH',ok?'Tính chất phân phối của phép nhân đối với phép cộng.':'Phải nhân A với cả hai số hạng B và C trong ngoặc.');}
    case 3:{const g=qm(A,qa(B,Cc)),ok=RNG()<.5,w=ok?g:qa(qm(A,B),Cc);if(!ok&&eqQ(w,g))return null;return IT(`${PA(A,SH(A))} · (${X([I(B),I(Cc)],['+'])}) = ${SH(w)}`.replace(/^\((.*?)\) ·/,'$1 ·'),ok,'tc','TH',`${PA(A,SH(A))} · ${SH(qa(B,Cc))} = ${SH(g)}.`);}
    default:{const ok=RNG()<.5,sum=qa(A,B);return IT(`${X([I(A),I(B),I(negQ(A))],['+','+'])} = ${SH(ok?B:sum)}`,ok,'tc','TH',`${SH(A)} và ${PA(negQ(A),SH(negQ(A)))} là hai số đối nhau nên tổng bằng ${SH(B)}.`);}
  }
}
function itVD2(){
  const t=ri(0,3),A=rnz(),B=rnz(),Cc=rnz();
  switch(t){
    case 0:{const g=qa(A,qm(B,Cc)),ok=RNG()<.5,w=ok?g:qm(qa(A,B),Cc);if(!ok&&eqQ(w,g))return null;return IT(`${X([I(A),I(B),I(Cc)],['+','·'])} = ${SH(w)}`,ok,'ct','VD',`Nhân trước, cộng sau: ${SH(A)} + ${PA(B,SH(B))} · ${PA(Cc,SH(Cc))} = ${SH(A)} + ${PA(qm(B,Cc),SH(qm(B,Cc)))} = ${SH(g)}.`);}
    case 1:{const g=qm(qd(A,B),Cc),ok=RNG()<.5,w=ok?g:qd(A,qm(B,Cc));if(!ok&&eqQ(w,g))return null;return IT(`${X([I(A),I(B),I(Cc)],[':','·'])} = ${SH(w)}`,ok,'ch','VD',`Chia và nhân cùng cấp, làm từ trái sang phải: ${SH(A)} : ${PA(B,SH(B))} = ${SH(qd(A,B))}; rồi · ${PA(Cc,SH(Cc))} = ${SH(g)}.`);}
    case 2:{const g=qs(A,qm(B,Cc)),ok=RNG()<.5,w=ok?g:qm(qs(A,B),Cc);if(!ok&&eqQ(w,g))return null;return IT(`${X([I(A),I(B),I(Cc)],['−','·'])} = ${SH(w)}`,ok,'nh','VD',`Nhân trước, trừ sau: ${SH(A)} − ${PA(qm(B,Cc),SH(qm(B,Cc)))} = ${SH(g)}.`);}
    default:{const g=qm(qa(A,B),Cc),ok=RNG()<.5,w=ok?g:qa(A,qm(B,Cc));if(!ok&&eqQ(w,g))return null;return IT(`(${X([I(A),I(B)],['+'])}) · ${PA(Cc,SH(Cc))} = ${SH(w)}`,ok,'tc','VD',`Tính trong ngoặc trước: ${SH(qa(A,B))} · ${PA(Cc,SH(Cc))} = ${SH(g)}.`);}
  }
}
function saCtAdd(){for(;;){const [A,B]=rdiff(),g=qa(A,B);if(g[1]>90)continue;
  return {stem:`Tính ${E(X([I(A),I(B)],['+']))}. Nhập kết quả dạng phân số tối giản hoặc số nguyên.`,ans:[g[0]/g[1]],at:SH(g),exp:`Quy đồng mẫu số ${lcmQ(A,B)}: ${QD(A,B)}. Kết quả ${SH(g)}.`};}}
function saCtDec(){for(;;){const A=rdec(),B=rdec(),op=sel(['+','−']),g=op==='+'?qa(A,B):qs(A,B);if(!canDec(g)&&g[1]!==1)continue;
  return {stem:`Tính ${E(X([I(A,true),I(B,true)],[op]))}. Nhập kết quả dưới dạng số thập phân (dùng dấu phẩy).`,ans:[g[0]/g[1]],at:DEC(g),exp:`${DEC(A)} ${op} ${PA(B,DEC(B))} = ${DEC(g)}.`};}}
function saCtThree(){for(;;){const A=rnz(),B=rnz(),Cc=rnz(),o1=sel(['+','−']),o2=sel(['+','−']),g=qa(qa(A,o1==='+'?B:negQ(B)),o2==='+'?Cc:negQ(Cc));if(g[1]>90||g[1]===1)continue;
  return {stem:`Tính ${E(X([I(A),I(B),I(Cc)],[o1,o2]))}. Nhập kết quả dạng phân số tối giản.`,ans:[g[0]/g[1]],at:SH(g),exp:`Làm từ trái sang phải: ${SH(qa(A,o1==='+'?B:negQ(B)))} ${o2} ${PA(Cc,SH(Cc))} = ${SH(g)}.`};}}
function saNhFr(){for(;;){const A=rfr(),B=rfr(),g=qm(A,B);
  return {stem:`Tính ${E(X([I(A),I(B)],['·']))}. Nhập kết quả dạng phân số tối giản hoặc số nguyên.`,ans:[g[0]/g[1]],at:SH(g),exp:`${PA(A,SH(A))} · ${PA(B,SH(B))} = ${fr(A[0]*B[0],A[1]*B[1])} = ${SH(g)}.`};}}
function saChFr(){for(;;){const A=rfr(),B=rfr(),g=qd(A,B);if(g[1]>90||Math.abs(g[0])>90)continue;
  return {stem:`Tính ${E(X([I(A),I(B)],[':']))}. Nhập kết quả dạng phân số tối giản hoặc số nguyên.`,ans:[g[0]/g[1]],at:SH(g),exp:`${PA(A,SH(A))} : ${PA(B,SH(B))} = ${PA(A,SH(A))} · ${PA(qinv(B),SH(qinv(B)))} = ${SH(g)}.`};}}
function saChChain(){for(;;){const A=rnz(),B=rnz(),Cc=rnz(),g=qm(qd(A,B),Cc);if(g[1]>90||Math.abs(g[0])>200)continue;
  return {stem:`Tính ${E(X([I(A),I(B),I(Cc)],[':','·']))}. Nhập kết quả dạng phân số tối giản hoặc số nguyên.`,ans:[g[0]/g[1]],at:SH(g),exp:`Từ trái sang phải: ${SH(qd(A,B))}; rồi · ${PA(Cc,SH(Cc))} = ${SH(g)}.`};}}
const saBr=f=>()=>{for(;;){const r=f();if(!r)continue;const g=r.good;if(g[1]>90||Math.abs(g[0])>100)continue;
  return {stem:`Tính ${E(r.e)}. Nhập dạng phân số tối giản hoặc số nguyên.`,ans:[g[0]/g[1]],at:SH(g),exp:r.exp};}};
const saTcBr1=saBr(br1),saTcBr2=saBr(br2),saTcBr3=saBr(br3);
function saTcDist(){for(;;){const A=rfr(),k=sgn()*ri(1,3),B=rfr(),Cc=qs([k,1],B),R=qm(A,[k,1]);if(Cc[1]===1||Cc[0]===0||R[1]>60)continue;const f=qm(A,B),g=qm(A,Cc);
  return {stem:`Tính một cách hợp lí ${E(X([{q:f,h:`${PA(A,SH(A))} · ${PA(B,SH(B))}`,n:1},{q:g,h:`${PA(A,SH(A))} · ${PA(Cc,SH(Cc))}`,n:1}],['+']).replace(/^\((.*?)\) ·/,'$1 ·'))}. Nhập dạng phân số tối giản hoặc số nguyên.`,ans:[R[0]/R[1]],at:SH(R),exp:`Đặt thừa số chung: ${SH(A)} · [${SH(B)} + ${PA(Cc,SH(Cc))}] = ${SH(A)} · ${N(k)} = ${SH(R)}.`};}}


/* ============ Nội dung 1: số hữu tỉ, số đối, so sánh (khoá ss) ============ */
const rQ=()=>RNG()<.2?[sgn()*ri(1,5),1]:rfr();
function genSsOpp(){return tryGen(()=>{
  const dec=RNG()<.3,q=dec?rdec():rfr(),good=negQ(q);
  return mk(`Số đối của ${E(show(q,dec))} là:`,show(good,dec),[
    Wq(good,q,'Số đối của x là −x: phải đổi dấu, bạn đã giữ nguyên số.',dec),
    Wq(good,qinv(q),'Đó là số nghịch đảo, không phải số đối. Số đối chỉ đổi dấu.',dec),
    Wq(good,negQ(qinv(q)),'Số đối chỉ đổi dấu, không đảo tử và mẫu.',dec),
    Wq(good,qm(q,[2,1]),'Số đối có cùng độ lớn với số đã cho, chỉ khác dấu.',dec)],
    `Số đối của ${show(q,dec)} là ${PA(good,show(good,dec))}: hai số đối nhau có tổng bằng 0.`);
});}
function genSsQ(){return tryGen(()=>{
  const n=ri(1,9)*sgn(),bad=fr(n,0),bq=rfr();
  return mk('Cách viết nào sau đây không là số hữu tỉ?',bad,[
    C(SH(bq),'Phân số có mẫu khác 0 là số hữu tỉ.'),
    C(N(sgn()*ri(1,9)),'Số nguyên là số hữu tỉ vì viết được dưới dạng phân số có mẫu 1.'),
    C(DEC(rdec()),'Số thập phân hữu hạn là số hữu tỉ vì viết được dưới dạng phân số.'),
    C(fr(ri(1,9),-ri(2,9)),'Phân số có mẫu âm vẫn là số hữu tỉ vì mẫu khác 0.')],
    `Số hữu tỉ viết được dưới dạng ${fr('a','b')} với a, b là số nguyên, b ≠ 0. ${bad} có mẫu bằng 0 nên không có nghĩa.`);
});}
function genSsNeg(){return tryGen(()=>{
  const a=ri(1,9),b=ri(2,9),k=ri(1,3),good=RNG()<.5?fr(-a*k,b*k):fr(a*k,-b*k);
  return mk('Số nào sau đây là số hữu tỉ âm?',good,[
    C(fr(-a*k,-b*k),'Tử và mẫu cùng âm nên số này dương.'),
    C(fr(a*k,b*k),'Tử và mẫu cùng dương nên số này dương.'),
    C(DEC(Rq(ri(1,59),sel([2,4,5,10]))),'Đây là số thập phân dương.'),
    C(N(ri(1,9)),'Đây là số nguyên dương.')],
    `Hai số khác dấu viết thành phân số thì phân số là số âm. ${good} có tử và mẫu khác dấu nên là số hữu tỉ âm.`);
});}
function genSsTrue(){return tryGen(()=>{
  const prs=[];for(let i=0;i<4;i++){const [A,B]=rdiff();prs.push(cmpQ(A,B)<0?[A,B]:[B,A]);}   // mỗi cặp: [nhỏ, lớn]
  const up=RNG()<.5,s=(p,ok)=>ok?(up?`${SH(p[0])} < ${SH(p[1])}`:`${SH(p[1])} > ${SH(p[0])}`):(up?`${SH(p[1])} < ${SH(p[0])}`:`${SH(p[0])} > ${SH(p[1])}`);
  const good=s(prs[0],true);
  return mk('Khẳng định nào sau đây đúng?',good,prs.slice(1).map(p=>C(s(p,false),`Quy đồng mẫu số: ${QD(p[0],p[1])}. Vậy ${SH(p[0])} < ${SH(p[1])}, khẳng định này sai.`)),
    `Quy đồng mẫu số: ${QD(prs[0][0],prs[0][1])}. Vậy ${SH(prs[0][0])} < ${SH(prs[0][1])}, nên ${good}.`);
});}
function genSsMax(){return tryGen(()=>{
  const vs=[];for(let i=0;i<4;i++)vs.push(rQ());if(new Set(vs.map(v=>v[0]+'/'+v[1])).size<4)return null;
  const big=RNG()<.55;let m=0;vs.forEach((v,i)=>{if(big?cmpQ(v,vs[m])>0:cmpQ(v,vs[m])<0)m=i;});
  return mk(`Trong các số sau, số nào ${big?'lớn':'nhỏ'} nhất?`,SH(vs[m]),vs.filter((v,i)=>i!==m).map(v=>C(SH(v),`Quy đồng mẫu số rồi so sánh: số này ${big?'nhỏ':'lớn'} hơn ${SH(vs[m])}.`)),
    `Số dương lớn hơn số âm; so sánh các số cùng dấu bằng cách quy đồng mẫu số. Số ${big?'lớn':'nhỏ'} nhất là ${SH(vs[m])}.`);
});}
function genSsBetween(){return tryGen(()=>{
  const [A0,B0]=rdiff(),lo=cmpQ(A0,B0)<0?A0:B0,hi=lo===A0?B0:A0,g=qd(qa(lo,hi),[2,1]),gap=qs(hi,lo);if(g[1]>40)return null;
  return mk(`Số hữu tỉ nào nằm giữa ${E(SH(lo))} và ${E(SH(hi))}?`,SH(g),[
    Wq(g,qs(lo,gap),'Số này nhỏ hơn cả hai số đã cho, không nằm giữa.'),
    Wq(g,qa(hi,gap),'Số này lớn hơn cả hai số đã cho, không nằm giữa.'),
    Wq(g,lo,'Số này trùng với một đầu mút, không nằm giữa hai số.'),
    Wq(g,hi,'Số này trùng với một đầu mút, không nằm giữa hai số.')],
    `Trung điểm của hai số là (${SH(lo)} + ${PA(hi,SH(hi))}) : 2 = ${SH(g)}, nằm giữa ${SH(lo)} và ${SH(hi)}.`);
});}
function saSsOpp(){const q=rfr(),g=negQ(q);return {stem:`Tìm số đối của ${SH(q)}. Nhập dạng phân số tối giản hoặc số nguyên.`,ans:[g[0]/g[1]],at:SH(g),exp:`Số đối của ${SH(q)} là ${SH(g)}.`};}
function saSsEq(){for(;;){const b=ri(2,7),a=sgn()*ri(1,9);if(gcd(a,b)!==1)continue;const k=ri(2,6),c=b*k,x=a*k;
  return {stem:`Tìm số nguyên x, biết ${E(`${fr(a,b)} = ${fr('x',c)}`)}.`,ans:[x],exp:`${fr(a,b)} = ${fr(a*k,b*k)} = ${fr(x,c)} nên x = ${N(x)}.`};}}
function saSsInt(){for(;;){const A=Rq(-ri(5,40),ri(2,8)),B=Rq(ri(5,40),ri(2,8));if(A[1]===1||B[1]===1)continue;let n=0;for(let x=-40;x<=40;x++)if(cmpQ(A,[x,1])<0&&cmpQ([x,1],B)<0)n++;
  return {stem:`Có bao nhiêu số nguyên x thoả mãn ${E(`${SH(A)} < x < ${SH(B)}`)}?`,ans:[n],exp:`${SH(A)} nằm giữa ${floorQ(A)} và ${floorQ(A)+1}; ${SH(B)} nằm giữa ${floorQ(B)} và ${floorQ(B)+1}. Các số nguyên x là ${floorQ(A)+1}, …, ${floorQ(B)}: có ${n} số.`};}}

/* ============ Nội dung 4: tìm x, quy tắc chuyển vế (khoá tc) ============ */
const FX=t=>{ // một dạng phương trình bậc nhất một bước: {e: biểu thức, good: nghiệm, wr: [[giá trị sai, lỗi]], exp}
  const A=rnz(),B=rnz();
  if(t===0){const g=qs(B,A);return {e:`x + ${PA(A,SH(A))} = ${SH(B)}`,good:g,wr:[[qa(B,A),'Chuyển vế phải đổi dấu: x = B − A, bạn đã cộng.'],[qs(A,B),'Bạn lấy A − B, phải lấy B − A.'],[negQ(g),'Sai dấu của kết quả.'],[qm(B,A),'Phải trừ A ở hai vế, không nhân.']],exp:`x + ${PA(A,SH(A))} = ${SH(B)} nên x = ${SH(B)} − ${PA(A,SH(A))} = ${SH(g)}.`};}
  if(t===1){const g=qa(B,A);return {e:`x − ${PA(A,SH(A))} = ${SH(B)}`,good:g,wr:[[qs(B,A),'Chuyển số hạng −A sang vế phải thì thành +A, bạn đã trừ.'],[qs(A,B),'Bạn lấy A − B, phải lấy B + A.'],[negQ(g),'Sai dấu của kết quả.'],[qm(B,A),'Phải cộng A vào hai vế, không nhân.']],exp:`x − ${PA(A,SH(A))} = ${SH(B)} nên x = ${SH(B)} + ${PA(A,SH(A))} = ${SH(g)}.`};}
  const g=qs(A,B);return {e:`${SH(A)} − x = ${SH(B)}`,good:g,wr:[[qs(B,A),'Bạn lấy B − A, phải lấy A − B (x là số trừ).'],[qa(A,B),'Chuyển x sang vế phải và B sang vế trái: x = A − B, bạn đã cộng.'],[qa(negQ(A),B),'Bạn đổi dấu A nhưng quên rằng x = A − B.'],[negQ(g),'Sai dấu của kết quả.']],exp:`${SH(A)} − x = ${SH(B)} nên x = ${SH(A)} − ${PA(B,SH(B))} = ${SH(g)}.`};
};
function genTcFind(){return tryGen(()=>{const r=FX(ri(0,2));if(r.good[1]>60||Math.abs(r.good[0])>200)return null;return mk(`Tìm x, biết ${E(r.e)}.`,show(r.good),r.wr.map(w=>Wq(r.good,w[0],w[1])),r.exp);});}
function saTcFind(){for(;;){const r=FX(ri(0,2)),g=r.good;if(g[1]>60||Math.abs(g[0])>200)continue;return {stem:`Tìm x, biết ${E(r.e)}. Nhập dạng phân số tối giản hoặc số nguyên.`,ans:[g[0]/g[1]],at:SH(g),exp:r.exp};}}
/* hai bước: A · x ± B = C */
function FX2(){let A=rnz();while(A[1]===1&&Math.abs(A[0])===1)A=rnz();const B0=rfr(),B=[Math.abs(B0[0]),B0[1]],C=rnz(),o=sel(['+','−']),rhs=o==='+'?qs(C,B):qa(C,B),good=qd(rhs,A);
  const sgnB=o==='+'?'trừ':'cộng';
  return {e:`${SH(A)} · x ${o} ${SH(B)} = ${SH(C)}`,good,wr:[
    [qd(o==='+'?qa(C,B):qs(C,B),A),`Chuyển vế phải đổi dấu: chuyển ${o} ${SH(B)} sang vế phải thì thành ${o==='+'?'−':'+'} ${SH(B)}.`],
    [rhs,'Sau khi chuyển vế còn phải chia cho hệ số của x.'],
    [qm(rhs,A),'Muốn tìm x phải chia cho hệ số của x, không nhân.'],
    [negQ(good),'Sai dấu của kết quả.']],
  exp:`${SH(A)} · x = ${SH(C)} ${o==='+'?'−':'+'} ${SH(B)} = ${SH(rhs)}; x = ${SH(rhs)} : ${PA(A,SH(A))} = ${SH(good)}.`};}
function genTcFind2(){return tryGen(()=>{const r=FX2();if(r.good[1]>60||Math.abs(r.good[0])>200)return null;return mk(`Tìm x, biết ${E(r.e)}.`,show(r.good),r.wr.map(w=>Wq(r.good,w[0],w[1])),r.exp);});}
function saTcFind2(){for(;;){const r=FX2(),g=r.good;if(g[1]>60||Math.abs(g[0])>200)continue;return {stem:`Tìm x, biết ${E(r.e)}. Nhập dạng phân số tối giản hoặc số nguyên.`,ans:[g[0]/g[1]],at:SH(g),exp:r.exp};}}
/* tính hợp lí: nhóm các số hạng (a + b) + (c − b) ... */
function genTcGroup(){return tryGen(()=>{
  const A=rfr(),B=rfr(),Cc=rfr();if(eqQ(A,B)||eqQ(A,negQ(B)))return null;
  const good=qa(A,Cc);
  return mk(`Tính một cách hợp lí ${E(X([I(A),I(B),I(Cc),I(negQ(B))],['+','+','+']))}.`,show(good),[
    Wq(good,qa(qa(A,Cc),qm(B,[2,1])),'Bạn đã cộng hai lần B thay vì nhóm B với số đối của nó.'),
    Wq(good,Cc,'Bạn bỏ sót số hạng đầu tiên.'),
    Wq(good,A,'Bạn bỏ sót một số hạng.'),
    Wq(good,negQ(good),'Sai dấu của kết quả.')],
    `Nhóm hai số đối nhau: ${SH(B)} + ${PA(negQ(B),SH(negQ(B)))} = 0, nên tổng bằng ${SH(A)} + ${PA(Cc,SH(Cc))} = ${SH(good)}.`);
});}

/* ============ Đúng sai: các ý theo từng nội dung ============ */
const TM={ct:'pt',nh:'pt',ch:'pt',tc:'tc',dn:'lt',tt:'lt',nc:'lt',lt:'lt',ss:'ss'};
const asT=f=>()=>{const r=f();if(r)r.topic=TM[r.topic]||r.topic;return r;};
function itSs(){
  const t=ri(0,4),[A,B]=rdiff();
  switch(t){
    case 0:{const r=sel(['<','>']),ok=(r==='<')===(cmpQ(A,B)<0);return IT(`${SH(A)} ${r} ${SH(B)}`,ok,'ss','TH',`Quy đồng mẫu số: ${QD(A,B)}. Vậy ${SH(A)} ${cmpQ(A,B)<0?'<':'>'} ${SH(B)}.`);}
    case 1:{const ok=RNG()<.5,w=ok?negQ(A):sel([A,qinv(A)]);return IT(`Số đối của ${SH(A)} là ${SH(w)}`,ok,'ss','TH',`Số đối của ${SH(A)} là ${SH(negQ(A))}; ${SH(qinv(A))} là số nghịch đảo.`);}
    case 2:{const ok=RNG()<.5,k=ri(2,5),w=ok?fr(A[0]*k,A[1]*k):fr(A[0]+k,A[1]+k);return IT(`${SH(A)} = ${w}`,ok,'ss','TH',ok?`Nhân cả tử và mẫu với ${k} thì được phân số bằng ${SH(A)}.`:`Cộng cùng một số vào tử và mẫu thì giá trị thay đổi. Phải nhân (hoặc chia) cả tử và mẫu với cùng một số khác 0.`);}
    case 3:{const ok=RNG()<.5,m=qd(qa(A,B),[2,1]),lo=cmpQ(A,B)<0?A:B,hi=lo===A?B:A,w=ok?m:qa(hi,qs(hi,lo));if(m[1]>40)return null;return IT(`${SH(w)} nằm giữa ${SH(lo)} và ${SH(hi)}`,ok,'ss','TH',ok?`${SH(m)} là trung điểm nên nằm giữa hai số.`:`${SH(w)} lớn hơn cả hai số ${SH(lo)} và ${SH(hi)}.`);}
    default:{const ok=RNG()<.5,n=ri(1,9);return IT(`${fr(n,0)} là số hữu tỉ`,false,'ss','TH','Phân số có mẫu bằng 0 không có nghĩa nên không là số hữu tỉ.');}
  }
}
/* các ý kiểu "tìm x" và dấu ngoặc: chân trị tính từ giá trị */
function itTcX(){
  const t=ri(0,3),A=rnz(),B=rnz();
  switch(t){
    case 0:{const g=qs(B,A);return eqItem(`Nếu x + ${PA(A,SH(A))} = ${SH(B)} thì x`,g,[qa(B,A),qs(A,B),negQ(g)],'tc','TH',`x = ${SH(B)} − ${PA(A,SH(A))} = ${SH(g)}.`);}
    case 1:{const g=qa(B,A);return eqItem(`Nếu x − ${PA(A,SH(A))} = ${SH(B)} thì x`,g,[qs(B,A),qs(A,B),negQ(g)],'tc','TH',`x = ${SH(B)} + ${PA(A,SH(A))} = ${SH(g)}.`);}
    case 2:{const g=qd(B,A);return eqItem(`Nếu ${PA(A,SH(A))} · x = ${SH(B)} thì x`,g,[qm(B,A),qs(B,A),negQ(g)],'tc','TH',`x = ${SH(B)} : ${PA(A,SH(A))} = ${SH(g)}.`);}
    default:{const C3=rnz(),ok=RNG()<.5,l=qs(A,qa(B,C3)),r=ok?qs(qs(A,B),C3):qa(qs(A,B),C3);if(!ok&&eqQ(l,r))return null;return IT(`${SH(A)} − (${SH(B)} + ${PA(C3,SH(C3))}) = ${SH(A)} − ${PA(B,SH(B))} ${ok?'−':'+'} ${PA(C3,SH(C3))}`,ok,'tc','TH',ok?'Bỏ ngoặc có dấu "−" đằng trước thì đổi dấu mọi số hạng trong ngoặc.':'Bỏ ngoặc có dấu "−" đằng trước thì phải đổi dấu cả hai số hạng trong ngoặc.');}
  }
}
const itPt=asT(()=>sel([itCt,itNh,itCh])());
const itTcAll=()=>RNG()<.5?asT(itTc)():itTcX();
const itLtAll=asT(()=>sel([itDn,itTt,itNc,itLt])());
const itVDAll=()=>{const r=sel([asT(itVD2),asT(itVD3)])();return r;};
const PT=[
 S1('Mọi số nguyên đều là số hữu tỉ.','ss','Số nguyên a viết được dưới dạng '+fr('a',1)+'.'),
 S1(`Số hữu tỉ là số viết được dưới dạng ${fr('a','b')} với a, b là số nguyên, b ≠ 0.`,'ss','Đây là định nghĩa số hữu tỉ.'),
 S1(`Số đối của ${fr(-3,4)} là ${fr(3,4)}.`,'ss','Số đối chỉ đổi dấu.'),
 S1('Số hữu tỉ dương lớn hơn số hữu tỉ âm.','ss','Số dương luôn lớn hơn 0, số âm luôn nhỏ hơn 0.'),
 S1(`Hai phân số ${fr(1,2)} và ${fr(2,4)} biểu diễn cùng một số hữu tỉ.`,'ss','Nhân cả tử và mẫu của '+fr(1,2)+' với 2 thì được '+fr(2,4)+'.'),
 S1(`Để cộng hai phân số khác mẫu, ta quy đồng mẫu số rồi cộng hai tử số.`,'pt','Đây là quy tắc cộng hai số hữu tỉ.'),
 S1(`${fr(1,2)} + ${fr(1,3)} = ${fr(5,6)}.`,'pt',`${fr(3,6)} + ${fr(2,6)} = ${fr(5,6)}.`),
 S1(`Muốn chia cho một số hữu tỉ khác 0, ta nhân với nghịch đảo của số đó.`,'pt','Đây là quy tắc chia số hữu tỉ.'),
 S1(`Tích của hai số hữu tỉ âm là một số dương.`,'pt','Hai thừa số cùng dấu thì tích dương.'),
 S1(`${fr(2,3)} · ${fr(3,2)} = 1.`,'pt','Hai số này là nghịch đảo của nhau.'),
 S1(`Luỹ thừa bậc chẵn của một số hữu tỉ âm là một số dương.`,'lt','Tích của một số chẵn các thừa số âm là số dương.'),
 S1(`${X1('x','m')} · ${X1('x','n')} = ${X1('x','m + n')}.`,'lt','Nhân hai luỹ thừa cùng cơ số: giữ nguyên cơ số, cộng hai số mũ.'),
 S1(`(${X1('x','m')})${SUP('n')} = ${X1('x','m · n')}.`,'lt','Luỹ thừa của luỹ thừa: giữ nguyên cơ số, nhân hai số mũ.'),
 S1(`Với x ≠ 0 thì ${X1('x',0)} = 1.`,'lt','Quy ước luỹ thừa bậc 0.'),
 S1('Khi bỏ dấu ngoặc có dấu "+" đằng trước, ta giữ nguyên dấu các số hạng trong ngoặc.','tc','Đây là quy tắc dấu ngoặc.'),
 S1('Khi bỏ dấu ngoặc có dấu "−" đằng trước, ta đổi dấu tất cả các số hạng trong ngoặc.','tc','Đây là quy tắc dấu ngoặc.'),
 S1('Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải đổi dấu số hạng đó.','tc','Đây là quy tắc chuyển vế.'),
 S1(`a · (b + c) = a · b + a · c.`,'tc','Tính chất phân phối của phép nhân đối với phép cộng.')];
const PF=[
 S1(`${fr(3,0)} là một số hữu tỉ.`,'ss','Phân số có mẫu bằng 0 không có nghĩa.'),
 S1('Số hữu tỉ âm lớn hơn số hữu tỉ dương.','ss','Số âm luôn nhỏ hơn số dương.'),
 S1(`Số đối của ${fr(2,5)} là ${fr(5,2)}.`,'ss','Số đối của '+fr(2,5)+' là '+fr(-2,5)+'; '+fr(5,2)+' là số nghịch đảo.'),
 S1('Số 0 là số hữu tỉ dương.','ss','Số 0 không là số hữu tỉ dương cũng không là số hữu tỉ âm.'),
 S1(`${fr(1,2)} < ${fr(1,3)}.`,'ss',`${fr(3,6)} > ${fr(2,6)} nên ${fr(1,2)} > ${fr(1,3)}.`),
 S1(`${fr(1,2)} + ${fr(1,3)} = ${fr(2,5)}.`,'pt','Không cộng tử với tử và mẫu với mẫu; phải quy đồng mẫu số.'),
 S1(`Tích của một số hữu tỉ âm và một số hữu tỉ dương là số dương.`,'pt','Hai thừa số khác dấu thì tích âm.'),
 S1(`${fr(1,2)} : ${fr(1,3)} = ${fr(1,6)}.`,'pt',`${fr(1,2)} : ${fr(1,3)} = ${fr(1,2)} · 3 = ${fr(3,2)}.`),
 S1(`Nghịch đảo của ${fr(3,4)} là ${fr(-3,4)}.`,'pt','Nghịch đảo của '+fr(3,4)+' là '+fr(4,3)+'.'),
 S1(`Luỹ thừa bậc lẻ của một số hữu tỉ âm là một số dương.`,'lt','Luỹ thừa bậc lẻ của số âm là số âm.'),
 S1(`${X1('x','m')} · ${X1('x','n')} = ${X1('x','m · n')}.`,'lt','Nhân hai luỹ thừa cùng cơ số thì cộng hai số mũ.'),
 S1(`(${X1('x','m')})${SUP('n')} = ${X1('x','m + n')}.`,'lt','Luỹ thừa của luỹ thừa thì nhân hai số mũ.'),
 S1(`(x + y)${SUP('n')} = ${X1('x','n')} + ${X1('y','n')}.`,'lt','Luỹ thừa của một tổng không bằng tổng các luỹ thừa.'),
 S1('Khi bỏ dấu ngoặc có dấu "−" đằng trước, ta giữ nguyên dấu các số hạng trong ngoặc.','tc','Phải đổi dấu tất cả các số hạng trong ngoặc.'),
 S1('Khi chuyển một số hạng sang vế kia của đẳng thức, ta giữ nguyên dấu của số hạng đó.','tc','Chuyển vế phải đổi dấu số hạng.'),
 S1(`a − (b + c) = a − b + c.`,'tc','Phải là a − b − c: đổi dấu cả hai số hạng trong ngoặc.'),
 S1(`Nếu x + 2 = 5 thì x = 7.`,'tc','x = 5 − 2 = 3.')];
const tfNB=t=>()=>{const f=(L,v)=>shuffle(L.filter(i=>i.topic===t)).map(i=>({t:i.t,v,topic:t,level:'NB',exp:i.exp,s:1}));const nT=ri(1,3);return {stem:'Xét các phát biểu sau:',items:shuffle(f(PT,true).slice(0,nT).concat(f(PF,false).slice(0,4-nT)))};};

/* ============ Câu nhiều lựa chọn viết sẵn (các nội dung ss, pt, tc; nội dung lt lấy từ Bài 3) ============ */
const MCH=[
 {id:'c1',topic:'ss',level:'NB',stem:'Tập hợp các số hữu tỉ được kí hiệu là:',ans:0,opts:[O('ℚ'),O('ℕ','ℕ là tập hợp các số tự nhiên.'),O('ℤ','ℤ là tập hợp các số nguyên.'),O('ℝ','Kí hiệu ℝ chưa dùng ở Chương I.')],exp:'Tập hợp các số hữu tỉ kí hiệu là ℚ.'},
 {id:'c2',topic:'ss',level:'NB',stem:`Số hữu tỉ là số viết được dưới dạng ${fr('a','b')} với:`,ans:0,opts:[O('a, b là số nguyên, b ≠ 0'),O('a, b là số tự nhiên, b ≠ 0','a, b phải là số nguyên (có thể âm).'),O('a, b là số nguyên, a ≠ 0','Điều kiện đúng là mẫu b khác 0, tử a có thể bằng 0.'),O('a, b là số nguyên bất kì','Mẫu số b không được bằng 0.')],exp:`Số hữu tỉ viết được dưới dạng ${fr('a','b')} với a, b là số nguyên và b ≠ 0.`},
 {id:'c3',topic:'ss',level:'NB',stem:'Số nào sau đây vừa là số nguyên vừa là số hữu tỉ?',ans:0,opts:[O('−7'),O(fr(1,2),'Số này là số hữu tỉ nhưng không là số nguyên.'),O(DEC(Rq(35,10)),'Số này là số hữu tỉ nhưng không là số nguyên.'),O(MIXD([7,3]),'Số này là số hữu tỉ nhưng không là số nguyên.')],exp:'Mọi số nguyên đều là số hữu tỉ; −7 là số nguyên.'},
 {id:'c4',topic:'ss',level:'TH',stem:'Phát biểu nào sau đây đúng?',ans:0,opts:[O('Số 0 không là số hữu tỉ dương, cũng không là số hữu tỉ âm'),O('Số 0 là số hữu tỉ dương','Số 0 không là số hữu tỉ dương.'),O('Số 0 là số hữu tỉ âm','Số 0 không là số hữu tỉ âm.'),O('Số 0 không là số hữu tỉ','Số 0 = '+fr(0,1)+' là số hữu tỉ.')],exp:'Số 0 là số hữu tỉ nhưng không dương cũng không âm.'},
 {id:'c5',topic:'ss',level:'TH',stem:'Trên trục số, điểm biểu diễn số hữu tỉ x và điểm biểu diễn số đối của x:',ans:0,opts:[O('nằm về hai phía của gốc O và cách đều O'),O('trùng nhau','Chỉ khi x = 0 thì hai điểm mới trùng nhau.'),O('nằm cùng một phía của gốc O','Hai số đối nhau có dấu khác nhau nên nằm về hai phía của O.'),O('cách O những khoảng khác nhau','Hai số đối nhau cách đều gốc O.')],exp:'Hai số đối nhau được biểu diễn bởi hai điểm nằm về hai phía của gốc O và cách đều O.'},
 {id:'c6',topic:'pt',level:'NB',stem:`Nghịch đảo của số hữu tỉ ${fr(2,5)} là:`,ans:0,opts:[O(fr(5,2)),O(fr(-2,5),'Đó là số đối của '+fr(2,5)+'.'),O(fr(-5,2),'Nghịch đảo không đổi dấu.'),O(fr(2,5),'Số này là chính số đã cho.')],exp:`${fr(2,5)} · ${fr(5,2)} = 1 nên nghịch đảo của ${fr(2,5)} là ${fr(5,2)}.`},
 {id:'c7',topic:'pt',level:'NB',stem:'Muốn cộng hai số hữu tỉ khác mẫu, ta:',ans:0,opts:[O('quy đồng mẫu số rồi cộng hai tử số, giữ nguyên mẫu'),O('cộng tử với tử, mẫu với mẫu','Không được cộng mẫu với mẫu.'),O('nhân hai tử số với nhau','Đó là phép nhân, không phải phép cộng.'),O('cộng hai mẫu số rồi giữ nguyên tử','Mẫu số được giữ nguyên sau khi quy đồng.')],exp:'Viết hai số dưới dạng phân số cùng mẫu dương, cộng hai tử số và giữ nguyên mẫu.'},
 {id:'c8',topic:'pt',level:'TH',stem:'Tích của ba số hữu tỉ âm là:',ans:0,opts:[O('một số âm'),O('một số dương','Ba thừa số âm (số lẻ) thì tích âm.'),O('bằng 0','Tích các số khác 0 không bằng 0.'),O('có thể âm hoặc dương','Tích của ba số âm luôn là số âm.')],exp:'Tích có số lẻ thừa số âm thì là số âm.'},
 {id:'c9',topic:'tc',level:'NB',stem:'Khi bỏ dấu ngoặc có dấu "−" đằng trước, ta:',ans:0,opts:[O('đổi dấu tất cả các số hạng trong ngoặc'),O('giữ nguyên dấu các số hạng trong ngoặc','Đó là quy tắc khi trước ngoặc có dấu "+".'),O('chỉ đổi dấu số hạng đầu tiên','Phải đổi dấu tất cả các số hạng trong ngoặc.'),O('bỏ dấu "−" trước ngoặc','Không được bỏ dấu "−" mà không đổi dấu các số hạng.')],exp:'Bỏ dấu ngoặc có dấu "−" đằng trước thì đổi dấu tất cả các số hạng trong ngoặc.'},
 {id:'c10',topic:'tc',level:'NB',stem:'Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải:',ans:0,opts:[O('đổi dấu số hạng đó'),O('giữ nguyên dấu số hạng đó','Chuyển vế phải đổi dấu.'),O('nhân số hạng đó với 2','Không có quy tắc nhân với 2.'),O('đổi dấu cả hai vế','Chỉ đổi dấu số hạng được chuyển.')],exp:'Quy tắc chuyển vế: khi chuyển một số hạng từ vế này sang vế kia thì phải đổi dấu số hạng đó.'},
 {id:'c11',topic:'tc',level:'TH',stem:'Nếu x + 3 = 5 thì x bằng:',ans:0,opts:[O('2'),O('8','Chuyển +3 sang vế phải thì thành −3, không phải +3.'),O('−2','Bạn lấy 3 − 5, phải lấy 5 − 3.'),O('15','Đây là phép nhân, không phải phép trừ.')],exp:'x = 5 − 3 = 2.'},
 {id:'c12',topic:'tc',level:'TH',stem:`Tính chất phân phối của phép nhân đối với phép cộng là:`,ans:0,opts:[O('a · (b + c) = a · b + a · c'),O('a · (b + c) = a · b + c','Phải nhân a với cả b và c.'),O('a · (b + c) = a + b · c','Phải nhân a với cả hai số hạng trong ngoặc.'),O('a · (b + c) = a · b · c','Đây là tích ba số, không phải phân phối.')],exp:'a · (b + c) = a · b + a · c.'}
].map(q=>Object.assign({type:'mc'},q));
const MCL=MC3.filter(q=>['m1','m4','m5','m6','m7','m8','m10','m11','m13','m14'].includes(q.id)).map(q=>Object.assign({},q,{topic:'lt'}));
const MC=MCH.concat(MCL);
const addMC=(id,topic,level,gen)=>MC.push({id,type:'mc',topic,level,gen});
['a','b','c'].forEach(x=>{
  addMC('g_ssopp_'+x,'ss','NB',genSsOpp);addMC('g_ssq_'+x,'ss','NB',genSsQ);addMC('g_ssneg_'+x,'ss','TH',genSsNeg);addMC('g_sstrue_'+x,'ss','TH',genSsTrue);addMC('g_ssmax_'+x,'ss','TH',genSsMax);addMC('g_ssbet_'+x,'ss','VD',genSsBetween);
  addMC('g_ctsame_'+x,'pt','NB',genCtSame);addMC('g_chinv_'+x,'pt','NB',genChInv);addMC('g_ctdiff_'+x,'pt','TH',genCtDiff);addMC('g_ctsub_'+x,'pt','TH',genCtSub);addMC('g_nhfr_'+x,'pt','TH',genNhFr);addMC('g_nhsign_'+x,'pt','TH',genNhSign);addMC('g_chdiv_'+x,'pt','TH',genChDiv);
  addMC('g_ctthree_'+x,'pt','TH',genCtThree);addMC('g_nhthree_'+x,'pt','TH',genNhThree);addMC('g_chchain_'+x,'pt','TH',genChChain);addMC('g_chfind_'+x,'pt','TH',genChFind);
  addMC('g_dnval_'+x,'lt','NB',genDnVal);addMC('g_ncmul_'+x,'lt','NB',genNcMul);addMC('g_dnfr_'+x,'lt','TH',genDnFr);addMC('g_dnsign_'+x,'lt','TH',genDnSign);addMC('g_ttmul_'+x,'lt','TH',genTtMul);addMC('g_ncval_'+x,'lt','TH',genNcVal);addMC('g_ltval_'+x,'lt','TH',genLtVal);
  addMC('g_nceval_'+x,'lt','TH',genNcEval);addMC('g_ltmix_'+x,'lt','VD',genLtMix);addMC('g_dnexpr_'+x,'lt','TH',genDnExpr);addMC('g_ttcombo_'+x,'lt','TH',genTtCombo);
  addMC('g_tcbr1_'+x,'tc','NB',genTcBr1);addMC('g_tcfind_'+x,'tc','TH',genTcFind);addMC('g_tcbr2_'+x,'tc','TH',genTcBr2);addMC('g_tchop_'+x,'tc','TH',genTcHop);addMC('g_tcgroup_'+x,'tc','TH',genTcGroup);
  addMC('g_tcbr3_'+x,'tc','VD',genTcBr3);addMC('g_tcdist_'+x,'tc','VD',genTcDist);addMC('g_tcfind2_'+x,'tc','VD',genTcFind2);
});

/* ============ Đúng sai ============ */
const FB_TF=()=>({stem:'Xét các phát biểu sau:',items:[
  IT(`${fr(1,2)} + ${fr(1,3)} = ${fr(5,6)}`,true,'pt','TH',`${fr(3,6)} + ${fr(2,6)} = ${fr(5,6)}.`),
  IT(`${fr(1,2)} + ${fr(1,3)} = ${fr(2,5)}`,false,'pt','TH','Không cộng tử với tử và mẫu với mẫu.'),
  IT(`${PW([2,1],3)} = 8`,true,'lt','TH','2 · 2 · 2 = 8.'),
  IT(`${PW([2,1],3)} = 6`,false,'lt','TH','Luỹ thừa bậc 3 là tích của 3 thừa số 2, bằng 8.')]});
const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
const TKEYS=['ss','pt','lt','tc'];
const ITM={ss:itSs,pt:itPt,lt:itLtAll,tc:itTcAll};
TKEYS.forEach(t=>{
  addTF('tf_nb_'+t,t,'NB',tfNB(t));
  ['a','b'].forEach(x=>addTF(`tf_${t}_th_${x}`,t,'TH',four(ITM[t])));
  addTF('tf_'+t+'_vd',t,'VD',four(()=>RNG()<.5?itVDAll():ITM[t]()));
});
addTF('tf_mix_a','pt','TH',four(()=>sel([itSs,itPt,itLtAll,itTcAll])()));
addTF('tf_mix_b','lt','VD',four(()=>RNG()<.6?itVDAll():sel([itSs,itPt,itLtAll,itTcAll])()));

/* ============ Gói Thử thách và Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const mcQ=(stem,right,wrongs,exp,topic,level)=>{const seen=new Set([SH(right)]),w=[];for(const [q,e] of wrongs){const t=SH(q);if(!seen.has(t)){seen.add(t);w.push([t,e]);}}return w.length<3?null:mcq(stem,SH(right),w.slice(0,3),exp,topic,level);};
const saq=(stem,ans,unit,exp,topic,level,at)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp,at});
const ansq=(q,topic,level,stem,exp,unit)=>saq(stem,q[0]/q[1],unit||'',exp,topic,level,SH(q));
const decq=(q,topic,level,stem,exp,unit)=>saq(stem,q[0]/q[1],unit||'',exp,topic,level,DEC(q));
function tfHardC(){return four(()=>RNG()<.75?itVDAll():sel([itSs,itPt,itLtAll,itTcAll])())();}
const HARD={tf:[{id:'h_tc',type:'tf',topic:'lt',level:'VD',gen:tfHardC}],sa:[
 {id:'h_tele',topic:'pt',level:'VD',unit:'',gen:()=>{const n=ri(4,12),t=[];for(let k=1;k<=3;k++)t.push(`${fr(1,`${k} · ${k+1}`)}`);
   return {stem:`Tính S = ${t.join(' + ')} + … + ${fr(1,`${n} · ${n+1}`)}. Nhập dạng phân số tối giản.`,ans:[n/(n+1)],at:SH([n,n+1]),exp:`Vì ${fr(1,'k · (k + 1)')} = ${fr(1,'k')} − ${fr(1,'k + 1')} nên S = (1 − ${fr(1,2)}) + (${fr(1,2)} − ${fr(1,3)}) + … + (${fr(1,n)} − ${fr(1,n+1)}) = 1 − ${fr(1,n+1)} = ${fr(n,n+1)}.`};}},
 {id:'h_cmp',topic:'lt',level:'VD',unit:'',gen:()=>{const [a,r,b,s]=sel([[2,3,3,2],[2,4,5,2],[3,4,2,6],[2,5,3,3],[7,2,3,4],[5,2,2,5]]),k=sel([10,20,25,30,50,100]),big=Math.pow(a,r)>Math.pow(b,s)?1:2;
   return {stem:`So sánh hai số ${E(PW([a,1],r*k))} và ${E(PW([b,1],s*k))}. Nhập 1 nếu số thứ nhất lớn hơn, nhập 2 nếu số thứ hai lớn hơn.`,ans:[big],exp:`${PW([a,1],r*k)} = (${a}${SUP(r)})${SUP(k)} = ${Math.pow(a,r)}${SUP(k)} và ${PW([b,1],s*k)} = (${b}${SUP(s)})${SUP(k)} = ${Math.pow(b,s)}${SUP(k)}. Cùng số mũ ${k}, cơ số ${Math.pow(a,r)} ${big===1?'>':'<'} ${Math.pow(b,s)} nên số ${big===1?'thứ nhất':'thứ hai'} lớn hơn.`};}},
 {id:'h_n',topic:'lt',level:'VD',unit:'',gen:()=>{for(;;){const a=sel([2,3]),i=ri(2,3),j=ri(2,3),k=ri(2,4),l=ri(3,4),n=k*l-i*j;if(n<1)continue;
   return {stem:`Tìm số tự nhiên n biết ${X1(a,'n')} · (${X1(a,i)})${SUP(j)} = (${X1(a,k)})${SUP(l)}.`,ans:[n],exp:`${BR(X1(a,i))}${SUP(j)} = ${X1(a,i*j)} và (${X1(a,k)})${SUP(l)} = ${X1(a,k*l)}. Do đó ${X1(a,'n')} · ${X1(a,i*j)} = ${X1(a,k*l)}, suy ra n + ${i*j} = ${k*l} và n = ${n}.`};}}},
 {id:'h_x',topic:'tc',level:'VD',unit:'',gen:()=>{for(;;){const A=rnz(),B=rnz(),C=rnz();if(A[0]===0||(A[1]===1&&Math.abs(A[0])===1))continue;const g=qa(qd(C,A),B);if(g[1]>60||Math.abs(g[0])>200)continue;
   return {stem:`Tìm x, biết ${E(`(x − ${PA(B,SH(B))}) · ${PA(A,SH(A))} = ${SH(C)}`)}. Nhập dạng phân số tối giản hoặc số nguyên.`,ans:[g[0]/g[1]],at:SH(g),exp:`x − ${PA(B,SH(B))} = ${SH(C)} : ${PA(A,SH(A))} = ${SH(qd(C,A))}; x = ${SH(qd(C,A))} + ${PA(B,SH(B))} = ${SH(g)}.`};}}}
].map(q=>{const f=q.gen;return Object.assign({type:'sa'},q,{gen:()=>{for(let i=0;i<200;i++){const r=f();if(r)return r;}throw new Error(q.id);}});})};
const PISA=[
 ()=>{for(;;){
  const A=Rq(ri(2,9),ri(2,5)),B=Rq(ri(1,5),ri(3,8)),k=ri(3,6),small=qm(A,[1,ri(2,4)]),m=qa(qm(A,[k,1]),small);if(A[1]===1||B[1]===1||small[1]===1||!okq(m)||m[1]>60)continue;
  const R1={title:'Làm bánh',ctx:`<p class="stem">Một công thức làm một mẻ bánh cần ${SH(A)} kg bột mì và ${SH(B)} kg đường.</p>`,qs:[
   mcQ('Tổng khối lượng bột mì và đường cho một mẻ bánh (kg) là:',qa(A,B),[[qm(A,B),'Tổng là phép cộng, không phải phép nhân.'],[qs(A,B),'Tổng là phép cộng, không phải phép trừ.'],[[A[0]+B[0],A[1]+B[1]],'Không cộng tử với tử và mẫu với mẫu; phải quy đồng mẫu số.']],`${SH(A)} + ${SH(B)} = ${SH(qa(A,B))} (kg).`,'pt','TH'),
   ansq(qm(A,[k,1]),'pt','TH',`Làm ${k} mẻ bánh thì cần bao nhiêu kg bột mì? Nhập dạng phân số tối giản hoặc số nguyên.`,`${k} · ${SH(A)} = ${SH(qm(A,[k,1]))} (kg).`,'kg'),
   saq(`Bếp có ${SH(m)} kg bột mì. Làm được nhiều nhất bao nhiêu mẻ bánh?`,k,'mẻ',`${k} mẻ cần ${k} · ${SH(A)} = ${SH(qm(A,[k,1]))} kg, còn dư ${SH(small)} kg. Một mẻ cần ${SH(A)} kg, mà ${SH(small)} < ${SH(A)} nên chưa đủ làm thêm một mẻ. Vậy làm được nhiều nhất ${k} mẻ.`,'pt','VD'),
   ansq(qs(A,small),'pt','VD',`Với ${SH(m)} kg bột, sau khi làm ${k} mẻ thì phải mua thêm ít nhất bao nhiêu kg bột mì để làm thêm một mẻ nữa? Nhập dạng phân số tối giản.`,`Còn dư ${SH(small)} kg; một mẻ cần ${SH(A)} kg nên cần thêm ${SH(A)} − ${SH(small)} = ${SH(qs(A,small))} (kg).`,'kg')]};
  if(R1.qs[0])return R1;}},
 ()=>{for(;;){
  const h0=ri(2,5),h=Rq(h0,10),k=ri(2,8),n=qm(h,[k,1]),d=Rq(ri(30,89),10),u=qa(n,Rq(ri(1,25),10)),res=qs(u,n);if(n[0]>90||n[0]<11)continue;
  const t2=negQ(n),diff=qa(d,n),avg=qd(qa(d,t2),[2,1]),after=qs(u,n);
  const R2={title:'Nhiệt độ trong ngày',ctx:`<p class="stem">Tại một địa điểm trên núi cao, nhiệt độ ban ngày là ${DEC(d)} °C, nhiệt độ ban đêm là ${DEC(t2)} °C.</p>`,qs:[
   mcq('Nhiệt độ ban ngày cao hơn nhiệt độ ban đêm bao nhiêu độ C?',`${DEC(diff)} °C`,[[`${DEC(qs(d,n))} °C`,'Nhiệt độ ban đêm là số âm nên chênh lệch là d − (−n) = d + n, không phải d − n.'],[`${DEC(negQ(diff))} °C`,'Chênh lệch giữa nhiệt độ cao hơn và thấp hơn là số dương.'],[`${DEC(qm(d,n))} °C`,'Chênh lệch là phép trừ, không phải phép nhân.']],`${DEC(d)} − (${DEC(t2)}) = ${DEC(d)} + ${DEC(n)} = ${DEC(diff)} (°C).`,'pt','TH'),
   decq(avg,'pt','TH','Nhiệt độ trung bình của hai thời điểm trên là bao nhiêu độ C? Nhập số thập phân (dùng dấu phẩy).',`(${DEC(d)} + (${DEC(t2)})) : 2 = ${DEC(qa(d,t2))} : 2 = ${DEC(avg)} (°C).`,'°C'),
   decq(after,'pt','VD',`Sau đêm, nhiệt độ tăng thêm ${DEC(u)} °C so với ban đêm (từ ${DEC(t2)} °C). Nhiệt độ lúc đó là bao nhiêu độ C? Nhập số thập phân (dùng dấu phẩy).`,`${DEC(t2)} + ${DEC(u)} = ${DEC(after)} (°C).`,'°C'),
   saq(`Kể từ lúc ${DEC(t2)} °C, nhiệt độ tăng đều ${DEC(h)} °C mỗi giờ. Sau bao nhiêu giờ thì nhiệt độ đạt 0 °C?`,k,'giờ',`Cần tăng ${DEC(n)} °C: ${DEC(n)} : ${DEC(h)} = ${k} (giờ).`,'pt','VD')]};
  if(R2.qs[0])return R2;}}
];

/* ============ Trả lời ngắn ============ */
function SA_BUILD(){
  const S=[];const add=(id,topic,level,gen,unit)=>['a','b'].forEach(x=>S.push({id:id+x,type:'sa',topic,level,unit:unit||'',gen}));
  add('s_ssopp','ss','NB',saSsOpp);add('s_sseq','ss','TH',saSsEq);add('s_ssint','ss','VD',saSsInt);
  add('s_nhfr','pt','NB',saNhFr);add('s_ctadd','pt','NB',saCtAdd);add('s_chfr','pt','TH',saChFr);add('s_ctdec','pt','TH',saCtDec);add('s_ctthree','pt','TH',saCtThree);add('s_chchain','pt','TH',saChChain);
  add('s_dnval','lt','NB',saDnVal);add('s_ncdiv','lt','NB',saNcDiv);add('s_dnfr','lt','TH',saDnFr);add('s_ltval','lt','TH',saLtVal);add('s_nceval','lt','TH',saNcEval);add('s_ltmix','lt','VD',saLtMix);add('s_ltbase','lt','VD',saLtBase);
  add('s_tcbr1','tc','NB',saTcBr1);add('s_tcfind','tc','TH',saTcFind);add('s_tcbr2','tc','TH',saTcBr2);add('s_tcdist','tc','VD',saTcDist);add('s_tcfind2','tc','VD',saTcFind2);add('s_tcbr3','tc','VD',saTcBr3);
  return S;
}
const BANK={mc:MC,tf:TF,sa:SA_BUILD()};
const SA=BANK.sa;
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Nội dung, mức độ, ôn nhanh ============ */
const TOPICS={
  ss:{short:'Số hữu tỉ, so sánh',name:'Số hữu tỉ, số đối, so sánh',rule:`Số hữu tỉ là số viết được dưới dạng ${fr('a','b')} với a, b là số nguyên, b ≠ 0; tập hợp các số hữu tỉ kí hiệu là ℚ. Số đối của ${fr('a','b')} là ${fr('−a','b')}. Số hữu tỉ dương lớn hơn 0, số hữu tỉ âm nhỏ hơn 0. Muốn so sánh hai số hữu tỉ, viết chúng dưới dạng phân số cùng mẫu dương rồi so sánh các tử số.`,tip:'Số đối chỉ đổi dấu, không đảo tử và mẫu (đó là số nghịch đảo). Phân số có mẫu bằng 0 không có nghĩa. Quy đồng về mẫu dương trước khi so sánh.'},
  pt:{short:'Cộng, trừ, nhân, chia',name:'Cộng, trừ, nhân, chia số hữu tỉ',rule:`Cộng, trừ: quy đồng mẫu số rồi cộng (trừ) các tử số, giữ nguyên mẫu; x − y = x + (−y). Nhân: nhân tử với tử, mẫu với mẫu. Chia: x : y = x · ${fr(1,'y')} (y ≠ 0), tức là nhân với nghịch đảo của số chia. Quy tắc dấu: hai số cùng dấu thì tích (thương) dương, khác dấu thì âm.`,tip:'Không cộng tử với tử và mẫu với mẫu. Chỉ đảo ngược số chia, không đảo số bị chia. Phép nhân và phép chia cùng cấp, làm từ trái sang phải.'},
  lt:{short:'Luỹ thừa',name:'Luỹ thừa với số mũ tự nhiên',rule:`${X1('x','n')} = x · x · … · x (n thừa số x); ${X1('x',0)} = 1 (x ≠ 0); ${X1('x',1)} = x. Luỹ thừa của một tích, một thương: (x · y)${SUP('n')} = ${X1('x','n')} · ${X1('y','n')}; (x : y)${SUP('n')} = ${X1('x','n')} : ${X1('y','n')}. Nhân, chia hai luỹ thừa cùng cơ số: ${X1('x','m')} · ${X1('x','n')} = ${X1('x','m + n')}; ${X1('x','m')} : ${X1('x','n')} = ${X1('x','m − n')}. Luỹ thừa của luỹ thừa: (${X1('x','m')})${SUP('n')} = ${X1('x','m · n')}.`,tip:`Cơ số âm hoặc phân số phải đặt trong ngoặc: ${PW([-2,1],4)} = 16 còn −${X1(2,4)} = −16. Chỉ cộng (trừ) số mũ khi hai luỹ thừa cùng cơ số; luỹ thừa của luỹ thừa thì nhân hai số mũ.`},
  tc:{short:'Dấu ngoặc, tìm x',name:'Quy tắc dấu ngoặc, quy tắc chuyển vế, tìm x',rule:'Bỏ dấu ngoặc có dấu "+" đằng trước thì giữ nguyên dấu các số hạng trong ngoặc; có dấu "−" đằng trước thì đổi dấu tất cả các số hạng trong ngoặc. Quy tắc chuyển vế: khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải đổi dấu số hạng đó. Tính chất phân phối: a · (b + c) = a · b + a · c, dùng để tính một cách hợp lí.',tip:'Dấu "−" trước ngoặc làm đổi dấu mọi số hạng trong ngoặc, không chỉ số hạng đầu. Tìm x: chuyển vế (đổi dấu) rồi chia cho hệ số của x; có hai bước thì làm lần lượt từng bước.'}
};
const TDESC={ss:'Số hữu tỉ, ℚ, số đối, so sánh hai số hữu tỉ, số nằm giữa hai số',pt:'Cộng, trừ, nhân, chia số hữu tỉ, nghịch đảo, quy tắc dấu',lt:'Luỹ thừa, nhân chia luỹ thừa cùng cơ số, luỹ thừa của tích, thương, của luỹ thừa',tc:'Quy tắc dấu ngoặc, tính hợp lí, quy tắc chuyển vế, tìm x'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhớ định nghĩa số hữu tỉ, số đối, nghịch đảo, quy tắc cộng trừ nhân chia, luỹ thừa, dấu ngoặc và chuyển vế; tính các phép tính đơn giản.',TH:'So sánh số hữu tỉ, thực hiện bốn phép tính với phân số khác mẫu, tính luỹ thừa, bỏ dấu ngoặc đúng quy tắc, tìm x một bước.',VD:'Tính biểu thức nhiều phép tính và nhiều luỹ thừa, tính hợp lí, tìm x hai bước, bài toán thực tế.'};
const RECAP=[
  {k:'ss',fig:`<div class="figbox"><p>ℚ: số viết được dạng ${fr('a','b')}, a, b ∈ ℤ, b ≠ 0</p><p>Số đối của ${fr(2,5)} là ${fr(-2,5)}</p><p>${fr(1,2)} = ${fr(3,6)} > ${fr(2,6)} = ${fr(1,3)}</p></div>`,extra:`Ví dụ: ${fr(-3,4)} và ${fr(-2,3)}: ${fr(-9,12)} < ${fr(-8,12)} nên ${fr(-3,4)} < ${fr(-2,3)}.`},
  {k:'pt',fig:`<div class="figbox"><p>${fr('a','b')} ± ${fr('c','d')} = ${fr('a·d ± c·b','b·d')}</p><p>${fr('a','b')} · ${fr('c','d')} = ${fr('a·c','b·d')}</p><p>${fr('a','b')} : ${fr('c','d')} = ${fr('a','b')} · ${fr('d','c')}</p></div>`,extra:`Ví dụ: ${fr(3,4)} : ${fr(-9,8)} = ${fr(3,4)} · ${fr(-8,9)} = ${fr(-2,3)}.`},
  {k:'lt',fig:`<div class="figbox"><p>${X1('x','m')} · ${X1('x','n')} = ${X1('x','m + n')}; ${X1('x','m')} : ${X1('x','n')} = ${X1('x','m − n')}</p><p>(${X1('x','m')})${SUP('n')} = ${X1('x','m · n')}</p><p>(x · y)${SUP('n')} = ${X1('x','n')} · ${X1('y','n')}</p></div>`,extra:`Ví dụ: ${PW([-2,1],3)} · ${PW([-2,1],4)} = ${PW([-2,1],7)} = −128.`},
  {k:'tc',fig:`<div class="figbox"><p>a − (b − c) = a − b + c</p><p>x + a = b ⇒ x = b − a</p><p>a · (b + c) = a · b + a · c</p></div>`,extra:`Ví dụ: x − ${fr(1,3)} = ${fr(1,2)} nên x = ${fr(1,2)} + ${fr(1,3)} = ${fr(5,6)}.`}
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
 G(()=>{const n=sel([4,5,6,8]),items=[['Thuê xe',10*ri(40,90)],['Đồ ăn',rd(ri(300,700)+sel([0,0.5]),1)],['Nước uống',rd(ri(60,150)+sel([0,0.5]),1)],['Vé tham quan',n*5*ri(6,12)]];
  const tot=rd(items.reduce((a,b)=>a+b[1],0),1),each=rd(tot/n,2);if(Math.abs(each*100-Math.round(each*100))>1e-6||Math.abs(tot/n-each)>1e-9)throw 0;
  const m=50*Math.floor(each/50);if(m<=0||each-m<1)throw 0;const more=rd(each-m,2);
  const L=items.map(x=>nm(x[1])).join(' + ');
  return {title:'Chia tiền chuyến dã ngoại',ctx:P(`Nhóm ${n} bạn đi dã ngoại và chia đều mọi khoản chi. Bảng sau ghi các khoản chi của cả nhóm (đơn vị: nghìn đồng).`)+T(['Khoản chi','Số tiền (nghìn đồng)'],items.map(x=>[x[0],nm(x[1])])),qs:[
   A('Tổng chi phí của cả nhóm là bao nhiêu nghìn đồng?',tot,'nghìn đồng',`${L} = ${nm(tot)}.`,'pt','TH'),
   A('Chia đều cho mọi bạn, mỗi bạn phải góp bao nhiêu nghìn đồng?',each,'nghìn đồng',`${nm(tot)} : ${n} = ${nm(each)}.`,'pt','VD'),
   M(`Trước chuyến đi, mỗi bạn đã đóng trước ${m} nghìn đồng. Biểu thức nào tính số tiền mỗi bạn còn phải góp thêm (nghìn đồng)?`,`(${L}) : ${n} − ${m}`,[[`${L} : ${n} − ${m}`,`Thiếu dấu ngoặc: phép chia làm trước nên chỉ có số cuối bị chia cho ${n}.`],[`(${L}) : (${n} − ${m})`,`Mỗi bạn góp tổng chi phí chia ${n} rồi mới trừ đi ${m}, không chia cho ${n} − ${m}.`],[`(${L} − ${m}) : ${n}`,`Mỗi bạn đã đóng ${m} nghìn đồng, nên cả nhóm đã đóng ${n} · ${m}, không phải ${m}.`]],`Số tiền mỗi bạn phải góp trừ đi số đã đóng trước: (${L}) : ${n} − ${m}.`,'tc','TH'),
   A(`Mỗi bạn còn phải góp thêm bao nhiêu nghìn đồng?`,more,'nghìn đồng',`(${L}) : ${n} − ${m} = ${nm(each)} − ${m} = ${nm(more)}.`,'tc','VD')]};}),
 G(()=>{const k=sel([2,3]),n=ri(8,12),mI=ri(6,10),pI=ri(2,mI-2),pw=(b,e)=>`${b}<sup>${e}</sup>`,cnt=j=>Math.pow(k,j-1);
  const s4=1+k+k*k+k*k*k;
  return {title:'Bàn cờ và hạt thóc',ctx:P(`Trên một bàn cờ, người ta đặt 1 hạt thóc vào ô thứ nhất. Từ ô thứ hai, số hạt thóc ở mỗi ô gấp ${k} lần số hạt thóc ở ô ngay trước nó.`),qs:[
   A('Ô thứ năm có bao nhiêu hạt thóc?',cnt(5),'hạt',`Ô thứ năm có ${pw(k,4)} = ${cnt(5)} hạt.`,'lt','TH'),
   M(`Số hạt thóc ở ô thứ ${n} được viết là`,pw(k,n-1),[[pw(k,n),`Ô thứ nhất có 1 = ${pw(k,0)} hạt, nên ô thứ ${n} có ${pw(k,n-1)} hạt, số mũ nhỏ hơn số thứ tự của ô một đơn vị.`],[`${k} · ${n-1}`,`Mỗi ô gấp ${k} lần ô trước nên phải nhân ${k} nhiều lần, tức là luỹ thừa, không phải ${k} · ${n-1}.`],[pw(n-1,k),'Cơ số và số mũ bị đổi chỗ.']],`Từ ô thứ nhất đến ô thứ ${n}, số hạt được nhân với ${k} tất cả ${n-1} lần: ${pw(k,n-1)}.`,'lt','TH'),
   A(`Số hạt thóc ở ô thứ ${mI} gấp bao nhiêu lần số hạt thóc ở ô thứ ${pI}?`,Math.pow(k,mI-pI),'lần',`${pw(k,mI-1)} : ${pw(k,pI-1)} = ${pw(k,mI-pI)} = ${Math.pow(k,mI-pI)}.`,'lt','VD'),
   A('Bốn ô đầu tiên có tất cả bao nhiêu hạt thóc?',s4,'hạt',`1 + ${k} + ${pw(k,2)} + ${pw(k,3)} = 1 + ${k} + ${k*k} + ${k*k*k} = ${s4}.`,'pt','VD')]};})
);
}
/* ==== Toán thực tế bổ sung: kết thúc ==== */
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='cc7_seen';
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
  const mcSlots=[['ss',['NB','TH']],['pt',['NB','TH']],['pt',['TH','VD']],['lt',['NB','TH']],['lt',['TH','VD']],['tc',['NB','TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>q.topic===t&&l.includes(q.level)),used));
  const tf=[sel(['ss','pt']),'lt','tc'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set(),t1=sel(['ss','pt']),t2=sel(['lt','tc']);
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
