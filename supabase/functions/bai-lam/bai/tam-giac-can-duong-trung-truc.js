// SINH TỰ ĐỘNG bởi supabase/cong-cu/tach_bai.py từ tam-giac-can-duong-trung-truc/index.html – KHÔNG SỬA TAY.
// Mã bên trong giữ nguyên văn từ trang bài; chỉ bọc lại để chạy trên máy chủ.
export const MA_BAI = "tam-giac-can-duong-trung-truc";
export const TIEN_TO = "CN7-";

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

/* ============ Chủ đề ============ */
const TOPICS={
  dn:{short:'Tam giác cân, tam giác đều',name:'Tam giác cân và tam giác đều',rule:'Tam giác cân là tam giác có hai cạnh bằng nhau. Tam giác ABC cân tại A (AB = AC): AB, AC là hai cạnh bên, BC là cạnh đáy, ∠B và ∠C là hai góc ở đáy, ∠A là góc ở đỉnh. Tam giác đều là tam giác có ba cạnh bằng nhau.',tip:'Đỉnh của tam giác cân là đỉnh chung của hai cạnh bằng nhau, không phải đỉnh nằm đối diện. Tam giác đều cũng là một tam giác cân.'},
  tc:{short:'Tính chất tam giác cân',name:'Tính chất của tam giác cân',rule:'Trong một tam giác cân, hai góc ở đáy bằng nhau. Ngược lại, một tam giác có hai góc bằng nhau thì tam giác đó là tam giác cân.',tip:'Góc ở đáy = (180° − góc ở đỉnh) : 2; góc ở đỉnh = 180° − 2 · góc ở đáy. Hay quên chia 2 hoặc nhân 2.'},
  tt:{short:'Đường trung trực',name:'Đường trung trực của đoạn thẳng',rule:'Đường thẳng vuông góc với một đoạn thẳng tại trung điểm của nó được gọi là đường trung trực của đoạn thẳng đó.',tip:'Cần đủ hai điều kiện: đi qua trung điểm và vuông góc với đoạn thẳng. Thiếu một trong hai điều kiện thì chưa phải đường trung trực.'},
  ct:{short:'Tính chất đường trung trực',name:'Tính chất của đường trung trực',rule:'Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai mút của đoạn thẳng đó. Đường trung trực của đoạn thẳng AB là tập hợp tất cả các điểm cách đều hai mút A và B.',tip:'M nằm trên đường trung trực của AB (M không thuộc AB) thì MA = MB, nên tam giác MAB cân tại M và ∠MAB = ∠MBA.'}
};
const TKEYS=['dn','tc','tt','ct'];
const TDESC={dn:'Cạnh bên, cạnh đáy, góc ở đỉnh, góc ở đáy; tam giác đều, tam giác vuông cân',tc:'Hai góc ở đáy bằng nhau, tính góc, nhận ra tam giác cân từ hai góc bằng nhau',tt:'Nhận biết và vẽ đường trung trực của một đoạn thẳng',ct:'Điểm trên đường trung trực cách đều hai mút; tính độ dài, góc, chu vi'};
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng'};
const LEVEL_DESC={NB:'Nhận biết tam giác cân, tam giác đều, đường trung trực và các tính chất.',TH:'Tính góc, độ dài qua một hai bước; chọn điều kiện đúng.',VD:'Tính toán, lập luận nhiều bước, kết hợp các bài trước và tình huống thực tế.'};
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
/* chọn 3 lựa chọn sai khác nhau và khác đáp án đúng; không đủ thì trả về null để sinh lại */
function pick3(right,cands){const seen=new Set([String(right)]),w=[];for(const c of cands){const k=String(c[0]);if(c[0]==null||seen.has(k))continue;seen.add(k);w.push(c);if(w.length===3)break;}return w.length===3?w:null;}
function retry(f){for(let i=0;i<300;i++){const r=f();if(r)return r;}throw new Error('Bộ sinh không tạo được câu');}
const LS=[['A','B','C'],['M','N','P'],['D','E','F'],['H','I','K'],['P','Q','R'],['X','Y','Z'],['E','F','G']];
/* tam giác với đỉnh cân a, hai đỉnh đáy b, c */
function T3(){const l=sel(LS),i=ri(0,2),o=[0,1,2].filter(k=>k!==i);return{l,a:l[i],b:l[o[0]],c:l[o[1]],n:'Δ'+l.join('')};}
const SEGS=[['A','B','O','M'],['P','Q','O','M'],['C','D','I','K'],['E','F','H','N'],['M','N','O','K']];
const g=x=>x+'°';

/* ============ Câu nhiều lựa chọn ============ */
const MC=[
 {id:'s_dn1',type:'mc',topic:'dn',level:'NB',stem:'Tam giác cân là tam giác:',ans:0,opts:[
   {t:'có hai cạnh bằng nhau'},
   {t:'có ba góc nhọn',err:'Tam giác có ba góc nhọn là tam giác nhọn, chưa chắc có hai cạnh bằng nhau.'},
   {t:'có một góc vuông',err:'Tam giác có một góc vuông là tam giác vuông, chưa chắc có hai cạnh bằng nhau.'},
   {t:'có ba cạnh khác nhau',err:'Tam giác có ba cạnh khác nhau thì không có hai cạnh nào bằng nhau, nên không phải tam giác cân.'}],
  exp:'Theo định nghĩa: tam giác cân là tam giác có hai cạnh bằng nhau.'},
 {id:'s_dn2',type:'mc',topic:'dn',level:'NB',stem:'Chọn phát biểu <b>sai</b>.',ans:0,opts:[
   {t:'Mọi tam giác cân đều là tam giác đều'},
   {t:'Tam giác đều có ba cạnh bằng nhau',err:'Phát biểu này đúng: đó là định nghĩa tam giác đều.'},
   {t:'Tam giác đều là tam giác cân',err:'Phát biểu này đúng: tam giác đều có hai cạnh bằng nhau nên cũng là tam giác cân.'},
   {t:'Tam giác đều có ba góc bằng nhau',err:'Phát biểu này đúng: tam giác đều có ba góc bằng nhau (mỗi góc 60°).'}],
  exp:'Tam giác cân chỉ cần hai cạnh bằng nhau, ví dụ tam giác có các cạnh 5 cm, 5 cm, 3 cm là tam giác cân nhưng không đều. Vậy "Mọi tam giác cân đều là tam giác đều" là sai.'},
 {id:'s_dn3',type:'mc',topic:'dn',level:'NB',stem:'Tam giác vuông cân là:',ans:0,opts:[
   {t:'tam giác vuông có hai cạnh bằng nhau'},
   {t:'tam giác có hai góc bằng nhau',err:'Tam giác có hai góc bằng nhau là tam giác cân, nhưng chưa chắc có góc vuông.'},
   {t:'tam giác vuông có một góc nhọn bằng 30°',err:'Khi đó hai góc nhọn là 30° và 60°, không bằng nhau, nên tam giác không cân.'},
   {t:'tam giác có ba góc bằng nhau',err:'Tam giác có ba góc bằng nhau là tam giác đều, mỗi góc 60°, không có góc vuông.'}],
  exp:'Tam giác vuông có hai cạnh bằng nhau được gọi là tam giác vuông cân. Nó cân tại đỉnh góc vuông.'},
 {id:'s_tc2',type:'mc',topic:'tc',level:'NB',stem:'Tam giác cân có một góc bằng 60° là tam giác gì?',ans:0,opts:[
   {t:'Tam giác đều'},
   {t:'Tam giác vuông cân',err:'Tam giác vuông cân có các góc 90°, 45°, 45°, không có góc 60°.'},
   {t:'Tam giác vuông',err:'Tính ra ba góc đều bằng 60°, không có góc vuông.'},
   {t:'Tam giác có ba cạnh khác nhau',err:'Tam giác cân đã có hai cạnh bằng nhau; ở đây còn là tam giác đều.'}],
  exp:'Nếu góc 60° là góc ở đỉnh thì mỗi góc ở đáy bằng (180° − 60°) : 2 = 60°. Nếu góc 60° là góc ở đáy thì góc đáy kia cũng 60°, góc ở đỉnh bằng 180° − 120° = 60°. Tam giác có ba góc bằng nhau nên cân tại mỗi đỉnh, ba cạnh bằng nhau: đó là tam giác đều.'},
 {id:'s_tc3',type:'mc',topic:'tc',level:'NB',stem:'Mỗi góc nhọn của một tam giác vuông cân bằng:',ans:0,opts:[
   {t:'45°'},
   {t:'60°',err:'60° là số đo mỗi góc của tam giác đều.'},
   {t:'90°',err:'90° là góc vuông, không phải góc nhọn.'},
   {t:'30°',err:'Hai góc nhọn bằng nhau và có tổng 90°, nên mỗi góc là 45°, không phải 30°.'}],
  exp:'Tam giác vuông cân cân tại đỉnh góc vuông nên hai góc nhọn là hai góc ở đáy, bằng nhau. Hai góc nhọn của tam giác vuông có tổng 90° nên mỗi góc bằng 90° : 2 = 45°.'},
 {id:'s_tt1',type:'mc',topic:'tt',level:'NB',stem:'Đường trung trực của một đoạn thẳng là:',ans:0,opts:[
   {t:'đường thẳng vuông góc với đoạn thẳng đó tại trung điểm của nó'},
   {t:'đường thẳng đi qua trung điểm của đoạn thẳng đó',err:'Thiếu điều kiện vuông góc: có nhiều đường thẳng đi qua trung điểm nhưng không vuông góc với đoạn thẳng.'},
   {t:'đường thẳng vuông góc với đoạn thẳng đó tại một đầu mút',err:'Đường trung trực vuông góc với đoạn thẳng tại trung điểm, không phải tại đầu mút.'},
   {t:'đường thẳng vuông góc với đoạn thẳng đó',err:'Thiếu điều kiện đi qua trung điểm.'}],
  exp:'Đường thẳng vuông góc với một đoạn thẳng tại trung điểm của nó được gọi là đường trung trực của đoạn thẳng đó.'},
 {id:'s_tt2',type:'mc',topic:'tt',level:'NB',stem:'Để vẽ đường trung trực của đoạn thẳng AB bằng thước thẳng và compa, ta lấy A và B làm tâm, vẽ hai cung tròn có cùng bán kính r. Bán kính r phải thoả mãn điều kiện nào?',ans:0,opts:[
   {t:'r lớn hơn một nửa độ dài AB'},
   {t:'r nhỏ hơn một nửa độ dài AB',err:'Khi đó hai cung tròn không cắt nhau, không có điểm M, N để kẻ đường thẳng.'},
   {t:'r bằng một nửa độ dài AB',err:'Khi đó hai cung chỉ gặp nhau tại trung điểm của AB, không được hai giao điểm M và N.'},
   {t:'r bất kì',err:'Nếu r quá nhỏ thì hai cung không cắt nhau; cần r lớn hơn AB/2.'}],
  exp:'Theo cách vẽ trong SGK: lấy A làm tâm vẽ cung tròn bán kính lớn hơn AB/2, rồi lấy B làm tâm vẽ cung tròn cùng bán kính; hai cung cắt nhau tại M và N, đường thẳng MN là đường trung trực của AB.'},
 {id:'s_tt3',type:'mc',topic:'tt',level:'TH',stem:'Vẽ đường trung trực MN của đoạn thẳng AB bằng thước thẳng và compa (M, N là giao điểm của hai cung tròn). Giao điểm của MN và AB là điểm nào?',ans:0,opts:[
   {t:'Trung điểm của đoạn thẳng AB'},
   {t:'Điểm A',err:'MN vuông góc với AB tại trung điểm, không đi qua đầu mút A.'},
   {t:'Một điểm bất kì trên đoạn thẳng AB',err:'Giao điểm hoàn toàn xác định: đó là trung điểm của AB.'},
   {t:'Điểm M',err:'M là giao điểm của hai cung tròn, không nằm trên đoạn thẳng AB.'}],
  exp:'MN là đường trung trực của AB nên vuông góc với AB tại trung điểm của AB. Vì vậy cách vẽ này cũng dùng để vẽ trung điểm của một đoạn thẳng.'},
 {id:'s_ct2',type:'mc',topic:'ct',level:'NB',stem:'Cho đoạn thẳng AB và điểm M không thuộc đoạn thẳng AB sao cho MA = MB. Khẳng định nào sau đây đúng?',ans:0,opts:[
   {t:'M nằm trên đường trung trực của đoạn thẳng AB'},
   {t:'M là trung điểm của đoạn thẳng AB',err:'M không thuộc đoạn thẳng AB nên không thể là trung điểm của AB.'},
   {t:'MA vuông góc với AB',err:'Đề bài không cho điều này; MA nói chung không vuông góc với AB.'},
   {t:'M nằm trên đường thẳng AB',err:'Nếu M nằm trên đường thẳng AB và MA = MB thì M là trung điểm của AB, trái với giả thiết M không thuộc đoạn AB.'}],
  exp:'Điểm cách đều hai mút của đoạn thẳng thì nằm trên đường trung trực của đoạn thẳng đó (Ví dụ trong SGK: gọi O là trung điểm AB, ΔOMA = ΔOMB (c.c.c) suy ra MO ⊥ AB).'},
 {id:'s_ct3',type:'mc',topic:'ct',level:'VD',stem:'Hai khu dân cư A và B nằm cùng một phía của con đường thẳng d (đoạn thẳng AB không vuông góc với d). Cần xây một trạm y tế M nằm trên con đường d sao cho trạm cách đều hai khu dân cư. Vị trí của M là:',ans:0,opts:[
   {t:'giao điểm của đường d với đường trung trực của đoạn thẳng AB'},
   {t:'trung điểm của đoạn thẳng AB',err:'Trung điểm của AB cách đều A, B nhưng không nằm trên con đường d.'},
   {t:'một điểm bất kì trên đường d',err:'Một điểm bất kì trên d thường có khoảng cách đến A và đến B khác nhau.'},
   {t:'chân đường vuông góc kẻ từ A đến đường d',err:'Điểm này gần A nhất trên đường d, nhưng thường không cách đều A và B.'}],
  exp:'M cách đều A và B nên M nằm trên đường trung trực của AB. M lại nằm trên đường d. Vậy M là giao điểm của d và đường trung trực của AB.'},
 {id:'s_tc90',type:'mc',topic:'tc',level:'VD',mix:[12],fig:fb(figMid()),stem:'Cho ΔABC có M là trung điểm của BC và MA = MB (như hình). Số đo ∠BAC là:',ans:0,opts:[
   {t:'90°'},
   {t:'60°',err:'Đề không cho tam giác đều. Tính đúng: ∠BAC = ∠B + ∠C và tổng ba góc bằng 180°.'},
   {t:'120°',err:'∠BAC = ∠B + ∠C nên 2 · ∠BAC = 180°, không ra 120°.'},
   {t:'45°',err:'45° là một nửa của ∠BAC, không phải ∠BAC.'}],
  exp:'MA = MB = MC. ΔMAB cân tại M nên ∠MAB = ∠B; ΔMAC cân tại M nên ∠MAC = ∠C. Do đó ∠BAC = ∠MAB + ∠MAC = ∠B + ∠C. Trong ΔABC: ∠BAC + ∠B + ∠C = 180° nên 2 · ∠BAC = 180°, ∠BAC = 90°.'},
 {id:'s_ttah',type:'mc',topic:'tt',level:'VD',mix:[15],fig:fb(figIso({foot:'H',alt:'Tam giác ABC cân tại A, AH vuông góc với BC tại H'})),stem:'Cho ΔABC cân tại A, AH ⊥ BC tại H (như hình). Lập luận nào giải thích đúng vì sao AH là đường trung trực của đoạn thẳng BC?',ans:0,opts:[
   {t:'ΔAHB = ΔAHC (cạnh huyền – cạnh góc vuông) nên HB = HC; lại có AH ⊥ BC'},
   {t:'Vì AH ⊥ BC',err:'Mới có điều kiện vuông góc, chưa chứng minh H là trung điểm của BC.'},
   {t:'Vì AB = AC nên H là trung điểm của BC',err:'Từ AB = AC chưa suy ngay được HB = HC; cần chứng minh hai tam giác AHB và AHC bằng nhau.'},
   {t:'ΔAHB = ΔAHC (c.c.c) nên HB = HC',err:'Chưa biết HB = HC nên chưa dùng được c.c.c; điều cần chứng minh không được dùng làm giả thiết.'}],
  exp:'Hai tam giác vuông AHB và AHC có cạnh huyền AB = AC và cạnh góc vuông AH chung nên ΔAHB = ΔAHC (cạnh huyền – cạnh góc vuông). Suy ra HB = HC, H là trung điểm BC. AH ⊥ BC tại trung điểm H nên AH là đường trung trực của BC.'},
 {id:'s_ttkite',type:'mc',topic:'tt',level:'VD',mix:[13],fig:fb(figPB({N:'N',alt:'Đoạn thẳng AB, điểm M phía trên và N phía dưới với MA bằng MB, NA bằng NB'})),stem:'Cho đoạn thẳng AB. Hai điểm M, N nằm khác phía đối với AB sao cho MA = MB và NA = NB (như hình). Đường thẳng MN là:',ans:0,opts:[
   {t:'đường trung trực của đoạn thẳng AB'},
   {t:'một đường thẳng đi qua trung điểm AB nhưng không vuông góc với AB',err:'M và N đều cách đều A, B nên cả hai nằm trên đường trung trực của AB; vậy MN chính là đường trung trực, nên vuông góc với AB.'},
   {t:'một đường thẳng song song với AB',err:'MN cắt AB (vì M, N nằm khác phía đối với AB), nên không song song với AB.'},
   {t:'đường thẳng vuông góc với AB tại A',err:'Đường thẳng MN vuông góc với AB tại trung điểm, không phải tại A.'}],
  exp:'MA = MB nên M nằm trên đường trung trực của AB; NA = NB nên N cũng nằm trên đường trung trực của AB. Qua hai điểm M, N chỉ có một đường thẳng, nên MN là đường trung trực của AB. (Cũng có thể chứng minh ΔAMN = ΔBMN theo trường hợp c.c.c.)'}
];
const addMC=(id,topic,level,gen,extra)=>MC.push(Object.assign({id,type:'mc',topic,level,gen},extra||{}));

/* --- Tam giác cân, tam giác đều --- */
function gDnName(){
  const t=T3(),{a,b,c,n}=t,k=ri(0,3),fig=fb(figIso({lab:[a,b,c],alt:`Tam giác ${n.slice(1)} cân tại ${a}`}));
  const stem=`Cho ${n} cân tại ${a} (như hình). `;
  if(k===0)return mk(stem+'Cạnh đáy của tam giác là:',`${b}${c}`,[[`${a}${b}`,`${a}${b} là cạnh bên (đi qua đỉnh ${a}).`],[`${a}${c}`,`${a}${c} là cạnh bên (đi qua đỉnh ${a}).`],['Không xác định được',`Tam giác cân tại ${a} nên cạnh đáy là cạnh đối diện với đỉnh ${a}: ${b}${c}.`]],`Tam giác cân tại ${a}: hai cạnh bên là ${a}${b}, ${a}${c}; cạnh đáy là ${b}${c}.`,{fig});
  if(k===1)return mk(stem+'Góc ở đỉnh của tam giác là:',`∠${a}`,[[`∠${b}`,`∠${b} là góc ở đáy.`],[`∠${c}`,`∠${c} là góc ở đáy.`],['Không xác định được',`Tam giác cân tại ${a} nên góc ở đỉnh là ∠${a}.`]],`Tam giác cân tại ${a}: ∠${a} là góc ở đỉnh; ∠${b} và ∠${c} là hai góc ở đáy.`,{fig});
  if(k===2)return mk(stem+'Hai cạnh bên của tam giác là:',`${a}${b} và ${a}${c}`,[[`${a}${b} và ${b}${c}`,`${b}${c} là cạnh đáy.`],[`${a}${c} và ${b}${c}`,`${b}${c} là cạnh đáy.`],[`${b}${c} và ${b}${a}`,`${b}${c} là cạnh đáy; hai cạnh bên cùng đi qua đỉnh ${a}.`]],`Hai cạnh bên là hai cạnh bằng nhau, cùng đi qua đỉnh ${a}: ${a}${b} và ${a}${c}.`,{fig});
  return mk(stem+'Hai góc ở đáy của tam giác là:',`∠${b} và ∠${c}`,[[`∠${a} và ∠${b}`,`∠${a} là góc ở đỉnh.`],[`∠${a} và ∠${c}`,`∠${a} là góc ở đỉnh.`],[`Chỉ có ∠${a}`,`∠${a} là góc ở đỉnh; hai góc ở đáy là ∠${b} và ∠${c}.`]],`Hai góc ở đáy là hai góc kề cạnh đáy ${b}${c}: ∠${b} và ∠${c}.`,{fig});
}
function gDnApex(){
  const t=T3(),{a,b,c,n}=t;
  return mk(`Cho hình vẽ, các cạnh có cùng kí hiệu thì bằng nhau. ${n} là tam giác gì?`,`${n} cân tại ${a}`,[[`${n} cân tại ${b}`,`Đỉnh của tam giác cân là đỉnh chung của hai cạnh bằng nhau ${a}${b} và ${a}${c}, tức là ${a}.`],[`${n} cân tại ${c}`,`Đỉnh của tam giác cân là đỉnh chung của hai cạnh bằng nhau ${a}${b} và ${a}${c}, tức là ${a}.`],[`${n} là tam giác đều`,`Hình chỉ cho biết hai cạnh bằng nhau, chưa biết cạnh ${b}${c} có bằng hai cạnh kia không.`]],`${a}${b} = ${a}${c} nên ${n} cân tại ${a}.`,{fig:fb(figIso({lab:[a,b,c],alt:`Tam giác ${n.slice(1)} có ${a}${b} bằng ${a}${c}`}))});
}
function gDnSides(){
  const t=T3(),{a,b,c,n}=t;let x,y;do{x=ri(3,12);y=ri(2,2*x-1);}while(y===x);
  const L=shuffle([`${a}${b} = ${x} cm`,`${b}${c} = ${y} cm`,`${c}${a} = ${x} cm`]).join(', ');
  return mk(`Cho ${n} có ${L}. Khẳng định nào sau đây đúng?`,`${n} cân tại ${a}`,[[`${n} cân tại ${b}`,`Hai cạnh bằng nhau là ${a}${b} và ${c}${a}, có đỉnh chung là ${a}, không phải ${b}.`],[`${n} cân tại ${c}`,`Hai cạnh bằng nhau là ${a}${b} và ${c}${a}, có đỉnh chung là ${a}, không phải ${c}.`],[`${n} là tam giác đều`,`${b}${c} = ${y} cm khác ${x} cm nên ba cạnh không bằng nhau.`]],`${a}${b} = ${c}${a} = ${x} cm nên ${n} cân tại ${a} (đỉnh chung của hai cạnh bằng nhau).`);
}
function gDnCount(){return retry(()=>{
  const kinds=[0,1,2,3].map(()=>sel(['iso','iso','eq','sc','sc']));
  const tri=kinds.map(k=>{if(k==='eq'){const x=ri(2,9);return[x,x,x];}
    if(k==='iso'){let x,y;do{x=ri(3,9);y=ri(2,2*x-1);}while(y===x);return shuffle([x,x,y]);}
    let p,q,r;do{p=ri(2,9);q=ri(2,9);r=ri(2,9);}while(p===q||q===r||p===r||Math.max(p,q,r)*2>=p+q+r);return[p,q,r];});
  const cnt=kinds.filter(k=>k!=='sc').length,eqn=kinds.filter(k=>k==='eq').length;
  if(cnt<1||cnt>3)return null;
  const w=pick3(cnt,[[cnt-eqn,'Tam giác đều có hai cạnh bằng nhau nên cũng là tam giác cân; cần đếm cả tam giác đều.'],[cnt+1,'Đếm thừa: tam giác có ba cạnh khác nhau không phải tam giác cân.'],[cnt-1,'Đếm thiếu: hãy xét lại từng bộ ba cạnh.'],[4,'Có tam giác ba cạnh khác nhau, không phải tam giác cân.'],[0,'Có ít nhất một bộ có hai cạnh bằng nhau.']].filter(c=>c[0]>=0&&c[0]<=4));
  if(!w)return null;
  const list=tri.map((s,i)=>`(${'abcd'[i]}) ${s.join(' cm; ')} cm`).join('&nbsp;&nbsp; ');
  return mk(`Có bao nhiêu tam giác cân trong các tam giác có độ dài ba cạnh như sau?<br>${list}`,String(cnt),w.map(z=>[String(z[0]),z[1]]),`Tam giác cân là tam giác có hai cạnh bằng nhau (tam giác đều cũng là tam giác cân). Các bộ có hai cạnh bằng nhau: ${tri.map((s,i)=>kinds[i]!=='sc'?'('+'abcd'[i]+')':'').filter(Boolean).join(', ')}. Vậy có ${cnt} tam giác cân.`);
});}
/* --- Tính chất tam giác cân --- */
function gTcProp(){
  const t=T3(),{a,b,c,n}=t;
  return mk(`Cho ${n} cân tại ${a}. Khẳng định nào sau đây đúng?`,`∠${b} = ∠${c}`,[[`∠${a} = ∠${b}`,`∠${a} là góc ở đỉnh, không nhất thiết bằng góc ở đáy.`],[`∠${a} = ∠${c}`,`∠${a} là góc ở đỉnh, không nhất thiết bằng góc ở đáy.`],[`${b}${c} = ${a}${b}`,`${b}${c} là cạnh đáy, không nhất thiết bằng cạnh bên; hai cạnh bên mới bằng nhau: ${a}${b} = ${a}${c}.`]],`Trong tam giác cân, hai góc ở đáy bằng nhau: ∠${b} = ∠${c}.`);
}
function gTcOther(){
  const t=T3(),{a,b,c,n}=t;let x;do{x=ri(25,80);}while(x===60||x===45);
  return mk(`Cho ${n} cân tại ${a} có ∠${b} = ${x}°. Số đo ∠${c} là:`,g(x),[[g(180-2*x),`${180-2*x}° là số đo của góc ở đỉnh ∠${a}.`],[g(90-x),`Nhầm sang hai góc phụ nhau; ở đây ∠${b} và ∠${c} là hai góc ở đáy nên bằng nhau.`],[g(180-x),`Nhầm sang hai góc kề bù; ở đây ∠${b} và ∠${c} là hai góc ở đáy nên bằng nhau.`]],`${n} cân tại ${a} nên hai góc ở đáy bằng nhau: ∠${c} = ∠${b} = ${x}°.`);
}
function gTcConv(){
  const t=T3(),{a,b,c,n}=t;let x;do{x=ri(25,85);}while(x===60);
  return mk(`Cho ${n} có ∠${b} = ∠${c} = ${x}°. Khẳng định nào sau đây đúng?`,`${n} cân tại ${a}`,[[`${n} cân tại ${b}`,`Tam giác có hai góc bằng nhau (∠${b} = ∠${c}) thì cân tại đỉnh còn lại ${a}.`],[`${n} cân tại ${c}`,`Tam giác có hai góc bằng nhau (∠${b} = ∠${c}) thì cân tại đỉnh còn lại ${a}.`],[`${n} là tam giác đều`,`∠${a} = 180° − 2 · ${x}° = ${180-2*x}° khác ${x}° nên ba góc không bằng nhau.`]],`∠${b} = ∠${c} nên ${n} cân tại ${a} (hai góc bằng nhau là hai góc ở đáy, cạnh đáy là ${b}${c}).`);
}
function gTcApex(){return retry(()=>{
  const t=T3(),{a,b,c,n}=t,x=ri(25,85);if(x===60)return null;
  const w=pick3(g(180-2*x),[[g(180-x),`Mới trừ một góc ở đáy; phải trừ cả hai góc ở đáy: 180° − 2 · ${x}°.`],[g(x),'Góc ở đỉnh không nhất thiết bằng góc ở đáy.'],[g(90-x),'Nhầm công thức. Góc ở đỉnh = 180° − 2 · góc ở đáy.'],[g((180-x)/2),'Đây là cách tính góc ở đáy khi biết góc ở đỉnh, không dùng ở đây.']].filter(z=>parseFloat(z[0])>0&&Number.isInteger(parseFloat(z[0]))));
  if(!w)return null;
  return mk(`Cho ${n} cân tại ${a} có ∠${b} = ${x}°. Số đo ∠${a} là:`,g(180-2*x),w,`∠${c} = ∠${b} = ${x}° (hai góc ở đáy). Tổng ba góc của tam giác bằng 180° nên ∠${a} = 180° − 2 · ${x}° = ${180-2*x}°.`);
});}
function gTcBase(){return retry(()=>{
  const t=T3(),{a,b,c,n}=t,y=2*ri(10,80);if(y===60)return null;
  const z=(180-y)/2;
  const w=pick3(g(z),[[g(180-y),'Quên chia 2: 180° − góc ở đỉnh là tổng của hai góc ở đáy.'],[g(y),'Góc ở đáy không nhất thiết bằng góc ở đỉnh.'],[g(180-2*y),'Nhầm công thức. Góc ở đáy = (180° − góc ở đỉnh) : 2.'],[g(90-y),'Nhầm công thức. Góc ở đáy = (180° − góc ở đỉnh) : 2.']].filter(q=>parseFloat(q[0])>0));
  if(!w)return null;
  return mk(`Cho ${n} cân tại ${a} có ∠${a} = ${y}°. Số đo ∠${b} là:`,g(z),w,`∠${b} = ∠${c} và ∠${b} + ∠${c} = 180° − ${y}° = ${180-y}°. Vậy ∠${b} = ${180-y}° : 2 = ${z}°.`);
});}
function gTcConv2(){
  const t=T3(),{a,b,c,n}=t;let x;do{x=ri(25,85);}while(x===60);const y=180-2*x;
  const giv=shuffle([`∠${a} = ${y}°`,`∠${b} = ${x}°`]).join(', ');
  return mk(`Cho ${n} có ${giv}. Khẳng định nào sau đây đúng?`,`${n} cân tại ${a}`,[[`${n} cân tại ${b}`,`Tính ∠${c} = ${x}° = ∠${b}; hai góc bằng nhau là ∠${b}, ∠${c} nên tam giác cân tại ${a}.`],[`${n} cân tại ${c}`,`Tính ∠${c} = ${x}° = ∠${b}; hai góc bằng nhau là ∠${b}, ∠${c} nên tam giác cân tại ${a}.`],[`${n} không phải tam giác cân`,`Cần tính góc còn lại: ∠${c} = 180° − ${y}° − ${x}° = ${x}° = ∠${b}.`]],`∠${c} = 180° − ${y}° − ${x}° = ${x}° (tổng ba góc của tam giác). Vậy ∠${b} = ∠${c} nên ${n} cân tại ${a}.`);
}
function gTcAlt(){return retry(()=>{
  const a=2*ri(20,38);if(a===60)return null;const z=a/2,C=(180-a)/2;
  const w=pick3(g(z),[[g(C),`${C}° là số đo ∠C (góc ở đáy), không phải ∠HBC.`],[g(90-a),'Nhầm: trong ΔHBC vuông tại H, ∠HBC = 90° − ∠C, không phải 90° − ∠A.'],[g(a),'Nhầm ∠HBC với ∠A.'],[g(90-z),'Nhầm phép trừ: ∠HBC = 90° − ∠C.']].filter(q=>parseFloat(q[0])>0));
  if(!w)return null;
  return mk(`Cho ΔABC cân tại A có ∠A = ${a}°, BH ⊥ AC tại H, CK ⊥ AB tại K (như hình). Số đo ∠HBC là:`,g(z),w,`ΔABC cân tại A nên ∠C = (180° − ${a}°) : 2 = ${C}°. ΔHBC vuông tại H nên ∠HBC = 90° − ∠C = 90° − ${C}° = ${z}°.`,{fig:fb(figAlt(a))});
});}
function gTcExt(){return retry(()=>{
  const a=4*ri(5,35),B=(180-a)/2,ABD=180-B,z=B/2;
  const w=pick3(g(z),[[g(B),`${B}° là số đo ∠ABC, không phải ∠ADB.`],[g(ABD),`${ABD}° là số đo ∠ABD.`],[g(a/2),'Nhầm: ∠ADB = ∠ABC : 2, không phải ∠BAC : 2.'],[g(180-ABD),'Nhầm: ΔABD cân tại B nên ∠ADB = (180° − ∠ABD) : 2.']]);
  if(!w)return null;
  return mk(`Cho ΔABC cân tại A có ∠BAC = ${a}°. Trên tia đối của tia BC lấy điểm D sao cho BD = BA (như hình). Số đo ∠ADB là:`,g(z),w,`∠ABC = (180° − ${a}°) : 2 = ${B}°. ∠ABD kề bù với ∠ABC nên ∠ABD = 180° − ${B}° = ${ABD}°. ΔABD cân tại B (BA = BD) nên ∠ADB = (180° − ${ABD}°) : 2 = ${z}°.`,{fig:fb(figExt(false,a))});
});}
function gTcADE(){
  return mk('Cho ΔABC cân tại A. Lấy D trên cạnh AB, E trên cạnh AC sao cho AD = AE (như hình). Khẳng định nào sau đây đúng?','ΔABE = ΔACD (c.g.c)',[['ΔABE = ΔCAD (c.g.c)','Sai thứ tự đỉnh: B ứng với C, E ứng với D, nên phải viết ΔABE = ΔACD.'],['ΔABE = ΔACD (g.c.g)','Giả thiết cho hai cặp cạnh và góc xen giữa (AB = AC, ∠A chung, AE = AD), nên là trường hợp c.g.c.'],['ΔADE = ΔABC (c.g.c)','AD khác AB nên hai tam giác này không bằng nhau.']],'Xét ΔABE và ΔACD: AB = AC (ΔABC cân tại A), ∠A chung, AE = AD (giả thiết). Vậy ΔABE = ΔACD (c.g.c). Suy ra BE = CD.',{fig:fb(figADE())});
}
/* --- Đường trung trực --- */
function gTtCand(){
  const ty=shuffle(['ok','tilt','off']),k=ty.indexOf('ok'),H=['Hình a','Hình b','Hình c'];
  const why={tilt:'Đường thẳng đi qua trung điểm nhưng không vuông góc với đoạn thẳng.',off:'Đường thẳng vuông góc với đoạn thẳng nhưng không đi qua trung điểm.'};
  const w=[0,1,2].filter(i=>i!==k).map(i=>[H[i],why[ty[i]]]).concat([['Cả ba hình',`Chỉ ${H[k].toLowerCase()} có đường thẳng vừa vuông góc vừa đi qua trung điểm.`]]);
  return mk('Trong ba hình dưới đây, hình nào có đường thẳng là đường trung trực của đoạn thẳng? (Các đoạn có cùng kí hiệu thì bằng nhau.)',H[k],w,`Đường trung trực phải vuông góc với đoạn thẳng tại trung điểm. ${H[k]}: đường thẳng vuông góc với đoạn thẳng tại trung điểm.`,{fig:fb(figCand(ty))});
}
function gTtGrid(){
  const len=sel([4,6]),a0=ri(1,9-len),m=a0+len/2,labs=shuffle(['d','m','n','u']);
  const off=sel([m-1,m+1]),lines=[{lab:labs[0],t:'v',x:m},{lab:labs[1],t:'o',x:m},{lab:labs[2],t:'v',x:off},{lab:labs[3],t:'v',x:sel([a0,a0+len])}];
  const drawn=lines.slice().sort((p,q)=>p.x-q.x||(p.t==='o'?1:-1));
  return mk('Trên lưới ô vuông, đoạn thẳng AB nằm trên một dòng kẻ. Đường thẳng nào là đường trung trực của đoạn thẳng AB?',`Đường thẳng ${labs[0]}`,[[`Đường thẳng ${labs[1]}`,`${labs[1]} đi qua trung điểm của AB nhưng không vuông góc với AB.`],[`Đường thẳng ${labs[2]}`,`${labs[2]} vuông góc với AB nhưng không đi qua trung điểm của AB.`],[`Đường thẳng ${labs[3]}`,`${labs[3]} vuông góc với AB tại một đầu mút, không phải tại trung điểm.`]],`AB dài ${len} ô nên trung điểm cách A ${len/2} ô. Đường thẳng ${labs[0]} theo dòng kẻ dọc (vuông góc với AB) và đi qua trung điểm của AB, nên là đường trung trực của AB.`,{fig:fb(figGrid(a0,len,drawn))});
}
function gTtMid(){
  const [P,Q,O]=sel(SEGS),x=2*ri(3,12);
  return mk(`Đường thẳng d là đường trung trực của đoạn thẳng ${P}${Q} và cắt ${P}${Q} tại ${O}. Biết ${P}${Q} = ${x} cm. Độ dài ${O}${P} là:`,`${x/2} cm`,[[`${x} cm`,`${O}${P} chỉ là một nửa đoạn ${P}${Q}.`],[`${2*x} cm`,`${O} là trung điểm nên ${O}${P} = ${P}${Q} : 2, không nhân 2.`],[`${x/2+1} cm`,`${O} là trung điểm của ${P}${Q} nên ${O}${P} = ${x} : 2 = ${x/2} cm.`]],`Đường trung trực cắt đoạn thẳng tại trung điểm, nên ${O} là trung điểm của ${P}${Q}: ${O}${P} = ${x} : 2 = ${x/2} cm.`);
}
function gTtCond(){
  const [P,Q,O]=sel(SEGS);
  if(RNG()<.5)return mk(`Đường thẳng d đi qua trung điểm ${O} của đoạn thẳng ${P}${Q}. Cần thêm điều kiện nào để d là đường trung trực của ${P}${Q}?`,`d ⊥ ${P}${Q}`,[[`d đi qua ${P}`,`Khi đó d trùng với đường thẳng ${P}${Q}, không phải đường trung trực.`],[`${O}${P} = ${O}${Q}`,`Điều này đã có vì ${O} là trung điểm; cần thêm điều kiện vuông góc.`],[`d cắt ${P}${Q}`,`d đã cắt ${P}${Q} tại ${O}; cần thêm điều kiện vuông góc.`]],`Đường trung trực phải vuông góc với đoạn thẳng tại trung điểm. d đã đi qua trung điểm ${O}, cần thêm d ⊥ ${P}${Q}.`);
  return mk(`Đường thẳng d vuông góc với đoạn thẳng ${P}${Q} tại ${O}, ${O} nằm giữa ${P} và ${Q}. Cần thêm điều kiện nào để d là đường trung trực của ${P}${Q}?`,`${O}${P} = ${O}${Q}`,[[`d đi qua ${P}`,`d đã cắt ${P}${Q} tại ${O}, không thể đi qua ${P}.`],[`${O}${P} = ${P}${Q}`,`${O} nằm giữa ${P}, ${Q} nên ${O}${P} nhỏ hơn ${P}${Q}; điều kiện đúng là ${O}${P} = ${O}${Q}.`],[`d cắt ${P}${Q}`,`Điều này đã có; cần ${O} là trung điểm của ${P}${Q}.`]],`d đã vuông góc với ${P}${Q} tại ${O}, cần thêm ${O} là trung điểm của ${P}${Q}, tức là ${O}${P} = ${O}${Q}.`);
}
/* --- Tính chất đường trung trực --- */
function gCtProp(){
  const [P,Q,,M]=sel(SEGS);
  return mk(`Điểm ${M} nằm trên đường trung trực của đoạn thẳng ${P}${Q}. Khẳng định nào sau đây đúng?`,`${M}${P} = ${M}${Q}`,[[`${M}${P} = ${P}${Q}`,`Không có cơ sở; tính chất là ${M} cách đều hai mút ${P} và ${Q}.`],[`${M} là trung điểm của ${P}${Q}`,`Chỉ đúng khi ${M} nằm trên đoạn ${P}${Q}; nói chung ${M} không nằm trên ${P}${Q}.`],[`${M}${P} ⊥ ${P}${Q}`,`Đường trung trực vuông góc với ${P}${Q}, còn ${M}${P} nói chung không vuông góc với ${P}${Q}.`]],`Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai mút của đoạn thẳng đó: ${M}${P} = ${M}${Q}.`);
}
function gCtLen(){return retry(()=>{
  const [P,Q,,M]=sel(SEGS),x=ri(3,15),y=ri(2,2*x-1);
  const w=pick3(`${x} cm`,[[`${2*x} cm`,`${M}${Q} bằng ${M}${P}, không gấp đôi.`],[`${y} cm`,`${y} cm là độ dài ${P}${Q}, không phải ${M}${Q}.`],[x%2===0?`${x/2} cm`:`${x+1} cm`,`${M}${Q} = ${M}${P} = ${x} cm.`],[`${x+2} cm`,`${M}${Q} = ${M}${P} = ${x} cm.`]]);
  if(!w)return null;
  return mk(`Điểm ${M} nằm trên đường trung trực của đoạn thẳng ${P}${Q}. Biết ${M}${P} = ${x} cm, ${P}${Q} = ${y} cm. Độ dài ${M}${Q} là:`,`${x} cm`,w,`${M} nằm trên đường trung trực của ${P}${Q} nên ${M}${Q} = ${M}${P} = ${x} cm.`);
});}
function gCtAng(){
  const [P,Q,,M]=sel(SEGS);let x;do{x=ri(25,80);}while(x===60||x===45);
  return mk(`Điểm ${M} nằm trên đường trung trực của đoạn thẳng ${P}${Q} (${M} không thuộc ${P}${Q}). Biết ∠${M}${P}${Q} = ${x}°. Số đo ∠${M}${Q}${P} là:`,g(x),[[g(180-2*x),`${180-2*x}° là số đo ∠${P}${M}${Q}.`],[g(90-x),`Hai góc này bằng nhau chứ không phụ nhau.`],[g(180-x),`Hai góc này bằng nhau chứ không kề bù.`]],`${M}${P} = ${M}${Q} nên Δ${M}${P}${Q} cân tại ${M}, suy ra ∠${M}${Q}${P} = ∠${M}${P}${Q} = ${x}°.`);
}
function gCtApex(){return retry(()=>{
  const [P,Q,,M]=sel(SEGS),y=2*ri(10,80);if(y===60)return null;const z=(180-y)/2;
  const w=pick3(g(z),[[g(180-y),'Quên chia 2.'],[g(y),'Góc ở đáy không nhất thiết bằng góc ở đỉnh.'],[g(90-y),'Nhầm công thức; góc ở đáy = (180° − góc ở đỉnh) : 2.'],[g(180-2*y),'Nhầm công thức; góc ở đáy = (180° − góc ở đỉnh) : 2.']].filter(q=>parseFloat(q[0])>0));
  if(!w)return null;
  return mk(`Điểm ${M} nằm trên đường trung trực của đoạn thẳng ${P}${Q} (${M} không thuộc ${P}${Q}). Biết ∠${P}${M}${Q} = ${y}°. Số đo ∠${M}${P}${Q} là:`,g(z),w,`${M}${P} = ${M}${Q} nên Δ${M}${P}${Q} cân tại ${M}: ∠${M}${P}${Q} = ∠${M}${Q}${P} = (180° − ${y}°) : 2 = ${z}°.`);
});}
function gCtEq(){
  const [P,Q,,M]=sel(SEGS),x=ri(3,12);
  return mk(`Điểm ${M} nằm trên đường trung trực của đoạn thẳng ${P}${Q}. Biết ${M}${P} = ${x} cm và ∠${M}${P}${Q} = 60°. Độ dài ${P}${Q} là:`,`${x} cm`,[[`${2*x} cm`,`Δ${M}${P}${Q} là tam giác đều nên ${P}${Q} = ${M}${P}, không gấp đôi.`],[`${nf(x/2)} cm`,`${nf(x/2)} cm là độ dài ${O_(P,Q)}, một nửa ${P}${Q}.`],['Không tính được',`Tính được: Δ${M}${P}${Q} cân tại ${M} có một góc 60° nên là tam giác đều.`]],`${M}${P} = ${M}${Q} nên Δ${M}${P}${Q} cân tại ${M}, có ∠${M}${P}${Q} = 60° nên là tam giác đều. Vậy ${P}${Q} = ${M}${P} = ${x} cm.`,{fig:fb(figPB({lab:[P,Q,'',M],tick:false,tA:'60°',tMA:x+' cm',alt:`Điểm ${M} trên đường trung trực của ${P}${Q}`}))});
}
const O_=(P,Q)=>`một nửa đoạn ${P}${Q}`;
function gCtPer(){return retry(()=>{
  const [P,Q,,M]=sel(SEGS),x=ri(3,12),y=ri(2,2*x-1);
  const w=pick3(`${2*x+y} cm`,[[`${x+y} cm`,`Quên cạnh ${M}${Q} = ${x} cm.`],[`${2*x+2*y} cm`,`Cạnh ${P}${Q} chỉ tính một lần.`],[`${3*x} cm`,`${P}${Q} = ${y} cm, không bằng ${M}${P}.`],[`${x+2*y} cm`,`${M}${Q} = ${M}${P} = ${x} cm, không phải ${y} cm.`]]);
  if(!w)return null;
  return mk(`Điểm ${M} nằm trên đường trung trực của đoạn thẳng ${P}${Q}, ${M}${P} = ${x} cm, ${P}${Q} = ${y} cm. Chu vi Δ${M}${P}${Q} là:`,`${2*x+y} cm`,w,`${M}${Q} = ${M}${P} = ${x} cm. Chu vi Δ${M}${P}${Q} = ${x} + ${x} + ${y} = ${2*x+y} cm.`);
});}
function gCtTri(){return retry(()=>{
  const p=ri(4,12),q=ri(p+2,p+12);
  const w=pick3(`${p+q} cm`,[[`${p+q/2} cm`.replace('.',','),'D không phải trung điểm của AC; dùng DB = DC: AD + DB = AD + DC = AC.'],[`${2*p+q} cm`,'Cạnh AB chỉ tính một lần.'],[`${p+2*q} cm`,'AD + DB = AC, không phải 2 · AC.'],[`${q} cm`,'Quên cạnh AB.']]);
  if(!w)return null;
  return mk(`Cho ΔABC có AB = ${p} cm, AC = ${q} cm. Đường trung trực của BC cắt AC tại D (như hình). Chu vi ΔABD là:`,`${p+q} cm`,w,`D nằm trên đường trung trực của BC nên DB = DC. Chu vi ΔABD = AB + AD + DB = AB + AD + DC = AB + AC = ${p} + ${q} = ${p+q} cm.`,{fig:fb(figTrung())});
});}
function gCtAng2(){return retry(()=>{
  const c=ri(20,50),b=ri(c+10,Math.min(110,140-c)),z=b-c;
  const w=pick3(g(z),[[g(c),`${c}° là số đo ∠DBC, không phải ∠ABD.`],[g(180-b-c),`${180-b-c}° là số đo ∠A.`],[g(b),`${b}° là số đo cả góc ABC.`],[g(b+c),'∠ABD = ∠ABC − ∠DBC, phải trừ chứ không cộng.']].filter(q=>parseFloat(q[0])>0));
  if(!w)return null;
  return mk(`Cho ΔABC có ∠ABC = ${b}°, ∠ACB = ${c}°. Đường trung trực của BC cắt AC tại D (như hình). Số đo ∠ABD là:`,g(z),w,`DB = DC (D thuộc đường trung trực của BC) nên ΔDBC cân tại D: ∠DBC = ∠DCB = ${c}°. Vậy ∠ABD = ∠ABC − ∠DBC = ${b}° − ${c}° = ${z}°.`,{fig:fb(figTrung(b,c))});
});}
[['g_dnname','dn','NB',gDnName],['g_dnapex','dn','NB',gDnApex],['g_dnsides','dn','TH',gDnSides],['g_dncount','dn','TH',gDnCount],
 ['g_tcprop','tc','NB',gTcProp],['g_tcother','tc','NB',gTcOther],['g_tcconv','tc','NB',gTcConv],['g_tcapex','tc','TH',gTcApex],['g_tcbase','tc','TH',gTcBase],['g_tcconv2','tc','TH',gTcConv2,{mix:[12]}],
 ['g_tcalt','tc','VD',gTcAlt,{mix:[12,15]}],['g_tcext','tc','VD',gTcExt,{mix:[12]}],['g_tcade','tc','VD',gTcADE,{mix:[14]}],
 ['g_ttcand','tt','NB',gTtCand],['g_ttmid','tt','NB',gTtMid],['g_ttgrid','tt','TH',gTtGrid],['g_ttcond','tt','TH',gTtCond],
 ['g_ctprop','ct','NB',gCtProp],['g_ctlen','ct','NB',gCtLen],['g_ctang','ct','TH',gCtAng],['g_ctapex','ct','TH',gCtApex],['g_ctper','ct','TH',gCtPer],
 ['g_cteq','ct','VD',gCtEq],['g_cttri','ct','VD',gCtTri],['g_ctang2','ct','VD',gCtAng2]
].forEach(([id,t,l,f,x])=>addMC(id,t,l,f,x));

/* ============ Câu đúng sai ============ */
const tfOK=its=>{const k=its.filter(i=>i.v).length;return k>=1&&k<=3&&new Set(its.map(i=>i.t)).size===its.length;};
/* ý đúng/sai: v quyết định dùng câu đúng tt hay câu sai ff */
const IT=(v,tt,ff,tp,lv,et,ef)=>({t:v?tt:ff,v,topic:tp,level:lv,exp:v?et:ef});
function tfLoop(f){for(let n=0;n<200;n++){const u=[0,1,2,3].map(()=>RNG()<.5),r=f(u);if(r&&tfOK(r.items))return r;}throw new Error('TF');}
const TRIP=[[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17]];
const TF=[
 {id:'ts_dn',type:'tf',topic:'dn',level:'NB',stem:'Xét các phát biểu về tam giác cân và tam giác đều.',items:[
   {t:'Tam giác cân là tam giác có hai cạnh bằng nhau.',v:true,topic:'dn',level:'NB',exp:'Đúng theo định nghĩa tam giác cân.'},
   {t:'Tam giác đều cũng là tam giác cân.',v:true,topic:'dn',level:'NB',exp:'Tam giác đều có ba cạnh bằng nhau, nên có hai cạnh bằng nhau: đó là tam giác cân.'},
   {t:'Mọi tam giác cân đều là tam giác đều.',v:false,topic:'dn',level:'NB',exp:'Tam giác có các cạnh 5 cm, 5 cm, 3 cm là tam giác cân nhưng không đều.'},
   {t:'Trong tam giác ABC cân tại A, BC là cạnh bên.',v:false,topic:'dn',level:'NB',exp:'AB và AC là hai cạnh bên, BC là cạnh đáy.'}]},
 {id:'ts_tc',type:'tf',topic:'tc',level:'NB',stem:'Xét các phát biểu về tính chất của tam giác cân.',items:[
   {t:'Trong một tam giác cân, hai góc ở đáy bằng nhau.',v:true,topic:'tc',level:'NB',exp:'Đúng: đây là tính chất của tam giác cân.'},
   {t:'Tam giác có hai góc bằng nhau là tam giác cân.',v:true,topic:'tc',level:'NB',exp:'Đúng: đây là chiều ngược lại của tính chất trên.'},
   {t:'Trong một tam giác cân, góc ở đỉnh luôn bằng góc ở đáy.',v:false,topic:'tc',level:'NB',exp:'Chỉ hai góc ở đáy bằng nhau; góc ở đỉnh bằng góc ở đáy chỉ khi tam giác đều.'},
   {t:'Tam giác đều có mỗi góc bằng 90°.',v:false,topic:'dn',level:'NB',exp:'Ba góc của tam giác đều bằng nhau và có tổng 180° nên mỗi góc bằng 60°.'}]},
 {id:'ts_tt',type:'tf',topic:'tt',level:'NB',stem:'Xét các phát biểu về đường trung trực của một đoạn thẳng.',items:[
   {t:'Đường thẳng vuông góc với một đoạn thẳng tại trung điểm của nó là đường trung trực của đoạn thẳng đó.',v:true,topic:'tt',level:'NB',exp:'Đúng theo định nghĩa.'},
   {t:'Mọi đường thẳng đi qua trung điểm của một đoạn thẳng đều là đường trung trực của đoạn thẳng đó.',v:false,topic:'tt',level:'NB',exp:'Còn cần điều kiện vuông góc với đoạn thẳng.'},
   {t:'Đường trung trực của một đoạn thẳng cũng là trục đối xứng của đoạn thẳng đó.',v:true,topic:'tt',level:'NB',exp:'Đúng: gấp giấy theo đường trung trực thì hai mút trùng nhau.'},
   {t:'Đường thẳng vuông góc với đoạn thẳng AB tại A là đường trung trực của AB.',v:false,topic:'tt',level:'NB',exp:'Đường trung trực vuông góc với AB tại trung điểm, không phải tại đầu mút A.'}]},
 {id:'ts_ct',type:'tf',topic:'ct',level:'NB',stem:'Cho đoạn thẳng AB và đường trung trực d của nó. Xét các phát biểu sau.',items:[
   {t:'Mọi điểm nằm trên d đều cách đều hai điểm A và B.',v:true,topic:'ct',level:'NB',exp:'Đúng: điểm nằm trên đường trung trực của đoạn thẳng thì cách đều hai mút.'},
   {t:'Điểm M nằm trên d thì MA = AB.',v:false,topic:'ct',level:'NB',exp:'Tính chất là MA = MB, không phải MA = AB.'},
   {t:'Điểm N có NA = NB thì N nằm trên d.',v:true,topic:'ct',level:'NB',exp:'Đường trung trực của AB là tập hợp tất cả các điểm cách đều A và B.'},
   {t:'Trung điểm của AB không nằm trên d.',v:false,topic:'ct',level:'NB',exp:'d đi qua trung điểm của AB (vuông góc với AB tại trung điểm).'}]}
];
const addTF=(id,topic,level,gen,extra)=>TF.push(Object.assign({id,type:'tf',topic,level,gen},extra||{}));
function tfDnG(){const t=T3(),{a,b,c,n}=t;let x,y;do{x=ri(3,12);y=ri(2,2*x-1);}while(y===x);
  return tfLoop(u=>({stem:`Cho ${n} có ${a}${b} = ${a}${c} = ${x} cm và ${b}${c} = ${y} cm.`,items:[
    IT(u[0],`${n} cân tại ${a}.`,`${n} cân tại ${b}.`,'dn','NB',`${a}${b} = ${a}${c} nên tam giác cân tại đỉnh chung ${a}.`,`Hai cạnh bằng nhau ${a}${b}, ${a}${c} có đỉnh chung là ${a}, nên tam giác cân tại ${a}, không phải ${b}.`),
    IT(u[1],`${b}${c} là cạnh đáy.`,`${a}${b} là cạnh đáy.`,'dn','NB',`Cạnh đáy là cạnh đối diện với đỉnh ${a}: ${b}${c}.`,`${a}${b} là cạnh bên; cạnh đáy là ${b}${c}.`),
    IT(u[2],`∠${b} = ∠${c}.`,`∠${a} = ∠${b}.`,'tc','TH',`Hai góc ở đáy của tam giác cân bằng nhau.`,`∠${a} là góc ở đỉnh, ∠${b} là góc ở đáy; chúng không nhất thiết bằng nhau (ba cạnh không bằng nhau nên tam giác không đều).`),
    IT(u[3],`Chu vi ${n} bằng ${2*x+y} cm.`,`Chu vi ${n} bằng ${x+y} cm.`,'dn','TH',`Chu vi = ${x} + ${x} + ${y} = ${2*x+y} cm.`,`Chu vi = ${x} + ${x} + ${y} = ${2*x+y} cm (phải tính cả hai cạnh bên).`)]}));}
function tfTcG(){const t=T3(),{a,b,c,n}=t;let y;do{y=2*ri(10,75);}while(y===60||y===90);const z=(180-y)/2;
  return tfLoop(u=>({stem:`Cho ${n} cân tại ${a} có ∠${a} = ${y}°.`,items:[
    IT(u[0],`∠${b} = ∠${c}.`,`∠${a} = ∠${b}.`,'tc','NB','Hai góc ở đáy bằng nhau.',`∠${a} = ${y}° còn ∠${b} = ${z}°.`),
    IT(u[1],`∠${b} + ∠${c} = ${180-y}°.`,`∠${b} + ∠${c} = ${y}°.`,'tc','TH',`Tổng ba góc bằng 180° nên ∠${b} + ∠${c} = 180° − ${y}° = ${180-y}°.`,`∠${b} + ∠${c} = 180° − ${y}° = ${180-y}°.`),
    IT(u[2],`∠${c} = ${z}°.`,`∠${c} = ${180-y}°.`,'tc','TH',`∠${c} = ${180-y}° : 2 = ${z}°.`,`${180-y}° là tổng hai góc ở đáy; ∠${c} = ${180-y}° : 2 = ${z}°.`),
    IT(u[3],`${a}${b} = ${a}${c}.`,`${b}${c} = ${a}${b}.`,'dn','NB',`Hai cạnh bên bằng nhau.`,`${b}${c} là cạnh đáy, không nhất thiết bằng cạnh bên.`)]}));}
function tfTtG(){const [P,Q,O,M]=sel(SEGS),x=2*ri(3,10),m=ri(x/2+1,x+4);
  return tfLoop(u=>({stem:`Đường thẳng d là đường trung trực của đoạn thẳng ${P}${Q}, cắt ${P}${Q} tại ${O}. Biết ${P}${Q} = ${x} cm. Điểm ${M} nằm trên d và ${M}${P} = ${m} cm.`,items:[
    IT(u[0],`${O}${P} = ${x/2} cm.`,`${O}${P} = ${x} cm.`,'tt','NB',`${O} là trung điểm của ${P}${Q} nên ${O}${P} = ${x} : 2 = ${x/2} cm.`,`${O} là trung điểm nên ${O}${P} = ${x/2} cm.`),
    IT(u[1],`d ⊥ ${P}${Q}.`,`d song song với ${P}${Q}.`,'tt','NB','Đường trung trực vuông góc với đoạn thẳng tại trung điểm.',`d cắt và vuông góc với ${P}${Q} tại ${O}, không song song.`),
    IT(u[2],`${M}${Q} = ${m} cm.`,`${M}${Q} = ${x-m>0?x-m:m+x} cm.`,'ct','TH',`${M} nằm trên đường trung trực nên ${M}${Q} = ${M}${P} = ${m} cm.`,`${M}${Q} = ${M}${P} = ${m} cm.`),
    IT(u[3],`Chu vi Δ${M}${P}${Q} bằng ${2*m+x} cm.`,`Chu vi Δ${M}${P}${Q} bằng ${m+x} cm.`,'ct','TH',`Chu vi = ${m} + ${m} + ${x} = ${2*m+x} cm.`,`Chu vi = ${M}${P} + ${M}${Q} + ${P}${Q} = ${m} + ${m} + ${x} = ${2*m+x} cm.`)]}));}
function tfCtG(){const [P,Q,,M]=sel(SEGS);let x;do{x=ri(25,80);}while(x===60||x===45);
  return tfLoop(u=>({stem:`Điểm ${M} nằm trên đường trung trực của đoạn thẳng ${P}${Q} (${M} không thuộc ${P}${Q}), ∠${M}${P}${Q} = ${x}°.`,items:[
    IT(u[0],`Δ${M}${P}${Q} cân tại ${M}.`,`Δ${M}${P}${Q} cân tại ${P}.`,'ct','NB',`${M}${P} = ${M}${Q} nên tam giác cân tại ${M}.`,`${M}${P} = ${M}${Q} nên tam giác cân tại ${M}, không phải ${P}.`),
    IT(u[1],`∠${M}${Q}${P} = ${x}°.`,`∠${M}${Q}${P} = ${90-x}°.`,'ct','TH',`Hai góc ở đáy bằng nhau.`,`∠${M}${Q}${P} = ∠${M}${P}${Q} = ${x}° (hai góc ở đáy).`),
    IT(u[2],`∠${P}${M}${Q} = ${180-2*x}°.`,`∠${P}${M}${Q} = ${180-x}°.`,'ct','TH',`∠${P}${M}${Q} = 180° − 2 · ${x}° = ${180-2*x}°.`,`Phải trừ cả hai góc ở đáy: 180° − 2 · ${x}° = ${180-2*x}°.`),
    {t:`Δ${M}${P}${Q} là tam giác đều.`,v:false,topic:'tc',level:'TH',exp:`Các góc là ${x}°, ${x}°, ${180-2*x}°, không bằng nhau nên không phải tam giác đều.`}]}));}
function tfAH(){const [hb,ah,c0]=(()=>{const tr=sel(TRIP),s=RNG()<.5;return[s?tr[0]:tr[1],s?tr[1]:tr[0],tr[2]];})();
  return tfLoop(u=>({stem:`Cho ΔABC cân tại A có AB = ${c0} cm, AH ⊥ BC tại H, AH = ${ah} cm, HB = ${hb} cm (như hình).`,items:[
    IT(u[0],'ΔAHB = ΔAHC theo trường hợp cạnh huyền – cạnh góc vuông.','ΔAHB = ΔAHC theo trường hợp hai cạnh góc vuông.','tt','TH','Hai tam giác vuông tại H có cạnh huyền AB = AC và cạnh góc vuông AH chung.','Chưa biết HB = HC nên chưa dùng được trường hợp hai cạnh góc vuông; dùng cạnh huyền AB = AC và cạnh góc vuông AH chung.'),
    IT(u[1],`HC = ${hb} cm.`,`HC = ${ah} cm.`,'tt','TH',`ΔAHB = ΔAHC nên HC = HB = ${hb} cm.`,`HC = HB = ${hb} cm (cạnh tương ứng), không phải ${ah} cm.`),
    IT(u[2],'AH là đường trung trực của BC.','AH là đường trung trực của AB.','tt','VD','AH ⊥ BC tại H và H là trung điểm BC.','AH không vuông góc với AB; AH là đường trung trực của BC.'),
    IT(u[3],`Chu vi ΔABC bằng ${2*c0+2*hb} cm.`,`Chu vi ΔABC bằng ${2*c0+hb} cm.`,'tt','VD',`BC = 2 · ${hb} = ${2*hb} cm; chu vi = ${c0} + ${c0} + ${2*hb} = ${2*c0+2*hb} cm.`,`BC = HB + HC = ${2*hb} cm, chu vi = ${c0} + ${c0} + ${2*hb} = ${2*c0+2*hb} cm.`)]}));}
function tfADE(){let a;do{a=2*ri(15,60);}while(a===60);const z=(180-a)/2;
  return tfLoop(u=>({stem:`Cho ΔABC cân tại A có ∠A = ${a}°. Lấy D trên cạnh AB, E trên cạnh AC sao cho AD = AE (như hình).`,fig:fb(figADE(a)),items:[
    IT(u[0],'ΔADE cân tại A.','ΔADE cân tại D.','dn','NB','AD = AE nên ΔADE cân tại A.','AD = AE nên ΔADE cân tại A, không phải tại D.'),
    IT(u[1],`∠ADE = ${z}°.`,`∠ADE = ${a}°.`,'tc','TH',`∠ADE = (180° − ${a}°) : 2 = ${z}°.`,`∠ADE là góc ở đáy của ΔADE: (180° − ${a}°) : 2 = ${z}°.`),
    IT(u[2],'BE = CD.','BE = BC.','tc','VD','ΔABE = ΔACD (c.g.c: AB = AC, ∠A chung, AE = AD) nên BE = CD.','Không có cơ sở để BE = BC; điều đúng là BE = CD (vì ΔABE = ΔACD).'),
    IT(u[3],'DE ∥ BC.','DE ⊥ AB.','tc','VD',`∠ADE = ∠ABC = ${z}° ở vị trí đồng vị nên DE ∥ BC.`,`∠ADE = ${z}° khác 90° nên DE không vuông góc với AB.`)]}));}
function tfHouse(){let b;do{b=ri(25,75);}while(b===60||b===45);
  return tfLoop(u=>({stem:`Mặt trước một ngôi nhà mái chữ A là tam giác ABC cân tại A: hai mái AB = AC, nền BC nằm ngang, mái AB tạo với nền góc ∠ABC = ${b}°.`,items:[
    IT(u[0],`Mái AC cũng tạo với nền góc ${b}°.`,`Mái AC tạo với nền góc ${90-b}°.`,'tc','NB',`∠ACB = ∠ABC = ${b}° (hai góc ở đáy).`,`∠ACB = ∠ABC = ${b}° (hai góc ở đáy), không phải ${90-b}°.`),
    IT(u[1],`Góc ở đỉnh mái ∠BAC = ${180-2*b}°.`,`Góc ở đỉnh mái ∠BAC = ${180-b}°.`,'tc','TH',`∠BAC = 180° − 2 · ${b}° = ${180-2*b}°.`,`Phải trừ cả hai góc ở đáy: 180° − 2 · ${b}° = ${180-2*b}°.`),
    IT(u[2],'Muốn góc ở đỉnh mái nhỏ hơn 60° thì góc giữa mái và nền phải lớn hơn 60°.','Muốn góc ở đỉnh mái nhỏ hơn 60° thì góc giữa mái và nền phải nhỏ hơn 60°.','tc','VD','Góc ở đỉnh = 180° − 2 · góc ở đáy. Góc ở đỉnh nhỏ hơn 60° khi 2 · góc ở đáy lớn hơn 120°, tức là góc ở đáy lớn hơn 60°.','Góc ở đỉnh = 180° − 2 · góc ở đáy, nên góc ở đáy càng lớn thì góc ở đỉnh càng nhỏ. Góc ở đỉnh nhỏ hơn 60° khi góc ở đáy lớn hơn 60°.'),
    IT(u[3],'Đỉnh mái A nằm trên đường trung trực của nền BC.','Đỉnh mái A nằm trên đường thẳng vuông góc với BC tại B.','ct','VD','AB = AC nên A cách đều B và C, do đó A nằm trên đường trung trực của BC.','AB = AC nên A nằm trên đường trung trực của BC (vuông góc với BC tại trung điểm), không phải tại B.')]}));}
function tfWell(){const d=2*ri(4,12),m=ri(d/2+2,d+5),k=ri(2,6);
  return tfLoop(u=>({stem:`Hai nhà A và B cách nhau ${d} m. Người ta đào một giếng M cách đều hai nhà, MA = ${m} m, và đặt một vòi nước O ở trung điểm của AB.`,items:[
    IT(u[0],'M nằm trên đường trung trực của đoạn thẳng AB.','M là trung điểm của đoạn thẳng AB.','ct','NB','MA = MB nên M nằm trên đường trung trực của AB.',`Trung điểm của AB là O (cách A ${d/2} m); M cách A ${m} m nên M không phải trung điểm AB.`),
    IT(u[1],`Giếng cách nhà B ${m} m.`,`Giếng cách nhà B ${d-m>0?d-m:d+m} m.`,'ct','TH',`MB = MA = ${m} m.`,`MB = MA = ${m} m.`),
    IT(u[2],'Đường thẳng MO vuông góc với AB.','Đường thẳng MO song song với AB.','tt','VD','M và O đều cách đều A, B nên MO là đường trung trực của AB, vuông góc với AB.','MO là đường trung trực của AB nên vuông góc (không song song) với AB.'),
    IT(u[3],`Đặt ống nước từ M đến mỗi nhà, mỗi mét ống giá ${k}0 nghìn đồng, tổng tiền ống là ${2*m*k}0 nghìn đồng.`,`Đặt ống nước từ M đến mỗi nhà, mỗi mét ống giá ${k}0 nghìn đồng, tổng tiền ống là ${m*k}0 nghìn đồng.`,'ct','VD',`Hai ống dài ${m} + ${m} = ${2*m} m, giá ${2*m} · ${k}0 = ${2*m*k}0 nghìn đồng.`,`Phải đặt hai ống MA và MB: ${2*m} m, giá ${2*m} · ${k}0 = ${2*m*k}0 nghìn đồng.`)]}));}
function tfTrung(){const c=ri(20,50);let b;do{b=ri(c+10,Math.min(110,140-c));}while(b===90);
  return tfLoop(u=>({stem:`Cho ΔABC có ∠ABC = ${b}°, ∠ACB = ${c}°. Đường trung trực của BC cắt AC tại D (như hình).`,fig:fb(figTrung(b,c)),items:[
    IT(u[0],'DB = DC.','DB = DA.','ct','NB','D nằm trên đường trung trực của BC nên DB = DC.',`D nằm trên đường trung trực của BC (không phải của AB), nên DB = DC. Ở đây ∠DAB = ${180-b-c}° khác ∠DBA = ${b-c}° nên DB khác DA.`),
    IT(u[1],`∠DBC = ${c}°.`,`∠DBC = ${b}°.`,'ct','TH',`ΔDBC cân tại D nên ∠DBC = ∠DCB = ${c}°.`,`∠DBC = ∠DCB = ${c}°; ${b}° là cả góc ABC.`),
    IT(u[2],`∠ABD = ${b-c}°.`,`∠ABD = ${b+c}°.`,'ct','VD',`∠ABD = ∠ABC − ∠DBC = ${b}° − ${c}° = ${b-c}°.`,`∠ABD = ∠ABC − ∠DBC = ${b}° − ${c}° = ${b-c}°.`),
    IT(u[3],`∠ADB = ${2*c}°.`,`∠ADB = ${c}°.`,'ct','VD',`∠BDC = 180° − 2 · ${c}° = ${180-2*c}°; ∠ADB kề bù với ∠BDC nên ∠ADB = 180° − ${180-2*c}° = ${2*c}°.`,`∠BDC = 180° − 2 · ${c}° = ${180-2*c}°, nên ∠ADB = 180° − ${180-2*c}° = ${2*c}°, không phải ${c}°.`)]}));}
addTF('tf_dng','dn','NB',tfDnG);
addTF('tf_tcg','tc','TH',tfTcG);
addTF('tf_ttg','tt','TH',tfTtG);
addTF('tf_ctg','ct','TH',tfCtG);
addTF('tf_ah','tt','VD',tfAH,{mix:[15],fig:fb(figIso({foot:'H',alt:'Tam giác ABC cân tại A, AH vuông góc với BC tại H'}))});
addTF('tf_ade','tc','VD',tfADE,{mix:[14],fig:fb(figADE())});
addTF('tf_house','tc','VD',tfHouse);
addTF('tf_well','ct','VD',tfWell);
addTF('tf_trung','ct','VD',tfTrung,{fig:fb(figTrung())});

/* ============ Câu trả lời ngắn ============ */
const SA=[];
const addSA=(id,topic,level,unit,gen,extra)=>SA.push(Object.assign({id,type:'sa',topic,level,unit,gen},extra||{}));
const sq=(stem,ans,exp,extra)=>Object.assign({stem,ans:[ans],exp},extra||{});
function saDn1(){const {a,b,c,n}=T3();let x,y;do{x=ri(3,15);y=ri(2,2*x-1);}while(y===x);
  return sq(`Cho ${n} cân tại ${a} có ${a}${b} = ${x} cm, ${b}${c} = ${y} cm. Tính độ dài ${a}${c} (cm).`,x,`${n} cân tại ${a} nên hai cạnh bên bằng nhau: ${a}${c} = ${a}${b} = ${x} cm.`);}
function saDn2(){let x,y;do{x=ri(3,15);y=ri(2,2*x-1);}while(y===x);
  return sq(`Một tam giác cân có cạnh bên dài ${x} cm và cạnh đáy dài ${y} cm. Tính chu vi của tam giác đó (cm).`,2*x+y,`Hai cạnh bên bằng nhau, mỗi cạnh ${x} cm. Chu vi = ${x} + ${x} + ${y} = ${2*x+y} cm.`);}
function saDn3(){const s=ri(3,25);
  return sq(`Một tam giác đều có chu vi ${3*s} cm. Tính độ dài mỗi cạnh của tam giác đó (cm).`,s,`Tam giác đều có ba cạnh bằng nhau nên mỗi cạnh dài ${3*s} : 3 = ${s} cm.`);}
function saDn4(){const x=ri(6,20),k=ri(1,x-2),p=3*x-k;
  return sq(`Bạn Lan dùng hết một sợi dây dài ${p} cm uốn thành một khung tam giác cân, trong đó cạnh đáy ngắn hơn mỗi cạnh bên ${k} cm. Tính độ dài mỗi cạnh bên (cm).`,x,`Gọi độ dài cạnh bên là x (cm) thì cạnh đáy là x − ${k}. Ta có x + x + (x − ${k}) = ${p}, nên 3x = ${p+k}, x = ${x}. Mỗi cạnh bên dài ${x} cm (cạnh đáy ${x-k} cm).`);}
function saTc1(){const {a,b,c,n}=T3(),x=ri(25,85);
  return sq(`Cho ${n} cân tại ${a} có ∠${b} = ${x}°. Tính số đo ∠${c} (độ).`,x,`Hai góc ở đáy của tam giác cân bằng nhau: ∠${c} = ∠${b} = ${x}°.`);}
function saTc2(){const {a,b,c,n}=T3(),y=2*ri(10,80),z=(180-y)/2;
  return sq(`Cho ${n} cân tại ${a} có ∠${a} = ${y}°. Tính số đo ∠${b} (độ).`,z,`∠${b} = ∠${c} và ∠${b} + ∠${c} = 180° − ${y}° = ${180-y}°. Vậy ∠${b} = ${180-y}° : 2 = ${z}°.`);}
function saTc3(){const {a,b,c,n}=T3(),x=ri(25,85);
  return sq(`Cho ${n} cân tại ${a} có ∠${c} = ${x}°. Tính số đo ∠${a} (độ).`,180-2*x,`∠${b} = ∠${c} = ${x}°. Vậy ∠${a} = 180° − 2 · ${x}° = ${180-2*x}°.`);}
function saTc4(){const a=4*ri(5,35),B=(180-a)/2;
  return sq(`Cho ΔABC cân tại A có ∠BAC = ${a}°. Trên tia đối của tia BC lấy điểm D sao cho BD = BA (như hình). Tính số đo ∠ADB (độ).`,B/2,`∠ABC = (180° − ${a}°) : 2 = ${B}°; ∠ABD = 180° − ${B}° = ${180-B}° (kề bù). ΔABD cân tại B nên ∠ADB = (180° − ${180-B}°) : 2 = ${B/2}°.`,{fig:fb(figExt(false,a))});}
function saTc5(){let a;do{a=2*ri(20,38);}while(a===60);const C=(180-a)/2;
  return sq(`Cho ΔABC cân tại A có ∠A = ${a}°, BH ⊥ AC tại H, CK ⊥ AB tại K (như hình). Tính số đo ∠HBC (độ).`,a/2,`∠C = (180° − ${a}°) : 2 = ${C}°. ΔHBC vuông tại H nên ∠HBC = 90° − ${C}° = ${a/2}°.`,{fig:fb(figAlt(a))});}
function saTt1(){const [P,Q,O]=sel(SEGS),x=2*ri(3,15);
  return sq(`Đường thẳng d là đường trung trực của đoạn thẳng ${P}${Q} và cắt ${P}${Q} tại ${O}. Biết ${P}${Q} = ${x} cm. Tính độ dài ${O}${Q} (cm).`,x/2,`${O} là trung điểm của ${P}${Q} nên ${O}${Q} = ${x} : 2 = ${x/2} cm.`);}
function saTt2(){const x=ri(5,19),r=Math.floor(x/2)+1;
  return sq(`Để vẽ đường trung trực của đoạn thẳng AB dài ${x} cm bằng compa, ta vẽ hai cung tròn tâm A và tâm B có cùng bán kính r (r lớn hơn AB/2). Nếu r là một số tự nhiên (đơn vị cm) thì r nhỏ nhất bằng bao nhiêu xăng-ti-mét?`,r,`r phải lớn hơn ${x} : 2 = ${nf(x/2)} cm. Số tự nhiên nhỏ nhất lớn hơn ${nf(x/2)} là ${r}. Vậy r = ${r} cm.`);}
function saTt3(){const tr=sel(TRIP),s=RNG()<.5,ah=s?tr[0]:tr[1],hb=s?tr[1]:tr[0],c=tr[2];
  return sq(`Cho ΔABC cân tại A có AB = ${c} cm, BC = ${2*hb} cm, AH ⊥ BC tại H và AH = ${ah} cm (như hình). Tính chu vi ΔAHC (cm).`,ah+hb+c,`ΔAHB = ΔAHC (cạnh huyền AB = AC, cạnh góc vuông AH chung) nên HC = HB = ${2*hb} : 2 = ${hb} cm. AC = AB = ${c} cm. Chu vi ΔAHC = ${ah} + ${hb} + ${c} = ${ah+hb+c} cm.`);}
function saTt4(){const [P,Q,O]=sel(SEGS),x=2*ri(3,15);
  return sq(`Cho đoạn thẳng ${P}${Q} = ${x} cm. Hai điểm M, N nằm khác phía đối với ${P}${Q} sao cho M${P} = M${Q} và N${P} = N${Q}. Đường thẳng MN cắt ${P}${Q} tại ${O}. Tính độ dài ${O}${P} (cm).`,x/2,`M và N đều cách đều ${P}, ${Q} nên cùng nằm trên đường trung trực của ${P}${Q}; vậy MN là đường trung trực của ${P}${Q} và ${O} là trung điểm của ${P}${Q}. ${O}${P} = ${x} : 2 = ${x/2} cm.`);}
function saCt1(){const [P,Q,,M]=sel(SEGS),x=ri(3,20);
  return sq(`Điểm ${M} nằm trên đường trung trực của đoạn thẳng ${P}${Q}. Biết ${M}${P} = ${x} cm. Tính độ dài ${M}${Q} (cm).`,x,`Điểm nằm trên đường trung trực thì cách đều hai mút: ${M}${Q} = ${M}${P} = ${x} cm.`);}
function saCt2(){const [P,Q,,M]=sel(SEGS),x=ri(25,85);
  return sq(`Điểm ${M} nằm trên đường trung trực của đoạn thẳng ${P}${Q} (${M} không thuộc ${P}${Q}). Biết ∠${M}${P}${Q} = ${x}°. Tính số đo ∠${P}${M}${Q} (độ).`,180-2*x,`${M}${P} = ${M}${Q} nên Δ${M}${P}${Q} cân tại ${M}: ∠${M}${Q}${P} = ∠${M}${P}${Q} = ${x}°. Vậy ∠${P}${M}${Q} = 180° − 2 · ${x}° = ${180-2*x}°.`);}
function saCt3(){const [P,Q,,M]=sel(SEGS),x=ri(3,15),y=ri(2,2*x-1);
  return sq(`Điểm ${M} nằm trên đường trung trực của đoạn thẳng ${P}${Q}, ${M}${P} = ${x} cm, ${P}${Q} = ${y} cm. Tính chu vi Δ${M}${P}${Q} (cm).`,2*x+y,`${M}${Q} = ${M}${P} = ${x} cm. Chu vi = ${x} + ${x} + ${y} = ${2*x+y} cm.`);}
function saCt4(){const p=ri(4,12),q=ri(p+2,p+12);
  return sq(`Cho ΔABC có AB = ${p} cm, AC = ${q} cm. Đường trung trực của BC cắt AC tại D (như hình). Tính chu vi ΔABD (cm).`,p+q,`DB = DC (D thuộc đường trung trực của BC). Chu vi ΔABD = AB + AD + DB = AB + AD + DC = AB + AC = ${p} + ${q} = ${p+q} cm.`);}
function saCt5(){const p=ri(4,12),q=ri(p+2,p+12);
  return sq(`Cho ΔABC có AB = ${p} cm. Đường trung trực của BC cắt AC tại D (như hình). Biết chu vi ΔABD bằng ${p+q} cm. Tính độ dài AC (cm).`,q,`DB = DC nên chu vi ΔABD = AB + AD + DB = AB + AD + DC = AB + AC. Vậy AC = ${p+q} − ${p} = ${q} cm.`);}
function saCt6(){const c=ri(20,50),b=ri(c+10,Math.min(110,140-c));
  return sq(`Cho ΔABC có ∠ABC = ${b}°, ∠ACB = ${c}°. Đường trung trực của BC cắt AC tại D (như hình). Tính số đo ∠ABD (độ).`,b-c,`ΔDBC cân tại D (DB = DC) nên ∠DBC = ∠DCB = ${c}°. ∠ABD = ${b}° − ${c}° = ${b-c}°.`,{fig:fb(figTrung(b,c))});}
const FT=()=>fb(figTrung());
[['sa_dn1','dn','NB','cm',saDn1],['sa_dn2','dn','TH','cm',saDn2],['sa_dn3','dn','TH','cm',saDn3],['sa_dn4','dn','VD','cm',saDn4],
 ['sa_tc1','tc','NB','độ',saTc1],['sa_tc2','tc','TH','độ',saTc2],['sa_tc3','tc','TH','độ',saTc3],['sa_tc4','tc','VD','độ',saTc4,{mix:[12],fig:fb(figExt(false))}],['sa_tc5','tc','VD','độ',saTc5,{mix:[12,15],fig:fb(figAlt())}],
 ['sa_tt1','tt','NB','cm',saTt1],['sa_tt2','tt','TH','cm',saTt2],['sa_tt3','tt','VD','cm',saTt3,{mix:[15],fig:fb(figIso({foot:'H',alt:'Tam giác ABC cân tại A, AH vuông góc với BC tại H'}))}],
 ['sa_tt4','tt','VD','cm',saTt4],['sa_ct1','ct','NB','cm',saCt1],['sa_ct2','ct','TH','độ',saCt2],['sa_ct3','ct','TH','cm',saCt3],['sa_ct4','ct','VD','cm',saCt4,{fig:FT()}],['sa_ct5','ct','VD','cm',saCt5,{fig:FT()}],['sa_ct6','ct','VD','độ',saCt6,{fig:FT()}]
].forEach(([id,t,l,u,f,x])=>addSA(id,t,l,u,f,x));

/* ============ Gói Thử thách (30 phút) và gói Toán thực tế ============ */
const mcq=(stem,right,wrongs,exp,topic,level)=>({type:'mc',topic,level,stem,ans:0,opts:[{t:right}].concat(wrongs.map(w=>({t:w[0],err:w[1]}))),exp});
const saq=(stem,ans,unit,exp,topic,level)=>({type:'sa',topic,level,unit,stem,ans:[ans],exp});
const tbl=(head,rows)=>`<table class="dt"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
function tfAlt(){let a;do{a=2*ri(20,38);}while(a===60);const C=(180-a)/2;
  return tfLoop(u=>({stem:`Cho ΔABC cân tại A có ∠A = ${a}°, BH ⊥ AC tại H, CK ⊥ AB tại K (như hình).`,fig:fb(figAlt(a)),items:[
    IT(u[0],'ΔBHC = ΔCKB theo trường hợp cạnh huyền – góc nhọn.','ΔBHC = ΔCKB theo trường hợp hai cạnh góc vuông.','tc','TH','Hai tam giác vuông BHC (vuông tại H) và CKB (vuông tại K) có cạnh huyền BC chung và ∠HCB = ∠KBC (hai góc ở đáy của ΔABC).','Chưa biết hai cặp cạnh góc vuông bằng nhau; dùng cạnh huyền BC chung và góc nhọn ∠HCB = ∠KBC.'),
    IT(u[1],'BH = CK.','BH = BC.','tc','TH','ΔBHC = ΔCKB nên BH = CK (hai cạnh tương ứng).','BH là cạnh góc vuông, BC là cạnh huyền của ΔBHC; hai cạnh này không bằng nhau. Điều đúng là BH = CK.'),
    IT(u[2],`∠HBC = ${a/2}°.`,`∠HBC = ${C}°.`,'tc','VD',`∠C = (180° − ${a}°) : 2 = ${C}°, ∠HBC = 90° − ${C}° = ${a/2}°.`,`${C}° là số đo ∠C; ∠HBC = 90° − ${C}° = ${a/2}°.`),
    IT(u[3],'AK = AH.','AK = KB.','tc','VD','ΔBHC = ΔCKB nên CH = BK; AB = AC nên AK = AB − BK = AC − CH = AH.','Không có cơ sở để AK = KB (K nói chung không phải trung điểm AB); điều đúng là AK = AH.')]}));}
const HARD={tf:[{id:'h_alt',type:'tf',topic:'tc',level:'VD',mix:[15],fig:fb(figAlt()),gen:tfAlt}],sa:[
 {id:'h_ext',topic:'tc',level:'VD',unit:'độ',mix:[12],fig:fb(figExt(true)),gen:()=>{const a=4*ri(5,35),B=(180-a)/2,d=B/2;return{stem:`Cho ΔABC cân tại A có ∠BAC = ${a}°. Trên tia đối của tia BC lấy điểm D sao cho BD = BA, trên tia đối của tia CB lấy điểm E sao cho CE = CA (như hình). Tính số đo ∠DAE (độ).`,ans:[180-2*d],exp:`∠ABC = ∠ACB = (180° − ${a}°) : 2 = ${B}°. ∠ABD = 180° − ${B}° = ${180-B}°; ΔABD cân tại B nên ∠ADB = (180° − ${180-B}°) : 2 = ${d}°. Tương tự ∠AEC = ${d}°. Trong ΔADE: ∠DAE = 180° − ${d}° − ${d}° = ${180-2*d}°.`,fig:fb(figExt(true,a))};}},
 {id:'h_per',topic:'ct',level:'VD',unit:'cm',fig:fb(figTrung()),gen:()=>{const p=ri(4,12),r=ri(p+2,p+12),q=ri(r-p+1,r+p-1);return{stem:`Cho ΔABC có BC = ${q} cm. Đường trung trực của BC cắt cạnh AC tại D (như hình). Biết chu vi ΔABD bằng ${p+r} cm. Tính chu vi ΔABC (cm).`,ans:[p+r+q],exp:`DB = DC nên chu vi ΔABD = AB + AD + DB = AB + AD + DC = AB + AC = ${p+r} cm. Chu vi ΔABC = AB + AC + BC = ${p+r} + ${q} = ${p+r+q} cm.`};}},
 {id:'h_obt',topic:'ct',level:'VD',unit:'độ',fig:fb(figObt()),gen:()=>{const a=2*ri(50,80),B=(180-a)/2;return{stem:`Cho ΔABC cân tại A có ∠BAC = ${a}°. Đường trung trực của AB đi qua trung điểm M của AB và cắt cạnh BC tại D (như hình). Tính số đo ∠DAC (độ).`,ans:[a-B],exp:`∠B = (180° − ${a}°) : 2 = ${B}°. D nằm trên đường trung trực của AB nên DA = DB, ΔDAB cân tại D: ∠DAB = ∠B = ${B}°. Vậy ∠DAC = ∠BAC − ∠DAB = ${a}° − ${B}° = ${a-B}°.`};}},
 {id:'h_mid',topic:'tc',level:'VD',unit:'độ',mix:[12],fig:fb(figMid()),gen:()=>{const b=ri(20,70),c=90-b;return{stem:`Cho ΔABC có M là trung điểm của BC, MA = MB (như hình) và ∠ABC = ${b}°. Tính số đo ∠MAC (độ).`,fig:fb(figMid(b)),ans:[c],exp:`MA = MB = MC. ΔMAB cân tại M nên ∠MAB = ∠B; ΔMAC cân tại M nên ∠MAC = ∠C. Suy ra ∠BAC = ∠B + ∠C, mà ∠BAC + ∠B + ∠C = 180° nên ∠BAC = 90°. Vậy ∠C = 180° − 90° − ${b}° = ${c}° và ∠MAC = ∠C = ${c}°.`};}},
 {id:'h_bd',topic:'tc',level:'VD',unit:'độ',fig:fb(figBD()),gen:()=>{const a=2*ri(10,28),C=(180-a)/2,z=C-a;return{stem:`Cho ΔABC cân tại A có ∠A = ${a}°. Lấy điểm D trên cạnh AC sao cho BD = BC (như hình). Tính số đo ∠ABD (độ).`,ans:[z],exp:`∠ABC = ∠C = (180° − ${a}°) : 2 = ${C}°. ΔBDC cân tại B (BD = BC) nên ∠BDC = ∠C = ${C}° và ∠DBC = 180° − 2 · ${C}° = ${180-2*C}°. Vậy ∠ABD = ∠ABC − ∠DBC = ${C}° − ${180-2*C}° = ${z}°.`};}}
].map(q=>Object.assign({type:'sa'},q))};

const PISA=[
 ()=>{const [hw,h,L]=sel([[3,4,5],[4,3,5],[6,8,10],[8,6,10]]),w=2*hw;
  return {title:'Ngôi nhà mái chữ A',fig:fb(figIso({foot:'H',alt:'Mặt trước ngôi nhà là tam giác ABC cân tại A, AH vuông góc với nền BC tại H'})),ctx:`<p class="stem">Kiến trúc sư vẽ mặt trước của một ngôi nhà mái chữ A là tam giác ABC: BC là nền nhà rộng ${w} m, hai mái AB = AC = ${L} m, đỉnh A cao ${h} m so với nền. Bản vẽ theo tỉ lệ 1 : 100.</p>`,qs:[
   mcq('Trên bản vẽ, để vẽ chính xác đỉnh A, kiến trúc sư cần dựa vào đường thẳng nào?','Đường trung trực của đoạn thẳng BC',[['Đường thẳng vuông góc với BC tại B','AB = AC nên A cách đều B và C; A nằm trên đường thẳng vuông góc với BC tại trung điểm, không phải tại B.'],['Đường thẳng BC','Đỉnh A cao hơn nền nên không nằm trên đường thẳng BC.'],['Đường thẳng đi qua C và vuông góc với AC','Không có cơ sở; AB = AC nên A nằm trên đường trung trực của BC.']],'Hai mái bằng nhau: AB = AC, nên A cách đều B và C. Điểm cách đều hai mút của đoạn thẳng thì nằm trên đường trung trực của đoạn thẳng đó. Vậy kẻ đường trung trực của BC rồi lấy A trên đó với độ cao đúng tỉ lệ.','ct','TH'),
   saq('Trên bản vẽ, đoạn BC dài bao nhiêu xăng-ti-mét?',w,'cm',`${w} m = ${100*w} cm. Tỉ lệ 1 : 100 nên trên bản vẽ BC dài ${100*w} : 100 = ${w} cm.`,'dn','TH'),
   saq('Gọi H là chân đường vuông góc kẻ từ A xuống nền BC. Trên thực tế, điểm H cách B bao nhiêu mét?',hw,'m',`ΔAHB = ΔAHC (cạnh huyền AB = AC, cạnh góc vuông AH chung) nên HB = HC: H là trung điểm của BC (AH là đường trung trực của BC). HB = ${w} : 2 = ${hw} m.`,'tt','VD'),
   saq('Người ta treo dây đèn dọc theo hai mái và mép nền (các cạnh AB, AC, BC). Cần bao nhiêu mét dây đèn?',2*L+w,'m',`Chu vi ΔABC = ${L} + ${L} + ${w} = ${2*L+w} m.`,'dn','VD')
 ]};},
 ()=>{let x;do{x=ri(30,75);}while(x===60);const m=ri(3,9),k=sel([150,200,250,300]);
  return {title:'Trạm y tế cách đều hai thôn',ctx:`<p class="stem">Hai thôn A và B nằm cùng một phía của quốc lộ thẳng d. Xã muốn đặt trạm y tế M trên quốc lộ d sao cho trạm cách đều hai thôn, rồi làm hai con đường thẳng MA và MB nối trạm với hai thôn.</p>`,qs:[
   mcq('Vị trí của trạm y tế M được xác định như thế nào?','Giao điểm của quốc lộ d với đường trung trực của đoạn thẳng AB',[['Trung điểm của đoạn thẳng AB','Trung điểm của AB cách đều A và B nhưng không nằm trên quốc lộ d.'],['Một điểm bất kì trên quốc lộ d','Một điểm bất kì trên d thường không cách đều A và B.'],['Chân đường vuông góc kẻ từ B đến quốc lộ d','Điểm này gần B nhất trên quốc lộ, thường không cách đều A và B.']],'M cách đều A và B nên M nằm trên đường trung trực của AB; M lại nằm trên d. Vậy M là giao điểm của d và đường trung trực của AB.','ct','TH'),
   saq(`Đường MA dài ${m} km. Đường MB dài bao nhiêu ki-lô-mét?`,m,'km',`M nằm trên đường trung trực của AB nên MB = MA = ${m} km.`,'ct','NB'),
   saq(`Đường MA tạo với đoạn thẳng AB một góc ∠MAB = ${x}°. Tính số đo góc ∠AMB.`,180-2*x,'độ',`ΔMAB cân tại M (MA = MB) nên ∠MBA = ∠MAB = ${x}°. Vậy ∠AMB = 180° − 2 · ${x}° = ${180-2*x}°.`,'ct','VD'),
   saq(`Mỗi ki-lô-mét đường hết ${k} triệu đồng. Làm cả hai đường MA và MB hết bao nhiêu triệu đồng?`,2*m*k,'triệu đồng',`Hai đường dài ${m} + ${m} = ${2*m} km. Chi phí: ${2*m} · ${k} = ${2*m*k} triệu đồng.`,'ct','VD')
 ]};},
 ()=>{const a=sel([50,60,70,80,90]),L=sel([5,6,8,10]),n=Math.floor(100*L/(3*a));
  return {title:'Khung biển báo tam giác đều',fig:fb(figIso({eq:true,legs:1,lab:['A','B','C'],alt:'Khung biển báo hình tam giác đều ABC'})),ctx:`<p class="stem">Biển báo nguy hiểm có khung là một tam giác đều ABC, mỗi cạnh dài ${a} cm. Khung được uốn từ những thanh nhôm dài ${L} m.</p>`,qs:[
   mcq('Mỗi góc của khung biển báo bằng bao nhiêu độ?','60°',[['90°','Tam giác đều không có góc vuông.'],['45°','45° là góc nhọn của tam giác vuông cân.'],['180°','180° là tổng ba góc của tam giác.']],'Tam giác đều có ba góc bằng nhau, tổng ba góc bằng 180° nên mỗi góc bằng 180° : 3 = 60°.','tc','NB'),
   saq('Mỗi khung cần bao nhiêu xăng-ti-mét nhôm?',3*a,'cm',`Chu vi tam giác đều = 3 · ${a} = ${3*a} cm.`,'dn','TH'),
   saq(`Từ một thanh nhôm dài ${L} m, uốn được nhiều nhất bao nhiêu khung (mỗi khung uốn liền từ một đoạn nhôm)?`,n,'khung',`${L} m = ${100*L} cm. ${100*L} : ${3*a} được ${n}${100*L%(3*a)?`, dư ${100*L%(3*a)} cm`:''}. Vậy uốn được nhiều nhất ${n} khung.`,'dn','VD'),
   Object.assign(saq('Người ta gắn thêm một thanh giằng nối đỉnh A với trung điểm H của cạnh BC. Tính số đo ∠BAH.',30,'độ','ΔABH và ΔACH có AB = AC, HB = HC, AH chung nên ΔABH = ΔACH (c.c.c). Suy ra ∠BAH = ∠CAH = 60° : 2 = 30°.','tc','VD'),{mix:[13]})
 ]};},
 ()=>{const c=2*ri(15,35),d=2*ri(3,8),e=sel([10,20]);
  return {title:'Thang gấp chữ A',fig:fb(figIso({foot:'H',alt:'Thang chữ A: hai chân AB và AC dài bằng nhau, dây dọi AH vuông góc với mặt sàn'})),ctx:`<p class="stem">Một chiếc thang gấp chữ A có hai chân AB = AC đặt trên mặt sàn phẳng. Khi mở thang, góc giữa hai chân là ∠BAC = ${c}° và hai chân cách nhau BC = ${d} dm. Từ đỉnh A thả một dây dọi, chạm sàn tại H (AH ⊥ BC).</p>`,qs:[
   mcq('Vì sao hai chân thang tạo với mặt sàn hai góc bằng nhau?','Vì AB = AC nên ΔABC cân tại A, hai góc ở đáy bằng nhau',[['Vì ∠BAC nhỏ hơn 90°','Độ lớn của ∠BAC không giải thích được vì sao hai góc ở đáy bằng nhau.'],['Vì dây dọi AH vuông góc với mặt sàn','Điều này đúng nhưng không phải lí do chính; lí do là hai chân thang dài bằng nhau.'],['Vì AB vuông góc với AC','∠BAC = '+c+'°, nên AB không vuông góc với AC.']],'Hai chân thang dài bằng nhau nên ΔABC cân tại A, do đó ∠ABC = ∠ACB.','tc','TH'),
   saq('Mỗi chân thang tạo với mặt sàn một góc bao nhiêu độ?',(180-c)/2,'độ',`∠ABC = ∠ACB = (180° − ${c}°) : 2 = ${(180-c)/2}°.`,'tc','TH'),
   saq('Điểm H cách chân thang B bao nhiêu đề-xi-mét?',d/2,'dm',`ΔAHB = ΔAHC (cạnh huyền AB = AC, cạnh góc vuông AH chung) nên HB = HC = ${d} : 2 = ${d/2} dm.`,'tt','VD'),
   saq(`Mở rộng thang thêm để ∠BAC tăng thêm ${e}°. Khi đó góc giữa mỗi chân thang và mặt sàn giảm đi bao nhiêu độ?`,e/2,'độ',`Lúc đầu mỗi góc ở đáy bằng (180° − ${c}°) : 2 = ${(180-c)/2}°. Sau khi mở: (180° − ${c+e}°) : 2 = ${(180-c-e)/2}°. Góc giảm đi ${(180-c)/2}° − ${(180-c-e)/2}° = ${e/2}°.`,'tc','VD')
 ]};}
];

const BANK={mc:MC,tf:TF,sa:SA};
const TF_SCORE=[0,0.1,0.25,0.5,1];
const TYPES=['mc','tf','sa'];
const RECAP=[
  {k:'dn',fig:fb(figIso({tA:'góc ở đỉnh',alt:'Tam giác ABC cân tại A, AB bằng AC'})),extra:'ΔABC cân tại A: AB = AC là hai cạnh bên, BC là cạnh đáy. Tam giác đều: ba cạnh bằng nhau. Tam giác vuông cân: tam giác vuông có hai cạnh bằng nhau.'},
  {k:'tc',fig:fb(figIso({arcs:true,alt:'Tam giác ABC cân tại A có hai góc ở đáy B và C bằng nhau'})),extra:'∠B = ∠C. Góc ở đáy = (180° − ∠A) : 2; ∠A = 180° − 2 · ∠B. Tam giác đều có mỗi góc 60°; tam giác vuông cân có hai góc nhọn bằng 45°.'},
  {k:'tt',fig:fb(figPB({seg:false,alt:'Đường thẳng d vuông góc với đoạn thẳng AB tại trung điểm O'})),extra:'Vẽ bằng thước và compa: hai cung tròn tâm A, tâm B cùng bán kính lớn hơn AB/2 cắt nhau tại M, N; đường thẳng MN là đường trung trực của AB.'},
  {k:'ct',fig:fb(figPB({alt:'Điểm M trên đường trung trực d của AB, MA bằng MB'})),extra:'M ∈ d thì MA = MB; ngược lại MA = MB thì M ∈ d. Khi M không thuộc AB, ΔMAB cân tại M.'}
];

/* ============ Trạng thái ============ */
const state={view:'home',name:'',stu:null,ans:{},pr:{},perm:{},result:null,topicPct:{},weak:[],t0:0,elapsed:0,timedOut:false,code:'',cls:''};
const LIMIT={test:25*60,quick:5*60,hard:30*60};
const SEEN_KEY='cn7_seen';
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
  const mcSlots=[['dn',['NB','TH']],['tc',['NB','TH']],['tc',['TH','VD']],['tt',['NB','TH']],['ct',['NB','TH']],['ct',['TH','VD']]];
  const mc=mcSlots.map(([t,l])=>pick(MC.filter(q=>q.topic===t&&l.includes(q.level)),used));
  const tf=['tc','tt','ct'].map(t=>pick(TF.filter(q=>q.topic===t&&q.level!=='NB'),used));
  const sa=TKEYS.map(t=>pick(SA.filter(q=>q.topic===t&&q.level!=='NB'),used));
  makeSession('test',null,'Bài kiểm tra',{mc,tf,sa});
}
function buildQuick(){
  const used=new Set(),t1=sel(['dn','tc']),t2=sel(['tt','ct']);
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
