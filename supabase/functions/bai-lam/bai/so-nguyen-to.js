// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ so-nguyen-to/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "so-nguyen-to";
export const TIEN_TO = "NT6-";

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


/* ============ Số nguyên tố: công cụ ============ */
const OV=s=>`<span\tstyle="text-decoration:overline">${s}</span>`;
const isP=n=>{if(n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;};
const PR=range(2,1000).filter(isP);
const spf=n=>{for(let d=2;d*d<=n;d++)if(n%d===0)return d;return n;};
function fac(n){const o=[];let d=2;while(n>1){if(n%d===0){let e=0;while(n%d===0){n/=d;e++;}o.push([d,e]);}d++;}return o;}
const FS=f=>f.map(([p,e])=>e>1?`${p}<sup>${e}</sup>`:''+p).join(' · ');      // 2<sup>3</sup> · 3
const fval=f=>f.reduce((s,[p,e])=>s*Math.pow(p,e),1);
const whyC=n=>{const d=spf(n);return `${F(n)} = ${d} · ${F(n/d)} nên ${F(n)} có thêm ước ${d} (ngoài 1 và chính nó), ${F(n)} là hợp số`;};
const whyP=n=>`${F(n)} chỉ có hai ước là 1 và ${F(n)} nên là số nguyên tố`;
const kind=n=>n<2?'không là số nguyên tố, cũng không là hợp số':isP(n)?'là số nguyên tố':'là hợp số';
const whyN=n=>n<2?`${n} không là số nguyên tố, cũng không là hợp số`:isP(n)?whyP(n):whyC(n);
const oddComp=(lo,hi)=>pickN(lo,hi,x=>x%2&&!isP(x)&&x%5);     // hợp số "khó nhận": lẻ, không tận cùng 5
const primeIn=(lo,hi)=>sel(PR.filter(p=>p>=lo&&p<=hi));
function mkNum(ps,minE){let f=shuffle(ps).slice(0,ri(2,3)).sort((x,y)=>x-y).map(p=>[p,ri(1,p<=3?3:p<=5?2:1)]);if(minE&&!f.some(z=>z[1]>1))f[0][1]=2;return f;}
const FB_MC=()=>({stem:'Số nguyên tố là:',opts:[{t:'Số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó'},{t:'Số tự nhiên lẻ',err:'9 lẻ nhưng có ước 3; 2 chẵn nhưng là số nguyên tố.'},{t:'Số tự nhiên chỉ có một ước',err:'Chỉ số 1 có đúng một ước, và 1 không là số nguyên tố.'},{t:'Số tự nhiên không chia hết cho 2',err:'9 không chia hết cho 2 nhưng là hợp số.'}],ans:0,exp:'Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó.'});
function tryGen(f){for(let n=0;n<200;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>String(o.t))).size===4)return r;}return FB_MC();}
const mkMC=(stem,right,wrongs,exp)=>({stem,opts:[{t:nb(right)}].concat(wrongs.map(w=>({t:nb(w[0]),err:w[1]}))),ans:0,exp});
function pickN(lo,hi,pred){for(let k=0;k<3000;k++){const x=ri(lo,hi);if(pred(x))return x;}return null;}

/* ============ Hình: sơ đồ cột, sơ đồ cây ============ */
function colFig(n,hide){ // hide: tập chỉ số ô bị ẩn, dạng 'L2' (cột trái hàng 2) hoặc 'R1'
  const rows=[];let x=n;while(x>1){const p=spf(x);rows.push([x,p]);x/=p;}rows.push([1,'']);
  const td=(v,k,side)=>`<td style="padding:3px 12px;border:none;text-align:${side==='L'?'right':'left'};${side==='L'?'border-right:2px solid currentColor;':''}">${hide.has(side+k)?'<b style="color:var(--accent,#2563eb)">?</b>':v}</td>`;
  return {rows,html:`<div class="figbox" style="max-width:220px"><table role="img" aria-label="Sơ đồ cột phân tích số ${n} ra thừa số nguyên tố" style="border-collapse:collapse;font-size:18px;margin:auto">${rows.map((r,k)=>`<tr>${td(r[0],k,'L')}${td(r[1],k,'R')}</tr>`).join('')}</table></div>`};}
function treeFig(n,hideRoot,hideIdx){ // sơ đồ cây kiểu Hình 2.3: n = p × m, m = q × r ...
  const nodes=[];let x=n,cx=160,cy=26,lv=0;nodes.push({v:n,x:cx,y:cy});
  while(!isP(x)){const p=spf(x),m=x/p;const L={v:p,x:cx-55,y:cy+58},R={v:m,x:cx+55,y:cy+58};nodes.push(L,R);L.par=nodes.indexOf(nodes.find(z=>z.x===cx&&z.y===cy));R.par=L.par;cx+=55;cy+=58;x=m;lv++;}
  const W=Math.max(...nodes.map(z=>z.x))+40,H=cy+34;
  const q=i=>(i===0&&hideRoot)||hideIdx.has(i);
  let s='';nodes.forEach((z,i)=>{if(i>0){const P=nodes[z.par];s+=`<line x1="${P.x}" y1="${P.y+17}" x2="${z.x}" y2="${z.y-17}" stroke="currentColor" stroke-width="1.5"/>`;}});
  nodes.forEach((z,i)=>{if(i>0&&i%2===1){const R=nodes[i+1];s+=`<text x="${(z.x+R.x)/2}" y="${z.y+6}" text-anchor="middle" font-size="15" fill="currentColor">×</text>`;}});
  nodes.forEach((z,i)=>{s+=`<circle cx="${z.x}" cy="${z.y}" r="17" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="${z.x}" y="${z.y+6}" text-anchor="middle" font-size="${String(z.v).length>2?13:16}" fill="currentColor" font-weight="${q(i)?700:400}">${q(i)?'?':z.v}</text>`;});
  return {nodes,html:`<div class="figbox" style="max-width:${W+10}px"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Sơ đồ cây phân tích một số ra thừa số nguyên tố" style="width:100%;max-width:${W}px;height:auto;display:block;color:var(--ink)">${s}</svg></div>`};}

/* ============ Câu nhiều lựa chọn ============ */
// nt: số nguyên tố, hợp số
function genWhichPrime(lo,hi){return ()=>tryGen(()=>{const p=primeIn(lo,hi),W=[];for(let k=0;k<50&&W.length<3;k++){const c=RNG()<.7?oddComp(lo,hi):pickN(lo,hi,x=>!isP(x));if(c&&!W.includes(c))W.push(c);}if(W.length<3)return null;
  return mkMC('Số nào sau đây là số nguyên tố?',F(p),W.map(c=>[F(c),whyC(c)+'.']),whyP(p)+'.');});}
function genWhichComp(lo,hi){return ()=>tryGen(()=>{const c=RNG()<.6?oddComp(lo,hi):pickN(lo,hi,x=>!isP(x)),W=[];for(let k=0;k<50&&W.length<3;k++){const p=primeIn(lo,hi);if(!W.includes(p))W.push(p);}if(W.length<3)return null;
  return mkMC('Số nào sau đây là hợp số?',F(c),W.map(p=>[F(p),whyP(p)+'.']),whyC(c)+'.');});}
function genDef(){if(RNG()<.5)return FB_MC();
  return {stem:'Hợp số là:',opts:[{t:'Số tự nhiên lớn hơn 1, có nhiều hơn hai ước'},{t:'Số tự nhiên không phải là số nguyên tố',err:'Số 0 và số 1 không là số nguyên tố, cũng không là hợp số.'},{t:'Số tự nhiên chẵn',err:'2 chẵn nhưng là số nguyên tố; 9 lẻ nhưng là hợp số.'},{t:'Số tự nhiên có đúng hai ước',err:'Số có đúng hai ước là số nguyên tố.'}],ans:0,exp:'Hợp số là số tự nhiên lớn hơn 1, có nhiều hơn hai ước.'};}
function gen01(){const P=[['Số 0 và số 1 không là số nguyên tố, cũng không là hợp số',[['Số 1 là số nguyên tố','Số 1 chỉ có một ước.'],['Số 0 là hợp số','Hợp số phải lớn hơn 1.'],['Số 2 là hợp số','2 chỉ có hai ước 1 và 2.']]],
  ['Số 2 là số nguyên tố chẵn duy nhất',[['Mọi số nguyên tố đều là số lẻ','2 là số nguyên tố chẵn.'],['Mọi số lẻ đều là số nguyên tố','9 lẻ nhưng là hợp số.'],['Số 1 là số nguyên tố nhỏ nhất','Số nguyên tố nhỏ nhất là 2.']]]];const [r,W]=sel(P);
  return mkMC('Khẳng định nào sau đây đúng?',r,W,'Số nguyên tố là số tự nhiên lớn hơn 1 chỉ có hai ước; 2 là số nguyên tố chẵn duy nhất; 0 và 1 không là số nguyên tố, cũng không là hợp số.');}
function genWhyComp(){return tryGen(()=>{const m=sel([2,3,5,9]),n=pickN(1001,2999,x=>x%m===0&&(m!==3||x%9)&&(m===2?x%5&&x%3:m===5?x%2&&x%3:x%2&&x%5));if(!n)return null;const lab=m===2||m===5?`có chữ số tận cùng là ${n%10}`:`có tổng các chữ số chia hết cho ${m}`;
  return mkMC(`Vì sao ${F(n)} là hợp số?`,`Vì ${F(n)} ${lab} nên có thêm ước ${m}`,[[`Vì ${F(n)} lớn hơn 1 000`,'Số lớn chưa chắc là hợp số: 1 009 là số nguyên tố.'],[`Vì ${F(n)} là số ${n%2?'lẻ':'chẵn'}`,n%2?'Số lẻ chưa chắc là hợp số: 7 là số nguyên tố.':'Cần nói rõ: chia hết cho 2 và lớn hơn 2.'],[`Vì ${F(n)} có bốn chữ số`,'Số chữ số không quyết định số nguyên tố hay hợp số.']],`${F(n)} ${lab} nên ${F(n)} ⋮ ${m}; ngoài 1 và chính nó, ${F(n)} còn có ước ${m} nên là hợp số.`);});}
function genSetPrime(){return tryGen(()=>{const L0=[];while(L0.length<6){const x=RNG()<.45?primeIn(10,120):RNG()<.6?oddComp(10,120):ri(0,120);if(!L0.includes(x))L0.push(x);}const G=L0.filter(isP).sort((a,b)=>a-b);if(!G.length)return null;
  const c=[{t:SET(G.slice(1)),err:`Thiếu ${G[0]}.`},{t:SET(L0.filter(x=>x%2===1).sort((a,b)=>a-b)),err:'Số lẻ chưa chắc là số nguyên tố.'},{t:SET(G.concat(L0.filter(x=>!isP(x)).slice(0,1)).sort((a,b)=>a-b)),err:'Có số không là số nguyên tố.'},{t:SET(L0.filter(x=>x>1&&!isP(x)).sort((a,b)=>a-b)),err:'Đây là các hợp số.'}];
  const o=pickOpts(SET(G),c.filter(z=>z.t!=='{}'));if(o.length<3)return null;
  return {stem:`Trong các số ${L(L0)}, tập hợp các số nguyên tố là:`,opts:[{t:nb(SET(G))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:L0.map(whyN).join('; ')+'.'};});}
function genCountRange(){return tryGen(()=>{const lo=ri(1,80),hi=lo+ri(12,25),c=PR.filter(p=>p>=lo&&p<=hi).length;let odd=0;for(let x=lo;x<=hi;x++)if(x%2&&x>1)odd++;
  return mkMC(`Có bao nhiêu số nguyên tố lớn hơn hoặc bằng ${lo} và nhỏ hơn hoặc bằng ${hi}?`,''+c,[[''+(c+1),'Có một số được đếm nhưng là hợp số.'],[''+(c-1>=0?c-1:c+2),'Còn thiếu một số nguyên tố.'],[''+(odd===c||odd===c+1||odd===c-1?c+3:odd),'Không phải số lẻ nào cũng là số nguyên tố.']],`Các số nguyên tố đó: ${PR.filter(p=>p>=lo&&p<=hi).join('; ')||'không có'}.`);});}
function genParity(){return tryGen(()=>{const OP=PR.filter(p=>p>2&&p<20);const a=shuffle(OP).slice(0,3).sort((x,y)=>x-y),b=shuffle(OP).slice(0,2).sort((x,y)=>x-y),pa=a[0]*a[1]*a[2],pb=b[0]*b[1],A=pa+pb;if(A%3===0)return null;
  return mkMC(`Không tính giá trị, cho biết A = ${a.join(' · ')} + ${b.join(' · ')} là số nguyên tố hay hợp số?`,'Hợp số, vì A chia hết cho 2 và A > 2',[['Số nguyên tố, vì A là tổng của các tích số nguyên tố','Tổng các tích số nguyên tố chưa chắc là số nguyên tố.'],['Hợp số, vì A chia hết cho 3',`A = ${F(A)} không chia hết cho 3.`],['Số nguyên tố, vì A là số lẻ','Hai tích đều là tích các số lẻ nên đều lẻ; tổng hai số lẻ là số chẵn.']],`Hai tích đều là số lẻ nên A là số chẵn, A ⋮ 2 và A > 2, do đó A là hợp số (A = ${F(A)}).`);});}
function genStarPrime(){return tryGen(()=>{const two=RNG()<.5;const tpl=two?(RNG()<.5?`${ri(1,9)}*`:`*${sel([1,3,7,9])}`):`${ri(1,9)}*${sel([1,3,7,9])}`;
  const D=[];for(let d=0;d<=9;d++){const s=tpl.replace('*',d);if(s[0]==='0')continue;if(isP(+s))D.push(d);}if(!D.length||D.length>6)return null;
  const odd=range(0,9).filter(d=>{const s=tpl.replace('*',d);return s[0]!=='0'&&+s%2;});
  const c=[{t:SET(odd),err:'Số lẻ chưa chắc là số nguyên tố.'},{t:SET(D.slice(1)),err:`Thiếu chữ số ${D[0]}.`},{t:SET(D.concat(range(0,9).filter(d=>!D.includes(d)&&tpl.replace('*',d)[0]!=='0').slice(0,1)).sort((x,y)=>x-y)),err:'Có chữ số làm cho số là hợp số.'},{t:SET(D.slice(0,-1)),err:`Thiếu chữ số ${D[D.length-1]}.`}];
  const o=pickOpts(SET(D),c.filter(z=>z.t!=='{}'));if(o.length<3)return null;
  return {stem:`Thay dấu * bởi chữ số nào để số ${OV(tpl)} là số nguyên tố? Tập hợp các chữ số thích hợp là:`,opts:[{t:nb(SET(D))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:range(0,9).filter(d=>tpl.replace('*',d)[0]!=='0').map(d=>`${tpl.replace('*',d)} ${kind(+tpl.replace('*',d))}`).join('; ')+'.'};});}
// pt: phân tích ra thừa số nguyên tố
function genFact(level){return ()=>tryGen(()=>{const f=mkNum(level==='NB'?[2,3,5]:[2,3,5,7,11],true),n=fval(f);if(n>2000||n<12)return null;const R=FS(f);
  const big=f.find(z=>z[1]>1),W=[];
  W.push([FS(f.map(z=>z===big?[z[0],z[1]-1]:z)),`Tính lại: ${FS(f.map(z=>z===big?[z[0],z[1]-1]:z))} = ${F(n/big[0])}.`]);
  {const p=big[0];const comp=f.filter(z=>z!==big).map(z=>FS([z]));W.push([[p*p].concat(big[1]>2?[FS([[p,big[1]-2]])]:[]).concat(comp).join(' · '),`${p*p} không là số nguyên tố.`]);}
  W.push([f.map(([p,e])=>`${p} · ${e}`).filter(()=>true).join(' · ').replace(/ · 1(?= ·|$)/g,''),'Luỹ thừa p<sup>e</sup> là tích e thừa số p, không phải p · e.']);
  W.push([FS(f.map(z=>z===big?[z[0],z[1]+1]:z)),`Tính lại: ${FS(f.map(z=>z===big?[z[0],z[1]+1]:z))} = ${F(n*big[0])}.`]);
  const o=pickOpts(R,W.map(w=>({t:w[0],err:w[1]})));if(o.length<3)return null;
  return {stem:`Phân tích số ${F(n)} ra thừa số nguyên tố, ta được:`,opts:[{t:nb(R)}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`${F(n)} = ${f.map(([p,e])=>Array(e).fill(p).join(' · ')).join(' · ')} = ${R}.`};});}
function genFromFact(){return tryGen(()=>{const f=mkNum([2,3,5,7],true),n=fval(f);if(n>3000)return null;const s=f.reduce((t,[p,e])=>t+p*e,0),noE=f.reduce((t,[p])=>t*p,1);
  return mkMC(`Số tự nhiên có dạng phân tích ra thừa số nguyên tố là ${FS(f)} là:`,F(n),[[F(noE),'Chưa tính luỹ thừa.'],[F(n*f[0][0]),'Tính lại các luỹ thừa.'],[F(s),'Đã cộng thay vì nhân.']].filter(w=>w[0]!==F(n)),`${FS(f)} = ${f.map(([p,e])=>Array(e).fill(p).join(' · ')).join(' · ')} = ${F(n)}.`);});}
function genNam(){return tryGen(()=>{const f=mkNum([2,3,5,7],true),n=fval(f);if(n>2000)return null;const big=f.find(z=>z[1]>1),p=big[0];
  const parts=[];f.forEach(([q,e])=>{if(q===p){parts.push(p*p);for(let i=2;i<e;i++)parts.push(p);}else for(let i=0;i<e;i++)parts.push(q);});const wrong=parts.sort((x,y)=>x-y).join(' · ');
  return mkMC(`Bạn Nam phân tích ${F(n)} = ${wrong}. Nhận xét nào đúng?`,`Nam sai vì ${p*p} không là số nguyên tố; đúng là ${F(n)} = ${FS(f)}`,[['Nam đúng vì tích bằng '+F(n),'Các thừa số đều phải là số nguyên tố.'],[`Nam sai vì phải viết ${F(n)} = ${f.map(([q,e])=>Array(e).fill(q).join(' · ')).join(' + ')}`,'Phân tích là viết thành tích, không phải tổng.'],[`Nam sai vì ${F(n)} là số nguyên tố`,whyC(n)+'.']],`${p*p} = ${p} · ${p} không là số nguyên tố. ${F(n)} = ${FS(f)}.`);});}
function genColumn(){return tryGen(()=>{const f=mkNum([2,3,5,7],false),n=fval(f);if(n>800||n<20)return null;const {rows}=colFig(n,new Set());if(rows.length<4)return null;
  const k1=ri(1,rows.length-2),k2=ri(0,rows.length-3)===k1?k1+1:ri(0,rows.length-2);if(k1===k2)return null;const H=new Set(['L'+k1,'R'+k2]);const {html}=colFig(n,H);
  const order=[['L',k1],['R',k2]].sort((a,b)=>a[1]-b[1]||(a[0]==='L'?-1:1));const val=([s,k])=>rows[k][s==='L'?0:1];const right=order.map(val).join(' và ');
  const W=[[order.map(([s,k])=>s==='L'?rows[k][0]*rows[k][1]:rows[k][0]).join(' và '),'Số ở cột trái của hàng dưới bằng số hàng trên chia cho ước nguyên tố nhỏ nhất.'],[order.map(val).reverse().join(' và '),'Đã đổi thứ tự hai số.'],[order.map(([s,k])=>s==='L'?val([s,k])+1:spf(val([s,k])+1)===val([s,k])+1?val([s,k])+2:val([s,k])+1).join(' và '),'Kiểm tra lại phép chia ở mỗi hàng.']];
  return {stem:`Các số còn thiếu (theo thứ tự từ trên xuống) trong sơ đồ cột phân tích số ${F(n)} ra thừa số nguyên tố là:`,fig:html,opts:[{t:right}].concat(W.filter(w=>w[0]!==right).map(w=>({t:w[0],err:w[1]}))).slice(0,4),ans:0,exp:`Mỗi hàng: chia số ở cột trái cho ước nguyên tố nhỏ nhất của nó. ${rows.slice(0,-1).map(r=>`${r[0]} : ${r[1]} = ${r[0]/r[1]}`).join('; ')}. Vậy ${F(n)} = ${FS(fac(n))}.`};});}
function genTree(){return tryGen(()=>{const f=mkNum([2,3,5,7],false),n=fval(f);if(n>400||n<12)return null;const T0=treeFig(n,false,new Set());if(T0.nodes.length<5)return null;
  const idx=shuffle(range(1,T0.nodes.length-1)).slice(0,2).sort((a,b)=>a-b);if(T0.nodes[idx[0]].par===T0.nodes[idx[1]].par)return null;const T=treeFig(n,false,new Set(idx));const v=idx.map(i=>T0.nodes[i].v);const right=v.join(' và ');
  const W=[[v.slice().reverse().join(' và '),'Đã đổi thứ tự (đọc từ trên xuống, từ trái sang phải).'],[v.map(x=>isP(x)?x+2:x/spf(x)).join(' và '),'Mỗi số bằng tích hai số nối với nó ở hàng dưới.'],[v.map(x=>x+1).join(' và '),'Kiểm tra lại các phép nhân.']];
  return {stem:`Các số còn thiếu (đọc từ trên xuống, từ trái sang phải) trong sơ đồ cây phân tích số ${F(n)} ra thừa số nguyên tố là:`,fig:T.html,opts:[{t:right}].concat(W.filter(w=>w[0]!==right).map(w=>({t:w[0],err:w[1]}))).slice(0,4),ans:0,exp:`${T0.nodes.filter(z=>!isP(z.v)).map(z=>`${z.v} = ${spf(z.v)} × ${z.v/spf(z.v)}`).join('; ')}. Vậy ${F(n)} = ${FS(fac(n))}.`};});}
function genPrimeDivs(){return tryGen(()=>{const f=mkNum([2,3,5,7,11,13],false),n=fval(f);if(n>3000||f.length<2)return null;const P=f.map(z=>z[0]);const D=divs(n);
  const comp=D.filter(d=>d>1&&!isP(d));const c=[{t:SET(P.slice(1)),err:`Thiếu ${P[0]}.`},{t:SET(P.concat(comp.slice(0,1)).sort((a,b)=>a-b)),err:`${comp[0]} không là số nguyên tố.`},{t:SET([1].concat(P)),err:'1 không là số nguyên tố.'},{t:SET(D.filter(d=>d>1&&d<n).slice(0,P.length)),err:'Đây là các ước, chưa chắc là số nguyên tố.'}];
  const o=pickOpts(SET(P),c.filter(z=>z.t!=='{}'));if(o.length<3)return null;
  return {stem:`Tập hợp các ước nguyên tố của ${F(n)} là:`,opts:[{t:nb(SET(P))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`${F(n)} = ${FS(f)} nên các ước nguyên tố là ${L(P)}.`};});}
function genSmallestPF(){return tryGen(()=>{const n=pickN(30,400,x=>!isP(x)&&spf(x)>2&&RNG()<.8||(!isP(x)&&x%2===0));const p=spf(n),cd=divs(n).find(d=>d>1&&!isP(d));
  return mkMC(`Ước nguyên tố nhỏ nhất của ${n} là:`,''+p,[['1','1 không là số nguyên tố.'],[''+(cd||n),`${cd||n} không là số nguyên tố.`],[''+(fac(n).length>1?fac(n)[1][0]:p===2?3:2),fac(n).length>1?`Còn ${p} nhỏ hơn.`:`${n} không chia hết cho số này.`]].filter((w,i,A)=>w[0]!==''+p&&A.findIndex(z=>z[0]===w[0])===i),`${F(n)} = ${FS(fac(n))}; ước nguyên tố nhỏ nhất là ${p}.`);});}
// ung: ứng dụng phân tích
function genPowProd(){return tryGen(()=>{const B=sel([[4,2,2],[8,2,3],[9,3,2],[27,3,3],[25,5,2]]),C=sel([[4,2,2],[8,2,3],[9,3,2],[27,3,3],[25,5,2],[6,null,null],[10,null,null]].filter(z=>z[0]!==B[0]&&z[1]!==B[1])),m=ri(2,5),k=ri(2,5);
  const ex={};const add=(p,e)=>{ex[p]=(ex[p]||0)+e;};add(B[1],B[2]*m);if(C[1])add(C[1],C[2]*k);else fac(C[0]).forEach(([p,e])=>add(p,e*k));const f=Object.keys(ex).map(Number).sort((a,b)=>a-b).map(p=>[p,ex[p]]);const R=FS(f);
  const wE={};const add2=(p,e)=>{wE[p]=(wE[p]||0)+e;};add2(B[1],B[2]+m);if(C[1])add2(C[1],C[2]+k);else fac(C[0]).forEach(([p,e])=>add2(p,e+k));const W1=FS(Object.keys(wE).map(Number).sort((a,b)=>a-b).map(p=>[p,wE[p]]));
  const W2=FS(f.map(([p,e])=>[p,e===1?2:e-1])),W3=`${B[0]}<sup>${m}</sup> · ${C[0]}<sup>${k}</sup>`;
  return mkMC(`Phân tích A = ${B[0]}<sup>${m}</sup> · ${C[0]}<sup>${k}</sup> ra thừa số nguyên tố, ta được:`,R,[[W1,`(a<sup>2</sup>)<sup>m</sup> là tích m thừa số a<sup>2</sup>: số mũ nhân lên, không cộng.`],[W2,'Tính lại số mũ của từng thừa số.'],[W3,`${B[0]} và ${C[0]} không là số nguyên tố.`]],`${B[0]} = ${FS(fac(B[0]))}, ${C[0]} = ${FS(fac(C[0]))} nên A = ${R}.`);});}
function genDivsFromFact(){return tryGen(()=>{const f=sel([[[2,2],[3,1]],[[2,1],[3,2]],[[2,2],[5,1]],[[2,1],[7,1]],[[3,1],[5,1]],[[2,3],[3,1]],[[2,2],[7,1]],[[3,2],[5,1]],[[2,1],[3,1],[5,1]],[[2,4]],[[3,3]]]),n=fval(f),D=divs(n);
  const c=[{t:SET(D.slice(1)),err:'Thiếu ước 1.'},{t:SET(D.slice(0,-1)),err:`Thiếu ${n}.`},{t:SET(f.map(z=>z[0])),err:'Đây chỉ là các ước nguyên tố.'},{t:SET(D.filter((d,i)=>i!==Math.floor(D.length/2))),err:`Thiếu ${D[Math.floor(D.length/2)]}.`}];
  const o=pickOpts(SET(D),c);if(o.length<3)return null;
  return {stem:`Biết n = ${FS(f)}. Tập hợp các ước của n là:`,opts:[{t:nb(SET(D))}].concat(o.map(z=>({t:nb(z.t),err:z.err}))),ans:0,exp:`n = ${n}; ${UO(n)} = ${SET(D)}.`};});}
function genPairs(){return tryGen(()=>{const n=sel([24,30,36,42,48,60,70,72,84,90,100]),D=divs(n),c=D.filter(d=>d*d<n).length+(D.some(d=>d*d===n)?1:0);const lt=D.filter(d=>d*d<n).length;
  return mkMC(`Tích của hai số tự nhiên a và b bằng ${n}, với a ≤ b. Có bao nhiêu cặp số (a; b) như vậy?`,''+c,[[''+D.length,'Đã đếm cả cặp (a; b) và (b; a).'],[''+(c-1),'Còn thiếu cặp (1; '+n+').'],[''+(c+1),'Đếm thừa một cặp.']].filter((w,i,A)=>w[0]!==''+c&&A.findIndex(z=>z[0]===w[0])===i),`Mỗi số là một ước của ${n}: ${D.filter(d=>d*d<=n).map(d=>`(${d}; ${n/d})`).join(', ')}.`);});}
function genGroups(){return tryGen(()=>{const n=sel([30,33,35,39,42,45,51,55,65,77]),D=divs(n).filter(d=>d>1&&d<n);
  return mkMC(`Đội có ${n} bạn được xếp thành các hàng có số người như nhau, nhiều hơn một hàng và mỗi hàng nhiều hơn một người. Có bao nhiêu cách xếp?`,''+D.length,[[''+(D.length+2),'Không tính trường hợp một hàng hoặc mỗi hàng một người.'],[''+(D.length+1),'Đếm thừa một cách.'],[''+(D.length>1?D.length-1:3),'Còn thiếu cách xếp.']].filter((w,i,A)=>w[0]!==''+D.length&&A.findIndex(z=>z[0]===w[0])===i),`${n} = ${FS(fac(n))}; số người mỗi hàng là ước của ${n}, khác 1 và ${n}: ${SET(D)}.`);});}

const MC=[];
const addMC=(id,topic,level,gen,mix)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},mix?{mix}:{}));
addMC('m_wp','nt','NB',genWhichPrime(10,60));addMC('m_wc','nt','NB',genWhichComp(10,60));addMC('m_def','nt','NB',genDef);addMC('m_01','nt','NB',gen01);
addMC('m_wp2','nt','TH',genWhichPrime(60,200));addMC('m_wc2','nt','TH',genWhichComp(60,200));addMC('m_set','nt','TH',genSetPrime);addMC('m_cnt','nt','TH',genCountRange);addMC('m_why','nt','TH',genWhyComp,[9]);
addMC('m_par','nt','VD',genParity,[8]);addMC('m_star','nt','VD',genStarPrime);addMC('m_wp3','nt','VD',genWhichPrime(100,300));
addMC('m_fa','pt','NB',genFact('NB'));addMC('m_ff','pt','NB',genFromFact);addMC('m_spf','pt','NB',genSmallestPF);
addMC('m_fb','pt','TH',genFact('TH'));addMC('m_nam','pt','TH',genNam);addMC('m_col','pt','TH',genColumn);addMC('m_tree','pt','TH',genTree);addMC('m_col2','pt','VD',genColumn);
addMC('m_pd','ung','TH',genPrimeDivs);addMC('m_pp','ung','VD',genPowProd);addMC('m_pp2','ung','VD',genPowProd);addMC('m_dff','ung','TH',genDivsFromFact,[8]);addMC('m_pair','ung','VD',genPairs,[8]);addMC('m_grp','ung','VD',genGroups,[8]);addMC('m_fa2','ung','NB',genFact('NB'));addMC('m_wc3','nt','NB',genWhichComp(10,99));addMC('m_spf2','pt','NB',genSmallestPF);addMC('m_ff2','pt','NB',genFromFact);addMC('m_wp4','nt','NB',genWhichPrime(2,40));

/* ============ Câu đúng sai ============ */
function tfStatic(pool,stem){return ()=>{const items=mixed(()=>shuffle(pool).slice(0,4).map(p=>sel(p)));return {stem,items:wrap(items)};};}
const POOL_A=[
  [IT('Số 2 là số nguyên tố chẵn duy nhất.',true,'nt','NB','Mọi số chẵn lớn hơn 2 đều chia hết cho 2 nên là hợp số.'),IT('Mọi số nguyên tố đều là số lẻ.',false,'nt','NB','2 là số nguyên tố chẵn.')],
  [IT('Số 0 và số 1 không là số nguyên tố, cũng không là hợp số.',true,'nt','NB','Theo định nghĩa, số nguyên tố và hợp số đều lớn hơn 1.'),IT('Số 1 là số nguyên tố.',false,'nt','NB','Số 1 chỉ có một ước.')],
  [IT('Ước nguyên tố nhỏ nhất của một số chẵn là 2.',true,'pt','NB','Số chẵn chia hết cho 2, và 2 là số nguyên tố nhỏ nhất.'),IT('Ước nguyên tố của 30 là 5 và 6.',false,'pt','NB','30 = 2 · 3 · 5; 6 không là số nguyên tố.')],
  [IT('Dạng phân tích ra thừa số nguyên tố của số 7 là 7.',true,'pt','NB','Quy ước: dạng phân tích của một số nguyên tố là chính nó.'),IT('Số 7 không phân tích được ra thừa số nguyên tố.',false,'pt','NB','Quy ước: dạng phân tích của số nguyên tố là chính nó.')],
  [IT('Mọi hợp số đều phân tích được thành tích các thừa số nguyên tố.',true,'pt','NB','Như SGK.'),IT('Mọi số chẵn đều là hợp số.',false,'nt','NB','2 là số chẵn nhưng là số nguyên tố.')],
  [IT('Tích của hai số nguyên tố là một hợp số.',true,'nt','NB','Tích p · q có thêm ước p (ngoài 1 và chính nó).'),IT('Tích của hai số nguyên tố bất kì luôn là số lẻ.',false,'nt','NB','2 · 3 = 6 là số chẵn.')],
  [IT('Số nguyên tố chỉ có hai ước là 1 và chính nó.',true,'nt','NB','Định nghĩa.'),IT('Mọi bội của 3 đều là hợp số.',false,'nt','NB','3 là bội của 3 nhưng là số nguyên tố.')]];
function tfNums(level,lo,hi){return ()=>{const items=mixed(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){const n=RNG()<.5?primeIn(lo,hi):(RNG()<.6?oddComp(lo,hi):pickN(lo,hi,x=>!isP(x)));if(used.has(n))return null;used.add(n);const sayP=RNG()<.5,v=sayP===isP(n);o.push(IT(`${F(n)} là ${sayP?'số nguyên tố':'hợp số'}.`,v,'nt',level,whyN(n)+'.'));}return o;});return {stem:'Xét các khẳng định sau:',items:wrap(items)};};}
function tfFact(){const items=mixed(()=>{const o=[],used=new Set();for(let i=0;i<4;i++){const f=mkNum([2,3,5,7],RNG()<.6),n=fval(f);if(n>1500||used.has(n))return null;used.add(n);const v=RNG()<.5;let g=f;
    if(!v){const k=ri(0,2);if(k===0){g=f.map((z,j)=>j===0?[z[0],z[1]+1]:z);}else if(k===1){const b=f.find(z=>z[1]>1);if(!b)return null;o.push(IT(`${F(n)} = ${[b[0]*b[0]].concat(f.filter(z=>z!==b).map(z=>FS([z]))).join(' · ')}${b[1]>2?' · '+FS([[b[0],b[1]-2]]):''}`,false,'pt','TH',`${b[0]*b[0]} không là số nguyên tố; ${F(n)} = ${FS(f)}.`));continue;}else g=f.map((z,j)=>j===f.length-1?[z[0],z[1]>1?z[1]-1:z[1]+1]:z);}
    o.push(IT(`${F(n)} = ${FS(g)}`,v,'pt','TH',`${F(n)} = ${FS(f)}.`));}return o;});return {stem:'Xét các kết quả phân tích ra thừa số nguyên tố sau:',items:wrap(items)};}
function tfAbout(){const f=mkNum([2,3,5,7,11],true),n=fval(f);const P=f.map(z=>z[0]),D=divs(n);
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(`${F(n)} = ${v?FS(f):FS(f.map((z,j)=>j===0?[z[0],z[1]+1]:z))}`,v,'pt','TH',`${F(n)} = ${FS(f)}.`));}
    {const v=R();o.push(IT(`${F(n)} có ${v?P.length:P.length+1} ước nguyên tố.`,v,'ung','TH',`Các ước nguyên tố: ${L(P)}.`));}
    {const v=R(),q=v?sel(P):sel([2,3,5,7,11,13].filter(p=>!P.includes(p)));o.push(IT(`${q} là ước nguyên tố của ${F(n)}.`,v,'ung','TH',`${F(n)} = ${FS(f)}.`));}
    {const v=R(),c=D.filter(d=>d>1&&!isP(d)).length;o.push(IT(`${F(n)} là ${v?'hợp số':'số nguyên tố'}.`,v,'nt','TH',whyC(n)+'.'));}
    return o;});return {stem:`Cho số ${F(n)}. Xét các khẳng định sau:`,items:wrap(items)};}
function tfFlowers(){const days=['Thứ Hai','Thứ Ba','Thứ Tư'];const N=pickN(11,40,x=>RNG()<.5?isP(x):!isP(x));const D=divs(N).filter(d=>d>1&&d<N);
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(v===isP(N)?`Không thể cắm đều ${N} bông vào nhiều lọ (ít nhất 2 lọ, mỗi lọ nhiều hơn 1 bông).`:`Có thể cắm đều ${N} bông vào nhiều lọ (ít nhất 2 lọ, mỗi lọ nhiều hơn 1 bông).`,v,'nt','VD',whyN(N)+'.'));}
    {const v=R();o.push(IT(`${N} ${v===isP(N)?'là số nguyên tố':'là hợp số'}.`,v,'nt','VD',whyN(N)+'.'));}
    {const M=N-1,D2=divs(M).filter(d=>d>1&&d<M),v=R();o.push(IT(`Nếu bớt 1 bông thì có ${v?D2.length:D2.length+2} cách cắm đều (ít nhất 2 lọ, mỗi lọ nhiều hơn 1 bông).`,v,'ung','VD',`${M} = ${FS(fac(M))}; số lọ là ước của ${M}, khác 1 và ${M}: ${D2.length?SET(D2):'không có'}.`));}
    {const v=R(),M=N+1;o.push(IT(`${M} ${v===isP(M)?'là số nguyên tố':'là hợp số'}, nên nếu thêm 1 bông thì ${isP(M)?'không':''} cắm đều được.`.replace('thì  cắm','thì cắm'),v,'nt','VD',whyN(M)+'.'));}
    return o;});
  return {stem:`Mẹ mua ${N} bông hoa hồng. Mai muốn cắm tất cả vào các lọ, số hoa ở mỗi lọ như nhau. Xét các phát biểu sau:`,items:wrap(items)};}
function tfParity(){const OP=PR.filter(p=>p>2&&p<30);const a=shuffle(OP).slice(0,2).sort((x,y)=>x-y),b=shuffle(OP).slice(0,2).sort((x,y)=>x-y);const A=a[0]*a[1]+b[0]*b[1],B=a[0]*a[1]*2+b[0];
  const items=mixed(()=>{const o=[],R=()=>RNG()<.5;
    {const v=R();o.push(IT(v?`${a.join(' · ')} là số lẻ.`:`${a.join(' · ')} là số chẵn.`,v,'nt','VD',`Tích hai số lẻ là số lẻ: ${a[0]*a[1]}.`));}
    {const v=R();o.push(IT(`A = ${a.join(' · ')} + ${b.join(' · ')} ${v?'chia hết cho 2':'không chia hết cho 2'}.`,v,'nt','VD',`Tổng hai số lẻ là số chẵn: A = ${A}.`));}
    {const v=R();o.push(IT(`A = ${a.join(' · ')} + ${b.join(' · ')} là ${v?'hợp số':'số nguyên tố'}.`,v,'nt','VD',`A ⋮ 2 và A > 2 nên A là hợp số.`));}
    {const v=R();o.push(IT(`B = 2 · ${a.join(' · ')} + ${b[0]} ${v===(B%2===0)?'chia hết cho 2':'không chia hết cho 2'}.`,v,'nt','VD',`2 · ${a.join(' · ')} chẵn, ${b[0]} lẻ nên B lẻ, không chia hết cho 2 (B = ${B}).`));}
    return o;});return {stem:'Không tính giá trị các biểu thức, xét các khẳng định sau:',items:wrap(items)};}
const TF=[];
const addTF=(id,topic,level,gen,mix)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},mix?{mix}:{}));
addTF('t_pa','nt','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));addTF('t_pb','pt','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));addTF('t_pc','nt','NB',tfStatic(POOL_A,'Xét các phát biểu sau:'));
addTF('t_n1','nt','NB',tfNums('NB',2,50));addTF('t_n2','nt','NB',tfNums('NB',2,60));
addTF('t_n3','nt','TH',tfNums('TH',50,200));addTF('t_f1','pt','TH',tfFact);addTF('t_f2','pt','TH',tfFact);addTF('t_ab','ung','TH',tfAbout);addTF('t_ab2','ung','TH',tfAbout);
addTF('t_fl','ung','VD',tfFlowers);addTF('t_par','nt','VD',tfParity,[8]);addTF('t_fl2','nt','VD',tfFlowers);

/* ============ Câu trả lời ngắn ============ */
const SA=[
 {id:'s_cntl',topic:'nt',level:'NB',unit:'số',gen:()=>{const L0=[];while(L0.length<7){const x=RNG()<.45?primeIn(2,60):ri(0,60);if(!L0.includes(x))L0.push(x);}return{stem:`Trong các số ${L(L0)}, có bao nhiêu số nguyên tố?`,ans:[L0.filter(isP).length],exp:L0.map(whyN).join('; ')+'.'};}},
 {id:'s_spf',topic:'pt',level:'NB',unit:'',gen:()=>{const n=pickN(20,300,x=>!isP(x));return{stem:`Tìm ước nguyên tố nhỏ nhất của ${n}.`,ans:[spf(n)],exp:`${n} = ${FS(fac(n))}.`};}},
 {id:'s_val',topic:'pt',level:'NB',unit:'',gen:()=>{const f=mkNum([2,3,5,7],true),n=fval(f);return{stem:`Tính số tự nhiên n, biết n = ${FS(f)}.`,ans:[n],exp:`${FS(f)} = ${f.map(([p,e])=>Array(e).fill(p).join(' · ')).join(' · ')} = ${F(n)}.`};}},
 {id:'s_cntr',topic:'nt',level:'TH',unit:'số',gen:()=>{const lo=ri(10,90),hi=lo+ri(10,25);return{stem:`Có bao nhiêu số nguyên tố p thoả mãn ${lo} < p < ${hi}?`,ans:[PR.filter(p=>p>lo&&p<hi).length],exp:`Đó là các số ${PR.filter(p=>p>lo&&p<hi).join('; ')||'(không có)'}.`};}},
 {id:'s_np',topic:'ung',level:'TH',unit:'',gen:()=>{const f=mkNum([2,3,5,7,11,13],false),n=fval(f);return{stem:`Số ${F(n)} có bao nhiêu ước nguyên tố?`,ans:[f.length],exp:`${F(n)} = ${FS(f)}: các ước nguyên tố là ${L(f.map(z=>z[0]))}.`};}},
 {id:'s_e2',topic:'pt',level:'TH',unit:'',gen:()=>{const f=mkNum([2,3,5,7],true),n=fval(f),p=sel(f.map(z=>z[0]));return{stem:`Khi phân tích ${F(n)} ra thừa số nguyên tố, số mũ của thừa số ${p} là bao nhiêu?`,ans:[f.find(z=>z[0]===p)[1]],exp:`${F(n)} = ${FS(f)}.`};}},
 {id:'s_lpf',topic:'pt',level:'TH',unit:'',gen:()=>{const f=mkNum([2,3,5,7,11,13,17],false),n=fval(f);return{stem:`Tìm ước nguyên tố lớn nhất của ${F(n)}.`,ans:[f[f.length-1][0]],exp:`${F(n)} = ${FS(f)}.`};}},
 {id:'s_col',topic:'pt',level:'TH',unit:'',gen:()=>{for(;;){const f=mkNum([2,3,5,7],false),n=fval(f);if(n>600||n<24)continue;const {rows}=colFig(n,new Set());if(rows.length<4)continue;const k=ri(1,rows.length-2);const {html}=colFig(n,new Set(['L'+k]));return{stem:`Tìm số còn thiếu (dấu ?) trong sơ đồ cột phân tích số ${F(n)} ra thừa số nguyên tố.`,fig:html,ans:[rows[k][0]],exp:`${rows[k-1][0]} : ${rows[k-1][1]} = ${rows[k][0]}.`};}}},
 {id:'s_root',topic:'pt',level:'TH',unit:'',gen:()=>{for(;;){const f=mkNum([2,3,5,7],false),n=fval(f);if(n>300||n<12)continue;const T=treeFig(n,true,new Set());if(T.nodes.length<5)continue;return{stem:'Tìm số ở gốc (dấu ?) của sơ đồ cây phân tích một số ra thừa số nguyên tố dưới đây.',fig:T.html,ans:[n],exp:`${FS(fac(n))} = ${n}.`};}}},
 {id:'s_pp',topic:'ung',level:'VD',unit:'',gen:()=>{const B=sel([[4,2,2],[8,2,3],[9,3,2],[25,5,2]]),C=sel([[9,3,2],[27,3,3],[4,2,2],[49,7,2]].filter(z=>z[1]!==B[1])),m=ri(2,6),k=ri(2,6);return{stem:`Phân tích A = ${B[0]}<sup>${m}</sup> · ${C[0]}<sup>${k}</sup> ra thừa số nguyên tố. Tính tổng các số mũ trong kết quả.`,ans:[B[2]*m+C[2]*k],exp:`A = ${FS([[B[1],B[2]*m],[C[1],C[2]*k]].sort((a,b)=>a[0]-b[0]))}; tổng số mũ: ${B[2]*m} + ${C[2]*k} = ${B[2]*m+C[2]*k}.`};}},
 {id:'s_pair',topic:'ung',level:'VD',unit:'cặp',mix:[8],gen:()=>{const n=sel([18,20,28,30,42,44,45,50,63,66,70,78,105]),D=divs(n);return{stem:`Tích của hai số tự nhiên a và b bằng ${n}, với a < b. Có bao nhiêu cặp (a; b) như vậy?`,ans:[D.filter(d=>d*d<n).length],exp:`${n} = ${FS(fac(n))}; a là ước của ${n} và a < b: ${D.filter(d=>d*d<n).map(d=>`(${d}; ${n/d})`).join(', ')}.`};}},
 {id:'s_grp',topic:'ung',level:'VD',unit:'cách',mix:[8],gen:()=>{const m=sel([30,33,34,35,38,39,42,45,51,55]);return{stem:`Đội tiêu binh có ${m+1} người gồm 1 sĩ quan chỉ huy đứng đầu và ${m} chiến sĩ. Có bao nhiêu cách xếp ${m} chiến sĩ thành các hàng sao cho mỗi hàng có số người như nhau (kể cả xếp thành 1 hàng)?`,ans:[divs(m).length],exp:`${m} = ${FS(fac(m))}; số hàng là ước của ${m}: ${SET(divs(m))}, có ${divs(m).length} cách.`};}},
 {id:'s_star',topic:'nt',level:'VD',unit:'chữ số',gen:()=>{for(;;){const tpl=RNG()<.5?`${ri(1,9)}*`:`*${sel([1,3,7,9])}`;const D=range(0,9).filter(d=>{const s=tpl.replace('*',d);return s[0]!=='0'&&isP(+s);});if(!D.length)continue;return{stem:`Có bao nhiêu chữ số thay được cho dấu * để số ${OV(tpl)} là số nguyên tố?`,ans:[D.length],exp:`Các số nguyên tố: ${D.map(d=>tpl.replace('*',d)).join('; ')}.`};}}},
 {id:'s_div',topic:'ung',level:'VD',unit:'ước',mix:[8],gen:()=>{const f=sel([[[2,2],[3,1]],[[2,1],[3,2]],[[2,3],[3,1]],[[2,2],[5,1]],[[2,1],[3,1],[5,1]],[[3,2],[5,1]],[[2,2],[7,1]],[[2,4]],[[2,2],[3,2]]]),n=fval(f);return{stem:`Biết n = ${FS(f)}. Số n có bao nhiêu ước?`,ans:[divs(n).length],exp:`n = ${n}; ${UO(n)} = ${SET(divs(n))}.`};}},
 {id:'s_sum2',topic:'nt',level:'VD',unit:'',gen:()=>{for(;;){const q=primeIn(20,200);if(!isP(q))continue;const N=q+2;return{stem:`Tổng của hai số nguyên tố bằng ${N}. Tìm số nguyên tố lớn hơn.`,ans:[q],exp:`${N} là số lẻ nên một trong hai số phải là số chẵn, tức là 2. Số còn lại là ${N} − 2 = ${q} (là số nguyên tố).`};}}},
 {id:'s_np2',topic:'nt',level:'NB',unit:'',gen:()=>{const k=ri(10,90);const p=PR.find(q=>q>k);return{stem:`Tìm số nguyên tố nhỏ nhất lớn hơn ${k}.`,ans:[p],exp:`${range(k+1,p-1).map(x=>whyC(x).replace(/ nên.*/,'')).join('; ')}${p>k+1?'; ':''}${p} là số nguyên tố.`};}},
 {id:'s_cntl2',topic:'nt',level:'NB',unit:'số',gen:()=>{const lo=ri(1,30);return{stem:`Có bao nhiêu số nguyên tố nhỏ hơn ${lo+10}?`,ans:[PR.filter(p=>p<lo+10).length],exp:`Đó là các số ${PR.filter(p=>p<lo+10).join('; ')}.`};}}
].map(q=>Object.assign({type:'sa'},q));

/* ============ Chủ đề ============ */
const TOPICS={
  nt:{short:'Số nguyên tố, hợp số',name:'Số nguyên tố và hợp số',rule:'Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó. Hợp số là số tự nhiên lớn hơn 1, có nhiều hơn hai ước. Số 0 và số 1 không là số nguyên tố, cũng không là hợp số.',tip:'Để chứng tỏ một số là hợp số, dùng dấu hiệu chia hết tìm một ước khác 1 và chính nó: 1 975 ⋮ 5.'},
  pt:{short:'Phân tích ra thừa số',name:'Phân tích một số ra thừa số nguyên tố',rule:'Mọi hợp số đều phân tích được thành tích các thừa số nguyên tố (theo sơ đồ cây hoặc sơ đồ cột). Viết các thừa số từ bé đến lớn, các thừa số giống nhau viết dưới dạng luỹ thừa: 24 = 2<sup>3</sup> · 3. Dạng phân tích của một số nguyên tố là chính nó.',tip:'Mọi thừa số phải là số nguyên tố: 60 = 3 · 4 · 5 là sai vì 4 không là số nguyên tố.'},
  ung:{short:'Ước nguyên tố, ứng dụng',name:'Ước nguyên tố và ứng dụng',rule:'Từ dạng phân tích ra thừa số nguyên tố, đọc được các ước nguyên tố và tìm được các ước của một số; dùng để chia nhóm, xếp hàng, tìm hai số có tích cho trước.',tip:'Ước nguyên tố của 30 là 2; 3; 5 (6 không là số nguyên tố).'}
};
const TKEYS=['nt','pt','ung'];
const TDESC={nt:'Nhận biết số nguyên tố, hợp số',pt:'Sơ đồ cây, sơ đồ cột, viết dạng luỹ thừa',ung:'Ước nguyên tố, tìm ước, chia nhóm, xếp hàng'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhận ra số nguyên tố, hợp số nhỏ; định nghĩa; phân tích số nhỏ.',TH:'Số nguyên tố đến 200, điền sơ đồ cây và sơ đồ cột, kiểm tra kết quả phân tích, ước nguyên tố.',VD:'Phân tích tích các luỹ thừa, tìm số cặp có tích cho trước, xếp hàng, tổng là hợp số.'};

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
function tfHard(){for(;;){
  const P=[
    [IT('Mọi số nguyên tố lớn hơn 2 đều là số lẻ.',true,'nt','VD','Số chẵn lớn hơn 2 chia hết cho 2 nên là hợp số.'),IT('Tổng của hai số nguyên tố bất kì luôn là hợp số.',false,'nt','VD','2 + 3 = 5 là số nguyên tố.')],
    [IT('2 và 3 là hai số tự nhiên liên tiếp duy nhất đều là số nguyên tố.',true,'nt','VD','Trong hai số liên tiếp có một số chẵn; số chẵn là số nguyên tố chỉ khi bằng 2.'),IT('Có vô số cặp hai số tự nhiên liên tiếp đều là số nguyên tố.',false,'nt','VD','Chỉ có cặp 2 và 3.')],
    [IT('Nếu p là số nguyên tố lớn hơn 3 thì p chia cho 3 dư 1 hoặc dư 2.',true,'nt','VD','p không chia hết cho 3 (nếu không p có ước 3).'),IT('Nếu p là số nguyên tố lớn hơn 3 thì p + 1 là số nguyên tố.',false,'nt','VD','p lẻ nên p + 1 chẵn, lớn hơn 2, là hợp số.')],
    [IT('Tích của hai số nguyên tố là một hợp số.',true,'nt','VD','p · q có thêm ước p.'),IT('Tích của hai số nguyên tố là một số nguyên tố.',false,'nt','VD','2 · 3 = 6 là hợp số.')],
    [IT('Số 2<sup>10</sup> chỉ có một ước nguyên tố.',true,'ung','VD','2<sup>10</sup> chỉ có ước nguyên tố là 2.'),IT('Số 2<sup>10</sup> có 10 ước.',false,'ung','VD','Các ước là 1; 2; 2<sup>2</sup>; …; 2<sup>10</sup>: có 11 ước.')]];
  const its=wrap(shuffle(P).slice(0,4).map(p=>sel(p)));if(tfOK(its))return {stem:'Xét các khẳng định sau:',items:its};}}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'nt',level:'VD',gen:tfHard}],sa:[
 {id:'h_p3',topic:'nt',level:'VD',unit:'',gen:()=>{const [a,b]=sel([[2,4],[10,14],[4,8],[14,16],[8,10]]);return{stem:`Tìm số nguyên tố p sao cho p + ${a} và p + ${b} đều là số nguyên tố.`,ans:[3],exp:`Xét số dư khi chia p cho 3: nếu p = 3 thì p + ${a} = ${3+a}, p + ${b} = ${3+b} đều là số nguyên tố. Nếu p không chia hết cho 3 thì một trong ba số p, p + ${a}, p + ${b} chia hết cho 3 và lớn hơn 3, là hợp số. Vậy p = 3.`};}},
 {id:'h_cd',topic:'ung',level:'VD',unit:'ước',mix:[8],gen:()=>{const a=ri(1,4),b=ri(1,3),c=sel([0,1]);const n=Math.pow(2,a)*Math.pow(3,b)*Math.pow(5,c);return{stem:`Số n = ${FS([[2,a],[3,b]].concat(c?[[5,1]]:[]))} có bao nhiêu ước?`,ans:[divs(n).length],exp:`Mỗi ước có dạng 2<sup>x</sup> · 3<sup>y</sup>${c?' · 5<sup>z</sup>':''} với 0 ≤ x ≤ ${a}, 0 ≤ y ≤ ${b}${c?', 0 ≤ z ≤ 1':''}: có ${a+1} · ${b+1}${c?' · 2':''} = ${divs(n).length} ước.`};}},
 {id:'h_k',topic:'ung',level:'VD',unit:'',gen:()=>{const k=sel([4,6,8,9,10,12]);let n=1;while(divs(n).length!==k)n++;return{stem:`Tìm số tự nhiên nhỏ nhất có đúng ${k} ước.`,ans:[n],exp:`Thử lần lượt các số: ${n} = ${FS(fac(n))} có ${k} ước ${SET(divs(n))}, và không số nào nhỏ hơn có đúng ${k} ước.`};}},
 {id:'h_cons',topic:'ung',level:'VD',unit:'',gen:()=>{const a=ri(12,60),n=a*(a+1);return{stem:`Viết số ${F(n)} thành tích của hai số tự nhiên liên tiếp. Tìm số lớn hơn.`,ans:[a+1],exp:`${F(n)} = ${FS(fac(n))} = ${a} · ${a+1}.`};}},
 {id:'h_sum2',topic:'nt',level:'VD',unit:'',gen:()=>{for(;;){const q=primeIn(100,600),N=q+2;return{stem:`Tổng của hai số nguyên tố bằng ${N}. Tính tích của hai số đó.`,ans:[2*q],exp:`${N} lẻ nên một số là 2, số kia là ${q}. Tích bằng ${2*q}.`};}}},
 {id:'h_star',topic:'nt',level:'VD',unit:'',mix:[9],gen:()=>{for(;;){const a=ri(1,9),c=sel([1,3,7,9]);const D=range(0,9).filter(d=>isP(+(`${a}${d}${c}`)));if(D.length<2)continue;return{stem:`Tính tổng tất cả các chữ số * sao cho số ${OV(`${a}*${c}`)} là số nguyên tố.`,ans:[sum(D)],exp:`Loại các số chia hết cho 3 (tổng chữ số chia hết cho 3), 7, 11, 13, …: các số nguyên tố là ${D.map(d=>`${a}${d}${c}`).join('; ')}; tổng các chữ số * là ${sum(D)}.`};}}}
].map(q=>Object.assign({type:'sa'},q))};

const qsOK=u=>u.qs.every(q=>q.type!=='mc'||(q.opts.length===4&&new Set(q.opts.map(o=>o.t)).size===4));
const mx=(q,m)=>Object.assign(q,{mix:m});
const PISA=[
 ()=>{for(;;){const days=['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm'];const p=primeIn(11,47),C=[];while(C.length<3){const x=pickN(12,48,y=>!isP(y)&&y!==p);if(!C.includes(x))C.push(x);}const V=shuffle([p].concat(C)),dp=days[V.indexOf(p)],ci=V.findIndex(v=>v!==p),dc=days[ci],vc=V[ci];const D=divs(vc).filter(d=>d>1&&d<vc);
   const u={title:'Cắm hoa',ctx:`<p class="stem">Cửa hàng hoa mỗi ngày nhận một số bông hồng và muốn cắm hết vào các lọ, số bông trong mỗi lọ như nhau, ít nhất 2 lọ và mỗi lọ nhiều hơn 1 bông.</p>${tbl(['Ngày','Số bông hồng'],days.map((d,i)=>[d,V[i]]))}`,qs:[
    mcq('Ngày nào cửa hàng không cắm được như vậy?',dp,days.filter(d=>d!==dp).map(d=>[d,whyC(V[days.indexOf(d)])+' nên cắm được.']),`${whyP(p)}: chỉ cắm được 1 lọ hoặc mỗi lọ 1 bông.`,'nt','TH'),
    saq(`Ngày ${dc} có bao nhiêu cách chọn số lọ?`,D.length,'cách',`${vc} = ${FS(fac(vc))}; số lọ là ước của ${vc}, khác 1 và ${vc}: ${SET(D)}.`,'ung','TH'),
    mx(saq(`Ngày ${dc}, nếu mỗi lọ cắm một số nguyên tố bông thì có bao nhiêu cách chọn số bông mỗi lọ?`,fac(vc).length,'cách',`${vc} = ${FS(fac(vc))}; số bông mỗi lọ là ước nguyên tố của ${vc}: ${L(fac(vc).map(z=>z[0]))}.`,'ung','VD'),[8])]};if(qsOK(u))return u;}},
 ()=>{for(;;){const A=sel([33,35,39,45,51,55,57,65]),B=primeIn(29,61);
   const u={title:'Đội tiêu binh',ctx:`<p class="stem">Trong lễ thượng cờ, mỗi đội tiêu binh có 1 sĩ quan chỉ huy đứng đầu, các chiến sĩ còn lại xếp thành các hàng có số người như nhau.</p>${tbl(['Đội','Số người cả đội'],[['Đội A',A+1],['Đội B',B+1]])}`,qs:[
    saq('Đội A có bao nhiêu chiến sĩ (không kể sĩ quan chỉ huy)?',A,'chiến sĩ',`${A+1} − 1 = ${A}.`,'nt','NB'),
    mcq(`Phân tích ${A} ra thừa số nguyên tố:`,FS(fac(A)),[[`${A}`,`${A} là hợp số: ${whyC(A)}.`],[`1 · ${A}`,'1 không là số nguyên tố.'],[FS(fac(A).map((z,j)=>j===0?[z[0],z[1]+1]:z)),'Tính lại tích.']],`${A} = ${FS(fac(A))}.`,'pt','TH'),
    saq(`Có bao nhiêu cách xếp ${A} chiến sĩ đội A thành các hàng có số người như nhau (kể cả xếp thành 1 hàng)?`,divs(A).length,'cách',`Số hàng là ước của ${A}: ${SET(divs(A))}.`,'ung','VD'),
    mcq('Vì sao đội B chỉ xếp được thành 1 hàng hoặc mỗi hàng 1 người?',`Vì ${B} là số nguyên tố`,[[`Vì ${B} là số lẻ`,'Số lẻ chưa chắc là số nguyên tố: đội A cũng có số lẻ chiến sĩ.'],[`Vì ${B} lớn hơn ${A}`,`Không liên quan.`],[`Vì ${B+1} là số chẵn`,'Phải xét số chiến sĩ, không kể chỉ huy.']],`${whyP(B)}.`,'nt','TH')]};if(qsOK(u)&&B!==A)return u;}},
 ()=>{for(;;){const LT=['A','B','C','D','E'],PM=[2,3,5,7,11];const w=shuffle([0,1,2,3,4]).slice(0,2).sort((a,b)=>a-b),code=w.reduce((s,i)=>s*PM[i],1);const w3=shuffle([0,1,2,3,4]).slice(0,3).sort((a,b)=>a-b),c3=w3.reduce((s,i)=>s*PM[i],1);
   const right=w3.map(i=>LT[i]).join(', ');const W=[];for(let k=0;k<30&&W.length<3;k++){const z=shuffle([0,1,2,3,4]).slice(0,3).sort((a,b)=>a-b).map(i=>LT[i]).join(', ');if(z!==right&&!W.includes(z))W.push(z);}
   const u={title:'Mật mã số nguyên tố',ctx:`<p class="stem">Nhóm bạn Minh mã hoá mỗi chữ cái bằng một số nguyên tố. Mã của một nhóm chữ cái là tích các số của những chữ cái đó.</p>${tbl(['Chữ cái','A','B','C','D','E'],[['Số',...PM]])}`,qs:[
    saq(`Mã của nhóm chữ cái ${w.map(i=>LT[i]).join(' và ')} là số nào?`,code,'',`${w.map(i=>PM[i]).join(' · ')} = ${code}.`,'pt','NB'),
    mcq(`Một nhóm ba chữ cái có mã ${c3}. Đó là các chữ cái nào?`,right,W.map(z=>[z,`Tích các số của ${z} khác ${c3}.`]),`${c3} = ${w3.map(i=>PM[i]).join(' · ')}.`,'pt','TH'),
    mcq('Vì sao mỗi mã chỉ ứng với đúng một nhóm chữ cái?','Vì mỗi số chỉ có một cách phân tích ra thừa số nguyên tố (không kể thứ tự)',[['Vì các số trong bảng đều là số lẻ','Số 2 trong bảng là số chẵn.'],['Vì các mã đều chia hết cho 2','Có mã không chia hết cho 2.'],['Vì các số trong bảng đều nhỏ hơn 12','Không phải lí do.']],'Dù phân tích cách nào, kết quả phân tích ra thừa số nguyên tố cũng như nhau.','pt','VD'),
    saq(`Mã ${c3*PM[w3[0]]} gồm bao nhiêu chữ cái (kể cả chữ lặp lại)?`,4,'chữ cái',`${c3*PM[w3[0]]} = ${FS(fac(c3*PM[w3[0]]))}, có 4 thừa số nguyên tố.`,'ung','VD')]};if(qsOK(u))return u;}},
 ()=>{for(;;){const n=sel([24,30,36,40,48,60,72]),p=primeIn(23,47),D=divs(n).filter(d=>d>1&&d*d<=n);
   const u={title:'Xếp gạch hình chữ nhật',ctx:`<p class="stem">Bạn An có các viên gạch hình vuông bằng nhau và muốn xếp tất cả thành một hình chữ nhật (đặc, không chừa ô trống) có ít nhất 2 hàng và mỗi hàng ít nhất 2 viên.</p>${tbl(['Hộp gạch','Số viên'],[['Hộp 1',n],['Hộp 2',p]])}`,qs:[
    mcq('Hộp nào không xếp được như vậy?','Hộp 2',[['Hộp 1',`${whyC(n)}: xếp được ${D[0]} hàng, mỗi hàng ${n/D[0]} viên.`],['Cả hai hộp','Hộp 1 xếp được.'],['Không hộp nào',`${whyP(p)}: chỉ xếp được 1 hàng.`]],`${whyP(p)}.`,'nt','TH'),
    saq(`Với hộp 1, có bao nhiêu hình chữ nhật khác nhau (không kể xoay hình)?`,D.length,'hình',`${n} = ${FS(fac(n))}; các cách: ${D.map(d=>`${d} × ${n/d}`).join('; ')}.`,'ung','VD'),
    mx(saq('Gộp gạch của hai hộp. Tổng số viên gạch có bao nhiêu ước nguyên tố?',fac(n+p).length,'',`${n} + ${p} = ${n+p} = ${FS(fac(n+p))}.`,'ung','VD'),[8])]};if(qsOK(u)&&!isP(n+p))return u;}}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'nt',fig:'<div class="figbox"><p>11 chỉ có hai ước 1 và 11: số nguyên tố</p><p>1 975 ⋮ 5 nên có thêm ước 5: hợp số</p></div>',extra:'0 và 1 không là số nguyên tố, cũng không là hợp số.'},
  {k:'pt',fig:colFig(24,new Set()).html+'<div class="figbox"><p>24 = 2 · 2 · 2 · 3 = 2<sup>3</sup> · 3</p></div>',extra:'Thừa số từ bé đến lớn, viết luỹ thừa.'},
  {k:'ung',fig:'<div class="figbox"><p>30 = 2 · 3 · 5: ước nguyên tố là 2; 3; 5</p><p>33 = 3 · 11: Ư(33) = {1; 3; 11; 33}</p></div>',extra:'Mỗi thừa số đều phải là số nguyên tố.'}
];

/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='nt6_seen';
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
  const mcSlots=[['nt',['NB']],['nt',['TH']],['pt',['NB']],['pt',['TH']],['ung',['TH']],[null,['VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['nt','pt','ung'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=[['nt',['TH','VD']],['pt',['TH']],['pt',['TH','VD']],['ung',['TH','VD']]].map(([t,l])=>pick(SA.filter(q=>q.topic===t&&l.includes(q.level)),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=[
    pick(MC.filter(q=>q.topic==='nt'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='nt'&&q.level==='TH'),used),
    pick(MC.filter(q=>q.topic==='pt'&&q.level!=='VD'),used),
    pick(MC.filter(q=>q.topic==='pt'&&q.level==='TH'),used)
  ];
  const sa=[pick(SA.filter(q=>q.topic==='nt'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='pt'&&q.level!=='VD'),used)];
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
