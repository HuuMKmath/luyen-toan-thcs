// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ bieu-do-hinh-quat-tron/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "bieu-do-hinh-quat-tron";
export const TIEN_TO = "QT7-";

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
/* ============ Chủ đề, mức độ, số ngẫu nhiên ============ */
const TOPICS={
  dd:{short:'Đọc biểu đồ',name:'Đọc và mô tả biểu đồ hình quạt tròn',rule:'Biểu đồ hình quạt tròn dùng để so sánh các phần trong toàn bộ dữ liệu. Biểu đồ gồm tiêu đề, hình tròn biểu diễn dữ liệu và chú giải. Hình tròn được chia thành các hình quạt, mỗi hình quạt biểu diễn tỉ lệ của một phần so với toàn bộ dữ liệu; cả hình tròn ứng với 100%.',tip:'Dùng chú giải để biết mỗi hình quạt biểu diễn loại nào. Số ghi trên hình quạt là tỉ lệ (%), không phải số lượng.'},
  bd:{short:'Biểu diễn dữ liệu',name:'Biểu diễn dữ liệu vào biểu đồ hình quạt tròn',rule:'Tỉ lệ của một loại = số lượng của loại đó : tổng số lượng · 100%. Tổng các tỉ lệ bằng 100%. Phần hình quạt ứng với một nửa hình tròn biểu diễn 50%, ứng với 1/4 hình tròn biểu diễn 25%; hai hình quạt giống nhau biểu diễn cùng một tỉ lệ.',tip:'Tính tỉ lệ thì chia cho TỔNG số lượng, không chia cho số lượng của một loại khác. Hình tròn chia sẵn mỗi hình quạt 10% (hay 5%) thì số hình quạt cần tô = tỉ lệ : 10% (hay : 5%).'},
  ss:{short:'So sánh, nhận xét',name:'So sánh và nhận xét từ biểu đồ',rule:'Hình quạt lớn hơn biểu diễn tỉ lệ lớn hơn. Trong cùng một biểu đồ, tỉ lệ của loại nào gấp mấy lần loại kia thì số lượng cũng gấp bấy nhiêu lần; tổng tỉ lệ của nhiều loại bằng tổng các tỉ lệ.',tip:'Hai biểu đồ có tổng số khác nhau thì tỉ lệ lớn hơn chưa chắc số lượng nhiều hơn.'},
  ud:{short:'Tính số lượng, dự đoán',name:'Tính số lượng và dự đoán từ biểu đồ',rule:'Biết tổng số N và tỉ lệ p% thì số lượng là N · p% = N · p/100. Biết số lượng a ứng với tỉ lệ p% thì tổng số là a : p%. Kết quả khảo sát một nhóm có thể dùng để dự đoán (ước lượng) cho nhóm lớn hơn.',tip:'Con số dự đoán chỉ là ước lượng, không chắc chắn đúng. Tìm tổng số từ một phần thì chia cho p%, không nhân.'}
};
const TKEYS=['dd','bd','ss','ud'];
const TDESC={dd:'Các thành phần của biểu đồ, đọc tỉ lệ của từng loại, loại nhiều nhất, ít nhất',bd:'Tính tỉ lệ từ số lượng, tìm tỉ lệ còn thiếu, tô hình tròn chia sẵn, hoàn thiện chú giải',ss:'Tổng, hiệu tỉ lệ, gấp mấy lần, sắp thứ tự, nhận xét đúng sai',ud:'Tính số lượng từ tỉ lệ, tìm tổng số, dự đoán cho nhóm lớn hơn'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhận biết các thành phần của biểu đồ hình quạt tròn, đọc tỉ lệ trên biểu đồ.',TH:'Tính tỉ lệ, số lượng qua một hai bước; so sánh các tỉ lệ.',VD:'Tính toán nhiều bước, tìm tổng số, dự đoán, kết hợp Bài 17 và tình huống thực tế.'};
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const N=x=>x<0?'−'+(-x):''+x;
const nf=x=>String(x).replace('.',',');
/* số có từ 4 chữ số: tách nhóm bằng dấu cách (1 200) */
const nb=x=>{const s=String(x),[a,b]=s.split('.');return a.replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(b?','+b:'');};
const P=x=>nf(x)+'%';
const r2=x=>Math.round(x*1e6)/1e6;

/* ============ Hình vẽ: biểu đồ hình quạt tròn ============ */
const f1=n=>(Math.round(n*10)/10);
const PIE_C=['#7fcf9f','#f4a083','#ab95de','#f3d36a','#9cc4ee','#c6d878'];
const svg=(w,h,alt,s)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${alt}">${s}</svg>`;
const fb=s=>`<div class="figbox">${s}</div>`;
const xesc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
/* cats: [{n: tên, p: tỉ lệ %}], vẽ theo chiều kim đồng hồ từ "12 giờ".
   o.title: tiêu đề (dùng | để xuống dòng); o.hide: mảng chỉ số các hình quạt ghi "?"; o.noLeg: chú giải ghi "?" */
function figPie(cats,o){
  o=o||{};const W=340,R=74,tl=o.title?String(o.title).split('|'):[],top=tl.length?14+tl.length*19:8,cx=88,cy=top+R+6;
  let s='';tl.forEach((t,i)=>{s+=`<text class="pt" x="${W/2}" y="${18+i*19}" text-anchor="middle">${xesc(t)}</text>`;});
  let a=-Math.PI/2;const hide=o.hide||[];
  cats.forEach((c,i)=>{
    const da=2*Math.PI*c.p/100,b=a+da,col=PIE_C[i%PIE_C.length];
    if(c.p>=99.999)s+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${col}" class="pz"/>`;
    else s+=`<path class="pz" fill="${col}" d="M${cx} ${cy} L${f1(cx+R*Math.cos(a))} ${f1(cy+R*Math.sin(a))} A${R} ${R} 0 ${da>Math.PI?1:0} 1 ${f1(cx+R*Math.cos(b))} ${f1(cy+R*Math.sin(b))} Z"/>`;
    a=b;});
  a=-Math.PI/2;
  cats.forEach((c,i)=>{const da=2*Math.PI*c.p/100,m=a+da/2,rr=c.p<12?R*0.7:R*0.6;
    s+=`<text class="pv" x="${f1(cx+rr*Math.cos(m))}" y="${f1(cy+rr*Math.sin(m)+5)}" text-anchor="middle">${hide.includes(i)?'?':P(c.p)}</text>`;a+=da;});
  const lh=24,ly=cy-(cats.length*lh)/2+8;
  cats.forEach((c,i)=>{const y=ly+i*lh;s+=`<rect x="186" y="${f1(y-12)}" width="13" height="13" rx="2" fill="${PIE_C[i%PIE_C.length]}" class="pz"/><text class="lg" x="206" y="${f1(y)}">${o.noLeg&&o.noLeg.includes(i)?'?':xesc(c.n)}</text>`;});
  const H=Math.max(cy+R+10,ly+cats.length*lh);
  return svg(W,f1(H),o.alt||('Biểu đồ hình quạt tròn'+(o.title?': '+String(o.title).replace('|',' '):'')),s);
}
/* Hình tròn chia sẵn thành các hình quạt bằng nhau, mỗi hình quạt ứng với step % */
function figDiv(step,o){
  o=o||{};const n=100/step,cx=150,cy=96,R=80;let s=`<circle cx="${cx}" cy="${cy}" r="${R}" class="pc"/>`;
  for(let i=0;i<n;i++){const a=-Math.PI/2+2*Math.PI*i/n;s+=`<line class="thin" x1="${cx}" y1="${cy}" x2="${f1(cx+R*Math.cos(a))}" y2="${f1(cy+R*Math.sin(a))}"/>`;}
  const j=Math.round(n*0.7),a1=-Math.PI/2+2*Math.PI*(j+0.5)/n,px=cx+R*0.75*Math.cos(a1),py=cy+R*0.75*Math.sin(a1);
  s+=`<line class="seg" x1="${f1(px)}" y1="${f1(py)}" x2="${f1(cx-R-22)}" y2="${f1(py)}"/><text class="vs" x="${f1(cx-R-26)}" y="${f1(py+5)}" text-anchor="end">${step}%</text>`;
  return svg(300,192,o.alt||`Hình tròn được chia sẵn thành ${n} hình quạt bằng nhau, mỗi hình quạt ứng với ${step}%`,s);
}

/* ============ Kho bối cảnh ============ */
/* t: tiêu đề biểu đồ; of(x): cụm từ chỉ các đối tượng thuộc loại x; tot(N): câu cho biết tổng số; Ns: các tổng số hợp lí (chia hết cho 20) */
const lc=s=>s.charAt(0).toLowerCase()+s.slice(1);
const CTX=[
 {t:'Môn thể thao yêu thích|của học sinh lớp 7A',d:'môn thể thao yêu thích của học sinh lớp 7A',c:['Bóng đá','Cầu lông','Bơi','Cờ vua','Bóng rổ'],of:x=>`học sinh chọn “${x}”`,u:'học sinh',tot:N=>`Lớp 7A có ${nb(N)} học sinh, mỗi bạn chọn một môn.`,Ns:[40],big:'học sinh khối 7'},
 {t:'Phương tiện đến trường|của học sinh khối 7',d:'phương tiện đến trường của học sinh khối 7',c:['Xe đạp','Đi bộ','Xe buýt','Bố mẹ đưa','Xe điện'],of:x=>`học sinh chọn “${x}”`,u:'học sinh',tot:N=>`Khối 7 có ${nb(N)} học sinh, mỗi bạn chọn một phương tiện.`,Ns:[160,180,200,240,260],big:'học sinh cả trường'},
 {t:'Loại quả yêu thích|của học sinh lớp 7B',d:'loại quả yêu thích của học sinh lớp 7B',c:['Cam','Xoài','Chuối','Táo','Dưa hấu'],of:x=>`học sinh chọn “${x}”`,u:'học sinh',tot:N=>`Lớp 7B có ${nb(N)} học sinh, mỗi bạn chọn một loại quả.`,Ns:[40],big:'học sinh khối 7'},
 {t:'Hoạt động lúc rảnh rỗi|của học sinh khối 7',d:'hoạt động lúc rảnh rỗi của học sinh khối 7',c:['Đọc sách','Thể thao','Nghe nhạc','Xem phim','Vẽ tranh'],of:x=>`học sinh chọn “${x}”`,u:'học sinh',tot:N=>`Khối 7 có ${nb(N)} học sinh, mỗi bạn chọn một hoạt động.`,Ns:[180,200,220,240],big:'học sinh cả trường'},
 {t:'Các loại sách|trong thư viện trường',d:'các loại sách trong thư viện trường',c:['Sách giáo khoa','Tham khảo','Truyện','Báo, tạp chí','Sách khác'],of:x=>`cuốn thuộc loại “${x}”`,u:'cuốn',tot:N=>`Thư viện có ${nb(N)} cuốn sách và báo, tạp chí.`,Ns:[1200,1500,1800,2000,2400]},
 {t:'Các loại cây|trong vườn trường',d:'các loại cây trong vườn trường',c:['Cây ăn quả','Cây hoa','Cây bóng mát','Cây thuốc','Rau'],of:x=>`cây thuộc loại “${x}”`,u:'cây',tot:N=>`Vườn trường có ${nb(N)} cây.`,Ns:[80,100,120,140,160]},
 {t:'Màu áo bán được trong tuần|của một cửa hàng',d:'màu áo bán được trong tuần của một cửa hàng',c:['Trắng','Xanh','Đen','Đỏ','Vàng'],of:x=>`chiếc áo màu “${x}”`,u:'chiếc',tot:N=>`Trong tuần, cửa hàng bán được ${nb(N)} chiếc áo.`,Ns:[200,240,300,360,400]},
 {t:'Nhóm máu của các thành viên|một đội hiến máu',d:'nhóm máu của các thành viên một đội hiến máu',c:['Nhóm máu A','Nhóm máu B','Nhóm máu AB','Nhóm máu O'],of:x=>`người có “${x}”`,u:'người',tot:N=>`Đội hiến máu có ${nb(N)} người.`,Ns:[100,120,160,200]},
 {t:'Món ăn sáng yêu thích|của học sinh lớp 7C',d:'món ăn sáng yêu thích của học sinh lớp 7C',c:['Phở','Bánh mì','Xôi','Bún','Cháo'],of:x=>`học sinh chọn “${x}”`,u:'học sinh',tot:N=>`Lớp 7C có ${nb(N)} học sinh, mỗi bạn chọn một món.`,Ns:[40],big:'học sinh khối 7'}
];
/* k tỉ lệ là bội của step, mỗi tỉ lệ ≥ mn, khác nhau đôi một, tổng 100 */
function parts(k,step,mn,tot){
  step=step||5;mn=mn||10;tot=tot||100;
  for(let t=0;t<400;t++){const u=tot/step,v=Array(k).fill(mn/step);let rest=u-k*mn/step;if(rest<0)break;
    while(rest>0){v[ri(0,k-1)]++;rest--;}
    if(new Set(v).size===k&&Math.max(...v)*step<=(tot===100?60:tot*0.6))return v.map(x=>x*step);}
  throw new Error('parts');
}
/* một bộ dữ liệu: bối cảnh, k loại, tỉ lệ */
function DS(k,step,mn,ctx){
  k=k||ri(4,5);const C=ctx||sel(CTX.filter(c=>c.c.length>=k));k=Math.min(k,C.c.length);
  const names=C.c.slice(0,k),ps=parts(k,step,mn);
  return {C,cats:names.map((n,i)=>({n,p:ps[i]})),N:sel(C.Ns)};
}
const pieOf=(D,o)=>fb(figPie(D.cats,Object.assign({title:D.C.t},o||{})));
const lead=D=>`Biểu đồ hình quạt tròn dưới đây cho biết tỉ lệ ${D.C.d}.`;
const cnt=(N,p)=>r2(N*p/100);

/* ============ Công cụ soạn câu ============ */
const mk=(stem,right,wrongs,exp,extra)=>Object.assign({stem,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),ans:0,exp},extra||{});
/* chọn 3 lựa chọn sai khác nhau và khác đáp án đúng; không đủ thì trả về null để sinh lại */
function pick3(right,cands){const seen=new Set([String(right)]),w=[];for(const c of cands){const k=String(c[0]);if(c[0]==null||seen.has(k))continue;seen.add(k);w.push(c);if(w.length===3)break;}return w.length===3?w:null;}
function retry(f){for(let i=0;i<300;i++){let r=null;try{r=f();}catch(e){if(e.message!=='parts')throw e;}if(r)return r;}throw new Error('Bộ sinh không tạo được câu');}
const alt=(t,...c)=>{const x=c.find(z=>Math.abs(z-t)>1e-9&&z>0);return x==null?t+1:x;};
const okN=x=>Number.isFinite(x)&&x>0&&Math.abs(x-Math.round(x))<1e-9;

/* ============ Câu nhiều lựa chọn ============ */
const MC=[
 {id:'s_dd1',type:'mc',topic:'dd',level:'NB',stem:'Biểu đồ hình quạt tròn thường được dùng để:',ans:0,opts:[
   {t:'so sánh các phần trong toàn bộ dữ liệu'},
   {t:'liệt kê từng giá trị của dữ liệu theo thứ tự thu thập',err:'Liệt kê từng giá trị là việc của dãy dữ liệu hoặc bảng, không phải của biểu đồ hình quạt tròn.'},
   {t:'cho biết số lượng chính xác của từng đối tượng được khảo sát',err:'Số ghi trên biểu đồ hình quạt tròn là tỉ lệ phần trăm, không phải số lượng.'},
   {t:'tính tổng các số liệu thu thập được',err:'Biểu đồ dùng để so sánh các phần với nhau và với toàn bộ, không dùng để tính tổng.'}],
  exp:'Biểu đồ hình quạt tròn dùng để so sánh các phần trong toàn bộ dữ liệu: mỗi hình quạt biểu diễn tỉ lệ của một phần so với toàn bộ.'},
 {id:'s_dd2',type:'mc',topic:'dd',level:'NB',stem:'Trong biểu đồ hình quạt tròn, cả hình tròn biểu diễn:',ans:0,opts:[
   {t:'toàn bộ dữ liệu, ứng với 100%'},
   {t:'phần lớn nhất của dữ liệu',err:'Phần lớn nhất được biểu diễn bởi hình quạt lớn nhất, không phải cả hình tròn.'},
   {t:'một nửa dữ liệu, ứng với 50%',err:'Một nửa hình tròn mới ứng với 50%; cả hình tròn ứng với 100%.'},
   {t:'số đối tượng được khảo sát, ứng với 360%',err:'Tỉ lệ của toàn bộ dữ liệu là 100%, không có tỉ lệ 360%.'}],
  exp:'Cả hình tròn biểu diễn toàn bộ dữ liệu, tức là ứng với 100%.'},
 {id:'s_dd3',type:'mc',topic:'dd',level:'NB',stem:'Các thành phần của một biểu đồ hình quạt tròn gồm:',ans:0,opts:[
   {t:'tiêu đề, hình tròn biểu diễn dữ liệu và chú giải'},
   {t:'tiêu đề, trục ngang, trục đứng và các cột',err:'Trục ngang, trục đứng và các cột là thành phần của biểu đồ cột.'},
   {t:'chỉ có hình tròn được chia thành các hình quạt',err:'Thiếu tiêu đề (biểu đồ nói về điều gì) và chú giải (mỗi hình quạt biểu diễn loại nào).'},
   {t:'bảng số liệu và hình tròn',err:'Bảng số liệu không phải là thành phần của biểu đồ; biểu đồ gồm tiêu đề, hình tròn biểu diễn dữ liệu và chú giải.'}],
  exp:'Biểu đồ hình quạt tròn gồm: tiêu đề, hình tròn biểu diễn dữ liệu (chia thành các hình quạt) và chú giải.'},
 {id:'s_bd1',type:'mc',topic:'bd',level:'NB',stem:'Trong biểu đồ hình quạt tròn, phần hình quạt ứng với một nửa hình tròn biểu diễn tỉ lệ:',ans:0,opts:[
   {t:'50%'},{t:'25%',err:'25% ứng với 1/4 hình tròn.'},{t:'100%',err:'100% ứng với cả hình tròn.'},{t:'180%',err:'Tỉ lệ trong biểu đồ không vượt quá 100%; một nửa hình tròn ứng với 100% : 2 = 50%.'}],
  exp:'Cả hình tròn ứng với 100% nên một nửa hình tròn ứng với 100% : 2 = 50%.'},
 {id:'s_bd2',type:'mc',topic:'bd',level:'NB',stem:'Trong một biểu đồ hình quạt tròn, hai hình quạt giống nhau (bằng nhau) biểu diễn:',ans:0,opts:[
   {t:'cùng một tỉ lệ'},
   {t:'hai tỉ lệ có tổng bằng 100%',err:'Hai hình quạt có tổng 100% thì phải phủ kín hình tròn; hai hình quạt giống nhau thì biểu diễn cùng một tỉ lệ.'},
   {t:'hai tỉ lệ đều bằng 50%',err:'Chỉ khi biểu đồ có đúng hai hình quạt giống nhau thì mỗi hình quạt mới là 50%.'},
   {t:'hai tỉ lệ khác nhau',err:'Hai hình quạt giống nhau biểu diễn cùng một tỉ lệ.'}],
  exp:'Hai hình quạt giống nhau biểu diễn cùng một tỉ lệ. Hình quạt nào lớn hơn biểu diễn tỉ lệ lớn hơn.'},
 {id:'s_ud1',type:'mc',topic:'ud',level:'TH',stem:'Một khảo sát cho biết khoảng 30% học sinh của một tỉnh bị cận thị. Một trường trung học ở tỉnh đó có 1 000 học sinh. Nhận định nào sau đây đúng nhất?',ans:0,opts:[
   {t:'Trường đó có khoảng 300 học sinh bị cận thị; đây chỉ là con số ước lượng'},
   {t:'Trường đó chắc chắn có đúng 300 học sinh bị cận thị',err:'Tỉ lệ từ khảo sát chỉ giúp dự đoán (ước lượng); số học sinh cận thị thực tế của trường có thể khác 300.'},
   {t:'Trường đó có khoảng 30 học sinh bị cận thị',err:'1 000 · 30% = 1 000 · 30/100 = 300, không phải 30.'},
   {t:'Trường đó có khoảng 700 học sinh bị cận thị',err:'700 là số học sinh KHÔNG bị cận thị (ước lượng).'}],
  exp:'1 000 · 30% = 1 000 · 30/100 = 300. Đây là con số dự đoán (ước lượng) dựa vào tỉ lệ của cả tỉnh, không chắc chắn đúng.'}
];
const addMC=(id,topic,level,gen,extra)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},extra||{}));

/* --- Đọc biểu đồ --- */
function gDdRead(){return retry(()=>{
  const D=DS(),i=ri(0,D.cats.length-1),x=D.cats[i],o=D.cats.filter((_,j)=>j!==i);
  const w=pick3(P(x.p),shuffle([[P(o[0].p),`${P(o[0].p)} là tỉ lệ của “${o[0].n}”; hãy dùng chú giải để tìm đúng hình quạt.`],[P(o[1].p),`${P(o[1].p)} là tỉ lệ của “${o[1].n}”.`],[P(100-x.p),`${P(100-x.p)} là tỉ lệ của tất cả các loại còn lại.`],[nf(x.p),'Thiếu đơn vị %: số ghi trên hình quạt là tỉ lệ phần trăm.']]));
  if(!w)return null;
  return mk(lead(D)+` Tỉ lệ ${D.C.of(x.n)} là:`,P(x.p),w,`Hình quạt ứng với “${x.n}” (xem chú giải) ghi ${P(x.p)}.`,{fig:pieOf(D)});
});}
function gDdMax(){return retry(()=>{
  const D=DS(),big=RNG()<.5,s=D.cats.slice().sort((a,b)=>a.p-b.p),x=big?s[s.length-1]:s[0];
  const w=pick3(x.n,shuffle(D.cats.filter(c=>c!==x)).map(c=>[c.n,`“${c.n}” chiếm ${P(c.p)}, ${big?'nhỏ':'lớn'} hơn ${P(x.p)} của “${x.n}”.`]));
  if(!w)return null;
  return mk(lead(D)+` Loại nào chiếm tỉ lệ ${big?'lớn':'nhỏ'} nhất?`,x.n,w,`Hình quạt ${big?'lớn':'nhỏ'} nhất ứng với “${x.n}” (${P(x.p)}).`,{fig:pieOf(D)});
});}
function gDdWhich(){return retry(()=>{
  const D=DS(),x=sel(D.cats);
  const w=pick3(x.n,shuffle(D.cats.filter(c=>c!==x)).map(c=>[c.n,`“${c.n}” chiếm ${P(c.p)}, không phải ${P(x.p)}.`]));
  if(!w)return null;
  return mk(lead(D)+` Loại nào chiếm ${P(x.p)}?`,x.n,w,`Hình quạt ghi ${P(x.p)} ứng với “${x.n}” trong chú giải.`,{fig:pieOf(D)});
});}
function gDdCount(){return retry(()=>{
  const D=DS(ri(3,5)),k=D.cats.length;
  const w=pick3(String(k),[[String(k+1),'Đếm thừa: chỉ đếm các hình quạt (các mục trong chú giải).'],[String(k-1),'Đếm thiếu một hình quạt.'],['100','100% là tỉ lệ của cả hình tròn, không phải số hình quạt.'],[String(k+2),'Đếm thừa: chỉ đếm các hình quạt.']]);
  if(!w)return null;
  return mk(lead(D)+' Hình tròn trong biểu đồ được chia thành mấy hình quạt?',String(k),w,`Chú giải có ${k} mục, hình tròn được chia thành ${k} hình quạt, mỗi hình quạt biểu diễn tỉ lệ của một loại.`,{fig:pieOf(D)});
});}
/* hai loại có cùng tỉ lệ */
function gDdEqual(){return retry(()=>{
  const C=sel(CTX),k=4,e=sel([15,20,25]),rest=100-2*e;let a,b;
  do{a=5*ri(2,(rest-10)/5);b=rest-a;}while(a===b||a===e||b===e||a<10||b<10);
  const ps=shuffle([e,e,a,b]),cats=C.c.slice(0,k).map((n,i)=>({n,p:ps[i]})),D={C,cats};
  const eq=cats.filter(c=>c.p===e).map(c=>c.n),ne=cats.filter(c=>c.p!==e).map(c=>c.n);
  const R=`${eq[0]} và ${eq[1]}`;
  const w=pick3(R,[[`${ne[0]} và ${ne[1]}`,`Hai loại này có tỉ lệ ${P(a)} và ${P(b)}, khác nhau.`],[`${eq[0]} và ${ne[0]}`,'Hai hình quạt này không bằng nhau, tỉ lệ khác nhau.'],[`${ne[1]} và ${eq[1]}`,'Hai hình quạt này không bằng nhau, tỉ lệ khác nhau.']]);
  if(!w)return null;
  return mk(lead(D)+' Hai loại nào có cùng tỉ lệ?',R,w,`“${eq[0]}” và “${eq[1]}” cùng chiếm ${P(e)}: hai hình quạt giống nhau biểu diễn cùng một tỉ lệ.`,{fig:pieOf(D)});
});}
/* hình quạt chiếm nửa (hoặc 1/4) hình tròn, tỉ lệ bị che */
function gDdHalf(){return retry(()=>{
  const C=sel(CTX),h=sel([50,25]),k=h===50?ri(3,4):4,rest=100-h;
  const o=parts(k-1,5,10,rest);if(o.includes(h))return null;
  const ps=[h].concat(o),cats=C.c.slice(0,k).map((n,i)=>({n,p:ps[i]})),D={C,cats};
  const w=pick3(P(h),[[P(h===50?25:50),h===50?'25% ứng với 1/4 hình tròn.':'50% ứng với một nửa hình tròn.'],[P(100-h),`${P(100-h)} là tổng tỉ lệ của các loại còn lại.`],[P(h===50?180:90),'Số đo này là số đo góc, không phải tỉ lệ phần trăm.'],[P(h/2),'Tính sai phần của hình tròn.']]);
  if(!w)return null;
  return mk(lead(D)+` Hình quạt biểu diễn “${cats[0].n}” ứng với ${h===50?'một nửa':'1/4'} hình tròn (tỉ lệ bị che bởi dấu ?). Tỉ lệ ${C.of(cats[0].n)} là:`,P(h),w,`Cả hình tròn ứng với 100% nên ${h===50?'một nửa hình tròn ứng với 50%':'1/4 hình tròn ứng với 100% : 4 = 25%'}. Cũng có thể tính: 100% − (${o.map(P).join(' + ')}) = ${P(h)}.`,{fig:pieOf(D,{hide:[0]})});
});}
/* chọn bảng thống kê đúng với biểu đồ */
function gDdTable(){return retry(()=>{
  const D=DS(4),c=D.cats,row=v=>c.map((x,i)=>`${x.n}: ${P(v[i])}`).join('; ');
  const v0=c.map(x=>x.p);const sw=(i,j)=>{const v=v0.slice();[v[i],v[j]]=[v[j],v[i]];return v;};
  const i=ri(0,3),j=(i+ri(1,3))%4,k2=(j+1)%4===i?(j+2)%4:(j+1)%4;
  const rev=v0.slice().reverse();
  const w=pick3(row(v0),[[row(sw(i,j)),`Đổi chỗ tỉ lệ của “${c[i].n}” và “${c[j].n}”; hãy đối chiếu màu trong chú giải.`],[row(sw(j,k2)),`Đổi chỗ tỉ lệ của “${c[j].n}” và “${c[k2].n}”.`],[row(rev),'Ghi tỉ lệ theo thứ tự ngược lại, không khớp với chú giải.'],[row(sw(i,k2)),`Đổi chỗ tỉ lệ của “${c[i].n}” và “${c[k2].n}”.`]]);
  if(!w)return null;
  return mk(lead(D)+' Bảng thống kê nào sau đây đúng với biểu đồ?',row(v0),w,`Đọc lần lượt từng hình quạt theo chú giải: ${row(v0)}.`,{fig:pieOf(D)});
});}
/* --- Biểu diễn dữ liệu --- */
function tableP(D,hideIdx){return `<div class="tablewrap"><table class="dt"><tr><th>Loại</th>${D.cats.map(c=>`<th>${c.n}</th>`).join('')}</tr><tr><td>Tỉ lệ</td>${D.cats.map((c,i)=>`<td>${i===hideIdx?'?':P(c.p)}</td>`).join('')}</tr></table></div>`;}
function tableN(D,vals,hdr){return `<div class="tablewrap"><table class="dt"><tr><th>Loại</th>${D.cats.map(c=>`<th>${c.n}</th>`).join('')}</tr><tr><td>${hdr||'Số lượng'}</td>${vals.map(v=>`<td>${nb(v)}</td>`).join('')}</tr></table></div>`;}
function gBdMiss(){return retry(()=>{
  const D=DS(),i=ri(0,D.cats.length-1),x=D.cats[i],sum=100-x.p;
  const w=pick3(P(x.p),[[P(sum),`${P(sum)} là tổng tỉ lệ các loại đã biết; còn phải lấy 100% trừ đi.`],[P(x.p+10),'Tính sai phép trừ: 100% trừ tổng các tỉ lệ đã biết.'],[P(x.p-5),'Tính sai phép trừ: 100% trừ tổng các tỉ lệ đã biết.'],[P(100),'Tổng các tỉ lệ là 100%, không phải tỉ lệ của một loại.']].filter(z=>parseFloat(z[0])>0));
  if(!w)return null;
  return mk(`Bảng sau cho biết tỉ lệ ${D.C.d}, trong đó một tỉ lệ bị che.${tableP(D,i)}Để vẽ biểu đồ hình quạt tròn, cần biết tỉ lệ còn thiếu. Tỉ lệ ${D.C.of(x.n)} là:`,P(x.p),w,`Tổng các tỉ lệ bằng 100% nên tỉ lệ còn thiếu là 100% − (${D.cats.filter((_,j)=>j!==i).map(c=>P(c.p)).join(' + ')}) = 100% − ${P(sum)} = ${P(x.p)}.`);
});}
function gBdPct(){return retry(()=>{
  const D=DS(ri(3,4)),N=sel([40,80,200,400,500]),v=D.cats.map(c=>cnt(N,c.p));if(!v.every(okN))return null;
  const i=ri(0,v.length-1),x=D.cats[i],o=v[(i+1)%v.length];
  const c1=r2(v[i]/o*100);
  const w=pick3(P(x.p),[[Number.isInteger(c1)&&c1!==x.p?P(c1):null,`Chia cho số lượng của “${D.cats[(i+1)%v.length].n}”; phải chia cho TỔNG số lượng.`],[P(v[i]),'Số lượng không phải là tỉ lệ; phải chia cho tổng số lượng.'],[P(100-x.p),`${P(100-x.p)} là tỉ lệ của các loại còn lại.`],[P(r2(x.p/2)),'Tính sai phép chia.'],[P(x.p+5),'Tính sai phép chia.']].filter(z=>z[0]&&parseFloat(z[0].replace(',','.'))>0));
  if(!w)return null;
  return mk(`Kết quả khảo sát về ${D.C.d} được ghi trong bảng thống kê sau.${tableN(D,v)}Khi biểu diễn bằng biểu đồ hình quạt tròn, tỉ lệ ${D.C.of(x.n)} là:`,P(x.p),w,`Tổng số lượng: ${v.map(nb).join(' + ')} = ${nb(N)}. Tỉ lệ: ${nb(v[i])}/${nb(N)} = ${P(x.p)}.`);
});}
function gBdSect(){return retry(()=>{
  const step=sel([10,5]),p=step===10?10*ri(1,7):5*ri(2,15);if(p%10===0&&step===5&&RNG()<.5)return null;
  const n=p/step;
  const w=pick3(String(n),[[String(p),`${p} là tỉ lệ (%), chưa chia cho ${step}%.`],[String(step===10?p/5:p/10),`Mỗi hình quạt ứng với ${step}%, không phải ${step===10?5:10}%.`],[String(n+1),'Tính sai phép chia.'],[String(100/step-n),'Đây là số hình quạt còn lại không tô.']].filter(z=>+z[0]>0&&Number.isInteger(+z[0])));
  if(!w)return null;
  return mk(`Hình tròn dưới đây được chia sẵn thành ${100/step} hình quạt bằng nhau, mỗi hình quạt ứng với ${step}%. Để biểu diễn tỉ lệ ${P(p)}, cần tô màu bao nhiêu hình quạt?`,String(n),w,`Số hình quạt cần tô: ${p}% : ${step}% = ${n}.`,{fig:fb(figDiv(step))});
});}
/* chú giải còn thiếu */
function gBdLegend(){return retry(()=>{
  const D=DS(4),i=ri(0,3),x=D.cats[i];
  const w=pick3(x.n,shuffle(D.cats.filter(c=>c!==x)).map(c=>[c.n,`“${c.n}” chiếm ${P(c.p)} trong bảng, không phải ${P(x.p)}.`]));
  if(!w)return null;
  return mk(`Bảng sau cho biết tỉ lệ ${D.C.d}.${tableP(D)}Bạn Mai đã vẽ biểu đồ hình quạt tròn nhưng chưa ghi xong chú giải. Mục chú giải có dấu ? ứng với loại nào?`,x.n,w,`Hình quạt ứng với mục có dấu ? ghi ${P(x.p)}; trong bảng, ${P(x.p)} là tỉ lệ của “${x.n}”.`,{fig:pieOf(D,{noLeg:[i]})});
});}
/* --- So sánh, nhận xét --- */
function gSsSum(){return retry(()=>{
  const D=DS(),[a,b]=shuffle(D.cats).slice(0,2);
  const w=pick3(P(a.p+b.p),[[P(100-a.p-b.p),'Đây là tổng tỉ lệ của các loại còn lại.'],[P(Math.abs(a.p-b.p)),'Phải cộng hai tỉ lệ, không trừ.'],[P(a.p+b.p+10),'Cộng sai.'],[P(a.p+b.p-5),'Cộng sai.']].filter(z=>parseFloat(z[0])>0));
  if(!w)return null;
  return mk(lead(D)+` Tổng tỉ lệ ${D.C.of(a.n)} và ${D.C.of(b.n)} là:`,P(a.p+b.p),w,`${P(a.p)} + ${P(b.p)} = ${P(a.p+b.p)}.`,{fig:pieOf(D)});
});}
function gSsDiff(){return retry(()=>{
  const D=DS(),[a,b]=shuffle(D.cats).slice(0,2);if(a.p<=b.p)return null;const d=a.p-b.p;
  const w=pick3(P(d),[[P(a.p+b.p),'Phải trừ hai tỉ lệ, không cộng.'],[P(100-d),'Không lấy 100% trừ đi.'],[P(a.p),`${P(a.p)} là tỉ lệ của “${a.n}”.`],[P(d+5),'Trừ sai.']]);
  if(!w)return null;
  return mk(lead(D)+` Tỉ lệ ${D.C.of(a.n)} lớn hơn tỉ lệ ${D.C.of(b.n)} bao nhiêu?`,P(d),w,`${P(a.p)} − ${P(b.p)} = ${P(d)}.`,{fig:pieOf(D)});
});}
function gSsTimes(){return retry(()=>{
  const C=sel(CTX),q=sel([10,15,20]),m=sel([2,3]),a=q*m;if(a+q>90)return null;
  const o=parts(2,5,10,100-a-q);if(o.some(x=>x===a||x===q))return null;
  const ps=shuffle([a,q].concat(o)),cats=C.c.slice(0,4).map((n,i)=>({n,p:ps[i]})),D={C,cats};
  const A=cats.find(c=>c.p===a),B=cats.find(c=>c.p===q);
  const w=pick3(`${m} lần`,[[`${a-q} lần`,`${a-q}% là hiệu hai tỉ lệ, không phải số lần.`],[`${m+1} lần`,'Chia sai.'],[`${a+q} lần`,'Phải chia hai tỉ lệ cho nhau.'],[`${m-1} lần`,`“${A.n}” nhiều hơn “${B.n}” ${m-1} phần nữa, tức là gấp ${m} lần.`]].filter(z=>parseInt(z[0])>0));
  if(!w)return null;
  return mk(lead(D)+` Số ${D.C.of(A.n)} gấp mấy lần số ${D.C.of(B.n)}?`,`${m} lần`,w,`Trong cùng một biểu đồ, tỉ lệ gấp mấy lần thì số lượng cũng gấp bấy nhiêu lần: ${P(a)} : ${P(q)} = ${m}.`,{fig:pieOf(D)});
});}
function gSsRank(){return retry(()=>{
  const D=DS(4),s=D.cats.slice().sort((a,b)=>b.p-a.p),R=s.map(c=>c.n).join(', ');
  const w=pick3(R,[[s.slice().reverse().map(c=>c.n).join(', '),'Đây là thứ tự tăng dần, câu hỏi yêu cầu giảm dần.'],[D.cats.map(c=>c.n).join(', '),'Đây là thứ tự trong chú giải, chưa sắp xếp theo tỉ lệ.'],[[s[1],s[0],s[2],s[3]].map(c=>c.n).join(', '),`“${s[0].n}” (${P(s[0].p)}) lớn hơn “${s[1].n}” (${P(s[1].p)}).`],[[s[0],s[2],s[1],s[3]].map(c=>c.n).join(', '),`“${s[1].n}” (${P(s[1].p)}) lớn hơn “${s[2].n}” (${P(s[2].p)}).`],[[s[0],s[1],s[3],s[2]].map(c=>c.n).join(', '),`“${s[2].n}” (${P(s[2].p)}) lớn hơn “${s[3].n}” (${P(s[3].p)}).`]]);
  if(!w)return null;
  return mk(lead(D)+' Sắp xếp các loại theo thứ tự tỉ lệ giảm dần:',R,w,`${s.map(c=>`${c.n} (${P(c.p)})`).join(' > ')}.`,{fig:pieOf(D)});
});}
/* nhận xét đúng */
function gSsClaim(){return retry(()=>{
  const D=DS(4),c=D.cats,s=c.slice().sort((a,b)=>b.p-a.p);
  const T=[],F=[];
  const st=(v,t,why)=>(v?T:F).push([t,why]);
  const a=s[0],b=s[3],x=s[1],y=s[2];
  st(a.p>50,`“${a.n}” chiếm hơn một nửa`,a.p>50?'':`“${a.n}” chiếm ${P(a.p)}, không vượt quá 50% (một nửa).`);
  st(x.p+y.p===a.p+b.p,`Tổng tỉ lệ của “${x.n}” và “${y.n}” bằng tổng tỉ lệ của “${a.n}” và “${b.n}”`,`${P(x.p)} + ${P(y.p)} = ${P(x.p+y.p)} còn ${P(a.p)} + ${P(b.p)} = ${P(a.p+b.p)}.`);
  st(a.p===2*b.p,`Tỉ lệ của “${a.n}” gấp đôi tỉ lệ của “${b.n}”`,`${P(a.p)} : ${P(b.p)} khác 2.`);
  st(x.p+y.p+b.p<a.p,`Tỉ lệ của “${a.n}” lớn hơn tổng tỉ lệ ba loại còn lại`,`Ba loại còn lại chiếm ${P(100-a.p)}, không nhỏ hơn ${P(a.p)}.`);
  st(b.p>y.p,`“${b.n}” chiếm tỉ lệ lớn hơn “${y.n}”`,`${P(b.p)} < ${P(y.p)}.`);
  st(y.p+b.p>=x.p+0,`Tổng tỉ lệ của “${y.n}” và “${b.n}” không nhỏ hơn tỉ lệ của “${x.n}”`,`${P(y.p)} + ${P(b.p)} = ${P(y.p+b.p)} < ${P(x.p)}.`);
  st(a.p-b.p<=30,`Tỉ lệ của “${a.n}” hơn tỉ lệ của “${b.n}” không quá 30%`,`${P(a.p)} − ${P(b.p)} = ${P(a.p-b.p)}, lớn hơn 30%.`);
  T.push([`Tổng tỉ lệ của “${x.n}” và “${y.n}” là ${P(x.p+y.p)}`,'']);
  if(F.length<3)return null;
  const t=sel(T),f=shuffle(F).slice(0,3);
  return mk(lead(D)+' Nhận xét nào sau đây đúng?',t[0],f,`Đọc tỉ lệ: ${c.map(z=>`${z.n} ${P(z.p)}`).join('; ')}. Nhận xét “${t[0]}” đúng.`,{fig:pieOf(D)});
});}
/* ba loại có tỉ lệ lớn nhất ngoài một loại cho trước */
function gSsTop3(){return retry(()=>{
  const D=DS(5),s=D.cats.slice().sort((a,b)=>b.p-a.p),ex=sel(s.slice(0,3)),r=s.filter(c=>c!==ex),t3=r.slice(0,3),R=t3.reduce((u,c)=>u+c.p,0);
  const top3=s.slice(0,3).reduce((u,c)=>u+c.p,0);
  const w=pick3(P(R),[[P(top3),`Đã tính cả “${ex.n}”; câu hỏi yêu cầu không tính loại này.`],[P(100-R),'Đây là tổng tỉ lệ của các loại còn lại.'],[P(r[1].p+r[2].p+r[3].p),'Chưa chọn đúng ba loại lớn nhất.'],[P(R+5),'Cộng sai.']]);
  if(!w)return null;
  return mk(lead(D)+` Không kể “${ex.n}”, ba loại chiếm tỉ lệ lớn nhất chiếm tổng cộng bao nhiêu phần trăm?`,P(R),w,`Không kể “${ex.n}”, ba loại lớn nhất là ${t3.map(c=>`${c.n} (${P(c.p)})`).join(', ')}. Tổng: ${t3.map(c=>P(c.p)).join(' + ')} = ${P(R)}.`,{fig:pieOf(D)});
});}
/* --- Tính số lượng, dự đoán --- */
function gUdNum(){return retry(()=>{
  const D=DS(),N=D.N,x=sel(D.cats),y=sel(D.cats.filter(c=>c!==x)),v=cnt(N,x.p);if(!okN(v))return null;
  const w=pick3(nb(v),[[nb(x.p),'Đây là tỉ lệ, chưa nhân với tổng số.'],[nb(cnt(N,y.p)),`Đây là số ${D.C.of(y.n)}.`],[nb(N-v),'Đây là số đối tượng thuộc các loại còn lại.'],[nb(r2(N*x.p/10)),'Nhân sai: p% = p/100.']].filter(z=>z[0]!=='0'));
  if(!w)return null;
  return mk(lead(D)+` ${D.C.tot(N)} Số ${D.C.of(x.n)} là:`,nb(v),w,`${nb(N)} · ${P(x.p)} = ${nb(N)} · ${x.p}/100 = ${nb(v)}.`,{fig:pieOf(D)});
});}
function gUdPred(){return retry(()=>{
  const C=sel(CTX.filter(c=>c.big)),D=DS(null,5,10,C),x=sel(D.cats),M=sel([200,300,400,500,600,800]),v=cnt(M,x.p);if(!okN(v))return null;
  const w=pick3(nb(v),[[nb(M-v),'Đây là số học sinh KHÔNG chọn loại này.'],[nb(x.p),'Đây là tỉ lệ, chưa nhân với số học sinh.'],[nb(r2(v*2)),'Nhân sai.'],[nb(r2(M/x.p)),'Phải nhân với p%, không chia cho p.']].filter(z=>okN(parseFloat(z[0].replace(/\s/g,'')))));
  if(!w)return null;
  return mk(lead(D)+` Hãy dự đoán trong ${nb(M)} ${C.big} có khoảng bao nhiêu bạn chọn “${x.n}”.`,nb(v),w,`Khoảng ${nb(M)} · ${P(x.p)} = ${nb(M)} · ${x.p}/100 = ${nb(v)} bạn (con số ước lượng).`,{fig:pieOf(D)});
});}
function gUdTotal(){return retry(()=>{
  const D=DS(),x=sel(D.cats),N=D.N,v=cnt(N,x.p);if(!okN(v))return null;
  const w=pick3(nb(N),[[nb(r2(v*x.p/100)),'Phải chia cho p%, không nhân.'],[nb(v+x.p),'Không cộng số lượng với tỉ lệ.'],[nb(r2(v*x.p)),'Phải chia cho p% = p/100, không nhân với p.'],[nb(r2(v*(100-x.p)/x.p)),'Đây là số đối tượng của các loại còn lại, chưa phải tổng số.']].filter(z=>{const q=parseFloat(z[0].replace(/\s/g,'').replace(',','.'));return q>0;}));
  if(!w)return null;
  return mk(lead(D)+` Biết có ${nb(v)} ${D.C.of(x.n)}. Tổng số ${D.C.u} là:`,nb(N),w,`${nb(v)} ứng với ${P(x.p)} nên tổng số là ${nb(v)} : ${P(x.p)} = ${nb(v)} · 100/${x.p} = ${nb(N)}.`,{fig:pieOf(D)});
});}
function gUdOther(){return retry(()=>{
  const D=DS(),N=D.N,[x,y]=shuffle(D.cats).slice(0,2),vx=cnt(N,x.p),vy=cnt(N,y.p);if(!okN(vx)||!okN(vy))return null;
  const w=pick3(nb(vy),[[nb(N),`${nb(N)} là tổng số, chưa nhân với ${P(y.p)}.`],[nb(r2(vx*y.p/100)),`Nhân ${nb(vx)} với ${P(y.p)} là sai; ${nb(vx)} chỉ là số của “${x.n}”, phải tìm tổng số trước.`],[nb(vx+vy),'Đây là tổng số của hai loại.'],[nb(r2(N-vy)),'Đây là số các loại còn lại.']].filter(z=>{const q=parseFloat(z[0].replace(/\s/g,'').replace(',','.'));return q>0;}));
  if(!w)return null;
  return mk(lead(D)+` Biết có ${nb(vx)} ${D.C.of(x.n)}. Số ${D.C.of(y.n)} là:`,nb(vy),w,`Tổng số: ${nb(vx)} : ${P(x.p)} = ${nb(N)}. Số ${D.C.of(y.n)}: ${nb(N)} · ${P(y.p)} = ${nb(vy)}.`,{fig:pieOf(D)});
});}
/* tỉ lệ bị che + tổng số → số lượng */
function gUdFill(){return retry(()=>{
  const D=DS(4),N=D.N,i=ri(0,3),x=D.cats[i],v=cnt(N,x.p);if(!okN(v))return null;
  const w=pick3(nb(v),[[nb(x.p),'Đây là tỉ lệ còn thiếu, chưa nhân với tổng số.'],[nb(N-v),'Đây là số các loại còn lại.'],[nb(cnt(N,100-x.p)),'Đây là số các loại đã biết tỉ lệ.'],[nb(v+N/20),'Tính sai tỉ lệ còn thiếu.']].filter(z=>okN(parseFloat(z[0].replace(/\s/g,'')))));
  if(!w)return null;
  return mk(lead(D)+` Tỉ lệ của “${x.n}” bị che bởi dấu ?. ${D.C.tot(N)} Số ${D.C.of(x.n)} là:`,nb(v),w,`Tỉ lệ còn thiếu: 100% − ${P(100-x.p)} = ${P(x.p)}. Số ${D.C.of(x.n)}: ${nb(N)} · ${P(x.p)} = ${nb(v)}.`,{fig:pieOf(D,{hide:[i]})});
});}
/* hai loại hơn kém nhau bao nhiêu đối tượng */
function gUdCmp(){return retry(()=>{
  const D=DS(),N=D.N,[a,b]=shuffle(D.cats).slice(0,2);if(a.p<=b.p)return null;const d=cnt(N,a.p-b.p);if(!okN(d))return null;
  const w=pick3(nb(d),[[nb(a.p-b.p),'Đây là hiệu hai tỉ lệ, chưa nhân với tổng số.'],[nb(cnt(N,a.p+b.p)),'Phải trừ, không cộng.'],[nb(cnt(N,a.p)),`Đây là số ${D.C.of(a.n)}.`],[nb(d*2),'Tính sai.']]);
  if(!w)return null;
  return mk(lead(D)+` ${D.C.tot(N)} Số ${D.C.of(a.n)} nhiều hơn số ${D.C.of(b.n)} là:`,nb(d),w,`${nb(N)} · ${P(a.p)} − ${nb(N)} · ${P(b.p)} = ${nb(cnt(N,a.p))} − ${nb(cnt(N,b.p))} = ${nb(d)}.`,{fig:pieOf(D)});
});}
/* --- Kết hợp Bài 17 --- */
function gMxKind(){
  const k=sel([0,1,2]);
  const L=[{t:'Môn thể thao yêu thích|của học sinh lớp 7A',d:'môn thể thao yêu thích của học sinh lớp 7A',c:['Bóng đá','Cầu lông','Bơi','Cờ vua']},
    {t:'Xếp loại học tập|của học sinh khối 7',d:'xếp loại học tập của học sinh khối 7',c:['Tốt','Khá','Đạt','Chưa đạt']},
    {t:'Mức độ yêu thích môn Toán|của học sinh lớp 7C',d:'mức độ yêu thích môn Toán của học sinh lớp 7C',c:['Rất thích','Thích','Bình thường','Không thích']}];
  const C=k===0?L[0]:sel(L.slice(1)),ps=parts(4,5,10),cats=C.c.map((n,i)=>({n,p:ps[i]}));
  const ord=k!==0;
  const R=ord?'Dữ liệu không là số, có thể sắp thứ tự':'Dữ liệu không là số, không thể sắp thứ tự';
  return mk(`Biểu đồ hình quạt tròn dưới đây cho biết tỉ lệ ${C.d}. Dữ liệu về ${C.d.split(' của')[0]} (các mục trong chú giải) thuộc loại nào?`,R,
    [[ord?'Dữ liệu không là số, không thể sắp thứ tự':'Dữ liệu không là số, có thể sắp thứ tự',ord?'Các mục này có thứ bậc từ cao đến thấp nên sắp thứ tự được.':'Tên các môn thể thao không có thứ bậc cao thấp nên không sắp thứ tự được.'],
     ['Dữ liệu là số (số liệu)','Các mục trong chú giải là chữ, không là số; các tỉ lệ % chỉ cho biết mỗi loại chiếm bao nhiêu.'],
     ['Không phải là dữ liệu','Các mục này là dữ liệu thu thập được từ học sinh.']],
    ord?`Các mục (${C.c.join(', ')}) không là số nhưng có thể sắp xếp từ mức cao đến mức thấp, nên là dữ liệu không là số, có thể sắp thứ tự.`:`Các mục (${C.c.join(', ')}) là tên gọi, không là số và không có thứ bậc, nên là dữ liệu không là số, không thể sắp thứ tự.`,
    {fig:fb(figPie(cats,{title:C.t}))});
}
function gMxCollect(){
  const k=ri(0,2);
  if(k===0)return mk('Lớp trưởng lớp 7A muốn vẽ biểu đồ hình quạt tròn biểu diễn tỉ lệ các môn thể thao yêu thích của các bạn trong lớp. Cách thu thập dữ liệu phù hợp nhất là:','Lập phiếu hỏi phát cho từng bạn trong lớp',[['Làm thí nghiệm','Sở thích của các bạn không thu thập bằng thí nghiệm.'],['Quan sát các bạn chơi thể thao trong một giờ ra chơi','Quan sát một giờ ra chơi không biết được môn các bạn yêu thích nhất.'],['Tìm số liệu trên internet','Số liệu trên internet không phải sở thích của các bạn lớp 7A.']],'Muốn biết ý kiến, sở thích thì hỏi trực tiếp: lập phiếu hỏi (hoặc phỏng vấn) từng bạn.');
  if(k===1)return mk('Để vẽ biểu đồ hình quạt tròn biểu diễn tỉ lệ dân số của các châu lục năm 2020, cách thu thập dữ liệu phù hợp nhất là:','Tìm trong các nguồn có sẵn như sách, báo, internet',[['Lập phiếu hỏi các bạn trong lớp','Các bạn trong lớp không cho biết dân số các châu lục.'],['Làm thí nghiệm','Dân số không thu thập bằng thí nghiệm.'],['Quan sát và đếm người qua lại trước cổng trường','Đếm người trước cổng trường không cho biết dân số các châu lục.']],'Số liệu dân số đã được công bố nên tra cứu trong nguồn có sẵn (báo cáo, sách, báo, internet).');
  return mk('Bạn Nam muốn vẽ biểu đồ hình quạt tròn biểu diễn tỉ lệ các loại phương tiện đi qua cổng trường trong 30 phút trước giờ vào học. Cách thu thập dữ liệu phù hợp nhất là:','Quan sát và ghi chép (đếm) các phương tiện đi qua cổng trường',[['Lập phiếu hỏi các bạn trong lớp','Phiếu hỏi cho biết ý kiến; muốn đếm sự việc đang diễn ra thì quan sát.'],['Làm thí nghiệm','Không cần làm thí nghiệm để đếm phương tiện.'],['Tìm số liệu trên internet','Internet không có số phương tiện đi qua cổng trường vào buổi đó.']],'Muốn đếm sự việc đang diễn ra thì quan sát và ghi chép trực tiếp.');
}
function gMxRep(){
  const k=ri(0,1);
  const R='Chọn ngẫu nhiên học sinh ở tất cả các lớp, các khối của trường';
  const W=[['Chỉ hỏi các bạn trong câu lạc bộ bóng đá của trường','Các bạn trong câu lạc bộ bóng đá có chung sở thích, dữ liệu không đại diện cho toàn trường.'],['Chỉ hỏi các bạn nữ của khối 7','Chỉ lấy một nhóm (nữ, khối 7) thì dữ liệu không đại diện cho toàn trường.'],['Chỉ hỏi các bạn trong lớp mình','Một lớp không đại diện cho cả trường.'],['Chỉ hỏi các bạn đến thư viện vào giờ ra chơi','Các bạn đến thư viện thường thích đọc sách; dữ liệu không đại diện.']];
  return mk(k===0?'Để vẽ biểu đồ hình quạt tròn về môn thể thao yêu thích, rồi dùng biểu đồ dự đoán cho toàn trường, nên lấy dữ liệu như thế nào?':'Một nhóm học sinh khảo sát hoạt động lúc rảnh rỗi rồi vẽ biểu đồ hình quạt tròn để dự đoán cho toàn trường. Cách chọn người được hỏi nào giúp dữ liệu đại diện cho toàn trường?',R,shuffle(W).slice(0,3),'Dữ liệu đại diện cho toàn trường khi người được hỏi được chọn ngẫu nhiên, không bỏ sót nhóm nào. Khi đó tỉ lệ trên biểu đồ mới dùng để dự đoán cho toàn trường được.');
}
/* dãy dữ liệu → đếm → tỉ lệ */
function rawList(names,counts){let a=[];names.forEach((n,i)=>{for(let j=0;j<counts[i];j++)a.push(n);});return shuffle(a);}
function gMxRaw(){return retry(()=>{
  const names=sel([['Xanh','Đỏ','Vàng','Tím'],['Cam','Xoài','Chuối','Táo'],['Phở','Bánh mì','Xôi','Bún']]),n=20,cs=parts(4,5,10).map(p=>p*n/100);
  if(cs.some(c=>!okN(c)))return null;
  const i=ri(0,3),p=cs[i]*100/n,L=rawList(names,cs);
  const w=pick3(P(p),[[P(cs[i]),`${cs[i]} là số lần xuất hiện, chưa chia cho tổng ${n}.`],[P(100-p),'Đây là tỉ lệ của các loại còn lại.'],[P(p+5),'Đếm sai số lần xuất hiện.'],[P(p-5),'Đếm sai số lần xuất hiện.']].filter(z=>parseFloat(z[0])>0));
  if(!w)return null;
  return mk(`Hỏi 20 bạn về lựa chọn yêu thích, bạn Lan ghi lại được dãy dữ liệu sau:<br><i>${L.join(', ')}</i><br>Khi biểu diễn dãy dữ liệu này bằng biểu đồ hình quạt tròn, hình quạt biểu diễn “${names[i]}” ứng với tỉ lệ:`,P(p),w,`Đếm: “${names[i]}” xuất hiện ${cs[i]} lần trong ${n} lựa chọn. Tỉ lệ: ${cs[i]}/${n} = ${P(p)}.`);
});}

/* --- Bổ sung: nhận biết và kết hợp Bài 17 --- */
function gDdTitle(){return retry(()=>{
  const D=DS(),o=sel(CTX.filter(c=>c!==D.C)),T=D.C.t.replace('|',' ');
  const w=pick3(T,[[D.cats[0].n,`“${D.cats[0].n}” là một mục trong chú giải.`],['Hình tròn biểu diễn dữ liệu','Đây là tên một thành phần của biểu đồ, không phải tiêu đề.'],[o.t.replace('|',' '),'Đây là tiêu đề của một biểu đồ khác.']]);
  if(!w)return null;
  return mk(lead(D)+' Tiêu đề của biểu đồ là:',T,w,`Tiêu đề được ghi ở phía trên biểu đồ: “${T}”.`,{fig:pieOf(D)});
});}
function gBdAll(){return retry(()=>{
  const D=DS(),s3=D.cats.slice(0,-1).reduce((a,c)=>a+c.p,0);
  const w=pick3('100%',[['360%','Cả hình tròn ứng với 100%, không phải 360%.'],[P(s3),'Chưa cộng tỉ lệ của hình quạt cuối cùng.'],['50%','50% ứng với một nửa hình tròn.']]);
  if(!w)return null;
  return mk(lead(D)+' Tổng các tỉ lệ ghi trên tất cả các hình quạt của biểu đồ là:','100%',w,`${D.cats.map(c=>P(c.p)).join(' + ')} = 100%: các hình quạt ghép lại thành cả hình tròn.`,{fig:pieOf(D)});
});}
function gSsTwo(){return retry(()=>{
  const D=DS(),[a,b]=shuffle(D.cats).slice(0,2),big=a.p>b.p?a:b,sm=big===a?b:a;
  const R=`“${big.n}”`;
  const w=[[`“${sm.n}”`,`“${sm.n}” chỉ chiếm ${P(sm.p)}, nhỏ hơn ${P(big.p)}.`],['Hai loại bằng nhau',`${P(a.p)} và ${P(b.p)} khác nhau.`],['Không so sánh được vì không biết tổng số','Trong cùng một biểu đồ, so sánh trực tiếp hai tỉ lệ.']];
  return mk(lead(D)+` Giữa “${a.n}” và “${b.n}”, loại nào chiếm tỉ lệ lớn hơn?`,R,w,`${P(big.p)} > ${P(sm.p)}: hình quạt của “${big.n}” lớn hơn.`,{fig:pieOf(D)});
});}
const ORD=[{t:'Xếp loại học tập|của học sinh khối 7',d:'xếp loại học tập của học sinh khối 7',c:['Tốt','Khá','Đạt','Chưa đạt'],u:'học sinh xếp loại'},
  {t:'Mức độ yêu thích môn Toán|của học sinh lớp 7C',d:'mức độ yêu thích môn Toán của học sinh lớp 7C',c:['Rất thích','Thích','Bình thường','Không thích'],u:'học sinh chọn'}];
function ordData(){const C=sel(ORD),ps=parts(4,5,10),cats=C.c.map((n,i)=>({n,p:ps[i]}));return {C,cats,fig:fb(figPie(cats,{title:C.t}))};}
function gMxOrd(){return retry(()=>{
  const {C,cats,fig}=ordData(),k=ri(1,2),up=cats.slice(0,k+1).reduce((a,c)=>a+c.p,0),lvl=cats[k].n;
  const w=pick3(P(up),[[P(cats[k].p),`Chỉ tính mức “${lvl}”; “từ ${lvl} trở lên” gồm cả các mức cao hơn.`],[P(100-up),`Đây là tỉ lệ các mức thấp hơn “${lvl}”.`],[P(cats.slice(k).reduce((a,c)=>a+c.p,0)),`Đây là tỉ lệ từ mức “${lvl}” trở xuống.`],[P(up+5),'Cộng sai.']]);
  if(!w)return null;
  return mk(`Biểu đồ hình quạt tròn dưới đây cho biết tỉ lệ ${C.d}. Dữ liệu này là dữ liệu không là số, có thể sắp thứ tự (từ mức cao đến mức thấp: ${C.c.join(', ')}). Tỉ lệ ${C.u} từ mức “${lvl}” trở lên là:`,P(up),w,`Các mức từ “${lvl}” trở lên: ${cats.slice(0,k+1).map(c=>`${c.n} (${P(c.p)})`).join(', ')}. Tổng: ${P(up)}.`,{fig});
});}
function gMxRepr2(){return retry(()=>{
  const p=5*ri(12,16),g=sel([['câu lạc bộ đọc sách','thích đọc sách lúc rảnh rỗi','đọc sách'],['đội bóng đá của trường','thích chơi thể thao lúc rảnh rỗi','chơi thể thao'],['lớp học vẽ','thích vẽ tranh lúc rảnh rỗi','vẽ tranh']]);
  const R='Chưa hợp lí, vì dữ liệu chỉ lấy từ một nhóm có chung sở thích nên không đại diện cho cả trường';
  return mk(`Bạn Nam hỏi 40 bạn trong ${g[0]} rồi vẽ biểu đồ hình quạt tròn, thấy ${P(p)} các bạn ${g[1]}. Nam kết luận: “Khoảng ${P(p)} học sinh cả trường ${g[1]}.” Nhận xét nào đúng về kết luận của Nam?`,R,
   [['Hợp lí, vì biểu đồ được vẽ đúng',`Biểu đồ đúng với 40 bạn được hỏi, nhưng các bạn này cùng ở ${g[0]} nên không đại diện cho cả trường.`],['Hợp lí, vì 40 bạn là đủ nhiều','Hỏi nhiều bạn nhưng chỉ trong một nhóm thì dữ liệu vẫn không đại diện.'],[`Chưa hợp lí, vì tỉ lệ ${P(p)} lớn hơn 50%`,'Tỉ lệ lớn hay nhỏ không quyết định kết luận có hợp lí không; vấn đề là dữ liệu không đại diện.']],
   `Các bạn trong ${g[0]} có chung sở thích ${g[2]}, nên dữ liệu không đại diện cho cả trường (Bài 17). Muốn dự đoán cho cả trường, cần chọn ngẫu nhiên học sinh ở mọi lớp.`);
});}
[
 ['g_ddread','dd','NB',gDdRead],['g_ddmax','dd','NB',gDdMax],['g_ddwhich','dd','NB',gDdWhich],['g_ddcount','dd','NB',gDdCount],['g_ddequal','dd','NB',gDdEqual],
 ['g_ddhalf','dd','NB',gDdHalf],['g_ddtitle','dd','NB',gDdTitle],['g_bdall','bd','NB',gBdAll],['g_sstwo','ss','NB',gSsTwo],['g_mxord','ss','VD',gMxOrd,{mix:[17]}],['g_mxrepr2','ud','VD',gMxRepr2,{mix:[17]}],['g_ddtable','dd','TH',gDdTable],['g_mxkind','dd','TH',gMxKind,{mix:[17]}],
 ['g_bdmiss','bd','TH',gBdMiss],['g_bdpct','bd','TH',gBdPct],['g_bdsect','bd','TH',gBdSect],['g_bdlegend','bd','TH',gBdLegend],['g_mxcollect','bd','NB',gMxCollect,{mix:[17]}],['g_mxraw','bd','VD',gMxRaw,{mix:[17]}],
 ['g_sssum','ss','TH',gSsSum],['g_ssdiff','ss','TH',gSsDiff],['g_sstimes','ss','TH',gSsTimes],['g_ssrank','ss','TH',gSsRank],['g_ssclaim','ss','VD',gSsClaim],['g_sstop3','ss','VD',gSsTop3],
 ['g_udnum','ud','TH',gUdNum],['g_udpred','ud','TH',gUdPred],['g_udtotal','ud','VD',gUdTotal],['g_udother','ud','VD',gUdOther],['g_udfill','ud','VD',gUdFill],['g_udcmp','ud','VD',gUdCmp],['g_mxrep','ud','VD',gMxRep,{mix:[17]}]
].forEach(([id,t,l,f,x])=>addMC(id,t,l,f,x));

/* ============ Câu đúng sai ============ */
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
/* ý đúng/sai: v quyết định dùng câu đúng tt hay câu sai ff */
const IT=(v,tt,ff,tp,lv,et,ef)=>({t:v?tt:ff,v,topic:tp,level:lv,exp:v?et:ef});
function tfLoop(f){for(let n=0;n<200;n++){const u=[0,1,2,3].map(()=>RNG()<.5),r=f(u);if(r&&tfOK(r.items))return r;}throw new Error('TF');}
const TF=[
 {id:'ts_dd',type:'tf',topic:'dd',level:'NB',stem:'Xét các phát biểu về biểu đồ hình quạt tròn.',items:[
   {t:'Biểu đồ hình quạt tròn dùng để so sánh các phần trong toàn bộ dữ liệu.',v:true,topic:'dd',level:'NB',exp:'Đúng theo SGK.'},
   {t:'Mỗi hình quạt biểu diễn số lượng của một phần dữ liệu.',v:false,topic:'dd',level:'NB',exp:'Mỗi hình quạt biểu diễn TỈ LỆ của một phần so với toàn bộ dữ liệu.'},
   {t:'Hình quạt nào lớn hơn thì biểu diễn tỉ lệ lớn hơn.',v:true,topic:'ss',level:'NB',exp:'Đúng: hình quạt lớn hơn biểu diễn số liệu (tỉ lệ) lớn hơn.'},
   {t:'Chú giải cho biết mỗi hình quạt biểu diễn bao nhiêu phần trăm.',v:false,topic:'dd',level:'NB',exp:'Chú giải cho biết mỗi hình quạt (theo màu) biểu diễn loại nào; tỉ lệ được ghi trên hình quạt.'}]},
 {id:'ts_bd',type:'tf',topic:'bd',level:'NB',stem:'Xét các phát biểu về tỉ lệ biểu diễn trên biểu đồ hình quạt tròn.',items:[
   {t:'Cả hình tròn ứng với 100%.',v:true,topic:'dd',level:'NB',exp:'Cả hình tròn biểu diễn toàn bộ dữ liệu, ứng với 100%.'},
   {t:'Phần hình quạt ứng với 1/4 hình tròn biểu diễn tỉ lệ 25%.',v:true,topic:'bd',level:'NB',exp:'100% : 4 = 25%.'},
   {t:'Tổng tỉ lệ của các hình quạt trong một biểu đồ có thể lớn hơn 100%.',v:false,topic:'bd',level:'NB',exp:'Các hình quạt ghép lại vừa đủ cả hình tròn nên tổng các tỉ lệ bằng 100%.'},
   {t:'Phần hình quạt ứng với một nửa hình tròn biểu diễn tỉ lệ 180%.',v:false,topic:'bd',level:'NB',exp:'Một nửa hình tròn biểu diễn 100% : 2 = 50%.'}]}
];
const addTF=(id,topic,level,gen,extra)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},extra||{}));
function tfRead(){const D=DS(4),c=D.cats,s=c.slice().sort((a,b)=>b.p-a.p),[x,y]=shuffle(c).slice(0,2),z=sel(c.filter(q=>q!==s[0]));
  return tfLoop(u=>({stem:lead(D),fig:pieOf(D),items:[
    IT(u[0],`Tỉ lệ ${D.C.of(x.n)} là ${P(x.p)}.`,`Tỉ lệ ${D.C.of(x.n)} là ${P(y.p)}.`,'dd','NB',`Hình quạt ứng với “${x.n}” ghi ${P(x.p)}.`,`Hình quạt ứng với “${x.n}” ghi ${P(x.p)}; ${P(y.p)} là tỉ lệ của “${y.n}”.`),
    IT(u[1],`“${s[0].n}” chiếm tỉ lệ lớn nhất.`,`“${z.n}” chiếm tỉ lệ lớn nhất.`,'dd','NB',`“${s[0].n}” có hình quạt lớn nhất (${P(s[0].p)}).`,`“${z.n}” chỉ chiếm ${P(z.p)}; lớn nhất là “${s[0].n}” (${P(s[0].p)}).`),
    IT(u[2],`“${s[3].n}” chiếm tỉ lệ nhỏ nhất.`,`“${s[2].n}” chiếm tỉ lệ nhỏ nhất.`,'dd','NB',`“${s[3].n}” có hình quạt nhỏ nhất (${P(s[3].p)}).`,`“${s[3].n}” (${P(s[3].p)}) nhỏ hơn “${s[2].n}” (${P(s[2].p)}).`),
    IT(u[3],'Hình tròn được chia thành 4 hình quạt.','Hình tròn được chia thành 5 hình quạt.','dd','NB','Chú giải có 4 mục ứng với 4 hình quạt.','Chỉ có 4 hình quạt (4 mục trong chú giải).')]}));}
function tfComp(){const D=DS(ri(3,5)),k=D.cats.length,tt=D.C.t.replace('|',' ');
  return tfLoop(u=>({stem:'Quan sát biểu đồ hình quạt tròn dưới đây.',fig:pieOf(D),items:[
    IT(u[0],`Tiêu đề của biểu đồ là “${tt}”.`,`Tiêu đề của biểu đồ là “${D.cats[0].n}”.`,'dd','NB','Tiêu đề được ghi ở phía trên biểu đồ.',`“${D.cats[0].n}” là một mục trong chú giải; tiêu đề là “${tt}”.`),
    IT(u[1],`Chú giải của biểu đồ có ${k} mục.`,`Chú giải của biểu đồ có ${k+1} mục.`,'dd','NB',`Chú giải liệt kê ${k} loại.`,`Chú giải chỉ có ${k} mục.`),
    IT(u[2],'Tổng các tỉ lệ ghi trên biểu đồ bằng 100%.','Tổng các tỉ lệ ghi trên biểu đồ bằng 360%.','bd','NB',`${D.cats.map(c=>P(c.p)).join(' + ')} = 100%.`,`${D.cats.map(c=>P(c.p)).join(' + ')} = 100%.`),
    IT(u[3],`Hình quạt ứng với “${D.cats[0].n}” biểu diễn tỉ lệ ${P(D.cats[0].p)}.`,`Hình quạt ứng với “${D.cats[0].n}” biểu diễn ${D.cats[0].p} ${D.C.u}.`,'dd','NB',`Hình quạt này ghi ${P(D.cats[0].p)}.`,`Số ghi trên hình quạt là tỉ lệ ${P(D.cats[0].p)}, không phải số lượng.`)]}));}
function tfTab(){const D=DS(4),c=D.cats,s=c.slice().sort((a,b)=>b.p-a.p),half=s[0].p===50;
  return tfLoop(u=>({stem:`Bảng sau cho biết tỉ lệ ${D.C.d}. Bạn Minh dùng bảng này để vẽ biểu đồ hình quạt tròn.${tableP(D)}`,items:[
    IT(u[0],`Biểu đồ có 4 hình quạt.`,`Biểu đồ có 100 hình quạt.`,'bd','NB','Mỗi loại ứng với một hình quạt: 4 loại, 4 hình quạt.','Mỗi loại ứng với một hình quạt nên chỉ có 4 hình quạt.'),
    IT(u[1],`Hình quạt biểu diễn “${s[0].n}” là hình quạt lớn nhất.`,`Hình quạt biểu diễn “${s[3].n}” là hình quạt lớn nhất.`,'ss','NB',`“${s[0].n}” có tỉ lệ lớn nhất (${P(s[0].p)}).`,`“${s[3].n}” có tỉ lệ nhỏ nhất (${P(s[3].p)}) nên hình quạt nhỏ nhất.`),
    IT(u[2],s[0].p>50?`Hình quạt biểu diễn “${s[0].n}” lớn hơn một nửa hình tròn.`:`Hình quạt biểu diễn “${s[0].n}” không lớn hơn một nửa hình tròn.`,s[0].p>50?`Hình quạt biểu diễn “${s[0].n}” nhỏ hơn một nửa hình tròn.`:`Hình quạt biểu diễn “${s[0].n}” lớn hơn một nửa hình tròn.`,'bd','TH',`${P(s[0].p)} ${s[0].p>50?'>':'≤'} 50% (một nửa hình tròn).`,`${P(s[0].p)} ${s[0].p>50?'>':'≤'} 50% (một nửa hình tròn).`),
    IT(u[3],`Tổng tỉ lệ ghi trên bốn hình quạt là 100%.`,`Tổng tỉ lệ ghi trên bốn hình quạt là ${P(100-s[3].p)}.`,'bd','NB','Bốn hình quạt ghép lại thành cả hình tròn, ứng với 100%.',`${P(100-s[3].p)} chỉ là tổng của ba loại; cả bốn loại là 100%.`)]}));}
function tfCalc(){return retry(()=>{const D=DS(4),N=D.N,c=D.cats,v=c.map(x=>cnt(N,x.p));if(!v.every(okN))return null;const [i,j,k]=shuffle([0,1,2,3]).slice(0,3);
  return tfLoop(u=>({stem:lead(D)+' '+D.C.tot(N),fig:pieOf(D),items:[
    IT(u[0],`Có ${nb(v[i])} ${D.C.of(c[i].n)}.`,`Có ${nb(alt(v[i],c[i].p,v[i]+N/10))} ${D.C.of(c[i].n)}.`,'ud','TH',`${nb(N)} · ${P(c[i].p)} = ${nb(v[i])}.`,`${c[i].p} là tỉ lệ (%); số lượng là ${nb(N)} · ${P(c[i].p)} = ${nb(v[i])}.`),
    IT(u[1],`Có ${nb(v[j])} ${D.C.of(c[j].n)}.`,`Có ${nb(v[j]+(v[j]>N/20?-N/20:N/20))} ${D.C.of(c[j].n)}.`,'ud','TH',`${nb(N)} · ${P(c[j].p)} = ${nb(v[j])}.`,`${nb(N)} · ${P(c[j].p)} = ${nb(v[j])}.`),
    IT(u[2],`Số ${D.C.of(c[k].n)} và ${D.C.of(c[i].n)} có tổng là ${nb(v[k]+v[i])}.`,`Số ${D.C.of(c[k].n)} và ${D.C.of(c[i].n)} có tổng là ${nb(alt(v[k]+v[i],N-v[k]-v[i],v[k]+v[i]+N/10))}.`,'ud','TH',`${nb(v[k])} + ${nb(v[i])} = ${nb(v[k]+v[i])}.`,`${nb(N-v[k]-v[i])} là số của hai loại còn lại; tổng đúng là ${nb(v[k]+v[i])}.`),
    IT(u[3],`Tổng số ${D.C.u} của bốn loại là ${nb(N)}.`,`Tổng số ${D.C.u} của bốn loại là ${nb(alt(N,100,N+N/2))}.`,'ud','TH','Bốn loại ứng với toàn bộ dữ liệu.',`100% ứng với toàn bộ ${nb(N)} ${D.C.u}, không phải 100 ${D.C.u}.`)]}));});}
function tfCmp(){return retry(()=>{const C=sel(CTX),q=sel([10,15,20]),a=2*q,b=sel([q+5,q+10].filter(x=>x!==a)),d=100-a-q-b;if(d<10||[a,q,b].includes(d))return null;
  const ps=shuffle([a,q,b,d]),cats=C.c.slice(0,4).map((n,i)=>({n,p:ps[i]})),D={C,cats},f=p=>cats.find(c=>c.p===p);
  const A=f(a),Q=f(q),B=f(b),Dd=f(d);
  return tfLoop(u=>({stem:lead(D),fig:pieOf(D),items:[
    IT(u[0],`Số ${C.of(A.n)} gấp 2 lần số ${C.of(Q.n)}.`,`Số ${C.of(A.n)} gấp 3 lần số ${C.of(Q.n)}.`,'ss','TH',`${P(a)} : ${P(q)} = 2.`,`${P(a)} : ${P(q)} = 2, không phải 3.`),
    IT(u[1],`Tỉ lệ ${C.of(B.n)} lớn hơn tỉ lệ ${C.of(Q.n)} là ${P(b-q)}.`,`Tỉ lệ ${C.of(B.n)} lớn hơn tỉ lệ ${C.of(Q.n)} là ${P(b+q)}.`,'ss','TH',`${P(b)} − ${P(q)} = ${P(b-q)}.`,`Phải trừ: ${P(b)} − ${P(q)} = ${P(b-q)}.`),
    IT(u[2],`“${A.n}” và “${Dd.n}” chiếm tổng cộng ${P(a+d)}.`,`“${A.n}” và “${Dd.n}” chiếm tổng cộng ${P(alt(a+d,100-a-d,a+d+10))}.`,'ss','TH',`${P(a)} + ${P(d)} = ${P(a+d)}.`,`${P(100-a-d)} là tổng của hai loại còn lại.`),
    IT(u[3],a+d>50?`Hai loại “${A.n}” và “${Dd.n}” chiếm hơn một nửa.`:`Hai loại “${A.n}” và “${Dd.n}” chiếm không quá một nửa.`,a+d>50?`Hai loại “${A.n}” và “${Dd.n}” chiếm không quá một nửa.`:`Hai loại “${A.n}” và “${Dd.n}” chiếm hơn một nửa.`,'ss','TH',`${P(a+d)} ${a+d>50?'>':'≤'} 50%.`,`${P(a+d)} ${a+d>50?'>':'≤'} 50%.`)]}));});}
function tfCounts(){return retry(()=>{const D=DS(4),N=sel([40,80,200,400]),c=D.cats,v=c.map(x=>cnt(N,x.p));if(!v.every(okN))return null;const [i,j]=shuffle([0,1,2,3]).slice(0,2);
  return tfLoop(u=>({stem:`Kết quả khảo sát về ${D.C.d} được ghi trong bảng thống kê sau. Bạn Hà muốn biểu diễn bảng này bằng biểu đồ hình quạt tròn.${tableN(D,v)}`,items:[
    IT(u[0],`Tổng số lượng là ${nb(N)}.`,`Tổng số lượng là 100.`,'bd','NB',`${v.map(nb).join(' + ')} = ${nb(N)}.`,`${v.map(nb).join(' + ')} = ${nb(N)}.`),
    IT(u[1],`Tỉ lệ của “${c[i].n}” là ${P(c[i].p)}.`,`Tỉ lệ của “${c[i].n}” là ${P(v[i]===c[i].p?c[i].p+5:v[i])}.`,'bd','TH',`${nb(v[i])}/${nb(N)} = ${P(c[i].p)}.`,`${nb(v[i])}/${nb(N)} = ${P(c[i].p)}.`),
    IT(u[2],`Tỉ lệ của “${c[j].n}” là ${P(c[j].p)}.`,`Tỉ lệ của “${c[j].n}” là ${P(alt(c[j].p,100-c[j].p,c[j].p+10))}.`,'bd','TH',`${nb(v[j])}/${nb(N)} = ${P(c[j].p)}.`,`${nb(v[j])}/${nb(N)} = ${P(c[j].p)}; ${P(100-c[j].p)} là tỉ lệ các loại còn lại.`),
    IT(u[3],`Hình quạt biểu diễn “${c[i].n}” ${c[i].p>c[j].p?'lớn':'nhỏ'} hơn hình quạt biểu diễn “${c[j].n}”.`,`Hình quạt biểu diễn “${c[i].n}” ${c[i].p>c[j].p?'nhỏ':'lớn'} hơn hình quạt biểu diễn “${c[j].n}”.`,'ss','TH',`${nb(v[i])} ${c[i].p>c[j].p?'>':'<'} ${nb(v[j])} nên tỉ lệ và hình quạt cũng ${c[i].p>c[j].p?'lớn':'nhỏ'} hơn.`,`${nb(v[i])} ${c[i].p>c[j].p?'>':'<'} ${nb(v[j])} nên hình quạt của “${c[i].n}” ${c[i].p>c[j].p?'lớn':'nhỏ'} hơn.`)]}));});}
function tfDiv(){return retry(()=>{const ps=parts(4,5,10),D={C:sel(CTX)};D.cats=D.C.c.slice(0,4).map((n,i)=>({n,p:ps[i]}));const c=D.cats,[i,j,k]=shuffle([0,1,2,3]).slice(0,3);
  return tfLoop(u=>({stem:`Bảng sau cho biết tỉ lệ ${D.C.d}.${tableP(D)}Để vẽ biểu đồ hình quạt tròn, bạn Long dùng hình tròn được chia sẵn thành 20 hình quạt bằng nhau, mỗi hình quạt ứng với 5%.`,fig:fb(figDiv(5)),items:[
    IT(u[0],`Để biểu diễn “${c[i].n}” cần tô ${c[i].p/5} hình quạt.`,`Để biểu diễn “${c[i].n}” cần tô ${c[i].p} hình quạt.`,'bd','TH',`${P(c[i].p)} : 5% = ${c[i].p/5}.`,`${c[i].p} là tỉ lệ; số hình quạt cần tô là ${P(c[i].p)} : 5% = ${c[i].p/5}.`),
    IT(u[1],`Để biểu diễn “${c[j].n}” cần tô ${c[j].p/5} hình quạt.`,`Để biểu diễn “${c[j].n}” cần tô ${c[j].p%10===0?c[j].p/10:c[j].p/5+1} hình quạt.`,'bd','TH',`${P(c[j].p)} : 5% = ${c[j].p/5}.`,`Mỗi hình quạt ứng với 5% nên cần ${P(c[j].p)} : 5% = ${c[j].p/5} hình quạt.`),
    IT(u[2],'Tô xong cả bốn loại thì vừa hết 20 hình quạt.','Tô xong cả bốn loại thì còn thừa 2 hình quạt.','bd','TH','Tổng các tỉ lệ là 100% ứng với 100% : 5% = 20 hình quạt.','Tổng các tỉ lệ là 100% nên tô vừa hết 20 hình quạt.'),
    IT(u[3],`Số hình quạt tô cho “${c[k].n}” và “${c[i].n}” là ${(c[k].p+c[i].p)/5}.`,`Số hình quạt tô cho “${c[k].n}” và “${c[i].n}” là ${(c[k].p+c[i].p)/5+2}.`,'bd','TH',`(${P(c[k].p)} + ${P(c[i].p)}) : 5% = ${(c[k].p+c[i].p)/5}.`,`(${P(c[k].p)} + ${P(c[i].p)}) : 5% = ${(c[k].p+c[i].p)/5}.`)]}));});}
function tfPred(){return retry(()=>{const C=sel(CTX.filter(c=>c.big)),D=DS(4,5,10,C),M=sel([300,400,500,600,800]),c=D.cats,[x,y]=shuffle(c).slice(0,2),vx=cnt(M,x.p),vy=cnt(M,y.p);if(!okN(vx)||!okN(vy))return null;
  return tfLoop(u=>({stem:lead(D)+` Dựa vào biểu đồ, cô giáo dự đoán cho ${nb(M)} ${C.big}.`,fig:pieOf(D),items:[
    IT(u[0],`Có khoảng ${nb(vx)} trong ${nb(M)} ${C.big} chọn “${x.n}”.`,`Có khoảng ${nb(x.p)} trong ${nb(M)} ${C.big} chọn “${x.n}”.`,'ud','TH',`${nb(M)} · ${P(x.p)} = ${nb(vx)}.`,`${x.p} là tỉ lệ; ${nb(M)} · ${P(x.p)} = ${nb(vx)}.`),
    IT(u[1],`Có khoảng ${nb(M-vy)} trong ${nb(M)} ${C.big} không chọn “${y.n}”.`,`Có khoảng ${nb(alt(M-vy,vy,M-vy+M/10))} trong ${nb(M)} ${C.big} không chọn “${y.n}”.`,'ud','VD',`${nb(M)} · ${P(100-y.p)} = ${nb(M-vy)}.`,`${nb(vy)} là số dự đoán CHỌN “${y.n}”; không chọn là ${nb(M)} − ${nb(vy)} = ${nb(M-vy)}.`),
    IT(u[2],`Số ${C.big} chọn “${x.n}” chỉ là con số ước lượng.`,`Chắc chắn có đúng ${nb(vx)} ${C.big} chọn “${x.n}”.`,'ud','VD','Dự đoán từ biểu đồ chỉ là ước lượng.','Dự đoán từ biểu đồ chỉ là ước lượng, không chắc chắn đúng.'),
    IT(u[3],'Để dự đoán tốt hơn, dữ liệu nên được lấy từ các bạn được chọn ngẫu nhiên ở nhiều lớp khác nhau.','Để dự đoán tốt hơn, chỉ nên hỏi các bạn trong cùng một câu lạc bộ.','ud','VD','Dữ liệu từ các bạn chọn ngẫu nhiên, không bỏ sót nhóm nào thì đại diện hơn (Bài 17).','Các bạn cùng một câu lạc bộ có chung sở thích nên dữ liệu không đại diện (Bài 17).')]}));});}
function tfRev(){return retry(()=>{const D=DS(4),N=D.N,c=D.cats,[x,y]=shuffle(c).slice(0,2),vx=cnt(N,x.p),vy=cnt(N,y.p);if(!okN(vx)||!okN(vy))return null;
  return tfLoop(u=>({stem:lead(D)+` Biết có ${nb(vx)} ${D.C.of(x.n)}.`,fig:pieOf(D),items:[
    IT(u[0],`Tổng số ${D.C.u} là ${nb(N)}.`,`Tổng số ${D.C.u} là ${nb(r2(vx*x.p/100))}.`,'ud','VD',`${nb(vx)} : ${P(x.p)} = ${nb(N)}.`,`Phải chia: ${nb(vx)} : ${P(x.p)} = ${nb(N)}.`),
    IT(u[1],`Có ${nb(vy)} ${D.C.of(y.n)}.`,`Có ${nb(vy+(N>=100?N/20:2))} ${D.C.of(y.n)}.`,'ud','VD',`${nb(N)} · ${P(y.p)} = ${nb(vy)}.`,`${nb(N)} · ${P(y.p)} = ${nb(vy)}.`),
    IT(u[2],`Số ${D.C.of(x.n)} và ${D.C.of(y.n)} có tổng là ${nb(vx+vy)}.`,`Số ${D.C.of(x.n)} và ${D.C.of(y.n)} có tổng là ${nb(alt(vx+vy,cnt(N,100-x.p-y.p),vx+vy+N/10))}.`,'ud','VD',`${nb(vx)} + ${nb(vy)} = ${nb(vx+vy)}.`,`${nb(cnt(N,100-x.p-y.p))} là số của hai loại còn lại.`),
    IT(u[3],`Nếu tỉ lệ ${D.C.of(x.n)} tăng thì tỉ lệ ít nhất một loại khác phải giảm.`,`Tỉ lệ ${D.C.of(x.n)} có thể tăng mà mọi loại khác giữ nguyên tỉ lệ.`,'bd','VD','Tổng các tỉ lệ luôn bằng 100%.','Tổng các tỉ lệ luôn bằng 100% nên một tỉ lệ tăng thì phải có tỉ lệ khác giảm.')]}));});}
/* hai biểu đồ, hai tổng số khác nhau: bẫy so sánh tỉ lệ với số lượng */
function tfTwo(){return retry(()=>{const nA=40,nB=sel([20,30]),C0=['Toán','Ngữ văn','Tiếng Anh','Môn khác'];
  const a0=5*ri(5,9),b0=a0+5*ri(1,3);
  const A=parts(3,5,10,100-a0),B=parts(3,5,10,100-b0);
  const PA=[a0].concat(A),PB=[b0].concat(B),vA=PA.map(p=>cnt(nA,p)),vB=PB.map(p=>cnt(nB,p));if(!vA.concat(vB).every(okN))return null;
  if(vA[0]<=vB[0])return null;
  const cA=C0.map((n,i)=>({n,p:PA[i]})),cB=C0.map((n,i)=>({n,p:PB[i]}));
  const fig=fb(figPie(cA,{title:`Môn học yêu thích|của lớp 7A (${nA} học sinh)`}))+fb(figPie(cB,{title:`Môn học yêu thích|của lớp 7B (${nB} học sinh)`}));
  return tfLoop(u=>({stem:`Hai biểu đồ dưới đây cho biết tỉ lệ môn học yêu thích của học sinh lớp 7A (${nA} học sinh) và lớp 7B (${nB} học sinh), mỗi bạn chọn một môn.`,fig,items:[
    IT(u[0],`Tỉ lệ học sinh thích Toán của lớp 7B lớn hơn của lớp 7A.`,`Tỉ lệ học sinh thích Toán của lớp 7A lớn hơn của lớp 7B.`,'ss','TH',`${P(PB[0])} > ${P(PA[0])}.`,`${P(PA[0])} < ${P(PB[0])}.`),
    IT(u[1],`Lớp 7A có ${vA[0]} học sinh thích Toán.`,`Lớp 7A có ${PA[0]} học sinh thích Toán.`,'ud','TH',`${nA} · ${P(PA[0])} = ${vA[0]}.`,`${PA[0]} là tỉ lệ; số học sinh là ${nA} · ${P(PA[0])} = ${vA[0]}.`),
    IT(u[2],`Số học sinh thích Toán của lớp 7A nhiều hơn của lớp 7B.`,`Số học sinh thích Toán của lớp 7B nhiều hơn của lớp 7A vì tỉ lệ lớn hơn.`,'ss','VD',`7A: ${vA[0]} bạn; 7B: ${nB} · ${P(PB[0])} = ${vB[0]} bạn. ${vA[0]} > ${vB[0]}.`,`Hai lớp có sĩ số khác nhau: 7A có ${vA[0]} bạn, 7B có ${vB[0]} bạn thích Toán; tỉ lệ lớn hơn chưa chắc số lượng nhiều hơn.`),
    IT(u[3],`Cả hai lớp có ${vA[0]+vB[0]} học sinh thích Toán.`,`Cả hai lớp có ${P(PA[0]+PB[0])} học sinh thích Toán.`,'ud','VD',`${vA[0]} + ${vB[0]} = ${vA[0]+vB[0]}.`,`Không cộng hai tỉ lệ của hai lớp có sĩ số khác nhau; số học sinh là ${vA[0]} + ${vB[0]} = ${vA[0]+vB[0]}.`)]}));});}
/* chi tiêu gia đình */
function tfBudget(){return retry(()=>{const I=sel([10,12,15,16,20]),names=['Ăn uống','Học tập','Điện, nước','Tiết kiệm','Khoản khác'],ps=parts(5,5,10);if(ps.some(p=>!okN(I*p*10/100)))return null;
  const cats=names.map((n,i)=>({n,p:ps[i]})),v=ps.map(p=>r2(I*p/100)),sv=v[3],s=cats.slice().sort((a,b)=>b.p-a.p);
  return tfLoop(u=>({stem:`Biểu đồ dưới đây cho biết tỉ lệ các khoản chi tiêu trong tháng của gia đình bạn Hoa. Thu nhập tháng đó của gia đình là ${I} triệu đồng.`,fig:fb(figPie(cats,{title:'Chi tiêu trong tháng|của gia đình bạn Hoa'})),items:[
    IT(u[0],`Gia đình dành ${nf(v[0])} triệu đồng cho ăn uống.`,`Gia đình dành ${nf(r2(v[0]+1))} triệu đồng cho ăn uống.`,'ud','TH',`${I} · ${P(ps[0])} = ${nf(v[0])} triệu đồng.`,`${I} · ${P(ps[0])} = ${nf(v[0])} triệu đồng.`),
    IT(u[1],`Khoản “${s[0].n}” chiếm tỉ lệ lớn nhất.`,`Khoản “${s[1].n}” chiếm tỉ lệ lớn nhất.`,'dd','NB',`“${s[0].n}” chiếm ${P(s[0].p)}, lớn nhất.`,`“${s[0].n}” (${P(s[0].p)}) lớn hơn “${s[1].n}” (${P(s[1].p)}).`),
    IT(u[2],`Nếu tháng nào cũng như vậy thì sau một năm gia đình tiết kiệm được ${nf(r2(sv*12))} triệu đồng.`,`Nếu tháng nào cũng như vậy thì sau một năm gia đình tiết kiệm được ${nf(sv)} triệu đồng.`,'ud','VD',`Mỗi tháng: ${I} · ${P(ps[3])} = ${nf(sv)} triệu đồng; một năm: ${nf(sv)} · 12 = ${nf(r2(sv*12))} triệu đồng.`,`${nf(sv)} triệu đồng là tiền tiết kiệm một tháng; một năm là ${nf(sv)} · 12 = ${nf(r2(sv*12))} triệu đồng.`),
    IT(u[3],`Tiền học tập và tiền điện, nước có tổng là ${nf(r2(v[1]+v[2]))} triệu đồng.`,`Tiền học tập và tiền điện, nước có tổng là ${nf(alt(r2(v[1]+v[2]),r2(I-v[1]-v[2]),r2(v[1]+v[2]+1)))} triệu đồng.`,'ud','VD',`${I} · (${P(ps[1])} + ${P(ps[2])}) = ${nf(r2(v[1]+v[2]))} triệu đồng.`,`${nf(r2(I-v[1]-v[2]))} triệu đồng là tổng các khoản còn lại.`)]}));});}
/* Bài 17: phân loại dữ liệu, đại diện + đọc biểu đồ */
function tfMix(){return retry(()=>{const C={t:'Xếp loại học tập|của học sinh khối 7',d:'xếp loại học tập của học sinh khối 7'},names=['Tốt','Khá','Đạt','Chưa đạt'],ps=parts(4,5,10),N=sel([160,200,240]);
  if(ps[3]>15)return null;const cats=names.map((n,i)=>({n,p:ps[i]})),v=ps.map(p=>cnt(N,p));if(!v.every(okN))return null;
  return tfLoop(u=>({stem:`Biểu đồ dưới đây cho biết tỉ lệ xếp loại học tập của ${N} học sinh khối 7 một trường.`,fig:fb(figPie(cats,{title:C.t})),items:[
    IT(u[0],'Dữ liệu xếp loại học tập (Tốt, Khá, Đạt, Chưa đạt) là dữ liệu không là số, có thể sắp thứ tự.','Dữ liệu xếp loại học tập (Tốt, Khá, Đạt, Chưa đạt) là số liệu.','dd','TH','Các mức xếp loại không là số và có thứ bậc từ cao đến thấp.','Các mức xếp loại là chữ, không là số; chúng có thể sắp thứ tự.'),
    IT(u[1],`Có ${v[0]+v[1]} học sinh xếp loại Tốt hoặc Khá.`,`Có ${P(ps[0]+ps[1])} học sinh, tức ${ps[0]+ps[1]} bạn, xếp loại Tốt hoặc Khá.`,'ud','VD',`${N} · (${P(ps[0])} + ${P(ps[1])}) = ${v[0]+v[1]}.`,`${ps[0]+ps[1]} là tỉ lệ; số học sinh là ${N} · ${P(ps[0]+ps[1])} = ${v[0]+v[1]}.`),
    IT(u[2],`Số học sinh xếp loại Chưa đạt là ${v[3]}.`,`Số học sinh xếp loại Chưa đạt là ${N-v[3]}.`,'ud','TH',`${N} · ${P(ps[3])} = ${v[3]}.`,`${N-v[3]} là số học sinh từ mức Đạt trở lên.`),
    IT(u[3],'Muốn biểu đồ đại diện cho khối 7 thì dữ liệu phải lấy từ học sinh ở tất cả các lớp trong khối.','Nếu chỉ lấy dữ liệu của các học sinh trong đội tuyển học sinh giỏi thì biểu đồ vẫn đại diện cho khối 7.','dd','VD','Dữ liệu cần lấy từ mọi lớp, không bỏ sót nhóm nào (Bài 17).','Đội tuyển học sinh giỏi chỉ là một nhóm có chung đặc điểm nên dữ liệu không đại diện cho khối 7 (Bài 17).')]}));});}

function tfRaw(){return retry(()=>{const names=sel([['Xanh','Đỏ','Vàng','Tím'],['Cam','Xoài','Chuối','Táo'],['Phở','Bánh mì','Xôi','Bún']]),n=20,cs=parts(4,5,10).map(p=>p*n/100),L=rawList(names,cs),[i,j]=shuffle([0,1,2,3]).slice(0,2),p=x=>cs[x]*5;
  return tfLoop(u=>({stem:`Hỏi 20 bạn về lựa chọn yêu thích, bạn Lan ghi lại được dãy dữ liệu sau:<br><i>${L.join(', ')}</i><br>Lan lập bảng thống kê rồi vẽ biểu đồ hình quạt tròn.`,items:[
    IT(u[0],`“${names[i]}” xuất hiện ${cs[i]} lần.`,`“${names[i]}” xuất hiện ${alt(cs[i],cs[i]+1,cs[i]-1)} lần.`,'bd','TH',`Đếm trong dãy: “${names[i]}” xuất hiện ${cs[i]} lần.`,`Đếm lại: “${names[i]}” xuất hiện ${cs[i]} lần.`),
    IT(u[1],`Hình quạt biểu diễn “${names[j]}” ứng với ${P(p(j))}.`,`Hình quạt biểu diễn “${names[j]}” ứng với ${P(alt(p(j),cs[j],p(j)+5))}.`,'bd','VD',`${cs[j]}/20 = ${P(p(j))}.`,`“${names[j]}” xuất hiện ${cs[j]} lần, tỉ lệ ${cs[j]}/20 = ${P(p(j))}.`),
    IT(u[2],'Dãy dữ liệu trên là dữ liệu không là số.','Dãy dữ liệu trên là số liệu.','dd','NB','Các giá trị là tên gọi, không là số (Bài 17).','Các giá trị là tên gọi, không là số (Bài 17).'),
    IT(u[3],`Trên hình tròn chia sẵn 20 hình quạt (mỗi hình quạt 5%), cần tô ${cs[i]} hình quạt cho “${names[i]}”.`,`Trên hình tròn chia sẵn 20 hình quạt (mỗi hình quạt 5%), cần tô ${alt(cs[i],p(i),cs[i]+2)} hình quạt cho “${names[i]}”.`,'bd','VD',`Tỉ lệ ${P(p(i))}, cần ${P(p(i))} : 5% = ${cs[i]} hình quạt (đúng bằng số lần xuất hiện vì có 20 bạn).`,`Tỉ lệ ${P(p(i))}, cần ${P(p(i))} : 5% = ${cs[i]} hình quạt.`)]}));});}
addTF('tf_read','dd','NB',tfRead);
addTF('tf_raw','bd','VD',tfRaw,{mix:[17]});
addTF('tf_comp','dd','NB',tfComp);
addTF('tf_tab','bd','NB',tfTab);
addTF('tf_calc','ud','TH',tfCalc);
addTF('tf_cmp','ss','TH',tfCmp);
addTF('tf_counts','bd','TH',tfCounts);
addTF('tf_div','bd','TH',tfDiv,{fig:fb(figDiv(5))});
addTF('tf_pred','ud','VD',tfPred,{mix:[17]});
addTF('tf_rev','ud','VD',tfRev);
addTF('tf_two','ss','VD',tfTwo);
addTF('tf_budget','ud','VD',tfBudget);
addTF('tf_mix','dd','VD',tfMix,{mix:[17]});

/* ============ Câu trả lời ngắn ============ */
const SA=[];
const addSA=(id,topic,level,unit,gen,extra)=>SA.push(Object.assign({id,type:'sa',topic,level,unit,gen},extra||{}));
const sq=(stem,ans,exp,extra)=>Object.assign({stem,ans:[ans],at:nb(ans),exp},extra||{});
function saRead(){const D=DS(),x=sel(D.cats);return sq(lead(D)+` Tỉ lệ ${D.C.of(x.n)} là bao nhiêu phần trăm?`,x.p,`Hình quạt ứng với “${x.n}” ghi ${P(x.p)}.`,{fig:pieOf(D)});}
function saCount(){const D=DS(ri(3,5));return sq(lead(D)+' Hình tròn được chia thành bao nhiêu hình quạt?',D.cats.length,`Chú giải có ${D.cats.length} mục ứng với ${D.cats.length} hình quạt.`,{fig:pieOf(D)});}
function saFrac(){const [f,p]=sel([['một nửa',50],['1/4',25],['3/4',75],['1/10',10],['1/5',20]]);return sq(`Trong biểu đồ hình quạt tròn, phần hình quạt ứng với ${f} hình tròn biểu diễn tỉ lệ bao nhiêu phần trăm?`,p,`Cả hình tròn ứng với 100% nên ${f} hình tròn ứng với ${P(p)}.`);}
function saMax(){const D=DS(),s=D.cats.slice().sort((a,b)=>b.p-a.p);return sq(lead(D)+' Loại chiếm tỉ lệ lớn nhất chiếm bao nhiêu phần trăm?',s[0].p,`Hình quạt lớn nhất ứng với “${s[0].n}”, ghi ${P(s[0].p)}.`,{fig:pieOf(D)});}
function saNot(){const D=DS(),x=sel(D.cats);return sq(lead(D)+` Tỉ lệ ${D.C.u} KHÔNG thuộc loại “${x.n}” là bao nhiêu phần trăm?`,100-x.p,`100% − ${P(x.p)} = ${P(100-x.p)} (hoặc cộng tỉ lệ các loại còn lại).`,{fig:pieOf(D)});}
function saHid(){const D=DS(),i=ri(0,D.cats.length-1),x=D.cats[i];return sq(lead(D)+` Tỉ lệ của “${x.n}” bị che bởi dấu ?. Tỉ lệ đó là bao nhiêu phần trăm?`,x.p,`100% − (${D.cats.filter((_,j)=>j!==i).map(c=>P(c.p)).join(' + ')}) = ${P(x.p)}.`,{fig:pieOf(D,{hide:[i]})});}
function saMiss(){const D=DS(),i=ri(0,D.cats.length-1),x=D.cats[i];return sq(`Bảng sau cho biết tỉ lệ ${D.C.d}, trong đó một tỉ lệ bị che.${tableP(D,i)}Tỉ lệ ${D.C.of(x.n)} là bao nhiêu phần trăm?`,x.p,`100% − (${D.cats.filter((_,j)=>j!==i).map(c=>P(c.p)).join(' + ')}) = ${P(x.p)}.`);}
function saPct(){return retry(()=>{const D=DS(ri(3,4)),N=sel([40,80,200,400,500]),v=D.cats.map(c=>cnt(N,c.p));if(!v.every(okN))return null;const i=ri(0,v.length-1);
  return sq(`Kết quả khảo sát về ${D.C.d} được ghi trong bảng thống kê sau.${tableN(D,v)}Khi vẽ biểu đồ hình quạt tròn, tỉ lệ ${D.C.of(D.cats[i].n)} là bao nhiêu phần trăm?`,D.cats[i].p,`Tổng: ${v.map(nb).join(' + ')} = ${nb(N)}. Tỉ lệ: ${nb(v[i])}/${nb(N)} = ${P(D.cats[i].p)}.`);});}
function saSect(){const step=sel([10,5]),p=step===10?10*ri(1,7):5*ri(2,15);return sq(`Hình tròn dưới đây được chia sẵn thành ${100/step} hình quạt bằng nhau, mỗi hình quạt ứng với ${step}%. Cần tô màu bao nhiêu hình quạt để biểu diễn tỉ lệ ${P(p)}?`,p/step,`${P(p)} : ${step}% = ${p/step}.`,{fig:fb(figDiv(step))});}
function saSum(){const D=DS(),[a,b]=shuffle(D.cats).slice(0,2);return sq(lead(D)+` “${a.n}” và “${b.n}” chiếm tổng cộng bao nhiêu phần trăm?`,a.p+b.p,`${P(a.p)} + ${P(b.p)} = ${P(a.p+b.p)}.`,{fig:pieOf(D)});}
function saDiff(){const D=DS(),s=shuffle(D.cats).slice(0,2).sort((a,b)=>b.p-a.p);return sq(lead(D)+` Tỉ lệ ${D.C.of(s[0].n)} lớn hơn tỉ lệ ${D.C.of(s[1].n)} bao nhiêu phần trăm?`,s[0].p-s[1].p,`${P(s[0].p)} − ${P(s[1].p)} = ${P(s[0].p-s[1].p)}.`,{fig:pieOf(D)});}
function saNum(){return retry(()=>{const D=DS(),N=D.N,x=sel(D.cats),v=cnt(N,x.p);if(!okN(v))return null;return sq(lead(D)+` ${D.C.tot(N)} Có bao nhiêu ${D.C.of(x.n)}?`,v,`${nb(N)} · ${P(x.p)} = ${nb(N)} · ${x.p}/100 = ${nb(v)}.`,{fig:pieOf(D),unit:D.C.u});});}
function saPred(){return retry(()=>{const C=sel(CTX.filter(c=>c.big)),D=DS(null,5,10,C),x=sel(D.cats),M=sel([200,300,400,500,600,800]),v=cnt(M,x.p);if(!okN(v))return null;
  return sq(lead(D)+` Hãy dự đoán trong ${nb(M)} ${C.big} có khoảng bao nhiêu bạn chọn “${x.n}”.`,v,`Khoảng ${nb(M)} · ${P(x.p)} = ${nb(v)} bạn.`,{fig:pieOf(D)});});}
function saTimes(){return retry(()=>{const C=sel(CTX),q=sel([10,15]),m=sel([2,3,4]),a=q*m;if(a+q>80)return null;const o=parts(2,5,10,100-a-q);if(o.some(x=>x===a||x===q))return null;
  const ps=shuffle([a,q].concat(o)),cats=C.c.slice(0,4).map((n,i)=>({n,p:ps[i]})),D={C,cats},A=cats.find(c=>c.p===a),B=cats.find(c=>c.p===q);
  return sq(lead(D)+` Số ${C.of(A.n)} gấp bao nhiêu lần số ${C.of(B.n)}?`,m,`${P(a)} : ${P(q)} = ${m}. Trong cùng một biểu đồ, tỉ lệ gấp ${m} lần thì số lượng cũng gấp ${m} lần.`,{fig:pieOf(D)});});}
function saTotal(){return retry(()=>{const D=DS(),x=sel(D.cats),N=D.N,v=cnt(N,x.p);if(!okN(v))return null;return sq(lead(D)+` Biết có ${nb(v)} ${D.C.of(x.n)}. Tổng số ${D.C.u} là bao nhiêu?`,N,`${nb(v)} : ${P(x.p)} = ${nb(v)} · 100/${x.p} = ${nb(N)}.`,{fig:pieOf(D),unit:D.C.u});});}
function saOther(){return retry(()=>{const D=DS(),N=D.N,[x,y]=shuffle(D.cats).slice(0,2),vx=cnt(N,x.p),vy=cnt(N,y.p);if(!okN(vx)||!okN(vy))return null;return sq(lead(D)+` Biết có ${nb(vx)} ${D.C.of(x.n)}. Có bao nhiêu ${D.C.of(y.n)}?`,vy,`Tổng số: ${nb(vx)} : ${P(x.p)} = ${nb(N)}. Số cần tìm: ${nb(N)} · ${P(y.p)} = ${nb(vy)}.`,{fig:pieOf(D),unit:D.C.u});});}
function saFill(){return retry(()=>{const D=DS(4),N=D.N,i=ri(0,3),x=D.cats[i],v=cnt(N,x.p);if(!okN(v))return null;return sq(lead(D)+` Tỉ lệ của “${x.n}” bị che bởi dấu ?. ${D.C.tot(N)} Có bao nhiêu ${D.C.of(x.n)}?`,v,`Tỉ lệ còn thiếu: 100% − ${P(100-x.p)} = ${P(x.p)}. Số lượng: ${nb(N)} · ${P(x.p)} = ${nb(v)}.`,{fig:pieOf(D,{hide:[i]}),unit:D.C.u});});}
function saCmp(){return retry(()=>{const D=DS(),N=D.N,[a,b]=shuffle(D.cats).slice(0,2);if(a.p<=b.p)return null;const d=cnt(N,a.p-b.p);if(!okN(d))return null;return sq(lead(D)+` ${D.C.tot(N)} Số ${D.C.of(a.n)} nhiều hơn số ${D.C.of(b.n)} bao nhiêu?`,d,`${nb(N)} · ${P(a.p)} − ${nb(N)} · ${P(b.p)} = ${nb(cnt(N,a.p))} − ${nb(cnt(N,b.p))} = ${nb(d)}.`,{fig:pieOf(D),unit:D.C.u});});}
function saRaw(){return retry(()=>{const names=sel([['Xanh','Đỏ','Vàng','Tím'],['Cam','Xoài','Chuối','Táo'],['Phở','Bánh mì','Xôi','Bún']]),n=sel([20,25]),cs=parts(4,step0(n),step0(n)*2).map(p=>p*n/100);if(cs.some(c=>!okN(c)))return null;const i=ri(0,3),L=rawList(names,cs),p=cs[i]*100/n;
  return sq(`Hỏi ${n} bạn về lựa chọn yêu thích, bạn Lan ghi lại được dãy dữ liệu sau:<br><i>${L.join(', ')}</i><br>Khi biểu diễn bằng biểu đồ hình quạt tròn, “${names[i]}” chiếm bao nhiêu phần trăm?`,p,`“${names[i]}” xuất hiện ${cs[i]} lần trong ${n} lựa chọn. Tỉ lệ: ${cs[i]}/${n} = ${P(p)}.`);});}
const step0=n=>n===25?4:5;
function saMoney(){return retry(()=>{const I=sel([10,12,15,16,20]),names=['Ăn uống','Học tập','Điện, nước','Tiết kiệm','Khoản khác'],ps=parts(5,5,10);const cats=names.map((n,i)=>({n,p:ps[i]})),sv=r2(I*ps[3]/100),T=sel([12,6]);
  return sq(`Biểu đồ dưới đây cho biết tỉ lệ các khoản chi tiêu trong tháng của gia đình bạn Hoa. Thu nhập mỗi tháng của gia đình là ${I} triệu đồng. Nếu tháng nào cũng chi tiêu như vậy thì sau ${T} tháng gia đình tiết kiệm được bao nhiêu triệu đồng?`,r2(sv*T),`Mỗi tháng tiết kiệm ${I} · ${P(ps[3])} = ${nf(sv)} triệu đồng. Sau ${T} tháng: ${nf(sv)} · ${T} = ${nf(r2(sv*T))} triệu đồng.`,{fig:fb(figPie(cats,{title:'Chi tiêu trong tháng|của gia đình bạn Hoa'}))});});}

function saOrd(){const {C,cats,fig}=ordData(),k=ri(1,2),up=cats.slice(0,k+1).reduce((a,c)=>a+c.p,0);return sq(`Biểu đồ hình quạt tròn dưới đây cho biết tỉ lệ ${C.d} (các mức sắp thứ tự từ cao đến thấp: ${C.c.join(', ')}). Tỉ lệ ${C.u} từ mức “${cats[k].n}” trở lên là bao nhiêu phần trăm?`,up,`${cats.slice(0,k+1).map(c=>P(c.p)).join(' + ')} = ${P(up)}.`,{fig});}
function saOrdCnt(){return retry(()=>{const {C,cats,fig}=ordData(),N=C.c[0]==='Tốt'?sel([160,200,240]):40,k=ri(1,2),dn=cats.slice(k).reduce((a,c)=>a+c.p,0),v=cnt(N,dn);if(!okN(v))return null;
  return sq(`Biểu đồ hình quạt tròn dưới đây cho biết tỉ lệ ${C.d} (các mức sắp thứ tự từ cao đến thấp: ${C.c.join(', ')}). Có tất cả ${N} học sinh. Có bao nhiêu ${C.u} từ mức “${cats[k].n}” trở xuống?`,v,`Tỉ lệ từ mức “${cats[k].n}” trở xuống: ${cats.slice(k).map(c=>P(c.p)).join(' + ')} = ${P(dn)}. Số học sinh: ${N} · ${P(dn)} = ${v}.`,{fig,unit:'học sinh'});});}
function saTabRead(){const D=DS(),x=sel(D.cats);return sq(`Bảng sau cho biết tỉ lệ ${D.C.d}.${tableP(D)}Khi vẽ biểu đồ hình quạt tròn từ bảng này, hình quạt biểu diễn “${x.n}” ghi tỉ lệ bao nhiêu phần trăm?`,x.p,`Mỗi hình quạt ghi đúng tỉ lệ trong bảng: “${x.n}” ${P(x.p)}.`);}
[
 ['sa_read','dd','NB','%',saRead],['sa_count','dd','NB','hình quạt',saCount],['sa_max','dd','NB','%',saMax],['sa_not','dd','TH','%',saNot],['sa_hid','dd','TH','%',saHid],
 ['sa_frac','bd','NB','%',saFrac],['sa_tabread','bd','NB','%',saTabRead],['sa_ord','ss','TH','%',saOrd,{mix:[17]}],['sa_ordcnt','ud','VD','học sinh',saOrdCnt,{mix:[17]}],['sa_miss','bd','TH','%',saMiss],['sa_pct','bd','TH','%',saPct],['sa_sect','bd','TH','hình quạt',saSect],['sa_raw','bd','VD','%',saRaw,{mix:[17]}],
 ['sa_sum','ss','TH','%',saSum],['sa_diff','ss','TH','%',saDiff],['sa_times','ss','VD','lần',saTimes],
 ['sa_num','ud','TH','',saNum],['sa_pred','ud','TH','bạn',saPred],['sa_total','ud','VD','',saTotal],['sa_other','ud','VD','',saOther],['sa_fill','ud','VD','',saFill],['sa_cmp','ud','VD','',saCmp],['sa_money','ud','VD','triệu đồng',saMoney]
].forEach(([id,t,l,u,f,x])=>addSA(id,t,l,u,f,x));

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],at:nb(ans),exp});
const tbl=(head,rows)=>`<table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
/* hai năm học: tỉ lệ giảm nhưng số lượng có thể tăng */
function tfYears(){return retry(()=>{const N1=sel([200,240,250,300]),N2=N1+sel([40,50,60,100]),p1=5*ri(6,9),p2=p1-5*ri(1,2);
  const v1=cnt(N1,p1),v2=cnt(N2,p2);if(!okN(v1)||!okN(v2)||v2<=v1)return null;
  const o1=parts(3,5,10,100-p1),o2=parts(3,5,10,100-p2);
  const nm=['Xe đạp','Đi bộ','Xe buýt','Bố mẹ đưa'],cA=nm.map((n,i)=>({n,p:[p1].concat(o1)[i]})),cB=nm.map((n,i)=>({n,p:[p2].concat(o2)[i]}));
  const fig=fb(figPie(cA,{title:`Năm trước|(khối 7 có ${N1} học sinh)`}))+fb(figPie(cB,{title:`Năm nay|(khối 7 có ${N2} học sinh)`}));
  return tfLoop(u=>({stem:`Hai biểu đồ dưới đây cho biết tỉ lệ các phương tiện đến trường của học sinh khối 7 một trường trong năm trước (${N1} học sinh) và năm nay (${N2} học sinh).`,fig,items:[
    IT(u[0],'Tỉ lệ học sinh đi xe đạp năm nay giảm so với năm trước.','Tỉ lệ học sinh đi xe đạp năm nay tăng so với năm trước.','ss','TH',`${P(p2)} < ${P(p1)}.`,`${P(p2)} < ${P(p1)} nên tỉ lệ giảm.`),
    IT(u[1],`Năm nay có ${v2} học sinh khối 7 đi xe đạp.`,`Năm nay có ${v1} học sinh khối 7 đi xe đạp.`,'ud','VD',`${N2} · ${P(p2)} = ${v2}.`,`${v1} là số học sinh đi xe đạp năm trước (${N1} · ${P(p1)}); năm nay là ${N2} · ${P(p2)} = ${v2}.`),
    IT(u[2],'Số học sinh đi xe đạp năm nay nhiều hơn năm trước.','Số học sinh đi xe đạp năm nay ít hơn năm trước vì tỉ lệ giảm.','ss','VD',`${v2} > ${v1}: tỉ lệ giảm nhưng tổng số học sinh tăng.`,`Năm trước ${v1} bạn, năm nay ${v2} bạn; tỉ lệ giảm nhưng tổng số học sinh tăng nên số lượng vẫn tăng.`),
    IT(u[3],`Số học sinh đi xe đạp tăng thêm ${v2-v1} bạn.`,`Số học sinh đi xe đạp giảm đi ${p1-p2} bạn.`,'ud','VD',`${v2} − ${v1} = ${v2-v1}.`,`${p1-p2}% là hiệu hai tỉ lệ; số học sinh tăng thêm ${v2} − ${v1} = ${v2-v1} bạn.`)]}));});}
const HARD={tf:[{id:'h_years',type:'tf',topic:'ss',level:'VD',gen:tfYears}],sa:[
 {id:'h_rev2',topic:'ud',level:'VD',unit:'',gen:()=>retry(()=>{const D=DS(4),c=D.cats,[a,b]=shuffle(c).slice(0,2);if(a.p<=b.p)return null;const N=D.N,d=cnt(N,a.p-b.p);if(!okN(d))return null;
   return{stem:lead(D)+` Số ${D.C.of(a.n)} nhiều hơn số ${D.C.of(b.n)} là ${nb(d)}. Tính tổng số ${D.C.u}.`,fig:pieOf(D),unit:D.C.u,ans:[N],exp:`Hiệu hai tỉ lệ: ${P(a.p)} − ${P(b.p)} = ${P(a.p-b.p)}, ứng với ${nb(d)} ${D.C.u}. Tổng số: ${nb(d)} : ${P(a.p-b.p)} = ${nb(N)}.`};})},
 {id:'h_change',topic:'bd',level:'VD',unit:'%',gen:()=>retry(()=>{const C=CTX[0],ps=parts(4,5,10),cats=C.c.slice(0,4).map((n,i)=>({n,p:ps[i]})),D={C,cats},[x,y]=shuffle(cats).slice(0,2),vx=cnt(40,x.p),k=2*ri(1,3);if(k>=vx)return null;const ny=r2((cnt(40,y.p)+k)*100/40);if(!okN(ny))return null;
   return{stem:lead(D)+` Lớp 7A có 40 học sinh. Sau đó có ${k} bạn đổi ý từ “${x.n}” sang “${y.n}”. Sau khi đổi, tỉ lệ ${C.of(y.n)} là bao nhiêu phần trăm?`,fig:pieOf(D),ans:[ny],exp:`Lúc đầu có 40 · ${P(y.p)} = ${cnt(40,y.p)} bạn chọn “${y.n}”. Sau khi đổi: ${cnt(40,y.p)} + ${k} = ${cnt(40,y.p)+k} bạn. Tỉ lệ mới: ${cnt(40,y.p)+k}/40 = ${P(ny)}.`};})},
 {id:'h_add',topic:'bd',level:'VD',unit:'%',gen:()=>retry(()=>{const N=sel([400,500,600,800,900,1000]),p=5*ri(4,8),m=sel([50,100,150,200,250]),v=cnt(N,p),q=r2((v+m)*100/(N+m));if(!okN(v)||!okN(q))return null;
   const ps=[p].concat(parts(3,5,10,100-p));if(new Set(ps).size<4)return null;const cats=['Truyện','Sách giáo khoa','Tham khảo','Sách khác'].map((n,i)=>({n,p:ps[i]}));
   return{stem:`Biểu đồ dưới đây cho biết tỉ lệ các loại sách trong tủ sách của lớp 7A, tủ có ${nb(N)} cuốn. Lớp được tặng thêm ${m} cuốn truyện. Sau khi nhận thêm, truyện chiếm bao nhiêu phần trăm số sách của tủ?`,fig:fb(figPie(cats,{title:'Các loại sách|trong tủ sách lớp 7A'})),ans:[q],exp:`Lúc đầu có ${nb(N)} · ${P(p)} = ${nb(v)} cuốn truyện. Sau khi nhận thêm: ${nb(v)} + ${m} = ${nb(v+m)} cuốn truyện trên tổng ${nb(N)} + ${m} = ${nb(N+m)} cuốn. Tỉ lệ: ${nb(v+m)}/${nb(N+m)} = ${P(q)}.`};})},
 {id:'h_two',topic:'ss',level:'VD',unit:'%',gen:()=>retry(()=>{const nA=sel([40,80,120]),nB=sel([40,80,160,200]),pA=5*ri(4,12),pB=5*ri(4,12);if(pA===pB)return null;const vA=cnt(nA,pA),vB=cnt(nB,pB),q=r2((vA+vB)*100/(nA+nB));if(!okN(vA)||!okN(vB)||!okN(q))return null;
   return{stem:`Kết quả khảo sát về môn thể thao yêu thích: ở trường A có ${nA} học sinh được hỏi, trong đó ${P(pA)} chọn bóng đá; ở trường B có ${nB} học sinh được hỏi, trong đó ${P(pB)} chọn bóng đá. Gộp kết quả của hai trường để vẽ một biểu đồ hình quạt tròn chung. Khi đó tỉ lệ học sinh chọn bóng đá là bao nhiêu phần trăm?`,ans:[q],exp:`Trường A: ${nA} · ${P(pA)} = ${vA} bạn; trường B: ${nB} · ${P(pB)} = ${vB} bạn. Tổng: ${vA+vB} bạn trên ${nA+nB} bạn. Tỉ lệ: ${vA+vB}/${nA+nB} = ${P(q)}. (Không lấy trung bình cộng hai tỉ lệ vì số học sinh hai trường khác nhau.)`};})},
 {id:'h_raw',topic:'bd',level:'VD',unit:'hình quạt',mix:[17],gen:()=>retry(()=>{const names=sel([['Xanh','Đỏ','Vàng','Tím'],['Cam','Xoài','Chuối','Táo']]),n=sel([20,40]),cs=parts(4,5,10).map(p=>p*n/100);if(cs.some(c=>!okN(c)))return null;const i=ri(0,3),L=rawList(names,cs),p=cs[i]*100/n,step=5;
   return{stem:`Hỏi ${n} bạn về lựa chọn yêu thích, bạn Lan ghi lại được dãy dữ liệu sau:<br><i>${L.join(', ')}</i><br>Lan lập bảng thống kê rồi vẽ biểu đồ hình quạt tròn trên hình tròn chia sẵn thành 20 hình quạt bằng nhau (mỗi hình quạt ứng với 5%). Cần tô bao nhiêu hình quạt cho “${names[i]}”?`,ans:[p/step],exp:`“${names[i]}” xuất hiện ${cs[i]} lần trong ${n} lựa chọn. Tỉ lệ: ${cs[i]}/${n} = ${P(p)}. Số hình quạt cần tô: ${P(p)} : 5% = ${p/step}.`};})},
 {id:'h_ord',topic:'ss',level:'VD',unit:'học sinh',mix:[17],gen:()=>retry(()=>{const {C,cats,fig}=ordData(),N=C.c[0]==='Tốt'?sel([160,200,240]):40,up=cats[0].p+cats[1].p,dn=cats[2].p+cats[3].p,d=cnt(N,Math.abs(up-dn));if(!okN(d)||up===dn)return null;
   return{stem:`Biểu đồ hình quạt tròn dưới đây cho biết tỉ lệ ${C.d} (các mức sắp thứ tự từ cao đến thấp: ${C.c.join(', ')}). Có tất cả ${N} học sinh. Số học sinh ở hai mức cao (“${C.c[0]}”, “${C.c[1]}”) và số học sinh ở hai mức thấp (“${C.c[2]}”, “${C.c[3]}”) chênh lệch nhau bao nhiêu bạn?`,fig,ans:[d],exp:`Hai mức cao: ${P(cats[0].p)} + ${P(cats[1].p)} = ${P(up)}; hai mức thấp: ${P(cats[2].p)} + ${P(cats[3].p)} = ${P(dn)}. Chênh lệch ${P(Math.abs(up-dn))}, ứng với ${N} · ${P(Math.abs(up-dn))} = ${d} bạn.`};})},
 {id:'h_money',topic:'ud',level:'VD',unit:'tháng',gen:()=>retry(()=>{const I=sel([10,12,15,16,20]),names=['Ăn uống','Học tập','Điện, nước','Tiết kiệm','Khoản khác'],ps=parts(5,5,10),sv=r2(I*ps[3]/100),T=sel([5,6,8,10,12]),m=Math.ceil(T/sv-1e-9);if(T<=sv*2)return null;
   const cats=names.map((n,i)=>({n,p:ps[i]}));
   return{stem:`Biểu đồ dưới đây cho biết tỉ lệ các khoản chi tiêu trong tháng của gia đình bạn Hoa. Thu nhập mỗi tháng của gia đình là ${I} triệu đồng và tháng nào cũng chi tiêu như vậy. Gia đình cần ít nhất bao nhiêu tháng để số tiền tiết kiệm đủ mua một chiếc tủ lạnh giá ${T} triệu đồng?`,fig:fb(figPie(cats,{title:'Chi tiêu trong tháng|của gia đình bạn Hoa'})),ans:[m],exp:`Mỗi tháng tiết kiệm ${I} · ${P(ps[3])} = ${nf(sv)} triệu đồng. ${m-1} tháng được ${nf(r2(sv*(m-1)))} triệu đồng (chưa đủ), ${m} tháng được ${nf(r2(sv*m))} triệu đồng (đủ). Vậy cần ít nhất ${m} tháng.`};})}
].map(q=>Object.assign({type:'sa'},q))};

const PISA=[
 ()=>{const I=sel([12,15,16,20]),ps=parts(5,5,10),names=['Ăn uống','Học tập','Điện, nước','Tiết kiệm','Khoản khác'],cats=names.map((n,i)=>({n,p:ps[i]})),s=cats.slice().sort((a,b)=>b.p-a.p),I2=I+sel([2,4]);
  const v=ps.map(p=>r2(I*p/100));
  return {title:'Chi tiêu của gia đình',fig:fb(figPie(cats,{title:'Chi tiêu trong tháng|của gia đình bạn Hoa'})),ctx:`<p class="stem">Gia đình bạn Hoa có thu nhập ${I} triệu đồng mỗi tháng. Biểu đồ cho biết tỉ lệ các khoản chi tiêu của gia đình trong một tháng.</p>`,qs:[
   mcq('Khoản nào chiếm tỉ lệ lớn nhất?',s[0].n,s.slice(1,4).map(c=>[c.n,`“${c.n}” chiếm ${P(c.p)}, nhỏ hơn ${P(s[0].p)} của “${s[0].n}”.`]),`Hình quạt lớn nhất ứng với “${s[0].n}” (${P(s[0].p)}).`,'dd','NB'),
   saq('Mỗi tháng gia đình dành bao nhiêu triệu đồng cho học tập?',v[1],'triệu đồng',`${I} · ${P(ps[1])} = ${nf(v[1])} triệu đồng.`,'ud','TH'),
   saq('Sau một năm (12 tháng), gia đình tiết kiệm được bao nhiêu triệu đồng?',r2(v[3]*12),'triệu đồng',`Mỗi tháng: ${I} · ${P(ps[3])} = ${nf(v[3])} triệu đồng. Một năm: ${nf(v[3])} · 12 = ${nf(r2(v[3]*12))} triệu đồng.`,'ud','VD'),
   saq(`Thu nhập tăng lên ${I2} triệu đồng mỗi tháng, tỉ lệ các khoản giữ nguyên. Mỗi tháng tiền ăn uống tăng thêm bao nhiêu triệu đồng?`,r2((I2-I)*ps[0]/100),'triệu đồng',`Tiền ăn uống tăng thêm: (${I2} − ${I}) · ${P(ps[0])} = ${nf(r2((I2-I)*ps[0]/100))} triệu đồng.`,'ud','VD')
 ]};},
 ()=>{const ps=parts(4,5,10),names=['Nước cam','Sữa','Trà chanh','Nước lọc'],cats=names.map((n,i)=>({n,p:ps[i]})),M=sel([600,800,900,1000,1200]),i=ri(0,3),j=(i+ri(1,3))%4;
  return {title:'Đồ uống ở căng tin',fig:fb(figPie(cats,{title:'Đồ uống yêu thích|(200 học sinh được hỏi)'})),ctx:`<p class="stem">Căng tin trường hỏi ngẫu nhiên 200 học sinh ở tất cả các lớp về đồ uống yêu thích (mỗi bạn chọn một loại) và vẽ được biểu đồ hình quạt tròn bên. Trường có ${nb(M)} học sinh.</p>`,qs:[
   saq(`Trong 200 học sinh được hỏi, có bao nhiêu bạn chọn “${names[i]}”?`,cnt(200,ps[i]),'bạn',`200 · ${P(ps[i])} = ${cnt(200,ps[i])}.`,'ud','TH'),
   saq(`Hãy dự đoán trong ${nb(M)} học sinh của trường có khoảng bao nhiêu bạn thích “${names[j]}”.`,cnt(M,ps[j]),'bạn',`${nb(M)} · ${P(ps[j])} = ${nb(cnt(M,ps[j]))} bạn (con số ước lượng).`,'ud','VD'),
   Object.assign(mcq('Vì sao có thể dùng kết quả của 200 bạn để dự đoán cho cả trường?','Vì 200 bạn được chọn ngẫu nhiên ở tất cả các lớp nên dữ liệu đại diện cho cả trường',[['Vì 200 bạn là một số lớn','Hỏi nhiều bạn nhưng chỉ trong một nhóm thì vẫn không đại diện; điều quan trọng là chọn ngẫu nhiên, không bỏ sót nhóm nào.'],['Vì biểu đồ hình quạt tròn luôn cho kết quả chính xác','Dự đoán từ biểu đồ chỉ là ước lượng.'],['Vì tổng các tỉ lệ bằng 100%','Tổng các tỉ lệ luôn bằng 100%, không liên quan đến tính đại diện.']],'Dữ liệu được lấy từ các bạn chọn ngẫu nhiên ở tất cả các lớp nên đại diện cho cả trường (Bài 17).','ud','TH'),{mix:[17]}),
   saq(`Mỗi ngày căng tin bán khoảng 300 cốc đồ uống, tỉ lệ các loại như biểu đồ. Mỗi ngày căng tin cần chuẩn bị khoảng bao nhiêu cốc “${names[i]}”?`,cnt(300,ps[i]),'cốc',`300 · ${P(ps[i])} = ${cnt(300,ps[i])} cốc.`,'ud','VD')
 ]};},
 ()=>{const W=sel([40,60,80,100,120]),p0=5*ri(8,10),pp=[p0].concat(parts(4,5,5,100-p0)),names=['Rác hữu cơ','Nhựa','Giấy','Kim loại','Rác khác'],cats=names.map((n,i)=>({n,p:pp[i]})),g=sel([3,4,5]);
  return {title:'Phân loại rác thải',fig:fb(figPie(cats,{title:'Rác thải của lớp 7A|trong một tuần'})),ctx:`<p class="stem">Trong một tuần, lớp 7A thu gom và phân loại được ${W} kg rác. Biểu đồ cho biết tỉ lệ (theo khối lượng) của từng loại rác.</p>`,qs:[
   mcq('Nhận xét nào sau đây đúng?',pp[0]>=50?'Rác hữu cơ chiếm từ một nửa khối lượng rác trở lên':'Rác hữu cơ chiếm chưa đến một nửa khối lượng rác',[[pp[0]>=50?'Rác hữu cơ chiếm chưa đến một nửa khối lượng rác':'Rác hữu cơ chiếm từ một nửa khối lượng rác trở lên',`Rác hữu cơ chiếm ${P(pp[0])}, so sánh với 50%.`],['Nhựa chiếm tỉ lệ lớn nhất',`Rác hữu cơ (${P(pp[0])}) chiếm tỉ lệ lớn nhất.`],['Tổng tỉ lệ các loại rác lớn hơn 100%','Tổng các tỉ lệ luôn bằng 100%.']],`Rác hữu cơ chiếm ${P(pp[0])} ${pp[0]>=50?'≥':'<'} 50%.`,'ss','TH'),
   saq('Lớp đã thu gom được bao nhiêu ki-lô-gam nhựa?',r2(W*pp[1]/100),'kg',`${W} · ${P(pp[1])} = ${nf(r2(W*pp[1]/100))} kg.`,'ud','TH'),
   saq(`Giấy vụn bán được ${g} nghìn đồng mỗi ki-lô-gam. Lớp thu được bao nhiêu nghìn đồng từ giấy vụn?`,r2(W*pp[2]/100*g),'nghìn đồng',`Khối lượng giấy: ${W} · ${P(pp[2])} = ${nf(r2(W*pp[2]/100))} kg. Số tiền: ${nf(r2(W*pp[2]/100))} · ${g} = ${nf(r2(W*pp[2]/100*g))} nghìn đồng.`,'ud','VD'),
   saq('Lớp muốn vẽ lại biểu đồ trên hình tròn chia sẵn thành 20 hình quạt bằng nhau (mỗi hình quạt ứng với 5%). Cần tô bao nhiêu hình quạt cho rác hữu cơ?',pp[0]/5,'hình quạt',`${P(pp[0])} : 5% = ${pp[0]/5}.`,'bd','TH')
 ]};},
 ()=>{const T=sel([20,40]),ps=parts(4,5,10),names=['Toán','Ngữ văn','Tiếng Anh','Môn khác'],cats=names.map((n,i)=>({n,p:ps[i]})),T2=T+sel([5,10,20]),h=ps.map(p=>r2(T*p/100));
  return {title:'Kế hoạch ôn tập',fig:fb(figPie(cats,{title:'Thời gian ôn tập|của bạn Minh'})),ctx:`<p class="stem">Bạn Minh lập kế hoạch ôn tập trong ${T} giờ cho kì kiểm tra. Biểu đồ cho biết tỉ lệ thời gian dành cho từng môn.</p>`,qs:[
   saq('Minh dành bao nhiêu giờ để ôn môn Toán?',h[0],'giờ',`${T} · ${P(ps[0])} = ${nf(h[0])} giờ.`,'ud','TH'),
   saq('Thời gian ôn Toán và Tiếng Anh chiếm tổng cộng bao nhiêu phần trăm?',ps[0]+ps[2],'%',`${P(ps[0])} + ${P(ps[2])} = ${P(ps[0]+ps[2])}.`,'ss','NB'),
   saq(`Minh tăng tổng thời gian ôn tập lên ${T2} giờ, tỉ lệ các môn giữ nguyên. Thời gian ôn Ngữ văn tăng thêm bao nhiêu giờ?`,r2((T2-T)*ps[1]/100),'giờ',`Ngữ văn tăng thêm (${T2} − ${T}) · ${P(ps[1])} = ${nf(r2((T2-T)*ps[1]/100))} giờ.`,'ud','VD'),
   saq(`Với kế hoạch ${T} giờ ban đầu, Minh chuyển 2 giờ của “Môn khác” sang ôn Toán. Khi đó thời gian ôn Toán chiếm bao nhiêu phần trăm?`,r2((h[0]+2)*100/T),'%',`Thời gian ôn Toán: ${nf(h[0])} + 2 = ${nf(r2(h[0]+2))} giờ. Tỉ lệ: ${nf(r2(h[0]+2))}/${T} = ${P(r2((h[0]+2)*100/T))}.`,'bd','VD')
 ]};}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];
const EX=[{n:'Bóng đá',p:40},{n:'Cầu lông',p:25},{n:'Bơi',p:20},{n:'Cờ vua',p:15}];
const RECAP=[
  {k:'dd',fig:fb(figPie(EX,{title:'Môn thể thao yêu thích|của học sinh lớp 7A'})),extra:'Ba thành phần: tiêu đề (phía trên), hình tròn biểu diễn dữ liệu (các hình quạt), chú giải (cho biết mỗi hình quạt là loại nào).'},
  {k:'bd',fig:fb(figDiv(10)),extra:'Tỉ lệ = số lượng : tổng số · 100%. Tổng các tỉ lệ bằng 100%. Một nửa hình tròn là 50%, 1/4 hình tròn là 25%. Hình tròn chia sẵn mỗi hình quạt 10%: tỉ lệ 40% thì tô 4 hình quạt.'},
  {k:'ss',fig:`<div class="figbox"><p>Bóng đá 40% gấp 2 lần Bơi 20%</p><p>Cầu lông và Bơi: 25% + 20% = 45%</p><p>Bóng đá hơn Cờ vua: 40% − 15% = 25%</p></div>`,extra:'So sánh hai lớp có sĩ số khác nhau thì phải tính ra số lượng, không so sánh tỉ lệ.'},
  {k:'ud',fig:`<div class="figbox"><p>Lớp 40 học sinh, Bóng đá 40%: 40 · 40/100 = 16 bạn</p><p>Biết 10 bạn chọn Cầu lông (25%): tổng số = 10 : 25% = 40</p><p>Dự đoán cho 200 bạn: khoảng 200 · 40% = 80 bạn</p></div>`,extra:'Con số dự đoán chỉ là ước lượng. Dữ liệu cần đại diện (chọn ngẫu nhiên, đủ các nhóm) thì dự đoán mới đáng tin.'}
];

/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='qt7_seen';
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
  const mcSlots=[['dd',['NB','TH']],['bd',['NB','TH']],['bd',['TH','VD']],['ss',['TH','VD']],['ud',['NB','TH']],['ud',['TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>q.topic===t&&l.includes(q.level)),used));
  const tf=[sel(['dd','bd']),'ss','ud'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set(),t1=sel(['dd','bd']),t2=sel(['ss','ud']);
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
