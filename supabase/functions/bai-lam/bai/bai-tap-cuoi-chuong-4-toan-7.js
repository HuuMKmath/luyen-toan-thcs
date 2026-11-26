// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ bai-tap-cuoi-chuong-4-toan-7/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "bai-tap-cuoi-chuong-4-toan-7";
export const TIEN_TO = "C47-";

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
/* ============ Hình vẽ ============ */
const f1=n=>(Math.round(n*10)/10);
function ticks(p,q,n){
  const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy);
  const ux=dx/len,uy=dy/len,nx=-uy,ny=ux;let s='';
  for(let i=0;i<n;i++){const o=(i-(n-1)/2)*5,cx=mx+ux*o,cy=my+uy*o;
    s+=`<line class="mk" x1="${f1(cx-nx*5)}" y1="${f1(cy-ny*5)}" x2="${f1(cx+nx*5)}" y2="${f1(cy+ny*5)}"/>`;}
  return s;
}
function arcs(v,p,q,n){
  const a1=Math.atan2(p[1]-v[1],p[0]-v[0]),a2=Math.atan2(q[1]-v[1],q[0]-v[0]);
  let d=a2-a1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
  const sw=d>0?1:0;let s='';
  for(let i=0;i<n;i++){const r=16+i*5;
    s+=`<path class="mk" d="M${f1(v[0]+r*Math.cos(a1))} ${f1(v[1]+r*Math.sin(a1))} A${r} ${r} 0 0 ${sw} ${f1(v[0]+r*Math.cos(a2))} ${f1(v[1]+r*Math.sin(a2))}"/>`;}
  return s;
}
/* kí hiệu góc vuông tại đỉnh v, giữa hai tia hướng về p và q */
function rmark(v,p,q,s){
  s=s||9;const a=Math.hypot(p[0]-v[0],p[1]-v[1]),b=Math.hypot(q[0]-v[0],q[1]-v[1]);
  const u=[(p[0]-v[0])/a,(p[1]-v[1])/a],w=[(q[0]-v[0])/b,(q[1]-v[1])/b];
  const P1=[v[0]+u[0]*s,v[1]+u[1]*s],P2=[P1[0]+w[0]*s,P1[1]+w[1]*s],P3=[v[0]+w[0]*s,v[1]+w[1]*s];
  return `<path class="mk" d="M${f1(P1[0])} ${f1(P1[1])} L${f1(P2[0])} ${f1(P2[1])} L${f1(P3[0])} ${f1(P3[1])}"/>`;
}
const TX=(x,y,t)=>`<text class="vl" x="${f1(x)}" y="${f1(y)}" text-anchor="middle">${t}</text>`;
const TS=(x,y,t)=>`<text class="vs" x="${f1(x)}" y="${f1(y)}" text-anchor="middle">${t}</text>`;
const SEG=(p,q,c)=>`<line class="${c||'seg'}" x1="${f1(p[0])}" y1="${f1(p[1])}" x2="${f1(q[0])}" y2="${f1(q[1])}"/>`;
const DOT=p=>`<circle class="dot" cx="${f1(p[0])}" cy="${f1(p[1])}" r="3"/>`;
const cen=P=>[(P[0][0]+P[1][0]+P[2][0])/3,(P[0][1]+P[1][1]+P[2][1])/3];
const mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];
const along=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
/* tên đỉnh: đặt ra phía ngoài, ngược hướng với điểm c */
function lab(v,c,t,d){const dx=v[0]-c[0],dy=v[1]-c[1],L=Math.hypot(dx,dy)||1;d=d||14;return TX(v[0]+dx/L*d,v[1]+dy/L*d+5,t);}
/* số đo góc: đặt vào trong góc, theo hướng phân giác */
function angT(v,p,q,t,d){const a=Math.atan2(p[1]-v[1],p[0]-v[0]),b=Math.atan2(q[1]-v[1],q[0]-v[0]);let x=Math.cos(a)+Math.cos(b),y=Math.sin(a)+Math.sin(b);const L=Math.hypot(x,y)||1;d=d||36;return TS(v[0]+x/L*d,v[1]+y/L*d+5,t);}
/* độ dài cạnh: đặt cạnh trung điểm, phía ngoài tam giác (ngược hướng điểm c) */
function sideT(p,q,c,t){const m=mid(p,q),dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy);let nx=-dy/L,ny=dx/L;if((c[0]-m[0])*nx+(c[1]-m[1])*ny>0){nx=-nx;ny=-ny;}return TS(m[0]+nx*17,m[1]+ny*17+5,t);}
const svg=(w,h,alt,s)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${alt}">${s}</svg>`;
const fb=s=>`<div class="figbox">${s}</div>`;

/* Tam giác cân: lab=[đỉnh, trái, phải]. Tuỳ chọn: legs (số vạch hai cạnh bên), arcs (cung hai góc đáy), tA/tB/tC (số đo góc),
   sAB/sAC/sBC (độ dài), foot (tên chân đường vuông góc từ đỉnh xuống đáy), eq (tam giác đều) */
function figIso(o){
  o=o||{};const eq=!!o.eq,A=eq?[130,22]:[130,22],B=eq?[60,143]:[45,140],C=eq?[200,143]:[215,140],P=[A,B,C],G=cen(P),lb=o.lab||['A','B','C'];
  let s=`<polygon class="tri" points="${A} ${B} ${C}"/>`;
  if(o.foot){const H=[130,B[1]];s+=SEG(A,H)+rmark(H,A,C);if(o.footTicks)s+=ticks(B,H,2)+ticks(H,C,2);s+=TX(H[0],H[1]+20,o.foot);}
  const lt=o.legs==null?1:o.legs;if(lt)s+=ticks(A,B,lt)+ticks(A,C,lt);
  if(eq)s+=ticks(B,C,1);
  if(o.arcs)s+=arcs(B,A,C,1)+arcs(C,A,B,1);
  if(o.tA)s+=angT(A,B,C,o.tA,40);if(o.tB)s+=angT(B,A,C,o.tB,42);if(o.tC)s+=angT(C,A,B,o.tC,42);
  if(o.sAB)s+=sideT(A,B,G,o.sAB);if(o.sAC)s+=sideT(A,C,G,o.sAC);if(o.sBC)s+=sideT(B,C,G,o.sBC);
  s+=lab(A,G,lb[0])+lab(B,G,lb[1])+lab(C,G,lb[2]);
  return svg(260,o.foot||o.sBC?172:162,o.alt||'Tam giác cân',s);
}
/* Đường trung trực d của đoạn thẳng PQ (nằm ngang), O là trung điểm, M trên d (phía trên), N trên d (phía dưới, tuỳ chọn) */
function figPB(o){
  o=o||{};const lb=o.lab||['A','B','O','M'],A=[40,110],B=[220,110],O=[130,110],M=[130,o.my||32],Nn=[130,196];
  let s=SEG([130,12],[130,o.N?214:166])+SEG(A,B);
  if(o.seg!==false)s+=SEG(A,M)+SEG(B,M);
  if(o.N)s+=SEG(A,Nn)+SEG(B,Nn);
  s+=ticks(A,O,2)+ticks(O,B,2)+rmark(O,B,M);
  if(o.N){s+=ticks(A,M,1)+ticks(B,M,1)+ticks(A,Nn,3)+ticks(B,Nn,3);}
  else if(o.tick!==false&&o.seg!==false)s+=ticks(A,M,1)+ticks(B,M,1);
  if(o.tA)s+=angT(A,B,M,o.tA,44);
  if(o.tMA)s+=sideT(A,M,[130,110],o.tMA);
  s+=DOT(A)+DOT(B)+(o.seg===false&&!o.N?'':DOT(M));
  s+=TX(26,116,lb[0])+TX(234,116,lb[1])+TX(142,130,lb[2]);
  if(!(o.seg===false&&!o.N))s+=TX(146,M[1]+4,lb[3]);
  if(o.N){s+=DOT(Nn)+TX(146,Nn[1]+6,o.N);}
  s+=`<text class="vi" x="118" y="${o.N?212:162}" text-anchor="middle">${o.d||'d'}</text>`;
  return svg(260,o.N?222:172,o.alt||'Đường thẳng d vuông góc với đoạn thẳng tại trung điểm',s);
}
/* Ba hình a), b), c): kiểu 'ok' (vuông góc tại trung điểm), 'tilt' (qua trung điểm, không vuông góc), 'off' (vuông góc, không qua trung điểm) */
function figCand(types){
  const L=[['A','B'],['C','D'],['E','F']];let s='';
  types.forEach((t,i)=>{const x=i*130,P=[x+14,78],Q=[x+116,78],Mx=x+65;
    s+=SEG(P,Q)+DOT(P)+DOT(Q)+TX(x+8,72,L[i][0])+TX(x+122,72,L[i][1]);
    if(t==='ok'){s+=SEG([Mx,18],[Mx,140])+rmark([Mx,78],Q,[Mx,18],8)+ticks(P,[Mx,78],1)+ticks([Mx,78],Q,1);}
    else if(t==='tilt'){s+=SEG([Mx-26,140],[Mx+26,18])+ticks(P,[Mx,78],1)+ticks([Mx,78],Q,1);}
    else{s+=SEG([x+44,18],[x+44,140])+rmark([x+44,78],Q,[x+44,18],8);}
    s+=`<text class="vi" x="${x+65}" y="162" text-anchor="middle">${'abc'[i]})</text>`;});
  return svg(390,170,'Ba hình a, b, c, mỗi hình có một đoạn thẳng và một đường thẳng cắt đoạn thẳng đó',s);
}
/* Lưới ô vuông: đoạn AB trên một dòng kẻ, các đường thẳng: {lab, t:'v'|'o', x} (x tính theo ô) */
function figGrid(a0,len,lines){
  const c=30,x0=15,y0=10,cols=10,rows=5,y=y0+2*c;let s='';
  for(let i=0;i<=cols;i++)s+=SEG([x0+i*c,y0],[x0+i*c,y0+rows*c],'grid');
  for(let j=0;j<=rows;j++)s+=SEG([x0,y0+j*c],[x0+cols*c,y0+j*c],'grid');
  const A=[x0+a0*c,y],B=[x0+(a0+len)*c,y];
  s+=SEG(A,B);
  lines.forEach(l=>{const X=x0+l.x*c;
    if(l.t==='v'){s+=SEG([X,y0],[X,y0+rows*c]);s+=`<text class="vi" x="${X+9}" y="${y0+rows*c-6}" text-anchor="middle">${l.lab}</text>`;}
    else{s+=SEG([X-25,y0+rows*c],[X+50/3,y0]);s+=`<text class="vi" x="${X+50/3+10}" y="${y0+16}" text-anchor="middle">${l.lab}</text>`;}});
  s+=DOT(A)+DOT(B)+TX(A[0]-10,y-8,'A')+TX(B[0]+10,y-8,'B');
  return svg(330,170,'Lưới ô vuông có đoạn thẳng AB nằm trên một dòng kẻ và bốn đường thẳng',s);
}
/* ΔABC, đường trung trực của BC cắt AC tại D */
/* co giãn các điểm (toạ độ y hướng xuống) cho vừa khung W×H, lề m */
function fitP(P,W,H,m){const v=Object.values(P),xs=v.map(p=>p[0]),ys=v.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const k=Math.min((W-2*m)/((x1-x0)||1),(H-2*m)/((y1-y0)||1)),ox=(W-k*(x1-x0))/2,oy=(H-k*(y1-y0))/2,o={};
  for(const n in P)o[n]=[ox+(P[n][0]-x0)*k,oy+(P[n][1]-y0)*k];return o;}
const rad=d=>d*Math.PI/180;
/* ΔABC có ∠B = b, ∠C = c (mặc định 66°, 38°); đường trung trực của BC cắt AC tại D */
function figTrung(b,c){
  b=b||66;c=c||38;const t=Math.sin(rad(c))/Math.sin(rad(b+c)),A0=[t*Math.cos(rad(b)),-t*Math.sin(rad(b))];
  const Dy=A0[1]*0.5/(1-A0[0]),top=Math.min(A0[1],Dy)-0.12;
  const {A,B,C,D,M,T,U}=fitP({A:A0,B:[0,0],C:[1,0],D:[0.5,Dy],M:[0.5,0],T:[0.5,top],U:[0.5,0.1]},260,178,24),g=cen([A,B,C]);
  let s=`<polygon class="tri" points="${A} ${B} ${C}"/>`+SEG(T,U,'thin')+SEG(B,D)+ticks(B,M,2)+ticks(M,C,2)+rmark(M,C,T,8);
  s+=lab(A,g,'A')+lab(B,g,'B')+lab(C,g,'C')+TX(D[0]+13,D[1]-5,'D')+TX(M[0]+12,M[1]+18,'M');
  return svg(260,178,'Tam giác ABC, đường trung trực của cạnh BC đi qua trung điểm M của BC và cắt cạnh AC tại D',s);
}
/* ΔABC có M là trung điểm BC và MA = MB = MC */
function figMid(b){
  b=b||58;const B=[30,146],C=[230,146],M=[130,146],A=[130-100*Math.cos(rad(2*b)),146-100*Math.sin(rad(2*b))];
  let s=`<polygon class="tri" points="${A} ${B} ${C}"/>`+SEG(A,M)+ticks(B,M,1)+ticks(M,C,1)+ticks(A,M,1);
  s+=TX(A[0],A[1]-9,'A')+TX(18,156,'B')+TX(242,156,'C')+TX(130,166,'M');
  return svg(260,172,'Tam giác ABC, M là trung điểm của BC và MA bằng MB',s);
}
/* ΔABC cân tại A; D trên tia đối của tia BC với BD = BA; (tuỳ chọn) E trên tia đối của tia CB với CE = CA */
function figExt(withE,a){
  a=a||40;const Bq=(180-a)/2,h=Math.tan(rad(Bq)),L=1/Math.cos(rad(Bq));
  const pts={A:[0,-h],B:[-1,0],C:[1,0],D:[-1-L,0]};if(withE)pts.E=[1+L,0];
  const W=withE?330:260,H=160,{A,B,C,D,E}=fitP(pts,W,H,22);
  let s=`<polygon class="tri" points="${A} ${B} ${C}"/>`+SEG(D,B)+SEG(D,A)+ticks(A,B,1)+ticks(A,C,1)+ticks(D,B,1);
  if(withE)s+=SEG(C,E)+SEG(A,E)+ticks(C,E,1);
  s+=TX(A[0],A[1]-9,'A')+TX(B[0],B[1]+20,'B')+TX(C[0],C[1]+20,'C')+TX(D[0]-4,D[1]+20,'D')+(withE?TX(E[0]+4,E[1]+20,'E'):'');
  return svg(W,H,withE?'Tam giác ABC cân tại A; D trên tia đối của tia BC, E trên tia đối của tia CB, BD bằng BA, CE bằng CA':'Tam giác ABC cân tại A; D trên tia đối của tia BC với BD bằng BA',s);
}
/* ΔABC cân tại A, D ∈ AB, E ∈ AC, AD = AE, nối BE và CD */
function figADE(a){
  a=a||70;const h=1/Math.tan(rad(a/2)),{A,B,C}=fitP({A:[0,-h],B:[-1,0],C:[1,0]},260,166,24),D=along(A,B,.42),E=along(A,C,.42);
  let s=`<polygon class="tri" points="${A} ${B} ${C}"/>`+SEG(D,E)+SEG(B,E)+SEG(C,D)+ticks(A,D,1)+ticks(A,E,1)+ticks(D,B,2)+ticks(E,C,2);
  s+=TX(A[0],A[1]-8,'A')+TX(B[0]-12,B[1]+12,'B')+TX(C[0]+12,C[1]+12,'C')+TX(D[0]-13,D[1]+2,'D')+TX(E[0]+13,E[1]+2,'E');
  return svg(260,166,'Tam giác ABC cân tại A, D trên AB, E trên AC với AD bằng AE, nối BE và CD',s);
}
function proj(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy);return[a[0]+t*dx,a[1]+t*dy];}
/* ΔABC cân tại A, BH ⊥ AC tại H, CK ⊥ AB tại K */
function figAlt(a){
  a=a||74;const h=1/Math.tan(rad(a/2)),{A,B,C}=fitP({A:[0,-h],B:[-1,0],C:[1,0]},260,160,22),H=proj(B,A,C),K=proj(C,A,B);
  let s=`<polygon class="tri" points="${A} ${B} ${C}"/>`+SEG(B,H)+SEG(C,K)+ticks(A,B,1)+ticks(A,C,1)+rmark(H,A,B)+rmark(K,A,C);
  s+=TX(A[0],A[1]-8,'A')+TX(B[0]-12,B[1]+12,'B')+TX(C[0]+12,C[1]+12,'C')+TX(H[0]+13,H[1],'H')+TX(K[0]-13,K[1],'K');
  return svg(260,160,'Tam giác ABC cân tại A, BH vuông góc với AC tại H, CK vuông góc với AB tại K',s);
}
/* ΔABC cân tại A có góc A tù, đường trung trực của AB cắt BC tại D */
function figObt(){
  const A=[130,60],B=[20,130],C=[240,130],Mab=mid(A,B),dx=A[0]-B[0],dy=A[1]-B[1];
  // giao của đường trung trực AB với BC (y=130)
  const t=(130-Mab[1])/dx,D=[Mab[0]-dy*t,130];
  let s=`<polygon class="tri" points="${A} ${B} ${C}"/>`+SEG(along(Mab,D,-0.55),along(Mab,D,1.25),'thin')+SEG(A,D)+ticks(A,B,1)+ticks(A,C,1)+ticks(A,Mab,2)+ticks(Mab,B,2)+rmark(Mab,A,D,8);
  s+=TX(130,50,'A')+TX(10,142,'B')+TX(250,142,'C')+TX(D[0],150,'D')+TX(Mab[0]-8,Mab[1]-8,'M');
  return svg(260,158,'Tam giác ABC cân tại A có góc A tù; đường trung trực của AB đi qua trung điểm M của AB và cắt BC tại D',s);
}
/* ΔABC cân tại A, D trên AC với BD = BC */
function figBD(){
  const A=[130,16],B=[72,148],C=[188,148],bc=116,ux=(C[0]-A[0]),uy=(C[1]-A[1]);
  // D = A + t(C−A) với |D−B| = bc, lấy nghiệm khác C
  const ax=A[0]-B[0],ay=A[1]-B[1],qa=ux*ux+uy*uy,qb=2*(ax*ux+ay*uy),qc=ax*ax+ay*ay-bc*bc,tt=(-qb-Math.sqrt(qb*qb-4*qa*qc))/(2*qa),D=[A[0]+tt*ux,A[1]+tt*uy];
  let s=`<polygon class="tri" points="${A} ${B} ${C}"/>`+SEG(B,D)+ticks(A,B,1)+ticks(A,C,1)+ticks(B,D,2)+ticks(B,C,2);
  s+=TX(130,10,'A')+TX(60,160,'B')+TX(200,160,'C')+TX(D[0]+13,D[1]+3,'D');
  return svg(260,168,'Tam giác ABC cân tại A, điểm D trên cạnh AC sao cho BD bằng BC',s);
}

/* ============ Hình vẽ dùng chung (theo trang Luyện tập chung) ============ */
/* Vẽ theo toạ độ toán học (trục y hướng lên), tự co vào khung.
   o: {P:{tên:[x,y]}, fill:['ABC'], seg:['AB'], thin:['AH'], tk:[['AB',1]], rt:[['H','A','C']], arc:[['B','A','C',1]],
       ang:[['A','B','C','40°']], side:[['A','B','5 cm']], c:'tâm đặt nhãn', pos:{A:'n'}, alt, w, h} */
function G(o){
  const W=o.w||260,Hm=o.h||170,pad=26,ks=Object.keys(o.P),xs=ks.map(k=>o.P[k][0]),ys=ks.map(k=>o.P[k][1]);
  const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const sc=Math.min((W-2*pad)/((x1-x0)||1),(Hm-2*pad)/((y1-y0)||1)),H=Math.round((y1-y0)*sc+2*pad),ox=(W-(x1-x0)*sc)/2;
  const Q={};ks.forEach(k=>{Q[k]=[ox+(o.P[k][0]-x0)*sc,H-pad-(o.P[k][1]-y0)*sc];});
  const g=n=>Q[n];let s='';
  const cn=L=>[L.reduce((t,p)=>t+p[0],0)/L.length,L.reduce((t,p)=>t+p[1],0)/L.length],C=o.c?cn(o.c.split('').map(g)):cn(ks.filter(k=>k.charAt(0)!=='_').map(g));
  (o.fill||[]).forEach(t=>{s+=`<polygon class="tri" points="${t.split('').map(n=>g(n).map(f1).join(',')).join(' ')}"/>`;});
  (o.seg||[]).forEach(e=>{s+=SEG(g(e[0]),g(e[1]));});
  (o.thin||[]).forEach(e=>{s+=SEG(g(e[0]),g(e[1]),'thin');});
  (o.tk||[]).forEach(e=>{s+=ticks(g(e[0][0]),g(e[0][1]),e[1]);});
  (o.rt||[]).forEach(e=>{s+=rmark(g(e[0]),g(e[1]),g(e[2]));});
  (o.arc||[]).forEach(e=>{s+=arcs(g(e[0]),g(e[1]),g(e[2]),e[3]||1);});
  (o.ang||[]).forEach(e=>{s+=angT(g(e[0]),g(e[1]),g(e[2]),e[3],e[4]||36);});
  (o.side||[]).forEach(e=>{s+=sideT(g(e[0]),g(e[1]),C,e[2]);});
  (o.txt||[]).forEach(e=>{const q=g(e[0]);s+=`<text class="vi" x="${f1(q[0]+(e[2]||0))}" y="${f1(q[1]+(e[3]||0))}" text-anchor="middle">${e[1]}</text>`;});
  const DIR={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0],ne:[.75,-.75],nw:[-.75,-.75],se:[.75,.75],sw:[-.75,.75]};
  ks.forEach(k=>{if(k.charAt(0)==='_')return;const q=g(k),v=o.pos&&DIR[o.pos[k]];
    s+=DOT(q)+(v?TX(q[0]+v[0]*15,q[1]+v[1]*15+5,k):lab(q,C,k));});
  return fb(svg(W,H,o.alt||'Hình vẽ',s));
}
const pol=(o,r,d)=>[o[0]+r*Math.cos(rad(d)),o[1]+r*Math.sin(rad(d))];
const cut=(p1,p2,p3,p4)=>{const d=(p1[0]-p2[0])*(p3[1]-p4[1])-(p1[1]-p2[1])*(p3[0]-p4[0]),a=p1[0]*p2[1]-p1[1]*p2[0],b=p3[0]*p4[1]-p3[1]*p4[0];return[(a*(p3[0]-p4[0])-(p1[0]-p2[0])*b)/d,(a*(p3[1]-p4[1])-(p1[1]-p2[1])*b)/d];};
const footP=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy);return[a[0]+dx*t,a[1]+dy*t];};
/* Hình 4.71 (Ví dụ 1): ∠BAC = ∠BAD = al, ∠ABC = ∠ABD = be; M, N là trung điểm của AC, AD */
function figVD1(al,be,mn){
  al=al||32;be=be||20;const A=[0,0],B=[10,0],C=cut(A,pol(A,1,al),B,pol(B,1,180-be)),D=[C[0],-C[1]];
  const P={A,B,C,D};if(mn){P.M=mid(A,C);P.N=mid(A,D);}
  return G({P,fill:['ABC','ABD'],seg:mn?['BM','BN']:[],tk:mn?[['AM',1],['MC',1],['AN',1],['ND',1]]:[],arc:[['A','B','C',1],['A','B','D',1],['B','A','C',2],['B','A','D',2]],
    c:'AB',pos:{A:'w',B:'e',C:'n',D:'s',M:'nw',N:'sw'},alt:mn?'Hình: hai tam giác ABC và ABD có chung cạnh AB, M và N là trung điểm của AC và AD':'Hình: hai tam giác ABC và ABD có chung cạnh AB',h:180});
}
/* Góc xOy: A, M trên Ox; B, N trên Oy; OA = OB, OM = ON; AN cắt BM tại I */
function figXOY(o){
  o=o||52;const O=[0,0],A=[10,0],M=[5.6,0],B=pol(O,10,o),N=pol(O,5.6,o),I=cut(A,N,B,M),x=[12.4,0],y=pol(O,12.4,o);
  return G({P:{O,A,M,B,N,I,_x:x,_y:y},seg:[['O','_x'],['O','_y'],'AN','BM'],tk:[['OM',1],['ON',1],['MA',2],['NB',2]],c:'OAB',pos:{O:'sw',A:'s',M:'s',B:'nw',N:'nw',I:'e'},
    txt:[['_x','x',0,18],['_y','y',-12,0]],alt:'Góc xOy: A và M trên tia Ox, B và N trên tia Oy, OA bằng OB, OM bằng ON, AN cắt BM tại I'});
}
/* Hai đoạn thẳng AB và CD cắt nhau tại trung điểm O của mỗi đoạn */
function figCross(){
  const O=[0,0],A=pol(O,5,200),B=pol(O,5,20),C=pol(O,3.6,120),D=pol(O,3.6,300);
  return G({P:{A,B,C,D,O},seg:['AB','CD','AC','BD'],tk:[['AO',1],['OB',1],['CO',2],['OD',2]],pos:{A:'w',B:'e',C:'n',D:'s',O:'e'},alt:'Hai đoạn thẳng AB và CD cắt nhau tại O, O là trung điểm của mỗi đoạn; nối AC và BD'});
}
/* ΔMBC vuông tại M có ∠B = 60°, A trên tia đối của tia MB với MA = MB (SGK 4.32) */
function figHalf(){
  const M=[0,0],B=[0,-4],A=[0,4],C=[4*Math.sqrt(3),0];
  return G({P:{A,M,B,C},fill:['ABC'],seg:['MC'],tk:[['AM',1],['MB',1]],rt:[['M','C','A']],ang:[['B','M','C','60°',30]],pos:{A:'n',M:'w',B:'s',C:'e'},alt:'Tam giác ABC, M là trung điểm của AB, CM vuông góc với AB, góc B bằng 60 độ',h:180});
}
/* ΔABC vuông tại A có ∠C = c, tia phân giác của góc B cắt AC tại D */
function figBis30(){
  const A=[0,0],B=[0,3],C=[3*Math.sqrt(3),0],D=[Math.sqrt(3),0];
  return G({P:{A,B,C,D},fill:['ABC'],seg:['BD'],rt:[['A','B','C']],arc:[['B','A','D',1],['B','D','C',1]],ang:[['C','A','B','30°',40]],pos:{A:'sw',B:'n',C:'se',D:'s'},alt:'Tam giác ABC vuông tại A, góc C bằng 30 độ, tia phân giác của góc B cắt AC tại D'});
}
/* Tia phân giác Oz của góc xOy, M trên Oz, MA ⊥ Ox, MB ⊥ Oy */
function figBisPerp(){
  const O=[0,0],M=pol(O,8,25),A=[M[0],0],B=footP(M,O,pol(O,1,50)),x=[11,0],y=pol(O,11,50),z=pol(O,11,25);
  return G({P:{O,M,A,B,_x:x,_y:y,_z:z},seg:[['O','_x'],['O','_y'],'MA','MB'],thin:[['O','_z']],rt:[['A','O','M'],['B','O','M']],arc:[['O','_x','_z',1],['O','_z','_y',1]],
    pos:{O:'w',M:'e',A:'s',B:'nw'},txt:[['_x','x',0,18],['_y','y',-12,0],['_z','z',12,0]],alt:'Tia Oz là tia phân giác của góc xOy, M trên Oz, MA vuông góc với Ox tại A, MB vuông góc với Oy tại B'});
}
/* ΔABC cân tại A, tia phân giác của góc B cắt AC tại D (tuỳ chọn E trên BC với BE = BA) */
function figIsoBis(a,withE){
  a=a||40;const p=[[0,0],pol([0,0],10,270-a/2),pol([0,0],10,270+a/2)],A=p[0],B=p[1],C=p[2],Bq=(180-a)/2;
  const D=cut(B,pol(B,1,Bq/2),A,C),P={A,B,C,D};if(withE)P.E=add2(B,C,10/Math.hypot(C[0]-B[0],C[1]-B[1]));
  return G({P,fill:['ABC'],seg:withE?['BD','DE']:['BD'],tk:[['AB',1],['AC',1]].concat(withE?[['BE',1]]:[]),arc:[['B','A','D',1],['B','D','C',1]],pos:{A:'n',B:'sw',C:'se',D:'e',E:'s'},alt:withE?'Tam giác ABC cân tại A, BD là tia phân giác của góc B, E trên BC với BE bằng BA':'Tam giác ABC cân tại A, tia phân giác của góc B cắt AC tại D'});
}
const add2=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
/* ΔABC cân tại A (∠A < 60°), tam giác đều BCD với D nằm trong tam giác ABC */
function figEqIn(a){
  a=a||30;const A=[0,0],B=pol(A,10,270-a/2),C=pol(A,10,270+a/2),D=[0,B[1]+Math.abs(C[0]-B[0])*Math.sqrt(3)/2];
  return G({P:{A,B,C,D},fill:['ABC'],seg:['BD','CD','AD'],tk:[['AB',1],['AC',1],['BD',2],['CD',2],['BC',2]],pos:{A:'n',B:'sw',C:'se',D:'e'},alt:'Tam giác ABC cân tại A, tam giác đều BCD có D nằm trong tam giác ABC, nối AD',h:190});
}
/* ΔABC cân tại A, đường trung trực của AB cắt AC tại D */
function figPbAB(a){
  a=a||40;const A=[0,0],B=pol(A,10,270-a/2),C=pol(A,10,270+a/2),Mm=mid(A,B),D=cut(Mm,[Mm[0]+(B[1]-A[1]),Mm[1]-(B[0]-A[0])],A,C);
  return G({P:{A,B,C,D,M:Mm},fill:['ABC'],seg:['BD'],thin:['MD'],tk:[['AM',2],['MB',2]],rt:[['M','A','D']],pos:{A:'n',B:'sw',C:'se',D:'e',M:'w'},alt:'Tam giác ABC cân tại A, đường trung trực của AB đi qua trung điểm M của AB và cắt AC tại D'});
}
/* ΔABC, đường trung trực của BC cắt AC tại D, BD là tia phân giác của góc B */
function figPbBis(c){c=c||35;return figTrung(2*c,c);}
/* Đo khoảng cách AB qua hồ: C ở ngoài, D trên tia đối CA với CD = CA, E trên tia đối CB với CE = CB */
function figPond(){
  const C=[0,0],A=[-6,4.2],B=[-1.5,6.4],D=[6,-4.2],E=[1.5,-6.4];
  return G({P:{A,B,C,D,E},seg:['AD','BE','DE'],thin:['AB'],tk:[['AC',1],['CD',1],['BC',2],['CE',2]],pos:{A:'w',B:'n',C:'e',D:'e',E:'s'},alt:'Hai điểm A, B ở hai bờ hồ; C là một điểm đứng được; D, E nằm trên tia đối của tia CA, CB với CD bằng CA, CE bằng CB',h:190});
}
/* Con diều ABCD: AB = AD, CB = CD; hai thanh AC và BD cắt nhau tại O */
function figKite(){
  const A=[0,8],B=[-4,4.6],D=[4,4.6],C=[0,-6],O=[0,4.6];
  return G({P:{A,B,C,D,O},fill:['ABCD'],seg:['AC','BD'],tk:[['AB',1],['AD',1],['BC',2],['DC',2]],rt:[['O','D','A']],pos:{A:'n',B:'w',C:'s',D:'e',O:'se'},alt:'Con diều ABCD có AB bằng AD, CB bằng CD, hai thanh AC và BD cắt nhau tại O'});
}
/* Cột cờ AH thẳng đứng, hai dây néo AB, AC, HB = HC */
function figPole(){
  const H=[0,0],A=[0,8],B=[-5,0],C=[5,0];
  return G({P:{A,B,C,H},seg:['AH','AB','AC','BC'],tk:[['BH',1],['HC',1]],rt:[['H','C','A']],pos:{A:'n',B:'s',C:'s',H:'s'},alt:'Cột cờ AH vuông góc với mặt đất BC, hai dây néo AB và AC, HB bằng HC'});
}

/* ============ Hình vẽ riêng của Bài tập cuối chương IV ============ */
/* Tam giác có ∠B = b, ∠C = c, cạnh BC nằm ngang (toạ độ toán học, trục y hướng lên) */
function triBC(b,c){const B=[0,0],C=[10,0],A=cut(B,pol(B,1,b),C,pol(C,1,180-c));return{A,B,C};}
/* ΔABC có ghi số đo góc: t = {A:'..',B:'..',C:'..'} (để trống thì không ghi); l = tên ba đỉnh */
function figAng(b,c,t,l){
  t=t||{};l=l||['A','B','C'];const {A,B,C}=triBC(b,c),P={};P[l[0]]=A;P[l[1]]=B;P[l[2]]=C;const [a0,b0,c0]=l,ang=[];
  if(t.A)ang.push([a0,b0,c0,t.A,34]);if(t.B)ang.push([b0,a0,c0,t.B,38]);if(t.C)ang.push([c0,a0,b0,t.C,38]);
  return G({P,fill:[l.join('')],ang,pos:{[a0]:'n',[b0]:'sw',[c0]:'se'},alt:`Tam giác ${l.join('')}`+(t.A||t.B||t.C?' có ghi số đo góc':'')});
}
/* ΔABC, D nằm trên tia đối của tia CB (góc ACD kề bù với góc ACB) */
function figExtC(b,c){
  const {A,B,C}=triBC(b,c),D=[15,0];
  return G({P:{A,B,C,D},fill:['ABC'],seg:['CD'],ang:[['C','A','D','?',26]],pos:{A:'n',B:'sw',C:'s',D:'se'},alt:'Tam giác ABC, điểm D nằm trên tia đối của tia CB'});
}
/* ΔABC, tia phân giác của góc B cắt AC tại D, tia phân giác của góc C cắt AB tại E, BD cắt CE tại I */
function figBisI(b,c){
  b=b||64;c=c||52;const {A,B,C}=triBC(b,c),D=cut(B,pol(B,1,b/2),A,C),E=cut(C,pol(C,1,180-c/2),A,B),I=cut(B,D,C,E);
  return G({P:{A,B,C,D,E,I},fill:['ABC'],seg:['BD','CE'],arc:[['B','C','D',1],['B','D','A',1],['C','E','B',2],['C','A','E',2]],pos:{A:'n',B:'sw',C:'se',D:'ne',E:'nw',I:'s'},alt:'Tam giác ABC, hai tia phân giác BD và CE cắt nhau tại I'});
}
/* ΔABC, AH ⊥ BC tại H, AD là tia phân giác của góc BAC (D trên BC) */
function figHAD(b,c){
  b=b||70;c=c||40;const {A,B,C}=triBC(b,c),H=[A[0],0],a=180-b-c,D=cut(A,pol(A,1,270-(90-b)+a/2),B,C);
  return G({P:{A,B,C,H,D},fill:['ABC'],seg:['AH','AD'],rt:[['H','C','A']],arc:[['A','B','D',1],['A','D','C',1]],pos:{A:'n',B:'sw',C:'se',H:'s',D:'s'},alt:'Tam giác ABC, AH vuông góc với BC tại H, AD là tia phân giác của góc BAC'});
}
/* ΔABC vuông tại A; D, E trên cạnh BC với BD = BA, CE = CA */
function figDE(b){
  b=b||55;const A=[0,0],B=[0,10*Math.sin(rad(90-b))],C=[10*Math.cos(rad(90-b)),0];
  const ab=Math.hypot(B[0],B[1]),ac=C[0],bc=Math.hypot(C[0]-B[0],C[1]-B[1]),D=add2(B,C,ab/bc),E=add2(C,B,ac/bc);
  return G({P:{A,B,C,D,E},fill:['ABC'],seg:['AD','AE'],rt:[['A','C','B']],tk:[['BA',1],['BD',1],['CA',2],['CE',2]],pos:{A:'sw',B:'n',C:'se',D:'ne',E:'ne'},alt:'Tam giác ABC vuông tại A, D và E trên cạnh BC với BD bằng BA, CE bằng CA'});
}
/* ΔABC vuông tại A, AH ⊥ BC tại H, tia phân giác của góc HAC cắt BC tại D */
function figRtD(b){
  b=b||50;const A=[0,0],B=[0,10*Math.sin(rad(90-b))],C=[10*Math.cos(rad(90-b)),0],H=footP(A,B,C),D=cut(A,pol(A,1,(Math.atan2(H[1],H[0])*180/Math.PI)/2),B,C);
  return G({P:{A,B,C,H,D},fill:['ABC'],seg:['AH','AD'],rt:[['A','C','B'],['H','C','A']],arc:[['A','H','D',1],['A','D','C',1]],pos:{A:'sw',B:'n',C:'se',H:'ne',D:'ne'},alt:'Tam giác ABC vuông tại A, AH vuông góc với BC, tia phân giác của góc HAC cắt BC tại D'});
}
/* ΔABC, M là trung điểm của BC, E trên tia đối của tia MA với ME = MA */
function figME(){
  const B=[0,0],C=[10,0],A=[3,6],M=[5,0],E=[7,-6];
  return G({P:{A,B,C,M,E},fill:['ABC'],seg:['AE','CE'],thin:['BE'],tk:[['BM',1],['MC',1],['AM',2],['ME',2]],pos:{A:'n',B:'w',C:'e',M:'nw',E:'s'},alt:'Tam giác ABC, M là trung điểm của BC, E nằm trên tia đối của tia MA với ME bằng MA',h:190});
}
/* Hai tam giác ABC và ABD (C, D khác phía AB) có AC = AD, BC = BD */
function figKiteAB(){
  const A=[0,0],B=[10,0],C=[3.2,4.4],D=[3.2,-4.4];
  return G({P:{A,B,C,D},fill:['ABC','ABD'],tk:[['AC',1],['AD',1],['BC',2],['BD',2]],pos:{A:'w',B:'e',C:'n',D:'s'},alt:'Hai tam giác ABC và ABD có chung cạnh AB, AC bằng AD, BC bằng BD',h:180});
}
/* Tia phân giác Oz của góc xOy; A trên Ox, B trên Oy, OA = OB, M trên Oz */
function figOzAB(o){
  o=o||64;const O=[0,0],A=[9,0],B=pol(O,9,o),M=pol(O,6,o/2),x=[12,0],y=pol(O,12,o),z=pol(O,12,o/2);
  return G({P:{O,A,B,M,_x:x,_y:y,_z:z},seg:[['O','_x'],['O','_y'],'MA','MB'],thin:[['O','_z']],tk:[['OA',1],['OB',1]],arc:[['O','_x','_z',1],['O','_z','_y',1]],
    pos:{O:'w',A:'s',B:'nw',M:'se'},txt:[['_x','x',0,18],['_y','y',-12,0],['_z','z',12,0]],alt:'Tia Oz là tia phân giác của góc xOy, A trên Ox, B trên Oy với OA bằng OB, M nằm trên Oz'});
}
/* ΔABC vuông tại A, tia phân giác của góc B cắt AC tại D, DE ⊥ BC tại E */
function figBisDE(b){
  b=b||56;const A=[0,0],B=[0,10*Math.sin(rad(90-b))],C=[10*Math.cos(rad(90-b)),0];
  const D2=cut(B,pol(B,1,-90+b/2),A,C),E=footP(D2,B,C);
  return G({P:{A,B,C,D:D2,E},fill:['ABC'],seg:['BD','DE'],rt:[['A','C','B'],['E','C','D']],arc:[['B','A','D',1],['B','D','C',1]],pos:{A:'sw',B:'n',C:'se',D:'s',E:'ne'},alt:'Tam giác ABC vuông tại A, BD là tia phân giác của góc B, DE vuông góc với BC tại E'});
}
/* ΔABC cân tại A, D và E trên cạnh BC với BD = CE */
function figIsoDE(a){
  a=a||50;const p=[[0,0],pol([0,0],10,270-a/2),pol([0,0],10,270+a/2)],A=p[0],B=p[1],C=p[2],D=add2(B,C,.25),E=add2(B,C,.75);
  return G({P:{A,B,C,D,E},fill:['ABC'],seg:['AD','AE'],tk:[['AB',1],['AC',1],['BD',2],['EC',2]],pos:{A:'n',B:'sw',C:'se',D:'s',E:'s'},alt:'Tam giác ABC cân tại A, D và E trên cạnh BC với BD bằng CE'});
}
/* ΔABC cân tại A, đường trung trực của AC cắt AB tại D */
function figPbAC(a){
  a=a||40;const A=[0,0],B=pol(A,10,270-a/2),C=pol(A,10,270+a/2),Mm=mid(A,C),D=cut(Mm,[Mm[0]+(C[1]-A[1]),Mm[1]-(C[0]-A[0])],A,B);
  return G({P:{A,B,C,D,M:Mm},fill:['ABC'],seg:['CD'],thin:['MD'],tk:[['AM',2],['MC',2]],rt:[['M','D','C']],pos:{A:'n',B:'sw',C:'se',D:'w',M:'e'},alt:'Tam giác ABC cân tại A, đường trung trực của AC đi qua trung điểm M của AC và cắt AB tại D'});
}
/* ΔABC vuông tại A có ∠B = 60°, M là trung điểm của BC */
function figRt60M(){
  const A=[0,0],B=[0,5],C=[5*Math.sqrt(3),0],M=mid(B,C);
  return G({P:{A,B,C,M},fill:['ABC'],seg:['AM'],rt:[['A','C','B']],tk:[['BM',1],['MC',1]],ang:[['B','A','C','60°',30]],pos:{A:'sw',B:'n',C:'se',M:'ne'},alt:'Tam giác ABC vuông tại A, góc B bằng 60 độ, M là trung điểm của BC'});
}
/* Mái nhà: vì kèo ABC cân tại A, thanh AH ⊥ BC */
function figRoof(){
  const A=[0,4.2],B=[-7,0],C=[7,0],H=[0,0],P=[-7.8,-0.6],Q=[7.8,-0.6];
  return G({P:{A,B,C,H},seg:['AB','AC','BC','AH'],rt:[['H','C','A']],tk:[['BH',1],['HC',1]],pos:{A:'n',B:'sw',C:'se',H:'s'},alt:'Vì kèo mái nhà là tam giác ABC cân tại A, thanh chống AH vuông góc với BC'});
}
/* Hai cột đèn AB và DE thẳng đứng, bóng BC và EF trên mặt đất */
function figShadow(){
  const B=[0,0],A=[0,5],C=[4.2,0],E=[9,0],D=[9,5],F=[13.2,0];
  return G({P:{A,B,C,D,E,F},seg:['AB','BC','DE','EF'],thin:['AC','DF'],rt:[['B','C','A'],['E','F','D']],arc:[['C','A','B',1],['F','D','E',1]],pos:{A:'n',B:'s',C:'s',D:'n',E:'s',F:'s'},alt:'Hai cột đèn AB và DE thẳng đứng, tia nắng AC và DF, bóng BC và EF trên mặt đất'});
}
/* Thang chữ A: hai chân AB = AC, thanh giằng DE với AD = AE */
function figLadder(){
  const A=[0,9],B=[-3.2,0],C=[3.2,0],D=add2(A,B,.55),E=add2(A,C,.55);
  return G({P:{A,B,C,D,E},seg:['AB','AC','DE'],thin:['BC'],tk:[['AD',1],['AE',1],['DB',2],['EC',2]],pos:{A:'n',B:'sw',C:'se',D:'w',E:'e'},alt:'Thang chữ A có hai chân AB bằng AC, thanh giằng DE với AD bằng AE'});
}
/* Gấp tờ giấy hình tam giác ABC để B trùng C: nếp gấp đi qua trung điểm M của BC, cắt AC tại D */
function figFold(){
  const B=[0,0],C=[10,0],A=[2.4,6.4],M=[5,0],D=cut(M,[5,1],A,C);
  return G({P:{A,B,C,M,D},fill:['ABC'],seg:['BD'],thin:['MD'],tk:[['BM',1],['MC',1]],rt:[['M','C','D']],pos:{A:'n',B:'sw',C:'se',M:'s',D:'ne'},alt:'Tờ giấy hình tam giác ABC, nếp gấp đi qua trung điểm M của BC, vuông góc với BC và cắt AC tại D'});
}

/* ============ Chủ đề ============ */
const TOPICS={
  tg:{short:'Tổng các góc của tam giác',name:'Tổng các góc trong một tam giác',rule:'Tổng ba góc của một tam giác bằng 180°. Tam giác nhọn có ba góc nhọn; tam giác vuông có một góc vuông; tam giác tù có một góc tù. Trong tam giác vuông, hai góc nhọn phụ nhau.',tip:'Muốn tính một góc, hãy tìm tam giác chứa góc đó rồi lấy 180° trừ hai góc còn lại. Hai góc kề bù có tổng 180°.'},
  bn:{short:'Hai tam giác bằng nhau',name:'Hai tam giác bằng nhau. Các trường hợp c.c.c, c.g.c, g.c.g',rule:'Hai tam giác bằng nhau nếu có: ba cạnh bằng nhau (c.c.c); hai cạnh và góc xen giữa bằng nhau (c.g.c); một cạnh và hai góc kề cạnh đó bằng nhau (g.c.g). Hai tam giác bằng nhau thì các cạnh tương ứng, các góc tương ứng bằng nhau.',tip:'Viết kí hiệu ΔABC = ΔDEF theo đúng thứ tự các đỉnh tương ứng. Với c.g.c, góc phải xen giữa hai cạnh; với g.c.g, hai góc phải kề cạnh đó.'},
  tv:{short:'Tam giác vuông bằng nhau',name:'Các trường hợp bằng nhau của tam giác vuông',rule:'Hai tam giác vuông bằng nhau nếu có: hai cạnh góc vuông; một cạnh góc vuông và một góc nhọn kề cạnh ấy; cạnh huyền và một góc nhọn; cạnh huyền và một cạnh góc vuông bằng nhau.',tip:'Cạnh huyền là cạnh đối diện với góc vuông. Muốn chứng minh hai đoạn thẳng hay hai góc bằng nhau, hãy tìm hai tam giác vuông chứa chúng.'},
  cn:{short:'Tam giác cân, tam giác đều',name:'Tam giác cân, tam giác đều',rule:'Tam giác cân có hai cạnh bên bằng nhau và hai góc ở đáy bằng nhau; ngược lại tam giác có hai góc bằng nhau là tam giác cân. Tam giác đều có ba cạnh bằng nhau, mỗi góc bằng 60°.',tip:'Góc ở đáy = (180° − góc ở đỉnh) : 2; góc ở đỉnh = 180° − 2 · góc ở đáy. Tam giác cân có một góc 60° là tam giác đều.'},
  tt:{short:'Đường trung trực',name:'Đường trung trực của đoạn thẳng',rule:'Đường thẳng vuông góc với một đoạn thẳng tại trung điểm của nó là đường trung trực của đoạn thẳng đó. Điểm nằm trên đường trung trực thì cách đều hai mút; điểm cách đều hai mút thì nằm trên đường trung trực.',tip:'Điểm D nằm trên đường trung trực của BC thì DB = DC, nên ΔDBC cân tại D. Hai điểm cùng cách đều hai mút xác định đường trung trực.'}
};
const TKEYS=['tg','bn','tv','cn','tt'];
const TDESC={tg:'Tổng ba góc, tam giác nhọn, vuông, tù, hai góc nhọn phụ nhau (Bài 12)',bn:'Cạnh và góc tương ứng, ba trường hợp c.c.c, c.g.c, g.c.g (Bài 13, 14)',tv:'Bốn trường hợp bằng nhau của tam giác vuông (Bài 15)',cn:'Tam giác cân, tam giác đều, tam giác vuông cân (Bài 16)',tt:'Đường trung trực và tính chất cách đều hai mút (Bài 16)'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhớ tính chất, nhận ra trường hợp bằng nhau, tính một bước.',TH:'Tính góc, độ dài qua hai ba bước; chọn đúng trường hợp bằng nhau.',VD:'Phối hợp nhiều bài trong chương, lập luận nhiều bước, tình huống thực tế.'};
let RNG=Math.random,SEEDED=false;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19;}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^h>>>16)>>>0;}
const ri=(a,b)=>a+Math.floor(RNG()*(b-a+1));
const sel=a=>a[ri(0,a.length-1)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(RNG()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const N=x=>x<0?'−'+(-x):''+x;
const nf=x=>String(x).replace('.',',');

/* ============ Công cụ soạn câu ============ */
const mk=(stem,right,wrongs,exp,extra)=>Object.assign({stem,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),ans:0,exp},extra||{});
function pick3(right,cands){const seen=new Set([String(right)]),w=[];for(const c of cands){const k=String(c[0]);if(c[0]==null||seen.has(k))continue;seen.add(k);w.push(c);if(w.length===3)break;}return w.length===3?w:null;}
function retry(f){for(let i=0;i<300;i++){const r=f();if(r)return r;}throw new Error('Bộ sinh không tạo được câu');}
const g=x=>x+'°';
const okA=x=>x>0&&x<180;
/* hai bộ tên tam giác khác chữ */
const PAIRS=[[['A','B','C'],['D','E','F']],[['A','B','C'],['M','N','P']],[['M','N','P'],['H','I','K']],[['D','E','F'],['P','Q','R']],[['A','B','C'],['X','Y','Z']]];
const LS=[['A','B','C'],['M','N','P'],['D','E','F'],['H','I','K'],['P','Q','R'],['X','Y','Z']];

/* ============ Câu nhiều lựa chọn ============ */
const MC=[
 {id:'c_tg1',type:'mc',topic:'tg',level:'NB',stem:'Khẳng định nào sau đây đúng?',ans:0,opts:[
   {t:'Mỗi tam giác có ít nhất hai góc nhọn'},
   {t:'Một tam giác có thể có hai góc vuông',err:'Hai góc vuông đã có tổng 180°, góc thứ ba bằng 0°: không có tam giác nào như vậy.'},
   {t:'Một tam giác có thể có hai góc tù',err:'Hai góc tù có tổng lớn hơn 180°, trái với tổng ba góc của tam giác bằng 180°.'},
   {t:'Trong tam giác vuông, hai góc nhọn bù nhau',err:'Hai góc nhọn của tam giác vuông có tổng 90°, tức là phụ nhau, không phải bù nhau.'}],
  exp:'Tổng ba góc của tam giác bằng 180° nên một tam giác có nhiều nhất một góc vuông hoặc một góc tù; hai góc còn lại là góc nhọn.'},
 {id:'c_bn1',type:'mc',topic:'bn',level:'NB',stem:'Hai tam giác ABC và MNP có AB = MN, ∠A = ∠M, AC = MP. Khẳng định nào sau đây đúng?',ans:0,opts:[
   {t:'ΔABC = ΔMNP (c.g.c)'},
   {t:'ΔABC = ΔMPN (c.g.c)',err:'AB = MN nên B ứng với N, AC = MP nên C ứng với P. Phải viết ΔABC = ΔMNP.'},
   {t:'ΔABC = ΔMNP (c.c.c)',err:'Đề chỉ cho hai cặp cạnh, không có cặp cạnh thứ ba: đây là trường hợp c.g.c.'},
   {t:'ΔABC = ΔMNP (g.c.g)',err:'Đề cho hai cạnh và góc xen giữa, không phải một cạnh và hai góc kề.'}],
  exp:'∠A xen giữa hai cạnh AB, AC; ∠M xen giữa hai cạnh MN, MP. Vậy ΔABC = ΔMNP (c.g.c).'},
 {id:'c_tv1',type:'mc',topic:'tv',level:'NB',stem:'Cho ΔDEF vuông tại E. Cạnh huyền của tam giác này là:',ans:0,opts:[
   {t:'DF'},
   {t:'DE',err:'DE là cạnh góc vuông (một cạnh kề góc vuông E).'},
   {t:'EF',err:'EF là cạnh góc vuông (một cạnh kề góc vuông E).'},
   {t:'Cạnh dài nhất trong hai cạnh DE, EF',err:'Cạnh huyền là cạnh đối diện với góc vuông, không phải DE hay EF.'}],
  exp:'Cạnh huyền là cạnh đối diện với góc vuông. Góc vuông ở đỉnh E nên cạnh huyền là DF.'},
 {id:'c_tv2',type:'mc',topic:'tv',level:'TH',stem:'Hai tam giác ABC vuông tại A và DEF vuông tại D. Dữ kiện nào sau đây <b>chưa đủ</b> để kết luận ΔABC = ΔDEF?',ans:0,opts:[
   {t:'∠B = ∠E và ∠C = ∠F'},
   {t:'AB = DE và AC = DF',err:'Đây là trường hợp hai cạnh góc vuông, đủ để kết luận.'},
   {t:'BC = EF và ∠B = ∠E',err:'Đây là trường hợp cạnh huyền – góc nhọn, đủ để kết luận.'},
   {t:'BC = EF và AC = DF',err:'Đây là trường hợp cạnh huyền – cạnh góc vuông, đủ để kết luận.'}],
  exp:'Chỉ có các cặp góc bằng nhau thì hai tam giác có thể to nhỏ khác nhau. Cần ít nhất một cặp cạnh tương ứng bằng nhau.'},
 {id:'c_cn1',type:'mc',topic:'cn',level:'NB',stem:'Cho ΔABC cân tại A. Khẳng định nào sau đây đúng?',ans:0,opts:[
   {t:'AB = AC và ∠B = ∠C'},
   {t:'AB = BC và ∠A = ∠C',err:'Tam giác cân tại A có hai cạnh bên AB, AC (cùng đi qua đỉnh A).'},
   {t:'AB = AC và ∠A = ∠B',err:'Hai góc ở đáy là ∠B và ∠C, không phải ∠A và ∠B.'},
   {t:'AB = AC = BC',err:'Ba cạnh bằng nhau là tam giác đều; tam giác cân chỉ chắc chắn có hai cạnh bằng nhau.'}],
  exp:'ΔABC cân tại A: hai cạnh bên AB = AC, đáy BC, hai góc ở đáy ∠B = ∠C.'},
 {id:'c_cn2',type:'mc',topic:'cn',level:'NB',stem:'Tam giác cân có góc ở đáy bằng 60° là:',ans:0,opts:[
   {t:'tam giác đều'},
   {t:'tam giác vuông cân',err:'Góc ở đỉnh bằng 180° − 2 · 60° = 60°, không phải 90°.'},
   {t:'tam giác tù',err:'Ba góc đều bằng 60°, không có góc tù.'},
   {t:'tam giác cân nhưng không đều',err:'Ba góc đều bằng 60° nên tam giác đều.'}],
  exp:'Góc ở đỉnh bằng 180° − 2 · 60° = 60°. Ba góc bằng nhau nên tam giác đều.',mix:[12]},
 {id:'c_cn3',type:'mc',topic:'cn',level:'VD',mix:[14,15],stem:'Cho ΔABC vuông cân tại A. Trên tia đối của tia AB lấy điểm D sao cho AD = AB. Tam giác BCD là tam giác gì?',ans:0,opts:[
   {t:'Tam giác vuông cân tại C'},
   {t:'Tam giác đều',err:'∠CBD = ∠ABC = 45°, không phải 60°.'},
   {t:'Tam giác cân tại B',err:'Hai cạnh bằng nhau là CB và CD, nên tam giác cân tại C.'},
   {t:'Tam giác vuông tại B',err:'∠CBD = 45°; góc vuông là ∠BCD.'}],
  exp:'ΔCAB = ΔCAD (hai cạnh góc vuông: AB = AD, CA chung) nên CB = CD và ∠ADC = ∠ABC = 45°. Trong ΔBCD: ∠BCD = 180° − 45° − 45° = 90°. Vậy ΔBCD vuông cân tại C.'},
 {id:'c_tt1',type:'mc',topic:'tt',level:'NB',stem:'Điểm M nằm trên đường trung trực của đoạn thẳng AB. Khẳng định nào sau đây đúng?',ans:0,opts:[
   {t:'MA = MB'},
   {t:'M là trung điểm của AB',err:'Mọi điểm trên đường trung trực đều cách đều A và B; chỉ có một điểm là trung điểm của AB.'},
   {t:'MA = AB',err:'Không có cơ sở; tính chất của đường trung trực là MA = MB.'},
   {t:'MA ⊥ AB',err:'Đường trung trực vuông góc với AB, nhưng đoạn MA thì không.'}],
  exp:'Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai mút của đoạn thẳng đó: MA = MB.'}
];
const addMC=(id,topic,level,gen,extra)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},extra||{}));

/* --- Tổng các góc của tam giác (Bài 12) --- */
function gTgSum(){return retry(()=>{
  const l=sel(LS),a=ri(25,100),b=ri(20,150-a),c=180-a-b;if(c<15||a===b||b===c||a===c)return null;
  const w=pick3(g(c),[[g(180-a),`Mới trừ ∠${l[0]}; phải trừ cả ∠${l[0]} và ∠${l[1]}.`],[g(a+b),`${a+b}° là tổng hai góc đã biết, chưa trừ khỏi 180°.`],[g(360-a-b),'Tổng ba góc của tam giác là 180°, không phải 360°.'],[g(180-b),`Mới trừ ∠${l[1]}; phải trừ cả hai góc.`]]);
  if(!w)return null;
  return mk(`Cho Δ${l.join('')} có ∠${l[0]} = ${a}°, ∠${l[1]} = ${b}°. Số đo ∠${l[2]} là:`,g(c),w,`∠${l[2]} = 180° − (${a}° + ${b}°) = ${c}° (tổng ba góc của một tam giác bằng 180°).`,{fig:figAng(b,c,{A:a+'°',B:b+'°',C:'?'},l)});
});}
function gTgKind(){return retry(()=>{
  const l=sel(LS),k=ri(0,2);let a,b;
  if(k===0){a=ri(45,85);b=ri(Math.max(10,95-a),85);if(180-a-b>=90||180-a-b<10)return null;}
  else if(k===1){a=ri(20,70);b=90-a;}
  else{a=ri(15,45);b=ri(10,80-a);if(180-a-b<=90)return null;}
  const c=180-a-b,ans=['Tam giác nhọn','Tam giác vuông','Tam giác tù'][k];
  const why=[`∠${l[2]} = ${c}°, cả ba góc đều nhọn.`,`∠${l[2]} = ${c}° là góc vuông.`,`∠${l[2]} = ${c}° là góc tù.`];
  const all=['Tam giác nhọn','Tam giác vuông','Tam giác tù','Tam giác đều'];
  return mk(`Cho Δ${l.join('')} có ∠${l[0]} = ${a}°, ∠${l[1]} = ${b}°. Tam giác ${l.join('')} là:`,ans,all.filter(t=>t!==ans).map(t=>[t,(t==='Tam giác đều'?'Tam giác đều có ba góc bằng 60°. ':'Tính góc thứ ba trước rồi mới xét. ')+why[k]]),`∠${l[2]} = 180° − ${a}° − ${b}° = ${c}°. `+why[k]+` Vậy Δ${l.join('')} là ${ans.toLowerCase()}.`);
});}
function gTgRt(){return retry(()=>{
  const l=sel(LS),b=ri(18,72);if(b===45)return null;
  return mk(`Cho Δ${l.join('')} vuông tại ${l[0]} có ∠${l[1]} = ${b}°. Số đo ∠${l[2]} là:`,g(90-b),[[g(180-b),'Phải trừ cả góc vuông: 180° − 90° − '+b+'°.'],[g(b),'Hai góc nhọn của tam giác vuông phụ nhau, chỉ bằng nhau khi mỗi góc 45°.'],[g(90+b),'Hai góc nhọn có tổng 90°, nên lấy 90° − '+b+'°.']],`Trong tam giác vuông, hai góc nhọn phụ nhau: ∠${l[2]} = 90° − ${b}° = ${90-b}°.`);
});}
function gTgDiff(){return retry(()=>{
  const l=sel(LS),a=ri(30,110),d=2*ri(2,15),c=(180-a-d)/2;if(c<12||!Number.isInteger(c))return null;const b=c+d;
  const w=pick3(g(c),[[g(b),`${b}° là số đo ∠${l[1]}; đề hỏi ∠${l[2]}.`],[g((180-a)/2),'Hai góc không bằng nhau: ∠'+l[1]+' lớn hơn ∠'+l[2]+' '+d+'°.'],[g(180-a-d),'Quên chia 2: ∠'+l[1]+' + ∠'+l[2]+' = '+(180-a)+'° gồm hai lần ∠'+l[2]+' cộng '+d+'°.'],[g(c+d/2),'Tính nhầm; 2 · ∠'+l[2]+' = '+(180-a)+'° − '+d+'°.']].filter(z=>parseFloat(z[0])>0));
  if(!w)return null;
  return mk(`Cho Δ${l.join('')} có ∠${l[0]} = ${a}° và ∠${l[1]} lớn hơn ∠${l[2]} là ${d}°. Số đo ∠${l[2]} là:`,g(c),w,`∠${l[1]} + ∠${l[2]} = 180° − ${a}° = ${180-a}°. Mà ∠${l[1]} = ∠${l[2]} + ${d}° nên 2 · ∠${l[2]} = ${180-a}° − ${d}° = ${180-a-d}°, ∠${l[2]} = ${c}°.`);
});}
function gTgBis(){return retry(()=>{
  const a=2*ri(15,54),ans=90+a/2;
  const w=pick3(g(ans),[[g(180-a),'Đó là ∠B + ∠C; ∠IBC + ∠ICB chỉ bằng một nửa tổng này.'],[g(90-a/2),`${90-a/2}° là ∠IBC + ∠ICB; còn phải lấy 180° trừ đi.`],[g(180-a/2),'Nhầm: ∠IBC + ∠ICB = (180° − ∠A) : 2, không phải ∠A : 2.'],[g(2*a),'Không có quy tắc này.']].filter(z=>parseFloat(z[0])<180));
  if(!w)return null;
  const b=ri(Math.max(25,Math.ceil((180-a)/2)-20),Math.min(150-a,Math.floor((180-a)/2)+20)),c=180-a-b;
  return mk(`Cho ΔABC có ∠A = ${a}°. Hai tia phân giác của góc B và góc C cắt nhau tại I (như hình). Số đo ∠BIC là:`,g(ans),w,`∠B + ∠C = 180° − ${a}° = ${180-a}°. BI, CI là tia phân giác nên ∠IBC + ∠ICB = ${180-a}° : 2 = ${90-a/2}°. Trong ΔIBC: ∠BIC = 180° − ${90-a/2}° = ${ans}°.`,{fig:figBisI(b,c)});
});}
function gTgHAD(){return retry(()=>{
  const c=ri(25,60),b=c+2*ri(3,20);if(b>=90||180-b-c<20)return null;const a=180-b-c,ans=(b-c)/2;
  const w=pick3(g(ans),[[g(a/2),`${a/2}° là ∠BAD (nửa ∠BAC); còn phải trừ ∠BAH.`],[g(90-b),`${90-b}° là ∠BAH; ∠HAD = ∠BAD − ∠BAH.`],[g(b-c),'Quên chia 2: ∠HAD = (∠B − ∠C) : 2.'],[g(90-c),`${90-c}° là ∠CAH, không phải ∠HAD.`]].filter(z=>parseFloat(z[0])>0));
  if(!w)return null;
  return mk(`Cho ΔABC có ∠B = ${b}°, ∠C = ${c}°. Kẻ AH ⊥ BC tại H; tia phân giác của góc BAC cắt BC tại D (như hình). Số đo ∠HAD là:`,g(ans),w,`∠BAC = 180° − ${b}° − ${c}° = ${a}°, ∠BAD = ${a}° : 2 = ${a/2}°. ΔABH vuông tại H nên ∠BAH = 90° − ${b}° = ${90-b}°. Vậy ∠HAD = ∠BAD − ∠BAH = ${a/2}° − ${90-b}° = ${ans}°.`,{fig:figHAD(b,c),mix:[12]});
});}
function gTgExt(){return retry(()=>{
  const a=ri(30,95),e=ri(a+20,170);const b=e-a;if(b<15||180-a-b<15)return null;
  const w=pick3(g(b),[[g(180-e),`${180-e}° là ∠ACB (kề bù với ∠ACD), không phải ∠B.`],[g(e-(180-e)),'Nhầm cách tính; ∠B = 180° − ∠A − ∠ACB.'],[g(180-a),'Chưa trừ ∠ACB.'],[g(e+a-180),'Nhầm dấu; ∠B = ∠ACD − ∠A.']].filter(z=>parseFloat(z[0])>0));
  if(!w)return null;
  return mk(`Cho ΔABC có ∠A = ${a}°. Trên tia đối của tia CB lấy điểm D; biết ∠ACD = ${e}° (như hình). Số đo ∠ABC là:`,g(b),w,`∠ACB = 180° − ${e}° = ${180-e}° (kề bù với ∠ACD). Trong ΔABC: ∠ABC = 180° − ${a}° − ${180-e}° = ${b}°.`,{fig:figExtC(b,180-a-b)});
});}
/* --- Hai tam giác bằng nhau (Bài 13, 14) --- */
function gBnSide(){
  const [p,q]=sel(PAIRS),i=ri(0,2),j=(i+1)%3,k=(i+2)%3;
  const right=q[i]+q[j],w=[[q[i]+q[k],`${p[k]} ứng với ${q[k]}, không phải ${q[j]}.`],[q[j]+q[k],`${p[i]} ứng với ${q[i]}; cạnh ${q[j]}${q[k]} ứng với ${p[j]}${p[k]}.`],[p[i]+p[k],`Đề hỏi cạnh của Δ${q.join('')}.`]];
  return mk(`Cho Δ${p.join('')} = Δ${q.join('')}. Cạnh của Δ${q.join('')} tương ứng với cạnh ${p[i]}${p[j]} là:`,right,w,`Theo thứ tự viết: ${p[0]} ↔ ${q[0]}, ${p[1]} ↔ ${q[1]}, ${p[2]} ↔ ${q[2]}. Vậy cạnh ${p[i]}${p[j]} tương ứng với cạnh ${q[i]}${q[j]}.`);
}
function gBnAng(){return retry(()=>{
  const [p,q]=sel(PAIRS),a=ri(35,90),b=ri(30,140-a),c=180-a-b;if(c<20||c===b||c===a||a===b)return null;
  const w=pick3(g(c),[[g(b),`${b}° là số đo ∠${q[1]}, không phải ∠${q[2]}.`],[g(a),`${a}° là số đo ∠${p[0]} = ∠${q[0]}.`],[g(180-b),`Mới trừ một góc; phải trừ cả ∠${q[0]} và ∠${q[1]}.`]]);
  if(!w)return null;
  return mk(`Cho Δ${p.join('')} = Δ${q.join('')}. Biết ∠${p[0]} = ${a}°, ∠${q[1]} = ${b}°. Số đo ∠${p[2]} là:`,g(c),w,`∠${q[0]} = ∠${p[0]} = ${a}°. Trong Δ${q.join('')}: ∠${q[2]} = 180° − ${a}° − ${b}° = ${c}°. Vậy ∠${p[2]} = ∠${q[2]} = ${c}°.`,{mix:[12]});
});}
function gBnPer(){return retry(()=>{
  const [p,q]=sel(PAIRS),x=ri(3,14),y=ri(3,14),z=ri(Math.abs(x-y)+1,x+y-1);if(z<2||x===y)return null;const P=x+y+z;
  const w=pick3(`${P} cm`,[[`${x+y} cm`,`Thiếu cạnh ${p[0]}${p[2]} = ${q[0]}${q[2]} = ${z} cm.`],[`${2*P} cm`,'Chu vi một tam giác, không cộng cả hai tam giác.'],[`${x+2*y} cm`,`${q[0]}${q[2]} ứng với ${p[0]}${p[2]}, không phải với ${p[1]}${p[2]}.`]]);
  if(!w)return null;
  return mk(`Cho Δ${p.join('')} = Δ${q.join('')}, biết ${p[0]}${p[1]} = ${x} cm, ${q[1]}${q[2]} = ${y} cm, ${q[0]}${q[2]} = ${z} cm. Chu vi Δ${p.join('')} là:`,`${P} cm`,w,`${p[1]}${p[2]} = ${q[1]}${q[2]} = ${y} cm, ${p[0]}${p[2]} = ${q[0]}${q[2]} = ${z} cm. Chu vi Δ${p.join('')} = ${x} + ${y} + ${z} = ${P} (cm).`);
});}
function gBnCase(){
  const [p,q]=sel(PAIRS),[A,B,C]=p,[D,E,F]=q,k=sel(['ccc','cgc','gcg','none']);
  const cond={ccc:`${A}${B} = ${D}${E}, ${B}${C} = ${E}${F}, ${C}${A} = ${F}${D}`,cgc:`${B}${A} = ${E}${D}, ∠${A} = ∠${D}, ${A}${C} = ${D}${F}`,gcg:`∠${B} = ∠${E}, ${B}${C} = ${E}${F}, ∠${C} = ∠${F}`,none:`${A}${B} = ${D}${E}, ${B}${C} = ${E}${F}, ∠${A} = ∠${D}`}[k];
  const all={ccc:`Δ${p.join('')} = Δ${q.join('')} (c.c.c)`,cgc:`Δ${p.join('')} = Δ${q.join('')} (c.g.c)`,gcg:`Δ${p.join('')} = Δ${q.join('')} (g.c.g)`,none:'Chưa đủ dữ kiện để kết luận hai tam giác bằng nhau'};
  const why={ccc:'Trường hợp c.c.c cần ba cặp cạnh bằng nhau.',cgc:'Trường hợp c.g.c cần hai cạnh và góc xen giữa.',gcg:'Trường hợp g.c.g cần một cạnh và hai góc kề cạnh đó.',none:'Các dữ kiện đã đủ cho một trường hợp bằng nhau.'};
  const ex={ccc:'Ba cặp cạnh tương ứng bằng nhau: trường hợp c.c.c.',cgc:`∠${A} xen giữa hai cạnh ${A}${B}, ${A}${C}: trường hợp c.g.c.`,gcg:`Cạnh ${B}${C} và hai góc kề ∠${B}, ∠${C}: trường hợp g.c.g.`,none:`∠${A} không xen giữa hai cạnh ${A}${B} và ${B}${C} (góc xen giữa là ∠${B}), nên chưa dùng được trường hợp c.g.c.`}[k];
  return mk(`Hai tam giác ${p.join('')} và ${q.join('')} có ${cond}. Kết luận nào sau đây đúng?`,all[k],['ccc','cgc','gcg','none'].filter(z=>z!==k).map(z=>[all[z],why[z]]),ex);
}
function gBnME(){return retry(()=>{
  const a=ri(40,110),b=ri(25,130-a);if(180-a-b<20)return null;const ans=180-a;
  const w=pick3(g(ans),[[g(180-a-b),`${180-a-b}° chỉ là ∠ACB; còn phải cộng ∠BCE.`],[g(b),`${b}° là ∠BCE (= ∠ABC); còn phải cộng ∠ACB.`],[g(a),`${a}° là ∠BAC, không phải ∠ACE.`],[g(180-b),'Nhầm góc; ∠ACE = ∠ACB + ∠BCE.']]);
  if(!w)return null;
  return mk(`Cho ΔABC có ∠BAC = ${a}°, ∠ABC = ${b}°. Gọi M là trung điểm của BC; trên tia đối của tia MA lấy điểm E sao cho ME = MA (như hình). Số đo ∠ACE là:`,g(ans),w,`ΔMAB và ΔMEC có MA = ME, ∠AMB = ∠EMC (đối đỉnh), MB = MC nên ΔMAB = ΔMEC (c.g.c), suy ra ∠MCE = ∠MBA = ${b}°. ∠ACB = 180° − ${a}° − ${b}° = ${180-a-b}°. Vậy ∠ACE = ${180-a-b}° + ${b}° = ${ans}°.`,{fig:figME(),mix:[12]});
});}
function gBnKite(){return retry(()=>{
  const x=2*ri(20,60),b=ri(15,70);const c=180-x/2-b;if(c<15)return null;
  const w=pick3(g(c),[[g(180-x-b),'Nhầm: ∠CAB chỉ bằng một nửa ∠CAD.'],[g(x/2),`${x/2}° là ∠CAB, không phải ∠ACB.`],[g(b),`${b}° là ∠ABC.`],[g(180-x/2),'Chưa trừ ∠ABC.']]);
  if(!w)return null;
  return mk(`Cho hai tam giác ABC và ABD (C, D nằm khác phía đối với AB) có AC = AD, BC = BD (như hình). Biết ∠CAD = ${x}°, ∠ABC = ${b}°. Số đo ∠ACB là:`,g(c),w,`ΔABC = ΔABD (c.c.c: AC = AD, BC = BD, AB chung) nên ∠CAB = ∠DAB = ${x}° : 2 = ${x/2}°. Trong ΔABC: ∠ACB = 180° − ${x/2}° − ${b}° = ${c}°.`,{fig:figKiteAB(),mix:[12]});
});}
/* --- Tam giác vuông bằng nhau (Bài 15) --- */
const TV_CASES=['Hai cạnh góc vuông','Cạnh góc vuông – góc nhọn kề','Cạnh huyền – góc nhọn','Cạnh huyền – cạnh góc vuông'];
function gTvCase(){
  const [p,q]=sel(PAIRS),[A,B,C]=p,[D,E,F]=q,k=ri(0,3);
  const cond=[`${A}${C} = ${D}${F}, ${A}${B} = ${D}${E}`,`${A}${C} = ${D}${F}, ∠${C} = ∠${F}`,`${B}${C} = ${E}${F}, ∠${C} = ∠${F}`,`${B}${C} = ${E}${F}, ${A}${B} = ${D}${E}`][k];
  const why=['Cần hai cặp cạnh góc vuông.','Cần một cạnh góc vuông và góc nhọn kề cạnh ấy.','Cần cạnh huyền và một góc nhọn.','Cần cạnh huyền và một cạnh góc vuông.'];
  return mk(`Δ${p.join('')} vuông tại ${A} và Δ${q.join('')} vuông tại ${D} có ${cond}. Hai tam giác đó bằng nhau theo trường hợp nào?`,TV_CASES[k],[0,1,2,3].filter(i=>i!==k).map(i=>[TV_CASES[i],why[i]+' Ở đây là trường hợp '+TV_CASES[k].toLowerCase()+'.']),`${B}${C}, ${E}${F} là cạnh huyền; ${A}${B}, ${A}${C}, ${D}${E}, ${D}${F} là cạnh góc vuông. Dữ kiện ${cond} ứng với trường hợp ${TV_CASES[k].toLowerCase()}.`);
}
function gTvOz(){return retry(()=>{
  const o=2*ri(20,70);if(o===90)return null;const ans=180-o;
  const w=pick3(g(ans),[[g(90-o/2),`${90-o/2}° là ∠OMA; ∠AMB = 2 · ∠OMA.`],[g(o),'∠AMB không bằng ∠xOy.'],[g(o/2),`${o/2}° là ∠AOM.`],[g(360-o),'Tổng ba góc của tam giác là 180°, không phải 360°.']].filter(z=>okA(parseFloat(z[0]))));
  if(!w)return null;
  return mk(`Cho góc xOy = ${o}°, tia Oz là tia phân giác của góc xOy. Lấy điểm M trên Oz (M khác O), kẻ MA ⊥ Ox tại A, MB ⊥ Oy tại B. Số đo ∠AMB là:`,g(ans),w,`ΔOAM vuông tại A có ∠AOM = ${o/2}° nên ∠OMA = 90° − ${o/2}° = ${90-o/2}°. ΔOAM = ΔOBM (cạnh huyền – góc nhọn: OM chung, ∠AOM = ∠BOM) nên ∠OMB = ∠OMA = ${90-o/2}°. Vậy ∠AMB = 2 · ${90-o/2}° = ${ans}°.`,{fig:figBisPerp(),mix:[12]});
});}
function gTvBisDE(){
  const x=ri(3,12),y=ri(x+2,x+10);
  const w=pick3(`${y-x} cm`,[[`${x} cm`,`${x} cm là BE (= BA); EC = BC − BE.`],[`${y} cm`,'BC là cả cạnh; E nằm giữa B và C.'],[`${y+x} cm`,'Phải trừ chứ không cộng: EC = BC − BE.'],[`${nf((y-x)/2)} cm`,'Không chia đôi; EC = BC − BE.']]);
  return mk(`Cho ΔABC vuông tại A, tia phân giác của góc B cắt AC tại D. Kẻ DE ⊥ BC tại E (như hình). Biết AB = ${x} cm, BC = ${y} cm. Độ dài EC là:`,`${y-x} cm`,w,`ΔABD và ΔEBD vuông tại A và E có BD chung, ∠ABD = ∠EBD nên ΔABD = ΔEBD (cạnh huyền – góc nhọn). Suy ra BE = BA = ${x} cm, EC = ${y} − ${x} = ${y-x} (cm).`,{fig:figBisDE()});
}
/* --- Tam giác cân, tam giác đều (Bài 16) --- */
function gCnApex(){return retry(()=>{
  const l=sel(LS),z=ri(20,85);if(z===60||z===45)return null;const a=180-2*z;
  const w=pick3(g(a),[[g(180-z),'Phải trừ cả hai góc ở đáy: 180° − 2 · '+z+'°.'],[g(z),'Góc ở đỉnh không bằng góc ở đáy (trừ tam giác đều).'],[g(90-z),'Nhầm công thức; góc ở đỉnh = 180° − 2 · góc ở đáy.'],[g(2*z),`${2*z}° là tổng hai góc ở đáy, chưa trừ khỏi 180°.`]].filter(q=>okA(parseFloat(q[0]))));
  if(!w)return null;
  return mk(`Cho Δ${l.join('')} cân tại ${l[0]} có ∠${l[1]} = ${z}°. Số đo ∠${l[0]} là:`,g(a),w,`∠${l[2]} = ∠${l[1]} = ${z}° (hai góc ở đáy). ∠${l[0]} = 180° − 2 · ${z}° = ${a}°.`,{mix:[12]});
});}
function gCnPer(){return retry(()=>{
  const x=ri(4,20),y=ri(2,2*x-1);if(y===x)return null;const P=2*x+y;
  const w=pick3(`${x} cm`,[[`${nf((P-y)/2+y)} cm`,'Nhầm cách tính; hai cạnh bên bằng nhau, mỗi cạnh = (chu vi − cạnh đáy) : 2.'],[`${P-y} cm`,'Quên chia 2: '+(P-y)+' cm là tổng hai cạnh bên.'],[`${nf(P/3)} cm`,'Tam giác cân không chắc có ba cạnh bằng nhau.'],[`${y} cm`,`${y} cm là cạnh đáy BC.`]].filter(z=>z[0]!==`${x} cm`));
  if(!w)return null;
  return mk(`Cho ΔABC cân tại A có chu vi ${P} cm và BC = ${y} cm. Độ dài cạnh AB là:`,`${x} cm`,w,`AB = AC nên 2 · AB = ${P} − ${y} = ${P-y} (cm), AB = ${x} cm.`);
});}
function gCnBD(){return retry(()=>{
  const a=2*ri(10,29),C=(180-a)/2,ans=C-a;if(ans<=0)return null;
  const w=pick3(g(ans),[[g(a),`${a}° là ∠DBC (bằng ∠A); ∠ABD = ∠ABC − ∠DBC.`],[g(C),`${C}° là ∠ABC, chưa trừ ∠DBC.`],[g(180-2*C),'Đó là ∠DBC.'],[g(C-a/2),'Nhầm: ∠DBC = 180° − 2 · ∠C, bằng ∠A chứ không bằng ∠A : 2.'],[g(90-a),'Nhầm cách tính.']]);
  if(!w)return null;
  return mk(`Cho ΔABC cân tại A có ∠A = ${a}°. Trên cạnh AC lấy điểm D sao cho BD = BC (như hình). Số đo ∠ABD là:`,g(ans),w,`∠ABC = ∠C = (180° − ${a}°) : 2 = ${C}°. ΔBDC cân tại B nên ∠BDC = ∠C = ${C}°, ∠DBC = 180° − 2 · ${C}° = ${a}°. Vậy ∠ABD = ${C}° − ${a}° = ${ans}°.`,{fig:fb(figBD()),mix:[12]});
});}
function gCnIsoDE(){return retry(()=>{
  const a=2*ri(15,60),z=(180-a)/2;if(a===90)return null;const t=ri(92,Math.floor(178-z));
  // D nằm giữa B và trung điểm của BC nên 90° < ∠ADB < 180° − ∠B; ∠ADE = 180° − t; ΔADE cân tại A ⇒ ∠DAE = 2t − 180°
  const r=2*t-180;if(r<=0||r>=a)return null;
  const w=pick3(g(r),[[g(180-t),`${180-t}° là ∠ADE; ∠DAE = 180° − 2 · ∠ADE.`],[g(a),`${a}° là cả góc BAC.`],[g(t-z),'Nhầm cách tính.'],[g(a-r),'Đó là ∠BAD + ∠EAC.']].filter(q=>okA(parseFloat(q[0]))));
  if(!w)return null;
  return mk(`Cho ΔABC cân tại A có ∠A = ${a}°. Trên cạnh BC lấy hai điểm D, E sao cho BD = CE (D nằm giữa B và E). Biết ∠ADB = ${t}°. Số đo ∠DAE là:`,g(r),w,`ΔABD = ΔACE (c.g.c: AB = AC, ∠B = ∠C, BD = CE) nên AD = AE, ΔADE cân tại A. ∠ADE = 180° − ${t}° = ${180-t}° (kề bù). ∠DAE = 180° − 2 · ${180-t}° = ${r}°.`,{fig:figIsoDE(a),mix:[12,14]});
});}
/* --- Đường trung trực (Bài 16) --- */
function gTtHalf(){
  const [P,Q]=sel([['A','B'],['M','N'],['C','D'],['E','F']]),x=ri(2,15),O=P==='M'?'K':'O';
  return mk(`Đường trung trực của đoạn thẳng ${P}${Q} cắt ${P}${Q} tại ${O}. Biết ${P}${Q} = ${2*x} cm. Độ dài ${O}${P} là:`,`${x} cm`,[[`${2*x} cm`,`${2*x} cm là cả đoạn ${P}${Q}.`],[`${4*x} cm`,'Ngược: '+O+' là trung điểm nên '+O+P+' bằng một nửa '+P+Q+'.'],[`${x+1} cm`,`${O} là trung điểm của ${P}${Q}: ${O}${P} = ${2*x} : 2.`]],`Đường trung trực đi qua trung điểm của đoạn thẳng nên ${O} là trung điểm của ${P}${Q}: ${O}${P} = ${2*x} : 2 = ${x} (cm).`);
}
function gTtPer(){return retry(()=>{
  const p=ri(3,15),q=ri(2,2*p-1);if(q===p)return null;const P=2*p+q;
  const w=pick3(`${P} cm`,[[`${p+q} cm`,`Thiếu cạnh MB = MA = ${p} cm.`],[`${2*p} cm`,`Thiếu cạnh AB = ${q} cm.`],[`${p+2*q} cm`,'MB = MA chứ không bằng AB.']]);
  if(!w)return null;
  return mk(`Điểm M nằm trên đường trung trực của đoạn thẳng AB, MA = ${p} cm, AB = ${q} cm. Chu vi ΔMAB là:`,`${P} cm`,w,`M nằm trên đường trung trực của AB nên MB = MA = ${p} cm. Chu vi ΔMAB = ${p} + ${p} + ${q} = ${P} (cm).`);
});}
function gTtABD(){return retry(()=>{
  const c=ri(20,45),a=ri(30,110);const ans=180-a-2*c;if(ans<8)return null;const b=180-a-c;
  const w=pick3(g(ans),[[g(c),`${c}° là ∠DBC (= ∠C); ∠ABD = ∠ABC − ∠DBC.`],[g(b),`${b}° là cả góc ABC.`],[g(180-a-c-c/2),'Nhầm: ∠DBC = ∠C chứ không bằng ∠C : 2.'],[g(a-c),'Nhầm cách tính.']].filter(q=>parseFloat(q[0])>0));
  if(!w)return null;
  return mk(`Cho ΔABC có ∠A = ${a}°, ∠C = ${c}°. Đường trung trực của BC cắt cạnh AC tại D (như hình). Số đo ∠ABD là:`,g(ans),w,`D nằm trên đường trung trực của BC nên DB = DC, ΔDBC cân tại D: ∠DBC = ∠C = ${c}°. ∠ABC = 180° − ${a}° − ${c}° = ${b}°. ∠ABD = ${b}° − ${c}° = ${ans}°.`,{fig:fb(figTrung(b,c)),mix:[12]});
});}
function gTtABDper(){return retry(()=>{
  const p=ri(4,15),q=ri(p+2,p+15);
  const w=pick3(`${p+q} cm`,[[`${nf(p+q/2)} cm`,'D không phải trung điểm của AC; dùng DB = DC.'],[`${2*p+q} cm`,'Nhầm: AD + DB = AD + DC = AC.'],[`${q} cm`,`Thiếu cạnh AB = ${p} cm.`],[`${2*q} cm`,'Nhầm: chu vi ΔABD = AB + AC.']]);if(!w)return null;
  return mk(`Cho ΔABC có AB = ${p} cm, AC = ${q} cm. Đường trung trực của BC cắt cạnh AC tại D (như hình). Chu vi ΔABD là:`,`${p+q} cm`,w,`D nằm trên đường trung trực của BC nên DB = DC. Chu vi ΔABD = AB + AD + DB = AB + AD + DC = AB + AC = ${p} + ${q} = ${p+q} (cm).`,{fig:fb(figTrung())});
});}

[['c_tg2','tg','NB',gTgSum],['c_tg3','tg','NB',gTgKind],['c_tg4','tg','TH',gTgDiff],['c_tg5','tg','VD',gTgBis,{fig:figBisI()}],['c_tg6','tg','VD',gTgHAD,{fig:figHAD(),mix:[12]}],
 ['c_bn2','bn','NB',gBnSide],['c_bn3','bn','TH',gBnCase],['c_bn4','bn','TH',gBnPer],['c_bn5','bn','VD',gBnME,{fig:figME(),mix:[12]}],['c_bn6','bn','VD',gBnKite,{fig:figKiteAB(),mix:[12]}],
 ['c_tv3','tv','NB',gTvCase],['c_tv4','tv','TH',gTvOz,{fig:figBisPerp(),mix:[12]}],['c_tv5','tv','VD',gTvBisDE,{fig:figBisDE()}],
 ['c_cn4','cn','NB',gCnApex,{mix:[12]}],['c_cn5','cn','TH',gCnPer],['c_cn6','cn','VD',gCnBD,{fig:fb(figBD()),mix:[12]}],
 ['c_tt2','tt','NB',gTtHalf],['c_tt3','tt','TH',gTtPer],['c_tt4','tt','VD',gTtABD,{fig:fb(figTrung()),mix:[12]}],['c_tt5','tt','VD',gTtABDper,{fig:fb(figTrung())}]
].forEach(([id,t,l,f,x])=>addMC(id,t,l,f,x));
addMC('c_tg7','tg','TH',gTgExt,{fig:figExtC(60,50)});
addMC('c_bn7','bn','NB',gBnAng,{mix:[12]});
addMC('c_tv6','tv','TH',gTgRt);
addMC('c_cn7','cn','VD',gCnIsoDE,{fig:figIsoDE(),mix:[12,14]});

/* ============ Câu đúng sai ============ */
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
/* ý đúng/sai: v quyết định dùng câu đúng tt hay câu sai ff */
const IT=(v,tt,ff,tp,lv,et,ef)=>({t:v?tt:ff,v,topic:tp,level:lv,exp:v?et:ef});
function tfLoop(f){for(let n=0;n<200;n++){const u=[0,1,2,3].map(()=>RNG()<.5),r=f(u);if(r&&tfOK(r.items))return r;}throw new Error('TF');}
const TF=[
 {id:'t_tg',type:'tf',topic:'tg',level:'NB',stem:'Xét các phát biểu về tổng các góc trong một tam giác.',items:[
   {t:'Tổng ba góc của một tam giác bằng 180°.',v:true,topic:'tg',level:'NB',exp:'Đúng: định lí tổng ba góc của tam giác.'},
   {t:'Tam giác tù có hai góc tù.',v:false,topic:'tg',level:'NB',exp:'Sai: tam giác tù chỉ có một góc tù; hai góc tù đã có tổng lớn hơn 180°.'},
   {t:'Trong tam giác vuông, hai góc nhọn phụ nhau.',v:true,topic:'tg',level:'NB',exp:'Đúng: hai góc nhọn có tổng 180° − 90° = 90°.'},
   {t:'Tam giác có ba góc bằng nhau thì mỗi góc bằng 90°.',v:false,topic:'tg',level:'NB',exp:'Sai: mỗi góc bằng 180° : 3 = 60°.'}]},
 {id:'t_bn',type:'tf',topic:'bn',level:'NB',stem:'Cho ΔABC = ΔHIK. Xét các phát biểu sau.',items:[
   {t:'AB = HI.',v:true,topic:'bn',level:'NB',exp:'Đúng: A ↔ H, B ↔ I nên AB = HI.'},
   {t:'∠C = ∠K.',v:true,topic:'bn',level:'NB',exp:'Đúng: C và K là hai đỉnh tương ứng.'},
   {t:'BC = HK.',v:false,topic:'bn',level:'NB',exp:'Sai: BC tương ứng với IK; HK tương ứng với AC.'},
   {t:'∠B = ∠H.',v:false,topic:'bn',level:'NB',exp:'Sai: ∠B tương ứng với ∠I.'}]},
 {id:'t_tv',type:'tf',topic:'tv',level:'NB',stem:'Xét các phát biểu về hai tam giác vuông.',items:[
   {t:'Hai tam giác vuông có cạnh huyền và một cạnh góc vuông tương ứng bằng nhau thì bằng nhau.',v:true,topic:'tv',level:'NB',exp:'Đúng: trường hợp cạnh huyền – cạnh góc vuông.'},
   {t:'Hai tam giác vuông có một cạnh góc vuông và góc nhọn kề cạnh ấy tương ứng bằng nhau thì bằng nhau.',v:true,topic:'tv',level:'NB',exp:'Đúng: trường hợp cạnh góc vuông – góc nhọn kề.'},
   {t:'Cạnh huyền là cạnh kề với góc vuông.',v:false,topic:'tv',level:'NB',exp:'Sai: cạnh huyền là cạnh đối diện với góc vuông.'},
   {t:'Hai tam giác vuông có hai cặp góc nhọn tương ứng bằng nhau thì bằng nhau.',v:false,topic:'tv',level:'NB',exp:'Sai: cần ít nhất một cặp cạnh tương ứng bằng nhau.'}]},
 {id:'t_cn',type:'tf',topic:'cn',level:'NB',stem:'Xét các phát biểu về tam giác cân và tam giác đều.',items:[
   {t:'Trong tam giác cân, hai góc ở đáy bằng nhau.',v:true,topic:'cn',level:'NB',exp:'Đúng: tính chất của tam giác cân.'},
   {t:'Tam giác đều có mỗi góc bằng 60°.',v:true,topic:'cn',level:'NB',exp:'Đúng: ba góc bằng nhau và có tổng 180°.'},
   {t:'Tam giác vuông cân có hai góc nhọn bằng 30° và 60°.',v:false,topic:'cn',level:'NB',exp:'Sai: hai góc nhọn của tam giác vuông cân cùng bằng 45°.'},
   {t:'Tam giác có hai cạnh bằng nhau là tam giác đều.',v:false,topic:'cn',level:'NB',exp:'Sai: đó là tam giác cân; tam giác đều cần ba cạnh bằng nhau.'}]},
 {id:'t_tt',type:'tf',topic:'tt',level:'NB',stem:'Cho đoạn thẳng MN và đường trung trực d của nó, d cắt MN tại I. Xét các phát biểu sau.',items:[
   {t:'I là trung điểm của MN.',v:true,topic:'tt',level:'NB',exp:'Đúng: đường trung trực đi qua trung điểm của đoạn thẳng.'},
   {t:'d vuông góc với MN tại I.',v:true,topic:'tt',level:'NB',exp:'Đúng theo định nghĩa đường trung trực.'},
   {t:'Mọi điểm nằm trên d đều cách đều M và N.',v:true,topic:'tt',level:'NB',exp:'Đúng: tính chất của đường trung trực.'},
   {t:'Điểm P có PM = PN thì P không nằm trên d.',v:false,topic:'tt',level:'NB',exp:'Sai: điểm cách đều hai mút của đoạn thẳng thì nằm trên đường trung trực.'}]}
];
const addTF=(id,topic,level,gen,extra)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},extra||{}));
function tfTgG(){let a,b,c;do{a=ri(30,100);b=ri(20,130);c=180-a-b;}while(c<15||c===90||a===90||b===90||a===b||b===c||a===c);
  const kind=Math.max(a,b,c)>90?'tù':'nhọn',other=kind==='tù'?'nhọn':'tù';
  return tfLoop(u=>({stem:`Cho ΔABC có ∠A = ${a}°, ∠B = ${b}°. Trên tia đối của tia CB lấy điểm D.`,fig:figExtC(b,c),items:[
    IT(u[0],`∠ACB = ${c}°.`,`∠ACB = ${180-a}°.`,'tg','NB',`∠ACB = 180° − ${a}° − ${b}° = ${c}°.`,`Phải trừ cả ∠A và ∠B: ∠ACB = ${c}°.`),
    IT(u[1],`ΔABC là tam giác ${kind}.`,`ΔABC là tam giác ${other}.`,'tg','TH',`Ba góc ${a}°, ${b}°, ${c}°: ${kind==='tù'?'có một góc tù':'cả ba góc đều nhọn'}.`,`Ba góc ${a}°, ${b}°, ${c}°: ${kind==='tù'?'có một góc tù':'cả ba góc đều nhọn'}, nên là tam giác ${kind}.`),
    IT(u[2],`∠ACD = ${a+b}°.`,`∠ACD = ${c}°.`,'tg','TH',`∠ACD kề bù với ∠ACB: 180° − ${c}° = ${a+b}°.`,`${c}° là ∠ACB; ∠ACD = 180° − ${c}° = ${a+b}°.`),
    IT(u[3],`∠ACD > ∠A.`,`∠ACD < ∠A.`,'tg','TH',`∠ACD = ${a+b}° = ∠A + ∠B nên lớn hơn ∠A.`,`∠ACD = ${a+b}° = ∠A + ∠B, lớn hơn ∠A = ${a}°.`)]}));}
function tfBnG(){const [p,q]=sel(PAIRS),[A,B,C]=p,[D,E,F]=q,x=ri(3,12);let a,b;do{a=ri(35,85);b=ri(30,100);}while(180-a-b<20||a===b||180-a-b===a||180-a-b===b);const c=180-a-b;
  return tfLoop(u=>({stem:`Cho Δ${A}${B}${C} = Δ${D}${E}${F}, ${A}${B} = ${x} cm, ∠${A} = ${a}°, ∠${E} = ${b}°.`,items:[
    IT(u[0],`${D}${E} = ${x} cm.`,`${E}${F} = ${x} cm.`,'bn','NB',`${A}${B} tương ứng với ${D}${E}.`,`${A}${B} tương ứng với ${D}${E}, không phải ${E}${F}.`),
    IT(u[1],`∠${B} = ${b}°.`,`∠${C} = ${b}°.`,'bn','TH',`∠${B} tương ứng với ∠${E}.`,`∠${E} tương ứng với ∠${B}, không phải ∠${C}.`),
    IT(u[2],`∠${F} = ${c}°.`,`∠${F} = ${a}°.`,'bn','TH',`∠${D} = ∠${A} = ${a}°, nên ∠${F} = 180° − ${a}° − ${b}° = ${c}°.`,`${a}° là ∠${D}; ∠${F} = 180° − ${a}° − ${b}° = ${c}°.`),
    IT(u[3],`${C}${A} = ${F}${D}.`,`${C}${A} = ${E}${F}.`,'bn','NB',`${C} ↔ ${F}, ${A} ↔ ${D}.`,`${C}${A} tương ứng với ${F}${D}.`)]}));}
function tfCnG(){const l=sel(LS),[A,B,C]=l;let a;do{a=2*ri(15,75);}while(a===60||a===90);const z=(180-a)/2;
  return tfLoop(u=>({stem:`Cho Δ${A}${B}${C} cân tại ${A} có ∠${A} = ${a}°.`,items:[
    IT(u[0],`${A}${B} = ${A}${C}.`,`${A}${B} = ${B}${C}.`,'cn','NB',`Tam giác cân tại ${A} có hai cạnh bên ${A}${B} = ${A}${C}.`,`Hai cạnh bên là ${A}${B} và ${A}${C}.`),
    IT(u[1],`∠${B} = ${z}°.`,`∠${B} = ${a}°.`,'cn','TH',`∠${B} = (180° − ${a}°) : 2 = ${z}°.`,`Góc ở đáy ∠${B} = (180° − ${a}°) : 2 = ${z}°.`),
    IT(u[2],`Δ${A}${B}${C} là tam giác ${a>90?'tù':'nhọn'}.`,`Δ${A}${B}${C} là tam giác ${a>90?'nhọn':'tù'}.`,'tg','TH',`Ba góc ${a}°, ${z}°, ${z}°.`,`Ba góc ${a}°, ${z}°, ${z}°: ${a>90?'có góc tù':'cả ba góc nhọn'}.`),
    IT(u[3],`Góc kề bù với ∠${C} bằng ${180-z}°.`,`Góc kề bù với ∠${C} bằng ${z}°.`,'tg','TH',`180° − ${z}° = ${180-z}°.`,`Góc kề bù với ∠${C} bằng 180° − ${z}° = ${180-z}°.`)]}));}
function tfTvG(){let o;do{o=2*ri(20,60);}while(o===90);const m=ri(3,12);
  return tfLoop(u=>({stem:`Cho góc xOy = ${o}° và tia phân giác Oz của nó. Lấy M trên Oz, kẻ MA ⊥ Ox tại A, MB ⊥ Oy tại B. Biết MA = ${m} cm.`,fig:figBisPerp(),items:[
    IT(u[0],'ΔOAM = ΔOBM (cạnh huyền – góc nhọn).','ΔOAM = ΔOBM (hai cạnh góc vuông).','tv','TH','OM chung là cạnh huyền, ∠AOM = ∠BOM.','Chưa biết OA = OB hay MA = MB; dùng cạnh huyền OM chung và ∠AOM = ∠BOM.'),
    IT(u[1],`MB = ${m} cm.`,`MB = ${2*m} cm.`,'tv','TH',`MB = MA (hai cạnh tương ứng).`,`MB = MA = ${m} cm.`),
    IT(u[2],'OB = OA.','OB = MA.','tv','TH','OB = OA (hai cạnh tương ứng).','OB tương ứng với OA, không phải với MA (OB = MA chỉ khi góc xOy vuông).'),
    IT(u[3],`∠OMA = ${90-o/2}°.`,`∠OMA = ${o/2}°.`,'tg','TH',`ΔOAM vuông tại A: ∠OMA = 90° − ${o/2}° = ${90-o/2}°.`,`${o/2}° là ∠AOM; ∠OMA = 90° − ${o/2}° = ${90-o/2}°.`)]}));}
function tfBisI(){let a,b,c;do{a=2*ri(20,50);b=2*ri(15,60);c=180-a-b;}while(c<30||c%2||b===c||a===60);
  return tfLoop(u=>({stem:`Cho ΔABC có ∠A = ${a}°, ∠B = ${b}°. Tia phân giác của góc B cắt AC tại D, tia phân giác của góc C cắt AB tại E; BD cắt CE tại I (như hình).`,fig:figBisI(b,c),items:[
    IT(u[0],`∠IBC = ${b/2}°.`,`∠IBC = ${b}°.`,'tg','TH',`BD là tia phân giác: ∠IBC = ${b}° : 2 = ${b/2}°.`,`∠IBC chỉ bằng một nửa ∠B: ${b/2}°.`),
    IT(u[1],`∠ICB = ${c/2}°.`,`∠ICB = ${c}°.`,'tg','TH',`∠ACB = 180° − ${a}° − ${b}° = ${c}°, ∠ICB = ${c/2}°.`,`∠ACB = ${c}°, ∠ICB = ${c}° : 2 = ${c/2}°.`),
    IT(u[2],`∠BIC = ${90+a/2}°.`,`∠BIC = ${180-a}°.`,'tg','VD',`∠BIC = 180° − ${b/2}° − ${c/2}° = ${90+a/2}°.`,`${180-a}° là ∠B + ∠C. ∠BIC = 180° − ${b/2}° − ${c/2}° = ${90+a/2}°.`),
    IT(u[3],`∠BIE = ${90-a/2}°.`,`∠BIE = ${90+a/2}°.`,'tg','VD',`∠BIE kề bù với ∠BIC: 180° − ${90+a/2}° = ${90-a/2}°.`,`∠BIE kề bù với ∠BIC nên bằng 180° − ${90+a/2}° = ${90-a/2}°.`)]}));}
function tfME(){const x=ri(3,12),y=ri(3,12);let b;do{b=ri(30,80);}while(false);
  return tfLoop(u=>({stem:`Cho ΔABC có AB = ${x} cm, ∠ABC = ${b}°. Gọi M là trung điểm của BC, trên tia đối của tia MA lấy điểm E sao cho ME = MA (như hình).`,fig:figME(),items:[
    IT(u[0],'ΔMAB = ΔMEC (c.g.c).','ΔMAB = ΔMCE (c.g.c).','bn','TH','MA = ME, ∠AMB = ∠EMC (đối đỉnh), MB = MC.','Sai thứ tự đỉnh: A ↔ E, B ↔ C. Phải viết ΔMAB = ΔMEC.'),
    IT(u[1],`CE = ${x} cm.`,`CE = ${2*x} cm.`,'bn','TH',`CE = AB = ${x} cm (hai cạnh tương ứng).`,`CE = AB = ${x} cm, không gấp đôi.`),
    IT(u[2],`∠MCE = ${b}°.`,`∠MCE = ${180-b}°.`,'bn','VD',`∠MCE = ∠MBA = ${b}° (hai góc tương ứng).`,`∠MCE = ∠MBA = ${b}°; hai góc tương ứng bằng nhau, không bù nhau.`),
    IT(u[3],'AB song song với CE.','AB vuông góc với CE.','bn','VD','∠MBA = ∠MCE là hai góc so le trong nên AB ∥ CE.','∠MBA = ∠MCE ở vị trí so le trong nên AB ∥ CE, không vuông góc.')]}));}
function tfRt60(){const x=ri(2,12);
  return tfLoop(u=>({stem:`Một cầu trượt có máng trượt BC và thang AB thẳng đứng; ΔABC vuông tại A, máng trượt tạo với thang góc ∠ABC = 60°, thang dài AB = ${x} m. Gọi M là trung điểm của BC (như hình).`,fig:figRt60M(),items:[
    IT(u[0],'∠ACB = 30°.','∠ACB = 60°.','tg','NB','Hai góc nhọn phụ nhau: 90° − 60° = 30°.','∠ACB = 90° − 60° = 30°.'),
    IT(u[1],`Máng trượt dài BC = ${2*x} m.`,`Máng trượt dài BC = ${x} m.`,'cn','VD',`Lấy D trên tia đối của tia AB với AD = AB thì ΔCAB = ΔCAD (hai cạnh góc vuông), ΔBCD cân có ∠B = 60° nên đều: BC = BD = 2 · AB = ${2*x} m.`,`BC = 2 · AB = ${2*x} m (như SGK 4.32).`),
    IT(u[2],`BM = ${x} m.`,`BM = ${2*x} m.`,'cn','VD',`BM = BC : 2 = ${x} m.`,`BM = BC : 2 = ${x} m.`),
    IT(u[3],'ΔABM là tam giác đều.','ΔABM là tam giác vuông tại A.','cn','VD',`BA = BM = ${x} m và ∠B = 60° nên ΔABM cân có góc 60°, là tam giác đều.`,`BA = BM và ∠B = 60° nên ΔABM là tam giác đều; góc vuông là ∠BAC chứ không phải ∠BAM.`)]}));}
function tfIsoDE(){let a;do{a=2*ri(15,60);}while(a===60||a===90);const z=(180-a)/2;
  return tfLoop(u=>({stem:`Cho ΔABC cân tại A có ∠A = ${a}°. Trên cạnh BC lấy hai điểm D, E sao cho BD = CE (D nằm giữa B và E) (như hình).`,fig:figIsoDE(a),items:[
    IT(u[0],'ΔABD = ΔACE (c.g.c).','ΔABD = ΔACE (c.c.c).','bn','TH','AB = AC, ∠B = ∠C, BD = CE.','Chưa biết AD = AE; dùng AB = AC, ∠B = ∠C (góc xen giữa), BD = CE.'),
    IT(u[1],'ΔADE cân tại A.','ΔADE cân tại D.','cn','TH','AD = AE (hai cạnh tương ứng).','AD = AE nên ΔADE cân tại A.'),
    IT(u[2],'∠BAD = ∠CAE.','∠BAD = ∠DAE.','bn','VD','Hai góc tương ứng của ΔABD = ΔACE.','∠BAD = ∠CAE (góc tương ứng); ∠DAE nói chung khác.'),
    IT(u[3],`∠ABC = ${z}°.`,`∠ABC = ${a}°.`,'cn','NB',`∠ABC = (180° − ${a}°) : 2 = ${z}°.`,`Góc ở đáy ∠ABC = (180° − ${a}°) : 2 = ${z}°.`)]}));}
function tfTtReal(){const h=10*ri(20,60);let p;do{p=ri(150,600);}while(p===h);
  return tfLoop(u=>({stem:`Hai nhà văn hoá thôn A và B cách nhau ${2*h} m. Xã muốn đặt một trạm phát thanh M cách đều A và B, và M cách A ${p+h} m.`,items:[
    IT(u[0],'M nằm trên đường trung trực của đoạn thẳng AB.','M nằm trên đường thẳng AB.','tt','TH','Điểm cách đều A và B thì nằm trên đường trung trực của AB.',`Nếu M ở trên đường thẳng AB và cách đều A, B thì M là trung điểm, khi đó MA = ${h} m, trái với MA = ${p+h} m.`),
    IT(u[1],`M cách B ${p+h} m.`,`M cách B ${p} m.`,'tt','NB','MB = MA.',`M cách đều A và B nên MB = MA = ${p+h} m.`),
    IT(u[2],`Gọi O là trung điểm của AB thì MO ⊥ AB.`,`Gọi O là trung điểm của AB thì MO song song với AB.`,'tt','VD','MA = MB, OA = OB nên MO là đường trung trực của AB.','M và O cùng cách đều A, B nên MO là đường trung trực của AB, vuông góc với AB.'),
    IT(u[3],'∠MAB = ∠MBA.','ΔMAB là tam giác đều.','cn','VD','MA = MB nên ΔMAB cân tại M, hai góc ở đáy bằng nhau.',`MA = MB = ${p+h} m nhưng AB = ${2*h} m, nên ΔMAB chỉ là tam giác cân tại M, không đều.`)]}));}
[['t_tgG','tg','TH',tfTgG,{fig:figExtC(60,50)}],['t_bnG','bn','TH',tfBnG,{mix:[12]}],['t_cnG','cn','TH',tfCnG,{mix:[12]}],['t_tvG','tv','TH',tfTvG,{fig:figBisPerp(),mix:[12]}],
 ['t_bis','tg','VD',tfBisI,{fig:figBisI()}],['t_me','bn','VD',tfME,{fig:figME(),mix:[14]}],['t_rt60','cn','VD',tfRt60,{fig:figRt60M(),mix:[12,15]}],['t_isode','cn','VD',tfIsoDE,{fig:figIsoDE(),mix:[14]}],['t_ttreal','tt','VD',tfTtReal,{mix:[16]}]
].forEach(([id,t,l,f,x])=>addTF(id,t,l,f,x));

/* ============ Câu trả lời ngắn ============ */
const SA=[];
const addSA=(id,topic,level,unit,gen,extra)=>SA.push(Object.assign({id,type:'sa',topic,level,unit,gen},extra||{}));
const sq=(stem,ans,exp,extra)=>Object.assign({stem,ans:[ans],exp},extra||{});
function saTg1(){const l=sel(LS);let a,b,c;do{a=ri(25,110);b=ri(20,130);c=180-a-b;}while(c<15);
  return sq(`Cho Δ${l.join('')} có ∠${l[0]} = ${a}°, ∠${l[1]} = ${b}°. Tính số đo ∠${l[2]} (độ).`,c,`∠${l[2]} = 180° − ${a}° − ${b}° = ${c}°.`);}
function saTg2(){const l=sel(LS),b=ri(15,75);
  return sq(`Cho Δ${l.join('')} vuông tại ${l[1]} có ∠${l[0]} = ${b}°. Tính số đo ∠${l[2]} (độ).`,90-b,`Hai góc nhọn của tam giác vuông phụ nhau: ∠${l[2]} = 90° − ${b}° = ${90-b}°.`);}
function saTg3(){let a,e;do{a=ri(30,90);e=ri(a+20,170);}while(180-e<15||e-a<15);
  return sq(`Cho ΔABC có ∠A = ${a}°. Trên tia đối của tia CB lấy điểm D, biết ∠ACD = ${e}° (như hình). Tính số đo ∠ABC (độ).`,e-a,`∠ACB = 180° − ${e}° = ${180-e}° (kề bù). ∠ABC = 180° − ${a}° − ${180-e}° = ${e-a}°.`,{fig:figExtC(e-a,180-e)});}
function saTg4(){let b,c;do{b=ri(30,90);c=ri(25,90);}while(180-b-c<20||(180-b-c)%2);const a=180-b-c;
  return sq(`Cho ΔABC có ∠B = ${b}°, ∠C = ${c}°. Tia phân giác của góc A cắt BC tại D. Tính số đo ∠ADC (độ).`,180-c-a/2,`∠BAC = 180° − ${b}° − ${c}° = ${a}°, ∠DAC = ${a/2}°. Trong ΔADC: ∠ADC = 180° − ${c}° − ${a/2}° = ${180-c-a/2}°.`);}
function saBn1(){const [p,q]=sel(PAIRS),x=ri(3,15),k=ri(0,2),S=[[q[0]+q[1],p[0]+p[1]],[q[1]+q[2],p[1]+p[2]],[q[0]+q[2],p[0]+p[2]]][k];
  return sq(`Cho Δ${p.join('')} = Δ${q.join('')}, biết ${S[0]} = ${x} cm. Tính độ dài ${S[1]} (cm).`,x,`${S[1]} là cạnh tương ứng với ${S[0]} nên ${S[1]} = ${x} cm.`);}
function saBn2(){const [p,q]=sel(PAIRS);let x,y,z;do{x=ri(3,12);y=ri(3,12);z=ri(3,12);}while(z>=x+y||x>=y+z||y>=x+z);
  return sq(`Cho Δ${p.join('')} = Δ${q.join('')}. Biết ${p[0]}${p[1]} = ${x} cm, ${q[1]}${q[2]} = ${y} cm, ${p[0]}${p[2]} = ${z} cm. Tính chu vi Δ${q.join('')} (cm).`,x+y+z,`${q[0]}${q[1]} = ${p[0]}${p[1]} = ${x} cm, ${q[0]}${q[2]} = ${p[0]}${p[2]} = ${z} cm. Chu vi Δ${q.join('')} = ${x} + ${y} + ${z} = ${x+y+z} (cm).`);}
function saBn3(){let a,b;do{a=ri(40,110);b=ri(25,120);}while(180-a-b<20);
  return sq(`Cho ΔABC có ∠BAC = ${a}°, ∠ABC = ${b}°. Gọi M là trung điểm của BC; trên tia đối của tia MA lấy điểm E sao cho ME = MA (như hình). Tính số đo ∠ACE (độ).`,180-a,`ΔMAB = ΔMEC (c.g.c) nên ∠MCE = ∠MBA = ${b}°. ∠ACB = 180° − ${a}° − ${b}° = ${180-a-b}°. ∠ACE = ${180-a-b}° + ${b}° = ${180-a}°.`,{fig:figME()});}
function saBn4(){let o,a;do{o=ri(40,80);a=ri(20,55);}while(180-o-2*a<15);
  return sq(`Cho góc xOy = ${o}°. Trên tia Ox lấy hai điểm M, A; trên tia Oy lấy hai điểm N, B sao cho OM = ON, OA = OB, OM < OA. AN cắt BM tại I (như hình). Biết ∠OAN = ${a}°. Tính số đo ∠OMB (độ).`,180-o-a,`ΔOAN = ΔOBM (c.g.c: OA = OB, ∠O chung, ON = OM) nên ∠OBM = ∠OAN = ${a}°. Trong ΔOMB: ∠OMB = 180° − ${o}° − ${a}° = ${180-o-a}°.`,{fig:figXOY(o)});}
function saTv1(){const m=ri(2,15);
  return sq(`Cho ΔABC cân tại A, kẻ AH ⊥ BC tại H. Biết BC = ${2*m} cm. Tính độ dài HB (cm).`,m,`ΔAHB = ΔAHC (cạnh huyền AB = AC, cạnh góc vuông AH chung) nên HB = HC = ${2*m} : 2 = ${m} (cm).`);}
function saTv2(){const x=ri(2,15),y=ri(x+1,x+12);
  return sq(`Cho góc xOy và tia phân giác Oz của nó. Lấy M trên Oz, kẻ MA ⊥ Ox tại A, MB ⊥ Oy tại B. Biết OA = ${y} cm, MA = ${x} cm. Tính tổng OB + MB (cm).`,x+y,`ΔOAM = ΔOBM (cạnh huyền – góc nhọn: OM chung, ∠AOM = ∠BOM) nên OB = OA = ${y} cm, MB = MA = ${x} cm. OB + MB = ${x+y} (cm).`,{fig:figBisPerp()});}
function saTv3(){const x=ri(3,12),y=ri(x+2,x+10);
  return sq(`Cho ΔABC vuông tại A, tia phân giác của góc B cắt AC tại D, kẻ DE ⊥ BC tại E (như hình). Biết AB = ${x} cm, BC = ${y} cm. Tính độ dài EC (cm).`,y-x,`ΔABD = ΔEBD (cạnh huyền BD chung, ∠ABD = ∠EBD) nên BE = BA = ${x} cm. EC = ${y} − ${x} = ${y-x} (cm).`,{fig:figBisDE()});}
function saCn1(){const l=sel(LS),a=2*ri(10,80);
  return sq(`Cho Δ${l.join('')} cân tại ${l[0]} có ∠${l[0]} = ${a}°. Tính số đo ∠${l[1]} (độ).`,(180-a)/2,`∠${l[1]} = ∠${l[2]} = (180° − ${a}°) : 2 = ${(180-a)/2}°.`);}
function saCn2(){const x=ri(2,25);
  return sq(`Một tam giác đều có chu vi ${3*x} cm. Tính độ dài mỗi cạnh (cm).`,x,`Ba cạnh bằng nhau: ${3*x} : 3 = ${x} (cm).`);}
function saCn3(){let x,y;do{x=ri(4,20);y=ri(2,2*x-1);}while(y===x);
  return sq(`Cho ΔABC cân tại A có chu vi ${2*x+y} cm, AB = ${x} cm. Tính độ dài BC (cm).`,y,`AC = AB = ${x} cm. BC = ${2*x+y} − 2 · ${x} = ${y} (cm).`);}
function saCn4(){const a=4*ri(5,40),B=(180-a)/2;if(a===60)return saCn4();
  return sq(`Cho ΔABC cân tại A có ∠BAC = ${a}°. Trên tia đối của tia BC lấy điểm D sao cho BD = BA (như hình). Tính số đo ∠DAC (độ).`,a+B/2,`∠ABC = (180° − ${a}°) : 2 = ${B}°; ∠ABD = 180° − ${B}° = ${180-B}°. ΔABD cân tại B nên ∠BAD = (180° − ${180-B}°) : 2 = ${B/2}°. ∠DAC = ${B/2}° + ${a}° = ${a+B/2}°.`,{fig:fb(figExt(false,a))});}
function saTt1(){const [P,Q]=sel([['A','B'],['C','D'],['E','F'],['P','Q']]),x=ri(3,20);
  return sq(`Điểm M nằm trên đường trung trực của đoạn thẳng ${P}${Q}, M${P} = ${x} cm. Tính độ dài M${Q} (cm).`,x,`Điểm nằm trên đường trung trực thì cách đều hai mút: M${Q} = M${P} = ${x} cm.`);}
function saTt2(){const x=ri(20,75);
  return sq(`Điểm M nằm trên đường trung trực của đoạn thẳng AB (M không nằm trên AB), ∠MAB = ${x}°. Tính số đo ∠AMB (độ).`,180-2*x,`MA = MB nên ΔMAB cân tại M: ∠MBA = ∠MAB = ${x}°. ∠AMB = 180° − 2 · ${x}° = ${180-2*x}°.`);}
function saTt3(){const p=ri(6,15),b=ri(Math.ceil(p/2),p-1);
  return sq(`Cho ΔABC cân tại A có AB = AC = ${p} cm. Đường trung trực của AB cắt cạnh AC tại D (như hình). Biết chu vi ΔBDC bằng ${p+b} cm. Tính độ dài BC (cm).`,b,`D nằm trên đường trung trực của AB nên DB = DA. Chu vi ΔBDC = BD + DC + BC = AD + DC + BC = AC + BC. BC = ${p+b} − ${p} = ${b} (cm).`,{fig:figPbAB()});}
[['s_tg1','tg','NB','độ',saTg1],['s_tg2','tg','NB','độ',saTg2],['s_tg3','tg','TH','độ',saTg3,{fig:figExtC(60,50)}],['s_tg4','tg','VD','độ',saTg4],
 ['s_bn1','bn','NB','cm',saBn1],['s_bn2','bn','TH','cm',saBn2],['s_bn3','bn','VD','độ',saBn3,{fig:figME(),mix:[12]}],['s_bn4','bn','VD','độ',saBn4,{fig:figXOY(),mix:[12]}],
 ['s_tv1','tv','NB','cm',saTv1,{mix:[16]}],['s_tv2','tv','TH','cm',saTv2,{fig:figBisPerp()}],['s_tv3','tv','VD','cm',saTv3,{fig:figBisDE()}],
 ['s_cn1','cn','NB','độ',saCn1,{mix:[12]}],['s_cn2','cn','NB','cm',saCn2],['s_cn3','cn','TH','cm',saCn3],['s_cn4','cn','VD','độ',saCn4,{fig:fb(figExt(false)),mix:[12]}],
 ['s_tt1','tt','NB','cm',saTt1],['s_tt2','tt','TH','độ',saTt2,{mix:[12]}],['s_tt3','tt','VD','cm',saTt3,{fig:figPbAB()}]
].forEach(([id,t,l,u,f,x])=>addSA(id,t,l,u,f,x));

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
function tfHAD(){let b,c;do{c=ri(25,60);b=c+2*ri(3,20);}while(b>=90||180-b-c<20||(180-b-c)%2);const a=180-b-c;
  return tfLoop(u=>({stem:`Cho ΔABC có ∠B = ${b}°, ∠C = ${c}°. Kẻ AH ⊥ BC tại H; tia phân giác của góc BAC cắt BC tại D (như hình).`,fig:figHAD(b,c),items:[
    IT(u[0],`∠BAD = ${a/2}°.`,`∠BAD = ${a}°.`,'tg','TH',`∠BAC = 180° − ${b}° − ${c}° = ${a}°, ∠BAD = ${a/2}°.`,`${a}° là cả góc BAC; ∠BAD = ${a/2}°.`),
    IT(u[1],`∠BAH = ${90-b}°.`,`∠BAH = ${90-c}°.`,'tg','TH',`ΔABH vuông tại H: ∠BAH = 90° − ${b}° = ${90-b}°.`,`${90-c}° là ∠CAH; ∠BAH = 90° − ${b}° = ${90-b}°.`),
    IT(u[2],`∠HAD = ${(b-c)/2}°.`,`∠HAD = ${b-c}°.`,'tg','VD',`∠HAD = ${a/2}° − ${90-b}° = ${(b-c)/2}°.`,`∠HAD = ∠BAD − ∠BAH = ${(b-c)/2}° (bằng nửa hiệu ∠B − ∠C).`),
    IT(u[3],`∠ADC = ${180-c-a/2}°.`,`∠ADC = ${c+a/2}°.`,'tg','VD',`Trong ΔADC: ∠ADC = 180° − ${c}° − ${a/2}° = ${180-c-a/2}°.`,`${c+a/2}° là ∠C + ∠DAC; ∠ADC = 180° − ${c+a/2}° = ${180-c-a/2}°.`)]}));}
const HARD={tf:[{id:'h_had',type:'tf',topic:'tg',level:'VD',mix:[12],fig:figHAD(),gen:tfHAD}],sa:[
 {id:'h_bic',topic:'tg',level:'VD',unit:'độ',fig:figBisI(),gen:()=>{const t=ri(100,160),a=2*t-180;const b=ri(Math.max(20,Math.ceil((180-a)/2)-25),Math.min(170-a,Math.floor((180-a)/2)+25)),c=180-a-b;return{stem:`Cho ΔABC, hai tia phân giác của góc B và góc C cắt nhau tại I (như hình). Biết ∠BIC = ${t}°. Tính số đo ∠BAC (độ).`,fig:figBisI(b,c),ans:[a],exp:`Trong ΔIBC: ∠IBC + ∠ICB = 180° − ${t}° = ${180-t}°. Vì BI, CI là tia phân giác nên ∠B + ∠C = 2 · ${180-t}° = ${360-2*t}°. Vậy ∠BAC = 180° − ${360-2*t}° = ${a}°.`};}},
 {id:'h_45',topic:'cn',level:'VD',unit:'độ',mix:[12],fig:figDE(),gen:()=>{const b=ri(25,65);return{stem:`Cho ΔABC vuông tại A có ∠B = ${b}°. Trên cạnh BC lấy hai điểm D và E sao cho BD = BA, CE = CA (như hình). Tính số đo ∠DAE (độ).`,fig:figDE(b),ans:[45],exp:`ΔBAD cân tại B: ∠BAD = (180° − ${b}°) : 2 = ${(180-b)/2}°. ∠C = 90° − ${b}° = ${90-b}°; ΔCAE cân tại C: ∠CAE = (180° − ${90-b}°) : 2 = ${(90+b)/2}°. ∠BAD + ∠CAE = ${(180-b)/2+(90+b)/2}° = ∠BAC + ∠DAE = 90° + ∠DAE. Vậy ∠DAE = 45° (không phụ thuộc ∠B).`};}},
 {id:'h_rtd',topic:'cn',level:'VD',unit:'cm',mix:[12,15],fig:figRtD(),gen:()=>{const b=ri(35,70),x=ri(3,15);return{stem:`Cho ΔABC vuông tại A có ∠B = ${b}°, AB = ${x} cm. Kẻ AH ⊥ BC tại H; tia phân giác của góc HAC cắt BC tại D (như hình). Tính độ dài BD (cm).`,fig:figRtD(b),ans:[x],exp:`∠HAC = 90° − ∠C = ∠B = ${b}°, nên ∠DAC = ${b/2}° và ∠BAD = 90° − ${b/2}° = ${90-b/2}°. ∠C = ${90-b}°; trong ΔADC: ∠ADC = 180° − ${90-b}° − ${b/2}° = ${90+b/2}°, nên ∠ADB = 180° − ${90+b/2}° = ${90-b/2}°. ∠BAD = ∠BDA nên ΔBAD cân tại B: BD = BA = ${x} cm.`};}},
 {id:'h_pbac',topic:'tt',level:'VD',unit:'độ',mix:[12],fig:figPbAC(),gen:()=>{const a=ri(20,55);return{stem:`Cho ΔABC cân tại A có ∠A = ${a}°. Đường trung trực của cạnh AC cắt cạnh AB tại D (như hình). Tính số đo ∠BDC (độ).`,fig:figPbAC(a),ans:[2*a],exp:`D nằm trên đường trung trực của AC nên DA = DC, ΔDAC cân tại D: ∠DCA = ∠A = ${a}°. Trong ΔADC: ∠ADC = 180° − 2 · ${a}° = ${180-2*a}°. ∠BDC kề bù với ∠ADC: ∠BDC = 180° − ${180-2*a}° = ${2*a}°.`};}},
 {id:'h_abm',topic:'cn',level:'VD',unit:'cm',mix:[15],fig:figRt60M(),gen:()=>{const x=ri(2,15);return{stem:`Cho ΔABC vuông tại A có ∠B = 60° và BC = ${2*x} cm. Gọi M là trung điểm của BC (như hình). Tính chu vi ΔABM (cm).`,ans:[3*x],exp:`Lấy D trên tia đối của tia AB với AD = AB: ΔCAB = ΔCAD (hai cạnh góc vuông) nên CB = CD, ΔBCD cân có ∠B = 60° nên đều. Vậy AB = BD : 2 = BC : 2 = ${x} cm. BM = BC : 2 = ${x} cm = BA, ∠B = 60° nên ΔABM đều, AM = ${x} cm. Chu vi ΔABM = 3 · ${x} = ${3*x} (cm).`};}},
 {id:'h_kite',topic:'bn',level:'VD',unit:'độ',mix:[12,16],fig:figKiteAB(),gen:()=>{let x,y;do{x=2*ri(25,60);y=2*ri(25,60);}while(x/2+y/2>=165);return{stem:`Cho hai tam giác ABC và ABD (C, D nằm khác phía đối với AB) có AC = AD, BC = BD (như hình). Biết ∠CAD = ${x}°, ∠CBD = ${y}°. Tính số đo ∠ACB (độ).`,ans:[180-x/2-y/2],exp:`ΔABC = ΔABD (c.c.c) nên ∠CAB = ∠DAB = ${x/2}°, ∠CBA = ∠DBA = ${y/2}°. Trong ΔABC: ∠ACB = 180° − ${x/2}° − ${y/2}° = ${180-x/2-y/2}°.`};}}
].map(q=>Object.assign({type:'sa'},q))};

const PISA=[
 ()=>{const z=ri(20,40),w=ri(6,14);
  return {title:'Vì kèo mái nhà',fig:figRoof(),ctx:`<p class="stem">Vì kèo mái nhà là tam giác ABC cân tại A (AB = AC), xà ngang BC dài ${2*w} m. Thanh chống AH nối đỉnh A với xà ngang và vuông góc với BC tại H. Mái nghiêng tạo với xà ngang góc ∠ABC = ${z}°.</p>`,qs:[
   saq('Mái nghiêng AC tạo với xà ngang góc ∠ACB bằng bao nhiêu độ?',z,'độ',`ΔABC cân tại A nên ∠ACB = ∠ABC = ${z}°.`,'cn','NB'),
   saq('Góc ở đỉnh ∠BAC của vì kèo bằng bao nhiêu độ?',180-2*z,'độ',`∠BAC = 180° − 2 · ${z}° = ${180-2*z}°.`,'tg','TH'),
   mcq('Vì sao chân thanh chống H là trung điểm của xà ngang BC?','Vì ΔAHB = ΔAHC theo trường hợp cạnh huyền – cạnh góc vuông',[['Vì ΔAHB = ΔAHC theo trường hợp hai cạnh góc vuông','Muốn dùng trường hợp này phải biết trước HB = HC, đó là điều cần giải thích.'],['Vì AH dài bằng nửa BC','Không có cơ sở về độ dài AH.'],['Vì ∠BAC = 90°','Góc ở đỉnh nói chung không phải góc vuông.']],'Hai tam giác vuông AHB và AHC có cạnh huyền AB = AC, cạnh góc vuông AH chung nên bằng nhau; suy ra HB = HC.','tv','TH'),
   saq('Thanh chống AH chia góc BAC thành hai góc. Góc ∠BAH bằng bao nhiêu độ?',90-z,'độ',`ΔABH vuông tại H: ∠BAH = 90° − ${z}° = ${90-z}° (cũng bằng ∠BAC : 2).`,'tg','VD')
 ]};},
 ()=>{const h=ri(3,8),sh=ri(2,9);
  return {title:'Bóng của hai cột đèn',fig:figShadow(),ctx:`<p class="stem">Trên một sân phẳng có hai cột đèn AB và DE cùng cao ${h} m, đều vuông góc với mặt sân. Cùng một lúc, tia nắng chiếu qua đỉnh hai cột tạo với hai cột các góc bằng nhau: ∠BAC = ∠EDF (C, F là đầu bóng của hai cột). Bóng BC của cột thứ nhất dài ${sh} m.</p>`,qs:[
   mcq('Hai tam giác ABC và DEF bằng nhau theo trường hợp nào?','Cạnh góc vuông – góc nhọn kề',[['Hai cạnh góc vuông','Chưa biết EF = BC; đó là điều cần tìm.'],['Cạnh huyền – góc nhọn','AC, DF là cạnh huyền nhưng chưa biết chúng bằng nhau.'],['Cạnh huyền – cạnh góc vuông','Chưa biết hai cạnh huyền AC, DF bằng nhau.']],'ΔABC vuông tại B, ΔDEF vuông tại E có AB = DE (cùng cao) và góc nhọn kề ∠BAC = ∠EDF, nên bằng nhau (cạnh góc vuông – góc nhọn kề).','tv','TH'),
   saq('Bóng EF của cột thứ hai dài bao nhiêu mét?',sh,'m',`ΔABC = ΔDEF nên EF = BC = ${sh} m.`,'tv','NB'),
   mcq('So sánh góc tạo bởi tia nắng với mặt sân ở hai cột: ∠ACB và ∠DFE.','∠ACB = ∠DFE',[['∠ACB > ∠DFE','ΔABC = ΔDEF nên hai góc tương ứng bằng nhau.'],['∠ACB < ∠DFE','ΔABC = ΔDEF nên hai góc tương ứng bằng nhau.'],['∠ACB + ∠DFE = 90°','Hai góc này bằng nhau; ∠ACB phụ với ∠BAC chứ không phụ với ∠DFE.']],'ΔABC = ΔDEF nên ∠ACB = ∠DFE (hai góc tương ứng). Cũng có thể tính: ∠ACB = 90° − ∠BAC = 90° − ∠EDF = ∠DFE.','tg','TH'),
   saq('Ít phút sau, tia nắng tạo với mặt sân góc 45°. Khi đó bóng của mỗi cột dài bao nhiêu mét?',h,'m',`Khi ∠ACB = 45° thì ∠BAC = 90° − 45° = 45°, ΔABC vuông cân tại B nên BC = AB = ${h} m.`,'cn','VD')
 ]};},
 ()=>{const k=ri(60,75),a=180-2*k;
  return {title:'Thang chữ A',fig:figLadder(),ctx:`<p class="stem">Một chiếc thang chữ A có hai chân AB = AC. Người ta gắn thanh giằng DE với D trên AB, E trên AC và AD = AE để giữ thang. Khi mở thang, mỗi chân tạo với mặt sàn góc ∠ABC = ${k}°.</p>`,qs:[
   saq('Góc mở ∠BAC giữa hai chân thang bằng bao nhiêu độ?',a,'độ',`ΔABC cân tại A có ∠ABC = ∠ACB = ${k}°: ∠BAC = 180° − 2 · ${k}° = ${a}°.`,'cn','NB'),
   saq('Thanh giằng DE tạo với chân thang góc ∠ADE bằng bao nhiêu độ?',k,'độ',`ΔADE cân tại A có ∠A = ${a}° nên ∠ADE = (180° − ${a}°) : 2 = ${k}°.`,'cn','TH'),
   mcq('Vì sao thanh giằng DE song song với mặt sàn BC?','Vì ∠ADE = ∠ABC, hai góc này ở vị trí đồng vị',[['Vì DE ngắn hơn BC','Độ dài không quyết định hai đường thẳng song song.'],['Vì ΔADE = ΔABC','Hai tam giác này không bằng nhau (DE ngắn hơn BC).'],['Vì AD = DB','Đề không cho D là trung điểm của AB.']],`∠ADE = ∠ABC = ${k}° là hai góc đồng vị nên DE ∥ BC.`,'cn','VD'),
   mcq('Hai đầu dây buộc từ D xuống C và từ E xuống B. So sánh hai dây DC và EB.','DC = EB',[['DC > EB','ΔADC = ΔAEB nên DC = EB.'],['DC < EB','ΔADC = ΔAEB nên DC = EB.'],['Không so sánh được','ΔADC = ΔAEB (c.g.c) nên so sánh được.']],'ΔADC và ΔAEB có AD = AE, ∠A chung, AC = AB nên ΔADC = ΔAEB (c.g.c). Suy ra DC = EB.','bn','VD')
 ]};},
 ()=>{let ab,ad,dc;do{ab=ri(6,15);ad=ri(3,12);dc=ri(4,14);}while(!(ab<ad+dc&&ad<ab+dc&&dc<ab+ad)||dc===ad);
  return {title:'Gấp tờ giấy hình tam giác',fig:figFold(),ctx:`<p class="stem">Bạn Lan có tờ giấy hình tam giác ABC. Lan gấp tờ giấy sao cho đỉnh B trùng với đỉnh C. Nếp gấp đi qua trung điểm M của BC, vuông góc với BC và cắt cạnh AC tại D. Mở ra, Lan đo được AB = ${ab} cm, AD = ${ad} cm, DC = ${dc} cm.</p>`,qs:[
   mcq('Nếp gấp là đường gì của đoạn thẳng BC?','Đường trung trực của đoạn thẳng BC',[['Đường thẳng song song với BC','Nếp gấp vuông góc với BC.'],['Tia phân giác của góc A','Nếp gấp vuông góc với BC tại trung điểm, nói chung không đi qua A.'],['Đường thẳng đi qua B','Nếp gấp đi qua trung điểm M của BC.']],'Nếp gấp vuông góc với BC tại trung điểm M nên là đường trung trực của BC.','tt','NB'),
   saq('Đoạn DB dài bao nhiêu xăng-ti-mét?',dc,'cm',`D nằm trên đường trung trực của BC nên DB = DC = ${dc} cm.`,'tt','TH'),
   mcq('So sánh hai góc ∠DBC và ∠DCB.','∠DBC = ∠DCB',[['∠DBC > ∠DCB','DB = DC nên ΔDBC cân tại D, hai góc ở đáy bằng nhau.'],['∠DBC < ∠DCB','DB = DC nên ΔDBC cân tại D, hai góc ở đáy bằng nhau.'],['∠DBC + ∠DCB = 90°','Không có cơ sở; hai góc này bằng nhau.']],'DB = DC nên ΔDBC cân tại D: ∠DBC = ∠DCB.','cn','TH'),
   saq('Lan cắt theo đoạn BD được mảnh giấy hình tam giác ABD. Chu vi mảnh ABD là bao nhiêu xăng-ti-mét?',ab+ad+dc,'cm',`Chu vi ΔABD = AB + AD + DB = AB + AD + DC = ${ab} + ${ad} + ${dc} = ${ab+ad+dc} cm.`,'tt','VD')
 ]};}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];
const RECAP=[
  {k:'tg',fig:figAng(70,45,{A:'?',B:'70°',C:'45°'}),extra:'∠A + ∠B + ∠C = 180°. Tam giác vuông: hai góc nhọn phụ nhau. Hai góc kề bù có tổng 180°.'},
  {k:'bn',fig:figME(),extra:'c.c.c: ba cạnh. c.g.c: hai cạnh và góc xen giữa. g.c.g: một cạnh và hai góc kề. Bằng nhau thì cạnh, góc tương ứng bằng nhau.'},
  {k:'tv',fig:figBisPerp(),extra:'Tam giác vuông: hai cạnh góc vuông; cạnh góc vuông – góc nhọn kề; cạnh huyền – góc nhọn; cạnh huyền – cạnh góc vuông.'},
  {k:'cn',fig:fb(figIso({arcs:true,alt:'Tam giác ABC cân tại A'})),extra:'Tam giác cân: hai góc ở đáy bằng nhau. Tam giác cân có một góc 60° là tam giác đều. Tam giác vuông cân có hai góc nhọn bằng 45°.'},
  {k:'tt',fig:fb(figPB({N:'N',alt:'Đường thẳng d là đường trung trực của AB, M và N nằm trên d'})),extra:'M nằm trên đường trung trực của AB khi và chỉ khi MA = MB. Hai điểm cùng cách đều A, B thì đường thẳng nối chúng là đường trung trực của AB.'}
];


/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='c47_seen';
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
  const mcSlots=[['tg',['NB','TH']],['bn',['NB','TH']],['bn',['TH','VD']],['tv',['NB','TH','VD']],['cn',['NB','TH','VD']],['tt',['TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>q.topic===t&&l.includes(q.level)),used));
  const tf=[sel(['tg','bn']),sel(['tv','cn']),sel(['cn','tt'])].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=shuffle(TKEYS).slice(0,4).sort((a,b)=>TKEYS.indexOf(a)-TKEYS.indexOf(b)).map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set(),t1=sel(['bn','tv']),t2=sel(['cn','tt']);
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
