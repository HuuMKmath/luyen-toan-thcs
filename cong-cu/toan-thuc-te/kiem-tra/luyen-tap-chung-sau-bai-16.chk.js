// Luyện tập chung (sau Bài 16), Toán 7: tính lại đáp án từ số liệu trong tình huống (dựng lại hình bằng toạ độ khi cần)
const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
const ang=(P,V,Q)=>{const a=[P[0]-V[0],P[1]-V[1]],b=[Q[0]-V[0],Q[1]-V[1]];return deg(Math.acos((a[0]*b[0]+a[1]*b[1])/Math.hypot(...a)/Math.hypot(...b)));};
module.exports={
 'Đo khoảng cách qua hồ':(u,U)=>{const c=U.txt(u.ctx),ca=+c.match(/CA = (\d+) m/)[1],cb=+c.match(/CB = (\d+) m/)[1],de=+c.match(/DE = (\d+) m/)[1];
   if(!(de<ca+cb&&de>Math.abs(ca-cb)))throw new Error('ba cạnh không tạo thành tam giác');
   return [(R)=>/c\.g\.c/.test(R)&&/đối đỉnh/.test(R),de,ca+ca,ca+cb+de];},
 'Cột cờ và dây néo':(u,U)=>{const c=U.txt(u.ctx),a=+c.match(/góc (\d+)°/)[1],L=+c.match(/dài (\d+) m/)[1];
   const H=[0,0],B=[-1,0],C=[1,0],A=[0,Math.tan(rad(a))];
   return [(R)=>/hai cạnh góc vuông/.test(R),Math.round(ang(A,C,B)),Math.round(ang(B,A,C)),2*(L+0.5+0.5)];},
 'Làm khung con diều':(u,U)=>{const c=U.txt(u.ctx),ab=+c.match(/AB = AD = (\d+) cm/)[1],bc=+c.match(/CB = CD = (\d+) cm/)[1],bd=+c.match(/BD dài (\d+) cm/)[1];
   if(!(bd<2*ab&&bd<2*bc))throw new Error('BD quá dài');
   return [(R)=>/trung trực của BD/.test(R),bd/2,'∠ABC = ∠ADC',ab*2+bc*2+bd];},
 'Hàng rào cách đều hai giếng':(u,U)=>{const c=U.txt(u.ctx),d=+c.match(/cách nhau (\d+) m/)[1],x=+c.match(/∠MAB = (\d+)°/)[1],k=U.ints(u.qs[3].stem)[0];
   const A=[0,0],B=[d,0],M=[d/2,d/2*Math.tan(rad(x))];
   return [(R)=>/trung trực/.test(R),d/2,Math.round(ang(A,M,B)),(d/2)/k+1];}
};
