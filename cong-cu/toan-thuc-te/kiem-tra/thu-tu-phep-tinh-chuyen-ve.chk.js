module.exports={
'Đi xem phim':(u,U)=>{const [a,b,c,p,q,r]=U.ints(u.ctx);const s3=U.ints(u.qs[2].stem),d=s3[0];const s4=U.ints(u.qs[3].stem),M=s4[0],e=s4[1],f=s4[2];
  const tot=a*p+b*q+c*r;let x=0;while(tot+e*x+f<M)x++;if(tot+e*x+f!==M)throw new Error('không tròn');
  return [`${p} · ${a} + ${q} · ${b} + ${r} · ${c}`,tot,(a-d)*p+(b-d)*q+c*r,x];},
'Để dành tiền mua xe đạp':(u,U)=>{const [P,a,b]=U.ints(u.ctx);const w=U.ints(u.qs[0].stem)[0];const c=U.ints(u.qs[3].stem)[0];
  let x=0;while(a+b*x<P)x++;let y=0;while(a+(b+c)*y<P)y++;return [a+b*w,`${a} + ${b} · x = ${P}`,x,y];}
};
