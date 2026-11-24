// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ thu-thap-phan-loai-du-lieu/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "thu-thap-phan-loai-du-lieu";
export const TIEN_TO = "DL7-";

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
const grp=x=>String(x).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^=h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const sum=a=>a.reduce((x,y)=>x+y,0);

/* ============ Dựng câu nhiều lựa chọn ============ */
function pickOpts(goodT,cands){
  const seen=new Set([goodT]),out=[];
  for(const c of cands){if(c&&!seen.has(c.t)){seen.add(c.t);out.push({t:c.t,err:c.err});}if(out.length===3)break;}
  return out;
}
const C=(t,err)=>({t,err});
const mk=(stem,good,cands,exp,meta,fig)=>({stem,fig,opts:[{t:good}].concat(pickOpts(good,cands)),ans:0,exp,meta});
const FB_MC=()=>({stem:'Dữ liệu nào sau đây là số liệu?',opts:[{t:'Cân nặng (kg) của các bạn trong lớp'},{t:'Tên các tỉnh, thành phố',err:'Tên tỉnh, thành phố không là số.'},{t:'Màu sắc yêu thích của các bạn',err:'Màu sắc không là số.'},{t:'Mức độ hài lòng: Rất hài lòng, Hài lòng, Chưa hài lòng',err:'Các mức đánh giá là chữ, không là số.'}],ans:0,exp:'Cân nặng được đo bằng số (kilôgam) nên là số liệu.',meta:{fb:1}});
function tryGen(f){
  for(let n=0;n<400;n++){const r=f();if(r&&r.opts.length===4&&new Set(r.opts.map(o=>o.t)).size===4)return r;}
  return FB_MC();
}

/* ============ Các loại dữ liệu và kho dãy dữ liệu ============ */
const KT={num:'Dữ liệu là số (số liệu, hay dữ liệu định lượng)',ord:'Dữ liệu không là số, có thể sắp thứ tự',nom:'Dữ liệu không là số, không thể sắp thứ tự'};
const KT_SHORT={num:'là số liệu',ord:'không là số và có thể sắp thứ tự',nom:'không là số và không thể sắp thứ tự'};
const NUMF=[
 {l:'Cân nặng (kg) của {n} bạn trong lớp',lo:38,hi:60},
 {l:'Chiều cao (cm) của {n} bạn trong tổ',lo:140,hi:168},
 {l:'Thời gian chạy 100 m (giây) của {n} bạn',lo:14,hi:22},
 {l:'Số bàn thắng một cầu thủ ghi được trong {n} mùa giải',lo:5,hi:40},
 {l:'Điểm kiểm tra Toán của {n} bạn',lo:4,hi:10},
 {l:'Số trang sách {n} bạn đọc được trong tuần',lo:20,hi:180},
 {l:'Nhiệt độ (°C) lúc 12 giờ trưa trong {n} ngày',lo:18,hi:36},
 {l:'Số tiền (nghìn đồng) {n} bạn ủng hộ quỹ lớp',lo:10,hi:100}
];
const NOMF=[
 {l:'Tên {n} tỉnh, thành phố',v:['Hà Nội','Hải Phòng','Đà Nẵng','Huế','Cần Thơ','Ninh Bình','Hưng Yên','Bắc Ninh','Thanh Hoá']},
 {l:'Màu sắc yêu thích của {n} bạn',v:['xanh','đỏ','vàng','tím','cam','trắng','hồng']},
 {l:'Món ăn yêu thích của {n} bạn',v:['phở','bún chả','cơm tấm','bánh mì','xôi','mì quảng']},
 {l:'Môn học yêu thích của {n} bạn',v:['Toán','Ngữ văn','Tiếng Anh','Tin học','Lịch sử','Mĩ thuật','Thể dục']},
 {l:'Vật nuôi yêu thích của {n} bạn',v:['chó','mèo','thỏ','hamster','cá cảnh','vẹt']},
 {l:'Phương tiện {n} bạn đi đến trường',v:['xe đạp','xe buýt','đi bộ','xe máy','ô tô']},
 {l:'Thể loại phim yêu thích của {n} bạn',v:['hành động','hoạt hình','hài','khoa học viễn tưởng','phiêu lưu']}
];
const ORDF=[
 {l:'Mức độ đồng ý của {n} bạn với ý kiến "Đọc sách là thói quen tốt"',v:['Rất đồng ý','Đồng ý','Không đồng ý','Rất không đồng ý']},
 {l:'Xếp loại học lực của {n} bạn',v:['Tốt','Khá','Đạt','Chưa đạt']},
 {l:'Đánh giá chất lượng dịch vụ của {n} khách hàng',v:['Rất tốt','Tốt','Trung bình','Kém']},
 {l:'Mức độ thường xuyên lên thư viện của {n} bạn',v:['Rất thường xuyên','Thường xuyên','Thỉnh thoảng','Không bao giờ']},
 {l:'Khả năng bơi của {n} bạn',v:['Bơi giỏi','Biết bơi','Chưa biết bơi']},
 {l:'Mức độ hài lòng của {n} bạn về bữa ăn bán trú',v:['Rất hài lòng','Hài lòng','Bình thường','Không hài lòng']}
];
const FAMS={num:NUMF,nom:NOMF,ord:ORDF};
function serOf(kind,avoid){
  const F=FAMS[kind];let i;
  for(let k=0;k<50;k++){i=ri(0,F.length-1);if(!avoid||!avoid.has(kind+i))break;}
  const f=F[i],fam=kind+i;let n,vals,t;
  if(kind==='num'){n=ri(4,5);const s=new Set();while(s.size<n)s.add(ri(f.lo,f.hi));vals=shuffle([...s]).map(String);t=f.l.replace('{n}',n)+': '+vals.join('; ');}
  else{n=Math.min(f.v.length,ri(3,4));vals=shuffle(f.v).slice(0,n);t=f.l.replace('{n}',n)+': '+vals.join(', ');}
  return {kind,fam,vals,t,scale:f.v};
}
function whyKind(s){
  if(s.kind==='num')return 'Các giá trị đều là số nên đây là số liệu (dữ liệu định lượng).';
  if(s.kind==='ord')return `Các giá trị không là số nhưng có thể sắp xếp theo thứ tự từ mức cao đến mức thấp (${s.scale.join(', ')}), nên đây là dữ liệu không là số, có thể sắp thứ tự.`;
  return 'Các giá trị là tên gọi, không là số và không có thứ bậc cao thấp nên không thể sắp thứ tự.';
}
function typeOpts(kind){
  if(kind==='num')return [C(KT.ord,'Các giá trị đều là số nên đây là số liệu.'),C(KT.nom,'Các giá trị đều là số nên đây là số liệu.'),C('Dữ liệu định tính','Dữ liệu định tính là dữ liệu không là số, còn các giá trị ở đây đều là số.')];
  if(kind==='ord')return [C(KT.num,'Các giá trị là chữ (các mức), không là số. Sắp thứ tự được không có nghĩa là số liệu.'),C(KT.nom,'Các mức này có thứ bậc từ cao đến thấp nên sắp thứ tự được.'),C('Dữ liệu định lượng','Dữ liệu định lượng là dữ liệu là số, còn các giá trị ở đây không là số.')];
  return [C(KT.num,'Các giá trị là tên gọi, không là số.'),C(KT.ord,'Các giá trị này không có thứ bậc cao thấp nên không thể sắp thứ tự.'),C('Dữ liệu định lượng','Dữ liệu định lượng là dữ liệu là số, còn các giá trị ở đây không là số.')];
}
const wKind=()=>sel(['num','ord','nom']);

/* ---- Kho cụm từ (dùng cho đúng sai, trả lời ngắn) ---- */
const PH={
 num:['cân nặng của các bạn trong lớp','chiều cao của các bạn trong tổ','thời gian chạy 100 m của các bạn','số bàn thắng của một cầu thủ qua các mùa giải','điểm kiểm tra Toán của các bạn','nhiệt độ lúc 12 giờ trưa trong một tuần','số trang sách các bạn đọc được trong tuần','số tiền các bạn ủng hộ quỹ lớp'],
 ord:['xếp loại học lực (Tốt, Khá, Đạt, Chưa đạt)','mức độ đồng ý với một ý kiến (Rất đồng ý, Đồng ý, Không đồng ý, Rất không đồng ý)','đánh giá chất lượng dịch vụ (Rất tốt, Tốt, Trung bình, Kém)','mức độ thường xuyên lên thư viện (Rất thường xuyên, Thường xuyên, Thỉnh thoảng, Không bao giờ)','khả năng bơi (Bơi giỏi, Biết bơi, Chưa biết bơi)','mức độ hài lòng (Rất hài lòng, Hài lòng, Chưa hài lòng)'],
 nom:['tên các tỉnh, thành phố','màu sắc yêu thích của các bạn','món ăn yêu thích của các bạn','môn học yêu thích của các bạn','vật nuôi yêu thích của các bạn','phương tiện các bạn đi đến trường','thể loại phim yêu thích của các bạn']
};
const phKind=p=>PH.num.includes(p)?'num':PH.ord.includes(p)?'ord':'nom';
const whyPh=k=>k==='num'?'Dữ liệu này được ghi bằng số nên là số liệu (dữ liệu định lượng).':k==='ord'?'Dữ liệu này không là số, nhưng các mức có thể sắp xếp theo thứ bậc nên sắp thứ tự được.':'Dữ liệu này không là số và không có thứ bậc cao thấp nên không thể sắp thứ tự.';

/* ---- Bảng nhiều cột ---- */
const COLS={
 num:[{h:'Tuổi',lo:11,hi:13},{h:'Cân nặng (kg)',lo:38,hi:58},{h:'Chiều cao (cm)',lo:140,hi:166},{h:'Số anh chị em',lo:0,hi:3},{h:'Điểm Toán',lo:5,hi:10}],
 ord:[{h:'Xếp loại',v:['Tốt','Khá','Đạt']},{h:'Ý kiến về môn Toán',v:['Thích','Bình thường','Không thích']},{h:'Mức độ hài lòng',v:['Rất hài lòng','Hài lòng','Chưa hài lòng']}],
 nom:[{h:'Họ tên',v:['An','Bình','Chi','Dũng','Hà','Lan','Minh','Nam','Yến']},{h:'Giới tính',v:['Nam','Nữ']},{h:'Quê quán',v:['Hà Nội','Thái Bình','Hưng Yên','Nghệ An']},{h:'Môn thích nhất',v:['Toán','Văn','Anh','Tin']}]
};
function pickCols(spec){ // spec: {num:a,ord:b,nom:c}
  const out=[];['num','ord','nom'].forEach(k=>{shuffle(COLS[k]).slice(0,spec[k]||0).forEach(c=>out.push(Object.assign({kind:k},c)));});
  return shuffle(out);
}
function colTable(cols,rows){
  const body=[];for(let r=0;r<rows;r++)body.push('<tr>'+cols.map(c=>'<td>'+(c.v?sel(c.v):ri(c.lo,c.hi))+'</td>').join('')+'</tr>');
  return `<div class="tablewrap"><table class="dt"><tr>${cols.map(c=>'<th>'+c.h+'</th>').join('')}</tr>${body.join('')}</table></div>`;
}
const colWhy=k=>k==='num'?'Các giá trị trong cột là số nên là số liệu.':k==='ord'?'Các giá trị không là số nhưng có thể sắp thứ bậc (từ mức cao đến thấp).':'Các giá trị là tên gọi, không là số và không có thứ bậc cao thấp.';

/* ============ Nội dung 1: Phân loại dữ liệu ============ */
function genPlType(){return tryGen(()=>{
  const kind=wKind(),s=serOf(kind);
  return mk(`Dãy dữ liệu sau thuộc loại nào?<br><i>${s.t}</i>`,KT[kind],typeOpts(kind),whyKind(s),{kind});
});}
function errWhich(tk,k){
  if(k==='num')return 'Các giá trị đều là số nên đây là số liệu, không phải dữ liệu không là số.';
  if(k==='ord')return tk==='num'?'Các giá trị là chữ (các mức đánh giá), không là số.':'Dãy này có thể sắp thứ tự nên không phải loại không sắp thứ tự được.';
  return tk==='num'?'Các giá trị là tên gọi, không là số.':'Các giá trị là tên gọi, không có thứ bậc cao thấp nên không thể sắp thứ tự.';
}
function genPlWhich(){return tryGen(()=>{
  const tk=wKind(),others=['num','ord','nom'].filter(k=>k!==tk),used=new Set();
  const g=serOf(tk,used);used.add(g.fam);const ws=[];
  for(let i=0;i<3;i++){const k=sel(others),s=serOf(k,used);used.add(s.fam);ws.push(C(s.t,errWhich(tk,k)));}
  const ask={num:'là dãy số liệu',ord:'không là số liệu và có thể sắp thứ tự',nom:'không là số liệu và không thể sắp thứ tự'}[tk];
  return mk(`Dãy dữ liệu nào sau đây ${ask}?`,g.t,ws,`${g.t.split(':')[0]}: ${whyKind(g)}`,{tk});
});}
function genPlTable(){return tryGen(()=>{
  const tk=sel(['num','ord']);
  const cols=pickCols(tk==='num'?{num:1,ord:1,nom:2}:{num:1,ord:1,nom:2});
  const good=cols.find(c=>c.kind===tk);
  const ws=cols.filter(c=>c!==good).map(c=>C(c.h,tk==='num'?(c.kind==='ord'?'Các giá trị là chữ (các mức), không là số.':'Các giá trị là tên gọi, không là số.'):(c.kind==='num'?'Các giá trị là số nên là số liệu, không phải dữ liệu không là số.':'Các giá trị không có thứ bậc cao thấp nên không thể sắp thứ tự.')));
  return mk(`Bảng dưới đây ghi lại thông tin của một số bạn. Cột nào là dữ liệu ${tk==='num'?'là số (số liệu)':'không là số và có thể sắp thứ tự'}?`,good.h,ws,`Cột «${good.h}»: ${colWhy(tk)}`,{tk},colTable(cols,3));
});}
const plS=['là số liệu','là dữ liệu định tính','là dữ liệu không là số và có thể sắp thứ tự','là dữ liệu không là số và không thể sắp thứ tự','là dữ liệu định lượng'];
function plItem(lv){
  const x=sel(PH.num.concat(PH.ord,PH.nom)),k=phKind(x),t=ri(0,lv==='VD'?4:3);
  const truth=[k==='num',k!=='num',k==='ord',k==='nom',k==='num'][t];
  return IT(`Dữ liệu về ${x} ${plS[t]}`,truth,'pl',lv,whyPh(k));
}
function plTableItems(){
  for(let n=0;n<80;n++){
    const cols=pickCols({num:1,ord:1,nom:2});
    const items=cols.map(c=>{const t=ri(0,2);const T=[c.kind==='num',c.kind==='ord',c.kind==='nom'][t];return IT(`Cột «${c.h}» ${['là số liệu','là dữ liệu không là số và có thể sắp thứ tự','là dữ liệu không là số và không thể sắp thứ tự'][t]}`,T,'pl','VD',colWhy(c.kind));});
    const k=items.filter(i=>i.v).length;
    if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return {stem:'Cho bảng thống kê sau. Xét các phát biểu:',fig:colTable(cols,3),items};
  }
  return null;
}
function saPlCnt(){
  const tk=wKind(),z=ri(2,3),others=['num','ord','nom'].filter(k=>k!==tk);
  const good=shuffle(PH[tk]).slice(0,z),pool=shuffle(PH[others[0]].concat(PH[others[1]])).slice(0,6-z);
  const all=shuffle(good.concat(pool));
  return {stem:`Cho các dữ liệu sau: ${all.map((p,i)=>`(${i+1}) ${p}`).join('; ')}.<br>Trong các dữ liệu đó, có bao nhiêu dữ liệu ${KT_SHORT[tk]}?`,ans:[z],exp:`Các dữ liệu ${KT_SHORT[tk]}: ${good.join('; ')}. Có ${z} dữ liệu.`,meta:{tk,z}};
}
function saPlCols(){
  const tk=sel(['num','ord','nom']),z=ri(1,2),rest=['num','ord','nom'];
  const spec={num:0,ord:0,nom:0};spec[tk]=z;
  let left=5-z;while(left>0){const k=sel(rest.filter(r=>r!==tk));const cap_={num:COLS.num.length,ord:COLS.ord.length,nom:COLS.nom.length};if(spec[k]<Math.min(2,cap_[k])){spec[k]++;left--;}}
  const cols=pickCols(spec);
  return {stem:`Bảng sau ghi lại thông tin của một số bạn. Có bao nhiêu cột ${KT_SHORT[tk]}?`,fig:colTable(cols,3),ans:[z],exp:`Các cột ${KT_SHORT[tk]}: ${cols.filter(c=>c.kind===tk).map(c=>'«'+c.h+'»').join('; ')}. Có ${z} cột.`,meta:{tk,z}};
}


/* ============ Nội dung 2: Thu thập dữ liệu ============ */
const QS={
 num:['Trung bình mỗi ngày bạn dành bao nhiêu giờ để xem ti vi?','Bạn cao bao nhiêu xentimét?','Mỗi ngày bạn dành bao nhiêu phút cho hoạt động thể thao?','Bạn có bao nhiêu anh chị em ruột?','Từ nhà đến trường bạn đi mất bao nhiêu phút?','Tuần vừa rồi bạn đã đọc bao nhiêu cuốn sách?'],
 nom:['Các chương trình ti vi bạn xem là gì?','Vật nuôi nào bạn yêu thích nhất?','Bạn đi đến trường bằng phương tiện gì?','Môn học nào bạn yêu thích nhất?','Màu sắc nào bạn thích nhất?','Bữa sáng bạn thường ăn món gì?'],
 ord:['Bạn có cho rằng các chương trình ti vi hiện nay rất hấp dẫn không? (Rất đồng ý, Đồng ý, Không đồng ý, Rất không đồng ý)','Bạn có thường xuyên lên thư viện trường không? (Rất thường xuyên, Thường xuyên, Thỉnh thoảng, Không bao giờ)','Bạn đánh giá thế nào về bữa ăn bán trú? (Rất tốt, Tốt, Trung bình, Kém)','Bạn có hài lòng với sân chơi của trường không? (Rất hài lòng, Hài lòng, Chưa hài lòng)']
};
const qKind=q=>QS.num.includes(q)?'num':QS.ord.includes(q)?'ord':'nom';
const whyQ=k=>k==='num'?'Câu trả lời là một số (số giờ, số phút, số lượng,...) nên dữ liệu thu được là số liệu.':k==='ord'?'Câu trả lời là một trong các mức có thứ bậc nên dữ liệu không là số và có thể sắp thứ tự.':'Câu trả lời là tên gọi, không là số và không có thứ bậc nên không thể sắp thứ tự.';
function genTtKind(){return tryGen(()=>{
  const k=wKind(),q=sel(QS[k]);
  return mk(`Khi phỏng vấn các bạn bằng câu hỏi: «${q}», dữ liệu thu được thuộc loại nào?`,KT[k],typeOpts(k),whyQ(k),{k});
});}
function genTtWhichQ(){return tryGen(()=>{
  const tk=wKind(),others=['num','ord','nom'].filter(k=>k!==tk);
  const g=sel(QS[tk]),ws=[];const used=new Set([g]);
  for(let i=0;i<3;i++){let q,k;for(let n=0;n<40;n++){k=sel(others);q=sel(QS[k]);if(!used.has(q))break;}used.add(q);ws.push(C(q,'Câu hỏi này cho '+({num:'dữ liệu là số (số liệu)',ord:'dữ liệu không là số, có thể sắp thứ tự',nom:'dữ liệu không là số, không thể sắp thứ tự'})[k]+'.'));}
  const ask={num:'dãy số liệu',ord:'dữ liệu không là số và có thể sắp thứ tự',nom:'dữ liệu không là số và không thể sắp thứ tự'}[tk];
  return mk(`Muốn thu được ${ask}, ta nên phỏng vấn bằng câu hỏi nào?`,g,ws,whyQ(tk),{tk});
});}
const METH=['Phỏng vấn hoặc lập phiếu hỏi','Quan sát và ghi chép trực tiếp','Làm thí nghiệm','Tìm trong nguồn có sẵn (sách báo, internet)'];
const SCN=[
 {s:'ý kiến của các bạn lớp 7A về môn học yêu thích',m:0},{s:'mức độ hài lòng của khách hàng về một quán ăn',m:0},{s:'thói quen đọc sách của học sinh trong trường',m:0},
 {s:'số xe máy đi qua một ngã tư trong 15 phút',m:1},{s:'số khách bước vào một cửa hàng từ 8 giờ đến 9 giờ',m:1},{s:'số học sinh đi học muộn của trường trong một tuần',m:1},
 {s:'chiều cao của một cây đậu sau mỗi ngày trong 7 ngày gieo hạt',m:2},{s:'thời gian một viên đá tan hết trong các cốc nước có nhiệt độ khác nhau',m:2},{s:'số lần xuất hiện mặt sấp khi tung đồng xu 50 lần',m:2},
 {s:'diện tích của các tỉnh, thành phố ở Việt Nam',m:3},{s:'số huy chương vàng của Việt Nam tại một kì SEA Games',m:3},{s:'số dân của các nước Đông Nam Á',m:3}
];
const METH_ERR=[
 ['','Ý kiến của mỗi người không thể nhìn thấy khi quan sát mà cần hỏi trực tiếp hoặc lập phiếu hỏi.','Đây không phải là hiện tượng cần làm thí nghiệm mà là ý kiến cần hỏi.','Sách báo, internet không có ý kiến riêng của các bạn.'],
 ['Không thể hỏi hết mọi người đi qua; cần quan sát và đếm trực tiếp.','','Đây là sự việc diễn ra tự nhiên, không phải làm thí nghiệm.','Số liệu này chưa có sẵn trong sách báo, internet; cần tự quan sát và ghi lại.'],
 ['Hỏi ý kiến không cho kết quả đo đạc cụ thể của thí nghiệm.','Cần chủ động tạo ra tình huống và theo dõi kết quả, đó là làm thí nghiệm.','','Kết quả thí nghiệm do ta tự thực hiện và ghi lại, không có sẵn trong sách báo.'],
 ['Số liệu này đã có sẵn trong sách báo, internet nên không cần đi hỏi từng người.','Không thể tự quan sát trực tiếp số liệu này; nên tra cứu từ nguồn có sẵn.','Đây không phải thí nghiệm; số liệu có sẵn trong nguồn tài liệu.','']
];
function genTtMethod(){return tryGen(()=>{
  const sc=sel(SCN),ws=[0,1,2,3].filter(i=>i!==sc.m).map(i=>C(METH[i],METH_ERR[sc.m][i]));
  return mk(`Để thu thập dữ liệu về ${sc.s}, cách làm phù hợp nhất là:`,METH[sc.m],shuffle(ws),`Để biết ${sc.s}, nên ${METH[sc.m].toLowerCase()}.`,{sc:sc.s});
});}
function ttItem(lv){
  const t=ri(0,lv==='VD'?3:2);
  if(t===0){const q=sel(QS.num.concat(QS.nom,QS.ord)),k=qKind(q);return IT(`Câu hỏi «${q}» cho dữ liệu là số liệu`,k==='num','tt',lv,whyQ(k));}
  if(t===1){const q=sel(QS.num.concat(QS.nom,QS.ord)),k=qKind(q);return IT(`Câu hỏi «${q}» cho dữ liệu không là số và có thể sắp thứ tự`,k==='ord','tt',lv,whyQ(k));}
  const sc=sel(SCN),ok=RNG()<.5,mi=ok?sc.m:sel([0,1,2,3].filter(i=>i!==sc.m));
  return IT(`Để thu thập dữ liệu về ${sc.s}, nên dùng cách: ${METH[mi].toLowerCase()}`,ok,'tt',lv,ok?`Đúng: để biết ${sc.s}, nên ${METH[sc.m].toLowerCase()}.`:`Chưa phù hợp. ${METH_ERR[sc.m][mi]} Cách phù hợp là ${METH[sc.m].toLowerCase()}.`);
}
function saTtCnt(){
  const tk=wKind(),z=ri(2,4),others=['num','ord','nom'].filter(k=>k!==tk);
  const good=shuffle(QS[tk]).slice(0,z),pool=shuffle(QS[others[0]].concat(QS[others[1]])).slice(0,6-z);
  const all=shuffle(good.concat(pool));
  return {stem:`Một phiếu phỏng vấn gồm các câu hỏi:<br>${all.map((q,i)=>`(${i+1}) ${q}`).join('<br>')}<br>Trong các câu hỏi đó, có bao nhiêu câu cho dữ liệu ${KT_SHORT[tk]}?`,ans:[z],exp:`Các câu cho dữ liệu ${KT_SHORT[tk]}: ${good.map(q=>'«'+q.split(' (')[0]+'»').join('; ')}. Có ${z} câu.`,meta:{tk,z}};
}


/* ============ Nội dung 3: Bảng thống kê ============ */
const TB=[
 {head:'Loại nước uống',noun:'loại nước',row:'Số người chọn',unit:'người',act:'chọn',ctx:'Một cửa hàng nước hoa quả khảo sát loại nước khách hàng ưa chuộng.',cats:['Nước cam','Nước dứa','Nước chanh','Nước ổi','Nước dừa']},
 {head:'Thể loại phim',noun:'thể loại phim',row:'Số bạn thích',unit:'bạn',act:'thích',ctx:'Lớp trưởng khảo sát thể loại phim được yêu thích của các bạn lớp 7A.',cats:['Hành động','Khoa học viễn tưởng','Hoạt hình','Hài','Phiêu lưu']},
 {head:'Món ăn',noun:'món ăn',row:'Số học sinh thích',unit:'học sinh',act:'thích',ctx:'Nhà trường khảo sát món ăn yêu thích của học sinh để lên thực đơn bán trú.',cats:['Phở','Bánh mì','Bún chả','Xôi','Cơm tấm']},
 {head:'Môn thể thao',noun:'môn thể thao',row:'Số bạn chọn',unit:'bạn',act:'chọn',ctx:'Câu lạc bộ thể thao khảo sát môn thể thao các bạn muốn tham gia.',cats:['Bóng đá','Cầu lông','Bơi','Bóng bàn','Cờ vua']},
 {head:'Nghề nghiệp',noun:'nghề',row:'Số bạn chọn',unit:'bạn',act:'chọn',ctx:'Cô giáo chủ nhiệm khảo sát nghề nghiệp mong muốn trong tương lai của các bạn trong lớp.',cats:['Bác sĩ','Giáo viên','Kĩ sư','Nghệ sĩ','Nghề khác']},
 {head:'Vật nuôi',noun:'vật nuôi',row:'Số bạn thích',unit:'bạn',act:'thích',ctx:'Một nhóm học sinh khảo sát vật nuôi yêu thích của các bạn trong khối 7.',cats:['Chó','Mèo','Thỏ','Cá cảnh','Hamster']},
 {head:'Loại kem',noun:'loại kem',row:'Số khách chọn',unit:'khách',act:'chọn',ctx:'Một cửa hàng kem ghi lại loại kem khách chọn trong một buổi chiều.',cats:['Dâu','Vani','Sôcôla','Sầu riêng','Đậu xanh']}
];
function tabData(){
  const T=sel(TB),n=ri(4,5),cats=shuffle(T.cats).slice(0,n);let v;
  do{v=cats.map(()=>ri(3,24));}while(new Set(v).size<n);
  return {T,cats,v};
}
const tabHTML=D=>`<div class="tablewrap"><table class="dt"><tr><th>${D.T.head}</th>${D.cats.map(c=>'<th>'+c+'</th>').join('')}</tr><tr><td>${D.T.row}</td>${D.v.map(x=>'<td>'+x+'</td>').join('')}</tr></table></div>`;
const tabMx=D=>D.v.indexOf(Math.max(...D.v)),tabMn=D=>D.v.indexOf(Math.min(...D.v));
const lead=D=>`${D.T.ctx} Dựa vào bảng thống kê dưới đây, `;
function genBtTotal(){return tryGen(()=>{
  const D=tabData(),S=sum(D.v),mx=Math.max(...D.v),mn=Math.min(...D.v);
  const cs=[C(S-mn,'Đã bỏ sót một cột trong bảng, chưa cộng hết các số.'),C(S+mx,'Đã cộng thừa: số lớn nhất bị cộng hai lần.'),C(mx,'Đây là số lớn nhất trong bảng, không phải tổng.'),C(S+mn,'Đã cộng thừa: một số bị cộng hai lần.')];
  return mk(lead(D)+`hãy cho biết có tất cả bao nhiêu ${D.T.unit} tham gia khảo sát.`,String(S),cs.map(c=>C(String(c.t),c.err)),`Tổng số ${D.T.unit} tham gia khảo sát bằng tổng các số trong bảng: ${D.v.join(' + ')} = ${S}.`,{},tabHTML(D));
});}
function genBtMax(){return tryGen(()=>{
  const D=tabData(),i=tabMx(D),mx=D.v[i];
  const ws=D.cats.map((c,j)=>j===i?null:C(c,`«${c}» chỉ có ${D.v[j]} ${D.T.unit}, ít hơn «${D.cats[i]}» (${mx} ${D.T.unit}).`)).filter(Boolean);
  return mk(lead(D)+`${D.T.noun} nào có nhiều ${D.T.unit} ${D.T.act} nhất?`,D.cats[i],shuffle(ws),`Số lớn nhất trong bảng là ${mx}, ứng với «${D.cats[i]}».`,{},tabHTML(D));
});}
function genBtMin(){return tryGen(()=>{
  const D=tabData(),i=tabMn(D),mn=D.v[i];
  const ws=D.cats.map((c,j)=>j===i?null:C(c,`«${c}» có ${D.v[j]} ${D.T.unit}, nhiều hơn «${D.cats[i]}» (${mn} ${D.T.unit}).`)).filter(Boolean);
  return mk(lead(D)+`${D.T.noun} nào có ít ${D.T.unit} ${D.T.act} nhất?`,D.cats[i],shuffle(ws),`Số nhỏ nhất trong bảng là ${mn}, ứng với «${D.cats[i]}».`,{},tabHTML(D));
});}
function genBtRows(){return tryGen(()=>{
  const D=tabData();
  return mk('Trong bảng thống kê dưới đây, dữ liệu ở dòng nào là số liệu?',D.T.row,[C(D.T.head,`Dòng «${D.T.head}» ghi tên gọi, không là số.`),C('Cả hai dòng','Dòng đầu ghi tên gọi, không là số nên không phải số liệu.'),C('Không dòng nào','Dòng «'+D.T.row+'» ghi các số lượng nên là số liệu.')],`Dòng «${D.T.row}» ghi các số lượng nên là số liệu; dòng «${D.T.head}» ghi tên gọi nên là dữ liệu không là số.`,{},tabHTML(D));
});}
function genBtDiff(){return tryGen(()=>{
  const D=tabData(),idx=shuffle(D.cats.map((_,i)=>i)),a=idx[0],b=idx[1];
  const hi=D.v[a]>D.v[b]?a:b,lo=hi===a?b:a,d=D.v[hi]-D.v[lo];
  const cs=[C(D.v[hi]+D.v[lo],'Đã cộng hai số; muốn biết nhiều hơn bao nhiêu thì phải trừ.'),C(D.v[hi],`Đây là số ${D.T.unit} của «${D.cats[hi]}», chưa trừ đi số của «${D.cats[lo]}».`),C(d+1,'Kết quả của phép trừ không cần cộng thêm 1.'),C(Math.max(1,d-1),'Hãy trừ lại cẩn thận.')];
  return mk(lead(D)+`số ${D.T.unit} ${D.T.act} «${D.cats[hi]}» nhiều hơn số ${D.T.unit} ${D.T.act} «${D.cats[lo]}» bao nhiêu?`,String(d),cs.map(c=>C(String(c.t),c.err)),`${D.v[hi]} − ${D.v[lo]} = ${d}.`,{},tabHTML(D));
});}
function genBtMore(){return tryGen(()=>{
  const D=tabData(),i=tabMx(D),j=tabMn(D),mx=D.v[i],mn=D.v[j],g=mx-mn+1;
  const cs=[C(String(mx-mn),'Thêm đúng ' +(mx-mn)+' thì hai số mới bằng nhau, chưa vượt.'),C(String(mx),'Đây là số của «'+D.cats[i]+'», không phải số cần thêm.'),C(String(g+1),'Con số này nhiều hơn mức cần thiết; chỉ cần vượt là đủ.'),C(String(mx+mn),'Đã cộng hai số; cần so sánh hiệu của hai số.')];
  return mk(lead(D)+`cần thêm ít nhất bao nhiêu ${D.T.unit} ${D.T.act} «${D.cats[j]}» để số ${D.T.unit} ${D.T.act} «${D.cats[j]}» vượt số ${D.T.unit} ${D.T.act} «${D.cats[i]}» (giữ nguyên số của «${D.cats[i]}»)?`,String(g),cs,`Hiện «${D.cats[j]}» có ${mn}, «${D.cats[i]}» có ${mx}. Thêm ${mx-mn} thì bằng nhau (${mx}); phải thêm ${g} thì mới vượt.`,{},tabHTML(D));
});}
function rawTally(nc,total){
  for(;;){
    const T=sel(TB),cats=shuffle(T.cats).slice(0,nc),cnt=cats.map(()=>0),list=[];
    for(let k=0;k<total;k++){const i=ri(0,nc-1);cnt[i]++;list.push(cats[i]);}
    if(new Set(cnt).size===nc&&Math.min(...cnt)>=2)return {T,cats,cnt,list};
  }
}
function genBtTally(){return tryGen(()=>{
  const R=rawTally(3,ri(12,16)),txt=cnt=>R.cats.map((c,i)=>`${c}: ${cnt[i]}`).join('; ');
  const good=txt(R.cnt),cs=[];
  const perms=[[1,0,2],[0,2,1],[2,1,0],[1,2,0],[2,0,1]];
  perms.forEach(p=>cs.push(C(txt(p.map(i=>R.cnt[i])),'Có số lần xuất hiện bị ghi nhầm cho loại khác; hãy đếm lại từng loại.')));
  const off=(a,b)=>{const c=R.cnt.slice();c[a]++;c[b]--;return c;};
  cs.push(C(txt(off(0,1)),'Đếm lệch một lần; hãy đếm lại thật cẩn thận.'));cs.push(C(txt(off(2,0)),'Đếm lệch một lần; hãy đếm lại thật cẩn thận.'));
  return mk(`${R.T.ctx} Kết quả (mỗi ${R.T.unit} chọn một ${R.T.noun}, ghi lần lượt): ${R.list.join(', ')}.<br>Bảng thống kê nào sau đây đúng?`,good,shuffle(cs),`Đếm số lần xuất hiện của từng giá trị: ${good}. Tổng ${sum(R.cnt)} bằng số ${R.T.unit} tham gia.`,{R});
});}
/* đúng sai về một bảng */
function btItems(D){
  const S=sum(D.v),idx=shuffle(D.cats.map((_,i)=>i)),a=idx[0],b=idx[1],c=idx[2];
  const mk1=[],U=D.T.unit,A=D.T.act;
  const j=ri(0,1)?1:-1;
  mk1.push(()=>{const ok=RNG()<.5,x=ok?S:S+sel([-3,-2,2,3,5]);return IT(`Có tất cả ${x} ${U} tham gia khảo sát`,ok,'bt','TH',`Tổng số là ${D.v.join(' + ')} = ${S}.`);});
  mk1.push(()=>{const k=ri(0,D.cats.length-1),ok=k===tabMx(D);return IT(`«${D.cats[k]}» có nhiều ${U} ${A} nhất`,ok,'bt','TH',ok?`«${D.cats[k]}» có ${D.v[k]}, là số lớn nhất trong bảng.`:`«${D.cats[k]}» có ${D.v[k]}, còn số lớn nhất là ${Math.max(...D.v)} (của «${D.cats[tabMx(D)]}»).`);});
  mk1.push(()=>{const k=ri(0,D.cats.length-1),ok=k===tabMn(D);return IT(`«${D.cats[k]}» có ít ${U} ${A} nhất`,ok,'bt','TH',ok?`«${D.cats[k]}» có ${D.v[k]}, là số nhỏ nhất trong bảng.`:`«${D.cats[k]}» có ${D.v[k]}, còn số nhỏ nhất là ${Math.min(...D.v)} (của «${D.cats[tabMn(D)]}»).`);});
  mk1.push(()=>{const ok=RNG()<.5,x=D.v[a]>D.v[b]?'nhiều hơn':'ít hơn',y=x==='nhiều hơn'?'ít hơn':'nhiều hơn';return IT(`Số ${U} ${A} «${D.cats[a]}» ${ok?x:y} số ${U} ${A} «${D.cats[b]}»`,ok,'bt','TH',`«${D.cats[a]}» có ${D.v[a]}, «${D.cats[b]}» có ${D.v[b]}; vậy số ${U} ${A} «${D.cats[a]}» ${x} số ${U} ${A} «${D.cats[b]}».`);});
  mk1.push(()=>{const ok=RNG()<.5,s2=D.v[a]+D.v[b],x=ok?s2:s2+sel([-2,-1,1,2,4]);return IT(`Số ${U} ${A} «${D.cats[a]}» và «${D.cats[b]}» cộng lại là ${x}`,ok,'bt','VD',`${D.v[a]} + ${D.v[b]} = ${s2}.`);});
  mk1.push(()=>{const ok=RNG()<.5,t3=D.v[a]+D.v[b];const cmp=t3>D.v[c]?'nhiều hơn':(t3<D.v[c]?'ít hơn':'bằng');if(cmp==='bằng')return null;const y=cmp==='nhiều hơn'?'ít hơn':'nhiều hơn';return IT(`Tổng số ${U} ${A} «${D.cats[a]}» và «${D.cats[b]}» ${ok?cmp:y} số ${U} ${A} «${D.cats[c]}»`,ok,'bt','VD',`${D.v[a]} + ${D.v[b]} = ${t3}, còn «${D.cats[c]}» có ${D.v[c]}; vậy tổng ${cmp} số ${U} ${A} «${D.cats[c]}».`);});
  mk1.push(()=>{const ok=RNG()<.5;return IT(`Dòng «${ok?D.T.row:D.T.head}» là dòng số liệu`,ok,'bt','TH',ok?`Dòng «${D.T.row}» ghi các số lượng nên là số liệu.`:`Dòng «${D.T.head}» ghi tên gọi nên không là số liệu.`);});
  return mk1;
}
function btTF(lv){return ()=>{
  for(let n=0;n<80;n++){
    const D=tabData(),fs=btItems(D),pool=lv==='VD'?[fs[4],fs[5],fs[3],fs[0],fs[1],fs[2]]:[fs[0],fs[1],fs[2],fs[3],fs[6]];
    const items=shuffle(pool).slice(0,4).map(f=>f());
    if(items.some(i=>!i))continue;
    const k=items.filter(i=>i.v).length;
    if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return {stem:`${D.T.ctx} Dựa vào bảng thống kê dưới đây, xét các phát biểu sau:`,fig:tabHTML(D),items};
  }
  return null;
};}
/* trả lời ngắn */
function saBtTotal(){const D=tabData(),S=sum(D.v);return {stem:lead(D)+`hãy cho biết có tất cả bao nhiêu ${D.T.unit} tham gia khảo sát.`,fig:tabHTML(D),ans:[S],exp:`${D.v.join(' + ')} = ${S}.`,meta:{}};}
function saBtDiff(){const D=tabData(),i=tabMx(D),j=tabMn(D),d=D.v[i]-D.v[j];return {stem:lead(D)+`số ${D.T.unit} ${D.T.act} «${D.cats[i]}» nhiều hơn số ${D.T.unit} ${D.T.act} «${D.cats[j]}» bao nhiêu?`,fig:tabHTML(D),ans:[d],exp:`${D.v[i]} − ${D.v[j]} = ${d}.`,meta:{}};}
function saBtTop2(){const D=tabData(),s=D.v.slice().sort((x,y)=>y-x),t=s[0]+s[1];return {stem:lead(D)+`hai ${D.T.noun} có nhiều ${D.T.unit} ${D.T.act} nhất có tất cả bao nhiêu ${D.T.unit} ${D.T.act}?`,fig:tabHTML(D),ans:[t],exp:`Hai số lớn nhất là ${s[0]} và ${s[1]}; ${s[0]} + ${s[1]} = ${t}.`,meta:{}};}
function saBtTally(){
  const R=rawTally(3,ri(18,24)),k=ri(0,2);
  return {stem:`${R.T.ctx} Kết quả (mỗi ${R.T.unit} chọn một ${R.T.noun}, ghi lần lượt): ${R.list.join(', ')}.<br>Có bao nhiêu ${R.T.unit} ${R.T.act} «${R.cats[k]}»?`,ans:[R.cnt[k]],exp:`Đếm số lần «${R.cats[k]}» xuất hiện trong dãy: ${R.cnt[k]} lần.`,meta:{R}};
}
const ACTS=['Bóng đá','Cầu lông','Bơi','Bóng bàn','Cờ vua'];
function twoWay(){
  for(;;){
    const acts=shuffle(ACTS).slice(0,3),m=acts.map(()=>ri(2,14)),f=acts.map(()=>ri(2,14));
    const tot=acts.map((_,i)=>m[i]+f[i]);
    if(new Set(tot).size===3&&sum(m)>sum(f))return {acts,m,f,tot};
  }
}
const twHTML=W=>`<div class="tablewrap"><table class="dt"><tr><th>Hoạt động</th>${W.acts.map(a=>'<th>'+a+'</th>').join('')}</tr><tr><td>Số bạn nam</td>${W.m.map(x=>'<td>'+x+'</td>').join('')}</tr><tr><td>Số bạn nữ</td>${W.f.map(x=>'<td>'+x+'</td>').join('')}</tr></table></div>`;
function saBtTwoWay(){
  const W=twoWay(),t=ri(0,2),ctx='Câu lạc bộ thể thao thống kê số bạn nam và số bạn nữ đăng kí mỗi hoạt động (mỗi bạn chỉ đăng kí một hoạt động). ';
  if(t===0)return {stem:ctx+'Có tất cả bao nhiêu bạn đăng kí?',fig:twHTML(W),ans:[sum(W.m)+sum(W.f)],exp:`Số bạn nam: ${W.m.join(' + ')} = ${sum(W.m)}; số bạn nữ: ${W.f.join(' + ')} = ${sum(W.f)}. Tổng: ${sum(W.m)+sum(W.f)}.`,meta:{t}};
  if(t===1)return {stem:ctx+'Hoạt động có nhiều bạn đăng kí nhất (cả nam và nữ) có bao nhiêu bạn đăng kí?',fig:twHTML(W),ans:[Math.max(...W.tot)],exp:`Mỗi hoạt động: ${W.acts.map((a,i)=>`${a}: ${W.m[i]} + ${W.f[i]} = ${W.tot[i]}`).join('; ')}. Lớn nhất là ${Math.max(...W.tot)}.`,meta:{t}};
  return {stem:ctx+'Tổng số bạn nam nhiều hơn tổng số bạn nữ bao nhiêu bạn?',fig:twHTML(W),ans:[sum(W.m)-sum(W.f)],exp:`Tổng nam: ${sum(W.m)}, tổng nữ: ${sum(W.f)}; ${sum(W.m)} − ${sum(W.f)} = ${sum(W.m)-sum(W.f)}.`,meta:{t}};
}
function saBtMissing(){
  const D=tabData(),k=ri(0,D.cats.length-1),S=sum(D.v);
  const cells=D.v.map((x,i)=>i===k?'<td><b>?</b></td>':'<td>'+x+'</td>').join('');
  const fig=`<div class="tablewrap"><table class="dt"><tr><th>${D.T.head}</th>${D.cats.map(c=>'<th>'+c+'</th>').join('')}</tr><tr><td>${D.T.row}</td>${cells}</tr></table></div>`;
  return {stem:`${D.T.ctx} Có tất cả ${S} ${D.T.unit} tham gia khảo sát, nhưng một ô trong bảng bị mờ (dấu ?). Tìm số ở ô đó.`,fig,ans:[D.v[k]],exp:`Tổng của các ô còn lại là ${sum(D.v)-D.v[k]}. Số ở ô dấu ? là ${S} − ${sum(D.v)-D.v[k]} = ${D.v[k]}.`,meta:{}};
}


/* ============ Nội dung 4: Tính đại diện của dữ liệu ============ */
const SC=[
 {s:'Nhà trường muốn biết mức độ thường xuyên lên thư viện của học sinh toàn trường.',g:'biết mức độ thường xuyên lên thư viện của học sinh toàn trường',ok:'Cách này chọn ngẫu nhiên học sinh ở nhiều lớp, nhiều khối nên có thể đại diện cho toàn trường.',
  goods:['Chọn ngẫu nhiên 10 bạn ở mỗi lớp để phát phiếu khảo sát','Đánh số danh sách học sinh toàn trường rồi chọn ngẫu nhiên 100 bạn để khảo sát','Chọn ngẫu nhiên một số bạn ở mỗi khối lớp để phát phiếu khảo sát'],
  bads:[['Chỉ phát phiếu cho các bạn đang ngồi đọc sách ở thư viện','Các bạn đang ở thư viện thường lên thư viện nhiều hơn các bạn khác, kết quả bị lệch và không đại diện cho toàn trường.'],['Chỉ phát phiếu cho các bạn trong câu lạc bộ Văn học','Chỉ một nhóm bạn có chung sở thích, không đại diện cho toàn trường.'],['Chỉ phát phiếu cho học sinh khối 6','Thiếu học sinh các khối 7, 8, 9 nên không đại diện cho toàn trường.']]},
 {s:'Giáo viên thể dục muốn đánh giá thể lực của học sinh toàn trường.',g:'đánh giá thể lực của học sinh toàn trường',ok:'Cách này lấy các bạn được chọn ngẫu nhiên trong toàn trường nên có thể đại diện.',
  goods:['Chọn ngẫu nhiên một số bạn ở mỗi lớp cho chạy cự li 1 000 m','Bốc thăm chọn học sinh ở tất cả các khối lớp rồi cho chạy cự li 1 000 m','Đánh số học sinh toàn trường rồi chọn ngẫu nhiên 60 bạn cho chạy cự li 1 000 m'],
  bads:[['Chỉ cho các bạn trong câu lạc bộ bóng đá chạy','Các bạn tập bóng đá thường có thể lực tốt hơn các bạn khác, không đại diện cho cả trường.'],['Chỉ cho các bạn đăng kí thi đấu thể thao của trường chạy','Đây là nhóm bạn có thể lực tốt, không đại diện cho cả trường.'],['Chỉ cho các bạn nam khối 9 chạy','Thiếu các bạn nữ và học sinh các khối khác.']]},
 {s:'Một hãng hàng không muốn đánh giá mức độ hài lòng của hành khách trên một chuyến bay.',g:'đánh giá mức độ hài lòng của hành khách trên một chuyến bay',ok:'Cách này không bỏ sót khoang nào và chọn hành khách ngẫu nhiên nên có thể đại diện cho cả chuyến bay.',
  goods:['Đánh số ngẫu nhiên 100 hành khách rồi xin ý kiến của các hành khách số 5; 10; 15; ...; 100','Chọn ngẫu nhiên hành khách ở cả khoang hạng thương gia và khoang hạng phổ thông','Bốc thăm số ghế rồi xin ý kiến của các hành khách ngồi ở những ghế được chọn'],
  bads:[['Chỉ xin ý kiến của 20 hành khách ở khoang hạng thương gia','Hành khách hạng phổ thông không được tham gia khảo sát nên không đại diện cho cả chuyến bay.'],['Chỉ xin ý kiến của các hành khách là người quen của tiếp viên','Chọn theo quan hệ quen biết thì không ngẫu nhiên, kết quả dễ bị lệch.'],['Chỉ xin ý kiến của các hành khách đang làm việc trên máy tính xách tay','Đây chỉ là một nhóm hành khách nhất định, không đại diện cho tất cả.']]},
 {s:'Một nhóm nghiên cứu muốn biết trung bình mỗi hộ trong khu dân cư có 5 000 hộ có bao nhiêu ti vi.',g:'biết trung bình mỗi hộ trong khu dân cư có 5 000 hộ có bao nhiêu ti vi',ok:'Cách này lấy các hộ trải đều hoặc ngẫu nhiên trong toàn khu nên có thể đại diện.',
  goods:['Đánh số các hộ từ 1 đến 5 000 rồi ghi số ti vi của các hộ số 1; 11; 21; ...; 4 991','Bốc thăm ngẫu nhiên 200 hộ trong danh sách cư dân để hỏi','Chọn ngẫu nhiên một số hộ ở mỗi tổ dân phố để hỏi'],
  bads:[['Chỉ hỏi các hộ ở ngay đầu ngõ','Chỉ một vị trí trong khu dân cư, không đại diện cho cả khu.'],['Chỉ hỏi các hộ có kinh doanh bán đồ điện tử','Nhóm hộ này thường có nhiều ti vi hơn các hộ khác, không đại diện.'],['Chỉ hỏi các hộ có người cao tuổi','Chỉ một nhóm hộ nhất định, không đại diện cho cả khu dân cư.']]},
 {s:'Một bạn muốn biết các học sinh trong trường thuận tay phải hay thuận tay trái.',g:'biết các học sinh trong trường thuận tay phải hay thuận tay trái',ok:'Cách này chọn ngẫu nhiên học sinh từ nhiều lớp nên có thể đại diện cho cả trường.',
  goods:['Chọn ngẫu nhiên một số bạn ở mỗi lớp rồi quan sát tay viết của các bạn','Bốc thăm chọn 5 bạn ở mỗi lớp rồi hỏi tay thuận','Đánh số học sinh toàn trường rồi chọn ngẫu nhiên 100 bạn để hỏi tay thuận'],
  bads:[['Chỉ quan sát các bạn ngồi bàn đầu của lớp 6A','Chỉ một nhóm nhỏ trong một lớp, không đại diện cho toàn trường.'],['Chỉ hỏi 3 bạn trong tổ của mình','Quá ít và chỉ trong nhóm bạn quen biết, không đại diện cho toàn trường.'],['Chỉ hỏi các bạn khối 7','Thiếu học sinh các khối còn lại.']]},
 {s:'Nhà trường muốn biết thời gian sử dụng Internet vào hai ngày cuối tuần của học sinh toàn trường.',g:'biết thời gian sử dụng Internet vào hai ngày cuối tuần của học sinh toàn trường',ok:'Cách này chọn ngẫu nhiên học sinh ở nhiều lớp nên có thể đại diện cho toàn trường.',
  goods:['Chọn ngẫu nhiên một số bạn ở mỗi lớp rồi gửi bảng hỏi cho các bạn đó','Bốc thăm chọn học sinh ở tất cả các khối rồi gửi bảng hỏi','Đánh số học sinh toàn trường rồi chọn ngẫu nhiên 120 bạn để gửi bảng hỏi'],
  bads:[['Chỉ gửi bảng hỏi cho các bạn trong câu lạc bộ Tin học','Các bạn trong câu lạc bộ Tin học thường dùng máy tính nhiều hơn các bạn khác, không đại diện cho toàn trường.'],['Chỉ gửi bảng hỏi cho các bạn ngồi gần phòng máy tính','Chọn theo vị trí và thói quen sử dụng máy tính, không đại diện cho toàn trường.'],['Chỉ gửi bảng hỏi cho các bạn trong lớp chuyên Tin','Đây là một lớp có đặc điểm riêng, không đại diện cho toàn trường.']]},
 {s:'Một cửa hàng quần áo muốn biết màu sắc các sản phẩm (cả quần và áo) bán được trong một tháng.',g:'biết màu sắc các sản phẩm (cả quần và áo) bán được trong một tháng',ok:'Cách này thống kê đủ cả quần và áo, đủ các ngày trong tháng nên đại diện cho mặt hàng của cửa hàng.',
  goods:['Thống kê màu sắc của tất cả quần và áo bán được trong cả tháng','Ghi lại màu sắc của mọi sản phẩm bán ra, cả quần lẫn áo, trong tất cả các ngày của tháng','Thống kê màu của cả quần và áo bán được ở mọi ngày trong tháng'],
  bads:[['Chỉ thống kê màu sắc của quần bán được','Cửa hàng còn bán áo nên dữ liệu chưa đại diện cho các sản phẩm bán được.'],['Chỉ thống kê màu sắc của áo bán được','Cửa hàng còn bán quần nên dữ liệu chưa đại diện cho các sản phẩm bán được.'],['Chỉ thống kê màu sắc sản phẩm bán được vào các ngày cuối tuần','Thiếu các ngày còn lại trong tháng nên không đại diện cho cả tháng.']]},
 {s:'Cô giáo chủ nhiệm muốn biết môn học yêu thích của các bạn trong lớp 7A.',g:'biết môn học yêu thích của các bạn trong lớp 7A',ok:'Cách này lấy ý kiến đủ các nhóm bạn trong lớp, hoặc chọn ngẫu nhiên nên đại diện cho cả lớp.',
  goods:['Lấy ý kiến của tất cả các bạn trong lớp','Lấy ý kiến của các bạn được chọn ngẫu nhiên ở mỗi tổ','Bốc thăm chọn 15 bạn trong danh sách lớp để lấy ý kiến'],
  bads:[['Chỉ lấy ý kiến của các bạn học giỏi Toán','Nhóm bạn học giỏi Toán có thể thích môn Toán nhiều hơn, không đại diện cho cả lớp.'],['Chỉ lấy ý kiến của các bạn nữ trong lớp','Thiếu các bạn nam nên không đại diện cho cả lớp.'],['Chỉ lấy ý kiến của các bạn trong câu lạc bộ Toán','Đây là nhóm bạn yêu thích Toán, không đại diện cho cả lớp.']]}
];
const lf=t=>t.charAt(0).toLowerCase()+t.slice(1);
function genDdGood(){return tryGen(()=>{
  const sc=sel(SC),g=sel(sc.goods);
  return mk(`${sc.s} Cách khảo sát nào sau đây đảm bảo tính đại diện?`,g,sc.bads.map(b=>C(b[0],b[1])),`${sc.ok} Ba cách còn lại chưa đại diện vì chỉ lấy một nhóm đối tượng.`,{});
});}
function genDdBad(){return tryGen(()=>{
  const sc=sel(SC),b=sel(sc.bads);
  return mk(`${sc.s} Cách khảo sát nào sau đây KHÔNG đảm bảo tính đại diện?`,b[0],sc.goods.map(g=>C(g,sc.ok)),b[1],{});
});}
function genDdTwo(){return tryGen(()=>{
  const sc=sel(SC),g=sel(sc.goods),b=sel(sc.bads),first=RNG()<.5;
  const c1=first?g:b[0],c2=first?b[0]:g,gi=first?'Cách 1':'Cách 2';
  return mk(`${sc.s}<br>Cách 1: ${c1}.<br>Cách 2: ${c2}.<br>Cách nào hợp lí hơn?`,gi,[C(first?'Cách 2':'Cách 1','Cách này chưa đại diện: '+lf(b[1])),C('Cả hai cách đều hợp lí như nhau','Hai cách không như nhau: một cách lấy dữ liệu chưa đại diện.'),C('Cả hai cách đều không hợp lí','Có một cách chọn ngẫu nhiên, đại diện cho toàn bộ đối tượng.')],`${gi} hợp lí hơn. ${sc.ok} Cách còn lại chưa đại diện: ${lf(b[1])}`,{});
});}
const CG=['bạn nam','bạn nữ','bạn khối 9','bạn trong câu lạc bộ bóng rổ','bạn trong đội tuyển thể thao của trường'];
const CI=['bóng đá','cầu lông','đọc truyện tranh','chơi cờ vua'];
function genDdConcl(){return tryGen(()=>{
  const n=sel([40,50,60,80]),k=ri(Math.ceil(n*0.6),Math.floor(n*0.8)),gr=sel(CG),it=sel(CI);
  return mk(`Bình phỏng vấn ${n} ${gr} trong trường, thấy có ${k} bạn thích ${it}. Bình kết luận: «Đa phần học sinh trong trường thích ${it}». Kết luận này như thế nào?`,`Chưa hợp lí, vì Bình chỉ phỏng vấn các ${gr}, chưa đại diện cho toàn bộ học sinh trong trường`,[C(`Hợp lí, vì ${k} bạn là hơn một nửa của ${n} bạn`,'Muốn kết luận cho toàn trường, dữ liệu phải đại diện cho toàn trường; chỉ hỏi một nhóm thì dù nhóm đó có đa số thích cũng chưa đủ.'),C(`Hợp lí, vì Bình đã phỏng vấn tới ${n} bạn`,'Số bạn được hỏi nhiều chưa đủ nếu các bạn được hỏi chỉ thuộc một nhóm.'),C('Chưa hợp lí, vì Bình phải phỏng vấn tất cả học sinh trong trường','Không cần hỏi mọi học sinh; chỉ cần chọn ngẫu nhiên các bạn đại diện cho toàn trường.')],`Đối tượng quan tâm là toàn thể học sinh trong trường, nhưng Bình chỉ hỏi các ${gr}. Dữ liệu này chưa đại diện nên chưa thể kết luận cho cả trường.`,{n,k});
});}
function ddItemsFor(sc){
  const nT=ri(1,3),Ts=shuffle(sc.goods).slice(0,nT).map(g=>IT(g+' là cách đảm bảo tính đại diện',true,'dd','TH',sc.ok)),
        Fs=shuffle(sc.bads).slice(0,4-nT).map(b=>IT(b[0]+' là cách đảm bảo tính đại diện',false,'dd','TH',b[1]));
  return shuffle(Ts.concat(Fs));
}
function ddTF(){return ()=>{const sc=sel(SC);return {stem:sc.s+' Xét các cách khảo sát sau:',items:ddItemsFor(sc)};};}
function ddItem(lv){
  const sc=sel(SC),ok=RNG()<.5;
  if(ok){const g=sel(sc.goods);return IT(`Để ${sc.g}, cách «${g}» đảm bảo tính đại diện`,true,'dd',lv,sc.ok);}
  const b=sel(sc.bads);return IT(`Để ${sc.g}, cách «${b[0]}» đảm bảo tính đại diện`,false,'dd',lv,b[1]);
}
function saDdCnt(neg){
  const sc=sel(SC),z=ri(1,3),b=ri(2,3);
  const goods=shuffle(sc.goods).slice(0,z),bads=shuffle(sc.bads).slice(0,b).map(x=>x[0]);
  const all=shuffle(goods.concat(bads)),cnt=neg?b:z,list=neg?bads:goods;
  return {stem:`${sc.s} Có ${z+b} cách khảo sát sau:<br>${all.map((c,i)=>`(${i+1}) ${c}`).join('<br>')}<br>Có bao nhiêu cách ${neg?'KHÔNG ':''}đảm bảo tính đại diện?`,ans:[cnt],exp:`Các cách ${neg?'không ':''}đảm bảo tính đại diện: ${list.map(c=>'«'+c+'»').join('; ')}. Có ${cnt} cách.`,meta:{neg,z,b}};
}


/* ============ Chủ đề ============ */
const TOPICS={
  pl:{short:'Phân loại dữ liệu',name:'Phân loại dữ liệu',rule:'Dữ liệu là số (số liệu, dữ liệu định lượng) như cân nặng, chiều cao, điểm số. Dữ liệu không là số (dữ liệu định tính) gồm hai loại: dữ liệu có thể sắp thứ tự (ví dụ mức độ Rất thích, Thích, Không thích) và dữ liệu không thể sắp thứ tự (ví dụ tên món ăn, màu sắc).',tip:'Dữ liệu không là số mà có thể xếp theo mức cao thấp thì vẫn là dữ liệu không là số, có thể sắp thứ tự. Tên gọi (món ăn, màu sắc, quê quán) thì không sắp thứ tự được.'},
  tt:{short:'Thu thập dữ liệu',name:'Thu thập dữ liệu',rule:'Có thể thu thập dữ liệu bằng cách phỏng vấn hoặc lập phiếu hỏi, quan sát và ghi chép trực tiếp, làm thí nghiệm, hoặc tìm trong các nguồn có sẵn như sách, báo, internet. Câu hỏi khác nhau cho các loại dữ liệu khác nhau.',tip:'Muốn biết ý kiến, sở thích thì hỏi. Muốn đếm sự việc đang diễn ra thì quan sát. Muốn xem kết quả khi thay đổi điều kiện thì làm thí nghiệm. Số liệu đã công bố thì tra cứu.'},
  bt:{short:'Bảng thống kê',name:'Lập và đọc bảng thống kê',rule:'Để lập bảng thống kê, ta đếm số lần xuất hiện của từng giá trị rồi ghi vào bảng. Dòng đầu ghi các loại dữ liệu, dòng sau ghi số lượng tương ứng. Tổng các số ở dòng số liệu bằng số đối tượng được khảo sát (nếu mỗi đối tượng chỉ chọn một).',tip:'Khi đếm, hãy gạch từng giá trị đã đếm để không bỏ sót. Muốn so sánh nhiều hơn bao nhiêu thì trừ hai số, không cộng.'},
  dd:{short:'Tính đại diện',name:'Tính đại diện của dữ liệu',rule:'Dữ liệu đại diện cho toàn bộ đối tượng cần nghiên cứu khi được lấy từ các đối tượng chọn ngẫu nhiên, không bỏ sót nhóm nào. Chỉ lấy một nhóm có chung đặc điểm thì dữ liệu không đại diện. Có thể đánh số rồi chọn đều (ví dụ các số 5; 10; 15;...).',tip:'Hỏi nhiều bạn nhưng chỉ trong một nhóm (cùng câu lạc bộ, cùng giới, cùng khối) vẫn không đại diện cho toàn trường.'}
};
const TKEYS=['pl','tt','bt','dd'];
const TDESC={pl:'Dữ liệu là số, dữ liệu không là số, sắp thứ tự được hay không',tt:'Phiếu hỏi, quan sát, thí nghiệm, nguồn có sẵn; loại dữ liệu từ câu hỏi',bt:'Đếm số lần xuất hiện, lập và đọc bảng thống kê, tổng và hiệu',dd:'Chọn mẫu ngẫu nhiên, nhận ra dữ liệu chưa đại diện, đánh giá kết luận'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhận ra loại dữ liệu, cách thu thập, đọc số liệu trong bảng thống kê.',TH:'Phân loại dữ liệu trong dãy, bảng, câu hỏi; đếm và tính tổng, hiệu từ bảng thống kê; nhận ra mẫu chưa đại diện.',VD:'Phân tích nhiều bảng và phát biểu, đánh giá một kết luận, bài toán thực tế khảo sát.'};

/* ============ Hàm dùng chung cho đúng sai ============ */
const O=(t,err)=>err?{t,err}:{t};
const IT=(t,v,topic,level,exp)=>({t,v,topic,level,exp});
function pick4(Ts,Fs){const nT=ri(1,3);return shuffle(shuffle(Ts).slice(0,nT).concat(shuffle(Fs).slice(0,4-nT)));}
function mixed(make){
  for(let n=0;n<80;n++){const items=make();if(items.some(i=>!i))continue;const k=items.filter(i=>i.v).length;if(k>=1&&k<=3&&new Set(items.map(i=>i.t)).size===4)return items;}
  return null;
}
const FB_TF=()=>({stem:'Xét các phát biểu sau:',items:[
  IT('Cân nặng của các bạn trong lớp là dữ liệu là số',true,'pl','NB','Cân nặng được ghi bằng số nên là số liệu.'),
  IT('Màu sắc yêu thích của các bạn là dữ liệu có thể sắp thứ tự',false,'pl','NB','Màu sắc là tên gọi, không có thứ bậc nên không sắp thứ tự được.'),
  IT('Chỉ hỏi các bạn trong câu lạc bộ bóng đá thì dữ liệu đại diện cho cả trường',false,'dd','TH','Chỉ một nhóm bạn có chung sở thích, không đại diện cho cả trường.'),
  IT('Muốn biết ý kiến của các bạn thì nên lập phiếu hỏi',true,'tt','NB','Ý kiến của mỗi người cần hỏi trực tiếp hoặc lập phiếu hỏi.')]});
const four=f=>()=>{const items=mixed(()=>[f(),f(),f(),f()]);return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();};

/* ============ Ngân hàng nhiều lựa chọn (câu cố định) ============ */
const MC=[
 {id:'m1',topic:'pl',level:'NB',stem:'Dữ liệu là số còn được gọi là dữ liệu:',ans:0,opts:[O('định lượng (số liệu)'),O('định tính','Dữ liệu định tính là dữ liệu không là số.'),O('không thể sắp thứ tự','Đây là một loại dữ liệu không là số, không phải tên gọi của dữ liệu là số.'),O('không là số','Dữ liệu là số thì không thể là dữ liệu không là số.')],exp:'Dữ liệu là số được gọi là số liệu, hay dữ liệu định lượng.'},
 {id:'m2',topic:'pl',level:'NB',stem:'Dữ liệu không là số còn được gọi là dữ liệu:',ans:0,opts:[O('định tính'),O('định lượng','Dữ liệu định lượng là dữ liệu là số.'),O('số liệu','Số liệu là dữ liệu là số.'),O('thống kê','Đây không phải tên gọi của loại dữ liệu không là số.')],exp:'Dữ liệu không là số được gọi là dữ liệu định tính.'},
 {id:'m3',topic:'pl',level:'TH',stem:'Dữ liệu nào sau đây KHÔNG là số liệu?',ans:0,opts:[O('Môn học yêu thích của các bạn trong lớp'),O('Chiều cao của các bạn trong tổ','Chiều cao được ghi bằng số nên là số liệu.'),O('Số điểm 10 của mỗi bạn trong học kì','Số điểm 10 đếm được là một số nên là số liệu.'),O('Thời gian ngủ mỗi đêm của các bạn','Thời gian ghi bằng số giờ nên là số liệu.')],exp:'Môn học yêu thích là tên gọi, không là số nên không phải số liệu.'},
 {id:'m4',topic:'pl',level:'VD',stem:'Một bảng có 4 cột: Họ tên, Chiều cao (cm), Xếp loại học lực (Tốt, Khá, Đạt), Quê quán. Có mấy cột là dữ liệu không là số?',ans:0,opts:[O('3'),O('1','Chỉ cột chiều cao là số liệu, ba cột còn lại không là số.'),O('2','Cột Họ tên, Xếp loại học lực và Quê quán đều không là số, nên có 3 cột.'),O('4','Cột Chiều cao (cm) ghi bằng số nên là số liệu.')],exp:'Cột Chiều cao là số liệu. Ba cột Họ tên, Xếp loại học lực, Quê quán đều không là số, vậy có 3 cột.'},
 {id:'m5',topic:'tt',level:'NB',stem:'Việc phỏng vấn hoặc lập phiếu hỏi thường dùng để thu thập dữ liệu về:',ans:0,opts:[O('ý kiến, sở thích, thói quen của nhiều người'),O('diễn biến của một thí nghiệm','Diễn biến thí nghiệm cần quan sát và ghi chép khi làm thí nghiệm.'),O('số liệu đã công bố trong sách báo','Số liệu có sẵn thì tra cứu, không cần hỏi.'),O('số xe đi qua một ngã tư','Cần đếm trực tiếp, không thể hỏi từng xe.')],exp:'Ý kiến, sở thích, thói quen của mỗi người chỉ biết được khi hỏi trực tiếp hoặc dùng phiếu hỏi.'},
 {id:'m6',topic:'tt',level:'NB',stem:'Cách nào sau đây là cách thu thập dữ liệu trong bài học?',ans:0,opts:[O('Làm thí nghiệm'),O('Đoán số liệu','Dữ liệu phải thu thập từ nguồn thực tế, không đoán.'),O('Chỉ nhớ lại','Cần thu thập thực tế hoặc từ nguồn đáng tin cậy.'),O('Tự bịa số liệu','Dữ liệu phải có thật.')],exp:'Các cách thu thập dữ liệu gồm phỏng vấn, phiếu hỏi, quan sát, làm thí nghiệm, tìm nguồn có sẵn.'},
 {id:'m7',topic:'tt',level:'TH',stem:'Muốn có diện tích các tỉnh, thành phố ở Việt Nam, cách nào nhanh và đáng tin cậy nhất?',ans:0,opts:[O('Tìm trong sách, niên giám thống kê hoặc internet'),O('Đi đo diện tích từng tỉnh','Không thể tự đo; số liệu này đã có sẵn.'),O('Phỏng vấn các bạn trong lớp','Các bạn không nhớ chính xác diện tích các tỉnh.'),O('Làm thí nghiệm','Đây không phải hiện tượng làm thí nghiệm được.')],exp:'Số liệu đã được công bố nên tra cứu từ nguồn có sẵn là nhanh và đáng tin cậy nhất.'},
 {id:'m8',topic:'tt',level:'VD',stem:'Phiếu hỏi có hai câu: (1) «Bạn thích môn học nào nhất?» (2) «Mỗi tuần bạn học môn đó bao nhiêu giờ?». Hai câu cho các loại dữ liệu lần lượt là:',ans:0,opts:[O('không là số, không thể sắp thứ tự; số liệu'),O('số liệu; không là số, không thể sắp thứ tự','Hai câu ghi ngược: câu (1) ghi tên môn, câu (2) ghi số giờ.'),O('không là số, có thể sắp thứ tự; số liệu','Tên môn học yêu thích không có thứ bậc cao thấp.'),O('số liệu; số liệu','Câu (1) ghi tên môn học nên không là số.')],exp:'Câu (1) cho tên môn học: dữ liệu không là số, không sắp thứ tự. Câu (2) cho số giờ: số liệu.'},
 {id:'m9',topic:'bt',level:'NB',stem:'Để lập bảng thống kê cho một dãy dữ liệu, ta cần:',ans:0,opts:[O('đếm số lần xuất hiện của từng giá trị rồi ghi vào bảng'),O('chỉ ghi giá trị lớn nhất','Bảng thống kê cần ghi số lần xuất hiện của mọi giá trị.'),O('cộng tất cả các giá trị lại','Dữ liệu không là số thì không cộng được; bảng ghi số lần xuất hiện.'),O('sắp xếp các giá trị theo bảng chữ cái rồi bỏ đi','Cần đếm số lần xuất hiện, không bỏ dữ liệu.')],exp:'Bảng thống kê ghi mỗi giá trị cùng số lần xuất hiện của giá trị đó.'},
 {id:'m10',topic:'bt',level:'TH',stem:'Mỗi bạn chỉ chọn một môn thể thao. Tổng các số ở dòng «Số bạn chọn» trong bảng thống kê bằng:',ans:0,opts:[O('số bạn tham gia khảo sát'),O('số môn thể thao','Số môn là số cột của bảng, không phải tổng các số trong dòng.'),O('số lớn nhất trong dòng','Tổng bằng tất cả các số cộng lại, không phải số lớn nhất.'),O('số nhỏ nhất trong dòng','Tổng bằng tất cả các số cộng lại, không phải số nhỏ nhất.')],exp:'Mỗi bạn chọn đúng một môn nên mỗi bạn được đếm đúng một lần; tổng bằng số bạn tham gia khảo sát.'},
 {id:'m11',topic:'bt',level:'VD',stem:'Khảo sát 30 bạn, mỗi bạn chọn một môn: bóng đá 8 bạn, cầu lông 5 bạn, các môn còn lại là bơi và cờ vua. Số bạn chọn bơi hoặc cờ vua là:',ans:0,opts:[O('17'),O('13','13 = 8 + 5 là số bạn chọn bóng đá và cầu lông.'),O('25','Chưa trừ đủ: 30 − 5 = 25 mới trừ một môn.'),O('22','Chưa trừ đủ: 30 − 8 = 22 mới trừ một môn.')],exp:'Số bạn chọn bơi hoặc cờ vua là 30 − (8 + 5) = 17.'},
 {id:'m12',topic:'dd',level:'NB',stem:'Dữ liệu đại diện cho toàn bộ đối tượng cần nghiên cứu khi:',ans:0,opts:[O('được lấy từ các đối tượng chọn ngẫu nhiên, không bỏ sót nhóm nào'),O('chỉ lấy từ những người quen','Người quen thường có chung đặc điểm, không đại diện.'),O('chỉ lấy từ một nhóm có ý kiến tích cực','Bỏ sót các nhóm có ý kiến khác, không đại diện.'),O('chỉ lấy từ đúng một người','Quá ít và chỉ một cá nhân, không đại diện.')],exp:'Dữ liệu đại diện khi lấy từ các đối tượng chọn ngẫu nhiên, đủ các nhóm trong tổng thể.'},
 {id:'m13',topic:'dd',level:'TH',stem:'Vì sao chỉ khảo sát các bạn trong câu lạc bộ bóng đá để biết môn thể thao yêu thích của cả trường thì dữ liệu không đại diện?',ans:0,opts:[O('Vì các bạn trong câu lạc bộ thường thích bóng đá hơn các bạn khác'),O('Vì các bạn trong câu lạc bộ không biết trả lời','Không phải vì các bạn không biết trả lời mà vì đây chỉ là một nhóm có chung sở thích.'),O('Vì số bạn được hỏi nhiều quá','Số bạn nhiều không làm dữ liệu kém đại diện.'),O('Vì câu hỏi quá khó','Không liên quan đến tính đại diện.')],exp:'Nhóm bạn trong câu lạc bộ có chung sở thích nên kết quả thiên về bóng đá, không đại diện cho cả trường.'},
 {id:'m14',topic:'dd',level:'VD',stem:'Phát biểu nào sau đây đúng khi khảo sát học sinh toàn trường?',ans:0,opts:[O('Không nhất thiết hỏi tất cả, chỉ cần chọn ngẫu nhiên các bạn đại diện cho các nhóm'),O('Bắt buộc phải hỏi tất cả học sinh','Không cần hỏi tất cả; có thể chọn ngẫu nhiên các bạn đại diện.'),O('Chỉ cần hỏi các bạn lớp mình','Chỉ một lớp thì không đại diện cho cả trường.'),O('Càng hỏi nhiều bạn cùng nhóm thì càng đại diện','Hỏi nhiều bạn trong cùng một nhóm vẫn không đại diện.')],exp:'Muốn dữ liệu đại diện, chọn ngẫu nhiên các bạn từ nhiều lớp, nhiều khối; không cần hỏi tất cả.'}
];
const addMC=(id,topic,level,gen)=>['a','b'].forEach(x=>MC.push({id:id+'_'+x,type:'mc',topic,level,gen}));
MC.forEach(q=>q.type='mc');
addMC('g_pltype','pl','NB',genPlType);addMC('g_plwhich','pl','TH',genPlWhich);addMC('g_pltable','pl','TH',genPlTable);
addMC('g_ttkind','tt','NB',genTtKind);addMC('g_ttwhichq','tt','TH',genTtWhichQ);addMC('g_ttmethod','tt','NB',genTtMethod);
addMC('g_btrows','bt','NB',genBtRows);addMC('g_btmax','bt','NB',genBtMax);addMC('g_btmin','bt','NB',genBtMin);addMC('g_bttotal','bt','TH',genBtTotal);addMC('g_btdiff','bt','TH',genBtDiff);addMC('g_bttally','bt','TH',genBtTally);addMC('g_btmore','bt','VD',genBtMore);
addMC('g_ddgood','dd','TH',genDdGood);addMC('g_ddbad','dd','TH',genDdBad);addMC('g_ddtwo','dd','TH',genDdTwo);addMC('g_ddconcl','dd','VD',genDdConcl);

/* ============ Bộ sinh đúng sai ============ */
const TF=[];
const addTF=(id,topic,level,gen)=>TF.push({id,type:'tf',topic,level,gen});
const btGen=lv=>{const g=btTF(lv);return ()=>g()||FB_TF();};
['a','b'].forEach(x=>{
  addTF('tf_pl_th_'+x,'pl','TH',four(()=>plItem('TH')));
  addTF('tf_tt_th_'+x,'tt','TH',four(()=>ttItem('TH')));
  addTF('tf_bt_th_'+x,'bt','TH',btGen('TH'));
  addTF('tf_dd_th_'+x,'dd','TH',ddTF());
});
addTF('tf_pl_vd','pl','VD',four(()=>plItem('VD')));
addTF('tf_tt_vd','tt','VD',four(()=>ttItem('VD')));
addTF('tf_bt_vd','bt','VD',btGen('VD'));
addTF('tf_dd_vd','dd','VD',four(()=>ddItem('VD')));
addTF('tf_pl_tab','pl','TH',()=>plTableItems()||FB_TF());
addTF('tf_mix_a','tt','TH',four(()=>[plItem,ttItem,ddItem][ri(0,2)]('TH')));
addTF('tf_mix_b','dd','VD',four(()=>[plItem,ttItem,ddItem][ri(0,2)]('VD')));
const PT=[
 IT('Cân nặng của các bạn trong lớp là số liệu',true,'pl','NB','Cân nặng ghi bằng số nên là số liệu.'),
 IT('Số liệu còn gọi là dữ liệu định lượng',true,'pl','NB','Dữ liệu là số gọi là số liệu, hay dữ liệu định lượng.'),
 IT('Xếp loại học lực (Tốt, Khá, Đạt) là dữ liệu không là số, có thể sắp thứ tự',true,'pl','NB','Các mức có thứ bậc từ cao đến thấp.'),
 IT('Tên các món ăn là dữ liệu không là số',true,'pl','NB','Tên món ăn là tên gọi, không là số.'),
 IT('Muốn biết ý kiến của các bạn thì nên lập phiếu hỏi',true,'tt','NB','Ý kiến chỉ biết được khi hỏi trực tiếp hoặc lập phiếu hỏi.'),
 IT('Đếm số xe đi qua ngã tư là thu thập dữ liệu bằng cách quan sát',true,'tt','NB','Đây là quan sát và ghi chép trực tiếp.'),
 IT('Làm thí nghiệm là một cách thu thập dữ liệu',true,'tt','NB','Làm thí nghiệm là một trong các cách thu thập dữ liệu.'),
 IT('Số liệu trong sách, báo, internet là nguồn dữ liệu có sẵn',true,'tt','NB','Có thể tìm dữ liệu trong các nguồn có sẵn.'),
 IT('Bảng thống kê ghi số lần xuất hiện của mỗi giá trị',true,'bt','NB','Đây là nội dung của bảng thống kê.'),
 IT('Muốn lập bảng thống kê ta cần đếm số lần xuất hiện của từng giá trị',true,'bt','NB','Đếm rồi ghi vào bảng.'),
 IT('Mỗi bạn chọn một món thì tổng các số trong bảng bằng số bạn khảo sát',true,'bt','NB','Mỗi bạn được đếm đúng một lần.'),
 IT('Muốn so sánh hai số trong bảng, ta so sánh hai số đó',true,'bt','NB','Số lớn hơn ứng với loại dữ liệu có nhiều hơn.'),
 IT('Chọn ngẫu nhiên các bạn ở mọi lớp thì dữ liệu có thể đại diện cho cả trường',true,'dd','NB','Chọn ngẫu nhiên ở mọi lớp không bỏ sót nhóm nào.'),
 IT('Dữ liệu lấy từ các đối tượng chọn ngẫu nhiên có thể đại diện',true,'dd','NB','Chọn ngẫu nhiên giúp đại diện cho toàn bộ đối tượng.'),
 IT('Không cần hỏi tất cả học sinh mới có dữ liệu đại diện',true,'dd','NB','Chỉ cần chọn ngẫu nhiên các bạn đại diện.'),
 IT('Dữ liệu không đại diện có thể dẫn đến kết luận sai',true,'dd','NB','Chỉ một nhóm có đặc điểm riêng thì kết luận cho cả tổng thể dễ sai.')
];
const PF=[
 IT('Cân nặng của các bạn trong lớp là dữ liệu không là số',false,'pl','NB','Cân nặng ghi bằng số nên là số liệu.'),
 IT('Dữ liệu định tính là dữ liệu là số',false,'pl','NB','Dữ liệu định tính là dữ liệu không là số.'),
 IT('Màu sắc yêu thích của các bạn là dữ liệu có thể sắp thứ tự',false,'pl','NB','Màu sắc không có thứ bậc cao thấp nên không sắp thứ tự được.'),
 IT('Dữ liệu không là số thì luôn không thể sắp thứ tự',false,'pl','NB','Có dữ liệu không là số mà sắp thứ tự được, như xếp loại học lực.'),
 IT('Muốn biết ý kiến của các bạn thì nên làm thí nghiệm',false,'tt','NB','Ý kiến cần hỏi trực tiếp hoặc lập phiếu hỏi.'),
 IT('Đếm số xe đi qua ngã tư là thu thập dữ liệu bằng cách làm thí nghiệm',false,'tt','NB','Đây là quan sát và ghi chép trực tiếp.'),
 IT('Chỉ có một cách duy nhất để thu thập dữ liệu',false,'tt','NB','Có nhiều cách: phỏng vấn, quan sát, thí nghiệm, nguồn có sẵn.'),
 IT('Số liệu trong sách, báo, internet không thể dùng làm dữ liệu',false,'tt','NB','Đây là nguồn dữ liệu có sẵn.'),
 IT('Bảng thống kê chỉ ghi giá trị lớn nhất',false,'bt','NB','Bảng thống kê ghi số lần xuất hiện của mọi giá trị.'),
 IT('Muốn lập bảng thống kê ta cộng tất cả các giá trị lại',false,'bt','NB','Cần đếm số lần xuất hiện của từng giá trị.'),
 IT('Mỗi bạn chọn một món thì tổng các số trong bảng lớn hơn số bạn khảo sát',false,'bt','NB','Mỗi bạn được đếm đúng một lần nên tổng bằng số bạn khảo sát.'),
 IT('Muốn biết nhiều hơn bao nhiêu thì ta cộng hai số trong bảng',false,'bt','NB','Phải trừ hai số, không cộng.'),
 IT('Chỉ hỏi các bạn trong câu lạc bộ bóng đá thì dữ liệu đại diện cho cả trường',false,'dd','NB','Đây chỉ là một nhóm bạn có chung sở thích.'),
 IT('Chỉ hỏi các bạn lớp mình thì đại diện cho cả trường',false,'dd','NB','Một lớp không đại diện cho toàn trường.'),
 IT('Muốn dữ liệu đại diện thì bắt buộc phải hỏi tất cả học sinh',false,'dd','NB','Chỉ cần chọn ngẫu nhiên các bạn đại diện.'),
 IT('Dữ liệu không đại diện vẫn dùng để kết luận cho cả tổng thể được',false,'dd','NB','Dữ liệu không đại diện thì kết luận cho cả tổng thể dễ sai.')
];
const tfNB=t=>()=>({stem:'Xét các phát biểu sau:',items:pick4(PT.filter(i=>i.topic===t),PF.filter(i=>i.topic===t))});
TKEYS.forEach(t=>addTF('tf_nb_'+t,t,'NB',tfNB(t)));

/* ============ Bộ sinh trả lời ngắn ============ */
function saDdSample(){
  const step=sel([5,10]),n=step*ri(8,30);
  return {stem:`Danh sách học sinh được đánh số từ 1 đến ${n}. Để khảo sát, ta chọn các bạn có số thứ tự ${step}; ${2*step}; ${3*step}; ...; ${n}. Có bao nhiêu bạn được chọn?`,ans:[n/step],exp:`Các số ${step}; ${2*step}; ...; ${n} là ${step} nhân với 1, 2, ..., ${n/step}. Có ${n/step} bạn được chọn.`,meta:{n,step}};
}
function SA_BUILD(){
  const S=[];const add=(id,topic,level,gen)=>['a','b'].forEach(x=>S.push({id:id+x,type:'sa',topic,level,unit:'',gen}));
  add('s_plcnt','pl','NB',saPlCnt);add('s_plcols','pl','TH',saPlCols);
  add('s_ttcnt','tt','TH',saTtCnt);
  add('s_bttotal','bt','NB',saBtTotal);add('s_btdiff','bt','TH',saBtDiff);add('s_bttally','bt','TH',saBtTally);add('s_bttop2','bt','VD',saBtTop2);add('s_bttw','bt','VD',saBtTwoWay);add('s_btmiss','bt','TH',saBtMissing);
  add('s_ddcnt','dd','TH',()=>saDdCnt(false));add('s_ddneg','dd','VD',()=>saDdCnt(true));add('s_ddsamp','dd','VD',saDdSample);
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
  const items=mixed(()=>shuffle([()=>plItem('VD'),()=>ttItem('VD'),()=>ddItem('VD'),()=>btItems(tabData())[4]()]).map(f=>f()));
  return items?{stem:'Xét các phát biểu sau:',items}:FB_TF();
}
const HARD={tf:[{id:'h_tf',type:'tf',topic:'dd',level:'VD',gen:tfHard}],sa:[
 {id:'h_tw',topic:'bt',level:'VD',unit:'',gen:saBtTwoWay},
 {id:'h_top2',topic:'bt',level:'VD',unit:'',gen:saBtTop2},
 {id:'h_samp',topic:'dd',level:'VD',unit:'',gen:saDdSample},
 {id:'h_neg',topic:'dd',level:'VD',unit:'',gen:()=>saDdCnt(true)}
].map(q=>Object.assign({type:'sa'},q))};
const PISA=[
 ()=>{
  const D=tabData(),S=sum(D.v),i=tabMx(D),j=tabMn(D);
  return {title:'Khảo sát nhu cầu của khách hàng',ctx:`<p class="stem">${D.T.ctx} Kết quả được ghi trong bảng thống kê dưới đây (mỗi ${D.T.unit} chỉ chọn một ${D.T.noun}).</p>`,fig:tabHTML(D),qs:[
   mcq('Dòng «'+D.T.row+'» trong bảng là dữ liệu thuộc loại nào?','Dữ liệu là số (số liệu)',[['Dữ liệu không là số, có thể sắp thứ tự','Các giá trị ở dòng này là số nên là số liệu.'],['Dữ liệu không là số, không thể sắp thứ tự','Các giá trị ở dòng này là số nên là số liệu.'],['Dữ liệu định tính','Dữ liệu định tính là dữ liệu không là số.']],'Các giá trị ở dòng này là số nên là số liệu (dữ liệu định lượng).','pl','TH'),
   mcq(`Cửa hàng nên ưu tiên ${D.T.noun} nào nếu muốn phục vụ nhiều ${D.T.unit} nhất?`,D.cats[i],D.cats.map((c,k)=>k===i?null:[c,`«${c}» chỉ có ${D.v[k]} ${D.T.unit}, ít hơn «${D.cats[i]}» (${D.v[i]} ${D.T.unit}).`]).filter(Boolean).slice(0,3),`Số lớn nhất là ${D.v[i]}, ứng với «${D.cats[i]}».`,'bt','TH'),
   saq(`Có tất cả bao nhiêu ${D.T.unit} tham gia khảo sát?`,S,D.T.unit,`${D.v.join(' + ')} = ${S}.`,'bt','TH'),
   saq(`Số ${D.T.unit} ${D.T.act} «${D.cats[i]}» nhiều hơn số ${D.T.unit} ${D.T.act} «${D.cats[j]}» bao nhiêu ${D.T.unit}?`,D.v[i]-D.v[j],D.T.unit,`${D.v[i]} − ${D.v[j]} = ${D.v[i]-D.v[j]}.`,'bt','VD')
  ]};
 },
 ()=>{
  const sc=sel(SC),g=sel(sc.goods),b=sel(sc.bads),N=sel([100,150,200,250,300]),step=5,k=N/step;
  const tot=ri(30,60),a=ri(8,Math.floor(tot/2)),c=ri(5,Math.floor((tot-a)/2)),d=tot-a-c;
  return {title:'Chọn nhóm để khảo sát',ctx:`<p class="stem">${sc.s} Hai bạn đề xuất hai cách khảo sát.<br>Cách 1: ${g}.<br>Cách 2: ${b[0]}.</p>`,qs:[
   mcq('Cách nào đảm bảo tính đại diện?','Cách 1',[['Cách 2',b[1]],['Cả hai cách như nhau','Hai cách không như nhau: Cách 2 chỉ lấy một nhóm đối tượng.'],['Không cách nào cả','Cách 1 chọn ngẫu nhiên, đại diện cho toàn bộ đối tượng.']],`${sc.ok} Cách 2 chưa đại diện: ${lf(b[1])}`,'dd','TH'),
   mcq('Dữ liệu thu được khi hỏi «Bạn có thường xuyên làm việc này không? (Rất thường xuyên, Thường xuyên, Hiếm khi)» thuộc loại nào?','Dữ liệu không là số, có thể sắp thứ tự',[['Dữ liệu là số (số liệu)','Các câu trả lời là chữ (các mức), không là số.'],['Dữ liệu không là số, không thể sắp thứ tự','Các mức từ rất thường xuyên đến hiếm khi có thứ bậc nên sắp thứ tự được.'],['Dữ liệu định lượng','Dữ liệu định lượng là dữ liệu là số.']],'Các mức trả lời có thể sắp xếp theo thứ bậc nên đây là dữ liệu không là số, có thể sắp thứ tự.','pl','TH'),
   saq(`Danh sách có ${N} bạn đánh số từ 1 đến ${N}. Chọn các bạn có số thứ tự ${step}; ${2*step}; ${3*step}; ...; ${N}. Có bao nhiêu bạn được chọn?`,k,'bạn',`${N} : ${step} = ${k} bạn.`,'dd','TH'),
   saq(`Trong ${tot} bạn trả lời, có ${a} bạn chọn «Rất thường xuyên», ${c} bạn chọn «Thường xuyên», còn lại chọn «Hiếm khi». Có bao nhiêu bạn chọn «Hiếm khi»?`,d,'bạn',`${tot} − ${a} − ${c} = ${d}.`,'bt','VD')
  ]};
 }
];

/* ============ Ôn nhanh ============ */
const RECAP=[
  {k:'pl',fig:`<div class="figbox"><p>Dữ liệu là số: cân nặng, chiều cao, điểm số</p><p>Dữ liệu không là số, sắp thứ tự được: Tốt, Khá, Đạt</p><p>Dữ liệu không là số, không sắp thứ tự: tên món ăn, màu sắc</p></div>`,extra:'Dữ liệu là số còn gọi là dữ liệu định lượng; dữ liệu không là số còn gọi là dữ liệu định tính.'},
  {k:'tt',fig:`<div class="figbox"><p>Hỏi (phiếu hỏi, phỏng vấn) → ý kiến, sở thích</p><p>Quan sát, ghi chép → đếm sự việc đang xảy ra</p><p>Làm thí nghiệm → kết quả khi thay đổi điều kiện</p><p>Nguồn có sẵn → sách, báo, internet</p></div>`,extra:'Chọn cách thu thập phù hợp với loại dữ liệu cần có.'},
  {k:'bt',fig:`<div class="figbox"><p>Loại dữ liệu | A | B | C</p><p>Số lần xuất hiện | 6 | 9 | 5</p><p>Tổng 6 + 9 + 5 = 20 (số đối tượng khảo sát)</p></div>`,extra:'Nhiều hơn bao nhiêu thì trừ hai số; tính tổng thì cộng tất cả các số.'},
  {k:'dd',fig:`<div class="figbox"><p>Chọn ngẫu nhiên, đủ các nhóm → đại diện</p><p>Chỉ lấy một nhóm có chung đặc điểm → không đại diện</p><p>Đánh số rồi chọn các số 5; 10; 15; ...</p></div>`,extra:'Dữ liệu không đại diện thì không nên dùng để kết luận cho cả tổng thể.'}
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
 G(()=>{const sp=['Bóng đá','Cầu lông','Bơi','Bóng rổ','Đá cầu'],v=sp.map(()=>ri(2,14));
  const mx=Math.max(...v),mn=Math.min(...v);if(v.filter(x=>x===mx).length>1||v.filter(x=>x===mn).length>1)throw 0;
  const tot=v.reduce((a,b)=>a+b,0);if(tot<30||tot>45)throw 0;
  const [good,bads]=sel([['Chọn ngẫu nhiên một số học sinh ở tất cả các lớp của trường để hỏi',[['Chỉ hỏi các bạn trong câu lạc bộ bóng đá của trường','Các bạn trong câu lạc bộ bóng đá thường thích bóng đá hơn, nên mẫu này không đại diện cho cả trường.'],['Chỉ hỏi các bạn lớp 7A','Một lớp không đại diện được cho học sinh của tất cả các khối lớp.'],['Chỉ hỏi các bạn nam của trường','Bỏ qua các bạn nữ thì mẫu không đại diện cho toàn trường.']]],
   ['Ở mỗi lớp của trường, chọn ngẫu nhiên vài bạn nam và vài bạn nữ để hỏi',[['Chỉ hỏi các bạn đang tập ở bể bơi của trường','Các bạn đang ở bể bơi thường thích bơi hơn, nên mẫu này không đại diện cho cả trường.'],['Chỉ hỏi các bạn khối 9','Một khối lớp không đại diện được cho học sinh toàn trường.'],['Chỉ hỏi các bạn nữ lớp 7A','Mẫu quá hẹp: chỉ một lớp và chỉ có các bạn nữ.']]]]);
  return {title:'Môn thể thao yêu thích',ctx:P('Bạn lớp trưởng hỏi mỗi bạn trong lớp 7A về môn thể thao bạn đó yêu thích nhất (mỗi bạn chọn đúng một môn) và ghi lại kết quả như bảng sau.')+T(['Môn thể thao','Số bạn'],sp.map((s,i)=>[s,v[i]])),qs:[
   M('Dữ liệu ở cột "Môn thể thao" thuộc loại nào?','Dữ liệu không là số, không thể sắp thứ tự',[['Dữ liệu là số (số liệu)','Tên các môn thể thao không phải là số.'],['Dữ liệu không là số, có thể sắp thứ tự','Tên các môn thể thao không có thứ tự hơn kém (khác với các mức như Rất thích, Thích, Không thích).'],['Vừa là số vừa không là số','Mỗi giá trị trong cột là tên một môn thể thao, nên đều là dữ liệu không là số.']],'Dữ liệu là tên các môn thể thao: không là số và không thể sắp thứ tự.','pl','TH'),
   A('Có bao nhiêu bạn lớp 7A đã trả lời?',tot,'bạn',`${v.join(' + ')} = ${tot} (bạn).`,'bt','TH'),
   A('Số bạn chọn môn được yêu thích nhất nhiều hơn số bạn chọn môn ít được yêu thích nhất là bao nhiêu bạn?',mx-mn,'bạn',`Môn được chọn nhiều nhất là ${sp[v.indexOf(mx)]} (${mx} bạn), ít nhất là ${sp[v.indexOf(mn)]} (${mn} bạn). ${mx} − ${mn} = ${mx-mn}.`,'bt','TH'),
   M('Nhà trường muốn biết môn thể thao học sinh toàn trường yêu thích nhất. Cách khảo sát nào dưới đây bảo đảm tính đại diện?',good,bads,'Mẫu khảo sát phải gồm học sinh ở mọi lớp, cả nam và nữ, được chọn ngẫu nhiên thì mới đại diện cho toàn trường.','dd','VD')]};}),
 G(()=>{const n=8,h=[];while(h.length<n-1)h.push(rd(ri(80,200)/10,1));
  const [bad,why]=sel([[rd(ri(110,190),0),'cao hơn 1 m'],[rd(-ri(5,15)/1,0),'là số âm'],[0,'bằng 0 trong khi cây vẫn sống và đã mọc']]);
  const pos=ri(0,n-1),data=h.slice(0,pos).concat([bad],h.slice(pos));const th=ri(11,16);
  const okv=data.filter((_,i)=>i!==pos),cnt=okv.filter(x=>x>=th).length;if(cnt===0||cnt===n-1||okv.some(x=>x===th))throw 0;
  const re=rd(ri(80,200)/10,1),th2=ri(10,17);const fixd=okv.concat([re]),cnt2=fixd.filter(x=>x>th2).length;if(fixd.some(x=>x===th2))throw 0;
  const others=shuffle(okv).slice(0,3);if(new Set(others.concat([bad]).map(nm)).size<4)throw 0;
  return {title:'Thí nghiệm trồng cây đậu',ctx:P(`Nhóm của bạn An trồng ${n} cây đậu và đo chiều cao của mỗi cây sau hai tuần (đơn vị: cm). Bạn An ghi lại kết quả như bảng sau.`)+T(['Cây',...data.map((_,i)=>i+1)],[['Chiều cao (cm)',...data.map(nm)]]),qs:[
   M('Nhóm bạn An còn ghi thêm cho mỗi cây: tên giống đậu, chiều cao cây, màu lá, số lá. Những dữ liệu nào là dữ liệu là số (số liệu)?','Chiều cao cây và số lá',[['Tên giống đậu và màu lá','Tên giống và màu lá không phải là số.'],['Chỉ có số lá','Chiều cao cây đo bằng cm cũng là số.'],['Cả bốn loại dữ liệu','Tên giống đậu và màu lá là dữ liệu không là số.']],'Chiều cao cây (cm) và số lá là các số; tên giống đậu và màu lá không là số.','pl','TH'),
   M('Trong bảng, giá trị nào chắc chắn không hợp lí?',nm(bad),others.map(x=>[nm(x),`Chiều cao ${nm(x)} cm phù hợp với một cây đậu sau hai tuần.`]),`Giá trị ${nm(bad)} ${why}, không thể là chiều cao của một cây đậu nhỏ trồng được hai tuần.`,'tt','VD'),
   A(`Không kể giá trị không hợp lí, có bao nhiêu cây cao từ ${th} cm trở lên?`,cnt,'cây',`Các chiều cao hợp lí từ ${th} cm trở lên: ${okv.filter(x=>x>=th).map(nm).join('; ')}. Có ${cnt} cây.`,'bt','TH'),
   A(`Nhóm đo lại cây có giá trị không hợp lí và được ${nm(re)} cm. Sau khi sửa, có bao nhiêu cây cao hơn ${th2} cm?`,cnt2,'cây',`Sau khi sửa, các chiều cao lớn hơn ${th2} cm là: ${fixd.filter(x=>x>th2).map(nm).join('; ')||'không có'}. Có ${cnt2} cây.`,'bt','VD')]};})
);
}
/* ==== Toán thực tế bổ sung: kết thúc ==== */
/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='dl7_seen';
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
  const mcSlots=[['pl',['NB','TH']],['pl',['TH','VD']],['tt',['NB','TH']],['bt',['NB','TH']],['bt',['TH','VD']],['dd',['NB','TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>q.topic===t&&l.includes(q.level)),used));
  const tf=[sel(['pl','tt']),'bt','dd'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set(),t1=sel(['pl','tt']),t2=sel(['bt','dd']);
  const mc=['pl','tt','bt','dd'].map(t=>pick(MC.filter(q=>q.topic===t&&q.level!=='VD'),used));
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
