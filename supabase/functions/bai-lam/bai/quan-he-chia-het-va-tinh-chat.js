// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ quan-he-chia-het-va-tinh-chat/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "quan-he-chia-het-va-tinh-chat";
export const TIEN_TO = "QH6-";

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

const FB_MC=()=>({stem:'Cho hai số tự nhiên a và b (b ≠ 0). Ta nói a chia hết cho b nếu:',opts:[{t:'Có số tự nhiên k sao cho a = kb'},{t:'Có số tự nhiên k sao cho b = ka',err:'Đã đổi chỗ a và b.'},{t:'a lớn hơn b',err:'Lớn hơn chưa chắc chia hết: 16 > 3 nhưng 16 ⋮̸ 3.'},{t:'Phép chia a cho b có số dư khác 0',err:'Có số dư khác 0 thì a không chia hết cho b.'}],ans:0,exp:'Nếu có số tự nhiên k sao cho a = kb thì a chia hết cho b, kí hiệu a ⋮ b.'});
function tryGen(f){for(let n=0;n<200;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>String(o.t))).size===4)return r;}return FB_MC();}
const mkMC=(stem,right,wrongs,exp)=>({stem,opts:[{t:nb(right)}].concat(wrongs.map(w=>({t:nb(w[0]),err:w[1]}))),ans:0,exp});

/* ============ Câu nhiều lựa chọn ============ */
// ch: quan hệ chia hết
function genDivTrue(){return tryGen(()=>{const b=ri(3,12),k=ri(3,15),a=b*k,wr=[];
  for(let n=0;n<40&&wr.length<3;n++){const b2=ri(3,12),a2=b2*ri(3,15)+ri(1,b2-1);if(!wr.some(w=>w[0]===a2)&&a2!==a)wr.push([a2,b2]);}
  if(wr.length<3)return null;
  return mkMC('Khẳng định nào sau đây đúng?',dv(a,b),wr.map(([x,y])=>[dv(x,y),`${why(x,y)}.`]),`${why(a,b)}.`);});}
function genNotTrue(){return tryGen(()=>{const b=ri(3,12),a=b*ri(3,15)+ri(1,b-1),wr=[];
  for(let n=0;n<40&&wr.length<3;n++){const b2=ri(3,12),a2=b2*ri(3,15);if(!wr.some(w=>w[0]===a2)&&a2!==a)wr.push([a2,b2]);}
  if(wr.length<3)return null;
  return mkMC('Khẳng định nào sau đây đúng?',nd(a,b),wr.map(([x,y])=>[nd(x,y),`${why(x,y)}.`]),`${why(a,b)}.`);});}
function genWord(){return tryGen(()=>{const b=ri(3,15),k=ri(2,12),a=b*k,head=`Vì ${F(a)} = ${k} · ${b} nên:`;
  const E='a ⋮ b thì b là ước của a và a là bội của b.';
  if(RNG()<.5)return mkMC(head,`${a} là bội của ${b}`,[[`${a} là ước của ${b}`,E],[`${b} là bội của ${a}`,E],[nd(a,b),`${F(a)} = ${b} · ${k} nên ${dv(a,b)}.`]],`${dv(a,b)} nên ${a} là bội của ${b}, ${b} là ước của ${a}.`);
  return mkMC(head,`${b} là ước của ${a}`,[[`${b} là bội của ${a}`,E],[`${a} là ước của ${b}`,E],[nd(a,b),`${F(a)} = ${b} · ${k} nên ${dv(a,b)}.`]],`${dv(a,b)} nên ${b} là ước của ${a}.`);});}
function genDef(){if(RNG()<.5)return FB_MC();
  return {stem:'Kí hiệu Ư(a) và B(a) lần lượt là:',opts:[{t:'Tập hợp các ước của a; tập hợp các bội của a'},{t:'Tập hợp các bội của a; tập hợp các ước của a',err:'Ư là ước, B là bội.'},{t:'Một ước của a; một bội của a',err:'Ư(a), B(a) là các tập hợp.'},{t:'Số ước của a; số bội của a',err:'Ư(a), B(a) là tập hợp, không phải số lượng.'}],ans:0,exp:'Ư(a) là tập hợp các ước của a, B(a) là tập hợp các bội của a.'};}
function genFill(){return tryGen(()=>{const items=[];const used=new Set();for(let i=0;i<4;i++){const b=ri(3,12),a=RNG()<.5?b*ri(3,12):b*ri(3,12)+ri(1,b-1);if(used.has(a+'/'+b))return null;used.add(a+'/'+b);items.push([a,b]);}
  const S=s=>items.map(([a,b],i)=>`${a} ${s[i]} ${b}`).join(';  ');const ok=items.map(([a,b])=>a%b?ND:DV);
  const fl1=ok.map(x=>x===DV?ND:DV);const w1=ok.slice();w1[0]=fl1[0];const w2=ok.slice();w2[3]=fl1[3];
  return {stem:'Điền kí hiệu thích hợp (⋮ hoặc ⋮̸) vào các ô theo thứ tự: '+items.map(([a,b])=>`${a} ? ${b}`).join(';  '),opts:[{t:nb(S(ok))},{t:nb(S(fl1)),err:'Kiểm tra lại từng phép chia: chia hết thì dùng ⋮, có dư thì dùng ⋮̸.'},{t:nb(S(w1)),err:`${why(items[0][0],items[0][1])}.`},{t:nb(S(w2)),err:`${why(items[3][0],items[3][1])}.`}],ans:0,exp:items.map(([a,b])=>why(a,b)).join('; ')+'.'};});}
function genWhich0(){return tryGen(()=>{const b=ri(2,15);
  return mkMC('Khẳng định nào sau đây đúng?',`0 ∈ ${BO(b)}`,[[`0 ∈ ${UO(b)}`,`0 không là ước của số nào vì không chia được cho 0.`],[`1 ∈ ${BO(b)}`,`1 ⋮̸ ${b} nên 1 không là bội của ${b}.`],[`${b} ∉ ${BO(b)}`,`${b} = ${b} · 1 nên ${b} ∈ ${BO(b)}.`]],`0 = ${b} · 0 nên 0 là bội của ${b}.`);});}
// uoc
function genIsDiv(lo,hi){return ()=>tryGen(()=>{const n=sel(lo==='s'?SMALL:RICH),D=divs(n).filter(d=>d>1&&d<n);if(!D.length)return null;const d=sel(D),wr=[];
  for(let k=0;k<30&&wr.length<3;k++){const x=nonDiv(n,2,n-1,wr.concat([d]));if(x)wr.push(x);}
  if(RNG()<.4){const m=n*2;if(!wr.includes(m)){wr[0]=m;}}
  if(wr.length<3)return null;
  return mkMC(`Số nào sau đây là ước của ${n}?`,''+d,wr.map(x=>[''+x,x>n?`${x} là bội của ${n}, không phải ước.`:`${why(n,x)}.`]),`${F(n)} = ${d} · ${n/d} nên ${d} ∈ ${UO(n)}.`);});}
function genIsMult(lo){return ()=>tryGen(()=>{const b=ri(lo==='s'?3:6,lo==='s'?9:19),k=ri(3,lo==='s'?10:15),a=b*k,wr=[];
  const D=divs(b).filter(d=>d>1&&d<b);if(D.length)wr.push([''+sel(D),`Đây là một ước của ${b}, không phải bội.`]);
  for(let n=0;n<40&&wr.length<3;n++){const x=b*ri(2,15)+ri(1,b-1);if(!wr.some(w=>w[0]===''+x))wr.push([''+x,`${why(x,b)}.`]);}
  return mkMC(`Số nào sau đây là bội của ${b}?`,''+a,wr,`${F(a)} = ${b} · ${k} nên ${a} ∈ ${BO(b)}.`);});}
function genUset(kind){return ()=>tryGen(()=>{const n=sel(kind==='s'?SMALL:RICH.filter(x=>nDiv(x)>=6)),D=divs(n);
  const inner=D.filter(d=>d>1&&d<n),drop=sel(inner),x=nonDiv(n,2,n-1);
  const c=[{t:SET(D.slice(1)),err:'Thiếu ước 1: 1 là ước của mọi số.'},{t:SET(D.slice(0,-1)),err:`Thiếu ước ${n}: mọi số đều là ước của chính nó.`},{t:SET(D.filter(d=>d!==drop)),err:`Thiếu ước ${drop}: ${n} = ${drop} · ${n/drop}.`},
    x?{t:SET(D.concat([x]).sort((p,q)=>p-q)),err:`${x} không là ước của ${n}: ${why(n,x)}.`}:null];
  const o=pickOpts(SET(D),shuffle(c));if(o.length<3)return null;
  return {stem:`Tập hợp ${UO(n)} là:`,opts:[{t:nb(SET(D))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`Chia ${n} lần lượt cho 1; 2; …; ${n}: ${UO(n)} = ${SET(D)}.`};});}
function genCountU(){return tryGen(()=>{const n=sel(RICH),c=nDiv(n);
  return mkMC(`Số ${n} có bao nhiêu ước?`,''+c,[[''+(c-1),'Bạn quên ước 1 hoặc chính số đó.'],[''+(c-2),`Bạn quên cả hai ước 1 và ${n}.`],[''+(c+1),'Bạn đếm thừa một số không là ước.']],`${UO(n)} = ${SET(divs(n))}, có ${c} ước.`);});}
function genUgt(){return tryGen(()=>{const n=sel(RICH.filter(x=>nDiv(x)>=8)),D=divs(n),mid=D.filter(d=>d>2&&d<n/2),k=sel(mid),R=D.filter(d=>d>k);
  const x=nonDiv(n,k+1,n-1);
  const c=[{t:SET([k].concat(R)),err:`Đề hỏi ước lớn hơn ${k} nên không lấy ${k}.`},{t:SET(R.slice(0,-1)),err:`Thiếu ${n}: ${n} cũng là ước của ${n}.`},x?{t:SET(R.concat([x]).sort((p,q)=>p-q)),err:`${x} không là ước của ${n}.`}:null,{t:SET(D.filter(d=>d<k)),err:'Đây là các ước nhỏ hơn.'}];
  const o=pickOpts(SET(R),c);if(o.length<3)return null;
  return {stem:`Tập hợp các số tự nhiên y sao cho ${nb(`y ∈ ${UO(n)}`)} và y > ${k} là:`,opts:[{t:nb(SET(R))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`${UO(n)} = ${SET(D)}; các ước lớn hơn ${k}: ${SET(R)}.`};});}
function genBU(){return tryGen(()=>{const a=sel(RICH.filter(x=>nDiv(x)>=8)),bs=divs(a).filter(d=>d>=2&&d<=6&&a/d>=4);if(!bs.length)return null;const b=sel(bs),R=divs(a).filter(d=>d%b===0),Bm=range(1,a/b).map(i=>b*i);
  const c=[{t:SET(divs(a)),err:`Còn phải là bội của ${b}.`},{t:SET(Bm),err:`Còn phải là ước của ${a}.`},{t:SET(R.slice(0,-1)),err:`Thiếu ${a}: ${a} là bội của ${b} và là ước của ${a}.`},{t:SET([0].concat(R)),err:`0 không là ước của ${a}.`}];
  const o=pickOpts(SET(R),c);if(o.length<3)return null;
  return {stem:`Tập hợp các số tự nhiên x vừa là bội của ${b}, vừa là ước của ${a} là:`,opts:[{t:nb(SET(R))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`${UO(a)} = ${SET(divs(a))}; trong đó các số chia hết cho ${b} là ${SET(R)}.`};});}
function genGroup(){return tryGen(()=>{const n=sel([24,30,36,40,42,45,48,54,56,60,72]),lo=ri(2,4),hi=ri(8,12),D=divs(n).filter(d=>d>=lo&&d<=hi),c=D.length;if(c<2)return null;
  const all=nDiv(n);const cands=[[''+(c+1),'Kiểm tra lại: có số được đếm nhưng không là ước.'],[''+(c-1),'Còn thiếu một cách chia.'],[''+all,`Đây là số ước của ${n}; mỗi nhóm chỉ được từ ${lo} đến ${hi} bạn.`],[''+(c+2),'Đếm thừa.']];
  const o=pickOpts(''+c,cands.map(z=>({t:z[0],err:z[1]})));
  return {stem:`Lớp 6A có ${n} học sinh, cô giáo chia đều thành các nhóm, mỗi nhóm có từ ${lo} đến ${hi} học sinh. Có bao nhiêu cách chia?`,opts:[{t:''+c}].concat(o),ans:0,exp:`Số học sinh mỗi nhóm là ước của ${n} và từ ${lo} đến ${hi}: ${SET(D)}. Có ${c} cách chia.`};});}
// boi
function genBset(){return tryGen(()=>{const b=ri(3,12),j=ri(4,8),M=RNG()<.6?b*j:b*j-ri(1,b-1),Bs=range(0,j-1).map(i=>b*i).filter(x=>x<M);
  const next=b*(Bs.length);
  const c=[{t:SET(Bs.slice(1)),err:`Thiếu 0: 0 = ${b} · 0 là bội của ${b}.`},{t:SET(Bs.concat([next])),err:`${next} không nhỏ hơn ${M}.`},{t:SET(Bs.slice(0,-1)),err:`Thiếu ${Bs[Bs.length-1]}.`},{t:SET(Bs.slice(1).concat([next])),err:'Bội bắt đầu từ 0 và phải nhỏ hơn số đã cho.'}];
  const o=pickOpts(SET(Bs),c);if(o.length<3)return null;
  return {stem:`Tập hợp các bội của ${b} nhỏ hơn ${M} là:`,opts:[{t:nb(SET(Bs))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`Nhân ${b} lần lượt với 0; 1; 2; …: các bội nhỏ hơn ${M} là ${SET(Bs)}.`};});}
function genBrange(){return tryGen(()=>{const b=ri(4,15),i=ri(2,6),j=i+ri(3,5),lo=b*i-(RNG()<.5?0:ri(1,b-1)),hi=b*j+(RNG()<.5?0:ri(1,b-1));
  const R=range(0,j+1).map(k=>b*k).filter(x=>x>lo&&x<hi),W=range(0,j+1).map(k=>b*k).filter(x=>x>=lo&&x<=hi);
  const c=[{t:SET(W),err:`x > ${lo} và x < ${hi} nên không lấy hai đầu mút.`},{t:SET(R.slice(1)),err:`Thiếu ${R[0]}.`},{t:SET(R.slice(0,-1)),err:`Thiếu ${R[R.length-1]}.`},{t:SET(R.concat([R[R.length-1]+b])),err:`${R[R.length-1]+b} không nhỏ hơn ${hi}.`}];
  const o=pickOpts(SET(R),c);if(o.length<3||!R.length)return null;
  return {stem:`Tập hợp các số tự nhiên x sao cho ${nb(`x ∈ ${BO(b)}`)} và ${lo} < x < ${hi} là:`,opts:[{t:nb(SET(R))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`Các bội của ${b} lớn hơn ${lo} và nhỏ hơn ${hi}: ${SET(R)}.`};});}
function genBnext(){return tryGen(()=>{const b=ri(6,19),x=b*ri(3,12)+ri(1,b-1),up=b*Math.ceil(x/b),dn=up-b;
  return mkMC(`Bội nhỏ nhất của ${b} mà lớn hơn ${x} là:`,''+up,[[''+dn,`${dn} < ${x}.`],[''+(x+1),`${why(x+1,b)}.`],[''+(up+b),`Còn ${up} nhỏ hơn mà vẫn lớn hơn ${x}.`]],`Các bội của ${b}: …; ${dn}; ${up}; … Bội nhỏ nhất lớn hơn ${x} là ${up}.`);});}
function genCountB2(){return tryGen(()=>{const three=RNG()<.35,b=three?ri(11,40):ri(3,9),lo=three?100:10,hi=three?999:99,c=fl(hi/b)-fl((lo-1)/b);
  return mkMC(`Có bao nhiêu số tự nhiên có ${three?'ba':'hai'} chữ số là bội của ${b}?`,''+c,[[''+fl(hi/b),`Đã đếm cả các bội nhỏ hơn ${lo} (không có ${three?'ba':'hai'} chữ số).`],[''+(fl(hi/b)+1),'Đã đếm cả số 0 và các bội quá ít chữ số.'],[''+(c-1),'Còn thiếu một số.'],[''+(c+1),'Đếm thừa một số.']].filter((z,i,A)=>z[0]!==''+c&&A.findIndex(w=>w[0]===z[0])===i).slice(0,3),`Bội nhỏ nhất có ${three?'ba':'hai'} chữ số: ${b*Math.ceil(lo/b)}; lớn nhất: ${b*fl(hi/b)}. Số các bội: ${fl(hi/b)} − ${fl((lo-1)/b)} = ${c}.`);});}
function genAge(){return tryGen(()=>{const y=ri(10,13),lo=ri(30,36),hi=lo+ri(8,12),R=range(1,10).map(k=>y*k).filter(v=>v>lo&&v<hi);if(R.length!==1)return null;const m=R[0];
  return mkMC(`Năm nay Bình ${y} tuổi. Tuổi của mẹ Bình là bội của tuổi Bình, lớn hơn ${lo} và nhỏ hơn ${hi}. Tuổi mẹ Bình năm nay là:`,''+m,[[''+(m-y),`${m-y} không lớn hơn ${lo}.`],[''+(m+y),`${m+y} không nhỏ hơn ${hi}.`],[''+(m+1),`${why(m+1,y)}.`]],`Bội của ${y}: …; ${m-y}; ${m}; ${m+y}; … Chỉ có ${m} nằm giữa ${lo} và ${hi}.`);});}
// tc: tính chất chia hết của một tổng
function multOf(m,lo,hi){return m*ri(Math.ceil(lo/m),fl(hi/m));}
function notOf(m,lo,hi){for(;;){const x=ri(lo,hi);if(x%m)return x;}}
function genSumWhich(){return tryGen(()=>{const m=ri(3,9),a=multOf(m,10,99),b=multOf(m,10,99),W=[];
  for(let k=0;k<3;k++){const p=multOf(m,10,99),q=notOf(m,10,99);W.push(RNG()<.5?[p,q]:[q,p]);}
  return mkMC(`Không thực hiện phép tính, cho biết tổng nào sau đây chia hết cho ${m}?`,`${a} + ${b}`,W.map(([p,q])=>[`${p} + ${q}`,`${p%m?nd(p,m):dv(p,m)} và ${q%m?nd(q,m):dv(q,m)} nên (${p} + ${q}) ${ND} ${m}.`]),`${dv(a,m)} và ${dv(b,m)} nên (${a} + ${b}) ${DV} ${m}.`);});}
function genProd(){return tryGen(()=>{const m=ri(3,9),a=ri(101,399),c=notOf(m,2,40),d=multOf(m,6,60);const good=RNG()<.5;
  const st=good?`${a} · ${m} + ${d}`:`${a} · ${m} + ${c}`;const r=(good?d:c)%m===0;
  return mkMC(`Không thực hiện phép tính, biểu thức ${st} có chia hết cho ${m} không?`,r?`Có, vì ${a} · ${m} ${DV} ${m} và ${good?d:c} ${DV} ${m}`:`Không, vì ${a} · ${m} ${DV} ${m} và ${c} ${ND} ${m}`,
    [[r?`Không, vì ${a} ${ND} ${m}`:`Có, vì ${a} · ${m} ${DV} ${m}`,r?`Tích ${a} · ${m} có thừa số ${m} nên chia hết cho ${m}.`:`Còn số hạng ${c} không chia hết cho ${m}.`],
     [`Không, vì ${a} · ${m} ${ND} ${m}`,`Tích có một thừa số chia hết cho ${m} thì tích chia hết cho ${m}.`],
     [`Không xác định được nếu chưa tính`,'Dùng tính chất chia hết của một tổng, không cần tính.']],`${a} · ${m} ${DV} ${m}; ${rel(good?d:c,m)} nên (${st}) ${r?DV:ND} ${m}.`);});}
function genReason(){return tryGen(()=>{const m=ri(3,9),diff=RNG()<.35;let T,s,allD,bad;
  if(diff){const a=multOf(m,60,150),b=RNG()<.5?multOf(m,10,55):notOf(m,10,55);T=[a,b];s=`${a} − ${b}`;allD=b%m===0;bad=b;}
  else{T=[multOf(m,10,99),multOf(m,10,99),multOf(m,10,99)];allD=RNG()<.5;if(!allD){const i=ri(0,2);T[i]=notOf(m,10,99);bad=T[i];}s=T.join(' + ');}
  if(new Set(T).size<T.length)return null;const lab=diff?'hiệu':'tổng',other=T.find(x=>x%m===0&&x!==bad)||T[0];
  const OK=diff?`A ${DV} ${m} vì ${T[0]} và ${T[1]} đều chia hết cho ${m}`:`A ${DV} ${m} vì mọi số hạng đều chia hết cho ${m}`,NO=x=>`A ${ND} ${m} vì chỉ có ${x} không chia hết cho ${m}`;
  const right=allD?OK:NO(bad),wr=allD?[[NO(T[1]),`${dv(T[1],m)}.`]]:[[OK,`${why(bad,m)}.`]];
  wr.push([`A ${DV} ${m} vì A > ${m}`,`Lớn hơn ${m} chưa chắc chia hết cho ${m}.`],['Không kết luận được khi chưa tính A','Dùng tính chất chia hết của một '+lab+', không cần tính.']);
  return mkMC(`Cho A = ${s}. Không thực hiện phép tính, khẳng định nào sau đây đúng?`,right,wr,T.map(x=>rel(x,m)).join(', ')+` nên A ${allD?DV:ND} ${m}.`);});}
function genX(){return tryGen(()=>{const m=ri(3,9),a=multOf(m,10,99),b=multOf(m,10,99),x=multOf(m,10,99),W=[];
  for(let n=0;n<30&&W.length<3;n++){const w=notOf(m,10,99);if(!W.includes(w))W.push(w);}
  return mkMC(`Cho A = ${a} + ${b} + x. Để A chia hết cho ${m} thì x có thể là:`,''+x,W.map(w=>[''+w,`${dv(a,m)}, ${dv(b,m)} nhưng ${nd(w,m)} nên A ${ND} ${m}.`]),`${dv(a,m)}, ${dv(b,m)} nên A ${DV} ${m} khi ${dv(x,m)}.`);});}
function genXset(){return tryGen(()=>{const m=sel([4,5,6,7,8,9]),c=multOf(m,15,60),neg=RNG()<.5,S=[];
  const good=multOf(m,5,60);S.push(good);while(S.length<4){const w=notOf(m,1,60);if(!S.includes(w))S.push(w);}
  let right,wr;
  if(!neg){right=''+good;wr=S.slice(1).map(w=>[''+w,`${dv(c,m)} và ${nd(w,m)} nên tổng ${ND} ${m}.`]);}
  else{const W=S.slice(1);right=SET(W.slice().sort((p,q)=>p-q));wr=[[''+good,`${dv(good,m)} nên tổng chia hết cho ${m}.`],[SET(S.slice().sort((p,q)=>p-q)),`Bỏ ${good} vì ${dv(good,m)}.`],[SET(W.slice(0,2).sort((p,q)=>p-q)),`Thiếu ${W[2]}.`]];}
  const Ss=SET(shuffle(S));
  return mkMC(neg?`Tập hợp các số x thuộc tập ${Ss} sao cho tổng ${c} + x không chia hết cho ${m} là:`:`Tìm x thuộc tập ${Ss}, biết tổng ${c} + x chia hết cho ${m}.`,right,wr,`${dv(c,m)} nên (${c} + x) ${DV} ${m} khi và chỉ khi ${'x ⋮ '+m}. Trong tập đã cho chỉ có ${dv(good,m)}.`);});}
function genX2(){return tryGen(()=>{const m=ri(4,9),a=multOf(m,10,99),b=notOf(m,10,99),r=b%m,W=[];let x=(m-r)%m+m*ri(0,4);if(x===0)return null;
  W.push([''+multOf(m,10,60),`x ${DV} ${m} nhưng ${nd(b,m)} nên A ${ND} ${m}.`]);
  for(let n=0;n<40&&W.length<3;n++){const w=ri(1,50);if((b+w)%m&&!W.some(z=>z[0]===''+w)&&w!==x)W.push([''+w,`${b} + ${w} = ${b+w}, ${nd(b+w,m)} nên A ${ND} ${m}.`]);}
  return mkMC(`Cho A = ${a} + ${b} + x. Số x nào sau đây làm cho A chia hết cho ${m}?`,''+x,W,`${dv(a,m)} nên cần (${b} + x) ${DV} ${m}. Với x = ${x}: ${b} + ${x} = ${b+x} = ${m} · ${(b+x)/m}.`);});}
function genTwoNot(){return tryGen(()=>{const m=ri(3,9);
  return mkMC(`Hai số tự nhiên a và b đều không chia hết cho ${m}. Khẳng định nào sau đây đúng?`,`Tổng a + b có thể chia hết cho ${m}, cũng có thể không`,
    [[`Tổng a + b luôn không chia hết cho ${m}`,`Ví dụ 1 + ${m-1} = ${m} ${DV} ${m}.`],[`Tổng a + b luôn chia hết cho ${m}`,`Ví dụ 1 + 1 = 2 ${ND} ${m}.`],[`Tổng a + b luôn chia hết cho ${m+1}`,`Ví dụ 1 + 1 = 2 ${ND} ${m+1}.`]],
    `Tính chất 2 chỉ dùng được khi chỉ có một số hạng không chia hết. Ví dụ 1 + ${m-1} = ${m} chia hết cho ${m}, còn 1 + 1 = 2 thì không.`);});}
function genWho(){return tryGen(()=>{const m=ri(3,9),a=notOf(m,11,90),r=a%m;let b=0;for(let k=0;k<50;k++){const c=m*ri(2,10)+(m-r);if(c!==a){b=c;break;}}const X=sel(NAMES);
  return mkMC(`Bạn ${X} nói: “Vì ${nd(a,m)} và ${nd(b,m)} nên (${a} + ${b}) ${ND} ${m}.” Nhận xét nào đúng?`,`${X} sai vì ${a} + ${b} = ${a+b} ${DV} ${m}`,
    [[`${X} đúng theo tính chất chia hết của một tổng`,'Tính chất 2 chỉ đúng khi có đúng một số hạng không chia hết.'],[`${X} đúng vì ${a+b} ${ND} ${m}`,`${a+b} = ${m} · ${(a+b)/m}.`],[`${X} sai vì ${dv(a,m)}`,`${why(a,m)}.`]],
    `${a} + ${b} = ${a+b} = ${m} · ${(a+b)/m} nên tổng chia hết cho ${m}. Hai số hạng không chia hết thì chưa kết luận được.`);});}
function genRem(){return tryGen(()=>{const m=ri(4,9),r1=ri(1,m-1),hit=RNG()<.5,r2=hit?m-r1:ri(1,m-1);if(!hit&&r1+r2===m)return null;const s=r1+r2,rs=s%m;
  const right=rs===0?`(a + b) ${DV} ${m}`:`(a + b) chia cho ${m} dư ${rs}`;
  const W=[[`(a + b) chia cho ${m} dư ${s}`,`Số dư phải nhỏ hơn ${m}.`],[rs===0?`(a + b) ${ND} ${m}`:`(a + b) ${DV} ${m}`,`a + b = ${m}k + ${m}q + ${s}${rs===0?` = ${m}(k + q + 1)`:''}.`],['Không kết luận được vì chưa biết a và b',`Viết a = ${m}k + ${r1}, b = ${m}q + ${r2}.`],[`(a + b) chia cho ${m} dư ${Math.abs(r1-r2)||m-1}`,'Các số dư được cộng lại, không trừ.']].filter(z=>z[0]!==right);
  return mkMC(`Số tự nhiên a chia cho ${m} dư ${r1}, số tự nhiên b chia cho ${m} dư ${r2}. Khẳng định nào sau đây đúng?`,right,W.slice(0,3),`a = ${m}k + ${r1}, b = ${m}q + ${r2} nên a + b = ${m}(k + q) + ${s}${rs===0?` = ${m}(k + q + 1) chia hết cho ${m}`:`, chia cho ${m} dư ${rs}`}.`);});}

const MC=[];
const addMC=(id,topic,level,gen,mix)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},mix?{mix}:{}));
addMC('m_divt_a','ch','NB',genDivTrue);addMC('m_divt_b','ch','NB',genDivTrue);addMC('m_ndt_a','ch','NB',genNotTrue);
addMC('m_word_a','ch','NB',genWord);addMC('m_word_b','ch','NB',genWord);addMC('m_def_a','ch','NB',genDef);addMC('m_fill_a','ch','TH',genFill);
const gUs=genUset('s'),gUr=genUset('r'),gDs=genIsDiv('s'),gDr=genIsDiv('r'),gMs=genIsMult('s'),gMr=genIsMult('r');
addMC('m_us_a','uoc','NB',gUs);addMC('m_us_b','uoc','NB',gUs);addMC('m_ds_a','uoc','NB',gDs);
addMC('m_ur_a','uoc','TH',gUr);addMC('m_dr_a','uoc','TH',gDr);addMC('m_cu_a','uoc','TH',genCountU);
addMC('m_ugt_a','uoc','VD',genUgt);addMC('m_bu_a','uoc','VD',genBU);addMC('m_grp_a','uoc','VD',genGroup);addMC('m_grp_b','uoc','VD',genGroup);
addMC('m_bs_a','boi','NB',genBset);addMC('m_bs_b','boi','NB',genBset);addMC('m_w0_a','boi','NB',genWhich0);addMC('m_ms_a','boi','NB',gMs);
addMC('m_mr_a','boi','TH',gMr);addMC('m_br_a','boi','TH',genBrange);addMC('m_bn_a','boi','TH',genBnext);
addMC('m_cb_a','boi','VD',genCountB2);addMC('m_cb_b','boi','VD',genCountB2);addMC('m_age_a','boi','VD',genAge);
addMC('m_sw_a','tc','NB',genSumWhich);addMC('m_sw_b','tc','NB',genSumWhich);addMC('m_rs_a','tc','TH',genReason);addMC('m_rs_b','tc','TH',genReason);
addMC('m_x_a','tc','TH',genX);addMC('m_xs_a','tc','TH',genXset);addMC('m_pr_a','tc','TH',genProd);
addMC('m_x2_a','tc','VD',genX2);addMC('m_two_a','tc','VD',genTwoNot);addMC('m_who_a','tc','VD',genWho);addMC('m_rem_a','tc','VD',genRem);

/* ============ Câu đúng sai ============ */
function tfStatic(pool,stem){return ()=>{const items=mixed(()=>shuffle(pool).slice(0,4).map(p=>sel(p)));return {stem,items:wrap(items)};};}
const POOL_A=[
  [IT('Nếu a ⋮ b thì a là bội của b và b là ước của a.',true,'ch','NB','Theo định nghĩa ước và bội.'),IT('Nếu a ⋮ b thì a là ước của b.',false,'ch','NB','a ⋮ b thì a là bội của b, b là ước của a.')],
  [IT('Cho a, b là số tự nhiên, b ≠ 0. Nếu có số tự nhiên k sao cho a = kb thì a ⋮ b.',true,'ch','NB','Định nghĩa trong SGK.'),IT('Nếu phép chia a cho b có số dư khác 0 thì a ⋮ b.',false,'ch','NB','Còn dư thì a ⋮̸ b.')],
  [IT('Số 0 là bội của mọi số tự nhiên khác 0.',true,'boi','NB','0 = b · 0.'),IT('Số 0 là ước của mọi số tự nhiên.',false,'uoc','NB','Không có phép chia cho 0, nên 0 không là ước của số nào.')],
  [IT('Số 1 là ước của mọi số tự nhiên.',true,'uoc','NB','a = 1 · a.'),IT('Số 1 là bội của mọi số tự nhiên khác 0.',false,'boi','NB','1 ⋮̸ 2 nên 1 không là bội của 2.')],
  [IT('Mỗi số tự nhiên a lớn hơn 1 có ít nhất hai ước là 1 và a.',true,'uoc','NB','a = 1 · a.'),IT('Mỗi số tự nhiên a lớn hơn 1 có đúng hai ước là 1 và a.',false,'uoc','NB','Ví dụ Ư(6) = {1; 2; 3; 6} có bốn ước.')],
  [IT('Tập hợp các bội của một số tự nhiên khác 0 có vô số phần tử.',true,'boi','NB','Nhân số đó với 0; 1; 2; 3; … mãi được.'),IT('Tập hợp các ước của một số tự nhiên khác 0 có vô số phần tử.',false,'uoc','NB','Các ước của a không vượt quá a.')],
  [IT('Nếu a ⋮ m và b ⋮ m thì (a + b) ⋮ m.',true,'tc','NB','Tính chất 1.'),IT('Nếu a ⋮̸ m và b ⋮̸ m thì (a + b) ⋮̸ m.',false,'tc','NB','Ví dụ 1 + 2 = 3 ⋮ 3 dù 1 và 2 đều không chia hết cho 3.')],
  [IT('Nếu a ⋮ m và b ⋮̸ m thì (a + b) ⋮̸ m.',true,'tc','NB','Tính chất 2.'),IT('Nếu a ⋮ m và b ⋮̸ m thì (a + b) ⋮ m.',false,'tc','NB','Tính chất 2: (a + b) ⋮̸ m.')]];
function tfDivNum(){const items=mixed(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){const b=ri(3,12),a=RNG()<.5?b*ri(3,15):b*ri(3,15)+ri(1,b-1);if(used.has(a+'/'+b))return null;used.add(a+'/'+b);const claimDiv=RNG()<.5,v=claimDiv===(a%b===0);o.push(IT(claimDiv?dv(a,b):nd(a,b),v,'ch','NB',`${why(a,b)}.`));}return o;});return {stem:'Xét các khẳng định sau:',items:wrap(items)};}
function tfMember(){const items=mixed(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){let t,v,e,tp;if(RNG()<.5){const b=ri(3,12),x=RNG()<.5?b*ri(2,12):b*ri(2,12)+ri(1,b-1);v=x%b===0;t=`${x} ∈ ${BO(b)}`;e=`${why(x,b)}.`;tp='boi';}else{const n=sel(SMALL),d=RNG()<.5?sel(divs(n)):nonDiv(n,2,n-1)||n+1;v=n%d===0;t=`${d} ∈ ${UO(n)}`;e=`${why(n,d)}.`;tp='uoc';}if(used.has(t))return null;used.add(t);o.push(IT(t,v,tp,'NB',e));}return o;});return {stem:'Xét các khẳng định sau:',items:wrap(items)};}
function tfU(){const n=sel(RICH.filter(x=>nDiv(x)>=6)),D=divs(n),c=D.length,big=D[D.length-2];
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`${UO(n)} có ${v?c:c-2} phần tử.`,v,'uoc','TH',`${UO(n)} = ${SET(D)}, có ${c} phần tử.`));}
    {const v=R(),d=v?sel(D.slice(1,-1)):nonDiv(n,2,n-1);o.push(IT(`${d} ∈ ${UO(n)}`,v,'uoc','TH',`${why(n,d)}.`));}
    {const v=R(),drop=sel(D.slice(1,-1));o.push(IT(`${UO(n)} = ${SET(v?D:D.filter(x=>x!==drop))}`,v,'uoc','TH',`Còn có ${drop} vì ${n} = ${drop} · ${n/drop}.`));}
    {const v=R();o.push(IT(`Ước lớn nhất của ${n} khác ${n} là ${v?big:n/3===fl(n/3)&&n/3!==big?n/3:big-1}.`,v,'uoc','TH',`Các ước của ${n} xếp tăng dần: ${SET(D)}; ước liền trước ${n} là ${big}.`));}
    return o;});return {stem:`Cho số ${n}. Xét các khẳng định sau:`,items:wrap(items)};}
function tfB(){const b=ri(3,12),j=ri(4,7),M=b*j,Bs=range(0,j-1).map(i=>b*i),x=ri(20,90);
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R(),y=v?b*ri(5,15):b*ri(5,15)+ri(1,b-1);o.push(IT(`${y} ∈ ${BO(b)}`,v,'boi','TH',`${why(y,b)}.`));}
    {const v=R();o.push(IT(`Các bội của ${b} nhỏ hơn ${M} là ${L(v?Bs:Bs.slice(1))}.`,v,'boi','TH',`Kể cả 0: ${L(Bs)}.`));}
    {const v=R();o.push(IT(`Có ${v?j:j+1} bội của ${b} nhỏ hơn ${M}.`,v,'boi','TH',`${L(Bs)}: có ${j} số (${M} không nhỏ hơn ${M}).`));}
    {const v=R(),up=b*(fl(x/b)+1);o.push(IT(`Bội nhỏ nhất của ${b} lớn hơn ${x} là ${v?up:up+b}.`,v,'boi','TH',`Bội nhỏ nhất của ${b} lớn hơn ${x} là ${up}.`));}
    return o;});return {stem:`Xét các khẳng định về bội của ${b}:`,items:wrap(items)};}
function sumItem(m,level){const k=ri(0,2);let T,s;
  if(k===0){T=[multOf(m,10,99),RNG()<.5?multOf(m,10,99):notOf(m,10,99)];s=`(${T[0]} + ${T[1]})`;}
  else if(k===1){T=[multOf(m,10,99),multOf(m,10,99),RNG()<.5?multOf(m,10,99):notOf(m,10,99)];T=shuffle(T);s=`(${T.join(' + ')})`;}
  else{T=[multOf(m,60,150),RNG()<.5?multOf(m,10,55):notOf(m,10,55)];s=`(${T[0]} − ${T[1]})`;}
  const isD=T.every(x=>x%m===0),claimD=RNG()<.5,v=claimD===isD;
  return IT(`${s} ${claimD?DV:ND} ${m}`,v,'tc',level,T.map(x=>rel(x,m)).join(', ')+` nên ${s} ${isD?DV:ND} ${m}.`);}
function tfSum(){const items=mixed(()=>{const o=[];for(let i=0;i<4;i++)o.push(sumItem(ri(3,9),'TH'));return o;});return {stem:'Không thực hiện phép tính, xét các khẳng định sau:',items:wrap(items)};}
function tfLetters(){const m=ri(3,9),a=multOf(m,10,99),b=multOf(m,10,99),k=multOf(m,10,60),w=notOf(m,10,60);
  const P=[
    [IT(`Nếu x ${DV} ${m} thì A ${DV} ${m}.`,true,'tc','VD','Tính chất 1: ba số hạng đều chia hết.'),IT(`A ${DV} ${m} với mọi số tự nhiên x.`,false,'tc','VD',`Với x = ${w}: ${nd(w,m)} nên A ${ND} ${m}.`)],
    [IT(`Với x = ${w} thì A ${ND} ${m}.`,true,'tc','VD',`${nd(w,m)}, hai số hạng kia chia hết nên A ${ND} ${m}.`),IT(`Với x = ${w} thì A ${DV} ${m}.`,false,'tc','VD',`${nd(w,m)} nên A ${ND} ${m}.`)],
    [IT(`Với x = ${k} thì A ${DV} ${m}.`,true,'tc','VD',`${dv(k,m)} nên A ${DV} ${m}.`),IT(`Với x = ${k} thì A ${ND} ${m}.`,false,'tc','VD',`${dv(k,m)} nên A ${DV} ${m}.`)],
    [IT(`Nếu A ${DV} ${m} thì x ${DV} ${m}.`,true,'tc','VD',`Nếu x ${ND} ${m} thì A ${ND} ${m} (tính chất 2), nên A ${DV} ${m} buộc x ${DV} ${m}.`),IT(`Nếu A ${ND} ${m} thì x ${DV} ${m}.`,false,'tc','VD',`Nếu x ${DV} ${m} thì A ${DV} ${m}, nên A ${ND} ${m} thì x ${ND} ${m}.`)]];
  const items=mixed(()=>P.map(p=>sel(p)));return {stem:`Cho A = ${a} + ${b} + x với x là số tự nhiên. Xét các khẳng định sau:`,items:wrap(items)};}
function tfRows(){const n=sel([24,30,36,40,42,48,54,60]),D=divs(n).filter(d=>d>1&&d<n),c=D.length,h=nonDiv(n,5,12),add=h-n%h;
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R(),d=v?sel(D):nonDiv(n,3,12);o.push(IT(`Có thể xếp thành ${d} hàng.`,v,'uoc','VD',`Số hàng phải là ước của ${n}: ${why(n,d)}.`));}
    {const v=R();o.push(IT(`Có tất cả ${v?c:c+2} cách xếp.`,v,'uoc','VD',`Số hàng là ước của ${n}, khác 1 và ${n}: ${SET(D)}, có ${c} cách.`));}
    {const v=R();o.push(IT(`Nếu mỗi hàng có ${h} bạn thì cần thêm ít nhất ${v?add:(n%h===add?add+1:n%h)} bạn để không hàng nào thiếu.`,v,'boi','VD',`${n} = ${h} · ${fl(n/h)} + ${n%h}; bội nhỏ nhất của ${h} lớn hơn ${n} là ${n+add}, cần thêm ${add} bạn.`));}
    {const v=R(),m=sel(D.filter(d=>d<=n/2));o.push(IT(v?`Nếu mỗi hàng có ${m} bạn thì xếp được ${n/m} hàng.`:`Nếu mỗi hàng có ${m} bạn thì xếp được ${n/m+1} hàng.`,v,'ch','VD',`${n} : ${m} = ${n/m}.`));}
    return o;});
  return {stem:`Khối 6 có ${n} bạn tham gia đồng diễn, xếp thành các hàng có số bạn bằng nhau (nhiều hơn một hàng, mỗi hàng nhiều hơn một bạn). Xét các phát biểu sau:`,items:wrap(items)};}
function tfEggs(){for(;;){const m=sel([6,10,12]),a=m*ri(20,40),b=notOf(m,100,260),r=(a+b)%m;
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`Trứng thu ngày thứ nhất xếp vừa đủ vào ${v?a/m:a/m+1} khay.`,v,'ch','VD',`${a} : ${m} = ${a/m}.`));}
    {const v=R();o.push(IT(v?`Trứng thu ngày thứ hai không xếp vừa đủ các khay.`:`Trứng thu ngày thứ hai xếp vừa đủ các khay.`,v,'ch','VD',`${why(b,m)}.`));}
    {const v=R();o.push(IT(v?`Gộp trứng cả hai ngày thì không xếp vừa đủ các khay.`:`Gộp trứng cả hai ngày thì xếp vừa đủ các khay.`,v,'tc','VD',`${dv(a,m)} và ${nd(b,m)} nên (${a} + ${b}) ${ND} ${m}.`));}
    {const v=R();o.push(IT(`Gộp trứng cả hai ngày thì sau khi xếp còn thừa ${v?r:(r+1<m?r+1:r-1)} quả.`,v,'tc','VD',`${a} + ${b} = ${a+b} = ${m} · ${fl((a+b)/m)} + ${r}.`));}
    return o;});
  if(items)return {stem:`Một trang trại thu được ${a} quả trứng vào ngày thứ nhất và ${b} quả vào ngày thứ hai. Trứng được xếp vào các khay, mỗi khay ${m} quả. Xét các phát biểu sau:`,items:wrap(items)};}}
function tfBus(){const b=sel([8,9,12,15,18,20]),t=nonDiv(b*100,7,55)||7;let tt=t;while(tt%b===0)tt++;const wait=b-tt%b,c=fl(59/b)+1,k=ri(2,fl(59/b));
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(v?`Số phút kể từ 6 giờ đến lúc mỗi chuyến xuất bến là một bội của ${b}.`:`Số phút kể từ 6 giờ đến lúc mỗi chuyến xuất bến là một ước của ${b}.`,v,'boi','VD',`Các chuyến xuất bến sau 0; ${b}; ${2*b}; … phút: đó là các bội của ${b}.`));}
    {const v=R(),mm=v?b*k:b*k+1;o.push(IT(`Có một chuyến xuất bến lúc 6 giờ ${mm} phút.`,v,'boi','VD',`${why(mm,b)}.`));}
    {const v=R();o.push(IT(`Từ 6 giờ đến trước 7 giờ có ${v?c:c-1} chuyến xuất bến.`,v,'boi','VD',`Các bội của ${b} nhỏ hơn 60: ${L(range(0,c-1).map(i=>i*b))}, có ${c} số.`));}
    {const v=R();o.push(IT(`Bạn An ra bến lúc 6 giờ ${tt} phút thì phải chờ ${v?wait:(tt%b===wait?wait+1:tt%b)} phút mới có xe.`,v,'boi','VD',`Bội nhỏ nhất của ${b} không nhỏ hơn ${tt} là ${tt+wait}, chờ ${wait} phút.`));}
    return o;});
  return {stem:`Một tuyến xe buýt có chuyến đầu tiên xuất bến lúc 6 giờ, sau đó cứ ${b} phút lại có một chuyến. Xét các phát biểu sau:`,items:wrap(items)};}
const TF=[];
const addTF=(id,topic,level,gen,mix)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},mix?{mix}:{}));
addTF('t_pool_a','ch','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));addTF('t_pool_b','uoc','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));addTF('t_pool_c','tc','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));
addTF('t_num_a','ch','NB',tfDivNum);addTF('t_num_b','ch','NB',tfDivNum);addTF('t_mem_a','boi','NB',tfMember);
addTF('t_u_a','uoc','TH',tfU);addTF('t_u_b','uoc','TH',tfU);addTF('t_b_a','boi','TH',tfB);addTF('t_b_b','boi','TH',tfB);addTF('t_s_a','tc','TH',tfSum);addTF('t_s_b','tc','TH',tfSum);
addTF('t_let_a','tc','VD',tfLetters);addTF('t_row_a','uoc','VD',tfRows);addTF('t_egg_a','tc','VD',tfEggs);addTF('t_bus_a','boi','VD',tfBus);

/* ============ Câu trả lời ngắn ============ */
const SA=[
 {id:'s_k_nb',topic:'ch',level:'NB',unit:'',gen:()=>{const b=ri(3,15),k=ri(3,25),a=b*k;return{stem:`Tìm số tự nhiên k sao cho ${F(a)} = k · ${b}.`,ans:[k],exp:`k = ${F(a)} : ${b} = ${k}.`};}},
 {id:'s_cnt_th',topic:'ch',level:'TH',unit:'số',gen:()=>{const m=ri(3,9),L0=[multOf(m,10,99)];while(L0.length<7){const x=ri(10,99);if(!L0.includes(x))L0.push(x);}const L1=shuffle(L0),c=L1.filter(x=>x%m===0).length;return{stem:`Trong các số ${L(L1)}, có bao nhiêu số chia hết cho ${m}?`,ans:[c],exp:L1.map(x=>rel(x,m)).join('; ')+`. Có ${c} số.`};}},
 {id:'s_u_nb',topic:'uoc',level:'NB',unit:'ước',gen:()=>{const n=sel(SMALL);return{stem:`Số ${n} có bao nhiêu ước?`,ans:[nDiv(n)],exp:`${UO(n)} = ${SET(divs(n))}.`};}},
 {id:'s_u_nb2',topic:'uoc',level:'NB',unit:'',gen:()=>{const n=sel(SMALL.filter(x=>nDiv(x)>2)),D=divs(n);return{stem:`Tìm ước lớn nhất của ${n} mà khác ${n}.`,ans:[D[D.length-2]],exp:`${UO(n)} = ${SET(D)}.`};}},
 {id:'s_u_th',topic:'uoc',level:'TH',unit:'ước',gen:()=>{const n=sel(RICH);return{stem:`Số ${n} có bao nhiêu ước?`,ans:[nDiv(n)],exp:`${UO(n)} = ${SET(divs(n))}.`};}},
 {id:'s_u_th2',topic:'uoc',level:'TH',unit:'',gen:()=>{const n=sel(SMALL.concat([24,30,36,40]));return{stem:`Tính tổng tất cả các ước của ${n}.`,ans:[sum(divs(n))],exp:`${UO(n)} = ${SET(divs(n))}; tổng bằng ${sum(divs(n))}.`};}},
 {id:'s_u_vd',topic:'uoc',level:'VD',unit:'số',gen:()=>{const n=sel(RICH.filter(x=>nDiv(x)>=8)),D=divs(n),k=sel(D.filter(d=>d>2&&d<n/2)),R=D.filter(d=>d>k);return{stem:`Có bao nhiêu số tự nhiên y thoả mãn ${nb(`y ∈ ${UO(n)}`)} và y > ${k}?`,ans:[R.length],exp:`${UO(n)} = ${SET(D)}; các ước lớn hơn ${k}: ${SET(R)}.`};}},
 {id:'s_u_vd2',topic:'uoc',level:'VD',unit:'cách',gen:()=>{const n=sel([24,30,36,40,45,48,60,72]),lo=ri(2,3),hi=ri(8,10),D=divs(n).filter(d=>d>=lo&&d<=hi);return{stem:`Đội thể thao có ${n} vận động viên. Huấn luyện viên chia thành các nhóm có số người như nhau, mỗi nhóm có ít nhất ${lo} người và không quá ${hi} người. Có bao nhiêu cách chia?`,ans:[D.length],exp:`Số người mỗi nhóm là ước của ${n}, từ ${lo} đến ${hi}: ${SET(D)}.`};}},
 {id:'s_b_nb',topic:'boi',level:'NB',unit:'',gen:()=>{const b=ri(3,15),k=ri(2,9);return{stem:`Viết các bội của ${b}: 0; ${b}; ${2*b}; … Số đứng ngay sau ${b*k} là số nào?`,ans:[b*(k+1)],exp:`${b} · ${k+1} = ${b*(k+1)}.`};}},
 {id:'s_b_th',topic:'boi',level:'TH',unit:'số',gen:()=>{const b=ri(3,12),M=ri(30,99),c=fl((M-1)/b)+1;return{stem:`Có bao nhiêu bội của ${b} nhỏ hơn ${M}?`,ans:[c],exp:`Các bội nhỏ hơn ${M}: 0; ${b}; …; ${b*(c-1)}, có ${c} số (kể cả số 0).`};}},
 {id:'s_b_th2',topic:'boi',level:'TH',unit:'',gen:()=>{const b=ri(6,19),M=ri(100,400);const v=b*fl((M-1)/b);return{stem:`Tìm bội lớn nhất của ${b} mà nhỏ hơn ${M}.`,ans:[v],exp:`${why(M,b).replace(/ nên.*/,'')}; bội lớn nhất nhỏ hơn ${M} là ${v}.`};}},
 {id:'s_b_vd',topic:'boi',level:'VD',unit:'số',gen:()=>{const b=ri(3,9),c=fl(99/b)-fl(9/b);return{stem:`Có bao nhiêu số tự nhiên có hai chữ số là bội của ${b}?`,ans:[c],exp:`Từ ${b*Math.ceil(10/b)} đến ${b*fl(99/b)}: ${fl(99/b)} − ${fl(9/b)} = ${c} số.`};}},
 {id:'s_b_vd2',topic:'boi',level:'VD',unit:'chuyến',gen:()=>{const b=sel([6,8,10,12,15,20,24,30]),c=fl(120/b)+1;return{stem:`Một tuyến xe buýt có chuyến đầu xuất bến lúc 6 giờ, cứ ${b} phút có một chuyến. Từ 6 giờ đến 8 giờ (kể cả lúc 6 giờ và lúc 8 giờ) có bao nhiêu chuyến xuất bến?`,ans:[c],exp:`Các thời điểm (tính bằng phút sau 6 giờ) là các bội của ${b} từ 0 đến 120: có ${fl(120/b)} + 1 = ${c} chuyến.`};}},
 {id:'s_tc_nb',topic:'tc',level:'NB',unit:'',gen:()=>{const m=ri(3,9),a=multOf(m,10,99),b=multOf(m,10,99),c=multOf(m,10,99);return{stem:`Không thực hiện phép tính, cho biết ${a} + ${b} + ${c} chia cho ${m} có số dư bằng bao nhiêu?`,ans:[0],exp:`${dv(a,m)}, ${dv(b,m)}, ${dv(c,m)} nên tổng chia hết cho ${m}, số dư bằng 0.`};}},
 {id:'s_tc_th',topic:'tc',level:'TH',unit:'',gen:()=>{const m=ri(3,9),a=multOf(m,10,99),b=multOf(m,10,99),K=notOf(m,20,80),x=m*(fl(K/m)+1);return{stem:`Cho A = ${a} + ${b} + x. Tìm số tự nhiên x nhỏ nhất lớn hơn ${K} để A chia hết cho ${m}.`,ans:[x],exp:`${dv(a,m)}, ${dv(b,m)} nên cần x ${DV} ${m}; bội nhỏ nhất của ${m} lớn hơn ${K} là ${x}.`};}},
 {id:'s_tc_th2',topic:'tc',level:'TH',unit:'số',gen:()=>{const m=ri(3,9),a=multOf(m,10,99),b=multOf(m,10,99),S=[multOf(m,5,80)];while(S.length<6){const x=ri(5,80);if(!S.includes(x))S.push(x);}const S1=shuffle(S),c=S1.filter(x=>x%m===0).length;return{stem:`Cho A = ${a} + ${b} + x, với x thuộc tập ${SET(S1)}. Có bao nhiêu giá trị của x để A chia hết cho ${m}?`,ans:[c],exp:`${dv(a,m)}, ${dv(b,m)} nên A ${DV} ${m} khi x ${DV} ${m}: `+S1.map(x=>rel(x,m)).join('; ')+`. Có ${c} giá trị.`};}},
 {id:'s_tc_vd',topic:'tc',level:'VD',unit:'',gen:()=>{const m=ri(4,9),a=multOf(m,10,99),b=notOf(m,10,99),x=m-b%m;return{stem:`Cho A = ${a} + ${b} + x. Tìm số tự nhiên x nhỏ nhất để A chia hết cho ${m}.`,ans:[x],exp:`${dv(a,m)} nên cần (${b} + x) ${DV} ${m}. ${b} = ${m} · ${fl(b/m)} + ${b%m}, nên x nhỏ nhất là ${m} − ${b%m} = ${x}.`};}},
 {id:'s_tc_vd2',topic:'tc',level:'VD',unit:'',gen:()=>{const m=ri(4,9),r1=ri(1,m-1),r2=ri(1,m-1);return{stem:`Số tự nhiên a chia cho ${m} dư ${r1}, số tự nhiên b chia cho ${m} dư ${r2}. Hỏi a + b chia cho ${m} dư bao nhiêu?`,ans:[(r1+r2)%m],exp:`a + b = ${m}(k + q) + ${r1+r2}${r1+r2>=m?` = ${m}(k + q + 1) + ${(r1+r2)%m}`:''}; số dư là ${(r1+r2)%m}.`};}},
 {id:'s_tc_vd3',topic:'tc',level:'VD',unit:'chiếc',gen:()=>{const m=sel([4,6,8,9,12]),a=m*ri(15,40),b=notOf(m,50,200),r=(a+b)%m;return{stem:`Tiệm bánh làm được ${a} chiếc bánh vào thứ Bảy và ${b} chiếc vào Chủ nhật. Gộp bánh hai ngày rồi đóng vào hộp, mỗi hộp ${m} chiếc. Còn thừa bao nhiêu chiếc bánh không đủ một hộp?`,ans:[r],exp:`${dv(a,m)}; ${b} = ${m} · ${fl(b/m)} + ${b%m} nên tổng chia cho ${m} dư ${r}.`};}}
].map(q=>Object.assign({type:'sa'},q));

/* ============ Chủ đề ============ */
const TOPICS={
  ch:{short:'Quan hệ chia hết',name:'Quan hệ chia hết',rule:'Cho hai số tự nhiên a và b (b ≠ 0). Nếu có số tự nhiên k sao cho a = kb thì a chia hết cho b, kí hiệu a ⋮ b; nếu a không chia hết cho b ta kí hiệu a ⋮̸ b. Khi a ⋮ b, ta nói b là ước của a và a là bội của b.',tip:'15 ⋮ 3 thì 3 là ước của 15, 15 là bội của 3 (đừng đổi chỗ ước và bội).'},
  uoc:{short:'Tìm ước',name:'Cách tìm ước',rule:'Muốn tìm các ước của a (a > 1), ta lần lượt chia a cho các số tự nhiên từ 1 đến a; a chia hết cho số nào thì số đó là ước của a. Ư(a) là tập hợp các ước của a.',tip:'Đừng quên ước 1 và chính số a: Ư(15) = {1; 3; 5; 15}.'},
  boi:{short:'Tìm bội',name:'Cách tìm bội',rule:'Ta tìm các bội của một số khác 0 bằng cách nhân số đó lần lượt với 0; 1; 2; 3; … B(b) là tập hợp các bội của b.',tip:'Số 0 là bội của mọi số khác 0: các bội của 6 nhỏ hơn 30 là 0; 6; 12; 18; 24.'},
  tc:{short:'Chia hết của một tổng',name:'Tính chất chia hết của một tổng',rule:'Tính chất 1: nếu tất cả các số hạng đều chia hết cho m thì tổng chia hết cho m. Tính chất 2: nếu chỉ có một số hạng không chia hết cho m, các số hạng còn lại đều chia hết cho m thì tổng không chia hết cho m. Hai tính chất cũng đúng với một hiệu.',tip:'Hai số hạng cùng không chia hết cho m thì chưa kết luận được: 1 + 2 = 3 ⋮ 3.'}
};
const TKEYS=['ch','uoc','boi','tc'];
const TDESC={ch:'Kí hiệu ⋮ và ⋮̸, ước và bội',uoc:'Tìm ước, viết tập hợp Ư(a)',boi:'Tìm bội, viết tập hợp B(b)',tc:'Xét tổng, hiệu chia hết mà không cần tính'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Dùng kí hiệu ⋮, ⋮̸; nhận ra ước, bội của số nhỏ; tổng các số đều chia hết.',TH:'Viết Ư(a), B(b), đếm ước và bội, dùng hai tính chất để xét tổng, hiệu.',VD:'Ước và bội có điều kiện, tìm x để tổng chia hết, bài toán chia nhóm, xếp hàng, đóng hộp.'};

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
function tfHard(){for(;;){const m=sel([3,4,5,6,7]);
  const P=[
    [IT(`Nếu (a + b) ${DV} ${m} và a ${DV} ${m} thì b ${DV} ${m}.`,true,'tc','VD',`b = (a + b) − a là hiệu của hai số chia hết cho ${m}.`),IT(`Nếu (a + b) ${DV} ${m} thì a ${DV} ${m} và b ${DV} ${m}.`,false,'tc','VD',`Ví dụ 1 + ${m-1} = ${m} ${DV} ${m} nhưng 1 ${ND} ${m}.`)],
    [IT('Nếu a ⋮ 6 thì a ⋮ 3.',true,'ch','VD','a = 6k = 3 · (2k).'),IT('Nếu a ⋮ 3 thì a ⋮ 6.',false,'ch','VD','9 ⋮ 3 nhưng 9 ⋮̸ 6.')],
    [IT('Tổng của ba số tự nhiên liên tiếp luôn chia hết cho 3.',true,'tc','VD','n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1).'),IT('Tổng của bốn số tự nhiên liên tiếp luôn chia hết cho 4.',false,'tc','VD','0 + 1 + 2 + 3 = 6 ⋮̸ 4.')],
    [IT(`Nếu a ${DV} ${m} thì 5a ${DV} ${m}.`,true,'ch','VD',`a = ${m}k thì 5a = ${m} · (5k).`),IT(`Nếu a ${DV} ${m} thì a ${DV} ${2*m}.`,false,'ch','VD',`Ví dụ a = ${m}: ${m} ${DV} ${m} nhưng ${m} ${ND} ${2*m}.`)],
    [IT('Tích của hai số tự nhiên liên tiếp luôn chia hết cho 2.',true,'ch','VD','Trong hai số liên tiếp có một số chia hết cho 2 nên tích chia hết cho 2.'),IT('Tổng của hai số tự nhiên liên tiếp luôn chia hết cho 2.',false,'tc','VD','1 + 2 = 3 ⋮̸ 2.')]];
  const its=wrap(shuffle(P).slice(0,4).map(p=>sel(p)));if(tfOK(its))return {stem:'Với a, b là các số tự nhiên, xét các khẳng định sau:',items:its};}}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'tc',level:'VD',gen:tfHard}],sa:[
 {id:'h_n1',topic:'tc',level:'VD',unit:'số',gen:()=>{const k=sel([12,18,20,24,28,30,36,40,42,45,48,60]),c=sel([1,2,3,5]);const st=c===1?`(n + ${k}) ${DV} n`:`(${c}n + ${k}) ${DV} n`;return{stem:`Có bao nhiêu số tự nhiên n khác 0 sao cho ${st}?`,ans:[nDiv(k)],exp:`${c===1?'n':c+'n'} ${DV} n nên ${st.replace(` ${DV} n`,'')} ${DV} n khi và chỉ khi ${k} ${DV} n, tức n ∈ ${UO(k)} = ${SET(divs(k))}: có ${nDiv(k)} số.`};}},
 {id:'h_n2',topic:'uoc',level:'VD',unit:'',gen:()=>{const k=sel([12,15,18,20,21,24,28,30,36]),D=divs(k),S=sum(D.map(d=>d-1));return{stem:`Tính tổng tất cả các số tự nhiên n sao cho ${k} ${DV} (n + 1).`,ans:[S],exp:`n + 1 ∈ ${UO(k)} = ${SET(D)} nên n ∈ ${SET(D.map(d=>d-1))}; tổng bằng ${S}.`};}},
 {id:'h_cnt',topic:'tc',level:'VD',unit:'số',gen:()=>{const m=ri(4,9),c=notOf(m,20,99),lo=ri(10,30),hi=lo+ri(30,60);let n=0;for(let x=lo;x<=hi;x++)if((c+x)%m===0)n++;return{stem:`Có bao nhiêu số tự nhiên x với ${lo} ≤ x ≤ ${hi} sao cho (${c} + x) ${DV} ${m}?`,ans:[n],exp:`${c} chia ${m} dư ${c%m} nên cần x chia ${m} dư ${(m-c%m)%m}. Đếm các số như vậy từ ${lo} đến ${hi}: có ${n} số.`};}},
 {id:'h_rem',topic:'tc',level:'VD',unit:'',gen:()=>{for(;;){const d=sel([3,4,5,6]),t=ri(2,5),M=d*t,r=ri(d,M-1);if(M>30)continue;return{stem:`Số tự nhiên a chia cho ${M} dư ${r}. Hỏi a chia cho ${d} dư bao nhiêu?`,ans:[r%d],exp:`a = ${M}q + ${r} = ${d} · (${t}q) + ${r}; ${dv(M,d)} và ${r} = ${d} · ${fl(r/d)} + ${r%d} nên a chia ${d} dư ${r%d}.`};}}},
 {id:'h_bu',topic:'uoc',level:'VD',unit:'',gen:()=>{for(;;){const a=sel([36,40,48,60,72,80,84,90,96,100]),b=sel([2,3,4,5,6]);const R=divs(a).filter(d=>d%b===0);if(R.length<3)continue;return{stem:`Tính tổng tất cả các số tự nhiên x vừa là bội của ${b}, vừa là ước của ${a}.`,ans:[sum(R)],exp:`Các ước của ${a} chia hết cho ${b}: ${SET(R)}; tổng bằng ${sum(R)}.`};}}},
 {id:'h_age',topic:'boi',level:'VD',unit:'tuổi',gen:()=>{for(;;){const y=ri(10,13),k=ri(3,4),mom=y*k,s=ri(2,9);if((mom+s)%(y+s)===0)continue;const R=range(1,10).map(i=>y*i).filter(v=>v>mom-y/2&&v<mom+y/2);if(R.length!==1)continue;return{stem:`Năm nay An ${y} tuổi, tuổi mẹ An là một bội của tuổi An và lớn hơn ${mom-ri(1,y-1)} nhưng nhỏ hơn ${mom+ri(1,y-1)}. Sau ${s} năm nữa, tổng số tuổi của hai mẹ con là bao nhiêu?`,ans:[mom+y+2*s],exp:`Tuổi mẹ là bội của ${y} nằm trong khoảng đã cho: ${mom}. Sau ${s} năm: (${mom} + ${s}) + (${y} + ${s}) = ${mom+y+2*s}.`};}}}
].map(q=>Object.assign({type:'sa'},q))};

const qsOK=u=>u.qs.every(q=>q.type!=='mc'||(q.opts.length===4&&new Set(q.opts.map(o=>o.t)).size===4));
const PISA=[
 ()=>{for(;;){const n=sel([36,48,60,72,84,90,96]),D=divs(n).filter(d=>d>=4&&d<=20);if(D.length<3)continue;const bad=nonDiv(n,5,19);if(!bad)continue;const ds=shuffle(D).slice(0,3),vals=shuffle(ds.concat([bad])),LET=['A','B','C','D'],X=LET[vals.indexOf(bad)],gi=vals.findIndex(v=>v!==bad),Y=LET[gi],vy=vals[gi];
   const lo=ri(4,6),hi=ri(10,16),cnt=divs(n).filter(d=>d>=lo&&d<=hi).length,add=bad-n%bad;
   const u={title:'Xếp ghế hội trường',ctx:`<p class="stem">Hội trường có ${n} chiếc ghế. Nhà trường muốn xếp hết số ghế thành các hàng, mỗi hàng có số ghế như nhau. Bảng sau là bốn phương án đề xuất.</p>${tbl(['Phương án','Số ghế mỗi hàng'],vals.map((v,i)=>[LET[i],v]))}`,qs:[
    mcq('Phương án nào không xếp được?',`Phương án ${X}`,LET.filter(l=>l!==X).map(l=>{const v=vals[LET.indexOf(l)];return [`Phương án ${l}`,`${dv(n,v)} nên xếp được ${n/v} hàng.`];}),`${why(n,bad)}, nên phương án ${X} không xếp được.`,'ch','NB'),
    saq(`Nếu chọn phương án ${Y} thì xếp được bao nhiêu hàng?`,n/vy,'hàng',`${n} : ${vy} = ${n/vy}.`,'ch','NB'),
    saq(`Có bao nhiêu cách xếp mà mỗi hàng có từ ${lo} đến ${hi} ghế?`,cnt,'cách',`Số ghế mỗi hàng là ước của ${n} từ ${lo} đến ${hi}: ${SET(divs(n).filter(d=>d>=lo&&d<=hi))}.`,'uoc','TH'),
    saq(`Muốn xếp theo phương án ${X} mà không hàng nào thiếu ghế, cần mang thêm ít nhất bao nhiêu chiếc ghế?`,add,'chiếc',`Số ghế cần là bội của ${bad}. Bội nhỏ nhất của ${bad} lớn hơn ${n} là ${n+add}, cần thêm ${add} chiếc.`,'boi','VD')]};if(qsOK(u)&&cnt>0)return u;}},
 ()=>{for(;;){const m=sel([4,6,8,9,12]),k1=ri(15,40),a1=m*k1,a2=notOf(m,60,250),r=(a1+a2)%m;
   const u={title:'Đóng hộp bánh',ctx:`<p class="stem">Một tiệm bánh đóng bánh vào hộp, mỗi hộp ${m} chiếc. Bảng sau ghi số bánh làm được trong hai ngày cuối tuần.</p>${tbl(['Ngày','Số bánh (chiếc)'],[['Thứ Bảy',a1],['Chủ nhật',a2]])}`,qs:[
    saq('Bánh làm ngày thứ Bảy đóng vừa đủ vào bao nhiêu hộp?',k1,'hộp',`${a1} : ${m} = ${k1}.`,'ch','NB'),
    mcq('Nếu gộp bánh của cả hai ngày rồi đóng hộp thì:',`Không đóng vừa hết vì ${dv(a1,m)} nhưng ${nd(a2,m)}`,[[`Đóng vừa hết vì ${dv(a1,m)}`,'Phải xét cả số bánh ngày Chủ nhật.'],[`Đóng vừa hết vì tổng số bánh lớn hơn ${m}`,'Lớn hơn chưa chắc chia hết.'],['Không biết được nếu chưa tính tổng','Dùng tính chất 2: chỉ một số hạng không chia hết thì tổng không chia hết.']],`${dv(a1,m)}, ${nd(a2,m)} nên (${a1} + ${a2}) ${ND} ${m}.`,'tc','TH'),
    saq('Gộp bánh hai ngày, sau khi đóng hộp còn thừa bao nhiêu chiếc?',r,'chiếc',`${a1} + ${a2} = ${a1+a2} = ${m} · ${fl((a1+a2)/m)} + ${r}.`,'tc','VD'),
    saq('Cần làm thêm ít nhất bao nhiêu chiếc bánh để đóng vừa hết các hộp?',m-r,'chiếc',`Còn thừa ${r} chiếc, cần thêm ${m} − ${r} = ${m-r} chiếc cho đủ một hộp nữa.`,'tc','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const b=sel([8,9,12,15,18,20]),k=ri(4,fl(150/b)),T=b*k;if(T<60)continue;const hm=x=>`${6+fl(x/60)} giờ ${String(x%60).padStart(2,'0')} phút`;const W=[];for(let n=0;n<40&&W.length<3;n++){const x=T+ri(-20,20);if(x%b&&x>0&&!W.includes(x))W.push(x);}if(W.length<3)continue;const t=notOf(b,61,119),wait=b-t%b;
   const u={title:'Giờ xe buýt',ctx:`<p class="stem">Một tuyến xe buýt có chuyến đầu tiên xuất bến lúc 6 giờ, sau đó cứ ${b} phút lại có một chuyến.</p>${tbl(['Chuyến','Giờ xuất bến'],[['Thứ nhất','6 giờ 00 phút'],['Thứ hai',hm(b)],['Thứ ba',hm(2*b)],['…','…']])}`,qs:[
    mcq('Số phút tính từ 6 giờ đến lúc một chuyến xe xuất bến luôn là:',`Một bội của ${b}`,[[`Một ước của ${b}`,`Các số phút là 0; ${b}; ${2*b}; … là bội của ${b}.`],[`Một số nhỏ hơn ${b}`,`Chuyến thứ hai đã là ${b} phút.`],['Một số tự nhiên bất kì',`Chỉ các bội của ${b}.`]],`Các chuyến xuất bến sau 0; ${b}; ${2*b}; … phút.`,'boi','NB'),
    mcq('Có một chuyến xe xuất bến vào lúc nào sau đây?',hm(T),W.map(x=>[hm(x),`Lúc này là ${x} phút sau 6 giờ, ${nd(x,b)}.`]),`${hm(T)} là ${T} phút sau 6 giờ, ${T} = ${b} · ${k}.`,'boi','TH'),
    saq('Từ 6 giờ đến 8 giờ (kể cả lúc 6 giờ và lúc 8 giờ) có bao nhiêu chuyến xuất bến?',fl(120/b)+1,'chuyến',`Các bội của ${b} từ 0 đến 120: có ${fl(120/b)} + 1 = ${fl(120/b)+1} số.`,'boi','VD'),
    saq(`Bạn Hà ra bến lúc ${hm(t)}. Hà phải chờ ít nhất bao nhiêu phút mới có xe?`,wait,'phút',`${t} phút sau 6 giờ; bội nhỏ nhất của ${b} không nhỏ hơn ${t} là ${t+wait}, chờ ${wait} phút.`,'boi','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const p=sel([4,5,6,7,8,9,12]),A=p*ri(8,20),r1=ri(1,p-1),B=p*ri(6,15)+r1,C=p*ri(6,15)+(p-r1);if(new Set([A,B,C]).size<3)continue;
   const u={title:'Mua bút',ctx:`<p class="stem">Mỗi chiếc bút giá ${p} nghìn đồng. Ba bạn mang tiền đi mua bút; bảng sau ghi số tiền mỗi bạn mang theo.</p>${tbl(['Bạn','Số tiền (nghìn đồng)'],[['An',A],['Bình',B],['Chi',C]])}`,qs:[
    mcq('Bạn nào có thể dùng hết số tiền của mình để mua bút mà không thừa?','An',[['Bình',`${why(B,p)}.`],['Chi',`${why(C,p)}.`],['Không bạn nào',`${dv(A,p)} nên An dùng hết tiền được.`]],`Chỉ có ${dv(A,p)}.`,'ch','NB'),
    saq('Bình mua được nhiều nhất bao nhiêu chiếc bút?',fl(B/p),'chiếc',`${B} = ${p} · ${fl(B/p)} + ${B%p}.`,'ch','TH'),
    mcq('Bình và Chi góp chung tiền để mua bút. Khẳng định nào đúng?',`Dùng hết tiền được vì ${B} + ${C} = ${B+C} ${DV} ${p}`,[[`Không dùng hết được vì cả ${B} và ${C} đều không chia hết cho ${p}`,'Hai số hạng không chia hết thì tổng vẫn có thể chia hết: phải tính tổng để kiểm tra.'],[`Dùng hết tiền được vì ${dv(B,p)}`,`${why(B,p)}.`],[`Không dùng hết được vì ${B+C} ${ND} ${p}`,`${B+C} = ${p} · ${(B+C)/p}.`]],`${B} + ${C} = ${B+C} = ${p} · ${(B+C)/p}.`,'tc','VD'),
    saq('Nếu cả ba bạn góp chung tiền thì mua được nhiều nhất bao nhiêu chiếc bút?',(A+B+C)/p,'chiếc',`${A} + ${B} + ${C} = ${A+B+C} = ${p} · ${(A+B+C)/p} (vì ${dv(A,p)} và ${dv(B+C,p)}).`,'tc','VD')]};if(qsOK(u))return u;}}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'ch',fig:'<div class="figbox"><p>15 ⋮ 3 vì 15 = 5 · 3; &nbsp; 16 ⋮̸ 3 vì 16 = 3 · 5 + 1</p><p>15 ⋮ 3: 3 là ước của 15, 15 là bội của 3</p></div>',extra:'a ⋮ b ⇔ có số tự nhiên k sao cho a = kb.'},
  {k:'uoc',fig:'<div class="figbox"><p>Chia 15 lần lượt cho 1; 2; …; 15:</p><p>Ư(15) = {1; 3; 5; 15}</p></div>',extra:'Luôn có 1 và chính số đó.'},
  {k:'boi',fig:'<div class="figbox"><p>Nhân 6 với 0; 1; 2; 3; …: 0; 6; 12; 18; 24; 30; …</p><p>Các bội của 6 nhỏ hơn 30: 0; 6; 12; 18; 24</p></div>',extra:'Số 0 là bội của mọi số khác 0.'},
  {k:'tc',fig:'<div class="figbox"><p>6 ⋮ 3, 15 ⋮ 3, 30 ⋮ 3 nên (6 + 15 + 30) ⋮ 3</p><p>5 ⋮ 5, 45 ⋮ 5, 2 019 ⋮̸ 5 nên (5 + 45 + 2 019) ⋮̸ 5</p></div>',extra:'Hai số hạng không chia hết thì chưa kết luận được.'}
];


/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='qh6_seen';
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
  const mcSlots=[['ch',['NB']],['uoc',['NB','TH']],['boi',['NB','TH']],['tc',['NB']],['tc',['TH']],[null,['VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['uoc','boi','tc'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=[
    pick(MC.filter(q=>q.topic==='ch'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='uoc'&&q.level!=='VD'),used),
    pick(MC.filter(q=>q.topic==='boi'&&q.level!=='VD'),used),
    pick(MC.filter(q=>q.topic==='tc'&&q.level==='TH'),used)
  ];
  const sa=[pick(SA.filter(q=>q.topic==='uoc'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='tc'&&q.level!=='VD'),used)];
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
