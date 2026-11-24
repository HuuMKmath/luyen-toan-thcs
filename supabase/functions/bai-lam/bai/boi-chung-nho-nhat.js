// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ boi-chung-nho-nhat/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "boi-chung-nho-nhat";
export const TIEN_TO = "BC6-";

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
/* ============ Toán số học ============ */
const gcd=(a,b)=>b?gcd(b,a%b):a;
const lcm=(a,b)=>a/gcd(a,b)*b;
const lcmN=(...v)=>v.reduce(lcm);
function fac(n){const m={};for(let p=2;n>1;p++)while(n%p===0){m[p]=(m[p]||0)+1;n/=p;}return m;}
function facStr(m){return Object.keys(m).map(Number).sort((x,y)=>x-y).map(p=>m[p]>1?`${p}<sup>${m[p]}</sup>`:`${p}`).join(' · ');}
function facVal(m){return Object.keys(m).reduce((s,p)=>s*Math.pow(+p,m[p]),1);}
function why(x,a,b){
  const da=x%a===0,db=x%b===0;
  if(da&&db)return `${x} chia hết cho cả ${a} và ${b}`;
  if(da)return `${x} chia hết cho ${a} nhưng không chia hết cho ${b}`;
  if(db)return `${x} chia hết cho ${b} nhưng không chia hết cho ${a}`;
  return `${x} không chia hết cho ${a} và cũng không chia hết cho ${b}`;
}
function lcmWhy(a,b){
  const l=lcm(a,b),g=gcd(a,b),m=Math.max(a,b),s=Math.min(a,b);
  if(g===1)return `${a} và ${b} nguyên tố cùng nhau nên BCNN(${a}, ${b}) = ${a} · ${b} = ${l}`;
  if(m%s===0)return `${m} chia hết cho ${s} nên BCNN(${a}, ${b}) = ${m}`;
  return `${a} = ${facStr(fac(a))}; ${b} = ${facStr(fac(b))}; BCNN(${a}, ${b}) = ${facStr(fac(l))} = ${l}`;
}
function timeStr(mins){const h=6+Math.floor(mins/60),mm=mins%60;return mm?`${h} giờ ${mm} phút`:`${h} giờ`;}

/* ============ Ngẫu nhiên có hạt giống ============ */
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* Cặp số: 'gen' (ƯCLN > 1, không chia hết nhau), 'cop' (nguyên tố cùng nhau), 'mul' (số này là bội của số kia) */
function pairKind(kind,mx,maxL){
  mx=mx||36;maxL=maxL||300;
  for(let n=0;n<400;n++){
    let a,b;
    if(kind==='cop'){a=ri(3,Math.min(mx,20));b=ri(3,Math.min(mx,20));if(a===b||gcd(a,b)!==1)continue;}
    else if(kind==='mul'){a=ri(2,Math.min(12,mx));b=a*ri(2,6);if(b>mx*2)continue;}
    else{a=ri(4,mx);b=ri(4,mx);if(a===b||gcd(a,b)===1||a%b===0||b%a===0)continue;}
    if(lcm(a,b)>maxL)continue;
    return RNG()<.5?[a,b]:[b,a];
  }
  return kind==='cop'?[8,9]:kind==='mul'?[6,18]:[12,18];
}
function pickOpts(goodT,cands){
  const seen=new Set([goodT]),out=[];
  for(const c of cands){if(!seen.has(c.t)){seen.add(c.t);out.push({t:c.t,err:c.err});}if(out.length===3)break;}
  return out;
}
const FB_MC=()=>({stem:'Số nào sau đây là bội chung của 4 và 6?',opts:[{t:'12'},{t:'8',err:'8 chia hết cho 4 nhưng không chia hết cho 6, nên chưa phải bội chung.'},{t:'18',err:'18 chia hết cho 6 nhưng không chia hết cho 4, nên chưa phải bội chung.'},{t:'10',err:'10 không chia hết cho 4 và cũng không chia hết cho 6, nên chưa phải bội chung.'}],ans:0,exp:'12 chia hết cho cả 4 và 6, nên 12 là bội chung của 4 và 6.'});
const FB_TF=()=>({stem:'Cho hai số a = 4 và b = 6. Xét các phát biểu sau:',items:[
  {t:'12 là bội chung của 4 và 6.',v:true,topic:'bc',level:'NB',exp:'12 chia hết cho cả 4 và 6.'},
  {t:'8 là bội chung của 4 và 6.',v:false,topic:'bc',level:'NB',exp:'8 chia hết cho 4 nhưng không chia hết cho 6.'},
  {t:'BCNN(4, 6) = 12.',v:true,topic:'ts',level:'TH',exp:'4 = 2<sup>2</sup>; 6 = 2 · 3; BCNN(4, 6) = 2<sup>2</sup> · 3 = 12.'},
  {t:'BCNN(4, 6) = 24.',v:false,topic:'ts',level:'TH',exp:'24 là bội chung nhưng không nhỏ nhất, vì 12 nhỏ hơn.'}]});

/* ============ Bộ sinh câu nhiều lựa chọn ============ */
function genDef(){
  for(let n=0;n<300;n++){
    const [a,b]=pairKind('gen',24,120),l=lcm(a,b),good=l*ri(1,3);
    const ca=[],cb=[];for(let t=2;t<=8;t++){if((a*t)%b)ca.push(a*t);if((b*t)%a)cb.push(b*t);}
    if(!ca.length||!cb.length)continue;
    const dA=sel(ca),dB=sel(cb);
    let dC=a+b;if(dC%a===0||dC%b===0)dC=l+1;
    if(new Set([good,dA,dB,dC]).size<4)continue;
    const E=x=>({t:''+x,err:why(x,a,b)+', nên chưa phải bội chung.'});
    return {stem:`Số nào sau đây là bội chung của ${a} và ${b}?`,opts:[{t:''+good},E(dA),E(dB),E(dC)],ans:0,exp:`${why(good,a,b)}, nên ${good} là bội chung của ${a} và ${b}.`};
  }
  return FB_MC();
}
function genSet(){
  for(let n=0;n<300;n++){
    const [a,b]=pairKind('gen',20,120),l=lcm(a,b),m=Math.max(a,b),s=Math.min(a,b);
    const trip=x=>[x,2*x,3*x].join(', '),good=trip(l);
    const cands=[
      {t:trip(m),err:`Đây chỉ là các bội của ${m}; ${m} không chia hết cho ${s}.`},
      {t:trip(a*b),err:`${a*b} là một bội chung nhưng chưa nhỏ nhất, vì còn ${l} nhỏ hơn.`},
      {t:[l,2*l,4*l].join(', '),err:`Bỏ sót ${3*l}: các bội chung liên tiếp là ${trip(l)}.`},
      {t:[0,l,2*l].join(', '),err:'Đề yêu cầu bội chung khác 0, nên không kể số 0.'}];
    const opts=[{t:good}].concat(pickOpts(good,cands));
    if(opts.length<4)continue;
    return {stem:`Ba bội chung nhỏ nhất khác 0 của ${a} và ${b} là:`,opts,ans:0,exp:`BCNN(${a}, ${b}) = ${l}. Các bội chung khác 0 là các bội của ${l}: ${trip(l)}, ...`};
  }
  return FB_MC();
}
function genFind(kind){return ()=>{
  for(let n=0;n<300;n++){
    const [a,b]=pairKind(kind,36,300),l=lcm(a,b),g=gcd(a,b),m=Math.max(a,b),s=Math.min(a,b),p=a*b;
    const cands=[
      {t:''+p,err:kind==='gen'?`Đây là tích ${a} · ${b}: chỉ là một bội chung, chưa nhỏ nhất vì ${a} và ${b} có ước chung ${g}.`:`Tích ${a} · ${b} là một bội chung nhưng chưa nhỏ nhất, vì ${m} đã chia hết cho ${s}.`},
      {t:''+g,err:`Nhầm với ƯCLN(${a}, ${b}) = ${g}.`},
      {t:''+m,err:`Chỉ lấy số lớn hơn; ${m} không chia hết cho ${s}.`},
      {t:''+(a+b),err:'Cộng hai số không cho bội chung nhỏ nhất.'},
      {t:''+(2*l),err:`${2*l} là một bội chung nhưng không phải nhỏ nhất, vì ${l} nhỏ hơn.`}];
    const opts=[{t:''+l}].concat(pickOpts(''+l,cands));
    if(opts.length<4)continue;
    return {stem:`BCNN(${a}, ${b}) bằng:`,opts,ans:0,exp:lcmWhy(a,b)+'.'};
  }
  return FB_MC();
};}
const FAC_FB={A:{2:2,3:1},B:{2:1,5:1}};
function facPack(A,B){
  const M={},Mn={},Co={},S={};
  new Set(Object.keys(A).concat(Object.keys(B))).forEach(p=>{
    const x=A[p]||0,y=B[p]||0;
    M[p]=Math.max(x,y);S[p]=x+y;if(x&&y){Mn[p]=Math.min(x,y);Co[p]=Math.max(x,y);}
  });
  return {A,B,M,Mn,Co,S,a:facVal(A),b:facVal(B),l:facVal(M),sM:facStr(M),sMn:facStr(Mn),sCo:facStr(Co),sS:facStr(S)};
}
function genFacData(){
  for(let n=0;n<500;n++){
    const ps=shuffle([2,3,5,7]).slice(0,3);
    const A={},B={};
    ps.forEach(p=>{const x=ri(0,2),y=ri(0,2);if(x)A[p]=x;if(y)B[p]=y;});
    if(!Object.keys(A).length||!Object.keys(B).length)continue;
    const d=facPack(A,B);
    if(!Object.keys(d.Mn).length)continue;
    if(!ps.some(p=>!!A[p]!==!!B[p]))continue;
    if(new Set([d.sM,d.sMn,d.sCo,d.sS]).size<4)continue;
    if(d.a===d.b||d.a>250||d.b>250||d.l>700||d.a<2||d.b<2)continue;
    return d;
  }
  return facPack(FAC_FB.A,FAC_FB.B);
}
function genFac(){
  const d=genFacData();
  return {stem:`Cho a = ${facStr(d.A)} và b = ${facStr(d.B)}. BCNN(a, b) bằng:`,
    opts:[{t:d.sM},
      {t:d.sMn,err:'Đây là ƯCLN: lấy thừa số chung với số mũ nhỏ nhất. BCNN lấy cả thừa số chung và riêng, với số mũ lớn nhất.'},
      {t:d.sCo,err:'Thiếu các thừa số nguyên tố riêng; BCNN phải có cả thừa số chung và thừa số riêng.'},
      {t:d.sS,err:'Đã cộng các số mũ (như khi nhân a với b); BCNN lấy số mũ lớn nhất của mỗi thừa số.'}],ans:0,
    exp:`Lấy tất cả các thừa số nguyên tố chung và riêng, mỗi thừa số với số mũ lớn nhất: BCNN(a, b) = ${d.sM} = ${d.l}.`};
}
function threeData(maxL){
  for(let n=0;n<500;n++){
    const a=ri(2,24),b=ri(2,24),c=ri(2,24);
    if(new Set([a,b,c]).size<3)continue;
    const L=lcmN(a,b,c),ab=lcm(a,b),bc=lcm(b,c),ac=lcm(a,c);
    if(L>maxL||ab>=L||bc>=L||ac>=L||a*b*c===L||new Set([ab,bc,ac]).size<3)continue;
    return {a,b,c,L,ab,bc,ac};
  }
  return {a:4,b:6,c:10,L:60,ab:12,bc:30,ac:20};
}
function genThree(){
  const d=threeData(600),{a,b,c,L}=d;
  const cands=[
    {t:''+d.ab,err:`Mới tìm BCNN(${a}, ${b}); chưa tính đến ${c}.`},
    {t:''+d.bc,err:`Mới tìm BCNN(${b}, ${c}); chưa tính đến ${a}.`},
    {t:''+d.ac,err:`Mới tìm BCNN(${a}, ${c}); chưa tính đến ${b}.`},
    {t:''+(a*b*c),err:'Tích ba số là một bội chung nhưng chưa nhỏ nhất.'}];
  return {stem:`BCNN(${a}, ${b}, ${c}) bằng:`,opts:[{t:''+L}].concat(pickOpts(''+L,cands)),ans:0,
    exp:`${a} = ${facStr(fac(a))}; ${b} = ${facStr(fac(b))}; ${c} = ${facStr(fac(c))}. Lấy mỗi thừa số nguyên tố với số mũ lớn nhất: BCNN(${a}, ${b}, ${c}) = ${facStr(fac(L))} = ${L}.`};
}
function genVia(){
  for(let n=0;n<300;n++){
    const [a,b]=pairKind('gen',24,120),l=lcm(a,b),m=Math.max(a,b),s=Math.min(a,b),k=ri(2,4),good=l*k;
    const cands=[l+m,l+s,l-m,l-s,l+1].map(x=>({t:''+x,err:why(x,a,b)+', nên không phải bội chung.'}));
    const opts=[{t:''+good}].concat(pickOpts(''+good,shuffle(cands)));
    if(opts.length<4)continue;
    return {stem:`Biết BCNN(${a}, ${b}) = ${l}. Số nào sau đây là bội chung của ${a} và ${b}?`,opts,ans:0,
      exp:`Mọi bội chung của ${a} và ${b} đều là bội của BCNN = ${l}. Vì ${good} = ${l} · ${k} nên ${good} là bội chung.`};
  }
  return FB_MC();
}
function genNotBc(){
  for(let n=0;n<300;n++){
    const [a,b]=pairKind('gen',24,120),l=lcm(a,b),m=Math.max(a,b),x=l+m;
    const E=k=>({t:''+(k*l),err:k===1?`${l} là BCNN nên cũng là một bội chung.`:`${k*l} = ${k} · ${l} là bội của BCNN nên là bội chung.`});
    return {stem:`Biết BCNN(${a}, ${b}) = ${l}. Số nào sau đây <b>không</b> là bội chung của ${a} và ${b}?`,
      opts:[{t:''+x},E(1),E(2),E(3)],ans:0,
      exp:`Mọi bội chung đều là bội của ${l}. ${x} = ${l} + ${m} không chia hết cho ${l}, nên không phải bội chung.`};
  }
  return FB_MC();
}
function genCnt(){
  for(let n=0;n<300;n++){
    const [a,b]=pairKind('gen',20,60),l=lcm(a,b),k=ri(2,5),N=k*l+ri(1,l-1),m=Math.max(a,b),s=Math.min(a,b);
    const cands=[
      {t:''+(k+1),err:`Đếm thừa: ${k+1} · ${l} = ${(k+1)*l} đã lớn hơn ${N}.`},
      {t:''+(k-1),err:`Bỏ sót: ${k} · ${l} = ${k*l} vẫn nhỏ hơn ${N}.`},
      {t:''+Math.floor(N/s),err:`Đây mới là số bội của ${s} nhỏ hơn ${N}; còn phải là bội của ${m} nữa.`},
      {t:''+Math.floor(N/m),err:`Đây mới là số bội của ${m} nhỏ hơn ${N}; còn phải là bội của ${s} nữa.`},
      {t:''+(k+2),err:'Đếm thừa nhiều bội chung đã vượt quá giới hạn.'}];
    const opts=[{t:''+k}].concat(pickOpts(''+k,cands));
    if(opts.length<4)continue;
    const list=Array.from({length:k},(_,i)=>(i+1)*l).join(', ');
    return {stem:`Có bao nhiêu bội chung của ${a} và ${b} nhỏ hơn ${N} (không kể số 0)?`,opts,ans:0,
      exp:`BCNN(${a}, ${b}) = ${l}. Các bội chung khác 0 nhỏ hơn ${N} là ${list}; số tiếp theo là ${(k+1)*l} đã lớn hơn ${N}. Có ${k} số.`};
  }
  return FB_MC();
}
const CTX={
  days:{unit:'ngày',stem:(a,b)=>`Bạn An cứ ${a} ngày trực nhật một lần, bạn Bình cứ ${b} ngày trực nhật một lần. Hôm nay cả hai cùng trực nhật. Sau ít nhất bao nhiêu ngày nữa thì hai bạn lại cùng trực nhật?`},
  bus:{unit:'phút',stem:(a,b)=>`Hai tuyến xe buýt cùng rời bến lúc 6 giờ sáng. Tuyến 1 cứ ${a} phút có một chuyến, tuyến 2 cứ ${b} phút có một chuyến. Sau ít nhất bao nhiêu phút kể từ 6 giờ thì hai tuyến lại cùng có xe rời bến?`},
  light:{unit:'giây',stem:(a,b)=>`Hai đèn tín hiệu cùng bật sáng một lúc. Đèn xanh cứ ${a} giây bật sáng một lần, đèn đỏ cứ ${b} giây bật sáng một lần. Sau ít nhất bao nhiêu giây thì hai đèn lại cùng bật sáng?`}
};
function genWord(key){return ()=>{
  const C=CTX[key];
  for(let n=0;n<300;n++){
    const [a,b]=pairKind(sel(['gen','gen','mul']),30,240),l=lcm(a,b),g=gcd(a,b),m=Math.max(a,b),s=Math.min(a,b),p=a*b,u=C.unit;
    const cands=[
      {t:`${p} ${u}`,err:`Tích ${a} · ${b} = ${p} là một mốc cùng xảy ra nhưng không phải lần đầu tiên.`},
      {t:`${g} ${u}`,err:`Đây là ƯCLN(${a}, ${b}); bài toán hỏi bội chung nhỏ nhất.`},
      {t:`${m} ${u}`,err:`Chỉ là mốc của một bên; ${m} không chia hết cho ${s}.`},
      {t:`${a+b} ${u}`,err:'Cộng hai chu kì không cho mốc cùng xảy ra.'},
      {t:`${2*l} ${u}`,err:`${2*l} ${u} cũng là mốc chung nhưng không phải lần đầu tiên.`}];
    const good=`${l} ${u}`,opts=[{t:good}].concat(pickOpts(good,cands));
    if(opts.length<4)continue;
    return {stem:C.stem(a,b),opts,ans:0,exp:`Sau một số ${u} hai sự việc cùng xảy ra thì số đó là bội chung của ${a} và ${b}. "Ít nhất" nên là BCNN: ${lcmWhy(a,b)}. Vậy sau ${l} ${u}.`};
  }
  return FB_MC();
};}
function genTime(){
  for(let n=0;n<300;n++){
    const [a,b]=pairKind(sel(['gen','gen','mul']),30,240),l=lcm(a,b),g=gcd(a,b),m=Math.max(a,b),p=a*b;
    const cands=[];
    if(p<=720)cands.push({t:timeStr(p),err:`Sau ${p} phút hai xe cũng cùng rời bến nhưng đó không phải lần tiếp theo (lần đầu là sau ${l} phút).`});
    cands.push({t:timeStr(g),err:`Đây là ƯCLN (${g} phút), không phải BCNN.`});
    cands.push({t:timeStr(m),err:`Mới tính mốc của một xe (sau ${m} phút).`});
    cands.push({t:timeStr(a+b),err:'Cộng hai chu kì không cho mốc cùng rời bến.'});
    cands.push({t:timeStr(2*l),err:`Sau ${2*l} phút hai xe cũng cùng rời bến nhưng không phải lần tiếp theo.`});
    const good=timeStr(l),opts=[{t:good}].concat(pickOpts(good,cands));
    if(opts.length<4)continue;
    return {stem:`Hai xe buýt cùng rời bến lúc 6 giờ. Xe thứ nhất cứ ${a} phút rời bến một lần, xe thứ hai cứ ${b} phút rời bến một lần. Lần tiếp theo hai xe cùng rời bến vào lúc nào?`,opts,ans:0,
      exp:`Lần tiếp theo cùng rời bến sau BCNN(${a}, ${b}) = ${l} phút, tức là lúc ${good}.`};
  }
  return FB_MC();
}
function genSq(){
  for(let n=0;n<300;n++){
    const [a,b]=pairKind('gen',30,300),l=lcm(a,b),g=gcd(a,b),m=Math.max(a,b),s=Math.min(a,b),p=a*b;
    const cands=[
      {t:`${p} cm`,err:`Hình vuông cạnh ${p} cm cũng lát được nhưng không phải nhỏ nhất.`},
      {t:`${g} cm`,err:`Đây là ƯCLN(${a}, ${b}); cạnh phải là bội chung của hai kích thước.`},
      {t:`${m} cm`,err:`Cạnh ${m} cm không chia hết cho ${s} nên không lát kín được.`},
      {t:`${a+b} cm`,err:'Cạnh phải là bội chung của hai kích thước, không phải tổng.'},
      {t:`${2*l} cm`,err:`Hình vuông cạnh ${2*l} cm lát được nhưng không phải nhỏ nhất.`}];
    const good=`${l} cm`,opts=[{t:good}].concat(pickOpts(good,cands));
    if(opts.length<4)continue;
    return {stem:`Người ta xếp các viên gạch hình chữ nhật có kích thước ${a} cm × ${b} cm (đặt cùng một hướng, không cắt gạch) để lát kín một hình vuông. Cạnh của hình vuông nhỏ nhất có thể lát được dài bao nhiêu xentimét?`,opts,ans:0,
      exp:`Cạnh hình vuông phải chia hết cho cả ${a} và ${b}; nhỏ nhất nên bằng BCNN(${a}, ${b}) = ${l} cm.`};
  }
  return FB_MC();
}
function rangeData(){
  for(let n=0;n<500;n++){
    const [a,b]=pairKind('gen',24,60),l=lcm(a,b);
    if(l<8)continue;
    const k=ri(1,6),x=k*l;
    if(x<20||x>150)continue;
    const r1=ri(2,l-1),r2=ri(2,l-1);
    return {a,b,l,x,L:x-r1,U:x+r2};
  }
  return {a:4,b:6,l:12,x:48,L:40,U:55};
}
function genRange(){
  const d=rangeData(),{a,b,l,x,L,U}=d;
  const E=y=>({t:''+y,err:why(y,a,b)+', nên không phải bội chung.'});
  const opts=[{t:''+x},E(x+a),E(x+b),{t:''+(x+l),err:`${x+l} là bội chung nhưng lớn hơn ${U}, nằm ngoài khoảng đã cho.`}];
  return {stem:`Một khối học sinh khi xếp hàng ${a}, xếp hàng ${b} đều vừa đủ (không thừa, không thiếu ai). Biết số học sinh lớn hơn ${L} và nhỏ hơn ${U}. Hỏi khối có bao nhiêu học sinh?`,opts,ans:0,
    exp:`Số học sinh là bội chung của ${a} và ${b}, tức là bội của BCNN = ${l}: ${[x-l,x,x+l].filter(v=>v>0).join(', ')}. Chỉ có ${x} nằm trong khoảng từ ${L} đến ${U}.`};
}

/* ============ Bộ sinh đúng sai ============ */
function truths(){
  for(let n=0;n<60;n++){const t=[0,1,2,3].map(()=>RNG()<.5),k=t.filter(Boolean).length;if(k>=1&&k<=3)return t;}
  return [true,false,true,false];
}
function notBC(a,b,l){
  const ca=[],cb=[];for(let t=2;t<=8;t++){if((a*t)%b)ca.push(a*t);if((b*t)%a)cb.push(b*t);}
  const pool=ca.concat(cb);pool.push(l+1);return sel(pool);
}
function cBC(c,tr){
  const x=tr?c.l*ri(1,4):notBC(c.a,c.b,c.l);
  return {t:`${x} là bội chung của ${c.a} và ${c.b}.`,v:tr,topic:'bc',level:'NB',exp:tr?`${why(x,c.a,c.b)}.`:`${why(x,c.a,c.b)}, nên ${x} không là bội chung.`};
}
function cL(c,tr,lv){
  const {a,b,l,g,m,s}=c,p=a*b;
  let y=l;
  if(!tr){
    const pool=[p,g,m,a+b,2*l].filter(v=>v!==l);
    y=sel(pool);
  }
  return {t:`BCNN(${a}, ${b}) = ${y}.`,v:tr,topic:'ts',level:lv,
    exp:tr?lcmWhy(a,b)+'.':`Đúng là BCNN(${a}, ${b}) = ${l}. ${y%l===0?`${y} là bội chung nhưng không phải nhỏ nhất`:why(y,a,b)}.`};
}
function cCnt(c,tr){
  const {a,b,l}=c,k=ri(2,5),N=k*l+ri(1,l-1),mm=tr?k:sel([k-1,k+1,k+2]);
  const list=Array.from({length:k},(_,i)=>(i+1)*l).join(', ');
  return {t:`Có đúng ${mm} bội chung của ${a} và ${b} nhỏ hơn ${N} (không kể số 0).`,v:tr,topic:'sy',level:'VD',
    exp:`BCNN(${a}, ${b}) = ${l}. Các bội chung khác 0 nhỏ hơn ${N} là ${list}: có ${k} số${tr?'.':`, không phải ${mm}.`}`};
}
function ctxOf(a,b){return {a,b,l:lcm(a,b),g:gcd(a,b),m:Math.max(a,b),s:Math.min(a,b)};}
function tfNum(level){return ()=>{
  for(let n=0;n<200;n++){
    const [a,b]=level==='NB'?pairKind(sel(['gen','gen','cop','mul']),24,120):pairKind('gen',24,60),c=ctxOf(a,b);
    const kinds=level==='NB'?['bc','bc','bc','l']:level==='TH'?['bc','bc','l','l']:['bc','l','cnt','cnt'];
    const tr=truths();
    const items=kinds.map((k,i)=>k==='bc'?cBC(c,tr[i]):k==='l'?cL(c,tr[i],level==='VD'?'VD':'TH'):cCnt(c,tr[i]));
    if(level!=='NB')items.forEach(it=>{if(it.topic==='bc')it.level='TH';});
    if(new Set(items.map(i=>i.t)).size<4)continue;
    return {stem:`Cho hai số a = ${a} và b = ${b}. Xét các phát biểu sau:`,items};
  }
  return FB_TF();
};}
const PROP_T=[
  {t:'Mọi bội chung của a và b đều là bội của BCNN(a, b).',topic:'sy',level:'TH',exp:'Tập các bội chung của a và b chính là tập các bội của BCNN(a, b).'},
  {t:'BCNN(a, b) chia hết cho cả a và b.',topic:'bc',level:'NB',exp:'BCNN(a, b) là một bội chung của a và b nên chia hết cho cả hai số.'},
  {t:'Nếu a chia hết cho b thì BCNN(a, b) = a.',topic:'ts',level:'TH',exp:'a đã là bội của b nên a là bội chung nhỏ nhất của a và b. Ví dụ BCNN(12, 4) = 12.'},
  {t:'Nếu a và b nguyên tố cùng nhau thì BCNN(a, b) = a · b.',topic:'ts',level:'TH',exp:'Hai số nguyên tố cùng nhau không có thừa số nguyên tố chung nên BCNN bằng tích. Ví dụ BCNN(4, 9) = 36.'},
  {t:'BCNN(a, b) không nhỏ hơn số lớn hơn trong hai số a, b.',topic:'bc',level:'TH',exp:'BCNN(a, b) là bội của cả hai số nên không nhỏ hơn số lớn hơn.'},
  {t:'Hai số a, b khác 0 luôn có vô số bội chung.',topic:'bc',level:'TH',exp:'Các bội của BCNN(a, b) đều là bội chung nên có vô số.'}];
const PROP_F=[
  {t:'BCNN(a, b) luôn bằng a · b.',topic:'ts',level:'TH',exp:'Chỉ đúng khi a, b nguyên tố cùng nhau. Ví dụ BCNN(4, 6) = 12 còn 4 · 6 = 24.'},
  {t:'BCNN(a, b) có thể nhỏ hơn số lớn hơn trong hai số a, b.',topic:'bc',level:'TH',exp:'BCNN(a, b) là bội của cả hai số nên không thể nhỏ hơn số lớn hơn.'},
  {t:'Hai số a, b khác 0 chỉ có đúng một bội chung.',topic:'bc',level:'NB',exp:'Mọi bội của BCNN(a, b) đều là bội chung nên có vô số bội chung.'},
  {t:'Có bội chung khác 0 của a và b nhỏ hơn BCNN(a, b).',topic:'sy',level:'TH',exp:'BCNN(a, b) là bội chung nhỏ nhất khác 0, nên không có bội chung khác 0 nào nhỏ hơn nó.'},
  {t:'Nếu a chia hết cho b và a khác b thì BCNN(a, b) = b.',topic:'ts',level:'TH',exp:'Khi đó a là bội của b nên BCNN(a, b) = a, không phải b. Ví dụ BCNN(12, 4) = 12.'},
  {t:'Muốn tìm BCNN bằng phân tích ra thừa số nguyên tố, ta chỉ lấy các thừa số nguyên tố chung.',topic:'ts',level:'TH',exp:'Phải lấy cả thừa số chung và riêng, mỗi thừa số với số mũ lớn nhất.'},
  {t:'BCNN(a, b) luôn là ước của a.',topic:'bc',level:'NB',exp:'BCNN(a, b) là bội của a, không phải ước của a (trừ khi hai số bằng nhau).'}];
function tfProp(){
  const nT=ri(1,3);
  const items=shuffle(shuffle(PROP_T).slice(0,nT).map(o=>Object.assign({v:true},o)).concat(shuffle(PROP_F).slice(0,4-nT).map(o=>Object.assign({v:false},o))));
  return {stem:'Cho a và b là hai số tự nhiên khác 0. Xét các phát biểu sau:',items};
}
function tfFac(){
  const d=genFacData(),{A,B}=d,tr=truths();
  const primes=Object.keys(d.M).map(Number).sort((x,y)=>x-y),common=Object.keys(d.Mn).map(Number).sort((x,y)=>x-y);
  const diff=common.filter(p=>A[p]!==B[p]),p=sel(diff);
  const lst=v=>v.join(', ');
  const it1=tr[0]?{t:`Các thừa số nguyên tố xuất hiện trong a hoặc b là ${lst(primes)}.`,v:true,exp:`a có ${lst(Object.keys(A))}, b có ${lst(Object.keys(B))}; gộp lại là ${lst(primes)}.`}
    :{t:`Các thừa số nguyên tố xuất hiện trong a hoặc b là ${lst(common)}.`,v:false,exp:`${lst(common)} chỉ là các thừa số chung; còn có cả thừa số riêng, tất cả là ${lst(primes)}.`};
  const e=tr[1]?d.M[p]:Math.min(A[p],B[p]);
  const it2={t:`Trong BCNN(a, b), thừa số ${p} có số mũ ${e}.`,v:tr[1],exp:`Số mũ của ${p} trong a là ${A[p]}, trong b là ${B[p]}; BCNN lấy số mũ lớn nhất là ${d.M[p]}${tr[1]?'.':`, không phải ${e}.`}`};
  const wrong3=sel([d.sCo,d.sMn,d.sS]);
  const it3=tr[2]?{t:`BCNN(a, b) = ${d.sM}.`,v:true,exp:`Lấy mọi thừa số nguyên tố với số mũ lớn nhất: ${d.sM}.`}
    :{t:`BCNN(a, b) = ${wrong3}.`,v:false,exp:`BCNN(a, b) = ${d.sM}, không phải ${wrong3}.`};
  const wrong4=sel([d.a*d.b,facVal(d.Co)].filter(v=>v!==d.l));
  const it4=tr[3]?{t:`BCNN(a, b) = ${d.l}.`,v:true,exp:`${d.sM} = ${d.l}.`}
    :{t:`BCNN(a, b) = ${wrong4}.`,v:false,exp:`BCNN(a, b) = ${d.sM} = ${d.l}, không phải ${wrong4}.`};
  const items=[it1,it2,it3,it4].map(it=>Object.assign({topic:'ts',level:'TH'},it));
  return {stem:`Cho a = ${facStr(A)} và b = ${facStr(B)} (đã phân tích ra thừa số nguyên tố). Xét các phát biểu sau:`,items};
}
function duty(x,a,b){return `Sau ${x} ngày: ${x%a===0?'An trực':'An không trực'}, ${x%b===0?'Bình trực':'Bình không trực'}.`;}
function tfWord(){
  for(let n=0;n<200;n++){
    const [a,b]=pairKind('gen',20,60),c=ctxOf(a,b),{l,g,m,p}=Object.assign({p:a*b},c),tr=truths();
    const stem=`Bạn An cứ ${a} ngày trực nhật một lần, bạn Bình cứ ${b} ngày trực nhật một lần. Hôm nay cả hai cùng trực nhật. Xét các phát biểu sau:`;
    const y=tr[0]?l:sel([p,g,m,2*l].filter(v=>v!==l));
    const it1={t:`Sau ít nhất ${y} ngày nữa, hai bạn lại cùng trực nhật.`,v:tr[0],level:'TH',exp:tr[0]?`Lần tiếp theo cùng trực là sau BCNN(${a}, ${b}) = ${l} ngày.`:`Lần tiếp theo cùng trực là sau BCNN(${a}, ${b}) = ${l} ngày, không phải ${y} ngày.`};
    const x2=tr[1]?l*ri(2,3):sel([a*ri(2,6),b*ri(2,6)].filter(v=>v%l!==0).concat([l+1]));
    const it2={t:`Sau ${x2} ngày kể từ hôm nay, hai bạn cùng trực nhật.`,v:tr[1],level:'TH',exp:duty(x2,a,b)};
    let x3;
    if(tr[2]){const arr=[];for(let t=2;t<=8;t++)if((a*t)%b)arr.push(a*t);x3=sel(arr);}
    else x3=sel([l*ri(1,3),(()=>{const arr=[];for(let t=2;t<=8;t++)if((b*t)%a)arr.push(b*t);return sel(arr);})()]);
    const it3={t:`Sau ${x3} ngày kể từ hôm nay, chỉ bạn An trực nhật (bạn Bình không trực).`,v:tr[2],level:'VD',exp:duty(x3,a,b)};
    const k=ri(2,5),N=k*l+ri(1,l-1),mm=tr[3]?k:sel([k-1,k+1,k+2]);
    const it4={t:`Trong ${N} ngày tới (kể từ hôm nay, không kể hôm nay), hai bạn cùng trực nhật ${mm} lần.`,v:tr[3],level:'VD',exp:`Các ngày cùng trực là bội chung khác 0 của ${a} và ${b}: ${Array.from({length:k},(_,i)=>(i+1)*l).join(', ')}. Có ${k} lần${tr[3]?'.':`, không phải ${mm}.`}`};
    const items=[it1,it2,it3,it4].map(it=>Object.assign({topic:'tt'},it));
    if(new Set(items.map(i=>i.t)).size<4)continue;
    return {stem,items};
  }
  return FB_TF();
}

/* mức nhận biết: bội, bội chung, số 0, định nghĩa BCNN, với các số nhỏ */
const SMALL=[[2,3],[4,6],[3,5],[6,8],[4,10],[6,9],[2,5],[3,4],[6,10],[8,12],[4,5],[9,12]];
function tfBasicNB(){
  for(let n=0;n<200;n++){
    const [a,b]=sel(SMALL),c=ctxOf(a,b),tr=truths();
    const mk=[
      v=>{const q=ri(2,9),x=v?a*q:a*q+ri(1,a-1);return {t:`${x} là bội của ${a}.`,v,topic:'bc',level:'NB',exp:v?`${x} = ${a} · ${q} nên ${x} chia hết cho ${a}.`:`${x} không chia hết cho ${a} nên không là bội của ${a}.`};},
      v=>({t:v?`Số 0 là một bội chung của ${a} và ${b}.`:`Số 0 không phải là bội chung của ${a} và ${b}.`,v,topic:'bc',level:'NB',exp:`Số 0 chia hết cho mọi số khác 0 nên 0 là bội chung của ${a} và ${b}.`}),
      v=>cBC(c,v),
      v=>({t:v?`BCNN(${a}, ${b}) là số nhỏ nhất khác 0 trong các bội chung của ${a} và ${b}.`:`BCNN(${a}, ${b}) = 0 vì 0 là bội chung nhỏ nhất của ${a} và ${b}.`,v,topic:'bc',level:'NB',exp:v?'Đó là định nghĩa bội chung nhỏ nhất.':`BCNN là số nhỏ nhất khác 0 trong các bội chung, nên BCNN(${a}, ${b}) = ${c.l}, không phải 0.`}),
      v=>({t:`BCNN(${a}, 1) = ${v?a:1}.`,v,topic:'ts',level:'NB',exp:`Mọi số tự nhiên đều chia hết cho 1 nên BCNN(${a}, 1) = ${a}.`})];
    const items=shuffle(mk).slice(0,4).map((f,i)=>f(tr[i]));
    if(new Set(items.map(i=>i.t)).size<4)continue;
    return {stem:`Cho hai số ${a} và ${b}. Xét các phát biểu sau:`,items};
  }
  return FB_TF();
}

/* ============ Câu trả lời ngắn ============ */
const SA=[
 {id:'s_bc_nb',topic:'bc',level:'NB',unit:'',gen:()=>{const [a,b]=pairKind(sel(['gen','gen','cop','mul']),12,72),l=lcm(a,b);return{stem:`Tìm số tự nhiên nhỏ nhất khác 0 chia hết cho cả ${a} và ${b}.`,ans:[l],exp:`Đó là BCNN(${a}, ${b}). ${lcmWhy(a,b)}.`};}},
 {id:'s_bc_th',topic:'bc',level:'TH',unit:'',gen:()=>{const [a,b]=pairKind('gen',20,100),l=lcm(a,b);return{stem:`Gọi x và y là hai bội chung nhỏ nhất khác 0 của ${a} và ${b} (x < y). Tính x + y.`,ans:[3*l],exp:`BCNN(${a}, ${b}) = ${l} nên x = ${l}, y = 2 · ${l} = ${2*l}. Vậy x + y = ${3*l}.`};}},
 {id:'s_ts_nb',topic:'ts',level:'NB',unit:'',gen:()=>{const [a,b]=pairKind(sel(['cop','mul']),24,300),l=lcm(a,b);return{stem:`Tìm BCNN(${a}, ${b}).`,ans:[l],exp:lcmWhy(a,b)+'.'};}},
 {id:'s_ts_th',topic:'ts',level:'TH',unit:'',gen:()=>{const d=genFacData();return{stem:`Cho a = ${facStr(d.A)} và b = ${facStr(d.B)}. Tính BCNN(a, b).`,ans:[d.l],exp:`Lấy mọi thừa số nguyên tố với số mũ lớn nhất: BCNN(a, b) = ${d.sM} = ${d.l}.`};}},
 {id:'s_ts_th2',topic:'ts',level:'TH',unit:'',gen:()=>{const [a,b]=pairKind('gen',40,400),l=lcm(a,b);return{stem:`Tìm BCNN(${a}, ${b}).`,ans:[l],exp:lcmWhy(a,b)+'.'};}},
 {id:'s_ts_vd',topic:'ts',level:'VD',unit:'',gen:()=>{const d=threeData(500),{a,b,c,L}=d;return{stem:`Tìm BCNN(${a}, ${b}, ${c}).`,ans:[L],exp:`${a} = ${facStr(fac(a))}; ${b} = ${facStr(fac(b))}; ${c} = ${facStr(fac(c))}. Lấy mỗi thừa số nguyên tố với số mũ lớn nhất: BCNN(${a}, ${b}, ${c}) = ${facStr(fac(L))} = ${L}.`};}},
 {id:'s_sy_th',topic:'sy',level:'TH',unit:'',gen:()=>{const [a,b]=pairKind('gen',20,60),l=lcm(a,b),k=ri(2,5),N=k*l+ri(1,l);return{stem:`Tìm bội chung lớn nhất của ${a} và ${b} mà nhỏ hơn ${N}.`,ans:[k*l],exp:`BCNN(${a}, ${b}) = ${l}. Các bội chung là các bội của ${l}: ${k*l} < ${N} còn ${(k+1)*l} ≥ ${N}. Vậy bội chung lớn nhất nhỏ hơn ${N} là ${k*l}.`};}},
 {id:'s_sy_vd',topic:'sy',level:'VD',unit:'',gen:()=>{const [a,b]=pairKind('gen',20,60),l=lcm(a,b),k=ri(2,6),N=k*l+ri(1,l-1);return{stem:`Có bao nhiêu bội chung của ${a} và ${b} nhỏ hơn ${N} (không kể số 0)?`,ans:[k],exp:`BCNN(${a}, ${b}) = ${l}. Các bội chung khác 0 nhỏ hơn ${N} là ${Array.from({length:k},(_,i)=>(i+1)*l).join(', ')}. Có ${k} số.`};}},
 {id:'s_tt_th',topic:'tt',level:'TH',unit:'',gen:()=>{const key=sel(['days','bus','light']),C=CTX[key],[a,b]=pairKind(sel(['gen','gen','mul']),30,240),l=lcm(a,b);return{stem:C.stem(a,b),unit:C.unit,ans:[l],exp:`"Ít nhất" nên là BCNN: ${lcmWhy(a,b)}. Vậy sau ${l} ${C.unit}.`};}},
 {id:'s_tt_vd1',topic:'tt',level:'VD',unit:'cm',gen:()=>{const [a,b]=pairKind('gen',30,300),l=lcm(a,b);return{stem:`Người ta xếp các viên gạch hình chữ nhật có kích thước ${a} cm × ${b} cm (đặt cùng một hướng, không cắt gạch) để lát kín một hình vuông. Tính độ dài cạnh nhỏ nhất của hình vuông đó.`,ans:[l],exp:`Cạnh hình vuông phải chia hết cho cả ${a} và ${b}; nhỏ nhất là BCNN(${a}, ${b}) = ${l} cm.`};}},
 {id:'s_tt_vd2',topic:'tt',level:'VD',unit:'học sinh',gen:()=>{const d=rangeData();return{stem:`Một khối học sinh khi xếp hàng ${d.a}, xếp hàng ${d.b} đều vừa đủ (không thừa, không thiếu ai). Biết số học sinh lớn hơn ${d.L} và nhỏ hơn ${d.U}. Hỏi khối có bao nhiêu học sinh?`,ans:[d.x],exp:`Số học sinh là bội của BCNN(${d.a}, ${d.b}) = ${d.l}: ${[d.x-d.l,d.x,d.x+d.l].filter(v=>v>0).join(', ')}. Chỉ có ${d.x} nằm trong khoảng từ ${d.L} đến ${d.U}.`};}},
 {id:'s_tt_vd3',topic:'tt',level:'VD',unit:'lần',gen:()=>{const [a,b]=pairKind('gen',20,60),l=lcm(a,b),k=ri(2,5),T=k*l+ri(1,l-1);return{stem:`Hai tuyến xe buýt cùng rời bến lúc 6 giờ. Tuyến 1 cứ ${a} phút, tuyến 2 cứ ${b} phút có một chuyến. Trong ${T} phút kể từ 6 giờ (không kể lúc 6 giờ), hai tuyến cùng có xe rời bến bao nhiêu lần?`,ans:[k],exp:`Các lần cùng rời bến sau ${Array.from({length:k},(_,i)=>(i+1)*l).join(', ')} phút (bội của BCNN(${a}, ${b}) = ${l}); lần kế tiếp sau ${(k+1)*l} phút đã vượt quá ${T}. Có ${k} lần.`};}}
].map(q=>Object.assign({type:'sa'},q));
SA.push(...SA.map(q=>Object.assign({},q,{id:q.id+'b'})));

/* ============ Chủ đề ============ */
const TOPICS={
  bc:{short:'Bội chung',name:'Bội chung',rule:'Bội chung của hai hay nhiều số là số vừa là bội của số này vừa là bội của số kia. Tập hợp các bội chung của a và b kí hiệu là BC(a, b).',tip:'Một số là bội chung của a và b khi nó chia hết cho cả a và b. Chia hết cho một trong hai số thì chưa đủ.'},
  ts:{short:'Tìm BCNN',name:'Tìm BCNN bằng phân tích ra thừa số nguyên tố',rule:'BCNN(a, b) là số nhỏ nhất khác 0 trong các bội chung của a và b. Để tìm BCNN: phân tích mỗi số ra thừa số nguyên tố; chọn các thừa số nguyên tố chung và riêng; mỗi thừa số lấy với số mũ lớn nhất; nhân các thừa số đã chọn.',tip:'Lấy cả thừa số chung và thừa số riêng, mỗi thừa số với số mũ lớn nhất. Lấy số mũ nhỏ nhất của thừa số chung là tìm ƯCLN. Hai số nguyên tố cùng nhau thì BCNN bằng tích; nếu số lớn chia hết cho số bé thì BCNN là số lớn.'},
  sy:{short:'Suy ra BC',name:'Từ BCNN suy ra bội chung',rule:'Mọi bội chung của a và b đều là bội của BCNN(a, b). Muốn tìm các bội chung của a và b, ta tìm BCNN rồi nhân với 0, 1, 2, 3, ...',tip:'Các bội chung khác 0 là BCNN, 2 lần BCNN, 3 lần BCNN, ... Một số không chia hết cho BCNN thì không là bội chung.'},
  tt:{short:'Thực tế',name:'Bài toán thực tế',rule:'Hai sự việc lặp lại sau mỗi a và b đơn vị thời gian: sau ít nhất bao lâu thì cùng xảy ra lại là BCNN(a, b). Các lần cùng xảy ra là các bội chung.',tip:'Đọc kĩ đề: "sau ít nhất" hay "nhỏ nhất" thì tìm BCNN. "Trong khoảng từ ... đến ..." thì tìm các bội chung nằm trong khoảng đó.'}
};
const TKEYS=['bc','ts','sy','tt'];
const TDESC={bc:'Nhận biết bội chung, tìm bội chung của hai số',ts:'Phân tích ra thừa số nguyên tố, BCNN của hai hoặc ba số',sy:'Từ BCNN suy ra các bội chung, đếm bội chung',tt:'Lịch trực, xe buýt, lát gạch, xếp hàng'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhận ra bội chung, đọc kí hiệu, tìm BCNN của các cặp số đơn giản.',TH:'Tìm BCNN, chọn đáp án qua phân tích thừa số nguyên tố, suy ra bội chung.',VD:'Bài toán thực tế và các bài nhiều bước.'};

/* ============ Ngân hàng nhiều lựa chọn ============ */
const O=(t,err)=>err?{t,err}:{t};
const MC=[
 {id:'m1',topic:'bc',level:'NB',stem:'Bội chung của hai số a và b là số như thế nào?',ans:0,opts:[
   O('Số chia hết cho cả a và b'),
   O('Số là ước của cả a và b','Đó là ước chung. Bội chung là số chia hết cho cả hai số.'),
   O('Số là tổng của a và b','Tổng a + b chưa chắc chia hết cho a và b.'),
   O('Số chia hết cho a hoặc chia hết cho b','Phải chia hết cho cả hai số, không phải chỉ một trong hai.')],
  exp:'Bội chung của a và b là số vừa là bội của a vừa là bội của b, tức là chia hết cho cả a và b.'},
 {id:'m2',topic:'bc',level:'NB',stem:'Kí hiệu nào dùng cho tập hợp các bội chung của 4 và 6?',ans:0,opts:[
   O('BC(4, 6)'),
   O('ƯC(4, 6)','ƯC là tập hợp các ước chung.'),
   O('BCNN(4, 6)','BCNN là một số (bội chung nhỏ nhất), không phải tập hợp.'),
   O('B(4, 6)','B(a) là tập hợp các bội của một số a.')],
  exp:'Tập hợp các bội chung của 4 và 6 kí hiệu là BC(4, 6).'},
 {id:'m3',topic:'ts',level:'NB',stem:'Khi tìm BCNN của hai số bằng cách phân tích ra thừa số nguyên tố, ta lấy những thừa số nào, với số mũ ra sao?',ans:0,opts:[
   O('Tất cả các thừa số chung và riêng, mỗi thừa số với số mũ lớn nhất'),
   O('Chỉ các thừa số chung, mỗi thừa số với số mũ nhỏ nhất','Đó là cách tìm ƯCLN, không phải BCNN.'),
   O('Chỉ các thừa số chung, mỗi thừa số với số mũ lớn nhất','Còn thiếu các thừa số riêng của mỗi số.'),
   O('Tất cả các thừa số chung và riêng, mỗi thừa số với số mũ nhỏ nhất','BCNN phải lấy số mũ lớn nhất, không phải nhỏ nhất.')],
  exp:'BCNN lấy tất cả các thừa số nguyên tố chung và riêng, mỗi thừa số với số mũ lớn nhất.'},
 {id:'m4',topic:'sy',level:'NB',stem:'Biết BCNN(a, b) = l. Mọi bội chung của a và b đều là bội của số nào?',ans:0,opts:[
   O('l'),
   O('a · b','Tích a · b là một bội chung, nhưng không phải mọi bội chung đều là bội của tích.'),
   O('a + b','Không có quy tắc nào cho tổng a + b.'),
   O('Số lớn hơn trong hai số a, b','Bội chung không nhất thiết là bội của riêng số lớn hơn.')],
  exp:'Mọi bội chung của a và b đều là bội của BCNN(a, b), tức là bội của l.'},
 {id:'m5',topic:'ts',level:'NB',stem:'Hai số tự nhiên lớn hơn 1 nguyên tố cùng nhau thì BCNN của chúng bằng:',ans:0,opts:[
   O('Tích của hai số'),
   O('Tổng của hai số','Không có quy tắc BCNN bằng tổng.'),
   O('Số lớn hơn trong hai số','Số lớn hơn không chia hết cho số bé (hai số nguyên tố cùng nhau).'),
   O('1','BCNN không thể bằng 1 nếu hai số lớn hơn 1; 1 là ƯCLN của hai số này.')],
  exp:'Hai số nguyên tố cùng nhau không có thừa số nguyên tố chung nên BCNN bằng tích của hai số. Ví dụ BCNN(4, 9) = 36.'},
 {id:'m6',topic:'ts',level:'NB',stem:'Nếu số lớn chia hết cho số bé thì BCNN của hai số đó bằng:',ans:0,opts:[
   O('Số lớn'),
   O('Số bé','Số bé là ước của số lớn, không phải bội chung nhỏ nhất.'),
   O('Tích của hai số','Tích là một bội chung nhưng chưa nhỏ nhất, vì số lớn đã chia hết cho số bé.'),
   O('Tổng của hai số','Không có quy tắc BCNN bằng tổng.')],
  exp:'Số lớn đã chia hết cho số bé nên số lớn là bội chung nhỏ nhất. Ví dụ BCNN(4, 12) = 12.'},
 {id:'m7',topic:'tt',level:'TH',stem:'Hai sự việc lặp lại theo chu kì 6 ngày và 8 ngày, hôm nay cùng xảy ra. Muốn biết sau ít nhất bao nhiêu ngày thì cùng xảy ra lại, ta cần tìm:',ans:0,opts:[
   O('Bội chung nhỏ nhất của 6 và 8'),
   O('Ước chung lớn nhất của 6 và 8','ƯCLN cho số lớn nhất chia hết cả hai, không cho mốc cùng xảy ra.'),
   O('Tổng của 6 và 8','Cộng hai chu kì không cho mốc cùng xảy ra.'),
   O('Tích của 6 và 8','Tích là một mốc chung nhưng chưa phải mốc đầu tiên.')],
  exp:'Các mốc cùng xảy ra là bội chung của 6 và 8; "ít nhất" nên là BCNN(6, 8) = 24.'}
].map(q=>Object.assign({type:'mc'},q));
const addMC=(id,topic,level,gen)=>MC.push({id,type:'mc',topic,level,gen});
['a','b','c'].forEach(x=>{
  addMC('g_def_'+x,'bc','NB',genDef);
  addMC('g_set_'+x,'bc','TH',genSet);
  addMC('g_find_'+x,'ts','TH',genFind('gen'));
  addMC('g_fac_'+x,'ts','TH',genFac);
  addMC('g_via_'+x,'sy','NB',genVia);
  addMC('g_notbc_'+x,'sy','TH',genNotBc);
  addMC('g_cnt_'+x,'sy','VD',genCnt);
  addMC('g_days_'+x,'tt','TH',genWord('days'));
  addMC('g_range_'+x,'tt','VD',genRange);
});
['a','b'].forEach(x=>{
  addMC('g_cop_'+x,'ts','NB',genFind('cop'));
  addMC('g_mul_'+x,'ts','NB',genFind('mul'));
  addMC('g_three_'+x,'ts','VD',genThree);
  addMC('g_bus_'+x,'tt','TH',genWord('bus'));
  addMC('g_time_'+x,'tt','VD',genTime);
  addMC('g_sq_'+x,'tt','VD',genSq);
});
addMC('g_light_a','tt','TH',genWord('light'));

const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
['a','b'].forEach(x=>{
  addTF('tf_num_nb_'+x,'bc','NB',tfNum('NB'));
  addTF('tf_num_th_'+x,'bc','TH',tfNum('TH'));
  addTF('tf_num_vd_'+x,'sy','VD',tfNum('VD'));
  addTF('tf_word_'+x,'tt','VD',tfWord);
});
['a','b','c'].forEach(x=>{
  addTF('tf_prop_'+x,'sy','TH',tfProp);
  addTF('tf_fac_'+x,'ts','TH',tfFac);
  addTF('tf_basic_nb_'+x,'bc','NB',tfBasicNB);
});
addTF('tf_num_nb_c','bc','NB',tfNum('NB'));

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<div style="overflow-x:auto"><table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
const lcm3=(a,b,c)=>lcm(lcm(a,b),c);
const TRI3=[[3,4,5],[4,5,6],[2,3,7],[4,6,9],[3,5,8],[6,8,9],[4,6,10],[5,6,8]];
const BELL=[[4,5,10],[6,8,12],[6,10,15],[9,12,18],[8,10,20],[5,9,15],[12,15,20],[8,9,12],[10,18,45],[8,15,24]];
const BUS=[[10,15,12],[10,15,20],[8,12,18],[12,18,24],[9,12,8],[12,16,18],[10,15,25],[6,10,8],[15,20,24]];
const gio=m=>`${Math.floor(m/60)} giờ${m%60?` ${m%60} phút`:''}`;
const boi=(l,k)=>Array.from({length:k},(_,i)=>(i+1)*l).join(', ');
function tfDiv(){
  for(let n=0;n<200;n++){
    const [a,b]=sel([[6,8],[4,6],[6,9],[8,12],[9,12],[10,15],[6,10],[12,18],[8,20],[12,16]]),l=lcm(a,b),p=a*b,v=[0,1,2,3].map(()=>RNG()<.5);
    let q=2;while(l%q)q++;
    const big=2*l===p?3*l:2*l,k=ri(2,5),N=k*l+ri(1,l-1),kk=v[3]?k:sel([k-1,k+1]);
    const items=[
      {t:`n chắc chắn chia hết cho ${v[0]?l:p}.`,v:v[0],topic:'sy',level:'VD',exp:v[0]?`n là bội chung của ${a} và ${b} nên là bội của BCNN(${a}, ${b}) = ${l}.`:`n là bội của BCNN(${a}, ${b}) = ${l}, nhưng chưa chắc chia hết cho ${p}. Ví dụ n = ${l} không chia hết cho ${p}.`},
      {t:`n chắc chắn chia hết cho ${v[1]?l/q:big}.`,v:v[1],topic:'sy',level:'VD',exp:v[1]?`n chia hết cho ${l}, mà ${l} chia hết cho ${l/q}, nên n chia hết cho ${l/q}.`:`n chỉ chắc chắn chia hết cho BCNN(${a}, ${b}) = ${l}. Ví dụ n = ${l} không chia hết cho ${big}.`},
      {t:`Giá trị nhỏ nhất của n là ${v[2]?l:(l/q===a||l/q===b?p:l/q)}.`,v:v[2],topic:'ts',level:'VD',exp:`Số nhỏ nhất khác 0 chia hết cho cả ${a} và ${b} là BCNN(${a}, ${b}) = ${l}.`},
      {t:`Có đúng ${kk} giá trị của n nhỏ hơn ${N}.`,v:v[3],topic:'sy',level:'VD',exp:`Các giá trị của n nhỏ hơn ${N} là ${boi(l,k)}: có ${k} giá trị${v[3]?'.':`, không phải ${kk}.`}`}];
    if(tfOK(items))return {stem:`Số tự nhiên n khác 0 chia hết cho cả ${a} và ${b}. Xét các phát biểu sau:`,items};
  }
  return FB_TF();
}
const HARD={tf:[{id:'h_chia',type:'tf',topic:'sy',level:'VD',gen:tfDiv}],sa:[
 {id:'h_du',topic:'sy',level:'VD',unit:'',gen:()=>{const [a,b]=pairKind('gen',20,90),l=lcm(a,b),r=ri(1,Math.min(a,b)-1),m=Math.max(a,b);return{stem:`Tìm số tự nhiên nhỏ nhất lớn hơn ${m} mà khi chia cho ${a} và chia cho ${b} đều dư ${r}.`,ans:[l+r],exp:`Số cần tìm trừ đi ${r} thì chia hết cho cả ${a} và ${b}, tức là một bội chung của ${a} và ${b}. Bội chung nhỏ nhất khác 0 là BCNN(${a}, ${b}) = ${l}. Vậy số cần tìm là ${l} + ${r} = ${l+r}.`};}},
 {id:'h_thieu',topic:'ts',level:'VD',unit:'',gen:()=>{const [a,b,c]=sel(TRI3),L=lcm3(a,b,c);return{stem:`Tìm số tự nhiên nhỏ nhất khác 0 mà khi chia cho ${a} dư ${a-1}, chia cho ${b} dư ${b-1} và chia cho ${c} dư ${c-1}.`,ans:[L-1],exp:`Số cần tìm cộng thêm 1 thì chia hết cho cả ${a}, ${b} và ${c}. Nhỏ nhất nên số đó cộng 1 bằng BCNN(${a}, ${b}, ${c}) = ${L}. Vậy số cần tìm là ${L} − 1 = ${L-1}.`};}},
 {id:'h_hs',topic:'tt',level:'VD',unit:'học sinh',gen:()=>{const [a,b,c]=sel(TRI3),L=lcm3(a,b,c),r=ri(1,Math.min(a,b,c)-1),k=ri(Math.ceil(200/L),Math.floor(480/L)),x=k*L+r,lo=x-ri(3,L-3),hi=x+ri(3,L-3);return{stem:`Số học sinh khối 6 của một trường nhiều hơn ${lo} và ít hơn ${hi}. Khi xếp hàng ${a}, hàng ${b}, hàng ${c} đều thừa ${r} em. Tính số học sinh khối 6.`,ans:[x],exp:`Số học sinh trừ đi ${r} là bội chung của ${a}, ${b}, ${c}, tức là bội của BCNN(${a}, ${b}, ${c}) = ${L}. Trong khoảng đã cho chỉ có ${k} · ${L} + ${r} = ${x} thỏa mãn (${(k-1)*L+r} và ${(k+1)*L+r} nằm ngoài khoảng).`};}},
 {id:'h_tich',topic:'ts',level:'VD',unit:'',gen:()=>{const [a,b]=pairKind('gen',30,200),g=gcd(a,b),l=lcm(a,b);return{stem:`Hai số tự nhiên a và b có ƯCLN(a, b) = ${g} và BCNN(a, b) = ${l}. Biết a = ${a}. Tìm b.`,ans:[b],exp:`Với hai số tự nhiên khác 0 ta có a · b = ƯCLN(a, b) · BCNN(a, b). Do đó ${a} · b = ${g} · ${l} = ${g*l}, suy ra b = ${g*l} : ${a} = ${b}.`};}},
 {id:'h_chuong',topic:'tt',level:'VD',unit:'lần',gen:()=>{const [a,b,c]=sel(BELL),L=lcm3(a,b,c),H=ri(4,8),k=Math.floor(60*H/L);return{stem:`Ba chiếc chuông điện cùng reo lúc 6 giờ sáng. Sau đó chuông thứ nhất cứ ${a} phút reo một lần, chuông thứ hai cứ ${b} phút, chuông thứ ba cứ ${c} phút. Trong khoảng thời gian từ 6 giờ đến ${6+H} giờ (tính cả hai thời điểm này), có bao nhiêu lần cả ba chuông cùng reo?`,ans:[k+1],exp:`Ba chuông cùng reo sau mỗi BCNN(${a}, ${b}, ${c}) = ${L} phút. Từ 6 giờ đến ${6+H} giờ là ${60*H} phút, có ${k} lần cùng reo sau lúc 6 giờ (vì ${k} · ${L} = ${k*L} ≤ ${60*H}). Tính cả lúc 6 giờ là ${k+1} lần.`};}}
].map(q=>Object.assign({type:'sa'},q))};
const PISA=[
 ()=>{const [a,b,c]=sel(BUS),l2=lcm(a,b),L=lcm3(a,b,c),k=Math.floor(360/L),T0=330;
  return {title:'Bến xe buýt',ctx:`<p class="stem">Tại một bến xe buýt có ba tuyến cùng xuất bến chuyến đầu tiên lúc 5 giờ 30 phút. Khoảng cách giữa hai chuyến liên tiếp của mỗi tuyến cho trong bảng.</p>${tbl(['Tuyến','Cứ bao lâu có một chuyến'],[['01',a+' phút'],['02',b+' phút'],['03',c+' phút']])}`,qs:[
   saq('Sau ít nhất bao nhiêu phút kể từ 5 giờ 30 phút thì tuyến 01 và tuyến 02 lại cùng xuất bến?',l2,'phút',`Đó là BCNN(${a}, ${b}) = ${l2} phút.`,'tt','TH'),
   mcq('Lần tiếp theo cả ba tuyến cùng xuất bến là lúc mấy giờ?',gio(T0+L),[[gio(T0+l2),`Lúc đó mới có tuyến 01 và tuyến 02 cùng xuất bến; ${l2} không chia hết cho ${c} nên tuyến 03 chưa có xe.`],[gio(T0+a+b+c),'Cộng ba khoảng thời gian lại không cho thời điểm cùng xuất bến; phải tìm BCNN của ba số.'],[gio(T0+2*L),'Lúc đó ba tuyến cũng cùng xuất bến, nhưng chưa phải lần tiếp theo.']],`BCNN(${a}, ${b}, ${c}) = ${L} phút. Sau 5 giờ 30 phút ${L} phút là ${gio(T0+L)}.`,'tt','VD'),
   saq('Trong khoảng thời gian từ 5 giờ 30 phút đến 11 giờ 30 phút (tính cả hai thời điểm này), có bao nhiêu lần cả ba tuyến cùng xuất bến?',k+1,'lần',`Khoảng thời gian dài 360 phút. Cứ ${L} phút ba tuyến lại cùng xuất bến, nên sau 5 giờ 30 phút có ${k} lần (vì ${k} · ${L} = ${k*L} ≤ 360). Tính cả lúc 5 giờ 30 phút là ${k+1} lần.`,'tt','VD'),
   saq('Cũng trong khoảng thời gian đó, tuyến 01 có tất cả bao nhiêu chuyến xuất bến?',360/a+1,'chuyến',`360 : ${a} = ${360/a} chuyến sau chuyến đầu tiên. Tính cả chuyến lúc 5 giờ 30 phút là ${360/a+1} chuyến.`,'tt','VD')]};},
 ()=>{for(;;){const [a,b]=sel([[20,30],[30,40],[15,20],[20,25],[30,45],[25,40],[40,60]]),l=lcm(a,b),S=l*ri(2,4),R=l*ri(2,5);
   const w1=sel([3,5,7,9,11].map(t=>a*t).filter(x=>x%b)),w2=sel([3,5,7,9,11].map(t=>b*t).filter(x=>x%a)),w3=R+ri(1,4);
   if(!w1||!w2||new Set([R,w1,w2,w3]).size<4)continue;
   return {title:'Lát nền bằng gạch chữ nhật',ctx:`<p class="stem">Nhà bạn Minh lát nền bằng loại gạch hình chữ nhật có kích thước ${a} cm × ${b} cm. Thợ đặt các viên gạch cùng một hướng, khít nhau và không cắt gạch.</p>`,qs:[
   saq('Mảnh nền hình vuông nhỏ nhất lát kín được bằng loại gạch này có cạnh dài bao nhiêu xăng-ti-mét?',l,'cm',`Cạnh hình vuông phải chia hết cho cả ${a} và ${b}; nhỏ nhất là BCNN(${a}, ${b}) = ${l} cm.`,'tt','TH'),
   saq('Cần bao nhiêu viên gạch để lát kín mảnh nền hình vuông nhỏ nhất đó?',(l/a)*(l/b),'viên',`Mỗi hàng dọc theo cạnh ${a} cm xếp được ${l} : ${a} = ${l/a} viên, và có ${l} : ${b} = ${l/b} hàng. Cần ${l/a} · ${l/b} = ${(l/a)*(l/b)} viên.`,'tt','VD'),
   mcq('Độ dài nào dưới đây có thể là cạnh của một căn phòng hình vuông lát kín được bằng loại gạch này (cùng hướng, không cắt gạch)?',R+' cm',[[w1+' cm',`${w1} chia hết cho ${a} nhưng không chia hết cho ${b}.`],[w2+' cm',`${w2} chia hết cho ${b} nhưng không chia hết cho ${a}.`],[w3+' cm',`${w3} không chia hết cho ${a} và cũng không chia hết cho ${b}.`]],`Cạnh phòng phải là bội chung của ${a} và ${b}, tức là bội của ${l}. Chỉ có ${R} = ${l} · ${R/l} thỏa mãn.`,'tt','VD'),
   saq(`Phòng khách nhà Minh hình vuông có cạnh ${S} cm. Cần bao nhiêu viên gạch để lát kín phòng khách?`,(S/a)*(S/b),'viên',`${S} : ${a} = ${S/a} và ${S} : ${b} = ${S/b}. Cần ${S/a} · ${S/b} = ${(S/a)*(S/b)} viên.`,'tt','VD')]};}},
 ()=>{const [a,b]=sel([[2,3],[3,4],[2,5],[4,6],[3,5],[4,10],[6,9],[4,5]]),l=lcm(a,b),nA=Math.floor(30/a)+1,nC=Math.floor(30/l)+1;
  const days=s=>Array.from({length:Math.floor(30/s)+1},(_,i)=>1+i*s).join(', ');
  return {title:'Chăm sóc vườn rau của lớp',ctx:`<p class="stem">Trong tháng 3 (có 31 ngày), bạn An tưới vườn rau của lớp cứ ${a} ngày một lần, bạn Bình bón phân cứ ${b} ngày một lần. Ngày 1 tháng 3, cả hai bạn cùng làm.</p>`,qs:[
   saq('Lần tiếp theo hai bạn cùng làm là ngày bao nhiêu của tháng 3?',1+l,'',`Hai bạn lại cùng làm sau BCNN(${a}, ${b}) = ${l} ngày, tức là ngày 1 + ${l} = ${1+l} tháng 3.`,'tt','TH'),
   saq('Trong tháng 3, có bao nhiêu ngày hai bạn cùng làm?',nC,'ngày',`Cứ ${l} ngày hai bạn lại cùng làm. Các ngày đó là: ${days(l)}. Có ${nC} ngày.`,'tt','VD'),
   saq('Trong tháng 3, có bao nhiêu ngày chỉ có bạn An tưới rau mà bạn Bình không bón phân?',nA-nC,'ngày',`Bạn An tưới vào các ngày ${days(a)}: có ${nA} ngày. Trong đó có ${nC} ngày hai bạn cùng làm. Vậy có ${nA} − ${nC} = ${nA-nC} ngày chỉ có bạn An.`,'tt','VD')]};}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];

/* ============ Hình: dải các bội ============ */
function mstrip(a,b,N){
  const row=k=>{let s='';for(let x=0;x<=N;x+=k)s+=`<i class="${x%a===0&&x%b===0?'c':''}">${x}</i>`;return s;};
  const common=[];for(let x=0;x<=N;x++)if(x%a===0&&x%b===0)common.push(x);
  return `<div class="figbox ms" role="img" aria-label="Các bội của ${a} và ${b} đến ${N}. Bội chung là ${common.join(', ')}"><div class="r"><b>B(${a})</b>${row(a)}</div><div class="r"><b>B(${b})</b>${row(b)}</div><div class="small muted">Các số đậm, màu đỏ là bội chung: ${common.join(', ')}.</div></div>`;
}
const RECAP=[
  {k:'bc',fig:mstrip(4,6,36),extra:'BC(4, 6) gồm 0, 12, 24, 36, ...'},
  {k:'ts',fig:'<div class="figbox"><p>12 = 2<sup>2</sup> · 3</p><p>18 = 2 · 3<sup>2</sup></p><p>BCNN(12, 18) = 2<sup>2</sup> · 3<sup>2</sup> = 36</p></div>',extra:'Thừa số 2 lấy số mũ 2, thừa số 3 lấy số mũ 2.'},
  {k:'sy',fig:'<div class="figbox"><p>BCNN(4, 6) = 12</p><p>BC(4, 6) = {0; 12; 24; 36; ...}</p></div>',extra:'Các bội chung chính là các bội của 12.'},
  {k:'tt',fig:'<div class="figbox"><p>Trực nhật cứ 4 ngày và cứ 6 ngày một lần.</p><p>BCNN(4, 6) = 12: sau 12 ngày lại cùng trực.</p></div>',extra:'"Ít nhất" nghĩa là tìm bội chung nhỏ nhất.'}
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
 G(()=>{const [a,b,c]=sel([[4,6,8],[6,8,10],[3,4,5],[4,5,6],[6,9,12],[8,10,12],[10,12,15],[5,6,8],[4,6,9]]);
  const g=(x,y)=>{while(y){const t=x%y;x=y;y=t;}return x;},l2=(x,y)=>x/g(x,y)*y,l=l2(l2(a,b),c);
  const k=ri(2,Math.max(2,Math.floor(300/l)));const n=l*k;if(n<40||n>300)throw 0;
  const d1=ri(1,l-1),d2=ri(0,l-1-d1);let L=n-d1,H=n+d2;
  const d=sel([7,9,11,13].filter(x=>n%x));if(!d)throw 0;
  const isC=v=>v%a===0&&v%b===0&&v%c===0;
  const right=sel([2*l,3*l]),cand=[a*b,a+b+c,l+a,l/2,a*b*c+a,b*c].filter(v=>Number.isInteger(v)&&v>0&&!isC(v)&&v!==right);
  const w=pk([...new Set(cand)],3);if(w.length<3)throw 0;
  const why=v=>{const no=[a,b,c].filter(x=>v%x);return `${v} không chia hết cho ${no.join(' và ')}, nên không xếp được hàng ${no.join(' hoặc ')} người.`;};
  return {title:'Đội đồng diễn',ctx:P(`Một đội đồng diễn của trường có từ ${L} đến ${H} người. Khi xếp thành hàng ${a} người, hàng ${b} người hay hàng ${c} người thì đều vừa đủ, không thừa ai.`),qs:[
   A(`Tìm BCNN(${a}, ${b}, ${c}).`,l,'',`Phân tích ra thừa số nguyên tố rồi lấy các thừa số chung và riêng với số mũ lớn nhất, được BCNN(${a}, ${b}, ${c}) = ${l}.`,'ts','TH'),
   M('Nếu chưa xét điều kiện số người từ '+L+' đến '+H+', số nào sau đây có thể là số người của đội?',''+right,w.map(v=>[''+v,why(v)]),`Số người của đội phải là bội chung của ${a}, ${b} và ${c}, tức là bội của ${l}. ${right} = ${l} · ${right/l}.`,'sy','VD'),
   A('Đội đồng diễn có bao nhiêu người?',n,'người',`Số người là bội của ${l} và nằm trong khoảng từ ${L} đến ${H}. Các bội của ${l}: ...; ${n-l}; ${n}; ${n+l}; ... Chỉ có ${n} thỏa mãn.`,'tt','VD'),
   A(`Nếu xếp đội thành các hàng ${d} người thì xếp được nhiều nhất bao nhiêu hàng đủ ${d} người?`,Math.floor(n/d),'hàng',`${n} = ${d} · ${Math.floor(n/d)} + ${n%d}. Xếp được ${Math.floor(n/d)} hàng đủ ${d} người, còn thừa ${n%d} người.`,'tt','VD')]};})
);
}
/* ==== Toán thực tế bổ sung: kết thúc ==== */
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='bc6_seen';
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
  const mcSlots=[['bc',['NB']],['ts',['NB']],['ts',['TH']],['sy',['NB','TH']],['tt',['TH','VD']],[null,['VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>(!t||q.topic===t)&&l.includes(q.level)),used));
  const tf=['bc','ts','sy'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set();
  const mc=[
    pick(MC.filter(q=>q.topic==='ts'&&q.level==='NB'),used),
    pick(MC.filter(q=>q.topic==='ts'&&q.level==='TH'),used),
    pick(MC.filter(q=>q.topic==='sy'&&q.level!=='VD'),used),
    pick(MC.filter(q=>q.topic==='tt'&&q.level==='TH'),used)
  ];
  const sa=[pick(SA.filter(q=>q.topic==='ts'&&q.level!=='VD'),used),pick(SA.filter(q=>q.topic==='tt'&&q.level==='TH'),used)];
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
  s=String(s).trim();
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
