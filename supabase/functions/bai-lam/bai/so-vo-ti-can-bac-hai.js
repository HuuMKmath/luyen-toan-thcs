// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ so-vo-ti-can-bac-hai/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "so-vo-ti-can-bac-hai";
export const TIEN_TO = "VT7-";

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
const grp=x=>String(x).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^=h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const sgn=()=>RNG()<.5?-1:1;
const isq=x=>{let r=Math.floor(Math.sqrt(x));while(r*r>x)r--;while((r+1)*(r+1)<=x)r++;return r;};
const isSq=n=>{const r=isq(n);return r*r===n;};
const SQ=n=>'√'+grp(n);                         // căn bậc hai số học của số tự nhiên
const SQ2=a=>'√('+grp(a)+'²)';
const SQD=x=>'√'+dt(x);                         // căn của số thập phân
function dt(x){const s=String(+(+x).toFixed(6)),neg=s[0]==='-',t=neg?s.slice(1):s,p=t.split('.');return (neg?'−':'')+grp(p[0])+(p[1]?','+p[1]:'');}
/* làm tròn căn bậc hai: trả về số nguyên R = làm tròn của √n · 10^p (chữ số kề sau từ 5 trở lên thì tăng 1) */
function rdSqrt(n,p){const f=isq(n*Math.pow(10,2*p+2));return Math.floor(f/10)+(f%10>=5?1:0);}
function scStr(R,p){if(p===0)return grp(R);const u=Math.pow(10,p),ip=Math.floor(R/u),fp=String(R%u).padStart(p,'0');return grp(ip)+','+fp;}
const HANGP=['hàng đơn vị','hàng phần mười','hàng phần trăm','hàng phần nghìn'];
const ACCP=['0,5','0,05','0,005','0,0005'];
const PAT=k=>`0,${k}0${k}00${k}000${k}...`;                  // số thập phân vô hạn không tuần hoàn
const PAT_ERR='Các chữ số không lặp lại theo một nhóm cố định (số chữ số 0 giữa hai chữ số khác 0 cứ tăng dần), nên đây là số thập phân vô hạn không tuần hoàn, tức là số vô tỉ.';
const PERS=['0,(3)','1,(27)','0,2(5)','0,(12)','2,3(45)','0,(81)','1,(6)','0,41(6)'];
const NONSQ=n=>!isSq(n);
const FINS=()=>sel(['0,75','1,25','0,125','2,5','0,04','3,2','0,6','1,375']);

/* ============ Dựng câu nhiều lựa chọn ============ */
function pickOpts(goodT,cands){
  const seen=new Set([goodT]),out=[];
  for(const c of cands){if(c&&!seen.has(c.t)){seen.add(c.t);out.push({t:c.t,err:c.err});}if(out.length===3)break;}
  return out;
}
const C=(t,err)=>({t,err});
const mk=(stem,good,cands,exp,meta)=>({stem,opts:[{t:good}].concat(pickOpts(good,cands)),ans:0,exp,meta});
const FB_MC=()=>({stem:'Số nào sau đây là số vô tỉ?',opts:[{t:'π'},{t:'0,25',err:'0,25 có hữu hạn chữ số sau dấu phẩy nên là số hữu tỉ.'},{t:'0,(3)',err:'0,(3) là số thập phân vô hạn tuần hoàn nên là số hữu tỉ.'},{t:'−7',err:'−7 là số nguyên nên là số hữu tỉ.'}],ans:0,exp:'π = 3,14159265358... là số thập phân vô hạn không tuần hoàn nên là số vô tỉ.',meta:{fb:1}});
function tryGen(f){
  for(let n=0;n<400;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>o.t)).size===4)return r;}
  return FB_MC();
}
const sqErr=(v,n)=>`${v}² = ${dt(v*v)}, không bằng ${grp(n)}.`;

/* ============ Chủ đề ============ */
const TOPICS={
  vt:{short:'Số vô tỉ',name:'Số vô tỉ',rule:'Số vô tỉ là số viết được dưới dạng số thập phân vô hạn không tuần hoàn. Tập hợp các số vô tỉ kí hiệu là I. Chẳng hạn π = 3,14159265358... và √2 = 1,41421356237... là số vô tỉ. Căn bậc hai số học của một số tự nhiên không chính phương luôn là số vô tỉ.',tip:'Số thập phân hữu hạn và vô hạn tuần hoàn đều là số hữu tỉ, không phải số vô tỉ. Căn bậc hai của một số chính phương (như √49 = 7) là số tự nhiên nên không phải số vô tỉ.'},
  cb:{short:'Căn bậc hai số học',name:'Căn bậc hai số học',rule:'Căn bậc hai số học của số a không âm, kí hiệu √a, là số x không âm sao cho x² = a. Chẳng hạn √100 = 10 vì 10² = 100 và 10 > 0. Với a > 0 ta có √(a²) = a và (√a)² = a.',tip:'Căn bậc hai số học luôn không âm: √25 = 5, không phải −5. Không được cộng các số dưới dấu căn: √9 + √16 = 3 + 4 = 7, khác √25 = 5.'},
  mt:{short:'Máy tính và làm tròn căn',name:'Tính căn bậc hai bằng máy tính và làm tròn',rule:'Ta dùng máy tính cầm tay để tính căn bậc hai số học. Màn hình chỉ hiển thị hữu hạn chữ số nên kết quả của căn bậc hai số vô tỉ là giá trị gần đúng, được làm tròn (√2 ≈ 1,414213562). Nếu k² < n < (k + 1)² thì √n nằm giữa hai số tự nhiên k và k + 1.',tip:'Làm tròn theo hàng hoặc theo độ chính xác (độ chính xác bằng một nửa đơn vị hàng làm tròn): chữ số kề sau hàng làm tròn từ 5 trở lên thì tăng chữ số hàng làm tròn thêm 1, nhỏ hơn 5 thì giữ nguyên.'},
  tt:{short:'Vận dụng thực tế',name:'Vận dụng căn bậc hai vào bài toán thực tế',rule:'Hình vuông có diện tích a thì cạnh dài √a và chu vi 4√a. Bình phương độ dài đường chéo của hình chữ nhật bằng tổng các bình phương độ dài hai cạnh. Cần đổi đơn vị trước khi tính (1 ha = 10 000 m², 1 m = 100 cm).',tip:'Tính diện tích hay số viên gạch thì đổi về cùng một đơn vị. Cạnh hình vuông là √(diện tích), không phải diện tích chia 2 hay chia 4.'}
};
const TKEYS=['vt','cb','mt','tt'];
const TDESC={vt:'Nhận biết số vô tỉ, phân biệt với số hữu tỉ, căn của số chính phương và không chính phương',cb:'Định nghĩa căn bậc hai số học, √(a²), (√a)², tính căn của số chính phương',mt:'Dùng máy tính, làm tròn căn theo hàng hoặc độ chính xác, √n nằm giữa hai số tự nhiên, so sánh',tt:'Cạnh và chu vi hình vuông, đường chéo hình chữ nhật, lát gạch'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhận ra số vô tỉ, nhớ định nghĩa căn bậc hai số học, tính căn của số chính phương đơn giản.',TH:'Phân biệt số vô tỉ với số hữu tỉ, tính căn và biểu thức đơn giản, làm tròn căn theo hàng hoặc độ chính xác.',VD:'So sánh căn với số khác, đếm số n thỏa điều kiện, giải bài toán diện tích, đường chéo, lát gạch.'};

/* ============ Nội dung 1: số vô tỉ ============ */
function irrOpt(){ // số vô tỉ dạng chuỗi + lí do
  const t=ri(0,3);
  if(t===0||t===1){let n;do{n=ri(2,60);}while(isSq(n));return C(SQ(n),`${SQ(n)} là căn bậc hai số học của số tự nhiên không chính phương nên là số vô tỉ.`);}
  if(t===2)return C('π','π = 3,14159265358... là số thập phân vô hạn không tuần hoàn nên là số vô tỉ.');
  const k=ri(1,9);return C(RNG()<.5?PAT(k):'−'+PAT(k),PAT_ERR);
}
function ratOpt(trap){ // số hữu tỉ dạng chuỗi + lí do
  const t=trap?0:ri(0,4);
  if(t===0){const s=ri(2,12);return C(SQ(s*s),`${SQ(s*s)} = ${s} là số tự nhiên nên là số hữu tỉ, không phải số vô tỉ.`);}
  if(t===1){const x=FINS();return C(x,`${x} có hữu hạn chữ số sau dấu phẩy nên là số hữu tỉ.`);}
  if(t===2){const x=sel(PERS);return C(x,`${x} là số thập phân vô hạn tuần hoàn nên là số hữu tỉ.`);}
  if(t===3){const b=sel([3,7,9,11,13]),a=ri(1,b-1);return C(fr(a,b),`${fr(a,b)} viết được dưới dạng phân số nên là số hữu tỉ.`);}
  return C('−'+ri(2,30),'Số nguyên là số hữu tỉ.');
}
function uniq3(f,avoid){const out=[],seen=new Set(avoid||[]);for(let n=0;n<200&&out.length<3;n++){const c=f();if(!seen.has(c.t)){seen.add(c.t);out.push(c);}}return out;}
function genVtKind(){return tryGen(()=>{
  const g=irrOpt(),ws=uniq3(()=>ratOpt(RNG()<.4),[g.t]);
  const r=mk('Số nào sau đây là số vô tỉ?',g.t,ws,g.err,{g:g.t});return r;
});}
function genVtNot(){return tryGen(()=>{
  const g=ratOpt(RNG()<.55),ws=uniq3(irrOpt,[g.t]);
  const r=mk('Số nào sau đây không phải là số vô tỉ?',g.t,ws,g.err,{g:g.t});return r;
});}
function genVtSqrt(){return tryGen(()=>{
  const sq=RNG()<.5,s=ri(2,13),n=sq?s*s:(()=>{let m;do{m=ri(2,150);}while(isSq(m));return m;})();
  const good=sq?'số tự nhiên':'số vô tỉ';
  const cs=sq?[C('số vô tỉ',`${SQ(n)} = ${s} là số tự nhiên, không phải số vô tỉ.`),C('số âm','Căn bậc hai số học không âm.'),C('số thập phân vô hạn không tuần hoàn',`${SQ(n)} = ${s} có hữu hạn chữ số thập phân nên không phải số thập phân vô hạn.`)]
         :[C('số tự nhiên',`${n} không phải bình phương của số tự nhiên nào nên ${SQ(n)} không là số tự nhiên.`),C('số thập phân hữu hạn',`${SQ(n)} là số vô tỉ, không có hữu hạn chữ số thập phân.`),C('số thập phân vô hạn tuần hoàn',`${SQ(n)} là số vô tỉ, các chữ số thập phân không lặp lại theo nhóm cố định.`)];
  const r=mk(`Số ${SQ(n)} là:`,good,cs,sq?`${n} = ${s}² nên ${SQ(n)} = ${s} là số tự nhiên.`:`${n} không là bình phương của số tự nhiên nào nên ${SQ(n)} là số vô tỉ.`,{n});return r;
});}
function genVtDec(){return tryGen(()=>{
  const k=ri(1,9),a=ri(1,9),b=ri(1,9);if(a===b)return null;
  const ab=''+a+b,g=PAT(k);
  const ws=[C(`0,${ab}${ab}${ab}...`,`Nhóm ${ab} lặp lại mãi nên đây là số thập phân vô hạn tuần hoàn, là số hữu tỉ.`),C(`0,${a}${b}${b}${b}...`,`Chữ số ${b} lặp lại mãi nên đây là số thập phân vô hạn tuần hoàn, là số hữu tỉ.`),C(`0,${a}${b}${a}${b}`,'Số này có hữu hạn chữ số thập phân nên là số hữu tỉ.')];
  const r=mk('Số thập phân nào sau đây là số vô tỉ?',g,ws,PAT_ERR,{k});return r;
});}

/* ============ Nội dung 2: căn bậc hai số học ============ */
function genCbPerf(){return tryGen(()=>{
  const s=ri(2,25),n=s*s;
  const cs=[C('−'+s,'Căn bậc hai số học là số không âm, nên không thể là số âm.'),C(dt(n/2),'Đây là một nửa của số đã cho, không phải căn bậc hai số học.')];
  [s+1,s-1,2*s].forEach(v=>cs.push(C(String(v),sqErr(v,n))));
  const r=mk(`Căn bậc hai số học của ${grp(n)} là:`,String(s),cs,`Vì ${s}² = ${grp(n)} và ${s} > 0 nên căn bậc hai số học của ${grp(n)} là ${s}.`,{n});return r;
});}
function genCbSq(){return tryGen(()=>{
  const a=RNG()<.3?sel([191,2021,1000,365,111]):ri(2,99),n=a*a;
  const cs=[C(grp(n),`Đây là a², chưa lấy căn bậc hai: √(a²) = a.`),C('−'+grp(a),'Căn bậc hai số học là số không âm.'),C(grp(2*a),'√(a²) = a, không phải 2a.'),C(dt(a/2),'√(a²) = a, không phải một nửa của a.')];
  const r=mk(`Giá trị của ${SQ2(a)} là:`,grp(a),cs,`Vì ${grp(a)} > 0 nên ${SQ2(a)} = ${grp(a)}.`,{a});return r;
});}
function genCbSq2(){return tryGen(()=>{
  const n=ri(2,200);
  const cs=[C(SQ(n),`(√${n})² = ${n}; ${SQ(n)} là căn bậc hai, chưa bình phương.`),C(grp(n*n),`Đây là ${n}², còn (√${n})² = ${n}.`),C(grp(2*n),`(√${n})² = ${n}, không phải gấp đôi.`),C(dt(n/2),`(√${n})² = ${n}, không phải một nửa.`)];
  const r=mk(`Giá trị của (${SQ(n)})² là:`,grp(n),cs,`Theo định nghĩa, ${SQ(n)} là số không âm có bình phương bằng ${grp(n)}, nên (${SQ(n)})² = ${grp(n)}.`,{n});return r;
});}
function genCbDec(){return tryGen(()=>{
  const s=ri(2,39);if(s%10===0)return null;
  const n=s*s/100,v=s/10;
  const cs=[C(String(s),'Đã bỏ dấu phẩy: 16² = 256, không phải 2,56; phải đặt dấu phẩy đúng chỗ.'),C(dt(s/100),`${dt(s/100)}² = ${dt(s*s/10000)}, không bằng ${dt(n)}.`),C(dt(n/2),'Đây là một nửa số đã cho, không phải căn bậc hai.')];
  const r=mk(`Giá trị của ${SQD(n)} là:`,dt(v),cs,`Vì ${dt(v)}² = ${dt(n)} và ${dt(v)} > 0 nên ${SQD(n)} = ${dt(v)}.`,{s});
  r.opts.slice(1).forEach(o=>{if(o.t===String(s))o.err=`${s}² = ${grp(s*s)}, không bằng ${dt(n)}.`;});return r;
});}
function genCbTrue(){return tryGen(()=>{
  const s=ri(3,15),n=s*s;
  const cs=[C(`${SQ(n)} = −${s}`,'Căn bậc hai số học là số không âm.'),C(`${SQ(n)} = ${dt(n/2)}`,'Căn bậc hai không phải một nửa của số đó.'),C(`${SQ2(s)} = ${grp(n)}`,`√(a²) = a, tức ${SQ2(s)} = ${s}.`)];
  const r=mk('Khẳng định nào sau đây đúng?',`${SQ(n)} = ${s}`,cs,`${s}² = ${grp(n)} và ${s} > 0 nên ${SQ(n)} = ${s}.`,{s});return r;
});}
function genCbGiven(){return tryGen(()=>{
  const s=ri(12,99),n=s*s;if(s%10===0)return null;
  const cs=[C(grp(n),`Đây là ${s}² = ${grp(n)}, chưa lấy căn.`),C(String(s+1),sqErr(s+1,n)),C(String(s-1),sqErr(s-1,n)),C(dt(n/2),'Đây là một nửa của số đã cho.')];
  const r=mk(`Cho biết ${s}² = ${grp(n)}. Giá trị của ${SQ(n)} là:`,String(s),cs,`Vì ${s}² = ${grp(n)} và ${s} > 0 nên ${SQ(n)} = ${s}.`,{s});return r;
});}
function genCbSum(){return tryGen(()=>{
  const s1=ri(2,12),s2=ri(2,12);if(s1===s2)return null;
  const minus=RNG()<.4,A=minus?Math.max(s1,s2):s1,Bq=minus?Math.min(s1,s2):s2,a=A*A,b=Bq*Bq,v=minus?A-Bq:A+Bq,op=minus?'−':'+',ab=minus?a-b:a+b;
  const cs=[C(isSq(ab)?String(isq(ab)):SQ(ab),`Không được ${minus?'trừ':'cộng'} hai số dưới dấu căn: ${SQ(a)} ${op} ${SQ(b)} = ${A} ${op} ${Bq}, khác ${SQ(ab)}.`),C(grp(ab),`Đã bỏ dấu căn: phải tính ${SQ(a)} = ${A} và ${SQ(b)} = ${Bq} trước.`),C(String(minus?A+Bq:A*Bq),minus?'Phép tính là phép trừ: '+A+' − '+Bq+'.':`Phép tính là phép cộng: ${A} + ${Bq}.`),C(String(minus?A*Bq:Math.abs(A-Bq)),'Hãy tính hai căn bậc hai rồi thực hiện đúng phép tính đã cho.')];
  const r=mk(`Giá trị của biểu thức ${SQ(a)} ${op} ${SQ(b)} là:`,String(v),cs,`${SQ(a)} = ${A}, ${SQ(b)} = ${Bq} nên ${A} ${op} ${Bq} = ${v}.`,{a,b,minus});return r;
});}

/* ============ Nội dung 3: máy tính và làm tròn ============ */
function nonsq(lo,hi){let n;do{n=ri(lo,hi);}while(isSq(n));return n;}
function rootCands(n,p){ // các giá trị sai khi làm tròn √n đến p chữ số thập phân
  const R=rdSqrt(n,p),f=isq(n*Math.pow(10,2*p+2)),T=Math.floor(f/10),out=[];
  const add=(val,pp,err)=>{if(pp>0&&val%10===0)return;out.push(C(scStr(val,pp),err));};
  if(T!==R)add(T,p,`Chữ số kề sau là ${f%10}, từ 5 trở lên nên phải tăng chữ số hàng làm tròn thêm 1, không chỉ cắt bỏ.`);
  add(R+1,p,'Sai chữ số ở hàng làm tròn: hãy xét chữ số kề sau hàng làm tròn.');
  if(R>0)add(R-1,p,'Sai chữ số ở hàng làm tròn: hãy xét chữ số kề sau hàng làm tròn.');
  if(p>=1)add(rdSqrt(n,p-1),p-1,`Bạn đã làm tròn đến ${HANGP[p-1]}, quá sớm so với yêu cầu.`);
  if(p<=2)add(rdSqrt(n,p+1),p+1,`Bạn đã giữ thừa một chữ số: phải làm tròn đến ${HANGP[p]}.`);
  return out;
}
function genMtRound(){return tryGen(()=>{
  const p=sel([1,2,2,3]),n=nonsq(2,RNG()<.3?9999:300),R=rdSqrt(n,p);if(R%10===0)return null;
  const g=scStr(R,p);
  const r=mk(`Làm tròn ${SQ(n)} đến ${HANGP[p]}. Kết quả là:`,g,rootCands(n,p),`Dùng máy tính: ${SQ(n)} = ${scStr(rdSqrt(n,p+3),p+3)}... Làm tròn đến ${HANGP[p]} được ${g}.`,{n,p});return r;
});}
function genMtAcc(){return tryGen(()=>{
  const p=sel([0,1,1,2,3]),n=nonsq(2,RNG()<.3?9999:300),R=rdSqrt(n,p);if(p>0&&R%10===0)return null;
  const g=scStr(R,p);
  const r=mk(`Dùng máy tính cầm tay, tính ${SQ(n)} rồi làm tròn kết quả với độ chính xác ${ACCP[p]}. Kết quả là:`,g,rootCands(n,p),`Độ chính xác ${ACCP[p]} ứng với làm tròn đến ${HANGP[p]}. ${SQ(n)} = ${scStr(rdSqrt(n,p+3),p+3)}... ≈ ${g}.`,{n,p,acc:1});return r;
});}
function genMtBetw(){return tryGen(()=>{
  const n=nonsq(10,300),k=isq(n);
  const pr=(a)=>`${a} và ${a+1}`,why=a=>`${a}² = ${a*a} và ${a+1}² = ${(a+1)*(a+1)}; ${n} không nằm giữa hai số này.`;
  const cs=[C(pr(k-1),why(k-1)),C(pr(k+1),why(k+1)),C(pr(k-2),why(k-2)),C(pr(k+2),why(k+2))];
  const r=mk(`Số ${SQ(n)} nằm giữa hai số tự nhiên liên tiếp nào?`,pr(k),cs,`Vì ${k}² = ${k*k} < ${n} < ${(k+1)*(k+1)} = ${k+1}² nên ${k} < ${SQ(n)} < ${k+1}.`,{n});return r;
});}
function genMtCmp(){return tryGen(()=>{
  const half=RNG()<.5,k=ri(3,14);let n,b,bs;
  if(!half){b=k;bs=String(k);n=RNG()<.2?k*k:Math.max(2,k*k+ri(-k,k));}
  else{b=k+.5;bs=dt(b);const c=k*k+k;n=c+ri(-k+1,k)-0; if(n<2)return null;}   // (k+0,5)² = k² + k + 0,25
  const rel=half?(n*100>(b*10)*(b*10)?'>':n*100<(b*10)*(b*10)?'<':'='):(n>b*b?'>':n<b*b?'<':'=');
  const sym=['>','<','='],NO='Không so sánh được vì √n là số vô tỉ';
  const why=x=>rel==='='?`${bs}² = ${dt(b*b)} = ${n} nên ${SQ(n)} = ${bs}, không lớn hơn hay nhỏ hơn.`:x==='='?`${SQ(n)} không bằng ${bs}: ${bs}² = ${dt(b*b)} khác ${n}.`:`Ta có ${bs}² = ${dt(b*b)} ${n>b*b?'<':'>'} ${n}, nên ${SQ(n)} ${n>b*b?'>':'<'} ${bs}.`;
  const cs=sym.filter(x=>x!==rel).map(x=>C(`${SQ(n)} ${x} ${bs}`,why(x))).concat([C(NO.replace('√n',SQ(n)),'Hai số thực luôn so sánh được; ta so sánh bình phương của chúng.')]);
  const r=mk(`So sánh ${SQ(n)} và ${bs}. Chọn kết quả đúng:`,`${SQ(n)} ${rel} ${bs}`,cs,`Vì ${bs}² = ${dt(b*b)} ${rel==='='?'=':(n>b*b?'<':'>')} ${n} nên ${SQ(n)} ${rel} ${bs}.`,{n,b:bs,rel});return r;
});}

/* ============ Nội dung 4: vận dụng thực tế ============ */
function genTtSide(){return tryGen(()=>{
  const ha=RNG()<.35;let A,s,stem,good,cs;
  if(ha){const h=sel([1,4,9,16,25]);s=isq(h);A=h;stem=`Một mảnh đất hình vuông có diện tích ${h} ha (1 ha = 10 000 m²). Độ dài cạnh mảnh đất là:`;good=`${100*s} m`;
    cs=[C(`${s} m`,'Chưa đổi đơn vị: 1 ha = 10 000 m², nên cạnh là 100 · √'+h+' m.'),C(`${10*s} m`,'Mỗi ha có 10 000 m², không phải 100 m²; cạnh là 100 · √'+h+' m.'),C(`${1000*s} m`,'Căn bậc hai của 10 000 là 100, không phải 1 000.'),C(`${dt(h*10000/4)} m`,'Đây là diện tích chia 4, không phải căn bậc hai của diện tích.')];}
  else{s=ri(5,60);A=s*s;const u=sel(['m²','dm²']);stem=`Một hình vuông có diện tích ${grp(A)} ${u}. Độ dài cạnh hình vuông là:`;good=`${s} ${u.replace('²','')}`;
    cs=[C(`${dt(A/4)} ${u.replace('²','')}`,'Đây là diện tích chia 4, không phải căn bậc hai.'),C(`${2*s} ${u.replace('²','')}`,sqErr(2*s,A)),C(`${dt(A/2)} ${u.replace('²','')}`,'Đây là một nửa diện tích, không phải căn bậc hai.'),C(`${s+3} ${u.replace('²','')}`,sqErr(s+3,A))];}
  const r=mk(stem,good,cs,ha?`${h2(A)} ha = ${grp(A*10000)} m² = ${grp(100*s)}² m² nên cạnh dài ${grp(100*s)} m.`:`Vì ${s}² = ${grp(A)} và ${s} > 0 nên cạnh dài ${s}.`,{A,ha});return r;
});}
const h2=x=>String(x);
function genTtPerim(){return tryGen(()=>{
  const s=ri(5,40),A=s*s;
  const cs=[C(`${s} m`,'Đây mới là độ dài một cạnh; chu vi là tổng độ dài bốn cạnh.'),C(`${2*s} m`,'Đây là nửa chu vi; chu vi là tổng độ dài bốn cạnh.'),C(`${grp(A)} m`,'Đây là diện tích, không phải chu vi.'),C(`${8*s} m`,'Chu vi hình vuông gấp 4 lần cạnh, không phải 8 lần.')];
  const r=mk(`Sàn thi đấu có dạng hình vuông với diện tích ${grp(A)} m². Chu vi sàn là:`,`${4*s} m`,cs,`Cạnh sàn là ${SQ(A)} = ${s} m, chu vi là 4 · ${s} = ${4*s} m.`,{A});return r;
});}
function diagData(){for(;;){const a=ri(4,30),b=ri(3,a-1),d=a*a+b*b;if(isSq(d))continue;const R=rdSqrt(d,1);if(R%10===0)continue;return {a,b,d,R};}}
function genTtDiag(){return tryGen(()=>{
  const {a,b,d,R}=diagData(),g=scStr(R,1);
  const cs=[C(String(a+b),'Đường chéo ngắn hơn tổng hai cạnh; phải dùng d² = a² + b².'),C(grp(d),'Đây là d², chưa lấy căn bậc hai.'),C(scStr(R+1,1),'Sai chữ số ở hàng phần mười: hãy làm tròn đúng.'),C(scStr(R-1,1),'Sai chữ số ở hàng phần mười: hãy làm tròn đúng.')];
  if(a>b&&!isSq(a*a-b*b)){const q=rdSqrt(a*a-b*b,1);if(q%10!==0)cs.unshift(C(scStr(q,1),'Bạn đã lấy a² − b²; bình phương đường chéo bằng tổng a² + b².'));}
  const r=mk(`Một hình chữ nhật có chiều dài ${a} dm và chiều rộng ${b} dm. Biết bình phương độ dài đường chéo bằng tổng các bình phương độ dài hai cạnh. Đường chéo của hình chữ nhật dài bao nhiêu đêximét (làm tròn đến hàng phần mười)?`,g,cs,`d² = ${a}² + ${b}² = ${grp(d)}, d = ${SQ(d)} ≈ ${g} dm.`,{a,b});return r;
});}
function tilesData(){for(;;){const s=ri(4,20),t=sel([20,25,40,50,100]);if((100*s)%t)continue;const k=100*s/t;return {s,t,k,A:s*s,n:k*k};}}
function genTtTiles(){return tryGen(()=>{
  const {s,t,k,A,n}=tilesData();
  const cs=[C(grp(k),`Đây là số viên xếp dọc một cạnh (${k}); phải lấy ${k} · ${k}.`),C(grp(A*10000/t),'Đã lấy diện tích (cm²) chia cho cạnh viên gạch; phải chia cho diện tích viên gạch.'),C(grp(A*100/t),'Chưa đổi đúng đơn vị: 1 m = 100 cm, 1 m² = 10 000 cm².'),C(grp(n*4),'Số viên gạch không gấp bốn lần như vậy.'),C(grp(n/4),'Đã tính thiếu; hãy chia diện tích sân cho diện tích một viên gạch.')];
  const r=mk(`Để lát một sân hình vuông có diện tích ${grp(A)} m², người ta dùng những viên gạch hình vuông có cạnh ${t} cm (coi các mạch ghép là không đáng kể). Cần dùng bao nhiêu viên gạch?`,grp(n),cs,`Cạnh sân là ${SQ(A)} = ${s} m = ${grp(100*s)} cm, mỗi hàng có ${grp(100*s)} : ${t} = ${k} viên, nên cần ${k} · ${k} = ${grp(n)} viên.`,{s,t});return r;
});}

/* ============ Ngân hàng nhiều lựa chọn (câu cố định) ============ */
const O=(t,err)=>err?{t,err}:{t};
const MC=[
 {id:'m1',topic:'vt',level:'NB',stem:'Số vô tỉ là số viết được dưới dạng:',ans:0,opts:[O('số thập phân vô hạn không tuần hoàn'),O('số thập phân hữu hạn','Số thập phân hữu hạn là số hữu tỉ.'),O('số thập phân vô hạn tuần hoàn','Số thập phân vô hạn tuần hoàn là số hữu tỉ, viết được dưới dạng phân số.'),O('phân số với tử và mẫu là số nguyên (mẫu khác 0)','Số viết được dưới dạng phân số như vậy là số hữu tỉ.')],
  exp:'Số vô tỉ là số viết được dưới dạng số thập phân vô hạn không tuần hoàn.'},
 {id:'m2',topic:'vt',level:'NB',stem:'Tập hợp các số vô tỉ được kí hiệu là:',ans:0,opts:[O('I'),O('ℚ','ℚ là kí hiệu tập hợp các số hữu tỉ.'),O('ℕ','ℕ là kí hiệu tập hợp các số tự nhiên.'),O('ℤ','ℤ là kí hiệu tập hợp các số nguyên.')],
  exp:'Tập hợp các số vô tỉ được kí hiệu là I (chữ I in hoa).'},
 {id:'m3',topic:'vt',level:'NB',stem:'Tỉ số giữa chu vi và đường kính của một đường tròn luôn bằng số π = 3,14159265358... Số π là:',ans:0,opts:[O('số vô tỉ'),O('số thập phân hữu hạn','Số π có vô hạn chữ số thập phân.'),O('số thập phân vô hạn tuần hoàn','Các chữ số thập phân của π không lặp lại theo một nhóm cố định.'),O('số nguyên','π nằm giữa 3 và 4, không phải số nguyên.')],
  exp:'π là số thập phân vô hạn không tuần hoàn nên là số vô tỉ.'},
 {id:'m4',topic:'vt',level:'TH',stem:'Hình vuông có diện tích 2 dm². Gọi x (dm, x > 0) là độ dài cạnh thì x² = 2. Số x là:',ans:0,opts:[O('số vô tỉ'),O('số nguyên','1² = 1 và 2² = 4 nên không có số nguyên nào có bình phương bằng 2.'),O('số thập phân hữu hạn','Không có số hữu tỉ nào có bình phương bằng 2, mà số thập phân hữu hạn là số hữu tỉ.'),O('số thập phân vô hạn tuần hoàn','Số thập phân vô hạn tuần hoàn là số hữu tỉ, mà không có số hữu tỉ nào có bình phương bằng 2.')],
  exp:'Không có số hữu tỉ nào có bình phương bằng 2; x = 1,41421356... là số thập phân vô hạn không tuần hoàn, tức là số vô tỉ.'},
 {id:'m5',topic:'vt',level:'TH',stem:'Căn bậc hai số học của một số tự nhiên không chính phương luôn là:',ans:0,opts:[O('số vô tỉ'),O('số tự nhiên','Số tự nhiên có bình phương là số chính phương, không phải số đã cho.'),O('số thập phân hữu hạn','Căn bậc hai số học của số không chính phương có vô hạn chữ số thập phân.'),O('số thập phân vô hạn tuần hoàn','Các chữ số thập phân của nó không lặp lại theo một nhóm cố định.')],
  exp:'Căn bậc hai số học của một số tự nhiên không chính phương luôn là số vô tỉ (chẳng hạn √2, √91).'},
 {id:'m6',topic:'vt',level:'VD',stem:'Cho bốn khẳng định: (I) π là số vô tỉ. (II) √16 là số vô tỉ. (III) 0,1010010001... (số chữ số 0 giữa hai chữ số 1 tăng dần) là số vô tỉ. (IV) 3,(14) là số vô tỉ. Số khẳng định đúng là:',ans:0,opts:[O('2'),O('1','Có ít nhất hai khẳng định đúng: (I) và (III).'),O('3','Chỉ (I) và (III) đúng; √16 = 4 và 3,(14) là số hữu tỉ.'),O('4','√16 = 4 là số tự nhiên và 3,(14) là số thập phân vô hạn tuần hoàn nên (II) và (IV) sai.')],
  exp:'(I) đúng. (II) sai vì √16 = 4. (III) đúng. (IV) sai vì 3,(14) là số thập phân vô hạn tuần hoàn. Có 2 khẳng định đúng.'},
 {id:'m7',topic:'cb',level:'NB',stem:'Căn bậc hai số học của số a không âm, kí hiệu √a, là số x thỏa mãn:',ans:0,opts:[O('x ≥ 0 và x² = a'),O('x ≤ 0 và x² = a','Căn bậc hai số học phải là số không âm.'),O('x ≥ 0 và x = a²','x phải thỏa mãn x² = a, không phải x = a².'),O('x ≥ 0 và 2x = a','x phải thỏa mãn x² = a, không phải 2x = a.')],
  exp:'Căn bậc hai số học của số a không âm là số x không âm sao cho x² = a.'},
 {id:'m8',topic:'cb',level:'NB',stem:'Căn bậc hai số học √a chỉ xác định khi:',ans:0,opts:[O('a ≥ 0'),O('a > 0','√0 = 0 nên a = 0 cũng có căn bậc hai số học.'),O('a ≤ 0','Số âm không có căn bậc hai số học.'),O('a là số chính phương','Số không chính phương như 2 vẫn có căn bậc hai số học là √2.')],
  exp:'Căn bậc hai số học xác định với mọi số a không âm.'},
 {id:'m9',topic:'cb',level:'NB',stem:'Căn bậc hai số học của 0 là:',ans:0,opts:[O('0'),O('1','1² = 1, không bằng 0.'),O('không tồn tại','0 là số không âm và 0² = 0 nên √0 = 0.'),O('−1','Căn bậc hai số học là số không âm, và (−1)² = 1.')],
  exp:'Vì 0² = 0 và 0 không âm nên √0 = 0.'},
 {id:'m10',topic:'cb',level:'TH',stem:'Phát biểu nào sau đây đúng?',ans:0,opts:[O('√16 = 4'),O('√16 = −4','Căn bậc hai số học là số không âm.'),O('√16 = ±4','Căn bậc hai số học của 16 chỉ là một số không âm, không phải hai giá trị.'),O('√16 = 8','8² = 64, không bằng 16 (8 là một nửa của 16).')],
  exp:'4² = 16 và 4 > 0 nên √16 = 4.'},
 {id:'m11',topic:'cb',level:'TH',stem:'Với a > 0, √(a²) bằng:',ans:0,opts:[O('a'),O('a²','√(a²) là căn của a², không phải a².'),O('2a','√(a²) = a, không phải 2a.'),O('−a','Căn bậc hai số học không âm, mà a > 0.')],
  exp:'Vì a > 0 và a² = a² nên √(a²) = a.'},
 {id:'m12',topic:'mt',level:'NB',stem:'Màn hình máy tính cầm tay hiển thị √2 = 1,414213562. Vì màn hình chỉ hiển thị hữu hạn chữ số nên kết quả này là:',ans:0,opts:[O('giá trị gần đúng của √2 (đã làm tròn)'),O('giá trị đúng của √2','√2 là số vô tỉ có vô hạn chữ số thập phân nên không thể viết đủ trên màn hình.'),O('một số thập phân vô hạn tuần hoàn','√2 là số vô tỉ, không phải số thập phân vô hạn tuần hoàn.'),O('một số nguyên','1,414213562 không phải số nguyên.')],
  exp:'√2 là số vô tỉ nên số hiển thị trên máy tính chỉ là giá trị gần đúng: √2 ≈ 1,414213562.'},
 {id:'m13',topic:'mt',level:'NB',stem:'Để làm tròn một số với độ chính xác 0,05, ta làm tròn số đó đến:',ans:0,opts:[O('hàng phần mười'),O('hàng phần trăm','Làm tròn đến hàng phần trăm có độ chính xác 0,005.'),O('hàng đơn vị','Làm tròn đến hàng đơn vị có độ chính xác 0,5.'),O('hàng phần nghìn','Làm tròn đến hàng phần nghìn có độ chính xác 0,0005.')],
  exp:'0,05 là một nửa của 0,1 nên ta làm tròn đến hàng phần mười.'},
 {id:'m14',topic:'mt',level:'NB',stem:'Kí hiệu “≈” trong √2 ≈ 1,41 được đọc là:',ans:0,opts:[O('xấp xỉ (gần bằng)'),O('bằng','Dấu “=” mới có nghĩa là bằng nhau.'),O('lớn hơn','Dấu lớn hơn là “>”.'),O('nhỏ hơn','Dấu nhỏ hơn là “<”.')],
  exp:'Kí hiệu ≈ đọc là “xấp xỉ”, dùng khi viết giá trị gần đúng.'},
 {id:'m15',topic:'tt',level:'NB',stem:'Hình vuông có diện tích a thì độ dài cạnh x (x > 0) thỏa mãn:',ans:0,opts:[O('x² = a'),O('x = a²','Diện tích là bình phương của cạnh: a = x².'),O('2x = a','Diện tích không phải gấp đôi cạnh.'),O('4x = a','4x là chu vi, không phải diện tích.')],
  exp:'Diện tích hình vuông bằng bình phương độ dài cạnh nên x² = a.'},
 {id:'m16',topic:'tt',level:'TH',stem:'Bình phương độ dài đường chéo của hình chữ nhật bằng tổng các bình phương độ dài hai cạnh. Hình chữ nhật có hai cạnh 3 dm và 4 dm thì đường chéo dài:',ans:0,opts:[O('5 dm'),O('7 dm','Đường chéo không bằng tổng hai cạnh: d² = 3² + 4² = 25.'),O('25 dm','25 là d², còn đường chéo d = √25 = 5.'),O('12 dm','12 là tích hai cạnh, không phải đường chéo.')],
  exp:'d² = 3² + 4² = 25 nên d = √25 = 5 dm.'}
];
const addMC=(id,topic,level,gen)=>['a','b'].forEach(x=>MC.push({id:id+'_'+x,type:'mc',topic,level,gen}));
MC.forEach(q=>q.type='mc');
addMC('g_vtkind','vt','NB',genVtKind);addMC('g_vtnot','vt','TH',genVtNot);addMC('g_vtsqrt','vt','TH',genVtSqrt);addMC('g_vtdec','vt','TH',genVtDec);
addMC('g_cbperf','cb','NB',genCbPerf);addMC('g_cbsq','cb','NB',genCbSq);addMC('g_cbsq2','cb','TH',genCbSq2);addMC('g_cbdec','cb','TH',genCbDec);addMC('g_cbtrue','cb','TH',genCbTrue);addMC('g_cbgiven','cb','TH',genCbGiven);addMC('g_cbsum','cb','VD',genCbSum);
addMC('g_mtround','mt','TH',genMtRound);addMC('g_mtacc','mt','TH',genMtAcc);addMC('g_mtbetw','mt','TH',genMtBetw);addMC('g_mtcmp','mt','VD',genMtCmp);
addMC('g_ttside','tt','TH',genTtSide);addMC('g_ttperim','tt','TH',genTtPerim);addMC('g_ttdiag','tt','VD',genTtDiag);addMC('g_tttiles','tt','VD',genTtTiles);

/* ============ Bộ sinh đúng sai ============ */
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
function pick4(Ts,Fs){const nT=ri(1,3);return shuffle(shuffle(Ts).slice(0,nT).concat(shuffle(Fs).slice(0,4-nT)));}
function mixed(make){
  for(let n=0;n<80;n++){const items=make();if(items.some(i=>!i))continue;const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}
  return null;
}
const FB_TF=()=>({stem:'Xét các phát biểu sau:',items:[
  IT('π là số vô tỉ',true,'vt','NB','π = 3,14159265358... là số thập phân vô hạn không tuần hoàn.'),
  IT('√25 = −5',false,'cb','TH','Căn bậc hai số học là số không âm: √25 = 5.'),
  IT('Làm tròn đến hàng phần mười thì độ chính xác là 0,05',true,'mt','NB','Độ chính xác bằng một nửa đơn vị hàng làm tròn: một nửa của 0,1 là 0,05.'),
  IT('Hình vuông diện tích 49 m² có chu vi 7 m',false,'tt','TH','Cạnh là 7 m, chu vi là 4 · 7 = 28 m.')]});
const four=f=>()=>{const items=mixed(()=>[f(),f(),f(),f()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};
const sgnOf=(n,b)=>n>b?'>':n<b?'<':'=';

function vtItem(lv){
  const t=ri(0,lv==='VD'?8:5);
  if(t===0){const n=nonsq(2,80);return IT(`${SQ(n)} là số vô tỉ`,true,'vt','TH',`${n} không là bình phương của số tự nhiên nào nên ${SQ(n)} là số vô tỉ.`);}
  if(t===1){const s=ri(2,12);return IT(`${SQ(s*s)} là số vô tỉ`,false,'vt','TH',`${SQ(s*s)} = ${s} là số tự nhiên nên là số hữu tỉ.`);}
  if(t===2){const s=ri(2,12);return IT(`${SQ(s*s)} là số hữu tỉ`,true,'vt','TH',`${SQ(s*s)} = ${s} là số tự nhiên nên là số hữu tỉ.`);}
  if(t===3){const k=ri(1,9);return IT(`${PAT(k)} là số vô tỉ`,true,'vt','TH',PAT_ERR);}
  if(t===4){const x=sel(PERS);return IT(`${x} là số vô tỉ`,false,'vt','TH',`${x} là số thập phân vô hạn tuần hoàn nên là số hữu tỉ.`);}
  if(t===5){const n=nonsq(2,80);return IT(`${SQ(n)} là số hữu tỉ`,false,'vt','TH',`${SQ(n)} là số vô tỉ vì ${n} không là số chính phương.`);}
  if(t===6)return IT('Mọi số thập phân vô hạn đều là số vô tỉ',false,'vt','VD','Số thập phân vô hạn tuần hoàn (như 0,(3)) vô hạn nhưng là số hữu tỉ.');
  if(t===7)return IT('Số thập phân hữu hạn là số vô tỉ',false,'vt','VD','Số thập phân hữu hạn viết được dưới dạng phân số nên là số hữu tỉ.');
  return IT('Số vô tỉ viết được dưới dạng số thập phân vô hạn không tuần hoàn',true,'vt','VD','Đây chính là định nghĩa số vô tỉ.');
}
function cbItem(lv){
  const t=ri(0,lv==='VD'?9:6),s=ri(3,15),n=s*s;
  if(t===0)return IT(`${SQ(n)} = ${s}`,true,'cb','TH',`${s}² = ${grp(n)} và ${s} > 0 nên ${SQ(n)} = ${s}.`);
  if(t===1)return IT(`${SQ(n)} = −${s}`,false,'cb','TH',`Căn bậc hai số học là số không âm nên ${SQ(n)} = ${s}.`);
  if(t===2)return IT(`${SQ(n)} = ${dt(n/2)}`,false,'cb','TH',`${dt(n/2)}² khác ${grp(n)}; ${SQ(n)} = ${s}.`);
  if(t===3)return IT(`${SQ2(s)} = ${s}`,true,'cb','TH',`Với số dương a, √(a²) = a.`);
  if(t===4)return IT(`${SQ2(s)} = ${grp(n)}`,false,'cb','TH',`√(a²) = a nên ${SQ2(s)} = ${s}.`);
  if(t===5){const m=ri(2,99);return IT(`(${SQ(m)})² = ${grp(m)}`,true,'cb','TH',`Theo định nghĩa, (√a)² = a với a ≥ 0.`);}
  if(t===6){const m=ri(2,99);return IT(`(${SQ(m)})² = ${SQ(m)}`,false,'cb','TH',`(√${m})² = ${m}, khác ${SQ(m)}.`);}
  const s1=ri(2,9),s2=ri(2,9);if(s1===s2)return cbItem(lv);
  if(t===7)return IT(`${SQ(s1*s1)} + ${SQ(s2*s2)} = ${SQ(s1*s1+s2*s2)}`,false,'cb','VD',`${SQ(s1*s1)} + ${SQ(s2*s2)} = ${s1} + ${s2} = ${s1+s2}; không được cộng các số dưới dấu căn.`);
  if(t===8)return IT(`${SQ(s1*s1)} + ${SQ(s2*s2)} = ${s1+s2}`,true,'cb','VD',`${SQ(s1*s1)} = ${s1}, ${SQ(s2*s2)} = ${s2} nên tổng là ${s1+s2}.`);
  return IT(`Số ${grp(n)} có hai căn bậc hai số học là ${s} và −${s}`,false,'cb','VD','Mỗi số không âm chỉ có một căn bậc hai số học, và nó không âm.');
}
function mtItem(lv){
  const t=ri(0,lv==='VD'?5:4);
  if(t===0){const p=sel([1,2,3]),n=nonsq(2,300),R=rdSqrt(n,p);if(R%10===0)return null;const ok=RNG()<.5,c=rootCands(n,p)[0];if(!c)return null;
    return IT(`Làm tròn ${SQ(n)} đến ${HANGP[p]} được ${ok?scStr(R,p):c.t}`,ok,'mt','TH',`${SQ(n)} = ${scStr(rdSqrt(n,p+3),p+3)}... làm tròn đến ${HANGP[p]} được ${scStr(R,p)}.`);}
  if(t===1){const n=nonsq(10,300),k=isq(n),ok=RNG()<.5,a=ok?k:k+(RNG()<.5?1:-1);return IT(`${SQ(n)} nằm giữa ${a} và ${a+1}`,ok,'mt','TH',`${k}² = ${k*k} < ${n} < ${(k+1)*(k+1)} = ${k+1}² nên ${SQ(n)} nằm giữa ${k} và ${k+1}.`);}
  if(t===2){const n=nonsq(10,300),k=isq(n),b=RNG()<.5?k:k+1,r=sgnOf(n,b*b),ok=RNG()<.5,x=ok?r:(r==='>'?'<':'>');return IT(`${SQ(n)} ${x} ${b}`,ok,'mt','TH',`${b}² = ${b*b}, mà ${n} ${r==='>'?'>':'<'} ${b*b} nên ${SQ(n)} ${r} ${b}.`);}
  if(t===3){const sq=RNG()<.5,s=ri(3,20),n=sq?s*s:nonsq(2,200);return IT(`Kết quả ${SQ(n)} hiện trên máy tính cầm tay là giá trị đúng của ${SQ(n)}`,sq,'mt','TH',sq?`${SQ(n)} = ${s} là số tự nhiên, máy tính cho kết quả đúng.`:`${SQ(n)} là số vô tỉ nên kết quả trên máy tính chỉ là giá trị gần đúng.`);}
  if(t===4){const p=ri(0,3),ok=RNG()<.5,q=ok?p:(p===0?1:p-1);return IT(`Làm tròn với độ chính xác ${ACCP[p]} là làm tròn đến ${HANGP[q]}`,ok,'mt','TH',`Độ chính xác ${ACCP[p]} ứng với làm tròn đến ${HANGP[p]}.`);}
  const n=nonsq(10,300),k=isq(n),ok=RNG()<.5,a=ok?k:k+1;return IT(`${SQ(n)} − ${a} nằm giữa 0 và 1`,ok,'mt','VD',`${k} < ${SQ(n)} < ${k+1} nên ${SQ(n)} − ${k} nằm giữa 0 và 1${ok?'':`, còn ${SQ(n)} − ${k+1} là số âm`}.`);
}
function ttItem(lv){
  const t=ri(0,lv==='VD'?5:4);
  if(t===0){const s=ri(5,40),ok=RNG()<.5,v=ok?s:sel([s*s/4,s*s/2,2*s,s+3]);return IT(`Hình vuông diện tích ${grp(s*s)} m² có cạnh dài ${dt(v)} m`,ok,'tt','TH',`Cạnh dài ${SQ(s*s)} = ${s} m.`);}
  if(t===1){const s=ri(4,40),ok=RNG()<.5,v=ok?4*s:sel([s,2*s,8*s]);return IT(`Hình vuông diện tích ${grp(s*s)} m² có chu vi ${dt(v)} m`,ok,'tt','TH',`Cạnh dài ${s} m, chu vi là 4 · ${s} = ${4*s} m.`);}
  if(t===2){const k=ri(1,9),ok=RNG()<.5;return IT(`Hình chữ nhật có hai cạnh ${3*k} dm và ${4*k} dm có đường chéo dài ${ok?5*k:7*k} dm`,ok,'tt','TH',`d² = ${(3*k)*(3*k)} + ${(4*k)*(4*k)} = ${25*k*k} nên d = ${5*k} dm.`);}
  if(t===3){const ok=RNG()<.5;return IT(`1 ha = ${ok?'10 000':'100'} m²`,ok,'tt','TH','1 ha = 1 hm² = 100 m · 100 m = 10 000 m².');}
  if(t===4){const h=sel([1,4,9,16]),s=isq(h),ok=RNG()<.5;return IT(`Mảnh đất hình vuông diện tích ${h} ha có cạnh dài ${ok?100*s:10*s} m`,ok,'tt','TH',`${h} ha = ${grp(h*10000)} m², cạnh dài ${grp(100*s)} m.`);}
  const a=ri(4,20),b=ri(3,a-1);return IT(`Hình chữ nhật có hai cạnh ${a} dm và ${b} dm có đường chéo dài ${a+b} dm`,false,'tt','VD',`d² = ${a}² + ${b}² = ${a*a+b*b} < (${a}+${b})² = ${(a+b)*(a+b)}, nên đường chéo ngắn hơn ${a+b} dm.`);
}
const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
['a','b'].forEach(x=>{
  addTF('tf_vt_th_'+x,'vt','TH',four(()=>vtItem('TH')));
  addTF('tf_cb_th_'+x,'cb','TH',four(()=>cbItem('TH')));
  addTF('tf_mt_th_'+x,'mt','TH',four(()=>mtItem('TH')));
  addTF('tf_tt_th_'+x,'tt','TH',four(()=>ttItem('TH')));
});
addTF('tf_vt_vd','vt','VD',four(()=>vtItem('VD')));
addTF('tf_cb_vd','cb','VD',four(()=>cbItem('VD')));
addTF('tf_mt_vd','mt','VD',four(()=>mtItem('VD')));
addTF('tf_tt_vd','tt','VD',four(()=>ttItem('VD')));
addTF('tf_mix_a','cb','TH',four(()=>[vtItem,cbItem,mtItem,ttItem][ri(0,3)]('TH')));
addTF('tf_mix_b','mt','VD',four(()=>[vtItem,cbItem,mtItem,ttItem][ri(0,3)]('VD')));
const PT=[
 IT('π là số vô tỉ',true,'vt','NB','π = 3,14159265358... là số thập phân vô hạn không tuần hoàn.'),
 IT('Số vô tỉ là số viết được dưới dạng số thập phân vô hạn không tuần hoàn',true,'vt','NB','Đây là định nghĩa số vô tỉ.'),
 IT('√2 là số vô tỉ',true,'vt','NB','2 không là số chính phương nên √2 là số vô tỉ.'),
 IT('Tập hợp các số vô tỉ được kí hiệu là I',true,'vt','NB','Kí hiệu của tập hợp các số vô tỉ là I.'),
 IT('√100 = 10',true,'cb','NB','10² = 100 và 10 > 0.'),
 IT('√0 = 0',true,'cb','NB','0² = 0.'),
 IT('Căn bậc hai số học của một số không âm là một số không âm',true,'cb','NB','Theo định nghĩa x phải không âm.'),
 IT('(√9)² = 9',true,'cb','NB','Theo định nghĩa (√a)² = a.'),
 IT('√2 ≈ 1,414213562',true,'mt','NB','Đây là giá trị gần đúng của √2 trên máy tính cầm tay.'),
 IT('Làm tròn đến hàng phần mười thì độ chính xác là 0,05',true,'mt','NB','Một nửa của 0,1 là 0,05.'),
 IT('Mọi số tự nhiên không chính phương đều có căn bậc hai số học là số vô tỉ',true,'mt','NB','Đây là nhận xét trong bài học.'),
 IT('Hình vuông có diện tích a thì cạnh dài √a',true,'tt','NB','Cạnh x thỏa mãn x² = a nên x = √a.'),
 IT('1 ha = 10 000 m²',true,'tt','NB','1 ha = 100 m · 100 m = 10 000 m².'),
 IT('Hình vuông diện tích 25 m² có cạnh dài 5 m',true,'tt','NB','5² = 25.')
];
const PF=[
 IT('0,25 là số vô tỉ',false,'vt','NB','0,25 có hữu hạn chữ số thập phân nên là số hữu tỉ.'),
 IT('0,(3) là số vô tỉ',false,'vt','NB','0,(3) là số thập phân vô hạn tuần hoàn nên là số hữu tỉ.'),
 IT('√16 là số vô tỉ',false,'vt','NB','√16 = 4 là số tự nhiên.'),
 IT('Tập hợp các số vô tỉ được kí hiệu là ℚ',false,'vt','NB','ℚ là tập hợp các số hữu tỉ.'),
 IT('√25 = −5',false,'cb','NB','Căn bậc hai số học là số không âm: √25 = 5.'),
 IT('√81 = 40,5',false,'cb','NB','√81 = 9 vì 9² = 81.'),
 IT('Số âm có căn bậc hai số học',false,'cb','NB','Căn bậc hai số học chỉ xác định với số không âm.'),
 IT('(√9)² = 3',false,'cb','NB','(√9)² = 9.'),
 IT('√2 = 1,414213562',false,'mt','NB','√2 là số vô tỉ nên 1,414213562 chỉ là giá trị gần đúng, không phải giá trị đúng.'),
 IT('Làm tròn đến hàng phần mười thì độ chính xác là 0,1',false,'mt','NB','Độ chính xác là một nửa đơn vị hàng: 0,05.'),
 IT('Màn hình máy tính cầm tay hiển thị đủ mọi chữ số thập phân của √2',false,'mt','NB','√2 có vô hạn chữ số thập phân nên máy chỉ hiển thị hữu hạn chữ số.'),
 IT('Hình vuông có diện tích a thì cạnh dài a²',false,'tt','NB','Cạnh dài √a, không phải a².'),
 IT('1 ha = 100 m²',false,'tt','NB','1 ha = 10 000 m².'),
 IT('Hình vuông diện tích 25 m² có cạnh dài 12,5 m',false,'tt','NB','Cạnh dài 5 m vì 5² = 25.')
];
const tfNB=t=>()=>({stem:'Xét các phát biểu sau:',items:pick4(PT.filter(i=>i.topic===t),PF.filter(i=>i.topic===t))});
TKEYS.forEach(t=>addTF('tf_nb_'+t,t,'NB',tfNB(t)));

/* ============ Bộ sinh trả lời ngắn ============ */
function saVtCnt(){
  const z=ri(1,4),items=[],used=new Set();let c=0;
  const add=t=>{if(!used.has(t)){used.add(t);items.push(t);return true;}return false;};
  while(c<z){const o=irrOpt();if(add(o.t))c++;}
  while(items.length<6){const o=ratOpt(RNG()<.5);add(o.t);}
  const all=shuffle(items);
  return {stem:`Trong các số sau, có bao nhiêu số là số vô tỉ? ${all.join('; ')}.`,ans:[z],exp:`Số vô tỉ là số thập phân vô hạn không tuần hoàn: ${items.slice(0,z).join('; ')}. Các số còn lại là số hữu tỉ (số tự nhiên, số nguyên, phân số, số thập phân hữu hạn hoặc vô hạn tuần hoàn, hoặc căn của số chính phương). Có ${z} số vô tỉ.`,meta:{z}};
}
function saCbVal(){
  const t=ri(0,2);
  if(t===0){const s=ri(2,40),n=s*s;return {stem:`Tính ${SQ(n)}.`,ans:[s],exp:`Vì ${s}² = ${grp(n)} và ${s} > 0 nên ${SQ(n)} = ${s}.`,meta:{t}};}
  if(t===1){const a=sel([191,2021,365,1000,111,77,50]);return {stem:`Tính ${SQ2(a)}.`,ans:[a],exp:`Vì ${grp(a)} > 0 nên ${SQ2(a)} = ${grp(a)}.`,meta:{t}};}
  let s;do{s=ri(11,39);}while(s%10===0);
  return {stem:`Tính ${SQD(s*s/100)}.`,ans:[s/10],at:dt(s/10),exp:`Vì ${dt(s/10)}² = ${dt(s*s/100)} và ${dt(s/10)} > 0 nên ${SQD(s*s/100)} = ${dt(s/10)}.`,meta:{t}};
}
function saCbSum(){
  for(;;){
    const s1=ri(2,15),s2=ri(2,15),s3=ri(2,15);if(s1+s2-s3<0)continue;
    return {stem:`Tính ${SQ(s1*s1)} + ${SQ(s2*s2)} − ${SQ(s3*s3)}.`,ans:[s1+s2-s3],exp:`${SQ(s1*s1)} = ${s1}, ${SQ(s2*s2)} = ${s2}, ${SQ(s3*s3)} = ${s3}. Vậy kết quả là ${s1} + ${s2} − ${s3} = ${s1+s2-s3}.`,meta:{}};
  }
}
function saCbCnt(){
  const a=ri(1,9),b=a+ri(2,7);
  return {stem:`Có bao nhiêu số tự nhiên n thỏa mãn ${a} < √n < ${b}?`,ans:[b*b-a*a-1],exp:`${a} < √n < ${b} tương đương ${a}² < n < ${b}², tức ${a*a} < n < ${b*b}. Các số tự nhiên n là ${a*a+1}, ${a*a+2}, ..., ${b*b-1}, có ${b*b-1} − ${a*a+1} + 1 = ${b*b-a*a-1} số.`,meta:{a,b}};
}
function saCbMin(){
  const m=ri(3,40);
  return {stem:`Tìm số tự nhiên n nhỏ nhất thỏa mãn √n > ${m}.`,ans:[m*m+1],exp:`√n > ${m} tương đương n > ${m}² = ${grp(m*m)}. Số tự nhiên nhỏ nhất lớn hơn ${grp(m*m)} là ${grp(m*m+1)}.`,meta:{m}};
}
function saMtRound(){
  for(;;){
    const p=sel([1,2,3]),n=nonsq(2,RNG()<.4?9999:300),R=rdSqrt(n,p);if(R%10===0)continue;
    return {stem:`Dùng máy tính cầm tay, tính ${SQ(n)} rồi làm tròn kết quả đến ${HANGP[p]}. Viết kết quả bằng số thập phân.`,ans:[R/Math.pow(10,p)],at:scStr(R,p),exp:`${SQ(n)} = ${scStr(rdSqrt(n,p+3),p+3)}... Làm tròn đến ${HANGP[p]} được ${scStr(R,p)}.`,meta:{n,p}};
  }
}
function saMtAcc(){
  for(;;){
    const p=sel([1,2,3]),n=nonsq(2,RNG()<.4?9999:300),R=rdSqrt(n,p);if(R%10===0)continue;
    return {stem:`Tính ${SQ(n)} rồi làm tròn kết quả với độ chính xác ${ACCP[p]}. Viết kết quả bằng số thập phân.`,ans:[R/Math.pow(10,p)],at:scStr(R,p),exp:`Độ chính xác ${ACCP[p]} ứng với làm tròn đến ${HANGP[p]}. ${SQ(n)} = ${scStr(rdSqrt(n,p+3),p+3)}... ≈ ${scStr(R,p)}.`,meta:{n,p,acc:1}};
  }
}
function saMtBetw(){
  const n=nonsq(10,300),k=isq(n);
  return {stem:`Số ${SQ(n)} nằm giữa hai số tự nhiên liên tiếp. Tính tổng của hai số tự nhiên đó.`,ans:[2*k+1],exp:`${k}² = ${k*k} < ${n} < ${(k+1)*(k+1)} = ${k+1}² nên ${k} < ${SQ(n)} < ${k+1}. Tổng hai số là ${k} + ${k+1} = ${2*k+1}.`,meta:{n}};
}
function saMtEst(){
  for(;;){
    const a=nonsq(10,200),b=nonsq(10,200),ra=rdSqrt(a,0),rb=rdSqrt(b,0);if(a===b)continue;
    return {stem:`Làm tròn ${SQ(a)} và ${SQ(b)} đến hàng đơn vị, rồi tính tích của hai số vừa làm tròn.`,ans:[ra*rb],exp:`${SQ(a)} ≈ ${ra}; ${SQ(b)} ≈ ${rb}. Tích: ${ra} · ${rb} = ${ra*rb}.`,meta:{a,b}};
  }
}
function saTtPerim(){
  const s=ri(5,60);
  return {stem:`Sân thi đấu có dạng hình vuông với diện tích ${grp(s*s)} m². Tính chu vi sân (đơn vị mét).`,ans:[4*s],exp:`Cạnh sân là ${SQ(s*s)} = ${s} m. Chu vi là 4 · ${s} = ${4*s} m.`,meta:{A:s*s}};
}
function saTtHa(){
  const h=sel([1,4,9,16,25,36]),s=isq(h);
  return {stem:`Một mảnh đất hình vuông có diện tích ${h} ha (1 ha = 10 000 m²). Tính độ dài cạnh mảnh đất (đơn vị mét).`,ans:[100*s],exp:`${h} ha = ${grp(h*10000)} m². Cạnh dài ${SQ(h*10000)} = ${grp(100*s)} m.`,meta:{h}};
}
function saTtDiag(){
  const {a,b,d,R}=diagData();
  return {stem:`Một hình chữ nhật có chiều dài ${a} dm và chiều rộng ${b} dm. Tính độ dài đường chéo (đơn vị đềximét, làm tròn đến hàng phần mười).`,ans:[R/10],at:scStr(R,1),exp:`d² = ${a}² + ${b}² = ${grp(d)}, d = ${SQ(d)} ≈ ${scStr(R,1)} dm.`,meta:{a,b}};
}
function saTtTiles(){
  const {s,t,k,A,n}=tilesData();
  return {stem:`Để lát một sân hình vuông có diện tích ${grp(A)} m², người ta dùng những viên gạch hình vuông có cạnh ${t} cm (coi các mạch ghép là không đáng kể). Cần dùng bao nhiêu viên gạch?`,ans:[n],exp:`Cạnh sân là ${s} m = ${grp(100*s)} cm; mỗi hàng có ${grp(100*s)} : ${t} = ${k} viên, nên cần ${k} · ${k} = ${grp(n)} viên.`,meta:{s,t}};
}
/* ============ Bổ sung theo tài liệu dạy thêm của giáo viên ============
   căn của phân số, căn của bình phương số âm, biểu thức nhiều căn, tìm x có √x, giá trị lớn nhất và nhỏ nhất */
const zQ=(n,d)=>{if(d<0){n=-n;d=-d;}const g=gcd(n,d)||1;return [n/g,d/g];};
const zA=(a,b)=>zQ(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),zS=(a,b)=>zA(a,[-b[0],b[1]]),zM=(a,b)=>zQ(a[0]*b[0],a[1]*b[1]),zD=(a,b)=>b[0]===0?null:zQ(a[0]*b[1],a[1]*b[0]);
const zEq=(a,b)=>a&&b&&a[0]*b[1]===b[0]*a[1];
const zF=q=>q[1]===1?N(q[0]):fr(q[0],q[1]);
const zP=q=>q[0]<0?`(${zF(q)})`:zF(q);
const zSq=q=>q[1]===1&&q[0]>=0?`${q[0]}²`:`(${zF(q)})²`;
const zK=(k,r)=>(k===1?'':k)+r;                                     // hệ số đứng trước căn
const zW=(good,v,err,pre)=>(!v||zEq(v,good))?null:C((pre||'')+zF(v),err);
const zR=()=>{for(;;){const b=ri(2,9),a=ri(1,2*b-1);if(gcd(a,b)===1)return [a,b];}};   // phân số tối giản dương, không nguyên
const ZT=' Nhập kết quả dạng phân số tối giản hoặc số nguyên.';
/* --- căn của một phân số --- */
function cbFrData(){
  for(;;){const [a,b]=zR(),g=[a,b];
    if(RNG()<.55){const neg=RNG()<.35,G=neg?[-a,b]:g,h=`${neg?'−':''}√${fr(a*a,b*b)}`;
      return {h,good:G,exp:`${fr(a*a,b*b)} = (${fr(a,b)})² và ${fr(a,b)} > 0 nên √${fr(a*a,b*b)} = ${fr(a,b)}${neg?`; do đó ${h} = ${zF(G)}`:''}.`,
        wr:[zW(G,zQ((neg?-1:1)*a*a,b),'Phải lấy căn cả tử và mẫu.'),zW(G,zQ((neg?-1:1)*a,b*b),'Phải lấy căn cả tử và mẫu.'),zW(G,[-G[0],G[1]],neg?'Dấu "−" đứng trước căn được giữ lại: kết quả là số âm.':'Căn bậc hai số học là số không âm.'),zW(G,zQ((neg?-1:1)*a*a,b*b),'Bạn quên lấy căn.'),zW(G,zQ((neg?-1:1)*b,a),'Bạn viết ngược tử và mẫu.')]};}
    const v=a*a,w=b*b,p=Math.floor(v/w),plus=p>=1&&RNG()<.6;let h,ex;
    if(plus){const r=v-p*w;if(r===0)continue;const q=zQ(r,w);if(q[1]!==w&&RNG()<.5)continue;h=`√(${p} + ${zF(q)})`;ex=`${p} + ${zF(q)}`;}
    else{const P=p+1,r=P*w-v,q=zQ(r,w);h=`√(${P} − ${zF(q)})`;ex=`${P} − ${zF(q)}`;}
    return {h,good:g,exp:`Tính trong căn trước: ${ex} = ${fr(v,w)} = (${fr(a,b)})². Vậy ${h} = ${fr(a,b)}.`,
      wr:[zW(g,zQ(v,w),'Bạn quên lấy căn sau khi tính trong căn.'),zW(g,zQ(a,w),'Phải lấy căn cả tử và mẫu.'),zW(g,zQ(v,b),'Phải lấy căn cả tử và mẫu.'),zW(g,[-a,b],'Căn bậc hai số học là số không âm.')]};}
}
const genCbFr=()=>tryGen(()=>{const d=cbFrData();return mk(`Giá trị của ${d.h} là:`,zF(d.good),d.wr,d.exp);});
/* --- căn của bình phương một số âm --- */
function genCbNeg(){return tryGen(()=>{
  const a=ri(2,60),t=ri(1,3),neg=t===2||t===3,inner=t===1||t===2?`(−${a})`:`${a}`,h=`${neg?'−':''}√(${inner}²)`,g=neg?-a:a;
  return mk(`Giá trị của ${h} là:`,N(g),[C(N(-g),neg?'Dấu "−" đứng trước căn được giữ lại nên kết quả là số âm.':`√((−${a})²) = √${grp(a*a)} = ${a}: căn bậc hai số học là số không âm.`),
    C(N(neg?-a*a:a*a).replace(/^(−?)(\d+)$/,(m,s,d)=>s+grp(d)),`Bạn quên lấy căn: ${inner}² = ${grp(a*a)} rồi √${grp(a*a)} = ${a}.`),C(N(neg?a*a:-a*a).replace(/^(−?)(\d+)$/,(m,s,d)=>s+grp(d)),'Bạn quên lấy căn và sai dấu.')],
    `${inner}² = ${grp(a*a)} nên √(${inner}²) = √${grp(a*a)} = ${a}${neg?`; do đó ${h} = −${a}`:''}.`);
});}
/* --- biểu thức có nhiều căn --- */
const TRIP=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[12,16,20]];
function cbExprData(){
  for(;;){const t=ri(1,4);let h,good,exp,wr=[];
    if(t===1){const x=ri(2,12),y=ri(2,9),k=ri(2,5),z=ri(2,9),m=ri(1,3),op=sel(['+','−']);
      good=[x*y+(op==='+'?1:-1)*k*z-m*m,1];h=`${SQ(x*x)} · ${SQ(y*y)} ${op} ${zK(k,SQ(z*z))} − ${SQ(m*m*m*m)}`;
      exp=`${SQ(x*x)} · ${SQ(y*y)} = ${x} · ${y} = ${x*y}; ${zK(k,SQ(z*z))} = ${k} · ${z} = ${k*z}; ${SQ(m**4)} = ${m*m}. Kết quả: ${x*y} ${op} ${k*z} − ${m*m} = ${N(good[0])}.`;
      wr=[zW(good,[x*y+(op==='+'?1:-1)*z-m*m,1],`${zK(k,SQ(z*z))} nghĩa là ${k} · ${SQ(z*z)} = ${k*z}, bạn quên nhân với ${k}.`),zW(good,[x*y+(op==='+'?1:-1)*k*z-m**4,1],`${SQ(m**4)} = ${m*m}, bạn quên lấy căn.`),zW(good,[x*y+(op==='+'?-1:1)*k*z-m*m,1],'Sai dấu ở một số hạng.'),zW(good,[-good[0],1],'Sai dấu của kết quả.')];}
    else if(t===2){const T=sel(TRIP),k=ri(2,4),z=ri(2,9),op=sel(['+','−']);good=[T[2]+(op==='+'?1:-1)*k*z,1];h=`√(${T[0]}² + ${T[1]}²) ${op} ${zK(k,SQ(z*z))}`;
      exp=`√(${T[0]}² + ${T[1]}²) = √(${T[0]*T[0]} + ${T[1]*T[1]}) = √${T[2]*T[2]} = ${T[2]}; ${zK(k,SQ(z*z))} = ${k*z}. Kết quả: ${T[2]} ${op} ${k*z} = ${N(good[0])}.`;
      wr=[zW(good,[T[0]+T[1]+(op==='+'?1:-1)*k*z,1],`√(${T[0]}² + ${T[1]}²) ≠ ${T[0]} + ${T[1]}: phải tính tổng trong căn trước.`),zW(good,[T[2]*T[2]+(op==='+'?1:-1)*k*z,1],`Bạn quên lấy căn của ${T[2]*T[2]}.`),zW(good,[T[2]+(op==='+'?1:-1)*z,1],`Bạn quên nhân với ${k}.`),zW(good,[-good[0],1],'Sai dấu của kết quả.')];}
    else if(t===3){const a=ri(1,9),b=ri(1,9),c=ri(4,15),k=ri(2,4);if(a===b)continue;const A=a*a/100,B=b*b/100,Cc=c*c/100;
      good=zQ(a-k*b+c,10);h=`${SQD(A)} − ${zK(k,SQD(B))} + ${SQD(Cc)}`;
      exp=`${SQD(A)} = ${dt(a/10)}; ${SQD(B)} = ${dt(b/10)}; ${SQD(Cc)} = ${dt(c/10)}. Kết quả: ${dt(a/10)} − ${k} · ${dt(b/10)} + ${dt(c/10)} = ${dt((a-k*b+c)/10)}.`;
      const D=q=>q?dt(q[0]/q[1]):'';const W=(v,e)=>zEq(v,good)?null:C(D(v),e);
      return {h,good,exp,G:D(good),wr:[W(zQ(a-k*b+c,100),`${SQD(A)} = ${dt(a/10)}, không phải ${dt(a/100)} (vì ${dt(a/10)}² = ${dt(A)}).`),W(zQ(a-b+c,10),`Bạn quên nhân với ${k}.`),W(zQ(a+k*b+c,10),'Sai dấu ở một số hạng.'),W(zQ(-(a-k*b+c),10),'Sai dấu của kết quả.'),W(zQ(a-k*b-c,10),'Sai dấu ở số hạng cuối.')]};}
    else{const [a,b]=zR(),c=ri(1,9),d=ri(2,9),op=sel(['+','−']),A=zQ(a,b),B=zQ(c,d);good=op==='+'?zA([-A[0],A[1]],B):zS([-A[0],A[1]],B);
      h=`−√${fr(a*a,b*b)} ${op} ${fr(c,`√${d*d}`)}`;
      exp=`√${fr(a*a,b*b)} = ${fr(a,b)}; ${fr(c,`√${d*d}`)} = ${fr(c,d)}. Kết quả: −${fr(a,b)} ${op} ${zF(B)} = ${zF(good)}.`;
      const F2=x=>op==='+'?zA(x,B):zS(x,B);
      wr=[zW(good,F2(zQ(-a*a,b*b)),`Bạn quên lấy căn của ${fr(a*a,b*b)}.`),zW(good,F2(zQ(-a*a,b)),'Phải lấy căn cả tử và mẫu.'),zW(good,(op==='+'?zA:zS)(A,B),'Dấu "−" đứng trước căn được giữ lại.'),zW(good,(op==='+'?zA:zS)([-A[0],A[1]],zQ(c,d*d)),`Mẫu là √${d*d} = ${d}, bạn quên lấy căn.`),zW(good,[-good[0],good[1]],'Sai dấu của kết quả.')];}
    if(Math.abs(good[0])>500||good[1]>200)continue;
    return {h,good,exp,G:zF(good),wr};}
}
const genCbExpr=()=>tryGen(()=>{const d=cbExprData();return mk(`Giá trị của biểu thức ${d.h} là:`,d.G,d.wr,d.exp);});
const saCbExpr=()=>{const d=cbExprData();return {stem:`Tính ${d.h}.`+(d.G.includes(',')?' Viết kết quả bằng số thập phân.':ZT),ans:[d.good[0]/d.good[1]],at:d.G,exp:d.exp};};
/* --- tìm x có √x --- */
const NOX='Không có giá trị nào của x';
function findData(){
  for(;;){const t=RNG()<.5?[ri(1,9),1]:zR(),k=ri(1,4),A=RNG()<.5?[ri(1,9)*sgn(),1]:zR(),minus=RNG()<.5,kt=zM([k,1],t),Cc=minus?zS(A,kt):zA(A,kt);
    if(Math.abs(Cc[0])>60||Cc[1]>40||Cc[0]===0)continue;
    const x=zM(t,t),h=`${zF(A)} ${minus?'−':'+'} ${zK(k,'√x')} = ${zF(Cc)}`;
    const kx=minus?zS(A,Cc):zS(Cc,A);
    return {h,good:x,exp:`${zK(k,'√x')} = ${minus?`${zF(A)} − ${zP(Cc)}`:`${zF(Cc)} − ${zP(A)}`} = ${zF(kx)}${k===1?'':`, nên √x = ${zF(kx)} : ${k} = ${zF(t)}`}. Vậy x = ${zSq(t)} = ${zF(x)}.`,
      wr:[zW(x,t,`Đây mới là giá trị của √x; x = (${zF(t)})² = ${zF(x)}.`,'x = '),zW(x,k===1?null:zM(kx,kx),`Bạn mới tìm được ${k}√x = ${zF(kx)}, còn phải chia cho ${k} trước khi bình phương.`,'x = '),
        zW(x,zM(zD(minus?zA(A,Cc):zA(Cc,A),[k,1]),zD(minus?zA(A,Cc):zA(Cc,A),[k,1])),'Khi chuyển vế phải đổi dấu số hạng.','x = '),zW(x,zM([2,1],t),`x = (${zF(t)})², không phải 2 · ${zP(t)}.`,'x = ')],nox:C(NOX,`√x = ${zF(t)} > 0 nên có x = ${zF(x)}.`)};}
}
const genCbFind=()=>tryGen(()=>{const d=findData();return mk(`Tìm x, biết: ${d.h}`,'x = '+zF(d.good),d.wr.concat([d.nox]),d.exp);});
const saCbFind=()=>{const d=findData();return {stem:`Tìm x, biết: ${d.h}.`+ZT,ans:[d.good[0]/d.good[1]],at:zF(d.good),exp:d.exp};};
function innerData(){
  for(;;){const a=sel([1,2,3,4,5,-1,-2]),c=RNG()<.6?[ri(1,9),1]:zR(),c2=zM(c,c),x=RNG()<.6?[ri(-9,15),1]:zR(),b=zS(c2,zM([a,1],x));
    if(b[0]===0||Math.abs(b[0])>99||b[1]>81)continue;
    const ax=a===1?'x':a===-1?'−x':`${N(a)}x`,h=`√(${ax} ${b[0]<0?'−':'+'} ${zF([Math.abs(b[0]),b[1]])}) = ${zF(c)}`;
    return {h,good:x,exp:`Vì √(${ax} ${b[0]<0?'−':'+'} ${zF([Math.abs(b[0]),b[1]])}) = ${zF(c)} nên ${ax} ${b[0]<0?'−':'+'} ${zF([Math.abs(b[0]),b[1]])} = ${zSq(c)} = ${zF(c2)}. Suy ra ${ax} = ${zF(c2)} ${b[0]<0?'+':'−'} ${zF([Math.abs(b[0]),b[1]])} = ${zF(zS(c2,b))}${a===1?'':`, x = ${zF(x)}`}.`,
      wr:[zW(x,zD(zS(c,b),[a,1]),`Từ √(...) = ${zF(c)} phải bình phương: biểu thức trong căn bằng ${zF(c2)}.`,'x = '),zW(x,zD(zA(c2,b),[a,1]),'Khi chuyển vế phải đổi dấu số hạng.','x = '),
        zW(x,zM(zS(c2,b),[a,1]),`Từ ${ax} = ${zF(zS(c2,b))} phải chia cho ${a}, không nhân.`,'x = '),zW(x,[-x[0],x[1]],'Sai dấu của kết quả.','x = ')]};}
}
const genCbInner=()=>tryGen(()=>{const d=innerData();return mk(`Tìm x, biết: ${d.h}`,'x = '+zF(d.good),d.wr,d.exp);});
const saCbInner=()=>{const d=innerData();return {stem:`Tìm x, biết: ${d.h}.`+ZT,ans:[d.good[0]/d.good[1]],at:zF(d.good),exp:d.exp};};
/* --- giá trị nhỏ nhất, lớn nhất --- */
function extData(){
  const max=RNG()<.5,a=ri(1,15)*sgn(),b=RNG()<.7?[ri(1,20)*sgn(),1]:zR(),k=sel([1,1,2,3,5]),xin=`x ${a<0?'+':'−'} ${Math.abs(a)}`;
  const h=max?`B = ${zF(b)} − ${zK(k,`√(${xin})`)}`:`A = ${zK(k,`√(${xin})`)} ${b[0]<0?'−':'+'} ${zF([Math.abs(b[0]),b[1]])}`;
  return {max,a,b,k,h,exp:`Vì √(${xin}) ≥ 0 với mọi x ≥ ${N(a)} nên ${max?`B ≤ ${zF(b)}`:`A ≥ ${zF(b)}`}. Dấu "=" xảy ra khi ${xin} = 0, tức x = ${N(a)}. Vậy giá trị ${max?'lớn':'nhỏ'} nhất của ${max?'B':'A'} là ${zF(b)}, đạt được khi x = ${N(a)}.`};
}
function genCbExt(){return tryGen(()=>{
  const d=extData(),g=d.b,nm=d.max?'lớn':'nhỏ';
  return mk(`Giá trị ${nm} nhất của biểu thức ${d.h} là:`,zF(g),[zW(g,[d.a,1],`${d.a} là giá trị của x để biểu thức đạt giá trị ${nm} nhất, không phải giá trị ${nm} nhất.`),zW(g,d.max?zS(g,[d.k,1]):zA(g,[d.k,1]),`Giá trị ${nm} nhất đạt được khi √(...) = 0, không phải bằng 1.`),
    zW(g,[-g[0],g[1]],'Sai dấu.'),C(`Không có giá trị ${nm} nhất`,`√(...) ≥ 0 nên ${d.max?'B':'A'} ${d.max?'≤':'≥'} ${zF(g)}, dấu "=" xảy ra khi x = ${d.a}.`)],d.exp);
});}
const saCbExt=()=>{const d=extData(),ask=RNG()<.5;return ask?{stem:`Tìm giá trị ${d.max?'lớn':'nhỏ'} nhất của biểu thức ${d.h}.`+ZT,ans:[d.b[0]/d.b[1]],at:zF(d.b),exp:d.exp}:{stem:`Biểu thức ${d.h} đạt giá trị ${d.max?'lớn':'nhỏ'} nhất khi x bằng bao nhiêu?`,ans:[d.a],exp:d.exp};};
/* --- đúng sai --- */
function cbItem2(){
  const t=ri(1,4);
  if(t===1){const [a,b]=zR(),ok=RNG()<.5,alt=[[a*a,b],[a,b*b],[-a,b]].filter(q=>!zEq(zQ(q[0],q[1]),[a,b])),sh=ok?fr(a,b):(w=>zF(zQ(w[0],w[1])))(sel(alt));return IT(`√${fr(a*a,b*b)} = ${sh}`,ok,'cb','VD',`√${fr(a*a,b*b)} = ${fr(a,b)}.`);}
  if(t===2){const a=ri(2,30),ok=RNG()<.5;return IT(`√((−${a})²) = ${ok?a:'−'+a}`,ok,'cb','VD',`√((−${a})²) = √${grp(a*a)} = ${a}.`);}
  if(t===3){const k=ri(2,5),m=k*ri(2,6),ok=RNG()<.5,v=m/k;return IT(`Từ ${k}√x = ${m} suy ra x = ${ok?v*v:v}`,ok,'cb','VD',`√x = ${m} : ${k} = ${v} nên x = ${v}² = ${v*v}.`);}
  const a=ri(1,9),b=ri(1,20),ok=RNG()<.5;return IT(`Giá trị nhỏ nhất của A = √(x − ${a}) + ${b} là ${ok?b:sel([a===b?b+2:a,b+1])}`,ok,'cb','VD',`√(x − ${a}) ≥ 0 nên A ≥ ${b}, dấu "=" khi x = ${a}. Giá trị nhỏ nhất là ${b}.`);
}
const tfCb2=()=>{const items=mixed(()=>[cbItem2(),cbItem2(),cbItem2(),cbItem2()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};
addMC('g_cbfr','cb','TH',genCbFr);addMC('g_cbneg','cb','TH',genCbNeg);addMC('g_cbexpr','cb','VD',genCbExpr);
addMC('g_cbfind','cb','VD',genCbFind);addMC('g_cbinner','cb','VD',genCbInner);addMC('g_cbext','cb','VD',genCbExt);
addTF('tf_cb_vd2','cb','VD',tfCb2);

function SA_BUILD(){
  const S=[];const add=(id,topic,level,gen)=>['a','b'].forEach(x=>S.push({id:id+x,type:'sa',topic,level,unit:'',gen}));
  add('s_vtcnt','vt','TH',saVtCnt);
  add('s_cbval','cb','NB',saCbVal);add('s_cbsum','cb','TH',saCbSum);add('s_cbcnt','cb','VD',saCbCnt);add('s_cbmin','cb','TH',saCbMin);
  add('s_cbexpr','cb','VD',saCbExpr);add('s_cbfind','cb','VD',saCbFind);add('s_cbinner','cb','VD',saCbInner);add('s_cbext','cb','VD',saCbExt);
  add('s_mtround','mt','TH',saMtRound);add('s_mtacc','mt','TH',saMtAcc);add('s_mtbetw','mt','TH',saMtBetw);add('s_mtest','mt','VD',saMtEst);
  add('s_ttperim','tt','TH',saTtPerim);add('s_ttha','tt','TH',saTtHa);add('s_ttdiag','tt','VD',saTtDiag);add('s_tttiles','tt','VD',saTtTiles);
  return S;
}
const BANK={mc:MC,tf:TF,sa:SA_BUILD()};
const SA=BANK.sa;
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level,at)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp,at});
function tfHard(){
  const fs=[vtItem,cbItem,mtItem,ttItem];
  const items=mixed(()=>shuffle(fs).map(f=>f('VD')));
  return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();
}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'cb',level:'VD',gen:tfHard}],sa:[
 {id:'h_cnt',topic:'cb',level:'VD',unit:'',gen:()=>{const a=ri(5,20),b=a+ri(5,25);return {stem:`Có bao nhiêu số tự nhiên n thỏa mãn ${a} < √n < ${b}?`,ans:[b*b-a*a-1],exp:`${a} < √n < ${b} tương đương ${grp(a*a)} < n < ${grp(b*b)}. Số các số tự nhiên n là ${grp(b*b-1)} − ${grp(a*a+1)} + 1 = ${grp(b*b-a*a-1)}.`,meta:{a,b}};}},
 {id:'h_sum',topic:'cb',level:'VD',unit:'',gen:()=>{const k=ri(8,30);const terms=[1,4,9].map(SQ).join(' + ');return {stem:`Tính tổng ${terms} + ... + ${SQ(k*k)} (các số dưới dấu căn là bình phương của các số tự nhiên liên tiếp từ 1 đến ${k}).`,ans:[k*(k+1)/2],exp:`Mỗi số hạng là một số tự nhiên: 1 + 2 + 3 + ... + ${k} = ${k} · ${k+1} : 2 = ${k*(k+1)/2}.`,meta:{k}};}},
 {id:'h_irr',topic:'vt',level:'VD',unit:'',gen:()=>{const N0=ri(30,200);return {stem:`Có bao nhiêu số tự nhiên n thỏa mãn 1 ≤ n ≤ ${N0} để ${SQ('n').replace('√n','√n')} là số vô tỉ?`.replace('√n','√n'),ans:[N0-isq(N0)],exp:`√n là số hữu tỉ khi n là số chính phương. Từ 1 đến ${N0} có ${isq(N0)} số chính phương (1², 2², ..., ${isq(N0)}²), nên có ${N0} − ${isq(N0)} = ${N0-isq(N0)} số n để √n là số vô tỉ.`,meta:{N:N0}};}},
 {id:'h_big',topic:'mt',level:'VD',unit:'',gen:()=>{for(;;){const n=nonsq(10000,900000),p=sel([2,3]),R=rdSqrt(n,p);if(R%10===0)continue;return {stem:`Tính ${SQ(n)} rồi làm tròn kết quả với độ chính xác ${ACCP[p]}. Viết kết quả bằng số thập phân.`,ans:[R/Math.pow(10,p)],at:scStr(R,p),exp:`Độ chính xác ${ACCP[p]} ứng với làm tròn đến ${HANGP[p]}. ${SQ(n)} = ${scStr(rdSqrt(n,p+3),p+3)}... ≈ ${scStr(R,p)}.`,meta:{n,p,acc:1}};}}}
].map(q=>Object.assign({type:'sa'},q))};
HARD.sa.push(...[{id:'h_find',topic:'cb',gen:saCbFind},{id:'h_inner',topic:'cb',gen:saCbInner},
 {id:'h_abs',topic:'cb',gen:()=>{const a=ri(1,12)*sgn(),c=ri(2,12),big=a+c,sm=a-c,xa=`x ${a<0?'+':'−'} ${Math.abs(a)}`;return {stem:`Tìm giá trị lớn hơn của x thỏa mãn √((${xa})²) = ${c}.`,ans:[big],exp:`√((${xa})²) = ${c} nên (${xa})² = ${c}², suy ra ${xa} = ${c} hoặc ${xa} = −${c}. Do đó x = ${N(big)} hoặc x = ${N(sm)}. Giá trị lớn hơn là ${N(big)}.`};}},
 {id:'h_prod0',topic:'cb',gen:()=>{const p=ri(1,9),q=p+ri(1,7);return {stem:`Tìm tổng các giá trị của x thỏa mãn (√x − ${p}) · (${q} − √x) = 0.`,ans:[p*p+q*q],exp:`Tích bằng 0 khi √x − ${p} = 0 hoặc ${q} − √x = 0, tức √x = ${p} hoặc √x = ${q}. Do đó x = ${p*p} hoặc x = ${q*q}. Tổng là ${p*p} + ${q*q} = ${p*p+q*q}.`};}},
 {id:'h_ext',topic:'cb',gen:saCbExt}].map(q=>Object.assign({type:'sa',level:'VD',unit:''},q)));
const money=x=>grp(x);
const PISA=[
 ()=>{for(;;){
  const A=nonsq(50,400),R=rdSqrt(A,1);if(R%10===0)continue;
  const pr=sel([20000,25000,30000,35000,40000]),per4=4*R,total=per4*pr/10;   // per4: chu vi theo đơn vị 0,1 m
  const ws=[['số thập phân hữu hạn',`${SQ(A)} là số vô tỉ, không phải số thập phân hữu hạn.`],['số thập phân vô hạn tuần hoàn',`${SQ(A)} là số vô tỉ, các chữ số thập phân không lặp lại theo nhóm cố định.`],['số tự nhiên',`${A} không là số chính phương nên ${SQ(A)} không là số tự nhiên.`]];
  return {title:'Hàng rào quanh vườn',ctx:`<p class="stem">Một mảnh vườn hình vuông có diện tích ${grp(A)} m². Người ta muốn làm hàng rào quanh vườn, giá ${money(pr)} đồng một mét hàng rào.</p>`,qs:[
   mcq(`Độ dài cạnh mảnh vườn là ${SQ(A)} mét. Số ${SQ(A)} là:`,'số vô tỉ',ws,`${A} không là bình phương của số tự nhiên nào nên ${SQ(A)} là số vô tỉ.`,'vt','TH'),
   saq('Dùng máy tính cầm tay, tính độ dài cạnh mảnh vườn rồi làm tròn đến hàng phần mười (đơn vị mét).',R/10,'m',`${SQ(A)} = ${scStr(rdSqrt(A,4),4)}... ≈ ${scStr(R,1)} m.`,'mt','TH',scStr(R,1)),
   saq(`Lấy cạnh vườn bằng ${scStr(R,1)} m. Chu vi mảnh vườn là bao nhiêu mét?`,per4/10,'m',`4 · ${scStr(R,1)} = ${scStr(per4,1)} m.`,'tt','TH',scStr(per4,1)),
   saq(`Với chu vi ${scStr(per4,1)} m, tổng tiền làm hàng rào là bao nhiêu đồng?`,total,'đồng',`${scStr(per4,1)} · ${money(pr)} = ${money(total)} đồng.`,'tt','VD',money(total))]};}},
 ()=>{const {a,b,d,R}=diagData();
  const g=scStr(R,1),cs=[[String(a+b),'Đường chéo ngắn hơn tổng hai cạnh; phải dùng d² = a² + b².'],[grp(d),'Đây là d², chưa lấy căn bậc hai.'],[scStr(R+1,1),'Sai chữ số ở hàng phần mười.']].filter(c=>c[0]!==g);
  const km=Math.round((a+b)*10-R);
  return {title:'Sân hình chữ nhật',ctx:`<p class="stem">Một sân tập hình chữ nhật có chiều dài ${a} m và chiều rộng ${b} m. Bình phương độ dài đường chéo bằng tổng các bình phương độ dài hai cạnh. Bạn An chạy từ một đỉnh đến đỉnh đối diện.</p>`,qs:[
   saq('Bình phương độ dài đường chéo sân là bao nhiêu mét vuông?',d,'m²',`d² = ${a}² + ${b}² = ${grp(d)}.`,'tt','TH',grp(d)),
   mcq('Độ dài đường chéo sân, làm tròn đến hàng phần mười (mét), là:',g,cs,`d = ${SQ(d)} ≈ ${g} m.`,'mt','TH'),
   saq(`Nếu An chạy dọc hai cạnh thay vì chạy theo đường chéo (lấy đường chéo bằng ${g} m) thì quãng đường dài hơn bao nhiêu mét?`,km/10,'m',`${a} + ${b} − ${g} = ${scStr(km,1)} m.`,'tt','VD',scStr(km,1)),
   saq(`An chạy theo đường chéo 5 lượt (lấy đường chéo bằng ${g} m). Tổng quãng đường An chạy là bao nhiêu mét?`,R*5/10,'m',`5 · ${g} = ${scStr(R*5,1)} m.`,'tt','VD',scStr(R*5,1))]};}
];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'vt',fig:`<div class="figbox"><p>Số vô tỉ: số thập phân vô hạn không tuần hoàn</p><p>π = 3,14159265358...; √2 = 1,41421356237...</p><p>0,1010010001... (số chữ số 0 tăng dần)</p></div>`,extra:'Số hữu tỉ viết được dưới dạng số thập phân hữu hạn hoặc vô hạn tuần hoàn; số vô tỉ thì không. √49 = 7 là số hữu tỉ, còn √50 là số vô tỉ.'},
  {k:'cb',fig:`<div class="figbox"><p>√a = x ⇔ x ≥ 0 và x² = a (a ≥ 0)</p><p>√100 = 10; √(191²) = 191; √(21,5²) = 21,5</p><p>√9 + √16 = 7, nhưng √(9 + 16) = 5</p></div>`,extra:'Căn bậc hai số học luôn không âm. Không được cộng, trừ các số dưới dấu căn như cộng các căn.'},
  {k:'mt',fig:`<div class="figbox"><p>√91 = 9,539392014... ≈ 9,5394 (4 chữ số thập phân)</p><p>√91 ≈ 9,5 (độ chính xác 0,05)</p><p>9² = 81 < 91 < 100 = 10² nên 9 < √91 < 10</p></div>`,extra:'Độ chính xác 0,05 ứng với làm tròn đến hàng phần mười; 0,005 ứng với hàng phần trăm. Chữ số kề sau từ 5 trở lên thì tăng chữ số hàng làm tròn thêm 1.'},
  {k:'tt',fig:`<div class="figbox"><p>Hình vuông diện tích a: cạnh √a, chu vi 4√a</p><p>Hình chữ nhật 8 dm × 5 dm: d² = 8² + 5² = 89, d ≈ 9,4 dm</p><p>1 ha = 10 000 m²; 1 m = 100 cm</p></div>`,extra:'Đổi về cùng đơn vị trước khi tính. Số viên gạch = diện tích sân : diện tích một viên gạch.'}
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
 G(()=>{const k=ri(6,20),S=k*k,g=sel(k%2?[0.5]:[0.5,0.4]),tiles=Math.round((k/g)*(k/g));
  const Tq=ri(20,150);if(Number.isInteger(Math.sqrt(Tq)))throw 0;const r=rd(Math.sqrt(Tq),1);if(near5(Math.sqrt(Tq),1)||Number.isInteger(r))throw 0;
  const w=[[nm(rd(Tq/4,2)),`Lấy diện tích chia 4 là sai; cạnh hình vuông là căn bậc hai số học của diện tích.`],[nm(rd(Tq/2,2)),'Cạnh hình vuông không phải là một nửa diện tích.'],[nm(Math.round(Math.sqrt(Tq))),'Đề yêu cầu làm tròn đến hàng phần mười, không phải hàng đơn vị.']];
  return {title:'Lát gạch sân trường',ctx:P(`Sân chơi của một trường có dạng hình vuông với diện tích ${S} m². Nhà trường lát kín sân bằng gạch hình vuông cạnh ${nm(g)} m.`),qs:[
   A('Cạnh của sân chơi dài bao nhiêu mét?',k,'m',`Cạnh sân là √${S} = ${k} (m) vì ${k}² = ${S} và ${k} > 0.`,'cb','TH'),
   A('Chu vi của sân chơi là bao nhiêu mét?',4*k,'m',`Chu vi = 4 · ${k} = ${4*k} (m).`,'tt','TH'),
   A('Cần bao nhiêu viên gạch để lát kín sân?',tiles,'viên',`Mỗi cạnh sân xếp được ${k} : ${nm(g)} = ${nm(k/g)} viên. Số viên gạch: ${nm(k/g)} · ${nm(k/g)} = ${tiles} viên.`,'tt','VD'),
   M(`Bên cạnh sân, nhà trường làm một vườn hoa hình vuông có diện tích ${Tq} m². Dùng máy tính cầm tay, độ dài cạnh vườn hoa làm tròn đến hàng phần mười là bao nhiêu mét?`,nm(r),w,`Cạnh vườn hoa là √${Tq} ≈ ${nm(rd(Math.sqrt(Tq),4))}... ≈ ${nm(r)} (m).`,'mt','VD')]};}),
 G(()=>{const S=ri(10,90);if(Number.isInteger(Math.sqrt(S)))throw 0;const s=Math.sqrt(S),r1=rd(s,1),per=4*s,rp=Math.round(per);
  if(near5(s,1)||Math.abs(per-Math.floor(per)-0.5)<0.03)throw 0;
  return {title:'Tấm kính hình vuông',ctx:P(`Một tấm kính hình vuông có diện tích ${S} dm².`),qs:[
   M('Độ dài cạnh của tấm kính (đơn vị: dm) là',`√${S}, là một số vô tỉ`,[[`√${S}, là một số hữu tỉ`,`${S} không phải là bình phương của một số tự nhiên nào nên √${S} là số vô tỉ.`],[`${nm(rd(S/2,1))}, là một số hữu tỉ`,'Cạnh hình vuông không bằng một nửa diện tích.'],[`${nm(rd(S/4,2))}, là một số hữu tỉ`,'Lấy diện tích chia 4 là cách tính cạnh từ chu vi, không phải từ diện tích.']],`Cạnh tấm kính là √${S} dm. Vì ${S} không phải là số chính phương nên √${S} là số vô tỉ.`,'vt','TH'),
   A('Dùng máy tính cầm tay, làm tròn độ dài cạnh tấm kính đến hàng phần mười (đơn vị: dm).',r1,'dm',`√${S} ≈ ${nm(rd(s,4))}... ≈ ${nm(r1)} (dm).`,'mt','TH'),
   A('Người ta làm một khung nhôm bao quanh tấm kính. Chiều dài khung bằng chu vi tấm kính. Dùng máy tính cầm tay, làm tròn chiều dài khung đến hàng đơn vị (đơn vị: dm).',rp,'dm',`Chu vi = 4 · √${S} ≈ ${nm(rd(per,3))}... ≈ ${rp} (dm). Nên tính 4 · √${S} rồi mới làm tròn.`,'tt','VD'),
   A(`Ghép bốn tấm kính như vậy thành một tấm kính hình vuông lớn. Cạnh của tấm kính lớn bằng √m dm. Tìm m.`,4*S,'',`Diện tích tấm lớn là 4 · ${S} = ${4*S} (dm²), nên cạnh của nó là √${4*S} dm. Vậy m = ${4*S}.`,'cb','VD')]};})
);
}
/* ==== Toán thực tế bổ sung: kết thúc ==== */
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='vt7_seen';
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
  const mcSlots=[['vt',['NB','TH']],['vt',['TH']],['cb',['NB','TH']],['cb',['TH','VD']],['mt',['NB','TH']],['tt',['TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>q.topic===t&&l.includes(q.level)),used));
  const tf=[sel(['vt','cb']),'mt','tt'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set(),t1=sel(['vt','cb']),t2=sel(['mt','tt']);
  const mc=['vt','cb','mt','tt'].map(t=>pick(MC.filter(q=>q.topic===t&&q.level!=='VD'),used));
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
