// Bài tập cuối chương IV, Toán 7: tính lại đáp án từ số liệu trong tình huống (dựng lại hình bằng toạ độ)
const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
const ang=(P,V,Q)=>{const a=[P[0]-V[0],P[1]-V[1]],b=[Q[0]-V[0],Q[1]-V[1]];return deg(Math.acos((a[0]*b[0]+a[1]*b[1])/Math.hypot(...a)/Math.hypot(...b)));};
const dist=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);
const r6=x=>Math.round(x*1e6)/1e6;
module.exports={
 'Vì kèo mái nhà':(u,U)=>{const c=U.txt(u.ctx),z=+c.match(/∠ABC = (\d+)°/)[1],w=+c.match(/BC dài (\d+) m/)[1]/2;
   const B=[-w,0],C=[w,0],A=[0,w*Math.tan(rad(z))],H=[0,0];
   return [r6(ang(A,C,B)),r6(ang(B,A,C)),R=>/cạnh huyền – cạnh góc vuông/.test(R),r6(ang(B,A,H))];},
 'Bóng của hai cột đèn':(u,U)=>{const c=U.txt(u.ctx),h=+c.match(/cùng cao (\d+) m/)[1],s=+c.match(/dài (\d+) m\./)[1];
   // dựng hai cột cùng cao h, cùng góc nắng (theo bóng s của cột 1): bóng cột 2 đo được
   const B=[0,0],A=[0,h],C=[s,0],a=ang(B,A,C),E=[9,0],D=[9,h],F=[9+h*Math.tan(rad(a)),0];
   return [R=>/Cạnh góc vuông – góc nhọn kề/.test(R),r6(dist(E,F)),Math.abs(ang(A,C,B)-ang(D,F,E))<1e-9?'∠ACB = ∠DFE':'?',r6(h*Math.tan(rad(45)))];},
 'Thang chữ A':(u,U)=>{const c=U.txt(u.ctx),k=+c.match(/∠ABC = (\d+)°/)[1];
   const B=[-1,0],C=[1,0],A=[0,Math.tan(rad(k))],D=[A[0]+(B[0]-A[0])*.4,A[1]+(B[1]-A[1])*.4],E=[A[0]+(C[0]-A[0])*.4,A[1]+(C[1]-A[1])*.4];
   return [r6(ang(B,A,C)),r6(ang(A,D,E)),R=>/đồng vị/.test(R),Math.abs(dist(D,C)-dist(E,B))<1e-9?'DC = EB':'?'];},
 'Gấp tờ giấy hình tam giác':(u,U)=>{const c=U.txt(u.ctx),ab=+c.match(/AB = (\d+) cm/)[1],ad=+c.match(/AD = (\d+) cm/)[1],dc=+c.match(/DC = (\d+) cm/)[1];
   // dựng ΔABD với BD = DC, kéo dài AD một đoạn DC được C; kiểm tra trung trực của BC đi qua D
   if(!(ab<ad+dc&&ad<ab+dc&&dc<ab+ad))throw new Error('ΔABD không tồn tại');
   const A=[0,0],D=[ad,0],x=(ab*ab-dc*dc+ad*ad)/(2*ad),B=[x,Math.sqrt(ab*ab-x*x)],C=[ad+dc,0],M=[(B[0]+C[0])/2,(B[1]+C[1])/2];
   const dot=(D[0]-M[0])*(C[0]-B[0])+(D[1]-M[1])*(C[1]-B[1]);if(Math.abs(dot)>1e-9)throw new Error('D không nằm trên trung trực BC');
   return [R=>/trung trực/.test(R),r6(dist(D,B)),Math.abs(ang(D,B,C)-ang(D,C,B))<1e-9?'∠DBC = ∠DCB':'?',r6(dist(A,B)+dist(A,D)+dist(D,B))];}
};
