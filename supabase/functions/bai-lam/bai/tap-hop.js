// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ tap-hop/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "tap-hop";
export const TIEN_TO = "TH6-";

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

/* ============ Cách viết (theo SGK Toán 6 Kết nối tri thức, Bài 1) ============ */
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
const FB_MC=()=>({stem:'Kí hiệu "∈" được đọc là gì?',opts:[{t:'thuộc'},{t:'không thuộc',err:'"Không thuộc" là kí hiệu ∉.'},{t:'bằng',err:'"Bằng" là kí hiệu =.'},{t:'nhỏ hơn',err:'"Nhỏ hơn" là kí hiệu <.'}],ans:0,exp:'x ∈ A đọc là "x thuộc A".'});
function tryGen(f){
  for(let n=0;n<100;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>o.t)).size===4)return r;}
  return FB_MC();
}

/* ============ Chữ cái tiếng Việt trong một từ ============ */
// Bỏ dấu thanh (huyền, sắc, hỏi, ngã, nặng) nhưng giữ Ă, Â, Ê, Ô, Ơ, Ư, Đ vì đó là những chữ cái riêng.
const bareLetter=c=>c.normalize('NFD').replace(/[\u0300\u0301\u0303\u0309\u0323]/g,'').normalize('NFC');
function lettersOf(w){const out=[];for(const ch of w.replace(/\s+/g,'')){const b=bareLetter(ch);if(!out.includes(b))out.push(b);}return out;}
const plainLetter=c=>c.normalize('NFD').replace(/[\u0300-\u036f]/g,'').normalize('NFC').replace('Đ','D');
const WORDS=['NHA TRANG','HÀ NỘI','HỌC SINH','GIÁO VIÊN','TOÁN HỌC','KHAI GIẢNG','CẦN CÙ','SÔNG HỒNG','HẠ LONG','ĐÀ NẴNG','THƯ VIỆN','MÙA XUÂN','HÒA BÌNH','QUÊ HƯƠNG','TRƯỜNG HỌC','VIỆT NAM','BÌNH MINH','HIẾU HỌC','ĐIỆN BIÊN PHỦ','SÁCH GIÁO KHOA','CHĂM CHỈ','THẦY CÔ'];
const nLetters=w=>w.replace(/\s+/g,'').length;

/* ============ Hình: một vòng kín biểu diễn tập hợp ============ */
function vong(name,inside,outside){
  outside=outside||[];
  const pos=[[150,64],[208,56],[262,72],[118,100],[178,98],[236,106],[288,100],[160,130],[218,132]];
  let s=`<ellipse cx="200" cy="88" rx="135" ry="62" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
  s+=`<text class="pl" x="46" y="44">${name}</text><line class="ax" x1="62" y1="48" x2="84" y2="60"/>`;
  inside.forEach((v,i)=>{const [x,y]=pos[i];s+=`<circle class="pt" cx="${x}" cy="${y}" r="4"/><text class="tl" x="${x+7}" y="${y-6}">${v}</text>`;});
  const op=[[358,40],[362,120],[30,130]];
  outside.forEach((v,i)=>{const [x,y]=op[i];s+=`<circle class="pt" cx="${x}" cy="${y}" r="4"/><text class="tl" x="${x+7}" y="${y-6}">${v}</text>`;});
  const desc=`Một vòng kín tên ${name}, bên trong có các điểm ${inside.join('; ')}`+(outside.length?`; bên ngoài vòng có các điểm ${outside.join('; ')}`:'')+'.';
  return `<div class="figbox"><svg viewBox="0 0 400 170" role="img" aria-label="${desc}" style="width:100%;height:auto;display:block;color:var(--ink)">${s}</svg></div>`;
}

/* ============ Điều kiện trên số tự nhiên ============ */
// Trả về {sb: cách viết nêu dấu hiệu đặc trưng, words: lời, list: các phần tử}
function rangeCond(kind,a,b){
  const K={
    lt:{sb:`{x ∈ ℕ | x < ${b}}`,w:`các số tự nhiên nhỏ hơn ${b}`,l:range(0,b-1)},
    le:{sb:`{x ∈ ℕ | x ≤ ${b}}`,w:`các số tự nhiên không lớn hơn ${b}`,l:range(0,b)},
    slt:{sb:`{x ∈ ℕ* | x < ${b}}`,w:`các số tự nhiên khác 0 và nhỏ hơn ${b}`,l:range(1,b-1)},
    oo:{sb:`{x ∈ ℕ | ${a} < x < ${b}}`,w:`các số tự nhiên lớn hơn ${a} và nhỏ hơn ${b}`,l:range(a+1,b-1)},
    oc:{sb:`{x ∈ ℕ | ${a} < x ≤ ${b}}`,w:`các số tự nhiên lớn hơn ${a} và không vượt quá ${b}`,l:range(a+1,b)},
    co:{sb:`{x ∈ ℕ | ${a} ≤ x < ${b}}`,w:`các số tự nhiên không nhỏ hơn ${a} và nhỏ hơn ${b}`,l:range(a,b-1)},
    cc:{sb:`{x ∈ ℕ | ${a} ≤ x ≤ ${b}}`,w:`các số tự nhiên từ ${a} đến ${b}`,l:range(a,b)}
  }[kind];
  return {sb:nb(K.sb),words:K.w,list:K.l};
}
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
function mixed(make){for(let n=0;n<60;n++){const items=make();const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}return null;}
const FB_TF=()=>({stem:'Xét các phát biểu sau:',items:[
  IT('0 ∈ ℕ',true,'dt','NB','0 là số tự nhiên nên 0 ∈ ℕ.'),
  IT('0 ∈ ℕ*',false,'dt','NB','ℕ* là tập hợp các số tự nhiên khác 0, nên 0 ∉ ℕ*.'),
  IT('Khi liệt kê, mỗi phần tử của tập hợp chỉ được viết một lần.',true,'lk','NB','Đây là quy ước khi liệt kê các phần tử của một tập hợp.'),
  IT('Các phần tử của tập hợp được viết trong dấu ngoặc tròn ( ).',false,'lk','NB','Các phần tử được viết trong dấu ngoặc nhọn { }.')]});

/* ============ Bộ sinh câu nhiều lựa chọn ============ */
/* --- Tập hợp và phần tử (pt) --- */
function genInNum(){return tryGen(()=>{
  const A=asc(sample(ri(4,6),0,20)),out=sample(6,0,20).filter(v=>!A.includes(v));if(out.length<2)return null;
  const [x,x2]=shuffle(A),[y,y2]=out,nm=sel(['A','B','M','P']);
  return {stem:`Cho tập hợp ${nb(`${nm} = ${SET(A)}`)}. Cách viết nào sau đây đúng?`,opts:[
    {t:`${x} ∈ ${nm}`},
    {t:`${y} ∈ ${nm}`,err:`Số ${y} không có trong dấu ngoặc nhọn nên ${y} ∉ ${nm}.`},
    {t:`${x2} ∉ ${nm}`,err:`Số ${x2} là một phần tử của ${nm} nên ${x2} ∈ ${nm}.`},
    {t:`${y2} ∈ ${nm}`,err:`Số ${y2} không có trong dấu ngoặc nhọn nên ${y2} ∉ ${nm}.`}].map(nbT),ans:0,exp:`${x} là một phần tử của ${nm} nên ${x} ∈ ${nm} (đọc là "${x} thuộc ${nm}").`};
});}
function genFig(){return tryGen(()=>{
  const ins=sample(ri(4,5),0,15),outs=sample(2,0,15).filter(v=>!ins.includes(v));if(outs.length<2)return null;
  const nm=sel(['M','A','B']),[x,x2]=shuffle(ins),[y,y2]=outs;
  return {stem:`Tập hợp ${nm} được biểu diễn bởi vòng kín trong hình dưới đây. Cách viết nào sau đây đúng?`,fig:vong(nm,ins,outs),opts:[
    {t:`${y} ∉ ${nm}`},
    {t:`${y2} ∈ ${nm}`,err:`Điểm ${y2} nằm ngoài vòng kín nên ${y2} ∉ ${nm}.`},
    {t:`${x} ∉ ${nm}`,err:`Điểm ${x} nằm trong vòng kín nên ${x} ∈ ${nm}.`},
    {t:`${x2} ∉ ${nm}`,err:`Điểm ${x2} nằm trong vòng kín nên ${x2} ∈ ${nm}.`}].map(nbT),ans:0,exp:`Điểm ${y} nằm ngoài vòng kín nên ${y} không phải là phần tử của ${nm}: ${y} ∉ ${nm}.`};
});}
function genLetterIn(){return tryGen(()=>{
  const w=sel(WORDS),M=lettersOf(w),pool='ABCDĐEGHIKLMNOPQRSTUVXY'.split('').filter(c=>!M.includes(c));
  const x=sel(M),wr=shuffle(pool).slice(0,3);
  return {stem:`Gọi M là tập hợp các chữ cái trong từ "${w}". Chữ cái nào sau đây thuộc tập hợp M?`,opts:[{t:x}].concat(wr.map(c=>({t:c,err:`Từ "${w}" không có chữ cái ${c}, nên ${c} ∉ M.`}))),ans:0,exp:`Các chữ cái trong từ "${w}" là ${L(M)}. Chữ ${x} có trong từ nên ${x} ∈ M.`};
});}
function genReadIn(){
  const v=sel(['A','B','M']),x=sel(['x','a','5','7']);
  return {stem:`Kí hiệu ${nb(`${x} ∉ ${v}`)} được đọc là gì?`,opts:[{t:`${x} không thuộc ${v}`},{t:`${x} thuộc ${v}`,err:`"${x} thuộc ${v}" được viết là ${x} ∈ ${v}. Kí hiệu ∉ có thêm gạch chéo nghĩa là "không thuộc".`},{t:`${v} thuộc ${x}`,err:'Đọc từ trái sang phải: phần tử đứng trước, tập hợp đứng sau.'},{t:`${x} bằng ${v}`,err:'Kí hiệu ∉ không phải là dấu bằng.'}],ans:0,exp:`${nb(`${x} ∉ ${v}`)} đọc là "${x} không thuộc ${v}", nghĩa là ${x} không phải là phần tử của tập hợp ${v}.`};
}
function genInCond(){return tryGen(()=>{
  const kind=sel(['oo','oc','co','lt']),a=ri(2,9),b=a+ri(4,8),C=rangeCond(kind,a,b),inA=v=>C.list.includes(v);
  const cand=shuffle(range(Math.max(0,a-2),b+2)),good=cand.find(inA),bad=cand.filter(v=>!inA(v));
  const why=v=>v===b?`Điều kiện là x ${kind==='oc'?'≤':'<'} ${b}${kind==='oc'?'':`, nên ${b} không thuộc tập hợp`}.`:v===a?`Điều kiện là x ${kind==='co'?'≥':'>'} ${a}, nên ${a} không thuộc tập hợp.`:`Số ${v} không thỏa mãn điều kiện của tập hợp.`;
  const prio=bad.sort((p,q)=>((q===a||q===b)?1:0)-((p===a||p===b)?1:0));
  return {stem:`Cho tập hợp ${nb(`A = ${C.sb}`)}. Số nào sau đây thuộc tập hợp A?`,opts:[{t:''+good}].concat(prio.slice(0,3).map(v=>({t:''+v,err:why(v)}))),ans:0,exp:`A = ${SET(C.list)}. Số ${good} là một phần tử của A.`};
});}
function genOnlyA(){return tryGen(()=>{
  const all=sample(9,1,30),A=asc(all.slice(0,5)),B=asc(all.slice(3,8)),both=A.filter(v=>B.includes(v)),onlyA=A.filter(v=>!B.includes(v)),onlyB=B.filter(v=>!A.includes(v)),none=all.slice(8);
  const g=sel(onlyA);
  return {stem:`Cho hai tập hợp ${nb(`A = ${SET(A)}`)} và ${nb(`B = ${SET(B)}`)}. Số nào thuộc tập hợp A nhưng không thuộc tập hợp B?`,opts:[{t:''+g},{t:''+sel(both),err:'Số này thuộc cả hai tập hợp A và B.'},{t:''+sel(onlyB),err:'Số này thuộc B nhưng không thuộc A.'},{t:''+none[0],err:'Số này không thuộc A cũng không thuộc B.'}],ans:0,exp:`Các số thuộc A nhưng không thuộc B là ${L(onlyA)}.`};
});}
function genCountTrue(){return tryGen(()=>{
  const a=ri(3,10),b=a+ri(4,7),kind=sel(['oc','co','oo','cc']),C=rangeCond(kind,a,b),inA=v=>C.list.includes(v);
  const vals=shuffle([...new Set([a,b,sel(C.list),sel([a-1,b+1,b+2])])]);if(vals.length<4)return null;
  const st=vals.map(v=>{const isIn=RNG()<.5;return {t:`${v} ${isIn?'∈':'∉'} A`,ok:isIn===inA(v)};});
  const k=st.filter(s=>s.ok).length;
  const wr=pickOpts(''+k,[0,1,2,3,4].filter(n=>n!==k).map(n=>({t:''+n,err:`Hãy kiểm tra lại từng kí hiệu: A = ${SET(C.list)}.`})));
  return {stem:`Cho tập hợp ${nb(`A = ${C.sb}`)}. Có bao nhiêu cách viết đúng trong các cách viết sau: ${st.map(s=>nb(s.t)).join(';   ')}?`,opts:[{t:''+k}].concat(wr),ans:0,exp:`A = ${SET(C.list)}. Các cách viết đúng: ${st.filter(s=>s.ok).map(s=>nb(s.t)).join('; ')||'không có'}. Có ${k} cách viết đúng.`};
});}

/* --- Liệt kê các phần tử (lk) --- */
function genListLt(){return tryGen(()=>{
  const b=ri(4,8),l=range(0,b-1);
  return {stem:`Tập hợp A các số tự nhiên nhỏ hơn ${b} được viết là:`,opts:[
    {t:`A = ${SET(l)}`},
    {t:`A = ${SET(range(1,b-1))}`,err:'Còn thiếu số 0. Số 0 cũng là một số tự nhiên.'},
    {t:`A = ${SET(range(0,b))}`,err:`Số ${b} không nhỏ hơn ${b}.`},
    {t:`A = ${SET(range(1,b))}`,err:`Thiếu số 0 và thừa số ${b}.`}].map(nbT),ans:0,exp:`Các số tự nhiên nhỏ hơn ${b} là ${L(l)}.`};
});}
function genFormat(){return tryGen(()=>{
  const v=asc(sample(3,1,20)),[p,q,r]=v,nm=sel(['A','B','C']);
  return {stem:'Cách viết tập hợp nào sau đây đúng?',opts:[
    {t:`${nm} = {${p}; ${q}; ${r}}`},
    {t:`${nm} = [${p}; ${q}; ${r}]`,err:'Các phần tử của tập hợp được viết trong dấu ngoặc nhọn { }, không dùng ngoặc vuông.'},
    {t:`${nm} = (${p}; ${q}; ${r})`,err:'Các phần tử của tập hợp được viết trong dấu ngoặc nhọn { }, không dùng ngoặc tròn.'},
    {t:`${nm} = {${p}; ${q}; ${q}; ${r}}`,err:`Số ${q} được viết hai lần. Khi liệt kê, mỗi phần tử chỉ được viết một lần.`}].map(nbT),ans:0,exp:'Các phần tử được viết trong dấu ngoặc nhọn { }, cách nhau bởi dấu ";", mỗi phần tử chỉ viết một lần.'};
});}
function genLetters(){return tryGen(()=>{
  const w=sel(WORDS.filter(x=>lettersOf(x).length<nLetters(x))),M=lettersOf(w);
  const raw=w.replace(/\s+/g,'').split(''),dup=raw.map(bareLetter);
  const plain=[...new Set(M.map(plainLetter))];
  const drop=M.filter((_,i)=>i!==ri(0,M.length-1));
  const c=[{t:SET(dup),err:'Có chữ cái được viết nhiều lần. Mỗi phần tử chỉ được viết một lần.'},
    SET(plain)!==SET(M)?{t:SET(plain),err:'Ă, Â, Ê, Ô, Ơ, Ư, Đ là các chữ cái riêng, không viết thành A, E, O, U, D.'}:null,
    {t:SET(drop),err:'Còn thiếu một chữ cái.'},
    {t:SET(M.concat(sel(['X','K','Y'].filter(x=>!M.includes(x))))),err:'Có một chữ cái không xuất hiện trong từ.'}];
  return {stem:`Tập hợp các chữ cái trong từ "${w}" là:`,opts:[{t:SET(M)}].concat(pickOpts(SET(M),c)),ans:0,exp:`Các chữ cái trong từ "${w}" là ${L(M)} (mỗi chữ cái viết một lần, không kể dấu thanh).`};
});}
function genListRange(){return tryGen(()=>{
  const a=ri(5,20),b=a+ri(3,5),C=rangeCond('oc',a,b);
  return {stem:`Tập hợp B các số tự nhiên lớn hơn ${a} và không vượt quá ${b} được viết là:`,opts:[
    {t:`B = ${SET(C.list)}`},
    {t:`B = ${SET(range(a+1,b-1))}`,err:`"Không vượt quá ${b}" nghĩa là nhỏ hơn hoặc bằng ${b}, nên ${b} ∈ B.`},
    {t:`B = ${SET(range(a,b))}`,err:`B gồm các số lớn hơn ${a}, nên ${a} ∉ B.`},
    {t:`B = ${SET(range(a,b-1))}`,err:`Thừa số ${a} và thiếu số ${b}.`}].map(nbT),ans:0,exp:`Các số tự nhiên lớn hơn ${a} và không vượt quá ${b} là ${L(C.list)}.`};
});}
function genEvenOdd(){return tryGen(()=>{
  const ev=RNG()<.5,a=ri(3,12),b=a+ri(7,10),par=v=>ev?v%2===0:v%2===1,l=range(a+1,b-1).filter(par);
  const w=ev?'chẵn':'lẻ',o=ev?'lẻ':'chẵn';
  return {stem:`Tập hợp C các số tự nhiên ${w} lớn hơn ${a} và nhỏ hơn ${b} được viết là:`,opts:[
    {t:`C = ${SET(l)}`},
    {t:`C = ${SET(range(a+1,b-1).filter(v=>!par(v)))}`,err:`Đây là các số ${o}, không phải số ${w}.`},
    {t:`C = ${SET(range(a,b).filter(par))}`,err:`C chỉ gồm các số lớn hơn ${a} và nhỏ hơn ${b}; không lấy ${a} và ${b}.`},
    {t:`C = ${SET(range(a+1,b-1))}`,err:`Đề bài chỉ lấy các số ${w}.`}].map(nbT),ans:0,exp:`Các số tự nhiên ${w} lớn hơn ${a} và nhỏ hơn ${b} là ${L(l)}.`};
});}
function twoDigit(f){const o=[];for(let n=10;n<=99;n++){const t=Math.floor(n/10),u=n%10;if(f(t,u))o.push(n);}return o;}
function genDiffDigits(){return tryGen(()=>{
  const d=ri(2,6),R=twoDigit((t,u)=>t-u===d),rev=twoDigit((t,u)=>u-t===d),miss=R.slice(1),noz=R.concat([d]);
  return {stem:`Tập hợp D các số tự nhiên có hai chữ số mà chữ số hàng chục lớn hơn chữ số hàng đơn vị ${d} đơn vị là:`,opts:[
    {t:`D = ${SET(R)}`},
    {t:`D = ${SET(rev)}`,err:'Đây là các số có chữ số hàng đơn vị lớn hơn chữ số hàng chục.'},
    {t:`D = ${SET(miss)}`,err:`Còn thiếu số ${R[0]}: chữ số hàng chục ${d}, chữ số hàng đơn vị 0.`},
    {t:`D = ${SET(asc(noz))}`,err:`${d} là số có một chữ số.`}].map(nbT),ans:0,exp:`Chữ số hàng chục t lấy từ ${d} đến 9, chữ số hàng đơn vị là t − ${d}: ${L(R)}.`};
});}
function genSumDigits(){return tryGen(()=>{
  const s=ri(3,7),R=twoDigit((t,u)=>t+u===s),noZ=R.filter(n=>n%10!==0),with0=['0'+s].concat(R.map(String));
  return {stem:`Tập hợp E các số tự nhiên có hai chữ số mà tổng hai chữ số bằng ${s} là:`,opts:[
    {t:`E = ${SET(R)}`},
    {t:`E = ${SET(noZ)}`,err:`Còn thiếu số ${s}0 (tổng hai chữ số ${s} + 0 = ${s}).`},
    {t:`E = ${SET(with0)}`,err:`0${s} không phải là số có hai chữ số.`},
    {t:`E = ${SET(R.slice(0,Math.ceil(R.length/2)))}`,err:'Còn thiếu những số có chữ số hàng chục lớn hơn chữ số hàng đơn vị.'}].map(nbT),ans:0,exp:`Chữ số hàng chục lấy từ 1 đến ${s}, chữ số hàng đơn vị bằng ${s} trừ chữ số hàng chục: ${L(R)}.`};
});}
const CATS=[
  {stem:'Tập hợp D tên các tháng (dương lịch) có 30 ngày là:',r:['Tháng Tư','Tháng Sáu','Tháng Chín','Tháng Mười Một'],w:[[['Tháng Hai','Tháng Tư','Tháng Sáu','Tháng Chín','Tháng Mười Một'],'Tháng Hai chỉ có 28 hoặc 29 ngày.'],[['Tháng Tư','Tháng Sáu','Tháng Chín'],'Còn thiếu Tháng Mười Một (30 ngày).'],[['Tháng Tư','Tháng Sáu','Tháng Bảy','Tháng Chín','Tháng Mười Một'],'Tháng Bảy có 31 ngày.']]},
  {stem:'Tập hợp Q các tháng của quý IV trong năm là:',r:['Tháng Mười','Tháng Mười Một','Tháng Mười Hai'],w:[[['Tháng Bảy','Tháng Tám','Tháng Chín'],'Đây là các tháng của quý III.'],[['Tháng Mười Một','Tháng Mười Hai'],'Còn thiếu Tháng Mười.'],[['Tháng Chín','Tháng Mười','Tháng Mười Một','Tháng Mười Hai'],'Tháng Chín thuộc quý III.']]},
  {stem:'Tập hợp S các mùa trong năm (ở miền Bắc nước ta) là:',r:['mùa xuân','mùa hạ','mùa thu','mùa đông'],w:[[['mùa xuân','mùa hạ','mùa thu'],'Còn thiếu mùa đông.'],[['mùa xuân','mùa hạ','mùa thu','mùa đông','mùa mưa'],'Mùa mưa không phải là một trong bốn mùa xuân, hạ, thu, đông.'],[['mùa hạ','mùa đông'],'Còn thiếu mùa xuân và mùa thu.']]},
  {stem:'Tập hợp các ngày cuối tuần (thứ Bảy và Chủ nhật) được viết là:',r:['thứ Bảy','Chủ nhật'],w:[[['thứ Sáu','thứ Bảy','Chủ nhật'],'Thứ Sáu không phải là ngày cuối tuần.'],[['thứ Bảy','Chủ nhật','thứ Bảy'],'Thứ Bảy được viết hai lần. Mỗi phần tử chỉ được viết một lần.'],[['Chủ nhật'],'Còn thiếu thứ Bảy.']]}
];
function genCat(){const C=sel(CATS);return {stem:C.stem,opts:[{t:SET(C.r)}].concat(C.w.map(x=>({t:SET(x[0]),err:x[1]}))),ans:0,exp:`Đáp án: ${SET(C.r)}.`};}

/* --- Dấu hiệu đặc trưng, ℕ và ℕ* (dt) --- */
function genStar(){
  return sel([
    {stem:'Tập hợp các số tự nhiên khác 0 được kí hiệu là:',opts:[{t:'ℕ*'},{t:'ℕ',err:'ℕ là tập hợp các số tự nhiên, có cả số 0.'},{t:'{0}',err:'Đây là tập hợp chỉ có một phần tử là số 0.'},{t:'{1}',err:'Đây là tập hợp chỉ có một phần tử là số 1.'}],ans:0,exp:'Kí hiệu ℕ* chỉ tập hợp các số tự nhiên khác 0: ℕ* = {1; 2; 3; ...}.'},
    {stem:'Tập hợp các số tự nhiên được kí hiệu là:',opts:[{t:'ℕ'},{t:'ℕ*',err:'ℕ* là tập hợp các số tự nhiên khác 0.'},{t:'{0}',err:'Đây là tập hợp chỉ có một phần tử là số 0.'},{t:'{1; 2; 3}',err:'Tập hợp này chỉ có ba phần tử.'}],ans:0,exp:'Kí hiệu ℕ chỉ tập hợp các số tự nhiên: ℕ = {0; 1; 2; 3; ...}.'}]);
}
function genStarTrue(){return tryGen(()=>{
  const k=ri(1,99),T=[`0 ∈ ℕ`,`0 ∉ ℕ*`,`${k} ∈ ℕ*`,`${k} ∈ ℕ`],F=[[`0 ∈ ℕ*`,'ℕ* gồm các số tự nhiên khác 0, nên 0 ∉ ℕ*.'],[`0 ∉ ℕ`,'0 là một số tự nhiên nên 0 ∈ ℕ.'],[`${k} ∉ ℕ*`,`${k} là số tự nhiên khác 0 nên ${k} ∈ ℕ*.`],[`${k} ∉ ℕ`,`${k} là một số tự nhiên nên ${k} ∈ ℕ.`]];
  const t=sel(T);return {stem:'Cách viết nào sau đây đúng?',opts:[{t}].concat(shuffle(F).slice(0,3).map(f=>({t:f[0],err:f[1]}))).map(nbT),ans:0,exp:`${t} là cách viết đúng. Nhớ: ℕ = {0; 1; 2; ...}, ℕ* = {1; 2; 3; ...}.`};
});}
function genSbToList(){return tryGen(()=>{
  const kind=sel(['lt','le','slt','oo','oc','co']),a=ri(2,9),b=(kind==='lt'||kind==='le'||kind==='slt')?ri(4,8):a+ri(3,6),C=rangeCond(kind,a,b),l=C.list;
  const c=[];
  if(kind==='lt')c.push({t:SET(range(1,b-1)),err:'Thiếu số 0. Tập hợp viết với ℕ thì có cả số 0.'},{t:SET(range(0,b)),err:`Điều kiện x < ${b} nên ${b} không thuộc tập hợp.`});
  if(kind==='le')c.push({t:SET(range(0,b-1)),err:`Điều kiện x ≤ ${b} nên ${b} thuộc tập hợp.`},{t:SET(range(1,b)),err:'Thiếu số 0. Tập hợp viết với ℕ thì có cả số 0.'});
  if(kind==='slt')c.push({t:SET(range(0,b-1)),err:'Tập hợp viết với ℕ* nên không có số 0.'},{t:SET(range(1,b)),err:`Điều kiện x < ${b} nên ${b} không thuộc tập hợp.`});
  if(kind==='oo')c.push({t:SET(range(a,b-1)),err:`Điều kiện ${a} < x nên ${a} không thuộc tập hợp.`},{t:SET(range(a+1,b)),err:`Điều kiện x < ${b} nên ${b} không thuộc tập hợp.`});
  if(kind==='oc')c.push({t:SET(range(a+1,b-1)),err:`Điều kiện x ≤ ${b} nên ${b} thuộc tập hợp.`},{t:SET(range(a,b)),err:`Điều kiện ${a} < x nên ${a} không thuộc tập hợp.`});
  if(kind==='co')c.push({t:SET(range(a+1,b-1)),err:`Điều kiện ${a} ≤ x nên ${a} thuộc tập hợp.`},{t:SET(range(a,b)),err:`Điều kiện x < ${b} nên ${b} không thuộc tập hợp.`});
  c.push({t:SET(range(Math.max(0,l[0]-1),l[l.length-1]+1)),err:'Thừa cả hai số ở hai đầu.'},{t:SET(l.slice(1,-1)),err:'Thiếu cả hai số ở hai đầu.'});
  return {stem:`Viết tập hợp ${nb(`A = ${C.sb}`)} bằng cách liệt kê các phần tử, ta được:`,opts:[{t:SET(l)}].concat(pickOpts(SET(l),c)).map(nbT),ans:0,exp:`A gồm ${C.words}: A = ${SET(l)}.`};
});}
function genListToSb(){return tryGen(()=>{
  const star=RNG()<.35,a=star?1:ri(3,12),b=a+ri(3,6),l=range(a,b);
  const right=star?`{x ∈ ℕ* | x ≤ ${b}}`:`{x ∈ ℕ | ${a} ≤ x ≤ ${b}}`;
  const c=star?[{t:`{x ∈ ℕ | x ≤ ${b}}`,err:'Tập hợp viết với ℕ thì có thêm số 0.'},{t:`{x ∈ ℕ* | x < ${b}}`,err:`Điều kiện x < ${b} làm mất số ${b}.`},{t:`{x ∈ ℕ | x < ${b}}`,err:`Có thêm số 0 và mất số ${b}.`}]
    :[{t:`{x ∈ ℕ | ${a} < x ≤ ${b}}`,err:`Điều kiện ${a} < x làm mất số ${a}.`},{t:`{x ∈ ℕ | ${a} ≤ x < ${b}}`,err:`Điều kiện x < ${b} làm mất số ${b}.`},{t:`{x ∈ ℕ | ${a} < x < ${b}}`,err:`Mất cả hai số ${a} và ${b}.`}];
  return {stem:`Cho ${nb(`A = ${SET(l)}`)}. Cách viết nào sau đây nêu đúng dấu hiệu đặc trưng cho các phần tử của A?`,opts:[{t:right}].concat(c).map(nbT),ans:0,exp:`A gồm các số tự nhiên từ ${a} đến ${b}, nên A = ${nb(right)}.`};
});}
function genParitySb(){return tryGen(()=>{
  const ev=RNG()<.5,k=ri(4,7),l=ev?range(0,k).map(v=>2*v):range(0,k).map(v=>2*v+1),top=l[l.length-1],w=ev?'chẵn':'lẻ',o=ev?'lẻ':'chẵn';
  return {stem:`Cho ${nb(`B = ${SET(l)}`)}. Cách viết nào sau đây mô tả đúng tập hợp B?`,opts:[
    {t:`{x ∈ ℕ | x là số ${w}, x ≤ ${top}}`},
    {t:`{x ∈ ℕ | x là số ${o}, x ≤ ${top}}`,err:`Các phần tử của B là số ${w}.`},
    {t:`{x ∈ ℕ | x là số ${w}, x < ${top}}`,err:`Điều kiện x < ${top} làm mất phần tử ${top}.`},
    ev?{t:`{x ∈ ℕ* | x là số chẵn, x ≤ ${top}}`,err:'Viết với ℕ* thì mất phần tử 0.'}:{t:`{x ∈ ℕ | x ≤ ${top}}`,err:'Tập hợp này có cả các số chẵn.'}].map(nbT),ans:0,exp:`B gồm các số tự nhiên ${w} không lớn hơn ${top}.`};
});}
function genModSb(){return tryGen(()=>{
  const k=sel([3,4,5]),r=ri(1,k-1),n=ri(4,6),l=range(0,n-1).map(i=>k*i+r),top=l[l.length-1],bd=top+k;
  return {stem:`Cho ${nb(`C = ${SET(l)}`)}. Cách viết nào sau đây mô tả đúng tập hợp C?`,opts:[
    {t:`{x ∈ ℕ | x chia ${k} dư ${r}, x < ${bd}}`},
    {t:`{x ∈ ℕ | x chia hết cho ${k}, x < ${bd}}`,err:`Các phần tử của C chia cho ${k} đều dư ${r}.`},
    {t:`{x ∈ ℕ | x chia ${k} dư ${r}, x < ${top}}`,err:`Điều kiện x < ${top} làm mất phần tử ${top}.`},
    {t:`{x ∈ ℕ | x chia ${k} dư ${r===1?2:1}, x < ${bd}}`,err:`Ví dụ ${l[0]} chia ${k} dư ${r}, không phải dư ${r===1?2:1}.`}].map(nbT),ans:0,exp:`Các số ${L(l)} chia ${k} đều dư ${r}; số tiếp theo là ${bd} không có trong C. Vậy C = ${nb(`{x ∈ ℕ | x chia ${k} dư ${r}, x < ${bd}}`)}.`};
});}

/* --- Số phần tử, phần tử chung (sp) --- */
function genCountList(){return tryGen(()=>{
  const A=asc(sample(ri(4,8),0,40)),n=A.length;
  return {stem:`Tập hợp ${nb(`A = ${SET(A)}`)} có bao nhiêu phần tử?`,opts:[{t:''+n}].concat(pickOpts(''+n,[{t:''+(n+1),err:'Đếm lại: mỗi số trong dấu ngoặc nhọn là một phần tử.'},{t:''+(n-1),err:'Bạn đếm thiếu một phần tử.'},{t:''+Math.max(...A),err:'Đây là phần tử lớn nhất, không phải số phần tử.'},{t:''+(n+2),err:'Đếm lại từng số trong dấu ngoặc nhọn.'}])),ans:0,exp:`A có các phần tử ${L(A)}: tất cả ${n} phần tử.`};
});}
function genCountLetters(){return tryGen(()=>{
  const w=sel(WORDS.filter(x=>lettersOf(x).length<nLetters(x))),M=lettersOf(w),n=M.length,t=nLetters(w);
  return {stem:`Tập hợp các chữ cái trong từ "${w}" có bao nhiêu phần tử?`,opts:[{t:''+n}].concat(pickOpts(''+n,[{t:''+t,err:'Có chữ cái xuất hiện nhiều lần trong từ, nhưng chỉ được tính một lần.'},{t:''+(n-1),err:'Bạn đếm thiếu một chữ cái.'},{t:''+(n+1),err:'Bạn đếm thừa một chữ cái.'}])),ans:0,exp:`Các chữ cái trong từ "${w}" là ${L(M)}: có ${n} phần tử.`};
});}
function genCountRange(){return tryGen(()=>{
  const a=ri(5,40),b=a+ri(6,30),n=b-a+1;
  return {stem:`Tập hợp ${nb(`{x ∈ ℕ | ${a} ≤ x ≤ ${b}}`)} có bao nhiêu phần tử?`,opts:[{t:''+n},{t:''+(n-1),err:`${b} − ${a} = ${n-1} mới là số khoảng cách; còn phải cộng thêm 1 vì lấy cả ${a} và ${b}.`},{t:''+(n+1),err:'Bạn đếm thừa một phần tử.'},{t:''+b,err:`Tập hợp bắt đầu từ ${a}, không bắt đầu từ 1.`}],ans:0,exp:`Các phần tử là ${a}; ${a+1}; ...; ${b}. Số phần tử: ${b} − ${a} + 1 = ${n}.`};
});}
function genCommon(){return tryGen(()=>{
  const all=sample(9,1,25),A=asc(all.slice(0,5)),B=asc(all.slice(2,7)),both=A.filter(v=>B.includes(v));
  return {stem:`Cho ${nb(`A = ${SET(A)}`)} và ${nb(`B = ${SET(B)}`)}. Các phần tử vừa thuộc A vừa thuộc B là:`,opts:[{t:L(both)},{t:L(asc([...new Set(A.concat(B))])),err:'Đây là tất cả các số có trong A hoặc trong B.'},{t:L(A.filter(v=>!B.includes(v))),err:'Đây là các phần tử thuộc A nhưng không thuộc B.'},{t:L(B.filter(v=>!A.includes(v))),err:'Đây là các phần tử thuộc B nhưng không thuộc A.'}],ans:0,exp:`Các số có mặt ở cả hai tập hợp là ${L(both)}.`};
});}
function genCountEven(){return tryGen(()=>{
  const ev=RNG()<.5,a=ri(3,30),b=a+ri(10,25),l=range(a+1,b-1).filter(v=>ev?v%2===0:v%2===1),n=l.length,w=ev?'chẵn':'lẻ';
  return {stem:`Tập hợp các số tự nhiên ${w} x mà ${nb(`${a} < x < ${b}`)} có bao nhiêu phần tử?`,opts:[{t:''+n}].concat(pickOpts(''+n,[{t:''+(b-a-1),err:`Đây là số các số tự nhiên lớn hơn ${a} và nhỏ hơn ${b}, kể cả số ${ev?'lẻ':'chẵn'}.`},{t:''+(n+1),err:`Bạn đếm thừa một số; ${a} và ${b} không được lấy.`},{t:''+(n-1),err:'Bạn đếm thiếu một số.'}])),ans:0,exp:`Các số ${w} cần tìm là ${l.length>8?`${l[0]}; ${l[1]}; ...; ${l[n-1]}`:L(l)}. Có ${n} số.`};
});}

/* ============ Ngân hàng nhiều lựa chọn ============ */
const MC=[];
const addMC=(id,topic,level,gen)=>MC.push({id,type:'mc',topic,level,gen});
['a','b'].forEach(x=>{
  addMC('g_in_'+x,'pt','NB',genInNum);
  addMC('g_fig_'+x,'pt','NB',genFig);
  addMC('g_lin_'+x,'pt','NB',genLetterIn);
  addMC('g_incond_'+x,'pt','TH',genInCond);
  addMC('g_onlya_'+x,'pt','TH',genOnlyA);
  addMC('g_cnttrue_'+x,'pt','VD',genCountTrue);
  addMC('g_listlt_'+x,'lk','NB',genListLt);
  addMC('g_format_'+x,'lk','NB',genFormat);
  addMC('g_letters_'+x,'lk','TH',genLetters);
  addMC('g_listrg_'+x,'lk','TH',genListRange);
  addMC('g_evod_'+x,'lk','TH',genEvenOdd);
  addMC('g_diffd_'+x,'lk','VD',genDiffDigits);
  addMC('g_sumd_'+x,'lk','VD',genSumDigits);
  addMC('g_startrue_'+x,'dt','NB',genStarTrue);
  addMC('g_sb2l_'+x,'dt','TH',genSbToList);
  addMC('g_l2sb_'+x,'dt','TH',genListToSb);
  addMC('g_parsb_'+x,'dt','VD',genParitySb);
  addMC('g_modsb_'+x,'dt','VD',genModSb);
  addMC('g_cntl_'+x,'sp','NB',genCountList);
  addMC('g_cntlet_'+x,'sp','TH',genCountLetters);
  addMC('g_cntrg_'+x,'sp','TH',genCountRange);
  addMC('g_common_'+x,'sp','NB',genCommon);
  addMC('g_cntev_'+x,'sp','VD',genCountEven);
});
addMC('g_read','pt','NB',genReadIn);
addMC('g_star','dt','NB',genStar);
addMC('g_cat_a','lk','NB',genCat);addMC('g_cat_b','lk','NB',genCat);

/* ============ Câu đúng sai ============ */
function tfInNB(){
  const A=asc(sample(5,0,15)),nm=sel(['A','M','P']),out=sample(6,0,15).filter(v=>!A.includes(v));
  const items=mixed(()=>{const o=[],T=()=>RNG()<.5;
    for(let k=0;k<4;k++){const isIn=T(),v=isIn?sel(A):sel(out),wIn=T();o.push(IT(`${v} ${wIn?'∈':'∉'} ${nm}`,wIn===isIn,'pt','NB',isIn?`${v} là một phần tử của ${nm} nên ${v} ∈ ${nm}.`:`${v} không phải là phần tử của ${nm} nên ${v} ∉ ${nm}.`));}
    return o;});
  if(!items)return FB_TF();
  return {stem:`Cho tập hợp ${nb(`${nm} = ${SET(A)}`)}. Xét các cách viết sau:`,items:items.map(i=>Object.assign(i,{t:nb(i.t)}))};
}
function tfStarNB(){
  const k=ri(2,50);
  const P=[[IT('0 ∈ ℕ',true,'dt','NB','0 là một số tự nhiên.'),IT('0 ∉ ℕ',false,'dt','NB','0 là một số tự nhiên nên 0 ∈ ℕ.')],
    [IT('0 ∉ ℕ*',true,'dt','NB','ℕ* gồm các số tự nhiên khác 0.'),IT('0 ∈ ℕ*',false,'dt','NB','ℕ* gồm các số tự nhiên khác 0, nên 0 ∉ ℕ*.')],
    [IT(`${k} ∈ ℕ*`,true,'dt','NB',`${k} là số tự nhiên khác 0.`),IT(`${k} ∉ ℕ*`,false,'dt','NB',`${k} là số tự nhiên khác 0 nên ${k} ∈ ℕ*.`)],
    [IT('ℕ* = {1; 2; 3; ...}',true,'dt','NB','ℕ* là tập hợp các số tự nhiên khác 0.'),IT('ℕ* = {0; 1; 2; 3; ...}',false,'dt','NB','Tập hợp {0; 1; 2; 3; ...} là ℕ. ℕ* không có số 0.')]];
  const items=mixed(()=>shuffle(P).map(p=>sel(p)));
  return {stem:'Xét các phát biểu sau về tập hợp ℕ và ℕ*:',items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};
}
function tfFormatNB(){
  const [p,q,r]=sample(3,1,20);
  const P=[[IT('Khi liệt kê, mỗi phần tử của tập hợp chỉ được viết một lần.',true,'lk','NB','Đây là quy ước khi liệt kê.'),IT('Khi liệt kê, một phần tử có thể được viết nhiều lần.',false,'lk','NB','Mỗi phần tử chỉ được viết một lần.')],
    [IT('Các phần tử của tập hợp được viết trong dấu ngoặc nhọn { }.',true,'lk','NB','Ta viết các phần tử trong dấu ngoặc nhọn.'),IT('Các phần tử của tập hợp được viết trong dấu ngoặc tròn ( ).',false,'lk','NB','Các phần tử được viết trong dấu ngoặc nhọn { }.')],
    [IT(`{${p}; ${q}; ${r}} và {${r}; ${p}; ${q}} là hai cách viết của cùng một tập hợp.`,true,'lk','NB','Thứ tự liệt kê các phần tử là tuỳ ý.'),IT(`{${p}; ${q}; ${r}} và {${r}; ${p}; ${q}} là hai tập hợp khác nhau vì thứ tự khác nhau.`,false,'lk','NB','Thứ tự liệt kê các phần tử là tuỳ ý, nên hai cách viết này cùng chỉ một tập hợp.')],
    [IT('Người ta thường đặt tên tập hợp bằng chữ cái in hoa.',true,'lk','NB','Ví dụ: tập hợp A, tập hợp M.'),IT('Các phần tử của tập hợp cách nhau bởi dấu "+".',false,'lk','NB','Các phần tử cách nhau bởi dấu ";".')]];
  const items=mixed(()=>shuffle(P).map(x=>sel(x)));
  return {stem:'Xét các phát biểu sau về cách viết một tập hợp:',items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};
}
function tfCountNB(){
  const A=asc(sample(ri(4,6),0,20)),n=A.length,out=sample(6,0,20).filter(v=>!A.includes(v));
  const items=mixed(()=>{const T=()=>RNG()<.5,o=[];
    {const t=T();o.push(IT(`A có ${t?n:n+1} phần tử.`,t,'sp','NB',`A có các phần tử ${L(A)}: ${n} phần tử.`));}
    {const t=T(),v=t?sel(A):sel(out);o.push(IT(`${v} ∈ A`,t,'pt','NB',t?`${v} là phần tử của A.`:`${v} không có trong A.`));}
    {const t=T();o.push(IT(`Phần tử nhỏ nhất của A là ${t?A[0]:A[1]}.`,t,'sp','NB',`Phần tử nhỏ nhất của A là ${A[0]}.`));}
    {const t=T(),v=t?sel(out):sel(A);o.push(IT(`${v} ∉ A`,t,'pt','NB',t?`${v} không có trong A.`:`${v} là phần tử của A nên ${v} ∈ A.`));}
    return o;});
  return {stem:`Cho tập hợp ${nb(`A = ${SET(A)}`)}. Xét các phát biểu sau:`,items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};
}
function tfLetters(level){return ()=>{
  const w=sel(WORDS.filter(x=>lettersOf(x).length<nLetters(x))),M=lettersOf(w),n=M.length,t=nLetters(w),no=sel('KXYQ'.split('').filter(c=>!M.includes(c)));
  const accented=M.find(c=>plainLetter(c)!==c&&!M.includes(plainLetter(c)));
  const items=mixed(()=>{const T=()=>RNG()<.5,o=[];
    {const v=T();o.push(IT(`M có ${v?n:t} phần tử.`,v,'sp',level,`M = ${SET(M)} có ${n} phần tử (chữ cái lặp lại chỉ tính một lần).`));}
    {const v=T(),c=v?sel(M):no;o.push(IT(`${c} ∈ M`,v,'pt',level,v?`Từ "${w}" có chữ cái ${c}.`:`Từ "${w}" không có chữ cái ${c}.`));}
    if(accented){const v=T();o.push(v?IT(`${accented} ∈ M`,true,'lk',level,`Từ "${w}" có chữ cái ${accented}.`):IT(`${plainLetter(accented)} ∈ M`,false,'lk',level,`Từ "${w}" có chữ cái ${accented}, không có chữ ${plainLetter(accented)}; ${accented} và ${plainLetter(accented)} là hai chữ cái khác nhau.`));}
    else{const v=T(),c=sel(M);o.push(IT(`${c} ∉ M`,!v&&false,'pt',level,`Từ "${w}" có chữ cái ${c} nên ${c} ∈ M.`));}
    {const v=T(),dup=SET(w.replace(/\s+/g,'').split('').map(bareLetter));o.push(IT(`M = ${v?SET(M):dup}`,v,'lk',level,v?'Mỗi chữ cái được viết đúng một lần.':'Có chữ cái được viết nhiều lần; mỗi phần tử chỉ được viết một lần.'));}
    return o;});
  return {stem:`Gọi M là tập hợp các chữ cái trong từ "${w}". Xét các phát biểu sau:`,items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};
};}
function tfRange(level){return ()=>{
  const kind=sel(['oc','co','oo']),a=ri(2,12),b=a+ri(4,7),C=rangeCond(kind,a,b),l=C.list,n=l.length;
  const items=mixed(()=>{const T=()=>RNG()<.5,o=[];
    {const v=T(),x=v?sel(l):sel([a,b].filter(z=>!l.includes(z)));o.push(IT(`${x} ∈ A`,v,'pt',level,`A = ${SET(l)}.`));}
    {const v=T(),y=sel([a,b]),inn=l.includes(y);o.push(IT(`${y} ${v===inn?'∈':'∉'} A`,v,'pt',level,`A = ${SET(l)}, nên ${y} ${inn?'∈':'∉'} A.`));}
    {const v=T();o.push(IT(`A có ${v?n:n+1} phần tử.`,v,'sp',level,`A = ${SET(l)} có ${n} phần tử.`));}
    {const v=T(),w=sel([l.slice(1),range(l[0]-1,l[n-1]),range(l[0],l[n-1]+1)]);o.push(IT(`A = ${v?SET(l):SET(w)}`,v,'dt',level,`Liệt kê đúng: A = ${SET(l)}.`));}
    return o;});
  return {stem:`Cho tập hợp ${nb(`A = ${C.sb}`)}. Xét các phát biểu sau:`,items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};
};}
function tfTwoSets(level){return ()=>{
  const all=sample(8,1,20),A=asc(all.slice(0,5)),B=asc(all.slice(3,7)),both=A.filter(v=>B.includes(v)),oA=A.filter(v=>!B.includes(v)),oB=B.filter(v=>!A.includes(v)),none=all[7];
  const items=mixed(()=>{const T=()=>RNG()<.5,o=[];
    {const v=T(),x=v?sel(both):sel(oA);o.push(IT(`${x} vừa thuộc A vừa thuộc B.`,v,'sp',level,`Các số vừa thuộc A vừa thuộc B là ${L(both)}.`));}
    {const v=T(),x=v?sel(oA):sel(both);o.push(IT(`${x} ∈ A và ${x} ∉ B`,v,'pt',level,v?`${x} có trong A, không có trong B.`:`${x} có trong cả A và B.`));}
    {const v=T(),x=v?none:sel(oB);o.push(IT(`${x} ∉ A và ${x} ∉ B`,v,'pt',level,v?`${x} không có trong A và B.`:`${x} ∈ B.`));}
    {const v=T();o.push(IT(`Có ${v?both.length:both.length+1} phần tử vừa thuộc A vừa thuộc B.`,v,'sp',level,`Đó là ${L(both)}: ${both.length} phần tử.`));}
    return o;});
  return {stem:`Cho ${nb(`A = ${SET(A)}`)} và ${nb(`B = ${SET(B)}`)}. Xét các phát biểu sau:`,items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};
};}
function tfEven(level){return ()=>{
  const b=2*ri(4,8),E=range(0,b-1).filter(v=>v%2===0),n=E.length;
  const items=mixed(()=>{const T=()=>RNG()<.5,o=[];
    {const v=T();o.push(IT(`E = ${v?SET(E):SET(E.slice(1))}`,v,'lk',level,`E = ${SET(E)} (số 0 là số chẵn).`));}
    {const v=T();o.push(IT(`${v?'0 ∈ E':`${b} ∈ E`}`,v,'pt',level,v?'0 là số tự nhiên chẵn và 0 < '+b+'.':`Điều kiện x < ${b} nên ${b} ∉ E.`));}
    {const v=T();o.push(IT(`E có ${v?n:n-1} phần tử.`,v,'sp',level,`E có ${n} phần tử.`));}
    {const v=T();o.push(IT(v?`E = {x ∈ ℕ | x là số chẵn, x ≤ ${b-2}}`:`E = {x ∈ ℕ* | x là số chẵn, x < ${b}}`,v,'dt',level,v?`Các số chẵn không lớn hơn ${b-2} cũng là ${L(E)}.`:'Viết với ℕ* thì mất phần tử 0.'));}
    return o;});
  return {stem:`Cho ${nb(`E = {x ∈ ℕ | x là số chẵn, x < ${b}}`)}. Xét các phát biểu sau:`,items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};
};}
function tfMod(){
  const k=sel([3,4,5]),r=ri(0,k-1),b=ri(20,35),C=range(0,b).filter(v=>v%k===r),n=C.length,wr=r===0?`chia hết cho ${k}`:`chia ${k} dư ${r}`;
  const items=mixed(()=>{const T=()=>RNG()<.5,o=[];
    {const v=T(),x=v?C[0]:C[0]+1;o.push(IT(`${x} ∈ C`,v,'pt','VD',`Phần tử nhỏ nhất của C là ${C[0]}.`));}
    {const v=T();o.push(IT(`C có ${v?n:n+1} phần tử.`,v,'sp','VD',`C = {${C.slice(0,3).join('; ')}; ...; ${C[n-1]}} có ${n} phần tử.`));}
    {const v=T(),x=v?C[n-1]:C[n-1]+k;o.push(IT(`Phần tử lớn nhất của C là ${x}.`,v,'sp','VD',`Phần tử lớn nhất của C là ${C[n-1]} (số tiếp theo ${C[n-1]+k} lớn hơn ${b}).`));}
    {const v=T(),x=v?C[1]+k:C[1]+1;o.push(IT(`${x} ∈ C`,v,'pt','VD',v?`${x} ${wr} và ${x} ≤ ${b}.`:`${x} không ${wr}.`));}
    return o;});
  return {stem:`Cho ${nb(`C = {x ∈ ℕ | x ${wr}, x ≤ ${b}}`)}. Xét các phát biểu sau:`,items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};
}
function tfDigits(){
  const s=ri(3,8),d=ri(2,6),S=twoDigit((t,u)=>t+u===s),D=twoDigit((t,u)=>t-u===d);
  const items=mixed(()=>{const T=()=>RNG()<.5,o=[];
    {const v=T();o.push(IT(`Tập hợp các số có hai chữ số mà tổng hai chữ số bằng ${s} có ${v?S.length:S.length-1} phần tử.`,v,'sp','VD',`Đó là ${L(S)}: ${S.length} số.`));}
    {const v=T();o.push(IT(`${v?s*10:'0'+s} thuộc tập hợp các số có hai chữ số mà tổng hai chữ số bằng ${s}.`,v,'pt','VD',v?`${s*10} có hai chữ số và ${s} + 0 = ${s}.`:`0${s} không phải là số có hai chữ số.`));}
    {const v=T();o.push(IT(`Tập hợp các số có hai chữ số mà chữ số hàng chục lớn hơn chữ số hàng đơn vị ${d} đơn vị có ${v?D.length:D.length-1} phần tử.`,v,'sp','VD',`Đó là ${L(D)}: ${D.length} số.`));}
    {const v=T(),x=v?D[0]:D[0]+1;o.push(IT(`Số ${x} có chữ số hàng chục lớn hơn chữ số hàng đơn vị ${d} đơn vị.`,v,'lk','VD',v?`${Math.floor(x/10)} − ${x%10} = ${d}.`:`${Math.floor(x/10)} − ${x%10} = ${Math.floor(x/10)-x%10}.`));}
    return o;});
  return {stem:'Xét các phát biểu sau về các số tự nhiên có hai chữ số:',items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};
}
const KIDS=['An','Bình','Chi','Dũng','Hà','Khoa','Lan','Minh','Ngọc','Phúc'];
function tfClub(){
  for(;;){const names=shuffle(KIDS).slice(0,7),A=names.slice(0,4),B=names.slice(2,ri(5,7)),both=A.filter(x=>B.includes(x)),oA=A.filter(x=>!B.includes(x)),oB=B.filter(x=>!A.includes(x)),uni=[...new Set(A.concat(B))].length;
    if(!oB.length)continue;
    const items=mixed(()=>{const T=()=>RNG()<.5,o=[];
      {const v=T(),x=v?sel(both):sel(oA);o.push(IT(`${x} ∈ A và ${x} ∈ B`,v,'pt','NB',v?`${x} đăng kí cả hai câu lạc bộ.`:`${x} chỉ đăng kí bóng đá.`));}
      {const v=T(),x=v?sel(oB):sel(A);o.push(IT(`${x} ∉ A`,v,'pt','TH',v?`${x} không đăng kí bóng đá.`:`${x} có đăng kí bóng đá nên ${x} ∈ A.`));}
      {const v=T();o.push(IT(`Có ${v?both.length:both.length+1} bạn đăng kí cả hai câu lạc bộ.`,v,'sp','TH',`Các bạn có mặt ở cả A và B: ${L(both)}.`));}
      {const v=T();o.push(IT(`Có tất cả ${v?uni:A.length+B.length} bạn đăng kí ít nhất một câu lạc bộ.`,v,'sp','VD',`Đếm mỗi bạn một lần: ${uni} bạn. Không cộng ${A.length} + ${B.length} vì ${both.length} bạn bị đếm hai lần.`));}
      return o;});
    return {stem:`Tập hợp các bạn đăng kí câu lạc bộ bóng đá là ${nb(`A = ${SET(A)}`)}, tập hợp các bạn đăng kí câu lạc bộ cờ vua là ${nb(`B = ${SET(B)}`)}. Xét các phát biểu sau:`,items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};}
}
const MONTH=['Tháng Một','Tháng Hai','Tháng Ba','Tháng Tư','Tháng Năm','Tháng Sáu','Tháng Bảy','Tháng Tám','Tháng Chín','Tháng Mười','Tháng Mười Một','Tháng Mười Hai'],DAYS31=[0,2,4,6,7,9,11];
function tfMonth(){
  const items=mixed(()=>{const T=()=>RNG()<.5,o=[];
    {const v=T(),m=v?sel(DAYS31.filter(i=>i>4)):sel([3,5,8,10]);o.push(IT(`${MONTH[m]} ∈ M`,v,'pt','TH',v?`${MONTH[m]} có 31 ngày.`:`${MONTH[m]} có 30 ngày.`));}
    {const v=T();o.push(IT(`Tháng Hai ${v?'∉':'∈'} M`,v,'pt','TH','Tháng Hai chỉ có 28 hoặc 29 ngày.'));}
    {const v=T();o.push(IT(`M có ${v?7:6} phần tử.`,v,'sp','VD','Các tháng có 31 ngày: Tháng Một, Ba, Năm, Bảy, Tám, Mười, Mười Hai: 7 tháng.'));}
    {const v=T();o.push(IT(v?'Tháng Bảy và Tháng Tám đều thuộc M.':'Không có hai tháng liền nhau nào cùng thuộc M.',v,'sp','VD','Tháng Bảy và Tháng Tám liền nhau và đều có 31 ngày (Tháng Mười Hai và Tháng Một cũng vậy).'));}
    return o;});
  return {stem:'Gọi M là tập hợp các tháng (dương lịch) có 31 ngày. Xét các phát biểu sau:',items:(items||FB_TF().items).map(i=>Object.assign(i,{t:nb(i.t)}))};
}
const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
['a','b'].forEach(x=>{
  addTF('tf_in_'+x,'pt','NB',tfInNB);
  addTF('tf_star_'+x,'dt','NB',tfStarNB);
  addTF('tf_fmt_'+x,'lk','NB',tfFormatNB);
  addTF('tf_cnt_'+x,'sp','NB',tfCountNB);
  addTF('tf_range_th_'+x,'dt','TH',tfRange('TH'));
  addTF('tf_two_th_'+x,'sp','TH',tfTwoSets('TH'));
  addTF('tf_let_th_'+x,'lk','TH',tfLetters('TH'));
  addTF('tf_even_th_'+x,'pt','TH',tfEven('TH'));
  addTF('tf_mod_'+x,'dt','VD',tfMod);
  addTF('tf_dig_'+x,'sp','VD',tfDigits);
  addTF('tf_club_'+x,'pt','VD',tfClub);
  addTF('tf_month_'+x,'sp','VD',tfMonth);
});
addTF('tf_two_vd','sp','VD',tfTwoSets('VD'));
addTF('tf_range_vd','pt','VD',tfRange('VD'));

/* ============ Câu trả lời ngắn ============ */
const SA=[
 {id:'s_pt_nb',topic:'pt',level:'NB',unit:'số',gen:()=>{const A=asc(sample(5,0,20)),c=shuffle(A.slice(0,ri(1,4)).concat(sample(6,0,20).filter(v=>!A.includes(v)))).slice(0,5),k=c.filter(v=>A.includes(v)).length;return{stem:`Cho ${nb(`A = ${SET(A)}`)}. Trong các số ${L(c)}, có bao nhiêu số thuộc tập hợp A?`,ans:[k],exp:`Các số thuộc A là ${L(c.filter(v=>A.includes(v)))||'(không có)'}: ${k} số.`};}},
 {id:'s_pt_th',topic:'pt',level:'TH',unit:'số',gen:()=>{const a=ri(2,10),b=a+ri(4,7),C=rangeCond('oo',a,b),c=shuffle([a,b,a+1,b-1,b+1,sel(C.list)]).slice(0,5),k=c.filter(v=>!C.list.includes(v)).length;return{stem:`Cho ${nb(`A = ${C.sb}`)}. Trong các số ${L(c)}, có bao nhiêu số không thuộc tập hợp A?`,ans:[k],exp:`A = ${SET(C.list)}. Các số không thuộc A là ${L(c.filter(v=>!C.list.includes(v)))||'(không có)'}: ${k} số.`};}},
 {id:'s_pt_th2',topic:'pt',level:'TH',unit:'',gen:()=>{const b=ri(8,40),le=RNG()<.5;return{stem:`Cho ${nb(`A = {x ∈ ℕ | x ${le?'≤':'<'} ${b}}`)}. Tìm phần tử lớn nhất của tập hợp A.`,ans:[le?b:b-1],exp:le?`x ≤ ${b} nên ${b} ∈ A và là phần tử lớn nhất.`:`x < ${b} nên ${b} ∉ A; phần tử lớn nhất là ${b-1}.`};}},
 {id:'s_pt_vd',topic:'pt',level:'VD',unit:'phần tử',gen:()=>{const all=sample(9,1,30),A=asc(all.slice(0,6)),B=asc(all.slice(ri(2,4),9)),k=A.filter(v=>!B.includes(v)).length;return{stem:`Cho ${nb(`A = ${SET(A)}`)} và ${nb(`B = ${SET(B)}`)}. Có bao nhiêu phần tử thuộc A nhưng không thuộc B?`,ans:[k],exp:`Các phần tử thuộc A nhưng không thuộc B là ${L(A.filter(v=>!B.includes(v)))}: ${k} phần tử.`};}},
 {id:'s_lk_nb',topic:'lk',level:'NB',unit:'',gen:()=>{const b=ri(5,30);return{stem:`Viết tập hợp A các số tự nhiên nhỏ hơn ${b} bằng cách liệt kê các phần tử. Phần tử lớn nhất của A là số nào?`,ans:[b-1],exp:`A = {0; 1; 2; ...; ${b-1}}. Phần tử lớn nhất là ${b-1}.`};}},
 {id:'s_lk_th',topic:'lk',level:'NB',unit:'phần tử',gen:()=>{const w=sel(WORDS),M=lettersOf(w);return{stem:`Viết tập hợp M các chữ cái trong từ "${w}". Tập hợp M có bao nhiêu phần tử?`,ans:[M.length],exp:`M = ${SET(M)}: ${M.length} phần tử (chữ cái lặp lại chỉ viết một lần, không kể dấu thanh).`};}},
 {id:'s_lk_th2',topic:'lk',level:'TH',unit:'phần tử',gen:()=>{const ev=RNG()<.5,a=ri(3,20),b=a+ri(7,14),l=range(a+1,b-1).filter(v=>ev?v%2===0:v%2===1);return{stem:`Viết tập hợp các số tự nhiên ${ev?'chẵn':'lẻ'} lớn hơn ${a} và nhỏ hơn ${b} bằng cách liệt kê. Tập hợp đó có bao nhiêu phần tử?`,ans:[l.length],exp:`Tập hợp đó là ${SET(l)}: ${l.length} phần tử.`};}},
 {id:'s_lk_vd',topic:'lk',level:'VD',unit:'số',gen:()=>{const d=ri(1,7),R=twoDigit((t,u)=>t-u===d);return{stem:`Viết tập hợp các số tự nhiên có hai chữ số mà chữ số hàng chục lớn hơn chữ số hàng đơn vị ${d} đơn vị. Tập hợp đó có bao nhiêu phần tử?`,ans:[R.length],exp:`Tập hợp đó là ${SET(R)}: ${R.length} phần tử. Đừng quên số ${d}0.`};}},
 {id:'s_lk_vd2',topic:'lk',level:'VD',unit:'số',gen:()=>{const s=ri(4,9),R=twoDigit((t,u)=>t+u===s);return{stem:`Có bao nhiêu số tự nhiên có hai chữ số mà tổng hai chữ số bằng ${s}?`,ans:[R.length],exp:`Các số đó là ${L(R)}: ${R.length} số.`};}},
 {id:'s_lk_vd3',topic:'lk',level:'VD',unit:'số',gen:()=>{const p=sel([6,8,12,18,24]),R=twoDigit((t,u)=>t*u===p);return{stem:`Viết tập hợp F các số tự nhiên có hai chữ số mà tích hai chữ số bằng ${p}. Tập hợp F có bao nhiêu phần tử?`,ans:[R.length],exp:`F = ${SET(R)}: ${R.length} phần tử.`};}},
 {id:'s_dt_nb',topic:'dt',level:'NB',unit:'phần tử',gen:()=>{const b=ri(4,12);return{stem:`Cho ${nb(`A = {x ∈ ℕ* | x < ${b}}`)}. Tập hợp A có bao nhiêu phần tử?`,ans:[b-1],exp:`A = ${SET(range(1,b-1))} (không có số 0 vì viết với ℕ*): ${b-1} phần tử.`};}},
 {id:'s_dt_nb2',topic:'dt',level:'NB',unit:'phần tử',gen:()=>{const b=ri(4,12);return{stem:`Cho ${nb(`B = {x ∈ ℕ | x < ${b}}`)}. Tập hợp B có bao nhiêu phần tử?`,ans:[b],exp:`B = ${SET(range(0,b-1))} (có cả số 0): ${b} phần tử.`};}},
 {id:'s_dt_th',topic:'dt',level:'TH',unit:'',gen:()=>{const a=ri(2,15),b=a+ri(3,5),l=range(a,b-1),s=l.reduce((x,y)=>x+y,0);return{stem:`Cho ${nb(`A = {x ∈ ℕ | ${a} ≤ x < ${b}}`)}. Tính tổng các phần tử của A.`,ans:[s],exp:`A = ${SET(l)}. Tổng: ${l.join(' + ')} = ${s}.`};}},
 {id:'s_dt_th2',topic:'dt',level:'TH',unit:'phần tử',gen:()=>{const k=sel([3,4,5,6]),b=ri(18,40),l=range(0,b-1).filter(v=>v%k===0);return{stem:`Cho ${nb(`B = {x ∈ ℕ | x chia hết cho ${k}, x < ${b}}`)}. Tập hợp B có bao nhiêu phần tử?`,ans:[l.length],exp:`B = ${SET(l)}: ${l.length} phần tử (nhớ số 0 cũng chia hết cho ${k}).`};}},
 {id:'s_dt_vd',topic:'dt',level:'VD',unit:'phần tử',gen:()=>{const k=sel([3,4,5]),r=ri(1,k-1),b=ri(25,50),l=range(0,b).filter(v=>v%k===r);return{stem:`Cho ${nb(`C = {x ∈ ℕ | x chia ${k} dư ${r}, x ≤ ${b}}`)}. Tập hợp C có bao nhiêu phần tử?`,ans:[l.length],exp:`C = {${l.slice(0,3).join('; ')}; ...; ${l[l.length-1]}}. Các phần tử cách nhau ${k} đơn vị, có (${l[l.length-1]} − ${l[0]}) : ${k} + 1 = ${l.length} phần tử.`};}},
 {id:'s_sp_nb',topic:'sp',level:'NB',unit:'phần tử',gen:()=>{const A=asc(sample(ri(4,8),0,50));return{stem:`Tập hợp ${nb(`A = ${SET(A)}`)} có bao nhiêu phần tử?`,ans:[A.length],exp:`Đếm các số trong dấu ngoặc nhọn: ${A.length} phần tử.`};}},
 {id:'s_sp_th',topic:'sp',level:'TH',unit:'phần tử',gen:()=>{const a=ri(5,60),b=a+ri(8,40);return{stem:`Tập hợp ${nb(`{x ∈ ℕ | ${a} ≤ x ≤ ${b}}`)} có bao nhiêu phần tử?`,ans:[b-a+1],exp:`Các phần tử là ${a}; ${a+1}; ...; ${b}. Số phần tử: ${b} − ${a} + 1 = ${b-a+1}.`};}},
 {id:'s_sp_th2',topic:'sp',level:'NB',unit:'phần tử',gen:()=>{const all=sample(10,1,30),A=asc(all.slice(0,6)),B=asc(all.slice(ri(2,5),10)),both=A.filter(v=>B.includes(v));return{stem:`Cho ${nb(`A = ${SET(A)}`)} và ${nb(`B = ${SET(B)}`)}. Có bao nhiêu phần tử vừa thuộc A vừa thuộc B?`,ans:[both.length],exp:`Đó là ${L(both)}: ${both.length} phần tử.`};}},
 {id:'s_sp_vd',topic:'sp',level:'VD',unit:'số',gen:()=>{const a=ri(5,20),b=ri(25,45),c=ri(a+3,b-8),d=ri(c+4,b+10),lo=Math.max(a,c),hi=Math.min(b,d),k=hi-lo-1;return{stem:`Cho ${nb(`A = {x ∈ ℕ | ${a} < x < ${b}}`)} và ${nb(`B = {x ∈ ℕ | ${c} < x < ${d}}`)}. Có bao nhiêu số tự nhiên vừa thuộc A vừa thuộc B?`,ans:[k],exp:`Số vừa thuộc A vừa thuộc B phải lớn hơn ${lo} và nhỏ hơn ${hi}: ${lo+1}; ...; ${hi-1}. Có ${hi} − ${lo} − 1 = ${k} số.`};}},
 {id:'s_sp_vd2',topic:'sp',level:'VD',unit:'bạn',gen:()=>{const n=ri(30,42),p=ri(12,20),q=ri(10,18),r=ri(3,Math.min(p,q)-3);return{stem:`Lớp 6A có ${n} học sinh. Gọi A là tập hợp các bạn thích bóng đá (có ${p} bạn), B là tập hợp các bạn thích cầu lông (có ${q} bạn). Có ${r} bạn vừa thuộc A vừa thuộc B. Có bao nhiêu bạn thuộc A nhưng không thuộc B?`,ans:[p-r],exp:`Trong ${p} bạn thích bóng đá có ${r} bạn cũng thích cầu lông. Số bạn chỉ thuộc A: ${p} − ${r} = ${p-r}. Số học sinh của lớp không cần dùng đến.`};}},
].map(q=>Object.assign({type:'sa'},q));

/* ============ Chủ đề ============ */
const TOPICS={
  pt:{short:'Phần tử',name:'Tập hợp và phần tử',rule:'Một tập hợp bao gồm những đối tượng nhất định, gọi là các phần tử của tập hợp. x là phần tử của tập hợp A, kí hiệu x ∈ A (đọc là x thuộc A). y không là phần tử của tập hợp A, kí hiệu y ∉ A (đọc là y không thuộc A).',tip:'Người ta thường đặt tên tập hợp bằng chữ cái in hoa. Khi x thuộc A, ta còn nói "x nằm trong A" hay "A chứa x".'},
  lk:{short:'Liệt kê',name:'Liệt kê các phần tử',rule:'Cách 1: liệt kê các phần tử của tập hợp, tức là viết các phần tử trong dấu ngoặc { } theo thứ tự tuỳ ý nhưng mỗi phần tử chỉ được viết một lần. Các phần tử cách nhau bởi dấu ";".',tip:'Với tập hợp các chữ cái trong một từ, mỗi chữ cái chỉ viết một lần và không kể dấu thanh; Ă, Â, Ê, Ô, Ơ, Ư, Đ là các chữ cái riêng.'},
  dt:{short:'Dấu hiệu đặc trưng',name:'Nêu dấu hiệu đặc trưng',rule:'Cách 2: nêu dấu hiệu đặc trưng cho các phần tử của tập hợp, ví dụ P = {n | n ∈ ℕ, n < 6} hoặc P = {n ∈ ℕ | n < 6}. ℕ là tập hợp các số tự nhiên: ℕ = {0; 1; 2; 3; ...}; ℕ* là tập hợp các số tự nhiên khác 0: ℕ* = {1; 2; 3; ...}.',tip:'Chú ý dấu < và ≤: x < 6 thì không lấy 6, x ≤ 6 thì lấy cả 6. Viết với ℕ thì có thể có số 0, viết với ℕ* thì không có số 0.'},
  sp:{short:'Đếm phần tử',name:'Đếm phần tử, phần tử chung',rule:'Liệt kê rồi đếm các phần tử của tập hợp. Các số tự nhiên liên tiếp từ a đến b có b − a + 1 số. Phần tử vừa thuộc A vừa thuộc B là phần tử có mặt ở cả hai tập hợp.',tip:'Phần tử lặp lại chỉ đếm một lần. Khi đếm các số từ a đến b, nhớ cộng thêm 1.'}
};
const TKEYS=['pt','lk','dt','sp'];
const TDESC={pt:'Kí hiệu ∈, ∉; nhận biết phần tử thuộc hay không thuộc tập hợp',lk:'Viết tập hợp bằng cách liệt kê, chữ cái trong một từ, số có hai chữ số',dt:'Viết tập hợp bằng dấu hiệu đặc trưng, tập ℕ và ℕ*',sp:'Đếm số phần tử, phần tử vừa thuộc A vừa thuộc B'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Đọc và dùng kí hiệu ∈, ∉, nhận ra cách viết tập hợp đúng, ℕ và ℕ*.',TH:'Liệt kê phần tử từ dấu hiệu đặc trưng và ngược lại, chữ cái trong một từ, đếm phần tử.',VD:'Số có hai chữ số theo điều kiện, số chia có dư, phần tử chung của hai tập hợp, bài toán thực tế.'};

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
function tfHard(){
  for(;;){const s=ri(3,9),S=twoDigit((t,u)=>t+u===s).length,b=ri(5,15),ev=45,mul=ri(3,6),M3=range(10,99).filter(v=>v%mul===0).length;
    const P=[
      [IT(`Có đúng ${S} số tự nhiên có hai chữ số mà tổng hai chữ số bằng ${s}.`,true,'lk','VD',`Chữ số hàng chục từ 1 đến ${s}: ${S} số.`),IT(`Có đúng ${S-1} số tự nhiên có hai chữ số mà tổng hai chữ số bằng ${s}.`,false,'lk','VD',`Có ${S} số, kể cả số ${s}0.`)],
      [IT(`Hai tập hợp {x ∈ ℕ* | x ≤ ${b}} và {x ∈ ℕ | 0 < x < ${b+1}} có các phần tử giống hệt nhau.`,true,'dt','VD',`Cả hai đều là {1; 2; ...; ${b}}.`),IT(`Hai tập hợp {x ∈ ℕ | x ≤ ${b}} và {x ∈ ℕ* | x ≤ ${b}} có các phần tử giống hệt nhau.`,false,'dt','VD','Tập hợp thứ nhất có thêm số 0.')],
      [IT(`Có ${ev} số tự nhiên chẵn có hai chữ số.`,true,'sp','VD','Các số chẵn có hai chữ số: 10; 12; ...; 98, có (98 − 10) : 2 + 1 = 45 số.'),IT(`Có ${ev-1} số tự nhiên chẵn có hai chữ số.`,false,'sp','VD','Có (98 − 10) : 2 + 1 = 45 số.')],
      [IT(`Tập hợp các số có hai chữ số chia hết cho ${mul} có ${M3} phần tử.`,true,'sp','VD',`Từ ${10+(mul-10%mul)%mul} đến ${99-99%mul}, cách nhau ${mul}: ${M3} số.`),IT(`Tập hợp các số có hai chữ số chia hết cho ${mul} có ${M3+1} phần tử.`,false,'sp','VD',`Chỉ có ${M3} số.`)],
      [IT('Tập hợp {x ∈ ℕ | x < 1} có đúng một phần tử.',true,'dt','VD','Đó là số 0.'),IT('Tập hợp {x ∈ ℕ* | x < 2} có hai phần tử.',false,'dt','VD','Chỉ có số 1.')]];
    const its=shuffle(P).slice(0,4).map(p=>sel(p)).map(i=>Object.assign(i,{t:nb(i.t)}));if(tfOK(its))return {stem:'Xét các phát biểu sau:',items:its};}
}
const HARD={tf:[{id:'h_kn',type:'tf',topic:'sp',level:'VD',gen:tfHard}],sa:[
 {id:'h_chia',topic:'sp',level:'VD',unit:'số',gen:()=>{const k=sel([3,4,6,7,9]),a=ri(10,60),b=ri(300,1000),f=Math.ceil(a/k)*k,l=Math.floor(b/k)*k,n=(l-f)/k+1;return{stem:`Gọi A là tập hợp các số tự nhiên từ ${a} đến ${b} chia hết cho ${k}. Tập hợp A có bao nhiêu phần tử?`,ans:[n],exp:`Số nhỏ nhất là ${f}, số lớn nhất là ${l}, hai số liền nhau cách nhau ${k}. Số phần tử: (${l} − ${f}) : ${k} + 1 = ${n}.`};}},
 {id:'h_tong',topic:'dt',level:'VD',unit:'',gen:()=>{const ev=RNG()<.5,a=ri(1,10),b=a+ri(12,30),l=range(a,b).filter(v=>ev?v%2===0:v%2===1),s=l.reduce((x,y)=>x+y,0);return{stem:`Cho ${nb(`A = {x ∈ ℕ | x là số ${ev?'chẵn':'lẻ'}, ${a} ≤ x ≤ ${b}}`)}. Tính tổng các phần tử của A.`,ans:[s],exp:`A = {${l[0]}; ${l[1]}; ...; ${l[l.length-1]}} có ${l.length} phần tử. Ghép số đầu với số cuối: (${l[0]} + ${l[l.length-1]}) · ${l.length} : 2 = ${s}.`};}},
 {id:'h_bachs',topic:'lk',level:'VD',unit:'số',gen:()=>{const z=RNG()<.5,d=z?[0].concat(sample(2,1,9)):sample(3,1,9),nums=[];for(const p of d)for(const q of d)for(const r of d)if(p!==q&&q!==r&&p!==r&&p!==0)nums.push(100*p+10*q+r);return{stem:`Viết tập hợp các số tự nhiên có ba chữ số khác nhau được lập từ ba chữ số ${L(d)}. Tập hợp đó có bao nhiêu phần tử?`,ans:[nums.length],exp:`Tập hợp đó là ${SET(asc(nums))}: ${nums.length} phần tử.${z?' Chữ số 0 không đứng ở hàng trăm.':''}`};}},
 {id:'h_gap',topic:'lk',level:'VD',unit:'số',gen:()=>{const k=sel([2,3,4]),R=twoDigit((t,u)=>t===k*u);return{stem:`Có bao nhiêu số tự nhiên có hai chữ số mà chữ số hàng chục gấp ${k} lần chữ số hàng đơn vị?`,ans:[R.length],exp:`Chữ số hàng đơn vị khác 0 (nếu bằng 0 thì chữ số hàng chục cũng bằng 0). Các số đó là ${L(R)}: ${R.length} số.`};}},
 {id:'h_trang',topic:'sp',level:'VD',unit:'chữ số',gen:()=>{const n=ri(110,350),c=9+180+3*(n-99);return{stem:`Để đánh số trang một cuốn sách từ trang 1 đến trang ${n} cần dùng tất cả bao nhiêu chữ số?`,ans:[c],exp:`Trang 1 đến 9: 9 chữ số. Trang 10 đến 99: 90 trang, 180 chữ số. Trang 100 đến ${n}: ${n-99} trang, ${3*(n-99)} chữ số. Tổng: ${c} chữ số.`};}},
 {id:'h_chung',topic:'pt',level:'VD',unit:'số',gen:()=>{const p=sel([2,3]),q=sel([5,7]),b=ri(40,90),l=range(1,b).filter(v=>v%p===0&&v%q===0);return{stem:`Cho ${nb(`A = {x ∈ ℕ* | x chia hết cho ${p}, x ≤ ${b}}`)} và ${nb(`B = {x ∈ ℕ* | x chia hết cho ${q}, x ≤ ${b}}`)}. Có bao nhiêu số vừa thuộc A vừa thuộc B?`,ans:[l.length],exp:`Số vừa chia hết cho ${p} vừa chia hết cho ${q} là các số chia hết cho ${p*q}: ${L(l)}. Có ${l.length} số.`};}}
].map(q=>Object.assign({type:'sa'},q))};

const PISA=[
 ()=>{for(;;){const names=shuffle(KIDS).slice(0,7),F=names.filter(()=>RNG()<.55),C=names.filter(()=>RNG()<.45);
   const both=F.filter(x=>C.includes(x)),oF=F.filter(x=>!C.includes(x)),none=names.filter(x=>!F.includes(x)&&!C.includes(x));
   if(F.length<3||C.length<2||!both.length||!oF.length||!none.length)continue;
   const others=names.filter(x=>x!==oF[0]);
   return {title:'Câu lạc bộ của lớp',ctx:`<p class="stem">Lớp trưởng ghi lại việc đăng kí câu lạc bộ của bảy bạn trong tổ 1 (dấu ✓ là có đăng kí). Gọi A là tập hợp các bạn đăng kí bóng đá, B là tập hợp các bạn đăng kí cờ vua.</p>${tbl(['Bạn','Bóng đá','Cờ vua'],names.map(x=>[x,F.includes(x)?'✓':'',C.includes(x)?'✓':'']))}`,qs:[
    saq('Tập hợp A có bao nhiêu phần tử?',F.length,'phần tử',`A = ${SET(F)}: ${F.length} phần tử.`,'sp','TH'),
    mcq('Bạn nào thuộc A nhưng không thuộc B?',oF[0],shuffle(both.concat(names.filter(x=>!F.includes(x)))).slice(0,3).map(x=>[x,F.includes(x)?`${x} đăng kí cả hai câu lạc bộ, nên ${x} ∈ B.`:`${x} không đăng kí bóng đá, nên ${x} ∉ A.`]),`Các bạn chỉ đăng kí bóng đá: ${L(oF)}.`,'pt','TH'),
    saq('Có bao nhiêu bạn vừa thuộc A vừa thuộc B?',both.length,'bạn',`Các bạn đăng kí cả hai câu lạc bộ: ${L(both)}.`,'sp','TH'),
    saq('Có bao nhiêu bạn trong tổ không thuộc A và cũng không thuộc B?',none.length,'bạn',`Các bạn không đăng kí câu lạc bộ nào: ${L(none)}.`,'sp','VD')]};}},
 ()=>{for(;;){const days=['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu'],T=days.filter(()=>RNG()<.6),V=days.filter(()=>RNG()<.5);
   const both=T.filter(d=>V.includes(d));if(T.length<3||T.length>4||V.length<2||!both.length||both.length===T.length)continue;
   const lT=d=>d;
   const key=a=>a.slice().sort().join('|'),wrongSets=[];[[T.concat([days.find(d=>!T.includes(d))]),'Có một ngày không có tiết Toán.'],[T.slice(1),'Còn thiếu một ngày có tiết Toán.'],[V,'Đây là các ngày có tiết Ngữ văn.'],[T.slice(0,-1),'Còn thiếu một ngày có tiết Toán.']].forEach(w=>{if(key(w[0])!==key(T)&&!wrongSets.some(x=>key(x[0])===key(w[0])))wrongSets.push(w);});if(wrongSets.length<3)continue;
   const notT=days.filter(d=>!T.includes(d));
   return {title:'Thời khoá biểu',ctx:`<p class="stem">Bảng sau cho biết những ngày nào trong tuần lớp 6B có tiết Toán, có tiết Ngữ văn (dấu ✓ là có). Gọi T là tập hợp các ngày có tiết Toán, V là tập hợp các ngày có tiết Ngữ văn.</p>${tbl(['Ngày','Toán','Ngữ văn'],days.map(d=>[d,T.includes(d)?'✓':'',V.includes(d)?'✓':'']))}`,qs:[
    mcq('Viết tập hợp T bằng cách liệt kê các phần tử, ta được:',SET(T.map(lT)),wrongSets.slice(0,3).map(w=>[SET(w[0].map(lT)),w[1]]),`T = ${SET(T.map(lT))}.`,'lk','TH'),
    mcq('Cách viết nào sau đây đúng?',`${notT[0]} ∉ T`,[[`${notT[0]} ∈ T`,`${notT[0]} không có tiết Toán.`],[`${T[0]} ∉ T`,`${T[0]} có tiết Toán.`],[`${T[T.length-1]} ∉ T`,`${T[T.length-1]} có tiết Toán.`]].filter((w,i,a)=>a.findIndex(z=>z[0]===w[0])===i),`${notT[0]} không có tiết Toán nên ${notT[0]} ∉ T.`,'pt','NB'),
    saq('Có bao nhiêu ngày vừa có tiết Toán vừa có tiết Ngữ văn?',both.length,'ngày',`Các ngày đó là ${L(both.map(lT))}.`,'sp','TH'),
    saq('Có bao nhiêu ngày thuộc T nhưng không thuộc V?',T.length-both.length,'ngày',`Các ngày có tiết Toán mà không có tiết Ngữ văn: ${L(T.filter(d=>!V.includes(d)).map(lT))}.`,'sp','VD')]};}},
 ()=>{for(;;){const names=shuffle(KIDS).slice(0,8),sc=names.map(()=>ri(4,10)),G=names.filter((_,i)=>sc[i]>=8),K=names.filter((_,i)=>sc[i]>=5&&sc[i]<8),lo=names.filter((_,i)=>sc[i]<5);
   if(G.length<2||G.length>5||!K.length)continue;
   const outG=names.filter(x=>!G.includes(x));
   return {title:'Bảng điểm kiểm tra',ctx:`<p class="stem">Bảng sau ghi điểm bài kiểm tra Toán của tám bạn. Gọi G là tập hợp các bạn được từ 8 điểm trở lên.</p>${tbl(['Bạn','Điểm'],names.map((x,i)=>[x,sc[i]]))}`,qs:[
    saq('Tập hợp G có bao nhiêu phần tử?',G.length,'phần tử',`G = ${SET(G)}: ${G.length} phần tử. Bạn được đúng 8 điểm cũng thuộc G.`,'sp','TH'),
    mcq('Cách viết nào sau đây đúng?',`${outG[0]} ∉ G`,[[`${outG[0]} ∈ G`,`${outG[0]} được ${sc[names.indexOf(outG[0])]} điểm, chưa đến 8 điểm.`],[`${G[0]} ∉ G`,`${G[0]} được ${sc[names.indexOf(G[0])]} điểm, từ 8 điểm trở lên.`],[`${G[1]} ∉ G`,`${G[1]} được ${sc[names.indexOf(G[1])]} điểm, từ 8 điểm trở lên.`]],`${outG[0]} được ${sc[names.indexOf(outG[0])]} điểm nên ${outG[0]} ∉ G.`,'pt','TH'),
    saq('Gọi K là tập hợp các bạn được từ 5 điểm đến dưới 8 điểm. K có bao nhiêu phần tử?',K.length,'phần tử',`K = ${SET(K)}: ${K.length} phần tử.`,'dt','VD'),
    saq('Gọi D là tập hợp các điểm số khác nhau xuất hiện trong bảng. D có bao nhiêu phần tử?',new Set(sc).size,'phần tử',`D = ${SET(asc([...new Set(sc)]))}: mỗi điểm số chỉ viết một lần, có ${new Set(sc).size} phần tử.`,'lk','VD')]};}},
 ()=>{for(;;){const w=sel(WORDS.filter(x=>lettersOf(x).length<nLetters(x)&&nLetters(x)>=6)),M=lettersOf(w),n=M.length,t=nLetters(w),c=ri(2,4);
   const acc=M.find(x=>plainLetter(x)!==x);
   const opts=[[SET(w.replace(/\s+/g,'').split('').map(bareLetter)),'Có chữ cái được viết nhiều lần; mỗi phần tử chỉ được viết một lần.'],[SET(M.slice(1)),`Còn thiếu chữ cái ${M[0]}.`],acc?[SET(M.map(x=>x===acc?plainLetter(x):x)),`${acc} và ${plainLetter(acc)} là hai chữ cái khác nhau.`]:[SET(M.concat(['X'])),'Từ này không có chữ X.']];
   return {title:'Làm khuôn chữ',ctx:`<p class="stem">Nhóm bạn Mai làm biển chữ "${w}" để trang trí lớp. Mỗi chữ cái khác nhau cần một khuôn để cắt; một khuôn dùng được nhiều lần. Không kể dấu thanh (dấu huyền, sắc, hỏi, ngã, nặng được vẽ thêm sau).</p>`,qs:[
    mcq(`Tập hợp K các chữ cái cần làm khuôn là:`,SET(M),opts,`Các chữ cái trong "${w}", mỗi chữ viết một lần: K = ${SET(M)}.`,'lk','TH'),
    saq('Nhóm cần làm bao nhiêu khuôn chữ?',n,'khuôn',`Số khuôn bằng số phần tử của K: ${n}.`,'sp','TH'),
    saq('Biển chữ có tất cả bao nhiêu chữ cái phải cắt (không kể dấu cách)?',t,'chữ cái',`Đếm từng chữ cái trong "${w}": ${t} chữ cái. Số này lớn hơn số khuôn vì có chữ cái lặp lại.`,'sp','TH'),
    saq(`Lớp làm ${c} biển chữ "${w}" giống nhau. Tổng số chữ cái phải cắt là bao nhiêu?`,c*t,'chữ cái',`Mỗi biển có ${t} chữ cái, ${c} biển có ${c} · ${t} = ${c*t} chữ cái (số khuôn vẫn là ${n}).`,'sp','VD')]};}}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'pt',fig:vong('M',[4,1,9,8],[7]),extra:'Với tập hợp M trong hình: 4 ∈ M, 1 ∈ M, 7 ∉ M.'},
  {k:'lk',fig:'<div class="figbox"><p>P = {0; 1; 2; 3; 4; 5}</p><p>L = {N; H; A; T; R; G} (các chữ cái trong từ NHA TRANG)</p></div>',extra:'Mỗi phần tử chỉ viết một lần, thứ tự tuỳ ý, cách nhau bởi dấu ";".'},
  {k:'dt',fig:'<div class="figbox"><p>P = {n ∈ ℕ | n < 6}</p><p>ℕ = {0; 1; 2; 3; ...}</p><p>ℕ* = {1; 2; 3; ...}</p></div>',extra:'n ∈ ℕ có nghĩa n là một số tự nhiên.'},
  {k:'sp',fig:'<div class="figbox"><p>{x ∈ ℕ | 5 ≤ x ≤ 12} có 12 − 5 + 1 = 8 phần tử</p><p>A = {1; 3; 5}, B = {3; 5; 7}: 3 và 5 vừa thuộc A vừa thuộc B</p></div>',extra:'Đếm cẩn thận, phần tử lặp lại chỉ tính một lần.'}
];

/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='th6_seen';
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
  const mcSlots=[['pt',['NB']],['lk',['NB','TH']],['dt',['NB','TH']],['sp',['NB']],['sp',['TH']],[null,['VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['pt','dt','sp'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=[
    pick(MC.filter(q=>q.topic==='pt'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='lk'&&q.level!=='VD'),used),
    pick(MC.filter(q=>q.topic==='dt'&&q.level==='TH'),used),
    pick(MC.filter(q=>q.topic==='sp'&&q.level==='TH'),used)
  ];
  const sa=[pick(SA.filter(q=>q.topic==='lk'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='sp'&&q.level!=='VD'),used)];
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
