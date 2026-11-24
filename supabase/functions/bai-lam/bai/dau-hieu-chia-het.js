// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ dau-hieu-chia-het/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "dau-hieu-chia-het";
export const TIEN_TO = "DH6-";

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


/* ============ Dấu hiệu chia hết: công cụ ============ */
const OV=s=>`<span\tstyle="text-decoration:overline">${s}</span>`;      // số viết có gạch trên (không có dấu cách trong thẻ để nb() không làm hỏng)
const dsum=n=>String(n).split('').reduce((s,c)=>s+(+c),0);
const dplus=n=>String(n).split('').join(' + ');
const FB_MC=()=>({stem:'Các số có chữ số tận cùng như thế nào thì chia hết cho 5?',opts:[{t:'0 hoặc 5'},{t:'Chỉ có 5',err:'Chữ số tận cùng 0 cũng chia hết cho 5: 1 930 ⋮ 5.'},{t:'0; 2; 4; 6; 8',err:'Đây là dấu hiệu chia hết cho 2.'},{t:'Có tổng các chữ số chia hết cho 5',err:'Dấu hiệu chia hết cho 5 dựa vào chữ số tận cùng.'}],ans:0,exp:'Các số có chữ số tận cùng là 0 hoặc 5 thì chia hết cho 5 và chỉ những số đó mới chia hết cho 5.'});
function tryGen(f){for(let n=0;n<200;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>String(o.t))).size===4)return r;}return FB_MC();}
const mkMC=(stem,right,wrongs,exp)=>({stem,opts:[{t:nb(right)}].concat(wrongs.map(w=>({t:nb(w[0]),err:w[1]}))),ans:0,exp});
function multOf(m,lo,hi){return m*ri(Math.ceil(lo/m),fl(hi/m));}
function notOf(m,lo,hi){for(;;){const x=ri(lo,hi);if(x%m)return x;}}
function pickN(lo,hi,pred){for(let k=0;k<2000;k++){const x=ri(lo,hi);if(pred(x))return x;}return null;}
// vì sao (theo dấu hiệu)
function sig(n,m){const L=String(n).slice(-1);
  if(m===2)return n%2?`${F(n)} có chữ số tận cùng là ${L} (lẻ) nên ${nd(n,2)}`:`${F(n)} có chữ số tận cùng là ${L} nên ${dv(n,2)}`;
  if(m===5)return n%5?`${F(n)} có chữ số tận cùng là ${L} (khác 0 và 5) nên ${nd(n,5)}`:`${F(n)} có chữ số tận cùng là ${L} nên ${dv(n,5)}`;
  const s=dsum(n);return `${F(n)} có tổng các chữ số ${dplus(n)} = ${s}${s%m?` không chia hết cho ${m} nên ${nd(n,m)}`:` chia hết cho ${m} nên ${dv(n,m)}`}`;}
const R4=()=>ri(1000,9999), R3=()=>ri(100,999);

/* ============ Câu nhiều lựa chọn ============ */
// d25: dấu hiệu chia hết cho 2, cho 5
function genWhich(m,lo,hi){return ()=>tryGen(()=>{const good=pickN(lo,hi,x=>x%m===0&&(m!==2||x%10!==0)),W=[];
  for(let k=0;k<60&&W.length<3;k++){let x;if(m===9&&RNG()<.6)x=pickN(lo,hi,y=>y%3===0&&y%9);else x=pickN(lo,hi,y=>y%m!==0);if(x&&!W.includes(x))W.push(x);}
  if(W.length<3)return null;
  return mkMC(`Số nào sau đây chia hết cho ${m}?`,F(good),W.map(x=>[F(x),`${sig(x,m)}.`]),`${sig(good,m)}.`);});}
function genNotWhich(m,lo,hi){return ()=>tryGen(()=>{const bad=pickN(lo,hi,x=>x%m!==0),W=[];
  for(let k=0;k<60&&W.length<3;k++){const x=pickN(lo,hi,y=>y%m===0);if(!W.includes(x))W.push(x);}
  return mkMC(`Số nào sau đây không chia hết cho ${m}?`,F(bad),W.map(x=>[F(x),`${sig(x,m)}.`]),`${sig(bad,m)}.`);});}
function genLast(){const v=ri(0,1);
  if(v===0)return FB_MC();
  return {stem:'Các số có chữ số tận cùng như thế nào thì chia hết cho 2?',opts:[{t:'0; 2; 4; 6; 8'},{t:'2; 4; 6; 8',err:'Chữ số tận cùng 0 cũng chia hết cho 2: 1 930 ⋮ 2.'},{t:'0 hoặc 5',err:'Đây là dấu hiệu chia hết cho 5.'},{t:'1; 3; 5; 7; 9',err:'Các số tận cùng lẻ không chia hết cho 2.'}].map(nbT),ans:0,exp:'Các số có chữ số tận cùng là 0, 2, 4, 6, 8 thì chia hết cho 2 và chỉ những số đó mới chia hết cho 2.'};}
function genBoth25(){return tryGen(()=>{const g=pickN(1000,9999,x=>x%10===0),a=pickN(1000,9999,x=>x%10===5),b=pickN(1000,9999,x=>x%2===0&&x%10!==0),c=pickN(1000,9999,x=>x%2&&x%5);
  return mkMC('Số nào sau đây chia hết cho cả 2 và 5?',F(g),[[F(a),`${sig(a,5)} nhưng ${nd(a,2)} (tận cùng lẻ).`],[F(b),`${sig(b,2)} nhưng ${nd(b,5)}.`],[F(c),`${F(c)} không chia hết cho 2 và cũng không chia hết cho 5.`]],`Chia hết cho cả 2 và 5 thì chữ số tận cùng phải là 0: ${F(g)}.`);});}
function genSubset(m){return ()=>tryGen(()=>{const L0=[];while(L0.length<5){const x=m===9||m===3?R3()*ri(1,9)%9000+1000:R4();if(!L0.includes(x))L0.push(x);}
  const G=L0.filter(x=>x%m===0);if(!G.length||G.length===5)return null;
  const fmt=a=>a.length?a.map(F).join('; '):'Không có số nào';
  const alt=m===9?L0.filter(x=>x%3===0):m===2?L0.filter(x=>x%5===0):m===5?L0.filter(x=>x%2===0):L0.filter(x=>x%9===0);
  const c=[{t:fmt(alt),err:m===9?'Đây là các số chia hết cho 3; số chia hết cho 9 phải có tổng các chữ số chia hết cho 9.':m===3?'Đây chỉ là các số chia hết cho 9; còn các số có tổng chữ số chia hết cho 3.':'Đã nhầm dấu hiệu chia hết cho 2 và cho 5.'},{t:fmt(L0.filter(x=>x%m)),err:'Đây là các số không chia hết.'},{t:fmt(G.slice(1)),err:`Còn thiếu ${F(G[0])}.`},{t:fmt(G.concat(L0.filter(x=>x%m).slice(0,1))),err:`Có số không chia hết cho ${m}.`}];
  const o=pickOpts(fmt(G),c);if(o.length<3)return null;
  return {stem:`Trong các số ${L0.map(F).join('; ')}, các số chia hết cho ${m} là:`,opts:[{t:nb(fmt(G))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:L0.map(x=>sig(x,m)).join('; ')+'.'};});}
function genSum(m){return ()=>tryGen(()=>{const mk=()=>{const a=R4(),b=R4();return RNG()<.6?[a,'+',b]:[Math.max(a,b),'−',Math.min(a,b)];};let good=null;const W=[];
  for(let k=0;k<200&&(!good||W.length<3);k++){const [a,o,b]=mk();const A=a%m===0,B=b%m===0;if(A&&B&&!good)good=[a,o,b];else if(A!==B&&W.length<3&&!W.some(w=>w[0]===a))W.push([a,o,b]);}
  if(!good||W.length<3)return null;const T=([a,o,b])=>`${F(a)} ${o} ${F(b)}`;
  return mkMC(`Không thực hiện phép tính, cho biết tổng (hiệu) nào sau đây chia hết cho ${m}?`,T(good),W.map(w=>[T(w),`${sig(w[0],m)}; ${sig(w[2],m)}; nên ${w[1]==='+'?'tổng':'hiệu'} không chia hết cho ${m}.`]),`${sig(good[0],m)}; ${sig(good[2],m)}; nên ${good[1]==='+'?'tổng':'hiệu'} chia hết cho ${m} (tính chất chia hết của một tổng).`);});}
function genRemLast(){return tryGen(()=>{const m=sel([2,5]),n=pickN(1000,99999,x=>x%m!==0),r=n%m;
  return mkMC(`Không thực hiện phép chia, cho biết ${F(n)} chia cho ${m} có số dư là:`,''+r,[[''+(n%10),`Đây là chữ số tận cùng; số dư phải nhỏ hơn ${m}.`],[''+(m===5?(r+1)%5:0),m===5?'Xét lại chữ số tận cùng.':`${F(n)} có chữ số tận cùng lẻ nên không chia hết cho 2.`],[''+(dsum(n)%m===r?(r+2)%(m+3)+m:dsum(n)%m),'Với 2 và 5, số dư phụ thuộc chữ số tận cùng, không phải tổng các chữ số.']],`${F(n)} = ${F(n-n%10)} + ${n%10}; ${dv(n-n%10,m)} nên ${F(n)} chia cho ${m} có cùng số dư với ${n%10} chia cho ${m}, là ${r}.`);});}
function genCountRange(){return tryGen(()=>{const m=sel([2,5,10]),lo=ri(10,60)*10+ri(1,9),hi=lo+ri(25,80);let c=0;for(let x=lo;x<=hi;x++)if(x%m===0)c++;const lab=m===10?'cả 2 và 5':m;
  return mkMC(`Có bao nhiêu số tự nhiên từ ${F(lo)} đến ${F(hi)} chia hết cho ${lab}?`,''+c,[[''+(c+1),'Đếm thừa một số.'],[''+(c-1),'Còn thiếu một số.'],[''+(m===10?fl((hi-lo)/5):m===5?fl((hi-lo)/2):fl((hi-lo)/5)),m===10?'Đã đếm các số tận cùng 0 hoặc 5; chia hết cho cả 2 và 5 thì tận cùng là 0.':'Đếm lại theo dấu hiệu.']].filter((z,i,A)=>z[0]!==''+c&&A.findIndex(w=>w[0]===z[0])===i).concat([[''+(c+2),'Đếm thừa.']]).slice(0,3),`Các số chia hết cho ${lab} có chữ số tận cùng ${m===2?'là 0, 2, 4, 6, 8':m===5?'là 0 hoặc 5':'là 0'}; từ ${F(lo)} đến ${F(hi)} có ${c} số.`);});}
// d39
function genWhy9(){return tryGen(()=>{const m=sel([3,9]),n=pickN(1000,99999,x=>x%m===0&&x%2===1);
  return mkMC(`Vì sao ${F(n)} chia hết cho ${m}?`,`Vì ${dplus(n)} = ${dsum(n)} chia hết cho ${m}`,[[`Vì chữ số tận cùng là ${n%10}`,`Dấu hiệu chia hết cho ${m} dựa vào tổng các chữ số.`],[`Vì ${F(n)} là số lẻ`,`Số lẻ chưa chắc chia hết cho ${m}: 11 ${ND} ${m}.`],[`Vì chữ số đầu tiên là ${String(n)[0]}`,'Phải xét tổng tất cả các chữ số.']],`${sig(n,m)}.`);});}
function gen3not9(){return tryGen(()=>{const g=pickN(100,9999,x=>x%3===0&&x%9),W=[[pickN(100,9999,x=>x%9===0),'Số này chia hết cho cả 9.'],[pickN(100,9999,x=>x%3!==0),'Tổng các chữ số không chia hết cho 3.'],[pickN(100,9999,x=>x%9===0),'Số này chia hết cho cả 9.']];if(W[0][0]===W[2][0])W[2]=[pickN(100,9999,x=>x%3&&x%2===0),'Tổng các chữ số không chia hết cho 3.'];
  return mkMC('Số nào sau đây chia hết cho 3 nhưng không chia hết cho 9?',F(g),W.map(([x,e])=>[F(x),`${sig(x,9)}. ${e}`]),`${F(g)} có tổng các chữ số bằng ${dsum(g)}: chia hết cho 3 nhưng không chia hết cho 9.`);});}
function genStmt(){const P=[
  ['Số chia hết cho 9 thì chia hết cho 3.',[['Số chia hết cho 3 thì chia hết cho 9.','Ví dụ 12 ⋮ 3 nhưng 12 ⋮̸ 9.'],['Số có chữ số tận cùng là 3 thì chia hết cho 3.','Ví dụ 13 ⋮̸ 3.'],['Số có chữ số tận cùng là 9 thì chia hết cho 9.','Ví dụ 19 ⋮̸ 9.']],'9 = 3 · 3 nên số chia hết cho 9 thì chia hết cho 3; tổng các chữ số chia hết cho 9 thì cũng chia hết cho 3.'],
  ['Số có chữ số tận cùng là 0 thì chia hết cho cả 2 và 5.',[['Số chia hết cho 5 thì chia hết cho 2.','Ví dụ 15 ⋮ 5 nhưng 15 ⋮̸ 2.'],['Số có tổng các chữ số chia hết cho 5 thì chia hết cho 5.','Ví dụ 23 có tổng chữ số 5 nhưng 23 ⋮̸ 5.'],['Số chia hết cho 2 thì có chữ số tận cùng là 0.','Ví dụ 14 ⋮ 2 nhưng tận cùng là 4.']],'Tận cùng 0 thuộc cả hai dấu hiệu chia hết cho 2 và cho 5.'],
  ['Số có tổng các chữ số chia hết cho 3 thì chia hết cho 3.',[['Số có tổng các chữ số chia hết cho 3 thì chia hết cho 9.','Ví dụ 12: tổng 3, nhưng 12 ⋮̸ 9.'],['Số lẻ thì chia hết cho 3.','Ví dụ 11 ⋮̸ 3.'],['Số có tổng các chữ số chia hết cho 2 thì chia hết cho 2.','Ví dụ 11 có tổng chữ số 2 nhưng 11 ⋮̸ 2.']],'Đó là dấu hiệu chia hết cho 3.']];
  const [r,W,e]=sel(P);return mkMC('Khẳng định nào sau đây đúng?',r,W,e);}
function genRem39(){return tryGen(()=>{const m=sel([3,9]),n=pickN(1000,99999,x=>x%m!==0),r=n%m,s=dsum(n);
  return mkMC(`Không thực hiện phép chia, cho biết ${F(n)} chia cho ${m} có số dư là:`,''+r,[[''+(n%10%m===r?(r+1)%m:n%10%m),'Với 3 và 9, số dư phụ thuộc tổng các chữ số, không phải chữ số tận cùng.'],[s<10&&s!==r?''+s:''+((r+2)%m),s<10?`${s} là tổng các chữ số; cần lấy số dư của tổng này khi chia cho ${m}.`:'Tính lại tổng các chữ số.'],[''+((r+m-1)%m===r?r+m:(r+m-1)%m),'Tính lại tổng các chữ số.']],`Một số viết được thành tổng các chữ số của nó cộng với một số chia hết cho 9 (nên cũng chia hết cho 3). ${dplus(n)} = ${s}, ${s} chia ${m} dư ${r}, nên ${F(n)} chia ${m} dư ${r}.`);});}
// tim: tìm chữ số
const STARS=['*'];
function starNum(len){const p=ri(len===3?1:0,len-1);return p;} // vị trí dấu *
function digitsFor(tpl,cond){const o=[];for(let d=0;d<=9;d++){const s=tpl.replace('*',d);if(s[0]==='0')continue;if(cond(+s))o.push(d);}return o;}
function genStar(m,level){return ()=>tryGen(()=>{const len=ri(3,4);let s=String(len===3?R3():R4()).split('');const p=(m===2||m===5)?len-1:ri(0,len-1);s[p]='*';const tpl=s.join('');if(tpl[0]==='*'&&m<=5)return null;
  const D=digitsFor(tpl,x=>x%m===0);if(!D.length||D.length===10)return null;
  const alt=m===2?digitsFor(tpl,x=>x%5===0):m===5?digitsFor(tpl,x=>x%2===0):m===9?digitsFor(tpl,x=>x%3===0):digitsFor(tpl,x=>x%9===0);
  const c=[{t:SET(alt),err:m===2||m===5?'Đã nhầm dấu hiệu chia hết cho 2 và cho 5.':m===9?'Đây là các chữ số làm cho số chia hết cho 3.':'Đây chỉ là các chữ số làm cho số chia hết cho 9.'},{t:SET(D.slice(1)),err:`Còn thiếu chữ số ${D[0]}.`},{t:SET(D.slice(0,-1)),err:`Còn thiếu chữ số ${D[D.length-1]}.`},{t:SET(range(0,9).filter(d=>!D.includes(d)).slice(0,Math.max(1,D.length))),err:`Các chữ số này làm cho số không chia hết cho ${m}.`}];
  const o=pickOpts(SET(D),c.filter(z=>z.t!=='{}'));if(o.length<3)return null;
  const known=dsum(tpl.replace('*',0));
  return {stem:`Thay dấu * bởi chữ số nào để số ${OV(tpl)} chia hết cho ${m}? Tập hợp các chữ số thích hợp là:`,opts:[{t:nb(SET(D))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,
    exp:m===2?'Chữ số tận cùng phải là 0, 2, 4, 6 hoặc 8.':m===5?'Chữ số tận cùng phải là 0 hoặc 5.':`Tổng các chữ số là ${known} + * phải chia hết cho ${m}: * ∈ ${SET(D)}${p===0?' (chữ số đầu khác 0)':''}.`};});}
function genStarBoth(){return tryGen(()=>{const pr=sel([[2,5],[2,3],[5,9],[2,9],[3,5],[5,3]]);let s=String(R4()).split('');s[3]='*';const tpl=s.join('');
  const D=digitsFor(tpl,x=>x%pr[0]===0&&x%pr[1]===0),A=digitsFor(tpl,x=>x%pr[0]===0),B=digitsFor(tpl,x=>x%pr[1]===0);
  const c=[{t:SET(A),err:`Đây là các chữ số làm số chia hết cho ${pr[0]}; còn phải chia hết cho ${pr[1]}.`},{t:SET(B),err:`Đây là các chữ số làm số chia hết cho ${pr[1]}; còn phải chia hết cho ${pr[0]}.`},{t:SET([...new Set(A.concat(B))].sort((x,y)=>x-y)),err:'Phải thoả mãn cả hai điều kiện cùng lúc.'},{t:'Không có chữ số nào',err:`Thử lại: ${D.length?SET(D):''}`},{t:SET(D.length?D.map(d=>(d+1)%10):[0]),err:'Kiểm tra lại cả hai dấu hiệu.'}];
  const right=D.length?SET(D):'Không có chữ số nào';const o=pickOpts(right,c.filter(z=>z.t!=='{}'));if(o.length<3)return null;
  return {stem:`Thay dấu * bởi chữ số nào để số ${OV(tpl)} chia hết cho cả ${pr[0]} và ${pr[1]}?`,opts:[{t:nb(right)}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`Chia hết cho ${pr[0]}: * ∈ ${SET(A)}; chia hết cho ${pr[1]}: * ∈ ${SET(B)}. Cả hai: ${D.length?SET(D):'không có'}.`};});}
function genTwoStar(){return tryGen(()=>{const m=sel([9,3]);const mid=String(ri(10,99));const tpl=`a${mid}b`;const S=[];
  for(let a=1;a<=9;a++)for(let b=0;b<=9;b++){const x=+(`${a}${mid}${b}`);if(x%10===0&&x%m===0)S.push([a,b]);}
  if(m===9&&S.length!==1)return null;if(m===3&&(S.length<2||S.length>4))return null;
  const right=S.map(([a,b])=>`a = ${a}, b = ${b}`).join('; hoặc ');
  const W=[];const tryW=(t,e)=>{if(t!==right&&!W.some(w=>w[0]===t))W.push([t,e]);};
  const [a0]=S[0],bad=shuffle(range(1,9).filter(a=>!S.some(z=>z[0]===a)));tryW(`a = ${a0}, b = 5`,'Chia hết cho cả 2 và 5 thì b = 0.');
  tryW(`a = ${bad[0]}, b = 0`,`Tổng các chữ số ${bad[0]} + ${mid.split('').join(' + ')} + 0 không chia hết cho ${m}.`);
  if(m===3)tryW(`a = ${a0}, b = 0`,'Còn những giá trị khác của a.');
  tryW(`a = ${bad[1]}, b = 0`,`Tổng các chữ số ${bad[1]} + ${mid.split('').join(' + ')} + 0 không chia hết cho ${m}.`);tryW(`a = ${a0}, b = 2`,'Chia hết cho 5 thì b là 0 hoặc 5; cho 2 thì b chẵn: b = 0.');
  if(W.length<3)return null;
  return mkMC(`Tìm các chữ số a, b để số ${OV(tpl)} chia hết cho cả 2, 5 và ${m}.`,right,W.slice(0,3),`Chia hết cho cả 2 và 5 nên b = 0. Tổng các chữ số a + ${mid.split('').join(' + ')} + 0 phải chia hết cho ${m}: ${right}.`);});}
function genDigits(){return tryGen(()=>{const m=sel([2,5,3]);let ds=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,m===3?4:3);if(!ds.includes(0)&&RNG()<.6)ds[0]=0;ds=ds.sort((x,y)=>x-y);
  const all=[];const perm=(pre,rest)=>{if(pre.length===3){if(pre[0]!==0)all.push(+pre.join(''));return;}rest.forEach((d,i)=>perm(pre.concat([d]),rest.filter((_,j)=>j!==i)));};perm([],ds);
  const G=all.filter(x=>x%m===0).sort((x,y)=>x-y);if(!G.length||G.length>8)return null;
  const alt=m===2?all.filter(x=>x%5===0):m===5?all.filter(x=>x%2===0):all.filter(x=>x%9===0);
  const c=[{t:SET(alt.sort((x,y)=>x-y)),err:m===3?'Đây chỉ là các số chia hết cho 9.':'Đã nhầm dấu hiệu chia hết cho 2 và cho 5.'},{t:SET(G.slice(1)),err:`Còn thiếu ${G[0]}.`},{t:SET(G.slice(0,-1)),err:`Còn thiếu ${G[G.length-1]}.`},{t:SET(G.concat(all.filter(x=>x%m).slice(0,1)).sort((x,y)=>x-y)),err:`Có số không chia hết cho ${m}.`},{t:SET(G.concat(G.length&&ds.includes(0)?[+(String(G[0]).slice(1)+String(G[0])[0])]:[]).filter((x,i,A)=>A.indexOf(x)===i&&x>=100).sort((x,y)=>x-y)),err:'Có số không thoả mãn.'}];
  const o=pickOpts(SET(G),c.filter(z=>z.t!=='{}'));if(o.length<3)return null;
  return {stem:`Dùng các chữ số ${L(ds)}, viết các số tự nhiên có ba chữ số khác nhau và chia hết cho ${m}. Các số đó là:`,opts:[{t:nb(SET(G))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`${m===2?'Chữ số tận cùng chẵn':m===5?'Chữ số tận cùng là 0 hoặc 5':'Tổng ba chữ số chia hết cho 3'}, chữ số hàng trăm khác 0: ${SET(G)}.`};});}
// kh: vận dụng, tổng hợp
function genGroup9(){return tryGen(()=>{const k=sel([3,9]),n=pickN(100,500,x=>RNG()<.5?x%k===0:x%k!==0),ok=n%k===0;
  return mkMC(`Khối 6 có ${n} học sinh đi dã ngoại. Cô phụ trách muốn chia đều số học sinh thành ${k} nhóm. Khẳng định nào đúng?`,ok?`Chia được, vì ${dplus(n)} = ${dsum(n)} chia hết cho ${k}`:`Không chia được, vì ${dplus(n)} = ${dsum(n)} không chia hết cho ${k}`,
    [[ok?`Không chia được, vì ${n} là số ${n%2?'lẻ':'chẵn'}`:`Chia được, vì ${n} là số ${n%2?'lẻ':'chẵn'}`,'Chia hết cho '+k+' dựa vào tổng các chữ số, không dựa vào chẵn lẻ.'],[ok?`Không chia được, vì chữ số tận cùng là ${n%10}`:`Chia được, vì chữ số tận cùng là ${n%10}`,'Phải xét tổng các chữ số.'],[ok?`Chia được, vì ${n} > ${k}`:`Chia được, vì ${n} > ${k}`,'Lớn hơn chưa chắc chia hết.']],`${sig(n,k)}.`);});}
function genTree(){return tryGen(()=>{const k=sel([3,5,9,2]),ok=RNG()<.6,L0=pickN(60,400,x=>ok?x%k===0:x%k!==0);
  return mkMC(`Trên bờ đất dài ${L0} m, bác nông dân trồng một hàng cây, hai cây liền nhau cách nhau ${k} m, có cây ở cả hai đầu bờ. Khẳng định nào đúng?`,ok?`Trồng được, cần ${L0/k+1} cây`:'Không trồng được như vậy',
    ok?[[`Trồng được, cần ${L0/k} cây`,'Có cây ở cả hai đầu nên số cây bằng số khoảng cộng thêm 1.'],[`Trồng được, cần ${L0/k+2} cây`,'Số cây bằng số khoảng cộng 1.'],['Không trồng được như vậy',`${sig(L0,k)}.`]]
      :[[`Trồng được, cần ${fl(L0/k)+1} cây`,`${sig(L0,k)}: không chia được thành các khoảng ${k} m.`],[`Trồng được, cần ${fl(L0/k)} cây`,`${sig(L0,k)}.`],[`Trồng được, cần ${fl(L0/k)+2} cây`,`${sig(L0,k)}.`]],
    `${sig(L0,k)}${ok?`; có ${L0/k} khoảng nên cần ${L0/k} + 1 = ${L0/k+1} cây`:''}.`);});}
function genSmall(){return tryGen(()=>{const C=sel([[2,5,3],[2,5,9],[2,9],[5,9],[2,3],[3,5]]),three=RNG()<.6,lo=three?100:1000,hi=three?999:9999,big=RNG()<.5;
  const ok=x=>C.every(m=>x%m===0);let v;if(big){v=hi;while(!ok(v))v--;}else{v=lo;while(!ok(v))v++;}
  const W=[];const near=d=>{let x=v+d;while(x>=lo&&x<=hi&&!ok(x))x+=d>0?1:-1;return x;};
  const nx=big?near(-1):near(1);W.push([F(nx),big?`Còn ${F(v)} lớn hơn.`:`Còn ${F(v)} nhỏ hơn.`]);
  const w2=big?v-ri(1,4):v+ri(1,4);if(!ok(w2))W.push([F(w2),C.map(m=>sig(w2,m)).filter(s=>s.includes(ND))[0]+'.']);
  const w3=big?(()=>{let x=hi;while(!(x%C[0]===0))x--;return x;})():(()=>{let x=lo;while(!(x%C[0]===0))x++;return x;})();if(!ok(w3))W.push([F(w3),`Mới chia hết cho ${C[0]}, chưa chia hết cho ${C.slice(1).join(' và ')}.`]);
  if(W.length<3){const w4=big?v-10:v+10;if(!ok(w4))W.push([F(w4),'Không thoả mãn đủ các dấu hiệu.']);}
  if(W.length<3)return null;
  return mkMC(`Số tự nhiên ${big?'lớn':'nhỏ'} nhất có ${three?'ba':'bốn'} chữ số chia hết cho cả ${C.join(', ').replace(/, (\d)$/,' và $1')} là:`,F(v),W.slice(0,3),`${C.map(m=>sig(v,m)).join('; ')}.`);});}
function genMultOf(){return tryGen(()=>{const m=sel([3,9,5]),b=pickN(100,9999,x=>x%m===0),W=[];for(let k=0;k<40&&W.length<3;k++){const x=m===9&&RNG()<.6?pickN(100,9999,y=>y%3===0&&y%9):pickN(100,9999,y=>y%m);if(!W.includes(x))W.push(x);}
  return mkMC(`Số nào sau đây thuộc ${BO(m)}?`,F(b),W.map(x=>[F(x),`${sig(x,m)} nên không là bội của ${m}.`]),`${sig(b,m)}, nên ${F(b)} là bội của ${m}.`);});}
function genSumWhy(){return tryGen(()=>{const m=sel([2,5,3,9]);let a,b;for(let k=0;k<100;k++){a=pickN(1000,9999,x=>x%m===0);b=pickN(1000,9999,x=>x%m!==0);if(a!==b)break;}const s=`${F(a)} + ${F(b)}`;
  return mkMC(`Không thực hiện phép tính, tổng ${s} có chia hết cho ${m} không?`,`Không, vì ${dv(a,m)} và ${nd(b,m)}`,[[`Có, vì ${dv(a,m)}`,`Còn ${nd(b,m)} nên tổng không chia hết.`],[`Có, vì ${dv(b,m)}`,`${sig(b,m)}.`],[`Không xác định được nếu chưa tính`,'Dùng dấu hiệu và tính chất chia hết của một tổng.']],`${sig(a,m)}; ${sig(b,m)}; nên tổng không chia hết cho ${m}.`);});}

const MC=[];
const addMC=(id,topic,level,gen,mix)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},mix?{mix}:{}));
const gW2=genWhich(2,1000,9999),gW5=genWhich(5,1000,9999),gN2=genNotWhich(2,1000,9999),gN5=genNotWhich(5,1000,9999),gW9=genWhich(9,100,9999),gW3=genWhich(3,100,9999),gN3=genNotWhich(3,100,9999);
addMC('m_w2','d25','NB',gW2);addMC('m_w5','d25','NB',gW5);addMC('m_n2','d25','NB',gN2);addMC('m_n5','d25','NB',gN5);addMC('m_last','d25','NB',genLast);
addMC('m_b25','d25','TH',genBoth25);addMC('m_sub2','d25','TH',genSubset(2));addMC('m_sub5','d25','TH',genSubset(5));addMC('m_sum5','d25','TH',genSum(5),[8]);addMC('m_sb3','tim','TH',genStarBoth);
addMC('m_rl','d25','VD',genRemLast,[8]);addMC('m_cr','d25','VD',genCountRange,[8]);
addMC('m_w9','d39','NB',gW9);addMC('m_w9b','d39','NB',genWhich(9,10000,99999));addMC('m_w2b','d25','NB',genWhich(2,10000,99999));addMC('m_w5b','d25','NB',genNotWhich(5,100,999));addMC('m_w3','d39','NB',gW3);addMC('m_n3','d39','NB',gN3);addMC('m_why','d39','NB',genWhy9);
addMC('m_3n9','d39','TH',gen3not9);addMC('m_sub9','d39','TH',genSubset(9));addMC('m_sub3','d39','TH',genSubset(3));addMC('m_st','d39','TH',genStmt);addMC('m_sum9','d39','TH',genSum(9),[8]);
addMC('m_r39','d39','VD',genRem39,[8]);addMC('m_ts2','tim','VD',genTwoStar);
addMC('m_s2','tim','NB',genStar(2));addMC('m_s5','tim','NB',genStar(5));addMC('m_s9','tim','TH',genStar(9));addMC('m_s3','tim','TH',genStar(3));
addMC('m_sb','tim','TH',genStarBoth);addMC('m_sb2','tim','VD',genStarBoth);addMC('m_ts','tim','VD',genTwoStar);addMC('m_dg','tim','TH',genDigits);addMC('m_dg2','tim','VD',genDigits);
addMC('m_g9','kh','TH',genGroup9);addMC('m_tree','kh','VD',genTree,[8]);addMC('m_sm','kh','VD',genSmall);addMC('m_sm2','kh','VD',genSmall);addMC('m_bo','kh','NB',genMultOf,[8]);addMC('m_sw','kh','TH',genSumWhy,[8]);

/* ============ Câu đúng sai ============ */
function tfStatic(pool,stem){return ()=>{const items=mixed(()=>shuffle(pool).slice(0,4).map(p=>sel(p)));return {stem,items:wrap(items)};};}
const POOL_A=[
  [IT('Các số có chữ số tận cùng là 0, 2, 4, 6, 8 thì chia hết cho 2.',true,'d25','NB','Dấu hiệu chia hết cho 2.'),IT('Các số có chữ số tận cùng là 2, 4, 6, 8 mới chia hết cho 2, còn tận cùng 0 thì không.',false,'d25','NB','Tận cùng 0 cũng chia hết cho 2: 120 ⋮ 2.')],
  [IT('Các số có chữ số tận cùng là 0 hoặc 5 thì chia hết cho 5.',true,'d25','NB','Dấu hiệu chia hết cho 5.'),IT('Chỉ các số có chữ số tận cùng là 5 mới chia hết cho 5.',false,'d25','NB','Tận cùng 0 cũng chia hết cho 5: 2 010 ⋮ 5.')],
  [IT('Các số có tổng các chữ số chia hết cho 9 thì chia hết cho 9.',true,'d39','NB','Dấu hiệu chia hết cho 9.'),IT('Các số có chữ số tận cùng là 9 thì chia hết cho 9.',false,'d39','NB','19 ⋮̸ 9.')],
  [IT('Các số có tổng các chữ số chia hết cho 3 thì chia hết cho 3.',true,'d39','NB','Dấu hiệu chia hết cho 3.'),IT('Các số có chữ số tận cùng là 3 thì chia hết cho 3.',false,'d39','NB','13 ⋮̸ 3.')],
  [IT('Một số chia hết cho 9 thì chia hết cho 3.',true,'d39','NB','Tổng các chữ số chia hết cho 9 thì chia hết cho 3.'),IT('Một số chia hết cho 3 thì chia hết cho 9.',false,'d39','NB','12 ⋮ 3 nhưng 12 ⋮̸ 9.')],
  [IT('Số có chữ số tận cùng là 0 thì chia hết cho cả 2 và 5.',true,'d25','NB','Tận cùng 0 thoả cả hai dấu hiệu.'),IT('Số chia hết cho 5 thì chia hết cho 2.',false,'d25','NB','15 ⋮ 5 nhưng 15 ⋮̸ 2.')]];
function numItem(level,ms,topicOf){const m=sel(ms),n=level==='NB'?ri(100,9999):ri(1000,99999),claim=RNG()<.5,v=claim===(n%m===0);return IT(claim?dv(n,m):nd(n,m),v,topicOf(m),level,`${sig(n,m)}.`);}
const tOf=m=>m===2||m===5?'d25':'d39';
function tfNums(level,ms){return ()=>{const items=mixed(()=>{const o=[];for(let i=0;i<4;i++)o.push(numItem(level,ms,tOf));return o;});return {stem:'Xét các khẳng định sau:',items:wrap(items)};};}
function tfOneNum(){const n=pickN(1000,99999,x=>[2,3,5,9].filter(m=>x%m===0).length===2||RNG()<.3);
  const items=mixed(()=>[2,5,3,9].map(m=>{const claim=RNG()<.5,v=claim===(n%m===0);return IT(`${F(n)} ${claim?DV:ND} ${m}`,v,tOf(m),'TH',`${sig(n,m)}.`);}));
  return {stem:`Cho số ${F(n)}. Xét các khẳng định sau:`,items:wrap(items)};}
function tfStar(){const m=sel([3,9]);let s=String(R4()).split('');const p=ri(1,3);s[p]='*';const tpl=s.join('');const D=digitsFor(tpl,x=>x%m===0);
  const items=mixed(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){const d=ri(0,9);if(used.has(d))return null;used.add(d);const x=+tpl.replace('*',d),cm=RNG()<.5?m:sel([2,5]);const claim=RNG()<.5,v=claim===(x%cm===0);
    o.push(IT(`Với * = ${d} thì ${OV(tpl)} ${claim?DV:ND} ${cm}.`,v,'tim','TH',`${sig(x,cm)}.`));}return o;});
  return {stem:`Cho số ${OV(tpl)} (dấu * là một chữ số). Xét các khẳng định sau:`,items:wrap(items)};}
function sumItem9(level){const m=sel([2,5,3,9]);let a=R4(),b=R4();const sub=RNG()<.4;if(sub&&a<b)[a,b]=[b,a];if(RNG()<.5)a=pickN(1000,9999,x=>x%m===0);if(RNG()<.6)b=pickN(1000,9999,x=>x%m===0);
  const A=a%m===0,B=b%m===0;if(!A&&!B)a=pickN(1000,9999,x=>x%m===0)||a;if(sub&&a<b)[a,b]=[b,a];
  const T=sub?a-b:a+b,claim=RNG()<.5,v=claim===(T%m===0);const s=`(${F(a)} ${sub?'−':'+'} ${F(b)})`;
  return IT(`${s} ${claim?DV:ND} ${m}`,v,tOf(m),level,`${sig(a,m)}; ${sig(b,m)}; nên ${s} ${T%m?ND:DV} ${m}.`);}
function tfSums(){const items=mixed(()=>{const o=[];for(let i=0;i<4;i++){const it=sumItem9('TH');if(!/⋮/.test(it.exp))return null;o.push(it);}return o;});return {stem:'Không thực hiện phép tính, xét các khẳng định sau:',items:wrap(items)};}
function tfDig(){const ds=shuffle([1,2,3,4,5,6,7,8,9]).slice(0,2).concat([0]).sort((x,y)=>x-y);const all=[];const perm=(pre,rest)=>{if(pre.length===3){if(pre[0]!==0)all.push(+pre.join(''));return;}rest.forEach((d,i)=>perm(pre.concat([d]),rest.filter((_,j)=>j!==i)));};perm([],ds);
  const c2=all.filter(x=>x%2===0).length,c5=all.filter(x=>x%5===0).length,c3=all.filter(x=>x%3===0).length;
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`Viết được tất cả ${v?all.length:all.length+2} số như vậy.`,v,'tim','VD',`Chữ số hàng trăm khác 0: ${SET(all.sort((x,y)=>x-y))}.`));}
    {const v=R();o.push(IT(`Có ${v?c2:c2+1} số chia hết cho 2.`,v,'tim','VD',`Các số tận cùng chẵn: ${SET(all.filter(x=>x%2===0))}.`));}
    {const v=R();o.push(IT(`Có ${v?c5:c5+1} số chia hết cho 5.`,v,'tim','VD',`Các số tận cùng 0 hoặc 5: ${SET(all.filter(x=>x%5===0))}.`));}
    {const v=R(),s=sum(ds),A=s%3===0;o.push(IT(v===A?'Mọi số trong các số đó đều chia hết cho 3.':'Không có số nào trong các số đó chia hết cho 3.',v,'tim','VD',`Mọi số đều có tổng các chữ số ${ds.join(' + ')} = ${s}${s%3?' không':''} chia hết cho 3.`));}
    return o;});
  return {stem:`Dùng ba chữ số ${L(ds)}, viết các số tự nhiên có ba chữ số khác nhau. Xét các phát biểu sau:`,items:wrap(items)};}
function tfTeams(){const u=RNG(),n=pickN(100,400,x=>u<.4?x%9===0:u<.7?(x%3===0&&x%9!==0):x%3!==0),r=n%9;
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`Tổng các chữ số của ${n} là ${v?dsum(n):dsum(n)+1}.`,v,'d39','VD',`${dplus(n)} = ${dsum(n)}.`));}
    {const v=R(),A=r===0;o.push(IT(v===A?'Chia được thành các đội 9 người mà không đội nào thiếu người.':'Có đội không đủ 9 người.',v,'d39','VD',`${sig(n,9)}.`));}
    {o.push(IT('Có thể chia thành các nhóm 3 người mà không nhóm nào thiếu người.',n%3===0,'d39','VD',`${sig(n,3)}.`));}
    {const v=R(),t=(9-r)%9||9;o.push(IT(`Nếu có thêm ${v?t:t%9+1} bạn thì chia được thành các đội 9 người vừa đủ.`,v,'kh','VD',`${n} chia 9 dư ${r} (tổng các chữ số ${dsum(n)} chia 9 dư ${r}); cần thêm ${t} bạn${r===0?' để có thêm một đội':''}.`));}
    return o;});
  return {stem:`Có ${n} học sinh tham gia chương trình bóng đá, được chia thành các đội, mỗi đội 9 học sinh. Xét các phát biểu sau:`,items:wrap(items)};}
function tfTreeTF(){const k=sel([2,3,5,9]),ok=RNG()<.6,L0=pickN(60,400,x=>ok?x%k===0:x%k!==0),k2=sel([2,3,5,9].filter(z=>z!==k));
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(v===ok?`Trồng được cây cách nhau ${k} m, có cây ở hai đầu.`:`Không trồng được cây cách nhau ${k} m, có cây ở hai đầu.`,v,'kh','VD',`${sig(L0,k)}.`));}
    {const v=R();o.push(IT(`Nếu trồng cách nhau ${k2} m (có cây ở hai đầu) thì ${L0%k2===0?(v?`cần ${L0/k2+1} cây`:`cần ${L0/k2} cây`):(v?'không trồng được':`cần ${fl(L0/k2)+1} cây`)}.`,v,'kh','VD',`${sig(L0,k2)}${L0%k2===0?`; ${L0/k2} khoảng nên ${L0/k2+1} cây`:''}.`));}
    {const v=R(),c=[2,3,5,9].filter(z=>L0%z===0).length;o.push(IT(`Trong các khoảng cách 2 m, 3 m, 5 m, 9 m, có ${v?c:c+1} khoảng cách trồng được.`,v,'kh','VD',[2,3,5,9].map(z=>sig(L0,z)).join('; ')+'.'));}
    {const v=R(),z=sel([2,5]);o.push(IT(`Bờ đất dài ${L0} m ${v===(L0%z===0)?'chia':'không chia'} được thành các đoạn ${z} m.`,v,'d25','VD',`${sig(L0,z)}.`));}
    return o;});
  return {stem:`Bác nông dân muốn trồng một hàng cây trên bờ đất dài ${L0} m, các cây cách đều nhau và có cây ở hai đầu bờ. Xét các phát biểu sau:`,items:wrap(items)};}
const TF=[];
const addTF=(id,topic,level,gen,mix)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},mix?{mix}:{}));
addTF('t_pa','d25','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));addTF('t_pb','d39','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));
addTF('t_n25','d25','NB',tfNums('NB',[2,5]));addTF('t_pc','d39','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));addTF('t_n39','d39','NB',tfNums('NB',[3,9]));addTF('t_nall','d39','NB',tfNums('NB',[2,3,5,9]));
addTF('t_one','d39','TH',tfOneNum);addTF('t_one2','d25','TH',tfOneNum);addTF('t_star','tim','TH',tfStar);addTF('t_star2','tim','TH',tfStar);addTF('t_sum','kh','TH',tfSums,[8]);
addTF('t_dig','tim','VD',tfDig);addTF('t_team','kh','VD',tfTeams,[8]);addTF('t_tree','kh','VD',tfTreeTF,[8]);

/* ============ Câu trả lời ngắn ============ */
const SA=[
 {id:'s_c2',topic:'d25',level:'NB',unit:'số',gen:()=>{const m=sel([2,5]),L0=[];while(L0.length<6){const x=R4();if(!L0.includes(x))L0.push(x);}if(!L0.some(x=>x%m===0))L0[0]=pickN(1000,9999,x=>x%m===0);return{stem:`Trong các số ${L0.map(F).join('; ')}, có bao nhiêu số chia hết cho ${m}?`,ans:[L0.filter(x=>x%m===0).length],exp:L0.map(x=>sig(x,m)).join('; ')+'.'};}},
 {id:'s_big5',topic:'d25',level:'TH',unit:'',gen:()=>{const m=sel([2,5,10]),three=RNG()<.5,lo=three?100:1000,hi=three?999:9999,big=RNG()<.5;let v=big?hi:lo;while(v%m)v+=big?-1:1;return{stem:`Tìm số ${big?'lớn':'nhỏ'} nhất có ${three?'ba':'bốn'} chữ số chia hết cho ${m===10?'cả 2 và 5':m}.`,ans:[v],exp:`${m===10?'Tận cùng là 0':m===5?'Tận cùng là 0 hoặc 5':'Tận cùng chẵn'}: ${F(v)}.`};}},
 {id:'s_rl',topic:'d25',level:'VD',unit:'',mix:[8],gen:()=>{const m=sel([2,5]),a=R4(),b=R4();return{stem:`Không thực hiện phép tính, tìm số dư khi chia ${F(a)} + ${F(b)} cho ${m}.`,ans:[(a+b)%m],exp:`Số dư khi chia cho ${m} chỉ phụ thuộc chữ số tận cùng: ${a%10} + ${b%10} = ${a%10+b%10}, chia cho ${m} dư ${(a+b)%m}.`};}},
 {id:'s_c9',topic:'d39',level:'NB',unit:'',gen:()=>{const n=R4();return{stem:`Tính tổng các chữ số của số ${F(n)}.`,ans:[dsum(n)],exp:`${dplus(n)} = ${dsum(n)}.`};}},
 {id:'s_cnt39',topic:'d39',level:'TH',unit:'số',gen:()=>{const m=sel([3,9]),L0=[];while(L0.length<6){const x=ri(100,9999);if(!L0.includes(x))L0.push(x);}if(!L0.some(x=>x%m===0))L0[2]=pickN(100,9999,x=>x%m===0);return{stem:`Trong các số ${L0.map(F).join('; ')}, có bao nhiêu số chia hết cho ${m}?`,ans:[L0.filter(x=>x%m===0).length],exp:L0.map(x=>sig(x,m)).join('; ')+'.'};}},
 {id:'s_r9',topic:'d39',level:'VD',unit:'',mix:[8],gen:()=>{const m=sel([3,9]),n=pickN(1000,99999,x=>x%m!==0);return{stem:`Không thực hiện phép chia, tìm số dư khi chia ${F(n)} cho ${m}.`,ans:[n%m],exp:`Tổng các chữ số ${dplus(n)} = ${dsum(n)} chia ${m} dư ${n%m}, nên ${F(n)} chia ${m} dư ${n%m}.`};}},
 {id:'s_t9',topic:'tim',level:'TH',unit:'',gen:()=>{for(;;){let s=String(R4()).split('');const p=ri(1,3);s[p]='*';const tpl=s.join('');const D=digitsFor(tpl,x=>x%9===0);if(D.length!==1)continue;return{stem:`Tìm chữ số * để số ${OV(tpl)} chia hết cho 9.`,ans:[D[0]],exp:`Tổng các chữ số ${dsum(tpl.replace('*',0))} + * phải chia hết cho 9 nên * = ${D[0]}.`};}}},
 {id:'s_t5',topic:'tim',level:'NB',unit:'',gen:()=>{const tpl=String(ri(100,999))+'*';return{stem:`Thay dấu * bởi chữ số khác 0 để số ${OV(tpl)} chia hết cho 5. Chữ số đó là bao nhiêu?`,ans:[5],exp:'Chia hết cho 5 thì chữ số tận cùng là 0 hoặc 5; khác 0 nên * = 5.'};}},
 {id:'s_t3',topic:'tim',level:'TH',unit:'chữ số',gen:()=>{let s=String(R4()).split('');const p=ri(1,3);s[p]='*';const tpl=s.join('');const D=digitsFor(tpl,x=>x%3===0);return{stem:`Có bao nhiêu chữ số thay được cho dấu * để số ${OV(tpl)} chia hết cho 3?`,ans:[D.length],exp:`Tổng các chữ số ${dsum(tpl.replace('*',0))} + * chia hết cho 3: * ∈ ${SET(D)}.`};}},
 {id:'s_tb',topic:'tim',level:'VD',unit:'',gen:()=>{for(;;){const m=sel([9,3]),mid=String(ri(10,99));const S=[];for(let a=1;a<=9;a++){const x=+(`${a}${mid}0`);if(x%m===0)S.push(a);}if(!S.length)continue;const q=m===9?'Tìm chữ số a':'Tính tổng tất cả các chữ số a thích hợp';if(m===9&&S.length!==1)continue;return{stem:`Số ${OV(`a${mid}b`)} chia hết cho cả 2, 5 và ${m}. ${q}.`,ans:[m===9?S[0]:sum(S)],exp:`b = 0; a + ${mid.split('').join(' + ')} chia hết cho ${m} nên a ∈ ${SET(S)}.`};}}},
 {id:'s_dg',topic:'tim',level:'VD',unit:'số',gen:()=>{const m=sel([2,5,3]);let ds=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,4).sort((x,y)=>x-y);const all=[];const perm=(pre,rest)=>{if(pre.length===3){if(pre[0]!==0)all.push(+pre.join(''));return;}rest.forEach((d,i)=>perm(pre.concat([d]),rest.filter((_,j)=>j!==i)));};perm([],ds);const G=all.filter(x=>x%m===0);return{stem:`Từ các chữ số ${L(ds)}, viết được bao nhiêu số tự nhiên có ba chữ số khác nhau và chia hết cho ${m}?`,ans:[G.length],exp:`Các số đó: ${G.length?SET(G.sort((x,y)=>x-y)):'không có'}.`};}},
 {id:'s_tree',topic:'kh',level:'VD',unit:'cây',mix:[8],gen:()=>{const k=sel([3,5,9]),L0=pickN(60,450,x=>x%k===0);return{stem:`Trên bờ đất dài ${L0} m, bác nông dân trồng một hàng cây, hai cây liền nhau cách nhau ${k} m, có cây ở cả hai đầu bờ. Bác cần bao nhiêu cây?`,ans:[L0/k+1],exp:`${sig(L0,k)}; có ${L0/k} khoảng nên cần ${L0/k+1} cây.`};}},
 {id:'s_need9',topic:'kh',level:'VD',unit:'học sinh',gen:()=>{const k=sel([3,9]),n=pickN(100,400,x=>x%k!==0),add=k-n%k;return{stem:`Khối 6 có ${n} học sinh. Cần thêm ít nhất bao nhiêu học sinh để chia đều được thành các nhóm, mỗi nhóm ${k} học sinh?`,ans:[add],exp:`${dplus(n)} = ${dsum(n)} chia ${k} dư ${n%k} nên ${n} chia ${k} dư ${n%k}; cần thêm ${k} − ${n%k} = ${add} học sinh.`};}},
 {id:'s_cr',topic:'kh',level:'TH',unit:'số',mix:[8],gen:()=>{const lo=ri(10,90)*10+ri(1,9),hi=lo+ri(30,90);let c=0;for(let x=lo+1;x<hi;x++)if(x%10===0)c++;return{stem:`Có bao nhiêu số tự nhiên x thoả mãn ${lo} < x < ${hi} và x chia hết cho cả 2 và 5?`,ans:[c],exp:`x có chữ số tận cùng là 0; đếm được ${c} số.`};}},
 {id:'s_sm',topic:'kh',level:'VD',unit:'',gen:()=>{const C=sel([[2,5,3],[2,5,9],[2,9],[5,9],[2,3]]),big=RNG()<.5;let v=big?999:100;while(!C.every(m=>v%m===0))v+=big?-1:1;return{stem:`Tìm số tự nhiên ${big?'lớn':'nhỏ'} nhất có ba chữ số chia hết cho cả ${C.join(', ').replace(/, (\d)$/,' và $1')}.`,ans:[v],exp:`${C.map(m=>sig(v,m)).join('; ')}.`};}},
 {id:'s_c9b',topic:'d39',level:'NB',unit:'',gen:()=>{const tpl='12*';return RNG()<.5?{stem:`Thay dấu * bởi một chữ số để được số ${OV(tpl)} chia hết cho 9.`,ans:[6],exp:'1 + 2 + * chia hết cho 9 nên * = 6.'}:(()=>{for(;;){const a=ri(1,9),b=ri(0,9);const D=digitsFor(`${a}${b}*`,x=>x%9===0);if(D.length===1)return{stem:`Thay dấu * bởi một chữ số để được số ${OV(`${a}${b}*`)} chia hết cho 9.`,ans:[D[0]],exp:`${a} + ${b} + * chia hết cho 9 nên * = ${D[0]}.`};}})();}},
 {id:'s_nb2',topic:'d25',level:'NB',unit:'',gen:()=>{const m=sel([2,3,5,9]),big=RNG()<.5;let v=big?99:10;while(v%m)v+=big?-1:1;return{stem:`Tìm số ${big?'lớn':'nhỏ'} nhất có hai chữ số chia hết cho ${m}.`,ans:[v],exp:`${sig(v,m)}.`};}},
 {id:'s_kh_nb',topic:'kh',level:'NB',unit:'số',gen:()=>{const L0=[];while(L0.length<6){const x=R4();if(!L0.includes(x))L0.push(x);}if(!L0.some(x=>x%10===0))L0[1]=pickN(1000,9999,x=>x%10===0);return{stem:`Trong các số ${L0.map(F).join('; ')}, có bao nhiêu số chia hết cho cả 2 và 5?`,ans:[L0.filter(x=>x%10===0).length],exp:'Chia hết cho cả 2 và 5 thì chữ số tận cùng là 0.'};}}
].map(q=>Object.assign({type:'sa'},q));

/* ============ Chủ đề ============ */
const TOPICS={
  d25:{short:'Chia hết cho 2, cho 5',name:'Dấu hiệu chia hết cho 2, cho 5',rule:'Các số có chữ số tận cùng là 0, 2, 4, 6, 8 thì chia hết cho 2 và chỉ những số đó mới chia hết cho 2. Các số có chữ số tận cùng là 0 hoặc 5 thì chia hết cho 5 và chỉ những số đó mới chia hết cho 5.',tip:'Chỉ nhìn chữ số tận cùng; tận cùng 0 thì chia hết cho cả 2 và 5.'},
  d39:{short:'Chia hết cho 9, cho 3',name:'Dấu hiệu chia hết cho 9, cho 3',rule:'Các số có tổng các chữ số chia hết cho 9 thì chia hết cho 9 và chỉ những số đó mới chia hết cho 9. Các số có tổng các chữ số chia hết cho 3 thì chia hết cho 3 và chỉ những số đó mới chia hết cho 3.',tip:'Số chia hết cho 9 thì chia hết cho 3, nhưng số chia hết cho 3 chưa chắc chia hết cho 9 (12 ⋮ 3, 12 ⋮̸ 9).'},
  tim:{short:'Tìm chữ số',name:'Tìm chữ số, viết số chia hết',rule:'Thay dấu * để số chia hết cho 2, 5: xét chữ số tận cùng; cho 3, 9: xét tổng các chữ số. Chữ số đầu tiên của một số phải khác 0.',tip:'Chia hết cho cả 2 và 5 thì chữ số tận cùng là 0; tìm b trước rồi mới tìm a.'},
  kh:{short:'Vận dụng',name:'Vận dụng dấu hiệu chia hết',rule:'Kết hợp dấu hiệu chia hết với tính chất chia hết của một tổng để xét tổng, hiệu; giải các bài toán chia nhóm, trồng cây, tìm số lớn nhất hay nhỏ nhất thoả mãn nhiều dấu hiệu.',tip:'Trồng cây có cây ở hai đầu: số cây = số khoảng + 1.'}
};
const TKEYS=['d25','d39','tim','kh'];
const TDESC={d25:'Xét chữ số tận cùng',d39:'Xét tổng các chữ số',tim:'Thay dấu * bởi chữ số thích hợp',kh:'Tổng, hiệu, chia nhóm, trồng cây, số lớn nhất, nhỏ nhất'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhận ra số chia hết cho 2, 5, 3, 9 theo dấu hiệu; thay * ở chữ số tận cùng.',TH:'Chọn các số chia hết trong một nhóm số, thay * để chia hết cho 3, 9, xét tổng hiệu, chia hết cho cả hai số.',VD:'Tìm hai chữ số, số dư khi chia, viết số từ các chữ số, bài toán chia nhóm, trồng cây.'};

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
function tfHard(){for(;;){const n=ri(3,12);
  const P=[
    [IT('Số chia hết cho cả 2 và 5 thì có chữ số tận cùng là 0.',true,'d25','VD','Tận cùng chẵn và tận cùng 0 hoặc 5 nên tận cùng là 0.'),IT('Số chia hết cho 2 hoặc cho 5 thì có chữ số tận cùng là 0.',false,'d25','VD','Ví dụ 12 ⋮ 2 nhưng tận cùng là 2.')],
    [IT(`Số 10<sup>${n}</sup> − 1 chia hết cho 9.`,true,'d39','VD',`10<sup>${n}</sup> − 1 = ${'9'.repeat(n)}, tổng các chữ số ${9*n} chia hết cho 9.`),IT(`Số 10<sup>${n}</sup> + 1 chia hết cho 3.`,false,'d39','VD',`10<sup>${n}</sup> + 1 = 1${'0'.repeat(n-1)}1, tổng các chữ số bằng 2.`)],
    [IT('Nếu một số có tổng các chữ số chia hết cho 9 thì số đó chia hết cho 3.',true,'d39','VD','Tổng các chữ số chia hết cho 9 thì cũng chia hết cho 3.'),IT('Nếu một số chia hết cho 3 thì tổng các chữ số của nó chia hết cho 9.',false,'d39','VD','12 ⋮ 3 nhưng tổng các chữ số bằng 3.')],
    [IT('Trong hai số tự nhiên liên tiếp, luôn có một số chia hết cho 2.',true,'d25','VD','Hai số liên tiếp có chữ số tận cùng một chẵn một lẻ.'),IT('Trong hai số tự nhiên liên tiếp, luôn có một số chia hết cho 5.',false,'d25','VD','Ví dụ 1 và 2 đều không chia hết cho 5.')],
    [IT('Số có dạng aaa (ba chữ số giống nhau) luôn chia hết cho 3.',true,'d39','VD','Tổng các chữ số a + a + a = 3a chia hết cho 3.'),IT('Số có dạng aaa (ba chữ số giống nhau) luôn chia hết cho 9.',false,'d39','VD','111 có tổng các chữ số bằng 3, không chia hết cho 9.')]];
  const its=wrap(shuffle(P).slice(0,4).map(p=>sel(p)));if(tfOK(its))return {stem:'Xét các khẳng định sau:',items:its};}}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'d39',level:'VD',gen:tfHard}],sa:[
 {id:'h_ab',topic:'tim',level:'VD',unit:'số',gen:()=>{for(;;){const m=sel([3,9]),q=sel([5,2]),mid=String(ri(10,99));let c=0;const S=[];for(let a=1;a<=9;a++)for(let b=0;b<=9;b++){const x=+(`${a}${mid}${b}`);if(x%q===0&&x%m===0){c++;S.push(x);}}if(c<2||c>12)continue;return{stem:`Có bao nhiêu số có dạng ${OV(`a${mid}b`)} chia hết cho cả ${q} và ${m}?`,ans:[c],exp:`${q===5?'b ∈ {0; 5}':'b chẵn'}; với mỗi b, chọn a để tổng các chữ số chia hết cho ${m}. Các số: ${SET(S)}.`};}}},
 {id:'h_dig',topic:'tim',level:'VD',unit:'số',gen:()=>{for(;;){const m=sel([5,2,3]);const ds=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,5).sort((x,y)=>x-y);if(!ds.includes(0))continue;let c=0;for(let x=100;x<=999;x++){const s=String(x);if(new Set(s).size===3&&s.split('').every(d=>ds.includes(+d))&&x%m===0)c++;}if(c<3)continue;return{stem:`Từ các chữ số ${L(ds)} lập được bao nhiêu số tự nhiên có ba chữ số khác nhau và chia hết cho ${m}?`,ans:[c],exp:m===3?'Chọn bộ ba chữ số có tổng chia hết cho 3, rồi đếm cách sắp xếp (chữ số hàng trăm khác 0).':`Đếm theo chữ số tận cùng (${m===5?'0 hoặc 5':'chẵn'}), chữ số hàng trăm khác 0: có ${c} số.`};}}},
 {id:'h_pow',topic:'d39',level:'VD',unit:'',mix:[8],gen:()=>{const n=ri(5,30),c=ri(1,40),m=sel([3,9]);const r=(1+dsum(c))%m;return{stem:`Tìm số dư khi chia 10<sup>${n}</sup> + ${c} cho ${m}.`,ans:[r],exp:`10<sup>${n}</sup> + ${c} = 1${'0'.repeat(Math.max(0,n-String(c).length))}${c} có tổng các chữ số 1 + ${String(c).split('').join(' + ')} = ${1+dsum(c)}, chia ${m} dư ${r}.`};}},
 {id:'h_sum',topic:'kh',level:'VD',unit:'',mix:[8],gen:()=>{const lo=ri(10,60),hi=lo+ri(30,60);let s=0;for(let x=lo+1;x<hi;x++)if(x%10===0)s+=x;return{stem:`Tính tổng tất cả các số tự nhiên x thoả mãn ${lo} < x < ${hi} và x chia hết cho cả 2 và 5.`,ans:[s],exp:`x có chữ số tận cùng 0: các số đó có tổng bằng ${s}.`};}},
 {id:'h_big',topic:'kh',level:'VD',unit:'',gen:()=>{for(;;){const pre=ri(1,9),C=sel([[2,3,5],[2,9],[5,9],[2,5,9]]);let best=-1;for(let x=pre*1000;x<pre*1000+1000;x++){const s=String(x);if(new Set(s).size===4&&C.every(m=>x%m===0))best=x;}if(best<0)continue;return{stem:`Tìm số lớn nhất có bốn chữ số khác nhau, có chữ số hàng nghìn là ${pre} và chia hết cho cả ${C.join(', ').replace(/, (\d)$/,' và $1')}.`,ans:[best],exp:`${C.map(m=>sig(best,m)).join('; ')}; các chữ số khác nhau. Số lớn nhất là ${F(best)}.`};}}},
 {id:'h_bill',topic:'tim',level:'VD',unit:'',gen:()=>{for(;;){const p=sel([9,3]),k=ri(120,1100),T=p*k,s=String(T);if(s.length<4)continue;const pos=ri(1,s.length-2);const tpl=s.slice(0,pos)+'*'+s.slice(pos+1);const D=digitsFor(tpl,x=>x%p===0);if(D.length!==1)continue;return{stem:`Mỗi hộp bút giá ${p} nghìn đồng. Hoá đơn mua một số hộp bút ghi tổng tiền là ${OV(tpl)} nghìn đồng, trong đó một chữ số bị mờ (dấu *). Tìm chữ số bị mờ.`,ans:[D[0]],exp:`Tổng tiền chia hết cho ${p} nên tổng các chữ số ${dsum(tpl.replace('*',0))} + * chia hết cho ${p}: * = ${D[0]}.`};}}}
].map(q=>Object.assign({type:'sa'},q))};

const qsOK=u=>u.qs.every(q=>q.type!=='mc'||(q.opts.length===4&&new Set(q.opts.map(o=>o.t)).size===4));
const mx=(q,m)=>Object.assign(q,{mix:m});
const PISA=[
 ()=>{for(;;){const L0=ri(60,400),K=[2,3,5,9],fail=K.filter(k=>L0%k);if(fail.length!==1)continue;const f=fail[0],P=['Ổi','Cau','Chuối','Dừa'],DS=shuffle(K),plant=Object.fromEntries(P.map((p,i)=>[p,DS[i]])),pf=P.find(p=>plant[p]===f),pg=sel(P.filter(p=>p!==pf)),need=f-L0%f;
   const u={title:'Trồng cây trên bờ đất',ctx:`<p class="stem">Bác Nam có một bờ đất dài ${L0} m. Bác muốn trồng một hàng cây cách đều nhau, có cây ở cả hai đầu bờ. Bảng sau ghi khoảng cách giữa hai cây liền nhau cho từng loại cây.</p>${tbl(['Loại cây','Khoảng cách (m)'],P.map(p=>[p,plant[p]]))}`,qs:[
    mcq('Loại cây nào không trồng được như bác Nam muốn?',pf,P.filter(p=>p!==pf).map(p=>[p,`${sig(L0,plant[p])} nên trồng được.`]),`${sig(L0,f)}.`,'kh','TH'),
    saq(`Nếu trồng ${pg.toLowerCase()} thì cần bao nhiêu cây?`,L0/plant[pg]+1,'cây',`${L0} : ${plant[pg]} = ${L0/plant[pg]} khoảng, cần ${L0/plant[pg]} + 1 = ${L0/plant[pg]+1} cây.`,'kh','TH'),
    mx(saq(`Muốn trồng ${pf.toLowerCase()} như vậy thì bờ đất phải dài thêm ít nhất bao nhiêu mét?`,need,'m',`${L0} chia ${f} dư ${L0%f}; bội nhỏ nhất của ${f} lớn hơn ${L0} là ${L0+need}, cần thêm ${need} m.`,'kh','VD'),[8])]};if(qsOK(u))return u;}},
 ()=>{for(;;){const n=ri(150,480),K=[2,3,5,9];const ok=K.filter(k=>n%k===0);if(ok.length<1||ok.length>2)continue;const no=K.filter(k=>n%k);const k0=sel(no),add=k0-n%k0;
   const u={title:'Xếp hàng đồng diễn',ctx:`<p class="stem">Khối 6 có ${n} học sinh tham gia đồng diễn thể dục. Thầy tổng phụ trách cần xếp tất cả học sinh thành các hàng có số bạn như nhau.</p>${tbl(['Cách xếp','Số bạn mỗi hàng'],[['Cách 1',2],['Cách 2',3],['Cách 3',5],['Cách 4',9]])}`,qs:[
    saq(`Tổng các chữ số của số ${n} bằng bao nhiêu?`,dsum(n),'',`${dplus(n)} = ${dsum(n)}.`,'d39','NB'),
    mcq('Khẳng định nào sau đây đúng?',`Cách ${K.indexOf(k0)+1} không xếp được`,ok.map(k=>[`Cách ${K.indexOf(k)+1} không xếp được`,`${sig(n,k)} nên xếp được.`]).concat(no.filter(k=>k!==k0).map(k=>[`Cách ${K.indexOf(k)+1} xếp được`,`${sig(n,k)}.`])).concat([[`Cách ${K.indexOf(k0)+1} xếp được`,`${sig(n,k0)}.`]]).slice(0,3),`${sig(n,k0)}.`,'d39','TH'),
    saq(`Có bao nhiêu cách trong bảng xếp được?`,ok.length,'cách',K.map(k=>sig(n,k)).join('; ')+'.','kh','TH'),
    mx(saq(`Cần thêm ít nhất bao nhiêu bạn để xếp được theo cách ${K.indexOf(k0)+1}?`,add,'bạn',`${n} chia ${k0} dư ${n%k0}, cần thêm ${k0} − ${n%k0} = ${add} bạn.`,'kh','VD'),[8])]};if(qsOK(u))return u;}},
 ()=>{for(;;){const m=sel([9,3]),mid=String(ri(10,99)),S=[];for(let a=1;a<=9;a++)if(+(`${a}${mid}0`)%m===0)S.push(a);if(m===9&&S.length!==1)continue;if(m===3&&S.length<2)continue;const w=String(ri(10,99));let c=0;for(let a=1;a<=9;a++)for(const b of [0,5])if(+(`${a}${w}${b}`)%3===0)c++;
   const u={title:'Mật mã vali',ctx:`<p class="stem">Mật mã vali của Lan là một số có bốn chữ số dạng ${OV(`a${mid}b`)}. Lan để lại gợi ý:</p>${tbl(['Gợi ý','Nội dung'],[['1','Mật mã chia hết cho 2'],['2','Mật mã chia hết cho 5'],['3',`Mật mã chia hết cho ${m}`]])}`,qs:[
    mcq('Từ gợi ý 1 và 2, chữ số b là:','0',[['5','Chia hết cho 2 thì b chẵn, nên b ≠ 5.'],['2','Chia hết cho 5 thì b là 0 hoặc 5.'],['0 hoặc 5','Còn phải chia hết cho 2 nên b = 0.']],'Chia hết cho cả 2 và 5 thì chữ số tận cùng là 0.','tim','NB'),
    m===9?saq('Chữ số a là bao nhiêu?',S[0],'',`a + ${mid.split('').join(' + ')} + 0 chia hết cho 9 nên a = ${S[0]}.`,'tim','TH'):saq('Có bao nhiêu mật mã thoả mãn cả ba gợi ý?',S.length,'mật mã',`a ∈ ${SET(S)}.`,'tim','TH'),
    saq(`Bạn Hà cũng đặt mật mã dạng ${OV(`a${w}b`)}, chia hết cho 5 và cho 3. Có bao nhiêu mật mã như vậy?`,c,'mật mã',`b ∈ {0; 5}; với mỗi b chọn a (khác 0) để tổng các chữ số chia hết cho 3: có ${c} số.`,'tim','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const p=sel([9,3]),k=ri(120,999),T=p*k,s=String(T);if(s.length<4)continue;const pos=ri(1,s.length-2),tpl=s.slice(0,pos)+'*'+s.slice(pos+1),D=digitsFor(tpl,x=>x%p===0);if(D.length!==1)continue;const q=p===9?3:9,k2=ri(100,700),T2=q*k2;
   const u={title:'Hoá đơn bị mờ',ctx:`<p class="stem">Cửa hàng văn phòng phẩm bán vở theo tập. Một hoá đơn bị mờ mất một chữ số của tổng tiền.</p>${tbl(['Mặt hàng','Giá mỗi tập (nghìn đồng)','Tổng tiền (nghìn đồng)'],[['Vở kẻ ngang',p,OV(tpl)],['Vở kẻ ô',q,F(T2)]])}`,qs:[
    mcq('Tổng tiền mua vở kẻ ngang chắc chắn chia hết cho số nào?',''+p,[[p===9?'2':'9',p===9?'Chưa biết chữ số tận cùng chẵn hay lẻ của số tập.':`Giá mỗi tập là ${p}, tổng tiền chia hết cho ${p}, chưa chắc chia hết cho 9.`],['5','Chưa chắc: chữ số tận cùng có thể khác 0 và 5.'],['10','Chưa chắc: chữ số tận cùng có thể khác 0.']],`Tổng tiền = ${p} · (số tập) nên chia hết cho ${p}.`,'kh','NB'),
    saq('Chữ số bị mờ là bao nhiêu?',D[0],'',`Tổng các chữ số ${dsum(tpl.replace('*',0))} + * phải chia hết cho ${p}: * = ${D[0]}.`,'tim','TH'),
    saq('Đã mua bao nhiêu tập vở kẻ ngang?',k,'tập',`${F(T)} : ${p} = ${k}.`,'kh','VD'),
    mx(saq('Nếu gộp cả hai hoá đơn, tổng tiền chia cho 9 dư bao nhiêu?',(T+T2)%9,'',`${F(T)} + ${F(T2)} = ${F(T+T2)}; tổng các chữ số ${dsum(T+T2)} chia 9 dư ${(T+T2)%9}.`,'kh','VD'),[8])]};if(qsOK(u))return u;}}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'d25',fig:'<div class="figbox"><p>1 930; 1 954 ⋮ 2 (tận cùng chẵn); 1 975 ⋮̸ 2</p><p>1 930; 1 945 ⋮ 5 (tận cùng 0 hoặc 5); 1 954 ⋮̸ 5</p></div>',extra:'Chỉ cần nhìn chữ số tận cùng.'},
  {k:'d39',fig:'<div class="figbox"><p>71 001: 7 + 1 + 0 + 0 + 1 = 9 ⋮ 9 nên 71 001 ⋮ 9</p><p>4 683: 4 + 6 + 8 + 3 = 21 ⋮ 3 nên 4 683 ⋮ 3</p></div>',extra:'Xét tổng các chữ số.'},
  {k:'tim',fig:'<div class="figbox"><p>12* ⋮ 9: 1 + 2 + * ⋮ 9 nên * = 6</p><p>345* ⋮ 5: * ∈ {0; 5}</p></div>',extra:'Chữ số đầu tiên phải khác 0.'},
  {k:'kh',fig:'<div class="figbox"><p>1 985 ⋮̸ 2, 2 020 ⋮ 2 nên (1 985 + 2 020) ⋮̸ 2</p><p>Bờ 108 m, cây cách 9 m: 108 : 9 = 12 khoảng, 13 cây</p></div>',extra:'Kết hợp với tính chất chia hết của một tổng.'}
];

/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='dh6_seen';
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
  const mcSlots=[['d25',['NB']],['d39',['NB']],['tim',['NB','TH']],['d39',['TH']],['kh',['TH']],[null,['VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['d39','tim','kh'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=[
    pick(MC.filter(q=>q.topic==='d25'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='d39'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='tim'&&q.level!=='VD'),used),
    pick(MC.filter(q=>q.topic==='kh'&&q.level==='TH'),used)
  ];
  const sa=[pick(SA.filter(q=>q.topic==='tim'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='d39'&&q.level!=='VD'),used)];
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
